"""FastMCP protocol client against the real Extension HTTP library routes."""

import asyncio
import json

import anyio
import httpx
import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from fastmcp import Client
from fastmcp.client.elicitation import ElicitResult
from fastmcp.exceptions import ToolError
from mcp.shared.exceptions import MCPError
from mcp_types.version import MODERN_PROTOCOL_VERSIONS

from astrophoto.api import library
from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto_mcp.server import create_server

BROWSER = {"Sec-Fetch-Site": "same-origin", "X-AstroPhoto-Local": "1"}
PREFIX = "/astrophoto/v1/library"


def test_agent_import_and_scientific_metadata_require_browser_approval(tmp_path, monkeypatch):
    token = "library-test-" + "a" * 45
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", token)
    source = tmp_path / "ha.fit"
    source.write_bytes(b"isolated fixture")
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    runtime.trusted_local = True
    assert runtime.storage is not None, runtime.storage_error
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)

    async def exercise():
        async with TestClient(TestServer(app)) as browser:
            assert browser.server.port is not None
            async with Client(create_server(f"http://127.0.0.1:{browser.server.port}")) as agent:
                project = await agent.call_tool("library_create", {
                    "kind": "projects", "record": {"name": "M31", "template": True},
                })
                project_id = project.data["id"]
                request = await agent.call_tool("library_import_request", {
                    "sources": [str(source)], "project_id": project_id, "attributes": {"usage": "light"},
                })
                assert request.data["status"] == "pending"
                pending = await agent.call_tool("library_list", {"kind": "assets", "project_id": project_id})
                assert pending.data["items"] == []

                path = f"{PREFIX}/approvals/{request.data['approval_id']}"
                denied = await browser.post(path, json={"approved": True}, headers={"Authorization": f"Bearer {token}"})
                assert denied.status == 403
                accepted = await browser.post(path, json={"approved": True}, headers=BROWSER)
                assert accepted.status == 200, await accepted.text()
                assert (await accepted.json())["status"] == "applied"
                with anyio.fail_after(10):
                    while True:
                        status = await agent.call_tool("library_approval_get", {"approval_id": request.data["approval_id"]})
                        assert status.data["status"] == "applied"
                        operation = status.data["operation"]
                        if operation["phase"] in {"completed", "failed", "cancelled"}:
                            break
                        await asyncio.sleep(0.025)
                assert operation["phase"] == "completed", operation
                assert operation["receipt"]["registered"] == 1

                listing = await agent.call_tool("library_list", {"kind": "assets", "project_id": project_id})
                assert len(listing.data["items"]) == 1
                asset = listing.data["items"][0]
                assert asset["attributes"] == {"usage": "light"}
                suggestion = await agent.call_tool("library_update", {
                    "kind": "assets", "id": asset["id"], "revision": asset["revision"],
                    "changes": {"attributes": {"role": "master_frame"}},
                })
                assert suggestion.data["status"] == "pending"
                before = await agent.call_tool("library_get", {"kind": "assets", "id": asset["id"]})
                assert "role" not in before.data["attributes"]
                decision = await browser.post(
                    f"{PREFIX}/approvals/{suggestion.data['approval_id']}", json={"approved": True}, headers=BROWSER,
                )
                assert decision.status == 200, await decision.text()
                after = await agent.call_tool("library_get", {"kind": "assets", "id": asset["id"]})
                assert after.data["attributes"] == {"usage": "light", "role": "master_frame"}
                assert after.data["revision"] == asset["revision"] + 1

                now = 1_800_000_000
                monkeypatch.setattr(library, "time", lambda: now)
                with runtime.storage.db.session(transaction="write") as session:
                    legacy = runtime.storage.library._save(session, "approvals", {"status": "pending"})
                    legacy_id = legacy.id
                    for _ in range(99):
                        runtime.storage.library._save(session, "approvals", {
                            "status": "pending", "expires_at": now + library.APPROVAL_TTL_SECONDS,
                        })
                bearer = {"Authorization": f"Bearer {token}"}
                request_body = {"sources": [str(source)], "project_id": project_id}
                new_proposal = await browser.post(f"{PREFIX}/import-requests", json=request_body, headers=bearer)
                assert new_proposal.status == 202, await new_proposal.text()
                new_id = (await new_proposal.json())["approval_id"]
                busy = await browser.post(f"{PREFIX}/import-requests", json=request_body, headers=bearer)
                assert busy.status == 423, await busy.text()

                now += library.APPROVAL_TTL_SECONDS
                for proposal_id in (new_id, legacy_id):
                    status = await agent.call_tool("library_approval_get", {"approval_id": proposal_id})
                    assert status.data["approval_id"] == proposal_id
                    assert status.data["status"] == "expired"
                    assert "result" not in status.data
                    expired = await browser.post(
                        f"{PREFIX}/approvals/{proposal_id}", json={"approved": True}, headers=BROWSER,
                    )
                    assert expired.status == 409, await expired.text()
                listed = await browser.get(f"{PREFIX}/approvals", headers=BROWSER)
                assert (await listed.json())["items"] == []
                replacement = await browser.post(f"{PREFIX}/import-requests", json=request_body, headers=bearer)
                assert replacement.status == 202, await replacement.text()
                listing = await agent.call_tool("library_list", {"kind": "assets", "project_id": project_id})
                assert len(listing.data["items"]) == 1

    try:
        asyncio.run(exercise())
    finally:
        runtime.storage.close()
    assert source.read_bytes() == b"isolated fixture"


