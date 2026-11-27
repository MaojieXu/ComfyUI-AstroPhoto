"""Direct browser imports operate on an isolated database and temporary storage volumes."""

import asyncio
from io import BytesIO
from uuid import uuid4

import pytest
from aiohttp import web
from aiohttp.client import ClientTimeout
from aiohttp.test_utils import TestClient, TestServer
from sqlalchemy import select

from astrophoto.api.routes import BASE, register_routes
from astrophoto.assets.direct_import import JOB
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.core.errors import StorageError
from astrophoto.database.library_models import AssetImportFrame, LibraryRecord
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.manager import resolve_managed
from astrophoto.storage.runtime import StorageRuntime

BROWSER = {"X-AstroPhoto-Local": "1", "Sec-Fetch-Site": "same-origin"}
PATH = BASE + "/library/direct-imports"


@pytest.fixture
def host(tmp_path):
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "d"))
    initialize_storage_runtime(runtime)
    assert runtime.storage is not None, runtime.storage_error
    runtime.trusted_local = True
    runtime.storage.update_settings(0, imports="copy")
    yield runtime
    runtime.storage.close()


def payload(storage, files, **extra):
    return {"settings_revision": storage.snapshot("test")["imports"]["revision"],
            "files": files, "attributes": {"role": "raw"}, **extra}


def test_manifest_and_direct_upload_routes(host):
    async def run():
        routes = web.RouteTableDef()
        register_routes(routes, host)
        app = web.Application()
        app.add_routes(routes)
        async with TestClient(TestServer(app), timeout=ClientTimeout(total=20)) as client:
            manifest = payload(host.storage, [{"name": f"Light_{i:04}.fit", "size_bytes": 4} for i in range(1000)])
            second_name = manifest["files"][1]["name"]
            manifest["files"][1]["name"] = manifest["files"][0]["name"]
            request = await client.post(PATH + "/preview", json=manifest)
            assert request.status == 403
            request = await client.post(PATH + "/preview", json=manifest, headers=BROWSER)
            assert request.status == 409
            assert (await request.json())["error"]["code"] == "OBJECT_CONFLICT"
            manifest["files"][1]["name"] = second_name
            request = await client.post(PATH + "/preview", json=manifest, headers=BROWSER)
            assert request.status == 200, await request.text()
            preview = await request.json()
            assert preview["file_count"] == 1000
            start = {"preview_id": preview["preview_id"], "idempotency_key": str(uuid4())}
            job_req = await client.post(PATH, json=start, headers=BROWSER)
            assert job_req.status == 201, await job_req.text()
            job = await job_req.json()
            entries = job["entries"]
            assert "workspaces" not in job
            assert {entry["workspace_id"] for entry in entries} == {host.storage.initial_workspace_id}
            for frame in (entries[1], entries[0], entries[1]):
                put = await client.put(PATH + f"/{job['id']}/files/{frame['id']}", data=b"fits", headers=BROWSER)
                assert put.status == 200, await put.text()
            assert not (host.storage.root / "runtime/library-uploads").exists()
            with host.storage.db.session() as session:
                locations = list(session.scalars(select(AssetLocation)))
                paths = [resolve_managed(host.storage.workspaces, item) for item in locations]
                assert len(paths) == 2 and paths[0].parent == paths[1].parent
                assert {path.name for path in paths} == {"Light_0000.fit", "Light_0001.fit"}
                assert all(p.read_bytes() == b"fits" for p in paths)
                links = list(session.scalars(select(AssetImportFrame)))
                assert {link.group_id for link in links} == {job["group_id"]}
                assert {link.frame_index for link in links} == {0, 1}
            assert host.storage.library.get("assets", entries[0]["id"])["name"] == manifest["files"][0]["name"]
            groups = await client.get(BASE + "/library/import-groups", headers=BROWSER)
            group, = (await groups.json())["items"]
            assert group["id"] == job["group_id"] and group["count"] == 2
            members = await client.get(BASE + f"/catalog/subframe_collection/{group['id']}/files", headers=BROWSER)
            assert [item["id"] for item in (await members.json())["items"]] == [entry["id"] for entry in entries[:2]]
            progress = next(item for item in host.storage.operations.recent_receipts() if item["operation_id"] == job["id"])
            assert progress["receipt"]["direct_import"] and progress["receipt"]["copied"] == 2
            removed = await client.delete(BASE + f"/library/assets/{entries[0]['id']}",
                                        json={}, headers=BROWSER)
            assert removed.status == 200, await removed.text()
            assert sum(path.is_file() for path in paths) == 1
            cancelled = await client.delete(PATH + "/" + job["id"], headers=BROWSER)
            data = await cancelled.json()
            assert data["phase"] == "cancelled" and data["copied"] == 2 and data["pending"] == 998
            repeat = await client.post(PATH, json=start, headers=BROWSER)
            assert (await repeat.json())["phase"] == "cancelled"

    asyncio.run(run())


