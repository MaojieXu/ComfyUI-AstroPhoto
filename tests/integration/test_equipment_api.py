import asyncio
import json
import re
from contextlib import asynccontextmanager
from pathlib import Path

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from astrophoto.api.routes import BASE, register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig

BROWSER = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}
TOKEN = "test-only-" + "a" * 45
EQUIPMENT = BASE + "/equipment"
TRAINS = BASE + "/optical-trains"


async def remove_test_records(client):
    failures = []
    for collection in (TRAINS, EQUIPMENT):
        cursor = None
        records = []
        while True:
            params = {"archived": "all", "limit": "100"}
            if cursor is not None:
                params["after"] = cursor
            response = await client.get(collection, params=params, headers=BROWSER)
            assert response.status == 200, await response.text()
            page = await response.json()
            records.extend(page["items"])
            cursor = page["next"]
            if cursor is None:
                break
        for record in records:
            path = f"{collection}/{record['id']}"
            receipt = await client.delete(path, headers=BROWSER, json={"expected_version": record["row_version"]})
            if receipt.status != 204 or not receipt.headers.get("X-Request-ID"):
                failures.append(f"DELETE {path}: {receipt.status} {await receipt.text()}")
            removed = await client.get(path, headers=BROWSER)
            if removed.status != 404:
                failures.append(f"GET {path} after DELETE: {removed.status}")
        remaining = await client.get(collection, params={"archived": "all"}, headers=BROWSER)
        if remaining.status != 200 or (await remaining.json())["items"]:
            failures.append(f"{collection} still contains test records or cannot be read")
    assert not failures, "\n".join(failures)


@asynccontextmanager
async def equipment_client(tmp_path):
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    runtime.equipment_read_token = TOKEN
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    assert register_routes(routes, runtime) is runtime
    app = web.Application()
    app.add_routes(routes)

    try:
        async with TestClient(TestServer(app)) as client:
            try:
                yield client, runtime
            finally:
                runtime.trusted_local = True
                await remove_test_records(client)
    finally:
        runtime.storage.operations.pool.shutdown(wait=True)
        runtime.storage.db.engine.dispose()


def test_equipment_and_train_api_permissions_receipts_and_errors(tmp_path):
    async def exercise():
        async with equipment_client(tmp_path) as (client, runtime):
            equipment = EQUIPMENT
            trains = TRAINS
            agent = {"Authorization": "Bearer " + TOKEN}
            assert (await client.get(equipment, headers=agent)).status == 403
            runtime.trusted_local = True
            for headers in ({}, {"X-AstroPhoto-Local": "1", "Comfy-User": "someone"},
                            {**BROWSER, "Origin": "https://example.invalid"},
                            {**BROWSER, "X-Forwarded-For": "127.0.0.1"},
                            {**BROWSER, "Host": "example.invalid"},
                            {**BROWSER, "Sec-Fetch-Site": "cross-site"},
                            {"Authorization": "Bearer wrong"}, {**agent, **BROWSER}):
                denied = await client.get(equipment, headers=headers)
                assert denied.status == 403
                assert (await denied.json())["error"]["code"] == "UNAUTHORIZED_EQUIPMENT_OPERATION"
            assert (await client.post(equipment, headers=agent, json={"name": "No", "equipment_type": "camera"})).status == 403
            status = await (await client.get(BASE + "/status")).json()
            assert status["capabilities"]["equipment"]["available"] and status["capabilities"]["optical_trains"]["available"]
            assert (await client.get(equipment, headers=agent)).status == 200
            assert (await client.post(equipment, headers=BROWSER, data="not JSON")).status == 400
            assert (await client.get(equipment + "?limit=101", headers=agent)).status == 422
            invalid = await client.post(equipment, headers=BROWSER,
                                        json={"equipment_type": "camera", "name": "A", "specs": {"sensor_width_px": -1}})
            body = await invalid.json()
            assert invalid.status == 422 and body["request_id"]
            assert body["error"]["details"]["fields"] == {"specs.sensor_width_px": "invalid_value"}
            devices = {}
            for kind in ("camera", "primary_optics", "filter", "optical_accessory"):
                created = await client.post(equipment, headers=BROWSER, json={"equipment_type": kind, "name": "Test " + kind})
                assert created.status == 201
                device = await created.json()
                devices[kind] = device["id"]
                assert device["row_version"] == 1
            first = await (await client.get(equipment + "?limit=2", headers=agent)).json()
            later = await (await client.get(equipment, params={"after": first["next"]}, headers=agent)).json()
            assert len({row["id"] for row in first["items"] + later["items"]}) == 4 and later["next"] is None
            camera = equipment + "/" + devices["camera"]
            assert (await client.patch(camera, json={"expected_version": 1, "name": "Renamed"}, headers=BROWSER)).status == 200
            assert (await client.patch(camera, json={"expected_version": 1, "name": "Stale"}, headers=BROWSER)).status == 409
            create = await client.post(trains, json={"name": "Test train"}, headers=BROWSER)
            assert create.status == 201
            path = trains + "/" + (await create.json())["id"]
            draft = await client.put(path + "/draft", headers=BROWSER, json={"expected_draft_version": None,
                "draft": {"name": "Test train", "camera_id": devices["camera"], "primary_optics_id": devices["primary_optics"],
                          "filter_ids": [devices["filter"]], "accessory_ids": [devices["optical_accessory"]]}})
            assert draft.status == 200
            saved = await draft.json()
            stale = await client.put(path + "/draft", headers=BROWSER, json={"expected_draft_version": None, "draft": {"name": "Stale"}})
            assert stale.status == 409
            for method, suffix in (("POST", "/revisions"), ("PUT", "/default-revision")):
                response = await client.request(method, path + suffix, headers=BROWSER, json={})
                assert response.status == 410
                assert (await response.json())["error"]["code"] == "TRAIN_HISTORY_READ_ONLY"
            detail = await (await client.get(path, headers=agent)).json()
            assert detail["configuration"]["draft_version"] == saved["draft_version"]
            assert detail["summary"]["camera"] == "Renamed"
            assert (await (await client.get(path + "/revisions", headers=agent)).json())["items"] == []
            assert (await client.get(trains + "?q=Renamed", headers=agent)).status == 200
            assert (await client.delete(camera, headers=BROWSER, json={"expected_version": 2})).status == 409
            assert (await client.delete(path, headers=agent, json={"expected_version": detail["row_version"]})).status == 403
            assert (await client.delete(path, headers=BROWSER, json={"expected_version": detail["row_version"] + 1})).status == 409
            deleted_train = await client.delete(path, headers=BROWSER, json={"expected_version": detail["row_version"]})
            assert deleted_train.status == 204
            assert (await client.get(path, headers=agent)).status == 404
            assert (await client.delete(camera, headers=BROWSER, json={"expected_version": 2})).status == 204
            unused = await (await client.post(equipment, headers=BROWSER,
                                             json={"equipment_type": "camera", "name": "Unused"})).json()
            deleted = await client.delete(equipment + "/" + unused["id"], headers=BROWSER, json={"expected_version": 1})
            assert deleted.status == 204 and deleted.headers["X-Request-ID"]
            assert (await client.get(BASE + "/storage", headers=BROWSER)).status == 200
            assert (await client.get(BASE + "/assets", headers=BROWSER)).status == 200

    asyncio.run(exercise())


