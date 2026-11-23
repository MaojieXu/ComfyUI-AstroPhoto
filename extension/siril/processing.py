"""Shared Siril script runner and single-frame FITS processing."""

import json
import os
import re
import logging
from contextlib import ExitStack
from dataclasses import asdict
from pathlib import Path
from uuid import UUID, uuid4

from ._dependencies import config as core_config, errors, fits as frame_io, manager, models, paths
from .commands import AUTOSTRETCH, command_for
from .software import VERSION, SirilTemporaryDirectory, executable, run_cli

FAILED_LINE = re.compile(r"(?im)(?:^|log:\s*)(?:error\b|script execution failed|command execution failed)")
SCRATCH_PREFIX = "siril-"
SCRATCH_FILES = ("input.fit", "result.fit", "input.prepared.fit", "result.prepared.fit",
                 "autostretch.ssf", "command.ssf", "siril.config")
logger = logging.getLogger(__name__)


def parameters(values, channels):
    """AutoStretch parameter contract for existing callers."""
    return AUTOSTRETCH.values(values, channels)


def run_script(cli, work_directory, script_directory, commands, checkpoint, timeout=None):
    script = script_directory / "command.ssf"
    script.write_text("\n".join((f"requires {VERSION}", *commands, "")), encoding="utf-8")
    configuration = script_directory / "siril.config"
    configuration.touch(exist_ok=False)
    log = run_cli(cli, ["--offline", "--initfile", str(configuration), "-d", str(work_directory),
                        "-s", str(script)], work_directory, checkpoint, timeout=timeout,
                  log_directory=script_directory)
    if FAILED_LINE.search(log):
        # Include Siril's own diagnostic, without returning an unbounded process log.
        raise errors.StorageError("SIRIL_RUN_FAILED", log[-3000:])
    return log


def process(working, cli, params, checkpoint, timeout=None, *, command=AUTOSTRETCH):
    arguments = " ".join(format(value, ".17g") if isinstance(value, float) else value
                         for value in command.arguments(params))
    operation = f"{command.name} {arguments}".rstrip()
    run_script(cli, working, working, ("setcpu 4", "setext fit", "load input.fit", "set32bits",
                                      operation, "save result"), checkpoint, timeout)
    output = working / "result.fit"
    if not output.is_file():
        raise errors.StorageError("SIRIL_RUN_FAILED", f"Siril did not produce a complete {command.name} output")
    return output


def check_output(input_frame, output_frame):
    if (input_frame.width, input_frame.height, input_frame.channels) != (
        output_frame.width, output_frame.height, output_frame.channels
    ):
        raise errors.StorageError("SIRIL_OUTPUT_INVALID")


def prepare_fits(path, checkpoint):
    """Expose the selected image as a primary HDU and zero non-finite values."""
    import numpy as np
    from astropy.io import fits

    replacement = path.with_suffix(".prepared.fit")
    with fits.open(path, mode="update", memmap=True, do_not_scale_image_data=True) as hdus:
        index, hdu = frame_io.image_hdu(hdus)
        header = hdu.header
        scale = frame_io.scaling_value(header, "BSCALE", 1)
        zero = frame_io.scaling_value(header, "BZERO", 0)
        for key, value in (("BSCALE", scale), ("BZERO", zero)):
            if key in header and not np.isfinite(float(header[key])):
                header[key] = value
                for checksum in ("CHECKSUM", "DATASUM"):
                    header.pop(checksum, None)
        data = hdu.data
        scaled = scale != 1 or zero != 0
        if index:
            selected = fits.PrimaryHDU(data=data, header=header.copy())
            for key in ("BSCALE", "BZERO"):
                if key in header:
                    selected.header[key] = header[key]
            for checksum in ("CHECKSUM", "DATASUM"):
                selected.header.pop(checksum, None)
            selected.writeto(replacement)
            del selected
        else:
            for row in range(0, data.shape[-2], 64):
                checkpoint()
                chunk = data[..., row:row + 64, :]
                if scaled:
                    with np.errstate(invalid="ignore", over="ignore"):
                        invalid = ~np.isfinite(chunk.astype(np.float64) * scale + zero)
                else:
                    invalid = ~np.isfinite(chunk)
                if not invalid.any():
                    continue
                for checksum in ("CHECKSUM", "DATASUM"):
                    header.pop(checksum, None)
                if zero:
                    # Store physical values when raw zero would still have a nonzero offset.
                    with np.errstate(invalid="ignore", over="ignore"):
                        physical = data.astype(np.float64) * scale + zero
                    np.nan_to_num(physical, copy=False, nan=0, posinf=0, neginf=0)
                    hdu.data = physical
                    for key in ("BSCALE", "BZERO", "BLANK"):
                        header.pop(key, None)
                    break
                chunk[invalid] = 0
        del data
    if index:
        del hdu, hdus
        os.replace(replacement, path)
        prepare_fits(path, checkpoint)


