"""Report implemented capabilities, never infer availability from directories."""


def capabilities(*, node_registered: bool, routes_registered: bool) -> dict:
    result = {
        "status_api": {"available": routes_registered, "reason": None if routes_registered else "not_registered"},
        "drawing_node": {"available": node_registered, "reason": None if node_registered else "not_registered"},
    }
    for name in ("storage", "assets", "software", "processing", "knowledge", "memory", "experiments", "canvas_bridge"):
        result[name] = {"available": False, "reason": "not_implemented"}
    return result


def storage_capabilities(runtime) -> dict:
    if runtime.storage is None and runtime.storage_error is None:
        return {}
    reason = runtime.storage_error
    if runtime.storage is not None:
        try:
            runtime.storage.db.health()
        except Exception as exc:
            reason = getattr(exc, "code", "DATABASE_INVALID")
    ready = reason is None
    domain_reason = reason or ("not_registered" if not runtime.routes_registered else
                               "local_storage_disabled" if not runtime.trusted_local else None)
    processing_reason = domain_reason
    if processing_reason is None:
        siril = runtime.storage.siril.status()
        processing_reason = None if siril["state"] == "ready" else siril["state"]
    return {
        **{name: {"available": domain_reason is None, "reason": domain_reason}
           for name in ("equipment", "optical_trains")},
        "software": {"available": domain_reason is None, "reason": domain_reason},
        "processing": {"available": processing_reason is None, "reason": processing_reason},
        "storage": {"available": ready, "reason": reason},
        "database": {"available": ready, "reason": reason},
        "assets": {"available": ready and runtime.trusted_local,
                   "reason": reason or (None if runtime.trusted_local else "local_storage_disabled")},
    }
