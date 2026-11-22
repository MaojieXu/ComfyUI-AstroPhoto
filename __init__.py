"""ComfyUI extension entry point; MCP is independently launched."""

from comfy_api.latest import ComfyExtension, io

from .nodes import ComfyUIFEExampleVueBasic
from .nodes.scientific import AstroPhotoAssetSource, AstroPhotoCollectionSource, AstroPhotoFITSSource, AstroPhotoImagePath
from .astrophoto.bootstrap import host_runtime
from .astrophoto.bundles import ProcessingBundle
from .astrophoto.api.routes import register_routes

WEB_DIRECTORY = "./js"

class AstroPhotoExtension(ComfyExtension):
    def __init__(self, processing_bundle: ProcessingBundle | None = None):
        super().__init__()
        self.processing_bundle = processing_bundle

    def _bind_runtime(self, runtime) -> None:
        self.runtime = runtime
        self.processing_bundle = runtime.processing_bundle
        AstroPhotoFITSSource.runtime = runtime
        AstroPhotoAssetSource.runtime = runtime
        AstroPhotoCollectionSource.runtime = runtime
        if self.processing_bundle is not None:
            for node in self.processing_bundle.node_types():
                node.runtime = runtime

    async def on_load(self) -> None:
        import folder_paths
        from server import PromptServer
        import nodes as host_nodes

        import asyncio

        from .astrophoto.api.security import trusted_deployment

        routes = PromptServer.instance.routes
        for route in routes:
            existing = getattr(getattr(route, "handler", None), "astrophoto_runtime", None)
            if existing is not None:
                self._bind_runtime(existing)
                return
        runtime = await asyncio.to_thread(
            host_runtime, lambda: host_nodes.NODE_CLASS_MAPPINGS.get("vue-basic") is ComfyUIFEExampleVueBasic,
            self.processing_bundle, host_temp=folder_paths.get_temp_directory(),
        )
        try:
            from comfy.cli_args import args
        except ImportError:
            args = None
        runtime.trusted_local = trusted_deployment(args)
        self._bind_runtime(register_routes(routes, runtime))

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        bundle_nodes = () if self.processing_bundle is None else self.processing_bundle.node_types()
        return [ComfyUIFEExampleVueBasic, AstroPhotoFITSSource, *bundle_nodes, AstroPhotoImagePath,
                AstroPhotoAssetSource, AstroPhotoCollectionSource]


async def comfy_entrypoint() -> AstroPhotoExtension:
    from .extension.siril.bundle import SirilBundle

    return AstroPhotoExtension(SirilBundle())


__all__ = ["comfy_entrypoint", "WEB_DIRECTORY"]
