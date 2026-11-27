# MCP 工具契约

字段名、类型、默认值和枚举以各分类页的运行时 Schema 为准。以下 HTTP 路径相对于 `/astrophoto/v1`。各分类的自动、显式本机与显式非本机可用条件见[工具参考](README.md)。调用错误使用 MCP 工具错误，常带 AstroPhoto 的业务错误码。显式配置远程地址时只能使用诊断工具。分类披露之后，客户端也可以用已知工具名直接调用。

## 发现与连接

| 工具 | 输入和结果 | 请求链及失败 |
| --- | --- | --- |
| `list_tool_categories` | 空参数，返回 `categories`，每项为该服务实际提供的一类工具 | 读取当前工具注册，宿主离线时仍可发现。 |
| `list_category_tools` | `category`，返回 `category,tools`，工具条目含 Schema、说明及注解 | 类别必须由服务定义；可用集合由当前模式确定。 |
| `call_tool` | `name,arguments`，返回被调用业务工具的结果 | 使用该工具正常校验与连接规则，未知工具或无效参数以工具错误返回。 |
| `version` | 空参数，返回 `name,version` | 读取本地 MCP 包版本。 |
| `connection_status` | 空参数。自动模式返回结构化地址、候选、实例及连接状态。手动模式返回结构化诊断。 | 探测 ComfyUI 和 `GET /status`。没有候选、多个候选、已选实例失联是可读状态。 |
| `connection_select` | `selection`，返回 `address` | 只在自动模式注册。使用 `connection_status` 返回的短编号选择已发现的实例，编号过期或失效后需重新查询。缺少会话作用域时不提供短编号。 |

[模式与目标测试](../../../mcp/tests/test_target_discovery.py) · [披露测试](../../../mcp/tests/test_disclosure.py)

## 设备与设备组合

设备摘要含名称、设备类型、产品名、备注、归档状态和时间。组合摘要含名称、备注、状态及可用组件；按名称唯一解析。分页返回 `items,returned,has_more,continue_with`。续读只传编号及必需的对象参数，不能显式传筛选条件或 limit；编号绑定会话、实例和原查询，过期时重新查询。不支持可靠会话作用域时拒绝生成或使用短编号。通常错误包括名称查找不到、名称重名、成员类型无效、已归档对象不能编辑和目标实例变化。

设备和组合更新响应的 `changed`、`cleared` 按更新前后实际可见值计算；未提供字段不改变，`notes: null` 清空备注，组合的单成员 `null` 与列表 `[]` 分别清空对应成员和列表。

| 工具 | 输入和结果 | 请求链及副作用 |
| --- | --- | --- |
| `equipment_list` | 查询文本、设备类型、归档条件、排序和分页，返回设备页 | 查询 `GET /equipment`。 |
| `equipment_get` | `name,include_archived?`，返回设备摘要 | 依名称查询设备，必要时包含归档记录。 |
| `equipment_create` | `equipment_type,name,product_name,notes?`，返回设备摘要 | `POST /equipment`。创建新条目，重名返回校验错误。 |
| `equipment_update` | `name`、新名称或修改字段，返回更新摘要 | 名称解析后 `PATCH /equipment/{id}`。省略的字段保留，`notes:null` 清除备注。 |
| `equipment_set_archived` | `name,archived`，返回设备摘要 | 解析后调用设备 `/archive` 或 `/restore`。 |
| `equipment_delete` | `name`，返回 `name,deleted` | 解析后 `DELETE /equipment/{id}`。现行关系解除，素材中的历史快照保留。 |
| `optical_train_list` | 查询、归档条件、排序、分页，返回组合页 | 查询 `GET /optical-trains`。 |
| `optical_train_get` | `name,include_archived?`，返回组合摘要 | 查找指定名称的现行或归档组合。 |
| `optical_train_create` | 名称、备注及各类组件名称，返回组合摘要 | 按类型解析成员，调用 `POST /optical-trains`，允许不完整组合。 |
| `optical_train_update` | `name`、可选新名称、备注和成员，返回组合摘要 | 解析组合和成员后 `PATCH /optical-trains/{id}`。null 清空单选，空数组清空多选。 |
| `optical_train_set_archived` | `name,archived`，返回组合摘要 | 解析后调用组合 `/archive` 或 `/restore`。 |
| `optical_train_delete` | `name`，返回 `name,deleted` | 解析后 `DELETE /optical-trains/{id}`，释放名称，保留历史设备信息。 |

[名称与成员测试](../../../mcp/tests/test_equipment_names.py) · [HTTP 联调](../../../tests/integration/test_equipment_api.py)

## 素材、导入和校准

素材摘要含名称、类型、备注及适用的文件、拍摄、设备和滤镜字段。分页响应使用 `items,returned,has_more,continue_with`，部分列表带 `total`；短编号绑定原查询上下文，过期时重新查询。不支持可靠会话作用域时拒绝生成或使用短编号。拍摄值由调用者提供。主帧指定来源组时，省略 `capture.binning` 会继承组值，传 null 保存为未知。子帧组和无来源主帧省略时默认 `1`。名称冲突、搜索无匹配、组路径歧义、非法设备关系、当前目标改变会失败。需要重试时先查询素材与作业状态。

