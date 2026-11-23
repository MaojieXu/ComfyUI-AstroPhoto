import asyncio
import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread

import anyio
import httpx
import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

from astrophoto_mcp.server import create_server

URL = "http://127.0.0.1:8188"
TOKEN = "test-library-" + "a" * 45
RECORD_ID = "11111111-1111-4111-8111-111111111111"
APPROVAL_ID = "22222222-2222-4222-8222-222222222222"
OPERATION_ID = "33333333-3333-4333-8333-333333333333"
PROJECT = {"id": RECORD_ID, "name": "M31", "revision": 1}
PENDING = {"approval_id": APPROVAL_ID, "status": "pending"}
PREFIX = "/astrophoto/v1/library/"
BASE_TOOLS = {"version", "connection_status"}
LIBRARY = {
    "library_list", "library_get", "library_create", "library_update", "library_delete",
    "library_approval_get", "library_import_request",
    "library_plan_mixed_import", "library_propose_import_group", "library_import_group_status",
    "library_retry_group_bindings",
}


@pytest.fixture
def library_server(monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", TOKEN)

    def build(handler):
        def check_request(request):
            assert request.headers["Authorization"] == f"Bearer {TOKEN}"
            assert {"x-astrophoto-local", "origin", "sec-fetch-site"}.isdisjoint(request.headers)
            return handler(request)

        return create_server(URL, transport=httpx.MockTransport(check_request))

    return build


@pytest.mark.parametrize(
    "url,token",
    [(URL, None), (URL, "short"), (URL + "/proxy", TOKEN), ("http://192.0.2.1", TOKEN),
     ("http://localhost:8188", TOKEN)],
)
def test_library_tools_require_opt_in_and_direct_loopback(monkeypatch, url, token):
    if token is not None:
        monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", token)

    async def exercise():
        async with Client(create_server(url)) as client:
            assert {tool.name for tool in await client.list_tools()} == BASE_TOOLS

    asyncio.run(exercise())


@pytest.mark.parametrize("mode", ["auto", "legacy"])
def test_library_discovery_and_protocol_annotations(monkeypatch, mode):
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", TOKEN)
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", "b" * 45)

    async def exercise():
        async with Client(create_server(URL), mode=mode) as client:
            tools = {tool.name: tool for tool in await client.list_tools()}
            assert {name for name in tools if name.startswith("library_")} == LIBRARY
            assert BASE_TOOLS | {"equipment_list", "optical_train_get"} <= tools.keys()
            assert tools["library_get"].annotations.read_only_hint is True
            assert tools["library_approval_get"].annotations.read_only_hint is True
            assert tools["library_delete"].annotations.destructive_hint is True
            assert tools["library_create"].annotations.open_world_hint is False
            assert tools["library_update"].input_schema["required"] == ["kind", "id", "revision", "changes"]
            assert "confirmed" not in tools["library_update"].input_schema["properties"]

    asyncio.run(exercise())


def test_library_project_crud_and_paginated_listing(library_server):
    updated = {**PROJECT, "name": "Andromeda", "revision": 2}
    path = f"projects/{RECORD_ID}"
    calls = iter([
        ("POST", "projects", {"name": "M31", "template": True}, 201, PROJECT),
        ("GET", "projects", {"q": "M31", "limit": "1"}, 200, {"items": [PROJECT], "next": RECORD_ID}),
        ("GET", "projects", {"q": "M31", "limit": "1", "after": RECORD_ID}, 200, {"items": [], "next": None}),
        ("GET", path, {}, 200, PROJECT),
        ("PATCH", path, {"revision": 1, "name": "Andromeda"}, 200, updated),
        ("DELETE", f"placements/{RECORD_ID}", {"revision": 2}, 200, {"id": RECORD_ID, "deleted": True}),
    ])

    def handler(request):
        method, route, payload, status, receipt = next(calls)
        assert (request.method, request.url.path) == (method, PREFIX + route)
        actual = json.loads(request.content) if request.content else dict(request.url.params)
        assert actual == payload
        return httpx.Response(status, json=receipt)

    async def exercise():
        async with Client(library_server(handler)) as client:
            created = await client.call_tool("library_create", {
                "kind": "projects", "record": {"name": "M31", "template": True},
            })
            assert created.data == PROJECT
            query = {"kind": "projects", "query": "M31", "limit": 1}
            first = await client.call_tool("library_list", query)
            assert first.data == {"items": [PROJECT], "next": RECORD_ID}
            second = await client.call_tool("library_list", {**query, "after": first.data["next"]})
            assert second.data == {"items": [], "next": None}
            read = await client.call_tool("library_get", {"kind": "projects", "id": RECORD_ID})
            assert read.data == created.data
            edit = await client.call_tool("library_update", {
                "kind": "projects", "id": RECORD_ID, "revision": read.data["revision"],
                "changes": {"name": "Andromeda"},
            })
            assert edit.data == updated
            unplace = await client.call_tool("library_delete", {
                "kind": "placements", "id": RECORD_ID, "revision": 2,
            })
            assert unplace.data == {"id": RECORD_ID, "deleted": True}
            assert next(calls, None) is None

    asyncio.run(exercise())


def test_sensitive_mutations_yield_approval_receipts(library_server):
    source = "C:/fixtures/capture/Ha.fit"
    import_payload = {
        "sources": [source], "settings_revision": 7, "attributes": {"usage": "light"}, "project_id": RECORD_ID,
    }
    approval_path = f"approvals/{APPROVAL_ID}"
    applied = {
        **PENDING, "status": "applied", "result": {"operation_id": OPERATION_ID},
        "operation": {"operation_id": OPERATION_ID, "phase": "completed", "receipt": {"registered": 1}},
    }
    calls = iter([
        ("POST", "assets", {"output_id": RECORD_ID}, 202, PENDING),
        ("PATCH", f"assets/{RECORD_ID}", {"revision": 0, "attributes": {"calibration_state": "calibrated"}}, 202, PENDING),
        ("DELETE", f"projects/{RECORD_ID}", {"revision": 2}, 202, PENDING),
        ("POST", "import-requests", import_payload, 202, PENDING),
        ("GET", approval_path, None, 200, PENDING),
        ("GET", approval_path, None, 200, {**PENDING, "status": "applying"}),
        ("GET", approval_path, None, 200, applied),
        ("GET", approval_path, None, 200, {**PENDING, "status": "denied"}),
    ])

    def handler(request):
        method, route, payload, status, receipt = next(calls)
        assert (request.method, request.url.path) == (method, PREFIX + route)
        body = json.loads(request.content) if request.content else None
        assert body == payload
        return httpx.Response(status, json=receipt)

    async def exercise():
        async with Client(library_server(handler)) as client:
            create = await client.call_tool("library_create", {"kind": "assets", "record": {"output_id": RECORD_ID}})
            assert create.data == PENDING
            edit = await client.call_tool("library_update", {
                "kind": "assets", "id": RECORD_ID, "revision": 0,
                "changes": {"attributes": {"calibration_state": "calibrated"}},
            })
            assert edit.data == PENDING
            remove = await client.call_tool("library_delete", {"kind": "projects", "id": RECORD_ID, "revision": 2})
            assert remove.data == PENDING
            imported = await client.call_tool("library_import_request", import_payload)
            assert imported.data == PENDING
            for state in ("pending", "applying", "applied", "denied"):
                receipt = await client.call_tool("library_approval_get", {"approval_id": APPROVAL_ID})
                assert receipt.data["status"] == state
                if state == "applied":
                    assert receipt.data == applied
            assert next(calls, None) is None

    asyncio.run(exercise())


@pytest.mark.parametrize(("tool_name", "args"), [
    ("library_create", {"kind": "assignments", "record": {"confirmed": True}}),
    ("library_delete", {"kind": "assets", "id": RECORD_ID, "revision": 0, "confirmed": True}),
    ("library_delete", {"kind": "assets", "id": RECORD_ID, "revision": -1}),
    ("library_get", {"kind": "approvals", "id": RECORD_ID}),
    ("library_get", {"kind": "projects", "id": "../approvals"}),
    ("library_list", {"kind": "assets", "filters": {"project_id": RECORD_ID}}),
    ("library_list", {"kind": "assets", "after": "invalid"}),
    ("library_list", {"kind": "assets", "limit": 0}),
])
def test_invalid_calls_never_reach_http(library_server, tool_name, args):
    seen = []

    def handler(request):
        seen.append(request)
        return httpx.Response(500)

    async def exercise():
        async with Client(library_server(handler)) as client:
            result = await client.call_tool(tool_name, args, raise_on_error=False)
            assert result.is_error
            assert not seen

    asyncio.run(exercise())


@pytest.mark.parametrize(("failure", "code"), [
    ("denied", "UNAUTHORIZED_LIBRARY_OPERATION"), ("redirect", "HTTP_ERROR"),
    ("network", "NETWORK_ERROR"), ("timeout", "TIMEOUT"), ("invalid-json", "INVALID_RESPONSE"),
    ("invalid-dto", "INVALID_RESPONSE"), ("invalid-approval", "INVALID_RESPONSE"),
])
def test_backend_errors_are_redacted_mcp_errors(library_server, failure, code):
    requests = []
    path = "C:/private/host/data"

    def handler(request):
        requests.append(request)
        if failure == "denied":
            return httpx.Response(403, json={"error": {
                "code": "UNAUTHORIZED_LIBRARY_OPERATION", "message": f"{TOKEN} {path}",
            }})
        if failure == "redirect":
            return httpx.Response(307, headers={"Location": "https://example.invalid/private"})
        if failure == "network":
            raise httpx.ConnectError(f"{TOKEN} {path}", request=request)
        if failure == "timeout":
            raise httpx.ReadTimeout(f"{TOKEN} {path}", request=request)
        if failure == "invalid-json":
            return httpx.Response(200, text=f"{TOKEN} {path}")
        if failure == "invalid-approval":
            return httpx.Response(202, json={"approval_id": RECORD_ID, "status": "applied"})
        return httpx.Response(200, json={"id": RECORD_ID, "revision": True})

    async def exercise():
        async with Client(library_server(handler)) as client:
            result = await client.call_tool("library_get", {"kind": "projects", "id": RECORD_ID}, raise_on_error=False)
            assert result.is_error
            error = result.content[0].text
            assert code in error and TOKEN not in error and path not in error
            assert len(requests) == 1

    asyncio.run(exercise())


def test_library_stdio_uses_real_loopback_http():
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_args):
            pass

        def do_GET(self):
            if (self.path != PREFIX + "projects/" + RECORD_ID
                    or self.headers.get("Authorization") != f"Bearer {TOKEN}"
                    or self.headers.get("X-AstroPhoto-Local") is not None):
                self.send_error(403)
                return
            body = json.dumps(PROJECT).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    async def exercise(port):
        transport = StdioTransport(
            command=sys.executable,
            args=["-m", "astrophoto_mcp"],
            env={"COMFYUI_URL": f"http://127.0.0.1:{port}", "ASTROPHOTO_LIBRARY_TOKEN": TOKEN},
            keep_alive=False,
        )
        with anyio.fail_after(30):
            async with Client(transport, mode="legacy") as client:
                assert {tool.name for tool in await client.list_tools()} == BASE_TOOLS | LIBRARY
                result = await client.call_tool("library_get", {"kind": "projects", "id": RECORD_ID})
                assert result.data == PROJECT

    with ThreadingHTTPServer(("127.0.0.1", 0), Handler) as backend:
        thread = Thread(target=backend.serve_forever, kwargs={"poll_interval": 0.05}, daemon=True)
        thread.start()
        try:
            asyncio.run(exercise(backend.server_port))
        finally:
            backend.shutdown()
            thread.join()
