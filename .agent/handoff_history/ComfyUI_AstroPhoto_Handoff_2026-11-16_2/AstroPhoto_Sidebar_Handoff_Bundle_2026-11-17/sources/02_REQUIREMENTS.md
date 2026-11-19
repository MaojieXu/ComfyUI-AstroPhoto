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
