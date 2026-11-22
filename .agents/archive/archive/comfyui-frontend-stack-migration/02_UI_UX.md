# UI/UX｜前端迁移交互与视觉基线

**状态**　草案 · 2026-11-21。当前依据源码与已定稿需求整理，真实宿主截图和交互对照待采集。

**依据**　[PRD v1.3](01_PRD.md) · [现有宿主交互记录](../../../../docs/react-sidebar.md)

## 页面与操作

| 范围 | 预期交互 | 关键状态与反馈 |
| --- | --- | --- |
| 侧栏、节点目录与画布 · FR-02 | 通过宿主的单一 AstroPhoto 侧栏进入。按原顺序完成搜索、筛选、排序、预览和收藏。点击或拖放添加节点，由宿主撤销。 | 检查加载、空结果、无法添加及只读画布。对比标签、工具栏和悬停位置。经典画布与 Nodes 2.0 各自验证活动画布及旧工作流重开。 [现有节点页](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodes/NodesPage.tsx) |
| 存储、环境与预览显示 · FR-03 | 延续现有设置导航，加载、编辑并保存工作区、缓存、环境和预览显示设置。 | 保持加载、保存中、耗时操作进度、失败与可重试反馈。重新打开后核对真实保存值及预览显示效果。 [设置入口](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/SettingsPage.tsx) |
| 资料库内的设备与光路 · FR-04 | 沿用现有用户入口和操作顺序。源码归资料库，列表、筛选、详情框架和空态可供后续素材页复用。 | 对照未保存离开、字段错误、版本冲突和归档/删除。验证窄栏内的弹层位置、禁用项、键盘操作及关闭后焦点回归。 [设备入口](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/settings/equipment/EquipmentPage.tsx) |
| Siril 软件设置和科学节点 · FR-05、FR-08 | 从通用软件设置配置 Siril，从节点目录和画布使用 FITS Source、AutoStretch 与 Inspector。用户可区分候选预览与正式队列结果。 | 分开对照无 Bundle、软件不可用和软件可用。验证只读状态、参数修改或重置、撤销、预览失败及正式结果显示。 [现有节点接入](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/scientific.tsx) |
| 绘图 Widget · FR-06 | 保留画布、工具顺序与绘制、撤销、保存、重开。用旧工作流验证像素恢复。 | 比较按钮选中态、禁用态、Tooltip 与焦点。临时 PNG 上传及引用提交为验收终点。 [现有画板](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/VueExampleComponent.vue) |
| 素材页占位 · FR-01、FR-02 | 保留 Assets 标签与默认落点。页面仅说明素材页将在后续版本提供，不展示列表、不做导入。 | 无加载、无请求、无错误态；中英文与明暗主题下文案可读；空态不诱导点击。 [占位页位置](03_TECH.md#2-文件结构) |

## 已决定 · Assets 导航

对应 PRD `Q-01`、技术 `D-01`。**决定（2026-11-21）：保留 Assets 标签，内容为 Vue 占位页。** 页面只说明“素材页将在后续版本提供”，不读取列表、不提供导入，也不引用任何业务接口。默认落点保持现状（素材页），使侧栏结构与迁移前一致。

- **原因。** 素材页功能仍属后续 Feature，但发行构件必须退出 React；占位页使导航不发生变化，同时保留后续 Feature 的落点。
- **不受影响。** 后端素材导入/查询路由保留不动，仅前端不再引用；后续 Feature 直接替换占位页内容。
- **待采集。** 占位页在窄栏与长文案下的换行、中英文实际文案、默认落点是否导致“首屏无内容”的体验问题；若确认不适，再单独调整默认落点。 [当前默认页](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/app/App.tsx)

## FR-07 对照方法

1. 在隔离宿主为每个范围记录宿主版本、主题、语言、侧栏宽度、画布模式、样例和操作顺序。以同一条件保存迁移前后的界面与操作结果。覆盖中英文、明暗主题和至少一个能触发窄栏适配的宽度，记录实际宽度。
2. 从同一入口完成鼠标与适用的键盘路径。核对信息层级、选中态、字段标签、错误反馈、焦点移动和弹层退出。真实宿主中复验与画布、主题或弹层挂载相关的能力。
3. 涉及布局、入口或操作顺序的明显变化，提供可审阅的新旧对照。若需先讨论新交互，准备只覆盖该变化的可交互原型。将确认的差异写回本页和对应测试用例。 [预计用例](05_TEST_PLAN.md)

## 状态清单

下表把需求中的状态要求落到具体界面。标 `现状` 的由现有源码确认，标 `待实测` 的必须在真实宿主采集后才可作为基线；不得用推断代替观察结果。

| 范围 | 加载中 | 空 | 错误 | 只读 / 禁用 | 保存中与冲突 |
| --- | --- | --- | --- | --- | --- |
| 侧栏与导航 · FR-02 | 节点资源预取中显示加载态 `现状` | 搜索或筛选无命中时显示空结果 `待实测` | 目录请求失败可重试 `待实测` | 只读或选择模式下添加被拒绝（`CANVAS_UNAVAILABLE`），界面显示失败 `现状` | 不适用 |
| 节点目录与预览 · FR-02 | 同上 | 分类下无节点 `待实测` | 收藏写入被拒时回到宿主实际值并反馈 `现状` | 已收藏项状态可辨 `待实测` | 不适用 |
| 存储与环境 · FR-03 | 设置读取中 `现状` | 无工作区或缓存时的引导文案 `待实测` | 保存失败可重试，失败保留输入 `现状` | 长任务进行中禁止重复提交 `现状` | 长任务进度与回执终态 `现状`；旧 revision 忽略 `现状` |
| 资料库设备与光路 · FR-04 | 列表与详情加载 `现状` | 无设备、无光路的空态文案 `待实测` | 字段错误、版本冲突、引用阻止删除 `现状` | 归档与删除按钮的可用条件 `现状` | 保存中保护、未保存离开确认 `现状` |
| Siril 设置与 Inspector · FR-05、FR-08 | 软件发现与候选生成中 `现状` | 无 Bundle、无可用软件时共享入口仍可加载 `待实测` | 预览失败与配置不可用分别提示 `现状` | 无参数时显示只读标签，比较模式不可用时对应控件禁用 `现状` | 候选替换时取消旧请求 `现状` |
| 绘图 Widget · FR-06 | 像素恢复中不闪空画布 `待实测` | 空画布提交回退为空引用 `现状` | 上传失败不得丢失可恢复像素 `待实测` | 按钮选中态 `现状`；禁用态 `待实测` | 不适用 |
| 发行导航 · FR-01、FR-02、FR-07 | 不适用 | 素材占位页（无列表、无请求） | 侧栏重复加载时只保留一套 `待实测` | 不适用 | 不适用 |

- **状态产物。** 每组对照至少保留正常、空/无数据、代表性失败三种截图或录屏；只读与窄栏仅在对应范围采集。证据目录按 `evidence/<run-id>/ui/`。
- **未定文案。** 空态与错误文案的最终措辞待迁移时统一，不在本页预先定义新文案。

## 文案、语言与主题

- **词条来源。** 根 `locales/en|main.json` 与 `locales/zh|main.json` 供绘图与扩展入口使用；React 侧栏另有自己的 i18n 初始化。迁移后须建立一张词条对照表，把两套来源合入 Vue I18n，并记录废弃键。当前尚未建立，属于实现时补齐项。 [侧栏词条](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/i18n/index.ts) · [根词条](../../../../locales/zh/main.json)
- **语言跟随。** 现有实现从 `Comfy.Locale` 同步语言并回收监听器；迁移后保持相同触发源与清理时机。 [语言适配](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/host/locale.ts)
- **主题。** 沿用宿主明暗主题变量与扩展前缀，不依赖被移除的 Aura 主题令牌。弹层与 Portal 挂载到宿主 DOM 时使用明确作用域。
- **对照要求。** 每个范围至少覆盖中英文与明暗主题各一次；新增或改动词条时在对应 CASE 记录实际文本。

## 键盘、焦点与无障碍

| 范围 | 键盘与焦点要求 | 现状依据 |
| --- | --- | --- |
| 侧栏导航 | Tab/方向键在标签间移动，选中态可用辅助技术识别；面板保留 `tabpanel` 语义。 | `App` 使用 `role="tabpanel"` 与 `aria-labelledby`；官方 `TabList`/`Tab` 提供焦点与选中态。 [App](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/app/App.tsx) |
| 下拉与多选 | 键盘选项、Escape 关闭、焦点回归触发器；空值与禁用项可辨识。 | Reka `SelectRoot`/`ComboboxRoot` 由本地移植件提供。 [组件来源](../../../../frontend/src/vendor/comfyui/README.md) |
| 排序与筛选弹层 | 触发、选项、关闭时机一致；Escape 与外部点击后焦点回到触发器。 | 现有 `SearchOptions` 工具栏；官方 `Popover` 参考。 |
| 悬停预览 | 预览不捕获焦点，移出或拖出后清理。 | 现有组件挂到 `document.body` 并按侧栏位置计算边界。 [悬停组件](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/ui/src/features/nodes/NodeHoverPreview.tsx) |
| 绘图工具栏 | 按钮可聚焦，提示与禁用态同时存在；图标不重复朗读。 | 现有 `ToolBar.vue` 使用 PrimeVue `Button` 与 Tooltip。 [工具栏](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/4c0cf4de91375f9eeb82997eee3aaa3bf99049b2/frontend/src/components/ToolBar.vue) |

- 窄栏（可触发弹层裁切的宽度）与正常宽度各验证一次；记录实际像素宽度，不预设阈值。
- 迁移改动按钮或图标时补 `aria-label` 或可见文本，避免只靠颜色传达状态。

## 原型与证据状态

- **可交互原型：未制作。** 本 Feature 为保真迁移，交互基线以现有实现为准（PRD FR-07），不以新原型重新设计界面。
- **触发补做原型的条件。** `Q-01` 改变导航入口或默认落点，或对照中发现布局与操作顺序的明显变化时，先提供只覆盖该变化的最小可交互原型，确认后再定稿本页。
- **当前缺口。** 无真实宿主截图与迁移前后对照；无窄栏、键盘路径的实际记录。上述均需在隔离宿主采集，不得以源码推断填充。
