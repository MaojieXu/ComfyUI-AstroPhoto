# 测试计划｜ComfyUI 官方前端技术栈迁移

**版本与状态**　v0.6 · 2026-11-21 · PH-05 模式 B。纳入 Pi 独立审查后的回归，执行结果见 06_TEST_REPORT.md。

**规则来源**　[PRD v1.3](01_PRD.md) · [UI/UX 草案](02_UI_UX.md) · [技术设计草案](03_TECH.md) · [开发规格与源码披露](04_DEV.md)

**执行基线**　HEAD `4c0cf4d` 加本轮迁移工作树。产品 URL 与 widget 契约保持，源入口为 `extension/frontend-entry.ts`。用旧构件录制的页面与工作流保存在 `.artifact/frontend-migration/baseline/`。

## 1. 环境与测试数据

正式宿主验收采用 PRD 指定的 ComfyUI `v0.46.0` / Frontend `1.59.6`，分别运行经典画布与 Nodes 2.0。记录实际宿主、浏览器、Node、pnpm、Python、Siril 版本及依赖锁文件。仓库中的 `0.45.0` / `1.59.1` 验证为历史证据。测试替身用于控制失败与并发响应，宿主注册、焦点、画布变更、发行安装与 FITS 正式执行使用真实环境。 [开发与宿主验证](../../../../docs/development.md)

**工具链现状。** 本机 Node `v26.13.1` 满足官方 `>=26.8.2 <27`；CI 已由 Node 22 提升到 `26.13.1`，pnpm 保持 `11.13.1`，但提升后的 CI 尚未复跑，不得先记为通过。本机由 `npx --yes pnpm@11.13.1` 执行锁定版本。 [CI](../../../../.github/workflows/ci.yml)

| 数据或夹具 | 准备与使用 | 清理及重跑 |
| --- | --- | --- |
| F-HOST 隔离宿主与浏览器 | 测试执行者启动独立 loopback 单用户宿主，使用独立 Data Root、用户、input、output 与 temp。需要本机 API 时按项目文档设置 `ASTROPHOTO_LOCAL_STORAGE=1`。记录 URL、代理前缀、画布模式、主题、语言和实际侧栏宽度。每个独立用例使用新的浏览器上下文；版本冲突共用同一服务端记录。 | 关闭浏览器、宿主与代理。重启校验使用原测试根，其余整轮重跑用新目录。失败时保全测试日志及产物，只清理明确属于该运行的目录。 |
| F-WORKFLOW 旧工作流 | 第 0 步在迁移前保存含已绘制像素的工作流，以及 FITS Source、Image Path 和 AutoStretch 的科学样例。记录节点类型、Widget 键、连线、参数和解码像素摘要。节点目录样例含可按类别、别名和排序区分的节点，另准备子图和已收藏记录。 | 保留只读样本，按用例复制。清理浏览器中的测试工作流与收藏；宿主状态通过独立用户目录隔离。 |
| F-STORAGE 存储与环境 | 在单次测试根准备至少一个现有工作区及独立迁移目标、样本文件、缓存和预览配置。记录启动前默认工作区、测试文件摘要及设置 revision。用同一记录建立新旧两个请求视图。 | 对比写入前后目录、回执及 revision，释放迁移任务。保留失败现场，按原操作流程重试或恢复。缓存清理只针对样例缓存。 |
| F-LIBRARY 设备与光路 | 用现有 API 或仓库夹具创建可编辑设备、使用中设备、归档设备、含引用的光路以及可独立删除的测试记录。双会话对同一版本起步。另准备普通展示记录验证共用组件。 | 可复用的重启用例保留同一测试根。删除测试按引用关系进行，记录本轮新建 ID。 |
| F-SIRIL 科学数据与软件 | 准备经授权的 FITS 副本和相应工作区，记录文件摘要、维度、通道、精度及适用的 HDU/WCS 或科学头关键字。使用既有脚本支持的 Siril CLI 及独立证据路径。准备无 Bundle、已接入但不可用、可用三套配置。 | 独立样本工作区承载候选、正式结果和临时文件。保留用于比对的回执、检查结果及必要副本后回收测试资源。缺真实 CLI、样本或权限时标记相应真实用例 BLOCKED。 |
| F-CONTROL 组件与接口替身 | 对取消、乱序、超时、无效响应、上传失败及画布拒绝使用可控请求或回调。用受控时钟或明确的回执、DOM 状态、网络事件同步。 | 每例复位计时器、拦截、浏览器存储与 DOM，释放 mock 生成的 URL；记录替身不能提供的宿主证据。 |

