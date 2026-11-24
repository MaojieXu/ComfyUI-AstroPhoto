import asyncio
import threading
from pathlib import Path
from uuid import uuid4

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig, read_json, write_json_atomically
from astrophoto.core.errors import StorageError
from astrophoto.storage.initializer import WORKSPACE_MARKER
from astrophoto.storage.runtime import StorageRuntime

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
    directory = storage.workspaces.require(workspace_id) / "outputs"
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


def test_operation_list_reports_live_import_and_migration_without_storage_scan(coordinated_storage_app, monkeypatch):
    app, storage = coordinated_storage_app
    from astrophoto.database.library_models import LibraryRecord

    migration = storage.operations.create("migration", str(uuid4()), {}, {"workspace_id": storage.initial_workspace_id})
    imported = storage.operations.create("import", str(uuid4()), {}, {"effective_import_mode": "reference"})
    storage.operations.advance(migration.id, phase="copying", receipt={"processed": 1, "total": 3, "_private": "secret"})
    storage.operations.advance(imported.id, phase="importing", receipt={"processed": 2, "total": 4})
    active_direct = {str(uuid4()) for _ in range(17)}
    monkeypatch.setattr(storage.direct_imports, "active_job_ids", lambda: active_direct)
    with storage.db.session() as session:
        for index, job_id in enumerate(active_direct):
            session.add(LibraryRecord(id=job_id, kind="direct_import", data={
                "phase": "importing", "created_ns": index, "copied": 0, "total": 1,
            }))
    monkeypatch.setattr(storage, "snapshot", lambda *_args: pytest.fail("operation list must not scan storage"))

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            url = BASE + "/storage/operations"
            assert (await client.get(url)).status == 403
            response = await client.get(url, headers=LOCAL)
            assert response.status == 200
            assert response.headers["Cache-Control"] == "no-store"
            items = {item["operation_id"]: item for item in (await response.json())["operations"]}
            assert items[migration.id]["phase"] == "copying"
            assert items[migration.id]["receipt"] == {"processed": 1, "total": 3}
            assert items[imported.id]["receipt"] == {"processed": 2, "total": 4}
            assert items[imported.id]["effective_import_mode"] == "reference"
            assert {item["operation_id"] for item in items.values() if item["receipt"].get("direct_import")
                    and item["phase"] == "importing"} == active_direct
        storage.operations.advance(migration.id, phase="cancelled")
        storage.operations.advance(imported.id, phase="cancelled")

    asyncio.run(exercise())


def test_location_policy_http_and_ordered_capacity(coordinated_storage_app, tmp_path):
    app, storage = coordinated_storage_app

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            first = storage.initial_workspace_id
            response = await client.post(BASE + "/storage/locations", headers=LOCAL,
                                         json={"path": str(tmp_path / "second"), "name": "Second"})
            assert response.status == 201
            second = (await response.json())["id"]
            response = await client.get(BASE + "/storage", headers=LOCAL)
            revision = (await response.json())["imports"]["revision"]
            policy = {"expected_revision": revision, "order": [second, first],
                      "quotas": {first: 10, second: 20}}
            response = await client.put(BASE + "/storage/location-policy", headers=LOCAL, json=policy)
            assert response.status == 200
            response = await client.get(BASE + "/storage", headers=LOCAL)
            data = await response.json()
            assert [row["id"] for row in data["workspaces"]] == [second, first]
            assert [row["quota_bytes"] for row in data["workspaces"]] == [20, 10]
            assert storage.capacity.select_workspace(11) == second
            with pytest.raises(StorageError, match="NO_AVAILABLE_WORKSPACE"):
                storage.capacity.select_workspace(21)

    asyncio.run(exercise())


