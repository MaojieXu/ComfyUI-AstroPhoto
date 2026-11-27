# Agent、天文知识库与软件节点 SOP — DEV

初始化：chat1 · 2026-11-25 16:37 -06:00

## 当前状态

- 阶段：共享 Feature 持续推进。chat3 的来源与聚合、素材自动同步、Workflow / Canvas / Run / Node 首版及统一素材删除已实施并完成局部验证。Workflow / Canvas / Node 七项独立审查修复待复审和用户手验；真实 Siril CLI、活动任务定向取消及当前聊天 MCP 重连验证仍待完成。分层软件节点清单和记忆、历史版本后置。详见 TASK-chat3-003～009、DEV-chat3-025、DEV-chat3-032 与 TC-chat3-008～009。
- Updated by: chat3 · 2026-11-27 08:18 -06:00

## 实施策略

各 Chat 先核对现有实现和契约，再讨论各自需求及验证。共享文档、数据集、接口及跨方向依赖在实施前协调；并行修改前重读共享文件，避免覆盖。

## TASK-chat3-009：统一素材删除

- Created / Owner: chat3 · 2026-11-27 07:29 -06:00；Updated: chat3 · 08:03 -06:00；FR-chat3-007；状态 Implemented，整套相关回归通过。真实宿主已重启，确认弹窗与新建 stdio 会话已验证。当前聊天的旧 MCP 连接仍需重连，见 DEV-chat3-032。
- 范围：素材库删除服务、公开 API、MCP 工具与分类、相关测试和权威文档；复用既有所有权与引用校验。设计文件与数据库操作的中断恢复、并发冲突和部分失败回执，不能仅由 MCP 顺序拼接旧接口。
- 验证：单素材、子帧组和单子帧、外部引用、共享文件、预览后变化、故障和重试，以及 MCP 工具发现和旧工具清除。见 TC-chat3-009。
- chat3 · 2026-11-27 07:38 -06:00：扩展任务覆盖删除影响查询和用户确认，后端统一执行及核对确认依据，MCP 和前端使用同一规则；预期还需产品与独立 UI/UX 审阅、受影响前端入口及测试。关联变化时须重新检查，防止对过时影响确认后删除。

## 任务

| ID | Owner Chat | 目标 | 预计范围 / 依赖 | 状态 |
| --- | --- | --- | --- | --- |
| TASK-chat1-001 | chat1 | pi agent 与现有 MCP 环境联调、skill 优化、数据集构建及产品测试 | 接口、数据和文件范围待调研；与 Chat2 的数据需求待协调 | Planned |
| TASK-chat1-002 | chat2 | 天文知识库：LangChain 数据获取、处理、模型训练与测评 | 数据来源、模型、资源、接口及与 Chat1 的依赖待确认 | Planned |
| TASK-chat1-003 | chat3 | Siril 可执行程序及 CLI 注册公用节点流程 SOP | 现有 Siril 实现及共用接口待调研；未来其他软件适用范围待确认 | Planned |

任务由 chat1 于 2026-11-25 16:37 -06:00 创建；Owner 表示用户指定的方向归属，并非已启动。各方向的具体文件和局部验证计划待方案确定。

## 待决 / Proposed

各方向先细化需求、分工边界、共享接口和验收，再制定实施计划。

## TASK-chat3-001：单素材来源节点

- chat3 · 2026-11-25 16:58 -06:00；FR-chat3-001；状态：已实现，真实宿主拖拽待验证。复用素材解析、V3 节点及画布逻辑，调整单素材拖拽、节点展示与路径接口。见 DEV-chat3-001。


- chat3 · 2026-11-25 17:01 -06:00：TASK-chat3-001 名称与路径在隔离真实宿主得到局部验证，原预览仍需重启；见 DEV-chat3-002。


- chat3 · 2026-11-25 17:06 -06:00：预览宿主已重启并恢复原素材库；自动重启工作约定见 AGENTS.md 和 DEV-chat3-003。


## TASK-chat3-002：分层操作清单与节点注册方案

- Created / Owner / Updated: chat3 · 2026-11-25 17:16 -06:00；关联 FR-chat3-002、TASK-chat1-003；状态 Planned，用户仅确认并要求记录，尚未授权实现。
- 策略：先对照现有 Siril 命令表、节点工厂、执行适配、预览、ComfyUI V3 注册与官方能力，确定可复用部分和轻量清单格式；设计软件清单、分类文件、操作 Schema、适配与生成的职责，再以 Siril 验证。
- 预计范围：`extension/siril/`、可能的共用清单/节点生成与 CLI 代码、根节点注册、相关前端及测试、`docs/`；具体文件及与其他 Chat 的共享接口实施前重读并协调。本条不授权改动这些文件。
- 验证方向：清单读取和分组、重复或缺失项、生成节点注册和端口、输入输出、CLI 失败与结果预览，以及真实宿主和真实软件边界；见 TC-chat3-002。

