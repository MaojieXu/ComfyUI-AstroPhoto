import asyncio
from contextlib import asynccontextmanager
from uuid import uuid4

from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from sqlalchemy import select

from astrophoto.api.routes import BASE, register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.database.models import AssetLocation
from astrophoto.storage.manager import resolve_managed

BROWSER = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}
TOKEN = "test-library-only-" + "q" * 45
AGENT = {"Authorization": f"Bearer {TOKEN}"}


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
            body = {"revision": item["revision"], "confirmed": True}
            denied = await request(client, "POST", f"/library/assets/{item['id']}/delete-file", 422, body)
            assert denied["error"]["code"] == "ASSET_NOT_MANAGED"
            await request(client, "DELETE", f"/library/assets/{item['id']}", 200, {"revision": item["revision"]})
            assert captured.read_bytes() == b"user-source"

            changed = await request(client, "PATCH", "/storage/settings", 200, {
                "expected_revision": 0, "imports": {"default_mode": "copy"},
            })
            upload_id = str(uuid4())
            upload = await client.put(BASE + f"/library/uploads/{upload_id}", data=b"browser-file",
                                      headers={**BROWSER, "X-AstroPhoto-Filename": "Moon%20sequence.ser"})
            assert upload.status == 201, await upload.text()
            payload = {"uploads": [upload_id], "settings_revision": changed["revision"], "allow_duplicate": True}
            large_manifest = await request(client, "POST", "/assets/import/preview", 200, {
                **payload, "uploads": [upload_id, *[str(uuid4()) for _ in range(1700)]],
            })
            assert large_manifest["file_count"] == 1701 and large_manifest["failed"] == 1700
            preview = await request(client, "POST", "/assets/import/preview", 200, payload)
            changed = await request(client, "PATCH", "/storage/settings", 200, {
                "expected_revision": changed["revision"], "imports": {"default_mode": "copy"},
            })
            denied = await request(client, "POST", "/assets/import", 409, {
                **payload, "preview_id": preview["preview_id"], "idempotency_key": "stale",
            })
            assert denied["error"]["code"] == "REVISION_CONFLICT"
            outcome = await import_items(client, uploads=[upload_id], attributes={"file_kind": "video", "role": "raw"})
            assert outcome["copied"] == 1
            item = (await request(client, "GET", "/library/assets?file_kind=video", 200))["items"][0]
            assert item["name"] == "Moon sequence.ser"
            with storage.db.session() as session:
                stored = session.scalar(select(AssetLocation).where(AssetLocation.asset_id == item["id"]))
            physical = resolve_managed(storage.workspaces, stored)
            assert physical.read_bytes() == b"browser-file"
            await request(client, "POST", f"/library/assets/{item['id']}/delete-file", 200,
                          {"revision": item["revision"], "confirmed": True})
            assert not physical.exists()
            assert not (await request(client, "GET", f"/library/assets/{item['id']}", 200))["available"]

    asyncio.run(exercise())


