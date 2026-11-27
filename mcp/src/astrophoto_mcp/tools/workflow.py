"""Native ComfyUI workflow files, frozen submissions, and task-scoped outputs."""

from typing import Annotated, Literal
from collections import OrderedDict
from urllib.parse import urlencode
from uuid import UUID

from fastmcp.exceptions import ToolError
from pydantic import Field

Path = Annotated[str, Field(min_length=1, max_length=240)]
Revision = Annotated[str, Field(pattern=r"^[a-f0-9]{64}$")]
READ = {"readOnlyHint": True, "openWorldHint": False}
WRITE = {"idempotentHint": True, "openWorldHint": False}


def artifacts(task_id, outputs):
    if not isinstance(outputs, dict):
        return []
    result = []
    for node_id, media in outputs.items():
        if not isinstance(media, dict):
            continue
        for media_type, entries in media.items():
            if not isinstance(entries, list):
                continue
            for item in entries:
                if media_type == "astrophoto_output" and isinstance(item, str):
                    try:
                        output_id = str(UUID(item))
                    except ValueError:
                        continue
                    if output_id != item:
                        continue
                    result.append({"artifact_id": f"{task_id}:{len(result)}", "node_id": node_id,
                                   "media_type": "fits", "output_id": output_id})
                    continue
                if media_type == "astrophoto_artifacts" and isinstance(item, dict):
                    try:
                        output_id = str(UUID(item.get("output_id", "")))
                    except (ValueError, TypeError, AttributeError):
                        continue
                    if output_id != item.get("output_id") or not isinstance(item.get("media_type"), str):
                        continue
                    result.append({"artifact_id": f"{task_id}:{len(result)}", "node_id": node_id,
                                   "media_type": item["media_type"], "output_id": output_id})
                    continue
                if not isinstance(item, dict):
                    continue
                filename, folder, file_type = (item.get("filename"), item.get("subfolder", ""), item.get("type"))
                if (not isinstance(filename, str) or not filename or filename in {".", ".."}
                        or any(char in filename for char in "/\\:\x00") or not isinstance(folder, str)
                        or any(part in {".", ".."} for part in folder.split("/"))
                        or any(char in folder for char in "\\:\x00") or folder.startswith("/")
                        or file_type not in {"output", "temp"}):
                    continue
                result.append({"artifact_id": f"{task_id}:{len(result)}", "node_id": node_id,
                               "media_type": media_type, "filename": filename, "subfolder": folder, "type": file_type})
    return result