`library_update` 的 `updated_fields` 列出本次明确提交的字段，`cleared_fields` 列出明确传入 null 的字段；它们不是更新前后差异。`capture: null` 不修改拍摄参数，需对某个 `capture` 子字段传 null 才清空该项；`equipment: null` 清除设备组及滤镜绑定。

| 工具 | 输入和结果 | 请求链及副作用 |
| --- | --- | --- |
| `library_list` | 名称、类型、设备、滤镜、校准等筛选及分页，返回素材页 | `GET /catalog/assets` 或对应类型列表。 |
| `library_get` | 唯一素材 `name`，返回详情，组附校准主帧 | 查询名称、类型详情和适用绑定。 |
| `library_list_subframes` | `collection_name`、分页，返回按顺序排列的 `file_name,file_path,storage_mode,size_bytes` | 解析组后 `GET /catalog/subframe_collection/{id}/files`。 |
| `library_inspect_folder` | 宿主绝对路径及分页，返回 `folder_path,items,returned,has_more,continue_with`，条目为 `relative_path` | `POST /catalog/source-folder`。只列授权文件名，使用短续读编号翻页。 |
| `library_import` | 类型、名称、来源路径和可选登记信息，返回 `task,status` | 对应的设备、来源组按名称解析，调用 `POST /library/catalog-import`。根据宿主设置引用或复制。非组只接收一个文件。 |
| `library_import_status` | `IMP-…` 任务号，返回 `task,status,phase,imported` 和可用的计数、错误、素材摘要 | `GET /library/catalog-import/{task}`。作业已归属某实例时回到该实例查询。 |
| `library_add_subframes` | `collection_name,source_paths`，返回 `task,status,collection_name` | 解析组后 `POST /catalog/subframe_collection/{id}/files`。保留现有拍摄数据和成员顺序。 |
| `library_update` | 名称和本次编辑的字段，返回更新摘要 | 解析素材、设备或来源组后 `PATCH /catalog/{resource}/{id}`。受管改名会同步磁盘目录。 |
| `library_remove` | `name,confirmation?,confirmed?` | 删除素材或整组登记、关联及受管文件，保留外部原件。有关联时须先获得用户明确同意并提交短确认编号。 |
| `library_remove_subframe` | `collection_name,file_path?/file_name?,confirmation?,confirmed?` | 指定路径或组内精确唯一文件名；有歧义时需完整路径。删除受管副本并保留外部原件；有关联时须先获得用户明确同意。 |
| `library_find_calibration` | 组名称、可选类型和筛选，返回组名、主帧摘要及逐字段比较 | 查组并列出相关候选。未知组帧类型返回 `FRAME_TYPE_REQUIRED`。 |
| `library_bind_calibration` | 组名称和 1–100 个主帧名称，返回组名、主帧比较和绑定结果 | 解析名称后 POST 绑定路径。显示差异及未知值，显式指定的绑定按业务规则提交。 |
| `library_unbind_calibration` | 组名称和主帧名称，返回组名、主帧名及移除结果 | 查找绑定并 DELETE。主帧及文件继续保留。 |
| `library_deletion_impact` | `name,file_path?/file_name?` | 查询项目、校准、来源及文件影响。有关联时 Agent 先向用户说明并获得同意，再在删除时提交短确认编号和 `confirmed: true`。后端仍校验影响版本与文件保护；短编号本身不能证明用户同意。不支持可靠会话作用域时拒绝生成或使用短编号。 |

[素材工具测试](../../../mcp/tests/test_catalog_tools.py) · [HTTP 导入与文件操作](../http/contracts.md) · [联调及文件保护测试](../../../tests/integration/test_photography_library.py)

## 项目

项目列表条目含名称、备注和时间。逻辑路径使用 `/` 开头。节点条目含名称、路径、节点类型以及适用的素材名称和类型。未知路径、循环、名称/路径冲突和不适用于当前查询的游标会失败。

项目更新响应的 `changed` 和 `cleared` 报告实际变化；省略字段表示不改变，`notes: null` 清空备注。

| 工具 | 输入和结果 | 请求链及副作用 |
| --- | --- | --- |
| `project_list` | 查询文本、排序、分页，返回项目页 | `GET /catalog/projects`。 |
| `project_get` | 项目名、可选路径、递归和分页，返回项目、节点、分页或单项素材 | 先按名称定位项目，再按路径查询节点、直接子项或后代。 |
| `project_create` | `name,notes?`，返回创建的项目摘要 | `POST /catalog/projects`，重名失败。 |
| `project_update` | 项目名与本次编辑的字段，返回更新摘要 | 名称解析后 PATCH 项目。 |
| `project_delete` | `project_name`，返回 `status,project_name,path,affected_folders,affected_references` | 名称解析后 DELETE 项目，目录登记和文件保留。 |
| `project_create_folders` | 项目名和逻辑路径数组，返回 `project_name,paths,created` | POST 项目文件夹批处理，遇冲突事务回滚。 |
| `project_add_assets` | 项目名、目标文件夹、素材名称/别名数组，返回逻辑引用 | 解析名称后 POST 项目引用。任一无效时整体回滚。 |
| `project_update_node` | 项目名、节点路径、新名称或目标父路径，返回更新节点 | 查项目和节点后 PATCH。只更新逻辑树。 |
| `project_remove_node` | 项目名和非根节点路径，返回删除状态和受影响数量 | 按路径定位后 DELETE 该节点，文件夹的后代引用一起移除。 |
| `project_impact` | 项目名和可选路径，返回项目、路径、后代文件夹及引用数量 | GET 项目详情的 `view=impact`，只读当前数量。 |

