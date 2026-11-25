"""Exercise the extension's online storage check directly over HTTP."""

import asyncio
from contextlib import contextmanager
import json
from uuid import UUID

from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
import pytest

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.storage.runtime import StorageRuntime

INIT = "/astrophoto/v1/storage/init"
LOCAL = {"X-AstroPhoto-Local": "1"}


@pytest.fixture
def root(tmp_path, monkeypatch):
    home = tmp_path / "host-home"
    home.mkdir()
    monkeypatch.setenv("HOME", str(home))
    monkeypatch.setenv("USERPROFILE", str(home))
    return tmp_path / "effective-data-root"


@contextmanager
def storage_app(root):
    runtime = bootstrap(lambda: True, AppConfig("astrophoto", "0.0.1", root))
    initialize_storage_runtime(runtime, coordinate=True, host_temp=root.parent / "host-temp")
    runtime.trusted_local = True
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)
    try:
        yield app, runtime
    finally:
        if runtime.storage is not None:
            runtime.storage.close()


@pytest.fixture
def ready_app(root):
    with storage_app(root) as (app, runtime):
        assert runtime.storage is not None, runtime.storage_error
        yield app


def test_http_init_repairs_and_rechecks_the_host_root(root, ready_app):
    manifest = root / "config" / "manifest.json"
    settings = root / "config" / "settings.json"
    workspace_id = json.loads(settings.read_bytes())["workspace"]["default_workspace_id"]
    workspace = root / "storage" / "Local"
    source = workspace / "objects" / "user-file.fit"
    source.write_bytes(b"existing object")
    workspace_marker = workspace / ".astrophoto-workspace.json"
    original = {path: path.read_bytes() for path in (source, manifest, settings, workspace_marker)}
    outputs = workspace / "outputs"
    migrations = root / "runtime" / "migrations"
    assert {path.name for path in root.iterdir()} == {"config", "database", "storage", "runtime"}
    assert outputs.is_dir() and not migrations.exists()

    async def exercise():
        async with TestClient(TestServer(ready_app)) as client:
            request_ids = set()
            for expected_created in ([], [f"storage/{workspace_id}/outputs/"], []):
                if expected_created:
                    outputs.rmdir()
                async with client.post(INIT, json={}, headers=LOCAL) as response:
                    assert response.status == 200
                    receipt = await response.json()
                assert receipt["created"] == expected_created
                assert receipt["status"] == "ready" and receipt["data_root"] == str(root)
                assert receipt["checks"] == dict.fromkeys(("config", "database", "storage", "runtime"), "ready")
                assert "workspaces" not in receipt
                request_ids.add(UUID(receipt["request_id"]))
                assert outputs.is_dir() and not migrations.exists()
            assert len(request_ids) == 3

    asyncio.run(exercise())
    assert {path: path.read_bytes() for path in original} == original


@pytest.mark.parametrize(("filename", "reason"), [
    ("settings.json", "Invalid or missing storage settings"),
    ("manifest.json", "The active Data Root is unavailable or its storage manifest is missing"),
])
def test_http_init_preserves_a_failed_startup_and_recovers(root, filename, reason):
    async def call(app):
        async with TestClient(TestServer(app)) as client, client.post(INIT, json={}, headers=LOCAL) as response:
            return response.status, await response.json()

    with storage_app(root) as (_, runtime):
        assert runtime.storage is not None, runtime.storage_error
        config = root / "config" / filename
        original = config.read_bytes()
        source = root / "storage" / "Local" / "outputs" / "user-data.fit"
        source.write_bytes(b"retained")

    database = root / "database" / "assets.db"
    db_bytes = database.read_bytes()
    if filename == "settings.json":
        config.write_bytes(b"{invalid json")
    else:
        config.unlink()

    with storage_app(root) as (app, degraded):
        assert degraded.storage is None and degraded.storage_error == "RECOVERY_REQUIRED"
        status, payload = asyncio.run(call(app))
        assert status == 409
        assert payload["error"]["code"] == "RECOVERY_REQUIRED"
        assert reason in payload["error"]["message"]
        assert str(root) not in payload["error"]["message"]
        assert source.read_bytes() == b"retained" and database.read_bytes() == db_bytes
        if filename == "settings.json":
            assert config.read_bytes() == b"{invalid json"
        else:
            assert not config.exists()

    config.write_bytes(original)
    with storage_app(root) as (app, recovered):
        assert recovered.storage is not None, recovered.storage_error
        status, receipt = asyncio.run(call(app))
        assert status == 200
        assert receipt["created"] == []
        assert receipt["status"] == "ready" and source.read_bytes() == b"retained"


@pytest.mark.parametrize(("revision", "wal"), [
    (2, False), (3, False), (4, True),
])
def test_development_database_is_rejected(tmp_path, revision, wal):
    import sqlite3
    from contextlib import closing

    from astrophoto.core.errors import StorageError

    root = tmp_path / "data"
    with storage_app(root) as (_app, initial):
        assert initial.storage is not None, initial.storage_error
    path = root / "database/assets.db"
    path.unlink()
    original = tmp_path / "original.fit"
    original.write_bytes(b"unmanaged source")
    with closing(sqlite3.connect(path)) as conn:
        if wal:
            conn.execute("PRAGMA journal_mode=WAL")
        conn.executescript("""
            CREATE TABLE assets (id TEXT PRIMARY KEY, original_path TEXT NOT NULL);
        """)
        conn.execute(f"PRAGMA user_version={revision}")
        conn.execute("INSERT INTO assets VALUES ('old', ?)", (str(original),))
        conn.commit()
        with pytest.raises(StorageError) as rejected:
            StorageRuntime.initialize(root, {})
        assert rejected.value.code == "DEV_SCHEMA_RESET_REQUIRED"
        assert rejected.value.details["schema"] == revision
        assert "new Data Root" in str(rejected.value)
        async def read_public_error(app):
            async with TestClient(TestServer(app)) as client:
                response = await client.post(INIT, headers=LOCAL, json={})
                assert response.status == 503
                return (await response.json())["error"]
        with storage_app(root) as (app, failed):
            assert failed.storage is None
            error = asyncio.run(read_public_error(app))
            assert error["code"] == "DEV_SCHEMA_RESET_REQUIRED"
            assert "ASTROPHOTO_HOME" in error["message"]
