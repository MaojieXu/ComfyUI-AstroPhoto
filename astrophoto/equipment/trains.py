"""Single editable optical-train configurations with read-only legacy revisions."""

from uuid import uuid4

from sqlalchemy import func, or_, select, true

from ..core.errors import StorageError
from ..database.equipment_models import Equipment, OpticalTrain, OpticalTrainDefault, OpticalTrainDraft, OpticalTrainRevision
from .schemas import object_fields, parse_train_draft, text_value, version
from .service import archive_filter, change_version, equipment_to_dto, now, row_dict, validate_unique_name
from .snapshots import validate_train_components, validate_train_snapshot

NOT_DELETED = OpticalTrain.deleted_at_utc.is_(None)


def load_train(session, train_id):
    train = session.get(OpticalTrain, train_id)
    if train is None:
        raise StorageError("TRAIN_NOT_FOUND")
    return train


def load_revision(session, train_id, revision_id):
    revision = session.get(OpticalTrainRevision, revision_id)
    if revision is None or revision.train_id != train_id:
        raise StorageError("REVISION_NOT_FOUND")
    return revision


def revision_dto(revision, *, snapshot=False):
    if revision is None:
        return None
    result = row_dict(revision, ("idempotency_key", "published_draft_version", "snapshot_json"))
    if snapshot:
        data = revision.snapshot_json
        result.update(snapshot=data, draft_template=validate_train_snapshot(data, revision.train_id, revision.id))
    return result


def draft_dto(draft):
    return None if draft is None else {
        "draft": draft.draft_json, "draft_version": draft.draft_version, "updated_at_utc": draft.updated_at_utc,
    }


def selected_revisions(session, train):
    revision_select = select(OpticalTrainRevision).filter_by(train_id=train.id)
    latest = session.scalar(revision_select.order_by(OpticalTrainRevision.revision_number.desc()).limit(1))
    pointer = session.get(OpticalTrainDefault, train.id)
    default = session.get(OpticalTrainRevision, pointer.revision_id) if pointer else None
    return latest, default


def train_to_dto(session, train, *, detail=False):
    latest, default = selected_revisions(session, train)
    draft = session.get(OpticalTrainDraft, train.id)
    selected = default or latest
    configuration = draft_dto(draft)
    if configuration is None and selected is not None:
        data = validate_train_snapshot(selected.snapshot_json, train.id, selected.id)
        data.update(base_revision_id=None, change_summary=selected.change_summary, name=train.name, notes=train.notes)
        configuration = {"draft": data, "draft_version": None, "updated_at_utc": selected.published_at_utc}
    data = configuration["draft"] if configuration else None
    devices = []
    if data:
        devices = list(session.scalars(select(Equipment).where(Equipment.id.in_(
            [data["camera_id"], data["primary_optics_id"], *data["accessory_ids"], *data["filter_ids"]]
        ))))
        names = {device.id: device.name for device in devices}
        summary = {"camera": names.get(data["camera_id"]), "primary_optics": names.get(data["primary_optics_id"]),
                   "accessories": [names[key] for key in data["accessory_ids"] if key in names],
                   "filters": [names[key] for key in data["filter_ids"] if key in names]}
    else:
        summary = {"camera": None, "primary_optics": None, "accessories": [], "filters": []}
    complete = data and data["camera_id"] and data["primary_optics_id"]
    status = "published" if complete else "draft"
    if train.deleted_at_utc:
        status = "deleted"
    elif train.archived_at_utc:
        status = "archived"
    result = dict(row_dict(train), status=status,
                  latest_revision=revision_dto(latest), default_revision=revision_dto(default),
                  has_draft=draft is not None, summary=summary)
    if detail:
        result["draft"] = draft_dto(draft)
        result["configuration"] = configuration
        result["components"] = [equipment_to_dto(session, device) for device in devices]
    return result