## TASK-chat3-003：来源与复制聚合节点

- Created / Owner / Updated: chat3 · 2026-11-25 17:40 -06:00；关联 FR-chat3-001 v2、TASK-chat3-001；Implemented（局部验证），更新：chat3 · 2026-11-26 16:00 -06:00。
- 目标：以文件来源、文件夹来源、文件聚合替换现有四节点；素材库及项目的文件与子帧组、分布式文件及本地目录可参与聚合。复用现有素材解析、文件复制、容量及运行生命周期能力；明确多输入端口及下游租约后实施。
- 预计涉及 `nodes/`、`astrophoto/assets/`、`astrophoto/storage/`、`extension/siril/` 相关端口、前端拖拽与控件、测试及 `docs/`；具体范围实施前重读并协调共享文件。
- TASK-chat3-001 为 v1 已实现历史，其节点划分被 FR-chat3-001 v2 取代；需按 TC-chat3-003 新设计重新验证。具体后缀格式、递归选项和清理实现待设计。

- chat3 · 2026-11-25：TASK-chat3-003 已获用户授权并开始实施；预计修改节点、素材拖拽、存储聚合、Siril 调用、测试及文档，完成后记录实际范围。


- chat3 · 2026-11-25 17:45 -06:00：TASK-chat3-003 进行中；已建立聚合复制基础与局部测试，节点注册及端到端生命周期尚未完成，见 DEV-chat3-006。


- chat3 · 2026-11-25 17:52 -06:00：TASK-chat3-003 仍进行中；新增源变化测试，未完成的节点接线已撤回；目录生命周期和节点集成仍待实现，见 DEV-chat3-007。


- chat3 · 2026-11-25 18:08 -06:00：TASK-chat3-003 的三个文件节点已实现并完成局部验证，见 DEV-chat3-008。按用户最新指示，Siril 适配与验证从本任务范围移出。

- chat3 · 2026-11-25 18:15 -06:00：完成 FR-chat3-001 的节点文案与来源选择界面增量，见 DEV-chat3-009。


- chat3 · 2026-11-26 16:00 -06:00：TASK-chat3-003 界面优化已实施，局部验证见 DEV-chat3-011；真实画布视觉与交互待验证。

- chat3 · 2026-11-26 16:07 -06:00：TASK-chat3-003 节点及动态端口名称简化已实施，见 DEV-chat3-012；实际宿主画布重开、两种渲染模式待核对。

## TASK-chat3-004：素材变更自动同步

- Created / Owner / Updated: chat3 · 2026-11-26 17:23 -06:00；FR-chat3-003；Implemented（局部验证）。
- 在数据库素材事务提交后通过 ComfyUI 消息通道通知；侧栏、项目素材选择和来源节点复用 API 重新读取，连接恢复时补刷新。见 DEV-chat3-013；真实宿主完整画布视觉验证待执行。

## Canvas Bridge 复核提案（已确认）

- chat3 · 2026-11-26 17:43 -06:00。按产品 FR-04 复核当前仓库、目标 ComfyUI 0.46.0 / Frontend 1.59.6 构建和既有宿主报告。本条为方案记录。
- 前端通过现有 Extension 入口注册画布桥。单独的同源连接将命令与回执绑定到同一页面，后端仅暂存命令状态；MCP 继续按已选 ComfyUI 实例调用公开 HTTP。页面、工作流和图范围共同定位，写入时核对实际图对象、图内容版本及编辑状态。批量命令预检并回报实际执行项，宿主撤销以真实验证为准。
- 复用本地加节点逻辑和宿主连线、控件能力，约定 MCP 传图坐标。已打开画布可查找节点实例，已安装节点定义从 object_info 获取。执行按根工作流序列化快照提交，验证原生队列的 Widget 回调和准确任务关联；目标宿主已有单任务 Jobs 查询与取消路由。快照提交和画布编辑分别出具回执。
- 侧栏最小反馈为连接状态及工作流目标，运行进度沿用宿主队列。默认建议只自动选择唯一合格的目标，目标随工作流或图切换失效，输入已连接时显式要求替换。独立 UI/UX 审阅为源码与设计规范复核。现有报告覆盖本地加点相关路径，新的桥接、并发、执行回执和实际界面仍待实现与验证。

