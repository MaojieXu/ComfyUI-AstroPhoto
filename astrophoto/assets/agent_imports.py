"""Durable group approvals and retryable post-import relationships."""

import hashlib
import json
import logging
from hmac import compare_digest
from threading import Lock
from time import time
from uuid import UUID, uuid4, uuid5

from sqlalchemy import delete, func, select

from ..core.config import load_storage_settings
from ..core.errors import StorageError
from ..database.equipment_models import Equipment, OpticalTrain
from ..database.library_models import AssetAttributes, LibraryRecord
from ..database.models import AssetLocation, StorageOperation
from ..storage.locations import TERMINAL
from .agent_import_plan import BINDING_FIELDS, plan_agent_import
from .imports import AGENT_IMPORT_KEY_PREFIX
from .library_rules import identifier, identifiers, properties

logger = logging.getLogger(__name__)
PLAN = "agent_import_plan"
APPROVAL = "agent_import_approval"
PLAN_LIFETIME = 30 * 60
RETRYABLE_START = {
    "STORAGE_BUSY", "WORKSPACE_OFFLINE", "WORKSPACE_QUOTA_EXCEEDED", "VOLUME_QUOTA_EXCEEDED",
    "INSUFFICIENT_DISK_SPACE", "STORAGE_PATH_UNWRITABLE",
}


def _record(session, record_id, kind):
    row = session.get(LibraryRecord, identifier(record_id))
    if row is None or row.kind != kind:
        raise StorageError("LIBRARY_RECORD_NOT_FOUND")
    return row


def _digest(data):
    serialized = json.dumps(data, ensure_ascii=True, sort_keys=True, separators=(",", ":"), allow_nan=False)
    return hashlib.sha256(serialized.encode("ascii")).hexdigest()


def _status(data):
    if data["status"] == "pending" and data["expires_at"] <= time():
        return "expired"
    return data["status"]


