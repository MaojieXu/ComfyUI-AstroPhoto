# ComfyUI_AstroPhoto — Repository-Verified Full Handoff

审计日期：2026-11-16 America/Chicago。以下按专题原文自动拼接，不另行重述，状态以各专题注明范围为准。



---

<!-- BEGIN 00_README.md -->

# Repository-Verified Handoff

审计日期：2026-11-16，America/Chicago（UTC 为 2026-11-17）。软件版本 0.0.1；需求基线 v0.2 不是发行版本。

本包基于真实工作树、锁文件、安装环境和本轮测试。**工程基础已实现并通过隔离验证，但真实 ComfyUI 宿主验收未完成，不具备发布验收完成结论。**

## 输入与边界

仓库：`C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`。
原始资料：`.artifact/ComfyUI_AstroPhoto_Handoff_2026-11-16/`。已读取 00–09 正文及 MANIFEST，针对 V3、Skills、数据归属回查 references；FULL 是历史汇编，不作为第二份实现证据。原始包留在原处、未修改或移动；SHA256 见 `evidence/historical-hashes.json`。Registry 已排除 `.artifact/`。本次没有重建或假冒原始 ZIP。

Git：main，HEAD `06961eebe42674714dc2992b0a9de654b3a5a566`，大量既有未提交迁移文件。**仅 HEAD 不能复现当前实现**；应同时保留当前工作树和本包源码哈希清单。没有提交、推送、切换分支、发布或更改宿主依赖。本轮只修订文档与开发任务记录；构建/测试生成了忽略的产物与缓存。

## 阅读顺序

| 文件 | 用途 |
| --- | --- |
| 01_CURRENT_STATE.md | 当前事实、验证范围和工作树 |
| 02_REQUIREMENTS.md | 校准后的完整长期需求；保留 33 个候选 Skills |
| 03_ARCHITECTURE.md | 真实模块、数据流、完整项目文件清单 |
| 04_TECH_STACK.md | 实际版本、约束、两套环境和开发命令 |
| 05_MCP_AND_SKILLS.md | 两个 Tools、协议差异、Provider 条件和未来边界 |
| 06_DATA_MEMORY_RAG.md | 业务数据所有权与未来知识/记忆/实验设计 |
| 07_TEST_EVIDENCE.md | 本轮命令、结果、日志、未运行项目和打包规则 |
| 08_GAPS_AND_RISKS.md | 阻塞、源码风险与后续验收 |
| 09_DECISIONS.md | 保留/落地/替代的决策 |
| 10_NEXT_AGENT_PROMPT.md | 无需聊天记录的恢复提示词 |
| 11_RECONCILIATION.md | 双向差异与核心结论证据矩阵 |
| 12_SOURCES.md | 官方 API 与本地证据索引 |
| CHANGELOG.md | 本次文档修订范围 |
| FULL_HANDOFF.md | 上述各专题按序拼接的完整版本 |
| evidence/ | 实测日志、工作树、锁版本、源文件哈希 |

## 状态词典

- `VERIFIED`：具体结论有源码及本轮测试/查询证据；只适用于注明的范围。
- `IMPLEMENTED_UNVERIFIED`：源码存在，相关运行环境未通过或未验证。
- `PLANNED`：保留的需求/设计，不是可用功能。
- `PARTIAL`：已实现子集，仍缺完整需求。
- `CONFLICT`：配置/代码/已确认设计之间存在矛盾。
- `OBSOLETE`：旧结论已被明确替代。
- `UNKNOWN`：证据不足，不能猜测。

所有 `path:line` 均相对上述仓库根（注明 host 的除外），对应本次工作树，不是 HEAD 中的行号。`evidence/` 日志没有真实发布凭证；外发前仍需考虑本地路径信息。

<!-- END 00_README.md -->


---

<!-- BEGIN 01_CURRENT_STATE.md -->

# 当前状态

## 结论

| 范围 | 状态 | 当前事实/边界 |
| --- | --- | --- |
| Extension/MCP 版本及本地构建 | VERIFIED | 0.0.1，单 uv workspace，包内容隔离 |
| V3 入口与 IMAGE 适配 | VERIFIED | 入口/Schema/委托单元测试；使用 V3 和 LoadImage 替身，不是实际 tensor 执行 |
| 真实宿主 V3、Status、完整 UI 工作流 | IMPLEMENTED_UNVERIFIED | ComfyUI 启动在插件加载前失败，不能验收 |
| Core/Bootstrap/HTTP Status | VERIFIED | 配置/路径/能力、真实 aiohttp TestServer 测试通过；宿主边界为替身 |
| Frontend | PARTIAL | 真 Chromium Canvas、Widget、上传序列化和独立样式通过；完整宿主保存/重开/IMAGE 未验证 |
| MCP | VERIFIED | 仅 version、connection_status；内存 Client、MockTransport、真实 stdio、独立安装通过 |
| FR-01 全面能力发现 | PARTIAL | 有基础状态，无版本握手、软件检测、前端在线/多用户身份协议 |
| Assets/Software/Processing/Knowledge/Memory/Experiments/Bridge | PLANNED | 没有业务实现、数据库或假 Tool |
| 产品 Skills | PLANNED | 零个；仅有工厂条件接入 Provider，33 个是候选 |
| 发布 | PARTIAL | 本地双包验证通过；公共 PyPI 0.0.1 返回 404，未执行任何真实发布 |

具体函数/行号、历史差异与行动逐项见 `11_RECONCILIATION.md`；测试命令见 `07_TEST_EVIDENCE.md`。

## 工作树与 Agent 基础

分支 main；HEAD 为 `06961eebe42674714dc2992b0a9de654b3a5a566`（提交时间 2026-11-16T18:04:37-06:00）。Git 状态见 `evidence/git-before.txt`：旧根 src/package/Vite 文件删除、monorepo 目录未跟踪、根 init/metadata/js 修改均早于本审计。用户 `doc/img.png` 删除也保留，不恢复或提交。

`.codegraph/` 存在且已实际调用 CodeGraph 探查；包含大体积数据库及 daemon 状态文件，索引还包括 reference。SQLite 索引是开发工具数据，**不是 AstroPhoto 业务数据库**。不因文件存在声称 daemon 永久健康或索引完整。

`.agents/skills/` 有 task-notes 和九个 comfyui-node-* 开发 Skill（advanced/basics/datatypes/frontend/inputs/lifecycle/migration/outputs/packaging）。它们不属于产品 MCP Skills，也不进入发行包。活动历史记录包括 architecture-migration、backend-standardization；本任务记录为 handoff-reconciliation，完成后归档。CodeGraph、notes、reference、.artifact 都是开发/历史资料。

## 实际最小运行面

一个节点 `vue-basic`；一个 Widget ID `CUSTOM_VUE_COMPONENT_BASIC`；一个 Extension 路由 `GET /astrophoto/v1/status`；两个 MCP Tools。没有天文工作流执行 Tool、数据库、外部软件进程管理器、第二个 Web Server 或内部 Agent Harness。

状态 API 的 `ok` 只说明路由与节点注册，不能证明画板在线、PNG 已上传或工作流执行成功。已有测试不会自动启动 ComfyUI；真实宿主测试只在指定 `COMFYUI_TEST_URL` 时运行。

<!-- END 01_CURRENT_STATE.md -->


---

<!-- BEGIN 02_REQUIREMENTS.md -->

# 完整长期需求与实现状态

本章为本轮逐项校准后的仓库需求快照，保留全部长期目标；不是对旧交接的未经审计复制。状态映射：[现有]只能在07注明的隔离范围内 VERIFIED，真实宿主为 IMPLEMENTED_UNVERIFIED；[目标]为PLANNED；FR-01为PARTIAL；[可选]为PLANNED且非强制。需求版本v0.2不等于软件0.0.1。

修订包括V1残留、最低Python、Provider选择、数据库路径、运行时握手与API版本字段，见11。八项FR与33个候选Skill均保留。六个历史验收故事仍作为后续验收：M31导入、Siril校准叠加、在线画布编辑、HOO个性化、可引用知识问答、开发task-notes恢复；只有最后一项开发记录机制已有实现。

---

# ComfyUI_AstroPhoto — 需求与技术架构基线

> 文档版本：**v0.2（需求/架构基线，不是软件发行版本）**  
> 整理日期：2026-11-16  
> 当前软件状态：**v0.0.1 工程基础层**（实现状态已按本地源码更新；真实宿主加载受已有 Torch 依赖问题阻塞，见开发文档）  
> 产品定位：**Local-first Astrophotography Workbench for ComfyUI**

## 0. 设计结论与状态约定

ComfyUI_AstroPhoto 将天文摄影资产管理、专业软件节点、知识库、个性化用户记忆和外部 AI Agent 控制整合到 ComfyUI 中，支持人类用户在前端操作，也支持 Agent 通过 FastMCP 发现能力、执行工作流和组织专用 Skills。

**总原则：ComfyUI 管图与执行；Extension 管天文业务及数据；FastMCP 管外部操作接口；Skills 管操作流程；Knowledge 提供专业依据；Memory 提供用户相关上下文；Agent Harness 管规划与 Subagent。**

本文使用三种状态标记：
- **[现有]**：仓库已有实现；单元/集成与真实宿主验证范围以开发文档为准。
- **[目标]**：需要开发的产品能力、目录和接口；不表示代码已经存在。
- **[可选]**：按需求和兼容性验证再增加，不作为首次安装的强制依赖。

### 必须遵守的架构决策

1. **ComfyUI Native Extension**：采用官方节点注册、前端扩展、PromptServer（aiohttp）、HTTP/WS、模型路径机制；不另起 FastAPI/Uvicorn Web 后端。
2. **Monorepo 双包**：根目录为 Comfy Registry Extension；`mcp/` 为独立 PyPI Python 包；代码一起开发，发行包分别构建。
3. **Lockstep SemVer**：Extension/MCP 使用同一个 `X.Y.Z`、同一 Git Tag；发布时先 PyPI 后 Registry，运行时校验版本。
4. **唯一事实所有者**：ComfyUI 拥有画布/工作流/执行；Extension 拥有 SQLite 业务库；MCP、Skills、Agent 不直接修改这些存储或绕过 API。
5. **最小本地基础设施**：SQLite 作为统一数据库技术，但按资产、知识和记忆划分 3 个数据库文件；默认不部署 Redis、PostgreSQL、向量数据库服务器。
6. **原始数据不可变默认**：原始 FITS/视频文件默认原址引用、只读检查；派生产物与实验结果独立保存。
7. **用户记忆独立于 Agent**：持久记忆属于 Extension，外部 Harness 更换不影响记忆；记录用户行为须明确授权，推断可核验和删除。
8. **Skills 随 MCP 包发布**：符合 Agent Skills 标准，优先通过 FastMCP Skills Provider 分发，兼容需显式本地安装的 Agent Host。

## 1. 产品目标、对象和非目标

### 1.1 面向的用户

- 使用 ComfyUI 的深空/行星天文摄影爱好者与专业用户。
- 使用 Siril、PixInsight 等成熟软件、希望可视化组合操作的人。
- 通过 Codex、Claude Code、OpenCode 或其他支持 MCP 的 Agent 执行天文图像处理任务的人。

### 1.2 目标体验

用户安装 Extension 后，能够在同一工作台中配置软件、登记设备/观测地、导入 Light 和校准场，获取可用节点与知识建议；既能手动编辑工作流，也能由 Agent 调用 Skills 和 MCP Tools 完成流程；对局部节点开展可追溯参数试验；系统逐步记住经过授权的设备与审美偏好。

### 1.3 明确非目标

- 不重新实现 ComfyUI 的画布、队列、Undo/Redo、工作流执行引擎。
- 不复制或重新实现完整的 Siril/PixInsight 算法，也不分发这些商业/第三方软件本体。
- 不在 FastMCP 内部署另一个业务数据库、Agent Runtime 或图像处理执行器。
- 不强制用户安装 LangGraph、云端 LLM、向量服务器或 GPU Embedding 模型。
- 不宣称能够在未取得用户授权时记录其全部操作、定位信息或自动修改其全局 Agent 配置。

## 2. 当前状态（v0.0.1）与迁移边界

**[现有，源码及隔离测试已核对]**：
- Python 扩展入口 `__init__.py`，使用 `comfy_entrypoint()` / `ComfyExtension`，保留 `WEB_DIRECTORY`。
- `vue-basic` 示例节点使用 V3 `io.Schema` / `execute()` / `io.NodeOutput`，通过 ComfyUI 的 `LoadImage` 产出 `IMAGE`。
- Vue 3 / TypeScript / PrimeVue / Vite 画板，具有 DrawingApp、ToolBar、Canvas 组件及中文/英文资源。
- 数据流：`Canvas 绘制 → PNG Data URL → /upload/image → Python LoadImage → IMAGE 输出`。
- Monorepo 基础结构，`mcp/` 可单独构建并运行；CLI、`version`、`connection_status`、HTTP 诊断已经实现；本轮独立 MCP 测试和安装/stdio 验证通过，具体范围见交接证据。
- 最小 `astrophoto/core`、Bootstrap 与原生 `GET /astrophoto/v1/status` 已实现，未实现能力明确 unavailable；无数据库或业务服务占位实现。
- 开发 Python 默认 3.12，最低发行 Python 3.11；前端独立挂载 Vue/PrimeVue，具备 vue-tsc 检查。具体测试与宿主阻塞见 `docs/development.md`。

**[目标但尚未实现]**：资产/设备/观测地持久化、校准匹配、专业软件 Adapter、节点目录、Canvas Bridge、Knowledge RAG、User Memory、参数实验、业务 MCP Tools 与生产 Skills。

**迁移不变量**：示例节点 ID、Widget 序列化、画板绘制、国际化、ComfyUI IMAGE 输出不得回归；已有工作流应能继续加载。已存在的 `uv workspace`、`frontend/`、`js/`、`locales/`、`reference/` 优先保留；不为符合目录图而无意义创建空包。

## 3. 六个核心业务域与系统能力

### 3.1 FR-01 系统状态与能力发现 [部分实现]

已实现 Extension/API 版本、实际节点/路由注册状态、配置的数据根路径和未实现能力说明。下列更广泛的数据库、软件、前端在线状态和版本协商仍为目标，不因基础状态 API 存在而视为完成。

- 返回 Extension、MCP、ComfyUI 及前端可识别版本；提供健康检查。
- 返回节点注册、数据库初始化、外部软件、RAG 索引、Memory 开关及 Canvas Bridge 在线状态。
- `capabilities` 返回机器可读的能力 ID、是否可用、不可用原因、所需版本/软件；不要凭 Skill 文件存在推断能力存在。
- 连接异常、依赖缺失、版本不匹配要明确区分，提供可执行的修复提示。

### 3.2 FR-02 Asset / Equipment / Observing Site [目标]

**设备**：Camera、Telescope、Reducer/Flattener、Mount、Filter、FilterWheel、Guide Camera 等；由 Optical Train 关联成可复用配置。

**拍摄资产**：
- 扫描用户选择的目录，按 Capture Session、目标对象、设备、滤镜及 Frame Type 建立索引。
- 基础格式：FITS、TIFF、PNG/JPEG；SER、视频及 XISF 通过具体适配器逐步支持，避免声称均已可无损解析。
- 读取 FITS Header，保留原始键值与标准化元数据；区分值为 `observed / inferred / user_confirmed`。
- 支持 `LIGHT / DARK / FLAT / BIAS / DARK_FLAT` 分类、重复文件检测、缺失文件检测、文件重新定位。
- 建立 Light 与 Master/单张校准场关联；匹配需参考曝光、温度、Gain/Offset、Binning、相机模式、滤镜、光学链路及主校准场适用性，不是一律按文件名匹配。
- 校准匹配返回候选、匹配理由、缺口及需要用户确认的冲突；禁止在证据不足时静默强匹配。
- 原始文件默认不改动，数据库保存路径、大小、指纹及元数据；大文件不嵌入 SQLite。

