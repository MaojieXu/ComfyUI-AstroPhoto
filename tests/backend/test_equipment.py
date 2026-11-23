import sqlite3
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
from threading import Barrier
from uuid import uuid4

import pytest
from sqlalchemy import event

from astrophoto.core.errors import StorageError
from astrophoto.database.equipment_models import Equipment, OpticalTrainDefault, OpticalTrainDraft, OpticalTrainRevision
from astrophoto.database.manager import SCHEMA
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.equipment import service as device_service
from astrophoto.storage.runtime import StorageRuntime


@pytest.fixture
def runtime(tmp_path):
    storage = StorageRuntime.initialize(tmp_path / "astrodata", {})
    try:
        yield storage
    finally:
        storage.operations.pool.shutdown(wait=True)


def create_device(runtime, kind="camera", **data):
    return runtime.equipment.create_equipment({"equipment_type": kind, "name": kind, **data})


def setup_train(runtime, accessory_ids=None, filter_ids=None, *, name="Deep sky", suffix=""):
    camera = create_device(runtime, "camera", name="Old camera" + suffix, specs={"sensor_kind": "mono"})
    optics = create_device(runtime, "primary_optics", name="primary_optics" + suffix,
                           specs={"aperture_mm": 80, "native_focal_length_mm": 480})
    body = {"name": name, "camera_id": camera["id"], "primary_optics_id": optics["id"],
            "accessory_ids": accessory_ids or [], "filter_ids": filter_ids or [],
            "optical_state": {"rotation_deg": 7.5, "flat_validity_note": "Recheck"}}
    return camera, runtime.optical_trains.create_train({"name": body["name"], "draft": body})


@pytest.mark.parametrize(("kind", "specs"), [
    ("camera", {"sensor_kind": "osc", "cooling_supported": False, "pixel_size_x_um": 3.76,
                "readout_modes": [{"mode_key": "slow", "display_name": "Slow", "gain_min": 0, "gain_max": 600}]}),
    ("primary_optics", {"optics_kind": "lens", "native_focal_length_mm": 135}),
    ("optical_accessory", {"accessory_kind": "flattener", "design_backfocus_mm": 0}),
    ("filter", {"filter_kind": "dual_band", "passbands": [{"band_label": "Ha", "center_nm": 656.3},
                                                          {"band_label": "OIII", "fwhm_nm": 3}]}),
])
def test_equipment_lifecycle_and_optional_specs(runtime, kind, specs):
    api = runtime.equipment
    initial = create_device(runtime, kind, name="Baseline")
    chosen = create_device(runtime, kind, name="α Camera", manufacturer="Example", model="M-100%", specs=specs)
    assert initial["id"] != chosen["id"]
    assert api.get_equipment(chosen["id"]) == chosen
    assert api.list_equipment(kind=kind, q="m-100%")["items"][0]["id"] == chosen["id"]
    assert api.list_equipment(q="Α camera")["items"][0]["id"] == chosen["id"]
    if kind == "filter":
        assert [band["band_label"] for band in chosen["specs"]["passbands"]] == ["Ha", "OIII"]
        assert chosen["specs"]["passbands"][0]["fwhm_nm"] is None
        first, second = chosen["specs"]["passbands"]
        replacement = api.update_equipment(chosen["id"], {"expected_version": 1, "specs": {"passbands": [second, first]}})
        assert [band["id"] for band in replacement["specs"]["passbands"]] == [second["id"], first["id"]]
        chosen = replacement
    if kind == "camera":
        assert initial["specs"]["cooling_supported"] is None and chosen["specs"]["cooling_supported"] is False
        assert chosen["specs"]["readout_modes"][0]["gain_min"] == 0
    form = {key: chosen[key] for key in ("manufacturer", "model", "notes", "specs")}
    updated = api.update_equipment(chosen["id"], {**form, "expected_version": chosen["row_version"], "name": "Updated"})
    with pytest.raises(StorageError, match="EQUIPMENT_VERSION_CONFLICT"):
        api.update_equipment(chosen["id"], {"expected_version": chosen["row_version"], "name": "Stale"})
    archived = api.set_archived(chosen["id"], updated["row_version"], True)
    assert archived["archived_at_utc"]
    assert api.list_equipment(archived="true")["items"][0]["id"] == chosen["id"]
    restored = api.set_archived(chosen["id"], archived["row_version"], False)
    assert restored["archived_at_utc"] is None
    api.delete_unused_equipment(chosen["id"], restored["row_version"])
    with pytest.raises(StorageError, match="EQUIPMENT_NOT_FOUND"):
        api.get_equipment(chosen["id"])


