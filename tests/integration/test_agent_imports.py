"""Group approvals use their own credential and resume bindings on original asset IDs."""

import asyncio
import os
from uuid import uuid4

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer
from sqlalchemy import func, select

from astrophoto.api.routes import BASE, register_routes
from astrophoto.assets import agent_imports
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig
from astrophoto.core.errors import StorageError
from astrophoto.database.library_models import AssetAttributes
from astrophoto.database.models import Asset, AssetLocation, StorageOperation
from astrophoto.storage.manager import fingerprint, source_stat
from astrophoto.storage.runtime import StorageRuntime

PREFIX = f"{BASE}/library/agent-imports"
LIBRARY_TOKEN = "l" * 44
APPROVAL_TOKEN = "a" * 44
LIBRARY = {"Authorization": f"Bearer {LIBRARY_TOKEN}"}
APPROVER = {"Authorization": f"Bearer {APPROVAL_TOKEN}"}
BROWSER = {"Sec-Fetch-Site": "same-origin", "X-AstroPhoto-Local": "1"}


@pytest.fixture
def host(tmp_path, monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_LIBRARY_TOKEN", LIBRARY_TOKEN)
    monkeypatch.setenv("ASTROPHOTO_APPROVAL_TOKEN", APPROVAL_TOKEN)
    runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
    initialize_storage_runtime(runtime)
    assert runtime.storage is not None, runtime.storage_error
    runtime.trusted_local = True
    yield runtime
    runtime.storage.close()


CONDITIONS = {"gain": 100, "offset": 20, "exposure": 120, "temperature": -10, "binning": "1x1"}


def planned_group(path, *, camera=None, project=None, masters=()):
    target_versions = {
        "equipment": {camera["id"]: camera["row_version"]} if camera else {},
        "masters": {master["id"]: [master["revision"], 1] for master in masters},
    }
    if project:
        target_versions["project"] = project["revision"]
    return {
        "sources": [str(path)],
        "attributes": {"file_kind": "image", "usage": "light", "role": "raw", **CONDITIONS},
        "items": [{"index": 0, "path": str(path), "fingerprint": fingerprint(source_stat(path))}],
        "binding": {"camera_id": camera["id"], "master_ids": [master["id"] for master in masters]} if camera else {},
        "camera_name": camera["name"] if camera else None,
        "project_id": project["id"] if project else None,
        "target_versions": target_versions,
    }


async def wait_for(client, url, *states):
    async with asyncio.timeout(10):
        while True:
            response = await client.get(url, headers=LIBRARY)
            assert response.status == 200, await response.text()
            data = await response.json()
            if data["status"] in states:
                return data
            await asyncio.sleep(0.024)


def test_independent_approval_same_group_replay_and_binding_retry(host, tmp_path, monkeypatch):
    storage = host.storage
    storage.update_settings(0, imports="copy")
    camera = storage.equipment.create_equipment({"name": "Existing camera", "equipment_type": "camera"})
    project = storage.library.write("projects", {"name": "M31"})
    accepted_source = tmp_path / "accepted.fit"
    refused_source = tmp_path / "refused.fit"
    accepted_source.write_bytes(b"original accepted")
    refused_source.write_bytes(b"original refused")
    masters = []
    for usage in ("dark", "bias"):
        asset_id = str(uuid4())
        file = tmp_path / f"master-{usage}.fit"
        file.write_bytes(b"calibration sample")
        with storage.db.session(transaction="write") as session:
            session.add(Asset(id=asset_id, name=file.name, size_bytes=file.stat().st_size, mtime_ns=file.stat().st_mtime_ns))
            session.flush()
            session.add(AssetLocation(id=str(uuid4()), asset_id=asset_id, storage_mode="external_reference",
                                      external_path=str(file), external_key=str(file)))
            session.add(AssetAttributes(asset_id=asset_id, attributes={
                **CONDITIONS, "camera_id": camera["id"], "role": "calibration_master", "usage": usage,
            }))
        masters.append(storage.library.write("masters", {"asset_id": asset_id}))
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {
        "groups": [
            planned_group(accepted_source, camera=camera, project=project, masters=masters),
            planned_group(refused_source),
        ],
        "unresolved": [],
    })
    original_assignment = storage.library._assignment
    calls = []

    def temporarily_reject_binding(session, candidate, record_id):
        calls.append(candidate["asset_id"])
        if len(calls) == 2:
            raise StorageError("COLLECTION_CONFLICT")
        return original_assignment(session, candidate, record_id)

    monkeypatch.setattr(storage.library, "_assignment", temporarily_reject_binding)

    async def run():
        routes = web.RouteTableDef()
        register_routes(routes, host)
        app = web.Application()
        app.add_routes(routes)
        async with TestClient(TestServer(app)) as client:
            unauthorized = await client.post(PREFIX + "/plan", json={}, headers=BROWSER)
            assert unauthorized.status == 403
            preview = await client.post(PREFIX + "/plan", json={}, headers=LIBRARY)
            assert preview.status == 200, await preview.text()
            plan = await preview.json()
            assert len(plan["groups"]) == 2
            assert plan["groups"][0]["preview"]["effective_import_mode"] == "copy"
            assert plan["groups"][0]["preview"]["workspace_name"] == "Local"
            assert "fingerprint" not in plan["groups"][0]["items"][0]

            async def propose(group):
                response = await client.post(PREFIX, headers=LIBRARY, json={
                    "plan_id": plan["plan_id"], "group_id": group["group_id"],
                })
                assert response.status == 202, await response.text()
                return await response.json()

            accepted, refused = [await propose(group) for group in plan["groups"]]
            assert (await propose(plan["groups"][0]))["id"] == accepted["id"]
            assert accepted["status"] == refused["status"] == "pending"
            accept_url = f'{PREFIX}/{accepted["id"]}'
            accept = {"digest": accepted["digest"], "decision": "approved"}
            for unauthorized_headers in (LIBRARY, BROWSER, {**APPROVER, "Sec-Fetch-Site": "same-origin"}):
                response = await client.post(accept_url + "/decision", json=accept, headers=unauthorized_headers)
                assert response.status == 403
            stale = await client.post(accept_url + "/decision", headers=APPROVER,
                                      json={**accept, "digest": "0" * 64})
            assert stale.status == 409
            assert (await wait_for(client, accept_url, "pending"))["status"] == "pending"
            forged = await client.post(BASE + "/assets/import", headers=BROWSER, json={
                "sources": [str(refused_source)], "idempotency_key": "agent-group:" + accepted["id"],
            })
            assert forged.status == 422
            assert (await forged.json())["error"]["code"] == "INVALID_IDEMPOTENCY_KEY"

            rejected = await client.post(f'{PREFIX}/{refused["id"]}/decision', headers=APPROVER,
                                         json={"digest": refused["digest"], "decision": "denied"})
            data = await rejected.json()
            assert rejected.status == 200 and data["status"] == "denied"
            assert "import_operation_id" not in data
            changed_decision = await client.post(f'{PREFIX}/{refused["id"]}/decision', headers=APPROVER,
                                                 json={"digest": refused["digest"], "decision": "approved"})
            assert changed_decision.status == 409

            response = await client.post(accept_url + "/decision", json=accept, headers=APPROVER)
            assert response.status == 200, await response.text()
            failed = await wait_for(client, accept_url, "binding_failed")
            assert failed["bindings"][0]["error"]["code"] == "COLLECTION_CONFLICT"
            asset_id = failed["bindings"][0]["asset_id"]
            operation_id = failed["import_operation_id"]
            path = storage.assets.resolve_asset(asset_id)
            assert path.read_bytes() == b"original accepted" and path != accepted_source
            assert storage.library.get("assets", asset_id)["attributes"].get("camera_id") is None
            assert storage.library.list("assets", {"project_id": project["id"]})["items"][0]["id"] == asset_id
            assert calls == [asset_id, asset_id]
            assert storage.library.list("assignments", {})["items"] == []

            repeat_approval = await client.post(accept_url + "/decision", json=accept, headers=APPROVER)
            assert (await repeat_approval.json())["status"] == "binding_failed"
            assert calls == [asset_id, asset_id]

            accepted_source.unlink()
            for _ in range(2):
                retry = await client.post(accept_url + "/retry-bindings", json={}, headers=LIBRARY)
                bound = await retry.json()
                assert retry.status == 200 and bound["status"] == "completed", bound
                assert bound["import_operation_id"] == operation_id
                binding = bound["bindings"][0]
                assert binding["asset_id"] == asset_id and binding["status"] == "bound"
                assert len(binding["assignment_ids"]) == 2
            assert calls == [asset_id] * 4
            assert path.read_bytes() == b"original accepted"
            assert refused_source.read_bytes() == b"original refused"
            assert storage.library.get("assets", asset_id)["attributes"]["camera_id"] == camera["id"]
            assert {row["master_id"] for row in storage.library.list("assignments", {})["items"]} == {
                master["id"] for master in masters
            }
            with storage.db.session() as session:
                assert session.scalar(select(func.count()).select_from(Asset)) == 3
                assert session.scalar(select(func.count()).select_from(StorageOperation)) == 1

    asyncio.run(run())
    root = storage.root
    storage.close()
    restored = StorageRuntime.initialize(root, {})
    try:
        with restored.db.session() as session:
            assert session.scalar(select(func.count()).select_from(Asset)) == 3
            assert session.scalar(select(func.count()).select_from(StorageOperation)) == 1
    finally:
        restored.close()


