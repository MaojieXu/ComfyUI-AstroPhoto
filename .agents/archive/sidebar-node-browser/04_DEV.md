# 侧栏与节点浏览 · 开发规格与当前实现

**v1.2 · 2026-11-21 · PH-04C 实现回填，验收执行前**
**输入** [PRD v0.14](01_PRD.md) · [TECH v1.1](03_TECH.md) · [UI/UX](02_UI_UX.md) · Feature Pipeline Prompt 04A、04B
**源码基线** `f84442be5f16dd36f6cfff85a686ce30027dd383`。下文路径以仓库根为基准。现有行为来自静态走读，宿主历史证据的范围见 [测试报告](06_TEST_REPORT.md)。

## 1. 实施范围

沿用现有 Vue Sidebar、共享资源/搜索控件、宿主设置和可选 Bundle 接口。集中修改目录、收藏、画布桥接和必要的交互状态。可沿用现有文件，只有宿主专用适配确有隔离需要时才新增模块。主流程走 ComfyUI 浏览器入口。无需改 V3 节点契约、后端领域 API、SQLite、MCP、绘图 Widget 或 FITS/Siril 处理。各切片完成后回写实际符号、分支和测试入口。

## 实现回填

后续函数卡中标为“现行”的文字保存实施前基线，本表记录本轮工作树实际改动。

真实子图故障注入发现，移除部分插入节点后宿主 `state.lastNodeId` 仍前进，`ChangeTracker` 比较 `definitions` 时会生成一条无节点变更的历史。适配仅在节点已清理、宿主计数仍等于该次新分配值时恢复插入前计数，之后结束宿主原生事务。并行素材调用的 `configure` 回调保持在插入前。

| 切片 | 代码与现行行为 | 待验 |
| --- | --- | --- |
| 目录与刷新 | `api/nodes.ts` 统一产出可发现集合。响应校验 ID 与 name、已安装包模块名和示例。坏字段逐端口忽略，非对象顶层仍报 schema。模块名取自身宿主静态入口 URL，脱离宿主的开发环境默认标准包名。历史 `vue-basic` 作为示例保留宿主注册及工作流兼容，在侧栏即使缺类别和模块字段也排除。目录请求 no-store；`useResource.refresh` 同步撤下 Nodes 旧资源并 abort，迟到结果按 signal 忽略。 | 改名部署及反序请求。 |
| 收藏 | `host/nodeBookmarks.ts:setNodeBookmark` 先 GET 权威值，再精确更新单条引用，等一次宿主 POST 的 HTTP 回执。1.59.6 的 legacy `app.ui.settings.settingsValues` getter 返回宿主活跃设置对象，成功后同步共享值；失败后用 HTTP 校验的 GET 回读。适配不可达时引导用户用原生库。NodesPage 操作期间禁止重复写，NodeTree 叶按原始路径增删。 | 原生库实时同步、HTTP 失败、路径隔离。 |
| 画布 | `canvas.ts:createCanvasNode` 使用宿主 canvas.graph、可视中心和指针换算，校验注册、编辑和节点归属。同版原生默认库实测没有额外标题偏移，已移除旧路径偏移。 `dragDrop.ts:attachCanvasDrop` 匹配本次会话令牌、目标快照及当前目录资格，监听宿主 graph 和 renderer 变化；配置图的宿主 hook 提升世代。有效位置为画布和同父 TransformPane 非控件区域。 | 双画布及原生对照以测试报告为准。 |
| 导航与只读交互 | `Sidebar.tsx:select` 串行等待守卫，卸载时隔离迟到结果。Settings 卡片使用资源状态，领域配置状态仍归领域。NodesPage 恢复列表滚动及详情焦点；NodeHoverPreview 支持鼠标预览 Escape，不截断宿主事件。 | 焦点和真实宿主导航。 |

## 2. 现有符号与逐函数实施规格

### A. 挂载、导航和会话（FR-01/05，D-01/03/08/15/16）

