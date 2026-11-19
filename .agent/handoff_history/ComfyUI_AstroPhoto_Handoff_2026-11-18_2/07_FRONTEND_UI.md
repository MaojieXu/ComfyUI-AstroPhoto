# 前端、React Sidebar、宿主与 Inspector

当前源码基线是 `main@003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505`。本专题核对源码与测试通过 CodeGraph 定位并跟踪真实入口。以下旧路径以仓库根为基准。为便于去重，`UI-*` 是本次报告的候选稳定 ID，Sidebar Chat 的 `D-01…D-14` 及 FRD 的 `FR-N*`、`FR-A*`、`FR-S*`、`FR-I*` 按专题保留，其他专题若有同名 ID 应按原文定位区分。

## 产品决定、来源沿革与缺口

| 事项 ID / 类型 | 现行语义、历史版本与来源 |
|---|---|
| UI-D-SIDEBAR / DECISION、CONSTRAINT | 只注册一个 AstroPhoto 宿主侧栏，其内 Nodes / Assets / Settings 同级横向切换。首次打开默认 Assets，恢复未保存设备编辑时可直接回 Settings。保持同次挂载内的搜索、分类、展开、详情和 DOM 滚动。宿主负责外层关闭。来源：Sidebar Chat Full Handoff §1.2 D-01/02、§7.1；FRD §2.1；`frontend/ui/src/app/App.tsx:12–43`。 |
| UI-D-HOST / DECISION、CONSTRAINT | ComfyUI V3 Registry 负责注册执行，宿主拥有图、保存/打开、事务、撤销/恢复、队列；无独立工作流库和 Trials 页面。Sidebar 素材即节点的长期目标是创建稳定的 Source Node 实例并传资产引用，每文件不是 Node Class。来源：Sidebar Chat D-06/07/08/09；Technical Guide §4.11 与 §9；当前 FITS Source 只覆盖部分目标。 |
| UI-D-STYLE / DECISION | “ComfyUI 风格”指专业简约、原生视觉协调。旧三等分大按钮、白色下划线被紧凑左对齐圆角 Tab 取代。节点/素材工具栏定位到固定 v1.59.1 SidebarTopArea / SearchInput / FilterDropdown / Sort；不移动应用状态到宿主内部 Vue/Pinia。来源：Sidebar Chat D-10/11/12、§4 C/J/K，`.agent/archive/native-sidebar-tabs.md`、`sidebar-search-toolbar.md`。 |
| UI-D-PROTOTYPE / DECISION、ATTEMPT | D-13/D-14 属当时 UI 迭代范围。用户要在聊天看到可切换组件原型，指出只给 ASCII、截图或代码不能满足该请求，并要求当时先画图而不改正式文档。后续独立实施任务完成了部分原型对应行为。保留旧对话演变，勿用阶段性限制覆盖当前代码或长远需求。来源：Sidebar Chat §1.2 D-13/14、§4 H/J。 |
| UI-D-LOCALE / DECISION、CONSTRAINT | 主题、语言自动继承宿主。旧 FR-I01 自定义 auto/zh/en 及旧 General 设置已撤下，旧偏好停用。React 对宿主 Comfy.Locale 低频同步，并随侧栏生命周期清理；中文英语资源，其他语言走英文。保留可访问性、响应式要求。来源：Sidebar Chat D-04、§8.3/4；`.agent/archive/sidebar-host-settings.md`；`frontend/ui/src/host/locale.ts:4–16`。 |
| UI-D-MODULES / DECISION、REQUIREMENT | 设置必须真实披露可用能力，规划模块可看说明。FR-S01 的早期七项和观察地/General 行不可当作现行布局。现有模块顺序 Storage、Environment、Software、Equipment、Knowledge、Memory、Agent、System；观察地移除是当前 Sidebar 范围，原需求的领域记录保留。Siril 已有界面，PixInsight 占位不代表可执行。来源：Sidebar Chat D-03；FRD §6；`frontend/ui/src/features/settings/moduleRegistry.ts:1–9`、SettingsPage。 |
| UI-D-INSPECTOR-EDIT / DECISION、CONTRACT | Siril Chat 02 与 07 的 Inspector 只读条款已被后续明确可编辑决定替代。Inspector 作为同一 Canvas Node 的控件表面，可改 shadowsclip、targetbg、linked，可恢复默认，修改进入宿主图变更与同一候选生成；不引入参数 Trial、Commit 或跨版本历史对比。只读/仅选择图不写，单色禁用 linked。来源：Siril Chat 02 §2、07 §4；`.agent/notes/siril-autostretch.md` Decisions；`host/scientific.tsx:150–193`；本轮实际 JSDOM 命中该链。 |
| UI-D-INSPECTOR-COMPARE / DECISION、CONTRACT | Before 是当前处理节点的输入，After 是当前候选或有匹配来源及参数的正式执行结果。默认左右并排，另有分割和单图；只有可靠对齐才允许分割。分析区留诚实占位。原型 HTML 的 wipe 默认、只读参数和概念星空为历史设计材质。来源：Siril PRD v1.1 §5；Siril Chat 07:68–114；原型 15、23–25、35–48、56–89；`Inspector.tsx:27–47,118–153`。 |
| UI-D-DRAWING / DECISION、CONSTRAINT | Vue Widget 的工作流值按原生 DOM Widget getValue/setValue 保存小尺寸 Canvas PNG，使新保存的工作流可恢复像素。API prompt serializeValue 继续 PNG 上传后返回 `{image}`（异常 `image:null`），保留 `vue-basic` 与 `CUSTOM_VUE_COMPONENT_BASIC`。用户明确排除旧 Python LoadImage 绝对路径二次解析修复，原已空的旧工作流无法恢复不存在的像素。来源：`.agent/archive/drawing-persistence.md`、docs/react-sidebar.md 开头，`frontend/src/main.ts`、`components/VueExampleComponent.vue`。 |
| UI-Q-ASSET / QUESTION、REQUIREMENT | FR-A01…A04 真实素材服务原本阻塞。现有列表、受控导入和引用重定位可见，帧筛选状态仅在 storage 非 ready 时显示，非真实筛选；会话只列关联 ID，未见 Session/Frame 详情、科学 Header/引用详情、统一素材拖拽及管理全部格式。FITS 选择器可选择真实资产，不能作为通用素材入画布已交付的证据。来源：FRD §5；Sidebar Chat §7.3、§12；`AssetsPage.tsx:17–98`、`host/dragDrop.ts`、`host/scientific.tsx:217–247`。 |
| UI-Q-PREVIEW-HIDDEN / QUESTION、RISK | 原始 Siril PRD v1.1 :265–271 使用“可见时更新 / 关闭时不必”，Chat 07:64–66 强调可见时受控更新。当前 NodeView 的发请求 effect 不依赖 active，折叠且 Inspector 关闭期间仍会随参数/输入更新候选；可见性只限制 TTL 验证。是否要处理隐藏期间的实际输入变化属于后续明确行为，不凭旧话直接判违约。当前打开 Inspector 本身不是 effect 依赖，用户操作不自动启动正式图。来源：`host/scientific.tsx:90–135`。 |
| UI-Q-BOOKMARK / REQUIREMENT、RISK | 用户要求扁平化展示分类并翻译 Assets、复用原生书签。维护 `Comfy.NodeLibrary.Bookmarks.V2` 的裸 Node ID 与分类路径兼容，保留其他节点/文件夹设置，当前 AstroPhoto 节点才显示。写入失败回读。前端无专门乐观并发控制已定位，本轮也无真实同步/持久化验收，不能把版本内部格式当稳定公共 API。来源：`.agent/notes/node-bookmarks.md`；`NodesPage.tsx:16–81`。 |

