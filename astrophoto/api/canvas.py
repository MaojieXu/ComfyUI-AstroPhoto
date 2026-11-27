"""Route typed commands to a single online ComfyUI page."""

import asyncio
import json
import logging
import os
import tempfile
from dataclasses import dataclass
from functools import partial
from time import time
from uuid import UUID, uuid4

from aiohttp import WSMsgType, web

from ..core.errors import StorageError
from ..storage.paths import checked_path
from .node_tuning import NodeTuning
from .security import authorize_storage_operation, direct_local_request

MAX_COMMANDS = 256
MAX_MESSAGE = 256 * 1024
MAX_WORKFLOW_MESSAGE = 4 * 1024 * 1024
WAIT_SECONDS = 5
logger = logging.getLogger(__name__)


def fail(code, status=400):
    return web.json_response({"error": {"code": code}}, status=status)


def valid_id(value):
    try:
        return isinstance(value, str) and str(UUID(value)) == value
    except ValueError:
        return False


def workflow_path(runtime, value, *, folder=False):
    if (not isinstance(value, str) or not value or len(value) > 240
            or (not folder and not value.endswith(".json"))
            or any(not part or part.startswith(".") or any(char in part for char in "%:\\") for part in value.split("/"))):
        raise StorageError("INVALID_WORKFLOW_PATH")
    root = getattr(runtime, "workflow_root", None)
    if root is None:
        raise StorageError("WORKFLOW_LIBRARY_UNAVAILABLE")
    try:
        target = checked_path(root / value)
        if not target.is_relative_to(root):
            raise StorageError("INVALID_WORKFLOW_PATH")
        return target
    except StorageError as exc:
        raise StorageError("INVALID_WORKFLOW_PATH") from exc


def create_workflow_file(runtime, path, content):
    """Publish a complete file atomically without replacing any existing name."""
    target = workflow_path(runtime, path)
    checked_path(target.parent).mkdir(parents=True, exist_ok=True)
    checked_path(target.parent)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=target.parent, prefix=".astrophoto-", delete=False) as stream:
            temporary = stream.name
            stream.write(content)
            stream.flush()
            os.fsync(stream.fileno())
        os.link(temporary, target)
    finally:
        if temporary is not None:
            try:
                os.unlink(temporary)
            except OSError:
                logger.warning("Could not remove temporary workflow file %s", temporary, exc_info=True)


async def create_workflow(request, *, runtime):
    if not authorize_storage_operation(request, runtime):
        return fail("UNAUTHORIZED_CANVAS_OPERATION", 403)
    try:
        if request.content_length is None or request.content_length > MAX_WORKFLOW_MESSAGE:
            return fail("CANVAS_REQUEST_TOO_LARGE", 413)
        body = await request.json()
        if not isinstance(body, dict) or set(body) != {"path", "content"} or not isinstance(body["content"], str):
            return fail("INVALID_CANVAS_REQUEST")
        await asyncio.to_thread(create_workflow_file, runtime, body["path"], body["content"].encode("utf-8"))
    except FileExistsError:
        return fail("WORKFLOW_EXISTS", 409)
    except StorageError as exc:
        return fail(exc.code)
    except (ValueError, UnicodeError):
        return fail("INVALID_CANVAS_REQUEST")
    except OSError:
        return fail("WORKFLOW_WRITE_FAILED", 500)
    return web.json_response({"created": True})


@dataclass
class Ticket:
    session: str
    payload: dict
    result: asyncio.Future


class CanvasBroker:
    def __init__(self):
        self.pages = {}
        self.commands = {}

    async def dispatch(self, session, payload, command_id, *, wire_payload=None):
        ticket = self.commands.get(command_id)
        if ticket is not None:
            if ticket.session != session or ticket.payload != payload:
                return fail("COMMAND_ID_CONFLICT", 409)
        else:
            page = self.pages.get(session)
            if page is None or page.closed:
                return fail("CANVAS_UNAVAILABLE", 404)
            if len(self.commands) >= MAX_COMMANDS:
                oldest = next((key for key, item in self.commands.items() if item.result.done()), None)
                if oldest is None:
                    return fail("CANVAS_BUSY", 503)
                del self.commands[oldest]
            ticket = Ticket(session, payload, asyncio.get_running_loop().create_future())
            self.commands[command_id] = ticket
            asyncio.get_running_loop().call_later(
                WAIT_SECONDS * 2, self.finish, session, command_id, {"state": "unconfirmed"}
            )
            try:
                await asyncio.wait_for(page.send_json({
                    **(wire_payload if wire_payload is not None else payload), "command_id": command_id,
                    "expires_at": int((time() + WAIT_SECONDS) * 1000),
                }), WAIT_SECONDS)
            except (ConnectionError, RuntimeError, TimeoutError):
                self.finish(session, command_id, {"state": "unconfirmed"})
        try:
            await asyncio.wait_for(asyncio.shield(ticket.result), WAIT_SECONDS)
        except TimeoutError:
            pass
        return self.receipt(command_id, ticket)

    def receipt(self, command_id, ticket):
        reply = ticket.result.result() if ticket.result.done() else {"state": "unconfirmed"}
        return web.json_response({**reply, "session_id": ticket.session, "command_id": command_id,
                                  **({"action": "workflow_run"} if ticket.payload.get("action") == "workflow_run" else {})})

    def finish(self, session, command_id, reply):
        ticket = self.commands.get(command_id)
        if ticket and ticket.session == session and not ticket.result.done():
            ticket.result.set_result(reply)

    def disconnect(self, session):
        self.pages.pop(session, None)
        for command_id, ticket in self.commands.items():
            if ticket.session == session:
                self.finish(session, command_id, {"state": "unconfirmed"})


