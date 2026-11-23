import os
import shutil
import sqlite3
import subprocess
import sys
import time
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, OperationalError

from astrophoto.core.config import load_storage_settings, write_json_atomically
from astrophoto.core.errors import StorageError
from astrophoto.database.models import AssetLocation
from astrophoto.storage.data_root import DataRoots
from astrophoto.storage.initializer import WORKSPACE_MARKER
from astrophoto.storage.runtime import StorageRuntime


@pytest.fixture
def service(tmp_path):
    storage = StorageRuntime.initialize(tmp_path / "data", {"ASTROPHOTO_IMPORT_ROOTS": str(tmp_path / "capture")})
    yield storage
    storage.operations.pool.shutdown(wait=True)


def file_at(path, data=b"FITS bytes\x00\xff"):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return path


def receipt(service, operation_id, kind="import", phase=None):
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        result = service.operations.status(operation_id, kind)
        if result["phase"] == phase or result["phase"] in {"completed", "cancelled", "failed"} or result["error"]:
            return result
        time.sleep(0.025)
    raise AssertionError(result)


def default_id(service):
    return load_storage_settings(service.root)["workspace"]["default_workspace_id"]


def test_register_nonempty_directory_uses_empty_astrophoto_child(service, tmp_path):
    parent = tmp_path / "photos"
    original = file_at(parent / "original.fit", b"original")
    location = service.workspaces.register(str(parent), "Photos")
    assert Path(location["root_path"]) == parent / "AstroPhoto"
    assert (parent / "AstroPhoto" / WORKSPACE_MARKER).is_file()
    assert original.read_bytes() == b"original"

    occupied = tmp_path / "occupied"
    existing = file_at(occupied / "AstroPhoto" / "existing.fit", b"existing")
    with pytest.raises(StorageError, match="TARGET_NOT_EMPTY"):
        service.workspaces.register(str(occupied), "Occupied")
    assert existing.read_bytes() == b"existing"


def test_location_priority_quota_and_reservation(service, tmp_path):
    from astrophoto.api.storage import update_location_policy

    first = default_id(service)
    second = service.workspaces.register(str(tmp_path / "second"), "Second")["id"]
    revision = load_storage_settings(service.root)["revision"]
    update_location_policy(service, None, None, {
        "expected_revision": revision, "order": [first, second], "quotas": {first: 10, second: 20},
    })
    assert service.capacity.select_workspace(11) == second
    assert service.capacity.select_workspace(10) == first
    with service.capacity.reserve(service.workspaces.require(first), 6):
        assert service.capacity.select_workspace(5) == second
        with pytest.raises(StorageError, match="WORKSPACE_QUOTA_EXCEEDED"):
            service.capacity.check(service.workspaces.require(first), 5)
    revision = load_storage_settings(service.root)["revision"]
    update_location_policy(service, None, None, {
        "expected_revision": revision, "order": [second, first], "quotas": {first: 10, second: 20},
    })
    assert [row["id"] for row in service.snapshot("test")["workspaces"]] == [second, first]
    assert service.capacity.select_workspace(1) == second


def test_import_preview_freezes_automatic_location(service, tmp_path):
    from astrophoto.api.storage import update_location_policy

    first = default_id(service)
    second = service.workspaces.register(str(tmp_path / "second"), "Second")["id"]
    settings = load_storage_settings(service.root)
    service.update_settings(settings["revision"], imports="copy")
    settings = load_storage_settings(service.root)
    update_location_policy(service, None, None, {
        "expected_revision": settings["revision"], "order": [first, second], "quotas": {first: 1},
    })
    source = file_at(tmp_path / "capture" / "automatic.fit")
    payload = {"sources": [str(source)], "settings_revision": load_storage_settings(service.root)["revision"]}
    preview = service.imports.preview(payload)
    assert preview["workspace_id"] == second
    operation = service.imports.import_assets({**payload, "preview_id": preview["preview_id"], "idempotency_key": "auto"})
    result = receipt(service, operation)
    assert result["phase"] == "completed"
    assert result["workspace_id"] == second


def start_import(service, source, key="test", **options):
    return service.imports.import_assets({"sources": [str(source)], "idempotency_key": key, **options})


def test_first_start_and_reentry(service):
    initial = service.snapshot("test")
    other = StorageRuntime.initialize(service.root, {})
    assert initial["default_workspace_id"] == default_id(other)
    assert service.workspaces.instance_id == other.workspaces.instance_id
    assert initial["imports"] == {"default_mode": "reference", "revision": 0}
    assert initial["cache"]["max_size_gb"] == 20
    assert {path.name for path in (service.root / "database").iterdir()} == {"assets.db"}
    assert initial["database"]["journal_mode"] == "wal"
    assert initial["database"]["foreign_keys"]


def test_bootstrap_interrupted_after_database_commit(tmp_path, monkeypatch):
    from astrophoto.storage.locations import WorkspaceRegistry
    from astrophoto.core.config import read_json

    root = tmp_path / "data"
    with monkeypatch.context() as patched:
        def interrupt(*_args, **_kwargs):
            raise RuntimeError("injected startup failure")
        patched.setattr(WorkspaceRegistry, "capture_existing_identities", interrupt)
        with pytest.raises(RuntimeError, match="injected"):
            StorageRuntime.initialize(root, {})
    before = read_json(root / "config/manifest.json")
    after = StorageRuntime.initialize(root, {})
    assert after.workspaces.instance_id == before["instance_id"]
    assert default_id(after) == before["initial_workspace_id"]


@pytest.mark.parametrize(("change", "code"), [
    ("manifest", "RECOVERY_REQUIRED"), ("settings", "RECOVERY_REQUIRED"), ("missing_db", "RECOVERY_REQUIRED"),
    ("corrupt", "DATABASE_INVALID"), ("revision", "DEV_SCHEMA_RESET_REQUIRED"),
])
def test_never_replaces_an_existing_asset_database(service, change, code):
    file = service.db.path
    if change in {"manifest", "settings"}:
        (service.root / f"config/{change}.json").unlink()
    if change == "missing_db":
        file.rename(file.with_suffix(".saved"))
    if change == "corrupt":
        file.write_bytes(b"not sqlite")
    if change == "revision":
        with sqlite3.connect(file) as conn:
            conn.execute("UPDATE alembic_version SET version_num='9999_newer'")
    before = file.read_bytes() if file.exists() else None
    with pytest.raises(StorageError) as error:
        StorageRuntime.initialize(service.root, {})
    assert error.value.code == code
    assert (file.read_bytes() if file.exists() else None) == before


