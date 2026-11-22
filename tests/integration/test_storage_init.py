"""Exercise local init through an actual stdio process and the extension's HTTP routes."""

import asyncio
from contextlib import contextmanager
import json
import os
import sys
from uuid import UUID

from aiohttp import web
from aiohttp.test_utils import TestServer
from fastmcp import Client
from fastmcp.client.transports import StdioTransport
import pytest

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig


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
def mcp_client(tmp_path):
    mcp_home = tmp_path / "mcp-home"
    mcp_home.mkdir()
    env = {**os.environ, "HOME": str(mcp_home), "USERPROFILE": str(mcp_home),
           "ASTROPHOTO_HOME": str(mcp_home / "unused")}

    def connect(server):
        transport = StdioTransport(command=sys.executable, args=[
            "-m", "astrophoto_mcp", "--comfy-url", str(server.make_url("/")),
        ], env=env)
        return Client(transport)

    yield connect
    assert not (mcp_home / ".astrophoto").exists() and not (mcp_home / "unused").exists()


@pytest.fixture
def ready_app(root):
    with storage_app(root) as (app, runtime):
        assert runtime.storage is not None, runtime.storage_error
        yield app


def test_stdio_init_repairs_and_rechecks_the_host_root(root, ready_app, mcp_client):
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
        async with TestServer(ready_app) as server:
            async with mcp_client(server) as client:
                assert "init" in {tool.name for tool in await client.list_tools()}
                request_ids = set()
                for expected_created in ([], [f"storage/{workspace_id}/outputs/"], []):
                    if expected_created:
                        outputs.rmdir()
                    result = await client.call_tool("init", {})
                    assert not result.is_error
                    receipt = result.structured_content
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
def test_stdio_init_preserves_a_failed_startup_and_recovers(root, mcp_client, filename, reason):
    async def call(app):
        async with TestServer(app) as server, mcp_client(server) as client:
            return await client.call_tool("init", {}, raise_on_error=False)

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
        result = asyncio.run(call(app))
        assert result.is_error
        text = result.content[0].text
        assert "RECOVERY_REQUIRED" in text and reason in text
        assert str(root) not in text
        assert source.read_bytes() == b"retained" and database.read_bytes() == db_bytes
        if filename == "settings.json":
            assert config.read_bytes() == b"{invalid json"
        else:
            assert not config.exists()

    config.write_bytes(original)
    with storage_app(root) as (app, recovered):
        assert recovered.storage is not None, recovered.storage_error
        result = asyncio.run(call(app))
        assert not result.is_error
        assert result.structured_content["created"] == []
        assert result.structured_content["status"] == "ready" and source.read_bytes() == b"retained"
