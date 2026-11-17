import importlib
from pathlib import Path

import pytest

from astrophoto.core.config import load_config
from astrophoto.core.errors import ConfigurationError
from astrophoto.core import paths


def test_import_and_config_do_not_create_directories(monkeypatch, tmp_path):
    root = tmp_path / "not-created"
    monkeypatch.setenv("ASTROPHOTO_HOME", str(root))
    importlib.reload(paths)
    assert paths.data_home() == root
    config = load_config()
    assert config.data_home == root
    assert config.extension_id == "ComfyUI_AstroPhoto"
    assert config.version == "0.0.1"
    assert not root.exists()
    assert list(tmp_path.iterdir()) == []


def test_default_data_home(monkeypatch, tmp_path):
    monkeypatch.setattr(Path, "home", lambda: tmp_path)
    assert paths.data_home({}) == tmp_path / ".astrophoto"
    assert not (tmp_path / ".astrophoto").exists()


@pytest.mark.parametrize("value", ["", " ", "relative/data", "bad\0path"])
def test_invalid_home(value):
    with pytest.raises(ConfigurationError):
        paths.data_home({"ASTROPHOTO_HOME": value})
