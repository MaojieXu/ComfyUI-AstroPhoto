# 素材导入选择契约

## 可读受管存储路径（DEV-104）

默认工作区为 `storage/Local`，四类复制素材采用 `objects/<类型>/<素材名称>/<原始文件名>`。复制、直传和追加共用可读路径、名称检查及无覆盖发布规则。目录 API 与 MCP 区分素材名称、原始文件名和实际位置。引用模式保存源路径。工作区迁移继续使用登记的相对路径，并在部分迁移及移除预检中拒绝外来目录与文件冲突。

受管素材改名按工作区获取租约，先在 `runtime/` 持久化旧路径、新路径、临时路径及目录身份，再移动目录和提交数据库。正常退出或启动恢复时，根据数据库已提交的路径完成或撤销目录移动。包含未登记文件的目录拒绝整体移动。内部任务标识仅用于暂存与恢复。旧测试目录未迁移。

## TECH-017 — 素材详情编辑和登记移除

目录 PATCH 对子帧组支持帧类型、校准状态与 CAPTURE 字段，复用输入验证和 revision；帧类型与现有校准绑定或来源冲突时返回引用保护。单个子帧旧属性接口拒绝组级参数修改。目录 DELETE 子帧组在同一事务检查项目和校准来源引用，移除组及成员登记，保留原始文件；单文件沿用 library 删除并保护项目引用。DEV-093 取代原差异过滤及确认逻辑：前端按适用类型显示候选，差异及未知作为提示，不阻止绑定；比较不涉及温度。

## TECH-016 — 图像结果设备绑定（已实现）

主帧与图像结果共用 image_results 表，新增可选设备组合和滤镜字段及绑定时快照，沿用视频的验证、引用及 revision 语义。旧记录迁移为未绑定、滤镜未知；导入及 PATCH 支持主动绑定、解绑和重绑，不因设备修改自动覆盖历史快照。此前不记录设备和滤镜的描述由本条替代，SQLite 0007 迁移保留已有图像记录；验证结果见本次 DEV。



## TECH-015 — 子帧移除与设备快照展示

子帧使用现有资产取消登记接口，带版本校验和确认提示，删除登记与组成员记录并保留文件。组摘要使用外连接保留无成员组，空组可用状态为空。组设备信息只读取绑定时快照，显示非滤镜成员和产品名，再独立显示本次滤镜快照；不从当前设备库覆盖历史快照。

## TECH-014 — 素材入口分类

主帧与图像结果仍共用 image_result 表；导入时的 result_type 决定素材属性 role 分别为 master_frame 或 processed，列表按该属性筛选。未提供 result_type 的调用仍按原约定写入 master_frame；早期通过图像结果入口导入的记录也曾统一标记为 master_frame，不能从记录推知原入口。

## TECH-013 — 素材展示读取

素材组摘要读取组类型及各成员位置可用性，任一成员不可用时组显示离线。组详情读取目录组及绑定主帧；单帧使用所属组详情获取位置，视频与图像结果读取各自目录记录。受管理文件路径由在线工作区根与相对路径展示。单帧详情不使用旧属性编辑器；旧通用属性 API 此轮保留。

## TECH-012 — 子帧追加选择

登记模式逐个提交已选择的本地文件路径，服务端校验路径并将这些文件登记为同一子帧组；复制模式提交浏览器 File 清单。重复选择保留已选条目，移除仅从本次选择中剔除，变更后清除原预检。其他类型仍接收单文件。列表展开按钮复用现有 ComfyUI 风格树控件与箭头。

## TECH-001 — 统一入口与宿主批量选择

现有复制导入使用浏览器 File 与直传；登记导入使用宿主绝对路径及既有预检/任务 API。保持两条导入链路及原有鉴权和校验，不将浏览器 File 当作绝对路径。新增宿主选择器 `kind=files` 返回所选路径数组 `paths`；旧 `file` / `folder` 的 `path` 响应保持兼容。取消、不可用、占用仍显式区分；不可用回退已有服务端文件浏览与手动路径。窗口在宿主而非远程浏览器机器打开。验证多选、取消、回退以及旧调用兼容。

