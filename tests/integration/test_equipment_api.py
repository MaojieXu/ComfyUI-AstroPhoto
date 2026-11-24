import asyncio
from contextlib import asynccontextmanager

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

from astrophoto.api.routes import BASE, register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig

BROWSER = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}
TOKEN = "test-only-" + "a" * 45
WRITE_TOKEN = "test-write-" + "b" * 45
APPROVAL_TOKEN = "test-approval-" + "c" * 45
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
            if collection == TRAINS and record["status"] != "archived":
                receipt = await client.patch(path, headers=BROWSER, json={
                    "name": record["name"], "expected_version": record["row_version"],
                })
                assert receipt.status == 200, await receipt.text()
                record["row_version"] = (await receipt.json())["row_version"]
            receipt = await client.delete(path, headers=BROWSER, json={"expected_version": record["row_version"]})
            if collection == EQUIPMENT and receipt.status == 409:
                assert (await receipt.json())["error"]["code"] == "EQUIPMENT_REFERENCED"
                continue
            if receipt.status != 204 or not receipt.headers.get("X-Request-ID"):
                failures.append(f"DELETE {path}: {receipt.status} {await receipt.text()}")
            removed = await client.get(path, headers=BROWSER)
            if collection == TRAINS:
                assert removed.status == 200 and (await removed.json())["status"] == "deleted"
            elif removed.status != 404:
                failures.append(f"GET {path} after DELETE: {removed.status}")
        remaining = await client.get(collection, params={"archived": "all"}, headers=BROWSER)
        if remaining.status != 200 or collection == TRAINS and (await remaining.json())["items"]:
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
            agent = {"Authorization": "Bearer " + TOKEN}
            assert (await client.get(EQUIPMENT, headers=agent)).status == 403
            runtime.trusted_local = True
            for headers in ({}, {**BROWSER, "Origin": "https://example.invalid"},
                            {**BROWSER, "X-Forwarded-For": "127.0.0.1"},
                            {**BROWSER, "Host": "example.invalid"},
                            {**BROWSER, "Sec-Fetch-Site": "cross-site"}, {**agent, **BROWSER}):
                denied = await client.get(EQUIPMENT, headers=headers)
                assert denied.status == 403
            assert (await client.get(EQUIPMENT, headers=agent)).status == 200
            assert (await client.post(EQUIPMENT, headers=agent, json={"name": "No", "equipment_type": "camera"})).status == 403
            assert (await client.post(EQUIPMENT, headers=BROWSER, data="not JSON")).status == 400
            invalid = await client.post(EQUIPMENT, headers=BROWSER,
                                        json={"equipment_type": "camera", "name": "A", "product_name": ""})
            assert invalid.status == 422
            assert (await invalid.json())["error"]["details"]["fields"] == {"product_name": "required"}
    asyncio.run(exercise())


