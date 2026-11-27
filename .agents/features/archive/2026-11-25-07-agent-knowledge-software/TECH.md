# Workflow、Canvas、运行与 Node 调参 MCP 技术契约

> 版本 0.3。关联 TASK-chat3-008、TC-chat3-008、FR-chat3-004/005/006。chat3 更新于 2026-11-27 07:21 -06:00。工具实际字段以运行时和仓库导出的 Schema 为准；审查修复、宿主版本依赖与验证范围见 DEV-chat3-025。

## 1. 交付范围和依赖

| 批次 | 交付闭环 | 复用入口 |
| --- | --- | --- |
| Workflow A | 查找、读取、创建空白图、打开、另存并重开 | ComfyUI 用户数据接口、宿主工作流管理、现有画布桥 |
| Workflow B | 重命名或移动、删除和导入 | 原生用户数据接口及工作流标签状态 |
| Canvas | 在现有查找、编辑、连线和回执之上补子图定位与节点来源 | 现有 Canvas 工具、画布桥、节点注册表 |
| Run | 提交确定的整图、查询、定向取消、定位产物 | 宿主原生图转提交数据、任务和历史接口 |
| Node | 先看输入与已有结果，逐轮试一个参数组，看结果，应用并保存 | 现有画布编辑、Siril PreviewService、FITS 渲染与缓存 |

Workflow A 使用已经实现的 Canvas 编辑完成闭环。Canvas 补强和 Workflow B 可分别交付。Run 和 Node 共用目标识别与结果引用。Node 预览调用支持该操作的预览服务，避免每次试参触发工作流的其他输出节点。历史版本、长期记忆、RAG 及向量检索排在后续。

## 2. 通用类型和调用规则

下表用 name:type 写输入与输出字段，? 表示可选。联合类型由工具的真实 JSON Schema 约束。实现时将生成并测试 MCP 实际注册的 Schema。

| 类型 | 含义 |
| --- | --- |
| WorkflowPath | 当前用户工作流库内的相对 JSON 路径，例如 Projects/M31.json。拒绝绝对路径、目录越界、空段和非 JSON 文件。执行端核对规范化结果仍属于该用户的工作流库。 |
| FileRevision | 已保存文件的内容修订标记，用于检测文件变化。没有宿主条件写入保证时，不把先读后写称为原子比较。 |
| CanvasTarget | session_id:uuid, target_id:uuid。分别标识当前在线页面和该页面当前图。切换标签或子图后重新取目标。 |
| GraphGuard | CanvasTarget 加 expected_revision:uuid。编辑当前图时校验图修订。另存、运行整图还要核对宿主根图快照，不能只依据当前子图修订。首版可要求切回主图再保存或运行。 |
| NodeTarget | CanvasTarget 加 node_id:int，ID 只在所属图内有效。 |
| NodeValues | 参数名到标量值的映射。Siril 等命令由扩展验证参数及输入，使用已登记的适配器。 |
| InputRef | 扩展生成的输入引用，绑定所在实例、目标节点、解析结果和源指纹。可追溯到实际输入，调用方不用提供任意文件路径。 |
| TaskId / PreviewId / ArtifactId | 分别标识宿主执行、单轮临时预览和受授权产物。查询时检查宿主实例和调用方作用域。 |

