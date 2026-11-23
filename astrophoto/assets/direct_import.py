"""Manifest and per-file receipts for browser imports written directly to managed storage."""

import errno
import logging
import os
from collections import Counter
from contextlib import ExitStack, contextmanager
from threading import Condition, Event
from time import time, time_ns
from uuid import uuid4

from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError

from ..core.config import load_storage_settings
from ..core.errors import StorageError
from ..database.library_models import LibraryRecord
from ..database.models import Asset, AssetLocation
from ..storage.import_planner import (
    PhysicalWriters, fit_managed_key, managed_relative_key, plan_import, validate_import_filename,
    validate_managed_path_length,
)
from ..storage.manager import publish_object, remove_stage, source_stat
from ..storage.paths import safe_join_workspace
from .import_groups import create_group, link_frame
from .imports import MAX_FILES
from .library_rules import identifier, properties

PREVIEW = "direct_import_preview"
JOB = "direct_import"
ENTRY = "direct_import_entry"
MAX_SIZE = 2**53 - 1
REJECTED_PUBLICATION = {
    "OBJECT_CONFLICT", "COPY_VERIFY_FAILED", "INSUFFICIENT_DISK_SPACE",
    "WORKSPACE_QUOTA_EXCEEDED", "VOLUME_QUOTA_EXCEEDED", "INVALID_STORAGE_PATH",
    "LIBRARY_RECORD_NOT_FOUND", "INVALID_LIBRARY_REFERENCE", "INVALID_CALIBRATION_MASTER", "ASSET_NOT_FOUND",
}
logger = logging.getLogger(__name__)


def record(session, key, kind):
    row = session.get(LibraryRecord, identifier(key))
    if row is None or row.kind != kind:
        raise StorageError("PREVIEW_EXPIRED" if kind == PREVIEW else "OPERATION_NOT_FOUND")
    return row


def job_entries(job_id):
    return select(LibraryRecord).where(
        LibraryRecord.kind == ENTRY, LibraryRecord.data["job_id"].as_string() == job_id,
    )


def get_entry(session, job_id, entry_id):
    row = record(session, entry_id, ENTRY)
    if row.data["job_id"] != job_id:
        raise StorageError("OPERATION_NOT_FOUND")
    return row


def active(job):
    if job.data["phase"] != "importing" or job.data.get("cancel_requested"):
        raise StorageError("OPERATION_CANCELLED")


def checked_manifest(files):
    if not isinstance(files, list) or not 1 <= len(files) <= MAX_FILES:
        raise StorageError("INVALID_SOURCES")
    for item in files:
        if not isinstance(item, dict) or item.keys() - {"name", "size_bytes", "last_modified_ms"}:
            raise StorageError("INVALID_REQUEST")
        validate_import_filename(item.get("name"))
        size = item.get("size_bytes")
        if type(size) is not int or not 0 <= size <= MAX_SIZE:
            raise StorageError("INVALID_REQUEST")
        if "last_modified_ms" in item and (type(item["last_modified_ms"]) is not int
                                            or abs(item["last_modified_ms"]) > MAX_SIZE):
            raise StorageError("INVALID_REQUEST")
    return files


def allocation(files, targets):
    by_workspace = {}
    for file, target in zip(files, targets, strict=True):
        counts = by_workspace.setdefault(target["workspace_id"], {**target, "file_count": 0, "size_bytes": 0})
        counts["file_count"] += 1
        counts["size_bytes"] += file["size_bytes"]
    return list(by_workspace.values())


def identity(path):
    info = source_stat(path)
    if info.st_nlink != 1:
        raise StorageError("OBJECT_CONFLICT")
    return [info.st_size, info.st_mtime_ns, info.st_dev, info.st_ino]


