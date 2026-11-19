# 前端只读审计（部分完成，2026-11-18）

## 方法与限制

先以 CodeGraph 查询前端，再对关键源码、需求及测试断言进行只读抽样；没有修改源码，没有执行 build 或测试。以下所有实现状态均为 IMPLEMENTED_UNVERIFIED，除非明确标记 CONFLICT、PARTIAL 或 PLANNED；没有本次运行证据，不宣称 VERIFIED。此报告并非完成全部递归逐行审计：vendor、全部 CSS/翻译键、所有测试断言及完整三套交接尚未逐项核查；矩阵中的 NO_GUARD_FOUND 仅指所述范围所见，不是全库证明。报告只能作为主审计输入。

## Feature 与调用链

| ID | 行为/输入→输出与持久化；入口及源码 | 状态/对应 Guard、Test |
|---|---|---|
| F-01 | 单一扩展入口注册 Sidebar 和科学节点：main.tsx:10–17 → host/sidebar.tsx:9–33；重复 render 复用，同容器外替换 destroy，Locale watcher 随根释放。 | IMPLEMENTED_UNVERIFIED；GF-01；T-lifecycle |
| F-02 | Nodes/Assets/Settings 三主 Tab，Assets 默认，键盘 focus/selection 分离；App.tsx:12–27 → shared/SidebarTabs.tsx。 | IMPLEMENTED_UNVERIFIED；T-navigation:15 |
| F-03 | Nodes 查询 object_info，搜索、类别/排序、展开树、详情；NodesPage.tsx:22–133 → NodeTree.tsx:12–102 → api/nodes.ts；切视图保留状态。 | IMPLEMENTED_UNVERIFIED；GF-02；T-navigation:32,57,96、T-search |
| F-04 | 添加、拖拽节点至当前画布；NodesPage.tsx:93,133 → host/canvas.ts:11–35、dragDrop.ts:3–34，修改 Comfy graph 而非业务数据库。 | IMPLEMENTED_UNVERIFIED；GF-03；T-canvas、T-host-runtime |
| F-05 | 节点收藏读写宿主 Comfy.NodeLibrary.Bookmarks.V2；NodesPage.tsx:16–22,72–73；设置失败回读并显示错误。 | IMPLEMENTED_UNVERIFIED；GF-04；测试映射未完成 |
| F-06 | Assets 搜索、排序/筛选；导入目录预览然后开始异步操作、引用/复制选择及 workspace，重新定位路径；AssetsPage.tsx:17–72 → ImportDialog.tsx:6–71 → api/storage.ts。 | PARTIAL；GF-05；T-navigation:140、T-storage-host；筛选是否实际作用于服务数据须进一步验证 |
| F-07 | Settings 模块导航、系统状态、未实现模块占位；SettingsPage.tsx:12–49；agent 等并非已有业务能力。 | PARTIAL；T-navigation |
| F-08 | Storage 默认导入模式、workspace 添加/重命名/迁移/重定位/启停/移除/设默认，Cache 路径/容量配置与清理；StoragePage.tsx:20–215 → api/storage.ts → /astrophoto/v1/storage。服务持久化，前端提供 expected_revision 和 operation idempotency key。 | IMPLEMENTED_UNVERIFIED；GF-06；T-storage |
| F-09 | Equipment 设备搜索、过滤、分页、按类型新增/编辑、详情、归档/删除；EquipmentPage.tsx、EquipmentList.tsx:10–54、EquipmentForm.tsx、EquipmentDetails.tsx → api/equipment.ts。 | IMPLEMENTED_UNVERIFIED；GF-07、GF-08；T-equipment:40,72,195 |
| F-10 | Optical trains 草稿创建/编辑、器材快速添加、选择相机/光学件/附件/滤镜、附件排序、估算、删除；OpticalTrainEditor.tsx:14–129 → api/equipment.ts；发布/版本历史并非现有 UI（equipment-host.mjs:156,209 断言缺席）。 | PARTIAL；GF-07、GF-08；T-equipment:126,180,195 |
| F-11 | Software 页面 Siril 自动发现、候选选择、手动路径验证、启停和删除；PixInsight 控件禁用；SoftwarePage.tsx:7–114 → api/siril.ts:14–28。 | IMPLEMENTED_UNVERIFIED；GF-09；T-siril:8 |
| F-12 | Environment 预览分辨率选择、revision 保存、冲突提示；EnvironmentPage.tsx:10–59 → api/previewSettings.ts，成功触发变更事件。 | IMPLEMENTED_UNVERIFIED；GF-06；未找到专门测试，需全量核实 |
| F-13 | SourcePicker 选服务器侧 FITS 资产或输入路径，显示加载/错误、刷新；host/scientific.tsx:217–247。 | IMPLEMENTED_UNVERIFIED；GF-10；T-siril-host |
| F-14 | 科学节点候选：每 200ms 读取输入来源、参数与正式执行记录，400ms 去抖调用 renderCandidate，显示主图和状态；scientific.tsx:68–116,145–179 → api/siril.ts:64–105 → preview jobs。| PARTIAL；GF-10、GF-11；T-siril-host；隐藏时仍请求，是否违背最终要求需确认 |
| F-15 | Inspector side/wipe/single、双图对齐门控、缩放、100%、fit、拖动画布/分割线、键盘滑块、布局分隔、焦点恢复；nodePreview/Inspector.tsx:18–161。 | IMPLEMENTED_UNVERIFIED；GF-12；T-siril:28、T-siril-host |
| F-16 | 实际科学节点 Inspector 注入数值输入、linked 开关、reset 并写 graph；scientific.tsx:150–193。符合用户最新确认的可编辑要求。 | IMPLEMENTED_UNVERIFIED；GF-13；T-siril:28 仅测通用展示，未覆盖实际编辑调用 |
| F-17 | Vue 绘图：画笔/颜色/大小/橡皮/清空，鼠标触摸，PNG workflow 值恢复，上传至宿主；frontend/src/main.ts、components/{DrawingApp,DrawingBoard,ToolBar,VueExampleComponent}.vue。 | IMPLEMENTED_UNVERIFIED；GF-14；T-vue |
| F-18 | 双语与主题：host/locale.ts:4–16 watcher 和卸载，i18n/index.ts 与 ui/src/i18n/locales/{en,zh}/main.json；styles/theme.css 使用宿主主题；Vue locales 在根 locales/。 | IMPLEMENTED_UNVERIFIED；GF-15；T-i18n、T-host-runtime |
| F-19 | 复用原生 Vue 下拉与多选的 React 桥及搜索控件；shared/{ComfySingleSelect,ComfyMultiSelect,SearchField,SearchOptions}.tsx → frontend/src/vendor/comfyui/。 | IMPLEMENTED_UNVERIFIED；GF-16；T-search；vendor 完整审计缺口 |

