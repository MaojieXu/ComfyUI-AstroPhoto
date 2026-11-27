from pathlib import Path

import pytest

from astrophoto.core.config import write_json_atomically
from astrophoto.core.errors import StorageError
from astrophoto.storage.aggregation import aggregate
from astrophoto.storage.runtime import StorageRuntime


def test_aggregate_copies_mixed_inputs_without_recursing_or_overwriting(tmp_path):
    first, second, destination = (tmp_path / name for name in ("first", "second", "work"))
    for folder in (first, second, destination):
        folder.mkdir()
    (first / "image.fit").write_bytes(b"first")
    (first / "image_2.fit").write_bytes(b"reserved")
    (second / "image.fit").write_bytes(b"second")
    (first / "nested").mkdir()
    (first / "nested" / "ignored.fit").write_bytes(b"nested")
    updates = []
    lease, mapping = aggregate([first, second / "image.fit"], destination,
                               progress=lambda done, total: updates.append((done, total)))
    try:
        output = Path(lease.name)
        assert sorted(path.name for path in output.iterdir()) == ["image.fit", "image_2.fit", "image_3.fit"]
        assert [Path(target).read_bytes() for _, target in mapping] == [b"first", b"reserved", b"second"]
        assert (second / "image.fit").read_bytes() == b"second"
        assert updates[-1] == (3, 3)
    finally:
        lease.cleanup()
    assert not output.exists()


def test_aggregate_cleans_partial_directory_on_interruption(tmp_path):
    source = tmp_path / "image.fit"
    source.write_bytes(b"data")
    destination = tmp_path / "work"
    destination.mkdir()

    def interrupt():
        raise RuntimeError("cancelled")

    with pytest.raises(RuntimeError, match="cancelled"):
        aggregate([source], destination, checkpoint=interrupt)
    assert list(destination.iterdir()) == []


def test_aggregate_rejects_missing_input(tmp_path):
    with pytest.raises(StorageError):
        aggregate([tmp_path / "missing.fit"], tmp_path)


def test_aggregate_rejects_source_changed_after_copy(tmp_path):
    source = tmp_path / "image.fit"
    source.write_bytes(b"original")
    destination = tmp_path / "work"
    destination.mkdir()

    def change_source(_done, _total):
        source.write_bytes(b"changed content")

    with pytest.raises(StorageError, match="SOURCE_CHANGED"):
        aggregate([source], destination, progress=change_source)
    assert list(destination.iterdir()) == []


def test_prompt_cleanup_preserves_other_active_folders(tmp_path):
    storage = StorageRuntime.initialize(tmp_path / "data", {})
    source = tmp_path / "frame.fit"
    source.write_bytes(b"sample")
    try:
        def progress(_done, _total):
            pass

        first, mapping = storage.aggregation.prepare("first", [source], lambda: None, progress)
        second, _ = storage.aggregation.prepare("second", [source], lambda: None, progress)
        assert Path(first, source.name).read_bytes() == b"sample"
        assert mapping == [(str(source), str(Path(first, source.name)))]
        processing = Path(first).parents[2]
        stale = processing / "aggregate-residual"
        foreign = processing / "aggregate-foreign1"
        for work in (stale, foreign):
            (work / "files").mkdir(parents=True)
            (work / "files" / source.name).write_bytes(b"residue")
        write_json_atomically(stale / "owner.json", {
            "instance_id": storage.workspaces.instance_id, "scratch": stale.name,
        })
        storage.cache.clear_after_session()
        assert not stale.exists()
        assert foreign.exists()
        assert Path(first).exists() and Path(second).exists()
        storage.aggregation.finish("first")
        assert not Path(first).exists()
        assert Path(second, source.name).read_bytes() == b"sample"
    finally:
        storage.close()
    assert not Path(second).exists()
