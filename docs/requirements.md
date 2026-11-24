# ComfyUI_AstroPhoto — 产品需求与范围

> 产品定位为面向 ComfyUI 的本地优先天文摄影工作台。需求基线 v0.2 始于 2026-11-16。本文第 2 节描述仓库版本 0.0.1 当前工作树中的实现，发行状态另见[双包发布](publishing.md)。

## 0. 状态约定

| 状态 | 本文用法 |
| --- | --- |
| 已实现（Implemented） | 有源码或运行证据。实际宿主、样本和已验范围随验证记录给出。 |
| 规划（Planned） | 已列入产品目标，依赖和交付尚待实现。可选方案在相应目标中单列。 |
| 历史（Historical） | 特定版本的设计、实现或运行记录，保留其日期和适用条件。 |
| 未验证（Unverified） | 所述结果缺少相应环境或样本的验证。 |
| 已废弃（Deprecated） | 已有明确停用决定的能力或约定，例如旧侧栏的独立语言设置。 |

一个领域可部分实现。ComfyUI 负责图与执行，扩展负责天文业务和持久化。人通过侧栏和节点工作，外部 Agent 经 MCP 调用已公开的操作。知识检索、记忆、参数实验和产品 Skills 是后续目标。长期架构决定和接口契约见[架构](architecture.md)和 [MCP](mcp.md)。

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

| 领域 | 已实现 | 规划或验证边界 |
| --- | --- | --- |
| 宿主、节点与工作流 | V3 注册、原生状态路由、Vue 画板与侧栏、节点浏览、收藏和本地画布添加／拖拽。绘图保留 PNG 上传、控件序列化、翻译和 `LoadImage` 委托。 | MCP 画布桥接、执行工具与回执仍属规划。旧工作流像素恢复和临时 PNG 引用有宿主证据，下游 `vue-basic → PreviewImage` 完整执行待复验。 |
| 存储、设备与资产 | 数据根、工作区、缓存、Reference/Copy 导入和迁移。设备与光路设置、Assets 的 Projects / All Assets / Calibration Library、集合、会话、校准分配，以及素材与集合来源节点均已接入。 | 观测地、Capture Profile 和自动推荐合适校准场属后续范围。素材库的真实宿主及性能验收按用例记录。 |
| 软件处理 | Siril 1.4.5 Bundle 提供软件探测与配置、命令目录、脚本节点、FITS 路径传递、候选预览和正式处理。 | PixInsight Adapter 和其他软件集成属规划。已登记命令的本机可运行性取决于 Siril 构建和输入。 |
| 外部 Agent | 独立 FastMCP stdio 服务提供版本与连接诊断，素材登记、会话及浏览器审批可分别授权。 | 设备结构变更后的 MCP 适配、运行时跨包版本协商、知识 RAG、可持久化的用户记忆、参数实验和用户侧 Skills 属待办或规划。 |

工作树中的注册与界面可从[扩展入口](../__init__.py)和[素材库界面](../frontend/src/features/assets/AssetsPanel.vue)核对。摄影素材库的关闭记录为 PARTIAL，Siril 也按样本与用例记录验证范围。见[素材库验收](../.agents/archive/04-equipment-optical-trains/Close.md)和[Siril 实现](siril.md)。Vue 迁移目标和旧 React 的 IMAGE 执行证据分别见[开发与验证](development.md)和[历史宿主记录](react-sidebar.md)。

## 3. 六个核心业务域与系统能力

### 3.1 FR-01 系统状态与能力发现 [部分实现]

已实现 Extension/API 版本、绘图节点和路由注册状态、有效数据根或配置回退路径，以及未实现能力说明。当前也报告资产库健康及 Siril 处理可用性。下列跨组件版本协商、在线前端发现和未来领域的健康指标仍属目标。

