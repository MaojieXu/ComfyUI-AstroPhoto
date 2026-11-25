"""Name-based tools for the four catalog asset types."""
import re
from typing import Annotated, Literal

from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
from pydantic import Field, MISSING

from .catalog_client import DELETE, READ, UNSET, WRITE, CatalogClient, capture_fields, compact, patch, path_of, resource, view
from .catalog_models import AssetType, CalibrationState, CaptureParameters, Cursor, DatedSort, EquipmentBinding, FrameType, Limit, Name, Notes, Path
from .projects import register_projects

Sources = Annotated[list[Path], Field(min_length=1, max_length=1000)]
CalibrationType = Literal['dark', 'flat', 'bias', 'dark_flat']


def public(row):
    result = view(row)
    result.pop('reference', None)
    result.pop('workspace', None)
    if isinstance(result.get('source_collection'), dict):
        result['source_collection'].pop('reference', None)
    return result


def comparison_view(fields, collection=None, master=None):
    group_info = public(collection) if collection else {}
    master_info = public(master) if master else {}
    result = {}
    for key, item in fields.items():
        result[key] = {'status': item['status']}
        if key == 'camera_id':
            result[key].update(collection=group_info.get('camera'), master=master_info.get('camera'))
        elif key == 'equipment_train_id':
            result[key].update(collection=group_info.get('equipment_group'), master=master_info.get('equipment_group'))
        elif key == 'filter':
            result[key].update(collection=group_info.get('filter_name') or group_info.get('filter_state'),
                               master=master_info.get('filter_name') or master_info.get('filter_state'))
        else:
            result[key].update(collection=item.get('actual'), master=item.get('expected'))
    return result


def named_resource(row):
    return f"{resource(row['asset_type'])}/{row['id']}"


async def find_name(client, name, kind=None, *, detail=False):
    result = await client.page('assets', {'exact_name': name}, None, 20)
    rows = result['items']
    if not rows:
        raise ToolError('NAME_NOT_FOUND: ' + name)
    if len(rows) != 1 or result['next_cursor']:
        raise ToolError('AMBIGUOUS_NAME: catalog name uniqueness is violated')
    row = rows[0]
    actual = row.get('asset_type')
    if kind and actual != kind:
        raise ToolError('INVALID_ASSET_TYPE: the named asset has a different type')
    if detail:
        row = await client.call('GET', named_resource(row))
        row['asset_type'] = actual
    return row


async def linked_masters(client, collection_id):
    result = await client.call('GET', f'subframe_collection/{collection_id}/bindings')
    return [public(row) for row in result['items']]