| 文件与现存符号 | 当前调用顺序与副作用 | 实施/保留与退出条件 |
| --- | --- | --- |
| `extension/frontend-entry.ts` → `frontend/src/main.ts:initializeFrontend` → `frontend/src/host/sidebar.ts:registerSidebar` | 初始化样式和节点；宿主 setup 注册唯一 Tab。先查 `getSidebarTabs`，此后闭包持有草稿及 Vue App。同容器直接返回，换容器先 `destroy`，再创建元素、接语言监听、挂载。destroy 清监听、卸载 App、删元素与容器类。 | 保持注册 id 和卸载契约。核实宿主关栏实际是否调用 destroy、重复 setup 和换容器是否只保留一组监听。以宿主发布的只读主题/语言为来源。 |
| `frontend/src/features/sidebar/Sidebar.tsx:Sidebar/NodesView/SettingsView` | 从 `equipmentSession.current` 决定 Settings 或 Assets。首访通过 visited flag 懒挂载，其后用 hidden 切换。Nodes 加载 `fetchNodes`；Settings 加载 status 与保留旧数据的 storage。主标签异步等待设备 guard。 | 保持懒载和 Assets 默认。重挂载检查有效会话恢复、普通浏览重置和宿主图无变；对守卫同时存在的连续导航，同一 Settings 离开守卫只保留一个在途确认。等待期间忽略重复激活，确认完成后检查发起页面及组件是否仍有效再提交；释放时使待完成操作失效。不要联动改 Storage 的 keepData 行为。 |
| `frontend/src/shared/SidebarTabs.tsx:SidebarTabs`、`frontend/src/host/locale.ts:watchLocale` | 标签支持 roving tabindex、方向键/Home/End 移焦和原生按钮激活。语言监听由宿主注册闭包持有。 | 实测键盘、焦点保留、中英和主题切换。复用现有控件，修复只针对验收偏差。 |
| D-19 · `Sidebar.select`、`NodesPage.homeActivation`、`AssetsPanel.goHome`、`SettingsPage.selectedModule` | 激活主标签时先沿用设备守卫。Nodes 清详情和旧触发元素引用，Assets 复用编辑器的 `discardDraft` 再选择 Projects，Settings 默认模块为空。导入快捷路径传 `storage`，不关闭源导入编辑器。 | 同一激活动作等待确认期间忽略重复激活。取消后保持当前标签；下次用素材顶层标签仍按现有规则处理草稿。组件懒载及节点过滤状态继续沿用。 |
| `frontend/src/features/sidebar/SettingsPage.tsx:SettingsPage`、`frontend/src/features/sidebar/SoftwarePage.tsx:SoftwarePage`、`frontend/src/features/assets/AssetsPanel.vue` | Settings 展示模块及能力，恢复设备优先；Storage/Environment 用 storage，Equipment 用 status，Software 结合 Bundle。软件页渲染实际 Bundle 和禁用的计划项；旧迁移基线的 Assets 曾呈现占位。现行共享侧栏通过 AssetsPanel 提供 Projects、All Assets 和 Storage 导航。 | 按 TECH 的信号表映射资源 Loading/Error、入口可用和规划。配置状态由现有 Bundle 自己解释；公共层保持通用 unavailable 兜底。无 Bundle 下不发起 Siril 专属请求。 |
| `frontend/src/features/library/pages/EquipmentPage.tsx:EquipmentPage/leave/discardAndLeave` | watch 同步保存 dirty 草稿到 session。忙状态挡离开；dirty 时询问，取消返回 false；确认后清草稿，再切页。scope dispose 撤销 guard，dirty 时才装 beforeunload。 | 保持设备和光路流程。验证所有在 AstroPhoto 内的离开入口，保存异常保留输入；宿主销毁实例只是会话终止，正式保存仍由既有 API 返回。无需新增全局草稿库。 |

### B. 目录、检索和详情（FR-02/04，D-04/08/09/10/12/13）