- 返回 Extension、MCP、ComfyUI 及前端可识别版本；提供健康检查。
- 返回节点注册、数据库初始化、外部软件、RAG 索引、Memory 开关及 Canvas Bridge 在线状态。
- `capabilities` 返回机器可读的能力 ID、是否可用、不可用原因、所需版本/软件；不要凭 Skill 文件存在推断能力存在。
- 连接异常、依赖缺失、版本不匹配要明确区分，提供可执行的修复提示。

### 3.2 FR-02 Asset / Equipment / Observing Site [部分实现]

**设备与设备组合已实现**。设备支持相机、望远镜/摄影镜头、光学附件、滤镜和其他，统一记录名称、产品名及备注，设备可归档与恢复。设备组合可保存不完整配置，每个组合维护一份当前配置。设备字段调整后 MCP 设备工具尚待适配。见 [设备](equipment.md)。

素材列表提供统一导入入口；导入方式由配置决定，项目引用在素材登记后管理。

项目添加素材时显示目标项目及逻辑文件夹，复用素材库搜索与实际数据筛选，允许跨四类素材多选，显示当前项目已引用项并阻止重复选择；批量引用一次提交，失败保留选择。

项目工具栏保留搜索；空白区右键创建项目，项目或节点右键提供新建文件夹及添加素材。重命名可在失焦时保存有效修改，新建行失焦取消。

素材导入先选子帧组、视频、主帧或图像结果。子帧组可追加多个文件夹并在导入前逐条移除文件，每帧拥有独立文件身份，组保存拍摄参数与绑定。其他入口接收一个文件，主帧与图像结果共用同一业务模型。配置页自动预检，不选择项目。仅登记和复制共用配置规则，复制子帧组可选多个位置，重试保留已登记的文件。

素材详情支持编辑名称、备注及设备滤镜绑定；子帧组可编辑帧类型、校准状态和组级拍摄参数，单帧不允许独立修改这些参数。移除组或单文件的登记保留原始文件，项目和校准来源引用需要先解除。Light 可选 Dark、Bias、Flat 主帧，Flat 可选 Bias、Dark Flat；前端展示参数或设备差异及未知，不因差异或未知阻止绑定，温度不参与后端比较。

素材列表显示名称及识别信息。组详情展示组级拍摄参数和绑定，单帧详情显示所属组和文件位置；视频、图像结果展示各自目录记录。单帧界面不提供旧属性编辑。

视频、主帧和图像结果支持在导入时或详情中选择、修改和解除设备组合绑定，滤镜从所选组合中选择；绑定保存设备及滤镜快照，设备后续变化不自动改写历史素材。

可从子帧列表取消单帧登记，源文件保留，空组仍可访问。组详情显示绑定时非滤镜设备的名称和产品名，以及本组实际选用的滤镜。

分类筛选依次提供全部、子帧组、视频、主帧和图像结果。主帧与图像结果依照导入时选择的入口分类。

校准主帧作为素材库主帧直接导入并记录用途与参数，子帧组可绑定 Dark、Bias、Dark Flat 和 Flat 等适用主帧。绑定显示部分参数的差异与未知，温度仅保存登记值，绑定不改变子帧组的校准处理状态。文件已导入而绑定失败时可单独补绑。项目使用逻辑目录引用素材，移动和删除项目节点保留素材文件。子帧组、项目和校准关系统一使用目录模型。自动校准推荐仍待实现。

- 扫描用户选择的目录，按 Capture Session、目标对象、设备、滤镜及 Frame Type 建立索引。
- 基础格式：FITS、TIFF、PNG/JPEG；SER、视频及 XISF 通过具体适配器逐步支持，避免声称均已可无损解析。
- 读取 FITS Header，保留原始键值与标准化元数据；区分值为 `observed / inferred / user_confirmed`。
- 支持 `LIGHT / DARK / FLAT / BIAS / DARK_FLAT` 分类、重复文件检测、缺失文件检测、文件重新定位。
- 建立 Light 与 Master/单张校准场关联；匹配需参考曝光、温度、Gain/Offset、Binning、相机模式、滤镜、光学链路及主校准场适用性，不是一律按文件名匹配。
- 校准比较返回候选、匹配理由、缺口及冲突；不得声称证据不足的素材必然匹配，差异和未知不阻止用户或 Agent 指定的绑定。
- 原始文件默认不改动，数据库保存路径、大小、指纹及元数据；大文件不嵌入 SQLite。

