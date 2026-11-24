"""Access AstroPhoto equipment through the authorized loopback HTTP API."""

from ipaddress import ip_address
from uuid import UUID

import httpx
from fastmcp.exceptions import ToolError

from ..config import HTTP_TIMEOUT

PREFIX = "astrophoto/v1/"


def credential(value):
    return value if 43 <= len(value) <= 256 and value.isascii() and all(c.isalnum() or c in "-_" for c in value) else None


def direct_url(base_url):
    url = httpx.URL(base_url)
    try:
        return ip_address(url.host).is_loopback and url.path == "/"
    except ValueError:
        return False


def canonical_id(value):
    try:
        if len(value) == 36 and str(UUID(value)) == value:
            return value
    except ValueError:
        pass
    raise ToolError("INVALID_REQUEST: expected a canonical UUID")


def list_params(query, include_archived, cursor, limit, **options):
    if len(query) > 120 or not 1 <= limit <= 100:
        raise ToolError("INVALID_REQUEST: query limit is 120 characters and page size is 1–100")
    result = {"q": query, "archived": "all" if include_archived else "false", "limit": str(limit)}
    if cursor is not None:
        result["after"] = canonical_id(cursor)
    return result | {key: value for key, value in options.items() if value is not None}


def safe_fields(details, *tokens):
    """Return the bounded field/reason map of a validation error without leaking secrets."""
    fields = details.get("fields") if isinstance(details, dict) else None
    if not isinstance(fields, dict):
        return {}
    result = {}
    for key, value in list(fields.items())[:12]:
        if not isinstance(key, str) or not isinstance(value, str):
            continue
        if not 0 < len(key) <= 40 or not 0 < len(value) <= 40:
            continue
        if not all(character.isalnum() or character in "_.-" for character in key + value):
            continue
        if any(token and token in key + value for token in tokens):
            continue
        result[key] = value
    return result


def valid_record(value, kind):
    if kind == "draft":
        return (isinstance(value, dict) and isinstance(value.get("draft"), dict)
                and type(value.get("draft_version")) is int and value["draft_version"] > 0)
    if not isinstance(value, dict) or not isinstance(value.get("id"), str):
        return False
    try:
        canonical_id(value["id"])
    except ToolError:
        return False
    if kind == "equipment":
        return (value.get("equipment_type") in ("camera", "primary_optics", "optical_accessory", "filter", "other")
                and isinstance(value.get("name"), str) and isinstance(value.get("product_name"), str)
                and type(value.get("row_version")) is int and value["row_version"] > 0)
    if kind == "train":
        return (value.get("status") in ("draft", "published", "archived", "deleted") and isinstance(value.get("name"), str)
                and isinstance(value.get("summary"), dict) and type(value.get("row_version")) is int
                and value["row_version"] > 0)
    if type(value.get("revision_number")) is not int or value["revision_number"] < 1 or not isinstance(value.get("train_id"), str):
        return False
    if kind == "revision_detail":
        snapshot = value.get("snapshot")
        return (isinstance(snapshot, dict) and snapshot.get("snapshot_version") == 1
                and snapshot.get("train_id") == value["train_id"]
                and isinstance(snapshot.get("camera"), dict) and isinstance(snapshot.get("primary_optics"), dict)
                and isinstance(snapshot.get("accessories"), list) and isinstance(snapshot.get("filters"), list))
    return True


class EquipmentHTTP:
    def __init__(self, base_url, token, transport=None):
        self.base_url = base_url
        self.token = token
        self.transport = transport

    async def get(self, path, kind, *, params=None, collection=False, paged=False):
        return await self.request("GET", path, kind, params=params, collection=collection, paged=paged)

    async def request(self, method, path, kind, *, params=None, collection=False, paged=False, body=None, approval_token=None):
        headers = {"Authorization": f"Bearer {self.token}"}
        if approval_token is not None:
            headers["X-AstroPhoto-Approval"] = f"Bearer {approval_token}"
        async with httpx.AsyncClient(base_url=self.base_url, timeout=HTTP_TIMEOUT, transport=self.transport,
                                     trust_env=False, follow_redirects=False) as client:
            try:
                response = await client.request(method, PREFIX + path, params=params, headers=headers, json=body)
                response.raise_for_status()
            except httpx.HTTPStatusError:
                code = "HTTP_ERROR"
                fields = {}
                try:
                    payload = response.json()
                    if isinstance(payload, dict) and isinstance(payload.get("error"), dict):
                        candidate = payload["error"].get("code")
                        if (isinstance(candidate, str) and candidate.isascii() and candidate.replace("_", "").isalnum()
                                and self.token not in candidate and (approval_token is None or approval_token not in candidate)):
                            code = candidate[:80]
                        fields = safe_fields(payload["error"].get("details"), self.token, approval_token)
                except (ValueError, RecursionError):
                    pass
                if code == "EQUIPMENT_VALIDATION_FAILED" and fields.get("name") == "duplicate":
                    code = "NAME_ALREADY_EXISTS"
                elif fields.get("after") == "invalid_cursor":
                    code = "INVALID_CURSOR"
                elif code in ("EQUIPMENT_VERSION_CONFLICT", "DRAFT_VERSION_CONFLICT", "REVISION_CONFLICT"):
                    code = "VERSION_CONFLICT"
                elif "archived_equipment" in fields.values():
                    code = "EQUIPMENT_ARCHIVED"
                elif code == "EQUIPMENT_VALIDATION_FAILED":
                    code = "INVALID_ARGUMENT"
                suffix = "".join(f" {key}={value}" for key, value in sorted(fields.items()))
                raise ToolError(f"{code}: AstroPhoto HTTP {response.status_code}{suffix}") from None
            except httpx.TimeoutException as exc:
                raise ToolError("TIMEOUT: AstroPhoto did not respond in time") from exc
            except httpx.HTTPError as exc:
                raise ToolError("NETWORK_ERROR: AstroPhoto could not be reached") from exc
            except (ValueError, TypeError, RecursionError):
                raise ToolError("INVALID_REQUEST: AstroPhoto requires serializable JSON fields") from None
        if method == "DELETE":
            if response.status_code != 204:
                raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected deletion response")
            return {"id": path.rsplit("/", 1)[-1], "deleted": True}
        try:
            result = response.json()
        except ValueError as exc:
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned invalid JSON") from exc
        if collection:
            records = result.get("items") if isinstance(result, dict) else None
            valid = isinstance(records, list) and all(valid_record(item, kind) for item in records)
            if paged:
                valid = valid and "next" in result
                if valid and result["next"] is not None:
                    valid = isinstance(result["next"], str) and len(result["next"]) <= 4096
        else:
            valid = valid_record(result, kind)
        if not valid:
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected equipment DTO")
        return result