@pytest.mark.parametrize("mode", ["auto", "legacy"])
@pytest.mark.parametrize(("user_answer", "expected"), [
    (True, "approved"), (False, "denied"), (None, "pending"), ("unsupported", "pending"),
])
def test_group_confirmation_comes_from_chat_elicitation(monkeypatch, mode, user_answer, expected):
    library_token = "l" * 44
    approval_token = "a" * 44
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", library_token)
    monkeypatch.setenv("ASTROPHOTO_APPROVAL_TOKEN", approval_token)
    monkeypatch.setenv("ASTROPHOTO_TRUST_CHAT_APPROVALS", "1")
    identifier = "27dccb63-88a8-46c1-9cdb-90bd33fb3b28"
    digest = "f" * 64
    group = {
        "group_id": identifier, "project_name": "M31", "optical_train_name": "Rasa",
        "sources": ["C:/frames/light-01.fit"], "attributes": {"filter": "Ha"},
        "binding": {"master_ids": []}, "preview": {"effective_import_mode": "reference"},
    }
    proposal = {"id": identifier, "approval_id": identifier, "digest": digest, "status": "pending", "group": group}
    decisions = []
    shown = []

    def respond(request):
        assert request.url.path == f"{PREFIX}/agent-imports/{identifier}" + (
            "/decision" if request.method == "POST" else "")
        if request.method == "GET":
            assert request.headers["Authorization"] == f"Bearer {library_token}"
            return httpx.Response(200, json=proposal)
        assert request.headers["Authorization"] == f"Bearer {approval_token}"
        decisions.append(json.loads(request.content))
        return httpx.Response(200, json={**proposal, "status": decisions[-1]["decision"]})

    async def ask(message, _schema, _params, _context):
        shown.append(message)
        assert all(value in message for value in (digest, "M31", "Rasa", "Ha", "light-01.fit"))
        return ElicitResult(action="cancel") if user_answer is None else user_answer

    async def exercise():
        server = create_server("http://127.0.0.1:8188", transport=httpx.MockTransport(respond))
        async with Client(server, mode=mode, elicitation_handler=None if user_answer == "unsupported" else ask) as client:
            assert (client.protocol_version in MODERN_PROTOCOL_VERSIONS) == (mode == "auto")
            tool = next(tool for tool in await client.list_tools() if tool.name == "library_confirm_import_group")
            assert tool.input_schema["required"] == ["approval_id"]
            assert set(tool.input_schema["properties"]) == {"approval_id"}
            if user_answer == "unsupported":
                with pytest.raises((ToolError, MCPError), match="not supported|cannot provide a user decision"):
                    await client.call_tool(tool.name, {"approval_id": identifier})
            else:
                result = await client.call_tool(tool.name, {"approval_id": identifier})
                assert result.data["status"] == expected

    asyncio.run(exercise())
    assert len(shown) == (0 if user_answer == "unsupported" else 1)
    assert decisions == ([] if expected == "pending" else [{"digest": digest, "decision": expected}])


def test_mixed_group_chat_approval_applies_only_the_approved_group(tmp_path, monkeypatch):
    library_token, approval_token = "l" * 44, "a" * 44
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", library_token)
    monkeypatch.setenv("ASTROPHOTO_APPROVAL_TOKEN", approval_token)
    monkeypatch.setenv("ASTROPHOTO_TRUST_CHAT_APPROVALS", "1")
    light, dark = tmp_path / "light.png", tmp_path / "dark.png"
    light.write_bytes(b"light")
    dark.write_bytes(b"dark")
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    runtime.trusted_local = True
    storage = runtime.storage
    assert storage is not None, runtime.storage_error
    camera = storage.equipment.create_equipment({"name": "Guide-Cam", "equipment_type": "camera"})
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)
    shown = []

    async def ask(message, _schema, _params, _context):
        shown.append(message)
        return '"usage": "light"' in message

    async def exercise():
        async with TestClient(TestServer(app)) as host, Client(
            create_server(f"http://127.0.0.1:{host.server.port}"), elicitation_handler=ask,
        ) as client:
            plan = (await client.call_tool("library_plan_mixed_import", {
                "items": [
                    {"path": str(light), "attributes": {"usage": "light"}, "camera_name": camera["name"]},
                    {"path": str(dark), "attributes": {"usage": "dark"}, "camera_name": camera["name"]},
                ], "auto_calibration": False,
            })).data
            assert not plan["unresolved"]
            assert len(plan["groups"]) == 2
            for group in plan["groups"]:
                assert group["binding"]["camera_id"] == camera["id"]
                proposal = (await client.call_tool("library_propose_import_group", {
                    "plan_id": plan["plan_id"], "group_id": group["group_id"],
                })).data
                proposal_id = {"approval_id": proposal["id"]}
                result = (await client.call_tool("library_confirm_import_group", proposal_id)).data
                if group["attributes"]["usage"] == "dark":
                    assert result["status"] == "denied"
                    continue
                with anyio.fail_after(10):
                    while result["status"] in {"approved", "importing", "binding_pending"}:
                        await asyncio.sleep(0.025)
                        result = (await client.call_tool("library_import_group_status", proposal_id)).data
                assert result["status"] == "completed", result
            listing = (await client.call_tool("library_list", {"kind": "assets"})).data["items"]
            assert [item["name"] for item in listing] == [light.name]
            assert listing[0]["attributes"]["camera_id"] == camera["id"]

    try:
        asyncio.run(exercise())
    finally:
        storage.close()
    assert len(shown) == 2
    assert light.read_bytes() == b"light"
    assert dark.read_bytes() == b"dark"