## TECH-002 — 精简设备记录（实施中）

设备统一采用类型、实例名称、产品名及可选备注，系统维护 ID、归档、版本和时间；五种类型包含 other。组合配置以 `other_ids` 引用其他设备，既有相机、主光学设备、附件和滤镜角色保留。去除专业规格与依赖其数值的组合计算。设备 API 与前端 DTO 同步更新；本轮不适配独立 MCP，故 MCP 设备工具与新 API 的兼容待后续实现。按用户决定不实现旧设备数据迁移；启动时不得自行删除现有数据根或数据库。

## TECH-003 — 设备组合单记录

组合信息和当前设备关联合并进 `optical_trains` 单记录，相机、主光学和单附件为可空 ID，滤镜及其他设备为 ID 数组；POST 创建、PATCH 更新提交完整配置并附带版本，GET 返回当前记录及可展示的设备信息。保留软删除和关联约束，素材绑定时的不可变配置快照另行实现。旧设备组合数据库不迁移，验证时使用新数据根并保留旧根。MCP 本轮不适配。
# TECH-004 — Equipment MCP name interface and sorted pagination

目录 MCP 的后续契约见本文末的 DEV-079 说明。

Implemented design target: retain existing public HTTP equipment routes and ID pagination for existing clients; add opt-in sorted, opaque keyset cursors bound to query, category and archive filters. MCP resolves normalized exact names via public paged endpoints, retains ID and row_version only internally, verifies roles and performs guarded writes. Updates distinguish omitted fields from explicit null; deletion remains guarded by trusted chat approval. MCP schema exposes English enum and parameter descriptions. No direct database access or asset snapshot claim. Sorting under concurrent modifications is not a snapshot; retry on stale or invalid cursors. Verification: schema inspection, pagination and real HTTP integration with permission isolation.

## TECH-005 — 素材精简结构（最终模型，落地见 TECH-010）

用户已确认本节字段及枚举为最终逻辑模型，授权全量实现；现有素材、存储、项目、校准和 MCP 的调用及数据边界须在实施中贯通，不能将目标误记为现有数据库事实。

| 对象 | 最终逻辑字段 |
| --- | --- |
| Subframe Collection | `id`, `name`, `frame_type`, `exposure_seconds?`, `iso?`, `gain?`, `offset?`, `binning?`, `readout_mode?`, `temperature_c?`, `calibration_state`, `equipment_train_id?`, `equipment_snapshot?`, `filter_state`, `filter_id?`, `filter_snapshot?`, `notes?`, `revision`, `created_at_utc`, `updated_at_utc` |
| Subframe | `id`, `collection_id`, `file_name`, `storage_mode`, `external_path?`, `workspace_id?`, `relative_path?`, `size_bytes` |
| 图像结果 Image Result | `id`, `name`, `storage_mode`, `external_path?`, `workspace_id?`, `relative_path?`, `notes?`, `revision`；替代原 Master Frame 候选，不记录设备、滤镜或结果类型 |
| Video | `id`, `name`, `storage_mode`, `external_path?`, `workspace_id?`, `relative_path?`, `equipment_train_id?`, `equipment_snapshot?`, `filter_state`, `filter_id?`, `filter_snapshot?`, `notes?`, `revision`；不支持校准主帧绑定 |
| 校准绑定 | 独立关系 `collection_id`, `master_id`, `created_at_utc`；具体关联约束待细化 |

最终枚举：`frame_type = light | dark | flat | bias | dark_flat | unknown`；`calibration_state = calibrated | uncalibrated | unknown`，默认 unknown；`filter_state = selected | none | unknown`；`storage_mode = external_reference | managed`。外部引用使用 `external_path`，托管文件使用 `workspace_id` 与 `relative_path`。selected 对应滤镜 ID 和快照；none 表示明确未用，unknown 表示未知。数据类型、快照细节、校准关系约束仍需核实。设备组合与滤镜变更不覆盖既有素材快照；滤镜仅来自所选组合。文件可用性查询时检查。原始 FITS 不修改且保留数据和元数据；不意味着 Agent 读取它们。