def register_catalog_tools(server: FastMCP, api, equipment_api=None):
    client = CatalogClient(api, equipment_api)

    @server.tool(annotations=READ)
    async def library_list(query: str = '', asset_type: AssetType | None = None, frame_type: FrameType | None = None,
                           master_type: FrameType | None = None, calibration_state: CalibrationState | None = None,
                           equipment_group: Name | None = None, filter_name: Name | None = None,
                           sort_by: DatedSort = 'name_asc', limit: Limit = 50, cursor: Cursor | None = None) -> dict:
        """Search library assets by name and recorded properties. Returns paginated results.

        Args:
            query: Search text for the asset name.
            asset_type: Restrict results to an asset type.
            frame_type: Restrict subframe collections to a frame type.
            master_type: Restrict master frames to a master type.
            calibration_state: Restrict collections by calibration state.
            equipment_group: Exact recorded equipment group name.
            filter_name: Exact recorded filter name.
            sort_by: Sort order for the results.
            limit: Maximum results per page.
            cursor: Continuation cursor from the same search.
        """
        route = resource(asset_type) if asset_type else 'assets'
        params = compact(q=query, frame_type=frame_type, master_type=master_type, calibration_state=calibration_state,
                         equipment=equipment_group, filter=filter_name, sort=sort_by,
                         asset_type=asset_type if asset_type in ('master_frame', 'image_result') else None)
        result = await client.page(route, params, cursor, limit)
        result['items'] = [public(row) for row in result['items']]
        return result

    @server.tool(annotations=READ)
    async def library_get(name: Name) -> dict:
        """Get a library asset by its unique name, including recorded metadata and relationships.

        Args:
            name: Unique library asset name.
        """
        row = await find_name(client, name, detail=True)
        result = public(row)
        if row['asset_type'] == 'subframe_collection':
            result['calibration_masters'] = await linked_masters(client, row['id'])
        return result

    @server.tool(annotations=READ)
    async def library_list_subframes(collection_name: Name, limit: Limit = 50, cursor: Cursor | None = None) -> dict:
        """List registered files in a subframe collection. Capture parameters belong to the collection.

        Args:
            collection_name: Unique subframe collection name.
            limit: Maximum files per page.
            cursor: Continuation cursor from this collection listing.
        """
        row = await find_name(client, collection_name, 'subframe_collection')
        result = await client.page(f"subframe_collection/{row['id']}/files", {}, cursor, limit)
        result['items'] = [compact(file_name=item['file_name'], file_path=path_of(item), storage_mode=item.get('storage_mode'), size_bytes=item.get('size_bytes')) for item in result['items']]
        return result

    @server.tool(annotations=READ)
    async def library_inspect_folder(folder_path: Path, limit: Limit = 100, cursor: Cursor | None = None) -> dict:
        """List files in a server folder without reading image or video metadata.

        Args:
            folder_path: Absolute folder path on the ComfyUI host.
            limit: Maximum files per page.
            cursor: Continuation cursor from this folder listing.
        """
        result = await client.page('source-folder', {}, cursor, limit, body={'path': folder_path})
        result['folder_path'] = folder_path
        result['items'] = [{'relative_path': name} for name in result['items']]
        return result

    @server.tool(annotations=WRITE)
    async def library_import(asset_type: AssetType, name: Name, source_paths: Sources, notes: Notes | None = None,
                             equipment: EquipmentBinding | None = None, frame_type: FrameType | None = None,
                             calibration_state: CalibrationState | None = None, master_type: FrameType | None = None,
                             source_collection_name: Name | None = None, capture: CaptureParameters | None = None) -> dict:
        """Import one asset; use selected files or folders for one collection, or one file for a single-file asset.

        Args:
            asset_type: Type of the asset to import.
            name: Unique name for the asset.
            source_paths: Host file or folder paths; single-file assets require exactly one file.
            notes: Optional user notes.
            equipment: Equipment group name and the filter used for capture.
            frame_type: Frame type for a subframe collection.
            calibration_state: Calibration state for a subframe collection.
            master_type: Purpose of a master frame, including calibration types.
            source_collection_name: Optional name of the source subframe collection for a master.
            capture: Recorded capture parameters for a collection or master frame.
        """
        grouped = asset_type == 'subframe_collection'
        master = asset_type == 'master_frame'
        if not grouped and (len(source_paths) != 1 or frame_type is not None or calibration_state is not None):
            raise ToolError('INVALID_ARGUMENT: single-file assets require one path and no collection fields')
        if not master and (master_type is not None or source_collection_name is not None):
            raise ToolError('INVALID_ARGUMENT: master fields require a master frame')
        if not (grouped or master) and capture is not None:
            raise ToolError('INVALID_ARGUMENT: capture fields require a collection or master frame')
        config = {'kind': resource(asset_type), 'name': name, **compact(notes=notes)}
        if asset_type in ('master_frame', 'image_result'):
            config['asset_type'] = asset_type
        if master:
            config['master_type'] = master_type or 'unknown'
            if source_collection_name:
                config['source_collection_id'] = (await find_name(client, source_collection_name, 'subframe_collection'))['id']
        if grouped:
            config.update(frame_type=frame_type or 'unknown', calibration_state=calibration_state or 'unknown')
        if grouped or master:
            values = capture_fields(capture)
            if 'source_collection_id' not in config:
                values.setdefault('binning', '1')
            config.update(values)
        if equipment is not None:
            config.update(await client.optics(equipment))
        return await client.submit(source_paths, config)

    @server.tool(annotations=READ)
    async def library_import_status(task: str) -> dict:
        """Get the progress and result of an import or subframe append.

        Args:
            task: Short task number returned by library_import or library_add_subframes.
        """
        if not re.fullmatch(r'IMP-[A-F0-9]{8}', task):
            raise ToolError('INVALID_TASK: use the short task number returned by the import')
        result = await api.request('GET', 'catalog-import/' + task, result='operation_status')
        receipt = result['receipt']
        phase = result['phase']
        status = 'partial' if phase == 'completed' and (receipt.get('failed') or receipt.get('skipped')) else ('running' if phase in ('preparing', 'importing', 'publishing', 'planning') else phase)
        output = {'task': task, 'status': status, 'phase': phase,
                  **{k: receipt[k] for k in ('total', 'processed', 'registered', 'copied', 'skipped', 'failed', 'errors') if k in receipt}}
        output['imported'] = receipt.get('registered', 0) + receipt.get('copied', 0)
        if result.get('error'):
            output['error'] = result['error']
        if receipt.get('catalog_name'):
            output['asset'] = {'name': receipt['catalog_name'], 'asset_type': receipt['asset_type']}
        return output

    @server.tool(annotations=WRITE)
    async def library_add_subframes(collection_name: Name, source_paths: Sources) -> dict:
        """Add selected files or folders to an existing collection without changing its capture parameters.

        Args:
            collection_name: Unique name of the existing subframe collection.
            source_paths: Host file or folder paths to add.
        """
        row = await find_name(client, collection_name, 'subframe_collection')
        result = await client.call('POST', f"subframe_collection/{row['id']}/files", body={'sources': source_paths})
        return {'task': result['task'], 'status': 'queued', 'collection_name': row['name']}

    @server.tool(annotations=WRITE)
    async def library_update(name: Name, new_name: Name | MISSING = UNSET, notes: Notes | None | MISSING = UNSET,
                             equipment: EquipmentBinding | None | MISSING = UNSET, frame_type: FrameType | MISSING = UNSET,
                             calibration_state: CalibrationState | MISSING = UNSET, master_type: FrameType | MISSING = UNSET,
                             source_collection_name: Name | None | MISSING = UNSET, capture: CaptureParameters | None = None) -> dict:
        """Update explicitly supplied fields by unique asset name; omit unchanged fields and use null to clear optional values.

        Args:
            name: Unique name of the asset to update.
            new_name: New unique name, if renaming.
            notes: User notes, or null to clear them.
            equipment: Equipment and filter binding, or null to clear it.
            frame_type: Frame type for a subframe collection.
            calibration_state: Calibration state for a subframe collection.
            master_type: Purpose of a master frame.
            source_collection_name: Source subframe collection name, or null to clear it.
            capture: Capture fields to update; null clears each individual field.
        """
        row = await find_name(client, name)
        kind = row['asset_type']
        if kind != 'subframe_collection' and (frame_type is not UNSET or calibration_state is not UNSET):
            raise ToolError('INVALID_ARGUMENT: frame and calibration state require a subframe collection')
        if kind != 'master_frame' and (master_type is not UNSET or source_collection_name is not UNSET):
            raise ToolError('INVALID_ARGUMENT: master fields require a master frame')
        if kind not in ('master_frame', 'subframe_collection') and capture is not None:
            raise ToolError('INVALID_ARGUMENT: capture requires a collection or master frame')
        changes = {**patch(name=new_name, notes=notes, frame_type=frame_type, calibration_state=calibration_state, master_type=master_type),
                   **capture_fields(capture), **await client.optics(equipment)}
        if source_collection_name is not UNSET:
            changes['source_collection_id'] = None if source_collection_name is None else (await find_name(client, source_collection_name, 'subframe_collection'))['id']
        return public(await client.update(named_resource(row), row, changes))

    @server.tool(annotations=DELETE)
    async def library_remove(name: Name) -> dict:
        """Unregister a library asset and its project references while keeping its physical files.

        Args:
            name: Unique name of the asset to unregister.
        """
        row = await find_name(client, name)
        await client.call('DELETE', named_resource(row), body={'revision': row['revision']})
        return {'name': row['name'], 'asset_type': row['asset_type'], 'removed': True}

    @server.tool(annotations=DELETE)
    async def library_remove_subframe(collection_name: Name, file_path: Path) -> dict:
        """Unregister one file from a subframe collection while keeping the physical file.

        Args:
            collection_name: Unique subframe collection name.
            file_path: Registered host file path returned by library_list_subframes.
        """
        row = await find_name(client, collection_name, 'subframe_collection')
        route = f"subframe_collection/{row['id']}/files"
        cursor, matches = None, []
        while True:
            result = await client.page(route, {}, cursor, 100)
            matches.extend(item for item in result['items'] if path_of(item) == file_path)
            cursor = result['next_cursor']
            if cursor is None:
                break
        if len(matches) != 1:
            raise ToolError('AMBIGUOUS_PATH' if matches else 'FILE_NOT_FOUND')
        await client.call('DELETE', route + '/' + matches[0]['id'], body={'revision': row['revision']})
        return {'collection_name': row['name'], 'file_path': file_path, 'removed': True}

    @server.tool(annotations=DELETE)
    async def storage_delete_managed_file(name: Name, file_path: Path | None = None) -> dict:
        """Delete one AstroPhoto-managed file; external reference files are not deleted.

        For a subframe collection, provide the registered file_path of one member.
        The catalog registration remains and may report the file unavailable.
        """
        row = await find_name(client, name)
        ident = row['id']
        if row['asset_type'] == 'subframe_collection':
            if not file_path:
                raise ToolError('INVALID_ARGUMENT: provide file_path for a subframe collection')
            cursor, matches = None, []
            while True:
                page_result = await client.page(f"subframe_collection/{ident}/files", {}, cursor, 100)
                matches.extend(item for item in page_result['items'] if path_of(item) == file_path)
                cursor = page_result['next_cursor']
                if cursor is None:
                    break
            if len(matches) != 1:
                raise ToolError('AMBIGUOUS_PATH' if matches else 'FILE_NOT_FOUND')
            ident = matches[0]['id']
        elif file_path is not None:
            raise ToolError('INVALID_ARGUMENT: file_path is only needed for subframe collections')
        _, result = await api._send('POST', f'library/assets/{ident}/delete-file', body={})
        return {'name': name, 'file_path': file_path, 'deleted_file': result.get('deleted_file') is True}

    @server.tool(annotations=READ)
    async def library_find_calibration(collection_name: Name, master_type: CalibrationType | None = None,
                                       query: str = '', sort_by: DatedSort = 'name_asc', limit: Limit = 50,
                                       cursor: Cursor | None = None) -> dict:
        """Find calibration masters and report recorded differences and unknown values without excluding them.

        Args:
            collection_name: Unique subframe collection name.
            master_type: Optional calibration master type.
            query: Search text for the master name.
            sort_by: Sort order for the results.
            limit: Maximum results per page.
            cursor: Continuation cursor from the same search.
        """
        group = await find_name(client, collection_name, 'subframe_collection')
        if group['frame_type'] == 'unknown':
            raise ToolError('FRAME_TYPE_REQUIRED: determine the collection frame type first')
        result = await client.page('calibration_master', compact(collection=group['id'], master_type=master_type, q=query, sort=sort_by), cursor, limit)
        result['collection_name'] = group['name']
        result['items'] = [{**public(item), 'status': item['status'], 'comparison': comparison_view(item['comparison'], group, item)} for item in result['items']]
        return result

    @server.tool(annotations=WRITE)
    async def library_bind_calibration(collection_name: Name, master_names: Annotated[list[Name], Field(min_length=1, max_length=100)]) -> dict:
        """Bind calibration masters by name. Differences do not block binding; multiple masters of one type are allowed and existing bindings are retained.

        Args:
            collection_name: Unique subframe collection name.
            master_names: Unique names of calibration master frames to bind.
        """
        group = await find_name(client, collection_name, 'subframe_collection')
        masters = [await find_name(client, name, 'master_frame') for name in master_names]
        if len({row['id'] for row in masters}) != len(masters):
            raise ToolError('INVALID_ARGUMENT: repeated master name')
        result = await client.call('POST', f"subframe_collection/{group['id']}/bindings", body={'master_ids': [row['id'] for row in masters]})
        return {'collection_name': group['name'], 'masters': master_names,
                'comparison': [{'name': item['name'], 'fields': comparison_view(item['fields'], group, next(row for row in masters if row['name'] == item['name']))} for item in result['items']], 'status': 'bound'}

    @server.tool(annotations=DELETE)
    async def library_unbind_calibration(collection_name: Name, master_name: Name) -> dict:
        """Remove a calibration binding while keeping both assets and their physical files.

        Args:
            collection_name: Unique subframe collection name.
            master_name: Unique calibration master frame name.
        """
        group = await find_name(client, collection_name, 'subframe_collection')
        master = await find_name(client, master_name, 'master_frame')
        await client.call('DELETE', f"subframe_collection/{group['id']}/bindings/{master['id']}")
        return {'collection_name': group['name'], 'master_name': master['name'], 'removed': True}

    register_projects(server, client)
