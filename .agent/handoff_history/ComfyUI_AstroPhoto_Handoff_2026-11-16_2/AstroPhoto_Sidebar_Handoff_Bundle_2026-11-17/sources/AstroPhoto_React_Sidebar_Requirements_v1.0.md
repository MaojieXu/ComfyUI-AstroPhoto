# AstroPhoto React Sidebar — 前端需求规格说明（FRD）

> **文档版本**：v1.0（前端需求设计稿，非软件发行版本）  
> **编制基线**：2026-11-16；ComfyUI Backend 0.45.0 / Frontend 1.59.1  
> **设计依据**：用户提供的 AstroPhoto 简约风格界面示意、`ComfyUI-React-Extension-Template` 官方示例与 ComfyUI 官方扩展文档  
> **技术范围**：React + TypeScript + Vite + i18next；只设计模板的 `ui/` 前端，不设计 Python / MCP / 数据库实现。  
> **重要说明**：这是 **React 方案的目标需求**，不表示现有 AstroPhoto Vue 前端已迁移到 React，也不表示业务 API 或资产源节点已实现。

## 0. 执行结论（已确定的产品决策）

1. 在 ComfyUI 左侧只注册 **一个** `AstroPhoto` Sidebar 入口，不为不同业务域注册多个宿主侧边栏图标。
2. 该 Sidebar 内使用 **三个同级、可横向点击切换的主视图**：**节点 Nodes / 素材 Assets / 设置 Settings**。
3. 主导航始终可见；切换主视图不重新创建 ComfyUI Workflow，也不修改 Canvas；保留本次会话的搜索、筛选与浏览位置。
4. `Settings` 必须能够进入，并显示其他模块的名称、职责和真实状态。未实现模块可以进入**说明页**，但不得显示可操作的假配置或伪造成功状态。
5. 节点和素材是两类资源：**处理节点拖入 → 创建已注册 ComfyUI Node 实例**；**素材拖入 → 创建稳定的 Asset Source Node 实例并赋值素材引用**。每个文件**不是**一个新的 Node Class。
6. Workflow 的创建、保存、加载、Undo/Redo、队列和执行归 ComfyUI 原生系统；Sidebar 不开发自己的 Workflow 管理页和数据库。
7. **不展示 Experiment / Trials 页面**；不将 Knowledge、Memory、设备、观测地或软件配置各自升级为常驻一级 Tab。
8. 本轮前端设计支持 `zh`（简体中文）和 `en`（英文），覆盖主导航、各设置模块、列表、空状态、错误及操作反馈；默认跟随 ComfyUI 语言，允许用户主动覆盖。
9. AstroPhoto 采取**极简、克制、专业**的 UI 视觉规范；“ComfyUI 风格”指主题与视觉协调，不强制复制 ComfyUI 媒体资产的布局。

## 1. 目标与非目标

### 1.1 产品目标

- 用户进入 ComfyUI 后，点击 AstroPhoto 图标即可浏览专用节点和已登记的天文素材。
- 用户能够从两个列表直接将对象添加至中央 Canvas，而不被迫先打开 ComfyUI 原生 `Load Image` 进行文件选择。
- 用户能在设置视图知道系统的组成和未来能力，包括软件、设备、观测地、知识、记忆、Agent/MCP、系统状态。
- 中文和英文交互体验完整且结构一致；更改语言不造成主视图切换、搜索状态或选中项丢失。
- Sidebar 在明暗主题、不同宽度及 ComfyUI 收合/重开时保持稳定、清晰、不影响宿主。

### 1.2 本轮明确不做

- 不实现具体天文算法、Siril/PixInsight 执行逻辑、FITS/SER 解析器、业务数据库、Agent 编排、MCP Tool。
- 不再造一套工作流编辑器、Workflow 文件管理界面或参数面板。
- 不实现 Experiment/Trial UI，也不为每个未来业务域预建带空数据的完整表单。
- 不自动导入或扫描本机文件，不在前端直接读取 AstroPhoto 业务数据库。
- 不在没有真实 ComfyUI 宿主验收的前提下宣称跨 Sidebar → Canvas 拖拽完成。

## 2. 信息架构（IA）

