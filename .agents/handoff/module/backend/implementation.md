# 后端与节点

## 2026-11-21 · 全量 Siril 命令

command_table.py 固定官方命令表，commands.py 派生节点 ID、前置条件、参数和目录。command_presentation.py 为 201 条命令定义双语介绍与图像处理路径，序列变体沿用单张操作的分组。183 个脚本节点位于 18 个一级组和 21 条末级路径，另有 18 条命令只在设置显示。node.py 的缓存工厂与命令目录共用分类、标题、说明和搜索别名，保留旧节点 ID。session.py 对受信本机路径暂存，按命令需要加载当前图像并保存 FITS，支持通过 SIRIL_STEPS 合成同一脚本和 SIRIL_DIRECTORY 接续序列。文件一次性登记，恢复依据工作区、实例和运行标记，迁移按运行组成一组。以下单帧说明仍适用于 AutoStretch 兼容和专用预览。

按文件展开的实现地图：[加载、配置、存储、数据与资产](source-index-runtime.md) · [HTTP、设备、科学处理及节点](source-index-services.md) · [测试、打包脚本与项目配置](source-index-tests-build.md)。

## 启动、状态和请求边界

`comfy_entrypoint` 返回 `AstroPhotoExtension`。`on_load` 复用已注册路由携带的运行时，否则在线程中调用 `host_runtime`，根据宿主命令行与环境计算本机信任状态，注册原生 aiohttp 路由并绑定科学节点运行时。`get_node_list` 返回公共节点及命令表生成的 Siril 节点。状态请求实时读取宿主注册结果，因为 on_load 早于节点注册。SQLite 初始化失败时保留 degraded 状态和原因，不将读取配置、导入模块或创建浏览器 UI 变成初始化入口。

`trusted_deployment` 要求显式启用、所有监听地址回环、单用户、无 CORS。`direct_local_request` 还检查 peer、Host、Origin、Fetch Metadata 和转发头。存储要求 `X-AstroPhoto-Local: 1`；设备浏览器分支还要求 same-origin，Bearer 分支仅 GET 且不能携带浏览器 Origin 或 Fetch Metadata。统一 handler 提供 request_id、JSON 64 KiB 上限、字段校验和结构化错误，阻塞操作交给线程。部署边界信任本机进程。受控科学节点也检查运行时的部署状态。

## 绘图节点

`ComfyUIFEExampleVueBasic.execute` 要求自定义输入是含字符串 image 的字典，把图像值交给宿主路径解析和 LoadImage，丢弃 mask 并从 V3 NodeOutput 返回 IMAGE。单元测试验证拒绝空值、空字典、非字符串和 LoadImage 委托；替身不能揭示真实宿主的路径二次解析问题。工作流像素保存和 prompt 上传见 [画板前端](../frontend/source-index-widget-tests.md)。

当前可选 Bundle 由根 `comfy_entrypoint()` 传入，`AstroPhotoExtension.on_load` 负责现有运行时复用、回环合约与绑定。通用 `astrophoto/assets/fits.py`、`astrophoto/api/scientific.py` 及 `nodes/scientific.py` 无需 Siril。`extension/siril/bundle.py` 初始化软件和预览，恢复 Siril 运行后再继续存储操作恢复。科学文件和 API 保持现有契约。

## Siril、FITS 与候选作业

### 手工路径值节点

nodes/scientific.py:13–25 AstroPhotoImagePath 利用宿主 socketless STRING 文本控件输出相同路径值，无文件读取、无需 storage 或可信部署；对后续处理可见 IMAGE_PATH 类型。存储及文件验证由真正读取文件的节点负责。注册测试主动断言 UNC 字符串可作为原样值传递，读者后续仍拒绝此类输入。

### FITS Source 验证与资产身份

nodes/scientific.py 的 AstroPhotoFITSSource 以自定义 ASTRO_FITS_ASSET picker 获取资产或兼容本地路径，resolve_input 后执行真实 FITS 检查，输出绝对 IMAGE_PATH 和 astrophoto_asset UI 身份。fingerprint_inputs 使用解析后的 stat，StorageError 返回 NaN。astrophoto/assets/fits.py 以 canonical UUID 解析已登记资产，其他输入先匹配已登记位置，再回退本地路径。列表按 .fit/.fits/.fts 后缀查询并分页。tests/backend/test_siril.py 以真 FITS 改写并断言指纹变化。

### 单帧 FITS、HDU 选择及只读规范

当前支持 .fit、.fits、.fts。压缩 FITS、TIFF/PNG/JPEG、RAW/XISF、SER 和多帧序列是后续独立输入契约。astrophoto/assets/fits.py 利用 Astropy readonly/memmap 且 do_not_scale_image_data，选择首个有效 2D mono 或首轴为 3 的 RGB HDU，验证头和图像尺寸，读取 BITPIX 与用于查看的基础头/WCS。异常返回 FITS_INVALID，前后 stat 不同返回 SOURCE_CHANGED。extension/siril/processing.py 仅修改临时副本，选择扩展 HDU 时引入 primary、去失效校验和，NaN/Inf 置零。正式输出以实际元数据、位深、指纹和像素变化证据说明，WCS 可改写。

### 软件发现、探测和持久配置

software.py:24–53 检查绝对路径、平台可执行名/签名/可运行性。software.py:90–201 从 PATH 与标准目录查最多 8 个候选并分别实探，发现不保存；probe '-v' 上限 8s 并严格选 1.4.5，processing.py:114–134 的 15s 合成 RGB 实际检查输出数据变化与尺寸。保存需要探测成功、加锁前后身份一致，成功才写 settings 并启用。current 再核对已验证身份与 enabled，错误版本或探测失败保留此前有效配置，清除和停用各有独立操作。前端 SoftwarePage 显示探测、保存和启停结果。

### AutoStretch V3 正式队列入口

extension/siril/node.py 定义 AutoStretch 的 IMAGE_PATH 输入、三项 socketless Widgets、同类型 output_path、唯一节点 hidden ID 与 output-node flag。fingerprint 永远 NaN，使显式排队重验软件、源、当前 Workspace 并输出新资产。execute 复用原生取消 checkpoint，在 host client scope 发 transient astrophoto:siril 事件，成功携带 asset/source/原始参数给前端。后端正式入口校验服务器文件身份，同一个 AutoStretch 输出可直接给下游串联。

### 固定 SSF 和可取消的独立工作副本

processing.py:24–54,137–155 先检查空间与 CLI 身份、复制源文件并计算 SHA256、仅准备副本，用内部安全文件名和固定 SSF（requires、setcpu 4、setext fit、load input.fit、set32bits、autostretch、save result）。数值参数经验证规范化。软件子进程 offline、独立 config/cwd、无 shell 或 stdin，按 checkpoint 轮询，在失败/取消/探测超时时 kill/wait，检查退出或日志错误与产物。处理后核对源 fingerprint 和 SHA256。输出需为实际 FITS，尺寸与通道相同，Header/科学结果变化按真实样本记录；不能从尺寸断言推广至所有科学值。

### 独立 Workspace 产物、回执和回滚恢复