**观测地（规划）**

- `ObservingSite` 保存用户主动设置的常用地点、时间区、可选经纬度。
- `LightPollutionEstimate` 保存来源、采样/数据集年份、辐亮度/天空亮度及估算不确定性；不可把 VIIRS 辐亮度、模型推算 SQM、Bortle 粗分类和实测值混为一谈。
- 获取精确位置或向外部光污染 API 发送坐标前必须用户同意；可只保存地点名称与粗粒度区域。

### 3.3 FR-03 外部软件注册与 Node 封装 [部分实现]

Siril 已按处理 Bundle 实现。通用注册、其他软件与对外节点发现仍按下列目标演进。

- `Software Registry` 负责软件 ID、候选路径、已确认路径、版本、验证结果与 Capability Catalog。
- 软件检测顺序：系统已知安装位置 / PATH 自动检测 → 前端人工选择或 Agent 提交候选路径 → Extension 验证 → 保存。
- 只有通过验证的命令/脚本接口才可执行；进程调用使用参数数组、限制工作目录、超时、可取消、日志隔离，拒绝任意 Shell 拼接命令。
- 首批 Adapter：Siril（`siril-cli` / 脚本）；PixInsight（按其脚本接口及授权限制独立实现），不共享未经验证的 CLI 假设。
- Node 类定义保持稳定 ID 和输入输出 Schema，ComfyUI 加载时注册。软件未安装时：已保存节点仍可被识别，但在自有节点浏览器中标记 `unavailable`，执行时提供明确错误；安装后更新能力状态，不依赖运行时增加全新 Python 类型。
- 通过 `node_search` / `node_describe` 提供节点能力和 Schema。**一个软件操作是一个 ComfyUI Node，不等于一个 MCP Tool。**
- 专业处理节点传递已登记素材的文件路径，科学像素和元数据保留在 FITS 文件中。预览使用可重建的图像文件，正式处理使用原始文件。
- 未来可按序列、Mask、报告及科学元数据需求设计独立类型，历史 `ASTRO_FRAME` 规划保留，当前 Siril 链不依赖该类型。

### 3.4 FR-04 Canvas / Workflow [部分实现]

浏览器内的添加、拖拽、撤销和保存沿用宿主。下列跨客户端控制和执行工具属于规划。

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

规划中的记忆归扩展持有，更换外部 Agent Harness 后仍可由用户管理。其证据可以引用工作流回执，记忆本身与执行历史、领域知识分别存放。

**信息分层**：
1. **业务事实**：设备、观测地、光污染与资产在 `assets.db`，Memory 仅存引用和用户解释，不复制权威资料。
2. **行为历史 Event Log**：用户/Agent/系统的关键动作，记录来源、会话、对象、时间、是否成功；不保存无价值的每次鼠标移动或整段聊天。
3. **显式偏好**：用户确认的颜色风格、噪声容忍度、常用流程、参数区间和默认设备。
4. **推断偏好**需以用户的实际选择或反馈为证据，保留适用场景和置信度。禁止仅根据 Agent 自动执行的操作推断用户偏好。
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

规划中的记忆记录可保存某用户对 HOO 图像调色阶段饱和度的偏好。原设计示例如下，实际记录需关联已获授权的 `profile_id`。

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

### 3.7 FR-07 Experiment / Subagent Optimization [目标]

