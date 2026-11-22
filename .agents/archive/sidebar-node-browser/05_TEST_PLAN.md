# 侧栏与节点浏览 · 测试计划

**v1.2 · 2026-11-21 · PH-05 模式 B，按实现冻结验收规格**
**规则来源** [PRD v0.14](01_PRD.md) · [UI/UX](02_UI_UX.md) · [TECH v1.1](03_TECH.md) · [DEV v1.2 / R-01～07](04_DEV.md) · Feature Pipeline Prompt 05
**源码对照** `f84442be5f16dd36f6cfff85a686ce30027dd383` 加 DEV 实现回填。独立快照从 HEAD 叠加本专题变更，与共享工作树中并行素材、工作区和 Siril 变更分别记录。冻结不表示已覆盖全部矩阵，运行状态见 [测试报告](06_TEST_REPORT.md)。

## 1. 环境、夹具与清理

| 夹具 | 准备与用途 | 每例清理与边界 |
| --- | --- | --- |
| F1 组件 / API | Vue Test Utils、Vitest Chromium、`frontend/tests/host.ts` 与 `host/fixtures.ts` 宿主替身。以真实节点契约准备 AstroPhotoImagePath、vue-basic 和已注册 Siril 节点。通过受控响应构造缺字段、同名不同 ID、空/深层分类、坏类型与乱序。替身定义只作为故障输入。 | 每例卸载、复原时钟/模拟/路由拦截/设置与 localStorage，撤销监听。可控 Promise 等待请求或渲染状态，避免固定睡眠。替身不能证明真实宿主注册、落点和历史。 |
| F2 双画布宿主 | 独立 Backend 0.46.0 / Frontend 1.59.6，真实构件 `js/main.js`，隔离回环服务、浏览器 context、用户目录、Data Root、input/output/temp。生成独立测试工作流，至少含一条既有主图连线、一个可编辑子图和一项已知可撤销操作。复制历史迁移绘图工作流用于共用冒烟。 | 每例保存前态并在 finally 恢复设置、书签及工作流测试上下文，再关闭页面；有设置写入时验证恢复结果，清理失败单独报错。清理仅触及本轮创建的测试副本和临时生成物，证据单独保留。 |
| F3 能力与持久化 | 在 F2 隔离宿主采集实际 `/object_info`、设置保存/重读、设备 API 和软件能力；部署矩阵切换无 Bundle、改名安装或版本。失效注册需卸载/恢复的用例用独立宿主重启；替身只补分支。 | 恢复正常包配置和拦截。若测试创建设备/光路，每例 finally 用既有 API 先删该例光路、再删设备，核对 DELETE 204、GET 404；不回收其他运行的数据。跨重启用例视为单一用例，在最终阶段清理。 |

所有进入正式支持结论的宿主 case 记录准确 Backend/Frontend、构件版本或散列、HEAD/diff、启动参数、浏览器和图层。环境缺宿主、夹具、能力入口或无法恢复测试隔离时标 `BLOCKED` 并写具体缺口；执行失败标 `FAIL`，原生路径受限单独附对照证据。

## 2. 用例清单及断言

后缀用于细分 PRD 原 CASE ID。所有预期来自对应 AC、决定或代码真实 guard；当前偏差照常预期应有行为，等实现后再写/改测试。

