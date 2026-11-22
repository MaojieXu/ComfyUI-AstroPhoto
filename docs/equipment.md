# 设备管理与光学链路

适用于 AstroPhoto Extension / MCP 0.0.1。需求基线为 `.artifact/设备板块` 内 UI FRD v1.0 和 Three Tier Engineering Guide v1.0。两份文档的 P0/P1 设备范围为相机、望远镜/摄影镜头、光学配件、滤镜，以及光路配置。当前操作规则以用户确认的单份配置为准。原规格文件为 0 字节。

## 操作入口和数据规则

设备和光路的列表工具栏共用节点页的 `SearchField` 和 `SearchOptions`。交互适配 ComfyUI Frontend v1.59.1 的 `SidebarTopArea`、`SearchInput.vue` 和 `FilterDropdown.vue`。两页分别保留搜索值及单选筛选，并沿用各自的查询参数。

新增和编辑设备的专业单选字段复用 ComfyUI Frontend v1.59.1 的 `SingleSelect.vue`。官方组件负责弹层、勾选标记和键盘操作。Vue 表单同步字段值和保存状态，空选项保存为 `null`。源码和依赖来源见 [ComfyUI 组件说明](../frontend/src/vendor/comfyui/README.md)。

- **设置 → 设备管理 → 我的设备**提供搜索、筛选、类型选择、新增/编辑和详情。厂家、型号和备注可空，专业字段允许未知。相机支持三态制冷、读出模式及增益/偏置能力，滤镜支持多通带。
- **设置 → 设备管理 → 光学链路**提供列表、编辑器及当前配置详情。每条光路直接保存一份配置，可先保存缺少设备的配置。配置含相机与主光学设备时显示为已配置。配件按用户确认的顺序保存，滤镜表示可用集合。
- 设备和光路都原位更新。光路详情和搜索使用当前设备资料。已有光路优先读取其保存的配置；若只有旧记录，则沿用原默认配置，缺少默认时沿用最近一份。保留既有历史记录供兼容读取。支持设备及光路归档与恢复，已有引用保护继续生效。
- 旋转角度、变更备注和平场适用性是用户记录。有效焦距和焦比是标称估算，在缺失所需标称参数时显示未知。
- 未保存编辑在侧栏注册实例中暂存，在宿主关闭并重新挂载侧栏时恢复；切换模块/主视图时确认是否丢弃，浏览器硬刷新依赖浏览器的离开提示。已保存配置可跨重启。语言和配色由宿主设置控制。
- 设备与 Storage 共用数据库。设备或光路写入不会修改文件、工作区或导入设置。素材库可引用相机和光路并显式分配校准 Master。Capture Profile 和自动校准推荐属于规划。

设备及光路详情使用摘要卡片和可折叠分组。

## SQLite 基线

设备与摄影素材库共用数据根下的 `databases/assets.db`。Alembic 从 `0001_equipment_baseline` 升级到 `0002_photography_library`。启动时核验实例身份、已知结构、外键和完整性，SQLite 使用 WAL 和每连接 3 秒的忙等待。符合既有基线的库可升级，未知或不匹配的开发结构保留原库并报告 `DEV_SCHEMA_RESET_REQUIRED`。开发验收使用独立测试数据根。

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

## HTTP 与权限

前缀为 `/astrophoto/v1`。

| 路径 | Method | 返回 |
| --- | --- | --- |
| `/equipment` | GET / POST | `{items,next,total}` / 201 Equipment DTO |
| `/equipment/{id}` | GET / PATCH / DELETE | 详情 / 新 row_version 与 DTO / 204 |
| `/equipment/{id}/archive`, `/restore` | POST | 归档或恢复后的 DTO |
| `/optical-trains` | GET / POST | `{items,next,total}` / 201 光路详情，可附初始配置 |
| `/optical-trains/{id}` | GET | DTO、当前配置及相关设备；保留旧摘要字段用于兼容 |
| `/optical-trains/{id}/draft` | GET / PUT | 现有保存行 / 原位保存回执及并发字段 draft_version |
| `/optical-trains/{id}/revisions` | GET / POST | 旧历史摘要 / 410 TRAIN_HISTORY_READ_ONLY |
| `/optical-trains/{id}/revisions/{revision_id}` | GET | 历史快照 |
| `/optical-trains/{id}/default-revision` | PUT | 410 TRAIN_HISTORY_READ_ONLY |
| `/optical-trains/{id}/archive`, `/restore` | POST | 更新后的光路详情 |

