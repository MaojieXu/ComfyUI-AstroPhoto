"""HTTP client for the Extension-owned asset library."""

import re

import httpx
from fastmcp.exceptions import ToolError

from ..config import HTTP_TIMEOUT
from .equipment import PREFIX, canonical_id

APPROVAL_STATES = {"pending", "applying", "applied", "denied"}


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


class LibraryHTTP:
    def __init__(self, base_url, token, transport=None):
        self.base_url = base_url
        self.token = token
        self.transport = transport

    def _http_error(self, response):
        code = "HTTP_ERROR"
        try:
            payload = response.json()
            error = payload.get("error") if isinstance(payload, dict) else None
            candidate = error.get("code") if isinstance(error, dict) else None
            if (isinstance(candidate, str) and re.fullmatch(r"[A-Z][A-Z0-9_]{0,79}", candidate)
                    and self.token not in candidate):
                code = candidate
        except (ValueError, RecursionError):
            pass
        return ToolError(f"{code}: AstroPhoto HTTP {response.status_code}")

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

        if response.status_code == 202:
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
