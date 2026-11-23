# AstroPhoto 本地存储交付与验收

## 当前使用方式

安装扩展后启动 ComfyUI，扩展在 V3 `on_load` 首建 `config/`、`database/`、`storage/`、`runtime/`，以及 `config/manifest.json` 和 `config/settings.json`。已初始化的数据根在有效配置下重启时，扩展会在打开宿主锁和业务存储前补齐缺失的 `database/`、`storage/`、`runtime/`。这一步只补齐顶层目录。配置缺失、无效或路径冲突会记录在启动日志中。宿主启动初始化无需 MCP。在线存储检查仍由扩展的 HTTP 接口提供。

可信本机单用户 ComfyUI 可直接使用存储设置及素材路径导入。设置页允许新增、重命名和移除存储位置，调整位置顺序和每个位置的容量上限。位置顺序和限额保存在带版本的设置中，旧配置按默认位置优先并保留其他位置的登记顺序。默认整批导入按顺序选择在线且容量足够的位置。Siril 正式处理按顺序选择位置，受理后的操作保持目标不变。受管素材、正式输出和在途预留参与位置限额，实际磁盘空间及已有卷额度仍分别检查。

### 浏览器复制导入

在「素材 → 全部素材」选择单张或批量导入。预检提交文件名、大小、分类与项目。确认后，浏览器将各文件流式上传到目标卷，服务端校验后在同一卷上发布，并登记独立的素材 ID。批量导入可选择参与并行写入的位置，预检按字节、位置限额和共享卷余量分配，每个文件完整保存在一个位置。同一物理盘上的位置共用写入队列；无法确认物理拓扑时采用串行。

| 导入分类 | 新文件在工作区中的相对位置 |
| --- | --- |
| 子帧 | `objects/subframes/<组 ID>/<文件名>`，同名冲突时生成独立文件名。 |
| 主帧、视频 | 分别位于 `objects/masters/` 和 `objects/videos/`，文件名包含素材 ID。 |
| 未指定 | `objects/<素材 ID>/<原文件名>`。 |

目标路径超过 Windows 长度限制时，支持缩短的受管文件名使用素材 UUID 和原扩展名。素材库仍显示完整原名。预检会检查最终路径以及同卷临时写入路径。

直传任务在没有文件传输时显示为「已暂停」，可重新选择原文件继续。已暂停任务中仅尚待恢复的写入会保护相关位置。目标位置已被移除时，该帧需要重新预检；已登记的帧仍可在素材库查看。宿主启动时核对上次中断的暂存、发布与取消记录，按可验证的文件身份恢复；任务框保留近期的逐帧错误。

组成员、原始顺序和每帧的实际位置保存在数据库中。项目可以引用单帧，位置迁移后组身份继续有效。新增分组布局适用于新导入，已有受管素材按数据库原相对路径读取。

删除存储位置时，从其余已登记的可写位置中选择目标并确认。系统迁移源位置的受管素材与正式输出，更新文件位置后移除源登记。素材 ID 和项目关联保持有效，Reference 原件和未登记文件保留在原地。最后一个位置受保护。遇到目标容量不足、文件冲突或活动任务时，按提示处理后可重试。

AstroPhoto 侧栏底部显示导入与迁移任务，可展开或收起，完成的记录可从本次浏览器会话的列表中移除。任务状态由受信本机的 `GET /astrophoto/v1/storage/operations` 查询，包含所有进行中的任务和最近 16 个结束任务；显示的数量来自服务端实际回执。复制直传中断后可从任务框打开导入页，重新选择待传原文件。完成和失败反馈使用 ComfyUI 通知，失败详情保留在任务框。迁移按受管对象组计数，单个大文件的复制不提供字节级百分比。

新增存储位置时，可输入绝对路径或使用文件夹选择弹窗。弹窗通过受信本机的 `GET /astrophoto/v1/storage/directories` 浏览 ComfyUI 宿主本地目录，支持磁盘入口及面包屑，选择后将路径填入表单；登记时仍执行工作区路径和身份校验。弹窗显示的是运行 ComfyUI 的计算机上的目录。

素材以引用方式导入时，可手动输入路径，或通过文件浏览弹窗选择本机文件；批量导入也可选择文件夹。浏览接口使用 `files=1` 返回当前目录中的普通文件，预检仍独立校验源路径并扫描所选目录。浏览并不等于授权导入，登记后的引用指向原始文件绝对路径。

