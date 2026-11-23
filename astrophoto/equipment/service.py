"""Transactional device records, typed specifications and reference protection."""

from datetime import UTC, datetime
from unicodedata import normalize
from uuid import uuid4

from sqlalchemy import delete, func, or_, select, update

from ..core.errors import StorageError
from ..database.equipment_models import (
    SPEC_MODELS, CameraReadoutMode, Equipment, FilterPassband, OpticalTrain, OpticalTrainDraft, OpticalTrainRevision,
)
from ..database.library_models import asset_metadata_references
from .schemas import equipment_fields, invalid, version


def now():
    return datetime.now(UTC).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def row_dict(row, omit=()):
    return {col.name: getattr(row, col.name) for col in row.__table__.columns if col.name not in omit}


def load_equipment(session, equipment_id):
    entity = session.get(Equipment, equipment_id)
    if entity is None:
        raise StorageError("EQUIPMENT_NOT_FOUND")
    return entity


def equipment_to_dto(session, entity, *, include_usage=False):
    spec = session.get(SPEC_MODELS[entity.equipment_type], entity.id)
    if spec is None:
        raise StorageError("DATABASE_INVALID")
    specs = row_dict(spec, ("equipment_id",))
    if entity.equipment_type == "filter":
        bands = session.scalars(select(FilterPassband).filter_by(filter_id=entity.id).order_by(FilterPassband.position))
        specs["passbands"] = [row_dict(band, ("filter_id", "position")) for band in bands]
    if entity.equipment_type == "camera":
        modes = session.scalars(select(CameraReadoutMode).filter_by(camera_id=entity.id).order_by(CameraReadoutMode.mode_key))
        specs["readout_modes"] = [row_dict(mode, ("id", "camera_id")) for mode in modes]
    result = dict(row_dict(entity), specs=specs)
    if include_usage:
        result["usage_summary"] = check_equipment_references(session, entity.id)
    return result


def check_equipment_references(session, equipment_id):
    usage = {}
    for draft, train in session.execute(select(OpticalTrainDraft, OpticalTrain).join(OpticalTrain)):
        data = draft.draft_json
        if equipment_id in (data["camera_id"], data["primary_optics_id"], *data["accessory_ids"], *data["filter_ids"]):
            usage[train.id] = {"train_id": train.id, "name": train.name, "draft": True, "revisions": []}
    for rev, train in session.execute(select(OpticalTrainRevision, OpticalTrain).join(OpticalTrain)
                                      .order_by(OpticalTrainRevision.revision_number)):
        data = rev.snapshot_json
        components = (data["camera"], data["primary_optics"], *data["accessories"], *data["filters"])
        if any(part["equipment_id"] == equipment_id for part in components):
            entry = usage.setdefault(train.id, {"train_id": train.id, "name": train.name, "draft": False, "revisions": []})
            entry["revisions"].append({"id": rev.id, "revision_number": rev.revision_number})
    return list(usage.values())


def persist_specs(session, entity, data, *, creating=False):
    model = SPEC_MODELS[entity.equipment_type]
    spec = model(equipment_id=entity.id) if creating else session.get(model, entity.id)
    bands = data.pop("passbands", None)
    modes = data.pop("readout_modes", None)
    for key, value in data.items():
        setattr(spec, key, value)
    session.add(spec)
    session.flush()
    if bands is not None:
        existing = set(session.scalars(select(FilterPassband.id).filter_by(filter_id=entity.id)))
        if any(band["id"] is not None and band["id"] not in existing for band in bands):
            invalid("specs.passbands", "invalid_reference")
        session.execute(delete(FilterPassband).filter_by(filter_id=entity.id))
        for index, band in enumerate(bands):
            session.add(FilterPassband(**dict(band, id=band["id"] or str(uuid4())),
                                       filter_id=entity.id, position=index))
    if modes is not None:
        session.execute(delete(CameraReadoutMode).filter_by(camera_id=entity.id))
        session.add_all(CameraReadoutMode(**mode, id=str(uuid4()), camera_id=entity.id) for mode in modes)
    session.flush()


def archive_filter(model, archived):
    if archived == "all":
        return True
    return model.archived_at_utc.is_not(None) if archived == "true" else model.archived_at_utc.is_(None)


def name_key(name):
    return normalize("NFC", name.strip().casefold())