```text
ComfyUI 原生侧边栏
└── AstroPhoto                            ← 唯一宿主扩展图标
    ┌───────────────────────────────────┐
    │ AstroPhoto                  ⓘ  × │  ← Header：品牌/状态/关闭
    ├───────────────────────────────────┤
    │   [ 节点 ] [ 素材 ] [ 设置 ]       │  ← 永久可见，三个同级视图
    ├───────────────────────────────────┤
    │                                   │
    │ Nodes 视图                        │
    │  ├─ 搜索 / 分类 / 筛选             │
    │  ├─ 已注册 AstroPhoto 节点         │
    │  └─ 节点详情（可返回列表）         │
    │                                   │
    │ Assets 视图                       │
    │  ├─ 搜索 / 文件类型筛选            │
    │  ├─ 导入目录（接入后启用）         │
    │  ├─ 拍摄 Session / Frame 分类      │
    │  ├─ 资产列表                      │
    │  └─ 资产详情（可返回列表）         │
    │                                   │
    │ Settings 视图                     │
    │  ├─ 基础：语言 / 主题说明         │
    │  ├─ 软件管理                      │
    │  ├─ 设备与光学链路                │
    │  ├─ 观测地与光污染                │
    │  ├─ 知识库                        │
    │  ├─ 用户记忆与隐私                │
    │  ├─ Agent 上下文与 MCP            │
    │  └─ 系统状态                      │
    │      └─ 模块信息页（可返回）       │
    └───────────────────────────────────┘

ComfyUI 原生 Canvas：实际节点实例、连接关系、节点 Widget 参数
ComfyUI 原生 Workflow 管理：保存、加载、Undo/Redo、执行
```

### 2.1 主导航规范

- 三个主入口为 **Nodes / Assets / Settings**；默认首开 `Assets`（与用户给出的设计图一致，后续可配置）。
- 顶栏如继续保留齿轮图标，它只是进入同一个 `Settings` 视图的**快捷入口**，不得存在另一个设置弹窗或第二份设置状态。
- 主视图切换通过同一行三个 Tab 按钮完成，选中态应明显但不过分强调。无需 React Router：本地导航状态即可。
- 切换视图后保留另外两视图的搜索词、分类筛选、展开树节点及滚动位置（至少在该 Sidebar 挂载生命周期内）。
- 详情页属于所属主视图的**子状态**。点击“返回”回到原列表；点击任意主 Tab 切换到另一主视图；再返回原主视图可恢复之前位置。
- 不强制提供手势“横向滑动切换”：Sidebar 有文件拖拽、横向滚动和选择动作，手势易冲突。**必须支持点击切换、键盘 Tab/左右方向键和清晰的焦点反馈**。

### 2.2 顶栏与状态

- 左：AstroPhoto 品牌及统一线性图标；右：可选状态入口/帮助与关闭（关闭委托 ComfyUI 宿主，不自行操纵其外层 DOM）。
- 不要求将所有状态缩成显眼的彩色 Badge；只有连接失败、不可用等需要决策的信息才突出。
- 不能以“Status API 返回 ok”表示素材服务、节点执行或 Canvas 已成功连接；按对应能力单独判断。

## 3. 视觉规范与响应式要求

| 项目 | 必须满足的设计要求 |
|---|---|
| 视觉 | Minimal UI，少边框、少阴影、少彩色块；无需 Dashboard 大卡片 |
| 主题 | 使用 ComfyUI 设计系统变量，如 `--background`、`--foreground`、`--muted-foreground`、`--secondary`、`--border`、`--primary`；跟随 Light / Dark |
| 样式隔离 | 所有 CSS 限定到 `.astrophoto-ui` 根命名空间，禁止覆盖 `body`、全局 `button`、ComfyUI 原生 `.p-*` 等选择器 |
| 密度 | 标题、导航和搜索固定；列表可滚动；节点行/文件行紧凑但有明确点击区域 |
| 尺寸 | 适配约 280–650px 面板宽度及更宽浮动面板；不写死截图宽度、不造成横向溢出 |
| 字体 | 主文案 13–14px，次文案 12px 左右；系统/宿主字体优先；中英文本不截断关键操作 |
| 图标 | 优先统一线性图标；不要新增 PrimeIcons 依赖；宿主 Tab 图标须有保底方案 |
| 无障碍 | 语义化按钮、`role=tablist`、`aria-selected`、键盘焦点、错误提示可感知、200% 缩放可用 |
| 动效 | 仅用于 Tab 选中、展开、拖拽反馈；遵守 `prefers-reduced-motion` |
| 空态 | 简洁说明 + 一个真实可执行的操作；不能用假数据填充生产界面 |

**来源限制**：Frontend 1.59.1 已不提供宿主 PrimeVue 运行时及 `--p-*` 全局主题变量；不使用模板里的 `pi pi-code` 作为新增 UI 的设计基准。主题与图标规则依据官方 PrimeVue Removal Migration 与 Sidebar Tabs 文档。

## 4. 功能需求：节点 Nodes

### FR-N01 节点列表

- 显示真实注册的 AstroPhoto 节点；节点主键使用稳定的 Node ID，而非多语言显示名。
- 支持文本搜索、按业务类别分组及分类展开/折叠；默认仅列 AstroPhoto 所属节点。
- 展示至少：节点名称、用途短描述、所属类别；软件依赖和当前可用性由真实能力来源提供时再显示。
- 如果 ComfyUI 中仅注册现有 `vue-basic`，只展示真实可见节点，不能把 `Load FITS`、`Siril Stacking` 等规划节点伪装成已注册。

