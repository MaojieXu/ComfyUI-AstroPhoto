# 侧栏与节点浏览 · 技术设计

**v1.1 · 2026-11-21 · PH-03 技术设计已编制**
**输入** [PRD v0.15](01_PRD.md) · [交互规格](02_UI_UX.md) · Feature Pipeline Prompt 03、04A
**工作树证据** AstroPhoto HEAD `f84442be5f16dd36f6cfff85a686ce30027dd383`。本专题文档有未提交编辑。本次相对 HEAD 的相关工作树差异包含 `tests/integration/test_equipment_api.py` 的设备 PRD 路径调整，归于设备专题；前端、宿主脚本和追踪构件的历史差额见 [证据基线](06_TEST_REPORT.md#基线映射)。PRD 中的 `4c0cf4d` 加迁移工作树属于历史参考基线。

## 1. 环境与所有权

| 项目 | 核对结果和来源 |
| --- | --- |
| AstroPhoto | `pyproject.toml` 0.0.1。宿主加载 `js/main.js`、`js/assets/main.css`。 |
| 前端 | `frontend/package.json` 与锁文件。Vue 3.5.42、Reka UI 2.11.0、Vue I18n 11.4.23、Vite 8.2.2、TypeScript 6.0.3、pnpm 11.13.1。宿主编译类型包 1.59.1。 |
| 宿主 | Backend 0.46.0、Frontend 1.59.6 是验收目标。历史环境为隔离 Windows、Python 3.12.16、CPU Torch 2.15.0。运行时版本和支持结论以每次实测为准。 |
| 所有权 | 宿主拥有节点注册、活动工作流及子图、坐标、编辑权限、变更历史、保存、重开和执行；扩展拥有侧栏展示、浏览状态和自有拖放载荷。 |

[开发环境](../../../docs/development.md) · [迁移测试报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

扩展通过 `extension/frontend-entry.ts` 组装公共模块与可选 Bundle，`initializeFrontend` 注册宿主扩展。Sidebar 是宿主 Tab 内的 Vue App，Nodes 和 Settings 首访才加载；Assets 由 AssetsPanel 接入摄影素材库，作为默认视图时加载 Projects。该 Feature 无独立后端表、文件目录、工作流 schema 或 MCP 写画布接口。保留现有稳定节点 ID、序列化、绘图 Widget 与 FITS/Siril 业务边界。

D-19 沿用 `SidebarTabs.select` 的按钮激活路径。Sidebar 持有 Settings 当前模块，默认激活时传空值，导入快捷入口传 `storage`。Nodes 通过激活信号只关闭详情。Assets 先沿用编辑器离开流程，再选择 Projects。守卫完成前不提交目标标签。ComfyUI Frontend v1.59.6 宿主侧栏的 `onToggle` 管理宿主侧栏开关，AstroPhoto 内部导航沿用自身标签组件。

## 2. 模块与数据流

| FR | 入口与现状（Verified，静态） | 目标契约 |
| --- | --- | --- |
| FR-01 | `host/sidebar.ts` 注册 `astrophoto.sidebar`，同容器幂等，换容器或 destroy 时释放 Vue App 和语言监听；`Sidebar.tsx` 隐藏已访问的非活动面板 | D-01/08/15。宿主单入口；同实例保留 Nodes 搜索、筛选、展开及滚动，销毁重建恢复默认。注册闭包中的草稿优先进入 Settings，否则 Assets。 |
| FR-02 目录 | `api/nodes.ts` → `api/client.ts:getJson` → `app.api.fetchApi` → `GET /object_info` → `useResource` → `NodesPage` | D-09/12/13。一份 Ready 可发现集合同时驱动树、详情、收藏解析及两种添加入口。用户搜索/筛选形成显示子集，模块归属与示例排除决定创建资格。 |
| FR-02 收藏 | `NodesPage` 通过宿主 `extensionManager.setting.get/set` 读取共享字符串数组，活动页每 500 ms 回读 | D-02/07/14。目录按钮仅操作顶层 ID；收藏树按原始路径移除。过期或外域引用保留原值且本页隐藏。 |
| FR-03 | `NodesPage` / `host/dragDrop.ts` → `host/canvas.ts:createCanvasNode`；现行桥接直接调用 LiteGraph 及图变更方法 | D-05/06/11/17。按动作验证宿主入口，复用原生创建语义；仅经目标版本验证的薄适配可作为中间路径，能力不足时安全引导到原生节点库。 |
| FR-04 | `NodeTree` → `NodeHoverPreview` 或 `NodesPage` 详情；预览通过 Teleport 渲染 NodeCard | D-04/10。详情/预览只读，键盘触屏走详情。稳定 ID 与真实端口可追溯；缺字段可降级显示。只有已就绪且仍可发现的详情能发起添加。 |
| FR-05 | `SettingsPage` → Storage、Environment、Equipment、Software、System 和规划入口；`EquipmentPage` 管理离开守卫 | D-15/16/18。AssetsPanel 按活动视图读取素材库；Settings 表示实际能力。领域保存由既有服务负责。Bundle 缺失时公共面板仍工作。 |

## 3. 接口、状态与持久化

### 节点目录

- **来源。** 宿主 `GET /object_info` 返回按稳定节点 ID 索引的原始定义。已注册且可浏览与运行依赖就绪是两个状态。展示名称、翻译、描述、分类、别名及端口只用于展示、检索和详情。以响应键作为现行 UI ID；遇到响应键与宿主定义名称冲突时必须核对该定义是否可由宿主实际创建。
- **归属。** 当前标准模块值为 `custom_nodes.ComfyUI_AstroPhoto`，`vue-basic` 缺少模块字段时保留历史兼容识别。归属识别之后排除顶级 `examples` 示例，再建立当前允许集合。0.46.0 的 V3 加载器根据目录生成 `RELATIVE_PYTHON_MODULE`，故改名部署可能失配。按真实部署响应确认可接受标识；缺少可信映射时排除并记录，不以分类、标题、宽模糊匹配或独立节点清单认领。
- **来源选择。** 沿用 `getJson('/object_info', signal)`，底层复用 `app.api.fetchApi`。公开类型中的 `api.getNodeDefs()` 在目标源码中直接读 JSON，未检查 `Response.ok`，不接收取消信号；`app.fetchNodeDefs()` 带状态和定义转换，但不接收信号，已有预取可能影响显式刷新。当前选择保留取消、逐次请求与状态分类。`registerNodesFromDefs` 改变宿主注册状态，目录只读。 [官方 api.ts](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/scripts/api.ts#L1300)
- **解析。** 宿主会按条目记录定义生成错误并返回其余节点。消费侧优先复用可达的官方定义处理；按宿主最小识别条件接收节点，可选展示字段和无法解释的端口信息安全降级，单项不能让其他有效节点失去展示。整体失败与有效空目录分别呈现。保留共享客户端的 HTTP、JSON、网络、超时、取消与顶层 schema 契约，非对象或数组顶层进入 Error。这是相对官方 toNodeDefs 返回空映射的明确适配差异。
- **状态转换。** 首访或刷新 → Loading，撤下旧目录、详情添加、旧预览和拖放资格；最新请求成功 → Ready（空目录或查询无结果分别显示）；失败 → Error 与重试，旧数据无可用入口。请求替换或组件释放时取消旧请求，迟到成功/失败无权更新当前状态。保留当前查询等同实例浏览条件，成功后依据新目录重新求值。
- **持久化。** `AstroPhoto.Nodes.Sort` 使用现有 localStorage 白名单 `original/alphabetical`，读写失败回退会话。搜索、筛选、展开、滚动与选中 ID 属于页面；工作流 JSON 只承载宿主创建后的图，侧栏浏览动作不写入。

### 共享收藏

- 输入为宿主键 `Comfy.NodeLibrary.Bookmarks.V2` 的字符串数组。顶层 `id`、文件夹中的 `folder/id`、带尾斜杠的文件夹标记分别保留。路径以原始字符串为引用，分类重命名或显示翻译不改写已有路径。
- 内容解析使用 ID 找到当前允许集合中的节点；界面层可再按查询/筛选缩小展示。失效引用隐藏，重新注册同 ID 后重新解析。
- 单页写入按宿主当前值计算差集，只操作明确的完整路径。串行化本页写入，等待真实保存结果后更新显示。写失败按可验证宿主权威读取路径恢复显示并提供错误，不能把宿主可能已乐观更新的内存 getter 当作落盘确认。保留其他模块、文件夹和异常但无须改动的原始值。多窗口并发无原子写保证，实测并披露。
- 上游书签 `toggleBookmark` 会删除路径并尝试删顶层项，和 D-14 精确语义有差异。复用宿主设置协议、路径解析和精确删除语义。1.59.1 类型包 `index.d.ts:1239/1247` 声明 `api.getSetting` 和 `api.storeSetting`。1.59.6 源码证实后者返回 POST Response，`Response.ok` 是 HTTP 成功回执，前者是服务端回读入口但直接解析 JSON，失败恢复需用带 HTTP 校验的等价 GET 或校验实际回读。宿主 setting store 先更新本地再提交，await setter 不能直接当作成功。实施中须验证一次写入后可同步宿主内存和 AstroPhoto 显示，避免二次 POST；若无法满足则保留原生收藏入口，并登记 D-14 验收未通过。 [官方设置 API](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/scripts/api.ts#L1684)

### 节点添加与拖放

**1.59.6 默认库实测修正。** 原生节点库的默认树从拖放指针转换直接建立位置，经典与 Nodes 2.0 均无额外标题高度。旧 GraphCanvas 的 `useCanvasDrop` 对其 Pragmatic 拖放分支增加标题高度，与默认树是两条路径。本专题适配目标是实际默认库。 [默认库坐标来源](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/composables/node/useNodeDragToCanvas.ts#L71)

AstroPhoto 详情中的明确添加按钮使用宿主创建服务的无落点默认值，即可视中心。默认节点库的树行双击经过指针放置，两者分别用无坐标和有坐标语义验证。两种入口都应创建恰好一个节点并保持当前主图或子图归属。

- **工程路径。** 1.59.1 声明面及已核实的 1.59.6 官方源码未提供稳定的公开“向当前宿主工作流按位置添加”入口；内部创建服务只作行为对照。选定复用并修正现有 `createCanvasNode` 薄适配，成功回执为已挂到目标图的 `LGraphNode`。现有 guard/错误为 `CANVAS_UNAVAILABLE`、`NODE_NOT_REGISTERED`、`INVALID_POSITION`、`GRAPH_ADD_FAILED`；底层异常另外传播。为 1.59.6 复验落点、活动图、权限与原生历史。适配缺能力或不满足原生语义时，对该动作引导原生节点库。D-06、D-11 的产品状态维持 Inferred。
- **点击。** 当前 Ready ID → 宿主可创建性、活动图和权限检查 → 选定薄适配；位置以原生可视区域中心为对照。
- **拖放。** 现行私有 MIME `application/x-astrophoto-resource+json`，JSON 载荷 `v: 1`、`kind: "node"`、`nodeId: string` 和一次拖放的 `token`。验证版本/类型/ID、当前 Ready 资格及来源交互有效性。拖放会话中若图、画布或目录世代失效，按目标宿主同类动作核验并防止误写；仅接管有效自有落点。开始与提交时核对同一活动工作流、图、画布和目录世代，同时要求 Nodes 活跃；任何切换都使旧拖放失效，即使公用同一 canvas 元素或又切回来。保留当前画布背景命中为已证实入口，覆盖层以同版原生节点库实测命中决定，禁止穿透控件；按默认原生路径转换缩放和平移后的坐标，不添加旧路径标题偏移。取消/外域拖放不进入创建。
- **拒绝。** 图未就绪、只读、仅选择、禁止交互、未注册、非法坐标以及目标已变更时，图与历史不得产生额外变化。宿主原生创建成功后才给成功反馈。超出能力或版本适配失败时按动作停用直接添加，提供宿主原生节点库路径；引导不等于创建成功，也不在异常提交后自动再尝试写入。
- **历史。** 不持有第二份 Graph、撤销栈或保存生命周期。失败补偿、重试、撤销和重做要由宿主记录证据确认。现行 `beforeChange/afterChange` 通知和本地回收分支的存在只说明静态调用路径。

### 页面与设备会话

`EquipmentSession.current` 为注册闭包内存，供设备和光路编辑恢复。生效取决于草稿、宿主当前能力和组件是否可挂载。用户在应用内离开时经现有保存中/丢弃确认守卫；用户取消则保留输入。卸载后同注册实例可恢复，刷新或注册完全销毁后未提交草稿随实例消失。正式保存由现有 API 和业务存储处理。初次 Assets 可以存在全局预览设置请求，验收只对素材业务请求断言为零。

### Settings 状态来源（AC-05.3）

| 来源 | 目标展示 |
| --- | --- |
| 对应资源 Loading/Error | 加载或请求失败和重试。 |
| 模块无实现或无 Bundle | 规划项显示尚未实现；未装配的软件页显示不可用，公共入口仍可打开。 |
| `status.capabilities` 的 `available` | 仅表示模块接入可用性。`not_registered`、`local_storage_disabled` 或其他显式失败表示不可用，未知 reason 保留通用不可用，不按自由文字猜测。 |
| Bundle 自有状态 | Siril 的未配置取现有 `SIRIL_NOT_CONFIGURED`，可在 `processing.reason` 或软件详情 `state` 观察。无效路径、需要重新验证走软件详情的现有已知错误；disabled 独立表示停用。软件配置入口可打开与科学执行就绪可同时不同。公共 Sidebar 不硬编码 Siril，也不改领域 API。 |

## 4. 官方实现和采用方式

以下固定标签源码于 2026-11-21 读取。两仓库标签的 LICENSE 均为 GPL-3.0。使用原生运行入口和行为参照，目前未引入需要离线保存的第三方源码片段。内部 Pinia、Pragmatic DnD 和服务导入依赖宿主 Vue 上下文，扩展可达性与稳定性仍需实测。

| 官方实现 | 可用性与取舍 |
| --- | --- |
| [Backend server.py v0.46.0](https://github.com/Comfy-Org/ComfyUI/blob/v0.46.0/server.py#L892) · [nodes.py](https://github.com/Comfy-Org/ComfyUI/blob/v0.46.0/nodes.py#L2316) | 直接使用宿主目录 API。后端逐条捕获、记节点名和 traceback；模块名来自 V3 注册路径。 |
| [Frontend app.ts v1.59.6](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/scripts/app.ts#L308) | `toNodeDefs` 筛除缺少字符串 name 的条目，翻译分类；`fetchNodeDefs` 非 2xx 返回状态，网络/JSON 拒绝传播。该转换与后续宿主注册阶段是不同边界，未承诺后续注册也按条目容错。 |
| [原生节点库](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/sidebar/tabs/NodeLibrarySidebarTab.vue) · [创建服务](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/services/litegraphService.ts#L914) · [原生 Drop](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/composables/useCanvasDrop.ts#L20) | 原生点击默认使用可视区域中心，服务选 activeSubgraph 或当前 graph；旧 GraphCanvas 投放入口包含标题偏移，1.59.6 默认节点库实测直接采用指针转换。不同画布和活动图的实测用于确定可安全复用路径。 |
| [书签 Store](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/stores/nodeBookmarkStore.ts) · [设置 Store](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/platform/settings/settingStore.ts#L185) | 路径解析和精确删除可参照。上游先本地应用再调持久化 API，调用失败需实测扩展实际看到的状态与回读路径。 |

## 5. 失败、并发和资源

| 条件 | 状态与恢复 | 可观察证据 |
| --- | --- | --- |
| HTTP、网络、超时、JSON 请求失败 | 目录进入 Error，撤销旧交互资格；显式重试。现行共享客户端默认 10 秒。 | 状态码、错误类别、请求时序，避免输出完整用户载荷。 |
| 请求重叠、切页或销毁 | 最新活动请求提交结果；析构清理监听、AbortController 及预览资源。 | 反序响应、换容器、重复挂载和迟到拒绝。 |
| 收藏设置写入失败/外部同时改动 | 当前页串行，等待宿主回执与可验证回读；已保存的其他路径保持。 | 写请求结果、宿主 getter 与持久状态差异、刷新后状态。 |
| 错误目标、失效载荷、权限拒绝或创建异常 | 校验前拒绝或服从宿主处理；失败后检查节点、连线及历史。 | 目标图与非目标图前后快照，紧接的原生 Undo/Redo。 |
| Bundle/能力未就绪或保存失败 | 公共 UI 可用，Settings 如实呈现状态；设备/光路回执失败时保留输入。 | 页面状态、请求、已提交数据。 |

目录处理规模由宿主节点数、有效 AstroPhoto 节点和收藏路径数决定。只采集节点定义大小、下载/转换/首显、查询至更新、滚动、收藏同步和两类画布拖放延迟，无数值 SLA。现行树构建和收藏逐项查找应以测量决定是否优化。输入来自本地宿主及浏览器事件，节点说明按普通文本渲染。无新数据权限。

## 6. 交付切片与验证

1. **目录/资源生命周期（FR-01/02/04）。** 固化解析边界、统一可发现集合、刷新不可用窗口及销毁清理。以成功、部分失效、错误和乱序响应核验。
2. **收藏（FR-02）。** 验证宿主设置写入和权威回读，再接精确路径操作。只改目标引用，验证同 ID 多路径及失败回读。
3. **宿主创建（FR-03）。** 在目标版本核实既有薄适配的目标、坐标和历史，按已确定的保护条件修正。仅在能力缺失或出现无法修正的原生语义差异时按动作降级。只在同版原生对照经过验证后承诺支持。
4. **导航、详情与会话（FR-01/04/05）。** 核对浏览状态、焦点、触屏、资源释放、设备/光路守卫及 Bundle 边界；完成现行实现差异与回归。

D-06、D-11 仍是由宿主原则推导的技术路径。薄适配在 1.59.6 的等价性、宿主收藏内存同步和失败回读、部署改名后的模块值、双画布失败后的历史都是工程核实项。交付依次进入 [DEV](04_DEV.md) 与 [TEST PLAN](05_TEST_PLAN.md)，测试证据补齐后更新支持矩阵。
