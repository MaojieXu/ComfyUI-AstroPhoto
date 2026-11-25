"""Discover a local AstroPhoto host and bind one target to each MCP call."""

import asyncio
import json
import os
import sqlite3
import sys
from contextlib import closing
from contextvars import ContextVar
from pathlib import Path

import httpx
import psutil
from fastmcp.exceptions import ToolError
from fastmcp.server.middleware import Middleware

from .config import resolve_comfy_url

INSTANCE_HEADER = "X-AstroPhoto-Instance-ID"
_active_target = ContextVar("astrophoto_target", default=None)


def owns_listener(pid, port):
    try:
        return any(
            item.status == psutil.CONN_LISTEN and item.laddr.port == port
            and item.laddr.ip in {"127.0.0.1", "0.0.0.0"}
            for item in psutil.Process(pid).net_connections(kind="tcp4")
        )
    except (psutil.Error, OSError):
        return False


def desktop_ports():
    """Require a live listener owned by the PID recorded in the Desktop lock."""
    if sys.platform == "win32":
        parent = Path(os.environ.get("APPDATA", "")) / "Comfy Desktop" / "port-locks"
    elif sys.platform == "darwin":
        parent = Path.home() / "Library/Application Support/Comfy Desktop/port-locks"
    else:
        parent = Path(os.environ.get("XDG_STATE_HOME", Path.home() / ".local/state")) / "comfyui-desktop-2" / "port-locks"
    ports = set()
    for file in parent.glob("port-*.json"):
        try:
            data = json.loads(file.read_text(encoding="utf-8"))
            port = int(file.stem.removeprefix("port-"))
            pid = data.get("pid") if isinstance(data, dict) else None
            if 1 <= port <= 65535 and type(pid) is int and pid > 0 and owns_listener(pid, port):
                ports.add(port)
        except (OSError, ValueError, TypeError):
            continue
    return ports


def task_database():
    if override := os.environ.get("ASTROPHOTO_MCP_STATE_DIR"):
        return Path(override) / "tasks.sqlite3"
    root = os.environ.get("LOCALAPPDATA") if sys.platform == "win32" else os.environ.get("XDG_STATE_HOME")
    return Path(root or Path.home() / ".local/state") / "astrophoto-mcp" / "tasks.sqlite3"


class TaskOrigins:
    def __init__(self, path):
        self.path = path

    def query(self, task, origin=None):
        try:
            if origin is None and not self.path.exists():
                return []
            self.path.parent.mkdir(parents=True, exist_ok=True)
            with closing(sqlite3.connect(self.path)) as db, db:
                db.execute("CREATE TABLE IF NOT EXISTS tasks (task TEXT, url TEXT, identity TEXT, "
                           "PRIMARY KEY (task, identity))")
                if origin is not None:
                    db.execute("INSERT OR REPLACE INTO tasks VALUES (?, ?, ?)", (task, *origin))
                return db.execute("SELECT url, identity FROM tasks WHERE task = ?", (task,)).fetchall()
        except (OSError, sqlite3.Error) as exc:
            detail = f" Import task {task} was submitted." if origin is not None else ""
            raise ToolError(f"TASK_ORIGIN_STORAGE_ERROR: local task history is unavailable.{detail}") from exc


