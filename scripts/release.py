"""Synchronize lockstep versions and prepare/check artifacts; never publishes."""

import argparse
from contextlib import contextmanager
from email.parser import Parser
from pathlib import Path
import re
import os
import shutil
import subprocess
import tempfile
import tarfile
import zipfile

try:
    import tomllib
except ModuleNotFoundError:
    import tomli as tomllib

ROOT = Path(__file__).resolve().parents[1]
STABLE_SEMVER = re.compile(r"(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\Z")


@contextmanager
def chdir(path: Path):
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(previous)


def metadata(root: Path = ROOT) -> dict:
    return tomllib.loads((root / "pyproject.toml").read_text(encoding="utf-8"))


def check_versions(root: Path = ROOT, tag: str | None = None) -> str:
    project = metadata(root)["project"]
    version = project["version"]
    if not STABLE_SEMVER.fullmatch(version):
        raise ValueError("Use a stable SemVer X.Y.Z version")
    if metadata(root / "mcp")["project"]["version"] != version:
        raise ValueError("MCP version differs from root version")
    if f"astrophoto-mcp=={version}" not in project["dependencies"]:
        raise ValueError("Extension must pin the matching MCP version")
    if tag is not None and tag != f"v{version}":
        raise ValueError(f"Tag {tag!r} does not match v{version}")
    if (root / "LICENSE").read_bytes() != (root / "mcp/LICENSE").read_bytes():
        raise ValueError("MCP license differs from root LICENSE")
    return version


def sync_version(version: str | None = None, root: Path = ROOT) -> str:
    version = version or metadata(root)["project"]["version"]
    if not STABLE_SEMVER.fullmatch(version):
        raise ValueError("Use a stable SemVer X.Y.Z version")
    for path in (root / "pyproject.toml", root / "mcp/pyproject.toml"):
        text = path.read_text(encoding="utf-8")
        text, count = re.subn(r'^version = "[^"]+"$', f'version = "{version}"', text, count=1, flags=re.M)
        if count != 1:
            raise ValueError(f"Missing literal version in {path}")
        if path.parent == root:
            text = re.sub(r'astrophoto-mcp==[^"\s]+', f"astrophoto-mcp=={version}", text)
        path.write_text(text, encoding="utf-8")
    shutil.copyfile(root / "LICENSE", root / "mcp/LICENSE")
    return check_versions(root)


def registry_files(root: Path = ROOT) -> list[str]:
    """Include uncommitted new files for local review, filtered like Registry."""
    from pathspec import PathSpec

    spec = PathSpec.from_lines("gitwildmatch", (root / ".comfyignore").read_text(encoding="utf-8").splitlines())
    output = subprocess.check_output(
        ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], cwd=root
    ).decode("utf-8")
    files = {name for name in output.split("\0") if name and not spec.match_file(name) and (root / name).is_file()}
    if any((root / name).is_symlink() for name in files):
        raise ValueError("Registry input must not contain symbolic links")
    return sorted(files)


def check_registry(path: Path, version: str) -> list[str]:
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        required = {"__init__.py", "nodes/__init__.py", "nodes/ComfyUIFEExampleVueBasic.py",
                    "astrophoto/bootstrap.py", "astrophoto/api/routes.py", "astrophoto/api/status.py",
                     "astrophoto/core/config.py", "astrophoto/core/paths.py", "astrophoto/core/capabilities.py", "astrophoto/core/errors.py",
                    "astrophoto/database/manager.py", "astrophoto/database/models.py", "astrophoto/database/migrations/env.py",
                    "astrophoto/database/migrations/versions/0001_equipment_baseline.py",
                    "astrophoto/database/equipment_models.py", "astrophoto/api/equipment.py",
                    "astrophoto/equipment/service.py", "astrophoto/equipment/trains.py",
                    "astrophoto/equipment/schemas.py", "astrophoto/equipment/snapshots.py",
                    "astrophoto/storage/runtime.py",
                    "astrophoto/storage/migration.py", "astrophoto/assets/imports.py",
                    "astrophoto/assets/fits.py", "astrophoto/api/scientific.py", "astrophoto/bundles.py",
                    "nodes/scientific.py", "extension/__init__.py", "extension/siril/__init__.py",
                    "extension/siril/_dependencies.py", "extension/siril/bundle.py", "extension/siril/node.py",
                    "extension/siril/routes.py", "extension/siril/processing.py", "extension/siril/previews.py",
                    "extension/siril/software.py",
                    "js/main.js", "js/assets/main.css", "locales/en/main.json", "locales/zh/main.json",
                    "pyproject.toml", "requirements.txt", "LICENSE", "README.md"}
        if not required.issubset(names):
            raise ValueError(f"Missing Registry files: {required - set(names)}")
        if {name for name in names if name.startswith("js/") and name.endswith(".js")} != {"js/main.js"}:
            raise ValueError("Registry must ship exactly one AstroPhoto JavaScript entry")
        allowed_roots = {"nodes", "astrophoto", "extension", "js", "locales"}
        allowed_files = {"__init__.py", "pyproject.toml", "requirements.txt", "LICENSE", "README.md"}
        for name in names:
            parts = Path(name).parts
            prohibited = {".pyc", ".db", ".sqlite", ".sqlite3", ".log", ".tmp"}
            private = {".astrophoto", "databases", "runtime", ".staging", "objects", "outputs", "backups"}
            suffix = Path(name).suffix
            if (".." in parts or "__pycache__" in parts or private.intersection(parts)
                    or suffix in prohibited or name.endswith(("-wal", "-shm", "-journal", ".lock"))
                    or (parts[0] in {"astrophoto", "nodes"} and suffix != ".py")
                    or (parts[0] == "extension" and name != "extension/__init__.py"
                        and (len(parts) != 3 or parts[1] != "siril" or suffix != ".py"))
                    or (name not in allowed_files and parts[0] not in allowed_roots)):
                raise ValueError(f"Unexpected Registry content: {name}")
        project = tomllib.loads(archive.read("pyproject.toml").decode())["project"]
        if project["version"] != version or f"astrophoto-mcp=={version}" not in project["dependencies"]:
            raise ValueError("Registry metadata version/dependency mismatch")
        if archive.read("requirements.txt").decode().splitlines() != project["dependencies"]:
            raise ValueError("Registry requirements must use PyPI, not a local source")
        return sorted(names)


