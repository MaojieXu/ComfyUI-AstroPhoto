import asyncio
from uuid import uuid4

import httpx
import pytest
from fastmcp import Client

from astrophoto_mcp.disclosure import DESCRIPTIONS, ENTRY_POINTS, category_for
from astrophoto_mcp.server import create_server


@pytest.mark.parametrize('mode', ['auto', 'legacy'])
@pytest.mark.parametrize('address', [None, 'http://127.0.0.1:8188', 'http://example.test'])
def test_category_catalog_and_direct_calls(monkeypatch, mode, address):
    monkeypatch.delenv('COMFYUI_URL', raising=False)

    async def run():
        server = create_server(address)
        async with Client(server, mode=mode) as client:
            assert {t.name for t in await client.list_tools()} == ENTRY_POINTS
            token = server.local_provider.transforms[0]._bypass.set(True)
            try:
                underlying = await server.local_provider.list_tools()
            finally:
                server.local_provider.transforms[0]._bypass.reset(token)
            assert all(t.name in ENTRY_POINTS or category_for(t.name) for t in underlying)
            result = await client.call_tool('list_tool_categories', {})
            categories = {item['name'] for item in result.data['categories']}
            assert categories == (set(DESCRIPTIONS) if address != 'http://example.test' else {'connection'})
            names = set()
            for category in categories:
                page = (await client.call_tool('list_category_tools', {'category': category})).data
                for tool in page['tools']:
                    assert tool['name'] not in names
                    assert category_for(tool['name']) == category
                    assert tool['description'] and tool['inputSchema']['type'] == 'object'
                    names.add(tool['name'])
            assert ('connection_select' in names) == (address is None)
            assert len(names) == (66 if address is None else 2 if address == 'http://example.test' else 65)
            assert 'workflow_export' not in names
            assert (await client.call_tool('call_tool', {'name': 'version'})).data == (await client.call_tool('version', {})).data
            assert (await client.call_tool('call_tool', {'name': 'list_tool_categories'}, raise_on_error=False)).is_error
            assert (await client.call_tool('call_tool', {'name': 'missing'}, raise_on_error=False)).is_error
            canvas = await client.call_tool('list_category_tools', {'category': 'canvas'})
            assert {tool['name'] for tool in canvas.data['tools']} == (set() if address == 'http://example.test' else {
                'canvas_list_sessions', 'canvas_get', 'canvas_find_nodes', 'canvas_apply',
                'canvas_command_status', 'node_search', 'node_describe',
                'canvas_list_subgraphs', 'canvas_open_subgraph',
            })
    asyncio.run(run())


def test_auto_proxy_import_and_poll_retains_origin(monkeypatch, tmp_path):
    monkeypatch.delenv('COMFYUI_URL', raising=False)
    monkeypatch.setenv('ASTROPHOTO_MCP_STATE_DIR', str(tmp_path))
    monkeypatch.setattr('astrophoto_mcp.target.desktop_ports', lambda: set())
    live = {8000: 'original'}
    task = 'IMP-12345678'
    operation = '11111111-1111-4111-8111-111111111111'

    def respond(request):
        port = request.url.port
        if port not in live:
            raise httpx.ConnectError('offline', request=request)
        if request.url.path == '/astrophoto/v1/status':
            return httpx.Response(200, json={'extension': {'id': 'ComfyUI_AstroPhoto'},
                'runtime': {'routes_registered': True}, 'data_home': 'root', "capabilities": {"assets": {"available": True}, "equipment": {"available": True}}, 'storage_instance_id': live[port]})
        if request.url.path == '/astrophoto/v1/library/catalog-import':
            return httpx.Response(202, json={'operation_id': operation, 'task': task})
        if request.url.path == '/astrophoto/v1/library/catalog-import/' + task:
            return httpx.Response(200, json={'operation_id': operation, 'phase': 'completed', 'receipt': {'registered': 1}})
        return httpx.Response(404, json={})

    async def run():
        async with Client(create_server(transport=httpx.MockTransport(respond))) as client:
            result = await client.call_tool('call_tool', {'name': 'library_import', 'arguments': {
                'asset_type': 'video', 'name': 'Video', 'source_paths': ['C:/frame.avi']}})
            assert result.data['task'] == task
        live.clear()
        live.update({8000: 'replacement', 8188: 'original'})
        async with Client(create_server(transport=httpx.MockTransport(respond))) as client:
            result = await client.call_tool('call_tool', {'name': 'library_import_status', 'arguments': {'task': task}})
            assert result.data['imported'] == 1
    asyncio.run(run())