### FR-N02 节点详情

- 点击条目打开 Sidebar 内的节点详情：名称、说明、输入输出类型、节点 ID、文档帮助入口、依赖状态。
- 在没有知识库/软件注册后端时，保留名称和“功能规划中/未配置”的文本，不能显示虚假的参数或兼容性结果。
- 提供返回列表入口；详情属于 Nodes 子视图，不占用新主 Tab。

### FR-N03 添加到 Canvas

- 已注册且可创建的 Node 可以通过点击“+”添加，也可拖入 Canvas 创建同一 Node 类型的实例。
- 使用 ComfyUI 宿主画布 API 创建节点，避免手动写 Graph JSON 绕过编辑与撤销机制。
- 若节点不存在、宿主不支持或创建失败，必须显示错误；不得声称成功。
- 创建后应与原生 Workflow 的保存/Undo/Redo 语义一致。
- **实现前置**：须在 Frontend 1.59.1 实际验证 `createNode`、画布坐标转换、拖拽事件与撤销行为；官方 Sidebar API 不等于完整拖入 Canvas API。

### FR-N04 搜索状态

- 搜索应同时匹配 Node ID、名称和现有别名；输入采用节流/防抖，中文输入法组合输入期间不得意外触发错误过滤。
- 无结果、数据加载中、请求失败、宿主不可用、节点未注册应有不同提示。

## 5. 功能需求：素材 Assets

### FR-A01 素材浏览

- 支持 Capture Sessions 与资产列表的结构化浏览；将 Light / Dark / Flat / Bias / Dark Flat 作为可识别分组标签。
- 列表基础信息：文件名、格式、Frame Type（若有）、状态；详情显示基础 Header 与文件引用（数据接入后）。
- 初版开发可以使用**测试中的 fixtures**；生产模式无真实数据时必须显示空状态，不在产品中硬编码 M31 演示文件。

### FR-A02 导入入口

- 保留“导入拍摄目录”入口。后端导入能力尚未实现时，入口应禁用并说明条件，或进入仅展示规划说明的页面，绝不假扫描。
- 接入后须由用户显式选择目录/授权；UI 不得在挂载时扫描本地目录。

### FR-A03 素材详情

- 点击素材后可查看名称、格式、类别、拍摄 Session、扩展元数据入口；详细 FITS Header 可采用滚动的详情区域或对话框。
- 文件缺失、迁移、无预览、格式不支持均须有明确状态；不默认把高精度 FITS 转为 PNG 后当作科学数据。

### FR-A04 素材即节点

- 拖入一个 Asset：创建固定类型 `AstroPhotoAssetSource`（名称为目标方案）并绑定 `asset_id`。
- 拖入 Session：未来可以创建 `AstroPhotoSessionSource` 并绑定 `session_id`；不应默默展开成数十/数百个节点。
- 同一素材可以拖出多个 Node 实例；不为每个文件注册新的 ComfyUI Node Class。
- 工作流只保存稳定的素材引用与 Node 参数，原始文件由资产系统负责；重新载入时若引用缺失，应可诊断。
- 拖拽进行中应显示 ghost、允许/禁止投放反馈；失败要清理 ghost，不能产生孤儿节点。
- **未接通后端时**不得开放看似成功的拖拽；可以先验证 Sidebar 到 Canvas 的空能力适配与测试。

## 6. 功能需求：设置 Settings（必须有）

### FR-S01 设置主视图

- 与 Nodes、Assets 并列，始终可切换。
- 点击标题栏齿轮或第三个 Tab 均进入同一页面；`Settings` 中包含“基础设置”与“功能模块”两个部分。
- **基础设置**本轮真正需要实现的是：语言模式选择（跟随 ComfyUI / 简体中文 / English）、主题跟随状态（可只读）。不要先设计复杂的业务表单。
- **功能模块**必须展示以下条目及用途，便于产品未来扩展：

| Module ID | 中文名称 | English label | 当前必须显示的职责说明 | 初版行为 |
|---|---|---|---|---|
| `software` | 软件管理 | Software | Siril、PixInsight 的检测、路径、版本及可用能力 | 说明页；规划中 |
| `equipment` | 设备与光学链路 | Equipment & Optics | 相机、望远镜、滤镜和 Optical Train | 说明页；规划中 |
| `observing-site` | 观测地与光污染 | Observing Sites | 观测地点、时区和光污染信息 | 说明页；规划中 |
| `knowledge` | 知识库 | Knowledge | 官方文档、教程、RAG 来源与索引 | 说明页；规划中 |
| `memory` | 用户记忆与隐私 | Memory & Privacy | 偏好、授权、记忆审阅与删除 | 说明页；规划中 |
| `agent` | Agent 上下文与 MCP | Agent Context & MCP | Agent 可使用的任务上下文、连接和工具能力 | 说明页；规划中 |
| `system` | 系统状态 | System Status | Extension 版本、连接及 Capability 状态 | 可读取真实 Status；失败明确显示 |

