"""HTTP client for the Extension-owned catalog."""

import re

import httpx
from fastmcp.exceptions import ToolError

from ..config import HTTP_TIMEOUT
from ..target import INSTANCE_HEADER, LocalTarget
from .equipment import PREFIX, canonical_id, safe_fields


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
            if isinstance(error, dict):
                candidate = error.get("code")
                if (isinstance(candidate, str) and re.fullmatch(r"[A-Z][A-Z0-9_]{0,79}", candidate)
                        and (not self.token or self.token not in candidate)):
                    code = candidate
                details = error.get("details")
                fields = safe_fields(details, self.token)
                if code == "LIBRARY_RECORD_REFERENCED" and isinstance(details, dict):
                    refs = details.get("references")
                    if isinstance(refs, list):
                        fields["references"] = repr([name for name in refs[:10]
                                                     if isinstance(name, str) and (not self.token or self.token not in name)])
                if code == "REVISION_CONFLICT" and isinstance(details, dict):
                    path = details.get("existing_path")
                    if isinstance(path, str) and (not self.token or self.token not in path):
                        fields["existing_path"] = repr(path)
        except (ValueError, RecursionError):
            pass
        suffix = "".join(f" {key}={value}" for key, value in sorted(fields.items()))
        return ToolError(f"{code}: AstroPhoto HTTP {response.status_code}{suffix}")

    async def _send(self, method, route, *, params=None, body=None):
        headers = {"X-AstroPhoto-Agent": "1"}
        base_url = self.base_url
        if isinstance(base_url, LocalTarget):
            base_url, identity = base_url.binding()
            headers[INSTANCE_HEADER] = identity
        async with httpx.AsyncClient(
            base_url=base_url, timeout=HTTP_TIMEOUT, transport=self.transport, trust_env=False,
            follow_redirects=False, headers=headers,
        ) as client:
            try:
                response = await client.request(method, PREFIX + route, params=params, json=body)
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                raise self._http_error(exc.response) from None
            except httpx.TimeoutException:
                raise ToolError("TIMEOUT: AstroPhoto did not respond in time") from None
            except httpx.HTTPError:
                raise ToolError("NETWORK_ERROR: AstroPhoto could not be reached") from None
        try:
            payload = response.json()
        except (ValueError, RecursionError):
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned invalid JSON") from None
        if not isinstance(payload, dict):
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected catalog result")
        return response.status_code, payload

    async def request(self, method, route, *, body=None, result):
        status, payload = await self._send(method, "library/" + route, body=body)
        operation = payload.get("operation_id")
        try:
            canonical_id(operation)
        except (ToolError, TypeError):
            raise ToolError("INVALID_RESPONSE: invalid import operation reference") from None
        if result == "operation" and status == 202:
            return payload
        if (result == "operation_status" and status == 200 and (route.endswith("/" + operation) or re.search(r"/IMP-[A-F0-9]{8}$", route))
                and isinstance(payload.get("phase"), str) and isinstance(payload.get("receipt"), dict)):
            return payload
        raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected import receipt")

    async def catalog_request(self, method, route, *, params=None, body=None, page=False):
        _, payload = await self._send(method, "catalog/" + route, params=params, body=body)
        if page and (not isinstance(payload.get("items"), list) or "next" not in payload
                     or (payload["next"] is not None and not isinstance(payload["next"], str))):
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected catalog page")
        return payload
