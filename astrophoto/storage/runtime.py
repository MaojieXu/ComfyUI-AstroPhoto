"""Storage service composition and live state."""

from __future__ import annotations

import os
from collections.abc import Callable
from contextlib import ExitStack
from pathlib import Path
from threading import Event, Lock
from uuid import UUID

from filelock import Timeout
from sqlalchemy import or_, select

from ..assets.direct_import import DirectImportService
from ..assets.imports import AssetImportService
from ..assets.library import PhotographyLibrary
from ..assets.managed_rename import recover_managed_renames
from ..assets.service import AssetService
from .migration import WorkspaceMigrationService
from .operations import Operations

from ..core.config import (
    load_storage_settings, validate_canvas_preview, validate_limit, validate_mode, validate_preview_longest_edge,
    write_json_atomically, write_storage_settings,
)
from ..core.errors import StorageError
from ..database.manager import DatabaseManager
from ..database.models import StorageOperation
from ..equipment.service import EquipmentService
from ..equipment.trains import OpticalTrainService
from .cache import CacheManager
from .aggregation import AggregationRuns
from .capacity import VolumeCapacity
from .initializer import (
    CACHE_MARKER, DATABASE_FILE, DEFAULT_CACHE, TRANSFER_MARKER, WORKSPACE_MARKER, acquire_bootstrap_lock, check_data_root,
    discard_bootstrap_scratch, ensure_data_root, load_manifest, load_or_create_manifest, load_or_create_settings,
    marker_matches,
)
from .locations import TERMINAL, WORKSPACE_DIRS, WorkspaceRegistry
from .paths import canonicalize_root, checked_path


