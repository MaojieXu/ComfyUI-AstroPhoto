import asyncio
from contextlib import asynccontextmanager
from pathlib import Path
from uuid import uuid4

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from sqlalchemy import select

from astrophoto.api.routes import BASE, register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.database.models import AssetLocation
from astrophoto.storage.manager import resolve_managed

BROWSER = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}
AGENT = {"X-AstroPhoto-Agent": "1"}


def test_mcp_local_equipment_and_catalog_without_tokens(tmp_path, monkeypatch):
    from fastmcp import Client
    from astrophoto_mcp.server import create_server

    async def exercise():
        async with library_client(tmp_path) as (client, _):
            async with Client(create_server(f"http://127.0.0.1:{client.server.port}")) as agent:
                created = (await agent.call_tool("equipment_create", {"equipment_type": "camera", "name": "Camera", "product_name": "P"})).data
                assert created["name"] == "Camera"
                assert (await agent.call_tool("equipment_get", {"name": "Camera"})).data["name"] == "Camera"
                assert (await agent.call_tool("project_create", {"name": "Project"})).data["name"] == "Project"
                assert (await agent.call_tool("equipment_delete", {"name": "Camera"})).data["deleted"]

    asyncio.run(exercise())


def test_bound_mcp_request_cannot_write_to_replacement_instance(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            for path, payload in (
                ("/catalog/projects", {"name": "Project"}),
                ("/equipment", {"equipment_type": "camera", "name": "Camera", "product_name": "Camera"}),
            ):
                headers = {**AGENT, "X-AstroPhoto-Instance-ID": str(uuid4())}
                rejected = await request(client, "POST", path, 409, payload, headers=headers)
                assert rejected["error"]["code"] == "TARGET_INSTANCE_MISMATCH"
                assert (await request(client, "GET", path, 200))["items"] == []
                headers["X-AstroPhoto-Instance-ID"] = storage.workspaces.instance_id
                await request(client, "POST", path, 201, payload, headers=headers)

    asyncio.run(exercise())


@pytest.mark.parametrize("external_workspace", [False, True])
def test_mcp_storage_delete_removes_managed_copy_and_preserves_source(tmp_path, external_workspace):
    from fastmcp import Client
    from astrophoto_mcp.server import create_server

    source = tmp_path / 'source.fit'
    source.write_bytes(b'original')
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            current = await request(client, 'GET', '/storage', 200)
            storage.update_settings(current['imports']['revision'], imports='copy')
            expected_workspace = storage.initial_workspace_id
            if external_workspace:
                from astrophoto.api.storage import update_location_policy

                expected_workspace = storage.workspaces.register(str(tmp_path / "external-workspace"), "External")["id"]
                revision = (await request(client, "GET", "/storage", 200))["imports"]["revision"]
                update_location_policy(storage, None, None, {
                    "expected_revision": revision, "order": [expected_workspace, storage.initial_workspace_id],
                    "quotas": {},
                })
            await import_items(client, sources=[str(source)], catalog={
                'kind': 'image_result', 'name': 'Managed', 'asset_type': 'image_result',
            })
            row, = (await request(client, 'GET', '/catalog/image_result', 200))['items']
            managed = storage.assets.resolve_asset(row['id'])
            assert managed.is_relative_to(storage.workspaces.require(expected_workspace))
            assert managed.read_bytes() == b'original'
            async with Client(create_server(f'http://127.0.0.1:{client.server.port}')) as agent:
                result = (await agent.call_tool('storage_delete_managed_file', {'name': 'Managed'})).data
                assert result['deleted_file'] is True
            assert not managed.exists() and source.read_bytes() == b'original'
            workspace = storage.initial_workspace_id
            output_id = str(uuid4())
            key = f'outputs/{output_id}/result.fit'
            output = storage.workspaces.require(workspace) / key
            output.parent.mkdir(parents=True)
            output.write_bytes(b'formal')
            manifest = output.parent / 'manifest.json'
            manifest.write_text('{}', encoding='utf-8')
            storage.library.record_output(output_id, workspace, key, None, {'size_bytes': 6})
            storage.library._collect_output({'output_id': output_id})
            async with Client(create_server(f'http://127.0.0.1:{client.server.port}')) as agent:
                result = (await agent.call_tool('storage_delete_managed_file', {'name': 'result.fit'})).data
                assert result['deleted_file'] is True
            assert not output.exists() and manifest.is_file()
            registered = (await request(client, 'GET', '/catalog/image_result/' + output_id, 200))
            assert registered['id'] == output_id
            current = await request(client, 'GET', '/storage', 200)
            storage.update_settings(current['imports']['revision'], imports='reference')
            external = tmp_path / 'external.fit'
            external.write_bytes(b'external')
            await import_items(client, sources=[str(external)], catalog={
                'kind': 'image_result', 'name': 'External', 'asset_type': 'image_result',
            })
            async with Client(create_server(f'http://127.0.0.1:{client.server.port}')) as agent:
                denied = await agent.call_tool('storage_delete_managed_file', {'name': 'External'}, raise_on_error=False)
                assert denied.is_error and 'ASSET_NOT_MANAGED' in denied.content[0].text
            assert external.read_bytes() == b'external'
    asyncio.run(exercise())


def test_changing_collection_type_detaches_incompatible_calibration(tmp_path):
    frame = tmp_path / 'light.fit'
    dark = tmp_path / 'dark.fit'
    frame.write_bytes(b'frame')
    dark.write_bytes(b'dark')
    async def exercise():
        async with library_client(tmp_path) as (client, _):
            await import_items(client, sources=[str(dark)], catalog={
                'kind': 'calibration_master', 'master_type': 'dark', 'name': 'Dark',
            })
            master, = (await request(client, 'GET', '/catalog/calibration_master', 200))['items']
            receipt = await import_items(client, sources=[str(frame)], catalog={
                'kind': 'subframe_collection', 'name': 'Lights', 'frame_type': 'light',
                'master_ids': [master['id']],
            })
            path = '/catalog/subframe_collection/' + receipt['collection_id']
            changed = await request(client, 'PATCH', path, 200, {'frame_type': 'bias'})
            assert changed['frame_type'] == 'bias' and changed['master_ids'] == []
            assert (await request(client, 'GET', '/catalog/calibration_master/' + master['id'], 200))['name'] == 'Dark'
    asyncio.run(exercise())


def test_calibration_master_project_reference_is_atomic(tmp_path, monkeypatch):
    from fastmcp import Client

    from astrophoto_mcp.server import create_server

    source = tmp_path / "legacy.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            await import_items(client, sources=[str(source)], catalog={
                "kind": "calibration_master", "master_type": "dark", "name": "Legacy dark",
            })
            master, = (await request(client, "GET", "/catalog/calibration_master", 200))["items"]
            master_id = master["id"]
            rows = await request(client, "GET", "/catalog/assets", 200)
            assert [(row["id"], row["asset_type"]) for row in rows["items"]] == [(master_id, "master_frame")]
            project = await request(client, "POST", "/catalog/projects", 201, {"name": "M31"})
            path = "/catalog/projects/" + project["id"]
            reference = {"kind": "image_result", "resource_id": master_id}
            missing = {**reference, "resource_id": str(uuid4())}
            failed = await request(client, "POST", path + "/references", 404, {
                "parent_path": "/", "assets": [reference, missing],
            })
            assert failed["error"]["code"] == "LIBRARY_RECORD_NOT_FOUND"
            assert (await request(client, "GET", path, 200))["items"] == []
            saved = await request(client, "POST", path + "/references", 201, {"parent_path": "/", "assets": [reference]})
            node, = saved["items"]
            detail = await request(client, "GET", path + "?path=/Legacy%20dark", 200)
            assert detail["node"]["asset_type"] == "master_frame"
            assert detail["resource"]["id"] == master_id and detail["resource"]["master_type"] == "dark"
            async with Client(create_server(f"http://127.0.0.1:{client.server.port}")) as agent:
                result = (await agent.call_tool("project_get", {"project_name": "M31", "path": "/Legacy dark"})).data
                assert result["asset"]["name"] == "Legacy dark"
                assert result["asset"]["master_type"] == "dark"
                item = (await agent.call_tool("library_get", {"name": "Legacy dark"})).data
                assert item["asset_type"] == "master_frame" and item["master_type"] == "dark"
                removed = (await agent.call_tool("library_remove", {"name": "Legacy dark"})).data
                assert removed["removed"]
            assert (await request(client, "GET", path, 200))["items"] == []
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


