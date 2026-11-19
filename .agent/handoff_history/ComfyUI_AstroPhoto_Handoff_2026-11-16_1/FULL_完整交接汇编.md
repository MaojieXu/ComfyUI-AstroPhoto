# ComfyUI_AstroPhoto｜完整交接汇编

> 本文件为 `00`–`09` 十篇 Markdown 合订版；各篇正文拥有独立文件。
> 需求/设计与已实现状态严格区分；过时的 V1 示例在冲突日志中纠正。
> 汇编日期：2026-11-16；不代表对 Windows 仓库的独立代码审计。


---

<!-- BEGIN 00_README_交接索引.md -->

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


<!-- END 00_README_交接索引.md -->


---

<!-- BEGIN 01_产品需求与范围.md -->

# 01｜产品需求、用户故事与验收范围

> **文档用途**：告诉接任 Agent“最终要做什么，以及目前还没有做什么”。不代表所有模块应立即实现。

## 1. 项目目标与产品体验

ComfyUI_AstroPhoto（也出现过 AstroPhotoFlow 的历史项目命名，但当前讨论以 **ComfyUI_AstroPhoto** 为准）是一个 local-first 天文影像工作台，建立在 ComfyUI 的节点/画布/运行环境上，向人类和外部 AI Agent 同时提供：

- 对本地深空/行星摄影图片、视频、FITS、校准帧与设备资料的可搜索管理。
- 对成熟天文软件（首先 Siril，之后 PixInsight）的能力检测、路径配置和受控节点封装。
- 可视化工作流构建、执行、查看结果、节点检索和远程画布受控操作。
- 来源可信的天文图像处理知识检索（RAG），避免将检索结果伪装成无需核验的自动推理。
- 存在 Extension 内部的用户长期记忆，保存授权行为、偏好、设备、环境和经验，与外部 Agent 记忆无关。
- 外部 Agent 借助 FastMCP Tools 和可分发 Skills 执行流程、调优节点、复现实验。

**非目标**：重写 Siril/PixInsight 算法、替代 ComfyUI 的执行队列和撤销系统、部署第二套后端框架、把所有图像转为 PNG、自动安装第三方付费软件、无授权监控用户所有行为、在 MCP 内开发一个独立多 Agent Harness。

## 2. 功能状态词汇

- **已报告存在 / reported**：来自用户描述、文件树或自述验证，未在本次交接复核源码。
- **已验证 / verified**：只有后续 Agent 能给出源码位置与通过的测试/操作记录才可用。
- **目标 / planned**：需求或建议，现阶段不得在 CLI、Capabilities、Skills 中标记为功能完成。
- **可选 / optional**：按平台兼容性和用户需求增加；不强制安装。

### 当前已报告存在（0.0.1）

Vue 画板 Widget、V3 `vue-basic` 节点、`CUSTOM_VUE_COMPONENT_BASIC`、本地图像上传到 ComfyUI 和 IMAGE 输出；MCP `version` + `connection_status` + stdio CLI/ComfyUI HTTP 诊断；测试/构建/CI 基础文件；目前业务端可能仍只有示例节点。是否已通过完整真实宿主端到端测试未知。

## 3. FR-01 系统状态与能力发现

**目标体验**：安装和连接后，用户与 Agent 能明确知道 Extension 是否装好、ComfyUI 是否在线、MCP 是否匹配、哪些业务域真正可用。

必需能力：

- 诊断 ComfyUI `/system_stats`、`/object_info/vue-basic`，识别“宿主连接成功但节点不存在”的情况。
- 向 Extension 业务 API 提供版本、API Schema、实例身份、软件可用性、Backend Service 就绪、前端 Canvas Bridge 在线情况。
- `capabilities` 提供每项 capability 的 `enabled/status/reason/version`，例如 `assets.read`, `software.siril.background`, `canvas.edit`, `knowledge.search`。
- 在版本不匹配、软件缺失、权限不足、前端不在线时提供结构化错误，不假装成功。

**验收**：只安装当前 0.0.1 时，状态 API 不应把尚不存在的 Assets、Memory、RAG 标成 ready；MCP 旧工具的名称与返回契约保持兼容。

## 4. FR-02 Equipment / Assets / Calibrations / Sites

### 设备与光学系统

管理 Camera、Telescope、Reducer/Flattener、Filter、Filter Wheel、Mount、Guide Camera 等设备；支持 Optical Train（可复用光学链路）、默认使用设备、硬件属性和设备组合历史。

### 资产

支持选择性目录扫描、导入与索引：

- Light、Dark、Flat、Bias、Dark Flat；Master Calibration 也要建模。
- FITS（包括多 HDU 与 Header）、TIFF、PNG/JPEG；SER、XISF、RAW、视频通过可验证适配器逐项支持，不预先宣称完整无损支持。
- 以 `CaptureSession`、Target、Equipment、Optical Train、Filter 等组织；读取曝光、Gain、Offset、温度、Binning、分辨率、拍摄时间等元数据。
- 元数据值应标识 `observed / inferred / user_confirmed`，允许修复、重新定位缺失文件，原始 Header 不被静默覆盖。
- 文件系统是大文件真实存储，SQLite 保存路径、指纹、元数据、索引；默认不复制、不重写源资产。
- 重复导入尽可能幂等（文件标识、必要时内容指纹），不盲目重复入库。

### 校准场匹配

需要基于相机/模式、Gain、Offset、温度、曝光、滤镜、Binning、光学路径和 Master 适用性进行可解释筛选。结果为候选、分数或匹配等级、匹配依据、数据缺失项、待人工确认项。不能仅凭文件名或一次推断自动绑定错误校准场。

### 观测地与光污染

用户自愿提供常用地点（可不提供精确经纬度）；保存时区、海拔（可选）、光污染数据来源、年份、估算/实测类别。VIIRS 辐亮度、模型 SQM、Bortle 粗分类和现场测量应分别记录，不能当同一个数。查询外部地图或光污染服务前明示上传坐标风险与费用/许可。

**验收**：导入真实样本可分类、追溯、去重且源文件未变；有缺失字段时标记未知；设备与校准匹配返回可解释信息；数据库变动由 Service 负责。

## 5. FR-03 Software Registry / Drivers / Nodes

软件适配首批 Siril，随后 PixInsight，后续可能涉及行星摄影软件。实现路径：

1. 自动检测常见安装位置和 PATH 等**候选**；UI 或 Agent 可提交候选软件路径。
2. Extension Backend 验证路径、文件签名/版本（视软件）、受支持 CLI 或脚本接口、许可约束、可用子能力。
3. 后端保存受验证配置，公开 Capability Catalog；未验证路径不可用于执行。
4. Node ID、Schema 和输入输出事先稳定注册；软件缺失时在 AstroPhoto 自有节点目录隐藏/标记不可用，现有工作流中的相同节点类型仍可识别，运行时返回准确错误。
5. 软件被新安装后更新 Capability，不假设可在不重新加载 Python Node 注册表时新增全新的 Node 类型。

Siril 使用实际版本的 `siril-cli` / Script；PixInsight 使用实际支持的 PJSR/脚本调用机制，**不能虚构兼容的 CLI 参数**。软件执行由 `Software Registry + Runner + Adapter` 管理单操作进程、工作目录、超时、取消、退出码、日志；ComfyUI 负责整个 DAG 的调度。

### 专业科学数据

ComfyUI `IMAGE` 是可视化/常规处理契约；FITS、TIFF 高位深、序列、视频需要专用引用型对象/数据类型，包含文件引用、元数据、校验与格式声明。计划中的 `ASTRO_ASSET`、`ASTRO_FRAME` 等名称只是候选；具体类型和缓存/序列化细节须原型测试。**PNG 不能被当作所有科学数据的无损中间格式**。

**验收**：软件路径经验证后才启用操作；运行在隔离工作目录；正确报告错误；不改原始文件；Node 变更检测考虑外部文件内容变化。

## 6. FR-04 Canvas / Workflow / Node Catalog

### Node Catalog

`node_search` 按意图、软件、输入输出类型、参数名、可用性检索 ComfyUI 节点；`node_describe` 返回实际 Schema、示例和约束。通常一个天文处理操作是一个 ComfyUI Node，而**不是**一个 MCP Tool。

### Canvas Bridge

MCP 的 `canvas_apply` 经 Extension Backend 的 Broker 将受控命令送到真实在线 ComfyUI Frontend；画布状态、Undo、保存仍属前端。请求和回执建议包含 `request_id`、`canvas_session_id`、`graph_revision`、操作列表、成功/失败详情。多浏览器标签必须避免错改；离线返回 `CANVAS_UNAVAILABLE`，冲突返回 `GRAPH_CONFLICT`，不得伪成功。

### 工作流执行

`/prompt` 用于提交 API workflow /运行快照，`/ws`、`/history/{prompt_id}` 用于状态及结果；不要将“成功执行提交”冒充“已编辑当前打开的画布”。支持取消/恢复能力须以宿主实际接口和用例验证。

**验收**：在线画布真实修改并可回执和撤销；离线/冲突明确失败；独立运行工作流返回 `prompt_id` 和结果，而不改变用户打开的图。

## 7. FR-05 Knowledge Base / RAG

基于 Siril、PixInsight 官方文档与许可允许的第三方教程。LangChain 负责 Loader、清洗、分块与 Retrieval Pipeline；初期 SQLite FTS5 全文检索，中英双语命令检索需测试 tokenizer。可选 sqlite-vec + 本地 ONNX/FastEmbed 做向量检索、Reranker 后置；ComfyUI 模型路径管理 AI 模型文件，AstroPhoto 验证多文件模型完整性与加载。

数据需有 source URL、标题、章节、软件版本/发布日期、许可、文本指纹、chunk ID；查询返回引用和有限摘录，而非无来源回答。知识索引可从合规源文件重建。用户使用时不需要 Extension 运行独立 LLM；答案综合由外部 Agent 完成。

**验收**：无 Embedding 模型时 FTS5 仍可检索；结果可追溯官方文档；无来源时明确说明。

## 8. FR-06 User Memory / Personalization

**Memory 是 Extension 提供给所有 Agent 的用户认知能力，不是 task-notes，也不是某一 Agent Harness 的私有记忆。**

用户相关信息分三种事实来源：

- **业务事实**：设备、观测地、资产、光污染等属于 `assets.db`，Memory 保存关联 ID 和解释，不复制权威数据。
- **操作证据**：会话、重要操作、完成/失败试验、人工评价等属于 `memory.db` 的 Event Log。必须区分 actor=`human|agent|system`，防止把 Agent 盲试参数推断成用户喜好。
- **长期记忆**：显式设置、图像审美偏好（饱和度、对比度、星点、背景、窄带调色等）、常用参数范围、被确认的成功策略、适用条件和证据链。

记忆流程 `Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh/Expire → Forget`；自动提炼先用规则/显式反馈，后续可引入 LLM 但不应强制依赖。推断记忆包含场景范围、confidence、source/evidence、last_verified；支持覆盖/修正/导出/删除。

建议行为日志明确授权后记录，而不是默认监听所有鼠标移动或敏感路径；明确记录目的与保留期（例如 30 天可配置是建议值，不是官方规定）。多用户时按真实认证身份隔离，不能信任任意客户端填入的 profile ID。观测地精确位置不得未经确认上传第三方。

**验收**：未授权没有行为日志；明确 feedback 形成可查看偏好；同一用户在不同 Agent 下可用；删除后不再召回；多用户不会串库。

## 9. FR-07 Experiments / Optimization

外部主 Agent 可以委托 Subagent 做单 Node 或局部 Workflow 参数循环：固定输入/预处理结果，声明搜索范围/目标指标/预算/停止条件 → `workflow_run` → 读取结果 → 评分/反馈 → 下一 Trial。实验要有 `experiment_id`、`trial_id`、`prompt_id`、Node Schema/版本、软件版本、Workflow Snapshot/Hash、输入/输出 Asset IDs、参数、指标、耗时、失败原因与人工偏好。

科学量化指标（SNR、FWHM、背景梯度等）与用户审美偏好是不同评价通道；不能假设同一分数代表“最好看”。外部 Harness 决定 Subagent 策略，Extension 负责执行记录、试验结果与可复现性。

**验收**：次数/资源预算有限、取消有效、原始数据不改、每轮可追踪、最佳选择可由人工覆写。

## 10. FR-08 Agent Skills（操作流程）

