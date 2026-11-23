# ComfyUI-AstroPhoto

A local-first astrophotography extension for ComfyUI, developed alongside an independently packaged MCP server for external agents. Current capabilities and planned work are listed in the [product requirements](docs/requirements.md).

## Status

The 0.0.1 source tree includes V3 drawing and scientific source nodes, a Vue sidebar, local storage, equipment and optical trains, a photography library, and a Siril processing bundle. The stdio MCP server provides connection diagnostics, authorized read-only equipment queries, and separately authorized asset library operations. The MCP canvas bridge, knowledge retrieval, user memory, and product Skills are planned.

## Development setup

In your ComfyUI `custom_nodes` directory:

```sh
git clone https://github.com/MaojieXu/ComfyUI-AstroPhoto.git
cd ComfyUI-AstroPhoto
uv sync --frozen
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend run build
```

Refresh the browser and open the AstroPhoto sidebar. Use Assets to browse projects, manage assets and collections, and open the Calibration Library.
Use Nodes to add or drag registered AstroPhoto nodes onto the native canvas. Use
Settings to manage storage, equipment and processing software. The UI follows the
host language and theme. The migration targets ComfyUI 0.46.0 and Frontend 1.59.6.
Vite builds the Vue extension into `js/main.js` and `js/assets/main.css`.
Drawing pixels persist in workflow JSON. The known downstream IMAGE execution issue
is recorded in the [pre-migration sidebar evidence](docs/react-sidebar.md).

Development uses a local uv workspace dependency, so an unpublished MCP version
does not block installation. To install into ComfyUI's own Python environment,
run `uv pip install --python <ComfyUI-Python> -r requirements.txt` from this directory.
Start MCP separately with that Python: `python -m astrophoto_mcp` (stdio).
Start or restart ComfyUI after installing the extension. AstroPhoto checks and
initializes its data root (normally `~/.astrophoto/`) as the extension loads.
This runs automatically without MCP.
Both projects now require Python >=3.11 because MCP uses `fastmcp==4.2.0`.
Default development Python is 3.12 via `.python-version`, in an isolated uv environment.
ComfyUI environments on Python 3.10 cannot install this release's MCP dependency.

The root project version is authoritative. Release artifacts pin the same MCP
version and ship separately: Registry ZIP excludes MCP source; MCP wheel excludes
Extension source. No runtime services are started automatically.

## Development documentation

- [Product requirements and implementation status](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Development and tests](docs/development.md)
- [MCP contract](docs/mcp.md)
- [Packaging and release](docs/publishing.md)

The Python package identifier is `ComfyUI_AstroPhoto`; the GitHub repository name is `ComfyUI-AstroPhoto`.

## Template attribution

The Vue drawing-board example comes from [ComfyUI_frontend_vue_basic](https://github.com/jtydhr88/ComfyUI_frontend_vue_basic), included by the Comfy extension scaffold.

## License

[GNU General Public License v3](LICENSE).