- 当前 MCP 沿用分类发现与调用入口。已发布 Canvas 输入输出按 [Canvas API 参考](../../../docs/api/mcp/canvas.md) 保留。新工具按业务域注册，用户仍通过 ComfyUI 原生入口或自然语言操作。
- 在线写入明确传入目标。读操作只有在唯一可用目标时才可自动定位。多页面、目标丢失或版本变化都要求 Agent 重新读取。工具返回可读错误和必要标识，用户无需手工填写 UUID。
- 对会打开、保存、提交或生成结果的操作，request_id 用于关联回执。回执仍在扩展缓存中时，相同 ID 的不同请求返回冲突。回执被淘汰后，已提交的工作流任务可按宿主任务 ID 恢复；若宿主已有同 ID 任务，重复提交返回 reused 和原任务 ID，不能据此推断当前画布就是原快照。现有 Canvas 使用 command_id。
- 按场景返回 CANVAS_TARGET_CHANGED、GRAPH_CONFLICT、WORKFLOW_EXISTS、FILE_CONFLICT、SOURCE_CHANGED、PREVIEW_EXPIRED 等错误。Canvas 保留原有错误。可明确拒绝的请求返回原因，回执不明确时先查询，不进行盲目重放。宿主重启后的恢复能力以可查询证据为准。
- 外部 MCP 通过 ComfyUI 或 AstroPhoto 公开 API 调用。持久化、跨实例边界和临时缓存由拥有数据的服务负责。日志和长期记忆不构成本阶段前置条件。

## 3. Workflow 工具

| 工具 | 输入 | 返回 | 行为 |
| --- | --- | --- | --- |
| workflow_list | query?:str, folder?:str, limit?:int, cursor?:str | items[{path,name,modified?}], next_cursor? | 查已保存工作流，列表可筛选和分页。 |
| workflow_get | path:WorkflowPath | path, workflow:object, file_revision | 读取最后保存的原生 JSON，当前草稿走 canvas_get。 |
| workflow_new | session_id:uuid, request_id:uuid | target:CanvasTarget, revision, unsaved | 新标签打开空白图，返回可编辑目标。 |
| workflow_open | session_id:uuid, path:WorkflowPath, request_id:uuid | target:CanvasTarget, revision, path, unsaved | 打开已保存的图，保留其他标签的草稿。若目标已打开，使用现有标签且不覆盖其草稿。 |
| workflow_save | GraphGuard, mode?:save_as, path:WorkflowPath, request_id:uuid | path, file_revision, target? | 保存当前整图。默认 save_as，重名返回冲突，成功后返回实际文件标识。 |
| workflow_rename | path:WorkflowPath, new_path:WorkflowPath, expected_file_revision:FileRevision, request_id:uuid | path, file_revision | 原生移动或改名，禁止覆盖目标。须仅允许单个在线页面下操作未打开的文件。 |
| workflow_delete | path:WorkflowPath, expected_file_revision:FileRevision, request_id:uuid | path, deleted:bool | 删除显式指定的已保存工作流。首版拒绝仍打开的目标或存在多个在线页面时的删除。 |
| workflow_import | path:WorkflowPath, workflow:object, request_id:uuid | path, file_revision | 验证 ComfyUI 原生图文档并创建工作流文件，同名返回冲突。 |

实施先用宿主用户数据接口接通 list/get，再通过画布桥接宿主 new/open/save。Workflow B 复用移动与删除入口。尚未验证宿主文件操作与 UI 草稿之间的原子冲突保护，原位覆盖默认不开放，待可靠验证后启用。改名与删除优先在未打开的测试副本上验收。导入时保留宿主原生文档所需字段。

**自动验证**。校验作用域、路径、重名、文件修订变化、MCP 注册和原生文件往返。真实宿主覆盖打开时保留草稿、另存重开，检查导入内容与原生工作流一致。

**用户手验**。留一个未保存标签，让 Agent 搜索并打开另一份图，改一个测试参数后另存为 M31-review，再重开确认。原文件和旧草稿都应保留。用副本依次验证改名、导入和删除，以宿主工作流列表和实际重开为准。

## 4. Canvas 工具