Tools = 能做什么；Skills = 按什么流程做；Knowledge = 专业依据；Memory = 用户上下文；Workflow = 真实执行图。

业务 Skills 必须使用 Agent Skills 标准 `SKILL.md`，位于 MCP 包内并随 Wheel 发行，不放在开发用 `.agents/skills/task-notes/`。首批候选 33 个，详见 `04_MCP_Tools_Skills_知识库_记忆.md`。Skill 可以进行条件分支、验证、异常恢复，但不得直接访问 SQLite、未授权 Shell、绕过 Canvas Bridge。它必须验证所需 Tools/Capabilities 真实可用，避免发布不可用工作流。

支持 MCP Skills Provider 分发和用户选择的本地 Agent 目录安装两种策略；自动远程发现依赖 Agent Host 支持，不能保证所有 Codex/Claude/OpenCode 客户端相同。

**验收**：Skill 内容、引用资源、依赖 Tool、Wheel 文件均通过测试，只有可执行 Skill 才能标记为 ready。

## 11. 当前优先顺序（非“全部立即开发”）

优先解决 Node V3 入口与 Core Status API → Asset/Equipment/Calibration → Software/Siril Node → Canvas/Workflow/Experiments → Knowledge FTS5 → 显式 Memory/授权行为记录 → Agent Skills 增量发布。Skill 可在其所依赖 Tools 完成后逐个上线；无须等所有 33 个全部完成。可以尽早设计 Memory 的事件契约，但先别做不可解释的自动审美推断。

## 12. 建议的端到端验收故事

- **导入 M31**：选择目录→扫描 FITS→分类/去重→确认设备→校准候选→原文件未改→结果可被查询。
- **Siril 校准叠加**：确认软件可用→Node Search→组装 workflow→运行/追踪→保存 FITS→科学数据精度和来源可追溯。
- **Agent 修改画布**：目标 Tab 在线→提交增删节点和连线→校验 Undo/保存→真实回执；离线时安全失败。
- **HOO 星云个性化**：用户授权→读取场景性偏好→对比 Trial→采纳/纠正→更新记忆证据。
- **知识问答**：查询 Siril 校准规则→官方出处与章节返回→Agent 引用资料，不能凭空编造参数。
- **长周期 Coding Agent**：读取 AGENTS.md→task-notes→基于真实源码继续工作→更新验证证据→交接。


<!-- END 01_产品需求与范围.md -->


---

<!-- BEGIN 02_架构与文件组织.md -->

# 02｜系统架构、文件组织、依赖方向与运行路径

> **架构决策**：ComfyUI Native Extension + Domain-first Modular Monolith + thin V3 Nodes + independent PyPI FastMCP。文件树是**目标归属**，并非已检验的磁盘列表。

## 1. 架构总图

```text
人类用户                                      外部 Agent / Subagent
    │                                               │
ComfyUI Frontend                                MCP 客户端
    │                                               │ stdio
Vue/TS Extension                            astrophoto-mcp (PyPI)
    │                                         Tools / Skills / HTTPX
    │                                               │
    ├──────────── HTTP / WebSocket ───────────────────┤
    ▼                                               ▼
ComfyUI PromptServer / 原生 API               AstroPhoto HTTP API
├─ /prompt：提交工作流                          ├─ /astrophoto/v1/status
├─ /object_info：节点 Schema                   ├─ /astrophoto/v1/assets/*
├─ /ws /history：运行状态                      ├─ /astrophoto/v1/software/*
├─ 原生 Canvas / Undo / Save                   ├─ /astrophoto/v1/memory/*
├─ ComfyUI V3 Node 注册/执行                   ├─ ...
└─ folder_paths 模型目录                      └─ Canvas Broker / Receipts
     │                                               │
     │ 执行 Node                                     │调用
     ▼                                               ▼
  nodes/*.py ───────────────────────► astrophoto/<domain>/service.py
                                                  │
                                          Repository / Adapter
                                                  │
                            ~/.astrophoto/ SQLite、文件、Siril/PixInsight
```

**直接 Python 调用**：在 ComfyUI 进程内，Node 可以直接调用同 Extension 的 Service（无须再绕 HTTP）；HTTP 只负责外部 MCP 与 UI 的受控入口。执行顺序由 ComfyUI Runtime 决定，不由 `Software Runner` 复刻一个 DAG 引擎。

## 2. 文件结构：仓库层

```text
ComfyUI_AstroPhoto/
├── AGENTS.md                       # Coding Agent 高优先级规则/索引
├── README.md
├── LICENSE                        # 用户报告 GPL-3.0-only（需实际文件核验）
├── __init__.py                    # ComfyUI V3 comfy_entrypoint + WEB_DIRECTORY + 轻注册
├── pyproject.toml                 # Extension/Registry 元数据 + uv Workspace
├── requirements.txt               # Git/Manager 安装运行依赖：当前有 ./mcp 风险
├── uv.lock                        # 仅开发/CI 锁文件
├── .python-version                # 目标新增：开发默认 Python 3.12
├── .comfyignore                   # Registry 归档排除规则
├── .gitignore
├── .editorconfig
├── .pre-commit-config.yaml
│
├── nodes/                         # ComfyUI V3 Nodes（Node Schema、execute、I/O）
│   ├── __init__.py
│   ├── ComfyUIFEExampleVueBasic.py # 已有且须保持 ID
│   ├── siril/                     # 未来按能力增加 V3 Node
│   └── pixinsight/                # 未来
│
├── astrophoto/                    # 目标新增：Extension Domain Backend
├── frontend/                     # Vue/TS 源码、Widget/工作台、独立测试
├── js/                           # 当前 Vite 构建输出，WEB_DIRECTORY 指向它
├── locales/                      # ComfyUI 主机加载的翻译：en/zh
├── mcp/                          # 独立 PyPI 项目，Registry 归档应排除
├── tests/                        # Extension Python + packaging + 未来 integration
├── scripts/                      # release.py、check_install.py 等
├── docs/                         # requirements / architecture / development / mcp / publishing
├── .github/workflows/            # ci.yml / release.yml
├── .agents/skills/               # 开发 Agent 技能：task-notes、ComfyUI 节点开发
├── .agent/notes/                 # 当前开发任务工作记忆
├── .agent/archive/               # 已完成任务历史
├── .codegraph/                   # 有索引则优先用；不请求不创建
├── reference/                    # 上游模板及 deepseek-harness：不直接运行/发行
└── dist/                         # 生成产物与隔离验证环境：通常 Git/Registry 排除
```

**Node 特别事项**：早期文件名和需求草稿中出现 V1 注册方式；用户的**最终确认是 V3**。例如 `nodes/ComfyUIFEExampleVueBasic.py` 的文件名不会决定它是不是 V1；必须检查其类继承、Schema 和根入口。不要把原文件改名、改变 `vue-basic` 或 Widget ID 只为追求样式一致。

## 3. `astrophoto/`：推荐的后端最终目标结构

遵守**按业务域纵向划分，域内轻量分层**的模块化单体。不要用一个巨大 `models/`/`services/`/`repositories/` 目录散落所有业务。

```text
astrophoto/
├── __init__.py
├── bootstrap.py                   # 轻量服务工厂、生命周期、依赖组装
│
├── core/                          # 全局最少量的共用机制
│   ├── __init__.py
│   ├── paths.py                   # ASTROPHOTO_HOME、数据库/运行产物路径
│   ├── config.py                  # 环境/用户配置（Pydantic）
│   ├── errors.py                  # 统一的错误类型/码
│   ├── capabilities.py            # 真正可运行的能力目录
│   └── model_paths.py             # 可选；ComfyUI folder_paths 注册
│
├── api/                           # PromptServer.instance.routes/aiohttp
│   ├── __init__.py
│   ├── routes.py                  # 注册入口，避免重复注册
│   ├── status.py                  # 先实现真实状态 API
│   ├── assets.py                  # 未来：API Adapter，不写业务 SQL
│   ├── software.py                # 未来
│   ├── knowledge.py               # 未来
│   ├── memory.py                  # 未来
│   ├── experiments.py             # 未来
│   └── canvas.py                  # 未来：前端 Bridge Broker HTTP/WS
│
├── storage/                       # 实现有持久化功能后再创建
│   ├── __init__.py
│   ├── sqlite.py                 # Engine/Session factory，事务模板
│   └── migrations/              # Alembic，多库迁移策略需验证
│
├── assets/                        # 设备/资产/校准/观测地
│   ├── models.py                 # SQLAlchemy ORM
│   ├── schemas.py                # Pydantic 请求/输出
│   ├── service.py                # 业务用例/事务边界
│   ├── repository.py             # 查询复杂后再引入
│   ├── metadata.py               # FITS Header/文件元数据
│   └── calibration.py            # 校准场可解释匹配算法
│
├── software/                      # 本地软件检测/验证/执行
│   ├── service.py
│   ├── registry.py               # 安装路径、版本、Capabilities
│   ├── runner.py                 # 进程、超时、取消、日志、资源锁
│   └── adapters/
│       ├── base.py               # 单次 Operation 的参数/结果契约
│       ├── siril.py              # 真实 siril-cli/script 适配
│       └── pixinsight.py         # 真实 PJSR/脚本接口适配
│
├── processing/                    # 科学图像数据类型及格式转换
│   ├── types.py                  # 数据引用、精度及 Header 规范
│   ├── fits.py                   # Astropy FITS I/O
│   └── conversion.py             # 到普通 IMAGE 的显式转换
│
├── knowledge/                     # LangChain + FTS5 + 可选向量索引
│   ├── service.py
│   ├── ingestion.py
│   ├── indexing.py
│   └── retrieval.py
│
├── memory/                        # Extension 内用户记忆
│   ├── models.py
│   ├── service.py
│   ├── events.py
│   ├── consolidation.py
│   └── retrieval.py
│
├── experiments/                   # Agent/Subagent 参数试验
│   ├── models.py
│   ├── service.py
│   └── metrics.py
│
└── canvas/                        # 控制在线 ComfyUI Frontend
    └── broker.py                 # 目标画布、命令、revision、ack/receipt
```

> **重要**：上表是长期模块归属和文件命名参考，不是“立即 mkdir 全部”的指令。P0 只实现拥有真实调用方的 `core`、`api/status`、轻量 `bootstrap`，并保持全部 V3 节点可加载。

## 4. 各层职责与禁止依赖

| 层 | 可以做 | 不可以做 |
|---|---|---|
| `nodes/` | V3 Schema、数据 I/O、调用 Service、NodeOutput | 在每个 Node 内写 SQL、寻找安装路径、构建 Shell、独立执行调度器 |
| `frontend/` | Vue Widget、Sidebar/Settings、表单状态、Canvas Bridge | 直接接触数据库文件、复制 ComfyUI 全局图状态 |
| `astrophoto/core/` | 配置/路径/错误/Capabilities | 随意塞入所有领域逻辑、运行重模型 |
| `astrophoto/api/` | aiohttp 路由、Pydantic 验证、授权、调用服务 | 直接实现业务算法、长时间阻塞事件循环 |
| `astrophoto/<domain>/service.py` | 用例/业务规则/事务边界 | import MCP、前端组件或 Node 类 |
| `astrophoto/storage` | Engine/Session/Migration | 跨业务强制所有 DB 共用单事务 |
| `astrophoto/software/adapters` | 已批准的命令/脚本模板 | 接受外部用户的自由 shell 字符串 |
| `mcp/` | FastMCP Protocol、Tools、Skills、HTTPX API Client | 直接 import ComfyUI 内部模块、访问 SQLite、执行 Siril |

推荐依赖方向：`Node` 或 `HTTP API` → `Service` → `Repository/Adapter` → `Database/External Software`。必要时纯业务规则与 Service 分开；不要强制全工程引入庞大 DDD 基础设施。

## 5. V3 Node API 最重要的具体契约

官方 **ComfyUI V3** 文档：<https://docs.comfy.org/custom-nodes/v3_migration>。

- 根插件入口为 `comfy_entrypoint()`，返回 `ComfyExtension`。
- `get_node_list()` 应为 `async def`，返回 `io.ComfyNode` 子类列表。
- Node `define_schema()` 返回 `io.Schema`，包含 `node_id`、`display_name`、`inputs`、`outputs`。
- `execute()` 是类方法，返回 `io.NodeOutput`；外部文件缓存可研究 `fingerprint_inputs()`。
- `WEB_DIRECTORY = "./js"` 仍由 Extension 入口发布前端资源。
- 不把旧 V1 `INPUT_TYPES`/`FUNCTION`/`NODE_CLASS_MAPPINGS` 重新加入主节点开发标准。

