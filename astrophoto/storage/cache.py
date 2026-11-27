"""One active identity-checked cache. Only reserved cache entries can be cleared."""

import logging
import os
import re
import shutil
import stat
from contextlib import ExitStack, contextmanager
from pathlib import Path
from tempfile import TemporaryDirectory
from uuid import uuid4

from filelock import FileLock, Timeout

from ..core.config import load_storage_settings, validate_limit, write_json_atomically, write_storage_settings
from ..core.errors import StorageError
from .initializer import CACHE_MARKER, DEFAULT_CACHE, claim_directory, marker_matches
from .manager import choose_space, remove_stage
from .paths import checked_path, validate_no_overlap

BUCKETS = ("thumbnails", "previews", "processing", "tmp")
ENTRY = re.compile(r"[0-9a-f]{32}\.cache")
SCRATCH_SUFFIX = re.compile(r"[a-z0-9_]{8}")
logger = logging.getLogger(__name__)
AGGREGATION_PREFIX = "aggregate-"


class CacheManager:
    def __init__(self, registry):
        self.registry = registry
        self.root = registry.root
        self.session_path = None
        self._scratch_bytes = 0
        self.identity = {"format_version": 1, "instance_id": registry.instance_id, "cache_id": registry.instance_id}

    def use_host_temp(self, directory):
        directory = checked_path(Path(directory).absolute())
        path = checked_path(directory / f"astrophoto-{self.registry.instance_id}")
        validate_no_overlap(path, self.registry.reserved(), self.root, self.root / DEFAULT_CACHE)
        self.session_path = path
        self.registry.host_temp = directory

    def active_path(self, settings):
        return self.session_path or Path(settings["cache"]["path"])

    def _open(self, settings):
        path = checked_path(self.active_path(settings))
        validate_no_overlap(path, self.registry.reserved(), self.root, self.root / DEFAULT_CACHE)
        if path in (self.session_path, self.root / DEFAULT_CACHE) and not path.exists():
            path.parent.mkdir(parents=True, exist_ok=True)
            claim_directory(path, CACHE_MARKER, self.identity)
        if not marker_matches(path, CACHE_MARKER, self.identity):
            raise StorageError("CACHE_IDENTITY_MISMATCH")
        return path

    def _entries(self, path, scopes):
        for scope in scopes:
            folder = checked_path(path / scope)
            if folder.is_dir():
                for candidate in folder.iterdir():
                    if ENTRY.fullmatch(candidate.name):
                        try:
                            candidate = checked_path(candidate)
                            info = candidate.lstat()
                        except (StorageError, OSError):
                            continue
                        if (stat.S_ISREG(info.st_mode) and info.st_nlink == 1 and
                                marker_matches(folder, candidate.name + ".json", self._entry_identity(candidate, info))):
                            yield candidate, info.st_size

    def _entry_identity(self, path, info):
        return {"instance_id": self.registry.instance_id, "entry": path.name, "size": info.st_size,
                "mtime_ns": info.st_mtime_ns, "device": info.st_dev, "inode": info.st_ino}

    def store(self, scope, content: bytes) -> Path:
        """Publish a small rebuildable entry for a cache producer. Readers use entry_lock()."""
        if scope not in BUCKETS:
            raise StorageError("INVALID_CACHE_SCOPE")
        with self.registry.lock():
            settings = load_storage_settings(self.root)
            path = self._open(settings)
            self._check_budget(path, settings, len(content))
            bucket = checked_path(path / scope)
            bucket.mkdir(exist_ok=True)
            entry = checked_path(bucket / (uuid4().hex + ".cache"))
            with entry.open("xb") as stream:
                stream.write(content)
                stream.flush()
                os.fsync(stream.fileno())
            write_json_atomically(checked_path(bucket / (entry.name + ".json")), self._entry_identity(entry, entry.stat()))
            return entry

    def _check_budget(self, path, settings, required):
        if (sum(size for _, size in self._entries(path, BUCKETS)) + self._scratch_bytes + required
                > settings["cache"]["max_size_gb"] * 1024**3):
            raise StorageError("CACHE_LIMIT_EXCEEDED")
        choose_space(path, required)

    def _recover_processing_scratch(self, bucket, prefix, files, tree=None):
        for folder in bucket.iterdir():
            if not folder.name.startswith(prefix) or not SCRATCH_SUFFIX.fullmatch(folder.name[len(prefix):]):
                continue
            try:
                folder = checked_path(folder)
                identity = {"instance_id": self.registry.instance_id, "scratch": folder.name}
                if not marker_matches(folder, "owner.json", identity):
                    continue
                with self._scratch_lock(folder):
                    if tree and (folder / tree).exists():
                        shutil.rmtree(checked_path(folder / tree))
                    for name in files:
                        remove_stage(folder / name)
                    if {child.name for child in folder.iterdir()} == {"owner.json"}:
                        remove_stage(folder / "owner.json")
                        folder.rmdir()
            except (OSError, StorageError, Timeout):
                continue

    def _scratch_lock(self, folder):
        return FileLock(checked_path(self.root / "runtime/locks" / (folder.name + ".lock")), timeout=0)

    @contextmanager
    def scratch(self, budget, *, prefix: str, files: tuple[str, ...], tree=None):
        """Lease a processing directory and recover this producer's known files."""
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*-", prefix) or any(
                name == "owner.json" or not re.fullmatch(r"[a-z0-9](?:[a-z0-9_.-]*[a-z0-9])?", name) for name in files):
            raise ValueError("Invalid processing scratch policy")
        if tree is not None and (prefix, tree) != (AGGREGATION_PREFIX, "files"):
            raise ValueError("Invalid processing scratch tree")
        with ExitStack() as cleanup:
            with self.registry.lock():
                settings = load_storage_settings(self.root)
                path = self._open(settings)
                bucket = checked_path(path / "processing")
                bucket.mkdir(exist_ok=True)
                self._recover_processing_scratch(bucket, prefix, files, tree)
                self._check_budget(path, settings, budget)
                scratch = TemporaryDirectory(dir=bucket, prefix=prefix)
                folder = Path(scratch.name)
                lock = self._scratch_lock(folder)
                cleanup.callback(remove_stage, Path(lock.lock_file))
                cleanup.enter_context(lock)
                cleanup.callback(scratch.cleanup)
                write_json_atomically(folder / "owner.json", {"instance_id": self.registry.instance_id, "scratch": folder.name})
                if tree:
                    self._scratch_bytes += budget
                    cleanup.callback(self._release_scratch, budget)
            yield folder

    def _release_scratch(self, budget):
        with self.registry.lock():
            self._scratch_bytes -= budget

    def read_entry(self, scope, entry, *, validate_only=False):
        settings = load_storage_settings(self.root)
        path = self.active_path(settings)
        if (scope not in BUCKETS or entry.parent != path / scope or not ENTRY.fullmatch(entry.name)
                or not marker_matches(path, CACHE_MARKER, self.identity)):
            raise StorageError("PREVIEW_NOT_FOUND")
        with self.entry_lock(entry):
            try:
                info = checked_path(entry).lstat()
                if (not stat.S_ISREG(info.st_mode) or info.st_nlink != 1 or
                        not marker_matches(entry.parent, entry.name + ".json", self._entry_identity(entry, info))):
                    raise StorageError("PREVIEW_NOT_FOUND")
                return None if validate_only else entry.read_bytes()
            except FileNotFoundError as exc:
                raise StorageError("PREVIEW_NOT_FOUND") from exc

    def remove_entry(self, scope, entry):
        settings = load_storage_settings(self.root)
        path = self.active_path(settings)
        if (scope not in BUCKETS or entry.parent != path / scope or not ENTRY.fullmatch(entry.name)
                or not marker_matches(path, CACHE_MARKER, self.identity)):
            return
        try:
            with self.entry_lock(entry):
                info = checked_path(entry).lstat()
                marker = entry.name + ".json"
                if (stat.S_ISREG(info.st_mode) and info.st_nlink == 1 and
                        marker_matches(entry.parent, marker, self._entry_identity(entry, info))):
                    entry.unlink()
                    checked_path(entry.parent / marker).unlink(missing_ok=True)
        except (OSError, StorageError, Timeout):
            # Session cache cleanup can reap an entry still in use.
            return

    def status(self, settings):
        path = self.active_path(settings)
        used = None
        try:
            checked_path(path)
            if path in (self.session_path, self.root / DEFAULT_CACHE) and not path.exists():
                status, used = "online", 0
            elif not path.is_dir():
                status = "offline"
            elif not marker_matches(path, CACHE_MARKER, self.identity):
                status = "identity_mismatch"
            else:
                status = "online" if os.access(path, os.W_OK) and path.stat().st_mode & 0o222 else "read_only"
                used = sum(size for _, size in self._entries(path, BUCKETS))
        except (StorageError, OSError):
            status = "error"
        return {**settings["cache"], "path": str(path), "session_managed": self.session_path is not None,
                "status": status, "used_bytes": used}

    def configure(self, value, limit, revision):
        validate_limit(limit)
        with self.registry.lock():
            settings = load_storage_settings(self.root)
            if type(revision) is not int or settings["revision"] != revision:
                raise StorageError("REVISION_CONFLICT")
            if self.session_path is not None:
                if checked_path(value) != self.session_path:
                    raise StorageError("INVALID_STORAGE_PATH", "ComfyUI owns the session cache location")
                settings["cache"]["max_size_gb"] = limit
                write_storage_settings(self.root, settings, revision)
                return self.status(settings)
            path = self.registry.candidate(value, cache=True)
            if path == Path(settings["cache"]["path"]) and not (path == self.root / DEFAULT_CACHE and not path.exists()):
                if not marker_matches(path, CACHE_MARKER, self.identity):
                    raise StorageError("CACHE_IDENTITY_MISMATCH")
            else:
                claim_directory(path, CACHE_MARKER, self.identity)
            previous = settings["cache"]
            former = list(dict.fromkeys([*previous.get("former_paths", []), previous["path"]]))
            settings["cache"] = {"path": str(path), "max_size_gb": limit,
                                 "former_paths": [root for root in former if root != str(path)]}
            write_storage_settings(self.root, settings, revision)
            return self.status(settings)

    def entry_lock(self, path):
        return FileLock(checked_path(self.root / "runtime/locks" / f"cache-{path.stem}.lock"), timeout=0)

    def clear_owned_cache(self, scope):
        if scope != "all" and scope not in BUCKETS:
            raise StorageError("INVALID_CACHE_SCOPE")
        with self.registry.lock():
            settings = load_storage_settings(self.root)
            return self._clear_owned_entries(self._open(settings), scope)

    def clear_after_session(self):
        with self.registry.lock():
            settings = load_storage_settings(self.root)["cache"]
            for value in dict.fromkeys([self.session_path, settings["path"], *settings.get("former_paths", [])]):
                if value is None or not Path(value).exists():
                    continue
                try:
                    result = self._clear_owned_entries(checked_path(value), "all")
                    bucket = checked_path(Path(value) / "processing")
                    if bucket.is_dir():
                        self._recover_processing_scratch(bucket, AGGREGATION_PREFIX, ("mapping.json",), "files")
                    if result["skipped"] or result["failed"]:
                        logger.warning("AstroPhoto cache cleanup incomplete for %s: %s", value, result)
                except (OSError, StorageError):
                    logger.warning("AstroPhoto cache cleanup deferred for %s", value, exc_info=True)

    def _clear_owned_entries(self, path, scope):
        count = removed_bytes = skipped = failed = 0
        validate_no_overlap(path, self.registry.reserved(), self.root, self.root / DEFAULT_CACHE)
        if not marker_matches(path, CACHE_MARKER, self.identity):
            raise StorageError("CACHE_IDENTITY_MISMATCH")
        for entry, _ in self._entries(path, BUCKETS if scope == "all" else (scope,)):
            try:
                with self.entry_lock(entry):
                    verified = checked_path(entry)
                    info = verified.lstat()
                    descriptor = checked_path(verified.parent / (verified.name + ".json"))
                    if (not stat.S_ISREG(info.st_mode) or info.st_nlink != 1 or not
                            marker_matches(verified.parent, descriptor.name, self._entry_identity(verified, info))):
                        skipped += 1
                        continue
                    verified.unlink()
                    count += 1
                    removed_bytes += info.st_size
                    descriptor.unlink()
            except Timeout:
                skipped += 1
            except OSError:
                failed += 1
        return {"removed": count, "removed_bytes": removed_bytes, "skipped": skipped, "failed": failed}

