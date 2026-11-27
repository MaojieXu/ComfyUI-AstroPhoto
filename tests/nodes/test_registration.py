import asyncio
from collections import Counter


def test_v3_registration_and_definition(extension):
    module = extension.module
    assert not hasattr(module, "NODE_CLASS_MAPPINGS")
    plugin = asyncio.run(module.comfy_entrypoint())
    classes = asyncio.run(plugin.get_node_list())
    assert classes == asyncio.run(plugin.get_node_list())
    by_id = {node.define_schema().node_id: node for node in classes}
    assert len(by_id) == len(classes)
    native = {node_id for node_id in by_id if not node_id.startswith("AstroPhotoSiril")}
    assert native == {"vue-basic", "AstroPhotoFileSource", "AstroPhotoFolderSource", "AstroPhotoAggregate"}
    from extension.siril.command_presentation import PRESENTATION, SEQUENCE_VARIANTS
    from extension.siril.commands import COMMANDS

    from scripts.siril_locales import sync

    assert sync(check=True)
    assert COMMANDS.keys() == PRESENTATION.keys()
    catalogue = [command.describe() for command in COMMANDS.values()]
    assert all(row["title_zh"] and row["description_zh"] and row["description"] != row["usage"] for row in catalogue)
    generated = {node_id for node_id in by_id if node_id.startswith("AstroPhotoSiril")}
    assert len(COMMANDS) == 201
    assert len(generated) == 183
    assert generated == {command.node_id for command in COMMANDS.values() if command.scriptable}
    definitions = {node_id: by_id[node_id].define_schema() for node_id in generated}
    prefix = "AstroPhoto/Siril/"
    assert Counter(schema.category.removeprefix(prefix) for schema in definitions.values()) == {
        "Files, Sequences and Metadata": 25,
        "Sensor Correction": 13,
        "Geometry and Resampling": 11,
        "Image Registration": 4,
        "Image Stacking": 5,
        "Tone and Contrast": 20,
        "Color and Channels/Color Calibration": 5,
        "Color and Channels/Color Management": 3,
        "Color and Channels/Color Adjustments": 2,
        "Color and Channels/Channel Management": 12,
        "Background Extraction and Gradient Correction": 2,
        "Artifact Correction": 3,
        "Convolution and Sharpening": 3,
        "Deconvolution": 7,
        "Noise Reduction": 3,
        "Multiscale Processing": 3,
        "Feature Detection and Processing": 7,
        "Pixel and Frequency-Domain Operations": 17,
        "Image Measurement and Analysis": 15,
        "Coordinate Calibration and Reference Data": 7,
        "Runtime and Session": 16,
    }
    assert all(schema.category.startswith("AstroPhoto/Siril/") and not schema.display_name.startswith("Siril ·")
               for schema in definitions.values())
    for row in catalogue:
        if row["scriptable"]:
            schema = definitions[row["node_id"]]
            assert schema.category == row["category"]
            assert schema.search_aliases == row["search_aliases"]
            assert row["id"] in schema.search_aliases and row["title_zh"] in schema.search_aliases
        else:
            assert row["node_id"] is None and row["category"].startswith(prefix)
    for variant, base in SEQUENCE_VARIANTS.items():
        assert COMMANDS[variant].category == COMMANDS[base].category
    assert definitions[COMMANDS["crop"].node_id].description.startswith("Keep a rectangular region")
    assert "去梯度" in COMMANDS["seqsubsky"].search_aliases
    for name in ("crop", "load", "calibrate", "pyscript"):
        assert by_id[COMMANDS[name].node_id].define_schema().outputs[0].io_type == "IMAGE_PATH"

    file = by_id["AstroPhotoFileSource"].define_schema()
    folder = by_id["AstroPhotoFolderSource"].define_schema()
    aggregate = by_id["AstroPhotoAggregate"].define_schema()
    assert file.outputs[0].io_type == "IMAGE_PATH"
    assert folder.outputs[0].io_type == aggregate.outputs[0].io_type == "FOLDER_PATH"
    assert file.outputs[1].io_type == folder.outputs[1].io_type == "ASTRO_FILE_ITEMS"
    schema = by_id["vue-basic"].define_schema()
    assert schema.node_id == "vue-basic"
    assert schema.display_name == "Vue Basic"
    assert schema.category == "examples"
    assert [(i.id, i.io_type) for i in schema.inputs] == [("custom_vue_component_basic", "CUSTOM_VUE_COMPONENT_BASIC")]
    assert [(o.io_type, o.display_name) for o in schema.outputs] == [("IMAGE", "image")]
    assert (extension.root / module.WEB_DIRECTORY / "main.js").is_file()
