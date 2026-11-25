"""Explicit reference and copy imports with persistent per-file checkpoints."""

import os
from hashlib import sha256
from contextlib import nullcontext
from pathlib import Path
from time import time
from uuid import uuid4

from sqlalchemy import select

from ..core.config import load_storage_settings, write_json_atomically, validate_mode
from ..core.errors import StorageError
from ..database.library_models import LibraryRecord
from ..database.models import Asset, AssetLocation, StorageOperation
from .import_groups import create_group, link_frame
from . import catalog
from .library_rules import identifier, properties
from ..database.catalog_models import CollectionDirectory, SubframeCollection, Subframe
from ..storage.initializer import marker_matches
from ..storage.import_planner import check_destination, disk_name_key, managed_destination, managed_relative_key, validate_managed_path_length
from ..storage.manager import fingerprint, publish_object, remove_stage, source_stat, stage_copy
from ..storage.paths import checked_path, ensure_local_volume, overlaps, safe_join_workspace, system_roots

MAX_FILES = 10000
COUNTS = {"registered": 0, "copied": 0, "skipped": 0, "failed": 0}
RETRYABLE_FAILURES = {"SOURCE_NOT_FOUND", "SOURCE_UNREADABLE", "FILE_COPY_FAILED", "COPY_VERIFY_FAILED"}
PUBLICATION_CONFLICTS = {"ASSET_NAME_CONFLICT", "REVISION_CONFLICT", "DUPLICATE_ASSET", "OBJECT_CONFLICT"}


def group_owns_directory(session, workspace, group, relative):
    directory = relative.rpartition("/")[0]
    if record := session.get(CollectionDirectory, (workspace, directory)):
        if record.collection_id != group:
            raise StorageError("OBJECT_CONFLICT")
        return True
    return False


def register_collection_directory(session, workspace, relative, collection):
    directory = relative.rpartition("/")[0]
    record = session.get(CollectionDirectory, (workspace, directory))
    if record is None:
        session.add(CollectionDirectory(workspace_id=workspace, relative_key=directory, collection_id=collection))
    elif record.collection_id != collection:
        raise StorageError("OBJECT_CONFLICT")


def source_key(group_id, source):
    return "catalog_source_" + sha256((group_id + "\0" + os.path.normcase(source)).encode()).hexdigest()


