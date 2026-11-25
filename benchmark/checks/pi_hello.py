"""Run a minimal Pi model smoke test and retain its session and event logs."""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + uuid4().hex[:8]
    run_dir = root / ".artifact" / "pi-hello-smoke" / run_id
    session_dir = run_dir / "sessions"
    session_dir.mkdir(parents=True)
    events_path, stderr_path = run_dir / "events.jsonl", run_dir / "stderr.log"
    result_path, chat_path = run_dir / "result.json", run_dir / "chat.txt"
    pi = shutil.which("pi.cmd" if sys.platform == "win32" else "pi")
    result = {"run_id": run_id, "status": "failed", "events": str(events_path),
              "stderr": str(stderr_path), "chat": str(chat_path), "session_files": [], "answer": None}
    try:
        if not pi:
            raise FileNotFoundError("Pi executable was not found on PATH")
        args = [pi, "--mode", "json", "--session-dir", str(session_dir),
                "--no-extensions", "--no-skills", "--no-context-files", "--no-tools",
                "Please reply with exactly: Hello"]
        with events_path.open("w", encoding="utf-8") as events, stderr_path.open("w", encoding="utf-8") as errors:
            process = subprocess.run(args, cwd=run_dir, stdout=events, stderr=errors,
                                     timeout=120, check=False)
        result["exit_code"] = process.returncode
        assistant = []
        for line in events_path.read_text(encoding="utf-8-sig").splitlines():
            event = json.loads(line)
            message = event.get("message", {})
            if event.get("type") == "message_end" and message.get("role") == "assistant":
                assistant.append(message)
        if assistant:
            message = assistant[-1]
            result["answer"] = "".join(part.get("text", "") for part in message.get("content", [])
                                       if part.get("type") == "text").strip()
            result["stop_reason"] = message.get("stopReason")
            result["model"] = message.get("model")
            result["provider"] = message.get("provider")
            if message.get("errorMessage"):
                result["error"] = message["errorMessage"]
        result["session_files"] = [str(p) for p in session_dir.rglob("*.jsonl")]
        if result["session_files"]:
            entries = []
            for line in Path(result["session_files"][0]).read_text(encoding="utf-8-sig").splitlines():
                row = json.loads(line)
                message = row.get("message", {})
                if row.get("type") == "message" and message.get("role") in ("user", "assistant"):
                    content = message.get("content", [])
                    if isinstance(content, str):
                        text = content
                    else:
                        text = "".join(part.get("text", "") for part in content if part.get("type") == "text")
                    entries.append(f"{message['role'].capitalize()}:\n{text}")
            chat_path.write_text("\n\n".join(entries) + "\n", encoding="utf-8")
        if process.returncode == 0 and result["answer"] == "Hello" and result["session_files"]:
            result["status"] = "passed"
        elif "error" not in result:
            result["error"] = "Expected exit code 0, answer Hello, and a saved Pi session."
    except (OSError, subprocess.TimeoutExpired, ValueError) as exc:
        result["error"] = f"{type(exc).__name__}: {exc}"
        result["session_files"] = [str(p) for p in session_dir.rglob("*.jsonl")]
    result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["status"] == "passed" else 1


if __name__ == "__main__":
    sys.exit(main())
