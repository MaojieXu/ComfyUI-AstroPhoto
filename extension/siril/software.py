"""Discover and pin a verified Siril CLI in the existing storage configuration."""

import os
import platform
import re
import shutil
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

from ._dependencies import config as core_config, errors, manager, paths

VERSION = "1.4.5"
RELEASE = "https://siril.org/download/2026-10-28-siril-1-4-5/"
CLI_NAMES = {"siril-cli", "siril-cli.exe", f"siril-{VERSION}-x86_64.appimage", f"siril-{VERSION}-aarch64.appimage"}
VERSION_LINE = re.compile(r"(?im)^\s*siril(?:[- ]cli)?(?:\s+version)?\s+v?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\s*$")


class SirilTemporaryDirectory(tempfile.TemporaryDirectory):
    def cleanup(self):
        # Windows can briefly keep Siril's working directory open after the CLI exits.
        for delay in (0.05, 0.1, 0.2, 0.4):
            try:
                return super().cleanup()
            except PermissionError as exc:
                if getattr(exc, "winerror", None) != 32:
                    raise
                time.sleep(delay)
        return super().cleanup()


def executable(value):
    if not isinstance(value, str) or not value or len(value) > 4096 or "\x00" in value:
        raise errors.StorageError("SIRIL_EXECUTABLE_INVALID")
    path = Path(value)
    if not path.is_absolute():
        raise errors.StorageError("SIRIL_EXECUTABLE_INVALID")
    if path.name.lower() in {"siril", "siril.exe"}:
        raise errors.StorageError("SIRIL_GUI_ONLY" if path.is_file() else "SIRIL_NOT_FOUND")
    if path.name.lower() not in CLI_NAMES:
        raise errors.StorageError("SIRIL_EXECUTABLE_INVALID")
    try:
        path = paths.checked_path(path)
        info = manager.source_stat(path)
        with path.open("rb") as stream:
            signature = stream.read(4)
        accepted = (signature[:2] == b"MZ" if os.name == "nt" else signature in {
            b"\x7fELF", b"\xfe\xed\xfa\xce", b"\xce\xfa\xed\xfe", b"\xfe\xed\xfa\xcf",
            b"\xcf\xfa\xed\xfe", b"\xca\xfe\xba\xbe", b"\xca\xfe\xba\xbf",
        })
        if not accepted or not os.access(path, os.X_OK):
            raise errors.StorageError("SIRIL_EXECUTABLE_INVALID")
    except errors.StorageError as exc:
        if exc.code == "SOURCE_NOT_FOUND":
            raise errors.StorageError("SIRIL_NOT_FOUND") from exc
        if exc.code != "SIRIL_EXECUTABLE_INVALID":
            raise errors.StorageError("SIRIL_EXECUTABLE_INVALID") from exc
        raise
    except OSError as exc:
        raise errors.StorageError("SIRIL_EXECUTABLE_INVALID") from exc
    return path, manager.fingerprint(info)


def run_cli(path, args, directory, checkpoint, *, timeout=None, log_directory=None):
    deadline = None if timeout is None else time.monotonic() + timeout
    checkpoint()
    environment = {**os.environ, "LC_ALL": "C", "LANG": "C"}
    if os.name == "nt":
        # An MSYS2 parent shell prevents the native Siril CLI from initializing Python.
        environment.pop("MSYSTEM", None)
        environment.pop("MSYS", None)
    with tempfile.TemporaryFile(dir=log_directory or directory) as log:
        try:
            process = subprocess.Popen(
                [str(path), *args], cwd=directory, stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT,
                shell=False, creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                env=environment,
            )
        except OSError as exc:
            raise errors.StorageError("SIRIL_EXECUTABLE_INVALID") from exc
        try:
            while process.poll() is None:
                checkpoint()
                if deadline is not None and time.monotonic() >= deadline:
                    raise errors.StorageError("SIRIL_RUN_TIMEOUT")
                time.sleep(0.05)
            checkpoint()
        finally:
            if process.poll() is None:
                process.kill()
                process.wait()
        if process.returncode:
            raise errors.StorageError("SIRIL_RUN_FAILED", f"Siril exited with code {process.returncode}")
        log.seek(0)
        return log.read().decode("utf-8", errors="replace")