class AgentImports:
    def __init__(self, runtime):
        self.runtime = runtime
        self.db = runtime.db
        self._start_lock = Lock()

    def plan(self, payload):
        expires_at = int(time()) + PLAN_LIFETIME
        configured = load_storage_settings(self.runtime.root)
        planned = plan_agent_import(self.runtime, payload)
        groups = []
        unresolved = list(planned["unresolved"])
        for group in planned["groups"]:
            try:
                groups.append(self._freeze_group(group, configured["revision"]))
            except StorageError as exc:
                unresolved.extend(
                    {"index": item["index"], "path": item["path"], "issues": [{"code": exc.code}]}
                    for item in group["items"]
                )
        plan_id = str(uuid4())
        with self.db.session(transaction="write") as session:
            session.execute(delete(LibraryRecord).where(
                LibraryRecord.kind == PLAN, LibraryRecord.data["expires_at"].as_integer() <= int(time()),
            ))
            session.add(LibraryRecord(
                id=plan_id, kind=PLAN, data={"expires_at": expires_at, "groups": groups},
            ))
        return {"plan_id": plan_id, "groups": [item["group"] for item in groups], "unresolved": unresolved}

    def _freeze_group(self, group, settings_revision):
        attributes = properties(group["attributes"])
        if attributes.keys() & BINDING_FIELDS:
            raise StorageError("INVALID_REQUEST")
        payload = {"sources": group["sources"], "attributes": attributes, "settings_revision": settings_revision}
        project_id = group.get("project_id")
        if project_id:
            payload["project_id"] = identifier(project_id)
        view = self.runtime.imports.preview(payload)
        members = group["items"]
        with self.db.session(transaction="read") as session:
            frozen = _record(session, view["preview_id"], "import_preview").data["files"]
            if (view["failed"] or len(frozen) != len(members) or any(
                entry["source"] != member["path"] or entry.get("stat") != member["fingerprint"]
                for entry, member in zip(frozen, members, strict=True)
            )):
                raise StorageError("SOURCE_CHANGED")
            targets = self._target_versions(session, group["binding"], project_id)
            if targets != group["target_versions"]:
                raise StorageError("REVISION_CONFLICT")
        workspace_id = view["workspace_id"]
        workspace = self.runtime.workspaces.get(workspace_id) if workspace_id else None
        public = {
            **{key: value for key, value in group.items() if key != "target_versions"},
            "group_id": str(uuid4()),
            "items": [{key: value for key, value in item.items() if key != "fingerprint"} for item in members],
            "preview": {
                **{key: view[key] for key in ("effective_import_mode", "workspace_id", "file_count", "size_bytes")},
                "workspace_name": workspace.name if workspace else None,
            },
        }
        return {
            "group": public, "payload": {**payload, "preview_id": view["preview_id"]}, "targets": targets,
            "workspace_revision": workspace.revision if workspace else None,
        }

    def _target_versions(self, session, binding, project_id):
        if binding.keys() - (BINDING_FIELDS | {"master_ids"}):
            raise StorageError("INVALID_REQUEST")
        changes = properties({key: value for key, value in binding.items() if key in BINDING_FIELDS})
        equipment_ids = set(changes.get("equipment_ids") or ())
        if camera_id := changes.get("camera_id"):
            equipment_ids.add(camera_id)
        result = {"equipment": {}, "masters": {}}
        for row_id in sorted(equipment_ids):
            row = session.get(Equipment, row_id)
            if row is None or row.archived_at_utc or row_id == changes.get("camera_id") and row.equipment_type != "camera":
                raise StorageError("INVALID_LIBRARY_REFERENCE")
            result["equipment"][row.id] = row.row_version
        if train_id := changes.get("optical_train_id"):
            row = session.get(OpticalTrain, train_id)
            if row is None or row.archived_at_utc or getattr(row, "deleted_at_utc", None):
                raise StorageError("INVALID_LIBRARY_REFERENCE")
            result["train"] = row.row_version
        for master_id in identifiers(binding.get("master_ids", [])):
            master = _record(session, master_id, "masters")
            attrs = session.get(AssetAttributes, master.data["asset_id"])
            location = session.scalar(select(AssetLocation.id).filter_by(asset_id=master.data["asset_id"]).limit(1))
            if location is None or attrs is None:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
            result["masters"][master_id] = [master.revision, attrs.revision]
        if project_id:
            result["project"] = _record(session, project_id, "projects").revision
        return result

    def propose(self, plan_id, group_id):
        approval_id = str(uuid5(UUID(identifier(plan_id)), identifier(group_id)))
        with self.db.session(transaction="write") as session:
            prior = session.get(LibraryRecord, approval_id)
            if prior is None:
                plan = _record(session, plan_id, PLAN).data
                if plan["expires_at"] <= time():
                    raise StorageError("PREVIEW_EXPIRED")
                frozen = next((group for group in plan["groups"] if group["group"]["group_id"] == group_id), None)
                if frozen is None:
                    raise StorageError("LIBRARY_RECORD_NOT_FOUND")
                count = session.scalar(select(func.count()).select_from(LibraryRecord).where(
                    LibraryRecord.kind == APPROVAL,
                    LibraryRecord.data["status"].as_string() == "pending",
                    LibraryRecord.data["expires_at"].as_integer() > int(time()),
                ))
                if count >= 100:
                    raise StorageError("STORAGE_BUSY")
                immutable = {**frozen, "expires_at": plan["expires_at"]}
                session.add(LibraryRecord(id=approval_id, kind=APPROVAL, data={
                    **immutable, "digest": _digest(immutable), "status": "pending", "bindings": {},
                }))
            elif prior.kind != APPROVAL:
                raise StorageError("IDEMPOTENCY_CONFLICT")
        return self.status(approval_id)

    def decide(self, approval_id, digest, decision):
        if not isinstance(digest, str) or len(digest) != 64 or not digest.isascii() or decision not in ("approved", "denied"):
            raise StorageError("INVALID_REQUEST")
        with self.db.session(transaction="write") as session:
            row = _record(session, approval_id, APPROVAL)
            data = row.data
            if not compare_digest(data["digest"], digest):
                raise StorageError("REVISION_CONFLICT")
            status = _status(data)
            if status == "pending":
                row.data = {**data, "status": decision}
            elif status == "expired":
                raise StorageError("PREVIEW_EXPIRED")
            elif status != decision:
                raise StorageError("REVISION_CONFLICT")
        if decision == "approved":
            self._start(approval_id)
        return self.status(approval_id)

    @staticmethod
    def _request(approval_id, data):
        return {**data["payload"], "idempotency_key": AGENT_IMPORT_KEY_PREFIX + approval_id}

    def _start(self, approval_id):
        with self._start_lock:
            self._start_once(approval_id)

    def _start_once(self, approval_id):
        with self.db.session(transaction="read") as session:
            data = _record(session, approval_id, APPROVAL).data
            if data["status"] != "approved" or data.get("operation_id") or data.get("import_error"):
                return
            request = self._request(approval_id, data)
        try:
            current = self.runtime.operations.find("import", request["idempotency_key"], request)
            if current is None:
                with self.db.session(transaction="read") as session:
                    if self._target_versions(session, data["group"]["binding"], data["group"].get("project_id")) != data["targets"]:
                        raise StorageError("REVISION_CONFLICT")
                operation_id = self.runtime.imports.import_assets(
                    request, agent_approval=True, approved_workspace_revision=data["workspace_revision"],
                )
            else:
                operation_id = current.id
                self.runtime.operations.submit(operation_id)
        except StorageError as exc:
            if exc.code in RETRYABLE_START:
                # Capacity and availability failures stay retryable under the same approval.
                self._update_start(approval_id, import_pending_error=exc.code)
            else:
                self._update_start(approval_id, import_error=exc.code)
            return
        except OSError:
            logger.warning("Cannot start approved agent import %s", approval_id, exc_info=True)
            self._update_start(approval_id, import_pending_error="INTERNAL_STORAGE_ERROR")
            return
        self._update_start(approval_id, operation_id=operation_id)

    def _update_start(self, approval_id, **update):
        with self.db.session(transaction="write") as session:
            row = _record(session, approval_id, APPROVAL)
            if row.data.get("operation_id") or row.data.get("import_error"):
                return
            data = {**row.data, **update}
            if "operation_id" in update:
                data.pop("import_pending_error", None)
            row.data = data

    def status(self, approval_id):
        with self.db.session(transaction="read") as session:
            data = _record(session, approval_id, APPROVAL).data
            operations = self._linked(session, approval_id, data.get("operation_id"))
            linked = [(row.id, row.kind) for row in operations]
            skipped_ids = []
            for operation in operations:
                for asset_id in operation.receipt.get("_skipped_asset_ids", ()):
                    if asset_id not in skipped_ids:
                        skipped_ids.append(asset_id)
        state = _status(data)
        public = {
            "id": approval_id, "approval_id": approval_id, "digest": data["digest"], "status": state,
            "expires_at": data["expires_at"], "group": data["group"],
        }
        if error := data.get("import_error"):
            result = {**public, "status": "import_failed", "error": {"code": error}}
            if error == "REVISION_CONFLICT":
                # Target versions only move forward, so the frozen approval can never apply again.
                result["requires_new_approval"] = True
            return result
        if pending := data.get("import_pending_error"):
            public["error"] = {"code": pending, "retryable": True}
        if not linked:
            return public
        receipts = [self.runtime.operations.status(operation_id, "import") for operation_id, _ in linked]
        bindings = list(data["bindings"].values())
        imported = sum(item["receipt"].get("registered", 0) + item["receipt"].get("copied", 0)
                       for item in receipts)
        skipped = sum(item["receipt"].get("skipped", 0) for item in receipts)
        if skipped_ids:
            public["skipped_assets"] = [{"asset_id": asset_id, "reason": "ALREADY_REGISTERED"}
                                        for asset_id in skipped_ids]
        if any(binding["status"] == "failed" and (binding.get("error") or {}).get("code") == "REVISION_CONFLICT"
               for binding in bindings):
            public["requires_new_approval"] = True
        # Retries only replay the frames still outstanding, so the final state counts
        # every item once instead of adding historical failures again.
        total = len(data["group"].get("items") or ())
        remaining = max(0, total - imported - skipped)
        if any(item["phase"] not in TERMINAL for item in receipts):
            status = "importing"
        elif not imported:
            status = "partial" if skipped and not remaining else "import_failed"
        elif len(bindings) != imported:
            status = "binding_pending"
        elif any(binding["status"] == "failed" for binding in bindings):
            status = "binding_failed"
        elif skipped or remaining or any(item["phase"] != "completed" for item in receipts):
            status = "partial"
        else:
            status = "completed"
        return {**public, "status": status, "import_operation_id": linked[0][0],
                "operation": receipts[0], "retry_operations": receipts[1:], "bindings": bindings}

    def after_import(self, operation, *, retry=False):
        if operation.kind != "import" or operation.phase not in TERMINAL:
            return
        approval_id = self._approval_id(operation)
        if approval_id is None:
            return
        with self.db.session(transaction="read") as session:
            row = session.get(LibraryRecord, approval_id)
            if row is None or row.kind != APPROVAL or row.data["status"] != "approved":
                return
            if operation.key.startswith(AGENT_IMPORT_KEY_PREFIX):
                if self._request(approval_id, row.data) != operation.request:
                    return
            elif operation.plan.get("agent_approval_id") != approval_id:
                return
            known = row.data["bindings"]
            # The import commits these IDs alongside newly registered files. Skips
            # never enter this receipt, even if a source was already in the library.
            ids = operation.receipt.get("_agent_asset_ids", [])
        for asset_id in ids:
            if asset_id in known and (not retry or known[asset_id]["status"] == "bound"):
                continue
            self._bind(approval_id, asset_id, retry=retry)

    @staticmethod
    def _approval_id(operation):
        """Resolve the approval for an original group import or its retry operation."""
        if operation.kind != "import":
            return None
        if operation.key.startswith(AGENT_IMPORT_KEY_PREFIX):
            return operation.key.removeprefix(AGENT_IMPORT_KEY_PREFIX)
        return operation.plan.get("agent_approval_id")

    @staticmethod
    def _linked(session, approval_id, operation_id=None):
        rows = {}
        if operation_id:
            row = session.get(StorageOperation, operation_id)
            if row is not None and row.kind == "import":
                rows[row.id] = row
        for row in session.scalars(select(StorageOperation).where(
            StorageOperation.kind == "import",
            StorageOperation.plan["agent_approval_id"].as_string() == approval_id,
        ).order_by(StorageOperation.created_ns)):
            rows.setdefault(row.id, row)
        return list(rows.values())

    def _operations(self, approval_id, operation_id=None):
        with self.db.session(transaction="read") as session:
            return list(self._linked(session, approval_id, operation_id))

    def _bind(self, approval_id, asset_id, *, retry):
        try:
            with self.db.session(transaction="write") as session:
                row = _record(session, approval_id, APPROVAL)
                data = row.data
                if (prior := data["bindings"].get(asset_id)) and (not retry or prior["status"] == "bound"):
                    return
                group = data["group"]
                if self._target_versions(session, group["binding"], group.get("project_id")) != data["targets"]:
                    raise StorageError("REVISION_CONFLICT")
                assignments = self.runtime.library.bind_imported_asset(
                    session, asset_id, group["attributes"], group["binding"],
                )
                self._binding_result(row, asset_id, "bound", assignment_ids=assignments)
        except StorageError as exc:
            with self.db.session(transaction="write") as session:
                row = _record(session, approval_id, APPROVAL)
                if row.data["bindings"].get(asset_id, {}).get("status") != "bound":
                    self._binding_result(row, asset_id, "failed", error={"code": exc.code, "details": exc.details})

    @staticmethod
    def _binding_result(row, asset_id, status, **detail):
        results = {**row.data["bindings"], asset_id: {"asset_id": asset_id, "status": status, **detail}}
        row.data = {**row.data, "bindings": results}

    def retry_bindings(self, approval_id):
        current = self.status(approval_id)
        if current["status"] == "approved":
            if not (current.get("error") or {}).get("retryable"):
                raise StorageError("REVISION_CONFLICT")
            self._start(approval_id)
            return self.status(approval_id)
        if current["status"] not in ("binding_pending", "binding_failed", "completed", "partial"):
            raise StorageError("REVISION_CONFLICT")
        for operation in self._operations(approval_id, current["import_operation_id"]):
            if operation.phase in TERMINAL:
                self.after_import(operation, retry=True)
        return self.status(approval_id)

    def recover(self):
        with self.db.session(transaction="read") as session:
            approvals = list(session.scalars(select(LibraryRecord).where(
                LibraryRecord.kind == APPROVAL, LibraryRecord.data["status"].as_string() == "approved",
            )))
        for approval in approvals:
            try:
                self._start(approval.id)
                current = self.status(approval.id)
                operation_id = current.get("import_operation_id")
                if operation_id:
                    for operation in self._operations(approval.id, operation_id):
                        if operation.phase in TERMINAL:
                            self.after_import(operation)
            except (StorageError, OSError):
                logger.exception("Cannot recover agent import approval %s", approval.id)