def test_official_catalog_create_read_and_delete(tmp_path):
    prd = Path(__file__).resolve().parents[2] / ".agents/features/equipment-optical-trains/01_PRD.md"
    text = prd.read_text(encoding="utf-8")
    catalog, combinations = map(json.loads, re.findall(r"(?ms)^\x60{3}json\n(.*?)^\x60{3}", text))
    assert catalog and combinations

    async def exercise():
        async with equipment_client(tmp_path) as (client, runtime):
            runtime.trusted_local = True
            ids = {None: None}
            for entry in catalog:
                created = await client.post(EQUIPMENT, headers=BROWSER, json=entry["payload"])
                assert created.status == 201, await created.text()
                device = await created.json()
                ids[entry["id"]] = device["id"]
                detail = await client.get(f"{EQUIPMENT}/{device['id']}", headers=BROWSER)
                assert detail.status == 200, await detail.text()
                assert (await detail.json())["model"] == entry["payload"]["model"]

            for entry in combinations:
                draft = {
                    "name": entry["name"],
                    "camera_id": ids[entry["camera_ref"]],
                    "primary_optics_id": ids[entry["primary_optics_ref"]],
                    "accessory_ids": [ids[key] for key in entry["accessory_refs"]],
                    "filter_ids": [ids[key] for key in entry["filter_refs"]],
                }
                created = await client.post(TRAINS, headers=BROWSER, json={"name": draft["name"], "draft": draft})
                assert created.status == 201, await created.text()
                train = await created.json()
                detail = await client.get(f"{TRAINS}/{train['id']}", headers=BROWSER)
                assert detail.status == 200, await detail.text()
                saved = (await detail.json())["configuration"]["draft"]
                assert {key: saved[key] for key in draft} == draft

    asyncio.run(exercise())


def test_equipment_api_cleanup_runs_after_case_error(tmp_path):
    async def exercise():
        with pytest.raises(RuntimeError, match="simulated case failure"):
            async with equipment_client(tmp_path) as (client, runtime):
                runtime.trusted_local = True
                created = await client.post(EQUIPMENT, headers=BROWSER, json={"equipment_type": "camera", "name": "Camera"})
                assert created.status == 201, await created.text()
                camera = await created.json()
                train = await client.post(TRAINS, headers=BROWSER,
                                          json={"name": "Partial", "draft": {"name": "Partial", "camera_id": camera["id"]}})
                assert train.status == 201, await train.text()
                archived = await client.post(f"{EQUIPMENT}/{camera['id']}/archive", headers=BROWSER,
                                             json={"expected_version": camera["row_version"]})
                assert archived.status == 200, await archived.text()
                raise RuntimeError("simulated case failure")

        # A fresh HTTP client pointed at the same root detects leftovers independently of teardown.
        async with equipment_client(tmp_path) as (client, runtime):
            runtime.trusted_local = True
            for collection in (TRAINS, EQUIPMENT):
                response = await client.get(collection, params={"archived": "all"}, headers=BROWSER)
                assert response.status == 200, await response.text()
                assert (await response.json())["items"] == []

    asyncio.run(exercise())


def test_equipment_route_conflict_has_no_partial_registration(tmp_path):
    routes = web.RouteTableDef()
    routes.get(BASE + "/equipment")(lambda request: None)
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "unused"))
    with pytest.raises(RuntimeError, match="/equipment"):
        register_routes(routes, runtime)
    assert len(routes) == 1
