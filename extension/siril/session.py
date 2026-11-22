"""Run the official scriptable command nodes over staged local paths."""

from dataclasses import dataclass
import json
import math
import os
from pathlib import Path, PureWindowsPath
import re
import shutil
from uuid import UUID, uuid4

from ._dependencies import config, errors, fits, manager, paths
from .commands import command_for
from .processing import prepare_fits, run_script
from .software import SirilTemporaryDirectory, VERSION, executable

STEPS_HELP = "Connect steps from a previous Siril node. Enable Stage only there to build a single CLI session."
ARGUMENTS_HELP = 'JSON array of Siril arguments, e.g. [1.5, "-linked"]. Use {input} for the connected file.'
SINGLE_FILE_COMMANDS = {"load", "jsonmetadata", "mirrorx_single", "livestack", "iadd", "isub", "imul", "idiv"}
LOADS_IMAGE = {"load", "pm", "ffti", "merge_cfa"}
IN_PLACE = {"mirrorx_single"}
CURRENT_RESULT = "_astrophoto_current.fit"
PENDING = "_astrophoto_pending.json"
PRODUCER = "siril-cli-session-v1"
ABSOLUTE_ARGUMENT = re.compile(r"(?:^|=)(?:[/\\~]|[A-Za-z]:[/\\])")
PARENT_COMPONENT = re.compile(r"(?:^|[/\\=])\.\.(?:[/\\]|$)")
SET_VALUE = re.compile(r"^[a-z_]+\.[a-z_]+=", re.IGNORECASE)


@dataclass(frozen=True)
class Step:
    name: str
    args: tuple[str, ...]
    image_path: str
    file_path: str
    directory: str


def quote(argument):
    # Siril's tokenizer supports either opening delimiter and has no escape syntax.
    if not argument or any(char in argument for char in (' ', '"', "'")):
        for delimiter in ('"', "'"):
            if delimiter not in argument:
                return f"{delimiter}{argument}{delimiter}"
        raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", "A Siril argument cannot contain both quote styles")
    return argument


def make_step(command, arguments, image_path, file_path, directory):
    if type(arguments) is not str or len(arguments) > 16000:
        raise errors.StorageError("INVALID_SIRIL_ARGUMENTS")
    try:
        raw = json.loads(arguments)
    except (ValueError, RecursionError) as exc:
        raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", ARGUMENTS_HELP) from exc
    if not isinstance(raw, list) or len(raw) > 48:
        raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", ARGUMENTS_HELP)
    args = []
    for value in raw:
        if type(value) is float and math.isfinite(value):
            value = format(value, ".17g")
        elif type(value) is int:
            value = str(value)
        if (type(value) is not str or any(ord(char) < 32 or ord(char) == 127 for char in value)
                or ABSOLUTE_ARGUMENT.search(value) or PARENT_COMPONENT.search(value)):
            raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", "Use staged paths and one argument per array item")
        quote(value)
        args.append(value)
    if file_path and not args and command.name in SINGLE_FILE_COMMANDS:
        args = ["{input}"]
    if command.name == "pyscript":
        index = int(bool(args) and args[0] == "-async")
        if file_path and len(args) == index:
            args.insert(index, "{input}")
        if not file_path or len(args) <= index or args[index] != "{input}":
            raise errors.StorageError("SIRIL_SCRIPT_NOT_CONFIGURED", "Connect an approved Python script path")
    if command.name == "set" and args:
        setting = args[0].split("=", 1)[0].lower()
        if (not SET_VALUE.match(args[0]) or any(word in setting for word in (
                "path", "directory", "command", "catalog", "executable", "script", "program", "swap"))
                or setting in {"core.wd", "core.starnet_exe", "core.starnet_weights", "core.asnet_dir"}):
            raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", "Use a scalar setting in this temporary Siril session")
    if len(args) < command.minimum_args or not file_path and any("{input}" in arg for arg in args):
        raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", command.usage)
    return Step(command.name, tuple(args), image_path, file_path, directory)


def _relative_name(value):
    if (not value or value in {".", ".."} or value.endswith((".", " "))
            or PureWindowsPath(value).is_reserved()
            or any(ord(char) < 32 or char in '<>:"/\\|?*' for char in value)):
        raise errors.StorageError("INVALID_STORAGE_PATH")
    return value


def _source_path(runtime, value):
    if not isinstance(value, str) or not value:
        raise errors.StorageError("INVALID_STORAGE_PATH")
    path = Path(value)
    if not path.is_absolute():
        _, path = fits.resolve_input(runtime, value)
    return paths.checked_path(path)


def _script_path(path):
    configured = {Path(value) for value in os.environ.get("ASTROPHOTO_SIRIL_PYTHON_SCRIPTS", "").split(os.pathsep)
                  if value}
    if path.suffix.lower() != ".py" or path not in configured:
        raise errors.StorageError("SIRIL_SCRIPT_NOT_CONFIGURED", "This script is not configured on the ComfyUI host")


