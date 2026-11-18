# astrophoto-mcp

Independent stdio MCP server for ComfyUI AstroPhoto. Python >=3.11.
Uses the standalone `fastmcp==4.2.0` package (not `mcp.server.fastmcp`).
No ComfyUI imports, model loading, database, daemon, or process manager.

From a source checkout:

```sh
uv sync
uv run astrophoto-mcp --version
uv run astrophoto-mcp --comfy-url http://127.0.0.1:8188
```

After publication: `pip install astrophoto-mcp==0.0.1` in the ComfyUI Python
environment (or any Python >=3.11 environment), then `python -m astrophoto_mcp`.
An MCP client launches this command and owns its stdio lifecycle. It does not
start ComfyUI. `COMFYUI_URL` supplies the default URL; `--comfy-url` overrides it.
URLs must be HTTP(S), with a hostname and an optional proxy path. Credentials,
query strings, fragments and empty values are rejected. The default is
`http://127.0.0.1:8188`; paths are normalized with a trailing slash.

Tools: `version` reports the installed MCP version; `connection_status` makes
read-only GET requests to `/system_stats` and `/object_info/vue-basic`. Errors
are reported as MCP tool errors; absence of the node returns
`extension_registered: false`. Workflow execution tools are outside this release.
WebSocket support is reserved for future execution capabilities.

For trusted local equipment discovery, set the same random URL-safe token in
the ComfyUI and MCP process environments as `ASTROPHOTO_EQUIPMENT_READ_TOKEN`.
Use a literal loopback IP with no proxy prefix. ComfyUI must opt in to its
single-user loopback mode using `ASTROPHOTO_LOCAL_STORAGE=1`. This enables
`equipment_list`, `equipment_get`, `optical_train_list`, `optical_train_get`,
`optical_train_revision_list` and `optical_train_revision_get`. These tools
read the Extension HTTP API. The server rejects writes with this credential.

`version` preserves `{name, version}` and structured content. `connection_status`
preserves `{reachable, extension_registered, system}` as JSON text, without an
output schema or structured content. An absent node is ComfyUI's HTTP 200 `{}`;
HTTP 404/500, transport failures and malformed responses remain tool errors.

`server.py` assembles one server with duplicate registration rejected;
`tools/status.py` registers the two tools; `client.py` owns HTTPX setup and
`api/comfy.py` interprets public endpoints. `config.py` resolves URL configuration.
No user-facing Skills ship yet. If real skills are added under the package's
`skills/`, the official `fastmcp.skills.provider.SkillsDirectoryProvider` validates
them before registration. Development `.agents/skills/` is never discovered.

Tests (from the monorepo root): `uv run --project mcp pytest mcp/tests`.
In a standalone copy of this directory: `uv run pytest`. The project's own dev
group installs pytest. Tests use `fastmcp.Client(server)` for in-memory protocol calls,
exercise a real stdio subprocess, and mock only the external ComfyUI HTTP boundary.
Explicit initialize-handshake tests use `Client(..., mode="legacy")`; automatic
negotiation may instead use `server/discover`. Raw stdio checks reject non-JSON
stdout output. The CLI disables the FastMCP banner; logs use stderr.

Build independently: `uv build mcp --no-sources` from the monorepo, or `uv build`
inside a standalone copy of this directory. The wheel contains only
`astrophoto_mcp` and distribution metadata.