| 工具 | 输入 | 主要返回 | 行为和状态 |
| --- | --- | --- | --- |
| canvas_list_sessions | 无 | sessions[] | 已实现，列出在线页面及当前图。 |
| canvas_get | session_id?:uuid, target_id?:uuid | target_id, revision, nodes[], links[] | 已实现，读当前图及未保存编辑。 |
| canvas_find_nodes | query?:str, node_id?:int, session_id?:uuid, target_id?:uuid | target_id, revision, nodes[] | 已实现，查当前图已有的实例。 |
| node_search | query:str, session_id?:uuid | count, items[] | 已实现，查可添加的类型。可按宿主注册信息的 python_module 精确筛选。 |
| node_describe | node_type:str, session_id?:uuid | node_type, definition, addable | 已实现，查询节点定义。返回可预览能力标记。 |
| canvas_apply | GraphGuard, command_id:uuid, commands:array | state, results[], revision? | 已实现，批量编辑并报告逐项结果。 |
| canvas_command_status | command_id:uuid | state, results? | 已实现，核对未确认的命令。 |
| canvas_list_subgraphs | CanvasTarget | graphs[{graph_id,parent_id?,name,scope}] | 列出当前工作流主图与子图，不切换活动图。 |
| canvas_open_subgraph | CanvasTarget, graph_id:str, request_id:uuid | target:CanvasTarget, revision, scope | 在明确页面进入子图或返回主图。成功后用返回的新目标。 |

canvas_apply 现有动作包括 add_node(node_type,position?,ref?)、set_parameters(node_id 或 ref,values)、remove_node(node_id 或 ref)、connect(from,to,replace?)、disconnect(node_id 或 ref,slot)。端口由节点引用及 slot 定位。connect 的 replace 默认 false。已有 1–32 条命令约束和逐项回执保持。遇到部分成功时读取一次当前图，按实际结果继续。不存在、不可写或不支持的控件返回明确失败。

**自动验证**。复用现有桥接测试，增加双页、主图与子图、过期目标、重复命令和部分成功。覆盖目标宿主两种画布模式，检查工具输出与实际图状态一致。

**用户手验**。让 Agent 在指定测试图添加、改参和连接节点，再断线和移除。在另一页面编辑或切换子图后，确认旧目标的命令不会改错图。用原生撤销核对实际操作边界。

## 5. Run 与产物工具

| 工具 | 输入 | 返回 | 行为 |
| --- | --- | --- | --- |
| workflow_run | GraphGuard, request_id:uuid | state, task_id?, request_id, submitted_revision?, node_errors? | 冻结主图并走宿主前端提交路径，返回原生任务 ID。 |
| workflow_status | task_id:TaskId 或 request_id:uuid | state, task_id?, outputs[], error? | 按已确认任务查队列、历史和产物，也可追查提交未确认时的请求。 |
| workflow_cancel | task_id:TaskId | cancel_requested, state | 精确取消该任务。回执表示是否发出取消，最终状态通过 status 查询。 |
| artifact_get | artifact_id:ArtifactId | metadata, availability, content_ref? | 核对来源、可见范围和当前能否读取，返回可用引用。 |

提交时验证原生前端 Widget 回调，再生成确定快照，核对宿主实际接收的内容。任务 ID 以真实宿主回执为准。使用宿主支持的 prompt_id 与请求 ID 关联。前端按目标队列请求识别提交，运行前校验图修订，并检查序列化期间的变化。该适配使用 Frontend 1.59.6 的队列内部字段，字段缺失时返回 CANVAS_UNSUPPORTED。扩展复用提交回执，浏览器提交前查询该 ID 是否已存在。桥接层跟踪提交状态，出现不确定回执时只查询和恢复关联。定向取消用目标版本的单任务 API 验证后启用，避免将停止当前任意任务当作定向取消。

**自动验证**。两份不同参数的快照各自产生正确任务 ID 和产物，覆盖回调、错误、重放、响应超时和取消隔离。此前的宿主双快照证据只验证了底层路径。

**用户手验**。提交参数不同的 A、B 两张测试图，核对队列、任务 ID 和实际输出。再提交可观察的两个测试任务，仅取消指定的一份，另一份应继续。任务已完成时检查取消回执与最终状态是否一致。

## 6. Node 单轮调整工具

