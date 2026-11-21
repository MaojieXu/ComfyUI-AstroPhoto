---
task: backend-standardization
status: handoff
updated: 2026-11-16
---

## Goal
Implement minimal domain-first backend, native status API and V3 registration; preserve workflow contract, isolate Python 3.12 development, verify frontend and packages.

## Progress
- Read supplied guidance and project docs; CodeGraph confirmed current node is V1 despite the prompt's V3 assumption.
- Inspected ComfyUI 0.45.0 V3 loader, Custom input and Schema source; loader calls on_load before registering returned nodes.
- Existing .venv is isolated Python 3.13.15. Preserve it before creating Python 3.12 workspace.
- Implemented V3 entrypoint/node, minimal core/config/paths/errors/capabilities, bootstrap and native status API. No future domain packages created.
- Added .python-version=3.12, preserved original environment at .venv-backup-3.13, created independent .venv Python 3.12.15. Distribution minimum remains 3.11.
- Frontend now mounts bundled Vue/PrimeVue/Aura/i18n via native addDOMWidget. Added TS/vue-tsc, current host type package, output URL mapping and removal cleanup. Fixed actual TouchEvent bug exposed by typecheck.
- Updated packaging rules, CI, requirements implementation status and architecture/development/MCP/publishing docs.

## Verified
- Host Python 3.12.4 cannot import comfy_api.latest: comfy_kitchen requires torch.library.custom_op missing in Torch 2.3.0. No host dependency changes permitted.
- Frontend 1.59.1 ships domWidget shim but index has no library import map; extension must bundle its own UI dependencies and initialize PrimeVue.
- Python 3.12: unit nodes/backend 13 passed; native aiohttp integration 2 passed; host HTTP test skipped by default; packaging 7 passed. MCP 52 passed.
- Python 3.11 lower-bound node/backend/integration/packaging pass verified (initial 19 cases before 3 extra packaging cases were added).
- `pnpm -C frontend typecheck` passed; `pnpm -C frontend test`: build and 6 Chromium cases passed (mouse/touch, PNG upload, own runtime/theme, cleanup).
- `scripts/check_install.py <wheel> --version 0.0.1`: clean Python 3.12.15 install and real MCP stdio passed.
- Root/MCP versions 0.0.1. Registry 21 files including astrophoto, wheel 14, sdist 20; no MCP source in Registry, no Extension source in wheel.
- Host Python 3.12.4: independent Core/aiohttp TestServer smoke passed with installed aiohttp 3.14.5, without installation or host modification. NOT actual ComfyUI load.
- Actual host main.py startup attempted with CPU/port8199/whitelist; fails before extension loading due missing torch.library.custom_op. Same failure for direct comfy_api.latest import.
- Public PyPI astrophoto-mcp/0.0.1/json returned HTTP 404; local wheel success is not public release availability.
- Preserved newly appearing user .artifact/ handoff directory and excluded it only from Registry packaging.

## Decisions
- No business/database/software placeholders. Runtime capability report checks actual node registration; future domains explicitly unavailable.
- V3 only, preserving node/widget IDs, input name, image output and serialization.
- Status API registration occurs in ComfyExtension.on_load with injected routes for tests.
- Host type package 1.59.1 has Vue peer ^3.5.42; retain runtime Vue 3.5.13 with a narrowly scoped type-only peer exception, tested by vue-tsc/browser. Runtime host verification still required.

## Blockers
- Actual full host load/status verification blocked by existing Torch incompatibility; report separately from mocks/aiohttp test server.
- Registry publication blocked until MCP 0.0.1 is available on public PyPI. No publishing, commits, pushes or host upgrades performed.

## Next
- In a working host environment, start ComfyUI, set COMFYUI_TEST_URL, run tests/integration -m host, then manually verify drawing/save/reload/Preview Image against Frontend 1.59.1.
- Recheck full workflow JSON compatibility and native registration with the real V3 API; doubles only prove local adapter contracts.
- Before any release, obtain explicit publication authorization and validate the publicly installable matching MCP dependency.