Windows 本机可使用系统窗口选择文件或文件夹；后端通过受信本机的 `POST /astrophoto/v1/storage/native-picker` 调用 Windows 窗口，最多同时打开一个，取消不产生选择，等待时间最多三分钟。系统窗口不可用时回退网页浏览；最终路径仍由对应导入或存储操作校验。此方式需要 ComfyUI 运行在有交互桌面的 Windows 会话中，其他平台使用网页浏览。

可分别添加不同本地磁盘上的存储位置。选择空文件夹时直接在其中初始化存储位置，选择非空文件夹时在其中使用空的 `AstroPhoto` 子文件夹，登记路径为该子文件夹。若子文件夹已有内容或与已有存储位置冲突，登记会返回错误并保留现有文件。

下文保留已有维护接口和命令。工作区迁移在提交有效位置后清理已验证的受管源副本。处理链使用的会话 Cache 由宿主生命周期管理。

### 数据根内协调

扩展在 ComfyUI V3 `on_load` 时使用初始配置根的 `config/roots.json` 记录有效根和入口路径。`config/root-catalog.lock` 和 `config/<实例 ID>.lock` 保护记录和实例，有效根另持有 `runtime/locks/host.lock`。初始配置根默认是 `~/.astrophoto/`，也可以用 `ASTROPHOTO_HOME` 指定。整库搬家后，目标根的 `config/root-link.json` 仍指向初始配置根。在任一入口启动都需要初始配置根可访问。缺少根内登记的旧实例会报错并保留原文件。MCP 通过宿主公开 HTTP 获取有效路径。 [根目录协调实现](../astrophoto/storage/data_root.py)

### 就绪检查与位置记录

| 首建目录 | 内容 |
| --- | --- |
| `config/` | `manifest.json` 保存实例与初始工作区身份，`settings.json` 保存当前默认工作区 ID 和设置。 |
| `database/` | `assets.db` 保存业务记录、工作区登记及文件位置。 |
| `storage/` | 初始工作区位于 `storage/<工作区 UUID>/`，包含身份标记 `.astrophoto-workspace.json` 和 `objects/`、`outputs/`、`.staging/`。新增、外置或迁移后的工作区以数据库登记的路径为准。 |
| `runtime/` | 首建 `locks/` 供宿主和存储操作协调。默认持久缓存路径为 `runtime/cache/`，由缓存服务按需建立。宿主提供的会话 Cache 仍使用其 temp 目录。 |

`init` 核对活动实例的配置、绑定的数据库、有效锁目录和所有启用工作区，包括当前默认工作区。按数据库登记路径核对目录标记和已登记文件，已有位置记录或本会话读到的身份与当前目录冲突时返回错误。缺少单独的位置记录时仍可凭有效的登记和标记核对。`init` 仅在归属明确、无缺失登记文件并且相关工作区没有在途操作依赖时补齐空的必需子目录，再复核实际布局。外置盘离线时保留登记，恢复原卷后可重试。 [位置检查](../astrophoto/storage/locations.py) · [在线核对](../astrophoto/storage/runtime.py)

搬迁服务首次写入计划时创建 `runtime/migrations/`，未使用搬迁的实例可直接通过就绪检查。

需要通过维护命令搬迁既有数据根时，可调用 `POST /astrophoto/v1/storage/data-root/preflight` 预检。停止 ComfyUI 后，在项目目录的 PowerShell 中执行以下命令。

```powershell
uv run python -m astrophoto.storage.data_root move 'C:\AstroPhoto' 'D:\AstroPhoto'
```

搬家完成后，沿用原启动命令即可打开新根。工具保留旧 Data Root 快照、根外工作区与 reference 原件。初始配置根内的登记原子提交后才切换有效根。提交前中断时，原启动命令仍打开旧根，已复制的目标目录保留。若切换已完成且新根还未进入可写初始化，可用 `python -m astrophoto.storage.data_root rollback <新根路径>` 恢复，命令需要读取新根内的定位记录。新根开始写入后，从当前有效库重新搬回或按备份恢复。预检会提示阻断的文件、工作区或任务，停机执行时会再次检查。 [该 Feature 的历史记录](../.agents/archive/local-storage-workspaces/00_FEATURE_INDEX.md)

