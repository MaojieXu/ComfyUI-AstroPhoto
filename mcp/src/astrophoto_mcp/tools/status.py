"""Current status tools; no planned capabilities are advertised."""

import httpx
from fastmcp import FastMCP
from fastmcp.tools import ToolResult

from .. import __version__
from ..client import diagnose
from ..target import LocalTarget


def register_status(mcp: FastMCP, base_url: str | LocalTarget, *, transport: httpx.AsyncBaseTransport | None = None) -> None:
    @mcp.tool(output_schema={
        "additionalProperties": {"type": "string"}, "title": "versionDictOutput", "type": "object",
    })
    def version() -> dict[str, str]:
        """Return the installed MCP package version (not the remote extension version)."""
        return {"name": "astrophoto-mcp", "version": __version__}

    @mcp.tool(output_schema={"type": "object", "additionalProperties": True})
    async def connection_status() -> ToolResult:
        """Report the configured endpoint or discover local AstroPhoto instances and their selection state."""
        if isinstance(base_url, LocalTarget):
            candidates = await base_url.discover()
            target = base_url.selected
            if base_url.selected_identity is None and len(candidates) == 1:
                target = candidates[0]
            if target:
                state = "ready"
            elif base_url.selected_identity is not None:
                state = "selected_instance_unavailable"
            elif candidates:
                state = "selection_required"
            else:
                state = "no_candidates"
            return ToolResult(structured_content={
                "source": "auto", "address": target, "candidates": candidates, "connection_state": state,
                "instances": [{"address": url, "data_home": base_url.data_homes[url]} for url in candidates],
                "reachable": any(base_url.health.values()), "extension_registered": bool(candidates),
            })
        result = await diagnose(base_url, transport=transport)
        result.update(source="manual", address=base_url)
        if base_url.startswith(("http://127.", "http://[::1]", "http://localhost")):
            result["astrophoto_loaded"] = await LocalTarget(transport).probe(base_url, require_management=False)
        return ToolResult(structured_content=result)

    if isinstance(base_url, LocalTarget):
        @mcp.tool
        async def connection_select(url: str) -> dict:
            """Select a discovered local instance when more than one is available."""
            return {"address": await base_url.select(url)}