- 以上为设置**模块归属清单**，不是断言每个模块已经有配置功能。
- Settings 条目可点击进入**模块说明页**，显示模块名称、功能范围、真实可用状态、简短说明、返回按钮。若未实现，统一标记“规划中 / Planned”，不要提供无效的保存按钮。
- 知识和记忆不作为主 Sidebar 的常驻 Tab；实验不在设置中追加独立页面。

### FR-S02 设置子页面导航

- 页面头展示返回箭头、模块标题；返回时恢复 Settings 列表滚动位置。
- 三个主 Tab 仍可以直接切换。选中其他 Tab 不销毁模块信息，返回 Settings 时可回到上一次子页或设置首页；推荐默认回到 Settings 首页以避免意外深层导航。
- 信息页可复用一套 `ModuleInfoPage`，模块名称/说明/状态来自静态元数据注册表 + 可选真实 Capability，而非为七个预留领域创建七套空表单。

### FR-S03 状态真实性

- 提供状态枚举，如 `available | unavailable | planned | loading | error`。
- 所有未接入的后端能力应默认 `planned`/`unavailable`，不能依据 UI 项存在标记 `available`。
- 请求 `/astrophoto/v1/status` 若失败，显示“无法获取状态”；不把 HTTP 失败渲染为“已连接”。
- 已知现有状态接口并不表示画布、上传、外部软件或 RAG 在线，因此状态映射必须使用真实 Capability 与注册信息。

## 7. 国际化（i18n）规格

### FR-I01 语言策略

- 支持：`zh` 简体中文、`en` 英文；其他地区语言如 `zh-CN` / `zh-Hans` / `en-US` 可规范化匹配到支持的语言。
- **默认跟随 ComfyUI 的语言设置**（已知宿主使用 `Comfy.Locale`；需在 1.59.1 运行时验证读取与变更通知接口）。
- 优先级：用户主动选定 AstroPhoto 语言覆盖 > ComfyUI 当前 Locale > 浏览器语言 > 英文回退。
- 选择“跟随 ComfyUI”后若宿主语言改变，Sidebar 应同步切换，且不改写用户宿主全局语言设置。
- 用户手动选择中文/英文只影响 AstroPhoto；不强行修改 ComfyUI 的 `Comfy.Locale`。
- 语言模式存储作为**轻量 UI 偏好**，可使用宿主 Extension Settings；不得与未来的用户记忆数据库混淆。

### FR-I02 翻译文件组织

- 使用 React 模板自带的 `react-i18next` / `i18next`，保留 `ui/public/locales/{en,zh}/main.json` 作为本 Sidebar 的文本来源。
- 不将静态字符串分散写入 JSX；节点技术 ID、文件扩展名、格式标识、软件名保持稳定，仅 UI label 翻译。
- `/locales/{{lng}}/{{ns}}.json` 是原模板演示用的**全局绝对路径**，生产项目应更换为**扩展专属的、支持 ComfyUI 反向代理前缀的资源 URL**，例如以已验证的扩展资源根路径构造；不得与其他插件竞争 `/locales/`。
- 如果语言包加载失败，使用内置英文回退，不能让 Sidebar 空白或永久卡在加载中。
- 目标实现须支持动态切换；切换后所有可见控件、tooltip、空态、Settings 模块名称和说明同步更新。

### FR-I03 翻译 Key 规范

建议统一 `app`、`nav`、`nodes`、`assets`、`settings`、`modules`、`states`、`actions`、`errors` 等分组。

```json
// en/main.json（示意，不是最终完整词典）
{
  "app": { "title": "AstroPhoto" },
  "nav": { "nodes": "Nodes", "assets": "Assets", "settings": "Settings" },
  "settings": { "title": "Settings", "language": "Language", "followComfy": "Follow ComfyUI", "modules": "Modules" },
  "modules": {
    "software": { "title": "Software", "description": "Manage Siril and PixInsight connections" },
    "equipment": { "title": "Equipment & Optics", "description": "Cameras, telescopes and optical trains" },
    "knowledge": { "title": "Knowledge", "description": "Documentation and retrieval sources" },
    "memory": { "title": "Memory & Privacy", "description": "Manage preferences, permissions and memory" }
  },
  "states": { "planned": "Planned", "unavailable": "Unavailable", "loading": "Loading" }
}
```

