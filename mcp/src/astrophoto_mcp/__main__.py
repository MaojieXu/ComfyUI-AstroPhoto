"""stdio CLI; stdout is reserved for the MCP protocol."""

import argparse
from pathlib import Path

from . import __version__
from .config import resolve_comfy_url


def main() -> None:
    parser = argparse.ArgumentParser(description="ComfyUI AstroPhoto MCP (stdio)")
    parser.add_argument("--version", action="version", version=__version__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--comfy-url",
        help="ComfyUI base URL (default: COMFYUI_URL or local auto-discovery)",
    )
    mode.add_argument("--install-skill", type=Path, metavar="SKILLS_DIR",
                      help="Install the packaged AstroPhoto management skill into a local skills directory")
    args = parser.parse_args()
    if args.install_skill is not None:
        from fastmcp import Skill

        folder = "astrophoto-management"
        source = Path(__file__).with_name("skills") / folder
        destination = args.install_skill / folder
        try:
            Skill.from_directory(source).to_directory(destination)
        except (OSError, ValueError) as exc:
            parser.error(str(exc))
        print(destination.resolve())
        return
    try:
        if args.comfy_url is not None:
            resolve_comfy_url(args.comfy_url)
    except ValueError as exc:
        parser.error(str(exc))
    from .server import create_server

    create_server(args.comfy_url).run(transport="stdio", show_banner=False)


if __name__ == "__main__":
    main()