def validate_unique_name(session, model, name, *, previous_name=None, scope=()):
    key = name_key(name)
    if previous_name is not None and key == name_key(previous_name):
        return
    # Call inside a write transaction so concurrent requests cannot both pass the check.
    if any(name_key(other) == key for other in session.scalars(select(model.name).where(*scope))):
        invalid("name", "duplicate")


def change_version(session, mapped_model, entity, expected_version, code, **values):
    result = session.execute(update(mapped_model).where(mapped_model.id == entity.id, mapped_model.row_version == expected_version)
                             .values(**values, row_version=expected_version + 1, updated_at_utc=now()))
    if result.rowcount != 1:
        raise StorageError(code)
    session.refresh(entity)


class EquipmentService:
    def __init__(self, db):
        self.db = db

    def list_equipment(self, *, kind=None, q="", archived="false", after=None, limit=50):
        with self.db.session(transaction="read") as session:
            conditions = [archive_filter(Equipment, archived)]
            if kind:
                conditions.append(Equipment.equipment_type == kind)
            if q:
                # SQLite lower() handles ASCII only. Unicode casefold keeps names in other scripts searchable.
                session.connection().connection.driver_connection.create_function("ap_casefold", 1, str.casefold)
                conditions.append(or_(*(func.ap_casefold(func.coalesce(field, "")).contains(q.casefold(), autoescape=True)
                                        for field in (Equipment.name, Equipment.manufacturer, Equipment.model))))
            total = session.scalar(select(func.count()).select_from(Equipment).where(*conditions))
            if after:
                conditions.append(Equipment.id > after)
            rows = list(session.scalars(select(Equipment).where(*conditions).order_by(Equipment.id).limit(limit + 1)))
            return {"total": total, "items": [equipment_to_dto(session, row) for row in rows[:limit]],
                    "next": rows[limit - 1].id if len(rows) > limit else None}

    def get_equipment(self, equipment_id):
        with self.db.session(transaction="read") as session:
            return equipment_to_dto(session, load_equipment(session, equipment_id), include_usage=True)

    def create_equipment(self, body):
        values = equipment_fields(body, creating=True)
        specs = values.pop("specs", {})
        with self.db.session(transaction="write") as session:
            validate_unique_name(session, Equipment, values["name"])
            moment = now()
            entity = Equipment(**values, id=str(uuid4()), created_at_utc=moment, updated_at_utc=moment)
            session.add(entity)
            session.flush()
            persist_specs(session, entity, specs, creating=True)
            return equipment_to_dto(session, entity, include_usage=True)

    def update_equipment(self, equipment_id, body):
        with self.db.session(transaction="write") as session:
            entity = load_equipment(session, equipment_id)
            values = equipment_fields(body, creating=False, kind=entity.equipment_type)
            specs = values.pop("specs", {})
            expected = version(body["expected_version"])
            if entity.row_version != expected:
                raise StorageError("EQUIPMENT_VERSION_CONFLICT")
            if "name" in values:
                validate_unique_name(session, Equipment, values["name"], previous_name=entity.name)
            change_version(session, Equipment, entity, expected,
                           "EQUIPMENT_VERSION_CONFLICT", **values)
            persist_specs(session, entity, specs)
            return equipment_to_dto(session, entity, include_usage=True)

    def set_archived(self, equipment_id, expected_version, archived):
        with self.db.session(transaction="write") as session:
            entity = load_equipment(session, equipment_id)
            change_version(session, Equipment, entity, version(expected_version), "EQUIPMENT_VERSION_CONFLICT",
                           archived_at_utc=(entity.archived_at_utc or now()) if archived else None)
            return equipment_to_dto(session, entity, include_usage=True)

    def delete_unused_equipment(self, equipment_id, expected_version):
        with self.db.session(transaction="write") as session:
            entity = load_equipment(session, equipment_id)
            if entity.row_version != version(expected_version):
                raise StorageError("EQUIPMENT_VERSION_CONFLICT")
            if (check_equipment_references(session, equipment_id) or
                    asset_metadata_references(session, equipment_id, "camera_id", "equipment_ids")):
                raise StorageError("EQUIPMENT_REFERENCED")
            session.execute(delete(FilterPassband).filter_by(filter_id=equipment_id))
            session.execute(delete(CameraReadoutMode).filter_by(camera_id=equipment_id))
            session.execute(delete(SPEC_MODELS[entity.equipment_type]).filter_by(equipment_id=equipment_id))
            session.delete(entity)
