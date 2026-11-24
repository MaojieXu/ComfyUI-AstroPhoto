"""Native library routes. Agent proposals cannot act as user approval."""

import os
import secrets
from hmac import compare_digest
from time import time
from uuid import uuid4

from aiohttp import web
from sqlalchemy import func, select

from ..assets.library import page
from ..assets.library_rules import FIELDS, identifier
from ..assets.uploads import discard_upload, stage_upload
from ..core.config import load_storage_settings
from ..core.errors import StorageError
from ..database.library_models import LibraryRecord
from ..database.models import StorageOperation
from ..storage.locations import TERMINAL
from .security import direct_local_request, valid_local_token
from .storage import fields

KINDS = {"assets", *FIELDS}
APPROVAL_TTL_SECONDS = 24 * 60 * 60


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
    if request.match_info["kind"] == "import-groups":
        return service.library.list("import-groups", request.query)
    return service.library.list(kind_of(request), request.query)


def detail(service, _runtime, request, _body):
    return service.library.get(kind_of(request), request.match_info["id"])


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
        if kind == "assets":
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


def pending_approvals(now):
    return (
        LibraryRecord.kind == "approvals",
        LibraryRecord.data["status"].as_string() == "pending",
        LibraryRecord.data["expires_at"].as_integer() > now,
    )


def approval_status(data, now):
    status = data["status"]
    if status == "pending" and data.get("expires_at", 0) <= now:
        return "expired"
    return status


def propose(service, method, kind, record_id, body):
    with service.db.session(transaction="write") as session:
        now = int(time())
        count = session.scalar(select(func.count()).select_from(LibraryRecord).where(*pending_approvals(now)))
        if count >= 100:
            raise StorageError("STORAGE_BUSY")
        row = service.library._save(session, "approvals", {
            "method": method, "kind": kind, "record_id": record_id, "payload": body, "status": "pending",
            "expires_at": now + APPROVAL_TTL_SECONDS,
        })
        return web.json_response({"approval_id": row.id, "status": "pending"}, status=202,
                                 headers={"Cache-Control": "no-store"})


def request_import(service, _runtime, request, body):
    if not is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body, ("sources",), ("settings_revision", "attributes", "catalog"))
    body.setdefault("settings_revision", load_storage_settings(service.root)["revision"])
    return propose(service, "POST", "import", None, body)


def direct_catalog_import(service, _runtime, request, body):
    """An authenticated agent may initiate a typed import directly."""
    if not is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    fields(body, ("sources", "catalog"))
    if not isinstance(body["catalog"], dict) or body["catalog"].keys() & {"confirmed", "master_ids"}:
        raise StorageError("INVALID_REQUEST")
    body["settings_revision"] = load_storage_settings(service.root)["revision"]
    return catalog_task(service, apply(service, "POST", "import", str(uuid4()), body))


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


def approvals(service, _runtime, request, _body):
    if is_agent(request):
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")
    with service.db.session() as session:
        pending = session.scalars(select(LibraryRecord).where(*pending_approvals(int(time()))))
        rows = [service.library._data(row) for row in pending]
    return page(sorted(rows, key=lambda row: row["id"]), request.query)


def approval(service, _runtime, request, _body):
    with service.db.session() as session:
        row = service.library._record(session, "approvals", request.match_info["id"])
        status = approval_status(row.data, int(time()))
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
        if approval_status(row.data, int(time())) != "pending":
            raise StorageError("REVISION_CONFLICT")
        original = row.data
        if original["kind"] not in {"import", *KINDS}:
            raise StorageError("LIBRARY_RECORD_NOT_FOUND")
        row.data = {**original, "status": "applying" if body["approved"] else "denied"}
        row.revision += 1
    if not body["approved"]:
        return {"approval_id": approval_id, "status": "denied"}
    method, kind = original["method"], original["kind"]
    payload = dict(original["payload"])
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
        ("POST", "/library/catalog-import", direct_catalog_import, 202),
        ("GET", "/library/catalog-import/{id}", catalog_import_status, 200),
        ("POST", "/library/imports/{id}/retry-remaining", retry_import, 202),
        ("POST", "/library/assets/{id}/delete-file", delete_file, 200),
        ("PUT", "/library/uploads/{id}", upload, 201),
        ("DELETE", "/library/uploads/{id}", remove_upload, 200),
        ("GET", "/library/{kind}", listing, 200),
        ("GET", "/library/{kind}/{id}", detail, 200),
        ("POST", "/library/{kind}", mutate, 201),
        ("PATCH", "/library/{kind}/{id}", mutate, 200),
        ("DELETE", "/library/{kind}/{id}", mutate, 200),
    ]
