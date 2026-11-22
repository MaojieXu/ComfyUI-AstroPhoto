"""Local path validation shared by registration, file I/O and recovery."""

import os
import re
import sys
import stat
from pathlib import Path, PureWindowsPath

from ..core.errors import StorageError


def checked_path(value: str | Path) -> Path:
    if not isinstance(value, (str, Path)):
        raise StorageError("INVALID_STORAGE_PATH")
    raw = str(value)
    path = Path(raw)
    if (not path.is_absolute() or "\0" in raw or raw.startswith(("//", "\\\\"))
            or ".." in path.parts or path == path.parent):
        raise StorageError("INVALID_STORAGE_PATH")
    for part in path.parts[1:]:
        if (any(char in '<>:"|?*' for char in part) or PureWindowsPath(part).is_reserved() or part.endswith((" ", "."))
                or any(ord(char) < 32 for char in part)):
            raise StorageError("INVALID_STORAGE_PATH")
    for component in [*reversed(path.parents), path]:
        try:
            info = component.lstat()
        except FileNotFoundError:
            continue
        if stat.S_ISLNK(info.st_mode) or getattr(info, "st_file_attributes", 0) & 0x400:
            raise StorageError("INVALID_STORAGE_PATH", "Links and reparse points are unsupported")
    if os.name == "nt":
        import ctypes

        if ctypes.windll.kernel32.GetDriveTypeW(str(path.anchor)) == 4:
            raise StorageError("INVALID_STORAGE_PATH", "Network volumes are unsupported")
    return path


def ensure_local_volume(path: Path) -> None:
    if not sys.platform.startswith("linux"):
        return
    # Bind mounts are represented by their underlying filesystem type.
    # mountinfo escapes whitespace in mount points.
    mount_table = Path("/proc/self/mountinfo")
    if not mount_table.is_file():
        return
    network = {"nfs", "nfs4", "cifs", "smb3", "smbfs", "9p", "afs", "ceph", "glusterfs", "davfs2"}
    best_parts = 0
    filesystem = ""
    for entry in mount_table.read_text(encoding="utf-8", errors="surrogateescape").splitlines():
        prefix, _, details = entry.partition(" - ")
        mount = Path(re.sub(r"\\([0-7]{3})", lambda part: chr(int(part[1], 8)), prefix.split()[4]))
        if len(mount.parts) >= best_parts and path.is_relative_to(mount):
            best_parts = len(mount.parts)
            filesystem = details.split()[0]
    if filesystem in network or filesystem.startswith("fuse."):
        raise StorageError("INVALID_STORAGE_PATH", "Network or user-space filesystem is unsupported")


def system_roots() -> list[Path]:
    if os.name == "nt":
        return [Path(value).resolve() for key in ("SystemRoot", "ProgramFiles", "ProgramFiles(x86)")
                if (value := os.environ.get(key))]
    return [Path(p) for p in ("/etc", "/usr", "/bin", "/sbin", "/proc", "/sys", "/dev")]


def canonicalize_root(value: str | Path) -> Path:
    path = checked_path(checked_path(value).resolve())
    if Path.home().resolve().is_relative_to(path) or any(path.is_relative_to(root) for root in system_roots()):
        raise StorageError("INVALID_STORAGE_PATH")
    if path.exists() and not path.is_dir():
        raise StorageError("INVALID_STORAGE_PATH")
    ensure_local_volume(path)
    return path


def overlaps(left: Path, right: Path) -> bool:
    return left.is_relative_to(right) or right.is_relative_to(left)


def volume_identity(path: Path) -> str:
    """Identify the mounted filesystem independently of its path or drive letter."""
    if os.name != "nt":
        return f"device:{path.stat().st_dev}"

    import ctypes
    from ctypes import wintypes

    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    root = ctypes.create_unicode_buffer(32768)
    volume = ctypes.create_unicode_buffer(128)
    mount_path = kernel.GetVolumePathNameW
    mount_path.argtypes = (wintypes.LPCWSTR, wintypes.LPWSTR, wintypes.DWORD)
    mount_name = kernel.GetVolumeNameForVolumeMountPointW
    mount_name.argtypes = mount_path.argtypes
    if not mount_path(str(path), root, len(root)) or not mount_name(root.value, volume, len(volume)):
        raise ctypes.WinError(ctypes.get_last_error())
    return volume.value.casefold()


def validate_no_overlap(candidate: Path, reserved: list[Path], data_root: Path, allowed: Path | None) -> None:
    if (any(overlaps(candidate, path) for path in reserved)
            or overlaps(candidate, data_root) and candidate != allowed):
        raise StorageError("STORAGE_PATH_CONFLICT")


def safe_join_workspace(root: Path, key: str) -> Path:
    if not key or "\\" in key or any(p in {"", ".", ".."} for p in key.split("/")):
        raise StorageError("INVALID_RELATIVE_KEY")
    candidate = checked_path(root.joinpath(*key.split("/")))
    if not candidate.is_relative_to(root):
        raise StorageError("INVALID_RELATIVE_KEY")
    return candidate

