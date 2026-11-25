from uuid import uuid4

from sqlalchemy import delete

from astrophoto.assets.import_groups import create_group, link_frame
from astrophoto.database.catalog_models import Subframe, SubframeCollection
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.runtime import StorageRuntime


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
