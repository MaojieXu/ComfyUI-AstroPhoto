---
task: architecture-migration
status: handoff
updated: 2026-11-16
---

## Goal
Migrate scaffold to a ComfyUI extension + independent MCP monorepo, preserving drawing workflow and lockstep releases.

## Progress
- Subsequent test organization and current commands/results are recorded in `.agents/archive/test-layout.md`; the verification counts below describe the original migration pass.
- Inspected Git, CodeGraph source, host loading/locales, dependencies and CI.
- Implemented nodes/frontend migration, explicit CSS loading, independent MCP and lockstep artifact preparation.
- Added uv/pnpm locks, CI/release workflows, 4 architecture/development docs, updated AGENTS/task-notes.

## Verified
- Baseline README was already modified; reference/ and agent resources were untracked.
- Host loads WEB_DIRECTORY and root locales/*/main.json.
- Original Python node + all 4 Vue components equal Git HEAD originals after newline normalization.
- `uv run python -m pytest -q`: 8 passed on Python 3.13.15 and isolated Python 3.10.22.
- `pnpm --dir frontend run build` and `pnpm --dir frontend test`: build OK, 2 Chromium tests passed (built widget, CSS, PNG upload, clearing, i18n).
- `uv build mcp --no-sources --out-dir dist/mcp`: wheel and sdist built.
- `scripts/release.py artifacts`: Registry 11 files and MCP wheel 9 files, isolated and both 0.0.1.
- `scripts/check_install.py <wheel> --version 0.0.1`: independent temporary venv install, actual stdio handshake/list/version tool passed.
- Ruff, workflow YAML syntax, skill validator (Python -X utf8), version/tag check, frozen pnpm install passed.

## Decisions
- Retain V1 registration and widget contract.
- Pin MCP in release metadata; use local uv source/requirements before publication.
- No astronomy placeholders, host modifications or publishing.

## Blockers
- Actual host startup: `python main.py --cpu --listen 127.0.0.1 --port 8199 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto` fails before plugin loading: Torch 2.3.0 lacks torch.library.custom_op required by comfy_kitchen. Host dependencies not modified.
- GitHub Actions and real publication deliberately not executed; live ComfyUI IMAGE output remains unverified.

## Next
- With a working ComfyUI Python environment, smoke test vue-basic → Preview Image in the real UI and verify host-provided Vue/PrimeVue imports.
- Before publishing: configure Trusted Publisher/Registry token, commit reviewed source and locks, and explicitly initiate a release. No tag or credential was created here.