def _plugin_settings(steps):
    if any(step.name in {"starnet", "seqstarnet"} for step in steps):
        value = os.environ.get("ASTROPHOTO_SIRIL_STARNET")
        if not value:
            raise errors.StorageError("SIRIL_PLUGIN_NOT_CONFIGURED", "Set ASTROPHOTO_SIRIL_STARNET on the host")
        starnet = paths.checked_path(value)
        manager.source_stat(starnet)
        if not os.access(starnet, os.X_OK):
            raise errors.StorageError("SIRIL_PLUGIN_NOT_CONFIGURED", "StarNet must be an executable")
        yield "set " + quote(f"core.starnet_exe={starnet.as_posix()}")
        weights = os.environ.get("ASTROPHOTO_SIRIL_STARNET_WEIGHTS")
        if weights:
            weights = paths.checked_path(weights)
            manager.source_stat(weights)
            yield "set " + quote(f"core.starnet_weights={weights.as_posix()}")
    if any("-localasnet" in step.args for step in steps) and (value := os.environ.get("ASTROPHOTO_SIRIL_ASTROMETRY")):
        astrometry = paths.checked_path(value)
        if not astrometry.is_dir():
            raise errors.StorageError("SIRIL_PLUGIN_NOT_CONFIGURED", "Set the Astrometry.net installation directory")
        yield "set " + quote(f"core.asnet_dir={astrometry.as_posix()}")


def _stage(runtime, steps, work, checkpoint):
    files = {}
    lines = [*_plugin_settings(steps), "setext fit", "set32bits"]
    loaded = False
    last_image = False
    cwd = work

    def copy(source, target):
        existing = files.get(target)
        if existing == source:
            return
        if existing is not None:
            raise errors.StorageError("SIRIL_INPUT_COLLISION", f"More than one source uses {target.name!r}")
        target.parent.mkdir(parents=True, exist_ok=True)
        manager.stage_copy(source, target, manager.fingerprint(manager.source_stat(source)), checkpoint)
        files[target] = source

    for index, step in enumerate(steps):
        checkpoint()
        command = command_for(step.name)
        if step.directory:
            directory = paths.canonicalize_root(step.directory)
            if runtime.root.is_relative_to(directory) or work.is_relative_to(directory):
                raise errors.StorageError("INVALID_STORAGE_PATH", "The source directory contains AstroPhoto's working files")
            if not directory.is_dir():
                raise errors.StorageError("SOURCE_NOT_FOUND")
            for folder, dirs, entries in os.walk(directory):
                folder = paths.checked_path(Path(folder))
                (cwd / folder.relative_to(directory)).mkdir(parents=True, exist_ok=True)
                for name in dirs:
                    paths.checked_path(folder / name)
                for name in entries:
                    source = paths.checked_path(folder / _relative_name(name))
                    copy(source, cwd / source.relative_to(directory))

        if step.image_path and "image" in command.requires:
            source = _source_path(runtime, step.image_path)
            target = work / f"_astrophoto_input_{index}{source.suffix}"
            copy(source, target)
            if source.suffix.lower() in fits.SUFFIXES:
                prepare_fits(target, checkpoint)
            lines.append(f"load {quote(target.as_posix())}")
            loaded = True

        args = step.args
        if step.file_path:
            source = _source_path(runtime, step.file_path)
            if command.name == "pyscript":
                _script_path(source)
            name = _relative_name(source.name)
            target = work / "_astrophoto_inputs" / str(index) / name
            copy(source, target)
            # A fixed relative path lets sequence and filename arguments retain Siril's normal naming rules.
            alias = Path(os.path.relpath(target, cwd)).as_posix()
            args = tuple(arg.replace("{input}", alias) for arg in args)

        if command.name == "cd":
            next_dir = paths.checked_path(cwd / args[0])
            if not next_dir.is_relative_to(work):
                raise errors.StorageError("INVALID_STORAGE_PATH")
            cwd = next_dir
        if "image" in command.requires and not loaded and "sequence" not in command.requires:
            raise errors.StorageError("SIRIL_IMAGE_REQUIRED", "Connect image_path or stage a load command before this node")
        lines.append(" ".join((command.name, *(quote(arg) for arg in args))))
        if command.name == "exit" and index != len(steps) - 1:
            raise errors.StorageError("INVALID_SIRIL_ARGUMENTS", "Exit must be the last command in its session")
        if command.name == "close":
            loaded = False
        elif command.name in LOADS_IMAGE:
            loaded = True
        last_image = loaded and ("image" in command.requires or command.name in LOADS_IMAGE)
    if last_image:
        lines.extend(("setext fit", f"save {quote((work / CURRENT_RESULT).as_posix())}"))
    return lines, files, last_image


