# AstroPhoto React Sidebar — 实施与验证

**当前语言设置：** Sidebar 始终跟随 ComfyUI 的 `Comfy.Locale`，主题跟随宿主颜色变量。
设置页不再提供独立语言选择与主题说明，旧的 AstroPhoto 语言偏好不影响当前界面。
下文涉及独立语言设置、手动覆盖及其测试的描述属于历史记录。

**2026-11-17 更新：** 画板工作流像素恢复与中文 `vue-basic.pen-tooltip` 已修复。
原生 DOM Widget 的 getValue/setValue 保存/恢复 `{image, canvasDataURL}`；PNG 内置于工作流，
执行时 serializeValue 仍只返回 `{image}`，上传路径与 Python 节点不变。
旧工作流已经保存为空值时无法找回丢失像素，但仍可绘图并重新保存。
损坏 PNG 显示可翻译错误，重新绘图可恢复；加载时不会将临时白底覆盖已保存 PNG。
验证：TypeScript、构建、check:build 通过；Vue Chromium 9 tests 通过。
`COMFYUI_TEST_URL=http://127.0.0.1:8188 pnpm -C frontend test:host --skip-image-execution`
通过 16 项检查（含真实 PNG 工作流重载），明确跳过 IMAGE 执行。
用户要求不修复 IMAGE 路径问题；下文“两处既有失败”为 2026-11-16 的历史记录，
其中像素恢复已由本次验证取代，IMAGE 问题保留。原始 host-evidence.json 已更新为最新结果。

软件仍为 v0.0.1。依据用户提供的 FRD v1.0 与 Technical Guide v1.1（2026-11-16），
完整读取两份附件后实施；原文未修改。本文记录实际代码，不将设计示例视为验证证据。

## 范围与工程决策

只注册一个 `astrophoto.sidebar`。Nodes / Assets / Settings 始终可切换，默认 Assets；
通过 Settings 标签打开设置。七个设置模块共用信息页，不增加 Experiments、
Workflow 管理、业务数据库或第二个 Web Server。关闭交给原生 Sidebar 按钮。

