"""Storage DTO boundary. Calls are run outside the aiohttp event loop."""

import asyncio
import errno
import json
import logging
import os
import base64
import subprocess
import threading
from pathlib import Path
from string import ascii_uppercase
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
_native_picker_lock = threading.Lock()


def native_picker(_service, _runtime, _request, body):
    fields(body, ("kind",))
    kind = body["kind"]
    if kind not in ("file", "folder"):
        raise StorageError("INVALID_REQUEST")
    if os.name != "nt":
        return {"status": "unavailable", "path": None}
    if not _native_picker_lock.acquire(blocking=False):
        return {"status": "busy", "path": None}
    try:
        script = r'''
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$d = if ($args[0] -eq 'folder') { New-Object System.Windows.Forms.FolderBrowserDialog } else { New-Object System.Windows.Forms.OpenFileDialog }
try {
  $owner = New-Object System.Windows.Forms.Form
  $owner.Text = 'AstroPhoto'
  $owner.StartPosition = 'CenterScreen'
  $owner.FormBorderStyle = 'FixedToolWindow'
  $owner.Size = New-Object System.Drawing.Size(240, 64)
  $owner.TopMost = $true
  $owner.ShowInTaskbar = $true
  $owner.Show()
  $owner.Activate()
  $result = $d.ShowDialog($owner)
  $path = if ($result -eq [System.Windows.Forms.DialogResult]::OK) { if ($args[0] -eq 'folder') { $d.SelectedPath } else { $d.FileName } } else { $null }
  @{ path = $path } | ConvertTo-Json -Compress
} finally { $d.Dispose(); $owner.Dispose() }
'''
        # PowerShell's encoded command cannot receive script arguments via -Command;
        # the only interpolated value is a validated constant.
        script = script.replace("$args[0]", "'" + kind + "'")
        encoded = base64.b64encode(script.encode("utf-16-le")).decode("ascii")
        try:
            result = subprocess.run(["powershell.exe", "-NoProfile", "-NonInteractive", "-STA", "-EncodedCommand", encoded],
                                    capture_output=True, timeout=180, creationflags=subprocess.CREATE_NO_WINDOW, check=True)
            selected = json.loads(result.stdout.decode("utf-8-sig"))["path"]
        except subprocess.TimeoutExpired:
            logger.info("Native %s picker timed out", kind)
            return {"status": "unavailable", "path": None}
        except (OSError, subprocess.SubprocessError, ValueError, KeyError) as exc:
            logger.warning("Native %s picker failed (%s)", kind, type(exc).__name__)
            return {"status": "unavailable", "path": None}
        return {"status": "selected" if selected else "cancelled", "path": selected}
    finally:
        _native_picker_lock.release()


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
    result["capabilities"] = {"write": True, "import": True}
    result["operations"] = service.operations.recent()
    return result


def list_operations(service, _runtime, _request, _payload):
    return {"operations": service.operations.recent_receipts()}


def init_storage(service, _runtime, _request, payload):
    fields(payload)
    return service.ensure_layout()


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