def test_scoped_equipment_credentials_crud_and_protected_delete(tmp_path, monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_WRITE_TOKEN", WRITE_TOKEN)
    monkeypatch.setenv("ASTROPHOTO_APPROVAL_TOKEN", APPROVAL_TOKEN)
    monkeypatch.delenv("ASTROPHOTO_LIBRARY_TOKEN", raising=False)

    async def exercise():
        async with equipment_client(tmp_path) as (client, runtime):
            runtime.trusted_local = True
            read = {"Authorization": "Bearer " + TOKEN}
            write = {"Authorization": "Bearer " + WRITE_TOKEN}
            approval = {"X-AstroPhoto-Approval": "Bearer " + APPROVAL_TOKEN}
            attrs = {"equipment_type": "camera", "name": "Camera", "product_name": "Camera"}
            assert (await client.post(EQUIPMENT, headers=read, json=attrs)).status == 403
            assert (await client.get(EQUIPMENT, headers=write)).status == 403
            created = await client.post(EQUIPMENT, headers=write, json=attrs)
            assert created.status == 201, await created.text()
            device = await created.json()
            path = f"{EQUIPMENT}/{device['id']}"
            assert (await client.get(path, headers=read)).status == 200
            updated = await client.patch(path, headers=write, json={"name": "New", "expected_version": 1})
            assert updated.status == 200, await updated.text()
            assert (await client.delete(path, headers=write, json={"expected_version": 2})).status == 403
            assert (await client.delete(path, headers={**read, **approval}, json={"expected_version": 2})).status == 403
            assert (await client.delete(path, headers={**write, **approval, "Origin": "http://other.invalid"},
                                        json={"expected_version": 2})).status == 403
            deleted = await client.delete(path, headers={**write, **approval}, json={"expected_version": 2})
            assert deleted.status == 204, await deleted.text()

            created_train = await client.post(TRAINS, headers=write, json={"name": "Group"})
            assert created_train.status == 201, await created_train.text()
            train = await created_train.json()
            route = f"{TRAINS}/{train['id']}"
            draft = await client.patch(route, headers=write, json={
                "name": "Updated group", "expected_version": train["row_version"],
            })
            assert draft.status == 200, await draft.text()
            assert (await client.delete(route, headers=write, json={"expected_version": 2})).status == 403
            removed = await client.delete(route, headers={**write, **approval}, json={"expected_version": 2})
            assert removed.status == 204, await removed.text()
            assert (await (await client.get(route, headers=read)).json())["status"] == "deleted"
            replacement = await client.post(TRAINS, headers=write, json={"name": "Updated group"})
            assert replacement.status == 201, await replacement.text()

            monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_WRITE_TOKEN", TOKEN)
            assert (await client.post(EQUIPMENT, headers=read, json=attrs)).status == 403

    asyncio.run(exercise())


def test_equipment_mcp_crud_and_chat_deletion_against_public_http(tmp_path, monkeypatch):
    from fastmcp import Client
    from mcp_types import ElicitResult

    from astrophoto_mcp.server import create_server

    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", TOKEN)
    monkeypatch.setenv("ASTROPHOTO_EQUIPMENT_WRITE_TOKEN", WRITE_TOKEN)
    monkeypatch.setenv("ASTROPHOTO_APPROVAL_TOKEN", APPROVAL_TOKEN)
    monkeypatch.setenv("ASTROPHOTO_TRUST_CHAT_APPROVALS", "1")
    monkeypatch.delenv("ASTROPHOTO_LIBRARY_TOKEN", raising=False)

    async def exercise():
        decisions = iter(["decline", "accept", "accept"])
        confirmed = []

        async def elicit(message, *_):
            confirmed.append(message)
            action = next(decisions)
            return ElicitResult(action=action, content={"value": True} if action == "accept" else None)

        async with equipment_client(tmp_path) as (browser, runtime):
            runtime.trusted_local = True
            assert browser.server.port
            url = f"http://127.0.0.1:{browser.server.port}"
            async with Client(create_server(url), mode="legacy", elicitation_handler=elicit) as agent:
                added = await agent.call_tool("equipment_create", {
                    "equipment_type": "camera", "name": "Camera", "product_name": "Test camera",
                })
                assert added.data["name"] == "Camera"
                await agent.call_tool("equipment_update", {"name": "Camera", "notes": "North"})
                viewed = await agent.call_tool("equipment_get", {"name": "Camera"})
                assert viewed.data["notes"] == "North"
                request = {"name": "Camera"}
                declined = await agent.call_tool("equipment_delete", request)
                assert declined.data == {"name": "Camera", "deleted": False, "status": "declined"}
                kept = await browser.get(EQUIPMENT, params={"q": "Camera"}, headers=BROWSER)
                assert len((await kept.json())["items"]) == 1
                assert (await agent.call_tool("equipment_delete", request)).data["deleted"]

                await agent.call_tool("optical_train_create", {"name": "Group"})
                await agent.call_tool("optical_train_update", {"name": "Group", "new_name": "Group updated"})
                read = await agent.call_tool("optical_train_get", {"name": "Group updated"})
                assert read.data["name"] == "Group updated"
                assert (await agent.call_tool("optical_train_delete", {"name": "Group updated"})).data["deleted"]
                assert (await agent.call_tool("optical_train_list", {"query": "Group updated"})).data["items"] == []
                assert len(confirmed) == 3 and confirmed[0] == confirmed[1]
                assert confirmed[0].startswith("Delete equipment Camera (")
                assert confirmed[2].startswith("Delete train Group updated (")

    asyncio.run(exercise())


def test_equipment_catalog_create_and_combination(tmp_path):
    async def exercise():
        async with equipment_client(tmp_path) as (client, runtime):
            runtime.trusted_local = True
            ids = {}
            for kind in ("camera", "primary_optics", "optical_accessory", "filter", "other"):
                payload = {"equipment_type": kind, "name": kind, "product_name": "Example product"}
                response = await client.post(EQUIPMENT, headers=BROWSER, json=payload)
                assert response.status == 201, await response.text()
                device = await response.json()
                ids[kind] = device["id"]
                detail = await client.get(f"{EQUIPMENT}/{device['id']}", headers=BROWSER)
                assert detail.status == 200
                assert (await detail.json())["product_name"] == payload["product_name"]

            draft = {
                "name": "Example combination", "camera_id": ids["camera"],
                "primary_optics_id": ids["primary_optics"], "accessory_id": ids["optical_accessory"],
                "filter_ids": [ids["filter"]], "other_ids": [ids["other"]],
            }
            response = await client.post(TRAINS, headers=BROWSER, json=draft)
            assert response.status == 201, await response.text()
            train = await response.json()
            detail = await client.get(f"{TRAINS}/{train['id']}", headers=BROWSER)
            assert detail.status == 200
            saved = await detail.json()
            assert {key: saved[key] for key in draft} == draft

    asyncio.run(exercise())


def test_equipment_api_cleanup_runs_after_case_error(tmp_path):
    async def exercise():
        with pytest.raises(RuntimeError, match="simulated case failure"):
            async with equipment_client(tmp_path) as (client, runtime):
                runtime.trusted_local = True
                created = await client.post(EQUIPMENT, headers=BROWSER, json={"equipment_type": "camera", "name": "Camera", "product_name": "Camera"})
                assert created.status == 201, await created.text()
                camera = await created.json()
                train = await client.post(TRAINS, headers=BROWSER,
                                          json={"name": "Partial", "camera_id": camera["id"]})
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
