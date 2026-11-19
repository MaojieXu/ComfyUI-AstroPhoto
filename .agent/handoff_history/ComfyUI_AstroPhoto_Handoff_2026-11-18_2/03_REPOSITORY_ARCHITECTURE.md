# 仓库架构与共享契约

- 根 __init__.py 进入 comfy_entrypoint，V3 Extension on_load 初始化、注册 Node 和 aiohttp。astrophoto/ 按数据库、存储、资产、设备、Siril、API 及 core 分域。宿主拥有图和队列，业务服务负责所有持久化、请求边界和恢复。
- frontend/ 由 Vite 合并 Vue widget 和 React Sidebar 入口，js/ 和 locales/ 面向宿主提供构件。UI、Python API DTO、SQLite schema、文件 marker、工作流 Widget 值和执行 receipt 有不同所有者。
- nodes/ 定义稳定 V3 ID。普通 IMAGE 和科学 IMAGE_PATH 的消费者及精度边界见节点章。外部 mcp/ 独立包通过受支持 API 读宿主状态或条件读取设备，不直连业务数据库。
- 正式路由、并发/权限 guard 和真实断言在 [Feature](04_COMPLETE_FEATURE_INVENTORY.md)、[Guard](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 和 [Test](06_TEST_COVERAGE_MATRIX.md) 交叉追溯。

## 当前仓库架构原文

````markdown
# 架构

当前采用 **Domain-first Modular Monolith + ComfyUI Native Extension + V3 Node API**。
软件版本为 0.0.1；Extension 通过 Registry ZIP 分发，MCP 独立通过 PyPI wheel 分发。
根 pyproject.toml 为唯一版本来源，uv workspace 共用一个 uv.lock。

## 已实现模块

| 模块 | 当前职责 |
| --- | --- |
| 根 __init__.py | comfy_entrypoint()、ComfyExtension、WEB_DIRECTORY；on_load 组装后端并注册路由 |
| nodes/ | 一个 V3 io.ComfyNode；Schema、输入校验、LoadImage 适配、NodeOutput |
| astrophoto/bootstrap.py | V3 on_load 装配 StorageRuntime，注入实际节点注册查询并保留 degraded 状态 |
| astrophoto/core/ | AppConfig、ASTROPHOTO_HOME、配置错误、真实 capability 状态 |
| astrophoto/api/ | 原生 aiohttp 状态、存储、操作、素材、设备和光路路由 |
| astrophoto/database/ | 独立 SQLite Engine、Alembic、备份和持久模型 |
| astrophoto/storage/ | Data Root 初始化、工作区/缓存管理及可恢复迁移 |
| astrophoto/assets/ | reference/copy 导入、素材位置解析、会话关联 |
| astrophoto/equipment/ | 设备专业规格、单份光路配置、旧历史兼容读取、引用保护 |
| frontend/src/ | Vue UI、原生 DOM Widget 适配、独立 PrimeVue/i18n 初始化 |
| frontend/ui/src/ | React Sidebar：Nodes / Assets / Settings、宿主适配、真实节点目录与状态接口 |
| js/ | 构建后的 JS/CSS，不存业务源码 |
| locales/ | 中英文 main.json；已打入独立 Vue App 并包含于 Registry，宿主发现/显示仍待真实运行验证 |
| mcp/src/astrophoto_mcp/ | FastMCP 4.2 单 Server、诊断及受控只读设备查询、公共 HTTP Adapter |
| tests/ | Extension 单元测试、HTTP 集成、宿主显式验证、发行检查 |
| reference/ | 参考项目；不修改、不导入、不打包 |

## V3 注册与现有数据流

此前标准化任务将实际 V1 源码迁为 V3；当前未同时导出 V1 映射，避免宿主优先走旧入口。本次交接审计只复核，未再次迁移。
本机 ComfyUI 0.45.0 的加载器依次调用 comfy_entrypoint → on_load → get_node_list → GET_SCHEMA。
因此状态 API 在每次请求时查询真实 NODE_CLASS_MAPPINGS，不能在 on_load 时就声称节点注册完成。

```text
ComfyUI → comfy_entrypoint → AstroPhotoExtension
  ├── on_load → bootstrap → register_routes(PromptServer.instance.routes)
  └── get_node_list → ComfyUIFEExampleVueBasic.define_schema

Canvas → PNG Data URL → state-save → widget.serializeValue
  → api.fetchApi('/upload/image', type=temp, subfolder=threed)
  → {image: 'threed/<name> [temp]'}
  → V3 execute → folder_paths.get_annotated_filepath → 宿主 LoadImage
  → io.NodeOutput(IMAGE)
```

保留 node_id `vue-basic`、自定义类型 `CUSTOM_VUE_COMPONENT_BASIC`、输入名
`custom_vue_component_basic`、输出名 `image`、category `examples`。
V3 使用 `io.Custom(...).Input(...)`，未增加 forceInput 或改变保存工作流的值结构。
无实际缓存需求，因此不添加 fingerprint_inputs。后续节点只做适配；领域业务委托 Service。

## 后端状态与数据目录

`GET /astrophoto/v1/status` 返回 Extension 标识/版本、API v1、ok/degraded、实际路由与节点
注册状态、配置的数据根路径、capabilities。状态不声称前端在线或 IMAGE 已执行成功。
status_api 与 drawing_node 反映注册状态。Storage/Database 根据实际 SQLite 健康状态报告，
Assets API 需通过可信本地部署校验。原有字段和值类型保留。

V3 on_load 触发初始化。跨进程 FileLock 协调 manifest、settings、专属 SQLite 和默认标记。
数据库记录工作区根与资产的稳定位置，settings.json 保存带 revision 的配置。
读取配置和导入 Python 模块无写入副作用。外置盘离线后保留登记也保留 Asset ID。

copy 导入按文件保存发布检查点，迁移按 Workspace 保存清单与 root switch 检查点。
全量文件复制在 DB 写事务之外。迁移的权威根路径与 committed 阶段同一事务更新。
Reference 原件及迁移旧源由用户继续持有。Cache 清理限于匹配归属且没有租约的可重建条目。
调用边界、DTO 和风险见 [本地存储交付与验收](local-storage.md)。

## 前端边界

Frontend 1.59.1 已移除宿主 PrimeVue 插件和主题。扩展改为 native node.addDOMWidget，
自行 createApp + PrimeVue 4.3.3/Aura + vue-i18n，并在 widget.onRemove 卸载，同时保留宿主清理。
Vue 3.5.13、PrimeVue、React Sidebar、各自国际化和主题均打入单个 main.js；不会把另一份 Vue 组件交给宿主 Vue 渲染。
主题使用 astrophoto 前缀，避免依赖宿主 --p-* 变量。Widget ID、序列化 JSON、画笔交互保持兼容。

源码以 comfy:app / comfy:api 引用宿主；Vite output.paths 明确映射到产物的
../../scripts/app.js 与 ../../scripts/api.js，不受源码目录层级影响，保留反向代理路径前缀。
这些是 ComfyUI API；未修改宿主源码。TypeScript/vue-tsc 是独立检查步骤，不由 Vite build 代替。

## 未来业务归属（均未创建）

| 域 | 未来职责和技术 |
| --- | --- |
| 资产扩展 | Capture Profile 关联、校准关系、FITS 元数据 |
| software/ | Software Registry、受控 Runner、Siril/PixInsight Adapter |
| processing/ | Astropy/NumPy、科学数据与显式 IMAGE 转换，保留 FITS 精度与元数据 |
| knowledge/ | LangChain、SQLite FTS5、按需 sqlite-vec |
| memory/ | 用户授权下的行为、偏好、反馈与记忆生命周期 |
| experiments/ | 参数 Trial、指标、执行与复现记录 |
| canvas/ | 原生前端命令与真实执行回执，不把提交 prompt 等同于修改画布 |

依赖方向：Node / HTTP API → Domain Service → Repository / Adapter → Storage / External Software。
领域 Service 不导入 nodes、frontend、mcp。根据实际复杂度创建 models/schemas/service/repository，
不套用统一空模板。Session 由请求/操作管理，不跨并发任务共享；长运行软件不持有写事务。
模型路径由 ComfyUI folder_paths 管理。外部软件只能通过受控 Adapter，禁止任意 Agent Shell。

## MCP 边界

FastMCP 4.2 的 create_server 是唯一工厂，tools/status 注册两个既有工具；client/api
只访问公共 ComfyUI HTTP API。现有 connection_status 契约与请求保持原样。显式配置本地只读凭据后，同一工厂注册设备与光路查询。
MCP 不读取 Extension 配置/数据库，不构成第二套业务后端。业务 Skills 尚未实现。

## 验证边界

独立测试使用 V3 API test doubles 和真实 aiohttp TestServer，不能证明实际 ComfyUI 加载。
此前使用 Anaconda base（Python 3.12.4 / Torch 2.3.0）的启动失败不能代表真实宿主。
激活 Conda comfyenv（Python 3.12.16 / Torch 2.14.1+cu130）后，Backend 0.45.0 /
Frontend 1.59.1、V3 注册、状态 API 与 Sidebar 已实际验证。
IMAGE 执行路径问题按用户要求保留；画板像素重载已在 2026-11-17 修复并实测。
DOM Widget getValue/setValue 保存与恢复 PNG Data URL，serializeValue 继续生成原有 `{image}` 执行参数。
详见 [Sidebar 实施证据](react-sidebar.md)。

设备与光路由 StorageRuntime 装配，在 assets.db 的统一 Alembic 基线中保存。浏览器和 MCP 分别授权；光路在一个 SQLite 写事务中原位保存配置，并校验并发字段。既有历史只读保留。见 [设备与光路](equipment.md)。

React Sidebar 使用 frontend/entry.ts 聚合入口，保留 Vue 源码；host/ 隔离固定版本
Canvas 操作，api/ 只访问真实公共 HTTP 接口。Settings 中提供 Storage；Assets 提供导入和真实列表。
本地 Sidebar 创建节点不等于已实现供 MCP 调用的 Canvas Bridge，后端 capability 仍为 false。

依据：[V3 API](https://docs.comfy.org/custom-nodes/v3_migration)、
[原生路由](https://docs.comfy.org/development/comfyui-server/comms_routes)、
[Frontend 1.59.1 PrimeVue 迁移](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md)、
[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、
[Cosmic Python](https://www.cosmicpython.com/)。以目标安装版本源码及运行验证为准。

## 仓库审计补充（2026-11-16）

当前 Node 直接委托宿主 LoadImage，没有天文 Domain Service。配置使用标准库 dataclass/tomllib，而非历史示例中的 Pydantic 配置系统。状态能力为 `{available, reason}`，无软件探测或实例身份协议。完整快照与双向差异见 [审计交接](handoffs/repository-verified-2026-11-16/00_README.md)。

## Siril 科学处理

Siril 软件配置和正式 AutoStretch 沿用原生 PromptServer、已有 StorageRuntime、受信本地授权、assets.db、Workspace 与 Cache。
V3 Load Image 解析资产 ID 或服务器本地绝对路径，经 `IMAGE_PATH` 输出路径字符串。AutoStretch 正式执行直接接收该路径，调用固定的 Siril 1.4.5 CLI 脚本，登记通过验证的新 FITS，再把输出路径传给下游。FITS 尺寸、位深、指纹和坐标信息用于执行内部校验、比较和回执。可信本机读取 FITS 无需配置导入根目录。
候选预览经独立的单节点 HTTP 作业生成 Cache PNG，运行回执与正式结果存入所选 Workspace。
接口、恢复和验证证据见 [Siril 实现](siril.md)。
````


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/03_REPOSITORY_ARCHITECTURE.md)

```markdown
# 当前源码架构

| 源路径 | 当前职责 |
|---|---|
| __init__.py、nodes/ | comfy_entrypoint、on_load、get_node_list。绘图节点与三个科学节点，返回宿主 V3 Schema。 |
| astrophoto/bootstrap.py、astrophoto/core/ | 纯配置 bootstrap、宿主启动时初始化、失败降级、作用域配置验证、capabilities 与版本。 |
| astrophoto/api/ | Comfy PromptServer RouteTableDef。route registration、共享 auth/DTO/error、分域 storage、assets、equipment、siril。 |
| astrophoto/storage/、astrophoto/database/ | 文件授权、初始化锁、SQLite baseline、Workspace、Cache、后台 operations、复制及迁移恢复。 |
| astrophoto/assets/、astrophoto/equipment/ | 资产对象/位置/Session 关系、设备规格、光路 JSON 当前配置以及读兼容快照。 |
| astrophoto/siril/ | 可执行探测，固定处理脚本，FITS I/O、候选预览、正式处理与恢复。 |
| frontend/entry.ts、frontend/src/ | Vue Widget、PrimeVue、绘图/上传、原生宿主导入与复用的 Vue 控件组件。 |
| frontend/ui/src/ | React Sidebar、公开 Host API adapter、页面、DTO、科学节点 DOM Widget 和独立 Inspector。 |
| mcp/src/astrophoto_mcp/ | 独立 FastMCP 4.2.0 CLI/server/client 和 HTTP adapter，发包与 Extension 分离。 |
| scripts/、.github/ | 版本同步/预检、Registry 与 PyPI 构件边界、CI、发版和隔离安装检查。 |

## 入口和依赖方向

- __init__.py:12–45 → bootstrap.host_runtime → StorageRuntime.initialize → 数据根、DB、缓存、未完成 operation 与 Siril run 恢复。initialize_storage_runtime 捕获错误，status 仍可报告 degraded。宿主入口有重复 route/runtime 判断。
- ComfyUI 环境的浏览器 → Host Adapter 的 fetchApi → route registry → 权限及 JSON 解析 → asyncio.to_thread → domain service → DB transaction/operation。长时 I/O 走业务 worker 和持久 plan/receipt。
- root config/settings.json 设 workspace id、import mode、cache budget、PNG 分辨率，配置锁和 revision；Databases/assets.db 保存身份/Workspace/资产关系/操作/设备与光路。文件分布在各 Workspace、外部原路径、Cache 和 runtime。
- Comfy Vue Widget 装入原生 DOM widget，拥有自己的 Vue 生命周期；React Sidebar 装入宿主 sidebar render 容器；科学节点 Inspector 另有 React root/widget 生命周期，发布产物共享单个 js/main.js 和 JS 相对链接的 assets/main.css。
- Comfy graph 是节点修改、Undo/Redo、工作流与正式队列执行的拥有者。Sidebar Nodes 的添加/拖拽在当前图上调宿主 API。status 中 canvas_bridge false 指远程/Agent 能力，不能据此否认这条本地交互。
- MCP stdio → create_server → 诊断或设备 Tool → HTTP 边界 → Extension Service，MCP 无 DB/import 依赖 Extension。详见 [MCP](10_MCP_CI_PACKAGING.md)。

## 路由入口

统一前缀 /astrophoto/v1。GET /status 是单独的公开 status handler。其余声明从 api/storage.py:176、api/assets.py:53、api/equipment.py:81、api/siril.py:94 加入原生路由表。可从 [路由索引](evidence/routes.md) 跳到每条实际方法、handler 与预期 HTTP status。四组业务路由共用 body 限制与错误包装，equipment 切换独立授权策略。

这是审计范围内项目树。reference、历史交接、node_modules 与 .venv 是参考或依赖证据，未按本项目实际运行模块计数。逐路径覆盖账本见 [source-inventory.md](evidence/source-inventory.md)。
```
