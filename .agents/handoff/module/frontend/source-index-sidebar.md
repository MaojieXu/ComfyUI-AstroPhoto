# Frontend 文件地图 · 公共前端入口、宿主与共享控件

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 37 个文件。按现行工作树核对，实际运行结论见 Core 验证页。

```text
├── extension/ — 产品组装与可独立的软件 Bundle。
│   └── frontend-entry.ts — 显式把公共 Vue 层与发行中 Siril Bundle 组装。
└── frontend/ — AstroPhoto 独立 Vue 工程、构建、测试和宿主验证。
    └── src/ — 公共 Vue 前端，不依赖任何特定软件 Bundle。
        ├── api/ — 宿主 HTTP 客户端、响应校验和领域调用。
        │   ├── client.ts — 解析宿主 HTTP、超时、取消、校验错误和请求 ID。
        │   │   ├── requestJson 转发 caller signal 到带超时的内部 controller；本机路由加请求头。
        │   │   └── 解析非成功业务错误或降为状态码。finally 清除计时器和取消监听。
        │   ├── equipment.ts — 按 DTO 验证设备、关联和光路，发起受控读写。
        │   │   └── 按现有版本字段提交设备/草稿，取消信号和冲突由调用页解释。
        │   ├── fits.ts — 通过稳定 FITS 资产 ID 分页拉取候选来源。
        │   │   └── 每页校验 ID、名字和前进的 next cursor；空 next 完成，坏游标报 schema。
        │   ├── nodes.ts — 从 /object_info 构造 AstroPhoto 节点卡片。
        │   │   └── nodeCatalog 统一可发现范围，严格检查模块及稳定 ID，排除示例并保留有效端口；fetchNodes 使用不缓存的宿主请求。
        │   ├── previewSettings.ts — 保存共享预览配置，拒绝过期响应。
        │   │   └── applySettings 校验 canvas 与 revision；仅应用不旧于当前设置的响应，更新 CSS 变量并在分辨率变化发事件。
        │   ├── status.ts — 校验扩展、运行时和能力状态。
        │   │   └── 区分缺字段、网络错误和后端显式不可用。
        │   └── storage.ts — 工作区、存储设置、缓存和操作回执 HTTP 接线。
        │       └── 保留现有调用契约。Assets 导入页使用存储状态，并可导航到 Settings → Storage。
        ├── bundles/ — bundles 对应的工程文件。
        │   └── types.ts — FrontendBundle 的公共接口。
        │       └── id 确定软件设置身份，summary 和 settings 是 Vue 组件；messages 随挂载根合并，registerNodes 接收宿主上下文。
        ├── host/ — 宿主公开 API、画布和挂载生命周期适配。
        │   ├── canvas.ts — 在活动画布或子图上增加节点。
        │   │   ├── createCanvasNode 校验图就绪、可编辑、注册类型和坐标，点击用可视中心，拖放沿用 1.59.6 默认节点库的指针转换。
        │   │   └── 失败时移除部分添加节点或释放未挂接节点，finally 结束宿主变化事务。
        │   ├── comfy.ts — comfy.ts 的工程入口或配套实现。
        │   ├── dragDrop.ts — attachCanvasDrop 保存拖放会话令牌、原画布/图及世代；切图、切渲染器、刷新和拆卸可取消。
        │   │   └── readNodeDrag 校验 MIME 内容、会话和最新允许 ID。背景与适配的同层 DOM 节点可接收，控件与外域拖放交给宿主。
        │   ├── domWidgetMounts.ts — 通过公开 afterConfigureGraph 修复 Nodes 2.0 重载遗留的 AstroPhoto Widget 容器。
        │   │   └── 仅在同图、同节点、同 Widget 已有扩展元素且新元素仍未挂接时替换。保持宿主回调与原值。
        │   ├── drawing.ts — 注册稳定的 vue-basic 节点 Widget、挂载和释放画板。
        │   │   └── 保留 custom_vue_component_basic、CUSTOM_VUE_COMPONENT_BASIC、现有尺寸和原宿主 onRemove。
        │   ├── fitsSource.tsx — 独立注册 ASTRO_FITS_ASSET 和通用来源选择。
        │   │   ├── source ref 经宿主 getValue/setValue 保存及重开。可读现有资产或输入路径；只读图拒绝写入。
        │   │   └── 切换或卸载中止查询，用空/错误/就绪反馈。
        │   ├── locale.ts — 按需要跟随 Comfy.Locale 并解除轮询。
        │   │   └── 归一化宿主设置或浏览器语言，隐藏后停止同步检查；清理时取消 interval 和焦点事件。
        │   ├── mountWidget.ts — 为 DOM Widget 统一 Vue、语言和释放。
        │   │   └── 返回 dispose，在 Widget 清理时解除本次语言监听并卸载 Vue。
        │   ├── nodeBookmarks.ts — 共享宿主书签的精确路径、单次 POST 回执和失败回读。
        │   │   └── 先读服务端再按明确定义的引用增删，确认 Response.ok 后同步宿主内存；保留其他路径。
        │   └── sidebar.ts — 用原生侧栏 API 挂载和释放 Vue 根。
        │       ├── 宿主已有 astrophoto.sidebar 时提前返回。同容器 render 复用 Vue 实例。
        │       └── 换容器或 destroy 时释放轮询、Vue 根、样式 class 和 DOM。设备草稿存于同一次宿主注册的会话对象。
        ├── host.d.ts — host.d.ts 的工程入口或配套实现。
        ├── i18n/ — Vue I18n 工厂、宿主语言归一化和公共词条。
        │   ├── index.ts — index.ts 的工程入口或配套实现。
        │   ├── locales/ — 翻译资源。
        │   └── nodeDefinitions.ts — 将宿主节点与类别中文资源应用于侧栏卡片。
        │       ├── en/ — 英文词条。
        │       │   └── sidebar.json — sidebar 的结构化资源与翻译。
        │       └── zh/ — 中文词条。
        │           └── sidebar.json — sidebar 的结构化资源与翻译。
        ├── main.ts — 通过 initializeFrontend 一次接入公共界面与选定 Bundle。
        │   ├── 加载相对 CSS，先注册绘图与通用 FITS，再安装原生侧栏。
        │   └── 设置请求失败保留布局默认值。空 Bundle 列表仅跳过软件贡献。
        ├── shared/ — 跨功能通用 Vue 控件和 composable。
        │   ├── ComfyMultiSelect.tsx — 直接渲染已有 Reka 多选，映射本地 ID 与选项。
        │   ├── ComfySingleSelect.tsx — 直接渲染已有 Reka 单选并编码空值与禁用项。
        │   ├── DisclosureChevron.tsx — DisclosureChevron.tsx 的工程入口或配套实现。
        │   ├── Feedback.tsx — Feedback.tsx 的工程入口或配套实现。
        │   ├── SearchField.tsx — 基于官方 SearchInput 模式的 Reka 搜索和清空。
        │   │   └── 输入法合成中暂停防抖，清空后恢复焦点，卸载清计时器。
        │   ├── SearchOptions.tsx — 筛选与排序控件共享的可访问选择面板。
        │   │   └── 焦点移出或 Escape 收起；双态选择与筛选映射由调用页提供。
        │   ├── SidebarTabs.tsx — tablist 手动激活与键盘焦点移动。
        │   │   └── 方向键/Home/End 移动焦点，点击或键盘激活由业务守卫决定是否切页。
        │   ├── useResource.ts — 加载可取消资源，维护 loading/ready/error 和版本刷新。
        │   │   └── watch 根据加载器和 revision 重启请求；cleanup abort，过期结果不修改现行视图。
        │   └── useStoredChoice.ts — useStoredChoice.ts 的工程入口或配套实现。
        ├── styles/ — styles 对应的工程文件。
        │   ├── fits-source.css — fits-source 的样式、作用域与主题变量。
        │   ├── load.ts — load.ts 的工程入口或配套实现。
        │   ├── theme.css — theme 的样式、作用域与主题变量。
        │   └── utilities.css — utilities 的样式、作用域与主题变量。
        └── types.ts — types.ts 的工程入口或配套实现。
```
