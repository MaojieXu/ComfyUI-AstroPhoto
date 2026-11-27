"""Unit/storage tests and opt-in verification using an official Siril CLI."""

import json
import os
import sys
import time
from pathlib import Path
from uuid import uuid4

import numpy as np
import pytest
from astropy.io import fits

from astrophoto.assets.fits import inspect_fits, resolve_input
from astrophoto.core.config import load_storage_settings, read_json, write_json_atomically
from astrophoto.core.errors import StorageError
from astrophoto.database.models import Asset, AssetLocation
from astrophoto.storage.runtime import StorageRuntime
from extension.siril import processing, software
from extension.siril.bundle import SirilBundle
from extension.siril.processing import formal_run, parameters, recover_runs

PARAMS = {"shadowsclip": -2.8, "targetbg": 0.25, "linked": True}


@pytest.mark.skipif(os.name != "nt", reason="Windows installation directories")
@pytest.mark.parametrize("env_key", ["PROGRAMFILES", "PROGRAMFILES(X86)", "ProgramFiles", "ProgramFiles(x86)"])
def test_discover_windows_program_files_case(storage, bundle, tmp_path, monkeypatch, env_key):
    cli = tmp_path / "Siril" / "bin" / "siril-cli.exe"
    cli.parent.mkdir(parents=True)
    cli.touch()
    storage.environ = {env_key: str(tmp_path), "PATH": ""}
    monkeypatch.setattr(bundle.software, "probe", lambda path: {"version": "1.4.5"})
    assert bundle.software.discover()["candidates"] == [
        {"path": str(cli), "origin": "standard", "state": "ready", "version": "1.4.5"}
    ]


def test_siril_temporary_directory_retries_only_windows_sharing_violations(tmp_path, monkeypatch):
    cleanup = software.tempfile.TemporaryDirectory.cleanup
    attempts = []

    def sharing_violation_once(directory):
        attempts.append(directory.name)
        if len(attempts) == 1:
            error = PermissionError("temporary sharing violation")
            error.winerror = 32
            raise error
        cleanup(directory)

    monkeypatch.setattr(software.tempfile.TemporaryDirectory, "cleanup", sharing_violation_once)
    with software.SirilTemporaryDirectory(dir=tmp_path) as directory:
        assert Path(directory).is_dir()
    assert attempts == [directory, directory]
    assert not Path(directory).exists()

    def denied(_directory):
        raise PermissionError("permission denied")

    denied_directory = software.SirilTemporaryDirectory(dir=tmp_path)
    with pytest.raises(PermissionError, match="permission denied"):
        with monkeypatch.context() as patch, denied_directory:
            patch.setattr(software.tempfile.TemporaryDirectory, "cleanup", denied)
    assert Path(denied_directory.name).is_dir()
    denied_directory.cleanup()


def test_direct_local_fits_path(storage, sample, tmp_path):
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
def bundle():
    return SirilBundle()


@pytest.fixture
def storage(tmp_path, sample, bundle):
    runtime = StorageRuntime.initialize(
        tmp_path / "data", {}, prepare=bundle.initialize_storage,
    )
    yield runtime
    bundle.previews.shutdown()
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


def test_preview_rejects_source_replaced_before_worker_starts(storage, bundle, sample, monkeypatch):
    from extension.siril.previews import PreviewJob

    expected = inspect_fits(sample)[0].revision
    fits.writeto(sample, np.ones((70, 90), dtype=np.float32), overwrite=True)
    started = []
    monkeypatch.setattr(bundle.software, "current", lambda: started.append(True))
    job = PreviewJob(str(uuid4()), str(uuid4()), str(sample), PARAMS, expected_revision=expected)
    bundle.previews.jobs[job.id] = job
    bundle.previews._run(job)
    assert job.state == "failed" and job.result["error"] == "SOURCE_CHANGED"
    assert not started and not job.images


