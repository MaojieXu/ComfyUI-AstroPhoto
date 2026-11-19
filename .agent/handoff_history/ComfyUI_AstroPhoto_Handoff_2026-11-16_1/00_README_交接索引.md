# ComfyUI_AstroPhoto｜交接资料索引

> **交接日期**：2026-11-16（项目聊天记录时间）  
> **性质**：对话成果、需求、架构决策、已知状态、未决事项的系统性交接。**不是仓库审计，也不是已执行的开发成果**。  
> **软件版本**：用户最后一次报告 Extension 与 MCP 均为 **0.0.1**。  
> **需求基线**：先前撰写的 **v0.2**（仅为需求文档版本）。  
> **节点标准**：**ComfyUI V3 Node API**，这是用户后续明确纠正的最终约束，覆盖旧文档中的 V1 描述。

## 0. 新 Agent 的第一条规则

**先阅读本文件和 `06_决策日志_冲突及待核验.md`，再看 `02_架构与文件组织.md`。不要把聊天中的设计示例、目标文件树、文档标题，当成现有仓库真实代码。**

本次整理实际读取了会话中的需求基线、V3 后端教程、Skill 设计材料，并在 2026-11-16 核对了 ComfyUI、FastMCP、uv、Agent Skills 等官方在线文档。**没有读取 Windows 本地仓库、没有启动 ComfyUI、没有运行 pytest/Vitest，也没有执行任何发布。**

## 1. 文件索引与阅读顺序

| 文件 | 内容 | 什么时候读 |
|---|---|---|
| `00_README_交接索引.md` | 状态摘要、术语、资料导航 | 每次接手第一篇 |
| `01_产品需求与范围.md` | 完整目标体验、九类能力、验收场景 | 定义需求/开发业务时 |
| `02_架构与文件组织.md` | 模块所有权、V3、目录树、调用数据流、外部软件 Adapter | 改架构/增模块前 |
| `03_技术栈_环境_依赖_发行.md` | 用户报告的精确版本、双环境、uv/Manager/PyPI/CI | 安装、构建、发版相关 |
| `04_MCP_Tools_Skills_知识库_记忆.md` | FastMCP 结构、三层披露、全部候选 Skills、RAG、Memory、实验模型 | 开发 Agent 能力时 |
| `05_实施任务_测试_验收.md` | 结构标准化 P0 的执行范围、后续顺序、分层测试与验收 | 接续开发、交付验证 |
| `06_决策日志_冲突及待核验.md` | 重要变更时间线、已确认/建议/未核验、纠错、风险矩阵 | 遇到矛盾/不确定性时 |
| `07_新CodingAgent启动Prompt.md` | 可直接复制的下一轮实施提示词 | 交给新 Agent 工作时 |
| `08_官方参考及证据索引.md` | 本轮检索核实的官方 URL、证据层级、验证边界 | 查 API/版本/依据时 |
| `09_AGENTS.md_建议稿.md` | 与交接资料一致的简短项目指令 | 更新根 AGENTS.md 前 |
| `FULL_完整交接汇编.md` | 上述正文拼接为一个入口文件 | 希望只提交一个文件时 |

`references/` 保留旧稿，仅作为历史资料：

- `Baseline_v0.2_历史参考.md`：完整 v0.2 需求基线，但含 **V1 节点旧叙述**，不应直接作为现行实现指令。
- `Backend_Standardization_V3_历史参考.md`：V3 后端标准化教程，示例代码仅为教学模板，没有在本地仓库验证。
- `Skills_讨论原稿.md`：先前的 Skills 讨论，含候选目录与部署思路；具体 API 请以 2026-11-16 核验为准。

## 2. 项目一句话定位

**ComfyUI_AstroPhoto 是面向本地天文摄影的 ComfyUI 扩展，计划在同一工作台实现天文资产/设备与校准数据管理、Siril/PixInsight 处理节点、图像处理知识库、可控的用户长期记忆与参数实验；独立的 FastMCP 包让外部 Agent 通过 Tools 和 Skills 完成发现、画布编辑及工作流执行。**

核心职责：

```text
ComfyUI Runtime / Frontend  →  工作流、画布、节点注册、保存、Undo、队列与执行
AstroPhoto Extension        →  天文业务、数据库、外部软件驱动、Knowledge、Memory
FastMCP (PyPI)             →  外部 Agent Tools / Skills / API Adapter
外部 Agent Harness          →  规划、决策、Subagent、参数搜索策略
```

不能在 MCP 中复制 Extension 数据库或实现第二个执行引擎。不能把 Agent 的对话记忆和 Extension 的持久用户记忆混为一谈。

## 3. 现状（截至用户最后一次信息更新）

**以下是用户报告，不是本次独立核验：**