## 历史交付基线

以下各节记录当时的接口、迁移策略和验收结果，HTTP 表的 `/storage/init` 行记录当前契约。现行数据根、受管源副本清理与 Cache 行为见上文，数据库演进见[系统架构](architecture.md)。

分支 `main`，HEAD `5e39fcf352995918c3ba3d06b88cd61a2cbeca1a`。开工时已有对 `.agents/skills/astrophoto-reuse-reference/SKILL.md` 的修改，以及未跟踪的 `.artifact/` 和 `reference/`。执行期间还观察到未跟踪的 `.agent/handoff_history/`。这些资料未由本任务改动。交付以工作树改动和本地构建产物提供。

本机宿主源码为 Backend 0.45.0，Git `v0.45.0-33-g9fa6bc598`。Conda `comfyenv` 实装 Python 3.12.16、Frontend 1.59.1、Torch 2.14.1+cu130、aiohttp 3.14.5。开发环境使用 uv 0.13.8、Python 3.12.15／3.11.18 与 pnpm 11.13.1。Extension 和 MCP 版本均为 0.0.1。

| 基线 | 本地事实与采用的调整 |
| --- | --- |
| Storage v1.1 | 保持其产品决策与 API 语义。读取时文档在 `.artifact/Local_Storage/`，历史资料另有仓库交接版 |
| 技术指南 v1.0 的 React/Vue 分入口 | 工作树已有 `frontend/ui`，使用宿主 Sidebar adapter 和聚合 Vite build。继续使用一个 `main.js` 与共用样式，禁止 vendor JS，取消构建前清空输出 |
| 技术指南的路径和模型草案 | Durable import 和 migration 共用 `storage_operations`。ORM 位于 `database/models.py`，查询和事务保留在对应服务中，根路径实时从数据库解析 |
| 历史宿主启动阻塞 | 旧失败来自 base 环境。实测使用现有 `comfyenv` 和完全隔离的 host base、user、input、output、temp、Data Root |
| 导入路径交付 | 在本机直连 Sidebar 输入服务端绝对路径，按部署授权根约束；预检后显式提交 |

## Implementation Matrix

