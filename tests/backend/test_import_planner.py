from contextlib import nullcontext
from pathlib import Path
from types import SimpleNamespace

import pytest

from astrophoto.core.errors import StorageError
from astrophoto.storage import import_planner as planner


def _plan(monkeypatch, locations, volumes, sizes, **options):
    # Each location gives a volume and its own quota; volumes have independent
    # filesystem free space, shared volume quota, and physical disk membership.
    def require(workspace):
        if locations[workspace][0] is None:
            raise StorageError("WORKSPACE_OFFLINE")
        return Path(workspace)

    registry = SimpleNamespace(ordered=lambda: [SimpleNamespace(id=key) for key in locations], require=require)
    volume_for = lambda path: locations[str(path)][0]
    monkeypatch.setattr(planner, "volume_identity", volume_for)
    monkeypatch.setattr(planner, "_physical_disks", lambda path, volume: volumes[volume][2])
    capacity = SimpleNamespace(
        lock=nullcontext(),
        _balance=lambda path: {"available_bytes": volumes[volume_for(path)][0],
                               "remaining_quota_bytes": volumes[volume_for(path)][1]},
        _location_balance=lambda workspace: {"remaining_bytes": locations[workspace][1]},
    )
    return planner.plan_import(SimpleNamespace(capacity=capacity, workspaces=registry),
                               [{"size_bytes": size} for size in sizes], **options)


def test_default_co_locates_entire_batch_and_respects_location_selection(monkeypatch):
    locations = {"a": ("V1", 8), "offline": (None, None), "b": ("V2", 11), "c": ("V3", 20)}
    volumes = {key: (50, None, {key}) for key in ("V1", "V2", "V3")}
    assert [e["workspace_id"] for e in _plan(monkeypatch, locations, volumes, [5, 4])] == ["b", "b"]
    assert [e["workspace_id"] for e in _plan(monkeypatch, locations, volumes, [5, 4], workspace_ids=["c"])] == ["c", "c"]
    with pytest.raises(StorageError, match="NO_AVAILABLE_WORKSPACE"):
        _plan(monkeypatch, locations, volumes, [5, 4], workspace_ids=["a", "offline"])
    with pytest.raises(StorageError, match="INVALID_REQUEST"):
        _plan(monkeypatch, locations, volumes, [1], workspace_ids=["missing"])


def test_distributes_by_bytes_and_preserves_user_order(monkeypatch):
    locations = {"a": ("V1", None), "b": ("V2", None)}
    volumes = {"V1": (25, None, {"d1"}), "V2": (25, None, {"d2"})}
    sizes = [3, 9, 4, 2]
    entries = _plan(monkeypatch, locations, volumes, sizes, parallel=True)
    assert [e["workspace_id"] for e in entries] == ["b", "a", "b", "b"]
    assert {e["lane"] for e in entries} == {"d1", "d2"}


def test_shared_volume_budget_and_overlapping_or_unresolved_hardware(monkeypatch):
    locations = {"a": ("V1", 5), "b": ("V1", 20), "c": ("V2", None)}
    volumes = {"V1": (100, 10, {"d1", "d2"}), "V2": (15, None, {"d2"})}
    sizes = [5, 5, 5]
    entries = _plan(monkeypatch, locations, volumes, sizes, parallel=True)
    assert [e["workspace_id"] for e in entries] == ["a", "b", "c"]
    assert [e["lane"] for e in entries] == ["d1+d2"] * 3
    with pytest.raises(StorageError, match="NO_AVAILABLE_WORKSPACE"):
        _plan(monkeypatch, locations, volumes, [10, 10, 10], parallel=True)
    volumes["V2"] = (15, None, set())
    assert {e["lane"] for e in _plan(monkeypatch, locations, volumes, sizes, parallel=True)} == {"shared"}


def test_separate_jobs_share_physical_device_locks(monkeypatch):
    devices = {"stripe": {"d1", "d2"}, "partition": {"d1"}, "external": {"d3"}, "unknown": set()}
    monkeypatch.setattr(planner, "volume_identity", lambda root: str(root))
    monkeypatch.setattr(planner, "_physical_disks", lambda root, volume: devices[volume])
    writers = planner.PhysicalWriters()
    with writers.claim(Path("stripe")), writers.claim(Path("external")):
        for root in ("partition", "unknown", "external"):
            with pytest.raises(StorageError, match="STORAGE_BUSY"), writers.claim(Path(root)):
                pytest.fail("conflicting physical writes overlapped")
    with writers.claim(Path("unknown")):
        with pytest.raises(StorageError, match="STORAGE_BUSY"), writers.claim(Path("partition")):
            pytest.fail("unknown disk mapping claimed a parallel writer")
    with pytest.raises(OSError), writers.claim(Path("partition")):
        raise OSError("stream interrupted")
    with writers.claim(Path("partition")):
        pass


@pytest.mark.parametrize(("attrs", "category"), [
    ({"role": "raw"}, "subframes"),
    ({"file_kind": "video"}, "videos"),
    ({"role": "master_frame"}, "masters"),
    ({"role": "calibration_master"}, "masters"),
    ({"role": "processed"}, "images"),
])
def test_managed_paths_preserve_source_and_catalog_names(attrs, category):
    assert planner.managed_relative_key("frame.fit", attrs, "M31") == f"objects/{category}/M31/frame.fit"
    with pytest.raises(StorageError, match="INVALID_MANAGED_NAME"):
        planner.managed_relative_key("frame.fit", attrs, "NUL")


def test_path_limit_rejects_overflow_without_rewriting_file(tmp_path, monkeypatch):
    key = "objects/subframes/M31/long-filename.fit"
    limit = planner._path_length(tmp_path / key)
    monkeypatch.setattr(planner, "_length_limits", lambda _: (limit, limit))
    assert planner.managed_destination(tmp_path, key) == tmp_path / key
    with pytest.raises(StorageError, match="MANAGED_PATH_TOO_LONG"):
        planner.managed_destination(tmp_path, key + "s")


def test_conflict_rejects_foreign_directories_and_casefold_duplicates(tmp_path):
    destination = tmp_path / "objects" / "subframes" / "M31" / "frame.fit"
    destination.parent.mkdir(parents=True)
    with pytest.raises(StorageError, match="OBJECT_CONFLICT"):
        planner.check_destination(destination)
    planner.check_destination(destination, allow_directory=True)
    (destination.parent / "Frame.fit").write_bytes(b"existing")
    with pytest.raises(StorageError, match="OBJECT_CONFLICT"):
        planner.check_destination(destination, allow_directory=True)