## 可观察行为与防御

以下 feature/guard 关系可与上一版审计的 F-01…F-19、GF-01…GF-16 对照。文件为 `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/evidence/subagents/frontend.md`，其未实施或未测结论只作为该工作树的历史证据。

| 事项 ID / 对应旧 ID | 源码调用链、持久化与限制 | Guard / 测试 |
|---|---|---|
| UI-F-ENTRY → F-01 | `frontend/entry.ts:1–3` 分别导入 Vue、React；`frontend/vite.config.mts:7–38` 单 ESM main.js、一个 main.css、外置相对宿主 app/api URL；`ui/src/main.tsx:10–14` 原生 setup 注册侧栏、另注册科学节点插件。 | `host/sidebar.tsx:9–33` idempotent render，同容器复用、容器换/销毁清理 root/监听/计时器。T-lifecycle。 |
| UI-F-NAV → F-02 | `app/App.tsx:15–43` 3 主视图 hidden 保留；刷新针对 Nodes 或 Assets 的真实服务；Settings 内部模块返回。 `shared/SidebarTabs.tsx` 点击、方向键、Home/End 焦点，Enter/空格选择。 | 设备有异步离开 Guard；navigation 测试覆盖默认、手动键盘及跨视图状态。 |
| UI-F-NODES → F-03 | `api/nodes.ts:6–32` 用 /object_info 元数据与真实归属标识；`NodesPage.tsx:48–61,116–135` 显示层去 AstroPhoto/ 前缀、翻译 Assets、隐藏顶层 examples，过滤/搜索标题、ID、类别、别名、描述，展开树与详情。保留注册 ID 与分类。 | `shared/useResource.ts` 取消过期请求，`api/client.ts:12–39` 分辨 timeout/abort/network/HTTP/JSON；空态、错误重试不同。navigation/api/search。历史 examples 默认收起截图来自较旧行为。 |
| UI-F-HOVER → F-03 | `features/nodes/NodeTree.tsx` → NodeHoverPreview 的 Portal，按宿主侧栏位置选方向并限制视口，纯元数据缩略图，不创建节点或运行 widget。切 tab、离开、开始拖放时撤。 | 2026-11-17 历史 16 px / 535×350 Chromium；`.agent/archive/sidebar-node-preview.md`。 |
| UI-F-CANVAS → F-04 | `host/canvas.ts:11–35` 取当前 canvas.graph 与位置，调用已注册工厂和 graph.add，在 graph 与 canvas 双变化边界内保全宿主历史。 `host/dragDrop.ts:3–34` 自有 MIME 负载仅识别版本/类型/owned ID，在 canvas 局部消费。 | graph ready、只读、selectOnly、allow_interaction、未注册先拒绝；异常清理并闭事务。早期仅 graph hooks，真实宿主 Undo 未记录，补 canvas emitBefore/After 后重验。canvas.test.ts:15/21/27/31；历史 host-runtime。 |
| UI-F-BOOKMARK → F-05 | `NodesPage.tsx:16–81,116–120` 从宿主设置读/写并活动页每 500ms 同步，过滤仅 AstroPhoto Node。 | 写失败回读设置及反馈；未定位取消/并发冲突保护专项测试。 |
| UI-F-ASSET → F-06 | `AssetsPage.tsx:17–69` 实际 API、文件名过滤、按名称或 mtime_ns 排序，真实会话 ID、reference 重定位；`ImportDialog.tsx` 服务端路径预检→模式/工作区→异步操作。 | 无导入能力禁用；改输入清预检，pending 禁用，离线 workspace 拒绝选择；事务/授权取决于后端。navigation 用例只覆盖 unavailable frame/sort 状态，勿扩大。storage-host 过去写路径验证另记。 |
| UI-F-STORAGE → F-07/F-08 | `features/settings/StoragePage.tsx:20–215` workspace 添加、默认、启停、重命名、移除、迁移、定位；默认 import mode / cache 配置与清理，使用真实服务器回执。 | expected_revision、幂等 operation key、状态/能力禁用与宿主 prompt/confirm；Escape 还焦点。storage.test.tsx:24/55/96。 |
| UI-F-EQUIPMENT → F-09 | 设备按类型建档、编辑、分页、搜索、详情、归档/删除；`EquipmentPage.tsx:23–86,138–155`、EquipmentForm、EquipmentDetails、EquipmentList → api/equipment。两个内层标签搜索各自独立，重复点击同标签也返回该列表。 | dirty/busy 导航确认、beforeunload 清理、remount session 恢复；版本冲突可回读重建输入，显示字段错误并保留表单。equipment.test.tsx:40/72/195 和 detailAccordion.test.tsx。 |
| UI-F-TRAIN → F-10 | `OpticalTrainEditor.tsx:14–129` 草稿、快速新增设备、部件选择、配件顺序、滤镜多选、已有规格估值；`OpticalTrainDetails.tsx:10–81` 当前配置折叠、引用跳转、归档与删除。没有发布/历史 UI，后台历史或迁移兼容另记。 | 无效/已归档设备提示，按设备类型/去重筛选，排序边界，归档与删除确认、版本冲突恢复。equipment.test.tsx:126/180/195；equipment-host 明确断言没有发布与历史。 |
| UI-F-VENDOR → F-19 | `shared/ComfySingleSelect.tsx:16–46`、ComfyMultiSelect:7–33：Vue createApp 生命周期挂载到 React，受控 props 与事件值同步；源于固定 1.59.1 的 `frontend/src/vendor/comfyui`，公开 design-system 1.1.0 无对应子导出。 | React Jest mapper 用替身覆盖业务值与状态，不能证明原生 selector 弹层/键盘行为；阅读 vendor README，未逐行验全部 vendored SFC。 |
| UI-F-SOFTWARE → F-11 | `SoftwarePage.tsx:7–115` 列表→Siril detail，发现实际候选、手动服务器 CLI 路径、验证并保存/删/启停；`api/siril.ts:14–31` /astrophoto/v1/software/siril。 | 卸载 abort，pending 防重复，只能选择 ready，后端校验 1.4.5；换候选失败保留已验路径，DTO ready 要有 enabled/version/path/verified_at。siril.test.tsx:9–53。 |
| UI-F-RESOLUTION → F-12 | `EnvironmentPage.tsx:10–59` + api/previewSettings：512/1024/2048/4096/full，默认 1024；成功后通知节点共用预览，正式 FITS 保持原分辨率。Canvas 显示限制与正式尺寸隔离。 | revision、conflict 禁止旧设置、回执确定实际状态。无单独 Environment Page 保存冲突用例已定位；真实状态重验留待目标宿主。 |
| UI-F-SOURCE → F-13 | `host/scientific.tsx:217–247,263–298` 实际 FITS Source Node 的 React DOM selector，资产获取依服务器分页，显示加载/错误/刷新；Image Path Node 路径值可作为上游候选输入。 | `api/siril.ts:33–45` UUID/递增分页 cursor/响应验证和 abort。浏览器历史直接路径流程，本次 scientific-node 对测试路径请求作 HTTP 替身校验。 |
| UI-F-CANDIDATE → F-14 | `host/scientific.tsx:36–47,68–147` sourceId 识别实际 FITS Source、Image Path 以及同输入/参数的上游 AutoStretch 正式结果，弱映射保留执行回执；单主图可折叠、刷新，图像预览不改变正式输出。 | source 循环 visited、200ms 宿主读、400ms 防抖、AbortController、requestKey 防过时结果、释放 URL、卸载清 timer/listener、TTL validate 受可见性限制。api/siril.ts:48–105 cancel job、PNG 检核及对象 URL 清理。复杂子图和第三方节点自动预览解析未见。 |
| UI-F-INSPECTOR → F-15 | `Inspector.tsx:18–161` Dialog Portal，默认 side、wipe、single，保留两图缩放/平移，fit/pixels 与横竖分区。不能空间对应时回到 side。 | canWipe 检验两个 URL/aligned、pointer 主指针、zoom clamp、aria-pressed/slider 与两轴键盘、关闭后恢复焦点。siril.test.tsx:55 断言 JSDOM 三视图、失配、键盘和通用只读时的值。 |
| UI-F-INSPECTOR-PARAM → F-16 | `host/scientific.tsx:150–193,198–215` Inspector 注入实际编辑控件，范围内提交，回写 native widget 与 change 边界，候选刷新改后最新路径参数。 | read_only/selectOnly、graph、单色色道保护。scientific-node.test.tsx:83/129/143 本次实际通过；宿主脚本存在且曾有比较/正式运行，但是否已在当前版本中由 Inspector 而非节点本身执行所有三参修改需新收据。 |
| UI-F-VUE → F-17 | `frontend/src/main.ts`、components/{DrawingApp,DrawingBoard,ToolBar,VueExampleComponent}.vue：原生 DOM widget 挂独立 Vue/PrimeVue/i18n，黑白画布像素可存留重载；画笔/橡皮/颜色/大小、清屏、鼠标/触屏。 | revision 防异步恢复覆盖新画/卸载，旧空值继续可编辑，损坏状态反馈；上传失败 null 保持旧合同；现有 Python 循环问题独立。Vue tests/components 与 tests/widgets 断言见下。 |
| UI-F-LOCALE → F-18 | `host/locale.ts:4–16` focus+interval，同步后释放；React i18n local zh/en，Vue 根 locales；CSS 取宿主 theme tokens。 | i18n.test.tsx:10/12 校验键集合与旧偏好停用；目标宿主浮动栏、各区域翻译焦点仍按实际证据。 |