| Case · 来源 | 层级和现有入口 | 准备、操作及可观察断言 |
| --- | --- | --- |
| 01-A · AC-01.1/2/4/6 · D-01 | F1/F2 · registerSidebar、SidebarTabs；`SidebarNavigation.test.ts`、`host-runtime.mjs` | 重复注册/同容器调用、切换容器、连续关闭和打开、destroy。验证恰好一个入口、旧容器无节点和有效监听，方向键/Home/End 只移动焦点，Enter/空格激活。导航前后节点、连线和下一步撤销结果一致。 |
| 01-B · AC-01.3/5/7 · D-08/15 | F1/F2 · Sidebar、watchLocale、NodesPage；现有导航与本地化测试 | 干净会话开 Assets；切换语言、明暗、窄侧栏。Nodes 跑查询/筛选/展开/滚动，切换三标签后保留，销毁挂载后恢复普通默认，已保存排序和收藏仍在。并模拟卸载时请求未返回，旧实例不得更新新页面。草稿优先见 05-B。 |
| 02-A · AC-02.1/2/3/11 · D-13 | F1/F3 · fetchNodes、nodeCatalog、NodesPage；`api.test.ts`、`NodeCatalog.test.ts` | 注册模块正确、本域/外域同类别、Siril 有/无 Bundle、vue-basic 模块存在/缺失、改名安装。校验归属与真实响应，例外不突破示例排除。对详情、收藏动作、点击和自有 drop 使用同一资格。两个同名不同 ID 应都保留；验证空/深分类和可选元数据缺失。 |
| 02-B · AC-02.4 · D-08 | F1/F2 · SearchField、buildNodeTree、useStoredChoice | 用节点 ID、显示名、别名、分类和适用翻译搜索；IME 组合期间结果不跟随中间值，提交后更新；清除聚焦并保留筛选。多选＋搜索＋排序，匹配折叠，全部已选分类失效时回到不过滤，部分失效时仅应用有效分类，工具栏显示实际条件。排序读写失败保留会话可用；区分真实空目录和当前无匹配。 |
| 02-C · AC-02.5/6/7 · D-09/12 · R-02 | F1/F2 · useResource、Sidebar refresh、Feedback | 首访成功；打开详情并开始有来源的拖放后刷新；从触发到 Loading、失败期间均无旧列表/详情可添加/预览或旧掉落资格。HTTP 非 2xx、断网、超时、JSON 解析、顶层结构异常分别记录。10 秒默认超时用 `vi.useFakeTimers()` 推进共享客户端时钟，断言挂起请求被 abort；取消另用 AbortController。重试成功恢复最新目录和查询；含两组请求反序成功/失败及卸载迟到响应。 |
| 02-D · AC-02.3/5 · D-09 | F1/F3 · nodeCatalog 与同版宿主定义消费 | 沿选定的 `getJson('/object_info', signal)` 输入缺名称、坏端口、缺描述、数组或非对象。合法空对象进入 Empty，非对象或数组进入 schema Error；缺名称条目被跳过，坏端口不阻断其他定义。记录官方转换返回空映射及宿主后续注册层的边界。应能显示不受影响的有效定义，不伪造字段，不把同一请求的上游异常全部误报为空目录。隔离宿主逐节点生成错误时检查服务日志和成功节点仍返回。 |
| 03-A · AC-03.1～4/7 · D-05/06 | F1/F2 · NodesPage add、拖放、宿主创建路径；现有 `canvas.test.ts` 与宿主冒烟 | 使用有/无子图夹具，在四种画布/图层组合各跑原生、AstroPhoto 点击和拖放；每次正好出现一个指定稳定 ID，记录正确目标、可视中心、默认原生库无额外标题偏移的坐标、缩放/平移及覆盖层命中。非目标图不变。同容器重渲染及换容器后各发一次避免重复。 |
| 03-B · AC-03.6/8 · D-05/06 | F2 · 宿主 Undo/Redo、保存、重开 | 每个图层独立验证点击/拖放后 Undo 删除本次节点，Redo 恢复正确节点、图层及位置，既有节点/连线保留。使用宿主保存和重开该工作流，验证保存前后的稳定类型及子图归属。覆盖旧绘图和科学工作流重开的代表回归。 |
| 03-C · AC-03.9/10 · D-11/17 | F2/F3 · 宿主能力探测与逐动作回退 | 对 1.59.6 薄适配的 LGraphNode 归属、四类现有错误、能力缺失或原生语义偏差，以及未验证版本分别核对。不能安全接入时无伪成功、自动重试或图写入，能转入宿主原生节点库继续操作。仅完整通过该版本要求的运行矩阵后登记支持。 |
| 04-A · AC-04.1～3/6 · D-04 | F1/F2 · NodeTree、NodeHoverPreview、详情 | 选择有/无说明和端口的节点，校验显示名、缺显示名回退稳定 ID、实际端口、缺省、固定依赖/帮助与类别只在树中。输入含 HTML 标签的描述，验证按文本显示且未生成对应 DOM。对照图快照、API 请求及执行计数，查看详情和浮层都无创建或执行。 |
| 04-B · AC-04.4/5/7 · D-10/12 | F1/F2 · NodeLeaf、NodeHoverPreview、详情 | 鼠标进入/移出、滚出、切标签、拖开始及销毁，浮层关闭或安全隐藏。长文本、窄栏、左右侧栏、窗口缩放；键盘及真实触摸浏览器可进入详情，焦点落在返回按钮，关闭后回原行，原行消失则回搜索。选项弹层 Escape 后返回按钮；悬停预览 Escape 收起且保留已有焦点，重新移入才再显示。刷新期间及刷新后失效 ID 无旧详情添加入口。 |
| 05-A · AC-05.1/2/3/7 · D-15/18 | F1/F2/F3 · Sidebar、SettingsPage、SoftwarePage；`BundleBoundary.test.ts` | 新会话默认 Assets 的 Projects，确认 All Assets 可切换，项目列表由素材库只读 API 加载。检查仅打开和浏览不触发素材写入，允许全局 `/astrophoto/v1/previews/settings` 预取。节点与领域设置首访懒载。用资源状态与能力信号验证加载、失败/重试、入口可用和规划；在 Siril 模块详情使用真实未配置和依赖异常状态，未知 reason 保持通用不可用。无 Siril Bundle 公共导航可用、无其专属请求。 |
| 05-B · AC-05.4/5/6 · D-15/16 · R-07 | F1/F2/F3 · EquipmentPage、SettingsPage；`Library.test.ts` | 设备与光路各做 dirty，分别取消离开、确认丢弃、保存中导航、保存失败和重挂载。取消/失败保留输入，确认清草稿。确认在途时反复激活标签，只有一次确认，迟到结果不更新已释放页面；注册闭包有效时重开优先 Settings。硬刷新/销毁注册实例后普通落点 Assets，之前正式保存的记录仍可通过 API 读到。 |
| 05-C · AC-01.8 · D-19 | Chromium 组件与真实宿主侧栏 | 在节点详情重按或切回节点，验证查询和目录；从全部素材回项目；从存储详情重按或切回设置，验证模块列表。组件另外验证导入直达存储、素材草稿取消及确认、设备草稿取消和同标签确认。 |
| 06-A · AC-02.8/9 · D-14 · R-03 | F1/F3 · readBookmarks、目录/树路径动作；`NodeCatalog.test.ts` | 预置同 ID 在两个文件夹及顶层、外域和空文件夹。仅文件夹存在时普通目录按钮未选；添加/去除顶层不动其余路径；收藏树移除一个明确路径只影响该引用。用宿主原生节点库与重载后的设置交叉核验。 |
| 06-B · AC-02.9/10 · D-02/07/14 · R-03 | F1/F3 · 书签回读和宿主设置 | 卸载同 ID 隐藏，原字符串不删，恢复重新显示。注入 set 同步失败、异步拒绝、实际持久 HTTP 失败和快速重复操作；仅当该次宿主 POST `Response.ok` 后确认写入，验证宿主 UI 同步。非 2xx 和网络拒绝经已校验的服务端 GET 回读，断言没有二次 POST，读取真实保存值，对比失败前后、刷新后的其他引用及第二活动页面修改。多窗口仅记录宿主实际表现。 |
| 07-A · AC-02.2/11、AC-03.2/5/7 · R-01/04 | F1/F2 · writeNodeDrag/readNodeDrag/attachCanvasDrop | 合法自有载荷、普通文件、其他 MIME、同 MIME 但坏 JSON/空值/版本/kind/ID、示例或未注册、旧会话、无 DataTransfer、取消。外域行为照同版宿主；非法自有载荷不产生节点。拖中切主工作流、子图、画布/渲染器、刷新或移出 Nodes，包括同 canvas 元素及切离再切回。旧会话拒绝，目标及旧图均无意外变更。切换完成后启动新拖放是已有证据的独立回归。 |
| 07-B · AC-03.5/6 · R-05/06 | F1/F2 · 宿主权限、创建与历史适配 | 图未就绪、只读、仅选择、禁交互、有效/无效落点、非有限坐标、工厂返回空或抛错、插入失败与加入后失败。记录失败点、用户反馈、图快照和宿主历史；下一个 Undo/Redo 仍针对预置的已知操作，不被失败污染。 |
| 02/03-P · PRD §8.5 | F2/F3 · 采样，无人为 SLA | 记录宿主/本域目录数量、响应大小，测下载/转换/首显、查询到更新、分类滚动、收藏增加及各画布拖放反馈。保留采样环境和规模，明显退化记录为调查项。 |