def build_registry(output: Path, root: Path = ROOT) -> Path:
    """Stage runtime files, replace development-only metadata, use official packer."""
    import tomli_w
    from comfy_cli.file_utils import zip_files

    version = check_versions(root)
    output = output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="astrophoto-registry-") as temp:
        stage = Path(temp)
        for name in registry_files(root):
            destination = stage / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(root / name, destination)
        config = metadata(root)
        runtime = {"project": config["project"], "tool": {"comfy": config["tool"]["comfy"]}}
        (stage / "pyproject.toml").write_text(tomli_w.dumps(runtime), encoding="utf-8")
        (stage / "requirements.txt").write_text("\n".join(runtime["project"]["dependencies"]) + "\n", encoding="utf-8")
        # A temporary index ensures the official packer sees new migration files,
        # without staging or modifying anything in the user's repository.
        subprocess.run(["git", "init", "-q"], cwd=stage, check=True)
        subprocess.run(["git", "add", "."], cwd=stage, check=True, capture_output=True)
        with chdir(stage):
            zip_files(str(output), includes=runtime["tool"]["comfy"]["includes"])
    check_registry(output, version)
    return output


def check_wheel(path: Path, version: str) -> list[str]:
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        for name in names:
            top = name.split("/")[0]
            if top not in {"astrophoto_mcp", f"astrophoto_mcp-{version}.dist-info"}:
                raise ValueError(f"Unexpected MCP wheel content: {name}")
        for module in ("__init__", "__main__", "server", "client", "config", "api/__init__", "api/comfy", "api/equipment", "tools/__init__", "tools/status", "tools/equipment"):
            if f"astrophoto_mcp/{module}.py" not in names:
                raise ValueError(f"Missing MCP module: {module}")
        info = [name for name in names if name.endswith(".dist-info/METADATA")]
        if len(info) != 1 or Parser().parsestr(archive.read(info[0]).decode())["Version"] != version:
            raise ValueError("MCP wheel version mismatch")
        return sorted(names)


def check_sdist(path: Path, version: str) -> list[str]:
    prefix = f"astrophoto_mcp-{version}/"
    with tarfile.open(path) as archive:
        names = archive.getnames()
        for member in archive.getmembers():
            name = member.name.removeprefix(prefix)
            if not member.name.startswith(prefix) or not member.isfile() or ".." in Path(name).parts:
                raise ValueError(f"Unexpected MCP sdist entry: {member.name}")
            if not (name.startswith(("src/astrophoto_mcp/", "tests/")) or
                    name in {".gitignore", "LICENSE", "README.md", "pyproject.toml", "PKG-INFO"}):
                raise ValueError(f"Unexpected MCP sdist content: {name}")
        project = tomllib.loads(archive.extractfile(prefix + "pyproject.toml").read().decode())["project"]
        if project["version"] != version:
            raise ValueError("MCP sdist version mismatch")
        return sorted(names)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    sync = sub.add_parser("sync")
    sync.add_argument("version", nargs="?")
    check = sub.add_parser("check")
    check.add_argument("--tag")
    registry = sub.add_parser("registry")
    registry.add_argument("--output", type=Path, default=ROOT / "dist/registry.zip")
    artifacts = sub.add_parser("artifacts")
    artifacts.add_argument("--registry", type=Path, required=True)
    artifacts.add_argument("--wheel", type=Path, required=True)
    artifacts.add_argument("--sdist", type=Path)
    args = parser.parse_args()
    if args.command == "sync":
        print(sync_version(args.version))
    elif args.command == "check":
        print(check_versions(tag=args.tag))
    elif args.command == "registry":
        print(build_registry(args.output))
    else:
        version = check_versions()
        for label, names in (("Registry", check_registry(args.registry, version)), ("MCP", check_wheel(args.wheel, version))):
            print(f"{label}: {len(names)} files\n" + "\n".join(names))
        if args.sdist:
            print(f"MCP sdist: {len(check_sdist(args.sdist, version))} files")


if __name__ == "__main__":
    main()
