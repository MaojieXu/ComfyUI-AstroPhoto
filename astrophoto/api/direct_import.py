"""Browser-only endpoints for manifest-based copy imports."""

import asyncio
from time import monotonic

from ..core.errors import StorageError
from .storage import fields

BODY_IDLE_TIMEOUT = 60


def browser(request):
    if "Authorization" in request.headers:
        raise StorageError("UNAUTHORIZED_LIBRARY_OPERATION")


def preview(service, _runtime, request, body):
    browser(request)
    fields(body, ("files", "settings_revision"), ("attributes", "project_id", "parallel", "workspace_ids"))
    return service.direct_imports.preview(body)


def start(service, _runtime, request, body):
    browser(request)
    fields(body, ("preview_id", "idempotency_key"))
    return service.direct_imports.start(body["preview_id"], body["idempotency_key"])


def status(service, _runtime, request, _body):
    browser(request)
    return service.direct_imports.status(request.match_info["id"])


def cancel(service, _runtime, request, body):
    browser(request)
    fields(body)
    return service.direct_imports.cancel(request.match_info["id"])


async def put_file(service, request):
    browser(request)
    if set(request.query) - {"workspace_id"}:
        raise StorageError("INVALID_REQUEST")
    # Keep the filesystem leases, streaming writer and final DB commit on one worker.
    # Only the aiohttp body reader runs on the owning event loop.
    loop = asyncio.get_running_loop()
    entry_id = request.match_info["entry_id"]

    def read(size):
        future = asyncio.run_coroutine_threadsafe(request.content.read(size), loop)
        deadline = monotonic() + BODY_IDLE_TIMEOUT
        while not service.closing.is_set() and not service.direct_imports.transfer_cancelled(entry_id):
            remaining = deadline - monotonic()
            if remaining <= 0:
                future.cancel()
                raise StorageError("SOURCE_UNREADABLE")
            try:
                return future.result(timeout=min(1, remaining))
            except TimeoutError:
                if future.done():
                    return future.result()
        future.cancel()
        raise StorageError("STORAGE_BUSY" if service.closing.is_set() else "OPERATION_CANCELLED")

    return await asyncio.to_thread(service.direct_imports.put, request.match_info["id"], entry_id,
                                   request.content_length, read, request.query.get("workspace_id"))


def direct_routes():
    return [
        ("POST", "/library/direct-imports/preview", preview, 200),
        ("POST", "/library/direct-imports", start, 201),
        ("GET", "/library/direct-imports/{id}", status, 200),
        ("DELETE", "/library/direct-imports/{id}", cancel, 200),
        ("PUT", "/library/direct-imports/{id}/files/{entry_id}", put_file, 200),
    ]
