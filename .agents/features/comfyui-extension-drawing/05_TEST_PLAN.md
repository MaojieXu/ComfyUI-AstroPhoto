# ComfyUI 扩展底座与绘图节点 · 测试计划

**版本** v0.4 · 2026-11-21 · 按实际代码定稿的测试规格主体。Q-01～03 涉及发行或交互选择的子项待评审冻结。运行结果进入测试报告。

## 执行基线与夹具

- **B1 仓库与依赖**。参考 HEAD `4c0cf4d`，采集真实执行时的 dirty diff、未跟踪相关源码清单与哈希、构件 SHA-256、实际命令版本。目标运行组合 ComfyUI 0.46.0 / Frontend 1.59.6，开发 Python 3.12 并保留 3.11 发行检查，Node 26.13.1 / pnpm 11.13.1 按当前 CI 固定。前端 Vitest/Playwright Chromium、Python pytest/aiohttp。
- **F1 宿主替身**。`tests/conftest.py` 提供独立宿主注册表、路由及 LoadImage 替身；每项由 pytest tmp_path 创建 Data Root。真实 aiohttp 验证路由，替身验证 Python 委托。
- **F2 浏览器像素夹具**。`frontend/tests/host.ts` 提供 Widget 宿主/上传替身。构造两份不同的 300×300 PNG、旧空值、非 PNG、坏 PNG 和 299×300 PNG。controlled decode 用可控 promise 区分正在恢复、继续编辑、第二次加载与卸载。销毁挂载、还原时间/网络替身并回收浏览器上下文。
- **F3 真实隔离宿主**。一次 run 独立 user/input/output/temp、Data Root 和证据目录；绑定 loopback。使用迁移前工作流，含画板点位样本及脚本要求的 FITS Source 和 AutoStretch 节点。仅针对 CASE-03E 再准备绘图节点连 PreviewImage 的最小图。每次结束恢复宿主设置、关闭测试浏览器并按运行根清理临时文件。
- **F4 双包构件**。独立临时目录构建 Registry/Wheel/sdist 和安装环境，留存清单与摘要再清理；公开发行安装与本地构件检查分别记录。

## 用例与覆盖矩阵

表中 FR 与 PRD 是规范来源，当前符号与守卫见 DEV；已有入口和待补断言明确区分。CASE-01～03 沿用旧 ID 并拆解子项，CASE-04 覆盖此前未单列的 FR-04。F1～F4 的清理应用于所有引用用例。