## Guard 矩阵（源码静态证据）

| ID | 输入/验证、异常、清理与显示 | 测试或缺口 |
|---|---|---|
| GF-01 | Sidebar id 去重、替换/销毁卸载 root、移除 DOM 和 watcher；host/sidebar.tsx:9–33、locale.ts:11–16。 | T-lifecycle；真宿主 T-host-runtime，均未运行 |
| GF-02 | useResource.ts:3–15 AbortController 取消旧请求，忽略 aborted 响应并分 loading/error/ready；api/client.ts:12–39 超时、caller abort、HTTP/JSON/network 分流及 timer/listener cleanup；NodesPage 错误可重试。 | T-api、T-navigation:57；权限后端验证未审 |
| GF-03 | canvas.ts:11–35 检查只读/selectOnly/注册，失败回滚并结束 graph change；dragDrop.ts:8–34 检查类型/白名单、只在 canvas 接收并卸载监听。 | T-canvas:15,21,27,31；T-host-runtime:85–102 |
| GF-04 | 收藏保存 promise 失败回读设置及反馈；NodesPage.tsx:16–22,72–73。 | 写冲突保护 NO_GUARD_FOUND（仅本次所读范围）；并发写测试未定位 |
| GF-05 | ImportDialog.tsx:30–68 输入变化清空预览，pending 禁用 fieldset，离线 workspace 禁用；AssetsPage.tsx:38 按 import capability 禁用；服务端最终验证未审。 | 请求完成前关闭、取消或重复提交专项覆盖未定位 |
| GF-06 | StoragePage.tsx:30–56,99–130,151–152,180–201 expected_revision，能力/状态禁用，删除与 cache clear 确认；EnvironmentPage.tsx:28–53 conflict 禁用。 | T-storage:24,55,96；服务端权限及并发验证须由后端审计 |
| GF-07 | EquipmentPage.tsx:39–67 dirty/busy 拦截导航、beforeunload 注册清理和 session 恢复；shared.tsx:17–42 mutation 防重复/abort/error。 | T-equipment:72；真 host remount T-equipment-host:214–230 |
| GF-08 | OpticalTrainEditor.tsx:25–26,38–54,90–110 检查无效/归档器材，排序边界、去除重复可选项、附件/滤镜上限 50；字段校验与错误由 shared.tsx:66–87 显示。 | T-equipment:40,126；后端验证与并发另审 |
| GF-09 | SoftwarePage.tsx:14–24,64–76 卸载 abort、错误保留，pending 禁用；选择仅 ready 候选，手动路径发后端校验。 | T-siril:8；T-siril-host:51 |
| GF-10 | scientific.tsx:91–116 请求 key 匹配才显示，400ms debounce、取消旧请求、过时对象 URL 释放；api/siril.ts:48–105 取消 job、验证 PNG 内容类型，异常释放；121–132 周期 validate 防失效；卸载清理 timer/listeners/abort。 | 无专门竞态、失配、旧图及实际生命周期断言已确认；不等于已通过 |
| GF-11 | scientific.tsx:93–116 effect 输入未含 active；active 到 117 行才定义，仅用于后续验证；在 collapsed + Inspector closed 时仍可 renderCandidate。 | NO_GUARD_FOUND；原始 PRD 可见条件与“不必”措辞需区别，不能单凭此断言违约；无对应测试已确认 |
| GF-12 | Inspector.tsx:36–47 焦点恢复，双图 aligned 才允许 wipe；:49–68 主指针、界限与 zoom clamp；:82–120 dialog cancel、键盘 slider。 | T-siril:28；窄栏/失焦/实际浏览器多设备验证未定位 |
| GF-13 | scientific.tsx:150–172 在 graph 不存在、read_only/selectOnly 时拒绝写，并通过 graph before/after 包装；:180–193 参数可编辑或重置；单色禁用 linked。 | 通用 details 展示用例没有覆盖实际调参、重置、预览同步或拒绝写入 |
| GF-14 | DrawingBoard.vue:55–56,234–238 revision 防异步恢复覆盖新绘制/卸载；VueExampleComponent.vue:31–38,73–103 非法恢复/上传异常反馈。 | T-vue serialization:31,67；宿主已知 IMAGE 执行路径问题须独立验证 |
| GF-15 | host/locale.ts:11–16 focus/interval 同步并清理；i18n.test.tsx:10 key 集合等价。 | 缺失动态 key 的实际渲染 fallback/窄栏完整验证未定位 |
| GF-16 | SearchField IME 组合及 debounce cleanup 有测试；单/多选桥依赖宿主 Vue 组件。 | T-search；无 host 环境降级保护 NO_GUARD_FOUND（main.tsx 静态依赖 comfy:app）；须明确只支持宿主 |