**教学性最小示例**（不应直接替代仓库中真实代码）：

```python
from comfy_api.latest import ComfyExtension, io

class PassImage(io.ComfyNode):
    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="AstroPhoto_PassImage_Example",
            display_name="Pass Image",
            category="AstroPhoto/Examples",
            inputs=[io.Image.Input("image")],
            outputs=[io.Image.Output()],
        )

    @classmethod
    def execute(cls, image) -> io.NodeOutput:
        return io.NodeOutput(image)

class AstroPhotoExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [PassImage]

async def comfy_entrypoint() -> ComfyExtension:
    return AstroPhotoExtension()
```

`ComfyUI` 原有 `vue-basic` 是正式回归目标，新 Agent **不得**把上面的 `PassImage` 示例当成已存在 Node 注册。

## 6. ComfyUI HTTP API 与轻量后端接入

官方原生 Server 路由：<https://docs.comfy.org/development/comfyui-server/comms_routes>。

```python
# 概念示例：仅在 ComfyUI PromptServer 可用后执行注册
from aiohttp import web
from server import PromptServer

@PromptServer.instance.routes.get("/astrophoto/v1/status")
async def status_handler(_request: web.Request) -> web.Response:
    return web.json_response({
        "service": "astrophoto",
        "api_version": "v1",
        "status": "ok",
        "capabilities": {"assets": False, "software": False,
                         "knowledge": False, "memory": False,
                         "canvas_bridge": False, "experiments": False},
    })
```

实际项目应隔离纯 `status_payload()` 与可注入 `register_routes(routes=...)` 以便测试；路由只注册一次。插件加载期间**不进行大文件扫描、数据库迁移、远程下载、Siril/PixInsight 探测或模型推理**。确保未实现能力始终为 unavailable。

前端调用 API 推荐复用 ComfyUI 提供的 `api.fetchApi()`（适配反代路径和主机配置），而非在 Vue 源码中写死 127.0.0.1:8188；后端 API 版本与软件 SemVer 是两套独立版本。

## 7. 示例：Node 到软件 Adapter 的调用链

```text
ComfyUI 运行一个 SirilBackground V3 Node
    → nodes/siril/background.py: execute(...)
    → astrophoto/software/service.py: run_background_extraction(...)
    → registry.py: 已验证的 Siril 可执行文件 + 软件版本/能力
    → adapters/siril.py: 将受限参数映射为真实 Siril 脚本/命令
    → runner.py: 创建 run_id/工作目录，启动、等待/取消、捕获日志
    → Siril 处理输出文件/错误
    → service 返回结构化结果
    → Node 转为 ComfyUI V3 io.NodeOutput
```

Node 与 Adapter 的边界不等同于“每个节点各自写一个 subprocess”。Runner 不负责跨 Node DAG 调度。外部命令使用参数数组和 `shell=False`；Windows 子进程树取消需专项测试；原始数据仅作为只读输入，产物写到 `~/.astrophoto/runs/<run-id>/`。

## 8. 前端标准：Vue 及 ComfyUI Host

**当前文件**（用户报告）：

```text
frontend/src/main.ts
frontend/src/components/
  VueExampleComponent.vue  # 自定义 Widget/缓存/serializeValue
  DrawingApp.vue
  DrawingBoard.vue
  ToolBar.vue
frontend/tests/components/DrawingApp.test.ts
frontend/tests/widgets/{registration,serialization}.test.ts
frontend/tests/{setup,host}.ts
js/main.js + js/assets/main.css
locales/{en,zh}/main.json
```

未来可以在 `frontend/src/features/{assets,software,knowledge,memory,experiments}/` 下组织页面、在 `frontend/src/bridge/` 放 Canvas 命令桥接，但现在不需要移动已有画板以符合新树。

ComfyUI 原生提供 Sidebar、Settings、Dialog、Toast、Commands 等前端扩展接口，应优先复用。当前前端宿主 1.59.1 不保证提供 PrimeVue 插件/主题，**使用 PrimeVue 4.3.3 必须扩展自己打包和初始化**。不要混淆宿主提供 Vue 运行时和宿主提供 PrimeVue。

## 9. 导入、科学数据、数据库位置

项目不应把实际 `.db`、FITS、视频、缩略图、日志放在 Git 仓库中。

```text
~/.astrophoto/
├── config/settings.json
├── config/software.json
├── databases/assets.db
├── databases/knowledge.db
├── databases/memory.db
├── knowledge/sources/
├── cache/thumbnails/
├── cache/previews/
├── runs/<run-id>/
└── logs/
```

由 `ASTROPHOTO_HOME` 或后续显式配置覆盖默认路径。导入 Python 模块不能创建用户目录；确实执行初始化/导入时再创建。ComfyUI 的 AI 模型目录通过 `folder_paths` 注册专用的 `astrophoto_embedding` / `astrophoto_reranker`，不要混用 ComfyUI `models/embeddings` 的 Textual Inversion 语义。实际模型目录不受 Git 管理。

数据库职责：

- `assets.db`：Equipment、Optical Train、Observing Site、Asset、Frame、Calibration Link、以及与 Asset 相关的运行事实。
- `knowledge.db`：文档/Chunk/FTS5/可选向量索引，索引可重建。
- `memory.db`：profile、session、activity events、feedback、explicit/inferred memories、consent。

SQLAlchemy 2 使用短生命周期 Session / `sessionmaker.begin()`；Session 不跨线程或并发任务共享。aiohttp 异步 Handler 不应直接阻塞在大型 FITS 读取或同步 ORM 操作；可在线程中创建/关闭自己的 Session。存储迁移使用 Alembic，外部运行中不持有长 SQLite 写事务。

## 10. “目录约束已固定”与“马上创建文件”的区别

**现在可落地的最小 `astrophoto/` 骨架**：

```text
astrophoto/
├── __init__.py
├── bootstrap.py               # 仅有真实组装需求时引入
├── core/
│   ├── paths.py
│   ├── config.py
│   ├── errors.py
│   └── capabilities.py
└── api/
    ├── routes.py
    └── status.py
```

`astrophoto/storage/` 等领域目录属于约定的将来位置，只有真实 Service/ORM/Adapter 使用时才建。目标文件结构不能替代测试与调用链证据。


<!-- END 02_架构与文件组织.md -->


---

<!-- BEGIN 03_技术栈_环境_依赖_发行.md -->

# 03｜已报告版本、技术栈、运行环境、依赖与发行

> **版本时间戳**：2026-11-16 20:43（用户给出的本机配置核查摘要）。这里的版本均为**用户报告**，不是本次容器对其 Windows 计算机的重新读取。安装/升级前先检查真实 `pyproject.toml`、`uv.lock`、`package.json`、Python 解释器以及 `git status`。

## 1. 当前环境：精确版本清单

### Python 与 MCP

| 组件 | 已报告安装/锁定 | 已报告项目要求/注释 |
|---|---:|---|
| Extension 软件版本 | `0.0.1` | 与 MCP 同步 |
| MCP 软件版本 | `0.0.1` | 与 Extension 同步 |
| 开发 `.venv` Python | **3.13.15** | 计划转为 3.12 开发 |
| FastMCP | **4.2.0** | 固定版本；不能写成泛泛的“最新版” |
| MCP SDK（FastMCP 间接） | 2.3.0 | 不应混用两种 FastMCP Server 封装 |
| HTTPX | 0.28.1 | `>=0.28,<1` |
| Pydantic | 2.14.3 | 间接/锁文件管理 |
| Hatchling | 1.33.0 | 构建轮次记录，隔离 build 环境 |
| pytest | 8.4.2 | `>=8,<9` |
| Ruff | 0.17.5 | `>=0.11,<1` |
| comfy-cli | 1.26.0 | `>=1.16,<2` |
| uv | **0.13.8** | CI 同版本 |
| Python CI 矩阵 | 3.11 / 3.12 | 必须区分是否跑过真实宿主集成 |

### ComfyUI 宿主

| 组件 | 用户报告的当前版本 |
|---|---:|
| ComfyUI Backend | **0.45.0** |
| ComfyUI Frontend Package | **1.59.1** |
| 宿主 Python | **3.12.4** |
| PyTorch | **2.3.0** |
| NumPy | **1.26.4** |
| Pillow | **10.3.0** |

这是**主要集成兼容性基准**。ComfyUI 前端独立升级可能导致前端 API 与对应 TypeScript 类型包版本差异，不能因为 CI 使用其他版本就假定完全匹配。

### Vue / Node / pnpm

| 组件 | 用户报告的版本 |
|---|---:|
| Vue | **3.5.13** |
| PrimeVue | **4.3.3** |
| vue-i18n | 9.14.4 |
| Vite | **6.3.5** |
| `@vitejs/plugin-vue` | 5.2.3 |
| `vite-plugin-vue-devtools` | 7.7.2 |
| ComfyUI frontend 类型包 | 1.22.1 |
| Vitest | **4.0.18** |
| Vitest Playwright Provider | 4.0.18 |
| Vue Test Utils | 2.6.0 |
| Playwright | 1.65.1 |
| pnpm | **11.13.1** |
| 本机 Node.js | **26.8.2** |
| CI Node.js | 22.x |

**重要**：用户明确指出当前没有单独安装或锁定 `typescript`，也没有完整的 `tsc` / `vue-tsc` 独立类型检查步骤。**Vite 构建通过 ≠ TypeScript 类型检查通过**。后续增加类型检查必须先验证当前前端类型包与 ComfyUI 1.59.1 的实际契约。

### 尚未确认的版本

SQLAlchemy、Alembic、Astropy、LangChain、sqlite-vec、FastEmbed/ONNX Runtime 等曾在架构设计中被推荐，但用户未报告已经安装的版本；它们属于**目标技术栈，不是现有依赖清单**。不得在交接文档中虚构其安装完成。

## 2. 最终技术栈（按是否必需）

| 层 | 默认采用 | 可选/逐功能引入 | 不额外引入 |
|---|---|---|---|
| 执行宿主 | ComfyUI 0.45.0 当前基准，V3 Node | 支持范围内更多宿主版本 | 独立 DAG/Node Runner |
| 前端 | Vue 3、TypeScript、Vite、宿主 API | 自带 PrimeVue、OpenSeadragon | 独立永久在线 Web 前端服务器 |
| HTTP | ComfyUI PromptServer/aiohttp | 长操作进程协调 | FastAPI/Uvicorn 二次 Web 后端 |
| 业务数据 | SQLite、SQLAlchemy 2、Alembic（需要时） | WAL、迁移/备份 | PostgreSQL/Redis 作为默认依赖 |
| 天文数据 | Astropy、NumPy（需要时） | 特定格式 Adapter | 强制 FITS→PNG |
| 软件 | subprocess、Siril/PixInsight Adapter | 软件专有脚本 API | 内置第三方软件本体 |
| MCP | FastMCP 4.2.0、HTTPX、stdio | FastMCP Skills Provider、Resources | MCP 内业务数据库/Agent Runtime |
| RAG | LangChain 文档加载/分块、FTS5 | sqlite-vec + FastEmbed/ONNX | 必须运行大模型才能检索 |
| 记忆 | SQLite 事件/事实/偏好模型 | LLM 记忆归纳 | 外部 Agent Memory 替代用户记忆 |
| 开发 | uv Workspace、pnpm、pytest、Vitest | Playwright 浏览器集成测试 | 让 Manager 读取 uv.lock |

所有外部依赖的版本约束应基于**宿主不受破坏**的真实安装测试；尤其不随意升级宿主已有 Torch/NumPy/Pillow。

## 3. 开发与宿主环境：双环境而非完全克隆

推荐：

```text
项目目录 .venv/（独立 uv Workspace）
  Python 3.12.x → pytest / Ruff / 发行构建 / FastMCP 开发

ComfyUI 实际运行的 Python 环境
  Python 3.12.4、torch 2.3.0、numpy 1.26.4
  → V3 Node 加载 / 真实 IMAGE / 路由 / 前端联动 / 兼容性验收
```