@pytest.mark.parametrize("replace_directory", [False, True])
def test_restart_after_direct_import_directory_publication(host, monkeypatch, replace_directory):
    from astrophoto.assets import direct_import

    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "frame.fit", "size_bytes": 3}]))
    job = service.start(preview["preview_id"], str(uuid4()))
    entry = job["entries"][0]
    with monkeypatch.context() as patch:
        publish = direct_import.publish_object

        def interrupt(stage, dest):
            if not stage.is_dir():
                raise StorageError("DATABASE_INVALID")
            publish(stage, dest)

        patch.setattr(direct_import, "publish_object", interrupt)
        with pytest.raises(StorageError, match="DATABASE_INVALID"):
            service.put(job["id"], entry["id"], 3, BytesIO(b"fit").read)
    with storage.db.session() as session:
        data = session.get(LibraryRecord, entry["id"]).data
        assert data["directory_intent"] and data["publish_stat"]
    target = storage.workspaces.require(data["workspace_id"]) / data["relative_key"]
    assert target.parent.is_dir() and not target.exists()
    if replace_directory:
        target.parent.rename(target.parent.with_name("previous-task-directory"))
        target.parent.mkdir()
        (target.parent / "external.txt").write_bytes(b"external")
    storage.close()
    restored = StorageRuntime.initialize(storage.root, {})
    try:
        state = restored.direct_imports.status(job["id"])
        if replace_directory:
            assert state["entries"][0]["error"] == "OBJECT_CONFLICT"
            assert not target.exists() and (target.parent / "external.txt").read_bytes() == b"external"
        else:
            assert state["copied"] == 1 and state["phase"] == "completed"
            assert target.read_bytes() == b"fit"
            with restored.db.session() as session:
                assert list(session.scalars(select(Asset.id))) == [entry["id"]]
    finally:
        restored.close()


def test_retry_only_failed_frame_and_recover_after_publish(host, monkeypatch):
    service = host.storage.direct_imports
    preview = service.preview(payload(host.storage, [
        {"name": "Light.fit", "size_bytes": 3}, {"name": "Light2.fit", "size_bytes": 3},
    ]))
    job = service.start(preview["preview_id"], str(uuid4()))
    first, second = [e["id"] for e in job["entries"]]
    with pytest.raises(StorageError, match="SOURCE_CHANGED"):
        service.put(job["id"], first, 3, BytesIO(b"ab").read)
    failed = service.status(job["id"])
    assert failed["failed"] == 1 and failed["phase"] == "paused"
    service.put(job["id"], second, 3, BytesIO(b"two").read)
    with monkeypatch.context() as patch:
        def fail(*_):
            raise StorageError("DATABASE_INVALID")
        patch.setattr(host.storage.library, "finish_import", fail)
        with pytest.raises(StorageError, match="DATABASE_INVALID"):
            service.put(job["id"], first, 3, BytesIO(b"one").read)
    def no_read(_):
        raise AssertionError("durably published bytes must be reused")
    host.storage.close()
    restored = StorageRuntime.initialize(host.storage.root, {})
    try:
        restored.direct_imports.put(job["id"], first, 3, no_read)
        assert restored.direct_imports.status(job["id"])["phase"] == "completed"
        with restored.db.session() as session:
            locs = list(session.scalars(select(AssetLocation)))
            assert len(locs) == 2 and len({loc.relative_key for loc in locs}) == 2
            assert {resolve_managed(restored.workspaces, loc).read_bytes() for loc in locs} == {b"one", b"two"}
    finally:
        restored.close()


