"""Interpret the official ComfyUI diagnostic endpoints."""

import httpx


async def fetch_status(client: httpx.AsyncClient) -> dict:
    # Relative request paths preserve a configured reverse-proxy prefix.
    stats = await client.get("system_stats")
    stats.raise_for_status()
    info = await client.get("object_info/vue-basic")
    info.raise_for_status()
    stats_data, node_data = stats.json(), info.json()
    if not isinstance(stats_data, dict) or not isinstance(node_data, dict):
        raise ValueError("ComfyUI diagnostic endpoints must return JSON objects")
    system = stats_data.get("system", {})
    if not isinstance(system, dict):
        raise ValueError("ComfyUI system_stats.system must be a JSON object")
    return {
        "reachable": True,
        "extension_registered": "vue-basic" in node_data,
        "system": system,
    }
