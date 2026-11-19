---
task: fastmcp-42
status: completed
updated: 2026-11-16
---

## Goal
Migrate only MCP to pinned FastMCP 4.2.0 with one factory, status tools and public HTTP adapters; preserve CLI and diagnostic contracts.

## Progress
- Read attachments, current AGENTS/docs and CodeGraph source; preserved existing dirty worktree including user AGENTS edits and doc/img.png deletion.
- Captured original tool schemas in mcp/tests/fixtures/status_contract.json before migration.
- Installed FastMCP 4.2.0 in isolated Python 3.11 environment and inspected actual signatures/imports.
- Implemented config, HTTP adapter, status registration and sole server factory; migrated tests/install probe to FastMCP Client; updated docs, Python bounds, CI and uv.lock.

## Verified
- fastmcp / fastmcp-slim 4.2.0 require >=3.11; resolved MCP SDK is now 2.3.0. Installed host Python is 3.12.4, ComfyUI metadata >=3.10.
- LocalProvider path is fastmcp.server.providers.local_provider, not .local; constructor supports on_duplicate='error'.
- SkillsDirectoryProvider path is fastmcp.skills.provider; validates during construction.
- Client(mode='legacy') is needed for explicit initialize; default may negotiate discover. ToolResult is exported from fastmcp.tools.
- Original version output schema is a string-valued dict; connection_status has no outputSchema or structuredContent. Preserve both with explicit output_schema and ToolResult.
- Host /object_info/{node_class} returns 200 {} for an absent node. HTTP 404 remains an error.
- MCP: 52 passed on Python 3.11.18 and 3.13.15, including in-memory auto/legacy clients, schemas/results, URL/error cases, real stdio and raw JSON-only stdout.
- Extension/packaging: 6 passed (also passed at Python 3.11 lower bound before final stdio-only test addition). Ruff and workflow YAML syntax passed.
- `uv sync --python 3.11 --frozen` using dist/check-py311 and `uv lock --check` passed; Python 3.10 dry-run was correctly rejected by both projects' >=3.11 metadata.
- `python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1` used host interpreter 3.12.4 in a disposable venv; installation and real stdio passed without altering host packages.
- Old SDK 1.30 client on dist/check-py310 Python 3.10.22 successfully initialized/listed/called version against the new server interpreter.
- Final `uv build mcp --no-sources --out-dir dist/mcp` and release.py artifacts passed: wheel 14 files, sdist 20, Registry 11; both packages 0.0.1 and isolated.
- Rechecked host Torch: 2.3.0+cpu, torch.library.custom_op absent. No full live ComfyUI claim.

## Decisions
- Raise both root and MCP minimum Python to 3.11 because the Extension pins MCP; update CI lower bound.
- No edits to frontend, nodes, reference, host dependencies, or remote publishing.
- Use FastMCP Client in memory and for stdio; preserve HTTPX MockTransport.
- Keep original version output schema and diagnostic text-only response; record input schema title removal/additionalProperties=false as framework difference. Valid existing no-argument callers verified with old SDK.

## Blockers
- No unresolved MCP migration issue. Prior host Torch/comfy_kitchen failure still limits optional full live ComfyUI integration; CI/publication not executed remotely.

## Next
- Use docs/mcp.md and docs/development.md for verified APIs/tests. Live integration requires a working ComfyUI host; add business Tools/Skills only after their backend capabilities exist.
