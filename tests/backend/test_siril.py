"""Unit/storage tests and opt-in verification using an official Siril CLI."""

import os
import sys
import time
from types import SimpleNamespace
from pathlib import Path
from uuid import uuid4

import numpy as np
import pytest
from astropy.io import fits

from astrophoto.core.config import load_storage_settings, read_json, write_json_atomically
from astrophoto.core.errors import StorageError
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.siril import software
from astrophoto.siril.frames import inspect_fits, resolve_input
from astrophoto.siril.processing import formal_run, parameters, recover_runs
from astrophoto.storage.runtime import StorageRuntime

PARAMS = {"shadowsclip": -2.8, "targetbg": 0.25, "linked": True}


def test_direct_fits_path_outside_import_roots(storage, sample, tmp_path):
    identity, path = resolve_input(storage, str(sample))
    assert identity == str(sample) and path == sample
    assert inspect_fits(path)[0].channels == 3
    outside = tmp_path / "outside.fit"
    outside.write_bytes(sample.read_bytes())
    assert resolve_input(storage, str(outside)) == (str(outside), outside)
    with pytest.raises(StorageError, match="SOURCE_NOT_FOUND"):
        resolve_input(storage, str(sample.parent / "missing.fit"))
    bad = sample.parent / "bad.fits"
    bad.write_text("not a FITS image")
    with pytest.raises(StorageError, match="FITS_INVALID"):
        inspect_fits(resolve_input(storage, str(bad))[1])


def test_load_image_node_outputs_path_and_tracks_file_changes(extension, sample, tmp_path):
    import importlib

    runtime_type = importlib.import_module("astrophoto_extension_test.astrophoto.storage.runtime").StorageRuntime
    storage = runtime_type.initialize(tmp_path / "node-data", {"ASTROPHOTO_IMPORT_ROOTS": str(sample.parent)})
    node = extension.module.AstroPhotoFITSSource
    node.runtime = SimpleNamespace(storage=storage, trusted_local=True)
    try:
        first = node.fingerprint_inputs(str(sample))
        assert node.execute(str(sample)).result == (str(sample),)
        fits.writeto(sample, np.ones((12, 12), dtype=np.float32), overwrite=True)
        assert node.fingerprint_inputs(str(sample)) != first
    finally:
        storage.previews.shutdown()
        storage.operations.pool.shutdown()


@pytest.fixture
def sample(tmp_path):
    folder = tmp_path / "observations with spaces"
    folder.mkdir()
    path = folder / "frame.fit"
    image = np.linspace(0.02, 0.18, 80 * 60, dtype=np.float32).reshape(60, 80)
    image[10:15, 10:15] = .85
    fits.writeto(path, np.stack([image, image * .7, image * .85]), fits.Header({"OBJECT": "Test target"}))
    return path


@pytest.fixture
def storage(tmp_path, sample):
    runtime = StorageRuntime.initialize(tmp_path / "data", {"ASTROPHOTO_IMPORT_ROOTS": str(sample.parent)})
    yield runtime
    runtime.previews.shutdown()
    runtime.operations.pool.shutdown()


def test_fits_inspection_validates_precision_metadata_and_truncation(sample):
    before = sample.read_bytes()
    info, png = inspect_fits(sample, thumbnail=True)
    assert (info.width, info.height, info.channels, info.bitpix) == (80, 60, 3, -32)
    assert ("OBJECT", "Test target") in info.metadata and png.startswith(b"\x89PNG")
    assert sample.read_bytes() == before
    sample.write_bytes(before[:2880])
    with pytest.warns(UserWarning), pytest.raises(StorageError, match="FITS_INVALID"):
        inspect_fits(sample)


def test_formal_run_requires_an_absolute_path(storage):
    for value in ("relative.fit", str(uuid4())):
        with pytest.raises(StorageError, match="INVALID_STORAGE_PATH"):
            formal_run(storage, value, PARAMS, lambda: None, lambda _event: None)


@pytest.mark.parametrize("values", [
    {**PARAMS, "linked": 0}, {**PARAMS, "targetbg": 1.1}, {**PARAMS, "shadowsclip": float("nan")},
    {**PARAMS, "shadowsclip": "-2.8\ncd /"},
])
def test_parameters_reject_untrusted_script_values(values):
    with pytest.raises(StorageError, match="INVALID_AUTOSTRETCH_PARAMETERS"):
        parameters(values, 3)


def test_mono_normalizes_linked():
    assert not parameters(PARAMS, 1)["linked"]
    assert parameters(PARAMS, 3)["linked"]


def test_config_rejects_incompatible_version_and_keeps_previous(storage, tmp_path, monkeypatch):
    candidates = ["siril 1.4.5", "siril 1.4.4", "siril 1.5.0-dev"]
    monkeypatch.setattr(software, "executable", lambda path: (Path(path), [1, 2]))
    monkeypatch.setattr(software, "run_cli", lambda *_args, **_kwargs: candidates.pop(0))
    monkeypatch.setattr("astrophoto.siril.processing.verify_cli", lambda *_args: None)
    old = storage.siril.save(str(tmp_path / "siril-cli.exe"))
    for _ in range(2):
        with pytest.raises(StorageError) as error:
            storage.siril.save(str(tmp_path / "other" / "siril-cli.exe"))
        assert error.value.code == "SIRIL_VERSION_MISMATCH"
        assert storage.siril.status() == old


