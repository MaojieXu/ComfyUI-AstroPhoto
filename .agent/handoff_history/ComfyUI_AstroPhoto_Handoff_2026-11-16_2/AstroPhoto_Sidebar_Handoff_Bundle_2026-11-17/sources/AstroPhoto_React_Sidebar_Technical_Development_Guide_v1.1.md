# AstroPhoto React Sidebar — 技术开发规范与官方 API 核验

> **文档版本**：v1.1（开发设计稿；非软件版本）  
> **编制日期**：2026-11-16（America/Chicago）  
> **目标宿主**：ComfyUI Backend **v0.45.0** / Frontend **v1.59.1**  
> **目标工程**：`ComfyUI-React-Extension-Template/ui/` 的 AstroPhoto React Sidebar 方案  
> **设计依据**：已提交的《AstroPhoto React Sidebar 前端需求规格 v1.0》、用户界面草图、官方文档与固定版本源码  
> **范围**：本文件主文只设计 **`ui/` 前端架构**；Python V3 / HTTP 只给接口契约和最小示范，不修改整个 AstroPhoto 仓库的后端、MCP、数据库布局。  
> **证据级别**：**[F]** 已在官方文档或指定 tag 源码中核验；**[D]** 本文推荐设计；**[P]** 产品未来接口，尚不存在；**[H]** 必须在真实宿主测试后才能判定。  
> **特别注意**：原工程交接显示当前实际实现为 Vue 3 Widget + V3 Python 节点。本文为**React Sidebar 目标方案**，不表示 Vue 已迁移、素材 API 已实现或真实宿主验收通过。

---

## 0. 先给工程结论

1. 使用**一个** ComfyUI Sidebar Tab，Tab 内固定 **Nodes / Assets / Settings** 三个主视图；顶部齿轮只是 Settings 快捷入口。首开 Assets。切换页面不更换工作流。
2. 采用 **React + TypeScript + Vite + react-i18next**；不复用宿主 Vue/PrimeVue 实例，不把 React 组件注入 ComfyUI Vue 组件树。
3. 采用 **Host Adapter + Features + UI Shell** 的轻量分层：`host/` 封装宿主 API，`api/` 封装 HTTP，`features/` 管 Nodes/Assets/Settings，`app/` 管导航与组合。
4. **Node Library** 的真值来自 ComfyUI 已注册 Node Def，`app.getNodeDefs()` 或 `GET /object_info`；不可将未实现的 Siril/Load FITS 节点写成真实可用。
5. **Asset Library** 从 AstroPhoto 业务接口读索引；每个 Asset 拖出时创建**固定 Node Class 的实例**，将 `asset_id` 设为 Widget 参数。不是每文件注册一个 Node Class；不直接把 FITS 转 PNG 冒充原始科学数据。
6. Canvas 继续由 ComfyUI 管理，Workflow 继续原生保存。React UI 不直接维护 workflow JSON 副本，亦不自行注册 Python Node。
7. Settings 初版实现语言选择与**七个真实可点击的模块说明页**；设置的“可发现”与功能的“已实现”严格区分。无效功能应显示规划中、禁用或解释，不出现假执行。
8. 双语 `zh/en` **随前端 JS 一起打包**，而不是继续使用模板全局 `/locales/` 路由。这是对官方模板的有意改善：只有两个小语言包时，内置更简单、避免命名冲突且兼容代理子路径。
9. **构建只输出一个可作为扩展入口的 JS 模块**；不要让 Vite 的 vendor chunk 被 ComfyUI `/extensions` 扫描为第二个扩展入口。CSS 跟随构建显式加载；必须以构建产物检查确认。
10. 每次称为“官方标准”的函数均标注来源。**Sidebar 侧跨区域拖入 Canvas 并创建节点没有被官方封装为一个完整的稳定高阶 API**；低层 LiteGraph 集成必须放在一个版本隔离文件中并接受真实 1.59.1 宿主测试。

### 0.1 官方模板与推荐方案的区别

| 主题 | 官方 React Template（当前 main） | AstroPhoto 的决定 |
|---|---|---|
| 启动 | `window.app` 等待/轮询后直接注册 Tab | [D] ESM 导入 `app`，在 `app.registerExtension({ setup })` 内注册 Tab |
| Sidebar 类型 | `type:'custom', render` | [F] 1.59.1 还支持可选 `destroy()`；严格管理 React Root |
| 图标 | 示例 `pi pi-code` | 使用宿主可用的 Lucide 类；必要时自带图标 CSS/SVG |
| 语言资源 | `public/locales/` + `/locales/...` | [D] `src/i18n/locales/` 内置双语 bundle，动态切换 i18next |
| 类型包 | 示例声明 `@comfyorg/comfyui-frontend-types:^1.20.2` | 对齐当前宿主的 **1.59.1** 类型快照；不盲目沿用模板旧版本 |
| 构建 | `/scripts/...` external + vendor 分块 | 单扩展入口、显式资源路径和代理前缀验证 |
| 附加示例 | About/Bottom Panel、运行/清空工作流命令 | 全部不纳入 AstroPhoto Sidebar |
| Python 示例 | V1 的 `NODE_CLASS_MAPPINGS = {}` | **不能覆盖现有的 V3 `comfy_entrypoint()`**；本文仅给前端契约 |

来源：[R1] [R2] [R3] [R4] [R5]。

---

## 1. 前端最终目录树（推荐冻结版）

标记：`★` P0 必要；`+` P1/P2 依据真实能力增加；`T` 官方模板已有、需要保留或调整。这里**只展开 `ui/`**。

