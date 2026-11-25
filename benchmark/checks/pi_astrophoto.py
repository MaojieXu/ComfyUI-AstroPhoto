"""Exercise Pi's natural-language, read-only AstroPhoto integration."""

from __future__ import annotations

import asyncio
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import ProxyHandler, build_opener
from uuid import uuid4

from fastmcp import Client
from fastmcp.client.transports import StdioTransport


ROOT = Path(__file__).resolve().parents[2]
MCP = ROOT / ".venv" / "Scripts" / "astrophoto-mcp.exe"
PROMPT = "请查看 AstroPhoto 里目前的设备、素材和项目，分别列出查询结果。只进行只读操作，不要修改数据。"
EXPECTED = {"equipment_list", "library_list", "project_list"}


async def baseline() -> dict:
    transport = StdioTransport(command=str(MCP), args=[])
    async with Client(transport, mode="legacy") as client:
        tools = [tool.name for tool in await client.list_tools()]
        calls = {}
        for name in ("connection_status", "equipment_list", "library_list", "project_list"):
            result = await client.call_tool("call_tool", {"name": name, "arguments": {}}, raise_on_error=False)
            calls[name] = {"is_error": result.is_error, "data": result.data}
        return {"tools": tools, "calls": calls}


def main() -> int:
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + uuid4().hex[:8]
    run = ROOT / ".artifact" / "pi-astrophoto-smoke" / run_id
    sessions = run / "sessions"
    sessions.mkdir(parents=True)
    config_dir = run / ".pi"
    config_dir.mkdir()
    (config_dir / "mcp.json").write_text(json.dumps({"mcpServers": {"astrophoto": {
        "command": str(MCP), "args": [], "exposure": "direct"}}}, indent=2), encoding="utf-8")
    report = {"run_id": run_id, "status": "failed", "run_dir": str(run), "checks": {}}
    checks = report["checks"]
    try:
        pi = shutil.which("pi.cmd" if os.name == "nt" else "pi")
        if not pi or not MCP.is_file():
            raise RuntimeError("Pi or AstroPhoto MCP executable was not found")
        version = subprocess.run([pi, "--version"], capture_output=True, text=True, timeout=20, check=True)
        checks["pi_version"] = version.stdout.strip()
        opener = build_opener(ProxyHandler({}))
        with opener.open("http://127.0.0.1:8188/astrophoto/v1/status", timeout=5) as response:
            host = json.load(response)
        checks["comfyui"] = {"status": host.get("status"), "data_home": host.get("data_home"),
                             "extension": host.get("extension"), "runtime": host.get("runtime")}
        if host.get("status") != "ok" or not host.get("runtime", {}).get("routes_registered"):
            raise RuntimeError("ComfyUI AstroPhoto extension is not ready")
        reference = asyncio.run(baseline())
        (run / "baseline.json").write_text(json.dumps(reference, ensure_ascii=False, indent=2), encoding="utf-8")
        checks["mcp_tools"] = reference["tools"]
        if set(reference["tools"]) != {"list_tool_categories", "list_category_tools", "call_tool"}:
            raise RuntimeError("Unexpected AstroPhoto MCP tool list")
        status = reference["calls"]["connection_status"]
        if status["is_error"] or status["data"].get("connection_state") != "ready":
            raise RuntimeError("MCP did not discover a ready ComfyUI instance")
        if status["data"].get("address", "").rstrip("/") != "http://127.0.0.1:8188":
            raise RuntimeError("MCP discovered a different host than the one checked")
        if any(reference["calls"][name]["is_error"] for name in EXPECTED):
            raise RuntimeError("Independent MCP baseline query failed")
        args = [pi, "--mode", "json", "--session-dir", str(sessions), "--approve", "--no-extensions",
                "--extension", "builtin:mcp", "--no-builtin-tools", "--no-skills", "--no-context-files", PROMPT]
        with (run / "events.jsonl").open("w", encoding="utf-8") as events, (run / "stderr.log").open("w", encoding="utf-8") as errors:
            process = subprocess.run(args, cwd=run, stdout=events, stderr=errors, timeout=240, check=False)
        checks["pi_exit_code"] = process.returncode
        event_rows = [json.loads(line) for line in (run / "events.jsonl").read_text(encoding="utf-8-sig").splitlines()]
        session_files = list(sessions.rglob("*.jsonl"))
        report["session_files"] = [str(p) for p in session_files]
        entries, calls, answers = [], [], []
        for event in event_rows:
            if event.get("type") in {"tool_execution_start", "tool_execution_end"}:
                calls.append(event)
            msg = event.get("message", {})
            if event.get("type") == "message_end" and msg.get("role") in {"user", "assistant"}:
                text = "".join(p.get("text", "") for p in msg.get("content", []) if p.get("type") == "text")
                if text:
                    entries.append(f"{msg['role'].capitalize()}:\n{text}")
                    if msg["role"] == "assistant":
                        answers.append(text)
        (run / "chat.txt").write_text("\n\n".join(entries) + "\n", encoding="utf-8")
        (run / "tool-calls.jsonl").write_text("".join(json.dumps(c, ensure_ascii=False) + "\n" for c in calls), encoding="utf-8")
        checks["agent_answer"] = answers[-1] if answers else None
        checks["agent_call_events"] = len(calls)
        starts = [event for event in calls if event.get("type") == "tool_execution_start"]
        business = {event.get("args", {}).get("name") for event in starts
                    if event.get("toolName") == "mcp__astrophoto__call_tool"}
        checks["business_calls"] = sorted(name for name in business if name)
        checks["tool_errors"] = [event.get("toolName") for event in calls
                                 if event.get("type") == "tool_execution_end" and event.get("isError")]
        # Final evaluation of the business result and the invocation trace requires review.
        if process.returncode == 0 and session_files and answers and EXPECTED <= business:
            report["status"] = "review_required"
        else:
            report["error"] = "Pi did not produce a complete session, response and tool trace."
    except (OSError, subprocess.SubprocessError, ValueError, RuntimeError) as exc:
        report["error"] = f"{type(exc).__name__}: {exc}"
    (run / "result.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["status"] == "review_required" else 1


if __name__ == "__main__":
    sys.exit(main())
