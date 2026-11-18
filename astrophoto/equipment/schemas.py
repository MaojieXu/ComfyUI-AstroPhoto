"""Validate the Equipment and Optical Train JSON contracts before opening transactions."""

from math import isfinite
from uuid import UUID

from ..core.errors import StorageError

KINDS = ("camera", "primary_optics", "optical_accessory", "filter")
ENUMS = {
    "sensor_kind": ("mono", "osc", "color", "other", "unknown"),
    "optics_kind": ("telescope", "lens"),
    "accessory_kind": ("reducer", "flattener", "barlow"),
    "filter_kind": ("l", "r", "g", "b", "ha", "oiii", "sii", "broadband", "uv_ir_cut", "solar",
                    "dual_band", "multi_band", "other"),
}
SPEC_FIELDS = {
    "camera": ("sensor_name", "sensor_kind", "sensor_width_px", "sensor_height_px", "pixel_size_x_um",
               "pixel_size_y_um", "bayer_pattern", "adc_bit_depth", "cooling_supported", "max_bin_x", "max_bin_y",
               "readout_modes"),
    "primary_optics": ("optics_kind", "optical_design", "aperture_mm", "native_focal_length_mm",
                       "native_f_ratio", "image_circle_mm", "optical_notes"),
    "optical_accessory": ("accessory_kind", "nominal_factor", "design_backfocus_mm", "clear_aperture_mm", "optical_notes"),
    "filter": ("filter_kind", "physical_size_mm", "filter_format", "passbands"),
}
INTEGER_MAX = {"sensor_width_px": 1000000, "sensor_height_px": 1000000, "adc_bit_depth": 64,
               "max_bin_x": 1024, "max_bin_y": 1024}
NUMBERS = frozenset(("pixel_size_x_um", "pixel_size_y_um", "aperture_mm", "native_focal_length_mm", "native_f_ratio",
                     "image_circle_mm", "nominal_factor", "design_backfocus_mm", "clear_aperture_mm",
                     "physical_size_mm", "center_nm", "fwhm_nm"))


def invalid(field, reason="invalid_value", code="EQUIPMENT_VALIDATION_FAILED"):
    raise StorageError(code, details={"fields": {field: reason}})


def object_fields(value, allowed, required=(), prefix=""):
    if not isinstance(value, dict):
        invalid(prefix.rstrip(".") or "body")
    for key in value.keys() - set(allowed):
        invalid(prefix + key, "unknown_field")
    for key in set(required) - value.keys():
        invalid(prefix + key, "required")
    return value


def text_value(value, field, limit=120, required=False):
    if value is None and not required:
        return None
    if not isinstance(value, str) or len(value) > limit or "\0" in value:
        invalid(field)
    try:
        value.encode("utf-8")
    except UnicodeError:
        invalid(field)
    if not value.strip() and required:
        invalid(field, "required")
    return value.strip() or None


def id_value(value, field="id", optional=False):
    if value is None and optional:
        return None
    if isinstance(value, str) and len(value) == 36:
        try:
            if str(UUID(value)) == value:
                return value
        except ValueError:
            pass
    invalid(field)


def version(value, key="expected_version", optional=False):
    if value is None and optional:
        return None
    if type(value) is not int or not 1 <= value <= 2**53 - 1:
        invalid(key)
    return value


def numeric(value, field, low=None, high=1000000, *, integer=False):
    if value is None:
        return None
    types = (int,) if integer else (int, float)
    if (type(value) not in types or abs(value) > max(high, abs(low or 0)) or not isfinite(value)
            or (value <= 0 if low is None else value < low) or value > high):
        invalid(field)
    return value


def validate_passbands(value):
    if not isinstance(value, list) or len(value) > 32:
        invalid("specs.passbands")
    labels, ids, result = set(), set(), []
    for index, entry in enumerate(value):
        field = f"specs.passbands.{index}."
        object_fields(entry, ("id", "band_label", "center_nm", "fwhm_nm"), ("band_label",), field)
        label = text_value(entry["band_label"], field + "band_label", required=True)
        band_id = id_value(entry.get("id"), field + "id", optional=True)
        if label.casefold() in labels or (band_id is not None and band_id in ids):
            invalid(field + "band_label", "duplicate")
        labels.add(label.casefold())
        ids.add(band_id)
        result.append({"id": band_id, "band_label": label, **{
            key: numeric(entry.get(key), field + key) for key in ("center_nm", "fwhm_nm")
        }})
    return result


