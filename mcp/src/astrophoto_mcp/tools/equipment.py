"""Equipment discovery and separately authorized equipment management."""

from typing import Literal

from fastmcp import Context, FastMCP
from mcp_types import InputRequiredResult

from ..api.equipment import EquipmentHTTP, canonical_id, list_params

EquipmentType = Literal["camera", "primary_optics", "optical_accessory", "filter"]
READ = {"readOnlyHint": True, "openWorldHint": False}
WRITE = {"destructiveHint": False, "openWorldHint": False}
DELETE = {"destructiveHint": True, "idempotentHint": True, "openWorldHint": False}


def register_equipment_tools(server: FastMCP, api: EquipmentHTTP):
    @server.tool(annotations=READ)
    async def equipment_list(equipment_type: EquipmentType | None = None, query: str = "",
                             include_archived: bool = False, cursor: str | None = None, limit: int = 50) -> dict:
        """List the user's AstroPhoto equipment by category, name, manufacturer or model."""
        params = list_params(query, include_archived, cursor, limit, type=equipment_type)
        return await api.get("equipment", "equipment", params=params, collection=True, paged=True)

    @server.tool(annotations=READ)
    async def equipment_get(equipment_id: str) -> dict:
        """Read typed specifications and optical-train references for one device."""
        return await api.get("equipment/" + canonical_id(equipment_id), "equipment")

    @server.tool(annotations=READ)
    async def optical_train_list(query: str = "", include_archived: bool = False,
                                 cursor: str | None = None, limit: int = 50) -> dict:
        """List saved optical trains, their equipment summaries and default revisions."""
        params = list_params(query, include_archived, cursor, limit)
        return await api.get("optical-trains", "train", params=params, collection=True, paged=True)

    @server.tool(annotations=READ)
    async def optical_train_get(train_id: str) -> dict:
        """Read a saved optical train, including its current editable draft and default revision."""
        return await api.get("optical-trains/" + canonical_id(train_id), "train")

    @server.tool(annotations=READ)
    async def optical_train_revision_list(train_id: str) -> dict:
        """List published revision identifiers, timestamps and change notes for one optical train."""
        return await api.get(f"optical-trains/{canonical_id(train_id)}/revisions", "revision", collection=True)

    @server.tool(annotations=READ)
    async def optical_train_revision_get(train_id: str, revision_id: str) -> dict:
        """Read an immutable published optical configuration and its equipment specifications."""
        route = f"optical-trains/{canonical_id(train_id)}/revisions/{canonical_id(revision_id)}"
        return await api.get(route, "revision_detail")


def register_equipment_write_tools(server: FastMCP, api: EquipmentHTTP, *, approval_token=None, read_api=None):
    @server.tool(annotations=WRITE)
    async def equipment_create(equipment_type: EquipmentType, name: str, manufacturer: str | None = None,
                               model: str | None = None, notes: str | None = None, specs: dict | None = None) -> dict:
        """Register a device with optional type-specific specifications."""
        body = {"equipment_type": equipment_type, "name": name}
        for key, value in (("manufacturer", manufacturer), ("model", model), ("notes", notes), ("specs", specs)):
            if value is not None:
                body[key] = value
        return await api.request("POST", "equipment", "equipment", body=body)

    @server.tool(annotations=WRITE)
    async def equipment_update(equipment_id: str, expected_version: int, changes: dict) -> dict:
        """Update editable device fields using the row_version from equipment_get."""
        return await api.request("PATCH", "equipment/" + canonical_id(equipment_id), "equipment",
                                 body={**changes, "expected_version": expected_version})

    @server.tool(annotations=WRITE)
    async def equipment_set_archived(equipment_id: str, expected_version: int, archived: bool) -> dict:
        """Archive or restore a device by ID."""
        action = "archive" if archived else "restore"
        return await api.request("POST", f"equipment/{canonical_id(equipment_id)}/{action}", "equipment",
                                 body={"expected_version": expected_version})

    @server.tool(annotations=WRITE)
    async def optical_train_create(name: str, notes: str | None = None, draft: dict | None = None) -> dict:
        """Create an equipment combination with optional ordered devices."""
        body = {"name": name, "notes": notes}
        if draft is not None:
            body["draft"] = draft
        return await api.request("POST", "optical-trains", "train", body=body)

    @server.tool(annotations=WRITE)
    async def optical_train_update(train_id: str, draft: dict, expected_draft_version: int | None) -> dict:
        """Save the complete editable combination draft and its ordered components."""
        return await api.request("PUT", f"optical-trains/{canonical_id(train_id)}/draft", "draft",
                                 body={"draft": draft, "expected_draft_version": expected_draft_version})

    @server.tool(annotations=WRITE)
    async def optical_train_set_archived(train_id: str, expected_version: int, archived: bool) -> dict:
        """Archive or restore an equipment combination."""
        action = "archive" if archived else "restore"
        return await api.request("POST", f"optical-trains/{canonical_id(train_id)}/{action}", "train",
                                 body={"expected_version": expected_version})

    if approval_token is None:
        return

    async def request_deletion(ctx, path, kind, entity_id, expected_version, description):
        from .chat_approval import confirm_chat

        route = f"{path}/{canonical_id(entity_id)}"
        record = await read_api.get(route, kind) if read_api is not None else None
        name = f'{record["name"]} ({entity_id})' if record else entity_id
        message = f"Delete {description} {name} at version {expected_version}?"
        decision = await confirm_chat(ctx, message)
        if isinstance(decision, InputRequiredResult):
            return decision
        if decision != "accepted":
            return {"id": entity_id, "deleted": False, "status": decision}
        return await api.request("DELETE", route, kind, body={"expected_version": expected_version},
                                 approval_token=approval_token)

    @server.tool(annotations=DELETE)
    async def equipment_delete(equipment_id: str, expected_version: int, ctx: Context) -> dict | InputRequiredResult:
        """Ask the user to confirm deletion. Referenced devices remain protected."""
        return await request_deletion(ctx, "equipment", "equipment", equipment_id, expected_version, "device")

    @server.tool(annotations=DELETE)
    async def optical_train_delete(train_id: str, expected_version: int, ctx: Context) -> dict | InputRequiredResult:
        """Ask the user to confirm deletion. Historical asset references are retained and the name is released."""
        return await request_deletion(ctx, "optical-trains", "train", train_id, expected_version, "equipment combination")
