import asyncio
import json
import os
import sys
import subprocess
from pathlib import Path

import anyio
import httpx
import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

from astrophoto_mcp import __version__
from astrophoto_mcp.server import create_server
from astrophoto_mcp.tools.status import register_status


@pytest.mark.parametrize("mode", ["auto", "legacy"])
def test_registered_tool_schemas(server, mode):
    original = json.loads((Path(__file__).parent / "fixtures/status_contract.json").read_text(encoding="utf-8"))

    async def exercise():
        async with Client(server, mode=mode) as client:
            tools = await client.list_tools()
            assert {tool.name for tool in tools} == set(original)
            for tool in tools:
                # v4 drops cosmetic argument titles and explicitly forbids extra
                # properties. The established no-argument interface is unchanged.
                expected = dict(original[tool.name]["inputSchema"])
                expected.pop("title")
                expected["additionalProperties"] = False
                assert tool.input_schema == expected
                assert tool.output_schema == original[tool.name]["outputSchema"]
            assert await client.list_resources() == []  # no business Skills yet
    asyncio.run(exercise())


def test_duplicate_registration_fails(server):
    with pytest.raises(ValueError):
        register_status(server, "http://127.0.0.1:8188")


def test_in_memory_status_contract():
    def handler(request):
        data = {"system": {"os": "test"}} if request.url.path.endswith("system_stats") else {"vue-basic": {}}
        return httpx.Response(200, json=data)

    async def exercise():
        server = create_server("http://comfy.test/proxy", transport=httpx.MockTransport(handler))
        async with Client(server) as client:
            result = await client.call_tool("connection_status", {})
            assert not result.is_error
            assert result.structured_content is None
            assert json.loads(result.content[0].text) == {
                "reachable": True, "extension_registered": True, "system": {"os": "test"},
            }
    asyncio.run(exercise())


@pytest.mark.parametrize("failure", ["404", "500", "disconnect", "timeout", "invalid-json", "wrong-shape"])
def test_diagnostic_failures_are_mcp_errors(failure):
    def handler(request):
        if failure == "disconnect":
            raise httpx.ConnectError("disconnected", request=request)
        if failure == "timeout":
            raise httpx.ReadTimeout("timed out", request=request)
        if failure == "invalid-json":
            return httpx.Response(200, text="not JSON")
        if failure == "wrong-shape":
            return httpx.Response(200, json=[])
        return httpx.Response(int(failure))

    async def exercise():
        async with Client(create_server("http://comfy.test", transport=httpx.MockTransport(handler))) as client:
            result = await client.call_tool("connection_status", {}, raise_on_error=False)
            assert result.is_error
            assert result.structured_content is None
    asyncio.run(exercise())


def test_invalid_packaged_skill_fails_startup(monkeypatch, tmp_path):
    import astrophoto_mcp.server as module

    skill = tmp_path / "broken"
    skill.mkdir()
    (skill / "SKILL.md").write_text("missing frontmatter", encoding="utf-8")
    monkeypatch.setattr(module, "SKILLS_DIRECTORY", tmp_path)
    with pytest.raises(ValueError):
        module.create_server("http://comfy.test")


def test_stdio_initialize_list_and_call():
    async def exercise():
        with anyio.fail_after(30):
            transport = StdioTransport(command=sys.executable, args=["-m", "astrophoto_mcp"], env=dict(os.environ))
            async with Client(transport, mode="legacy", auto_initialize=False) as client:
                initialized = await client.initialize()
                assert initialized.server_info.name == "ComfyUI AstroPhoto"
                tools = await client.list_tools()
                assert {tool.name for tool in tools} == {"version", "connection_status"}
                result = await client.call_tool("version", {})
                assert not result.is_error
                assert json.loads(result.content[0].text)["version"] == __version__
    asyncio.run(exercise())


def test_stdio_stdout_contains_only_protocol_json():
    """Unlike SDK clients which may tolerate stray lines, reject stdout noise."""
    async def exercise():
        process = await asyncio.create_subprocess_exec(
            sys.executable, "-m", "astrophoto_mcp",
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
        )

        async def send(message):
            process.stdin.write((json.dumps({"jsonrpc": "2.0", **message}) + "\n").encode())
            await process.stdin.drain()

        async def response(request_id):
            while True:
                line = await process.stdout.readline()
                assert line, "stdio server closed before responding"
                message = json.loads(line)  # banners/log lines must fail here
                assert message["jsonrpc"] == "2.0"
                if message.get("id") == request_id:
                    assert "error" not in message
                    return message["result"]

        try:
            with anyio.fail_after(30):
                await send({"id": 1, "method": "initialize", "params": {
                    "protocolVersion": "2025-11-25", "capabilities": {},
                    "clientInfo": {"name": "stdout-contract-test", "version": "1"},
                }})
                assert (await response(1))["serverInfo"]["name"] == "ComfyUI AstroPhoto"
                await send({"method": "notifications/initialized"})
                await send({"id": 2, "method": "tools/list", "params": {}})
                assert {tool["name"] for tool in (await response(2))["tools"]} == {"version", "connection_status"}
                await send({"id": 3, "method": "tools/call", "params": {"name": "version", "arguments": {}}})
                assert (await response(3))["structuredContent"] == {"name": "astrophoto-mcp", "version": __version__}
                process.stdin.close()
                await process.wait()
                for line in (await process.stdout.read()).splitlines():
                    assert json.loads(line)["jsonrpc"] == "2.0"
                assert process.returncode == 0
        finally:
            if process.returncode is None:
                process.kill()
                await process.wait()
    asyncio.run(exercise())
