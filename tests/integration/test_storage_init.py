"""Exercise the extension's online storage check directly over HTTP."""

import asyncio
from contextlib import contextmanager
import json
from pathlib import Path
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
    workspace = root / "storage" / workspace_id
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
        source = root / "storage" / runtime.storage.initial_workspace_id / "outputs" / "user-data.fit"
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
def test_legacy_0001_database_upgrades_and_preserves_equipment(tmp_path):
    """TC-116: a 0001 data root upgrades to the current schema without losing equipment identity."""
    import os
    import shutil

    from alembic import command
    from alembic.config import Config
    from sqlalchemy import create_engine

    import astrophoto
    from astrophoto.core.config import load_storage_settings
    from astrophoto.database.manager import LEGACY_SCHEMA

    root = tmp_path / "data"
    runtime = StorageRuntime.initialize(root, {})
    instance_id = runtime.workspaces.instance_id
    default = runtime.workspaces.get(load_storage_settings(root)["workspace"]["default_workspace_id"])
    runtime.close()

    legacy = tmp_path / "legacy.db"
    engine = create_engine(f"sqlite:///{legacy.as_posix()}")
    config = Config()
    config.set_main_option("script_location",
                           str(Path(astrophoto.__file__).parent / "database/migrations"))
    with engine.connect() as connection:
        config.attributes["connection"] = connection
        command.upgrade(config, LEGACY_SCHEMA)
        connection.exec_driver_sql("INSERT INTO storage_identity VALUES (1, ?)", (instance_id,))
        connection.exec_driver_sql(
            "INSERT INTO storage_locations (id, name, root_path, canonical_root, enabled, revision)"
            " VALUES (?,?,?,?,?,?)",
            (default.id, default.name, default.root_path, os.path.normcase(default.root_path), 1, 0),
        )
        connection.exec_driver_sql(
            "INSERT INTO equipment (id, equipment_type, name, row_version, created_at_utc, updated_at_utc)"
            " VALUES (?,?,?,?,?,?)",
            ("legacy-camera", "camera", "Legacy camera", 3, "2026-01-01T00:00:00Z", "2026-01-01T00:00:00Z"),
        )
        connection.exec_driver_sql(
            "INSERT INTO camera_specs (equipment_id, sensor_kind, sensor_width_px, sensor_height_px)"
            " VALUES (?,?,?,?)",
            ("legacy-camera", "mono", 1920, 1080),
        )
        connection.commit()
    engine.dispose()
    for suffix in ("-wal", "-shm"):
        sidecar = Path(str(root / "database/assets.db") + suffix)
        if sidecar.exists():
            sidecar.unlink()
    shutil.copy(legacy, root / "database/assets.db")

    upgraded = StorageRuntime.initialize(root, {})
    try:
        assert upgraded.snapshot("test")["database"]["schema"] == "0004_deleted_trains"
        camera = upgraded.equipment.get_equipment("legacy-camera")
        assert [camera["id"], camera["name"], camera["row_version"]] == ["legacy-camera", "Legacy camera", 3]
        assert upgraded.workspaces.get(default.id).id == default.id
    finally:
        upgraded.close()
