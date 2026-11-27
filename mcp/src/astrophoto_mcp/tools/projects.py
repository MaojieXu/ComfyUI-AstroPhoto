"""Name and logical-path based project management tools."""

from typing import Annotated

from fastmcp.exceptions import ToolError
from pydantic import Field, MISSING
from fastmcp import Context
from .continuation import load_page, save_page, target_binding

from .catalog_client import DELETE, READ, UNSET, WRITE, compact, patch, resource, view
from .catalog_models import DatedSort, Limit, LogicalPath, Name, Notes, ProjectAssetInput


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
    return {"project_name": project["name"], "path": path, **result}


async def remove(client, project, path):
    route = f"projects/{project['id']}"
    if path != "/":
        row = await node_record(client, project, path)
        route += f"/nodes/{row['id']}"
    result = await client.call("DELETE", route)
    return {"status": "removed", "project_name": project["name"], "path": path,
            "affected_folders": result["affected_folders"], "affected_references": result["affected_references"]}


def register_projects(server, client):
    @server.tool(annotations=READ)
    async def project_list(query: str | MISSING = UNSET, sort_by: DatedSort | MISSING = UNSET,
                           continue_with: str | None = None, limit: Limit | MISSING = UNSET, *, ctx: Context) -> dict:
        """Search unique project names and paginate the sorted results."""
        if continue_with and any(v is not UNSET for v in (query, sort_by, limit)):
            raise ToolError('CONTINUATION_MISMATCH: do not provide filters with continue_with')
        query = '' if query is UNSET else query
        sort_by = 'name_asc' if sort_by is UNSET else sort_by
        limit = 50 if limit is UNSET else limit
        target = await target_binding(client.api)
        args = dict(query=query, sort_by=sort_by, limit=limit)
        cursor = None
        if continue_with:
            args, cursor = await load_page(ctx, continue_with, 'project_list', target, {}, {'query': (query, ''), 'sort_by': (sort_by, 'name_asc'), 'limit': (limit, 50)})
        result = await client.page("projects", {"q": args['query'], "sort": args['sort_by']}, cursor, args['limit'], expected_instance=target[1])
        result["items"] = [project_view(row) for row in result["items"]]
        return await save_page(ctx, 'project_list', target, {}, args, result)

    @server.tool(annotations=READ)
    async def project_get(project_name: Name, path: LogicalPath | MISSING = UNSET, continue_with: str | None = None,
                          limit: Limit | MISSING = UNSET, recursive: bool | MISSING = UNSET, *, ctx: Context) -> dict:
        """Read a folder's children or paginated descendants, or one asset reference, by logical path."""
        if continue_with and any(v is not UNSET for v in (path, limit, recursive)):
            raise ToolError('CONTINUATION_MISMATCH: do not provide filters with continue_with')
        path = '/' if path is UNSET else path
        limit = 100 if limit is UNSET else limit
        recursive = False if recursive is UNSET else recursive
        target = await target_binding(client.api)
        project = await project_record(client, project_name)
        identity = {'project_id': project['id']}
        args = dict(path=path, limit=limit, recursive=recursive)
        cursor = None
        if continue_with:
            args, cursor = await load_page(ctx, continue_with, 'project_get', target, identity, {'path': (path, '/'), 'limit': (limit, 100), 'recursive': (recursive, False)})
            path, limit, recursive = args['path'], args['limit'], args['recursive']
        route = f"projects/{project['id']}"
        if path != "/":
            row = await node_record(client, project, path)
            if row["kind"] != "folder":
                if cursor is not None:
                    raise ToolError("INVALID_CURSOR: asset nodes are not paginated")
                kind = row["asset_type"]
                route_kind = resource(kind)
                asset = await client.call("GET", f"{route_kind}/{row['resource_id']}", params={"summary": "1"})
                asset_view = view(asset)
                asset_view.pop("reference", None)
                asset_view.pop("workspace", None)
                if isinstance(asset_view.get("source_collection"), dict):
                    asset_view["source_collection"].pop("reference", None)
                return {"project": project_view(project), "path": path, "node": node_view(row, path.rsplit("/", 1)[0]),
                        "asset": asset_view}
        result = await client.page(route, {"path": path, "view": "descendants" if recursive else "children",
                                           "sort": "name_asc"}, cursor, limit, expected_instance=target[1])
        result["project"] = project_view(result["project"])
        result["path"] = path
        result["items"] = [node_view(row, row.pop("parent_path") if recursive else path) for row in result["items"]]
        return await save_page(ctx, 'project_get', target, identity, args, result)

    @server.tool(annotations=WRITE)
    async def project_create(name: Name, notes: Notes | None = None) -> dict:
        """Create an empty project with a unique name."""
        return project_view(await client.call("POST", "projects", body=compact(name=name, notes=notes)))

    @server.tool(annotations=WRITE)
    async def project_update(project_name: Name, new_name: Name | MISSING = UNSET, notes: Notes | None | MISSING = UNSET) -> dict:
        """Update a project by its current exact name. Omit unchanged fields; null clears notes.

        new_name changes the project name. Returns changed and cleared visible fields.
        """
        row = await project_record(client, project_name)
        changes = patch(name=new_name, notes=notes)
        updated = project_view(await client.update(f"projects/{row['id']}", row, changes))
        before = project_view(row)
        changed = [field for field in changes if before.get(field) != updated.get(field)]
        return {**updated, 'changed': changed, 'cleared': [field for field in changed if updated.get(field) is None]}

    @server.tool(annotations=DELETE)
    async def project_delete(project_name: Name) -> dict:
        """Remove a project and its references; catalog assets and source files are preserved."""
        return await remove(client, await project_record(client, project_name), "/")

    @server.tool(annotations=WRITE)
    async def project_create_folders(project_name: Name,
                                     paths: Annotated[list[LogicalPath], Field(min_length=1, max_length=1000)]) -> dict:
        """Create project-internal logical paths atomically, including missing parents.

        Each path starts with '/', e.g. paths=['/Raw/Lights']; paths are not host disk folders.
        Existing folders are retained; a conflict rolls back the batch.
        """
        project = await project_record(client, project_name)
        result = await client.call("POST", f"projects/{project['id']}/folders", body={"paths": paths})
        return {"project_name": project["name"], "paths": paths, "created": len(result["items"])}

    @server.tool(annotations=WRITE)
    async def project_add_assets(project_name: Name, folder_path: LogicalPath,
                                 assets: Annotated[list[ProjectAssetInput], Field(min_length=1, max_length=100)]) -> dict:
        """Atomically add library assets by exact name to a project-internal logical folder.

        assets is a list of objects, e.g. [{name: M31 Light, alias: Lights}]. The optional
        alias changes only the project reference, not the library asset or file.
        """
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
        """Rename or move a project folder or asset alias, without changing the underlying file.

        path identifies the current project-internal item; new_name and new_parent_path
        specify its new name or destination logical folder, not a host disk path.
        """
        project = await project_record(client, project_name)
        row = await node_record(client, project, path)
        route = f"projects/{project['id']}/nodes/{row['id']}"
        updated = await client.update(route, row, compact(name=new_name, parent_path=new_parent_path))
        return node_view(updated, new_parent_path or path.rsplit("/", 1)[0])

    @server.tool(annotations=DELETE)
    async def project_remove_node(project_name: Name, path: LogicalPath) -> dict:
        """Remove a logical folder and descendants, or one asset reference. Library records and files are preserved."""
        if path == "/":
            raise ToolError("INVALID_PATH: use project_delete to remove the project")
        return await remove(client, await project_record(client, project_name), path)

    @server.tool(annotations=READ)
    async def project_impact(project_name: Name, path: LogicalPath = "/") -> dict:
        """Preview descendant folder and reference counts. Removal requires no confirmation or impact token."""
        return await impact(client, await project_record(client, project_name), path)
