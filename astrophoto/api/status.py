"""Status can be tested independently of the ComfyUI process."""

import asyncio

from aiohttp import web

from ..bootstrap import Runtime
from ..core.capabilities import capabilities, storage_capabilities


def status_payload(runtime: Runtime) -> dict:
    registered = runtime.node_registered()
    active = capabilities(node_registered=registered, routes_registered=runtime.routes_registered)
    active.update(storage_capabilities(runtime))
    storage_failed = "database" in active and not active["database"]["available"]
    return {
        "extension": {"id": runtime.config.extension_id, "version": runtime.config.version},
        "api_version": "v1",
        "status": "ok" if registered and runtime.routes_registered and not storage_failed else "degraded",
        "runtime": {"node_registered": registered, "routes_registered": runtime.routes_registered},
        "data_home": str(runtime.storage.root if runtime.storage is not None else runtime.config.data_home),
        "storage_instance_id": runtime.storage.workspaces.instance_id if runtime.storage is not None else None,
        "capabilities": active,
    }


async def status_handler(_request: web.Request, runtime: Runtime) -> web.Response:
    return web.json_response(await asyncio.to_thread(status_payload, runtime))