**观测地**：
- `ObservingSite` 保存用户主动设置的常用地点、时间区、可选经纬度。
- `LightPollutionEstimate` 保存来源、采样/数据集年份、辐亮度/天空亮度及估算不确定性；不可把 VIIRS 辐亮度、模型推算 SQM、Bortle 粗分类和实测值混为一谈。
- 获取精确位置或向外部光污染 API 发送坐标前必须用户同意；可只保存地点名称与粗粒度区域。

### 3.3 FR-03 外部软件注册与 Node 封装 [目标]

- `Software Registry` 负责软件 ID、候选路径、已确认路径、版本、验证结果与 Capability Catalog。
- 软件检测顺序：系统已知安装位置 / PATH 自动检测 → 前端人工选择或 Agent 提交候选路径 → Extension 验证 → 保存。
- 只有通过验证的命令/脚本接口才可执行；进程调用使用参数数组、限制工作目录、超时、可取消、日志隔离，拒绝任意 Shell 拼接命令。
- 首批 Adapter：Siril（`siril-cli` / 脚本）；PixInsight（按其脚本接口及授权限制独立实现），不共享未经验证的 CLI 假设。
- Node 类定义保持稳定 ID 和输入输出 Schema，ComfyUI 加载时注册。软件未安装时：已保存节点仍可被识别，但在自有节点浏览器中标记 `unavailable`，执行时提供明确错误；安装后更新能力状态，不依赖运行时增加全新 Python 类型。
- 通过 `node_search` / `node_describe` 提供节点能力和 Schema。**一个软件操作是一个 ComfyUI Node，不等于一个 MCP Tool。**
- 建立精度保留的数据类型：普通预览用 `IMAGE`，专业数据通过 `ASTRO_ASSET` / `ASTRO_FRAME` 等项目自定义类型（具体 Schema 需设计与测试）传路径/元数据引用；显式转换到 `IMAGE` 供可视化，转换可能丢失高位深/科学元数据，必须可知。

### 3.4 FR-04 Canvas / Workflow [目标]

- `/object_info` 查询注册节点 Schema，`/prompt` 负责执行，`/ws` 和 `/history/{prompt_id}` 负责跟踪状态与产物。
- Canvas Bridge 作为 Extension 前端的命令处理器：支持创建/删除节点、连接、设置 Widget、检查连线合法性、保存回执和撤销集成。
- MCP `canvas_apply` 经 Extension 后端的 Command Broker 将命令路由至在线前端，返回 `command_id`、目标画布/客户端、结果、错误和当前图版本；超时和断连要失败而不是假成功。
- 多浏览器/多标签存在时明确目标 Canvas Session 和版本冲突规则；不得由 MCP 在后端直接伪造当前浏览器画布修改。
- 工作流提交支持独立执行用的 API workflow；**执行工作流与修改当前画布是两件事**。前端不可用时可以执行已保存/明确提交的 workflow snapshot，但不能报告“已修改画布”。
- 保留 ComfyUI 自身保存、撤销及执行语义；扩展只做受控编排与事件回执。

### 3.5 FR-05 Knowledge RAG [目标]

- 收集 Siril、PixInsight 等官方文档及许可允许的教程；维护来源 URL、标题、章节、语言、发布日期/版本、授权状态。
- 使用 LangChain 实现采集/清洗/分块/索引/检索，`knowledge.db` 存文档、Chunks、FTS5 与可选向量索引。
- 首版用 FTS5 关键词检索；对英文命令、节点名、参数名优先精确检索；中文需测试 tokenizer，必要时增加专门分词策略。
- 可选使用 `sqlite-vec + FastEmbed/ONNX Runtime` 实现语义检索；Embedding 和 Reranker 模型由 ComfyUI 目录注册与加载管理，Reranker 暂非必需。
- 返回含 `source_id / url / section / software_version / excerpt / retrieval_score` 的来源列表；Agent 负责最终回答。没有可靠来源时不能伪造指南。
- 知识索引可从受许可的源文档重建；版权与抓取频率遵守来源约束。

### 3.6 FR-06 User Memory / Personalization [目标]

**定位**：Extension 内置的独立记忆系统，可被多个外部 Agent Harness 共同使用；不是 Chat History 存储，也不是开发用 task-notes。

**信息分层**：
1. **业务事实**：设备、观测地、光污染与资产在 `assets.db`，Memory 仅存引用和用户解释，不复制权威资料。
2. **行为历史 Event Log**：用户/Agent/系统的关键动作，记录来源、会话、对象、时间、是否成功；不保存无价值的每次鼠标移动或整段聊天。
3. **显式偏好**：用户确认的颜色风格、噪声容忍度、常用流程、参数区间和默认设备。
4. **推断偏好**：从重复采用的结果/反馈中提取，保留适用场景、置信度、证据，不因一次参数试验就当成用户偏好。
5. **经验记忆**：成功/失败处理任务、选用的最终参数、适用数据与评估结果；关联 Experiment/Run ID。
6. **Session 状态**：当前会话与短期任务信息，按需失效。

**处理管线**：`Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh/Expire → Forget`。

**来源采集**：Extension UI 的明确用户动作、可靠的 ComfyUI Hook、工作流执行回执、MCP 操作回执与 Experiments。由于 `nodeCreated` 在加载旧工作流时也触发，不可直接判定为用户新建操作。必须区分 actor=`human|agent|system`。

**用户控制**：
- 可见的开关与采集范围；行为历史默认应采取明确授权后采集的策略。
- 查看、编辑、确认、撤销推断、导出、删除指定记忆及全部记忆；活动事件建议默认短期保留（例如 30 天，可配置），长期偏好保留至更新或删除。
- 地理位置/设备序列号等敏感数据只按实际需要收集，严格本地存储、最小披露。
- 多用户 ComfyUI 必须做 profile 隔离；无法确认身份时禁止跨用户共享个性化记忆。
- 禁止不经用户明确授权将个人数据发送到第三方 API 或云端 Embedding 模型。

**召回**：`memory_context(task, asset_ids, ...)` 返回有限的场景相关记忆，含证据、来源类型与适用范围，而不是整段 Activity Log。规则归纳优先，LLM 自动归纳为可选增强，不要求额外 Agent 服务。

### 3.7 FR-07 Experiment / Subagent Optimization [目标]

- 保存 `experiment_id`、目标 Workflow/Node、输入 asset、固定参数与待优化参数、评价指标、预算/次数上限、停止条件。
- 每次 Trial 保存 `trial_id`、workflow snapshot/hash、参数、软件版本、运行环境、输出文件、耗时、指标、失败原因与人工反馈。
- Agent/Subagent 可循环执行 `node_describe → parameter proposal → workflow_run → result metrics → next proposal`。
- 自动评价与用户审美评价分离：SNR、FWHM、背景梯度等是技术指标，不必与用户“更喜欢”一致；允许手动优选。
- 外部 Harness 决定 Subagent 分工与搜索策略；MCP 不创建内部 Agent Runtime。
- 提供取消、恢复、重复、查看最佳 Trial 与写回工作流；避免无上限循环和覆盖原始文件。

### 3.8 FR-08 Agent Skills [目标]

**职责分工**：
- MCP Tool = 可调用的受控业务操作。
- Agent Skill = 任务方法、步骤、条件分支、验证与异常恢复。
- Knowledge = 专业技术依据。
- Memory = 用户个性化上下文。
- ComfyUI Workflow = 真正可执行的处理图。

**Skill 来源与分发**：
- 唯一用户 Skill 来源：`mcp/src/astrophoto_mcp/skills/<skill-name>/SKILL.md`，使用 `name`、`description` 等 Agent Skills 标准 frontmatter。
- 随 `astrophoto-mcp` Wheel 一起发布；当前工厂已为静态目录选择 FastMCP 4.2 的 `fastmcp.skills.provider.SkillsDirectoryProvider`，但尚无产品 Skill。`SkillCatalogProvider` 配合 `Skill.from_package()` / `Skill.from_directory()` 是显式管理 Skill 对象的可选方案，不要求改写现有工厂。
- Skills over MCP 的 Host 支持仍需按客户端验证；为不支持的 Agent 提供主动触发的本地安装或显式 MCP Resource 读取路径。
- 本地安装命令 `astrophoto-mcp skills list/install --agent ...` 为**未来拟实现的 CLI**，不是 FastMCP 自带命令；不未经授权改写用户全局 Agent Skills 目录。
- 开发者用 `.agents/skills/task-notes/` **不放入发布包**，与天文用户 Skills 分离。
- 每个 Skill 必须声明前置 capabilities；缺失 Tool 时标为不可运行，不执行空操作。
- Skills 不能直接执行任意 Shell/读写 SQLite/修改宿主状态；需要副作用时通过受控 MCP Tools。

**规划中的 33 个候选 Skills（全名均加 `astrophoto-` 前缀）**：

| 领域 | Skill 标识（省略公共前缀） | 数量 |
|---|---|---:|
| 系统与设备 | `check-environment`, `configure-software`, `setup-equipment`, `setup-site` | 4 |
| 资产管理 | `import-session`, `inspect-frames`, `organize-assets`, `match-calibration`, `build-masters`, `quality-review` | 6 |
| 工作流管理 | `plan-workflow`, `compose-workflow`, `run-workflow`, `debug-workflow`, `reproduce-workflow` | 5 |
| 天文图像处理 | `preprocess-osc`, `preprocess-mono`, `register-stack`, `background-extract`, `color-calibrate`, `narrowband-combine`, `stretch`, `denoise-sharpen`, `star-processing`, `mosaic`, `planetary`, `export` | 12 |
| 知识与记忆 | `knowledge-guide`, `personalize-processing`, `memory-review` | 3 |
| 自动调参 | `optimize-node`, `compare-trials`, `select-best-run` | 3 |
| **合计** | **候选目录，不是已实现功能** | **33** |

优先可执行 Skills：`astrophoto-import-session`、`astrophoto-match-calibration`、`astrophoto-plan-workflow`、`astrophoto-compose-workflow`；随后补 `register-stack`、`optimize-node`、`knowledge-guide`、`personalize-processing`。专业 Node 对应算法，Skill 对应跨步骤流程，不为每条 Siril 指令都建立 Skill。

## 4. 整体运行架构与所有权

以下是目标架构，业务 Service、数据库、Bridge 与绝大多数 Tools 尚未实现；当前实现清单见第 2 节。

```text
Human User                    External Agent / Subagents
    │                                    │
ComfyUI Frontend                        │
Vue AstroPhoto UI                   FastMCP (stdio)
    │                        ┌── Tools / Resources / Skills
    │                        │           │
    │                        └── HTTPX API Client
    │                                    │
    ├──────── ComfyUI HTTP / WebSocket ──┤
    │                                    │
    ▼                                    ▼
ComfyUI Runtime                  AstroPhoto API (PromptServer/aiohttp)
├── Node Registry               ├── Status & Capabilities
├── Canvas / Undo / Save        ├── Assets & Equipment & Site
├── Workflow / Queue            ├── Software Registry & Adapters
├── /object_info /prompt        ├── Node Catalog / Canvas Broker
├── /ws /history                ├── Knowledge Service
└── Model folder_paths          ├── Memory Service
                               └── Experiment Service
                                         │
                                 ~/.astrophoto/
                                 ├── databases/assets.db
                                 ├── databases/knowledge.db
                                 ├── databases/memory.db
                                 └── runs / cache / configs
```

**强制边界**：

| 资源/状态 | 唯一所有者 | 其他组件访问途径 |
|---|---|---|
| 当前画布、撤销、保存 | ComfyUI Frontend | 前端 Bridge 与回执 |
| 节点注册/执行队列/历史 | ComfyUI Runtime | 官方 API / 扩展节点 |
| 设备、Asset、Site、校准场 | Extension Asset Service | AstroPhoto HTTP API |
| 软件路径、操作可用性 | Extension Software Service | AstroPhoto API |
| 文档索引和 RAG | Extension Knowledge Service | AstroPhoto API |
| 用户历史/偏好/用户记忆 | Extension Memory Service | AstroPhoto API（受授权约束） |
| 参数实验与结果 | Extension Experiment Service | AstroPhoto API |
| Agent 规划、Subagent | 外部 Agent Harness | MCP Tools / Skills |

## 5. MCP 接口与三层渐进式披露

只有**一个 FastMCP Server**，按领域拆分 Tool 模块。L0/L1/L2 是推荐的使用顺序，不是三个 Server，也不是全局动态可见性开关。

| 层级 | 代表 Tool | 权限与职责 |
|---|---|---|
| L0 Bootstrap | `version`, `connection_status`, `capabilities` | 只读；状态、版本与前置条件 |
| L1 Discovery | `asset_search`, `equipment_list`, `software_list`, `software_detect`, `node_search`, `node_describe`, `knowledge_search`, `memory_context`, `memory_search` | 搜索与读取，按需限制范围 |
| L2 Assets | `asset_import`, `equipment_upsert`, `calibration_match` | 更改业务数据（确认/幂等） |
| L2 Software | `software_configure` | 提交候选路径，后端验证后保存 |
| L2 Canvas | `canvas_apply` | 编辑在线画布，返回明确回执 |
| L2 Runtime | `workflow_run`, `workflow_status`, `workflow_cancel` | 提交、追踪及取消 |
| L2 Experiment | `experiment_create`, `experiment_record_trial`, `experiment_list`, `experiment_finalize` | 管理 Trial 与结果 |
| L2 Memory | `memory_set`, `memory_feedback`, `memory_forget` | 明确授权的记忆写入/修改/删除 |

**公共契约**：命名稳定、Pydantic Schema、API 版本/能力协商、结构化错误码、`request_id`、`actor`、`source`、必要时 `idempotency_key`、输出回执；原始命令输出/冗长日志不直接灌入 Agent Context。

**画布编辑请求**建议包含目标 `canvas_session_id`、期望 `graph_revision`、命令集合与 `request_id`；不支持的客户端返回 `CANVAS_UNAVAILABLE` / `GRAPH_CONFLICT` 等明确错误。HTTP/MCP 暴露方式与 ComfyUI 现有安全配置一致；未经明确授权，不允许远端自由调用本地磁盘/可执行程序。

## 6. SQLite、目录、模型与数据生命期

### 6.1 本地数据目录 [目标]

```text
~/.astrophoto/                     # 默认；允许配置其他路径
├── config/
│   ├── settings.json
│   └── software.json
├── databases/
│   ├── assets.db
│   ├── knowledge.db
│   └── memory.db
├── knowledge/
│   └── sources/                  # 合规的本地源文档
├── cache/
│   ├── thumbnails/
│   └── previews/
├── runs/
│   └── <run-id>/                # 运行参数、产物引用、日志
└── logs/
```

多用户环境需按已认证用户或明确 profile 隔离数据根与数据库访问，不能仅信任客户端自报 profile ID。

### 6.2 数据库边界

| DB | 主要表/实体建议 | 生命周期 |
|---|---|---|
| `assets.db` | `equipment`, `optical_trains`, `observing_sites`, `light_pollution_snapshots`, `capture_sessions`, `assets`, `calibration_links`, `processing_runs`, `experiment_trials` | 用户核心事实，长期保留与迁移 |
| `knowledge.db` | `documents`, `sources`, `chunks`, `chunks_fts`, 可选 `chunks_vec`, `index_versions` | 原始来源保留，索引可重建 |
| `memory.db` | `profiles`, `sessions`, `activity_events`, `memories`, `memory_evidence`, `feedback`, `consents` | 可审阅、可导出、可定期清理 |

**一致性**：不同 DB 的实体通过 ID/Reference 关联；不假设跨 DB 原子事务。SQLite 使用合适的事务、约束、备份和可选 WAL（WAL 不可在跨主机共享网络文件系统使用）；数据库文件不放入发行包。SQLAlchemy 负责业务实体，Alembic 管迁移，索引由独立 rebuild 管理。

### 6.3 用户记忆示例结构

