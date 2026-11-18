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
from astrophoto.siril.processing import parameters

BASE = "/astrophoto/v1"
LOCAL = {"X-AstroPhoto-Local": "1"}


def test_scientific_api_access_source_and_cache(tmp_path):
    app = web.Application()
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
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
            invalid = await client.put(siril, headers=LOCAL, json={"path": "./program.exe"})
            assert (await invalid.json())["error"]["code"] == "SIRIL_EXECUTABLE_INVALID"
            listing = await client.get(BASE + "/fits/assets", headers=LOCAL)
            assert (await listing.json())["assets"] == [{"id": asset_id, "name": sample.name}]
            body = {"asset_id": asset_id, "owner": str(uuid4()),
                    "parameters": parameters({"shadowsclip": -2.8, "targetbg": .25, "linked": True}, 3)}
            result = await client.post(BASE + "/previews/autostretch", headers=LOCAL, json=body)
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
            direct_response = await client.post(BASE + "/previews/autostretch", headers=LOCAL, json=direct_body)
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

    asyncio.run(exercise())
    runtime.storage.previews.shutdown()

