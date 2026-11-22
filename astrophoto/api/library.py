"""Native library routes. Agent proposals cannot act as user approval."""

import os
from hmac import compare_digest

from aiohttp import web
from sqlalchemy import select

from ..assets.library import page
from ..assets.library_rules import FIELDS, identifier
from ..assets.uploads import discard_upload, stage_upload
from ..core.config import load_storage_settings
from ..core.errors import StorageError
from ..database.models import StorageOperation
from ..storage.locations import TERMINAL
from .security import direct_local_request, valid_local_token
from .storage import fields

KINDS = {"assets", *FIELDS}


def authorize_library(request, runtime):
    if not direct_local_request(request, runtime):
        return False
    if is_agent(request):
        token = valid_local_token(os.environ.get("ASTROPHOTO_LIBRARY_TOKEN", ""))
        auth = request.headers["Authorization"]
        return bool(token and not request.headers.get("Origin") and not request.headers.get("Sec-Fetch-Site")
                    and compare_digest(auth.encode(), f"Bearer {token}".encode("ascii")))
    return request.headers.get("Sec-Fetch-Site") == "same-origin" and request.headers.get("X-AstroPhoto-Local") == "1"


def is_agent(request):
    return "Authorization" in request.headers


def kind_of(request):
    kind = request.match_info["kind"]
    if kind not in KINDS:
        raise StorageError("LIBRARY_RECORD_NOT_FOUND")
    return kind


def listing(service, _runtime, request, _body):
    return service.library.list(kind_of(request), request.query)


def detail(service, _runtime, request, _body):
    return service.library.get(kind_of(request), request.match_info["id"])


def required_approval(method, kind):
    return (kind in {"assets", "collections", "masters", "assignments"} or
            method == "DELETE" and kind in {"projects", "folders"} or
            method == "PATCH" and kind == "folders")


def mutate(service, _runtime, request, body):
    kind = kind_of(request)
    record_id = request.match_info.get("id")
    if record_id:
        identifier(record_id)
    if not isinstance(body, dict):
        raise StorageError("INVALID_REQUEST")
    if is_agent(request):
        if "confirmed" in body:
            raise StorageError("INVALID_REQUEST")
        if required_approval(request.method, kind):
            return propose(service, request.method, kind, record_id, body)
    return apply(service, request.method, kind, record_id, body)


def apply(service, method, kind, record_id, body):
    if kind == "import":
        checked = {**body, "allow_duplicate": True}
        checked.setdefault("settings_revision", load_storage_settings(service.root)["revision"])
        preview = service.imports.preview(checked)
        return {"operation_id": service.imports.import_assets({
            **checked, "preview_id": preview["preview_id"], "idempotency_key": record_id,
        })}
    if method == "DELETE":
        return service.library.remove(kind, record_id, body)
    return service.library.write(kind, body, record_id)


def propose(service, method, kind, record_id, body):
    with service.db.session(transaction="write") as session:
        if sum(item.data["status"] == "pending" for item in service.library._records(session, "approvals")) >= 100:
            raise StorageError("STORAGE_BUSY")
        row = service.library._save(session, "approvals", {
            "method": method, "kind": kind, "record_id": record_id, "payload": body, "status": "pending",
        })
        return web.json_response({"approval_id": row.id, "status": "pending"}, status=202,
                                 headers={"Cache-Control": "no-store"})


def request_import(service, _runtime, request, body):
    if not is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body, ("sources",), ("settings_revision", "attributes", "project_id"))
    body.setdefault("settings_revision", load_storage_settings(service.root)["revision"])
    return propose(service, "POST", "import", None, body)