processing.py:158–207 使用当前默认 Workspace 租约及 outputs/{run_id} 中独立 scratch；先校验正式 FITS 再 fsync 与 no-replace 发布，记录真实元数据、SHA-256、软件版本/验证时间、参数和资产 ID，使用现有 assets.db 登记 Asset + managed AssetLocation。每次任务使用新 UUID。失败删除本次产物、写失败/取消 manifest 并发回执，之前已成功产物及原件保全。processing.py:210–249 恢复只匹配实例、workspace、run/producer/state 与未登记资产，清理受控已知 scratch 和未登记输出，标 interrupted，跳过已登记及未知用户文件。SQLite 与文件落盘之间有 crash 窗口，有恢复实现及一个 fixture 静态断言，仍应保留整类 I/O 事务失败边界。

### 大 FITS、候选队列与清理验收缺口

astrophoto/assets/fits.py 代理渲染虽逐块缩放，先分配全尺寸 uint8。extension/siril/processing.py 遇非零偏移加非有限值可产生整图 float64。候选 worker 当前无全域硬 cap，旧 owner 取消依赖 checkpoint 退出，已完成内存记录约 900s/128 项仅在后续 start 判定淘汰。正式与候选没有默认 wall clock timeout。已有 Cache 空间预算、owner 替换与配额保护，超大样本、积压、取消和孤立外部进程需独立验证。

### 只读显示代理与对齐限制

astrophoto/assets/fits.py 读取物理像素，非有限值归零、标准化/clamp、行方向矫正，RGB 转 HWC 后按等比双线性缩到设置最长边，编码 PNG。候选和正式计算仍用原始 FITS 尺寸。单一 PNG 表示显示代理，100% 是代理像素比例。extension/siril/previews.py 比较正式和候选 before/after 的尺寸与通道、方向编码和 WCS 坐标键，只有可对齐时开启 wipe。维度一致而 WCS 改写仍需并排或单图。真实历史 Horsehead 样本检验过 WCS 不对齐情形。

### 候选、前图和正式结果隔离

previews.py:18–215。以每个 Node 的 owner 替换旧队列/运行任务，取消设置 stop；完成任务过期和数量约束影响内存，不是正式文件清理。先缓存 before，使 CLI 未配置/候选失败时仍可回读前图；显式 disabled 在开始时拒绝。候选按输入、源 stat 版本、参数 hash、二进制指纹、renderer、最长边复用有效 Cache，Cache scratch 与 Workspace 正式结果隔离。formal_id 要求确切受管文件路径和对应 manifest 的 asset/source/revision/params/state、SHA256，读取验证跟踪当前 stat。前端用 AbortController、generation key、撤销 object URL 和 8s 可见验证，输入/参数不匹配的上游正式结果不用于当前显示。按周期检查软件身份发生在 validate；单张图片端点不会独立完成同等软件验证。普通 stat 相同的内容替换能否检测仍有边界。

### 四个 V3 节点和宿主输入类型

tests/nodes/test_registration.py:4–23 核对 vue-basic、AstroPhotoFITSSource、AstroPhotoImagePath、AstroPhotoSirilAutoStretch，检查输入/输出 custom types 和路径原样、构件与历史 drawing 类型。历史验证在 8207 真实 /object_info 确认四节点与新 Schema，同一时间 8201/8205 较老 Schema 和共有前端构件并存。注册查询不代替队列或图保存/重开。

### 参数、版本和旧配置保护断言

tests/backend/test_siril.py:93–127。精确业务参数拒绝 linked=0、targetbg=1.1、shadowsclip=NaN 和非数字字符串；mono 归一 false，RGB 保留 true。版本 fixture 先允许 1.4.5，然后模拟 1.4.4/1.5.0-dev 两次失败并断言旧状态完整；另测无效和 GUI 路径。真 CLI 断言见本节的正式产物测试。

### 进程中断、重启恢复和已登记结果保护

tests/backend/test_siril.py:129–158，timeout/cancel 用真实 Python 子进程，非处理流程真实 Siril；检查超时、中断和后续进程能执行。真实临时 storage/SQLite 的恢复测试保留用户文件并将匹配未登记运行标 interrupted。正式真实 CLI 测试另有 KeyboardInterrupt 保留已成功产物。由 StorageError/Exception 与 BaseException 区分的失败标记需留在诊断语境，取消不能仅凭字样推断操作成功。

### 真 Siril 1.4.5 的科学产物、原件不变及串联

`extension/siril/software.py:run_cli` 在 Windows 创建子进程时，从环境副本移除 MSYSTEM 和 MSYS，保留其他变量、退出码检查及错误日志判定。真实 1.4.5 在父环境 MSYSTEM=MINGW64 和两变量均未设置时分别通过候选和正式处理。该分支新增的真实 Python 子进程测试同时断言父环境未被修改。

tests/backend/test_siril.py 的两个真实用例由 ASTROPHOTO_SIRIL_TEST_CLI 启用。第一个发现真 CLI、验证候选前后 PNG、变更当前默认 Workspace，校验外部资产 ID、正式资产登记和回执、位深 −32、像素变化、源原字节、取消后旧结果保留。第二个将第一正式输出作为第二输入并关闭 linked，断言第一源为直接路径、第二源为第一资产 ID、两个输出均登记且不同、第二结果 RGB、manifest 身份正确并且原件和第一结果不变。旧交接 Python 3.12/3.11 各 83 passed/3 skipped。Note 此后记载 84 passed/3 skipped，含已演进串联用例。

### 临时 aiohttp/SQLite/FITS 负面路径与代理状态

tests/integration/test_siril_api.py:22–84 的 aiohttp TestServer + 真临时数据库/FITS，覆盖信任/Origin 403、读配置、错误路径、资产列表、202 预览任务、CLI 未配置而 before 可取、after 404、源删除后之前图片变 stale；不是运行中 ComfyUI 或 Siril。真实候选成功、同 owner 竞争、缓存复用、正式回执错误、远程部署与 cache 清理仍应按对应目标独立验证。

### Siril HTTP

以下地址使用 /astrophoto/v1 前缀。软件路径和处理权限沿用显式 ASTROPHOTO_LOCAL_STORAGE=1、直接 loopback、单用户、同源请求和 X-AstroPhoto-Local 机制。该部署假设信任同机用户与其选择的官方二进制。ComfyUI 原生队列的科学节点也验证宿主是否处于受信本地部署。

| 方法和路由 | 契约 |
|---|---|
| GET /software/siril | 服务器 OS、目标版本、状态，生效时包含路径、实际版本和验证时间。 |
| POST /software/siril/discover | 候选路径、来源、实际探测版本及验证状态，不自动写配置。 |
| PUT /software/siril | 接收绝对 CLI 路径。真实能力探测通过后，在同一次配置更新中保存路径并启用 Siril。 |
| DELETE /software/siril | 清除当前保存配置。 |
| PUT /software/siril/enabled | 接收布尔 `enabled`，返回软件状态 DTO。 |
| GET /fits/assets?after= | 分页列出已登记 FITS 名称和资产 ID。像素有效性在读取时检查。 |
| GET /previews/settings | 返回 AstroPhoto 的预览 PNG 最长边、可选值、画布预览尺寸和设置修订号。 |
| PUT /previews/settings | 接收 `longest_edge`、`expected_revision`，仅保存 PNG 最长边。可选旧字段 `canvas` 仍校验，但不写入。 |
| POST /previews/autostretch | 输入 asset_id 或 image_path，另含 owner、parameters，可带已登记的 formal_id。返回 HTTP 202 与 job_id。 |
| GET /previews/jobs/{id} | queued/running/ready/failed/cancelled，包含可用图像、软件版本、尺寸、输入 revision、参数和错误。 |
| POST /previews/jobs/{id}/cancel | 请求取消；旧任务不会覆写新结果。 |
| GET /previews/jobs/{id}/validate | 重新检查缓存、素材 revision 和依赖。 |
| GET /previews/jobs/{id}/{before,after} | 读取确认归属的 PNG。 |

