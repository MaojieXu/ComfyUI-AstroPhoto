# 设备、设备组合、素材与 MCP · 技术设计

后续技术设计在同一宿主和工作区基线核对设备、素材及 MCP 契约。下文保留三项原技术设计和当前实现边界。

<a id="04-equipment"></a>

## 设备与设备组合


**v0.3 · 当前工作树静态核验**。环境及来源见 [索引](00_FEATURE_INDEX.md#04-equipment)。Vue 界面通过宿主 `app.api.fetchApi` 查询或写入。宿主 V3 生命周期装配 StorageRuntime、DatabaseManager、EquipmentService 与 OpticalTrainService，注册原生 aiohttp RouteTable；授权和资源状态通过 handler 检查，实际业务转到线程执行。数据由扩展资产域持有，MCP FastMCP 只访问 HTTP。

### 持久化及接口

`ASTROPHOTO_HOME/databases/assets.db`（默认 `~/.astrophoto`）与 Storage/Assets 共用。Alembic `0001_equipment_baseline`，独立类型规格与一对多读出/通带，光路有主记录及唯一当前配置、旧快照和旧默认指针。SQLite FK、WAL、启动版本/结构/完整性检查和写事务 `BEGIN IMMEDIATE`；同一事务处理依赖行和版本。版本不符的库由健康检查报错，开发验证使用独立测试根。设备操作不写工作区、素材原件和导入配置。 [存储专题](../local-storage-workspaces/03_TECH.md) · [数据库规则](../../../docs/equipment.md)

| `/astrophoto/v1` 入口及需求 | 调用与主要契约 | 副作用与返回 |
| --- | --- | --- |
| FR-01 · GET/POST `/equipment` | 列表 `q,type,archived,after,limit`，UUID 游标，limit 默认为 50，允许 1–100；新增必需 `equipment_type,name`，可含厂商、型号、备注、类型专属 specs。 | 列表 `{items,next,total}`；新增 201 + Equipment DTO，基础行及规格一并写。 |
| FR-01、FR-03 · GET/PATCH/DELETE `/equipment/{id}`；POST `/archive`、`/restore` | UUID；修改、归档、恢复及删除携带 `expected_version`。详情包含 `usage_summary`，覆盖当前配置和旧历史。 | 更新返回新 DTO/版本；DELETE 204，版本冲突或有引用拒绝。 |
| FR-02、FR-03 · GET/POST `/optical-trains`；GET/DELETE `/optical-trains/{id}`；POST `/archive`、`/restore` | 列表支持 `status` 取代 `type`；创建 `name,notes?,draft?`；归档、恢复和删除用 `expected_version`。详情含 `configuration`、`components` 与历史兼容字段。 | 创建 201，其他成功 200 或删除 204。当前配置优先、其次旧默认或最近快照，不自动回填为新配置。 |
| FR-02、FR-04 · GET/PUT `/optical-trains/{id}/draft` | GET 返回 `{draft: null 或保存回执}`。PUT 入参 `{draft,expected_draft_version}`，初次写用 null，成功后原位更新 `draft_version`。 | 写入类型和存在的引用。归档光路、过期版本及无效引用拒绝。版本和当前配置同事务更新。 |
| FR-02、FR-05 · `/optical-trains/{id}/revisions`、`/revisions/{revision_id}`、`/default-revision` | GET 旧历史摘要和快照详情；老 publish POST/默认 PUT 拒绝 410 `TRAIN_HISTORY_READ_ONLY`，快照 PATCH/DELETE 409 `REVISION_IMMUTABLE`。 | 快照校验版本 1、所属光路及各部件类型与顺序。合法永久删除光路会同时删除其兼容历史及默认指针。 |

FR-05 的浏览器请求要求 `ASTROPHOTO_LOCAL_STORAGE=1`、受信单用户直连回环宿主、同源 Fetch Metadata、有效 Host/Origin、自定义标记且无代理标记。只读 MCP Bearer 仍受回环前提，无浏览器 Origin/Fetch Metadata，仅 GET。单一资产库的服务为数据边界。JSON body 最大 64 KiB；错误通常以 `{error:{code,message,details?},request_id}` 返回，204 使用 `X-Request-ID`。400 请求体或查询无法解析，403 权限，404 记录不存在，409 版本/引用/归档冲突，422 业务字段校验，423 数据库忙，503 依赖不可用或数据损坏。 [MCP 专题](03_TECH.md#05-mcp)

### v0.4 待实现契约

D-04 更新用户可见术语。OpticalTrain、/optical-trains 和 MCP 工具名沿用兼容入口。D-05 待在设备和设备组合各自写入边界校验名称，创建、重命名及并发写入按同一规则，具体比较及旧重名处理随 Q-07 确认。D-06 以写入前的有效配置区分保留、移除和新增归档引用，拒绝新增后不改变已存配置或旧快照。 [决定与验收](01_PRD.md#04-equipment)

### 一致性、取舍与已知差异

- 光路当前关联实时查设备，历史快照内容保持其记录值。兼容 `published` 值表示已配置；归档优先显示。配件按数组位置展示，滤镜为去重的可用集合。比较旧历史回退和当前配置时，用单独的服务、API 与宿主用例。
- SQL 条件更新与写锁避免普通陈旧提交覆盖。界面重基只更新待提交版本号和比较基线，本地整个表单仍可能覆盖其他会话所改字段。创建没有幂等键，连接中断后需先确认实际结果。配置分多请求取详情、可选项和列表；组件 abort 防止过期响应更新，后端已提交写入不因客户端取消而撤销。
- 已归档设备在 Vue 可选项排除，后端组件校验存在和类型即可。光路配置保留旋转、变更备注和平场适用性字段，当前编辑器没有相应控件。D-06 已确认禁止新增归档引用，D-08 已确认不新增编辑控件，保留兼容字段。
- 搜索按 Unicode casefold 查询本地库，设备详情使用关系需要扫描当前配置和旧历史；未定义量化资源阈值，性能用分页、大历史样本和真实用户路径测量。对列表游标、UI 部件控制规模和过滤以实际规则为准。
- 宿主 V3、Sidebar、fetchApi、主题与确认弹窗沿用原生实现，设备领域及快照自有。单选、多选源码血缘为 ComfyUI Frontend 1.59.1，适配说明含版本、来源和许可证，目标宿主为 1.59.6。 [源码复用说明](../../../frontend/src/vendor/comfyui/README.md) · [逐入口定位](04_DEV.md#04-equipment) · [测试计划](05_TEST_PLAN.md#04-equipment)

<a id="05-mcp"></a>

## MCP 诊断与设备只读查询


**版本** v0.4 · 2026-11-21 · 当前源码契约

### 基线与职责

当前源码为 `main@4c0cf4d` 加未提交工作树。MCP Python ≥3.11，FastMCP 4.2.0、HTTPX ≥0.28 且 <1，包版本 0.0.1。宿主 aiohttp 路由与 SQLite 属于 Extension。宿主和 MCP 不共享数据库或进程内状态。当前 V3 启动调整影响路由和运行态装配；默认诊断通过宿主公共端点保持独立。

| FR | 调用链 | 契约 |
| --- | --- | --- |
| FR-01/04 | 客户端 stdio → CLI → FastMCP → HTTPX | `version` 有 JSON text 与 structuredContent，`connection_status` 只有 JSON text，且无 outputSchema。后者顺序 GET `system_stats` 和 `object_info/vue-basic`；有效对象的节点键决定注册，system 缺失默认空对象。可达成功才返回 reachable=true；HTTP、网络及数据错误由 FastMCP 表达为工具失败。 |
| FR-02 | FastMCP → EquipmentHTTP → `/astrophoto/v1/` 设备路由 | 两种分页列表响应为 `{items, next}`，详情为对象，修订列表为 `{items}`。设备类型和归档、查询条件转为 HTTP query。当前设备组合配置和历史兼容 DTO 分别消费，完整字段含义由设备专题持有；MCP 检查必要结构后传递响应。 |
| FR-05 | MCP 注册门 → 每个 GET 的宿主鉴权 → 设备服务 | 客户端只接受 IP 字面量 loopback 和根路径，注册需 token 格式合规。设备 HTTP禁系统代理、禁跟随重定向。宿主要求显式启用本机存储、监听地址受信、单用户且无 CORS 配置，逐次检查来源和 Bearer，浏览器写权限走独立分支。 |
| FR-03 | 两个构件 → 独立环境安装 → stdio 探针 → 发行 | Registry 只打包 Extension，MCP wheel/sdist 单独。根版本同步并固定依赖 MCP 版本。公开发布顺序沿用现行发行文档。 |

### 错误、异步与配置边界

- 两类 HTTP 调用均使用源码配置的 10 秒 timeout，诊断的两次请求各自受 HTTPX 控制，此值不等同整个工具的总截止时间。设备请求不自动重试、分页不提供跨请求事务快照。并发改库可能让后续页与先前页来自不同数据时点。
- 设备适配器只传播经过字符约束的服务端错误码及 HTTP 状态，缺少有效码时使用 HTTP_ERROR；连接、超时、坏 JSON 和 DTO 分别转工具错误。它不会把响应正文或令牌拼进结果。仍需在独立客户端核对日志和配置失败路径脱敏。
- MCP token 读取于进程装配，宿主 token 读取于 runtime 初始化。重新打开 UI 或重新枚举不会更新它们。宿主相同 RouteTableDef 的 runtime 复用意味着扩展重绑不保证轮换。Q-01 的关键证据是两个隔离客户端及明确的宿主重启。
- 基础诊断可以使用合法 HTTP(S) 和路径前缀，不发送设备令牌。设备查询更严格。D-04 保留基础诊断的工具名与输出。D-05 支持多个受信本机 Agent 并行查询，权限遵循现有宿主边界。若 Q-03 改作用域，决定应先传播到设备路由和旧客户端兼容测试，再改变工具注册和输入。

### 工具与 Extension 契约

所有设备工具发送 `GET /astrophoto/v1/<path>`。下表是当前适配范围。

| 工具 | 路径 | 当前返回或校验 |
| --- | --- | --- |
| `equipment_list` | `equipment` | 可选类型追加 `type`。与组合列表共用 `q`、`archived`、`after`、`limit`，返回 `items` 和 `next`。 |
| `equipment_get` | `equipment/{equipment_id}` | 设备 DTO，含规格与引用字段。 |
| `optical_train_list` | `optical-trains` | 组合分页及状态摘要。设备 API 支持 `status`，MCP 列表工具当前未暴露该参数。 |
| `optical_train_get` | `optical-trains/{train_id}` | 当前组合详情。旧版兼容字段可保留，当前配置读取以 `configuration` 为准。 |
| `optical_train_revision_list` | `optical-trains/{train_id}/revisions` | 返回 `items`，新组合通常为空。 |
| `optical_train_revision_get` | `optical-trains/{train_id}/revisions/{revision_id}` | 读取归属该组合的旧快照与兼容模板。不存在或归属其他组合返回 404。 |

设备路由的 Bearer 守卫作用于 GET 方法与调用来源。设备 API 另有 `GET /optical-trains/{id}/draft`；合规 Bearer 可直接读取该路由，MCP 当前没有对应独立工具。凭据范围与工具数量应分开描述。同源浏览器授权在该分支外，拒绝的 Bearer 写请求不会转交浏览器分支。 [工具](../../../mcp/src/astrophoto_mcp/tools/equipment.py) · [宿主路由](../../../astrophoto/api/equipment.py) · [授权](../../../astrophoto/api/security.py)

### 切片与关联

先核对配置和默认协议，再核对宿主部署与设备工具的读写权限，最后复验本地构件和真实宿主；公开渠道单独取证。 [实现与拒绝规则](04_DEV.md#05-mcp) · [测试](05_TEST_PLAN.md#05-mcp) · [宿主底座](../08-comfyui-extension-drawing/00_FEATURE_INDEX.md) · [设备与设备组合](00_FEATURE_INDEX.md#04-equipment) · [发行](../../../docs/publishing.md)

<a id="06-assets"></a>

## 素材导入与资产登记


**版本** v0.4 · 2026-11-21 · 源码静态核对。代码基线见[索引](00_FEATURE_INDEX.md#06-assets)。aiohttp 路由、SQLAlchemy/SQLite 和文件操作由 Extension 执行，目标宿主 ComfyUI 0.46.0 / Frontend 1.59.6。复用宿主 `on_load`、路由和 Widget 接口。 [开发环境](../../../docs/development.md)

### 数据所有权与关系

`Asset` 存 UUID、名称、大小、mtime。外部 `AssetLocation` 存规范路径/唯一键，受管 `AssetLocation` 存 Workspace ID 与唯一的相对键；前者引用本机原件，后者以 `objects/<asset_id>/<name>` 管理副本。科学 Bundle 还可登记受管输出。 `AssetSession` 以资产 ID 与业务会话字符串关联多对多，没有完整会话实体。大文件与 FITS 像素留在文件系统，Asset/关系/operation 由业务服务经现有 SQLite 数据库写入。 [模型](../../../astrophoto/database/models.py) · [Workspace 技术设计](../local-storage-workspaces/03_TECH.md) · [科学处理设计](../07-siril-fits-autostretch/03_TECH.md)

### API 契约

前缀 `/astrophoto/v1`，使用本机可信部署和 `X-AstroPhoto-Local: 1`。导入授权根由 `ASTROPHOTO_IMPORT_ROOTS` 指定，选择与执行检查真实路径、排除 Data Root、Cache 和登记/保留的工作区，规则复用 storage handler。错误返回 request_id 与 error.code，拒绝来源 403、缺项 404、冲突 409、忙 423、容量 507，默认无效输入 422。受理后失败看 operation.error 和 receipt，与 HTTP 受理分开。

| 操作 | 输入、返回与副作用 |
| --- | --- |
| `POST /assets/import/preview` | sources 为 1～100 个服务端绝对路径；可选 import_mode_override、workspace_id、session_id，copy 使用显式或默认工作区。返回 effective_import_mode、workspace_id、file_count、size_bytes、free_bytes、failed、originals_retained。预检无资产或 operation 写入；正式执行独立校验并枚举。 |
| `POST /assets/import` | 同预检的选择字段并增加 idempotency_key。202 返回 operation_id，受理冻结有效模式与目标；工作线程持久化文件清单。 |
| `GET /assets/imports/{id}`；`POST .../{cancel,retry}` | 按 ID 和 kind 获取阶段、取消请求、error 与 receipt。终态重试仅返回原状态；非终态由持久计划继续。 |
| `GET /assets?after=<UUID>` | 资产 ID 升序游标，每页最多 100 条，next 指向本页末项或 null。单条返回 id、name、size_bytes、mtime_ns（字符串）、session_ids、storage_mode、workspace_id；可用性另读，无名称搜索和排序参数。 |
| `GET /assets/{id}/availability` | 存在资产返回 available/reason；物理路径或 Workspace 不可读时返回可观察原因，未知资产返回 404。 |
| `POST /assets/{id}/relocate` | new_path，要求外部引用、授权目标、同大小和目标键不冲突。更新路径、名称和 mtime，返回 asset_id/relocated。 |
| `PATCH /assets/{id}/sessions` | session_id、attached:bool。重复附加/解除幂等，仅修改指定关联。 |
| `GET /fits/assets` | 独立科学候选接口，分页返回有 FITS 后缀的资产 ID、名称，由节点实际读取时校验。 |

[资产路由](../../../astrophoto/api/assets.py) · [科学路由](../../../astrophoto/api/scientific.py) · [本机边界](../../../astrophoto/api/security.py) · [共享 DTO 和错误](../../../astrophoto/api/storage.py)

### 导入、一致性与性能

预检和 import 工作线程复用来源枚举，按规范路径去重，保留可枚举失败计数；候选上限 10,000，遍历目录项保护上限 40,000。reference 复检大小、时间等文件 stat，以路径键去重，相符的已有引用可附加会话；copy 在 workspace 租约内检查空间，写拥有者标记及 .part，再有保护地发布对象，事务登记 Asset/位置/关联及回执。默认 copy 验证 `size_and_stat`；真实样本可通过测试额外对比摘要。失败处理依持久 plan、staging 和发布检查点；原件未移动。已完成项回执与登记一起提交，轮询不会继续处理，取消在适用检查点生效。成功与失败混合时可为 completed，调用方仍需读取计数。

Q-01 需定义作品内容身份，当前重绑判据不足以确认同大小文件的内容。Q-03 需决定是否跨路径查重，读全量内容会提高大目录 I/O。Q-04 需决定逐项结果的粒度与可见路径；当前记录计数和最多 100 个按序号错误。没有真实吞吐或长批次容量基准。Vue 占位后通用导入 API 由 API 验证，科学控件与背景服务独立回归。 [实际实现](04_DEV.md#06-assets) · [测试计划](05_TEST_PLAN.md#06-assets)

### 回执与恢复的边界

预检返回聚合结果，正式导入工作线程重新枚举并把清单固化到计划。回执公开 `processed`、`total`、`registered`、`copied`、`skipped`、`failed` 以及至多 100 条仅含 `entry` 和 `code` 的错误。公开回执不提供完整清单、路径与资产 ID 的对应关系。对已受理操作的查询没有复制副作用。部分失败且有其他结果时可为 `completed`，客户端必须同时检查计数。

发布前暂存由 operation 标记归属。发布状态在登记事务前持久化，恢复时重新校验副本并完成登记。已提交资产与其计数同事务写入。终态 retry 返回原状态，不能作为失败项补导接口。支持查询和重试的边界由 operation 阶段决定，恢复界面及按项结果需经 Q-02/Q-04 决定。当前资产路由没有资产删除端点，测试不能假设存在删除 API。 [导入服务](../../../astrophoto/assets/imports.py) · [操作服务](../../../astrophoto/storage/operations.py)

### 存储 v1.0 契约更新（待实施）

上文描述现有接口。受信本机来源取消额外启用和 `ASTROPHOTO_IMPORT_ROOTS` 前置，显式提交的源仍受 OS、请求来源、真实路径/链接及保护区域 guard。copy 继续在受理时固定目标，使用同卷共享配额及预留；容量不足提示手动重选。导入只在当前会话续作，已提交项保留。 [存储 TECH](../local-storage-workspaces/03_TECH.md)


## 摄影素材库 v0.7 · 技术设计

依据 [PRD v0.7](01_PRD.md#astrophoto-摄影素材库-prd-v07) 的 FR-01～23 和 [UI/UX v1.0](AstroPhoto_Assets_UI_UX_v1.0.md)。原章节保留旧合同和历史。用户确认了两份设计基线。实现以 main@f84442b 加实际工作树为起点，Workspace 和 Nodes 存在同工作树的独立改动。

| 切片 | FR | 设计与约束 |
| --- | --- | --- |
| 导入与身份 | 01–04、18–19 | Browser Copy 用原生 File / 目录选择，将文件流暂存到 Data Root，再复用 Workspace lease、capacity、Import Operation 和 no-overwrite publication。Reference 用服务端路径验证、共享保护目录拒绝和文件指纹检查。预检快照绑定设置 revision、选项和枚举结果。重复 Reference 各自有 Asset ID。逻辑注销与浏览器确认的文件删除分开，物理删除限制为专属受管导入对象。 |
| 虚拟组织 | 05–11、14–17 | 资产属性、虚拟记录和正式输出分表，保留既有资产与地址。Collection 以有序 ID 表示，串行 SQLite 写入校验唯一归属及已知条件。Project 引用在本项目唯一，可跨项目重复。虚拟父子链检查作用域与环。Session 复用 AssetSession。Project 模板是显式选项。 |
| 校准 | 10–13 | 校准 Master 从已有 Asset 登记。Flat 强制 Camera、光路、校准状态及 Bias/Dark Flat 来源。目标按用途接受多个 Master，匹配比较仅产生可见差异和确认门。关联不改 Light 校准状态。版本冲突由 revision 拒绝。 |
| 工作流 | 20–21 | 两个 V3 Source 绑定 Asset／Collection ID，分别传 IMAGE_PATH 或有序列表，交下游节点决定格式。Siril 正式输出继续在 Workspace 发布，记录 FormalOutput 文件身份和溯源，用户主动收录才加 Asset。历史已登记正式产物由 Alembic 回填 FormalOutput，保留两种路径兼容。 |
| 浏览器／Agent | 22–23 | 单 Sidebar 两个内页，复用 Vue 主题和宿主图适配。业务路由在 /astrophoto/v1/library 下。MCP 独立 FastMCP 进程需单独本地凭据，经公开 HTTP 访问，敏感写入排队等待浏览器确认。Agent 不能传 confirmed 执行，也没有物理删除入口。 |

### 复用来源

- 原生 PromptServer 路由、自己已有的 Sidebar/Tabs、搜索控件、图拖放和旧 Import Operation 继续复用。目标宿主 ComfyUI 0.46.0 同版源码的 LoadImage 会解码普通图，数据集节点限定输入目录和格式。路径节点只采用 V3 list 契约。 [原生路由](https://docs.comfy.org/development/comfyui-server/comms_routes) · [V3 Lists](https://docs.comfy.org/custom-nodes/backend/lists)
- 官方 Frontend 1.59.6 c62d747 的 AssetFilterBar、AssetsSidebarListView 和 AssetBrowserModal 使用内部 stores、i18n 和媒体／模型 DTO。本实现沿用已适配的扩展组件、列表和选择模式。 [ComfyUI Frontend v1.59.6](https://github.com/Comfy-Org/ComfyUI_frontend/tree/v1.59.6)
- 标准浏览器 File API 不提供绝对路径，宿主 v0.46.0 的原生上传适用于宿主图片输入，扩展的通用文件传输与 Reference 在本地分别校验。 [MDN 文件选择](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- MCP 测试采用 FastMCP 4.2.0 Client(server) 与 StdioTransport，工具注解仅用于发现，授权实际由服务端路由执行。 [FastMCP Testing](https://gofastmcp.com/docs/servers/testing) · [FastMCP Transports](https://gofastmcp.com/docs/clients/transports)

### 错误、并发及重试

写入以数据库事务及记录版本为边界。目录环、项目作用域、成员冲突、重复校准用途、需要确认的缺失条件均在写入前检查。导入预检失效需要重新检查，Operation 按条目保存回执并在发布点检查文件身份。文件跨端传输为有界分块，不能从 File 伪造服务器路径。MCP 的申请状态记录请求及结果，受信浏览器分别允许和拒绝。正式输出的物理文件由 Workspace 管理，收录幂等使用相同结果 ID。当前测试范围和未覆盖的宿主差异见 PH-05/06。
