"""Native aiohttp routes and live asset/cache paths in a temporary Data Root."""

import asyncio
import os
from uuid import uuid4

from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from astropy.io import fits
import numpy as np

from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.database.models import Asset, AssetLocation
from extension.siril.bundle import SirilBundle
from extension.siril.processing import parameters

BASE = "/astrophoto/v1"
LOCAL = {"X-AstroPhoto-Local": "1"}


def test_scientific_api_access_source_and_cache(tmp_path):
    app = web.Application()
    bundle = SirilBundle()
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"), processing_bundle=bundle)
    initialize_storage_runtime(runtime)
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app.add_routes(routes)
    sample = tmp_path / "external frame.fit"
    fits.writeto(sample, np.arange(100, dtype=np.uint16).reshape(10, 10))
    direct = tmp_path / "direct frame.fit"
    fits.writeto(direct, np.arange(100, dtype=np.uint16).reshape(10, 10))
    asset_id = str(uuid4())
    with runtime.storage.db.session() as db:
        db.add(Asset(id=asset_id, name=sample.name, size_bytes=sample.stat().st_size, mtime_ns=sample.stat().st_mtime_ns))
        db.flush()
        db.add(AssetLocation(id=str(uuid4()), asset_id=asset_id, storage_mode="external_reference",
                             external_path=str(sample), external_key=os.path.normcase(str(sample))))

    async def exercise():
        async with TestClient(TestServer(app)) as client:
            siril = BASE + "/software/siril"
            assert (await client.get(siril, headers=LOCAL)).status == 403
            runtime.trusted_local = True
            assert (await client.put(siril, json={"path": "bad"}, headers={**LOCAL, "Origin": "https://elsewhere.invalid"})).status == 403
            status = await client.get(siril, headers=LOCAL)
            assert (await status.json())["state"] == "SIRIL_NOT_CONFIGURED"
            catalog = await (await client.get(siril + "/commands", headers=LOCAL)).json()
            assert catalog["version"] == "1.4.5"
            commands = {row["id"]: row for row in catalog["commands"]}
            assert len(commands) == 201 and sum(row["node_id"] is not None for row in commands.values()) == 183
            assert commands["load_seq"]["node_id"] is None and not commands["load_seq"]["scriptable"]
            assert "sequence files" in commands["stack"]["requires"]
            assert commands["gauss"]["parameters"][0]["name"] == "sigma"
            assert commands["gauss"]["category"] == "AstroPhoto/Siril/Convolution and Sharpening"
            assert commands["pcc"]["category_zh"] == "色彩与通道/色彩校准"
            assert "gradient removal" in commands["seqsubsky"]["search_aliases"]
            unknown = await client.post(BASE + "/previews/siril/nonexistent", headers=LOCAL, json={})
            assert (await unknown.json())["error"]["code"] == "SIRIL_COMMAND_NOT_AVAILABLE"
            invalid = await client.put(siril, headers=LOCAL, json={"path": "./program.exe"})
            assert (await invalid.json())["error"]["code"] == "SIRIL_EXECUTABLE_INVALID"
            listing = await client.get(BASE + "/fits/assets", headers=LOCAL)
            assert (await listing.json())["assets"] == [{"id": asset_id, "name": sample.name}]
            body = {"asset_id": asset_id, "owner": str(uuid4()),
                    "parameters": parameters({"shadowsclip": -2.8, "targetbg": .25, "linked": True}, 3)}
            assert (await client.post(BASE + "/previews/autostretch", headers=LOCAL, json=body)).status == 404
            result = await client.post(BASE + "/previews/siril/autostretch", headers=LOCAL, json=body)
            assert result.status == 202
            path = BASE + "/previews/jobs/" + (await result.json())["job_id"]
            for _ in range(100):
                row = await (await client.get(path, headers=LOCAL)).json()
                if row["state"] == "failed":
                    break
                await asyncio.sleep(.025)
            assert row["before"] and row["error"] == "SIRIL_NOT_CONFIGURED" and row["channels"] == 1
            assert (await client.get(path + "/before")).status == 403
            image = await client.get(path + "/before", headers=LOCAL)
            assert image.content_type == "image/png" and (await image.read()).startswith(b"\x89PNG")
            assert (await client.get(path + "/after", headers=LOCAL)).status == 404
            direct_body = {"image_path": str(direct), "owner": str(uuid4()), "parameters": body["parameters"]}
            direct_response = await client.post(BASE + "/previews/siril/autostretch", headers=LOCAL, json=direct_body)
            assert direct_response.status == 202
            direct_job = BASE + "/previews/jobs/" + (await direct_response.json())["job_id"]
            for _ in range(100):
                direct_row = await (await client.get(direct_job, headers=LOCAL)).json()
                if direct_row["state"] == "failed":
                    break
                await asyncio.sleep(.025)
            assert direct_row["before"] and direct_row["error"] == "SIRIL_NOT_CONFIGURED"
            assert (await client.get(direct_job + "/before", headers=LOCAL)).status == 200
            sample.unlink()
            lost = await client.get(path + "/before", headers=LOCAL)
            assert lost.status == 404

    try:
        asyncio.run(exercise())
    finally:
        bundle.previews.shutdown()
        runtime.storage.operations.pool.shutdown()


