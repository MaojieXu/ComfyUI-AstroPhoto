"""FastMCP protocol client against the real Extension HTTP library routes."""

import asyncio

import anyio
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from fastmcp import Client

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

    try:
        asyncio.run(exercise())
    finally:
        runtime.storage.close()
    assert source.read_bytes() == b"isolated fixture"
