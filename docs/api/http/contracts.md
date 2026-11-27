# HTTP 操作契约

以下路径均相对于 `/astrophoto/v1`。成功状态和处理器见[注册清单](routes.md)，鉴权、请求上限和错误封装见[通用约定](README.md)。带 `?` 的字段可省略。ID 是小写规范 UUID，另有说明的任务号或游标除外。列表通常通过响应的 `next` 继续，`null` 表示到末页。写操作遇到结果不确定时先按 ID、名称或任务号查询。只有明确接收幂等键的提交可用相同请求和键重放。

## 状态与存储

存储状态包含 `status`、`data_root`、数据库就绪信息、导入及缓存设置、工作区及容量信息。异步操作回读包含 `operation_id`、`kind`、`phase`、`workspace_id`、`receipt`、`error` 和 `cancel_requested`。导入回执记录处理总数、登记、复制、跳过、失败及分项错误。迁移回执包含迁移、校验和清理的进度信息。受理状态只表示任务已提交。

| 操作 | 入参 | 结果、失败与副作用 |
| --- | --- | --- |
| `GET /status` | 无 | 返回 `extension`、`api_version`、`status`、`runtime`、`data_home`、`storage_instance_id`、`capabilities`。存储不可用时仍可诊断。 |
| `GET /storage` | 无 | 存储状态、权限能力和近期任务。远程或不受信调用得到受限状态，启动失败时返回错误状态。 |
| `GET /storage/operations` | 无 | `operations` 包含进行中及近期已结束任务，供进度回读。 |
| `POST /storage/init` | 空对象 | 返回 `status`、`data_root`、`created` 和 `checks`。成功时 `checks` 下的 `config`、`database`、`storage` 和 `runtime` 均为 `ready`。只核验活动实例并在确认归属后补齐空子目录。旧开发库返回 `DEV_SCHEMA_RESET_REQUIRED`。 |
| `PATCH /storage/settings` | `expected_revision`，至少一项 `imports.default_mode`（reference/copy）、`workspace.default_workspace_id` 或 `cache.max_size_gb` | 返回更新后的设置和 `revision`。配置过期为 `REVISION_CONFLICT`。 |
| `PUT /storage/location-policy` | `expected_revision`，`order` 为全部位置 ID 各一次，`quotas` 为位置 ID 到字节数或 null 的映射 | `updated:true`。改变自动分配顺序与每位置限额，提交后回读状态。旧配置版本返回冲突。 |
| `POST /storage/locations` | `path`、`name`、`request_id?` | 返回工作区记录。需要可写空目录，会写入身份标记。非空或路径重合返回 `TARGET_NOT_EMPTY` 或 `STORAGE_PATH_CONFLICT`。 |
| `GET /storage/directories` | `path?`、`files=1?` | 返回 `path`、`parent`、`directories`，提供路径时可返回 `files`，条目有 `name,path`。省略路径列宿主根入口。无效路径为 `INVALID_STORAGE_PATH`。 |
| `POST /storage/native-picker` | `kind` 为 `file,files,folder`，可选 `language` 为 `zh,en` | 返回 `status` 和单值 `path` 或数组 `paths`。状态包括 `selected,cancelled,unavailable,busy`，非交互环境使用目录浏览。 |
| `PATCH /storage/locations/{id}` | `expected_revision`，至少一项 `name`、`enabled` 或 `default:true` | 返回位置记录。默认位置保护或版本冲突会拒绝变更。 |
| `DELETE /storage/locations/{id}` | `expected_revision`、`target_workspace_id?` | 空位置返回 `removed`，有目标时可返回迁移任务。保留 Reference 原件和未登记文件。最后位置、任务占用、目标容量不足会阻断。 |
| `POST /storage/locations/{id}/validate` | ID，无 JSON 参数 | 返回位置的验证状态。离线、身份或登记文件异常分别报告。 |
| `POST /storage/locations/{id}/relocate` | `new_path`、`allow_partial?:false` | 重新绑定离线位置，返回位置及验证信息。只改登记，部分缺失需显式允许。错误包括 `WORKSPACE_NOT_OFFLINE` 和 `WORKSPACE_REBIND_PARTIAL`。 |
| `PATCH /storage/locations/{id}/volume` | `quota_bytes`（非负整数或 null）、`expected_revision` | 返回所在物理卷的额度和使用量，影响共享该卷的工作区。与逐位置额度分别计算。 |
| `POST /storage/cache/configure` | `path`、`max_size_gb`、`expected_revision` | 返回缓存设置。宿主管理的会话缓存、冲突路径和配置版本有独立保护。 |
| `POST /storage/cache/clear` | `scope` 为 `all,thumbnails,previews,processing,tmp` | 返回 `removed`、`removed_bytes`、`skipped`、`failed`。只清理可验证归属且未被占用的缓存。 |
| `POST /storage/migrations/preflight` | `workspace_id` 加 `target_path`，或加 `target_workspace_id,amount,unit` | 返回全量或部分迁移计划。部分计划包含可提交方案及 `plan_id`。检查目标容量、冲突及对象分组。 |
| `POST /storage/migrations` | `workspace_id,target_path,idempotency_key`，或 `plan_id,option_id,idempotency_key` | 返回 `operation_id`。计划过期或目标变化报冲突。任务校验后切换位置并清理已验证源副本。 |
| `POST /storage/data-root/preflight` | `target_path` | 返回有效根、候选目标、复制量、可用空间及阻断项。实际整库搬迁通过停机命令执行。 |
| `GET /storage/migrations/{id}` | 迁移任务 ID | 返回异步操作状态及回执。未知任务为 `OPERATION_NOT_FOUND`。 |
| `POST /storage/migrations/{id}/cancel` | 迁移任务 ID | 返回取消请求后的状态。提交切换阶段可能已无法取消。 |
| `POST /storage/migrations/{id}/retry` | 迁移任务 ID | 返回重新排队后的操作状态。先查询迁移阶段及清理状态。 |
| `POST /storage/migrations/{id}/discard-target` | `confirm?:false` | 清理失败迁移的已验证目标文件。首次以空体检查，实际清理使用 `confirm:true`。 |

