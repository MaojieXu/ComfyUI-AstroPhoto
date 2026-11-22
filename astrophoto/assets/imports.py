"""Explicit reference and copy imports with persistent per-file checkpoints."""

import os
from contextlib import nullcontext
from pathlib import Path
from time import time
from uuid import uuid4

from sqlalchemy import select

from ..core.config import load_storage_settings, write_json_atomically, validate_mode
from ..core.errors import StorageError
from ..database.library_models import LibraryRecord
from ..database.models import Asset, AssetLocation, StorageOperation
from .library_rules import identifier, properties
from .service import assign_session, validate_session
from .uploads import discard_upload, uploaded_file
from ..storage.initializer import marker_matches
from ..storage.manager import fingerprint, publish_object, remove_stage, source_stat, stage_copy
from ..storage.paths import checked_path, ensure_local_volume, overlaps, safe_join_workspace, system_roots

MAX_FILES = 10000
COUNTS = {"registered": 0, "copied": 0, "skipped": 0, "failed": 0}
RETRYABLE_FAILURES = {"SOURCE_NOT_FOUND", "SOURCE_UNREADABLE", "FILE_COPY_FAILED", "COPY_VERIFY_FAILED"}


class AssetImportService:
    def __init__(self, runtime):
        self.runtime = runtime
        self.registry = runtime.workspaces
        self.ops = runtime.operations
        self.db = runtime.db

    def validate_selected_source_path(self, value):
        path = checked_path(value)
        path = checked_path(path.resolve())
        ensure_local_volume(path)
        protected = [self.runtime.root, self.runtime.cache_path, *self.registry.reserved(), *system_roots()]
        if any(overlaps(path, root) for root in protected):
            raise StorageError("SOURCE_NOT_AUTHORIZED")
        return path

    def _selection(self, payload):
        sources, uploads = payload.get("sources", []), payload.get("uploads", [])
        if ("uploads" in payload and "sources" in payload or not isinstance(sources, list)
                or not isinstance(uploads, list) or not 1 <= len(sources) + len(uploads) <= MAX_FILES
                or not all(isinstance(p, str) for p in sources + uploads)):
            raise StorageError("INVALID_SOURCES")
        settings = load_storage_settings(self.runtime.root)
        if "settings_revision" in payload and (
            type(payload["settings_revision"]) is not int or payload["settings_revision"] != settings["revision"]
            or "import_mode_override" in payload or "workspace_id" in payload
        ):
            raise StorageError("REVISION_CONFLICT")
        mode = validate_mode(payload.get("import_mode_override", settings["imports"]["default_mode"]))
        target = payload.get("workspace_id", settings["workspace"]["default_workspace_id"]) if mode == "copy" else None
        if mode == "copy" and not isinstance(target, str):
            raise StorageError("TARGET_WORKSPACE_REQUIRED")
        if "session_id" in payload:
            validate_session(payload["session_id"])
        paths = [str(self.validate_selected_source_path(path)) for path in sources] if "settings_revision" not in payload else sources
        if uploads and (mode != "copy" or "settings_revision" not in payload):
            raise StorageError("INVALID_SOURCES")
        attrs = properties(payload.get("attributes", {}))
        project = payload.get("project_id")
        self.runtime.library.validate_import(attrs, project)
        if type(payload.get("allow_duplicate", False)) is not bool:
            raise StorageError("INVALID_REQUEST")
        return {"sources": paths, "uploads": [identifier(item) for item in uploads], "workspace_id": target,
                "effective_import_mode": mode, "session_id": payload.get("session_id"), "attributes": attrs,
                "project_id": project, "allow_duplicate": payload.get("allow_duplicate", False),
                "settings_revision": payload.get("settings_revision")}

    def _files(self, plan):
        seen = set()
        result = []
        for upload in plan.get("uploads", []):
            try:
                source = uploaded_file(self.runtime, upload)
                result.append({"id": str(uuid4()), "upload": upload, "source": str(source),
                               "stat": fingerprint(source_stat(source))})
            except StorageError as exc:
                result.append({"source": "", "error": exc.code})
        for value in plan["sources"]:
            try:
                root = self.validate_selected_source_path(value)
                candidates = self._walk(root) if root.is_dir() else (root,)
                for file in candidates:
                    key = os.path.normcase(str(file))
                    if key in seen and not plan.get("allow_duplicate"):
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
            free = self.runtime.capacity.check(root, total)
        preview = {}
        if "settings_revision" in payload:
            preview_id = str(uuid4())
            with self.db.session(transaction="write") as session:
                for prior in session.scalars(select(LibraryRecord).where(LibraryRecord.kind == "import_preview")):
                    if prior.data["expires"] < time():
                        session.delete(prior)
                session.add(LibraryRecord(id=preview_id, kind="import_preview", data={
                    "expires": time() + 1800, "payload": payload, "files": files,
                }))
            preview = {"preview_id": preview_id,
                       "errors": [{"entry": index, "code": item["error"]} for index, item in enumerate(files, 1)
                                  if "error" in item][:100]}
        return {**preview, "effective_import_mode": plan["effective_import_mode"], "workspace_id": target,
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
                if "settings_revision" in payload:
                    preview_id = identifier(payload.get("preview_id"))
                    with self.db.session() as session:
                        preview = session.get(LibraryRecord, preview_id)
                        if (preview is None or preview.kind != "import_preview" or preview.data["expires"] < time()
                                or preview.data["payload"] != {k: v for k, v in payload.items()
                                                               if k not in ("preview_id", "idempotency_key")}):
                            raise StorageError("PREVIEW_EXPIRED")
                        plan["files"] = [{**item, "id": str(uuid4())} if "stat" in item else item
                                         for item in preview.data["files"]]
                    if not any("stat" in item for item in plan["files"]):
                        raise StorageError("INVALID_SOURCES")
                if plan["workspace_id"]:
                    self.registry.require(plan["workspace_id"])
                operation = self.ops.create("import", key, payload, plan)
        self.ops.submit(operation.id)
        return operation.id

    @staticmethod
    def retryable(operation):
        if operation.phase not in {"completed", "failed", "cancelled"} or operation.receipt.get("cleanup_pending"):
            return []
        items = operation.plan.get("files", ())
        receipt = operation.receipt
        processed = receipt.get("processed", 0)
        failed = set(receipt.get("_failed_entries", ()))
        return [item for index, item in enumerate(items, 1)
                if (index in failed or index > processed) and "stat" in item]

    def retry_remaining(self, operation_id):
        with self.registry.lock():
            original = self.ops.get(operation_id, "import")
            key = f"retry-remaining:{operation_id}"
            payload = {"retry_remaining": operation_id, "idempotency_key": key}
            operation = self.ops.find("import", key, payload)
            if operation is None:
                files = self.retryable(original)
                if not files:
                    raise StorageError("NO_RETRYABLE_FILES")
                revision = original.plan.get("settings_revision")
                settings = load_storage_settings(self.runtime.root)
                if revision is not None and settings["revision"] != revision:
                    raise StorageError("REVISION_CONFLICT")
                if target := original.plan["workspace_id"]:
                    self.registry.require(target)
                operation = self.ops.create("import", key, payload, {**original.plan, "files": files})
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
        if operation.phase == "queued" or "files" not in operation.plan:
            self.ops.advance(operation_id, phase="preparing", plan=plan, error=None)
        receipt = operation.receipt or {**COUNTS, "processed": 0, "total": len(plan["files"]), "errors": []}
        items = plan["files"][receipt["processed"]:]
        required = sum(item["stat"][0] for item in items if "stat" in item)
        physical = required - receipt.get("_staged", [0])[0]
        try:
            context = self.runtime.capacity.reserve(root, physical, managed=required) if root else nullcontext()
            with context as reservation:
                self._process_files(operation, plan, root, receipt, items, reservation)
        except StorageError as exc:
            if exc.code in {"INSUFFICIENT_DISK_SPACE", "VOLUME_QUOTA_EXCEEDED"}:
                latest = self.ops.get(operation_id)
                self.ops.advance(operation_id, receipt={**latest.receipt, "required_bytes": required})
            raise

    def _process_files(self, operation, plan, root, receipt, items, reservation):
        operation_id = operation.id
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
        for item in items:
            current = self.ops.get(operation_id)
            if current.phase != "publishing" and current.cancel_requested:
                break
            if "error" in item:
                receipt = self._record(operation_id, receipt, "failed", item["error"])
            elif root:
                if current.phase != "publishing":
                    self.runtime.capacity.recheck(reservation, root, item["stat"][0], item["stat"][0])
                copied = receipt["copied"]
                receipt = self.import_copy(operation_id, root, staging, item, plan, receipt, current, reservation)
                if item.get("upload") and receipt["copied"] > copied:
                    discard_upload(self.runtime, item["upload"])
                if current.phase != "publishing":
                    self.runtime.capacity.materialized(reservation, item["stat"][0])
                self.runtime.capacity.committed(reservation, item["stat"][0])
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

    def recover_interrupted(self, operation):
        plan = operation.plan
        workspace = plan["workspace_id"]
        if workspace and "files" in plan:
            with self.registry.lease(workspace):
                root = self.registry.require(workspace, migrating=True)
                staging = safe_join_workspace(root, f".staging/{operation.id}")
                ownership = {"instance_id": self.registry.instance_id, "operation_id": operation.id}
                if staging.exists() and not marker_matches(staging, ".operation.json", ownership):
                    raise StorageError("RECOVERY_REQUIRED")
                if staged := operation.receipt.get("_staged"):
                    item = plan["files"][operation.receipt["processed"]]
                    with self.db.session() as session:
                        registered = session.get(AssetLocation, item["id"]) is not None
                    if not registered:
                        key = f"objects/{item['id']}/{Path(item['source']).name}"
                        destination = safe_join_workspace(root, key)
                        if destination.exists():
                            info = fingerprint(source_stat(destination))
                            if [*info[:2], *info[3:]] != [*staged[:2], *staged[3:]]:
                                raise StorageError("RECOVERY_REQUIRED")
                            destination.unlink()
                        if destination.parent.is_dir() and not any(destination.parent.iterdir()):
                            destination.parent.rmdir()
                if staging.exists():
                    self._clear_staging(staging, staging / ".operation.json", plan)
        receipt = {key: value for key, value in operation.receipt.items() if key not in {"_staged", "cleanup_pending"}}
        self.ops.advance(operation.id, phase="cancelled", error="IMPORT_SESSION_ENDED", receipt=receipt)

    def _record(self, operation_id, receipt, outcome, code=None, *, session=None):
        next_receipt = {**receipt, "processed": receipt["processed"] + 1, outcome: receipt[outcome] + 1}
        if code in RETRYABLE_FAILURES:
            next_receipt["_failed_entries"] = [*receipt.get("_failed_entries", ()), next_receipt["processed"]]
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
        size, mtime, *_ = item.get("published_stat", item["stat"])
        session.add(Asset(id=item["id"], name=name, size_bytes=size, mtime_ns=mtime))
        session.flush()
        session.add(AssetLocation(id=item["id"], asset_id=item["id"], **location))
        if plan["session_id"]:
            assign_session(session, item["id"], plan["session_id"])
        self.runtime.library.finish_import(session, item["id"], plan.get("attributes", {}), plan.get("project_id"))

    def import_reference(self, operation_id, item, plan, receipt):
        try:
            source = self.validate_selected_source_path(item["source"])
            if fingerprint(source_stat(source)) != item["stat"]:
                raise StorageError("SOURCE_CHANGED")
        except StorageError as exc:
            return self._record(operation_id, receipt, "failed", exc.code)
        key = os.path.normcase(str(source))
        with self.registry.lock(), self.db.session() as session:
            prior = session.scalar(select(AssetLocation).where(AssetLocation.external_key == key).limit(1))
            if prior and not plan.get("allow_duplicate"):
                asset = session.get(Asset, prior.asset_id)
                if [asset.size_bytes, asset.mtime_ns] != item["stat"][:2]:
                    return self._record(operation_id, receipt, "failed", "DUPLICATE_ASSET", session=session)
                if plan["session_id"]:
                    assign_session(session, prior.asset_id, plan["session_id"])
                return self._record(operation_id, receipt, "skipped", session=session)
            self._asset(session, item, plan, storage_mode="external_reference", external_path=str(source), external_key=key)
            return self._record(operation_id, receipt, "registered", session=session)

    def import_copy(self, operation_id, root, staging, item, plan, receipt, current, reservation):
        workspace = plan["workspace_id"]
        relative = f"objects/{item['id']}/{Path(item['source']).name}"
        destination = safe_join_workspace(root, relative)
        temporary = safe_join_workspace(staging, item["id"] + ".part")
        if current.phase != "publishing":
            try:
                remove_stage(temporary)
                source = (uploaded_file(self.runtime, item["upload"]) if item.get("upload") else
                          self.validate_selected_source_path(item["source"]))
                stage_copy(source, temporary, item["stat"], lambda: self.ops.checkpoint(operation_id))
                os.utime(temporary, ns=(temporary.stat().st_atime_ns, item["stat"][1]))
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
        with self.runtime.capacity.lock, self.db.session() as session:
            self.runtime.capacity.recheck(reservation, root, 0, item["stat"][0])
            self._asset(session, {**item, "published_stat": verified}, plan, storage_mode="managed",
                        workspace_id=workspace, relative_key=relative)
            return self._record(operation_id, {**receipt, "verification": "size_and_stat"}, "copied", session=session)