def test_cli_provenance_rejects_changed_or_replaced_input(storage, bundle, sample):
    import asyncio
    from types import SimpleNamespace

    from astrophoto.api.node_tuning import NodeTuning
    from astrophoto.storage.manager import fingerprint, source_stat
    from extension.siril.commands import COMMANDS
    from extension.siril.session import _stage, make_step

    tuning = NodeTuning(SimpleNamespace(storage=storage, processing_bundle=bundle))
    sources = {}
    work = sample.parent / "staging"
    work.mkdir()
    step = make_step(COMMANDS["crop"], "[0, 0, 32, 32]", str(sample), "", "")
    _stage(storage, [step], work, lambda: None, sources)
    assert sources == {str(sample): fingerprint(source_stat(sample))}
    provenance = [{"sources": sources, "sourceRefs": [str(sample)]}]
    tuning._validate_provenance(provenance)
    another = sample.parent / "another.fit"
    fits.writeto(another, np.zeros((60, 80), dtype=np.float32))
    with pytest.raises(StorageError, match="SOURCE_CHANGED"):
        tuning._validate_provenance([{**provenance[0], "sourceRefs": [str(another)]}])
    def inspect(ref):
        reply = {"target_id": str(uuid4()), "node_id": 1, "preview_capability": True, "parameters": PARAMS,
                 "private_source": str(sample), "private_provenance": [{**provenance[0], "sourceRefs": [str(ref)]}]}
        return asyncio.run(tuning.inspect(str(uuid4()), reply))
    assert inspect(sample)["input_state"] == "available"
    changed = inspect(another)
    assert changed["input_state"] == "unavailable" and changed["input_error"] == "SOURCE_CHANGED"
    assert "input_ref" not in changed
    fits.writeto(sample, np.zeros((61, 80), dtype=np.float32), overwrite=True)
    with pytest.raises(StorageError, match="SOURCE_CHANGED"):
        tuning._validate_provenance(provenance)
    assert inspect(sample)["input_error"] == "SOURCE_CHANGED"


def test_formal_run_requires_an_absolute_path(storage, bundle):
    for value in ("relative.fit", str(uuid4())):
        with pytest.raises(StorageError, match="INVALID_STORAGE_PATH"):
            formal_run(storage, bundle.software, value, PARAMS, lambda: None, lambda _event: None)


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


def test_config_rejects_incompatible_version_and_keeps_previous(storage, bundle, tmp_path, monkeypatch):
    candidates = ["siril 1.4.5", "siril 1.4.4", "siril 1.5.0-dev"]
    monkeypatch.setattr(software, "executable", lambda path: (Path(path), [1, 2]))
    monkeypatch.setattr(software, "run_cli", lambda *_args, **_kwargs: candidates.pop(0))
    monkeypatch.setattr(processing, "verify_cli", lambda *_args: None)
    old = bundle.software.save(str(tmp_path / "siril-cli.exe"))
    for _ in range(2):
        with pytest.raises(StorageError) as error:
            bundle.software.save(str(tmp_path / "other" / "siril-cli.exe"))
        assert error.value.code == "SIRIL_VERSION_MISMATCH"
        assert bundle.software.status() == old


def test_invalid_and_gui_paths_rejected(storage, bundle, tmp_path):
    assert bundle.software.status()["state"] == "SIRIL_NOT_CONFIGURED"
    (tmp_path / "siril.exe").touch()
    for path, code in [(tmp_path / "siril.exe", "SIRIL_GUI_ONLY"), (tmp_path / "notepad.exe", "SIRIL_EXECUTABLE_INVALID"),
                       (tmp_path / "siril-cli.exe", "SIRIL_NOT_FOUND")]:
        with pytest.raises(StorageError, match=code):
            bundle.software.save(str(path))


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


@pytest.mark.skipif(os.name != "nt", reason="MSYS2 inheritance affects the native Windows Siril CLI")
def test_windows_runner_isolates_siril_from_msys_environment(tmp_path, monkeypatch):
    expected_parent = {"MSYSTEM": "MINGW64", "MSYS": "winsymlinks:nativestrict", "ASTROPHOTO_TEST_ENV": "preserved"}
    for name, value in expected_parent.items():
        monkeypatch.setenv(name, value)
    command = ["-c", "import json, os; print(json.dumps([os.getenv(key) for key in "
               "('MSYSTEM', 'MSYS', 'ASTROPHOTO_TEST_ENV', 'LC_ALL', 'LANG')]))"]
    output = software.run_cli(Path(sys.executable), command, tmp_path, lambda: None, timeout=8)
    assert json.loads(output) == [None, None, "preserved", "C", "C"]
    assert {name: os.environ[name] for name in expected_parent} == expected_parent


def test_restart_reconciles_only_owned_unregistered_run(storage):
    workspace = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    outputs = storage.workspaces.require(workspace) / "outputs"
    folder = outputs / str(uuid4())
    folder.mkdir()
    write_json_atomically(folder / "manifest.json", {
        "producer": "siril-autostretch-v1", "instance_id": storage.workspaces.instance_id,
        "workspace_id": workspace, "run_id": folder.name, "command_id": "autostretch", "state": "completed",
    })
    (folder / "stretched.fit").write_bytes(b"unregistered output")
    (outputs / "user-file.fit").write_bytes(b"user file")
    recover_runs(storage)
    diagnostics = list((storage.cache_path / "processing").glob("*.cache"))
    assert any(read_json(item)["state"] == "interrupted" for item in diagnostics)
    assert not (folder / "manifest.json").exists()
    assert not (folder / "stretched.fit").exists()
    assert (outputs / "user-file.fit").read_bytes() == b"user file"