def test_paused_failure_releases_location_and_preserves_cancelled_errors(host, tmp_path):
    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "frame.fit", "size_bytes": 3}]))
    job = service.start(preview["preview_id"], str(uuid4()))
    entry = job["entries"][0]
    with pytest.raises(StorageError, match="SOURCE_CHANGED"):
        service.put(job["id"], entry["id"], 3, BytesIO(b"ab").read)
    receipt = storage.operations.recent_receipts()[0]
    assert receipt["phase"] == "paused"
    assert receipt["receipt"]["errors"] == [{"entry": 1, "code": "SOURCE_CHANGED"}]
    previous = storage.workspaces.get(entry["workspace_id"])
    target = storage.workspaces.register(str(tmp_path / "other"), "Other")
    assert storage.migrations.remove_location(previous.id, previous.revision, target["id"]) == {"removed": True}
    with pytest.raises(StorageError, match="DIRECT_IMPORT_REPLAN_REQUIRED"):
        service.put(job["id"], entry["id"], 3, BytesIO(b"abc").read)
    service.cancel(job["id"])
    receipt = storage.operations.recent_receipts()
    task = next(item for item in receipt if item["operation_id"] == job["id"])
    assert task["phase"] == "cancelled"
    assert task["receipt"]["errors"] == [{"entry": 1, "code": "DIRECT_IMPORT_REPLAN_REQUIRED"}]


def test_missing_publication_checkpoint_restages_from_the_browser(host):
    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "frame.fit", "size_bytes": 3}]))
    job = service.start(preview["preview_id"], str(uuid4()))
    entry = job["entries"][0]
    with storage.db.session() as session:
        row = session.get(LibraryRecord, entry["id"])
        row.data = {**row.data, "writing": True, "publish_stat": [3, 0, 0, 0]}
    service.put(job["id"], entry["id"], 3, BytesIO(b"abc").read)
    assert storage.assets.resolve_asset(entry["id"]).read_bytes() == b"abc"
    assert service.status(job["id"])["phase"] == "completed"


@pytest.mark.parametrize(("component", "method", "code"), [
    ("capacity", "recheck", "INSUFFICIENT_DISK_SPACE"),
    ("library", "finish_import", "LIBRARY_RECORD_NOT_FOUND"),
])
def test_rejected_publication_releases_owned_bytes(host, monkeypatch, component, method, code):
    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "frame.fit", "size_bytes": 3}]))
    job = service.start(preview["preview_id"], str(uuid4()))
    entry = job["entries"][0]
    root = storage.workspaces.require(entry["workspace_id"])
    with storage.db.session() as session:
        key = session.get(LibraryRecord, entry["id"]).data["relative_key"]

    def reject(*_):
        raise StorageError(code)

    monkeypatch.setattr(getattr(storage, component), method, reject)
    with pytest.raises(StorageError, match=code):
        service.put(job["id"], entry["id"], 3, BytesIO(b"abc").read)
    assert not list((root / ".staging").iterdir())
    assert not (root / key).exists()
    with storage.db.session() as session:
        entry_data = session.get(LibraryRecord, entry["id"]).data
        assert not entry_data.get("writing") and not entry_data.get("publish_stat")
        assert session.get(Asset, entry["id"]) is None


@pytest.mark.parametrize("registered", [False, True], ids=["filesystem", "missing-registered-file"])
def test_path_conflicts_release_stage_without_touching_other_assets(host, registered):
    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "frame.fit", "size_bytes": 3}]))
    job = service.start(preview["preview_id"], str(uuid4()))
    entry = job["entries"][0]
    root = storage.workspaces.require(entry["workspace_id"])
    with storage.db.session() as session:
        row = session.get(LibraryRecord, entry["id"])
        key = row.data["relative_key"]
        if registered:
            other_id = str(uuid4())
            session.add(Asset(id=other_id, name="other.fit", size_bytes=3, mtime_ns=0))
            session.flush()
            session.add(AssetLocation(id=other_id, asset_id=other_id, storage_mode="managed",
                                      workspace_id=entry["workspace_id"], relative_key=key))
    destination = root / key
    if not registered:
        destination.parent.mkdir(parents=True)
        destination.write_bytes(b"other bytes")
    with pytest.raises(StorageError, match="OBJECT_CONFLICT"):
        service.put(job["id"], entry["id"], 3, BytesIO(b"abc").read)
    assert not list((root / ".staging").iterdir())
    with storage.db.session() as session:
        entry_data = session.get(LibraryRecord, entry["id"]).data
        assert not entry_data.get("writing") and not entry_data.get("publish_stat")
        assert session.get(Asset, entry["id"]) is None
    if registered:
        assert not destination.exists()
    else:
        assert destination.read_bytes() == b"other bytes"


