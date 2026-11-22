"""Extension identity and authoritative storage settings."""

import json
import math
import os
import tempfile
import tomllib
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
from uuid import UUID

from .errors import ConfigurationError, StorageError
from .paths import data_home

DEFAULT_PREVIEW_LONGEST_EDGE = 1024
PREVIEW_LONGEST_EDGE_OPTIONS = (512, 1024, 2048, 4096, 0)
DEFAULT_CANVAS_PREVIEW = {"width": 480, "max_height": 320}
CANVAS_PREVIEW_MIN = 64
CANVAS_PREVIEW_MAX = 4096


@dataclass(frozen=True)
class AppConfig:
    extension_id: str
    version: str
    data_home: Path


def load_config(environ: Mapping[str, str] | None = None) -> AppConfig:
    metadata_path = Path(__file__).resolve().parents[2] / "pyproject.toml"
    try:
        project = tomllib.loads(metadata_path.read_text(encoding="utf-8"))["project"]
        name, version = project["name"], project["version"]
        if not isinstance(name, str) or not isinstance(version, str) or not name or not version:
            raise ValueError("missing identity")
    except (OSError, ValueError, KeyError) as exc:
        raise ConfigurationError("Cannot read Extension identity from pyproject.toml") from exc
    return AppConfig(name, version, data_home(environ))


def read_json(path: Path) -> dict:
    if path.stat().st_size > 65536:
        raise ValueError("Configuration exceeds size limit")
    result = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(result, dict):
        raise ValueError("Expected a JSON object")
    return result


def sync_directory(path: Path) -> None:
    if os.name != "nt":
        fd = os.open(path, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(fd)
        finally:
            os.close(fd)


def write_json_atomically(path: Path, data: dict, *, replace=True) -> None:
    fd, temporary = tempfile.mkstemp(dir=path.parent, prefix=f".{path.name}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(data, stream, ensure_ascii=False, allow_nan=False)
            stream.flush()
            os.fsync(stream.fileno())
        if replace:
            os.replace(temporary, path)
        else:
            from ..storage.manager import rename_noreplace

            rename_noreplace(Path(temporary), path)
        sync_directory(path.parent)
    finally:
        Path(temporary).unlink(missing_ok=True)


def validate_mode(value) -> str:
    if value not in ("reference", "copy"):
        raise StorageError("INVALID_IMPORT_MODE")
    return value


def validate_limit(value) -> float:
    if type(value) not in (int, float) or not 0 < value <= 100000 or not math.isfinite(value):
        raise StorageError("INVALID_CACHE_LIMIT")
    return value


def validate_preview_longest_edge(value) -> int:
    if type(value) is not int or value not in PREVIEW_LONGEST_EDGE_OPTIONS:
        raise StorageError("INVALID_PREVIEW_RESOLUTION")
    return value


def preview_longest_edge(settings: dict) -> int:
    return validate_preview_longest_edge(settings.get("preview", {}).get("longest_edge", DEFAULT_PREVIEW_LONGEST_EDGE))


def validate_canvas_preview(value) -> dict:
    if not isinstance(value, dict) or value.keys() != DEFAULT_CANVAS_PREVIEW.keys() or any(
        type(size) is not int or not CANVAS_PREVIEW_MIN <= size <= CANVAS_PREVIEW_MAX for size in value.values()
    ):
        raise StorageError("INVALID_PREVIEW_RESOLUTION")
    return value


def canvas_preview(settings: dict) -> dict:
    return DEFAULT_CANVAS_PREVIEW.copy()


def load_storage_settings(root: Path) -> dict:
    from ..storage.paths import checked_path

    try:
        path = checked_path(root / "config/settings.json")
        if not path.is_file() or path.stat().st_nlink != 1:
            raise ValueError("Missing or unsafe storage settings")
        settings = read_json(path)
        if (settings["schema_version"] != 1 or type(settings["revision"]) is not int or settings["revision"] < 0
                or settings["workspace"]["write_policy"] != "default"):
            raise ValueError("Unsupported settings")
        default_id = settings["workspace"]["default_workspace_id"]
        if str(UUID(default_id)) != default_id:
            raise ValueError("Invalid default workspace ID")
        validate_mode(settings["imports"]["default_mode"])
        validate_limit(settings["cache"]["max_size_gb"])
        preview_longest_edge(settings)
        canvas_preview(settings)
        if not Path(settings["cache"]["path"]).is_absolute():
            raise ValueError("Cache path must be absolute")
        return settings
    except (OSError, ValueError, KeyError, TypeError, AttributeError, StorageError) as exc:
        raise StorageError("RECOVERY_REQUIRED", "Invalid or missing storage settings",
                           details={"path": str(root / "config/settings.json")}) from exc


def write_storage_settings(root: Path, settings: dict, expected_revision: int) -> dict:
    """Caller holds the configuration lock across validation and write."""
    from ..storage.paths import checked_path

    if type(expected_revision) is not int or load_storage_settings(root)["revision"] != expected_revision:
        raise StorageError("REVISION_CONFLICT")
    settings["revision"] = expected_revision + 1
    write_json_atomically(checked_path(root / "config/settings.json"), settings)
    return settings
