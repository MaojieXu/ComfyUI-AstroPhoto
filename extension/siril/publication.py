"""Siril operation directories and verified, workspace-local output staging."""

import os
import shutil
from contextlib import contextmanager
from pathlib import Path
from uuid import UUID

from ._dependencies import config, errors, manager, paths
from .software import SirilTemporaryDirectory

OWNER = ".astrophoto-siril-run.json"


def scratch_root(runtime):
    parent = paths.checked_path(runtime.root / "runtime/scratch")
    parent.mkdir(exist_ok=True)
    return paths.checked_path(parent)


@contextmanager
def operation_directory(parent, workspace, instance, run_id):
    with SirilTemporaryDirectory(prefix=f"siril-run-{run_id}-", dir=paths.checked_path(parent)) as name:
        folder = paths.checked_path(Path(name))
        config.write_json_atomically(folder / OWNER, {"instance_id": instance, "workspace_id": workspace,
                                                      "run_id": run_id, "directory": folder.name})
        yield folder


def recover_directories(parent, workspace, instance):
    """The caller holds this workspace's lease, excluding a live owner."""
    for folder in paths.checked_path(parent).glob("siril-run-*"):
        try:
            record = config.read_json(paths.checked_path(folder / OWNER))
            run_id = str(UUID(record["run_id"]))
        except (OSError, ValueError, KeyError, TypeError, AttributeError, errors.StorageError):
            continue
        if (folder.name.startswith(f"siril-run-{run_id}-") and
                record == {"instance_id": instance, "workspace_id": workspace, "run_id": run_id,
                           "directory": folder.name}):
            shutil.rmtree(folder)


def stage_result(source, target, info, checkpoint, same_volume):
    target.parent.mkdir(parents=True, exist_ok=True)
    if not same_volume:
        return manager.stage_copy(source, target, manager.fingerprint(info), checkpoint, checksum=True)
    digest = manager.file_hash(source, checkpoint)
    with source.open("rb+") as stream:
        os.fsync(stream.fileno())
    manager.publish_object(source, target)
    return digest
