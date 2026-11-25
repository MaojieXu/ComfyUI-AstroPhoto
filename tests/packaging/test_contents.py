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
    assert not any(Path(name).parts[0] in {"mcp", "reference", "frontend", "tests", "benchmark"} for name in files)
    archive = build_registry(tmp_path / "registry.zip")
    names = check_registry(archive, check_versions())
    assert "locales/zh/main.json" in names
    assert "astrophoto/api/status.py" in names
    assert "astrophoto/core/paths.py" in names
    assert {name for name in names if name.startswith("astrophoto/database/migrations/versions/")} == {
        "astrophoto/database/migrations/versions/0001_v1_baseline.py",
    }
    with zipfile.ZipFile(archive, "a") as package:
        package.writestr(leak, "")
    with pytest.raises(ValueError, match="Unexpected Registry"):
        check_registry(archive, check_versions())


@pytest.mark.parametrize("leak", ["nodes/ComfyUIFEExampleVueBasic.py", "astrophoto/core/config.py"])
def test_mcp_artifacts_exclude_extension(mcp_artifacts, tmp_path, leak):
    wheel, sdist = mcp_artifacts
    version = check_versions()
    names = check_wheel(wheel, version)
    assert "astrophoto_mcp/tools/init.py" not in names
    sources = check_sdist(sdist, version)
    assert not any(name.endswith("/src/astrophoto_mcp/tools/init.py") for name in sources)
    assert {"astrophoto_mcp/server.py", "astrophoto_mcp/tools/equipment.py", "astrophoto_mcp/api/equipment.py"} <= set(names)
    assert any("/src/astrophoto_mcp/server.py" in name for name in sources)
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


# Pi review supplement: CASE-01 01-B and CASE-08 08-A. The migration added an
# `extension/` package to the Registry and moved Siril into it, so the release
# filter and the public/bundle direction need a regression check.


def test_registry_archive_ships_only_the_siril_runtime(tmp_path):
    files = registry_files()
    assert "extension/__init__.py" in files
    shipped = {name for name in files if name.startswith("extension/")}
    expected = {
        "extension/__init__.py",
        "extension/siril/__init__.py",
        "extension/siril/_dependencies.py",
        "extension/siril/bundle.py",
        "extension/siril/command_table.py",
        "extension/siril/command_presentation.py",
        "extension/siril/commands.py",
        "extension/siril/node.py",
        "extension/siril/previews.py",
        "extension/siril/processing.py",
        "extension/siril/routes.py",
        "extension/siril/software.py",
    }
    assert expected <= shipped
    for filename in shipped - {"extension/__init__.py"}:
        assert filename.startswith("extension/siril/"), filename
        module = filename.removeprefix("extension/siril/")
        assert "/" not in module and module.endswith(".py") and not module.startswith("test_"), filename
    assert not [name for name in files if name.startswith("extension/siril/frontend")]

    archive = build_registry(tmp_path / "registry.zip")
    names = set(check_registry(archive, check_versions()))
    assert expected <= names
    with zipfile.ZipFile(archive, "a") as package:
        package.writestr("extension/siril/frontend/AutoStretch.tsx", "")
    with pytest.raises(ValueError, match="Unexpected Registry content"):
        check_registry(archive, check_versions())


def test_public_sources_stay_independent_of_the_processing_bundle():
    def sources(*roots, suffixes):
        for root in roots:
            for path in (ROOT / root).rglob("*"):
                if path.is_file() and path.suffix in suffixes and "__pycache__" not in path.parts:
                    yield path, path.read_text(encoding="utf-8")

    # The public frontend must not own Siril entries, components or requests.
    frontend = list(sources("frontend/src", suffixes={".ts", ".tsx", ".vue", ".json"}))
    assert len(frontend) > 30
    for path, text in frontend:
        assert "siril" not in text.lower(), f"Siril-specific public frontend source: {path}"
        assert "extension/" not in text and "from 'extension" not in text, f"public frontend imports a bundle: {path}"

    # The public backend keeps the bundle protocol, never a concrete bundle.
    forbidden = (
        "SirilBundle",
        "siril_routes",
        "extension.siril",
        "extension/siril",
        "SoftwareService",
        "PreviewService",
        "formal_run",
        "renderCandidate",
    )
    backend = list(sources("astrophoto", "nodes", suffixes={".py"}))
    assert len(backend) > 30
    for path, text in backend:
        for token in forbidden:
            assert token not in text, f"public backend references {token}: {path}"
