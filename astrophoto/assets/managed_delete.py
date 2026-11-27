"""Validate and remove owned files before committing catalog changes."""

import logging
import os
from contextlib import ExitStack, contextmanager

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from ..core.config import read_json, sync_directory, write_json_atomically
from ..core.errors import StorageError
from ..database.library_models import FormalOutput
from ..database.models import AssetLocation
from ..storage.manager import fingerprint, source_stat
from ..storage.paths import checked_path, safe_join_workspace

logger = logging.getLogger(__name__)


@contextmanager
def deletion_session(runtime):
    with ExitStack() as leases:
        files = ManagedDeletion(runtime, leases)
        try:
            with runtime.db.session(transaction="write") as session:
                yield session, files
        except (SQLAlchemyError, StorageError) as exc:
            if not files.removed or getattr(exc, "details", None):
                raise
            raise StorageError("RECOVERY_REQUIRED", "Files were deleted before catalog changes could be saved", details={
                "deleted_files": files.removed, "removed_asset_ids": [], "remaining_asset_ids": files.removed,
            }) from exc
        files.finish()


class ManagedDeletion:
    def __init__(self, runtime, leases):
        self.runtime = runtime
        self.leases = leases
        self.completed = []
        self.removed = []
        self.preserved = []

    def _prepare(self, session, record_id, location):
        asset = self.runtime.library._asset(session, record_id)
        parts = location.relative_key.split("/")
        imported = (len(parts) == 4 and parts[0] == "objects" and parts[3] == asset.name
                    and parts[1] in {"subframes", "videos", "masters", "images"})
        formal = session.get(FormalOutput, record_id) if parts[0] == "outputs" else None
        if not imported and not (formal and formal.workspace_id == location.workspace_id
                                 and formal.relative_key == location.relative_key and parts[-1] == asset.name):
            raise StorageError("MANAGED_FILE_OWNERSHIP_UNKNOWN")
        root = self.runtime.workspaces.require(location.workspace_id)
        path = safe_join_workspace(root, location.relative_key)
        if session.scalar(select(AssetLocation.id).where(
            AssetLocation.external_key == os.path.normcase(str(path)), AssetLocation.asset_id != record_id,
        )):
            raise StorageError("MANAGED_FILE_SHARED")
        marker = checked_path(self.runtime.root / "runtime" / f"catalog-delete-{record_id}.json")
        expected = dict(location=location.id, workspace=location.workspace_id, key=location.relative_key,
                        size=asset.size_bytes, mtime=asset.mtime_ns)
        previous = read_json(marker) if marker.exists() else None
        if previous is not None and previous.get("target") != expected:
            raise StorageError("RECOVERY_REQUIRED", "The interrupted deletion target has changed")
        try:
            info = source_stat(path)
        except StorageError as exc:
            if exc.code != "SOURCE_NOT_FOUND" or previous is None:
                raise
            return record_id, path, marker, previous, imported, False
        if info.st_nlink != 1:
            raise StorageError("MANAGED_FILE_SHARED")
        if (info.st_size, info.st_mtime_ns) != (asset.size_bytes, asset.mtime_ns):
            raise StorageError("SOURCE_CHANGED")
        identity = fingerprint(info)
        if previous is not None and previous.get("identity") != identity:
            raise StorageError("SOURCE_CHANGED")
        return record_id, path, marker, dict(target=expected, identity=identity), imported, True

    def prepare(self, session, impact):
        locations = self.locations(session, impact["asset_ids"])
        for workspace in sorted({location.workspace_id for _, location in locations if location.workspace_id}):
            self.leases.enter_context(self.runtime.workspaces.lease(workspace))
        expected = {file["asset_id"]: file for file in impact["files"]}
        candidates = []
        for key, location in locations:
            candidate = None
            if location.storage_mode == "managed":
                candidate = self._prepare(session, key, location)
                state = expected[key]
                if state.get("identity") != candidate[3]["identity"] or state.get("present") != candidate[5]:
                    raise StorageError("SOURCE_CHANGED")
            candidates.append((key, candidate))
        return candidates

    def inspect(self, session, record_ids):
        result = []
        for key, location in self.locations(session, record_ids):
            file = dict(asset_id=key, storage_mode=location.storage_mode, workspace_id=location.workspace_id,
                        relative_key=location.relative_key, external_key=location.external_key)
            if location.storage_mode == "managed":
                try:
                    candidate = self._prepare(session, key, location)
                    file.update(identity=candidate[3]["identity"], present=candidate[5])
                except StorageError as exc:
                    file["blocked"] = exc.code
            result.append(file)
        return result

    @staticmethod
    def locations(session, record_ids):
        found = {}
        for start in range(0, len(record_ids), 500):
            rows = session.scalars(select(AssetLocation).where(AssetLocation.asset_id.in_(record_ids[start:start + 500])))
            for row in rows:
                if row.asset_id in found:
                    raise StorageError("LIBRARY_RECORD_REFERENCED", "The asset has multiple file registrations")
                found[row.asset_id] = row
        if len(found) != len(record_ids):
            raise StorageError("ASSET_NOT_FOUND")
        return [(key, found[key]) for key in record_ids]

    def remove(self, key, candidate):
        if candidate is None:
            self.preserved.append(key)
            return
        record_id, path, marker, intent, imported, present = candidate
        try:
            if present:
                if not marker.exists():
                    write_json_atomically(marker, intent, replace=False)
                info = source_stat(path)
                if info.st_nlink != 1:
                    raise StorageError("MANAGED_FILE_SHARED")
                if fingerprint(info) != intent["identity"]:
                    raise StorageError("SOURCE_CHANGED")
                path.unlink()
            self.removed.append(record_id)
            sync_directory(path.parent)
        except (OSError, StorageError) as exc:
            code = exc.code if isinstance(exc, StorageError) else "MANAGED_FILE_DELETE_FAILED"
            raise StorageError(code, "Could not finish deleting the managed file", details={
                **self.receipt(), "failed_asset_id": record_id, "file_name": path.name,
            }) from exc
        self.completed.append((marker, path.parent if imported else None))

    def receipt(self):
        return {"deleted_files": list(self.removed), "preserved_external_files": list(self.preserved)}

    def finish(self):
        for marker, directory in self.completed:
            try:
                marker.unlink()
                if directory is not None:
                    try:
                        directory.rmdir()
                    except OSError:
                        pass
            except OSError:
                logger.warning("Could not clean up a completed catalog deletion", exc_info=True)
