"""Current status tools; no planned capabilities are advertised."""

import httpx
from fastmcp import FastMCP
from fastmcp.tools import ToolResult

from .. import __version__
from ..client import diagnose


def register_status(mcp: FastMCP, base_url: str, *, transport: httpx.AsyncBaseTransport | None = None) -> None:
    @mcp.tool(output_schema={
        "additionalProperties": {"type": "string"}, "title": "versionDictOutput", "type": "object",
    })
    def version() -> dict[str, str]:
        """Return the installed MCP package version (not the remote extension version)."""
        return {"name": "astrophoto-mcp", "version": __version__}

    @mcp.tool(output_schema=None)
    async def connection_status() -> ToolResult:
        """Check the configured ComfyUI HTTP endpoint and vue-basic registration."""
        # Preserve the old untyped-dict tool's JSON text response with no
        # outputSchema or structuredContent. Let FastMCP serialize the content.
        return ToolResult(content=await diagnose(base_url, transport=transport))
