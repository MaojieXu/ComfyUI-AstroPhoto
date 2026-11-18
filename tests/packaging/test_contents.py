from pathlib import Path
import zipfile
import subprocess
import re
from urllib.parse import urljoin

import pytest

from scripts.release import ROOT, build_registry, check_registry, check_versions, registry_files, check_wheel, check_sdist


@pytest.fixture(scope="module")
def mcp_artifacts(tmp_path_factory):
    destination = tmp_path_factory.mktemp("mcp-distributions")
    subprocess.run(["uv", "build", str(ROOT / "mcp"), "--no-sources", "--out-dir", str(destination)],
                   check=True, capture_output=True, text=True)
    return next(destination.glob("*.whl")), next(destination.glob("*.tar.gz"))


@pytest.mark.parametrize("leak", ["mcp/src/leaked.py", "astrophoto/databases/assets.db", "astrophoto/.astrophoto/config/settings.json"])
def test_registry_archive(tmp_path, leak):
    files = registry_files()
    assert not any(Path(name).parts[0] in {"mcp", "reference", "frontend", "tests"} for name in files)
    archive = build_registry(tmp_path / "registry.zip")
    names = check_registry(archive, check_versions())
    assert "locales/zh/main.json" in names
    assert "astrophoto/api/status.py" in names
    assert "astrophoto/core/paths.py" in names
    assert "astrophoto/database/migrations/versions/0001_equipment_baseline.py" in names
    with zipfile.ZipFile(archive, "a") as package:
        package.writestr(leak, "")
    with pytest.raises(ValueError, match="Unexpected Registry"):
        check_registry(archive, check_versions())


@pytest.mark.parametrize("leak", ["nodes/ComfyUIFEExampleVueBasic.py", "astrophoto/core/config.py"])
def test_mcp_artifacts_exclude_extension(mcp_artifacts, tmp_path, leak):
    wheel, sdist = mcp_artifacts
    version = check_versions()
    names = check_wheel(wheel, version)
    assert {"astrophoto_mcp/server.py", "astrophoto_mcp/tools/equipment.py", "astrophoto_mcp/api/equipment.py"} <= set(names)
    assert any("/src/astrophoto_mcp/server.py" in name for name in check_sdist(sdist, version))
    # Check the guard also rejects an accidentally bundled Extension module.
    corrupted = tmp_path / wheel.name
    corrupted.write_bytes(wheel.read_bytes())
    with zipfile.ZipFile(corrupted, "a") as package:
        package.writestr(leak, "")
    with pytest.raises(ValueError, match="Unexpected MCP wheel"):
        check_wheel(corrupted, version)


def test_built_frontend_external_urls_preserve_proxy_prefix():
    source = (ROOT / "js/main.js").read_text(encoding="utf-8")
    imports = re.findall(r'\bimport\s*\{[^}]+\}\s*from\s*"([^"]+)"', source)
    assert set(imports) == {"../../scripts/app.js", "../../scripts/api.js"}
    for url in imports:
        assert urljoin("http://comfy.test/proxy/extensions/ComfyUI_AstroPhoto/main.js", url).startswith("http://comfy.test/proxy/scripts/")
