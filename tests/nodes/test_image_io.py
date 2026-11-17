import asyncio
import pytest

def test_load_image_delegation_and_output(extension):
    cls = asyncio.run(asyncio.run(extension.module.comfy_entrypoint()).get_node_list())[0]
    result = cls.execute(custom_vue_component_basic={"image": "threed/drawing.png [temp]"})
    assert result.result == (extension.host.image,)
    assert result.result[0] is extension.host.image
    assert extension.host.calls == [
        ("resolve", "threed/drawing.png [temp]"),
        ("load", extension.host.path),
    ]


@pytest.mark.parametrize("value", [None, {}, {"image": None}, {"image": 123}])
def test_invalid_widget_data_rejected_before_host_io(extension, value):
    cls = asyncio.run(asyncio.run(extension.module.comfy_entrypoint()).get_node_list())[0]
    with pytest.raises(ValueError, match="uploaded image path"):
        cls.execute(value)
    assert extension.host.calls == []