def test_recovery_ignores_receipt_without_command_id(storage):
    workspace = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    folder = storage.workspaces.require(workspace) / "outputs" / str(uuid4())
    folder.mkdir()
    manifest = folder / "manifest.json"
    write_json_atomically(manifest, {"producer": "siril-autostretch-v1", "instance_id": storage.workspaces.instance_id,
                                     "workspace_id": workspace, "run_id": folder.name, "state": "completed"})
    output = folder / "stretched.fit"
    output.write_bytes(b"unregistered")
    recover_runs(storage)
    assert manifest.exists() and output.read_bytes() == b"unregistered"

def test_real_cli_immutable_source_and_formal_output(storage, bundle, sample, tmp_path):
    cli = os.getenv("ASTROPHOTO_SIRIL_TEST_CLI")
    if not cli:
        pytest.skip("Set ASTROPHOTO_SIRIL_TEST_CLI to an official Siril 1.4.5 executable")
    storage.environ["PATH"] = str(Path(cli).parent)
    candidates = bundle.software.discover()["candidates"]
    assert any(item["version"] == "1.4.5" for item in candidates if item["state"] == "ready")
    assert bundle.software.status()["state"] == "SIRIL_NOT_CONFIGURED"
    assert bundle.software.save(cli)["version"] == "1.4.5"
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
    job_id = bundle.previews.start(str(uuid4()), asset_id, PARAMS)["job_id"]
    deadline = time.monotonic() + 20
    preview = bundle.previews.status(job_id)
    while preview["state"] in {"queued", "running"} and time.monotonic() < deadline:
        time.sleep(.05)
        preview = bundle.previews.status(job_id)
    assert preview["state"] == "ready", preview
    assert all(bundle.previews.read(job_id, side).startswith(b"\x89PNG") for side in ("before", "after"))
    events = []
    provenance = {"node_id": "42", "workflow_id": "astronomy-test"}
    path, result_id, source_id = formal_run(storage, bundle.software, str(sample), PARAMS, lambda: None, events.append,
                                            provenance=provenance)
    assert source_id == asset_id and path == storage.library.resolve_output(result_id)
    with pytest.raises(StorageError, match="ASSET_NOT_FOUND"):
        storage.assets.resolve_asset(result_id)
    assert path.is_relative_to(tmp_path / "secondary workspace")
    receipt = read_json(path.with_name("manifest.json"))
    assert receipt["source"]["asset_id"] == asset_id and receipt["run_id"] == result_id
    assert receipt["command_id"] == "autostretch" and "output_id" not in receipt["output"]
    assert receipt["workflow_source"] == provenance
    recover_runs(storage)
    assert path.is_file()
    registered = storage.library.write("assets", {"output_id": result_id})
    assert registered["attributes"]["source_asset_id"] == asset_id
    assert registered["attributes"]["node"] == "42" and registered["attributes"]["workflow"] == "astronomy-test"
    assert storage.library.write("assets", {"output_id": result_id})["id"] == result_id
    assert storage.assets.resolve_asset(result_id) == path
    assert inspect_fits(path)[0].bitpix == -32 and not np.allclose(fits.getdata(path), fits.getdata(sample))
    assert sample.read_bytes() == before and events[0]["state"] == "running"

    def cancel():
        raise KeyboardInterrupt()

    with pytest.raises(KeyboardInterrupt):
        formal_run(storage, bundle.software, str(sample), PARAMS, cancel, events.append)
    assert events[-1]["state"] == "cancelled" and path.is_file()
    assert sample.read_bytes() == before


def test_real_cli_direct_path_and_chained_output(storage, bundle, sample):
    cli = os.getenv("ASTROPHOTO_SIRIL_TEST_CLI")
    if not cli:
        pytest.skip("Set ASTROPHOTO_SIRIL_TEST_CLI to an official Siril 1.4.5 executable")
    bundle.software.save(cli)
    before = sample.read_bytes()
    first_path, first_id, first_source = formal_run(storage, bundle.software, str(sample), PARAMS, lambda: None, lambda _event: None)
    first_bytes = first_path.read_bytes()
    second_path, second_id, second_source = formal_run(
        storage, bundle.software, str(first_path), {**PARAMS, "linked": False}, lambda: None, lambda _event: None,
    )
    assert first_source == str(sample) and second_source == str(first_path)
    assert storage.library.resolve_output(first_id) == first_path
    assert storage.library.resolve_output(second_id) == second_path
    assert first_path.is_file() and second_path.is_file() and first_path != second_path
    assert not np.allclose(fits.getdata(first_path), fits.getdata(sample))
    assert inspect_fits(second_path)[0].channels == 3
    assert read_json(second_path.with_name("manifest.json"))["source"]["asset_id"] == str(first_path)
    assert first_path.read_bytes() == first_bytes
    assert sample.read_bytes() == before


