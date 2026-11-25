"""Typed catalog validation and persistence."""

from datetime import UTC, datetime
from pathlib import Path
from unicodedata import normalize

from sqlalchemy import func, select, tuple_

from ..core.errors import StorageError
from ..database.catalog_models import (
    AssetName, CalibrationBinding, CalibrationMaster, ImageResult, Subframe, SubframeCollection, Video,
)
from ..database.equipment_models import Equipment, OpticalTrain
from ..database.models import Asset, AssetLocation, StorageLocation
from ..database.library_models import AssetAttributes, LibraryRecord
from .library_rules import identifier, identifiers, label, properties

MODELS = {
    "subframe_collection": SubframeCollection, "video": Video,
    "image_result": ImageResult, "calibration_master": CalibrationMaster,
}
CAPTURE = {
    "exposure_seconds": "exposure", "iso": "iso", "gain": "gain", "offset": "offset",
    "binning": "binning", "readout_mode": "readout_mode", "temperature_c": "temperature",
}
MASTER_TYPES = {"dark", "bias", "dark_flat", "flat"}
OPTICAL_FIELDS = ("equipment_train_id", "filter_state", "filter_id")


def now():
    return datetime.now(UTC).isoformat()


def touch_dates(session, resource_id, *, created=False):
    key = 'catalog_dates_' + resource_id
    record = session.get(LibraryRecord, key)
    stamp = now()
    if record:
        record.data = {**record.data, 'updated_at_utc': stamp}
    else:
        data = {'updated_at_utc': stamp}
        if created:
            data['created_at_utc'] = stamp
        session.add(LibraryRecord(id=key, kind='catalog_dates', data=data))


def forget_dates(session, resource_id):
    record = session.get(LibraryRecord, 'catalog_dates_' + resource_id)
    if record:
        session.delete(record)


def data(row, excluded=()):
    return {column.name: getattr(row, column.name) for column in row.__table__.columns
            if column.name not in excluded}


def require(session, model, key):
    row = session.get(model, identifier(key))
    if row is None:
        raise StorageError("LIBRARY_RECORD_NOT_FOUND")
    return row


def choice(value, allowed):
    if not isinstance(value, str) or value not in allowed:
        raise StorageError("INVALID_REQUEST")
    return value


def revision(row, expected):
    if type(expected) is not int or expected != row.revision:
        raise StorageError("REVISION_CONFLICT")


def name_key(name):
    return normalize("NFC", name.strip().casefold())


def check_name(session, name, resource_id=None):
    existing = session.get(AssetName, name_key(name))
    if existing and existing.resource_id != resource_id:
        raise StorageError("ASSET_NAME_CONFLICT", details={"name": name})


def reserve_name(session, name, resource_id):
    key = name_key(name)
    check_name(session, name, resource_id)
    existing = session.scalar(select(AssetName).where(AssetName.resource_id == resource_id))
    if existing:
        existing.name_key = key
    else:
        session.add(AssetName(name_key=key, resource_id=resource_id))
    session.flush()


def optical(session, fields):
    train_id, filter_id = fields.get("equipment_train_id"), fields.get("filter_id")
    state = choice(fields.get("filter_state", "unknown"), {"selected", "none", "unknown"})
    if (filter_id is not None) != (state == "selected"):
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    train = require(session, OpticalTrain, train_id) if train_id is not None else None
    if train and (train.deleted_at_utc or train.archived_at_utc):
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    if filter_id is not None and (not train or filter_id not in train.filter_ids):
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    selected = require(session, Equipment, filter_id) if filter_id is not None else None
    if selected and (selected.equipment_type != "filter" or selected.archived_at_utc):
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    snapshot = data(train) if train else None
    if train:
        ids = [train.camera_id, train.primary_optics_id, train.accessory_id, *train.filter_ids, *train.other_ids]
        snapshot["components"] = [data(row) for row in session.scalars(select(Equipment).where(Equipment.id.in_(ids)))]
    return {"equipment_train_id": train_id, "equipment_snapshot": snapshot, "filter_state": state,
            "filter_id": filter_id, "filter_snapshot": data(selected) if selected else None}