@pytest.mark.parametrize(("kind", "specs", "field"), [
    ("camera", {"center_nm": 30}, "specs.center_nm"),
    ("camera", {"adc_bit_depth": 2.5}, "specs.adc_bit_depth"),
    ("camera", {"pixel_size_x_um": float("inf")}, "specs.pixel_size_x_um"),
    ("primary_optics", {"native_focal_length_mm": 0}, "specs.native_focal_length_mm"),
    ("camera", {"cooling_supported": 1}, "specs.cooling_supported"),
    ("filter", {"passbands": [{"band_label": "Ha"}, {"band_label": "ha"}]}, "specs.passbands.1.band_label"),
])
def test_invalid_fields_never_persist(runtime, kind, specs, field):
    with pytest.raises(StorageError) as rejected:
        create_device(runtime, kind, specs=specs)
    assert rejected.value.details["fields"][field]
    assert runtime.equipment.list_equipment()["items"] == []


def test_pagination_same_model_and_rollback(runtime, monkeypatch):
    api = runtime.equipment
    devices = [create_device(runtime, name=f"Camera {index}", model="Same model") for index in range(3)]
    names = {device["id"]: device["name"] for device in devices}
    ids = sorted(names)
    result = api.list_equipment(limit=2)
    assert [item["id"] for item in result["items"]] == ids[:2]
    assert result["next"] == ids[1]
    assert [item["id"] for item in api.list_equipment(limit=2, after=result["next"])["items"]] == ids[2:]
    persist = device_service.persist_specs

    def interrupted(*args, **kwargs):
        persist(*args, **kwargs)
        raise RuntimeError("injected after specification write")

    monkeypatch.setattr(device_service, "persist_specs", interrupted)
    with pytest.raises(RuntimeError, match="injected"):
        create_device(runtime, "filter", specs={"passbands": [{"band_label": "OIII"}]})
    with pytest.raises(RuntimeError, match="injected"):
        api.update_equipment(ids[0], {"expected_version": 1, "name": "Uncommitted"})
    assert api.get_equipment(ids[0])["name"] == names[ids[0]]
    with closing(sqlite3.connect(runtime.db.path)) as conn:
        assert conn.execute("SELECT COUNT(*) FROM filter_passbands").fetchone() == (0,)


def test_database_constraints_and_incompatible_same_version(runtime):
    ident = create_device(runtime, "filter")["id"]
    with runtime.db.engine.begin() as conn:
        assert conn.exec_driver_sql("PRAGMA quick_check").scalar() == "ok"
        assert conn.exec_driver_sql("PRAGMA foreign_key_check").all() == []
    with closing(sqlite3.connect(runtime.db.path)) as conn:
        conn.execute("PRAGMA foreign_keys=ON")
        with pytest.raises(sqlite3.IntegrityError, match="EQUIPMENT_TYPE_MISMATCH"):
            conn.execute("INSERT INTO camera_specs (equipment_id) VALUES (?)", (ident,))
        with pytest.raises(sqlite3.IntegrityError, match="FOREIGN KEY"):
            conn.execute("INSERT INTO filter_passbands (id,filter_id,position,band_label) VALUES ('x','missing',0,'Ha')")
        conn.execute("DROP TRIGGER immutable_train_revision_update")
        conn.commit()
    with pytest.raises(StorageError, match="DEV_SCHEMA_RESET_REQUIRED"):
        runtime.db.health()
    with pytest.raises(StorageError, match="DEV_SCHEMA_RESET_REQUIRED"):
        StorageRuntime.initialize(runtime.root, {})


def test_incomplete_configuration_and_reference_validation(runtime):
    api = runtime.optical_trains
    train = api.create_train({"name": "Incomplete", "draft": {"name": "Incomplete"}})
    assert train["status"] == "draft"
    band = create_device(runtime, "filter")
    with pytest.raises(StorageError, match="EQUIPMENT_TYPE_MISMATCH"):
        api.save_draft(train["id"], {"expected_draft_version": train["draft"]["draft_version"],
                                    "draft": {"name": "Bad", "camera_id": band["id"]}})
    assert api.get_train(train["id"])["configuration"] == train["configuration"]
    assert api.list_revisions(train["id"]) == {"items": []}


