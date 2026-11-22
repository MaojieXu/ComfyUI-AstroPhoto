# 本地存储与工作区 · 测试计划

**版本** v1.3 · 2026-11-21。基线见[索引](00_FEATURE_INDEX.md)，规则见 [PRD](01_PRD.md)，实际入口及校验见 [DEV](04_DEV.md)，运行证据见 [TEST REPORT](06_TEST_REPORT.md)。此前各轮测试规格及待验证用例保留。

## v1.3 正式回归规格 · 2026-11-21

以下替代 v1.2 中 CASE-10～14 的待修标注和对应 HTTP 缺口。规范沿用 PRD v1.1，实现按 [DEV v1.3](04_DEV.md#v13-评审修复) 冻结。基线为 `f84442b` 加当时工作树。执行用真实临时目录及 SQLite，HTTP 走本机 aiohttp TestServer。迁移与中断在指定写入点注入，硬件断电和第二卷见 D-09。

| 用例 | 实际入口与正式断言 | 回归入口 |
| --- | --- | --- |
| CASE-10 / R-01 · FR-02.4～6 / D-15 | 在完整迁移提交后暂停收尾，分别模拟旧根和目标文件均已缺失、目标同尺寸内容不符。使用同一操作 ID 重试，均保持 `committed` / `SOURCE_CLEANUP_PENDING`，待核验键留在回执，目录登记仍指目标。目标内容恢复后重试，才以 `cleared=1` 和空待办结束。 | `tests/backend/test_storage_review.py::test_r01_cleanup_verifies_target_before_reporting_cleared` |
| CASE-11 / R-02 · FR-05.3 / D-26 | 直接移除正常 Workspace 中一个已登记文件。复检和快照报告 `partial`、数量和相对键，仍可读其它素材并写入新 copy；补回后复检为 `online`。 | `tests/backend/test_storage_review.py::test_r02_validate_reports_registered_files_that_are_missing` |
| CASE-12 / R-03 · FR-06.4 / D-24 | 在目标已发布、旧根标记已写、catalog 尚未写入时注入中断。保留两份文件和旧根 catalog，普通入口恢复旧根。另注入回退刚提交、标记尚未清除的中断，确认能按原入口恢复。已有成功迁移和回退回归继续覆盖新根自动启动、旧根防写及新根开始写入后禁止直接回退。 | `tests/backend/test_storage_review.py::test_r03_offline_move_crash_before_catalog_update_stays_recoverable`；`tests/backend/test_storage.py` 的整库搬家用例 |
| CASE-13 / R-04 · FR-02.2 / FR-06.1 | 共用校验拒绝缺件、工作区身份不符、脏暂存、活动作业和非空目标，回执含受影响对象。后端同一夹具比较 `plan` 与 `move` 的错误码、详情，确认没有激活或创建目标。HTTP 验证本机运行中可做预检，返回结构化错误，修正夹具后正常返回计划。 | `tests/backend/test_storage_review.py::test_r04_data_root_preflight_reports_missing_registered_files`；`tests/integration/test_storage_api.py::test_http_data_root_preflight_reports_move_blockers` |
| CASE-14 / R-05 · FR-05.4 | 以两个已登记工作区模拟活动按量迁移。目标解绑返回 423 `STORAGE_BUSY`，快照仍有目标且为 `migrating`。作业终结后通过同一 DELETE 完成登记清理，回读快照并验证目录和标记保留。 | `tests/backend/test_storage_review.py::test_r05_remove_blocks_the_target_of_an_active_migration`；`tests/integration/test_storage_api.py::test_http_active_migration_target_cannot_be_removed` |

隔离样本在每条测试各自的 `tmp_path` 下构造。HTTP 的新增测试工作区以 DELETE 解除登记并回读，其余临时实例在 runtime 关闭后交给 pytest 清理。命令和实测状态见 [TEST REPORT](06_TEST_REPORT.md#v13-修复回归--2026-11-21)。CASE-15～22 及其余宿主、组件缺口保留。

独立运行 `frontend-vue-v1596-local-2026-11-21` 的 03-A、03-C 提供 Storage 的宿主迁移、模式、Cache 和过期修订/异常反馈证据，03-B 为同 Settings/存储设置依赖下的预览回归。真实宿主清理用空 Cache，第二卷用例跳过。这些是迁移专题报告的结果，本轮未重跑。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

## 环境与执行顺序

1. pytest 用 `tmp_path` 新 Data Root 和多工作区，造小的可校验文件，关闭操作线程后交由临时目录清理。错误注入用 monkeypatch，允许在隔离环境模拟磁盘容量、权限、数据库提交中断。
2. aiohttp 用 `TestClient/TestServer` 承接真实路由，隔离 ComfyUI 依赖。Vue Vitest/Playwright 组件测试以 API 和宿主方法替身为主，独立测操作、修订和渲染。
3. 集中跑 `uv run pytest tests/backend/test_storage.py tests/integration/test_storage_api.py -q -ra` 和 `pnpm -C frontend test`。真实宿主独立跑 `pnpm -C frontend test:storage-host`，用 Playwright Chromium 与目标 ComfyUI 0.46.0/Frontend 1.59.6，设置回环 `COMFYUI_TEST_URL`、`ASTROPHOTO_TEST_STORAGE_ROOT`，让 `ASTROPHOTO_HOME` 指向该目录下的 astrophoto，显式开本机存储。脚本随机命名创建文件、工作区与 Cache，运行后关闭浏览器，保留证据后结束隔离宿主并清理测试根。真实双卷由 pytest 的 `ASTROPHOTO_TEST_SECOND_VOLUME` 配置且需与源确为不同卷，宿主脚本默认同测试根，不能据其通过认定第二卷已验证。未具备第二卷记录条件跳过或 BLOCKED。

## 用例与已知覆盖

| CASE / 需求与风险 | 前置、操作及应观察到的结果 | 已有入口与缺口 |
| --- | --- | --- |
| CASE-01 · FR-01 · 高 | 临时空根走宿主加载两次，检查 manifest、默认 Workspace、格式设置与 DB 实例 ID 一致，有效 WAL/FK；分别用坏设置、未知根、旧 schema 或禁用 WAL 启动，保留原文件，状态路由可读且无假就绪。 | `test_storage.py` 的 `test_first_start_and_reentry`、`test_bootstrap_interrupted_after_database_commit`、`test_multi_process_bootstrap`、`test_legacy_dev_schema_is_preserved`、`test_explicit_wal_failure_has_no_fake_ready`；`test_storage_api.py:test_invalid_storage_config_preserves_status_route`。宿主脚本覆盖正常状态，不覆盖真实异常页。 |
| CASE-02 · FR-02 · 高 | 新建 A/B，保存 B 为默认并核对 A 文件留原地。对空目标迁移，核对同 ID 新路径和 SHA-256。提交且验证后，已搬走的旧副本自动清理；失败或取消发生在提交前时保留原登记和源。测试未迁移文件、外部原件和意外出现的未知项不被清理。 | 现行实现已按 D-15 清源；断言位置见 v1.2 段、`test_migration_recovers_around_database_switch` 与 `test_committed_workspace_cleanup_retries_without_changing_authority`。原"保留源"表述属历史实现。容量预检见 CASE-07A/B。 |
| CASE-03 · FR-03 · 高 | 已拥有条目放空闲、加锁及陌生样本并留输出文件；先取消确认，再同源确认；只有空闲且拥有条目删，回执与磁盘相符。切换 Cache、比较旧目录；过期修订、跨源或代理请求被拒绝，控件保留服务端值并可刷新。 | `test_cache_owner_entries_only_with_live_lease`、`test_http_storage_import_and_access_boundary`、`StorageSettings.test.ts` 测模式冲突、Cache 确认和草稿恢复；宿主脚本验证真实确认、回执、设置在刷新后持久。真实 ACL、清理中途失败的 UI 回执、缓存表单与 API 不同下界的边界测试待补。 |
| CASE-04 · FR-04、FR-02 · 高 | 以可控 checkpoint 暂停一笔作业；使用同键同输入与同键异输入分别请求，核对 ID 不变或冲突。模拟发布前/根切换后中断，重建 runtime 查询同 ID；在可取消阶段申请取消，读标志并核对终态和原根，已提交段应继续收尾。故障后复查已存目标、markers 与回执。 | `test_migration_recovers_around_database_switch` 验证 DB 切换点，`test_migration_verification_error_keeps_source` 验证故障。当前 Vue 正常迁移轮询已有组件和宿主脚本，真实刷新时对多笔操作重选、并发取消与 UI 故障重试待补。 |
| CASE-05 · FR-05、FR-02 · 高 | 登记两个测试根，移走一个，保留其标记放到新路径；原行离线/身份不符；错标记被拒，合法重绑后同 ID、相对键可读；默认、有资产或活动操作的根不能解除，空闲非默认解除后目录仍存在。 | `test_multiple_workspaces_default_disable_and_offline_relocation`、`test_http_storage_import_and_access_boundary`；后者验证移除登记并保留目录。真实盘符重映射、禁用但仍有原标记的 UI 提示、占用拒绝的端到端分支待补。 |
| CASE-06 · FR-01～05 · 高 | 同一实例登记设备与组合、外部 reference、一份 A 中的 copy 和一份 Siril 正式输出。切 B 为默认，新 copy 和正式输出落 B；旧资产仍读 A。让 A 离线再重绑，设备与组合仍可查询，A 上的受管资产恢复原 ID 与摘要；reference 仍指外部原件。若 B 离线，显式指定可用目标的 copy 可用，默认 copy 与正式 Siril 应反馈不可写且不在替代位置生成结果。清理空闲候选缓存后，正式输出继续可读。 | 现有分项入口覆盖导入、设备 HTTP、FITS/API 和真实 Siril 操作。组合场景与错误后的磁盘断言待补，按 Q-02 确认阈值。 |

## 故障与恢复的判定点

| 注入点 | 必须检查的观测 | 现有证据或缺口 |
| --- | --- | --- |
| 首启配置或数据库失败 | 比较故障前后的用户文件摘要；Core 状态可读，拒绝初始化，禁止自动重建替代库。已登记的默认目录离线重启仍为同一 ID。 | CASE-01 有故障测试，离线状态下真实宿主重启需单独验证。 |
| 迁移排队、复制、校验或提交前 | 记录操作 ID、原目录和请求的目标路径。空间不足、源变化或摘要不一致均不得切换登记。取消请求与终态分别检查，核对活动作业是否可重试。 | CASE-02/04 已有源保留和切换点注入。现有导入取消、实际进程退出测试针对 import，独立 migration 对应分支待补。 |
| 数据库事务提交后、清理期间或回执收尾前 | 重启前后 operation ID 与工作区 ID 一致，数据库仍指向目标。已清理的项目可安全跳过，剩余项按清单处理，不重新复制。模拟源端拒绝删除时保留新位置可读，回执给出剩余项。 | CASE-04 已有切换点注入；D-15 的自动清源尚待实现和验证。 |
| 原路径卷缺失、另一个卷占了原路径或只读 | 区分 offline、identity_mismatch、read_only。检查 GET 显示、写入拒绝、没有替代写入；身份有效的只读卷允许既有受管读取。恢复后校对实际文件摘要。 | CASE-05 现有隔离重命名证明路径变化，物理拔插/重映射与 ACL 单独记录。 |
| 解除登记、作业或缓存测试结束 | 通过 API 验证可解除项和 guard，解除后检查目录与原始文件仍在；作业回执应保持可查询。临时夹具由测试根收尾，保留将来可定位的回执和日志。 | 现有 API 覆盖移除和目录保留。测试收尾只能处理本次隔离根。 |

## 数据与接口断言

- 每次执行新建隔离根。登记 A、B 和可安全解除的空工作区，准备外部受信源、受管 `objects` 文件、`outputs` 文件和有租约的 Cache。迁移目标用尚未登记的空目录。注入身份不符时用另一个测试工作区的真实标记。每次成功保存实例 ID、默认 ID、工作区行 revision、资产 ID、相对键及源/目标 SHA-256。
- 权限拒绝的快照断言 HTTP 200、`unavailable` 与禁用能力，写入口断言 403。启动失败的存储快照断言 503，与仍可读取的 Core 状态一起记录。同步拒绝分别断言 409（过期 revision、目录身份或幂等冲突）、423（工作区繁忙）及相应错误码。异步迁移一旦已返回 202，后续磁盘空间或校验错误从 operation 回执读取。
- Cache 按删除件数、字节数、租约跳过数、失败数四项对账。重复清理后已删除条目不再累计，外部文件、正式输出和仍持租约的数据做磁盘反查。当前真实宿主空 Cache 结果只覆盖确认与回执界面。

## v0.5 增量测试规格

| 用例 | 步骤与断言 | 适用状态 |
| --- | --- | --- |
| CASE-01 补充 · FR-01 | 对正常运行账号比较 `Path.home()`、`USERPROFILE` 与 AstroPhoto 默认路径。对带空格/中文、其他盘、缺用户环境和无写权限的运行方式复核绝对路径或诊断。显式覆盖用当前账号目录下的隔离子目录，首次初始化与关闭后再次初始化，检查同一 ID。 | 本机默认解析和隔离初始化已做定向验证。其他启动方式、完整宿主 UI 待验。 |
| CASE-07 · FR-06 | 在同一实例登记设备、组合、引用文件、根内与根外工作区和正式输出。停机搬到空目标，检查数据库一致性、根内路径调整、根外路径与标识保持。目标启动或校验失败时用旧根启动；对照实例 ID、资产 ID 和摘要。空间不足和非空目标应阻止切换。 | 预计场景；整库搬家待实现与评审。 |
| CASE-08 · FR-07 | 取可分享的真实 FITS 放入受信源目录，通过复制导入 API 指向默认 Local。核对原件、副本、资产 ID、目标位置和摘要，重开后回读；迁移工作区后同 ID 经新目录读取。权限拒绝、空间不足与中断均检查原件。 | API 已有测试入口；本次真实 FITS 全链路与用户入口未运行。 |

## 边界审查与接续

现有 CASE-01～08 继续使用。下列增量来自 PRD 的源码审查，本段保留 v0.8 历史，当前基线采用 v1.1 验收规格。

### v0.8 验收覆盖变化

- CASE-01/03 · 在一个写宿主、可开两个浏览器窗口的场景验证默认本地写入、显式改址和格式版本。正式支持旧版升级另补受支持样本；可丢弃开发测试库无需迁移。
- CASE-02/04/05/07 · 仅用同卷独立目录模拟搬家和盘符重绑。核对整库/部分入口、预检、进度和最近回执；迁移可恢复。跨卷、真实拔插和重映射标记延期。
- CASE-03/06/08 · 验证重启前后预览与导入暂存。正常退出后清理可重建文件及未提交导入，已提交项及正式输出仍可读。强杀后的归属残留应在下次启动回收，导入不续跑。旧的导入恢复测试只代表 v0.7 实现，需按新契约改写。
- FR-08 · 用小夹具与故障注入覆盖每盘配额、同盘目录竞争和写入目标固定。机上不跑大批量或大文件压力测试，仅记录实际覆盖的规模。v1.0 已确认的行为见 CASE-07 和 CASE-09。

### 边界索引

| 验收切片 | 测试观察与归属 |
| --- | --- |
| 干净安装到首次真实导入 | CASE-01、03、08。区分初始化、动作能力、写入权限与来源授权，分别验证合法本机、权限拒绝和部分可用。D-06、D-10 与 Q-10。 |
| 双进程、读写冲突与路径身份 | CASE-01、02、04～06。核对读写者、作业状态、默认值与实际目录。同卷模拟同标记克隆和路径变更，真实跨卷延期。D-06、D-09、D-10、D-13。 |
| 工作区迁移、整库搬家与回切 | CASE-02、04、07。采集旧根和新根的 ID、登记与摘要。工作区验证自动清源；整库仍按 D-08 核对切换与回退。D-06、D-08、D-11、D-13、D-15 与 Q-35。 |
| 时点、队列和不确定提交 | CASE-04、06、08。核对重复手势、请求响应丢失、模拟受理后掉盘、等待与终态、只重试部分失败项。D-06、D-09、D-11～D-13。 |
| 每盘配额与会话临时文件 | CASE-03、06、FR-08。用模拟额度核对实际占用、超限与选盘，检查活动预览、会话暂存和正式输出的清理边界。D-09、D-12、D-14 与 Q-33、Q-34。 |
| 既有图与资产生命周期 | CASE-05～08。打开同一份保存的工作流，比较资产 ID 与绝对路径在迁移前后实际读取位置；核对解绑与正式数据占用。D-12、D-13。 |

测试报告逐用例记录条目、磁盘状态、实际命令、退出码和跳过理由。 [PRD 边界矩阵](01_PRD.md#8-验收矩阵与证据边界) · [后台](../../../tests/backend/test_storage.py) · [HTTP](../../../tests/integration/test_storage_api.py) · [设备 HTTP](../../../tests/integration/test_equipment_api.py) · [Siril 后台](../../../tests/backend/test_siril.py) · [Vue 组件](../../../frontend/tests/components/StorageSettings.test.ts) · [真实宿主脚本](../../../frontend/tests/host/storage-host.mjs)

## v1.1 验收规格

取证入口为 tests/backend/test_storage.py、tests/backend/test_siril.py、tests/integration/test_storage_api.py 与 frontend/tests/components/StorageSettings.test.ts。真实 ComfyUI 0.46.0 使用独立账号目录、Data Root、主机输入/输出/temp；正常退出用非空 Cache，退出后重启前读磁盘。工作区有 API 时在同用例内解除登记并回读，受管样本和 SQLite 文件留在隔离测试根回收。

现有 CASE-01～08 ID 保留，新增 CASE-09 对应 FR-08。以下条目具有可观察断言，每项以当前 PRD 为目标。上文历史入口仍可作复用定位，和本节不一致的预期按本节改写。测试层次 U 为纯服务或离线规则，I 为真实 aiohttp/SQLite/文件系统，H 为隔离宿主/浏览器。v1.1 编写时业务用例均为 NOT_RUN；v1.2 已执行其中的 I 层子集，结果见报告。

| 用例 | 层 | 输入、动作与断言 |
| --- | --- | --- |
| CASE-01 · FR-01 | I/H | 测试根做正常首启、同根重启和显式打开，比较实例、Local、数据库版本及 fixture 摘要；另根显式新建得到新 ID。中文/空格、错误配置、坏标记、未知非空目录、不受支持的 schema、初始化中断各比较退出/诊断与源数据。起两个受隔离进程尝试同实例写入，第二个被拒；同宿主两窗口均可查询。目标宿主状态在初始化失败时仍可读。 |
| CASE-02 · FR-02、D-15 | I/H | 登记 A/B、改默认后路径与数据保持。完整迁移预检中注入冲突、未知文件、脏 staging、缺失资产、容量不足，断言无确认或执行。正常同卷预检→确认→查回执→用原 Workspace ID/Asset ID 读取目标 SHA-256。提交后按清单核对旧受管副本消失，其它目录、未选文件与原件保持。暂停迁移后验证参与 Workspace 的读写受控，其它 Workspace 可用。 |
| CASE-03 · FR-03、D-12、D-16 | I/H | 以两个旧 env 均未设置启动受信回环宿主，验证受信前端可用设置、文件选择能力，且未扩大远程、跨源、异常 Host/转发头或 MCP 的权限。单独注入 OS 拒绝、Cache 预算耗尽、只读与离线，观察动作级能力不相互拖累；设置过期修订阻断并保留草稿。正常关闭前写入可重建预览、未提交导入暂存、已提交资产、正式 FITS 与未知样本；加上失败/中断 Siril 的未提交诊断与中间文件。正常退出后重启前验证受管 Cache 全空，正式 FITS、必要回执、已提交资产及未知文件摘要一致。模拟崩溃后重启，清可证残留，未完成导入不续跑。 |
| CASE-04 · FR-02/04/08 | U/I/H | 并发重复提交同键同体、同键异体和双击，分别断言同 ID、冲突及唯一作业。注入队列等待、部分复制、同尺寸内容变化、校验失败、发布后未提交、SQLite 提交后、清源失败及清源成功后回执丢失。比较提交前后 DB 权威位置、两端哈希、预留余额和剩余清单。分开检查取消请求与取消终态，清源重试不能重复制或回滚。刷新或换窗口按 ID 查询，验证作业忙碌时同时能看到卷离线状态。失败/取消残留单独走显式确认清理。 |
| CASE-05 · FR-05 | I/H | 保持同一标记模拟离线后改址并重绑，核对稳定 Workspace ID/Asset ID。用错误卷替身、复制标记并缺文件、链接、只读和当前仍可用的原路径探测拒绝。错误时原登记不变；只读可读条件下不能写。用 API 解除独立空工作区并确认目录仍在；默认、有引用、有活动任务各阻断。 |
| CASE-06 · 联动 FR-01～05/07/08 | I/H | 建设备和光路、真实 FITS reference/copy、Siril 正式输出和候选。切换默认后旧资源读原处，已受理的 copy 用原目标，随后开始的 Siril 用新默认。任一目标不足时不输出到替代卷。重绑后设备/光路仍可查询，FITS 和关联回执继续可读，清理候选不会触碰正式输出。保存的资产 ID 与工作流手填绝对路径各走一遍。 |
| CASE-07A · FR-06 整库 | I/H | 含根内/根外 Workspace、设备/光路、引用、copy、正式 FITS 与未提交暂存的隔离实例。停止宿主后搬到空目标，核对 SQLite 完整性、根内绝对登记重映射、根外位置与 ID、受管摘要；旧根保留且无法并行写入。拒绝仍运行宿主、目标已占用、空间不足和坏校验；分别验证新根未写时可回旧根、已开始写或不明时禁止直接激活旧根。 |
| CASE-07B · FR-02/06、D-19～21 | U/I | 计划单测用小整数 bytes 表示大小关系，百分比与 GB 另测换算和舍入。计入登记的受管副本/正式产物及必要侧件，排除外部 reference、会话临时和其它 Workspace；共享侧件核去重。等大组稳定 ID 先入选，重排输入不改变结果。验证目标恰好命中、百分比 100、0、负、溢出、非法小数和空候选边界。 |
| CASE-07C · D-22 | U/I/H | 目标逻辑 10、候选 100/8/4 的预检给 8（差 2）与 12（超 2），不预选超量。分别确认两种方案，逐项查询权威/摘要及已清源集合；变化后用旧计划必须被拒。只有 100 且目标容不下时没有可执行选项；目标只能容纳 8 时只允许接受不足。额外组等差按稳定 ID，请求 2 GB 且只有 3/5/9 GB 组时，仅展示最小可行超额 3 GB 并要求明确确认。空清单不可提交；无可行组时给出原因。确认结果篡改或跳过预检不得执行按量迁移。 |
| CASE-07D · FR-02/04/06 | I/H | 多组计划中模拟首组成功后取消、后组复制失败或提交失败，核对已提交组继续读目标、原副本清除或列入遗留，未提交组源权威、外部 reference 不动。断点重启和重复确认均保持同作业及固定清单。模拟同卷复制临时空间不足时阻断，正常同卷回执不宣称释放磁盘物理空间。 |
| CASE-08 · FR-07、D-16 | I/H | 选可分享真实 FITS 的本次隔离副本，从两个未预登记的本机目录做 reference 与 copy，对比数据、路径、Asset ID、SHA-256 及重启后的回读。用不可读、受管目录、路径链接或中途变化模拟拒绝，验证原件摘要不变。对 copy 的已提交组、失败组及待回收暂存分别断言；素材用户入口留在素材专题验收。 |
| CASE-09 · FR-08、D-17/18 | U/I/H | 两个同卷 Workspace 共用额度 100 个小测试单位，受管已用 70、A 新任务预留 20 时 B 的 20 必须被拒，账本余 10。释放 A 后 B 再操作成功；提交时已用与预留逐项转换，重启及取消反查。分别注入额度不足和系统空间不足，验证不同原因。受管理 + 正式输出计费，外部 reference 和会话临时不计但仍消耗物理空间；同卷迁移不双计已登记用量却必须预算复制高峰。并发 copy/Siril/迁移，并检查在线替代目标不会被自动使用；手动切换只影响未锁目标的新作业。两卷身份分离用注入覆盖，真实硬件延期。 |

### 测试脚本收尾、运行门与证据

1. 每个 API 测试的 fixture/teardown 用本次运行实际取得的 ID 闭环。先等待活动作业终态或用 API 取消并确认；对存在删除接口的测试记录，再在同一测试脚本通过 API 删除并回读列表或详情确认消失。删除工作区前处理测试资产引用，并以安全默认项承接默认选择；工作区解除后单独断言文件仍存在。素材当前没有公开资产删除接口，仅使用已有取消/解绑等接口并回读；实施后根据实际新增能力更新此步骤。对没有删除 API 的迁移回执、根和临时目录，收集回执并停止隔离宿主后，由测试脚本仅处置本次创建且可证明归属的夹具。失败同样记录 teardown，并保留用例需要的证据。排除真实 Data Root、未知文件和用户原件。
2. 功能完成并回写 DEV 后，针对实际路由、DB 和 Vue 组件核对精确断言，再写正式测试脚本、集中执行服务/HTTP、前端和目标宿主命令。记录相关 HEAD 与源码 diff、宿主、Python 和前端版本、真实 FITS 的来源/摘要、ZIP 或日志、命令、通过/失败/条件跳过数与清理结果。历史命令中的两个旧 env 只用于复现旧实现；改造后的可信本机新验收明确去掉这两个前置。
3. Windows 0.46.0/1.59.6 小文件同卷属于本轮验收。真实跨卷、硬件拔插/重映射、ACL 矩阵、断电、其他操作系统及大型压力测试延期；需硬件的测试不满足条件时记录阻塞或跳过，禁止用模拟替代其证据。需改架构时更新 TECH/DEV 并重新核对受影响 CASE。

## Pi 评审补充 · 旧断言迁移与新增检查

| 现有测试或前提 | 原覆盖 | 实现后替代断言 |
| --- | --- | --- |
| `test_multi_process_bootstrap`（CASE-01） | 两进程可顺序通过启动临界区。 | 保留初始化一致性证据；另让第一宿主持续持锁，再启动第二宿主，断言无法同时写入，第一宿主退出后可恢复。包括同实例不同根，普通多窗口保持可用。 |
| `test_migration_recovers_around_database_switch`（CASE-02/04/07D） | 提交后保留受管旧源。 | 提交前保留源；提交后只清已提交的文件与可证明必要侧件。目标可读，未知项与外部原件保留；部分清理失败只重试剩余项。按量场景另查未提交组。 |
| `test_process_exit_during_copy_resumes_own_staging`（CASE-03/08） | 重启续跑未完成导入。 | 改为旧会话未完成项终止且清理归属明确的暂存；已登记项仍可读。持久迁移重启恢复使用独立用例。 |
| 存储开关和导入根 fixture（CASE-03/08） | 依赖两个旧环境变量为受信功能启用。 | 干净回环 fixture 不设置这两个变量，使用 `test_storage_api.py` 现有 TestServer、Origin/转发头检查方法，分别断言受信、跨源和实际 OS 路径失败。 |
| `test_migration_actual_cross_volume`、`test_reference_on_distinct_windows_volumes` | 有条件运行的现有用例。 | 本轮未在第二卷执行。保留条件用例与历史结果；真实第二卷、卷拔插、ACL、断电仍需独立环境。 |

补充验收口径：

- CASE-02/04 固化 `RECOVERY_REQUIRED` 等阻断条件、面向用户的下一步、收到同键返回原 ID、明确新建返回不同 ID、提交后的取消边界，以及租约冲突超出等待预算后可恢复的状态。对条件仍待定的退避时长只记录实现后的实际配置。
- CASE-03 独立记录正常退出与下次启动回收结果。前者若无已验证的宿主挂点则标为 BLOCKED；后者可独立执行。两条都验证正式产物及用户原件保全。
- CASE-05 核对解除后 marker 和文件都保留；重登记不是重绑，覆盖同实例、旧 ID 未登记与非空布局。用克隆标记及缺失/尺寸差异检查卷证据。同一合法位置少两个文件时，确认后可重绑；其余 98 个可读，缺件 ID 保留，仅依赖缺件的操作报错，正常新增有条件可用，补齐复检后恢复。
- CASE-07A 核对实际启动入口和回退，包含旧根仍完整却被写守卫阻止、新根配置失效和写入状态不明。CASE-07B/C 核对全部已登记分母、缺文件阻断、最小可行超额和空基础选项，空基础只有显式超额一种可执行方案。整库搬家用原启动入口和原配置打开新根，验证新写入只在新根。CASE-07D 验证正式侧件成组、未知项保留、失败诊断不计入按量基数并按 CASE-03 在退出时清空。
- CASE-09 覆盖 Cache GiB 与卷配额 GB 各自精确换算及独立记账；实际物理空闲空间允许受两者影响。用模拟 300 GB 物理空闲、无配额的卷受理 40 GB 写入；校验并发预留和实际不足。设为 30 GB 后保留已有 40 GB 数据，阻止新增。

## v1.2 评审增量 · 2026-11-21

本节保留 2026-11-21 [代码评审](references/code-review.md) 时的基线、探针和遗留项。CASE-10～14 的现行断言、HTTP 覆盖和已对齐的 R-ID 使用 [v1.3 正式规格](#v13-正式回归规格--2026-11-21)。

### 执行门与命令

1. 后端全量：`uv run --no-sync pytest tests -q`（当前 111 passed、6 skipped、5 xfailed）。
2. 存储子集：`uv run --no-sync pytest tests/backend/test_storage.py tests/backend/test_siril.py tests/integration/test_storage_api.py -q -ra`（本机 58 passed、5 skipped；Siril CLI 与第二卷未配置）。
3. 评审探针：`uv run --no-sync pytest tests/backend/test_storage_review.py -q`（5 xfailed）；确认失败点用 `--runxfail --tb=line`，必须落在用例最后一条断言。
4. 前端：有 `pnpm` 时用 `pnpm -C frontend typecheck`、`lint`、`test`。当前环境无 `pnpm`，改用 `frontend/node_modules/.bin/vue-tsc --noEmit`、`frontend/node_modules/.bin/eslint --config frontend/eslint.config.mjs <目标>` 与 `frontend/node_modules/.bin/vitest run <文件>`；证据需注明实际使用的入口。
5. 每条新用例记录：CASE 与 R-ID、命令、退出码、机器/宿主/Python/Node 版本、夹具摘要（实例 ID、Workspace ID、Asset ID、相对键、源/目标 SHA-256）、teardown 是否用 API 完成并回读。

### 新增与改写用例

| 用例 | 层 | 触发、动作与必须观察到的结果 | 现有入口 | 状态 |
| --- | --- | --- | --- | --- |
| CASE-10 · R-01 · FR-02.4/D-15 | U/I | 完整迁移提交（`phase=committed`）后删除旧根，并删除目标端该受管文件，再执行收尾：不得返回 `completed`+`cleanup_remaining=[]`+`cleared=N`；必须把该键留在 `cleanup_remaining` 并保持 `committed`/`SOURCE_CLEANUP_PENDING`，或先在目标完成尺寸/摘要核验。反向断言：目标文件存在时照常清理且回执计数与磁盘一致。 | `test_storage_review.py::test_r01_cleanup_verifies_target_before_reporting_cleared`；主分支由 `test_committed_workspace_cleanup_retries_without_changing_authority` 覆盖 | xfail（缺陷） |
| CASE-11 · R-02 · FR-05.3 | I/H | 导入 copy 后直接删除一个受管文件（不经降级重绑）：`POST /storage/locations/{id}/validate` 与 `GET /storage` 均须给出 `partial`、`missing_count=1` 与缺失键；可用资产仍可读、正常新增仍可用；补回文件再次 validate 恢复 `online`。 | `test_r02_validate_reports_registered_files_that_are_missing`；已 partial 路径见 `test_rebind_partial_keeps_available_assets_and_write_access` | xfail（缺陷）；H 层待补 |
| CASE-12 · R-03 · FR-06.4/D-24 | U/I/H | 在“旧根写入快照标记”与“catalog 切换到目标”之间中断：必须存在至少一条受支持路径（`open`、`rollback` 或新增 `recover`）使旧根可启动或目标被显式激活；不得只剩手工删标记。若改为先写 catalog，则构造对应中断点，断言旧根可启动且目标未被激活。 | `test_r05_offline_move_crash_before_catalog_update_stays_recoverable` | xfail（缺陷） |
| CASE-13 · R-04 · FR-02.2/FR-06.1 | U/I | 缺失受管文件、工作区标记不匹配、脏 `.staging`、活动作业、非空目标：`POST /storage/data-root/preflight` 必须失败并返回阻断明细；其拒绝集合必须与 `data_root move` 一致，不允许“预检通过、执行必失败”。 | `test_r04_data_root_preflight_reports_missing_registered_files` | xfail（缺陷） |
| CASE-14 · R-05 · FR-05.4 | I | 活动按量迁移 A→B 时 `DELETE /storage/locations/{B}` → 423 `STORAGE_BUSY`；`GET /storage` 对 B 仍显示 `migrating`；迁移终态后可解除且目录保留。 | `test_r03_remove_blocks_the_target_of_an_active_migration` | xfail（缺陷）；HTTP 版待补 |
| CASE-15 · R-06 · FR-04.4/FR-03.5 | I/H | 大迁移进行中调用 `StorageRuntime.close()`：必须在约定上限内返回（记录实测秒数），迁移保留 checkpoint（`copying`/`publishing`/`committed`），下次启动继续且不重复复制；返回前 Cache 已清空。 | 待补（需可注入的慢复制/慢哈希） | 待补 |
| CASE-16 · R-07 · FR-03.2 | I/H | 默认工作区离线、只读、配额不足与未授权四种情形下，`GET /storage` 的 `capabilities` 必须按 browse/reference/copy/preview/formal_output 分别给出可用性与原因；UI 只禁用受影响动作，不整页禁用。 | 待补（需先改 TECH/DEV 契约） | 待补 |
| CASE-17 · R-08/R-12 · FR-02.2/FR-04.2 | I | `WORKSPACE_FILES_MISSING`、`UNKNOWN_WORKSPACE_CONTENT`、`TARGET_NOT_EMPTY` 返回 `details`（缺失键/未知项 ≤100 条）；预检返回受影响活动作业；同一 `request_id` 重复 `POST /storage/locations` 返回同一 workspace（或明确拒绝且不产生半成品登记）。 | 待补 | 待补 |
| CASE-18 · R-09 · D-27 | I | 构造 `processing/processor-xxxxxxxx/`（`owner.json` + 中间文件）：正常 `close()` 后消失；强杀后下次启动回收；非本实例或未知样本保留。 | `test_processing_scratch_recovers_only_owned_producer_files...` 覆盖“生产者再次运行”分支 | 退出/启动分支待补 |
| CASE-19 · R-10 · D-17/D-25 | I | 源卷设配额后整库搬家到另一卷：断言新卷配额状态与回执表述（按 PRD 补充决策）；不得静默沿用旧卷键或静默取消配额。 | 待补 | 待补 |
| CASE-20 · R-11 · D-24 | I/H | `roots.json` 写坏：启动返回明确的 `RECOVERY_REQUIRED` 与修复指引，Core status 可读，Data Root 文件不被改动；修复 catalog 后正常启动。 | 待补 | 待补 |
| CASE-21 · R-13 · D-19～22 | U | 源 Workspace 只含 0 字节登记文件：按量预检必须显式包含该组或报告“不可迁移”，不得在 `groups` 展示却从所有选项静默遗漏。 | 待补 | 待补 |
| CASE-22 · R-14 · FR-03.5/D-27 | I | 注入 `library.record_outputs` 失败：已发布正式 FITS 与 manifest 必须保留并可恢复登记，Cache 诊断不影响正式文件；不得删除已完成产物。 | 待补（属 Siril/素材专题联动） | 待补 |

### HTTP 层与组件层覆盖缺口

以下为仍需补的 HTTP 断言。CASE-13 和 CASE-14 已移入 v1.3 正式规格。

- `POST /storage/migrations/preflight`（完整与按量两种请求体、`reason` 分支、`same_volume`）。
- `POST /storage/migrations`（202 + 未知 `plan_id` → 409 `MIGRATION_PLAN_STALE`；同键同体返回同 ID；同键异体 → 409 `IDEMPOTENCY_CONFLICT`）。
- `GET /storage/migrations/{id}`、`.../cancel`、`.../retry`、`.../discard-target`（含 `confirm` 预览与二次确认、目标保留分支）。
- `PATCH /storage/locations/{id}/volume`（配额写入、`expected_revision` 冲突、`partial`/`read_only` 工作区选点）。
- `POST /storage/locations/{id}/relocate`（`WORKSPACE_REBIND_PARTIAL` + `details.missing` → `allow_partial=true` 二次请求；错误标记 409）。
- `POST /storage/cache/configure`、`POST /storage/cache/clear`（`session_managed` 时路径只读、四项计数）。

组件层缺口（`frontend/tests/components/StorageSettings.test.ts` 现有 7 项只覆盖模式修订冲突、完整迁移预检+确认、Cache 清理、Cache 修订冲突、预览设置）：新增工作区、改名/启停/设默认/解除、降级重绑二次确认与缺件清单、按量预检→`exact`/`under`/`over` 三选项→确认、卷配额编辑、整库搬家预检与命令展示、`discard-target` 预览+确认、`retry`/`cancel`/`committed + SOURCE_CLEANUP_PENDING` 渲染、刷新后按 operation ID 找回。

### 其余问题的溯源与收口条件

| 评审项 | 用例 | 测试入口 | 当前状态 |
| --- | --- | --- | --- |
| R-06 退出阻塞 | CASE-15 | 待补 | 未覆盖 |
| R-07 动作级能力 | CASE-16 | 待补 | 未覆盖 |
| R-08 阻断明细 | CASE-17 | 待补 | 未覆盖 |
| R-09 processing 清理 | CASE-18 | 部分 | 未覆盖分支 |
| R-10 配额随卷 | CASE-19 | 待补 | 未覆盖（待 PRD 决策） |
| R-11 catalog 单点 | CASE-20 | 待补 | 未覆盖 |
| R-12 登记幂等 | CASE-17 | 待补 | 未覆盖 |
| R-13 0 字节组 | CASE-21 | 待补 | 未覆盖 |
| R-14 Siril 产物保护 | CASE-22 | 待补 | 未覆盖 |
| R-15 取消检查 | CASE-04 补充 | 待补 | 低风险 |

关闭本 Feature 前至少在隔离宿主验证 CASE-15 的退出耗时和恢复，重跑 `frontend/tests/host/storage-host.mjs` 并记录证据。真实双卷、拔插、ACL、断电与压力仍按 D-09 延期。
