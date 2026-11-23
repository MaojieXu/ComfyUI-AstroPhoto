"""Live layout reconciliation against isolated roots and real SQLite instances."""

from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from pathlib import Path
from threading import Barrier

import pytest

from astrophoto.core.config import load_storage_settings, read_json, write_json_atomically
from astrophoto.core.errors import StorageError
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.data_root import DataRoots
from astrophoto.storage.runtime import StorageRuntime


@pytest.fixture
def storage(tmp_path):
    service = StorageRuntime.initialize(tmp_path / "data", {})
    yield service
    service.close()


def initial_root(storage):
    return storage.root / "storage" / storage.initial_workspace_id


def test_init_confirms_default_and_repairs_only_safe_gaps(storage):
    root = storage.root
    original = {key: (root / key).read_bytes() for key in ("config/settings.json", "config/manifest.json")}
    assert storage.ensure_layout() == {
        "status": "ready", "data_root": str(root), "created": [],
        "checks": dict.fromkeys(("config", "database", "storage", "runtime"), "ready"),
    }
    evidence = next((root / "runtime").glob("workspace-*.json"))
    assert {child.name for child in root.iterdir()} == {"config", "database", "storage", "runtime"}
    assert not (root / "runtime/cache").exists()
    evidence.unlink()
    outputs = initial_root(storage) / "outputs"
    outputs.rmdir()
    result = storage.ensure_layout()
    assert result["created"] == [f"storage/{storage.initial_workspace_id}/outputs/"]
    assert outputs.is_dir() and not (root / "runtime/migrations").exists()
    assert not evidence.exists()
    assert storage.ensure_layout()["created"] == []
    assert all((root / key).read_bytes() == data for key, data in original.items())


@pytest.mark.parametrize("key", ["config/manifest.json", "config/settings.json", "runtime/cache/.astrophoto-cache.json",
                                 "storage/{id}/.astrophoto-workspace.json", "database/assets.db"])
def test_init_preserves_missing_identity_or_data(storage, key):
    if key.startswith("runtime/cache"):
        storage.cache.store("tmp", b"cache")
    path = storage.root / key.format(id=storage.initial_workspace_id)
    backup = path.with_suffix(".saved")
    path.rename(backup)
    migration_dir = storage.root / "runtime/migrations"
    try:
        with pytest.raises(StorageError):
            storage.ensure_layout()
        assert not migration_dir.exists() and not path.exists() and backup.is_file()
    finally:
        backup.rename(path)


def test_init_cannot_recreate_directory_over_missing_registered_asset(storage):
    workspace_id = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    with storage.db.session() as session:
        session.add(Asset(id="known", name="known.fit", size_bytes=128, mtime_ns=1))
        session.flush()
        session.add(AssetLocation(id="managed", asset_id="known", storage_mode="managed",
                                  workspace_id=workspace_id, relative_key="objects/known.fit"))
    (initial_root(storage) / "objects").rmdir()
    with pytest.raises(StorageError) as exc:
        storage.ensure_layout()
    assert exc.value.code == "WORKSPACE_FILES_MISSING"
    assert not (initial_root(storage) / "objects").exists()


def test_reentry_preserves_conflicting_evidence_and_accepts_absent_record(tmp_path):
    root = tmp_path / "data"
    service = StorageRuntime.initialize(root, {})
    service.close()
    evidence = next((root / "runtime").glob("workspace-*.json"))
    altered = read_json(evidence) | {"path": str(tmp_path / "different")}
    write_json_atomically(evidence, altered)
    migrations = root / "runtime/migrations"
    for conflict in (True, False):
        if not conflict:
            evidence.unlink()
        service = StorageRuntime.initialize(root, {})
        try:
            if conflict:
                with pytest.raises(StorageError) as exc:
                    service.ensure_layout()
                assert exc.value.code == "WORKSPACE_IDENTITY_MISMATCH"
                assert read_json(evidence) == altered
            else:
                assert service.ensure_layout()["created"] == []
                assert not evidence.exists()
            assert not migrations.exists()
        finally:
            service.close()


def test_init_uses_effective_workspace_and_persistent_cache(storage, tmp_path):
    location = storage.workspaces.register(str(tmp_path / "external"), "External")
    settings = storage.update_settings(0, workspace=location["id"])
    cache = tmp_path / "custom-cache"
    storage.cache.configure(str(cache), 8, settings["revision"])
    storage.cache.use_host_temp(tmp_path / "host-temp")
    external = Path(location["root_path"])
    (external / "objects").rmdir()
    (initial_root(storage) / "outputs").rmdir()
    assert set(storage.ensure_layout()["created"]) == {
        f"storage/{location['id']}/objects/", f"storage/{storage.initial_workspace_id}/outputs/",
    }
    assert (external / "objects").is_dir() and (initial_root(storage) / "outputs").is_dir()
    offline = external.with_name("removed-volume")
    external.rename(offline)
    with pytest.raises(StorageError) as exc:
        storage.ensure_layout()
    assert exc.value.code == "WORKSPACE_OFFLINE" and exc.value.details["path"] == str(external)
    assert not external.exists()
    offline.rename(external)
    assert storage.ensure_layout()["created"] == []
    assert not storage.cache.session_path.exists()


