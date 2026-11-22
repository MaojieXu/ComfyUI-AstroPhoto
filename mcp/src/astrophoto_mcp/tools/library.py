"""Opt-in tools for managing a local AstroPhoto asset library."""

from typing import Literal

from fastmcp import FastMCP
from fastmcp.exceptions import ToolError

from ..api.equipment import canonical_id
from ..api.library import LibraryHTTP

LibraryKind = Literal["assets", "projects", "collections", "folders", "sessions", "masters", "assignments", "placements"]

CREATE_REQUIRED = {
    "assets": {"output_id"},
    "projects": {"name"},
    "collections": {"name", "asset_ids"},
    "folders": {"name"},
    "sessions": {"name"},
    "masters": {"asset_id"},
    "assignments": {"master_id"},
    "placements": {"project_id"},
}
EDITABLE = {
    "assets": {"attributes"},
    "projects": {"name", "target", "notes"},
    "collections": {"name", "asset_ids", "calibration_folder_id"},
    "folders": {"name", "parent_id"},
    "sessions": {"name", "asset_ids", "notes"},
    "masters": {"asset_id", "folder_id", "method", "source_asset_id"},
    "assignments": {"asset_id", "collection_id", "master_id"},
    "placements": {"project_id", "folder_id", "asset_id", "collection_id", "position"},
}
CREATE_ONLY = {
    "assets": {"output_id", "project_id"},
    "projects": {"template"},
    "folders": {"project_id"},
}

READ = {"readOnlyHint": True, "openWorldHint": False}
WRITE = {"destructiveHint": False, "openWorldHint": False}
DELETE = {"destructiveHint": True, "openWorldHint": False}


def _validate_record(kind, fields, *, creating):
    allowed = EDITABLE[kind]
    if creating:
        allowed = allowed | CREATE_ONLY.get(kind, set())
    if not fields or fields.keys() - allowed:
        raise ToolError("INVALID_REQUEST: Use only editable fields for the selected library kind")
    if creating and not CREATE_REQUIRED[kind] <= fields.keys():
        raise ToolError("INVALID_REQUEST: Required library fields are missing")
    if creating and kind in {"assignments", "placements"}:
        if sum(fields.get(key) is not None for key in ("asset_id", "collection_id")) != 1:
            raise ToolError("INVALID_REQUEST: Provide exactly one of asset_id or collection_id")
    return fields


def _revision(value):
    if value < 0:
        raise ToolError("INVALID_REQUEST: Expected a non-negative revision from the record")
    return value


def register_library_tools(server: FastMCP, api: LibraryHTTP):
    @server.tool(annotations=READ)
    async def library_list(
        kind: LibraryKind,
        query: str = "",
        after: str | None = None,
        project_id: str | None = None,
        sort: str | None = None,
        filters: dict[str, str] | None = None,
        limit: int = 50,
    ) -> dict:
        """Browse one asset library entity kind. Pass the returned next cursor as after.

        For assets, use filters for metadata such as file_kind, usage, role,
        calibration_state, stage, camera_id, optical_train_id, filter, or band.
        Prefix an asset sort field with - for descending order.
        """
        if not 1 <= limit <= 100:
            raise ToolError("INVALID_REQUEST: Page size must be between 1 and 100")
        params = {"q": query, "limit": str(limit)}
        if after is not None:
            params["after"] = canonical_id(after)
        if project_id is not None:
            params["project_id"] = canonical_id(project_id)
        if sort is not None:
            params["sort"] = sort
        if filters:
            if filters.keys() & {"q", "after", "project_id", "sort", "limit"}:
                raise ToolError("INVALID_REQUEST: Filters cannot replace listing arguments")
            params.update(filters)
        return await api.request("GET", kind, params=params, result="page")

    @server.tool(annotations=READ)
    async def library_get(kind: LibraryKind, id: str) -> dict:
        """Read one asset library entity and its current revision."""
        return await api.request("GET", f"{kind}/{canonical_id(id)}")

    @server.tool(annotations=WRITE)
    async def library_create(kind: LibraryKind, record: dict) -> dict:
        """Create an asset library record or request the user's approval.

        assets: output_id, optional attributes and project_id (explicitly collect a formal output).
        projects: name, optional target, notes and template.
        collections: name, asset_ids, optional calibration_folder_id.
        folders: name, optional project_id and parent_id; omit project_id for the calibration library.
        sessions: name, optional notes and asset_ids.
        masters: asset_id, optional folder_id, method and source_asset_id.
        assignments: master_id and exactly one of asset_id or collection_id.
        placements: project_id and exactly one of asset_id or collection_id, optional folder_id and position.
        """
        return await api.request("POST", kind, body=_validate_record(kind, record, creating=True))

    @server.tool(annotations=WRITE)
    async def library_update(kind: LibraryKind, id: str, revision: int, changes: dict) -> dict:
        """Edit an asset library record using its current revision. For assets, edit attributes.

        The server can return a pending approval. Let the user review it in AstroPhoto,
        then use library_approval_get to obtain the outcome.
        """
        body = {"revision": _revision(revision), **_validate_record(kind, changes, creating=False)}
        return await api.request("PATCH", f"{kind}/{canonical_id(id)}", body=body)

    @server.tool(annotations=DELETE)
    async def library_delete(kind: LibraryKind, id: str, revision: int) -> dict:
        """Remove a library record or virtual relationship, subject to host authorization.

        Asset deletion unregisters the record and leaves the physical file in place.
        Review any returned approval request in AstroPhoto before treating it as applied.
        """
        return await api.request(
            "DELETE", f"{kind}/{canonical_id(id)}", body={"revision": _revision(revision)}, result="deletion",
        )

    @server.tool(annotations=WRITE)
    async def library_import_request(
        sources: list[str],
        settings_revision: int | None = None,
        attributes: dict | None = None,
        project_id: str | None = None,
    ) -> dict:
        """Request user approval to import authorized paths on the ComfyUI server.

        Import uses the current Settings strategy and target. A pending receipt means
        the import still awaits the user's review in AstroPhoto.
        """
        body = {"sources": sources}
        if settings_revision is not None:
            body["settings_revision"] = _revision(settings_revision)
        if attributes is not None:
            body["attributes"] = attributes
        if project_id is not None:
            body["project_id"] = canonical_id(project_id)
        return await api.request("POST", "import-requests", body=body, result="pending_approval")

    @server.tool(annotations=READ)
    async def library_approval_get(approval_id: str) -> dict:
        """Read the result of a user approval request without changing it."""
        return await api.request("GET", f"approvals/{canonical_id(approval_id)}", result="approval")