def test_invalid_and_gui_paths_rejected(storage, tmp_path):
    assert storage.siril.status()["state"] == "SIRIL_NOT_CONFIGURED"
    (tmp_path / "siril.exe").touch()
    for path, code in [(tmp_path / "siril.exe", "SIRIL_GUI_ONLY"), (tmp_path / "notepad.exe", "SIRIL_EXECUTABLE_INVALID"),
                       (tmp_path / "siril-cli.exe", "SIRIL_NOT_FOUND")]:
        with pytest.raises(StorageError, match=code):
            storage.siril.save(str(path))


def test_runner_timeout_and_mid_process_cancellation(tmp_path):
    command = ["-c", "import time; time.sleep(8)"]
    with pytest.raises(StorageError, match="SIRIL_RUN_TIMEOUT"):
        software.run_cli(Path(sys.executable), command, tmp_path, lambda: None, timeout=.2)
    deadline = time.monotonic() + .2

    def cancel():
        if time.monotonic() >= deadline:
            raise KeyboardInterrupt

    with pytest.raises(KeyboardInterrupt):
        software.run_cli(Path(sys.executable), command, tmp_path, cancel, timeout=8)
    assert software.run_cli(Path(sys.executable), ["-c", "print('reaped')"], tmp_path, lambda: None, timeout=8).strip() == "reaped"


def test_restart_reconciles_only_owned_unregistered_run(storage):
    workspace = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    outputs = storage.workspaces.require(workspace) / "outputs"
    folder = outputs / str(uuid4())
    folder.mkdir()
    write_json_atomically(folder / "manifest.json", {
        "producer": "siril-autostretch-v1", "instance_id": storage.workspaces.instance_id,
        "workspace_id": workspace, "run_id": folder.name, "state": "completed",
    })
    (folder / "stretched.fit").write_bytes(b"unregistered output")
    (outputs / "user-file.fit").write_bytes(b"user file")
    recover_runs(storage)
    assert read_json(folder / "manifest.json")["state"] == "interrupted"
    assert not (folder / "stretched.fit").exists()
    assert (outputs / "user-file.fit").read_bytes() == b"user file"


def test_real_cli_immutable_source_and_formal_output(storage, sample, tmp_path):
    cli = os.getenv("ASTROPHOTO_SIRIL_TEST_CLI")
    if not cli:
        pytest.skip("Set ASTROPHOTO_SIRIL_TEST_CLI to an official Siril 1.4.5 executable")
    storage.environ["PATH"] = str(Path(cli).parent)
    candidates = storage.siril.discover()["candidates"]
    assert any(item["version"] == "1.4.5" for item in candidates if item["state"] == "ready")
    assert storage.siril.status()["state"] == "SIRIL_NOT_CONFIGURED"
    assert storage.siril.save(cli)["version"] == "1.4.5"
    workspace = storage.workspaces.register(str(tmp_path / "secondary workspace"), "Secondary")
    revision = load_storage_settings(storage.root)["revision"]
    storage.update_settings(revision, workspace=workspace["id"])
    asset_id = str(uuid4())
    with storage.db.session() as db:
        db.add(Asset(id=asset_id, name=sample.name, size_bytes=sample.stat().st_size, mtime_ns=sample.stat().st_mtime_ns))
        db.flush()
        db.add(AssetLocation(id=str(uuid4()), asset_id=asset_id, storage_mode="external_reference",
                             external_path=str(sample), external_key=os.path.normcase(str(sample))))
    before = sample.read_bytes()
    events = []
    path, result_id, source_id = formal_run(storage, str(sample), PARAMS, lambda: None, events.append)
    assert source_id == asset_id and path == storage.assets.resolve_asset(result_id)
    assert path.is_relative_to(tmp_path / "secondary workspace")
    receipt = read_json(path.with_name("manifest.json"))
    assert receipt["source"]["asset_id"] == asset_id and receipt["output"]["asset_id"] == result_id
    assert inspect_fits(path)[0].bitpix == -32 and not np.allclose(fits.getdata(path), fits.getdata(sample))
    assert sample.read_bytes() == before and events[0]["state"] == "running"

    def cancel():
        raise KeyboardInterrupt()

    with pytest.raises(KeyboardInterrupt):
        formal_run(storage, str(sample), PARAMS, cancel, events.append)
    assert events[-1]["state"] == "cancelled" and path.is_file()
    assert sample.read_bytes() == before


def test_real_cli_direct_path_and_chained_output(storage, sample):
    cli = os.getenv("ASTROPHOTO_SIRIL_TEST_CLI")
    if not cli:
        pytest.skip("Set ASTROPHOTO_SIRIL_TEST_CLI to an official Siril 1.4.5 executable")
    storage.siril.save(cli)
    before = sample.read_bytes()
    first_path, first_id, first_source = formal_run(storage, str(sample), PARAMS, lambda: None, lambda _event: None)
    first_bytes = first_path.read_bytes()
    second_path, second_id, second_source = formal_run(
        storage, str(first_path), {**PARAMS, "linked": False}, lambda: None, lambda _event: None,
    )
    assert first_source == str(sample) and second_source == first_id
    assert storage.assets.resolve_asset(first_id) == first_path
    assert storage.assets.resolve_asset(second_id) == second_path
    assert first_path.is_file() and second_path.is_file() and first_path != second_path
    assert not np.allclose(fits.getdata(first_path), fits.getdata(sample))
    assert inspect_fits(second_path)[0].channels == 3
    assert read_json(second_path.with_name("manifest.json"))["source"]["asset_id"] == first_id
    assert first_path.read_bytes() == first_bytes
    assert sample.read_bytes() == before