## TASK-chat3-005：Canvas Bridge 首阶段

- chat3 · 2026-11-26 17:55 -06:00。FR-chat3-004。用户批准实施，首阶段已实现并通过局部实机验证。见 DEV-chat3-014。范围为宿主 HTTP/Canvas、AstroPhoto 前端扩展、MCP 工具注册和对应的独立宿主验证。先完成实时编辑，再验证提交回执。

## TASK-chat3-006：节点调参与六图预览（初始提案，现见 TASK-chat3-008）

- chat3 · 2026-11-26 18:02 -06:00；FR-chat3-005；Proposed。先核对现有 Siril 候选任务、Inspector、FITS 显示和 MCP 图像传输能力，设计完整图处理后的全图与原始坐标裁片，复用现有预览交互。当前 Siril 前端预览仍识别旧来源节点，高清查看与新文件来源接入待验证。
- 预计涉及 `extension/siril/`、`astrophoto/assets/fits.py`、`frontend/src/features/nodes/preview/`、`mcp/src/astrophoto_mcp/` 和测试；具体范围及节点能力注册尚待确认。当前只记录需求，不授权实施。

## TASK-chat3-007：三层管理与全局 MCP 记忆设计（拟议）

- Created / Owner / Updated: chat3 · 2026-11-26 19:20 -06:00。FR-chat3-006，关联 TASK-chat3-005 与 TASK-chat3-006。已记录需求，尚未授权实施。
- 拟复用 ComfyUI 工作流文件保存图，以 AstroPhoto 持久化存储管理历史索引、分层记忆、审计与偏好，通过 MCP 提供按层检索和写入。先核对宿主原生 CRUD、明确文件与实时图的边界，再评估稳定标识和检索接口。现有 Canvas 工具保留，Node 调参复用已有拟议任务。具体文件、Schema 和工具名称待设计与确认。
- 验证计划见 TC-chat3-007，记录见 DEV-chat3-017。新增 MCP 工具后通过重连的当前 Agent 会话验证工具发现，参见 DEV-chat3-016。


- chat3 · 2026-11-26 19:23 -06:00。TASK-chat3-007 的存储及访问方向已确认，详见 FR-chat3-006 修订。AstroPhoto 扩展负责记忆服务与公开 API，首版复用现有 SQLite 并按用途分表。文件内容及大型产物按其各自生命周期保存，MCP 经 API 给 Agent 提供按任务召回和按对象管理。具体 Schema、引用清理和工具签名待设计，未开始实施。见 DEV-chat3-018。



## TASK-chat3-008 · MCP Workflow、Canvas、Run、Node 分期交付

- Created / Owner / Updated · chat3 · 2026-11-26 19:53 -06:00。关联 FR-chat3-004、FR-chat3-005、FR-chat3-006，细化 TASK-chat3-005 的执行缺口与 TASK-chat3-006 的当前调参路径。TASK-chat3-007 中的记忆设计后置。初始状态 Proposed，实施状态见下方修订。
- 0 契约与复用。以已运行 Canvas 工具为基线，确认宿主工作流目录与多用户身份、新标签草稿保留、原生整图保存、前端提交回调及精确取消；确定可写字段、回执和错误。MCP 只调用宿主与扩展公开 API。注册、工具发现和 API 文档/快照按每套同步。
- 1 Workflow。核心交付 workflow_list、workflow_get、workflow_new、workflow_open、workflow_save；先从列出、打开、另存打通。重命名/移动、删除和导入在第二批补齐工作流管理。文件操作复用宿主 userdata，在线打开和保存复用现有画布桥与宿主流程。默认另存及保护草稿为推荐；覆盖、删除/改名与前端状态交互须验证。文件修订检测不能冒充原子文件 compare-and-swap。预计 MCP workflow 模块、注册和发现、画布路由与前端 host 桥。
- 2 Canvas。保留已实现的七个工具及五种 canvas_apply 动作，补主/子图定位、自有节点来源筛选、冲突和回执回归。修改依赖 session、图目标及修订标记；批量部分执行据实报回。预计 MCP canvas、astrophoto/api/canvas.py、frontend/src/host/canvas* 及相关测试。
- 3 Run。workflow_run 捕获并提交指定图的确定快照，返回真实宿主任务 ID；workflow_status 跟踪状态和产物，artifact_get 查询已授权产物，workflow_cancel 仅在单任务取消验证通过后交付。用请求 ID 处理重试与查询，超时不能自动重复入队。预计 MCP 执行模块、宿主桥和真实宿主运行测试。
- 4 Node。首个验证节点建议用已有 Siril 自动拉伸预览。复用 PreviewService、正式处理路径中的算法和 Inspector。node_inspect 获取准确输入与当前结果，node_preview 每轮基于原输入和一组参数提交，node_preview_status 回读，node_compare 返回可供模型查看的同尺度原图与结果，node_preview_list / node_preview_discard 管理近期临时结果。通过画布编辑写回已验证的参数；预览时保持图不变，应用前重核目标、图修订及输入指纹。保存仍走 workflow_save。预计 extension/siril、FITS 预览和缓存、MCP 节点预览模块及相关测试。
- 每段先跑自动回归与真实宿主联调，再交给用户手验。交付包含可运行工作流、数据、具体 MCP 调用、预期与证据；区分开发验证、待用户手验和已验收。过程见 TC-chat3-008，MCP 工具更新后用重连的 Agent 验证工具发现，见 DEV-chat3-016。


