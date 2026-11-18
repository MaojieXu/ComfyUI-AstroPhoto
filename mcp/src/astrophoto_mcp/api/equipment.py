"""Read AstroPhoto equipment through the authorized loopback HTTP API."""

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


def valid_record(value, kind):
    if not isinstance(value, dict) or not isinstance(value.get("id"), str):
        return False
    try:
        canonical_id(value["id"])
    except ToolError:
        return False
    if kind == "equipment":
        return (value.get("equipment_type") in ("camera", "primary_optics", "optical_accessory", "filter")
                and isinstance(value.get("name"), str) and isinstance(value.get("specs"), dict)
                and type(value.get("row_version")) is int and value["row_version"] > 0)
    if kind == "train":
        return (value.get("status") in ("draft", "published", "archived") and isinstance(value.get("name"), str)
                and isinstance(value.get("summary"), dict) and type(value.get("row_version")) is int
                and value["row_version"] > 0 and type(value.get("has_draft")) is bool)
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
        async with httpx.AsyncClient(base_url=self.base_url, timeout=HTTP_TIMEOUT, transport=self.transport,
                                     trust_env=False, follow_redirects=False) as client:
            try:
                response = await client.get(PREFIX + path, params=params, headers={"Authorization": f"Bearer {self.token}"})
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                code = "HTTP_ERROR"
                try:
                    payload = response.json()
                    if isinstance(payload, dict) and isinstance(payload.get("error"), dict):
                        candidate = payload["error"].get("code")
                        if isinstance(candidate, str) and candidate.isascii() and candidate.replace("_", "").isalnum():
                            code = candidate[:80]
                except ValueError:
                    pass
                raise ToolError(f"{code}: AstroPhoto HTTP {response.status_code}") from exc
            except httpx.TimeoutException as exc:
                raise ToolError("TIMEOUT: AstroPhoto did not respond in time") from exc
            except httpx.HTTPError as exc:
                raise ToolError("NETWORK_ERROR: AstroPhoto could not be reached") from exc
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
                    try:
                        canonical_id(result["next"]) if isinstance(result["next"], str) else None
                        valid = isinstance(result["next"], str)
                    except ToolError:
                        valid = False
        else:
            valid = valid_record(result, kind)
        if not valid:
            raise ToolError("INVALID_RESPONSE: AstroPhoto returned an unexpected equipment DTO")
        return result
