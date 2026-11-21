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


def start_import(service, source, key="test", **options):
    return service.imports.import_assets({"sources": [str(source)], "idempotency_key": key, **options})


def test_first_start_and_reentry(service):
    initial = service.snapshot("test")
    other = StorageRuntime.initialize(service.root, {})
    assert initial["default_workspace_id"] == default_id(other)
    assert service.workspaces.instance_id == other.workspaces.instance_id
    assert initial["imports"] == {"default_mode": "reference", "revision": 0}
    assert initial["cache"]["max_size_gb"] == 20
    assert {path.name for path in (service.root / "databases").iterdir()} == {"assets.db"}
    assert initial["database"]["journal_mode"] == "wal"
    assert initial["database"]["foreign_keys"]


def test_bootstrap_interrupted_after_database_commit(tmp_path, monkeypatch):
    from astrophoto.storage.cache import CacheManager
    from astrophoto.core.config import read_json

    root = tmp_path / "data"
    with monkeypatch.context() as patched:
        def interrupt(*_args, **_kwargs):
            raise RuntimeError("injected startup failure")
        patched.setattr(CacheManager, "initialize", interrupt)
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
    previous = file_at(service.root / "workspace/outputs/prior.fits")
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
    managed = file_at(service.root / "workspace/outputs/keep.fits")
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
    assert not list((service.root / "workspace/objects").iterdir())
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
    assert not list((service.root / "workspace/.staging").iterdir())


def test_copy_preflight_blocks_offline_read_only_full_and_unauthorized(service, tmp_path, monkeypatch):
    path = file_at(tmp_path / "capture/file.fits")
    root = service.root / "workspace"
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
        stage = service.root / "workspace/.staging" / operation
        if stage.exists() and list(stage.glob("*.part")):
            with source.open("ab") as stream:
                stream.write(b"new content")

    monkeypatch.setattr(service.operations, "checkpoint", modify)
    operation = start_import(service, source, import_mode_override="copy")
    assert receipt(service, operation)["receipt"]["errors"][0]["code"] == "SOURCE_CHANGED"
    assert not service.assets.list()["assets"]
    assert not list((service.root / "workspace/.staging").iterdir())


def test_copy_recovers_after_publish_before_db_commit(service, tmp_path):
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
    assert receipt(recovered, operation)["receipt"]["copied"] == 1
    assert len(list((service.root / "workspace/objects").glob("*/*"))) == 1
    assert not list((service.root / "workspace/.staging").iterdir())


def test_cancel_partial_staging(service, tmp_path, monkeypatch):
    source = file_at(tmp_path / "capture/a.fits")
    original = service.operations.checkpoint

    def cancel(operation):
        staging = service.root / "workspace/.staging" / operation
        if staging.exists() and list(staging.glob("*.part")):
            service.operations.cancel(operation, "import")
        original(operation)

    monkeypatch.setattr(service.operations, "checkpoint", cancel)
    operation = start_import(service, source, import_mode_override="copy")
    assert receipt(service, operation)["phase"] == "cancelled"
    assert not service.assets.list()["assets"]
    assert source.exists() and not list((service.root / "workspace/.staging").iterdir())


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
        expected = target if checkpoint == "after" else service.root / "workspace"
        assert Path(service.workspaces.get(workspace).root_path) == expected
        with pytest.raises(StorageError, match="STORAGE_BUSY"):
            start_import(service, source, key="busy", import_mode_override="copy")
    recovered = StorageRuntime.initialize(service.root, service.environ)
    recovered.operations.pool.shutdown(wait=True)
    assert receipt(recovered, operation, "migration")["phase"] == "completed"
    assert recovered.workspaces.get(workspace).id == workspace
    assert recovered.assets.resolve_asset(asset["id"]) == target / old_file.relative_to(service.root / "workspace")
    assert old_file.read_bytes() == source.read_bytes()
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
        old = file_at(service.root / "workspace/outputs/result.fits")
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


def test_process_exit_during_copy_resumes_own_staging(service, tmp_path):
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
    staging = root / "workspace/.staging" / operation_id
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
    assert receipt(recovered, pending["operation_id"])["receipt"]["copied"] == 1
    assert not list((service.root / "workspace/.staging").iterdir())


def test_migration_verification_error_keeps_source(service, tmp_path, monkeypatch):
    from astrophoto.storage import migration

    source = file_at(service.root / "workspace/outputs/result.fits")
    target = tmp_path / "migrated"
    original = migration.file_hash

    def corrupt_checksum(path, checkpoint):
        return "invalid target digest" if path.is_relative_to(target) else original(path, checkpoint)

    monkeypatch.setattr(migration, "file_hash", corrupt_checksum)
    operation = service.migrations.start({"workspace_id": default_id(service), "target_path": str(target), "idempotency_key": "hash"})
    result = receipt(service, operation, "migration")
    assert result["phase"] == "failed" and result["error"]["code"] == "COPY_VERIFY_FAILED"
    assert service.workspaces.get(default_id(service)).root_path == str(service.root / "workspace")
    assert source.read_bytes() == b"FITS bytes\x00\xff"
    assert not (target / WORKSPACE_MARKER).exists()


def test_reject_links_unc_and_relative_paths(service, tmp_path):
    from astrophoto.storage.paths import canonicalize_root, safe_join_workspace

    for unsafe in ("relative", r"\\server\share", str(tmp_path.anchor)):
        with pytest.raises(StorageError):
            canonicalize_root(unsafe)
    for unsafe in ("../outside", "objects//a", "objects/CON", "objects/a:stream"):
        with pytest.raises(StorageError):
            safe_join_workspace(service.root / "workspace", unsafe)
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
        assert not list((service.root / "workspace/objects").iterdir())


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
