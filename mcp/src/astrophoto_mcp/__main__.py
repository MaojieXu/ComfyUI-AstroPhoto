"""stdio CLI; stdout is reserved for the MCP protocol."""

import argparse

from . import __version__
from .config import resolve_comfy_url


def main() -> None:
    parser = argparse.ArgumentParser(description="ComfyUI AstroPhoto MCP (stdio)")
    parser.add_argument("--version", action="version", version=__version__)
    parser.add_argument(
        "--comfy-url",
        help="ComfyUI base URL (default: COMFYUI_URL or http://127.0.0.1:8188)",
    )
    args = parser.parse_args()
    try:
        base_url = resolve_comfy_url(args.comfy_url)
    except ValueError as exc:
        parser.error(str(exc))
    from .server import create_server

    create_server(base_url).run(transport="stdio", show_banner=False)


if __name__ == "__main__":
    main()