def test_multi_process_bootstrap(tmp_path):
    code = ("import sys; from pathlib import Path; from astrophoto.storage.runtime import StorageRuntime; "
            "s=StorageRuntime.initialize(Path(sys.argv[1]), {}); print(s.workspaces.instance_id)")
    args = [sys.executable, "-c", code, str(tmp_path / "data")]
    with subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as a, subprocess.Popen(
        args, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    ) as b:
        a_result, a_error = a.communicate(timeout=20)
        b_result, b_error = b.communicate(timeout=20)
    assert a.returncode == b.returncode == 0, (a_error, b_error)
    assert a_result and a_result == b_result


def test_foreign_keys_busy_rollback_and_backup(service, tmp_path):
    with pytest.raises(IntegrityError):
        with service.db.session() as session:
            session.add(AssetLocation(id="orphan", asset_id="missing", external_key="one",
                                      external_path="one", storage_mode="external_reference"))
    with service.db.session() as session:
        assert not list(session.scalars(select(AssetLocation)))
    with service.db.engine.connect() as owner, service.db.engine.connect() as contender:
        owner.exec_driver_sql("BEGIN IMMEDIATE")
        contender.exec_driver_sql("PRAGMA busy_timeout=25")
        with pytest.raises(OperationalError, match="locked"):
            contender.exec_driver_sql("BEGIN IMMEDIATE")
    target = tmp_path / "backup.db"
    service.db.backup(target)
    with sqlite3.connect(target) as copied:
        assert copied.execute("PRAGMA integrity_check").fetchone() == ("ok",)
        assert copied.execute("SELECT id FROM storage_locations").fetchone() == (default_id(service),)


def test_multiple_workspaces_default_disable_and_offline_relocation(service, tmp_path):
    a = service.workspaces.register(str(tmp_path / "A"), "A")
    b = service.workspaces.register(str(tmp_path / "B"), "B")
    assert a["id"] != b["id"]
    with pytest.raises(StorageError, match="STORAGE_PATH_CONFLICT"):
        service.workspaces.register(str(tmp_path / "A/nested"), "Nested")
    with pytest.raises(StorageError, match="STORAGE_PATH_CONFLICT"):
        service.cache.configure(str(tmp_path / "B/cache"), 10, 0)
    service.update_settings(0, workspace=a["id"])
    previous = file_at(service.root / "storage" / service.initial_workspace_id / "outputs/prior.fits")
    service.workspaces.update(b["id"], b["revision"], enabled=False)
    assert service.workspaces.check_status(service.workspaces.get(b["id"]))["status"] == "disabled"
    old = tmp_path / "A"
    new = tmp_path / "Relocated"
    old.rename(new)
    assert service.workspaces.check_status(service.workspaces.get(a["id"]))["status"] == "offline"
    assert not old.exists()
    old.mkdir()
    assert service.workspaces.check_status(service.workspaces.get(a["id"]))["status"] == "identity_mismatch"
    with pytest.raises(StorageError, match="WORKSPACE_IDENTITY_MISMATCH"):
        service.workspaces.relocate(a["id"], old)
    assert service.workspaces.relocate(a["id"], new)["id"] == a["id"]
    assert previous.is_file()
    assert StorageRuntime.initialize(service.root, {}).workspaces.get(a["id"]).root_path == str(new)


def test_cache_owner_entries_only_with_live_lease(service, tmp_path):
    first = service.cache.store("previews", b"old")
    root = tmp_path / "alternate"
    assert service.cache.configure(root, 7, 0)["max_size_gb"] == 7
    assert first.read_bytes() == b"old"
    kept = service.cache.store("previews", b"active")
    removed = service.cache.store("previews", b"remove")
    unknown = file_at(root / "previews" / ("a" * 32 + ".cache"), b"not owned")
    managed = file_at(service.root / "storage" / service.initial_workspace_id / "outputs/keep.fits")
    with service.cache.entry_lock(kept):
        result = service.cache.clear_owned_cache("all")
    assert result == {"removed": 1, "removed_bytes": 6, "skipped": 1, "failed": 0}
    assert unknown.exists() and kept.exists() and not removed.exists() and managed.exists()


def test_processing_scratch_recovers_only_owned_producer_files_without_a_live_lease(service):
    cache = service.cache
    policy = {"prefix": "processor-", "files": ("known.dat",)}
    with cache.scratch(0, **policy) as live:
        assert live.name.startswith("processor-")
        file_at(live / "known.dat")

        def abandoned(name, instance_id=cache.registry.instance_id):
            folder = live.parent / name
            file_at(folder / "known.dat")
            write_json_atomically(folder / "owner.json", {"instance_id": instance_id, "scratch": name})
            return folder

        stale = abandoned("processor-12345678")
        extra = abandoned("processor-abcdefgh")
        file_at(extra / "user.dat")
        foreign = abandoned("processor-ijklmnop", "another-instance")
        other = abandoned("other-12345678")
        with cache.scratch(0, **policy) as fresh:
            assert fresh.is_dir()
            assert not stale.exists()
            assert not (extra / "known.dat").exists()
            assert (extra / "user.dat").exists()
            assert (extra / "owner.json").exists()
            assert all((folder / "known.dat").exists() for folder in (live, foreign, other))
        assert not fresh.exists()
    assert not live.exists()

    with pytest.raises(ValueError, match="Invalid processing scratch policy"):
        with cache.scratch(0, prefix="processor-", files=("../user.dat",)):
            pytest.fail("Unsafe processing policy created a lease")