| 用例／优先级 | 需求与入口 | 夹具、步骤和观察点 | 预期与现有覆盖 |
| --- | --- | --- | --- |
| CASE-01A P0 宿主加载 | FR-01 · DEV S1 `on_load`、`register_routes` | F1/F3。首次和重复调用，切换宿主映射由缺节点到已注册；另建独立路由表、外部状态路由和同路径业务路由冲突。真实宿主读取状态和唯一节点 schema。 | 每个宿主一组路由。替换状态由 degraded 到 ok；冲突不遗留部分注册。schema 键、输入类型及 IMAGE 一致。已有 [状态集成](../../../tests/integration/test_status_api.py) · [业务路由冲突](../../../tests/integration/test_equipment_api.py) · [宿主 GET](../../../tests/integration/test_host_runtime.py) |
| CASE-01B P0 降级与隔离 | FR-01 · DEV S1 `host_runtime`、`status_payload` | F1。只 import/读取配置，随后分别给正常临时根、非法路径和不兼容/坏的配置；在好坏宿主中观测可用性及磁盘变化。 | 导入不创建目录。无效根不得初始化，同一运行里的状态仍可诊断，未实现能力不报可用。已有 [Core](../../../tests/backend/test_core.py) · [能力](../../../tests/backend/test_status.py) · [存储故障](../../../tests/integration/test_storage_api.py) |
| CASE-01C P1 状态权限与路由冲突副作用 | FR-01 · DEV S1 status_handler/on_load | F1/F3。关闭受信本地操作后同时查状态和设备路由。在隔离宿主预占冲突路由，启动后检查目录、数据库及本次挂载路由。 | 状态仍可读，设备操作拒绝，单独记录 data_home 可见性。路由冲突无部分注册，磁盘副作用按实际取证。现有 aiohttp 冲突测试未覆盖完整启动，待补。 |
| CASE-02A P0 笔画与交互 | FR-02 · DEV S2 `DrawingBoard`、`ToolBar`、`registerDrawing` | F2/F3。鼠标和触摸画已知笔画，调颜色、1/50px，键盘触达按钮和滑杆，清空后继续画。双模式和 en/zh 下检查控件与反馈；缩放或压窄后核对显示坐标与 PNG 落点，模拟触控取消后重新绘图。 | 检查 RGBA、选中态与工作流保存值；移除后无 Canvas、原清理回调仍执行；高倍缩放和输入名称等为扩展检查。已有 [Canvas组件](../../../frontend/tests/components/DrawingApp.test.ts) · [构件 Widget](../../../frontend/tests/widgets/registration.test.ts) |
| CASE-02B P0 保存、重开及实例隔离 | FR-02 · DEV S2 值 hook 和 `restoreCanvas` | F2/F3。画两个不同图，保存后交换操作顺序重开；检查两实例 PNG、保存不上传、宿主 setValue 后值回放、清空重开。 | 按对应节点逐像素一致，无串值；组件现有测试覆盖单节点和 setValue，双实例和完整 RGBA 为待补断言。已有 [序列化](../../../frontend/tests/widgets/serialization.test.ts) · [真实宿主](../../../frontend/tests/host/host-runtime.mjs) |
| CASE-02C P0 旧空值与损坏 | FR-02 · DEV S2 `normalizeValue`、恢复拒绝 | F2。分别载入旧空、缺字段、非 PNG、坏数据、错误尺寸；观察后再次绘图与保存。 | 旧值保持可绘；无效图产生本地化 alert，不改另一实例，正常编辑后提示消失。现有覆盖旧空与坏 PNG，类型/尺寸独立断言待补。已有 [序列化](../../../frontend/tests/widgets/serialization.test.ts) |
| CASE-02D P0 慢恢复和竞态 | FR-02 · Q-03 · DEV S2 `revision`、watch、`serializeValue` | F2。挂起旧 decode，再开始笔画、清空、触发第二次恢复或卸载；分别完成或拒绝旧 promise。对活跃笔画前后读取 Widget 值和准备 prompt。 | 已确定的安全线是旧结果不能覆盖已完成的新编辑或后加载的工作流；过期错误提示也需记录。允许先画还是等恢复，按 Q-03 更新断言。待补受控竞态测试。 |
| CASE-02E P1 分享副本 | FR-02 · Q-02 · DEV S2 工作流值 | F2/F3。检查保存的 JSON 及重新打开的副本，确认像素是否随文件传递。若确认宿主操作指引，用副本清空并保存，验证原件保留。 | 当前代码会内嵌像素。A/B 最终验收待确认。独立可选导出若获批准，另补原图、无图副本及其他节点不变断言。 |
| CASE-02F P0 原生撤销及重做 | FR-02 · DEV S2 handleStateSave | F2/F3。两个画板分别画图，目标节点画一笔并清空后操作宿主 Undo/Redo；检查 Widget 值、RGBA、另一节点和图通知。 | Undo/Redo 回到对应历史图，回放不新增编辑记录，另一节点像素一致。已有值回放组件覆盖，真实宿主和通知顺序待补。 |
| CASE-03A P0 正常上传和解析 | FR-03 · DEV S3 `serializeValue`、`uploadTempImage` | F2。绘图，对照 multipart PNG、文件名、subfolder 和 type；await 恢复后发起，验证返回引用。 | 请求字节等于保存时的 Canvas PNG，引用含 `threed/` 和 `[temp]`，保存流程没有多余上传。已有 [序列化](../../../frontend/tests/widgets/serialization.test.ts) |
| CASE-03B P0 临时引用真实宿主 | FR-03 · DEV S3 · P0 FR-06 | F3。两种宿主画布分别打开旧图，等待预期像素，调用 graphToPrompt，观察上传成功、参考路径、图保存与重开。 | 同一工作流像素保持且收到 HTTP 成功和有效引用。当前脚本不发正式 prompt；该项结果只证明到临时引用。已有 [宿主脚本](../../../frontend/tests/host/host-runtime.mjs) |
| CASE-03C P0 上传失败和返回异常 | FR-03 · DEV S3 上传错误 | F2。断网、非 JSON、HTTP 错误且返回 JSON、HTTP 成功但无有效名称；检查生成的引用与持久值。 | 不能产生伪有效路径或显示正式成功；Canvas 保存内容保持。断网已有回归，HTTP 状态和名称断言待补，有源码缺口。已有 [序列化](../../../frontend/tests/widgets/serialization.test.ts) |
| CASE-03D P0 Python 委托 | FR-03 · DEV S3 `execute` | F1。传入成功字符串，再传 null、缺字段、非字符串，另记录空字符串由宿主处理的现状；注入宿主加载失败。 | 有效输入先经路径解析再委托，返回单一 IMAGE；拒绝项不可调用 I/O，宿主异常不会返回假图。已有 [节点 I/O](../../../tests/nodes/test_image_io.py)，宿主失败传播断言待补。 |
| CASE-03E P0 完整 IMAGE | FR-03 · Q-01 · DEV S3 正式队列 | F3。生成真实临时引用，把最小 `vue-basic → PreviewImage` 图提交给 `POST /prompt`，按 prompt ID 查询 `/history/{id}`。记录输入中临时引用和失败时宿主日志。 | history 成功且下游 `outputs` 有 images 才通过。历史失败保留。目标环境是否放行发行待 Q-01；现有 `test:host` 不覆盖，本条为独立隔离执行项。 |
| CASE-04A P0 资源与打包 | FR-04 · DEV S4 | F2/F4。实际构建并检查 JS/CSS、宿主相对模块、中文和英文词条、独立打包内容。根路由和代理子路径分别用构建检查、Chromium 资源替身和实际宿主验证。 | 只有一个发现入口，加载到相应路径且无全局构建残留，含需要的构件与翻译。已有 [构件检查](../../../frontend/scripts/check-build.mjs) · [代理检查](../../../frontend/scripts/check-proxy.mjs) · [包内容](../../../tests/packaging/test_contents.py) |
| CASE-04B P0 版本及独立安装 | FR-04 · DEV S4 | F4。检查根版本和同版本 MCP pin，故意提供不匹配的临时版本，构建后独立安装 wheel 并握手。按真实发布顺序检查公开依赖和目标宿主安装。 | 错配失败。构件的版本和安装相符。公开发行只有实际公开可解析及装机证据才记录，授权发布单列。已有 [版本测试](../../../tests/packaging/test_versions.py) · [独立安装](../../../scripts/check_install.py) |