def test_changed_preview_source_or_targets_require_new_approval(host, tmp_path, monkeypatch):
    storage = host.storage
    source = tmp_path / "source.fit"
    source.write_bytes(b"original fixture")
    camera = storage.equipment.create_equipment({"name": "Before", "equipment_type": "camera"})
    group = planned_group(source, camera=camera)
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    plan = storage.agent_imports.plan({})
    approved = storage.agent_imports.propose(plan["plan_id"], plan["groups"][0]["group_id"])
    storage.equipment.update_equipment(camera["id"], {"expected_version": camera["row_version"], "name": "After"})
    stale = storage.agent_imports.decide(approved["id"], approved["digest"], "approved")
    assert stale["status"] == "import_failed"
    assert stale["error"] == {"code": "REVISION_CONFLICT"}
    assert stale["requires_new_approval"] is True
    assert "import_operation_id" not in stale
    source.write_bytes(b"replacement")
    changed = storage.agent_imports.plan({})
    assert not changed["groups"]
    assert changed["unresolved"][0]["issues"] == [{"code": "SOURCE_CHANGED"}]


def test_ordinary_token_cannot_also_be_configured_as_approver(host, monkeypatch):
    monkeypatch.setenv("ASTROPHOTO_APPROVAL_TOKEN", LIBRARY_TOKEN)

    async def run():
        routes = web.RouteTableDef()
        register_routes(routes, host)
        app = web.Application()
        app.add_routes(routes)
        async with TestClient(TestServer(app)) as client:
            response = await client.post(PREFIX + "/invalid/decision", json={}, headers=LIBRARY)
            assert response.status == 403

    asyncio.run(run())