def test_proxy_preserves_structured_status_and_validation_error():
    def respond(request):
        if request.url.path.endswith('/system_stats'):
            return httpx.Response(200, json={'system': {'os': 'test'}})
        return httpx.Response(200, json={'vue-basic': {}})

    async def run():
        async with Client(create_server('http://example.test', transport=httpx.MockTransport(respond))) as client:
            direct = await client.call_tool('connection_status', {})
            proxy = await client.call_tool('call_tool', {'name': 'connection_status'})
            assert direct.structured_content["source"] == "manual"
            assert proxy.structured_content == direct.structured_content
            assert proxy.content == direct.content
            error = await client.call_tool('call_tool', {'name': 'version', 'arguments': {'extra': 1}},
                                           raise_on_error=False)
            assert error.is_error
    asyncio.run(run())


def test_workflow_recovers_task_receipt_and_cancels_only_selected_pending_job():
    choice, other = str(uuid4()), str(uuid4())
    queue = {choice, other}
    cancelled = []

    def respond(request):
        path = request.url.path
        if path == f"/astrophoto/v1/canvas/commands/{choice}":
            return httpx.Response(200, json={"command_id": choice, "action": "workflow_run", "state": "unconfirmed"})
        if path.startswith("/api/jobs/"):
            task_id = path.split("/")[3]
            if request.method == "POST":
                assert path.endswith("/cancel")
                cancelled.append(task_id)
                existed = task_id in queue
                queue.discard(task_id)
                return httpx.Response(200, json={"cancelled": existed})
            if task_id in queue:
                return httpx.Response(200, json={"id": task_id, "status": "pending"})
        return httpx.Response(404, json={})

    async def run():
        async with Client(create_server("http://127.0.0.1:8188", transport=httpx.MockTransport(respond))) as client:
            async def call(name, **arguments):
                return (await client.call_tool("call_tool", {"name": name, "arguments": arguments})).data

            assert (await call("workflow_status", request_id=choice))["task_id"] == choice
            assert (await call("workflow_cancel", task_id=choice))["cancel_requested"] is True
            assert (await call("workflow_status", task_id=choice))["state"] == "cancelled"
            assert (await call("workflow_status", task_id=other))["state"] == "pending"
            assert cancelled == [choice]

    asyncio.run(run())


def test_workflow_status_recovers_evicted_receipt_and_resolves_siril_output():
    task_id, output_id, foreign_id = (str(uuid4()) for _ in range(3))
    available = {output_id}

    def respond(request):
        path = request.url.path
        if path == f"/astrophoto/v1/canvas/commands/{task_id}":
            return httpx.Response(404, json={"error": {"code": "CANVAS_COMMAND_UNKNOWN"}})
        if path == f"/api/jobs/{task_id}":
            return httpx.Response(200, json={"id": task_id, "status": "completed",
                "outputs": {"7": {"astrophoto_output": [output_id, "not-a-uuid"]}}})
        if path == f"/astrophoto/v1/canvas/outputs/{output_id}" and output_id in available:
            return httpx.Response(200, json={"output_id": output_id, "filename": "stretched.fit",
                                              "path": "C:/outputs/stretched.fit", "size": 2880})
        return httpx.Response(404, json={"error": {"code": "OUTPUT_NOT_FOUND"}})

    async def run():
        async with Client(create_server("http://127.0.0.1:8188", transport=httpx.MockTransport(respond))) as client:
            async def call(name, **arguments):
                return (await client.call_tool("call_tool", {"name": name, "arguments": arguments})).data

            status = await call("workflow_status", request_id=task_id)
            assert status["state"] == "completed" and status["task_id"] == task_id
            assert len(status["outputs"]) == 1 and status["outputs"][0]["output_id"] == output_id
            artifact_id = status["outputs"][0]["artifact_id"]
            resolved = await call("artifact_get", artifact_id=artifact_id)
            assert resolved["availability"] == "available" and resolved["metadata"]["size"] == 2880
            available.clear()
            assert (await call("artifact_get", artifact_id=artifact_id))["availability"] == "missing"
            invalid = await client.call_tool("call_tool", {"name": "artifact_get", "arguments": {
                "artifact_id": foreign_id + ":0"}}, raise_on_error=False)
            assert invalid.is_error

    asyncio.run(run())