def test_reference_multiple_roots_mode_snapshot_and_relocation(service, tmp_path, monkeypatch):
    a = file_at(tmp_path / "capture/one/a.fits")
    b = file_at(tmp_path / "capture/two/b.ser")
    wire = {"sources": [str(a.parent), str(b.parent)], "idempotency_key": "reference", "session_id": "M42"}
    with monkeypatch.context() as patched:
        patched.setattr(service.operations, "submit", lambda _id: None)
        operation = service.imports.import_assets(wire)
        service.update_settings(0, imports="copy")
    service.operations.run(operation)
    result = receipt(service, operation)
    assert result["effective_import_mode"] == "reference"
    assert result["receipt"]["registered"] == 2
    assert not list((service.root / "storage" / service.initial_workspace_id / "objects").iterdir())
    assert a.read_bytes() == b.read_bytes() == b"FITS bytes\x00\xff"
    again = service.imports.import_assets({**wire, "idempotency_key": "again", "import_mode_override": "reference"})
    assert receipt(service, again)["receipt"]["skipped"] == 2
    asset = next(row for row in service.assets.list()["assets"] if row["name"] == a.name)
    assert asset["session_ids"] == ["M42"]
    moved = a.with_name("moved.fits")
    a.rename(moved)
    with pytest.raises(StorageError, match="SOURCE_NOT_FOUND"):
        service.assets.resolve_asset(asset["id"])
    service.assets.relocate(asset["id"], str(moved))
    assert service.assets.resolve_asset(asset["id"]) == moved


def test_copy_override_idempotency_and_real_bytes(service, tmp_path):
    source = file_at(tmp_path / "capture/photo.fit")
    operation = start_import(service, source, import_mode_override="copy")
    result = receipt(service, operation)
    assert result["phase"] == "completed"
    assert result["receipt"]["copied"] == 1
    assert result["receipt"]["verification"] == "size_and_stat"
    asset, = service.assets.list()["assets"]
    managed = service.assets.resolve_asset(asset["id"])
    assert managed.read_bytes() == source.read_bytes()
    assert managed.stat().st_ino != source.stat().st_ino
    assert start_import(service, source, import_mode_override="copy") == operation
    with pytest.raises(StorageError, match="IDEMPOTENCY_CONFLICT"):
        start_import(service, source, import_mode_override="reference")
    assert not list((service.root / "storage" / service.initial_workspace_id / ".staging").iterdir())


def test_copy_preflight_blocks_offline_read_only_full_and_unauthorized(service, tmp_path, monkeypatch):
    path = file_at(tmp_path / "capture/file.fits")
    root = service.root / "storage" / service.initial_workspace_id
    root.rename(service.root / "offline")
    with pytest.raises(StorageError, match="WORKSPACE_OFFLINE"):
        start_import(service, path, import_mode_override="copy")
    (service.root / "offline").rename(root)
    with monkeypatch.context() as patched:
        patched.setattr(os, "access", lambda *_: False)
        with pytest.raises(StorageError, match="WORKSPACE_READ_ONLY"):
            start_import(service, path, import_mode_override="copy")
    with monkeypatch.context() as patched:
        patched.setattr(shutil, "disk_usage", lambda *_: shutil._ntuple_diskusage(20, 20, 0))
        with pytest.raises(StorageError, match="INSUFFICIENT_DISK_SPACE"):
            service.imports.preview({"sources": [str(path)], "import_mode_override": "copy"})
        operation = start_import(service, path, import_mode_override="copy")
        assert receipt(service, operation)["error"]["code"] == "INSUFFICIENT_DISK_SPACE"
    with pytest.raises(StorageError, match="SOURCE_NOT_AUTHORIZED"):
        start_import(service, service.root / "config/settings.json", key="unsafe")
    assert service.assets.list()["assets"] == []


def test_copy_detects_inflight_source_change(service, tmp_path, monkeypatch):
    source = file_at(tmp_path / "capture/a.fits")
    original = service.operations.checkpoint

    def modify(operation):
        original(operation)
        stage = service.root / "storage" / service.initial_workspace_id / ".staging" / operation
        if stage.exists() and list(stage.glob("*.part")):
            with source.open("ab") as stream:
                stream.write(b"new content")

    monkeypatch.setattr(service.operations, "checkpoint", modify)
    operation = start_import(service, source, import_mode_override="copy")
    assert receipt(service, operation)["receipt"]["errors"][0]["code"] == "SOURCE_CHANGED"
    assert not service.assets.list()["assets"]
    assert not list((service.root / "storage" / service.initial_workspace_id / ".staging").iterdir())


def test_restart_discards_published_copy_without_db_commit(service, tmp_path):
    source = file_at(tmp_path / "capture/a.fits")
    from sqlalchemy import event

    def rollback_before_commit(session, _context):
        if any(isinstance(row, AssetLocation) for row in session.new):
            raise RuntimeError("injected DB rollback after flushing the managed asset")

    event.listen(service.db.sessions.class_, "after_flush", rollback_before_commit)
    try:
        operation = start_import(service, source, import_mode_override="copy")
        result = receipt(service, operation)
        assert result["phase"] == "publishing"
        assert result["error"]["code"] == "INTERNAL_STORAGE_ERROR"
        assert not service.assets.list()["assets"]
    finally:
        event.remove(service.db.sessions.class_, "after_flush", rollback_before_commit)
    recovered = StorageRuntime.initialize(service.root, service.environ)
    recovered.operations.pool.shutdown(wait=True)
    result = receipt(recovered, operation)
    assert result["phase"] == "cancelled" and result["error"]["code"] == "IMPORT_SESSION_ENDED"
    assert result["receipt"]["copied"] == 0
    assert not list((service.root / "storage" / service.initial_workspace_id / "objects").glob("*/*"))
    assert source.read_bytes() == b"FITS bytes\x00\xff"
    assert not list((service.root / "storage" / service.initial_workspace_id / ".staging").iterdir())