def test_names_are_unique_per_list_and_legacy_duplicates_can_be_edited(runtime):
    equipment = runtime.equipment
    trains = runtime.optical_trains
    first = create_device(runtime, name="Café")
    old = create_device(runtime, name="Old duplicate")
    with runtime.db.session(transaction="write") as session:
        session.get(Equipment, old["id"]).name = "CAFE\u0301"
    edited = equipment.update_equipment(old["id"], {"expected_version": 1, "name": "CAFÉ", "notes": "Retained"})
    assert edited["notes"] == "Retained"
    equipment.set_archived(first["id"], 1, True)
    other = create_device(runtime, name="Other")

    with pytest.raises(StorageError) as duplicate:
        create_device(runtime, "filter", name="\u3000cafe\u0301 ")
    assert duplicate.value.details == {"fields": {"name": "duplicate"}}
    with pytest.raises(StorageError) as duplicate:
        equipment.update_equipment(other["id"], {"expected_version": 1, "name": "CAFÉ"})
    assert duplicate.value.details == {"fields": {"name": "duplicate"}}
    assert equipment.get_equipment(other["id"]) == other

    trains.create_train({"name": "CAFÉ"})
    group = trains.create_train({"name": "Another"})
    for create_duplicate in (
        lambda: trains.create_train({"name": "cafe\u0301"}),
        lambda: trains.create_train({"name": "Unused", "draft": {"name": "CAFÉ"}}),
        lambda: trains.save_draft(group["id"], {"expected_draft_version": None, "draft": {"name": "CAFÉ"}}),
    ):
        with pytest.raises(StorageError) as duplicate:
            create_duplicate()
        assert duplicate.value.details == {"fields": {"name": "duplicate"}}
    assert trains.get_train(group["id"]) == group


def test_concurrent_duplicate_device_writes_keep_one_record(runtime):
    barrier = Barrier(2)

    def create():
        barrier.wait()
        try:
            return create_device(runtime, name="Shared name")
        except StorageError as exc:
            assert exc.details == {"fields": {"name": "duplicate"}}
            return None

    with ThreadPoolExecutor(2) as pool:
        attempts = [pool.submit(create) for _ in range(2)]
        items = [attempt.result(timeout=5) for attempt in attempts]
    assert items.count(None) == 1
    assert [item["id"] for item in runtime.equipment.list_equipment()["items"]] == [
        item["id"] for item in items if item is not None
    ]


def test_archived_components_can_be_retained_or_removed_but_cannot_be_added(runtime):
    api = runtime.optical_trains
    camera, train = setup_train(runtime)
    runtime.equipment.set_archived(camera["id"], camera["row_version"], True)
    configuration = train["configuration"]
    data = configuration["draft"]

    with pytest.raises(StorageError) as archived:
        api.create_train({"name": "Second", "draft": {**data, "name": "Second"}})
    assert archived.value.details == {"fields": {"camera_id": "archived_equipment"}}
    assert api.list_trains()["total"] == 1

    retained = api.save_draft(train["id"], {"expected_draft_version": configuration["draft_version"], "draft": data})
    removed = api.save_draft(train["id"], {"expected_draft_version": retained["draft_version"],
                                          "draft": {**data, "camera_id": None}})
    with pytest.raises(StorageError) as archived:
        api.save_draft(train["id"], {"expected_draft_version": removed["draft_version"], "draft": data})
    assert archived.value.details == {"fields": {"camera_id": "archived_equipment"}}
    assert api.get_train(train["id"])["configuration"] == removed


