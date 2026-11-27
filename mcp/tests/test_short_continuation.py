import asyncio
from types import SimpleNamespace

import pytest
import httpx
from fastmcp.exceptions import ToolError
from fastmcp import Client

from astrophoto_mcp.tools.continuation import load_page, save_page, target_binding
from astrophoto_mcp.server import create_server


class Context:
    def __init__(self, server, *, protocol='2026-07-28', transport='stdio'):
        self.fastmcp = server
        self.transport = transport
        self.request_context = SimpleNamespace(protocol_version=protocol)
        self.state = {}

    async def get_state(self, key):
        return self.state.get(key)

    async def set_state(self, key, value):
        self.state[key] = value


def test_handles_bind_to_tool_instance_and_object():
    async def run():
        ctx = Context(SimpleNamespace())
        page = await save_page(ctx, 'library_list', ['host', 'instance'], {}, {'limit': 1},
                               {'items': ['first'], 'next_cursor': 'long-internal-cursor'})
        handle = page['continue_with']
        assert page['returned'] == 1 and page['has_more'] and 'next_cursor' not in page
        args, cursor = await load_page(ctx, handle, 'library_list', ['host', 'instance'], {})
        assert args == {'limit': 1} and cursor == 'long-internal-cursor'
        for tool, target, identity in [('other', ['host', 'instance'], {}),
                                       ('library_list', ['host', 'other'], {}),
                                       ('library_list', ['host', 'instance'], {'collection': 'other'})]:
            with pytest.raises(ToolError, match='CONTINUATION_EXPIRED'):
                await load_page(ctx, handle, tool, target, identity)
        with pytest.raises(ToolError, match='CONTINUATION_MISMATCH'):
            await load_page(ctx, handle, 'library_list', ['host', 'instance'], {}, {'limit': (2, 50)})
        with pytest.raises(ToolError, match='SESSION_SCOPE_UNAVAILABLE'):
            await load_page(Context(ctx.fastmcp, transport='streamable-http'), handle, 'library_list', ['host', 'instance'], {})
    asyncio.run(run())


def test_all_eight_tool_schemas_use_short_continuation():
    async def run():
        async with Client(create_server('http://127.0.0.1:8188'), mode='legacy') as client:
            found = {}
            for category in ('equipment', 'equipment_groups', 'library', 'projects'):
                response = await client.call_tool('list_category_tools', {'category': category})
                found.update({t['name']: t['inputSchema'] for t in response.data['tools']})
            for name in ('equipment_list', 'optical_train_list', 'library_list',
                         'library_list_subframes', 'library_inspect_folder', 'library_find_calibration',
                         'project_list', 'project_get'):
                assert 'continue_with' in found[name]['properties'], name
                assert 'cursor' not in found[name]['properties'], name
    asyncio.run(run())


