"""Translate names and tool DTOs to public catalog API requests."""

from base64 import urlsafe_b64decode, urlsafe_b64encode
from hashlib import sha256
from json import dumps, loads

from fastmcp.exceptions import ToolError
from pydantic import MISSING

from ..api.equipment import canonical_id
from .equipment import key, resolve

READ = {"readOnlyHint": True, "openWorldHint": False}
WRITE = {"destructiveHint": False, "openWorldHint": False}
DELETE = {"destructiveHint": True, "openWorldHint": False}
UNSET = MISSING


def resource(kind):
    return "image_result" if kind == "master_frame" else kind


def compact(**fields):
    return {name: value for name, value in fields.items() if value is not None}


def patch(**fields):
    return {name: value for name, value in fields.items() if value is not UNSET}


def capture_fields(capture):
    return capture.model_dump(exclude_unset=True) if capture else {}


def path_of(row):
    return row.get("file_path") or row.get("external_path") or row.get("relative_path")


def asset_kind(row, fallback=None):
    return row.get("asset_type", row.get("result_type", fallback))


def view(row, kind=None):
    kind = asset_kind(row, kind)
    capture = {name: row[name] for name in ("exposure_seconds", "iso", "gain", "offset", "binning",
                                            "readout_mode", "temperature_c") if name in row}
    result = compact(name=row["name"], reference=row["id"], notes=row.get("notes"),
                     frame_type=row.get("frame_type"), calibration_state=row.get("calibration_state"),
                     subframe_count=row.get("count"), master_type=row.get("master_type"), calibration_type=row.get("type"),
                     created_at_utc=row.get("created_at_utc"), updated_at_utc=row.get("updated_at_utc"),
                     equipment_group=(row.get("equipment_snapshot") or {}).get("name"),
                     camera=(row.get("camera_snapshot") or {}).get("name") or next(
                         (item["name"] for item in (row.get("equipment_snapshot") or {}).get("components", [])
                          if item.get("equipment_type") == "camera"), None),
                     filter_state=row.get("filter_state"), filter_name=(row.get("filter_snapshot") or {}).get("name"),
                     file_name=row.get("file_name"), file_path=path_of(row), storage_mode=row.get("storage_mode"), workspace=row.get("workspace_id"))
    if kind != "calibration_master":
        result["asset_type"] = kind
    if capture:
        result["capture"] = capture
    if row.get("source_collection_id"):
        result["source_collection"] = compact(name=row.get("source_collection_name"), reference=row["source_collection_id"])
    if snapshot := row.get("equipment_snapshot"):
        result["equipment_snapshot"] = {
            "name": snapshot["name"], "components": [
                {k: item.get(k) for k in ("name", "product_name", "equipment_type")}
                for item in snapshot.get("components", []) if item.get("equipment_type") != "filter"
            ],
        }
    if snapshot := row.get("filter_snapshot"):
        result["filter_snapshot"] = {k: snapshot.get(k) for k in ("name", "product_name")}
    if snapshot := row.get("camera_snapshot"):
        result["camera_snapshot"] = {k: snapshot.get(k) for k in ("name", "product_name")}
    return result


def fingerprint(value):
    return sha256(dumps(value, sort_keys=True).encode()).hexdigest()


def cursor_token(position, scope):
    return urlsafe_b64encode(dumps([position, fingerprint(scope)]).encode()).decode()


def cursor_position(cursor, scope):
    try:
        position, digest = loads(urlsafe_b64decode(cursor).decode())
        if digest == fingerprint(scope) and isinstance(position, str) and position:
            return position
    except (ValueError, TypeError):
        pass
    raise ToolError("INVALID_CURSOR: reuse the cursor with the same listing and filters")