def test_collection_conflicts_project_moves_and_directory_confirmation(tmp_path):
    async def exercise():
        async with library_client(tmp_path) as (client, _):
            for filename, band in (("a.fit", "Ha"), ("b.fit", "OIII"), ("c.fit", "Ha")):
                source = tmp_path / filename
                source.write_bytes(filename.encode())
                await import_items(client, sources=[str(source)], attributes={"filter": band, "usage": "light"})
            listing = await request(client, "GET", "/library/assets?sort=name", 200)
            a, b, c = [item["id"] for item in listing["items"]]
            rejected = await request(client, "POST", "/library/collections", 409,
                                     {"name": "Mixed", "asset_ids": [a, b], "confirmed": True})
            assert rejected["error"]["code"] == "COLLECTION_CONFLICT"
            rejected = await request(client, "POST", "/library/collections", 409,
                                     {"name": "Narrowband", "asset_ids": [a, c]})
            assert rejected["error"]["code"] == "CONFIRMATION_REQUIRED"
            collection = await request(client, "POST", "/library/collections", 201,
                                       {"name": "Narrowband", "asset_ids": [c, a], "confirmed": True})
            rejected = await request(client, "POST", "/library/collections", 409, {"name": "Duplicate", "asset_ids": [a]})
            assert rejected["error"]["code"] == "ASSET_ALREADY_IN_COLLECTION"

            p = await request(client, "POST", "/library/projects", 201, {"name": "M31", "template": True})
            q = await request(client, "POST", "/library/projects", 201, {"name": "Study"})
            folders = await request(client, "GET", f"/library/folders?project_id={p['id']}", 200)
            parent = next(row for row in folders["items"] if row["name"] == "Raw")
            child = await request(client, "POST", "/library/folders", 201,
                                  {"name": "Ha", "project_id": p["id"], "parent_id": parent["id"]})
            failed = await request(client, "PATCH", f"/library/folders/{parent['id']}", 409,
                                   {"revision": parent["revision"], "parent_id": child["id"]})
            assert failed["error"]["code"] == "FOLDER_CYCLE"
            root_ref = await request(client, "POST", "/library/placements", 201,
                                     {"project_id": p["id"], "collection_id": collection["id"]})
            move = await request(client, "POST", "/library/placements", 201,
                                 {"project_id": p["id"], "folder_id": child["id"], "collection_id": collection["id"]})
            assert move["id"] == root_ref["id"]
            await request(client, "POST", "/library/placements", 201,
                          {"project_id": q["id"], "collection_id": collection["id"]})
            assert len((await request(client, "GET", "/library/placements", 200))["items"]) == 2
            rejected = await request(client, "DELETE", f"/library/folders/{parent['id']}", 409,
                                     {"revision": parent["revision"]})
            assert rejected["error"]["details"] == {"affected_references": 1}
            await request(client, "DELETE", f"/library/folders/{parent['id']}", 200,
                          {"revision": parent["revision"], "confirmed": True})
            assert len((await request(client, "GET", "/library/placements", 200))["items"]) == 1
            assert (await request(client, "GET", f"/library/collections/{collection['id']}", 200))["asset_ids"] == [c, a]
            assert (tmp_path / "a.fit").is_file()

    asyncio.run(exercise())


