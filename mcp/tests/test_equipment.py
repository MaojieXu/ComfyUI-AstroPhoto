import asyncio
import json
import os
import sys

import httpx
import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

from astrophoto_mcp.server import create_server
from mcp.types import Tool


async def business_tools(client):
    categories = (await client.call_tool('list_tool_categories', {})).data['categories']
    pages = [await client.call_tool('list_category_tools', {'category': c['name']}) for c in categories]
    return [Tool.model_validate(item) for page in pages for item in page.data['tools']]

URL = "http://127.0.0.1:8188"
TOKEN = "test-only-" + "a" * 45
ID = "11111111-1111-4111-8111-111111111111"
EQUIPMENT = {"id": ID, "equipment_type": "camera", "name": "Camera", "product_name": "Canon",
             "notes": None, "archived_at_utc": None, "row_version": 1}
EXPECTED = {"equipment_list", "equipment_get", "optical_train_list", "optical_train_get",
            }


def test_read_tools_schema_permissions_and_adapter(monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", TOKEN)

    def mock(request):
        assert request.headers["X-AstroPhoto-Agent"] == "1"
        assert "X-AstroPhoto-Local" not in request.headers and request.method == "GET"
        assert request.url.path == "/astrophoto/v1/equipment"
        assert request.url.params["type"] == "camera" and request.url.params["archived"] == "all"
        return httpx.Response(200, json={"items": [EQUIPMENT], "next": None, "total": 1})

    async def exercise():
        async with Client(create_server(URL, transport=httpx.MockTransport(mock))) as client:
            tools = {tool.name: tool for tool in await business_tools(client)}
            assert EXPECTED | {"version", "connection_status", "equipment_create", "equipment_delete"} <= set(tools)
            assert tools["equipment_get"].input_schema["required"] == ["name"]
            assert tools["equipment_get"].annotations.read_only_hint
            result = await client.call_tool("equipment_list", {"equipment_type": "camera", "archive_filter": "all"})
            assert not result.is_error
            assert json.loads(result.content[0].text)["items"][0]["name"] == "Camera"

    asyncio.run(exercise())


@pytest.mark.parametrize("url,token", [("http://localhost:8188", TOKEN), ("http://192.0.2.1", TOKEN),
                                        (URL + "/proxy", TOKEN), (URL, "short"), (URL, "")])
def test_missing_credential_or_nondirect_host_keeps_base_tools(monkeypatch, url, token):
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", token)

    async def exercise():
        async with Client(create_server(url)) as client:
            names = {tool.name for tool in await business_tools(client)}
            if url in (URL, "http://localhost:8188"):
                assert EXPECTED <= names
            else:
                assert names == {"version", "connection_status"}

    asyncio.run(exercise())


@pytest.mark.parametrize("failure", ["403", "404", "500", "503", "timeout", "bad-json", "bad-shape", "redirect"])
def test_invalid_or_denied_backend_is_mcp_error(monkeypatch, failure):
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", TOKEN)

    def mock(request):
        if failure == "timeout":
            raise httpx.ReadTimeout("timeout", request=request)
        if failure == "bad-json":
            return httpx.Response(200, text="bad")
        if failure == "bad-shape":
            return httpx.Response(200, json={"items": []})
        if failure == "redirect":
            return httpx.Response(302, headers={"Location": "https://example.invalid"})
        return httpx.Response(int(failure), json={"error": {"code": "TEST_ERROR"}})

    async def exercise():
        async with Client(create_server(URL, transport=httpx.MockTransport(mock))) as client:
            result = await client.call_tool("equipment_get", {"name": "Camera"}, raise_on_error=False)
            assert result.is_error and TOKEN not in result.content[0].text

    asyncio.run(exercise())


def test_opted_in_stdio_lists_read_only_tools():
    async def exercise():
        transport = StdioTransport(command=sys.executable, args=["-m", "astrophoto_mcp"], env={
            **os.environ, "COMFYUI_URL": URL, "ASTROPHOTO_EQUIPMENT_READ_TOKEN": TOKEN,
        })
        async with Client(transport, mode="legacy") as client:
            assert EXPECTED | {"version", "connection_status"} <= {tool.name for tool in await business_tools(client)}
            result = await client.call_tool("version", {})
            assert not result.is_error

    asyncio.run(exercise())


def test_validation_reasons_reach_the_agent_without_leaking_credentials(monkeypatch):
    write_token = "test-only-" + "w" * 45
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", TOKEN)
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_WRITE_TOKEN", write_token)

    def mock(request):
        assert request.headers["X-AstroPhoto-Agent"] == "1"
        assert request.url.path == "/astrophoto/v1/equipment"
        return httpx.Response(422, json={"error": {
            "code": "EQUIPMENT_VALIDATION_FAILED",
            "details": {"fields": {"name": "duplicate", "notes": f"secret {write_token}"}},
        }})

    async def exercise():
        async with Client(create_server(URL, transport=httpx.MockTransport(mock))) as client:
            result = await client.call_tool("equipment_create", {
                "equipment_type": "camera", "name": "Camera", "product_name": "Canon",
            }, raise_on_error=False)
            assert result.is_error
            text = result.content[0].text
            assert "NAME_ALREADY_EXISTS" in text and "name=duplicate" in text
            assert write_token not in text

    asyncio.run(exercise())