[存储规则](../../domains/storage.md) · [存储 API 测试](../../../tests/integration/test_storage_api.py) · [初始化测试](../../../tests/integration/test_storage_init.py)

## 设备与设备组合

设备详情包含 `id,equipment_type,name,product_name,notes,archived_at_utc,row_version,created_at_utc,updated_at_utc` 及详情中的使用摘要。设备类型为 `camera,primary_optics,optical_accessory,filter,other`。组合详情含名称、备注、组件 ID、`status,row_version` 和时间戳。组合可选择一个 `camera_id,primary_optics_id,accessory_id`，`filter_ids,other_ids` 各至多 50 个互异 ID。可选设备空值清除单个成员，空数组清除多选。

| 操作 | 入参 | 结果、失败与副作用 |
| --- | --- | --- |
| `GET /equipment` | `q,archived,after,limit,sort,type` 均可选 | `items,next,total`。默认活跃设备，每页 50，范围 1–100。 |
| `GET /equipment/{id}` | 设备 ID | 设备详情或 `EQUIPMENT_NOT_FOUND`。 |
| `POST /equipment` | `equipment_type,name,product_name,notes?` | 创建设备并返回详情。名称和产品名最长 120，备注最长 4000。同库重名返回字段校验错误。 |
| `PATCH /equipment/{id}` | `name,product_name,notes` 至少一项 | 返回更新后的详情，未提交字段保留。 |
| `DELETE /equipment/{id}` | 空体或空对象 | 204。解除现行关联，保留素材快照。重复删除返回不存在。 |
| `POST /equipment/{id}/archive` | 空体或空对象 | 返回已归档的设备详情，名称与已有快照保留。 |
| `POST /equipment/{id}/restore` | 空体或空对象 | 返回恢复后的设备详情。 |
| `GET /optical-trains` | `q,archived,after,limit,sort,status` 均可选 | `items,next,total`。状态可筛 `draft,published,archived`。 |
| `GET /optical-trains/{id}` | 组合 ID | 返回组合详情，已删除组合可按 ID 读取历史记录。 |
| `POST /optical-trains` | `name`，可选 `notes` 和组件字段 | 返回新组合详情。允许不完整组合，校验成员类型及名称唯一性。 |
| `PATCH /optical-trains/{id}` | 可选名称、备注和组件字段 | 返回更新后的组合。已归档或已删除记录分别返回 `TRAIN_ARCHIVED` 或 `TRAIN_NOT_FOUND`。 |
| `DELETE /optical-trains/{id}` | 空体或空对象 | 204，释放名称并从新绑定选择中移除。已有素材快照保留。 |
| `POST /optical-trains/{id}/archive` | 空体或空对象 | 返回归档后详情。 |
| `POST /optical-trains/{id}/restore` | 空体或空对象 | 返回恢复后详情，已删除对象返回 `TRAIN_NOT_FOUND`。 |

