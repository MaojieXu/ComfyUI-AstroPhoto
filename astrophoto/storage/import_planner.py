"""Plan whole-file import destinations and the write queues that share a device."""

import os
import sys
from collections import defaultdict
from contextlib import contextmanager
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path, PureWindowsPath
from unicodedata import normalize
from threading import Lock

from ..core.errors import StorageError
from .paths import safe_join_workspace, volume_identity

_NAME_ENCODING = "utf-16-le" if os.name == "nt" else "utf-8"
_NAME_LIMIT = 510 if os.name == "nt" else 255


def validate_import_filename(name):
    if (not isinstance(name, str) or not name or name.endswith((" ", "."))
            or PureWindowsPath(name).is_reserved()
            or any(c in '<>:"/\\|?*' or ord(c) < 32 for c in name)):
        raise StorageError("INVALID_REQUEST")
    try:
        if len(name.encode(_NAME_ENCODING)) > _NAME_LIMIT:
            raise StorageError("INVALID_REQUEST")
    except UnicodeEncodeError as exc:
        raise StorageError("INVALID_REQUEST") from exc
    return name


def managed_relative_key(name, attributes, material_name):
    """Keep the source filename under its named catalog directory."""
    try:
        validate_import_filename(name)
        validate_import_filename(material_name)
    except StorageError as exc:
        raise StorageError("INVALID_MANAGED_NAME") from exc
    role = attributes.get("role")
    if attributes.get("file_kind") == "video":
        category = "videos"
    elif role in {"master_frame", "calibration_master"}:
        category = "masters"
    elif role == "raw":
        category = "subframes"
    else:
        category = "images"
    return f"objects/{category}/{material_name}/{name}"


def managed_destination(root, key):
    if not _fits_path(root, key, _length_limits(root)):
        raise StorageError("MANAGED_PATH_TOO_LONG")
    return safe_join_workspace(root, key)


def disk_name_key(name):
    return normalize("NFC", name.casefold())


def check_destination(destination, *, allow_directory=False):
    """Reject unrelated directories and case or normalization collisions."""
    directory = destination.parent
    if not directory.parent.exists():
        return
    matches = [item for item in directory.parent.iterdir()
               if disk_name_key(item.name) == disk_name_key(directory.name)]
    if not matches:
        return
    if not allow_directory or len(matches) != 1 or matches[0].name != directory.name or not directory.is_dir():
        raise StorageError("OBJECT_CONFLICT")
    if any(disk_name_key(item.name) == disk_name_key(destination.name) for item in directory.iterdir()):
        raise StorageError("OBJECT_CONFLICT")


@lru_cache(maxsize=1)
def _windows_long_paths():
    import ctypes

    try:
        # This reports the setting for this running process, including its manifest.
        enabled = ctypes.WinDLL("ntdll").RtlAreLongPathsEnabled
        enabled.argtypes = ()
        enabled.restype = ctypes.c_ubyte
        return bool(enabled())
    except (AttributeError, OSError):
        return False


def _length_limits(root):
    if os.name == "nt":
        # Win32 paths count UTF-16 units. Without long-path support CreateDirectoryW
        # additionally reserves space for an 8.3 child name.
        return (32766, 32766) if _windows_long_paths() else (259, 247)
    limit = os.pathconf(root, "PC_PATH_MAX")
    return (limit - 1, limit - 1) if limit > 0 else (sys.maxsize, sys.maxsize)


def _path_length(path):
    return len(str(path).encode("utf-16-le")) // 2 if os.name == "nt" else len(os.fsencode(path))


def _fits_path(root, key, limits):
    path = root.joinpath(*key.split("/"))
    file_limit, directory_limit = limits
    return (_path_length(path) <= file_limit and
            (_path_length(path.parent) <= directory_limit or path.parent.is_dir()))


def validate_managed_path_length(root, key):
    """Preflight a file that will be published or staged under an existing workspace."""
    if not _fits_path(root, key, _length_limits(root)):
        raise StorageError("INVALID_STORAGE_PATH", "Storage path exceeds this host's supported length")


def _windows_disks(volume):
    """Translate a volume GUID into all disks backing it (VOLUME_DISK_EXTENTS)."""
    import ctypes
    from ctypes import wintypes

    class Extent(ctypes.Structure):
        _fields_ = [("disk", wintypes.DWORD), ("offset", ctypes.c_int64), ("size", ctypes.c_int64)]

    class Extents(ctypes.Structure):
        _fields_ = [("count", wintypes.DWORD), ("first", Extent)]

    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    open_volume = kernel.CreateFileW
    open_volume.argtypes = (wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD, ctypes.c_void_p,
                            wintypes.DWORD, wintypes.DWORD, wintypes.HANDLE)
    open_volume.restype = wintypes.HANDLE
    control = kernel.DeviceIoControl
    control.argtypes = (wintypes.HANDLE, wintypes.DWORD, ctypes.c_void_p, wintypes.DWORD,
                        ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(wintypes.DWORD), ctypes.c_void_p)
    kernel.CloseHandle.argtypes = (wintypes.HANDLE,)
    handle = open_volume(volume.rstrip("\\"), 0, 7, None, 3, 0, None)
    if handle == wintypes.HANDLE(-1).value:
        return set()
    try:
        buffer = ctypes.create_string_buffer(64 * 1024)
        used = wintypes.DWORD()
        if not control(handle, 0x00560000, None, 0, buffer, len(buffer), ctypes.byref(used), None):
            return set()
        header = Extents.from_buffer(buffer)
        offset = Extents.first.offset
        if used.value < offset + header.count * ctypes.sizeof(Extent):
            return set()
        return {f"disk-{entry.disk}" for entry in (Extent * header.count).from_buffer(buffer, offset)}
    finally:
        kernel.CloseHandle(handle)


