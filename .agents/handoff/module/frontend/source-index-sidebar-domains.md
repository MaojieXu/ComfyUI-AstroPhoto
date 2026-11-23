# Frontend 文件地图 · 领域 Vue 界面与 Siril 前端 Bundle

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 62 个文件。按现行工作树核对，实际运行结论见 Core 验证页。

```text
├── extension/ — 产品组装与可独立的软件 Bundle。
│   └── siril/ — Siril 专有业务、节点、路由与前端贡献。
│       └── frontend/ — Siril 软件卡片、设置、节点交互和双语。
│           ├── api.ts — 共用命令描述请求、验证参数并按命令 ID 提交预览。
│           │   └── 校验 job ID，轮询、读取图片、校验和主动取消；失败回收 object URL。
│           ├── SirilCommandDetails.tsx — 共享中英文节点介绍、可展开语法和条件。
│           ├── SirilCommands.tsx — 用公共搜索框过滤命令，按双语分类路径显示多层目录及说明。
│           ├── SirilNodes.tsx — 按公共描述在宿主挂载 Inspector 或 CLI 日志，接收原生执行回执。
│           │   ├── nodeCreated 可早于图挂接，计时扫描只在已有 graph 时访问输入。
│           │   ├── 预览键由来源、参数、匹配的正式回执和刷新计数构成，旧 job 和 URL 随替换取消/释放。
│           │   └── 参数修改检查只读/选择模式并走宿主原生变更。卸载恢复 onExecuted、断开 observer、取消轮询。
│           ├── index.ts — 注册 Siril 摘要、设置、词条和宿主节点。
│           ├── locales/ — 翻译资源。
│           │   ├── en/ — 英文词条。
│           │   │   └── siril.json — siril 的结构化资源与翻译。
│           │   └── zh/ — 中文词条。
│           │       └── siril.json — siril 的结构化资源与翻译。
│           ├── siril.css — siril 的样式、作用域与主题变量。
│           └── SirilSettings.tsx — Siril 配置摘要、启用和发现/验证/清除。
│               └── 保留已验证路径；失败及检测到不匹配版本显示对应状态。卸载取消请求。
└── frontend/ — AstroPhoto 独立 Vue 工程、构建、测试和宿主验证。
    └── src/ — 公共 Vue 前端，不依赖任何特定软件 Bundle。
        └── features/ — 按产品场景封装页面和组件。
            ├── assets/ — assets 对应的工程文件。
            ├── library/ — 设备与光路的业务页面，共享组件可接入其它资料库。
            │   ├── components/ — 领域共用展示组件。
            │   │   ├── DetailAccordion.tsx — 资料详情折叠及可访问状态。
            │   │   ├── DetailActions.tsx — DetailActions.tsx 的工程入口或配套实现。
            │   │   ├── equipment.css — equipment 的样式、作用域与主题变量。
            │   │   ├── equipmentFields.tsx — 字段控件与错误反馈。EquipmentError 先查询存在的资料库、公共错误词条，缺省使用通用消息。
            │   │   ├── RecordRows.tsx — 接收通用行展示数据与渲染回调的资料列表。
            │   │   ├── ResourceContent.tsx — 通用资源加载、空态与错误/重试呈现。
            │   │   └── useMutation.ts — useMutation.ts 的工程入口或配套实现。
            │   └── pages/ — 领域页面和表单流程。
            │       ├── EquipmentDetails.tsx — 设备查看、归档和受限删除。
            │       ├── EquipmentForm.tsx — 设备字段编辑与提交、各规格组的详情展示。
            │       ├── EquipmentList.tsx — 设备与光路共享列表中的领域查询和分页。
            │       │   └── 以查询和版本身份检查迟到资产；翻页追加时保留独立筛选条件。
            │       ├── EquipmentPage.tsx — 设备与光路现行入口、导航、草稿恢复和版本重读。
            │       │   └── 未保存离开需宿主确认；保存中禁止离开。快速新建设备可回填光路编辑。
            │       ├── OpticalTrainDetails.tsx — 光路状态、关联设备和可读配置。
            │       └── OpticalTrainEditor.tsx — 光路草稿编辑、组件排序、版本条件和快速回填。
            ├── nodes/ — 目录搜索、收藏、画布交互和通用图像预览。
            │   ├── NodeHoverPreview.tsx — Teleported 悬停预览和侧栏相对定位。
            │   │   └── 左右位置根据宿主侧栏设置与边界决定，出滚动视窗隐藏；卸载取消 resize、scroll 与 ResizeObserver。
            │   ├── NodesPage.tsx — 搜索、分类、排序、收藏与节点交互状态。homeActivation 清详情及触发元素引用。收藏拒绝恢复宿主状态，显示收藏专用提示，允许重试。
            │   │   ├── 书签沿用宿主 Comfy.NodeLibrary.Bookmarks.V2，接受 ID 与旧目录路径；写入失败回读并提示。
            │   │   └── 可用节点集更新时替换 drop handler，关页回收计时器。搜索折叠与普通展开分别保存。
            │   ├── NodeTree.tsx — 按类别递归构造目录并绘制节点行。
            │   │   └── 文件夹扩展支持左右键；叶节点只在鼠标悬停且不拖动时挂预览，并可打开详情或写入拖放负载。
            │   └── preview/ — 候选及正式结果通用显示控件。
            │       ├── inspector.css — inspector 的样式、作用域与主题变量。
            │       ├── Inspector.tsx — 通用 Inspector，负责缩放、并排、单图与滑动比较。
            │       │   └── 未对齐时遮片禁用并回到并排。接受设置参数 VNode 与用户回调，退出后恢复焦点。
            │       ├── nodePreview.css — nodePreview 的样式、作用域与主题变量。
            │       ├── NodePreview.tsx — 挂接通用预览工具栏、状态和图像资源。
            │       └── PanelDivider.tsx — 支持鼠标和键盘的视图区分隔件。
            │           └── 指针 capture 记录初值，按容器尺寸换算比例；边界 clamp。
            ├── sidebar/ — 侧栏导航、系统和 Bundle 软件设置。
            │   ├── moduleRegistry.ts — moduleRegistry.ts 的工程入口或配套实现。
            │   ├── SettingsPage.tsx — selectedModule 为空显示模块列表，其他值挂载对应模块。返回通过 selectModule 清选择。
            │   │   └── 以 Resource 的 ready/error/loading 区分系统与能力状态；Software 容器只消费注册的模块。
            │   ├── Sidebar.tsx — 管理三标签首页与懒加载。select 等待设备或目标 Assets 编辑确认，再提交选中标签。专用导航传入 storage。
            │   │   ├── 默认 Assets；有未保存设备会话时返回 Settings。按首次访问启用 Nodes 和 Settings 数据。
            │   │   └── 离开设置先异步检查设备守卫。视图隐藏保留本次会话搜索和设置定位。
            │   ├── software.css — software 的样式、作用域与主题变量。
            │   └── SoftwarePage.tsx — 共享软件导航与 Bundle 贡献渲染。
            │       └── 按 id 选中 summary 对应设置组件；保留计划中的 PixInsight 提示。缺任一 Bundle 时仍能挂载。
            └── storage/ — 工作区登记、导入方式、操作回执和预览设置。
                ├── environment.css — environment 的样式、作用域与主题变量。
                ├── EnvironmentPage.vue — 公共预览分辨率与布局只读信息。
                │   └── 预览设置响应共享配置版本的变化。保存失败时恢复原值，冲突后可重新读取。卸载时取消读取并忽略迟到的保存结果。
                ├── format.ts — format.ts 的工程入口或配套实现。
                ├── OperationProgress.vue — 回执轮询，显示已迁移量和待清源计数，支持重试和已确认的失败目标清理。
                │   └── 800 ms 监听更新阶段/进度，卸载取消请求。终态触发共享快照刷新，区分部分完成与失败。
                ├── storage.css — storage 的样式、作用域与主题变量。
                ├── StorageError.vue — StorageError.vue 的工程入口或配套实现。
                ├── StoragePage.vue — 显示有效数据根、工作区状态及既有卷配额，提供导入方式及工作区登记。
                │   └── 服务器确认登记后刷新，工作区按后端登记顺序显示。登记失败保留输入。
                └── useStorageAction.ts — 设置操作请求、错误及卸载取消。
```


