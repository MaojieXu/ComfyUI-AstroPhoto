"""ComfyUI extension entry point; MCP is independently launched."""

from comfy_api.latest import ComfyExtension, io

from .nodes import ComfyUIFEExampleVueBasic
from .nodes.scientific import AstroPhotoFITSSource, AstroPhotoImagePath, AstroPhotoSirilAutoStretch
from .astrophoto.bootstrap import host_runtime
from .astrophoto.api.routes import register_routes

WEB_DIRECTORY = "./js"

class AstroPhotoExtension(ComfyExtension):
    async def on_load(self) -> None:
        from server import PromptServer
        import nodes as host_nodes

        import asyncio
        import os

        from .astrophoto.api.security import trusted_deployment

        routes = PromptServer.instance.routes
        for route in routes:
            existing = getattr(getattr(route, "handler", None), "astrophoto_runtime", None)
            if existing is not None:
                self.runtime = existing
                AstroPhotoFITSSource.runtime = AstroPhotoSirilAutoStretch.runtime = existing
                return
        runtime = await asyncio.to_thread(
            host_runtime, lambda: host_nodes.NODE_CLASS_MAPPINGS.get("vue-basic") is ComfyUIFEExampleVueBasic
        )
        try:
            from comfy.cli_args import args
        except ImportError:
            args = None
        runtime.trusted_local = trusted_deployment(args, os.environ)
        self.runtime = register_routes(PromptServer.instance.routes, runtime)
        AstroPhotoFITSSource.runtime = AstroPhotoSirilAutoStretch.runtime = self.runtime

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [ComfyUIFEExampleVueBasic, AstroPhotoFITSSource, AstroPhotoSirilAutoStretch, AstroPhotoImagePath]


async def comfy_entrypoint() -> AstroPhotoExtension:
    return AstroPhotoExtension()


__all__ = ["comfy_entrypoint", "WEB_DIRECTORY"]