def prepare(session, body):
    """Validate explicit metadata and freeze the selected optical train at preflight."""
    if not isinstance(body, dict):
        raise StorageError("INVALID_REQUEST")
    body = dict(body)
    master_type = body.pop("master_type", None)
    if master_type is not None:
        choice(master_type, MASTER_TYPES | {"light", "unknown"})
        if body.get("kind") != "image_result" or body.get("result_type") != "master_frame":
            raise StorageError("INVALID_REQUEST")
        if master_type in MASTER_TYPES:
            body.update(kind="calibration_master", type=master_type)
            body.pop("result_type", None)
    kind = choice(body.get("kind"), MODELS)
    allowed = {"kind", "name", "notes"}
    if kind == "image_result":
        allowed.add("result_type")
    allowed.update(OPTICAL_FIELDS)
    ordinary_master = kind == "image_result" and body.get("result_type") == "master_frame"
    if kind in {"subframe_collection", "calibration_master"} or ordinary_master:
        allowed.update(CAPTURE)
    if ordinary_master:
        allowed.add("source_collection_id")
    if kind == "subframe_collection":
        allowed.update(("frame_type", "calibration_state", "master_ids", "confirmed"))
    if kind == "calibration_master":
        allowed.update(("type", "source_collection_id", "camera_id"))
    if body.keys() - allowed:
        raise StorageError("INVALID_REQUEST")
    notes = body.get("notes")
    fields = {"name": label(body.get("name")), "notes": label(notes, 4000) if notes is not None else None}
    source = None
    if kind == "calibration_master":
        fields["type"] = choice(body.get("type"), MASTER_TYPES)
        if body.get("source_collection_id") is not None:
            source = require(session, SubframeCollection, body["source_collection_id"])
            if source.frame_type != fields["type"]:
                raise StorageError("INVALID_CALIBRATION_MASTER")
        fields["source_collection_id"] = source.id if source else None
    if ordinary_master:
        source = require(session, SubframeCollection, body["source_collection_id"]) if body.get("source_collection_id") else None
        if source and (master_type or "unknown") != "unknown" and source.frame_type != master_type:
            raise StorageError("INVALID_CALIBRATION_MASTER")
        fields["source_collection_id"] = source.id if source else None
    if kind in {"subframe_collection", "calibration_master"} or ordinary_master:
        values = properties({legacy: body[key] for key, legacy in CAPTURE.items() if key in body})
        fields.update({key: values.get(legacy, getattr(source, key, None)) for key, legacy in CAPTURE.items()})
    if source and not any(key in body for key in OPTICAL_FIELDS):
        fields.update({key: getattr(source, key) for key in (*OPTICAL_FIELDS, "equipment_snapshot", "filter_snapshot")})
    else:
        fields.update(optical(session, body))
    if kind == "calibration_master":
        camera_id, camera_snapshot = (
            camera_binding(session, body["camera_id"]) if "camera_id" in body
            else inherited_camera_binding(session, fields["equipment_snapshot"])
        )
        fields.update(camera_id=camera_id, camera_snapshot=camera_snapshot)
    masters = []
    confirmed = body.get("confirmed", False)
    if type(confirmed) is not bool:
        raise StorageError("INVALID_REQUEST")
    if kind == "subframe_collection":
        fields["frame_type"] = choice(body.get("frame_type", "unknown"), MASTER_TYPES | {"light", "unknown"})
        fields["calibration_state"] = choice(body.get("calibration_state", "unknown"),
                                             {"unknown", "calibrated", "uncalibrated"})
        masters = identifiers(body.get("master_ids", []))
    plan = {"kind": kind, "fields": fields, "master_ids": masters, "confirmed": confirmed}
    if master_type is not None:
        plan["master_type"] = master_type
    if kind == "image_result" and "result_type" in body:
        plan["result_type"] = choice(body["result_type"], {"master_frame", "image_result"})
    return plan


def capture_filter(state, filter_id, snapshot):
    if state == "none":
        return state
    return (snapshot or {}).get("id") or (filter_id if state == "selected" else state)


def comparison(fields, master):
    """Use type-specific conditions and acknowledge properties we cannot observe."""
    if master.type not in binding_types(fields["frame_type"]):
        raise StorageError("INVALID_CALIBRATION_MASTER")
    snapshot = fields["equipment_snapshot"] or {}
    master_camera = (master.camera_snapshot or {}).get("id") or master.camera_id
    values = {"camera_id": (snapshot.get("camera_id"), master_camera)}
    for key in ("iso", "gain", "offset", "binning", "readout_mode"):
        values[key] = (fields[key], getattr(master, key))
    # ISO and gain describe different capture modes. Skip the unused parameter
    # when both sides supplied the other one.
    for key, other in (("iso", "gain"), ("gain", "iso")):
        if values[key] == (None, None) and None not in values[other]:
            del values[key]
    if master.type in {"dark", "dark_flat"}:
        values["exposure_seconds"] = (fields["exposure_seconds"], master.exposure_seconds)
    if master.type == "flat":
        values.update(equipment_train_id=(fields["equipment_train_id"], master.equipment_train_id),
                      filter=(capture_filter(fields["filter_state"], fields["filter_id"], fields.get("filter_snapshot")),
                              capture_filter(master.filter_state, master.filter_id, master.filter_snapshot)),
                      optical_state=(None, None))
    result = {}
    for key, (actual, expected) in values.items():
        if actual in (None, "unknown") or expected in (None, "unknown"):
            status = "unknown"
        else:
            status = "match" if actual == expected else "difference"
        result[key] = {"status": status, "actual": actual, "expected": expected}
    return result


