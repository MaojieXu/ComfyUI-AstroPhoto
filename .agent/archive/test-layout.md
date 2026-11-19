---
task: test-layout
status: completed
updated: 2026-11-16
---

## Goal
Organize tests by product, expose three independent commands, retain real Canvas/stdio coverage without future-business placeholders.

## Progress
- Reviewed existing tests and config with CodeGraph; verified Vitest 4.0.18 supports Vite 6.
- Split root node/packaging tests and MCP server/version tests, with isolated shared fixtures.
- Replaced standalone Playwright harness with Vitest Browser Mode + Vue Test Utils; kept a built-widget/CSS smoke alongside source component and serialization tests.
- Updated CI and docs to invoke the three product-specific commands. Marked two type-only imports explicitly so the source dev transform does not load a types-only package at runtime.

## Verified
- `uv run pytest tests/nodes tests/packaging`: 6 passed; includes actual MCP wheel/sdist builds and archive leakage rejection checks.
- `uv run --project mcp pytest mcp/tests`: 6 passed, including real stdio protocol startup.
- `pnpm -C frontend test`: build + 5 Chromium tests passed, including actual Canvas pixel/color assertions.
- Root `pytest --collect-only` collects only the 6 Extension/packaging tests; MCP entry collects only its own 6 tests.
- Standalone copy of mcp/ in a temporary directory: `uv run pytest -q` installed its own dev dependencies and passed all 6 tests.
- Ruff, frozen pnpm install, uv lock check, workflow YAML syntax and git diff whitespace checks passed.
- Existing migration remains uncommitted. No node behavior or public API changed.

## Decisions
- Reuse Playwright as Vitest's Chromium provider; replace standalone harness/runner.
- No backend/ or workflow integration placeholders. MCP has diagnostics only.

## Blockers
- None for this test-layout task. Real host smoke remains unverified as recorded in architecture-migration.md; it is outside default unit tests.

## Next
- Follow docs/development.md for product-specific tests. Add integration tests only with real workflow-control capabilities and an explicit host endpoint.