def test_generic_scientific_nodes_and_routes_without_siril(extension, monkeypatch, tmp_path):
    monkeypatch.setenv("ASTROPHOTO_HOME", str(tmp_path / "data"))
    frame = tmp_path / "generic.fit"
    fits.writeto(frame, np.arange(100, dtype=np.uint16).reshape(10, 10))

    async def exercise():
        plugin = extension.module.AstroPhotoExtension()
        await plugin.on_load()
        plugin.runtime.trusted_local = True
        drawing, source, folder, collection = await plugin.get_node_list()
        extension.registry["vue-basic"] = drawing
        assert [node.define_schema().node_id for node in (drawing, source, folder, collection)] == [
            "vue-basic", "AstroPhotoFileSource", "AstroPhotoFolderSource", "AstroPhotoAggregate",
        ]
        assert source.execute(str(frame)).result == (str(frame), (str(frame),))
        app = web.Application()
        app.add_routes(extension.routes)
        try:
            async with TestClient(TestServer(app)) as client:
                status = await (await client.get(BASE + "/status")).json()
                capabilities = status["capabilities"]
                assert capabilities["storage"]["available"] and capabilities["equipment"]["available"]
                assert capabilities["software"] == capabilities["processing"] == {
                    "available": False, "reason": "not_implemented",
                }
                assert (await client.get(BASE + "/software/siril", headers=LOCAL)).status == 404
                assert (await client.post(BASE + "/previews/siril/autostretch", headers=LOCAL, json={})).status == 404
                routes = BASE + "/fits/assets"
                assert (await client.get(routes)).status == 403
                listing = await client.get(routes, headers=LOCAL)
                assert listing.status == 200 and (await listing.json())["assets"] == []

                settings = BASE + "/previews/settings"
                response = await client.get(settings, headers=LOCAL)
                assert response.status == 200
                before = await response.json()
                edge = next(option for option in before["options"] if option != before["longest_edge"])
                change = {"expected_revision": before["revision"], "longest_edge": edge,
                          "canvas": {"width": 600, "max_height": 400}}
                assert (await client.put(settings, json=change)).status == 403
                saved = await client.put(settings, headers=LOCAL, json=change)
                assert saved.status == 200 and (await saved.json())["revision"] == before["revision"] + 1
                assert (await client.put(settings, headers=LOCAL, json=change)).status == 409
                after = await (await client.get(settings, headers=LOCAL)).json()
                assert after["longest_edge"] == edge
                assert after["canvas"] == change["canvas"]
                invalid = {"expected_revision": after["revision"], "longest_edge": edge,
                           "canvas": {"width": 1, "max_height": 400}}
                assert (await client.put(settings, headers=LOCAL, json=invalid)).status == 422
        finally:
            plugin.runtime.storage.operations.pool.shutdown()

    asyncio.run(exercise())



def test_formal_output_feeds_downstream_previews_before_and_after_collection(tmp_path, monkeypatch):
    from shutil import copyfile

    from extension.siril import previews, processing

    bundle = SirilBundle()
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"), processing_bundle=bundle)
    initialize_storage_runtime(runtime)
    runtime.trusted_local = True
    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application()
    app.add_routes(routes)

    def copy_frame(path, _config, _params, working, _checkpoint, **_options):
        output = working / "test.fit"
        copyfile(path, output)
        return output, "test-source-digest"

    monkeypatch.setattr(bundle.software, "current", lambda: {"verified_at": "test", "fingerprint": [], "version": "1.4.5"})
    monkeypatch.setattr(processing, "stretch", copy_frame)
    monkeypatch.setattr(previews, "stretch", copy_frame)
    source = tmp_path / "source.fit"
    fits.writeto(source, np.arange(100, dtype=np.uint16).reshape(10, 10))
    params = {"shadowsclip": -2.8, "targetbg": .25, "linked": False}

    async def preview(client, upstream, formal=None):
        body = {"image_path": str(upstream), "owner": str(uuid4()), "parameters": params}
        if formal:
            body["formal_id"] = formal
        response = await client.post(BASE + "/previews/siril/autostretch", headers=LOCAL, json=body)
        assert response.status == 202
        job = BASE + "/previews/jobs/" + (await response.json())["job_id"]
        for _ in range(150):
            result = await (await client.get(job, headers=LOCAL)).json()
            if result["state"] in {"ready", "failed"}:
                break
            await asyncio.sleep(.025)
        assert result["state"] == "ready" and result["before"] and result["after"], result
        assert bool(result.get("formal")) == bool(formal)

    async def exercise():
        storage = runtime.storage
        upstream, upstream_id, _ = processing.formal_run(
            storage, bundle.software, str(source), params, lambda: None, lambda _: None,
        )
        with storage.db.session() as session:
            assert session.get(Asset, upstream_id) is None
        _, downstream_id, identity = processing.formal_run(
            storage, bundle.software, str(upstream), params, lambda: None, lambda _: None,
        )
        assert identity == upstream_id
        async with TestClient(TestServer(app)) as client:
            await preview(client, upstream)
            await preview(client, upstream, downstream_id)
            collected = await client.post(BASE + "/library/assets", headers={**LOCAL, "Sec-Fetch-Site": "same-origin"},
                                          json={"output_id": upstream_id})
            assert collected.status == 201
            assert (await collected.json())["id"] == upstream_id
            await preview(client, upstream, downstream_id)

    try:
        asyncio.run(exercise())
    finally:
        bundle.previews.shutdown()
        runtime.storage.operations.pool.shutdown()
