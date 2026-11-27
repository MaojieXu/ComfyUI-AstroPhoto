"""Prepare immutable-source file sets for a downstream directory consumer."""

import logging
from contextlib import ExitStack
from pathlib import Path
from tempfile import TemporaryDirectory

from ..core.config import write_json_atomically
from ..core.errors import StorageError
from .manager import choose_space, fingerprint, source_stat, stage_copy
from .paths import checked_path

logger = logging.getLogger(__name__)


def collect_files(entries, checkpoint=lambda: None):
    """Expand directories one level only, preserving input and filename order."""
    files = []
    for value in entries:
        checkpoint()
        path = checked_path(value)
        if path.is_dir():
            files.extend(sorted((child for child in path.iterdir() if child.is_file()),
                                key=lambda child: (child.name.casefold(), child.name)))
        else:
            source_stat(path)
            files.append(path)
    if not files:
        raise StorageError("SOURCE_NOT_FOUND", "No input files")
    return files


def _names(files):
    """Allocate names without overwriting even when names already have suffixes."""
    reserved = {path.name.casefold() for path in files}
    used = set()
    result = []
    for path in files:
        name = path.name
        if name.casefold() in used:
            number = 2
            while True:
                name = f"{path.stem}_{number}{path.suffix}"
                if name.casefold() not in used and name.casefold() not in reserved:
                    break
                number += 1
        used.add(name.casefold())
        result.append(name)
    return result


def aggregate(entries, directory, checkpoint=lambda: None, progress=lambda _done, _total: None, *, snapshots=None):
    """Copy inputs into a leased temporary directory; caller owns the returned lease."""
    files = collect_files(entries, checkpoint) if snapshots is None else entries
    if snapshots is None:
        snapshots = [fingerprint(source_stat(path)) for path in files]
    directory = checked_path(directory)
    choose_space(directory, sum(info[0] for info in snapshots))
    lease = TemporaryDirectory(prefix="astrophoto-aggregate-", dir=directory)
    try:
        root = Path(lease.name)
        mapping = []
        for index, (source, expected, name) in enumerate(zip(files, snapshots, _names(files), strict=True)):
            checkpoint()
            target = root / name
            stage_copy(source, target, expected, checkpoint)
            mapping.append((str(source), str(target)))
            progress(index + 1, len(files))
        for source, expected in zip(files, snapshots, strict=True):
            if fingerprint(source_stat(source)) != expected:
                raise StorageError("SOURCE_CHANGED")
        return lease, mapping
    except BaseException:
        lease.cleanup()
        raise


class AggregationRuns:
    """Own work folders until ComfyUI finishes the prompt, including error and cancellation."""

    def __init__(self, runtime):
        self.runtime = runtime
        self.active = {}

    def prepare(self, prompt_id, entries, checkpoint, progress):
        files = collect_files(entries, checkpoint)
        snapshots = [fingerprint(source_stat(path)) for path in files]
        with ExitStack() as stack:
            scratch = stack.enter_context(self.runtime.cache.scratch(
                sum(info[0] for info in snapshots), prefix="aggregate-", files=("mapping.json",), tree="files"))
            directory = scratch / "files"
            directory.mkdir()
            lease, mapping = aggregate(files, directory, checkpoint, progress, snapshots=snapshots)
            stack.callback(lease.cleanup)
            write_json_atomically(scratch / "mapping.json", {"files": {target: source for source, target in mapping}})
            self.active.setdefault(prompt_id, []).append(stack.pop_all())
        return lease.name, mapping

    def finish(self, prompt_id):
        for stack in reversed(self.active.pop(prompt_id, [])):
            try:
                stack.close()
            except OSError:
                logger.warning("Aggregation cleanup deferred until recovery", exc_info=True)

    def close(self):
        for prompt_id in tuple(self.active):
            self.finish(prompt_id)
