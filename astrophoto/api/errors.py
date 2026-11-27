"""Storage error envelope and HTTP mapping."""

from aiohttp import web

CONFLICTS = {
    "EQUIPMENT_VERSION_CONFLICT", "DRAFT_VERSION_CONFLICT", "TRAIN_ARCHIVED",
    "TARGET_INSTANCE_MISMATCH", "REVISION_CONFLICT", "IDEMPOTENCY_CONFLICT", "STORAGE_PATH_CONFLICT", "TARGET_NOT_EMPTY",
    "WORKSPACE_OFFLINE", "WORKSPACE_DISABLED", "WORKSPACE_READ_ONLY", "WORKSPACE_IDENTITY_MISMATCH",
    "DEFAULT_WORKSPACE_REQUIRED", "WORKSPACE_NOT_OFFLINE", "WORKSPACE_HAS_ASSETS", "CACHE_IDENTITY_MISMATCH",
    "WORKSPACE_REBIND_PARTIAL", "WORKSPACE_FILES_MISSING", "MIGRATION_PLAN_STALE", "OBJECT_CONFLICT", "SOURCE_CLEANUP_PENDING",
    "SOURCE_CHANGED", "DUPLICATE_ASSET", "ASSET_NAME_CONFLICT", "RECOVERY_REQUIRED", "ASSET_NOT_EXTERNAL",

    "LIBRARY_RECORD_REFERENCED", "DELETION_CONFIRMATION_REQUIRED", "MANAGED_FILE_DELETE_FAILED",
    "MANAGED_FILE_SHARED", "MANAGED_FILE_OWNERSHIP_UNKNOWN",
    "PREVIEW_EXPIRED", "DIRECT_IMPORT_REPLAN_REQUIRED",
}


def storage_error_response(exc, request_id, *, equipment=False):
    code = exc.code
    if code in {"UNAUTHORIZED_STORAGE_OPERATION", "SOURCE_NOT_AUTHORIZED", "UNAUTHORIZED_EQUIPMENT_OPERATION",
                "UNAUTHORIZED_LIBRARY_OPERATION"}:
        status = 403
    elif code in {"OPERATION_NOT_FOUND", "WORKSPACE_NOT_FOUND", "ASSET_NOT_FOUND", "SOURCE_NOT_FOUND",
                  "EQUIPMENT_NOT_FOUND", "TRAIN_NOT_FOUND", "PREVIEW_NOT_FOUND",
                  "LIBRARY_RECORD_NOT_FOUND", "OUTPUT_NOT_FOUND"}:
        status = 404
    elif code in CONFLICTS:
        status = 409
    elif code == "STORAGE_BUSY":
        status = 423
    elif code in {"INSUFFICIENT_DISK_SPACE", "VOLUME_QUOTA_EXCEEDED", "WORKSPACE_QUOTA_EXCEEDED", "NO_AVAILABLE_WORKSPACE"}:
        status = 507
    elif code in {"STORAGE_INITIALIZATION_FAILED", "STORAGE_UNAVAILABLE", "DATABASE_INVALID", "WAL_UNAVAILABLE"}:
        status = 503
    elif code in {"DEV_SCHEMA_RESET_REQUIRED", "EQUIPMENT_UNAVAILABLE"}:
        status = 503
    elif equipment and code == "INVALID_REQUEST":
        status = 400
    else:
        status = 500 if code == "INTERNAL_STORAGE_ERROR" else 422
    error = {"code": code, "message": str(exc)}
    if exc.details is not None:
        error["details"] = exc.details
    return web.json_response({"error": error, "request_id": request_id}, status=status, headers={"Cache-Control": "no-store"})

