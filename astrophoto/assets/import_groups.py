"""Subframe import groups use stable per-file identities across storage locations."""

from datetime import date
from pathlib import Path

from sqlalchemy import func, select

from ..core.errors import StorageError
from ..database.library_models import AssetImportFrame, LibraryRecord
from ..database.models import AssetLocation, StorageLocation


def create_group(session, group_id, first_filename):
    group = session.get(LibraryRecord, group_id)
    if group is None:
        name = f"{date.today().isoformat()} · {Path(first_filename).stem}"
        group = LibraryRecord(id=group_id, kind="import_group", data={"name": name})
        session.add(group)
        session.flush()
    elif group.kind != "import_group":
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    return group


def link_frame(session, asset_id, group_id, index):
    session.add(AssetImportFrame(asset_id=asset_id, group_id=group_id, frame_index=index))


def group_summaries(session):
    counts = session.execute(
        select(LibraryRecord.id, LibraryRecord.revision, LibraryRecord.data, StorageLocation.id, StorageLocation.name,
               func.count(AssetImportFrame.asset_id))
        .select_from(AssetImportFrame)
        .join(LibraryRecord, LibraryRecord.id == AssetImportFrame.group_id)
        .join(AssetLocation, AssetLocation.asset_id == AssetImportFrame.asset_id)
        .join(StorageLocation, StorageLocation.id == AssetLocation.workspace_id)
        .where(LibraryRecord.kind == "import_group")
        .group_by(LibraryRecord.id, StorageLocation.id)
        .order_by(LibraryRecord.id, StorageLocation.name, StorageLocation.id)
    )
    groups = {}
    for group_id, revision, data, location_id, location_name, count in counts:
        group = groups.setdefault(group_id, {"id": group_id, "revision": revision, "name": data["name"],
                                             "count": 0, "workspaces": []})
        group["count"] += count
        group["workspaces"].append({"id": location_id, "name": location_name, "count": count})
    return list(groups.values())