| path | function | function_described | status | validation |
| --- | --- | --- | --- | --- |
| `__init__.py` | `AstroPhotoExtension.on_load` | V3 生命周期组装并注册 PromptServer 路由 | modified | 宿主 HTTP、V3 回归 |
| `astrophoto/bootstrap.py` | `bootstrap`、`host_runtime`、`initialize_storage_runtime` | 无副作用装配与显式初始化；失败保留状态和节点 | modified | 首启、非空根、真实宿主 |
| `astrophoto/core/paths.py` | `data_home` | 绝对覆盖路径及唯一默认数据根 | reused/modified | Core 配置、路径测试 |
| `astrophoto/core/config.py` | `load_storage_settings`、`write_storage_settings`、`write_json_atomically` | 严格配置读取、revision 与原子保存 | implemented | HTTP 422/409、重启回读 |
| `astrophoto/core/capabilities.py` | `capabilities`、`storage_capabilities` | 保留能力结构，检查数据库连接及初始化错误 | modified | SQLite、状态 HTTP |
| `astrophoto/storage/initializer.py` | `ensure_data_root`、`load_or_create_manifest`、`load_or_create_settings`、`acquire_bootstrap_lock` | 全局锁、基础目录、身份文件、部分初始化重入 | implemented | 两进程、断点、缺文件 |
| `astrophoto/database/manager.py` | `DatabaseManager.initialize/session/health/backup` | 独立 SQLAlchemy Engine、实际 WAL/FK、有界 busy timeout、备份升级 | implemented | FK、rollback、busy、SQLite backup、宿主升级 |
| `astrophoto/database/migrations/` | `run_migrations_online`、两条 `upgrade` | 独立 Alembic 版本链；用既有 session_id 回填业务关系 | implemented | 全新库、旧版本宿主库、新版本拒绝 |
| `astrophoto/database/models.py` | `StorageIdentity`、`StorageLocation`、`StorageOperation`、`Asset`、`AssetLocation`、`AssetSession` | 单一权威库、引用约束、稳定 ID 和持久回执 | implemented | SQLite 模型与事务、HTTP |
| `astrophoto/storage/paths.py` | `canonicalize_root`、`validate_no_overlap`、`safe_join_workspace` | 本地路径、重叠、目录越界和链接防护 | implemented | UNC、非法 key、链接、跨卷 |
| `astrophoto/storage/locations.py` | `ensure_default/register/get/list/check_status/validate/update/relocate/remove`、`rebind_workspace` | 注册、实时诊断、默认、禁用、重新定位、解绑及切换 | implemented | 多 Workspace、离线模拟、HTTP、宿主迁移 |
| `astrophoto/storage/manager.py` | `resolve_managed/stage_copy/verify_staged/publish_object` | relative_key 解析、流式复制、重检、无覆盖发布 | implemented | 源变化、ENOSPC、真实字节、提交故障 |
| `astrophoto/storage/migration.py` | `validate/start/run/_inventory/_copy_and_commit/_complete` | 冻结清单、迁移租约、校验、原子切换、重入 | implemented | SHA256 错误、切换前后注入、C:→D: |
| `astrophoto/storage/operations.py` | `find/create/advance/status/submit/run/recover/cancel/retry` | 统一持久操作、去重、取消、并发与恢复 | implemented | HTTP 202、进程退出与重试 |
| `astrophoto/storage/cache.py` | `initialize/status/configure/store/clear_owned_cache` | 独立 Cache、身份、租约和逐项清理回执 | implemented | 路径切换、实际字节、活跃／陌生文件保留 |
| `astrophoto/storage/runtime.py` | `initialize/update_settings/snapshot` | 服务组装、健康快照、配置同步 | implemented | 重启配置、HTTP |
| `astrophoto/assets/imports.py` | `validate_selected_source_path/import_assets/preview/import_reference/import_copy/run` | 授权根、轻量枚举、模式快照、分阶段导入 | implemented | 真文件、两目录、失败注入、实际宿主 |
| `astrophoto/assets/service.py` | `resolve_asset/relocate/list/set_session` | 离线诊断、原址重新定位、分页、共享会话关系 | implemented | 重新定位、去重、共享引用 |
| `astrophoto/api/storage.py` | `storage_routes/snapshot/settings/add_location/start_migration/handler` | 严格 DTO、原生路由与异步操作入口 | implemented | aiohttp TestServer、实际宿主 |
| `astrophoto/api/assets.py` | `asset_routes/list_assets/preview/import_assets/operation_handler` | 素材登记、预检、状态、重新定位和分组关联 | implemented | HTTP 合约和实际浏览器链路 |
| `astrophoto/api/security.py`、`errors.py` | `trusted_deployment/authorize_storage_operation/storage_error_response` | 本机直连边界、Origin 与代理头校验、结构化错误 | implemented | 不可信部署、请求来源、权限错误 |
| `astrophoto/api/routes.py`、`status.py` | `register_routes/status_payload` | 保留兼容状态路由，幂等注册并接线存储 | modified | 重入、异主冲突、状态、宿主 |
| `frontend/ui/src/main.tsx`、`host/{sidebar,comfy,locale}` | `registerExtension/registerSidebar/watchLocale` | 宿主接入、单 Sidebar、取消清理和语言 | reused/modified | RTL 生命周期、实际浏览器 |
| `frontend/ui/src/api/{client,storage}.ts` | `requestJson/fetchStorage/mutate/startOperation/fetchReceipt/previewImport/fetchAssets` | 宿主 fetchApi、取消、结构校验与持久回执 | implemented/modified | RTL、实际 aiohttp、宿主 |
| `frontend/ui/src/features/settings/StoragePage.tsx` | `StoragePage/ImportModeField/WorkspaceActions/CacheSettings` | Data Root、模式、工作区列表与动作、Cache | implemented | RTL 设置失败和成功、宿主 |
| `frontend/ui/src/features/assets/` | `AssetsPage/AssetLibrary/ImportDialog` | 搜索排序、分组、预检、覆盖模式、查询真实回执 | implemented | RTL、宿主 Chromium |
| `frontend/ui/src/features/storage/shared.tsx` | `useStorageAction/OperationProgress/StorageError` | AbortController、查询、错误与回执进度 | implemented | RTL、宿主 |
| `frontend/ui/src/shared/useResource.ts` | `useResource` | 加载／错误／数据与保持状态期间刷新 | modified | RTL 导航、错误、卸载 |
| `frontend/ui/src/i18n/locales/{zh,en}/main.json` | `storage.*` | 中英字段、状态、动作及错误 | modified | key 对等、真实宿主切换 |
| `frontend/vite.config.mts`、`ui/tsconfig.json` | Vite 聚合与 React 独立类型检查 | 同一 pnpm 锁，单 JS，双 UI 样式，代理前缀 | modified/reused | check:build、Chromium 代理资源 |
| `tests/backend/test_storage.py` | 存储数据库集成测试 | 初始化、证明真实文件和事务、故障恢复与跨卷 | implemented | Python 3.11/3.12 |
| `tests/integration/test_storage_api.py`、`test_host_runtime.py` | HTTP 与宿主状态/Node 测试 | aiohttp TestServer 和真实运行宿主分层 | implemented/reused | HTTP、真实宿主 |
| `frontend/ui/src/__tests__/storage.test.tsx`、`frontend/ui/storage-host.mjs` | 设置、迁移、宿主浏览器验收 | RTL 与 Chromium 全链路 | implemented | 前端测试与真实宿主 |
| `scripts/release.py`、`tests/packaging/test_contents.py`、`.comfyignore` | `build_registry/check_registry`、产物检查 | 发布迁移代码和 UI，排除用户数据 | modified | Registry、MCP Wheel/sdist |
| `docs/{architecture,development,requirements,publishing,local-storage}.md` | 工程文档 | 实际实现、部署、证据与边界 | modified/implemented | 对照工作树和结果 |