def source_exists(session, group_id, source):
    if session.get(LibraryRecord, source_key(group_id, source)):
        return True
    return session.scalar(select(Subframe.id).join(AssetLocation, AssetLocation.asset_id == Subframe.id).where(
        Subframe.collection_id == group_id, AssetLocation.external_key == os.path.normcase(source)).limit(1)) is not None


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
        sources = payload.get("sources")
        if (not isinstance(sources, list) or not 1 <= len(sources) <= MAX_FILES
                or not all(isinstance(path, str) for path in sources)):
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
        paths = [str(self.validate_selected_source_path(path)) for path in sources] if "settings_revision" not in payload else sources
        typed = None
        append_id = payload.get("append_collection_id")
        if append_id:
            identifier(append_id)
            if "catalog" in payload:
                raise StorageError("INVALID_REQUEST")
            with self.db.session(transaction="read") as session:
                group = catalog.require(session, SubframeCollection, append_id)
                typed = {"kind": "subframe_collection", "fields": catalog.data(group), "master_ids": [],
                         "confirmed": False, "comparison": []}
            if not all((item := self.validate_selected_source_path(path)).is_file() or item.is_dir() for path in paths):
                raise StorageError("INVALID_SOURCES")
        elif "catalog" in payload:
            if ("settings_revision" not in payload
                    or payload.keys() & {"attributes", "project_id", "session_id"}):
                raise StorageError("INVALID_REQUEST")
            typed = catalog.preflight(self.runtime, payload["catalog"])
            grouped = typed["kind"] == "subframe_collection"
            selected = [self.validate_selected_source_path(path) for path in paths]
            if grouped:
                valid = all(source.is_file() or source.is_dir() for source in selected)
            else:
                valid = len(selected) == 1 and selected[0].is_file()
            if not valid:
                raise StorageError("INVALID_SOURCES")
        attrs = catalog.import_attributes(typed) if typed else properties(payload.get("attributes", {}))
        self.runtime.library.validate_import(attrs)
        if type(payload.get("allow_duplicate", False)) is not bool:
            raise StorageError("INVALID_REQUEST")
        return {"sources": paths, "workspace_id": target,
                "effective_import_mode": mode, "attributes": attrs,
                "allow_duplicate": payload.get("allow_duplicate", False),
                "settings_revision": payload.get("settings_revision"), "catalog": typed,
                "append_collection_id": append_id}

    def _files(self, plan):
        seen = set()
        result = []
        for value in plan["sources"]:
            try:
                root = self.validate_selected_source_path(value)
                candidates = self._walk(root) if root.is_dir() else (root,)
                for file in candidates:
                    key = os.path.normcase(str(file))
                    if key in seen and (not plan.get("allow_duplicate") or plan.get("catalog")):
                        continue
                    seen.add(key)
                    try:
                        source = self.validate_selected_source_path(file)
                        if plan.get("append_collection_id"):
                            with self.db.session(transaction="read") as session:
                                duplicate = source_exists(session, plan["append_collection_id"], str(source))
                            if duplicate:
                                result.append({"source": str(source), "duplicate": True})
                                continue
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
        if target and "workspace_id" not in payload and "import_mode_override" not in payload:
            target = self.runtime.capacity.select_workspace(total)
            plan["workspace_id"] = target
        free = None
        if target:
            root = self.registry.require(target)
            free = self.runtime.capacity.check(root, total)
            self._assign_destinations({**plan, "files": [dict(item) for item in files]}, root, preflight=True)
        preview = {}
        if "settings_revision" in payload:
            preview_id = str(uuid4())
            with self.db.session(transaction="write") as session:
                for prior in session.scalars(select(LibraryRecord).where(LibraryRecord.kind == "import_preview")):
                    if prior.data["expires"] < time():
                        session.delete(prior)
                session.add(LibraryRecord(id=preview_id, kind="import_preview", data={
                    "expires": time() + 1800, "payload": payload, "files": files, "workspace_id": target,
                    "catalog": plan["catalog"],
                }))
            preview = {"preview_id": preview_id,
                       "errors": [{"entry": index, "code": item["error"]} for index, item in enumerate(files, 1)
                                  if "error" in item][:100]}
        return {**preview, "effective_import_mode": plan["effective_import_mode"], "workspace_id": target,
                "file_count": len(files), "size_bytes": total, "free_bytes": free,
                "failed": sum("error" in item for item in files), "originals_retained": True,
                **({"calibration": plan["catalog"]["comparison"]} if plan["catalog"] else {})}

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
                        if typed := plan["catalog"]:
                            previous = preview.data.get("catalog") or {}
                            if ({key: value for key, value in typed.items() if key != "comparison"} !=
                                    {key: value for key, value in previous.items() if key != "comparison"}):
                                raise StorageError("REVISION_CONFLICT")
                            plan["allow_duplicate"] = True
                        if plan["effective_import_mode"] == "copy" and "workspace_id" not in payload:
                            plan["workspace_id"] = preview.data.get("workspace_id", plan["workspace_id"])
                    if not any("stat" in item for item in plan["files"]):
                        raise StorageError("DUPLICATE_ASSET" if any(item.get("duplicate") for item in plan["files"]) else "INVALID_SOURCES")
                attrs = plan["attributes"]
                if attrs.get("role") == "raw" and attrs.get("file_kind") != "video":
                    plan["group_id"] = plan.get("append_collection_id") or str(uuid4())
                    if not plan["workspace_id"]:
                        valid = [item for item in plan.get("files", []) if "stat" in item]
                        if valid:
                            source = Path(plan["sources"][0]) if len(plan["sources"]) == 1 else None
                            plan["group_first_name"] = source.name if source and source.is_dir() else Path(valid[0]["source"]).name
                            for index, item in enumerate(plan["files"]):
                                item["import_index"] = index
                if plan["workspace_id"]:
                    root = self.registry.require(plan["workspace_id"])
                    if "files" in plan:
                        total = sum(item["stat"][0] for item in plan["files"] if "stat" in item)
                        self.runtime.capacity.check(root, total)
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
                plan = {**original.plan, "files": files}
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
        if plan.get("group_id") and not root and "group_first_name" not in plan:
            valid = [item for item in plan["files"] if "stat" in item]
            if valid:
                source = Path(plan["sources"][0]) if len(plan["sources"]) == 1 else None
                plan["group_first_name"] = source.name if source and source.is_dir() else Path(valid[0]["source"]).name
                for index, item in enumerate(plan["files"]):
                    item["import_index"] = index
        if operation.phase == "queued" or "files" not in operation.plan:
            if root:
                plan = self._assign_destinations(plan, root)
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
            if exc.code in {"INSUFFICIENT_DISK_SPACE", "VOLUME_QUOTA_EXCEEDED", "WORKSPACE_QUOTA_EXCEEDED"}:
                latest = self.ops.get(operation_id)
                self.ops.advance(operation_id, receipt={**latest.receipt, "required_bytes": required})
            raise

    def _assign_destinations(self, plan, root, *, preflight=False):
        # Freeze destination keys and original order before the first publication.
        # A retry of a subset must retain the first operation's collision decisions.
        seen = set()
        first_name = plan.get("group_first_name")
        typed = plan.get("catalog")
        source = Path(plan["sources"][0]) if len(plan["sources"]) == 1 else None
        group_name = source.name if source and source.is_dir() else None
        for index, item in enumerate(plan["files"]):
            if "stat" not in item or "relative_key" in item:
                continue
            name = Path(item["source"]).name
            material_name = name
            if typed:
                material_name = typed["fields"]["name"]
            elif plan["attributes"].get("role") == "raw" and plan["attributes"].get("file_kind") != "video":
                material_name = group_name or first_name or name
            try:
                key = managed_relative_key(name, plan["attributes"], material_name)
                destination = managed_destination(root, key)
                if disk_name_key(key) in seen:
                    raise StorageError("OBJECT_CONFLICT")
                if preflight and destination.parent.exists():
                    with self.db.session() as session:
                        owned = group_owns_directory(session, plan["workspace_id"], plan.get("append_collection_id"), key)
                    check_destination(destination, allow_directory=owned)
                elif preflight:
                    check_destination(destination)
            except StorageError as exc:
                if preflight:
                    raise
                item["error"] = exc.code
                item.pop("stat")
                continue
            if first_name is None:
                first_name = name
            seen.add(disk_name_key(key))
            item.update(relative_key=key, import_index=index)
        return {**plan, "group_first_name": first_name}

    @staticmethod
    def _destination_key(item):
        return item["relative_key"]

    def _process_files(self, operation, plan, root, receipt, items, reservation):
        operation_id = operation.id
        if operation.phase != "publishing":
            self.ops.advance(operation_id, phase="importing")
        if root:
            # File staging names and operation IDs are both UUIDs.
            validate_managed_path_length(root, f".staging/{operation_id}/{operation_id}.part")
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
            if item.get("duplicate"):
                receipt = self._record(operation_id, receipt, "skipped")
            elif "error" in item:
                receipt = self._record(operation_id, receipt, "failed", item["error"])
            elif root:
                if current.phase != "publishing":
                    self.runtime.capacity.recheck(reservation, root, item["stat"][0], item["stat"][0])
                receipt = self.import_copy(operation_id, root, staging, item, plan, receipt, current, reservation)
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
        if phase == "completed" and (typed := plan.get("catalog")) and plan.get("group_id"):
            from ..database.catalog_models import SubframeCollection

            with self.db.session(transaction="write") as session:
                row = session.get(SubframeCollection, plan["group_id"])
                if row:
                    receipt = {**receipt, "collection_id": row.id,
                               "binding_error": catalog.finish_bindings(session, row, typed)}
        if (typed := plan.get("catalog")) and receipt["registered"] + receipt["copied"]:
            ident = plan.get("group_id") or plan["files"][0]["id"]
            receipt = {**receipt, "catalog_id": ident,
                       "catalog_type": typed.get("result_type", typed["kind"]),
                       "catalog_name": typed["fields"]["name"]}
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
                        key = self._destination_key(item)
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
        if group_id := plan.get("group_id"):
            if plan.get("append_collection_id"):
                from sqlalchemy import func
                item["import_index"] = (session.scalar(select(func.max(Subframe.frame_index)).where(Subframe.collection_id == group_id)) or 0) + 1
                group = catalog.require(session, SubframeCollection, group_id)
                group.revision += 1
                group.updated_at_utc = catalog.now()
                catalog.touch_dates(session, group_id)
            group_record = create_group(session, group_id, plan["group_first_name"],
                                        name=plan["catalog"]["fields"]["name"] if plan.get("catalog") else None)
            link_frame(session, item["id"], group_id, item["import_index"])
            source_id = source_key(group_id, item["source"])
            if source_exists(session, group_id, item["source"]):
                raise StorageError("DUPLICATE_ASSET")
            session.add(LibraryRecord(id=source_id, kind="catalog_source", data={"asset_id": item["id"]}))
        attrs = plan.get("attributes", {})
        if typed := plan.get("catalog"):
            row = catalog.publish(session, item["id"], typed, plan.get("group_id"), item.get("import_index", 0))
            attrs = {**attrs, "notes": row.notes}
        elif group_id:
            row = catalog.publish_unclassified_subframe(session, item["id"], group_record, item["import_index"])
        if group_id and location["storage_mode"] == "managed":
            register_collection_directory(session, location["workspace_id"], location["relative_key"], row.id)
        self.runtime.library.finish_import(session, item["id"], attrs)

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
                receipt = {**receipt, "_skipped_asset_ids": [*receipt.get("_skipped_asset_ids", ()), prior.asset_id]}
                return self._record(operation_id, receipt, "skipped", session=session)
            self._asset(session, item, plan, storage_mode="external_reference", external_path=str(source), external_key=key)
            return self._record(operation_id, receipt, "registered", session=session)

    def import_copy(self, operation_id, root, staging, item, plan, receipt, current, reservation):
        workspace = plan["workspace_id"]
        relative = self._destination_key(item)
        destination = safe_join_workspace(root, relative)
        temporary = safe_join_workspace(staging, item["id"] + ".part")
        if current.phase != "publishing":
            try:
                remove_stage(temporary)
                source = self.validate_selected_source_path(item["source"])
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
            try:
                with self.db.session() as session:
                    owned = group_owns_directory(session, workspace, plan.get("group_id"), relative)
                check_destination(destination, allow_directory=owned)
            except StorageError as exc:
                remove_stage(temporary)
                return self._record(operation_id, receipt, "failed", exc.code)
            receipt = {**receipt, "_staged": fingerprint(source_stat(temporary))}
            self.ops.advance(operation_id, phase="publishing", receipt=receipt, error=None)
        expected = receipt["_staged"]
        with self.runtime.capacity.lock, self.db.session(transaction="write") as session:
            self.runtime.capacity.recheck(reservation, root, 0, item["stat"][0])
            staged = temporary.exists()
            typed = plan.get("catalog")
            resource_id = plan.get("group_id") or item["id"]
            try:
                if typed:
                    group = session.get(SubframeCollection, plan["group_id"]) if plan.get("group_id") else None
                    if (plan.get("append_collection_id") and group is None
                            or group is not None and group.name != typed["fields"]["name"]):
                        raise StorageError("REVISION_CONFLICT")
                    catalog.check_name(session, typed["fields"]["name"], resource_id)
                if plan.get("group_id") and source_exists(session, plan["group_id"], item["source"]):
                    raise StorageError("DUPLICATE_ASSET")
                if staged:
                    owned = group_owns_directory(session, workspace, plan.get("group_id"), relative)
                    check_destination(destination, allow_directory=owned)
            except StorageError as exc:
                if not staged or exc.code not in PUBLICATION_CONFLICTS:
                    raise
                clean_receipt = {key: value for key, value in receipt.items() if key != "_staged"}
                return self._record(operation_id, clean_receipt, "failed", exc.code, session=session)
            if typed:
                catalog.reserve_name(session, typed["fields"]["name"], resource_id)
            if staged:
                if fingerprint(source_stat(temporary)) != expected:
                    raise StorageError("COPY_VERIFY_FAILED")
                if self.registry.require(workspace, migrating=True) != root:
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
                destination.parent.mkdir(parents=True, exist_ok=True)
                publish_object(temporary, destination)
            verified = fingerprint(source_stat(destination))
            if [verified[0], verified[1], *verified[3:]] != [expected[0], expected[1], *expected[3:]]:
                raise StorageError("COPY_VERIFY_FAILED")
            receipt = {key: value for key, value in receipt.items() if key != "_staged"}
            self._asset(session, {**item, "published_stat": verified}, plan, storage_mode="managed",
                        workspace_id=workspace, relative_key=relative)
            return self._record(operation_id, {**receipt, "verification": "size_and_stat"}, "copied", session=session)