```text
ui/
├── src/
│   ├── main.tsx                         ★T 唯一 Extension 注册入口
│   ├── app/
│   │   ├── App.tsx                     ★T 三视图 Shell，React 层级入口
│   │   ├── navigation.ts               ★ 主视图/子页状态模型
│   │   └── App.css                     ★ 主布局、三段导航、滚动区域
│   │
│   ├── host/                             ★ 只能在此访问 ComfyUI 宿主
│   │   ├── comfy.ts                     ★ 宿主 app/api 获取与就绪检查
│   │   ├── comfy-shims.d.ts             ★ `/scripts/app.js` 等类型声明
│   │   ├── sidebar.tsx                  ★ registerSidebarTab + React mount/unmount
│   │   ├── settings.ts                  ★ 轻量宿主设置注册/读写
│   │   ├── locale.ts                    ★ Comfy.Locale 读取与同步策略
│   │   ├── canvas.ts                    + Node 创建/选中/Widget 赋值
│   │   └── dragDrop.ts                  + HTML5 DnD → Canvas 适配
│   │
│   ├── api/                              ★ 本地 HTTP 的唯一出口
│   │   ├── client.ts                    ★ `app.api.fetchApi`、异常封装
│   │   ├── status.ts                    ★ GET /astrophoto/v1/status（当前）
│   │   ├── nodes.ts                     + node defs 读取/规范化
│   │   └── assets.ts                    + 未来资产接口，不伪造响应
│   │
│   ├── features/
│   │   ├── nodes/
│   │   │   ├── NodesPage.tsx            ★ 搜索、分类、空状态
│   │   │   ├── NodeList.tsx             ★ 列表（纯展示）
│   │   │   ├── NodeRow.tsx              ★ 行、点击详情、添加按钮
│   │   │   ├── NodeDetails.tsx          + Node 参数/端口说明
│   │   │   ├── nodeCatalog.ts           + 宿主 defs 到视图模型的映射
│   │   │   └── useNodes.ts              + 加载、搜索、错误态
│   │   ├── assets/
│   │   │   ├── AssetsPage.tsx           ★ 素材空态/导入入口位置
│   │   │   ├── SessionTree.tsx          + Capture Session 树
│   │   │   ├── AssetList.tsx            + 素材列表
│   │   │   ├── AssetRow.tsx             + 单素材/拖动/添加
│   │   │   ├── AssetDetails.tsx         + 元数据与状态
│   │   │   ├── assetTypes.ts            + Asset/Session DTO 与判别类型
│   │   │   └── useAssets.ts             + 远端加载/缓存/错误
│   │   └── settings/
│   │       ├── SettingsPage.tsx         ★ 基础设置 + 模块目录
│   │       ├── ModuleInfoPage.tsx       ★ 七模块通用说明页
│   │       ├── moduleRegistry.ts        ★ 静态模块 ID、i18n key、功能说明
│   │       ├── ModuleList.tsx           ★ 可点击的模块目录
│   │       └── LanguageSelector.tsx     ★ auto / zh / en
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── PrimaryTabs.tsx          ★ Nodes / Assets / Settings
│   │   │   ├── SidebarHeader.tsx        ★ 标题、齿轮、关闭
│   │   │   ├── SearchField.tsx          ★ 带组合输入保护
│   │   │   ├── EmptyState.tsx           ★ 空/禁用/错误的文案 UI
│   │   │   └── StatusText.tsx           ★ 不伪造 available
│   │   ├── types.ts                     ★ View/Result/Availability 类型
│   │   └── errors.ts                    ★ 可诊断 UI Error
│   │
│   ├── i18n/
│   │   ├── index.ts                    ★ i18next 单例与双语规范化
│   │   └── locales/
│   │       ├── zh/main.json            ★ 中文全量 key
│   │       └── en/main.json            ★ 英文全量 key
│   │
│   ├── styles/
│   │   ├── theme.css                   ★ ComfyUI design tokens 映射
│   │   └── components.css              ★ 紧凑通用列表/焦点/滚动
│   │
│   ├── __tests__/
│   │   ├── setupTests.ts              ★ Jest / RTL / polyfill
│   │   ├── fixtures.ts                 ★ 测试模拟数据；绝不进入生产列表
│   │   ├── navigation.test.tsx         ★ 导航/返回/焦点
│   │   ├── settings.test.tsx           ★ 七模块说明与设置
│   │   ├── i18n.test.tsx               ★ 中英相同 key/切换/回退
│   │   ├── lifecycle.test.tsx          ★ 单 Tab/React Root 卸载
│   │   ├── api.test.ts                 ★ 200/404/500/超时/坏 JSON
│   │   ├── node-catalog.test.ts        + 真实 defs 映射
│   │   ├── canvas.test.ts              + 新建/回滚/Widget
│   │   └── drag-drop.test.tsx          + 取消/错误格式/放置
│   │
│   └── vite-env.d.ts                   T Vite 类型
│
├── package.json                        T 一套 npm scripts
├── package-lock.json                   T 唯一依赖锁（选择 npm 时）
├── vite.config.ts                      T 仅一个 Vite 配置
├── tsconfig.json                       T 源代码类型检查
├── tsconfig.node.json                  T 配置文件的 TS 设置
├── jest.config.js                      T 仅一个 Jest 配置
├── eslint.config.js                    T 仅一个 ESLint flat config
├── .prettierrc                         T 统一格式
└── README.md                           + 前端开发/构建/宿主验收
```

### 1.1 对模板文件的迁移映射

| 模板原位置 | 推荐位置 | 行动 |
|---|---|---|
| `src/main.tsx` | `src/main.tsx` | 保留文件名，重写注册逻辑 |
| `src/App.tsx` | `src/app/App.tsx` | Shell 组合，不能膨胀成所有业务实现 |
| `src/App.css` | `src/app/App.css` | 只放 Shell 版式 |
| `src/index.css` | `src/styles/theme.css` 等 | 删除全局污染；所有规则限定根类 |
| `src/utils/i18n.ts` | `src/i18n/index.ts` | 保留 i18next，不再发起全局 locale HTTP |
| `ui/public/locales/*` | `src/i18n/locales/*` | 两语言内置；不复制成额外公网资源 |
| `src/setupTests.ts` | `src/__tests__/setupTests.ts` | 同时修改 Jest setupFilesAfterEnv 引用 |
| `src/__tests__/dummy.test.tsx` | 真实测试文件 | 删除虚假覆盖 |
| 双份 Vite/ESLint/Jest 配置 | 各一种 | 避免入口与选项不一致 |

### 1.2 为什么这样划分

- `host/` 是**版本兼容边界**：宿主从 1.59.1 升级后，优先只改这一个目录。
- `api/` 是**请求边界**：不允许 React 页面自己拼 URL、做不一致的状态判断。
- `features/` 是**用例归属边界**：Nodes、Assets、Settings 解耦；不根据后端 8 个 FR 创建 8 个前端 Tab。
- `shared/` 只放实质上复用的控件，不创建复杂的内部 Design System。
- **不引入 React Router/Redux/第二个独立 Web App**：三个主视图 + 单层 Settings 子页，`useState/useReducer` 足够；缓存列表只在接入真实 API 时再决定是否采用数据请求库。
- 模块描述通过 `moduleRegistry.ts` **数据驱动**，不为七个未实现领域创建空组件。

---

## 2. 依赖方向与组件职责

```text
                        src/main.tsx
                             │
               host/sidebar.tsx  (官方注册 + Root 生命周期)
                             │
                         app/App.tsx
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
            NodesPage   AssetsPage   SettingsPage
                 │           │           │
           nodeCatalog     Asset DTO   moduleRegistry
                 │           │           │
            host/comfy    api/assets   host/settings / i18n
                 │           │
              ComfyUI    AstroPhoto API
              /object_info
                 └───────────┬───────────┘
                             ▼
                    host/canvas + dragDrop
                             ▼
                   ComfyUI Graph / Workflow
```

**禁止依赖**：`features/*` 不直接 `window.app`、`LiteGraph` 或 `fetch('/...')`；`api/*` 不依赖 React；`host/*` 不导入具体列表组件（`sidebar.tsx` 作为组合例外）；`shared/*` 不依赖功能域；`i18n/*` 不修改宿主 Comfy.Locale。

**所有权**：ComfyUI 拥有 Graph/Node 实例/Workflow、队列与 Undo；AstroPhoto 业务后端拥有素材 ID/元数据/软件等状态；React 只持有本地导航、查询、临时选中和拖拽状态。

---

## 3. 官方接口验证矩阵：HTTP 端点、函数、可靠性

### 3.1 已由 v0.45.0 Backend 或官方文档核对的 HTTP 端点

所有端点通常使用 ComfyUI 自身地址（本地示例：`http://127.0.0.1:8188`）；**8188 只是默认/示例端口，可由宿主更改，不可写死**。从 UI 发请求必须走宿主 `app.api.fetchApi`，以复用代理前缀与当前环境。