@pytest.mark.parametrize("partial", [False, True])
@pytest.mark.parametrize(("producer", "filename"), [
    ("siril-autostretch-v1", "stretched.fit"), ("siril-single-fits-v1", "result.fit"),
])
def test_migrate_workspace_with_uncollected_formal_output(storage, tmp_path, partial, producer, filename):
    workspace = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    root = storage.workspaces.require(workspace)
    result_id = str(uuid4())
    relative = f"outputs/{result_id}/{filename}"
    source = root / relative
    source.parent.mkdir()
    source.write_bytes(b"mocked science result")
    size = source.stat().st_size
    provenance = {"producer": producer, "size_bytes": size,
                  "command_id": "autostretch" if producer == "siril-autostretch-v1" else "gauss"}
    storage.library.record_output(result_id, workspace, relative, None, provenance)
    write_json_atomically(source.with_name("manifest.json"), {
        "producer": provenance["producer"], "instance_id": storage.workspaces.instance_id,
        "workspace_id": workspace, "run_id": result_id, "state": "completed",
        "command_id": "gauss" if producer == "siril-single-fits-v1" else "autostretch",
    })
    assert storage.capacity.snapshot(storage.snapshot("test")["workspaces"])[0]["used_bytes"] == size
    new_root = tmp_path / "migrated"
    payload = {"workspace_id": workspace, "idempotency_key": str(uuid4())}
    target_workspace = workspace
    if partial:
        target_workspace = storage.workspaces.register(str(new_root), "Target")["id"]
        plan = storage.migrations.preflight({"workspace_id": workspace, "target_workspace_id": target_workspace,
                                             "amount": 100, "unit": "%"})
        payload.update(plan_id=plan["plan_id"], option_id=plan["options"][0]["id"])
    else:
        payload["target_path"] = str(new_root)
    job = storage.migrations.start(payload)
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        result = storage.operations.status(job, "migration")
        if result["phase"] in {"completed", "cancelled", "failed"}:
            break
        time.sleep(.025)
    assert result["phase"] == "completed", result
    assert not source.exists()
    assert storage.library.resolve_output(result_id) == new_root / relative
    manifest = read_json((new_root / relative).with_name("manifest.json"))
    assert manifest["workspace_id"] == target_workspace
    recover_runs(storage)
    assert (new_root / relative).is_file()
    with pytest.raises(StorageError, match="ASSET_NOT_FOUND"):
        storage.assets.resolve_asset(result_id)
    storage.library.write("assets", {"output_id": result_id})
    assert storage.capacity.snapshot(storage.snapshot("test")["workspaces"])[0]["used_bytes"] == size


def test_generic_siril_arguments_are_tokens_not_script_lines():
    from extension.siril.commands import COMMANDS
    from extension.siril.session import make_step

    command = COMMANDS["profile"]
    step = make_step(command, '["-from=1,1", "-to=3,3", "-title=Two words"]', "", "", "")
    assert step.args == ("-from=1,1", "-to=3,3", "-title=Two words")
    for value in ('["-from=1,1", "quit\\nload outside"]', '["-from=1,1", "-filename=../outside"]',
                  '["-from=1,1", "-filename=C:/outside"]', '["-from=1,1", "{input}"]'):
        with pytest.raises(StorageError, match="INVALID_SIRIL_ARGUMENTS|Use staged|profile"):
            make_step(command, value, "", "", "")