def approvals(service, _runtime, request, _body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    with service.db.session() as session:
        rows = [service.library._data(row) for row in service.library._records(session, "approvals")
                if row.data["status"] == "pending"]
    return page(sorted(rows, key=lambda row: row["id"]), request.query)


def approval(service, _runtime, request, _body):
    with service.db.session() as session:
        row = service.library._record(session, "approvals", request.match_info["id"])
        status = row.data["status"]
        result = row.data.get("result", {})
        response = {"approval_id": row.id, "status": status}
        if result:
            response["result"] = result
        if operation := result.get("operation_id"):
            response["operation"] = service.operations.status(operation, "import")
        return response


def decide(service, _runtime, request, body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body, ("approved",))
    if type(body["approved"]) is not bool:
        raise StorageError("INVALID_REQUEST")
    approval_id = request.match_info["id"]
    with service.db.session(transaction="write") as session:
        row = service.library._record(session, "approvals", approval_id)
        if row.data["status"] != "pending":
            raise StorageError("REVISION_CONFLICT")
        original = row.data
        row.data = {**original, "status": "applying" if body["approved"] else "denied"}
        row.revision += 1
    if not body["approved"]:
        return {"approval_id": approval_id, "status": "denied"}
    method, kind = original["method"], original["kind"]
    payload = dict(original["payload"])
    if (kind in {"collections", "assignments"} and method != "DELETE"
            or kind in {"projects", "folders"} and method == "DELETE"):
        payload["confirmed"] = True
    try:
        result = apply(service, method, kind, approval_id if kind == "import" else original["record_id"], payload)
    except StorageError:
        # Guard failures did not apply the mutation. Preserve the proposal for the operator.
        with service.db.session(transaction="write") as session:
            row = service.library._record(session, "approvals", approval_id)
            row.data = {**original, "status": "pending"}
        raise
    with service.db.session(transaction="write") as session:
        row = service.library._record(session, "approvals", approval_id)
        row.data = {**original, "status": "applied", "result": result}
    return {"approval_id": approval_id, "status": "applied", "result": result}


def assign_masters(service, _runtime, request, body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    return service.library.assign_masters(body)


def delete_file(service, _runtime, request, body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body, ("revision", "confirmed"))
    return service.library.delete_file(identifier(request.match_info["id"]), body["revision"], body["confirmed"])


async def upload(service, request):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    settings = load_storage_settings(service.root)
    if settings["imports"]["default_mode"] != "copy":
        raise StorageError("INVALID_SOURCES")
    return await stage_upload(service, request)


def retry_import(service, _runtime, request, body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body)
    return {"operation_id": service.imports.retry_remaining(identifier(request.match_info["id"]))}


def remove_upload(service, _runtime, request, body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body)
    upload_id = identifier(request.match_info["id"])
    with service.workspaces.lock(), service.db.session() as session:
        running = session.scalars(select(StorageOperation).where(StorageOperation.kind == "import",
                                                                 StorageOperation.phase.not_in(TERMINAL)))
        if any(upload_id in operation.plan.get("uploads", []) for operation in running):
            raise StorageError("STORAGE_BUSY")
        discard_upload(service, upload_id)
    return {"upload_id": upload_id, "deleted": True}


def library_routes():
    return [
        ("GET", "/library/approvals", approvals, 200),
        ("GET", "/library/approvals/{id}", approval, 200),
        ("POST", "/library/approvals/{id}", decide, 200),
        ("POST", "/library/import-requests", request_import, 202),
        ("POST", "/library/imports/{id}/retry-remaining", retry_import, 202),
        ("POST", "/library/assignments/batch", assign_masters, 201),
        ("POST", "/library/assets/{id}/delete-file", delete_file, 200),
        ("PUT", "/library/uploads/{id}", upload, 201),
        ("DELETE", "/library/uploads/{id}", remove_upload, 200),
        ("GET", "/library/{kind}", listing, 200),
        ("GET", "/library/{kind}/{id}", detail, 200),
        ("POST", "/library/{kind}", mutate, 201),
        ("PATCH", "/library/{kind}/{id}", mutate, 200),
        ("DELETE", "/library/{kind}/{id}", mutate, 200),
    ]