| 工具 | 输入 | 返回 | 行为 |
| --- | --- | --- | --- |
| node_inspect | NodeTarget | revision, input_ref?, input_state, parameters, current_result?, preview_capability | 读取当前参数、已解析输入与可追溯的当前结果。还没有结果时明确表示不存在。 |
| node_preview | NodeTarget, expected_revision:uuid, input_ref:InputRef, parameters:NodeValues, request_id:uuid | preview_id, state, request_id | 用同一输入和一组参数异步试跑，结果临时留存。 |
| node_preview_status | preview_id:PreviewId 或 request_id:uuid | state, preview_id?, effective_parameters?, result?, error? | 查处理状态、实际参数和结果引用。 |
| node_compare | NodeTarget, input_ref:InputRef, preview_id?:PreviewId, reference?:input 或 current, view?:full/center/tl/tr/bl/br | images[], effective_parameters?, image_geometry, warnings[] | 只读已生成的结果。省略 preview_id 查看输入及已有结果。指定 preview_id 时比较输入或可确认同源的当前结果与本轮输出。 |
| node_preview_list | NodeTarget, limit?:int | previews[] | 查该节点近期结果、输入、参数和可用性。 |
| node_preview_discard | preview_id:PreviewId | discarded, state | 清理已结束的临时预览。运行中返回明确状态，避免把清理当作取消。 |
| canvas_apply · set_parameters | 复用 GraphGuard、node_id 和命令回执。支持传 node_id 和 preview_id 的受保护写回 | state, results[], revision? | 应用服务记录的实际有效参数，重核当前图和输入指纹。必要时限制为一次单独写入。 |

1. 先执行 node_inspect，再通过 node_compare 获取输入与已有结果。没有当前结果时可以先看原输入，可用当前参数执行首轮。
2. 根据图像调整一组参数，调用 node_preview。每轮使用同一份节点输入。如果上游尚未产生已验证图像，报告缺失输入及来源。正式工作流执行由 Agent 明确调用。
3. 处理完整输入后生成预览。全图等比缩放，最长边至多 1024，小图不放大。五处细节用原始像素裁片，单边不足 512 时取该边实际长度。比较图共享渲染范围、方向和裁片坐标。输出几何变化且无法对齐时，标明不可逐像素比较，并提供独立全图。
4. 默认返回全图对照，每次可补取指定细节。实际图像以 MCP 可见的图像内容返回，附原始尺寸、坐标、显示设置、输入及预览引用。结果过期或与当前输入失配时标注原因。
5. 满意后通过 canvas_apply 写回选定预览的有效参数。先核对图目标、节点实例、修订、输入及软件版本。应用改变画布参数，workflow_save 单独保存整图。

首个实现为已有 Siril 自动拉伸。先确认实际输入解析、CLI 配置和预览服务是否可复用，再加原始像素裁片与 MCP 图像交付。人仍使用现有 Inspector 和宿主节点入口。主 Agent 和子 Agent 可以调用同一套工具，循环只在看到本轮结果之后发起下一轮。

**自动验证**。检查输入和结果的指纹、实际参数、相同显示尺度、裁片坐标和方向、小图、回执重试、预览过期、缓存清理、MCP 图像内容及输入变化后拒绝写回。

**用户手验**。打开同一张 FITS 与拉伸节点。先看原图和当前结果，调一轮、看对照，再根据所见调下一轮。检查全图与五处细节、预览时画布参数、换图后旧预览的反馈、应用最终参数和另存重开。留存每轮预览 ID 和实际输入引用，便于复核。

## 7. 开发和验收记录

- 每批依次更新 MCP 注册、实际 Schema、服务接口和调用示例。相关代码预计位于 mcp/src/astrophoto_mcp、astrophoto/api、frontend/src/host，Node 复用 extension/siril 和 FITS 预览代码。具体代码路径在实施时核对。
- 自动测试含工具 Schema、直接接口、真实 WebSocket / MCP 宿主链路与受影响回归。新工具上线后通过重连的 Agent 查询分类并做只读连通验证。业务数据操作使用隔离测试副本。
- 每批提供可重开工作流、测试素材、Agent 操作口令、预期结果和命令或任务 ID。分别标记开发通过、待用户手验、用户通过或需返工。已完成的测试结果记入 DEV_LOG，正式结果按 Feature 流程记录。
- 本稿补充的产品默认包括打开已开文件时复用现有标签、无法证明冲突保护时暂缓原位覆盖、Node 默认看一组全图对照并按需读细节。宿主的标签 API、保存时原子冲突控制及 MCP 客户端图像展示仍需实机验证。

