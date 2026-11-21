"""V3 Siril AutoStretch processing node."""

from comfy_api.latest import io

from ...astrophoto.core.errors import StorageError
from ...nodes.scientific import ImagePath, ScientificNode
from .processing import formal_run


class AstroPhotoSirilAutoStretch(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoSirilAutoStretch", display_name="Siril · AutoStretch", category="AstroPhoto/Siril",
            description="Calculate and apply a nonlinear background stretch to reveal faint detail.",
            inputs=[
                ImagePath.Input("image_path", display_name="IMAGE_PATH"),
                io.Float.Input("shadowsclip", display_name="Shadows clip (σ)", default=-2.8, step=0.01, round=False,
                               tooltip="Shadows clipping in standard deviations.", socketless=True),
                io.Float.Input("targetbg", display_name="Target background", default=0.25, min=0, max=1, step=0.01,
                               round=False, tooltip="Target normalized background, from 0 to 1.", socketless=True),
                io.Boolean.Input("linked", display_name="Link RGB channels", default=True, socketless=True,
                                 tooltip="Unlinked color stretching can alter white balance. Ignored for mono."),
            ],
            outputs=[ImagePath.Output(id="output_path", display_name="IMAGE_PATH")],
            hidden=[io.Hidden.unique_id],
            is_output_node=True,
        )

    @classmethod
    def fingerprint_inputs(cls, **_kwargs):
        # An explicit Queue action revalidates the software, source and current Workspace,
        # and produces a fresh artifact independent of ComfyUI's in-memory output cache.
        return float("nan")

    @classmethod
    def execute(cls, image_path, shadowsclip=-2.8, targetbg=0.25, linked=True):
        from comfy.model_management import throw_exception_if_processing_interrupted
        from server import PromptServer

        storage = cls.storage()
        values = {"shadowsclip": shadowsclip, "targetbg": targetbg, "linked": linked}
        # Events are transient, scoped to the client submitting the native prompt.
        def event(data):
            server = PromptServer.instance
            if server.client_id:
                server.send_sync("astrophoto:siril", {"node": cls.hidden.unique_id, **data}, server.client_id)

        try:
            output, asset_id, source_id = formal_run(
                storage, cls.runtime.processing_bundle.software, image_path, values,
                throw_exception_if_processing_interrupted, event,
            )
        except StorageError as exc:
            event({"state": "failed", "error": exc.code})
            raise
        return io.NodeOutput(str(output), ui={"astrophoto_asset": [asset_id], "astrophoto_source": [source_id],
                                              "astrophoto_parameters": [values]})