def test_browse_directories_requires_local_authorization(coordinated_storage_app, tmp_path):
    app, _storage = coordinated_storage_app
    folder = tmp_path / "selectable"
    folder.mkdir()
    (folder / "child").mkdir()
    (folder / "file.txt").write_text("example")

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            url = BASE + "/storage/directories"
            denied = await client.get(url, params={"path": str(folder)})
            assert denied.status == 403
            result = await client.get(url, headers=LOCAL, params={"path": str(folder)})
            assert result.status == 200
            payload = await result.json()
            assert payload["path"] == str(folder)
            assert payload["parent"] == str(folder.parent)
            assert payload["directories"] == [{"name": "child", "path": str(folder / "child")}]
            files = await client.get(url, headers=LOCAL, params={"path": str(folder), "files": "1"})
            assert files.status == 200
            assert (await files.json())["files"] == [{"name": "file.txt", "path": str(folder / "file.txt")}]
            invalid = await client.get(url, headers=LOCAL, params={"path": "relative"})
            assert invalid.status == 422

    asyncio.run(exercise())


def test_native_picker_authorization_and_selection(coordinated_storage_app, monkeypatch):
    import base64
    from astrophoto.api import storage as storage_api
    from types import SimpleNamespace

    app, _storage = coordinated_storage_app
    monkeypatch.setattr(storage_api, "os", SimpleNamespace(name="nt"))
    monkeypatch.setattr(storage_api.subprocess, "CREATE_NO_WINDOW", 0, raising=False)
    monkeypatch.setattr(storage_api.subprocess, "run", lambda *args, **kwargs: SimpleNamespace(
        stdout='{"path":"C:\\\\Photos\\\\frame.fit"}'.encode()))

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            url = BASE + "/storage/native-picker"
            assert (await client.post(url, json={"kind": "file"})).status == 403
            response = await client.post(url, headers=LOCAL, json={"kind": "file"})
            assert response.status == 200
            assert (await response.json())["path"] == r"C:\Photos\frame.fit"
            assert (await client.post(url, headers=LOCAL, json={"kind": "bad"})).status == 422
            scripts = []
            def capture_script(args, **kwargs):
                scripts.append(base64.b64decode(args[-1]).decode("utf-16-le"))
                return SimpleNamespace(stdout=b'{"path":null}')
            monkeypatch.setattr(storage_api.subprocess, "run", capture_script)
            for language in ("zh", "en"):
                assert (await client.post(url, headers=LOCAL, json={"kind": "file", "language": language})).status == 200
            assert "选择天文素材" in scripts[0]
            assert "Select Astrophotography Assets" in scripts[1]
            assert (await client.post(url, headers=LOCAL, json={"kind": "file", "language": "invalid"})).status == 422
            monkeypatch.setattr(storage_api.subprocess, "run", lambda *args, **kwargs: SimpleNamespace(
                stdout=b'{"paths":["C:/Photos/a.fit","C:/Photos/b.fit"]}'))
            multi = await client.post(url, headers=LOCAL, json={"kind": "files"})
            payload = await multi.json()
            assert payload["status"] == "selected"
            assert payload["paths"] == ["C:/Photos/a.fit", "C:/Photos/b.fit"]
            monkeypatch.setattr(storage_api.subprocess, "run", lambda *args, **kwargs: SimpleNamespace(
                stdout=b'{"paths":[]}'))
            multi_cancel = await client.post(url, headers=LOCAL, json={"kind": "files"})
            payload = await multi_cancel.json()
            assert payload["status"] == "cancelled" and payload["paths"] == []
            monkeypatch.setattr(storage_api.subprocess, "run", lambda *args, **kwargs: SimpleNamespace(
                stdout=b'{"paths":"bad"}'))
            invalid_result = await client.post(url, headers=LOCAL, json={"kind": "files"})
            payload = await invalid_result.json()
            assert payload["status"] == "unavailable" and payload["paths"] == []
            monkeypatch.setattr(storage_api.subprocess, "run", lambda *args, **kwargs: SimpleNamespace(
                stdout=b'{"path":null}'))
            cancelled = await client.post(url, headers=LOCAL, json={"kind": "folder"})
            assert (await cancelled.json())["status"] == "cancelled"
            storage_api._native_picker_lock.acquire()
            try:
                busy = await client.post(url, headers=LOCAL, json={"kind": "file"})
                assert (await busy.json())["status"] == "busy"
                busy_multi = await client.post(url, headers=LOCAL, json={"kind": "files"})
                payload = await busy_multi.json()
                assert payload["status"] == "busy" and payload["paths"] == []
            finally:
                storage_api._native_picker_lock.release()

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
            registered = await client.post(path + "/locations", headers=LOCAL, json={"path": str(tmp_path / "extra"), "name": "Archive"})
            assert registered.status == 201
            workspace = await registered.json()
            after_registration = await client.get(path, headers=LOCAL)
            assert [row["id"] for row in (await after_registration.json())["workspaces"]] == [
                data["workspaces"][0]["id"], workspace["id"],
            ]
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
            root = storage.workspaces.require(workspace)
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


