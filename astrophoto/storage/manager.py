"""Filesystem operations confined to previously checked local paths."""

import ctypes
import errno
import sys
import hashlib
import os
import shutil
import stat
from pathlib import Path

from ..core.config import sync_directory
from ..core.errors import StorageError
from .paths import checked_path, safe_join_workspace

CHUNK = 8 * 1024**2


def fingerprint(info) -> list[int]:
    # Windows may update NTFS change time when the file is opened after a rename.
    change_time = info.st_ctime_ns if os.name != "nt" else 0
    return [info.st_size, info.st_mtime_ns, change_time, info.st_dev, info.st_ino]


def source_stat(path: Path):
    try:
        info = checked_path(path).stat()
    except FileNotFoundError as exc:
        raise StorageError("SOURCE_NOT_FOUND") from exc
    except OSError as exc:
        raise StorageError("SOURCE_UNREADABLE") from exc
    if not stat.S_ISREG(info.st_mode):
        raise StorageError("SOURCE_UNREADABLE")
    return info


def choose_space(path: Path, size: int) -> int:
    free = shutil.disk_usage(path).free
    if free < size:
        raise StorageError("INSUFFICIENT_DISK_SPACE")
    return free


def stage_copy(source, target, expected, checkpoint, *, checksum=False):
    """Copy exact bytes, with source identity and stat comparisons before/after I/O."""
    if fingerprint(source_stat(source)) != expected:
        raise StorageError("SOURCE_CHANGED")
    choose_space(target.parent, expected[0])
    digest = hashlib.sha256() if checksum else None
    try:
        with checked_path(source).open("rb") as reader, checked_path(target).open("xb") as writer:
            if fingerprint(os.fstat(reader.fileno())) != expected:
                raise StorageError("SOURCE_CHANGED")
            copied = 0
            while block := reader.read(CHUNK):
                checkpoint()
                copied += len(block)
                if copied > expected[0]:
                    raise StorageError("SOURCE_CHANGED")
                writer.write(block)
                if digest is not None:
                    digest.update(block)
            writer.flush()
            os.fsync(writer.fileno())
            if fingerprint(os.fstat(reader.fileno())) != expected:
                raise StorageError("SOURCE_CHANGED")
    except OSError as exc:
        code = "INSUFFICIENT_DISK_SPACE" if exc.errno == errno.ENOSPC or getattr(exc, "winerror", 0) == 112 else "FILE_COPY_FAILED"
        raise StorageError(code) from exc
    verify_staged(source, target, expected)
    if digest is not None and file_hash(target, checkpoint) != digest.hexdigest():
        raise StorageError("COPY_VERIFY_FAILED")
    return digest.hexdigest() if digest is not None else None


def verify_staged(source, target, expected):
    if fingerprint(source_stat(source)) != expected:
        raise StorageError("SOURCE_CHANGED")
    if source_stat(target).st_size != expected[0]:
        raise StorageError("COPY_VERIFY_FAILED")


def file_hash(path, checkpoint):
    digest = hashlib.sha256()
    with checked_path(path).open("rb") as stream:
        while block := stream.read(CHUNK):
            checkpoint()
            digest.update(block)
    return digest.hexdigest()


def publish_object(staging, destination):
    # Destination names in the private object namespace are reserved by the durable operation.
    # Hold the Workspace lease across validation, rename and commit.
    destination = checked_path(destination)
    staging = checked_path(staging)
    if destination.exists():
        raise StorageError("OBJECT_CONFLICT")
    if staging.stat().st_dev != destination.parent.stat().st_dev:
        raise StorageError("INVALID_STORAGE_PATH", "Publication must stay on one volume")
    rename_noreplace(staging, destination)
    sync_directory(destination.parent)


def rename_noreplace(source, destination):
    if os.name == "nt":
        os.rename(source, destination)
        return
    libc = ctypes.CDLL(None, use_errno=True)
    if sys.platform.startswith("linux") and hasattr(libc, "renameat2"):
        result = libc.renameat2(-100, os.fsencode(source), -100, os.fsencode(destination), 1)
    elif sys.platform == "darwin":
        result = libc.renamex_np(os.fsencode(source), os.fsencode(destination), 4)
    else:
        raise StorageError("ATOMIC_PUBLISH_UNAVAILABLE")
    if result != 0:
        error = ctypes.get_errno()
        raise OSError(error, os.strerror(error), destination)


def remove_stage(path):
    path = checked_path(path)
    if path.exists():
        info = path.lstat()
        if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
            raise StorageError("RECOVERY_REQUIRED", "Unsafe staging file")
        path.unlink()


def resolve_managed(registry, location):
    root = registry.require(location.workspace_id, write=False)
    return safe_join_workspace(root, location.relative_key)