**原则**：开发 `.venv` 与宿主共用源码、不共用锁定的 Python 环境；真实宿主的运行依赖由 Manager/显式安装流程管理。**不要在 ComfyUI 宿主环境执行 `uv sync`**，uv sync 按项目锁文件同步，可能移除或替换宿主其它包。

建议改为 `.python-version=3.12` 并通过 `uv python pin 3.12` / `uv sync --python 3.12` 创建项目开发环境，但先核查原 `.venv`、未提交文件、正在运行的进程与工具配置，不要直接毁掉现有 Python 3.13.15 环境。若需要可留备份或为宿主测试另用解释器。`requires-python >=3.11` 是支持范围声明，**不能由 `.python-version 3.12` 自动证明 Python 3.11 已通过测试**。

### 示例命令（以实际文件校验后运行）

```powershell
# 开发 Workspace：确认不误指向 ComfyUI 宿主
uv python install 3.12
uv python pin 3.12
uv sync --python 3.12
uv run python --version

# 真实宿主：替换成实际解释器路径
& "<COMFYUI_PYTHON_EXE>" -m pip check
```

这些是**目标标准化命令**，本次整理未运行，不能当作验证日志。

## 4. Monorepo 中两个发行包的边界

```text
GitHub Monorepo
├─ root pyproject.toml + __init__.py + nodes/ + astrophoto/ + js/ + locales/
│     → Comfy Registry Extension（Manager 安装/更新）
└─ mcp/pyproject.toml + src/astrophoto_mcp/
      → PyPI astrophoto-mcp Wheel（ComfyUI Python 安装或外部环境安装）
```

- 同一个代码仓库开发；不用拆成两个仓库。
- 根 `pyproject.toml` 是软件版本的唯一来源；`mcp/pyproject.toml`、依赖 pin、Git Tag 由脚本同步校验。
- 采用 Lockstep SemVer：`vX.Y.Z` 对应 Extension `X.Y.Z`、MCP `X.Y.Z`。
- 先测试构建/发行内容，再发布 MCP PyPI、确认可安装，最后发布 Extension Registry；失败只重试未完成阶段，不覆盖 PyPI 已发版本。
- 用户并不一定要常驻 MCP 服务；本地 Agent 通过 `stdio` 按需启动，可在 ComfyUI 的 Python 环境运行 `python -m astrophoto_mcp`。
- Manager 不能保证更新用户通过 `uvx`、独立虚拟环境、远端服务器运行的 MCP，需要连接时版本校验及升级指引。

## 5. uv Workspace + 标准 PyPI 依赖的区别

**现存风险**：最新用户给的文件树写明根 `requirements.txt` 当前“源码安装时引用本地 `./mcp`”；但目标 Registry 构建通过 `.comfyignore` **排除 `mcp/`**。如果原样发布，就可能在用户安装时出现“找不到 ./mcp”。这是**发布前的阻断项**，但目前没法凭聊天记录断定已经修复。

**建议最终形态（片段，必须与实际项目配置合并）**：

```toml
# root pyproject.toml —— 目标片段，不覆盖原有 build-system/test 配置
[project]
name = "<registered-extension-name>"
version = "0.0.1"
requires-python = ">=3.11"
dependencies = ["astrophoto-mcp==0.0.1"]

[tool.uv.workspace]
members = ["mcp"]

[tool.uv.sources]
astrophoto-mcp = { workspace = true }
```

`tool.uv.sources` 只控制 uv 开发时包来源；普通 pip/Manager 不会把 workspace 源来源自动当成发行包中的可用本地代码。正式 `requirements.txt` 如要保留，也应为对应已发布的 `astrophoto-mcp==X.Y.Z`，但**在这个版本尚未存在于 PyPI 前不要让强制依赖破坏脚手架开发安装**。

uv Workspace 共享一份 `uv.lock`，多个包的 Python 约束必须有交集。是否采用 workspace 并不等于两个包必须发布到同一个地方，也不等于 ComfyUI Host 会自动使用开发 `.venv`。

## 6. Manager / Registry / Git Clone 三种路径不可混淆

| 路径 | 取源码方式 | MCP 源码是否在 Extension 文件夹 | MCP 分发行为 |
|---|---|---|---|
| Registry 包 + `.comfyignore` | Registry 归档文件 | **不应存在** `mcp/` 子树 | 需要标准 PyPI 依赖安装 |
| Manager 通过 Git 仓库安装 | Git clone 整仓库 | **会存在** `mcp/` 子树 | 读取 `requirements.txt`，可能执行安装脚本 |
| 手动 Git Clone | 开发仓库 | 会存在 `mcp/` | 需要开发者按文档准备依赖 |

官方说明：Registry 的 `comfy node publish` 默认打包 Git 跟踪文件，`.comfyignore` 排除其中文件；`[tool.comfy].includes` 可强制包含被忽略的构建产物。不能仅依据 `.gitignore` 猜测构建归档。

### `.comfyignore` 基础示意

```gitignore
mcp/
frontend/
tests/
scripts/
docs/
reference/
.github/
.agent/
.agents/
.codegraph/
dist/
```

必须确保 **`nodes/`、`astrophoto/`、`js/`、`locales/`、`__init__.py`** 确实进入产物。特别检查 `[tool.comfy].includes=["js"]` 是否需要启用：取决于 `js/` 是否被 `.gitignore` 排除。`requirements.txt`、`pyproject.toml` 等元数据也须与实际安装流程一致。

## 7. 包更新强一致不等于进程运行时一致

- 已运行的 stdio MCP 进程在磁盘 package 升级后并不会自动热重载，需外部 Agent 重启对应进程。
- 如果 MCP 来自独立环境，Manager 的包管理根本不会触碰它。
- 上述原因决定：**必须有 Runtime Version/Capabilities Handshake**。Extension 和 MCP 报告版本、API contract、Capabilities，不一致时安全拒绝不兼容操作，而不是依赖“Manager 会自动处理一切”。
- 若部署在多用户/局域网环境，还须验证身份认证，不能因为版本一致就放行本地文件读写。

## 8. Frontend 环境特殊点

- Vue 3 与宿主 ComfyUI Frontend 在运行时的共享机制需要以当前 Widget 工程与构建产物核实，不能凭本地 pnpm 包版本猜测宿主 Vue 实例。
- ComfyUI 官方最新迁移文档表示前端宿主不再自动提供 PrimeVue Plugin/Theme/CSS 变量。当前扩展使用的 PrimeVue 4.3.3 若继续保留，须自己安装、加载和配置样式。参考：<https://docs.comfy.org/custom-nodes/js/primevue-removal-migration>。
- `frontend/pnpm-workspace.yaml` 如果只有一个 package 并没有实际子工作区需求，可评估是否冗余，但不能未经测试直接删除。
- 发布安装用户**无需 Node/pnpm**；它们是构建工具，最终用户消费 `js/` 构建产物。

## 9. 依赖新增决策表

| 要加的组件 | 应修改的位置 | 条件 |
|---|---|---|
| `astrophoto/` 内自己写的 Python | 根发行包源码 | 不需额外发布 PyPI 包 |
| SQLAlchemy/Astropy | 根 Runtime dependencies（功能确实需要时） | 测试 Python 3.11/3.12、宿主 torch/numpy 不受影响 |
| Alembic | 开发/迁移工具，运行时是否必需按迁移机制判断 | 不要启动 ComfyUI 就自动迁移所有库 |
| LangChain | Extension Knowledge 域 | 按功能导入，避免默认安装过重 |
| sqlite-vec/FastEmbed | 可选 Extra 或分发策略 | Windows/宿主 ABI 测试 |
| FastMCP/HTTPX | `mcp/pyproject.toml` | 独立 MCP 依赖；主 Extension 不直接 import MCP |
| Vue、PrimeVue、Vite | `frontend/package.json` | 编译为 `js/`，不要在 Runtime pip 安装 |
| Siril/PixInsight | 用户自己的软件目录 | 验证 Path/License/Capability，不能自动当 Python 包安装 |
| Embedding 模型 | ComfyUI model paths | 模型管理/下载另做授权控制，不能自动后台下载 |

## 10. 发布前一票否决项目

1. V3 Node 不能在 ComfyUI 0.45.0 + Python 3.12.4 正常加载。
2. 上传 PNG→IMAGE 现有路径回归。
3. Registry 包仍有 `./mcp` 的无效依赖。
4. Registry 包含私有用户数据、测试垃圾、大型 reference 或 MCP 源码。
5. MCP Wheel 混入 Extension、完整 reference 或数据库。
6. 当前 MCP 版本未在 PyPI 可安装，Extension 却强制依赖它。
7. 新包引起宿主 PyTorch/NumPy 不可控升级或 `pip check` 失败。
8. 默认启动对用户本地执行未经审核的 pip 安装或远程命令。
9. 测试与文档把 mock-only 验证写成真实宿主验证。

## 11. 官方依据

- uv Workspace：<https://docs.astral.sh/uv/concepts/projects/workspaces/>。
- uv Lock/Sync：<https://docs.astral.sh/uv/concepts/projects/sync/>。
- Comfy Registry Publisher/Pack：<https://docs.comfy.org/registry/publishing>。
- Comfy Registry 元数据：<https://docs.comfy.org/registry/specifications>。
- Manager Git 安装/requirements：<https://docs.comfy.org/custom-nodes/backend/manager>。
- Registry 安全标准：<https://docs.comfy.org/registry/standards>。
- ComfyUI PrimeVue Removal：<https://docs.comfy.org/custom-nodes/js/primevue-removal-migration>。


<!-- END 03_技术栈_环境_依赖_发行.md -->


---

<!-- BEGIN 04_MCP_Tools_Skills_知识库_记忆.md -->

# 04｜FastMCP、Tools、Skills、RAG、Memory 与调参实验的完整契约

> **基本边界**：本章主要是**目标业务与接口规划**。截至用户最后报告，MCP 只有 `version`、`connection_status` 的真实能力；Memory、Knowledge、Experiment、Assets 的 Tools 与用户业务 Skills 尚未完成。绝不能仅凭下面出现名称就把它注册为可执行 Tool。

## 1. MCP 当前已报告代码与调用链

```text
mcp/
├── pyproject.toml                # astrophoto-mcp 0.0.1 / Hatchling / FastMCP 4.2.0 / httpx
├── README.md
├── LICENSE
├── src/astrophoto_mcp/
│   ├── __init__.py               # 从 metadata 读取已安装版本
│   ├── __main__.py               # astrophoto-mcp / python -m astrophoto_mcp / stdio
│   ├── server.py                 # create_server(base_url)、version、connection_status
│   └── client.py                 # diagnose(base_url, transport=None)，httpx
└── tests/
    ├── conftest.py
    ├── test_server.py
    ├── test_client.py
    └── test_version.py
```

```text
Agent MCP Client
  → stdio → __main__.py → create_server(base_url)
                            ├── version() → importlib.metadata.version("astrophoto-mcp")
                            └── connection_status()
                                  → client.diagnose()
                                     GET /system_stats
                                     GET /object_info/vue-basic
```

用户描述的 URL 优先级是 `--comfy-url` → `COMFYUI_URL` → `http://127.0.0.1:8188`。`diagnose()` 以 `httpx` 访问上述路径，10 秒超时，测试可注入 `MockTransport`；应保留反向代理 URL path prefix（例如 `/proxy/comfy/`）和 404/连接错误的区别。**现有运行时不会自动启动 ComfyUI**。

MCP 包 CLI 的 stdout 属于 stdio 协议专用，不允许普通 Banner、日志混入；`--version` 显式调用时允许打印并结束。兼容 MCP SDK 的内存 Client 测试优先，另外保留一套真实子进程 stdio 握手测试。

## 2. MCP 最终文件归属

```text
mcp/src/astrophoto_mcp/
├── __init__.py
├── __main__.py
├── server.py                    # 一个 FastMCP Server；服务组装
├── config.py                    # ComfyUI URL、timeout、环境变量
├── client.py                    # HTTPX transport/connection/错误基础层
├── api/
│   ├── comfy.py                 # /system_stats、/object_info、/prompt、/history、/ws
│   ├── extension.py             # AstroPhoto /astrophoto/v1/*
│   └── canvas.py                # 前端 Bridge API（确实实现后）
├── tools/
│   ├── status.py                # L0
│   ├── assets.py                # L1/L2：将来
│   ├── software.py              # 将来
│   ├── nodes.py                 # 将来
│   ├── canvas.py                # 将来
│   ├── workflows.py             # 将来
│   ├── experiments.py           # 将来
│   ├── knowledge.py             # 将来
│   └── memory.py                # 将来
├── schemas/                     # 跨工具复用的 Pydantic 模型；按需增
└── skills/                      # 随 PyPI Wheel 分发的真实 Agent Skills
```

