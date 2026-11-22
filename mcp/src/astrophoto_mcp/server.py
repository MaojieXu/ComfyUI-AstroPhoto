"""The only FastMCP factory: assemble implemented domains and packaged skills."""

import os
from pathlib import Path

import httpx
from fastmcp import FastMCP
from fastmcp.skills.provider import SkillsDirectoryProvider

from . import __version__
from .api.equipment import EquipmentHTTP, credential, direct_url
from .api.library import LibraryHTTP
from .config import resolve_comfy_url
from .tools.equipment import register_equipment_tools
from .tools.init import register_init
from .tools.library import register_library_tools
from .tools.status import register_status

SKILLS_DIRECTORY = Path(__file__).with_name("skills")


def create_server(base_url: str | None = None, *, transport: httpx.AsyncBaseTransport | None = None) -> FastMCP:
    server = FastMCP("ComfyUI AstroPhoto", version=__version__, on_duplicate="error")
    url = resolve_comfy_url(base_url)
    register_status(server, url, transport=transport)
    register_init(server, url, transport=transport)
    token = credential(os.environ.get("ASTROPHOTO_EQUIPMENT_READ_TOKEN", ""))
    if token and direct_url(url):
        register_equipment_tools(server, EquipmentHTTP(url, token, transport))
    library_token = credential(os.environ.get("ASTROPHOTO_LIBRARY_TOKEN", ""))
    if library_token and direct_url(url):
        register_library_tools(server, LibraryHTTP(url, library_token, transport))
    # Only package-owned business skills can be served. Never discover .agents/
    # or user home directories. The official provider validates each skill and
    # fails startup for invalid content; no skills ship in v0.0.1.
    if SKILLS_DIRECTORY.is_dir() and any(SKILLS_DIRECTORY.rglob("SKILL.md")):
        server.add_provider(SkillsDirectoryProvider(SKILLS_DIRECTORY))
    return server
