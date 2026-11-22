# 本地存储与工作区 · 开发规格与实现

**版本** v1.3 · 2026-11-21 · R-01～R-05 修复已落地。基线及与 HEAD 的差异见[索引](00_FEATURE_INDEX.md)。下表保留早期实现对照，现行修复以 v1.3 小节为准。

| 规则来源 / 用例 | 文件与符号 | 顺序、拒绝与副作用 |
| --- | --- | --- |
| FR-01 / CASE-01 | `__init__.py:on_load` → `bootstrap.py:host_runtime/initialize_storage_runtime` → `storage/runtime.py:StorageRuntime._initialize` | 宿主加载决定授信并注册路由。根检查 → 锁 → 配置与 manifest → 资产库初始化 → 默认工作区和 Cache → 写初始化完成 → 处理 Bundle 准备 → `Operations.recover`。路径/配置/DB 不合法返回存储诊断；Core status 仍注册，持久库不被重置。 |
| FR-01 / CASE-01 | `storage/initializer.py:check_data_root/load_or_create_manifest/load_or_create_settings`；`database/manager.py:DatabaseManager.initialize/_check_schema` | 拒绝未知占用的根、坏 manifest 或 settings、数据库丢失/身份不符、未知或旧开发 schema、无法使用 WAL。SQLite 开外键和 busy timeout；仅保留首次补齐流程的明确条件。 |
| FR-02、FR-05 / CASE-02、CASE-05 | `storage/locations.py:WorkspaceRegistry.candidate/register/check_status/validate` | 规范化绝对本地路径，检查父目录和防重叠，再 claim 标记、建布局、登记。已有标记只在同实例、空业务布局、ID 未登记时可接续。快照读取身份和空间，显式 validate 在租约内尝试在 .staging 建临时文件，仅在线执行探针。 |
| FR-02、FR-05 / CASE-02、CASE-05 | `WorkspaceRegistry.update/relocate/remove`；`rebind_workspace` | 租约与全局锁；default 用 settings revision 且必须在线，不与改名/启停合并。普通修改用行 revision，默认不能禁用。重绑拒绝原标记可用或目标标记不匹配，成功保持 ID 并递增行 revision。默认、有资产引用、有活动 operation 拒绝解除；成功只删登记。 |
| FR-03 / CASE-03 | `api/security.py:trusted_deployment/direct_local_request/authorize_storage_operation`；`api/storage.py:handler/fields` | 授权先于服务访问和解析。快照 unauthorized 返回不可用，变更 403。授权后解析/限制 JSON 并移到线程；DTO 拒绝缺字段或多余字段并规范化 UUID。 |
| FR-03 / CASE-03 | `storage/runtime.py:update_settings`；`storage/cache.py:configure/clear_owned_cache` | 锁内比较 revision，Cache 路径通用检查，验证/创建实例标记再原子替换设置。清理遍历已知 bucket，逐项验证所有权和独占租约，仅删除匹配维护对象并返回计数；忙碌跳过，I/O 失败计数，切换保留旧缓存。 |
| FR-02、FR-04 / CASE-02、CASE-04 | `storage/migration.py:validate/start/run/_inventory/_copy_and_commit/_complete` | 路径、空目标、可写源和同工作区活动任务在受理前检查；线程租约下盘点 objects/outputs、检查 .staging 和注册键、估算空间。目标授权标记和 .part 暂存、逐项 receipt、校验 SHA-256，再等待最终取消检查，事务切换 root 和 committed；提交后验证目标尺寸、移除本 operation 标记并记 completed。原根数据保留；失败/取消可保留供检查的暂存或已复制文件。 |
| FR-04 / CASE-04 | `storage/operations.py:find/create/status/cancel/retry/recover/run` | 1～128 字符键，kind/key 唯一；同键异体报冲突，最多 16 笔非终态。取消写标志，committed/终态拒绝变更回执；非终态重试清错误并调度。publishing/committed 等关键阶段异常保留可恢复记录，其他拒绝按代码终态失败，进程恢复调度非终态。 |
| FR-01～05 / CASE-01～05 | `frontend/src/api/storage.ts:fetchStorage/mutate/fetchReceipt`；`StoragePage.vue:change/add/migrate`；`OperationProgress.vue:poll` | DTO 校验、异常翻译，成功由快照确认。迁移及回执独立轮询，间隔 800 ms，离开组件清理请求。缓存保存按服务端数值消除已提交草稿。 |
| FR-01、FR-05 / CASE-01、CASE-05 | `storage/locations.py:ensure_default/check_status/require`；`storage/runtime.py:snapshot` | 首启从 manifest 引导 Local，要求工作区在线。实例已初始化后只核查默认 ID 已登记；离线则在快照中降级，不重新创建。require 写入只接受在线，读取额外接受 read_only，其他状态返回相应错误。 |
| FR-02、FR-05 / CASE-06 | `storage/runtime.py:StorageRuntime.__init__`；`assets/service.py` → `storage/manager.py:resolve_managed`；`assets/imports.py:AssetImportService`；`extension/siril/processing.py:formal_run` | 设备与组合直接由同一资产库构造。copy 计划把选定工作区 ID 持久化；受管读取从当前登记的根与相对键定位。Siril 正式执行读取当前默认 ID，取租约、要求在线后写入工作区。候选预览走 Cache。 |