def verify_cli(path, working, checkpoint):
    try:
        import numpy as np
        from astropy.io import fits
    except ImportError as exc:
        raise errors.StorageError("FITS_DEPENDENCY_UNAVAILABLE") from exc

    image = np.linspace(0.02, 0.15, 64 * 64, dtype=np.float32).reshape(64, 64)
    image[30:35, 30:35] = 0.8
    fits.writeto(working / "input.fit", np.stack((image, image * 0.8, image * 0.6)))
    try:
        source, _ = frame_io.inspect_fits(working / "input.fit")
        output = process(working, path, parameters({"shadowsclip": -2.8, "targetbg": 0.25, "linked": True}, 3), checkpoint, 15)
        result, _ = frame_io.inspect_fits(output)
        check_output(source, result)
        if np.allclose(fits.getdata(output, memmap=False), fits.getdata(working / "input.fit", memmap=False)):
            raise errors.StorageError("SIRIL_OUTPUT_INVALID")
    except errors.StorageError as exc:
        if exc.code not in {"SIRIL_RUN_TIMEOUT", "SIRIL_BUSY", "SIRIL_REVALIDATION_REQUIRED"}:
            raise errors.StorageError("SIRIL_OPERATION_UNSUPPORTED", str(exc)) from exc
        raise


def stretch(path, configuration, params, working, checkpoint, *, revision, scratch_bytes, command=AUTOSTRETCH):
    expected = list(revision)
    cli = Path(configuration["path"])

    def check():
        checkpoint()
        if executable(str(cli))[1] != configuration["fingerprint"]:
            raise errors.StorageError("SIRIL_REVALIDATION_REQUIRED")

    manager.choose_space(working, scratch_bytes)
    check()
    staged = working / "input.fit"
    digest = manager.stage_copy(path, staged, expected, checkpoint, checksum=True)
    prepare_fits(staged, checkpoint)
    output = process(working, cli, params, check, command=command)
    prepare_fits(output, checkpoint)
    if manager.fingerprint(manager.source_stat(path)) != expected or manager.file_hash(path, checkpoint) != digest:
        raise errors.StorageError("SOURCE_CHANGED")
    return output, digest