不在 `mcp/` 建立 `database/`、`langchain/`、`software_adapters/` 或 `agent_orchestrator/`。MCP 只发 HTTP/WS 请求，Extension 负责数据与执行；外部 Agent 负责规划、Subagent。

**FastMCP 4.2 API 核验（2026-11-16 官方文档）**：

- `from fastmcp import FastMCP`，用 `@mcp.tool` 注册并由框架生成 Tool Schema。
- `fastmcp.Client(mcp)` 可在进程内测试 Server。
- `fastmcp.skills.provider.SkillsDirectoryProvider` 用于已有文件夹中包含 `SKILL.md` 的 Skills。
- `fastmcp.skills.provider.SkillCatalogProvider` 配合 `Skill.from_directory()` / `Skill.from_package()` 用于显式管理 Skill 列表。
- 旧版导入 `fastmcp.server.providers.skills` 在 4.2 为兼容路径并提示弃用；不要把它当新项目目标 API。
- MCP Skills 扩展支持随 Agent Host 实现而变，FastMCP 资源也能被旧 Host 读取；**发布 Skill ≠ 外部 Host 必然自动加载**。

参考：<https://gofastmcp.com/docs/servers/skills>、<https://gofastmcp.com/docs/servers/testing>。

## 3. 三层渐进式披露（不是三层进程）

**L0 Bootstrap**（只读）：`version`、`connection_status`、未来 `capabilities`。解决是否连接、版本、依赖和权限是否满足。

**L1 Discovery**（查找/解释）：`asset_search`、`equipment_list`、`software_list`、`software_detect`、`node_search`、`node_describe`、`knowledge_search`、`memory_context`、`memory_search` 等。

**L2 Operation**（受控副作用）：`asset_import`、`equipment_upsert`、`calibration_match`、`software_configure`、`canvas_apply`、`workflow_run`、`workflow_status`、`workflow_cancel`、`experiment_create`/`record_trial`/`finalize`、`memory_set`/`feedback`/`forget` 等。

这些名字是**候选契约**，不是承诺逐一实现。不要为每个具体 Siril 算法暴露独立 MCP Tool；那样会形成超长、难搜索的 Tool list。通过 ComfyUI Node Catalog 与有限通用 Canvas/Workflow Tool 编排具体操作。

FastMCP `tags` / visibility 等能力可以辅助组织，但 L0/L1/L2 首先是 Agent 使用顺序，**不应将其实现成全局 `enable()/disable()` 阶段，影响其他并发客户端**。

### 公共调用契约候选

```json
{
  "request_id": "uuid",
  "actor": "agent",
  "capability": "workflow.run",
  "inputs": {"workflow_id": "..."},
  "idempotency_key": "optional"
}
```

```json
{
  "request_id": "uuid",
  "status": "accepted | completed | failed",
  "operation_id": "optional",
  "result": {},
  "error": {"code": "VERSION_MISMATCH", "message": "..."}
}
```

Schema 只是候选，需结合 Pydantic 与现有 Tool 的真实返回契约定型；不要随意改动已有 `version`、`connection_status` 让客户端崩溃。

## 4. Node Catalog、Canvas 与 Workflow Tool 如何互相配合

```text
用户: “用 Siril 对 M31 背景提取并叠加”
  → status/capabilities（确认 ComfyUI / Siril / API）
  → node_search（选择已有 V3 Node）
  → node_describe（真实 io.Schema 及可用性）
  → canvas_apply（在线前端受控编辑；需要目标 Canvas）
  → workflow_run（独立提交工作流；由 ComfyUI 执行）
  → workflow_status / ComfyUI history（结果/异常）
  → experiment_record_trial（如执行优化，记录参数/评价）
```

### Canvas 指令最小设计

`request_id` / `canvas_session_id` / `expected_graph_revision` / `commands[]` → Broker → 在线 Frontend Extension → ComfyUI 当前图 → Receipt。

- 只有真实在线的指定 Canvas 才能报告完成编辑；断连→`CANVAS_UNAVAILABLE`。
- Revision 变化→`GRAPH_CONFLICT`，需重新读取后再编辑。
- `/prompt` **不会**修改打开的浏览器画布，它是运行队列提交 API。
- 多会话/多浏览器时不应广播无目标的写命令。
- ComfyUI 自己继续拥有保存、Undo 与 Workflows。

## 5. 用户 Agent Skills：目标 33 个候选目录

六大领域，统一 `astrophoto-` 前缀。**Skill 表示任务流程**，不应该将每条 Siril CLI 命令写成一个 Skill。

| 领域 | 候选 Skill（在文件夹/Frontmatter 加 `astrophoto-`） | 数量 |
|---|---|---:|
| 环境/设备 | `check-environment`, `configure-software`, `setup-equipment`, `setup-site` | 4 |
| 资产 | `import-session`, `inspect-frames`, `organize-assets`, `match-calibration`, `build-masters`, `quality-review` | 6 |
| 工作流 | `plan-workflow`, `compose-workflow`, `run-workflow`, `debug-workflow`, `reproduce-workflow` | 5 |
| 天文处理 | `preprocess-osc`, `preprocess-mono`, `register-stack`, `background-extract`, `color-calibrate`, `narrowband-combine`, `stretch`, `denoise-sharpen`, `star-processing`, `mosaic`, `planetary`, `export` | 12 |
| 知识与记忆 | `knowledge-guide`, `personalize-processing`, `memory-review` | 3 |
| 优化 | `optimize-node`, `compare-trials`, `select-best-run` | 3 |
| **总计** | **候选总目录，不是已实现数量** | **33** |

优先候选：`astrophoto-import-session`、`astrophoto-match-calibration`、`astrophoto-plan-workflow`、`astrophoto-compose-workflow`、再到 `astrophoto-register-stack`、`astrophoto-optimize-node`、`astrophoto-knowledge-guide`、`astrophoto-personalize-processing`。

### 统一 Skill 格式（示例）

```markdown
---
name: astrophoto-import-session
description: Import an astrophotography capture session, classify frames, associate equipment, and match calibration data. Use when importing new imaging files.
compatibility: Requires AstroPhoto MCP asset import and calibration capabilities.
---

# Import Capture Session

1. Check `connection_status` and required `capabilities`.
2. Scan only authorized input paths; inspect FITS metadata.
3. Classify Light/Dark/Flat/Bias/Dark Flat; mark ambiguity.
4. Resolve equipment and capture session; check duplicates.
5. Suggest calibration matches with explanations.
6. Ask for confirmation where needed; import through MCP Tool.
7. Verify recorded assets and return counts, gaps and source refs.

Never overwrite originals, invent metadata, or write SQLite directly.
```

这种 Skill 在所需 Asset Tools 尚不存在时只能写为**规划稿**，不能作为“可执行 Skill”发布。

### 两条分发路径

1. **FastMCP Skills Provider**：`mcp/src/astrophoto_mcp/skills/` 作为 Wheel 包数据；支持 MCP Skills Extension 的 Host 可发现、读取。FastMCP 4.2 的 `SkillsDirectoryProvider` 属于推荐方案，`SkillCatalogProvider` 也是官方支持的另一方案。两个可择其一，避免重叠。
2. **手动本地安装**：给不支持该扩展的 Codex、Claude Code、OpenCode 提供显式的用户确认式安装。`astrophoto-mcp skills list/install --agent ...` 在聊天中只是**拟议的未来 CLI 功能**，不是已实现命令或 FastMCP 内置命令；不要在安装 Extension 时未经同意自动改写 Agent 目录。

Skills 是公用流程文件；用户设备/审美/位置从运行时 Memory/Asset Tool 读，**不把个人信息写进可分发 SKILL.md**。

## 6. 开发 Agent 的 task-notes 与产品 Memory 不同

开发人员使用的 Skills：`.agents/skills/task-notes/SKILL.md`、可能有 `comfyui-node-*` 等针对 Coding Agent 的技能。这些**只用于开发仓库**，不发布至 PyPI 产品 Skills。

`task-notes` 生命周期：`Create → Update → Verify → Compact → Handoff → Promote / Archive / Prune`。

活动文件：`.agent/notes/<task-id>.md`，含 frontmatter：`task`、`status`、`updated`；正文固定 `Goal` / `Progress` / `Verified` / `Decisions` / `Blockers` / `Next`。`AGENTS.md` 只写调用触发和阅读规则，具体管理动作在 Skill 中。任务归档 `.agent/archive/`，经过验证、可复用的架构事实提升到 `docs/`。

**不要将开发 Notes 送入用户 Memory 数据库，也不要将 Agent 全部对话放进 knowledge.db。**

## 7. Knowledge/RAG 设计细节

- **事实存储**：`knowledge.db` 分 Document、Source、Chunk、FTS5 + 可选 sqlite-vec。原始文档存于 `~/.astrophoto/knowledge/sources/`，来源许可/URL/文档版本保留。
- **Pipeline**：Loader → 清洗 → 分块 → 元数据索引 → FTS5 检索 → （可选）Embedding/向量 → （可选）Rerank → 有来源的 Chunks 返回。
- **工程职责**：Extension `astrophoto/knowledge/` 运行 LangChain；MCP `tools/knowledge.py` 只调用 Extension API；外部 Agent 生成用户可读答案。
- **中文检索**：SQLite 默认 FTS 分词未必适合全部中文，需用真实语料评估。对命令、参数、节点 ID 的精确匹配更偏好 FTS/标识符索引。
- **模型目录**：ComfyUI `folder_paths` 注册 `astrophoto_embedding`、`astrophoto_reranker` 专用类别；不是将 SentenceTransformer 直接丢进宿主的 Textual Inversion `models/embeddings`。
- **资源控制**：不因每次 `knowledge_search` 运行一个 ComfyUI Graph，也不强制下载多 GB 模型；FTS5 无模型时仍可工作。
- **软件版本**：Siril/PixInsight 文档检索要保留软件版本上下文，避免把不兼容版本的命令建议为通用操作。

## 8. User Memory：Extension 持久服务，独立于任何 Agent Harness

### 用户希望保留的信息

- 每次 ComfyUI 启动、用户明确操作的关键行为（不是所有鼠标移动）。
- 用户审美倾向：颜色、背景亮度、饱和度、对比、星点、降噪/锐化等；区分窄带 HOO、SHO、RGB 等上下文。
- 用户已拥有设备/Optical Train、观测地、光污染与设备使用历史（主要业务事实仍属于 assets.db）。
- 常用工作流、成功/失败参数、试验评分、用户最终选择、明确反馈。
- 会话状态（短期）与长期偏好（可修正/撤销）。

### 记忆数据结构（示例）

```text
memory.db
├── profiles                   # 受授权用户身份、显示偏好
├── sessions                   # ComfyUI 使用会话
├── activity_events            # 时间、actor、source、event_type、对象 ID
├── memories                   # key/value、scope、confidence、origin、生命周期
├── memory_evidence            # 来源事件或 feedback 的证据链
├── feedback                   # 图像/试验评价；明确 vs 推断
└── consents                   # 采集授权与范围
```

**记忆生命周期**：`Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh / Expire → Forget`。

- Explicit preference 胜于 Inferred preference；推断必须附条件与证据，不从一次 Agent 尝试直接判断用户喜欢。
- 用户可以禁用行为采集、查看、纠错、删除、导出记忆。保留期建议例如事件 30 天可配置，不是官方强制值。
- 位置和光污染：ObservingSite + LightPollutionEstimate 是资产领域事实，Memory 只在有授权时引用；精确经纬度上传外部数据源需要提示和许可检查。
- 多用户隔离：必须使用经过认证的 session/profile 关联，不能让 MCP 客户端传任何 profile_id 就读取他人记忆。

### 记忆工具（规划）

`memory_context(task/asset_ids)`、`memory_search(query)`、`memory_get(id)`、`memory_set(...)`、`memory_feedback(...)`、`memory_forget(...)`。API 返回有限相关记忆与证据，避免把全部操作日志注入 Agent Context；写入/删除应有权限、确认与审计回执。

