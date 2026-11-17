"""Read-only diagnostics over the public ComfyUI HTTP API."""

import httpx

from .api.comfy import fetch_status
from .config import HTTP_TIMEOUT, resolve_comfy_url


async def diagnose(base_url: str, *, transport: httpx.AsyncBaseTransport | None = None) -> dict:
    """Probe system stats and the stable node ID without running a workflow."""
    async with httpx.AsyncClient(
        base_url=resolve_comfy_url(base_url), timeout=HTTP_TIMEOUT, transport=transport
    ) as client:
        return await fetch_status(client)