## 测试矩阵及边界

所有测试仅静态阅读，未执行。React Jest/JSDOM 为 mocked 宿主、API 及 DOM，不证明真实 ComfyUI、真实 Siril、浏览器绘图或网络。`frontend/tests` Vitest 测试需根据项目配置确认浏览器环境；host-runtime、storage-host、equipment-host、siril-host 使用 Playwright Chromium 对真实 host，但脚本存在不代表运行通过。

| 标识 | 测试函数与行 / 断言 → Feature、Guard |
|---|---|
| T-lifecycle | lifecycle.test.tsx:5–16：一个 tab、复用、更换容器、清除 timers → F-01/GF-01 |
| T-canvas | canvas.test.ts:15,21,27,31：当前 graph/事务、只读拒绝、失败清理、白名单 → F-04/GF-03 |
| T-api | api.test.ts:10,16,26：JSON/network、timeout/abort、响应契约 → F-03/GF-02 |
| T-search | search.test.tsx:3：IME/debounce 清理 → F-03,F-19/GF-16 |
| T-navigation | navigation.test.tsx:15,32,57,65,96,140：默认/键盘、catalog 状态保留、错误重试、刷新、树、不可用时筛选 → F-02,F-03,F-06,F-07/GF-02 |
| T-storage | storage.test.tsx:24–52 成功后变模式和 revision；:55–93 迁移回执/禁用；:96–114 清理确认和回执 → F-08/GF-06 |
| T-equipment | equipment.test.tsx:40–69 懒加载和字段错误；:72–86 导航确认和恢复；:126–177 删除陈旧版本及刷新；:180–192 键盘与草稿；:195–224 独立搜索过滤 → F-09,F-10/GF-07,GF-08。:89–123 的设备被引用及删除断言亦需回看其测试函数边界。 |
| T-siril | siril.test.tsx:8–25 验证版本不匹配保留配置；:28–48 三模式/未对齐/键盘/只读值；后者未使用实际 NodeView 的 parameters → F-11,F-15/GF-09,GF-12；不覆盖 F-16 |
| T-i18n | i18n.test.tsx:10,12 翻译键等价、跟随宿主语言 → F-18/GF-15 |
| T-vue | tests/components/DrawingApp.test.ts:6,26,38 绘制、工具、触摸；tests/widgets/serialization.test.ts:8,31,43,48,67 恢复、异常、翻译和上传；registration.test.ts:4 注册 → F-17/GF-14 |
| T-host-runtime | frontend/ui/host-runtime.mjs:27–34,62,85–102,126–175 检查挂载、主题、插入、持久化及单入口 → F-01,F-04,F-17,F-18；未运行 |
| T-storage-host | storage-host.mjs:31–119 检查真实 host 中设置、导入、语言、挂载、序列化 → F-06,F-08,F-17；未运行 |
| T-equipment-host | equipment-host.mjs:79–251 host 器材流程、草稿恢复、语言；明确不显示发布及历史 → F-09,F-10/GF-07；未运行 |
| T-siril-host | siril-host.mjs:51,96–141,164–187 执行配置、图像模式、变换、正式结果 manifest/hash 与重开输入；其实际是否覆盖参数编辑需看交互，不能凭脚本存在推断通过 → F-11,F-13,F-14,F-15；未运行 |
| T-accordion | detailAccordion.test.tsx:4 折叠受控状态 → F-09；未运行 |