def test_init_does_not_replace_a_live_lock_directory(storage):
    lock_dir = storage.root / "runtime/locks"
    backup = lock_dir.with_name("old-locks")
    lock_dir.rename(backup)
    lock_dir.mkdir()
    try:
        with pytest.raises(StorageError) as exc:
            storage.ensure_layout()
        assert exc.value.code == "RECOVERY_REQUIRED" and list(lock_dir.iterdir()) == []
    finally:
        lock_dir.rmdir()
        backup.rename(lock_dir)


def test_init_rechecks_lock_directory_after_acquiring_locks(storage, monkeypatch):
    lock_dir = storage.root / "runtime/locks"
    migration_dir = storage.root / "runtime/migrations"
    original_lease = storage.workspaces.lease

    @contextmanager
    def replace_before_acquiring(workspace_id):
        lock_dir.rename(lock_dir.with_name("old-locks"))
        lock_dir.mkdir()
        with original_lease(workspace_id):
            yield

    monkeypatch.setattr(storage.workspaces, "lease", replace_before_acquiring)
    with pytest.raises(StorageError) as exc:
        storage.ensure_layout()
    assert exc.value.code == "RECOVERY_REQUIRED"
    assert not migration_dir.exists()


def test_init_defers_repair_while_workspace_lease_is_held(storage):
    workspace_id = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    outputs = initial_root(storage) / "outputs"
    outputs.rmdir()
    with storage.workspaces.lease(workspace_id):
        with pytest.raises(StorageError) as exc:
            storage.ensure_layout()
        assert exc.value.code == "STORAGE_BUSY"
        assert not outputs.exists()
    assert storage.ensure_layout()["created"] == [f"storage/{workspace_id}/outputs/"]


def test_concurrent_init_converges_and_retry_preserves_completed_steps(storage, monkeypatch):
    outputs = initial_root(storage) / "outputs"
    objects = initial_root(storage) / "objects"
    outputs.rmdir()
    objects.rmdir()
    original_mkdir = Path.mkdir

    def fail_outputs(path, *args, **kwargs):
        if path == outputs:
            raise PermissionError("injected mkdir failure")
        return original_mkdir(path, *args, **kwargs)

    with monkeypatch.context() as patch:
        patch.setattr(Path, "mkdir", fail_outputs)
        with pytest.raises(PermissionError):
            storage.ensure_layout()
    assert objects.is_dir() and not outputs.exists()
    barrier = Barrier(2)

    def invoke():
        barrier.wait(timeout=5)
        try:
            return storage.ensure_layout()["created"]
        except StorageError as exc:
            assert exc.code == "STORAGE_BUSY"
            return []

    with ThreadPoolExecutor(2) as pool:
        futures = [pool.submit(invoke) for _ in range(2)]
    assert sorted(key for f in futures for key in f.result()) == [f"storage/{storage.initial_workspace_id}/outputs/"]
    assert storage.ensure_layout()["created"] == []


@pytest.mark.parametrize("external_default", [False, True])
def test_init_after_offline_root_move_preserves_location_identity(tmp_path, external_default):
    old, new = tmp_path / "old", tmp_path / "new"
    roots = DataRoots(old)

    def start(path):
        return StorageRuntime.initialize(path, {})

    service = roots.open(old, start)
    if external_default:
        location = service.workspaces.register(str(tmp_path / "external"), "External")
        service.update_settings(0, workspace=location["id"])
    service.close()
    roots.move(old, new)
    service = roots.open(old, start)
    try:
        assert service.ensure_layout()["data_root"] == str(new)
        assert service.ensure_layout()["created"] == []
    finally:
        service.close()


def test_migration_plan_directory_created_only_on_first_plan(tmp_path):
    root = tmp_path / "data"
    StorageRuntime.initialize(root, {}).close()
    service = StorageRuntime.initialize(root, {})
    plans = root / "runtime/migrations"
    try:
        assert not plans.exists() and not service.ensure_layout()["created"]
        plan = service.migrations.preflight({"workspace_id": service.initial_workspace_id,
                                             "target_path": str(tmp_path / "destination")})
        path = plans / f"{plan['plan_id']}.json"
        assert path.is_file()
        path.unlink()
        plans.rmdir()
        with pytest.raises(StorageError, match="MIGRATION_PLAN_STALE"):
            service.migrations.start({"plan_id": plan["plan_id"], "option_id": "complete", "idempotency_key": "stale"})
        assert not plans.exists()
    finally:
        service.close()


