"""Install an MCP wheel or PyPI requirement in a disposable environment and probe stdio."""

import argparse
import asyncio
import json
from pathlib import Path
import subprocess
import sys
import tempfile


async def probe(expected: str) -> None:
    import anyio
    from astrophoto_mcp import __version__
    from fastmcp import Client
    from fastmcp.client.transports import StdioTransport

    if __version__ != expected:
        raise RuntimeError(f"Installed {__version__}, expected {expected}")
    with anyio.fail_after(30):
        transport = StdioTransport(command=sys.executable, args=["-I", "-m", "astrophoto_mcp"])
        async with Client(transport, mode="legacy", auto_initialize=False) as client:
            await client.initialize()
            tools = await client.list_tools()
            if {tool.name for tool in tools} != {"list_tool_categories", "list_category_tools", "call_tool"}:
                raise RuntimeError("Unexpected tool contract")
            result = await client.call_tool("version", {})
            if result.is_error or json.loads(result.content[0].text)["version"] != expected:
                raise RuntimeError("Installed stdio server returned an invalid version")
    print(f"Independent install + stdio handshake/tool call passed: {expected}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("requirement", help="Wheel path or astrophoto-mcp==X.Y.Z")
    parser.add_argument("--version", required=True)
    parser.add_argument("--probe", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.probe:
        asyncio.run(probe(args.version))
        return
    requirement = str(Path(args.requirement).resolve()) if Path(args.requirement).is_file() else args.requirement
    with tempfile.TemporaryDirectory(prefix="astrophoto-install-") as temp:
        venv = Path(temp) / "venv"
        subprocess.run(["uv", "venv", str(venv), "--python", sys.executable], check=True)
        python = venv / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
        # An explicit index and isolated environment ensure PyPI verification
        # cannot silently use the editable workspace member or an extra index.
        subprocess.run(["uv", "pip", "install", "--no-config", "--no-cache", "--python", str(python),
                        "--index-url", "https://pypi.org/simple", requirement], check=True, cwd=temp)
        subprocess.run([str(python), "-I", str(Path(__file__).resolve()), requirement,
                        "--version", args.version, "--probe"], check=True, cwd=temp, timeout=45)


if __name__ == "__main__":
    main()