| 方法与路径 | 用途 | 当前判断 | 与 Sidebar 的关系 |
|---|---|---|---|
| `GET /extensions` | 列出 ComfyUI 发现的前端扩展 JS | [F] 后端存在 | 只用于诊断与部署测试，前端不自己注册脚本 |
| `GET /object_info` | 所有 Node 类型、Schema、端口元数据 | [F] 后端存在 | Nodes 的主要数据源 |
| `GET /object_info/{node_class}` | 某 Node Schema | [F] 后端存在；**未注册类型可能 200 + `{}`** | NodeDetails；不能仅以 HTTP 200 判成功 |
| `GET /system_stats` | 宿主系统、版本与设备信息 | [F] 后端存在 | 系统页按需读取，避免开屏频繁请求 |
| `GET /features` | 宿主功能标志 | [F] 后端存在 | 需要时校验版本/能力 |
| `GET /userdata`、`GET/POST/DELETE /userdata/{file}` | 原生用户文件 | [F] 后端存在 | Workflow 继续原生管理；Sidebar 不绕行写 Workflow |
| `POST /prompt` | 提交 API Workflow | [F] 后端存在 | 不等同于修改当前 Canvas，也不是侧边栏“保存” |
| `GET /queue`、`GET /history/{prompt_id}`、`WS /ws` | 执行状态与事件 | [F] 后端存在 | 当前不新建实验页/任务页 |
| `POST /upload/image` | 上传图像文件 | [F] 后端存在 | **不适合作为 FITS/SER 通用资产数据库或精度保存接口** |

依据：[R6] 固定版 `server.py`、[R7] 官方 Server Routes。

### 3.2 AstroPhoto Extension 路由（不要与官方 HTTP 混淆）

| 方法与路径 | 状态 | 最小返回/输入 | 用途 |
|---|---|---|---|
| `GET /astrophoto/v1/status` | **[已存在]** 交接证据为独立 aiohttp 验证；实际 Host 未验收 | `extension`, `api_version`, `status`, `runtime`, `data_home`, `capabilities` | Settings → System Status |
| `GET /astrophoto/v1/assets` | **[P] 提议，尚未实现** | `items`, `next_cursor` | Assets 列表分页 |
| `GET /astrophoto/v1/sessions` | **[P] 提议** | `items` | Capture Sessions |
| `GET /astrophoto/v1/assets/{asset_id}` | **[P] 提议** | Asset 详情/元数据 | AssetDetails |
| `POST /astrophoto/v1/assets/import` | **[P] 提议** | 经授权导入请求，真实 Receipt | 目录导入；不得无授权传任意本地路径 |
| `GET /astrophoto/v1/catalog` | **[P] 可选** | Node 附加的专业元数据 | 只有需要软件状态/专业标签时再增加；不复制 Node Schema |

**协议建议**：所有规划资产接口采用稳定的 `asset_id/session_id`，不以本地绝对路径为公开 ID；必须在后端实施后再启用 UI 按钮。请求失败、数据为空、后端未实现应为不同 UI 状态。

**当前 Status API** 中 `status: "ok"` 只能表明状态路由和节点注册，不保证素材数据库、React Sidebar 或 Canvas 在线。详见已上传的 `05_MCP_AND_SKILLS.md`、`01_CURRENT_STATE.md`。

### 3.3 Frontend v1.59.1 已核对函数/类型

| 所在对象 | 函数/字段（摘录） | 级别 | 推荐使用 |
|---|---|---|---|
| `app` | `registerExtension(extension)` | [F] `ComfyApp` 类型 | 唯一扩展入口 |
| `app.extensionManager` | `registerSidebarTab(tab)`、`unregisterSidebarTab(id)`、`getSidebarTabs()` | [F] `ExtensionManager` 类型 | 注册一个 `astrophoto.sidebar` |
| `CustomExtension` | `type:'custom'`, `render(container:HTMLElement)`, `destroy?()` | [F] tag 类型 | React Root 的挂载/清理 |
| `app.extensionManager.setting` | `get<T>(id)`、`set(id,value)` | [F] tag 类型 | 语言 UI 偏好；`set` 类型返回 `void`，勿虚构等待回执 |
| `app` | `getNodeDefs(): Promise<Record<string,ComfyNodeDef>>` | [F] tag 类型 | 优先复用宿主节点定义 |
| `app` | `fetchNodeDefs(): Promise<{ok:true;defs}|{ok:false;status}>` | [F] tag 类型 | 需要区分 HTTP 拒绝时使用 |
| `app` | `clientPosToCanvasPos(pos:Vector2)` | [F] tag 类型 | Canvas 拖放坐标转换，初始化前可能抛错 |
| `app` | `canvas: LGraphCanvas`、`rootGraph: LGraph` | [F] tag 类型 | 当前活动图与根图不可混为一谈 |
| `app` | `canvasPosToClientPos(pos)` | [F] tag 类型 | 节点回显/选中定位 |
| `app.api` | `fetchApi(route, options?)` | [F] `api.ts`/官方文档 | 同源 HTTP 请求 |
| `app` | `graphToPrompt()`、`queuePrompt(number,...)` | [F] tag 类型 | 仅了解边界；本 Sidebar 不单独执行 |
| `app` | `loadGraphData(...)`、`handleFile(...)` | [F] tag 类型 | 不用于导入 FITS 业务目录或伪造文件工作流 |

**注意**：`ComfyApp` 的 public 接口未暴露一个 `createGraphNode(type,pos)` 高阶方法。ComfyUI 内部使用 `LiteGraph.createNode(name)`、`canvas.graph.add(node)` 与 `graph.change()` 等，但该内部 `createNode` 工具不是官方前端包承诺的稳定扩展 API。项目可以适配，不应将它标注为跨版本稳定接口。[R8] [R9] [R10]

---

## 4. 核心技术代码示例

本节所有代码是**基于官方签名编写的项目示范**，不是逐字摘抄。标为 [H] 的示范在 1.59.1 实际宿主检查前不得声称可直接生产部署。

### 4.1 `host/comfy-shims.d.ts`：宿主模块类型

官方扩展示例可从宿主 `/scripts/app.js` 导入。类型包只提供类型而非运行时 JS，因此必须区分两者。[R7] [R8]

```ts
// ui/src/host/comfy-shims.d.ts
// 注意：最终编译时以 @comfyorg/comfyui-frontend-types@1.59.1
// 的实际导出为准；此处仅声明外部宿主 ESM 模块。
declare module '/scripts/app.js' {
  import type { ComfyApp } from '@comfyorg/comfyui-frontend-types'
  export const app: ComfyApp
}
```

不建议业务页面各自 `import { app } from '/scripts/app.js'`；只允许 `host/comfy.ts`、`main.tsx` 等接入层使用。

### 4.2 `main.tsx` + `host/sidebar.tsx`：官方 Sidebar 生命周期

**官方依据**：`app.registerExtension` 与 `registerSidebarTab({id,title,icon,type:'custom',render,destroy})`。`destroy` 的准确调用时机需要在目标宿主针对打开/关闭/切换测试，不应假定每次隐藏都会销毁。[R8]

```tsx
// ui/src/main.tsx
import { app } from '/scripts/app.js'
import { registerAstroPhotoSidebar } from './host/sidebar'
import { languageModeSetting } from './host/settings'
import './styles/theme.css'

app.registerExtension({
  name: 'AstroPhoto.Sidebar',
  settings: [languageModeSetting],
  async setup() {
    registerAstroPhotoSidebar(app)
  },
})
```

