# 架构

ComfyUI 持有工作流图、画布状态、保存、撤销、节点注册、队列、执行历史和模型路径。AstroPhoto 作为原生 V3 扩展加载，后端按领域组织为模块化单体。浏览器通过宿主接口操作画布，通过挂载在 PromptServer 的 aiohttp 路由访问业务服务。扩展与宿主共用 Web 服务，部署无需独立 FastAPI/Uvicorn 进程。独立 MCP 通过公开 HTTP API 访问同一宿主。发行单元和版本约束见[双包发布](publishing.md)。

## 已实现模块

| 模块 | 当前职责 |
| --- | --- |
| 根 __init__.py | comfy_entrypoint()、ComfyExtension、WEB_DIRECTORY；on_load 组装后端并注册路由 |
| nodes/ | V3 绘图、FITS、Asset 与 Collection Source。以原生 Schema 和 NodeOutput 接入宿主 |
| astrophoto/bootstrap.py | V3 on_load 装配 StorageRuntime，注入实际节点注册查询并保留 degraded 状态 |
| astrophoto/core/ | AppConfig、ASTROPHOTO_HOME、配置错误、真实 capability 状态 |
| astrophoto/api/ | 原生 aiohttp 状态、存储、操作、素材、设备和光路路由 |
| astrophoto/database/ | 独立 SQLite Engine、Alembic、备份和持久模型 |
| astrophoto/storage/ | Data Root 初始化与停机切换、工作区/会话 Cache、共享卷配额和可恢复迁移 |
| astrophoto/assets/ | Reference/Copy 导入、文件位置与 FITS 检查、摄影项目、素材集合、会话及校准关联 |
| astrophoto/equipment/ | 精简设备信息、单记录设备组合及引用保护 |
| frontend/src/ | 公共 Vue UI、Vue I18n、原生侧栏与 Widget、资料库及画布适配 |
| extension/ | 产品前端组装入口；Siril Bundle 独占软件、候选、正式处理和本地化 |
| js/ | 构建后的 JS/CSS，不存业务源码 |
| locales/ | 宿主加载的界面和节点翻译资源。Vue 应用的词条随前端构建 |
| mcp/src/astrophoto_mcp/ | FastMCP 4.2 单 Server、诊断、受权设备与设备组合 CRUD、混合素材规划及聊天内分组确认 |
| tests/ | Extension 单元测试、HTTP 集成、宿主显式验证、发行检查 |

## V3 注册与现有数据流

`comfy_entrypoint()` 创建 `AstroPhotoExtension(ComfyExtension)` 并注入 Siril Bundle。宿主调用 `on_load` 时，扩展在已有路由上复用运行时，或初始化存储、绑定业务服务并注册原生路由。导入模块、挂载 UI 和执行节点都不得触发存储初始化。`get_node_list()` 向宿主交回 `io.ComfyNode` 类型，由宿主注册 Schema。状态路由在请求时检查绘图节点是否已注册。见[扩展入口](../__init__.py)和[运行时装配](../astrophoto/bootstrap.py)。

```text
ComfyUI → comfy_entrypoint → AstroPhotoExtension
  ├── on_load → host_runtime → register_routes(PromptServer.instance.routes)
  └── get_node_list → 绘图节点、FITS/路径/素材来源节点、Bundle 节点 → 宿主注册

Canvas → PNG Data URL → state-save → widget.serializeValue
  → api.fetchApi('/upload/image', type=temp, subfolder=threed)
  → {image: 'threed/<name> [temp]'}
  → V3 execute → folder_paths.get_annotated_filepath → 宿主 LoadImage
  → io.NodeOutput(IMAGE)
```

保留 node_id `vue-basic`、自定义类型 `CUSTOM_VUE_COMPONENT_BASIC`、输入名
`custom_vue_component_basic`、输出名 `image`、category `examples`。
V3 使用 `io.Custom(...).Input(...)`，未增加 forceInput 或改变保存工作流的值结构。
绘图节点沿用宿主缓存行为。文件来源节点按文件或集合成员生成指纹，领域业务由服务处理。

## 后端状态与数据目录

`GET /astrophoto/v1/status` 返回 Extension 标识与版本、API 版本、运行状态、路由和绘图节点注册状态及能力。`data_home` 返回当前存储根，存储不可用时回退到配置路径。前端在线状态与 IMAGE 的端到端执行需分别验证。
status_api 与 drawing_node 反映注册状态。Storage/Database 根据实际 SQLite 健康状态报告，
Assets API 需通过可信本地部署校验。原有字段和值类型保留。