新业务记录使用 SQLite 0005 专用表，沿用 `assets`、`asset_locations` 管理文件。兼容路径见 TECH-010。

## TECH-007 — 项目与图像结果（最终模型，落地见 TECH-010）

项目使用项目及多层逻辑树节点，任意层可引用多个素材；移动项目节点不移动实际文件。候选 Project 字段：`id`, `name`, `notes?`, `revision`, `created_at_utc`, `updated_at_utc`。候选 Project Node 字段：`id`, `project_id`, `parent_id?`, `name`, `kind`, `resource_id?`, `revision`；`kind = folder | subframe_collection | video | image_result`。只有 folder 为父节点，根节点 parent 为空；文件夹 resource 为空，素材节点指向相应记录，父节点属于同项目且不能形成循环。项目名唯一；同级所有节点共用名称唯一约束；节点名称不含 `/`。大小写和 Unicode 比较拟对齐设备名称规则，具体跨平台语义待核实。允许跨项目引用，禁止同一项目内重复引用同一素材；节点名称可用独立别名，详情显示节点及素材名称。批量建树预检后原子提交，已存在文件夹视为满足；非文件夹占位或非法路径阻断全部新建。空目录可删除，非空目录及项目显示影响并确认后删除项目节点，保留素材及实际文件。数据结构保持内部稳定 ID，MCP 通过项目名称及 `/` 分隔的项目内逻辑路径访问，支持批量建树、树查询、添加与访问素材、文件解析、移动重命名及移除；MCP 使用公开接口及现有授权，具体工具契约、确认机制与宿主路径权限待设计。名称歧义不静默选择。分页、统计等细节仍待明确。

图像结果仅包含 `id`, `name`, 文件位置（`storage_mode`, `external_path?`, `workspace_id?`, `relative_path?`）, `notes?`, `revision`。两种前端入口共享这些字段，用户通过名称、备注和项目目录表达用途。实际持久化见 TECH-010。

## TECH-008 — 类型驱动导入与绑定（落地见 TECH-010）

前端 Master Frame 与图像结果是两个类型选择入口，底层共用图像结果结构，入口分类与筛选见 TECH-014；两者均接受外部单文件。子帧组可追加多个文件夹，视频选择单文件；可选的 Light/Flat 校准绑定由类型匹配规则决定。预检返回参数差异和未知供参考，不要求额外确认。文件导入已提交而绑定失败时返回可区分结果并支持绑定重试，不重新导入文件。

## TECH-006 — 校准库统一主帧（最终模型，落地见 TECH-010）

一份校准主帧对应一条独立记录与一个文件，不引入额外版本组；候选字段：`id`, `name`, `type`, `storage_mode`, `external_path?`, `workspace_id?`, `relative_path?`, `source_collection_id?`, `camera_id?`, `camera_snapshot?`, `exposure_seconds?`, `iso?`, `gain?`, `offset?`, `binning?`, `readout_mode?`, `temperature_c?`, `equipment_train_id?`, `equipment_snapshot?`, `filter_state`, `filter_id?`, `filter_snapshot?`, `notes?`, `revision`, `created_at_utc`, `updated_at_utc`。类型候选枚举 `dark | bias | dark_flat | flat`；文件存储与滤镜状态沿用 TECH-005 的候选枚举。相机、光路及参数未知可为空；Flat 主要使用设备组合及实际滤镜信息，另外三类以相机与采集条件为主要参考。来源组存在时复制当时参数作为主帧自身信息为建议，细则待定。子帧组到校准主帧的候选绑定为 `collection_id`, `master_id`, `created_at_utc`；关联约束、版本、删除、复制语义及 Dark Flat 到 Flat 的处理来源均待设计。视频不绑定校准场。