## 交接差异及风险

1. Chat_Handoff 07_UI_DESKTOP_SPEC.md:101–103、04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:39,55 曾要求 Inspector 参数只读，已被用户当前的可编辑决定替代。scientific.tsx:180–193 注入编辑控件及 reset，并写回图。siril.test.tsx:28–42 仅构造 details 展示，尚未覆盖编辑。
2. 原始 PRD v1.1:265–271 要求可见时更新，并称均关闭时“不必”处理（非明确禁止）。scientific.tsx:93–116 不以展开/Inspector 可见性为依赖或条件，而 active 在 117 行后定义：隐藏状态仍触发请求；参数及输入变化会使候选更新。有关可见性完整期望仍需与最新交接并读。
3. Chat_Handoff 02_LATEST_DECISIONS_AND_CONFLICTS.md:14–15 明言调查时无 Siril/FITS/Inspector 是旧快照，scientific.tsx、siril.ts 与 Inspector.tsx 已存在，不能把旧交接当当前状态；是否符合路径及后端规范需后端审计。
4. Last_Handoff/sources/01_CURRENT_STATE.md:7 等 VERIFIED 属历史证据，不是此轮运行结果。host 脚本包含真实运行意图，不代表当前主机已通过；完整翻译缺键、窄栏、失败竞态、权限、后端写冲突、过期图片及科学预览性能仍需主 Agent 核查。

## 实际阅读与清查边界

实际看过 CodeGraph 输出（scientific、siril、storage、Inspector 的部分行），及 rg 输出中 frontend/ui/src、frontend/src 和测试的符号/部分断言；完整读取或行级筛选了 scientific.tsx 68–196、useResource.ts、sidebar.tsx、main.tsx、siril Inspector 重导出、StoragePage.tsx/SoftwarePage.tsx/EnvironmentPage.tsx/ImportDialog.tsx/Inspector.tsx 的特征行，以及列出的测试断言。交接读取：Chat_Handoff 的 02、04、07 相关匹配行；Last_Handoff 的 01 相关行；Original_request 的 Siril PRD 相关匹配行。未逐行阅读全部文件，不应冒称全部已审核。

下方是递归清查的文件清单（清单本身不等于阅读）。

