# 侧栏与节点浏览 · 测试报告

**v1.3 · 2026-11-21 · PH-06 当前验证与历史记录**

## v0.14 共享集成验证

摄影素材库 v0.7 与 UI/UX v1.0 的用户确认已转入侧栏 D-18。默认 Projects 和 All Assets 使用当前共享构件。运行基线为 HEAD `f84442b` 加当前集成工作树，测试宿主为 Windows / Chromium、Backend 0.46.0 / Frontend 1.59.6、隔离临时 Data Root 和用户目录、回环 8193、扩展安装名 `AstroPhoto-Renamed`。

| Run | 命令与状态 | 结果及证据 |
| --- | --- | --- |
| integrated-final-components / gates | `pnpm -C frontend test`、`typecheck`、`lint`、`check:build`、`check:proxy` 均退出 0 | 14 文件 74 项通过。共享构件、静态检查和代理挂载通过。证据 `.artifact/sidebar-node-browser/integrated-final-components.txt` 与 `integrated-final-hashes.json`。 |
| integrated-r5 | `node frontend/tests/host/host-runtime.mjs` 与同命令加 `--nodes-2` 均退出 0 | 默认 Projects 与 All Assets；导航保持节点和连线；两种画布的主/子图、缩放平移、原生放置对照、真实故障历史及保存内容重开通过。短暂省略目录定义后收藏隐藏且设置保留，恢复同 ID 后重新显示。证据 `.artifact/sidebar-node-browser/integrated-r5/{classic,nodes-2}/report.json` 与 `integrated-r5-hashes.txt`。 |
| integrated-touch-bookmarks | 真实宿主两页 Playwright Chromium，`hasTouch: true`，退出 0 | 940 × 720 触控点击可打开与关闭详情，没有预览弹出或节点变化。其他页先落盘的路径被下一次写入保留；请求在途重复点击保持一次 POST。两页写入重叠时后提交的全数组覆盖前者，符合宿主无多窗口原子保证的边界。证据 `.artifact/sidebar-node-browser/integrated-touch-bookmarks.txt`。 |
| integrated-storage-navigation | 真实宿主 Playwright Chromium，退出 0 | Assets → All Assets → Import Assets → Settings → Storage，回到 Assets 后导入页面保留，动作仅发出素材库 GET。证据 `.artifact/sidebar-node-browser/integrated-storage-navigation.txt`。 |
| integrated-r6 | `pnpm -C frontend exec vitest run`，真实宿主脚本 Classic 与 `--nodes-2`，全部退出 0 | 14 文件 75 项通过。补测同名节点稳定 ID、深层及空分类、缺说明回退和元数据纯文本。双画布复验真实 Projects 读成功、All Assets 往返、导航前后图不变、缩放和平移、插入异常保护原生历史、原生节点库对照。产物哈希与 integrated-final 构建一致且两次浏览器运行间未变化。证据 `.artifact/sidebar-node-browser/integrated-r6-components.txt`、`integrated-r6-hashes.txt` 与 `integrated-r6/{classic,nodes-2}/report.json`。 |

早期共享第一次复跑发现旧脚本在接入素材库后用全侧栏选择器命中多个搜索框，已限定 Nodes 搜索框。r3 的 Nodes 2.0 快照差异只出现在宿主更新的 `localized_name`。图拓扑及节点业务属性比较保留，其显示标签按本地化字段处理。对应失败日志保留在 `.artifact/sidebar-node-browser/integrated-classic.txt` 与 `integrated-r3-nodes-2.txt`。

## v0.13 隔离实现与早期共享执行