数据根默认 `~/.astrophoto/`，可用 `ASTROPHOTO_HOME` 指定。宿主 V3 `on_load` 协调并首建 `config/`、`database/`、`storage/`、`runtime/` 及两份配置 JSON，首个工作区位于 `storage/<工作区 UUID>/`。初始配置根的 `config/` 保存根登记和实例锁，搬家后的目标通过其 `config/root-link.json` 查找同一登记。已初始化数据根重启时，`DataRoots.open()` 持实例锁验证配置，补齐缺失的 `database/`、`storage/`、`runtime/` 后继续装配业务存储。宿主的在线存储检查 HTTP 接口使用已绑定的存储服务，核对有效根及登记工作区，并仅补齐可安全创建的工作区子目录。MCP 不注册该工具。[本地存储](local-storage.md)

持久化业务库为 `database/assets.db`，仅由扩展业务服务访问。库中保存设备、光路、项目、拍摄会话、素材与文件位置、校准关联、处理结果及审批记录。v0.0.1 设备基线已调整，旧设备结构不提供迁移，使用新数据根；子帧关系表保存素材 ID、导入组 ID 和帧序。删除设备组合会释放名称并保留历史引用。见[设备与光路](equipment.md)。

大型图像存放在数据库外。外部引用登记源路径，受管副本以工作区 ID 和相对位置解析，服务记录相应元数据。外置盘离线时保留登记和 Asset ID。`settings.json` 保存带 revision 的配置。Copy 导入保存文件发布检查点，工作区迁移先在写事务外复制和核验，再在同一事务中提交新位置与操作阶段。提交后清理已核验的受管源副本，Reference 原件保留。删除存储位置时，用户选择另一个已登记的位置接收受管文件和正式输出。数据库更新工作区绑定，素材 ID 及项目关联继续有效。Cache 用归属和租约保护活动条目。见[本地存储交付与验收](local-storage.md)。

## 前端边界

`extension/frontend-entry.ts` 将公共 Vue 前端与随包交付的 Siril Bundle 组装为单一 ESM。侧栏由原生 `registerSidebarTab` 提供容器，绘图、FITS 与科学节点通过 `node.addDOMWidget` 挂载 Vue 应用，并在 `onRemove` 回收同时保留宿主清理。主入口、样式及宿主相对链接都经同一 Vite 8 构建。语言和明暗主题由宿主设置驱动，Widget ID 和序列化继续兼容旧工作流。

源码以 comfy:app / comfy:api 引用宿主；Vite output.paths 明确映射到产物的
../../scripts/app.js 与 ../../scripts/api.js，不受源码目录层级影响，保留反向代理路径前缀。
这些是 ComfyUI API；未修改宿主源码。TypeScript/vue-tsc 是独立检查步骤，不由 Vite build 代替。

Vue 侧栏由 Nodes、Assets、Settings 三个标签组成。Assets 提供 Projects、All Assets 和 Calibration Library。项目使用逻辑路径创建文件夹并引用目录素材。父级调整只改变项目组织关系，后端校验循环及项目边界。删除操作确认关联影响并保留磁盘文件。Siril 设置和节点由 Bundle 提供，公共资料库、FITS 来源、`IMAGE_PATH` 及预览配置独立于 Siril。

## 领域边界与规划

节点和 HTTP 路由调用领域服务，由服务访问存储或外部软件适配器。领域服务独立于节点、前端和 MCP。按实际功能创建模块。每个请求或操作管理自己的数据库 Session，外部进程运行期间释放数据库写事务。后端适配器验证软件路径、命令及参数，只允许运行已定义的操作。模型路径归宿主 `folder_paths` 管理。

| 规划领域 | 与现有模块的关系 |
| --- | --- |
| 资产与处理 | 已有素材库、校准分配、FITS 检查和 Siril Bundle。观测地、Capture Profile、自动校准推荐、PixInsight 适配及其他科学类型按产品需求扩展。 |
| 知识 | 规划独立 `knowledge.db` 保存有来源的文档、分块与 FTS5 索引。可选 sqlite-vec 与 FastEmbed/ONNX 增加向量检索。拟经 `folder_paths` 登记 `astrophoto_embedding` 和 `astrophoto_reranker`，无模型时仍能使用关键词检索。 |
| 记忆 | 规划独立 `memory.db` 保存 profile、授权、活动来源、偏好、反馈和证据。与领域知识、ComfyUI 执行历史分别管理，归属扩展并独立于外部 Agent Harness。 |
| 实验 | 规划记录可复现的输入、工作流快照、Trial、指标和反馈，经 ID 引用相关素材与运行。 |
| 画布 | 现有浏览器适配器在本地调用宿主画布。外部 MCP Canvas Bridge 属于规划，编辑须经在线前端应用，并返回目标画布的执行回执。 |

