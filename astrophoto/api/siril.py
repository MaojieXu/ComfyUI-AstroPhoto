"""Native storage-authenticated Siril software and preview routes."""

from aiohttp import web

from ..core.config import (
    CANVAS_PREVIEW_MAX, CANVAS_PREVIEW_MIN, PREVIEW_LONGEST_EDGE_OPTIONS, canvas_preview, load_storage_settings,
    preview_longest_edge, validate_canvas_preview, validate_preview_longest_edge,
)
from ..core.errors import StorageError
from ..siril.frames import frame_assets
from .storage import fields, uuid_value


def status(service, _runtime, _request, _body):
    return service.siril.status()


def discover(service, _runtime, _request, _body):
    return service.siril.discover()


def save(service, _runtime, _request, body):
    return service.siril.save(fields(body, ("path",))["path"])


def clear(service, _runtime, _request, _body):
    return service.siril.clear()


def set_enabled(service, _runtime, _request, body):
    return service.siril.set_enabled(fields(body, ("enabled",))["enabled"])


def frames(service, _runtime, request, _body):
    after = request.query.get("after")
    return frame_assets(service, uuid_value(after) if after else "")


def preview_settings_payload(settings):
    return {"longest_edge": preview_longest_edge(settings), "options": PREVIEW_LONGEST_EDGE_OPTIONS,
            "canvas": canvas_preview(settings), "canvas_min": CANVAS_PREVIEW_MIN, "canvas_max": CANVAS_PREVIEW_MAX,
            "revision": settings["revision"]}


def get_preview_settings(service, _runtime, _request, _body):
    return preview_settings_payload(load_storage_settings(service.root))


def set_preview_settings(service, _runtime, _request, body):
    fields(body, ("expected_revision", "longest_edge"), ("canvas",))
    edge = validate_preview_longest_edge(body["longest_edge"])
    if "canvas" in body:
        validate_canvas_preview(body["canvas"])
    return preview_settings_payload(service.update_settings(
        body["expected_revision"], preview_edge=edge,
    ))


def start_preview(service, _runtime, _request, body):
    fields(body, ("owner", "parameters"), ("asset_id", "image_path", "formal_id"))
    if ("asset_id" in body) == ("image_path" in body):
        raise StorageError("INVALID_REQUEST")
    source = uuid_value(body["asset_id"]) if "asset_id" in body else body["image_path"]
    if not isinstance(source, str) or not source:
        raise StorageError("INVALID_REQUEST")
    values = fields(body["parameters"], ("shadowsclip", "targetbg", "linked"))
    return service.previews.start(uuid_value(body["owner"]), source, values,
                                  uuid_value(body["formal_id"]) if "formal_id" in body else None)


def preview_status(service, _runtime, request, _body):
    result = service.previews.status(uuid_value(request.match_info["id"]))
    result.pop("cache_key", None)
    return result


def cancel_preview(service, _runtime, request, _body):
    return service.previews.cancel(uuid_value(request.match_info["id"]))


def validate_preview(service, _runtime, request, _body):
    return service.previews.validate(uuid_value(request.match_info["id"]))


def image(service, _runtime, request, _body):
    side = request.match_info["side"]
    if side not in {"before", "after"}:
        raise StorageError("PREVIEW_NOT_FOUND")
    data = service.previews.read(uuid_value(request.match_info["id"]), side)
    return web.Response(body=data, content_type="image/png",
                        headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})


def siril_routes():
    return [
        ("GET", "/software/siril", status, 200),
        ("POST", "/software/siril/discover", discover, 200),
        ("PUT", "/software/siril", save, 200),
        ("DELETE", "/software/siril", clear, 200),
        ("PUT", "/software/siril/enabled", set_enabled, 200),
        ("GET", "/fits/assets", frames, 200),
        ("GET", "/previews/settings", get_preview_settings, 200),
        ("PUT", "/previews/settings", set_preview_settings, 200),
        ("POST", "/previews/autostretch", start_preview, 202),
        ("GET", "/previews/jobs/{id}", preview_status, 200),
        ("POST", "/previews/jobs/{id}/cancel", cancel_preview, 200),
        ("GET", "/previews/jobs/{id}/validate", validate_preview, 200),
        ("GET", "/previews/jobs/{id}/{side}", image, 200),
    ]