def register_workflow_tools(server, api, dispatch, select):
    cancelled_pending_jobs = OrderedDict()

    async def action(name, session_id=None, request_id=None, **fields):
        return await dispatch(await select(session_id),
                              {"action": name, **{key: value for key, value in fields.items() if value is not None}},
                              request_id)

    @server.tool(annotations=READ)
    async def workflow_list(query: Path | None = None, folder: Path | None = None,
                            limit: Annotated[int, Field(ge=1, le=100)] = 50,
                            cursor: Path | None = None, session_id: UUID | None = None) -> dict:
        """List saved native workflow files for the selected ComfyUI page."""
        return await action("workflow_list", session_id, query=query, folder=folder, limit=limit, cursor=cursor)

    @server.tool(annotations=READ)
    async def workflow_get(path: Path, session_id: UUID | None = None) -> dict:
        """Read a saved workflow and its file revision. Use canvas_get for live edits."""
        return await action("workflow_get", session_id, path=path)

    @server.tool(annotations=WRITE)
    async def workflow_new(session_id: UUID, request_id: UUID) -> dict:
        """Open an empty workflow in a new tab; the current draft stays open."""
        return await action("workflow_new", session_id, request_id)

    @server.tool(annotations=WRITE)
    async def workflow_open(session_id: UUID, path: Path, request_id: UUID) -> dict:
        """Open a saved workflow or focus its existing tab and draft."""
        return await action("workflow_open", session_id, request_id, path=path)

    @server.tool(annotations=WRITE)
    async def workflow_save(session_id: UUID, target_id: UUID, expected_revision: UUID, path: Path,
                            request_id: UUID, mode: Literal["save_as"] = "save_as") -> dict:
        """Save a snapshot of the guarded main graph as a new workflow file."""
        return await action("workflow_save", session_id, request_id, target_id=str(target_id),
                            expected_revision=str(expected_revision), path=path, mode=mode)

    @server.tool(annotations={**WRITE, "destructiveHint": True})
    async def workflow_rename(path: Path, new_path: Path, expected_file_revision: Revision,
                              request_id: UUID, session_id: UUID | None = None) -> dict:
        """Move a closed saved workflow within the library without overwriting a destination."""
        return await action("workflow_rename", session_id, request_id, path=path, new_path=new_path,
                            expected_file_revision=expected_file_revision)

    @server.tool(annotations={**WRITE, "destructiveHint": True})
    async def workflow_delete(path: Path, expected_file_revision: Revision,
                              request_id: UUID, session_id: UUID | None = None) -> dict:
        """Delete a closed saved workflow only if its file revision still matches."""
        return await action("workflow_delete", session_id, request_id, path=path,
                            expected_file_revision=expected_file_revision)

    @server.tool(annotations=WRITE)
    async def workflow_import(path: Path, workflow: dict, request_id: UUID,
                              session_id: UUID | None = None) -> dict:
        """Store a native ComfyUI graph in a new workflow file."""
        return await action("workflow_import", session_id, request_id, path=path, workflow=workflow)

    @server.tool(annotations=WRITE)
    async def workflow_run(session_id: UUID, target_id: UUID, expected_revision: UUID, request_id: UUID) -> dict:
        """Submit one snapshot of the current main graph. Keep request_id to recover the receipt."""
        result = await action("workflow_run", session_id, request_id, target_id=str(target_id),
                              expected_revision=str(expected_revision))
        return {**result, "request_id": str(request_id)}

    @server.tool(annotations=READ)
    async def workflow_status(task_id: UUID | None = None, request_id: UUID | None = None) -> dict:
        """Read a host job by task_id, or recover its submission receipt using request_id."""
        if (task_id is None) == (request_id is None):
            raise ToolError("INVALID_REQUEST: supply exactly one task_id or request_id")
        receipt = None
        if request_id is not None:
            try:
                receipt = await api.canvas_request("GET", f"commands/{request_id}")
            except ToolError as exc:
                if not str(exc).startswith("CANVAS_COMMAND_UNKNOWN:"):
                    raise
            if receipt is None:
                task_id = request_id
            elif receipt.get("action") != "workflow_run":
                raise ToolError("WORKFLOW_REQUEST_UNKNOWN: this request does not submit a workflow")
            elif receipt["state"] == "rejected":
                return {**receipt, "request_id": str(request_id)}
            else:
                task_id = UUID(receipt["task_id"]) if receipt.get("task_id") else request_id
        job = await api.native_job(task_id)
        pending_cancelled = (api.instance_key(), task_id) in cancelled_pending_jobs
        if not job and receipt and not receipt.get("task_id"):
            if not pending_cancelled:
                return {**receipt, "request_id": str(request_id)}
        return {"task_id": str(task_id), "state": job.get("status") if job else "cancelled" if pending_cancelled else "unknown",
                "outputs": artifacts(task_id, job.get("outputs")) if job else [],
                **({"request_id": str(request_id)} if request_id else {}),
                **({"error": job["execution_error"]} if job and job.get("execution_error") else {})}

    @server.tool(annotations={**WRITE, "destructiveHint": True})
    async def workflow_cancel(task_id: UUID) -> dict:
        """Request cancellation of exactly this ComfyUI job."""
        command = await api.native_job(task_id, cancel=True)
        if command is None:
            raise ToolError("JOB_CANCEL_UNAVAILABLE: the host does not expose targeted cancellation")
        job = await api.native_job(task_id)
        sent = command.get("cancelled") is True
        key = (api.instance_key(), task_id)
        if sent and job is None:
            # ComfyUI removes pending jobs without adding a history entry.
            cancelled_pending_jobs[key] = None
            cancelled_pending_jobs.move_to_end(key)
            if len(cancelled_pending_jobs) > 256:
                cancelled_pending_jobs.popitem(last=False)
        return {"task_id": str(task_id), "cancel_requested": sent,
                "state": job["status"] if job else "cancelled" if key in cancelled_pending_jobs else "unknown"}

    @server.tool(annotations=READ)
    async def artifact_get(artifact_id: Annotated[str, Field(pattern=r"^[0-9a-f-]{36}:[0-9]{1,8}$")]) -> dict:
        """Resolve an output reported by this host job; return its native view reference."""
        task, index = artifact_id.split(":")
        try:
            task_id = UUID(task)
        except ValueError:
            raise ToolError("ARTIFACT_NOT_FOUND: invalid artifact reference") from None
        job = await api.native_job(task_id)
        item = next((row for row in artifacts(task_id, job.get("outputs")) if row["artifact_id"] == artifact_id), None) if job else None
        if item is None:
            raise ToolError("ARTIFACT_NOT_FOUND: output is not in this host's job history")
        if "output_id" in item:
            try:
                info = await api.canvas_request("GET", f"outputs/{item['output_id']}")
            except ToolError as exc:
                if not str(exc).startswith(("OUTPUT_NOT_FOUND:", "SOURCE_NOT_FOUND:", "OUTPUT_UNAVAILABLE:")):
                    raise
                return {"metadata": item, "availability": "missing"}
            return {"metadata": {**item, **info}, "availability": "available"}
        params = {key: item[key] for key in ("filename", "subfolder", "type")}
        reference = "view?" + urlencode(params)
        # A range probe checks the actual output without reading the entire file.
        available = await api.native_artifact_available(reference)
        return {"metadata": item, "availability": "available" if available else "missing",
                **({"content_ref": reference} if available else {})}