def readout_modes(value):
    if not isinstance(value, list) or len(value) > 32:
        invalid("specs.readout_modes")
    keys, result = set(), []
    for index, entry in enumerate(value):
        prefix = f"specs.readout_modes.{index}."
        bounds = ("gain_min", "gain_max", "offset_min", "offset_max")
        object_fields(entry, ("mode_key", "display_name", *bounds), ("mode_key", "display_name"), prefix)
        key = text_value(entry["mode_key"], prefix + "mode_key", required=True)
        if key.casefold() in keys:
            invalid(prefix + "mode_key", "duplicate")
        keys.add(key.casefold())
        row = {name: numeric(entry.get(name), prefix + name, low=-1000000) for name in bounds}
        for kind in ("gain", "offset"):
            low, high = row[kind + "_min"], row[kind + "_max"]
            if low is not None and high is not None and low > high:
                invalid(prefix + kind + "_max")
        result.append(dict(row, mode_key=key, display_name=text_value(entry["display_name"], prefix + "display_name",
                                                                    required=True)))
    return result


def validate_specs(kind, specs):
    object_fields(specs, SPEC_FIELDS[kind], prefix="specs.")
    result = {}
    for key, value in specs.items():
        field = "specs." + key
        if key == "passbands":
            value = validate_passbands(value)
        elif key == "readout_modes":
            value = readout_modes(value)
        elif key in ENUMS:
            if value is not None and value not in ENUMS[key]:
                invalid(field)
        elif key in INTEGER_MAX:
            value = numeric(value, field, high=INTEGER_MAX[key], integer=True)
        elif key in NUMBERS:
            value = numeric(value, field, low=0 if key == "design_backfocus_mm" else None)
        elif key == "cooling_supported":
            if value is not None and type(value) is not bool:
                invalid(field)
        else:
            value = text_value(value, field, 4000 if key.endswith("notes") else 120)
        result[key] = value
    return result


def equipment_fields(body, *, creating, kind=None):
    common = ("name", "manufacturer", "model", "notes", "specs")
    required = ("equipment_type", "name") if creating else ("expected_version",)
    object_fields(body, (*common, *required), required)
    kind = body["equipment_type"] if creating else kind
    if kind not in KINDS:
        invalid("equipment_type")
    result = {key: text_value(body[key], key, 4000 if key == "notes" else 120, key == "name")
              for key in common[:-1] if key in body}
    if creating:
        result["equipment_type"] = kind
    if "specs" in body:
        result["specs"] = validate_specs(kind, body["specs"])
    if not creating and not result:
        invalid("body")
    return result


def parse_train_draft(body):
    required = ("name",)
    scalar = ("camera_id", "primary_optics_id")
    lists = ("accessory_ids", "filter_ids")
    object_fields(body, (*required, *scalar, *lists, "notes", "optical_state", "base_revision_id", "change_summary"), required)
    result = {"name": text_value(body["name"], "name", required=True),
              "notes": text_value(body.get("notes"), "notes", 4000),
              "change_summary": text_value(body.get("change_summary"), "change_summary", 4000)}
    for field in (*scalar, "base_revision_id"):
        result[field] = id_value(body.get(field), field, optional=True)
    for field in lists:
        values = body.get(field, [])
        if not isinstance(values, list) or len(values) > 50:
            invalid(field)
        ids = [id_value(value, field) for value in values]
        if len(set(ids)) != len(ids):
            invalid(field, "duplicate")
        result[field] = ids
    state = object_fields(body.get("optical_state", {}), ("rotation_deg", "flat_validity_note", "configuration_note"))
    result["optical_state"] = {
        "rotation_deg": numeric(state.get("rotation_deg"), "optical_state.rotation_deg", low=-360, high=360),
        **{key: text_value(state.get(key), f"optical_state.{key}", 4000)
           for key in ("flat_validity_note", "configuration_note")},
    }
    return result


def list_options(query, *, trains=False):
    allowed = ("q", "archived", "after", "limit", "status" if trains else "type")
    if set(query) - set(allowed) or any(len(query.getall(key)) != 1 for key in set(query)):
        raise StorageError("INVALID_REQUEST")
    archived = query.get("archived", "false")
    if archived not in ("true", "false", "all"):
        invalid("archived")
    value = query.get("limit", "50")
    if not value.isascii() or not value.isdecimal() or len(value) > 3 or not 1 <= int(value) <= 100:
        invalid("limit")
    result = {"q": text_value(query.get("q"), "q") or "", "archived": archived,
              "after": id_value(query.get("after"), "after", optional=True), "limit": int(value)}
    key = "status" if trains else "type"
    choice = query.get(key)
    choices = ("draft", "published", "archived") if trains else KINDS
    if choice is not None and choice not in choices:
        invalid(key)
    result["kind" if not trains else key] = choice
    return result
