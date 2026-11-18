"""V3 nodes that exchange registered FITS file paths through ComfyUI."""

from comfy_api.latest import io

from ..astrophoto.core.errors import StorageError
from ..astrophoto.siril.frames import inspect_fits, resolve_input
from ..astrophoto.siril.processing import formal_run
from ..astrophoto.storage.manager import fingerprint, source_stat

ImagePath = io.Custom("IMAGE_PATH")


class AstroPhotoImagePath(io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoImagePath", display_name="AstroPhoto Image Path", category="AstroPhoto/Assets",
            description="Pass an image path to another node.",
            inputs=[io.String.Input("image_path", display_name="Image Path", default="", socketless=True)],
            outputs=[ImagePath.Output(id="image_path", display_name="IMAGE_PATH")],
        )

    @classmethod
    def execute(cls, image_path):
        return io.NodeOutput(image_path)


class ScientificNode:
    runtime = None

    @classmethod
    def storage(cls):
        if cls.runtime is None or cls.runtime.storage is None:
            raise StorageError("STORAGE_UNAVAILABLE")
        if not cls.runtime.trusted_local:
            raise StorageError("UNAUTHORIZED_STORAGE_OPERATION")
        return cls.runtime.storage


class AstroPhotoFITSSource(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoFITSSource", display_name="AstroPhoto Load Image", category="AstroPhoto/Assets",
            description="Provide a local single-frame FITS file path.",
            inputs=[io.Custom("ASTRO_FITS_ASSET").Input("asset_id", display_name="FITS Asset")],
            outputs=[ImagePath.Output(id="image_path", display_name="IMAGE_PATH")],
        )

    @classmethod
    def fingerprint_inputs(cls, asset_id):
        try:
            return fingerprint(source_stat(resolve_input(cls.storage(), asset_id)[1]))
        except StorageError:
            return float("nan")

    @classmethod
    def execute(cls, asset_id):
        identity, path = resolve_input(cls.storage(), asset_id)
        inspect_fits(path)
        return io.NodeOutput(str(path), ui={"astrophoto_asset": [identity]})


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
            output, asset_id, source_id = formal_run(storage, image_path, values, throw_exception_if_processing_interrupted, event)
        except StorageError as exc:
            event({"state": "failed", "error": exc.code})
            raise
        return io.NodeOutput(str(output), ui={"astrophoto_asset": [asset_id], "astrophoto_source": [source_id],
                                              "astrophoto_parameters": [values]})