```json
{
  "category": "visual_preference",
  "key": "hoo_saturation",
  "value": "high",
  "scope": {"image_type": "HOO", "processing_stage": "color"},
  "origin": "user_feedback",
  "confidence": 0.95,
  "evidence_ids": ["feedback-..."],
  "updated_at": "2026-11-16T00:00:00Z",
  "expires_at": null
}
```

上述为 Schema 示例，并非真实用户记忆。实际数据需关联合法 `profile_id` 和权限。

### 6.4 模型管理

模型文件优先注册至 ComfyUI `folder_paths`：

```text
ComfyUI/models/
├── astrophoto_embedding/
└── astrophoto_reranker/
```

不要混入 ComfyUI 原有的文本反演 `models/embeddings`。ComfyUI 负责模型目录/路径，Extension 负责模型校验、选择与推理；多文件 Hugging Face 模型需有额外识别逻辑。无向量模型时知识检索仍可通过 FTS5 工作。

## 7. 最终技术栈（默认 / 可选）

| 层次 | 推荐选型 | 原则 |
|---|---|---|
| 宿主与节点 | ComfyUI V3 `io.ComfyNode` / `define_schema()` | 保留稳定 Node ID；适配官方 Node API 演进 |
| 前端 | Vue 3 + TypeScript + Vite | 使用 ComfyUI `registerExtension`/Settings/Sidebar；保留现有实现 |
| UI | ComfyUI 官方前端 API，PrimeVue 作为扩展自带依赖（如保留） | 不依赖宿主隐式注入 PrimeVue |
| 前端开发 | pnpm、Vitest、Vue Test Utils | 无需额外前端服务器常驻生产环境 |
| Extension HTTP | ComfyUI `PromptServer` + `aiohttp` | 不新增 FastAPI/Uvicorn |
| Python Schema | Pydantic 2 | API、MCP 工具输入输出契约 |
| 数据库 | SQLite + SQLAlchemy 2 + Alembic | 三个 DB 文件，统一业务所有权 |
| 天文数据 | Astropy + NumPy | FITS/科学元数据，不强制转 PNG |
| 专业软件 | `subprocess`（安全参数执行）+ Adapter | 软件外部安装，按版本能力验证 |
| MCP | FastMCP 4.2+、HTTPX、stdio | MCP 外部进程，Extension 不依赖其内部实现 |
| Agent Skills | Agent Skills `SKILL.md` + FastMCP `SkillsDirectoryProvider`（当前接线，无产品 Skill） | Wheel 同包发布、主机兼容降级 |
| RAG | LangChain loaders/splitters、SQLite FTS5 | 检索由 Extension 执行，回答由 Agent 执行 |
| 语义增强 [可选] | `sqlite-vec`、FastEmbed / ONNX Runtime | 先验证 Windows/ComfyUI 兼容，再启用 |
| 模型路径 | ComfyUI `folder_paths` | 复用已有目录及外部模型路径 |
| 开发/CI | uv、pnpm、pytest、Vitest、Playwright（E2E） | Host 安装与开发锁文件分离 |
| 发行 | GitHub Actions + PyPI + Comfy Registry | 同 Tag 双包发布，`.comfyignore` 隔离源码 |

版本采用**已验证范围**而非盲目追新：前端、ComfyUI Host、Python 与 FastMCP 的具体支持矩阵在 CI 中固定和测试。当前 Extension/MCP 均声明 Python `>=3.11`，默认开发 Python 3.12；旧 `>=3.10` 描述已被 FastMCP 4.2.0 的实际要求取代。

## 8. Monorepo 目标文件架构

```text
ComfyUI_AstroPhoto/
├── __init__.py                     # V3 comfy_entrypoint / ComfyExtension / WEB_DIRECTORY
├── pyproject.toml                  # 主版本 / Registry / uv workspace
├── requirements.txt               # 发行运行依赖（固定 MCP 版本）
├── uv.lock                         # 开发环境锁定
├── README.md
├── AGENTS.md
├── LICENSE
├── .comfyignore
├── .gitignore
│
├── nodes/                          # ComfyUI Python 节点及稳定注册
│   ├── __init__.py
│   └── ComfyUIFEExampleVueBasic.py # [现有] 示例，迁移期间保留
├── astrophoto/                     # [目标] Extension 业务后端
│   ├── api/                        # aiohttp routes / API schemas
│   ├── assets/                     # 设备、会话、资产、校准、观测地
│   ├── software/                   # 软件 Registry + Siril/PixInsight Adapters
│   ├── nodes/                      # Capability Catalog / Node search（非 Comfy 注册入口）
│   ├── canvas/                     # 命令 Broker/Receipt
│   ├── knowledge/                  # 文档处理/检索
│   ├── memory/                     # 事件、长期记忆、召回、隐私控制
│   └── experiments/                # Runs / Trials / Metrics
│
├── frontend/
│   ├── src/
│   │   ├── main.ts                 # [现有] 扩展与 Widget 入口
│   │   ├── components/             # [现有] DrawingApp 等
│   │   ├── assets/                 # [目标] 天文资产管理 UI
│   │   ├── software/               # [目标] 软件路径/能力管理 UI
│   │   ├── knowledge/              # [目标] 文档检索 UI
│   │   ├── memory/                 # [目标] 偏好/记忆/隐私 UI
│   │   ├── experiments/            # [目标] Trial 结果对比 UI
│   │   └── bridge/                 # [目标] Canvas 命令执行与回执
│   ├── tests/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.mts
├── js/                             # 构建后前端资源，随 Registry 发布
├── locales/                        # 多语言资源，随 Registry 发布
│
├── mcp/                            # 单独 PyPI 包（Registry 归档排除）
│   ├── pyproject.toml
│   ├── README.md
│   ├── LICENSE
│   ├── src/astrophoto_mcp/
│   │   ├── __init__.py
│   │   ├── __main__.py              # CLI + stdio
│   │   ├── server.py                # FastMCP Server + Skill Provider
│   │   ├── client.py                # HTTPX 基础客户端
│   │   ├── config.py
│   │   ├── api/                    # ComfyUI API / Extension API
│   │   ├── tools/
│   │   │   ├── status.py
│   │   │   ├── assets.py
│   │   │   ├── software.py
│   │   │   ├── nodes.py
│   │   │   ├── canvas.py
│   │   │   ├── workflows.py
│   │   │   ├── experiments.py
│   │   │   ├── knowledge.py
│   │   │   └── memory.py
│   │   ├── schemas/                # 复用的 Pydantic 工具模型
│   │   └── skills/                 # 用户 Skill，随 MCP Wheel 发行
│   │       ├── astrophoto-import-session/SKILL.md
│   │       ├── astrophoto-match-calibration/SKILL.md
│   │       ├── astrophoto-plan-workflow/SKILL.md
│   │       ├── astrophoto-compose-workflow/SKILL.md
│   │       └── ...                 # 仅在对应工具可用时落地
│   └── tests/
│       ├── test_server.py
│       ├── test_client.py
│       ├── test_stdio.py
│       └── skills/
│
├── tests/                          # Extension + 跨组件集成/发行
│   ├── nodes/
│   ├── backend/
│   ├── integration/
│   └── packaging/
├── scripts/
│   ├── release.py
│   └── check_install.py
├── docs/
│   ├── requirements.md            # 本文作为基线
│   ├── architecture.md
│   ├── development.md
│   ├── mcp.md
│   ├── memory.md
│   ├── skills.md
│   └── publishing.md
├── .github/workflows/
│   ├── ci.yml
│   └── release.yml
├── .agents/skills/task-notes/SKILL.md   # 仅开发 Agent，非用户 Skill
├── .agent/notes/
├── .agent/archive/
├── reference/                     # 参考项目，运行和发行排除
└── dist/                          # 本地构建产物，发行排除
```

**重要**：这是模块归属图；未开发功能无需预先创建空目录。发布 Extension 时通过 `.comfyignore` 排除 `mcp/`、`reference/`、测试、开发缓存与 `frontend/` 源码；确保 `js/`、`locales/` 被打包。MCP Wheel 必须包含自身 Skills 文件与 references，不能包含 Extension 源码。

## 9. 安装、依赖、升级与分发

### 9.1 用户安装路径

1. 用户通过 ComfyUI-Manager / Comfy Registry 安装 Extension。
2. Extension 在正式发布时固定依赖对应 `astrophoto-mcp==X.Y.Z`；通过 ComfyUI 的 Python 环境正常安装该依赖。
3. 外部 Agent 显式使用 ComfyUI 的 Python 解释器执行 `python -m astrophoto_mcp` 或 CLI，默认 stdio；MCP 连接该 ComfyUI 的 HTTP/WS。
4. 根据 Agent Host 支持程度，通过 MCP Skills Extension 远程发现 Skills，或由用户确认后本地安装 Skill 文件。
5. 用户独立 `uvx`、虚拟环境或远端运行的 MCP **不会**被 Manager 保证同步更新；每次连接执行版本校验并明确提示属于 **PLANNED**；当前两个诊断 Tool 尚未比较远端 Extension 版本。

### 9.2 版本发布

- 仓库根目录 `pyproject.toml` 是唯一版本来源（当前 `0.0.1`）；同步 `mcp/pyproject.toml` 与 Extension 的依赖约束。
- CI 验证 `root version == mcp version == dependency pin == tag`。
- 同一 Git Tag `vX.Y.Z`：Build/Tests → MCP Wheel/Test → PyPI Publish → 检测发行可安装 → Comfy Registry Publish → Release Notes。
- PyPI 不允许覆盖既有版本；如果 Registry 阶段失败，恢复执行未完成步骤，而不是覆盖旧包。
- `.comfyignore` 不适用于直接 `git clone` 安装路径；传统 Git 安装场景需要单独验证。
- **脚手架阶段**尚未在 PyPI 发布 MCP 版本时，不得提前加入会导致安装失败的强制依赖；发布 Pipeline 执行顺序保证依赖先存在。
- `uv workspace / uv.lock` 用于开发/CI 一致性，不等于 ComfyUI-Manager 会运行 `uv sync`；用户安装依赖由正式发行元数据与 Manager 机制负责。

### 9.3 兼容性

- Extension 与 MCP 的发行版本要求完全一致（Lockstep）；运行时协商仍为 **PLANNED**。当前 HTTP 状态字段是 `api_version: "v1"`，不是 `api_schema_version`；后者是历史候选名，未来协商应沿用或显式演进当前契约。
- ComfyUI 本体、Frontend、Python、Siril/PixInsight、Embedding 模型保持自己的版本与兼容矩阵，不纳入同步版本号。
- 对于不支持的 Host API、缺失软件与无前端 Canvas，错误应该可诊断，而非静默降级或损坏数据。

## 10. 安全、隐私与可靠性

- **访问控制**：默认面向本地可信部署；如 HTTP 对局域网开放，须验证认证/授权、CSRF/Origin 风险和用户隔离，不能默认把本地文件管理 API 暴露给所有连接者。
- **文件系统**：用户授权的扫描目录与产物路径分开；路径规范化、防目录穿越、禁止通过 MCP 任意读写用户硬盘。导入为只读，删除和移动操作须显式确认。
- **可执行软件**：只允许已验证的程序路径和已定义命令模板；参数白名单、超时、取消、输出隔离，避免命令注入。
- **记忆隐私**：有开关、透明采集、可审核证据链、可清理；不得把长期偏好、位置与设备信息自动注入全部 Skill 或发送到外部服务。
- **Skills 安全**：MCP 分发的 Skill 内容需要 Host 信任/同意机制；Skill 文档本身不等于执行授权。可执行脚本更应转为受控 Tool。
- **运行可靠性**：结构化 `run_id` / `request_id` / `trial_id`、幂等、取消、失败重试上限、可重放的 Workflow Snapshot；产物由 ComfyUI 执行路径生成且可追溯。
- **数据维护**：数据库迁移、备份与恢复测试；知识索引重建与业务数据备份分开；事件清理不误删设备/Asset 事实。

## 11. 测试策略与验收

### 11.1 分域测试

| 位置 | 覆盖 |
|---|---|
| `tests/nodes/` | ComfyUI Node 注册、IMAGE/ASTRO 类型转换、数据完整性 |
| `frontend/tests/` | Widget 注册、画板序列化、设置面板、Bridge 回执、隐私开关 |
| `mcp/tests/` | Tool Schema、stdio initialize/list/call、HTTP MockTransport、Skills 资源和 CLI |
| `tests/backend/` | 设备/资产/校准匹配、软件路径验证、RAG/Memory 逻辑、Trial 记录 |
| `tests/integration/` | 真 ComfyUI 环境下执行 Workflow、Canvas 在线命令、Siril Adapter |
| `tests/packaging/` | 版本一致性、MCP Wheel Skills 完整性、Registry 文件清单、双包隔离 |

### 11.2 核心验收场景

- **兼容**：原有 `vue-basic` 节点和 Canvas PNG → `/upload/image` → `IMAGE` 路径不回归。
- **入库**：指定拍摄目录导入后正确区分 Light/校准帧，重复导入幂等，不修改原始文件。
- **匹配**：给出可解释的校准场建议；没有足够数据时返回待确认。
- **软件**：Siril 未安装时节点可识别但不可运行；路径验证成功后显示可用；失败可诊断。
- **画布**：前端在线时 MCP 命令返回真实回执；离线时不谎报修改成功；运行 API 可独立提交已保存 workflow。
- **知识**：返回至少一个可验证官方来源及章节；索引可重建；无 Embedding 模型仍能 FTS 检索。
- **记忆**：未经授权不采集行为；明确反馈能形成可编辑偏好；用户删除记忆后检索不可恢复该数据。
- **实验**：固定输入和版本可重放 Trial；预算/取消生效，最佳结果与原始指标保留。
- **Skills**：发行 Wheel 含完整 SKILL.md；能力缺失 Skill 不误执行；支持的 Host 能读取，旧 Host 有明确备用安装方式。
- **发布**：`mcp/` 不进 Comfy Registry 归档；Extension 源码不进 MCP Wheel；依赖先上 PyPI 后发布 Extension。

## 12. 实现优先顺序（不是硬性的发布日程）

1. **P0 工程基础**：保证脚手架不回归；完善 ComfyUI aiohttp 业务 API、三方所有权、版本校验、MCP 状态/能力、双包发行检查、测试。
2. **P1 资产与软件基础**：`assets.db`、设备/观测地/校准关联、Siril 软件发现/验证、节点能力目录、资源型数据接口。
3. **P2 自动化处理**：Canvas Bridge、Workflow/Experiment 工具、Siril 核心 Node，首批导入/校准/工作流 Skills。
4. **P3 知识与个性化**：FTS5 知识库、记忆的显式设置与事件证据、Agent 场景召回，再增加可选向量检索及偏好推断。
5. **P4 生态扩展**：PixInsight Adapter、更多专业节点、天文子领域 Skills、长期调参与跨 Host Skill 安装兼容性。

上述顺序依赖真实能力：**先有 Tool，再发布可执行 Skill；先有可解释的反馈，再自动推断用户偏好；先有稳定 Software Adapter，再扩充大量 Nodes。**

## 13. 文档与开发 Agent 规范

- `AGENTS.md`：概述、架构边界、导航、常用命令或命令索引、`$task-notes` 触发规则。避免任务日志和成篇实现说明。
- `docs/requirements.md`：本基线，规划与验收依据。
- `docs/architecture.md`：现实模块地图、入口、依赖、状态所有权、数据流。
- `docs/development.md`：真实环境、uv/pnpm、构建和测试命令。
- `docs/mcp.md`：Tool/Resource/Skill 接口及版本契约。
- `docs/memory.md`：行为采集、生命周期、隐私、保留策略。
- `docs/skills.md`：Skills 索引、依赖能力、分发与更新。
- `docs/publishing.md`：Registry/PyPI 发行与包清单。
- `.agents/skills/task-notes/SKILL.md`：长周期开发记录 Create → Update → Verify → Compact → Handoff → Promote/Archive/Prune；与用户记忆系统严格隔离。

