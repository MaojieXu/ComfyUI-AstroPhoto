"""Name-based equipment and equipment group tools over the public API."""

from typing import Annotated, Literal
from unicodedata import normalize

from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
from pydantic import Field, MISSING

from ..api.equipment import EquipmentHTTP

EquipmentType = Literal['camera', 'primary_optics', 'optical_accessory', 'filter', 'other']
ArchiveFilter = Literal['active', 'archived', 'all']
Sort = Literal['name_asc', 'name_desc', 'created_desc', 'updated_desc']
Kind = Annotated[EquipmentType, Field(description='camera: main camera; primary_optics: telescope or lens; optical_accessory: main optical-path accessory; filter: imaging filter; other: other equipment or software.')]
Query = Annotated[str, Field(max_length=120, description='Case-insensitive substring search.')]
Name = Annotated[str, Field(min_length=1, max_length=120, description='Unique equipment or equipment group name.')]
ProductName = Annotated[str, Field(min_length=1, max_length=120, description='Product name or model; may be shared by multiple equipment items.')]
Notes = Annotated[str | None, Field(max_length=4000, description='Optional notes; null clears notes on update.')]
Limit = Annotated[int, Field(ge=1, le=100, description='Maximum number of results per page.')]
Archive = Annotated[ArchiveFilter, Field(description='active: not archived; archived: archived only; all: both.')]
Ordering = Annotated[Sort, Field(description='name_asc/name_desc: name order; created_desc/updated_desc: newest first.')]
READ = {'readOnlyHint': True, 'openWorldHint': False}
WRITE = {'destructiveHint': False, 'openWorldHint': False}
DELETE = {'destructiveHint': True, 'idempotentHint': False, 'openWorldHint': False}
UNSET = MISSING


def key(name):
    return normalize('NFC', name.strip().casefold())


def device_view(item):
    result = {k: item.get(k) for k in ('equipment_type', 'name', 'product_name', 'notes', 'created_at_utc', 'updated_at_utc')}
    result['archived'] = item.get('archived_at_utc') is not None
    if 'usage_summary' in item:
        result['equipment_groups'] = [x['name'] for x in item['usage_summary']]
    return result


def train_view(item):
    summary = item['summary']
    return {'name': item['name'], 'notes': item.get('notes'), 'camera': summary.get('camera'),
            'primary_optics': summary.get('primary_optics'),
            'accessory': next(iter(summary.get('accessories', [])), None),
            'filters': summary.get('filters', []), 'other': summary.get('others', []),
            'archived': item.get('archived_at_utc') is not None,
            'created_at_utc': item.get('created_at_utc'), 'updated_at_utc': item.get('updated_at_utc')}


async def listing(api, kind, query='', archive='active', sort='name_asc', cursor=None, limit=50, equipment_type=None):
    params = {'q': query, 'archived': {'active': 'false', 'archived': 'true', 'all': 'all'}[archive],
              'sort': sort, 'limit': str(limit)}
    if equipment_type is not None:
        params['type'] = equipment_type
    if cursor is not None:
        params['after'] = cursor
    return await api.get('equipment' if kind == 'equipment' else 'optical-trains', kind,
                         params=params, collection=True, paged=True)


async def resolve(api, kind, name, *, archived=False):
    if api is None:
        raise ToolError('EQUIPMENT_UNAVAILABLE: equipment lookup is unavailable')
    if not name.strip() or len(name) > 120:
        raise ToolError('INVALID_ARGUMENT: name must contain 1-120 characters')
    # Substring search cannot resolve all Unicode-equivalent spellings; enumerate all pages.
    cursor = None
    while True:
        result = await listing(api, kind, archive='all' if archived else 'active', cursor=cursor, limit=100)
        for item in result['items']:
            if key(item['name']) == key(name):
                path = ('equipment/' if kind == 'equipment' else 'optical-trains/') + item['id']
                return await api.get(path, kind)
        next_cursor = result['next']
        if next_cursor is None:
            raise ToolError(f'NAME_NOT_FOUND: {name}')
        if next_cursor == cursor:
            raise ToolError('INVALID_RESPONSE: repeated pagination cursor')
        cursor = next_cursor


