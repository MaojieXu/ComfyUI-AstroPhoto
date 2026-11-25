"""One-off TC-01 acceptance probe with the repository's ComfyUI V3 double."""

import asyncio
from pathlib import Path
from uuid import UUID

from astrophoto.api.routes import STATUS_PATH
from astrophoto.core.config import load_storage_settings
from astrophoto.storage.initializer import load_manifest


def test_first_load_creates_structure(request, monkeypatch, tmp_path):
    root = tmp_path / "data"
    monkeypatch.setenv("ASTROPHOTO_HOME", str(root))
    extension = request.getfixturevalue("extension")
    assert Path.home() == tmp_path / "home"
    assert not root.exists()

    async def exercise():
        plugin = await extension.module.comfy_entrypoint()
        assert not root.exists()
        await plugin.on_load()
        for name in ("config", "database", "storage", "runtime"):
            assert (root / name).is_dir(), name
        manifest = load_manifest(root)
        settings = load_storage_settings(root)
        assert manifest["initialized"] is True
        assert manifest["format_version"] == 1
        for key in ("instance_id", "initial_workspace_id"):
            assert str(UUID(manifest[key])) == manifest[key], key
        assert settings["workspace"]["default_workspace_id"] == manifest["initial_workspace_id"]
        assert settings["schema_version"] == 1
        assert settings["revision"] == 0
        assert settings["imports"]["default_mode"] == "reference"
        assert settings["workspace"]["write_policy"] == "default"
        assert settings["cache"] == {"path": str(root / "runtime/cache"), "max_size_gb": 20}
        assert (root / "config/roots.json").is_file()
        assert not (Path.home() / ".astrophoto-control").exists()
        paths = [root / "config" / name for name in ("manifest.json", "settings.json")]
        contents = [path.read_bytes() for path in paths]
        await plugin.on_load()
        assert [path.read_bytes() for path in paths] == contents
        assert sum(route.path == STATUS_PATH for route in extension.routes) == 1

    asyncio.run(exercise())