- chat3 · 2026-11-26 19:56 -06:00。TASK-chat3-008 的拟议工具字段、回执、冲突与宿主复用细则见 [TECH.md](TECH.md)。FR/AC 和任务状态保持现有记录，尚未开始实施。见 DEV-chat3-020。

- chat3 · 2026-11-26 20:44 -06:00。用户授权实现。Workflow、Canvas、Run、Node 已接入，工作流导出按用户要求移出交付。原位覆盖在 MCP 关闭。见 DEV-chat3-021 和 TC-chat3-008。待用户分套手验，当地 Siril CLI 尚未配置，真实候选处理待复验。

### TASK-chat3-008 · 独立代码审查交接

- 2026-11-26 20:53 -06:00 · chat3（实施 Chat）。范围为 DEV-chat3-021 对应的 Workflow、Canvas、Run 和 Node 实现，关联 FR-chat3-004 AC-01～03、FR-chat3-005、FR-chat3-006 AC-01～03 与 TC-chat3-008。依据最新范围，移出 JSON 导出，历史版本、长期记忆及外部软件分层清单另走各自任务。
- 初始交接记录见 DEV-chat3-022。用户随后委派独立子 Agent 完成审查，七项发现及修复状态见 REVIEW-agent-origin-main-001；修复后的独立复审尚未执行。

- 2026-11-26 21:13 -06:00 · chat3。TASK-chat3-008 的 DEV-chat3-022 初审 F01～F06 修复与专项回归完成，见 DEV-chat3-024。独立审查和 TC-chat3-008 用户手验保持待执行。

- 2026-11-26 21:34 -06:00 · chat3。TASK-chat3-008 的本次独立审查七项修复进行中，关联 FR-chat3-003/004/005、TC-chat3-008。预计调整宿主队列桥、Siril 输入来源、素材详情刷新、宿主测试和打包忽略规则，并执行专项回归。

- 2026-11-26 21:51 -06:00 · chat3。TASK-chat3-008 已按 REVIEW-agent-origin-main-001 修复七项发现，专项测试与证据见 DEV-chat3-025 和 TC-chat3-008。修复后独立复审及用户手验尚待执行。

### TASK-chat3-017：侧栏标题画布状态
- 2026-11-27 08:26 -06:00 · Owner/Updated by chat3；关联 FR-chat3-017；进行中。复用现有桥接状态，调整 Sidebar、主题样式、中英文文案和相关验证；构建后检查目标宿主、窄侧栏与交互。产品和独立 UI/UX 方案审阅已完成，实施后复核。
- 2026-11-27 08:29 -06:00 · Updated by chat3：已实现，局部验证及独立实机 UI 复核见 DEV-chat3-034；用户当前页面需刷新才能加载新资源，未擅自刷新其工作流。
- 2026-11-27 08:41 -06:00 · chat3：用户批准 FR-chat3-017 单行图标方案，进入实施；更新组件、样式、测试与构建，完成独立视觉复核。
- 2026-11-27 08:44 -06:00 · Updated by chat3：单行图标方案已实现，局部验证与独立视觉复核见 DEV-chat3-035；当前浏览器页面需刷新才能加载新构建。