候选请求必须提供 `owner`、`parameters`，且在 `asset_id` 和 `image_path` 中恰好选择一个。参数对象必须精确包含 `shadowsclip`（有限数）、`targetbg`（0 到 1 的数）、`linked`（布尔值，单色归一为 false）。节点默认值依次为 −2.8、0.25、true。

预览配置返回固定画布布局 480×320，PNG 最长边选项为 512、1024、2048、4096 和 0（原尺寸），默认 1024。Siril 可读可信服务器上的合规绝对路径，资产导入仍使用授权导入根。候选与正式处理读取原尺寸 FITS；缩小后的 PNG 只用于显示。

## 工作区、缓存与资产

`Operations.status` 返回 operation_id、kind、phase、effective_import_mode、workspace_id、receipt、cancel_requested 与 error（无错误为 null）；内部下划线开头的 checkpoint 不对外。迁移阶段为 queued、preparing、copying、verifying、publishing、committed、completed；导入经过 queued、preparing、importing 或 publishing。共同终态为 completed、failed、cancelled。取消仅在非终态且尚未 committed 时登记，由 worker 在 checkpoint 响应。retry 只重调度非终态，终态直接回现有状态。临时 I/O 失败可保留原 phase 并返回 error.code，客户端不可只凭 error 认定操作终止。

数据库切换前，旧根仍是权威位置。保留目标归属标记和清单，恢复目标可用性后重试同一 operation，不手动把工作区根改指部分复制目录。committed 后目标根已经生效，允许继续完成回执，不允许取消或切回旧根。保留旧源供人工核对。`test_migration_recovers_around_database_switch` 分别在切换前后注入故障；`test_migration_verification_error_keeps_source` 验证目标不可信时旧源不受损；`test_copy_recovers_after_publish_before_db_commit` 验证发布后数据库写入中断可按原 checkpoint 补登记。


**已定稿的后续行为（尚待实施与验收）。** 受信本机取消额外开关及来源白名单，保留请求来源、OS 与路径 guard；未提交导入按会话结束，迁移仍可跨重启恢复。Workspace 提交后只清理已迁清单中的受管源副本；新位置保持权威，残留可独立重试。拟新增停机整库搬家、按量冻结计划和组提交、同卷共享配额与在途预留；容量不足停止，由用户重选。当前运行入口与检查点仍按下表。 [后端概览](../../core/backend-overview.md)

### 存储服务与实现入口

| path | function | function_described | status | validation |
| --- | --- | --- | --- | --- |
| `__init__.py` | `AstroPhotoExtension.on_load` | V3 生命周期组装并注册 PromptServer 路由 | modified | 宿主 HTTP、V3 回归 |
| `astrophoto/bootstrap.py` | `bootstrap`、`host_runtime`、`initialize_storage_runtime` | 无副作用装配与显式初始化；失败保留状态和节点 | modified | 首启、非空根、真实宿主 |
| `astrophoto/core/paths.py` | `data_home` | 绝对覆盖路径及唯一默认数据根 | reused/modified | Core 配置、路径测试 |
| `astrophoto/core/config.py` | `load_storage_settings`、`write_storage_settings`、`write_json_atomically` | 严格配置读取、revision 与原子保存 | implemented | HTTP 422/409、重启回读 |
| `astrophoto/core/capabilities.py` | `capabilities`、`storage_capabilities` | 保留能力结构，检查数据库连接及初始化错误 | modified | SQLite、状态 HTTP |
| `astrophoto/storage/data_root.py` | `DataRoots.open` | 依据初始配置根 `config/` 的登记选择有效根，持有实例锁和根锁 | implemented | 入口见 `source-index-runtime.md` |
| `astrophoto/storage/initializer.py` | `ensure_data_root`、`load_or_create_manifest`、`load_or_create_settings`、`acquire_bootstrap_lock` | 全局锁、基础目录、身份文件、部分初始化重入 | implemented | 两进程、断点、缺文件 |
| `astrophoto/database/manager.py` | `DatabaseManager.initialize/session/health/backup` | 独立 SQLAlchemy Engine、实际 WAL/FK、有界 busy timeout、独立备份 | implemented | FK、rollback、busy、SQLite backup、保留不兼容数据库 |
| `astrophoto/database/migrations/` | `run_migrations_online`、单个 `upgrade` | 仅创建 `0001_equipment_baseline`，旧开发库保留并返回 DEV_SCHEMA_RESET_REQUIRED，无回填 | implemented | 新库、旧库和同版本异构拒绝 |
| `astrophoto/database/models.py` | `StorageIdentity`、`StorageLocation`、`StorageOperation`、`Asset`、`AssetLocation`、`AssetSession` | 单一权威库、引用约束、稳定 ID 和持久回执 | implemented | SQLite 模型与事务、HTTP |
| `astrophoto/storage/paths.py` | `canonicalize_root`、`validate_no_overlap`、`safe_join_workspace` | 本地路径、重叠、目录越界和链接防护 | implemented | UNC、非法 key、链接、跨卷 |
| `astrophoto/storage/locations.py` | `ensure_default/register/get/list/check_status/validate/update/relocate/remove`、`rebind_workspace` | 注册、实时诊断、默认、禁用、重新定位、解绑及切换 | implemented | 多 Workspace、离线模拟、HTTP、宿主迁移 |
| `astrophoto/storage/manager.py` | `resolve_managed/stage_copy/verify_staged/publish_object` | relative_key 解析、流式复制、重检、无覆盖发布 | implemented | 源变化、ENOSPC、真实字节、提交故障 |
| `astrophoto/storage/migration.py` | `validate/start/run/_inventory/_copy_and_commit/_complete` | 冻结清单、迁移租约、校验、原子切换、重入 | implemented | SHA256 错误、切换前后注入、C:→D: |
| `astrophoto/storage/operations.py` | `find/create/advance/status/submit/run/recover/cancel/retry` | 统一持久操作、去重、取消、并发与恢复 | implemented | HTTP 202、进程退出与重试 |
| `astrophoto/storage/cache.py` | `initialize/status/configure/store/clear_owned_cache` | 独立 Cache、身份、租约和逐项清理回执 | implemented | 路径切换、实际字节、活跃／陌生文件保留 |
| `astrophoto/storage/runtime.py` | `initialize/ensure_layout/update_settings/snapshot` | 服务组装、在线布局核对及安全补齐、健康快照、配置同步 | implemented | 重启配置、HTTP |
| `astrophoto/assets/imports.py` | `validate_selected_source_path/import_assets/preview/import_reference/import_copy/run` | 授权根、轻量枚举、模式快照、分阶段导入 | implemented | 真文件、两目录、失败注入、实际宿主 |
| `astrophoto/assets/service.py` | `resolve_asset/relocate/list/set_session` | 离线诊断、原址重新定位、分页、共享会话关系 | implemented | 重新定位、去重、共享引用 |
| `astrophoto/api/storage.py` | `storage_routes/init_storage/snapshot/settings/add_location/start_migration/handler` | 严格 DTO、原生路由、在线初始化及异步操作入口 | implemented | aiohttp TestServer、实际宿主 |
| `astrophoto/api/assets.py` | `asset_routes/list_assets/preview/import_assets/operation_handler` | 素材登记、预检、状态、重新定位和分组关联 | implemented | HTTP 合约和实际浏览器链路 |
| `astrophoto/api/security.py`、`errors.py` | `trusted_deployment/authorize_storage_operation/storage_error_response` | 本机直连边界、Origin 与代理头校验、结构化错误 | implemented | 不可信部署、请求来源、权限错误 |
| `astrophoto/api/routes.py`、`status.py` | `register_routes/status_payload` | 保留兼容状态路由，幂等注册并接线存储 | modified | 重入、异主冲突、状态、宿主 |