def test_startup_reconciles_partial_stage_and_interrupted_cancel(host):
    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "interrupted.fit", "size_bytes": 10}]))
    interrupted = service.start(preview["preview_id"], str(uuid4()))
    preview = service.preview(payload(storage, [{"name": "cancelled.fit", "size_bytes": 10}]))
    cancelling = service.start(preview["preview_id"], str(uuid4()))
    root = storage.workspaces.require(interrupted["entries"][0]["workspace_id"])
    with storage.db.session() as session:
        for job in (interrupted, cancelling):
            entry_id = job["entries"][0]["id"]
            row = session.get(LibraryRecord, entry_id)
            row.data = {**row.data, "writing": True}
            (root / ".staging" / f"direct-{entry_id}.part").write_bytes(b"ab")
        row = session.get(LibraryRecord, cancelling["id"])
        row.data = {**row.data, "cancel_requested": True}
    storage.close()
    restored = StorageRuntime.initialize(storage.root, {})
    try:
        assert not list((root / ".staging").iterdir())
        task = restored.direct_imports.status(interrupted["id"])
        assert task["phase"] == "paused" and task["pending"] == 1
        assert restored.direct_imports.status(cancelling["id"])["phase"] == "cancelled"
    finally:
        restored.close()

def test_parallel_writes_and_reassignment_keep_order(host, tmp_path, monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Barrier

    from astrophoto.storage import import_planner

    storage = host.storage
    second = storage.workspaces.register(str(tmp_path / "w"), "secondary")["id"]
    first = storage.initial_workspace_id
    monkeypatch.setattr(import_planner, "volume_identity", lambda root: root.name)
    monkeypatch.setattr(import_planner, "_physical_disks", lambda root, volume: {volume})
    manifest = payload(storage, [{"name": f"f{i}.fit", "size_bytes": 1} for i in range(4)],
                       parallel=True, workspace_ids=[first, second])
    service = storage.direct_imports
    preview = service.preview(manifest)
    assert len(preview["workspaces"]) == 2
    job = service.start(preview["preview_id"], str(uuid4()))
    a, b, c, d = job["entries"]
    barrier = Barrier(2)

    def write(frame):
        source = BytesIO(b"x")
        def read(size):
            if not source.tell():
                barrier.wait(timeout=10)
            return source.read(size)
        return service.put(job["id"], frame["id"], 1, read)

    with ThreadPoolExecutor(2) as pool:
        written = list(pool.map(write, (a, b)))
    assert {file["workspace_id"] for file in written} == {first, second}
    with pytest.raises(StorageError, match="SOURCE_CHANGED"):
        service.put(job["id"], c["id"], 1, BytesIO(b"").read)
    other = second if c["workspace_id"] == first else first
    assert service.put(job["id"], c["id"], 1, BytesIO(b"y").read, other)["workspace_id"] == other
    service.put(job["id"], d["id"], 1, BytesIO(b"z").read)
    assert service.status(job["id"])["copied"] == 4
    with storage.db.session() as session:
        links = list(session.scalars(select(AssetImportFrame).order_by(AssetImportFrame.frame_index)))
        assert [link.asset_id for link in links] == [a["id"], b["id"], c["id"], d["id"]]

def test_cancel_releases_a_stalled_browser_stream(host):
    from types import SimpleNamespace

    from astrophoto.api.direct_import import put_file

    async def run():
        storage = host.storage
        service = storage.direct_imports
        preview = service.preview(payload(storage, [{"name": "stalled.fit", "size_bytes": 3}]))
        job = service.start(preview["preview_id"], str(uuid4()))
        entry = job["entries"][0]
        waiting = asyncio.Event()

        async def read(_size):
            waiting.set()
            await asyncio.Event().wait()
        request = SimpleNamespace(query={}, headers=BROWSER, match_info={"id": job["id"], "entry_id": entry["id"]},
                                  content_length=3, content=SimpleNamespace(read=read))
        uploading = asyncio.create_task(put_file(storage, request))
        await asyncio.wait_for(waiting.wait(), timeout=10)
        stopped = await asyncio.wait_for(asyncio.to_thread(service.cancel, job["id"]), timeout=8)
        assert stopped["phase"] == "cancelled" and not stopped["copied"]
        with pytest.raises(StorageError, match="OPERATION_CANCELLED"):
            await uploading
        root = storage.workspaces.require(entry["workspace_id"])
        assert not list((root / ".staging").glob("direct-*.part"))

    asyncio.run(run())


def test_abandoned_browser_stream_pauses_and_releases_staging(host, monkeypatch):
    from types import SimpleNamespace

    from astrophoto.api import direct_import

    monkeypatch.setattr(direct_import, "BODY_IDLE_TIMEOUT", 0.01)

    async def run():
        storage = host.storage
        service = storage.direct_imports
        preview = service.preview(payload(storage, [{"name": "stalled.fit", "size_bytes": 3}]))
        job = service.start(preview["preview_id"], str(uuid4()))
        entry = job["entries"][0]

        async def read(_size):
            await asyncio.Event().wait()

        request = SimpleNamespace(query={}, headers=BROWSER, match_info={"id": job["id"], "entry_id": entry["id"]},
                                  content_length=3, content=SimpleNamespace(read=read))
        with pytest.raises(StorageError, match="SOURCE_UNREADABLE"):
            await asyncio.wait_for(direct_import.put_file(storage, request), timeout=5)
        task = service.status(job["id"])
        assert task["phase"] == "paused" and task["failed"] == 1
        root = storage.workspaces.require(entry["workspace_id"])
        assert not list((root / ".staging").iterdir())

    asyncio.run(run())


def test_cancel_finishes_after_its_location_was_removed(host, monkeypatch):
    import errno

    from sqlalchemy import delete

    from astrophoto.assets import direct_import as direct_import_module
    from astrophoto.database.models import StorageLocation

    storage = host.storage
    service = storage.direct_imports
    preview = service.preview(payload(storage, [{"name": "frame.fit", "size_bytes": 3}]))
    job = service.start(preview["preview_id"], str(uuid4()))
    entry = job["entries"][0]
    original_publish = direct_import_module.publish_object

    def refuse_publish(source, destination):
        raise OSError(errno.EXDEV, "cross-device link")

    monkeypatch.setattr(direct_import_module, "publish_object", refuse_publish)
    with pytest.raises(StorageError, match="FILE_COPY_FAILED"):
        service.put(job["id"], entry["id"], 3, BytesIO(b"abc").read)
    monkeypatch.setattr(direct_import_module, "publish_object", original_publish)
    with storage.db.session(transaction="write") as session:
        data = session.get(LibraryRecord, entry["id"]).data
        assert data["writing"] and data["publish_stat"]
        # Simulate the registration disappearing while the write intent is still durable.
        session.execute(delete(StorageLocation).where(StorageLocation.id == entry["workspace_id"]))
    receipt = service.cancel(job["id"])
    assert receipt["phase"] == "cancelled"
    with storage.db.session() as session:
        data = session.get(LibraryRecord, entry["id"]).data
        assert "writing" not in data and "publish_stat" not in data


def test_preview_expiry_and_revision_conflict_leave_no_job(host):
    """TC-118: both invalidation paths reject before creating a job or asset."""
    service = host.storage.direct_imports
    files = [{"name": "frame.fit", "size_bytes": 3}]
    preview = service.preview(payload(host.storage, files))
    with host.storage.db.session(transaction="write") as session:
        row = session.get(LibraryRecord, preview["preview_id"])
        row.data = {**row.data, "expires": 0.0}
    with pytest.raises(StorageError) as expired:
        service.start(preview["preview_id"], str(uuid4()))
    assert expired.value.code == "PREVIEW_EXPIRED"

    fresh = service.preview(payload(host.storage, files))
    host.storage.update_settings(host.storage.snapshot("test")["imports"]["revision"], imports="reference")
    with pytest.raises(StorageError) as stale:
        service.start(fresh["preview_id"], str(uuid4()))
    assert stale.value.code == "REVISION_CONFLICT"

    with host.storage.db.session() as session:
        assert list(session.scalars(select(Asset))) == []
        assert list(session.scalars(select(LibraryRecord).where(LibraryRecord.kind == JOB))) == []
