"""HTTP client for the Extension-owned asset library."""

import re

import httpx
from fastmcp.exceptions import ToolError

from ..config import HTTP_TIMEOUT
from .equipment import PREFIX, canonical_id, safe_fields

APPROVAL_STATES = {"pending", "applying", "applied", "denied", "expired"}
GROUP_STATES = {"pending", "expired", "denied", "approved", "importing", "import_failed",
                "binding_pending", "binding_failed", "partial", "completed"}


def _canonical_uuid(value):
    if not isinstance(value, str):
        return False
    try:
        canonical_id(value)
    except ToolError:
        return False
    return True


def _record(value):
    return (
        isinstance(value, dict)
        and _canonical_uuid(value.get("id"))
        and type(value.get("revision")) is int
        and value["revision"] >= 0
    )


def _planned_group(group):
    if not isinstance(group, dict):
        return False
    preview, sources = group.get("preview"), group.get("sources")
    return (isinstance(sources, list) and bool(sources) and all(isinstance(path, str) for path in sources)
            and _canonical_uuid(group.get("group_id"))
            and isinstance(group.get("attributes"), dict) and isinstance(group.get("binding"), dict)
            and isinstance(preview, dict) and preview.get("effective_import_mode") in ("reference", "copy"))


def _agent_import_result(payload, result):
    if result == "agent_plan":
        groups = payload.get("groups")
        return (_canonical_uuid(payload.get("plan_id")) and isinstance(groups, list)
                and all(_planned_group(group) for group in groups) and isinstance(payload.get("unresolved"), list))
    digest, status = payload.get("digest"), payload.get("status")
    return (_canonical_uuid(payload.get("id")) and payload.get("approval_id") == payload["id"]
            and isinstance(digest, str) and re.fullmatch("[0-9a-f]{64}", digest) is not None
            and isinstance(status, str) and status in GROUP_STATES and _planned_group(payload.get("group")))


class LibraryHTTP:
    def __init__(self, base_url, token, transport=None):
        self.base_url = base_url
        self.token = token
        self.transport = transport

    def _http_error(self, response):
        code = "HTTP_ERROR"
        fields = {}
        try:
            payload = response.json()
            error = payload.get("error") if isinstance(payload, dict) else None
            candidate = error.get("code") if isinstance(error, dict) else None
            if (isinstance(candidate, str) and re.fullmatch(r"[A-Z][A-Z0-9_]{0,79}", candidate)
                    and self.token not in candidate):
                code = candidate
            if isinstance(error, dict):
                fields = safe_fields(error.get("details"), self.token)
        except (ValueError, RecursionError):
            pass
        suffix = "".join(f" {key}={value}" for key, value in sorted(fields.items()))
        return ToolError(f"{code}: AstroPhoto HTTP {response.status_code}{suffix}")

    async def request(self, method, route, *, body=None, params=None, result="record"):
        async with httpx.AsyncClient(
            base_url=self.base_url,
            timeout=HTTP_TIMEOUT,
            transport=self.transport,
            trust_env=False,
            follow_redirects=False,
            headers={"Authorization": f"Bearer {self.token}"},
        ) as client:
            try:
                response = await client.request(
                    method, PREFIX + "library/" + route, params=params, json=body,
                )
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                raise self._http_error(exc.response) from None
            except httpx.TimeoutException:
                raise ToolError("TIMEOUT: AstroPhoto did not respond in time") from None
            except httpx.HTTPError:
                raise ToolError("NETWORK_ERROR: AstroPhoto could not be reached") from None
            except (TypeError, ValueError, RecursionError):
                raise ToolError("INVALID_REQUEST: AstroPhoto requires serializable JSON fields") from None

        try:
            payload = response.json()
        except (ValueError, RecursionError):
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned invalid JSON") from None
        if not isinstance(payload, dict):
            raise ToolError("INVALID_RESPONSE: Expected an asset library object")

        if result in ("agent_plan", "agent_proposal"):
            valid = _agent_import_result(payload, result)
        elif response.status_code == 202:
            valid = method != "GET" and _canonical_uuid(payload.get("approval_id")) and payload.get("status") == "pending"
        elif result == "page":
            items = payload.get("items")
            next_cursor = payload.get("next")
            valid = (
                isinstance(items, list) and all(_record(item) for item in items)
                and "next" in payload and (next_cursor is None or _canonical_uuid(next_cursor))
            )
        elif result == "approval":
            state = payload.get("status")
            valid = (
                isinstance(state, str) and state in APPROVAL_STATES
                and payload.get("approval_id", payload.get("id")) == route.rsplit("/", 1)[-1]
            )
        elif result == "deletion":
            valid = payload.get("deleted") is True and payload.get("id") == route.rsplit("/", 1)[-1]
        elif result == "pending_approval":
            valid = False
        else:
            valid = _record(payload)

        if not valid:
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected asset library receipt")
        return payload