`	ext
frontend/src\components\DrawingApp.vue
frontend/src\components\DrawingBoard.vue
frontend/src\components\ToolBar.vue
frontend/src\components\VueExampleComponent.vue
frontend/src\host.d.ts
frontend/src\main.ts
frontend/src\types.ts
frontend/src\vendor\comfyui\composables\useAttrsClass.ts
frontend/src\vendor\comfyui\composables\usePopoverSizing.ts
frontend/src\vendor\comfyui\multi-select\MultiSelect.vue
frontend/src\vendor\comfyui\multi-select\MultiSelectContent.vue
frontend/src\vendor\comfyui\multi-select\MultiSelectTrigger.vue
frontend/src\vendor\comfyui\multi-select\types.ts
frontend/src\vendor\comfyui\README.md
frontend/src\vendor\comfyui\select.variants.ts
frontend/src\vendor\comfyui\select\types.ts
frontend/src\vendor\comfyui\select\useSelectSearch.ts
frontend/src\vendor\comfyui\single-select\SearchableSingleSelect.vue
frontend/src\vendor\comfyui\single-select\SingleSelect.vue
frontend/src\vendor\comfyui\single-select\types.ts
frontend/src\vendor\comfyui\tailwind-utils.ts
frontend/tests\components\DrawingApp.test.ts
frontend/tests\host.ts
frontend/tests\setup.ts
frontend/tests\widgets\registration.test.ts
frontend/tests\widgets\serialization.test.ts
frontend/ui/src\__tests__\api.test.ts
frontend/ui/src\__tests__\canvas.test.ts
frontend/ui/src\__tests__\detailAccordion.test.tsx
frontend/ui/src\__tests__\equipment.test.tsx
frontend/ui/src\__tests__\fixtures.ts
frontend/ui/src\__tests__\hostMock.ts
frontend/ui/src\__tests__\i18n.test.tsx
frontend/ui/src\__tests__\lifecycle.test.tsx
frontend/ui/src\__tests__\multiSelectMock.ts
frontend/ui/src\__tests__\navigation.test.tsx
frontend/ui/src\__tests__\search.test.tsx
frontend/ui/src\__tests__\setupTests.ts
frontend/ui/src\__tests__\singleSelectMock.ts
frontend/ui/src\__tests__\siril.test.tsx
frontend/ui/src\__tests__\storage.test.tsx
frontend/ui/src\api\client.ts
frontend/ui/src\api\equipment.ts
frontend/ui/src\api\nodes.ts
frontend/ui/src\api\previewSettings.ts
frontend/ui/src\api\siril.ts
frontend/ui/src\api\status.ts
frontend/ui/src\api\storage.ts
frontend/ui/src\app\App.tsx
frontend/ui/src\features\assets\AssetsPage.tsx
frontend/ui/src\features\assets\ImportDialog.tsx
frontend/ui/src\features\nodePreview\inspector.css
frontend/ui/src\features\nodePreview\Inspector.tsx
frontend/ui/src\features\nodePreview\nodePreview.css
frontend/ui/src\features\nodePreview\NodePreview.tsx
frontend/ui/src\features\nodePreview\PanelDivider.tsx
frontend/ui/src\features\nodes\NodeHoverPreview.tsx
frontend/ui/src\features\nodes\NodesPage.tsx
frontend/ui/src\features\nodes\NodeTree.tsx
frontend/ui/src\features\settings\environment.css
frontend/ui/src\features\settings\EnvironmentPage.tsx
frontend/ui/src\features\settings\equipment\DetailAccordion.tsx
frontend/ui/src\features\settings\equipment\DetailActions.tsx
frontend/ui/src\features\settings\equipment\equipment.css
frontend/ui/src\features\settings\equipment\EquipmentDetails.tsx
frontend/ui/src\features\settings\equipment\EquipmentForm.tsx
frontend/ui/src\features\settings\equipment\EquipmentList.tsx
frontend/ui/src\features\settings\equipment\EquipmentPage.tsx
frontend/ui/src\features\settings\equipment\OpticalTrainDetails.tsx
frontend/ui/src\features\settings\equipment\OpticalTrainEditor.tsx
frontend/ui/src\features\settings\equipment\shared.tsx
frontend/ui/src\features\settings\moduleRegistry.ts
frontend/ui/src\features\settings\SettingsPage.tsx
frontend/ui/src\features\settings\SoftwarePage.tsx
frontend/ui/src\features\settings\storage.css
frontend/ui/src\features\settings\StoragePage.tsx
frontend/ui/src\features\siril\Inspector.tsx
frontend/ui/src\features\siril\siril.css
frontend/ui/src\features\storage\shared.tsx
frontend/ui/src\host\canvas.ts
frontend/ui/src\host\comfy.ts
frontend/ui/src\host\dragDrop.ts
frontend/ui/src\host\locale.ts
frontend/ui/src\host\scientific.tsx
frontend/ui/src\host\sidebar.tsx
frontend/ui/src\i18n\index.ts
frontend/ui/src\i18n\locales\en\main.json
frontend/ui/src\i18n\locales\zh\main.json
frontend/ui/src\main.tsx
frontend/ui/src\shared\ComfyMultiSelect.tsx
frontend/ui/src\shared\ComfySingleSelect.tsx
frontend/ui/src\shared\DisclosureChevron.tsx
frontend/ui/src\shared\Feedback.tsx
frontend/ui/src\shared\SearchField.tsx
frontend/ui/src\shared\SearchOptions.tsx
frontend/ui/src\shared\SidebarTabs.tsx
frontend/ui/src\shared\useResource.ts
frontend/ui/src\shared\useStoredChoice.ts
frontend/ui/src\shared\vue.d.ts
frontend/ui/src\styles\theme.css
frontend/ui\check-build.mjs
frontend/ui\check-proxy.mjs
frontend/ui\equipment-host.mjs
frontend/ui\host-runtime.mjs
frontend/ui\siril-host.mjs
frontend/ui\src\__tests__\api.test.ts
frontend/ui\src\__tests__\canvas.test.ts
frontend/ui\src\__tests__\detailAccordion.test.tsx
frontend/ui\src\__tests__\equipment.test.tsx
frontend/ui\src\__tests__\fixtures.ts
frontend/ui\src\__tests__\hostMock.ts
frontend/ui\src\__tests__\i18n.test.tsx
frontend/ui\src\__tests__\lifecycle.test.tsx
frontend/ui\src\__tests__\multiSelectMock.ts
frontend/ui\src\__tests__\navigation.test.tsx
frontend/ui\src\__tests__\search.test.tsx
frontend/ui\src\__tests__\setupTests.ts
frontend/ui\src\__tests__\singleSelectMock.ts
frontend/ui\src\__tests__\siril.test.tsx
frontend/ui\src\__tests__\storage.test.tsx
frontend/ui\src\api\client.ts
frontend/ui\src\api\equipment.ts
frontend/ui\src\api\nodes.ts
frontend/ui\src\api\previewSettings.ts
frontend/ui\src\api\siril.ts
frontend/ui\src\api\status.ts
frontend/ui\src\api\storage.ts
frontend/ui\src\app\App.tsx
frontend/ui\src\features\assets\AssetsPage.tsx
frontend/ui\src\features\assets\ImportDialog.tsx
frontend/ui\src\features\nodePreview\inspector.css
frontend/ui\src\features\nodePreview\Inspector.tsx
frontend/ui\src\features\nodePreview\nodePreview.css
frontend/ui\src\features\nodePreview\NodePreview.tsx
frontend/ui\src\features\nodePreview\PanelDivider.tsx
frontend/ui\src\features\nodes\NodeHoverPreview.tsx
frontend/ui\src\features\nodes\NodesPage.tsx
frontend/ui\src\features\nodes\NodeTree.tsx
frontend/ui\src\features\settings\environment.css
frontend/ui\src\features\settings\EnvironmentPage.tsx
frontend/ui\src\features\settings\equipment\DetailAccordion.tsx
frontend/ui\src\features\settings\equipment\DetailActions.tsx
frontend/ui\src\features\settings\equipment\equipment.css
frontend/ui\src\features\settings\equipment\EquipmentDetails.tsx
frontend/ui\src\features\settings\equipment\EquipmentForm.tsx
frontend/ui\src\features\settings\equipment\EquipmentList.tsx
frontend/ui\src\features\settings\equipment\EquipmentPage.tsx
frontend/ui\src\features\settings\equipment\OpticalTrainDetails.tsx
frontend/ui\src\features\settings\equipment\OpticalTrainEditor.tsx
frontend/ui\src\features\settings\equipment\shared.tsx
frontend/ui\src\features\settings\moduleRegistry.ts
frontend/ui\src\features\settings\SettingsPage.tsx
frontend/ui\src\features\settings\SoftwarePage.tsx
frontend/ui\src\features\settings\storage.css
frontend/ui\src\features\settings\StoragePage.tsx
frontend/ui\src\features\siril\Inspector.tsx
frontend/ui\src\features\siril\siril.css
frontend/ui\src\features\storage\shared.tsx
frontend/ui\src\host\canvas.ts
frontend/ui\src\host\comfy.ts
frontend/ui\src\host\dragDrop.ts
frontend/ui\src\host\locale.ts
frontend/ui\src\host\scientific.tsx
frontend/ui\src\host\sidebar.tsx
frontend/ui\src\i18n\index.ts
frontend/ui\src\i18n\locales\en\main.json
frontend/ui\src\i18n\locales\zh\main.json
frontend/ui\src\main.tsx
frontend/ui\src\shared\ComfyMultiSelect.tsx
frontend/ui\src\shared\ComfySingleSelect.tsx
frontend/ui\src\shared\DisclosureChevron.tsx
frontend/ui\src\shared\Feedback.tsx
frontend/ui\src\shared\SearchField.tsx
frontend/ui\src\shared\SearchOptions.tsx
frontend/ui\src\shared\SidebarTabs.tsx
frontend/ui\src\shared\useResource.ts
frontend/ui\src\shared\useStoredChoice.ts
frontend/ui\src\shared\vue.d.ts
frontend/ui\src\styles\theme.css
frontend/ui\storage-host.mjs
frontend/ui\tsconfig.json
locales\en\main.json
locales\zh\main.json
locales\zh\nodeDefs.json
```


