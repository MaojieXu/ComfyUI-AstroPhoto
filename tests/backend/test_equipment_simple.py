import pytest
from uuid import uuid4

from astrophoto.core.errors import StorageError
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.runtime import StorageRuntime


@pytest.fixture
def runtime(tmp_path):
    storage = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        yield storage
    finally:
        storage.operations.pool.shutdown(wait=True)


def test_single_record_configuration_and_references(runtime):
    kinds = ("camera", "primary_optics", "optical_accessory", "filter", "other")
    devices = [runtime.equipment.create_equipment({
        "equipment_type": kind, "name": kind, "product_name": "Same product",
    }) for kind in kinds]
    train = runtime.optical_trains.create_train({
        "name": "Test", "camera_id": devices[0]["id"], "primary_optics_id": devices[1]["id"],
        "accessory_id": devices[2]["id"], "filter_ids": [devices[3]["id"]], "other_ids": [devices[4]["id"]],
    })
    assert train["accessory_id"] == devices[2]["id"]
    assert train["summary"]["others"] == ["other"]
    assert runtime.optical_trains.list_trains(q="camera")["items"][0]["id"] == train["id"]
    assert runtime.optical_trains.list_trains(q="filter")["items"][0]["id"] == train["id"]
    assert runtime.equipment.get_equipment(devices[4]["id"])["usage_summary"]
    with pytest.raises(StorageError):
        runtime.equipment.delete_unused_equipment(devices[4]["id"], devices[4]["row_version"])
    updated = runtime.optical_trains.update_train(train["id"], {
        "name": "Changed", "expected_version": train["row_version"], "other_ids": [devices[4]["id"]],
    })
    assert updated["name"] == "Changed" and updated["other_ids"] == [devices[4]["id"]]
    with pytest.raises(StorageError):
        runtime.optical_trains.update_train(train["id"], {"name": "Stale", "expected_version": train["row_version"]})
    with pytest.raises(StorageError):
        runtime.optical_trains.create_train({"name": "Bad", "accessory_id": devices[0]["id"]})
    asset_id = str(uuid4())
    with runtime.db.session(transaction="write") as session:
        session.add(Asset(id=asset_id, name="test.fit", size_bytes=1, mtime_ns=0))
        session.flush()
        session.add(AssetLocation(id=asset_id, asset_id=asset_id, storage_mode="managed",
                                  workspace_id=runtime.initial_workspace_id, relative_key="objects/test.fit"))
        runtime.library.finish_import(session, asset_id, {"optical_train_id": train["id"]})
    runtime.optical_trains.delete_train(train["id"], updated["row_version"])
    assert runtime.optical_trains.list_trains()["items"] == []
    assert runtime.optical_trains.get_train(train["id"])["status"] == "deleted"
    assert runtime.library.get("assets", asset_id)["attributes"]["optical_train_id"] == train["id"]
    with pytest.raises(StorageError):
        runtime.library.validate_import({"optical_train_id": train["id"]})


def test_names_are_unique_across_create_rename_and_archive(runtime):
    devices = runtime.equipment
    trains = runtime.optical_trains
    first = devices.create_equipment({"equipment_type": "camera", "name": "Camera", "product_name": "P"})
    second = devices.create_equipment({"equipment_type": "other", "name": "Other", "product_name": "P"})
    devices.set_archived(first["id"], first["row_version"], True)
    with pytest.raises(StorageError) as error:
        devices.update_equipment(second["id"], {"expected_version": second["row_version"], "name": " camera "})
    assert error.value.details == {"fields": {"name": "duplicate"}}
    with pytest.raises(StorageError):
        devices.create_equipment({"equipment_type": "filter", "name": "CAMERA", "product_name": "P"})

    first_train = trains.create_train({"name": "Group"})
    second_train = trains.create_train({"name": "Another"})
    first_train = trains.set_archived(first_train["id"], first_train["row_version"], True)
    with pytest.raises(StorageError) as error:
        trains.update_train(second_train["id"], {"name": " group ", "expected_version": second_train["row_version"]})
    assert error.value.details == {"fields": {"name": "duplicate"}}
    with pytest.raises(StorageError):
        trains.create_train({"name": "GROUP"})
    trains.delete_train(first_train["id"], first_train["row_version"])
    assert trains.create_train({"name": "Group"})["name"] == "Group"


def test_sorted_equipment_and_train_cursor(runtime):
    for name in ['Bravo', 'Alpha', 'Charlie']:
        runtime.equipment.create_equipment({'equipment_type': 'camera', 'name': name, 'product_name': name})
        runtime.optical_trains.create_train({'name': name})
    for list_items in (runtime.equipment.list_equipment, runtime.optical_trains.list_trains):
        first = list_items(sort='name_asc', limit=2)
        second = list_items(sort='name_asc', limit=2, after=first['next'])
        assert [r['name'] for r in first['items'] + second['items']] == ['Alpha', 'Bravo', 'Charlie']
        assert second['next'] is None
        reverse = list_items(sort='name_desc', limit=2)
        assert [r['name'] for r in reverse['items']] == ['Charlie', 'Bravo']
        with pytest.raises(StorageError):
            list_items(sort='name_desc', after=first['next'])
