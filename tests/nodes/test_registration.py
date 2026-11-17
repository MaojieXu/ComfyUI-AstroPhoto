import asyncio


def test_v3_registration_and_definition(extension):
    module = extension.module
    assert not hasattr(module, "NODE_CLASS_MAPPINGS")
    plugin = asyncio.run(module.comfy_entrypoint())
    classes = asyncio.run(plugin.get_node_list())
    assert len(classes) == 1
    schema = classes[0].define_schema()
    assert schema.node_id == "vue-basic"
    assert schema.display_name == "Vue Basic"
    assert schema.category == "examples"
    assert [(i.id, i.io_type) for i in schema.inputs] == [("custom_vue_component_basic", "CUSTOM_VUE_COMPONENT_BASIC")]
    assert [(o.io_type, o.display_name) for o in schema.outputs] == [("IMAGE", "image")]
    assert (extension.root / module.WEB_DIRECTORY / "main.js").is_file()