### 数据和 HTTP 契约

- 默认数据根为 `~/.astrophoto/`。首建 `config/`、`database/`、`storage/`、`runtime/`。配置位于 `config/manifest.json`、`config/settings.json`，锁位于 `runtime/locks/`，迁移计划目录 `runtime/migrations/` 按需创建。
- 首个工作区为 `storage/<工作区 UUID>/`，包含 `.astrophoto-workspace.json`、`objects/`、`outputs/`、`.staging/`。当前默认项来自设置，启用工作区的位置来自数据库。在线补齐检查登记、目录标记及已登记文件，已有位置记录或本会话身份与实际目录冲突时拒绝写入。
- PRD v1.1 现行实现：普通启动解析活动根、空基础清单显式超额、无卷配额使用实际空间、合法缺件位置可降级重绑、退出自动清空受管 Cache（含失败诊断）。正式产物和必要回执持久化。
- 宿主 Cache 采用 temp 下的实例专属位置，默认持久 Cache 位于 `runtime/cache/`，按需创建。20 GB 为建议限额。只清理由 CacheManager 写入、有归属描述且无活跃租约的条目。
- `settings.json` Schema 1 持有 `revision`、`workspace.default_workspace_id`、`workspace.write_policy=default`、`imports.default_mode=reference|copy`、`cache.path/max_size_gb`。模式快照和文件操作进度保存于 SQLite。
- `database/assets.db` 从 Alembic 基线 `0001_equipment_baseline` 演进到 `0002_photography_library`。原有 Storage/Assets 表包括 `storage_identity`、`storage_locations`、`assets`、`asset_locations`、`asset_sessions`、`storage_operations` 与 `alembic_version`。受管位置采用 Workspace ID 与相对 key，外部引用采用绝对路径。两种位置由 CHECK 与外键区分。
- API 前缀均为 `/astrophoto/v1`。ComfyUI 还按宿主规则挂载 `/api` 前缀。错误返回 `error.code`、`error.message`、`request_id`。

| 方法 / 相对路径 | 请求 | 结果 |
| --- | --- | --- |
| GET `/status` | — | 保持 v1 节点、路由、Extension、data_home、capabilities；增加真实 storage、database、assets 能力 |
| GET `/storage` | — | Data Root、数据库、revision、工作区容量和状态、Cache、近期操作、能力。未授权时返回 unavailable 和原因 |
| POST `/storage/init` | JSON `{}`，MCP 直连时发送 `X-AstroPhoto-Local: 1` | 受信本机授权。HTTP 200 返回 `status: ready`、有效根绝对路径 `data_root`、四组 `checks`、本次补齐项 `created` 和 `request_id`。四组为 `config`、`database`、`storage`、`runtime`。 |
| PATCH `/storage/settings` | `expected_revision` 与 `imports.default_mode`、`workspace.default_workspace_id` 或 `cache.max_size_gb` | 新 settings 与 revision |
| POST `/storage/locations` | `path, name` | 201 与 Workspace DTO |
| PATCH `/storage/locations/{id}` | `expected_revision`、`name` 或 `enabled`；设默认单独传 `default=true` | Workspace DTO。设默认用 settings revision，名称和启停用 Workspace revision |
| DELETE `/storage/locations/{id}` | `expected_revision` | 检查默认、资产引用及活跃操作。仅移除登记 |
| POST `/storage/locations/{id}/validate` | 空对象 | 身份、写探测和容量状态 |
| POST `/storage/locations/{id}/relocate` | `new_path`，可选 `allow_partial` | 同身份位置换址。存在缺件时先返回差异，显式确认后保留 ID 并显示部分可用。 |
| PATCH `/storage/locations/{id}/volume` | `quota_bytes`, `expected_revision` | 同卷容量状态，null 表示未设额度。 |
| POST `/storage/cache/configure` | `path, max_size_gb, expected_revision` | 更新后的 Cache 状态 |
| POST `/storage/cache/clear` | `scope` 为 all 或指定缓存子域 | `removed, removed_bytes, skipped, failed` |
| POST `/storage/data-root/preflight` | `target_path` | 整库范围及大小。执行入口为离线 CLI。 |
| POST `/storage/migrations/preflight` | `workspace_id` 与 `target_path`，或 `target_workspace_id`, `amount`, `unit` | 冻结计划和可确认选项。 |
| POST `/storage/migrations` | `plan_id, option_id, idempotency_key`，兼容旧完整迁移入参 | 202、`operation_id` |
| GET `/storage/migrations/{id}` | — | 持久 phase、receipt、error |
| GET `/assets` | 可选 `after` 游标 | `assets`、`next`；资产带 `session_ids` |
| POST `/assets/import/preview` | `sources`，可选 `import_mode_override, workspace_id, session_id` | 生效模式、文件计数、容量估计、目标和真实可用空间 |
| POST `/assets/import` | 同预检，并提供 `idempotency_key` | 202、`operation_id` |
| GET `/assets/imports/{id}` | — | phase、effective_import_mode、receipt、error |
| POST `/storage/migrations/{id}/cancel` 或 `/assets/imports/{id}/cancel` | 空对象 | 记录取消请求并返回实测阶段 |
| POST `/storage/migrations/{id}/retry` 或 `/assets/imports/{id}/retry` | 空对象 | 202；重新调度仍可恢复的操作 |
| GET `/assets/{id}/availability` | — | 基于真实资产记录和位置的可用性 |
| POST `/assets/{id}/relocate` | `new_path` | 重定位外部引用并保持 Asset ID |
| PATCH `/assets/{id}/sessions` | `session_id, attached` | 更新独立会话关联 |

### 路径防护与恢复

路径 API 要求管理员设置 `ASTROPHOTO_LOCAL_STORAGE=1`，使用本机 loopback 监听，关闭多用户和 CORS。浏览器走同源直连并带 `X-AstroPhoto-Local: 1`。拒绝外部监听、跨源、转发头及未授权来源。服务端素材路径受 `ASTROPHOTO_IMPORT_ROOTS` 限制，多路径使用平台路径列表分隔符。预检仅枚举本次明确提交的范围。

Scratch 和写入用同卷独占发布。导入默认只检查大小、源的元信息和文件身份，回执为 `size_and_stat`；不会扫描拍摄参数或解码。导入文件与源彼此独立。发布状态先持久化，资产登记与该文件的回执在同一事务提交。进程退出测试确认已知暂存文件可以安全重来。未知文件留给管理员核查。

