"""Crash-reentrant Data Root layout and identity files."""

import re
import stat
from pathlib import Path
from uuid import UUID, uuid4

from filelock import FileLock

from ..core.config import load_storage_settings, read_json, write_json_atomically
from ..core.errors import StorageError
from .paths import checked_path

WORKSPACE_MARKER = ".astrophoto-workspace.json"
CACHE_MARKER = ".astrophoto-cache.json"
INITIAL_MARKERS = {WORKSPACE_MARKER, CACHE_MARKER}


def discard_bootstrap_scratch(path: Path) -> None:
    prefix = "." + path.name + "."
    if checked_path(path.parent).is_dir():
        for temp in path.parent.iterdir():
            if not temp.name.startswith(prefix) or not re.fullmatch(r"[a-z0-9_]{8}\.tmp", temp.name[len(prefix):]):
                continue
            try:
                info = checked_path(temp).lstat()
                if stat.S_ISREG(info.st_mode) and info.st_nlink == 1:
                    temp.unlink()
            except FileNotFoundError:
                continue


def acquire_bootstrap_lock(root: Path) -> FileLock:
    path = checked_path(root / "runtime/locks/bootstrap.lock")
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    if path.exists() and path.stat().st_nlink != 1:
        raise StorageError("INVALID_STORAGE_PATH")
    return FileLock(path, timeout=5, mode=0o600)


def check_data_root(root: Path) -> None:
    known = {"config", "databases", "runtime", "workspace", "cache", "logs", "backups"}
    if root.exists() and any(child.name not in known for child in root.iterdir()):
        raise StorageError("TARGET_NOT_EMPTY")

def ensure_data_root(root: Path) -> Path:
    check_data_root(root)
    for name in ("config", "databases", "runtime/locks", "runtime/migrations"):
        checked_path(root / name).mkdir(parents=True, exist_ok=True)
    return root


def load_or_create_manifest(root: Path) -> dict:
    path = checked_path(root / "config/manifest.json")
    discard_bootstrap_scratch(path)
    if not path.exists():
        if (any((root / "databases").iterdir()) or any((root / "config").iterdir())
                or (root / "workspace").exists() or (root / "cache").exists()):
            raise StorageError("RECOVERY_REQUIRED", "Storage exists without its manifest")
        manifest = {"format_version": 1, "instance_id": str(uuid4()),
                    "initial_workspace_id": str(uuid4()), "initialized": False}
        write_json_atomically(path, manifest)
        return manifest
    try:
        manifest = read_json(path)
        for name in ("instance_id", "initial_workspace_id"):
            UUID(manifest[name])
        if manifest["format_version"] != 1 or type(manifest["initialized"]) is not bool:
            raise ValueError("Invalid manifest version")
        return manifest
    except (ValueError, KeyError, TypeError, AttributeError, OSError) as exc:
        raise StorageError("RECOVERY_REQUIRED", "Invalid storage manifest") from exc


def load_or_create_settings(root: Path, manifest: dict) -> dict:
    path = checked_path(root / "config/settings.json")
    discard_bootstrap_scratch(path)
    if checked_path(path).exists():
        return load_storage_settings(root)
    if manifest["initialized"] or (root / "databases/assets.db").exists():
        raise StorageError("RECOVERY_REQUIRED", "Storage settings are missing")
    settings = {
        "schema_version": 1, "revision": 0,
        "workspace": {"default_workspace_id": manifest["initial_workspace_id"], "write_policy": "default"},
        "imports": {"default_mode": "reference"},
        "cache": {"path": str(root / "cache"), "max_size_gb": 20},
    }
    write_json_atomically(path, settings)
    return settings


def marker_matches(root: Path, marker: str, identity: dict) -> bool:
    try:
        path = checked_path(root / marker)
        conflicting = INITIAL_MARKERS - {marker} if marker in INITIAL_MARKERS else set()
        return (not any((root / other).exists() for other in conflicting)
                and path.stat().st_nlink == 1 and read_json(path) == identity)
    except (StorageError, OSError, ValueError):
        return False


def claim_directory(root: Path, marker: str, identity: dict, *, create: bool = True) -> None:
    if marker_matches(root, marker, identity):
        return
    if root.exists() and any(root.iterdir()):
        raise StorageError("TARGET_NOT_EMPTY")
    if create:
        root.mkdir(exist_ok=True)
    checked_path(root)
    write_json_atomically(checked_path(root / marker), identity, replace=False)

