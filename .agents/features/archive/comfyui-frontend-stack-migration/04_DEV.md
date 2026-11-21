# 开发规格与实现计划｜AstroPhoto 前端迁移至 ComfyUI 官方技术栈

**状态**　PH-04C 主实现已落地，PH-05 测试规格已按实际入口冻结，PH-06 验收进行中。第 2 节保留原迁移顺序，第 6 节记录实现与尚待放行的证据。实现前的启动说明见 [references/04C-implementation-prompt.md](references/04C-implementation-prompt.md)。

**依据**　[PRD v1.3](01_PRD.md) · [UI/UX 基线](02_UI_UX.md) · [技术设计](03_TECH.md) · [预计测试](05_TEST_PLAN.md)

## 1. 实施基线与已定决定

- 首先固定正式验收组合为 ComfyUI `v0.46.0` 与 Frontend `v1.59.6`。准备隔离的数据根及宿主用户目录，保留含绘图、FITS 来源和 AutoStretch 的迁移前工作流。使用相同主题、语言、侧栏宽度和业务状态记录各模块的迁移前界面。历史验证可作参考，本次结果需要重新记录。 [开发与宿主验证说明](../../../../docs/development.md)
- **当前环境事实（`4c0cf4d` 工作树核对）。** 本机 Node 与当前 CI 配置均为 `26.13.1`；CI 与 `frontend/package.json` 指定 pnpm `11.13.1`。仓库根的 shell 查询为 pnpm `11.25.0`，实施前在 `frontend/` 核对构建实际使用的版本。前端锁仍为 Vite `6.3.5`、Vue 插件 `5.2.3`，Node 配置变更后的 CI 结果待验证。隔离宿主 `127.0.0.1:8188` 已运行 ComfyUI `v0.46.0` / Frontend `1.59.6` 并通过 AstroPhoto 启动与加载冒烟；旧工作流和界面对照仍在第 0 步采集。 [CI](../../../../.github/workflows/ci.yml) · [前端锁文件](../../../../frontend/pnpm-lock.yaml)
- **已定｜素材页入口（2026-11-21）。** 保留 `Assets` 标签，内容为 `features/assets/` 下的 Vue 占位页，仅文案提示“将在后续版本提供”，不请求、不引用素材接口；默认落点保持 Assets。后端素材路由保留不动，`AssetsPage`/`ImportDialog` 随第 6 步退出。 [现有侧栏默认行为](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/app/App.tsx)
- 绘图验收到像素恢复和带 `[temp]` 的上传引用提交。Siril 正式队列及 FITS 输出仍按 FR-05 验收。设备和光路保留原设置入口，源码归资料库。涉及用户可见入口、布局或操作顺序的明显变化，按 FR-07 先对照、再确认。

## 2. 迁移顺序

按 0 → 1 → 2 推进。完成第 2 步后，第 3、4 步可以分别迁移。Siril 在共享软件设置、节点挂载和 Bundle 接口明确后接入。最后一次切换发行入口，移除旧 React 路径。迁移分支可以暂用旧入口作对照，同一宿主会话只注册一套 AstroPhoto 侧栏和 Widget。

### 0. 建立基线和复用清单 · FR-02 至 FR-09

- **改动范围。** 本步骤采集现有行为和确定复用来源。记录实际宿主版本、经典画布与 Nodes 2.0、旧工作流、设备及光路样例、Siril 样例、现有侧栏和设置入口。逐模块核对官方组件、宿主公开接口及本地移植版本，列出缺口与必要适配。
- **验证。** 在隔离宿主重跑当前相关用例，分别保存当前失败与已通过证据。记录官方源码标签或提交、路径、本地位置及需要保留的行为。对比界面时使用同一宿主条件。绘图后端 `IMAGE` 已知故障单独标记。 [现有绘图验收边界](../../../../docs/react-sidebar.md)

### 1. 建立 Vue 公共基础和打包入口 · FR-01、FR-07 至 FR-09

- **改动范围。** 将公共前端入口、宿主适配、HTTP 客户端、Vue I18n 和主题样式收拢到 `frontend/src/`。建立 `frontend/src/bundles/` 的最小接入契约及 `extension/frontend-entry.ts` 的产品组装入口。核对 Node、pnpm、Vite、Vue 类型检查与现有宿主类型包组合。先接通空 Bundle 集合，保留现有 `js/main.js`、`js/assets/main.css` 和根 `locales/` 的发行路径。
- **验证。** 干净锁定安装、类型检查、lint、Vitest 与 Vite 构建。验证公共前端在空 Bundle 集合下能加载。通过代理子路径请求宿主脚本与扩展样式，检查 CSS 作用域、挂载和卸载，中英文及明暗主题切换。确认扩展未以页面加载为由启动 Siril 或写业务数据。 [现有构建检查](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/check-build.mjs) · [代理测试](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/check-proxy.mjs)

#### Vite 工具链改动清单