## 补充审计：控件桥、翻译、测试和需求边界

### 控件桥与 legacy Inspector

- `ComfySingleSelect.tsx:1–42` 是 React `useLayoutEffect` → Vue `render(h(SingleSelect))`；空值编码为 `unspecified`，其他值添加 `value:`，不存在选项时退回空值，`update:modelValue` 转回字符串；卸载 `render(null,node)`。消费者：`EnvironmentPage.tsx:47–48`、`EquipmentForm.tsx:76`、`OpticalTrainEditor.tsx:80–98`。vendor `single-select/SingleSelect.vue:25–95,132–160` 通过 Reka Select，disabled 选项及 Escape；搜索分支仅 `searchable && searchLabel && emptyText` 时进入，而此 React wrapper 没传这些属性，因此当前走非搜索分支。`SearchableSingleSelect.vue:170–197` 支持检索和 Escape，但不能由此推断当前桥启用搜索。
- `ComfyMultiSelect.tsx:7–31` 将 id 映射成对象，未知 id 保留为 `{value:id,name:id}`，从 Vue model 事件映射回 id，卸载清理。消费者仅 `OpticalTrainEditor.tsx:103–110`。vendor `MultiSelect.vue:2–42,64–95` → Trigger/Content，默认不显示搜索框，Content:162–180 支持已选项、Escape 与阻止焦点外关闭；筛选来自 `useSelectSearch.ts:7–20`。Jest 的 `frontend/jest.config.cjs:2,9–10` 映射为 mock，下拉组件在 Jest 中非真实 Reka；equipment-host.mjs:66–70,162–183 才有真实 Chromium 下的选择和已选状态脚本断言，但本次未运行。
- `features/siril/Inspector.tsx:1` 只是 `features/nodePreview/Inspector` 重导出，不是第二套旧 UI；实际生产入口 `host/scientific.tsx:9,180` 直接导入通用 Inspector，重导出仅 `siril.test.tsx:4` 引用。组件入口唯一不代表参数只读，实际注入详见 F-16。