## 测试与历史尝试

| 证据 ID / 身份 | 命令、环境或源码、结果及约束 |
|---|---|
| UI-T-CURRENT-JEST / CURRENT_RUN | `pnpm -C frontend test:react`，Windows / Node v26.8.2 / pnpm 11.13.1，exit 0，11 suites / 51 tests，0 snapshots。11 套为 equipment、navigation、storage、siril、scientific-node、i18n、lifecycle、detailAccordion、search、api、canvas。JSDOM、模拟宿主/API/native Vue 选择器。 |
| UI-T-CURRENT-TYPECHECK / CURRENT_RUN | `pnpm -C frontend typecheck` 同环境 exit 0，`vue-tsc --noEmit && tsc -p ui/tsconfig.json --noEmit`。本域本轮没有重新构建或运行真实宿主浏览器、原生队列或 Siril CLI。 |
| UI-E-JEST / ERROR、ATTEMPT、HISTORICAL_RUN | 11-18_1 的默认 Jest 4 套/13 测试通过，另 6 套加载时报 CSS 错，exit 1；临时空 CSS mapper 后 9 套/46 测试通过，1 套/1 测试失败：Siril DTO fixture 缺 enabled、软件详情入口变化。随后用户选择两项 A，正式 `frontend/jest.config.cjs` 映射 CSS、siril fixture 按实际 DTO 与软件详情导航修正并验证换错版本仍读回旧配置；归档回执 10 套/47。现在 11 套/51。历史 FAIL 保留，当前已修复。来源：11-18_1/06:10–11；`.agent/archive/react-jest-siril-regression.md`；`siril.test.tsx:9–53`。 |
| UI-T-EDIT-JEST / TEST、SOURCE + CURRENT_RUN | scientific-node.test.tsx:83 调实际 registerScientific → nodeCreated → DOM → 编辑 3 widget → reset，并检查最新路径预览、graph + canvas before/after 回执。:129 只读及 selectOnly 拒绝写 / reset；:143 单色阻止 linked。覆盖之前通用 Inspector 展示用例无法验证的 F-16。 |
| UI-T-NAV-STATE / TEST、SOURCE + CURRENT_RUN | navigation.test.tsx:15/32/57/65/96/140 验默认/键盘、目录状态保留、错误重试、刷新、搜索树、故障时筛选排序保留；api.test.ts:10/16/26 验 JSON/断网、定时与 abort、非法 DTO；search.test.tsx:3 IME 防抖与 cleanup。 |
| UI-T-SETTING-WRITES / TEST、SOURCE + CURRENT_RUN | storage.test.tsx:24–52 只有服务器 mode 成功才更新并提交 revision；:55–93 迁移回执 + refreshed workspace；:96–114 宿主取消/确认与 cache 清理回执。Equipment :40–86 字段错误、污损恢复；:126–177 删除版本冲突 + 成功后列表更新；:180–224 标签键盘、独立筛选。 |
| UI-T-VUE / TEST、HISTORICAL_RUN | Vue Vitest Chromium 9 测试历史提交，真实画布/替代宿主上传。frontend/tests/widgets/serialization.test.ts:8/31/43/48/67 像素圆环、旧值、中文键、上传、异常；registration.test.ts:4 初始化；DrawingApp.test.ts:6/26/38 绘图、工具和 TouchEvent。历史 host 8188 16 PASS + IMAGE 明确 SKIP，曾真实 graphToPrompt/handleFile 复现和验证黑色像素恢复。 |
| UI-E-IMAGE / ERROR、SKIP、HISTORICAL_RUN | 11-16 host 15 pass / 2 fail，像素丢失已由新工作流值修复。旧 vue-basic IMAGE 仍有 Python LoadImage 二次路径解析；mock 当时可以与错误行为一致而通过。8188 指定 `--skip-image-execution` 只是该项目明确跳过，不是修复或执行通过。来源：`.agent/notes/react-sidebar.md`、`.agent/archive/drawing-persistence.md`。 |
| UI-T-HOST-EVIDENCE / TEST、HISTORICAL_RUN | 8188 真 host 替代 scripts/litegraph.core.js（404）为已核对 runtime，拖放/撤销/重做、Subgraph、重新打开、单 JS + CSS 200 有历史真测。11-17 8199 跟随宿主语言、外观且 General 缺席，浏览器拦截宿主设置写入。隔离第二套 storage-host 等侧栏超时，后续启动被工具拒绝，存储功能完整写回由其他测试回执区分。来源：notes/react-sidebar 与 archive/sidebar-host-settings、storage-comfyui-frontend。 |
| UI-T-SIRIL-HOST / TEST、ATTEMPT、HISTORICAL_RUN | 8206 宿主一次 Astropy 未载入；8207 隔离环境用独立依赖后有 0.45.0 / 1.59.1 / Siril 1.4.5 的正式流程，Prompt 75def43a-cd64-4f59-a70d-97070a5c31c4，含输入不可变、预览、Inspector、双语重开；另有 b4b3983a-e730-4d80-a85a-2bccdacbb914 路径二级串联。仅为对应快照和宿主历史证据。来源：`.agent/notes/siril-autostretch.md`、docs/siril.md。 |
| UI-R-HOST-STALE / RISK | 当前通用 `frontend/ui/host-runtime.mjs:26,39` 等待已过时的 Assets unavailable 并要求已撤掉的 Observing Sites；还可能触发宿主设置写入。新运行需要隔离宿主并调整断言。真实代理部署、浮动侧栏、目标宿主收藏持久化、参数与旧请求竞争及复杂 Subgraph 候选仍没有此轮验收。设备脚本确有 280/420/650 与 200% 检查，但并非整套 Sidebar/Inspector 证明。 |