状态查询兼容旧参数 `published`，界面显示「已配置」。列表使用 UUID 游标 `after`、`limit` 1–100，以及搜索/类型/状态/归档筛选。写操作校验 JSON 结构及 64 KiB 上限。非 204 成功回执带 `request_id`；错误形如 `{error:{code,message,details?:{fields}},request_id}`。409 表示版本冲突、引用保护或历史不可变，422 表示业务输入失败，503 表示依赖不可用。204 带 `X-Request-ID`。

设备域使用单用户、未启用 CORS、直接监听回环地址的宿主。浏览器请求验证 loopback peer 与 Host、同源 Fetch Metadata、Origin 以及无代理标记。边界信任同一台机器上的进程。`X-AstroPhoto-Local` 是浏览器客户端的请求标记。状态分别报告 `equipment`、`optical_trains` 可用性。独立 MCP 使用显式配置的只读 Bearer 授权，详见 [MCP](mcp.md)。

## 设备域初版实施映射（迁移前）

| path | function | function_described |
| --- | --- | --- |
| `astrophoto/database/{equipment_models,manager}.py` 和 `migrations/versions/0001_equipment_baseline.py` | typed models / `initialize` / `session` / `health` | 共用资产库，固化并核验基线、约束及写锁 |
| `astrophoto/equipment/{schemas,service}.py` | `equipment_fields` / `validate_specs` / `EquipmentService` / `check_equipment_references` | 专业字段及空值语义、事务 CRUD、分页与引用保护 |
| `astrophoto/equipment/{trains,snapshots}.py` | `OpticalTrainService` / `save_draft` / `snapshot_draft` | 原位保存、并发保护及旧记录回读 |
| `astrophoto/storage/runtime.py`, `bootstrap.py`, `core/capabilities.py` | `StorageRuntime` / `host_runtime` / `storage_capabilities` | 在实际 V3 生命周期装配、报告真实状态 |
| `astrophoto/api/{equipment,routes,storage,security,errors}.py` | `equipment_routes` / `register_routes` / `handler` / `authorize_equipment_request` | 宿主 RouteTable 与线程外移、来源校验、结构化响应 |
| `frontend/src/features/{sidebar,library}/` | `EquipmentPage`、`RecordList`、`EquipmentForm`、`EquipmentDetails`、`OpticalTrainEditor`、`OpticalTrainDetails` | 两个内部视图、七个页面、会话暂存、后台查询和回执 |
| `frontend/src/{features/sidebar/Sidebar.tsx,main.ts,host/sidebar.ts,shared/SidebarTabs.tsx,api/{client,equipment}.ts,i18n/locales/}` | `SidebarTabs` / `registerSidebar` / `requestJson` / DTO Guards | 共用键盘导航及宿主样式，取消请求并验证后端契约 |
| `mcp/src/astrophoto_mcp/{server,api/equipment,tools/equipment}.py` | `create_server` / `EquipmentHTTP.get` / `register_equipment_tools` | 在单一工厂注册 6 个受控查询 Tool |
| `tests/backend/test_equipment.py`, `tests/integration/test_equipment_api.py`, `mcp/tests/test_equipment.py`, `frontend/tests/components/Library.test.ts`, `frontend/tests/host/equipment-host.mjs` | pytest / Vitest Chromium / Playwright | SQLite、aiohttp、协议、UI 与实际宿主 |
| `scripts/release.py`, `tests/packaging/test_contents.py`, `js/main.js`, `js/assets/main.css` | `check_registry` / `check_wheel` | 单 JS 入口、统一基线及三端可分发产物 |

React → `api/equipment.ts` → 宿主 `app.api.fetchApi` → aiohttp 鉴权与参数校验 → Equipment/Train Service → DatabaseManager Session → SQLite commit → DTO 校验 → 更新 React 视图。MCP → HTTPX → 同一 aiohttp API，以只读凭据访问。

## 迁移前的官方实现复用记录

宿主实装查证为 Backend `v0.45.0-33-g9fa6bc598`、Frontend `v1.59.1`。以下源码均按项目只读参考库核对。

| 职责 | 官方路径 | 实际使用 |
| --- | --- | --- |
| Sidebar 生命周期 / HTTP | Frontend `src/types/extensionTypes.ts`；Backend `nodes.py`、`server.py` | 直接沿用 V3、registerSidebarTab、React Root、fetchApi 与原生 RouteTable |
| 确认、焦点、筛选和标签 | Frontend `src/services/dialogService.ts`、`components/dialog/content/ConfirmationDialogContent.vue`、媒体侧栏及 `NodeLibrarySidebarTabV2.vue` | 接入公开 confirm，复用已有 React 标签键盘行为及主题 token，表单继续用可访问 HTML |
| 持久化与请求边界 | Backend `app/database/db.py`、`app/assets/api/routes.py`、`server.py` | 沿用本项目 DB/HTTP 实现，复用 BEGIN IMMEDIATE 事务方式；宿主资产模型和 DB Session 为内部服务 |
| 设备领域 / 不可变快照 / Agent 凭据 | 检查宿主 `app/`、`server.py` 和前端参考树 | 官方库无匹配领域实现；自有验证、快照及仅查询凭据 |

