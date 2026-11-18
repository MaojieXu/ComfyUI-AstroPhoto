"""Real aiohttp HTTP integration with a mocked ComfyUI registration boundary."""

import asyncio

from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
import pytest

from astrophoto.api.routes import STATUS_PATH, register_routes
from astrophoto.bootstrap import bootstrap
from astrophoto.core.config import AppConfig


def test_v3_load_registers_one_live_status_route(extension, monkeypatch, tmp_path):
    monkeypatch.setenv("ASTROPHOTO_HOME", str(tmp_path / "data"))

    async def exercise():
        plugin = await extension.module.comfy_entrypoint()
        await plugin.on_load()
        await plugin.on_load()
        assert len([r for r in extension.routes if r.path == STATUS_PATH]) == 1
        app = web.Application()
        app.add_routes(extension.routes)
        async with TestClient(TestServer(app)) as client:
            response = await client.get(STATUS_PATH)
            assert response.status == 200
            assert (await response.json())["status"] == "degraded"
            node = (await plugin.get_node_list())[0]
            extension.registry["vue-basic"] = node
            response = await client.get(STATUS_PATH)
            assert (await response.json())["status"] == "ok"
        assert (tmp_path / "data/databases/assets.db").is_file()
    asyncio.run(exercise())


def test_route_ownership_and_per_server_isolation(tmp_path):
    config = AppConfig("test", "0.0.1", tmp_path)
    first, second = web.RouteTableDef(), web.RouteTableDef()
    runtime = bootstrap(lambda: True, config)
    assert register_routes(first, runtime) is runtime
    updated = bootstrap(lambda: False, config)
    assert register_routes(first, updated) is runtime
    assert not runtime.node_registered()
    register_routes(second, updated)
    assert len(first) == len(second) > 1
    foreign = web.RouteTableDef()

    @foreign.get(STATUS_PATH)
    async def unrelated(_request):
        return web.Response()

    with pytest.raises(RuntimeError, match="already owns"):
        register_routes(foreign, runtime)
