"""Storage error envelope and HTTP mapping."""

from aiohttp import web

CONFLICTS = {
    "EQUIPMENT_REFERENCED", "EQUIPMENT_VERSION_CONFLICT", "DRAFT_VERSION_CONFLICT", "TRAIN_ARCHIVED", "REVISION_IMMUTABLE",
    "REVISION_CONFLICT", "IDEMPOTENCY_CONFLICT", "STORAGE_PATH_CONFLICT", "TARGET_NOT_EMPTY",
    "WORKSPACE_OFFLINE", "WORKSPACE_DISABLED", "WORKSPACE_READ_ONLY", "WORKSPACE_IDENTITY_MISMATCH",
    "DEFAULT_WORKSPACE_REQUIRED", "WORKSPACE_NOT_OFFLINE", "WORKSPACE_HAS_ASSETS", "CACHE_IDENTITY_MISMATCH",
    "SOURCE_CHANGED", "DUPLICATE_ASSET", "RECOVERY_REQUIRED", "ASSET_NOT_EXTERNAL",
}


def storage_error_response(exc, request_id, *, equipment=False):
    code = exc.code
    if code in {"UNAUTHORIZED_STORAGE_OPERATION", "SOURCE_NOT_AUTHORIZED", "UNAUTHORIZED_EQUIPMENT_OPERATION"}:
        status = 403
    elif code in {"OPERATION_NOT_FOUND", "WORKSPACE_NOT_FOUND", "ASSET_NOT_FOUND", "SOURCE_NOT_FOUND",
                  "EQUIPMENT_NOT_FOUND", "TRAIN_NOT_FOUND", "REVISION_NOT_FOUND", "PREVIEW_NOT_FOUND"}:
        status = 404
    elif code in CONFLICTS:
        status = 409
    elif code == "STORAGE_BUSY":
        status = 423
    elif code == "INSUFFICIENT_DISK_SPACE":
        status = 507
    elif code in {"STORAGE_INITIALIZATION_FAILED", "STORAGE_UNAVAILABLE", "DATABASE_INVALID", "MIGRATION_REQUIRED", "WAL_UNAVAILABLE"}:
        status = 503
    elif code in {"DEV_SCHEMA_RESET_REQUIRED", "EQUIPMENT_UNAVAILABLE"}:
        status = 503
    elif code == "TRAIN_HISTORY_READ_ONLY":
        status = 410
    elif equipment and code == "INVALID_REQUEST":
        status = 400
    else:
        status = 500 if code == "INTERNAL_STORAGE_ERROR" else 422
    error = {"code": code, "message": str(exc)}
    if exc.details is not None:
        error["details"] = exc.details
    return web.json_response({"error": error, "request_id": request_id}, status=status, headers={"Cache-Control": "no-store"})

