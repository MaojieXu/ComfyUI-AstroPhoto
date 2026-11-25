"""Host-path import and external reference relocation routes."""

from .storage import fields, operation_handler, uuid_value

IMPORT_OPTIONS = ("sources", "import_mode_override", "workspace_id",
                  "settings_revision", "attributes", "allow_duplicate", "catalog")


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


def asset_routes():
    return [
        ("POST", "/assets/import", import_assets, 202),
        ("POST", "/assets/import/preview", preview, 200),
        ("GET", "/assets/imports/{id}", operation_handler("import"), 200),
        ("POST", "/assets/imports/{id}/cancel", operation_handler("import", "cancel"), 200),
        ("POST", "/assets/imports/{id}/retry", operation_handler("import", "retry"), 202),
        ("POST", "/assets/{id}/relocate", relocate_asset, 200),
    ]
