"""Run the TEST_PLAN v0.6 startup cases on an isolated ComfyUI source copy."""

from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
import csv
from hashlib import sha256
import itertools
import json
import os
from pathlib import Path
import socket
import stat
import subprocess
import sys
import time
import traceback
from urllib.request import ProxyHandler, build_opener
from uuid import UUID
from zipfile import ZipFile

run = Path(sys.argv[1]).resolve()
host_python = Path(sys.argv[2]).resolve()
evidence = Path(__file__).resolve().parent
repo = Path.cwd().resolve()
assert run.parent == repo / ".artifact/mcp-storage-init"
host = run / "c"
base = run / "b"
extension = base / "custom_nodes/astrophoto"
child = evidence / "host-child.py"
top = ("config", "database", "storage", "runtime")
configs = ("manifest.json", "settings.json")
http = build_opener(ProxyHandler({}))


def digest(path):
    return sha256(path.read_bytes()).hexdigest()


def record(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def kind(path):
    try:
        info = path.lstat()
    except FileNotFoundError:
        return "missing"
    if info.st_file_attributes & stat.FILE_ATTRIBUTE_REPARSE_POINT:
        return "reparse"
    return "dir" if stat.S_ISDIR(info.st_mode) else "file"


def tree(root):
    result = {}
    if kind(root) != "dir":
        return result
    for path in sorted(root.iterdir()):
        name = path.relative_to(root).as_posix()
        result[name] = kind(path)
        if kind(path) == "dir":
            for entry in sorted(path.iterdir()):
                result[entry.relative_to(root).as_posix()] = kind(entry)
    return result


class Blocked(Exception):
    pass


class Fixture:
    def __init__(self, case, override=False):
        self.case = case
        self.folder = run / case
        self.folder.mkdir(exist_ok=case in ("d", "o"))
        self.out = evidence / "host" / case
        self.out.mkdir(parents=True)
        self.home = self.folder / "h"
        self.default = self.home / ".astrophoto"
        self.root = self.folder / "r" if override else self.default
        for name in ("h", "u", "i", "o", "t", "p", "save"):
            (self.folder / name).mkdir(exist_ok=name == "h" and case in ("d", "o"))
        self.step = 0

    def path(self, relative):
        return self.root / relative

    def save(self, relative):
        path = self.path(relative)
        destination = self.folder / "save" / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        path.rename(destination)
        return destination

    def require_no_outer_coordination(self):
        assert kind(self.home / ".astrophoto-control") == "missing"
        if self.root != self.default:
            assert kind(self.default) == "missing"

    def snapshot(self, label):
        state = {
            "root": str(self.root),
            "root_type": kind(self.root),
            "top_level": {name: kind(self.path(name)) for name in top},
            "tree": tree(self.root),
            "config_sha256": self.config_hashes(),
            "sentinel_sha256": {name: digest(self.path(f"{name}/qa.bin"))
                                for name in top if kind(self.path(f"{name}/qa.bin")) == "file"},
            "external_coordination": kind(self.home / ".astrophoto-control"),
            "default_root": kind(self.default),
        }
        record(self.out / f"{label}.json", state)
        return state

    def config_hashes(self):
        return {name: digest(self.path(f"config/{name}")) for name in configs
                if kind(self.path(f"config/{name}")) == "file"}

    def valid(self, label, *, initial=False, expected=None):
        assert all(kind(self.path(name)) == "dir" for name in top)
        assert len(self.config_hashes()) == 2
        identity = load_manifest(self.root)
        settings = load_storage_settings(self.root)
        assert identity["initialized"] is True, identity
        assert identity["format_version"] == 1, identity
        assert all(str(UUID(identity[key])) == identity[key] for key in ("instance_id", "initial_workspace_id"))
        assert settings["workspace"]["default_workspace_id"] == identity["initial_workspace_id"]
        if initial:
            assert settings["schema_version"] == 1
            assert settings["revision"] == 0
            assert settings["imports"]["default_mode"] == "reference"
            assert settings["workspace"]["write_policy"] == "default"
            assert settings["cache"] == {"path": str(self.path("runtime/cache")), "max_size_gb": 20}
            assert self.path("config/roots.json").is_file()
        if expected:
            assert (identity, settings) == expected
        self.require_no_outer_coordination()
        record(self.out / f"{label}-readers.json", {"manifest": identity, "settings": settings})
        return identity, settings

    def env(self):
        env = {key: value for key, value in os.environ.items()
               if not key.upper().startswith(("COMFY", "ASTROPHOTO_"))}
        env.pop("PYTHONPATH", None)
        env.update({
            "HOME": str(self.home), "USERPROFILE": str(self.home),
            "HOMEDRIVE": self.home.drive, "HOMEPATH": str(self.home)[len(self.home.drive):],
            "APPDATA": str(self.home / "AppData/Roaming"),
            "LOCALAPPDATA": str(self.home / "AppData/Local"),
            "XDG_CACHE_HOME": str(self.home / ".cache"),
            "TORCH_HOME": str(self.home / ".torch"),
            "HF_HOME": str(self.home / ".huggingface"),
            "TEMP": str(self.folder / "p"), "TMP": str(self.folder / "p"),
            "PYTHONDONTWRITEBYTECODE": "1", "PYTHONNOUSERSITE": "1", "PYTHONUTF8": "1",
        })
        if self.root != self.default:
            env["ASTROPHOTO_HOME"] = str(self.root)
        return env

    def start(self, label):
        self.step += 1
        prefix = f"{self.step:02}-{label}"
        stop = self.folder / f"stop{self.step}"
        log = self.out / f"{prefix}.log"
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            port = listener.getsockname()[1]
        argv = [str(host_python), "-u", "-X", "utf8", str(child), str(host / "main.py"),
                str(self.home), str(self.root), str(stop),
                "--listen", "127.0.0.1", "--port", str(port), "--cpu", "--offline",
                "--disable-auto-launch", "--disable-assets", "--base-directory", str(base),
                "--user-directory", str(self.folder / "u"), "--input-directory", str(self.folder / "i"),
                "--output-directory", str(self.folder / "o"), "--temp-directory", str(self.folder / "t"),
                "--disable-all-custom-nodes", "--whitelist-custom-nodes", extension.name]
        process_env = self.env()
        preflight = subprocess.run(
            [str(host_python), "-c", "from pathlib import Path; print(Path.home().resolve())"],
            cwd=host, env=process_env, capture_output=True, check=True, text=True,
        ).stdout.strip()
        assert Path(preflight) == self.home, preflight
        metadata = {"argv": argv, "cwd": str(host), "preflight_homedir": preflight}
        try:
            with log.open("xb") as stream:
                process = subprocess.Popen(argv, cwd=host, env=process_env, stdout=stream, stderr=subprocess.STDOUT)
                try:
                    end = time.monotonic() + 50
                    endpoint = f"http://127.0.0.1:{port}/astrophoto/v1/status"
                    while process.poll() is None and time.monotonic() < end:
                        try:
                            with http.open(endpoint, timeout=1) as response:
                                metadata["status"] = json.load(response)
                            break
                        except (OSError, ValueError):
                            time.sleep(0.25)
                    assert "status" in metadata, f"AstroPhoto status endpoint failed at {endpoint}"
                finally:
                    if process.poll() is None:
                        stop.touch()
                        try:
                            process.wait(timeout=12)
                        except subprocess.TimeoutExpired:
                            process.kill()
                            process.wait(timeout=8)
                            metadata["forced_stop"] = True
                    metadata["exit"] = process.returncode
        finally:
            record(self.out / f"{prefix}-command.json", metadata)
        contents = log.read_text(encoding="utf-8", errors="replace")
        assert metadata["exit"] == 0 and "Stopped server" in contents
        assert "ISOLATION Path.home=" in contents
        assert "HOST_EXIT MCP modules: []" in contents
        self.require_no_outer_coordination()
        return contents

    def initialized(self):
        self.snapshot("before-first-start")
        self.start("first")
        self.valid("first", initial=True)
        settings = load_storage_settings(self.root)
        settings["imports"]["default_mode"] = "copy"
        write_storage_settings(self.root, settings, settings["revision"])
        for name in top:
            self.path(f"{name}/qa.bin").write_bytes(f"fixture {self.case} {name}\n".encode())
        self.snapshot("prepared")
        return load_manifest(self.root), load_storage_settings(self.root)

    def keep(self, before, after):
        assert before["config_sha256"] == after["config_sha256"]
        for key, value in before["sentinel_sha256"].items():
            assert after["sentinel_sha256"][key] == value


def first(fixture):
    assert kind(fixture.root) == "missing"
    fixture.snapshot("after-install-before-start")
    fixture.start("first")
    fixture.valid("first", initial=True)
    fixture.snapshot("after-first")


def restart(fixture, missing=(), business_only=False):
    expected = fixture.initialized()
    if business_only:
        fixture.save("database/assets.db")
        for suffix in ("-shm", "-wal", "-journal"):
            if kind(fixture.path(f"database/assets.db{suffix}")) != "missing":
                fixture.save(f"database/assets.db{suffix}")
    for name in missing:
        fixture.save(name)
    before = fixture.snapshot("before-repair")
    assert all(before["top_level"][name] == "missing" for name in missing)
    fixture.start("repair")
    fixture.valid("repair", expected=expected)
    after = fixture.snapshot("after-repair")
    fixture.keep(before, after)
    if missing:
        fixture.start("repaired-restart")
        fixture.valid("repaired-restart", expected=expected)
        fixture.keep(after, fixture.snapshot("after-repaired-restart"))


def invalid(fixture, name, semantic):
    expected = fixture.initialized()
    target = f"config/{name}"
    original = fixture.save(target)
    if not semantic:
        contents = b'{"intentionally":'
    else:
        value = json.loads(original.read_bytes())
        if name == "manifest.json":
            value["instance_id"] = "not-a-uuid"
        else:
            value["workspace"]["write_policy"] = "unsupported"
        contents = json.dumps(value).encode()
    fixture.path(target).write_bytes(contents)
    before = fixture.snapshot("before-invalid")
    log = fixture.start("invalid")
    assert "AstroPhoto storage startup failed" in log
    assert name in log
    if semantic:
        assert ("badly formed hexadecimal UUID string" if name == "manifest.json" else "Unsupported settings") in log
    else:
        assert "JSONDecodeError" in log
    fixture.keep(before, fixture.snapshot("after-invalid"))
    fixture.path(target).rename(fixture.folder / "save/invalid.json")
    original.rename(fixture.path(target))
    fixture.start("restored")
    fixture.valid("restored", expected=expected)


def absent(fixture, target):
    expected = fixture.initialized()
    original = fixture.save(target)
    before = fixture.snapshot("before-missing")
    log = fixture.start("missing")
    assert "AstroPhoto storage startup failed" in log
    for name in configs if target == "config" else (Path(target).name,):
        assert name in log
    assert kind(fixture.path(target)) == "missing"
    fixture.keep(before, fixture.snapshot("after-missing"))
    original.rename(fixture.path(target))
    fixture.start("restored")
    fixture.valid("restored", expected=expected)


def conflict(fixture, link):
    expected = fixture.initialized()
    fixture.save("database")
    fixture.save("storage")
    occupied = fixture.path("storage")
    if link:
        target = fixture.folder / "save/link-target"
        target.mkdir()
        item = target / "content.bin"
        item.write_bytes(b"fixture link target")
        try:
            occupied.symlink_to(target, target_is_directory=True)
        except OSError as exc:
            raise Blocked(f"Windows refused directory symlink creation: {exc}") from exc
        baseline = digest(item)
    else:
        occupied.write_bytes(b"fixture existing content")
        baseline = digest(occupied)
    before = fixture.snapshot("before-conflict")
    log = fixture.start("conflict")
    assert "AstroPhoto storage startup failed" in log
    assert "storage" in log and ("link" in log.lower() if link else "Expected a storage directory" in log)
    assert Path(fixture.path("database")).exists() is False
    assert kind(occupied) == ("reparse" if link else "file")
    fixture.keep(before, fixture.snapshot("after-conflict"))
    if link:
        assert occupied.resolve() == target
        assert digest(item) == baseline
        occupied.unlink() if os.name != "nt" else occupied.rmdir()
    else:
        assert digest(occupied) == baseline
        occupied.rename(fixture.folder / "save/occupied")
    fixture.start("cleared")
    fixture.valid("cleared", expected=expected)
    fixture.keep(before, fixture.snapshot("after-clear"))


@contextmanager
def deny_mkdir(fixture):
    root = fixture.root
    identity = subprocess.run(["whoami.exe", "/user", "/fo", "csv", "/nh"],
                              env=fixture.env(), capture_output=True, text=True, check=True)
    user, sid = next(csv.reader(identity.stdout.splitlines()))
    log = fixture.out / "acl.log"
    with log.open("x", encoding="utf-8") as stream:
        print(f"Principal {user} {sid}; root {root}", file=stream)

        def icacls(*args):
            completed = subprocess.run(["icacls.exe", str(root), *args], env=fixture.env(),
                                       capture_output=True, text=True)
            print(completed.args, completed.returncode, completed.stdout, completed.stderr, file=stream, flush=True)
            return completed.returncode

        if icacls("/deny", f"*{sid}:(AD)"):
            raise Blocked("Failed to set a current-user ADD_SUBDIRECTORY deny on the isolated root")
        try:
            icacls()
            try:
                (root / "runtime").mkdir()
            except PermissionError as exc:
                print(f"Direct same-user mkdir independently returned {exc!r}", file=stream, flush=True)
            else:
                (root / "runtime").rename(fixture.folder / "save/acl-probe")
                raise Blocked("ACL did not prevent the current user from creating the direct child")
            yield
        finally:
            assert icacls("/remove:d", f"*{sid}") == 0, "Could not restore fixture ACL"
            assert icacls() == 0


def permission(fixture):
    expected = fixture.initialized()
    fixture.save("runtime")
    before = fixture.snapshot("before-acl")
    with deny_mkdir(fixture):
        assert fixture.config_hashes() == before["config_sha256"]
        log = fixture.start("permission")
        assert "AstroPhoto storage startup failed" in log
        assert "PermissionError" in log and "runtime" in log
        after = fixture.snapshot("after-denied")
        assert after["top_level"]["runtime"] == "missing"
        fixture.keep(before, after)
    fixture.start("permission-restored")
    fixture.valid("restored", expected=expected)
    fixture.keep(before, fixture.snapshot("after-restored"))


def run_case(spec):
    case, tc, override, func, args = spec
    fixture = Fixture(case, override)
    result = {"case": case, "tc": tc, "started_utc": utc()}
    try:
        func(fixture, *args)
    except Blocked as exc:
        result.update(status="Blocked", error=str(exc))
    except Exception as exc:
        result.update(status="Fail", error=str(exc))
        (fixture.out / "traceback.txt").write_text(traceback.format_exc(), encoding="utf-8")
    else:
        result["status"] = "Pass"
    result.update(finished_utc=utc(), host_launches=fixture.step)
    record(fixture.out / "result.json", result)
    print(json.dumps(result), flush=True)
    return result


def utc():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def install():
    extension.mkdir(parents=True)
    with ZipFile(run / "a.zip") as candidate:
        names = [name for name in candidate.namelist() if not name.endswith("/")]
        checked = {
            name: sha256(candidate.read(name)).hexdigest()
            for name in names if name.endswith(".py")
        }
        assert all(digest(repo / name) == checksum for name, checksum in checked.items())
        candidate.extractall(extension)
    record(evidence / "candidate-python.json", checked)
    assert len(checked) > 0


case_specs = [
    ("d", "TC-01", False, first, ()),
    ("o", "TC-01", True, first, ()),
    ("r", "TC-02", True, restart, ()),
    *[(f"s{i}", "TC-15", True, restart, ((name,),)) for i, name in enumerate(top[1:])],
    *[(f"m{i}", "TC-16", True, restart, (group,)) for i, group in enumerate(
        itertools.chain(itertools.combinations(top[1:], 2), (top[1:],)))],
    ("db", "TC-17", True, restart, ((), True)),
    *[(f"j{i}{int(semantic)}", "TC-04", True, invalid, (name, semantic))
      for i, name in enumerate(configs) for semantic in (False, True)],
    *[(f"a{i}", "TC-06", True, absent, (name,)) for i, name in enumerate(
        ("config/manifest.json", "config/settings.json", "config"))],
    ("f", "TC-18", True, conflict, (False,)),
    ("l", "TC-18", True, conflict, (True,)),
    ("w", "TC-19", True, permission, ()),
]

if "install" in sys.argv[3:]:
    checks = {}
    for case, tc, override, *_ in case_specs:
        if tc == "TC-01":
            home = run / case / "h"
            home.mkdir(parents=True)
            target = run / case / "r" if override else home / ".astrophoto"
            checks[case] = {"home": str(home), "expected_root": str(target), "tree": tree(target),
                            "root_type": kind(target), "external_coordination": kind(home / ".astrophoto-control")}
            assert checks[case]["root_type"] == checks[case]["external_coordination"] == "missing"
    assert not extension.exists()
    record(evidence / "before-install.json", {
        "fixtures": checks, "extension_missing": True,
    })
    install()

sys.path.insert(0, str(extension))
from astrophoto.core.config import load_storage_settings, write_storage_settings
from astrophoto.storage.initializer import load_manifest

chosen = [spec for spec in case_specs if spec[0] in sys.argv[3:] or "all" in sys.argv[3:]]
assert chosen
with ThreadPoolExecutor(max_workers=3) as executor:
    outcomes = list(executor.map(run_case, chosen))
sys.exit(1 if any(result["status"] == "Fail" for result in outcomes) else 0)