def test_single_configuration_concurrent_save_and_live_specs(runtime):
    api = runtime.optical_trains
    first = create_device(runtime, "optical_accessory", name="Reducer")
    second = create_device(runtime, "optical_accessory", name="Barlow")
    band = create_device(runtime, "filter")
    camera, train = setup_train(runtime, [first["id"], second["id"]], [band["id"]])
    ident = train["id"]
    assert api.list_trains(q="old camera", status="published")["items"][0]["id"] == ident
    runtime.equipment.update_equipment(camera["id"], {"expected_version": 1, "name": "New camera"})
    assert api.get_train(ident)["summary"]["camera"] == "New camera"
    data = train["configuration"]["draft"]
    command = {"draft": {**data, "accessory_ids": [second["id"], first["id"]]},
               "expected_draft_version": train["configuration"]["draft_version"]}
    barrier = Barrier(2)

    def save():
        barrier.wait()
        try:
            return api.save_draft(ident, command)
        except StorageError as exc:
            return exc.code

    with ThreadPoolExecutor(2) as pool:
        threads = [pool.submit(save) for _ in range(2)]
        results = [thread.result(timeout=5) for thread in threads]
    assert results.count("DRAFT_VERSION_CONFLICT") == 1
    current = api.get_train(ident)
    assert current["summary"]["accessories"] == ["Barlow", "Reducer"]
    assert api.list_trains(q="Barlow", status="published")["items"][0]["id"] == ident
    assert api.list_revisions(ident) == {"items": []}
    assert len([device for device in current["components"] if device["name"] == "New camera"]) == 1
    with pytest.raises(StorageError, match="EQUIPMENT_REFERENCED"):
        runtime.equipment.delete_unused_equipment(camera["id"], 2)
    reopened = StorageRuntime.initialize(runtime.root, {})
    try:
        assert reopened.db.health()["schema"] == SCHEMA
        assert reopened.optical_trains.get_train(ident)["configuration"] == current["configuration"]
    finally:
        reopened.operations.pool.shutdown(wait=True)


def seed_legacy_revisions(runtime, train):
    ident = train["id"]
    data = train["configuration"]["draft"]
    revisions = [str(uuid4()), str(uuid4())]
    with runtime.db.session(transaction="write") as session:
        session.delete(session.get(OpticalTrainDraft, ident))
        for number, revision in enumerate(revisions, start=1):
            snapshot = {"snapshot_version": 1, "train_id": ident, "name_at_publish": train["name"], "notes": None,
                        "camera": {"equipment_id": data["camera_id"], "equipment_type": "camera"},
                        "primary_optics": {"equipment_id": data["primary_optics_id"], "equipment_type": "primary_optics"},
                        "accessories": [], "filters": [], "optical_state": {**data["optical_state"], "rotation_deg": number}}
            session.add(OpticalTrainRevision(
                id=revision, train_id=ident, revision_number=number, snapshot_json=snapshot,
                base_revision_id=revisions[number - 2] if number > 1 else None,
                published_at_utc=train["updated_at_utc"], idempotency_key=str(uuid4()), published_draft_version=number,
            ))
        session.flush()
        session.add(OpticalTrainDefault(train_id=ident, revision_id=revisions[0]))
    return revisions


def test_existing_default_loads_without_rewriting_legacy_history(runtime):
    api = runtime.optical_trains
    camera, train = setup_train(runtime)
    ident = train["id"]
    revisions = seed_legacy_revisions(runtime, train)
    runtime.equipment.set_archived(camera["id"], camera["row_version"], True)
    existing = api.get_train(ident)["configuration"]
    assert existing["draft"]["optical_state"]["rotation_deg"] == 1
    assert existing["draft_version"] is None
    assert api.list_trains(q="Old camera", status="published")["items"][0]["id"] == ident
    api.save_draft(ident, {"draft": dict(existing["draft"], name="Updated"), "expected_draft_version": None})
    assert api.get_train(ident)["configuration"]["draft"]["name"] == "Updated"
    assert [row["id"] for row in api.list_revisions(ident)["items"]] == revisions[::-1]
    with closing(sqlite3.connect(runtime.db.path)) as conn:
        for statement in ("UPDATE optical_train_revisions SET change_summary='edited'",
                          "DELETE FROM optical_train_revisions",
                          "INSERT OR REPLACE INTO optical_train_revisions SELECT * FROM optical_train_revisions"):
            with pytest.raises(sqlite3.IntegrityError, match="PUBLISHED_REVISION_IMMUTABLE"):
                conn.execute(statement)
    current = api.get_train(ident)
    with pytest.raises(StorageError, match="REVISION_CONFLICT"):
        api.delete_train(ident, current["row_version"] - 1)
    api.delete_train(ident, current["row_version"])
    deleted = api.get_train(ident)
    assert deleted["status"] == "deleted"
    assert deleted["configuration"] == current["configuration"]
    assert [row["id"] for row in api.list_revisions(ident)["items"]] == revisions[::-1]
    assert api.get_revision(ident, revisions[0])["snapshot"]["camera"]["equipment_id"] == camera["id"]
    with pytest.raises(StorageError, match="EQUIPMENT_REFERENCED"):
        runtime.equipment.delete_unused_equipment(camera["id"], camera["row_version"] + 1)
    assert runtime.db.health()["schema"] == SCHEMA


