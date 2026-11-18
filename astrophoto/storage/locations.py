"""Workspace identity, registration and write coordination."""

import os
import shutil
import tempfile
from contextlib import contextmanager
from pathlib import Path
from uuid import uuid4

from filelock import FileLock, Timeout
from sqlalchemy import select

from ..core.config import load_storage_settings, read_json, write_storage_settings
from ..core.errors import StorageError
from ..database.models import AssetLocation, StorageLocation, StorageOperation
from .initializer import WORKSPACE_MARKER, acquire_bootstrap_lock, claim_directory, marker_matches
from .paths import canonicalize_root, checked_path, validate_no_overlap

TERMINAL = ("completed", "failed", "cancelled")
WORKSPACE_DIRS = ("objects", "outputs", ".staging")


class WorkspaceRegistry:
    def __init__(self, root, instance_id, database):
        self.root = root
        self.instance_id = instance_id
        self.db = database

    def identity(self, workspace_id):
        return {"format_version": 1, "instance_id": self.instance_id, "workspace_id": workspace_id}

    def lock(self):
        return acquire_bootstrap_lock(self.root)

    @contextmanager
    def lease(self, workspace_id):
        try:
            lock = FileLock(checked_path(self.root / "runtime/locks" / f"workspace-{workspace_id}.lock"), timeout=0)
            with lock:
                yield
        except Timeout as exc:
            raise StorageError("STORAGE_BUSY") from exc

    def get(self, workspace_id):
        with self.db.session() as session:
            location = session.get(StorageLocation, workspace_id)
            if location is None:
                raise StorageError("WORKSPACE_NOT_FOUND")
            return location

    def list(self):
        with self.db.session() as session:
            return list(session.scalars(select(StorageLocation).order_by(StorageLocation.name, StorageLocation.id)))

    def reserved(self, exclude=None):
        with self.db.session() as session:
            paths = [Path(r.root_path) for r in session.scalars(select(StorageLocation)) if r.id != exclude]
            migrations = session.scalars(select(StorageOperation).where(
                StorageOperation.kind == "migration", StorageOperation.phase.not_in(TERMINAL)
            ))
            paths.extend(Path(row.plan["target"]) for row in migrations if row.id != exclude)
        return paths

    def candidate(self, path, *, exclude=None, default="workspace"):
        target = canonicalize_root(path)
        settings = load_storage_settings(self.root)
        reserved = self.reserved(exclude)
        if default != "cache":
            reserved.append(Path(settings["cache"]["path"]))
        validate_no_overlap(target, reserved, self.root, default)
        if not target.parent.is_dir():
            raise StorageError("STORAGE_PATH_UNWRITABLE", "Target parent must exist")
        return target

    def _create(self, path, name, workspace_id):
        claim_directory(path, WORKSPACE_MARKER, self.identity(workspace_id))
        for part in WORKSPACE_DIRS:
            checked_path(path / part).mkdir(exist_ok=True)
        with self.db.session() as session:
            session.add(StorageLocation(id=workspace_id, name=name, root_path=str(path),
                                        canonical_root=os.path.normcase(str(path))))
        return self.get(workspace_id)

    def ensure_default(self, manifest, settings):
        initial_id = manifest["initial_workspace_id"]
        default_id = settings["workspace"]["default_workspace_id"]
        if not manifest["initialized"]:
            if default_id != initial_id:
                raise StorageError("RECOVERY_REQUIRED")
            existing = self.list()
            if not existing:
                self._create(self.root / "workspace", "Local", initial_id)
            elif (len(existing) != 1 or existing[0].id != initial_id
                  or Path(existing[0].root_path) != self.root / "workspace"):
                raise StorageError("RECOVERY_REQUIRED")
            if self.check_status(self.get(initial_id))["status"] != "online":
                raise StorageError("RECOVERY_REQUIRED", "Default Workspace identity or permissions are invalid")
        self.get(default_id)

    def register(self, path, name):
        name = validate_name(name)
        with self.lock():
            target = self.candidate(path)
            marker = checked_path(target / WORKSPACE_MARKER)
            workspace_id = str(uuid4())
            if marker.exists():
                # Reconcile an interrupted registration only while the directory has no business data.
                try:
                    identity = read_json(marker)
                    from uuid import UUID
                    prior = str(UUID(identity["workspace_id"]))
                    empty_layout = all(
                        child.name == WORKSPACE_MARKER or (
                            child.name in WORKSPACE_DIRS and checked_path(child).is_dir() and not any(child.iterdir())
                        ) for child in target.iterdir()
                    )
                except (ValueError, TypeError, AttributeError, KeyError, OSError) as exc:
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH") from exc
                if not empty_layout or identity != self.identity(prior) or any(row.id == prior for row in self.list()):
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
                workspace_id = prior
            return self.check_status(self._create(target, name, workspace_id))

    def check_status(self, location, *, probe_migration=True):
        path = Path(location.root_path)
        status = "offline"
        total = free = None
        try:
            checked_path(path)
            if path.is_dir():
                if not marker_matches(path, WORKSPACE_MARKER, self.identity(location.id)):
                    status = "identity_mismatch"
                else:
                    usage = shutil.disk_usage(path)
                    total, free = usage.total, usage.free
                    status = "online" if os.access(path, os.W_OK | os.X_OK) and path.stat().st_mode & 0o222 else "read_only"
        except (OSError, StorageError):
            status = "error"
        if not location.enabled:
            status = "disabled"
        if probe_migration:
            with self.db.session() as session:
                active = session.scalars(select(StorageOperation).where(
                    StorageOperation.kind == "migration", StorageOperation.phase.not_in(TERMINAL)
                ))
                if any(row.plan["workspace_id"] == location.id for row in active):
                    status = "migrating"
        return {"id": location.id, "name": location.name, "root_path": str(path), "enabled": location.enabled,
                "revision": location.revision, "status": status, "total_bytes": total, "free_bytes": free}

    def validate(self, workspace_id):
        location = self.get(workspace_id)
        with self.lease(workspace_id):
            view = self.check_status(location)
            if view["status"] == "online":
                try:
                    with tempfile.TemporaryFile(dir=checked_path(Path(location.root_path) / ".staging")):
                        pass
                except PermissionError:
                    view["status"] = "read_only"
                except (OSError, StorageError):
                    view["status"] = "error"
            return view

    def require(self, workspace_id, *, write=True, migrating=False):
        location = self.get(workspace_id)
        status = self.check_status(location, probe_migration=not migrating)["status"]
        if status != "online" and (write or status != "read_only"):
            code = "STORAGE_BUSY" if status == "migrating" else f"WORKSPACE_{status.upper()}"
            raise StorageError(code)
        return Path(location.root_path)

    def update(self, workspace_id, revision, *, name=None, enabled=None, default=False):
        self.get(workspace_id)
        with self.lease(workspace_id), self.lock():
            settings = load_storage_settings(self.root)
            is_default = settings["workspace"]["default_workspace_id"] == workspace_id
            if enabled is False and (default or is_default):
                raise StorageError("DEFAULT_WORKSPACE_REQUIRED")
            location = self.get(workspace_id)
            expected = settings["revision"] if default else location.revision
            if type(revision) is not int or expected != revision:
                raise StorageError("REVISION_CONFLICT")
            if default:
                if name is not None or enabled is not None:
                    raise StorageError("INVALID_REQUEST", "Set default separately")
                self.require(workspace_id)
                settings["workspace"]["default_workspace_id"] = workspace_id
                write_storage_settings(self.root, settings, settings["revision"])
            else:
                if self.check_status(location)["status"] == "migrating":
                    raise StorageError("STORAGE_BUSY")
                with self.db.session() as session:
                    row = session.get(StorageLocation, workspace_id)
                    if name is not None:
                        row.name = validate_name(name)
                    if enabled is not None:
                        row.enabled = enabled
                    row.revision += 1
            return self.check_status(self.get(workspace_id))

    def relocate(self, workspace_id, path):
        self.get(workspace_id)
        with self.lease(workspace_id), self.lock():
            location = self.get(workspace_id)
            info = self.check_status(location)
            if info["status"] == "migrating":
                raise StorageError("STORAGE_BUSY")
            old = Path(location.root_path)
            if marker_matches(old, WORKSPACE_MARKER, self.identity(workspace_id)):
                raise StorageError("WORKSPACE_NOT_OFFLINE")
            target = self.candidate(path, exclude=workspace_id)
            if not marker_matches(target, WORKSPACE_MARKER, self.identity(workspace_id)):
                raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
            with self.db.session() as session:
                rebind_workspace(session, workspace_id, target)
            return self.check_status(self.get(workspace_id))

    def remove(self, workspace_id, revision):
        self.get(workspace_id)
        with self.lease(workspace_id), self.lock(), self.db.session() as session:
            if load_storage_settings(self.root)["workspace"]["default_workspace_id"] == workspace_id:
                raise StorageError("DEFAULT_WORKSPACE_REQUIRED")
            row = session.get(StorageLocation, workspace_id)
            if type(revision) is not int or row.revision != revision:
                raise StorageError("REVISION_CONFLICT")
            if session.scalar(select(AssetLocation.id).where(AssetLocation.workspace_id == workspace_id).limit(1)):
                raise StorageError("WORKSPACE_HAS_ASSETS")
            active = session.scalars(select(StorageOperation).where(StorageOperation.phase.not_in(TERMINAL)))
            if any(op.plan.get("workspace_id") == workspace_id for op in active):
                raise StorageError("STORAGE_BUSY")
            session.delete(row)
        return {"removed": True}


def rebind_workspace(session, workspace_id, target):
    location = session.get(StorageLocation, workspace_id)
    location.root_path = str(target)
    location.canonical_root = os.path.normcase(str(target))
    location.revision += 1


def validate_name(name):
    if not isinstance(name, str) or not name.strip() or len(name) > 120:
        raise StorageError("INVALID_WORKSPACE_NAME")
    return name.strip()