**不要强制使用 Mem0、Zep、LangGraph/LLM 记忆系统**：业务数据结构已经可被 SQLite/Service 表达；必要时未来把智能归纳作为可插拔能力。

## 9. Parameter Experiment 与 Subagent

- Experiment 生命周期及 Trial 持久化**属于 Extension**；MCP 暴露读写接口；外部 Agent Harness 控制反复调参策略。
- 每次 Trial：`experiment_id`, `trial_id`, `prompt_id`, `node_id`, `workflow_hash`, `input_asset_ids`, `params`, `software_version`, `outputs`, `metrics`, `human_feedback`, `failure_reason`, `timestamps`。
- 不可只记录最终最好参数，必须可追溯每次成功/失败及其条件。
- 科学质量指标（例如 SNR/FWHM/背景梯度）与审美评价必须分开；分数若出自模型评审，保留模型版本、输入和评估方式。
- 试验需要上限、取消、恢复、预算与幂等；原始文件默认不可被试验覆盖。
- 不在 MCP 里实现 Subagent 创建或独立 DAG Scheduler，也不用默认打开 FastMCP Background Tasks 替代 ComfyUI 的执行队列。

## 10. API / Skills / Memory 安全底线

- MCP Tool 的写操作必须校验权限、路径允许范围、Actor 与最终效果；不要仅相信 JSON Schema 就足够安全。
- 用户可查看/删除 Memory 与自身审美偏好，不自动上传精确坐标/资产路径。
- Skills 是可执行流程指令的来源，不天然享有系统命令权限；附带脚本和远端内容可能不可信。
- RAG 检索文档是第三方内容，应当作数据/引用，不当成覆盖系统或工具指令的命令。
- 删除、移动用户文件，执行软件脚本、广播画布命令均需要项目级明确审批/能力约束。

## 11. 参考链接

- FastMCP Skills over MCP：<https://gofastmcp.com/docs/servers/skills>
- FastMCP Testing：<https://gofastmcp.com/docs/servers/testing>
- Agent Skills Specification：<https://agentskills.io/specification>
- ComfyUI Server Routes：<https://docs.comfy.org/development/comfyui-server/comms_routes>
- SQLite FTS5：<https://www.sqlite.org/fts5.html>
- LangGraph memory 概念参考（非必需依赖）：<https://docs.langchain.com/oss/python/langgraph/add-memory>


<!-- END 04_MCP_Tools_Skills_知识库_记忆.md -->


---

<!-- BEGIN 05_实施任务_测试_验收.md -->

# 05｜接下来怎么开发：结构标准化、测试策略、验收标准

> **当前用户最后明确的开发意图**：MCP 已开始开发，下一步是把全仓库结构与 Extension 业务后端 `astrophoto/` 规范化。不是要求在同一个任务里实现所有资产/Memory/RAG/软件节点。后续如果有更新的代码，应先核验再执行，不要重复已完成工作。

## 1. 首次进入仓库的只读发现

项目路径（用户此前提供）：

```text
C:\Users\Administrator\Desktop\WorkSpace\ComfyUI\custom_nodes\ComfyUI_AstroPhoto
```

新 Coding Agent 的检查顺序：

1. `git status`、当前分支、未提交修改、近期 Commit；不得擅自覆盖。
2. 读取 `AGENTS.md`、`docs/requirements.md`、`docs/architecture.md`、`docs/development.md`、`docs/mcp.md`、`docs/publishing.md`，如果文档缺失需要实际记录而不是猜测。
3. `.codegraph/` 存在时按 `AGENTS.md` 使用 `codegraph_explore` / `codegraph explore`；优先精确文件路径，避免检索大量 `reference/` 中的第三方代码。不要未经用户要求初始化 CodeGraph。
4. 读取根 `__init__.py`、`nodes/__init__.py`、现有 Node 源文件，**实际验证 V3** `comfy_entrypoint`、`get_node_list`、`define_schema`、`node_id`、`NodeOutput`。
5. 阅读 `frontend/src/main.ts`、Widget 组件、`vite.config.mts`、`package.json`、`locales/`、输出 `js/`。
6. 阅读 `mcp/src/astrophoto_mcp/{__main__,server,client}.py` 与其测试；MCP 正在独立修改，勿按老目录树覆盖较新状态。
7. 读取 root/mcp `pyproject.toml`、`requirements.txt`、`uv.lock`、`.comfyignore`、GitHub workflows。
8. 分别检查开发 Python 解释器和真实 ComfyUI 宿主解释器；记录版本差异和 installability。
9. 最后才决定需新增哪些真实文件。不要先按“目标结构图”批量建空包。

## 2. 本轮结构标准化应交付的内容（P0）

### 2.1 Python 开发环境

- 检查原 `.venv` 3.13.15 和实际宿主 3.12.4 的关系。
- 推荐将默认开发 Python 设为 3.12，保持独立 uv Workspace；`uv python pin 3.12`/`uv sync --python 3.12` 为候选命令，必须先检查文件与依赖风险。
- CI 若声称支持 3.11，也应实际跑相应版本测试；前端 Node/pnpm 与 CI 版本统一验证但不强制和宿主一致。
- 不能对宿主执行 `uv sync`，不能未经检验升级 torch/NumPy/Pillow。

### 2.2 Extension 业务后端骨架

**只在确有真实使用者时**实现：

```text
astrophoto/
├── __init__.py
├── bootstrap.py                 # 可省略直到确实需组装对象
├── core/
│   ├── paths.py                 # ASTROPHOTO_HOME、延迟创建目录
│   ├── config.py                # 已有配置则复用
│   ├── errors.py                # 有实错类型再建立
│   └── capabilities.py          # 根据实际服务可用性返回
└── api/
    ├── routes.py                # PromptServer routes 注册；注入式测试
    └── status.py                # GET /astrophoto/v1/status
```

- `status` 能区分 Extension 已加载、版本、能力不可用，而不是所有 Capability 默认 True。
- 导入 `astrophoto`、插件根 `__init__.py` 时不得创建数据库、下载模型、扫描大型硬盘、检查所有软件。
- 路由只注册一次、异常易诊断；`register_routes(routes=...)` 若能复用已有基础则不重复建。
- 业务层不 import `nodes/`、`frontend/`、`mcp/`；Node 类/API Handler 才调用业务 Service。
- 不能新增旧式 V1 注册代码；保留现有 V3 实现与 `vue-basic` Node ID。

### 2.3 现有前端与 Node 兼容

- `CUSTOM_VUE_COMPONENT_BASIC`、Widget 序列化、Canvas→PNG→`/upload/image`→LoadImage→IMAGE 无回归。
- `WEB_DIRECTORY = "./js"`、实际构建输出 JS/CSS、`locales/{en,zh}` 能被宿主加载。
- PrimeVue 不能假设宿主自动初始化；依照当前 frontend 1.59.1/官方移除迁移检查并验证。
- 没有 `typescript`/`vue-tsc` 时不能声称已启用独立静态类型检查；需要新增检查必须同步依赖和 CI。

### 2.4 MCP 保持兼容

- 保留 `astrophoto-mcp`、`python -m astrophoto_mcp`、`--version`、`--comfy-url`、`COMFYUI_URL` 与 stdio 运行。
- 保留 `version`、`connection_status` 的名称、Schema、错误与返回契约。
- 新状态 API 可使诊断更丰富，但不得破坏原调用方。
- FastMCP 4.2.0 的 Skills Provider 可等有真实 Skill 文件时再注册；不得创建不可执行的占位 Tool。

### 2.5 Packaging 基础

- 检查 root `requirements.txt` 当前 `./mcp` 和 Registry 排除 `mcp/` 的矛盾；**发行前必须解决**。
- 检查 `pyproject.toml` 版本源、MCP 版本、根依赖约束和 Tag；测试生成的 Registry 包与 Wheel 真正的文件清单。
- 保留 `js/`、`locales/`、`nodes/`、`astrophoto/` 在 Extension 包内；排除 `mcp/` 源码、reference、tests、dist 等。
- 不推送、不发布 PyPI、不执行 Comfy Registry 实际发布；需要 Release 凭证的检查应该止步于可重复的构建和模拟安装。

## 3. 验收矩阵：证据和环境要分开

| 验证对象 | 测试环境 | 必须能证明什么 |
|---|---|---|
| `core/paths.py` | pytest + `tmp_path` | `ASTROPHOTO_HOME` 覆盖、生效路径、import 无写盘副作用 |
| `core/capabilities.py` | pytest | 仅真实已实现能力 ready，其余 false/unavailable |
| `api/status.py` | pytest + aiohttp Test Double | 返回 Schema、版本、实际能力、一致错误 |
| `api/routes.py` | pytest + 可注入 RouteTableDef | 正确 method/path、不会重复注册 |
| `nodes/` | pytest + 模拟宿主 | V3 `comfy_entrypoint` / `get_node_list` / Schema / NodeOutput / 旧 Node ID |
| `nodes/` 端到端 | ComfyUI 0.45.0 + Python 3.12.4 | 实际插件能加载，图能运行且 IMAGE 与序列化正确 |
| `frontend/` | pnpm/Vitest | Widget 注册、序列化与 DrawingApp 行为 |
| `frontend/` 浏览器 | 真实 ComfyUI Frontend 1.59.1 | 画板/样式/Host API/翻译可用，无 PrimeVue 依赖问题 |
| `mcp/` | FastMCP in-memory Client | list_tools、call_tool、Tool Schema 和 HTTP MockTransport |
| stdio | 真实安装的 `astrophoto-mcp` 子进程 | initialize→list_tools→call_tool，stdout 不含噪声 |
| root/mcp 发行 | comfy-cli + uv/hatchling | 版本一致、归档文件互相隔离、依赖可安装 |
| 工作区/依赖 | uv lock + 独立 Host 安装预检 | Workspace 可解析，安装不破坏宿主 torch/NumPy |

**只有测试通过才可以报告 verified。** `pytest MockTransport` 成功不是“真实 ComfyUI 已连接”；`pnpm build` 成功不是“Host 1.59.1 已验证”。

## 4. 当前已知测试路径与候选命令

```text
tests/nodes/test_registration.py
tests/nodes/test_image_io.py
tests/packaging/test_versions.py
tests/packaging/test_contents.py
frontend/tests/components/DrawingApp.test.ts
frontend/tests/widgets/registration.test.ts
frontend/tests/widgets/serialization.test.ts
mcp/tests/test_server.py
mcp/tests/test_client.py
mcp/tests/test_version.py
mcp/tests/conftest.py
```

按需再创建 `tests/backend`、`tests/integration` 与 MCP 各领域 tests；不要仅因为目录树里提到就制造空测试文件。

候选命令（以项目实际配置为准）：

```powershell
uv run pytest tests/nodes tests/packaging
uv run --package astrophoto-mcp pytest mcp/tests
pnpm -C frontend build
pnpm -C frontend exec vitest run
uv build mcp/
```

如果 MCP 未独立安装、依赖未声明 pytest/pytest-asyncio 或 Node 测试缺少 browser provider，需先适配真实配置，不能假定命令都在当前脚手架可运行。

## 5. 业务功能的后续依赖顺序

这不是要求做一场大规模并发业务重构。建议：

1. **Core/Status/API**：公共契约、版本和能力发现。
2. **Assets/Equipment/Calibration/ObservingSite**：权威业务数据源和 `assets.db`。
3. **Software Registry/Siril Adapter/FITS 数据类型**：先做真实支持的一批处理操作，Node 通过 Service 调用。
4. **Node Catalog、Canvas Bridge、Workflow/Experiments**：受控画布与执行回执、可复现 Trial。
5. **Knowledge FTS5**：先可追溯关键词检索；再按需加语义检索。
6. **User Memory**：明确偏好/授权日志和场景召回；从反馈中可解释地归纳。
7. **业务 Agent Skills**：依赖 Tools 可运行后逐个发布，避免 33 个占位 Skills。
8. **更多软件与处理域**：PixInsight、行星/彗星/马赛克等。

`assets.db`、`knowledge.db`、`memory.db` 属于不同生命周期，不能用 Knowledge 重建覆盖业务事实。

## 6. 模块层面最常见的失败模式