class SoftwareService:
    def __init__(self, runtime):
        self.runtime = runtime
        self.root = runtime.root

    def current(self, *, check_enabled=True):
        try:
            software = core_config.load_storage_settings(self.root).get("software", {})
            if check_enabled and software.get("siril_enabled", True) is not True:
                raise errors.StorageError("SIRIL_DISABLED")
            row = software.get("siril")
            if row is None:
                raise errors.StorageError("SIRIL_NOT_CONFIGURED")
            path, identity = executable(row["path"])
            if identity != row["fingerprint"] or row["version"] != VERSION:
                raise errors.StorageError("SIRIL_REVALIDATION_REQUIRED")
            return {**row, "path": str(path)}
        except (KeyError, TypeError, AttributeError) as exc:
            raise errors.StorageError("SIRIL_REVALIDATION_REQUIRED") from exc

    def status(self):
        try:
            settings = core_config.load_storage_settings(self.root)
            enabled = settings.get("software", {}).get("siril_enabled", True) is True
            config = self.current(check_enabled=False)
            return {"os": platform.system(), "target_version": VERSION, "state": "ready",
                    "enabled": enabled, **{k: config[k] for k in ("path", "version", "verified_at")}}
        except errors.StorageError as exc:
            body = {"os": platform.system(), "target_version": VERSION, "state": exc.code, "enabled": False}
            try:
                software = core_config.load_storage_settings(self.root).get("software", {})
                body["enabled"] = software.get("siril_enabled", True) is True
                saved = software.get("siril")
                if isinstance(saved, dict) and isinstance(saved.get("path"), str):
                    body["path"] = saved["path"]
            except (AttributeError, errors.StorageError):
                pass
            return body

    def set_enabled(self, enabled):
        if type(enabled) is not bool:
            raise errors.StorageError("INVALID_REQUEST")
        with self.runtime.workspaces.lock():
            if enabled:
                self.current(check_enabled=False)
            settings = core_config.load_storage_settings(self.root)
            settings.setdefault("software", {})["siril_enabled"] = enabled
            core_config.write_storage_settings(self.root, settings, settings["revision"])
        return self.status()

    def probe(self, value):
        from .processing import verify_cli

        path, identity = executable(value)

        def unchanged():
            if executable(str(path))[1] != identity:
                raise errors.StorageError("SIRIL_REVALIDATION_REQUIRED")

        with SirilTemporaryDirectory(dir=paths.checked_path(self.root / "runtime"), prefix="siril-probe-") as tmp:
            working = Path(tmp)
            output = run_cli(path, ["-v"], working, unchanged, timeout=8)
            match = VERSION_LINE.search(output)
            if not match:
                raise errors.StorageError("SIRIL_EXECUTABLE_INVALID")
            if match[1] != VERSION:
                raise errors.StorageError("SIRIL_VERSION_MISMATCH", f"Detected {match[1]}, expected {VERSION}",
                                   details={"detected": match[1], "expected": VERSION})
            verify_cli(path, working, unchanged)
        return {"path": str(path), "version": VERSION, "fingerprint": identity,
                "verified_at": datetime.now(timezone.utc).isoformat()}

    def save(self, value):
        row = self.probe(value)
        with self.runtime.workspaces.lock():
            if executable(row["path"])[1] != row["fingerprint"]:
                raise errors.StorageError("SIRIL_REVALIDATION_REQUIRED")
            settings = core_config.load_storage_settings(self.root)
            software = settings.setdefault("software", {})
            software["siril"] = row
            software["siril_enabled"] = True
            core_config.write_storage_settings(self.root, settings, settings["revision"])
        return self.status()

    def clear(self):
        with self.runtime.workspaces.lock():
            settings = core_config.load_storage_settings(self.root)
            settings.get("software", {}).pop("siril", None)
            core_config.write_storage_settings(self.root, settings, settings["revision"])
        return self.status()

    def discover(self):
        names = ("siril-cli.exe", "siril.exe") if os.name == "nt" else ("siril-cli", "siril")
        found = {}
        for name in names:
            for folder in self.runtime.environ.get("PATH", "").split(os.pathsep):
                if Path(folder).is_absolute() and (value := shutil.which(name, path=folder)):
                    found.setdefault(os.path.normcase(value), (value, "PATH"))
        directories = {
            "Windows": [Path(base) / folder / sub for key in ("ProgramFiles", "ProgramFiles(x86)", "LOCALAPPDATA")
                        if (base := self.runtime.environ.get(key)) for folder in ("Siril", "Siril/1.4.5",
                        "Programs/Siril") for sub in ("", "bin")],
            "Darwin": [Path("/Applications/Siril.app/Contents/MacOS"), Path.home() / "Applications/Siril.app/Contents/MacOS"],
            "Linux": [Path("/usr/bin"), Path("/usr/local/bin"), Path.home() / ".local/bin"],
        }
        for directory in directories.get(platform.system(), []):
            for name in names:
                path = directory / name
                if path.is_file():
                    found.setdefault(os.path.normcase(str(path)), (str(path), "standard"))
        results = []
        for value, origin in list(found.values())[:8]:
            try:
                row = self.probe(value)
                result = {"state": "ready", "version": row["version"]}
            except errors.StorageError as exc:
                result = {"state": exc.code, **(exc.details or {})}
            results.append({"path": value, "origin": origin, **result})
        return {"candidates": results, "state": "discovered" if results else "SIRIL_NOT_FOUND"}

