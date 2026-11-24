"""Workspace identity, registration and write coordination."""

import os
import shutil
import tempfile
from contextlib import contextmanager
from pathlib import Path
from uuid import uuid4

from filelock import FileLock, Timeout
from sqlalchemy import literal_column, or_, select
from sqlalchemy.orm import aliased

from ..core.config import load_storage_settings, read_json, write_json_atomically, write_storage_settings
from ..core.errors import StorageError
from ..database.library_models import FormalOutput, LibraryRecord
from ..database.models import Asset, AssetLocation, StorageLocation, StorageOperation
from .initializer import DEFAULT_CACHE, WORKSPACE_MARKER, acquire_bootstrap_lock, claim_directory, marker_matches
from .paths import canonicalize_root, checked_path, safe_join_workspace, validate_no_overlap, volume_identity

TERMINAL = ("completed", "failed", "cancelled")
WORKSPACE_DIRS = ("objects", "outputs", ".staging")


def check_idle_direct_imports(session, workspace_ids=None):
    """Protect only durable direct writes here. Active writers also hold workspace leases."""
    job = aliased(LibraryRecord)
    entry = aliased(LibraryRecord)
    pending = select(entry.id).join(job, job.id == entry.data["job_id"].as_string()).where(
        job.kind == "direct_import", job.data["phase"].as_string() == "importing",
        entry.kind == "direct_import_entry", entry.data["writing"].as_boolean().is_(True),
    )
    if workspace_ids is not None:
        pending = pending.where(entry.data["workspace_id"].as_string().in_(workspace_ids))
    if session.scalar(pending.limit(1)):
        raise StorageError("STORAGE_BUSY")


def formal_receipt_key(output):
    filename = {"siril-autostretch-v1": "stretched.fit", "siril-single-fits-v1": "result.fit"}.get(
        output.provenance.get("producer"))
    if filename and output.relative_key == f"outputs/{output.id}/{filename}":
        return f"outputs/{output.id}/manifest.json"
    return None