```json
// zh/main.json（相同 key 结构）
{
  "app": { "title": "AstroPhoto" },
  "nav": { "nodes": "节点", "assets": "素材", "settings": "设置" },
  "settings": { "title": "设置", "language": "语言", "followComfy": "跟随 ComfyUI", "modules": "功能模块" },
  "modules": {
    "software": { "title": "软件管理", "description": "管理 Siril 与 PixInsight 连接" },
    "equipment": { "title": "设备与光学链路", "description": "相机、望远镜与光学链路" },
    "knowledge": { "title": "知识库", "description": "文档与检索来源" },
    "memory": { "title": "用户记忆与隐私", "description": "管理偏好、权限与记忆" }
  },
  "states": { "planned": "规划中", "unavailable": "不可用", "loading": "加载中" }
}
```

**要求**：实际实现补齐表中所有模块及其他公共文案；JSON 必须是标准 JSON，不包含上面代码块里的说明性注释行。

### FR-I04 国际化测试

- en/zh key 集合一致，禁止遗失键、裸 key 显示以及只有部分控件换语言。
- 覆盖主导航、Settings 信息页、模块状态、加载失败、空态、日期/数字格式。
- 中文输入法搜索不会因组合输入影响用户操作；长英文名称在窄面板上可换行或省略并通过 tooltip 读全。

## 8. React 组件、状态和 API 边界

### 8.1 组件约束

- `main.tsx`：只负责与 ComfyUI 宿主注册，挂载/卸载 React Root；不承担资源列表或业务状态逻辑。
- `App.tsx`：UI Shell、三个主视图导航、共享状态与主题入口；不要成为千行巨型组件。
- `pages/`：Nodes、Assets、Settings、ModuleInfo 四个“视图容器”。
- `features/`：节点、素材、设置模块自身的列表、详情和 hooks。
- `host/`：ComfyUI 对接的唯一位置，业务组件不得直接访问 `window.app`、宿主图私有字段或任意宿主 Pinia Store。
- `api/`：把 HTTP 请求和响应校验封装为一致的 `loading/error/data` 约定；业务组件不拼 URL。
- `components/`：只保留通用 UI（Tabs、搜索、空态、状态、行容器），尽量不引入庞大设计框架。
- `utils/i18n.ts`：模板已有实例，继续做全局 i18next 单例，不出现多个互相竞争的 i18n 实例。

### 8.2 状态模型（建议，非现有实现）

```ts
type MainView = 'nodes' | 'assets' | 'settings'
type ModuleId = 'software' | 'equipment' | 'observing-site' | 'knowledge' | 'memory' | 'agent' | 'system'
type Availability = 'available' | 'unavailable' | 'planned' | 'loading' | 'error'
type LanguageMode = 'auto' | 'zh' | 'en'

type SidebarState = {
  activeView: MainView
  nodes: { query: string; expandedCategories: string[]; selectedNodeId?: string }
  assets: { query: string; expandedSessionIds: string[]; selectedAssetId?: string }
  settings: { selectedModuleId?: ModuleId; languageMode: LanguageMode }
}
```

- `query`、选中项与展开状态是 React UI 状态；Asset/Node 元数据来自 API 或宿主，不与 UI 临时状态混存。
- 测试 fixtures 与生产数据访问必须物理隔离；真实服务未实现时使用空态或明确的不可用说明。

### 8.3 宿主接口与生命周期

- 通过 `app.registerExtension` 及 Sidebar API 注册唯一 AstroPhoto Tab。React 在 Sidebar `render(container)` 时挂载。
- 宿主卸载、替换或关闭 SideBar 时必须有确定性的 React Root `unmount()` 清理策略：取消订阅、监听器、请求、拖拽状态及计时器；不重复注册 Sidebar。
- 原 React 模板在 `main.tsx` 中等待 `window.app`、使用轮询并创建 React Root；改造时应将其封装为可测试的宿主适配，优先采用当前环境可验证的官方应用导入/扩展启动方式，避免无限等待和无清理逻辑。
- 当前官方 Sidebar 文档展示 `render`，当前 Frontend 的扩展类型还可能有 `destroy`；必须按锁定的 1.59.1 类型与运行行为验证最终卸载机制，不直接假定最新 main 分支完全一致。
- React Sidebar 不把 `App` 组件注入宿主 Vue 组件树，React 及 ReactDOM 由自身前端构建提供。

### 8.4 Canvas 适配

```text
NodeRow -- add/drag --> host/canvas.ts --> ComfyUI 已注册 Node 实例
AssetRow -- add/drag --> host/canvas.ts --> Asset Source Node + asset_id

所有 UI 调用 host 层：不能从 JSX 直接 new LiteGraph Node。
```

