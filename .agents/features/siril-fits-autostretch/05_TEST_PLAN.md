# Siril 集成与 FITS AutoStretch · 测试计划

**版本** v0.4 · 2026-11-21 · 模式 B，基于当前源码的候选验收规格。规范来源为 [PRD](01_PRD.md)，当前路径与 Guard 见 [DEV v0.4](04_DEV.md)。静态核验使用 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加相关 dirty 工作树，详见 [索引](00_FEATURE_INDEX.md)。已收敛的场景可执行；Q-01～06 涉及的产品差异保留判定条件。所有条目本轮 `NOT_RUN`，历史 Windows 证据见 [06_TEST_REPORT](06_TEST_REPORT.md)，既有 Bundle 的独立运行见下文。

## 环境与夹具

- F1 临时 Data Root、专用 Cache 和两个测试 Workspace，从测试进程独立实例初始化。HTTP 使用 aiohttp TestClient/TestServer，节点可用宿主替身。用例结束关闭候选 worker 与操作 pool，再清理临时树；真实宿主只使用明确指定的隔离用户目录和测试数据。
- F2 由 Astropy 生成 `uint16` 单色、`float32` RGB，再由用例构造损坏、扩展 HDU、WCS、非有限值和错尺寸副本。记录原件 SHA-256、形状、BITPIX、坐标键和辅助 HDU。文件名带空格，按需注入已登记位置及路径重绑。每次用例独立临时文件，异常后保留证据副本。
- F3 当前后端须使用官方 Siril 1.4.5 二进制，包括配置、成功候选及真实输出路径。错误版本和取消可用替身或测试子进程隔离。已存两个真 CLI pytest 在 `ASTROPHOTO_SIRIL_TEST_CLI` 缺失时会 skip；验收相应标 blocked 并区分无运行与失败。 [Siril 官方发布](https://siril.org/download/2026-10-28-siril-1-4-5/)
- F4 真 E2E 需要从当前源码构建前端、与生产后端 Bundle 同版本加载，宿主仅监听 loopback，开启受信本地存储和隔离 Data Root。Playwright Chromium 使用测试 Profile；记录 ComfyUI/Frontend、Python 和依赖、节点模式、Siril/PATH、平台、可用空间和证据目录。本地取消陈述不外推强杀整个进程树的行为。

### 科学验收样本矩阵

| 样本 | 构造或取得方式 | 可独立判断的结果 |
| --- | --- | --- |
| F2-A · 真实天文场 | 使用 Astropy 教程的 HorseHead.fits，原版包含 891×893 int16 主图及 `er.mask` 辅助表。分别在隔离环境使用完整原版与只保留主图的衍生版，保存两份各自的 SHA-256。历史运行使用衍生版。 | 读入与结果分别记录实际 BITPIX、全部 HDU 类型和名称。用 Astropy WCS 比较中心与四角映射。确认分割判据与实际坐标差异分别有记录。 [Astropy 官方教程](https://learn.astropy.org/tutorials/FITS-images.html) · [历史运行](../../../docs/siril.md) |
| F2-B · 现有 96×96 RGB 回归 | 复用项目既有 RGB 方案，浮点三通道、无 WCS。取真实候选和真实 CLI 输出。 | 比较输入与输出的形状、三通道、BITPIX 和 OBJECT。用非均匀样本验证像素确有处理。缺 WCS 的可分割结果只作为界面行为。 |
| F2-C · 缩放和非有限值 | 以 Astropy 写出有明确 BSCALE/BZERO 的副本，分别覆盖常规缩放、非零 BZERO 下的 NaN/±Inf，以及含 BLANK 的整数图。另列每个样本中专门设置的像素位置。 | 分别记录原始 raw 样本、Astropy 解码的物理值、工作副本及输出的 dtype/位深/缩放字段。核对规整位置、正常像素和原件 SHA-256。是否接受输出变化由 Q-01 确定。 |
| F2-D · 多 HDU 与损坏 | 空主 HDU 后依次放有效 ImageHDU 或 CompImageHDU、另一候选图像和辅助表。另建截断图、纯表和首维非 3 的三维图。 | 验证选中首个支持的图像，记录工作副本的主 HDU 和辅助 HDU 去向。无可处理图像或读取失败拒绝，形状不符的处理输出不得登记。 |
| F2-E · 对齐判据 | 从同一图复制 WCS；制备修改坐标原点、只修改 CDELT、等价 WCS 表述、无 WCS、未知 ROWORDER 的对照。 | 同时记录当前分割开关、关键字比较和 Astropy 坐标实测。坐标差异以角距及所选像素采样点报告，等价容差和缺 WCS 的放行规则交 Q-01。 |

证据同时保存输入和输出的 SHA-256、实际运行参数、Astropy 核对摘要及运行 ID。PNG 另记录尺寸、方向和可见状态。每条结果标记真实 CLI、真实宿主、服务层注入或浏览器替身。字段差异尚未获得产品决定时，记录实际差异和 Q 编号。

## 可执行场景与现有资产

`P0` 为核心验收，`P1` 为边界回归。列出的测试仅为静态找到的部分覆盖。本轮无新测试文件；标缺口的场景需补测试或进行隔离宿主核对。

| 用例与规则来源 | 前置、操作和可观察结果 | 现状来源、层级与清理 |
| --- | --- | --- |
| CASE-01 · P0 · FR-01，发现、校验和存储 | F1、F3。先读空配置，检测合格、GUI、缺文件、错版本候选，验证有效 CLI 并保存；提交坏路径、错误版本和模拟不产生有效像素的 CLI。合格项才可选择且保存后启用，错误保留原配置，探测本身不写配置。切禁用/启用，替换可执行文件再重验，并清除配置。 | G-02，`SoftwareService`。已有后端 `test_invalid_and_gui_paths_rejected`、`test_config_rejects_incompatible_version_and_keeps_previous` 和真实 CLI 用例；HTTP 层与主机脚本部分覆盖。开关/真实替换待补。清理隔离配置、探针目录。 |
| CASE-02 · P0 · FR-02，候选交互 | F1、F2、F4。连真实登记 FITS 或 Image Path，修改三个参数及重置，换单色或不对齐图；打开 Inspector，切换并排/单图/滑动分割、键盘、平移/缩放。观察正确候选、默认值回写、单色联动关闭、WCS 异常禁用分割与切视图不新增候选；以 `read_only/selectOnly` 验证节点持久值不变。 | G-03～05，`SourcePicker/AutoStretch/Inspector`。现有 `ScientificNodes.test.ts` 的 Widget 替身测试覆盖只读、参数和单色；`siril-host.mjs` 覆盖部分真实浏览器流程。清理挂载、还原宿主设置。 |
| CASE-03 · P0 · FR-03，正式科学链路 | F1～F4。切换默认 Workspace，在原生队列执行 Path → AutoStretch → AutoStretch；查 history、资产与两个 manifest，验证两个运行 ID、第一输出 SHA 等于第二输入 SHA、源 SHA 不变、回执位深/尺寸/元数据符合实测文件。重新提交，确认结果独立且旧产物未被覆盖。 | G-03、G-06，`AstroPhotoSirilAutoStretch.execute/formal_run`。`test_real_cli_direct_path_and_chained_output` 直接调用服务，`siril-host.mjs` 走宿主单节点；当前宿主双节点需补。证据保留后清理测试 Workspace。 |
| CASE-04 · P0 · FR-04，来源身份与重开 | F1、F2、F4。登记两个同名文件，选其一保存并关闭流程；重绑同一 ID 到确认的测试副本，另留失效 ID、带空格路径和值类型错误；重新打开并执行，观察 ID/路径保留、对应位置可解析、错误不静默取其他图。试旧 `ASTRO_FRAME` / STRING 线，确认必须手工迁接。 | G-03，`resolve_input`、来源 Widget。后端 `test_direct_fits_path_outside_import_roots`、`test_load_image_node_outputs_path_and_tracks_file_changes` 与浏览器脚本已有部分覆盖；资产重绑、重名、旧端口待补。清理登记、流程文件。 |
| CASE-05 · P0 · FR-01、02、04，HTTP/节点边界 | F1、F2。装配与不装配 Bundle 分别请求，验证通用列表/Settings 和 V3 来源存在、Siril 路由无 Bundle 为 404。逐项去掉本机信任、标头，传跨源 Origin、非法 UUID、候选来源二者俱无/俱有或坏参数；检查 403、业务错误且没有任务或配置写入。用 101 个测试登记验证下一页和同名 ID。 | G-01、G-03、G-04，`register_routes`、`start_preview`、`frame_assets`。已有两个 `test_siril_api.py` 用例覆盖选定的受信、缺标头、直接路径和可选装配，分页和拒绝参数矩阵待补。关闭 aiohttp 与 F1 服务。 |
| CASE-06 · P0 · FR-02、05，候选状态、失效与清理 | F1、F2、F4。用可控响应令 A 在 B 后返回，改参/换源/关闭 Widget，从相同 owner 启两 job，校验仅 B 可见、旧轮询/worker 取消、URL 被释放。删除 Cache/更换源/更换 formal 文件，重查后报 stale/缺失；刷新可重建正常候选。禁用 Siril 应在开始前拒绝；未配置的可读输入先生成前图、后图不可读。 | G-04、G-05，`renderCandidate`、`PreviewService`。HTTP 已有无配置前图、删除源拒绝、Widget 有中止；真实缓存失效、formal hash、浏览器画面竞态与同 owner 服务端状态待补。最后取消 job 并关 worker。 |
| CASE-07 · P0 · FR-03、05，正式失败恢复 | F1～F3。让处理在校验后、登记前中断或失败，核对无成功资产且回执状态、旧产物和原件保全。模拟退出：造匹配所有权但未登记目录、已登记目录、外来实例目录，调用启动恢复。仅自有孤儿清输出并成为 interrupted；未知文件、外来与已登记资产留存。 | G-06，`formal_run/recover_runs`。`test_restart_reconciles_only_owned_unregistered_run`、`test_runner_timeout_and_mid_process_cancellation`、`test_real_cli_immutable_source_and_formal_output` 有部分覆盖；入库故障注入、完全进程树待补。仅清本用例创建的目录。 |
| CASE-08 · P0 · FR-05，PNG 长边和 revision | F1、F2、F4。读取默认 1024 并用 ≥2048 长边样本，选择 512、4096 和原尺寸，对照 PNG 实际尺寸、等比、无放大小图和 100% 行为，确认正式尺寸和源不变。传非整数/非枚举及过期 revision，刷新后正确复提。 | G-07，`set_preview_settings`、`render_png`、`EnvironmentPage`。HTTP 有 revision/权限；现有前端 `StorageSettings.test.ts` 提供设置入口测试，跨候选与正式尺寸仍待补。还原隔离设置。 |
| CASE-09 · P1 · FR-01，提交取消边界 Q-05 | F1、F3、F4。有效配置 A 后提交合格路径 B，利用探针屏障在配置写入前离开页面/断开请求，放行后重读状态。验证是否保留 A，并记录实际服务端提交和反馈。按历史验收，取消应保留 A；若通过复审更改契约，再更新测试断言。 | G-02，`SirilSettings.perform` 与 `SoftwareService.save`。无端到端取消用例；真实进程超时/检查点已有后端测试，不代表 HTTP 取消。清理子进程、恢复配置。 |
| CASE-10 · P0 · FR-02～04，FITS 科学有效性 Q-01 | F1～F3。用 16-bit、float、非有限、扩展 HDU、WCS 不同、截断及非法通道样本；测试加载、候选和正式入口，比较原始 bytes、工作副本规整、PNG、结果 FITS 和回执。损坏/不支持拒绝，形状不符不登记；位深和 header 差异记录，是否拒绝按 Q-01 决定。 | G-03、04、06，`inspect_fits/prepare_fits/check_output/_aligned`。`test_fits_inspection_validates_precision_metadata_and_truncation`、`test_mono_normalizes_linked` 和真 CLI部分覆盖；扩展与全量元数据矩阵待补。清理隔离样本。 |
| CASE-11 · P1 · FR-02～05，输入内容身份 Q-02 | F1～F3。完成候选后以不同内容覆盖同一路径，分别在提交队列前与复制完成后替换；读候选、执行正式任务并查源哈希。当前可核证规则为读取校验 revision、处理期间漂移报 `SOURCE_CHANGED`；预览后直接运行新文件的产品期望待定并保留实测。 | G-03、05、06，`PreviewService.read/stretch`。相关 stat 变化有后端覆盖，等路径换内容、阶段屏障和具体 UI 提示待补。恢复固定样本后清理。 |
| CASE-12 · P1 · FR-03、05，容量等待与中断 Q-03 | F1～F4。用可控容量失败、后文件写失败和多个 owner 同时请求，不填虚构固定并发阈值；比较失败阶段、缓存可回收性、旧资产和隔离原件。Windows、macOS、Linux 分别观察进程取消与强杀后恢复。 | G-05、06，`PreviewService/stretch/recover_runs`。已有后端超时/取消的最小证据；缓存耗尽、并发和跨平台故障需补。清理仅限自有测试文件与子进程。 |
| CASE-13 · P1 · FR-05，画布尺寸写入 Q-04 | F1、F4。读取 Settings revision，分别 PUT 合法非默认 canvas 及越界尺寸；重新打开 Environment 和节点并核对布局。当前合法尺寸通过校验，但 GET 固定返回 480×320，界面无尺寸控件。保留结果，以产品决定确认应固定或可持久配置。 | G-07，`set_preview_settings/canvas_preview`。缺合法尺寸写入的实际行为测试；PNG 设置现有测试不能证明画布配置。还原临时设置。 |
| CASE-14 · P0 · FR-03、04，工作区与资产恢复 Q-06 | F1～F4。先在 A Queue 生成 R 并保存一个通过 R 的 Asset ID 读取的工作流及一个直填旧绝对路径的对照。切 B 为默认再执行，确认新产物在 B 且 R 不变。使默认 B 离线、只读或迁移中，以独立有效来源 Queue，核查错误、无新成功资产、无备用目录写入。恢复 B 后，把 A 同身份迁移到新根；用原 R ID 重开工作流，核对新路径、原 ID 和 SHA-256。旧绝对路径在原源仍保留时须记录实际读到的文件及回执身份。 | G-03、06、08。存储和 Siril 各有分项入口。本用例需要两种画布及真实队列，历史两节点串联、当前单节点结果均无法覆盖该组合。保留 history、回执和清单后收回隔离根。 |

## 既有运行与覆盖范围

| 来源 | 适用范围与仍待验证 |
| --- | --- |
| 旧路径版 Windows 0.45.0 / 1.59.1，Siril 1.4.5 | 历史双节点 prompt `b4b3983a-e730-4d80-a85a-2bccdacbb914`、手工路径 prompt `75def43a-cd64-4f59-a70d-97070a5c31c4`；RGB、Horsehead、同卷和跨卷证据适用旧实现。 [历史报告](06_TEST_REPORT.md) |
| 2026-11-21 的既有 Bundle Run `frontend-vue-v1596-local-2026-11-21` | Windows ComfyUI 0.46.0 / Frontend 1.59.6，官方 Siril 1.4.5，宿主 Python 3.12.16。经典节点 prompt `39e312f1-a357-42d9-baf2-02e9d989d094`、Nodes 2.0 prompt `32785489-5519-4cee-ae93-d8b5c3f6ca8f`。两者验证合成 RGB 的配置、预览、Inspector、正式单节点和重开，源哈希保全。部分支持 CASE-01、02、03、04、05、08、10；真宿主双节点、原片身份切换、异常矩阵、WCS 与取消/恢复仍有缺口。 [运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) · [经典日志](../../../.artifact/frontend-migration/final-siril-classic.txt) · [Nodes 2.0 日志](../../../.artifact/frontend-migration/final-siril-nodes-2.txt) |
| 最终 Registry 复验 `pi-close-2026-11-21` | 两种画布各执行一份无 WCS 的 RGB 样本。源摘要一致，输出均为 `(3,96,96)`、BITPIX = −32、OBJECT 保留且摘要匹配回执。该批次验证打包后的基础链，CASE-10 保真矩阵与 CASE-14 仍待验。 [运行结果](06_TEST_REPORT.md) |

与当前共享 HEAD 相同的既有 Run 只对当次 dirty、样本及测试层负责。上表没有本轮自动化或运行结论。

## 测试文件与执行顺序

依次核对本地服务集中回归、Vitest 宿主替身、当前真 CLI、Playwright 与原生队列，最后在授权环境注入失败、重跑相关场景。命令按仓库现有入口，当前为待执行。

- `uv run pytest tests/backend/test_siril.py tests/integration/test_siril_api.py -q`。加 `-k` 可定位单项；要求真实 CLI 时传 F3 的绝对路径。
- `pnpm -C frontend exec vitest run tests/components/ScientificNodes.test.ts tests/components/StorageSettings.test.ts`。使用现有 Vitest 配置与 Vue 测试替身。
- `pnpm -C frontend exec node tests/host/siril-host.mjs`。设置 `COMFYUI_TEST_URL`、`ASTROPHOTO_SIRIL_TEST_CLI`、`ASTROPHOTO_SIRIL_TEST_FITS`、`ASTROPHOTO_SIRIL_EVIDENCE`。需真实探测加 `--expect-discovery`，WCS 差异样本加 `--expect-unaligned`，节点 2.0 场景加 `--nodes-2`。隔离输出与证据分开保存，脚本结束还原宿主偏好。

[后端用例](../../../tests/backend/test_siril.py) · [HTTP 用例](../../../tests/integration/test_siril_api.py) · [Widget 用例](../../../frontend/tests/components/ScientificNodes.test.ts) · [设置用例](../../../frontend/tests/components/StorageSettings.test.ts) · [真实宿主脚本](../../../frontend/tests/host/siril-host.mjs)

## 追溯与结果登记

| 需求 | 关联用例 |
| --- | --- |
| FR-01 | CASE-01、05、09 |
| FR-02 | CASE-02、05、06、10、11 |
| FR-03 | CASE-03、07、10、11、12、14 |
| FR-04 | CASE-04、05、10、11、14 |
| FR-05 | CASE-02、06、07、08、11、12、13 |

历史 CASE-01～03 保留，CASE-04～14 追踪权限、恢复、工作区变化和产品偏差。测试报告按实际 run 保存日期、HEAD/dirty diff、依赖、命令、退出/跳过、宿主 Prompt ID、回执、样本与 SHA-256，未运行不提升原历史 PASS。MCP 处理工具、素材 Sidebar 导入、校准、批处理和任意子图候选解析归产品范围限制。