### TASK-chat3-018：MCP 前五类工具优化
- 2026-11-27 09:15 -06:00 · Created/Owner/Updated by chat3；FR-chat3-018；Planned，用户确认方案但未授权编码。产品经理已只读审阅。优先核对已引入 FastMCP 能否提供所需连接上下文及过期管理，复用现有分页/影响检查和名称解析；短编号不得充当认证或跨调用方共享全局状态，无法可靠绑定时不得错误继续或删除。
- 预计范围：mcp/src/astrophoto_mcp/tools/status.py、equipment.py、catalog.py、catalog_client.py、catalog_models.py、projects.py、disclosure.py、server.py、target.py（按实际需要），现有 MCP 测试及必要的后端公开 API/集成测试，docs/api/mcp、docs/integrations/mcp.md 和打包业务 Skill。先检索仓库/依赖的成熟能力再决定最小实现；不预设新增数据库或依赖。实施后核对全部注册、旧调用方、测试、文档和真实 MCP 发现，相关重启依 AGENTS.md 执行。验证设计 TC-chat3-018；决策与本次文档记录 DEV-chat3-036。

- 2026-11-27 09:19 -06:00 · chat3：用户授权开始完整实现 TASK-chat3-018；分页、删除确认与文档工作并行，按共享文件协调，状态 In Progress。

### TASK-chat4-001：Siril 软件面板优化
- 2026-11-27 09:24 -06:00 · Owner/Updated by chat4；FR-chat4-001；In Progress。产品和独立 UI/UX 已审阅；预计调整 extension/siril/frontend、相关前端测试和 docs/domains/siril.md，保留其他 Chat 改动。完成局部验证、真实宿主界面复核及文档同步。
- 2026-11-27 09:28 -06:00 · chat4：已实现，组件测试与独立真实宿主界面复核见 DEV-chat4-001；真实 CLI 与系统选择窗口待验证。
- 2026-11-27 09:33 -06:00 · chat4：根据用户反馈统一安装指引的展开样式，复用 DetailAccordion；局部验证见 DEV-chat4-002。
- 2026-11-27 09:39 -06:00 · Updated by chat3：已实现，局部验证见 DEV-chat3-037；当前 Agent 旧 MCP 会话需重新连接以加载新的工具 schema。真实多个 ComfyUI 宿主切换、用户手验和 Feature 正式全量验收尚待完成。

### TASK-chat4-002：修复 Siril Windows 自动检测
- 2026-11-27 09:51 -06:00 · Owner/Updated by chat4；修复运行时环境字典大小写导致标准安装路径遗漏；已实现，验证见 DEV-chat4-003。

### TASK-chat4-003：Siril 一键检测连接
- 2026-11-27 09:57 -06:00 · Owner/Updated by chat4；FR-chat4-001；In Progress。复用 discover 与 save，简化候选和手动连接；产品及 UI 审阅完成。预计 extension/siril/frontend、前端测试、Siril 文档及 Feature；不改动后端验证。
- 2026-11-27 10:03 -06:00 · chat4：已实现，局部测试及独立 UI 复核见 DEV-chat4-004；真实保存需用户操作验证。

### TASK-chat3-019：MCP 工具设计 Skill
- 2026-11-27 10:10 -06:00 · Created/Owner/Updated by chat3；用户授权的项目级开发知识沉淀，与 FR-chat3-018 的 Agent 工具易用性相关；Implemented。
- 在 .agents/skills/mcp-tool-design 建立按任务流程、工具契约、长任务恢复与评估渐进加载的 Skill，并保留 39 篇调研来源；不更改 MCP 运行时或产品契约。实际文件和局部验证见 DEV-chat3-038，验证覆盖及缺口见 TC-chat3-019。

### chat2 · 知识库三阶段方向（Proposed）

- 2026-11-27 13:18 -06:00 · chat2 · TASK-chat1-002 / FR-chat2-001。当前为讨论和文档记录，未授权业务实现；具体文件、模型和资源待定。
- 前期：选择获准资料，提取图文及视频语音、关键画面与时间位置；AI 辅助转换为带来源和适用条件的工作流、决策与排查候选，审核并准备独立评测数据。
- 中期：基于 LangChain 组织知识入库与检索；Agent 结合检索结果和未来 `list_node` 的当前节点契约构造工作流。接口和跨 Chat 分工须另行确认。
- 后期：评估清洗准确性、来源支持、检索、处理建议、节点组合及真实图像工作流效果，依据缺陷改进。
- 候选而非已选技术：网页正文提取可评估 Trafilatura；视频文档可先比较 Docling，必要时评估 faster-whisper、WhisperX、PySceneDetect 和 PaddleOCR。模型、部署、自动审核方式及训练均未决定；先以代表性样本实测质量、资源及人工成本。
- 依赖：chat1 数据集和 Agent；chat3 Canvas 节点目录及节点经验；在实现前确认共享接口、范围与负责人。