async def import_test_asset(storage, path, mode):
    operation = storage.imports.import_assets({
        "sources": [str(path)], "idempotency_key": path.name, "import_mode_override": mode,
    })
    for _ in range(400):
        status = storage.operations.status(operation, "import")
        if status["phase"] in {"completed", "failed", "cancelled"}:
            break
        await asyncio.sleep(0.025)
    assert status["phase"] == "completed", status
    return next(row["id"] for row in storage.assets.list()["assets"] if row["name"] == path.name)


def test_removal_migration_is_visible_before_delete_returns(coordinated_storage_app, tmp_path, monkeypatch):
    app, storage = coordinated_storage_app
    source = storage.workspaces.get(storage.initial_workspace_id)
    target = storage.workspaces.register(str(tmp_path / "destination"), "Destination")
    original = tmp_path / "capture.fits"
    original.write_bytes(b"migration progress test")
    started, resume = threading.Event(), threading.Event()
    run = storage.migrations.run

    def pause(operation):
        started.set()
        assert resume.wait(10)
        run(operation)

    monkeypatch.setattr(storage.migrations, "run", pause)

    async def exercise():
        asset = await import_test_asset(storage, original, "copy")
        async with TestClient(TestServer(app)) as client:
            removal = asyncio.create_task(client.delete(BASE + "/storage/locations/" + source.id, headers=LOCAL, json={
                "expected_revision": source.revision, "target_workspace_id": target["id"],
            }))
            try:
                assert await asyncio.to_thread(started.wait, 5)
                assert not removal.done()
                response = await client.get(BASE + "/storage/operations", headers=LOCAL)
                jobs = [job for job in (await response.json())["operations"] if job["kind"] == "migration"]
                assert len(jobs) == 1 and jobs[0]["phase"] == "queued"
            finally:
                resume.set()
            result = await removal
            body = await result.json()
            assert result.status == 200 and body["operation_id"] == jobs[0]["operation_id"]
        assert storage.assets.resolve_asset(asset).read_bytes() == original.read_bytes()

    asyncio.run(exercise())


