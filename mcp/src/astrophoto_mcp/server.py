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
from .tools.agent_imports import register_agent_import_tools
from .tools.equipment import register_equipment_tools, register_equipment_write_tools
from .tools.library import register_library_tools
from .tools.status import register_status

SKILLS_DIRECTORY = Path(__file__).with_name("skills")


def create_server(base_url: str | None = None, *, transport: httpx.AsyncBaseTransport | None = None) -> FastMCP:
    server = FastMCP("ComfyUI AstroPhoto", version=__version__, on_duplicate="error")
    url = resolve_comfy_url(base_url)
    register_status(server, url, transport=transport)
    token = credential(os.environ.get("ASTROPHOTO_EQUIPMENT_READ_TOKEN", ""))
    library_token = credential(os.environ.get("ASTROPHOTO_LIBRARY_TOKEN", ""))
    equipment_write_token = credential(os.environ.get("ASTROPHOTO_EQUIPMENT_WRITE_TOKEN", ""))
    configured_approval = credential(os.environ.get("ASTROPHOTO_APPROVAL_TOKEN", ""))
    approval_token = configured_approval
    if (os.environ.get("ASTROPHOTO_TRUST_CHAT_APPROVALS") != "1" or
            approval_token in (token, library_token, equipment_write_token)):
        approval_token = None
    if direct_url(url):
        read_api = EquipmentHTTP(url, token, transport) if token else None
        if read_api:
            register_equipment_tools(server, read_api)
        if equipment_write_token and equipment_write_token not in (token, library_token, configured_approval):
            register_equipment_write_tools(server, EquipmentHTTP(url, equipment_write_token, transport),
                                           approval_token=approval_token, read_api=read_api)
        if library_token:
            library = LibraryHTTP(url, library_token, transport)
            register_library_tools(server, library)
            approver = LibraryHTTP(url, approval_token, transport) if approval_token else None
            register_agent_import_tools(server, library, approver)
    # Only package-owned business skills can be served. Never discover .agents/
    # or user home directories. The official provider validates each skill and
    # fails startup for invalid content; no skills ship in v0.0.1.
    if SKILLS_DIRECTORY.is_dir() and any(SKILLS_DIRECTORY.rglob("SKILL.md")):
        server.add_provider(SkillsDirectoryProvider(SKILLS_DIRECTORY))
    return server
