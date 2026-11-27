import asyncio
import os
import sys

import httpx
import pytest
from fastmcp import Client

from astrophoto_mcp.server import create_server


@pytest.fixture(autouse=True)
def isolated_task_history(monkeypatch, tmp_path):
    monkeypatch.setenv("ASTROPHOTO_MCP_STATE_DIR", str(tmp_path / "state"))


def test_discovery_multiple_selection_and_reconnect(monkeypatch):
    monkeypatch.delenv("COMFYUI_URL", raising=False)
    monkeypatch.setattr("astrophoto_mcp.target.desktop_ports", lambda: set())
    live = {8000: "A", 8188: "B"}
    requests = []

    def respond(request):
        if request.url.port not in live:
            raise httpx.ConnectError("offline", request=request)
        if request.url.path == "/astrophoto/v1/status":
            return httpx.Response(200, json={"extension": {"id": "ComfyUI_AstroPhoto"}, "runtime": {"routes_registered": True}, "data_home": "data-" + str(request.url.port), "capabilities": {"assets": {"available": True}, "equipment": {"available": True}}, "storage_instance_id": live[request.url.port]})
        if request.url.path == "/astrophoto/v1/catalog/projects":
            assert request.headers["X-AstroPhoto-Instance-ID"] == live[request.url.port]
            requests.append(live[request.url.port])
            if request.method == "POST":
                return httpx.Response(201, json={"name": "Target test"})
            return httpx.Response(200, json={"items": [], "next": None})
        return httpx.Response(404, json={})

    async def run():
        async with Client(create_server(transport=httpx.MockTransport(respond)), mode='legacy') as client:
            result = await client.call_tool("connection_status", {})
            status = result.structured_content
            assert len(status["candidates"]) == 2
            assert status["extension_registered"] and status["address"] is None
            assert status["connection_state"] == "selection_required"
            with pytest.raises(Exception, match="MULTIPLE_INSTANCES"):
                await client.call_tool("project_list", {})
            selection = next(item['selection'] for item in status['instances'] if item['address'] == 'http://127.0.0.1:8000/')
            await client.call_tool("connection_select", {"selection": selection})
            assert (await client.call_tool("project_list", {})).data["items"] == []
            live.update({8000: "B", 8188: "A"})
            assert (await client.call_tool("connection_status", {})).data["address"] == "http://127.0.0.1:8188/"
            await client.call_tool("project_create", {"name": "Target test"})
            del live[8188]
            status = (await client.call_tool("connection_status", {})).data
            assert status["extension_registered"] and status["address"] is None
            assert status["connection_state"] == "selected_instance_unavailable"
            with pytest.raises(Exception, match="SELECTED_INSTANCE_UNAVAILABLE"):
                await client.call_tool("project_create", {"name": "Target test"})
            live[8188] = "A"
            status = (await client.call_tool("connection_status", {})).data
            assert status["connection_state"] == "ready"
            assert status["address"] == "http://127.0.0.1:8188/"
            await client.call_tool("project_create", {"name": "Target test"})
            assert requests == ["A", "A", "A"]

    asyncio.run(run())


def test_selection_is_scoped_and_never_follows_replaced_instance(monkeypatch):
    monkeypatch.delenv("COMFYUI_URL", raising=False)
    monkeypatch.setattr("astrophoto_mcp.target.desktop_ports", lambda: set())
    live = {8000: "original", 8188: "other"}

    def respond(request):
        identity = live.get(request.url.port)
        if not identity:
            raise httpx.ConnectError("offline", request=request)
        return httpx.Response(200, json={
            "extension": {"id": "ComfyUI_AstroPhoto"}, "runtime": {"routes_registered": True},
            "data_home": "root", "storage_instance_id": identity,
            "capabilities": {"assets": {"available": True}, "equipment": {"available": True}},
        })

    async def run():
        server = create_server(transport=httpx.MockTransport(respond))
        async with Client(server, mode='legacy') as first, Client(server, mode='legacy') as second:
            status = (await first.call_tool('connection_status', {})).data
            choice = next(i['selection'] for i in status['instances'] if ':8000/' in i['address'])
            with pytest.raises(Exception, match='INVALID_SELECTION'):
                await second.call_tool('connection_select', {'selection': choice})
            live[8000] = 'replacement'
            with pytest.raises(Exception, match='INSTANCE_NOT_FOUND'):
                await first.call_tool('connection_select', {'selection': choice})
            status = (await first.call_tool('connection_status', {})).data
            with pytest.raises(Exception, match='INVALID_SELECTION'):
                await first.call_tool('connection_select', {'selection': choice})
            selection = next(i['selection'] for i in status['instances'] if ':8000/' in i['address'])
            assert (await first.call_tool('connection_select', {'selection': selection})).data['address'] == 'http://127.0.0.1:8000/'

    asyncio.run(run())