def test_real_cli_shared_path_commands(storage, bundle, tmp_path):
    from extension.siril.commands import COMMANDS
    from extension.siril.session import execute_session, make_step

    cli = os.getenv("ASTROPHOTO_SIRIL_TEST_CLI")
    if not cli:
        pytest.skip("Set ASTROPHOTO_SIRIL_TEST_CLI to an official Siril 1.4.5 executable")
    bundle.software.save(cli)
    source = tmp_path / "input with spaces.fit"
    data = np.linspace(0.1, 0.9, 64 * 64, dtype=np.float32).reshape(64, 64)
    fits.writeto(source, data)
    original = source.read_bytes()

    def run(*steps):
        return execute_session(storage, bundle.software, steps, lambda: None)

    crop = make_step(COMMANDS["crop"], "[0, 0, 32, 32]", str(source), "", "")
    output, directory, log = run(crop)
    assert Path(output).parent == Path(directory) and "crop" in log
    assert fits.getdata(output).shape == (32, 32)
    for name, values in (("gauss", {"sigma": 1.3}), ("neg", {})):
        output, output_id, _ = formal_run(storage, bundle.software, str(output), values, lambda: None,
                                          lambda _: None, command=COMMANDS[name])
        assert storage.library.resolve_output(output_id) == output
        assert output.name == "result.fit" and fits.getdata(output).shape == (32, 32)

    load = make_step(COMMANDS["load"], "[]", "", str(source), "")
    flip = make_step(COMMANDS["mirrory"], "[]", "", "", "")
    output, _, _ = run(load, flip)
    np.testing.assert_allclose(fits.getdata(output), data[:, ::-1])
    assert source.read_bytes() == original

    sequence = tmp_path / "sequence"
    sequence.mkdir()
    for i in range(1, 4):
        fits.writeto(sequence / f"raw{i:05}.fit", data + i / 100)
    convert = make_step(COMMANDS["convert"], '["lights"]', "", "", str(sequence))
    _, directory, _ = run(convert)
    assert len(list(Path(directory).glob("lights*.fit"))) == 3
    stats = make_step(COMMANDS["seqstat"], '["lights", "stats.csv"]', "", "", directory)
    _, directory, _ = run(stats)
    assert (Path(directory) / "stats.csv").stat().st_size > 0
    assert source.read_bytes() == original

def test_siril_session_directory_moves_as_one_group(storage, tmp_path):
    from astrophoto.storage.migration import managed_groups
    from extension.siril.session import PENDING, PRODUCER, recover_sessions

    workspace = load_storage_settings(storage.root)["workspace"]["default_workspace_id"]
    root = storage.workspaces.require(workspace)
    run_id = str(uuid4())
    folder = root / "outputs" / run_id
    folder.mkdir()
    records = []
    for filename, data in (("frame00001.fit", b"frame"), ("seq.seq", b"sequence"), ("manifest.json", b"external sidecar")):
        (folder / filename).write_bytes(data)
        records.append((str(uuid4()), f"outputs/{run_id}/{filename}", None, {
            "producer": PRODUCER, "run_id": run_id, "size_bytes": len(data),
        }))
    storage.library.record_outputs(workspace, records)
    identity = {"producer": PRODUCER, "instance_id": storage.workspaces.instance_id,
                "workspace_id": workspace, "run_id": run_id}
    write_json_atomically(folder / PENDING, identity)
    abandoned = root / ".staging" / "siril-session-abandoned"
    abandoned.mkdir()
    write_json_atomically(abandoned / PENDING, {**identity, "run_id": str(uuid4())})
    untracked = root / ".staging" / "siril-session-untracked"
    untracked.mkdir()
    recovered_run = str(uuid4())
    unpublished = root / "outputs" / recovered_run
    unpublished.mkdir()
    write_json_atomically(unpublished / PENDING, {**identity, "run_id": recovered_run})
    recover_sessions(storage)
    assert not (folder / PENDING).exists()
    assert folder.is_dir()
    assert not abandoned.exists() and not unpublished.exists()
    assert untracked.is_dir()
    untracked.rmdir()
    with storage.db.session() as session:
        groups = list(managed_groups(session, root, workspace, storage.workspaces.instance_id))
    assert len(groups) == 1 and groups[0]["id"] == run_id
    assert set(groups[0]["members"]) == {key for _, key, _, _ in records}

    target = tmp_path / "session migration"
    target_id = storage.workspaces.register(str(target), "Target")["id"]
    plan = storage.migrations.preflight({"workspace_id": workspace, "target_workspace_id": target_id,
                                         "amount": 100, "unit": "%"})
    operation = storage.migrations.start({
        "workspace_id": workspace, "plan_id": plan["plan_id"], "option_id": plan["options"][0]["id"],
        "idempotency_key": str(uuid4()),
    })
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        result = storage.operations.status(operation, "migration")
        if result["phase"] in {"completed", "cancelled", "failed"}:
            break
        time.sleep(.025)
    assert result["phase"] == "completed", result
    for output_id, key, _, _ in records:
        assert storage.library.resolve_output(output_id) == target / key
    assert (target / "outputs" / run_id / "manifest.json").read_bytes() == b"external sidecar"
