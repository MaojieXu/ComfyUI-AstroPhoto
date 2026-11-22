"""Regression coverage for storage review findings R-01 through R-05."""

import shutil
import time

import pytest

from astrophoto.core.config import load_storage_settings
from astrophoto.core.errors import StorageError
from astrophoto.database.models import StorageOperation
from astrophoto.storage import data_root
from astrophoto.storage.data_root import DataRoots
from astrophoto.storage.initializer import TRANSFER_MARKER
from astrophoto.storage.runtime import StorageRuntime


def wait(service, operation_id, kind="import"):
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        status = service.operations.status(operation_id, kind)
        if status["phase"] in {"completed", "cancelled", "failed"} or status["error"]:
            return status
        time.sleep(0.025)
    raise AssertionError(status)


def copied_asset(service, tmp_path, name="a.fit"):
    source = tmp_path / "capture" / name
    source.parent.mkdir(parents=True, exist_ok=True)
    source.write_bytes(f"FITS payload {name}".encode())
    job = service.imports.import_assets({"sources": [str(source)], "import_mode_override": "copy",
                                        "idempotency_key": name})
    assert wait(service, job)["phase"] == "completed"
    asset = next(row for row in service.assets.list()["assets"] if row["name"] == name)
    return asset["id"], service.assets.resolve_asset(asset["id"])


def test_r01_cleanup_verifies_target_before_reporting_cleared(tmp_path, monkeypatch):
    service = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        workspace = load_storage_settings(service.root)["workspace"]["default_workspace_id"]
        asset, managed = copied_asset(service, tmp_path)
        content = managed.read_bytes()
        relative = managed.relative_to(service.root / "storage" / workspace)
        target = tmp_path / "target"
        def interrupt_cleanup(*_args):
            raise StorageError("RECOVERY_REQUIRED")

        with monkeypatch.context() as patch:
            patch.setattr(service.migrations, "_complete", interrupt_cleanup)
            operation = service.migrations.start({"workspace_id": workspace, "target_path": str(target),
                                                  "idempotency_key": "r01"})
            interrupted = wait(service, operation, "migration")
            assert interrupted["phase"] == "committed" and interrupted["error"]["code"] == "RECOVERY_REQUIRED"

        source_root = tmp_path / "data" / "storage" / workspace
        shutil.rmtree(source_root)
        migrated = target / relative
        migrated.unlink()
        for damaged in (None, b"x" * len(content)):
            if damaged is not None:
                migrated.write_bytes(damaged)
            service.operations.retry(operation, "migration")
            result = wait(service, operation, "migration")
            assert result["phase"] == "committed" and result["error"]["code"] == "SOURCE_CLEANUP_PENDING"
            assert result["receipt"]["cleanup_remaining"] == [relative.as_posix()]
            assert result["receipt"]["cleared"] == 0
            assert service.workspaces.get(workspace).root_path == str(target)
        migrated.write_bytes(content)
        service.operations.retry(operation, "migration")
        result = wait(service, operation, "migration")
        assert result["phase"] == "completed" and result["error"] is None
        assert result["receipt"]["cleared"] == 1 and result["receipt"]["cleanup_remaining"] == []
        assert service.assets.resolve_asset(asset).read_bytes() == content and not source_root.exists()
    finally:
        service.close()


def test_r02_validate_reports_registered_files_that_are_missing(tmp_path):
    service = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        workspace = load_storage_settings(service.root)["workspace"]["default_workspace_id"]
        asset, managed = copied_asset(service, tmp_path)
        kept, kept_path = copied_asset(service, tmp_path, "kept.fit")
        kept_content = kept_path.read_bytes()
        content = managed.read_bytes()
        relative = managed.relative_to(service.root / "storage" / workspace).as_posix()
        managed.unlink()
        for view in (service.workspaces.validate(workspace), service.snapshot("test")["workspaces"][0]):
            assert view["status"] == "partial" and view["missing_count"] == 1, view
            assert view["missing"] == [{"asset_id": asset, "relative_key": relative}]
        assert service.assets.resolve_asset(kept).read_bytes() == kept_content
        _, new = copied_asset(service, tmp_path, "new.fit")
        assert new.is_file()
        managed.write_bytes(content)
        view = service.workspaces.validate(workspace)
        assert view["status"] == "online" and view["missing_count"] == 0 and view["missing"] == []
    finally:
        service.close()