- `host/dragDrop.ts` 与 `host/canvas.ts` 解耦，使 1.59.1 之后的宿主变动只影响适配层。
- 要区分“节点创建成功”“节点放置成功”“宿主 Workflow 已保存”三种不同事件；不能把第一种当成第三种。

## 9. 推荐文件结构（只聚焦 React Template 的 UI）

`[T]` 为官方模板已有文件；`[+]` 是本需求建议增加；`[R]` 为建议重整、合并或替换。

```text
ComfyUI-React-Extension-Template/
├── __init__.py                         # [T] 仅作为宿主接入边界，不在本文件设计后端
├── pyproject.toml                      # [T] 项目元数据；本需求不扩写
│
├── ui/
│   ├── src/
│   │   ├── main.tsx                   # [T/R] 注册 AstroPhoto Tab、React Root 生命周期
│   │   ├── App.tsx                    # [T/R] Sidebar Shell 与导航状态
│   │   ├── App.css                    # [T/R] Shell / Header / 内容区布局
│   │   ├── index.css                  # [T/R] 主题变量映射、根样式隔离
│   │   ├── vite-env.d.ts              # [T] Vite 类型
│   │   ├── setupTests.ts              # [T] Jest + React Testing Library 初始化
│   │   │
│   │   ├── host/                      # [+] ComfyUI 接口适配
│   │   │   ├── app.ts                 # 唯一宿主访问入口 / 类型与准备状态
│   │   │   ├── sidebar.tsx            # Sidebar 注册、createRoot / unmount
│   │   │   ├── canvas.ts             # 添加/创建 Node 实例、操作回执
│   │   │   ├── dragDrop.ts           # Node / Asset 拖入 Canvas 适配
│   │   │   └── locale.ts             # 读取与监听 ComfyUI 语言设置
│   │   │
│   │   ├── navigation/                # [+] 三视图导航与子页返回
│   │   │   ├── types.ts              # MainView、ModuleId 等
│   │   │   └── useSidebarNavigation.ts
│   │   │
│   │   ├── pages/                     # [+] 页面容器，非业务实现
│   │   │   ├── NodesPage.tsx
│   │   │   ├── AssetsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── ModuleInfoPage.tsx
│   │   │
│   │   ├── components/                # [+] 通用视觉组件
│   │   │   ├── SidebarHeader.tsx
│   │   │   ├── PrimaryTabs.tsx
│   │   │   ├── ResourceSearch.tsx
│   │   │   ├── ResourceRow.tsx
│   │   │   ├── StatusText.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── LoadingState.tsx
│   │   │
│   │   ├── features/
│   │   │   ├── nodes/                  # [+] Nodes 业务展示
│   │   │   │   ├── NodeList.tsx
│   │   │   │   ├── NodeRow.tsx
│   │   │   │   ├── NodeDetails.tsx
│   │   │   │   └── useNodes.ts
│   │   │   ├── assets/                 # [+] Assets 业务展示
│   │   │   │   ├── SessionTree.tsx
│   │   │   │   ├── AssetList.tsx
│   │   │   │   ├── AssetRow.tsx
│   │   │   │   ├── AssetDetails.tsx
│   │   │   │   └── useAssets.ts
│   │   │   └── settings/               # [+] 设置模块信息披露
│   │   │       ├── moduleRegistry.ts  # 七个模块的静态名称/说明/i18n Key
│   │   │       ├── ModuleList.tsx
│   │   │       └── LanguageSelector.tsx
│   │   │
│   │   ├── api/                       # [+] HTTP 层，初期仅接真实可用接口
│   │   │   ├── client.ts             # URL、请求与错误处理
│   │   │   ├── status.ts             # 已有 AstroPhoto Status API
│   │   │   ├── nodes.ts              # /object_info / Node Catalog 映射
│   │   │   └── assets.ts             # 待真实资产 API 就绪时启用
│   │   │
│   │   ├── utils/
│   │   │   ├── i18n.ts               # [T/R] i18next 单例与扩展私有资源 URL
│   │   │   └── formatters.ts         # [+] 文本、数字、日期格式化
│   │   │
│   │   ├── __tests__/
│   │   │   ├── app-navigation.test.tsx
│   │   │   ├── settings-modules.test.tsx
│   │   │   ├── locale-switch.test.tsx
│   │   │   ├── nodes-list.test.tsx
│   │   │   ├── assets-list.test.tsx
│   │   │   ├── sidebar-lifecycle.test.tsx
│   │   │   ├── canvas-adapter.test.ts
│   │   │   └── translation-keys.test.ts
│   │   │
│   │   └── test-fixtures/             # [+] 仅测试用的 Node / Asset / Status 数据
│   │       └── mockData.ts
│   │
│   ├── public/
│   │   └── locales/
│   │       ├── en/main.json           # [T/R] 英文完整词典
│   │       └── zh/main.json           # [T/R] 中文完整词典
│   │
│   ├── package.json                   # [T] React、i18next、Jest、Vite 脚本
│   ├── package-lock.json              # [T] 与 npm 对应的唯一锁文件
│   ├── vite.config.ts                 # [T/R] 宿主 import / build 输出与资源路径
│   ├── tsconfig.json                  # [T]
│   ├── tsconfig.node.json             # [T]
│   ├── jest.config.js                 # [T/R] 一处 Jest 配置
│   ├── eslint.config.js               # [T/R] 一处 ESLint flat config
│   └── .prettierrc                    # [T]
│
└── dist/                              # [生成] React 构建产物；不是源代码
```

