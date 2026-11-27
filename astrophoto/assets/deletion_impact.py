"""Describe catalog dependencies before a destructive operation."""

import hashlib
import json

from sqlalchemy import select

from ..database.catalog_models import (
    CalibrationBinding, CalibrationMaster, ImageResult, Project, ProjectNode, Subframe, SubframeCollection,
)
from ..database.library_models import AssetAttributes
from ..database.models import Asset
from ..core.errors import StorageError
from . import catalog


def inspect_deletion(session, kind, ident, member_id=None, *, files):
    """Compute a deterministic impact snapshot from the current database state."""
    if kind == "subframe_collection":
        group = catalog.require(session, SubframeCollection, ident)
        members = list(session.scalars(select(Subframe).where(Subframe.collection_id == group.id)))
        if member_id:
            members = [member for member in members if member.id == member_id]
            if len(members) != 1:
                raise StorageError("INVALID_LIBRARY_REFERENCE")
        ids = [member.id for member in members]
    else:
        if member_id:
            raise StorageError("INVALID_REQUEST")
        group = catalog.require(session, Asset if kind == "asset" else catalog.MODELS[kind], ident)
        if kind == "image_result":
            group = session.get(CalibrationMaster, ident) or group
        ids = [ident]

    related_ids = sorted(set(ids) | ({ident} if kind == "subframe_collection" and not member_id else set()))
    related_set = set(related_ids)
    member_set = set(ids)
    projects = []
    for start in range(0, len(related_ids), 500):
        query = (select(Project.name, ProjectNode.name, ProjectNode.id, ProjectNode.revision)
                 .join(Project, Project.id == ProjectNode.project_id)
                 .where(ProjectNode.resource_id.in_(related_ids[start:start + 500])))
        projects.extend(dict(project=p, name=n, id=i, revision=r) for p, n, i, r in session.execute(query))
    bindings = []
    if kind == "subframe_collection" and not member_id:
        query = select(CalibrationBinding).where(CalibrationBinding.collection_id == ident)
    elif kind in ("image_result", "calibration_master", "asset"):
        query = select(CalibrationBinding).where(CalibrationBinding.master_id == ident)
    else:
        query = None
    if query is not None:
        for binding in session.scalars(query):
            collection = session.get(SubframeCollection, binding.collection_id)
            master = session.get(CalibrationMaster, binding.master_id)
            bindings.append(dict(collection_id=binding.collection_id, collection=collection.name if collection else None,
                                 master_id=binding.master_id, master=master.name if master else None))
    sources = []
    if kind == "subframe_collection" and not member_id:
        for model in (CalibrationMaster, ImageResult):
            for row in session.scalars(select(model).where(model.source_collection_id == ident)):
                sources.append(dict(id=row.id, name=row.name, kind=model.__tablename__, revision=row.revision))
    for attrs in session.scalars(select(AssetAttributes)):
        if attrs.asset_id in member_set:
            continue
        for field in ("source_asset_id", "calibration_source_asset_id", "source_collection_id"):
            if isinstance(value := attrs.attributes.get(field), str) and value in related_set:
                asset = session.get(Asset, attrs.asset_id)
                sources.append(dict(id=attrs.asset_id, name=asset.name if asset else None,
                                    field=field, revision=attrs.revision))
    registered_files = files.inspect(session, ids)
    for items in (projects, bindings, sources, registered_files):
        items.sort(key=lambda item: json.dumps(item, sort_keys=True, ensure_ascii=False))
    target_name = catalog.require(session, Asset, member_id).name if member_id else group.name
    result = dict(kind=kind, id=ident, member_id=member_id, name=target_name,
                  revision=getattr(group, "revision", None), asset_ids=sorted(ids), projects=projects,
                  calibration_bindings=bindings, sources=sources, files=registered_files)
    result["has_associations"] = bool(projects or bindings or sources)
    result["impact_revision"] = hashlib.sha256(json.dumps(result, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    return result
