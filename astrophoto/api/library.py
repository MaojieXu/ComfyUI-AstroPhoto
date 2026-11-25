"""Native library routes for browser clients and local MCP."""

import secrets
from uuid import uuid4

from ..assets.library_rules import identifier
from ..core.config import load_storage_settings
from ..core.errors import StorageError
from ..database.library_models import LibraryRecord
from .security import direct_local_request
from .storage import fields

def authorize_library(request, runtime):
    if not direct_local_request(request, runtime):
        return False
    if is_agent(request):
        return not request.headers.get("Origin") and not request.headers.get("Sec-Fetch-Site")
    return request.headers.get("Sec-Fetch-Site") == "same-origin" and request.headers.get("X-AstroPhoto-Local") == "1"


def is_agent(request):
    return request.headers.get("X-AstroPhoto-Agent") == "1"


def list_assets(service, _runtime, request, _body):
    return service.library.list("assets", request.query)


def list_import_groups(service, _runtime, request, _body):
    return service.library.list("import-groups", request.query)


def asset_detail(service, _runtime, request, _body):
    return service.library.get("assets", request.match_info["id"])


def write_asset(service, _runtime, request, body):
    return service.library.write("assets", body, request.match_info.get("id"))


def unregister_asset(service, _runtime, request, body):
    return service.library.remove("assets", request.match_info["id"], body)


def direct_catalog_import(service, _runtime, request, body):
    """A trusted local agent may initiate a typed import directly."""
    if not is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body, ("sources", "catalog"))
    if not isinstance(body["catalog"], dict) or body["catalog"].keys() & {"master_ids"}:
        raise StorageError("INVALID_REQUEST")
    payload = {**body, "allow_duplicate": True,
               "settings_revision": load_storage_settings(service.root)["revision"]}
    preview = service.imports.preview(payload)
    operation_id = service.imports.import_assets({
        **payload, "preview_id": preview["preview_id"], "idempotency_key": str(uuid4()),
    })
    return catalog_task(service, {"operation_id": operation_id})


def catalog_task(service, result):
    with service.db.session(transaction="write") as session:
        for _ in range(32):
            task = "IMP-" + secrets.token_hex(4).upper()
            if session.get(LibraryRecord, task) is None:
                session.add(LibraryRecord(id=task, kind="catalog_task", data={"operation_id": result["operation_id"]}))
                break
        else:
            raise StorageError("STORAGE_BUSY")
    return {**result, "task": task}


def catalog_import_status(service, _runtime, request, _body):
    if not is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    task = request.match_info["id"]
    if task.startswith("IMP-"):
        with service.db.session() as session:
            alias = session.get(LibraryRecord, task)
            if alias is None or alias.kind != "catalog_task":
                raise StorageError("OPERATION_NOT_FOUND")
            ident = alias.data["operation_id"]
    else:
        ident = identifier(task)
    row = service.operations.get(ident, "import")
    if not row.plan.get("catalog") or not (row.request.get("catalog") or row.request.get("append_collection_id")):
        raise StorageError("OPERATION_NOT_FOUND")
    return service.operations.status(ident, "import")


def delete_file(service, _runtime, request, body):
    fields(body)
    return service.library.delete_file(identifier(request.match_info["id"]))


def retry_import(service, _runtime, request, body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body)
    return {"operation_id": service.imports.retry_remaining(identifier(request.match_info["id"]))}


def library_routes():
    return [
        ("POST", "/library/catalog-import", direct_catalog_import, 202),
        ("GET", "/library/catalog-import/{id}", catalog_import_status, 200),
        ("POST", "/library/imports/{id}/retry-remaining", retry_import, 202),
        ("POST", "/library/assets/{id}/delete-file", delete_file, 200),
        ("GET", "/library/assets", list_assets, 200),
        ("GET", "/library/assets/{id}", asset_detail, 200),
        ("GET", "/library/import-groups", list_import_groups, 200),
        ("POST", "/library/assets", write_asset, 201),
        ("PATCH", "/library/assets/{id}", write_asset, 200),
        ("DELETE", "/library/assets/{id}", unregister_asset, 200),
    ]