def _outputs(work, staged, checkpoint, keep_file_inputs):
    outputs = {}
    for path in sorted(work.rglob("*")):
        checkpoint()
        if path.is_symlink():
            source = path.resolve(strict=True)
            if not source.is_relative_to(work) or not source.is_file():
                raise errors.StorageError("SIRIL_OUTPUT_INVALID", "Siril produced a link outside its work directory")
            data = manager.fingerprint(manager.source_stat(source))
            temp = path.with_name(f"{uuid4()}.copy")
            manager.stage_copy(source, temp, data, checkpoint)
            path.unlink()
            temp.replace(path)
        paths.checked_path(path)
        if path.is_file():
            # Keep staged sequence members for downstream commands and in-place transformations.
            if path in staged and (path.name.startswith("_astrophoto_input_") or
                                   not keep_file_inputs and path.is_relative_to(work / "_astrophoto_inputs")):
                path.unlink()
                continue
            if path == work / PENDING:
                raise errors.StorageError("SIRIL_OUTPUT_INVALID", "A result used the reserved AstroPhoto marker name")
            outputs[path.relative_to(work)] = manager.source_stat(path)
    return outputs


def execute_session(runtime, software, steps, interrupted):
    configuration = software.current()
    cli = Path(configuration["path"])
    workspace = config.load_storage_settings(runtime.root)["workspace"]["default_workspace_id"]
    run_id = str(uuid4())

    def checkpoint():
        interrupted()
        if runtime.closing.is_set():
            raise errors.StorageError("OPERATION_CANCELLED")
        if executable(str(cli))[1] != configuration["fingerprint"]:
            raise errors.StorageError("SIRIL_REVALIDATION_REQUIRED")

    with runtime.formal_processing, runtime.workspaces.lease(workspace):
        root = runtime.workspaces.require(workspace)
        key = f"outputs/{run_id}"
        destination = paths.safe_join_workspace(root, key)
        with (runtime.capacity.reserve(root, 0) as reservation,
              SirilTemporaryDirectory(prefix="siril-session-", dir=root / ".staging") as tmp):
            temp = Path(tmp)
            identity = {"producer": PRODUCER, "instance_id": runtime.workspaces.instance_id,
                        "workspace_id": workspace, "run_id": run_id}
            config.write_json_atomically(temp / PENDING, identity)
            work = temp / "files"
            work.mkdir()
            lines, staged, expect_image = _stage(runtime, steps, work, checkpoint)
            log = run_script(cli, work, temp, lines, checkpoint, timeout=3600)
            outputs = _outputs(work, staged, checkpoint, steps[-1].name in IN_PLACE)
            primary = Path(CURRENT_RESULT) if expect_image else None
            if primary is not None:
                if primary not in outputs:
                    raise errors.StorageError("SIRIL_OUTPUT_INVALID", "Siril did not save the current image")
                fits.inspect_fits(work / primary)
            elif steps[-1].name in IN_PLACE:
                primary = next((path for path in outputs if (work / path) in staged), None)
            else:
                candidates = [path for path in outputs if (work / path) not in staged
                              and path.suffix.lower() in fits.SUFFIXES]
                if len(candidates) == 1:
                    primary = candidates[0]
            if not outputs:
                return "", "", log
            runtime.capacity.recheck(reservation, root, 0, sum(info.st_size for info in outputs.values()))
            records = []
            for relative, info in outputs.items():
                records.append((str(uuid4()), f"{key}/{relative.as_posix()}", None, {
                    "producer": PRODUCER, "command_id": steps[-1].name,
                    "commands": [{"id": step.name, "arguments": list(step.args)} for step in steps],
                    "run_id": run_id, "siril_version": VERSION,
                    "size_bytes": info.st_size, "mtime_ns": info.st_mtime_ns,
                    "sha256": manager.file_hash(work / relative, checkpoint),
                }))
            config.write_json_atomically(work / PENDING, identity)
            checkpoint()
            work.rename(destination)
            try:
                runtime.library.record_outputs(workspace, records)
            except BaseException:
                destination.rename(work)
                raise
            _clear_pending(destination / PENDING)
            return str(destination / primary) if primary else "", str(destination), log


def _clear_pending(marker):
    try:
        marker.unlink(missing_ok=True)
    except OSError:
        # Rechecked at next startup if Windows still holds the file.
        pass


def _pending_run(folder, workspace, instance):
    try:
        marker = paths.checked_path(folder / PENDING)
        pending = config.read_json(marker)
        run_id = pending.get("run_id") if isinstance(pending, dict) else None
        if run_id != str(UUID(run_id)):
            return None
    except (OSError, ValueError, TypeError, AttributeError, errors.StorageError):
        return None
    if pending == {"producer": PRODUCER, "instance_id": instance, "workspace_id": workspace, "run_id": run_id}:
        return run_id
    return None


def recover_sessions(runtime):
    for row in runtime.workspaces.list():
        try:
            with runtime.workspaces.lease(row.id):
                root = runtime.workspaces.require(row.id)
                instance = runtime.workspaces.instance_id
                for folder in paths.safe_join_workspace(root, ".staging").glob("siril-session-*"):
                    if _pending_run(folder, row.id, instance):
                        shutil.rmtree(folder)
                for folder in paths.safe_join_workspace(root, "outputs").iterdir():
                    if folder.name != _pending_run(folder, row.id, instance):
                        continue
                    if runtime.library.has_session_outputs(row.id, folder.name):
                        _clear_pending(folder / PENDING)
                    else:
                        shutil.rmtree(folder)
        except (OSError, errors.StorageError):
            # The Workspace can be offline during startup.
            continue