@pytest.mark.parametrize('tool,first,repeat', [
    ('equipment_list', {'limit': 1}, {}),
    ('optical_train_list', {'limit': 1}, {}),
    ('library_list', {'limit': 1}, {}),
    ('library_list_subframes', {'collection_name': 'Lights', 'limit': 1}, {'collection_name': 'Lights'}),
    ('library_inspect_folder', {'folder_path': '/data', 'limit': 1}, {'folder_path': '/data'}),
    ('library_find_calibration', {'collection_name': 'Lights', 'limit': 1}, {'collection_name': 'Lights'}),
    ('project_list', {'limit': 1}, {}),
    ('project_get', {'project_name': 'M31', 'limit': 1}, {'project_name': 'M31'}),
])
def test_each_listing_uses_short_continuation(monkeypatch, tool, first, repeat):
    import astrophoto_mcp.tools.equipment as equipment
    import astrophoto_mcp.tools.catalog as catalog
    import astrophoto_mcp.tools.projects as projects
    from astrophoto_mcp.tools.catalog_client import CatalogClient

    async def listing(api, kind, query='', archive='active', sort='name_asc', cursor=None, limit=50, equipment_type=None, expected_instance=None):
        assert expected_instance == 'instance-1'
        row = {'name': 'first' if cursor is None else 'second', 'equipment_type': 'camera', 'product_name': 'camera',
               'summary': {'camera': None, 'primary_optics': None, 'accessories': [], 'filters': [], 'others': []}}
        return {'items': [row], 'total': 2, 'next': 'backend-cursor' if cursor is None else None}

    async def page(self, route, params, cursor, limit, *, body=None, expected_instance=None):
        assert expected_instance == 'instance-1'
        name = 'first' if cursor is None else 'second'
        if route == 'source-folder':
            items = [name]
        elif route.endswith('/files'):
            items = [{'file_name': name, 'file_path': '/data/' + name}]
        elif route == 'calibration_master':
            items = [{'name': name, 'id': name, 'asset_type': 'master_frame', 'status': 'match', 'comparison': {}}]
        elif route.startswith('projects/'):
            items = [{'name': name, 'kind': 'folder'}]
        elif route == 'projects':
            items = [{'name': name}]
        else:
            items = [{'name': name, 'id': name, 'asset_type': 'image_result'}]
        result = {'items': items, 'next_cursor': 'backend-cursor' if cursor is None else None}
        if route.startswith('projects/'):
            result['project'] = {'name': 'M31'}
        return result

    async def find_name(client, name, kind=None, **kwargs):
        return {'id': 'collection', 'name': name, 'asset_type': 'subframe_collection', 'frame_type': 'light'}

    project_id = ['project']
    async def project_record(client, name):
        return {'id': project_id[0], 'name': name}

    async def probe(self, url, **kwargs):
        self.identities[url] = 'instance-1'
        return True

    monkeypatch.setattr(equipment, 'listing', listing)
    monkeypatch.setattr(CatalogClient, 'page', page)
    monkeypatch.setattr(catalog, 'find_name', find_name)
    monkeypatch.setattr(projects, 'project_record', project_record)
    monkeypatch.setattr('astrophoto_mcp.tools.continuation.LocalTarget.probe', probe)

    async def run():
        async with Client(create_server('http://127.0.0.1:8188'), mode='legacy') as client:
            first_page = (await client.call_tool(tool, first)).data
            assert first_page['has_more'] and first_page['returned'] == 1
            if tool == 'project_get':
                project_id[0] = 'replacement-project'
                replaced = await client.call_tool(tool, {**repeat, 'continue_with': first_page['continue_with']}, raise_on_error=False)
                assert replaced.is_error
                project_id[0] = 'project'
            next_page = (await client.call_tool(tool, {**repeat, 'continue_with': first_page['continue_with']})).data
            assert not next_page['has_more'] and next_page['returned'] == 1
            assert first_page['items'] != next_page['items']
            wrong = await client.call_tool(tool, {**repeat, 'continue_with': first_page['continue_with'], 'limit': 50}, raise_on_error=False)
            assert wrong.is_error
    asyncio.run(run())


def test_same_address_new_instance_cannot_resume():
    instance = ['one']
    def respond(request):
        return httpx.Response(200, json={'extension': {'id': 'ComfyUI_AstroPhoto'},
            'runtime': {'routes_registered': True}, 'data_home': '/data',
            'storage_instance_id': instance[0], 'capabilities': {'assets': {'available': True},
                                                                'equipment': {'available': True}}})
    async def run():
        ctx = Context(SimpleNamespace())
        api = SimpleNamespace(base_url='http://127.0.0.1:8188', transport=httpx.MockTransport(respond))
        target = await target_binding(api)
        page = await save_page(ctx, 'library_list', target, {}, {'limit': 1}, {'items': [1], 'next_cursor': 'cursor'})
        instance[0] = 'two'
        with pytest.raises(ToolError, match='CONTINUATION_EXPIRED'):
            await load_page(ctx, page['continue_with'], 'library_list', await target_binding(api), {})
    asyncio.run(run())


def test_instance_identity_is_forwarded_to_paged_requests():
    from astrophoto_mcp.tools.catalog_client import CatalogClient
    from astrophoto_mcp.tools.equipment import listing

    class API:
        async def catalog_request(self, method, route, **kwargs):
            assert kwargs['expected_instance'] == 'instance-1'
            return {'items': [], 'next': None}

        async def get(self, path, kind, **kwargs):
            assert kwargs['expected_instance'] == 'instance-1'
            return {'items': [], 'next': None}

    async def run():
        api = API()
        await CatalogClient(api, None).page('assets', {}, None, 10, expected_instance='instance-1')
        await listing(api, 'equipment', expected_instance='instance-1')
    asyncio.run(run())
