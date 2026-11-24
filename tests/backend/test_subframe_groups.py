from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import delete

from astrophoto.assets.import_groups import create_group, link_frame
from astrophoto.database.catalog_models import Subframe, SubframeCollection
from astrophoto.database.equipment_models import OpticalTrain
from astrophoto.database.manager import DatabaseManager, DIRECTORIES_SCHEMA, GROUPS_SCHEMA, PHOTOGRAPHY_SCHEMA, SCHEMA
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.runtime import StorageRuntime


@pytest.mark.parametrize("revision", [PHOTOGRAPHY_SCHEMA, GROUPS_SCHEMA])
def test_existing_photography_library_upgrades_without_relocating_assets(tmp_path, revision):
    path = tmp_path / "assets.db"
    path.touch()
    manager = DatabaseManager(path)
    with manager.engine.connect() as connection:
        config = Config()
        config.set_main_option("script_location", "astrophoto/database/migrations")
        config.attributes["connection"] = connection
        command.upgrade(config, revision)
        connection.exec_driver_sql("INSERT INTO storage_identity VALUES (1, 'existing')")
        connection.exec_driver_sql("INSERT INTO assets VALUES ('frame', 'light.fit', 42, 0)")
        connection.exec_driver_sql("INSERT INTO storage_locations VALUES ('a', 'A', 'a', 'a', 1, 0)")
        connection.exec_driver_sql(
            "INSERT INTO asset_locations VALUES ('a1', 'frame', 'managed', NULL, NULL, 'a', 'objects/frame/light.fit')")
        connection.exec_driver_sql(
            "INSERT INTO optical_trains (id, name, filter_ids, other_ids, row_version, created_at_utc, updated_at_utc) "
            "VALUES ('train', 'Group', '[]', '[]', 1, 'created', 'updated')")
        connection.commit()
    manager.initialize("existing", creating=False)
    assert manager.health()["schema"] == SCHEMA
    with manager.session() as session:
        assert session.get(AssetLocation, "a1").relative_key == "objects/frame/light.fit"
        assert session.get(OpticalTrain, "train").archived_at_utc is None
    manager.engine.dispose()


def test_group_counts_follow_frame_membership_and_storage_location(tmp_path):
    runtime = StorageRuntime.initialize(tmp_path / "data", {})
    try:
        first = runtime.initial_workspace_id
        second = runtime.workspaces.register(tmp_path / "ssd", "Second")["id"]
        group = str(uuid4())
        ids = [str(uuid4()) for _ in range(4)]
        with runtime.db.session(transaction="write") as session:
            create_group(session, group, "M31_light_001.fit")
            session.add(SubframeCollection(id=group, name="M31", frame_type="light", calibration_state="unknown",
                                           created_at_utc="2026-01-01", updated_at_utc="2026-01-01"))
            session.flush()
            for index, asset_id in enumerate(ids):
                session.add(Asset(id=asset_id, name=f"Light_{index}.fit", size_bytes=1, mtime_ns=10))
                session.flush()
                session.add(AssetLocation(id=asset_id, asset_id=asset_id, storage_mode="managed",
                                          workspace_id=second if index == 2 else first, relative_key=f"{index}.fit"))
                if index < 3:
                    link_frame(session, asset_id, group, index)
                    session.add(Subframe(id=asset_id, collection_id=group, frame_index=index))
        summary, = runtime.library.list("import-groups", {})["items"]
        assert summary["count"] == 3
        assert {row["id"]: row["count"] for row in summary["workspaces"]} == {first: 2, second: 1}
        frames = runtime.library.list("assets", {"import_group_id": group})["items"]
        assert [row["id"] for row in frames] == ids[:3]
        assert [row["import_index"] for row in frames] == [0, 1, 2]
        assert [row["id"] for row in runtime.library.list("assets", {"import_group_id": "ungrouped"})["items"]] == ids[3:]
        with runtime.db.session(transaction="write") as session:
            session.get(AssetLocation, ids[2]).workspace_id = first
            session.execute(delete(AssetLocation).where(AssetLocation.asset_id == ids[0]))
            session.execute(delete(Asset).where(Asset.id == ids[0]))
        updated, = runtime.library.list("import-groups", {})["items"]
        assert updated["count"] == 2
        assert updated["workspaces"] == [{"id": first, "name": "Local", "count": 2}]
    finally:
        runtime.operations.pool.shutdown(wait=True)


def test_legacy_group_upgrade_preserves_membership_and_paths(tmp_path):
    path = tmp_path / "assets.db"
    path.touch()
    manager = DatabaseManager(path)
    group, member = str(uuid4()), str(uuid4())
    with manager.engine.begin() as connection:
        config = Config()
        config.set_main_option("script_location", "astrophoto/database/migrations")
        config.attributes["connection"] = connection
        command.upgrade(config, DIRECTORIES_SCHEMA)
        connection.exec_driver_sql("INSERT INTO storage_identity VALUES (1, 'existing')")
        connection.exec_driver_sql("INSERT INTO assets VALUES (?, 'frame.fit', 3, 0)", (member,))
        connection.exec_driver_sql("INSERT INTO library_records VALUES (?, 'import_group', 1, ?)", (group, '{"name":"Legacy"}'))
        connection.exec_driver_sql("INSERT INTO asset_import_frames VALUES (?, ?, 7)", (member, group))
        connection.exec_driver_sql(
            "INSERT INTO asset_locations VALUES (?, ?, 'external_reference', 'C:/frame.fit', 'C:/frame.fit', NULL, NULL)",
            (member, member),
        )
    for _ in range(2):
        manager.initialize("existing", creating=False)
        with manager.session() as session:
            assert session.get(SubframeCollection, group).frame_type == "unknown"
            assert session.get(Subframe, member).frame_index == 7
            assert session.get(Subframe, member).collection_id == group
            assert session.get(AssetLocation, member).external_path == "C:/frame.fit"
    manager.engine.dispose()
