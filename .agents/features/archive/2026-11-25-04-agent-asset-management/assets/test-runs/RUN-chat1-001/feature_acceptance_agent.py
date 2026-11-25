import asyncio
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from time import perf_counter

import httpx
from aiohttp import web

sys.path.insert(0, str(Path.cwd()))
from astrophoto.api.routes import register_routes
from astrophoto.bootstrap import bootstrap, initialize_storage_runtime
from astrophoto.core.config import AppConfig

ROOT = Path.cwd()
RUN = ROOT / ".artifact" / "feature-close-agent"
MODEL = "opencode-go/deepseek-v4.1-flash:low"
BASE = "/astrophoto/v1"
AGENT = {"X-AstroPhoto-Agent": "1"}


async def main():
    RUN.mkdir(parents=True, exist_ok=True)
    work = RUN / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    work.mkdir()
    source = work / "acceptance.avi"
    source.write_bytes(b"AstroPhoto synthetic acceptance fixture")
    exported = work / "skills"
    executable = ROOT / ".venv" / "Scripts" / "astrophoto-mcp.exe"
    subprocess.run([str(executable), "--install-skill", str(exported)], check=True)
    skill = exported / "astrophoto-management" / "SKILL.md"
    runtime = bootstrap(lambda: True, AppConfig("feature-acceptance", "0.0.1", work / "storage"))
    initialize_storage_runtime(runtime)
    assert runtime.storage is not None, runtime.storage_error
    runtime.trusted_local = True

    @web.middleware
    async def record(request, handler):
        started = datetime.now(timezone.utc).isoformat()
        before = perf_counter()
        response = await handler(request)
        body = json.loads(response.body or b"{}") if response.content_type == "application/json" else {}
        with (work / "http.jsonl").open("a", encoding="utf-8") as log:
            log.write(json.dumps({
                "started_at": started, "duration_ms": round((perf_counter() - before) * 1000, 2),
                "method": request.method, "path": request.path, "status": response.status,
                "request_id": body.get("request_id") or response.headers.get("X-Request-ID"),
                "error": (body.get("error") or {}).get("code"), "task": body.get("task"),
            }) + "\n")
        return response

    routes = web.RouteTableDef()
    register_routes(routes, runtime)
    app = web.Application(middlewares=[record])
    app.add_routes(routes)
    runner = web.AppRunner(app)
    await runner.setup()
    listener = web.TCPSite(runner, "127.0.0.1", 0)
    await listener.start()
    host = f"http://127.0.0.1:{listener._server.sockets[0].getsockname()[1]}"
    config = work / ".pi"
    config.mkdir()
    (config / "mcp.json").write_text(json.dumps({"mcpServers": {"astrophoto": {
        "command": str(executable), "args": ["--comfy-url", host], "exposure": "direct",
    }}}), encoding="utf-8")
    pi = shutil.which("pi.cmd" if os.name == "nt" else "pi")
    prompt = (
        "Read and follow the AstroPhoto management skill for this isolated acceptance test. "
        "Use your read tool to open this exact Skill file first: " + str(skill) + ". "
        "Via AstroPhoto MCP, create a camera named Acceptance Camera with product Synthetic Camera, "
        "and create Acceptance Group containing that camera. "
        "Import the synthetic video at " + str(source) + " under name Acceptance Video with this equipment group. "
        "Poll the import task to confirm its status. Create Acceptance Project and add Acceptance Video at its root. "
        "Use the published tools to read back the device, the group, the video and the project reference. "
        "Then deliberately try to create Acceptance Project a second time to check duplicate handling. "
        "Report actual successful writes, failed step and tool error code, and the import task number. Do not delete anything."
    )
    args = [pi, "--mode", "json", "--session-dir", str(work / "sessions"), "--approve",
            "--model", MODEL, "--no-extensions", "--extension", "builtin:mcp", "--tools", "read,mcp__astrophoto__*",
            "--no-context-files", "--skill", str(skill), prompt]
    try:
        version = subprocess.run([pi, "--version"], capture_output=True, text=True, check=True, timeout=25).stdout.strip()
        print(work, flush=True)
        with (work / "events.jsonl").open("wb") as events, (work / "stderr.log").open("wb") as errors:
            process = await asyncio.to_thread(subprocess.run, args, cwd=work, stdout=events, stderr=errors, timeout=250)
        async with httpx.AsyncClient(base_url=host, trust_env=False, headers=AGENT) as client:
            check = {}
            for path in ("/equipment", "/optical-trains", "/catalog/video", "/catalog/projects"):
                response = await client.get(BASE + path)
                response.raise_for_status()
                check[path] = response.json()
            if projects := check["/catalog/projects"]["items"]:
                response = await client.get(BASE + "/catalog/projects/" + projects[0]["id"])
                response.raise_for_status()
                check["project_tree"] = response.json()
        (work / "readback.json").write_text(json.dumps(check, indent=2), encoding="utf-8")
        (work / "metadata.json").write_text(json.dumps({
            "Pi": version, "model": MODEL, "host": host, "exit_code": process.returncode,
            "scope": "Isolated aiohttp host with actual AstroPhoto handlers, real Pi and MCP stdio",
        }, indent=2), encoding="utf-8")
        print("Pi exit", process.returncode, flush=True)
    finally:
        await runner.cleanup()
        runtime.storage.close()


if __name__ == "__main__":
    asyncio.run(main())