```tsx
// ui/src/host/sidebar.tsx
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { App } from '../app/App'
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types'

let root: Root | undefined
let mountElement: HTMLElement | undefined

export function registerAstroPhotoSidebar(app: ComfyApp): void {
  const id = 'astrophoto.sidebar'
  // setup 一般只执行一次；防御热重载/重复导入。
  if (app.extensionManager.getSidebarTabs().some((tab) => tab.id === id)) return

  app.extensionManager.registerSidebarTab({
    id,
    type: 'custom',
    title: 'AstroPhoto',
    tooltip: 'AstroPhoto',
    // 这个类是否存在于宿主生成的图标集合需实测；否则自定义图标。
    icon: 'icon-[lucide--aperture]',
    render(container) {
      root?.unmount()
      mountElement?.remove()
      mountElement = document.createElement('div')
      mountElement.className = 'astrophoto-ui'
      container.appendChild(mountElement)
      root = createRoot(mountElement)
      root.render(<React.StrictMode><App /></React.StrictMode>)
    },
    destroy() {
      root?.unmount()
      root = undefined
      mountElement?.remove()
      mountElement = undefined
    },
  })
}
```

**验收要点**：注册 Tab 的对象只存在一份；`render` 重入不会生成第二个 Root；`destroy` 幂等；关闭后订阅、网络请求和拖拽监听全部清理。**不要复制官方模板里没有卸载逻辑的 `createRoot` 示例**。

### 4.3 `app/navigation.ts`：三主视图 + 单层子页

```ts
export type MainView = 'nodes' | 'assets' | 'settings'
export type ModuleId =
  | 'software' | 'equipment' | 'observing-site'
  | 'knowledge' | 'memory' | 'agent' | 'system'

export type SidebarNavigation = {
  active: MainView
  selectedModule: ModuleId | null
  nodeQuery: string
  assetQuery: string
  selectedNodeId: string | null
  selectedAssetId: string | null
}

export const initialNavigation: SidebarNavigation = {
  active: 'assets',
  selectedModule: null,
  nodeQuery: '',
  assetQuery: '',
  selectedNodeId: null,
  selectedAssetId: null,
}
```

`App.tsx` 必须提供三个始终可见的导航按钮，使用 `role="tablist"`、`role="tab"`、`aria-selected` 及关联 `tabpanel`。建议三视图内容以 `hidden` 保留或保存每个页面独立状态，避免切换时清空搜索/滚动；**不绑定 Workflow 保存**。Settings 子页进入/返回均是 Sidebar 内状态，不调用浏览器全局路由。

### 4.4 `features/settings/moduleRegistry.ts`：七个业务模块的可发现性

```ts
import type { ModuleId } from '../../app/navigation'

type ModuleDescription = {
  id: ModuleId
  titleKey: string
  descriptionKey: string
  status: 'planned' | 'available' | 'unavailable'
}

export const MODULES: readonly ModuleDescription[] = [
  { id: 'software', titleKey: 'modules.software.title', descriptionKey: 'modules.software.description', status: 'planned' },
  { id: 'equipment', titleKey: 'modules.equipment.title', descriptionKey: 'modules.equipment.description', status: 'planned' },
  { id: 'observing-site', titleKey: 'modules.site.title', descriptionKey: 'modules.site.description', status: 'planned' },
  { id: 'knowledge', titleKey: 'modules.knowledge.title', descriptionKey: 'modules.knowledge.description', status: 'planned' },
  { id: 'memory', titleKey: 'modules.memory.title', descriptionKey: 'modules.memory.description', status: 'planned' },
  { id: 'agent', titleKey: 'modules.agent.title', descriptionKey: 'modules.agent.description', status: 'planned' },
  { id: 'system', titleKey: 'modules.system.title', descriptionKey: 'modules.system.description', status: 'available' },
]
```

“System 可打开”仅表示存在**状态信息页**，不能使不存在的后端业务变为 available。可显示 `status_api`、`drawing_node` 与其他业务 capability 的真实 unavailable 原因。模块必须能够点击查看归属与计划；**不提供假安装/假保存按钮**。

### 4.5 `host/settings.ts`：语言 UI 偏好使用官方 SettingParams

官方 Settings 文档将 `combo` 选项定义为字符串或 `{text,value}`。现有 `ExtensionManager.setting.set` 在 v1.59.1 类型中是 `void`；不能把它当 Promise 等待。[R11] [R8]

```ts
// ui/src/host/settings.ts
export type LanguageMode = 'auto' | 'zh' | 'en'
const listeners = new Set<(mode: LanguageMode) => void>()

export const languageModeSetting = {
  id: 'AstroPhoto.UI.Language',
  name: 'AstroPhoto language',
  type: 'combo' as const,
  defaultValue: 'auto',
  options: [
    { text: 'Follow ComfyUI', value: 'auto' },
    { text: '简体中文', value: 'zh' },
    { text: 'English', value: 'en' },
  ],
  onChange(value: unknown) {
    const mode: LanguageMode = value === 'zh' || value === 'en' ? value : 'auto'
    for (const listener of listeners) listener(mode)
  },
}

export function onLanguageModeChange(listener: (mode: LanguageMode) => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
```

真正写入时使用 `app.extensionManager.setting.set('AstroPhoto.UI.Language', value)`；读取使用 `get<LanguageMode>(...)`。应用内部手动切换应立即更新 React/i18next，并通过宿主 Setting 保存；如需保证磁盘持久化成功，必须另做宿主/网络端到端测试。

### 4.6 `i18n/index.ts`：内置 zh/en，自动跟随宿主

两个语言包体量较小时优先打包导入，不再使用模板的 `i18next-http-backend` 与全局 `/locales/`，也不需要新的后端静态路由。

```ts
// ui/src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/main.json'
import zh from './locales/zh/main.json'

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh'],
  resources: { en: { main: en }, zh: { main: zh } },
  ns: ['main'],
  defaultNS: 'main',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export function normalizeLocale(value: unknown): 'zh' | 'en' {
  return typeof value === 'string' &&
    /^(zh)(-|$)/i.test(value) ? 'zh' : 'en'
}
export default i18n
```

```ts
// ui/src/host/locale.ts（核心逻辑）
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types'
import i18n, { normalizeLocale } from '../i18n'
import type { LanguageMode } from './settings'

export function applyLanguage(app: ComfyApp, mode: LanguageMode): void {
  const hostLocale = app.extensionManager.setting.get<string>('Comfy.Locale')
  const desired = mode === 'auto' ? normalizeLocale(hostLocale) : mode
  if (i18n.language !== desired) void i18n.changeLanguage(desired)
}
```

**同步边界 [H]**：`Comfy.Locale` 的读取接口已确认，但官方 ExtensionManager 未提供跨任意 Setting 的公共订阅函数；宿主内部 Pinia `onSettingChanged` 是内部 API，**不直接进口**。初版在 Sidebar 打开、获得焦点及 Settings 视图进入时重新读取；如要求宿主切换语言后**立即**同步，需在真实 1.59.1 中确认一个非私有事件来源，或仅在挂载可见期间做低频检测并在卸载时清理。不得声称 `get()` 自动响应变化。项目自有语言选择可通过其 `onChange` 立即更新。

**语言测试**：强制校验中英文 Key 完全一致；`zh-CN/zh-Hans→zh`、`en-US→en`；`auto` 不修改 `Comfy.Locale`；无翻译 Key 不显示 JSON 键名；切换不重置表单、搜索和导航。

### 4.7 `api/client.ts`：统一 HTTP 请求与错误

