# AstroPhoto 本地存储交付与验收

## Reality Check

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
| PATCH `/storage/settings` | `expected_revision` 与 `imports.default_mode`、`workspace.default_workspace_id` 或 `cache.max_size_gb` | 新 settings 与 revision |
| POST `/storage/locations` | `path, name` | 201 与 Workspace DTO |
| PATCH `/storage/locations/{id}` | `expected_revision`、`name` 或 `enabled`；设默认单独传 `default=true` | Workspace DTO。设默认用 settings revision，名称和启停用 Workspace revision |
| DELETE `/storage/locations/{id}` | `expected_revision` | 检查默认、资产引用及活跃操作。仅移除登记 |
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

