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
TRANSFER_MARKER = "runtime/root-transfer.json"
DATABASE_FILE = Path("database/assets.db")
DEFAULT_CACHE = Path("runtime/cache")
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
    known = {"config", "database", "storage", "runtime"}
    if root.exists() and (unknown := sorted(child.name for child in root.iterdir() if child.name not in known)):
        raise StorageError("TARGET_NOT_EMPTY", details={"path": str(root), "entries": unknown[:100]})


def storage_directory_exists(path: Path) -> bool:
    """Return whether the path exists and reject unsafe or non-directory objects."""
    try:
        info = checked_path(path).lstat()
    except FileNotFoundError:
        return False
    except StorageError as exc:
        raise StorageError(exc.code, str(exc), details={"path": str(path)}) from exc
    if not stat.S_ISDIR(info.st_mode):
        raise StorageError("INVALID_STORAGE_PATH", "Expected a storage directory", details={"path": str(path)})
    return True


def _ensure_directories(paths: tuple[Path, ...]) -> None:
    missing = [path for path in paths if not storage_directory_exists(path)]
    for path in missing:
        try:
            path.mkdir()
        except FileExistsError as exc:
            if not storage_directory_exists(path):
                raise StorageError(
                    "STORAGE_INITIALIZATION_FAILED",
                    "Storage directory disappeared after concurrent creation",
                    details={"path": str(path)},
                ) from exc
    for path in paths:
        if not storage_directory_exists(path):
            raise StorageError("INVALID_STORAGE_PATH", "Storage directory is missing", details={"path": str(path)})


def ensure_top_level_directories(root: Path) -> None:
    """Complete the top-level layout of a configured Data Root during host startup."""
    _ensure_directories(tuple(root / name for name in ("database", "storage", "runtime")))


def ensure_data_root(root: Path) -> Path:
    root = checked_path(root)
    check_data_root(root)
    root.mkdir(parents=True, exist_ok=True)
    _ensure_directories(tuple(root / name for name in ("config", "database", "storage", "runtime")))
    _ensure_directories((root / "runtime/locks",))
    return root


def new_manifest() -> dict:
    return {"format_version": 1, "instance_id": str(uuid4()),
            "initial_workspace_id": str(uuid4()), "initialized": False}


def load_or_create_manifest(root: Path) -> dict:
    path = checked_path(root / "config/manifest.json")
    discard_bootstrap_scratch(path)
    if not path.exists():
        if (any((root / name).is_dir() and any((root / name).iterdir()) for name in ("database", "config", "storage"))
                or any(child.name != "locks" for child in (root / "runtime").iterdir())):
            raise StorageError("RECOVERY_REQUIRED", "Storage exists without its manifest")
        ensure_data_root(root)
        manifest = new_manifest()
        write_json_atomically(path, manifest)
        return manifest
    return load_manifest(root)


def load_manifest(root: Path) -> dict:
    path = root / "config/manifest.json"
    try:
        checked_path(path)
    except StorageError as exc:
        raise StorageError(exc.code, str(exc), details={"path": str(path)}) from exc
    try:
        if not path.is_file() or path.stat().st_nlink != 1:
            raise ValueError("Missing or unsafe manifest")
        manifest = read_json(path)
        for name in ("instance_id", "initial_workspace_id"):
            if str(UUID(manifest[name])) != manifest[name]:
                raise ValueError("Invalid manifest identity")
        if type(manifest["format_version"]) is not int or manifest["format_version"] != 1 or type(manifest["initialized"]) is not bool:
            raise ValueError("Invalid manifest version")
        return manifest
    except (ValueError, KeyError, TypeError, AttributeError, OSError) as exc:
        raise StorageError("RECOVERY_REQUIRED", "Invalid storage manifest", details={"path": str(path)}) from exc


def load_or_create_settings(root: Path, manifest: dict) -> dict:
    path = checked_path(root / "config/settings.json")
    discard_bootstrap_scratch(path)
    if checked_path(path).exists():
        return load_storage_settings(root)
    if manifest["initialized"] or (root / DATABASE_FILE).exists():
        raise StorageError("RECOVERY_REQUIRED", "Storage settings are missing")
    settings = {
        "schema_version": 1, "revision": 0,
        "workspace": {"default_workspace_id": manifest["initial_workspace_id"], "write_policy": "default"},
        "imports": {"default_mode": "reference"},
        "cache": {"path": str(root / DEFAULT_CACHE), "max_size_gb": 20},
    }
    write_json_atomically(path, settings)
    return settings


def marker_matches(root: Path, marker: str, identity: dict) -> bool:
    try:
        path = checked_path(root / marker)
        conflicting = INITIAL_MARKERS - {marker} if marker in INITIAL_MARKERS else set()
        return (not any((root / other).exists() for other in conflicting)
                and path.is_file() and path.stat().st_nlink == 1 and read_json(path) == identity)
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

