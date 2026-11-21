"""Native storage-authenticated FITS sources and shared preview settings."""

from ..assets.fits import frame_assets
from ..core.config import (
    CANVAS_PREVIEW_MAX, CANVAS_PREVIEW_MIN, PREVIEW_LONGEST_EDGE_OPTIONS, canvas_preview, load_storage_settings,
    preview_longest_edge, validate_canvas_preview, validate_preview_longest_edge,
)
from .storage import fields, uuid_value


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


def scientific_routes():
    return [
        ("GET", "/fits/assets", frames, 200),
        ("GET", "/previews/settings", get_preview_settings, 200),
        ("PUT", "/previews/settings", set_preview_settings, 200),
    ]