**整理规则**：

- 只使用一个 `vite.config.ts`（移除/忽略重复的 `vite.config.js`）。
- 只使用一个 `eslint.config.js`（不要让 `.eslintrc.json` 与它竞争）。
- 使用 `jest.config.js` + `src/setupTests.ts`；不保留作用重复的 `jest.setup.js`。
- React 模板目前使用 `npm` + `package-lock.json`；如果实际仓库决定保留 `pnpm`，应统一改为 `pnpm-lock.yaml`，**一个 UI 项目不要同时维护两套锁文件**。
- 不预建 `experiments/`、`workflow/`、大量空 `settings/*` 表单或第二个 React 应用。
- 生产 `dist/` 只放编译产物，不包括 Jest fixtures、TS 源码或开发文档。

## 10. 页面组合关系

```text
main.tsx
  └─ host/sidebar.tsx            # ComfyUI 唯一入口，负责根卸载
      └─ App.tsx
          ├─ SidebarHeader
          ├─ PrimaryTabs           # Nodes / Assets / Settings
          └─ ViewContainer
              ├─ NodesPage
              │   ├─ ResourceSearch
              │   ├─ NodeList
              │   │   └─ NodeRow
              │   └─ NodeDetails
              ├─ AssetsPage
              │   ├─ ResourceSearch
              │   ├─ SessionTree
              │   ├─ AssetList
              │   │   └─ AssetRow
              │   └─ AssetDetails
              └─ SettingsPage
                  ├─ LanguageSelector
                  ├─ ModuleList
                  └─ ModuleInfoPage
```

**代码约束**：页面 `Page` 管 UI 组合；`features` 管特定领域组件；`host` 管 ComfyUI 交互；`api` 管网络；`utils/i18n.ts` 管翻译。不要把完整资源表、真实 Graph 操作和语言文件加载全部放在 `App.tsx`。

## 11. 页面状态、异常与边界场景

| 事件 | 预期行为 |
|---|---|
| 首次打开 AstroPhoto | 默认 `Assets`；显示真实数据或空态；Tabs/Settings 总是可用 |
| 切换 Nodes → Settings → Assets | 所有页面可随时进入；无闪退、无重复挂载 |
| 设置中点击 Knowledge | 打开说明子页，明确“规划中”，可返回设置首页 |
| 设置中切换到英文 | Tab、模块标题、说明、状态立刻显示英文，当前子页不跳走 |
| ComfyUI 从中文切到英文，AstroPhoto 设为 auto | Sidebar 自动跟随，搜索词和浏览位置保持 |
| ComfyUI 从中文切到英文，AstroPhoto 手动设为 zh | AstroPhoto 继续中文，不覆盖宿主设置 |
| 节点目录为空 | 显示“没有可用节点”，不出现测试数据 |
| 素材 API 未实现 | 显示未接入提示；不可启用假导入/拖拽 |
| 资产引用无法解析 | 明确缺失/不可用原因，不显示错误的预览或伪造路径 |
| 后端超时、500、无效 JSON | 分别显示可诊断失败；禁止把失败转成成功态 |
| 拖拽取消或在 Canvas 外释放 | 无 Node 创建，ghost/监听正确清理 |
| Sidebar 关闭/再次打开 | 不泄漏 React Root、监听器、计时器；只注册一个 Tab |
| 浮动面板/窄面板/200% 缩放 | 不出现横向溢出，操作控件仍可用 |

## 12. 验收标准（Acceptance Criteria）

### P0：本次最小完整 Sidebar（必须全部通过）