## 已有实现偏差与适用边界

- v0.8 差距。现行 `trusted_deployment` 仍读显式开启变量；`AssetImportService` 仍检查来源环境变量；`StorageRuntime` 尚会恢复未终结导入，并初始化独立 Cache。实现应分离迁移恢复与导入会话终止，处理数据库提交与文件发布之间的残留。每盘配额、部分迁移和整库工具暂无入口。工作区身份标记已有格式版本，正式跨版升级另设计。 [PRD](01_PRD.md)

- v0.5 补充 FR-01 的入口为 `core/paths.py:data_home` → `core/config.py:load_config` → `bootstrap.py:host_runtime` → `StorageRuntime.initialize`。配置解析本身无磁盘副作用。FR-06 缺少整库预检、停机复制、目标启动验证和回切实现；单工作区 worker 只处理工作区目录。FR-07 复制 API 由 `AssetImportService` 承接，用户入口由素材 Feature 接续。

- 原 React `frontend/ui/src/features/settings/StoragePage.tsx` 和旧 `frontend/ui/storage-host.mjs` 可用 `git show 4c0cf4d:<path>` 回查，当前 Vue 路径见[交互规格](02_UI_UX.md)。Vue 当前未提供迁移容量预检摘要、多笔操作历史或原根清理。Cache 表单最小值为 0.001 GB，服务端接受有限数值 0 < GB ≤ 100000；端到端回归应区分界面与 API 的下界。D-08 已确认预检和进度，D-15 已确认工作区自动清源，两项待实现。
- D-15 的实现落点是 `WorkspaceMigrationService._complete` 的提交后路径。现行回执的 `old_root_retained` 表示保留原源。后续应持久化清理范围与结果；只对通过源身份及已提交清单复核的副本清理，保留未搬内容，失败时可从原操作继续。 [技术设计](03_TECH.md)
- 前端只允许部分状态提交重绑，服务端还要求旧标记失效；例如禁用但原标记仍可用时返回 `WORKSPACE_NOT_OFFLINE`。CASE-05 保留此区别。
- 特别检查移除 guard 与显示、重复/终态操作、后台出现错误时的重试及许可校验。真实卷拔插和权限变化留待隔离宿主/设备。
- 将导入和迁移的故障注入标注为各自操作。导入取消与强制退出测试只能证明导入的对应检查点。迁移取消、实际宿主杀进程前后和真实离线重绑仍分别验收。 [测试计划](05_TEST_PLAN.md)

## v1.3 评审修复

