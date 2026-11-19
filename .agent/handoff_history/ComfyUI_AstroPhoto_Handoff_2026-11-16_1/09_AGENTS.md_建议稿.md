# 09｜与本交接包一致的根 AGENTS.md 建议稿

> **用途**：仅为建议，**没有修改真实仓库文件**。当前用户有现成 `AGENTS.md`，其中的 CodeGraph 自动管理区块和其它有用规则必须保留。以下版本用于核对、择需合并，不要直接覆盖未提交的文件。

```markdown
# ComfyUI_AstroPhoto

## Overview

A local-first astrophotography extension for ComfyUI, with an independent FastMCP distribution in the same repository.

Current (v0.0.1, verify against source): V3 vue-basic drawing-board node and MCP version/connection diagnostics.
Planned: asset/equipment management, Siril/PixInsight nodes, canvas automation, knowledge RAG, user memory, experiments and agent skills.
Never treat planned functionality as implemented.

## Architecture

- Use ComfyUI V3 Node API: `io.ComfyNode`, `define_schema()`, `execute()`, `io.NodeOutput`, `ComfyExtension` and `comfy_entrypoint()`.
- ComfyUI owns graphs, canvas, saving, undo, node execution and queue.
- `nodes/` owns node schemas and I/O adaptation; `frontend/` owns Vue UI; `astrophoto/` owns domain services, data and software adapters; `mcp/` owns external Tools/Skills and HTTP clients.
- Do not bypass ComfyUI public APIs or access Extension business databases from MCP.
- Preserve `vue-basic`, `CUSTOM_VUE_COMPONENT_BASIC`, current widget serialization, locales and PNG upload → LoadImage → IMAGE behavior.
- Never silently discard scientific FITS precision or metadata.
- Use ComfyUI PromptServer/aiohttp for Extension APIs; do not add a parallel FastAPI/Uvicorn server.
- Keep planned business modules and Tools absent until functional and tested.

## Project Navigation

- `docs/requirements.md`: target capabilities and priorities, not current implementation.
- `docs/architecture.md`: actual module map and dependencies.
- `docs/development.md`: real setup, build, run and test commands.
- `docs/mcp.md`: current MCP Tools, protocols, contracts and future Skills.
- `docs/publishing.md`: Registry/PyPI package boundaries and versioning.
- Read task-relevant docs, verify against actual code and tests, update affected documentation.

## Environment & Release

- Use independent uv development workspace; prefer Python 3.12 to match ComfyUI host Python 3.12.4.
- Do not run `uv sync` in the ComfyUI host environment or upgrade its Torch/NumPy without verification.
- Use pnpm for frontend; verify PrimeVue initialization and CSS within the extension.
- Keep Extension/MCP lockstep SemVer; root `pyproject.toml` as the version source.
- Build and validate both artifacts separately: MCP PyPI before Extension Registry.
- Registry package includes `nodes/`, `astrophoto/`, `js/`, `locales/`; excludes MCP source, reference and development files.
- Run relevant unit/integration/packaging tests and distinguish host verification from mocks.

## Agent Notes

- Use `$task-notes` for complex or cross-session coding tasks.
- Resume from `.agent/notes/<task-id>.md`; verify state against code, Git and tests.
- Keep task-specific logs out of `AGENTS.md`.

<!-- CODEGRAPH_START -->
## CodeGraph

When `.codegraph/` exists, use `codegraph_explore` (or `codegraph explore`) before searching or reading code. Prefer exact project file paths because `reference/` is also indexed. Skip CodeGraph if no index exists; do not initialize one without a request.
<!-- CODEGRAPH_END -->
```

## 与 task-notes 的职责

建议开发 Skill 放 `.agents/skills/task-notes/SKILL.md`，任务记录放 `.agent/notes/<task-id>.md`，历史放 `.agent/archive/`。Note 的状态从 `active / blocked / handoff / completed` 选择，格式 frontmatter `task/status/updated`，内容 `Goal/Progress/Verified/Decisions/Blockers/Next`。

`AGENTS.md` 应保持简洁、可导航，不复制几十个未来业务需求、完整终端命令或 Notes 日志。交接包的详细技术决策放 `docs/` 与本交接材料。

## 工程适用性

上述提示词引用了 `/astrophoto/`（目标模块）和 `docs/requirements.md`（若已创建则读取）的目录。**如果本地代码尚未包含这些文件，按实际情况创建或补文档，不可假设当前已经存在**。新的 Agent 应以 `git status` 与源码为事实基准。