1. **`frontend/src/api/nodes.ts:fetchNodes/nodeCatalog`。** 现行 `fetchNodes(signal)` 调 `getJson('/object_info', signal)`；`nodeCatalog(unknown)` 抛出顶层 schema 错误，按模块筛行，`name`、input/output 类型不合时外抛且整批失败。选定保留 `getJson` 的请求、取消与状态边界，参照官方定义识别，再把记录级校验、归属与示例排除集中到转换边界，返回唯一 `NodeCard[]`。单条不符合宿主最小识别条件时排除；能识别但端口缺损时安全略去不可解释端口，继续保留合法元数据和其他有效节点。有效空响应与整次 HTTP/JSON/网络异常必须区分；顶层非对象或数组按共享客户端 schema 错误呈现，合法空对象是空目录。
2. **`NodeCard` 输入输出。** `id` 为宿主稳定键；`name` 需通过官方识别，和稳定键不一致时以实际注册性核查。输出 `title/description/category: string`，`aliases: string[]`，`inputs/outputs: [name: string, type: string][]`。现行缺标题用 ID，缺说明/分类为空，别名只取字符串；required/optional 转端口，数组规格标 COMBO，未给输出名用位置序号。保留可解释缺省，已知的元数据不被臆造或补成其他端口。兼容例外仅是 `vue-basic` 缺少模块；由于其示例分类，不可由 AstroPhoto 目录创建。验证官方 V3 模块标识是否覆盖实际 Bundle 部署。
3. **`frontend/src/shared/useResource.ts:useResource/refresh`。** Vue watch 依赖 loader 与 revision，发请求时注册 AbortController 清理，回调仅在 signal 未取消时写 Ready/Error。Nodes 当前用默认 `keepData=false`，但 revision 和 DOM 的更新随 Vue 调度。若触发刷新到状态生效间仍可调用旧交互，则在 Nodes 入口同步撤销资格，并在提交当下重查。检查 cleanup、网络异常和旧请求乱序。详情进入 Loading/Error 即隐藏，恢复后从新集合重新解析；若原 ID 消失清掉当前失效选择。旧成功/拖放反馈不得盖住目录错误。
4. **`frontend/src/features/nodes/NodesPage.tsx:NodesPage/handleSearch/updateExpansion`。** 使用 Ready 数据导出统一允许 ID 集合，并由同一集合构建目录、查详情、解析书签和设置 drop 资格。现行目录在 render 排除 examples，而资源 watch 用未排除的完整数据。移除双重范围；实际点击处理也重新查当前状态和 ID。保留分类多选、名称排序或原顺序、搜索自动展开及手动折叠；搜索不缩小产品创建资格，实际启动拖放的行须来自可见 UI。保留同实例查询和滚动，Observed：当前全部已选分类失效时回到不过滤，部分失效时仅应用仍有效的分类。以 FR-02.4 允许的回退方案明确保留该行为，同时使工具栏显示实际生效条件。
5. **`frontend/src/shared/SearchField.tsx:SearchField`、`useStoredChoice.ts:useStoredChoice`。** 现行 composition 期间阻止查询更新，结束后走已有 180 ms debounce；清除恢复检索输入焦点；排序读取白名单，localStorage 失败回退。保留复用接口，核对 i18n 后分类/别名仍正确匹配。
6. **`frontend/src/features/nodes/NodeTree.tsx:buildNodeTree/NodeTree/NodeLeaf` → `NodeHoverPreview.tsx:NodeHoverPreview`。** 目录按分类段建树，保留 ID，显示可去 AstroPhoto 前缀；行点击进入详情，鼠标 pointerenter 打开只读浮层，离行、失活、详情或拖放清除。Teleport 监听滚动/resize 及 ResizeObserver，析构需清除三者。在节点行保存触发源引用，区分普通目录与书签路径。详情挂载后的 nextTick 聚焦返回按钮。关闭详情后等列表可用再聚焦原行，失效则聚焦搜索。仅在悬停预览存在期间监听 Escape，收起并释放监听，保留当前焦点；重新 pointerenter 才复开。验证长文本、窄栏、触摸、滚出区域和主标签隐藏。查看详情只消费最新 NodeCard，不调用工厂或执行。

### C. 收藏（FR-02，D-02/07/14）

