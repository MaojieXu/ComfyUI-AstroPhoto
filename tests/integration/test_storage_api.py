import asyncio

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.storage.initializer import WORKSPACE_MARKER

BASE = "/astrophoto/v1"
LOCAL = {"X-AstroPhoto-Local": "1"}


@pytest.fixture
def coordinated_storage_app(tmp_path, monkeypatch):
    home = tmp_path / "home"
    home.mkdir()
    monkeypatch.setenv("HOME", str(home))
    monkeypatch.setenv("USERPROFILE", str(home))
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime, coordinate=True)
    assert runtime.storage is not None, runtime.storage_error
    runtime.trusted_local = True
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)
    try:
        yield app, runtime.storage
    finally:
        runtime.storage.close()


def test_storage_init_validates_request_before_writing(coordinated_storage_app):
    app, storage = coordinated_storage_app
    workspace_id = storage.initial_workspace_id
    directory = storage.root / "storage" / workspace_id / "outputs"
    directory.rmdir()

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            url = BASE + "/storage/init"
            for headers in ({}, {**LOCAL, "Origin": "https://example.org"}, {**LOCAL, "Forwarded": "for=proxy"}):
                response = await client.post(url, headers=headers, json={})
                assert response.status == 403
                assert not directory.exists()
            for args in ({}, {"json": []}, {"json": {"path": str(storage.root)}}, {"data": "{}"}):
                response = await client.post(url, headers=LOCAL, **args)
                assert response.status == 422
                assert (await response.json())["error"]["code"] == "INVALID_REQUEST"
                assert not directory.exists()
            response = await client.post(url, headers=LOCAL, json={})
            assert response.status == 200
            receipt = await response.json()
            assert receipt["created"] == [f"storage/{workspace_id}/outputs/"]
            assert receipt["checks"] == dict.fromkeys(("config", "database", "storage", "runtime"), "ready")
            assert receipt["data_root"] == str(storage.root)
            assert response.headers["Cache-Control"] == "no-store"
            assert directory.is_dir()

    asyncio.run(exercise())


def test_http_storage_import_and_access_boundary(tmp_path, monkeypatch):
    capture = tmp_path / "capture"
    capture.mkdir()
    file = capture / "capture.fit"
    file.write_bytes(b"original")
    monkeypatch.delenv("ASTROPHOTO_IMPORT_ROOTS", raising=False)
    monkeypatch.delenv("ASTROPHOTO_LOCAL_STORAGE", raising=False)
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
            browser = await client.get(path, headers={"Sec-Fetch-Site": "same-origin"})
            assert (await browser.json())["capabilities"]["import"]
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
            after_cleanup = await client.get(path, headers=LOCAL)
            assert workspace["id"] not in {row["id"] for row in (await after_cleanup.json())["workspaces"]}
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