def test_approved_intent_recovers_after_restart_and_skips_existing_asset(host, tmp_path, monkeypatch):
    storage = host.storage
    new_source = tmp_path / "new.fit"
    existing_source = tmp_path / "already.fit"
    new_source.write_bytes(b"new")
    existing_source.write_bytes(b"existing")
    camera = storage.equipment.create_equipment({"name": "Camera", "equipment_type": "camera"})
    existing_id = str(uuid4())
    stamp = fingerprint(source_stat(existing_source))
    with storage.db.session(transaction="write") as session:
        session.add(Asset(id=existing_id, name=existing_source.name, size_bytes=stamp[0], mtime_ns=stamp[1]))
        session.flush()
        session.add(AssetLocation(id=existing_id, asset_id=existing_id, storage_mode="external_reference",
                                      external_path=str(existing_source), external_key=os.path.normcase(str(existing_source))))
    group = planned_group(new_source, camera=camera)
    group["sources"].append(str(existing_source))
    group["items"].append({"index": 1, "path": str(existing_source), "fingerprint": stamp})
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    plan = storage.agent_imports.plan({})
    proposal = storage.agent_imports.propose(plan["plan_id"], plan["groups"][0]["group_id"])
    with monkeypatch.context() as patch:
        # Simulate process exit after persisting approval, before enqueueing an operation.
        patch.setattr(storage.agent_imports, "_start", lambda _: None)
        pending = storage.agent_imports.decide(proposal["id"], proposal["digest"], "approved")
    assert pending["status"] == "approved" and "import_operation_id" not in pending
    root = storage.root
    storage.close()
    restored = StorageRuntime.initialize(root, {})
    try:
        async def wait():
            async with asyncio.timeout(10):
                while (status := restored.agent_imports.status(proposal["id"]))["status"] in {
                    "approved", "importing", "binding_pending",
                }:
                    await asyncio.sleep(0.024)
                return status

        finished = asyncio.run(wait())
        assert finished["status"] == "partial", finished
        assert finished["operation"]["receipt"]["skipped"] == 1
        assert finished["skipped_assets"] == [{"asset_id": existing_id, "reason": "ALREADY_REGISTERED"}]
        binding = finished["bindings"][0]
        assert binding["asset_id"] != existing_id and binding["status"] == "bound"
        assert "camera_id" not in restored.library.get("assets", existing_id)["attributes"]
        assert restored.library.get("assets", binding["asset_id"])["attributes"]["camera_id"] == camera["id"]
    finally:
        restored.close()


