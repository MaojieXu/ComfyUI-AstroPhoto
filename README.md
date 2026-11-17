# ComfyUI-AstroPhoto

An astrophotography toolkit for ComfyUI featuring astronomical image asset management, established astronomy software exposed as workflow nodes, an image-processing knowledge base, and MCP interfaces for workflow creation and execution by external AI agents.

## Status

Version 0.0.1 is the initial Vue extension scaffold generated with `comfy node scaffold`. It currently contains the template's example drawing-board node. The astronomy features described above are planned and are not implemented yet.

## Development setup

In your ComfyUI `custom_nodes` directory:

```sh
git clone https://github.com/MaojieXu/ComfyUI-AstroPhoto.git
cd ComfyUI-AstroPhoto
npm ci
npm run build
```

Restart ComfyUI and refresh the browser. The template requires ComfyUI Frontend 1.24.4 or later. Add the `vue-basic` example node and connect its image output to a Preview Image node.

The Python package identifier is `ComfyUI_AstroPhoto`; the GitHub repository name is `ComfyUI-AstroPhoto`.

## Template attribution

The Vue drawing-board example comes from [ComfyUI_frontend_vue_basic](https://github.com/jtydhr88/ComfyUI_frontend_vue_basic), included by the Comfy extension scaffold.

## License

[GNU General Public License v3](LICENSE).