- [ ] Sidebar 仅注册一个 `AstroPhoto` 入口，显示品牌，能够按宿主方式关闭/重开。
- [ ] Nodes / Assets / Settings 三个 Tab 可以随时横向点击切换，激活状态正确；键盘可操作。
- [ ] Settings 可通过第三个 Tab 及顶部齿轮进入，内部只有一份 Settings 状态。
- [ ] Settings 展示七个预留模块及其中文/英文名称、职责与真实“规划中”状态。
- [ ] 点击每个模块进入简洁说明页，可返回；没有无效保存/安装操作。
- [ ] 语言模式提供 auto/zh/en，切换后所有 UI 文案更新；英文作为可靠回退。
- [ ] 视觉遵守简约主题规范，并适配 ComfyUI Light / Dark。
- [ ] 生产页面无硬编码 M31、Siril 节点等虚构业务数据；无后端时显示明确空态。
- [ ] React mount/unmount 没有重复节点、事件监听或控制台错误。
- [ ] Jest/RTL 至少覆盖导航、设置模块、国际化、空态和生命周期；TypeScript、Lint、Vite Build 通过。

### P1：节点真实接入

- [ ] NodesPage 根据真实 `/object_info` / Catalog 获得节点，不显示不存在的 Node。
- [ ] 允许搜索、按分类浏览、查看详情。
- [ ] 点击添加 Node 成功且符合宿主 Undo/Redo；拖入行为在真实 1.59.1 宿主通过。
- [ ] 失败和节点不可用状态可诊断；不出现假成功。

### P2：素材真实接入

- [ ] AssetsPage 接入实际资产 API，能够展示会话、分组、素材列表和详情。
- [ ] Asset Source Node 已真实注册、可解析 `asset_id`，再启用素材添加/拖拽。
- [ ] 拖入素材后创建对应 Node 实例，保存 ComfyUI Workflow 后可重载并维持正确引用。
- [ ] 文件缺失、权限不足、格式不支持等情况有完整错误反馈。

### 最终宿主验收

- [ ] 在 **ComfyUI Backend 0.45.0 + Frontend 1.59.1** 上实际加载测试；Jest Mock 不代替真实宿主。
- [ ] 验证 Sidebar 的显示/隐藏/切换、ComfyUI Light/Dark、语言跟随、React Root 资源清理。
- [ ] 验证真实 Canvas 创建及 Workflow 保存重开；在宿主现存 Torch 启动问题未解决前不得将本项标“通过”。

## 13. 优先实施边界

建议先交付 P0 **完整但无假业务能力**的 Sidebar：三视图 + 设置模块披露 + 中文/英文 + 最小状态适配 + 测试。其后 P1 连接真实 Nodes，再 P2 连接真实 Assets。

这里的 `P0/P1/P2` 是功能依赖顺序而不是日期或强制一次性造完的脚手架。即使先只实现 P0，也应让用户始终能够看到 Nodes 和 Assets，而不是把未完成页面从导航中隐藏；空态和不可用说明是正式体验的一部分。

## 14. 官方来源及本设计与模板的差异

- [ComfyUI React Extension Template（官方仓库）](https://github.com/Comfy-Org/ComfyUI-React-Extension-Template)：提供 React + TypeScript、Vite、i18next、Jest 和 React Sidebar 示例。
- [模板 main.tsx](https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/src/main.tsx)：仍有 `window.app` 轮询、PrimeIcons、示例 commands/Bottom Panel；本设计不照抄非必要的演示功能。
- [模板 i18n.ts](https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/src/utils/i18n.ts)：使用全局 `/locales/{{lng}}/{{ns}}.json`、navigator 优先；本设计要求改为扩展专属路径并优先跟随宿主语言。
- [ComfyUI Sidebar Tabs](https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs)：官方 Sidebar 注册、React Mount 示例与图标建议。
- [ComfyUI Settings API](https://docs.comfy.org/custom-nodes/js/javascript_settings)：宿主设置项读取、写入与变更处理；仅适用于轻量 UI 偏好，非未来业务数据库。
- [ComfyUI Custom Node i18n](https://docs.comfy.org/custom-nodes/i18n)：说明 Node 定义翻译与 `main.json`、`settings.json` 的边界；React 自定义组件的完整本地化需要自行实施。
- [PrimeVue Removal Migration](https://docs.comfy.org/custom-nodes/js/primevue-removal-migration)：Frontend 1.59.1 相关主题变量与图标迁移要求。
- [V3 Node API](https://docs.comfy.org/custom-nodes/v3_migration)：实际 Node 注册仍归 V3；React 模板现有 Python V1-style 脚手架不应覆盖现有项目的 V3 实现。
- [ComfyUI Frontend Settings 参考](https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/SETTINGS.md)：宿主设置使用 `Comfy.Locale`；具体变更监听策略以锁定的 1.59.1 运行结果为准。

### 最终冻结的 UX 结论

**一个 AstroPhoto Sidebar，三个同级主视图（Nodes / Assets / Settings），Settings 说明七个未来模块，中文英文完整适配；节点与素材都能成为 Canvas Node 的来源；Workflow 与 Node 参数继续由 ComfyUI 原生管理。**