## Data and HTTP contracts

- 默认数据根为 `~/.astrophoto/`。配置位于 `config/manifest.json`、`config/settings.json`，锁位于 `runtime/locks/`，有一致性备份时位于 `backups/`。
- 默认工作区为 `workspace/`，包含 `.astrophoto-workspace.json`、`objects/`、`outputs/`、`.staging/`。切换默认仅写配置。外置工作区依靠 instance ID 与 Workspace ID，只有迁移和重新定位可变更根路径。
- 唯一活动 Cache 默认在 `cache/`。20 GB 为建议限额。目录可改，旧缓存留存。只清理当前根中由 CacheManager 写入、有归属描述且无活跃租约的条目。
- `settings.json` Schema 1 持有 `revision`、`workspace.default_workspace_id`、`workspace.write_policy=default`、`imports.default_mode=reference|copy`、`cache.path/max_size_gb`。模式快照和文件操作进度保存于 SQLite。
- `databases/assets.db` 的 当前 Alembic 统一基线为 `0001_equipment_baseline`。原有 Storage/Assets 表包括 `storage_identity`、`storage_locations`、`assets`、`asset_locations`、`asset_sessions`、`storage_operations` 与 `alembic_version`。受管位置采用 Workspace ID 与相对 key，外部引用采用绝对路径。两种位置由 CHECK 与外键区分。旧开发版本会收到 `DEV_SCHEMA_RESET_REQUIRED`，启动保留库文件。当前设备域表见 [设备与光路](equipment.md)。
- API 前缀均为 `/astrophoto/v1`。ComfyUI 还按宿主规则挂载 `/api` 前缀。错误返回 `error.code`、`error.message`、`request_id`。

