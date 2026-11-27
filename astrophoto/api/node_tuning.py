"""Transient, canvas-bound inputs and single-candidate Siril previews."""

import asyncio
import base64
import os
from collections import OrderedDict
from dataclasses import dataclass
from time import monotonic
from uuid import uuid4

from ..assets import fits
from ..core.errors import StorageError
from ..storage.manager import fingerprint, source_stat
from ..storage.paths import checked_path

TTL = 900
VIEWS = {"full", "center", "tl", "tr", "bl", "br"}


@dataclass(frozen=True)
class Input:
    target: tuple
    source: str
    revision: tuple
    expires: float


class NodeTuning:
    def __init__(self, runtime):
        self.runtime = runtime
        self.inputs = OrderedDict()
        self.previews = OrderedDict()
        self.lock = asyncio.Lock()

    @property
    def service(self):
        service = getattr(getattr(self.runtime, "processing_bundle", None), "previews", None)
        if service is None:
            raise StorageError("PREVIEW_UNAVAILABLE")
        return service

    def _path(self, source):
        if self.runtime.storage is None:
            raise StorageError("STORAGE_UNAVAILABLE")
        _, path = fits.resolve_input(self.runtime.storage, source)
        return checked_path(path)

    def _read_source(self, source):
        path = self._path(source)
        if path.suffix.lower() not in fits.SUFFIXES:
            raise StorageError("FITS_INVALID")
        return tuple(fingerprint(source_stat(path)))

    def _validate_provenance(self, provenance):
        if not isinstance(provenance, list):
            raise StorageError("SOURCE_CHANGED")
        for entry in provenance:
            if not isinstance(entry, dict) or not isinstance(entry.get("sources"), dict) or not isinstance(entry.get("sourceRefs"), list):
                raise StorageError("SOURCE_CHANGED")
            sources = entry["sources"]
            for path, expected in sources.items():
                if not isinstance(path, str) or not isinstance(expected, list):
                    raise StorageError("SOURCE_CHANGED")
                if fingerprint(source_stat(checked_path(path))) != expected:
                    raise StorageError("SOURCE_CHANGED")
            normalized = {os.path.normcase(path) for path in sources}
            for source in entry["sourceRefs"]:
                if not isinstance(source, str) or os.path.normcase(str(self._path(source))) not in normalized:
                    raise StorageError("SOURCE_CHANGED")

    async def inspect(self, session, reply):
        source = reply.pop("private_source", None)
        formal = reply.pop("private_formal", None)
        provenance = reply.pop("private_provenance", [])
        if not reply.get("preview_capability"):
            return {**reply, "input_state": "unsupported"}
        if not source:
            return {**reply, "input_state": "missing"}
        try:
            await asyncio.to_thread(self._validate_provenance, provenance)
            revision = await asyncio.to_thread(self._read_source, source)
        except (StorageError, OSError) as exc:
            return {**reply, "input_state": "unavailable", "input_error": getattr(exc, "code", "SOURCE_UNAVAILABLE")}

        target = (session, reply["target_id"], reply["node_id"])
        now = monotonic()
        for ref, record in list(self.inputs.items()):
            if record.expires <= now:
                self.inputs.pop(ref)
        ref = next((key for key, record in self.inputs.items()
                    if (record.target, record.source, record.revision) == (target, source, revision)), None)
        if ref is None:
            ref = str(uuid4())
        self.inputs[ref] = Input(target, source, revision, now + TTL)
        self.inputs.move_to_end(ref)
        if len(self.inputs) > 256:
            self.inputs.popitem(last=False)
        summary = {**reply, "input_state": "available", "input_ref": ref}
        if formal:
            try:
                aligned, _ = await asyncio.to_thread(self.service.formal_view, source, formal, reply["parameters"])
                summary["current_result"] = {"result_id": formal, "aligned": aligned}
            except (StorageError, OSError, ValueError):
                pass
        return summary

    async def validate_input(self, ref, target):
        value = self.inputs.get(ref)
        if value is None or value.expires <= monotonic() or value.target != target:
            raise StorageError("INPUT_REFERENCE_EXPIRED")
        if await asyncio.to_thread(self._read_source, value.source) != value.revision:
            raise StorageError("SOURCE_CHANGED")
        return value

    def _preview(self, preview_id=None, request_id=None):
        if request_id:
            row = self.previews.get(request_id)
        else:
            row = next((entry for entry in self.previews.values() if entry["preview_id"] == preview_id), None)
        if row is None:
            raise StorageError("PREVIEW_EXPIRED")
        return row

    def _status(self, row):
        if row.get("discarded"):
            return {"preview_id": row["preview_id"], "request_id": row["request_id"], "state": "discarded"}
        state = self.service.status(row["preview_id"])
        result = {"preview_id": row["preview_id"], "request_id": row["request_id"], "input_ref": row["input_ref"],
                  "state": state["state"], "effective_parameters": state.get("parameters")}
        if state.get("error"):
            result["error"] = state["error"]
        if state["state"] == "ready":
            result["result"] = {key: state.get(key) for key in ("aligned", "version", "channels")}
        return result

    async def start(self, request, live):
        request_id = request["request_id"]
        async with self.lock:
            old = self.previews.get(request_id)
            if old is not None:
                if old["request"] != request:
                    raise StorageError("REQUEST_CONFLICT")
                return self._status(old)
            current = await live(request)
            if current.get("revision") != request["expected_revision"]:
                raise StorageError("GRAPH_CONFLICT")
            if current.get("input_ref") != request["input_ref"]:
                raise StorageError("SOURCE_CHANGED")
            target = (request["session_id"], request["target_id"], request["node_id"])
            value = await self.validate_input(request["input_ref"], target)
            values = request["parameters"]
            if not isinstance(values, dict) or not values or not values.keys() <= current["parameters"].keys():
                raise StorageError("INVALID_AUTOSTRETCH_PARAMETERS")
            for previous in self.previews.values():
                if previous["target"] == target:
                    try:
                        previous_state = self._status(previous)["state"]
                    except StorageError:
                        continue
                    if previous_state in {"running", "queued"}:
                        raise StorageError("PREVIEW_RUNNING")
            params = {**current["parameters"], **values}
            job = await asyncio.to_thread(self.service.start, str(uuid4()), value.source, params, capture_views=True,
                                          expected_revision=value.revision)
            row = {"target": target, "request": request, "input_ref": request["input_ref"],
                   "request_id": request_id, "preview_id": job["job_id"]}
            self.previews[request_id] = row
            if len(self.previews) > 128:
                self.previews.popitem(last=False)
            return self._status(row)

    async def compare(self, request, live):
        current = await live(request)
        if current.get("input_ref") != request["input_ref"]:
            raise StorageError("SOURCE_CHANGED")
        target = (request["session_id"], request["target_id"], request["node_id"])
        value = await self.validate_input(request["input_ref"], target)
        view = request.get("view", "full")
        reference = request.get("reference", "input")
        if view not in VIEWS or reference not in {"input", "current"}:
            raise StorageError("INVALID_REQUEST")
        candidate = request.get("preview_id")
        if candidate:
            row = self._preview(preview_id=candidate)
            if row["target"] != target or row["input_ref"] != request["input_ref"]:
                raise StorageError("SOURCE_CHANGED")
            status = self._status(row)
            if status["state"] != "ready":
                raise StorageError("PREVIEW_NOT_READY")
            if not status["result"]["aligned"] and view != "full":
                raise StorageError("PREVIEW_UNALIGNED_USE_FULL")
            aligned = status["result"]["aligned"]
            await asyncio.to_thread(self.service.validate, candidate)
            after = await asyncio.to_thread(self.service.agent_view, candidate, view)
        else:
            status, after, aligned = {}, None, True
        formal = current.get("current_result")
        if reference == "current" and (not formal or not candidate):
            raise StorageError("CURRENT_RESULT_UNAVAILABLE")
        formal_view = None
        if formal and (not candidate or reference == "current"):
            formal_aligned, formal_view = await asyncio.to_thread(
                self.service.formal_view, value.source, formal["result_id"], current["parameters"], view)
            aligned = aligned and formal_aligned
            if not aligned and view != "full":
                raise StorageError("PREVIEW_UNALIGNED_USE_FULL")
        if reference == "current":
            before = formal_view
        else:
            rendered = await asyncio.to_thread(fits.agent_views, self._path(value.source), value.revision, (view,))
            before = rendered[view]
        images = []
        for label, item in ((reference, before), ("preview" if candidate else "current", after or formal_view)):
            if item:
                geometry, data = item
                images.append({"side": label, "geometry": geometry, "data": base64.b64encode(data).decode("ascii")})
        return {"images": images, "view": view, "input_ref": request["input_ref"], "preview_id": candidate,
                "effective_parameters": status.get("effective_parameters"), "aligned": aligned,
                "warnings": [] if aligned else ["GEOMETRY_UNALIGNED"]}

    async def apply(self, request, live):
        row = self._preview(preview_id=request["preview_id"])
        target = (request["session_id"], request["target_id"], request["node_id"])
        if row["target"] != target:
            raise StorageError("PREVIEW_TARGET_MISMATCH")
        current = await live(request)
        if current.get("revision") != request["expected_revision"]:
            raise StorageError("GRAPH_CONFLICT")
        if current.get("input_ref") != row["input_ref"]:
            raise StorageError("SOURCE_CHANGED")
        await self.validate_input(row["input_ref"], target)
        await asyncio.to_thread(self.service.validate, row["preview_id"])
        status = self._status(row)
        if status["state"] != "ready":
            raise StorageError("PREVIEW_NOT_READY")
        return status["effective_parameters"]

    async def operate(self, action, request, live):
        if action == "preview":
            return await self.start(request, live)
        if action == "compare":
            return await self.compare(request, live)
        if action == "list":
            target = (request["session_id"], request["target_id"], request["node_id"])
            rows = []
            for row in reversed(self.previews.values()):
                if row["target"] == target:
                    try:
                        rows.append(self._status(row))
                    except StorageError:
                        continue
                if len(rows) >= request.get("limit", 10):
                    break
            return {"previews": rows}
        row = self._preview(request.get("preview_id"), request.get("request_id"))
        if action == "status":
            return self._status(row)
        if action == "discard":
            if row.get("discarded"):
                return {"preview_id": row["preview_id"], "discarded": True, "state": "discarded"}
            discarded, state = await asyncio.to_thread(self.service.discard, row["preview_id"])
            if discarded:
                row["discarded"] = True
                state = "discarded"
            return {"preview_id": row["preview_id"], "discarded": discarded, "state": state}
        raise StorageError("INVALID_REQUEST")