## 摄影素材库 v0.7 文件增量

```text
├── frontend/ — 当前素材库集成。
│   ├── src/ — 当前素材库集成。
│   │   ├── api/ — 当前素材库集成。
│   │   │   ├── assets.ts — 从宿主相对 HTTP 接口分页读写素材库、导入暂存、主动收录与审批。
│   │   ├── features/ — 当前素材库集成。
│   │   │   ├── assets/ — 当前素材库集成。
│   │   │   │   ├── AssetsPanel.vue — 提供 Projects、All Assets 和 Calibration Library。goHome 沿用编辑器 discardDraft，关闭编辑后回 Projects。取消或忙碌时编辑器仍在。
│   │   │   │   ├── ImportAssets.vue — 查看 Storage 策略，选择文件或目录、预检、提交并跟踪后台 Operation。
│   │   │   │   ├── AssetEditor.vue — 提供素材属性、失联原址重绑、逻辑注销和独占受管文件删除。
│   │   │   │   ├── AssetAttributes.vue — 编辑独立用途、角色、校准、阶段和观察条件字段。
│   │   │   │   ├── AssetPicker.vue — 按库查询选择已有资产。
│   │   │   │   ├── ProjectAssetsPicker.vue — 搜索多选并批量添加已登记素材至项目。
│   │   │   │   ├── LibraryEditor.vue — 编辑项目、文件夹、Collection、会话、校准资源及虚拟引用。
│   │   │   │   ├── LibraryTree.vue — 展示虚拟树、键盘导航及持续选中与展开。
│   │   │   │   ├── LibraryApprovals.vue — 展示待审 Agent 操作，请求受信用户明确批准或拒绝。
│   │   │   │   ├── LibraryError.vue — 以规则码、冲突详情与重试反馈呈现素材库错误。
│   │   │   │   ├── attributes.ts — 统一素材分类、字段规格和显示值。
│   │   │   │   ├── tree.ts — 组装虚拟层级及引用，不读取或重排物理目录。
│   │   │   │   ├── assets.css — 采用宿主语义颜色的素材侧栏、表单、树、拖放与窄宽度布局。
│   │   ├── i18n/ — 当前素材库集成。
│   │   │   ├── locales/ — 当前素材库集成。
│   │   │   │   ├── en/ — 当前素材库集成。
│   │   │   │   │   ├── assets.json — 素材库英文术语、操作和错误提示。
│   │   │   │   ├── zh/ — 当前素材库集成。
│   │   │   │   │   ├── assets.json — 素材库中文术语、操作和错误提示。
│   ├── tests/ — 当前素材库集成。
│   │   ├── components/ — 当前素材库集成。
│   │   │   ├── AssetsLibrary.test.ts — Chromium 组件覆盖素材首页、导入草稿、存储直达、素材导入、语义主题和键盘。
│   │   ├── host/ — 当前素材库集成。
│   │   │   ├── assets-host.mjs — Playwright 与真实 ComfyUI API 隔离验证素材、工作区及项目组织。
```