| 错误模式 | 正确措施 |
|---|---|
| 每个 Node 自己写数据库、软件发现与进程启动 | V3 Node 轻适配→Service→Adapter |
| ComfyUI API 只知道 `/prompt`，让其修改前端画布 | 使用 Frontend Bridge + Command Receipt |
| 业务和 MCP 分别维护一份 Equipment SQLite | Extension 为唯一事实所有者 |
| `status` 看到 Python 包存在就报告所有功能可用 | Capabilities 基于 Service/Software/权限的真实状态 |
| `uv sync` 直接对宿主安装 | 独立开发 Workspace + 宿主显式集成验证 |
| `requirements.txt` 发行包仍写 `./mcp` | PyPI 已发布版本 pin + build artifact 验证 |
| 仓库中创建几十个空业务文件来“标准化” | 先明确模块归属，功能上线时建立文件 |
| 知识库、记忆、资产都往一个 `notes.md`/SQLite 表追加 | 各自拥有实体、生命周期和隐私策略 |
| 自动获取/上传用户位置和全部行为 | 明确授权、最小采集、可删除与可审计 |
| 仅写一份长 Prompt 就宣称工程完成 | 提交源码变更、测试证据、阻断项清单 |

## 7. Coding Agent 的交付报告格式

要求结束时按以下证据输出：

```text
Implemented:
- <路径、实际变更、原因>

Verified:
- <命令> → <结果/通过数量>  [dev/unit]
- <宿主启动/真实工作流> → <结果>  [host/integration]
- <归档检查> → <文件清单和缺失/多余项>  [packaging]

Unverified/Blocked:
- <缺什么环境/权限/外部软件、如何复现>

Architecture/Docs Updated:
- <文档路径与修改说明>

Next:
- <下一步第一个可验证操作>
```

不要将没有运行的测试当作已通过，失败则明确说明；不要擅自 push、Tag、发布或清理用户未提交的工作。


<!-- END 05_实施任务_测试_验收.md -->


---

<!-- BEGIN 06_决策日志_冲突及待核验.md -->

# 06｜决策日志、上下文冲突、纠错与待验证清单

> **本文件必须优先阅读。** 本聊天经历了多次技术调整与旧示例的更正。本文件将最终选择、历史建议、待证实事实隔开，避免新 Agent 把所有历史输出当成同等级指令。

## 1. 证据等级与执行优先级

1. **真实工作区源码、当前安装版本和成功执行的测试证据**，是“已实现”事实的唯一依据；用户提供的静态审查摘要是有价值但需核实的线索。
2. **用户后续明确的修正或约束**覆盖此前的猜测和助理设计：例如 **Node API 为 V3**，不应继续采用早期 V1 规范。
3. **对应版本官方文档**用于确认合法 API、分发/安装机制，但版本可能更新，最终要与本机的 ComfyUI 0.45.0、FastMCP 4.2.0 核对。
4. **需求基线 v0.2 与本交接**属于目标设计；不等于代码已写入或发布成功。
5. **历史示例代码、目录建议与 Prompts**只能作为参考模板，不得直接当成项目已有函数或可运行命令。

## 2. 核心架构决策（已讨论确定，不一定已实现）

| ID | 决策 | 理由/后果 | 状态 |
|---|---|---|---|
| ADR-01 | 一个 GitHub Monorepo，根 Extension、`mcp/` PyPI 子项目 | 联动开发/版本/CI，但发布包独立 | **确定设计** |
| ADR-02 | Lockstep SemVer，同一 Git Tag、先 PyPI 再 Registry | 用户希望 Extension 更新时同步分发同版 MCP | **确定设计，运行升级限制** |
| ADR-03 | ComfyUI 负责 Graph/Canvas/Undo/Save/Queue/Execution | 不重复造画布和执行器 | **确定架构边界** |
| ADR-04 | `astrophoto/` 按业务域的模块化单体 | 多领域服务共用能力但不耦合节点/HTTP/MCP | **确定架构边界** |
| ADR-05 | ComfyUI V3 Node API 是新节点唯一标准 | 用户纠正 V1 假设，官方有 V3 文档 | **用户确认** |
| ADR-06 | Extension HTTP 使用现有 PromptServer/aiohttp | 没必要 FastAPI/Uvicorn 第二个服务器 | **确定设计** |
| ADR-07 | FastMCP 4.2.0、stdio 单 Server、领域 Tool + Skills | 外部 Agent API 薄适配，包独立发布 | **框架与版本已报告存在；业务接口目标** |
| ADR-08 | SQLite 三 DB：assets / knowledge / memory | 生命周期不同、易备份/重建/遗忘 | **确定目标** |
| ADR-09 | 原始科学数据默认不改，专用引用类型 | FITS 精度/Header 不能静默 PNG 化 | **确定目标** |
| ADR-10 | Software Registry + Runner + per-software Adapter | 支持自动检测、受控配置与执行、软件多版本 | **确定目标** |
| ADR-11 | Canvas 操作经前端 Bridge + Receipt | `/prompt` 不等于改当前 UI Graph | **确定目标** |
| ADR-12 | User Memory 属于 Extension 且独立于 Agent Harness | 跨外部 Agent 重用，权限/删除受 Extension 控制 | **确定目标** |
| ADR-13 | Skills 随 MCP Wheel；开发 task-notes 与产品 Skills 分离 | 同版分发、可恢复跨会话开发 | **确定目标** |
| ADR-14 | 开发默认 Python 3.12，宿主仍独立 3.12.4 | 缩小 dev/host 语义差；不毁宿主 | **建议，未报告已执行** |
| ADR-15 | 先结构标准化，不批量创建未来空业务模块 | 控制复杂度；保护正在进行的 MCP 改动 | **用户最近任务方向** |

## 3. 关键历史转折线

1. **Agent 长周期任务记录**：确定 `task-notes` Skill，任务 Note 的创建、更新、验证、压缩、交接、提升、归档/清理；`AGENTS.md` 只提供导航与触发规则。
2. **项目仓库映射**：`AGENTS.md` 作为入口、`docs/architecture.md` 描述实际架构、`docs/development.md` 描述命令、`docs/requirements.md` 作为计划，不强迫 Agent 每次扫描全库；可选 CodeGraph 查源码。
3. **Extension + MCP 分发**：决定单仓库双包（Registry + PyPI），默认 Manager 依赖安装同版 MCP；`.comfyignore` 排除源码。
4. **FastMCP 生态**：选择 FastMCP 4.2，避免自己造协议层；三层调用路径，少量 MCP Tools 动态操作大量 ComfyUI Nodes。
5. **天文业务范围**：新增设备、拍摄会话、Light/校准场、观测地、Siril/PixInsight 节点、Canvas Bridge、LangChain 检索、Experiment 与 subagents。
6. **User Memory**：用户希望在 Extension 自行收集经授权的行为、审美、设备和光污染信息；决定 Memory 独立 SQLite、Memory 与业务事实分层。
7. **用户业务 Skills**：候选 33 个，随 MCP Wheel 分发；FastMCP Skills Extension + 本地安装备份策略。
8. **仓库目录归属**：发现 `nodes/`/`frontend/`/`mcp/` 之外缺少 `astrophoto/`；确定 Backend 业务层。
9. **V3 纠错**：用户明确 **项目节点使用最新 V3**，此前“V1”旧教程需要废弃；后续 V3 标准化教程生成。
10. **环境版本与开发基准**：用户提供 2026-11-16 的具体锁定版本，建议将独立 uv 开发 Python 对齐宿主主版本 3.12。
11. **最新工作方向**：用户要求基于总体文档驱动 Coding Agent 实施结构标准化；现在请求把全聊天做成详尽交接包。

## 4. 必须显式解决的矛盾

### C-01：项目当前 V1 还是 V3？

**旧消息与 v0.2 原稿**：写有 `INPUT_TYPES`、`NODE_CLASS_MAPPINGS`、旧 `__init__.py` 注册示例。  
**用户较新的明确陈述**：目前 Node 已用 V3。  
**官方文档**：V3 使用 `io.ComfyNode`、`define_schema()`、`execute()`、`io.NodeOutput`、`ComfyExtension.get_node_list()`、`comfy_entrypoint()`，可选 `fingerprint_inputs()`。  
**处理**：**以 V3 为准**，但不要仅凭用户口头表述就覆盖真实文件；先在仓库里审计节点注册，再做最小修订。开发测试、AGENTS 也应改成 V3。

### C-02：FastMCP 4.2 中 Skills Provider 哪一个正确？

聊天中一度出现互相矛盾的说法：“只能 `SkillCatalogProvider`”与“`SkillsDirectoryProvider` 不存在/不该用”。**两种类在 FastMCP 4.2 官方文档中都存在**：

- 静态多文件夹 Skills：`from fastmcp.skills.provider import SkillsDirectoryProvider`。
- 已加载为 `Skill` 对象：`from fastmcp.skills.provider import SkillCatalogProvider`。
- 4.1 旧路径 `fastmcp.server.providers.skills` 已弃用（4.2 警告、4.3 移除），不要误选。

**处理**：项目有目录 `mcp/src/astrophoto_mcp/skills/`，可以优先 `SkillsDirectoryProvider`；也可根据实际打包测试选择 Catalog，不能凭以往某条助理回复排除另一种。仍需在 **已锁定的 FastMCP 4.2.0 本机环境** import/pytest 验证。

### C-03：ComfyUI-Manager 更新 MCP 是否“强制”？

**最初设计**：用户希望 Extension 每次更新强制 MCP 一起更新。  
**可实现的保证**：CI 每版统一发布；Extension 依赖 `astrophoto-mcp==X.Y.Z`，Manager 正常安装依赖时使用同版包。  
**不成立的保证**：Manager 无法无条件升级用户外部 uvx/venv/远程运行的 MCP；已运行进程不会无中断热更新；跳过依赖安装/旧式 Git 安装路径需单测。  
**处理**：标准分发依赖 + CLI 启动同一 ComfyUI Python + runtime version handshake + mismatch 明确拒绝。

### C-04：根 requirements 本地路径是否能发布？

用户最新目录树注释写 `requirements.txt` “源码安装时引用本地 ./mcp”，而 `.comfyignore` 计划排除 `mcp/`。**这在 Registry 包场景相互冲突**。  
**处理**：开发时 uv Workspace sources；用户发行物依赖已发布的同版本 PyPI 包。发布前 build/test 安装实际归档，确认无 `./mcp` 悬空引用；如果 PyPI 版本尚不存在，阻断发布而不要假装测试已通过。

### C-05：`uv.lock` 能否控制 Manager 的 Python 环境？

不能。uv lock 与 `.venv` 主要服务开发/CI；Manager 用户安装使用 ComfyUI 的 Python 环境和安装机制。**不要用 `uv sync` 对宿主做“统一管理”**。uv 官方说明 `uv sync` 默认会删除非锁定包。

### C-06：开发 Python 3.13 还是 3.12？

用户报告当前独立 `.venv` 3.13.15、宿主 3.12.4；后续建议**把开发默认改为 3.12.x**，并验证在宿主运行。这个迁移是计划，还没有新的用户确认或执行日志；不要声称已迁移。

### C-07：PrimeVue 是否还从宿主获取？

用户项目依赖 PrimeVue 4.3.3；ComfyUI 官方当前前端迁移文档表明宿主不再提供 PrimeVue 全局插件/主题。**扩展需要自行打包/初始化 PrimeVue（或改用宿主支持的 UI API）**。开发依赖中的版本并不等于宿主当下的 Vue/PrimeVue 实例。

### C-08：当前工程到底有多完整？

用户早期报告有个 V1 示例节点、无完整测试，后期目录树报告有完善的 tests/CI、且节点已 V3。**后来的用户信息应优先，但最新仓库状态仍未被本次工具检验**。不要把历史“CI owner=jtydhr88 跳过”当成当前仍存在缺陷（应检查 `ci.yml` 是否已修复）。不要把最后一次提到的 MCP 代码文件清单当成最新工作树已经冻结，MCP 正在开发。

### C-09：三份 DB 和 Data Home 何时创建？

三个 SQLite 属于**未来设计**；当前 v0.0.1 不应因为目录规划而创建空数据库或全量迁移。`.astrophoto/` 默认在用户 HOME，非源码；仅在用到真实业务时按需初始化。Memory 对 user location/consent 有严格隐私要求。

### C-10：Skills 33 个是否应一次发布？

不是。33 个只是候选覆盖目录，首先完成可运行 Tools，再给依赖满足的 Skill 标记可执行；无业务 Tool 的 Skill 不能装作能导入 FITS/运行 Siril。

### C-11：能否基于 FastMCP Tool Search 搜 ComfyUI Nodes？

