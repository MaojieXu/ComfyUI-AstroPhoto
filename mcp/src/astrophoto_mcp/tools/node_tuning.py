"""Tools for an Agent to look, try one candidate, and look again."""

from typing import Annotated, Literal
from uuid import UUID

from fastmcp.exceptions import ToolError
from fastmcp.tools import ToolResult
from mcp.types import ImageContent, TextContent
from pydantic import Field

from .canvas import NodeId, Scalar
from .workflow import READ, WRITE

Parameters = Annotated[dict[str, Scalar], Field(min_length=1, max_length=32)]


def register_node_tools(server, api, dispatch):
    def target(session_id, target_id, node_id):
        return {"session_id": str(session_id), "target_id": str(target_id), "node_id": node_id}

    async def action(name, **values):
        return await api.canvas_request("POST", f"node/{name}",
            body={key: str(value) if isinstance(value, UUID) else value for key, value in values.items()
                  if value is not None})

    @server.tool(annotations=READ)
    async def node_inspect(session_id: UUID, target_id: UUID, node_id: NodeId) -> dict:
        """Read current parameters, available input reference, and any verified current result."""
        return await dispatch(session_id, {"action": "node_inspect", "target_id": str(target_id), "node_id": node_id})

    @server.tool(annotations=WRITE)
    async def node_preview(session_id: UUID, target_id: UUID, node_id: NodeId, expected_revision: UUID,
                           input_ref: UUID, parameters: Parameters, request_id: UUID) -> dict:
        """Try one parameter set on the inspected input without editing the workflow."""
        return await action("preview", **target(session_id, target_id, node_id), expected_revision=expected_revision,
                            input_ref=input_ref, parameters=parameters, request_id=request_id)

    @server.tool(annotations=READ)
    async def node_preview_status(preview_id: UUID | None = None, request_id: UUID | None = None) -> dict:
        """Read the processing state and effective parameters of one temporary preview."""
        if (preview_id is None) == (request_id is None):
            raise ToolError("INVALID_REQUEST: supply exactly one preview_id or request_id")
        return await action("status", preview_id=preview_id, request_id=request_id)

    @server.tool(annotations=READ)
    async def node_compare(session_id: UUID, target_id: UUID, node_id: NodeId, input_ref: UUID,
                           preview_id: UUID | None = None, reference: Literal["input", "current"] = "input",
                           view: Literal["full", "center", "tl", "tr", "bl", "br"] = "full") -> ToolResult:
        """View the original and current result, or compare one preview using the same view."""
        result = await action("compare", **target(session_id, target_id, node_id), input_ref=input_ref,
                              preview_id=preview_id, reference=reference, view=view)
        images = result.pop("images")
        content = []
        for item in images:
            content.extend([TextContent(type="text", text=item["side"]),
                            ImageContent(type="image", data=item.pop("data"), mimeType="image/png")])
        return ToolResult(content=content, structured_content={**result, "images": images})

    @server.tool(annotations=READ)
    async def node_preview_list(session_id: UUID, target_id: UUID, node_id: NodeId,
                                limit: Annotated[int, Field(ge=1, le=50)] = 10) -> dict:
        """List recent previews from this specific node instance."""
        return await action("list", **target(session_id, target_id, node_id), limit=limit)

    @server.tool(annotations={**WRITE, "destructiveHint": True})
    async def node_preview_discard(preview_id: UUID) -> dict:
        """Remove an ended temporary preview and its cached views."""
        return await action("discard", preview_id=preview_id)