| 评审 / 验收 | 实际入口 | 实现行为 |
| --- | --- | --- |
| R-01 / CASE-10 | `storage/migration.py:WorkspaceMigrationService._matches/_copy_all/_complete/_clear_source` | 完整迁移最后一次校验提取受管文件 SHA-256，与 `committed` 回执一同保存。清源时复核目标尺寸和已存摘要，源文件仍在时另比对源指纹与源/目标摘要后才删。旧根已不存在但所在卷仍可辨认时，逐项验证目标；缺失或摘要不符的键保持在 `cleanup_remaining`，作业留在 `committed` 并返回 `SOURCE_CLEANUP_PENDING`。历史回执缺摘要且旧文件已不在时按冻结尺寸复核。 |
| R-03 / CASE-12 | `storage/data_root.py:DataRoots.open/move/rollback/_clear_active_transfer_marker` | `roots.json` 的原子替换是整库生效点。启动持有 catalog、实例和有效根锁，核对 manifest 后清除有效根上未完成切换留下的标记，再继续启动。已经提交的切换按别名进入新根，旧根继续受快照标记保护。新根首次打开先只读检查设置和库，再写 `opened=True`，其后开始可能写入的初始化。未开始写入时 `rollback` 校验并恢复旧根，回退若在清旧根标记前中断，普通启动同样能恢复。 |
| R-02 / CASE-11 | `storage/locations.py:WorkspaceRegistry.audit_files/check_status/validate`、`storage/runtime.py:StorageRuntime.snapshot` | 身份通过后，显式复检及快照均审计已登记的受管文件和正式产物，返回缺件数量和最多 100 个相对键。在线可写且缺件显示 `partial`，补回后恢复 `online`。业务 `require` 继续走轻量路径，单文件缺失不影响其他文件及写入。 |
| R-04 / CASE-13 | `api/storage.py:data_root_preflight`、`storage/data_root.py:DataRoots._move_entry/_inspect_move`、`database/manager.py:DatabaseManager.health/backup` | HTTP/CLI `plan` 和停机 `move` 共用活动根、目录冲突、SQLite 只读身份/模式/完整性、活动作业、工作区标记、顶层陌生内容、暂存、受管清单及空间校验。拒绝携带相应明细；执行持写入排他锁重做检查，再按当时盘点清单复制，不写源业务库。宿主运行时依然允许预检，执行要求停机。 |
| R-05 / CASE-14 | `storage/locations.py:WorkspaceRegistry.remove`、`api/storage.py:remove_location` | 在已有租约、注册锁和事务内同时查活跃操作的源与目标 Workspace ID，参与工作区拒绝解除。合法解除仍只删除登记行。 |

参考复用核对基于本机 ComfyUI v0.46.0。继续走宿主生命周期和现有 aiohttp 路由边界。宿主 `app/assets/services/snapshot_hash.py`、`app/assets/scanner.py` 和 `app/database/db.py` 分别提供摘要、文件读取和锁的参考，但没有管理 AstroPhoto 迁移回执、双根生效点、工作区登记与作业关系的接口。这些规则由现有 AstroPhoto 服务处理。 [TECH](03_TECH.md) · [测试计划](05_TEST_PLAN.md) · [测试报告](06_TEST_REPORT.md)

## v1.1 初次落地