def test_catalog_unregistration_uses_displayed_master_revision(tmp_path):
    from astrophoto.database.catalog_models import ImageResult

    source = tmp_path / "master.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            await import_items(client, sources=[str(source)], catalog={
                "kind": "calibration_master", "master_type": "dark", "name": "Dark",
            })
            listed, = (await request(client, "GET", "/catalog/image_result", 200))["items"]
            path = "/catalog/image_result/" + listed["id"]
            opened = await request(client, "GET", path, 200)
            await request(client, "PATCH", path, 200, {
                "revision": opened["revision"], "notes": "Changed elsewhere",
            })
            with storage.db.session(transaction="write") as session:
                session.get(ImageResult, listed["id"]).revision = opened["revision"]
            conflict = await request(client, "DELETE", path, 409, {"revision": opened["revision"]})
            assert conflict["error"]["code"] == "REVISION_CONFLICT"
            current = await request(client, "GET", path, 200)
            await request(client, "DELETE", path, 200, {"revision": current["revision"]})
            await request(client, "GET", path, 404)
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


def test_direct_calibration_camera_unlinked_on_equipment_deletion(tmp_path):
    source = tmp_path / "master.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, _):
            camera = await request(client, "POST", "/equipment", 201, {
                "equipment_type": "camera", "name": "Camera", "product_name": "Camera",
            })
            await import_items(client, sources=[str(source)], catalog={
                "kind": "calibration_master", "master_type": "dark", "name": "Dark", "camera_id": camera["id"],
            })
            master, = (await request(client, "GET", "/catalog/calibration_master", 200))["items"]
            assert master["camera_id"] == camera["id"] and master["equipment_train_id"] is None
            equipment_path = "/equipment/" + camera["id"]
            deletion = {}
            master_path = "/catalog/calibration_master/" + master["id"]
            reply = await client.delete(BASE + equipment_path, headers=BROWSER, json=deletion)
            assert reply.status == 204
            updated = await request(client, "GET", master_path, 200)
            assert updated["camera_id"] is None
            assert updated["camera_snapshot"] == master["camera_snapshot"]

    asyncio.run(exercise())


def test_removed_optical_devices_preserve_master_history_and_compare(tmp_path):
    async def exercise():
        fixtures = {}
        for name in ("Lights", "Flats", "Match", "Difference", "Ordinary", "Inherited"):
            file = tmp_path / (name + ".fit")
            file.write_bytes(name.encode())
            fixtures[name] = str(file)

        async with library_client(tmp_path) as (client, storage):
            async def equipment(kind, name):
                return (await request(client, "POST", "/equipment", 201, {
                    "equipment_type": kind, "name": name, "product_name": name,
                }))["id"]

            camera_id = await equipment("camera", "Camera")
            filter_id = await equipment("filter", "L")
            other_filter = await equipment("filter", "R")
            train = await request(client, "POST", "/optical-trains", 201, {
                "name": "Imaging train", "camera_id": camera_id, "filter_ids": [filter_id, other_filter],
            })
            optics = {"equipment_train_id": train["id"], "filter_state": "selected", "filter_id": filter_id}

            async def import_record(name, kind, **fields):
                return await import_items(client, sources=[fixtures[name]], catalog={"name": name, "kind": kind, **fields})

            lights = await import_record("Lights", "subframe_collection", frame_type="light", **optics)
            flats = await import_record("Flats", "subframe_collection", frame_type="flat", **optics)
            await import_record("Match", "calibration_master", master_type="flat", **optics)
            await import_record("Difference", "calibration_master", master_type="flat", **{**optics, "filter_id": other_filter})
            await import_record("Ordinary", "image_result", asset_type="master_frame", master_type="unknown", **optics)

            async def comparisons():
                path = "/catalog/calibration_master?collection=" + lights["collection_id"]
                rows = (await request(client, "GET", path, 200))["items"]
                return {row["name"]: tuple(row["comparison"][key]["status"] for key in ("camera_id", "filter"))
                        for row in rows}

            expected = {"Match": ("match", "match"), "Difference": ("match", "difference")}
            assert await comparisons() == expected

            settings = await request(client, "GET", "/storage", 200)
            revision = storage.update_settings(settings["imports"]["revision"], imports="copy")["revision"]
            endpoint = "/library/direct-imports"
            preview = await request(client, "POST", endpoint + "/preview", 200, {
                "settings_revision": revision, "files": [{"name": "queued.fit", "size_bytes": 6}],
                "catalog": {"kind": "calibration_master", "master_type": "flat", "name": "Queued", "camera_id": camera_id, **optics},
            })
            job = await request(client, "POST", endpoint, 201, {
                "preview_id": preview["preview_id"], "idempotency_key": str(uuid4()),
            })

            for device_id in (camera_id, filter_id):
                response = await client.delete(BASE + "/equipment/" + device_id, headers=BROWSER, json={})
                assert response.status == 204
            assert await comparisons() == expected

            await import_record("Inherited", "calibration_master", master_type="flat", source_collection_id=flats["collection_id"])
            ordinary, = (await request(client, "GET", "/catalog/image_result?exact_name=Ordinary", 200))["items"]
            converted = await request(client, "PATCH", "/catalog/image_result/" + ordinary["id"], 200, {"master_type": "flat"})
            assert converted["camera_id"] is None and converted["camera_snapshot"]["id"] == camera_id

            entry, = job["entries"]
            response = await client.put(BASE + endpoint + f"/{job['id']}/files/{entry['id']}", data=b"queued", headers=BROWSER)
            assert response.status == 200, await response.text()
            rows = (await request(client, "GET", "/catalog/calibration_master", 200))["items"]
            for name in ("Inherited", "Queued"):
                row = next(row for row in rows if row["name"] == name)
                assert row["camera_id"] is None and row["camera_snapshot"]["id"] == camera_id
                assert row["filter_id"] is None and row["filter_state"] == "unknown"
                assert row["filter_snapshot"]["id"] == filter_id

    asyncio.run(exercise())