class StorageRuntime:
    def __init__(self, root, manifest, database, environ):
        self.root = root
        self.instance_lock = None
        self.root_lock = None
        self.data_root_receipt = None
        self.closing = Event()
        self.formal_processing = Lock()
        self.db = database
        self.workspaces = WorkspaceRegistry(root, manifest["instance_id"], database)
        self.initial_workspace_id = manifest["initial_workspace_id"]
        self.lock_directory_id = (root / "runtime/locks").stat()
        self.capacity = VolumeCapacity(self.workspaces)
        self.cache = CacheManager(self.workspaces)
        self.aggregation = AggregationRuns(self)
        self.environ = dict(environ)
        self.operations = Operations(self)
        self.assets = AssetService(self)
        self.library = PhotographyLibrary(self)
        self.equipment = EquipmentService(database)
        self.optical_trains = OpticalTrainService(database)
        self.imports = AssetImportService(self)
        self.direct_imports = DirectImportService(self)
        self.migrations = WorkspaceMigrationService(self)

    @classmethod
    def initialize(cls, root, environ, *, prepare: Callable[[StorageRuntime], None] | None = None,
                   recover_cache=False, host_temp=None):
        root = canonicalize_root(root)
        check_data_root(root)
        if checked_path(root / TRANSFER_MARKER).exists():
            raise StorageError("RECOVERY_REQUIRED", "This Data Root is a previous snapshot")
        root.mkdir(parents=True, exist_ok=True, mode=0o700)
        try:
            return cls._initialize(root, environ, prepare, recover_cache, host_temp)
        except Timeout as exc:
            raise StorageError("STORAGE_BUSY") from exc

    @classmethod
    def _initialize(cls, root, environ, prepare, recover_cache, host_temp):
        with acquire_bootstrap_lock(root):
            manifest = load_or_create_manifest(root)
            if not manifest["initialized"]:
                ensure_data_root(root)
            settings = load_or_create_settings(root, manifest)
            database = DatabaseManager(root / DATABASE_FILE)
            creating = not manifest["initialized"]
            if creating:
                discard_bootstrap_scratch(root / "storage" / "Local" / WORKSPACE_MARKER)
            database.initialize(manifest["instance_id"], creating=creating)
            service = cls(root, manifest, database, environ)
            service.workspaces.ensure_default(manifest, settings)
            service.workspaces.capture_existing_identities(creating=creating)
            if host_temp is not None:
                service.cache.use_host_temp(host_temp)
            if creating:
                write_json_atomically(root / "config/manifest.json", {**manifest, "initialized": True})
        if recover_cache and not creating:
            service.cache.clear_after_session()
        if prepare is not None:
            prepare(service)
        with service.workspaces.lock():
            recover_managed_renames(service)
        service.direct_imports.recover()
        service.operations.recover()
        return service

    def _layout_settings(self):
        manifest = load_manifest(self.root)
        if (not manifest["initialized"] or manifest["instance_id"] != self.workspaces.instance_id
                or manifest["initial_workspace_id"] != self.initial_workspace_id
                or checked_path(self.root / TRANSFER_MARKER).exists()):
            raise StorageError("RECOVERY_REQUIRED", "Storage manifest does not identify the active instance")
        return load_storage_settings(self.root)

    def _layout_workspaces(self, settings):
        if self.closing.is_set():
            raise StorageError("STORAGE_BUSY")
        if self.db.path != self.root / DATABASE_FILE:
            raise StorageError("RECOVERY_REQUIRED", "Active database path changed")
        try:
            self.db.health(instance_id=self.workspaces.instance_id)
        except StorageError as exc:
            raise StorageError(exc.code, str(exc), details={"path": str(self.db.path)}) from exc
        ids = sorted(row.id for row in self.workspaces.list() if row.enabled)
        for workspace_id in ids:
            try:
                if str(UUID(workspace_id)) != workspace_id:
                    raise ValueError()
            except (ValueError, TypeError, AttributeError) as exc:
                raise StorageError("RECOVERY_REQUIRED", "Invalid registered workspace ID") from exc
        if settings["workspace"]["default_workspace_id"] not in ids:
            raise StorageError("RECOVERY_REQUIRED", "The default workspace has no enabled registration")
        return ids

    def _layout_gaps(self, settings, workspace_ids):
        if not checked_path(self.root / "storage").is_dir():
            raise StorageError("RECOVERY_REQUIRED", "The managed storage directory is missing",
                               details={"path": str(self.root / "storage")})
        cache = self.workspaces.candidate(settings["cache"]["path"], cache=True)
        optional_cache = cache == self.root / DEFAULT_CACHE and not cache.exists()
        if not optional_cache and not marker_matches(cache, CACHE_MARKER, self.cache.identity):
            raise StorageError("CACHE_IDENTITY_MISMATCH", details={"path": str(cache)})
        directories = {}
        for workspace_id in workspace_ids:
            location = self.workspaces.get(workspace_id)
            path = Path(location.root_path)
            details = {"workspace_id": workspace_id, "path": str(path)}
            try:
                workspace = checked_path(path)
                if not workspace.is_dir():
                    raise StorageError("WORKSPACE_OFFLINE")
                self.workspaces.verify_location(workspace_id, workspace)
                self.workspaces.require(workspace_id)
                self.workspaces.candidate(workspace, exclude=workspace_id)
                missing, _ = self.workspaces.audit_files(workspace_id, workspace)
                if missing:
                    raise StorageError("WORKSPACE_FILES_MISSING", "Registered workspace files are missing")
                for part in WORKSPACE_DIRS:
                    directory = checked_path(workspace / part)
                    if not directory.exists():
                        directories[f"storage/{workspace_id}/{part}/"] = directory
                    elif not directory.is_dir():
                        raise StorageError("RECOVERY_REQUIRED", f"Expected directory at {directory}")
            except StorageError as exc:
                raise StorageError(exc.code, str(exc), details=details) from exc
        if directories:
            with self.db.session() as session:
                pending = session.scalars(select(StorageOperation).where(or_(
                    StorageOperation.phase.not_in(TERMINAL),
                    StorageOperation.receipt["cleanup_pending"].as_boolean().is_(True),
                )))
                affected = {key.split("/")[1] for key in directories}
                for operation in pending:
                    if affected.intersection((operation.plan.get("workspace_id"), operation.plan.get("target_workspace_id"))):
                        raise StorageError("STORAGE_BUSY")
        return directories

    def _checked_lock_directory(self):
        lock_dir = checked_path(self.root / "runtime/locks")
        if not lock_dir.is_dir() or not os.path.samestat(lock_dir.stat(), self.lock_directory_id):
            raise StorageError("RECOVERY_REQUIRED", "The live storage lock directory is missing or was replaced",
                               details={"path": str(lock_dir)})
        return lock_dir

    def ensure_layout(self):
        """Reconcile the live instance without re-running host startup or resetting identities."""
        lock_dir = self._checked_lock_directory()
        settings = self._layout_settings()
        workspace_ids = self._layout_workspaces(settings)
        with ExitStack() as locks:
            for workspace_id in workspace_ids:
                lock_file = checked_path(lock_dir / f"workspace-{workspace_id}.lock")
                if lock_file.exists() and (not lock_file.is_file() or lock_file.stat().st_nlink != 1):
                    raise StorageError("RECOVERY_REQUIRED", "Unsafe workspace lock")
                locks.enter_context(self.workspaces.lease(workspace_id))
            locks.enter_context(self.workspaces.lock())
            self._checked_lock_directory()
            current = self._layout_settings()
            if current != settings or self._layout_workspaces(current) != workspace_ids:
                raise StorageError("STORAGE_BUSY")
            directories = self._layout_gaps(current, workspace_ids)
            for path in directories.values():
                checked_path(path).mkdir()
            if directories and self._layout_gaps(current, workspace_ids):
                raise StorageError("RECOVERY_REQUIRED", "Storage layout changed during initialization")
            return {"status": "ready", "data_root": str(self.root), "created": list(directories),
                    "checks": dict.fromkeys(("config", "database", "storage", "runtime"), "ready")}

    def update_settings(self, revision, imports=None, workspace=None, cache=None, *, preview_edge=None, preview_canvas=None):
        with self.workspaces.lock():
            settings = load_storage_settings(self.root)
            if type(revision) is not int or settings["revision"] != revision:
                raise StorageError("REVISION_CONFLICT")
            if imports is not None:
                settings["imports"]["default_mode"] = validate_mode(imports)
            if workspace is not None:
                self.workspaces.require(workspace)
                settings["workspace"]["default_workspace_id"] = workspace
            if cache is not None:
                settings["cache"]["max_size_gb"] = validate_limit(cache)
            if preview_edge is not None:
                settings.setdefault("preview", {})["longest_edge"] = validate_preview_longest_edge(preview_edge)
            if preview_canvas is not None:
                settings.setdefault("preview", {})["canvas"] = validate_canvas_preview(preview_canvas)
            return write_storage_settings(self.root, settings, revision)

    def snapshot(self, source):
        database = self.db.health()
        settings = load_storage_settings(self.root)
        default_id = settings["workspace"]["default_workspace_id"]
        workspaces = [self.workspaces.check_status(row, include_missing=True) for row in self.workspaces.ordered()]
        for row in workspaces:
            row["is_default"] = row["id"] == default_id
            with self.capacity.lock:
                row.update(self.capacity._location_balance(row["id"]))
        cache = self.cache.status(settings)
        healthy = cache["status"] == "online" and any(
            row["is_default"] and row["status"] in {"online", "partial"} for row in workspaces
        )
        return {"status": "ready" if healthy else "degraded", "data_root": {"path": str(self.root), "source": source},
                "database": database, "imports": {**settings["imports"], "revision": settings["revision"]},
                "default_workspace_id": default_id, "workspaces": workspaces,
                "volumes": self.capacity.snapshot(workspaces), "cache": cache,
                "data_root_receipt": self.data_root_receipt}

    @property
    def cache_path(self):
        return self.cache.active_path(load_storage_settings(self.root))

    def close(self, processing_bundle=None):
        if self.closing.is_set():
            return
        self.closing.set()
        try:
            stop_processing = getattr(processing_bundle, "shutdown", None)
            if stop_processing is not None:
                stop_processing()
            self.direct_imports.close()
            self.operations.close()
            with self.formal_processing:
                self.aggregation.close()
                self.cache.clear_after_session()
        finally:
            self.db.engine.dispose()
            if self.root_lock is not None:
                self.root_lock.release()
            if self.instance_lock is not None:
                self.instance_lock.release()