规划中的资产、知识、记忆三库各由对应业务服务持有，通过稳定 ID 引用。资产长期保存和迁移，知识索引可从许可来源重建，记忆支持按用户选择清理。跨库操作不能依赖跨库原子提交。产品范围、隐私和验收条件见[需求基线](requirements.md)。

### 规划中的持久化与模型

现有业务表和迁移由 `astrophoto/database/` 维护。未来可在资产库扩展观测地、光污染估计、校准关系及实验 Trial，并通过 ID 关联处理结果。知识库拟保存 sources、documents、chunks、FTS5 和索引版本，可另建向量索引。记忆库拟保存 profiles、sessions、activity_events、memories、memory_evidence、feedback 和 consents。知识索引的重建独立于业务库备份，活动事件可过期，长期偏好支持审阅、导出、更正和删除。多用户支持须按已确认身份隔离数据。

默认部署沿用本地 SQLite，无需 Redis、PostgreSQL 或独立向量服务。知识来源文件、预览、运行日志和模型存放在数据库外。SQLite 的 WAL 模式适用于可在本机协调共享内存的文件系统。Embedding 和 Reranker 规划使用独立模型目录，由扩展校验与选择模型。多文件模型须单独识别。采用向量扩展之前需验证 Windows 和目标宿主的兼容性。

## MCP 边界

MCP 工具通过 HTTPX 调用公开的宿主和扩展 API。数据库、宿主内部模块及外部软件适配器由扩展一侧访问。诊断、设备查询、素材库审批和用户侧 Skills 的注册契约见 [MCP](mcp.md)。

### 素材目录模型

SQLite 0005 提供子帧组、子帧、视频、图像结果、校准主帧、校准绑定、项目和项目节点。文件位置继续由 assets 和 asset_locations 解析，工作区迁移不需要改写业务引用。Reference 与 Copy 复用原有存储任务，发布文件记录时保存对应业务记录。项目、校准及素材目录通过 /astrophoto/v1/catalog 读取和编辑。SQLite 0006 清理旧集合、项目与校准关系记录。/library 下的文件登记、会话、审批和直传是独立能力。项目树通过稳定 ID 保存链接，通过名称和逻辑路径访问。校准比较作为提示，差异和未知不阻止绑定，绑定结果可与文件导入结果分别处理。