class DirectImportService:
    def __init__(self, runtime):
        self.runtime = runtime
        self.db = runtime.db
        self.registry = runtime.workspaces
        self.writers = PhysicalWriters()
        self._active = {}
        self._guard = Condition()

    def close(self):
        with self._guard:
            for _, cancelled in self._active.values():
                cancelled.set()
            self._guard.wait_for(lambda: not self._active)

    def transfer_cancelled(self, entry_id):
        with self._guard:
            transfer = self._active.get(entry_id)
            return transfer is not None and transfer[1].is_set()

    def active_job_ids(self):
        with self._guard:
            return {job_id for job_id, _ in self._active.values()}

    def recover(self):
        """Reconcile durable write intents before the host accepts new requests."""
        with self.db.session() as session:
            cancelled = set(session.scalars(select(LibraryRecord.id).where(
                LibraryRecord.kind == JOB,
                LibraryRecord.data["phase"].as_string() == "importing",
                LibraryRecord.data["cancel_requested"].as_boolean().is_(True),
            )))
            writing = list(session.scalars(select(LibraryRecord).where(
                LibraryRecord.kind == ENTRY, LibraryRecord.data["writing"].as_boolean().is_(True),
            )))
        for job_id in cancelled:
            try:
                self.cancel(job_id)
            except (OSError, StorageError):
                logger.warning("Could not reconcile cancelled direct import %s", job_id, exc_info=True)
        for row in writing:
            data = row.data
            job_id = data["job_id"]
            if job_id in cancelled:
                continue
            try:
                with self.registry.lease(data["workspace_id"]):
                    root = self.registry.require(data["workspace_id"])
                    expected = self._recoverable_bytes(job_id, row.id, root, data)
                    if expected is not None:
                        with self._reserve(job_id, row.id, root, 0, data["size_bytes"]) as reservation:
                            self._publish(job_id, row.id, root, reservation, expected)
            except StorageError as exc:
                self._failure(job_id, row.id, exc.code)
                logger.warning("Could not reconcile direct import frame %s", row.id, exc_info=True)
            except OSError:
                logger.warning("Could not reconcile direct import frame %s", row.id, exc_info=True)

    def _settings(self, revision):
        settings = load_storage_settings(self.runtime.root)
        if type(revision) is not int or settings["revision"] != revision:
            raise StorageError("REVISION_CONFLICT")
        if settings["imports"]["default_mode"] != "copy":
            raise StorageError("INVALID_SOURCES")

    def preview(self, body):
        self._settings(body["settings_revision"])
        files = checked_manifest(body["files"])
        attrs = properties(body.get("attributes", {}))
        project = identifier(body["project_id"]) if "project_id" in body else None
        self.runtime.library.validate_import(attrs, project)
        parallel = body.get("parallel", False)
        if type(parallel) is not bool:
            raise StorageError("INVALID_REQUEST")
        ids = body.get("workspace_ids")
        if ids is not None and (not isinstance(ids, list) or not ids or not parallel or
                                len({identifier(value) for value in ids}) != len(ids)):
            raise StorageError("INVALID_REQUEST")
        targets = plan_import(self.runtime, files, parallel=parallel, workspace_ids=ids)
        workspaces = allocation(files, targets)
        roots = {target["workspace_id"]: self.registry.require(target["workspace_id"]) for target in workspaces}
        group = str(uuid4()) if attrs.get("role") == "raw" and attrs.get("file_kind") != "video" else None
        seen = set()
        entries = []
        for file, target in zip(files, targets, strict=True):
            entry_id = str(uuid4())
            name = file["name"].casefold()
            root = roots[target["workspace_id"]]
            validate_managed_path_length(root, f".staging/direct-{entry_id}.part")
            key = managed_relative_key(file["name"], entry_id, attrs, group, collision=name in seen)
            entries.append({**file, **target, "id": entry_id, "collision": name in seen,
                            "relative_key": fit_managed_key(root, key, entry_id)})
            seen.add(name)
        preview_id = str(uuid4())
        with self.db.session(transaction="write") as session:
            session.execute(delete(LibraryRecord).where(LibraryRecord.kind == PREVIEW,
                            LibraryRecord.data["expires"].as_float() < time()))
            session.add(LibraryRecord(id=preview_id, kind=PREVIEW, data={
                "entries": entries, "group_id": group, "workspaces": workspaces, "attributes": attrs,
                "project_id": project, "settings_revision": body["settings_revision"], "parallel": parallel,
                "expires": time() + 1800,
            }))
        return {"preview_id": preview_id, "file_count": len(files), "failed": 0,
                "size_bytes": sum(item["size_bytes"] for item in files), "workspaces": workspaces}

    def start(self, preview_id, key):
        if not isinstance(key, str) or not 1 <= len(key) <= 128:
            raise StorageError("INVALID_IDEMPOTENCY_KEY")
        identifier(preview_id)
        with self.registry.lock(), self.runtime.capacity.lock, self.db.session(transaction="write") as session:
            previous = session.scalar(select(LibraryRecord).where(
                LibraryRecord.kind == JOB, LibraryRecord.data["key"].as_string() == key))
            if previous and previous.id != preview_id:
                raise StorageError("IDEMPOTENCY_CONFLICT")
            row = session.get(LibraryRecord, preview_id)
            if row is not None and row.kind == JOB:
                if row.data["key"] != key:
                    raise StorageError("IDEMPOTENCY_CONFLICT")
            else:
                row = record(session, preview_id, PREVIEW)
                plan = row.data
                if plan["expires"] < time():
                    raise StorageError("PREVIEW_EXPIRED")
                self._settings(plan["settings_revision"])
                for target in plan["workspaces"]:
                    path = self.registry.require(target["workspace_id"])
                    self.runtime.capacity.check(path, target["size_bytes"])
                entries = plan["entries"]
                group = plan["group_id"]
                if group:
                    create_group(session, group, entries[0]["name"])
                row.kind = JOB
                row.data = {"key": key, "phase": "importing", "group_id": group, "attributes": plan["attributes"],
                            "project_id": plan["project_id"], "parallel": plan["parallel"], "total": len(entries),
                            "copied": 0, "created_ns": time_ns(),
                            "lanes": {target["workspace_id"]: target["lane"] for target in plan["workspaces"]}}
                for index, entry in enumerate(entries):
                    session.add(LibraryRecord(id=entry["id"], kind=ENTRY, data={
                        **entry, "job_id": preview_id, "index": index,
                        "status": "pending", "error": None,
                    }))
        return self.status(preview_id)

    def status(self, job_id):
        with self.db.session(transaction="read") as session:
            job = record(session, job_id, JOB).data
            entries = [{"id": row.id, **{k: v for k, v in row.data.items() if k in {
                "name", "size_bytes", "last_modified_ms", "workspace_id", "lane", "index", "status", "error",
            }}} for row in session.scalars(job_entries(job_id))]
        counts = Counter(entry["status"] for entry in entries)
        phase = job["phase"]
        if phase == "importing" and job_id not in self.active_job_ids():
            phase = "paused"
        return {"id": job_id, "group_id": job["group_id"], "phase": phase, "total": job["total"],
                "copied": counts["copied"], "failed": counts["failed"], "pending": counts["pending"],
                "entries": sorted(entries, key=lambda entry: entry["index"])}

    def _file(self, job_id, entry_id):
        with self.db.session(transaction="read") as session:
            return record(session, job_id, JOB).data, get_entry(session, job_id, entry_id).data

    def _clear_write(self, job_id, entry_id, root, data, *, remove_destination=False):
        stage = safe_join_workspace(root, f".staging/direct-{entry_id}.part")
        expected = data.get("publish_stat")
        if stage.exists():
            if expected is not None and identity(stage) != expected:
                raise StorageError("RECOVERY_REQUIRED", "Direct import staging identity changed")
            remove_stage(stage)
        with self.db.session(transaction="write") as session:
            if remove_destination and expected is not None and not self._location_occupied(session, data):
                dest = safe_join_workspace(root, data["relative_key"])
                if dest.exists() and identity(dest) == expected:
                    dest.unlink()
            row = get_entry(session, job_id, entry_id)
            row.data = {k: v for k, v in row.data.items() if k not in ("writing", "publish_stat")}

    @staticmethod
    def _location_occupied(session, data):
        return session.scalar(select(AssetLocation.id).where(
            AssetLocation.workspace_id == data["workspace_id"],
            AssetLocation.relative_key == data["relative_key"],
        ).limit(1)) is not None

    def _recoverable_bytes(self, job_id, entry_id, root, data):
        if not data.get("writing"):
            return None
        expected = data.get("publish_stat")
        if expected is not None:
            stage = safe_join_workspace(root, f".staging/direct-{entry_id}.part")
            dest = safe_join_workspace(root, data["relative_key"])
            if stage.exists() or dest.exists() and identity(dest) == expected:
                return expected
        self._clear_write(job_id, entry_id, root, data)
        return None

    def _stage(self, job_id, entry_id, target, lane, root, data, read, cancelled):
        # Re-evaluate the path budget if a faster device picked up this file.
        key = data["relative_key"]
        if target != data["workspace_id"]:
            with self.db.session() as session:
                job = record(session, job_id, JOB).data
            key = managed_relative_key(data["name"], entry_id, job["attributes"], job["group_id"],
                                       collision=data["collision"])
            key = fit_managed_key(root, key, entry_id)
        validate_managed_path_length(root, f".staging/direct-{entry_id}.part")
        stage = safe_join_workspace(root, f".staging/direct-{entry_id}.part")
        if stage.exists():
            raise StorageError("OBJECT_CONFLICT")
        with self.db.session(transaction="write") as session:
            active(record(session, job_id, JOB))
            row = get_entry(session, job_id, entry_id)
            if row.data != data:
                raise StorageError("STORAGE_BUSY")
            row.data = {**data, "workspace_id": target, "lane": lane, "relative_key": key,
                        "writing": True, "status": "pending", "error": None}
        remaining = data["size_bytes"]
        owns_stage = False
        try:
            with stage.open("xb") as stream:
                owns_stage = True
                while remaining:
                    if cancelled.is_set():
                        raise StorageError("OPERATION_CANCELLED")
                    if self.runtime.closing.is_set():
                        raise StorageError("STORAGE_BUSY")
                    block = read(min(1024 * 1024, remaining))
                    if not block or len(block) > remaining:
                        raise StorageError("SOURCE_CHANGED")
                    stream.write(block)
                    remaining -= len(block)
                if read(1):
                    raise StorageError("SOURCE_CHANGED")
                stream.flush()
                os.fsync(stream.fileno())
            expected = identity(stage)
            if expected[0] != data["size_bytes"]:
                raise StorageError("COPY_VERIFY_FAILED")
            with self.db.session(transaction="write") as session:
                active(record(session, job_id, JOB))
                row = get_entry(session, job_id, entry_id)
                row.data = {**row.data, "publish_stat": expected}
            return expected
        except BaseException:
            if owns_stage:
                remove_stage(stage)
            with self.db.session(transaction="write") as session:
                row = get_entry(session, job_id, entry_id)
                if not row.data.get("publish_stat"):
                    row.data = {k: v for k, v in row.data.items() if k != "writing"}
            raise

    @contextmanager
    def _reserve(self, job_id, entry_id, root, needed, managed):
        # Rejecting publication deterministically can discard known bytes. Keep
        # their durable identity for ambiguous failures such as a DB outage.
        try:
            with self.runtime.capacity.reserve(root, needed, managed=managed) as reservation:
                yield reservation
        except (IntegrityError, FileExistsError) as exc:
            self._discard_write(job_id, entry_id, root)
            raise StorageError("OBJECT_CONFLICT") from exc
        except StorageError as exc:
            if exc.code in REJECTED_PUBLICATION:
                self._discard_write(job_id, entry_id, root)
            raise
        except OSError as exc:
            if exc.errno == errno.ENOSPC or getattr(exc, "winerror", 0) == 112:
                self._discard_write(job_id, entry_id, root)
            raise

    def _discard_write(self, job_id, entry_id, root):
        _, data = self._file(job_id, entry_id)
        if data.get("writing"):
            self._clear_write(job_id, entry_id, root, data, remove_destination=True)

    def _publish(self, job_id, entry_id, root, reservation, expected):
        _, data = self._file(job_id, entry_id)
        if self.registry.require(data["workspace_id"]) != root:
            raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
        stage = safe_join_workspace(root, f".staging/direct-{entry_id}.part")
        dest = safe_join_workspace(root, data["relative_key"])
        with self.runtime.capacity.lock:
            self.runtime.capacity.recheck(reservation, root, 0, data["size_bytes"])
            with self.db.session(transaction="write") as session:
                job = record(session, job_id, JOB)
                active(job)
                row = get_entry(session, job_id, entry_id)
                if self._location_occupied(session, data):
                    raise StorageError("OBJECT_CONFLICT")
                dest.parent.mkdir(parents=True, exist_ok=True)
                if not dest.exists():
                    if identity(stage) != expected:
                        raise StorageError("COPY_VERIFY_FAILED")
                    publish_object(stage, dest)
                if identity(dest) != expected:
                    raise StorageError("OBJECT_CONFLICT")
                if stage.exists():
                    raise StorageError("RECOVERY_REQUIRED", "Unexpected file at direct import staging path")
                session.add(Asset(id=entry_id, name=data["name"], size_bytes=expected[0], mtime_ns=expected[1]))
                session.flush()
                session.add(AssetLocation(id=entry_id, asset_id=entry_id, storage_mode="managed",
                                          workspace_id=data["workspace_id"], relative_key=data["relative_key"]))
                if job.data["group_id"]:
                    link_frame(session, entry_id, job.data["group_id"], data["index"])
                self.runtime.library.finish_import(session, entry_id, job.data["attributes"], job.data["project_id"])
                copied = job.data["copied"] + 1
                job.data = {**job.data, "copied": copied,
                            "phase": "completed" if copied == job.data["total"] else "importing"}
                row.data = {k: v for k, v in {**row.data, "status": "copied", "error": None}.items()
                            if k not in ("writing", "publish_stat")}
            self.runtime.capacity.committed(reservation, expected[0])

    def _failure(self, job_id, entry_id, code):
        with self.db.session(transaction="write") as session:
            row = get_entry(session, job_id, entry_id)
            if row.data["status"] != "copied":
                row.data = {**row.data, "status": "failed", "error": code}

    def put(self, job_id, entry_id, length, read, preferred=None):
        identifier(entry_id)
        with self._guard:
            if self.runtime.closing.is_set():
                raise StorageError("STORAGE_BUSY")
            if entry_id in self._active:
                raise StorageError("STORAGE_BUSY")
            cancelled = Event()
            self._active[entry_id] = (job_id, cancelled)
        try:
            return self._put(job_id, entry_id, length, read, preferred, cancelled)
        finally:
            with self._guard:
                del self._active[entry_id]
                self._guard.notify_all()

    def _put(self, job_id, entry_id, length, read, preferred, cancelled):
        job, data = self._file(job_id, entry_id)
        copied = data["status"] == "copied"
        if not copied and (job["phase"] != "importing" or job.get("cancel_requested")):
            raise StorageError("OPERATION_CANCELLED")
        if length != data["size_bytes"]:
            self._failure(job_id, entry_id, "SOURCE_CHANGED")
            raise StorageError("SOURCE_CHANGED")
        if copied:
            return {"id": entry_id, "status": "copied", "workspace_id": data["workspace_id"]}
        target = data["workspace_id"]
        if preferred and preferred != target:
            if not job["parallel"] or preferred not in job["lanes"]:
                raise StorageError("INVALID_REQUEST")
            if not data.get("writing"):
                target = preferred
        lane = job["lanes"][target]
        try:
            with ExitStack() as locks:
                locks.enter_context(self.registry.lease(target))
                _, latest = self._file(job_id, entry_id)
                if latest != data:
                    raise StorageError("STORAGE_BUSY")
                root = self.registry.require(target)
                locks.enter_context(self.writers.claim(root))
                expected = self._recoverable_bytes(job_id, entry_id, root, data)
                if expected is None and data.get("writing"):
                    _, data = self._file(job_id, entry_id)
                needed = 0 if expected else data["size_bytes"]
                with self._reserve(job_id, entry_id, root, needed, data["size_bytes"]) as reservation:
                    if expected is None:
                        expected = self._stage(job_id, entry_id, target, lane, root, data, read, cancelled)
                        self.runtime.capacity.materialized(reservation, expected[0])
                    self._publish(job_id, entry_id, root, reservation, expected)
        except StorageError as exc:
            if exc.code == "WORKSPACE_NOT_FOUND":
                self._failure(job_id, entry_id, "DIRECT_IMPORT_REPLAN_REQUIRED")
                raise StorageError("DIRECT_IMPORT_REPLAN_REQUIRED") from exc
            if exc.code not in ("STORAGE_BUSY", "OPERATION_CANCELLED"):
                self._failure(job_id, entry_id, exc.code)
            raise
        except OSError as exc:
            code = "INSUFFICIENT_DISK_SPACE" if exc.errno == errno.ENOSPC or getattr(exc, "winerror", 0) == 112 else "FILE_COPY_FAILED"
            self._failure(job_id, entry_id, code)
            raise StorageError(code) from exc
        return {"id": entry_id, "status": "copied", "workspace_id": target}

    def cancel(self, job_id):
        with self.db.session(transaction="write") as session:
            job = record(session, job_id, JOB)
            if job.data["phase"] == "importing":
                job.data = {**job.data, "cancel_requested": True}
        with self._guard:
            for active_id, cancelled in self._active.values():
                if active_id == job_id:
                    cancelled.set()
        with self.db.session() as session:
            unfinished = [(row.id, row.data) for row in session.scalars(job_entries(job_id))
                          if row.data.get("writing") and row.data["status"] != "copied"]
        for entry_id, data in unfinished:
            target = data["workspace_id"]
            try:
                with self.registry.lease(target, timeout=3):
                    root = self.registry.require(target)
                    _, latest = self._file(job_id, entry_id)
                    if latest.get("writing") and latest["status"] != "copied":
                        self._clear_write(job_id, entry_id, root, latest, remove_destination=True)
            except StorageError as exc:
                if exc.code == "WORKSPACE_NOT_FOUND":
                    # The location is gone, so nothing there can still be written.
                    self._clear_intent(job_id, entry_id)
                else:
                    logger.warning("Cannot reclaim direct import frame %s: %s", entry_id, exc.code)
            except OSError:
                logger.warning("Cannot reclaim direct import frame %s", entry_id, exc_info=True)
        with self.db.session(transaction="write") as session:
            job = record(session, job_id, JOB)
            if job.data["phase"] == "importing":
                job.data = {**job.data, "phase": "cancelled"}
        return self.status(job_id)

    def _clear_intent(self, job_id, entry_id):
        with self.db.session(transaction="write") as session:
            row = get_entry(session, job_id, entry_id)
            if row.data["status"] != "copied":
                row.data = {key: value for key, value in row.data.items() if key not in ("writing", "publish_stat")}