def test_failed_frame_retry_keeps_the_group_binding(host, tmp_path, monkeypatch):
    storage = host.storage
    storage.update_settings(0, imports="copy")
    camera = storage.equipment.create_equipment({"name": "Retry camera", "equipment_type": "camera"})
    first, second = tmp_path / "first.fit", tmp_path / "second.fit"
    first.write_bytes(b"first original")
    second.write_bytes(b"second original")
    group = planned_group(first, camera=camera)
    group["sources"].append(str(second))
    group["items"].append({"index": 1, "path": str(second), "fingerprint": fingerprint(source_stat(second))})
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    original_copy = storage.imports.import_copy
    failures = []

    def flaky_copy(operation_id, root, staging, item, plan, receipt, current, reservation):
        if item["source"].endswith("second.fit") and not failures:
            failures.append(True)
            return storage.imports._record(operation_id, receipt, "failed", "FILE_COPY_FAILED")
        return original_copy(operation_id, root, staging, item, plan, receipt, current, reservation)

    monkeypatch.setattr(storage.imports, "import_copy", flaky_copy)

    async def run():
        routes = web.RouteTableDef()
        register_routes(routes, host)
        app = web.Application()
        app.add_routes(routes)
        async with TestClient(TestServer(app)) as client:
            plan = await (await client.post(PREFIX + "/plan", json={}, headers=LIBRARY)).json()
            proposal = await (await client.post(PREFIX, headers=LIBRARY, json={
                "plan_id": plan["plan_id"], "group_id": plan["groups"][0]["group_id"],
            })).json()
            url = f'{PREFIX}/{proposal["id"]}'
            approved = await client.post(url + "/decision", headers=APPROVER,
                                         json={"digest": proposal["digest"], "decision": "approved"})
            assert approved.status == 200, await approved.text()
            partial = await wait_for(client, url, "partial")
            operation_id = partial["import_operation_id"]
            assert [binding["status"] for binding in partial["bindings"]] == ["bound"]
            retry = await client.post(f"{BASE}/library/imports/{operation_id}/retry-remaining",
                                      headers=BROWSER, json={})
            assert retry.status == 202, await retry.text()
            finished = await wait_for(client, url, "completed")
            assert finished["import_operation_id"] == operation_id
            assert len(finished["retry_operations"]) == 1
            assert {binding["status"] for binding in finished["bindings"]} == {"bound"}
            assert len(finished["bindings"]) == 2
            for binding in finished["bindings"]:
                assert storage.library.get("assets", binding["asset_id"])["attributes"]["camera_id"] == camera["id"]

    asyncio.run(run())
    assert second.read_bytes() == b"second original"