def test_copy_group_members_move_together_and_delete_individually(service, tmp_path):
    source = service.workspaces.get(default_id(service))
    target = service.workspaces.register(str(tmp_path / "disk2"), "Disk 2")
    first = file_at(tmp_path / "capture/a/light.fit", b"first")
    second = file_at(tmp_path / "capture/b/light.fit", b"second")
    job = service.imports.import_assets({
        "sources": [str(first), str(second)], "attributes": {"role": "raw"},
        "idempotency_key": "group", "import_mode_override": "copy",
    })
    assert receipt(service, job)["receipt"]["copied"] == 2
    ids = [row["id"] for row in service.assets.list()["assets"]]
    before = [service.assets.resolve_asset(asset_id) for asset_id in ids]
    assert before[0].parent == before[1].parent and before[0] != before[1]
    assert before[0].parent.parent.name == "subframes"
    contents = [path.read_bytes() for path in before]
    assert set(contents) == {b"first", b"second"}
    service.migrations.remove_location(source.id, source.revision, target["id"])
    after = [service.assets.resolve_asset(asset_id) for asset_id in ids]
    assert after[0].parent == after[1].parent and after[0].is_relative_to(tmp_path / "disk2")
    assert [path.read_bytes() for path in after] == contents
    revision = service.library.get("assets", ids[0])["revision"]
    service.library.delete_file(ids[0], revision, True)
    assert not after[0].exists() and after[1].read_bytes() == contents[1]
    assert first.read_bytes() == b"first" and second.read_bytes() == b"second"


def test_group_retry_after_publication_preserves_original_indices_and_sibling(service, tmp_path):
    from sqlalchemy import event

    from astrophoto.database.library_models import AssetImportFrame

    a = file_at(tmp_path / "a.fit")
    b = file_at(tmp_path / "b.fit")

    def rollback_second(session, _context):
        if any(isinstance(row, AssetLocation) and row.relative_key.endswith("/b.fit") for row in session.new):
            raise RuntimeError("interrupt publication of second group member")

    event.listen(service.db.sessions.class_, "after_flush", rollback_second)
    try:
        operation = service.imports.import_assets({
            "sources": [str(a), str(b)], "attributes": {"role": "raw"}, "idempotency_key": "restart-group",
            "import_mode_override": "copy",
        })
        assert receipt(service, operation)["phase"] == "publishing"
    finally:
        event.remove(service.db.sessions.class_, "after_flush", rollback_second)
    service.imports.recover_interrupted(service.operations.get(operation))
    first, = service.assets.list()["assets"]
    path = service.assets.resolve_asset(first["id"])
    assert path.name == "a.fit" and [file.name for file in path.parent.iterdir()] == ["a.fit"]
    retry = service.imports.retry_remaining(operation)
    assert receipt(service, retry)["receipt"]["copied"] == 1
    with service.db.session() as session:
        members = list(session.scalars(select(AssetImportFrame).order_by(AssetImportFrame.frame_index)))
    assert [row.frame_index for row in members] == [0, 1]
    assert members[0].group_id == members[1].group_id and members[0].asset_id == first["id"]
    assert path.read_bytes() == a.read_bytes() and (path.parent / "b.fit").read_bytes() == b.read_bytes()


def test_compact_group_key_stays_owned_after_move(service, tmp_path, monkeypatch):
    from astrophoto.storage import import_planner

    # Simulate a destination at its path-length limit on every platform. The planner
    # tests cover the native limit; here we verify the persisted key across migration.
    original = import_planner._length_limits
    source_location = service.workspaces.get(default_id(service))
    target = service.workspaces.register(str(tmp_path / "w"), "Short")

    def limited(root):
        if root == Path(source_location.root_path):
            max_file = import_planner._path_length(root / "objects" / "subframes" / ("g" * 36) / ("a" * 36 + ".fit"))
            return max_file, max_file
        return original(root)

    monkeypatch.setattr(import_planner, "_length_limits", limited)
    picked = file_at(tmp_path / "capture" / ("full-capture-" * 5 + "name.fit"))
    job = start_import(service, picked, import_mode_override="copy", attributes={"role": "raw"})
    assert receipt(service, job)["receipt"]["copied"] == 1
    asset, = service.assets.list()["assets"]
    assert asset["name"] == picked.name
    physical = service.assets.resolve_asset(asset["id"])
    decoy = physical.with_name("unowned.fit")
    shutil.copy2(physical, decoy)
    with service.db.session() as session:
        row = session.get(AssetLocation, asset["id"])
        saved_key = row.relative_key
        row.relative_key = saved_key.rpartition("/")[0] + "/" + decoy.name
    with pytest.raises(StorageError, match="LIBRARY_RECORD_REFERENCED"):
        service.library.delete_file(asset["id"], service.library.get("assets", asset["id"])["revision"], True)
    with service.db.session() as session:
        session.get(AssetLocation, asset["id"]).relative_key = saved_key
    service.migrations.remove_location(source_location.id, source_location.revision, target["id"])
    migrated = service.assets.resolve_asset(asset["id"])
    assert migrated.name == asset["id"] + ".fit" and migrated.read_bytes() == picked.read_bytes()
    service.library.delete_file(asset["id"], service.library.get("assets", asset["id"])["revision"], True)
    assert not migrated.exists() and picked.exists() and decoy.exists()


def test_direct_write_intent_protects_migration_and_removal(service, tmp_path):
    from uuid import uuid4

    from astrophoto.database.library_models import LibraryRecord

    workspace = service.workspaces.get(default_id(service))
    second = service.workspaces.register(str(tmp_path / "second"), "Second")
    job_id, frame_id = str(uuid4()), str(uuid4())
    with service.db.session() as session:
        session.add(LibraryRecord(id=job_id, kind="direct_import", data={"phase": "importing"}))
        session.add(LibraryRecord(id=frame_id, kind="direct_import_entry", data={
            "job_id": job_id, "workspace_id": workspace.id, "status": "pending", "writing": True}))
    with pytest.raises(StorageError, match="STORAGE_BUSY"):
        service.migrations.remove_location(workspace.id, workspace.revision, second["id"])
    with pytest.raises(StorageError, match="STORAGE_BUSY"):
        service.migrations.start({"workspace_id": workspace.id, "target_path": str(tmp_path / "moved"),
                                  "idempotency_key": "blocked"})
    with service.db.session() as session:
        frame = session.get(LibraryRecord, frame_id)
        frame.data = {"job_id": job_id, "workspace_id": workspace.id, "status": "failed"}
    assert service.migrations.remove_location(workspace.id, workspace.revision, second["id"]) == {"removed": True}