迁移用 Workspace 租约，源仍保留。目标内容通过 SHA256 与件数清单校验后，根路径和 committed 状态同一事务切换。提交前的验证失败保留旧权威位置。提交后重启通过目标标记、清单和尺寸检查完成重新绑定。失败或取消的迁移目标可能保留已写数据和临时标记，以便检查。恢复仍需原卷或可识别的工作区身份。故障注入采用真实 SQLite 与文件系统；物理断电、恶意本机特权进程并发篡改和卷掉电写缓存未验收。

## 设备与光路

### 操作入口和数据规则

设备和光路的列表工具栏共用节点页的 `SearchField` 和 `SearchOptions`。交互适配 ComfyUI Frontend v1.59.1 的 `SidebarTopArea`、`SearchInput.vue` 和 `FilterDropdown.vue`。两页分别保留搜索值及单选筛选，并沿用各自的查询参数。

新增和编辑设备的专业单选字段复用 ComfyUI Frontend v1.59.1 的 `SingleSelect.vue`。官方组件负责弹层、勾选标记和键盘操作。React 负责同步表单值及保存状态，空选项保存为 `null`。

- **设置 → 设备管理 → 我的设备**提供搜索、筛选、类型选择、新增/编辑和详情。厂家、型号和备注可空，专业字段允许未知。相机支持三态制冷、读出模式及增益/偏置能力，滤镜支持多通带。
- **设置 → 设备管理 → 光学链路**提供列表、编辑器及当前配置详情。每条光路直接保存一份配置，可先保存缺少设备的配置。配置含相机与主光学设备时显示为已配置。配件按用户确认的顺序保存，滤镜表示可用集合。
- 设备和光路都原位更新。光路详情和搜索使用当前设备资料。已有光路优先读取其保存的配置；若只有旧记录，则沿用原默认配置，缺少默认时沿用最近一份。保留既有历史记录供兼容读取。支持设备及光路归档与恢复，已有引用保护继续生效。
- 旋转角度、变更备注和平场适用性是用户记录。有效焦距和焦比是标称估算，在缺失所需标称参数时显示未知。
- 未保存编辑在侧栏注册实例中暂存，在宿主关闭并重新挂载侧栏时恢复；切换模块/主视图时确认是否丢弃，浏览器硬刷新依赖浏览器的离开提示。已保存配置可跨重启。语言和配色由宿主设置控制。
- 设备与 Storage 共用数据库。设备或光路写入不会修改文件、工作区或导入设置。Capture Profile/Asset 的关联及校准匹配属于后续功能。

设备及光路详情使用摘要卡片和可折叠分组。

### SQLite 基线

当时的设备交付使用 `ASTROPHOTO_HOME/databases/assets.db` 和 Alembic 单基线 `0001_equipment_baseline`。SQLite 使用 WAL、每连接 FK、3 秒忙等待、启动 quick_check 和 foreign_key_check。健康检查比对版本、表/索引/触发器定义及身份行。当前存储路径及 schema 见上文的数据和 HTTP 契约。

| 表 | 主要结构 |
| --- | --- |
| `storage_identity`, `storage_locations` | 实例身份、工作区根及写入代际 |
| `assets`, `asset_locations`, `asset_sessions`, `storage_operations` | 资产、受管/引用位置、会话关联、现有导入/迁移操作 |
| `equipment` | 设备 ID、四类枚举、通用字段、归档、row_version |
| `camera_specs`, `camera_readout_modes` | 相机一对一规格及可选 1:N 读出模式 |
| `primary_optics_specs`, `optical_accessory_specs` | 原始光学规格及标称配件规格 |
| `filter_specs`, `filter_passbands` | 滤镜及有序通带，通带 ID、标签及波长，按滤镜限制标签重复 |
| `optical_trains`, `optical_train_drafts` | 光路与唯一可编辑配置，沿用既有存储表名及并发字段 |
| `optical_train_revisions` | 顺序号、同光路基线、快照 v1、发布时间、发布幂等键；数据库触发器阻止 UPDATE、DELETE、REPLACE |
| `optical_train_defaults` | 旧默认选择的兼容记录，同光路复合外键 |
| `alembic_version` | 当前 Schema 标识 |

设备保存同事务处理父行、规格和通带。写入先获取 SQLite RESERVED 锁（BEGIN IMMEDIATE），以条件 UPDATE 检查并发。光路保存验证组件类型，并在同一事务中更新同一份配置。数据库基线及旧历史记录保留。设备创建和初次光路创建无幂等键，出现网络不确定时先核对列表。

设备详情提供永久删除。设备被光路引用时，点击删除会显示引用的光路，需先解除引用。光路详情提供永久删除，确认后在一个事务中删除光路、配置和属于该光路的旧版本，设备记录保留。删除请求校验记录版本并使用现有写接口权限。

### HTTP 与权限

前缀为 `/astrophoto/v1`。

| 路径 | Method | 返回 |
| --- | --- | --- |
| `/equipment` | GET / POST | `{items,next,total}` / 201 Equipment DTO |
| `/equipment/{id}` | GET / PATCH / DELETE | 详情 / 新 row_version 与 DTO / 204 |
| `/equipment/{id}/archive`, `/restore` | POST | 归档或恢复后的 DTO |
| `/optical-trains` | GET / POST | `{items,next,total}` / 201 光路详情，可附初始配置 |
| `/optical-trains/{id}` | GET / DELETE | GET 返回当前配置、相关设备和兼容摘要；DELETE 接受 `expected_version`，成功 204，在同一事务清理本光路配置和旧历史 |
| `/optical-trains/{id}/draft` | GET / PUT | 现有保存行 / 原位保存回执及并发字段 draft_version |
| `/optical-trains/{id}/revisions` | GET / POST | 旧历史摘要 / 410 TRAIN_HISTORY_READ_ONLY |
| `/optical-trains/{id}/revisions/{revision_id}` | GET / PATCH / DELETE | GET 返回历史快照；PATCH/DELETE 返回 409 |
| `/optical-trains/{id}/default-revision` | PUT | 410 TRAIN_HISTORY_READ_ONLY |
| `/optical-trains/{id}/archive`, `/restore` | POST | 更新后的光路详情 |

状态查询兼容旧参数 `published`，界面显示「已配置」。列表使用 UUID 游标 `after`、`limit` 1–100，以及搜索/类型/状态/归档筛选。写操作校验 JSON 结构及 64 KiB 上限。非 204 成功回执带 `request_id`；错误形如 `{error:{code,message,details?:{fields}},request_id}`。409 表示版本冲突、引用保护或历史不可变，422 表示业务输入失败，503 表示依赖不可用。204 带 `X-Request-ID`。

设备域在 `ASTROPHOTO_LOCAL_STORAGE=1`、单用户、无 CORS、直接 loopback 的宿主启用。浏览器请求验证 loopback peer 与 Host、同源 Fetch Metadata、Origin 以及无代理标记。边界信任同一台机器上的进程。`X-AstroPhoto-Local` 是浏览器客户端的请求标记。状态分别报告 `equipment`、`optical_trains` 可用性。独立 MCP 使用显式配置的只读 Bearer 授权，对应 [MCP 只读工具](../mcp/implementation.md)。

### 实施映射