def wait_status(storage, approval_id, predicate, timeout=10):
    async def run():
        async with asyncio.timeout(timeout):
            while True:
                data = storage.agent_imports.status(approval_id)
                if predicate(data):
                    return data
                await asyncio.sleep(0.024)

    return asyncio.run(run())


def test_source_change_after_approval_keeps_the_frozen_fingerprint(host, tmp_path, monkeypatch):
    """TC-119: an approval binds frozen source stats; a changed frame fails and needs a new plan."""
    storage = host.storage
    storage.update_settings(0, imports="copy")
    camera = storage.equipment.create_equipment({"name": "Frozen camera", "equipment_type": "camera"})
    first, second = tmp_path / "first.fit", tmp_path / "second.fit"
    first.write_bytes(b"first original")
    second.write_bytes(b"second original")
    group = planned_group(first, camera=camera)
    group["sources"].append(str(second))
    group["items"].append({"index": 1, "path": str(second), "fingerprint": fingerprint(source_stat(second))})
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    original_copy = storage.imports.import_copy
    changed = []

    def change_before_copy(operation_id, root, staging, item, plan, receipt, current, reservation):
        if item["source"].endswith("second.fit") and not changed:
            changed.append(True)
            second.write_bytes(b"second changed between approval and copy")
        return original_copy(operation_id, root, staging, item, plan, receipt, current, reservation)

    monkeypatch.setattr(storage.imports, "import_copy", change_before_copy)

    async def run():
        routes = web.RouteTableDef()
        register_routes(routes, host)
        app = web.Application()
        app.add_routes(routes)
        async with TestClient(TestServer(app)) as client:
            plan = await (await client.post(PREFIX + "/plan", json={}, headers=LIBRARY)).json()
            proposal = await (await client.post(PREFIX, headers=LIBRARY, json={
                "plan_id": plan["plan_id"], "group_id": plan["groups"][0]["group_id"],
            })).json()
            url = f'{PREFIX}/{proposal["id"]}'
            approved = await client.post(url + "/decision", headers=APPROVER,
                                         json={"digest": proposal["digest"], "decision": "approved"})
            assert approved.status == 200, await approved.text()
            partial = await wait_for(client, url, "partial")
            assert "SOURCE_CHANGED" in {error["code"] for error in partial["operation"]["receipt"]["errors"]}
            assert [binding["status"] for binding in partial["bindings"]] == ["bound"]
            retry = await client.post(f"{BASE}/library/imports/{partial['import_operation_id']}/retry-remaining",
                                      headers=BROWSER, json={})
            # A changed source is deliberately not retryable: the frozen plan can never match it again.
            assert retry.status == 422
            assert (await retry.json())["error"]["code"] == "NO_RETRYABLE_FILES"
            latest = await (await client.get(url, headers=LIBRARY)).json()
            assert latest["status"] == "partial"
            assert len(latest["bindings"]) == 1
            assert not latest.get("retry_operations")
            imported = latest["bindings"][0]["asset_id"]
            assert storage.assets.resolve_asset(imported).read_bytes() == b"first original"
            with storage.db.session() as session:
                assert session.scalar(select(func.count()).select_from(Asset)) == 1

    asyncio.run(run())
    assert changed and second.read_bytes() == b"second changed between approval and copy"