## 2. 需求与用例追溯

每组保留原有 CASE 编号，子项在报告中独立记结果。P0 负责交付验收，P1 负责补强回归定位。优先级用于排执行顺序，PRD 要求的验收项仍须有证据。表内使用冻结后的测试入口；精确断言与生产路径以下节及 DEV 实施回写为准。

| 用例 | 规则来源 | 层与优先级 | 执行入口 |
| --- | --- | --- | --- |
| CASE-01 | FR-01，TECH 发行边界 | 静态、CI、发行、真实宿主 P0 | `frontend/scripts/check-build.mjs`、`frontend/scripts/check-proxy.mjs`、`tests/packaging/test_contents.py` 与 Registry 实际归档。 |
| CASE-02 | FR-02，UX 侧栏、节点目录与画布 | Vitest、Playwright P0 | `frontend/tests/host/canvas.test.ts`、`frontend/tests/components/SidebarNavigation.test.ts`、`frontend/tests/components/NodeCatalog.test.ts`、`frontend/tests/host/host-runtime.mjs`。覆盖收藏拒绝与重试、画布元素替换及带打开目录的模式切换。 |
| CASE-03 | FR-03，TECH 失败处理 | Vitest、API 集成、Playwright P0 | `frontend/tests/components/StorageSettings.test.ts`、`tests/integration/test_storage_api.py`、`frontend/tests/host/storage-host.mjs`。 |
| CASE-04 | FR-04，UX 资料库 | Vitest、真实浏览器、宿主 P0 | `frontend/tests/components/Library.test.ts`、`tests/integration/test_equipment_api.py`、`frontend/tests/host/equipment-host.mjs`。设备校验反馈校对本地化文案及无缺键警告。 |
| CASE-05 | FR-05，PRD 宿主和工作流契约 | Vitest、真实宿主、FITS 校验 P0 | `frontend/tests/components/ScientificNodes.test.ts`、`tests/integration/test_siril_api.py`、`frontend/tests/host/siril-host.mjs`、`tests/backend/test_siril.py` 的探测目录重试、Windows 子进程环境检查，以及普通环境和 MSYSTEM=MINGW64 下的真实候选与正式执行。 |
| CASE-06 | FR-06，PRD 绘图验收边界 | Vue 浏览器、真实宿主 P0 | `frontend/tests/widgets/registration.test.ts`、`serialization.test.ts`、`frontend/tests/host/host-runtime.mjs`。 |
| CASE-07 | FR-07，UX 对照方法 | 真实宿主、人工审阅 P0 | 隔离宿主按页、主题、语言与宽度保存 `.artifact/frontend-migration/` 前后对照，报告按实际证据列缺口。 |
| CASE-08 | FR-08，TECH Bundle 接口 | 结构、API、真实宿主、发行 P0 | `frontend/tests/components/BundleBoundary.test.ts` 覆盖空 Bundle 和第二 Bundle，`tests/backend/test_storage.py` 验证按处理器规则清理，仅处理本实例且未被占用的已知文件。另见 `tests/integration/test_siril_api.py`、真实宿主和发行包加载。 |
| CASE-09 | FR-09，DEV 官方源码复用条目 | 源码对账、对应组件或宿主回归 P0 | `04_DEV.md` §6 的实际采用清单及对应 CASE 断言。 |
| CASE-10 | FR-01、FR-02、FR-07，Assets 占位（Q-01） | 导航与真实发行宿主 P0 | `frontend/tests/components/SidebarNavigation.test.ts`、`frontend/tests/host/host-runtime.mjs` 的默认标签、网络以及重复挂载断言。 |

## 3. 用例规格

以下为冻结断言。各用例结束后按其夹具清理。失败用例同时核对可见提示、持久数据和下一次重试状态。生产入口以 DEV §6 的实际实现映射为准。

### CASE-01　干净构建与发行

**夹具** F-HOST，独立干净检出及对应锁文件。**现状** Vite 编译 `extension/frontend-entry.ts`；配套 Vue/Vitest、单 JS 与 CSS 输出及 Registry 筛选。 [当前构建](../../../../frontend/vite.config.mts) · [CI](../../../../.github/workflows/ci.yml) · [发行检查](../../../../scripts/release.py)

