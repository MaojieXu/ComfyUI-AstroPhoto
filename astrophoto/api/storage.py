"""Storage DTO boundary. Calls are run outside the aiohttp event loop."""

import asyncio
import errno
import json
import logging
from uuid import UUID, uuid4

from aiohttp import web

from filelock import Timeout
from sqlalchemy.exc import OperationalError

from ..core.config import validate_limit, validate_mode
from ..core.errors import StorageError
from .errors import storage_error_response
from .security import authorize_equipment_request, authorize_storage_operation

logger = logging.getLogger(__name__)
BASE = "/astrophoto/v1"


def uuid_value(value):
    try:
        if not isinstance(value, str) or str(UUID(value)) != value:
            raise ValueError()
        return value
    except ValueError as exc:
        raise StorageError("INVALID_REQUEST") from exc


def fields(payload, required=(), optional=()):
    if not isinstance(payload, dict) or not set(required) <= payload.keys() or payload.keys() - set((*required, *optional)):
        raise StorageError("INVALID_REQUEST")
    return payload


def snapshot(service, runtime, _request, _payload):
    result = service.snapshot(runtime.storage_source)
    result["capabilities"] = {"write": True, "import": bool(service.imports.source_roots)}
    result["operations"] = service.operations.recent()
    return result


def settings(service, _runtime, _request, payload):
    fields(payload, ("expected_revision",), ("imports", "workspace", "cache"))
    if len(payload) < 2:
        raise StorageError("INVALID_REQUEST")
    return service.update_settings(
        payload["expected_revision"],
        imports=validate_mode(fields(payload["imports"], ("default_mode",))["default_mode"]) if "imports" in payload else None,
        workspace=uuid_value(fields(payload["workspace"], ("default_workspace_id",))["default_workspace_id"])
        if "workspace" in payload else None,
        cache=validate_limit(fields(payload["cache"], ("max_size_gb",))["max_size_gb"]) if "cache" in payload else None,
    )


def add_location(service, _runtime, _request, body):
    fields(body, ("path", "name"), ("request_id",))
    return service.workspaces.register(body["path"], body["name"])


def update_location(service, _runtime, request, body):
    fields(body, ("expected_revision",), ("name", "enabled", "default"))
    if ("enabled" in body and type(body["enabled"]) is not bool or
            "default" in body and body["default"] is not True or
            "name" in body and not isinstance(body["name"], str) or len(body) == 1):
        raise StorageError("INVALID_REQUEST")
    return service.workspaces.update(uuid_value(request.match_info["id"]), body.pop("expected_revision"), **body)


def validate_location(service, _runtime, request, _body):
    return service.workspaces.validate(uuid_value(request.match_info["id"]))


def relocate(service, _runtime, request, body):
    return service.workspaces.relocate(uuid_value(request.match_info["id"]), fields(body, ("new_path",))["new_path"])


def remove_location(service, _runtime, request, body):
    return service.workspaces.remove(uuid_value(request.match_info["id"]), fields(body, ("expected_revision",))["expected_revision"])


def configure_cache(service, _runtime, _request, body):
    fields(body, ("path", "max_size_gb", "expected_revision"))
    return service.cache.configure(body["path"], body["max_size_gb"], body["expected_revision"])


def clear_cache(service, _runtime, _request, body):
    return service.cache.clear_owned_cache(fields(body, ("scope",))["scope"])


def start_migration(service, _runtime, _request, body):
    fields(body, ("workspace_id", "target_path", "idempotency_key"))
    uuid_value(body["workspace_id"])
    return {"operation_id": service.migrations.start(body)}


def operation_handler(kind, command="status"):
    def handle(service, _runtime, request, _body):
        action = getattr(service.operations, command)
        return action(uuid_value(request.match_info["id"]), kind)
    return handle


