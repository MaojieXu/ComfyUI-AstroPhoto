"""Read only configuration used by the current backend."""

from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
import tomllib

from .errors import ConfigurationError
from .paths import data_home


@dataclass(frozen=True)
class AppConfig:
    extension_id: str
    version: str
    data_home: Path


def load_config(environ: Mapping[str, str] | None = None) -> AppConfig:
    # The same root metadata is shipped in Registry artifacts. No MCP import.
    metadata_path = Path(__file__).resolve().parents[2] / "pyproject.toml"
    try:
        project = tomllib.loads(metadata_path.read_text(encoding="utf-8"))["project"]
        name, version = project["name"], project["version"]
        if not isinstance(name, str) or not isinstance(version, str) or not name or not version:
            raise ValueError("missing identity")
    except (OSError, ValueError, KeyError) as exc:
        raise ConfigurationError("Cannot read Extension identity from pyproject.toml") from exc
    return AppConfig(name, version, data_home(environ))