class WorkspaceRegistry:
    def __init__(self, root, instance_id, database):
        self.root = root
        self.instance_id = instance_id
        self.db = database
        self.host_temp = None
        self._known_evidence = {}

    def identity(self, workspace_id):
        return {"format_version": 1, "instance_id": self.instance_id, "workspace_id": workspace_id}

    def _evidence_path(self, workspace_id):
        return checked_path(self.root / "runtime" / f"workspace-{workspace_id}.json")

    def _evidence(self, workspace_id):
        path = self._evidence_path(workspace_id)
        try:
            info = path.stat()
            if not path.is_file() or info.st_nlink != 1:
                raise StorageError("RECOVERY_REQUIRED", "Unsafe workspace location record")
            return read_json(path)
        except FileNotFoundError:
            return {}
        except ValueError as exc:
            raise StorageError("RECOVERY_REQUIRED", "Invalid workspace location record") from exc

    @staticmethod
    def directory_identity(path):
        return {"volume": volume_identity(path), "inode": path.stat().st_ino}

    def record_evidence(self, workspace_id, path, *, partial=False, replace=True):
        evidence = {
            **self.directory_identity(path), "path": str(path), "partial": partial,
        }
        write_json_atomically(self._evidence_path(workspace_id), evidence, replace=replace)
        self._known_evidence[workspace_id] = evidence

    def capture_existing_identities(self, *, creating=False):
        for location in self.list():
            path = Path(location.root_path)
            if not marker_matches(path, WORKSPACE_MARKER, self.identity(location.id)):
                continue
            record = self._evidence_path(location.id)
            if creating and not record.exists():
                self.record_evidence(location.id, path, replace=False)
            elif record.exists():
                try:
                    evidence = self._evidence(location.id)
                except (StorageError, OSError):
                    continue
                current = {**self.directory_identity(path), "path": str(path)}
                if all(evidence.get(key) == value for key, value in current.items()) and type(evidence.get("partial")) is bool:
                    self._known_evidence[location.id] = evidence

    def verify_location(self, workspace_id, path):
        current = {**self.directory_identity(path), "path": str(path)}
        if self._evidence_path(workspace_id).exists():
            evidence = self._evidence(workspace_id)
            if type(evidence.get("partial")) is not bool or any(evidence.get(k) != v for k, v in current.items()):
                raise StorageError("WORKSPACE_IDENTITY_MISMATCH", "Workspace location record conflicts with its directory")
        previous = self._known_evidence.get(workspace_id)
        if previous and any(previous.get(k) != v for k, v in current.items()):
            raise StorageError("WORKSPACE_IDENTITY_MISMATCH", "Workspace directory identity changed")

    def audit_files(self, workspace_id, root):
        with self.db.session() as session:
            entries = list(session.execute(
                select(AssetLocation.asset_id, AssetLocation.relative_key, Asset.size_bytes, Asset.mtime_ns)
                .join(Asset, Asset.id == AssetLocation.asset_id)
                .where(AssetLocation.workspace_id == workspace_id)
                .order_by(AssetLocation.relative_key)
            ))
            registered = {entry.relative_key for entry in entries}
            for output in session.scalars(select(FormalOutput).where(FormalOutput.workspace_id == workspace_id)):
                if output.relative_key not in registered:
                    entries.append((output.id, output.relative_key, output.provenance.get("size_bytes"),
                                    output.provenance.get("mtime_ns")))
                if (key := formal_receipt_key(output)) is not None:
                    entries.append((output.id, key, None, None))
        missing = []
        corroborated = False
        for asset_id, key, size, mtime in entries:
            try:
                path = safe_join_workspace(root, key)
                info = path.stat()
                if not path.is_file() or (size is not None and info.st_size != size):
                    raise ValueError("File does not match its registration")
                corroborated |= info.st_mtime_ns == mtime
            except (OSError, StorageError, ValueError):
                missing.append({"asset_id": asset_id, "relative_key": key})
        return missing, corroborated

    def lock(self):
        return acquire_bootstrap_lock(self.root)

    @contextmanager
    def lease(self, workspace_id, *, timeout=0):
        try:
            lock = FileLock(checked_path(self.root / "runtime/locks" / f"workspace-{workspace_id}.lock"), timeout=timeout)
            with lock:
                yield
        except Timeout as exc:
            raise StorageError("STORAGE_BUSY") from exc

    def get(self, workspace_id):
        with self.db.session() as session:
            location = session.get(StorageLocation, workspace_id)
            if location is None:
                raise StorageError("WORKSPACE_NOT_FOUND")
            return location

    def list(self):
        with self.db.session() as session:
            # Existing SQLite rowids preserve the order in which workspaces were registered.
            return list(session.scalars(select(StorageLocation).order_by(literal_column("storage_locations.rowid"))))

    def ordered(self):
        rows = self.list()
        settings = load_storage_settings(self.root)
        order = settings.get("workspace_order", [settings["workspace"]["default_workspace_id"]])
        by_id = {row.id: row for row in rows}
        return [by_id[key] for key in order if key in by_id] + [row for row in rows if row.id not in order]

    def reserved(self, exclude=None):
        with self.db.session() as session:
            paths = [Path(r.root_path) for r in session.scalars(select(StorageLocation)) if r.id != exclude]
            migrations = session.scalars(select(StorageOperation).where(
                StorageOperation.kind == "migration", StorageOperation.phase.not_in(TERMINAL)
            ))
            paths.extend(Path(row.plan["target"]) for row in migrations
                         if row.id != exclude and "target_workspace_id" not in row.plan)
        return paths

    def candidate(self, path, *, exclude=None, cache=False):
        target = canonicalize_root(path)
        settings = load_storage_settings(self.root)
        reserved = self.reserved(exclude)
        if not cache:
            reserved.append(Path(settings["cache"]["path"]))
            if self.host_temp is not None:
                reserved.append(self.host_temp)
        allowed = None
        if cache:
            allowed = self.root / DEFAULT_CACHE
        elif exclude:
            local = self.root / "storage" / "Local"
            if target == local and any(row.id == exclude and Path(row.root_path) == local for row in self.list()):
                allowed = local
        validate_no_overlap(target, reserved, self.root, allowed)
        if not target.parent.is_dir():
            raise StorageError("STORAGE_PATH_UNWRITABLE", "Target parent must exist")
        return target

    def _create(self, path, name, workspace_id):
        claim_directory(path, WORKSPACE_MARKER, self.identity(workspace_id))
        for part in WORKSPACE_DIRS:
            checked_path(path / part).mkdir(exist_ok=True)
        with self.db.session() as session:
            session.add(StorageLocation(id=workspace_id, name=name, root_path=str(path),
                                        canonical_root=os.path.normcase(str(path))))
        return self.get(workspace_id)

    def ensure_default(self, manifest, settings):
        initial_id = manifest["initial_workspace_id"]
        default_id = settings["workspace"]["default_workspace_id"]
        if not manifest["initialized"]:
            if default_id != initial_id:
                raise StorageError("RECOVERY_REQUIRED")
            existing = self.list()
            if not existing:
                self._create(self.root / "storage" / "Local", "Local", initial_id)
            elif (len(existing) != 1 or existing[0].id != initial_id
                  or Path(existing[0].root_path) != self.root / "storage" / "Local"):
                raise StorageError("RECOVERY_REQUIRED")
            if self.check_status(self.get(initial_id))["status"] != "online":
                raise StorageError("RECOVERY_REQUIRED", "Default Workspace identity or permissions are invalid")
        self.get(default_id)

    def register(self, path, name):
        name = validate_name(name)
        with self.lock():
            target = self.candidate(path)
            if target.is_dir() and any(target.iterdir()) and not (target / WORKSPACE_MARKER).exists():
                raise StorageError("TARGET_NOT_EMPTY")
            marker = checked_path(target / WORKSPACE_MARKER)
            workspace_id = str(uuid4())
            if marker.exists():
                # Reconcile an interrupted registration only while the directory has no business data.
                try:
                    identity = read_json(marker)
                    from uuid import UUID
                    prior = str(UUID(identity["workspace_id"]))
                    empty_layout = all(
                        child.name == WORKSPACE_MARKER or (
                            child.name in WORKSPACE_DIRS and checked_path(child).is_dir() and not any(child.iterdir())
                        ) for child in target.iterdir()
                    )
                except (ValueError, TypeError, AttributeError, KeyError, OSError) as exc:
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH") from exc
                if not empty_layout or identity != self.identity(prior) or any(row.id == prior for row in self.list()):
                    raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
                workspace_id = prior
            location = self._create(target, name, workspace_id)
            self.record_evidence(workspace_id, target)
            return self.check_status(location)

    def check_status(self, location, *, probe_migration=True, inspect_contents=True, include_missing=False, for_read=False):
        path = Path(location.root_path)
        status = "offline"
        total = free = None
        missing = []
        try:
            checked_path(path)
            if path.is_dir():
                evidence = self._evidence(location.id)
                known_path = evidence.get("path") == str(path)
                wrong_directory = known_path and any(
                    evidence.get(key) != value for key, value in self.directory_identity(path).items())
                if wrong_directory or not marker_matches(path, WORKSPACE_MARKER, self.identity(location.id)):
                    status = "identity_mismatch"
                else:
                    usage = shutil.disk_usage(path)
                    total, free = usage.total, usage.free
                    status = "online" if os.access(path, os.W_OK | os.X_OK) and path.stat().st_mode & 0o222 else "read_only"
                    if inspect_contents:
                        missing, _ = self.audit_files(location.id, path)
                        if missing and status == "online":
                            status = "partial"
        except (OSError, StorageError):
            status = "error"
        underlying_status = status
        if not location.enabled:
            status = "disabled"
        removal_target = None
        if probe_migration:
            with self.db.session() as session:
                active = session.scalars(select(StorageOperation).where(
                    StorageOperation.kind == "migration", StorageOperation.phase.not_in(TERMINAL)
                ))
                for row in active:
                    if location.id not in (row.plan.get("workspace_id"), row.plan.get("target_workspace_id")):
                        continue
                    if row.plan.get("remove_workspace") and for_read:
                        continue
                    if row.phase != "committed" or row.plan.get("remove_workspace"):
                        status = "migrating"
                    if row.plan.get("remove_workspace") and location.id == row.plan["workspace_id"] and row.error:
                        removal_target = row.plan["target_workspace_id"]
        result = {"id": location.id, "name": location.name, "root_path": str(path), "enabled": location.enabled,
                "revision": location.revision, "status": status, "underlying_status": underlying_status,
                "missing_count": len(missing), "total_bytes": total, "free_bytes": free}
        if removal_target:
            result["removal_target_id"] = removal_target
        if include_missing:
            result["missing"] = missing[:100]
        return result

    def validate(self, workspace_id):
        with self.lease(workspace_id):
            location = self.get(workspace_id)
            view = self.check_status(location, include_missing=True)
            if view["status"] in {"online", "partial"}:
                try:
                    with tempfile.TemporaryFile(dir=checked_path(Path(location.root_path) / ".staging")):
                        pass
                except PermissionError:
                    view["status"] = "read_only"
                except (OSError, StorageError):
                    view["status"] = "error"
            return view

    def require(self, workspace_id, *, write=True, migrating=False):
        location = self.get(workspace_id)
        status = self.check_status(location, probe_migration=not migrating, inspect_contents=False, for_read=not write)["status"]
        if status != "online" and (write or status != "read_only"):
            code = "STORAGE_BUSY" if status == "migrating" else f"WORKSPACE_{status.upper()}"
            raise StorageError(code)
        return Path(location.root_path)

    def update(self, workspace_id, revision, *, name=None, enabled=None, default=False):
        self.get(workspace_id)
        with self.lease(workspace_id), self.lock():
            settings = load_storage_settings(self.root)
            is_default = settings["workspace"]["default_workspace_id"] == workspace_id
            if enabled is False and (default or is_default):
                raise StorageError("DEFAULT_WORKSPACE_REQUIRED")
            location = self.get(workspace_id)
            expected = settings["revision"] if default else location.revision
            if type(revision) is not int or expected != revision:
                raise StorageError("REVISION_CONFLICT")
            if default:
                if name is not None or enabled is not None:
                    raise StorageError("INVALID_REQUEST", "Set default separately")
                self.require(workspace_id)
                settings["workspace"]["default_workspace_id"] = workspace_id
                write_storage_settings(self.root, settings, settings["revision"])
            else:
                if self.check_status(location)["status"] == "migrating":
                    raise StorageError("STORAGE_BUSY")
                with self.db.session() as session:
                    row = session.get(StorageLocation, workspace_id)
                    if name is not None:
                        row.name = validate_name(name)
                    if enabled is not None:
                        row.enabled = enabled
                    row.revision += 1
            return self.check_status(self.get(workspace_id))

    def relocate(self, workspace_id, path, *, allow_partial=False):
        self.get(workspace_id)
        with self.lease(workspace_id), self.lock():
            location = self.get(workspace_id)
            info = self.check_status(location)
            if info["status"] == "migrating":
                raise StorageError("STORAGE_BUSY")
            if info["underlying_status"] in {"online", "partial", "read_only"}:
                raise StorageError("WORKSPACE_NOT_OFFLINE")
            target = self.candidate(path, exclude=workspace_id)
            if not marker_matches(target, WORKSPACE_MARKER, self.identity(workspace_id)):
                raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
            missing, corroborated = self.audit_files(workspace_id, target)
            evidence = self._evidence(workspace_id)
            identity = self.directory_identity(target)
            same_directory = all(evidence.get(key) == value for key, value in identity.items())
            if not same_directory and not corroborated:
                raise StorageError("WORKSPACE_IDENTITY_MISMATCH")
            if missing and not allow_partial:
                raise StorageError("WORKSPACE_REBIND_PARTIAL", details={
                    "missing_count": len(missing), "missing": missing[:100],
                })
            with self.db.session() as session:
                rebind_workspace(session, workspace_id, target)
            self.record_evidence(workspace_id, target, partial=bool(missing))
            return self.check_status(self.get(workspace_id))

    def check_removal(self, session, workspace_id, revision, target=None, operation=None):
        row = session.get(StorageLocation, workspace_id)
        if row is None:
            raise StorageError("WORKSPACE_NOT_FOUND")
        if type(revision) is not int or row.revision != revision:
            raise StorageError("REVISION_CONFLICT")
        if not session.scalar(select(StorageLocation.id).where(StorageLocation.id != workspace_id).limit(1)):
            raise StorageError("DEFAULT_WORKSPACE_REQUIRED")
        if target == workspace_id:
            raise StorageError("STORAGE_PATH_CONFLICT")
        if target is not None and session.get(StorageLocation, target) is None:
            raise StorageError("WORKSPACE_NOT_FOUND")
        involved = {workspace_id, target} - {None}
        check_idle_direct_imports(session, involved)
        active = session.scalars(select(StorageOperation).where(or_(
            StorageOperation.phase.not_in(TERMINAL), StorageOperation.receipt["cleanup_pending"].as_boolean().is_(True))))
        if any(op.id != operation and involved.intersection((op.plan.get("workspace_id"), op.plan.get("target_workspace_id")))
               for op in active):
            raise StorageError("STORAGE_BUSY")
        return row

    def unregister_empty(self, session, workspace_id, revision, *, target=None, operation=None):
        """Called under both the workspace lease and configuration lock."""
        row = self.check_removal(session, workspace_id, revision, target, operation)
        if (session.scalar(select(AssetLocation.id).where(AssetLocation.workspace_id == workspace_id).limit(1))
                or session.scalar(select(FormalOutput.id).where(FormalOutput.workspace_id == workspace_id).limit(1))):
            raise StorageError("WORKSPACE_HAS_ASSETS")
        settings = load_storage_settings(self.root)
        changed = False
        if settings["workspace"]["default_workspace_id"] == workspace_id:
            if target is None:
                raise StorageError("DEFAULT_WORKSPACE_REQUIRED")
            settings["workspace"]["default_workspace_id"] = target
            changed = True
        if "workspace_order" in settings:
            order = [key for key in settings["workspace_order"] if key != workspace_id]
            if order != settings["workspace_order"]:
                settings["workspace_order"] = order
                changed = True
        if settings.get("location_quotas", {}).pop(workspace_id, None) is not None:
            changed = True
        # Publish a valid surviving default before deleting the old row. A crash between
        # the two commits leaves both registered, and a removal job can finish on restart.
        # Unrelated removals must not bump the settings revision and invalidate open forms.
        if changed:
            write_storage_settings(self.root, settings, settings["revision"])
        session.delete(row)

    def remove(self, workspace_id, revision):
        with self.lease(workspace_id), self.lock(), self.db.session() as session:
            self.unregister_empty(session, workspace_id, revision)
        return {"removed": True}


def rebind_workspace(session, workspace_id, target):
    location = session.get(StorageLocation, workspace_id)
    location.root_path = str(target)
    location.canonical_root = os.path.normcase(str(target))
    location.revision += 1


def validate_name(name):
    if not isinstance(name, str) or not name.strip() or len(name) > 120:
        raise StorageError("INVALID_WORKSPACE_NAME")
    return name.strip()

