"""Name and logical-path based project management tools."""

from typing import Annotated

from fastmcp.exceptions import ToolError
from pydantic import Field, MISSING

from .catalog_client import DELETE, READ, UNSET, WRITE, compact, patch, resource, view
from .catalog_models import Cursor, DatedSort, Limit, LogicalPath, Name, Notes, ProjectAssetInput


def project_view(row):
    return {key: row[key] for key in ("name", "notes", "created_at_utc", "updated_at_utc") if key in row}


def node_view(row, parent):
    return compact(name=row["name"], path=parent.rstrip("/") + "/" + row["name"],
                   node_type=row["kind"], asset_type=row.get("asset_type"), asset_name=row.get("resource_name"))


async def project_record(client, name):
    result = await client.call("GET", "projects", params={"name": name, "view": "summary"})
    return result["project"]


async def node_record(client, project, path):
    if path == "/":
        raise ToolError("INVALID_PATH: the project root is not a node")
    result = await client.call("GET", f"projects/{project['id']}", params={"path": path, "view": "node"})
    return result["node"]


async def impact(client, project, path):
    result = await client.call("GET", f"projects/{project['id']}", params={"path": path, "view": "impact"})
    result.pop("revision", None)
    return {"project_name": project["name"], "path": path, **result}


async def checked_removal(client, project, path, confirmed, token):
    preview = await impact(client, project, path)
    if preview["requires_confirmation"]:
        if not confirmed:
            return {"status": "confirmation_required", **preview}
        if token != preview["impact_token"]:
            raise ToolError("IMPACT_CHANGED: use the token returned by project_impact for the confirmed removal")
    row = project if path == "/" else await node_record(client, project, path)
    route = f"projects/{project['id']}"
    if path != "/":
        route += f"/nodes/{row['id']}"
    await client.call("DELETE", route, body=compact(revision=row["revision"], confirmed=confirmed, impact_token=token))
    return {"status": "removed", **{key: value for key, value in preview.items()
                                   if key not in ("impact_token", "requires_confirmation")}}