不引入结构化 `capture_date`；登记时间与拍摄时间语义分开。每个校准主帧 ID 与文件独立，新记录不覆盖旧记录或改变已有绑定；`revision` 仅用于同一记录的并发控制。现有数据库和服务不因该设计记录而改变；与现有校准单帧、主帧和绑定实现的兼容影响须在实现前核实。

## TECH-009 — 素材绑定、校准及项目细则

用户决定：具体滤镜须来自已选设备组合；组合无滤镜可明确选择无，未选组合不选具体滤镜，未知与无保持区分。设备或组合后续变动不自动覆盖已保存快照，用户可主动解绑或重绑；解绑后快照和关联滤镜如何显示及历史保留待细化。后续处理产生新数据，不自动更改原子帧组的校准状态。组内差异由 Agent 兜底，本轮不做自动检测和拆分；“阅读 id”的含义待澄清，不应假定 Agent 能读取文件元数据。

温度保留原始值，后端不进行温差比较或据此阻止绑定。其他匹配字段和适用类型的实现默认值见 TECH-010。

## TECH-010 — 最终模型的持久化与兼容范围

- SQLite 0005 新增子帧组、子帧、视频、图像结果、校准主帧、校准绑定、项目和项目节点表。沿用 assets 与 asset_locations 管理文件身份和位置。两条导入链路在文件登记事务中写入新表。校准绑定单独报告结果，失败时可从回执重试，也可在组详情修改选择。
- 校准默认允许 Light 关联 Dark、Bias 和 Flat，允许 Flat 关联 Bias 和 Dark Flat。相机、ISO/Gain、Offset、Binning 和读出模式按登记值比较，Dark 与 Dark Flat 加曝光，Flat 加组合和实际滤镜。光路状态无法可靠观察时展示未知。当前允许显式关联多份不同 ID 的校准候选，重复同一 ID 不增加记录。其余比较规则待用户决定。
- 项目按路径组织，名称经 NFC 与 casefold 比较。/catalog/projects 及节点端点提供创建、查询和管理。非空目录与项目删除需要确认，移除项目结构保留素材和文件。现有 MCP 工具未切换。
- DEV-040 期间曾保留旧关系兼容。DEV-041 撤销这一决定，现行范围见 TECH-011。

## TECH-011 — 清理旧关系

SQLite 0006 删除旧集合、项目、目录、素材放置、校准主帧与校准绑定记录及其审批，以及旧混合导入提案。源文件、文件登记和存储任务回执不受此清理影响。子帧组摘要、成员和来源节点读取最终模型。项目与校准的业务接口归入目录 API，混合导入的旧 HTTP 与 MCP 契约下线。

- 校准子帧复用素材记录。外部校准主帧可独立登记，选用来源组时继承未显式覆盖的采集字段。主帧被引用时 API 返回引用 ID 并拒绝删除，解绑后移除记录仍保留文件登记。来源组关系使用 SET NULL。Dark Flat 到 Flat 的处理来源不自动推断。项目从空树开始，目录统计分别返回递归文件夹和引用数量。客户端通过浏览器确认项目与非空目录移除。

## DEV-079 — 三领域 MCP 目录契约

MCP 通过素材库 Bearer 调用公开目录和导入任务 API。名称匹配用 NFC 与大小写折叠，数据修订和内部关系由后端维护。导入入口接受明确来源和类型字段，通过正常预检和存储任务执行。通过已登记主帧创建校准记录时共用文件身份。校准未知确认复核比较结果，项目删除确认复核目标和子树的 ID 及版本。子帧文件使用服务端分页，跨类别目录与候选查询在后端筛选后分页，当前仍会枚举相关目录记录。

## DEV-080 — 设备工具、产品 Skill 与客户端接入

| 工具组 | 当前工具 |
| --- | --- |
| 单个设备 | `equipment_list`、`equipment_get`、`equipment_create`、`equipment_update`、`equipment_set_archived`、`equipment_delete` |
| 设备组合 | `optical_train_list`、`optical_train_get`、`optical_train_create`、`optical_train_update`、`optical_train_set_archived`、`optical_train_delete` |

