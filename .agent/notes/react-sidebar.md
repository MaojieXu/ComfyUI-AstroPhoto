---
task: react-sidebar
status: handoff
updated: 2026-11-16
---

## Goal
Implement FRD v1.0 / Technical Guide v1.1 React Sidebar without replacing Vue drawing Widget or backend/MCP.

## Progress
- Read supplied attachments, AGENTS, task-notes and frontend skill; inspected dirty main at 06961ee.
- Confirmed live host in conda comfyenv (Python 3.12.16 / Torch 2.14.1+cu130), Backend 0.45.0 / Frontend 1.59.1.
- Implemented frontend/ui React shell, status/node HTTP adapters, native settings/i18n, seven information modules, canvas and drag adapters. Single Vite entry preserves Vue source and tests.
- Updated CI, docs/react-sidebar.md, architecture/development/requirements/publishing/mcp, README and project navigation.

## Verified
- GET /object_info/vue-basic: actual V3 node, python_module custom_nodes.ComfyUI_AstroPhoto.
- GET /astrophoto/v1/status: ok, node/routes registered; business capabilities unavailable.
- Official pinned Sidebar types support render/destroy. scripts/app.js works; scripts/litegraph.core.js does not (404).
- pnpm -C frontend typecheck / lint: PASS. test:react: 30 PASS (6 suites). test: 6 Vue Chromium PASS, Vite PASS.
- check:build: one JS and CSS, both registrations and relative proxy paths PASS. peers check: no issues.
- COMFYUI_TEST_URL=http://127.0.0.1:8188 uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q: 23 PASS.
- release.py registry/artifacts: Registry 21, existing MCP wheel 14/sdist 20 PASS. No publication.
- test:host: 15 successful checks, 2 existing failures, exit 1; .artifact/react-sidebar/host-evidence.json. Browser pageerrors empty.
- Actual sidebar reopen, language persistence/auto, Light/Dark, 280/650 CSS widths, add/Undo/Redo, real HTML5 drag/cancel, select-only guard, workflow structure round-trip, active Subgraph, /extensions single JS, CSS 200 verified.

## Decisions
- Use frontend/ui/src with existing frontend package/lock/Vite; aggregate Vue + React into one main.js. Preserve reference untouched.
- Bundled bilingual resources; native settings preference; seven module information pages. No fabricated asset API/data/node.
- Host previously reported broken was base conda, not intended comfyenv. Correct current documentation.
- Native history requires canvas.emitBeforeChange/emitAfterChange as well as graph boundaries; first real test exposed missing undo, corrected and reran successfully.
- Keep backend and Vue application source unchanged under this UI scope; report pre-existing failures honestly.

## Blockers

2026-11-17 follow-up: Vue pixel restoration and Chinese pen tooltip are fixed and verified (see archived drawing-persistence note). IMAGE path fix explicitly declined by user. The earlier results below are historical.
- Assets backend/Asset Source absent. P2 remains blocked.
- IMAGE live execution fails: nodes/ComfyUIFEExampleVueBasic.py resolves [temp] to absolute path then LoadImage resolves again under input; host rejects. Existing mock expects this wrong double resolution.
- Existing Vue pixels are lost on workflow reload (black -> white, widgets_values empty). Source unchanged.
- Real reverse proxy deployment, floating sidebar, browser 200% zoom, server Save dialog remain unverified. Static relative URL and CSS-width checks do not replace them.

## Next
- Review docs/react-sidebar.md and .artifact/react-sidebar evidence. Refresh running ComfyUI to use new bundle.
- Drawing persistence follow-up completed. Do not fix IMAGE delegation unless the user changes the scope; use explicit --skip-image-execution for the accepted frontend verification.
- Validate remaining deployment/layout configurations on target installations. Implement asset UI operations only after actual service/node contracts exist.