- 保存 `experiment_id`、目标 Workflow/Node、输入 asset、固定参数与待优化参数、评价指标、预算/次数上限、停止条件。
- 每次 Trial 保存 `trial_id`、workflow snapshot/hash、参数、软件版本、运行环境、输出文件、耗时、指标、失败原因与人工反馈。
- Agent/Subagent 可循环执行 `node_describe → parameter proposal → workflow_run → result metrics → next proposal`。
- 自动评价与用户审美评价分离：SNR、FWHM、背景梯度等是技术指标，不必与用户“更喜欢”一致；允许手动优选。
- 外部 Harness 决定 Subagent 分工与搜索策略；MCP 不创建内部 Agent Runtime。
- 提供取消、恢复、重复、查看最佳 Trial 与写回工作流；避免无上限循环和覆盖原始文件。

### 3.8 FR-08 Agent Skills [目标]

产品 Skill 描述跨步骤的天文任务，声明所需能力，依赖通过验证后才可作为可用能力公开。产生副作用的操作须通过受控工具。现有 MCP 只接入了有条件的 Provider。分发目录、工具与知识和记忆的边界见 [MCP 契约](mcp.md)。

产品目标包括由支持 Skills over MCP 的客户端发现 Skill，以及在用户明确操作后为其他客户端提供本地安装或资源读取途径。`astrophoto-mcp skills list/install` 是拟议的 CLI，仍待实现和客户端兼容验证。

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

## 4. 安装、升级与兼容性

扩展与外部 MCP 从同一仓库构建，使用统一版本。通过 Comfy Registry 安装扩展时，正式包依赖对应版本的 PyPI MCP。独立安装在其他环境的 MCP 由该环境升级和重启。ComfyUI、前端、外部软件及模型各自保留版本。运行时版本协商仍属规划。现有状态接口使用 `api_version`，旧设计候选名为 `api_schema_version`。Git 安装、Manager 更新和客户端兼容性需分别验证。

运行时所有权、当前模块、拟建业务库与模型路径见[系统架构](architecture.md)。渐进式工具发现和规划接口见 [MCP](mcp.md)。实际仓库布局和支持环境见[开发与验证](development.md)。锁步版本、公共索引安装检查和失败后重试流程见[双包发布](publishing.md)。

## 5. 安全、隐私与可靠性

- **访问控制**：默认面向本地可信部署；如 HTTP 对局域网开放，须验证认证/授权、CSRF/Origin 风险和用户隔离，不能默认把本地文件管理 API 暴露给所有连接者。
- **文件系统**：用户授权的扫描目录与产物路径分开；路径规范化、防目录穿越、禁止通过 MCP 任意读写用户硬盘。导入为只读，删除和移动操作须显式确认。
- **可执行软件**：只允许已验证的程序路径和已定义命令模板；参数白名单、超时、取消、输出隔离，避免命令注入。
- **记忆隐私**：有开关、透明采集、可审核证据链、可清理；不得把长期偏好、位置与设备信息自动注入全部 Skill 或发送到外部服务。
- **Skills 安全**：MCP 分发的 Skill 内容需要 Host 信任/同意机制；Skill 文档本身不等于执行授权。可执行脚本更应转为受控 Tool。
- **运行可靠性**：结构化 `run_id` / `request_id` / `trial_id`、幂等、取消、失败重试上限、可重放的 Workflow Snapshot；产物由 ComfyUI 执行路径生成且可追溯。
- **数据维护**：数据库迁移、备份与恢复测试；知识索引重建与业务数据备份分开；事件清理不误删设备/Asset 事实。

## 6. 测试策略与验收

### 6.1 分域验收目标

下表包含规划功能的验收目标。现有测试和运行命令见[开发与验证](development.md)。

| 位置 | 覆盖 |
|---|---|
| `tests/nodes/` | ComfyUI Node 注册、IMAGE/ASTRO 类型转换、数据完整性 |
| `frontend/tests/` | Widget 注册、画板序列化、设置面板、Bridge 回执、隐私开关 |
| `mcp/tests/` | Tool Schema、stdio initialize/list/call、HTTP MockTransport、Skills 资源和 CLI |
| `tests/backend/` | 设备/资产/校准匹配、软件路径验证、RAG/Memory 逻辑、Trial 记录 |
| `tests/integration/` | 真 ComfyUI 环境下执行 Workflow、Canvas 在线命令、Siril Adapter |
| `tests/packaging/` | 版本一致性、MCP Wheel Skills 完整性、Registry 文件清单、双包隔离 |

