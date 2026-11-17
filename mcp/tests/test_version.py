import asyncio
import json
import subprocess
import sys
from fastmcp import Client

from astrophoto_mcp import __version__


def test_module_cli_version():
    result = subprocess.run([sys.executable, "-m", "astrophoto_mcp", "--version"], capture_output=True, text=True, check=True, timeout=20)
    assert result.stdout.strip() == __version__


def test_version_tool_reports_installed_package(server):
    async def exercise():
        async with Client(server) as client:
            result = await client.call_tool("version", {})
            assert result.structured_content == {"name": "astrophoto-mcp", "version": __version__}
            assert result.data == result.structured_content
            assert json.loads(result.content[0].text) == result.structured_content
    asyncio.run(exercise())