def test_modern_stdio_selection_through_discovery_tools(monkeypatch, tmp_path):
    from fastmcp.client.transports import StdioTransport

    script = tmp_path / 'selection_server.py'
    script.write_text('''\
import httpx
import astrophoto_mcp.target as target
from astrophoto_mcp.server import create_server
target.desktop_ports = lambda: set()
def respond(request):
    if request.url.port not in (8000, 8188):
        raise httpx.ConnectError("offline", request=request)
    return httpx.Response(200, json={"extension": {"id": "ComfyUI_AstroPhoto"},
        "runtime": {"routes_registered": True}, "data_home": "root-" + str(request.url.port),
        "storage_instance_id": "instance-" + str(request.url.port),
        "capabilities": {"assets": {"available": True}, "equipment": {"available": True}}})
create_server(transport=httpx.MockTransport(respond)).run(transport="stdio", show_banner=False)
''', encoding='utf-8')
    env = dict(os.environ)
    env.pop('COMFYUI_URL', None)
    transport = StdioTransport(command=sys.executable, args=[str(script)], env=env)

    async def run():
        async with Client(transport, mode='2026-07-28') as client:
            status = (await client.call_tool('call_tool', {'name': 'connection_status', 'arguments': {}})).data
            assert status['selection_available'] is True
            choice = next(item['selection'] for item in status['instances'] if ':8000/' in item['address'])
            result = await client.call_tool('call_tool', {'name': 'connection_select', 'arguments': {'selection': choice}})
            assert result.data['address'] == 'http://127.0.0.1:8000/'

    asyncio.run(run())


@pytest.mark.parametrize("desktop_ready", [True, False])
def test_discovery_prefers_usable_desktop(monkeypatch, desktop_ready):
    from astrophoto_mcp.target import LocalTarget

    monkeypatch.setattr("astrophoto_mcp.target.desktop_ports", lambda: {8190})
    ports = []

    def respond(request):
        port = request.url.port
        ports.append(port)
        ready = port == 8188 or (port == 8190 and desktop_ready)
        return httpx.Response(200, json={
            "extension": {"id": "ComfyUI_AstroPhoto"}, "runtime": {"routes_registered": True},
            "data_home": "data", "storage_instance_id": str(port),
            "capabilities": {"assets": {"available": ready}, "equipment": {"available": ready}},
        })

    async def run():
        target = LocalTarget(httpx.MockTransport(respond))
        assert await target.choose() == f"http://127.0.0.1:{8190 if desktop_ready else 8188}/"
        assert ports[0] == 8190
        assert set(ports) == ({8190} if desktop_ready else {8190, 8000, 8188})
        assert target.health["http://127.0.0.1:8190/"]

    asyncio.run(run())


def test_import_task_never_moves_to_another_instance(monkeypatch):
    from astrophoto_mcp.target import LocalTarget, TargetMiddleware
    from types import SimpleNamespace

    target = LocalTarget()
    target.tasks.query("IMP-12345678", ("http://127.0.0.1:8000/", "data"))
    async def probe(url):
        target.identities[url] = "data"
        return True
    target.probe = probe

    async def run():
        context = SimpleNamespace(message=SimpleNamespace(name="library_import_status", arguments={"task": "IMP-12345678"}))
        async def next_call(_context):
            assert target.current() == "http://127.0.0.1:8000/"
            return None
        await TargetMiddleware(target).on_call_tool(context, next_call)
        with pytest.raises(Exception, match="no target bound"):
            target.current()
        async def changed_instance(url):
            target.identities[url] = "different-data-root"
            return True
        target.probe = changed_instance
        with pytest.raises(Exception, match="TASK_ORIGIN_UNAVAILABLE"):
            await TargetMiddleware(target).on_call_tool(context, next_call)

    asyncio.run(run())


def test_no_instance_then_late_start(monkeypatch):
    from astrophoto_mcp.target import LocalTarget

    monkeypatch.delenv("COMFYUI_URL", raising=False)
    monkeypatch.setattr("astrophoto_mcp.target.desktop_ports", lambda: set())
    live = set()
    def respond(request):
        if request.url.port not in live:
            raise httpx.ConnectError("offline", request=request)
        return httpx.Response(200, json={"extension": {"id": "ComfyUI_AstroPhoto"},
                                         "runtime": {"routes_registered": True}, "data_home": "root", "capabilities": {"assets": {"available": True}, "equipment": {"available": True}}, "storage_instance_id": "storage-id"})
    async def run():
        target = LocalTarget(httpx.MockTransport(respond))
        with pytest.raises(Exception, match="COMFYUI_NOT_FOUND"):
            await target.choose()
        live.add(8188)
        assert await target.choose() == "http://127.0.0.1:8188/"
        async with Client(create_server(transport=target.transport)) as client:
            status = (await client.call_tool("connection_status", {})).data
            assert status["connection_state"] == "ready"
            assert status["address"] == "http://127.0.0.1:8188/"
    asyncio.run(run())