**运行基线** `f84442be5f16dd36f6cfff85a686ce30027dd383` 加 [DEV v1.2 的实际切片](04_DEV.md#实现回填) 与测试改动。用 HEAD 文件和本专题改动生成隔离快照 `.artifact/sidebar-node-browser/snapshot/`，两份共享词条仅叠加本专题的降级消息。独立宿主 Backend 0.46.0 / Frontend 1.59.6、Python 3.12.16、Node 26.13.1、Chromium；证据复跑 pnpm 11.25.0 使用现有锁。宿主用隔离临时 Data Root、用户目录和回环 8193，包目录改名 `AstroPhoto-Renamed`。实际 `/object_info` 中 ImagePath 的模块值为 `custom_nodes.AstroPhoto-Renamed`。JS SHA-256 `6934268d839c5dc8c6924bb1aeab08f4f5048412c6be1862999c2f50d6a48a2d`，CSS SHA-256 `1749b75be704355c6a3c421878d43b4c97958cca2a7134e0f442b0baa52fe29a`。

| Run | 命令与退出 | 结果与证据 |
| --- | --- | --- |
| shared-first | 共享工作树 `pnpm -C frontend test`，退出 1 | 64 项通过，Localization 一项失败。并行开发中的素材组件引用 24 个缺失 `assetLibrary.*` 词条，失败属于共享工作树集成差额。 |
| isolated-components-r2 | 隔离快照 `pnpm -C frontend test`，退出 0 | Vite 构建通过、Chromium 13 文件 65 项通过，覆盖目录刷新乱序、端口处理、收藏路径、失败、焦点与暂态拖放。日志 `.artifact/sidebar-node-browser/component-final.txt`。 |
| isolated-gates | 隔离快照 `typecheck`、`lint`、`check:build`、`check:proxy`，全部退出 0 | 类型、静态检查、单构件和代理加载通过。 |
| host-classic-r2 / host-nodes2-r2 | `node frontend/tests/host/host-runtime.mjs` 分别默认与 `--nodes-2`，均退出 0 | 改名包加载、默认 Assets、侧栏导航、搜索与详情焦点、精确收藏与持久拒绝、主/子图创建和历史、切标签/进子图后旧拖放拒绝、序列化重开。原始日志 `final-r2-classic.txt`、`final-r2-nodes-2.txt`，报告与截图 `final-r2/{classic,nodes-2}/`。 |
| host-scope-r6 | 同命令分别运行 `--nodes-2` 和默认，均退出 0 | 在 r2 工作流上增加真实主/子图只读与仅选择拒绝、点击中心、Escape 收起；Nodes 2.0 用真实 TransformPane 内控件和可接收图面片元素验证拒绝/创建与撤销。此批的标题偏移仍为旧假设，由后续默认库实测替代。日志 `scope-r6-nodes-2.txt` 与 `scope-r6-classic.txt`。 |
| host-scope-r9 | 同命令两种模式均退出 0。同步复跑隔离 Chromium 的前置 r7 为 13 文件 65 项通过 | 真实默认库主/子图的位置与 AstroPhoto 主/子图按各自入口验证。默认库拖放与 AstroPhoto 均使用转换后的指针，无额外标题偏移。原生树行双击是指针放置，AstroPhoto 详情按钮使用宿主无坐标的可视中心。现行隔离构件 JS SHA-256 `a1a749231552974c1c1249294646c8e92f3b4706fd3a5e7659ed5bfce8bfb158`，CSS 同前。证据 `.artifact/sidebar-node-browser/scope-r9/{classic,nodes-2}/report.json` 与 `component-native-position.txt`。 |
| host-scope-r10 | 同命令两种模式均退出 0 | 在 r9 上注入主图插入后异常。组件显示失败、清理部分插入，随后的宿主 Undo/Redo 仍撤销并恢复上一条有效操作。证据 `.artifact/sidebar-node-browser/scope-r10/{classic,nodes-2}/report.json`。 |
| isolated-r14 / host-scope-r14 | 隔离快照 `typecheck`、`test` 退出 0。真实宿主同脚本两种模式均退出 0 | Chromium 13 文件、66 项通过。真实主图和子图注入插入后异常，验证节点数与 ID 计数恢复，随后原生 Undo/Redo 正常。JS SHA-256 `00c9d5873bdf7f57fab0f6844989a837b75b370d099ffe4353ee702790855d62`。原始日志 `component-r14.txt` 及 `scope-r14-*.txt`，两种模式状态见 `scope-r14/{classic,nodes-2}/report.json`。 |
| touch-host | 真实宿主 Playwright Chromium `hasTouch: true`，退出 0 | 触控打开 Nodes、打开节点详情和返回。无悬停卡片，与操作前相比图节点数不变。日志 `.artifact/sidebar-node-browser/touch-host.txt`。 |
| native-bookmark | 真实宿主 Chrome 切到原生节点库观察 | AstroPhoto 写入同一 ID 后，未重载的官方节点库把对应图标从 `pi-bookmark` 切为 `pi-bookmark-fill`，与宿主 getter 一致。原生按钮标签仍为 Bookmark。原始 DOM 记录 `.artifact/sidebar-node-browser/native-bookmark-diagnosis.txt`。 |
| shared-build | 共享工作树 `pnpm -C frontend build` 与 `typecheck` 退出 0 | 当前构件含并行素材/存储工作。共享 Sidebar 已切入 AssetsPanel，隔离测试的 Assets 占位结果只适用本专题 PRD 基线。 |
| shared-final | 共享工作树 `pnpm -C frontend test`，退出 1 | 构建通过；41 通过、27 失败。运行时并行 ScientificNodes 测试出现重复 async，Vite 错误浮层拦截了 NodeCatalog 等实际点击。混合快照还在变动，该失败不得记为侧栏隔离成品的不通过或共享集成已通过。日志 `.artifact/sidebar-node-browser/shared-final.txt`。 |
| shared-targeted | 共享工作树 `pnpm -C frontend exec vitest run tests/components/NodeCatalog.test.ts tests/host/api.test.ts tests/host/canvas.test.ts`，退出 0 | 3 文件、22 项通过。覆盖目录与画布边界，Assets 默认导航及共享全量仍待确认后复跑。日志 `.artifact/sidebar-node-browser/shared-targeted.txt`。 |

此前两个运行分别在 Nodes 2.0 和 Classic 首次目录拖放等待后退出 1。诊断复跑通过。宿主脚本改为以普通目录行发起拖放，并等待测试重置的书签区完成更新，防止锁定同期销毁的书签行。scope-r3 的 Escape 收起预览时搜索控件也清空本来获得焦点的查询，测试在进入后续收藏前恢复查询。scope-r4 的 Nodes 2.0 有一次浏览器未归因的 Network Error，后续同基线复跑通过，保留失败证据。scope-r8 暴露原生树行双击使用指针放置，经源码和实际坐标核对后按各自的操作语义断言，r9 两种模式通过。独立样本宿主 `/object_info` 含 1069 个节点、扩展模块定义 4 个，响应约 2.25 MB；PowerShell 本机单次 GET 707 ms，只是样本。

## 评审回写时的历史记录

### PH-06 失败分诊

- **失败插入污染子图历史。** `scope-r11` 中故障发生在节点已插入后，旧实现清除了节点，下一条宿主撤销仍被空历史消耗。诊断文件 `.artifact/sidebar-node-browser/rollback-trace/nodes-2/rollback.json` 显示只有根节点 ID 计数及子图序列化的同一计数从 7 增至 8；宿主 `ChangeTracker` 比较 definitions 时可观察到该差异。修复位置为 `frontend/src/host/canvas.ts:createCanvasNode`：按当前宿主计数与失败节点 ID 确认归属后恢复本次 ID 分配，再让宿主完成原生事务。首次补丁遇到发布类型声明的 NodeId 字符串品牌与实际数值计数差异，已通过显式数值归一处理。回归脚本逐例检查计数、节点数和后续 Undo/Redo。

### 早期迁移和静态评审

当时只执行了静态评审。以下保留原始历史证据，不计入本轮的测试通过数。

## 基线映射

| 运行记录 | 基线、环境与操作 | 证据 |
| --- | --- | --- |
| `frontend-vue-v1596-local-2026-11-21` | `4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` + 迁移工作树。Windows、Node 26.13.1、pnpm 11.13.1、Chromium、宿主 Backend 0.46.0 / Frontend 1.59.6、独立用户与 Data Root。运行 host-runtime 默认 Classic 及 `--nodes-2`，另有迁移报告 01-A/02-C 的组件测试。 | `.artifact/frontend-migration/final-host-classic.txt`、`final-host-nodes-2-r2.txt`，本轮已读，两种模式均有原始 PASS。 |
| `pi-close-2026-11-21` | `4c0cf4d` + Vue 迁移、Pi 补测和修复工作树，同目标宿主版本。历史命令 `npx --yes pnpm@11.13.1 -C frontend exec vitest run`（61 通过）及 `node frontend/tests/host/host-runtime.mjs` 默认和 `--nodes-2`，最终 Registry 双模式复验。 | `.artifact/frontend-migration/pi-close/` 内的 `registry-host-*.txt`、`registry-host/{classic,nodes-2}/report.json`。这轮覆盖 F-1 收藏拒绝与 F-4 渲染器切换。 |
| 本轮静态核对 | `git diff 4c0cf4d HEAD -- frontend extension tests js` 确认历史提交差额含 Vue Sidebar、目录、画布/拖放、新测试与构建产物；`git diff HEAD -- frontend extension js astrophoto tests` 的相关非文档变化为上述设备测试路径。提取两个历史 zip 的 JS/CSS，与当前工作树按 SHA-256 比对。 | 当前 main.js `a0482acf264fff499d1eb3e1e6664e8382ae3c1e829a4c6c06c3940df381e897`、CSS `1749b75be704355c6a3c421878d43b4c97958cca2a7134e0f442b0baa52fe29a` 均与 `pi-close/registry.zip` 一致；初次迁移 zip 的 CSS 一致，JS 为 `7b16d7578b6507a5d78ffb80a27a9e6a2d203a067f3fe9502d04d7588eaed90f`。 |

历史 dirty 工作树没有完整可重建快照。本轮未比全量包文件、依赖环境或图状态。JS/CSS 匹配支持引用 F-4 等已有构件证据；新规则、宿主状态及其余文件仍以本专题正式回归确认。命令行环境字段和完整历史失败记录以归档为准。 [迁移报告及 Pi 复验](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

## 覆盖与差额

“已覆盖”指所列 run 的指定动作，表中所有当前基线验收状态均为 NOT_RUN。

| 验收 | 历史覆盖及来源 | 仍需验证 |
| --- | --- | --- |
| AC-01.1～4、01.6/7 | 部分。迁移 02-B/10-A/B 真实侧栏反复打开、明暗和语言。导航组件验证懒载、跨标签保留查询和键盘。 | 强制换容器、资源释放、完整浏览上下文、并发导航及图历史无差异。 |
| AC-01.5、05.1/2/5/7 | 部分。迁移 10-A/B 和 08-A 覆盖默认 Assets、无素材请求、无 Bundle；组件验证设备草稿恢复。 | 真实闭包重挂载、强制销毁及光路草稿组合。 |
| AC-02.1～5、04.1～3 | 部分。迁移 02-A 覆盖正常目录、搜索、悬停和详情，组件含别名、IME、排序和分类。 | 统一 examples 排除、改名部署、坏端口逐条处理、加载错误完整分支及缺字段。 |
| AC-02.6/7、02.11、04.7 | 未覆盖完整新规则。现有取消和载荷替身仅覆盖部分边界。 | 刷新立即撤下、过期响应、失效详情和拖放世代。 |
| AC-02.8～10 | 部分。迁移 02-A 正常书签，Pi F-1 覆盖 setter 同步和异步失败及 UI 回滚。 | 顶层与具体路径隔离、失效隐藏恢复、实际非 2xx 回读、宿主共享内存同步。 |
| AC-03.1/2/7 | 双模式正常点击及背景拖放到主图和子图已有实测；Pi F-4 已覆盖保持侧栏/查询挂载、切换渲染器完成后再拖；Chromium 强制替换 canvas 后只接受新元素，验证卸载。 | 同版本原生逐动作比对，以及拖动中切图、子图或渲染器，含相同 canvas 元素。 |
| AC-03.3～6 | 部分。真实主图 Undo/Redo；迁移 02-C 用 canvas 替身覆盖只读、仅选择、未注册、非法载荷和插入失败清理。 | 双模式原生落点与覆盖层、真实只读及仅选择、子图 Undo/Redo、失败后历史及取消。 |
| AC-03.8～10 | 部分。历史真实宿主重开绘图与科学夹具，目标版本明确。 | 保存并重开本次添加的节点与子图，选定薄适配的目标矩阵和降级验证，完成后才登记完整支持。 |
| AC-04.4～6 | 部分。真实鼠标悬停和切入详情，迁移窄栏界面对比。 | Escape、焦点、触屏、图与执行副作用专项。 |
| AC-05.3/4/6 | 部分。迁移 03/04/08-B 含设置页面、设备、未配置及保存相关路径。 | 按结构化来源覆盖状态，验证保存中/失败/确认竞态、刷新及保存持久性。 |

React 的 0.45.0 / 1.59.1 Sidebar、主题、创建和收藏记录为更早参考。 [React 历史](../../../docs/react-sidebar.md) · [收藏任务](../../notes/node-bookmarks.md) · [关闭草案](Close.md)
## v0.15 顶层标签回归

2026-11-21，`f84442b` 加当时工作树。Windows Chromium 执行 `pnpm -C frontend exec vitest run tests/components/SidebarNavigation.test.ts tests/components/AssetsLibrary.test.ts tests/components/Library.test.ts`，3 文件 22 项通过。完整 `pnpm -C frontend exec vitest run` 14 文件 76 项通过。typecheck、lint、build、check:build 和 check:proxy 均通过。

当前本地 ComfyUI 0.46.0 / Frontend 1.59.6 的独立浏览器标签复测了重按节点、素材、设置及设置跨标签切回，均进入首页。专用存储入口和未保存确认由组件测试覆盖。
