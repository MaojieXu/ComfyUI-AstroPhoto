"""Plan mixed local selections and request trusted chat approval one group at a time."""

import json
from typing import Annotated

from fastmcp.exceptions import ToolError
from fastmcp.server.context import Context
from fastmcp.server.dependencies import CurrentContext
from mcp_types import InputRequiredResult
from pydantic import BaseModel, ConfigDict, Field

from ..api.equipment import canonical_id
from .chat_approval import confirm_chat


class ImportItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    path: str
    project_id: str | None = None
    attributes: dict[str, object] | None = None
    camera_name: str | None = None
    optical_train_name: str | None = None
    master_ids: list[str] | None = None

    def request_data(self):
        data = self.model_dump(exclude_none=True)
        if "project_id" in self.model_fields_set:
            data["project_id"] = self.project_id
        return data


def confirmation_summary(proposal):
    group = proposal["group"]
    sources = group["sources"]
    preview = group["preview"]
    summary = {
        "proposal_id": proposal["id"],
        "digest": proposal["digest"],
        "file_count": len(sources),
        "first_paths": sources[:8],
        "project_id": group.get("project_id"),
        "project_name": group.get("project_name"),
        "attributes": group["attributes"],
        "camera_name": group.get("camera_name"),
        "optical_train_name": group.get("optical_train_name"),
        "calibration": group.get("calibration"),
        "calibration_differences": (group.get("calibration") or {}).get("differences"),
        "calibration_masters": group.get("master_labels"),
        "bindings": group.get("binding"),
        "configuration_gaps": group.get("configuration_gaps"),
        "import_mode": preview["effective_import_mode"],
        "workspace_id": preview.get("workspace_id"),
        "workspace_name": preview.get("workspace_name"),
    }
    return ("Approve or reject this AstroPhoto import group. The proposal status tool shows the complete file list. "
            "Approval imports the files and applies the listed bindings, without running calibration.\n"
            + json.dumps(summary, ensure_ascii=False, indent=2))


def register_agent_import_tools(server, api, approver=None):
    @server.tool(annotations={"readOnlyHint": True, "openWorldHint": False})
    async def library_plan_mixed_import(
        items: Annotated[list[ImportItem], Field(min_length=1, max_length=1000)], auto_calibration: bool = True,
    ) -> dict:
        """Plan explicitly selected host files. Show resolved groups and ask about unresolved items before proposing."""
        return await api.request("POST", "agent-imports/plan", result="agent_plan", body={
            "items": [item.request_data() for item in items], "auto_calibration": auto_calibration,
        })

    @server.tool(annotations={"readOnlyHint": False, "openWorldHint": False, "destructiveHint": False})
    async def library_propose_import_group(plan_id: str, group_id: str) -> dict:
        """Create or fetch a pending proposal for exactly one planned group. Does not import any files."""
        return await api.request("POST", "agent-imports", result="agent_proposal", body={
            "plan_id": canonical_id(plan_id), "group_id": canonical_id(group_id),
        })

    @server.tool(annotations={"readOnlyHint": True, "openWorldHint": False})
    async def library_import_group_status(approval_id: str) -> dict:
        """Read one proposed group's scope and execution receipt, including outstanding bindings."""
        return await api.request("GET", f"agent-imports/{canonical_id(approval_id)}", result="agent_proposal")

    @server.tool(annotations={"readOnlyHint": False, "openWorldHint": False, "destructiveHint": False})
    async def library_retry_group_bindings(approval_id: str) -> dict:
        """Retry only unfinished bindings under the original approval. Does not import files again."""
        return await api.request("POST", f"agent-imports/{canonical_id(approval_id)}/retry-bindings",
                                 result="agent_proposal", body={})

    if approver is None:
        return

    @server.tool(annotations={"readOnlyHint": False, "openWorldHint": False, "destructiveHint": False})
    async def library_confirm_import_group(approval_id: str, ctx: Context = CurrentContext()) -> dict | InputRequiredResult:
        """Show the immutable group to the human in the chat and submit their approval or rejection."""
        route = f"agent-imports/{canonical_id(approval_id)}"
        proposal = await api.request("GET", route, result="agent_proposal")
        if proposal["id"] != approval_id:
            raise ToolError("INVALID_RESPONSE: Unexpected proposal identifier")
        if proposal["status"] != "pending":
            return proposal
        outcome = await confirm_chat(ctx, confirmation_summary(proposal))
        if isinstance(outcome, InputRequiredResult):
            return outcome
        if outcome == "cancelled":
            return proposal
        return await approver.request("POST", f"{route}/decision", result="agent_proposal", body={
            "digest": proposal["digest"], "decision": "approved" if outcome == "accepted" else "denied",
        })
