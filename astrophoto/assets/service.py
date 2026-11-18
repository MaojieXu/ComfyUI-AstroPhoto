"""Asset metadata and identity-preserving location resolution."""

import os
from pathlib import Path

from sqlalchemy import select

from ..core.errors import StorageError
from ..database.models import Asset, AssetLocation, AssetSession, StorageLocation
from ..storage.manager import resolve_managed, source_stat
from ..storage.paths import checked_path


def validate_session(session_id):
    if not isinstance(session_id, str) or not session_id.strip() or len(session_id) > 120:
        raise StorageError("INVALID_REQUEST")


def assign_session(session, asset_id, session_id):
    if session.get(AssetSession, (asset_id, session_id)) is None:
        session.add(AssetSession(asset_id=asset_id, session_id=session_id))


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
            asset_id = session.scalar(select(AssetLocation.asset_id).where(AssetLocation.external_key == key))
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
            if session.scalar(select(AssetLocation.id).where(
                AssetLocation.external_key == key, AssetLocation.id != location.id
            )):
                raise StorageError("DUPLICATE_ASSET")
            location.external_path, location.external_key = str(path), key
            asset.name, asset.mtime_ns = path.name, info.st_mtime_ns
        return {"asset_id": asset_id, "relocated": True}

    def set_session(self, asset_id, session_id, attached):
        validate_session(session_id)
        with self.runtime.workspaces.lock(), self.db.session() as session:
            if session.get(Asset, asset_id) is None:
                raise StorageError("ASSET_NOT_FOUND")
            if attached:
                assign_session(session, asset_id, session_id)
            else:
                relation = session.get(AssetSession, (asset_id, session_id))
                if relation is not None:
                    session.delete(relation)
        return {"asset_id": asset_id, "attached": attached}

    def list(self, after="", limit=100):
        with self.db.session() as session:
            rows = session.execute(select(Asset, AssetLocation).join(AssetLocation).where(
                Asset.id > after
            ).order_by(Asset.id).limit(limit + 1)).all()
            sessions = {asset.id: [] for asset, _ in rows[:limit]}
            for link in session.scalars(select(AssetSession).where(AssetSession.asset_id.in_(sessions)).order_by(AssetSession.session_id)):
                sessions[link.asset_id].append(link.session_id)
        return {"assets": [
            {"id": asset.id, "name": asset.name, "size_bytes": asset.size_bytes,
             "mtime_ns": str(asset.mtime_ns), "session_ids": sessions[asset.id], "storage_mode": location.storage_mode,
             "workspace_id": location.workspace_id}
            for asset, location in rows[:limit]
        ], "next": rows[limit - 1][0].id if len(rows) > limit else None}