def test_r05_remove_blocks_the_target_of_an_active_migration(tmp_path):
    service = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        source = load_storage_settings(service.root)["workspace"]["default_workspace_id"]
        target = service.workspaces.register(str(tmp_path / "target"), "Target")
        with service.db.session() as session:
            session.add(StorageOperation(id="active-migration", kind="migration", key="synthetic", phase="copying",
                                         request={}, plan={"workspace_id": source, "target_workspace_id": target["id"]},
                                         receipt={}))
        with pytest.raises(StorageError, match="STORAGE_BUSY"):
            service.workspaces.remove(target["id"], target["revision"])
    finally:
        service.close()


def test_r04_data_root_preflight_reports_missing_registered_files(tmp_path):
    source, target = tmp_path / "old", tmp_path / "new"
    roots = DataRoots(source)
    service = roots.open(source, lambda path: StorageRuntime.initialize(path, {}))
    try:
        asset, managed = copied_asset(service, tmp_path)
        workspace = load_storage_settings(service.root)["workspace"]["default_workspace_id"]
    finally:
        service.close()
    managed.unlink()
    expected = {"workspace_id": workspace, "path": str(source / "storage" / workspace), "missing_count": 1,
                "missing": [{"asset_id": asset, "relative_key": managed.relative_to(source / "storage" / workspace).as_posix()}]}
    before = roots.catalog.read_bytes()
    for action in (roots.plan, roots.move):
        with pytest.raises(StorageError) as error:
            action(source, target)
        assert error.value.code == "WORKSPACE_FILES_MISSING" and error.value.details == expected
        assert not target.exists() and roots.catalog.read_bytes() == before


def test_r03_offline_move_crash_before_catalog_update_stays_recoverable(tmp_path, monkeypatch):
    source, target = tmp_path / "old", tmp_path / "new"
    roots = DataRoots(source)
    def factory(path):
        return StorageRuntime.initialize(path, {})

    service = roots.open(source, factory)
    try:
        asset, managed = copied_asset(service, tmp_path)
        relative = managed.relative_to(source)
        content = managed.read_bytes()
    finally:
        service.close()
    before = roots.catalog.read_bytes()
    write = data_root.write_json_atomically

    def interrupt_switch(path, value, **options):
        if path == roots.catalog:
            assert (source / TRANSFER_MARKER).is_file() and (target / relative).read_bytes() == content
            raise OSError("interrupted before catalog replace")
        write(path, value, **options)

    with monkeypatch.context() as patch:
        patch.setattr(data_root, "write_json_atomically", interrupt_switch)
        with pytest.raises(OSError, match="before catalog replace"):
            roots.move(source, target)
    assert roots.catalog.read_bytes() == before
    with pytest.raises(StorageError, match="does not match its active instance"):
        DataRoots(target).open(target, factory)
    recovered = roots.open(source, factory)
    try:
        assert recovered.root == source and recovered.assets.resolve_asset(asset) == managed
        assert not (source / TRANSFER_MARKER).exists() and managed.read_bytes() == content
    finally:
        recovered.close()

    target = tmp_path / "rolled-back"
    roots.move(source, target)

    def interrupt_rollback(path):
        assert path == source and (source / TRANSFER_MARKER).is_file()
        raise OSError("interrupted after rollback catalog replace")

    with monkeypatch.context() as patch:
        patch.setattr(roots, "_clear_active_transfer_marker", interrupt_rollback)
        with pytest.raises(OSError, match="after rollback catalog replace"):
            roots.rollback(target)
    restored = roots.open(target, factory)
    try:
        assert restored.root == source and restored.data_root_receipt["rolled_back"]
        assert restored.assets.resolve_asset(asset).read_bytes() == content and (target / TRANSFER_MARKER).is_file()
    finally:
        restored.close()