```ts
// ui/src/api/client.ts
import { app } from '/scripts/app.js'

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await app.api.fetchApi(path, { signal })
  if (!response.ok) throw new ApiError(response.status, `HTTP ${response.status}: ${path}`)
  const value: unknown = await response.json().catch(() => {
    throw new ApiError(response.status, 'INVALID_JSON')
  })
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError(response.status, 'INVALID_RESPONSE')
  }
  return value as T // 断言前仍需在各 DTO 边界执行字段校验
}
```

生产代码对 `AstroStatus`、`NodeDefinition`、`AssetDTO` 需执行显式字段验证（Zod 或小型 guard），**不是仅 `as T` 即视为通过**。正常处理 `AbortController` 取消、401/403 权限、404 未实现、500 服务错误、非 JSON 响应和超时；不要吞掉错误返回假空列表。

### 4.8 `api/nodes.ts` / `nodeCatalog.ts`：从真 Node Def 建列表

可以优先调用宿主 `app.getNodeDefs()`，避免每次打开 Sidebar 都重复 GET 全量 `/object_info`。同时，固定后端源码显示 Node 定义在 `name`、`display_name`、`description`、`category`、`input`、`output`、`output_name`、`python_module` 等字段中。[R6] [R8]

```ts
// ui/src/features/nodes/nodeCatalog.ts（简化示例）
export type NodeCard = {
  id: string
  title: string
  description: string
  category: string
}

// 真实版本使用 @comfyorg/comfyui-frontend-types 中的 ComfyNodeDef。
export function toNodeCards(defs: Record<string, any>, ownedIds: Set<string>): NodeCard[] {
  return Object.entries(defs)
    .filter(([id]) => ownedIds.has(id))
    .map(([id, def]) => ({
      id,
      title: typeof def.display_name === 'string' ? def.display_name : id,
      description: typeof def.description === 'string' ? def.description : '',
      category: typeof def.category === 'string' ? def.category : 'AstroPhoto',
    }))
}
```

`ownedIds` 应由本扩展稳定 Node IDs + `python_module` 校验产生；**不要仅靠 `category.startsWith('AstroPhoto')`**，因为现有历史示例节点 `vue-basic` 属于 `examples`，软件节点可能分类变化。Node ID 是真实执行契约，不等于翻译标题。

示例 `vue-basic` 可作为真实节点目录的第一条可见项；未实现 `Load FITS`、`Siril Stacking` 不应在生产 Nodes 目录中伪装为可点击节点。

### 4.9 `host/canvas.ts`：严格隔离 Node 创建

**已验证的底层事实**：固定版内部 `src/utils/createNode.ts` 先 `LiteGraph.createNode(name)`，再添加到当前 `canvas.graph` 并通知 `graph.change()`；`ComfyApp.clientPosToCanvasPos()` 有对应类型。[R9] [R8]

下面**不是官方对外高阶 API**；是需要在 `host/canvas.ts` 内按 v1.59.1 实测封装的版本耦合方案，`LiteGraph` 的运行时取得方式（内部模块/宿主可用导出）是待验证点：

```ts
// host/canvas.ts —— [H] 结构化伪实现，不能原样当可编译成品
async function createCanvasNode(type: string, clientX: number, clientY: number) {
  if (!app.isGraphReady || !app.canvas?.graph) throw new Error('CANVAS_UNAVAILABLE')
  const [x, y] = app.clientPosToCanvasPos([clientX, clientY])

  // 此工厂必须在本文件内绑定到 1.59.1 真正可用的 LiteGraph 运行时。
  const node = runtimeLiteGraph.createNode(type)
  if (!node) throw new Error('NODE_NOT_REGISTERED')

  node.pos = [x, y]
  const inserted = app.canvas.graph.add(node)
  if (!inserted) throw new Error('GRAPH_ADD_FAILED')
  app.canvas.graph.change()
  return node
}
```

`clientPosToCanvasPos` 已核对，`runtimeLiteGraph` 是**明确的待绑定依赖**，不可发明其 import 地址。测试中通过 `NodeFactory` 依赖注入模拟；真实宿主检查导入、Subgraph 焦点、Canvas 节点创建事件、Workflow 保存重开与 Undo/Redo。**不要直接操作 `app.rootGraph` 强行添加到当前根图；用户可能正在编辑 Subgraph。**

如使用当前前端的内部 `createNode(canvas,name)` 作为参考，也必须标记**内部实现，非扩展兼容承诺**；它默认用当前 `canvas.graph_mouse` 放置，新设计的跨 Sidebar 拖放应使用准确转换坐标。

### 4.10 `host/dragDrop.ts`：资源拖拽协议

```ts
export const ASTRO_DRAG_MIME = 'application/x-astrophoto-resource+json'

export type DragResource =
  | { v: 1; kind: 'node'; nodeId: string }
  | { v: 1; kind: 'asset'; assetId: string }
  | { v: 1; kind: 'session'; sessionId: string }

export function beginDrag(event: DragEvent, resource: DragResource) {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData(ASTRO_DRAG_MIME, JSON.stringify(resource))
}
```

`drop` 时只接受自己的 MIME、`v === 1` 与完整有效 ID；永远不把拖拽负载中的路径当成授权的文件系统路径；无能力时禁止插入，失败清理 preview/ghost。

**节点创建事务（目标语义）**：

```text
Sidebar NodeRow ─┐
                 ├─ 拖动/点击 ─→ Host CanvasAdapter
Sidebar AssetRow─┘                    │
                                      ├─ 校验图可编辑、Node Class 已注册
                                      ├─ 获取正确 Graph 坐标
                                      ├─ 创建实例（当前 Graph）
                                      ├─ Asset 情况绑定 asset_id widget
                                      ├─ 通知变更 / 保证 undo 契约
                                      └─ 返回 created / failed（不是 saved）
```

**事件接管 [H]**：ComfyUI Canvas 已有原生文件 drop、节点 drop 和其他插件监听，不能在全局 `document` 盲目 `preventDefault/stopPropagation`。仅在自有 MIME 且命中目标画布时处理；必须在真实 1.59.1 检查事件顺序与坐标；同时提供“+ 添加”键盘/鼠标替代方式。

### 4.11 素材实例与 V3 Node 端口示例（跨层最小示范）

**目的**：澄清 Sidebar 绑定 `asset_id` 与 ComfyUI Schema 的关系。下面是未来 Python Node 的**设计代码**，不是当前已实现内容，不应直接混入 `ui/`：

```python
# [P] AstroPhotoAssetSource — V3 Schema 的目标端口示意
from comfy_api.latest import io

class AstroPhotoAssetSource(io.ComfyNode):
    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="AstroPhotoAssetSource",
            display_name="AstroPhoto Asset Source",
            category="AstroPhoto/Assets",
            description="Resolve a registered astronomical asset by ID.",
            inputs=[io.String.Input("asset_id", default="")],
            outputs=[io.Custom("ASTRO_ASSET").Output(display_name="asset")],
        )

    @classmethod
    def execute(cls, asset_id: str) -> io.NodeOutput:
        # TODO: 调用 Extension Asset Service，验证 ID / 权限 / 文件存在。
        # 不能将原始路径直接由前端传给这里，也不能把未知资产伪造为有效数据。
        asset_ref = resolve_verified_asset(asset_id)  # [P] 尚未实现
        return io.NodeOutput(asset_ref)
```

**V3 验证来源**：[R12] 官方 `io.Schema` / `io.String.Input` / `io.Custom(...).Output` / `execute` / `io.NodeOutput`；**`resolve_verified_asset` 是未实现的业务函数**。