def test_retryable_start_failure_keeps_the_approval(host, tmp_path, monkeypatch):
    """TC-117-R4: capacity failures stay approved with a retryable error and can restart."""
    storage = host.storage
    storage.update_settings(0, imports="copy")
    camera = storage.equipment.create_equipment({"name": "Retryable camera", "equipment_type": "camera"})
    source = tmp_path / "retryable.fit"
    source.write_bytes(b"retryable")
    group = planned_group(source, camera=camera)
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    plan = storage.agent_imports.plan({})
    proposal = storage.agent_imports.propose(plan["plan_id"], plan["groups"][0]["group_id"])
    original = storage.imports.import_assets

    def busy(*_args, **_kwargs):
        raise StorageError("INSUFFICIENT_DISK_SPACE")

    monkeypatch.setattr(storage.imports, "import_assets", busy)
    pending = storage.agent_imports.decide(proposal["id"], proposal["digest"], "approved")
    assert pending["status"] == "approved"
    assert pending["error"] == {"code": "INSUFFICIENT_DISK_SPACE", "retryable": True}
    assert "import_operation_id" not in pending

    monkeypatch.setattr(storage.imports, "import_assets", original)
    storage.agent_imports.retry_bindings(proposal["id"])
    done = wait_status(storage, proposal["id"], lambda data: data["status"] == "completed")
    assert done["bindings"][0]["status"] == "bound"
    assert storage.library.get("assets", done["bindings"][0]["asset_id"])["attributes"]["camera_id"] == camera["id"]


def test_group_plan_summary_and_unresolved_are_separate(host, tmp_path, monkeypatch):
    """TC-117-R6: each group exposes count, target, camera and project; unresolved stays outside."""
    storage = host.storage
    camera = storage.equipment.create_equipment({"name": "Summary camera", "equipment_type": "camera"})
    project = storage.library.write("projects", {"name": "M42"})
    first, second, orphan = (tmp_path / name for name in ("a.fit", "b.fit", "c.fit"))
    for path in (first, second, orphan):
        path.write_bytes(path.name.encode())
    group = planned_group(first, camera=camera, project=project)
    group["sources"].append(str(second))
    group["items"].append({"index": 1, "path": str(second), "fingerprint": fingerprint(source_stat(second))})
    unresolved = [{"index": 2, "path": str(orphan), "issues": [{"code": "CAMERA_AMBIGUOUS"}]}]
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": unresolved})
    plan = storage.agent_imports.plan({})
    planned = plan["groups"][0]
    assert len(planned["items"]) == 2
    assert planned["binding"]["camera_id"] == camera["id"]
    assert planned["project_id"] == project["id"]
    assert "calibration" not in planned or planned["calibration"] == []
    assert not planned.get("configuration_gaps")
    assert plan["unresolved"] == unresolved
    assert all(item["path"] != str(orphan) for item in planned["items"])
    proposal = storage.agent_imports.propose(plan["plan_id"], planned["group_id"])
    frozen = proposal["group"]
    assert len(frozen["items"]) == 2
    assert frozen["binding"]["camera_id"] == camera["id"]
    assert frozen["project_id"] == project["id"]