- **`NodesPage.tsx:readBookmarks/isBookmarked/toggleBookmark`。** 当前 `readBookmarks()` 从宿主 getter 保留字符串，活动页轮询。当前状态把 `id` 与 `category/id` 合并判断，切换时可能同时移除两个路径，调用 set 后先更新 UI；异步失败读 getter，同步异常仅记错误。改为目录动作只处理完整顶层 `id`，收藏树动作使用该行的原始路径。先重读最新宿主值、校验当前 Ready ID，再判断 add 或 remove；对存在性相同的重复 add/remove 不额外写。单页串行提交、等持久化结果后确认选中状态，失败按实际可用的权威设置回读恢复。成功依据为该次宿主 POST Response.ok，失败或结果未知时经服务端 GET 回读并验证 HTTP/内容，再恢复 UI，不以本地 getter 兜底成已落盘。其他标签/窗口修改仍依赖宿主，记录真实竞态。
- **`NodesPage.tsx:favoriteNodes` → `NodeTree.tsx:buildNodeTree/NodeLeaf`。** 当前按路径最后段查节点，把路径前缀改写到展示 category 后从失去原路径的 NodeCard 推回移除。拟调整为每个书签叶子单独携带原始引用，渲染键/操作按实际引用，节点内容按 ID。沿用树形展示；收藏文件夹路径与普通目录路径的显示规则独立，避免剥离同名真实收藏目录。尾斜杠标记与外域、失效引用保持在宿主原值；没有当前定义时不渲染叶子。同 ID 的顶层与多个文件夹互不影响。
- **宿主前置证据。** 1.59.1 类型包声明 api.storeSetting 和 api.getSetting，1.59.6 实现返回 POST Response、GET 解析 JSON。保留一次宿主写入及共享内存同步契约，不能用先直接 POST 再调用 setter 的双写方案。写入口集成先验证能同时观察回执和同步原生收藏；无法满足时沿用原生入口并记录 D-14 缺口。不要照抄宿主同时删两路径的 toggle 行为。失败状态保留重试机会，不发明跨窗口事务、批量删除或收藏数据库。 [TECH](03_TECH.md)

### D. 主图、子图与拖放（FR-03，D-05/06/11/17）

- **`NodesPage.tsx:add(id)`。** 现在直接调 `createCanvasNode` 后写成功反馈。目标先检查当前活跃页面、最新 Ready、允许 ID 和宿主能力；然后恰好一次委托，经宿主回执判定成功。若缺少可达创建能力，显示可理解的原生节点库路径，保持状态与历史。
- **`frontend/src/host/dragDrop.ts:writeNodeDrag/readNodeDrag/attachCanvasDrop`。** 当前 `writeNodeDrag(DataTransfer,id)` 写 MIME 及 v1/kind/nodeId，`readNodeDrag(text,allowed)` JSON.parse 并校验字段与允许集合。现行 capture 阶段用 event target 等于 canvas 元素做命中，匹配后立即接管并调用创建。目标顺序为自有 MIME → 有效会话与当前 Ready/允许 ID → 可确认的活动画布/工作流身份与有效投放目标 → 宿主位置与权限 → 单次委托。在开始时保存宿主工作流、图、Canvas 对象和目录世代，任一切换立即注销会话；提交时再比较活动身份并复核 Ready/allowed，防止仅凭相同 DOM 元素或切回原工作流放行。拖放取消、dragend、刷新、切出 Nodes、重挂载及销毁清会话，普通文件或其他拖放不得被扩展拦截。需短期会话标识以校验动作时留在页面内存。
- **`frontend/src/host/canvas.ts:createCanvasNode(id,point?,host?,factory?)`。** 现行读当前 canvas.graph、权限位和全局 LiteGraph 注册表；点击以 DOM 元素中心转坐标，拖放用原坐标转换，未应用官方 y 标题偏移。非有限坐标拒绝。写入顺序 `beforeChange`、`emitBeforeChange`、factory、赋 pos、graph.add、change，异常尝试 remove/onRemoved，finally afterChange/emitAfterChange。前置通知异常路径和清理异常后的历史均缺运行证据。工程选用现有薄适配，按同版本原生行为修正目标、坐标和历史。`LGraphNode` 返回是成功候选，确认挂在目标图之后才显示成功。依 TECH 的四种现有错误和底层异常分流。1.59.6 复验是启用条件。交接宿主完成副作用，避免同步事件抛错后再走另一个创建路径。禁用不能安全支持的单项动作，并使用原生节点库引导。没有可达能力的动作不能用当前直接写图桥接宣称等价。
- **边界。** 开发用窗口可做隔离注入/故障诊断。产品路径不暴露图写入调试口。D-17 按已通过的组合登记支持，类型包版本和检查属性存在仅作为技术线索。

