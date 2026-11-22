"""Native storage-authenticated Siril software and candidate-preview routes."""

from functools import partial

from aiohttp import web

from ._dependencies import errors, storage_api
from .commands import AUTOSTRETCH, catalogue, command_for


def status(bundle, _service, _runtime, _request, _body):
    return bundle.software.status()


def discover(bundle, _service, _runtime, _request, _body):
    return bundle.software.discover()


def save(bundle, _service, _runtime, _request, body):
    return bundle.software.save(storage_api.fields(body, ("path",))["path"])


def clear(bundle, _service, _runtime, _request, _body):
    return bundle.software.clear()


def set_enabled(bundle, _service, _runtime, _request, body):
    return bundle.software.set_enabled(storage_api.fields(body, ("enabled",))["enabled"])


def commands(_service, _runtime, _request, _body):
    return catalogue()


def start_preview(bundle, _service, _runtime, request, body):
    command = command_for(request.match_info["command_id"]) if "command_id" in request.match_info else AUTOSTRETCH
    if not command.fits_preview:
        raise errors.StorageError("PREVIEW_NOT_FOUND")
    storage_api.fields(body, ("owner", "parameters"), ("asset_id", "image_path", "formal_id"))
    if ("asset_id" in body) == ("image_path" in body):
        raise errors.StorageError("INVALID_REQUEST")
    source = storage_api.uuid_value(body["asset_id"]) if "asset_id" in body else body["image_path"]
    if not isinstance(source, str) or not source:
        raise errors.StorageError("INVALID_REQUEST")
    values = storage_api.fields(body["parameters"], tuple(parameter.name for parameter in command.parameters))
    owner = storage_api.uuid_value(body["owner"])
    formal = storage_api.uuid_value(body["formal_id"]) if "formal_id" in body else None
    return bundle.previews.start(owner, source, values, formal, command=command)


def preview_status(bundle, _service, _runtime, request, _body):
    result = bundle.previews.status(storage_api.uuid_value(request.match_info["id"]))
    result.pop("cache_key", None)
    return result


def cancel_preview(bundle, _service, _runtime, request, _body):
    return bundle.previews.cancel(storage_api.uuid_value(request.match_info["id"]))


def validate_preview(bundle, _service, _runtime, request, _body):
    return bundle.previews.validate(storage_api.uuid_value(request.match_info["id"]))


def image(bundle, _service, _runtime, request, _body):
    side = request.match_info["side"]
    if side not in {"before", "after"}:
        raise errors.StorageError("PREVIEW_NOT_FOUND")
    data = bundle.previews.read(storage_api.uuid_value(request.match_info["id"]), side)
    return web.Response(body=data, content_type="image/png",
                        headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})


def siril_routes(bundle):
    return [
        ("GET", "/software/siril", partial(status, bundle), 200),
        ("POST", "/software/siril/discover", partial(discover, bundle), 200),
        ("PUT", "/software/siril", partial(save, bundle), 200),
        ("DELETE", "/software/siril", partial(clear, bundle), 200),
        ("PUT", "/software/siril/enabled", partial(set_enabled, bundle), 200),
        ("GET", "/software/siril/commands", commands, 200),
        ("POST", "/previews/siril/{command_id}", partial(start_preview, bundle), 202),
        ("POST", "/previews/autostretch", partial(start_preview, bundle), 202),
        ("GET", "/previews/jobs/{id}", partial(preview_status, bundle), 200),
        ("POST", "/previews/jobs/{id}/cancel", partial(cancel_preview, bundle), 200),
        ("GET", "/previews/jobs/{id}/validate", partial(validate_preview, bundle), 200),
        ("GET", "/previews/jobs/{id}/{side}", partial(image, bundle), 200),
    ]