class OpticalTrainService:
    def __init__(self, db):
        self.db = db

    def delete_train(self, train_id, expected_version):
        with self.db.session(transaction="write") as session:
            train = load_train(session, train_id)
            if train.deleted_at_utc:
                # Replays are idempotent; a stale version still reports a conflict.
                if version(expected_version) != train.row_version - 1:
                    raise StorageError("REVISION_CONFLICT")
                return
            change_version(session, OpticalTrain, train, version(expected_version), "REVISION_CONFLICT",
                           deleted_at_utc=now())

    def list_trains(self, *, q="", archived="false", after=None, limit=50, status=None):
        with self.db.session(transaction="read") as session:
            current = select(OpticalTrainDraft.train_id).where(OpticalTrainDraft.train_id == OpticalTrain.id)
            legacy = (select(OpticalTrainRevision.id).where(OpticalTrainRevision.train_id == OpticalTrain.id)
                      .order_by(OpticalTrainRevision.revision_number.desc()).limit(1).correlate(OpticalTrain).scalar_subquery())
            default = (select(OpticalTrainDefault.revision_id).where(OpticalTrainDefault.train_id == OpticalTrain.id)
                       .correlate(OpticalTrain).scalar_subquery())
            selected = func.coalesce(default, legacy)
            complete = current.where(func.json_extract(OpticalTrainDraft.draft_json, "$.camera_id").is_not(None),
                                     func.json_extract(OpticalTrainDraft.draft_json, "$.primary_optics_id").is_not(None))
            published = or_(complete.exists(), ~current.exists() & selected.is_not(None))
            clauses = [NOT_DELETED, archive_filter(OpticalTrain, "true" if status == "archived" else archived)]
            if status in ("draft", "published"):
                clauses.extend([OpticalTrain.archived_at_utc.is_(None), published if status == "published" else ~published])
            if q:
                session.connection().connection.driver_connection.create_function("ap_casefold", 1, str.casefold)
                def match(column):
                    return func.ap_casefold(func.coalesce(column, "")).contains(q.casefold(), autoescape=True)

                history = func.json_tree(OpticalTrainRevision.snapshot_json).table_valued("key", "value", joins_implicitly=True)
                frozen = (select(1).select_from(OpticalTrainRevision)
                          .join_from(OpticalTrainRevision, history, true())
                          .join_from(history, Equipment, Equipment.id == history.c.value).where(
                    OpticalTrainRevision.id == selected, history.c.key == "equipment_id",
                    match(Equipment.name),
                ).exists())
                draft_data = OpticalTrainDraft.draft_json
                matches_device = []
                for role in ("camera_id", "primary_optics_id", "accessory_ids", "filter_ids"):
                    path = f"$.{role}"
                    if role.endswith("_ids"):
                        entries = func.json_each(draft_data, path).table_valued("value", joins_implicitly=True)
                        matches_device.append(Equipment.id.in_(select(entries.c.value)))
                    else:
                        matches_device.append(Equipment.id == func.json_extract(draft_data, path))
                draft = select(1).select_from(OpticalTrainDraft).join(Equipment, or_(*matches_device)).where(
                    OpticalTrainDraft.train_id == OpticalTrain.id, match(Equipment.name),
                ).exists()
                clauses.append(or_(match(OpticalTrain.name), ~current.exists() & frozen, draft))
            total = session.scalar(select(func.count()).select_from(OpticalTrain).where(*clauses))
            if after:
                clauses.append(OpticalTrain.id > after)
            rows = list(session.scalars(select(OpticalTrain).where(*clauses).order_by(OpticalTrain.id).limit(limit + 1)))
            return {"total": total, "items": [train_to_dto(session, row) for row in rows[:limit]],
                    "next": rows[limit - 1].id if len(rows) > limit else None}

    def create_train(self, body):
        object_fields(body, ("name", "notes", "draft"), ("name",))
        name = text_value(body["name"], "name", required=True)
        notes = text_value(body.get("notes"), "notes", 4000)
        data = parse_train_draft(body["draft"]) if "draft" in body else None
        if data is not None:
            name = data["name"]
        with self.db.session(transaction="write") as session:
            validate_unique_name(session, OpticalTrain, name, scope=(NOT_DELETED,))
            moment = now()
            train = OpticalTrain(id=str(uuid4()), name=name, notes=notes, created_at_utc=moment, updated_at_utc=moment)
            session.add(train)
            session.flush()
            if data is not None:
                self._write_draft(session, train, data, None)
            return train_to_dto(session, train, detail=True)

    def get_train(self, train_id):
        with self.db.session(transaction="read") as session:
            return train_to_dto(session, load_train(session, train_id), detail=True)

    def get_draft(self, train_id):
        with self.db.session(transaction="read") as session:
            load_train(session, train_id)
            return draft_dto(session.get(OpticalTrainDraft, train_id))

    @staticmethod
    def _write_draft(session, train, data, expected):
        if train.deleted_at_utc:
            raise StorageError("TRAIN_NOT_FOUND")
        if train.archived_at_utc:
            raise StorageError("TRAIN_ARCHIVED")
        current = session.get(OpticalTrainDraft, train.id)
        if expected != (current.draft_version if current else None):
            raise StorageError("DRAFT_VERSION_CONFLICT")
        data["base_revision_id"] = None
        if current is not None:
            previous = current.draft_json
        else:
            latest, default = selected_revisions(session, train)
            selected = default or latest
            previous = validate_train_snapshot(selected.snapshot_json, train.id, selected.id) if selected else None
        validate_train_components(session, data, previous)
        validate_unique_name(session, OpticalTrain, data["name"], previous_name=train.name, scope=(NOT_DELETED,))
        change_version(session, OpticalTrain, train, train.row_version, "DRAFT_VERSION_CONFLICT",
                       name=data["name"], notes=data["notes"])
        if current is None:
            current = OpticalTrainDraft(train_id=train.id)
            session.add(current)
        current.base_revision_id = data["base_revision_id"]
        current.draft_json = data
        current.draft_version = train.row_version
        current.updated_at_utc = now()
        session.flush()
        return draft_dto(current)

    def save_draft(self, train_id, body):
        object_fields(body, ("draft", "expected_draft_version"), ("draft", "expected_draft_version"))
        data = parse_train_draft(body["draft"])
        expected = version(body["expected_draft_version"], "expected_draft_version", optional=True)
        with self.db.session(transaction="write") as session:
            return self._write_draft(session, load_train(session, train_id), data, expected)

    def list_revisions(self, train_id):
        with self.db.session(transaction="read") as session:
            load_train(session, train_id)
            rows = session.scalars(select(OpticalTrainRevision).filter_by(train_id=train_id)
                                   .order_by(OpticalTrainRevision.revision_number.desc()))
            return {"items": [revision_dto(row) for row in rows]}

    def get_revision(self, train_id, revision_id):
        with self.db.session(transaction="read") as session:
            return revision_dto(load_revision(session, train_id, revision_id), snapshot=True)

    def set_archived(self, train_id, expected_version, archived):
        with self.db.session(transaction="write") as session:
            train = load_train(session, train_id)
            if train.deleted_at_utc:
                raise StorageError("TRAIN_NOT_FOUND")
            change_version(session, OpticalTrain, train, version(expected_version), "REVISION_CONFLICT",
                           archived_at_utc=(train.archived_at_utc or now()) if archived else None)
            return train_to_dto(session, train, detail=True)