### 6.2 核心验收场景

- **兼容**：原有 `vue-basic` 节点和 Canvas PNG → `/upload/image` → `IMAGE` 路径不回归。
- **入库**：指定拍摄目录导入后正确区分 Light/校准帧，重复导入幂等，不修改原始文件。
- **匹配**：给出可解释的校准场比较；没有足够数据时报告未知，绑定由用户或 Agent 决定。
- **软件**：Siril 未安装时节点可识别但不可运行；路径验证成功后显示可用；失败可诊断。
- **画布**：前端在线时 MCP 命令返回真实回执；离线时不谎报修改成功；运行 API 可独立提交已保存 workflow。
- **知识**：返回至少一个可验证官方来源及章节；索引可重建；无 Embedding 模型仍能 FTS 检索。
- **记忆**：未经授权不采集行为；明确反馈能形成可编辑偏好；用户删除记忆后检索不可恢复该数据。
- **实验**：固定输入和版本可重放 Trial；预算/取消生效，最佳结果与原始指标保留。
- **Skills**：发行 Wheel 含完整 SKILL.md；能力缺失 Skill 不误执行；支持的 Host 能读取，旧 Host 有明确备用安装方式。
- **发布**：`mcp/` 不进 Comfy Registry 归档；Extension 源码不进 MCP Wheel；依赖先上 PyPI 后发布 Extension。

## 7. 长期实现优先顺序

1. **P0 工程基础**：保证脚手架不回归；完善 ComfyUI aiohttp 业务 API、三方所有权、版本校验、MCP 状态/能力、双包发行检查、测试。
2. **P1 资产与软件基础**：`assets.db`、设备/观测地/校准关联、Siril 软件发现/验证、节点能力目录、资源型数据接口。
3. **P2 自动化处理**：Canvas Bridge、Workflow/Experiment 工具、Siril 核心 Node，首批导入/校准/工作流 Skills。
4. **P3 知识与个性化**：FTS5 知识库、记忆的显式设置与事件证据、Agent 场景召回，再增加可选向量检索及偏好推断。
5. **P4 生态扩展**：PixInsight Adapter、更多专业节点、天文子领域 Skills、长期调参与跨 Host Skill 安装兼容性。

上述顺序依赖真实能力：**先有 Tool，再发布可执行 Skill；先有可解释的反馈，再自动推断用户偏好；先有稳定 Software Adapter，再扩充大量 Nodes。**

## 8. 待进一步验证的工程问题

这些是需要通过原型或 CI 解决的**未决细节**，不是已实现承诺：

1. 当前 `uv workspace` 在不同 ComfyUI Python 版本和 Manager 安装路径中的依赖解析及冲突情况。
2. ComfyUI 前端版本差异对 Canvas Bridge/Sidebar/Widget 的影响，特别是 Nodes 2.0。
3. PixInsight 的可自动调用脚本接口、许可与跨平台执行边界。
4. 每类科学数据自定义 ComfyUI 类型的传递、缓存、序列化和保存策略。
5. 观测地光污染数据源、使用许可、缓存周期与模型不确定性展示。
6. sqlite-vec 在 Windows/ComfyUI Python 环境中的二进制扩展加载与分发测试。
7. Codex、Claude Code、OpenCode 对 MCP Skills Extension 的实际支持与可靠的本地降级方案。
8. 不同 ComfyUI 安装方式中的认证能力、用户隔离和持久化目录选择。

## 9. 官方/一手技术资料

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

## 10. 历史校准记录

2026-11-16 的审计将当时的 FR-01 和 FR-02 记为部分实现，将后续天文业务和产品 Skills 记为规划。证据保存在[历史验证快照](../.agents/handoff/core/verification.md)。此后已接入的领域见本文第 2 节。