def test_import_result_records_origin_for_future_poll():
    from types import SimpleNamespace
    from astrophoto_mcp.target import LocalTarget, TargetMiddleware

    target = LocalTarget()
    async def choose():
        target.identities["http://127.0.0.1:8000/"] = "root"
        return "http://127.0.0.1:8000/"
    target.choose = choose
    async def run():
        context = SimpleNamespace(message=SimpleNamespace(name="library_import", arguments={}))
        async def next_call(_context):
            return SimpleNamespace(structured_content={"task": "IMP-12345678"})
        await TargetMiddleware(target).on_call_tool(context, next_call)
        assert LocalTarget().tasks.query("IMP-12345678") == [("http://127.0.0.1:8000/", "root")]
    asyncio.run(run())


def test_import_poll_remains_bound_to_original_host(monkeypatch):
    monkeypatch.delenv("COMFYUI_URL", raising=False)
    monkeypatch.setattr("astrophoto_mcp.target.desktop_ports", lambda: set())
    live = {8000: "original"}
    operation = "11111111-1111-4111-8111-111111111111"
    task = "IMP-12345678"

    def respond(request):
        if request.url.port not in live:
            raise httpx.ConnectError("offline", request=request)
        if request.url.path == "/astrophoto/v1/status":
            return httpx.Response(200, json={"extension": {"id": "ComfyUI_AstroPhoto"},
                                             "runtime": {"routes_registered": True}, "data_home": "same-path", "capabilities": {"assets": {"available": True}, "equipment": {"available": True}}, "storage_instance_id": live[request.url.port]})
        if request.url.path == "/astrophoto/v1/library/catalog-import":
            return httpx.Response(202, json={"operation_id": operation, "task": task})
        if request.url.path == "/astrophoto/v1/library/catalog-import/" + task:
            return httpx.Response(200, json={"operation_id": operation, "phase": "completed", "receipt": {"registered": 1}})
        return httpx.Response(404, json={})

    async def run():
        async with Client(create_server(transport=httpx.MockTransport(respond))) as client:
            result = await client.call_tool("library_import", {"asset_type": "video", "name": "Video", "source_paths": ["C:/frame.avi"]})
            assert result.data["task"] == task
        live.clear()
        live[8000] = "replacement"
        live[8188] = "different"
        async with Client(create_server(transport=httpx.MockTransport(respond))) as client:
            with pytest.raises(Exception, match="TASK_ORIGIN_UNAVAILABLE"):
                await client.call_tool("library_import_status", {"task": task})
            live[8188] = "original"
            assert (await client.call_tool("library_import_status", {"task": task})).data["imported"] == 1

    asyncio.run(run())


def test_explicit_target_is_never_replaced(monkeypatch):
    monkeypatch.setenv("COMFYUI_URL", "http://127.0.0.1:8000")
    seen = []
    def respond(request):
        seen.append(request.url.port)
        raise httpx.ConnectError("offline", request=request)
    async def run():
        async with Client(create_server("http://127.0.0.1:8188", transport=httpx.MockTransport(respond))) as client:
            result = await client.call_tool("project_list", {}, raise_on_error=False)
            assert result.is_error
            assert seen and set(seen) == {8188}
    asyncio.run(run())


def test_reports_comfyui_without_astrophoto(monkeypatch):
    monkeypatch.delenv("COMFYUI_URL", raising=False)
    monkeypatch.setattr("astrophoto_mcp.target.desktop_ports", lambda: set())
    def respond(request):
        if request.url.port != 8188:
            raise httpx.ConnectError("offline", request=request)
        if request.url.path == "/system_stats":
            return httpx.Response(200, json={"system": {}})
        return httpx.Response(404, json={})
    async def run():
        async with Client(create_server(transport=httpx.MockTransport(respond))) as client:
            status = (await client.call_tool("connection_status", {})).data
            assert status["reachable"] is True and status["extension_registered"] is False
            assert status["candidates"] == [] and status["connection_state"] == "no_candidates"
    asyncio.run(run())


@pytest.mark.parametrize("owner_matches", [True, False])
def test_desktop_lock_requires_listener_owner(tmp_path, monkeypatch, owner_matches):
    import sys

    from astrophoto_mcp.target import desktop_ports

    monkeypatch.setattr(sys, "platform", "win32")
    monkeypatch.setenv("APPDATA", str(tmp_path))
    directory = tmp_path / "Comfy Desktop" / "port-locks"
    directory.mkdir(parents=True)
    (directory / "port-8210.json").write_text('{"pid": 321}', encoding="utf-8")
    (directory / "port-8211.json").write_text('{"pid": true}', encoding="utf-8")
    monkeypatch.setattr("astrophoto_mcp.target.owns_listener",
                        lambda pid, port: owner_matches and (pid, port) == (321, 8210))
    assert desktop_ports() == ({8210} if owner_matches else set())


def test_lock_owner_matches_real_loopback_listener():
    import os
    import socket

    from astrophoto_mcp.target import owns_listener

    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        listener.listen()
        port = listener.getsockname()[1]
        assert owns_listener(os.getpid(), port)
    assert not owns_listener(os.getpid(), port)
