"""Resolve data paths only on demand; never create directories on import."""

import os
from collections.abc import Mapping
from pathlib import Path

from .errors import ConfigurationError


def data_home(environ: Mapping[str, str] | None = None) -> Path:
    values = os.environ if environ is None else environ
    override = values.get("ASTROPHOTO_HOME")
    if override is None:
        return Path.home() / ".astrophoto"
    if not override.strip() or "\0" in override:
        raise ConfigurationError("ASTROPHOTO_HOME must be a nonempty absolute directory path")
    path = Path(override)
    if not path.is_absolute():
        raise ConfigurationError("ASTROPHOTO_HOME must be an absolute directory path")
    return path  # No exists(), mkdir(), scans or database creation.