- FR-03/07 · D-16。宿主回环授信解除环境开关，保留实际对端、Host、Origin、Fetch Metadata 和转发头检查以及本机 CLI 标记兼容。导入 validate_selected_source_path 检查本机卷和受管/系统路径，无须来源白名单。
- FR-05 · D-26。WorkspaceRegistry.relocate 核验目录身份或已登记文件证据并报告缺件；确认后保留 ID、更新目录，状态显示 partial，服务的单项读取或写入无需绕过身份与能力规则。WorkspaceActions 和 StoragePage 通过宿主确认框发起第二次请求。验证见 [TEST REPORT](06_TEST_REPORT.md)。
- FR-01/06 · D-24。V3 on_load → host_runtime → DataRoots.open → StorageRuntime.initialize。独立 roots.json 按账号保存别名和有效位置，实例锁与根内 host.lock 持有到退出。DataRoots.move 在停机锁内把内容复制并校验到目标卷的暂存目录，用 SQLite backup、重映射根内工作区并原子发布，再标识旧快照与激活新根。rollback 适用于尚未打开的新根。Settings 提供预检与停机命令，CLI 返回进度与回执。
- FR-02/04/06 · D-15、D-19～23。WorkspaceMigrationService.preflight 冻结源身份、字节、分组和选项。完整迁移保留历史请求形状；新 UI 用 plan_id + option_id + idempotency_key。完整根切换和按量逐组事务分别提交，就地清理已验证受管源文件，失败回执支持重试。失败整区的 discard-target 要求预览与确认。
- FR-08 · D-17/25。VolumeCapacity 以 Windows 卷 GUID 或 POSIX st_dev 做共享预算，配额存入 settings.json，活动预留随执行生命周期释放。已登记字节与正式输出参与核算，copy、Workspace 迁移和 Siril 正式发布共用检查。默认目标空间不足由用户手动切换。
- FR-03/04 · D-12/27。CacheManager 优先使用 ComfyUI temp 的实例专属位置；host_runtime 正常退出调用 StorageRuntime.close，停 worker 后自动清理受管 Cache。Siril 未提交失败诊断写入 Cache，已登记正式结果仍在 Workspace。启动回收已中断的导入暂存或未登记发布，保留已提交资产；持久迁移继续按检查点恢复。

## v1.1 实施规格

