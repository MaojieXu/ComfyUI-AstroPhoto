"""Persistent jobs and cross-process execution leases."""

import errno
import logging
from time import time_ns
from threading import Lock
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4

from filelock import FileLock, Timeout
from sqlalchemy import func, or_, select

from ..core.errors import StorageError
from ..database.models import StorageOperation
from .locations import TERMINAL
from .paths import checked_path

logger = logging.getLogger(__name__)


class Operations:
    def __init__(self, runtime):
        self.runtime = runtime
        self.db = runtime.db
        self._scheduled = set()
        self._retry_after_run = set()
        self._schedule_lock = Lock()
        self.pool = ThreadPoolExecutor(max_workers=2, thread_name_prefix="astrophoto-storage")

    def find(self, kind, key, request):
        if not isinstance(key, str) or not 1 <= len(key) <= 128:
            raise StorageError("INVALID_IDEMPOTENCY_KEY")
        with self.db.session() as session:
            operation = session.scalar(select(StorageOperation).where(
                StorageOperation.kind == kind, StorageOperation.key == key
            ))
            if operation and operation.request != request:
                raise StorageError("IDEMPOTENCY_CONFLICT")
            return operation

    def create(self, kind, key, request, plan):
        with self.db.session() as session:
            if session.scalar(select(func.count()).select_from(StorageOperation).where(
                StorageOperation.phase.not_in(TERMINAL)
            )) >= 16:
                raise StorageError("STORAGE_BUSY")
            operation = StorageOperation(id=str(uuid4()), kind=kind, key=key, phase="queued",
                                         request=request, plan=plan, receipt={}, created_ns=time_ns())
            session.add(operation)
        return operation

    def get(self, operation_id, kind=None):
        with self.db.session() as session:
            operation = session.get(StorageOperation, operation_id)
            if operation is None or kind is not None and operation.kind != kind:
                raise StorageError("OPERATION_NOT_FOUND")
            return operation

    def status(self, operation_id, kind):
        row = self.get(operation_id, kind)
        receipt = {key: value for key, value in row.receipt.items() if not key.startswith("_")}
        if kind == "import" and row.phase in TERMINAL:
            receipt["retryable"] = len(self.runtime.imports.retryable(row))
        if kind == "migration" and row.phase in {"failed", "cancelled"} and "target_workspace_id" not in row.plan:
            receipt["target_cleanup_available"] = "files" in row.plan
        return {"operation_id": row.id, "kind": row.kind, "phase": row.phase,
                "effective_import_mode": row.plan.get("effective_import_mode"),
                "workspace_id": row.plan.get("workspace_id"), "receipt": receipt,
                "cancel_requested": row.cancel_requested, "error": {"code": row.error} if row.error else None}

    def recent(self):
        with self.db.session() as session:
            rows = session.scalars(select(StorageOperation).order_by(StorageOperation.phase.in_(TERMINAL), StorageOperation.created_ns.desc()).limit(16))
            return [{"operation_id": row.id, "kind": row.kind, "phase": row.phase} for row in rows]

    def advance(self, operation_id, **changes):
        with self.db.session() as session:
            row = session.get(StorageOperation, operation_id)
            for key, value in changes.items():
                setattr(row, key, value)

    def cancel(self, operation_id, kind):
        row = self.get(operation_id, kind)
        if row.phase not in TERMINAL and row.phase != "committed":
            self.advance(operation_id, cancel_requested=True)
            self.submit(operation_id)
        return self.status(operation_id, kind)

    def retry(self, operation_id, kind):
        row = self.get(operation_id, kind)
        if row.kind == "import" and row.receipt.get("cleanup_pending"):
            self._recover_import(row)
        elif row.phase not in TERMINAL:
            self.advance(operation_id, error=None)
            self.submit(operation_id, retry=True)
        return self.status(operation_id, kind)

    def checkpoint(self, operation_id):
        if self.get(operation_id).cancel_requested:
            raise StorageError("OPERATION_CANCELLED")

    def submit(self, operation_id, *, retry=False):
        with self._schedule_lock:
            if operation_id in self._scheduled:
                if retry:
                    self._retry_after_run.add(operation_id)
                return
            self._scheduled.add(operation_id)
            try:
                future = self.pool.submit(self.run, operation_id)
            except RuntimeError:
                self._scheduled.discard(operation_id)
                raise
        future.add_done_callback(lambda _future: self._done(operation_id))

    def _done(self, operation_id):
        with self._schedule_lock:
            self._scheduled.discard(operation_id)
            retry = operation_id in self._retry_after_run
            self._retry_after_run.discard(operation_id)
        if retry and not self.runtime.closing.is_set():
            self.submit(operation_id)

    def recover(self):
        with self.db.session() as session:
            operations = list(session.scalars(select(StorageOperation).where(
                or_(StorageOperation.phase.not_in(TERMINAL),
                    StorageOperation.receipt["cleanup_pending"].as_boolean().is_(True)))))
        for operation in operations:
            if operation.kind == "migration":
                self.submit(operation.id)
                continue
            self._recover_import(operation)

    def _recover_import(self, operation):
        try:
            self.runtime.imports.recover_interrupted(operation)
        except (StorageError, OSError) as exc:
            self.advance(operation.id, phase="cancelled", error="RECOVERY_REQUIRED",
                         receipt={**operation.receipt, "cleanup_pending": True})
            logger.warning("Interrupted import %s requires cleanup: %s", operation.id, exc)

    def close(self):
        with self.db.session() as session:
            rows = session.scalars(select(StorageOperation).where(
                StorageOperation.kind == "import", StorageOperation.phase.not_in(TERMINAL)))
            for row in rows:
                row.cancel_requested = True
        self.pool.shutdown()
        with self.db.session() as session:
            unfinished = list(session.scalars(select(StorageOperation).where(
                StorageOperation.kind == "import", StorageOperation.phase.not_in(TERMINAL))))
        for row in unfinished:
            self._recover_import(row)

    def run(self, operation_id):
        try:
            lock = FileLock(checked_path(self.runtime.root / "runtime/locks" / f"operation-{operation_id}.lock"), timeout=0)
            with lock:
                row = self.get(operation_id)
                if row.phase in TERMINAL:
                    return
                worker = self.runtime.imports if row.kind == "import" else self.runtime.migrations
                try:
                    worker.run(row)
                except Exception as exc:
                    code = exc.code if isinstance(exc, StorageError) else "INTERNAL_STORAGE_ERROR"
                    if isinstance(exc, OSError):
                        if exc.errno == errno.ENOSPC or getattr(exc, "winerror", 0) == 112:
                            code = "INSUFFICIENT_DISK_SPACE"
                        elif exc.errno in {errno.EACCES, errno.EPERM, errno.EROFS}:
                            code = "STORAGE_PATH_UNWRITABLE"
                    if not isinstance(exc, StorageError):
                        logger.exception("Storage operation %s failed", operation_id)
                    current = self.get(operation_id)
                    # Once a root switch or a file publication may have happened, retain its checkpoint.
                    # Same-key retry and startup recovery use the durable plan.
                    if code == "OPERATION_CANCELLED" and current.phase != "committed":
                        self.advance(operation_id, phase="cancelled", error=code)
                    elif (current.phase in {"committed", "publishing"}
                          or code in {"STORAGE_BUSY", "INTERNAL_STORAGE_ERROR", "WORKSPACE_OFFLINE", "WORKSPACE_READ_ONLY"}
                          or current.phase == "copying" and code in {"FILE_COPY_FAILED", "INSUFFICIENT_DISK_SPACE", "STORAGE_PATH_UNWRITABLE"}):
                        self.advance(operation_id, error=code)
                    else:
                        self.advance(operation_id, phase="failed", error=code)
        except Timeout:
            return
        except Exception:
            logger.exception("Cannot reconcile AstroPhoto operation %s", operation_id)

