"""FastMCP discovery and schema contracts."""

import asyncio
import os
import sys
import warnings

import httpx
import anyio
import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport
from pydantic.json_schema import PydanticJsonSchemaWarning
from pydantic import ValidationError

from astrophoto_mcp.server import create_server
from astrophoto_mcp.tools.catalog_models import EquipmentBinding
from mcp.types import Tool


async def business_tools(client):
    categories = (await client.call_tool('list_tool_categories', {})).data['categories']
    pages = [await client.call_tool('list_category_tools', {'category': c['name']}) for c in categories]
    return [Tool.model_validate(item) for page in pages for item in page.data['tools']]

UNSAFE_DETAIL = "untrusted message with spaces"
TOOLS = {
    "library_list", "library_get", "library_list_subframes", "library_inspect_folder", "library_import",
    "library_import_status", "library_add_subframes", "library_update", "library_remove", "library_remove_subframe",
    "library_find_calibration", "library_bind_calibration", "library_unbind_calibration", "library_deletion_impact",
    "project_list", "project_get", "project_create", "project_update", "project_delete", "project_create_folders",
    "project_add_assets", "project_update_node", "project_remove_node", "project_impact",
}


def test_filter_state_optional_but_not_nullable():
    assert EquipmentBinding().model_dump(exclude_unset=True) == {}
    assert EquipmentBinding(equipment_group=None).model_dump(exclude_unset=True) == {'equipment_group': None}
    with pytest.raises(ValidationError):
        EquipmentBinding.model_validate({'filter_state': None})


@pytest.mark.parametrize("mode", ["auto", "legacy"])
def test_catalog_tool_discovery(monkeypatch, mode):

    async def exercise():
        with warnings.catch_warnings():
            warnings.simplefilter("error", PydanticJsonSchemaWarning)
            async with Client(create_server("http://127.0.0.1:8188"), mode=mode) as client:
                tools = {tool.name: tool for tool in await business_tools(client)}
                assert TOOLS == {name for name in tools if name.startswith(("library_", "calibration_", "project_"))}
                schema = tools["library_import"].input_schema
                assert schema["properties"]["asset_type"]["enum"] == [
                    "subframe_collection", "video", "master_frame", "image_result"]
                assert "master_type" in schema["properties"]
                assert "source_collection_name" in schema["properties"]
                assert schema["properties"]["source_paths"].get("description")
                assert tools["library_find_calibration"].input_schema["properties"]["master_type"]
                assert list(tools["library_get"].input_schema["properties"]) == ["name"]
                update = tools["library_update"].input_schema
                assert update["required"] == ["name"]
                assert {"type": "null"} in update["properties"]["notes"]["anyOf"]
                assert {"type": "null"} in update["properties"]["source_collection_name"]["anyOf"]
                assert {"type": "null"} in update["properties"]["equipment"]["anyOf"]
                assert "null" not in str(update["properties"]["frame_type"])
                project = tools["project_update"].input_schema
                assert project["required"] == ["project_name"]
                assert {"type": "null"} in project["properties"]["notes"]["anyOf"]
                assert tools["library_get"].annotations.read_only_hint
                assert tools["project_delete"].annotations.destructive_hint
                assert "storage_delete_managed_file" not in tools
                assert tools["library_remove"].annotations.destructive_hint
                add_schema = tools["project_add_assets"].input_schema
                asset_schema = add_schema['properties']['assets']['items']
                assert set(asset_schema['properties']) == {'name', 'alias'}
                assert asset_schema['required'] == ['name']
                assert tools['project_get'].input_schema['properties']['recursive']['type'] == 'boolean'

    asyncio.run(exercise())


def test_tools_require_direct_loopback(monkeypatch):

    async def exercise():
        async with Client(create_server("http://127.0.0.1:8188/proxy")) as client:
            assert TOOLS.isdisjoint(tool.name for tool in await business_tools(client))

    asyncio.run(exercise())


def test_stdio_update_schemas_preserve_optional_and_nullable_fields():
    async def exercise():
        env = dict(os.environ)
        transport = StdioTransport(command=sys.executable, args=['-m', 'astrophoto_mcp'], env=env)
        with anyio.fail_after(30):
            async with Client(transport) as client:
                tools = {tool.name: tool for tool in await business_tools(client)}
                for name, primary in [('library_update', 'name'), ('project_update', 'project_name'),
                                      ('equipment_update', 'name'), ('optical_train_update', 'name')]:
                    schema = tools[name].input_schema
                    assert schema['required'] == [primary]
                    assert {'type': 'null'} in schema['properties']['notes']['anyOf']
                    assert 'null' not in str(schema['properties']['new_name'])
                    result = await client.call_tool(name, {primary: 'test', 'new_name': None}, raise_on_error=False)
                    assert result.is_error
    asyncio.run(exercise())


def test_catalog_errors_exclude_untrusted_message(monkeypatch):

    def handler(request):
        if request.url.path == '/astrophoto/v1/status':
            return httpx.Response(200, json={'extension': {'id': 'ComfyUI_AstroPhoto'},
                'runtime': {'routes_registered': True}, 'data_home': '/test', 'storage_instance_id': 'test-instance',
                'capabilities': {'assets': {'available': True}, 'equipment': {'available': True}}})
        assert request.headers["X-AstroPhoto-Agent"] == "1"
        assert {"x-astrophoto-local", "origin", "sec-fetch-site"}.isdisjoint(request.headers)
        return httpx.Response(403, json={"error": {"code": "UNAUTHORIZED_LIBRARY_OPERATION",
                                                  "message": UNSAFE_DETAIL, "details": {"message": UNSAFE_DETAIL}}})

    async def exercise():
        async with Client(create_server("http://127.0.0.1:8188", transport=httpx.MockTransport(handler))) as client:
            result = await client.call_tool("library_list", {}, raise_on_error=False)
            assert result.is_error
            assert "UNAUTHORIZED_LIBRARY_OPERATION" in result.content[0].text
            assert UNSAFE_DETAIL not in result.content[0].text

    asyncio.run(exercise())


def test_catalog_schema_rejects_invalid_requests_before_http(monkeypatch):

    def handler(request):
        pytest.fail(f"Unexpected request: {request.method} {request.url.path}")

    async def exercise():
        server = create_server("http://127.0.0.1:8188", transport=httpx.MockTransport(handler))
        async with Client(server) as client:
            for tool, args in [
                ("library_list", {"limit": 0}),
                ("library_list", {"limit": 101}),
                ("library_list", {"cursor": "invalid"}),
                ("library_get", {"asset": {"name": "M31", "asset_type": "light"}}),
                ("library_import", {"asset_type": "video", "name": "Jupiter", "source_paths": []}),
                ("project_create_folders", {"project_name": "M31", "paths": ["relative"]}),
                ("library_get", {"asset": {"name": "M31", "asset_type": "video", "extra": True}}),
            ]:
                assert (await client.call_tool(tool, args, raise_on_error=False)).is_error, (tool, args)

    asyncio.run(exercise())