`archived` 支持 `true,false,all`。可选排序为 `name_asc,name_desc,created_desc,updated_desc`。有排序时使用返回的原始游标。字段校验错误的 `error.details.fields` 给出字段及原因。服务端以当前记录版本执行原子写入。 [设备规则](../../domains/equipment.md) · [设备 HTTP 测试](../../../tests/integration/test_equipment_api.py)

## 导入、素材记录和文件

`catalog` 至少提供 `kind,name`。类型为 `subframe_collection,video,image_result,calibration_master`。子帧组接收帧类型、校准状态和拍摄参数，其他类型每次导入一个文件。`kind:image_result` 默认导入为 `asset_type:image_result`，主帧可经 `asset_type:master_frame` 和 `master_type` 指定。校准用途关联当前主帧记录。导入选择、拍摄字段及绑定验证见[类型校验](../../../astrophoto/assets/catalog.py)。

| 操作 | 入参 | 结果、失败与副作用 |
| --- | --- | --- |
| `POST /assets/import/preview` | `sources` 为宿主路径数组，常用 `settings_revision,catalog`，文件数最多 10000 | 返回模式、工作区、数量、字节数和错误，带设置版本时另发 `preview_id`。可附校准比较。无有效源时后续提交被拒绝。 |
| `POST /assets/import` | 与预检相同的提交参数，加 `idempotency_key`，带设置版本时交回 `preview_id` | 返回 `operation_id`，原件保留。设置变更或预检过期返回冲突。宿主路径客户端还可显式指定 `import_mode_override,workspace_id,attributes,allow_duplicate`，手动模式/位置与设置版本互斥。 |
| `GET /assets/imports/{id}` | 导入任务 ID | 返回异步操作状态和回执。 |
| `POST /assets/imports/{id}/cancel` | 导入任务 ID | 返回状态及取消标记。已登记成果按回执查询。 |
| `POST /assets/imports/{id}/retry` | 导入任务 ID | 重试符合条件的任务并返回状态。完成后的部分失败使用剩余项重试。 |
| `POST /assets/{id}/relocate` | `new_path` | `asset_id,relocated`。重新登记外部引用路径，校验原登记大小。受管文件返回 `ASSET_NOT_EXTERNAL`。 |
| `GET /assets/{id}/path` | 无 | `path` 为已登记素材在宿主上的当前文件路径；不可访问时返回错误。 |
| `POST /library/direct-imports/preview` | `files,settings_revision,catalog?`，可选 `parallel,workspace_ids,attributes`。每项含 `name,size_bytes,last_modified_ms?` | 在 Copy 模式返回 `preview_id,file_count,size_bytes,workspaces,failed`，可附比较结果。冲突、设置修订和空间在写文件前检查。 |
| `POST /library/direct-imports` | `preview_id,idempotency_key` | 返回浏览器直传作业，包括 `id,group_id,phase,total,entries`。每个条目的 `workspace_id` 给出分配的工作区。成功后按服务端分配的条目上传。 |
| `GET /library/direct-imports/{id}` | 直传作业 ID | 返回直传作业、各条目状态及分项结果。刷新后用此状态恢复待传项。 |
| `DELETE /library/direct-imports/{id}` | 空对象 | 取消作业并返回状态，已发布条目保留。 |
| `PUT /library/direct-imports/{id}/files/{entry_id}` | 原始文件字节、可核对的长度，`workspace_id?` | 返回 `id,status,workspace_id`。只接收作业所登记的条目，处理配额、文件冲突、空闲超时及补选位置。 |
| `POST /library/catalog-import` | Agent 头，`sources,catalog` | 受理类型化导入，返回 `operation_id,task`。自动读取当前设置并预检。 |
| `GET /library/catalog-import/{id}` | Agent 头，`IMP-…` 任务号或操作 UUID | 返回导入任务状态及结果。未知或不适用任务为 `OPERATION_NOT_FOUND`。 |
| `POST /library/imports/{id}/retry-remaining` | 浏览器，空对象 | 对可恢复的未处理或失败文件建立任务，返回 `operation_id`。完成项不重复登记。无剩余项为 `NO_RETRYABLE_FILES`。 |
| `GET /library/assets` | `limit,after,q,asset_ids,import_group_id,storage_mode,workspace_id,extension,available,sort` 和素材属性筛选 | 返回 `items,next`。条目含 ID、名称、大小、版本、属性、登记方式、工作区、成员顺序、`available,reason`。已登记的独立目录记录通过 `catalog_resource` 指向 `video`、`image_result` 或 `calibration_master`。 |
| `GET /library/assets/{id}` | 文件记录 ID | 返回上述素材记录及可用性，素材或位置不存在时报告 `ASSET_NOT_FOUND`。 |
| `GET /library/import-groups` | `after?,limit?` | 返回 `items,next`，组条目报告成员数、位置分布和可用性。 |
| `POST /library/assets` | `output_id,attributes?` | 现行处理结果收录使用。验证正式输出后用同一 ID 建立素材登记，重读已收录输出返回同一条记录。 |
| `PATCH /library/assets/{id}` | `attributes` | 更新文件层属性并返回记录。校准主帧在此接口保持 `role=master_frame`，分类变更通过类型化目录接口更新。组级拍摄与设备属性也通过目录接口更新。 |
| `DELETE /library/assets/{id}` | `impact_revision?` | 走统一素材删除流程，返回删除回执。 |
| `GET /library/assets/{id}/deletion-impact` | 无 | 返回删除影响，与目录 API 使用同一规则。 |

