from uuid import uuid4

import pytest
from sqlalchemy import select

from astrophoto.assets import managed_rename
from astrophoto.database.catalog_models import CollectionDirectory, Subframe, SubframeCollection
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.runtime import StorageRuntime


@pytest.mark.parametrize("interrupted", [False, True])
@pytest.mark.parametrize("empty_workspace", [False, True])
def test_managed_group_directory_rename_and_recovery(tmp_path, monkeypatch, interrupted, empty_workspace):
    runtime = StorageRuntime.initialize(tmp_path / "data", {})
    second = runtime.workspaces.register(str(tmp_path / "second"), "Second")
    workspaces = (runtime.initial_workspace_id, second["id"])
    resource = str(uuid4())
    keys = ("objects/subframes/Original/one.fit", "objects/subframes/Original/two.fit")
    roots = [runtime.workspaces.require(workspace) for workspace in workspaces]
    with runtime.db.session() as session:
        session.add(SubframeCollection(id=resource, name="Original", frame_type="light",
                                       calibration_state="unknown", created_at_utc="", updated_at_utc=""))
        session.flush()
        for index, (workspace, root, key) in enumerate(zip(workspaces, roots, keys, strict=True)):
            source = root / key
            source.parent.mkdir(parents=True)
            source.write_bytes(b"frame")
            session.add(CollectionDirectory(workspace_id=workspace, collection_id=resource,
                                            relative_key=key.rpartition("/")[0]))
            if empty_workspace and index == 1:
                continue
            ident = str(uuid4())
            session.add(Asset(id=ident, name=source.name, size_bytes=5, mtime_ns=source.stat().st_mtime_ns))
            session.flush()
            session.add(AssetLocation(id=ident, asset_id=ident, storage_mode="managed", workspace_id=workspace,
                                      relative_key=key))
            session.add(Subframe(id=ident, collection_id=resource, frame_index=index))

    def rename():
        with managed_rename.catalog_edit(runtime, True) as (session, move):
            move(session, "subframe_collection", resource, "Renamed")
            session.get(SubframeCollection, resource).name = "Renamed"

    if interrupted:
        real_move = managed_rename._move
        moves = 0

        def interrupted_move(source, destination):
            nonlocal moves
            if moves == 0:
                real_move(source, destination)
                moves += 1
            raise KeyboardInterrupt

        with monkeypatch.context() as patch:
            patch.setattr(managed_rename, "_move", interrupted_move)
            with pytest.raises(KeyboardInterrupt):
                rename()
        managed_rename.recover_managed_renames(runtime)
    else:
        rename()
    expected = "Original" if interrupted else "Renamed"
    with runtime.db.session() as session:
        assert session.get(SubframeCollection, resource).name == expected
        assert {row.relative_key for row in session.scalars(select(AssetLocation))} == {
            key.replace("Original", expected) for key in (keys[:1] if empty_workspace else keys)
        }
        assert {row.relative_key for row in session.scalars(select(CollectionDirectory))} == {
            f"objects/subframes/{expected}"
        }
    for root, key in zip(roots, keys, strict=True):
        assert (root / key.replace("Original", expected)).read_bytes() == b"frame"
    assert not list((runtime.root / "runtime").glob("catalog-rename-*.json"))
    runtime.close()
