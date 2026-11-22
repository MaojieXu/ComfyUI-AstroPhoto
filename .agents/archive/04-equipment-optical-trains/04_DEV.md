# 设备、设备组合、素材与 MCP · 开发规格与实现记录

以下记录原实现、兼容行为和待开发差距。合并后的开发范围以[统一 PRD](01_PRD.md)为准。

<a id="04-equipment"></a>

## 设备与设备组合


**v0.3 · 当前源码回溯**。本轮文档同步，共享 [索引](00_FEATURE_INDEX.md#04-equipment) 的 HEAD + dirty 基线。React 历史页可查 `git show 4c0cf4d:frontend/ui/src/features/settings/equipment/EquipmentPage.tsx`，当前入口为 Vue，七条主要页面路由在有状态的 EquipmentPage 中。

| 需求 | 现行文件和符号 | 实际路径、拒绝与副作用 | 用例 |
| --- | --- | --- | --- |
| FR-04、FR-05 | `frontend/src/features/sidebar/SettingsPage.tsx:SettingsPage`；`frontend/src/features/library/pages/EquipmentPage.tsx:EquipmentPage,leave,discardAndLeave`；`frontend/src/host/sidebar.ts:registerSidebar` | 依赖 capabilities，已访问视图挂载。编辑脏状态同步到注册实例 `EquipmentSession.current`，卸载解除 guard 和 beforeunload，重新打开重建当前编辑。表单 busy 禁止离开，正常离开可确认丢弃。查询状态只在 EquipmentPage 实例保留。 | CASE-04、05 |
| FR-01、FR-04 | `frontend/src/features/library/pages/EquipmentList.tsx:EquipmentList`、`EquipmentForm.tsx:EquipmentForm,SpecDetails`、`EquipmentDetails.tsx:EquipmentDetails` | 输入去抖后以查询/筛选/epoch 载入分页，后续页按游标追加。新增按种类构造字段，PATCH 带原版本；读取权威 DTO 显示折叠详情、引用。409 重读现有设备，确认后替换版本基线，保留提交表单。 | CASE-01、04 |
| FR-01、FR-03、FR-05 | `astrophoto/equipment/schemas.py:equipment_fields,validate_specs,validate_passbands,readout_modes,list_options`；`service.py:EquipmentService,persist_specs,change_version,check_equipment_references` | 字段校验器检查文本、枚举、类型和未知字段；文本通常最多 120，备注 4000；读出/通带各最多 32，重复标签/ID或反向范围拒绝。创建事务写父和规格；更新事务载入类型后校验、比较版本、写规格和 DTO。带 ID 的通带必须属于该滤镜。删除先核版本再查当前配置和全部旧快照，受保护时事务退出，无数据删除。 | CASE-01、03 |
| FR-02、FR-04 | `frontend/src/features/library/pages/OpticalTrainEditor.tsx:OpticalTrainEditor,withNewDevice`；`OpticalTrainDetails.tsx:OpticalTrainDetails`；`frontend/src/api/equipment.ts:fetchSelectable,createTrain,saveTrainDraft` | 可选设备按 archived=all 分页加载，选择层显示归档项失效，活动列表排除。新建 POST 含配置，编辑 PUT 带 `expected_draft_version`；快速新增设备独立保存并填入当前光路草稿。编辑 409 重读，归档则报错，人工确认后原输入使用新版本。 | CASE-02、04、06 |
| FR-02、FR-03 | `astrophoto/equipment/trains.py:OpticalTrainService,train_to_dto,revision_dto`；`snapshots.py:validate_train_components,validate_train_snapshot`；`schemas.py:parse_train_draft` | 草稿校验名称、唯一 UUID 部件及各列表最多 50、旋转 [-360,360]；部分配置允许为空。写事务先拒绝归档光路和过期 draft 版本，再校验组件存在及类型，清空 base revision 更新配置和主行版本。读取当前优先，旧默认/最新为回退，真实名称来自当前设备。删除按主行版本核验，延迟 FK，移除默认及配置、暂移除不可删触发器、删目标快照、重建触发器，再删主行，任何异常由事务回滚。 | CASE-02、03、06 |
| FR-03、FR-05 | `astrophoto/api/equipment.py:equipment_routes`、`api/storage.py:handler`、`api/security.py:authorize_equipment_request`；`frontend/src/features/library/components/useMutation.ts:confirmAction,useMutation` | 宿主确认（删除带对象名、确认返回恢复焦点）、pending guard、HTTP 权限与输入校验、服务检查与写入按顺序发生。未确认无 DELETE；使用引用独立于页面检查。HTTP 反馈带 request ID，409 从详情或表单有不同恢复动作。Abort 后忽略客户端结果，服务端提交状态需查询确认。 | CASE-03～05 |

### v0.4 待实现差异

- **名称与反馈 · CASE-07。** 用户词条改称「设备组合」。设备创建和更新、OpticalTrainService.create_train 与 _write_draft 写组合名称。目前服务和持久层无同名守卫，后续覆盖并发、旧数据与 Q-07 比较口径，向名称字段回传重名反馈。
- **归档引用 · CASE-06。** validate_train_components 目前检查存在性和类型。待在实际写入入口区分已有引用和新增引用，覆盖带组件新建、修改、删除引用后再尝试加入。保留版本冲突、快照兼容和失败回滚。
- **现有路径回归 · CASE-06、CASE-08。** 两列表独立单选、原表单不开放额外控件。验证普通编辑保留兼容字段。

**实施差异与影响**。已实现 Vue 详情、保存、重基及响应回执。API 仍允许符合类型的归档设备被直接加入配置；旧值在编辑器只读保留，配置备注/旋转/平场字段无编辑控件。光路默认及发布接口受保护，主详情未提供旧快照浏览页面；历史通过仅作历史兼容参考。MCP 入口 `mcp/src/astrophoto_mcp/api/equipment.py:EquipmentHTTP.get` 经独立连接与 Bearer 调用相同设备路由，当前没有写入 Tool。当前未定义网络不确定后自动恢复创建、字段级合并或批量操作。 [待决规则](01_PRD.md#04-equipment) · [事务与规则](03_TECH.md#04-equipment) · [测试计划](05_TEST_PLAN.md#04-equipment) · [删除历史记录](../../notes/04-equipment-delete.md)

<a id="05-mcp"></a>

## MCP 诊断与设备只读查询


**版本** v0.4 · 2026-11-21 · 当前源码披露

Git 参考为 `main@4c0cf4d`，当前宿主 bootstrap、route 装配和发布脚本含未提交修改。下表以磁盘代码为准。

| 切片 | 当前路径和符号 | 执行、拒绝、副作用顺序 | 追溯 |
| --- | --- | --- | --- |
| S1 启动 | [CLI](../../../mcp/src/astrophoto_mcp/__main__.py) `main`；[配置](../../../mcp/src/astrophoto_mcp/config.py) `resolve_comfy_url` | CLI 参数覆盖 COMFYUI_URL，未设才用默认。去首尾空白，拒绝内嵌空白、反斜线、查询、片段、凭证、非法 scheme/host/port。正规化为以 / 结尾并保留前缀。无效配置在创建服务器前返回 argparse 错误。--version 直接输出安装版本并退出。 | FR-04 / CASE-01A |
| S1 枚举 | [FastMCP factory](../../../mcp/src/astrophoto_mcp/server.py) `create_server`；[诊断工具](../../../mcp/src/astrophoto_mcp/tools/status.py) `register_status` | 创建 FastMCP 并拒绝重名注册。先登记两个默认工具，再按 token 与 direct_url 添加设备只读工具。只有安装包内存在 Skill 时加载 provider，非法包内 Skill 可阻断启动。CLI 启动 stdio 且关闭 banner。 | FR-01、FR-02、FR-04 / CASE-01A、02A |
| S2 诊断 | [HTTP 客户端](../../../mcp/src/astrophoto_mcp/client.py) `diagnose`；[公共端点](../../../mcp/src/astrophoto_mcp/api/comfy.py) `fetch_status` | 创建异步 HTTPX 客户端，先 stats 后节点信息，各自 HTTP 检查后解析 JSON；校验两个顶层对象及 system 形态，结束关闭连接。节点键缺失只令 extension_registered=false。 | FR-01、FR-04 / CASE-01B |
| S3 工具与 DTO | [六个工具](../../../mcp/src/astrophoto_mcp/tools/equipment.py) `register_equipment_tools`；[适配器](../../../mcp/src/astrophoto_mcp/api/equipment.py) `credential/direct_url/canonical_id/list_params/valid_record/EquipmentHTTP.get` | 注册前 token 需 43–256 个 ASCII 字母数字或 -/_，URL 为 loopback IP 根路径。工具执行先校验 UUID 和分页值，query 最长 120、limit 1–100，默认 page 50。请求只 GET，携带 Bearer。校验状态及 JSON，再检查 equipment/train/revision DTO，分页检查返回游标；失败报告 ToolError 并关闭连接。 | FR-02、FR-05 / CASE-02A/B/C |
| S3 服务端授权 | [初始化](../../../astrophoto/bootstrap.py) `host_runtime`；[安全](../../../astrophoto/api/security.py) `trusted_deployment/direct_local_request/authorize_equipment_request/equipment_read_token`；[路由](../../../astrophoto/api/routes.py) `register_routes` | 宿主初始化时捕获 token，判断部署；设备路由走独立权限分支。远端、转发头、跨站或不合规 Host/Origin 先拒绝。带 Authorization 仅允许无 Origin/Fetch Metadata 的 GET，随后比较 Bearer；拒绝在服务操作前返回 403。浏览器同源分支使用 Fetch Metadata 和本地授权头。 | FR-02、FR-05 / CASE-02D/E |
| S4 发行 | [包元数据](../../../mcp/pyproject.toml)；[release.py](../../../scripts/release.py)；[check_install.py](../../../scripts/check_install.py) `main/probe` | 校验根版本、MCP pin、构件内容。check_install 用 uv 创建隔离环境，从指定 wheel 或公开索引安装；隔离 Python 启动并检查版本、默认工具和 version 调用，临时目录结束时清理。探针不调用真实 connection_status。 | FR-03 / CASE-03A/B/C |
| S5 凭据生命周期 | `server.py:create_server` → `EquipmentHTTP.__init__`；`bootstrap.py:host_runtime` → `api/routes.py:register_routes` → `api/security.py:authorize_equipment_request` | MCP 启动把值捕获到适配器；宿主初始化把值捕获到 runtime，鉴权时读运行态。重复注册同一 AstroPhoto RouteTableDef 复用原 runtime，仅替换节点探针，不能作为轮换入口。新宿主必须用同一测试 Data Root 和新环境重启，之后通过 403/200 区分旧、新客户端。 | FR-05 / CASE-02E |

### 使用错误与实际缺口

- 不合规凭据格式在 MCP 进程的枚举阶段隐藏工具。同形状错凭据只有实际调用时才从宿主得到拒绝。设备适配器仅选取受字符和长度约束的 `error.code`，以及 HTTP 状态。真实宿主以固定业务码返回，客户端 stderr、运行记录与证据仍单独检查脱敏。
- 设备组合工具描述仍含 “editable draft” 和 “default revision” 等旧词。当前 Extension 读取的是当前配置，新保存不创建旧式修订；历史列表/详情保持兼容读取。以实际 DTO 和设备专题为准。工具描述调整属于后续修改，回归应保留旧工具名和参数。
- `optical_train_list` 暴露 query/include_archived/cursor/limit，没有独立的可用性参数。PRD 保留按返回状态判断是否可用，不能写成工具已支持该筛选。
- 宿主单用户可信部署是一条部署边界。当前 token 单值且进程初始化时获取。基础诊断沿用 D-04。多 Agent 并行读取按 D-05 验收。共享凭据生效方式和读取范围分别由 Q-01、Q-03 跟踪。

[需求](01_PRD.md#05-mcp) · [技术设计](03_TECH.md#05-mcp) · [测试计划](05_TEST_PLAN.md#05-mcp)

<a id="06-assets"></a>

## 素材导入与资产登记


**版本** v0.4 · 2026-11-21 · 当前源码静态核对，基线见[索引](00_FEATURE_INDEX.md#06-assets)。下表为现存实现，产品规则见 [PRD](01_PRD.md#06-assets)。

| 需求 / 用例 | 入口和函数 | 实际分支、副作用与限制 |
| --- | --- | --- |
| FR-01 / CASE-01 | `api/assets.py:preview/import_assets` → `assets/imports.py:_selection/validate_selected_source_path/_files/_walk/preview` | DTO 校验 sources 与可选字段，workspace UUID 规范；包含 1～100 项且每项为字符串，模式两选一，会话为非空字符串且长度 ≤120。所选路径在授权根且与保护区不重叠；子项再次校验，按规范键去重。逐项累积检查错误，候选超 10,000 或遍历超 40,000 项报 TOO_MANY_FILES。copy 的预检要求在线可写目标和剩余空间，结果只返回计数、空间、有效模式及目标。 |
| FR-02 / CASE-02 | `AssetImportService.import_assets/run/_run_files` → `storage/operations.py:find/create/submit/run/status/cancel/retry` | 同一把全局锁先查 kind/key 与 payload 一致性，再解析选择、检查 copy 目标和受理。入队记录固定模式、目标和 session，worker 枚举后持久化文件清单，复按当时状态校验空间与路径。非终态可重启继续，终态复访无重做。处理完成但有部分失败时 phase 为 completed，全部失败时 phase 为 failed。 |
| FR-02 / CASE-02 | `AssetImportService.import_reference/_asset/_record` | 重查路径和原 stat，写入前变更报 SOURCE_CHANGED。已登记路径若大小和 mtime 相符则 skipped，可同事务补关系；不符则 DUPLICATE_ASSET。新登记的回执计数与 Asset/位置/会话同事务写。 |
| FR-02 / CASE-02 | `AssetImportService.import_copy/_clear_staging` → `storage/manager.py:stage_copy/publish_object` | 以工作区租约与 operation 所有者保护 .staging。源复检、写 .part，检查目录变动、取消和对象冲突，持久化 publishing 及已暂存指纹。恢复可重新核对已有对象，匹配后同一事务登记及推进计数；已记录的临时文件可按计划清理。写失败及发布后 DB 中断需对照持久态，保留读回证据。 |
| FR-03 / CASE-03 | `api/assets.py:list_assets/inspect_asset/relocate_asset` → `assets/service.py:list/resolve_asset/relocate` | 列表游标与 availability 分离，接受规范 UUID；外部读取走记录路径，受管解析 Workspace + relative_key，校验文件 stat。重绑先检授权和文件，再在锁内拒绝受管记录、大小变化及其他资产占用的目标键。成功只更新已有记录的位置与显示元数据，无物理副本或内容哈希校验。 |
| FR-04 / CASE-04 | `api/assets.py:set_asset_session` → `assets/service.py:validate_session/set_session/assign_session` | DTO 只接受布尔 attached。校验非空 session 字符串后，锁和事务内确认资产，再增删单个关系，已有/缺少关系可重复提交。不能从会话字符串推断有对应的完整会话对象。 |
| FR-05 / CASE-05 | `frontend/src/features/sidebar/Sidebar.tsx` → `AssetsPlaceholder.tsx`；`frontend/src/host/fitsSource.tsx`；`api/scientific.py:frames` → `assets/fits.py:frame_assets/resolve_input/inspect_fits` → `nodes/scientific.py:AstroPhotoFITSSource.execute` | Vue 侧栏占位不加载资产数据。独立 Widget 按页获取 FITS 候选，选 ID 或绝对路径。已登记 ID 走数据库位置解析，直接路径受 stat/FITS 检查；执行需要可信宿主和可用 storage。节点验证后传出 IMAGE_PATH，原科学文件保持不动。 |

### 差异与接续

- `frontend/ui/src/features/assets/AssetsPage.tsx`、`ImportDialog.tsx` 与旧 `frontend/ui/storage-host.mjs` 都属于 HEAD 的历史 React，当前 Vue 仅复用侧栏和科学 Widget 的入口。现有通用后端 list 不过滤/排序名称，历史 React 获取全部页面后在客户端筛选与排序。
- Q-01 同大小替换、Q-03 跨路径重复、Q-04 混合失败结果缺少路径级详情仍待产品决定。Q-02 恢复界面前先按 DEV 路径复核 API 写入、错误与恢复，再连接 UI。
- 科学 FITS 与导入选择的授权边界不同。可信本机科学输入可读绝对 FITS；该读取不会新建登记。正式处理产物登记在相应 Bundle 内处理。 [FITS 与 Siril 实现](../07-siril-fits-autostretch/04_DEV.md)
- 若 Q-02 选择恢复界面，须另行设计并实现来源选择、预检确认、分页、各阶段回执和两种位置恢复入口。现有导入错误只有序号和代码，不能展示可靠的失败文件路径；必须先决定 Q-04 的数据契约。当前技术能力及已实现内容保持上表所列范围。
- 资产缺少删除 API。现有 `PATCH /assets/{id}/sessions` 是关系解绑，不能用于清除资产记录。测试若需要通过 API 删除每条记录，需先定义资产删除对原件、受管副本、会话和既有工作流引用的语义，再将其作为实现及测试需求评审。

### 存储 v1.0 联动开发接口（待实施）

在 `assets/imports.py` 的预检/执行沿用共用来源校验，移除额外白名单前置后仍核验主路径、实际身份、OS 读取权和保护区域。按存储服务提供的卷预算与会话收尾契约实现 copy 执行和宿主重启行为。现有受权 guard 的源码描述保留为旧基线；外部重绑的内容身份选择仍由素材 Q-01 处理。 [存储 DEV](../local-storage-workspaces/04_DEV.md)


## 摄影素材库 v0.7 实现

本节描述 v0.7 对应工作树，以上合并历史保留。依据 [技术设计](03_TECH.md#摄影素材库-v07--技术设计) 和 [UI/UX v1.0](AstroPhoto_Assets_UI_UX_v1.0.md)。

| 切片 | 文件与调用链 | 拒绝与副作用 |
| --- | --- | --- |
| FR-01–04、18–19 | astrophoto/api/assets.py → AssetImportService._selection / preview / import_assets / import_reference / import_copy，浏览器上传经 library.upload → uploads.stage_upload。 | Settings revision 与预检 request 匹配后建立 Operation。用指纹检查实际源，发布后同事务写 Asset、位置、属性、项目和单项回执。旧 API 保留重复跳过，现行预检入口明确允许独立登记。 |
| FR-05–19 | astrophoto/assets/library.py: PhotographyLibrary.write、_collection、_folder、_master、_assignment、_placement、_search_assets、remove 负责关系及事务。library_rules.py 负责参数类型和差异。 | 一个 Asset 一个 Collection，树结构禁止环／跨项目父子，已知 Collection 冲突拒绝，校准条件差异需确认。SQLite revision 防止旧记录覆盖。物理删除限定导入对象、专属文件及持有 Workspace lease。 |
| FR-20–21 | nodes/scientific.py V3 Source；Siril processing → library.record_output；Inspector 或 Assets → POST /library/assets → _collect_output。 | 依序读取登记路径，失联阻止读取。正式成果无需 Asset 即可供下游使用，收录独立保存。旧输出经 0002_photography_library 保留可用。 |
| FR-22 | frontend/src/features/assets、frontend/src/api/assets.ts、现有 Sidebar 和 Canvas Adapter。 | Copy/Reference 区分，预检后提交，错误保留表单，从 All Assets 打开 Calibration Library。 |
| FR-23 | astrophoto/api/library.py → authorize_library / mutate / propose / decide；mcp/src/astrophoto_mcp/api/library.py、tools/library.py、server.py。 | MCP 只读／逻辑管理走直接本机 HTTP。修改科学与推断字段、校准、素材、集合和重要删除提案由浏览器应用。独立 token 和精确方法、路径校验。 |

PH-05 按当前调用链冻结可测分支。历史测试记录仍绑定原基线，现行 suite 和真实宿主范围见 [测试报告](06_TEST_REPORT.md)。


### 当前边界

- Calibration Collection 使用 `calibration_folder_id` 保存虚拟位置。Flat 子帧的 `calibration_method` 与 `calibration_source_asset_id` 必须可追溯，具备已校准标记、Camera 和 Optical Train，才进入校准库；Master 另外走独立登记规则。
- 设备／组合删除在其 SQLite 写事务内检查素材属性引用。Workspace 的 formal_outputs 与 AssetLocation 一起计入迁移、容量及可用性，重复收录不会重复计费。
- 浏览器 Reference 保留受信路径输入。浏览器 Copy 以 File 原始字节暂存。已提交任务持有其上传集合，退出未提交表单会请求删除暂存。仅独占导入对象有物理删除，Workspace 移动由现有存储流程负责。
- 校准界面按用途选择多项，通过 POST /library/assignments/batch 在一个事务内检查并应用。单项保留编辑撤销。MCP 可读取候选并提议绑定，界面尚无单独的 Agent 推荐调用。独立单文件物理移动、覆盖及受管输出的物理删除不在当前交付能力中。

### 素材界面与宿主样式适配（2026-11-21）

`AssetsPanel.vue` 的搜索旁使用 Reka Popover 承载排序字段、方向和分组，参考 ComfyUI Frontend v1.59.6 的 `MediaAssetFilterBar.vue`、`MediaAssetSettingsButton.vue`、`Popover.vue`；这些组件依赖宿主内部 store 与设计系统，扩展复用可移植的布局与弹层行为。筛选选项使用项目已有的上游 `SingleSelect` 适配器；搜索继续使用已适配的 `SearchField`。素材为空或筛选无结果时参考 `NoResultsPlaceholder.vue` 居中展示提示，无结果提供清除筛选。保留分类行与校准库入口以及原有查询参数。上游无 AstroPhoto 特定元数据字段和分组规则，沿用本项目业务实现。

### 筛选入口与可用值（2026-11-21 用户反馈）

`AssetsPanel.vue` 搜索行增加筛选图标与 Reka Popover，移除页面中大块展开区域；参考 Frontend v1.59.6 `MediaAssetFilterBar.vue` 的筛选入口与激活指示，使用项目已有 `SingleSelect`。打开弹层时调用现有分页 API 获取不受当前搜索或筛选影响的全部素材，按实际非空元数据、文件扩展名、存储及可用状态生成选项，并从现有关系映射项目、文件夹、集合、会话名称；无数据时显示空提示，失败提供重试。筛选请求仍沿用原服务端查询。其余上游菜单与 AstroPhoto 业务字段不匹配，未整体移植。数据量大时会产生全部分页读取，尚无服务端聚合接口。
