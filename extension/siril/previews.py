"""Cancellable previews over the active cache."""

import hashlib
import json
import threading
import time
from collections import OrderedDict
from dataclasses import dataclass, field
from uuid import uuid4

from ._dependencies import config as core_config, errors, fits, manager, paths
from .commands import AUTOSTRETCH, Command
from .processing import SCRATCH_FILES, SCRATCH_PREFIX, check_output, stretch

TTL = 900


@dataclass
class PreviewJob:
    id: str
    owner: str
    asset: str
    values: dict
    formal: str | None = None
    command: Command = AUTOSTRETCH
    state: str = "queued"
    stop: threading.Event = field(default_factory=threading.Event)
    result: dict = field(default_factory=dict)
    images: dict = field(default_factory=dict)
    touched: float = field(default_factory=time.monotonic)
    software_fingerprint: list | None = None

    def checkpoint(self):
        if self.stop.is_set():
            raise errors.StorageError("PREVIEW_CANCELLED")


class PreviewService:
    def __init__(self, runtime, software):
        self.runtime = runtime
        self.software = software
        self.lock = threading.Lock()
        self.jobs = OrderedDict()
        self.workers = set()

    def shutdown(self):
        with self.lock:
            workers = tuple(self.workers)
            for job in self.jobs.values():
                job.stop.set()
        for worker in workers:
            worker.join()

    def _run_worker(self, job):
        try:
            self._run(job)
        finally:
            with self.lock:
                self.workers.discard(threading.current_thread())

    def start(self, owner, asset, values, formal=None, *, command=AUTOSTRETCH):
        command.values(values, 3)
        if core_config.load_storage_settings(self.runtime.root).get("software", {}).get("siril_enabled", True) is not True:
            raise errors.StorageError("SIRIL_DISABLED")
        with self.lock:
            now = time.monotonic()
            for job in list(self.jobs.values()):
                if job.owner == owner and job.state in {"queued", "running"}:
                    job.stop.set()
                if job.state not in {"queued", "running"} and (now - job.touched > TTL or len(self.jobs) >= 128):
                    self.jobs.pop(job.id, None)
            job = PreviewJob(str(uuid4()), owner, asset, values, formal, command)
            worker = threading.Thread(target=self._run_worker, args=(job,), name="astrophoto-preview", daemon=True)
            self.jobs[job.id] = job
            self.workers.add(worker)
            try:
                worker.start()
            except RuntimeError:
                self.workers.remove(worker)
                self.jobs.pop(job.id)
                raise
            return {"job_id": job.id, "state": "queued"}

    def _job(self, job_id):
        if job_id not in self.jobs:
            raise errors.StorageError("PREVIEW_NOT_FOUND")
        job = self.jobs[job_id]
        job.touched = time.monotonic()
        return job

    def status(self, job_id):
        with self.lock:
            job = self._job(job_id)
            return {"job_id": job.id, "state": job.state, **job.result}

    def cancel(self, job_id):
        with self.lock:
            job = self._job(job_id)
            job.stop.set()
            return {"job_id": job.id, "state": job.state}

    def read(self, job_id, side, *, validate_only=False):
        with self.lock:
            job = self._job(job_id)
            path = job.images.get(side)
            expected = job.result.get("revision")
        if path is None:
            raise errors.StorageError("PREVIEW_NOT_FOUND")
        if [str(value) for value in manager.fingerprint(manager.source_stat(fits.resolve_input(self.runtime, job.asset)[1]))] != expected:
            raise errors.StorageError("PREVIEW_STALE")
        if job.formal and side == "after":
            current = manager.fingerprint(manager.source_stat(fits.resolve_result(self.runtime, job.formal)))
            if [str(item) for item in current] != job.result.get("output_revision"):
                raise errors.StorageError("PREVIEW_STALE")
        return self.runtime.cache.read_entry("previews", path, validate_only=validate_only)

    def validate(self, job_id):
        with self.lock:
            job = self._job(job_id)
            if not job.images:
                raise errors.StorageError("PREVIEW_NOT_FOUND")
            images = dict(job.images)
        for side in images:
            self.read(job_id, side, validate_only=True)
        if job.software_fingerprint is not None and self.software.current()["fingerprint"] != job.software_fingerprint:
            raise errors.StorageError("PREVIEW_STALE")
        return {"valid": True}

    def _formal_result(self, job, source_id, revision, params, longest_edge):
        output = fits.resolve_result(self.runtime, job.formal)
        if output.name != job.command.output_filename or output.parent.name != job.formal or output.parent.parent.name != "outputs":
            raise errors.StorageError("PREVIEW_STALE")
        try:
            receipt = core_config.read_json(paths.checked_path(output.parent / "manifest.json"))
        except (OSError, ValueError) as exc:
            raise errors.StorageError("PREVIEW_STALE") from exc
        source = receipt.get("source")
        if (not isinstance(source, dict) or source.get("asset_id") != source_id or
                source.get("revision") != list(revision) or receipt.get("parameters") != params or
                receipt.get("producer") != job.command.producer or
                receipt.get("command_id", "autostretch") != job.command.name or
                receipt.get("instance_id") != self.runtime.workspaces.instance_id or
                receipt.get("state") != "completed" or receipt.get("output_id", receipt.get("asset_id")) != job.formal):
            raise errors.StorageError("PREVIEW_STALE")
        if manager.file_hash(output, job.checkpoint) != receipt.get("output_sha256"):
            raise errors.StorageError("PREVIEW_STALE")
        result, png = fits.inspect_fits(output, thumbnail=True, longest_edge=longest_edge)
        return result, png, receipt["siril_version"]

    def _run(self, job):
        with self.lock:
            job.state = "running"
        try:
            job.checkpoint()
            runtime = self.runtime
            longest_edge = core_config.preview_longest_edge(core_config.load_storage_settings(runtime.root))
            identity, path = fits.resolve_input(runtime, job.asset)
            source, before = fits.inspect_fits(path, thumbnail=True, longest_edge=longest_edge)
            width, height = fits.preview_dimensions(source.width, source.height, longest_edge)
            params = job.command.values(job.values, source.channels)
            revision = [str(value) for value in source.revision]
            before_path = runtime.cache.store("previews", before)
            with self.lock:
                job.result.update(revision=revision, width=width, height=height, channels=source.channels,
                                  parameters=params, before=True)
                job.images["before"] = before_path
            if job.formal:
                result, after, version = self._formal_result(job, identity, source.revision, params, longest_edge)
                check_output(source, result)
                after_path = runtime.cache.store("previews", after)
                with self.lock:
                    job.checkpoint()
                    job.images["after"] = after_path
                    job.result.update(after=True, aligned=self._aligned(source, result), version=version, formal=True,
                                      output_revision=[str(item) for item in result.revision])
                    job.state = "ready"
                return
            config = self.software.current()
            parameter_hash = hashlib.sha256(json.dumps(params, sort_keys=True).encode()).hexdigest()
            key = (job.command.name, job.asset, source.revision, parameter_hash, tuple(config["fingerprint"]), "linear-png-v3", longest_edge)
            with self.lock:
                cached = next((other for other in reversed(self.jobs.values())
                               if other.result.get("cache_key") == key and other.state == "ready"), None)
            if cached is not None:
                try:
                    runtime.cache.read_entry("previews", cached.images["after"], validate_only=True)
                except (errors.StorageError, OSError):
                    cached = None
            if cached is None:
                with runtime.cache.scratch(source.scratch_bytes, prefix=SCRATCH_PREFIX, files=SCRATCH_FILES) as working:
                    output, _ = stretch(path, config, params, working, job.checkpoint,
                                        revision=source.revision, scratch_bytes=source.scratch_bytes,
                                        command=job.command)
                    result, after = fits.inspect_fits(output, thumbnail=True, longest_edge=longest_edge)
                    check_output(source, result)
                job.checkpoint()
                after_path = runtime.cache.store("previews", after)
                aligned = self._aligned(source, result)
            else:
                after_path = cached.images["after"]
                aligned = cached.result["aligned"]
            with self.lock:
                job.checkpoint()
                job.images["after"] = after_path
                job.software_fingerprint = config["fingerprint"]
                job.result.update(after=True, aligned=aligned, version=config["version"], parameter_hash=parameter_hash,
                                  cache_key=key)
                job.state = "ready"
        except Exception as exc:
            code = getattr(exc, "code", "PREVIEW_FAILED")
            with self.lock:
                job.result["error"] = code
                job.state = "cancelled" if job.stop.is_set() else "failed"

    @staticmethod
    def _aligned(source, result):
        for frame in (source, result):
            if str(dict(frame.metadata).get("ROWORDER", "BOTTOM-UP")).strip().upper() not in {"TOP-DOWN", "BOTTOM-UP"}:
                return False
        return tuple(pair for pair in source.coordinate_keys if pair[0] != "ROWORDER") == tuple(
            pair for pair in result.coordinate_keys if pair[0] != "ROWORDER"
        )