设备和组合按各自的唯一名称定位，现有英文枚举及输入和分页语义见 [MCP 契约](../../../../docs/mcp.md#设备与设备组合授权)。具备读取凭据时注册四个查询工具，具备独立写入凭据时注册六个创建、更新和归档工具。启用可信聊天确认并配置独立审批凭据时再注册两个删除工具。按名称定位现有记录和成员依赖读取凭据。素材、校准和项目的 27 个工具由独立素材库凭据启用。

**产品 Skill 现状。** 设备、素材、校准和项目均没有随包交付的业务 `SKILL.md`。FastMCP 已有条件加载器，发现包内 `mcp/src/astrophoto_mcp/skills/<name>/SKILL.md` 时接入 Provider。仓库 `.agents/skills/` 内的开发技能由开发 Agent 使用。客户端可直接通过工具发现使用现有业务能力。

**接入与分发。** 支持本地 stdio 的客户端（如 Codex、Claude Code）启动独立 `astrophoto-mcp` 子进程，后者连接同一机器上的 AstroPhoto 扩展端点，例如 `http://127.0.0.1:8188`。内测可在独立 Python 环境安装本地 wheel，再将客户端的启动命令指向该环境。公开发布后可将启动命令配置为 `uvx astrophoto-mcp@<已发布版本> --comfy-url http://127.0.0.1:8188`。客户端启动环境仅传入所需凭据，宿主使用对应的值。打开新会话后先调用 `connection_status`，再核对实际发现的工具。公开 PyPI 版本存在性尚未确认，本条记录分发建议。若未来提供业务 Skill，可随 wheel 分发，或按支持的客户端单独交付配置加 Skill 的插件。仅支持远程 HTTP 的客户端需要另外设计部署。

客户端配置参考 [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)、[Claude Code MCP](https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server)及[发行状态](../../../../docs/publishing.md)。

## DEV-086 — 校准主帧并入素材库

主帧基础信息使用 `ImageResult` 和现有文件 ID；暗场、平场、偏置场、平场暗场的采集参数与绑定复用 `CalibrationMaster`、`CalibrationBinding`，共享同一文件 ID。`master_type` 由校准记录或图像属性返回，图像主帧与未知用途保存在现有属性中。导入预检将校准用途转换为校准参数写入计划，在文件发布事务创建图像与校准记录。已有主帧通过图像接口修改用途，引用保护适用于采集和设备变更；移除登记时检查项目与校准绑定并保留文件。子帧组和单文件素材的目录汇总提供实际格式及存储位置供筛选。

独立校准登记页面及 MCP `calibration_register` 已移除；`library_import` 和 `library_update` 支持主帧用途及校准参数。校准候选和绑定工具继续经公开接口提供。此节取代 DEV-080 中目录工具总数，现为 26 个。两种导入模式和有限数据量已测试，大库筛选性能待验。

v0.0.1 未要求批量迁移旧测试数据。此前只有独立校准记录的旧测试条目不会自动批量补建图像主帧记录；对旧校准记录编辑保存时会补齐共享文件 ID 的图像记录。新导入和主帧用途变更走当前模型。是否需要旧测试条目在不编辑时参与图像主帧项目引用及 MCP 主帧检索，应按实际测试数据处理范围单独验证，不把历史数据迁移列为本轮完成条件。

## DEV-091 — 普通主帧参数和来源

普通主帧在 ImageResult 保存拍摄参数和来源，校准主帧继续由 CalibrationMaster 负责相同字段及引用保护；两种类型切换时事务内转移字段，读取只采用对应类型的权威记录。ImageResult 增加可空字段，保留已有文件身份和快照；来源组引用受删除保护。导入、编辑、详情和 MCP 使用同一字段契约，不读取文件元数据。

## 素材名称唯一性

使用共享名称登记表存储 NFC + casefold 名称键，对四类素材按逻辑身份强制唯一；子帧不登记，校准主帧和图像主帧同一身份只占一项。导入预检提示冲突，发布事务再次原子登记以保护并发；重命名同事务更新，删除记录时释放名称。已存在的测试重名记录升级时追加数字后缀，保留文件和引用。

DEV-107：复制任务在写事务中检查确定的发布前冲突。暂存文件仍存在且确定拒绝时，提交逐项失败回执，继续处理剩余项，收尾清理暂存目录。文件已经可能发布时，使用原有恢复检查点。SQLite 0010 的 `collection_directories` 按工作区和相对路径登记子帧组目录，最后一帧取消登记后保留归属。改名恢复可用归属定位目录，跨工作区移动已登记文件时登记目标归属。升级仅依据已有受管成员补记归属，无法凭一个未登记的目录推断其所有者。

## 素材 MCP 名称操作与追加

MCP 使用公开目录 API 在内部解析全局唯一名称；素材工具不接受或暴露内部 UUID。追加复用存储导入任务与既有组身份，按事务分配文件序号并检查重复；不覆盖共同参数。短任务号与后端操作 ID 的映射持久化在已有业务记录表并使用随机值与冲突检测，重启后继续查询。校准比较保留为信息，绑定只检查类型及引用，不拒绝差异或未知。

按源路径去重依赖已保存的来源路径映射；历史托管复制及浏览器上传可能没有可用的原始绝对路径，不能据此保证识别所有历史重复文件。新目录记录的创建／更新时间存于业务记录表，旧记录缺失时不虚构创建时间。

来源路径标识按组和规范化路径建立哈希索引，属于路径去重而非内容指纹；不同路径的相同内容不会因此识别为重复，同路径内容被替换也不能据此认定相同文件。内容哈希作为可能的后续方案，尚未获准实现。浏览器的文件夹上传确认框由浏览器控制语言，扩展内中英文文案与之独立。

## MCP 可省略更新字段

保持现有扁平工具参数，使用 Pydantic 2.14+ 的 MISSING 标记区分未传入与显式 null；字段类型显式包含 MISSING，生成 schema 中不暴露该标记，允许清空的字段保留 null。设备、设备组合、素材及项目更新沿用各自原有清空规则。FastMCP 与 Pydantic 的依赖范围显式约束并以工具发现和调用测试验证。

## 项目 MCP 按名称绑定及递归查询

`project_add_assets` 按全库唯一名称解析素材，输入仅含 name 和可选 alias，整批交公开引用接口原子提交；项目及节点仍由后端内部 ID 关联。`project_get` 增加 recursive 参数，目录 API 的 descendants 视图按名称顺序深度优先返回相对于项目根的完整路径，服务端分页并以既有不透明游标续页；详情输出去除素材引用 ID。后端仍先枚举子树，大项目性能及遍历期间并发修改的稳定性待验。项目节点继续保存 image_result 类型及资产 ID。对于缺少图像记录的历史独立校准主帧，项目节点响应提供 resource_kind=calibration_master 供侧栏和 MCP 读取，并保留现有引用删除保护。


目录列表在 SQLite 读事务内按摘要筛选、排序并分页，再补齐当页的文件位置和子帧统计。每次请求仍枚举相应类型的摘要。分页期间可读到新写入，锚点消失时返回 REVISION_CONFLICT。

目录注销复用对应详情的 revision，兼具图像记录的校准主帧以校准记录为准。过期时返回 REVISION_CONFLICT，现有素材保持登记。整组注销集中清理成员反向引用，分批删除登记并共享同一写事务。独立校准主帧的统一目录响应附 resource_kind=calibration_master，MCP 以该类型访问具体资源。

侧栏及 MCP 对项目和非空目录删除统一提交影响预览令牌，写事务校验当前范围。侧栏移除子帧提交组版本。组摘要和成员页独立读取，完整详情兼容原响应并联表取得文件及工作区位置。

直传首次创建目标素材目录时记录暂存目录相对路径及文件系统身份，然后以同卷不覆盖重命名发布目录。重启继续使用已记录且身份一致的目录和暂存文件。0011 将已有成员的旧导入组补齐为目录子帧组。保留稳定 ID、帧序和文件位置，名称经全库冲突规则处理。已有成员或新导入成员均通过目录接口查询。