def test_cancel_partial_staging(service, tmp_path, monkeypatch):
    source = file_at(tmp_path / "capture/a.fits")
    original = service.operations.checkpoint

    def cancel(operation):
        staging = service.root / "storage" / service.initial_workspace_id / ".staging" / operation
        if staging.exists() and list(staging.glob("*.part")):
            service.operations.cancel(operation, "import")
        original(operation)

    monkeypatch.setattr(service.operations, "checkpoint", cancel)
    operation = start_import(service, source, import_mode_override="copy")
    assert receipt(service, operation)["phase"] == "cancelled"
    assert not service.assets.list()["assets"]
    assert source.exists() and not list((service.root / "storage" / service.initial_workspace_id / ".staging").iterdir())


@pytest.mark.parametrize("checkpoint", ["before", "after"])
def test_migration_recovers_around_database_switch(service, tmp_path, monkeypatch, checkpoint):
    from astrophoto.storage import migration

    source = file_at(tmp_path / "capture/a.fits")
    copied = start_import(service, source, import_mode_override="copy")
    initial = receipt(service, copied)
    assert initial["receipt"]["copied"] == 1, initial
    outside = start_import(service, source, key="external")
    assert receipt(service, outside)["receipt"]["registered"] == 1
    archived = service.workspaces.register(str(tmp_path / "archive"), "Archive")
    (tmp_path / "archive").rename(tmp_path / "unmounted")
    asset = next(row for row in service.assets.list()["assets"] if row["storage_mode"] == "managed")
    old_file = service.assets.resolve_asset(asset["id"])
    workspace = default_id(service)
    target = tmp_path / "migrated"
    with monkeypatch.context() as patched:
        def interrupt(*_args, **_kwargs):
            raise RuntimeError("simulated crash")
        if checkpoint == "before":
            patched.setattr(migration, "rebind_workspace", interrupt)
        else:
            patched.setattr(service.migrations, "_complete", interrupt)
        operation = service.migrations.start({"workspace_id": workspace, "target_path": str(target), "idempotency_key": "migration"})
        status = receipt(service, operation, "migration")
        assert status["phase"] == ("publishing" if checkpoint == "before" else "committed"), status
        expected = target if checkpoint == "after" else service.root / "storage" / service.initial_workspace_id
        assert Path(service.workspaces.get(workspace).root_path) == expected
        if checkpoint == "before":
            with pytest.raises(StorageError, match="STORAGE_BUSY"):
                start_import(service, source, key="busy", import_mode_override="copy")
    recovered = StorageRuntime.initialize(service.root, service.environ)
    recovered.operations.pool.shutdown(wait=True)
    assert receipt(recovered, operation, "migration")["phase"] == "completed"
    assert recovered.workspaces.get(workspace).id == workspace
    assert recovered.assets.resolve_asset(asset["id"]) == target / old_file.relative_to(service.root / "storage" / service.initial_workspace_id)
    assert not old_file.exists()
    assert recovered.assets.resolve_asset(asset["id"]).read_bytes() == source.read_bytes()
    assert (target / WORKSPACE_MARKER).exists()
    assert recovered.workspaces.check_status(recovered.workspaces.get(archived["id"]))["status"] == "offline"
    ref = next(row for row in service.assets.list()["assets"] if row["storage_mode"] == "external_reference")
    assert service.assets.resolve_asset(ref["id"]) == source


def test_migration_actual_cross_volume(service, tmp_path):
    volume = os.environ.get("ASTROPHOTO_TEST_SECOND_VOLUME")
    if not volume:
        pytest.skip("Set ASTROPHOTO_TEST_SECOND_VOLUME to authorize a temporary directory on a second local volume")
    with TemporaryDirectory(prefix="astrophoto-test-", dir=volume) as temporary:
        target = Path(temporary).resolve() / "workspace"
        assert target.parent.stat().st_dev != service.root.stat().st_dev, "Test requires different volumes"
        old = file_at(service.root / "storage" / service.initial_workspace_id / "outputs/result.fits")
        operation = service.migrations.start({"workspace_id": default_id(service), "target_path": str(target), "idempotency_key": "cross"})
        result = receipt(service, operation, "migration")
        assert result["phase"] == "completed", result
        assert result["receipt"]["verification"] == "sha256"
        assert (target / "outputs/result.fits").read_bytes() == old.read_bytes()



def test_reference_shared_sessions_leave_the_file_and_other_reference(service, tmp_path):
    path = file_at(tmp_path / "capture/one.fits")
    first = start_import(service, path, session_id="first")
    second = start_import(service, path, key="second", session_id="second")
    assert receipt(service, first)["phase"] == receipt(service, second)["phase"] == "completed"
    asset, = service.assets.list()["assets"]
    assert asset["session_ids"] == ["first", "second"]
    service.assets.set_session(asset["id"], "first", False)
    assert service.assets.list()["assets"][0]["session_ids"] == ["second"]
    assert service.assets.resolve_asset(asset["id"]).read_bytes() == path.read_bytes()


def test_process_exit_during_copy_discards_own_staging(service, tmp_path):
    source = file_at(tmp_path / "capture/abrupt.fits")
    child = """
import os
import sys
from pathlib import Path
from astrophoto.storage.runtime import StorageRuntime
root, capture = (Path(p) for p in sys.argv[1:])
service = StorageRuntime.initialize(root, {"ASTROPHOTO_IMPORT_ROOTS": str(capture.parent)})
original = service.operations.checkpoint
def stop(operation_id):
    staging = root / "storage" / service.initial_workspace_id / ".staging" / operation_id
    if staging.exists() and list(staging.glob("*.part")):
        os._exit(77)
    original(operation_id)
service.operations.checkpoint = stop
service.imports.import_assets({"sources": [str(capture)], "import_mode_override": "copy", "idempotency_key": "abrupt"})
service.operations.pool.shutdown(wait=True)
"""
    process = subprocess.run([sys.executable, "-c", child, str(service.root), str(source)], timeout=20)
    assert process.returncode == 77
    pending, = service.operations.recent()
    assert pending["phase"] == "importing"
    assert service.assets.list()["assets"] == []
    recovered = StorageRuntime.initialize(service.root, service.environ)
    recovered.operations.pool.shutdown(wait=True)
    result = receipt(recovered, pending["operation_id"])
    assert result["phase"] == "cancelled" and result["error"]["code"] == "IMPORT_SESSION_ENDED"
    assert not recovered.assets.list()["assets"]
    assert source.read_bytes() == b"FITS bytes\x00\xff"
    assert not list((service.root / "storage" / service.initial_workspace_id / ".staging").iterdir())