## 14. 待进一步验证的工程问题

这些是需要通过原型或 CI 解决的**未决细节**，不是已实现承诺：

1. 当前 `uv workspace` 在不同 ComfyUI Python 版本和 Manager 安装路径中的依赖解析及冲突情况。
2. ComfyUI 前端版本差异对 Canvas Bridge/Sidebar/Widget 的影响，特别是 Nodes 2.0。
3. PixInsight 的可自动调用脚本接口、许可与跨平台执行边界。
4. 每类科学数据自定义 ComfyUI 类型的传递、缓存、序列化和保存策略。
5. 观测地光污染数据源、使用许可、缓存周期与模型不确定性展示。
6. sqlite-vec 在 Windows/ComfyUI Python 环境中的二进制扩展加载与分发测试。
7. Codex、Claude Code、OpenCode 对 MCP Skills Extension 的实际支持与可靠的本地降级方案。
8. 不同 ComfyUI 安装方式中的认证能力、用户隔离和持久化目录选择。

## 15. 官方/一手技术资料

- ComfyUI Custom Nodes: https://docs.comfy.org/custom-nodes/walkthrough
- ComfyUI HTTP/WS + Custom Routes: https://docs.comfy.org/development/comfyui-server/comms_routes
- ComfyUI Frontend Hooks: https://docs.comfy.org/custom-nodes/js/javascript_hooks
- ComfyUI Settings API: https://docs.comfy.org/custom-nodes/js/javascript_settings
- Comfy Registry Publishing: https://docs.comfy.org/registry/publishing
- Comfy Registry pyproject specification: https://docs.comfy.org/registry/specifications
- ComfyUI Model Path implementation: https://github.com/Comfy-Org/ComfyUI/blob/master/folder_paths.py
- FastMCP Skills Provider: https://gofastmcp.com/docs/servers/skills
- FastMCP Providers: https://gofastmcp.com/docs/servers/providers/overview
- MCP Skills Extension: https://skills.extensions.modelcontextprotocol.io/
- Agent Skills Specification: https://agentskills.io/specification
- LangChain Retrieval: https://docs.langchain.com/oss/python/langchain/knowledge-base
- LangGraph Memory (conceptual reference, not dependency): https://docs.langchain.com/oss/python/langgraph/add-memory
- SQLite FTS5: https://www.sqlite.org/fts5.html
- SQLite WAL: https://www.sqlite.org/wal.html
- Astropy FITS: https://docs.astropy.org/en/stable/io/fits/
- Siril Tutorials: https://siril.org/tutorials/
- Siril Scripts: https://siril.readthedocs.io/zh-cn/stable/scripts/Script-files.html

---

**一句话架构基线**：以 ComfyUI 为唯一工作流宿主，以 Extension 统一持有资产/知识/记忆/实验业务，以 FastMCP 对外暴露受控能力，以 Agent Skills 封装可靠工作流程，以外部 Agent Harness 负责推理、计划和 Subagent 调参；所有功能默认本地运行、优先复用 ComfyUI 现有机制。

## 16. 仓库校准索引

2026-11-16 的源码、环境与重新执行测试证据见 [Repository-Verified Handoff](00_README.md)。本需求基线保留长期目标；FR-01 为 PARTIAL，其余天文业务与产品 Skills 为 PLANNED。发行版本一致不表示已有运行时版本拒绝机制。

<!-- END 02_REQUIREMENTS.md -->


---

<!-- BEGIN 03_ARCHITECTURE.md -->

# 实际架构与物理文件地图

证据：根入口:11/23，节点类:6，bootstrap:16，routes:11，status:9；完整差异见11。下文是审计后的实际架构快照。当前Node只委托宿主LoadImage，没有天文Domain Service；长期分层规则不能被误读为所有层已经存在。

# 架构

当前采用 **Domain-first Modular Monolith + ComfyUI Native Extension + V3 Node API**。
软件版本为 0.0.1；Extension 通过 Registry ZIP 分发，MCP 独立通过 PyPI wheel 分发。
根 pyproject.toml 为唯一版本来源，uv workspace 共用一个 uv.lock。

## 已实现模块

| 模块 | 当前职责 |
| --- | --- |
| 根 __init__.py | comfy_entrypoint()、ComfyExtension、WEB_DIRECTORY；on_load 组装后端并注册路由 |
| nodes/ | 一个 V3 io.ComfyNode；Schema、输入校验、LoadImage 适配、NodeOutput |
| astrophoto/bootstrap.py | 创建轻量 Runtime，注入配置及实际节点注册查询 |
| astrophoto/core/ | AppConfig、ASTROPHOTO_HOME、配置错误、真实 capability 状态 |
| astrophoto/api/ | 原生 aiohttp 路由与可独立测试的状态 Handler |
| frontend/src/ | Vue UI、原生 DOM Widget 适配、独立 PrimeVue/i18n 初始化 |
| js/ | 构建后的 JS/CSS，不存业务源码 |
| locales/ | 中英文 main.json；已打入独立 Vue App 并包含于 Registry，宿主发现/显示仍待真实运行验证 |
| mcp/src/astrophoto_mcp/ | FastMCP 4.2 单 Server、Status Tools、公共 HTTP Adapter |
| tests/ | Extension 单元测试、HTTP 集成、宿主显式验证、发行检查 |
| reference/ | 参考项目；不修改、不导入、不打包 |

## V3 注册与现有数据流

此前标准化任务将实际 V1 源码迁为 V3；当前未同时导出 V1 映射，避免宿主优先走旧入口。本次交接审计只复核，未再次迁移。
本机 ComfyUI 0.45.0 的加载器依次调用 comfy_entrypoint → on_load → get_node_list → GET_SCHEMA。
因此状态 API 在每次请求时查询真实 NODE_CLASS_MAPPINGS，不能在 on_load 时就声称节点注册完成。

```text
ComfyUI → comfy_entrypoint → AstroPhotoExtension
  ├── on_load → bootstrap → register_routes(PromptServer.instance.routes)
  └── get_node_list → ComfyUIFEExampleVueBasic.define_schema

Canvas → PNG Data URL → state-save → widget.serializeValue
  → api.fetchApi('/upload/image', type=temp, subfolder=threed)
  → {image: 'threed/<name> [temp]'}
  → V3 execute → folder_paths.get_annotated_filepath → 宿主 LoadImage
  → io.NodeOutput(IMAGE)
```

保留 node_id `vue-basic`、自定义类型 `CUSTOM_VUE_COMPONENT_BASIC`、输入名
`custom_vue_component_basic`、输出名 `image`、category `examples`。
V3 使用 `io.Custom(...).Input(...)`，未增加 forceInput 或改变保存工作流的值结构。
无实际缓存需求，因此不添加 fingerprint_inputs。后续节点只做适配；领域业务委托 Service。

## 后端状态与数据目录

`GET /astrophoto/v1/status` 返回 Extension 标识/版本、API v1、ok/degraded、实际路由与节点
注册状态、配置的数据根路径、capabilities。状态不声称前端在线或 IMAGE 已执行成功。
status_api 与 drawing_node 由注册状态决定；storage/assets/software/processing/knowledge/
memory/experiments/canvas_bridge 为 unavailable，reason 为 not_implemented。

默认数据根为 ~/.astrophoto/；ASTROPHOTO_HOME 可覆盖为绝对路径。空值、相对路径、空字节
被拒绝。导入或读取配置不会 mkdir、创建数据库、扫描文件、下载依赖、加载模型或运行软件。
bootstrap 只读取发布包内的项目 metadata 并组装 Runtime。路由按实际 RouteTableDef 检查重复，
同一服务反复 on_load 不会重复添加；不同服务各自注册；非本扩展占用同路径时明确报错。

## 前端边界

Frontend 1.59.1 已移除宿主 PrimeVue 插件和主题。扩展改为 native node.addDOMWidget，
自行 createApp + PrimeVue 4.3.3/Aura + vue-i18n，并在 widget.onRemove 卸载，同时保留宿主清理。
Vue 3.5.13、PrimeVue、国际化和主题均打入单个 main.js；不会把另一份 Vue 组件交给宿主 Vue 渲染。
主题使用 astrophoto 前缀，避免依赖宿主 --p-* 变量。Widget ID、序列化 JSON、画笔交互保持兼容。

源码以 comfy:app / comfy:api 引用宿主；Vite output.paths 明确映射到产物的
../../scripts/app.js 与 ../../scripts/api.js，不受源码目录层级影响，保留反向代理路径前缀。
这些是 ComfyUI API；未修改宿主源码。TypeScript/vue-tsc 是独立检查步骤，不由 Vite build 代替。

## 未来业务归属（均未创建）

| 域 | 未来职责和技术 |
| --- | --- |
| storage/ | SQLite、SQLAlchemy 2 Engine/Session、Alembic；真实数据库在 ~/.astrophoto/databases/ |
| assets/ | 设备、资产、校准关系、FITS 元数据 |
| software/ | Software Registry、受控 Runner、Siril/PixInsight Adapter |
| processing/ | Astropy/NumPy、科学数据与显式 IMAGE 转换，保留 FITS 精度与元数据 |
| knowledge/ | LangChain、SQLite FTS5、按需 sqlite-vec |
| memory/ | 用户授权下的行为、偏好、反馈与记忆生命周期 |
| experiments/ | 参数 Trial、指标、执行与复现记录 |
| canvas/ | 原生前端命令与真实执行回执，不把提交 prompt 等同于修改画布 |

依赖方向：Node / HTTP API → Domain Service → Repository / Adapter → Storage / External Software。
领域 Service 不导入 nodes、frontend、mcp。根据实际复杂度创建 models/schemas/service/repository，
不套用统一空模板。Session 由请求/操作管理，不跨并发任务共享；长运行软件不持有写事务。
模型路径由 ComfyUI folder_paths 管理。外部软件只能通过受控 Adapter，禁止任意 Agent Shell。

## MCP 边界

FastMCP 4.2 的 create_server 是唯一工厂，tools/status 注册两个既有工具；client/api
只访问公共 ComfyUI HTTP API。现有 connection_status 契约不变，本次不强制增加新的 HTTP
请求或 Tool；新状态接口可由 Frontend/外部 HTTP 客户端使用，未来再按需求扩展 MCP。
MCP 不读取 Extension 配置/数据库，不构成第二套业务后端。业务 Skills 尚未实现。

## 验证边界

独立测试使用 V3 API test doubles 和真实 aiohttp TestServer，不能证明实际 ComfyUI 加载。
本机 Python 3.12.4 / ComfyUI 0.45.0 在导入 comfy_api.latest 或启动 main.py 时均因
Torch 2.3.0 缺少 torch.library.custom_op 失败。完整 V3 加载、状态接口和宿主 UI 验证未完成。
已提供显式宿主 HTTP 测试入口；具体命令与测试证据见 development.md。