def binding_types(frame_type):
    return {"light": {"dark", "bias", "flat"}, "flat": {"bias", "dark_flat"}}.get(frame_type, set())


def current_camera_id(session, camera_id):
    camera = session.get(Equipment, camera_id) if camera_id else None
    return camera.id if camera and camera.equipment_type == "camera" else None


def inherited_camera_binding(session, snapshot):
    snapshot = snapshot or {}
    camera_id = snapshot.get("camera_id")
    historical = next((item for item in snapshot.get("components", []) if item["id"] == camera_id), None)
    camera = session.get(Equipment, camera_id) if camera_id else None
    if (historical and historical["equipment_type"] != "camera") or (camera and camera.equipment_type != "camera"):
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    return camera.id if camera else None, historical or (data(camera) if camera else None)


def camera_binding(session, camera_id):
    if camera_id is None:
        return None, None
    camera = require(session, Equipment, camera_id)
    if camera.equipment_type != "camera" or camera.archived_at_utc:
        raise StorageError("INVALID_LIBRARY_REFERENCE")
    return camera.id, data(camera)


def comparisons(session, plan):
    return [{"id": key, "name": master.name, "fields": comparison(plan["fields"], master)}
            for key in plan["master_ids"] for master in [require(session, CalibrationMaster, key)]]


def preflight(runtime, body, existing_id=None):
    with runtime.db.session(transaction="read") as session:
        plan = prepare(session, body)
        check_name(session, plan["fields"]["name"], existing_id)
        plan["comparison"] = comparisons(session, plan)
    return plan


def import_attributes(plan):
    # Prepare file metadata used for placement and asset details.
    fields = plan["fields"]
    kind = plan["kind"]
    if kind == "video":
        return {"file_kind": "video"}
    if kind == "subframe_collection":
        return {"role": "raw", "usage": fields["frame_type"], "calibration_state": fields["calibration_state"]}
    if kind == "calibration_master":
        return {"role": "master_frame", "usage": fields["type"], "master_type": fields["type"]}
    result = {"role": "processed" if plan.get("result_type") == "image_result" else "master_frame"}
    if plan.get("master_type") is not None:
        result["master_type"] = plan["master_type"]
    return result


def finish_bindings(session, row, plan):
    if not plan["master_ids"]:
        return None
    try:
        with session.begin_nested():
            bind(session, row, plan["master_ids"], plan["confirmed"])
    except StorageError as exc:
        return {"code": exc.code, "master_ids": plan["master_ids"], "details": exc.details}
    return None


def bind(session, collection, masters, confirmed):
    fields = data(collection)
    pending = [key for key in masters if session.get(CalibrationBinding, (collection.id, key)) is None]
    rows = comparisons(session, {"fields": fields, "master_ids": pending})
    for key in pending:
        session.add(CalibrationBinding(collection_id=collection.id, master_id=key, created_at_utc=now()))
    if pending:
        touch_dates(session, collection.id)
    return rows


def publish(session, asset_id, plan, collection_id=None, index=0):
    kind, fields = plan["kind"], plan["fields"]
    model = MODELS[kind]
    key = collection_id if kind == "subframe_collection" else asset_id
    row = session.get(model, key)
    if row is None:
        if kind == "calibration_master":
            fields = {**fields, "camera_id": current_camera_id(session, fields.get("camera_id"))}
        if (filter_id := fields.get("filter_id")) and session.get(Equipment, filter_id) is None:
            fields = {**fields, "filter_id": None, "filter_state": "unknown"}
        reserve_name(session, fields["name"], key)
        touch_dates(session, key, created=True)
        stamp = now()
        timestamps = {"created_at_utc": stamp, "updated_at_utc": stamp} if hasattr(model, "created_at_utc") else {}
        row = model(id=key, **fields, **timestamps)
        session.add(row)
        session.flush()
    if kind == "calibration_master" and session.get(ImageResult, key) is None:
        session.add(ImageResult(id=key, name=row.name, notes=row.notes, equipment_train_id=row.equipment_train_id,
                                equipment_snapshot=row.equipment_snapshot, filter_state=row.filter_state,
                                filter_id=row.filter_id, filter_snapshot=row.filter_snapshot))
        session.flush()
    if kind == "subframe_collection":
        session.add(Subframe(id=asset_id, collection_id=key, frame_index=index))
    return row


