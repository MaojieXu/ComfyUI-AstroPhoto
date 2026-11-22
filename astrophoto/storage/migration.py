"""Recoverable whole-Workspace migration with a transactional root switch."""

import json
import os
from contextlib import ExitStack
from decimal import Decimal, InvalidOperation
from pathlib import Path
from uuid import UUID, uuid4

from sqlalchemy import select

from ..core.config import read_json, write_json_atomically
from ..core.errors import StorageError
from ..database.library_models import FormalOutput
from ..database.models import AssetLocation, StorageOperation
from .initializer import WORKSPACE_MARKER, claim_directory, marker_matches
from .locations import TERMINAL, WORKSPACE_DIRS, formal_receipt_key, rebind_workspace
from .manager import file_hash, fingerprint, publish_object, remove_stage, source_stat, stage_copy
from .paths import checked_path, safe_join_workspace, volume_identity

MIGRATION_MARKER = ".astrophoto-migration.json"


def managed_groups(session, source, workspace, instance):
    outputs = {output.relative_key: output for output in session.scalars(
        select(FormalOutput).where(FormalOutput.workspace_id == workspace)
    )}
    entries = session.scalars(select(AssetLocation).where(AssetLocation.workspace_id == workspace))
    for entry in entries:
        key = entry.relative_key
        if key in outputs:
            continue
        members = [key]
        if key == f"outputs/{entry.asset_id}/stretched.fit":
            receipt_key = f"outputs/{entry.asset_id}/manifest.json"
            members.append(verify_formal_receipt(source, receipt_key, instance, workspace, entry.asset_id))
        yield {"id": entry.id, "members": members, "formal": False}
    sessions = {}
    for output in outputs.values():
        if output.provenance.get("producer") == "siril-cli-session-v1":
            run_id = output.provenance.get("run_id")
            try:
                if run_id != str(UUID(run_id)) or not output.relative_key.startswith(f"outputs/{run_id}/"):
                    raise ValueError("Invalid Siril session registration")
            except (ValueError, TypeError, AttributeError) as exc:
                raise StorageError("RECOVERY_REQUIRED", "Siril session output does not match its record") from exc
            sessions.setdefault(run_id, []).append((output.id, output.relative_key))
            continue
        members = [output.relative_key]
        if (receipt_key := formal_receipt_key(output)) is not None:
            members.append(verify_formal_receipt(source, receipt_key, instance, workspace, output.id,
                                                 output.provenance["producer"]))
        yield {"id": output.id, "members": members, "formal": True}
    for run_id, records in sessions.items():
        records.sort(key=lambda row: row[1])
        yield {"id": run_id, "members": [key for _, key in records], "formal": True, "formal_outputs": records}


def verify_formal_receipt(source, key, instance, workspace, output_id, producer="siril-autostretch-v1"):
    try:
        receipt = read_json(safe_join_workspace(source, key))
    except (OSError, ValueError) as exc:
        raise StorageError("WORKSPACE_FILES_MISSING", "Siril output receipt is unavailable",
                           details={"workspace_id": workspace, "missing_count": 1,
                                    "missing": [{"asset_id": output_id, "relative_key": key}]}) from exc
    if (receipt.get("producer") != producer or receipt.get("instance_id") != instance
            or receipt.get("run_id") != output_id or receipt.get("workspace_id") != workspace
            or receipt.get("output_id", receipt.get("asset_id")) != output_id or receipt.get("state") != "completed"):
        raise StorageError("RECOVERY_REQUIRED", "Siril output receipt does not match its record")
    return key


