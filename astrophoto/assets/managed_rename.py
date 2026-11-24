"""Recoverable directory moves for managed catalog assets."""

from contextlib import ExitStack, contextmanager
from pathlib import Path
from uuid import uuid4

from sqlalchemy import select

from ..core.config import read_json, sync_directory, write_json_atomically
from ..core.errors import StorageError
from ..database.catalog_models import CollectionDirectory, Subframe
from ..database.models import AssetLocation
from ..storage.import_planner import disk_name_key, managed_destination, managed_relative_key
from ..storage.manager import rename_noreplace
from ..storage.paths import checked_path, safe_join_workspace


def _identity(path):
    info = path.stat()
    return [info.st_dev, info.st_ino]


def _paths(runtime, entry):
    root = runtime.workspaces.require(entry["workspace"])
    return tuple(safe_join_workspace(root, entry[key]) for key in ("old", "temporary", "new"))


def _move(source, destination):
    try:
        rename_noreplace(source, destination)
    except FileExistsError as exc:
        raise StorageError("OBJECT_CONFLICT") from exc
    sync_directory(source.parent)
    if source.parent != destination.parent:
        sync_directory(destination.parent)


def _reconcile(runtime, journal):
    entries = read_json(journal)["entries"]
    with runtime.db.session() as session:
        for entry in entries:
            if collection := entry.get("collection"):
                directory = next((key for key in (entry["old"], entry["new"])
                                  if (row := session.get(CollectionDirectory, (entry["workspace"], key)))
                                  and row.collection_id == collection), None)
            else:
                row = session.get(AssetLocation, entry["location"])
                directory = (row.relative_key.rpartition("/")[0]
                             if row is not None and row.workspace_id == entry["workspace"] else None)
            old, temporary, new = _paths(runtime, entry)
            if directory not in {entry["old"], entry["new"]}:
                raise StorageError("RECOVERY_REQUIRED")
            desired = old if directory == entry["old"] else new
            if desired.exists() and desired.name in {item.name for item in desired.parent.iterdir()}:
                if _identity(desired) != entry["identity"]:
                    raise StorageError("RECOVERY_REQUIRED")
                continue
            candidates = (temporary, new if desired is old else old)
            original = next((path for path in candidates if path.exists() and _identity(path) == entry["identity"]), None)
            if original is None:
                raise StorageError("RECOVERY_REQUIRED")
            if original is not temporary:
                _move(original, temporary)
            _move(temporary, desired)
    journal.unlink()
    sync_directory(journal.parent)


def recover_managed_renames(runtime):
    for path in (runtime.root / "runtime").glob("catalog-rename-*.json"):
        journal = checked_path(path)
        with ExitStack() as locks:
            workspaces = {entry["workspace"] for entry in read_json(journal)["entries"]}
            for workspace in sorted(workspaces):
                locks.enter_context(runtime.workspaces.lease(workspace))
            _reconcile(runtime, journal)


@contextmanager
def catalog_edit(runtime, rename):
    with ExitStack() as locks:
        journal = None
        if rename:
            locks.enter_context(runtime.workspaces.lock())
            recover_managed_renames(runtime)

        def rename_directories(session, kind, resource_id, name):
            nonlocal journal
            query = select(AssetLocation).where(AssetLocation.storage_mode == "managed")
            if kind == "subframe_collection":
                query = query.join(Subframe, Subframe.id == AssetLocation.asset_id).where(
                    Subframe.collection_id == resource_id
                )
            else:
                query = query.where(AssetLocation.asset_id == resource_id)
            groups = {}
            for location in session.scalars(query):
                if location.relative_key.startswith("objects/"):
                    directory = location.relative_key.rpartition("/")[0]
                    groups.setdefault((location.workspace_id, directory), []).append(location)
            owned = {}
            if kind == "subframe_collection":
                for claim in session.scalars(select(CollectionDirectory).where(
                    CollectionDirectory.collection_id == resource_id
                )):
                    pair = (claim.workspace_id, claim.relative_key)
                    owned[pair] = claim
                    groups.setdefault(pair, [])
            for workspace in sorted({workspace for workspace, _ in groups}):
                locks.enter_context(runtime.workspaces.lease(workspace))
            entries = []
            operation = str(uuid4())
            for (workspace, directory), locations in groups.items():
                root = runtime.workspaces.require(workspace)
                old = safe_join_workspace(root, directory)
                category = directory.split("/")[1]
                attrs = {"subframes": {"role": "raw"}, "masters": {"role": "master_frame"},
                         "videos": {"file_kind": "video"}, "images": {}}[category]
                names = {Path(row.relative_key).name for row in locations}
                claim = owned.get((workspace, directory))
                if claim and not locations and not old.exists():
                    session.delete(claim)
                    continue
                files = [checked_path(path) for path in old.iterdir()] if old.is_dir() else []
                actual = {path.name for path in files}
                if (not old.is_dir() or any(not path.is_file() for path in files)
                        or not names <= actual or (claim is None and actual != names)):
                    raise StorageError("OBJECT_CONFLICT", "Unexpected or missing files in the material directory")
                new = managed_destination(root, managed_relative_key("_", attrs, name)).parent
                for filename in actual:
                    managed_destination(root, managed_relative_key(filename, attrs, name))
                for row in locations:
                    row.relative_key = managed_relative_key(Path(row.relative_key).name, attrs, name)
                if str(old) == str(new):
                    continue
                if any(item.name != old.name and disk_name_key(item.name) == disk_name_key(new.name)
                       for item in new.parent.iterdir()):
                    raise StorageError("OBJECT_CONFLICT")
                new_key = new.relative_to(root).as_posix()
                if claim:
                    if session.get(CollectionDirectory, (workspace, new_key)):
                        raise StorageError("OBJECT_CONFLICT")
                    claim.relative_key = new_key
                anchor = {"collection": resource_id} if claim else {"location": locations[0].id}
                entries.append({"workspace": workspace, "old": directory, "new": new_key,
                                "temporary": f".staging/rename-{operation}", "identity": _identity(old),
                                **anchor})
            if entries:
                journal = checked_path(runtime.root / "runtime" / f"catalog-rename-{operation}.json")
                write_json_atomically(journal, {"entries": entries}, replace=False)
                for entry in entries:
                    old, temporary, new = _paths(runtime, entry)
                    _move(old, temporary)
                    _move(temporary, new)

        try:
            with runtime.db.session(transaction="write") as session:
                yield session, rename_directories
        finally:
            if journal is not None and journal.exists():
                _reconcile(runtime, journal)
