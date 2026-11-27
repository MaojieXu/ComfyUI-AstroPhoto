import asyncio

from fastmcp import Client, FastMCP
from astrophoto_mcp.tools.projects import register_projects


def test_project_update_reports_only_actual_changes_and_clears():
    class Catalog:
        def __init__(self):
            self.row = {'id': 'fixture', 'name': 'M31', 'notes': 'old'}
        async def call(self, method, route, *, params=None, body=None):
            assert method == 'GET' and route == 'projects'
            return {'project': dict(self.row)}
        async def update(self, route, row, changes):
            self.row.update(changes)
            return dict(self.row)
    async def exercise():
        server = FastMCP('test')
        register_projects(server, Catalog())
        async with Client(server) as client:
            result = await client.call_tool('project_update', {'project_name': 'M31', 'notes': None})
            assert result.data['changed'] == ['notes']
            assert result.data['cleared'] == ['notes']
            result = await client.call_tool('project_update', {'project_name': 'M31', 'notes': None})
            assert result.data['changed'] == [] and result.data['cleared'] == []
    asyncio.run(exercise())