class CatalogClient:
    def __init__(self, api, equipment_api):
        self.api = api
        self.equipment_api = equipment_api

    async def call(self, method, route, *, params=None, body=None):
        return await self.api.catalog_request(method, route, params=params, body=body)

    async def page(self, route, params, cursor, limit, *, body=None):
        scope = [route, params, body]
        query = {**params, "limit": str(limit)}
        if cursor is not None:
            query["after"] = cursor_position(cursor, scope)
        response = await self.api.catalog_request("POST" if body is not None else "GET", route,
                                                  params=query, body=body, page=True)
        result = {k: v for k, v in response.items() if k != "next"}
        result["next_cursor"] = cursor_token(response["next"], scope) if response["next"] else None
        return result

    async def find(self, ref, kind, *, summary=False):
        route = resource(kind)
        params = {"exact_name": ref.name}
        if kind in ("master_frame", "image_result"):
            params["result_type"] = kind
        if master_type := getattr(ref, "calibration_type", None):
            params["type"] = master_type
        if ref.reference:
            row = await self.call("GET", route + "/" + canonical_id(ref.reference),
                                  params={"summary": "1"} if summary else None)
            if (key(row["name"]) != key(ref.name)
                    or ("type" in params and params["type"] != row.get("type"))
                    or ("result_type" in params and params["result_type"] != row.get("result_type"))):
                raise ToolError("REFERENCE_MISMATCH: reference does not match the requested name or type")
            return row
        result = await self.page(route, params, None, 20)
        rows = result["items"]
        if not rows:
            raise ToolError("NAME_NOT_FOUND: " + ref.name)
        if len(rows) != 1 or result["next_cursor"]:
            raise ToolError("AMBIGUOUS_NAME: " + dumps({"candidates": [view(row, kind) for row in rows],
                                                      "total": result.get("total", len(rows)),
                                                      "next_cursor": result["next_cursor"]}, ensure_ascii=False))
        if summary:
            return rows[0]
        return await self.call("GET", route + "/" + rows[0]["id"])

    async def optics(self, equipment, current=None):
        if equipment is UNSET:
            return {}
        if equipment is None:
            return {"equipment_train_id": None, "filter_id": None, "filter_state": "unknown"}
        values = equipment.model_dump(exclude_unset=True)
        if not values:
            return {}
        if "filter_state" in values and values["filter_state"] is None:
            raise ToolError("INVALID_ARGUMENT: filter_state cannot be null")
        prior_train = (current or {}).get("equipment_train_id")
        group_name = values.get("equipment_group")
        train = await resolve(self.equipment_api, "train", group_name) if group_name else None
        train_id = train["id"] if train else (None if "equipment_group" in values else prior_train)
        changed = "equipment_group" in values and train_id != prior_train
        filter_name = values.get("filter_name")
        filter_id = (current or {}).get("filter_id") if not changed else None
        state = values.get("filter_state", "unknown" if changed else (current or {}).get("filter_state", "unknown"))
        if "filter_name" in values and "filter_state" not in values:
            state = "selected" if filter_name else "unknown"
        if filter_name:
            if not train_id:
                raise ToolError("INVALID_ARGUMENT: a selected filter requires an equipment group")
            filt = await resolve(self.equipment_api, "equipment", filter_name)
            if filt["equipment_type"] != "filter":
                raise ToolError("INVALID_ARGUMENT: filter_name must name a filter")
            filter_id = filt["id"]
        elif state != "selected" or "filter_name" in values:
            filter_id = None
        if (filter_id is not None) != (state == "selected"):
            raise ToolError("INVALID_ARGUMENT: filter_state and filter_name disagree")
        return {"equipment_train_id": train_id, "filter_id": filter_id, "filter_state": state}

    async def update(self, route, row, changes):
        if not changes:
            raise ToolError("INVALID_ARGUMENT: provide at least one field to update")
        return await self.call("PATCH", route, body={"revision": row["revision"], **changes})

    async def submit(self, sources, config):
        result = await self.api.request("POST", "catalog-import", body={"sources": sources, "catalog": config},
                                        result="operation")
        return {"task": result["task"], "status": "queued"}
