"""TP-002 TC-018: traverse static catalogs with unique names and tied timestamps."""

import asyncio
from time import perf_counter
from uuid import UUID, uuid4

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from fastmcp import Client

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.database.catalog_models import CalibrationBinding, CalibrationMaster, SubframeCollection
from astrophoto.database.models import Asset, AssetLocation
from astrophoto_mcp.server import create_server


@pytest.mark.parametrize("record_count", [1000, 10000])
def test_catalog_pagination_with_unique_names(tmp_path, monkeypatch, record_count):
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    runtime.trusted_local = True
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)
    expected = []
    with runtime.storage.db.session(transaction="write") as session:
        for index in range(record_count):
            reference = str(UUID(int=index + 1))
            name = f"Set {index:04}"
            expected.append(name)
            session.add(SubframeCollection(
                id=reference, name=name, frame_type="light", calibration_state="unknown",
                created_at_utc="2026-11-23T00:00:00+00:00", updated_at_utc="2026-11-23T00:00:00+00:00",
            ))

    async def exercise():
        async with TestClient(TestServer(app)) as browser, Client(
            create_server(f"http://127.0.0.1:{browser.server.port}")
        ) as agent:
            cursor = None
            observed = []
            samples = []
            while True:
                start = perf_counter()
                page = (await agent.call_tool("library_list", {
                    "asset_type": "subframe_collection", "limit": 100, "cursor": cursor,
                })).data
                samples.append(round((perf_counter() - start) * 1000, 2))
                assert page["total"] == len(expected)
                observed.extend(item["name"] for item in page["items"])
                cursor = page["next_cursor"]
                if cursor is None:
                    break
                assert len(samples) < (record_count + 99) // 100
            assert observed == sorted(expected)
            print(f"{record_count} static records, {len(samples)} pages, first/last/max ms: "
                  f"{samples[0]}/{samples[-1]}/{max(samples)}")

    try:
        asyncio.run(exercise())
    finally:
        runtime.storage.close()


def test_catalog_cursor_recovers_after_writes_and_anchor_removal(tmp_path, monkeypatch):
    from fastmcp.exceptions import ToolError
    from tests.integration.test_photography_library import library_client, request


    async def exercise():
        async with library_client(tmp_path) as (browser, storage), Client(
            create_server(f"http://127.0.0.1:{browser.server.port}")
        ) as agent:
            def insert(*names):
                with storage.db.session(transaction="write") as session:
                    for name in names:
                        session.add(SubframeCollection(id=str(uuid4()), name=name, frame_type="light",
                                                       calibration_state="unknown", created_at_utc="now", updated_at_utc="now"))

            insert("B", "D")

            async def fetch(cursor=None):
                return (await agent.call_tool("library_list", {
                    "asset_type": "subframe_collection", "limit": 1, "cursor": cursor, "sort_by": "name_asc",
                })).data

            first = await fetch()
            assert [row["name"] for row in first["items"]] == ["B"]
            # Mutate the live catalog while a client still holds its cursor.
            await asyncio.to_thread(insert, "A", "C")
            second = await fetch(first["next_cursor"])
            assert [row["name"] for row in second["items"]] == ["C"]
            third = await fetch(second["next_cursor"])
            assert [row["name"] for row in third["items"]] == ["D"]
            assert third["next_cursor"] is None
            anchor, = (await request(browser, "GET", "/catalog/subframe_collection?exact_name=B", 200))["items"]
            await request(browser, "DELETE", "/catalog/subframe_collection/" + anchor["id"], 200, {"revision": 1})
            with pytest.raises(ToolError, match="REVISION_CONFLICT"):
                await fetch(first["next_cursor"])
            fresh = await fetch()
            assert fresh["total"] == 3 and [row["name"] for row in fresh["items"]] == ["A"]

    asyncio.run(exercise())


def test_large_calibration_candidate_listing(tmp_path):
    from tests.integration.test_photography_library import library_client, request

    source = tmp_path / "frame.fit"
    source.write_bytes(b"fixture")
    collection_id = str(uuid4())
    samples = []

    async def exercise():
        async with library_client(tmp_path) as (browser, storage):
            with storage.db.session(transaction="write") as session:
                session.add(SubframeCollection(id=collection_id, name="Lights", frame_type="light",
                                               calibration_state="unknown", created_at_utc="now", updated_at_utc="now", gain=100))
                rows = [(str(uuid4()), index) for index in range(1000)]
                session.add_all(Asset(id=key, name=f"frame-{index}.fit", size_bytes=7, mtime_ns=0) for key, index in rows)
                session.flush()
                session.add_all(AssetLocation(id=key, asset_id=key, storage_mode="external_reference",
                                              external_path=str(source), external_key=str(source)) for key, _ in rows)
                session.add_all(CalibrationMaster(id=key, name=f"Master {index:04}", type="dark_flat" if index % 5 == 0 else "dark",
                                                  gain=200 if index % 2 else 100, created_at_utc="now",
                                                  updated_at_utc="now") for key, index in rows)
                session.flush()
                session.add(CalibrationBinding(collection_id=collection_id, master_id=rows[1][0], created_at_utc="now"))
            expected = {f"Master {index:04}" for _, index in rows if index % 5 and index != 1}
            collected = {}
            cursor = None
            for _ in range(8):
                route = f"/catalog/calibration_master?collection={collection_id}&limit=100"
                start = perf_counter()
                page = await request(browser, "GET", route + (f"&after={cursor}" if cursor else ""), 200)
                samples.append(round((perf_counter() - start) * 1000, 2))
                assert page["total"] == len(expected)
                for row in page["items"]:
                    assert row["name"] not in collected
                    assert row["master_type"] == "dark"
                    collected[row["name"]] = row["comparison"]["gain"]["status"]
                cursor = page["next"]
                if cursor is None:
                    break
            assert cursor is None and set(collected) == expected
            assert collected["Master 0002"] == "match" and collected["Master 0003"] == "difference"
            print(f"1000 calibration records, {len(collected)} candidates, first/last/max ms: "
                  f"{samples[0]}/{samples[-1]}/{max(samples)}")

    asyncio.run(exercise())
