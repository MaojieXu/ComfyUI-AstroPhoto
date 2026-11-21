# Frontend 文件地图 · 领域 Vue 界面与 Siril 前端 Bundle

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 44 个文件。按现行工作树核对，实际运行结论见 Core 验证页。

```text
├── extension/ — 产品组装与可独立的软件 Bundle。
│   └── siril/ — Siril 专有业务、节点、路由与前端贡献。
│       └── frontend/ — Siril 软件卡片、设置、节点交互和双语。
│           ├── api.ts — 访问 Siril 软件状态、预览作业和 PNG。
│           │   └── 校验 job ID，轮询、读取图片、校验和主动取消；失败回收 object URL。
│           ├── AutoStretch.tsx — 在宿主 Widget 挂载 AutoStretch 预览和参数。
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
            │   └── AssetsPlaceholder.tsx — AssetsPlaceholder.tsx 的工程入口或配套实现。
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
            │   ├── NodesPage.tsx — 搜索、分类、排序、收藏与节点交互状态。收藏拒绝恢复宿主状态，显示收藏专用提示，允许重试。
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
            │   ├── SettingsPage.tsx — 显示设置入口与能力，挂载环境、存储和资料库。
            │   │   └── 以 Resource 的 ready/error/loading 区分系统与能力状态；Software 容器只消费注册的模块。
            │   ├── Sidebar.tsx — 单侧栏三标签与请求范围。
            │   │   ├── 默认 Assets；有未保存设备会话时返回 Settings。按首次访问启用 Nodes 和 Settings 数据。
            │   │   └── 离开设置先异步检查设备守卫。视图隐藏保留本次会话搜索和设置定位。
            │   ├── software.css — software 的样式、作用域与主题变量。
            │   └── SoftwarePage.tsx — 共享软件导航与 Bundle 贡献渲染。
            │       └── 按 id 选中 summary 对应设置组件；保留计划中的 PixInsight 提示。缺任一 Bundle 时仍能挂载。
            └── storage/ — 工作区、缓存、后台操作回执和预览环境。
                ├── CacheSettings.vue — 保存缓存路径/限额和清理。
                │   └── 路径和限额保留本地草稿直到服务器确认，清理依赖宿主 Delete 确认。
                ├── environment.css — environment 的样式、作用域与主题变量。
                ├── EnvironmentPage.vue — 公共预览分辨率与布局只读信息。
                │   └── 更新保留版本字段。冲突后重新获取，保留合法草稿，卸载取消读和存储返回的迟到 UI 更新。
                ├── format.ts — format.ts 的工程入口或配套实现。
                ├── OperationProgress.vue — 可中止的回执轮询和终态刷新。
                │   └── 800 ms 监听更新阶段/进度，卸载取消请求。终态触发共享快照刷新，区分部分完成与失败。
                ├── storage.css — storage 的样式、作用域与主题变量。
                ├── StorageError.vue — StorageError.vue 的工程入口或配套实现。
                ├── StoragePage.vue — 绑定原工作区、缓存和迁移入口，组合共享操作反馈。
                │   └── 服务器确认 mutation 后刷新。版本冲突可重读并保留缓存草稿。
                ├── useStorageAction.ts — useStorageAction.ts 的工程入口或配套实现。
                └── WorkspaceActions.vue — 工作区重命名、变更位置、迁移、删除确认及默认位置操作。
```
