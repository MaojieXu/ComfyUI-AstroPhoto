"""FastMCP against the real extension catalog and storage API."""

import asyncio
from pathlib import Path

import anyio
import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from fastmcp import Client
from fastmcp.exceptions import ToolError

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig, load_storage_settings, write_json_atomically
from astrophoto_mcp.server import create_server
from astrophoto_mcp.tools.catalog_client import CatalogClient


@pytest.mark.parametrize('mode', ['reference', 'copy'])
def test_name_tools_import_append_and_calibration(tmp_path, monkeypatch, mode):
    paths = [tmp_path / name for name in ('one.fit', 'two.fit', 'dark.fit', 'three.fit', 'dark2.fit', 'four.fit', 'final.fit')]
    for path in paths:
        path.write_bytes(b'fixture')
    root = tmp_path / 'data'
    runtime = bootstrap(lambda: True, AppConfig('ComfyUI_AstroPhoto', '0.0.1', root))
    initialize_storage_runtime(runtime)
    runtime.trusted_local = True
    assert runtime.storage is not None, runtime.storage_error
    settings = load_storage_settings(root)
    settings['imports']['default_mode'] = mode
    write_json_atomically(root / 'config' / 'settings.json', settings)
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)

    async def exercise():
        async with TestClient(TestServer(app)) as browser, Client(create_server(f'http://127.0.0.1:{browser.server.port}'), mode='legacy') as agent:
            async def call(tool, **args):
                return (await agent.call_tool(tool, args)).data

            async def finish(result, expected='completed'):
                assert result['task'].startswith('IMP-')
                with anyio.fail_after(15):
                    while True:
                        state = await call('library_import_status', task=result['task'])
                        if state['status'] in ('completed', 'partial', 'failed', 'cancelled'):
                            break
                        await asyncio.sleep(.025)
                assert state['status'] == expected, state
                return state

            tools = (await agent.call_tool('list_category_tools', {'category': 'library'})).data['tools']
            names = {tool['name'] for tool in tools}
            assert {'library_get', 'library_add_subframes', 'library_find_calibration', 'library_bind_calibration'} <= names
            assert 'calibration_bind' not in names
            assert set(next(tool for tool in tools if tool['name'] == 'library_get')['inputSchema']['properties']) == {'name'}
            started = await call('library_import', asset_type='subframe_collection', name='Lights',
                                 source_paths=[str(paths[0])], frame_type='light', capture={'gain': 100})
            await finish(started)
            await finish(await call('library_add_subframes', collection_name='Lights', source_paths=[str(paths[1])]))
            group = await call('library_get', name='Lights')
            assert group['subframe_count'] == 2 and group['capture']['gain'] == 100 and 'reference' not in group
            assert len((await call('library_list_subframes', collection_name='Lights'))['items']) == 2
            partial = await finish(await call('library_add_subframes', collection_name='Lights', source_paths=[str(paths[1]), str(paths[3])]), 'partial')
            assert partial['skipped'] == 1
            assert (await call('library_get', name='Lights'))['subframe_count'] == 3
            listed = await call('library_list_subframes', collection_name='Lights')
            second = next(item for item in listed['items'] if item['file_name'] == 'two.fit')
            await call('library_remove_subframe', collection_name='Lights', file_name='two.fit')
            assert paths[1].exists()
            if mode == 'copy':
                assert not Path(second['file_path']).exists()
            await finish(await call('library_add_subframes', collection_name='Lights', source_paths=[str(paths[1])]))
            assert (await call('library_get', name='Lights'))['subframe_count'] == 3
            await finish(await call('library_import', asset_type='master_frame', name='Dark',
                                    source_paths=[str(paths[2])], master_type='dark', capture={'gain': 200}))
            await finish(await call('library_import', asset_type='master_frame', name='Dark2',
                                    source_paths=[str(paths[4])], master_type='dark', capture={'gain': 100}))
            candidates = await call('library_find_calibration', collection_name='Lights')
            assert next(item for item in candidates['items'] if item['name'] == 'Dark')['status'] == 'difference'
            bound = await call('library_bind_calibration', collection_name='Lights', master_names=['Dark', 'Dark2'])
            assert bound['status'] == 'bound'
            await call('library_unbind_calibration', collection_name='Lights', master_name='Dark')
            await call('library_unbind_calibration', collection_name='Lights', master_name='Dark2')
            await call('library_update', name='Dark', master_type='light', source_collection_name='Lights')
            assert (await call('library_get', name='Dark'))['source_collection']['name'] == 'Lights'
            updated_group = await call('library_update', name='Lights', frame_type='light', capture={'offset': 0})
            assert updated_group['capture']['offset'] == 0
            await call('library_update', name='Lights', frame_type='dark')
            assert (await call('library_get', name='Lights'))['frame_type'] == 'dark'
            assert (await call('library_get', name='Dark')).get('source_collection') is None
            await call('library_update', name='Dark', notes='Corrected')
            assert (await call('library_get', name='Dark'))['notes'] == 'Corrected'
            await call('library_update', name='Dark', capture={'gain': 0})
            dark = await call('library_get', name='Dark')
            assert dark['notes'] == 'Corrected' and dark['capture']['gain'] == 0
            cleared = await call('library_update', name='Dark', notes=None, source_collection_name=None, capture={'gain': None})
            assert set(cleared['updated_fields']) == {'notes', 'source_collection_name', 'capture.gain'}
            assert set(cleared['cleared_fields']) == {'notes', 'source_collection_name', 'capture.gain'}
            dark = await call('library_get', name='Dark')
            assert dark.get('notes') is None and dark.get('source_collection') is None and dark['capture']['gain'] is None
            assert [item['name'] for item in (await call('library_list', sort_by='name_asc'))['items']] == ['Dark', 'Dark2', 'Lights']
            assert [item['name'] for item in (await call('library_list', sort_by='created_desc'))['items']] == ['Dark2', 'Dark', 'Lights']
            await call('project_create', name='M31', notes='original')
            updated = await call('project_update', project_name='M31', new_name='M31')
            assert updated['notes'] == 'original'
            updated = await call('project_update', project_name='M31', notes='changed')
            assert updated['notes'] == 'changed'
            updated = await call('project_update', project_name='M31', notes=None)
            assert updated['notes'] is None
            await call('project_create_folders', project_name='M31', paths=['/Raw/L', '/Raw/R', '/Integrate'])
            await call('project_add_assets', project_name='M31', folder_path='/Raw/L',
                       assets=[{'name': 'Lights', 'alias': 'Light frames'}, {'name': 'Dark'}])
            assert {item['asset_name'] for item in (await call('project_get', project_name='M31', path='/Raw/L'))['items']} == {'Lights', 'Dark'}
            detail = await call('project_get', project_name='M31', path='/Raw/L/Dark')
            assert detail['asset']['name'] == 'Dark' and 'reference' not in detail['asset']
            paths_seen, cursor = [], None
            while True:
                page = (await call('project_get', project_name='M31', recursive=True, limit=1)
                        if cursor is None else await call('project_get', project_name='M31', continue_with=cursor))
                paths_seen.extend(item['path'] for item in page['items'])
                cursor = page['continue_with']
                if cursor is None:
                    break
            assert paths_seen == ['/Integrate', '/Raw', '/Raw/L', '/Raw/L/Dark', '/Raw/L/Light frames', '/Raw/R']
            first = await call('project_get', project_name='M31', recursive=True, limit=1)
            invalid_cursor = await agent.call_tool('project_get', {'project_name': 'M31', 'path': '/Raw',
                                                   'recursive': True, 'limit': 1, 'continue_with': first['continue_with']},
                                                   raise_on_error=False)
            assert invalid_cursor.is_error
            collision = await agent.call_tool('project_create_folders', {'project_name': 'M31',
                                              'paths': ['/New', '/Raw/L/Dark/Sub']}, raise_on_error=False)
            assert collision.is_error
            assert '/New' not in [item['path'] for item in (await call('project_get', project_name='M31'))['items']]
            duplicate = await agent.call_tool('project_add_assets', {'project_name': 'M31', 'folder_path': '/Raw/R',
                                            'assets': [{'name': 'Dark2'}, {'name': 'Lights'}]}, raise_on_error=False)
            assert duplicate.is_error
            assert (await call('project_get', project_name='M31', path='/Raw/R'))['items'] == []
            await call('project_update_node', project_name='M31', path='/Raw/L/Light frames', new_parent_path='/Raw/R')
            assert (await call('project_get', project_name='M31', path='/Raw/R'))['items'][0]['asset_name'] == 'Lights'
            preview = await call('project_impact', project_name='M31', path='/Raw/R')
            assert preview['affected_references'] == 1
            await call('project_create_folders', project_name='M31', paths=['/Raw/R/Added after preview'])
            removed = await call('project_remove_node', project_name='M31', path='/Raw/R')
            assert removed['affected_folders'] == 1 and removed['affected_references'] == 1
            assert (await call('library_get', name='Lights'))['name'] == 'Lights'
            preview = await call('project_impact', project_name='M31')
            assert preview.pop('request_id')
            assert preview == {'project_name': 'M31', 'path': '/', 'affected_references': 1, 'affected_folders': 3}
            await call('project_delete', project_name='M31')
            assert (await call('project_list'))['items'] == []
            assert paths[0].exists() and (await call('library_get', name='Dark'))['name'] == 'Dark'
            await finish(await call('library_import', asset_type='subframe_collection', name='Dark source',
                                    source_paths=[str(paths[2])], frame_type='dark', capture={'binning': '2'}))
            await finish(await call('library_import', asset_type='master_frame', name='Inherited',
                                   source_paths=[str(paths[2])], master_type='dark', source_collection_name='Dark source'))
            assert (await call('library_get', name='Inherited'))['capture']['binning'] == '2'
            await finish(await call('library_import', asset_type='master_frame', name='Explicit unknown',
                                   source_paths=[str(paths[2])], master_type='dark', source_collection_name='Dark source',
                                   capture={'binning': None}))
            assert (await call('library_get', name='Explicit unknown'))['capture']['binning'] is None
            await finish(await call('library_import', asset_type='master_frame', name='Explicit value',
                                   source_paths=[str(paths[2])], master_type='dark', source_collection_name='Dark source',
                                   capture={'binning': '3'}))
            assert (await call('library_get', name='Explicit value'))['capture']['binning'] == '3'
            frame, = (await call('library_list_subframes', collection_name='Dark source'))['items']
            await call('library_remove_subframe', collection_name='Dark source', file_path=frame['file_path'])
            assert (await call('library_get', name='Dark source'))['subframe_count'] == 0
            if mode == 'copy':
                assert not Path(frame['file_path']).exists()
                assert paths[2].read_bytes() == b'fixture'
            await call('library_update', name='Dark source', new_name='Renamed dark')
            await finish(await call('library_add_subframes', collection_name='Renamed dark', source_paths=[str(paths[4])]))
            assert (await call('library_get', name='Renamed dark'))['subframe_count'] == 1
            headers = {'X-AstroPhoto-Local': '1', 'Sec-Fetch-Site': 'same-origin'}
            response = await browser.post('/astrophoto/v1/equipment', headers=headers,
                                          json={'equipment_type': 'filter', 'name': 'L filter', 'product_name': 'L'})
            assert response.status == 201
            filter_id = (await response.json())['id']
            response = await browser.post('/astrophoto/v1/optical-trains', headers=headers,
                                          json={'name': 'Test train', 'filter_ids': [filter_id]})
            assert response.status == 201
            final_import = await finish(await call('library_import', asset_type='image_result', name='Final', source_paths=[str(paths[6])],
                                   equipment={'equipment_group': 'Test train', 'filter_name': 'L filter'}))
            final = await call('library_get', name='Final')
            assert final_import['asset']['asset_type'] == final['asset_type'] == 'image_result'
            assert final['equipment_group'] == 'Test train' and final['filter_name'] == 'L filter'
            response = await browser.post('/astrophoto/v1/optical-trains', headers=headers,
                                          json={'name': 'Concurrent train'})
            assert response.status == 201
            concurrent_train = (await response.json())['id']
            update = CatalogClient.update

            async def change_train_before_update(client, route_name, row, changes):
                assert row['equipment_train_id'] != concurrent_train
                response = await browser.patch('/astrophoto/v1/catalog/' + route_name, headers=headers,
                                               json={'equipment_train_id': concurrent_train})
                assert response.status == 200
                return await update(client, route_name, row, changes)

            with monkeypatch.context() as patch:
                patch.setattr(CatalogClient, 'update', change_train_before_update)
                with pytest.raises(ToolError, match='REVISION_CONFLICT'):
                    await call('library_update', name='Final', equipment={'filter_state': 'none'})
            await call('library_update', name='Final', equipment={'filter_state': 'none'})
            final = await call('library_get', name='Final')
            assert final['equipment_group'] == 'Concurrent train' and final['filter_state'] == 'none'
            with pytest.raises(ToolError, match='INVALID_LIBRARY_REFERENCE'):
                await call('library_update', name='Final', notes='Must roll back', equipment={'filter_name': 'L filter'})
            final = await call('library_get', name='Final')
            assert final.get('notes') is None and final['filter_state'] == 'none'
            response = await browser.patch('/astrophoto/v1/optical-trains/' + concurrent_train, headers=headers,
                                           json={'filter_ids': [filter_id]})
            assert response.status == 200
            final = await call('library_update', name='Final', equipment={'filter_name': 'L filter'})
            assert final['equipment_group'] == 'Concurrent train' and final['filter_name'] == 'L filter'
            final = await call('library_update', name='Final', equipment=None)
            assert final.get('equipment_group') is None and final['filter_state'] == 'unknown'
            return started['task']
    try:
        task = asyncio.run(exercise())
    finally:
        runtime.storage.close()
    restarted = bootstrap(lambda: True, AppConfig('ComfyUI_AstroPhoto', '0.0.1', root))
    initialize_storage_runtime(restarted)
    restarted.trusted_local = True
    routes2 = web.RouteTableDef()
    register_routes(routes2, restarted)
    app2 = web.Application()
    app2.add_routes(routes2)

    async def verify_after_restart():
        async with TestClient(TestServer(app2)) as browser, Client(create_server(f'http://127.0.0.1:{browser.server.port}')) as agent:
            result = (await agent.call_tool('library_import_status', {'task': task})).data
            assert result['status'] == 'completed' and result['asset']['name'] == 'Lights'
    try:
        asyncio.run(verify_after_restart())
    finally:
        restarted.storage.close()
