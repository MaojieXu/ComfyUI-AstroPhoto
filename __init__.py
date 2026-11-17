"""ComfyUI extension entry point; MCP is independently launched."""

from comfy_api.latest import ComfyExtension, io

from .nodes import ComfyUIFEExampleVueBasic
from .astrophoto.bootstrap import bootstrap
from .astrophoto.api.routes import register_routes

WEB_DIRECTORY = "./js"

class AstroPhotoExtension(ComfyExtension):
    async def on_load(self) -> None:
        from server import PromptServer
        import nodes as host_nodes

        runtime = bootstrap(lambda: host_nodes.NODE_CLASS_MAPPINGS.get("vue-basic") is ComfyUIFEExampleVueBasic)
        self.runtime = register_routes(PromptServer.instance.routes, runtime)

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [ComfyUIFEExampleVueBasic]


async def comfy_entrypoint() -> AstroPhotoExtension:
    return AstroPhotoExtension()


__all__ = ["comfy_entrypoint", "WEB_DIRECTORY"]