[素材与文件规则](../../domains/assets.md) · [直传实现](../../../astrophoto/assets/direct_import.py) · [直传测试](../../../tests/integration/test_direct_import.py) · [素材测试](../../../tests/integration/test_photography_library.py)

## 素材目录、校准与项目

目录资源、项目和节点写入支持可选 `revision`。提供时必须等于当前版本，否则返回 `REVISION_CONFLICT`。项目和节点删除使用空对象。

目录资源 `{resource}` 可取 `subframe_collection,video,image_result,calibration_master`，其中 `assets` 仅用于跨类型列表。列表支持 `q,exact_name,sort,limit,after`。素材类型、序号、版本、光学快照、拍摄字段和文件位置随资源而异。项目路径从 `/` 开始，各段是逻辑名称，项目节点使用独立 ID。项目节点删除只移除项目引用。素材删除回执包含 `removed_asset_ids,deleted_files,preserved_external_files,removed_associations`。整组部分完成时，错误详情还包含 `removed_asset_ids,remaining_asset_ids`。

| 操作 | 入参 | 结果、失败与副作用 |
| --- | --- | --- |
| `GET /catalog/{resource}` | 列表通用参数，类型或拍摄筛选。主帧候选可传 `collection` | `items,next,total`。各类型结果含 `asset_type`；主帧用途为 `master_type`，校准候选含参数比较。 |
| `GET /catalog/{resource}/{id}` | `summary=1?`、`bindings=1?` | 返回含 `asset_type` 和适用 `master_type` 的类型化详情。未知资源或记录报告请求错误或 404。 |
| `PATCH /catalog/{resource}/{id}` | `revision?`，类型允许的名称、备注、设备、滤镜、拍摄和来源字段 | 返回更新后的资源。受管改名同步目录。非法设备引用、同名、非法来源或用途变更会失败。 |
| `DELETE /catalog/{resource}/{id}` | `video`、`image_result` 或 `calibration_master`，`revision?,impact_revision?` | 统一删除素材。 |
| `POST /catalog/source-folder` | `path`，查询 `limit?,after?` | 无 limit 返回排序后的相对文件名 `names`，分页返回 `items,total,next`。只扫描授权路径。 |
| `GET /catalog/subframe_collection/{id}/files` | `limit?:50,after?,view=assets?` | `items,total,collection_name,next`，按组内顺序。可选择文件层 DTO。 |
| `GET /catalog/subframe_collection/{id}/files/{file_id}` | 组和成员 ID | 返回匹配组的单帧详情，其他组的成员返回 404。 |
| `POST /catalog/subframe_collection/{id}/files` | `sources` | 受理追加，返回 `operation_id,task`。重复源跳过或报冲突，相同目标名不会被覆盖。 |
| `DELETE /catalog/subframe_collection/{id}/files/{file_id}` | `revision?,impact_revision?` | 返回统一删除回执。删除指定成员和它的受管文件，保留组、其他成员和外部原件。 |
| `DELETE /catalog/subframe_collection/{id}` | `revision?,impact_revision?` | 统一删除组及成员，部分失败时保留未完成成员和组。 |
| `GET /catalog/subframe_collection/{id}/bindings` | 组 ID | `items` 为已绑定校准主帧。 |
| `POST /catalog/subframe_collection/{id}/bindings` | `master_ids,preview?` | 返回分项比较。预检只读，其余请求创建绑定。差异和未知也随结果呈现。 |
| `DELETE /catalog/subframe_collection/{id}/bindings/{master_id}` | 组和主帧 ID | `deleted:true`。解除指定绑定；已解除可重复调用。 |
| `GET /catalog/{resource}/{id}/deletion-impact` | 无 | 返回项目、校准、来源、文件状态以及 `impact_revision`。有关联时确认后提交该摘要，无确认返回 `DELETION_CONFIRMATION_REQUIRED`，过期返回 `REVISION_CONFLICT`。 |
| `GET /catalog/subframe_collection/{id}/files/{file_id}/deletion-impact` | 无 | 返回指定子帧的删除影响和版本；确认要求与整素材相同。 |
| `GET /catalog/projects` | 列表通用参数，或 `name` 加详情查询 | 列表 `items,next,total`，按名称定位时返回对应项目。 |
| `POST /catalog/projects` | `name,notes?` | 创建项目，返回 ID、名称、备注、版本和时间。重名冲突。 |
| `GET /catalog/projects/{id}` | `path?`，`view=summary,node,children,descendants,impact` 可选 | 返回项目、节点、资源、分页子树，或 `affected_folders,affected_references`。未知路径返回 404。 |
| `PATCH /catalog/projects/{id}` | `name?,notes?,revision?` | 返回更新项目。名称冲突时保持原记录。 |
| `DELETE /catalog/projects/{id}` | 空对象 | `id,deleted,affected_folders,affected_references`。删除逻辑项目和引用。 |
| `POST /catalog/projects/{id}/folders` | `paths`，1–1000 个逻辑路径 | 批量创建逻辑文件夹，返回本次创建结果，任一冲突使事务回滚。 |
| `POST /catalog/projects/{id}/nodes` | `kind,name?,parent_id?,parent_path?,resource_id?` | 返回新节点。素材引用需要现有资源，不允许跨项目父节点。 |
| `POST /catalog/projects/{id}/references` | `parent_path,assets`，1–100 项，每项 `kind,resource_id,name?` | `items` 为创建的逻辑引用。无效引用或冲突使整批回滚。 |
| `PATCH /catalog/projects/{id}/nodes/{node_id}` | `name?,parent_id?,parent_path?,revision?` | 返回改名/移动后的节点。自引用或循环返回 `INVALID_LIBRARY_REFERENCE`。 |
| `DELETE /catalog/projects/{id}/nodes/{node_id}` | 空对象 | 返回删除结果及后代数量。删除文件夹会移除其子树。 |