## 阅读边界

实际核对 Sidebar Chat Full Handoff 的 D-01…D-14、阶段演变索引和专题段落定位；读取 Last_Handoff 的 Sidebar FRD 的产品、交互、宿主约束部分和 Guide 章节/接口索引；Siril Chat 02、07 和实际 HTML 原型的交互脚本/示意性质，Siril 原始 PRD 的预览可见性受先前同版行级引用并与现行实现比较；11-18_1 08 前端章节、前端子审计与 06 测试证据，docs/react-sidebar.md；archive 的 native-sidebar-tabs、sidebar-node-tree、sidebar-node-preview、sidebar-search-toolbar、sidebar-host-settings、storage-comfyui-frontend、drawing-persistence、react-jest-siril-regression，以及 notes 的 react-sidebar、node-bookmarks、equipment-single-select、equipment-tab-navigation、equipment-detail-accordion、siril-autostretch。设备原始 PRD 全量、其他原始 Chat 消息、历史截图视读、第三方 vendor 全文、全部 CSS/翻译动态键、全部历史镜像及正式审计中的所有原始日志未在本域逐份语义复核，需结合全局覆盖回执与其他域报告。未获取原始 Chat 转录，交接摘要应按派生来源记载。


[稳定编号和逐项出处](migration/OLD_ID_MAP.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/08_FRONTEND_UI_AND_INSPECTOR.md)

