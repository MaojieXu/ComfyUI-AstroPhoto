# 侧栏与节点浏览 · 测试计划

**v0.3 · 实施后规格**。2026-11-21 静态核验 [索引](00_FEATURE_INDEX.md) 的 HEAD + dirty Vue 基线，全部 NOT_RUN。规则来源为 [PRD](01_PRD.md) 各 FR，实际入口与 guard 见 [DEV](04_DEV.md)；“已有”指当前测试源码，历史结果见 [报告](06_TEST_REPORT.md)。

## 夹具与执行顺序

- **F1** 使用 Vitest Chromium、Vue 包装和宿主替身，准备本域两类别、外域节点与缺可选元数据节点；注入目录、设置与可控异步响应。先跑 `pnpm -C frontend exec vitest run tests/components/SidebarNavigation.test.ts tests/host/api.test.ts tests/host/canvas.test.ts`；卸载组件、恢复 mock/timer 和 DOM。
- **F2** 使用 0.46.0 / 1.59.6 回环隔离实例及独立浏览器设置。按脚本设置 `COMFYUI_TEST_URL`、`ASTROPHOTO_BASELINE_WORKFLOW`（隔离绘图 JSON）及 `ASTROPHOTO_MIGRATION_EVIDENCE`，分别跑 `pnpm -C frontend test:host` 与 `pnpm -C frontend test:host --nodes-2`。退出后还原设置，保留版本、执行日志和截图，清理限临时工作流及图片。缺真实宿主则对应验收 BLOCKED。

| Case / 规范 / 实际入口 | 夹具与步骤 | 验收与已有覆盖 |
| --- | --- | --- |
| CASE-01 · FR-01 · registerSidebar / watchLocale / SidebarTabs | F1、F2。重复注册，同容器 render、换容器和 destroy；方向键、Home/End、Enter/空格，切中英文及明暗主题，调整宽度。 | 单实例，旧 root/监听释放；焦点与选中分离，文字可读，切换不改图。现有 `SidebarNavigation.test.ts` 查默认、单入口、ArrowRight、语言与销毁；真实主题和边界用 F2。 |
| CASE-02 · FR-02 · nodeCatalog / NodesPage / SearchField | F1。首访后用别名、ID、说明及 IME 搜索，切分类/排序/展开，跨标签返回。分别输入空目录、无匹配、坏元数据、失败后重试和交错响应。 | 仅显示本域有效定义，失效请求不覆盖最新目录，搜索状态不混淆，IME 不发中间查询。现有组件覆盖别名、懒加载、IME、清除及切标签保留，`frontend/tests/host/api.test.ts` 覆盖目录 schema、空目录、超时和客户端取消的基础契约。分类/排序和 Nodes UI 的错误恢复、交错响应待补。 |
| CASE-03 · FR-03 · createCanvasNode / attachCanvasDrop | F2。两模式分别在主图点击添加、撤销、重做、拖入画布，再进子图点击与拖入，检查主图。 | 实例位于当前图，宿主历史可还原。现有 `frontend/tests/host/host-runtime.mjs` 覆盖主图和子图该组正向动作；子图撤销与投放到 Nodes 2.0 覆盖层单列复验。 |
| CASE-04 · FR-04 · NodeLeaf / NodeHoverPreview / NodesPage | F1、F2。对有端口/说明及缺字段节点打开详情、悬停；测试移出、拖拽、切换、滚动、窄宽与长文字。 | 值匹配来源，浮层关闭且节点数不变。已有宿主脚本有悬停；边缘、焦点、空值待补。按 D-04 核对树中的类别和详情固定说明。 |
| CASE-05 · FR-01、FR-05 · Sidebar / SettingsPage | F1、F2。初始无会话打开，监视导航请求，打开/返回 Settings 模块；注入未就绪能力或网络错误；造设备草稿重挂载。 | 默认 Assets，无素材请求；草稿恢复 Settings；状态及重试清楚。`SidebarNavigation.test.ts` 和 `Library.test.ts` 已查默认占位/恢复，失败和真实状态待补。 |
| CASE-06 · FR-02 · bookmark setting | F1、F2。预置其他节点、目录、失效 ID 和本节点完整路径；收藏/取消，活动页外部变更，并注入设置保存错误。 | 其余合法收藏完整，失败可见且与宿主恢复一致。F2 已有正常写入脚本，异常及失效按 Q-02 待覆盖。 |
| CASE-07 · FR-03 · readNodeDrag / createCanvasNode | F1/F2。独立注入错 MIME、坏 JSON/版本/ID、未注册、只读、仅选择、禁交互、非有限坐标、工厂空值及图添加失败，另验证取消。 | 非自有事件交还宿主，自有拒绝无遗留节点，进入创建尝试后的事务通知配对。现有 [Vue 画布测试](../../../frontend/tests/host/canvas.test.ts) 覆盖只读、仅选择、未注册、坏 JSON/对象/类型/ID 和添加失败清理；假 MIME、版本、禁交互、非有限位置、工厂空值、已加入后出错和真实取消待补。 |

工作流保存、实际队列与 PNG 另由扩展底座验收。本计划保存历史 `test:react` 适用范围及旧宿主 0.45.0 / 1.59.1 证据，复验记录逐项注明画布模式与覆盖边界。 [历史记录](../../../docs/react-sidebar.md)

## 双画布与导航的验收矩阵

| 环境 | 主图 | 子图 | 补充边界 |
| --- | --- | --- | --- |
| Classic Canvas | 点击添加、拖放、撤销和重做，核对节点 ID、数量及位置 | 点击、拖放，返回主图核对节点归属，单独验证子图撤销重做 | 只读、无效拖放、拖放取消、画布更换及覆盖层 |
| Nodes 2.0 | 与 Classic 分别执行相同步骤 | 与 Classic 分别执行相同步骤 | 同样验证只读和负向分支，单独记录覆盖层命中及屏幕缩放 |

每项记录模式、图层、操作前后节点数、节点类型、坐标或归属、撤销结果和失败反馈。迁移批次的主图撤销及主图、子图正常添加与拖放可作为对应基线证据，未执行的子图撤销和各负向分支保持待验。

导航验收从干净会话打开 Assets，观察素材请求，依次切到 Nodes、Settings 和返回。检查 Settings 已接线模块的可用、加载和错误显示，并核对规划模块只展示说明。另构造设备未保存草稿、确认留在当前页以及离开后恢复的场景。浏览器刷新和侧栏实例销毁后的状态以 Q-03 决定为准。

独立迁移批次 `frontend-vue-v1596-local-2026-11-21` 在目标宿主用 [`final-host-classic.txt`](../../../.artifact/frontend-migration/final-host-classic.txt) 与 [`final-host-nodes-2-r2.txt`](../../../.artifact/frontend-migration/final-host-nodes-2-r2.txt) 记录双模式的正常路径，Chromium 还记录画布防御用例通过。按该批次基线使用，不代替本 Feature 的细分验收。 [迁移测试报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)
