"""Subframe import groups use stable per-file identities across storage locations."""

from datetime import date
from pathlib import Path

from sqlalchemy import func, select

from ..core.errors import StorageError
from ..database.library_models import AssetImportFrame, LibraryRecord
from ..database.catalog_models import Subframe, SubframeCollection
from ..database.models import AssetLocation, StorageLocation


def create_group(session, group_id, first_filename, *, name=None):
    group = session.get(LibraryRecord, group_id)
    if group is None:
        name = name or f"{date.today().isoformat()} · {Path(first_filename).stem}"
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
        select(SubframeCollection.id, SubframeCollection.revision, SubframeCollection.name, SubframeCollection.frame_type,
               StorageLocation.id, StorageLocation.name, func.count(Subframe.id))
        .select_from(SubframeCollection)
        .outerjoin(Subframe, SubframeCollection.id == Subframe.collection_id)
        .outerjoin(AssetLocation, AssetLocation.asset_id == Subframe.id)
        .outerjoin(StorageLocation, StorageLocation.id == AssetLocation.workspace_id)
        .group_by(SubframeCollection.id, StorageLocation.id)
        .order_by(SubframeCollection.id, StorageLocation.name, StorageLocation.id)
    )
    groups = {}
    for group_id, revision, name, frame_type, location_id, location_name, count in counts:
        group = groups.setdefault(group_id, {"id": group_id, "revision": revision, "name": name,
                                             "frame_type": frame_type, "count": 0, "workspaces": []})
        group["count"] += count
        if location_id is not None:
            group["workspaces"].append({"id": location_id, "name": location_name, "count": count})
    return list(groups.values())