def browse_directories(_service, _runtime, request, _body):
    from ..storage.paths import checked_path, ensure_local_volume

    raw = request.query.get("path")
    if raw is None:
        if os.name == "nt":
            import ctypes
            roots = [str(Path(f"{letter}:/")) for letter in ascii_uppercase
                     if ctypes.windll.kernel32.GetDriveTypeW(f"{letter}:\\") in (2, 3, 6)]
        else:
            roots = [str(Path.home())]
        return {"path": None, "parent": None, "directories": [{"name": root, "path": root} for root in roots]}
    path = Path(raw)
    if path != Path(path.anchor) or not path.is_absolute():
        path = checked_path(path)
    elif os.name == "nt":
        import ctypes
        if ctypes.windll.kernel32.GetDriveTypeW(str(path)) == 4:
            raise StorageError("INVALID_STORAGE_PATH")
    ensure_local_volume(path)
    if not path.is_dir():
        raise StorageError("INVALID_STORAGE_PATH")
    directories = []
    files = []
    with os.scandir(path) as entries:
        for entry in entries:
            try:
                if entry.is_dir(follow_symlinks=False) and not entry.is_symlink():
                    checked_path(Path(entry.path))
                    directories.append({"name": entry.name, "path": entry.path})
                elif request.query.get("files") == "1" and entry.is_file(follow_symlinks=False):
                    checked_path(Path(entry.path))
                    files.append({"name": entry.name, "path": entry.path})
            except (OSError, StorageError):
                continue
    directories.sort(key=lambda item: item["name"].casefold())
    files.sort(key=lambda item: item["name"].casefold())
    return {"path": str(path), "parent": str(path.parent) if path.parent != path else None,
            "directories": directories, "files": files}


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
    fields(body, ("new_path",), ("allow_partial",))
    allow_partial = body.get("allow_partial", False)
    if type(allow_partial) is not bool:
        raise StorageError("INVALID_REQUEST")
    return service.workspaces.relocate(uuid_value(request.match_info["id"]), body["new_path"], allow_partial=allow_partial)


def remove_location(service, _runtime, request, body):
    fields(body, ("expected_revision",), ("target_workspace_id",))
    workspace = uuid_value(request.match_info["id"])
    if "target_workspace_id" not in body:
        return service.workspaces.remove(workspace, body["expected_revision"])
    return service.migrations.remove_location(workspace, body["expected_revision"], uuid_value(body["target_workspace_id"]))


def configure_cache(service, _runtime, _request, body):
    fields(body, ("path", "max_size_gb", "expected_revision"))
    return service.cache.configure(body["path"], body["max_size_gb"], body["expected_revision"])


def clear_cache(service, _runtime, _request, body):
    return service.cache.clear_owned_cache(fields(body, ("scope",))["scope"])


def update_volume(service, _runtime, request, body):
    fields(body, ("quota_bytes", "expected_revision"))
    return service.capacity.configure(uuid_value(request.match_info["id"]), body["quota_bytes"],
                                      body["expected_revision"])


def update_location_policy(service, _runtime, _request, body):
    fields(body, ("expected_revision", "order", "quotas"))
    order, quotas = body["order"], body["quotas"]
    if not isinstance(order, list) or not isinstance(quotas, dict):
        raise StorageError("INVALID_REQUEST")
    with service.workspaces.lock(), service.capacity.lock:
        rows = service.workspaces.list()
        ids = {row.id for row in rows}
        if (len(order) != len(ids) or set(order) != ids or set(quotas) - ids
                or any(value is not None and (type(value) is not int or not 0 <= value <= 2**53 - 1)
                       for value in quotas.values())):
            raise StorageError("INVALID_REQUEST")
        from ..core.config import load_storage_settings, write_storage_settings
        settings = load_storage_settings(service.root)
        settings["workspace_order"] = order
        settings["location_quotas"] = {key: value for key, value in quotas.items() if value is not None}
        write_storage_settings(service.root, settings, body["expected_revision"])
    return {"updated": True}


def start_migration(service, _runtime, _request, body):
    if "plan_id" in body:
        fields(body, ("plan_id", "option_id", "idempotency_key"))
        uuid_value(body["plan_id"])
    else:
        fields(body, ("workspace_id", "target_path", "idempotency_key"))
        uuid_value(body["workspace_id"])
    return {"operation_id": service.migrations.start(body)}


def migration_preflight(service, _runtime, _request, body):
    if "target_workspace_id" in body:
        fields(body, ("workspace_id", "target_workspace_id", "amount", "unit"))
        uuid_value(body["target_workspace_id"])
    else:
        fields(body, ("workspace_id", "target_path"))
    uuid_value(body["workspace_id"])
    return service.migrations.preflight(body)


