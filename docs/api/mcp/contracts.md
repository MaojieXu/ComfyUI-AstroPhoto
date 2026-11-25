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
| `connection_select` | `url`，返回 `address` | 只在自动模式注册。选中已发现且可用的本机实例，影响后续调用目标。 |

[模式与目标测试](../../../mcp/tests/test_target_discovery.py) · [披露测试](../../../mcp/tests/test_disclosure.py)

## 设备与设备组合

设备摘要含名称、设备类型、产品名、备注、归档状态和时间。组合摘要含名称、备注、状态及可用组件；按名称唯一解析。分页返回 `items,next_cursor`。翻页须使用同样的查询与排序。通常错误包括名称查找不到、名称重名、成员类型无效、已归档对象不能编辑和目标实例变化。

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

素材摘要含名称、类型、备注及适用的文件、拍摄、设备和滤镜字段。分页响应使用 `items,next_cursor`，部分列表带 `total`。拍摄值由调用者提供。主帧指定来源组时，省略 `capture.binning` 会继承组值，传 null 保存为未知。子帧组和无来源主帧省略时默认 `1`。名称冲突、搜索无匹配、组路径歧义、非法设备关系、当前目标改变会失败。需要重试时先查询素材与作业状态。

| 工具 | 输入和结果 | 请求链及副作用 |
| --- | --- | --- |
| `library_list` | 名称、类型、设备、滤镜、校准等筛选及分页，返回素材页 | `GET /catalog/assets` 或对应类型列表。 |
| `library_get` | 唯一素材 `name`，返回详情，组附校准主帧 | 查询名称、类型详情和适用绑定。 |
| `library_list_subframes` | `collection_name`、分页，返回按顺序排列的 `file_name,file_path,storage_mode,size_bytes` | 解析组后 `GET /catalog/subframe_collection/{id}/files`。 |
| `library_inspect_folder` | 宿主绝对路径及分页，返回 `folder_path,items,next_cursor`，条目为 `relative_path` | `POST /catalog/source-folder`。只列授权文件名，按原游标翻页。 |
| `library_import` | 类型、名称、来源路径和可选登记信息，返回 `task,status` | 对应的设备、来源组按名称解析，调用 `POST /library/catalog-import`。根据宿主设置引用或复制。非组只接收一个文件。 |
| `library_import_status` | `IMP-…` 任务号，返回 `task,status,phase,imported` 和可用的计数、错误、素材摘要 | `GET /library/catalog-import/{task}`。作业已归属某实例时回到该实例查询。 |
| `library_add_subframes` | `collection_name,source_paths`，返回 `task,status,collection_name` | 解析组后 `POST /catalog/subframe_collection/{id}/files`。保留现有拍摄数据和成员顺序。 |
| `library_update` | 名称和本次编辑的字段，返回更新摘要 | 解析素材、设备或来源组后 `PATCH /catalog/{resource}/{id}`。受管改名会同步磁盘目录。 |
| `library_remove` | 素材名称，返回 `name,asset_type,removed` | 解析后 DELETE 对应目录记录，注销及清理绑定和项目引用，物理文件保留。 |
| `library_remove_subframe` | `collection_name,file_path`，返回这两个字段及 `removed` | 分页寻找唯一成员，DELETE 指定成员。找不到或多重匹配分别为 `FILE_NOT_FOUND` 和 `AMBIGUOUS_PATH`。保留物理文件。 |
| `library_find_calibration` | 组名称、可选类型和筛选，返回组名、主帧摘要及逐字段比较 | 查组并列出相关候选。未知组帧类型返回 `FRAME_TYPE_REQUIRED`。 |
| `library_bind_calibration` | 组名称和 1–100 个主帧名称，返回组名、主帧比较和绑定结果 | 解析名称后 POST 绑定路径。显示差异及未知值，显式指定的绑定按业务规则提交。 |
| `library_unbind_calibration` | 组名称和主帧名称，返回组名、主帧名及移除结果 | 查找绑定并 DELETE。主帧及文件继续保留。 |
| `storage_delete_managed_file` | `name`，子帧组另需确切 `file_path`，返回 `name,file_path,deleted_file` | 解析素材和成员后 `POST /library/assets/{id}/delete-file`。只删指定受管文件并保留登记，外部引用返回 `ASSET_NOT_MANAGED`。 |

[素材工具测试](../../../mcp/tests/test_catalog_tools.py) · [HTTP 导入与文件操作](../http/contracts.md) · [联调及文件保护测试](../../../tests/integration/test_photography_library.py)

## 项目

项目列表条目含名称、备注和时间。逻辑路径使用 `/` 开头。节点条目含名称、路径、节点类型以及适用的素材名称和类型。未知路径、循环、名称/路径冲突和不适用于当前查询的游标会失败。

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
