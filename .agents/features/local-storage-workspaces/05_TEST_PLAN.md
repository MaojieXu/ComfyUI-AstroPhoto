# 本地存储与工作区 · 测试计划

**版本** v0.4 · 2026-11-21 · 模式 B（已实现切片静态对照），开放产品行为保留预计场景。本轮只核对现有代码和测试，所有 CASE 的当前运行均为 NOT_RUN。基线见[索引](00_FEATURE_INDEX.md)，规则来源为 [PRD](01_PRD.md)，实际入口与 guard 来源为 [DEV](04_DEV.md)。历史记录见[测试报告](06_TEST_REPORT.md)。旧 React 脚本在 HEAD，可用 `git show 4c0cf4d:frontend/ui/storage-host.mjs` 查回。

独立运行 `frontend-vue-v1596-local-2026-11-21` 的 03-A、03-C 提供 Storage 的宿主迁移、模式、Cache 和过期修订/异常反馈证据，03-B 为同 Settings/存储设置依赖下的预览回归。真实宿主清理用空 Cache，第二卷用例跳过。这些是迁移专题报告的结果，本轮未重跑。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

## 环境与执行顺序

1. pytest 用 `tmp_path` 新 Data Root 和多工作区，造小的可校验文件，关闭操作线程后交由临时目录清理。错误注入用 monkeypatch，允许在隔离环境模拟磁盘容量、权限、数据库提交中断。
2. aiohttp 用 `TestClient/TestServer` 承接真实路由，隔离 ComfyUI 依赖。Vue Vitest/Playwright 组件测试以 API 和宿主方法替身为主，独立测操作、修订和渲染。
3. 集中跑 `uv run pytest tests/backend/test_storage.py tests/integration/test_storage_api.py -q -ra` 和 `pnpm -C frontend test`。真实宿主独立跑 `pnpm -C frontend test:storage-host`，用 Playwright Chromium 与目标 ComfyUI 0.46.0/Frontend 1.59.6，设置回环 `COMFYUI_TEST_URL`、`ASTROPHOTO_TEST_STORAGE_ROOT`，让 `ASTROPHOTO_HOME` 指向该目录下的 astrophoto，显式开本机存储。脚本随机命名创建文件、工作区与 Cache，运行后关闭浏览器，保留证据后结束隔离宿主并清理测试根。真实双卷由 pytest 的 `ASTROPHOTO_TEST_SECOND_VOLUME` 配置且需与源确为不同卷，宿主脚本默认同测试根，不能据其通过认定第二卷已验证。未具备第二卷记录条件跳过或 BLOCKED。

## 用例与已知覆盖

| CASE / 需求与风险 | 前置、操作及应观察到的结果 | 已有入口与缺口 |
| --- | --- | --- |
| CASE-01 · FR-01 · 高 | 临时空根走宿主加载两次，检查 manifest、默认 Workspace、格式设置与 DB 实例 ID 一致，有效 WAL/FK；分别用坏设置、未知根、旧 schema 或禁用 WAL 启动，保留原文件，状态路由可读且无假就绪。 | `test_storage.py` 的 `test_first_start_and_reentry`、`test_bootstrap_interrupted_after_database_commit`、`test_multi_process_bootstrap`、`test_legacy_dev_schema_is_preserved`、`test_explicit_wal_failure_has_no_fake_ready`；`test_storage_api.py:test_invalid_storage_config_preserves_status_route`。宿主脚本覆盖正常状态，不覆盖真实异常页。 |
| CASE-02 · FR-02 · 高 | 新建 A/B，保存 B 为默认并核对 A 文件留原地；对空目标启动迁移，检查 202、进度、同 ID 新 root、SHA-256、源保留。另试重叠/占用目标、容量不足、源变动、校验失败，提交前原登记保留。 | `test_storage.py:test_multiple_workspaces_default_disable_and_offline_relocation/test_migration_actual_cross_volume/test_migration_verification_error_keeps_source`；`StorageSettings.test.ts` 测 prompt、回执与刷新；当前宿主脚本造一份同目录树样本。容量预检摘要属 Q-04。 |
| CASE-03 · FR-03 · 高 | 已拥有条目放空闲、加锁及陌生样本并留输出文件；先取消确认，再同源确认；只有空闲且拥有条目删，回执与磁盘相符。切换 Cache、比较旧目录；过期修订、跨源或代理请求被拒绝，控件保留服务端值并可刷新。 | `test_cache_owner_entries_only_with_live_lease`、`test_http_storage_import_and_access_boundary`、`StorageSettings.test.ts` 测模式冲突、Cache 确认和草稿恢复；宿主脚本验证真实确认、回执、设置在刷新后持久。真实 ACL、清理中途失败的 UI 回执、缓存表单与 API 不同下界的边界测试待补。 |
| CASE-04 · FR-04、FR-02 · 高 | 以可控 checkpoint 暂停一笔作业；使用同键同输入与同键异输入分别请求，核对 ID 不变或冲突。模拟发布前/根切换后中断，重建 runtime 查询同 ID；在可取消阶段申请取消，读标志并核对终态和原根，已提交段应继续收尾。故障后复查已存目标、markers 与回执。 | `test_migration_recovers_around_database_switch` 验证 DB 切换点，`test_migration_verification_error_keeps_source` 验证故障。当前 Vue 正常迁移轮询已有组件和宿主脚本，真实刷新时对多笔操作重选、并发取消与 UI 故障重试待补。 |
| CASE-05 · FR-05、FR-02 · 高 | 登记两个测试根，移走一个，保留其标记放到新路径；原行离线/身份不符；错标记被拒，合法重绑后同 ID、相对键可读；默认、有资产或活动操作的根不能解除，空闲非默认解除后目录仍存在。 | `test_multiple_workspaces_default_disable_and_offline_relocation`、`test_http_storage_import_and_access_boundary`；后者验证移除登记并保留目录。真实盘符重映射、禁用但仍有原标记的 UI 提示、占用拒绝的端到端分支待补。 |
| CASE-06 · FR-01～05 · 高 | 同一实例登记设备与组合、外部 reference、一份 A 中的 copy 和一份 Siril 正式输出。切 B 为默认，新 copy 和正式输出落 B；旧资产仍读 A。让 A 离线再重绑，设备与组合仍可查询，A 上的受管资产恢复原 ID 与摘要；reference 仍指外部原件。若 B 离线，显式指定可用目标的 copy 可用，默认 copy 与正式 Siril 应反馈不可写且不在替代位置生成结果。清理空闲候选缓存后，正式输出继续可读。 | 现有分项入口覆盖导入、设备 HTTP、FITS/API 和真实 Siril 操作。组合场景与错误后的磁盘断言待补，按 Q-02 确认阈值。 |

