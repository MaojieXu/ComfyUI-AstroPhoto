"""Status can be tested independently of the ComfyUI process."""

from aiohttp import web

from ..bootstrap import Runtime
from ..core.capabilities import capabilities


def status_payload(runtime: Runtime) -> dict:
    registered = runtime.node_registered()
    return {
        "extension": {"id": runtime.config.extension_id, "version": runtime.config.version},
        "api_version": "v1",
        "status": "ok" if registered and runtime.routes_registered else "degraded",
        "runtime": {"node_registered": registered, "routes_registered": runtime.routes_registered},
        "data_home": str(runtime.config.data_home),
        "capabilities": capabilities(node_registered=registered, routes_registered=runtime.routes_registered),
    }


async def status_handler(_request: web.Request, runtime: Runtime) -> web.Response:
    return web.json_response(status_payload(runtime))