### 两套语言资源及消费边界

- React 的 `ui/src/i18n/index.ts:3–12` 独立加载 `ui/src/i18n/locales/{en,zh}/main.json`；本次静态 JSON 扁平键集合对比各 497 键且完全相同。`host/locale.ts:4–16` 读取 Comfy.Locale、500ms 可见轮询及 focus，并停止计时器/监听。`i18n.test.tsx:10–23` 测对等、五类 locale 归一化、宿主语言切换，未测试每个动态组合键或文字语义。
- Vue Widget 的 `frontend/src/main.ts:9–10,28–30` 单独加载仓库 `locales/{en,zh}/main.json`；静态各 6 叶键且集合一致；静态扫描 `frontend/src/components` 中字面 `t('...')` 未发现缺失。`tests/widgets/serialization.test.ts:43` 断言画板英文键包含于中文及 pen tooltip。两套资源只需各自匹配消费者，不要求 React 的 497 键复制到 Vue 六键；`locales/zh/nodeDefs.json` 是宿主节点定义翻译，非 React i18next 资源，且无对应英文文件不等于缺失 React 翻译。
- 字面键静态扫描未发现真正缺失；字符串拼接（如 `scientific.tsx:145`, `storage/shared.tsx:13`, `equipment/shared.tsx:49–51`）需依据运行时后端枚举进一步核实；部分具有 `defaultValue`，状态字符串直接显示并非翻译齐全的证据。Vue i18n 在 widget 创建时采样一次 host locale（main.ts:28–30），没有像 React 一样看到运行期 watcher，语言变化已挂载 widget 是否实时跟随需要实测，NO_GUARD_FOUND（当前读取范围）。

### 补足测试函数级映射与运行边界

React tests 均完整读取；`test.each` 不能被 `^test(` 名称提取遗漏：