## 故障与恢复的判定点

| 注入点 | 必须检查的观测 | 现有证据或缺口 |
| --- | --- | --- |
| 首启配置或数据库失败 | 比较故障前后的用户文件摘要；Core 状态可读，拒绝初始化，禁止自动重建替代库。已登记的默认目录离线重启仍为同一 ID。 | CASE-01 有故障测试，离线状态下真实宿主重启需单独验证。 |
| 迁移排队、复制、校验或提交前 | 记录操作 ID、原目录和请求的目标路径。空间不足、源变化或摘要不一致均不得切换登记。取消请求与终态分别检查，核对活动作业是否可重试。 | CASE-02/04 已有源保留和切换点注入。现有导入取消、实际进程退出测试针对 import，独立 migration 对应分支待补。 |
| 数据库事务提交后、回执收尾前 | 重启前后 operation ID 和工作区 ID 一致，数据库仍指向目标，成功收尾后没有作业标记；源文件保持，默认 ID 与已注册资产身份不变。 | CASE-04 已有服务层注入；宿主进程恢复与真实断电分别记录。 |
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

## v0.7 边界审查与接续

现有 CASE-01～08 继续使用。下列增量来自 PRD 的源码审查，涉及产品选项的断言在确认后定稿。

| 验收切片 | 测试观察与归属 |
| --- | --- |
| 干净安装到首次真实导入 | CASE-01、03、08。区分初始化、动作能力、写入权限与来源授权，分别验证合法本机、权限拒绝和部分可用。Q-06、07、10、11。 |
| 双进程、读写冲突与路径身份 | CASE-01、02、04～06。核对读写者、作业状态、当前默认值、真实目录和内容，实测同标记克隆与不同卷。Q-05、08、09、16、17、25、29。 |
| 整库搬家与回切 | CASE-02、04、07。采集旧根和新根的 ID、登记与摘要，区分切换前失败、目标验证后失败与目标已经有新写入。Q-01、04、12～15、18、21、24、30。 |
| 时点、队列和不确定提交 | CASE-04、06、08。核对重复手势、请求响应丢失、已受理后拔盘、等待与终态、只重试部分失败项。Q-02、19、20、26～28。 |
| 实际磁盘占用与缓存变更 | CASE-03、06。比较独立缓存条目、并发处理暂存、旧 Cache、活动预览和正式输出；测磁盘占用和取消响应。Q-22、23、28、32。 |
| 既有图与资产生命周期 | CASE-05～08。打开同一份保存的工作流，比较资产 ID 与绝对路径在迁移前后实际读取位置；核对解绑与正式数据占用。Q-31、32。 |

测试报告逐用例记录条目、磁盘状态、实际命令、退出码和跳过理由。 [PRD 边界矩阵](01_PRD.md#架构评审与产品边界) · [后台](../../../tests/backend/test_storage.py) · [HTTP](../../../tests/integration/test_storage_api.py) · [设备 HTTP](../../../tests/integration/test_equipment_api.py) · [Siril 后台](../../../tests/backend/test_siril.py) · [Vue 组件](../../../frontend/tests/components/StorageSettings.test.ts) · [真实宿主脚本](../../../frontend/tests/host/storage-host.mjs)
