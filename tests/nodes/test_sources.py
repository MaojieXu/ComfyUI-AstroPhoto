import os
from types import SimpleNamespace
from uuid import uuid4

import pytest


def test_registered_source_nodes_keep_order_and_fail_on_missing_member(extension, tmp_path):
    import importlib

    package = "astrophoto_extension_test.astrophoto"
    runtime_type = importlib.import_module(package + ".storage.runtime").StorageRuntime
    models = importlib.import_module(package + ".database.models")
    errors = importlib.import_module(package + ".core.errors")
    runtime = runtime_type.initialize(tmp_path / "node-data", {})
    asset_node, collection_node = extension.module.SOURCE_NODES[:2]
    asset_node.runtime = collection_node.runtime = SimpleNamespace(storage=runtime, trusted_local=True)
    paths = [tmp_path / "first.ser", tmp_path / "second.ser"]
    ids = [str(uuid4()), str(uuid4())]
    try:
        with runtime.db.session() as db:
            for path, asset_id in zip(paths, ids, strict=True):
                path.write_bytes(b"test bytes, not decoded by AstroPhoto")
                db.add(models.Asset(id=asset_id, name=path.name, size_bytes=path.stat().st_size,
                                    mtime_ns=path.stat().st_mtime_ns))
                db.flush()
                db.add(models.AssetLocation(id=asset_id, asset_id=asset_id, storage_mode="external_reference",
                                            external_path=str(path), external_key=os.path.normcase(str(path))))
        catalog = importlib.import_module(package + ".database.catalog_models")
        collection_id = str(uuid4())
        stamp = "2026-01-01T00:00:00Z"
        with runtime.db.session(transaction="write") as db:
            db.add(catalog.SubframeCollection(id=collection_id, name="SER series", frame_type="unknown",
                                              calibration_state="unknown", created_at_utc=stamp, updated_at_utc=stamp))
            db.flush()
            db.add_all(catalog.Subframe(id=asset_id, collection_id=collection_id, frame_index=index)
                       for index, asset_id in enumerate(reversed(ids)))
        assert asset_node.execute(ids[0]).result == (str(paths[0]), (str(paths[0]),))
        blocked, items = collection_node.execute(collection_id).result
        assert blocked.message
        assert items == tuple(str(path) for path in reversed(paths))
        folder = tmp_path / "frames"
        folder.mkdir()
        assert collection_node.execute(str(folder)).result == (str(folder), (str(folder),))
        assert asset_node.execute(str(paths[0])).result == (str(paths[0]), (str(paths[0]),))
        paths[1].unlink()
        with pytest.raises(errors.StorageError, match="SOURCE_NOT_FOUND"):
            collection_node.execute(collection_id)
    finally:
        runtime.close()