主导航移植了 ComfyUI Frontend 1.59.1
[媒体资产栏的 TabList / Tab 布局](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/AssetsSidebarTab.vue#L47-L53)。
标签按内容宽度靠左排列，使用宿主的选中背景、前景色和焦点颜色。方向键及 Home / End
移动焦点，Enter 或空格确认切换。在 535×955 的真实宿主视口对比验证了位置、尺寸、间距和颜色。
节点和素材标签共用标题右侧的刷新图标，分别重新读取 AstroPhoto 节点列表和素材服务状态。

节点目录按 ComfyUI 的分类路径生成树。每个以 `/` 分隔的分类段对应一级文件夹，默认收起，
可独立展开，搜索会展开匹配路径。目录使用宿主的箭头、文件夹行样式和每级 24px 缩进。
节点行仍可打开详情、拖放或通过加号添加到画布。
悬停节点行时，侧栏外显示节点缩略图、现有描述和输入／输出类型。预览使用 React Portal，
根据侧栏位置选择画布一侧，并在视口边缘调整位置。离开、切换标签或开始拖放时关闭。
缩略图由节点目录元数据构成，不需要实例化节点或运行 Widget。
两页共用单行搜索、筛选和排序工具栏。节点按真实分类筛选，可在原始顺序和名称排序之间切换。
素材支持选择帧类型和保存排序偏好，真正筛选和排序素材记录仍需要素材服务。

当前仓库不是独立 React Template，因此使用 `frontend/ui/`，没有改写 reference 模板、
Vue 组件、V3 节点、MCP 或后端业务源码。复用模板的 React 18 / TypeScript / Vite /
i18next / Jest / RTL 技术组合，未复制其 window.app 轮询、Bottom Panel、清空命令或静态路由。

一个 `frontend/package.json`、`pnpm-lock.yaml`、Vite 配置；Jest 只测试 React，保留 Vue
的 Vitest 浏览器测试。`frontend/entry.ts` 先导入 Vue 注册，再导入 React 注册。
构建只产生 `js/main.js` 与 `js/assets/main.css`，沿用已有 Vue 样式加载器；
React / Vue 各自初始化和卸载。React 语言包内置，Vue 仍使用根 locales。

```text
frontend/
├── entry.ts
├── package.json / pnpm-lock.yaml / pnpm-workspace.yaml
├── vite.config.mts / vitest.config.mts / tsconfig.json
├── jest.config.cjs / eslint.config.mjs
├── src/                         # 保留 Vue Widget
├── tests/                       # 保留 Vue 浏览器测试
└── ui/
    ├── tsconfig.json
    ├── check-build.mjs           # 单入口、CSS、相对资源路径检查
    ├── host-runtime.mjs          # 显式选择真实宿主的隔离浏览器验证
    └── src/
        ├── main.tsx
        ├── app/App.tsx
        ├── host/
        │   ├── comfy.ts
        │   ├── sidebar.tsx       # registerSidebar，render/destroy
        │   ├── settings.ts       # AstroPhoto.UI.Language
        │   ├── locale.ts         # 可见时检测宿主语言；销毁时清理
        │   ├── canvas.ts         # createCanvasNode；1.59.1 版本适配
        │   └── dragDrop.ts       # 只接管自己的 MIME 和真实 canvas
        ├── api/
        │   ├── client.ts         # getJson：宿主 fetchApi、取消、10 秒超时
        │   ├── status.ts         # parseStatus / fetchStatus
        │   └── nodes.ts          # nodeCatalog / fetchNodes
        ├── features/
        │   ├── nodes/             # NodesPage.tsx、NodeTree.tsx、NodeHoverPreview.tsx
        │   ├── assets/AssetsPage.tsx
        │   └── settings/
        │       ├── SettingsPage.tsx
        │       └── moduleRegistry.ts
        ├── shared/
        │   ├── useResource.ts
        │   ├── Feedback.tsx
        │   ├── SearchField.tsx
        │   ├── SearchOptions.tsx
        │   └── useStoredChoice.ts
        ├── i18n/
        │   ├── index.ts
        │   └── locales/{en,zh}/main.json
        ├── styles/theme.css
        └── __tests__/
            ├── setupTests.ts / hostMock.ts / fixtures.ts
            ├── navigation.test.tsx
            ├── i18n.test.tsx
            ├── lifecycle.test.tsx
            ├── search.test.tsx
            ├── api.test.ts
            └── canvas.test.ts
```

## Requirement → Component → API → Test → Status

| 需求 | 实现 / API | 验证 | 状态 |
| --- | --- | --- | --- |
| 三主视图、默认 Assets、同一 Settings 状态 | App；hidden 保留视图状态与滚动 DOM | navigation + 真实宿主 | IMPLEMENTED |
| 搜索、分类折叠、节点详情 | NodesPage；GET /object_info，按 python_module / 既有 ID 归属过滤 | catalog、IME、navigation、真实 vue-basic | IMPLEMENTED |
| 节点添加 / 拖拽 | host/canvas、dragDrop，当前 canvas.graph | Jest + 真浏览器拖动、Undo/Redo、Subgraph | IMPLEMENTED（固定版本适配） |
| 资产搜索/帧筛选/会话区/空态 | AssetsPage；Status capabilities | navigation + 真实宿主不可用状态 | IMPLEMENTED（空能力 UI） |
| 真实资产列表、详情、导入、素材拖拽 | 需要资产服务与 Asset Source Node | 不发虚构 assets 请求；导入禁用 | BLOCKED |
| 七模块说明页与返回 | moduleRegistry、SettingsPage；真实 Status | 每模块 RTL + 实际点击 | IMPLEMENTED |
| 自动/中文/英文、持久化、动态跟随 | i18next、原生设置、自有 onChange、可见时 500ms 检测 | key 一致性、RTL、宿主刷新恢复与语言变更 | IMPLEMENTED |
| 明暗、窄宽、键盘 | scoped CSS、原生 token、Tab 方向键 | RTL、Light/Dark、280/650 CSS 宽度、截图 | IMPLEMENTED；真实浮动布局与浏览器 200% 缩放 UNVERIFIED |
| 单 JS 入口 / CSS / 代理路径 | Vite inlineDynamicImports；相对 app/api URL | /extensions、CSS 200、check-build | IMPLEMENTED；真实反向代理部署 UNVERIFIED |
| 完整 Vue PNG→IMAGE、像素重载 | 未改变原有源码 | 真实宿主发现两个既有失败，详见下文 | BLOCKED |

模块显示：Software、Equipment & Optics、Observing Sites、Knowledge、Memory & Privacy、
Agent Context & MCP 为 Planned；System Status 部分实现并读取真实 capability。
状态 API 失败不会显示已连接；MCP 诊断存在不代表 Agent 在线。

## API 核验与差异

- 官方公开接入：`app.registerExtension`、`registerSidebarTab`、`getSidebarTabs`、
  `render(container)` / `destroy()`、`setting.get/set`、`app.api.fetchApi`。
  [Sidebar 文档](https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs)、
  [v1.59.1 类型](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/types/extensionTypes.ts)。
- `GET /object_info` 与 `/astrophoto/v1/status` 在运行的 Backend 0.45.0 实测。
  后者是本扩展接口；无 assets / sessions 生产 API。
- 本地 1.59.1 类型包将扩展 Setting ID 错限于核心 `Settings` 键，
  `host/settings.ts` 仅对 ID 做窄类型断言；运行时注册、读写与刷新恢复已验证。
- Canvas 内部适配：运行时 `window.LiteGraph` 存在；旧 scripts/litegraph.core.js 404，
  不使用该路径，也不把 window.LiteGraph 标为稳定公共 API。
  `createNode` / `graph.add` 使用当前图，检查 read_only/selectOnly/allow_interaction。
  仅 graph.beforeChange/afterChange 无法记录撤销；真实测试失败后改为同时使用
  canvas.emitBeforeChange/emitAfterChange，Undo/Redo 再次通过。
  [固定版本 createNode](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/utils/createNode.ts)、
  [Canvas 事件](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/lib/litegraph/src/LGraphCanvas.ts)、
  [ChangeTracker](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/scripts/changeTracker.ts)。
- 自有拖拽 MIME 只携带版本、kind、稳定 nodeId，校验为本扩展已发现节点；
  只在 canvas 元素接管，不全局阻断其他文件拖拽。取消和非法负载不创建实例。
- 不导入宿主 Pinia；语言跟随采用可清理的低频读取。手动覆盖只写 AstroPhoto 设置。
- 自带 SVG mask 图标，避免依赖宿主是否编译某个 Lucide 类。唯一根外 CSS 为专用图标类。

## 版本与命令

新依赖精确锁定 React/ReactDOM 18.3.1、i18next 23.16.8、react-i18next 14.1.3、
plugin-react 4.4.1、Jest/jsdom 29.7.0、RTL 16.3.0、ts-jest 29.3.4、ESLint 9.27.0、
typescript-eslint 8.46.1。后者支持已存在的 TypeScript 5.9.3，peer 检查无冲突。
Vue 3.5.13 / PrimeVue 4.3.3 / Vite 6.3.5 / 类型包 1.59.1 保持。
包管理器只有 pnpm，未引入 package-lock。ESLint 与部分既有依赖有维护期警告；
未借本次任务升级整套 UI 框架。

从仓库根目录：

```powershell
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test:react
pnpm -C frontend test
pnpm -C frontend check:build
uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q
uv run python scripts/release.py registry
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
pnpm -C frontend test:host
```

CI 增加 React/Jest、ESLint 和构建清单检查，保留 Vue Vitest 与原双包流程。
`test:host` 不进入无宿主 CI：会使用隔离浏览器、临时工作流、执行小型 PreviewImage，
在 finally 恢复被测试的语言/主题设置；不改用户已打开浏览器的图、不写服务器工作流库。
它会产生 ComfyUI temp PNG / 执行历史及 `.artifact/react-sidebar/` 证据。

## 实际结果与未通过项

- TypeScript/vue-tsc、ESLint 通过；Jest/RTL 30 tests；原 Vue Chromium 6 tests。
- 根 Python 测试在指定真实宿主 URL 时 23 passed（含真实状态/节点 HTTP 检查）；
  其余节点单元仍是 test doubles，不等于 IMAGE 执行。
- Vite 输出一个 main.js（约 786 KB，gzip 185 KB）及 main.css（4.45 KB）。
- Registry 重新构建、21 文件检查通过，包含新前端产物，不含 ui 源码。
  既有 MCP wheel 14 / sdist 20 文件复查通过，本次未重新构建或改动 MCP。
- 真宿主：Conda `comfyenv`，Python 3.12.16，Torch 2.14.1+cu130，RTX 4090 D；
  Backend 0.45.0 / Frontend 1.59.1。不是 Anaconda base 3.12.4 / Torch 2.3.0。
- 宿主 Sidebar 检查、动态语言/持久化、主题、节点创建/撤销/拖拽/子图、单入口/CSS 已通过。
  工作流 `graphToPrompt → JSON → handleFile` 验证结构重载；不是服务器 Save/Save As 菜单验收。
- **test:host 当前退出 1，诚实保留两个既有失败：**
  1. `nodes/ComfyUIFEExampleVueBasic.py:24` 预解析 `[temp]` 后，`:25` 将绝对 temp 路径
     传给宿主 LoadImage；后者再次按默认 input 目录解析，触发路径边界 ValueError。
     应在单独的后端修复中保留带注释引用直接委托 LoadImage，并补真实宿主测试，不能放宽宿主路径校验。
  2. 原 Vue Widget 没有把画板像素恢复到重开的 Canvas；实测黑色像素重载后变为白色，
     工作流 widgets_values 为空串。应单独修复持久化/恢复协议并兼容旧工作流。
  两处源码本次未修改，原 Mock 测试通过不能覆盖这些问题。历史“宿主无法启动”结论
  来源为错误 base 环境，现已由 comfyenv 实测取代，但 IMAGE 完整验收仍未通过。

原始证据：`.artifact/react-sidebar/host-evidence.json`、`image-execution-failure.json`、
`workflow.json`、`sidebar-light.png`、`sidebar-dark.png`。历史交接原件保持原样。
未测试：真实反向代理部署、浮动 Sidebar、浏览器 200% 缩放、服务器工作流保存对话框。
不宣称 Assets P2、业务配置、Memory/RAG 或 MCP Canvas Bridge 已实现。