| path | function | function_described |
| --- | --- | --- |
| `astrophoto/database/{equipment_models,manager}.py` 和 `migrations/versions/0001_equipment_baseline.py` | typed models / `initialize` / `session` / `health` | 共用资产库，固化并核验基线、约束及写锁 |
| `astrophoto/equipment/{schemas,service}.py` | `equipment_fields` / `validate_specs` / `EquipmentService` / `check_equipment_references` | 专业字段及空值语义、事务 CRUD、分页与引用保护 |
| `astrophoto/equipment/{trains,snapshots}.py` | `OpticalTrainService` / `save_draft` / `snapshot_draft` | 原位保存、并发保护及旧记录回读 |
| `astrophoto/storage/runtime.py`, `bootstrap.py`, `core/capabilities.py` | `StorageRuntime` / `host_runtime` / `storage_capabilities` | 在实际 V3 生命周期装配、报告真实状态 |
| `astrophoto/api/{equipment,routes,storage,security,errors}.py` | `equipment_routes` / `register_routes` / `handler` / `authorize_equipment_request` | 宿主 RouteTable 与线程外移、来源校验、结构化响应 |
| `mcp/src/astrophoto_mcp/{server,api/equipment,tools/equipment}.py` | `create_server` / `EquipmentHTTP.get` / `register_equipment_tools` | 在单一工厂注册 6 个受控查询 Tool |

React → `api/equipment.ts` → 宿主 `app.api.fetchApi` → aiohttp 鉴权与参数校验 → Equipment/Train Service → DatabaseManager Session → SQLite commit → DTO 校验 → 更新 React 视图。MCP → HTTPX → 同一 aiohttp API，以只读凭据访问。

### 测试与未覆盖条件

`tests/backend/test_storage.py` 使用临时真实目录和 SQLite，验证根目录校验、离线恢复、reference/copy、源变更、幂等、取消、迁移根切换、缓存 ownership 与 lease。第二卷用例要求可写的独立本地卷。`tests/integration/test_storage_api.py` 使用 aiohttp TestServer 驱动真实路由和 DTO，检查授权、错误回执、重复注册和项目状态。`tests/backend/test_equipment.py` 与 `tests/integration/test_equipment_api.py` 覆盖四类设备 DTO、版本竞争、引用保护、光路兼容读取、只读 token 和永久删除的事务回滚。真实 ACL、文件占用、介质断线和多平台压力矩阵未穷举。

## 关键实现摘录：__init__.py

```python
class AstroPhotoExtension(ComfyExtension):
    async def on_load(self) -> None:
        from server import PromptServer
        import nodes as host_nodes

        import asyncio
        import os

        from .astrophoto.api.security import trusted_deployment

        routes = PromptServer.instance.routes
        for route in routes:
            existing = getattr(getattr(route, "handler", None), "astrophoto_runtime", None)
            if existing is not None:
                self.runtime = existing
                AstroPhotoFITSSource.runtime = AstroPhotoSirilAutoStretch.runtime = existing
                return
        runtime = await asyncio.to_thread(
            host_runtime, lambda: host_nodes.NODE_CLASS_MAPPINGS.get("vue-basic") is ComfyUIFEExampleVueBasic
        )
        try:
            from comfy.cli_args import args
        except ImportError:
            args = None
        runtime.trusted_local = trusted_deployment(args, os.environ)
        self.runtime = register_routes(PromptServer.instance.routes, runtime)
        AstroPhotoFITSSource.runtime = AstroPhotoSirilAutoStretch.runtime = self.runtime

    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return [ComfyUIFEExampleVueBasic, AstroPhotoFITSSource, AstroPhotoSirilAutoStretch, AstroPhotoImagePath]

async def comfy_entrypoint() -> AstroPhotoExtension:
    return AstroPhotoExtension()
```

## 测试用例与断言定位

以下按维护中的测试文件列出用例和实际断言摘录。断言可能位于参数化用例的多个分支；执行环境和通过数见 [验证](../../core/verification.md)。

### tests/backend/test_core.py

- `test_import_and_config_do_not_create_directories`（11 行）。断言摘录。`paths.data_home() == root`；`config.data_home == root`；`config.extension_id == 'ComfyUI_AstroPhoto'`；`config.version == '0.0.1'`
- `test_default_data_home`（24 行）。断言摘录。`paths.data_home({}) == tmp_path / '.astrophoto'`；`not (tmp_path / '.astrophoto').exists()`
- `test_invalid_home`（31 行）。断言摘录。`pytest.raises(ConfigurationError)`

### tests/backend/test_equipment.py

- `test_equipment_lifecycle_and_optional_specs`（47 行）。断言摘录。`initial['id'] != chosen['id']`；`api.get_equipment(chosen['id']) == chosen`；`api.list_equipment(kind=kind, q='m-100%')['items'][0]['id'] == chosen['id']`；`api.list_equipment(q='Α camera')['items'][0]['id'] == chosen['id']`
- `test_invalid_fields_never_persist`（87 行）。断言摘录。`pytest.raises(StorageError)`；`rejected.value.details['fields'][field]`；`runtime.equipment.list_equipment()['items'] == []`
- `test_pagination_same_model_and_rollback`（94 行）。断言摘录。`[item['id'] for item in result['items']] == ids[:2]`；`result['next'] == ids[1]`；`[item['id'] for item in api.list_equipment(limit=2, after=result['next'])['items']] == ids[2:]`；`pytest.raises(RuntimeError, match='injected')`
- `test_database_constraints_and_incompatible_same_version`（117 行）。断言摘录。`conn.exec_driver_sql('PRAGMA quick_check').scalar() == 'ok'`；`conn.exec_driver_sql('PRAGMA foreign_key_check').all() == []`；`pytest.raises(sqlite3.IntegrityError, match='EQUIPMENT_TYPE_MISMATCH')`；`pytest.raises(sqlite3.IntegrityError, match='FOREIGN KEY')`
- `test_incomplete_configuration_and_reference_validation`（136 行）。断言摘录。`train['status'] == 'draft'`；`pytest.raises(StorageError, match='EQUIPMENT_TYPE_MISMATCH')`；`api.get_train(train['id'])['configuration'] == train['configuration']`；`api.list_revisions(train['id']) == {'items': []}`
- `test_single_configuration_concurrent_save_and_live_specs`（148 行）。断言摘录。`api.list_trains(q='old camera', status='published')['items'][0]['id'] == ident`；`api.get_train(ident)['summary']['camera'] == 'New camera'`；`results.count('DRAFT_VERSION_CONFLICT') == 1`；`current['summary']['accessories'] == ['Barlow', 'Reducer']`
- `test_existing_default_loads_without_rewriting_legacy_history`（210 行）。断言摘录。`existing['draft']['optical_state']['rotation_deg'] == 1`；`existing['draft_version'] is None`；`api.list_trains(q='Old camera', status='published')['items'][0]['id'] == ident`；`api.get_train(ident)['configuration']['draft']['name'] == 'Updated'`
- `test_legacy_train_delete_rolls_back_history_and_trigger`（238 行）。断言摘录。`pytest.raises(RuntimeError, match='injected after revision delete')`；`api.get_train(target['id']) == before`；`[row['id'] for row in api.list_revisions(target['id'])['items']] == revisions[::-1]`；`runtime.db.health()['schema'] == SCHEMA`

### tests/backend/test_siril.py