def data_root_preflight(service, _runtime, _request, body):
    from ..storage.data_root import DataRoots

    return DataRoots(service.root).plan(service.root, fields(body, ("target_path",))["target_path"])


def discard_migration_target(service, _runtime, request, body):
    fields(body, (), ("confirm",))
    confirm = body.get("confirm", False)
    if type(confirm) is not bool:
        raise StorageError("INVALID_REQUEST")
    return service.migrations.discard_target(uuid_value(request.match_info["id"]), confirm=confirm)


def operation_handler(kind, command="status"):
    def handle(service, _runtime, request, _body):
        action = getattr(service.operations, command)
        return action(uuid_value(request.match_info["id"]), kind)
    return handle


def handler(runtime, action, status, *, equipment=False, authorize=None, raw=False, json_limit=65536):
    custom_auth = authorize is not None
    authorize = authorize or (authorize_equipment_request if equipment else authorize_storage_operation)

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
                code = ("UNAUTHORIZED_LIBRARY_OPERATION" if custom_auth else
                        "UNAUTHORIZED_EQUIPMENT_OPERATION" if equipment else "UNAUTHORIZED_STORAGE_OPERATION")
                raise StorageError(code)
            service = runtime.storage
            if service is None:
                code = runtime.storage_error or ("EQUIPMENT_UNAVAILABLE" if equipment else "STORAGE_UNAVAILABLE")
                if action is not snapshot:
                    message = runtime.storage_error_message if action is init_storage else None
                    return respond(StorageError(code, message), request_id)
                return web.json_response({"status": "error", "reason": code, "error": {"code": code, "message": code},
                                          "capabilities": {"write": False, "import": False}, "request_id": request_id},
                                         status=503, headers={"Cache-Control": "no-store"})
            payload = None if action is init_storage else {}
            if request.can_read_body and not raw:
                if request.content_type != "application/json" or (request.content_length or 0) > json_limit:
                    raise StorageError("INVALID_REQUEST")
                data = bytearray()
                async for chunk in request.content.iter_chunked(8192):
                    data.extend(chunk)
                    if len(data) > json_limit:
                        raise StorageError("INVALID_REQUEST")
                try:
                    payload = json.loads(data)
                except (ValueError, RecursionError) as exc:
                    raise StorageError("INVALID_REQUEST") from exc
            result = (await action(service, request) if raw else
                      await asyncio.to_thread(action, service, runtime, request, payload))
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
        ("GET", "/storage/operations", list_operations, 200),
        ("POST", "/storage/init", init_storage, 200),
        ("PATCH", "/storage/settings", settings, 200),
        ("PUT", "/storage/location-policy", update_location_policy, 200),
        ("POST", "/storage/locations", add_location, 201),
        ("GET", "/storage/directories", browse_directories, 200),
        ("POST", "/storage/native-picker", native_picker, 200),
        ("PATCH", "/storage/locations/{id}", update_location, 200),
        ("DELETE", "/storage/locations/{id}", remove_location, 200),
        ("POST", "/storage/locations/{id}/validate", validate_location, 200),
        ("POST", "/storage/locations/{id}/relocate", relocate, 200),
        ("PATCH", "/storage/locations/{id}/volume", update_volume, 200),
        ("POST", "/storage/cache/configure", configure_cache, 200),
        ("POST", "/storage/cache/clear", clear_cache, 200),
        ("POST", "/storage/migrations/preflight", migration_preflight, 200),
        ("POST", "/storage/data-root/preflight", data_root_preflight, 200),
        ("POST", "/storage/migrations", start_migration, 202),
        ("GET", "/storage/migrations/{id}", operation_handler("migration"), 200),
        ("POST", "/storage/migrations/{id}/cancel", operation_handler("migration", "cancel"), 200),
        ("POST", "/storage/migrations/{id}/retry", operation_handler("migration", "retry"), 202),
        ("POST", "/storage/migrations/{id}/discard-target", discard_migration_target, 200),
    ]

