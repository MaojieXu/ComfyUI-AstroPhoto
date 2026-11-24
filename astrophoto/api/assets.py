"""Asset list, import and external reference relocation routes."""

from ..core.errors import StorageError
from .storage import fields, operation_handler, uuid_value

IMPORT_OPTIONS = ("sources", "uploads", "import_mode_override", "workspace_id", "session_id",
                  "settings_revision", "attributes", "allow_duplicate", "catalog")


def list_assets(service, _runtime, request, _body):
    after = request.query.get("after", "")
    if after:
        uuid_value(after)
    return service.assets.list(after)


def import_assets(service, _runtime, _request, body):
    fields(body, ("idempotency_key",), (*IMPORT_OPTIONS, "preview_id"))
    if "workspace_id" in body:
        uuid_value(body["workspace_id"])
    return {"operation_id": service.imports.import_assets(body)}


def preview(service, _runtime, _request, body):
    fields(body, (), IMPORT_OPTIONS)
    if "workspace_id" in body:
        uuid_value(body["workspace_id"])
    return service.imports.preview(body)


def relocate_asset(service, _runtime, request, body):
    return service.assets.relocate(uuid_value(request.match_info["id"]), fields(body, ("new_path",))["new_path"])


def inspect_asset(service, _runtime, request, _body):
    asset_id = uuid_value(request.match_info["id"])
    try:
        service.assets.resolve_asset(asset_id)
        return {"asset_id": asset_id, "available": True, "reason": None}
    except StorageError as exc:
        if exc.code == "ASSET_NOT_FOUND":
            raise
        return {"asset_id": asset_id, "available": False, "reason": exc.code}


def set_asset_session(service, _runtime, request, body):
    fields(body, ("session_id", "attached"))
    if type(body["attached"]) is not bool:
        raise StorageError("INVALID_REQUEST")
    return service.assets.set_session(uuid_value(request.match_info["id"]), body["session_id"], body["attached"])


def asset_routes():
    return [
        ("GET", "/assets", list_assets, 200),
        ("POST", "/assets/import", import_assets, 202),
        ("POST", "/assets/import/preview", preview, 200),
        ("GET", "/assets/imports/{id}", operation_handler("import"), 200),
        ("POST", "/assets/imports/{id}/cancel", operation_handler("import", "cancel"), 200),
        ("POST", "/assets/imports/{id}/retry", operation_handler("import", "retry"), 202),
        ("POST", "/assets/{id}/relocate", relocate_asset, 200),
        ("PATCH", "/assets/{id}/sessions", set_asset_session, 200),
        ("GET", "/assets/{id}/availability", inspect_asset, 200),
    ]