async def socket(request, *, runtime, broker, tuning):
    if not request.headers.get("Origin") or not direct_local_request(request, runtime):
        return fail("UNAUTHORIZED_CANVAS_OPERATION", 403)
    if len(broker.pages) >= 16:
        return fail("CANVAS_BUSY", 503)
    page = web.WebSocketResponse(heartbeat=15, max_msg_size=MAX_WORKFLOW_MESSAGE)
    await page.prepare(request)
    session = str(uuid4())
    broker.pages[session] = page
    try:
        await page.send_json({"session_id": session})
        async for message in page:
            if message.type != WSMsgType.TEXT:
                continue
            try:
                result = message.json()
            except (ValueError, RecursionError):
                continue
            if (isinstance(result, dict) and valid_id(result.get("command_id"))
                    and result.get("state") in ("completed", "rejected", "partial", "unconfirmed")):
                command_id = result["command_id"]
                ticket = broker.commands.get(command_id)
                if not ticket or ticket.session != session:
                    continue
                action = ticket.payload.get("action")
                if action != "workflow_get" and len(message.data.encode()) > MAX_MESSAGE:
                    result = {"state": "rejected", "error": "CANVAS_RESULT_TOO_LARGE"}
                if action == "workflow_list" and isinstance(result.get("items"), list):
                    validated = []
                    for item in result["items"]:
                        try:
                            workflow_path(runtime, item.get("path"))
                        except (StorageError, OSError, AttributeError):
                            continue
                        validated.append(item)
                    result["items"] = validated
                if ticket.payload.get("action") == "node_inspect" and result["state"] == "completed":
                    result = await tuning.inspect(session, result)
                broker.finish(session, command_id, result)
    finally:
        broker.disconnect(session)
    return page