class LocalTarget:
    def __init__(self, transport=None):
        self.transport = transport
        self.lock = asyncio.Lock()
        self.selected = None
        self.selected_identity = None
        self.candidates = []
        self.tasks = TaskOrigins(task_database())
        self.identities = {}
        self.data_homes = {}
        self.health = {}

    async def probe(self, url, *, require_management=True):
        try:
            async with httpx.AsyncClient(base_url=url, transport=self.transport, timeout=1.0,
                                         trust_env=False, follow_redirects=False) as client:
                response = await client.get("astrophoto/v1/status")
                if response.status_code != 200:
                    self.health[url] = (await client.get("system_stats")).status_code == 200
                    return False
                self.health[url] = True
                payload = response.json()
                if (isinstance(payload, dict) and payload.get("extension", {}).get("id") == "ComfyUI_AstroPhoto"
                        and payload.get("runtime", {}).get("routes_registered") is True
                        and isinstance(payload.get("data_home"), str)
                        and isinstance(payload.get("storage_instance_id"), str)
                        and payload["storage_instance_id"]
                        and (not require_management or all(
                            payload.get("capabilities", {}).get(domain, {}).get("available") is True
                            for domain in ("assets", "equipment")
                        ))):
                    self.data_homes[url] = payload["data_home"]
                    self.identities[url] = payload["storage_instance_id"]
                    return True
                return False
        except (httpx.HTTPError, ValueError, AttributeError):
            self.health[url] = False
            return False

    async def discover(self):
        async def available(ports):
            urls = [f"http://127.0.0.1:{port}/" for port in sorted(ports)]
            results = await asyncio.gather(*(self.probe(url) for url in urls))
            return [url for url, valid in zip(urls, results) if valid]

        ports = await asyncio.to_thread(desktop_ports)
        self.health = {}
        self.candidates = await available(ports)
        if not self.candidates:
            self.candidates = await available({8000, 8188} - ports)
        matches = [url for url in self.candidates if self.identities[url] == self.selected_identity]
        self.selected = matches[0] if len(matches) == 1 else None
        return self.candidates

    async def choose(self):
        candidates = await self.discover()
        if self.selected:
            return self.selected
        if self.selected_identity is not None:
            raise ToolError("SELECTED_INSTANCE_UNAVAILABLE: wait for the selected instance or call connection_select")
        if len(candidates) == 1:
            return candidates[0]
        if candidates:
            raise ToolError("MULTIPLE_INSTANCES: call connection_select with one of " + ", ".join(candidates))
        raise ToolError("COMFYUI_NOT_FOUND: start ComfyUI with AstroPhoto or configure --comfy-url")

    async def select(self, url):
        target = resolve_comfy_url(url)
        if target not in await self.discover():
            raise ToolError("INSTANCE_NOT_FOUND: select a discovered local AstroPhoto instance")
        self.selected_identity = self.identities[target]
        self.selected = target
        return target

    def binding(self):
        target = _active_target.get()
        if target is None:
            raise ToolError("COMFYUI_NOT_FOUND: no target bound to this operation")
        return target

    def current(self):
        return self.binding()[0]


class TargetMiddleware(Middleware):
    def __init__(self, target):
        self.target = target

    async def resolve_binding(self, name, args):
        if name == "library_import_status":
            task = args.get("task")
            if not isinstance(task, str):
                raise ToolError("INVALID_TASK: provide the import task number")
            origins = await asyncio.to_thread(self.target.tasks.query, task)
            if not origins:
                raise ToolError("TASK_ORIGIN_UNKNOWN: import task has no saved origin")
            if len(origins) != 1:
                raise ToolError("TASK_ORIGIN_AMBIGUOUS: use the explicitly configured original host")
            url, identity = origins[0]
            if not await self.target.probe(url) or self.target.identities.get(url) != identity:
                candidates = await self.target.discover()
                matches = [candidate for candidate in candidates if self.target.identities[candidate] == identity]
                if len(matches) != 1:
                    raise ToolError("TASK_ORIGIN_UNAVAILABLE: the original AstroPhoto instance is unavailable")
                url = matches[0]
        else:
            url = await self.target.choose()
            identity = self.target.identities[url]
        return url, identity

    async def on_call_tool(self, context, call_next):
        name = context.message.name
        if name in {"connection_status", "connection_select"}:
            async with self.target.lock:
                return await call_next(context)
        if name in {"version", "list_tool_categories", "list_category_tools", "call_tool"}:
            return await call_next(context)
        async with self.target.lock:
            url, identity = await self.resolve_binding(name, context.message.arguments or {})
        token = _active_target.set((url, identity))
        try:
            result = await call_next(context)
            data = getattr(result, "structured_content", None)
            if name in {"library_import", "library_add_subframes"} and isinstance(data, dict):
                if isinstance(data.get("task"), str):
                    await asyncio.to_thread(self.target.tasks.query, data["task"], (url, identity))
            return result
        finally:
            _active_target.reset(token)
