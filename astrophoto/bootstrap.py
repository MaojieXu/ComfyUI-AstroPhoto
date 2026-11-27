"""Assemble storage only when explicitly called by the host lifecycle."""

from __future__ import annotations

import atexit
import logging
import os
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING

from .core.config import AppConfig, load_config, load_storage_settings
from .core.errors import ConfigurationError, StorageError

if TYPE_CHECKING:
    from .bundles import ProcessingBundle
    from .storage.runtime import StorageRuntime

logger = logging.getLogger(__name__)

# Only expose fixed startup diagnostics in init receipts.
_PUBLIC_RECOVERY_MESSAGES = {
    "Invalid or missing storage settings",
    "Invalid storage manifest",
    "Registered Data Root has an incomplete manifest",
    "Storage exists without its manifest",
    "Storage settings are missing",
}


@dataclass
class Runtime:
    config: AppConfig
    node_registered: Callable[[], bool]
    routes_registered: bool = False
    storage: StorageRuntime | None = None
    storage_error: str | None = None
    trusted_local: bool = False
    storage_source: str = "default"
    processing_bundle: ProcessingBundle | None = None
    storage_error_message: str | None = None
    workflow_root: Path | None = None


def bootstrap(
    node_registered: Callable[[], bool], config: AppConfig | None = None, *,
    processing_bundle: ProcessingBundle | None = None,
) -> Runtime:
    return Runtime(config if config is not None else load_config(), node_registered, processing_bundle=processing_bundle)


def initialize_storage_runtime(runtime: Runtime, *, coordinate=False, host_temp=None) -> None:
    runtime.storage_error_message = None
    try:
        from .storage.runtime import StorageRuntime

        prepare = runtime.processing_bundle.initialize_storage if runtime.processing_bundle is not None else None
        def initialize(path):
            return StorageRuntime.initialize(path, os.environ, prepare=prepare, recover_cache=coordinate,
                                             host_temp=host_temp)

        if coordinate:
            from .storage.data_root import DataRoots

            runtime.storage = DataRoots(runtime.config.data_home).open(runtime.config.data_home, initialize)
        else:
            runtime.storage = initialize(runtime.config.data_home)
        load_storage_settings(runtime.storage.root)
        runtime.storage_error = None
    except Exception as exc:
        runtime.storage = None
        runtime.storage_error = exc.code if isinstance(exc, StorageError) else "STORAGE_INITIALIZATION_FAILED"
        if runtime.storage_error == "DEV_SCHEMA_RESET_REQUIRED":
            runtime.storage_error_message = "This asset database is incompatible with V1. Set ASTROPHOTO_HOME to a new Data Root and restart ComfyUI."
        elif runtime.storage_error == "RECOVERY_REQUIRED":
            message = str(exc)
            if message in _PUBLIC_RECOVERY_MESSAGES:
                runtime.storage_error_message = message
            elif message.startswith("Active Data Root is unavailable: "):
                runtime.storage_error_message = "The active Data Root is unavailable or its storage manifest is missing"
        details = exc.details if isinstance(exc, StorageError) else None
        if details:
            logger.exception("AstroPhoto storage startup failed (%s)", details)
        else:
            logger.exception("AstroPhoto storage startup failed")


def host_runtime(node_registered: Callable[[], bool], processing_bundle: ProcessingBundle | None = None, *, host_temp=None) -> Runtime:
    try:
        runtime = bootstrap(node_registered, processing_bundle=processing_bundle)
    except ConfigurationError:
        runtime = bootstrap(node_registered, load_config({}), processing_bundle=processing_bundle)
        runtime.storage_error = "INVALID_STORAGE_PATH"
        runtime.storage_source = "ASTROPHOTO_HOME"
        return runtime
    if "ASTROPHOTO_HOME" in os.environ:
        runtime.storage_source = "ASTROPHOTO_HOME"
    initialize_storage_runtime(runtime, coordinate=True, host_temp=host_temp)
    if runtime.storage is not None:
        atexit.register(runtime.storage.close, runtime.processing_bundle)
    return runtime
