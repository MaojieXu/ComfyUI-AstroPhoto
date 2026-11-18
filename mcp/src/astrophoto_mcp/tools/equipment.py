"""Read-only equipment discovery tools."""

from typing import Literal

from fastmcp import FastMCP

from ..api.equipment import EquipmentHTTP, canonical_id, list_params

EquipmentType = Literal["camera", "primary_optics", "optical_accessory", "filter"]
READ = {"readOnlyHint": True, "openWorldHint": False}


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