def test_large_collection_unregistration_batches_and_rolls_back(tmp_path):
    from types import SimpleNamespace

    from sqlalchemy import event, func, insert

    from astrophoto.api.catalog import remove_collection
    from astrophoto.core.errors import StorageError
    from astrophoto.database.catalog_models import Subframe, SubframeCollection
    from astrophoto.database.library_models import AssetAttributes
    from astrophoto.database.models import Asset

    source = tmp_path / "frame.fit"
    source.write_bytes(b"original")
    collection_id, survivor = str(uuid4()), str(uuid4())
    members = [str(uuid4()) for _ in range(10_000)]
    path = "/catalog/subframe_collection/" + collection_id

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            with storage.db.session(transaction="write") as session:
                session.execute(insert(SubframeCollection), [{
                    "id": collection_id, "name": "Large", "frame_type": "light",
                    "calibration_state": "unknown", "created_at_utc": "now", "updated_at_utc": "now",
                }])
                session.execute(insert(Asset), [
                    {"id": key, "name": source.name, "size_bytes": 8, "mtime_ns": 0} for key in [*members, survivor]
                ])
                session.execute(insert(AssetLocation), [
                    {"id": key, "asset_id": key, "storage_mode": "external_reference",
                     "external_path": str(source), "external_key": str(source)} for key in members
                ])
                session.execute(insert(Subframe), [
                    {"id": key, "collection_id": collection_id, "frame_index": index} for index, key in enumerate(members)
                ])
                session.execute(insert(AssetAttributes), [
                    *({"asset_id": key, "attributes": {}} for key in members),
                    {"asset_id": survivor, "attributes": {
                        "source_asset_id": members[0], "calibration_source_asset_id": members[-1], "role": "processed",
                    }},
                ])
            scans = batches = queries = 0
            interrupt = True

            def observe(_conn, _cursor, statement, *_args):
                nonlocal scans, batches, queries
                if statement.startswith("SELECT"):
                    queries += 1
                if statement.startswith("SELECT asset_attributes."):
                    scans += 1
                if statement.startswith("DELETE FROM assets "):
                    batches += 1
                    if interrupt and batches == 2:
                        raise StorageError("REVISION_CONFLICT")

            event.listen(storage.db.engine, "before_cursor_execute", observe)
            try:
                summary = await request(client, "GET", path + "?summary=1&bindings=1", 200)
                assert summary["count"] == 10_000 and "subframes" not in summary
                queries = 0
                full = await request(client, "GET", path, 200)
                assert [item["id"] for item in full["subframes"]] == members
                assert queries < 12
                first = await request(client, "GET", path + "/files?limit=50&view=assets", 200)
                second = await request(client, "GET", path + "/files?limit=50&after=" + first["next"], 200)
                assert [item["id"] for item in first["items"] + second["items"]] == members[:100]
                assert first["total"] == second["total"] == 10_000
                scans = 0
                with pytest.raises(StorageError, match="REVISION_CONFLICT"):
                    remove_collection(storage, None, SimpleNamespace(match_info={"id": collection_id}), {"revision": 1})
                assert batches == 2 and scans == 1
                with storage.db.session() as session:
                    assert session.scalar(select(func.count()).select_from(Subframe)) == 10_000
                    assert session.get(AssetAttributes, survivor).attributes["source_asset_id"] == members[0]
                interrupt, scans, batches = False, 0, 0
                await request(client, "DELETE", path, 200, {"revision": 1})
                assert scans == 1 and 1 < batches < 100
            finally:
                event.remove(storage.db.engine, "before_cursor_execute", observe)
            with storage.db.session() as session:
                assert list(session.scalars(select(Asset.id))) == [survivor]
                attrs = session.get(AssetAttributes, survivor)
                assert attrs.attributes == {"source_asset_id": None, "calibration_source_asset_id": None, "role": "processed"}
                assert attrs.revision == 2
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


def test_project_concurrent_updates_and_removal_use_current_tree(tmp_path, monkeypatch):

    async def exercise():
        async with library_client(tmp_path) as (client, _):
            project = await request(client, "POST", "/catalog/projects", 201, {"name": "Original"})
            path = "/catalog/projects/" + project["id"]
            replies = await asyncio.gather(*(client.patch(BASE + path, headers=BROWSER, json={
                "revision": project["revision"], "name": name,
            }) for name in ("First", "Second")))
            assert sorted(response.status for response in replies) == [200, 409]
            original = await request(client, "POST", path + "/nodes", 201, {"kind": "folder", "name": "Old"})
            counts = {"affected_folders": 1, "affected_references": 0}
            preview = await request(client, "GET", path + "?path=/&view=impact", 200, headers=AGENT)
            assert all(preview[key] == value for key, value in counts.items())
            assert set(preview) == {*counts, "request_id"}
            await request(client, "DELETE", path + "/nodes/" + original["id"], 200, {})
            replacement = await request(client, "POST", path + "/nodes", 201, {"kind": "folder", "name": "New"})
            conflict = await request(client, "PATCH", path + "/nodes/" + replacement["id"], 409,
                                     {"revision": 999, "name": "Stale"})
            assert conflict["error"]["code"] == "REVISION_CONFLICT"
            tree = await request(client, "GET", path, 200)
            assert [item["id"] for item in tree["items"]] == [replacement["id"]]
            child = await request(client, "POST", path + "/nodes", 201, {
                "kind": "folder", "name": "Added", "parent_id": replacement["id"],
            })
            for parent in (replacement, child):
                invalid = await request(client, "PATCH", path + "/nodes/" + replacement["id"], 422, {
                    "parent_id": parent["id"],
                })
                assert invalid["error"]["code"] == "INVALID_LIBRARY_REFERENCE"
            nonempty = await request(client, "GET", path + "?path=/New&view=impact", 200)
            assert nonempty["affected_folders"] == 1
            for key in ("revision", "confirmed", "impact_token"):
                await request(client, "DELETE", path, 422, {key: True})
            response = await request(client, "DELETE", path + "/nodes/" + replacement["id"], 200, {})
            assert response["deleted"] and response["affected_folders"] == 1
            await request(client, "DELETE", path, 200, {})

    asyncio.run(exercise())


def test_missing_import_submission_receipt_can_be_recovered_after_restart(tmp_path):
    source = tmp_path / "source.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            settings = await request(client, "GET", "/storage", 200)
            payload = {"sources": [str(source)], "settings_revision": settings["imports"]["revision"],
                       "catalog": {"kind": "image_result", "name": "Recovered"}}
            preview = await request(client, "POST", "/assets/import/preview", 200, payload)
            submission = {**payload, "preview_id": preview["preview_id"], "idempotency_key": "lost-receipt"}
            # Read the status line only. The client never learns the operation ID.
            async with client.post(BASE + "/assets/import", headers=BROWSER, json=submission) as response:
                assert response.status == 202
            # Let the server finish independently before restarting it. Orderly
            # shutdown requests cancellation of any still-active import.
            for _ in range(150):
                if any(row["phase"] == "completed" for row in storage.operations.recent()):
                    break
                await asyncio.sleep(0.025)
            else:
                pytest.fail("The import did not finish before restart")
        async with library_client(tmp_path) as (client, _):
            replay = await request(client, "POST", "/assets/import", 202, submission)
            receipt = await wait_import(client, replay["operation_id"])
            assert receipt["registered"] == 1
            catalog_rows = await request(client, "GET", "/catalog/assets", 200)
            assert [row["name"] for row in catalog_rows["items"]] == ["Recovered"]
            operations = await request(client, "GET", "/storage/operations", 200)
            assert [row["operation_id"] for row in operations["operations"] if row["kind"] == "import"] == [replay["operation_id"]]
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


@asynccontextmanager
async def library_client(tmp_path):
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    assert runtime.storage is not None, runtime.storage_error
    runtime.trusted_local = True
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)
    try:
        async with TestClient(TestServer(app)) as client:
            yield client, runtime.storage
    finally:
        runtime.storage.close()


async def request(client, method, path, expected, payload=None, headers=None):
    response = await client.request(method, BASE + path, json=payload, headers=BROWSER if headers is None else headers)
    body = await response.json()
    assert response.status == expected, (method, path, body)
    return body


async def import_items(client, **source):
    settings = await request(client, "GET", "/storage", 200)
    payload = {**source, "settings_revision": settings["imports"]["revision"], "allow_duplicate": True}
    preview = await request(client, "POST", "/assets/import/preview", 200, payload)
    operation = await request(client, "POST", "/assets/import", 202, {
        **payload, "preview_id": preview["preview_id"], "idempotency_key": str(uuid4()),
    })
    return await wait_import(client, operation["operation_id"])


async def wait_import(client, operation_id):
    for _ in range(150):
        status = await request(client, "GET", f"/assets/imports/{operation_id}", 200)
        if status["phase"] in {"completed", "failed", "cancelled"}:
            assert status["phase"] == "completed", status
            return status["receipt"]
        await asyncio.sleep(0.025)
    raise AssertionError(status)


def test_retired_library_routes_and_import_fields_cannot_write(tmp_path):
    async def exercise():
        source = tmp_path / "source.fit"
        source.write_bytes(b"original")
        ident = str(uuid4())
        async with library_client(tmp_path) as (client, storage):
            routes = [
                ("POST", "/library/import-requests"),
                ("GET", "/library/approvals"),
                ("GET", f"/library/approvals/{ident}"),
                ("POST", f"/library/approvals/{ident}"),
                ("PUT", f"/library/uploads/{ident}"),
                ("DELETE", f"/library/uploads/{ident}"),
                ("GET", f"/assets/{ident}/availability"),
                ("PATCH", f"/assets/{ident}/sessions"),
                ("GET", "/assets"),
            ]
            for kind in ("sessions", "collections", "projects", "folders", "masters", "assignments", "placements"):
                routes.extend((method, f"/library/{kind}") for method in ("GET", "POST"))
            for method, path in routes:
                response = await client.request(method, BASE + path, headers=BROWSER, json={})
                assert response.status == 404, (method, path, await response.text())
            for field, value in (("uploads", [ident]), ("session_id", ident)):
                result = await request(client, "POST", "/assets/import", 422, {
                    "sources": [str(source)], "idempotency_key": "invalid", field: value,
                })
                assert result["error"]["code"] == "INVALID_REQUEST"
            assert (await request(client, "GET", "/storage/operations", 200))["operations"] == []
            assert storage.library.list("assets", {})["items"] == []
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


