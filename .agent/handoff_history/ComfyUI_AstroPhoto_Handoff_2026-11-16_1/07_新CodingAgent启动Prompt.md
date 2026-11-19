# 07｜交给新 Coding Agent 的执行 Prompt

> 本文件可直接复制到 Codex / Claude Code / OpenCode 等 Coding Agent 中。**先读文件、调查工作树，再实施**。项目可能已由并发 Agent 修改，切勿用聊天旧摘要覆盖新代码。

---

## 可直接复制的 Prompt

你接手 Windows 本地 **ComfyUI_AstroPhoto** 项目：

`C:\Users\Administrator\Desktop\WorkSpace\ComfyUI\custom_nodes\ComfyUI_AstroPhoto`

项目当前报告版本为 Extension/MCP `0.0.1`；当前重点是**仓库级文件结构和 Extension 业务后端的最小标准化**，而不是一次实现所有天文业务功能。

### 一、先阅读资料并纠正过时信息

1. 首先阅读本交接包的 `00_README_交接索引.md`、`06_决策日志_冲突及待核验.md`、`02_架构与文件组织.md`、`03_技术栈_环境_依赖_发行.md` 与 `05_实施任务_测试_验收.md`。若交接包未复制到仓库，要求输入其路径或使用已附加文件；不要凭假设构建。
2. 在仓库中读取 `AGENTS.md` 以及真实存在的 `docs/requirements.md`、`docs/architecture.md`、`docs/development.md`、`docs/mcp.md`、`docs/publishing.md`。文档不存在时明确报告。
3. 若 `.codegraph/` 存在，按 AGENTS.md 优先使用 `codegraph_explore`（或 CLI）；锁定真实代码路径，避免被 `reference/` 干扰。不要擅自初始化 CodeGraph。
4. 检查 Git branch、`git status`、最近提交和未提交改动；**不覆盖、不清理、不提交或推送任何用户已修改的代码**。
5. **以用户最新确认的 ComfyUI V3 Node API 为准**。早期聊天的 V1 `NODE_CLASS_MAPPINGS`、`INPUT_TYPES`、`FUNCTION` 示例为过时参考，不应引入新节点。

### 二、先只读核对当前真实工程

检查并记录：

- root `__init__.py`、`nodes/` 的 `comfy_entrypoint()`、`ComfyExtension.get_node_list()`、`io.ComfyNode.define_schema()`、`io.NodeOutput` 及现有 `node_id`。
- `vue-basic`、`CUSTOM_VUE_COMPONENT_BASIC`、PNG Data URL → `/upload/image` → LoadImage → IMAGE 的全链条入口与测试。
- root/mcp `pyproject.toml`、`uv.lock`、`requirements.txt`、`.comfyignore`、`.gitignore`、`scripts/release.py`、`scripts/check_install.py`。
- `frontend/src/main.ts`、Vue 组件、Vite 构建、locales 和 Vitest tests；检查 PrimeVue 是否由扩展自己初始化和打包。
- `mcp/src/astrophoto_mcp/` 以及其测试：`version`、`connection_status`、`--version`、`--comfy-url`、`COMFYUI_URL`、stdio 都必须保留。MCP 已经在开发中，不要按旧版目录覆盖现有新变更。
- 当前 Python 开发解释器与宿主解释器；用户此前报告 `.venv` Python 3.13.15、Host 3.12.4、ComfyUI 0.45.0、Frontend 1.59.1、FastMCP 4.2.0、uv 0.13.8；**实际检测可能已经变化**。
- 当前测试和 CI 是否可执行，是否仍有旧模板 owner `jtydhr88` 条件（只当排查线索，不当作仍存在的事实）。

先形成短的“真实现状/差异/风险”列表，再动手。

### 三、目标架构与本轮修改范围

长期模块边界：

```text
nodes/       = ComfyUI V3 Node Schema、execute、输入/输出适配
frontend/    = Vue UI / Widget / Sidebar / Settings / Canvas Bridge
astrophoto/  = Extension Domain Backend（唯一业务事实）
mcp/         = FastMCP Tools / Skills / HTTP Adapter（独立 PyPI 包）
ComfyUI      = Workflow Graph、Canvas、Undo/Save、Queue、Execution
```

本轮**只实施有实际功能的最小后端骨架**：

```text
astrophoto/
├── __init__.py
├── bootstrap.py          # 仅确有服务组装需要时添加
├── core/
│   ├── paths.py          # 可配置 data home（ASTROPHOTO_HOME）
│   ├── config.py         # 实际使用的配置
│   ├── errors.py         # 实际使用的领域错误
│   └── capabilities.py   # 可用能力真实检测
└── api/
    ├── routes.py         # 原生 PromptServer.instance.routes，注册一次
    └── status.py         # GET /astrophoto/v1/status
```

- `astrophoto/core` 的导入不得写盘、创建数据库、下载模型或探测/启动所有天文软件。
- `status` 必须返回真实 Extension 状态；未完成的 Assets/Software/Canvas/Knowledge/Memory/Experiments 不能返回 available。
- `api/routes.py` 使用 ComfyUI 自带 aiohttp/PromptServer，不引入 FastAPI/Uvicorn。
- 模块依赖：Nodes/API → Domain Service → Repository/Adapter，MCP 只走 HTTP/WS API。
- **暂不创建**空的 Assets/Memory/Knowledge/Software/Experiments/Canvas 业务实现或静态占位 Tools/Skills。
- 保留现有 frontend/Node/MCP 对外契约与现有文件名/Node ID。

