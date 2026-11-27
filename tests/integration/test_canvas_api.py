import asyncio
import base64
from io import BytesIO
from types import SimpleNamespace
from uuid import uuid4

from aiohttp import WSServerHandshakeError, web
from aiohttp.test_utils import TestClient, TestServer
import pytest
from astropy.io import fits
import numpy as np
from PIL import Image

from astrophoto.api.canvas import canvas_routes
from astrophoto.storage.runtime import StorageRuntime
from extension.siril import previews
from extension.siril.bundle import SirilBundle


def test_workflow_concurrent_create_publishes_only_one_complete_file(tmp_path):
    async def run():
        app = web.Application()
        runtime = SimpleNamespace(trusted_local=True, storage=None, workflow_root=tmp_path / "workflows")
        for method, path, handler, _ in canvas_routes(runtime):
            app.router.add_route(method, "/astrophoto/v1" + path, handler)
        async with TestClient(TestServer(app)) as client:
            headers = {"X-AstroPhoto-Local": "1"}
            contents = ['{"nodes":[1]}', '{"nodes":[2]}']
            responses = await asyncio.gather(*(
                client.post("/astrophoto/v1/canvas/workflows", headers=headers,
                            json={"path": "nested/same.json", "content": content})
                for content in contents
            ))
            assert sorted(response.status for response in responses) == [200, 409]
            winner = next(index for index, response in enumerate(responses) if response.status == 200)
            assert (runtime.workflow_root / "nested/same.json").read_text(encoding="utf-8") == contents[winner]
            assert list((runtime.workflow_root / "nested").iterdir()) == [runtime.workflow_root / "nested/same.json"]
            conflict = await client.post("/astrophoto/v1/canvas/workflows", headers=headers,
                                         json={"path": "nested/same.json", "content": "replacement"})
            assert conflict.status == 409
            assert (runtime.workflow_root / "nested/same.json").read_text(encoding="utf-8") == contents[winner]
            invalid = await client.post("/astrophoto/v1/canvas/workflows", headers=headers,
                                        json={"path": "../outside.json", "content": "x"})
            assert invalid.status == 400
    asyncio.run(run())


def test_formal_output_metadata_requires_local_agent_and_resolves_registered_file(tmp_path):
    output_id = str(uuid4())
    image = tmp_path / "stretched.fit"
    image.write_bytes(b"FITS")

    def resolve(identifier):
        from astrophoto.core.errors import StorageError
        if identifier != output_id:
            raise StorageError("OUTPUT_NOT_FOUND")
        return image

    async def run():
        app = web.Application()
        runtime = SimpleNamespace(trusted_local=True,
                                  storage=SimpleNamespace(library=SimpleNamespace(resolve_output=resolve)))
        for method, path, handler, _ in canvas_routes(runtime):
            app.router.add_route(method, "/astrophoto/v1" + path, handler)
        async with TestClient(TestServer(app)) as client:
            path = "/astrophoto/v1/canvas/outputs/" + output_id
            assert (await client.get(path)).status == 403
            response = await client.get(path, headers={"X-AstroPhoto-Agent": "1"})
            assert await response.json() == {"output_id": output_id, "path": str(image),
                                             "filename": image.name, "size": 4}
            missing = await client.get("/astrophoto/v1/canvas/outputs/" + str(uuid4()),
                                       headers={"X-AstroPhoto-Agent": "1"})
            assert missing.status == 404
    asyncio.run(run())


def test_canvas_reply_is_bound_to_the_target_and_edit_id_is_replayable():
    async def run():
        app = web.Application()
        runtime = SimpleNamespace(trusted_local=True, storage=None)
        for method, path, handler, _ in canvas_routes(runtime):
            app.router.add_route(method, '/astrophoto/v1' + path, handler)
        base = '/astrophoto/v1/canvas'
        agent = {"X-AstroPhoto-Agent": "1"}
        async with TestClient(TestServer(app)) as client:
            origin = {"Origin": str(client.make_url('/').origin())}
            with pytest.raises(WSServerHandshakeError, match='403'):
                await client.ws_connect(base + '/socket', headers={"Origin": "http://localhost:42"})
            assert (await client.get(base + '/sessions', headers={**agent, **origin})).status == 403
            async with client.ws_connect(base + '/socket', headers=origin) as primary, (
                client.ws_connect(base + '/socket', headers=origin)
            ) as other:
                session = (await primary.receive_json())['session_id']
                other_session = (await other.receive_json())['session_id']
                assert session != other_session
                ident = str(uuid4())
                body = {"session_id": session, "command_id": ident, "payload": {"action": "inspect"}}
                pending = asyncio.create_task(client.post(base + '/commands', headers=agent, json=body))
                message = await primary.receive_json(timeout=2)
                assert message['command_id'] == ident
                assert 'expires_at' in message
                await other.send_json({"command_id": ident, "state": "completed", "nodes": ["wrong"]})
                await primary.send_json({"command_id": ident, "state": "completed", "nodes": []})
                response = await pending
                receipt = await response.json()
                assert receipt == {"command_id": ident, "state": "completed", "nodes": [], "session_id": session}
                repeat = await client.post(base + '/commands', headers=agent, json=body)
                assert await repeat.json() == receipt
                conflict = await client.post(base + '/commands', headers=agent,
                                             json={**body, "payload": {"action": "find"}})
                assert conflict.status == 409
                stored = await client.get(base + '/commands/' + ident, headers=agent)
                assert await stored.json() == receipt
    asyncio.run(run())