按 [TECH 对齐边界](03_TECH.md#vite-工具链与独立扩展构建) 实施。以官方 `v1.59.6` 锁定的 Vite `8.2.2`、`@vitejs/plugin-vue` `6.0.8` 为起点，适配 AstroPhoto 的独立扩展构建。 [官方依赖声明](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/pnpm-workspace.yaml) · [官方配置参考](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/vite.config.mts#L541-L547)

| 文件 | 实施时的改动 |
| --- | --- |
| `frontend/package.json`、`frontend/pnpm-lock.yaml` | 升级 Vite 和 Vue 插件，加入 `tailwindcss` 和 `@tailwindcss/vite` `^4.3.2`。同步核对 Vue、TypeScript 6、`vue-tsc`、Vitest 5、兼容的 `@vitest/browser-playwright` 与 Playwright。保留 DevTools 时采用兼容版本。使用 pnpm `11.13.1` 更新本项目锁，记录实际版本和 peer 解析。宿主类型依赖按 D-03 独立处理。 |
| `frontend/vite.config.mts`、`extension/frontend-entry.ts` | 按需沿用官方 Vue 与 Tailwind 插件接法。保留扩展独立入口和 ESM 交付，正式入口在第 6 步指向产品组装文件。核对 Vite 8 对入口解析、宿主外部模块映射、CSS 文件名和构件布局的实际行为。Tailwind 扫描涵盖公共前端及 Bundle 使用的样式来源，控制生成样式和重置的作用域。 |
| `frontend/tsconfig.json`、`frontend/vitest.config.mts`、`frontend/eslint.config.mjs` | 覆盖 Vue 源码及 `extension/` 组装与 Bundle 路径。Vitest 保留测试专用宿主替身，更新 Chromium provider 与依赖预构建配置。绘图迁完后去除 PrimeVue 的预构建和去重配置。生产构件通过独立构建验证宿主模块映射。 |
| `frontend/package.json`、`frontend/jest.config.cjs`、`frontend/ui/tsconfig.json`、`.github/workflows/ci.yml` | 第 6 步撤除旧入口依赖，包括 React、React DOM、React i18next、Vite React 插件、React 类型、React 专用 lint 和 Jest/RTL 旧链。绘图替换完成后移除 PrimeVue/Aura。将旧测试覆盖迁至 Vitest/Playwright，CI 继续锁定 Node 与 pnpm，并更新生效的构建和回归命令。 |

旧 React 插件 `4.4.1` 的 peer 范围止于 Vite 6。旧入口保留在迁移前基线检出，先在迁移分支用单一 Vue 入口验证 Vite 8 与空 Bundle。切换正式入口时再完成交付和旧链清理。锁定安装如出现 peer 冲突，按实际依赖调整升级顺序或组合并记录差异。

### 2. 迁移侧栏外壳、节点目录与绘图 · FR-02、FR-06、FR-07、FR-09

- **改动范围。** 将侧栏外壳、设置导航、节点树、悬停预览、搜索筛选和收藏迁入 Vue。复用原生侧栏容器及画布访问能力。绘图继续使用现有 Canvas 和序列化代码，替换 PrimeVue/Aura 控件，样式加载移到公共入口。同步建立 `features/assets/` 占位页，标签、默认落点与文案保持现有语义，仅去除 React 实现。
- **验证。** 比对标签导航、搜索、排序、收藏、鼠标及键盘交互。验收占位页：无网络请求、无列表与导入控件，中英文与明暗主题文案可读。两个画布模式分别验证点击添加、拖放、撤销和节点重开。打开旧绘图工作流，验证绘制、撤销、保存、重开和像素恢复，检查临时 PNG 上传及 `[temp]` 引用。反复打开侧栏或删除 Widget 后检查清理。 [现有画布适配](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/canvas.ts) · [绘图 Widget 序列化](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/VueExampleComponent.vue)

### 3. 迁移存储、环境与系统设置 · FR-03、FR-07、FR-09

- **改动范围。** 将工作区、缓存、环境和预览显示设置迁到 `features/storage/`。沿用设置导航、系统诊断和原有字段、请求、权限及操作进度；预览显示设置继续通过公共接口供节点使用。
- **验证。** 使用已有数据验证加载、编辑、保存、失败反馈和重开恢复。覆盖工作区及缓存的现有读写与长任务状态，并核对预览尺寸设置对节点的反映。存储宿主脚本若含素材导入步骤，拆开或仅使用其存储验收部分。 [现有存储宿主用例](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/storage-host.mjs)

### 4. 将设备与光路迁入资料库 · FR-04、FR-07、FR-09

- **改动范围。** 设备与光路页面及领域交互放入 `features/library/pages/`，资料库共用的列表、筛选工具栏、详情框架和状态反馈放入 `features/library/components/`。跨业务组件沿用 `shared/`，下拉框复用 Vue 实现。设备类型、列、校验与版本冲突由页面解释，组件通过 props、插槽和事件接收展示及操作信息。
- **验证。** 用已有设备与光路验证搜索筛选、编辑、字段校验、归档与受约束删除、未保存提示、冲突恢复和宿主重启后的持久化。在真实浏览器中操作单选、多选、禁用项、键盘和窄栏弹层。用通用记录样例验证从资料库组件到设备领域没有反向依赖，无需实现素材页。 [现有设备用例](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/__tests__/equipment.test.tsx) · [真实宿主用例](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/equipment-host.mjs)

### 5. 迁移并接入 Siril Bundle · FR-05、FR-07、FR-08、FR-09

- **改动范围。** 将 Siril 专属设置、参数交互、预览请求、回执处理、词条以及专属 Python 节点、路由和处理接入归入 `extension/siril/`。现有通用 FITS 和 `IMAGE_PATH` 契约按职责保留；共享预览和 Inspector 外壳留在公共前端。组装入口选定 Bundle，Bundle 供给软件设置内容、能力状态和对应宿主节点的 UI，公共层负责挂载与清理，源码不导入 Siril 专属实现。沿用 `on_load` 注册、可信本机检查、路由及队列契约。
- **验证。** 检查公共前端到 Bundle 的依赖方向及注册时机。同一套用例分别覆盖未接入 Bundle、已接入但 Siril 不可用、Siril 正常可用。验证通用设置入口、旧节点 ID 和 Widget 键恢复、FITS 来源、候选预览、Inspector 修改与只读限制、正式队列回执及实际 FITS 输出；记录两个画布模式的结果。核对版本号、路径、精度和元数据契约，确认发布包能加载迁移后的 Python 文件。 [现有节点接线](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) · [Siril 路由](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/api/siril.py) · [Siril 宿主用例](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/siril-host.mjs)
- **拆分前置项。** 先确认通用预览设置的路由归属、FITS 来源 Widget 的注册方，以及后端服务装配和能力查询的依赖，再移动 Siril 文件。见[科学节点与 Bundle](#科学节点与-bundle--步骤-5)。

### 6. 切换发行入口与移除 React · FR-01、FR-02、FR-07 至 FR-09

- **改动范围。** 前序模块达到各自验证条件后，将 Vite 正式入口切换到产品组装入口。入口接线保留 Nodes、Assets（占位）、Settings 三个标签及现有默认落点，再撤下原 React 源码入口、`AssetsPage`/`ImportDialog`、跨框架桥接、专用依赖、Jest 配置、测试与 CI 任务。保留旧测试保护的有效行为并迁入 Vitest/Playwright。仅将新增 Siril Python 运行文件纳入 Registry 发行，前端继续以既有 JS/CSS 产物交付。
- **验证。** 用干净检出完成锁定安装，检查源码和锁文件、解析后依赖树、Vite 模块和发行构件，确认 React 与 PrimeVue/Aura 已退出，Registry 包包含新 Siril Python 运行文件。复跑宿主侧栏、经典画布与 Nodes 2.0、旧工作流、资料库与 Siril。逐模块对照 UI 并记录差异。最终启用的入口只注册一次。素材页以占位页交付，不因此一步改变导航。 [Registry 验证脚本](../../../../scripts/release.py)

### 完成定义与出口条件

每一步只有同时满足下表条件才可进入下一步；未满足时保留在本文记录实际阻塞，不以“已迁移”代称。

| 步骤 | 可交付物 | 出口条件 | 不得通过的情形 |
| --- | --- | --- | --- |
| 0 | 迁移前界面、工作流、复用来源与命令记录 | 目标宿主可启动，旧工作流可打开，每个复用项有上游标签/路径与本地目标位置 | 仅有源码推断而无宿主观察；未保存迁移前基线 |
| 1 | `frontend/src/` 公共基础、`bundles/` 契约、`extension/frontend-entry.ts`、Vite 工具链变更 | Vue 构建候选在空 Bundle 下可加载；锁定安装、类型检查、lint、适用的已有检查与构建通过；代理子路径和 CSS 作用域正常 | Vite peer 冲突未解；产物路径或 `WEB_DIRECTORY` 发生变化 |
| 2 | 侧栏外壳、节点目录、绘图控件、素材占位页 | 两种画布下搜索、筛选、排序、收藏、点击与拖放、撤销均通过；旧绘图工作流像素恢复且提交 `[temp]` 引用；占位页无请求 | 侧栏重复注册；预览层泄漏到全局样式或未清理；占位页拉取素材数据 |
| 3 | `features/storage/` | 工作区、缓存、环境与预览显示可读、可存、可重开；失败与旧 revision 分支已验证 | 以旧响应覆盖新值；长任务无终态反馈 |
| 4 | `features/library/pages` 与 `components` | 设备与光路完整 CRUD 规则、冲突、归档与引用删除均通过；共用组件无设备 DTO 依赖 | 页面直接反向依赖设备领域数据；下拉键盘/窄栏未验证 |
| 5 | `extension/siril/`、Bundle 契约与后端装配 | 无 Bundle / 不可用 / 可用三态分别通过；正式队列与 FITS 契约有真实证据 | 公共层导入 Siril 实现；候选结果被计为正式结果 |
| 6 | 正式入口、依赖与 CI 退出、发行构件 | 干净检出无 React/PrimeVue；归档含全部运行文件；宿主反复加载只注册一次；Nodes/Assets/Settings 三标签均可用 | `release.py` 白名单未含 `extension/` |

拒绝与恢复分支不在本表重复：按 [测试计划第 4 节](05_TEST_PLAN.md#4-失败分支与覆盖边界) 的入口矩阵实现，实施后把真实 `path:symbol` 回写到本文第 5 节各链。

## 3. 验证入口与记录口径

| 目的 | 实施时使用的入口 |
| --- | --- |
| 对照迁移前行为 | 现有 `pnpm -C frontend test:react` 与 `pnpm -C frontend test`，区分 React 替身、Vue 浏览器和真实宿主结果。 |
| 编译与组件验证 | `pnpm -C frontend install --frozen-lockfile`、`typecheck`、`lint`、`test`、`build` 和 `check:build`。脚本迁移后仍需覆盖这些门槛，React 专用命令仅用于基线。 |
| 宿主实测 | `pnpm -C frontend check:proxy`，以及迁移后的绘图、存储、设备和 Siril 宿主脚本。对绘图使用 `--skip-image-execution` 或等效验收范围，保留临时 PNG 引用验证。设备和 Siril 在隔离的真实数据根执行。 |
| 发行验证 | `uv run pytest tests/packaging`、`uv run python scripts/release.py check`，检查干净安装时的实际加载与构件清单。 |

上述均为后续实施和验证入口。记录时为每一步标注对应 FR、实际命令或操作、环境、结果和未通过项。

### Vite 对齐验收 · CASE-01、CASE-08、CASE-09

1. **解析与编译。** 在干净检出的 `frontend/` 记录 `node --version`、`pnpm --version` 与实际解析的 Vite、Vue 插件、Tailwind、TypeScript、Vitest 和 Playwright 版本。运行 `pnpm -C frontend install --frozen-lockfile`、`pnpm -C frontend typecheck`、`pnpm -C frontend lint`。确认配置可解析、无未解决的 peer 冲突，类型检查覆盖公共源码和 Bundle。
2. **测试与构件。** 业务实现完成后对照实际代码定稿测试规格，编写测试并用 `pnpm -C frontend test` 集中回归。运行 `pnpm -C frontend build` 和 `pnpm -C frontend check:build`。在干净输出中核对 `js/main.js`、`js/assets/main.css` 和 `WEB_DIRECTORY`；核对退役入口、React/PrimeVue 依赖及旧文件未进入正式构件。记录复用的上游配置项和本地差异。
3. **代理与真实宿主。** 运行 `pnpm -C frontend check:proxy`，在代理子路径确认扩展 JS、CSS 以及宿主 `scripts/app.js`、`scripts/api.js` 能按相对路径加载。该脚本使用宿主替身，随后在 ComfyUI `v0.46.0` / Frontend `1.59.6` 加载同一构件，验证侧栏和 Widget 注册、空 Bundle、主题与样式作用域。将锁文件、CI 结果、构件清单和宿主网络/控制台证据对应到同一提交与构件。 [现有构件检查](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/check-build.mjs) · [代理检查](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/check-proxy.mjs)

## 4. 官方源码复用清单与片段

以下片段摘自 GPT‑6.1 Terra Medium 核对的 ComfyUI Frontend `v1.59.6` 源码。片段用于确认组件契约，完整实现和依赖以各链接为准。移植时保留来源与许可，记录上游标签或提交、源码路径、本地路径及实际修改。优先调用公开接口或使用现有 Vue 移植件，仅补齐 AstroPhoto 需要的差异。 [上游版本](https://github.com/Comfy-Org/ComfyUI_frontend/releases/tag/v1.59.6) · [本地移植说明](../../../../frontend/src/vendor/comfyui/README.md)

### 第 1–2 步｜侧栏挂载与导航

公开的侧栏注册接收 `render` 和可选的 `destroy`。使用此接口挂载与卸载 AstroPhoto Vue 根，保留现有 ID。以下是上游类型定义。 [侧栏 API](https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs) · [官方扩展类型](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/types/extensionTypes.ts#L42-L46)

```ts
render: (container: HTMLElement) => void
destroy?: () => void
```

上游媒体侧栏通过 `TabList` 绑定当前标签，`Tab` 负责焦点与选中态。对现有 AstroPhoto 导航可复用这组行为，若移植源码则连同上下文与键盘逻辑一起核对，并适配扩展自己的 ID、翻译和样式作用域。这些组件通过源码复用接入，宿主运行时只依赖公开侧栏接口。 [官方 TabList](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/tab/TabList.vue#L17-L27) · [官方 Tab](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/tab/Tab.vue#L1-L12)

```ts
const modelValue = defineModel<T>({ required: true })
```

### 第 2、4 步｜搜索、单选和多选

官方节点库通过 `SearchInput` 的值与 `search` 事件接入工具栏。复用本地已有的 Vue 参考件时，保留当前搜索触发和清空行为，并将查询映射留在节点目录或资料库页面。 [官方节点库调用点](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/sidebar/tabs/NodeLibrarySidebarTab.vue#L119-L128) · [官方 SearchInput](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/search-input/SearchInput.vue#L112-L119) · [本地 Vue 参考件](../../../skills/astrophoto-frontend-reuse/template/SearchInput.vue)

```ts
const emit = defineEmits<{
  search: [value: string]
  blur: []
}>()
```

官方单选用 Reka 的 `SelectRoot` 绑定选中项与开关状态，多选用 `ComboboxRoot` 绑定选中集合。优先沿用本地 `vendor/comfyui/` 下的 Vue 实现，迁移时保留空值、禁用设备、键盘和焦点行为。已比对两个主组件。本地单选调整了导入并增加逐项禁用，多选主组件只调整了导入路径。子组件、类型与样式在实施时逐项确认。 [官方 SingleSelect](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/single-select/SingleSelect.vue#L25) · [官方 MultiSelect](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/multi-select/MultiSelect.vue#L1-L10)

```vue
<SelectRoot v-else v-model="selectedItem" v-model:open="isOpen" :disabled>
```

```vue
<ComboboxRoot
  v-model="selectedItems"
  v-model:open="isOpen"
  multiple
  by="value"
```

### 第 2 步｜绘图工具栏按钮与提示

上游按钮按是否提供提示内容选择渲染包装，并在 loading 时禁用。`TextTooltip` 使用 Reka 的 `as-child` 触发器。迁移前核对设计令牌、按钮变体与 Tooltip 依赖，只复用绘图工具栏使用的分支。现有 Canvas、笔刷和序列化代码继续由绘图模块管理。 [官方 Button](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/button/Button.vue#L38-L54) · [官方 TextTooltip](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/tooltip/TextTooltip.vue#L14-L21)

```vue
:is="tooltip === undefined ? WithoutTooltip : TextTooltip"
:disabled="disabled || loading"
```

```vue
<TooltipTrigger as-child>
  <slot />
</TooltipTrigger>
```

### 第 2、4 步｜按前端复用技能核对的实现

按 [astrophoto-frontend-reuse](../../../skills/astrophoto-frontend-reuse/SKILL.md) 核对模板。技能模板的来源为 `v1.59.1`，已将 6 个模板正文与对应的官方 `v1.59.6` 文件逐一比较，按文本读取统一换行后内容一致。以下适配方案仍待实现和宿主验收。实施时保留上游来源与许可，并逐项核对实际导入的子组件、样式及依赖版本。 [模板许可](../../../skills/astrophoto-frontend-reuse/template/LICENSE)

| 使用处 | 可复用部分 | 本地接线与验证 |
| --- | --- | --- |
| 节点目录搜索、资料库搜索 · CASE-02、04、09 | 移植官方 `SearchInput.vue` 及所需的 `searchInput.variants` 样式定义，复用 Reka Combobox、清空和搜索事件。其实现依赖 VueUse 的 `watchDebounced`、Button 和样式工具。 [官方源码](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/search-input/SearchInput.vue) · [模板](../../../skills/astrophoto-frontend-reuse/template/SearchInput.vue) | 由节点目录和资料库分别提供搜索值及过滤逻辑。当前节点搜索会清空搜索期间的折叠覆盖；设备的查询与分页由设备页面处理。对照原搜索触发、清空、键盘、焦点及旧请求处理，按功能所需配置防抖。 |
| 节点目录树 · CASE-02、07、09 | 以 `AllNodesPanel.vue → TreeExplorerV2.vue → TreeExplorerV2Node.vue` 为入口。移植 `TreeRoot`、`TreeItem`、展开模型、文件夹行和缩进样式。源实现用 `TreeVirtualizer` 渲染扁平行，并访问宿主 bookmark/subgraph store 与内部 `ComfyNodeDefImpl`。 [组装入口](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/sidebar/tabs/nodeLibrary/AllNodesPanel.vue) · [缩进样式](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/tree/treeStyles.ts) · [树模板](../../../skills/astrophoto-frontend-reuse/template/TreeExplorerV2.vue) · [行模板](../../../skills/astrophoto-frontend-reuse/template/TreeExplorerV2Node.vue) | 用 `buildNodeTree` 的分类、节点 ID 及稳定 key 驱动 Vue 树，把选中、点击和拖放交给本地调用方。文件夹点击只改变展开状态，普通节点的添加和反馈沿用宿主适配。保留搜索后的展开体验、键盘和收藏层级。Blueprint 删除、宿主右键菜单和完整虚拟列表仅在实际需要且复验通过时纳入适配；若采用虚拟列表，复验滚动后悬停锚点与焦点。 |
| 节点行悬停、拖放、收藏 · CASE-02、09 | 参考官方 `useNodePreviewAndDrag` 的悬停定位和拖动时隐藏预览，以及 `nodeBookmarkStore` 的设置键、路径与节点名兼容。官方拖入画布实现调用内部 `useCanvasStore` 和 `useLitegraphService`；`NodePreviewCard` 依赖宿主预览 renderer 和节点定义。 [悬停与拖放](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/composables/node/useNodePreviewAndDrag.ts) · [画布拖放实现](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/composables/node/useNodeDragToCanvas.ts) · [预览卡](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/node/NodePreviewCard.vue) · [收藏实现](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/stores/nodeBookmarkStore.ts#L16-L45) | 沿用 AstroPhoto 的 `NodeCard`、画布适配、拖放负载及宿主设置访问方式。筛选后保留收藏写入失败的回退，验证侧栏换边或滚动时预览定位、拖出时清理、活动子图插入、两种画布的点击、拖放与撤销。 |
| 节点排序、资料库工具栏 · CASE-02、04、07、09 | 官方节点目录用 `Popover` 承载排序选项，选择后关闭；素材 `MediaAssetSettingsButton.vue` 提供触发器与 `close` 插槽，`MediaAssetSettingsMenu.vue` 提供选中勾选和 `sortBy` 模型。按需复用触发器、弹层和选项外观；`Popover.vue` 使用 Reka Portal 及视口退出逻辑。 [节点目录排序](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/sidebar/tabs/NodeLibrarySidebarTab.vue#L58-L96) · [Popover](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/ui/Popover.vue) · [按钮模板](../../../skills/astrophoto-frontend-reuse/template/MediaAssetSettingsButton.vue) · [菜单模板](../../../skills/astrophoto-frontend-reuse/template/MediaAssetSettingsMenu.vue) | 对应本地 `SearchOptions` 工具栏，沿用各页面排序、筛选选项和持久化规则。官方单选示例选择后关闭，本地选中后由焦点移出或 Escape 关闭。按 FR-07 对照后选择关闭时机，多选筛选保留连续选择行为。适配翻译键、Portal 挂载和样式作用域，验证 Escape、外部点击、焦点回归与窄栏。素材页已定为占位页；素材视图模式、媒体排序枚举与生成耗时选项属于官方媒体页业务，不在本次范围。 |
| 环境、设备表单与光路选择 · CASE-03、04、09 | 技能的 `SingleSelect` 模板用作官方对照。运行时优先使用仓库已有的 Vue 单选、多选和配套 `usePopoverSizing`，由 Vue 页面直接接线。 [单选模板](../../../skills/astrophoto-frontend-reuse/template/SingleSelect.vue) · [项目移植清单](../../../../frontend/src/vendor/comfyui/README.md) | 迁移前清点 React 包装中的空值编码、禁用选项、字段标签和更新事件。设备与光路校验留在资料库业务组件；环境预览分辨率继续提交原有字段。验证键盘、窄栏弹层、禁用、清空和冲突后的输入恢复。 |

官方版本同时保留旧 `NodeLibrarySidebarTab.vue → TreeExplorer / TreeExplorerTreeNode` 与 V2 树。旧树用 Atlaskit 拖放，新树经 `useNodePreviewAndDrag` 协调宿主内部拖放服务。仅复制新版的 `application/x-comfy-node` 数据格式无法重建这条调用链。复用 V2 的树组件接线，画布操作仍使用已核对的 AstroPhoto 适配。 [旧树入口](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/sidebar/tabs/NodeLibrarySidebarTab.vue)

节点树的最小接线可沿用官方受控展开模型。移植时继续用本地树节点和回调。 [官方树容器](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/components/common/TreeExplorerV2.vue#L4-L9)

```vue
v-model:expanded="expandedKeys"
:items="root.children ?? []"
:get-key="(item) => item.key"
```

第 0 步为实际选用中的每个复用项记录上游文件、拟定本地路径、依赖和适配点。第 2–4 步回写实际差异，用对应 CASE 验证迁移后的宿主行为。公开侧栏注册继续直接调用宿主接口，内部组件以仓库自有 Vue 构建接入。

## 5. 本地入口与开发约束

以 `4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 为基线。使用 `codegraph explore` 从生产入口、侧栏、画布、存储及科学节点追踪调用与导入，再用当前源码核对 Vite 外部模块、宿主注册钩子、HTTP 路由和动态生命周期。`extension/` 为拟新增目录。当前记录为静态证据，目标宿主与迁移后的行为仍待运行验证。发行检查以当前工作树为准：`.comfyignore` 的未提交改动仅删除已迁移的 `.agent/` 一行，不影响包内容判定。

| 步骤与用例 | 现存入口 | 迁移动作与失败边界 |
| --- | --- | --- |
| 1、2 · CASE-01、02、08 | [entry.ts](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/entry.ts) 同时引入两个 UI 入口；[registerSidebar](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/sidebar.tsx) 注册 `astrophoto.sidebar`。 | 由产品组装入口注入 Bundle，公共入口初始化 Vue 与共用服务。先查是否已经注册侧栏。重复渲染同一容器复用实例；换容器先释放旧应用、语言监听和 DOM。沿用宿主销毁入口。Bundle 缺席时仍挂载公共应用。 |
| 2 · CASE-02 | [createCanvasNode](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/canvas.ts)、[readNodeDrag / attachCanvasDrop](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/dragDrop.ts)。 | 传入节点 ID 和可选客户端坐标，保持现有 MIME 和渲染脱钩。先验证当前画布可编辑、类型已注册及坐标有限，再经宿主变更边界添加节点。失败时移除部分添加的节点或释放对象，配对执行完成通知，让调用方显示失败。核验两种画布及子图时的现有宿主适配。 |
| 2 · CASE-06 | [handleStateSave / uploadTempImage / serializeValue](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/VueExampleComponent.vue)。 | 复用画板及 Widget 钩子。保存像素仍走 Widget 值。队列序列化等待像素恢复后单独上传临时 PNG，从上传响应读取 `name` 并生成 `threed/<name> [temp]` 引用。无画布数据或进入现有异常分支时返回 `{image: null}`。保留工作流字段与宿主生命周期。 |
| 3、4 · CASE-03、04 | [requestJson](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/client.ts)、[fetchStorage / startOperation / fetchReceipt](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/storage.ts)、[saveEquipment / saveTrainDraft / deleteEquipment](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/equipment.ts)。 | 共用请求继续走 `app.api.fetchApi`，保留本机请求头、可取消请求及结构化错误。由调用页面应用字段提示、读取操作回执或处理版本冲突。提交使用已有版本字段及服务端校验；冲突或删除受阻时保留记录与编辑输入。切页或更换查询时撤销旧请求并忽略过期结果。 |
| 5 · CASE-05、08 | [registerScientific](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) 注册 Widget 并接收 `onExecuted`；[renderCandidate](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/siril.ts) 管候选请求；[AstroPhotoExtension](../../../../__init__.py) 在 `on_load` 装配运行时。 | 按宿主节点类型注册 UI，公共层只负责挂载和生命周期。参数走宿主工作流变更机制，取消过期候选、释放预览资源并保留宿主原回调。仅收到正式执行结果时更新正式回执显示。Python 侧保留原节点 ID、可信部署检查与路由协议，仍由 `on_load` 注册并绑定运行时。通用 FITS 与 `IMAGE_PATH` 按现有消费者确定归属。 |
| 6 · CASE-01、08、10 | [vite.config.mts](../../../../frontend/vite.config.mts)、[package.json](../../../../frontend/package.json)、[release.py](../../../../scripts/release.py)。 | 前置模块可用且 Assets 导航确定后切换正式入口。重新生成 JS/CSS，核对 Vite、CI、依赖、Registry 与实际宿主发行加载。仅随包分发运行所需 Siril Python 文件。入口冲突、残留旧依赖或缺文件时暂缓发行切换验收。 |

### 生产入口与宿主生命周期 · 步骤 1、2、6

- **构建链。** `frontend/vite.config.mts` 用 Vue 和 React 两个插件编译 `frontend/entry.ts`，该入口分别导入 `frontend/src/main.ts` 与 `frontend/ui/src/main.tsx`。`comfy:app`、`comfy:api` 是外部模块，产物用宿主相对路径加载。现有 Vue 入口按脚本 URL 加载 `assets/main.css`。切换到拟议的 `extension/frontend-entry.ts` 时，把 CSS 加载迁到公共入口，保持宿主外部模块的路径、`WEB_DIRECTORY` 和代理子路径兼容。 [Vite 配置](../../../../frontend/vite.config.mts) · [组合入口](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/entry.ts) · [Vue 入口](../../../../frontend/src/main.ts) · [Python 入口](../../../../__init__.py)
- **侧栏链。** React 入口注册 `AstroPhoto.Sidebar`，宿主 `setup` 调用 `registerSidebar(app)` 并预取 `getPreviewSettings()`；同一入口调用 `registerScientific(app)` 注册另一套科学节点钩子。侧栏回调 `render → App`，由 `destroy` 卸载根、释放语言监听和容器。将侧栏框架、获取状态及语言适配迁入公共层。现有 `watchLocale` 从 `Comfy.Locale` 同步并回收轮询与焦点监听；同时核对 React 侧栏词条与绘图使用的根 `locales/`。 [React 入口](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/main.tsx) · [侧栏适配](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/sidebar.tsx) · [语言适配](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/locale.ts) · [侧栏词条](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/i18n/index.ts)
- **导航链。** `App` 同时挂载 Nodes、Assets、Settings，通过 `hidden` 控制显示；常规默认 Assets，存在设备会话时恢复 Settings。切页会询问设备离开守卫。移除 React Assets 的入口引用与专属客户端调用时，保留 Settings 共用的状态、存储请求和设备草稿恢复。Assets 标签与内容已定为 Vue 占位页，默认页不变；素材导入、查询和定位继续划在本次功能交付之外。 [App](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/app/App.tsx) · [AssetsPage](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/assets/AssetsPage.tsx) · [ImportDialog](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/assets/ImportDialog.tsx)

### 节点目录、画布与绘图 · 步骤 2

- **目录与预览。** `App → useResource(fetchNodes) → nodeCatalog(/object_info) → NodesPage → buildNodeTree / NodeTree`。迁移搜索、分类、树展开和预览。`toggleBookmark` 经宿主设置读写 `Comfy.NodeLibrary.Bookmarks.V2`，保留旧 ID/分类路径的兼容；写入被拒绝时按现有流程恢复并反馈。排序由 `useStoredChoice` 持久化在 `AstroPhoto.Nodes.Sort`。悬停组件 `NodeHoverPreview` 当前挂载到 `document.body` 并按宿主侧栏位置计算边界；替换 React Portal 时保留弹层作用域、滚动定位和卸载清理。 [目录 API](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/nodes.ts) · [NodesPage](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodes/NodesPage.tsx) · [NodeTree](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodes/NodeTree.tsx) · [悬停组件](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodes/NodeHoverPreview.tsx)
- **添加节点。** 点击调用 `createCanvasNode`。拖放经 `writeNodeDrag → attachCanvasDrop → readNodeDrag → createCanvasNode`，校验 MIME、版本、节点白名单与坐标。框架无关的画布操作迁入 `host/`，保留活动图（含子图）、只读/选择模式、`beforeChange / afterChange`、失败时的节点清理。现用 `window.LiteGraph` 工厂为版本适配点，两种画布实测后确定能否直接保留。 [拖放](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/dragDrop.ts) · [画布](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/canvas.ts)
- **绘图。** `getCustomWidgets.CUSTOM_VUE_COMPONENT_BASIC → VueExampleComponent → DrawingApp → DrawingBoard / ToolBar`。保留 `DrawingBoard.saveState / restoreCanvas`、Widget 的同步 `getValue / setValue` 和异步 `serializeValue` 两条路径。整理入口和工具栏时，替换 `ToolBar.vue` 的 PrimeVue Button 及入口的 Tooltip/Aura；保留 `vue-basic`、Widget 字段、旧像素和 `threed/<name> [temp]` 契约。FR-06 到引用提交为止。 [Widget](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/VueExampleComponent.vue) · [画板](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/DrawingBoard.vue) · [工具栏](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/ToolBar.vue)

### 存储设置、环境与资料库 · 步骤 3、4

- **存储与通用请求。** `SettingsPage → StoragePage → useStorageAction → mutate / startOperation`；`OperationProgress` 用 `fetchReceipt` 读取操作回执，经过 `requestJson → app.api.fetchApi` 进入宿主的 AstroPhoto 路由。迁移工作区、缓存与操作状态。存储和旧素材页面共用 `api/storage.ts` 与 `features/storage/shared.tsx`，按真实调用点保留工作区、迁移任务和缓存分支，素材预检与导入仍在范围外。保留本机请求头、结构化错误、取消和服务端 revision 规则。 [SettingsPage](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/SettingsPage.tsx) · [StoragePage](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/StoragePage.tsx) · [操作进度](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/storage/shared.tsx) · [存储客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/storage.ts) · [请求客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/client.ts)
- **环境与预览显示。** `EnvironmentPage.save → savePreviewSettings → PUT /astrophoto/v1/previews/settings`；初始读取同时来自侧栏 `setup` 和环境页。 `applySettings` 校验返回结构、忽略旧 revision、更新预览 CSS 变量并在分辨率改变时通知科学节点。当前后端校验请求中的 `canvas`，保存时只把 `longest_edge` 传给 `StorageRuntime.update_settings`。保留现有分辨率编辑和布局读取，画布尺寸可编辑不属于已确认范围。接口保留公共归属，Siril 订阅公共设置。 [环境页](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/EnvironmentPage.tsx) · [预览设置客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/previewSettings.ts) · [现有设置处理器](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/api/siril.py)
- **设备与光路。** `SettingsPage → EquipmentPage`，按 `equipment`、`optical_trains` 能力显示入口和光路可用性。 `EquipmentPage.leave`、`EquipmentSession` 控制离开与草稿恢复；`RecordList` 提供列表，`EquipmentForm`、`EquipmentDetails`、`OpticalTrainEditor.save` 与 `OpticalTrainDetails` 承载编辑及详情。前端继续通过 `api/equipment.ts` 调用服务端，保留冲突、归档、引用限制和快速新建设备后回填光路的行为。将页面归入 `features/library/pages/`，提取确有共享用途的列表、筛选、详情与反馈。`ComfySingleSelect` 和 `ComfyMultiSelect` 当前以 React 包装 Vue `h/render`，迁移直接使用现有 Reka Vue 组件，保留空值映射、禁用、键盘和焦点行为。 [EquipmentPage](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/EquipmentPage.tsx) · [EquipmentList](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/EquipmentList.tsx) · [OpticalTrainEditor](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/OpticalTrainEditor.tsx) · [设备客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/equipment.ts) · [后端路由](../../../../astrophoto/api/equipment.py) · [Vue 组件来源](../../../../frontend/src/vendor/comfyui/README.md)

### 科学节点与 Bundle · 步骤 5

| 当前链路 | 迁移边界与验证 |
| --- | --- |
| `SettingsPage → SoftwarePage → getSiril / discoverSiril / saveSiril / setSirilEnabled / clearSiril` | `SoftwarePage` 的 Siril 内容、词条和配置客户端归 Bundle。公共 Settings 保留软件入口和能力状态容器。把 `EnvironmentPage` 目前共用的 `.ap-siril-actions` 样式先移出 Siril 样式边界，验证无 Bundle 的界面。 [SoftwarePage](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/SoftwarePage.tsx) · [Siril 样式](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/siril/siril.css) · [客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/siril.ts) |
| `registerScientific.getCustomWidgets → SourcePicker → fitsAssets → GET /fits/assets`；`AstroPhotoFITSSource.execute → resolve_input / inspect_fits` | 这条链与 AutoStretch 同处一个宿主注册及后端路由文件，但提供通用 FITS 来源。拆分时成组核对 `ASTRO_FITS_ASSET`、`asset_id`、`IMAGE_PATH`、旧节点 ID、来源 API 和 FITS 校验。拟让通用来源及 `AstroPhotoImagePath` 保持可独立装配，先沿调用者拆分 `frames.py` 中输入解析与 Siril 专用消费点。 [科学节点前端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) · [V3 节点](../../../../nodes/scientific.py) · [FITS 解析](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/siril/frames.py) |
| `registerScientific.nodeCreated → NodeView → sourceId / updateParameters / renderCandidate`，`NodeView → NodePreview / Inspector` | AutoStretch 参数、输入溯源、候选请求、正式回执匹配归 Bundle；`features/nodePreview/` 的比较展示与通用容器归公共层。`features/siril/Inspector.tsx` 当前只是转导，Siril 测试走这条路径，生产引用走通用 Inspector。Widget 保留 `astrophoto_preview` 非序列化、原 `onExecuted` 回调与卸载清理。按当前输入和参数匹配正式结果，替换候选时取消旧请求并释放对象 URL。 [科学节点前端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) · [通用 Inspector](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodePreview/Inspector.tsx) · [Siril 转导](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/siril/Inspector.tsx) |
| `renderCandidate → POST /previews/autostretch → 状态轮询、取消、校验、PNG`；正式队列经 `AstroPhotoSirilAutoStretch.execute → formal_run → FITS、结果登记和执行 UI 回执` | 两条链分别迁移与验收。候选作业和正式处理的 Siril 实现归 Bundle，正式处理仍调用现有存储、Workspace、缓存与资产登记。保持路径类型、精度、元数据、回执字段和可信本机校验。 [预览路由](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/api/siril.py) · [正式处理](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/siril/processing.py) |
| `AstroPhotoExtension.on_load → host_runtime → StorageRuntime` 直接装配 `SoftwareService / PreviewService` 并调用 `recover_runs`；`register_routes` 合并 `siril_routes()`；能力查询直接读取 `runtime.storage.siril.status()` | 后端文件移动必须同时处理服务装配、恢复钩子、路由聚合和能力读取；共用的 `/previews/settings` 保持原 URL、可独立注册。无 Bundle 时验证公共状态、工作区、设备和环境设置仍正常。Bundle 接入但不可用时验证软件状态反馈，接入且可用时再验证完整 FITS 队列。保留 `on_load` 为运行时初始化入口。 [主入口](../../../../__init__.py) · [存储装配](../../../../astrophoto/storage/runtime.py) · [路由聚合](../../../../astrophoto/api/routes.py) · [能力读取](../../../../astrophoto/core/capabilities.py) |

### 构建、测试与打包退出面 · 步骤 6

- 退出检查覆盖 `frontend/package.json`、`pnpm-lock.yaml`、`vite.config.mts`、`eslint.config.mjs` 和 `.github/workflows/ci.yml`。各业务有效断言迁入 Vitest Chromium，已删除 Jest 配置及旧 React 专属类型路径。构件校验和代理脚本在 `frontend/scripts/`，真实宿主验证在 `frontend/tests/host/`。 [依赖与脚本](../../../../frontend/package.json) · [CI](../../../../.github/workflows/ci.yml) · [构件检查](../../../../frontend/scripts/check-build.mjs) · [代理检查](../../../../frontend/scripts/check-proxy.mjs)
- `scripts/release.py` 的 `allowed_roots` 当前为 `{"nodes", "astrophoto", "js", "locales"}`，`allowed_files` 为根级 `__init__.py`、`pyproject.toml`、`requirements.txt`、`LICENSE`、`README.md`，尚未包含 `extension/`。审查 `.comfyignore` 对嵌套 Bundle 前端源码的排除和 Registry 对必要 Python 文件的纳入，检查真实归档内容。保持 MCP 包独立，设备与状态仍通过现有 HTTP 契约。 [发行校验](../../../../scripts/release.py) · [打包忽略规则](../../../../.comfyignore)

### Bundle 接口草案

- **组装输入。** 由 `extension/frontend-entry.ts` 传入实际交付的 Bundle 列表。公共层使用稳定的软件标识、能力读取、设置视图和按宿主节点类型注册的交互贡献。接口精确类型在确认宿主运行时与首个真实贡献后锁定，继续保留空列表路径。
- **生命周期。** 公共层向视图提供已有宿主、翻译与主题适配，管理 Vue 根卸载。Bundle 按自身业务状态发请求并通过取消信号与卸载路径回收资源。软件不可用时在共享入口呈现状态，公共层可继续运行。
- **实际差异回写。** 在对应步骤记录实际文件及符号、迁移前后的调用者、官方适配差异、未迁的分支及后续验证。关于 Assets 的最终决定要同步 UX、本开发规格、CASE-10 与发行导航。类型工具链、科学节点模块拆分和实际贡献的精确输入输出仍需在实施前基线中核对。


## 6. 实施回写（2026-11-21）

| 步骤 | 实际实现、偏离与验收状态 |
| --- | --- |
| 0 | HEAD `4c0cf4d` 对应的旧构件在隔离宿主采集了 Assets、Nodes、Settings、Storage、Environment、设备、Software 截图及带像素的旧工作流，见 `.artifact/frontend-migration/baseline/`。原宿主脚本在期待素材服务关闭时超时，目标环境实际启用本机存储；独立浏览器采集后继续。旧数据、对照脚本和当前修改通过 Git 基线区分。 |
| 1 | `extension/frontend-entry.ts → frontend/src/main.ts:initializeFrontend` 注入 Bundle。`frontend/src/bundles/types.ts:FrontendBundle` 定义摘要、设置、词条与节点注册贡献。Vite `8.2.2`、Vue `3.5.42`、Vue 插件 `6.0.8`、Tailwind Vite `4.3.2`，另加 Vue JSX 插件承接既有视图结构；不加载 DevTools。`vite.config.mts` 用 `rolldownOptions.output.codeSplitting: false` 保持单文件，`cssFileName: main` 保持 CSS URL，Tailwind 只引入带前缀的主题和工具类。pnpm `11.13.1` 使用本地 `npx` 入口。空 Bundle 实测通过，干净前端目录构建与发行 JS/CSS 的哈希一致。最终证据按 CASE-01、08 记录。 |
| 2 | `host/sidebar.ts:registerSidebar → features/sidebar/Sidebar.tsx` 挂载单一 Vue 根及语言回收，设备会话跨挂载保留；Assets 占位不订阅节点、存储或素材请求。`features/nodes/NodesPage.tsx` 保留分类、查询、收藏和拖放边界，`NodeHoverPreview.tsx` 用 Vue Teleport。`host/drawing.ts:registerDrawing` 挂接旧画板和 Widget；`features/drawing/ToolBar.vue` 改为作用域内原生控件。用户笔画或清屏才进入宿主原生变更事务，初始像素和恢复不另记历史。`host/domWidgetMounts.ts` 在公开 `afterConfigureGraph` 后只重挂同图、同节点、同 Widget 的扩展自有 DOM 元素，适配 v1.59.6 Nodes 2.0 重用容器的撤销/重做路径。运行验证见 CASE-02、06、10。 |
| 3 | `features/storage/StoragePage.vue`、`OperationProgress.vue` 连接原工作区、迁移和缓存接口。迁移请求确认后刷新共享快照，回到设置可继续读取作业。`EnvironmentPage.vue` 使用 Reka 单选与通用预览接口，冲突保留输入；公共环境样式不依赖 Siril。运行验证见 CASE-03。 |
| 4 | `features/library/pages/EquipmentPage.tsx` 的离开守卫、草稿恢复与冲突重读连接原设备接口，`EquipmentList.tsx` 的分页按查询版本排除迟到结果，`OpticalTrainEditor.tsx:withNewDevice` 保留快速回填。`components/RecordRows.tsx`、`ResourceContent.tsx`、`DetailAccordion.tsx` 只接收展示值和插槽。单选与多选直接在 Vue 内使用已移植件。运行验证见 CASE-04。 |
| 5 | 前端 `extension/siril/frontend/index.ts:sirilBundle` 贡献软件卡片、详情和 `AutoStretch.tsx:registerAutoStretch`，使用公共 `host/mountWidget.ts`、Inspector 和预览布局。通用 `host/fitsSource.tsx` 独立注册、恢复 `asset_id`，候选与正式结果由 Bundle 管理，串联预览只使用经后端校验的正式回执，`PREVIEW_STALE` 时回到当前来源候选。Python `extension/siril/bundle.py:SirilBundle` 接入根 `comfy_entrypoint` 与 `on_load`，`astrophoto/assets/fits.py` 和 `astrophoto/api/scientific.py` 保持公共 FITS 与预览配置，`nodes/scientific.py` 保持独立的通用节点。新 Bundle 作为可选参数装配。未改 SQLite 结构、路由 URL 和 FITS 处理算法。运行验证见 CASE-05、08。 |
| 6 | 独立入口保留 `WEB_DIRECTORY`、`js/main.js`、`js/assets/main.css` 和根 `locales/`。CI 继续指定 Node `26.13.1` 与 pnpm `11.13.1`，Jest 路径由 Vitest Chromium 接替。Registry 只收 Bundle 的 Python 运行文件。锁定安装、最终构件、真实宿主与回归结果见测试报告。 |

### 实际采用的上游实现

- ComfyUI Frontend `v1.59.6` 的 `vite.config.mts` 与 `pnpm-workspace.yaml` 提供 Vue/Tailwind 插件与工具链版本。扩展采用独立 ESM 入口和宿主相对模块，避免引入宿主 HTML、应用构建及发行逻辑。
- 使用 `src/types/extensionTypes.ts` 对应的宿主侧栏 API，以及 `src/scripts/domWidget.ts` 的 DOM Widget 注册与原 `onRemove` 链。节点添加仍需集中在 `host/canvas.ts` 使用当前活动图和版本适配，因为官方内部目录和拖放依赖宿主 Store/上下文。
- `shared/SearchField.tsx` 适配官方 `src/components/ui/search-input/SearchInput.vue` 的 Reka Combobox、值模型与清空焦点，保留项目现有防抖和输入法处理。`shared/SidebarTabs.tsx` 保留参考官方媒体侧栏键盘和选中态的布局。节点树沿用自己的拖放、收藏和预览状态，仅借鉴原 `TreeExplorerV2` 的受控展开，避免把宿主内部目录状态带入扩展。
- `shared/ComfySingleSelect.tsx` 和 `ComfyMultiSelect.tsx` 直接使用本地 `vendor/comfyui/`，保留空值、禁用和弹层。工具栏只需按钮、颜色和范围输入，保留原绘图领域逻辑与 CSS 作用域，用原生元素实现，未引入仅供宿主内部使用的组件依赖。
- ComfyUI `v0.46.0` 的 `comfy_api/latest/__init__.py:ComfyExtension` 和 `nodes.py:load_custom_node` 定义 `on_load` 与 V3 节点注册顺序。在该版没有可替代本项目科学 FITS 读写的实现，继续沿用 Astropy 和原处理链。

宿主撤销事务沿用宿主 `canvas-change` 机制。节点重建后，目标版 `WidgetDOM.vue` 只在原组件挂载或 linearMode 变化时重取 DOM Widget。扩展通过公开 `afterConfigureGraph` 兜底，不修改宿主源码、Pinia 或其它扩展组件。 [现行宿主组件](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/renderer/extensions/vueNodes/widgets/components/WidgetDOM.vue)

### 独立审查后的实施回写

- 节点收藏提交失败保留宿主值并显示收藏专用提示，修复后可直接重试。拖放由目录生命周期注册和回收，捕获事件时核对当前宿主画布元素及扩展 MIME；切换画布不需要重载目录。 [节点目录](../../../../frontend/src/features/nodes/NodesPage.tsx) · [拖放适配](../../../../frontend/src/host/dragDrop.ts)
- 设备及光路错误按资料库专用、公共、通用文案顺序选择现有词条，保留字段错误与请求编号。 [错误组件](../../../../frontend/src/features/library/components/equipmentFields.tsx)
- 公共 Cache 管理身份标记、锁和工作空间租约，处理器提供已知文件和目录前缀。Siril Bundle 复用原命名处理历史候选目录，探测目录仅对 Windows 共享冲突执行有限清理重试。 [公共 Cache](../../../../astrophoto/storage/cache.py) · [Siril 处理](../../../../extension/siril/processing.py) · [探测](../../../../extension/siril/software.py) · [运行证据](06_TEST_REPORT.md)
- F-6 修在 `run_cli`。Windows 启动原生 Siril 前从子进程环境副本去除 `MSYSTEM` 与 `MSYS`，覆盖探测、候选和正式链。父进程环境及 CLI 日志错误、退出码、取消和超时判断沿用原行为。 [CLI 实现](../../../../extension/siril/software.py) · [复验](06_TEST_REPORT.md)
