"""Recoverable whole-Workspace migration with a transactional root switch."""

from pathlib import Path

from sqlalchemy import select

from ..core.config import write_json_atomically
from ..core.errors import StorageError
from ..database.models import AssetLocation, StorageOperation
from .initializer import WORKSPACE_MARKER, claim_directory, marker_matches
from .locations import TERMINAL, WORKSPACE_DIRS, rebind_workspace
from .manager import choose_space, file_hash, fingerprint, publish_object, remove_stage, source_stat, stage_copy
from .paths import checked_path, safe_join_workspace

MIGRATION_MARKER = ".astrophoto-migration.json"


class WorkspaceMigrationService:
    def __init__(self, runtime):
        self.registry = runtime.workspaces
        self.ops = runtime.operations
        self.db = runtime.db

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
                workspace = payload["workspace_id"]
                source, target = self.validate(workspace, payload["target_path"])
                with self.db.session() as session:
                    active = session.scalars(select(StorageOperation).where(StorageOperation.phase.not_in(TERMINAL)))
                    if any(row.plan.get("workspace_id") == workspace for row in active):
                        raise StorageError("STORAGE_BUSY")
                operation = self.ops.create("migration", key, payload, {
                    "workspace_id": workspace, "source": str(source), "target": str(target),
                })
        self.ops.submit(operation.id)
        return operation.id

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
            keys = session.scalars(select(AssetLocation.relative_key).where(AssetLocation.workspace_id == workspace))
            if any(key not in files for key in keys):
                raise StorageError("WORKSPACE_FILES_MISSING")
        return directories, files

    def _matches(self, source, target, expected, checkpoint):
        if fingerprint(source_stat(source)) != expected:
            raise StorageError("SOURCE_CHANGED")
        if source_stat(target).st_size != expected[0] or file_hash(source, checkpoint) != file_hash(target, checkpoint):
            raise StorageError("COPY_VERIFY_FAILED")
        if fingerprint(source_stat(source)) != expected:
            raise StorageError("SOURCE_CHANGED")

    def run(self, operation):
        plan = operation.plan
        workspace, operation_id = plan["workspace_id"], operation.id
        source, target = Path(plan["source"]), Path(plan["target"])
        with self.registry.lease(workspace):
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
                choose_space(target if target.exists() else target.parent, sum(info[0] for info in files.values()))
                plan = {**plan, "directories": directories, "files": files}
                self.ops.advance(operation_id, phase="preparing", plan=plan, error=None)
            self._copy_and_commit(operation, plan, source, target)

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
                                         "old_root_retained": True}
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
                publish_object(part, destination)
            progress = {**progress, "processed": index + 1}
            self.ops.advance(operation_id, receipt=progress)
        self.ops.advance(operation_id, phase="verifying")
        if self.registry.require(workspace, migrating=True) != source:
            raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
        directories, files = self._inventory(source, workspace, checkpoint)
        if set(directories) != set(plan["directories"]) or files != plan["files"]:
            raise StorageError("SOURCE_CHANGED")
        for key, expected in plan["files"].items():
            self._matches(safe_join_workspace(source, key), safe_join_workspace(target, key), expected, checkpoint)
        checkpoint()
        self.ops.advance(operation_id, phase="publishing", receipt=progress)
        identity = self.registry.identity(workspace)
        marker = safe_join_workspace(target, WORKSPACE_MARKER)
        if not marker.exists():
            write_json_atomically(marker, identity)
        if not marker_matches(target, WORKSPACE_MARKER, identity):
            raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
        with self.registry.lock(), self.db.session() as session:
            row = session.get(StorageOperation, operation_id)
            if row.cancel_requested:
                raise StorageError("OPERATION_CANCELLED")
            rebind_workspace(session, workspace, target)
            row.phase, row.receipt, row.error = "committed", progress, None
        self._complete(operation_id, workspace, target, plan)

    def _complete(self, operation_id, workspace, target, plan):
        if self.registry.require(workspace, migrating=True) != target:
            raise StorageError("RECOVERY_REQUIRED")
        for key, expected in plan["files"].items():
            if source_stat(safe_join_workspace(target, key)).st_size != expected[0]:
                raise StorageError("COPY_VERIFY_FAILED")
        marker = safe_join_workspace(target, MIGRATION_MARKER)
        identity = {"instance_id": self.registry.instance_id, "operation_id": operation_id, "workspace_id": workspace}
        if marker_matches(target, MIGRATION_MARKER, identity):
            marker.unlink()
        self.ops.advance(operation_id, phase="completed", error=None)