FastMCP 的工具搜索只能搜索 MCP 自己的 Tool 列表；ComfyUI Node Catalog 仍需要项目自己的 `node_search`，从 `/object_info` 和 Extension Capability Catalog 获取节点/可用性。

### C-12：数据路径与多用户认证

默认 `~/.astrophoto/` 是单机 local-first 建议，ComfyUI 如果由多人共享，不能简单共享同一 Memory Profile；必须设计认证/隔离，尤其是 Assets 路径、观测地和偏好。

### C-13：ComfyUI API `/prompt` 与 Canvas 是否等价？

否。`/prompt` 返回 `prompt_id`，运行图由 Execution Engine 处理；它不意味着正在打开的浏览器画布被改。需要 Web 前端在线 Bridge 和真正 Receipt。

### C-14：科学图像的 IMAGE 与 FITS

当前 PNG→IMAGE 示例只证明普通预览/教学数据链路；不能外推为所有 FITS/RAW/视频能无损使用 ComfyUI IMAGE。专用科学数据类型和缓存/序列化契约须原型测试。

### C-15：Skills/Tool 是否需要“动态隐藏软件节点”？

FastMCP Tool visibility 不会改变 ComfyUI Python Node 注册。已加载工作流需保持 Node 类型稳定；软件没装在自有节点发现 UI 隐藏/标不可用即可。全局 ComfyUI Node 菜单的动态控制不应未验证就宣称可行。

## 5. 待验证清单（提供给下一轮 Agent）

### 最高优先级（执行前）

- [ ] `git status`/分支/待提交改动：先读，不覆盖。
- [ ] 根 `__init__.py` 与 Node 类确为 V3；保留 `vue-basic` 和 `CUSTOM_VUE_COMPONENT_BASIC`。
- [ ] 真实 `mcp/server.py` 当前是否只两个 Tool，是否已有新版代码。
- [ ] `.venv` Python 是否仍 3.13.15，宿主是否仍 3.12.4。
- [ ] root requirements 是否仍是 `./mcp`，CI 和 release 是否已处理分发差异。
- [ ] 测试/CI 是否已成功，是否还保留旧模板 `jtydhr88` 限制。
- [ ] 前端 PrimeVue/类型包是否与宿主 1.59.1 兼容。

### 发布前

- [ ] Comfy Registry 包产物包含 `nodes/`、`astrophoto/`、`js/`、`locales/`，不包含 `mcp/`、reference 等。
- [ ] PyPI Wheel 只包含 MCP 发行包与真实 Skills，Skill references 不缺失。
- [ ] Python 3.11 与 3.12 的安装/测试范围有证据；没有过度约束宿主 NumPy/Torch。
- [ ] MCP PyPI 版本已可安装，再发布对应 Extension Registry 版本。
- [ ] 同版本运行协议检查、旧进程重启和外部虚拟环境升级说明已实现。
- [ ] Node V3/Widget/IMAGE 数据路径在真实 Host 测试通过。

### 后续业务原型前

- [ ] V3 自定义天文科学数据类型的缓存、序列化、保存/加载规则。
- [ ] 多用户身份、访问权限与 Memory Profile 隔离。
- [ ] Siril/PixInsight 真实版本和许可约束。
- [ ] sqlite-vec/Embedding 在目标 Windows/ComfyUI Python ABI 上安装兼容性。
- [ ] 光污染 API 许可、采样解释与用户定位授权。
- [ ] MCP Skills Extension 在目标 Agent Host 的实际支持情况。

## 6. 本轮官方重新核验的关键事实（链接）

- ComfyUI V3 入口、Schema、缓存：<https://docs.comfy.org/custom-nodes/v3_migration>。
- PromptServer、`/prompt`/`/object_info`/`/ws`：<https://docs.comfy.org/development/comfyui-server/comms_routes>。
- Registry `.comfyignore` 与强制 includes：<https://docs.comfy.org/registry/publishing>。
- FastMCP 4.2 Skills 两种 Provider：<https://gofastmcp.com/docs/servers/skills>。
- FastMCP 4.2.0 Requires Python >=3.11：<https://pypi.org/project/fastmcp/4.2.0/>。
- uv Workspace 的共享 lock、`tool.uv.sources`：<https://docs.astral.sh/uv/concepts/projects/workspaces/>。
- `uv sync` 默认 exact：<https://docs.astral.sh/uv/concepts/projects/sync/>。
- PrimeVue Removal：<https://docs.comfy.org/custom-nodes/js/primevue-removal-migration>。
- Registry 禁止运行时 subprocess 安装 Python 包：<https://docs.comfy.org/registry/standards>。


<!-- END 06_决策日志_冲突及待核验.md -->


---

<!-- BEGIN 07_新CodingAgent启动Prompt.md -->

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


<!-- END 07_新CodingAgent启动Prompt.md -->


---

<!-- BEGIN 08_官方参考及证据索引.md -->

# 08｜官方资料、一手来源与事实核验索引

> **本轮检索**：2026-11-16。以下分成“本轮重新打开确认”的一手页面和“来自之前对话/文档、可再次核查”的参考资料。官网文档会更新，因此正式开发需针对 ComfyUI 0.45.0、Frontend 1.59.1、FastMCP 4.2.0 等目标版本在本机验证 API。

## A. 本轮重新打开核实的一手页面

| 类别 | 一手 URL | 本轮明确确认的事实 |
|---|---|---|
| ComfyUI V3 Node | https://docs.comfy.org/custom-nodes/v3_migration | V3 `io.ComfyNode`、`define_schema`、`io.Schema`、`execute`、`io.NodeOutput`、`ComfyExtension.get_node_list()`、`comfy_entrypoint()`；`fingerprint_inputs()` |
| ComfyUI HTTP/WS | https://docs.comfy.org/development/comfyui-server/comms_routes | `/prompt` 入队执行、`/object_info/{node_class}`、`/system_stats`、`/ws`、`/history` 与 `PromptServer.instance.routes` 自定义 aiohttp |
| ComfyUI 前端扩展 | https://docs.comfy.org/custom-nodes/js/javascript_overview | `WEB_DIRECTORY`、JS 文件与 `app.registerExtension` 的官方组合 |
| ComfyUI Settings | https://docs.comfy.org/custom-nodes/js/javascript_settings | 扩展可以注册 Settings；应优先使用宿主 API |
| ComfyUI Sidebar | https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs | 支持自定义 Sidebar Tabs |
| ComfyUI Hooks | https://docs.comfy.org/custom-nodes/js/javascript_hooks | 扩展 Hooks，可用于 UI 生命周期；不能把所有 Hook 当作真实人类点击证据 |
| ComfyUI i18n | https://docs.comfy.org/custom-nodes/i18n | root `locales/{en,zh}` 的主机翻译结构和可选 `nodeDefs` 等 |
| Registry 发布 | https://docs.comfy.org/registry/publishing | 根 `pyproject.toml`、Git 跟踪文件默认打包、`.comfyignore` 与 `[tool.comfy].includes` |
| Registry 元数据 | https://docs.comfy.org/registry/specifications | `[project]` / `[tool.comfy]` 等元数据、SemVer 发行版本 |
| Registry 安全 | https://docs.comfy.org/registry/standards | 禁止通过 subprocess 在运行时 pip install；避免危险代码与干扰其他节点 |
| Manager Git 安装 | https://docs.comfy.org/custom-nodes/backend/manager | Git clone 方案按 `requirements.txt` 安装 Python 依赖，可能运行 `install.py`；与 Registry 发布不同 |
| PrimeVue Migration | https://docs.comfy.org/custom-nodes/js/primevue-removal-migration | 宿主移除 PrimeVue 插件/主题/`--p-*`，扩展需自行处理或复用宿主 UI API |
| FastMCP Skills | https://gofastmcp.com/docs/servers/skills | FastMCP 4.2 Skills over MCP、`SkillsDirectoryProvider`、`SkillCatalogProvider`、资源+Skills Extension，4.1 旧导入路径弃用 |
| FastMCP Testing | https://gofastmcp.com/docs/servers/testing | 用 FastMCP Client 与 pytest 做在内存中 Tool 测试，异步测试配置 |
| FastMCP Provider | https://gofastmcp.com/docs/servers/providers/overview | Provider 模型、`@mcp.tool` 默认 LocalProvider、可组合服务 |
| FastMCP PyPI 4.2.0 | https://pypi.org/project/fastmcp/4.2.0/ | **2026-11-13 发布**，Requires Python `>=3.11`，与项目计划的最低范围相符 |
| uv Workspace | https://docs.astral.sh/uv/concepts/projects/workspaces/ | 单 Workspace 多 package / 共享 lock；`tool.uv.sources = {workspace=true}`；Python 要求交集 |
| uv Sync | https://docs.astral.sh/uv/concepts/projects/sync/ | `uv sync` 默认 exact，同步时会移除不在项目所选依赖中的 extra packages |
| Agent Skills 标准 | https://agentskills.io/specification | `SKILL.md`、`name`、`description`、可选 references/scripts/assets 的文件规范 |

## B. 来源已在对话中提及、此轮未逐项深入核查的参考

- Python Packaging：<https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/>。
- SQLAlchemy ORM：<https://docs.sqlalchemy.org/en/20/orm/quickstart.html>。
- SQLAlchemy Session：<https://docs.sqlalchemy.org/en/20/orm/session_basics.html>。
- Alembic：<https://alembic.sqlalchemy.org/en/latest/>。
- Pydantic：<https://docs.pydantic.dev/latest/concepts/models/>。
- Astropy FITS：<https://docs.astropy.org/en/stable/io/fits/>。
- SQLite FTS5：<https://www.sqlite.org/fts5.html>。
- SQLite WAL：<https://www.sqlite.org/wal.html>。
- LangChain 检索：<https://docs.langchain.com/oss/python/langchain/knowledge-base>。
- LangGraph Memory（概念参考，不是必装组件）：<https://docs.langchain.com/oss/python/langgraph/add-memory>。
- ComfyUI `folder_paths` 源码：<https://github.com/Comfy-Org/ComfyUI/blob/master/folder_paths.py>。
- Siril 教程：<https://siril.org/tutorials/>。
- Siril 脚本说明：<https://siril.readthedocs.io/>。
- Cosmic Python（Service / Repository / Adapter 架构）：<https://www.cosmicpython.com/>。
- Skills CLI：<https://skills.sh/docs>。
- ComfyUI V3 官方 Node 样例：<https://github.com/Comfy-Org/ComfyUI/blob/master/custom_nodes/example_node.py.example>。

## C. 这些网页**不能证明**什么

1. 官网 API 说明不能证明用户 Windows 仓库中已按 V3 正确调用，也不能代替宿主 0.45.0 的真实启动验证。
2. FastMCP Skills 页面不能证明 Codex/Claude/OpenCode 的每个版本都自动支持 Skills Extension，更不能证明本项目已向用户安装 Skills。
3. Comfy Registry 发布文档不能证明具体 `.comfyignore` 设置已经生效；必须检查打包产物。
4. uv Workspace 文档不能证明两个项目已经解决 Python 3.11/3.12 的全部依赖兼容；必须用真实 lock、wheel 与 host tests。
5. SQLAlchemy/SQLite/LangChain 官方支持某种技术，不能证明 Assets/Memory/RAG 的业务 Schema 或迁移代码已经存在。
6. 任何教程中的示例命令都不能作为项目实际通过的 CI/pytest/Host 验证记录。

## D. 参考资料的使用顺序

- **实现 V3 Node**：安装的宿主源码和官方 V3 文档 → Node 当前实现 → Node 测试。
- **改 Frontend**：宿主 Frontend 实际版本/扩展 API → 原 Widget → Playwright/Vitest → 宿主 UI。
- **改 FastMCP**：锁定 4.2.0 安装包 → `gofastmcp.com` 对应文档 → in-memory 和 stdio 测试。
- **改依赖/发布**：真实 `pyproject.toml`、requirements 与锁文件 → Registry/uv 官方规范 → 包内容 & 隔离安装测试。
- **建业务模块**：本套需求基线 → 服务业务规则 → 纯单元测试/数据库/软件 Adapter，必要时引入专项官方文档。


<!-- END 08_官方参考及证据索引.md -->


---

<!-- BEGIN 09_AGENTS.md_建议稿.md -->

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


<!-- END 09_AGENTS.md_建议稿.md -->