def test_typed_catalog_import_calibration_and_project_tree(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            source = tmp_path / "frames"
            source.mkdir()
            for name in ("first.fit", "second.fit"):
                (source / name).write_bytes(b"frame")
            master_file = tmp_path / "dark.fit"
            master_file.write_bytes(b"master")
            await import_items(client, sources=[str(master_file)], catalog={
                "kind": "calibration_master", "name": "Dark A", "master_type": "dark", "temperature_c": -10.1,
            })
            masters = await request(client, "GET", "/catalog/calibration_master", 200)
            master, = masters["items"]
            settings = await request(client, "GET", "/storage", 200)
            payload = {"sources": [str(source)], "settings_revision": settings["imports"]["revision"],
                       "catalog": {"kind": "subframe_collection", "name": "M31", "frame_type": "light",
                                   "temperature_c": 20, "master_ids": [master["id"]]}}
            checked = await request(client, "POST", "/assets/import/preview", 200, payload)
            comparison = checked["calibration"][0]["fields"]
            assert "temperature_c" not in comparison
            assert comparison["camera_id"]["status"] == "unknown"
            operation = await request(client, "POST", "/assets/import", 202, {
                **payload, "preview_id": checked["preview_id"], "idempotency_key": str(uuid4()),
            })
            receipt = await wait_import(client, operation["operation_id"])
            group = await request(client, "GET", "/catalog/subframe_collection/" + receipt["collection_id"], 200)
            assert group["temperature_c"] == 20 and master["temperature_c"] == -10.1
            assert group["master_ids"] == [master["id"]] and group["calibration_state"] == "unknown"
            assert {f["file_name"] for f in group["subframes"]} == {"first.fit", "second.fit"}
            assert all(f["storage_mode"] == "external_reference" for f in group["subframes"])
            groups = await request(client, "GET", "/library/import-groups", 200)
            summary, = groups["items"]
            assert summary["frame_type"] == "light" and summary["available"] is True

            project = await request(client, "POST", "/catalog/projects", 201, {"name": "M31"})
            project_path = "/catalog/projects/" + project["id"]
            await request(client, "POST", project_path + "/folders", 201, {"paths": ["/Raw/L", "/Processed"]})
            node = await request(client, "POST", project_path + "/nodes", 201, {
                "kind": "subframe_collection", "resource_id": group["id"], "parent_path": "/raw/l", "name": "Lights",
            })
            await request(client, "POST", project_path + "/nodes", 409, {
                "kind": "subframe_collection", "resource_id": group["id"],
            })
            await request(client, "POST", project_path + "/folders", 409, {"paths": ["/Will Roll Back", "/Raw/L/Lights/X"]})
            tree = await request(client, "GET", "/catalog/projects?name=m31", 200)
            assert {item["name"] for item in tree["items"]} == {"Raw", "L", "Processed", "Lights"}
            resolved = await request(client, "GET", project_path + "?path=/Raw/L/Lights", 200)
            assert resolved["resource"]["id"] == group["id"] and resolved["node"]["id"] == node["id"]
            await request(client, "DELETE", project_path, 200, {})
            assert (source / "first.fit").read_bytes() == b"frame"
            await request(client, "GET", "/catalog/subframe_collection/" + group["id"], 200)
    asyncio.run(exercise())


def test_unified_calibration_master_import_binding_and_edit(tmp_path):
    async def exercise():
        source = tmp_path / 'dark.fit'
        source.write_bytes(b'master')
        frame = tmp_path / 'light.fit'
        frame.write_bytes(b'frame')
        async with library_client(tmp_path) as (client, _storage):
            await import_items(client, sources=[str(source)], catalog={
                'kind': 'image_result', 'name': 'Dark', 'asset_type': 'master_frame',
                'master_type': 'dark', 'exposure_seconds': 120,
            })
            masters = await request(client, 'GET', '/catalog/calibration_master', 200)
            master, = masters['items']
            removed_registration = await client.post(BASE + '/catalog/calibration_master', headers=BROWSER, json={})
            assert removed_registration.status in (404, 405)
            images = await request(client, 'GET', '/catalog/image_result', 200)
            image, = images['items']
            assert image['id'] == master['id'] and image['master_type'] == 'dark'
            assert image['asset_type'] == master['asset_type'] == 'master_frame'
            assert 'result_type' not in image and 'type' not in master
            for query in ('type=dark', 'result_type=master_frame'):
                await request(client, 'GET', '/catalog/image_result?' + query, 422)
            assert image['exposure_seconds'] == 120
            assets = await request(client, 'GET', '/library/assets?import_group_id=ungrouped', 200)
            assert [item['id'] for item in assets['items']] == [image['id']]
            assert assets['items'][0]['catalog_resource'] == 'calibration_master'
            assert 'catalog_kind' not in assets['items'][0]
            asset_path = '/library/assets/' + image['id']
            detail = await request(client, 'GET', asset_path, 200)
            assert detail['catalog_resource'] == 'calibration_master'
            receipt = await import_items(client, sources=[str(frame)], catalog={
                'kind': 'subframe_collection', 'name': 'Lights', 'frame_type': 'light',
                'master_ids': [master['id']],
            })
            facets = await request(client, 'GET', '/catalog/assets', 200)
            grouped = next(item for item in facets['items'] if item['id'] == receipt['collection_id'])
            assert grouped['asset_type'] == 'subframe_collection' and grouped['extensions'] == ['fit']
            assert grouped['workspace_ids'] == ['external']
            rejected = await request(client, 'PATCH', asset_path, 422, {'attributes': {'role': 'processed'}})
            assert rejected['error']['code'] == 'INVALID_REQUEST'
            unchanged = await request(client, 'GET', asset_path, 200)
            for key in ('attributes', 'catalog_resource', 'revision'):
                assert unchanged[key] == detail[key]
            for kind in ('calibration_master', 'image_result'):
                entry = await request(client, 'GET', f'/catalog/{kind}/{image["id"]}', 200)
                assert (entry['asset_type'], entry['master_type']) == ('master_frame', 'dark')
            ordinary = await request(client, 'GET', '/catalog/image_result?asset_type=image_result', 200)
            assert ordinary['items'] == []
            filtered = await request(client, 'GET', '/catalog/image_result?asset_type=master_frame', 200)
            assert [item['id'] for item in filtered['items']] == [image['id']]
            group = await request(client, 'GET', '/catalog/subframe_collection/' + receipt['collection_id'], 200)
            assert group['master_ids'] == [master['id']]
            updated = await request(client, 'PATCH', '/catalog/image_result/' + image['id'], 200, {
                'revision': image['revision'], 'master_type': 'light',
            })
            assert updated['master_type'] == 'light'
            assert (await request(client, 'GET', '/catalog/subframe_collection/' + receipt['collection_id'], 200))['master_ids'] == []
            assert not (await request(client, 'GET', '/catalog/calibration_master', 200))['items']
            assert (await request(client, 'GET', asset_path, 200))['catalog_resource'] == 'image_result'
            assert source.read_bytes() == b'master'
            await request(client, 'PATCH', '/catalog/image_result/' + image['id'], 200, {
                'revision': updated['revision'], 'master_type': 'dark',
            })
            registered, = (await request(client, 'GET', '/catalog/calibration_master', 200))['items']
            await request(client, 'DELETE', '/catalog/calibration_master/' + image['id'], 200, {'revision': registered['revision']})
            assert not (await request(client, 'GET', '/catalog/image_result', 200))['items']
            assert source.read_bytes() == b'master'
    asyncio.run(exercise())


def test_fixture_import_plans_calibration_master_with_canonical_field(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).resolve().parents[2] / "scripts"))
    from scripts.import_library_test_assets import make_tasks

    relative = "calibration-masters/Master_Dark_180s_Bin1_2600MM_gain100_-10C.fit"
    source = tmp_path / relative
    source.parent.mkdir()
    source.write_bytes(b"synthetic dark master")
    manifest = {"groups": [], "files": [
        {"path": relative, "category": "dark", "import_entry": "calibration_master", "group": None},
    ]}
    task, = make_tasks(tmp_path, manifest, {}, {})
    assert task["catalog"]["master_type"] == "dark"
    assert "type" not in task["catalog"]

    async def exercise():
        async with library_client(tmp_path) as (client, _storage):
            settings = await request(client, "GET", "/storage", 200)
            payload = {"sources": [task["source"]], "settings_revision": settings["imports"]["revision"],
                       "catalog": task["catalog"]}
            preview = await request(client, "POST", "/assets/import/preview", 200, payload)
            assert preview["preview_id"] and not preview["failed"]
            retired = {key: value for key, value in task["catalog"].items() if key != "master_type"}
            invalid = await request(client, "POST", "/assets/import/preview", 422,
                                    {**payload, "catalog": {**retired, "type": "dark"}})
            assert invalid["error"]["code"] == "INVALID_REQUEST"

    asyncio.run(exercise())


