"""Transactional equipment combinations."""

from uuid import uuid4

from sqlalchemy import func, or_, select

from ..core.errors import StorageError
from ..database.equipment_models import Equipment, OpticalTrain
from .schemas import object_fields, parse_train_draft, version
from .service import archive_filter, change_version, equipment_to_dto, now, row_dict, validate_unique_name
from .snapshots import validate_train_components

NOT_DELETED = OpticalTrain.deleted_at_utc.is_(None)
FIELDS = ("name", "notes", "camera_id", "primary_optics_id", "accessory_id", "filter_ids", "other_ids")


def load_train(session, train_id):
    train = session.get(OpticalTrain, train_id)
    if train is None:
        raise StorageError("TRAIN_NOT_FOUND")
    return train


def train_to_dto(session, train, *, detail=False):
    ids = [train.camera_id, train.primary_optics_id, train.accessory_id, *train.filter_ids, *train.other_ids]
    devices = list(session.scalars(select(Equipment).where(Equipment.id.in_(ids))))
    names = {device.id: device.name for device in devices}
    summary = {
        "camera": names.get(train.camera_id),
        "primary_optics": names.get(train.primary_optics_id),
        "accessories": [names[train.accessory_id]] if train.accessory_id in names else [],
        "filters": [names[key] for key in train.filter_ids if key in names],
        "others": [names[key] for key in train.other_ids if key in names],
    }
    status = "published" if train.camera_id and train.primary_optics_id else "draft"
    if train.deleted_at_utc:
        status = "deleted"
    elif train.archived_at_utc:
        status = "archived"
    result = dict(row_dict(train), status=status, summary=summary)
    if detail:
        result["components"] = [equipment_to_dto(session, device) for device in devices]
    return result


class OpticalTrainService:
    def __init__(self, db):
        self.db = db

    def list_trains(self, *, q="", archived="false", after=None, limit=50, status=None, sort=None):
        with self.db.session(transaction="read") as session:
            conditions = [NOT_DELETED, archive_filter(OpticalTrain, "true" if status == "archived" else archived)]
            complete = (OpticalTrain.camera_id.is_not(None)) & (OpticalTrain.primary_optics_id.is_not(None))
            if status in ("draft", "published"):
                conditions.extend([OpticalTrain.archived_at_utc.is_(None), complete if status == "published" else ~complete])
            if q:
                session.connection().connection.driver_connection.create_function("ap_casefold", 1, str.casefold)
                def match(column):
                    return func.ap_casefold(func.coalesce(column, "")).contains(q.casefold(), autoescape=True)
                matches_device = []
                for role in ("camera_id", "primary_optics_id", "accessory_id"):
                    matches_device.append(Equipment.id == getattr(OpticalTrain, role))
                for role in ("filter_ids", "other_ids"):
                    entries = func.json_each(getattr(OpticalTrain, role)).table_valued("value", joins_implicitly=True)
                    matches_device.append(Equipment.id.in_(select(entries.c.value)))
                device_match = select(1).select_from(Equipment).where(or_(*matches_device), match(Equipment.name)).exists()
                conditions.append(or_(match(OpticalTrain.name), device_match))
            total = session.scalar(select(func.count()).select_from(OpticalTrain).where(*conditions))
            if sort:
                from .pagination import sorted_page
                rows, next_cursor = sorted_page(session, OpticalTrain, conditions, sort, after, limit,
                                                {"q": q, "archived": archived, "status": status})
                return {"total": total, "items": [train_to_dto(session, row) for row in rows], "next": next_cursor}
            if after:
                conditions.append(OpticalTrain.id > after)
            rows = list(session.scalars(select(OpticalTrain).where(*conditions).order_by(OpticalTrain.id).limit(limit + 1)))
            return {"total": total, "items": [train_to_dto(session, row) for row in rows[:limit]],
                    "next": rows[limit - 1].id if len(rows) > limit else None}

    def create_train(self, body):
        data = parse_train_draft(body)
        with self.db.session(transaction="write") as session:
            validate_unique_name(session, OpticalTrain, data["name"], scope=(NOT_DELETED,))
            validate_train_components(session, data)
            moment = now()
            train = OpticalTrain(**data, id=str(uuid4()), created_at_utc=moment, updated_at_utc=moment)
            session.add(train)
            session.flush()
            return train_to_dto(session, train, detail=True)

    def get_train(self, train_id):
        with self.db.session(transaction="read") as session:
            return train_to_dto(session, load_train(session, train_id), detail=True)

    def update_train(self, train_id, body):
        object_fields(body, (*FIELDS, "expected_version"), ("name", "expected_version"))
        expected = version(body["expected_version"])
        data = parse_train_draft({key: value for key, value in body.items() if key != "expected_version"})
        with self.db.session(transaction="write") as session:
            train = load_train(session, train_id)
            if train.deleted_at_utc:
                raise StorageError("TRAIN_NOT_FOUND")
            if train.archived_at_utc:
                raise StorageError("TRAIN_ARCHIVED")
            if train.row_version != expected:
                raise StorageError("DRAFT_VERSION_CONFLICT")
            previous = {key: getattr(train, key) for key in FIELDS}
            validate_train_components(session, data, previous)
            validate_unique_name(session, OpticalTrain, data["name"], previous_name=train.name, scope=(NOT_DELETED,))
            change_version(session, OpticalTrain, train, expected, "DRAFT_VERSION_CONFLICT", **data)
            return train_to_dto(session, train, detail=True)

    def delete_train(self, train_id, expected_version):
        with self.db.session(transaction="write") as session:
            train = load_train(session, train_id)
            if train.deleted_at_utc:
                if version(expected_version) != train.row_version - 1:
                    raise StorageError("REVISION_CONFLICT")
                return
            change_version(session, OpticalTrain, train, version(expected_version), "REVISION_CONFLICT", deleted_at_utc=now())

    def set_archived(self, train_id, expected_version, archived):
        with self.db.session(transaction="write") as session:
            train = load_train(session, train_id)
            if train.deleted_at_utc:
                raise StorageError("TRAIN_NOT_FOUND")
            change_version(session, OpticalTrain, train, version(expected_version), "REVISION_CONFLICT",
                           archived_at_utc=(train.archived_at_utc or now()) if archived else None)
            return train_to_dto(session, train, detail=True)
