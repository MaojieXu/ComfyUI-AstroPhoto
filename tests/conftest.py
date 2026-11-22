"""Extension fixtures with explicit, isolated ComfyUI host substitutes."""

import importlib.util
from pathlib import Path
import sys
from types import ModuleType, SimpleNamespace

import pytest
from aiohttp import web


@pytest.fixture
def extension(monkeypatch, tmp_path):
    home = tmp_path / "home"
    home.mkdir()
    monkeypatch.setenv("HOME", str(home))
    monkeypatch.setenv("USERPROFILE", str(home))
    # Narrow V3 test double, matched to inspected host 0.45.0 signatures.
    # This does not stand in for a successful host API import/runtime test.
    class Input:
        def __init__(self, id, **_kwargs):
            self.id = id

    class Output:
        def __init__(self, display_name=None):
            self.display_name = display_name
            self.io_type = "IMAGE"

    def custom(io_type):
        return SimpleNamespace(Input=type("CustomInput", (Input,), {"io_type": io_type}),
                               Output=lambda **kwargs: SimpleNamespace(io_type=io_type, **kwargs))

    class NodeOutput:
        def __init__(self, *args, **kwargs):
            self.result = args
            self.ui = kwargs.get("ui")

    latest = ModuleType("comfy_api.latest")
    latest.ComfyExtension = type("ComfyExtension", (), {})
    latest.io = SimpleNamespace(ComfyNode=type("ComfyNode", (), {}), Schema=SimpleNamespace,
                                Custom=custom, Image=SimpleNamespace(Output=Output), NodeOutput=NodeOutput,
                                Float=custom("FLOAT"), Boolean=custom("BOOLEAN"), String=custom("STRING"),
                                Hidden=SimpleNamespace(unique_id="UNIQUE_ID"))
    monkeypatch.setitem(sys.modules, "comfy_api", ModuleType("comfy_api"))
    monkeypatch.setitem(sys.modules, "comfy_api.latest", latest)
    folder_paths = ModuleType("folder_paths")
    host_nodes = ModuleType("nodes")
    state = SimpleNamespace(image=object(), mask=object(), calls=[], path=str(tmp_path / "drawing.png"))

    def resolve(path):
        state.calls.append(("resolve", path))
        return state.path

    class LoadImage:
        def load_image(self, image):
            state.calls.append(("load", image))
            return state.image, state.mask

    folder_paths.get_annotated_filepath = resolve
    folder_paths.get_temp_directory = lambda: str(tmp_path / "temp")
    host_nodes.LoadImage = LoadImage
    host_nodes.NODE_CLASS_MAPPINGS = {}
    server = ModuleType("server")
    routes = web.RouteTableDef()
    server.PromptServer = SimpleNamespace(instance=SimpleNamespace(routes=routes))
    monkeypatch.setitem(sys.modules, "server", server)
    monkeypatch.setitem(sys.modules, "folder_paths", folder_paths)
    monkeypatch.setitem(sys.modules, "nodes", host_nodes)
    root = Path(__file__).resolve().parents[1]
    name = "astrophoto_extension_test"
    spec = importlib.util.spec_from_file_location(name, root / "__init__.py", submodule_search_locations=[str(root)])
    module = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, name, module)
    try:
        spec.loader.exec_module(module)
        yield SimpleNamespace(module=module, host=state, root=root, routes=routes, registry=host_nodes.NODE_CLASS_MAPPINGS)
    finally:
        for route in routes:
            runtime = getattr(route.handler, "astrophoto_runtime", None)
            if runtime is not None and runtime.storage is not None:
                runtime.storage.close(runtime.processing_bundle)
        # Child modules otherwise retain the previous test's mocked host imports.
        for key in list(sys.modules):
            if key.startswith(name + "."):
                del sys.modules[key]