| 方法 / 相对路径 | 请求 | 结果 |
| --- | --- | --- |
| GET `/status` | — | 保持 v1 节点、路由、Extension、data_home、capabilities；增加真实 storage、database、assets 能力 |
| GET `/storage` | — | Data Root、数据库、revision、工作区容量和状态、Cache、近期操作、能力。未授权时返回 unavailable 和原因 |
| POST `/storage/init` | JSON `{}`，受信本机直连发送 `X-AstroPhoto-Local: 1` | 受信本机授权。HTTP 200 返回 `{status, data_root, checks, created, request_id}`。`status` 及 `config`、`database`、`storage`、`runtime` 四项检查均为 `ready`。`data_root` 为宿主有效根的绝对路径，`created` 为本次补齐的工作区子目录逻辑名，已齐全时为 `[]`。 |
| PATCH `/storage/settings` | `expected_revision` 与 `imports.default_mode`、`workspace.default_workspace_id` 或 `cache.max_size_gb` | 新 settings 与 revision |
| POST `/storage/locations` | `path, name` | 201 与 Workspace DTO |
| PATCH `/storage/locations/{id}` | `expected_revision`、`name` 或 `enabled`；设默认单独传 `default=true` | Workspace DTO。设默认用 settings revision，名称和启停用 Workspace revision |
| DELETE `/storage/locations/{id}` | `expected_revision`，配置页另传 `target_workspace_id` | 迁移至指定位置后移除登记，最后一个位置受保护。兼容调用可省略目标，仅移除无受管数据的非默认位置 |
| POST `/storage/locations/{id}/validate` | 空对象 | 身份、写探测和容量状态 |
| POST `/storage/locations/{id}/relocate` | `new_path` | 同一标记身份的更新后 Workspace DTO |
| POST `/storage/cache/configure` | `path, max_size_gb, expected_revision` | 更新后的 Cache 状态 |
| POST `/storage/cache/clear` | `scope` 为 all 或指定缓存子域 | `removed, removed_bytes, skipped, failed` |
| POST `/storage/migrations` | `workspace_id, target_path, idempotency_key` | 202、`operation_id` |
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

## Safety and recovery

路径 API 要求管理员设置 `ASTROPHOTO_LOCAL_STORAGE=1`，使用本机 loopback 监听，关闭多用户和 CORS。浏览器走同源直连并带 `X-AstroPhoto-Local: 1`。拒绝外部监听、跨源、转发头及未授权来源。服务端素材路径受 `ASTROPHOTO_IMPORT_ROOTS` 限制，多路径使用平台路径列表分隔符。预检仅枚举本次明确提交的范围。

Scratch 和写入用同卷独占发布。导入默认只检查大小、源的元信息和文件身份，回执为 `size_and_stat`；不会扫描拍摄参数或解码。导入文件与源彼此独立。发布状态先持久化，资产登记与该文件的回执在同一事务提交。进程退出测试确认已知暂存文件可以安全重来。未知文件留给管理员核查。

迁移用 Workspace 租约，源仍保留。目标内容通过 SHA256 与件数清单校验后，根路径和 committed 状态同一事务切换。提交前的验证失败保留旧权威位置。提交后重启通过目标标记、清单和尺寸检查完成重新绑定。失败或取消的迁移目标可能保留已写数据和临时标记，以便检查。恢复仍需原卷或可识别的工作区身份。故障注入采用真实 SQLite 与文件系统；物理断电、恶意本机特权进程并发篡改和卷掉电写缓存未验收。

## 验收状态

| 优先级 / 验收 | 结果 | 证据边界 |
| --- | --- | --- |
| P0 首次加载只初始化必需目录、配置和资产库 | PASS | 独立 SQLite、隔离宿主 |
| P0 重入保持稳定身份；缺失、损坏或不兼容进入诊断 | PASS | 双进程、故障注入、状态 API |
| P0 reference 默认、revision 冲突和设置持久化 | PASS | SQLite/JSON、aiohttp、宿主浏览器 |
| P0 FK、WAL、rollback、busy、迁移和一致备份 | PASS | 独立 SQLite、已知老 Schema 升级 |
| P0 多 Workspace、唯一性、默认切换、启停、空登记移除 | PASS | 临时目录与 HTTP；非默认有引用的移除受约束 |
| P0 危险路径、不重叠、离线、身份冲突 | PASS | UNC、链接及目录移动模拟。物理拔插见下 |
| P0 Cache 独立配置、占用及安全清理 | PASS | 活跃租约、陌生文件、旧 Cache 和受管文件 |
| P0 状态和权限门控 | PASS | TestServer、宿主启动、跨源和代理拒绝 |
| P1 双语、键盘、主题；设置不触发导入 | PASS | RTL、真实 ComfyUI Chromium |
| P1 多目录 reference、路径失联和重新定位 | PASS | 两个独立目录及 C:、D: 同时 reference，未生成副本 |
| P1 copy 目标指定、模式快照、容量和源变化检查 | PASS | 真实文件、aiohttp、宿主复制。ENOSPC 为故障注入 |
| P1 copy 去重策略、取消、崩溃重入、回执 | PASS | 同键不重复；不同键 copy 可创建独立副本；子进程及提交故障 |
| P1 外部记录、会话关系、轻量登记 | PASS | 真实 FK、两个会话共享记录、源保持 |
| P1 整体跨卷、独立 Workspace、旧源保留、不迁移外部原件 | PASS | Windows C:→D: 真卷、同卷故障注入、宿主浏览器同卷 |
| P1 校验失败、提交前后恢复、迁移锁拒绝写入 | PASS | 真实 DB、真实文件、故障注入 |
| P1 盘符变更的标记重新定位 | PASS | 同一身份路径变更模拟，物理外置盘未拔插 |
| P1 真实移动盘拔插及 Windows 盘符重映射 | NOT_RUN | 无可安全拔插的测试盘流程 |
| P1 商用反向代理部署和非 Windows 宿主运行 | NOT_RUN | 已通过 Chromium 下的嵌套前缀资源加载 |
| P1 Vue Widget 与 Node 兼容 | PASS | Vue Chromium 真像素、上传序列化测试；真实宿主验证 JS/CSS 与 Node Schema |
| 既有宿主 PNG→IMAGE 执行 | NOT_RUN | 既有 LoadImage 路径问题保留，本轮未执行该已知失败路径 |
| Packaging | PASS | Registry、MCP Wheel/sdist、独立 MCP 安装/stdio；无发布 |

