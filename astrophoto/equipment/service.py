"""Transactional device records, typed specifications and reference protection."""

from datetime import UTC, datetime
from unicodedata import normalize
from uuid import uuid4

from sqlalchemy import func, or_, select, update

from ..core.errors import StorageError
from ..database.catalog_models import CalibrationMaster
from ..database.equipment_models import Equipment, OpticalTrain
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
    result = row_dict(entity)
    if include_usage:
        result["usage_summary"] = check_equipment_references(session, entity.id)
    return result


def check_equipment_references(session, equipment_id):
    usage = []
    for train in session.scalars(select(OpticalTrain)):
        if equipment_id in (train.camera_id, train.primary_optics_id, train.accessory_id, *train.filter_ids, *train.other_ids):
            usage.append({"train_id": train.id, "name": train.name, "draft": True, "revisions": []})
    return usage


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

    def list_equipment(self, *, kind=None, q="", archived="false", after=None, limit=50, sort=None):
        with self.db.session(transaction="read") as session:
            conditions = [archive_filter(Equipment, archived)]
            if kind:
                conditions.append(Equipment.equipment_type == kind)
            if q:
                # SQLite lower() handles ASCII only. Unicode casefold keeps names in other scripts searchable.
                session.connection().connection.driver_connection.create_function("ap_casefold", 1, str.casefold)
                conditions.append(or_(*(func.ap_casefold(func.coalesce(field, "")).contains(q.casefold(), autoescape=True)
                                        for field in (Equipment.name, Equipment.product_name))))
            total = session.scalar(select(func.count()).select_from(Equipment).where(*conditions))
            if sort:
                from .pagination import sorted_page
                rows, next_cursor = sorted_page(session, Equipment, conditions, sort, after, limit,
                                                {"q": q, "archived": archived, "type": kind})
                return {"total": total, "items": [equipment_to_dto(session, row) for row in rows], "next": next_cursor}
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
        with self.db.session(transaction="write") as session:
            validate_unique_name(session, Equipment, values["name"])
            moment = now()
            entity = Equipment(**values, id=str(uuid4()), created_at_utc=moment, updated_at_utc=moment)
            session.add(entity)
            session.flush()
            return equipment_to_dto(session, entity, include_usage=True)

    def update_equipment(self, equipment_id, body):
        with self.db.session(transaction="write") as session:
            entity = load_equipment(session, equipment_id)
            values = equipment_fields(body, creating=False, kind=entity.equipment_type)
            expected = version(body["expected_version"])
            if entity.row_version != expected:
                raise StorageError("EQUIPMENT_VERSION_CONFLICT")
            if "name" in values:
                validate_unique_name(session, Equipment, values["name"], previous_name=entity.name)
            change_version(session, Equipment, entity, expected,
                           "EQUIPMENT_VERSION_CONFLICT", **values)
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
                    session.scalar(select(CalibrationMaster.id).where(CalibrationMaster.camera_id == equipment_id).limit(1)) or
                    asset_metadata_references(session, equipment_id, "camera_id", "equipment_ids")):
                raise StorageError("EQUIPMENT_REFERENCED")
            session.delete(entity)
