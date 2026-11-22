"""Route registration on ComfyUI's own RouteTableDef."""

from functools import partial

from ..bootstrap import Runtime
from .assets import asset_routes
from .equipment import equipment_routes
from .library import authorize_library, library_routes, upload
from .scientific import scientific_routes
from .status import status_handler
from .storage import BASE, handler, storage_routes

STATUS_PATH = f"{BASE}/status"


def register_routes(routes, runtime: Runtime) -> Runtime:
    existing = {(route.method, route.path): route.handler for route in routes if hasattr(route, "method")}
    key = ("GET", STATUS_PATH)
    if key in existing:
        previous = getattr(existing[key], "astrophoto_runtime", None)
        if previous is None:
            raise RuntimeError(f"Another handler already owns {STATUS_PATH}")
        previous.node_registered = runtime.node_registered
        return previous
    definitions = storage_routes() + asset_routes() + scientific_routes()
    if runtime.processing_bundle is not None:
        definitions.extend(runtime.processing_bundle.routes())
    equipment = equipment_routes()
    library = library_routes()
    for method, path, _, _ in definitions + equipment + library:
        if (method, BASE + path) in existing:
            raise RuntimeError(f"Another handler already owns {BASE + path}")
    status = partial(status_handler, runtime=runtime)
    status.astrophoto_runtime = runtime
    routes.get(STATUS_PATH)(status)
    for method, path, action, status_code in definitions:
        limit = 512 * 1024 if path in {"/assets/import", "/assets/import/preview"} else 65536
        routes.route(method, BASE + path)(handler(runtime, action, status_code, json_limit=limit))
    for method, path, action, status_code in equipment:
        routes.route(method, BASE + path)(handler(runtime, action, status_code, equipment=True))
    for method, path, action, status_code in library:
        routes.route(method, BASE + path)(handler(runtime, action, status_code, authorize=authorize_library,
                                                   raw=action is upload))
    runtime.routes_registered = True
    return runtime
