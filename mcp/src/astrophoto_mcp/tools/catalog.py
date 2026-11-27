"""Name-based tools for the four catalog asset types."""
import re
import json
import secrets
import time
from typing import Annotated, Literal

from fastmcp import Context, FastMCP
from fastmcp.exceptions import ToolError
from pydantic import Field, MISSING

from .catalog_client import DELETE, READ, UNSET, WRITE, CatalogClient, capture_fields, compact, patch, path_of, resource, view
from .catalog_models import AssetType, CalibrationState, CaptureParameters, DatedSort, EquipmentBinding, FrameType, Limit, Name, Notes, Path
from .projects import register_projects
from .session_state import get_state, set_state
from .continuation import load_page, save_page, target_binding as pagination_target_binding
from ..target import LocalTarget

Sources = Annotated[list[Path], Field(min_length=1, max_length=1000)]
CalibrationType = Literal['dark', 'flat', 'bias', 'dark_flat']
FileName = Annotated[str, Field(min_length=1, description='Exact filename; it must be unique in the collection.')]


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
        raise ToolError('NAME_NOT_FOUND: no exact library asset named ' + name + '; use library_list to search')
    if len(rows) != 1 or result['next_cursor']:
        candidates = [{'name': item['name'], 'asset_type': item.get('asset_type')} for item in rows[:20]]
        raise ToolError('AMBIGUOUS_NAME: cannot select a unique asset: ' + json.dumps(candidates, ensure_ascii=False))
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

    def target_binding():
        return list(api.base_url.binding()) if isinstance(api.base_url, LocalTarget) else [str(api.base_url)]

    async def deletion_binding():
        if isinstance(api.base_url, LocalTarget):
            return list(api.base_url.binding())
        _, status = await api._send('GET', 'status')
        identity = status.get('storage_instance_id')
        if not isinstance(identity, str) or not identity:
            raise ToolError('INSTANCE_IDENTITY_UNAVAILABLE: cannot bind deletion confirmation to the host')
        return [str(api.base_url), identity]

    async def subframe(row, file_path, file_name):
        if bool(file_path) == bool(file_name):
            raise ToolError('INVALID_ARGUMENT: provide exactly one of file_path or file_name')
        route = named_resource(row) + '/files'
        cursor, matches = None, []
        while True:
            page = await client.page(route, {}, cursor, 100)
            matches.extend(item for item in page['items'] if (path_of(item) == file_path if file_path else item['file_name'] == file_name))
            cursor = page['next_cursor']
            if cursor is None:
                break
        if len(matches) != 1:
            if matches:
                paths = [path_of(item) for item in matches[:20]]
                raise ToolError('AMBIGUOUS_PATH: specify one full file_path: ' + json.dumps(paths, ensure_ascii=False))
            raise ToolError('FILE_NOT_FOUND: use library_list_subframes to inspect registered files')
        return matches[0]

    async def confirmation_revision(ctx, confirmation, confirmed, row, member_id=None):
        if not confirmation:
            if confirmed:
                raise ToolError('CONFIRMATION_REQUIRED: inspect the deletion impact first')
            return None
        if not confirmed:
            raise ToolError('USER_CONFIRMATION_REQUIRED: request explicit user approval')
        key = 'deletion:' + confirmation
        record = await get_state(ctx, key)
        if (not isinstance(record, dict) or record.get('expires', 0) < time.time()
                or record.get('target') != await deletion_binding() or record.get('asset') != row['id']
                or record.get('member') != member_id):
            raise ToolError('CONFIRMATION_EXPIRED: inspect impact and obtain user approval again')
        return record['revision']

    @server.tool(annotations=READ)
    async def library_list(query: str | MISSING = UNSET, asset_type: AssetType | None | MISSING = UNSET, frame_type: FrameType | None | MISSING = UNSET,
                           master_type: FrameType | None | MISSING = UNSET, calibration_state: CalibrationState | None | MISSING = UNSET,
                           equipment_group: Name | None | MISSING = UNSET, filter_name: Name | None | MISSING = UNSET,
                           sort_by: DatedSort | MISSING = UNSET, limit: Limit | MISSING = UNSET, continue_with: str | None = None, *, ctx: Context) -> dict:
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
            continue_with: Short continuation returned by this tool.
        """
        if continue_with and any(v is not UNSET for v in (query, asset_type, frame_type, master_type, calibration_state, equipment_group, filter_name, sort_by, limit)):
            raise ToolError('CONTINUATION_MISMATCH: do not provide filters with continue_with')
        query = '' if query is UNSET else query
        asset_type = None if asset_type is UNSET else asset_type
        frame_type = None if frame_type is UNSET else frame_type
        master_type = None if master_type is UNSET else master_type
        calibration_state = None if calibration_state is UNSET else calibration_state
        equipment_group = None if equipment_group is UNSET else equipment_group
        filter_name = None if filter_name is UNSET else filter_name
        sort_by = 'name_asc' if sort_by is UNSET else sort_by
        limit = 50 if limit is UNSET else limit
        route = resource(asset_type) if asset_type else 'assets'
        params = compact(q=query, frame_type=frame_type, master_type=master_type, calibration_state=calibration_state,
                         equipment=equipment_group, filter=filter_name, sort=sort_by,
                         asset_type=asset_type if asset_type in ('master_frame', 'image_result') else None)
        args = dict(route=route, params=params, limit=limit)
        cursor = None
        target = await pagination_target_binding(api)
        if continue_with:
            original = args
            args, cursor = await load_page(ctx, continue_with, 'library_list', target, {})
            if ((asset_type is not None and original['route'] != args['route']) or
                    any(value not in (None, '', 'name_asc') and args['params'].get(key) != value
                        for key, value in params.items()) or
                    (limit != 50 and limit != args['limit'])):
                raise ToolError('CONTINUATION_MISMATCH: use the original search parameters')
        result = await client.page(args['route'], args['params'], cursor, args['limit'], expected_instance=target[1])
        result['items'] = [public(row) for row in result['items']]
        return await save_page(ctx, 'library_list', target, {}, args, result)

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
    async def library_list_subframes(collection_name: Name, limit: Limit | MISSING = UNSET, continue_with: str | None = None, *, ctx: Context) -> dict:
        """List registered files in a subframe collection. Capture parameters belong to the collection.

        Args:
            collection_name: Unique subframe collection name.
            limit: Maximum files per page.
            continue_with: Short continuation returned by this tool.
        """
        if continue_with and limit is not UNSET:
            raise ToolError('CONTINUATION_MISMATCH: do not provide limit with continue_with')
        limit = 50 if limit is UNSET else limit
        row = await find_name(client, collection_name, 'subframe_collection')
        target = await pagination_target_binding(api)
        identity = {'collection_id': row['id']}
        args, cursor = {'limit': limit}, None
        if continue_with:
            args, cursor = await load_page(ctx, continue_with, 'library_list_subframes', target, identity, {'limit': (limit, 50)})
        limit = args['limit']
        result = await client.page(f"subframe_collection/{row['id']}/files", {}, cursor, limit, expected_instance=target[1])
        result['items'] = [compact(file_name=item['file_name'], file_path=path_of(item), storage_mode=item.get('storage_mode'), size_bytes=item.get('size_bytes')) for item in result['items']]
        return await save_page(ctx, 'library_list_subframes', target, identity, args, result)

    @server.tool(annotations=READ)
    async def library_inspect_folder(folder_path: Path, limit: Limit | MISSING = UNSET, continue_with: str | None = None, *, ctx: Context) -> dict:
        """List files in a server folder without reading image or video metadata.

        Args:
            folder_path: Absolute folder path on the ComfyUI host.
            limit: Maximum files per page.
            continue_with: Short continuation returned by this tool.
        """
        if continue_with and limit is not UNSET:
            raise ToolError('CONTINUATION_MISMATCH: do not provide limit with continue_with')
        limit = 100 if limit is UNSET else limit
        target = await pagination_target_binding(api)
        identity = {'folder_path': folder_path}
        args, cursor = {'limit': limit}, None
        if continue_with:
            args, cursor = await load_page(ctx, continue_with, 'library_inspect_folder', target, identity, {'limit': (limit, 100)})
        result = await client.page('source-folder', {}, cursor, args['limit'], body={'path': folder_path}, expected_instance=target[1])
        result['folder_path'] = folder_path
        result['items'] = [{'relative_path': name} for name in result['items']]
        return await save_page(ctx, 'library_inspect_folder', target, identity, args, result)

    @server.tool(annotations=WRITE)
    async def library_import(asset_type: AssetType, name: Name, source_paths: Sources, notes: Notes | None = None,
                             equipment: EquipmentBinding | None = None, frame_type: FrameType | None = None,
                             calibration_state: CalibrationState | None = None, master_type: FrameType | None = None,
                             source_collection_name: Name | None = None, capture: CaptureParameters | None = None) -> dict:
        """Import one asset; use selected files or folders for one collection, or one file for a single-file asset.

        Example: asset_type='subframe_collection', name='M31 Light',
        source_paths=['D:/Astro/M31/Light'], frame_type='light'.
        Paths refer to the ComfyUI host. Do not guess missing capture values.
        For a collection or master without a source collection, omitted binning defaults to '1'.

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
        """Update explicitly supplied fields by unique asset name; omit unchanged fields.

        Example: name='M31 Light', notes=null clears notes; omitting notes keeps it.
        equipment=null clears equipment and filter. capture=null makes no capture changes;
        use capture={'gain': null} to clear only gain.

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
        updated = public(await client.update(named_resource(row), row, changes))
        supplied = {'name': new_name, 'notes': notes, 'equipment': equipment, 'frame_type': frame_type,
                    'calibration_state': calibration_state, 'master_type': master_type,
                    'source_collection_name': source_collection_name}
        fields = {key: value for key, value in supplied.items() if value is not UNSET}
        if capture is not None:
            fields.update({f'capture.{key}': value for key, value in capture.model_dump(exclude_unset=True).items()})
        updated['updated_fields'] = list(fields)
        updated['cleared_fields'] = [key for key, value in fields.items() if value is None]
        return updated

    @server.tool(annotations=READ)
    async def library_deletion_impact(ctx: Context, name: Name, file_path: Path | None = None, file_name: FileName | None = None) -> dict:
        """Inspect deletion effects; ask the user to approve associated changes before deleting.

        For a single subframe specify its registered path or its unique exact filename.
        Supply the returned confirmation only after the user approves the effects.
        """
        target = await deletion_binding()
        row = await find_name(client, name)
        route = named_resource(row)
        member_id = None
        if file_path is not None or file_name is not None:
            if row['asset_type'] != 'subframe_collection':
                raise ToolError('INVALID_ARGUMENT: file selection requires a subframe collection')
            member_id = (await subframe(row, file_path, file_name))['id']
            route += '/files/' + member_id
        impact = await client.call('GET', route + '/deletion-impact')
        if target != await deletion_binding():
            raise ToolError('INSTANCE_CHANGED: inspect the deletion impact again')
        revision = impact.pop('impact_revision')
        code = secrets.token_hex(5).upper()
        await set_state(ctx, 'deletion:' + code, {'target': target, 'asset': row['id'], 'member': member_id,
                                                  'revision': revision, 'expires': time.time() + 600})
        return {**impact, 'confirmation': code}

    @server.tool(annotations=DELETE)
    async def library_remove(ctx: Context, name: Name, confirmation: str | None = None, confirmed: bool = False) -> dict:
        """Delete a library asset and its associations. Delete managed copies and preserve external originals.

        Args:
            name: Unique name of the asset to delete.
            confirmation: Short code from library_deletion_impact.
            confirmed: True only after explicit user approval of the inspected effects.
        """
        binding = await deletion_binding()
        row = await find_name(client, name)
        impact_revision = await confirmation_revision(ctx, confirmation, confirmed, row)
        if binding != await deletion_binding():
            raise ToolError('INSTANCE_CHANGED: inspect the deletion impact again')
        result = await client.call('DELETE', named_resource(row), body=compact(revision=row['revision'], impact_revision=impact_revision),
                                   expected_instance=binding[-1])
        return {**result, 'name': row['name'], 'asset_type': row['asset_type'], 'removed': result['deleted']}

    @server.tool(annotations=DELETE)
    async def library_remove_subframe(ctx: Context, collection_name: Name, file_path: Path | None = None,
                                     file_name: FileName | None = None, confirmation: str | None = None,
                                     confirmed: bool = False) -> dict:
        """Remove one subframe and delete its managed copy. Preserve external originals.

        Args:
            collection_name: Unique subframe collection name.
            file_path: Registered host file path returned by library_list_subframes.
            file_name: Exact unique filename within the collection, instead of file_path.
            confirmation: Short code from library_deletion_impact.
            confirmed: True only after explicit user approval of the inspected effects.
        """
        binding = await deletion_binding()
        row = await find_name(client, collection_name, 'subframe_collection')
        route = f"subframe_collection/{row['id']}/files"
        member = await subframe(row, file_path, file_name)
        impact_revision = await confirmation_revision(ctx, confirmation, confirmed, row, member['id'])
        if binding != await deletion_binding():
            raise ToolError('INSTANCE_CHANGED: inspect the deletion impact again')
        result = await client.call('DELETE', route + '/' + member['id'], body=compact(revision=row['revision'], impact_revision=impact_revision),
                                   expected_instance=binding[-1])
        return {**result, 'collection_name': row['name'], 'file_path': path_of(member), 'removed': result['deleted']}

    @server.tool(annotations=READ)
    async def library_find_calibration(collection_name: Name, master_type: CalibrationType | None | MISSING = UNSET,
                                       query: str | MISSING = UNSET, sort_by: DatedSort | MISSING = UNSET, limit: Limit | MISSING = UNSET,
                                       continue_with: str | None = None, *, ctx: Context) -> dict:
        """Find calibration masters and report recorded differences and unknown values without excluding them.

        Args:
            collection_name: Unique subframe collection name.
            master_type: Optional calibration master type.
            query: Search text for the master name.
            sort_by: Sort order for the results.
            limit: Maximum results per page.
            continue_with: Short continuation returned by this tool.
        """
        if continue_with and any(v is not UNSET for v in (master_type, query, sort_by, limit)):
            raise ToolError('CONTINUATION_MISMATCH: do not provide filters with continue_with')
        master_type = None if master_type is UNSET else master_type
        query = '' if query is UNSET else query
        sort_by = 'name_asc' if sort_by is UNSET else sort_by
        limit = 50 if limit is UNSET else limit
        group = await find_name(client, collection_name, 'subframe_collection')
        target = await pagination_target_binding(api)
        identity = {'collection_id': group['id']}
        args = dict(master_type=master_type, query=query, sort_by=sort_by, limit=limit)
        cursor = None
        if continue_with:
            args, cursor = await load_page(ctx, continue_with, 'library_find_calibration', target, identity, {'master_type': (master_type, None), 'query': (query, ''), 'sort_by': (sort_by, 'name_asc'), 'limit': (limit, 50)})
        master_type, query, sort_by, limit = args['master_type'], args['query'], args['sort_by'], args['limit']
        if group['frame_type'] == 'unknown':
            raise ToolError('FRAME_TYPE_REQUIRED: determine the collection frame type first')
        result = await client.page('calibration_master', compact(collection=group['id'], master_type=master_type, q=query, sort=sort_by), cursor, limit, expected_instance=target[1])
        result['collection_name'] = group['name']
        result['items'] = [{**public(item), 'status': item['status'], 'comparison': comparison_view(item['comparison'], group, item)} for item in result['items']]
        return await save_page(ctx, 'library_find_calibration', target, identity, args, result)

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