- **01-A** 以锁文件安装并执行目标 lint、类型检查、Vitest 和 Vite 构建。收集解析依赖、有效测试配置和构建模块清单。核查活跃组件、生产入口、可达依赖及交付物中已退出 React、React 专用工具与跨框架桥接，绘图已退出 PrimeVue/Aura。保留模块清单或依赖路径作为证据。
- **01-B** 在隔离目录检查 Registry 实际归档，确认 `js/main.js`、`js/assets/main.css`、语言资源和迁移后需要的 Siril Python 文件齐全；检查嵌套前端源码与开发文件的排除、MCP 独立分发。安装归档，在域根及代理子路径验证宿主外部模块和 CSS 请求成功、扩展加载、公共样式无外溢。失败时保留构件及请求记录。

### CASE-02　侧栏、节点目录与画布

**夹具** F-HOST、F-WORKFLOW、F-CONTROL。**现状** `NodesPage` 负责本地过滤及宿主收藏；拖放插件校验负载后调用 `createCanvasNode`。 [目录](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodes/NodesPage.tsx) · [画布](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/canvas.ts) · [拖放](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/dragDrop.ts)

- **02-A** 从原生 AstroPhoto 入口进 Nodes。用可区分的名称、别名、类别验证搜索、清空、筛选、排序、展开和空态；以点击与适用的键盘操作核对排序和弹层。收藏节点后重开，原 ID 和旧分类路径应可识别。模拟收藏写入拒绝，状态应回到宿主实际值并反馈。切换侧栏位置、滚动及拖出，确认预览锚点和清理。
- **02-B** 每种画布模式在普通画布和活动子图中分别点击与拖放节点。核对新增节点类型、目标图与位置；宿主撤销移除该次添加，保存重开后类型与连线一致。重复挂载/销毁侧栏，确认容器和监听随实例释放，重新打开后每次操作只产生一次图变更。
- **02-C** 用替身制造未就绪、只读或仅选择画布、未知节点、非法坐标、损坏或不匹配的拖放数据及 `graph.add` 失败。其它拖放事件仍交由原宿主处理。匹配但非法的数据和插入失败应有可观察反馈，图保持原状态，失败后的节点清理和宿主变更边界允许下一次合法操作正常执行。

### CASE-03　工作区、缓存、系统与预览设置

**夹具** F-HOST、F-STORAGE、F-CONTROL。**现状** `OperationProgress` 读取操作回执，`applySettings` 更新预览布局和分辨率监听，旧 revision 响应被忽略。 [工作区与缓存](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/StoragePage.tsx) · [操作状态](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/storage/shared.tsx) · [预览配置](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/previewSettings.ts)

- **03-A** 打开 Storage 与 System，核对现有工作区、默认工作区、缓存及状态能力。修改默认工作区或缓存设置，启动适用的迁移、清理操作，等待终态回执再刷新并重开。核对回执与实际引用、缓存和设置一致；对失败或取消记录已完成的副作用和可恢复动作。
- **03-B** 在环境页从服务返回的合法分辨率中选择异于当前值的一项并保存。重开环境页核对保存值，在对应科学节点观察预览刷新。检查公共画布布局变量仍能从配置读取；画布尺寸编辑不在本轮范围。无 Siril Bundle 的同一设置往返见 08-A。
- **03-C** 构造旧 revision 冲突、无效响应、超时或网络失败、页面退出前的延迟响应。冲突时提示重新读取最新值；失败保存不丢失可继续编辑的输入，旧响应不得回写新状态，取消后无迟到提示。底层错误按现有契约保留可定位字段或请求 ID。用代表性设备读取回归共享客户端取消与错误传播。

### CASE-04　设备与光路资料库

**夹具** F-HOST、F-LIBRARY、F-CONTROL。**现状** 设置层按 `equipment`、`optical_trains` 能力渲染，设备页面维护离开守卫，光路编辑按 revision 保存。 [设备入口](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/EquipmentPage.tsx) · [光路编辑](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/OpticalTrainEditor.tsx) · [后端设备路由](../../../../astrophoto/api/equipment.py)

- **04-A** 从现有设置入口进入资料库业务页，搜索、筛选、查看详情。编辑和归档设备，编辑光路并通过已有快速新增入口回填设备。关闭再打开、重启后从同一测试根查询持久结果。以普通记录样例验证共享列表、筛选和详情组件的输入输出不依赖设备 DTO。
- **04-B** 提交缺少必填项或源码明确判为非法的值，验证字段反馈及持久记录不变；双会话先由 A 保存，再用 B 的旧 revision 提交，确认 B 的草稿可见、A 的版本未被覆盖。编辑中切页或返回，分别验证取消离开、确认离开，以及已有保存中保护。
- **04-C** 尝试删除被光路引用的设备，检查拒绝原因、原引用与记录仍可查询；按现有流程解除关系后删除本轮可删除记录。用真实 Reka 下拉验证键盘选择、Escape、焦点、空值和禁用项；在窄栏与正常宽度核对 Portal 与裁切。