def test_catalog_names_unique_across_types_and_released_on_removal(tmp_path):
    async def exercise():
        group_file = tmp_path / 'group.fit'
        video_file = tmp_path / 'video.mp4'
        master_file = tmp_path / 'master.fit'
        for path in (group_file, video_file, master_file):
            path.write_bytes(b'test')
        async with library_client(tmp_path) as (client, _storage):
            group = await import_items(client, sources=[str(group_file)], catalog={
                'kind': 'subframe_collection', 'name': 'Étoile', 'frame_type': 'light',
            })
            settings = await request(client, 'GET', '/storage', 200)
            for kind, extra in [('video', {}), ('image_result', {'asset_type': 'master_frame'}),
                                ('image_result', {'asset_type': 'image_result'})]:
                result = await request(client, 'POST', '/assets/import/preview', 409, {
                    'settings_revision': settings['imports']['revision'], 'sources': [str(video_file)],
                    'catalog': {'kind': kind, 'name': ' e\u0301TOILE ', **extra},
                })
                assert result['error']['code'] == 'ASSET_NAME_CONFLICT'
            await import_items(client, sources=[str(master_file)], catalog={
                'kind': 'image_result', 'name': 'Dark', 'asset_type': 'master_frame', 'master_type': 'dark',
            })
            master, = (await request(client, 'GET', '/catalog/image_result', 200))['items']
            result = await request(client, 'PATCH', '/catalog/image_result/' + master['id'], 409, {
                'revision': master['revision'], 'name': 'ÉTOILE',
            })
            assert result['error']['code'] == 'ASSET_NAME_CONFLICT'
            await request(client, 'DELETE', '/catalog/subframe_collection/' + group['collection_id'], 200, {'revision': 1})
            renamed = await request(client, 'PATCH', '/catalog/image_result/' + master['id'], 200, {
                'revision': master['revision'], 'name': 'Étoile',
            })
            assert renamed['name'] == 'Étoile'
            await request(client, 'DELETE', '/catalog/image_result/' + master['id'], 200, {'revision': renamed['revision']})
            await import_items(client, sources=[str(video_file)], catalog={'kind': 'video', 'name': 'Étoile'})
    asyncio.run(exercise())


def test_concurrent_catalog_name_reservations_are_atomic(tmp_path):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from astrophoto.assets.catalog import reserve_name
    from astrophoto.core.errors import StorageError

    async def exercise():
        async with library_client(tmp_path) as (_client, storage):
            barrier = Barrier(2)

            def reserve():
                barrier.wait()
                try:
                    with storage.db.session(transaction='write') as session:
                        reserve_name(session, 'M31', str(uuid4()))
                    return 'ok'
                except StorageError as exc:
                    return exc.code

            with ThreadPoolExecutor(max_workers=2) as pool:
                assert sorted(pool.map(lambda _: reserve(), range(2))) == ['ASSET_NAME_CONFLICT', 'ok']
    asyncio.run(exercise())


def test_ordinary_master_capture_source_and_type_changes(tmp_path):
    async def exercise():
        frame = tmp_path / 'light.fit'
        master_file = tmp_path / 'master.fit'
        frame.write_bytes(b'frame')
        master_file.write_bytes(b'master')
        async with library_client(tmp_path) as (client, _storage):
            receipt = await import_items(client, sources=[str(frame)], catalog={
                'kind': 'subframe_collection', 'name': 'Lights', 'frame_type': 'light',
                'gain': 100, 'binning': '1',
            })
            group_id = receipt['collection_id']
            await import_items(client, sources=[str(master_file)], catalog={
                'kind': 'image_result', 'asset_type': 'master_frame', 'master_type': 'light',
                'name': 'Light Master', 'source_collection_id': group_id, 'offset': 0,
            })
            master, = (await request(client, 'GET', '/catalog/image_result', 200))['items']
            assert master['gain'] == 100 and master['offset'] == 0 and master['source_collection_id'] == group_id
            assert master['source_collection_name'] == 'Lights'
            await request(client, 'DELETE', '/catalog/subframe_collection/' + group_id, 200, {'revision': 1})
            assert (await request(client, 'GET', '/catalog/image_result/' + master['id'], 200))['source_collection_id'] is None
            master = await request(client, 'PATCH', '/catalog/image_result/' + master['id'], 200, {
                'revision': master['revision'], 'source_collection_id': None, 'iso': 800,
            })
            assert master['iso'] == 800 and master['gain'] == 100 and master['offset'] == 0
            master = await request(client, 'PATCH', '/catalog/image_result/' + master['id'], 200, {
                'revision': master['revision'], 'master_type': 'dark',
            })
            assert master['gain'] == 100 and master['offset'] == 0 and master['iso'] == 800
            master = await request(client, 'PATCH', '/catalog/image_result/' + master['id'], 200, {
                'revision': master['revision'], 'master_type': 'unknown',
            })
            assert master['gain'] == 100 and master['offset'] == 0 and master['iso'] == 800
    asyncio.run(exercise())


def test_calibration_master_can_change_purpose(tmp_path):
    async def exercise():
        source = tmp_path / 'dark.fit'
        source.write_bytes(b'master')
        async with library_client(tmp_path) as (client, storage):
            await import_items(client, sources=[str(source)], catalog={
                'kind': 'calibration_master', 'name': 'Old Dark', 'master_type': 'dark',
            })
            master, = (await request(client, 'GET', '/catalog/calibration_master', 200))['items']
            edited = await request(client, 'PATCH', '/catalog/calibration_master/' + master['id'], 200, {
                'revision': master['revision'], 'master_type': 'light',
            })
            assert edited['master_type'] == 'light'
            assert not (await request(client, 'GET', '/catalog/calibration_master', 200))['items']
    asyncio.run(exercise())


def test_reference_subframe_group_imports_selected_files_from_multiple_folders(tmp_path):
    async def exercise():
        first = tmp_path / 'first'
        second = tmp_path / 'second'
        first.mkdir()
        second.mkdir()
        for path in (first / 'keep.fit', first / 'removed.fit', second / 'also.fit'):
            path.write_bytes(b'frame')
        async with library_client(tmp_path) as (client, _storage):
            receipt = await import_items(client, sources=[str(first / 'keep.fit'), str(second / 'also.fit')],
                                         catalog={'kind': 'subframe_collection', 'name': 'Combined'})
            group = await request(client, 'GET', '/catalog/subframe_collection/' + receipt['collection_id'], 200)
            assert {item['file_name'] for item in group['subframes']} == {'keep.fit', 'also.fit'}
            assert (first / 'removed.fit').read_bytes() == b'frame'
    asyncio.run(exercise())