### 素材工具栏的宿主适配

`AssetsPanel.vue` 的 `PopoverRoot/Trigger/Portal/Content` 在搜索右侧提供排序字段、方向和分组，变更沿用 `options` 的 API 查询；筛选枚举通过 `ComfySingleSelect` 调用 `changeFilter`。空结果按当前查询、分类及过滤状态显示提示并提供 `clearFilters`。`assets.css` 的 portal 规则不依赖侧栏祖先，使用宿主语义变量。`AssetsLibrary.test.ts` 增加排序请求及 Escape 焦点恢复测试，Chromium 9 项通过；实际宿主观察范围限空库和排序弹层。

筛选按钮参考官方 MediaAssetFilterBar 位于搜索旁；打开时 `openFilters` 调用 `allDocuments('assets', {})`，`availableFilters` 从全量素材与已加载的关系生成实际存在的字段和值，选择仍通过 `changeFilter` 写入原列表查询，清除仅清除条件。加载失败显示 `LibraryError` 和重试，空库显示无选项。完整分页读取在大库可能较慢；Chromium 测试覆盖跨页、空值、错误重试、查询与键盘，真实宿主仅观察空库。

任务进度框入口：frontend/src/features/tasks/TaskPanel.vue、taskState.ts 和 tasks.css；由 Sidebar.tsx 挂载，使用 api/storage.ts 的 fetchOperations。
