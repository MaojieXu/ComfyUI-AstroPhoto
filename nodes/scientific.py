"""V3 nodes that exchange registered file paths through ComfyUI."""

from comfy_api.latest import io

from ..astrophoto.core.errors import StorageError
from ..astrophoto.assets.fits import inspect_fits, resolve_input
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


class AstroPhotoAssetSource(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoAssetSource", display_name="AstroPhoto Asset Source", category="AstroPhoto/Assets",
            description="Provide the path of a registered asset to a compatible reader or processing node.",
            inputs=[io.String.Input("asset_id", display_name="Asset ID", default="", socketless=True)],
            outputs=[ImagePath.Output(id="image_path", display_name="IMAGE_PATH")],
        )

    @classmethod
    def fingerprint_inputs(cls, asset_id):
        try:
            path = cls.storage().assets.resolve_asset(asset_id)
            return str(path), fingerprint(source_stat(path))
        except StorageError:
            return float("nan")

    @classmethod
    def execute(cls, asset_id):
        return io.NodeOutput(str(cls.storage().assets.resolve_asset(asset_id)))


class AstroPhotoCollectionSource(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoCollectionSource", display_name="AstroPhoto Collection Source",
            category="AstroPhoto/Assets",
            description="Provide the registered file paths of a Collection in member order.",
            inputs=[io.String.Input("collection_id", display_name="Collection ID", default="", socketless=True)],
            outputs=[ImagePath.Output(id="image_paths", display_name="IMAGE_PATH", is_output_list=True)],
        )

    @classmethod
    def _paths(cls, collection_id):
        storage = cls.storage()
        members = storage.library.member_ids(collection_id)
        if not members:
            raise StorageError("COLLECTION_EMPTY")
        return [storage.assets.resolve_asset(asset_id) for asset_id in members]

    @classmethod
    def fingerprint_inputs(cls, collection_id):
        try:
            return [(str(path), fingerprint(source_stat(path))) for path in cls._paths(collection_id)]
        except StorageError:
            return float("nan")

    @classmethod
    def execute(cls, collection_id):
        return io.NodeOutput([str(path) for path in cls._paths(collection_id)])