async def agent(request, *, runtime, broker, tuning, action):
    if (not direct_local_request(request, runtime) or request.headers.get("Origin") is not None
            or request.headers.get("Sec-Fetch-Site") is not None
            or request.headers.get("X-AstroPhoto-Agent") != "1"):
        return fail("UNAUTHORIZED_CANVAS_OPERATION", 403)
    identity = request.headers.get("X-AstroPhoto-Instance-ID")
    if identity and (runtime.storage is None or identity != runtime.storage.workspaces.instance_id):
        return fail("TARGET_INSTANCE_MISMATCH", 409)
    if action == "sessions":
        return web.json_response({"sessions": list(broker.pages)})
    if action == "receipt":
        command_id = request.match_info["id"]
        ticket = broker.commands.get(command_id)
        return broker.receipt(command_id, ticket) if ticket else fail("CANVAS_COMMAND_UNKNOWN", 404)
    if action == "output":
        output_id = request.match_info["id"]
        if not valid_id(output_id):
            return fail("INVALID_REQUEST")
        if runtime.storage is None:
            return fail("STORAGE_UNAVAILABLE", 503)
        try:
            path = await asyncio.to_thread(runtime.storage.library.resolve_output, output_id)
            size = (await asyncio.to_thread(path.stat)).st_size
        except StorageError as exc:
            return fail(exc.code, 404)
        except OSError:
            return fail("OUTPUT_UNAVAILABLE", 404)
        return web.json_response({"output_id": output_id, "path": str(path), "filename": path.name, "size": size})
    try:
        raw = await request.content.readexactly(request.content_length) if (
            request.content_length is not None and request.content_length <= MAX_WORKFLOW_MESSAGE
        ) else None
        body = json.loads(raw) if raw else None
    except (ValueError, RecursionError, asyncio.IncompleteReadError):
        body = None
    async def live(values):
        reply = await broker.dispatch(values["session_id"], {"action": "node_inspect",
            "target_id": values["target_id"], "node_id": values["node_id"]}, str(uuid4()))
        result = json.loads(reply.body)
        if result.get("state") != "completed":
            raise StorageError(result.get("error", "RESULT_UNCONFIRMED").get("code", "CANVAS_UNAVAILABLE")
                               if isinstance(result.get("error"), dict) else result.get("error", "RESULT_UNCONFIRMED"))
        return result

    if action == "node":
        operation = request.match_info["action"]
        required = {
            "preview": {"session_id", "target_id", "node_id", "input_ref", "request_id", "expected_revision", "parameters"},
            "compare": {"session_id", "target_id", "node_id", "input_ref"},
            "list": {"session_id", "target_id", "node_id"},
            "status": set(), "discard": {"preview_id"},
        }
        allowed = {"compare": {"preview_id", "reference", "view"}, "list": {"limit"}, "status": {"preview_id", "request_id"}}
        if (operation not in required or not isinstance(body, dict) or not required[operation] <= body.keys()
                or not body.keys() <= required[operation] | allowed.get(operation, set())
                or (operation == "status" and len(body) != 1)
                or any(not valid_id(body[key]) for key in body.keys() & {
                    "session_id", "target_id", "input_ref", "request_id", "expected_revision", "preview_id"})
                or ("node_id" in body and (type(body["node_id"]) is not int or body["node_id"] < 0))
                or ("limit" in body and (type(body["limit"]) is not int or not 1 <= body["limit"] <= 50))
                or any(not isinstance(body[key], str) for key in body.keys() & {"reference", "view"})):
            return fail("INVALID_REQUEST")
        try:
            return web.json_response(await tuning.operate(operation, body, live))
        except StorageError as exc:
            return fail(exc.code, 409)
        except OSError:
            return fail("SOURCE_UNAVAILABLE", 409)
    if not isinstance(body, dict) or set(body) != {"session_id", "command_id", "payload"}:
        return fail("INVALID_CANVAS_REQUEST")
    session, command_id, payload = body["session_id"], body["command_id"], body["payload"]
    if not valid_id(session) or not valid_id(command_id) or not isinstance(payload, dict):
        return fail("INVALID_CANVAS_REQUEST")
    if payload.get("action") not in (
        "inspect", "find", "apply", "node_search", "node_describe", "canvas_list_subgraphs", "canvas_open_subgraph",
        "workflow_list", "workflow_get", "workflow_new", "workflow_open", "workflow_save", "workflow_rename",
        "workflow_delete", "workflow_import", "workflow_run", "node_inspect",
    ):
        return fail("INVALID_CANVAS_REQUEST")
    if len(raw) > MAX_MESSAGE and payload["action"] != "workflow_import":
        return fail("CANVAS_REQUEST_TOO_LARGE", 413)
    if payload["action"].startswith("workflow_") and payload["action"] not in {"workflow_new", "workflow_run"}:
        try:
            if payload["action"] == "workflow_list":
                if "folder" in payload:
                    workflow_path(runtime, payload["folder"], folder=True)
            else:
                workflow_path(runtime, payload.get("path"))
                if payload["action"] == "workflow_rename":
                    workflow_path(runtime, payload.get("new_path"))
        except (StorageError, OSError) as exc:
            return fail(getattr(exc, "code", "WORKFLOW_LIBRARY_UNAVAILABLE"))
    if payload["action"] in {"workflow_rename", "workflow_delete"} and len(broker.pages) != 1:
        return fail("WORKFLOW_PAGE_AMBIGUOUS", 409)
    if payload["action"] == "apply" and "preview_id" in payload:
        node_id = payload.get("node_id")
        if (type(node_id) is not int or node_id < 0 or any(not valid_id(payload.get(key))
                for key in ("target_id", "expected_revision", "preview_id")) or "commands" in payload):
            return fail("INVALID_REQUEST")
        if command_id in broker.commands:
            return await broker.dispatch(session, payload, command_id)
        try:
            values = await tuning.apply({**payload, "session_id": session}, live)
        except StorageError as exc:
            return fail(exc.code, 409)
        except OSError:
            return fail("SOURCE_UNAVAILABLE", 409)
        return await broker.dispatch(session, payload, command_id, wire_payload={**payload, "commands": [
            {"action": "set_parameters", "node_id": node_id, "values": values},
        ]})
    return await broker.dispatch(session, payload, command_id)


def canvas_routes(runtime):
    broker = CanvasBroker()
    tuning = NodeTuning(runtime)
    bound = partial(agent, runtime=runtime, broker=broker, tuning=tuning)
    return [
        ("GET", "/canvas/socket", partial(socket, runtime=runtime, broker=broker, tuning=tuning), 101),
        ("GET", "/canvas/sessions", partial(bound, action="sessions"), 200),
        ("POST", "/canvas/commands", partial(bound, action="command"), 200),
        ("GET", "/canvas/commands/{id}", partial(bound, action="receipt"), 200),
        ("POST", "/canvas/node/{action}", partial(bound, action="node"), 200),
        ("POST", "/canvas/workflows", partial(create_workflow, runtime=runtime), 200),
        ("GET", "/canvas/outputs/{id}", partial(bound, action="output"), 200),
    ]
