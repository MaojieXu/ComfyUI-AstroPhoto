"""Current status tools; no planned capabilities are advertised."""

import secrets
import time

import httpx
from fastmcp import Context, FastMCP
from fastmcp.exceptions import ToolError
from fastmcp.tools import ToolResult

from .. import __version__
from ..client import diagnose
from ..target import LocalTarget
from .session_state import get_state, set_state


def register_status(mcp: FastMCP, base_url: str | LocalTarget, *, transport: httpx.AsyncBaseTransport | None = None) -> None:
    @mcp.tool(output_schema={
        "additionalProperties": {"type": "string"}, "title": "versionDictOutput", "type": "object",
    })
    def version() -> dict[str, str]:
        """Return the installed MCP package version (not the remote extension version)."""
        return {"name": "astrophoto-mcp", "version": __version__}

    @mcp.tool(output_schema={"type": "object", "additionalProperties": True})
    async def connection_status(ctx: Context) -> ToolResult:
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
            selections = {}
            instances = []
            for url in candidates:
                code = secrets.token_hex(4).upper()
                while code in selections:
                    code = secrets.token_hex(4).upper()
                selections[code] = base_url.identities[url]
                instances.append({"selection": code, "address": url, "data_home": base_url.data_homes[url]})
            selection_available = True
            try:
                await set_state(ctx, "astrophoto:connection:selections", {
                    "expires": time.time() + 600, "choices": selections,
                })
            except ToolError as exc:
                if not str(exc).startswith("SESSION_SCOPE_UNAVAILABLE:"):
                    raise
                selection_available = False
                instances = [{key: value for key, value in item.items() if key != "selection"} for item in instances]
            return ToolResult(structured_content={
                "source": "auto", "address": target, "candidates": candidates, "connection_state": state,
                "instances": instances, "selection_available": selection_available,
                "reachable": any(base_url.health.values()), "extension_registered": bool(candidates),
            })
        result = await diagnose(base_url, transport=transport)
        result.update(source="manual", address=base_url)
        if base_url.startswith(("http://127.", "http://[::1]", "http://localhost")):
            result["astrophoto_loaded"] = await LocalTarget(transport).probe(base_url, require_management=False)
        return ToolResult(structured_content=result)

    if isinstance(base_url, LocalTarget):
        @mcp.tool
        async def connection_select(selection: str, ctx: Context) -> dict:
            """Select an instance using its selection code from the latest connection_status response."""
            state = await get_state(ctx, "astrophoto:connection:selections")
            choices = state.get("choices") if isinstance(state, dict) and state.get("expires", 0) > time.time() else None
            identity = choices.get(selection) if isinstance(choices, dict) else None
            if not identity:
                raise ToolError("INVALID_SELECTION: call connection_status and use its current selection code")
            return {"address": await base_url.select_identity(identity)}