命令和运行等级见 [开发与验证](development.md)。范围外的科学元数据、复杂缓存淘汰、数据根图形搬迁和 MCP 新工具按原规划处理。

## Verification

| 命令或场景 | 等级 | 结果 |
| --- | --- | --- |
| `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q`，设置隔离宿主 URL 和 D: 测试卷 | 真实 SQLite/文件、aiohttp TestServer、宿主 HTTP、真实跨卷、打包 | 53 通过，0 失败，0 跳过 |
| `uv run --python 3.11 --frozen pytest tests/nodes tests/backend tests/integration tests/packaging -q`，独立临时 venv 和 D: 测试卷 | Python 3.11、真实 SQLite/文件、aiohttp、跨卷、打包 | 52 通过，0 失败，1 跳过（宿主 URL 未设置） |
| `uv run --project mcp pytest mcp/tests -q`；同命令补测 `--python 3.11 --frozen` | MCP 单元／stdio 协议回归 | 各 52 通过 |
| `pnpm -C frontend typecheck`；`pnpm -C frontend lint` | Vue/React 类型及 ESLint | 通过 |
| `pnpm -C frontend test:react` | Jest/RTL | 37 通过，0 失败 |
| `pnpm -C frontend test` | 真实 Chromium，宿主边界替身 | 9 通过，0 失败 |
| `pnpm -C frontend build`；`pnpm -C frontend check:build`；`pnpm -C frontend check:proxy` | Vite 生产构建、产物、真实 Chromium 嵌套路径 HTTP | 通过，单一 JS 与共用 CSS |
| `pnpm -C frontend test:storage-host` | 真实 ComfyUI 与 Chromium | 4 组通过。覆盖设置、预检、导入、迁移、重载、主题、双语、Vue PNG 上传及像素重载 |
| 隔离宿主进程重启前后对照 Storage 与 Assets | 真实 ComfyUI | workspace ID/root、mode、schema 和资产数量一致 |
| 对照真实宿主的迁移后文件和原文件 `Get-FileHash -Algorithm SHA256` | 真实 ComfyUI 产生的物理文件 | 4 份副本与原文件摘要一致 |
| `uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py`；`uv lock --check`；`git diff --check` | 静态检查 | 通过 |
| `uv build mcp --no-sources --out-dir dist/mcp`；`uv run python scripts/release.py registry`；`uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz` | 实际本地构建与内容校验 | Registry 40 文件，MCP Wheel 14，MCP sdist 20 |
| `uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1` | 独立安装与 stdio | 通过 |

宿主验收使用现有解释器，无宿主依赖升级。SQLite 与原始素材在临时目录。外置盘离线用真实目录暂时移开模拟，容量不足用故障注入，真实跨卷测试用不同设备号验证。独立宿主部署与双包校验不代表已执行线上 Registry 或 PyPI 发布。

