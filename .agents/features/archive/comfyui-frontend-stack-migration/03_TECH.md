# 技术设计｜AstroPhoto 前端迁移至 ComfyUI 官方技术栈

**状态**　已对齐实际实现 · 2026-11-21

**依据**　[PRD v1.3](01_PRD.md) · [UI/UX 基线](02_UI_UX.md)

## 1. 技术方向

将 AstroPhoto 公共前端收拢到 `frontend/src/`，以 Vue 承载侧栏、资料库、绘图和处理 Bundle 的共享入口。设备与光路归入资料库，Siril 专属界面、节点交互和处理接入归入 `extension/siril/`。ComfyUI 继续负责侧栏容器、画布、工作流和队列。以现有界面为基线，逐模块对照迁移前后的布局、入口和操作。按已确认决定保留 Assets 标签与默认所在页，仅呈现占位文案，见第 5 节。 [当前入口](../../../../extension/frontend-entry.ts) · [当前构建配置](../../../../frontend/vite.config.mts)

### 官方版本与本项目选择

以 PRD 指定的 **ComfyUI `v0.46.0` + Frontend `v1.59.6`** 为正式宿主验收组合。下表是该前端标签的依赖声明，带 `^` 的值为范围。AstroPhoto 的版本以实施时通过锁定安装、构建和宿主验证的组合为准。 [ComfyUI 发行依赖](https://github.com/Comfy-Org/ComfyUI/blob/v0.46.0/requirements.txt) · [官方前端依赖目录](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/pnpm-workspace.yaml)

| 层 | 官方 `v1.59.6` | AstroPhoto 实现 |
| --- | --- | --- |
| 组件与语言 | Vue `^3.5.42`、TypeScript `^6.0.3` | Vue `3.5.42`、TypeScript `6.0.3`，按需求用 Vue SFC 及 Vue JSX，覆盖侧栏、绘图和科学节点。 |
| 组件与样式 | Reka UI `2.11.0`、Tailwind CSS `^4.3.2`、ComfyUI Design System | 使用 Reka UI 与作用域内的 Tailwind，沿用宿主主题变量。保留可复用的 Vue 单选和多选源码，移除 React 包装。绘图按钮和提示改用同栈控件，退出 PrimeVue/Aura。 |
| 状态、翻译与导航 | Pinia `^4.0.2`、Vue I18n `^11.4.8`、Vue Router `^5.2.0` | 现有规模下采用 Vue refs、composables 和挂载会话对象。表单草稿、绘图与预览状态按所属组件或节点管理。统一词条来源和宿主语言适配，按挂载根管理 Vue I18n 生命周期。导航沿用侧栏内部状态和宿主注册入口。 |
| 构建与测试 | Vite `^8.2.2`、pnpm `11.13.1`、Vitest `^5.0.2`、Playwright `^1.63.0` | 保留单一 pnpm 项目和 Vite 构建。组件与逻辑测试统一到 Vitest，真实宿主使用 Playwright。同步迁移类型检查和 lint，退出 React 专用的 Vite、Jest、Testing Library 与 CI 配置。 |

- **Node 与 pnpm 基线。** 官方标签要求 Node `>=26.8.2 <27`，使用 pnpm `11.13.1`。本机 Node 和当前工作树 CI 均为 `26.13.1`，CI 与项目 `packageManager` 都指定 pnpm `11.13.1`。本次从仓库根查询的 pnpm 为 `11.25.0`，实施验证须在 `frontend/` 确认实际生效的版本。本次实施通过 `npx --yes pnpm@11.13.1` 锁定本地命令运行版本。CI 远程结果单独记录。 [官方环境要求](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/package.json#L247-L251) · [项目 CI](../../../../.github/workflows/ci.yml)
- **宿主类型与宿主运行时分开验证。** npm 注册表查询返回 `@comfyorg/comfyui-frontend-types@1.59.1`，查询 `@1.59.6` 返回 404。可先以现有已发布类型作编译起点，用官方 `v1.59.6` 源码和真实宿主逐项核验调用差异，再决定是否需要最小适配。 [现有依赖](../../../../frontend/package.json) · [官方扩展类型](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/types/extensionTypes.ts)

### Vite 工具链与独立扩展构建

对齐 ComfyUI Frontend `v1.59.6` 的 Vite 工具链，按需复用官方配置。官方 Vite 配置构建宿主前端应用，AstroPhoto 维护自己的 `frontend/vite.config.mts` 和依赖锁。宿主 Frontend `1.59.6` 负责运行扩展，AstroPhoto 的 Vite 负责生成扩展构件，宿主类型包 `1.59.1` 按 D-03 单独核验。 [官方 Vite 配置](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/vite.config.mts#L541-L547) · [本地配置](../../../../frontend/vite.config.mts)

| 范围 | 迁移决定 |
| --- | --- |
| Vite 核心 | 迁移前为 Vite `6.3.5` 和 Vue 插件 `5.2.3`。现行锁为 Vite `8.2.2`、Vue 插件 `6.0.8`、Tailwind 与其 Vite 插件 `4.3.2`。在本项目锁文件记录实际解析版本和插件 peer。 [官方依赖与锁](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/pnpm-workspace.yaml) · [官方锁文件](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/pnpm-lock.yaml) · [本地锁文件](../../../../frontend/pnpm-lock.yaml) |
| 配套工具 | Vue JSX 插件用于保留迁移前视图布局与事件结构，配合 Vue 3、TypeScript 6、`vue-tsc`、Vitest `5.1.1` 和 Playwright `1.65.1`。构建不装 Bundle 专用 DevTools，旧 React、PrimeVue/Aura 和 Jest 链已退出。 |
| 配置复用 | 按模块复用官方 Vue 插件接法、Tailwind Vite 插件及实际使用的主题、图标或样式扫描做法。仅纳入扩展有消费的配置和依赖，保留样式作用域。宿主应用专用的 HTML 入口、Comfy API 生成插件、部署代理和发布插件由官方宿主仓库维护。 |
| 扩展交付 | AstroPhoto 的独立入口已由 `frontend/entry.ts` 切换至 `extension/frontend-entry.ts`，所有 Bundle 共用这一套构建。保持 `WEB_DIRECTORY = "./js"` 与 `js/main.js`、`js/assets/main.css`。延续 `comfy:app`、`comfy:api` 的外部模块和宿主相对路径契约，CSS 由扩展按脚本相对路径加载。 [宿主交付入口](../../../../__init__.py) |

验收覆盖锁定安装、类型检查、lint、Vitest Chromium、独立构建、构件与代理校验，以及官方发行组合下的实际加载。构建配置和测试替身分别核对。已有宿主启动证据用于基线，新工具链产物仍需重新验收。具体文件、命令和断言见 [开发规格的构建与打包退出面](04_DEV.md#构建测试与打包退出面--步骤-6)。

### 官方源码优先复用

按 FR-09，在实现或迁移每个模块前，先用验收宿主对应的官方前端标签查找组件、交互和接入代码。有公开接口时直接调用。可独立复用的上游源码优先沿用已有移植版本，缺少本地副本时再移植所需部分，仅适配数据映射、样式作用域、语言和宿主接入差异。官方实现只覆盖部分需求时，复用已覆盖部分，只为缺口追加本地实现。

每项复用记录上游标签或提交、源码路径、本地位置和适配点，保留原许可与归属说明。自行实现的部分记录上游缺失或不适用的具体原因，并验证适配后的关键行为。所需公共组件若已有稳定实现，可直接使用，避免为迁移重写一套。 [现有组件来源记录](../../../../frontend/src/vendor/comfyui/README.md)

| 场景 | 设计做法 |
| --- | --- |
| 侧栏导航 | 用官方媒体侧栏的 `TabList` 核对标签布局、焦点和选中态。优先复用合适的现有 AstroPhoto 组件；移植官方源码时记录上游标签、路径、许可和本地改动。 [官方媒体侧栏](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/sidebar/tabs/AssetsSidebarTab.vue) |
| 设备、光路和环境选择器 | 直接使用现有已移植的 Vue 组件，按验收所需核对官方单选与多选实现。原 React 包装中的空值、禁用态、选项转换和无障碍标签属于行为基线。 [本地组件来源](../../../../frontend/src/vendor/comfyui/README.md) · [官方单选](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/single-select/SingleSelect.vue) · [官方多选](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/multi-select/MultiSelect.vue) |
| 资料库界面 | 设备列表和现有素材页已共用搜索与筛选控件。优先延续这一复用，资料库内共用列表和详情外壳及空态、错误反馈；由各页面提供行内容、字段、筛选项和操作。设备校验、光路规则、版本冲突和素材规则各归所属领域。 [设备列表](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/EquipmentList.tsx) · [素材页现状](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/assets/AssetsPage.tsx) |
| 主题与弹层 | 扩展入口统一加载 CSS。扩展样式及挂载到宿主 DOM 的弹层均使用明确的作用域，继承宿主明暗主题，避免全局样式重置影响 ComfyUI 和其他扩展。 [官方主题变量迁移说明](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/docs/extensions/primevue-removal-migration.md) |

## 2. 文件结构

保留一套 pnpm 依赖与 Vite 构建。公共前端以 `frontend/src/` 为源码根，原 `frontend/ui/` 的内容按职责迁入公共前端或 Siril Bundle。下图为实际目录的职责概览。

```text
仓库根目录/
├── frontend/
│   ├── src/
│   │   ├── main.ts              # 公共前端初始化，接收组装入口提供的 Bundle
│   │   ├── host/                # ComfyUI 侧栏、节点 Widget、画布与宿主设置适配
│   │   ├── api/                 # 共用 HTTP 客户端及公共业务 API
│   │   ├── bundles/             # Bundle 接入类型与生命周期
│   │   ├── features/
│   │   │   ├── assets/          # 素材页占位（仅文案，无数据访问），待后续 Feature 替换
│   │   │   ├── sidebar/         # 侧栏外壳、设置导航与通用软件设置入口
│   │   │   ├── nodes/           # 节点目录、收藏与通用预览和 Inspector 外壳
│   │   │   ├── storage/         # 工作区、缓存、环境与预览显示设置
│   │   │   ├── library/         # 资料库界面，本次迁移设备与光路
│   │   │   │   ├── pages/       # 设备与光路页面及其业务交互，后续可接入素材页
│   │   │   │   └── components/  # 资料库共用的列表、详情、状态与工具栏组件
│   │   │   └── drawing/         # 画板、工具栏及像素序列化
│   │   ├── shared/              # 跨业务的组件和 composable
│   │   ├── i18n/                # Vue I18n 初始化与宿主语言映射
│   │   ├── styles/              # 扩展样式入口、主题令牌与作用域
│   │   └── vendor/comfyui/      # 官方移植源码及版本、许可和适配记录
│   ├── tests/                   # Vitest 与真实宿主测试
│   ├── scripts/                 # 产物和代理路径验证
│   └── package.json、pnpm-lock.yaml 与前端配置
├── extension/
│   ├── frontend-entry.ts        # 产品组装入口，明确接入随本版本交付的 Bundle
│   └── siril/                   # Siril Bundle，拥有 Python 节点、路由与处理接入
│       └── frontend/            # Siril 注册、配置界面、节点交互、预览、API 及词条
├── js/                          # ComfyUI 运行时前端构件
└── locales/                     # 现有发行语言资源路径
```

资料库共用组件接受通用的展示数据、插槽和用户操作事件。设备与光路页面负责查询映射、表单校验、保存和冲突处理，通用组件可用独立样例验证，无需提前开发素材页。搜索和筛选等已有跨业务组件继续放在 `shared/`，资料库特有的复合布局放在 `library/components/`。

产品组装入口可以同时导入公共前端和 Siril，公共前端源码只消费 Bundle 接口。生产构建继续交付根目录 `js/main.js` 与 `js/assets/main.css`，沿用 `WEB_DIRECTORY` 和代理子路径。根 `locales/` 保留现有交付路径，Siril 自己维护专属词条并通过 Bundle 接入。现有 Registry 发布检查只允许指定根目录，实施时需同步确认新增 `extension/siril/` 的 Python 运行文件进入发行包，Vue/TS 源码通过既有 `js/` 构件交付。 [宿主交付入口](../../../../__init__.py) · [发行包检查](../../../../scripts/release.py)

## 3. 接口与数据流

| 接口 | 数据流与兼容约束 |
| --- | --- |
| 侧栏与画布 | `registerSidebarTab` 提供 DOM 容器，AstroPhoto 在 `render` 中挂载 Vue，在 `destroy` 中卸载。沿用 `astrophoto.sidebar`。节点添加、拖放、只读限制和撤销记账走现有宿主适配。现有 LiteGraph 工厂属于版本适配点，集中在 `host/`，在经典画布与 Nodes 2.0 分别验证。 [侧栏 API](https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs) · [现有画布适配](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/canvas.ts) |
| 业务 HTTP | 公共客户端经宿主 `app.api.fetchApi` 提供相对路径请求、取消、错误转换和请求 ID，领域接口各自校验响应。节点目录沿用 `/object_info`，设备、光路和存储沿用现有 `/astrophoto/v1/*` 契约。Siril 专属请求和响应校验由 Bundle 所有。 [现有 HTTP 客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/client.ts) · [现有 Siril 客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/siril.ts) |
| Bundle 注册与呈现 | 组装入口传入已选 Bundle。每个 Bundle 提供稳定标识、能力状态读取方式、通用软件设置中要呈现的内容，以及按宿主节点类型注册的 Widget 或 Inspector。公共前端负责渲染容器、主题语言、宿主操作和挂载清理。节点目录依宿主已注册节点展示，软件设置通过共享入口呈现，公共层的实现与导航均不绑定特定软件。 |
| Siril 运行链 | Siril Bundle 接管专属设置 UI、参数、预览请求和执行回执。宿主节点及连线仍是工作流的权威数据，Inspector 经现有宿主变更流程更新参数。候选结果供界面预览，正式结果来自原生队列及回执，保留原节点 ID、Widget 键和 `IMAGE_PATH`，保持 FITS 精度与元数据。服务端沿用现有 `on_load` 注册、可信本机检查和业务 API 契约。 [现有节点接入](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) · [现有路由](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/api/siril.py) |
| 绘图 | 工作流保存继续经宿主 Widget 的 `getValue` / `setValue` 恢复像素。队列继续经 `serializeValue` 上传临时 PNG 并提交带 `[temp]` 标记的引用。保留 `vue-basic`、`CUSTOM_VUE_COMPONENT_BASIC` 与现有序列化字段。 [现有序列化](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/VueExampleComponent.vue) |

## 4. 状态、失败处理与验证边界

- **挂载和释放。** 以侧栏实例或节点 Widget 为单位管理挂载，避免重复根节点。销毁时清理请求、计时器、监听器、观察器及预览对象 URL，并保留原宿主清理回调。正在运行的请求结果只更新仍有效的页面或节点。
- **Bundle 不可用。** 未接入 Bundle 时，共享入口能正常加载。已接入但软件不可用时，状态显示在共享软件设置或对应节点内，其他前端功能继续可用。初始化与网络请求由明确的挂载或显式操作触发，加载公共前端源码时无需初始化 Siril。
- **读取、提交和冲突。** 保留读写失败、重试和冲突提示。设备和光路保存失败时保住输入，过期响应不覆盖更新的本地状态。宿主 API 或画布不可用时保留现有反馈路径。
- **验证范围。** Vitest 承接旧测试保护的业务行为，真实宿主覆盖实际下拉框、键盘、语言及主题、代理子路径、两种画布模式和旧工作流重开。验收时检查公共前端源码的 Bundle 依赖方向，以及有无 Siril 时共享入口的行为。按模块对照界面和操作，记录 FR-09 的官方来源和适配证据。绘图验收停在临时 PNG 引用提交，构建产物和测试链均核对 React 已退出。

## 5. 实施前核对

- **素材页入口（已定）。** 保留 `Assets` 标签，内容为 `features/assets/` 下的 Vue 占位页，只说明“素材页将在后续版本提供”，不发起请求、不引用业务接口；默认落点保持现有 Assets。本轮需删除 React `AssetsPage`/`ImportDialog` 及其引用，后端素材路由不动。占位页在窄栏、中英文与首屏无内容的体验要点记于 [UI 基线](02_UI_UX.md#已决定--assets-导航)。 [现有默认入口](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/app/App.tsx)
- **宿主接入差异。** 先在官方发行组合确认原有自定义 Widget、侧栏销毁与画布操作能否直接复用。新增适配只覆盖实际发现的接入差异，并留在 `host/` 层。

## 6. 决策记录

状态沿用 PRD 口径：`Confirmed` 为用户已认可基线，`Inferred` 为有依据推断，`Proposed` 为设计建议，`Open` 待决定。

| 编号 | 问题 | 状态 | 当前结论与依据 | 影响 FR | 可逆性 |
| --- | --- | --- | --- | --- | --- |
| D-01 | 素材页标签去留与默认落点 | Confirmed | 2026-11-21 决定：保留标签，内容为 Vue 占位页，无数据访问；默认落点保持 Assets。现在入口地址不变，只换实现。 | FR-01、FR-02、FR-07 | 高：接线集中在单一导航状态 |
| D-02 | 构建工具链对齐 | Confirmed | 对齐官方 `v1.59.6` 的 Vite 工具链，按需复用配置。Node 和 CI pnpm 已有目标版本配置，Vite 8 及配套依赖已实施；实际验证见报告。 | FR-01、FR-09 | 高：工具链升级可独立验收与回退 |
| D-03 | 宿主类型包与运行时不一致 | Open | npm 仅发布 `1.59.1` 后直接跳到 `1.60.0`，无 `1.59.6`（`latest` 标签仍停在 `1.57.6`）。拟锁定 `1.59.1` + 逐符号对照官方 `v1.59.6` 源码；不默认切 `1.60.0`，以免引入 1.59.6 不存在的 API。 | FR-01、FR-09 | 高：类型声明不进入运行产物 |
| D-04 | 通用 FITS 与 `IMAGE_PATH` 归属 | Inferred | 已将通用 FITS 解析、来源组件及 `/previews/settings` 拆到公共层，独立提供 `IMAGE_PATH`，原节点 ID 与 URL 保持。 | FR-05、FR-08 | 中：切分前不移动后端文件 |
| D-05 | 退出 PrimeVue/Aura 的范围 | Confirmed | PRD FR-01 要求活跃界面退出 React 与 React 专用工具；PRD FR-07 要求绘图控件同栈化。迁移不保留跨框架兼容层。 | FR-01、FR-06 | 低：退出后需整体回滚入口 |
| D-06 | 单一独立扩展构建 | Confirmed | AstroPhoto 维护自己的 Vite 配置和锁。Siril 经 `extension/frontend-entry.ts` 组装，共用 AstroPhoto 构建并交付到 `js/`。 | FR-01、FR-08 | 中：新增目录但不改宿主交付路径 |

## 7. 风险与回退

| 编号 | 风险与触发条件 | 影响面 | 当前处置 | 回退方式 |
| --- | --- | --- | --- | --- |
| R-01 | Vite、Vue 插件、TypeScript 或 Vitest 的 peer、配置及构件行为不兼容 | CASE-01 全线 | Node 已对齐，实施时锁定完整依赖、复跑 CI 和构件检查，记录失败的具体环节 | 回退本次工具链变更用于恢复基线，Vite 对齐保持待验收 |
| R-02 | 类型包 `1.59.1` 与宿主运行时 `1.59.6` 的 API 差异在编译期不可见 | 侧栏、画布、Widget 注册 | 按 D-03 逐项源码对照，运行时以真实宿主实测为准 | 局部最小类型声明，不改运行时调用 |
| R-03 | `window.LiteGraph` 工厂在两种画布或宿主版本下行为不同 | CASE-02 节点添加与撤销 | 适配集中在 `host/`，两种画布分别验证 | 保留现有画布适配，不动调用方 |
| R-04 | 迁移分支与旧入口同时注册，出现双侧栏或双 Widget | CASE-10、CASE-02 | 同一宿主会话只注册一套，入口切换放在步骤 6 | 恢复旧 `frontend/entry.ts` 作为唯一入口 |
| R-05 | `scripts/release.py` 的 `allowed_roots` 为 `{nodes, astrophoto, js, locales}`，不含 `extension/` | CASE-01 发行构件缺 Python 运行文件 | 步骤 6 前修改白名单并复验归档 | 暂只迁前端，不移动 Siril Python 文件 |
| R-06 | 节点 ID、Widget 键或序列化字段漂移，旧工作流无法恢复 | CASE-05、CASE-06 | 保留 `vue-basic`、`CUSTOM_VUE_COMPONENT_BASIC`、`IMAGE_PATH` 与 `{image}` 契约并用 `F-WORKFLOW` 验证 | 不改节点注册与序列化结构 |
| R-07 | 占位素材页被误读为功能缺失，或后续 Feature 替换时遗漏 | CASE-07、CASE-10 | 文案明确“后续版本提供”，后续 Feature 直接替换该页面 | 保留占位与导航，不改其他模块 |

## 8. 实现切片映射

切片与 [开发规格第 2 节](04_DEV.md#2-迁移顺序) 的步骤编号一致，此处只固定依赖顺序与出口证据，逐函数设计见 04_DEV。

| 切片 | 覆盖 FR | 前置 | 主要产物 | 出口证据（CASE） |
| --- | --- | --- | --- | --- |
| 0 基线与复用清单 | FR-02 至 FR-09 | 目标宿主与旧工作流样本 | 迁移前界面、工作流、复用来源记录 | 07，含 01–06 的基线 |
| 1 Vue 公共基础与打包入口 | FR-01、FR-07 至 FR-09 | 切片 0、D-02 | `frontend/src/`、`bundles/`、`extension/frontend-entry.ts` | 01、08 |
| 2 侧栏外壳、节点目录与绘图 | FR-02、FR-06、FR-07、FR-09 | 切片 1 | 侧栏与节点目录 Vue 实现、素材占位页、绘图控件替换 | 02、06、07、10 |
| 3 存储、环境与系统设置 | FR-03、FR-07、FR-09 | 切片 2 | `features/storage/` | 03、08-A |
| 4 设备与光路迁入资料库 | FR-04、FR-07、FR-09 | 切片 2 | `features/library/pages`、`components` | 04、07 |
| 5 Siril Bundle 接入 | FR-05、FR-07、FR-08、FR-09 | 切片 2、D-04 | `extension/siril/`、Bundle 契约 | 05、08-B |
| 6 切换入口并移除 React | FR-01、FR-02、FR-07 至 FR-09 | 切片 3–5、D-01、R-05 | 正式入口、依赖与 CI 退出 | 01、10 |