def test_partial_migration_requires_explicit_smallest_overshoot_and_cleans_source(service, tmp_path):
    source_workspace = default_id(service)
    target_workspace = service.workspaces.register(str(tmp_path / "target"), "Target")
    for name, size in (("a", 3000), ("b", 5000), ("c", 9000)):
        original = file_at(tmp_path / f"capture/{name}.fit", bytes(size))
        job = start_import(service, original, key=name, import_mode_override="copy")
        assert receipt(service, job)["phase"] == "completed"
    assets = {row["name"]: row["id"] for row in service.assets.list()["assets"]}
    original = service.assets.resolve_asset(assets["a.fit"])
    retained = service.assets.resolve_asset(assets["b.fit"])
    preview = service.migrations.preflight({"workspace_id": source_workspace, "target_workspace_id": target_workspace["id"],
                                           "amount": 0.000002, "unit": "GB"})
    assert preview["base_bytes"] == 17000
    option, = preview["options"]
    assert option["id"] == "over" and option["bytes"] == 3000 and option["difference_bytes"] == 1000
    with pytest.raises(StorageError, match="INVALID_REQUEST"):
        service.migrations.start({"plan_id": preview["plan_id"], "option_id": "under", "idempotency_key": "invalid"})
    assert original.exists() and retained.exists()
    command = {"plan_id": preview["plan_id"], "option_id": "over", "idempotency_key": "approved"}
    job = service.migrations.start(command)
    result = receipt(service, job, "migration")
    assert result["phase"] == "completed" and result["receipt"]["completed_bytes"] == 3000
    assert service.migrations.start(command) == job
    assert not original.exists() and retained.exists()
    assert service.assets.resolve_asset(assets["a.fit"]).is_relative_to(tmp_path / "target")
    assert (tmp_path / "capture/a.fit").stat().st_size == 3000


@pytest.mark.parametrize("failure", ["INSUFFICIENT_DISK_SPACE", "COPY_VERIFY_FAILED"])
def test_remove_location_retries_after_second_copy_fails(service, tmp_path, monkeypatch, failure):
    import errno

    from astrophoto.storage import migration

    source = service.workspaces.get(default_id(service))
    target = service.workspaces.register(str(tmp_path / "archive"), "Archive")
    for name in ("first.fit", "second.fit"):
        original = file_at(tmp_path / "capture" / name, name.encode())
        job = start_import(service, original, key=name, import_mode_override="copy")
        assert receipt(service, job)["phase"] == "completed"
    ids = [asset["id"] for asset in service.assets.list()["assets"]]
    paths = [service.assets.resolve_asset(asset_id) for asset_id in ids]
    original_copy = migration.stage_copy
    calls = []
    target_root = Path(target["root_path"])

    def destination(old):
        return target_root / old.relative_to(source.root_path)

    def fail_second_copy(old, *args, **kwargs):
        calls.append(old)
        if len(calls) == 2:
            if failure == "INSUFFICIENT_DISK_SPACE":
                raise OSError(errno.ENOSPC, "test volume full")
            unexpected = destination(old)
            unexpected.parent.mkdir(parents=True, exist_ok=True)
            unexpected.write_bytes(b"user file created during migration")
            raise StorageError(failure)
        return original_copy(old, *args, **kwargs)

    with monkeypatch.context() as patch:
        patch.setattr(migration, "stage_copy", fail_second_copy)
        with pytest.raises(StorageError, match=failure):
            service.migrations.remove_location(source.id, source.revision, target["id"])
    assert len(calls) == 2
    assert all(path.is_file() for path in paths)
    with service.db.session() as session:
        assert set(session.scalars(select(AssetLocation.workspace_id))) == {source.id}
    assert default_id(service) == source.id

    if failure == "COPY_VERIFY_FAILED":
        assert {row["status"] for row in service.snapshot("test")["workspaces"]} == {"online"}
        assert not destination(calls[0]).exists()
        unexpected = destination(calls[1])
        assert unexpected.read_bytes() == b"user file created during migration"
        unexpected.unlink()

    assert service.migrations.remove_location(source.id, source.revision, target["id"])["removed"]
    for old, asset in zip(paths, service.assets.list()["assets"], strict=True):
        moved = service.assets.resolve_asset(asset["id"])
        assert moved.is_relative_to(Path(target["root_path"])) and moved.read_bytes() == asset["name"].encode()
        assert not old.exists()


def test_remove_location_rejects_insufficient_target_quota_on_same_volume(service, tmp_path):
    from astrophoto.api.storage import update_location_policy

    source = service.workspaces.get(default_id(service))
    target = service.workspaces.register(str(tmp_path / "archive"), "Archive")
    original = file_at(tmp_path / "capture" / "frame.fit", b"12345")
    assert receipt(service, start_import(service, original, import_mode_override="copy"))["phase"] == "completed"
    asset, = service.assets.list()["assets"]
    path = service.assets.resolve_asset(asset["id"])
    assert path.stat().st_dev == Path(target["root_path"]).stat().st_dev
    update_location_policy(service, None, None, {
        "expected_revision": load_storage_settings(service.root)["revision"],
        "order": [source.id, target["id"]], "quotas": {target["id"]: 4},
    })
    with pytest.raises(StorageError, match="WORKSPACE_QUOTA_EXCEEDED"):
        service.migrations.remove_location(source.id, source.revision, target["id"])
    assert service.assets.resolve_asset(asset["id"]) == path
    assert path.read_bytes() == original.read_bytes()
    assert not list((Path(target["root_path"]) / "objects").iterdir())