def test_independent_calibration_status_and_agent_approval(tmp_path, monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", TOKEN)

    async def exercise():
        async with library_client(tmp_path) as (client, _):
            await request(client, "GET", "/library/projects", 403, headers={**AGENT, **BROWSER})
            await request(client, "GET", "/library/projects", 403, headers={**BROWSER, "Sec-Fetch-Site": "cross-site"})
            camera = await request(client, "POST", "/equipment", 201, {"name": "Camera", "equipment_type": "camera"})
            for name, attrs in (
                ("target.fit", {"usage": "light", "role": "master_frame", "calibration_state": "uncalibrated"}),
                ("dark.fit", {"usage": "dark", "role": "calibration_master", "camera_id": camera["id"]}),
                ("flat.fit", {"usage": "flat", "role": "calibration_master", "camera_id": camera["id"]}),
                ("bias.fit", {"usage": "bias", "role": "calibration_master", "camera_id": camera["id"]}),
                ("dark-flat.fit", {"usage": "dark_flat", "role": "calibration_master", "camera_id": camera["id"]}),
            ):
                source = tmp_path / name
                source.write_bytes(name.encode())
                await import_items(client, sources=[str(source)], attributes=attrs)
            items = {row["name"]: row for row in (await request(client, "GET", "/library/assets", 200))["items"]}
            light, dark, flat = (items[name] for name in ("target.fit", "dark.fit", "flat.fit"))
            failed = await request(client, "POST", "/library/masters", 422, {"asset_id": flat["id"]})
            assert failed["error"]["code"] == "INVALID_CALIBRATION_MASTER"
            folder = await request(client, "POST", "/library/folders", 201, {"name": "Calibration frames"})
            failed = await request(client, "POST", "/library/collections", 422, {
                "name": "Uncalibrated Flats", "asset_ids": [flat["id"]], "calibration_folder_id": folder["id"],
            })
            assert failed["error"]["code"] == "INVALID_CALIBRATION_MASTER"
            dark_collection = await request(client, "POST", "/library/collections", 201, {
                "name": "Darks", "asset_ids": [dark["id"]], "calibration_folder_id": folder["id"],
            })
            row = await request(client, "GET", f"/library/collections/{dark_collection['id']}", 200)
            assert row["calibration_eligible"] and row["calibration_folder_id"] == folder["id"]
            protected = await request(client, "DELETE", f"/equipment/{camera['id']}", 409,
                                      {"expected_version": camera["row_version"]})
            assert protected["error"]["code"] == "EQUIPMENT_REFERENCED"
            master = await request(client, "POST", "/library/masters", 201, {"asset_id": dark["id"]})
            data = {"master_id": master["id"], "asset_id": light["id"]}
            blocked = await request(client, "POST", "/library/assignments", 409, data)
            assert "camera_id" in blocked["error"]["details"]["unknown"]
            await request(client, "POST", "/library/assignments", 422, {**data, "confirmed": True}, AGENT)
            proposed = await request(client, "POST", "/library/assignments", 202, data, AGENT)
            approval = f"/library/approvals/{proposed['approval_id']}"
            await request(client, "POST", approval, 403, {"approved": True}, AGENT)
            assert (await request(client, "GET", approval, 200, headers=AGENT))["status"] == "pending"
            assert (await request(client, "POST", approval, 200, {"approved": True}))["status"] == "applied"
            bias = await request(client, "POST", "/library/masters", 201, {"asset_id": items["bias.fit"]["id"]})
            dark_flat = await request(client, "POST", "/library/masters", 201, {"asset_id": items["dark-flat.fit"]["id"]})
            batch = {"asset_id": light["id"], "master_ids": [bias["id"], master["id"]], "confirmed": True}
            rejected = await request(client, "POST", "/library/assignments/batch", 409, batch)
            assert rejected["error"]["code"] == "DUPLICATE_CALIBRATION_ASSIGNMENT"
            assert len((await request(client, "GET", "/library/assignments", 200))["items"]) == 1
            batch = {"asset_id": light["id"], "master_ids": [bias["id"], dark_flat["id"]]}
            warn = await request(client, "POST", "/library/assignments/batch", 409, batch)
            assert len(warn["error"]["details"]["masters"]) == 2
            assert len((await request(client, "GET", "/library/assignments", 200))["items"]) == 1
            applied = await request(client, "POST", "/library/assignments/batch", 201, {**batch, "confirmed": True})
            assert [row["usage"] for row in applied["items"]] == ["bias", "dark_flat"]
            assert (await request(client, "GET", f"/library/assets/{light['id']}", 200))["attributes"]["calibration_state"] == "uncalibrated"
            updated = await request(client, "PATCH", f"/library/assets/{light['id']}", 200,
                                    {"revision": light["revision"], "attributes": {"stage": "stacked"}})
            assert updated["attributes"]["role"] == "master_frame"
            await request(client, "PATCH", f"/library/assets/{light['id']}", 409,
                          {"revision": light["revision"], "attributes": {"stage": "finished"}})

    asyncio.run(exercise())


def test_frozen_database_upgrade_preserves_existing_data(tmp_path):
    import sqlite3

    from alembic import command
    from alembic.config import Config

    from astrophoto.database.manager import LEGACY_SCHEMA, SCHEMA, DatabaseManager

    path = tmp_path / "assets.db"
    instance = str(uuid4())
    asset = str(uuid4())
    path.touch()
    manager = DatabaseManager(path)
    with manager.engine.connect() as connection:
        config = Config()
        config.set_main_option("script_location", "astrophoto/database/migrations")
        config.attributes["connection"] = connection
        command.upgrade(config, LEGACY_SCHEMA)
        connection.exec_driver_sql("INSERT INTO storage_identity VALUES (1, ?)", (instance,))
        connection.exec_driver_sql("INSERT INTO assets VALUES (?, 'result.fit', 64, 100)", (asset,))
        connection.exec_driver_sql(
            "INSERT INTO storage_locations VALUES ('workspace', 'Workspace', 'test', 'test', 1, 0)"
        )
        connection.exec_driver_sql(
            "INSERT INTO asset_locations VALUES ('loc', ?, 'managed', NULL, NULL, 'workspace', ?)",
            (asset, f"outputs/{asset}/stretched.fit"),
        )
        connection.commit()
    manager.initialize(instance, creating=False)
    assert manager.health()["schema"] == SCHEMA
    with sqlite3.connect(path) as connection:
        assert connection.execute("SELECT id, workspace_id FROM formal_outputs").fetchall() == [(asset, "workspace")]
        assert connection.execute("SELECT id, name FROM assets").fetchall() == [(asset, "result.fit")]
        assert connection.execute("PRAGMA foreign_key_check").fetchall() == []
    manager.engine.dispose()


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
