"""Coordinate host startup and offline Data Root moves from the configured root."""

import argparse
import json
import os
import shutil
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from uuid import UUID

from filelock import FileLock, Timeout
from sqlalchemy import select

from ..core.config import load_storage_settings, read_json, sync_directory, write_json_atomically
from ..core.errors import StorageError
from ..database.manager import DatabaseManager
from ..database.models import StorageLocation, StorageOperation
from .initializer import (
    DATABASE_FILE, DEFAULT_CACHE, TRANSFER_MARKER, WORKSPACE_MARKER, check_data_root, discard_bootstrap_scratch,
    ensure_data_root, ensure_top_level_directories, load_manifest, marker_matches, new_manifest,
    storage_directory_exists,
)
from .locations import TERMINAL, WORKSPACE_DIRS, WorkspaceRegistry, rebind_workspace
from .manager import choose_space, file_hash, rename_noreplace
from .migration import managed_groups
from .paths import canonicalize_root, checked_path, overlaps

ROOT_LINK = Path("config/root-link.json")


class DataRoots:
    def __init__(self, root):
        root = canonicalize_root(root)
        storage_directory_exists(root / "config")
        link = self._read_record(root / ROOT_LINK)
        self.anchor = root
        if link is not None:
            try:
                if str(UUID(link["instance_id"])) != link["instance_id"]:
                    raise ValueError("Invalid Data Root link identity")
                self.anchor = canonicalize_root(link["anchor"])
                if self.anchor == root:
                    raise ValueError("Data Root link points to itself")
            except (AttributeError, KeyError, TypeError, ValueError, StorageError) as exc:
                raise StorageError("RECOVERY_REQUIRED", "Invalid Data Root link",
                                   details={"path": str(root / ROOT_LINK)}) from exc
        self.catalog = self.anchor / "config/roots.json"
        self.lock_path = self.anchor / "config/root-catalog.lock"

    @staticmethod
    def _read_record(path):
        try:
            path = checked_path(path)
            if path.stat().st_nlink != 1 or not path.is_file():
                raise ValueError("Expected a regular file with a single link")
            return read_json(path)
        except FileNotFoundError:
            return None
        except (OSError, ValueError, StorageError) as exc:
            raise StorageError("RECOVERY_REQUIRED", "Data Root coordination record cannot be read",
                               details={"path": str(path)}) from exc

    def _read(self):
        catalog = self._read_record(self.catalog)
        if catalog is None:
            return None
        try:
            ((instance, entry),) = catalog.items()
            aliases = entry["aliases"]
            if (str(UUID(instance)) != instance or not isinstance(aliases, list)
                    or not all(isinstance(alias, str) and Path(alias).is_absolute() for alias in aliases)
                    or str(self.anchor) not in aliases or entry["active"] not in aliases
                    or type(entry["opened"]) is not bool
                    or (entry.get("previous") is not None and entry["previous"] not in aliases)):
                raise ValueError("Invalid Data Root registration")
            seed = entry.get("initial_manifest")
            if seed is not None and (entry["opened"] or entry.get("previous") is not None
                                     or entry["active"] != str(self.anchor)
                                     or aliases != [str(self.anchor)] or seed["instance_id"] != instance
                                     or str(UUID(seed["initial_workspace_id"])) != seed["initial_workspace_id"]
                                     or seed["initialized"] is not False or seed["format_version"] != 1):
                raise ValueError("Invalid initial Data Root registration")
        except (AttributeError, TypeError, ValueError, KeyError) as exc:
            raise StorageError("RECOVERY_REQUIRED", "Invalid Data Root coordination record",
                               details={"path": str(self.catalog)}) from exc
        return catalog

    def _catalog_lock(self):
        return FileLock(self._lock_file(self.lock_path), timeout=5)

    @staticmethod
    def _lock_file(path):
        path = checked_path(path)
        if path.exists() and (not path.is_file() or path.stat().st_nlink != 1):
            raise StorageError("INVALID_STORAGE_PATH", "Unsafe Data Root lock", details={"path": str(path)})
        return path

    def _require_catalog(self):
        catalog = self._read()
        if catalog is None:
            raise StorageError("RECOVERY_REQUIRED", "Data Root coordination record is missing",
                               details={"path": str(self.catalog)})
        return catalog

    def _registered_entry(self, catalog, path):
        instance, entry = self._entry(catalog, path)
        if entry is not None and path != self.anchor:
            link = path / ROOT_LINK
            if self._read_record(link) != {"anchor": str(self.anchor), "instance_id": instance}:
                raise StorageError("RECOVERY_REQUIRED", "Data Root link does not match its active instance",
                                   details={"path": str(link)})
        return instance, entry

    @staticmethod
    def _require_manifest(path):
        config = path / "config"
        storage_directory_exists(config)
        manifest = config / "manifest.json"
        try:
            manifest.lstat()
        except FileNotFoundError:
            missing = [str(manifest)]
            settings = config / "settings.json"
            try:
                settings.lstat()
            except FileNotFoundError:
                missing.append(str(settings))
            raise StorageError("RECOVERY_REQUIRED", f"Active Data Root is unavailable: {path}",
                               details={"missing_config": missing}) from None
        return load_manifest(path)

    def _check_initial_contents(self, *, provisioning=False):
        check_data_root(self.anchor)
        for name in ("config", "database", "storage", "runtime"):
            directory = self.anchor / name
            if not storage_directory_exists(directory):
                continue
            allowed = {self.lock_path} if name == "config" else set()
            if name == "config" and provisioning:
                allowed.add(self.catalog)
            if any(child not in allowed for child in directory.iterdir()):
                self._require_manifest(self.anchor)
                raise StorageError("RECOVERY_REQUIRED", "Existing Data Root has no usable coordination record",
                                   details={"path": str(self.catalog)})

    def _provision(self):
        self._check_initial_contents()
        manifest = new_manifest()
        instance = manifest["instance_id"]
        catalog = {instance: {"active": str(self.anchor), "aliases": [str(self.anchor)],
                              "opened": False, "initial_manifest": manifest}}
        write_json_atomically(self.catalog, catalog, replace=False)
        return catalog

    @staticmethod
    def _entry(catalog, path):
        key = os.path.normcase(str(path))
        return next(((instance, entry) for instance, entry in catalog.items()
                     if key in map(os.path.normcase, entry["aliases"])), (None, None))

    def _instance_lock(self, instance):
        return self._write_lock(self.anchor / "config" / f"{instance}.lock")

    @staticmethod
    def _write_lock(path):
        path = DataRoots._lock_file(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        lock = FileLock(path, timeout=0, thread_local=False)
        try:
            lock.acquire()
        except Timeout as exc:
            raise StorageError("STORAGE_BUSY", "This AstroPhoto instance is already open") from exc
        return lock

    @staticmethod
    def _clear_active_transfer_marker(path):
        marker = checked_path(path / TRANSFER_MARKER)
        if not marker.exists():
            return
        try:
            recorded = Path(read_json(marker)["active"])
            if not recorded.is_absolute() or overlaps(path, recorded):
                raise ValueError("Invalid transfer destination")
        except (OSError, ValueError, KeyError, TypeError) as exc:
            raise StorageError("RECOVERY_REQUIRED", "The Data Root transfer marker cannot be read") from exc
        # Only the catalog's active root calls this while the instance is locked.
        marker.unlink()
        sync_directory(marker.parent)

    def open(self, requested, factory):
        requested = canonicalize_root(requested)
        if self._read() is None:
            if requested != self.anchor:
                self._require_catalog()
            self._check_initial_contents()
            checked_path(self.catalog.parent).mkdir(exist_ok=True, parents=True)
        instance_lock = None
        root_lock = None
        try:
            with self._catalog_lock():
                catalog = self._read()
                if catalog is None and requested == self.anchor:
                    catalog = self._provision()
                instance, entry = self._registered_entry(catalog or {}, requested)
                if entry is None:
                    raise StorageError("RECOVERY_REQUIRED", "Data Root does not match its active instance",
                                       details={"path": str(requested)})
                path = canonicalize_root(entry["active"])
                manifest = path / "config/manifest.json"
                seed = entry.get("initial_manifest")
                if seed is not None and not checked_path(manifest).exists():
                    discard_bootstrap_scratch(manifest)
                    self._check_initial_contents(provisioning=True)
                    write_json_atomically(manifest, seed, replace=False)
                identity = self._require_manifest(path)
                active_instance, _ = self._registered_entry(catalog, path)
                if (active_instance != instance or identity["instance_id"] != instance
                        or (seed is not None and identity["initial_workspace_id"] != seed["initial_workspace_id"])):
                    raise StorageError("RECOVERY_REQUIRED", "Data Root does not match its active instance",
                                       details={"path": str(manifest)})
                if seed is None and not identity["initialized"]:
                    raise StorageError("RECOVERY_REQUIRED", "Registered Data Root has an incomplete manifest",
                                       details={"path": str(manifest)})
                instance_lock = self._instance_lock(instance)
                if identity["initialized"]:
                    load_storage_settings(path)
                    ensure_top_level_directories(path)
                    if load_manifest(path) != identity:
                        raise StorageError("RECOVERY_REQUIRED", "Storage manifest changed during startup",
                                           details={"path": str(manifest)})
                    load_storage_settings(path)
                else:
                    for name in ("database", "storage", "runtime"):
                        storage_directory_exists(path / name)
                check_data_root(path)
                root_lock = self._write_lock(path / "runtime/locks/host.lock")
                self._clear_active_transfer_marker(path)
                if entry.get("previous") and not entry["opened"]:
                    load_storage_settings(path)
                    DatabaseManager(path / DATABASE_FILE, read_only=True).health(instance_id=instance)
                    # Runtime initialization can write before returning a service.
                    entry = {**entry, "opened": True}
                    catalog[instance] = entry
                    write_json_atomically(self.catalog, catalog)
                service = factory(path)
                host_temp = service.workspaces.host_temp
                entry = {**entry, "opened": True, "host_temp": str(host_temp) if host_temp else None}
                entry.pop("initial_manifest", None)
                catalog[instance] = entry
                write_json_atomically(self.catalog, catalog)
                service.instance_lock = instance_lock
                service.root_lock = root_lock
                service.data_root_receipt = entry.get("receipt")
                return service
        except BaseException:
            if root_lock is not None:
                root_lock.release()
            if instance_lock is not None:
                instance_lock.release()
            raise

    def plan(self, source, target):
        source, target = canonicalize_root(source), canonicalize_root(target)
        self._require_catalog()
        with self._catalog_lock():
            instance, entry = self._move_entry(self._require_catalog(), source, target)
        plan, _, _, _ = self._inspect_move(source, target, instance, entry)
        return plan

    def _move_entry(self, catalog, source, target):
        instance, entry = self._registered_entry(catalog, source)
        if entry is None or entry["active"] != str(source) or entry.get("initial_manifest") is not None:
            raise StorageError("RECOVERY_REQUIRED", "Offline move requires the active Data Root",
                               details={"active": entry["active"] if entry else None})
        if self._entry(catalog, target)[0] not in {None, instance}:
            raise StorageError("TARGET_NOT_EMPTY", "Target belongs to another AstroPhoto instance",
                               details={"target": str(target)})
        return instance, entry

    def _inspect_move(self, source, target, instance, entry):
        if overlaps(source, target) or overlaps(target, self.anchor) or not target.parent.is_dir():
            raise StorageError("STORAGE_PATH_CONFLICT")
        if target.exists() and (entries := sorted(child.name for child in target.iterdir())):
            raise StorageError("TARGET_NOT_EMPTY", details={"target": str(target), "entries": entries[:100]})
        host_temp = entry.get("host_temp")
        if host_temp and overlaps(target, Path(host_temp)):
            raise StorageError("STORAGE_PATH_CONFLICT", "ComfyUI owns its temporary directory")
        try:
            manifest = read_json(checked_path(source / "config/manifest.json"))
        except (OSError, ValueError) as exc:
            raise StorageError("RECOVERY_REQUIRED", "The source Data Root manifest cannot be read") from exc
        if manifest.get("initialized") is not True or manifest.get("instance_id") != instance:
            raise StorageError("RECOVERY_REQUIRED", "The source Data Root does not match its active instance")
        database = DatabaseManager(source / DATABASE_FILE, read_only=True)
        database.health(instance_id=instance)
        with database.session() as session:
            active = list(session.scalars(select(StorageOperation).where(StorageOperation.phase.not_in(TERMINAL))
                                         .order_by(StorageOperation.id).limit(100)))
            if active:
                raise StorageError("STORAGE_BUSY", "Finish or recover active storage jobs before moving the root",
                                   details={"active_operations": [
                                       {"id": row.id, "kind": row.kind, "phase": row.phase} for row in active]})
            locations = [(row.id, Path(row.root_path)) for row in session.scalars(
                select(StorageLocation).order_by(StorageLocation.id))]
        internal = [(workspace, path) for workspace, path in locations if path.is_relative_to(source)]
        external = [path for _, path in locations if not path.is_relative_to(source)]
        if any(overlaps(target, path) for path in external):
            raise StorageError("STORAGE_PATH_CONFLICT")
        settings = load_storage_settings(source)
        cache = Path(settings["cache"]["path"])
        if not cache.is_relative_to(source) and overlaps(cache, target):
            raise StorageError("STORAGE_PATH_CONFLICT")
        registry = WorkspaceRegistry(source, instance, database)
        with database.session() as session:
            for workspace, path in internal:
                if not marker_matches(path, WORKSPACE_MARKER, registry.identity(workspace)):
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH", details={"workspace_id": workspace, "path": str(path)})
                details = {"workspace_id": workspace, "path": str(path)}
                unknown = sorted(child.name for child in path.iterdir() if child.name not in {WORKSPACE_MARKER, *WORKSPACE_DIRS})
                if unknown:
                    raise StorageError("UNKNOWN_WORKSPACE_CONTENT", details={**details, "entries": unknown[:100]})
                staging = checked_path(path / ".staging")
                if staging.exists():
                    entries = sorted(f".staging/{child.name}" for child in staging.iterdir()) if staging.is_dir() else [".staging"]
                    if entries:
                        raise StorageError("RECOVERY_REQUIRED", "Workspace staging needs reconciliation",
                                           details={**details, "entries": entries[:100]})
                missing, _ = registry.audit_files(workspace, path)
                if missing:
                    raise StorageError("WORKSPACE_FILES_MISSING", details={**details, "missing_count": len(missing),
                                                                         "missing": missing[:100]})
                # Also validate identities in required formal-output receipts.
                for _ in managed_groups(session, path, workspace, instance):
                    pass
        files = _inventory(source, [path for _, path in internal])
        total = sum(path.stat().st_size for path in files)
        free = choose_space(target if target.exists() else target.parent, total)
        plan = {"source": str(source), "target": str(target), "instance_id": instance,
                "copy_bytes": total, "free_bytes": free, "files": len(files),
                "external_workspaces": list(map(str, external))}
        return plan, database, internal, files

    def move(self, source, target, *, progress=None):
        source, target = canonicalize_root(source), canonicalize_root(target)
        self._require_catalog()
        with self._catalog_lock():
            catalog = self._require_catalog()
            instance, entry = self._move_entry(catalog, source, target)
            lease = self._instance_lock(instance)
        try:
            if not source.is_dir():
                raise StorageError("RECOVERY_REQUIRED", "The active Data Root is unavailable")
            root_lock = self._write_lock(source / "runtime/locks/host.lock")
        except BaseException:
            lease.release()
            raise
        try:
            plan, database, internal, files = self._inspect_move(source, target, instance, entry)
            with TemporaryDirectory(prefix=".astrophoto-move-", dir=target.parent) as staging:
                stage = Path(staging) / "root"
                self._copy(source, target, stage, internal, files, database, instance, progress)
                write_json_atomically(checked_path(stage / ROOT_LINK),
                                      {"anchor": str(self.anchor), "instance_id": instance}, replace=False)
                if target.exists():
                    target.rmdir()
                rename_noreplace(stage, target)
            with self._catalog_lock():
                catalog = self._require_catalog()
                if self._entry(catalog, target)[0] not in {None, instance}:
                    raise StorageError("STORAGE_PATH_CONFLICT")
                receipt = {**plan, "old_root_retained": True, "activated": True}
                write_json_atomically(checked_path(source / TRANSFER_MARKER), {"active": str(target)})
                catalog[instance] = {"active": str(target), "previous": str(source),
                                     "aliases": list(dict.fromkeys([*entry["aliases"], str(target)])), "opened": False,
                                     "host_temp": entry.get("host_temp"),
                                     "receipt": receipt}
                write_json_atomically(self.catalog, catalog)
            return receipt
        finally:
            root_lock.release()
            lease.release()

    @staticmethod
    def _copy(source, target, stage, internal, files, database, instance, progress):
        ensure_data_root(stage)
        copied = 0
        for original in files:
            relative = original.relative_to(source)
            if relative == DATABASE_FILE:
                continue
            destination = checked_path(stage / relative)
            destination.parent.mkdir(parents=True, exist_ok=True)
            with original.open("rb") as reader, destination.open("xb") as writer:
                shutil.copyfileobj(reader, writer)
                writer.flush()
                os.fsync(writer.fileno())
            shutil.copystat(original, destination)
            if file_hash(original, lambda: None) != file_hash(destination, lambda: None):
                raise StorageError("COPY_VERIFY_FAILED")
            copied += 1
            if progress is not None:
                progress(copied, relative)
        database.backup(stage / DATABASE_FILE)
        if progress is not None:
            progress(copied + 1, DATABASE_FILE)
        target_db = DatabaseManager(stage / DATABASE_FILE)
        target_db.initialize(instance, creating=False)
        with target_db.session() as session:
            for workspace, path in internal:
                new_path = target / path.relative_to(source)
                staged_path = stage / path.relative_to(source)
                for part in ("objects", "outputs", ".staging"):
                    checked_path(staged_path / part).mkdir(parents=True, exist_ok=True)
                rebind_workspace(session, workspace, new_path)
                # Publishing stage is a same-volume rename, so its directory identity survives.
                write_json_atomically(stage / "runtime" / f"workspace-{workspace}.json", {
                    **WorkspaceRegistry.directory_identity(staged_path), "path": str(new_path), "partial": False,
                }, replace=False)
            internal_ids = [workspace for workspace, _ in internal]
            for row in session.scalars(select(StorageLocation).where(StorageLocation.id.not_in(internal_ids))):
                record = checked_path(source / "runtime" / f"workspace-{row.id}.json")
                if record.exists():
                    if not record.is_file() or record.stat().st_nlink != 1:
                        raise StorageError("RECOVERY_REQUIRED", "Unsafe external workspace location record")
                    write_json_atomically(stage / "runtime" / record.name, read_json(record), replace=False)
        settings = load_storage_settings(stage)
        cache = settings["cache"]
        if Path(cache["path"]).is_relative_to(source):
            cache["path"] = str(target / DEFAULT_CACHE)
        cache["former_paths"] = [path for path in cache.get("former_paths", [])
                                 if not Path(path).is_relative_to(source)]
        write_json_atomically(checked_path(stage / "config/settings.json"), settings)
        target_db.health()

    def rollback(self, active):
        active = canonicalize_root(active)
        self._require_catalog()
        with self._catalog_lock():
            catalog = self._require_catalog()
            instance, entry = self._registered_entry(catalog, active)
            if (entry is None or entry["active"] != str(active) or entry["opened"] or not entry.get("previous")):
                raise StorageError("RECOVERY_REQUIRED", "Move the active instance back or restore a backup")
            lease = self._instance_lock(instance)
            try:
                previous = canonicalize_root(entry["previous"])
                previous_instance, _ = self._registered_entry(catalog, previous)
                manifest = self._require_manifest(previous)
                if previous_instance != instance or not manifest["initialized"] or manifest["instance_id"] != instance:
                    raise StorageError("RECOVERY_REQUIRED")
                DatabaseManager(previous / DATABASE_FILE, read_only=True).health(instance_id=instance)
                if active.is_dir():
                    write_json_atomically(checked_path(active / TRANSFER_MARKER), {"active": str(previous)})
                catalog[instance] = {**entry, "active": str(previous), "previous": None, "opened": True,
                                     "receipt": {"source": str(active), "target": str(previous), "rolled_back": True}}
                write_json_atomically(self.catalog, catalog)
                self._clear_active_transfer_marker(previous)
            finally:
                lease.release()
            return {"active": str(previous), "instance_id": instance}


def _inventory(root, internal_workspaces):
    check_data_root(root)
    files = [checked_path(root / "config/manifest.json"), checked_path(root / "config/settings.json"),
             checked_path(root / DATABASE_FILE)]
    pending = list(internal_workspaces)
    while pending:
        folder = checked_path(pending.pop())
        for child in folder.iterdir():
            child = checked_path(child)
            if child.is_dir():
                pending.append(child)
            elif child.is_file():
                files.append(child)
            else:
                raise StorageError("INVALID_STORAGE_PATH")
    return files


def main():
    parser = argparse.ArgumentParser(description="Plan or execute an offline AstroPhoto Data Root move.")
    commands = parser.add_subparsers(dest="command", required=True)
    for action in ("plan", "move"):
        command = commands.add_parser(action)
        command.add_argument("source")
        command.add_argument("target")
    rollback = commands.add_parser("rollback")
    rollback.add_argument("active")
    args = parser.parse_args()
    try:
        roots = DataRoots(args.active if args.command == "rollback" else args.source)
        if args.command == "rollback":
            result = roots.rollback(args.active)
        elif args.command == "move":
            result = roots.move(args.source, args.target,
                                progress=lambda count, path: print(f"Verified {count}: {path}", file=sys.stderr))
        else:
            result = roots.plan(args.source, args.target)
    except StorageError as exc:
        detail = f"\n{json.dumps(exc.details, ensure_ascii=False)}" if exc.details else ""
        parser.exit(1, f"{exc}{detail}\n")
    except (OSError, Timeout, ValueError) as exc:
        parser.exit(1, f"{exc}\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