| 预留 Node | Input Widget / Port | Output Port | 状态 |
|---|---|---|---|
| `AstroPhotoAssetSource` | Widget `asset_id: STRING` | `asset: ASTRO_ASSET` | [P] 需资产服务 |
| `AstroPhotoSessionSource` | Widget `session_id: STRING` | 建议先确定批次资产结构与 `ASTRO_ASSET_LIST` 类型后再建 | [P] 先设计再实现 |
| `AstroPhotoFrameDecode` | `asset: ASTRO_ASSET` | `frame: ASTRO_FRAME` | [P] 保留位深/元数据 |
| `AstroPhotoPreview` | `frame: ASTRO_FRAME` | `IMAGE` | [P] 明确科学精度转换损失 |

**现实契约**：`ASTRO_ASSET/ASTRO_FRAME` 只是规划名称，数据类、序列化、缓存与 ComfyUI V3 运行时适配未验证；不可作为今天就能连线的已注册端口。Sidebar 在对应 Node 真实注册之前必须禁用 Asset 拖入成功路径。

### 4.12 `styles/theme.css`：简约风格与宿主主题联动

官方 Frontend 已移除宿主 PrimeVue 全局 `--p-*`；使用 `--background`、`--foreground`、`--secondary`、`--border` 等主题变量。[R13]

```css
.astrophoto-ui {
  --ap-bg: var(--background, #171717);
  --ap-fg: var(--foreground, #eeeeee);
  --ap-muted: var(--muted-foreground, #a3a3a3);
  --ap-surface: var(--secondary, #242424);
  --ap-border: var(--border, #343434);
  width: 100%; height: 100%; min-width: 0;
  background: var(--ap-bg); color: var(--ap-fg);
  font: inherit;
}
.astrophoto-ui * { box-sizing: border-box; }
.astrophoto-ui .ap-tab[aria-selected="true"] {
  background: var(--ap-surface);
  color: var(--ap-fg);
}
.astrophoto-ui .ap-muted { color: var(--ap-muted); }
.astrophoto-ui :focus-visible {
  outline: 2px solid var(--primary, currentColor);
  outline-offset: 2px;
}
```

Light/Dark 自适应，不锁死 CSS 的深色。**不要覆盖全局 `button`、`body`、`.p-*`**；使用唯一 `.astrophoto-ui` 根命名空间。窄 Sidebar 保持主导航与搜索可见，列表独立滚动；浮动面板和 200% 缩放不能溢出。

---

## 5. Vite / Runtime 资源策略（必须重点测试）

### 5.1 构建产物限制

v0.45.0 的 `/extensions` 会递归枚举 `WEB_DIRECTORY` 下的 `.js` 文件并返回所有脚本路径。这是**直接读取 v0.45.0 `server.py` 的结论**，不等于浏览器只加载 `main.js`。因此：

- 将 `ui/src/main.tsx` 编译成 `dist/main.js`，尽可能只有**一个扩展入口 `.js`**。
- 禁止照搬模板 `manualChunks: {vendor:['react','react-dom']}` 而不检查 `/extensions` 返回；拆分 chunk 可能被递归列出，需要针对版本验证加载语义。
- P0 禁用动态 `React.lazy()` 分块，或使用 `inlineDynamicImports` 使业务源码聚合到同一个模块。
- 仅产出真正需要的 `dist/main.js`、`dist/main.css`（CSS 名称以实际构建为准）；禁止将测试 fixture、Node 工具脚本等额外 JS 放在扫描的 Web 目录中。
- 静态 CSS **必须被加载**：若构建将 CSS 单独输出，需要由入口创建一次 `<link>`，使用相对 `import.meta.url` 定位，且卸载时/热重载不重复插入。不要假定模板自动为分离的 CSS 加入 HTML。

### 5.2 Vite 配置建议（目标构建策略，需实测）

```ts
// ui/vite.config.ts — 概念配置，需结合实际锁定 Vite 版本验证产物
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      formats: ['es'],
      fileName: () => 'main.js',
      cssFileName: 'main',
    },
    rollupOptions: {
      external: ['/scripts/app.js'],
      output: {
        inlineDynamicImports: true,
        // 资源部署相对路径必须跟随最终 JS 所在层级；
        // 此例假定 /extensions/<pack>/main.js，向上两级到 /scripts/。
        paths: { '/scripts/app.js': '../../scripts/app.js' },
      },
    },
  },
})
```

**特别提醒**：此代码是根据官方模板/固定版本 Server 分析得到的**目标策略**，并非本轮 `npm run build` 的实测结果。需要验证 `Vite` 对 `lib.cssFileName`、`inlineDynamicImports` 与 external 输出的实际行为；构建结束后检查 `dist/` 和 `/extensions` 结果。若项目重用现有 AstroPhoto Vue 工程的 `js/` 输出目录，**相对路径层级必须重新计算**，不能直接复制 `../../scripts/app.js`。

### 5.3 最小 CSS 加载器（仅当实际独立产出 CSS）

```ts
// main.tsx 的宿主样式加载策略（替代直接引入样式时的例子）
export function ensureSidebarStyles(): void {
  const href = new URL('./main.css', import.meta.url).href
  if (document.querySelector('link[data-astrophoto-css="1"]')) return
  const link = document.createElement('link')
  link.dataset.astrophotoCss = '1'
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}
```

注意 `.css` 的真实输出文件名需与 `vite.config.ts` 对齐。不应在同时使用 CSS import 自动注入时再重复调用此函数。浏览器 Network 中 CSS 200、Light/Dark 实际切换正常是强制验收项。

### 5.4 代理前缀与路径策略

- 不允许使用模板硬编码的 `http://127.0.0.1:8188/scripts/app.js` 作为生产导入路径；它只适合某种开发环境。
- 不在 UI `fetch('/astrophoto/v1/...')` 或 `<link href="/locales/...">` 中写死站点根。通过宿主 `app.api.fetchApi` 和相对于扩展模块的 `import.meta.url` 解析路径。
- 反向代理例如 `/proxy/comfy/` 的正式验收应检查：Sidebar、JS、CSS、图标、API 请求路径与语言切换均正常。
- `WEB_DIRECTORY` 属于后端注册契约。**保持已有 V3 的 `__init__.py` 与路由方式，绝不直接照搬 React Template `NODE_CLASS_MAPPINGS={}` 和 `/locales/` 静态路由**。

---

## 6. Nodes / Assets / Settings 交互规范

### 6.1 主界面

```text
AstroPhoto                         [状态] [⚙] [×]
────────────────────────────────────────────────
[ Nodes ]             [ Assets ]          [ Settings ]
────────────────────────────────────────────────
[ 搜索当前视图 ...                         ][筛选]

  Nodes:               Assets:               Settings:
  - 分类折叠           - Session Tree         - 语言: auto/zh/en
  - Node Row           - Light/Dark/...       - 软件管理
  - Node Details       - Asset Row           - 设备与光学链路
  - Add / Drag         - Asset Details       - 观测地与光污染
                       - Add / Drag          - 知识库
                                            - 记忆与隐私
                                            - Agent 上下文 / MCP
                                            - 系统状态
────────────────────────────────────────────────
提示/错误/状态（仅在必要时显示）
```

三个页面主导航始终显示、可左右点击切换；不强制横向滑动手势，因为与节点/文件拖动容易冲突。顶部齿轮和 Settings 标签是同一状态入口；模块说明页内部返回设置列表。**不增加实验/Workflow 一级页面**。

### 6.2 Node 行点击与拖放