技术指南的设备类别必填分歧按 UI 需求处理，类型和名称必填，具体光学/配件/滤镜子类可空。专业字段用规则驱动共用表单，光路与设备路由集合同处一个模块。没有引入独立 Repository 或独立 MCP Server。可选 clone API 延后。


## 单份配置调整之前的交付验收记录（2026-11-18）

工作树为 `main@5e39fcf352995918c3ba3d06b88cd61a2cbeca1a` 的本地未提交实现，含原有 Storage/Assets 和 Sidebar 修改。真实 ComfyUI 使用既有 Conda `comfyenv`、Backend v0.45.0-33、Frontend 1.59.1 与隔离测试根，未修改宿主包。

| 证据 | 实际命令或入口 | 最终结果 |
| --- | --- | --- |
| SQLite + aiohttp 专项 | `uv run pytest tests/backend/test_equipment.py tests/integration/test_equipment_api.py -q` | 17 通过。四类记录完整 DTO 往返、并发/回滚、只读历史和授权契约 |
| Python 3.12.15 | `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 70 通过，0 失败/跳过。设置真实宿主地址及 Windows D: 第二卷 |
| Python 3.11.18 | `uv run --python 3.11 --frozen pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 隔离环境 70 通过，0 失败/跳过，亦覆盖实际跨卷 |
| MCP | `uv run --project mcp pytest mcp/tests -q`；另在隔离环境 `uv run --python 3.11 --frozen --project mcp pytest mcp/tests -q` | 各 67 通过，0 失败/跳过。MockTransport 与实际 stdio 子进程 |
| 代码/构建 | `uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py`；`uv lock --check`；`pnpm -C frontend typecheck`、`lint`、`build` | 全部通过 |
| 历史迁移前回归 | React Jest 与 Vue Vitest | React 40 通过；Vue Chromium 9 通过，0 失败/跳过 |
| 构建资源 | `pnpm -C frontend check:build`、`check:proxy` | 单一 JS、两套注册、CSS 和代理路径均通过 |
| 真实 ComfyUI + Chromium | `pnpm -C frontend test:equipment-host`；重启同一个隔离宿主后 `pnpm -C frontend test:equipment-host --verify-restart` | 七页、四类档案、双通带、有序配件、快速新增、草稿、归档恢复、v1/v2 快照和默认重启均通过。另验中英文、明暗、280/420/650px、200% CSS 缩放、键盘导航和关闭重开暂存 |
| 真实 Storage / Vue | `pnpm -C frontend test:storage-host` | 实际导入、迁移回执与重新绑定、刷新恢复、Vue 绘图、PNG 上传与像素重载通过。已知 IMAGE 执行问题未纳入本任务 |
| 真实 MCP + ComfyUI | 独立 FastMCP legacy stdio 客户端调六个业务 Tool 和 `connection_status` | 正确凭据读取测试数据、错误凭据 Tool error、正确只读凭据 POST 403，均通过 |
| 打包与独立安装 | `uv build mcp --no-sources --out-dir dist/mcp`；`uv run python scripts/release.py registry`；`uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz` | Registry 45、wheel 16、sdist 23 文件。独立 Python 3.11 安装 wheel 后 legacy stdio 调真实宿主通过 |

首次浏览器验收发现设备编辑时 DTO 的 `model` 字段与内部函数参数冲突，已修复并覆盖完整 DTO 往返。Storage 回归脚本的首次迁移比较使用了 Windows 短目录别名；改用解析后的绝对路径，重跑通过。以上均为最终重跑结果。

| 验收组 | 状态 |
| --- | --- |
| P0 统一数据库、旧库保护、四类设备及专业规格、设备 UI | PASS |
| P1 光路草稿、正式 Revision、引用一致性、历史派生和默认、光路 UI | PASS |
| P1 MCP 六个授权查询、既有诊断、legacy stdio 与错误行为 | PASS |
| MCP 业务写入 | BLOCKED，保留禁用。当前授权只授予读取，缺少独立写授权和用户确认 |
| 可选 Clone 到新光路、Capture Profile 绑定、硬件控制 | 不在本次必交范围 |