def page_view(page, kind):
    view = device_view if kind == 'equipment' else train_view
    return {'items': [view(item) for item in page['items']], 'total': page['total'], 'next_cursor': page['next']}


async def members(api, values, current=None):
    result = {}
    fields = (('camera', 'camera_id', 'camera'), ('primary_optics', 'primary_optics_id', 'primary_optics'),
              ('accessory', 'accessory_id', 'optical_accessory'), ('filters', 'filter_ids', 'filter'),
              ('other', 'other_ids', 'other'))
    for field, target, expected in fields:
        if field not in values:
            continue
        value = values[field]
        many = field in ('filters', 'other')
        if many and (not isinstance(value, list) or len(value) > 50):
            raise ToolError(f'INVALID_ARGUMENT: {field} must contain at most 50 names')
        names = value if many else ([] if value is None else [value])
        ids = []
        for name in names:
            item = await resolve(api, 'equipment', name, archived=True)
            if item['equipment_type'] != expected:
                raise ToolError(f'EQUIPMENT_TYPE_MISMATCH: {field}={name}, expected={expected}, actual={item["equipment_type"]}')
            existing = current and (item['id'] in current[target] if many else item['id'] == current[target])
            if item.get('archived_at_utc') and not existing:
                raise ToolError(f'EQUIPMENT_ARCHIVED: {name}')
            if item['id'] in ids:
                raise ToolError(f'DUPLICATE_MEMBER: {name}')
            ids.append(item['id'])
        result[target] = ids if many else (ids[0] if ids else None)
    return result


def register_equipment_tools(server: FastMCP, api: EquipmentHTTP):
    @server.tool(annotations=READ)
    async def equipment_list(query: Query = '', equipment_type: Kind | None = None,
                             archive_filter: Archive = 'active', sort_by: Ordering = 'name_asc',
                             cursor: str | None = None, limit: Limit = 50) -> dict:
        """Search equipment by name or product name. Filter by type and archive status, then sort and paginate."""
        return page_view(await listing(api, 'equipment', query, archive_filter, sort_by, cursor, limit, equipment_type), 'equipment')

    @server.tool(annotations=READ)
    async def equipment_get(name: Name, include_archived: bool = False) -> dict:
        """Get one equipment item and equipment group references by its unique name."""
        return device_view(await resolve(api, 'equipment', name, archived=include_archived))

    @server.tool(annotations=READ)
    async def optical_train_list(query: Query = '', archive_filter: Archive = 'active', sort_by: Ordering = 'name_asc',
                                 cursor: str | None = None, limit: Limit = 50) -> dict:
        """Search equipment groups by group or member name, with archive filter, sorting and pagination."""
        return page_view(await listing(api, 'train', query, archive_filter, sort_by, cursor, limit), 'train')

    @server.tool(annotations=READ)
    async def optical_train_get(name: Name, include_archived: bool = False) -> dict:
        """Get an equipment group and its members by unique name."""
        return train_view(await resolve(api, 'train', name, archived=include_archived))


