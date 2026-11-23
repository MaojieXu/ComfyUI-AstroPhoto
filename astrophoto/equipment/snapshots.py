"""Validate train components and read legacy optical snapshots."""

from ..core.errors import StorageError
from .schemas import invalid, parse_train_draft
from .service import load_equipment

ROLES = {
    "camera_id": "camera", "primary_optics_id": "primary_optics",
    "accessory_ids": "optical_accessory", "filter_ids": "filter",
}


def component_ids(draft, field):
    value = draft[field]
    return value if field.endswith("_ids") else [value] if value else []


def validate_train_components(session, draft, previous=None):
    for field, kind in ROLES.items():
        retained = set(component_ids(previous, field)) if previous else set()
        for equipment_id in component_ids(draft, field):
            try:
                entity = load_equipment(session, equipment_id)
            except StorageError:
                invalid(field, "missing_equipment")
            if entity.equipment_type != kind:
                invalid(field, "type_mismatch", "EQUIPMENT_TYPE_MISMATCH")
            if entity.archived_at_utc and equipment_id not in retained:
                invalid(field, "archived_equipment")


def snapshot_draft(snapshot, revision_id):
    return {
        "name": snapshot["name_at_publish"], "notes": snapshot["notes"], "base_revision_id": revision_id,
        "change_summary": None,
        "camera_id": snapshot["camera"]["equipment_id"], "primary_optics_id": snapshot["primary_optics"]["equipment_id"],
        "accessory_ids": [part["equipment_id"] for part in snapshot["accessories"]],
        "filter_ids": [part["equipment_id"] for part in snapshot["filters"]], "optical_state": snapshot["optical_state"],
    }


def validate_train_snapshot(snapshot, train_id, revision_id):
    try:
        if (snapshot["snapshot_version"] != 1 or snapshot["train_id"] != train_id
                or snapshot["camera"]["equipment_type"] != "camera"
                or snapshot["primary_optics"]["equipment_type"] != "primary_optics"
                or any(part["position"] != index or part["equipment_type"] != "optical_accessory"
                       for index, part in enumerate(snapshot["accessories"]))
                or any(part["equipment_type"] != "filter" for part in snapshot["filters"])):
            raise ValueError("Invalid snapshot")
        return parse_train_draft(snapshot_draft(snapshot, revision_id))
    except (KeyError, TypeError, ValueError, StorageError) as exc:
        raise StorageError("DATABASE_INVALID") from exc
