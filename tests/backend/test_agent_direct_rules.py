from uuid import uuid4

from sqlalchemy import select

from astrophoto.database.catalog_models import Project, ProjectNode
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.runtime import StorageRuntime
from astrophoto.assets import projects


def test_deleting_equipment_unlinks_group_and_preserves_other_members(tmp_path):
    runtime = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        camera = runtime.equipment.create_equipment({"equipment_type": "camera", "name": "Camera", "product_name": "P"})
        optics = runtime.equipment.create_equipment({"equipment_type": "primary_optics", "name": "Lens", "product_name": "P"})
        group = runtime.optical_trains.create_train({"name": "Group", "camera_id": camera["id"], "primary_optics_id": optics["id"]})
        runtime.equipment.delete_unused_equipment(camera["id"])
        result = runtime.optical_trains.get_train(group["id"])
        assert result["camera_id"] is None
        assert result["primary_optics_id"] == optics["id"]
    finally:
        runtime.operations.pool.shutdown(wait=True)


def test_unregister_asset_removes_project_reference_but_not_file(tmp_path):
    runtime = StorageRuntime.initialize(tmp_path / "data", {})
    source = tmp_path / "original.fit"
    source.write_bytes(b"original")
    try:
        asset_id = str(uuid4())
        project_id = str(uuid4())
        with runtime.db.session(transaction="write") as session:
            session.add(Asset(id=asset_id, name="original.fit", size_bytes=8, mtime_ns=0))
            session.flush()
            session.add(AssetLocation(id=str(uuid4()), asset_id=asset_id, storage_mode="external_reference", external_path=str(source), external_key=str(source)))
            session.add(Project(id=project_id, name="Project", name_key="project", created_at_utc="now", updated_at_utc="now"))
            session.flush()
            session.add(ProjectNode(id=str(uuid4()), project_id=project_id, name="original", name_key="original", kind="image_result", resource_id=asset_id))
        runtime.library.remove("assets", asset_id, {})
        with runtime.db.session(transaction="read") as session:
            assert session.get(Project, project_id) is not None
            assert session.scalars(select(ProjectNode).where(ProjectNode.project_id == project_id)).all() == []
        assert source.read_bytes() == b"original"
    finally:
        runtime.operations.pool.shutdown(wait=True)


def test_successive_equipment_updates_preserve_other_fields(tmp_path):
    runtime = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        device = runtime.equipment.create_equipment({"equipment_type": "camera", "name": "Original", "product_name": "P"})
        runtime.equipment.update_equipment(device["id"], {"name": "Renamed"})
        result = runtime.equipment.update_equipment(device["id"], {"notes": "Updated"})
        assert result["name"] == "Renamed"
        assert result["notes"] == "Updated"
    finally:
        runtime.operations.pool.shutdown(wait=True)


def test_project_delete_removes_tree_without_deleting_asset(tmp_path):
    runtime = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        asset_id = str(uuid4())
        project_id = str(uuid4())
        with runtime.db.session(transaction="write") as session:
            session.add(Asset(id=asset_id, name="original.fit", size_bytes=8, mtime_ns=0))
            session.add(Project(id=project_id, name="Project", name_key="project", created_at_utc="now", updated_at_utc="now"))
            session.flush()
            session.add(ProjectNode(id=str(uuid4()), project_id=project_id, name="original", name_key="original", kind="image_result", resource_id=asset_id))
        with runtime.db.session(transaction="write") as session:
            result = projects.remove(session, session.get(Project, project_id))
            assert result["deleted"]
        with runtime.db.session(transaction="read") as session:
            assert session.get(Project, project_id) is None
            assert session.get(Asset, asset_id) is not None
            assert not session.scalars(select(ProjectNode).where(ProjectNode.project_id == project_id)).all()
    finally:
        runtime.operations.pool.shutdown(wait=True)


def test_image_result_role_must_be_explicit():
    import pytest

    from astrophoto.assets.catalog import result_type_from_attributes
    from astrophoto.core.errors import StorageError

    assert result_type_from_attributes({"role": "processed"}) == "image_result"
    assert result_type_from_attributes({"role": "master_frame"}) == "master_frame"
    for value in (None, {}, {"role": "unknown"}):
        with pytest.raises(StorageError) as error:
            result_type_from_attributes(value)
        assert error.value.code == "RECOVERY_REQUIRED"