- `test_direct_fits_path_outside_import_roots`（25 行）。断言摘录。`identity == str(sample) and path == sample`；`inspect_fits(path)[0].channels == 3`；`resolve_input(storage, str(outside)) == (str(outside), outside)`；`pytest.raises(StorageError, match='SOURCE_NOT_FOUND')`
- `test_load_image_node_outputs_path_and_tracks_file_changes`（40 行）。断言摘录。`node.execute(str(sample)).result == (str(sample),)`；`node.fingerprint_inputs(str(sample)) != first`
- `test_fits_inspection_validates_precision_metadata_and_truncation`（76 行）。断言摘录。`(info.width, info.height, info.channels, info.bitpix) == (80, 60, 3, -32)`；`('OBJECT', 'Test target') in info.metadata and png.startswith(b'\x89PNG')`；`sample.read_bytes() == before`；`pytest.raises(StorageError, match='FITS_INVALID')`
- `test_formal_run_requires_an_absolute_path`（87 行）。断言摘录。`pytest.raises(StorageError, match='INVALID_STORAGE_PATH')`
- `test_parameters_reject_untrusted_script_values`（97 行）。断言摘录。`pytest.raises(StorageError, match='INVALID_AUTOSTRETCH_PARAMETERS')`
- `test_mono_normalizes_linked`（102 行）。断言摘录。`not parameters(PARAMS, 1)['linked']`；`parameters(PARAMS, 3)['linked']`
- `test_config_rejects_incompatible_version_and_keeps_previous`（107 行）。断言摘录。`pytest.raises(StorageError)`；`error.value.code == 'SIRIL_VERSION_MISMATCH'`；`storage.siril.status() == old`
- `test_invalid_and_gui_paths_rejected`（120 行）。断言摘录。`storage.siril.status()['state'] == 'SIRIL_NOT_CONFIGURED'`；`pytest.raises(StorageError, match=code)`
- `test_runner_timeout_and_mid_process_cancellation`（129 行）。断言摘录。`pytest.raises(StorageError, match='SIRIL_RUN_TIMEOUT')`；`pytest.raises(KeyboardInterrupt)`；`software.run_cli(Path(sys.executable), ['-c', "print('reaped')"], tmp_path, lambda: None, timeout=8).strip() == 'reaped'`
- `test_restart_reconciles_only_owned_unregistered_run`（144 行）。断言摘录。`read_json(folder / 'manifest.json')['state'] == 'interrupted'`；`not (folder / 'stretched.fit').exists()`；`(outputs / 'user-file.fit').read_bytes() == b'user file'`
- `test_real_cli_immutable_source_and_formal_output`（161 行）。断言摘录。`any((item['version'] == '1.4.5' for item in candidates if item['state'] == 'ready'))`；`storage.siril.status()['state'] == 'SIRIL_NOT_CONFIGURED'`；`storage.siril.save(cli)['version'] == '1.4.5'`；`source_id == asset_id and path == storage.assets.resolve_asset(result_id)`
- `test_real_cli_direct_path_and_chained_output`（198 行）。断言摘录。`first_source == str(sample) and second_source == first_id`；`storage.assets.resolve_asset(first_id) == first_path`；`storage.assets.resolve_asset(second_id) == second_path`；`first_path.is_file() and second_path.is_file() and (first_path != second_path)`

### tests/backend/test_status.py

- `test_capabilities_follow_registration_not_plans`（6 行）。断言摘录。`first['status'] == 'degraded'`；`not first['capabilities']['drawing_node']['available']`；`result['status'] == 'ok'`；`result['extension'] == {'id': 'ComfyUI_AstroPhoto', 'version': '0.0.1'}`

### tests/backend/test_storage.py

- `test_first_start_and_reentry`（52 行）。断言摘录。`initial['default_workspace_id'] == default_id(other)`；`service.workspaces.instance_id == other.workspaces.instance_id`；`initial['imports'] == {'default_mode': 'reference', 'revision': 0}`；`initial['cache']['max_size_gb'] == 20`
- `test_bootstrap_interrupted_after_database_commit`（64 行）。断言摘录。`pytest.raises(RuntimeError, match='injected')`；`after.workspaces.instance_id == before['instance_id']`；`default_id(after) == before['initial_workspace_id']`
- `test_never_replaces_an_existing_asset_database`（85 行）。断言摘录。`pytest.raises(StorageError)`；`error.value.code == code`；`(file.read_bytes() if file.exists() else None) == before`
- `test_multi_process_bootstrap`（103 行）。断言摘录。`a.returncode == b.returncode == 0`；`a_result and a_result == b_result`
- `test_foreign_keys_busy_rollback_and_backup`（116 行）。断言摘录。`pytest.raises(IntegrityError)`；`not list(session.scalars(select(AssetLocation)))`；`pytest.raises(OperationalError, match='locked')`；`copied.execute('PRAGMA integrity_check').fetchone() == ('ok',)`
- `test_multiple_workspaces_default_disable_and_offline_relocation`（135 行）。断言摘录。`a['id'] != b['id']`；`pytest.raises(StorageError, match='STORAGE_PATH_CONFLICT')`；`service.workspaces.check_status(service.workspaces.get(b['id']))['status'] == 'disabled'`；`service.workspaces.check_status(service.workspaces.get(a['id']))['status'] == 'offline'`
- `test_cache_owner_entries_only_with_live_lease`（161 行）。断言摘录。`service.cache.configure(root, 7, 0)['max_size_gb'] == 7`；`first.read_bytes() == b'old'`；`result == {'removed': 1, 'removed_bytes': 6, 'skipped': 1, 'failed': 0}`；`unknown.exists() and kept.exists() and (not removed.exists()) and managed.exists()`
- `test_reference_multiple_roots_mode_snapshot_and_relocation`（176 行）。断言摘录。`result['effective_import_mode'] == 'reference'`；`result['receipt']['registered'] == 2`；`not list((service.root / 'workspace/objects').iterdir())`；`a.read_bytes() == b.read_bytes() == b'FITS bytes\x00\xff'`
- `test_copy_override_idempotency_and_real_bytes`（202 行）。断言摘录。`result['phase'] == 'completed'`；`result['receipt']['copied'] == 1`；`result['receipt']['verification'] == 'size_and_stat'`；`managed.read_bytes() == source.read_bytes()`
- `test_copy_preflight_blocks_offline_read_only_full_and_unauthorized`（219 行）。断言摘录。`pytest.raises(StorageError, match='WORKSPACE_OFFLINE')`；`pytest.raises(StorageError, match='WORKSPACE_READ_ONLY')`；`pytest.raises(StorageError, match='INSUFFICIENT_DISK_SPACE')`；`receipt(service, operation)['error']['code'] == 'INSUFFICIENT_DISK_SPACE'`
- `test_copy_detects_inflight_source_change`（241 行）。断言摘录。`receipt(service, operation)['receipt']['errors'][0]['code'] == 'SOURCE_CHANGED'`；`not service.assets.list()['assets']`；`not list((service.root / 'workspace/.staging').iterdir())`
- `test_copy_recovers_after_publish_before_db_commit`（259 行）。断言摘录。`result['phase'] == 'publishing'`；`result['error']['code'] == 'INTERNAL_STORAGE_ERROR'`；`not service.assets.list()['assets']`；`receipt(recovered, operation)['receipt']['copied'] == 1`
- `test_cancel_partial_staging`（283 行）。断言摘录。`receipt(service, operation)['phase'] == 'cancelled'`；`not service.assets.list()['assets']`；`source.exists() and (not list((service.root / 'workspace/.staging').iterdir()))`
- `test_migration_recovers_around_database_switch`（301 行）。断言摘录。`initial['receipt']['copied'] == 1`；`receipt(service, outside)['receipt']['registered'] == 1`；`status['phase'] == ('publishing' if checkpoint == 'before' else 'committed')`；`Path(service.workspaces.get(workspace).root_path) == expected`
- `test_migration_actual_cross_volume`（342 行）。断言摘录。`target.parent.stat().st_dev != service.root.stat().st_dev`；`result['phase'] == 'completed'`；`result['receipt']['verification'] == 'sha256'`；`(target / 'outputs/result.fits').read_bytes() == old.read_bytes()`
- `test_reference_shared_sessions_leave_the_file_and_other_reference`（358 行）。断言摘录。`receipt(service, first)['phase'] == receipt(service, second)['phase'] == 'completed'`；`asset['session_ids'] == ['first', 'second']`；`service.assets.list()['assets'][0]['session_ids'] == ['second']`；`service.assets.resolve_asset(asset['id']).read_bytes() == path.read_bytes()`
- `test_process_exit_during_copy_resumes_own_staging`（370 行）。断言摘录。`process.returncode == 77`；`pending['phase'] == 'importing'`；`service.assets.list()['assets'] == []`；`receipt(recovered, pending['operation_id'])['receipt']['copied'] == 1`
- `test_migration_verification_error_keeps_source`（400 行）。断言摘录。`result['phase'] == 'failed' and result['error']['code'] == 'COPY_VERIFY_FAILED'`；`service.workspaces.get(default_id(service)).root_path == str(service.root / 'workspace')`；`source.read_bytes() == b'FITS bytes\x00\xff'`；`not (target / WORKSPACE_MARKER).exists()`
- `test_reject_links_unc_and_relative_paths`（419 行）。断言摘录。`pytest.raises(StorageError)`；`not list(real.iterdir())`
- `test_reference_on_distinct_windows_volumes`（442 行）。断言摘录。`first.stat().st_dev != second.stat().st_dev`；`result['receipt']['registered'] == 2`；`{service.assets.resolve_asset(asset['id']) for asset in service.assets.list()['assets']} == {first, second}`；`first.read_bytes() == b'from first volume' and second.read_bytes() == b'from second volume'`
- `test_explicit_wal_failure_has_no_fake_ready`（463 行）。断言摘录。`pytest.raises(StorageError, match='WAL_UNAVAILABLE')`；`connection.execute('PRAGMA journal_mode').fetchone() == ('delete',)`；`not connection.execute("SELECT name FROM sqlite_schema WHERE type='table'").fetchall()`
- `test_legacy_dev_schema_is_preserved`（482 行）。断言摘录。`pytest.raises(StorageError)`；`rejected.value.code == 'DEV_SCHEMA_RESET_REQUIRED'`；`file.read_bytes() == original`