### CASE-05　Siril 配置、候选与正式 FITS

**夹具** F-HOST、F-SIRIL、F-WORKFLOW、F-CONTROL。**现状** 科学 Widget 由 `registerScientific` 注册，候选经预览作业接口，正式执行经 `AstroPhotoSirilAutoStretch.execute → formal_run`。 [科学 Widget](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) · [预览客户端](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/api/siril.ts) · [正式执行](../../../../nodes/scientific.py)

- **05-A** 从共享软件设置发现或指定已授权 CLI。验证合法配置保存、启用并重开；以不可用或不兼容的配置验证可辨认反馈和现有配置恢复流程。分别在两种画布打开旧科学工作流，核对节点 ID、Widget 值、连线、FITS 来源与 `IMAGE_PATH`。
- **05-B** 在 Inspector 调参、重置、撤销；只读或选择模式下尝试同一操作，参数和工作流保持原值。准备单通道样本确认链接控件按现有规则禁用。快速更换参数或来源，使旧候选延迟返回，再删除 Widget。最新候选才可见，旧请求、计时器和对象 URL 按生命周期释放。预览失败显示对应状态并可按现有方式重试。候选未被呈现或登记为正式结果。
- **05-C** 在真实可用环境分别通过两种画布发起正式队列。检查执行回执与当前输入和参数匹配，旧回执不会覆盖新状态。读取正式路径和已登记结果，核对 FITS 可读、输出尺寸、通道、精度与样本适用的科学元数据，记录变换允许的差异及原始样本摘要。候选 PNG、替身及仅 HTTP 成功都不足以覆盖本项。

### CASE-06　绘图工作流与临时上传

**夹具** F-HOST、F-WORKFLOW、F-CONTROL。**现状** 同步 Widget 值保存画板像素，异步序列化恢复后上传临时 PNG。 [Widget](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/VueExampleComponent.vue) · [现有序列化用例](../../../../frontend/tests/widgets/serialization.test.ts)

- **06-A** 在两种画布打开迁移前保存的绘图工作流，验证 `vue-basic`、`CUSTOM_VUE_COMPONENT_BASIC`、字段和像素。绘制并执行现有撤销操作，保存后重开，比较更改前后和重开的解码像素。
- **06-B** 从恢复后的画板触发前端提交，捕获 `/upload/image` 请求及提交的 prompt，核对发出的 PNG、临时类别和返回名称对应的 `threed/<name> [temp]`。用组件替身覆盖空像素与上传异常时的空引用回退，保存的工作流像素保持可恢复。删除 Widget 后检查 Vue 根及事件释放。后端 LoadImage 到下游 IMAGE 执行单独列为范围外。

### CASE-07　迁移前后的界面保真

