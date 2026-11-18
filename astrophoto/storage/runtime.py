"""Storage service composition and live state."""

from pathlib import Path

from filelock import Timeout

from ..assets.imports import AssetImportService
from ..assets.service import AssetService
from .migration import WorkspaceMigrationService
from .operations import Operations

from ..core.config import (
    load_storage_settings, validate_canvas_preview, validate_limit, validate_mode, validate_preview_longest_edge,
    write_json_atomically, write_storage_settings,
)
from ..core.errors import StorageError
from ..database.manager import DatabaseManager
from ..equipment.service import EquipmentService
from ..equipment.trains import OpticalTrainService
from ..siril.previews import PreviewService
from ..siril.processing import recover_runs
from ..siril.software import SoftwareService
from .cache import CacheManager
from .initializer import CACHE_MARKER, WORKSPACE_MARKER, acquire_bootstrap_lock, check_data_root, discard_bootstrap_scratch, ensure_data_root, load_or_create_manifest, load_or_create_settings
from .locations import WorkspaceRegistry
from .paths import canonicalize_root


class StorageRuntime:
    def __init__(self, root, manifest, database, environ):
        self.root = root
        self.db = database
        self.workspaces = WorkspaceRegistry(root, manifest["instance_id"], database)
        self.cache = CacheManager(self.workspaces)
        self.environ = dict(environ)
        self.operations = Operations(self)
        self.assets = AssetService(self)
        self.equipment = EquipmentService(database)
        self.optical_trains = OpticalTrainService(database)
        self.imports = AssetImportService(self)
        self.migrations = WorkspaceMigrationService(self)
        self.siril = SoftwareService(self)
        self.previews = PreviewService(self)

    @classmethod
    def initialize(cls, root, environ):
        root = canonicalize_root(root)
        check_data_root(root)
        root.mkdir(parents=True, exist_ok=True, mode=0o700)
        try:
            return cls._initialize(root, environ)
        except Timeout as exc:
            raise StorageError("STORAGE_BUSY") from exc

    @classmethod
    def _initialize(cls, root, environ):
        with acquire_bootstrap_lock(root):
            ensure_data_root(root)
            manifest = load_or_create_manifest(root)
            settings = load_or_create_settings(root, manifest)
            database = DatabaseManager(root / "databases/assets.db")
            creating = not manifest["initialized"]
            if creating:
                discard_bootstrap_scratch(root / "workspace" / WORKSPACE_MARKER)
                discard_bootstrap_scratch(root / "cache" / CACHE_MARKER)
            database.initialize(manifest["instance_id"], creating=creating)
            service = cls(root, manifest, database, environ)
            service.workspaces.ensure_default(manifest, settings)
            service.cache.initialize(settings, creating=creating)
            if creating:
                write_json_atomically(root / "config/manifest.json", {**manifest, "initialized": True})
        recover_runs(service)
        service.operations.recover()
        return service

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
        workspaces = [self.workspaces.check_status(row) for row in self.workspaces.list()]
        for row in workspaces:
            row["is_default"] = row["id"] == default_id
        cache = self.cache.status(settings)
        healthy = cache["status"] == "online" and any(
            row["is_default"] and row["status"] == "online" for row in workspaces
        )
        return {"status": "ready" if healthy else "degraded", "data_root": {"path": str(self.root), "source": source},
                "database": database, "imports": {**settings["imports"], "revision": settings["revision"]},
                "default_workspace_id": default_id, "workspaces": workspaces, "cache": cache}

    @property
    def cache_path(self):
        return Path(load_storage_settings(self.root)["cache"]["path"])