def _linux_disks(path):
    dev = path.stat().st_dev
    queue = [Path(f"/sys/dev/block/{os.major(dev)}:{os.minor(dev)}").resolve(strict=True)]
    disks = set()
    seen = set()
    while queue:
        node = queue.pop()
        if (node / "partition").exists():
            node = node.parent
        if node in seen:
            continue
        seen.add(node)
        slaves = list((node / "slaves").iterdir())
        if slaves:
            queue.extend(child.resolve(strict=True) for child in slaves)
        elif (node / "device").exists():
            disks.add(node.name)
        else:
            return set()
    return disks


def _physical_disks(path, volume):
    try:
        if os.name == "nt":
            return _windows_disks(volume)
        if sys.platform.startswith("linux"):
            return _linux_disks(path)
    except OSError:
        pass
    return set()


class PhysicalWriters:
    """Admit one import writer per backing device, including across independent jobs."""

    def __init__(self):
        self._lock = Lock()
        self._active = set()

    @contextmanager
    def claim(self, root):
        try:
            devices = frozenset(_physical_disks(root, volume_identity(root)))
        except OSError:
            devices = frozenset()
        with self._lock:
            if any(not devices or not active or active.intersection(devices) for active in self._active):
                raise StorageError("STORAGE_BUSY")
            self._active.add(devices)
        try:
            yield
        finally:
            with self._lock:
                self._active.remove(devices)


def _lanes(disks_by_volume):
    # Unresolved or overlapping device mappings cannot safely run independent writers.
    if not all(disks_by_volume.values()):
        return dict.fromkeys(disks_by_volume, "shared")
    components = []
    for devices in disks_by_volume.values():
        merged = set(devices)
        for component in components.copy():
            if merged.intersection(component):
                merged.update(component)
                components.remove(component)
        components.append(merged)
    return {volume: "+".join(sorted(component))
            for component in components for volume, disks in disks_by_volume.items() if disks <= component}


@dataclass
class _Target:
    workspace: str
    volume: str
    remaining: int


def plan_import(runtime, files, *, parallel=False, workspace_ids=None):
    sizes = [item["size_bytes"] for item in files]
    if not sizes or any(type(size) is not int or size < 0 for size in sizes) or type(parallel) is not bool:
        raise StorageError("INVALID_REQUEST")
    rows = runtime.workspaces.ordered()
    if workspace_ids is not None:
        if (not isinstance(workspace_ids, list) or not workspace_ids or not all(isinstance(i, str) for i in workspace_ids)
                or len(set(workspace_ids)) != len(workspace_ids) or set(workspace_ids) - {r.id for r in rows}):
            raise StorageError("INVALID_REQUEST")
        rows = [r for r in rows if r.id in workspace_ids]

    volumes = {}
    devices = {}
    targets = []
    with runtime.capacity.lock:
        for row in rows:
            try:
                path = runtime.workspaces.require(row.id)
                volume = volume_identity(path)
                if volume not in volumes:
                    balance = runtime.capacity._balance(path)
                    volume_quota = balance["remaining_quota_bytes"]
                    free = balance["available_bytes"]
                    volumes[volume] = free if volume_quota is None else min(free, volume_quota)
                    devices[volume] = _physical_disks(path, volume)
                quota = runtime.capacity._location_balance(row.id)["remaining_bytes"]
            except StorageError as exc:
                if not (exc.code.startswith("WORKSPACE_") or exc.code == "STORAGE_BUSY"):
                    raise
                continue
            except OSError:
                continue
            if quota != 0:
                targets.append(_Target(row.id, volume, volumes[volume] if quota is None else quota))

    lanes = _lanes(devices)
    if not parallel:
        total = sum(sizes)
        for target in targets:
            if total <= min(volumes[target.volume], target.remaining):
                return [{"workspace_id": target.workspace, "lane": lanes[target.volume]} for _ in sizes]
        raise StorageError("NO_AVAILABLE_WORKSPACE")

    entries = [None] * len(sizes)
    queued = defaultdict(int)
    for index in sorted(range(len(sizes)), key=sizes.__getitem__, reverse=True):
        size = sizes[index]
        candidates = (t for t in targets if size <= min(volumes[t.volume], t.remaining))
        target = min(candidates, key=lambda t: queued[lanes[t.volume]], default=None)
        if target is None:
            raise StorageError("NO_AVAILABLE_WORKSPACE", details={"entry": index + 1, "required_bytes": size})
        lane = lanes[target.volume]
        entries[index] = {"workspace_id": target.workspace, "lane": lane}
        queued[lane] += size
        target.remaining -= size
        volumes[target.volume] -= size
    return entries