### tests/integration/test_equipment_api.py

- `test_equipment_and_train_api_permissions_receipts_and_errors`（74 行）。断言摘录。`register_routes(routes, runtime) is runtime`；`(await client.get(equipment, headers=agent)).status == 403`；`denied.status == 403`；`(await denied.json())['error']['code'] == 'UNAUTHORIZED_EQUIPMENT_OPERATION'`
- `equipment_client` 在 aiohttp 客户端关闭前清理独立测试根中的记录。分页检查归档项，依赖顺序为设备组合再设备。每条检查 DELETE 204、请求回执和 GET 404，最后检查两个集合。
- `test_official_catalog_create_read_and_delete`（151 行）从 PRD 读取真实设备与组合目录，经 HTTP 创建和读回。故障用例（189 行）创建组合、归档被引用的设备，再抛出错误，用新客户端确认两个列表为空。
- `test_equipment_route_conflict_has_no_partial_registration`（216 行）。断言摘录。`pytest.raises(RuntimeError, match='/equipment')`；`len(routes) == 1`

### tests/integration/test_host_runtime.py

- `test_running_comfyui_status_and_node`（11 行）。断言摘录。`status['status'] == 'ok'`；`status['capabilities']['drawing_node']['available']`；`node['input']['required']['custom_vue_component_basic'][0] == 'CUSTOM_VUE_COMPONENT_BASIC'`；`node['output'] == ['IMAGE']`

### tests/integration/test_siril_api.py

- `test_scientific_api_access_source_and_cache`（22 行）。断言摘录。`(await client.get(siril, headers=LOCAL)).status == 403`；`(await client.put(siril, json={'path': 'bad'}, headers={**LOCAL, 'Origin': 'https://elsewhere.invalid'})).status == 403`；`(await status.json())['state'] == 'SIRIL_NOT_CONFIGURED'`；`(await invalid.json())['error']['code'] == 'SIRIL_EXECUTABLE_INVALID'`

### tests/integration/test_status_api.py

- `test_v3_load_registers_one_live_status_route`（14 行）。断言摘录。`len([r for r in extension.routes if r.path == STATUS_PATH]) == 1`；`response.status == 200`；`(await response.json())['status'] == 'degraded'`；`(await response.json())['status'] == 'ok'`
- `test_route_ownership_and_per_server_isolation`（36 行）。断言摘录。`register_routes(first, runtime) is runtime`；`register_routes(first, updated) is runtime`；`not runtime.node_registered()`；`len(first) == len(second) > 1`

### tests/integration/test_storage_api.py

- `test_http_storage_import_and_access_boundary`（14 行）。断言摘录。`(await response.json())['status'] == 'unavailable'`；`denied.status == 403 and (await denied.json())['error']['code'] == 'UNAUTHORIZED_STORAGE_OPERATION'`；`(await forbidden.json())['status'] == 'unavailable'`；`(await proxied.json())['status'] == 'unavailable'`
- `test_invalid_storage_config_preserves_status_route`（92 行）。断言摘录。`response.status == 200 and status['status'] == 'degraded'`；`not status['capabilities']['storage']['available']`；`status['capabilities']['drawing_node']['available']`；`list((tmp_path / 'unsafe').iterdir()) == [tmp_path / 'unsafe/keep']`

### tests/nodes/test_image_io.py

- `test_load_image_delegation_and_output`（4 行）。断言摘录。`result.result == (extension.host.image,)`；`result.result[0] is extension.host.image`；`extension.host.calls == [('resolve', 'threed/drawing.png [temp]'), ('load', extension.host.path)]`
- `test_invalid_widget_data_rejected_before_host_io`（16 行）。断言摘录。`pytest.raises(ValueError, match='uploaded image path')`；`extension.host.calls == []`

### tests/nodes/test_registration.py

- `test_v3_registration_and_definition`（4 行）。断言摘录。`not hasattr(module, 'NODE_CLASS_MAPPINGS')`；`[node.define_schema().node_id for node in classes] == ['vue-basic', 'AstroPhotoFITSSource', 'AstroPhotoSirilAutoStretch', 'AstroPhotoImagePath']`；`source.outputs[0].io_type == stretch.inputs[0].io_type == stretch.outputs[0].io_type == 'IMAGE_PATH'`；`stretch.inputs[0].id == 'image_path'`
