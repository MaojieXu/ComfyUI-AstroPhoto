"""Expose current-canvas operations without controlling a browser from MCP."""

import asyncio
from typing import Annotated, Literal
from uuid import UUID, uuid4

from fastmcp.exceptions import ToolError
from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictFloat, StrictInt, StrictStr, model_validator

from .workflow import register_workflow_tools


class Model(BaseModel):
    model_config = ConfigDict(extra="forbid")


NodeId = Annotated[StrictInt, Field(ge=0)]
Alias = Annotated[str, Field(pattern=r"^[a-zA-Z0-9_-]{1,48}$")]
Scalar = StrictBool | StrictInt | StrictFloat | StrictStr


class NodeRef(Model):
    node_id: NodeId | None = None
    ref: Alias | None = None

    @model_validator(mode="after")
    def exactly_one_reference(self):
        if (self.node_id is None) == (self.ref is None):
            raise ValueError("Provide exactly one node_id or ref")
        return self


class Endpoint(NodeRef):
    slot: NodeId


class Add(Model):
    action: Literal["add_node"]
    node_type: Annotated[str, Field(min_length=1, max_length=200)]
    ref: Alias | None = None
    position: tuple[float, float] | None = Field(default=None, description="Coordinates in the graph")


class Update(NodeRef):
    action: Literal["set_parameters"]
    values: Annotated[dict[str, Scalar], Field(min_length=1, max_length=32)]


class Remove(NodeRef):
    action: Literal["remove_node"]


class Connect(Model):
    action: Literal["connect"]
    source: Endpoint = Field(alias="from")
    target: Endpoint = Field(alias="to")
    replace: StrictBool = False


class Disconnect(Endpoint):
    action: Literal["disconnect"]


Command = Annotated[Add | Update | Remove | Connect | Disconnect, Field(discriminator="action")]
Query = Annotated[str, Field(max_length=200)]


def register_canvas_tools(server, api):
    async def request(method, path, body=None):
        return await api.canvas_request(method, path, body=body)

    async def dispatch(session_id, payload, command_id=None):
        return await request("POST", "commands", {
            "session_id": str(session_id), "command_id": str(command_id or uuid4()), "payload": payload,
        })

    async def online_targets():
        sessions = (await request("GET", "sessions")).get("sessions")
        if not isinstance(sessions, list):
            raise ToolError("INVALID_RESPONSE: missing canvas sessions")

        async def inspect(session):
            try:
                return await dispatch(session, {"action": "inspect", "summary": True})
            except ToolError as exc:
                if str(exc).startswith("CANVAS_UNAVAILABLE:"):
                    return {"session_id": session, "state": "rejected", "error": "CANVAS_UNAVAILABLE"}
                raise

        return await asyncio.gather(*(inspect(session) for session in sessions))

    async def select(session_id):
        if session_id is not None:
            return session_id
        targets = await online_targets()
        matches = [row for row in targets if row.get("state") == "completed"]
        uncertain = any(row.get("state") == "unconfirmed" for row in targets)
        if len(matches) > 1 or (matches and uncertain):
            raise ToolError("CANVAS_TARGET_AMBIGUOUS: use canvas_list_sessions and select a session explicitly")
        if len(matches) == 1:
            return matches[0]["session_id"]
        raise ToolError("CANVAS_UNAVAILABLE: open a ComfyUI workflow and retry")

    read = {"readOnlyHint": True, "openWorldHint": False}

    @server.tool(annotations=read)
    async def canvas_list_sessions() -> dict:
        """List connected ComfyUI pages and their current workflow/graph targets."""
        return {"sessions": await online_targets()}

    @server.tool(annotations=read)
    async def canvas_get(session_id: UUID | None = None, target_id: UUID | None = None) -> dict:
        """Read the live graph, including unsaved nodes, widget values, slots and links."""
        return await dispatch(await select(session_id), {
            "action": "inspect", **({"target_id": str(target_id)} if target_id else {}),
        })

    @server.tool(annotations=read)
    async def canvas_find_nodes(
        query: Query = "", node_id: NodeId | None = None, session_id: UUID | None = None, target_id: UUID | None = None,
    ) -> dict:
        """Find instances in the current graph by title, node type or graph-local node ID."""
        payload = {"action": "find", "query": query}
        if node_id is not None:
            payload["node_id"] = node_id
        if target_id is not None:
            payload["target_id"] = str(target_id)
        return await dispatch(await select(session_id), payload)

    @server.tool(annotations=read)
    async def node_search(query: Query, session_id: UUID | None = None, source: Query | None = None) -> dict:
        """Find installed node types. This is separate from searching node instances."""
        return await dispatch(await select(session_id), {"action": "node_search", "query": query,
            **({"source": source} if source is not None else {})})

    @server.tool(annotations=read)
    async def node_describe(node_type: Query, session_id: UUID | None = None) -> dict:
        """Read the host definition for an installed node type."""
        return await dispatch(await select(session_id), {"action": "node_describe", "node_type": node_type})

    @server.tool(annotations={"destructiveHint": True, "openWorldHint": False, "idempotentHint": True})
    async def canvas_apply(
        session_id: UUID, target_id: UUID, expected_revision: UUID,
        command_id: UUID, commands: Annotated[list[Command], Field(min_length=1, max_length=32)] | None = None,
        node_id: NodeId | None = None, preview_id: UUID | None = None,
    ) -> dict:
        """Apply commands, or apply a verified preview using node_id and preview_id. Reuse command_id for retries."""
        payload = {"action": "apply", "target_id": str(target_id), "expected_revision": str(expected_revision)}
        if commands is not None and node_id is None and preview_id is None:
            payload["commands"] = [edit.model_dump(mode="json", by_alias=True, exclude_none=True) for edit in commands]
        elif commands is None and node_id is not None and preview_id is not None:
            payload.update(node_id=node_id, preview_id=str(preview_id))
        else:
            raise ToolError("INVALID_REQUEST: supply commands or both node_id and preview_id")
        return await dispatch(session_id, payload, command_id)

    @server.tool(annotations=read)
    async def canvas_command_status(command_id: UUID) -> dict:
        """Check the receipt before retrying an edit whose outcome is unconfirmed."""
        return await request("GET", f"commands/{command_id}")

    @server.tool(annotations=read)
    async def canvas_list_subgraphs(session_id: UUID, target_id: UUID) -> dict:
        """List the main graph and each subgraph instance without switching the canvas."""
        return await dispatch(session_id, {"action": "canvas_list_subgraphs", "target_id": str(target_id)})

    @server.tool
    async def canvas_open_subgraph(session_id: UUID, target_id: UUID, graph_id: Query, request_id: UUID) -> dict:
        """Open an instance from canvas_list_subgraphs; root returns to the main canvas."""
        return await dispatch(session_id, {"action": "canvas_open_subgraph",
            "target_id": str(target_id), "graph_id": graph_id}, request_id)

    register_workflow_tools(server, api, dispatch, select)
    from .node_tuning import register_node_tools

    register_node_tools(server, api, dispatch)
