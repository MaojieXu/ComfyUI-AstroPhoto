"""ComfyUI V3 node factory for the Siril command registry."""

from functools import cache

from comfy_api.latest import io

from ...astrophoto.core.errors import StorageError
from ...nodes.scientific import ImagePath, ScientificNode
from .commands import COMMANDS
from .processing import formal_run
from .session import ARGUMENTS_HELP, STEPS_HELP, execute_session, make_step

SirilSteps = io.Custom("SIRIL_STEPS")
SirilDirectory = io.Custom("SIRIL_DIRECTORY")


class SirilNode(ScientificNode, io.ComfyNode):
    @classmethod
    def fingerprint_inputs(cls, **_kwargs):
        # Explicit Queue actions recheck the software, paths and active Workspace.
        return float("nan")


class SirilFITSNode(SirilNode):
    @classmethod
    def define_schema(cls):
        command = cls.command
        fields = []
        for parameter in command.parameters:
            options = dict(display_name=parameter.label, default=parameter.default,
                           tooltip=parameter.help, socketless=True)
            if type(parameter.default) is bool:
                fields.append(io.Boolean.Input(parameter.name, **options))
            else:
                if parameter.minimum is not None:
                    options["min"] = parameter.minimum
                if parameter.maximum is not None:
                    options["max"] = parameter.maximum
                fields.append(io.Float.Input(parameter.name, step=0.01, round=False, **options))
        return io.Schema(
            node_id=command.node_id, display_name=command.title, category=command.category,
            search_aliases=command.search_aliases,
            description=command.description, inputs=[ImagePath.Input("image_path", display_name="FITS path"), *fields],
            outputs=[ImagePath.Output(id="output_path", display_name="Result FITS path")],
            hidden=[io.Hidden.unique_id], is_output_node=True,
        )

    @classmethod
    def execute(cls, image_path, **values):
        from comfy.model_management import throw_exception_if_processing_interrupted
        from server import PromptServer

        storage = cls.storage()
        command = cls.command
        values = {**{parameter.name: parameter.default for parameter in command.parameters}, **values}
        provenance = {"node_id": cls.hidden.unique_id}
        metadata = cls.hidden.extra_pnginfo
        workflow = metadata.get("workflow") if isinstance(metadata, dict) else None
        workflow_id = workflow.get("id") if isinstance(workflow, dict) else None
        if isinstance(workflow_id, str) and 0 < len(workflow_id) <= 128:
            provenance["workflow_id"] = workflow_id

        def event(data):
            server = PromptServer.instance
            if server.client_id:
                server.send_sync("astrophoto:siril", {"node": cls.hidden.unique_id, **data}, server.client_id)

        try:
            output, output_id, source_id = formal_run(
                storage, cls.runtime.processing_bundle.software, image_path, values,
                throw_exception_if_processing_interrupted, event, provenance=provenance, command=command,
            )
        except StorageError as exc:
            event({"state": "failed", "error": exc.code})
            raise
        return io.NodeOutput(str(output), ui={"astrophoto_output": [output_id], "astrophoto_source": [source_id],
                                              "astrophoto_parameters": [values]})


class SirilCommandNode(SirilNode):
    @classmethod
    def define_schema(cls):
        command = cls.command
        inputs = [
            io.String.Input("arguments", display_name="Arguments", default="[]", multiline=True, tooltip=ARGUMENTS_HELP),
            io.Boolean.Input("stage_only", display_name="Stage only", default=False, tooltip=STEPS_HELP),
        ]
        if "image" in command.requires:
            inputs.append(ImagePath.Input("image_path", display_name="Image path", optional=True, tooltip="Load this image before the command."))
        inputs.extend((
            ImagePath.Input("file_path", display_name="File path", optional=True, tooltip="Stage a file and refer to it as {input} in arguments."),
            SirilDirectory.Input("directory_path", display_name="Input directory", optional=True, tooltip="Stage the files from an upstream directory."),
            io.String.Input("source_directory", display_name="Local source directory", default="", optional=True,
                            tooltip="Absolute path to a local input directory, for example a FITS sequence."),
            SirilSteps.Input("previous_steps", display_name="Previous steps", optional=True, tooltip=STEPS_HELP),
        ))
        return io.Schema(
            node_id=command.node_id, display_name=command.title, category=command.category,
            search_aliases=command.search_aliases,
            description=command.description,
            inputs=inputs, outputs=[
                ImagePath.Output(id="output_path", display_name="Result image path"),
                SirilDirectory.Output(id="directory_path", display_name="Result directory"),
                io.String.Output(id="log", display_name="CLI log"),
                SirilSteps.Output(id="steps", display_name="Session steps"),
            ], is_output_node=True,
        )

    @classmethod
    def execute(cls, arguments="[]", stage_only=False, image_path="", file_path="", directory_path="",
                source_directory="", previous_steps=None):
        from comfy.model_management import throw_exception_if_processing_interrupted

        storage = cls.storage()
        if directory_path and source_directory:
            raise StorageError("INVALID_SIRIL_ARGUMENTS", "Specify one input directory")
        step = make_step(cls.command, arguments, image_path, file_path, directory_path or source_directory)
        steps = (*previous_steps, step) if previous_steps else (step,)
        if stage_only:
            return io.NodeOutput("", "", "", steps)
        output, directory, log = execute_session(storage, cls.runtime.processing_bundle.software, steps,
                                                 throw_exception_if_processing_interrupted)
        return io.NodeOutput(output, directory, log, None, ui={"astrophoto_siril_log": [log],
                                                               "astrophoto_siril_directory": [directory],
                                                               "astrophoto_siril_path": [output]})


@cache
def node_types():
    # V3 caches Schema on each concrete class. Reuse the same classes when binding runtime.
    return tuple(
        type(command.node_id, (SirilFITSNode if command.fits_preview else SirilCommandNode,),
             {"command": command, "__module__": __name__})
        for command in COMMANDS.values() if command.scriptable
    )