## 8. MCP-REVIEW-chat3-001：全部工具的流程、参数和描述审查

- 2026-11-27 13:19 -06:00 · Created/Updated by chat3；关联 TASK-chat3-020、DEV-chat3-039、TC-chat3-020；状态 Proposed，仅记录用户要求的审查与建议。除已引用的现行 FR 外，本节不是用户已确认的产品契约或实施授权；不替代本 TECH 第 1～7 节。
- 审查依据：mcp-tool-design Skill；当前工作树 MCP 工具源码、docs/api/inventory.json 快照和 docs/api/mcp/contracts.md；实际通过当前对话的 MCP 分类发现读取 8 类 66 个业务工具及 3 个发现入口，并只读调用 connection_status、canvas_list_sessions。仓库 Schema 与已连接服务须分开看，不能用源码快照证明该会话已加载新版本。
- 审查时已连接会话仍暴露 cursor、impact_revision、connection_select.url；仓库前五类实现使用 continue_with、confirmation/confirmed、selection，见 FR-chat3-018、DEV-chat3-037。该次实时 canvas_list_sessions 发现 3 个名称为 solar 的页面：名称不足以唯一确定页面，数量和当前连接状态仅为当时观测。未重连 MCP、未修改画布或执行写操作。
- 适用既定决策：FR-chat3-007 关联确认不替代文件保护；FR-chat3-018 的受管/外部文件、短引用绑定、上下文隔离及无需旧接口兼容不变；FR-chat3-005/006 的 Node 单轮观察与调参不变；历史版本、记忆和小模型实测未纳入本次。

### 8.1 建议优先级（均未确认）

1. 重新连接当前 Agent 的 MCP 会话，再核对实际发现的 Schema；评估增加可区分工具契约或构建版本的信息，避免包版本相同却加载不同代码。
2. Canvas、Workflow、Node：评估在可信作用域内用可读页面摘要和短期目标/操作引用减少长 UUID 回传；多页面不可猜测。保留内部真实目标、版本、权限和并发检查，目标或作用域失效时要求重新选择。
3. 导入、画布修改、执行和预览：设计可回查的提交标识，超时结果不明时先查原请求再重试；若编号在响应后才提供，响应丢失时无法凭它找回原请求，需设计调用前可关联的机制和真实幂等边界。
4. 改善工具描述及结果：补输入来源、条件必填、后续工具和可恢复错误；部分成功/失败的回执说明已完成、未完成和原因。客户端是否支持结构化工具错误须验证。
5. 评估 SDK 原生发现与现有分类包装对 Schema、权限提示、客户端可发现性和上下文成本的影响；不预设新增工具、删除分类或直接照搬其他厂商方案。

### 8.2 分模块建议（均为 Proposed）