def register_equipment_write_tools(server: FastMCP, api: EquipmentHTTP, *, read_api=None):
    @server.tool(annotations=WRITE)
    async def equipment_create(equipment_type: Kind, name: Name, product_name: ProductName, notes: Notes = None) -> dict:
        """Register one equipment item with a unique instance name and product name."""
        return device_view(await api.request('POST', 'equipment', 'equipment', body={
            'equipment_type': equipment_type, 'name': name, 'product_name': product_name, 'notes': notes}))

    @server.tool(annotations=WRITE)
    async def equipment_update(name: Name, new_name: Name | MISSING = UNSET, product_name: ProductName | MISSING = UNSET,
                               notes: Notes | MISSING = UNSET) -> dict:
        """Update equipment fields by name. Omit notes to keep them; pass null to clear them."""
        item = await resolve(read_api, 'equipment', name)
        changes = {k: v for k, v in [('name', new_name), ('product_name', product_name)] if v is not UNSET}
        if notes is not UNSET:
            changes['notes'] = notes
        if not changes:
            raise ToolError('INVALID_ARGUMENT: provide at least one field to update')
        return device_view(await api.request('PATCH', 'equipment/' + item['id'], 'equipment', body=changes))

    @server.tool(annotations=WRITE)
    async def equipment_set_archived(name: Name, archived: bool) -> dict:
        """Archive or restore an equipment item by name."""
        item = await resolve(read_api, 'equipment', name, archived=True)
        return device_view(await api.request('POST', f'equipment/{item["id"]}/' + ('archive' if archived else 'restore'),
                                             'equipment'))

    @server.tool(annotations=WRITE)
    async def optical_train_create(name: Name, notes: Notes = None, camera: str | None = None,
                                   primary_optics: str | None = None, accessory: str | None = None,
                                   filters: list[str] = [], other: list[str] = []) -> dict:
        """Create an equipment group using existing equipment names. Camera, optics and accessory are single; filters and other are lists."""
        values = {'camera': camera, 'primary_optics': primary_optics, 'accessory': accessory,
                  'filters': filters, 'other': other}
        body = {'name': name, 'notes': notes, **await members(read_api, values)}
        return train_view(await api.request('POST', 'optical-trains', 'train', body=body))

    @server.tool(annotations=WRITE)
    async def optical_train_update(name: Name, new_name: Name | MISSING = UNSET, notes: Notes | MISSING = UNSET,
                                   camera: str | None | MISSING = UNSET, primary_optics: str | None | MISSING = UNSET,
                                   accessory: str | None | MISSING = UNSET, filters: list[str] | MISSING = UNSET,
                                   other: list[str] | MISSING = UNSET) -> dict:
        """Update a group by name. Omitted fields are unchanged; null clears a single member, and [] clears a list."""
        item = await resolve(read_api, 'train', name)
        changes = {k: v for k, v in [('camera', camera), ('primary_optics', primary_optics), ('accessory', accessory),
                                     ('filters', filters), ('other', other)] if v is not UNSET}
        if new_name is UNSET and notes is UNSET and not changes:
            raise ToolError('INVALID_ARGUMENT: provide at least one field to update')
        body = {}
        if new_name is not UNSET:
            body['name'] = new_name
        if notes is not UNSET:
            body['notes'] = notes
        body.update(await members(read_api, changes, current=item))
        return train_view(await api.request('PATCH', 'optical-trains/' + item['id'], 'train', body=body))

    @server.tool(annotations=WRITE)
    async def optical_train_set_archived(name: Name, archived: bool) -> dict:
        """Archive or restore an equipment group by name."""
        item = await resolve(read_api, 'train', name, archived=True)
        return train_view(await api.request('POST', f'optical-trains/{item["id"]}/' + ('archive' if archived else 'restore'),
                                            'train'))

    async def delete(kind, name):
        item = await resolve(read_api, kind, name, archived=True)
        path = 'equipment' if kind == 'equipment' else 'optical-trains'
        await api.request('DELETE', f'{path}/{item["id"]}', kind)
        return {'name': item['name'], 'deleted': True}

    @server.tool(annotations=DELETE)
    async def equipment_delete(name: Name) -> dict:
        """Delete an equipment item and unlink current references."""
        return await delete('equipment', name)

    @server.tool(annotations=DELETE)
    async def optical_train_delete(name: Name) -> dict:
        """Delete an equipment group while preserving historical snapshots."""
        return await delete('train', name)