def test_train_tombstone_rolls_back_and_preserves_historical_asset_links(runtime):
    api = runtime.optical_trains
    camera, target = setup_train(runtime)
    _, other = setup_train(runtime, name="Other combination", suffix=" 2")
    revisions = seed_legacy_revisions(runtime, target)
    other_revisions = seed_legacy_revisions(runtime, other)
    before = api.get_train(target["id"])
    api.save_draft(target["id"], {"draft": before["configuration"]["draft"], "expected_draft_version": None})
    before = api.get_train(target["id"])
    version = before["row_version"]

    asset_id = str(uuid4())
    with runtime.db.session(transaction="write") as session:
        session.add(Asset(id=asset_id, name="R.fit", size_bytes=1, mtime_ns=0))
        session.flush()
        session.add(AssetLocation(id=asset_id, asset_id=asset_id, storage_mode="managed",
                                  workspace_id=runtime.initial_workspace_id, relative_key="objects/R.fit"))
        runtime.library.finish_import(session, asset_id, {"optical_train_id": target["id"]}, None)

    def fail_after_tombstone(_conn, _cursor, statement, *_args):
        if statement.startswith("UPDATE optical_trains SET ") and "deleted_at_utc=" in statement:
            raise RuntimeError("injected after tombstone")

    event.listen(runtime.db.engine, "after_cursor_execute", fail_after_tombstone)
    try:
        with pytest.raises(RuntimeError, match="injected after tombstone"):
            api.delete_train(target["id"], version)
    finally:
        event.remove(runtime.db.engine, "after_cursor_execute", fail_after_tombstone)

    assert api.get_train(target["id"]) == before
    assert [row["id"] for row in api.list_revisions(target["id"])["items"]] == revisions[::-1]
    assert runtime.db.health()["schema"] == SCHEMA
    with closing(sqlite3.connect(runtime.db.path)) as conn:
        with pytest.raises(sqlite3.IntegrityError, match="PUBLISHED_REVISION_IMMUTABLE"):
            conn.execute("DELETE FROM optical_train_revisions WHERE train_id = ?", (target["id"],))

    api.delete_train(target["id"], version)
    tombstone = api.get_train(target["id"])
    assert tombstone["status"] == "deleted"
    with pytest.raises(StorageError, match="REVISION_CONFLICT"):
        api.delete_train(target["id"], version - 1)
    api.delete_train(target["id"], tombstone["row_version"] - 1)
    assert tombstone["configuration"] == before["configuration"]
    assert all(row["id"] != target["id"] for row in api.list_trains(archived="all")["items"])
    replacement = api.create_train({"name": target["name"]})
    assert replacement["id"] != target["id"]
    historical = runtime.library.get("assets", asset_id)
    assert historical["attributes"]["optical_train_id"] == target["id"]
    updated = runtime.library.write("assets", {"revision": historical["revision"], "attributes": {"filter": "Ha"}}, asset_id)
    assert updated["attributes"]["optical_train_id"] == target["id"]
    with pytest.raises(StorageError, match="INVALID_LIBRARY_REFERENCE"):
        runtime.library.validate_import({"optical_train_id": target["id"]}, None)
    with pytest.raises(StorageError, match="TRAIN_NOT_FOUND"):
        api.set_archived(target["id"], tombstone["row_version"], False)
    with pytest.raises(StorageError, match="TRAIN_NOT_FOUND"):
        api.save_draft(target["id"], {"draft": before["draft"]["draft"], "expected_draft_version": before["draft"]["draft_version"]})
    assert [row["id"] for row in api.list_revisions(other["id"])["items"]] == other_revisions[::-1]
    assert api.get_train(other["id"])["default_revision"]["id"] == other_revisions[0]
    assert runtime.equipment.get_equipment(camera["id"])["usage_summary"][0]["train_id"] == target["id"]
    with runtime.db.engine.connect() as conn:
        assert conn.exec_driver_sql("PRAGMA foreign_key_check").all() == []
    assert runtime.db.health()["schema"] == SCHEMA
