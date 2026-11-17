# ComfyUI_AstroPhoto

## Overview

A local-first astrophotography extension for ComfyUI with an independently packaged MCP server, maintained in a single repository.

**Current (v0.0.1):** V3 drawing-board node with workflow pixel persistence, minimal Core/status API, MCP diagnostics, React Sidebar with real node browsing and canvas adapter. Host loading is verified in Conda `comfyenv`; the known IMAGE execution path issue is intentionally unchanged, as documented in `docs/react-sidebar.md`.

**Planned:** Astronomy asset management, software processing nodes, workflow automation, knowledge RAG, persistent user memory, parameter optimization, and distributable Agent Skills.

Do not treat planned capabilities as implemented.

## Architecture

- ComfyUI owns workflow graphs, canvas state, saving, undo, node registration, and execution.
- The Extension provides Vue UI, Python nodes, and business services through ComfyUI's native APIs and aiohttp routes.
- Use V3 `comfy_entrypoint` / `ComfyExtension` / `io.ComfyNode`; keep node IDs stable. `astrophoto/` is a domain-first modular monolith; create only implemented modules. Initialize native routes in `on_load`, without creating storage or loading models.
- The external MCP communicates through supported ComfyUI and Extension APIs; never directly access ComfyUI internals or business databases.
- Business services own persistent data under `~/.astrophoto/`; ComfyUI manages workflow execution and registered model paths.
- Preserve existing `vue-basic`, `CUSTOM_VUE_COMPONENT_BASIC`, widget serialization, translations, and PNG upload → LoadImage → IMAGE behavior.
- Preserve FITS precision and scientific metadata; do not silently convert scientific data to ordinary IMAGE.
- Canvas editing requires a frontend bridge and execution receipts; this bridge is not implemented yet.
- External software paths and operations must be validated by backend adapters; never execute arbitrary Agent-supplied commands.

## Business Domains

- **Assets:** Equipment, observing sites, capture sessions, frames, and calibration associations.
- **Software:** Siril/PixInsight discovery, configuration, capabilities, and processing nodes.
- **Workflows:** Node discovery, canvas operations, execution, and results.
- **Knowledge:** LangChain-based retrieval over astronomy processing documentation.
- **Memory:** User activities, preferences, feedback, and contextual recall, independent of the Agent Harness.
- **Experiments:** Reproducible parameter trials, metrics, and optimization history.

Business domains are implemented incrementally. Do not create unused abstractions or placeholder modules.

## Data & Privacy

- Use separate SQLite databases for assets, knowledge, and memory.
- Only Extension business services may access their databases.
- Keep large image files outside SQLite; preserve source paths and metadata.
- Keep user memory separate from workflow execution history and domain knowledge.
- Collect behavioral memory only with user control; support review, correction, and deletion.
- Do not infer user preferences solely from automated Agent actions.

## MCP & Skills

- Use FastMCP for the external MCP server, with progressive discovery and domain-oriented tools.
- MCP Tools perform operations; Agent Skills define workflows; Knowledge provides references; Memory provides user context.
- Keep user-facing Skills in `mcp/src/astrophoto_mcp/skills/` and distribute them with the MCP package when implemented.
- Use `$task-notes` from `.agents/skills/task-notes/` for coding tasks; it is not a user-facing AstroPhoto Skill.
- Never expose a planned Tool or Skill as functional before its dependencies are implemented and verified.
- Keep Subagent planning and orchestration outside the Extension and MCP.

## Project Navigation

- `docs/requirements.md`: Target requirements and implementation scope.
- `docs/architecture.md`: Current modules, boundaries, dependencies, and data flows.
- `docs/development.md`: Environment, commands, builds, and tests.
- `docs/mcp.md`: MCP tools, protocols, Skills, and API contracts.
- `docs/publishing.md`: Packaging, versioning, and releases.
- `docs/react-sidebar.md`: React UI requirements mapping, version-specific Host Adapter and real host evidence.
- `frontend/ui/`: React Sidebar; shares frontend pnpm lock/Vite entry with existing Vue Widget. Use `pnpm -C frontend test:react`, `lint`, `typecheck`; keep Vue `test` checks.
- Tests: `tests/nodes`, `tests/packaging`, `frontend/tests`, and `mcp/tests`; live cross-component tests belong in `tests/integration`.
- Read task-relevant documentation and source code. If a document is absent or outdated, verify actual implementation before proceeding.

## Development & Release

- Use `uv` for Python and `pnpm` for frontend development.
- Default development Python is 3.12 (`.python-version`); distribution minimum remains 3.11. Keep the uv workspace isolated from the ComfyUI Python environment; never sync into the host.
- Follow verified commands in `docs/development.md`.
- Preserve compatibility with the installed ComfyUI host; prefer native extension mechanisms over duplicate infrastructure.
- Use Lockstep SemVer with root `pyproject.toml` as the version source.
- Keep Extension, MCP, and dependency versions synchronized.
- Publish MCP to PyPI before Extension to Comfy Registry.
- Exclude MCP source and development-only files from Registry packages; include required `js/` and `locales/` assets.
- Include user-facing Skills in the MCP distribution and validate their Tool dependencies.
- Run relevant tests and packaging checks; verify cross-component behavior before release.
- Update affected documentation when implementation or contracts change.

## Agent Notes

- Use `$task-notes` for complex or cross-session coding tasks.
- Resume from `.agent/notes/<task-id>.md`; verify state against code, Git, and tests.
- Keep task-specific logs out of `AGENTS.md`.

<!-- CODEGRAPH_START -->
## CodeGraph

When `.codegraph/` exists, use `codegraph_explore` (or `codegraph explore`) before searching or reading code. Prefer exact project file paths because `reference/` is also indexed. Skip CodeGraph if no index exists; do not initialize one without a request.
<!-- CODEGRAPH_END -->