## TASK-chat1-001：Pi 与 MCP 联调方案（提案）

- Updated by: chat1 · 2026-11-27 13:19 -06:00；任务仍为 Planned，用户要求记录讨论，未确认具体方案或授权实现。
- 讨论目标：从用户场景与可观察预期出发，让真实 Pi 使用 Skill 和 MCP，记录调用与回答，再以公开 API、宿主画布或实际产物独立核对；区分接口测试、Agent 联调和真实宿主产品场景。
- 拟议首批场景：设备或素材查询、隔离合成素材导入、真实画布节点编辑；每项拟重复 3 次探索稳定性，不作为统计可靠性结论或验收门槛。数据集、Skill 优化和产品测试的范围及与 chat2 的依赖仍待确定。
- 拟记录环境及模型、Skill、MCP、宿主版本，初始状态、输入、工具参数和返回、任务标识、最终回答、独立回读、耗时和失败原因。优先确定性断言，语义质量人工复核；模型评分仅供辅助并需校准。
- 复用现有 benchmark/checks/pi_astrophoto.py 和 docs/integrations/mcp.md 的方法，先核对实际适用性；现有 smoke 脚本禁用 Skill 且不覆盖写入。LangSmith 示例及 MCP Inspector 为调研参考，尚未决定引入工具或依赖。
- 涉及共享接口和文件：MCP 工具与 Skill、画布及宿主测试、Feature 文档；实际修改范围未确定，开始前与 chat3 协调并重读最新实现和 FR。画布编辑、运行和节点预览的可用性以实际版本与证据为准。
- 参考：[MCP 评测示例](https://github.com/langchain-samples/eval-concepts/)、[Agent Evals 入门](https://github.com/langchain-samples/agent-evals-101-webinar)、[评测工作坊](https://github.com/langchain-samples/evals-workshop)、[MCP Inspector](https://github.com/modelcontextprotocol/inspector)、[Anthropic Agent 评测实践](https://www.anthropic.com/research/demystifying-evals-for-ai-agents)、[AgentEvals](https://github.com/langchain-ai/agentevals)。
- 待决：首批场景与参数、成功判定、重复次数、数据及环境隔离、评测工具和运行成本；见 TC-chat1-001、DEV-chat1-002。

### chat4 · Siril 面板与连接状态汇总
- 2026-11-27 13:19 -06:00 · Updated by chat4：TASK-chat4-001、TASK-chat4-002、TASK-chat4-003 均为已实现并经局部验证，分别见 DEV-chat4-001～004；早期 In Progress 和逐候选选择后再保存的表述仅为历史，现行一键连接规则见 FR-chat4-001。
- 真实 Windows Siril 1.4.5 已通过宿主自动发现和自动拉伸能力探测（DEV-chat4-003）；真实前端一键连接保存、真实原生文件选择窗口、真实节点完整处理及用户手验仍待验证。完整 Siril 后端套件曾中断，尚不能记为通过；Feature 正式全量验收未执行。

### TASK-chat3-020：MCP 全模块工具审查建议
- 2026-11-27 13:19 -06:00 · Created/Owner/Updated by chat3；相关 FR-chat3-004/005/006/007/018、TASK-chat3-008/009/018/019；Proposed，仅记录审查，不授权实现或改变现行 PRD。
- 已对 8 类 66 个业务工具和 3 个发现入口形成流程、参数、描述及恢复建议，按实际连接会话与源码区分；详见 TECH.md 的 MCP-REVIEW-chat3-001 和 DEV-chat3-039。优先核对连接版本，再讨论画布目标/回执和各模块契约；需产品确认的取舍列在 TECH。
- 验证候选见 TC-chat3-020；现行前五类工具已实现状态和历史验证仍以 TASK-chat3-018、DEV-chat3-037 为准。

## TASK-chat1-004：审查问题修复

- chat1 · 2026-11-27 13:32 -06:00；关联 FR-chat3-001、FR-chat3-004 及 TASK-chat3-008。按用户要求修复审查所列五项；代码已修改，验证尚不完整，状态 In Progress。实际改动和缺口见 DEV-chat1-003，后续需在真实宿主及 Siril 中回归。