- 发现入口：list_tool_categories 增加有辨识度的任务说明；list_category_tools 保留准确 Schema/注解并评估按需定位；call_tool 核查包装后输入约束、错误和副作用信息是否仍为客户端可见。源码见 mcp/src/astrophoto_mcp/disclosure.py。
- 连接：version 评估区分包版本和工具契约版本；connection_status 区分 MCP、宿主、扩展、画布桥状态；connection_select 明确选择编号的来源、有效期与切换后失效边界。
- 设备：equipment_list 说明短续读及失效；equipment_get 说明归档筛选；equipment_create 区分实例名和产品型号；equipment_update 说明省略/null 与实际变更；equipment_set_archived 说明归档/恢复；equipment_delete 说明当前关联与历史信息。名称解析的分页扫描及组合成员重复解析仅在数据量、性能实测支持时再优化。
- 设备组：optical_train_list、optical_train_get 说明筛选、归档和成员角色；optical_train_create 明确使用已有设备实例名和成员类型；optical_train_update 明确 null/空数组/省略；optical_train_set_archived 与设备归档一致；optical_train_delete 明确成员设备保留。
- 素材库：library_list、library_get、library_list_subframes 说明名称、素材类型、登记路径与短续读；library_inspect_folder 明确路径位于宿主且仅检查；library_import 按类型说明必需参数、可选字段与既有默认值；library_import_status 解释实际状态；library_add_subframes 说明保留组数据并通过状态工具查询；library_update 明确 equipment 和 capture 的不同 null 行为及提交字段与实际差异；library_deletion_impact、library_remove、library_remove_subframe 清楚说明影响、同意、确认短引用、文件归属与保护；library_find_calibration、library_bind_calibration、library_unbind_calibration 区分候选、绑定和解除，描述差异/未知值及文件保留。重点评估导入响应丢失后的查询路径，以及删除部分失败信息目前压入错误文本的问题；不据此宣称已有可回查机制或实际发生重复删除。
- 项目：project_list、project_get 说明短续读、递归和项目逻辑路径；project_create、project_update 明确空项目和更新字段；project_delete、project_remove_node 说明只移除项目/引用，素材和文件保留；project_create_folders、project_add_assets 用有效示例说明逻辑路径、别名及批量原子性；project_update_node 区分原路径与目标逻辑路径；project_impact 是影响预览，不是授权或冻结快照。
- Canvas：canvas_list_sessions 提供可辨认的页面/图摘要；canvas_get 说明唯一目标可否省略及返回修订；canvas_find_nodes 查已有实例，node_search 查可添加类型，node_describe 返回定义与预览能力；canvas_apply 明确命令与预览应用两种互斥输入，提供增删改连示例；canvas_command_status 说明结果不明的回查；canvas_list_subgraphs、canvas_open_subgraph 区分主图/子图及切换后的目标变化。不得仅按同名工作流自动选择页面。
- Workflow：workflow_list 为已保存文件分页，当前业务 cursor 是上一页工作流路径，不是 UUID；workflow_get 读保存版本，可评估摘要以减少大 JSON；workflow_new 创建未保存空白标签；workflow_open 区分打开文件与聚焦草稿；workflow_save 当前是另存新文件，不能覆盖；workflow_rename、workflow_delete 说明关闭条件、文件版本和冲突；workflow_import 说明原生内容及不能覆盖；workflow_run、workflow_status、workflow_cancel 说明提交、任务或请求二选一回查、取消仅为请求；artifact_get 说明任务产物引用来源和可用性。是否支持原位保存属于待用户决定的产品取舍，不在此默认增加。
- Node：node_inspect 返回参数、输入和预览能力；node_preview 每次试一组参数且不直接改画布，参数范围从节点定义读取；node_preview_status 明确预览 ID/请求 ID 二选一；node_compare 解释 full/center/tl/tr/bl/br 及输入、当前结果和预览的关系；node_preview_list 返回可辨认的参数和状态；node_preview_discard 只清理临时预览。源码当前前端预览适配 AstroPhotoSirilAutoStretch，不宣称所有节点均支持。

### 8.3 待定与验证边界

- 产品待决：短目标引用与选择方式、是否增加原位保存、工具发现替换与否、结构化错误契约及请求回执机制。依项目规则审阅并在需要时征得用户确认；不为实现工具而增加工具。
- 不预设短引用是授权证明、用户同意或持久记忆；不以可读名称代替服务端身份/版本检查；不为旧 Schema 留兼容层。
- 本次为静态代码/文档核对加两项只读 MCP 查询，非正式代码审查或功能验收；未运行自动回归、小模型测试、真实导入/删除、画布修改或重新连接 MCP。后续验证候选见 TC-chat3-020。
