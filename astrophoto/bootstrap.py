"""Assemble storage only when explicitly called by the host lifecycle."""

from __future__ import annotations

import logging
import os
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from .core.config import AppConfig, load_config, load_storage_settings
from .core.errors import ConfigurationError, StorageError

if TYPE_CHECKING:
    from .storage.runtime import StorageRuntime

logger = logging.getLogger(__name__)


@dataclass
class Runtime:
    config: AppConfig
    node_registered: Callable[[], bool]
    routes_registered: bool = False
    storage: StorageRuntime | None = None
    storage_error: str | None = None
    trusted_local: bool = False
    storage_source: str = "default"
    equipment_read_token: str | None = field(default=None, repr=False)


def bootstrap(node_registered: Callable[[], bool], config: AppConfig | None = None) -> Runtime:
    return Runtime(config if config is not None else load_config(), node_registered)


def initialize_storage_runtime(runtime: Runtime) -> None:
    try:
        from .storage.runtime import StorageRuntime

        runtime.storage = StorageRuntime.initialize(runtime.config.data_home, os.environ)
        load_storage_settings(runtime.storage.root)
        runtime.storage_error = None
    except Exception as exc:
        runtime.storage = None
        runtime.storage_error = exc.code if isinstance(exc, StorageError) else "STORAGE_INITIALIZATION_FAILED"
        logger.exception("AstroPhoto storage startup failed")


def host_runtime(node_registered: Callable[[], bool]) -> Runtime:
    try:
        runtime = bootstrap(node_registered)
    except ConfigurationError:
        runtime = bootstrap(node_registered, load_config({}))
        runtime.storage_error = "INVALID_STORAGE_PATH"
        runtime.storage_source = "ASTROPHOTO_HOME"
        return runtime
    from .api.security import equipment_read_token

    runtime.equipment_read_token = equipment_read_token(os.environ)
    if "ASTROPHOTO_HOME" in os.environ:
        runtime.storage_source = "ASTROPHOTO_HOME"
    initialize_storage_runtime(runtime)
    return runtime