class WorkspaceMigrationService:
    def __init__(self, runtime):
        self.registry = runtime.workspaces
        self.ops = runtime.operations
        self.db = runtime.db
        self.capacity = runtime.capacity

    def validate(self, workspace, target):
        source = self.registry.require(workspace)
        destination = self.registry.candidate(target)
        if destination.exists() and any(destination.iterdir()):
            raise StorageError("TARGET_NOT_EMPTY")
        return source, destination

    def start(self, payload):
        key = payload["idempotency_key"]
        with self.registry.lock():
            operation = self.ops.find("migration", key, payload)
            if operation is None:
                if "plan_id" in payload:
                    plan = self._load_plan(payload["plan_id"], payload["option_id"])
                else:
                    workspace = payload["workspace_id"]
                    source, target = self.validate(workspace, payload["target_path"])
                    plan = {"workspace_id": workspace, "source": str(source), "target": str(target)}
                with self.db.session() as session:
                    active = session.scalars(select(StorageOperation).where(StorageOperation.phase.not_in(TERMINAL)))
                    involved = {plan["workspace_id"], plan.get("target_workspace_id")} - {None}
                    if any(involved.intersection((row.plan.get("workspace_id"), row.plan.get("target_workspace_id")))
                           for row in active):
                        raise StorageError("STORAGE_BUSY")
                operation = self.ops.create("migration", key, payload, plan)
                if "plan_id" in payload:
                    self._plan_path(payload["plan_id"]).unlink(missing_ok=True)
        self.ops.submit(operation.id)
        return operation.id

    def _plan_path(self, plan_id):
        return checked_path(self.registry.root / "runtime/migrations" / f"{plan_id}.json")

    def _load_plan(self, plan_id, option_id):
        try:
            frozen = json.loads(self._plan_path(plan_id).read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            raise StorageError("MIGRATION_PLAN_STALE") from exc
        option = next((item for item in frozen["options"] if item["id"] == option_id), None)
        if option is None:
            raise StorageError("INVALID_REQUEST")
        plan = frozen["plan"]
        if "target_workspace_id" in plan:
            plan = {**plan, "groups": [group for group in plan["groups"] if group["id"] in option["groups"]]}
        self._verify_frozen(plan, confirm=True)
        return plan

    def _verify_frozen(self, plan, *, confirm=False):
        source, target = Path(plan["source"]), Path(plan["target"])
        if self.registry.require(plan["workspace_id"], migrating=not confirm) != source:
            raise StorageError("MIGRATION_PLAN_STALE")
        if self.registry.directory_identity(source) != plan["source_identity"]:
            raise StorageError("MIGRATION_PLAN_STALE")
        if "target_workspace_id" in plan:
            if (self.registry.require(plan["target_workspace_id"], migrating=not confirm) != target
                    or self.registry.directory_identity(target) != plan["target_identity"]):
                raise StorageError("MIGRATION_PLAN_STALE")
        elif confirm:
            self.validate(plan["workspace_id"], target)
        _, files = self._inventory(source, plan["workspace_id"], lambda: None)
        if files != plan["files"]:
            raise StorageError("MIGRATION_PLAN_STALE")
        if confirm:
            required = sum(group["bytes"] for group in plan["groups"]) if "groups" in plan else sum(
                info[0] for info in plan["files"].values())
            owned = required if "groups" in plan else sum(plan["files"][key][0] for key in plan["owned"])
            self._check_capacity(source, target, required, managed=owned)

    @staticmethod
    def _requested_bytes(value, unit, base):
        try:
            if type(value) not in (float, int) or unit not in ("GB", "%"):
                raise ValueError
            amount = Decimal(str(value))
            if not amount.is_finite() or amount <= 0 or (unit == "%" and amount > 100):
                raise ValueError
            result = int(amount * (Decimal(base) / 100 if unit == "%" else 10**9))
            if unit == "%" and base == 0:
                return 0
            if not 0 < result <= 2**53 - 1:
                raise ValueError
            return result
        except (InvalidOperation, ValueError, OverflowError) as exc:
            raise StorageError("INVALID_REQUEST", "Invalid migration quantity") from exc

    def _managed_delta(self, source, target, total):
        return 0 if volume_identity(source) == volume_identity(target if target.exists() else target.parent) else total

    def _check_capacity(self, source, target, total, *, managed=None):
        return self.capacity.check(target, total, managed=self._managed_delta(
            source, target, total if managed is None else managed))

    def preflight(self, payload):
        workspace = payload["workspace_id"]
        partial = "target_workspace_id" in payload
        if partial:
            target_id = payload["target_workspace_id"]
            if target_id == workspace:
                raise StorageError("STORAGE_PATH_CONFLICT")
            source, target = self.registry.require(workspace), self.registry.require(target_id)
        else:
            source, target = self.validate(workspace, payload["target_path"])
        directories, files = self._inventory(source, workspace, lambda: None)
        with self.db.session() as session:
            groups = list(managed_groups(session, source, workspace, self.registry.instance_id))
        for group in groups:
            group["bytes"] = sum(files[key][0] for key in group["members"])
        groups.sort(key=lambda group: (-group["bytes"], group["id"]))
        owned = sorted({key for group in groups for key in group["members"]})
        plan = {"workspace_id": workspace, "source": str(source), "target": str(target),
                "source_identity": self.registry.directory_identity(source), "directories": directories,
                "files": files, "owned": owned}
        base = sum(group["bytes"] for group in groups)
        if partial:
            requested = self._requested_bytes(payload["amount"], payload["unit"], base)
            plan.update(target_workspace_id=target_id, target_identity=self.registry.directory_identity(target),
                        requested_bytes=requested, groups=groups)
            options, reason = self._partial_options(source, target, groups, requested)
        else:
            requested = sum(info[0] for info in files.values())
            self._check_capacity(source, target, requested, managed=base)
            options = [{"id": "complete", "bytes": requested, "groups": [], "difference_bytes": 0}]
            reason = None
        plan_id = str(uuid4())
        if options:
            path = self._plan_path(plan_id)
            path.parent.mkdir(mode=0o700, exist_ok=True)
            write_json_atomically(checked_path(path), {"plan": plan, "options": options}, replace=False)
        return {"plan_id": plan_id, "source": str(source), "target": str(target),
                "base_bytes": base, "requested_bytes": requested, "options": options, "reason": reason,
                "groups": groups, "cleanup_files": owned,
                "same_volume": volume_identity(source) == volume_identity(target if target.exists() else target.parent)}

    def _partial_options(self, source, target, groups, requested):
        selected, remaining = [], []
        total = 0
        for group in groups:
            if not group["bytes"]:
                continue
            if total + group["bytes"] <= requested:
                selected.append(group)
                total += group["bytes"]
            else:
                remaining.append(group)

        def option(name, amount, members):
            return {"id": name, "bytes": amount, "groups": [group["id"] for group in members],
                    "difference_bytes": amount - requested}

        options = []
        reason = None
        if selected:
            if any(safe_join_workspace(target, key).exists() for group in selected for key in group["members"]):
                return [], "OBJECT_CONFLICT"
            try:
                self._check_capacity(source, target, total)
            except StorageError as exc:
                return [], exc.code
            options.append(option("exact" if total == requested else "under", total, selected))
        if total < requested:
            for group in sorted(remaining, key=lambda item: (item["bytes"], item["id"])):
                if any(safe_join_workspace(target, key).exists() for key in group["members"]):
                    reason = "OBJECT_CONFLICT"
                    continue
                over = total + group["bytes"]
                try:
                    self._check_capacity(source, target, over)
                except StorageError as exc:
                    reason = exc.code
                    continue
                options.append(option("over", over, [*selected, group]))
                break
        return options, (None if options else reason or "NO_MIGRATION_GROUPS")

    def _inventory(self, source, workspace, checkpoint):
        roots = {WORKSPACE_MARKER, *WORKSPACE_DIRS}
        if any(child.name not in roots for child in source.iterdir()):
            raise StorageError("UNKNOWN_WORKSPACE_CONTENT")
        if any(safe_join_workspace(source, ".staging").iterdir()):
            raise StorageError("RECOVERY_REQUIRED", "Workspace staging needs reconciliation")
        queue = ["objects", "outputs"]
        directories = []
        files = {}
        while queue:
            key = queue.pop()
            folder = safe_join_workspace(source, key)
            directories.append(key)
            for entry in folder.iterdir():
                checkpoint()
                entry = checked_path(entry)
                relative = entry.relative_to(source).as_posix()
                if entry.is_dir():
                    queue.append(relative)
                else:
                    files[relative] = fingerprint(source_stat(entry))
        with self.db.session() as session:
            keys = set(session.scalars(select(AssetLocation.relative_key).where(AssetLocation.workspace_id == workspace)))
            keys.update(session.scalars(select(FormalOutput.relative_key).where(FormalOutput.workspace_id == workspace)))
            if any(key not in files for key in keys):
                raise StorageError("WORKSPACE_FILES_MISSING")
        return directories, files

    def _matches(self, source, target, expected, checkpoint):
        if fingerprint(source_stat(source)) != expected:
            raise StorageError("SOURCE_CHANGED")
        if source_stat(target).st_size != expected[0]:
            raise StorageError("COPY_VERIFY_FAILED")
        digest = file_hash(target, checkpoint)
        if file_hash(source, checkpoint) != digest:
            raise StorageError("COPY_VERIFY_FAILED")
        if fingerprint(source_stat(source)) != expected:
            raise StorageError("SOURCE_CHANGED")
        return digest

    def run(self, operation):
        plan = operation.plan
        if "target_workspace_id" in plan:
            self._run_partial(operation)
            return
        workspace, operation_id = plan["workspace_id"], operation.id
        source, target = Path(plan["source"]), Path(plan["target"])
        with self.registry.lease(workspace, timeout=5):
            if operation.phase == "committed":
                self._complete(operation_id, workspace, target, plan)
                return
            self.ops.checkpoint(operation_id)
            if self.registry.require(workspace, migrating=True) != source:
                raise StorageError("RECOVERY_REQUIRED")
            with self.registry.lock():
                self.registry.candidate(target, exclude=operation_id)
            if "files" not in plan:
                directories, files = self._inventory(source, workspace, lambda: self.ops.checkpoint(operation_id))
                with self.db.session() as session:
                    owned = sorted({
                        key for group in managed_groups(session, source, workspace, self.registry.instance_id)
                        for key in group["members"]
                    })
                plan = {**plan, "directories": directories, "files": files, "owned": owned,
                        "source_identity": self.registry.directory_identity(source)}
                self.ops.advance(operation_id, phase="preparing", plan=plan, error=None)
            self._copy_and_commit(operation, plan, source, target)

    def _run_partial(self, operation):
        plan = operation.plan
        source, target = Path(plan["source"]), Path(plan["target"])
        workspace, destination = plan["workspace_id"], plan["target_workspace_id"]
        operation_id = operation.id
        receipt = operation.receipt or {"processed": 0, "total": len(plan["groups"]),
                                        "source_path": str(source), "target_path": str(target),
                                        "verification": "sha256", "requested_bytes": plan["requested_bytes"],
                                        "completed_bytes": 0, "cleanup_remaining": [], "groups": []}
        with ExitStack() as stack:
            for workspace_id in sorted((workspace, destination)):
                stack.enter_context(self.registry.lease(workspace_id, timeout=5))
            if (self.registry.require(workspace, migrating=True) != source
                    or self.registry.require(destination, migrating=True) != target
                    or self.registry.directory_identity(source) != plan["source_identity"]
                    or self.registry.directory_identity(target) != plan["target_identity"]):
                raise StorageError("MIGRATION_PLAN_STALE")
            if operation.phase == "queued":
                self.ops.checkpoint(operation_id)
                self._verify_frozen(plan)
            receipt = self._clean_partial(source, target, plan, receipt)
            if operation.phase == "committed":
                self._finish_partial(operation_id, receipt)
                return
            pending = plan["groups"][receipt["processed"]:]
            physical = sum(plan["files"][key][0] for group in pending for key in group["members"]
                           if not safe_join_workspace(target, key).exists())
            managed = self._managed_delta(source, target, sum(group["bytes"] for group in pending))
            with self.capacity.reserve(target, physical, managed=managed) as reservation:
                for group in pending:
                    if self.ops.get(operation_id).cancel_requested and operation.phase != "publishing":
                        self._finish_partial(operation_id, receipt, cancelled=True)
                        return
                    receipt = self._copy_group(operation_id, plan, group, receipt, source, target, reservation)
                    receipt = self._clean_partial(source, target, plan, receipt)
                    self.ops.advance(operation_id, receipt=receipt)
                    operation = self.ops.get(operation_id)
            self._finish_partial(operation_id, receipt)

    def _copy_group(self, operation_id, plan, group, receipt, source, target, reservation):
        workspace, destination = plan["workspace_id"], plan["target_workspace_id"]
        self.ops.advance(operation_id, phase="publishing", receipt=receipt, error=None)
        staging = safe_join_workspace(target, f".staging/{operation_id}")
        owner = {"instance_id": self.registry.instance_id, "operation_id": operation_id, "workspace_id": destination}
        claim_directory(staging, MIGRATION_MARKER, owner)
        hashes = {}
        for index, key in enumerate(group["members"]):
            old = safe_join_workspace(source, key)
            new = safe_join_workspace(target, key)
            expected = plan["files"][key]
            if fingerprint(source_stat(old)) != expected:
                raise StorageError("SOURCE_CHANGED")
            original_hash = file_hash(old, lambda: None)
            if ("formal_outputs" not in group and key.endswith("/manifest.json")
                    and len(group["members"]) > 1):
                updated = {**read_json(old), "workspace_id": destination}
                expected_result = json.dumps(updated, ensure_ascii=False, allow_nan=False).encode("utf-8")
            else:
                expected_result = None
            if not new.exists():
                part = safe_join_workspace(staging, f"{index}.part")
                remove_stage(part)
                if expected_result is None:
                    stage_copy(old, part, expected, lambda: None, checksum=True)
                    os.utime(part, ns=(part.stat().st_atime_ns, expected[1]))
                else:
                    write_json_atomically(part, updated, replace=False)
                new.parent.mkdir(parents=True, exist_ok=True)
                publish_object(part, new)
                self.capacity.materialized(reservation, expected[0])
            new_hash = file_hash(new, lambda: None)
            if (new.read_bytes() != expected_result if expected_result is not None else new_hash != original_hash):
                raise StorageError("COPY_VERIFY_FAILED")
            if fingerprint(source_stat(old)) != expected:
                raise StorageError("SOURCE_CHANGED")
            hashes[key] = [original_hash, new_hash]
        moved = {"id": group["id"], "workspace_id": destination, "files": hashes, "bytes": group["bytes"]}
        result = {**receipt, "processed": receipt["processed"] + 1,
                  "completed_bytes": receipt["completed_bytes"] + group["bytes"],
                  "groups": [*receipt["groups"], moved],
                  "cleanup_remaining": [*receipt["cleanup_remaining"], *group["members"]]}
        managed = self._managed_delta(source, target, group["bytes"])
        with self.capacity.lock, self.db.session() as session:
            self.capacity.recheck(reservation, target, 0, managed)
            is_formal = group.get("formal", False)
            rows = group.get("formal_outputs", ((group["id"], group["members"][0]),))
            for output_id, key in rows:
                row = session.get(FormalOutput if is_formal else AssetLocation, output_id)
                if row is None or row.workspace_id != workspace or row.relative_key != key:
                    raise StorageError("MIGRATION_PLAN_STALE")
                row.workspace_id = destination
                if is_formal:
                    legacy = session.scalar(select(AssetLocation).where(
                        AssetLocation.workspace_id == workspace, AssetLocation.relative_key == key))
                    if legacy is not None:
                        legacy.workspace_id = destination
            job = session.get(StorageOperation, operation_id)
            job.phase, job.receipt = "copying", result
        self.capacity.committed(reservation, managed)
        return result

    def _clean_partial(self, source, target, plan, receipt):
        pending = set(receipt["cleanup_remaining"])
        failures = []
        for group in receipt["groups"]:
            for key, (original_hash, new_hash) in group["files"].items():
                if key not in pending:
                    continue
                try:
                    old = safe_join_workspace(source, key)
                    new = safe_join_workspace(target, key)
                    if file_hash(new, lambda: None) != new_hash:
                        raise StorageError("COPY_VERIFY_FAILED")
                    if old.exists():
                        if (fingerprint(source_stat(old)) != plan["files"][key]
                                or file_hash(old, lambda: None) != original_hash):
                            raise StorageError("SOURCE_CHANGED")
                        old.unlink()
                    if old.parent not in {source / part for part in WORKSPACE_DIRS} and old.parent.is_dir() and not any(old.parent.iterdir()):
                        old.parent.rmdir()
                except (StorageError, OSError):
                    failures.append(key)
        return {**receipt, "cleanup_remaining": failures}

    def _finish_partial(self, operation_id, receipt, *, cancelled=False):
        operation = self.ops.get(operation_id)
        plan = operation.plan
        target = Path(plan["target"])
        staging = safe_join_workspace(target, f".staging/{operation_id}")
        owner = {"instance_id": self.registry.instance_id, "operation_id": operation_id,
                 "workspace_id": plan["target_workspace_id"]}
        if marker_matches(staging, MIGRATION_MARKER, owner) and set(staging.iterdir()) == {staging / MIGRATION_MARKER}:
            (staging / MIGRATION_MARKER).unlink()
            staging.rmdir()
        phase = "cancelled" if cancelled or receipt.get("stopped_early") else "completed"
        error = "OPERATION_CANCELLED" if phase == "cancelled" else None
        if receipt["cleanup_remaining"]:
            receipt = {**receipt, "stopped_early": phase == "cancelled"}
            phase, error = "committed", "SOURCE_CLEANUP_PENDING"
        self.ops.advance(operation_id, phase=phase, receipt=receipt, error=error)

    def _copy_and_commit(self, operation, plan, source, target):
        operation_id = operation.id
        workspace = plan["workspace_id"]
        ownership = {"instance_id": self.registry.instance_id, "operation_id": operation_id,
                     "workspace_id": workspace}
        checkpoint = lambda: self.ops.checkpoint(operation_id)
        claim_directory(target, MIGRATION_MARKER, ownership)
        for directory in [".staging", *plan["directories"]]:
            safe_join_workspace(target, directory).mkdir(exist_ok=True)
        if operation.phase != "publishing":
            self.ops.advance(operation_id, phase="copying", error=None)
        progress = operation.receipt or {"processed": 0, "total": len(plan["files"]), "verification": "sha256",
                                         "source_path": str(source), "target_path": str(target)}
        unfinished = list(plan["files"].items())[progress["processed"]:]
        physical = sum(expected[0] for key, expected in unfinished if not safe_join_workspace(target, key).exists())
        managed = self._managed_delta(source, target, sum(plan["files"][key][0] for key in plan.get("owned", ())))
        with self.capacity.reserve(target, physical, managed=managed) as reservation:
            self._copy_all(operation_id, checkpoint, plan, source, target, ownership, progress, reservation)
        self._complete(operation_id, workspace, target, plan)

    def _copy_all(self, operation_id, checkpoint, plan, source, target, ownership, progress, reservation):
        workspace = plan["workspace_id"]
        for index, (key, expected) in enumerate(plan["files"].items()):
            checkpoint()
            if not marker_matches(target, MIGRATION_MARKER, ownership):
                raise StorageError("RECOVERY_REQUIRED")
            original, destination = safe_join_workspace(source, key), safe_join_workspace(target, key)
            if index < progress["processed"]:
                if not destination.exists():
                    raise StorageError("COPY_VERIFY_FAILED")
                continue
            part = safe_join_workspace(target, f".staging/{operation_id}-{index}.part")
            if destination.exists():
                self._matches(original, destination, expected, checkpoint)
            else:
                remove_stage(part)
                stage_copy(original, part, expected, checkpoint, checksum=True)
                os.utime(part, ns=(part.stat().st_atime_ns, expected[1]))
                publish_object(part, destination)
                self.capacity.materialized(reservation, expected[0])
            progress = {**progress, "processed": index + 1}
            self.ops.advance(operation_id, receipt=progress)
        self.ops.advance(operation_id, phase="verifying")
        if self.registry.require(workspace, migrating=True) != source:
            raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
        directories, files = self._inventory(source, workspace, checkpoint)
        if set(directories) != set(plan["directories"]) or files != plan["files"]:
            raise StorageError("SOURCE_CHANGED")
        owned = set(plan.get("owned", ()))
        cleanup_hashes = {}
        for key, expected in plan["files"].items():
            digest = self._matches(safe_join_workspace(source, key), safe_join_workspace(target, key), expected, checkpoint)
            if key in owned:
                cleanup_hashes[key] = digest
        checkpoint()
        progress = {**progress, "_cleanup_hashes": cleanup_hashes}
        self.ops.advance(operation_id, phase="publishing", receipt=progress)
        identity = self.registry.identity(workspace)
        marker = safe_join_workspace(target, WORKSPACE_MARKER)
        if not marker.exists():
            write_json_atomically(marker, identity)
        if not marker_matches(target, WORKSPACE_MARKER, identity):
            raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
        self.capacity.recheck(reservation, target, 0, reservation.managed)
        with self.registry.lock(), self.db.session() as session:
            row = session.get(StorageOperation, operation_id)
            if row.cancel_requested:
                raise StorageError("OPERATION_CANCELLED")
            rebind_workspace(session, workspace, target)
            row.phase, row.receipt, row.error = "committed", progress, None

    def _complete(self, operation_id, workspace, target, plan):
        if self.registry.require(workspace, migrating=True) != target:
            raise StorageError("RECOVERY_REQUIRED")
        self.registry.record_evidence(workspace, target)
        marker = safe_join_workspace(target, MIGRATION_MARKER)
        identity = {"instance_id": self.registry.instance_id, "operation_id": operation_id, "workspace_id": workspace}
        if marker_matches(target, MIGRATION_MARKER, identity):
            marker.unlink()
        row = self.ops.get(operation_id)
        source = Path(plan["source"])
        receipt = self._clear_source(source, workspace, target, plan, row.receipt)
        receipt["completed_bytes"] = sum(info[0] for info in plan["files"].values())
        self.ops.advance(operation_id, phase="committed" if receipt["cleanup_remaining"] else "completed",
                         receipt=receipt, error="SOURCE_CLEANUP_PENDING" if receipt["cleanup_remaining"] else None)

    def _clear_source(self, source, workspace, target, plan, receipt):
        owned = plan.get("owned", [])
        if not owned and "source_identity" not in plan:
            # An older committed job has no deletion authorization in its frozen plan.
            return {**receipt, "cleanup_remaining": [], "old_root_retained": source.exists()}
        remaining = []
        removed = 0
        identity = self.registry.identity(workspace)
        source_exists = source.exists()
        if not source_exists:
            parent = next(path for path in source.parents if path.exists())
            if volume_identity(parent) != plan["source_identity"]["volume"]:
                return {**receipt, "cleanup_remaining": owned, "old_root_retained": True}
        elif (not marker_matches(source, WORKSPACE_MARKER, identity)
              or self.registry.directory_identity(source) != plan["source_identity"]):
            return {**receipt, "cleanup_remaining": owned, "old_root_retained": True}
        hashes = receipt.get("_cleanup_hashes", {})
        for key in owned:
            try:
                old_file = safe_join_workspace(source, key) if source_exists else None
                new_file = safe_join_workspace(target, key)
                expected = plan["files"][key]
                digest = hashes.get(key)
                if old_file is not None and old_file.exists():
                    verified = self._matches(old_file, new_file, expected, lambda: None)
                    if digest is not None and verified != digest:
                        raise StorageError("COPY_VERIFY_FAILED")
                    old_file.unlink()
                # Older committed receipts record sizes but do not have hashes.
                elif (source_stat(new_file).st_size != expected[0]
                      or (digest is not None and file_hash(new_file, lambda: None) != digest)):
                    raise StorageError("COPY_VERIFY_FAILED")
                removed += 1
            except (OSError, StorageError):
                remaining.append(key)
        if source_exists and not remaining:
            for folder in sorted({(source / key).parent for key in owned}
                                 | {source / part for part in WORKSPACE_DIRS}, key=lambda path: -len(path.parts)):
                folder = checked_path(folder)
                if folder.is_dir() and not any(folder.iterdir()):
                    folder.rmdir()
            marker = checked_path(source / WORKSPACE_MARKER)
            if set(source.iterdir()) == {marker}:
                marker.unlink()
                source.rmdir()
        return {**receipt, "cleanup_remaining": remaining, "cleared": removed,
                "old_root_retained": source.exists()}

    def discard_target(self, operation_id, *, confirm=False):
        operation = self.ops.get(operation_id, "migration")
        plan = operation.plan
        if operation.phase not in {"cancelled", "failed"} or "target_workspace_id" in plan:
            raise StorageError("RECOVERY_REQUIRED", "This job is not eligible for target cleanup")
        source, target = Path(plan["source"]), Path(plan["target"])
        workspace = plan["workspace_id"]
        owner = {"instance_id": self.registry.instance_id, "operation_id": operation_id, "workspace_id": workspace}
        with self.registry.lease(workspace):
            if self.registry.require(workspace) != source:
                raise StorageError("RECOVERY_REQUIRED")
            if not marker_matches(target, MIGRATION_MARKER, owner):
                if not target.exists():
                    return {"files": [], "removed": 0}
                raise StorageError("RECOVERY_REQUIRED", "Target no longer belongs to this job")
            files = []
            for index, (key, expected) in enumerate(plan.get("files", {}).items()):
                path = safe_join_workspace(target, key)
                part = safe_join_workspace(target, f".staging/{operation_id}-{index}.part")
                if path.exists():
                    try:
                        self._matches(safe_join_workspace(source, key), path, expected, lambda: None)
                    except StorageError:
                        continue
                    files.append(path)
                if part.is_file():
                    files.append(part)
            log = {"files": [path.relative_to(target).as_posix() for path in files], "removed": 0}
            if not confirm:
                return log
            for path in files:
                path.unlink()
            for key in sorted([".staging", *plan.get("directories", [])], key=lambda value: -value.count("/")):
                path = safe_join_workspace(target, key)
                if path.is_dir() and not any(path.iterdir()):
                    path.rmdir()
            owned_markers = {target / MIGRATION_MARKER}
            if marker_matches(target, WORKSPACE_MARKER, self.registry.identity(workspace)):
                owned_markers.add(target / WORKSPACE_MARKER)
            if set(target.iterdir()) == owned_markers:
                for marker in owned_markers:
                    marker.unlink()
                target.rmdir()
            log.update(removed=len(files), target_retained=target.exists())
            self.ops.advance(operation_id, receipt={**operation.receipt, "target_cleanup": log})
            return log