### 测试位置与来源

下表路径以 `frontend/tests/` 为根。已补充 `host/api.test.ts`、`host/canvas.test.ts`、`components/NodeCatalog.test.ts`、`components/SidebarNavigation.test.ts` 和 `host/host-runtime.mjs`。各子例的 AC、D、guard 和具体动作见上表，未覆盖的宿主专项按报告补充。

| 子例 | 优先级 | 规则来源 | 当前符号与预计路径 |
| --- | --- | --- | --- |
| 01-A/B | P0 | FR-01、D-01/D-08/D-15 | registerSidebar / SidebarTabs，`components/SidebarNavigation.test.ts`、`host/host-runtime.mjs` |
| 02-A/B/C/D | P0 | FR-02、D-09/D-12/D-13 | nodeCatalog / useResource，`host/api.test.ts`、`components/NodeCatalog.test.ts` |
| 03-A/B/C | P0 | FR-03、D-05/D-06/D-11/D-17 | createCanvasNode，`host/canvas.test.ts`、`host/host-runtime.mjs` |
| 04-A/B | P0 | FR-04、PRD §8.2/8.4 | NodeHoverPreview / NodesPage，`components/NodeCatalog.test.ts`、`host/host-runtime.mjs` |
| 05-A/B | P0 | FR-05、D-15/D-16 | SettingsPage / EquipmentPage，`components/BundleBoundary.test.ts`、`components/Library.test.ts`、`host/host-runtime.mjs` |
| 06-A/B | P0 | FR-02.5、D-02/D-07/D-14 | NodesPage 收藏，`components/NodeCatalog.test.ts`、`host/host-runtime.mjs` |
| 07-A/B | P0 | FR-03.3/5/6、D-13 | dragDrop / createCanvasNode，`components/NodeCatalog.test.ts`、`host/canvas.test.ts`、`host/host-runtime.mjs` |
| 02/03-P | 采样 | PRD §8.5 | `host/host-runtime.mjs` 或隔离宿主采样记录 |