def test_reference_image_result_categories_are_separate(tmp_path):
    async def exercise():
        master = tmp_path / 'stack.fit'
        result = tmp_path / 'processed.fit'
        master.write_bytes(b'master')
        result.write_bytes(b'result')
        async with library_client(tmp_path) as (client, _storage):
            for source, category in ((master, 'master_frame'), (result, 'image_result')):
                await import_items(client, sources=[str(source)], catalog={
                    'kind': 'image_result', 'name': source.stem, 'asset_type': category,
                })
            masters = await request(client, 'GET', '/library/assets?role=master_frame', 200)
            results = await request(client, 'GET', '/library/assets?role=processed', 200)
            assert [row['name'] for row in masters['items']] == ['stack']
            assert [row['name'] for row in results['items']] == ['processed']
    asyncio.run(exercise())


def test_image_result_optical_binding_import_update_and_clear(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, _storage):
            chosen = await request(client, 'POST', '/equipment', 201, {
                'equipment_type': 'filter', 'name': 'L', 'product_name': 'L',
            })
            unrelated = await request(client, 'POST', '/equipment', 201, {
                'equipment_type': 'filter', 'name': 'R', 'product_name': 'R',
            })
            train = await request(client, 'POST', '/optical-trains', 201, {
                'name': 'Imaging train', 'filter_ids': [chosen['id']],
            })
            source = tmp_path / 'image.fit'
            source.write_bytes(b'image')
            config = {'kind': 'image_result', 'name': 'Image', 'asset_type': 'master_frame',
                      'equipment_train_id': train['id'], 'filter_state': 'selected', 'filter_id': chosen['id']}
            settings = await request(client, 'GET', '/storage', 200)
            await request(client, 'POST', '/assets/import/preview', 422, {
                'sources': [str(source)], 'settings_revision': settings['imports']['revision'],
                'catalog': {**config, 'filter_id': unrelated['id']},
            })
            await import_items(client, sources=[str(source)], catalog=config)
            saved, = (await request(client, 'GET', '/catalog/image_result', 200))['items']
            assert saved['equipment_train_id'] == train['id'] and saved['filter_snapshot']['name'] == 'L'
            await request(client, 'PATCH', '/equipment/' + chosen['id'], 200, {
                'name': 'Changed',
            })
            path = '/catalog/image_result/' + saved['id']
            unchanged = await request(client, 'GET', path, 200)
            assert unchanged['filter_snapshot']['name'] == 'L'
            cleared = await request(client, 'PATCH', path, 200, {
                'revision': unchanged['revision'], 'equipment_train_id': None,
            })
            assert cleared['equipment_train_id'] is None and cleared['equipment_snapshot'] is None
            assert cleared['filter_state'] == 'unknown' and cleared['filter_snapshot'] is None
            rebound = await request(client, 'PATCH', path, 200, {
                'revision': cleared['revision'], 'equipment_train_id': train['id'],
                'filter_state': 'selected', 'filter_id': chosen['id'],
            })
            assert rebound['filter_snapshot']['name'] == 'Changed'
            stale = await request(client, 'PATCH', path, 409, {'revision': cleared['revision'], 'equipment_train_id': None})
            assert stale['error']['code'] == 'REVISION_CONFLICT'
    asyncio.run(exercise())


def test_remove_subframes_preserves_files_and_empty_collection(tmp_path):
    async def exercise():
        source = tmp_path / 'frames'
        source.mkdir()
        files = [source / 'one.fit', source / 'two.fit']
        for file in files:
            file.write_bytes(b'original')
        async with library_client(tmp_path) as (client, _storage):
            receipt = await import_items(client, sources=[str(source)], catalog={
                'kind': 'subframe_collection', 'name': 'Frames', 'frame_type': 'light',
            })
            group_path = '/catalog/subframe_collection/' + receipt['collection_id']
            group = await request(client, 'GET', group_path, 200)
            first, second = group['subframes']
            old_revision = group['revision']
            await request(client, 'DELETE', group_path + '/files/' + first['id'], 200, {'revision': old_revision})
            stale = await request(client, 'DELETE', group_path + '/files/' + second['id'], 409, {'revision': old_revision})
            assert stale['error']['code'] == 'REVISION_CONFLICT'
            group = await request(client, 'GET', group_path, 200)
            await request(client, 'DELETE', group_path + '/files/' + second['id'], 200, {'revision': group['revision']})
            group = await request(client, 'GET', group_path, 200)
            assert group['count'] == 0 and group['subframes'] == []
            summaries = await request(client, 'GET', '/library/import-groups', 200)
            assert summaries['items'][0]['count'] == 0 and summaries['items'][0]['available'] is None
            assert all(file.read_bytes() == b'original' for file in files)
    asyncio.run(exercise())


def test_edit_and_remove_collection_preserves_files_and_project_protection(tmp_path):
    async def exercise():
        source = tmp_path / 'frames'
        source.mkdir()
        files = [source / 'one.fit', source / 'two.fit']
        for file in files:
            file.write_bytes(b'original')
        async with library_client(tmp_path) as (client, _storage):
            receipt = await import_items(client, sources=[str(source)], catalog={
                'kind': 'subframe_collection', 'name': 'Frames', 'frame_type': 'light',
            })
            path = '/catalog/subframe_collection/' + receipt['collection_id']
            group = await request(client, 'GET', path, 200)
            group = await request(client, 'PATCH', path, 200, {'revision': group['revision'], 'name': 'Edited',
                                  'exposure_seconds': 180, 'gain': 100, 'temperature_c': -10,
                                  'calibration_state': 'uncalibrated'})
            assert group['name'] == 'Edited' and group['gain'] == 100 and group['temperature_c'] == -10
            member = await request(client, 'GET', '/library/assets/' + group['subframes'][0]['id'], 200)
            await request(client, 'PATCH', '/library/assets/' + member['id'], 422,
                          {'attributes': {'gain': 50}})
            stale = await request(client, 'PATCH', path, 409, {'revision': group['revision'] - 1, 'gain': 90})
            assert stale['error']['code'] == 'REVISION_CONFLICT'
            project = await request(client, 'POST', '/catalog/projects', 201, {'name': 'Project'})
            await request(client, 'POST', f"/catalog/projects/{project['id']}/nodes", 201,
                                 {'kind': 'subframe_collection', 'resource_id': group['id'], 'parent_path': '/'})
            await request(client, 'DELETE', path, 200, {'revision': group['revision']})
            await request(client, 'GET', path, 404)
            assert (await request(client, 'GET', f"/catalog/projects/{project['id']}", 200))['items'] == []
            assert all(file.read_bytes() == b'original' for file in files)
    asyncio.run(exercise())


