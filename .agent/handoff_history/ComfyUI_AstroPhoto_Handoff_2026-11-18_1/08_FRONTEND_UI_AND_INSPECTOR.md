# 前端、Vue Widget 与 Inspector

## 侧栏和输入控件

- frontend/entry.ts 是唯一构建入口，导入 Vue 与 React。main.tsx 注册 Sidebar 和科学节点插件。host/sidebar.tsx render/destroy 重用同容器 root 并清理旧监听。App.tsx 的 Nodes/Assets/Settings 主 Tab 保留各页状态，Assets 为默认。主题使用 Comfy 变量；React Locale 订阅宿主，Vue 在挂载时取值。
- NodesPage 和 NodeTree 从 object_info 列出此扩展节点，并过滤 examples 类别，支持搜索、排序、类别、展开、提示与点击/拖拽添加。host/canvas.ts 与 dragDrop.ts 防只读、错误区域及未知节点，失败时结束图变更。没有增加一个远程画布编辑工具。收藏通过 NodesPage.tsx:16–81 共享宿主 Comfy.NodeLibrary.Bookmarks.V2，保留其他节点和目录条目，活动时每 500ms 同步，失败恢复宿主状态或显示错误。真实收藏写入未重跑。
- Settings 页实装 Storage、Software、Equipment、Environment、System Status，并展示 Knowledge、Memory、Agent Context 规划页。观测地和 General 行已移除。Assets 有真实资产列表、导入预检和任务状态，Capture Sessions 面板可列出当前资产关联的会话标识，但尚未形成会话详情浏览或编辑。
- Equipment 与 Optical Train 共用 DetailAccordion、DetailActions、Comfy 风格控件。设备建档、专业规格、引用跳转、编辑归档删除。光路组件按真实顺序，滤镜多选，多设备可从编辑器新增，单配置和引用显示。有些归档设备和删除失败需要参见 [业务缺口](09_STORAGE_ASSETS_EQUIPMENT.md)。
- 复用的 vendor Vue SingleSelect、MultiSelect 由 React bridge createApp 挂载和卸载，官方修改点、依赖和样式在 frontend/src/vendor/comfyui/README.md。Jest 将这两套 Vue 选择器替换为测试组件，Keyboard/focus/弹层真行为不能从该替身推定。
- Vue DrawingBoard 与 DrawingApp 提供画笔、橡皮、画笔颜色/大小、触摸/鼠标及清屏、Canvas 像素保存还原。VueExampleComponent 实际序列化先上传 PNG，成功返回 temp 路径，异常返回 image:null。Chromium 的真实 Canvas/模拟宿主上传断言见 [测试矩阵](06_TEST_COVERAGE_MATRIX.md)。

## 科学节点

host/scientific.tsx:36–46 跟踪相连上游及同一来源/参数的正式结果。NodeView:68–115 在参数、输入、手工刷新、分辨率环境设置变化后发新请求，400ms debounce，AbortController 防旧响应并释放 Blob URL。展开状态和 Inspector 打开用于 TTL/validate 轮询（:117–135），不是请求 effect 依赖；开发者需要区分隐藏期间仍处理输入变更与仅打开窗口触发重算。

NodePreview 提供单张主图、折叠、刷新与大图入口。EnvironmentPage 和 api/previewSettings 管全局 PNG：512/1024/2048/4096/full；默认 1024，画布 480×320 上限与节点宽度协调。正式 FITS 不受该设置压缩。

Inspector 与主预览共用最新图像，提供并排、单图、对齐时擦拭比较、平移缩放、分区 resize 和键盘输入。失配禁用擦拭，关闭后恢复原焦点。通用组件位于 frontend/ui/src/features/nodePreview/Inspector.tsx，历史 features/siril/Inspector.tsx 是重导出兼容层。用户确认 Inspector 可以修改当前节点的 shadowsclip、targetbg、linked，也可重置。实际 NodeView 通过 updateParameters 和 graph change 更新画布，同一组参数驱动候选预览。单色输入禁用 linked，宿主 read_only/selectOnly 时拒绝写入。通用 Inspector 的 JSDOM 展示用例未覆盖上述编辑链。本期不纳入 Trial 管理。

## 验证差异

[本轮日志](06_TEST_COVERAGE_MATRIX.md) 区分 React 默认配置、临时 CSS 映射、Vue Chromium、代理模拟应用和真实宿主 GET。通用 host-runtime.mjs 仍含旧资产 unavailable 与观测地断言并写 Comfy 设置，应先更新测试或在授权的隔离宿主重跑。当前分辨率写入回执、图像失败降级、窄栏主题/动态 locale、多节点竞争及复杂 subgraph 均需按具体证据确认。

