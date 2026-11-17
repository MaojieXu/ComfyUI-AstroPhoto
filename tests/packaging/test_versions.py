import shutil

import pytest

from scripts.release import ROOT, check_versions, sync_version


def test_versions_and_tag():
    assert check_versions(tag="v" + check_versions())
    with pytest.raises(ValueError, match="Tag"):
        check_versions(tag="v999.0.0")


def test_sync_and_mismatch(tmp_path):
    (tmp_path / "mcp").mkdir()
    for name in ("pyproject.toml", "mcp/pyproject.toml", "LICENSE", "mcp/LICENSE"):
        shutil.copyfile(ROOT / name, tmp_path / name)
    assert sync_version("1.2.3", tmp_path) == "1.2.3"
    assert check_versions(tmp_path, "v1.2.3") == "1.2.3"
    path = tmp_path / "mcp/pyproject.toml"
    path.write_text(path.read_text().replace('version = "1.2.3"', 'version = "1.2.4"'))
    with pytest.raises(ValueError, match="MCP version"):
        check_versions(tmp_path)
    with pytest.raises(ValueError, match="SemVer"):
        sync_version("01.2.3", tmp_path)