[目录实现](../../../astrophoto/api/catalog.py) · [项目调用链测试](../../../tests/integration/test_library_mcp.py)
## 在线画布

以下路由使用 `/astrophoto/v1` 前缀，仅支持单用户回环直连。页面 WebSocket 需要同源 Origin，Agent HTTP 使用 `X-AstroPhoto-Agent: 1`，自动发现模式携带已绑定的宿主实例标识。

| 操作 | 契约 |
| --- | --- |
| `GET /canvas/socket` | 前端注册 WebSocket，服务端分配 `session_id`。命令和回执在同一连接上收发。 |
| `GET /canvas/sessions` | 返回在线页面 ID，由 MCP 分别读取活动工作流摘要。 |
| `POST /canvas/commands` | 接收 `session_id,command_id,payload`。支持查找、编辑、工作流文件和提交、子图切换以及节点输入检查。响应包含 `completed,rejected,partial,unconfirmed` 之一。 |
| `GET /canvas/commands/{id}` | 读取当前宿主进程内的命令回执。同一 ID 携带不同目标或请求会被拒绝。 |
| `POST /canvas/node/{action}` | `preview,compare,list,status,discard`。只接受宿主生成的输入和预览标识。比较响应包含 PNG 内容、区域和显示信息。 |
| `POST /canvas/workflows` | 同源页面提交 `path,content`，在宿主工作流库内原子创建完整文件。路径已存在时返回 `WORKFLOW_EXISTS`。 |
| `GET /canvas/outputs/{id}` | 本机 Agent 查询已登记正式产物的本地路径、文件名和大小。不存在或不可访问时返回错误。 |