def handler(runtime, action, status, *, equipment=False):
    authorize = authorize_equipment_request if equipment else authorize_storage_operation

    def respond(exc, request_id):
        return storage_error_response(exc, request_id, equipment=equipment)

    async def wrapped(request):
        request_id = str(uuid4())
        try:
            if not authorize(request, runtime):
                if action is snapshot:
                    return web.json_response({"status": "unavailable",
                                              "reason": "UNAUTHORIZED_STORAGE_OPERATION",
                                              "capabilities": {"write": False, "import": False},
                                              "request_id": request_id}, headers={"Cache-Control": "no-store"})
                raise StorageError("UNAUTHORIZED_EQUIPMENT_OPERATION" if equipment else "UNAUTHORIZED_STORAGE_OPERATION")
            service = runtime.storage
            if service is None:
                code = runtime.storage_error or ("EQUIPMENT_UNAVAILABLE" if equipment else "STORAGE_UNAVAILABLE")
                if action is not snapshot:
                    return respond(StorageError(code), request_id)
                return web.json_response({"status": "error", "reason": code, "error": {"code": code, "message": code},
                                          "capabilities": {"write": False, "import": False}, "request_id": request_id},
                                         status=503, headers={"Cache-Control": "no-store"})
            payload = {}
            if request.can_read_body:
                if request.content_type != "application/json" or (request.content_length or 0) > 65536:
                    raise StorageError("INVALID_REQUEST")
                data = bytearray()
                async for chunk in request.content.iter_chunked(8192):
                    data.extend(chunk)
                    if len(data) > 65536:
                        raise StorageError("INVALID_REQUEST")
                try:
                    payload = json.loads(data)
                except (ValueError, RecursionError) as exc:
                    raise StorageError("INVALID_REQUEST") from exc
            result = await asyncio.to_thread(action, service, runtime, request, payload)
            if isinstance(result, web.Response):
                result.headers["X-Request-ID"] = request_id
                return result
            if status == 204:
                return web.Response(status=204, headers={"Cache-Control": "no-store", "X-Request-ID": request_id})
            return web.json_response({**result, "request_id": request_id}, status=status,
                                     headers={"Cache-Control": "no-store"})
        except StorageError as exc:
            return respond(exc, request_id)
        except Timeout:
            return respond(StorageError("STORAGE_BUSY"), request_id)
        except OperationalError as exc:
            code = "STORAGE_BUSY" if "locked" in str(exc.orig).lower() else "DATABASE_INVALID"
            return respond(StorageError(code), request_id)
        except OSError as exc:
            if exc.errno == errno.ENOSPC or getattr(exc, "winerror", 0) == 112:
                return respond(StorageError("INSUFFICIENT_DISK_SPACE"), request_id)
            if exc.errno in {errno.EACCES, errno.EPERM, errno.EROFS}:
                return respond(StorageError("STORAGE_PATH_UNWRITABLE"), request_id)
            logger.exception("AstroPhoto filesystem request %s failed", request_id)
            return respond(StorageError("INTERNAL_STORAGE_ERROR"), request_id)
        except (ValueError, TypeError, KeyError, OverflowError, RecursionError):
            if not equipment:
                return respond(StorageError("INVALID_REQUEST"), request_id)
            logger.exception("AstroPhoto equipment request %s failed", request_id)
            return respond(StorageError("INTERNAL_STORAGE_ERROR"), request_id)
        except Exception:
            logger.exception("AstroPhoto API request %s failed", request_id)
            return respond(StorageError("INTERNAL_STORAGE_ERROR"), request_id)
    return wrapped


def storage_routes():
    return [
        ("GET", "/storage", snapshot, 200),
        ("PATCH", "/storage/settings", settings, 200),
        ("POST", "/storage/locations", add_location, 201),
        ("PATCH", "/storage/locations/{id}", update_location, 200),
        ("DELETE", "/storage/locations/{id}", remove_location, 200),
        ("POST", "/storage/locations/{id}/validate", validate_location, 200),
        ("POST", "/storage/locations/{id}/relocate", relocate, 200),
        ("POST", "/storage/cache/configure", configure_cache, 200),
        ("POST", "/storage/cache/clear", clear_cache, 200),
        ("POST", "/storage/migrations", start_migration, 202),
        ("GET", "/storage/migrations/{id}", operation_handler("migration"), 200),
        ("POST", "/storage/migrations/{id}/cancel", operation_handler("migration", "cancel"), 200),
        ("POST", "/storage/migrations/{id}/retry", operation_handler("migration", "retry"), 202),
    ]

