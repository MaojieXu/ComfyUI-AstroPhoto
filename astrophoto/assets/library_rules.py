"""Validate metadata and compare user-provided processing conditions."""

import math
from datetime import datetime
from uuid import UUID

from ..core.errors import StorageError

ENUMS = {
    "file_kind": {"image", "video", "other", "unknown"},
    "usage": {"light", "dark", "flat", "bias", "dark_flat", "other", "unknown"},
    "role": {"raw", "calibration_master", "master_frame", "processed"},
    "calibration_method": {"bias", "dark_flat"},
    "calibration_state": {"uncalibrated", "calibrated", "unknown", "not_applicable"},
    "stage": {"raw", "preprocessed", "registered", "stacked", "mosaiced", "postprocessed", "finished", "unknown"},
}
ID_FIELDS = {"camera_id", "optical_train_id", "source_asset_id", "source_collection_id", "calibration_source_asset_id"}
NUMBERS = {"exposure", "gain", "offset", "temperature", "fwhm", "snr", "order"}
TEXT = {"target", "target_type", "captured_at", "notes", "filter", "band", "binning", "panel", "channel",
        "region", "batch", "workflow", "node"}
CONDITIONS = ("usage", "camera_id", "optical_train_id", "filter", "band", "exposure", "gain", "offset", "binning")
FIELDS = {
    "projects": {"name", "target", "notes", "template"},
    "collections": {"name", "asset_ids", "calibration_folder_id", "confirmed"},
    "folders": {"name", "project_id", "parent_id"},
    "sessions": {"name", "asset_ids", "notes"},
    "masters": {"asset_id", "folder_id", "method", "source_asset_id"},
    "assignments": {"asset_id", "collection_id", "master_id", "confirmed"},
    "placements": {"project_id", "folder_id", "asset_id", "collection_id", "position"},
}
METADATA = set(ENUMS) | ID_FIELDS | NUMBERS | TEXT | {"equipment_ids"}


def identifier(value):
    try:
        if not isinstance(value, str) or str(UUID(value)) != value:
            raise ValueError()
    except ValueError as exc:
        raise StorageError("INVALID_REQUEST") from exc
    return value


def label(value, limit=120):
    if not isinstance(value, str) or not 1 <= len(value.strip()) <= limit:
        raise StorageError("INVALID_REQUEST")
    return value.strip()


def identifiers(value):
    if not isinstance(value, list) or len(value) > 1000:
        raise StorageError("INVALID_REQUEST")
    checked = [identifier(item) for item in value]
    if len(set(checked)) != len(checked):
        raise StorageError("INVALID_REQUEST")
    return checked


def properties(value):
    if not isinstance(value, dict) or value.keys() - METADATA:
        raise StorageError("INVALID_REQUEST")
    result = {}
    for key, item in value.items():
        if item is None:
            result[key] = None
        elif key in ENUMS:
            if not isinstance(item, str) or item not in ENUMS[key]:
                raise StorageError("INVALID_REQUEST")
            result[key] = item
        elif key in ID_FIELDS:
            result[key] = identifier(item)
        elif key in NUMBERS:
            if type(item) not in (int, float) or not math.isfinite(item):
                raise StorageError("INVALID_REQUEST")
            if key in {"exposure", "fwhm", "snr"} and item < 0:
                raise StorageError("INVALID_REQUEST")
            result[key] = item
        elif key == "equipment_ids":
            result[key] = identifiers(item)
        else:
            result[key] = label(item, 4000 if key == "notes" else 256)
            if key == "captured_at":
                try:
                    datetime.fromisoformat(result[key])
                except ValueError as exc:
                    raise StorageError("INVALID_REQUEST") from exc
    return result


def differences(rows, keys):
    conflicts, unknown = [], []
    for key in keys:
        values = [row.get(key) for row in rows]
        known = {value for value in values if value not in (None, "unknown")}
        if len(known) > 1:
            conflicts.append(key)
        if any(value in (None, "unknown") for value in values):
            unknown.append(key)
    return {"conflicts": conflicts, "unknown": unknown}
