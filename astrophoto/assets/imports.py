"""Explicit reference and copy imports with persistent per-file checkpoints."""

import os
from contextlib import nullcontext
from pathlib import Path
from uuid import uuid4

from sqlalchemy import select

from ..core.config import load_storage_settings, write_json_atomically, validate_mode
from ..core.errors import StorageError
from ..database.models import Asset, AssetLocation, StorageOperation
from .service import assign_session, validate_session
from ..storage.initializer import marker_matches
from ..storage.manager import choose_space, fingerprint, publish_object, remove_stage, source_stat, stage_copy
from ..storage.paths import canonicalize_root, checked_path, overlaps, safe_join_workspace

MAX_FILES = 10000
COUNTS = {"registered": 0, "copied": 0, "skipped": 0, "failed": 0}


class AssetImportService:
    def __init__(self, runtime):
        self.runtime = runtime
        self.registry = runtime.workspaces
        self.ops = runtime.operations
        self.db = runtime.db

    @property
    def source_roots(self):
        return self.runtime.environ.get("ASTROPHOTO_IMPORT_ROOTS", "")

    def validate_selected_source_path(self, value):
        path = checked_path(value)
        path = checked_path(path.resolve())
        roots = [canonicalize_root(root) for root in self.source_roots.split(os.pathsep) if root]
        if not any(path.is_relative_to(root) for root in roots):
            raise StorageError("SOURCE_NOT_AUTHORIZED")
        protected = [self.runtime.root, self.runtime.cache_path, *self.registry.reserved()]
        if any(overlaps(path, root) for root in protected):
            raise StorageError("SOURCE_NOT_AUTHORIZED")
        return path

    def _selection(self, payload):
        sources = payload.get("sources")
        if not isinstance(sources, list) or not 1 <= len(sources) <= 100 or not all(isinstance(p, str) for p in sources):
            raise StorageError("INVALID_SOURCES")
        settings = load_storage_settings(self.runtime.root)
        mode = validate_mode(payload.get("import_mode_override", settings["imports"]["default_mode"]))
        target = payload.get("workspace_id", settings["workspace"]["default_workspace_id"]) if mode == "copy" else None
        if mode == "copy" and not isinstance(target, str):
            raise StorageError("TARGET_WORKSPACE_REQUIRED")
        if "session_id" in payload:
            validate_session(payload["session_id"])
        paths = [str(self.validate_selected_source_path(path)) for path in sources]
        return {"sources": paths, "workspace_id": target, "effective_import_mode": mode,
                "session_id": payload.get("session_id")}

    def _files(self, plan):
        seen = set()
        result = []
        for value in plan["sources"]:
            try:
                root = self.validate_selected_source_path(value)
                candidates = self._walk(root) if root.is_dir() else (root,)
                for file in candidates:
                    key = os.path.normcase(str(file))
                    if key in seen:
                        continue
                    seen.add(key)
                    try:
                        source = self.validate_selected_source_path(file)
                        result.append({"id": str(uuid4()), "source": str(source), "stat": fingerprint(source_stat(source))})
                    except StorageError as exc:
                        result.append({"source": str(file), "error": exc.code})
                    if len(result) > MAX_FILES:
                        raise StorageError("TOO_MANY_FILES")
            except StorageError as exc:
                if exc.code == "TOO_MANY_FILES":
                    raise
                result.append({"source": value, "error": exc.code})
            except OSError:
                result.append({"source": value, "error": "SOURCE_UNREADABLE"})
        return result

    def _walk(self, root):
        queue = [root]
        visited = 0
        while queue:
            directory = queue.pop()
            with os.scandir(checked_path(directory)) as entries:
                for entry in entries:
                    visited += 1
                    if visited > 4 * MAX_FILES:
                        raise StorageError("TOO_MANY_FILES")
                    path = checked_path(directory) / entry.name
                    if entry.is_dir(follow_symlinks=False):
                        try:
                            queue.append(self.validate_selected_source_path(path))
                            continue
                        except StorageError:
                            pass
                    yield path

    def preview(self, payload):
        plan = self._selection(payload)
        files = self._files(plan)
        total = sum(item["stat"][0] for item in files if "stat" in item)
        target = plan["workspace_id"]
        free = None
        if target:
            root = self.registry.require(target)
            free = choose_space(root, total)
        return {"effective_import_mode": plan["effective_import_mode"], "workspace_id": target,
                "file_count": len(files), "size_bytes": total, "free_bytes": free,
                "failed": sum("error" in item for item in files), "originals_retained": True}

    def import_assets(self, payload):
        key = payload["idempotency_key"]
        with self.registry.lock():
            existing = self.ops.find("import", key, payload)
            if existing is not None:
                operation = existing
            else:
                plan = self._selection(payload)
                if plan["workspace_id"]:
                    self.registry.require(plan["workspace_id"])
                operation = self.ops.create("import", key, payload, plan)
        self.ops.submit(operation.id)
        return operation.id

    def run(self, operation):
        plan = operation.plan
        workspace = plan["workspace_id"]
        with self.registry.lease(workspace) if workspace else nullcontext():
            root = self.registry.require(workspace, migrating=True) if workspace else None
            self._run_files(operation, plan, root)

    def _run_files(self, operation, plan, root):
        operation_id = operation.id
        if "files" not in plan:
            self.ops.checkpoint(operation_id)
            plan = {**plan, "files": self._files(plan)}
            self.ops.advance(operation_id, phase="preparing", plan=plan, error=None)
        receipt = operation.receipt or {**COUNTS, "processed": 0, "total": len(plan["files"]), "errors": []}
        if root and operation.phase in {"queued", "preparing"}:
            required = sum(item["stat"][0] for item in plan["files"] if "stat" in item)
            try:
                choose_space(root, required)
            except StorageError:
                self.ops.advance(operation_id, receipt={**receipt, "required_bytes": required})
                raise
        if operation.phase != "publishing":
            self.ops.advance(operation_id, phase="importing")
        if root:
            staging = safe_join_workspace(root, f".staging/{operation_id}")
            ownership = {"instance_id": self.registry.instance_id, "operation_id": operation_id}
            staging.mkdir(exist_ok=True)
            owner = checked_path(staging / ".operation.json")
            if not owner.exists() and not any(staging.iterdir()):
                write_json_atomically(owner, ownership)
            if not marker_matches(staging, ".operation.json", ownership):
                raise StorageError("RECOVERY_REQUIRED")
        for item in plan["files"][receipt["processed"]:]:
            current = self.ops.get(operation_id)
            if current.phase != "publishing" and current.cancel_requested:
                break
            if "error" in item:
                receipt = self._record(operation_id, receipt, "failed", item["error"])
            elif root:
                receipt = self.import_copy(operation_id, root, staging, item, plan, receipt, current)
            else:
                receipt = self.import_reference(operation_id, item, plan, receipt)
        if root:
            self._clear_staging(staging, owner, plan)
        if receipt["processed"] != receipt["total"]:
            phase, error = "cancelled", "OPERATION_CANCELLED"
        elif receipt["failed"] and receipt["failed"] == receipt["total"]:
            phase, error = "failed", receipt["errors"][0]["code"]
        else:
            phase, error = "completed", None
        self.ops.advance(operation_id, phase=phase, receipt=receipt, error=error)

    @staticmethod
    def _clear_staging(staging, owner, plan):
        for item in plan["files"]:
            if "id" in item:
                remove_stage(safe_join_workspace(staging, item["id"] + ".part"))
        if set(staging.iterdir()) == {owner}:
            checked_path(owner).unlink()
            staging.rmdir()

    def _record(self, operation_id, receipt, outcome, code=None, *, session=None):
        next_receipt = {**receipt, "processed": receipt["processed"] + 1, outcome: receipt[outcome] + 1}
        if code and len(receipt["errors"]) < 100:
            next_receipt["errors"] = [*receipt["errors"], {"entry": receipt["processed"] + 1, "code": code}]
        if session is None:
            self.ops.advance(operation_id, receipt=next_receipt, phase="importing", error=None)
        else:
            row = session.get(StorageOperation, operation_id)
            row.phase, row.receipt, row.error = "importing", next_receipt, None
        return next_receipt

    def _asset(self, session, item, plan, **location):
        name = Path(item["source"]).name
        size, mtime, *_ = item["stat"]
        session.add(Asset(id=item["id"], name=name, size_bytes=size, mtime_ns=mtime))
        session.flush()
        session.add(AssetLocation(id=item["id"], asset_id=item["id"], **location))
        if plan["session_id"]:
            assign_session(session, item["id"], plan["session_id"])

    def import_reference(self, operation_id, item, plan, receipt):
        try:
            source = self.validate_selected_source_path(item["source"])
            if fingerprint(source_stat(source)) != item["stat"]:
                raise StorageError("SOURCE_CHANGED")
        except StorageError as exc:
            return self._record(operation_id, receipt, "failed", exc.code)
        key = os.path.normcase(str(source))
        with self.registry.lock(), self.db.session() as session:
            prior = session.scalar(select(AssetLocation).where(AssetLocation.external_key == key))
            if prior:
                asset = session.get(Asset, prior.asset_id)
                if [asset.size_bytes, asset.mtime_ns] != item["stat"][:2]:
                    return self._record(operation_id, receipt, "failed", "DUPLICATE_ASSET", session=session)
                if plan["session_id"]:
                    assign_session(session, prior.asset_id, plan["session_id"])
                return self._record(operation_id, receipt, "skipped", session=session)
            self._asset(session, item, plan, storage_mode="external_reference", external_path=str(source), external_key=key)
            return self._record(operation_id, receipt, "registered", session=session)

    def import_copy(self, operation_id, root, staging, item, plan, receipt, current):
        workspace = plan["workspace_id"]
        relative = f"objects/{item['id']}/{Path(item['source']).name}"
        destination = safe_join_workspace(root, relative)
        temporary = safe_join_workspace(staging, item["id"] + ".part")
        if current.phase != "publishing":
            try:
                remove_stage(temporary)
                source = self.validate_selected_source_path(item["source"])
                stage_copy(source, temporary, item["stat"], lambda: self.ops.checkpoint(operation_id))
                if self.registry.require(workspace, migrating=True) != root:
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
                self.ops.checkpoint(operation_id)
            except StorageError as exc:
                remove_stage(temporary)
                if exc.code == "OPERATION_CANCELLED":
                    return receipt
                return self._record(operation_id, receipt, "failed", exc.code)
            if destination.parent.exists():
                raise StorageError("OBJECT_CONFLICT")
            receipt = {**receipt, "_staged": fingerprint(source_stat(temporary))}
            self.ops.advance(operation_id, phase="publishing", receipt=receipt, error=None)
        expected = receipt["_staged"]
        if not destination.exists():
            if fingerprint(source_stat(temporary)) != expected:
                raise StorageError("COPY_VERIFY_FAILED")
            if self.registry.require(workspace, migrating=True) != root:
                raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
            destination.parent.mkdir(exist_ok=True)
            publish_object(temporary, destination)
        verified = fingerprint(source_stat(destination))
        if [verified[0], verified[1], *verified[3:]] != [expected[0], expected[1], *expected[3:]]:
            raise StorageError("COPY_VERIFY_FAILED")
        receipt = {key: value for key, value in receipt.items() if key != "_staged"}
        with self.db.session() as session:
            self._asset(session, item, plan, storage_mode="managed", workspace_id=workspace, relative_key=relative)
            return self._record(operation_id, {**receipt, "verification": "size_and_stat"}, "copied", session=session)

