import asyncio
import json
import warnings

from fastmcp import Client, FastMCP
from pydantic.json_schema import PydanticJsonSchemaWarning

from astrophoto_mcp.tools.equipment import register_equipment_tools, register_equipment_write_tools


class FakeAPI:
    def __init__(self):
        self.item = {'id': '11111111-1111-4111-8111-111111111111', 'name': 'Camera',
                     'equipment_type': 'camera', 'product_name': 'Canon', 'notes': 'old',
                     'archived_at_utc': None, 'row_version': 1}
        self.last_body = None
        self.train = {'id': '22222222-2222-4222-8222-222222222222', 'name': 'Group', 'notes': 'note',
                      'camera_id': self.item['id'], 'primary_optics_id': None, 'accessory_id': None,
                      'filter_ids': [], 'other_ids': [], 'archived_at_utc': None, 'row_version': 1,
                      'status': 'draft', 'summary': {'camera': 'Camera', 'primary_optics': None,
                                                    'accessories': [], 'filters': [], 'others': []}}

    async def get(self, path, kind, **kwargs):
        if path == 'optical-trains':
            return {'items': [self.train], 'total': 1, 'next': None}
        if path.startswith('optical-trains/'):
            return self.train
        if path == 'equipment':
            return {'items': [self.item], 'total': 1, 'next': None}
        return self.item

    async def request(self, method, path, kind, *, body=None, **kwargs):
        self.last_body = body
        if kind == 'train':
            self.train = {**self.train, **body}
            return self.train
        self.item = {**self.item, **body}
        return self.item


def test_schema_and_optional_update():
    async def exercise():
        api = FakeAPI()
        with warnings.catch_warnings():
            warnings.simplefilter('error', PydanticJsonSchemaWarning)
            server = FastMCP('test')
            register_equipment_tools(server, api)
            register_equipment_write_tools(server, api, read_api=api)
            async with Client(server) as client:
                tools = {tool.name: tool for tool in await client.list_tools()}
                schema = tools['equipment_create'].input_schema
                assert set(schema['required']) == {'equipment_type', 'name', 'product_name'}
                assert schema['properties']['equipment_type']['enum'] == [
                    'camera', 'primary_optics', 'optical_accessory', 'filter', 'other']
                assert 'notes' not in schema['required']
                list_schema = tools['equipment_list'].input_schema['properties']
                assert list_schema['archive_filter']['enum'] == ['active', 'archived', 'all']
                assert list_schema['sort_by']['enum'] == ['name_asc', 'name_desc', 'created_desc', 'updated_desc']
                assert {tool for tool in tools if tool.startswith('optical_train_revision')} == set()
                equipment_schema = tools['equipment_update'].input_schema
                assert equipment_schema['required'] == ['name']
                assert {'type': 'null'} in equipment_schema['properties']['notes']['anyOf']
                assert 'null' not in str(equipment_schema['properties']['new_name'])
                train_schema = tools['optical_train_update'].input_schema
                assert train_schema['required'] == ['name']
                assert {'type': 'null'} in train_schema['properties']['camera']['anyOf']
                assert 'null' not in str(train_schema['properties']['filters'])
                result = await client.call_tool('equipment_get', {'name': ' CAMERA '})
                assert json.loads(result.content[0].text)['name'] == 'Camera'
                await client.call_tool('equipment_update', {'name': 'Camera', 'product_name': 'New'})
                assert 'notes' not in api.last_body
                await client.call_tool('equipment_update', {'name': 'Camera', 'notes': 'new note'})
                assert api.last_body['notes'] == 'new note'
                await client.call_tool('equipment_update', {'name': 'Camera', 'notes': None})
                assert api.last_body['notes'] is None
                invalid = await client.call_tool('equipment_update', {'name': 'Camera', 'new_name': None}, raise_on_error=False)
                assert invalid.is_error
                api.train['filter_ids'] = ['33333333-3333-4333-8333-333333333333']
                await client.call_tool('optical_train_update', {'name': 'Group', 'notes': 'changed'})
                assert api.last_body['notes'] == 'changed' and 'camera_id' not in api.last_body
                assert 'filter_ids' not in api.last_body
                await client.call_tool('optical_train_update', {'name': 'Group', 'notes': None})
                assert api.last_body['notes'] is None
                await client.call_tool('optical_train_update', {'name': 'Group', 'camera': None})
                assert api.last_body['camera_id'] is None
                assert 'notes' not in api.last_body
                invalid = await client.call_tool('optical_train_update', {'name': 'Group', 'filters': None}, raise_on_error=False)
                assert invalid.is_error
                await client.call_tool('optical_train_update', {'name': 'Group', 'filters': []})
                assert api.last_body['filter_ids'] == []
                await client.call_tool('optical_train_create', {'name': 'New', 'camera': 'Camera'})
                assert api.last_body['camera_id'] == api.item['id']
                result = await client.call_tool('optical_train_create', {'name': 'Bad', 'filters': ['Camera']},
                                                raise_on_error=False)
                assert result.is_error and 'EQUIPMENT_TYPE_MISMATCH' in result.content[0].text
    asyncio.run(exercise())
