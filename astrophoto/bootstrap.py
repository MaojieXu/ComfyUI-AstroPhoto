"""Lightweight service assembly; no downloads, persistence or model loading."""

from collections.abc import Callable
from dataclasses import dataclass

from .core.config import AppConfig, load_config


@dataclass
class Runtime:
    config: AppConfig
    node_registered: Callable[[], bool]
    routes_registered: bool = False


def bootstrap(node_registered: Callable[[], bool], config: AppConfig | None = None) -> Runtime:
    return Runtime(config if config is not None else load_config(), node_registered)