def publish_unclassified_subframe(session, asset_id, group, index):
    existing = session.get(SubframeCollection, group.id)
    if existing is None:
        base = group.data["name"].strip()[:120].rstrip()
        name, suffix_number = base, 2
        while session.get(AssetName, name_key(name)) is not None:
            suffix = f" ({suffix_number})"
            name = base[:120 - len(suffix)].rstrip() + suffix
            suffix_number += 1
    else:
        name = existing.name
    plan = {"kind": "subframe_collection",
            "fields": {"name": name, "frame_type": "unknown", "calibration_state": "unknown"}}
    return publish(session, asset_id, plan, group.id, index)


def location(runtime, session, key):
    row = runtime.assets._location(session, key)
    workspace = session.get(StorageLocation, row.workspace_id) if row.workspace_id else None
    return location_fields(row, workspace)


def location_fields(row, workspace):
    path = row.external_path if row.storage_mode == 'external_reference' else (str(Path(workspace.root_path) / row.relative_key) if workspace and row.relative_key else None)
    return {"storage_mode": row.storage_mode, "workspace_id": row.workspace_id,
            "external_path": row.external_path, "relative_path": row.relative_key, "file_path": path}


def collection_members(session, collection_id, *, after=None, limit=None, member_id=None):
    query = (select(Subframe, Asset, AssetLocation, StorageLocation)
             .select_from(Subframe)
             .join(Asset, Asset.id == Subframe.id)
             .outerjoin(AssetLocation, AssetLocation.asset_id == Subframe.id)
             .outerjoin(StorageLocation, StorageLocation.id == AssetLocation.workspace_id)
             .where(Subframe.collection_id == collection_id)
             .order_by(Subframe.frame_index, Subframe.id))
    if member_id is not None:
        query = query.where(Subframe.id == member_id)
    if after is not None:
        query = query.where(tuple_(Subframe.frame_index, Subframe.id) > after)
    if limit is not None:
        query = query.limit(limit)
    items = []
    for member, asset, registered, workspace in session.execute(query):
        if registered is None:
            raise StorageError("ASSET_NOT_FOUND")
        items.append({"id": member.id, "collection_id": collection_id, "file_name": asset.name,
                      "size_bytes": asset.size_bytes, **location_fields(registered, workspace)})
    return items


def view(runtime, session, kind, row, *, detail=False, bindings=False):
    result = data(row)
    dates = session.get(LibraryRecord, 'catalog_dates_' + row.id)
    if dates:
        result.update(dates.data)
    if kind == "subframe_collection":
        result["count"] = session.scalar(select(func.count()).select_from(Subframe).where(Subframe.collection_id == row.id))
        facts = session.execute(select(Asset.name, AssetLocation.workspace_id).select_from(Subframe)
                                .join(Asset, Asset.id == Subframe.id)
                                .join(AssetLocation, AssetLocation.asset_id == Subframe.id)
                                .where(Subframe.collection_id == row.id)).all()
        result["extensions"] = sorted({Path(name).suffix.lstrip(".").lower() for name, _ in facts if Path(name).suffix})
        result["workspace_ids"] = sorted({workspace or "external" for _, workspace in facts})
        if detail:
            result["subframes"] = collection_members(session, row.id)
        if detail or bindings:
            result["master_ids"] = list(session.scalars(select(CalibrationBinding.master_id)
                                        .where(CalibrationBinding.collection_id == row.id)))
    else:
        result.update(location(runtime, session, row.id))
        asset = session.get(Asset, row.id)
        result["file_name"] = asset.name if asset else None
        result["extensions"] = [Path(asset.name).suffix.lstrip(".").lower()] if asset and Path(asset.name).suffix else []
        result["workspace_ids"] = [result["workspace_id"] or "external"]
        if kind == "image_result":
            result["result_type"] = image_result_type(session, row.id)
            master = session.get(CalibrationMaster, row.id)
            attrs = session.get(AssetAttributes, row.id)
            result["master_type"] = master.type if master else (attrs.attributes.get("master_type", "unknown") if attrs and result["result_type"] == "master_frame" else None)
            if master:
                result["revision"] = master.revision
                for key in ("camera_id", "camera_snapshot", "source_collection_id", *CAPTURE):
                    result[key] = getattr(master, key)
                source = session.get(SubframeCollection, master.source_collection_id) if master.source_collection_id else None
                result["source_collection_name"] = source.name if source else None
            elif result["result_type"] == "master_frame":
                source = session.get(SubframeCollection, row.source_collection_id) if row.source_collection_id else None
                result["source_collection_name"] = source.name if source else None
            else:
                for key in ("source_collection_id", *CAPTURE):
                    result.pop(key, None)
    return result


def image_result_type(session, asset_id):
    attrs = session.get(AssetAttributes, asset_id)
    return "image_result" if attrs and attrs.attributes.get("role") == "processed" else "master_frame"
