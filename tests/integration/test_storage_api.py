import asyncio

from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig

BASE = "/astrophoto/v1"
LOCAL = {"X-AstroPhoto-Local": "1"}


def test_http_storage_import_and_access_boundary(tmp_path, monkeypatch):
    capture = tmp_path / "capture"
    capture.mkdir()
    file = capture / "capture.fit"
    file.write_bytes(b"original")
    monkeypatch.setenv("ASTROPHOTO_IMPORT_ROOTS", str(capture))
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            path = BASE + "/storage"
            response = await client.get(path, headers=LOCAL)
            assert (await response.json())["status"] == "unavailable"
            denied = await client.patch(path + "/settings", json={}, headers={**LOCAL, "Comfy-User": "someone"})
            assert denied.status == 403 and (await denied.json())["error"]["code"] == "UNAUTHORIZED_STORAGE_OPERATION"
            runtime.trusted_local = True
            forbidden = await client.get(path, headers={**LOCAL, "Origin": "https://example.invalid"})
            assert (await forbidden.json())["status"] == "unavailable"
            proxied = await client.get(path, headers={**LOCAL, "X-Forwarded-For": "127.0.0.1"})
            assert (await proxied.json())["status"] == "unavailable"
            response = await client.get(path, headers=LOCAL)
            data = await response.json()
            assert response.status == 200 and data["status"] == "ready"
            assert data["workspaces"][0]["status"] == "online"
            registered = await client.post(path + "/locations", headers=LOCAL, json={"path": str(tmp_path / "extra"), "name": "Extra"})
            assert registered.status == 201
            workspace = await registered.json()
            workspace_path = path + "/locations/" + workspace["id"]
            validated = await client.post(workspace_path + "/validate", headers=LOCAL, json={})
            assert (await validated.json())["status"] == "online"
            disabled = await client.patch(workspace_path, headers=LOCAL, json={"expected_revision": 0, "enabled": False})
            assert (await disabled.json())["status"] == "disabled"
            removed = await client.delete(workspace_path, headers=LOCAL, json={"expected_revision": 1})
            assert (await removed.json())["removed"] and (tmp_path / "extra").is_dir()
            for invalid in ["move", None]:
                invalid_mode = await client.patch(path + "/settings", json={
                    "expected_revision": 0, "imports": {"default_mode": invalid},
                }, headers=LOCAL)
                assert invalid_mode.status == 422
                assert (await invalid_mode.json())["error"]["code"] == "INVALID_IMPORT_MODE"
            settings = await client.patch(path + "/settings", json={
                "expected_revision": 0, "imports": {"default_mode": "copy"},
            }, headers=LOCAL)
            assert settings.status == 200
            assert (await settings.json())["revision"] == 1
            conflict = await client.patch(path + "/settings", json={
                "expected_revision": 0, "imports": {"default_mode": "reference"},
            }, headers=LOCAL)
            assert conflict.status == 409
            invalid_source = await client.post(BASE + "/assets/import/preview", headers=LOCAL,
                                               json={"sources": [str(runtime.config.data_home / "config/settings.json")]})
            assert invalid_source.status == 403
            preview = await client.post(BASE + "/assets/import/preview", headers=LOCAL, json={"sources": [str(file)]})
            assert (await preview.json())["size_bytes"] == 8
            payload = {"sources": [str(file)], "idempotency_key": "http", "import_mode_override": "copy"}
            accepted = await client.post(BASE + "/assets/import", json=payload, headers=LOCAL)
            data = await accepted.json()
            assert accepted.status == 202 and "phase" not in data
            for _ in range(150):
                response = await client.get(BASE + "/assets/imports/" + data["operation_id"], headers=LOCAL)
                job = await response.json()
                if job["phase"] in ("completed", "failed"):
                    break
                await asyncio.sleep(0.025)
            assert job["phase"] == "completed" and job["receipt"]["copied"] == 1
            listing = await client.get(BASE + "/assets", headers=LOCAL)
            assert (await listing.json())["assets"][0]["storage_mode"] == "managed"

    asyncio.run(exercise())
    runtime.storage.operations.pool.shutdown(wait=True)
    assert file.read_bytes() == b"original"


def test_invalid_storage_config_preserves_status_route(extension, tmp_path, monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_HOME", str(tmp_path / "unsafe"))
    (tmp_path / "unsafe").mkdir()
    (tmp_path / "unsafe/keep").write_bytes(b"user")
    async def exercise():
        plugin = await extension.module.comfy_entrypoint()
        await plugin.on_load()
        extension.registry["vue-basic"] = (await plugin.get_node_list())[0]
        app = web.Application()
        app.add_routes(extension.routes)
        async with TestClient(TestServer(app)) as client:
            response = await client.get(BASE + "/status")
            status = await response.json()
            assert response.status == 200 and status["status"] == "degraded"
            assert not status["capabilities"]["storage"]["available"]
            assert status["capabilities"]["drawing_node"]["available"]
    asyncio.run(exercise())
    assert list((tmp_path / "unsafe").iterdir()) == [tmp_path / "unsafe/keep"]