下表保留 v1.1 实施前的切片设计。实际入口、已落地行为和复验边界见上方各版本小节。 [TECH](03_TECH.md#v11-架构与落点)

| 顺序 | 文件与入口 | 具体流程、拒绝、写入点和验证 |
| --- | --- | --- |
| 1 · FR-01 | `core/paths.py:data_home`、`bootstrap.py:host_runtime`、`storage/runtime.py:StorageRuntime._initialize`、`storage/initializer.py`、`database/manager.py:DatabaseManager.initialize/_check_schema` | 解析活动根记录与配置 → 区分新建/打开 → 根与实例只读核验 → 获取实例级锁 → 校验有效根 → 打开或引导存储 → 发布能力。实例冲突、第二宿主或未知内容只返回诊断。拟增活动根协调单元由宿主和停机工具共用。关停最后释放锁。正式支持库按发行支持矩阵启用升级；对未认可版本拒绝写入。CASE-01、07。 |
| 2 · FR-03/07 | `api/security.py:trusted_deployment/direct_local_request/authorize_storage_operation`、`api/storage.py`、`assets/imports.py:AssetImportService` | 保留安全请求校验，移出旧启用变量判断和来源白名单依赖。来源验证集中于当前路径检查入口，按实际 OS、受管目录边界、链接及文件可读性拒绝。路由 guard 在解析请求前执行，开放标准本机业务后快照按动作诊断。资产、设备和路径路由有共享 guard，逐个回归现有调用。CASE-03、06、08。 |
| 3 · FR-02/05/08 | `storage/locations.py:WorkspaceRegistry.check_status/require/relocate`、`storage/runtime.py:snapshot/update_settings`、`database/models.py` 及同目录的既有 Alembic 版本管理 | 拟增卷解析与预算/预留持久层供 copy、Siril、两类 Workspace 迁移共用。先查 Workspace 身份/读写 → 取录入或任务租约 → 按卷读取额度和物理可用 → 原子占用预留；提交时转换，失败释放，重启按作业对账。重绑比对身份并返回缺失明细。身份有效时可确认换址，缺件按资产可用性反馈，其它操作按能力判断。无配额时按实际空间与在途预留受理。CASE-02、04、05、06、09。 |
| 4 · FR-02/04/06 | `storage/migration.py:validate/start/run/_inventory/_copy_and_commit/_complete`、`storage/operations.py:find/create/status/cancel/retry/recover`、`api/storage.py` | 拟增预检入口复用路径 guard 与盘点，按量调用纯计划计算并写入冻结计划。确认先查幂等，再锁参与工作区、复核版本/身份/容量并持久排队。复用复制、校验及持久检查点：完整模式事务更新根，按量模式每组事务更新所有成员及回执。每次提交后进入同一清源路径，逐文件进度可重入，部分失败只生成遗留回执，不重新发布或切回。发布与 SQLite 之间的中断依靠可证明归属的清单和标记恢复。CASE-02、04、05、07、09。 |
| 5 · FR-03/07/08 | `storage/cache.py`、`storage/runtime.py`、`storage/operations.py:recover`、`assets/imports.py`、`extension/siril/processing.py:formal_run` | 宿主临时根定位保存在运行时；停止受理后让活动任务到安全检查点。失败和中断的未提交诊断与可重建产物放入 Cache，正常退出自动清空；强退后在启动时回收残留，按提交状态保护正式产物和必要回执；排除导入从跨会话调度，保留持久迁移恢复。copy 受理保存目标 ID 和预留，Siril 开始执行读取默认 ID，并在实际发布前复核输出与容量。到上限或原卷不可用，返回当前目标失败并释放未消费预留，不选其它盘。CASE-03、06、08、09。 |
| 6 · FR-01/06 | 拟增停机搬家入口，复用 `core/paths.py`、`storage/initializer.py`、`database/manager.py` 的身份、路径和版本机制 | 生成持久计划 → 等待停机 → 申请同一实例锁 → 源根只读盘点与一致性核验 → 无覆盖地复制和哈希 → 目标库回读并重映射根内登记 → 原子切有效根 → 输出照常启动及按写入状态恢复的指引。所有早期失败保留源；新的写入开始后禁止直接回旧根。只回收工具自身可证残留，保留旧 Data Root。CASE-01、07。 |
| 7 · FR-01～08 | `frontend/src/api/storage.ts`、`frontend/src/features/storage/StoragePage.vue`、`WorkspaceActions.vue`、`OperationProgress.vue`、`CacheSettings.vue`（后三个同上目录）、`frontend/src/i18n/locales/{en,zh}/sidebar.json` 所在语言词条路径以现有目录为准 | 接收动作能力、卷余额、预检结果和历史回执；编辑预检输入立即废弃旧结果；确认发送显式选项和稳定幂等键。过期计划回填表单，版本冲突保留草稿，离开页面清请求与轮询。回执分别显示权威位置、清理、异常、剩余工作。Assets picker 由素材 Feature 消费契约。CASE-01～09。 |

### 开发分支与副作用约束

| 触发条目 | 检查位置及行为 | 断言 |
| --- | --- | --- |
| 路径不合法、身份变化、源目录被替换或目标键冲突 | 来源/目标入口、租约内确认、实际打开和无覆盖发布；逐次核查规范路径及实际标识，不跟随未知项。预检冲突阻断；执行变化停止后续提交；清源遇源替换保留并报告。 | 原身份、原件及未知文件不变；CASE-02/04/05/07/08 |
| 空计划、输入无效、无可行选项、未选超额、预检失效 | 预检 DTO 解析有限十进制并转换为 bytes；确认对计划/结果/读取版本和实际预算核对。无效请求不创建迁移作业或移动任何文件。 | CASE-07B～D |
| 同键重复、异体重放、两个来源/目标重叠、同时抢额度 | `Operations.find` 先去重，异体拒绝；统一顺序拿工作区租约和每卷容量协调；在写数据库前复核。退出释放未消费预留并在准备阶段记录归属。 | 同键同 ID、配额不能超售、无重复副本；CASE-04/09 |
| 取消、提交事务前中断、目标发布后未登记 | 在每组不可逆前检查取消，读取事务回执核对是否提交，清理只能交给归属检查。未提交组源权威，留存必要残留供显式处理。 | 未提交组完整；已提交组仍可读；CASE-02/04/07 |
| 提交成功后删除失败或删除后未写回执 | `_complete` 或其共用收尾入口根据已提交清单核验目标、源指纹和其它引用；记录清理结果。恢复不得重复制、回滚或删除被替换文件。 | 最新目标权威；剩余项可单独恢复；CASE-04/07 |
| 正常停止、强杀或重启时存在发布暂存 | 会话清理读取数据库提交证据并逐项验证归属，无法判定时保留并报告；关闭工作线程和数据库前完成可安全回收部分。强杀后启动仅清回本实例可证明拥有的残留。 | reference、已提交资产、正式结果和未知文件都保留；CASE-03/08 |
| 旧快照、新根首次激活、回退遇到未知写入状态 | 在打开可写数据库之前持久化启用阶段；根或外部协调记录有歧义时拒绝启动写入，输出恢复指引。 | 两根并行写入不可发生；CASE-01/07A |

### 实施时核实的技术细节

- 目标 Windows 的稳定卷身份、重新映射以及外部协调目录对启动账号的可见性，以独立路径/卷边界验证。核实可信本机原生请求和 v1 旧调用方形状，保留开发工具诊断。
- 按现有证据确认真实 FITS、Siril 输出及关联回执的文件表与分组，缺乏所有权证据的输出阻断按量迁移。规划 SQLite 版本升级及已有 operation 回执的读取兼容。
- 核实宿主退出通知、线程关闭顺序和 `folder_paths.get_temp_directory()` 在生命周期中的可用时点。若宿主挂钩存在差异，保留安全的下次启动回收，并将正常退出验收标为待补。
- 技术候选字段与错误名在 [TECH](03_TECH.md#拟议增量接口)，实现后把确切 DTO、数据模型字段、guard 和对应测试回写本页。性能证据先限定小样本；文件数、字节量、复制峰值、耗时及取消响应仅记录实际测量。

## Pi 评审补充 · 落地约束

- **切片 1/6。** `StorageRuntime._initialize` 现行只有启动临界区锁。新增实例排他须覆盖数据库和 worker 的整个写生命周期，停机工具必须在复制和激活时共享该边界。普通启动解析已激活根，切换守卫防止旧根双写。
- **切片 3。** 卷身份需要新增可信持久字段和旧 marker/登记的兼容策略；不能以路径或 marker 克隆当卷证据。补齐工作区底层状态与登记文件汇总，分别映射到报错和重绑。现行解除只删登记；重登记、重绑禁止共用宽松的 claim 分支。无配额直接使用可用空间。身份有效但缺件时复用资产可用性，避免将局部缺件升级为整个 Workspace 的写入阻断。
- **切片 4。** 禁止将全目录盘点直接喂给 D-15 清源逻辑。预检将数据库对象、可证明必要侧件、可确认作业残留与未知文件分开，按路径冻结字节与所有权。提交收据绑定清单。目标异常、源被置换或收据未提交均不得删源；只允许在成员均处理完后移除可证明归属的空目录。失败诊断随 Cache 退出清空。空基础清单只允许明确确认最小可行超额。
- **切片 4/7。** 同键查回原回执；用户明确重发终态任务生成新计划、新键，并重新校验目标残留。区分在途手动重试、有限自动等待和已提交后的清理重试。工作区读写屏障与作业阶段、底层卷状态各自记录。当前前端可能因有 error 停止轮询或把同路径新操作交给旧键，需要逐条纠正。
- **切片 5。** 仓库当前没有接通宿主退出清理。先核对目标宿主可复用的生命周期挂点与 worker 排空顺序；正常退出挂点不成立时记录阻塞。启动阶段先按已提交登记对账，回收可证明归属的旧会话暂存；旧导入不能再交给通用 `recover` 重调度。