**夹具** F-HOST、F-WORKFLOW、F-STORAGE、F-LIBRARY、F-SIRIL。**现状和口径** [UX 对照方法](02_UI_UX.md#fr-07-对照方法) · [迁移第 0 步](04_DEV.md#0-建立基线和复用清单--fr-02-至-fr-09)

- 为侧栏/节点目录、存储/环境、设备/光路、Siril/Inspector、绘图逐项采集前后对照。每组使用相同宿主、画布模式、主题、语言、实际宽度、数据状态和操作入口。涵盖明暗主题、中英文、能触发窄栏的宽度、正常与代表性失败。记录鼠标与键盘路径、标签和焦点、弹层退出和明显变更的确认。
- 素材页功能不参与对照，入口决策见 CASE-10。缺同条件基线时，标记对应对照未完成并记录缺项。官方组件的内部实现变化由 CASE-09 追溯，可见交互变化由本项评价。

### CASE-08　处理 Bundle 与公共层独立运行

**夹具** F-HOST、F-SIRIL、F-STORAGE、F-LIBRARY。**现状** 根入口注入可选 `SirilBundle`，通用 `/previews/settings` 由 `scientific_routes()` 独立注册。 [当前装配](../../../../astrophoto/storage/runtime.py) · [路由](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/astrophoto/api/siril.py) · [开发规格](04_DEV.md#科学节点与-bundle--步骤-5)

- **08-A** 用未装配 Siril 的测试构建启动。核查公共源码的导入与实际请求，公共层无 Siril 专属入口、UI 或处理调用。打开侧栏、节点目录、工作区、设备与环境，用既有 URL 往返保存预览设置。确认公共状态、路由和服务启动不依赖 Siril 的恢复钩子或能力调用。按最终通用 FITS 归属核对来源节点与 API 的独立性。
- **08-B** 装配 Bundle 但使用不可用软件配置。侧栏能加载，通用软件入口或节点显示对应状态，其他功能可继续，无法处理时不会显示成功。再用可用配置启动，从共享入口走 CASE-05。核查应用与 Widget 的注册和卸载，无独立 Siril 导航。发行包中必要运行文件及安装结果与 CASE-01 同一构件对账。

### CASE-09　官方源码复用可追溯

**夹具** 上游固定版本与最终本地源码、构建依赖及 CASE-02/03/04/06/07 的结果。**现状** [DEV 官方复用清单](04_DEV.md#4-官方源码复用清单与片段) · [现有移植](../../../../frontend/src/vendor/comfyui/README.md)

- 对侧栏注册、导航、搜索、树、排序弹层、单双选和绘图控件逐项写来源标签或提交、上游路径、本地位置、许可、必要适配与实际断言。区分公开扩展点、源码移植、参考行为与本地实现。
- 确认现有适配所需的空值、禁用、焦点、键盘、弹层作用域和生命周期已落入对应 CASE。需要本地补齐的项记录上游覆盖缺口。节点树复用与 AstroPhoto 拖放、收藏中的宿主边界分别核查。

### CASE-10　发行导航和单一注册

**夹具** F-HOST 和最终发行构件。**现状** 通常默认 Assets，有设备会话时通过 Settings 恢复。 [当前导航](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/app/App.tsx) · [占位决定](02_UI_UX.md#已决定--assets-导航)

- **10-A** 验证保留的三个标签（Nodes、Assets、Settings）均可见、可切换，首次打开仍落在 Assets；设备草稿会话存在时恢复 Settings。Assets 页只显示占位文案，中英文各验证一次；不得出现列表、导入控件或任何素材接口请求（以网络记录为证）。素材页功能本身不属于本项。
- **10-B** 真实安装后反复加载、打开及关闭侧栏，并创建、删除或重开对应 Widget。核对正式入口单一、AstroPhoto 侧栏只注册一次、每个 Widget 由当前扩展版本呈现；检查生产构件无旧 React 导航或跨框架回退。本子项可单独核查。

## 4. 失败分支与覆盖边界

这些分支来自现有实现或开发设计，最终用迁移后的真实路径和符号复核。对适用的空值、格式、范围与枚举，从实际 schema 或合法选项构造输入。本 Feature 的规则未定义任意长度和资源阈值。

| 入口与现状校验 | 正常与拒绝的观察点 | 对应子项 |
| --- | --- | --- |
| 节点添加与拖放的画布、注册、负载、位置校验 | 合法时只在活动图新增；非法或插入失败后图和监听保持可用，宿主撤销正常。 | 02-B/C |
| 请求取消、回执状态、配置 revision | 最新请求和成功终态可见；迟到、错误与旧 revision 各自有可观察结果，禁止以旧结果覆盖新值。后台任务的取消以 API 实际支持为准。 | 03-A/C、08-A |
| 设备字段、离开守卫、版本与业务引用 | 合法保存可重查；未保存、竞争和删除拒绝时保留相应草稿、版本或引用。 | 04-A/B/C |
| 受信本机与软件/Bundle 可用性 | 可信且可用时完成对应操作；在隔离环境复用现有 API 集成断言验证拒绝后不产生写入或处理。无 Bundle、无 CLI、CLI 可用分别记录。 | 03-A、04-A、05-A/C、08-A/B |
| 候选、正式回执与 Inspector | 加载、替换、取消、失败、销毁和正式执行之间可辨认，受限模式不写工作流。 | 05-B/C |
| 临时 PNG 及 Widget 生命周期 | 提交成功可追溯到上传文件；空值或异常回退且像素可恢复；每个合法挂载只持有本实例资源。 | 06-A/B、10-B |

范围外包括素材预检、导入、素材页查询与定位，绘图后端 LoadImage 故障修复，其他处理 Bundle、算法调整、数据迁移工程及 MCP 独立改造。若迁移改动涉及公共存储或 Siril 后端装配，针对相邻的状态、存储、设备 API 与打包做回归。目标宿主、真实软件、素材导航决定和旧工作流样本均是有验收影响的缺口，分别记录适用用例及可独立执行项。

## 5. 执行、冻结与证据

1. **迁移前基线。** 已在相同目标宿主录制旧界面与工作流。旧 React 和 Vue 证据在原 HEAD 上重放，不在现行构件中复用旧测试链。
2. **冻结模式 B。** 保留 CASE-01–10 原编号，迁移保存、拒绝、恢复、清理、真实执行及发行断言至本页所列文件。Assets 只检查占位、无请求、默认落点和设备会话恢复；输出 IMAGE 的旧故障仍独立。
3. **集中执行。** `pnpm -C frontend test`、`check:build`、`check:proxy` 以及 `test:host`、`test:equipment-host`、`test:storage-host`、`test:siril-host`。绘图和 Siril 各在普通调用、`--nodes-2` 下复跑；设备按需 `--verify-restart` 或 `--verify-delete`；存储脚本只写独立验收根。后端使用 `uv run pytest tests/nodes tests/backend tests/integration -m "not host"`，包装用 `uv run pytest tests/packaging` 与 `uv run python scripts/release.py registry`。环境变量详见 [宿主说明](../../../../docs/development.md)。
4. **结果证据。** 在后续 `06_TEST_REPORT.md` 按 run ID、CASE/子项记录提交、差异、构件、环境、夹具、命令与状态（PASS、FAIL、BLOCKED、SKIP、未执行），附断言输出、界面对照、回执、FITS 检查及失败清理证据。修复后单列新运行，保留原始失败和受影响用例。替身结果仅证明该层行为，真实验收据实际运行单独登记。

## 6. 质量门与冻结检查

以下为本轮测试设计的退出条件；冻结模式 B 时逐项核对，未满足项写入实际阻塞而非默认为通过。

| 门 | 要求 | 当前状态 |
| --- | --- | --- |
| G-01 追溯完整 | FR-01 至 FR-09 均至少一个 P0 子项；每个子项可追到真实 `path:symbol` 或宿主操作 | 已映射到本页真实测试及 DEV §6 |
| G-02 断言可观察 | 每项断言描述可观察结果，不以“正常”“体验良好”作唯一结论 | 已按此口径编写 |
| G-03 未实现不冒充 | 未执行、被阻、条件跳过均有对应状态与原因 | 结果、阻塞与跳过在测试报告逐项记录 |
| G-04 数据保护 | 夹具清理不删除原片、未知数据或他人目录；失败现场保留 | 已在夹具表定义 |
| G-05 发行人证 | 发行验收针对同一构件：归档内容 + 安装后加载 + 代理子路径 | 待 CASE-01 执行 |
| G-06 入口单一人证 | 最终构件只注册一套侧栏，旧 React 导航可达引用为零 | 待 CASE-10 执行 |
| G-07 占位页可验收 | 占位页无数据请求、文案可读、默认落点与迁移前一致 | 已定（2026-11-21），随 CASE-10 执行 |
| G-08 版本对齐 | 锁定安装的 Node/pnpm/依赖与官方范围一致，并记入报告 | Node、pnpm 与依赖锁已对齐，远程 CI 单列 |

- **冻结时必改。** 预计路径（如 `frontend/tests/components/*.test.ts`）需替换为实施后真实文件与命令；移除不存在的入口。
- **不得提前标完成。** 设计阶段的计划不能当作测试通过，也不能把替身结果计入宿主验收。

## 7. 变更记录

| 版本 | 更新 |
| --- | --- |
| v0.1 | 建立 CASE-01 至 CASE-10 的预计覆盖。 |
| v0.2 | 保留编号并补全子用例、输入和清理、现状与规则来源、失败分支、测试落点及冻结条件。按最新 DEV 纳入官方复用对账、无 Bundle 的公共预览设置、正式 FITS 与绘图临时引用的独立证据。 |
| v0.3 | 补工具链现状（本机 Node `v26.13.1`、CI Node 22）与第 6 节质量门；保留用例编号与预计状态。 |
| v0.4 | 按 Q-01 决定把 10-A 改为占位页断言（无请求、文案可读、默认落点不变）；CI Node 已提升，更新工具链现状与 G-07。 |
| v0.5 | 按业务实现的 Vue/V3 入口冻结 CASE-01–10，保留旧编号及执行边界。 |
| v0.6 | 纳入 Pi 的独立补测与修复回归，CASE-05 补 Windows 子进程环境和两种环境的真实 Siril 验证。 |