目录 MCP 使用同一公开目录 API，以及受素材库凭据保护的直接导入和任务查询接口。校准用途主帧共享图像素材的文件身份，校准参数和子帧组绑定独立存储。项目引用批量写入使用单一事务，项目及非空目录删除核对影响预览。工具契约见 [MCP](mcp.md#素材校准与项目工具)。

项目的图像类引用兼容只有校准记录的历史主帧，使用相同资产 ID 读取详情及保护引用。目录列表在同一读事务中先按元数据筛选、排序及分页，再查询当页的文件位置与子帧汇总。跨请求分页读取实时目录，游标对应行已移除时要求重新查询。

目录详情的注销请求使用详情返回的版本。兼有图像记录和校准记录的主帧以校准记录的版本为准。整组注销在同一写事务内校验引用，一次清理成员的素材反向引用，再分批删除登记并保留磁盘文件。

SQLite 0007 为图像结果增加设备组合、滤镜及快照字段，旧记录迁移为未绑定和滤镜未知。视频和图像结果通过目录接口保存和修改绑定；主帧与图像结果共用图像结果记录。

SQLite 0008 为普通主帧增加来源子帧组和拍摄参数。校准主帧的参数仍由校准记录保存；用途切换时在事务中转移参数与来源，绑定及来源引用受保护。设备和滤镜按登记时的快照展示。

SQLite 0009 在素材目录维护全局唯一名称键，覆盖子帧组、视频、主帧和图像结果，键按去除首尾空白、Unicode casefold 和 NFC 比较。单张子帧文件不占用名称。预检和实际发布分别检查，名称登记与素材写入同事务；删除登记释放名称。测试数据升级时为重名记录添加数字后缀，保留文件和引用。

已有子帧组追加复用导入任务，保留组参数，并按源路径检查已登记文件；短任务号到内部操作 ID 的映射与素材目录时间存于 LibraryRecord。MCP 素材工具通过名称解析且不要求 UUID。

SQLite 0010 按工作区和相对路径记录受管子帧组的目录归属。取消登记最后一张子帧后，组仍可在原目录追加文件，已有同名文件受覆盖保护。改名恢复记录可以使用目录归属判断提交前后的路径，跨工作区移动已登记文件时在目标工作区登记对应归属。复制任务遇到确定的发布前冲突时记录逐文件失败，任务收尾清理暂存；文件可能已发布时，保留恢复记录以核对磁盘和登记状态。

SQLite 0011 将已有成员的旧导入组补齐为目录子帧组，沿用组及素材身份、帧序和文件位置。按旧元数据格式导入的子帧也在同一事务登记目录组关系。浏览器直传在首次发布目录前持久化目录和暂存位置的身份，重启后按身份恢复发布。

项目及非空文件夹的删除确认绑定影响预览令牌，侧栏和 MCP 在同一删除事务中重验范围。侧栏移除子帧使用组版本。组详情的文件信息通过联表读取，侧栏收起文件列表时只读取摘要，浏览成员使用分页接口。

## 验证边界

独立测试使用 V3 API test doubles 和真实 aiohttp TestServer，不能证明实际 ComfyUI 加载。
此前使用 Anaconda base（Python 3.12.4 / Torch 2.3.0）的启动失败不能代表真实宿主。
激活 Conda comfyenv（Python 3.12.16 / Torch 2.14.1+cu130）后，Backend 0.45.0 /
Frontend 1.59.1、V3 注册、状态 API 与 Sidebar 已实际验证。
IMAGE 执行路径问题按用户要求保留；画板像素重载已在 2026-11-17 修复并实测。
DOM Widget getValue/setValue 保存与恢复 PNG Data URL，serializeValue 继续生成原有 `{image}` 执行参数。
详见 [Sidebar 实施证据](react-sidebar.md)。

当前迁移宿主基准、各层测试入口和前置条件见[开发与验证](development.md)。

依据：[V3 API](https://docs.comfy.org/custom-nodes/v3_migration)、
[原生路由](https://docs.comfy.org/development/comfyui-server/comms_routes)、
[Frontend 1.59.1 PrimeVue 迁移](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md)、
[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、
[Cosmic Python](https://www.cosmicpython.com/)。以目标安装版本源码及运行验证为准。

## 仓库审计补充（2026-11-16）

审计当时的绘图节点直接委托宿主 LoadImage，天文业务服务尚未实现。配置使用标准库 dataclass/tomllib，状态能力为 `{available, reason}`，尚无软件探测或实例身份协议。这份历史基线的上下文见[架构交接快照](../.agents/handoff/core/architecture.md)。

## Siril 科学处理

Siril CLI 集成沿用原生 PromptServer、StorageRuntime、受信本地授权、assets.db、Workspace 与 Cache。183 个脚本命令从固定的 1.4.5 命令表生成 V3 节点，浏览器与宿主消费该注册表。图像按路径连线，需要当前图像的命令加载工作副本并保存，序列与多文件产物按会话登记与迁移。
V3 Load Image 解析资产 ID 或服务器本地绝对路径，经 `IMAGE_PATH` 输出路径字符串。AutoStretch 正式执行直接接收该路径，调用固定的 Siril 1.4.5 CLI 脚本，将通过验证的新 FITS 发布到工作区并把输出路径传给下游。收录操作使用正式结果 ID 建立素材登记。FITS 尺寸、位深、指纹和坐标信息用于执行内部校验、比较和回执。可信本机读取 FITS 无需配置导入根目录。
候选预览经独立的单节点 HTTP 作业生成 Cache PNG，运行回执与正式结果存入所选 Workspace。科学节点以文件路径传递数据，保留原始 FITS 的精度与元数据。转换为普通 `IMAGE` 时须明确提示转换及其影响。处理产物的实际位深与元数据保真范围以回执和样本验证为准。
接口、恢复和验证证据见 [Siril 实现](siril.md)。

前端一次性操作反馈通过 `frontend/src/host/notify.ts` 调用 ComfyUI 宿主通知，兼容新版与旧版通知接口；宿主不可用时保留上下文内的回退提示。表单校验、冲突恢复、重试和批量结果仍在相应页面展示。
