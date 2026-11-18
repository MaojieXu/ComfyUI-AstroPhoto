import asyncio
import json
import os
import sys

import httpx
import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

from astrophoto_mcp.server import create_server

URL = "http://127.0.0.1:8188"
TOKEN = "test-only-" + "a" * 45
ID = "11111111-1111-4111-8111-111111111111"
EQUIPMENT = {"id": ID, "equipment_type": "camera", "name": "Camera", "row_version": 1, "specs": {}}
EXPECTED = {"equipment_list", "equipment_get", "optical_train_list", "optical_train_get",
            "optical_train_revision_list", "optical_train_revision_get"}


def test_read_tools_schema_permissions_and_adapter(monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", TOKEN)

    def mock(request):
        assert request.headers["Authorization"] == "Bearer " + TOKEN
        assert "X-AstroPhoto-Local" not in request.headers and request.method == "GET"
        assert request.url.path == "/astrophoto/v1/equipment"
        assert request.url.params["type"] == "camera" and request.url.params["archived"] == "all"
        return httpx.Response(200, json={"items": [EQUIPMENT], "next": None})

    async def exercise():
        async with Client(create_server(URL, transport=httpx.MockTransport(mock))) as client:
            tools = {tool.name: tool for tool in await client.list_tools()}
            assert set(tools) == EXPECTED | {"version", "connection_status"}
            assert tools["equipment_get"].input_schema["required"] == ["equipment_id"]
            assert tools["equipment_get"].annotations.read_only_hint
            result = await client.call_tool("equipment_list", {"equipment_type": "camera", "include_archived": True})
            assert not result.is_error
            assert json.loads(result.content[0].text)["items"] == [EQUIPMENT]

    asyncio.run(exercise())


@pytest.mark.parametrize("url,token", [("http://localhost:8188", TOKEN), ("http://192.0.2.1", TOKEN),
                                        (URL + "/proxy", TOKEN), (URL, "short"), (URL, "")])
def test_missing_credential_or_nondirect_host_keeps_diagnostics(monkeypatch, url, token):
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", token)

    async def exercise():
        async with Client(create_server(url)) as client:
            assert {tool.name for tool in await client.list_tools()} == {"version", "connection_status"}

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
            result = await client.call_tool("equipment_get", {"equipment_id": ID}, raise_on_error=False)
            assert result.is_error and TOKEN not in result.content[0].text

    asyncio.run(exercise())


def test_opted_in_stdio_lists_read_only_tools():
    async def exercise():
        transport = StdioTransport(command=sys.executable, args=["-m", "astrophoto_mcp"], env={
            **os.environ, "COMFYUI_URL": URL, "ASTROPHOTO_EQUIPMENT_READ_TOKEN": TOKEN,
        })
        async with Client(transport, mode="legacy") as client:
            assert {tool.name for tool in await client.list_tools()} == EXPECTED | {"version", "connection_status"}
            result = await client.call_tool("version", {})
            assert not result.is_error

    asyncio.run(exercise())