def test_agent_tunes_one_candidate_from_same_canvas_input(tmp_path, monkeypatch):
    source = tmp_path / "oriented.fit"
    original = np.zeros((600, 1200), dtype=np.float32)
    original[:80, :80] = 0.25
    fits.writeto(source, original, fits.Header({"ROWORDER": "TOP-DOWN"}))
    bundle = SirilBundle()
    runtime = SimpleNamespace(trusted_local=True, processing_bundle=bundle)
    runtime.storage = StorageRuntime.initialize(tmp_path / "data", {}, prepare=bundle.initialize_storage)
    config = {"version": "test", "fingerprint": [1]}
    monkeypatch.setattr(bundle.software, "current", lambda: config)
    calls = []

    def stretch(path, _config, values, working, checkpoint, **_kwargs):
        checkpoint()
        calls.append((path, values))
        output = working / "stretched.fit"
        fits.writeto(output, (fits.getdata(path) + values["targetbg"]).astype(np.float32), fits.getheader(path))
        return output, "simulated"

    monkeypatch.setattr(previews, "stretch", stretch)
    app = web.Application()
    for method, path, handler, _ in canvas_routes(runtime):
        app.router.add_route(method, "/astrophoto/v1" + path, handler)

    async def exercise():
        agent = {"X-AstroPhoto-Agent": "1"}
        base = "/astrophoto/v1/canvas"
        async with TestClient(TestServer(app)) as client:
            origin = {"Origin": str(client.make_url("/").origin())}
            async with client.ws_connect(base + "/socket", headers=origin) as page:
                session = (await page.receive_json())["session_id"]
                target = {"session_id": session, "target_id": str(uuid4()), "node_id": 8}
                revision = str(uuid4())
                parameters = {"shadowsclip": -2.8, "targetbg": 0.25, "linked": True}

                async def browser():
                    async for value in page:
                        message = value.json()
                        result = {"command_id": message["command_id"], "state": "completed"}
                        if message["action"] == "node_inspect":
                            assert message["node_id"] == target["node_id"]
                            result.update(node_id=8, target_id=target["target_id"], revision=revision,
                                          private_source=str(source), preview_capability=True, parameters=parameters)
                        else:
                            assert message["action"] == "apply"
                            assert message["commands"] == [{"action": "set_parameters", "node_id": 8,
                                "values": {"shadowsclip": -2.8, "targetbg": .4, "linked": False}}]
                            result["applied"] = True
                        await page.send_json(result)

                relay = asyncio.create_task(browser())
                try:
                    command = {"session_id": session, "command_id": str(uuid4()), "payload": {
                        "action": "node_inspect", "target_id": target["target_id"], "node_id": 8}}
                    inspected = await (await client.post(base + "/commands", headers=agent, json=command)).json()
                    assert inspected["input_state"] == "available" and "private_source" not in inspected
                    selection = {**target, "input_ref": inspected["input_ref"]}

                    async def node(operation, **payload):
                        response = await client.post(base + "/node/" + operation, headers=agent, json=payload)
                        return await response.json()

                    baseline = await node("compare", **selection)
                    assert len(baseline["images"]) == 1
                    assert baseline["images"][0]["geometry"]["rendered_size"] == [1024, 512]
                    request = {**selection, "expected_revision": revision, "parameters": {"targetbg": .4},
                               "request_id": str(uuid4())}
                    started = await node("preview", **request)
                    preview_id = started["preview_id"]
                    for _ in range(120):
                        status = await node("status", preview_id=preview_id)
                        if status["state"] not in {"queued", "running"}:
                            break
                        await asyncio.sleep(.025)
                    assert status["state"] == "ready", status
                    assert (await node("preview", **request))["preview_id"] == preview_id
                    assert (await node("preview", **{**request, "parameters": {"targetbg": .5}}))["error"]["code"] == "REQUEST_CONFLICT"
                    assert len(calls) == 1 and calls[0][0] == source
                    comparison = await node("compare", **selection, preview_id=preview_id, view="tl")
                    pixels = []
                    for item in comparison["images"]:
                        assert item["geometry"]["region"] == [0, 0, 512, 512]
                        image = Image.open(BytesIO(base64.b64decode(item["data"])))
                        assert image.size == (512, 512)
                        pixels.append(image.getpixel((0, 0)))
                    assert pixels == [64, 166]
                    update = {**command, "command_id": str(uuid4()), "payload": {
                        **command["payload"], "action": "apply", "preview_id": preview_id, "expected_revision": revision}}
                    assert (await (await client.post(base + "/commands", headers=agent, json=update)).json())["applied"]
                    fits.writeto(source, original + .1, overwrite=True)
                    rejected = await client.post(base + "/commands", headers=agent, json={**update, "command_id": str(uuid4())})
                    assert (await rejected.json())["error"]["code"] == "SOURCE_CHANGED"
                    assert (await node("discard", preview_id=preview_id))["discarded"]
                    assert (await node("status", preview_id=preview_id))["state"] == "discarded"
                finally:
                    relay.cancel()
                    await asyncio.gather(relay, return_exceptions=True)

    try:
        asyncio.run(exercise())
    finally:
        bundle.shutdown()
        runtime.storage.operations.pool.shutdown()