def test_typed_copy_import_uses_one_image_result_record(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            train = await request(client, "POST", "/optical-trains", 201, {"name": "Copy train"})
            current = await request(client, "GET", "/storage", 200)
            storage.update_settings(current["imports"]["revision"], imports="copy")
            current = await request(client, "GET", "/storage", 200)
            config = {"settings_revision": current["imports"]["revision"],
                      "catalog": {"kind": "image_result", "name": "Integrated result", "asset_type": "image_result",
                                  "equipment_train_id": train["id"], "filter_state": "none"},
                      "files": [{"name": "stack.fit", "size_bytes": 4}]}
            endpoint = "/library/direct-imports"
            preview = await request(client, "POST", endpoint + "/preview", 200, config)
            start = {"preview_id": preview["preview_id"], "idempotency_key": str(uuid4())}
            job = await request(client, "POST", endpoint, 201, start)
            entry, = job["entries"]
            for _ in range(2):
                res = await client.put(BASE + endpoint + f"/{job['id']}/files/{entry['id']}", data=b"fits", headers=BROWSER)
                assert res.status == 200, await res.text()
            result = await request(client, "GET", "/catalog/image_result/" + entry["id"], 200)
            assert result["name"] == "Integrated result" and result["storage_mode"] == "managed"
            assert result["equipment_train_id"] == train["id"] and result["filter_state"] == "none"
            assert result["equipment_snapshot"]["name"] == "Copy train"
            listed = await request(client, "GET", "/library/assets?role=processed", 200)
            assert [row['id'] for row in listed['items']] == [entry['id']]
            path = storage.assets.resolve_asset(entry["id"])
            assert path.as_posix().endswith(result["relative_path"]) and path.read_bytes() == b"fits"
    asyncio.run(exercise())


def test_copy_binding_failure_preserves_published_collection(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            source = tmp_path / "dark.fit"
            source.write_bytes(b"dark")
            for label in ("Dark A", "Dark B"):
                await import_items(client, sources=[str(source)], catalog={
                    "kind": "calibration_master", "name": label, "master_type": "dark",
                })
            listing = await request(client, "GET", "/catalog/calibration_master", 200)
            first, second = sorted(listing["items"], key=lambda row: row["name"])
            current = await request(client, "GET", "/storage", 200)
            revision = storage.update_settings(current["imports"]["revision"], imports="copy")["revision"]
            endpoint = "/library/direct-imports"
            preview = await request(client, "POST", endpoint + "/preview", 200, {
                "settings_revision": revision, "files": [{"name": "light.fit", "size_bytes": 5}],
                "catalog": {"kind": "subframe_collection", "name": "Light", "frame_type": "light",
                            "master_ids": [first["id"]]},
            })
            job = await request(client, "POST", endpoint, 201, {
                "preview_id": preview["preview_id"], "idempotency_key": str(uuid4()),
            })
            await request(client, "DELETE", "/catalog/calibration_master/" + first["id"], 200, {"revision": 1})
            entry, = job["entries"]
            response = await client.put(BASE + endpoint + f"/{job['id']}/files/{entry['id']}",
                                        data=b"light", headers=BROWSER)
            assert response.status == 200, await response.text()
            status = await request(client, "GET", endpoint + "/" + job["id"], 200)
            assert status["phase"] == "completed" and status["binding_error"]["master_ids"] == [first["id"]]
            group_path = "/catalog/subframe_collection/" + job["group_id"]
            result = await request(client, "GET", group_path, 200)
            assert result["master_ids"] == [] and len(result["subframes"]) == 1
            link = {"master_ids": [second["id"]]}
            preview = await request(client, "POST", group_path + "/bindings", 200, {**link, "preview": True})
            for field in ("confirmed", "comparison", "requires_confirmation"):
                await request(client, "POST", group_path + "/bindings", 422, {**link, field: True})
            assert "requires_confirmation" not in preview
            await request(client, "POST", group_path + "/bindings", 200, link)
            result = await request(client, "GET", group_path, 200)
            assert result["master_ids"] == [second["id"]] and len(result["subframes"]) == 1
            await request(client, "DELETE", "/catalog/calibration_master/" + second["id"], 200, {"revision": 1})
            assert (await request(client, "GET", group_path, 200))["master_ids"] == []
            assert storage.assets.resolve_asset(entry["id"]).read_bytes() == b"light"
    asyncio.run(exercise())


def test_video_filter_must_belong_to_train_and_snapshot_is_stable(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, _):
            chosen = await request(client, "POST", "/equipment", 201, {
                "equipment_type": "filter", "name": "L", "product_name": "L Filter",
            })
            other = await request(client, "POST", "/equipment", 201, {
                "equipment_type": "filter", "name": "Ha", "product_name": "Ha Filter",
            })
            train = await request(client, "POST", "/optical-trains", 201, {
                "name": "Imaging train", "filter_ids": [chosen["id"]],
            })
            file = tmp_path / "video.ser"
            file.write_bytes(b"video")
            config = {"kind": "video", "name": "Moon", "equipment_train_id": train["id"],
                      "filter_state": "selected", "filter_id": chosen["id"]}
            settings = await request(client, "GET", "/storage", 200)
            await request(client, "POST", "/assets/import/preview", 422, {
                "sources": [str(file)], "settings_revision": settings["imports"]["revision"],
                "catalog": {**config, "filter_id": other["id"]},
            })
            await import_items(client, sources=[str(file)], catalog=config)
            await request(client, "PATCH", "/equipment/" + chosen["id"], 200, {
                "name": "L renamed",
            })
            videos = await request(client, "GET", "/catalog/video", 200)
            saved, = videos["items"]
            assert saved["filter_snapshot"]["name"] == "L"
            assert saved["equipment_snapshot"]["components"][0]["name"] == "L"
            assert "calibration_state" not in saved
    asyncio.run(exercise())


def test_copy_preview_snapshot_and_reference_independent_identity(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            captured = tmp_path / "target.ser"
            captured.write_bytes(b"user-source")
            receipt = await import_items(client, sources=[str(captured), str(captured)])
            assert receipt["registered"] == 2
            refs = (await request(client, "GET", "/library/assets", 200))["items"]
            assert len({item["id"] for item in refs}) == 2
            item = refs[0]
            denied = await request(client, "POST", f"/library/assets/{item['id']}/delete-file", 422, {})
            assert denied["error"]["code"] == "ASSET_NOT_MANAGED"
            asset_path = f"/library/assets/{item['id']}"
            for body in ({"revision": 999}, {"confirmed": False}, {"revision": 999, "confirmed": False}):
                rejected = await request(client, "DELETE", asset_path, 422, body)
                assert rejected["error"]["code"] == "INVALID_REQUEST"
                assert (await request(client, "GET", asset_path, 200))["id"] == item["id"]
                assert captured.read_bytes() == b"user-source"
            rejected = await request(client, "PATCH", asset_path, 422,
                                     {"revision": 999, "attributes": {"notes": "stale"}})
            assert rejected["error"]["code"] == "INVALID_REQUEST"
            assert (await request(client, "GET", asset_path, 200))["attributes"] == item["attributes"]
            await request(client, "PATCH", asset_path, 200, {"attributes": {"notes": "fixture"}})
            await request(client, "DELETE", asset_path, 200, {})
            assert captured.read_bytes() == b"user-source"

            changed = await request(client, "PATCH", "/storage/settings", 200, {
                "expected_revision": 0, "imports": {"default_mode": "copy"},
            })
            video = tmp_path / "Moon sequence.ser"
            video.write_bytes(b"server-file")
            payload = {"sources": [str(video)], "settings_revision": changed["revision"],
                       "catalog": {"kind": "video", "name": video.name}}
            preview = await request(client, "POST", "/assets/import/preview", 200, payload)
            changed = await request(client, "PATCH", "/storage/settings", 200, {
                "expected_revision": changed["revision"], "imports": {"default_mode": "copy"},
            })
            denied = await request(client, "POST", "/assets/import", 409, {
                **payload, "preview_id": preview["preview_id"], "idempotency_key": "stale",
            })
            assert denied["error"]["code"] == "REVISION_CONFLICT"
            outcome = await import_items(client, sources=[str(video)], catalog=payload["catalog"])
            assert outcome["copied"] == 1
            item = (await request(client, "GET", "/library/assets?file_kind=video", 200))["items"][0]
            assert item["name"] == "Moon sequence.ser"
            video_path = "/catalog/video/" + item["id"]
            for method, body in (("PATCH", {"revision": 999, "notes": "stale"}),
                                 ("DELETE", {"revision": 999})):
                conflict = await request(client, method, video_path, 409, body)
                assert conflict["error"]["code"] == "REVISION_CONFLICT"
            assert (await request(client, "GET", video_path, 200))["notes"] is None
            with storage.db.session() as session:
                stored = session.scalar(select(AssetLocation).where(AssetLocation.asset_id == item["id"]))
            physical = resolve_managed(storage.workspaces, stored)
            assert physical.read_bytes() == video.read_bytes() == b"server-file"
            delete_path = f"/library/assets/{item['id']}/delete-file"
            for body in ({"confirmed": False}, {"revision": 999}, {"confirmed": False, "revision": 999}):
                denied = await request(client, "POST", delete_path, 422, body)
                assert denied["error"]["code"] == "INVALID_REQUEST"
                assert physical.read_bytes() == b"server-file"
                assert (await request(client, "GET", f"/library/assets/{item['id']}", 200))["available"]
            result = await request(client, "POST", delete_path, 200, {})
            assert result["id"] == item["id"] and result["deleted_file"] is True
            assert not physical.exists()
            assert not (await request(client, "GET", f"/library/assets/{item['id']}", 200))["available"]

    asyncio.run(exercise())


def test_direct_group_resumes_after_host_restart_and_preserves_project(tmp_path):
    async def exercise():
        route = "/library/direct-imports"
        bodies = [b"first exposure", b"second exposure"]
        async with library_client(tmp_path) as (client, storage):
            project = await request(client, "POST", "/catalog/projects", 201, {"name": "M31"})
            config = await request(client, "PATCH", "/storage/settings", 200,
                                   {"expected_revision": 0, "imports": {"default_mode": "copy"}})
            manifest = {"files": [{"name": f"light-{index}.fit", "size_bytes": len(body)} for index, body in enumerate(bodies)],
                        "catalog": {"kind": "subframe_collection", "name": "M31"},
                        "settings_revision": config["revision"]}
            preview = await request(client, "POST", route + "/preview", 200, manifest)
            assert not (storage.root / "runtime/library-uploads").exists()
            args = {"preview_id": preview["preview_id"], "idempotency_key": str(uuid4())}
            job = await request(client, "POST", route, 201, args)
            path = route + "/" + job["id"]
            files = [BASE + path + "/files/" + entry["id"] for entry in job["entries"]]
            first = await client.put(files[0], data=bodies[0], headers=BROWSER)
            assert first.status == 200, await first.text()

        async with library_client(tmp_path) as (client, storage):
            job = await request(client, "GET", path, 200)
            assert job["copied"] == 1 and job["pending"] == 1
            listed = await request(client, "GET", "/storage/operations", 200)
            receipt = next(row["receipt"] for row in listed["operations"] if row["operation_id"] == job["id"])
            assert (receipt["copied"], receipt["total"]) == (1, 2)
            second = await client.put(files[1], data=bodies[1], headers=BROWSER)
            assert second.status == 200, await second.text()
            members = await request(client, "GET", "/library/assets?import_group_id=" + job["group_id"], 200)
            ids = {entry["id"] for entry in job["entries"]}
            assert {asset["id"] for asset in members["items"]} == ids
            project_path = "/catalog/projects/" + project["id"]
            await request(client, "POST", project_path + "/nodes", 201, {
                "kind": "subframe_collection", "resource_id": job["group_id"],
            })
            tree = await request(client, "GET", project_path, 200)
            assert tree["items"][0]["resource_id"] == job["group_id"]
            with storage.db.session() as session:
                locations = session.scalars(select(AssetLocation).where(AssetLocation.asset_id.in_(ids)))
                paths = [resolve_managed(storage.workspaces, location) for location in locations]
            assert len({p.parent for p in paths}) == 1
            assert {p.read_bytes() for p in paths} == set(bodies)

    asyncio.run(exercise())


def test_retry_remaining_preserves_completed_copies(tmp_path, monkeypatch):
    from astrophoto.assets import imports
    from astrophoto.core.errors import StorageError

    original = imports.stage_copy
    inject_failure = True

    def copy(source, *args, **kwargs):
        if inject_failure and source.name == "transient.ser":
            raise StorageError("FILE_COPY_FAILED")
        return original(source, *args, **kwargs)

    monkeypatch.setattr(imports, "stage_copy", copy)

    async def exercise():
        nonlocal inject_failure
        async with library_client(tmp_path) as (client, _):
            paths = [tmp_path / "first.ser", tmp_path / "transient.ser"]
            for source in paths:
                source.write_bytes(source.name.encode())
            settings = await request(client, "PATCH", "/storage/settings", 200, {
                "expected_revision": 0, "imports": {"default_mode": "copy"},
            })
            payload = {"sources": [str(source) for source in paths], "settings_revision": settings["revision"]}
            preview = await request(client, "POST", "/assets/import/preview", 200, payload)
            started = await request(client, "POST", "/assets/import", 202, {
                **payload, "preview_id": preview["preview_id"], "idempotency_key": "retry-fixture",
            })
            receipt = await wait_import(client, started["operation_id"])
            assert receipt["copied"] == 1 and receipt["failed"] == receipt["retryable"] == 1
            inject_failure = False
            path = f"/library/imports/{started['operation_id']}/retry-remaining"
            retry = await request(client, "POST", path, 202, {})
            assert (await request(client, "POST", path, 202, {}))["operation_id"] == retry["operation_id"]
            receipt = await wait_import(client, retry["operation_id"])
            assert receipt["total"] == receipt["copied"] == 1 and receipt["retryable"] == 0
            listing = await request(client, "GET", "/library/assets?sort=name", 200)
            assert [row["name"] for row in listing["items"]] == ["first.ser", "transient.ser"]

    asyncio.run(exercise())


def test_copy_import_preserves_fits_bytes_and_scientific_headers(tmp_path):
    """TC-115-R1: copy import keeps exact FITS bytes and scientific header values."""
    import hashlib

    import numpy as np
    from astropy.io import fits

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            storage.update_settings(0, imports="copy")
            source = tmp_path / "Light_16bit.fit"
            data = (np.arange(64, dtype=np.uint16).reshape(8, 8) * 37)
            hdu = fits.PrimaryHDU(data)
            hdu.header["EXPTIME"] = (120.0, "seconds")
            hdu.header["GAIN"] = (100, "e-/ADU")
            hdu.header["CCD-TEMP"] = (-10.0, "C")
            hdu.writeto(source)
            keys = ("BITPIX", "NAXIS", "NAXIS1", "NAXIS2", "BSCALE", "BZERO", "EXPTIME", "GAIN", "CCD-TEMP")
            before_digest = hashlib.sha256(source.read_bytes()).hexdigest()
            before = {key: fits.getheader(source)[key] for key in keys}
            receipt = await import_items(client, sources=[str(source)])
            assert receipt["copied"] == 1
            items = (await request(client, "GET", "/library/assets", 200))["items"]
            item = next(entry for entry in items if entry["name"] == source.name)
            with storage.db.session() as session:
                stored = session.scalar(select(AssetLocation).where(AssetLocation.asset_id == item["id"]))
            physical = resolve_managed(storage.workspaces, stored)
            assert hashlib.sha256(physical.read_bytes()).hexdigest() == before_digest
            header = fits.getheader(physical)
            assert {key: header[key] for key in keys} == before

    asyncio.run(exercise())


def test_image_result_import_uses_one_asset_type_and_rejects_invalid_roles(tmp_path):
    source = tmp_path / "source.fit"
    source.write_bytes(b"image")
    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            settings = await request(client, "GET", "/storage", 200)
            await request(client, "POST", "/assets/import/preview", 422, {
                "sources": [str(source)], "settings_revision": settings["imports"]["revision"],
                "catalog": {"kind": "image_result", "name": "Retired", "result_type": "master_frame"},
            })
            for name, fields, expected in (
                ("Default", {}, "image_result"),
                ("Master", {"asset_type": "master_frame"}, "master_frame"),
            ):
                frame = tmp_path / f"{name}.fit"
                frame.write_bytes(name.encode())
                receipt = await import_items(client, sources=[str(frame)], catalog={
                    "kind": "image_result", "name": name, **fields,
                })
                assert receipt["asset_type"] == expected
                listing = await request(client, "GET", "/catalog/assets", 200)
                row = next(row for row in listing["items"] if row["name"] == name)
                assert row["asset_type"] == expected and "result_type" not in row
                await request(client, "PATCH", f"/library/assets/{row['id']}", 422, {
                    "attributes": {"role": "raw"},
                })
                detail = await request(client, "GET", f"/catalog/image_result/{row['id']}", 200)
                assert detail["asset_type"] == expected
            output = str(uuid4())
            workspace = storage.initial_workspace_id
            key = f"outputs/{output}/result.fit"
            path = storage.workspaces.require(workspace) / key
            path.parent.mkdir(parents=True)
            path.write_bytes(b"formal")
            storage.library.record_output(output, workspace, key, None, {})
            await request(client, "POST", "/library/assets", 422, {
                "output_id": output, "attributes": {"role": "raw"},
            })
            await request(client, "POST", "/library/assets", 201, {"output_id": output})
            row = await request(client, "GET", f"/catalog/image_result/{output}", 200)
            assert row["asset_type"] == "image_result"
    asyncio.run(exercise())