def test_retry_rejects_completed_groups_and_changed_settings(host, tmp_path, monkeypatch):
    """TC-123: retry reports NO_RETRYABLE_FILES and REVISION_CONFLICT without new work."""
    storage = host.storage
    storage.update_settings(0, imports="copy")
    camera = storage.equipment.create_equipment({"name": "Retry guard", "equipment_type": "camera"})
    done_source = tmp_path / "done.fit"
    done_source.write_bytes(b"done")
    group = planned_group(done_source, camera=camera)
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    plan = storage.agent_imports.plan({})
    proposal = storage.agent_imports.propose(plan["plan_id"], plan["groups"][0]["group_id"])
    storage.agent_imports.decide(proposal["id"], proposal["digest"], "approved")
    completed = wait_status(storage, proposal["id"], lambda data: data["status"] == "completed")
    with pytest.raises(StorageError) as none_left:
        storage.imports.retry_remaining(completed["import_operation_id"])
    assert none_left.value.code == "NO_RETRYABLE_FILES"

    failed_source, retry_source = tmp_path / "fail.fit", tmp_path / "later.fit"
    failed_source.write_bytes(b"first frame")
    retry_source.write_bytes(b"second frame")
    group = planned_group(failed_source, camera=camera)
    group["sources"].append(str(retry_source))
    group["items"].append({"index": 1, "path": str(retry_source),
                           "fingerprint": fingerprint(source_stat(retry_source))})
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    original_copy = storage.imports.import_copy
    failures = []

    def flaky_copy(operation_id, root, staging, item, plan, receipt, current, reservation):
        if item["source"].endswith("later.fit") and not failures:
            failures.append(True)
            return storage.imports._record(operation_id, receipt, "failed", "FILE_COPY_FAILED")
        return original_copy(operation_id, root, staging, item, plan, receipt, current, reservation)

    monkeypatch.setattr(storage.imports, "import_copy", flaky_copy)
    plan = storage.agent_imports.plan({})
    proposal = storage.agent_imports.propose(plan["plan_id"], plan["groups"][0]["group_id"])
    storage.agent_imports.decide(proposal["id"], proposal["digest"], "approved")
    partial = wait_status(storage, proposal["id"], lambda data: data["status"] == "partial")
    storage.update_settings(storage.snapshot("test")["imports"]["revision"], imports="copy")
    with pytest.raises(StorageError) as stale:
        storage.imports.retry_remaining(partial["import_operation_id"])
    assert stale.value.code == "REVISION_CONFLICT"
    with storage.db.session() as session:
        assert session.scalar(select(func.count()).select_from(StorageOperation)) == 2


def test_binding_version_conflict_flags_new_approval_and_keeps_retry(host, tmp_path, monkeypatch):
    """SPEC-001 C: a binding-time version conflict flags the approval; retry stays available."""
    storage = host.storage
    storage.update_settings(0, imports="copy")
    camera = storage.equipment.create_equipment({"name": "Versioned camera", "equipment_type": "camera"})
    source = tmp_path / "versioned.fit"
    source.write_bytes(b"versioned")
    group = planned_group(source, camera=camera)
    monkeypatch.setattr(agent_imports, "plan_agent_import", lambda *_: {"groups": [group], "unresolved": []})
    plan = storage.agent_imports.plan({})
    proposal = storage.agent_imports.propose(plan["plan_id"], plan["groups"][0]["group_id"])
    original = storage.library.bind_imported_asset
    attempts = []

    def conflict_once(session, asset_id, attributes, binding):
        attempts.append(asset_id)
        if len(attempts) == 1:
            raise StorageError("REVISION_CONFLICT")
        return original(session, asset_id, attributes, binding)

    monkeypatch.setattr(storage.library, "bind_imported_asset", conflict_once)
    storage.agent_imports.decide(proposal["id"], proposal["digest"], "approved")
    failed = wait_status(storage, proposal["id"], lambda data: data["status"] == "binding_failed")
    assert failed["requires_new_approval"] is True
    assert failed["bindings"][0]["error"]["code"] == "REVISION_CONFLICT"
    storage.agent_imports.retry_bindings(proposal["id"])
    done = wait_status(storage, proposal["id"], lambda data: data["status"] == "completed")
    assert "requires_new_approval" not in done
    assert done["bindings"][0]["status"] == "bound"
