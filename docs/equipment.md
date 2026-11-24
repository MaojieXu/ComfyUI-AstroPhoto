# 设备与设备组合

适用于 AstroPhoto Extension / MCP 0.0.1。需求基线为 `.artifact/设备板块` 内 UI FRD v1.0 和 Three Tier Engineering Guide v1.0。两份文档的 P0/P1 设备范围为相机、望远镜/摄影镜头、光学配件、滤镜，以及光路配置。当前操作规则以用户确认的单份配置为准。原规格文件为 0 字节。

## 操作入口和数据规则

五类设备共用名称、产品名和备注表单，名称与产品名必填；名称区分具体设备，产品名可以重复。其他类型可记录导星设备、软件等。设备组合可引用其他类型设备。

设备和光路的列表工具栏共用节点页的 `SearchField` 和 `SearchOptions`。交互适配 ComfyUI Frontend v1.59.1 的 `SidebarTopArea`、`SearchInput.vue` 和 `FilterDropdown.vue`。两页分别保留搜索值及单选筛选，并沿用各自的查询参数。

- **设置 → 设备管理 → 我的设备**提供搜索、筛选、类型选择、新增/编辑和详情。备注可空，焦距和倍率等信息可记录在备注。
- **设置 → 设备 → 设备组合**提供列表、编辑器及当前配置详情。一个组合包括最多一台相机、一个主光学设备、一个附件和多个滤镜及其他设备；可保存不完整配置。配置含相机与主光学设备时显示为已配置，滤镜表示可用集合。
- 设备和组合原位更新，设备详情和搜索使用当前资料，支持归档与恢复。素材保存绑定时的组合成员和所选滤镜快照。修改设备或组合资料不会回写已有素材，重新绑定时从当前资料生成快照。
- 设备和设备组合分别校验名称。比较去除首尾空白，并采用 Unicode NFC 和大小写折叠。归档记录继续占用名称，旧重名记录可以沿用原比较键保存。表单说明名称必须唯一，发生冲突时在名称字段显示明确提示。
- 组合可保留或移除已保存配置中的归档设备。移除并保存后重新加入属于新增引用，后端会拒绝并标出对应字段。
- 未保存编辑在侧栏注册实例中暂存，在宿主关闭并重新挂载侧栏时恢复；切换模块/主视图时确认是否丢弃，浏览器硬刷新依赖浏览器的离开提示。已保存配置可跨重启。语言和配色由宿主设置控制。
- 设备与 Storage 共用数据库。设备或光路写入不会修改文件、工作区或导入设置。素材库可引用相机和光路并显式分配校准 Master。Capture Profile 和自动校准推荐属于规划。

设备及光路详情使用摘要卡片和可折叠分组。

## SQLite 基线

设备与摄影素材库共用数据根下的 `database/assets.db`。启动时核验实例身份、已知结构、外键和完整性，SQLite 使用 WAL 和每连接 3 秒的忙等待。设备基线已按 v0.0.1 新结构调整，不提供旧设备结构迁移；不匹配的开发数据库保留原库并报告 `DEV_SCHEMA_RESET_REQUIRED`。开发验收使用独立测试数据根。

| 表 | 主要结构 |
| --- | --- |
| `storage_identity`, `storage_locations` | 实例身份、工作区根及写入代际 |
| `assets`, `asset_locations`, `asset_sessions`, `storage_operations` | 资产、受管/引用位置、会话关联、现有导入/迁移操作 |
| `equipment` | 设备 ID、五类枚举、名称、产品名、备注、归档、版本及时间 |
| `optical_trains` | 组合名称、备注、相机、主光学及单附件 ID、滤镜和其他设备 ID 列表、状态、版本和时间 |
| `alembic_version` | 当前 Schema 标识 |

设备写入先获取 SQLite RESERVED 锁（BEGIN IMMEDIATE），以条件 UPDATE 检查并发。光路保存验证组件类型，并在同一事务中更新同一份配置。v0.0.1 开发基线已调整，旧设备数据库不提供迁移；不匹配的库保留原状并报告错误，使用新数据根。设备创建和初次光路创建无幂等键，出现网络不确定时先核对列表。

设备详情提供永久删除。被设备组合、素材旧版元数据或校准主帧直接相机字段引用的设备受保护。删除组合后，普通列表及新绑定选择不再显示该组合，原名称可以复用。记录保留，可按原 ID 查回。归档保留名称并支持恢复。删除请求校验记录版本。

## HTTP 与权限

前缀为 `/astrophoto/v1`。

| 路径 | Method | 返回 |
| --- | --- | --- |
| `/equipment` | GET / POST | `{items,next,total}` / 201 Equipment DTO |
| `/equipment/{id}` | GET / PATCH / DELETE | 详情 / 新 row_version 与 DTO / 204 |
| `/equipment/{id}/archive`, `/restore` | POST | 归档或恢复后的 DTO |
| `/optical-trains` | GET / POST | `{items,next,total}` / 201 组合详情，创建使用平铺字段 |
| `/optical-trains/{id}` | GET / PATCH / DELETE | 详情 / 使用 expected_version 更新后的详情 / 204 软删除 |
| `/optical-trains/{id}/archive`, `/restore` | POST | 更新后的光路详情 |

状态查询兼容旧参数 `published`，界面显示「已配置」。列表使用 UUID 游标 `after`、`limit` 1–100，以及搜索/类型/状态/归档筛选。写操作校验 JSON 结构及 64 KiB 上限。非 204 成功回执带 `request_id`；错误形如 `{error:{code,message,details?:{fields}},request_id}`。409 表示版本冲突、引用保护或历史不可变，422 表示业务输入失败，503 表示依赖不可用。204 带 `X-Request-ID`。

设备域使用单用户、未启用 CORS、直接监听回环地址的宿主。浏览器请求验证 loopback peer 与 Host、同源 Fetch Metadata、Origin 以及无代理标记。边界信任同一台机器上的进程。`X-AstroPhoto-Local` 是浏览器客户端的请求标记。状态分别报告 `equipment`、`optical_trains` 可用性。独立 MCP 使用分别配置的读取、写入和删除确认权限，详见 [MCP](mcp.md)。

设备 MCP 通过公开 HTTP 接口按名称管理五类设备及组合，枚举、权限和分页契约见 [MCP](mcp.md)。

## 设备域初版实施映射（迁移前）

| path | function | function_described |
| --- | --- | --- |
| `astrophoto/database/{equipment_models,manager}.py` 和 `migrations/versions/0001_equipment_baseline.py` | typed models / `initialize` / `session` / `health` | 共用资产库，固化并核验基线、约束及写锁 |
| `astrophoto/equipment/{schemas,service}.py` | `equipment_fields` / `EquipmentService` / `check_equipment_references` | 设备字段校验、事务 CRUD、分页与引用保护 |
| `astrophoto/equipment/{trains,snapshots}.py` | `OpticalTrainService` / `update_train` / `validate_train_components` | 单记录保存、并发保护与设备类型校验 |
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

本节为迁移前的历史实现记录；当前设备类型、名称和产品名必填，设备表单统一，详见本文开头。可选 clone API 延后。


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