def test_partial_migration_moves_formal_result_and_required_receipt_together(service, tmp_path):
    from uuid import uuid4

    from astrophoto.core.config import read_json

    workspace = default_id(service)
    output_id = str(uuid4())
    relative_key = f"outputs/{output_id}/stretched.fit"
    output = file_at(service.workspaces.require(workspace) / relative_key)
    manifest = output.with_name("manifest.json")
    write_json_atomically(manifest, {
        "producer": "siril-autostretch-v1", "instance_id": service.workspaces.instance_id, "workspace_id": workspace,
        "run_id": output_id, "output_id": output_id, "state": "completed",
    })
    service.library.record_output(output_id, workspace, relative_key, None, {
        "producer": "siril-autostretch-v1", "size_bytes": output.stat().st_size,
    })
    target = service.workspaces.register(str(tmp_path / "target"), "Target")
    preview = service.migrations.preflight({"workspace_id": workspace, "target_workspace_id": target["id"],
                                           "amount": 100, "unit": "%"})
    assert preview["base_bytes"] == output.stat().st_size + manifest.stat().st_size
    job = service.migrations.start({"plan_id": preview["plan_id"], "option_id": "exact", "idempotency_key": "formal"})
    assert receipt(service, job, "migration")["phase"] == "completed"
    destination = service.library.resolve_output(output_id)
    assert destination == tmp_path / "target" / relative_key
    assert read_json(destination.with_name("manifest.json"))["workspace_id"] == target["id"]
    assert not output.exists() and not manifest.exists()


def test_volume_budget_uses_all_space_until_quota_is_set(service, tmp_path, monkeypatch):
    default = default_id(service)
    other = service.workspaces.register(str(tmp_path / "other"), "Other")
    root = service.workspaces.require(default)
    monkeypatch.setattr(shutil, "disk_usage", lambda path: shutil._ntuple_diskusage(100, 0, 100))
    assert service.capacity.check(root, 100) == 100
    with service.capacity.reserve(root, 40):
        with pytest.raises(StorageError, match="INSUFFICIENT_DISK_SPACE"):
            service.capacity.check(Path(other["root_path"]), 61)
    service.capacity.configure(default, 10, 0)
    with pytest.raises(StorageError, match="VOLUME_QUOTA_EXCEEDED"):
        service.capacity.check(Path(other["root_path"]), 11)
    service.capacity.configure(other["id"], None, 1)
    assert service.capacity.check(root, 100) == 100


def test_rebind_partial_keeps_available_assets_and_write_access(service, tmp_path):
    workspace = default_id(service)
    for filename in ("present.fit", "missing.fit"):
        source = file_at(tmp_path / "capture" / filename)
        job = start_import(service, source, key=filename, import_mode_override="copy")
        assert receipt(service, job)["phase"] == "completed"
    rows = {row["name"]: row["id"] for row in service.assets.list()["assets"]}
    missing = service.assets.resolve_asset(rows["missing.fit"])
    path = tmp_path / "rebound"
    old_root = service.workspaces.require(workspace)
    relative_missing = missing.relative_to(old_root)
    old_root.rename(path)
    (path / relative_missing).unlink()
    with pytest.raises(StorageError, match="WORKSPACE_REBIND_PARTIAL") as conflict:
        service.workspaces.relocate(workspace, str(path))
    assert conflict.value.details["missing_count"] == 1
    assert service.workspaces.get(workspace).root_path == str(old_root)
    status = service.workspaces.relocate(workspace, str(path), allow_partial=True)
    assert status["status"] == "partial" and status["id"] == workspace
    assert service.assets.resolve_asset(rows["present.fit"]).is_relative_to(path)
    with pytest.raises(StorageError, match="SOURCE_NOT_FOUND"):
        service.assets.resolve_asset(rows["missing.fit"])
    new_file = file_at(tmp_path / "capture/new.fit")
    assert receipt(service, start_import(service, new_file, key="new", import_mode_override="copy"))["phase"] == "completed"
    (path / relative_missing).write_bytes(new_file.read_bytes())
    assert service.workspaces.validate(workspace)["status"] == "online"


def test_offline_root_move_restarts_from_new_root_and_protects_old_snapshot(tmp_path):
    source = tmp_path / "old"
    target = tmp_path / "new"
    roots = DataRoots(source)
    def open_storage(path):
        return StorageRuntime.initialize(path, {})
    original = roots.open(source, open_storage)
    workspace = default_id(original)
    capture = file_at(tmp_path / "capture/sample.fit")
    job = start_import(original, capture, import_mode_override="copy")
    assert receipt(original, job)["phase"] == "completed"
    asset = original.assets.list()["assets"][0]["id"]
    with pytest.raises(StorageError, match="already open"):
        roots.move(source, target)
    original.close()
    result = roots.move(source, target)
    assert result["activated"] and (source / "database/assets.db").is_file()
    with pytest.raises(StorageError, match="previous snapshot"):
        StorageRuntime.initialize(source, {})
    moved = roots.open(source, open_storage)
    try:
        assert moved.root == target and default_id(moved) == workspace
        assert moved.assets.resolve_asset(asset).is_relative_to(target)
        with pytest.raises(StorageError, match="already open"):
            roots.open(target, open_storage)
        with pytest.raises(StorageError, match="Move the active"):
            roots.rollback(target)
    finally:
        moved.close()


def test_offline_root_move_can_roll_back_before_new_root_opens(tmp_path):
    source, target = tmp_path / "old", tmp_path / "new"
    roots = DataRoots(source)
    def open_storage(path):
        return StorageRuntime.initialize(path, {})
    original = roots.open(source, open_storage)
    original.close()
    roots.move(source, target)
    assert DataRoots(target).rollback(target)["active"] == str(source)
    restored = DataRoots(target).open(target, open_storage)
    try:
        assert restored.root == source and restored.data_root_receipt["rolled_back"]
    finally:
        restored.close()


def test_committed_workspace_cleanup_retries_without_changing_authority(service, tmp_path, monkeypatch):
    original = file_at(tmp_path / "capture/owned.fit")
    job = start_import(service, original, import_mode_override="copy")
    assert receipt(service, job)["phase"] == "completed"
    asset_id = service.assets.list()["assets"][0]["id"]
    old = service.assets.resolve_asset(asset_id)
    unknown = file_at(service.root / "storage" / service.initial_workspace_id / "outputs/unknown.fit")
    target = tmp_path / "target"
    unlink = Path.unlink

    def busy(path, *args, **kwargs):
        if path == old:
            raise PermissionError("injected source cleanup error")
        return unlink(path, *args, **kwargs)

    with monkeypatch.context() as patch:
        patch.setattr(Path, "unlink", busy)
        job = service.migrations.start({"workspace_id": default_id(service), "target_path": str(target),
                                        "idempotency_key": "cleanup"})
        state = receipt(service, job, "migration")
        assert state["phase"] == "committed" and state["error"]["code"] == "SOURCE_CLEANUP_PENDING"
        assert old.exists() and service.assets.resolve_asset(asset_id).is_relative_to(target)
    service.operations.retry(job, "migration")
    assert receipt(service, job, "migration")["phase"] == "completed"
    assert not old.exists() and unknown.exists() and original.exists()