def register_projects(server, client):
    @server.tool(annotations=READ)
    async def project_list(query: str = "", sort_by: DatedSort = "name_asc",
                           cursor: Cursor | None = None, limit: Limit = 50) -> dict:
        """Search unique project names and paginate the sorted results."""
        result = await client.page("projects", {"q": query, "sort": sort_by}, cursor, limit)
        result["items"] = [project_view(row) for row in result["items"]]
        return result

    @server.tool(annotations=READ)
    async def project_get(project_name: Name, path: LogicalPath = "/", cursor: Cursor | None = None,
                          limit: Limit = 100, recursive: bool = False) -> dict:
        """Read a folder's children or paginated descendants, or one asset reference, by logical path."""
        project = await project_record(client, project_name)
        route = f"projects/{project['id']}"
        if path != "/":
            row = await node_record(client, project, path)
            if row["kind"] != "folder":
                if cursor is not None:
                    raise ToolError("INVALID_CURSOR: asset nodes are not paginated")
                kind = row["asset_type"]
                route_kind = row.get("resource_kind") or resource(kind)
                asset = await client.call("GET", f"{route_kind}/{row['resource_id']}", params={"summary": "1"})
                asset_view = view(asset, kind)
                asset_view.pop("reference", None)
                asset_view.pop("workspace", None)
                if isinstance(asset_view.get("source_collection"), dict):
                    asset_view["source_collection"].pop("reference", None)
                return {"project": project_view(project), "path": path, "node": node_view(row, path.rsplit("/", 1)[0]),
                        "asset": asset_view}
        result = await client.page(route, {"path": path, "view": "descendants" if recursive else "children",
                                           "sort": "name_asc"}, cursor, limit)
        result["project"] = project_view(result["project"])
        result["path"] = path
        result["items"] = [node_view(row, row.pop("parent_path") if recursive else path) for row in result["items"]]
        return result

    @server.tool(annotations=WRITE)
    async def project_create(name: Name, notes: Notes | None = None) -> dict:
        """Create an empty project with a unique name."""
        return project_view(await client.call("POST", "projects", body=compact(name=name, notes=notes)))

    @server.tool(annotations=WRITE)
    async def project_update(project_name: Name, new_name: Name | MISSING = UNSET, notes: Notes | None | MISSING = UNSET) -> dict:
        """Change the project name or notes. Use null to clear notes."""
        row = await project_record(client, project_name)
        return project_view(await client.update(f"projects/{row['id']}", row, patch(name=new_name, notes=notes)))

    @server.tool(annotations=DELETE)
    async def project_delete(project_name: Name, confirm_non_empty: bool = False,
                             impact_token: str | None = None) -> dict:
        """Remove a project and its references. An impact token and confirmation are required; source files are preserved."""
        return await checked_removal(client, await project_record(client, project_name), "/",
                                     confirm_non_empty, impact_token)

    @server.tool(annotations=WRITE)
    async def project_create_folders(project_name: Name,
                                     paths: Annotated[list[LogicalPath], Field(min_length=1, max_length=1000)]) -> dict:
        """Create logical folder paths atomically, including missing parents. Existing folders are retained."""
        project = await project_record(client, project_name)
        result = await client.call("POST", f"projects/{project['id']}/folders", body={"paths": paths})
        return {"project_name": project["name"], "paths": paths, "created": len(result["items"])}

    @server.tool(annotations=WRITE)
    async def project_add_assets(project_name: Name, folder_path: LogicalPath,
                                 assets: Annotated[list[ProjectAssetInput], Field(min_length=1, max_length=100)]) -> dict:
        """Atomically add assets by globally unique name. An optional alias applies only to the project."""
        project = await project_record(client, project_name)
        entries = []
        for item in assets:
            result = await client.page("assets", {"exact_name": item.name}, None, 20)
            if not result["items"]:
                raise ToolError("NAME_NOT_FOUND: " + item.name)
            if len(result["items"]) != 1 or result["next_cursor"]:
                raise ToolError("AMBIGUOUS_NAME: catalog name uniqueness is violated")
            row = result["items"][0]
            entries.append(compact(kind=resource(row["asset_type"]), resource_id=row["id"], name=item.alias))
        result = await client.call("POST", f"projects/{project['id']}/references",
                                   body={"parent_path": folder_path, "assets": entries})
        return {"project_name": project["name"], "items": [node_view(row, folder_path) for row in result["items"]]}

    @server.tool(annotations=WRITE)
    async def project_update_node(project_name: Name, path: LogicalPath, new_name: Name | None = None,
                                  new_parent_path: LogicalPath | None = None) -> dict:
        """Rename or move a folder or asset alias without changing the underlying file."""
        project = await project_record(client, project_name)
        row = await node_record(client, project, path)
        route = f"projects/{project['id']}/nodes/{row['id']}"
        updated = await client.update(route, row, compact(name=new_name, parent_path=new_parent_path))
        return node_view(updated, new_parent_path or path.rsplit("/", 1)[0])

    @server.tool(annotations=DELETE)
    async def project_remove_node(project_name: Name, path: LogicalPath, confirm_non_empty: bool = False,
                                  impact_token: str | None = None) -> dict:
        """Remove a logical folder or asset reference. Non-empty folders require confirmation of the previewed impact."""
        if path == "/":
            raise ToolError("INVALID_PATH: use project_delete to remove the project")
        return await checked_removal(client, await project_record(client, project_name), path,
                                     confirm_non_empty, impact_token)

    @server.tool(annotations=READ)
    async def project_impact(project_name: Name, path: LogicalPath = "/") -> dict:
        """Preview descendant folder and reference counts before removal. Keep the returned impact token for confirmation."""
        return await impact(client, await project_record(client, project_name), path)