- 点击主体 → `NodeDetails`（名称、ID、说明、真实输入输出端口、可用性）；点击 `+` → 添加节点到当前图默认位置；拖动 → 放在指定 Canvas 坐标。
- 不能使用“节点类别/说明存在”作为执行可用性依据；只有已注册节点 + 必要软件能力才允许执行。如果 Node 类型能注册但软件缺失，可允许添加并提示不可运行；实际执行报明确错误。
- 添加动作成功不代表 Workflow 保存成功。保存/另存为依然由 ComfyUI 完成。

### 6.3 Asset 行点击与拖放

- 点击主体 → `AssetDetails`；点击 `+` → 创建 `AstroPhotoAssetSource` 并绑定 ID；拖动 → 在 Canvas 指定位置创建实例。
- P0 若后端无 `Asset Source` Node 类和真实素材服务，列表只显示空态与规划说明；导入、添加和拖拽**不能表现成成功**。
- 目录导入不能仅用浏览器的 `webkitdirectory` 误称取得真实绝对路径；Web File API 通常提供相对路径与 `File` 对象，而不能直接把操作系统绝对目录交给 Python 扫描。最终的授权选择/上传机制必须单独设计。
- Asset Source Widget 保存的是稳定 `asset_id`，文件本身不嵌入 workflow JSON；重新加载后的缺失资产要明确提醒、可重新定位。

### 6.4 Settings 信息页：七项均必须可进入

| 模块 ID | 中文 | English | 初版点击后呈现的说明 | 当前状态映射 |
|---|---|---|---|---|
| `software` | 软件管理 | Software | Siril/PixInsight 程序检测、路径验证与能力 | Planned |
| `equipment` | 设备与光学链路 | Equipment & Optics | 相机、望远镜、滤镜、Optical Train | Planned |
| `observing-site` | 观测地与光污染 | Observing Sites | 时间区、观测地、光污染来源 | Planned |
| `knowledge` | 知识库 | Knowledge | Siril 教程和可引用检索 | Planned |
| `memory` | 用户记忆与隐私 | Memory & Privacy | 偏好、授权、审阅、删除 | Planned |
| `agent` | Agent 上下文与 MCP | Agent Context & MCP | 任务上下文、工具能力、连接 | Planned（当前仅两只诊断 Tool） |
| `system` | 系统状态 | System Status | 已有 HTTP Status 及版本/错误 | 部分实现，按真实字段显示 |

ModuleInfoPage 展示 `name`、`description`、`availability`、`reason`、`back`；不做虚构配置表单。如果未来新增配置页，应从所属 `features/settings` 子模块增量扩展，不改变一级导航数目。

---

## 7. 状态、错误和安全边界

### 7.1 统一视图状态

```ts
export type Loadable<T> =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'ready'; data: T }
  | { state: 'empty' }
  | { state: 'unavailable'; reason: string }
  | { state: 'error'; message: string; status?: number }
```

`idle` 不等于 `empty`；HTTP 404/500 不等于“没有节点/素材”；`status.ok` 不等于全部组件在线。实时能力更新后所有可执行控件须重新验证 prerequisites。

### 7.2 最小权限规则

- Node/Asset 拖拽只包含稳定 ID，不包含任意用户文件路径、Shell 命令或身份令牌。
- React 不调用 Python 本地路径 API、不直接打开数据库、不把软件配置下发任意 Shell。
- 资产导入是明确的用户操作，处理远端访问/目录遍历/认证/权限的安全边界在后端；前端不可视为授权来源。
- 文档内容与 RAG 检索结果视为数据；不要将检索内容用于修改宿主设置/节点权限。
- 不主动采集用户敏感操作、用户记忆、地理位置；这些后续能力有独立同意与审阅要求。

### 7.3 没有真正执行时绝不能出现的提示

- 禁止“已导入成功”（若导入 API 尚不存在）。
- 禁止“已创建节点”（若 `graph.add()` 未成功）。
- 禁止“已保存 Workflow”（仅因为创建节点或点击添加成功）。
- 禁止“Agent 在线”（仅因为 status API 可访问）。
- 禁止“软件可用”（仅因为 Node 在 `/object_info` 中存在）。

---

## 8. 测试矩阵与开发命令

### 8.1 P0 纯前端 / React Shell

| 测试 | 工具 | 验收 |
|---|---|---|
| 三视图与子页 | Jest + React Testing Library | 节点⇄素材⇄设置，返回不丢状态 |
| 设置模块目录 | RTL | 七项都可点击，名称/责任/状态完整 |
| 双语 | Jest | en/zh key 集合相同、切换后即时变更、不出现裸 key |
| i18n auto | RTL + Host adapter | 读取 `Comfy.Locale`，手动覆盖不写宿主语言 |
| 主题 | 浏览器 | Light/Dark 跟随，界面无全局 CSS 污染 |
| 宿主生命周期 | mock `registerSidebarTab` | render 两次不重复 Root、destroy 幂等、无悬挂监听 |
| 空态和错误态 | RTL | 404/500/无网络/空结果呈现不同提示 |
| 生产构建 | Vite | `dist` 内容清单与 CSS 加载符合要求 |

### 8.2 P1 节点

| 测试 | 验收 |
|---|---|
| `/object_info` | Node ID、Schema、category、端口映射正确 |
| 模块归属 | 只显示真实 AstroPhoto Node，不因类别变化漏掉示例节点 |
| 增加节点 | 真实 1.59.1 可创建正确实例，适配当前 Graph/Subgraph |
| Undo/Redo | 创建/撤销/恢复按宿主惯例，保存后重载存在 |
| 异常 | 未注册、不可编辑、图未就绪、拖拽取消不产生孤儿节点 |

### 8.3 P2 素材

| 测试 | 验收 |
|---|---|
| 真实 API | 分页、Session/Frame 类别、详情、失败状态 |
| 资产节点绑定 | `asset_id` 正确，多个实例可引用同一 Asset |
| FITS 科学数据 | 拖拽不隐式转换位深、不覆盖原始文件 |
| 重开 Workflow | Asset ID 保留，可解析/无法解析时有清晰反馈 |
| 安全 | 路径/权限/错误输入/文件缺失不伪造成功 |

### 8.4 命令（在 `ui/` 下）

基于官方 React Template `package.json` 的既有 npm 脚本，版本对齐后使用：

```bash
npm ci
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build
npm run watch
```

`npm run watch` 是**重新构建输出**，不保证真实 ComfyUI 宿主插件具有完整 React HMR；官方 Frontend 扩展开发文档明确说明非核心扩展与开发服务器之间存在加载限制。[R14]

**注意**：原 AstroPhoto 工程先前使用 `pnpm/uv`，这里因为用户明确要求专注 React Template，采用其 `npm/package-lock`。实际集成同一仓库时必须只保留一种前端包管理器/锁文件，不得同时维护 `package-lock.json` 与 `pnpm-lock.yaml`。

### 8.5 固定宿主验收检查顺序

1. 先解决现有宿主 Torch 2.3.0 / `comfy_kitchen` 导入失败；未经授权不修改宿主 Python 依赖。
2. 在 Backend 0.45.0 / Frontend 1.59.1 真环境启动 ComfyUI。
3. 检查 `GET /extensions` 只包含预期扩展 JS；Network 无 CSS、JS、i18n 404。
4. React Sidebar 能开/关/重新打开；只有一个 AstroPhoto 图标；重复切换无 console error。
5. 中英两种 UI 字段完整；ComfyUI Light/Dark 生效；窄/宽/浮动面板无溢出。
6. 节点实际注册后，在真实 Canvas 测点击“+”和 Sidebar 拖拽，验证位置、Widget、Undo、保存与重开。
7. Asset Node 和业务 API 就绪后，再执行 FITS/SER/Session 的真实测试。未就绪时只验收空态与规划说明。

