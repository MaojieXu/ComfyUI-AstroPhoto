"""ComfyUI file sources and workflow-scoped file aggregation."""

from uuid import UUID

from comfy_api.latest import io

from ..astrophoto.core.errors import StorageError
from ..astrophoto.storage.manager import source_stat
from ..astrophoto.storage.paths import canonicalize_root, checked_path

ImagePath = io.Custom("IMAGE_PATH")
FolderPath = io.Custom("FOLDER_PATH")
FileItems = io.Custom("ASTRO_FILE_ITEMS")


class ScientificNode:
    runtime = None

    @classmethod
    def storage(cls):
        if cls.runtime is None or cls.runtime.storage is None:
            raise StorageError("STORAGE_UNAVAILABLE")
        if not cls.runtime.trusted_local:
            raise StorageError("UNAUTHORIZED_STORAGE_OPERATION")
        return cls.runtime.storage

    @classmethod
    def fingerprint_inputs(cls, **_inputs):
        # Re-resolve source locations and never reuse prompt-scoped work folders.
        return float("nan")


def asset_id(value):
    try:
        return str(UUID(value))
    except (AttributeError, TypeError, ValueError):
        return None


class AstroPhotoFileSource(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoFileSource", display_name="Select File", category="AstroPhoto/Assets",
            description="Provide a host file path from a local file or a registered asset.",
            inputs=[io.Custom("ASTRO_FILE_SOURCE").Input("source", display_name="File")],
            outputs=[ImagePath.Output(id="file_path", display_name="File path"),
                     FileItems.Output(id="items", display_name="For collection")],
        )

    @classmethod
    def execute(cls, source):
        storage = cls.storage()
        identifier = asset_id(source)
        path = storage.assets.resolve_asset(identifier) if identifier else checked_path(source)
        source_stat(path)
        try:
            with path.open("rb"):
                pass
        except OSError as exc:
            raise StorageError("SOURCE_UNREADABLE", str(path)) from exc
        return io.NodeOutput(str(path), (str(path),))


class AstroPhotoFolderSource(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoFolderSource", display_name="Folder / Subframe Group", category="AstroPhoto/Assets",
            description="Provide a local folder or the registered members of a subframe group.",
            inputs=[io.Custom("ASTRO_FOLDER_SOURCE").Input("source", display_name="Folder or subframe group")],
            outputs=[FolderPath.Output(id="folder_path", display_name="Folder path"),
                     FileItems.Output(id="items", display_name="For collection")],
        )

    @classmethod
    def execute(cls, source):
        storage = cls.storage()
        identifier = asset_id(source)
        if identifier:
            members = storage.library.member_ids(identifier)
            if not members:
                raise StorageError("COLLECTION_EMPTY")
            paths = tuple(str(storage.assets.resolve_asset(member)) for member in members)
            return io.NodeOutput(io.ExecutionBlocker("Connect the subframe group to Collect Files"), paths)
        path = canonicalize_root(source)
        if not path.is_dir():
            raise StorageError("SOURCE_NOT_FOUND", "Folder not found")
        return io.NodeOutput(str(path), (str(path),))


class AstroPhotoAggregate(ScientificNode, io.ComfyNode):
    @classmethod
    def define_schema(cls):
        return io.Schema(
            node_id="AstroPhotoAggregate", display_name="Collect Files", category="AstroPhoto/Assets",
            description="Copy files and first-level folder contents into one temporary working folder.",
            inputs=[io.Autogrow.Input("items", template=io.Autogrow.TemplatePrefix(
                FileItems.Input("item"), prefix="item", min=1, max=100))],
            outputs=[FolderPath.Output(id="folder_path", display_name="Working folder")],
            not_idempotent=True,
        )

    @classmethod
    def execute(cls, items):
        from comfy.model_management import throw_exception_if_processing_interrupted
        from comfy_api.latest import ComfyAPISync
        from comfy_execution.utils import get_executing_context

        storage = cls.storage()
        context = get_executing_context()
        if context is None:
            raise StorageError("STORAGE_UNAVAILABLE", "Aggregation requires a running ComfyUI prompt")

        entries = [path for key in sorted(items, key=lambda name: int(name.removeprefix("item")))
                   for path in (items[key] or ())]
        api = ComfyAPISync()

        def checkpoint():
            throw_exception_if_processing_interrupted()
            if storage.closing.is_set():
                raise StorageError("OPERATION_CANCELLED")

        path, mapping = storage.aggregation.prepare(
            context.prompt_id, entries, checkpoint, api.execution.set_progress)
        return io.NodeOutput(path, ui={"astrophoto_aggregate_count": [len(mapping)]})


SOURCE_NODES = (AstroPhotoFileSource, AstroPhotoFolderSource, AstroPhotoAggregate)


async def bind_aggregation_lifecycle(storage):
    from comfy_api.latest import ComfyAPI

    api = ComfyAPI()

    class AggregationLifecycle(api.caching.CacheProvider):
        async def on_lookup(self, context):
            return None

        async def on_store(self, context, value):
            pass

        def should_cache(self, context, value=None):
            return False

        def on_prompt_end(self, prompt_id):
            storage.aggregation.finish(prompt_id)

    await api.caching.register_provider(AggregationLifecycle())