- `api.test.ts:6–9` 四种 401/403/404/500 保留 status；:10–15 区分 JSON/network；:16–25 超时/调用方取消且计时清空；:26–34 status 校验、catalog 过滤/输出/空与畸形拒绝 → F-03/GF-02。
- `canvas.test.ts:15–35` 坐标+change 边界、只读与未注册拒绝、插入失败 cleanup、drag 版本/kind/白名单 → F-04/GF-03。
- `detailAccordion.test.tsx:4–13` aria-expanded/controls 与 hidden 切换 → F-09。
- `equipment.test.tsx:40–69` 校验 422 保留输入与 aria-invalid，再成功展示回执；:72–86 阻止跨 tab 丢弃、重挂恢复且切语言保值；**:89–124 `test.each([false,true])`** 检查被引用时阻止删除并显示光路，未引用时取消不删、确认只删一次；:126–177 两次删除携带版本 3→4、409 request id、重试再删除；:180–192 键盘 focus 与选中分离、空设备草稿可保存且无发布；:195–224 两类搜索条件、Escape 聚焦、清空 → F-09/F-10/GF-07/GF-08。
- `i18n.test.tsx:10–23` 两语言键相同、`test.each` 五种 locale、宿主偏好优先且不写宿主 setting → F-18/GF-15。
- `lifecycle.test.tsx:5–18` 注册去重、同容器复用、替换销毁/计时器归零 → F-01/GF-01。
- `navigation.test.tsx:15–31` 默认、键盘、无假数据；:32–45 搜索/详情/切页保持；**:46–56 `test.each(modules)`** 每模块有标题/无假 Save/返回；:57–64 错误重试；:65–89 活动 tab 刷新请求；:96–138 嵌套树/分类/排序/搜索与键盘；:140–159 服务不可用筛选仍可选、排序偏好持久且禁用导入 → F-02/F-03/F-06/F-07。
- `search.test.tsx:3–18` 组合输入、180ms debounce、清除焦点及卸载清计时 → F-03/F-19/GF-16。
- `siril.test.tsx:8–26,28–49` 失败不覆盖已保存软件配置；仅以 details 参数的通用 Inspector 测三模式/未对齐禁 wipe/键盘/无 spinbutton，非真实 NodeView → F-11/F-15/GF-09/GF-12。
- `storage.test.tsx:24–53,55–94,96–115` revision 冲突回滚 UI、迁移确认/回执、cache 清理确认 → F-08/GF-06。
- `frontend/vitest.config.mts:26–30` Vue 测试配置 Chromium（Playwright），与 React Jest/JSDOM 区分；host scripts 才接真实 ComfyUI。主 Agent 运行情况另行汇总，此处未运行，不能因测试源而称通过。

### 样式与宿主脚本的具体覆盖

- `inspector.css:1–5,11–20,24–34,75–78` 限制 dialog viewport、图像网格及缩放，600px 以下切为上下排列且隐藏横向分隔；`siril.css:3,14–20,52` 路径换行、flex 收缩；`storage.css:87` forced colors；这些是静态设计，非已通过布局证明。
- `equipment-host.mjs:125–188` 创建四类设备、滤镜、链路及快速新增，在真实 Vue select 验选中，计算 768mm/9.6；:190–219 编辑/归档/恢复/未保存导航/重开；:221–251 语言主题、280/420/650px 与 200% 下 body 不超 panel、单 JS。它不等价于整个 Inspector 窄屏布局测试。`--verify-restart`/`--verify-delete` 是可选分支，不能默认为运行。
- `siril-host.mjs:73–101` 真实输入及依次修改三个 widget 等待图像 src 更新；:103–131 双图相同 pan、unaligned 模式禁 wipe 或键盘+指针分割、单图；:135–148 light/dark 文字颜色、zh/en；:151–187 正式 execution、manifest 参数与 source/output SHA、工作流重开。脚本不断言 Inspector 的编辑控件缺失，也没有关闭预览后请求数量断言。
- `storage-host.mjs:31–58` 16px radio、键盘触发保存、导入预览/202/回执；:60–96 迁移、主题、语言、重载、入口；:98–119 真实画布绘制及 PNG 上传/像素恢复。`check-build.mjs:3–20` 检查既有产物单 JS/字符串/CSS/相对路径；`check-proxy.mjs:24–46` 是模拟 host 的 Chromium 代理路径静态服务，不是真 ComfyUI。上述皆为脚本断言，不代表执行成功。

### 预览触发要求校正

将两个问题分开：原始 PRD v1.1:265–271 要求输入有效且主预览开启时参数变化自动更新，并说两处关闭时“不必执行”，这是可见性优化措辞，**不应自行升级为严格禁止或必然冲突**；源码确实在 hidden 状态仍可请求，记为可观察差异与资源风险。此前用户历史所说取消非输入触发，不能推演为取消输入变化预览或禁止首个有效输入；原始 PRD 明确位置/布局/缩放不触发，旧 PRD `source_materials/previous_prd/AstroPhotoFlow_Siril_AutoStretch_MVP_PRD_v1.0.md:391–393` 也区分输入/参数与布局。`scientific.tsx:68–116` 依 asset、参数 key、正式结果和显式 refresh 触发，位置、布局、缩放未包含在 requestKey；分辨率事件显式 refresh 属独立触发，是否符合最新用户约束需主 Agent 对照具体历史原话，不可在此无依据下定论。
