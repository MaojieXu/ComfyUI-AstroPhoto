"""Validate train components and read legacy optical snapshots."""

from ..core.errors import StorageError
from .schemas import invalid
from .service import load_equipment

ROLES = {
    "camera_id": "camera", "primary_optics_id": "primary_optics",
    "accessory_id": "optical_accessory", "filter_ids": "filter", "other_ids": "other",
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