## 3. 四组合原生对照

每格按相同初始工作流先运行原生节点库，再恢复图和环境执行 AstroPhoto。主/子图分别抓节点、连线、位置及宿主 Undo/Redo 前后结果。原生限制记原生观察值，产品偏差标额外差异。拖放失败后检查现有操作仍可撤销。

| 环境 | 正常路径（03-A/B） | 边界及失败（07-A/B） |
| --- | --- | --- |
| Classic 主图 | 点击、拖放、缩放/平移、各自 Undo/Redo、保存重开 | 取消、只读/仅选择、覆盖与无效目标、切工作流/渲染器、失败后历史 |
| Classic 子图 | 点击、拖放、缩放/平移、子图 Undo/Redo、保存重开 | 同上，另验证切子图/退出后不会写到根图或另一子图 |
| Nodes 2.0 主图 | 独立执行同组正常路径，记录 DOM 渲染模板的命中与位置 | 同组负向路径，逐项对照 DOM 节点、控件、覆盖层和背景命中 |
| Nodes 2.0 子图 | 独立执行同组正常路径，检查根图无额外节点 | 同组负向路径，跨子图、覆盖层和撤销须留独立证据 |

现行脚本及 [F-4 历史实测](06_TEST_REPORT.md#覆盖与差额) 覆盖直接背景命中、主图撤销重做、主/子图成功路径和渲染器切换完成后的新拖放。覆盖层以同版原生库行为为准，控件层不能被扩展穿透。子图撤销、**正在拖放时**图切换、覆盖层和失败后历史需要单列执行。脚本重开迁移绘图工作流的证据不代替保存并重开本次添加后的子图。

## 4. 可执行入口与冻结条件

以下命令用于冻结后的回归。先在仓库根按项目约定安装依赖并构建真实产物。对并行开发工作树与本专题隔离快照分别记录结果。

```powershell
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend build
pnpm -C frontend exec vitest run tests/components/SidebarNavigation.test.ts tests/components/NodeCatalog.test.ts tests/components/Library.test.ts tests/components/BundleBoundary.test.ts tests/components/Localization.test.ts tests/host/api.test.ts tests/host/canvas.test.ts
pnpm -C frontend test
pnpm -C frontend check:build
pnpm -C frontend check:proxy
```

宿主冒烟按 [开发指南](../../../docs/development.md) 设置 `COMFYUI_TEST_URL`、`ASTROPHOTO_BASELINE_WORKFLOW`、`ASTROPHOTO_MIGRATION_EVIDENCE`，使用 `pnpm -C frontend test:host` 与 `pnpm -C frontend test:host --nodes-2`，结果输出到本轮证据目录。缺失子场景按矩阵补 Playwright 或记录可复查的人工实测。若需复核注册和状态联通，隔离环境使用 `uv run pytest tests/integration/test_host_runtime.py -m host`。设备记录清理由创建它们的各用例负责。

冻结前用 DEV 实际符号对照 AC-01.1～05.7 与 R-01～07；调整预计文件及测试夹具，记录 HEAD、构件和依赖。冻结后完成对应组件、构件和真实宿主回归，在 [报告](06_TEST_REPORT.md) 逐项记录预期、结果、对照、日志和清理情况。版本组合只在必需证据充分时列入正式支持；宿主限制和实现偏差进入复测与支持说明。Siril 科学执行、素材导入、MCP 写画布、绘图 downstream IMAGE 另有专题，本计划保留其必要的导航与工作流兼容边界。