### 四、开发环境与依赖规则

- 默认独立开发 Python **3.12**（尽量对齐宿主 3.12.4），保留宿主 Python 环境独立；先检查现有 `.venv`，避免破坏性覆盖。
- 不在 ComfyUI 宿主运行 `uv sync`；不未经兼容性验证升级宿主 torch 2.3.0/NumPy 1.26.4/Pillow 10.3.0。
- 保持 uv Workspace 单个 `uv.lock` 与 root/MCP 两份发行元数据。
- 当前 `requirements.txt` 可能使用本地 `./mcp`，这与 Registry 排除 `mcp/` 不兼容；需要建立可验证的开发与发布依赖策略。但当前 MCP PyPI 版本若尚未正式上传，不可为了“解决依赖”而未经允许实际发布。
- 前端尽量复用原有 Vue/Vite/ComfyUI API；PrimeVue 由扩展自行管理，不假设宿主提供。没有 TypeScript/vue-tsc 独立检查就不能报告类型检查通过。

### 五、官方 API 核验（版本敏感）

使用实际安装版本核对官方文档：

- V3 Node：<https://docs.comfy.org/custom-nodes/v3_migration>
- HTTP/WS：<https://docs.comfy.org/development/comfyui-server/comms_routes>
- Registry：<https://docs.comfy.org/registry/publishing>
- Frontend：<https://docs.comfy.org/custom-nodes/js/javascript_overview>
- PrimeVue removal：<https://docs.comfy.org/custom-nodes/js/primevue-removal-migration>
- FastMCP Skills：<https://gofastmcp.com/docs/servers/skills>
- uv Workspace：<https://docs.astral.sh/uv/concepts/projects/workspaces/>
- uv Sync：<https://docs.astral.sh/uv/concepts/projects/sync/>

不要凭旧 AI 对话直接复制未经核验的 API 调用，尤其是 V1/V3 和 FastMCP 4.1/4.2 Skills Provider 路径。

### 六、运行测试并修复

实际执行适合当前代码的测试和构建，重点：

1. V3 `comfy_entrypoint`、节点注册、`vue-basic` ID 和 `NodeOutput`；确认现有 PNG→IMAGE 路径不回归。
2. 新的 `/astrophoto/v1/status` 和 capability 结构、路由只注册一次、导入无副作用、data home 可配置。
3. MCP `version`、`connection_status`、stdio initialize/list_tools/call_tool、HTTPX MockTransport 与反向代理前缀。
4. Vue/Vite 构建及 widget 序列化；实际 Host 1.59.1 的 PrimeVue/ComfyUI API 兼容。
5. `uv` 解析 Python 3.12 Workspace、MCP wheel 独立构建、Extension Registry 归档内容及依赖引用。
6. 在实际 ComfyUI 0.45.0/Host Python 3.12.4 启动验证；若无宿主可启动，报告未验证，不用 mock 伪造通过。

候选命令：`uv run pytest tests/nodes tests/packaging`、`uv run --package astrophoto-mcp pytest mcp/tests`、`pnpm -C frontend build`、`pnpm -C frontend exec vitest run`、`uv build mcp/`。**先检查真实脚本/依赖是否存在，再执行**。

### 七、更新文档/任务记录

- `docs/architecture.md` 只记录真实已落地的目录与调用关系。
- `docs/requirements.md` 的未实现业务仍须标为 Planned，不得因为新建目录就宣称实现。
- `docs/development.md` 记录真实可执行命令、开发/Host 两环境。
- `docs/mcp.md` 保留现有 Tools 与状态 API，描述未来接口时明确为目标。
- `docs/publishing.md` 确认发行依赖/归档内容边界。
- `AGENTS.md` 简短，仅架构规则、文档导航与 `$task-notes` 触发。
- 对复杂/跨 Session 任务按 `$task-notes` 使用 `.agent/notes/<task-id>.md`，更新已验证证据及下一步。

### 八、安全与限制

- 不改 `reference/`、不上传真实用户数据、不擅自执行发行、推送、提交或创建 Git Tag。
- 不在插件导入/启动时安装 Python 包、执行数据库迁移或下载模型。
- 不运行任意 Agent 传入的 Shell 命令，不盲目修改用户文件。
- API、MCP 必须考虑权限，尤其是本地任意路径和未来 Memory/Assets。
- 无需为了“标准化”实现完整 RAG、Memory、Siril/PixInsight、33 Skills、调参 Agent。
- 如工程已被别的 Agent 更新，先识别并继承新成果，不做破坏性重复重构。

### 九、最终报告

给出：

1. 真实修改后的目录树（列明新增/移动/删除与原因）。
2. V3/Frontend/MCP/Status 的实现情况与兼容性。
3. 实际运行的命令、通过/失败数量及证据，分开发单元测试、Host 集成、发行验证。
4. `.python-version`/依赖/版本/发行策略调整。
5. 未完成任务与阻塞原因；不得把假设性验证写成通过。

目标是**保留 v0.0.1 实际可用功能、规范 `astrophoto/` 后端基础层、固定 V3/Workspace/Registry/MCP 边界**。完成这个基础后才开始后续各项天文业务实现。

---

## 不应在执行 Prompt 中删减的限制

- “先审计已有改动”，否则可能覆盖正在进行的 MCP 重构。
- “V3 是标准”，否则会回退到 V1。
- “没有真实测试不得标验证”，否则后续交接不可靠。
- “明确本轮是结构规范，不一次做完业务”，否则会出现大量空目录和伪 Tool。