def test_http_data_root_preflight_reports_move_blockers(coordinated_storage_app, tmp_path):
    app, storage = coordinated_storage_app
    capture = tmp_path / "capture.fit"
    capture.write_bytes(b"original")
    destination = tmp_path / "destination"

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            path = BASE + "/storage"
            snapshot = await client.get(path, headers=LOCAL)
            workspace = (await snapshot.json())["default_workspace_id"]
            accepted = await client.post(BASE + "/assets/import", headers=LOCAL, json={
                "sources": [str(capture)], "import_mode_override": "copy", "idempotency_key": "preflight-copy",
            })
            assert accepted.status == 202
            operation = (await accepted.json())["operation_id"]
            for _ in range(150):
                response = await client.get(BASE + "/assets/imports/" + operation, headers=LOCAL)
                job = await response.json()
                if job["phase"] in ("completed", "failed"):
                    break
                await asyncio.sleep(0.025)
            assert job["phase"] == "completed" and job["receipt"]["copied"] == 1
            asset = storage.assets.list()["assets"][0]["id"]
            managed = storage.assets.resolve_asset(asset)
            root = storage.root / "workspace"
            relative = managed.relative_to(root).as_posix()
            payload = {"target_path": str(destination)}

            async def preflight_error(status, code):
                result = await client.post(path + "/data-root/preflight", headers=LOCAL, json=payload)
                assert result.status == status
                error = (await result.json())["error"]
                assert error["code"] == code
                return error["details"]

            managed.unlink()
            details = await preflight_error(409, "WORKSPACE_FILES_MISSING")
            assert details["workspace_id"] == workspace and details["missing_count"] == 1
            assert details["missing"] == [{"asset_id": asset, "relative_key": relative}]
            validation = await client.post(f"{path}/locations/{workspace}/validate", headers=LOCAL, json={})
            snapshot = await client.get(path, headers=LOCAL)
            for row in (await validation.json(), (await snapshot.json())["workspaces"][0]):
                assert row["status"] == "partial" and row["missing"] == details["missing"]
            managed.write_bytes(capture.read_bytes())

            marker = root / WORKSPACE_MARKER
            original_marker = marker.read_bytes()
            marker.write_text("{}", encoding="utf-8")
            details = await preflight_error(409, "WORKSPACE_IDENTITY_MISMATCH")
            assert details == {"workspace_id": workspace, "path": str(root)}
            marker.write_bytes(original_marker)

            staged = root / ".staging" / "orphan.part"
            staged.write_bytes(b"interrupted")
            details = await preflight_error(409, "RECOVERY_REQUIRED")
            assert details["workspace_id"] == workspace and details["entries"] == [".staging/orphan.part"]
            staged.unlink()

            job = storage.operations.create("migration", "pending-move", {}, {"workspace_id": workspace})
            details = await preflight_error(423, "STORAGE_BUSY")
            assert details["active_operations"] == [{"id": job.id, "kind": "migration", "phase": "queued"}]
            storage.operations.advance(job.id, phase="cancelled")

            destination.mkdir()
            occupied = destination / "keep.txt"
            occupied.write_bytes(b"user")
            details = await preflight_error(409, "TARGET_NOT_EMPTY")
            assert details == {"target": str(destination), "entries": ["keep.txt"]}
            assert occupied.read_bytes() == b"user"
            occupied.unlink()
            ready = await client.post(path + "/data-root/preflight", headers=LOCAL, json=payload)
            assert ready.status == 200
            plan = await ready.json()
            assert plan["source"] == str(storage.root) and plan["target"] == str(destination)
            assert plan["files"] > 0 and plan["copy_bytes"] > len(capture.read_bytes())
            assert not list(destination.iterdir())
            assert storage.assets.resolve_asset(asset).read_bytes() == capture.read_bytes()

    asyncio.run(exercise())


def test_http_active_migration_target_cannot_be_removed(coordinated_storage_app, tmp_path):
    app, storage = coordinated_storage_app
    destination = tmp_path / "target-workspace"

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            path = BASE + "/storage"
            snapshot = await client.get(path, headers=LOCAL)
            source = (await snapshot.json())["default_workspace_id"]
            created = await client.post(path + "/locations", headers=LOCAL, json={"path": str(destination), "name": "Target"})
            assert created.status == 201
            workspace = await created.json()
            # Model a durable migration checkpoint without a worker holding the destination lease.
            job = storage.operations.create("migration", "active-target", {}, {
                "workspace_id": source, "target_workspace_id": workspace["id"],
            })
            storage.operations.advance(job.id, phase="copying")
            url = f"{path}/locations/{workspace['id']}"
            payload = {"expected_revision": workspace["revision"]}
            blocked = await client.delete(url, headers=LOCAL, json=payload)
            assert blocked.status == 423 and (await blocked.json())["error"]["code"] == "STORAGE_BUSY"
            active = await client.get(path, headers=LOCAL)
            active_target = next(row for row in (await active.json())["workspaces"] if row["id"] == workspace["id"])
            assert active_target["status"] == "migrating" and active_target["revision"] == workspace["revision"]

            storage.operations.advance(job.id, phase="cancelled")
            deleted = await client.delete(url, headers=LOCAL, json=payload)
            assert deleted.status == 200 and (await deleted.json())["removed"]
            after = await client.get(path, headers=LOCAL)
            assert workspace["id"] not in {row["id"] for row in (await after.json())["workspaces"]}
            assert destination.is_dir() and (destination / WORKSPACE_MARKER).is_file()

    asyncio.run(exercise())