[项目工具](../../../mcp/src/astrophoto_mcp/tools/projects.py) · [项目链路测试](../../../tests/integration/test_library_mcp.py)
## 在线画布

| 工具 | 输入和结果 |
| --- | --- |
| `canvas_list_sessions` | 列出在线页面、当前工作流和图范围。 |
| `canvas_get` | 返回目标、版本、节点、参数和连线。 |
| `canvas_find_nodes` | 按名称、类型或 ID 查找当前图的实例。 |
| `node_search` | 搜索宿主注册的节点类型。 |
| `node_describe` | 获取指定节点类型的宿主定义。 |
| `canvas_apply` | 在指定页面和图版本应用有序编辑，返回每步结果。 |
| `canvas_command_status` | 按命令 ID 查询回执。 |
| `canvas_list_subgraphs` | 列出主图与子图实例的路径和名称。 |
| `canvas_open_subgraph` | 进入指定子图或返回主图，返回新的画布目标和修订。 |

`node_search` 支持按宿主 `python_module` 精确筛选来源。`node_describe` 返回来源及预览能力。`canvas_apply` 可提交普通命令，或同时提供 `node_id` 与 `preview_id`，由扩展复核输入和软件后写入有效参数。

## 工作流与执行

文件工具通过选定页面访问 ComfyUI 的工作流库。工作流路径相对库根目录，文件修订使用 SHA-256。新建、打开和另存保留其他标签的草稿。另存和导入由扩展原子发布新文件，目标存在时返回冲突。改名、删除只对唯一在线页面中已关闭的文件开放，要求提供最后读取的文件修订。原位保存由 ComfyUI 原生入口提供。原生文件操作无法对外部写入者保证原子版本检查。

| 工具 | 结果 |
| --- | --- |
| `workflow_list` | 查询和分页列出库中文件。 |
| `workflow_get` | 读取原生 JSON 和修订。 |
| `workflow_new` | 新建标签。 |
| `workflow_open` | 打开或聚焦已有标签。 |
| `workflow_save` | 保存为新文件。 |
| `workflow_rename` | 改名或移动已关闭工作流。 |
| `workflow_delete` | 删除已关闭工作流。 |
| `workflow_import` | 导入原生工作流。 |
| `workflow_run` | 以当前主图修订生成一次提交，返回宿主确认的 `task_id`。提交和回查共享请求 ID。 |
| `workflow_status` | 按任务或提交请求查状态及产物。 |
| `workflow_cancel` | 调用宿主单任务取消接口。 |
| `artifact_get` | 根据任务历史返回产物元数据和可读状态。宿主 View 产物返回相对地址，AstroPhoto 正式 FITS 返回已登记的本地路径。 |

`state: unconfirmed` 时用 `workflow_status(request_id)` 查询原请求。宿主已有相同任务时，重复提交返回 `reused: true` 和原任务 ID。提交适配遵循目标 Frontend 1.59.6 的队列请求序号和 LIFO 顺序，在宿主运行前控件回调前检查画布修订。宿主缺少所需队列字段时返回 `CANVAS_UNSUPPORTED`。

## 单节点调参

当前接入 Siril 自动拉伸。通过 `node_inspect` 获取实际接入的 FITS 输入引用，调用 `node_compare` 先查看原图及可验证的已有结果。每轮使用 `node_preview` 提交一组参数，`node_preview_status` 回读，`node_compare` 查看新结果。全图长边最多 1024 像素。中心与四角为 512×512 原始像素区域，小图按实际尺寸取值。MCP 以 PNG 图像内容返回，附预览几何和有效参数。 `node_preview_list`、`node_preview_discard` 管理临时预览。选择结果后用 `canvas_apply` 写回，保存工作流需另外调用 `workflow_save`。

上游 Siril CLI 输出记录暂存输入的文件指纹。检查自动拉伸节点时，扩展核对该 CLI 节点的当前上游选择及已记录的文件指纹，来源发生变化时需要重新运行上游。

| 工具 | 结果 |
| --- | --- |
| `node_inspect` | 当前节点参数和已验证输入。 |
| `node_preview` | 提交一轮参数预览。 |
| `node_preview_status` | 查询预览状态。 |
| `node_compare` | 对照输入、当前结果或预览。 |
| `node_preview_list` | 列出节点预览记录。 |
| `node_preview_discard` | 清理结束的预览。 |
