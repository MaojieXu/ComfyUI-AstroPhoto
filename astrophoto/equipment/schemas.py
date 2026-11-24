"""Validate the Equipment and Optical Train JSON contracts before opening transactions."""

from uuid import UUID

from ..core.errors import StorageError

KINDS = ("camera", "primary_optics", "optical_accessory", "filter", "other")

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


def equipment_fields(body, *, creating, kind=None):
    common = ("name", "product_name", "notes")
    required = ("equipment_type", "name", "product_name") if creating else ("expected_version",)
    object_fields(body, (*common, *required), required)
    kind = body["equipment_type"] if creating else kind
    if kind not in KINDS:
        invalid("equipment_type")
    result = {
        key: text_value(body[key], key, 4000 if key == "notes" else 120, key != "notes")
        for key in common if key in body
    }
    if creating:
        result["equipment_type"] = kind
    if not creating and not result:
        invalid("body")
    return result


def parse_train_draft(body):
    required = ("name",)
    scalar = ("camera_id", "primary_optics_id", "accessory_id")
    lists = ("filter_ids", "other_ids")
    object_fields(body, (*required, *scalar, *lists, "notes"), required)
    result = {"name": text_value(body["name"], "name", required=True),
              "notes": text_value(body.get("notes"), "notes", 4000)}
    for field in scalar:
        result[field] = id_value(body.get(field), field, optional=True)
    for field in lists:
        values = body.get(field, [])
        if not isinstance(values, list) or len(values) > 50:
            invalid(field)
        ids = [id_value(value, field) for value in values]
        if len(set(ids)) != len(ids):
            invalid(field, "duplicate")
        result[field] = ids
    return result


def list_options(query, *, trains=False):
    allowed = ("q", "archived", "after", "limit", "sort", "status" if trains else "type")
    if set(query) - set(allowed) or any(len(query.getall(key)) != 1 for key in set(query)):
        raise StorageError("INVALID_REQUEST")
    archived = query.get("archived", "false")
    if archived not in ("true", "false", "all"):
        invalid("archived")
    value = query.get("limit", "50")
    if not value.isascii() or not value.isdecimal() or len(value) > 3 or not 1 <= int(value) <= 100:
        invalid("limit")
    sort = query.get("sort")
    if sort is not None and sort not in ("name_asc", "name_desc", "created_desc", "updated_desc"):
        invalid("sort")
    after = query.get("after")
    if sort is None:
        after = id_value(after, "after", optional=True)
    elif after is not None and (not after or len(after) > 4096):
        invalid("after")
    result = {"q": text_value(query.get("q"), "q") or "", "archived": archived,
              "after": after, "limit": int(value)}
    if sort is not None:
        result["sort"] = sort
    key = "status" if trains else "type"
    choice = query.get(key)
    choices = ("draft", "published", "archived") if trains else KINDS
    if choice is not None and choice not in choices:
        invalid(key)
    result["kind" if not trains else key] = choice
    return result
