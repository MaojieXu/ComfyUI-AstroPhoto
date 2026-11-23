"""Per-volume managed quota and admission for AstroPhoto writes."""

import shutil
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from threading import RLock

from sqlalchemy import func, select

from ..core.config import load_storage_settings, write_storage_settings
from ..core.errors import StorageError
from ..database.library_models import FormalOutput
from ..database.models import Asset, AssetLocation
from .paths import volume_identity


@dataclass(eq=False)
class Reservation:
    volume: str
    managed: int
    physical: int
    workspace_id: str | None = None
    location_managed: int = 0


class VolumeCapacity:
    def __init__(self, registry):
        self.registry = registry
        self.lock = RLock()
        self.reservations = set()

    def _balance(self, path, *, exclude=None):
        path = Path(path)
        probe = path if path.exists() else path.parent
        volume = volume_identity(probe)
        rows = self.registry.list()
        ids = []
        for row in rows:
            workspace = Path(row.root_path)
            entry = self.registry._evidence(row.id)
            identity = entry.get("volume") if entry.get("path") == str(workspace) else None
            if identity is None and workspace.is_dir():
                identity = volume_identity(workspace)
            if identity == volume:
                ids.append(row.id)
        with self.registry.db.session() as session:
            used = session.scalar(select(func.coalesce(func.sum(Asset.size_bytes), 0))
                                  .join(AssetLocation, AssetLocation.asset_id == Asset.id)
                                  .where(AssetLocation.workspace_id.in_(ids)))
            collected = select(AssetLocation.id).where(
                AssetLocation.workspace_id == FormalOutput.workspace_id,
                AssetLocation.relative_key == FormalOutput.relative_key,
            ).exists()
            used += session.scalar(select(func.coalesce(func.sum(FormalOutput.provenance["size_bytes"].as_integer()), 0))
                                   .where(FormalOutput.workspace_id.in_(ids), ~collected))
            used += session.scalar(select(func.coalesce(
                func.sum(FormalOutput.provenance["receipt_size_bytes"].as_integer()), 0
            )).where(FormalOutput.workspace_id.in_(ids)))
        settings = load_storage_settings(self.registry.root)
        quota = settings.get("volume_quotas", {}).get(volume)
        reservations = [item for item in self.reservations if item is not exclude and item.volume == volume]
        reserved = sum(item.managed for item in reservations)
        committed = sum(item.physical for item in reservations)
        free = shutil.disk_usage(probe).free
        return {"id": volume, "workspace_ids": ids, "quota_bytes": quota,
                "used_bytes": used, "reserved_bytes": reserved,
                "remaining_quota_bytes": None if quota is None else max(0, quota - used - reserved),
                "free_bytes": free, "available_bytes": max(0, free - committed)}

    def _location_balance(self, workspace_id, *, exclude=None):
        with self.registry.db.session() as session:
            used = session.scalar(select(func.coalesce(func.sum(Asset.size_bytes), 0))
                                  .join(AssetLocation, AssetLocation.asset_id == Asset.id)
                                  .where(AssetLocation.workspace_id == workspace_id))
            collected = select(AssetLocation.id).where(
                AssetLocation.workspace_id == FormalOutput.workspace_id,
                AssetLocation.relative_key == FormalOutput.relative_key,
            ).exists()
            used += session.scalar(select(func.coalesce(func.sum(FormalOutput.provenance["size_bytes"].as_integer()), 0))
                                   .where(FormalOutput.workspace_id == workspace_id, ~collected))
            used += session.scalar(select(func.coalesce(
                func.sum(FormalOutput.provenance["receipt_size_bytes"].as_integer()), 0
            )).where(FormalOutput.workspace_id == workspace_id))
        quota = load_storage_settings(self.registry.root).get("location_quotas", {}).get(workspace_id)
        reserved = sum(item.location_managed for item in self.reservations
                       if item is not exclude and item.workspace_id == workspace_id)
        return {"quota_bytes": quota, "used_bytes": used, "reserved_bytes": reserved,
                "remaining_bytes": None if quota is None else max(0, quota - used - reserved)}

    def _location_for_path(self, path):
        path = Path(path)
        return next((row.id for row in self.registry.list() if path == Path(row.root_path)), None)

    def _require_location(self, workspace_id, managed, *, exclude=None):
        if workspace_id is None:
            return
        balance = self._location_balance(workspace_id, exclude=exclude)
        remaining = balance["remaining_bytes"]
        if remaining is not None and managed > remaining:
            raise StorageError("WORKSPACE_QUOTA_EXCEEDED", details={"workspace_id": workspace_id, **balance})

    def select_workspace(self, required=0, *, managed=None):
        failures = []
        for row in self.registry.ordered():
            try:
                root = self.registry.require(row.id)
                self.check(root, required, managed=managed)
                with self.lock:
                    balance = self._location_balance(row.id)
                    if balance["remaining_bytes"] == 0:
                        raise StorageError("WORKSPACE_QUOTA_EXCEEDED")
                return row.id
            except (StorageError, OSError) as exc:
                if isinstance(exc, StorageError) and exc.code not in {
                    "WORKSPACE_OFFLINE", "WORKSPACE_DISABLED", "WORKSPACE_READ_ONLY", "WORKSPACE_IDENTITY_MISMATCH",
                    "WORKSPACE_PARTIAL", "WORKSPACE_ERROR", "STORAGE_BUSY", "INSUFFICIENT_DISK_SPACE",
                    "VOLUME_QUOTA_EXCEEDED", "WORKSPACE_QUOTA_EXCEEDED",
                }:
                    raise
                failures.append({"workspace_id": row.id, "code": getattr(exc, "code", "STORAGE_PATH_UNWRITABLE")})
        raise StorageError("NO_AVAILABLE_WORKSPACE", details={"locations": failures})

    @staticmethod
    def _require(balance, required, managed):
        if required > balance["available_bytes"]:
            raise StorageError("INSUFFICIENT_DISK_SPACE", details={"required_bytes": required, **balance})
        quota = balance["remaining_quota_bytes"]
        if managed > 0 and quota is not None and managed > quota:
            raise StorageError("VOLUME_QUOTA_EXCEEDED", details={"required_bytes": managed, **balance})

    def check(self, path, required, *, managed=None, location_managed=None):
        managed = required if managed is None else managed
        with self.lock:
            balance = self._balance(path)
            self._require(balance, required, managed)
            self._require_location(self._location_for_path(path), managed if location_managed is None else location_managed)
            return balance["available_bytes"]

    @contextmanager
    def reserve(self, path, required, *, managed=None, location_managed=None):
        managed = required if managed is None else managed
        location_managed = managed if location_managed is None else location_managed
        with self.lock:
            balance = self._balance(path)
            self._require(balance, required, managed)
            workspace_id = self._location_for_path(path)
            self._require_location(workspace_id, location_managed)
            reservation = Reservation(balance["id"], managed, required, workspace_id, location_managed)
            self.reservations.add(reservation)
        try:
            yield reservation
        finally:
            with self.lock:
                self.reservations.discard(reservation)

    def materialized(self, reservation, size):
        with self.lock:
            reservation.physical = max(0, reservation.physical - size)

    def committed(self, reservation, size):
        with self.lock:
            reservation.managed = max(0, reservation.managed - size)
            reservation.location_managed = max(0, reservation.location_managed - size)

    def recheck(self, reservation, path, required, managed, *, location_managed=None):
        with self.lock:
            self._require(self._balance(path, exclude=reservation), required, managed)
            self._require_location(reservation.workspace_id, managed if location_managed is None else location_managed,
                                   exclude=reservation)

    def snapshot(self, workspaces):
        volumes = {}
        with self.lock:
            for workspace in workspaces:
                if workspace["free_bytes"] is None:
                    continue
                path = Path(workspace["root_path"])
                try:
                    identity = volume_identity(path)
                    if identity not in volumes:
                        volumes[identity] = self._balance(path)
                except (OSError, StorageError):
                    continue
        return list(volumes.values())

    def configure(self, workspace, quota, revision):
        if quota is not None and (type(quota) is not int or not 0 <= quota <= 2**53 - 1):
            raise StorageError("INVALID_REQUEST")
        path = self.registry.require(workspace, write=False)
        volume = volume_identity(path)
        with self.registry.lock(), self.lock:
            settings = load_storage_settings(self.registry.root)
            quotas = settings.setdefault("volume_quotas", {})
            if quota is None:
                quotas.pop(volume, None)
            else:
                quotas[volume] = quota
            write_storage_settings(self.registry.root, settings, revision)
            return self._balance(path)
