import os
from contextlib import nullcontext
from pathlib import Path
from types import SimpleNamespace
from uuid import uuid4

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


def test_managed_paths_retain_names_group_members_and_disambiguate():
    asset = str(uuid4())
    group = str(uuid4())
    name = "light_0001.fit"
    assert planner.managed_relative_key(name, asset, {"role": "raw"}, group) == f"objects/subframes/{group}/{name}"
    assert planner.managed_relative_key(name, asset, {"role": "raw"}, group, collision=True).endswith(f"-{asset}.fit")
    assert planner.managed_relative_key(name, asset, {"role": "master_frame"}, None) == f"objects/masters/light_0001-{asset}.fit"
    assert planner.managed_relative_key("movie.ser", asset, {"file_kind": "video"}, None) == f"objects/videos/movie-{asset}.ser"
    assert planner.managed_relative_key(name, asset, {}, None) == f"objects/{asset}/{name}"
    long_name = ("星" * 250 if os.name == "nt" else "星" * 83) + ".fits"
    key = planner.managed_relative_key(long_name, asset, {"role": "master_frame"}, None)
    filename = key.split("/")[-1]
    assert len(filename.encode("utf-16-le")) <= 510 if os.name == "nt" else len(filename.encode()) <= 255
    assert key.endswith(f"-{asset}.fits")
    for unsafe in ("../input.fit", "C:frame.fit", "NUL.fit", "raw\\child", "trailing."):
        with pytest.raises(StorageError, match="INVALID_REQUEST"):
            planner.managed_relative_key(unsafe, asset, {}, None)


def test_fit_preserves_names_or_uses_full_asset_id_and_checks_stage(tmp_path, monkeypatch):
    asset = str(uuid4())
    folder = f"objects/subframes/{uuid4()}"
    key = f"{folder}/{'t' * 100}.fits"
    shortened = f"{folder}/{asset}.fits"
    short_limit = planner._path_length(tmp_path / shortened)
    monkeypatch.setattr(planner, "_length_limits", lambda _: (short_limit, short_limit))
    assert planner.fit_managed_key(tmp_path, f"{folder}/a.fit", asset) == f"{folder}/a.fit"
    assert planner.fit_managed_key(tmp_path, key, asset) == shortened
    monkeypatch.setattr(planner, "_length_limits", lambda _: (short_limit - 5, short_limit))
    assert planner.fit_managed_key(tmp_path, key.removesuffix(".fits"), asset) == f"{folder}/{asset}"
    with pytest.raises(StorageError, match="too long"):
        planner.fit_managed_key(tmp_path, key, asset)
    stage = f".staging/direct-{asset}.part"
    stage_limit = planner._path_length(tmp_path / stage)
    monkeypatch.setattr(planner, "_length_limits", lambda _: (stage_limit - 1, stage_limit))
    with pytest.raises(StorageError, match="supported length"):
        planner.validate_managed_path_length(tmp_path, stage)


@pytest.mark.skipif(os.name != "nt", reason="Exercises Win32 path creation")
def test_long_windows_frame_name_matches_actual_filesystem(tmp_path):
    if planner._windows_long_paths():
        pytest.skip("This host already supports long paths")
    group = str(uuid4())
    asset = str(uuid4())
    folder = tmp_path / "objects" / "subframes" / group
    if planner._path_length(folder / f"{asset}.fit") > 259:
        pytest.skip("The test workspace cannot hold even the shortened path")
    folder.mkdir(parents=True)
    filename = "a" * (260 - planner._path_length(folder)) + ".fit"
    with pytest.raises(OSError):
        (folder / filename).write_bytes(b"payload")
    relative = planner.managed_relative_key(filename, asset, {"role": "raw"}, group)
    fitted = planner.fit_managed_key(tmp_path, relative, asset)
    expected = folder / f"{asset}.fit"
    assert tmp_path / fitted == expected
    expected.write_bytes(b"payload")
    assert expected.read_bytes() == b"payload"
