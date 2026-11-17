"""V3 adapter for the existing drawing widget and host LoadImage node."""

from comfy_api.latest import io


class ComfyUIFEExampleVueBasic(io.ComfyNode):
    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="vue-basic",
            display_name="Vue Basic",
            category="examples",
            inputs=[io.Custom("CUSTOM_VUE_COMPONENT_BASIC").Input("custom_vue_component_basic")],
            outputs=[io.Image.Output(display_name="image")],
        )

    @classmethod
    def execute(cls, custom_vue_component_basic: dict) -> io.NodeOutput:
        if not isinstance(custom_vue_component_basic, dict) or not isinstance(custom_vue_component_basic.get("image"), str):
            raise ValueError("Drawing widget must provide an uploaded image path")
        import folder_paths
        import nodes as host_nodes

        image_path = folder_paths.get_annotated_filepath(custom_vue_component_basic["image"])
        output_image, _mask = host_nodes.LoadImage().load_image(image=image_path)
        return io.NodeOutput(output_image)