- 源码位于 Windows `C:\Users\Administrator\Desktop\WorkSpace\ComfyUI\custom_nodes\ComfyUI_AstroPhoto`。
- Extension 与 MCP 版本都是 `0.0.1`，Monorepo + uv Workspace 基础、Vue 示例前端、JS 输出、locales、测试、CI、打包脚本、CodeGraph、`AGENTS.md`/`task-notes` 等已存在或有相应配置。
- **现有节点采用 V3**（用户随后明确纠正早期“V1 INPUT_TYPES”描述），应以实际源码的 `comfy_entrypoint` 和 `get_node_list()` 验证。
- 已有 `vue-basic`、`CUSTOM_VUE_COMPONENT_BASIC` 和 Canvas → PNG Data URL → `/upload/image` → LoadImage → IMAGE 的工作路径。
- 已有 MCP CLI/stdin-stdout（stdio）启动、`version`、`connection_status`、`client.py` 对 `/system_stats` 与 `/object_info/vue-basic` 的诊断、相关测试。MCP 内部**正在开发中**，新 Agent 先查看工作树差异，不得以旧描述覆盖较新代码。
- **还没有真实落地**资产库、完整软件 Adapter、Canvas Bridge、知识库、持久 Memory、参数调优实验、33 个业务 Skills。

## 4. 设计已经形成共识的事项

1. **单 Monorepo，两份发行包**：根 Extension → Comfy Registry；`mcp/` → PyPI。统一版本号、同 Tag 双发布，MCP 先发布。
2. **ComfyUI 原生优先**：V3 Node API、`WEB_DIRECTORY`、前端扩展、`PromptServer.instance.routes`、原生 `/prompt`/`/object_info`/`/ws`/`/history`、模型目录 `folder_paths`。
3. **按业务域的模块化单体**：在项目根目录新增 `astrophoto/`，不建立 FastAPI/Uvicorn 独立服务。
4. **独立开发环境**：建议 Python 3.12 uv `.venv`；实际 ComfyUI 宿主是 Python 3.12.4。不要对宿主执行 `uv sync`。
5. **数据所有权**：建议 `~/.astrophoto/databases/{assets,knowledge,memory}.db` 三个 SQLite 文件；大 FITS/视频保留文件引用；Memory 与 Knowledge 不混库。
6. **三层渐进披露**：L0 连接/能力，L1 搜索/描述，L2 变更/执行；不是三个服务器，也不是必须动态隐藏全部 Tools。
7. **Skills 随 MCP Wheel**：用户业务 Skill 存在 `mcp/src/astrophoto_mcp/skills/`；开发 `task-notes` 在 `.agents/skills/`，不发给用户。
8. **安全与隐私**：不接受 Agent 任意 Shell；软件命令由 Adapter 构造；记忆采集可控、可查询、可删除；访问本地数据的远程 API 需要认证与范围限制。

## 5. 明确不能带入新一轮的错误假设

- “V1 是当前节点 API”——**错误/过期**，用户已明确 V3。
- “`NODE_CLASS_MAPPINGS` 是本项目最终注册机制”——**不作为最终标准**；根文件只保留官方 V3 接口和 `WEB_DIRECTORY`。
- “有目录/Skill 文件就等于功能可用”——**错误**。必须通过真实能力检测与测试。
- “Manager 更新 Extension 就一定升级所有外部 MCP 环境”——**错误**；只可能管理它安装依赖时所操作的 Python 环境。
- “`.comfyignore` 排除 MCP 会让 Git clone 安装也不携带它”——**错误**；Git clone 仍带完整仓库。
- “`uv.lock` 是 ComfyUI-Manager 的安装锁”——**错误**。
- “`/prompt` 可以直接修改用户当前打开的前端画布”——**错误**；必须通过前端桥接。
- “开发 `.venv` 3.13 测试通过代表宿主 3.12 已通过”——**错误**。

## 6. 下一轮最高优先级

**做仓库与 Extension Backend 的结构标准化，不抢跑全部业务实现**：检查工作树与 V3 实现 → 核实发行依赖 → 将开发 `.venv` 转向 Python 3.12（无破坏性迁移）→ 创建实际可用的 `astrophoto/core`、`api/status` 和轻量路由 → 验证现有节点/画板/MCP 无回归 → 测试 Registry 归档及 MCP wheel 的独立性 → 更新真实文档。MCP 内部已在开发，不要覆盖和重复重构。

若上一步已由其他 Agent 完成，先用源码、Git、测试结果识别其完成度，不重做。

## 7. 源文件与权威性

本套交接资料融合用户的对话信息、之前生成的 Markdown、以及本次官方文档核查。**本套交接不等于实际仓库状态**。官方来源列表见 `08_官方参考及证据索引.md`，需版本敏感的 API 必须以安装的 ComfyUI 0.45.0 / FastMCP 4.2.0 为最终运行验证目标。