def formal_run(runtime, software, image_path: str, values, checkpoint, event, *, provenance=None, command=AUTOSTRETCH) -> tuple[Path, str, str]:
    """Publish a formal result without creating a library asset registration."""
    source_id, input_path = frame_io.resolve_fits_path(runtime, image_path)
    source, _ = frame_io.inspect_fits(input_path)
    params = command.values(values, source.channels)
    configuration = software.current()
    estimate = source.width * source.height * source.channels * 4 + 2 * 2880
    workspace = runtime.capacity.select_workspace(source.scratch_bytes, managed=estimate)
    run_id = str(uuid4())
    original_checkpoint = checkpoint

    def checkpoint():
        if runtime.closing.is_set():
            raise errors.StorageError("OPERATION_CANCELLED")
        original_checkpoint()

    with runtime.formal_processing, runtime.workspaces.lease(workspace), ExitStack() as resources:
        if runtime.closing.is_set():
            raise errors.StorageError("OPERATION_CANCELLED")
        root = runtime.workspaces.require(workspace)
        reservation = resources.enter_context(runtime.capacity.reserve(root, source.scratch_bytes, managed=estimate))
        key = f"outputs/{run_id}"
        folder = paths.safe_join_workspace(root, key)
        folder.mkdir()
        receipt = {"run_id": run_id, "producer": command.producer, "instance_id": runtime.workspaces.instance_id,
                   "source": {"asset_id": source_id, **asdict(source)}, "parameters": params, "siril_version": VERSION,
                   "software_verified_at": configuration["verified_at"], "workspace_id": workspace, "state": "running"}
        if command != AUTOSTRETCH:
            receipt["command_id"] = command.name
        if provenance:
            receipt["workflow_source"] = provenance
        manifest = folder / "manifest.json"
        core_config.write_json_atomically(manifest, receipt)
        output = folder / command.output_filename
        try:
            event({"state": "running", "run_id": run_id})
            with SirilTemporaryDirectory(prefix="scratch-", dir=folder) as tmp:
                path, digest = stretch(input_path, configuration, params, Path(tmp), checkpoint,
                                       revision=source.revision, scratch_bytes=source.scratch_bytes, command=command)
                result, _ = frame_io.inspect_fits(path)
                check_output(source, result)
                with path.open("r+b") as stream:
                    os.fsync(stream.fileno())
                checkpoint()
                runtime.capacity.recheck(reservation, root, 0, path.stat().st_size + manifest.stat().st_size)
                manager.publish_object(path, output)
            info = manager.source_stat(output)
            result, _ = frame_io.inspect_fits(output)
            receipt.update(state="completed", source_sha256=digest, output={"output_id": run_id, **asdict(result)},
                           output_sha256=manager.file_hash(output, checkpoint), output_id=run_id)
            core_config.write_json_atomically(manifest, receipt)
            provenance_record = {
                "producer": receipt["producer"], "siril_version": VERSION, "parameters": params,
                "size_bytes": info.st_size, "mtime_ns": info.st_mtime_ns, "sha256": receipt["output_sha256"],
                "receipt_size_bytes": manifest.stat().st_size,
                **({"command_id": command.name} if command != AUTOSTRETCH else {}),
                **(provenance or {}),
            }
            with runtime.capacity.lock:
                runtime.capacity.recheck(reservation, root, 0, info.st_size + manifest.stat().st_size)
                runtime.library.record_output(run_id, workspace, f"{key}/{command.output_filename}", source_id, provenance_record)
        except BaseException as exc:
            manager.remove_stage(output)
            receipt.update(state="failed" if isinstance(exc, Exception) else "cancelled",
                           error=getattr(exc, "code", type(exc).__name__))
            _store_failure_receipt(runtime, folder, manifest, receipt)
            event({"state": receipt["state"], "error": receipt["error"], "run_id": run_id})
            raise
        return output, run_id, source_id


def _store_failure_receipt(runtime, folder, manifest, receipt):
    try:
        runtime.cache.store("processing", json.dumps(receipt, ensure_ascii=False).encode("utf-8"))
    except (errors.StorageError, OSError):
        logger.warning("Could not cache Siril diagnostics for %s", receipt["run_id"])
    manager.remove_stage(manifest)
    if not any(folder.iterdir()):
        folder.rmdir()


def recover_runs(runtime):
    """Reconcile unfinished runs without a formal output or legacy asset record."""
    for row in runtime.workspaces.list():
        try:
            with runtime.workspaces.lease(row.id):
                root = runtime.workspaces.require(row.id)
                for folder in paths.safe_join_workspace(root, "outputs").iterdir():
                    try:
                        if str(UUID(folder.name)) != folder.name:
                            continue
                    except ValueError:
                        continue
                    path = paths.checked_path(folder / "manifest.json")
                    if not path.is_file():
                        continue
                    try:
                        receipt = core_config.read_json(path)
                    except (ValueError, OSError):
                        continue
                    try:
                        command = command_for(receipt.get("command_id", "autostretch"))
                    except (errors.StorageError, TypeError):
                        continue
                    if (not command.fits_preview or receipt.get("producer") != command.producer or receipt.get("workspace_id") != row.id
                            or receipt.get("run_id") != folder.name or receipt.get("instance_id") != runtime.workspaces.instance_id
                            or receipt.get("state") not in {"running", "completed", "failed", "cancelled", "interrupted"}):
                        continue
                    with runtime.db.session() as session:
                        registered = session.get(models.Asset, folder.name) is not None
                    if registered or runtime.library.has_output(folder.name):
                        continue
                    manager.remove_stage(folder / command.output_filename)
                    for scratch in folder.glob("scratch-*"):
                        scratch = paths.checked_path(scratch)
                        if scratch.is_dir():
                            for name in SCRATCH_FILES:
                                manager.remove_stage(scratch / name)
                            if not any(scratch.iterdir()):
                                scratch.rmdir()
                    receipt.update(state="interrupted", error="SIRIL_RUN_INTERRUPTED")
                    _store_failure_receipt(runtime, folder, path, receipt)
        except (errors.StorageError, OSError):
            logger.warning("Siril recovery deferred for Workspace %s", row.id)