def test_delete_migrates_local_library_and_preserves_references(coordinated_storage_app, tmp_path):
    app, storage = coordinated_storage_app
    source = storage.workspaces.get(storage.initial_workspace_id)
    target = storage.workspaces.register(str(tmp_path / "archive"), "Archive")
    source_root, target_root = Path(source.root_path), Path(target["root_path"])
    capture, external = tmp_path / "capture.fits", tmp_path / "external.fits"
    capture.write_bytes(b"original capture")
    external.write_bytes(b"reference only")
    output_id = str(uuid4())
    key = f"outputs/{output_id}/stretched.fit"
    output = source_root / key
    output.parent.mkdir()
    output.write_bytes(b"processed image")
    write_json_atomically(output.with_name("manifest.json"), {
        "producer": "siril-autostretch-v1", "instance_id": storage.workspaces.instance_id,
        "workspace_id": source.id, "run_id": output_id, "output_id": output_id, "state": "completed",
    })
    storage.library.record_output(output_id, source.id, key, None, {
        "producer": "siril-autostretch-v1", "size_bytes": output.stat().st_size,
    })
    unrelated = source_root / "notes.txt"
    unrelated.write_bytes(b"user notes")

    async def exercise():
        managed_id = await import_test_asset(storage, capture, "copy")
        reference_id = await import_test_asset(storage, external, "reference")
        old_path = storage.assets.resolve_asset(managed_id)
        async with TestClient(TestServer(app)) as client:
            locations = BASE + "/storage/locations/"
            result = await client.delete(locations + source.id, headers=LOCAL, json={
                "expected_revision": source.revision, "target_workspace_id": target["id"],
            })
            body = await result.json()
            assert result.status == 200 and body["removed"], body
            remaining, = storage.snapshot("test")["workspaces"]
            assert remaining["id"] == target["id"]
            last = await client.delete(locations + target["id"], headers=LOCAL, json={
                "expected_revision": remaining["revision"],
            })
            assert last.status == 409 and (await last.json())["error"]["code"] == "DEFAULT_WORKSPACE_REQUIRED"
        assert not old_path.exists() and not output.exists()
        assert capture.read_bytes() == b"original capture"
        assert unrelated.read_bytes() == b"user notes" and not (target_root / unrelated.name).exists()
        return managed_id, reference_id

    managed_id, reference_id = asyncio.run(exercise())
    storage.close()
    restarted = StorageRuntime.initialize(storage.root, storage.environ)
    try:
        snapshot = restarted.snapshot("test")
        assert snapshot["default_workspace_id"] == target["id"]
        assert [row["id"] for row in snapshot["workspaces"]] == [target["id"]]
        managed_path = restarted.assets.resolve_asset(managed_id)
        assert managed_path.is_relative_to(target_root) and managed_path.read_bytes() == capture.read_bytes()
        assert restarted.assets.resolve_asset(reference_id) == external
        assert external.read_bytes() == b"reference only"
        member = restarted.library.get("assets", managed_id)
        assert member["id"] == managed_id
        result = restarted.library.resolve_output(output_id)
        assert result.is_relative_to(target_root) and result.read_bytes() == b"processed image"
        assert read_json(result.with_name("manifest.json"))["workspace_id"] == target["id"]
    finally:
        restarted.close()


def test_delete_collision_keeps_registered_source_and_can_retry(coordinated_storage_app, tmp_path):
    app, storage = coordinated_storage_app
    source = storage.workspaces.get(storage.initial_workspace_id)
    target = storage.workspaces.register(str(tmp_path / "archive"), "Archive")
    inputs = [tmp_path / "one.fits", tmp_path / "two.fits"]
    for item in inputs:
        item.write_bytes(item.name.encode())

    async def exercise():
        asset_ids = [await import_test_asset(storage, item, "copy") for item in inputs]
        old_paths = [storage.assets.resolve_asset(asset_id) for asset_id in asset_ids]
        old_path = old_paths[-1]
        occupied = Path(target["root_path"]) / old_path.relative_to(source.root_path)
        occupied.parent.mkdir(parents=True, exist_ok=True)
        occupied.write_bytes(b"existing file")
        url = BASE + "/storage/locations/" + source.id
        payload = {"expected_revision": source.revision, "target_workspace_id": target["id"]}
        async with TestClient(TestServer(app)) as client:
            denied = await client.delete(url, headers=LOCAL, json=payload)
            assert denied.status == 409 and (await denied.json())["error"]["code"] == "OBJECT_CONFLICT"
            assert [storage.assets.resolve_asset(asset_id) for asset_id in asset_ids] == old_paths
            assert [path.read_bytes() for path in old_paths] == [item.read_bytes() for item in inputs]
            assert occupied.read_bytes() == b"existing file"
            assert storage.snapshot("test")["default_workspace_id"] == source.id
            occupied.unlink()
            # Managed asset directories are exclusive; remove the fixture's
            # now-empty directory as well as the conflicting file.
            occupied.parent.rmdir()
            retried = await client.delete(url, headers=LOCAL, json=payload)
            assert retried.status == 200, await retried.json()
        for asset_id, item, old in zip(asset_ids, inputs, old_paths, strict=True):
            assert storage.assets.resolve_asset(asset_id).read_bytes() == item.read_bytes()
            assert not old.exists()

    asyncio.run(exercise())

