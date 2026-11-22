"""Initialize the active host's storage layout over its direct local HTTP API."""

import re
from pathlib import PurePosixPath, PureWindowsPath
from uuid import UUID

import httpx
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError

from ..api.equipment import PREFIX, direct_url
from ..config import HTTP_TIMEOUT

READY_CHECKS = dict.fromkeys(("config", "database", "storage", "runtime"), "ready")
WORKSPACE_SUBDIRS = {"objects", "outputs", ".staging"}
STORAGE_ERROR_GUIDANCE = {
    "WORKSPACE_OFFLINE": "Remount the default workspace volume or use Storage Settings to reconnect the existing workspace, then retry init.",
    "WORKSPACE_FILES_MISSING": "Restore the missing registered files from a verified backup to their original workspace locations, then retry init.",
    "WORKSPACE_DISABLED": "Enable the default workspace in Storage Settings, then retry init.",
    "WORKSPACE_READ_ONLY": "Restore write access to the default workspace, then retry init.",
    "TARGET_NOT_EMPTY": "Preserve the existing files. Use the verified storage location for this instance or an empty location for a new installation. Reload ComfyUI and retry init.",
}


def _uuid(value):
    try:
        return isinstance(value, str) and len(value) == 36 and str(UUID(value)) == value
    except ValueError:
        return False


def _created_item(value):
    if not isinstance(value, str):
        return False
    parts = value.split("/")
    if len(parts) != 4:
        return False
    root, workspace_id, subdir, suffix = parts
    return root == "storage" and _uuid(workspace_id) and subdir in WORKSPACE_SUBDIRS and suffix == ""


def _json_object(response):
    try:
        payload = response.json()
    except (ValueError, RecursionError):
        return {}
    return payload if isinstance(payload, dict) else {}


def _receipt(response):
    payload = _json_object(response)
    root = payload.get("data_root")
    created = payload.get("created")
    if (payload.get("status") != "ready" or payload.get("checks") != READY_CHECKS
            or not isinstance(root, str) or not (PurePosixPath(root).is_absolute() or PureWindowsPath(root).is_absolute())
            or not _uuid(payload.get("request_id")) or not isinstance(created, list)
            or not all(_created_item(item) for item in created) or len(set(created)) != len(created)):
        raise ToolError("INVALID_RESPONSE: Check that the installed extension supports storage init and retry.")
    return {key: payload[key] for key in ("status", "data_root", "checks", "created", "request_id")}


async def _missing_route(client):
    stats = await client.get("system_stats")
    system = _json_object(stats).get("system")
    if stats.status_code != 200 or not isinstance(system, dict) or not isinstance(system.get("os"), str):
        raise ToolError("HOST_NOT_CONFIRMED: Check the configured URL and port for the running ComfyUI host.")
    status = await client.get(PREFIX + "status")
    if status.status_code == 404:
        raise ToolError("EXTENSION_NOT_LOADED: Load the AstroPhoto extension in ComfyUI and retry init.")
    extension = _json_object(status).get("extension")
    if status.status_code == 200 and isinstance(extension, dict) and extension.get("id") == "ComfyUI_AstroPhoto":
        raise ToolError("INIT_UNAVAILABLE: Update the AstroPhoto extension, reload ComfyUI and retry init.")
    raise ToolError("INVALID_RESPONSE: Check the extension status in ComfyUI before retrying init.")


def _http_error(response, payload, code):
    error = payload.get("error")
    reason = error.get("message") if isinstance(error, dict) else None
    request_id = payload.get("request_id")
    reference = f" (request_id={request_id})" if _uuid(request_id) else ""
    if response.status_code == 403:
        guidance = "Use a direct, trusted, single-user loopback ComfyUI host."
    elif response.status_code == 423:
        guidance = "Wait for the active storage operation and retry init."
    elif response.status_code == 507:
        guidance = "Free disk space on the storage volume and retry init."
    elif code in {"RECOVERY_REQUIRED", "DATABASE_INVALID", "WORKSPACE_IDENTITY_MISMATCH", "CACHE_IDENTITY_MISMATCH"}:
        guidance = "Preserve existing data, restore the verified storage files or configuration, then reload ComfyUI and retry init."
    else:
        guidance = STORAGE_ERROR_GUIDANCE.get(code, "Check the storage configuration and the ComfyUI log, then retry init.")
    detail = f" {' '.join(reason.split())[:240]}." if isinstance(reason, str) and reason and reason != code else ""
    return ToolError(f"{code}: HTTP {response.status_code}.{detail} {guidance}{reference}")


def register_init(server: FastMCP, base_url: str, *, transport: httpx.AsyncBaseTransport | None = None) -> None:
    @server.tool(annotations={"readOnlyHint": False, "destructiveHint": False, "idempotentHint": True, "openWorldHint": False})
    async def init() -> dict:
        """Check the local AstroPhoto data root, create safe missing layout items and return the verified receipt."""
        url = httpx.URL(base_url)
        if url.host == "localhost":
            url = url.copy_with(host="127.0.0.1")
        if not direct_url(url):
            raise ToolError("LOCAL_HOST_REQUIRED: Configure the direct loopback ComfyUI URL without a proxy path.")
        async with httpx.AsyncClient(base_url=url, timeout=HTTP_TIMEOUT, transport=transport,
                                     trust_env=False, follow_redirects=False) as client:
            try:
                response = await client.post(PREFIX + "storage/init", json={}, headers={"X-AstroPhoto-Local": "1"})
                if response.status_code == 200:
                    return _receipt(response)
                payload = _json_object(response)
                error = payload.get("error")
                code = error.get("code") if isinstance(error, dict) else None
                if not isinstance(code, str) or not re.fullmatch(r"[A-Z][A-Z0-9_]{0,79}", code):
                    if response.status_code in {404, 405}:
                        await _missing_route(client)
                    code = "HTTP_ERROR"
                raise _http_error(response, payload, code)
            except httpx.ConnectTimeout:
                raise ToolError("CONNECT_TIMEOUT: Check the ComfyUI URL and retry init.") from None
            except httpx.TimeoutException:
                raise ToolError("TIMEOUT: The result is unknown. Retry init to verify the active storage layout.") from None
            except httpx.ConnectError:
                raise ToolError("HOST_UNREACHABLE: Start ComfyUI and check its configured loopback URL and port.") from None
            except httpx.HTTPError:
                raise ToolError("NETWORK_ERROR: Check the ComfyUI connection and retry init to verify the result.") from None