## 执行顺序、命令与结果

1. 确认 F1/F2/F3/F4 各自独立可用，执行 Python 层 `uv run pytest tests/nodes tests/backend/test_core.py tests/backend/test_status.py tests/integration/test_status_api.py tests/integration/test_storage_api.py tests/integration/test_equipment_api.py tests/packaging -q`。特殊卷/宿主用例缺环境时记录原因。
2. 运行 `pnpm -C frontend typecheck`、`pnpm -C frontend lint`、`pnpm -C frontend test`，再运行 `pnpm -C frontend check:build`、`pnpm -C frontend check:proxy`。注意 test 自带构建，会写工作区构件；为避免混淆，复验时只从隔离 checkout 或固定待测产物执行。
3. F3 设定 `COMFYUI_TEST_URL`、`ASTROPHOTO_BASELINE_WORKFLOW`、`ASTROPHOTO_MIGRATION_EVIDENCE`。使用 `uv run pytest -m host tests/integration/test_host_runtime.py -q` 检查真实状态，然后分别执行 `pnpm -C frontend test:host` 与 `pnpm -C frontend test:host --nodes-2`。按 CASE-03E 单独提交正式队列，记录与迁移上传检查不同的证据。
4. 按 [双包发布文档](../../../docs/publishing.md) 准备 F4 的本地构件及安装检查。保存结果清单、构件摘要、环境版本、各 case 的命令及可观察证据。使用 PASS/FAIL/SKIP/BLOCKED/NOT_RUN；缺业务实现的断言不通过调整预期消除。

质量门的适用范围由 PRD 及 Q-01 的发行决定定义；CASE-02D/E 的新增交互预期随 Q-02/03 确认后更新。固定测试规格时记录 PRD/DEV 版本与执行工作树快照，再更新对应下游。 [PRD](01_PRD.md) · [实现规格](04_DEV.md) · [测试报告](06_TEST_REPORT.md)
