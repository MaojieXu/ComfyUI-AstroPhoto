"""Register on an injected RouteTableDef, normally PromptServer.instance.routes."""

from functools import partial

from ..bootstrap import Runtime
from .status import status_handler

STATUS_PATH = "/astrophoto/v1/status"


def register_routes(routes, runtime: Runtime) -> Runtime:
    for route in routes:
        if route.method == "GET" and route.path == STATUS_PATH:
            existing = getattr(route.handler, "astrophoto_runtime", None)
            if existing is None:
                raise RuntimeError(f"Another handler already owns {STATUS_PATH}")
            # Keep one route even across repeated on_load or module reloads.
            existing.config = runtime.config
            existing.node_registered = runtime.node_registered
            return existing
    handler = partial(status_handler, runtime=runtime)
    handler.astrophoto_runtime = runtime
    routes.get(STATUS_PATH)(handler)
    runtime.routes_registered = True
    return runtime
