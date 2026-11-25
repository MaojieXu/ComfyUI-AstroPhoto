"""Asset metadata and identity-preserving location resolution."""

import os
from pathlib import Path

from sqlalchemy import select

from ..core.errors import StorageError
from ..database.models import Asset, AssetLocation, StorageLocation
from ..storage.manager import resolve_managed, source_stat
from ..storage.paths import checked_path


class AssetService:
    def __init__(self, runtime):
        self.runtime = runtime
        self.db = runtime.db

    def _location(self, session, asset_id):
        location = session.scalar(select(AssetLocation).where(AssetLocation.asset_id == asset_id))
        if location is None:
            raise StorageError("ASSET_NOT_FOUND")
        return location

    def resolve_asset(self, asset_id):
        with self.db.session() as session:
            location = self._location(session, asset_id)
        path = (Path(location.external_path) if location.storage_mode == "external_reference"
                else resolve_managed(self.runtime.workspaces, location))
        source_stat(path)
        return path

    def resolve_registered_path(self, value):
        """Resolve a node path back to an existing asset without authorizing new files."""
        path = checked_path(value)
        key = os.path.normcase(str(path))
        with self.db.session() as session:
            asset_id = session.scalar(select(AssetLocation.asset_id).where(AssetLocation.external_key == key)
                                      .order_by(AssetLocation.asset_id).limit(1))
            if asset_id is None:
                for workspace in session.scalars(select(StorageLocation)):
                    try:
                        relative = path.relative_to(Path(workspace.root_path)).as_posix()
                    except ValueError:
                        continue
                    asset_id = session.scalar(select(AssetLocation.asset_id).where(
                        AssetLocation.workspace_id == workspace.id, AssetLocation.relative_key == relative
                    ))
                    if asset_id is not None:
                        break
        if asset_id is None:
            raise StorageError("ASSET_NOT_FOUND", "FITS path must belong to a registered asset")
        resolved = self.resolve_asset(asset_id)
        if os.path.normcase(str(resolved)) != key:
            raise StorageError("SOURCE_CHANGED")
        return asset_id, resolved

    def relocate(self, asset_id, value):
        path = self.runtime.imports.validate_selected_source_path(value)
        info = source_stat(path)
        with self.runtime.workspaces.lock(), self.db.session() as session:
            location = self._location(session, asset_id)
            if location.storage_mode != "external_reference":
                raise StorageError("ASSET_NOT_EXTERNAL")
            asset = session.get(Asset, asset_id)
            if asset.size_bytes != info.st_size:
                raise StorageError("SOURCE_CHANGED")
            key = os.path.normcase(str(path))
            location.external_path, location.external_key = str(path), key
            asset.name, asset.mtime_ns = path.name, info.st_mtime_ns
        return {"asset_id": asset_id, "relocated": True}

    def list(self, after="", limit=100):
        with self.db.session() as session:
            rows = session.execute(select(Asset, AssetLocation).join(AssetLocation).where(
                Asset.id > after
            ).order_by(Asset.id).limit(limit + 1)).all()
        return {"assets": [
            {"id": asset.id, "name": asset.name, "size_bytes": asset.size_bytes,
             "mtime_ns": str(asset.mtime_ns), "storage_mode": location.storage_mode,
             "workspace_id": location.workspace_id}
            for asset, location in rows[:limit]
        ], "next": rows[limit - 1][0].id if len(rows) > limit else None}