def test_close_clears_nonempty_session_cache_and_keeps_managed_assets(tmp_path):
    storage = StorageRuntime.initialize(tmp_path / "data", {}, host_temp=tmp_path / "host-temp")
    reference = file_at(tmp_path / "capture/asset.fit")
    job = start_import(storage, reference, import_mode_override="copy")
    assert receipt(storage, job)["phase"] == "completed"
    asset = storage.assets.resolve_asset(storage.assets.list()["assets"][0]["id"])
    preview = storage.cache.store("previews", b"preview")
    diagnostic = storage.cache.store("processing", b"diagnostic")
    unknown = file_at(preview.parent / "user-file", b"user")
    storage.close()
    assert not preview.exists() and not diagnostic.exists()
    assert asset.read_bytes() == reference.read_bytes() and unknown.read_bytes() == b"user"


def test_migration_verification_error_keeps_source(service, tmp_path, monkeypatch):
    from astrophoto.storage import migration

    source = file_at(service.root / "storage" / service.initial_workspace_id / "outputs/result.fits")
    target = tmp_path / "migrated"
    original = migration.file_hash

    def corrupt_checksum(path, checkpoint):
        return "invalid target digest" if path.is_relative_to(target) else original(path, checkpoint)

    monkeypatch.setattr(migration, "file_hash", corrupt_checksum)
    operation = service.migrations.start({"workspace_id": default_id(service), "target_path": str(target), "idempotency_key": "hash"})
    result = receipt(service, operation, "migration")
    assert result["phase"] == "failed" and result["error"]["code"] == "COPY_VERIFY_FAILED"
    assert service.workspaces.get(default_id(service)).root_path == str(service.root / "storage" / service.initial_workspace_id)
    assert source.read_bytes() == b"FITS bytes\x00\xff"
    assert not (target / WORKSPACE_MARKER).exists()


def test_reject_links_unc_and_relative_paths(service, tmp_path):
    from astrophoto.storage.paths import canonicalize_root, safe_join_workspace

    for unsafe in ("relative", r"\\server\share", str(tmp_path.anchor)):
        with pytest.raises(StorageError):
            canonicalize_root(unsafe)
    for unsafe in ("../outside", "objects//a", "objects/CON", "objects/a:stream"):
        with pytest.raises(StorageError):
            safe_join_workspace(service.root / "storage" / service.initial_workspace_id, unsafe)
    real = tmp_path / "real"
    real.mkdir()
    redirect = tmp_path / "redirect"
    try:
        redirect.symlink_to(real, target_is_directory=True)
    except (NotImplementedError, OSError):
        if os.name != "nt":
            raise
        subprocess.run(["cmd.exe", "/d", "/c", "mklink", "/j", str(redirect), str(real)], check=True, capture_output=True)
    with pytest.raises(StorageError):
        service.workspaces.register(redirect / "new", "unsafe")
    assert not list(real.iterdir())


def test_reference_on_distinct_windows_volumes(service, tmp_path):
    volume = os.environ.get("ASTROPHOTO_TEST_SECOND_VOLUME")
    if not volume:
        pytest.skip("Second local volume unavailable")
    with TemporaryDirectory(prefix="astrophoto-reference-", dir=volume) as temporary:
        capture_a = tmp_path / "capture"
        capture_b = Path(temporary).resolve()
        first = file_at(capture_a / "first.fit", b"from first volume")
        second = file_at(capture_b / "second.ser", b"from second volume")
        assert first.stat().st_dev != second.stat().st_dev
        service.environ["ASTROPHOTO_IMPORT_ROOTS"] = os.pathsep.join((str(capture_a), str(capture_b)))
        operation = service.imports.import_assets({
            "sources": [str(capture_a), str(capture_b)], "idempotency_key": "cross-volume-reference",
        })
        result = receipt(service, operation)
        assert result["receipt"]["registered"] == 2
        assert {service.assets.resolve_asset(asset["id"]) for asset in service.assets.list()["assets"]} == {first, second}
        assert first.read_bytes() == b"from first volume" and second.read_bytes() == b"from second volume"
        assert not list((service.root / "storage" / service.initial_workspace_id / "objects").iterdir())


def test_explicit_wal_failure_has_no_fake_ready(tmp_path):
    from sqlalchemy import event
    from astrophoto.database.manager import DatabaseManager

    database = DatabaseManager(tmp_path / "wal-unavailable.db")

    @event.listens_for(database.engine, "before_cursor_execute", retval=True)
    def previous_journal(connection, cursor, statement, parameters, context, executemany):
        if statement == "PRAGMA journal_mode=WAL":
            return "PRAGMA journal_mode=DELETE", parameters
        return statement, parameters

    with pytest.raises(StorageError, match="WAL_UNAVAILABLE"):
        database.initialize("test", creating=True)
    with sqlite3.connect(database.path) as connection:
        assert connection.execute("PRAGMA journal_mode").fetchone() == ("delete",)
        assert not connection.execute("SELECT name FROM sqlite_schema WHERE type='table'").fetchall()


def test_legacy_dev_schema_is_preserved(service):
    file = service.db.path
    with sqlite3.connect(file) as conn:
        conn.execute("UPDATE alembic_version SET version_num='0002_asset_sessions'")
        conn.execute("INSERT INTO assets VALUES ('existing', 'existing.fits', 1, 0)")
    original = file.read_bytes()
    with pytest.raises(StorageError) as rejected:
        StorageRuntime.initialize(service.root, {})
    assert rejected.value.code == "DEV_SCHEMA_RESET_REQUIRED"
    assert file.read_bytes() == original