依据：[V3 API](https://docs.comfy.org/custom-nodes/v3_migration)、
[原生路由](https://docs.comfy.org/development/comfyui-server/comms_routes)、
[Frontend 1.59.1 PrimeVue 迁移](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md)、
[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、
[Cosmic Python](https://www.cosmicpython.com/)。以目标安装版本源码及运行验证为准。

## 仓库审计补充（2026-11-16）

当前 Node 直接委托宿主 LoadImage，没有天文 Domain Service。配置使用标准库 dataclass/tomllib，而非历史示例中的 Pydantic 配置系统。状态能力为 `{available, reason}`，无软件探测或实例身份协议。完整快照与双向差异见 [审计交接](00_README.md)。

## 当前项目源码/配置树

来自Git tracked与未忽略新文件的实际存在性检查。这里展开全部94个审计前项目文件，不展开reference、历史交接、依赖、缓存、Git内部文件；新交接目录索引见00，忽略的Agent记录单列。不是目标目录图。

```text
ComfyUI_AstroPhoto/
├── .agents/
│   └── skills/
│       ├── comfyui-node-advanced/
│       │   └── SKILL.md
│       ├── comfyui-node-basics/
│       │   └── SKILL.md
│       ├── comfyui-node-datatypes/
│       │   └── SKILL.md
│       ├── comfyui-node-frontend/
│       │   ├── SKILL.md
│       │   └── api-reference.md
│       ├── comfyui-node-inputs/
│       │   └── SKILL.md
│       ├── comfyui-node-lifecycle/
│       │   └── SKILL.md
│       ├── comfyui-node-migration/
│       │   └── SKILL.md
│       ├── comfyui-node-outputs/
│       │   └── SKILL.md
│       ├── comfyui-node-packaging/
│       │   └── SKILL.md
│       └── task-notes/
│           └── SKILL.md
├── .comfyignore
├── .editorconfig
├── .gitattributes
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── .gitignore
├── .pre-commit-config.yaml
├── .python-version
├── AGENTS.md
├── LICENSE
├── README.md
├── __init__.py
├── astrophoto/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── status.py
│   ├── bootstrap.py
│   └── core/
│       ├── __init__.py
│       ├── capabilities.py
│       ├── config.py
│       ├── errors.py
│       └── paths.py
├── docs/
│   ├── architecture.md
│   ├── development.md
│   ├── mcp.md
│   ├── publishing.md
│   └── requirements.md
├── frontend/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── src/
│   │   ├── components/
│   │   │   ├── DrawingApp.vue
│   │   │   ├── DrawingBoard.vue
│   │   │   ├── ToolBar.vue
│   │   │   └── VueExampleComponent.vue
│   │   ├── host.d.ts
│   │   ├── main.ts
│   │   └── types.ts
│   ├── tests/
│   │   ├── components/
│   │   │   └── DrawingApp.test.ts
│   │   ├── host.ts
│   │   ├── setup.ts
│   │   └── widgets/
│   │       ├── registration.test.ts
│   │       └── serialization.test.ts
│   ├── tsconfig.json
│   ├── vite.config.mts
│   └── vitest.config.mts
├── js/
│   ├── assets/
│   │   └── main.css
│   └── main.js
├── locales/
│   ├── en/
│   │   └── main.json
│   └── zh/
│       └── main.json
├── mcp/
│   ├── LICENSE
│   ├── README.md
│   ├── pyproject.toml
│   ├── src/
│   │   └── astrophoto_mcp/
│   │       ├── __init__.py
│   │       ├── __main__.py
│   │       ├── api/
│   │       │   ├── __init__.py
│   │       │   └── comfy.py
│   │       ├── client.py
│   │       ├── config.py
│   │       ├── server.py
│   │       └── tools/
│   │           ├── __init__.py
│   │           └── status.py
│   └── tests/
│       ├── conftest.py
│       ├── fixtures/
│       │   └── status_contract.json
│       ├── test_client.py
│       ├── test_config.py
│       ├── test_server.py
│       └── test_version.py
├── nodes/
│   ├── ComfyUIFEExampleVueBasic.py
│   └── __init__.py
├── pyproject.toml
├── requirements.txt
├── scripts/
│   ├── check_install.py
│   └── release.py
├── tests/
│   ├── backend/
│   │   ├── test_core.py
│   │   └── test_status.py
│   ├── conftest.py
│   ├── integration/
│   │   ├── test_host_runtime.py
│   │   └── test_status_api.py
│   ├── nodes/
│   │   ├── test_image_io.py
│   │   └── test_registration.py
│   └── packaging/
│       ├── test_contents.py
│       └── test_versions.py
└── uv.lock
```

另实际存在：`.agent/notes/`（architecture-migration、backend-standardization以及本轮任务，后者完成后归档）、`.codegraph/`、`.artifact/ComfyUI_AstroPhoto_Handoff_2026-11-16/`、`reference/`、`.venv/`、`.venv-backup-3.13/`、`frontend/node_modules/`、`dist/`。这些不是运行模块。当前无 astrophoto/assets、software、processing、knowledge、memory、experiments、canvas、storage 业务目录，MCP无产品skills目录。

## Status具体契约

GET /astrophoto/v1/status → status_handler → status_payload。extension={id,version}、api_version='v1'、status=ok/degraded、runtime={node_registered,routes_registered}、data_home字符串、capabilities各项={available,reason}。能力ID共有10个：status_api、drawing_node及8个未来域；没有 enabled/status/version 子字段的完整未来Capability模型。pure payload示例见evidence/status-example.json（故意未注册，degraded，非宿主HTTP回包）。

<!-- END 03_ARCHITECTURE.md -->


---

<!-- BEGIN 04_TECH_STACK.md -->

# 技术栈与环境

本轮实际查询版本；Python运行环境与声明范围分列。完整查询和API签名见evidence/dev-versions-api.txt、host-versions.txt、frontend-versions.txt、lock-versions.json。锁文件不是宿主锁。

| 组件 | 本轮实际版本/约束 | 来源/状态 |
| --- | --- | --- |
| Extension / MCP | 0.0.1 / 0.0.1 | 两份pyproject、版本测试、wheel metadata VERIFIED |
| 开发Python | 3.12.15；默认3.12 | .venv、.python-version VERIFIED |
| 最低支持/本地补测 | >=3.11；3.11.18测试通过 | 两份pyproject、py311日志 VERIFIED |
| 宿主Python | 3.12.4 Anaconda | 指定宿主解释器查询 VERIFIED |
| ComfyUI Backend / Frontend | 0.45.0 / 1.59.1 | host comfyui_version.py与安装metadata VERIFIED版本；运行被阻塞 |
| Torch / NumPy / Pillow | 2.3.0 / 1.26.4 / 10.3.0 | host安装metadata VERIFIED；不表示整体依赖健康 |
| aiohttp | dev/host均3.14.5 | dev约束>=3.9,<4；host提供运行时 |
| FastMCP | 4.2.0固定 | 独立fastmcp包，Requires-Python>=3.11 |
| MCP SDK / HTTPX / Pydantic | 2.3.0 / 0.28.1 / 2.14.3 | 锁与安装一致；HTTPX约束>=0.28,<1 |
| pytest / Ruff / comfy-cli | 8.4.2 / 0.17.5 / 1.26.0 | uv.lock与实际查询 |
| uv / pnpm / Node | 0.13.8 / 11.13.1 / 26.8.2 | 本机命令；CI Node22、Python3.11/3.12为配置 |
| Vue / PrimeVue / Aura | 3.5.13 / 4.3.3 / 4.3.3 | pnpm安装及lock；扩展自带 |
| vue-i18n | 9.14.4 | 自带运行时；中文tooltip缺键 |
| Vite / plugin-vue / vue-devtools | 6.3.5 / 5.2.3 / 7.7.2 | 安装及pnpm-lock，package中部分为范围 |
| TypeScript / vue-tsc / ComfyUI类型包 | 5.9.3 / 3.3.14 / 1.59.1 | 已配置独立类型检查 |
| Vitest / browser-playwright | 4.0.18 / 4.0.18 | Chromium实际运行 |
| Vue Test Utils / Playwright | 2.6.0 / 1.65.1 | 实际安装 |
| Hatchling | >=1.27,<2；本轮精确build版本UNKNOWN | 独立build-system，不在uv.lock；历史1.33.0不可直接沿用 |
| pre-commit Ruff | v0.4.9 | 仅配置；与上述0.17.5 CONFLICT，未执行自动fix |

SQLAlchemy、Alembic、Astropy、LangChain、sqlite-vec、FastEmbed是PLANNED，不能把历史选型表当已安装项目依赖。FastMCP间接安装Starlette1.10.0/Uvicorn0.54.0，不代表本项目启用HTTP服务。根LICENSE是GPLv3全文，MCP metadata声明GPL-3.0-only且LICENSE字节一致；根metadata写GNU General Public License v3，未在本轮变更许可。

原3.13环境仍保存在.venv-backup-3.13；不从该目录直接执行含旧绝对路径的console scripts。开发/宿主共用源码而不共用Python环境；本轮未uv sync宿主或升级任何宿主包。

---

# 开发与验证

## 两套环境

| 环境 | 当前基准 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12.15、独立根 .venv | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | Python 3.12.4、Backend 0.45.0、Frontend 1.59.1 | 真实节点加载、执行、UI 与状态路由 |
| CI | Python 3.11 / 3.12，Node 22 | 支持范围与独立自动验证 |

.python-version 为 3.12；最低发行 requires-python 仍为 >=3.11。根 uv.lock 和 MCP workspace
保持单一来源。切换前检查了旧 .venv（Python 3.13.15），已移动到 .venv-backup-3.13 保存；
备份不被 Git/Registry 打包。不要从备份直接运行带旧绝对路径的 console scripts；若需恢复，
应在没有使用当前环境的进程时将其移回原 .venv 路径。

**绝不在 ComfyUI 宿主环境执行 uv sync。** 未升级或修改宿主 Torch、NumPy、Pillow、ComfyUI。
开发环境不安装这些重型宿主包，V3 单元测试明确使用 test doubles。

## 安装与日常命令

从仓库根目录执行，使用 uv 0.13.8、pnpm 11.13.1（本机 Node 26.8.2，CI Node 22）：

```sh
uv sync --frozen
uv run python --version
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend exec playwright install chromium
pnpm -C frontend typecheck
pnpm -C frontend build
```

不需要 MCP 已发布：uv source 指向本地 workspace member。源码 requirements.txt 的 ./mcp
也只能在源码根目录安装；正式 Registry 包由 release.py 替换为同版本 PyPI pin。

## 四类验证

### Unit Tests

```sh
uv run pytest tests/nodes tests/backend
uv run --project mcp pytest mcp/tests
```

节点测试核验 V3 entrypoint、节点列表、Schema、输入校验和 LoadImage 委托/NodeOutput，
使用按 0.45.0 源码签名编写的窄 test double。Core 测试验证路径/配置和导入无写入副作用。
MCP 使用 FastMCP 内存 Client、HTTPX MockTransport 和真实 stdio 子进程，保留两个 Tool 契约。

### Integration Tests

```sh
uv run pytest tests/integration -m "not host"
pnpm -C frontend test
```

aiohttp TestServer/TestClient 测试真实 HTTP、原生 RouteTableDef、重复注册与状态变化，
但 ComfyUI 注册边界为替身。Vitest Chromium 运行 Canvas 真像素、触摸、上传序列化、错误分支，
另加载真实构建 main.js 验证独立 Vue/PrimeVue 初始化、主题、国际化与 onRemove 清理。
这些都不等于真实 ComfyUI 宿主验收。

### Host Runtime Verification

宿主修复后，先正常启动 ComfyUI，再显式指定地址（PowerShell）：

```powershell
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
uv run pytest tests/integration -m host
```

未设置地址时测试跳过，不启动 ComfyUI、不修改宿主环境。
检查 /astrophoto/v1/status 和 /object_info/vue-basic 后，还需浏览器手工验证
vue-basic → Preview Image 的绘图、保存工作流、重新打开与 IMAGE 输出。

本次实际尝试在 ComfyUI 目录运行：

```sh
python main.py --cpu --listen 127.0.0.1 --port 8199 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto
```

宿主在插件加载前失败：Torch 2.3.0+cpu 没有 torch.library.custom_op，comfy_kitchen 导入失败。
直接导入 comfy_api.latest 也失败。因此真实 V3 加载、状态路由访问与 Frontend 1.59.1 交互
仍未完成，不以隔离测试冒充通过。未主动修复/升级宿主核心依赖。

### Packaging Verification

```sh
uv run pytest tests/packaging
uv build mcp --no-sources --out-dir dist/mcp
uv run python scripts/release.py registry
uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz
uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1
uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py
```

根 pytest 默认收集 nodes/backend/integration/packaging，真实 host 测试默认 skip；不扫描
reference 或 MCP 的测试。MCP 有自己的 pytest 配置和 dev 依赖，保留独立入口。

## 新增依赖与前端边界

- 后端只使用标准库与 ComfyUI 已提供的 aiohttp；独立 dev group 新增 aiohttp>=3.9,<4，
  实际锁定 3.14.5，与宿主已安装版本一致。没有安装 SQLAlchemy/Alembic/Astropy/LangChain。
- TypeScript 5.9.3、vue-tsc 3.3.14 独立执行；strict=true，skipLibCheck 仅跳过第三方声明内部检查。
  Vite build 仅构建，不替代源码类型检查。
- 类型包改为 @comfyorg/comfyui-frontend-types 1.59.1。它的 Vue peer 是 ^3.5.42，
  本项目保留 Vue 3.5.13；仅对这个纯类型依赖声明精确 peer 例外，源码类型/浏览器验证通过。
  这不是宿主运行时兼容性的替代证明。
- PrimeVue 4.3.3 和配套 Aura 4.3.3 由扩展独立安装/打包/初始化，vue-i18n 9.14.4 保持；
  这些旧版本的维护警告不在本次范围内以升级整个 UI 栈解决。主题使用独立 CSS 前缀。
- ComfyUI 1.59.1 不再安装 PrimeVue。前端通过原生 addDOMWidget 挂载独立 Vue app，
  使用官方 app/api URL；不导入内部 domWidget 模块，不依赖宿主 Vue 注入。

## 数据根目录

ASTROPHOTO_HOME 可设为绝对目录，默认 ~/.astrophoto/。状态 API 报告配置路径但不会创建它。
未来真实业务在显式操作时初始化数据库/运行目录；模型路径仍由 ComfyUI folder_paths 管理。

## 仓库复核记录（2026-11-16）

本轮重新执行：Python 3.12.15 根测试 22 passed / 1 skipped、MCP 52 passed；现有独立 Python 3.11.18 验证环境同样 22 passed / 1 skipped、MCP 52 passed。前端 Chromium 6 passed，vue-tsc、Vite、Ruff、uv lock --check、双包清单和 Python 3.12.15 隔离 wheel 安装均通过。宿主启动再次失败，完整原始日志见 [测试证据](07_TEST_EVIDENCE.md)。这些结果不是远程 GitHub Actions 已成功的证明。

本轮发现但未修改源码的问题：中文缺少 `vue-basic.pen-tooltip`，测试出现英文回退警告；上传代码尚未检查 HTTP 状态和响应 name；保存后恢复 Canvas 像素未获真实宿主验证。详见交接中的风险清单。

`.pre-commit-config.yaml` 仍固定 Ruff v0.4.9，与 uv/CI Ruff 0.17.5 不一致；本轮未运行会自动改文件的 pre-commit。根 pyproject 有 mypy 配置，但 mypy 未作为项目依赖或 CI 检查，不能宣称完整 Python 类型检查通过。前端 vue-tsc 只检查 src，排除了 tests。

<!-- END 04_TECH_STACK.md -->


---

<!-- BEGIN 05_MCP_AND_SKILLS.md -->

# MCP实际实现与Skills边界

VERIFIED：源码9个Python文件、2个Tools、CLI、内存协议与独立stdio。产品Skills为PLANNED/零个；有条件Provider接线本身只完成基础设施。没有SQLite、ComfyUI内部import、软件执行或内部Agent调度。

关键证据：server.py:16唯一工厂、tools/status.py:11注册、config.py:11 URL优先级与验证、client.py:9 HTTPX生命周期、api/comfy.py:6两个GET及响应验证、__main__.py:9 CLI。实际协议抓取在evidence/mcp-contract.json。

下文为修订后的接口文档完整快照；先前验证与本轮重跑的区别见末节。本轮官方签名采用安装的4.2.0，不依赖历史SDK1.x猜测。

# MCP

独立 PyPI 包名 `astrophoto-mcp`，模块 `astrophoto_mcp`，CLI `astrophoto-mcp`。
采用独立的 `fastmcp==4.2.0`，不再使用 `mcp.server.fastmcp.FastMCP`。
Python 最低版本为 3.11，HTTP 调用使用 HTTPX >=0.28,<1；依赖通过根 uv workspace 锁定。

```sh
uv run astrophoto-mcp --version
uv run astrophoto-mcp --comfy-url http://127.0.0.1:8188
# 已安装到 ComfyUI Python 环境时：
python -m astrophoto_mcp
```

默认 stdio，由 MCP 客户端启动并管理进程。stdout 为协议通道。
不自动启动 ComfyUI，不增加 HTTP MCP 服务、数据库或守护进程。
开发默认 Python 已由根 `.python-version` 固定为 3.12；最低发行版本仍为 3.11。
`--comfy-url` 优先于 `COMFYUI_URL`，默认 `http://127.0.0.1:8188`。
可包含反向代理路径前缀，例如 `/proxy/comfy/`。`resolve_comfy_url()` 统一验证
HTTP(S) 协议、主机和端口，保留路径并补齐尾部斜杠。显式空值、凭证、query、fragment、
内部空白及反斜杠被拒绝；不会把无效配置悄悄替换为默认地址。未实现额外认证头配置。

| Tool | 参数 | 返回 |
| --- | --- | --- |
| `version` | 无 | `{name, version}`，仅代表当前安装的 MCP 包 |
| `connection_status` | 无 | `{reachable: true, extension_registered: bool, system: object}` |

诊断只向配置的服务发送 `GET /system_stats` 和 `GET /object_info/vue-basic`，
超时为每次请求 10 秒。官方 `/object_info/{node_class}` 在节点不存在时返回 HTTP 200 `{}`，
此时 `extension_registered` 为 false；HTTP 404/500 都保留为错误，不视为节点缺失。
连接失败、超时、HTTP 错误、非法 JSON 或非对象响应
通过 MCP tool error 返回，不伪造成功状态。不推断远端 Extension 版本。

## Extension 原生状态 API

Extension 现在通过 ComfyUI 自身 aiohttp 注册 `GET /astrophoto/v1/status`，返回：

```json
{
  "extension": {"id": "ComfyUI_AstroPhoto", "version": "0.0.1"},
  "api_version": "v1",
  "status": "ok",
  "runtime": {"node_registered": true, "routes_registered": true},
  "data_home": "<configured absolute data directory>",
  "capabilities": {
    "status_api": {"available": true, "reason": null},
    "drawing_node": {"available": true, "reason": null},
    "assets": {"available": false, "reason": "not_implemented"}
  }
}
```

示例省略了其余 unavailable 领域；实际同时返回 storage/software/processing/knowledge/
memory/experiments/canvas_bridge。节点注册缺失时状态为 degraded，不能根据目录存在推断能力。
data_home 仅表示配置，不表示已创建数据库。status ok 不表示前端在线或工作流已验证。

本次保持 `connection_status` 的两次请求及返回契约，不强制调用新 API、不增加新 Tool。
未来若需要详细状态发现，再由 MCP API Adapter 使用此公开路由；不能 import astrophoto
或读取其本地配置/存储。该接口已通过独立 aiohttp 测试，真实 ComfyUI 运行验证仍受宿主阻塞。

## 模块与已核验 API

```text
astrophoto_mcp/
├── __init__.py       # 从安装 metadata 读取版本
├── __main__.py       # CLI，stdio；show_banner=False
├── config.py         # resolve_comfy_url()、超时常量
├── server.py         # 唯一 create_server()，on_duplicate="error"
├── client.py         # diagnose()，HTTPX 与 MockTransport 注入
├── api/
│   ├── __init__.py
│   └── comfy.py      # fetch_status()，端点及响应校验
└── tools/
    ├── __init__.py
    └── status.py     # register_status()，使用传入实例的 @mcp.tool
```

在独立 Python 3.11 环境安装 4.2.0 后检查签名，并在实际调用中验证：

| API | 已验证行为 |
| --- | --- |
| `from fastmcp import FastMCP, Client` | 单 Server；内存 `Client(server)` 支持 list/call |
| `FastMCP(..., on_duplicate="error")` | 重复注册抛出 ValueError |
| `@mcp.tool(output_schema=...)` | 注册工具；可显式保留输出 Schema |
| `from fastmcp.tools import ToolResult` | 使用框架序列化 JSON 文本，不自行实现协议 |
| `mcp.run(transport="stdio", show_banner=False)` | stdio；禁用 banner，日志在 stderr |
| `fastmcp.client.transports.StdioTransport` | 支持 command、args、env；真实子进程已测试 |
| `Client(..., mode="legacy", auto_initialize=False)` | 显式 initialize → list_tools → call_tool |
| `fastmcp.server.providers.local_provider.LocalProvider` | 实际 LocalProvider 路径；应用无需另建实例 |
| `fastmcp.skills.provider.SkillsDirectoryProvider` | 新导入路径；构造时扫描并校验 Skills |

4.2.0 在本次锁文件中解析到 MCP SDK 2.3.0，不能继续沿用 SDK 1.x 的 ClientSession
测试导入。FastMCP Client 的默认自动协商可能使用新协议 `server/discover`，没有
InitializeResult；需要验证传统握手时必须明确 `mode="legacy"`。
本次也用旧 SDK 1.30 客户端连接新服务，验证了原有 initialize/list/call 和版本返回。

## Schema 与返回兼容性

升级前从真实 SDK 1.30 Server 捕获的 Schema 保存于
`mcp/tests/fixtures/status_contract.json`，内存协议测试与之比较：

- `version` 保持 `{name, version}`、原 string-valued dict 输出 Schema，以及相同内容的 JSON text / structuredContent。
- `connection_status` 保持原字段、JSON text 响应、无 outputSchema、无 structuredContent；使用 `ToolResult(content=...)` 避免新版自动增加结构化输出。
- 输入仍为无参数对象。FastMCP 4.2 默认移除原参数 Schema 的 title 并增加 `additionalProperties: false`；这是明确记录的输入 Schema 差异，已有 `{}` 调用不变。
- JSON 文本的空白格式由框架决定，不作为契约；错误保持 MCP error，不改成成功返回的错误字典。
- Client 结果使用新版 `is_error`、`structured_content` 等字段；这是客户端 SDK Python API 的变化，MCP wire 字段仍由框架处理。

## Skills 与未来领域

当前没有用户业务 Skills，也没有 skills/ 空包或伪 Capability。
将来仅扫描 `astrophoto_mcp/skills/` 中真实 `SKILL.md`，通过
`SkillsDirectoryProvider` 校验后注册；无效内容阻止启动。不会扫描 `.agents/skills/`
或用户主目录，不使用已弃用的 4.1 Provider 路径。
Hatch 的包目录规则会将真实 Skills 随 wheel 发布；添加时需补充资源读取和打包测试。

未来领域方向为 status / assets / software / nodes / canvas / workflows /
experiments / knowledge / memory。只在业务实现后新增对应注册函数，复用同一个 Server
并通过 API Adapter 调用 Extension；MCP 不直接访问 SQLite、ComfyUI 内部模块或天文软件。

## 官方依据与验证边界

- [FastMCP 4.2.0 Release](https://github.com/PrefectHQ/fastmcp/releases/tag/v4.2.0) 与 [PyPI metadata](https://pypi.org/project/fastmcp/4.2.0/)：固定版本及 Python 要求。
- [Tools](https://gofastmcp.com/docs/servers/tools)、[Client](https://gofastmcp.com/docs/clients/client)、[Testing](https://gofastmcp.com/docs/servers/testing)：装饰器、协议 Client 和内存测试。测试沿用 asyncio.run，不额外引入异步测试框架。
- [Skills over MCP](https://gofastmcp.com/docs/servers/skills)：新 Provider 路径和静态 Skills 校验。
- [ComfyUI Routes](https://docs.comfy.org/development/comfyui-server/comms_routes)：诊断端点；同时核对了本机 ComfyUI server.py 的实际路由。
- [uv workspaces](https://docs.astral.sh/uv/concepts/projects/workspaces/)：共享锁文件及 Python 要求交集。

Local Provider 文档页面在本次抓取时不可访问，相关签名与路径以本地安装的 4.2.0
源码和实际 duplicate 测试为准。已验证 Python 3.11 workspace 和本机 ComfyUI 所用
Python 3.12.4 的隔离 wheel 安装；没有改动宿主依赖。真实 ComfyUI 仍受原有 Torch /
comfy_kitchen 启动问题限制，HTTP 单元测试不依赖活跃宿主。

客户端配置示意（将路径替换为实际安装了 MCP 的 Python）：

```json
{
  "mcpServers": {
    "astrophoto": {
      "command": "C:/path/to/ComfyUI/python.exe",
      "args": ["-m", "astrophoto_mcp", "--comfy-url", "http://127.0.0.1:8188"]
    }
  }
}
```

未来工作流能力应使用 ComfyUI HTTP/WebSocket 或 Extension 公共接口。
资产管理、Siril、知识库、前端桥接与工作流执行工具尚未实现。

## 仓库复核边界（2026-11-16）

当前源码与本轮 52 项测试已核验，包含内存 Client、legacy stdio 及原始 JSON stdout 检查。上文旧 SDK 1.30 客户端和宿主 Python 3.12.4 隔离安装属于先前验证记录，本轮未重跑，不计入本轮通过项。

运行时版本握手/不匹配拒绝仍为 PLANNED：`version` 仅返回 MCP 自身版本，`connection_status` 不访问 `/astrophoto/v1/status`。产品 Skills 数量为零；有条件 Provider 接线不等于存在可用业务 Skills。`skills list/install` CLI、Node Search、工作流运行和 Canvas Bridge 都未实现。

FastMCP 间接依赖中存在 Starlette/Uvicorn；这不表示本项目启动了第二个 Web 服务。实际入口仅调用 stdio。源码与日志索引见 [MCP 审计](05_MCP_AND_SKILLS.md)。

## 未来披露与产品Skill

L0状态/能力，L1资产/软件/节点/知识/记忆发现，L2导入/配置/画布/执行/实验/记忆变更；这些是使用顺序和领域组织，不是三个Server，也不通过全局visibility改变并发客户端。当前只实现L0的两个诊断Tool。

保留9个领域方向：status/assets/software/nodes/canvas/workflows/experiments/knowledge/memory。33候选完整表见02（4环境设备+6资产+5工作流+12处理+3知识记忆+3优化），均不作为当前Tool或Skill注册。将来产品Skill在包内skills发布且先验证Tool依赖；不支持MCP Skills的Agent Host可经用户主动选择本地安装，当前尚无skills list/install CLI。

<!-- END 05_MCP_AND_SKILLS.md -->


---

<!-- BEGIN 06_DATA_MEMORY_RAG.md -->

# 数据、Memory、Knowledge 与实验

本章业务内容均为 **PLANNED**。当前只实现 `astrophoto/core/paths.py:10` 的数据根解析与 `core/config.py:19` 配置读取；无建库、ORM、迁移、模型注册、扫描、软件调用。导入无建目录副作用由 `tests/backend/test_core.py` 验证。完整需求见 02。

## 所有权和目录

默认 `~/.astrophoto/`，`ASTROPHOTO_HOME` 可覆盖为绝对路径。当前不创建该目录。未来 `databases/assets.db`、`databases/knowledge.db`、`databases/memory.db` 分库；大 FITS/视频在文件系统，数据库保存引用、指纹、元数据。CodeGraph 自己的 `.codegraph/codegraph.db` 与这些业务数据库完全不同。

Assets 保存设备、Optical Train、CaptureSession、Light/Dark/Flat/Bias/Dark Flat、Master、Target、Site 和可解释校准关联。保留原始 Header，分 observed/inferred/user_confirmed，不默认覆盖原图。VIIRS 辐亮度、SQM、Bortle、现场测量分别建模；位置查询须授权并核对数据许可。

SQLAlchemy 2/Alembic 尚非项目运行依赖；未来按域建 ORM/Service/Repository，按操作持有短 Session，不跨线程共享、不在长软件进程期间持有写事务。三库跨库原子性不是现有保证。备份业务事实与重建知识索引必须分开。

## Knowledge

Extension `astrophoto/knowledge/` 未来负责 LangChain 文档采集、清洗、分块、FTS5；可选 sqlite-vec、FastEmbed/ONNX、Reranker。MCP 只通过公开 API 检索，外部 Agent 综合回答。文档保留 URL、许可、标题/章节、软件版本、时间、指纹与 chunk ID。返回可追溯摘录，无来源不编造。

中文 tokenizer、Windows 二进制兼容、软件文档许可仍 UNKNOWN。无 Embedding 模型时应能用 FTS5。模型由 ComfyUI folder_paths 管理专用 astrophoto_embedding/astrophoto_reranker 类别，不与 Textual Inversion 混淆；这些目录尚未注册。检索资料是数据，不是覆盖工具权限的指令。

## User Memory

Memory 由 Extension 管理且独立于 Agent Harness；不是聊天日志、task-notes 或知识库。资产事实只引用 assets ID；memory 保存授权事件、反馈、偏好及证据，actor 区分 human/agent/system。`nodeCreated` 可能来自打开旧工作流，不能直接当人类新建动作。

生命周期：Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh/Expire → Forget。显式偏好优先于推断；推断含场景、confidence、source/evidence、last_verified。用户能关闭采集、审阅、纠错、导出、删除；30 天是候选短期保留值而非已实现默认策略。多用户需要真实认证，不能信任任意 profile_id。

HOO/SHO/RGB 的饱和度、背景、星点、降噪等偏好必须区分场景，不能从 Agent 自己的参数尝试推导用户审美。精确位置、设备序列号不自动上传，不写入公共 SKILL.md。

## Software、科学数据与 Experiments

Siril 优先，PixInsight 随后；Registry 验证路径/版本/许可，Adapter 生成受限参数，Runner 管单操作进程、超时/取消/日志，ComfyUI 管 DAG。禁止自由 Agent shell。软件缺失应报告不可用，不能破坏已保存节点的类型识别。

IMAGE 是普通展示契约，PNG 示例不是 FITS 精度验收。ASTRO_ASSET/ASTRO_FRAME 是待原型的名称，缓存、序列化、科学元数据保留仍 UNKNOWN。SER/XISF/RAW/视频逐格式验证，不一概宣布支持。

Experiment/Trial 未来记录 experiment_id、trial_id、prompt_id、workflow snapshot/hash、Node Schema、软件版本、输入输出 Asset、参数、指标、耗时、错误及人工反馈。SNR/FWHM/背景梯度与审美评价分开；必须有预算、停止、取消、恢复、幂等及可复现性。外部 Harness 管 Subagent 策略，不在 MCP 增设 Agent Runtime。

<!-- END 06_DATA_MEMORY_RAG.md -->


---

<!-- BEGIN 07_TEST_EVIDENCE.md -->

# 本轮验证证据

执行时间：2026-11-16 21:28 起（America/Chicago）；仓库根为默认cwd。命令在独立开发环境执行，例外明确注明。结果来自本轮工具输出，未引用历史通过数量充数。

## 命令与结果

| 检查 | 实际命令 | 结果 | 原始日志 |
| --- | --- | --- | --- |
| Extension单元/HTTP/发行 | `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 22 passed, 1 skipped；13单元+2HTTP+7发行；host skip | evidence/root-tests.txt |
| MCP内存/HTTP mock/CLI/stdio | `uv run --project mcp pytest mcp/tests -q` | 52 passed | evidence/mcp-tests.txt |
| Python3.11下限回归 | `& dist/check-py311/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 22 passed, 1 skipped；Python3.11.18 | evidence/py311-root.txt |
| Python3.11 MCP | `& dist/check-py311/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests -q` | 52 passed | evidence/py311-mcp.txt |
| 前端类型 | `pnpm -C frontend typecheck` | vue-tsc成功；只src | evidence/typecheck.txt |
| 前端构建/浏览器 | `pnpm -C frontend test` | Vite成功，Chromium 3文件/6测试通过 | evidence/frontend-tests.txt |
| Python lint | `uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py` | All checks passed | evidence/ruff.txt |
| Workspace解析 | `uv lock --check` | 115包，锁未改 | evidence/uv-lock.txt |
| 前端peer | `pnpm -C frontend peers check` | 无peer问题（已配置类型包Vue例外） | evidence/peers.txt |
| Lockstep及Tag格式 | `uv run python scripts/release.py check --tag v0.0.1` | 0.0.1；仅检查字符串，没有创建Tag | evidence/version-check.txt |
| MCP独立构建 | `uv build mcp --no-sources --out-dir dist/mcp` | wheel+sdist成功 | evidence/build.txt |
| Registry暂存构建 | `uv run python scripts/release.py registry` | dist/registry.zip成功 | evidence/registry.txt |
| 发行清单 | `uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz` | Registry21 / wheel14 / sdist20，隔离与版本正确 | evidence/artifacts.txt |
| 独立安装+stdio | `uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1` | 新临时Python3.12.15 venv安装、initialize/list/version通过 | evidence/install.txt |
| 实际宿主启动 | `& C:/ProgramData/anaconda3/python.exe main.py --cpu --listen 127.0.0.1 --port 8199 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto`（ComfyUI根cwd） | **失败，退出1**；torch.library.custom_op缺失，未加载Extension | evidence/host-start.txt |
| 公共PyPI可用性 | Python urllib GET `https://pypi.org/pypi/astrophoto-mcp/0.0.1/json` | **HTTP404**；未发布 | evidence/pypi-availability.txt |

按Python3.12主验证入口计80个测试通过（22+52+6）、1个host跳过；3.11额外74通过/1跳过是同一套Python用例的另一个环境，不能当新增覆盖。Ruff/typecheck/build/install是检查项，不虚构pytest数量。

## 测试能证明什么

- Node测试用V3、folder_paths、LoadImage替身，仅断言契约/委托/返回对象，未处理真实IMAGE tensor。不可标“真实PNG到IMAGE端到端通过”。
- HTTP集成用真实aiohttp TestServer/TestClient和路由表，ComfyUI注册映射替身；证明返回/重复注册/冲突隔离，不证明真实PromptServer加载。
- 前端为真实Chromium Canvas像素与事件，ComfyUI API/node边界mock。构建JS测试使用独立Vue/PrimeVue主题，验证onRemove；没有实际Host图保存/重载。
- MCP52包含Tool Schema、URL优先级/反代、404/500/断线/超时/坏JSON、无效Skills、legacy与auto内存Client、子进程stdio和stdout逐行JSON。stdio测试调用version，不是假称已连接真实ComfyUI。
- 隔离wheel安装从本地wheel安装本包，依赖从公共PyPI解析；不是公共astrophoto-mcp0.0.1安装成功，也不是把MCP装进现有宿主。

## 附加运行查询

`uv --version`→0.13.8、`pnpm --version`→11.13.1、`node --version`→26.8.2。Python用importlib.metadata查询安装版本，FastMCP签名用inspect.signature记录。内存工具实际Schema及version结果见evidence/mcp-contract.json，未注册后端payload见status-example.json。

审计辅助抓取首次对Client CallToolResult调用model_dump失败，修正为读取其is_error/structured_content/content公开字段后成功；没有因此修改应用源码。不要把该Client结果误当Pydantic模型。

## 明确未执行

真实Host HTTP测试（未设置COMFYUI_TEST_URL）、真实画板保存重开/Preview Image、Manager安装更新、远程GitHub Actions、PyPI/Registry发布、业务软件/FITS/RAG/Memory/Skill Host兼容均未通过本轮运行验证。旧SDK1.30客户端、宿主3.12.4隔离wheel安装属于先前记录，本轮未重跑。未运行pre-commit自动fix和mypy；未修改或同步宿主环境。

## 包边界

Registry包含root入口、nodes、astrophoto10个Python模块、js/main.js及CSS、en/zh locales、README/LICENSE和发布metadata/requirements。无mcp/reference/frontend源码/tests/docs/notes/artifact/真实数据库；requirements为astrophoto-mcp==0.0.1。MCP wheel含9个自身源码模块和5个dist-info文件；无Extension源码或产品Skills。sdist20文件包含MCP自身测试。

---

## 当前发布操作文档快照

# 双包发布

根 `pyproject.toml` 是唯一版本来源；MCP 项目版本和 Extension 的
`astrophoto-mcp==X.Y.Z` 是生成/同步副本。当前发布流程支持稳定 SemVer
`X.Y.Z`（不接受前导零或预发布标签）。两个发行单元对应同一个 `vX.Y.Z` Tag。

## 准备与检查（不发布）

```sh
uv run python scripts/release.py sync 0.0.1
uv lock
uv run python scripts/release.py check --tag v0.0.1
pnpm --dir frontend run build
uv run pytest tests/nodes tests/backend tests/integration tests/packaging -m "not host"
pnpm -C frontend typecheck
uv run --project mcp pytest mcp/tests
pnpm -C frontend test
uv build mcp --no-sources --out-dir dist/mcp
uv run python scripts/release.py registry
uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz
uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1
```

`sync` 不带版本参数时从根版本同步；它也同步 LICENSE。
更改版本后必须 `uv lock` 并提交锁文件。前端是私有构建项目，不独立发布。

当前两个项目的 `requires-python` 均为 `>=3.11`，MCP 固定依赖 `fastmcp==4.2.0`。
Extension 的同版本 MCP 强依赖意味着 Python 3.10 ComfyUI 环境不能安装本版发行包。
发布前须在目标宿主 Python 中确认依赖兼容；不能仅依据节点源码仍能在 3.10 解析。

## 安装与打包边界

- 源码 checkout：uv workspace 解析本地 MCP；requirements 使用 `./mcp`，因此未发布版本不阻塞开发。
- Registry ZIP：根入口、nodes、astrophoto（Core/Bootstrap/Status API）、js、locales、README、LICENSE、发布用 pyproject/requirements。
  requirements 和项目依赖都固定为 `astrophoto-mcp==X.Y.Z`；不含本地路径或 workspace 配置。
- MCP wheel：仅 `astrophoto_mcp/` 与 dist-info；sdist 仅 MCP 自身的源码、测试及元数据。
- `.comfyignore` 排除 mcp、reference、前端源码、工具、测试与开发资料。
  同时排除 Python 环境备份、.python-version、数据库/日志/临时数据；清单检查拒绝运行数据混入包内。
  打包器以 Git tracked + 非忽略的新文件准备暂存目录，经 `.comfyignore` 过滤，
  然后在临时 Git index 中调用 comfy-cli 官方 `zip_files`。不会修改用户 Git index。
  严格清单校验会拒绝意外根目录文件，避免悄悄混入发行包。

不要在源码 checkout 根直接执行 `comfy node publish`：发布必须使用经验证的
暂存包，其中 requirements 已替换为 PyPI pin。开发源码不依赖 Registry 包中不存在的 `mcp/`。
官方打包行为见 [comfy-cli file_utils](https://github.com/Comfy-Org/comfy-cli/blob/main/comfy_cli/file_utils.py)。

## CI 发布顺序

`release.yml` 的 Tag 触发流程复用 `ci.yml`：Python/浏览器测试与前端构建
→ MCP 构建 → 双包清单及隔离安装验证 → PyPI → 从公共 PyPI 独立安装并握手
→ Comfy Registry。不会创建 GitHub Release。

需预先设置 PyPI Trusted Publisher（对应 `pypi` GitHub environment），
以及 `comfy-registry` environment 的 `COMFY_REGISTRY_TOKEN`。
本次只配置流程，未设置凭证、创建 Tag 或执行发布。
PyPI 成功但 Registry 失败时可以重跑同一 Tag：PyPI 跳过已有文件，仍须重新通过
公共 PyPI 安装检查。Registry 端已发布版本不可覆盖，需检查其状态后决定是否升版。
两个外部服务无法原子提交；不要删除或复用已发布版本。

## 当前发布阻塞

2026-11-16 只读检查 `https://pypi.org/pypi/astrophoto-mcp/0.0.1/json` 返回 HTTP 404。
因此本地 wheel 安装成功不能视为正式 Registry 依赖已可解析：必须先发布同版本 MCP
并通过公共 PyPI 安装验证，才可发布 Extension。另需完成真实 ComfyUI 宿主加载验收。
本任务没有发布、创建 Tag、提交或推送。

## 仓库复核边界（2026-11-16）

本轮 Registry 21 文件、MCP wheel 14 文件、sdist 20 文件检查通过；隔离 Python 3.12.15 安装 wheel 并进行 stdio 握手/工具调用通过。公共 PyPI 版本 URL 再次返回 404，仍是发布阻塞。证据见 [发行验证日志](evidence/artifacts.txt)。

Manager 只能影响其依赖安装所使用的环境，不能保证更新外部 uvx/venv 或已经运行的 MCP 进程；这些实例需单独升级和重启。当前没有运行时跨包版本握手。真实 Manager 安装/更新及 GitHub Actions 发布流程本轮未运行；配置审查与本地构建不能替代这些验证。构建后端声明 Hatchling >=1.27,<2，隔离构建不由根 uv.lock 固定 Hatchling 精确版本。

<!-- END 07_TEST_EVIDENCE.md -->


---

<!-- BEGIN 08_GAPS_AND_RISKS.md -->

# 差距与风险

本轮只修文档；下面的源码问题未擅自修复。状态适用于具体结论，不将疑点伪装成已复现的宿主故障。

| ID/优先级 | 状态 | 证据与影响 | 下一步及验证 |
| --- | --- | --- | --- |
| R1 / 发布阻塞 | VERIFIED | `evidence/host-start.txt`：宿主 comfy_kitchen 导入需要 torch.library.custom_op，Torch 2.3.0 无此属性；插件尚未加载 | 经用户授权解决宿主环境，或准备批准的独立可运行宿主；不得在当前宿主 uv sync。再跑 host 测试和 UI |
| R2 / 发布阻塞 | VERIFIED | `evidence/pypi-availability.txt`：0.0.1 返回 404 | 获发布授权后先 PyPI，再公共安装/stdio，最后 Registry；当前不得发布强依赖不存在包的 Extension |
| R3 / P0 验收 | IMPLEMENTED_UNVERIFIED | 完整绘图→上传→真实 LoadImage tensor→Preview Image、保存/重开链路没有实际宿主通过证据 | host HTTP 测试仅检查 status/object_info，另手工验证工作流 JSON 与像素恢复、英中 UI、清理 |
| R4 / P1 | PLANNED | `mcp/src/astrophoto_mcp/api/comfy.py:6` 只请求两个 ComfyUI 端点；没有跨包版本握手/拒绝 | 新增能力发现设计时保持两个旧 Tool 契约，单独测试兼容版本与不匹配 |
| R5 / P1 源码审查 | PARTIAL | `frontend/src/components/VueExampleComponent.vue:48` 调用 resp.json()，未检查 resp.ok/name；错误 JSON 可能形成 threed/undefined [temp]。当前测试只覆盖 rejected Promise | 补 HTTP 4xx/5xx、错误 JSON/name 的浏览器测试，再授权修复，保留既有失败契约 |
| R6 / P1 证据不足 | UNKNOWN | 同组件:24、60 只有本地 canvasDataURL 和 serializeValue，未见读取持久 Widget 值并重绘的路径；当前测试不覆盖保存/重开 | 先在真实宿主复现，不将“序列化通过”写成“画板恢复通过”；再定义恢复语义和测试 |
| R7 / P2 | VERIFIED | `locales/zh/main.json` 缺少 pen-tooltip；`evidence/frontend-tests.txt` 出现英文 fallback | 增补翻译并断言中文 tooltip，无需架构重构 |
| R8 / P2 | CONFLICT | `.pre-commit-config.yaml:4` Ruff v0.4.9，uv.lock/CI 实际 Ruff 0.17.5 | 后续统一版本并审查 format/fix 的改动；本轮不执行自动改写 Hook |
| R9 / P1 兼容 | IMPLEMENTED_UNVERIFIED | 类型包 1.59.1 peer Vue ^3.5.42；runtime 3.5.13，有精确 allowedVersions 例外。vue-tsc/Chromium 通过 | 真宿主1.59.1验证；不得把 peer 例外当兼容证明，也不盲目升级 UI |
| R10 / P2 | UNKNOWN | CI/release YAML 本地审查通过，未查询或运行远程 Actions；Manager 三种安装路径未实际验收 | 发布前执行真实矩阵/Manager安装更新，保留日志，独立 MCP 环境单独升级/重启 |
| R11 / P2 | PARTIAL | 根 pyproject 有 mypy 配置，但没有项目依赖/CI 调用；vue-tsc 排除 tests | 明确当前检查范围，若引入 Python 类型检查需实际配置和验证 |
| R12 / 未来业务前置 | PLANNED | API status 暴露配置 data_home，没有新增认证/用户隔离；目前无写 API | 开放 Assets/Memory/远程部署前定义认证、路径范围、CSRF/Origin、回执；本地诊断不等于权限系统 |

构建输出约 545 kB 单 JS，非当前失败；Node 26 的 localStorage ExperimentalWarning、Vue compiler macro 导入警告也未造成测试失败。MCP 安装日志中依赖解析警告有原始记录，不宣称整个宿主依赖环境健康。

PyPI、Registry、Node/Browser/Host 安装版本会变化；使用此包接手时先核对时间和哈希。历史“所有功能保护已完成”的泛化结论应缩小到隔离测试范围。

<!-- END 08_GAPS_AND_RISKS.md -->


---

<!-- BEGIN 09_DECISIONS.md -->

# 决策校准

这里的 VERIFIED 只指相应工程事实；未来设计保持 PLANNED。历史 ADR ID 来自原 06 决策日志。

| ADR | 结果 | 状态/行动 |
| --- | --- | --- |
| 01/02 单仓双包、Lockstep | 根版本0.0.1、本地 workspace、同版依赖、Tag检查、双包隔离已有 | VERIFIED 本地；发布流程 PARTIAL；运行时握手 PLANNED |
| 03 宿主管图与执行 | 没有另建 DAG/Canvas 引擎；原生 DOM Widget 与节点 | VERIFIED 源码；完整宿主体验未验收 |
| 04 Domain-first | astrophoto Core/API/Bootstrap 已有，无业务空包 | VERIFIED；未来领域仍 PLANNED |
| 05 V3 唯一标准 | 当前根入口只导出 V3 和 WEB_DIRECTORY | VERIFIED 隔离；历史 V1 说明 OBSOLETE |
| 06 原生 aiohttp | on_load 注册 PromptServer 路由，无第二服务器 | VERIFIED 独立 HTTP；实际宿主未验证 |
| 07 FastMCP4.2 单 Server | tools/status 注册到唯一工厂，stdio、HTTPX | VERIFIED；九领域/三层发现仅是后续组织方向 |
| 08 三 DB | assets/knowledge/memory 未来分库 | PLANNED；不创建数据库以满足目录图 |
| 09 科学数据 | 默认保留原数据与 Header | PLANNED；PNG/IMAGE 适配不能证明 FITS |
| 10 软件 Adapter | Registry+Runner+per-software Adapter | PLANNED；无 Siril/PixInsight 执行 |
| 11 Bridge+Receipt | /prompt 不等于修改在线 Canvas | PLANNED；无 canvas Tool |
| 12 独立 User Memory | Extension 持有，用户授权，分清 actor | PLANNED；不以 task-notes 代替 |
| 13 Skills Wheel | 当前 SkillsDirectoryProvider 条件接线，有效业务 Skill 才发行 | PARTIAL 接线，产品 Skills PLANNED/零个；Catalog 是可选 API，不是唯一合法 API |
| 14 Python3.12 | .python-version与独立.venv已落实，旧环境保留 | VERIFIED；“尚未迁移” OBSOLETE，最低3.11未提升 |
| 15 先基础不扩业务 | 基础实现/验证已做，宿主/发布验收仍缺 | PARTIAL 总验收；下一 Agent 不重复重构 |

新增工程决策：配置采用标准库 frozen dataclass/tomllib；状态请求时读真实宿主注册表，避免 on_load 时机误报；路由按 RouteTableDef 去重并拒绝异主；前端自带 Vue/PrimeVue/Aura/i18n，不依赖宿主插件；comfy:app/api 构建后固定宿主 URL；Registry 暂存时替换 ./mcp，源码保留本地开发；测试三个独立入口，根集中跨组件与发行检查。

没有取消 Assets、Memory、RAG、软件 Adapter、实验或33候选 Skill。没有引入 Pydantic Core 配置、SQLAlchemy 空模型、Redis、LangGraph 或 Subagent 编排器。没有因文档审计改业务实现。

<!-- END 09_DECISIONS.md -->


---

<!-- BEGIN 10_NEXT_AGENT_PROMPT.md -->

# 下一位 Coding Agent 启动 Prompt

你接手 `C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`，软件0.0.1。先读根 AGENTS.md、task-notes Skill、本包00/01/08/11和 docs/requirements.md。不要凭此快照覆盖后续代码。

1. 检查 Git branch/HEAD/status。审计时 main@06961eebe42674714dc2992b0a9de654b3a5a566，大量未提交迁移文件；不得 reset/clean/提交/推送/切换分支或恢复用户删除。比对 evidence/source-hashes.json 与实际工作树。
2. `.codegraph/` 存在则先 CodeGraph；query 精确路径，reference 也被索引。读取对应任务 note；本审计完成记录在 `.agent/archive/handoff-reconciliation.md`，宿主标准化的未完成验收在 `.agent/notes/backend-standardization.md`。
3. V3、Core/Status、FastMCP领域拆分、Python3.12、PrimeVue自带运行时已经实现，不重复迁移、不回退到V1。只1节点/1状态API/2Tools/0产品Skills。未来业务全部保留需求但尚未实现。
4. 默认独立 `.venv` Python3.12.15，共用根uv.lock；最低Python3.11，本机独立3.11.18测试也通过。宿主是 C:/ProgramData/anaconda3/python.exe 3.12.4、ComfyUI0.45.0、Frontend1.59.1、Torch2.3.0、NumPy1.26.4、Pillow10.3.0。不要在宿主 uv sync 或升级核心依赖。
5. 当前最高验收阻塞是宿主 main.py 导入 comfy_kitchen 时缺 torch.library.custom_op。若用户授权处理环境，先检查依赖兼容方案；否则明确阻塞，不改宿主。可在获准的独立可运行宿主验收。
6. 工作宿主可用后设 COMFYUI_TEST_URL，运行 `uv run pytest tests/integration -m host`；再手动验收画板绘图、保存、重新打开、中文、Preview Image真实输出。HTTP测试不包含工作流执行。重点调查上传错误响应及Canvas恢复缺口，修复需在后续代码任务范围内。
7. MCP只保留 version 与 connection_status。后者只调用 system_stats/object_info，不做版本握手，不请求Extension Status。任何后续协商扩展都保留旧返回Schema、错误行为、stdio stdout纯协议。
8. 按模块跑 `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q`、`uv run --project mcp pytest mcp/tests -q`、`pnpm -C frontend typecheck`、`pnpm -C frontend test`。打包/安装命令见07。未运行、Mock、真实HTTP和真实宿主必须分开报告。
9. 本轮发现的翻译键、HTTP错误响应、Ruff Hook版本差异已记录08，未修改应用源码。不要声称测试全覆盖这些风险。
10. 公共PyPI astrophoto-mcp0.0.1审计时404。没有发布授权不得Tag/推送/发布。源码 requirements=./mcp；正式发布用 release.py 暂存包，PyPI先于Registry；独立MCP进程需用户自己的环境升级/重启。

如后续任务是业务开发，先取得具体业务范围，从可验证的Service/API/Tool增量开始；不批量生成全部域或33个占位Skills，不修改reference。保持长期需求、实现事实、测试证据三者区分。完成后更新受影响文档和task-notes，输出实际结果及剩余风险。

<!-- END 10_NEXT_AGENT_PROMPT.md -->


---

<!-- BEGIN 11_RECONCILIATION.md -->

# 双向证据矩阵

历史文件缩写 H00–H09 对应原包数字前缀。C01–C15 是历史06冲突编号。行号相对仓库根；测试结果来自本轮07及evidence日志。VERIFIED仅限列明范围，不向宿主运行泛化。

## 历史 → 当前

| ID/历史陈述 | 当前结论与状态 | 文件/函数/API证据 | 测试或查询 | 修订/后续 |
| --- | --- | --- | --- | --- |
| C01/H00/06 已报告V3，旧稿V1 | VERIFIED 当前V3；旧稿OBSOLETE；真实加载IMPLEMENTED_UNVERIFIED | `__init__.py:11` AstroPhotoExtension、:23 entrypoint；`nodes/ComfyUIFEExampleVueBasic.py:6` | root22通过1跳过；host-start失败 | 不再依据用户报告判V3；以当前类/入口为证，保留宿主验收 |
| C02/H06 Directory/Catalog冲突 | VERIFIED Directory合法且条件接线；业务Skills PLANNED | `mcp/src/astrophoto_mcp/server.py:7,16,22` | 本地4.2签名导入及无效Skill测试 | Catalog也是官方选项，不要求替换工厂；修需求中唯一Catalog措辞 |
| C03/H03 Manager强制升级 | PARTIAL 发行同版pin；运行握手PLANNED，Manager实际安装UNKNOWN | `pyproject.toml:16`、`mcp/src/astrophoto_mcp/api/comfy.py:6` | 版本/打包通过，未跑Manager | 独立环境与已运行进程需单独升级/重启 |
| C04/H03 ./mcp发行冲突 | VERIFIED 暂存已修复 | `scripts/release.py:107` build_registry，:124写PyPI pin | Registry21文件、检查通过 | 源码继续本地依赖，不能根目录直接publish；PyPI404阻塞仍在 |
| C05/H03 uv.lock控制Manager | OBSOLETE 假设；VERIFIED workspace仅开发 | 根pyproject tool.uv.workspace/sources，根uv.lock | uv lock --check115包 | 不在宿主sync，不声称Manager消费uv.lock |
| C06/H03 3.13开发尚未迁移 | OBSOLETE；VERIFIED 默认3.12.15 | `.python-version:1`、`.venv/pyvenv.cfg`，旧备份cfg | dev版本与3.11/3.12测试日志 | 保留最低>=3.11，不重复迁环境 |
| C07/H03 PrimeVue需检查 | VERIFIED 独立初始化/打包；宿主兼容IMPLEMENTED_UNVERIFIED | `frontend/src/main.ts:24,29,31,35` | Chromium6、typecheck通过 | Vue/PrimeVue/Aura/i18n自带，类型peer例外单列 |
| C08/H05 工程完成度未知/owner限制 | VERIFIED 本地测试配置与执行；远程CI UNKNOWN | `.github/workflows/ci.yml` 无owner条件，release.yml顺序 | root22/MCP52/browser6，YAML审查 | 不保留“无测试/仍owner限制”说法；不能称云端CI已跑 |
| C09/H06 三DB创建时机 | VERIFIED 当前不创建；业务PLANNED | `astrophoto/core/paths.py:10`、config:19、capabilities:9 | core路径/无创建测试 | 默认根已实现；三库与目录初始化不在当前版本 |
| C10/H04 33Skills | PLANNED 候选33，当前0 | MCP源码清单、server:22条件 | resources空、包14文件无Skills | 保留完整候选表，不制造可执行Skill |
| C11/H06 Tool Search=Node Search | PLANNED 自有node_search，无实际Tool | `mcp/src/astrophoto_mcp/tools/status.py:11`仅两个 | list_tools精确集合断言 | ComfyUI节点发现未来基于object_info，不混淆MCP工具列表 |
| C12/H06 多用户认证 | PLANNED；当前缺此机制 | `astrophoto/api/status.py:9`状态返回；无身份服务 | 不存在用户隔离测试 | Future Assets/Memory上线前设计认证；当前不承诺远程安全边界 |
| C13/H06 prompt=画布 | OBSOLETE等价假设，Bridge PLANNED | 当前无canvas/broker/tool；官方routes | 本轮未运行prompt或CanvasBridge | 保留目标session/revision/receipt，不宣称能改当前图 |
| C14/H06 PNG=科学FITS | OBSOLETE外推，科学类型PLANNED | `nodes/ComfyUIFEExampleVueBasic.py:24`委托LoadImage | sentinel委托测试，不是真FITS/tensor | Astropy、科学引用类型及精度测试未来增量实现 |
| C15/H06 Tool visibility动态隐藏Python节点 | PLANNED可用性设计，非当前能力 | MCP单工厂；唯一节点列表 | 当前仅vue-basic | 不通过MCP visibility改变宿主注册；保持已保存节点类型 |
| H02 Core配置Pydantic示例 | OBSOLETE作为当前描述 | `astrophoto/core/config.py:12` frozen dataclass/tomllib | config测试通过 | 轻量标准库实现；Pydantic只作为未来Schema选型/间接依赖 |
| H02 service/api_version示例 | VERIFIED 实际extension/api_version/runtime/data_home/capabilities | `astrophoto/api/status.py:9` | 真实aiohttp TestClient两项 | 示例service不是现有响应；api_schema_version也是旧候选名 |
| H03 尚无typescript/vue-tsc，types1.22.1 | OBSOLETE | frontend/package.json与pnpm锁：TS5.9.3/vue-tsc3.3.14/types1.59.1 | 独立typecheck通过 | 保留Vite≠类型检查；tests不在vue-tsc范围 |
| H04 扁平MCP只有server/client | OBSOLETE 文件清单 | `config.py:11`、`api/comfy.py:6`、`tools/status.py:11` | MCP52 | 记录领域拆分已完成，不重复重构 |
| H05 当前标准化P0待做 | PARTIAL 整体验收；多项实现VERIFIED | Core/V3/Frontend/包文件与07 | 独立检查通过；宿主失败 | 下一轮先宿主验收/风险，不再按旧Prompt新建模块 |
| H03 Hatchling1.33.0 | UNKNOWN 本轮隔离构建精确版本 | mcp/pyproject build-system `>=1.27,<2`；uv.lock不含hatchling | uv build成功，无本轮精确版本输出 | 历史1.33.0仅历史观测，不能当当前锁版本 |

## 当前 → 历史遗漏

| ID/新增事实 | 状态 | 源码与证据 | 历史缺口/修订行动 |
| --- | --- | --- | --- |
| N01 路由在on_load组装，请求时查询节点注册 | VERIFIED 隔离 | `__init__.py:12`、status:10；host nodes.py:2329–2336静态源；HTTP测试 | 不能在on_load尚未get_node_list时标节点ready |
| N02 幂等注册/异主冲突/多server隔离 | VERIFIED | `astrophoto/api/routes.py:11`；integration两项 | 新增Runtime注入与错误边界说明，不靠全局bool |
| N03 unavailable能力与路径验证 | VERIFIED | capabilities:9；paths:15；root测试 | 精确列storage/assets/software/processing/knowledge/memory/experiments/canvas_bridge |
| N04 frontend构建固定宿主imports、CSS路径、onRemove | VERIFIED 构建/浏览器 | `frontend/vite.config.mts` output.paths；main:14,35；packaging URL测试 | 增补反代前缀与独立Vue生命周期 |
| N05 TouchEvent路径与真像素测试 | VERIFIED Chromium | DrawingBoard.vue触摸处理；DrawingApp.test.ts三例 | 历史仅泛称Canvas；现在测试使用真实浏览器API、宿主API仍mock |
| N06 outputSchema兼容与输入Schema小差异 | VERIFIED | `tools/status.py:12,19`、`mcp/tests/test_server.py:19`、fixtures/status_contract.json | 输出保持；输入移除title/禁多余字段，不能说字节级完全相同 |
| N07 raw stdio无噪声与legacy模式 | VERIFIED | `mcp/tests/test_server.py:93,108`；check_install.py:12 | 自动Client协商不一定是initialize；独立验证传统握手 |
| N08 真实host Torch阻塞 | VERIFIED 失败 | evidence/host-start.txt；host Python3.12.4，Torch metadata2.3.0 | 从“宿主待验证”升级为具体可复现失败，不能替用户升级 |
| N09 packaging防泄漏/临时Git暂存 | VERIFIED | release.py:70,81,107,135；packaging7通过 | 包含astrophoto，排除artifact/notes/db，pin在暂存改写 |
| N10 中文tooltip缺键 | VERIFIED | locales/zh/main.json；frontend-tests日志 | 新问题，写入风险，未改翻译代码 |
| N11 上传响应检查和Canvas恢复缺口 | PARTIAL/UNKNOWN | VueExampleComponent.vue:24,48,60；serialization两项测试 | 错误码/响应shape/重开测试不足，不能把上传mock成功写成全部通过 |
| N12 开发工具配置冲突 | CONFLICT | pre-commit Ruff0.4.9 vs uv0.17.5；pyproject mypy无CI | 文档补检查边界，源码/配置不在本次改动范围 |
| N13 需求文档内部V1/Python3.10残留 | OBSOLETE并已修订 | docs/requirements第7/8/9节；当前V3/metadata | 不只修历史包，也修仓库长期文档；所有长期FR保留 |
| N14 同宿主主版本但独立环境 | VERIFIED | dev-versions-api、host-versions、py311日志 | dev3.12.15不等于host3.12.4，同版本不是同环境 |

## 长期需求保全核对

H01 FR01→当前基础状态PARTIAL；FR02设备/资产/校准/地点→PLANNED；FR03软件/科学数据→PLANNED；FR04节点目录/Bridge/Workflow→PLANNED；FR05 RAG→PLANNED；FR06授权Memory→PLANNED；FR07实验/Subagent→PLANNED；FR08产品Skills→PLANNED。完整细节在02而非从当前状态章节删除。

H01六个验收故事（M31导入、Siril校准叠加、Agent画布、HOO偏好、知识问答、长周期Coding）分别保留为未来业务验收与已落地开发记录机制；不把开发task-notes当作Memory实现。H04的33个候选、L0/L1/L2、手工Skills安装后备方案均保留为设计。历史示例中的未实现函数、路径、DB表不纳入实际文件树。


## 教程示例与实际接口的额外区别

references中的 `database_path()`、`ensure_database_dir()`、`register_model_paths()`、`get_node_classes()` 都未实现；不能从教学代码推导当前可调用函数。实际 `data_home(environ=None)` 拒绝相对/空/空字节路径，不是示例的静默默认或 resolve()；实际 `register_routes(routes, runtime)` 需要显式注入，根入口在on_load调用而非import阶段调用。Skills讨论稿的无条件Provider创建被当前工厂的真实SKILL.md存在检查取代。上述为OBSOLETE示例/PLANNED能力，未新增同名占位接口。

<!-- END 11_RECONCILIATION.md -->


---

<!-- BEGIN 12_SOURCES.md -->

# 来源、定位与可信边界

## 本轮重新打开的官方资料

以本地已安装版本/API签名和实测为先；官网为滚动文档，不能代替当前宿主通过证据。

| 来源 | 本轮用途 |
| --- | --- |
| [ComfyUI V3](https://docs.comfy.org/custom-nodes/v3_migration) | V3入口/Schema/执行契约，另核本地0.45.0 loader |
| [ComfyUI routes](https://docs.comfy.org/development/comfyui-server/comms_routes) | 原生状态与object_info、prompt与画布职责 |
| [Registry publishing](https://docs.comfy.org/registry/publishing) | 官方打包机制；本地comfy-cli1.26.0实际构建 |
| [FastMCP Skills](https://gofastmcp.com/docs/servers/skills) | 4.2 Provider导入与Skill分发；本地4.2.0实际import |
| [FastMCP Testing](https://gofastmcp.com/docs/servers/testing) | 内存Client验证方式；项目用asyncio.run，不因此强加pytest-asyncio |
| [FastMCP Client](https://gofastmcp.com/docs/clients/client) | 内存与stdio调用，实际legacy参数以本地签名和测试为准 |
| [uv workspace](https://docs.astral.sh/uv/concepts/projects/workspaces/) | 共享lock、本地member、Python交集，不等于Host环境 |
| [Frontend1.59.1迁移](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md) | 对应Tag的PrimeVue迁移资料；本次网页呈现主要为GitHub页框架，不据此声称完整文档抓取或宿主UI验证 |

本地签名原样记录在 `evidence/dev-versions-api.txt`：FastMCP构造含on_duplicate，Client含mode/auto_initialize，SkillsDirectoryProvider(roots, reload=False)，run含transport/show_banner。4.2.0的Requires-Python实际为>=3.11。

宿主定位：`C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/comfyui_version.py:3`为0.45.0；host `nodes.py:2316`开始V3入口分支，:2329 on_load、:2330 get_node_list、:2336 GET_SCHEMA；host `server.py:774` system_stats、:905 object_info/{node_class}。节点缺失返回200空对象，而非项目自行假定404。

## 原始资料审计方式

原包00/06先读，随后01/02/03/04/05及07/08/09/MANIFEST；原包明确不是仓库审计，不能把其中用户报告判定为已测事实。references中的旧V1、Skill Catalog示例、Pydantic配置和三DB示意只作历史/规划对照。原文件哈希留存，本轮未修改。新的完整需求取自审计修订后的仓库需求，而不是无检查复制旧交接。

本包不声称独立验证所有未来技术（SQLAlchemy、Astropy、LangChain、sqlite-vec、Siril/PixInsight）。对应接口/许可证/ABI仍需实施时核验。项目内CodeGraph数据库、第三方reference、开发技能不能作为业务功能已经存在的证明。

## 证据可复现性

`evidence/repository-files.txt`为开发项目文件清单（排除reference历史包和生成/忽略环境），`source-hashes.json`覆盖非文档配置/源码/测试；`git-before.txt`保留既有工作树状态，`git-after.txt`用于交付对照。测试日志按命令分类，失败与跳过不删除。

历史Hatchling1.33.0、SDK1.30旧Client与宿主3.12.4隔离安装来自先前记录；本轮未重跑这些精确场景。不能用本轮3.12.15 wheel安装替代宿主环境包兼容证明。当前开发/安装依赖版本已查询，不应沿用历史表格而不核对。

<!-- END 12_SOURCES.md -->


---

<!-- BEGIN CHANGELOG.md -->

# 本次校准变更

本轮没有新增/修改应用源码、测试实现、依赖、CI或宿主配置。构建检查会重生成 js 与 dist；源码哈希检查用于检测审计期间意外漂移。

- 完整核对历史00–09的当前状态、目标目录、版本、工具/Skill、ADR和验收要求，原件不修改；原件哈希与工作树清单留证。
- `docs/requirements.md`：修正残留V1表格/根入口注释、Python>=3.10、唯一Catalog Provider描述、数据库示意路径；明确版本握手为计划、真实字段api_version；保留全部FR及33候选Skills。
- `docs/architecture.md`：区分locales打包与真实宿主发现；补当前dataclass配置、无业务Service、能力字段等实际边界。
- `docs/development.md`：补本轮3.12/3.11测试数量、宿主重现失败、警告与检查范围，记录Ruff Hook差异及mypy未启用。
- `docs/mcp.md`：明确本轮与先前SDK1.30/3.12.4隔离安装记录；无运行时握手、无产品Skills、无第二Web服务；间接Uvicorn不等于项目启用它。
- `docs/publishing.md`：补实际包清单/安装/404、Manager与外部环境边界、Hatchling隔离构建版本未锁死、远程流程未运行。
- AGENTS.md 当前规则准确，未为任务日志修改。原始 `.artifact/` 和 `reference/` 原样保留。
- 新增本包索引、主题文档、双向矩阵、证据日志、FULL与ZIP；task-notes完成后归档。

新增发现不等于本轮新实现：Core/Status、V3、Python3.12、前端自带依赖与typecheck、FastMCP模块化和打包修复均已在审计开始前存在。本轮贡献是证据校准和文档纠错。

<!-- END CHANGELOG.md -->
