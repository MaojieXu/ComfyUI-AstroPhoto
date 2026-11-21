# ComfyUI_AstroPhoto

## Overview

A local-first astrophotography extension for ComfyUI with an independently packaged MCP server, maintained in a single repository.

**Current (v0.0.1):** V3 drawing-board and scientific nodes, Core/status API, MCP diagnostics, Vue Sidebar with node browsing, storage settings, equipment and optical trains. Assets shows a placeholder while its existing backend routes remain available. Siril is composed as a processing Bundle. See `docs/development.md` for the target host and verification scope.

**Planned:** Astronomy asset management, software processing nodes, workflow automation, knowledge RAG, persistent user memory, parameter optimization, and distributable Agent Skills.

Do not treat planned capabilities as implemented.

## Architecture

- ComfyUI owns workflow graphs, canvas state, saving, undo, node registration, and execution.
- The Extension provides Vue UI, Python nodes, and business services through ComfyUI's native APIs and aiohttp routes.
- Use V3 `comfy_entrypoint` / `ComfyExtension` / `io.ComfyNode`; keep node IDs stable. `astrophoto/` is a domain-first modular monolith; create only implemented modules. Initialize storage and register native routes in `on_load`. Do not initialize storage on import, UI mount or node execution.
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
- `docs/react-sidebar.md`: Historical React implementation and prior host evidence, including the separate IMAGE execution issue.
- `frontend/src/` hosts public Vue UI and adapters. `extension/frontend-entry.ts` composes the single Vite build, and `extension/siril/` owns Siril-specific Python and UI. Use `pnpm -C frontend typecheck`, `lint`, `test`, `check:build`, and `check:proxy`.
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

- Follow [`$feature-pipeline`](.agents/skills/feature-pipeline/SKILL.md) for Feature documents: `PRD.md` -> `UXUI.md` (only when UX/UI changes) -> `Tech.md` -> `Implement.md` -> `Test_Plan.md` -> `Test_Report.md` -> `Close.md`.
- During development, an initial test plan may describe expected scenarios. Complete the feature's business implementation and update `Implement.md` (`04_DEV.md`) to reflect the code. Then finalize `Test_Plan.md` (`05_TEST_PLAN.md`) against the actual implementation and the updated implementation document, write or update the test code from that specification, and run the relevant regression tests together.
- Defer routine test authoring and execution until the business implementation is complete. When test code is needed to locate a specific bug, write or run the smallest targeted test early. Continue to honor existing mandatory quality gates.
- Use `$task-notes` for complex or cross-session coding tasks.
- Resume from `.agents/notes/<task-id>.md`; verify state against code, Git, and tests.
- Keep task-specific logs out of `AGENTS.md`.
- Use [$handoff-maintenance](.agents/skills/handoff-maintenance/SKILL.md) at task close to check both the Core repository tree and Module file maps. Maintain one current handoff under `.agents/handoff/core/` and `.agents/handoff/module/`; update affected content when implementation, interfaces, tests, or known limits change. Keep Core and each Module endpoint to at most 20 Markdown files each; only consider splitting a module Markdown file after it exceeds 200,000 Unicode characters. Core must stand alone for first delivery, with requirements, current flows and acceptance boundaries for each endpoint and links confined to Core. Module contains file-level implementation details and may link to Markdown within Core or Module. Distinguish current implementation, plans, historical evidence, and unverified claims.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
