from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import delete

from astrophoto.assets.import_groups import create_group, link_frame
from astrophoto.database.equipment_models import OpticalTrain
from astrophoto.database.manager import DatabaseManager, GROUPS_SCHEMA, PHOTOGRAPHY_SCHEMA, SCHEMA
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
            "INSERT INTO optical_trains VALUES ('train', 'Group', NULL, NULL, 1, 'created', 'updated')")
        connection.commit()
    manager.initialize("existing", creating=False)
    assert manager.health()["schema"] == SCHEMA
    with manager.session() as session:
        assert session.get(AssetLocation, "a1").relative_key == "objects/frame/light.fit"
        assert session.get(OpticalTrain, "train").deleted_at_utc is None
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
            for index, asset_id in enumerate(ids):
                session.add(Asset(id=asset_id, name=f"Light_{index}.fit", size_bytes=1, mtime_ns=10))
                session.flush()
                session.add(AssetLocation(id=asset_id, asset_id=asset_id, storage_mode="managed",
                                          workspace_id=second if index == 2 else first, relative_key=f"{index}.fit"))
                if index < 3:
                    link_frame(session, asset_id, group, index)
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
