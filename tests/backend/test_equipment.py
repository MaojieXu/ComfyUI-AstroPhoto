from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

import pytest

from astrophoto.core.errors import StorageError
from astrophoto.storage.runtime import StorageRuntime


@pytest.fixture
def runtime(tmp_path):
    storage = StorageRuntime.initialize(tmp_path / "astrodata", {})
    try:
        yield storage
    finally:
        storage.operations.pool.shutdown(wait=True)


def test_concurrent_duplicate_device_writes_keep_one_record(runtime):
    barrier = Barrier(2)

    def create():
        barrier.wait()
        try:
            return runtime.equipment.create_equipment({
                "equipment_type": "camera", "name": "Shared name", "product_name": "Camera",
            })
        except StorageError as exc:
            assert exc.details == {"fields": {"name": "duplicate"}}
            return None

    with ThreadPoolExecutor(2) as pool:
        attempts = [pool.submit(create) for _ in range(2)]
        items = [attempt.result(timeout=5) for attempt in attempts]
    assert items.count(None) == 1
    assert runtime.equipment.list_equipment()["total"] == 1


def test_archived_component_can_be_retained_but_not_added(runtime):
    camera = runtime.equipment.create_equipment({"equipment_type": "camera", "name": "Camera", "product_name": "C"})
    train = runtime.optical_trains.create_train({"name": "Test", "camera_id": camera["id"]})
    runtime.equipment.set_archived(camera["id"], True)
    retained = runtime.optical_trains.update_train(train["id"], {
        "name": "Test", "camera_id": camera["id"],
    })
    assert retained["camera_id"] == camera["id"]
    removed = runtime.optical_trains.update_train(train["id"], {
        "name": "Test", "camera_id": None,
    })
    assert removed["camera_id"] is None
    with pytest.raises(StorageError):
        runtime.optical_trains.update_train(train["id"], {
            "name": "Test", "camera_id": camera["id"],
        })
