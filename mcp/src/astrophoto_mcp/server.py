"""The only FastMCP factory: assemble implemented domains and packaged skills."""

import os
from pathlib import Path

import httpx
from fastmcp import FastMCP
from fastmcp.skills.provider import SkillsDirectoryProvider

from . import __version__
from .api.equipment import EquipmentHTTP, direct_url
from .api.library import LibraryHTTP
from .config import resolve_comfy_url
from .tools.equipment import register_equipment_tools, register_equipment_write_tools
from .tools.catalog import register_catalog_tools
from .tools.canvas import register_canvas_tools
from .tools.status import register_status
from .target import LocalTarget, TargetMiddleware
from .disclosure import CategoryDisclosure, register_discovery

SKILLS_DIRECTORY = Path(__file__).with_name("skills")

INSTRUCTIONS = """AstroPhoto MCP connects an agent to the AstroPhoto extension for ComfyUI.
AstroPhoto provides persistent management of astrophotography equipment, equipment groups,
assets and projects. The extension also provides ComfyUI nodes; this MCP exposes the
management capabilities described below.

Discover tools progressively: call list_tool_categories to see available categories;
call list_category_tools with the relevant category to obtain tool names, descriptions and
input schemas; then call call_tool with the selected tool name and arguments. Choose only
the categories relevant to the user's task.

Categories: connection (MCP version, connection status and instance selection), equipment
(individual equipment), equipment_groups (groups and their members), library (assets,
imports, subframes, source folders and calibration bindings), projects (projects, logical
folders and asset references),
canvas (find node types, inspect and edit open graphs), workflow (files, execution and job outputs),
and node (inspect a node input and compare one parameter preview at a time).
Availability depends on connection mode; connection_select is only available in automatic mode.

When the connection is unclear, check connection_status. If multiple instances are found,
select the intended one using its selection code. Equipment, library, and project list results
use continue_with for pagination;
codes require a supported scoped session and expire. Library deletion removes managed copies
while preserving external originals. Inspect deletion impact and obtain explicit user approval
before confirming associated changes; file protections remain independent.
Use the returned schemas and report results and errors accurately. Use canvas_list_sessions
to identify a live page before editing. Canvas edits do not submit a workflow to the queue."""


def create_server(base_url: str | None = None, *, transport: httpx.AsyncBaseTransport | None = None) -> FastMCP:
    disclosure = CategoryDisclosure()
    server = FastMCP("ComfyUI AstroPhoto", version=__version__, instructions=INSTRUCTIONS,
                     on_duplicate="error")
    server.local_provider.add_transform(disclosure)
    register_discovery(server, disclosure)
    explicit = base_url if base_url is not None else os.environ.get("COMFYUI_URL")
    url = resolve_comfy_url(explicit) if explicit is not None else LocalTarget(transport)
    if isinstance(url, LocalTarget):
        server.add_middleware(TargetMiddleware(url))
    register_status(server, url, transport=transport)
    if isinstance(url, LocalTarget) or direct_url(url):
        read_api = EquipmentHTTP(url, transport)
        register_equipment_tools(server, read_api)
        register_equipment_write_tools(server, read_api, read_api=read_api)
        library = LibraryHTTP(url, transport)
        register_catalog_tools(server, library, read_api)
        register_canvas_tools(server, library)
    # Only package-owned business skills can be served. Never discover .agents/
    # or user home directories. The official provider validates each skill and
    # fails startup for invalid content.
    if SKILLS_DIRECTORY.is_dir() and any(SKILLS_DIRECTORY.rglob("SKILL.md")):
        server.add_provider(SkillsDirectoryProvider(SKILLS_DIRECTORY))
    return server