---

## 9. 实施顺序与 Definition of Done

### P0 — 可以独立发布的 Sidebar Shell（不假装业务已完成）

- 完成 `main.tsx`、`host/sidebar.tsx`、`app/App.tsx`、`PrimaryTabs`、`SettingsPage`、`ModuleInfoPage`、`moduleRegistry`。
- 提供完整 en/zh 翻译、auto/zh/en 选择与宿主设置读写；主题与图标自洽。
- Nodes 展示真实节点或空态；Assets 展示当前不可用说明和导入入口的规划状态。
- 入口、样式、单 JS 产物和 React Root 清理均通过测试。

### P1 — 真 Node Library + Canvas Adapter

- 接入 `getNodeDefs` / `object_info`，完成真实 Node Catalog/Node Details。
- 单独实测图创建工厂、Canvas 坐标转换、Subgraph、拖拽冒泡、Undo/Redo。
- P1 未完全验证前，点击“+”与拖拽不应显示已成功。

### P2 — 真 Assets + Asset Source

- 资产 API/资产 Node 类与专业数据引用具备后，再启用导入/浏览/拖拽。
- 完成原文件只读、稳定 asset_id、资产失联处理与 Workflow 保存重开验收。
- 不增加新的 Workflow 数据库、实验页面或无关设置模块。

### 出口标准

- 来源验证与代码实现相匹配；只读接口不添加副作用。
- TypeScript、Lint、Jest、Build、静态资源清单均成功；明确真实宿主测试是否成功。
- 既有 V3 `vue-basic` Widget、PNG 上传序列化、ComfyUI Workflow 未被 React Sidebar 迁移破坏。
- 更新用户可见使用说明，并记录因宿主缺陷无法运行的项（不能冒充通过）。

---

## 10. 待决与不能凭文档直接定论的事项

| 编号 | 事项 | 当前结论 | 实施时需验证 |
|---|---|---|---|
| U1 | Sidebar `destroy()` 的实际触发时机 | 类型存在，时机依运行时 UI | 关闭、切换、浮动、重挂载 |
| U2 | 运行时 `LiteGraph.createNode` 的可用 import | 核心内部使用，但不是公开高阶接口 | 1.59.1 ESM shim、兼容性及测试 |
| U3 | Comfy.Locale 实时跨设置订阅 | `get` 已验证，无公共通用订阅 | 用户修改语言后可见 Sidebar 的实际同步策略 |
| U4 | 代理子路径下的 ESM external 与 CSS 路径 | 固定产物后路径可推导 | 实际 Network、`/extensions` 输出和代理部署 |
| U5 | React 模板独立构建 vs 现有 Vue 工程共存 | 当前只是目标前端方案 | 一个 Registry 扩展下的多个前端入口及资源隔离 |
| U6 | 已知 v3 `ASTRO_ASSET` 类型科学数据语义 | 名称规划、类型工具存在 | 真实 Node 类型/缓存/序列化/执行测试 |
| U7 | 浏览器选择本机目录并让 Python 引用 | Web 不会自动提供用户真实绝对路径 | 授权模型、上传或受控原生选择器 |
| U8 | 发行打包中 React Vendor CSS 的行为 | 需检查真实 Vite 版本 | Registry ZIP、静态 JS/CSS、依赖路径 |

---

## 11. 官方来源清单（按**固定版本**优先）

> 可将以下 URL 原样交给 Coding Agent 查询。`main` 分支仅用于了解模板或滚动文档，不应用来取代下面的 tag。中文需求中的用户决策来自《FRD v1.0》，技术结论另标证据等级。

- **[R1] 官方 React Extension Template**（模板，而非宿主版本标准）：https://github.com/Comfy-Org/ComfyUI-React-Extension-Template
- **[R2] 模板 main.tsx**（`window.app` 轮询、ReactRoot、演示命令）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/src/main.tsx
- **[R3] 模板 i18n.ts**（全局 `/locales` 的局限）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/src/utils/i18n.ts
- **[R4] 模板 package.json**（React 18、Jest、Vite、类型包旧声明）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/package.json
- **[R5] 模板 Python `__init__.py`**（旧 V1/静态路由，不应覆盖已有 V3）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/__init__.py
- **[R6] Backend v0.45.0 `server.py`**（`/extensions`, `/object_info`, `/prompt`, `/system_stats` 等）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI/v0.45.0/server.py
- **[R7] ComfyUI 官方 Server Routes 与自定义 aiohttp 路由**：https://docs.comfy.org/development/comfyui-server/comms_routes
- **[R8] Frontend v1.59.1 `src/types/comfy.ts`**（`ComfyApp`、Graph、Defs、坐标转换）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/types/comfy.ts
- **[R9] Frontend v1.59.1 `src/types/extensionTypes.ts`**（`registerSidebarTab`、`render`、`destroy`、Setting）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/types/extensionTypes.ts
- **[R10] Frontend v1.59.1 `src/utils/createNode.ts`**（内部 LiteGraph 创建流程）：https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/utils/createNode.ts
- **[R11] ComfyUI 官方 Settings API**：https://docs.comfy.org/custom-nodes/js/javascript_settings
- **[R12] ComfyUI 官方 V3 Migration/Node Schema**：https://docs.comfy.org/custom-nodes/v3_migration
- **[R13] ComfyUI 官方 PrimeVue Removal Migration**：https://docs.comfy.org/custom-nodes/js/primevue-removal-migration
- **[R14] 官方 Frontend Extension 开发限制**：https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/development.md
- **[R15] ComfyUI 官方 Sidebar Tabs（React 示例）**：https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs
- **[R16] Backend v0.45.0 `nodes.py`（V3 加载及 WEB_DIRECTORY）**：https://raw.githubusercontent.com/Comfy-Org/ComfyUI/v0.45.0/nodes.py
- **[R17] Frontend v1.59.1 `settingStore.ts`（内部设置事件边界）**：https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/platform/settings/settingStore.ts
- **[R18] Frontend v1.59.1 `coreSettings.ts`（Comfy.Locale）**：https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/platform/settings/constants/coreSettings.ts
- **[R19] 前版产品需求**：`AstroPhoto_React_Sidebar_Requirements_v1.0.md`（用户已上传/前轮生成）

### 11.1 证据范围声明

本轮用网页打开的 tag 原始源码确认了指定的函数/端点/类型，但**没有在用户的真实 Windows 工作树中执行 npm install、npm build、浏览器拖拽或 ComfyUI 启动**。因此，示例代码是可供实现的工程规范，不是已经过用户环境的编译验收。遇到现实源码冲突时，应先核对当前工作树、lock 和安装环境，再调整本规范；不能为了让目录图整齐而删掉既有功能。

---

## 一句话架构结论

**一个可双语切换的 React AstroPhoto Sidebar，固定 Nodes / Assets / Settings 三视图；宿主接入集中在 `host/`，资产网络接口集中在 `api/`，UI 通过 `features/` 渲染；所有 Node 都沿用 ComfyUI V3 Registry，拖拽只创建已注册节点实例；Workflow 原生保存；未实现模块以真实的 Settings 说明页渐进披露，不制造伪功能。**
