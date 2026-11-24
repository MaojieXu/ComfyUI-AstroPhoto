import asyncio

from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from astrophoto.api.routes import BASE, register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig

HEADERS = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}


def test_train_flat_http(tmp_path):
    async def exercise():
        runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
        initialize_storage_runtime(runtime)
        runtime.trusted_local = True
        routes = web.RouteTableDef()
        register_routes(routes, runtime)
        app = web.Application()
        app.add_routes(routes)
        try:
            async with TestClient(TestServer(app)) as client:
                response = await client.post(BASE + "/optical-trains", headers=HEADERS, json={"name": "Test"})
                assert response.status == 201
                train = await response.json()
                path = BASE + "/optical-trains/" + train["id"]
                response = await client.patch(path, headers=HEADERS, json={"name": "Updated", "expected_version": train["row_version"]})
                assert response.status == 200
                assert (await response.json())["name"] == "Updated"
                response = await client.get(path, headers=HEADERS)
                assert (await response.json())["name"] == "Updated"
                for name in ("Alpha", "Zulu"):
                    assert (await client.post(BASE + "/optical-trains", headers=HEADERS, json={"name": name})).status == 201
                response = await client.get(BASE + "/optical-trains?sort=name_asc&limit=2", headers=HEADERS)
                page = await response.json()
                assert [item['name'] for item in page['items']] == ['Alpha', 'Updated']
                response = await client.get(BASE + "/optical-trains", headers=HEADERS,
                                            params={'sort': 'name_asc', 'limit': '2', 'after': page['next']})
                assert [item['name'] for item in (await response.json())['items']] == ['Zulu']
                response = await client.get(BASE + "/optical-trains", headers=HEADERS,
                                            params={'sort': 'name_desc', 'after': page['next']})
                assert response.status == 422
        finally:
            runtime.storage.operations.pool.shutdown(wait=True)
            runtime.storage.db.engine.dispose()
    asyncio.run(exercise())