```markdown
# 前端、Vue Widget 与 Inspector

## 侧栏和输入控件

- frontend/entry.ts 是唯一构建入口，导入 Vue 与 React。main.tsx 注册 Sidebar 和科学节点插件。host/sidebar.tsx render/destroy 重用同容器 root 并清理旧监听。App.tsx 的 Nodes/Assets/Settings 主 Tab 保留各页状态，Assets 为默认。主题使用 Comfy 变量；React Locale 订阅宿主，Vue 在挂载时取值。
- NodesPage 和 NodeTree 从 object_info 列出此扩展节点，并过滤 examples 类别，支持搜索、排序、类别、展开、提示与点击/拖拽添加。host/canvas.ts 与 dragDrop.ts 防只读、错误区域及未知节点，失败时结束图变更。没有增加一个远程画布编辑工具。收藏通过 NodesPage.tsx:16–81 共享宿主 Comfy.NodeLibrary.Bookmarks.V2，保留其他节点和目录条目，活动时每 500ms 同步，失败恢复宿主状态或显示错误。真实收藏写入未重跑。
- Settings 页实装 Storage、Software、Equipment、Environment、System Status，并展示 Knowledge、Memory、Agent Context 规划页。观测地和 General 行已移除。Assets 有真实资产列表、导入预检和任务状态，Capture Sessions 面板可列出当前资产关联的会话标识，但尚未形成会话详情浏览或编辑。
- Equipment 与 Optical Train 共用 DetailAccordion、DetailActions、Comfy 风格控件。设备建档、专业规格、引用跳转、编辑归档删除。光路组件按真实顺序，滤镜多选，多设备可从编辑器新增，单配置和引用显示。有些归档设备和删除失败需要参见 [业务缺口](09_STORAGE_ASSETS_EQUIPMENT.md)。
- 复用的 vendor Vue SingleSelect、MultiSelect 由 React bridge createApp 挂载和卸载，官方修改点、依赖和样式在 frontend/src/vendor/comfyui/README.md。Jest 将这两套 Vue 选择器替换为测试组件，Keyboard/focus/弹层真行为不能从该替身推定。
- Vue DrawingBoard 与 DrawingApp 提供画笔、橡皮、画笔颜色/大小、触摸/鼠标及清屏、Canvas 像素保存还原。VueExampleComponent 实际序列化先上传 PNG，成功返回 temp 路径，异常返回 image:null。Chromium 的真实 Canvas/模拟宿主上传断言见 [测试矩阵](06_TEST_COVERAGE_MATRIX.md)。

## 科学节点

host/scientific.tsx:36–46 跟踪相连上游及同一来源/参数的正式结果。NodeView:68–115 在参数、输入、手工刷新、分辨率环境设置变化后发新请求，400ms debounce，AbortController 防旧响应并释放 Blob URL。展开状态和 Inspector 打开用于 TTL/validate 轮询（:117–135），不是请求 effect 依赖；开发者需要区分隐藏期间仍处理输入变更与仅打开窗口触发重算。

NodePreview 提供单张主图、折叠、刷新与大图入口。EnvironmentPage 和 api/previewSettings 管全局 PNG：512/1024/2048/4096/full；默认 1024，画布 480×320 上限与节点宽度协调。正式 FITS 不受该设置压缩。

Inspector 与主预览共用最新图像，提供并排、单图、对齐时擦拭比较、平移缩放、分区 resize 和键盘输入。失配禁用擦拭，关闭后恢复原焦点。通用组件位于 frontend/ui/src/features/nodePreview/Inspector.tsx，历史 features/siril/Inspector.tsx 是重导出兼容层。用户确认 Inspector 可以修改当前节点的 shadowsclip、targetbg、linked，也可重置。实际 NodeView 通过 updateParameters 和 graph change 更新画布，同一组参数驱动候选预览。单色输入禁用 linked，宿主 read_only/selectOnly 时拒绝写入。通用 Inspector 的 JSDOM 展示用例未覆盖上述编辑链。本期不纳入 Trial 管理。

## 验证差异

[本轮日志](06_TEST_COVERAGE_MATRIX.md) 区分 React 默认配置、临时 CSS 映射、Vue Chromium、代理模拟应用和真实宿主 GET。通用 host-runtime.mjs 仍含旧资产 unavailable 与观测地断言并写 Comfy 设置，应先更新测试或在授权的隔离宿主重跑。当前分辨率写入回执、图像失败降级、窄栏主题/动态 locale、多节点竞争及复杂 subgraph 均需按具体证据确认。
```
