"""Report implemented capabilities, never infer availability from directories."""


def capabilities(*, node_registered: bool, routes_registered: bool) -> dict:
    result = {
        "status_api": {"available": routes_registered, "reason": None if routes_registered else "not_registered"},
        "drawing_node": {"available": node_registered, "reason": None if node_registered else "not_registered"},
    }
    for name in ("storage", "assets", "software", "processing", "knowledge", "memory", "experiments", "canvas_bridge"):
        result[name] = {"available": False, "reason": "not_implemented"}
    return result
