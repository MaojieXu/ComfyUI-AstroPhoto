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

    @staticmethod
    def _require(balance, required, managed):
        if required > balance["available_bytes"]:
            raise StorageError("INSUFFICIENT_DISK_SPACE", details={"required_bytes": required, **balance})
        quota = balance["remaining_quota_bytes"]
        if managed > 0 and quota is not None and managed > quota:
            raise StorageError("VOLUME_QUOTA_EXCEEDED", details={"required_bytes": managed, **balance})

    def check(self, path, required, *, managed=None):
        with self.lock:
            balance = self._balance(path)
            self._require(balance, required, required if managed is None else managed)
            return balance["available_bytes"]

    @contextmanager
    def reserve(self, path, required, *, managed=None):
        managed = required if managed is None else managed
        with self.lock:
            balance = self._balance(path)
            self._require(balance, required, managed)
            reservation = Reservation(balance["id"], managed, required)
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

    def recheck(self, reservation, path, required, managed):
        with self.lock:
            self._require(self._balance(path, exclude=reservation), required, managed)

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
