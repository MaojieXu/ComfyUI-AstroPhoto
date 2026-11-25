"""Verify home and root in the host interpreter, then run stock ComfyUI main."""

import os
import runpy
import sys
import threading
import time
from pathlib import Path

main, expected_home, expected_root, stop = map(Path, sys.argv[1:5])
assert Path.home().resolve() == expected_home
assert Path(os.path.expanduser("~")).resolve() == expected_home
override = os.environ.get("ASTROPHOTO_HOME")
data_root = Path(override) if override else Path.home() / ".astrophoto"
assert data_root.resolve() == expected_root
assert expected_home.parent == expected_root.parent
assert expected_home.parent == stop.parent
print(f"ISOLATION Path.home={Path.home()} data_root={data_root} ASTROPHOTO_HOME={override!r}", flush=True)


def stop_on_request():
    while not stop.is_file():
        time.sleep(0.1)
    server = sys.modules["server"].PromptServer.instance

    def interrupt():
        raise KeyboardInterrupt

    server.loop.call_soon_threadsafe(interrupt)


threading.Thread(target=stop_on_request, daemon=True).start()
sys.argv = [str(main), *sys.argv[5:]]
sys.path.insert(0, str(main.parent))
runpy.run_path(str(main), run_name="__main__")
print(f"HOST_EXIT MCP modules: {[key for key in sys.modules if key.startswith(('fastmcp', 'astrophoto_mcp'))]}", flush=True)