## 3. 拒绝、回读和副作用

| ID | 条件与规则源 | 检查与反馈 | 副作用/恢复 | CASE |
| --- | --- | --- | --- | --- |
| R-01 | 非目标模块、隐藏示例或失效 ID（D-13） | 目录转换和点击/drop 提交前双重约束来源与当前状态 | 不建立图实例，不写收藏。被卸载书签原引用保留 | 02/06/07 |
| R-02 | 请求失败、超时、旧请求迟到、页面销毁（D-09/12） | useResource 与 NodesView 状态，区分取消及错误 | Loading/Error 禁止使用旧目录，Retry 开新请求 | 01/02/04 |
| R-03 | 引用已增/已删、宿主设置读写失败（D-14） | 写入前按准确路径及宿主值计算，失败给收藏提示 | 等回执再确认，失败由权威读取恢复，保护其他路径 | 06 |
| R-04 | 外域类型、自有载荷 JSON/版本/kind/ID 无效、拖放取消、目标变化（FR-03.3/5） | dragDrop 命中及提交 guard，普通拖放交还宿主，非法或取消不创建 | 清会话，节点、连线、历史与其他图保持 | 07 |
| R-05 | 图未就绪、不能交互、只读、仅选择、无注册或无效坐标（FR-03.5） | 宿主原生 guard 优先，适配无法判定时不调用写入口 | 不改变图，恢复可编辑后由用户重新操作 | 03/07 |
| R-06 | 创建返回空或抛出、宿主挂载缺能力（D-05/11） | 检查 LGraphNode 的归属；按 TECH 的 CANVAS_UNAVAILABLE、NODE_NOT_REGISTERED、INVALID_POSITION、GRAPH_ADD_FAILED 或底层异常反馈，缺能力才显式降级 | 不自动重放，核对失败前后图差和下一次 Undo/Redo | 03/07 |
| R-07 | 草稿 dirty、保存中或错误（D-15/16） | Equipment guard 先判忙，再等待确认；失败由业务错误反馈 | 取消或保存失败保留输入，明确丢弃才清会话内草稿 | 01/05 |

未为节点 ID 和路径新增长度/数量限制，输入约束来自宿主定义、浏览器 MIME 及真实注册集合。保留当前 API 请求超时作为实现事实。测试中新增数据只在隔离实例里操作。

## 4. 实施与验收顺序

| 顺序 | 完成条件 | 对应用例 |
| --- | --- | --- |
| 1 | 确立唯一 Ready 目录与取消资格。同步检索、详情和预览的状态边界。 | CASE-01/02/04/07 |
| 2 | 核实宿主设置持久接口，再实现精确路径、状态回读、保留失效引用。 | CASE-06 |
| 3 | 修正并复验既有薄适配，落实双画布添加、拖放和逐动作降级。 | CASE-03/07 |
| 4 | 串查导航、设备/光路守卫、模块状态和生命周期清理。 | CASE-01/04/05 |
| 5 | 回填实现差异，根据实际代码定稿测试计划、补缺失测试，再集中回归。 | [测试计划](05_TEST_PLAN.md) |

工程核实项包括薄适配的同版原生对照、覆盖层及失败后宿主历史。收藏、改名安装和子图历史的已执行范围以测试报告为准。已确认的 PRD 决策继续沿用。