def test_registered_root_never_reenters_creation_after_manifest_regression(tmp_path):
    root = tmp_path / "data"
    roots = DataRoots(root)

    def start(path):
        return StorageRuntime.initialize(path, {})

    roots.open(root, start).close()
    manifest_path = root / "config/manifest.json"
    original = read_json(manifest_path)
    write_json_atomically(manifest_path, original | {"initialized": False})
    db_path = root / "database/assets.db"
    db_path.rename(tmp_path / "saved.db")
    with pytest.raises(StorageError) as exc:
        roots.open(root, start)
    assert exc.value.code == "RECOVERY_REQUIRED"
    assert not db_path.exists() and read_json(manifest_path) == original | {"initialized": False}


@pytest.mark.parametrize(("missing", "conflict"), [
    (("runtime",), None),
    (("database", "storage", "runtime"), None),
    (("database", "storage"), "runtime"),
])
def test_host_startup_checks_and_repairs_top_level_directories(tmp_path, missing, conflict):
    root = tmp_path / "data"
    DataRoots(root).open(root, lambda path: StorageRuntime.initialize(path, {})).close()
    original = {name: (root / "config" / name).read_bytes() for name in ("manifest.json", "settings.json")}
    for name in missing:
        (root / name).rename(tmp_path / name)

    class ReachedBusinessFactory(Exception):
        pass

    def factory(path):
        assert path == root
        assert all((root / name).is_dir() for name in ("config", "database", "storage", "runtime"))
        raise ReachedBusinessFactory

    if conflict:
        blocked = root / conflict
        blocked.rename(tmp_path / conflict)
        blocked.write_bytes(b"existing content")
        with pytest.raises(StorageError) as error:
            DataRoots(root).open(root, factory)
        assert error.value.code == "INVALID_STORAGE_PATH"
        assert error.value.details == {"path": str(blocked)}
        assert blocked.read_bytes() == b"existing content"
        assert all(not (root / name).exists() for name in missing)
        blocked.rename(tmp_path / "blocked")

    with pytest.raises(ReachedBusinessFactory):
        DataRoots(root).open(root, factory)
    assert all((root / "config" / name).read_bytes() == content for name, content in original.items())


@pytest.mark.parametrize("phase", ["queued", "cancelled"])
def test_staging_repair_waits_for_import_or_pending_cleanup(storage, phase):
    workspace = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    operation = storage.operations.create("import", "init-test", {}, {"workspace_id": workspace})
    storage.operations.advance(operation.id, phase=phase, receipt={"cleanup_pending": phase == "cancelled"})
    staging = initial_root(storage) / ".staging"
    staging.rmdir()
    with pytest.raises(StorageError) as exc:
        storage.ensure_layout()
    assert exc.value.code == "STORAGE_BUSY" and not staging.exists()
    storage.operations.advance(operation.id, phase="cancelled", receipt={})
    assert storage.ensure_layout()["created"] == [f"storage/{workspace}/.staging/"]


@pytest.mark.parametrize("change", ["directory", "hardlink", "invalid_json"])
def test_unreadable_or_unsafe_evidence_blocks_repairs(storage, tmp_path, change):
    record = next((storage.root / "runtime").glob("workspace-*.json"))
    original = record.read_bytes()
    record.unlink()
    if change == "directory":
        record.mkdir()
    elif change == "hardlink":
        second = tmp_path / "second"
        second.write_bytes(original)
        record.hardlink_to(second)
    else:
        record.write_text("{", encoding="utf-8")
    outputs = initial_root(storage) / "outputs"
    outputs.rmdir()
    with pytest.raises(StorageError) as exc:
        storage.ensure_layout()
    assert exc.value.code == "RECOVERY_REQUIRED" and not outputs.exists()


def test_bootstrap_lock_timeout_and_restart_reuse_identity(tmp_path, monkeypatch):
    """TC-120: lock timeouts map to STORAGE_BUSY; a second start reuses the instance identity."""
    from filelock import Timeout

    root = tmp_path / "data"
    original = StorageRuntime._initialize.__func__

    def busy(cls, *_args, **_kwargs):
        raise Timeout("bootstrap")

    monkeypatch.setattr(StorageRuntime, "_initialize", classmethod(busy))
    with pytest.raises(StorageError) as exc:
        StorageRuntime.initialize(root, {})
    assert exc.value.code == "STORAGE_BUSY"
    assert not (root / "database" / "assets.db").exists()

    monkeypatch.setattr(StorageRuntime, "_initialize", classmethod(original))
    first = StorageRuntime.initialize(root, {})
    identity = first.workspaces.instance_id
    first.close()
    again = StorageRuntime.initialize(root, {})
    try:
        assert again.workspaces.instance_id == identity
        assert again.ensure_layout()["created"] == []
    finally:
        again.close()
