# ComfyUI-AstroPhoto

An astrophotography toolkit for ComfyUI featuring astronomical image asset management, established astronomy software exposed as workflow nodes, an image-processing knowledge base, and MCP interfaces for workflow creation and execution by external AI agents.

## Status

Version 0.0.1 is a monorepo containing a ComfyUI Extension and an independently
packaged `astrophoto-mcp` stdio server. The drawing-board node now uses V3 registration,
with the same workflow ID and PNG-to-IMAGE contract. A minimal `astrophoto/` backend
provides `GET /astrophoto/v1/status`, configuration and truthful capability reporting;
The React AstroPhoto Sidebar provides Nodes / Assets / Settings, real node discovery,
canvas placement, bilingual UI and seven module information pages.
MCP currently provides version and connection diagnostics. Astronomy features
described above remain planned and are not implemented yet.

## Development setup

In your ComfyUI `custom_nodes` directory:

```sh
git clone https://github.com/MaojieXu/ComfyUI-AstroPhoto.git
cd ComfyUI-AstroPhoto
uv sync --frozen
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend run build
```

Refresh the browser and open the AstroPhoto sidebar. Assets currently shows an
unavailable state; Nodes lists registered AstroPhoto nodes and supports adding or
dragging them onto the native canvas. Settings provides language selection and module information.
Backend 0.45.0 / Frontend 1.59.1 is the verified target, running in Conda `comfyenv`.
The extension bundles its own Vue/PrimeVue widget and React sidebar in one script.
Drawing pixels now persist in workflow JSON and restore on reload. The Chinese pen
tooltip is also fixed. The existing IMAGE path issue is intentionally unchanged at
the user's request. See [implementation and verification](docs/react-sidebar.md).

Development uses a local uv workspace dependency, so an unpublished MCP version
does not block installation. To install into ComfyUI's own Python environment,
run `uv pip install --python <ComfyUI-Python> -r requirements.txt` from this directory.
Start MCP separately with that Python: `python -m astrophoto_mcp` (stdio).
Both projects now require Python >=3.11 because MCP uses `fastmcp==4.2.0`.
Default development Python is 3.12 via `.python-version`, in an isolated uv environment.
ComfyUI environments on Python 3.10 cannot install this release's MCP dependency.

The root project version is authoritative. Release artifacts pin the same MCP
version and ship separately: Registry ZIP excludes MCP source; MCP wheel excludes
Extension source. No runtime services are started automatically.

## Development documentation

- [Architecture](docs/architecture.md)
- [Development and tests](docs/development.md)
- [MCP contract](docs/mcp.md)
- [Packaging and release](docs/publishing.md)

The Python package identifier is `ComfyUI_AstroPhoto`; the GitHub repository name is `ComfyUI-AstroPhoto`.

## Template attribution

The Vue drawing-board example comes from [ComfyUI_frontend_vue_basic](https://github.com/jtydhr88/ComfyUI_frontend_vue_basic), included by the Comfy extension scaffold.

## License

[GNU General Public License v3](LICENSE).
