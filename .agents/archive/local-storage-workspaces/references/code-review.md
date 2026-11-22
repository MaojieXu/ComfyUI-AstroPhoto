# 本地存储与工作区 · 代码评审报告（v1.2）

**评审日期** 2026-11-21 · **基线** HEAD `f84442b` + 未提交工作树（含未跟踪的 `astrophoto/storage/data_root.py`、`capacity.py` 与全部 Vue/测试改动）
**评审依据** [交接](code-review-handoff.md)、[PRD v1.1](../01_PRD.md)、[TECH](../03_TECH.md)、[DEV](../04_DEV.md)、[TEST PLAN v1.2](../05_TEST_PLAN.md)、[TEST REPORT v1.2](../06_TEST_REPORT.md)
**结论** 主链路（首启、同卷迁移、按量迁移、清源重试、容量、Cache、授权）实现完整且大部分有回归；发现 1 项高、5 项中、8 项低问题。建议 Close 维持 `PARTIAL`。

## 1. 结论摘要

| ID | 级别 | 一句话 | 位置 | 回归入口 |
| --- | --- | --- | --- | --- |
| R-01 | 高 | 提交后清源在旧根缺失时不核验目标就报 `completed`/`cleared` | `migration.py:536-549` | `test_storage_review.py::test_r01`（xfail） |
| R-02 | 中高 | `Validate` 只审计曾被标记 `partial` 的工作区，漏报缺件 | `locations.py:192-215` | `test_r02`（xfail） |
| R-03 | 中高 | 整库搬家"写快照标记 → 写 catalog"之间的崩溃无任何工具恢复路径 | `data_root.py:183-188`、`244` | `test_r05`（xfail） |
| R-04 | 中 | 整库预检 `plan` 与执行 `move` 校验集不一致，预检可通过但执行必失败 | `data_root.py:107-177` | `test_r04`（xfail） |
| R-05 | 中 | `remove` 允许解除"活动迁移的目标工作区"登记 | `locations.py:311-327` | `test_r03`（xfail） |
| R-06 | 中 | 正常退出被整笔迁移阻塞（迁移不置取消、`shutdown` 无上限） | `operations.py:143-155` | 待补 |
| R-07 | 中 | 动作级能力仍是恒真的单一 `write` 开关 | `api/storage.py:40`、`StoragePage.vue:28,227` | 待补 |
| R-08 | 中 | 预检不返回 PRD 要求的阻断明细与受影响任务 | `migration.py:170-206,253,275` | 待补 |
| R-09 | 低中 | Cache 退出清理不含 `processing/` 临时目录 | `cache.py:21,58,214` | `test_processing_scratch_...`（部分） |
| R-10 | 低中 | 卷配额按卷身份存储，整库搬家不随卷迁移 | `capacity.py:131`、`data_root.py` `_copy` | 待补 |
| R-11 | 低 | `roots.json` 损坏即全库不可启动，无修复命令 | `data_root.py:30-36` | 待补 |
| R-12 | 低 | 登记接口接受并忽略 `request_id`，重复提交报冲突而非幂等找回 | `api/storage.py:66-68` | 待补 |
| R-13 | 低 | 0 字节资产组永远进不了任何按量迁移选项 | `migration.py:213` | 待补 |
| R-14 | 低（跨 Feature） | Siril 正式结果在登记失败时被删除 | `extension/siril/processing.py:222-228` | 待补 |
| R-15 | 低 | 按量迁移的取消检查使用上一轮缓存的 `phase` | `migration.py:340-343` | 待补 |

## 2. 详细问题

### R-01（高）提交后清源在旧根缺失时不做目标核验

- **位置** `astrophoto/storage/migration.py:536` `_clear_source`，关键分支 `544-549`；调用点 `_complete` `521-534`。
- **触发** 整库/工作区完整迁移已把行切换到目标（`phase=committed`）后宿主中断；随后旧根被删除（用户按"旧根只是快照"手工清理、外部脚本、或旧根目录被移动/删除），而目标端该文件因外部原因缺失（被删、目标盘回滚到更早快照）。恢复时再执行 `_complete`。
- **实际行为** `544` 分支只判断"源根不存在 + 最近存在祖先与源同卷"，随即返回 `cleanup_remaining: []`、`cleared: len(owned)`、`old_root_retained: False`；`_complete` 因此把 `phase` 置为 `completed`。**没有对任何目标文件做存在性或摘要核验**，而同一函数的 `553-570` 主分支逐文件校验目标尺寸 + SHA-256 + 源指纹。
- **复现（已验证）** `tests/backend/test_storage_review.py::test_r01`（`--runxfail` 下失败于第 71 行）。实测输出：
  `probe1 receipt: completed None {'cleanup_remaining': [], 'cleared': 1, 'old_root_retained': False, 'completed_bytes': 12}`，同时 `probe1 target file exists: False`。
- **影响** 虚假成功回执 + 数据库登记指向不存在的文件；资产不可恢复（源已删、目标不存在）。属于交接点名的"错误恢复/数据丢失"类缺陷。
- **依据** PRD FR-02.4「已验证并提交后」、FR-06.6、D-15「只清理受管理、已提交和可证明归属的文件」、CASE-04「权威路径与文件状态符合阶段」。
- **修复方向** 在 `544` 分支对每个 `owned` key 至少 `source_stat(target/key)` 校验尺寸（建议与主分支一致做摘要），失败则写入 `cleanup_remaining` 并保持 `committed` + `SOURCE_CLEANUP_PENDING`；"源缺失"不能单独作为清源成功证据。

### R-02（中高）`Validate` 漏报缺件，状态长期显示 `online`

- **位置** `astrophoto/storage/locations.py:192-215`：`if inspect_contents and evidence.get("partial")` 才调用 `_file_audit`；`evidence.partial` 只在 `relocate(..., allow_partial=True)` 时写入。
- **触发** 已登记受管文件在工作区内被删除/丢失（用户手工删、备份恢复缺件、同步工具覆盖），工作区此前从未走"降级重绑"。
- **实际行为** `POST /storage/locations/{id}/validate` 返回 `status=online`、`missing_count=0`、`missing=[]`；`GET /storage` 同样显示 online。
- **复现（已验证）** `test_r02`。实测：`validate after deleting a registered file: online missing_count: 0 missing: []`，`snapshot status: ['online']`。
- **影响** 界面显示可用，读取相关资产才报 `SOURCE_NOT_FOUND`；与按量迁移预检（`_inventory` 会抛 `WORKSPACE_FILES_MISSING`）结论相反，用户无法定位差异；PRD 要求"补回后复检并更新状态"的反向路径（丢失后降级）完全缺失。
- **依据** FR-05.3、FR-02.2、PRD §13「无法核验登记文件时报告差异，不能静默缩小分母」；DEV 表把 `validate` 记为"核对缺件"。
- **修复方向** 显式 `validate` 与快照默认都做一次 `_file_audit`（至少在工作区存在登记键时），把 `missing` 与 `missing_count` 作为状态输入，而不是依赖历史 `partial` 标记。

### R-03（中高）整库搬家的崩溃窗口没有恢复路径（FR-06.4 不成立）

- **位置** `astrophoto/storage/data_root.py:183`（先写 `source/runtime/root-transfer.json`）→ `180-188`（后写 catalog）；`runtime.py:61`（存在标记即 `RECOVERY_REQUIRED`）；`data_root.py:244`（`rollback` 要求 `opened == False` 且有 `previous`）。
- **触发** `python -m astrophoto.storage.data_root move` 在两次原子写之间被终止或断电（此时目标已完整复制、完成 SQLite backup、完成哈希校验并通过 `health()`）。
- **实际行为（已验证）** `test_r05`：`open(old)` → `RECOVERY_REQUIRED "This Data Root is a previous snapshot"`；`rollback(old)` → `RECOVERY_REQUIRED "Move the active instance back or restore a backup"`（`previous` 为空）；`move` 到同一目标 → `TARGET_NOT_EMPTY`。只有"再 move 到第三个位置"或手工删标记/改 `roots.json` 才能恢复。
- **影响** 宿主存储整体不可用，且错误信息指向一个工具并不支持的恢复动作（"把实例搬回去"）。目标副本完整却无法激活，与 FR-06.4「新根验证失败且尚未写入时，旧根可恢复启动」和 D-24 冲突。
- **修复方向** 二选一并写入 TECH：(a) 先写 catalog 再写旧根快照标记，使"标记存在但 catalog 未切换"不可能出现；(b) 增加显式 `recover`/`activate` 子命令，识别"目标完整 + 源已标记 + catalog 仍指源"并允许激活目标或清除标记。

### R-04（中）整库预检 `plan` 与执行 `move` 校验集不一致

- **位置** `data_root.py:107-136`（`plan`）对 `data_root.py:138-177`（`move`）。
- **触发** 已登记受管文件缺失；`move` 额外检查而 `plan` 不检查的还有：工作区标记身份（`WORKSPACE_IDENTITY_MISMATCH`）、`_inventory` 的未知根项、SQLite `health`、活动 `StorageOperation`。
- **实际行为（已验证）** `test_r04`：`plan` 正常返回 4 个文件 / 291411 字节，`move` 抛 `SOURCE_NOT_FOUND`。
- **影响** UI 的"整库搬家"预检通过并给出可执行命令，用户照做必失败，且只得到底层码、没有缺失清单；违反 FR-02.2（预检须列出缺失受管资产等阻断项）与 FR-06.1（每条路径都有预检与结果）。
- **修复方向** 抽出 `plan`/`move` 共用的盘点和前置校验（含 `_file_audit` 式缺失清单），预检失败即列出明细，`move` 复用同一实现。

### R-05（中）`remove` 未检查活动迁移的目标工作区

- **位置** `locations.py:311-327`，第 `323` 行 `if any(op.plan.get("workspace_id") == workspace_id for op in active)`。
- **触发** 按量迁移 A→B 处于非终态时调用 `DELETE /storage/locations/{B}`（UI 在 `status === 'migrating'` 时禁用按钮，API 无此保护）。
- **实际行为（已验证）** `test_r03`：返回 `{"removed": true}`，B 的登记被删除，随后迁移在 `require(destination)` 处失败。
- **影响** 迁移中断、需要重新登记目标；不丢文件。与 `check_status`（含 `target_workspace_id`）、`update`、`relocate` 的判定不一致。
- **修复方向** 第 323 行同时匹配 `plan.get("target_workspace_id")`。

### R-06（中）正常退出被整笔迁移阻塞

- **位置** `operations.py:143-155`：只对 `kind == "import"` 置 `cancel_requested`，随后 `pool.shutdown()` 无超时；迁移只在 `checkpoint()` 处响应取消。
- **触发** 大迁移（或大文件哈希/`_clear_source` 复核）进行中关闭 ComfyUI。
- **影响** 退出挂起时长等于剩余迁移时长；`StorageRuntime.close` 之后的 Cache 清理也被推迟，强杀概率上升。与 FR-04.4「取消在安全检查点生效」、FR-03.5「正常退出自动清理」不符。
- **修复方向** 退出时对 migration 同样置 `cancel_requested`（利用现有 `checkpoint` 抛 `OPERATION_CANCELLED` 且 `phase=committed` 时不会被降级），并对 `shutdown` 设上限；超时后仅保留 checkpoint 供下次恢复。

### R-07（中）动作级能力仍是单一开关

- **位置** `api/storage.py:40` `result["capabilities"] = {"write": True, "import": True}`；`StoragePage.vue:28` 用 `capabilities.write` 统一禁用整页；`227` 行的告警分支实际不可达。
- **依据** FR-03.2 要求分别呈现目录浏览、reference、copy、候选预览、正式输出是否可用及失败原因。
- **影响** 默认工作区离线时 `write` 仍为 `true`，所有按钮可点，用户逐项撞错；也无法按动作区分"离线/只读/配额不足/未授权"。

### R-08（中）预检不返回阻断明细与受影响任务

- **位置** `migration.py:170-206` `preflight` 返回体只有 `plan_id/source/target/base_bytes/requested_bytes/options/reason/groups/cleanup_files/same_volume`；`253` `UNKNOWN_WORKSPACE_CONTENT`、`275` `WORKSPACE_FILES_MISSING` 均为无 `details` 的裸错误码。
- **依据** FR-02.2 要求列出阻断项（未知顶层文件、暂存、身份冲突、路径重叠、缺失受管资产），并展示受管资产范围、目标空间与共享配额、**影响中的任务**。
- **影响** 用户只拿到 409，无法知道缺哪些文件；UI 也无法渲染阻断项。

### R-09（低中）Cache 退出清理不含 `processing/` 临时目录

- **位置** `cache.py:21`（`ENTRY` 只匹配 `<32hex>.cache`）、`58` `_entries`、`214` `clear_after_session`；`_recover_processing_scratch`（`100`）只在 `scratch()`（`122`）调用时执行。
- **触发** Siril 处理中强杀/断电，留下 `processing/processor-xxxxxxxx/`（`owner.json` + 中间文件）。
- **影响** 退出与下次启动都不回收，只有同一 `prefix` 生产者再次运行时才清；与 D-27「正常退出自动清空…含失败诊断和中间文件」不符，长期占用缓存与磁盘。
- **备注** 归属校验本身是正确的（`owner.json` 实例比对 + 每目录锁），缺的是启动/退出侧的扫描入口。

### R-10（低中）卷配额不随整库搬家迁移

- **位置** `capacity.py:131` 以 `volume_identity` 为键写 `settings["volume_quotas"]`；`data_root.py` `_copy` 只改 `cache.path` 与 `former_paths`。
- **触发** 给源卷设配额后整库搬到另一卷。
- **影响** 新卷无配额（回退 D-25"全部实际可用空间"），旧卷键残留；若用户以为"配额跟数据走"，这是静默降级。PRD 未对该场景定稿，需补决策或在搬家回执中明示。

### R-11（低）`roots.json` 单点故障、无修复入口

- **位置** `data_root.py:30-36` `_read`：任何 `OSError/ValueError` → `RECOVERY_REQUIRED`；`open()` 在读取 catalog 失败时对**任何**请求根都失败。
- **影响** 一个 ~100 字节 JSON 损坏即导致存储整体不可用（`storage_error`），只能手工删除/编辑。与 D-24「显示当前有效位置和恢复指引」的意图不一致。

### R-12（低）登记接口的 `request_id` 未被使用

- **位置** `api/storage.py:66-68` `add_location` 接受 `request_id` 但不参与幂等；`WorkspaceRegistry.register` 无键去重。
- **影响** 双击/响应丢失后重发同一 `POST /storage/locations` 得到 `WORKSPACE_IDENTITY_MISMATCH`/`TARGET_NOT_EMPTY`，而不是找回原提交（FR-04.2）。前端靠 `pending` 禁用规避，但 API 契约与文档不一致。

### R-13（低）0 字节资产组无法按量迁移

- **位置** `migration.py:213` `if not group["bytes"]: continue` → 该组既不进 `selected` 也不进 `remaining`，任何选项都不包含它，但 `preflight` 的 `groups` 又会展示。
- **影响** 0 字节登记文件在按量迁移中永久留在源，且分母/选项不体现。

### R-14（低，跨 Feature）Siril 正式结果在登记失败时被删除

- **位置** `extension/siril/processing.py:222-228`：`record_output` 失败落入 `except BaseException` → `manager.remove_stage(output)`，`_store_failure_receipt` 再删 `manifest.json` 并把诊断写进 Cache（退出即清空）。
- **触发** `record_outputs` 的 DB 写入失败（busy/约束/522）。
- **影响** 已完成并通过校验的 FITS 被删除且无登记、无诊断留存；与 FR-03.5「正式结果及必要回执受保护」、D-27 冲突。建议发布后登记失败时保留产物并登记"待登记"，由 `recover_runs` 收口。

### R-15（低）按量迁移取消检查读取上一轮 `phase`

- **位置** `migration.py:340-343`：循环内 `operation.phase` 来自上一次迭代末尾的 `self.ops.get(...)`。
- **影响** 取消只会在下一组生效（当前组一定完成），"publishing 之后仍可取消"的判定有偏差；不导致数据错误。

## 3. 未发现问题的范围（已逐项核对）

- **路径安全** `paths.py`：绝对路径、`..`、链接/重解析点（`st_file_attributes & 0x400`）、UNC/网络盘（`GetDriveTypeW`）、保留名/尾随空格/`:` 流、`safe_join_workspace` 归一与 `is_relative_to` 复核；`canonicalize_root` 拒绝用户主目录之上升级与系统目录。对应 `test_reject_links_unc_and_relative_paths`。
- **发布原子性** `manager.py`：`publish_object` 同卷校验 + `rename_noreplace`（`renameat2`/`renamex_np`/Windows `os.rename`）+ 目录 fsync；`stage_copy` 前后指纹比对、`SOURCE_CHANGED`、`INSUFFICIENT_DISK_SPACE` 映射。
- **数据库** `database/manager.py`：`quick_check`、schema SQL 全量比对、`alembic_version` 白名单、实例身份、WAL/外键、`backup()` 的 `quick_check` + 非覆盖 rename。对应 `test_never_replaces_an_existing_asset_database`、`test_explicit_wal_failure_has_no_fake_ready`、`test_legacy_dev_schema_is_preserved`、`test_foreign_keys_busy_rollback_and_backup`。
- **幂等与作业** `operations.py`：`(kind,key)` 唯一约束 + 请求体比对、16 笔非终态上限、按作业文件锁、`publishing/committed` 保留检查点、终态拒绝变更回执。
- **容量** `capacity.py`：Windows 卷 GUID / POSIX `st_dev` 分组、`used` 以登记字节 + 正式输出（含 `collected` 去重）+ 回执尺寸、`reserved`（managed）/`committed`（physical）分离、预留与逐项物化、同卷迁移 `managed` 增量 0、无配额走物理空间。对应 `test_volume_budget_uses_all_space_until_quota_is_set`。
- **Cache 自有性** `cache.py`：条目名正则 + 描述符身份（inode/mtime/size/instance）+ 单链接 + 每项 `FileLock`，`clear_owned_cache` 四项计数；`test_cache_owner_entries_only_with_live_lease`、`test_close_clears_nonempty_session_cache_and_keeps_managed_assets`。
- **授权** `api/security.py`：仅受信回环部署、对端回环、`Sec-Fetch-Site`、`Origin`、`Forwarded`/`X-Forwarded-*` 拒绝、Host 解析、`X-AstroPhoto-Local` 与浏览器同等来源分支；`test_http_storage_import_and_access_boundary`。
- **HTTP 边界** `api/storage.py`：`fields()` 严格字段集、UUID 规范化、JSON 类型与 64 KiB/512 KiB 上限、错误码→状态码映射（403/404/409/422/423/507/503）、`Cache-Control: no-store`、`X-Request-ID`。
- **前端契约** `api/storage.ts`：响应结构校验、`ApiError` 语义；`StorageSettings.test.ts` 的 `REVISION_CONFLICT` 保留草稿并回填新修订、确认框取消、轮询终止、卸载中止。
- **迁移主链路** `migration.py`：冻结计划比对（身份/指纹/文件集）、`_copy_all` 断点续跑与逐文件校验、`_copy_group` 组事务（成员+回执+位置同提交）、`_clean_partial` 只删已提交项、`discard_target` 的双重确认与归属标记；`test_migration_recovers_around_database_switch`、`test_committed_workspace_cleanup_retries_without_changing_authority`、`test_partial_migration_requires_explicit_smallest_overshoot_and_cleans_source`、`test_partial_migration_moves_formal_result_and_required_receipt_together`。

## 4. 实际执行的命令与结果（2026-11-21，本机）

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `uv run --no-sync pytest tests/backend/test_storage.py tests/backend/test_siril.py tests/integration/test_storage_api.py -q -ra` | **58 passed, 5 skipped** | 无 `ASTROPHOTO_SIRIL_TEST_CLI`（3 skip）与 `ASTROPHOTO_TEST_SECOND_VOLUME`（2 skip）；比报告记录的 56/2 多 2 项通过、多 3 项环境跳过 |
| `uv run --no-sync pytest tests -q` | **111 passed, 6 skipped, 5 xfailed**（新增评审探针） | 全后端 + 集成 + 打包 |
| `uv run --no-sync pytest tests/backend/test_storage_review.py -q --runxfail --tb=line` | 5 failed | 逐一确认失败点即 R-01～R-05 的目标断言 |
| `uv run --no-sync pytest mcp/tests -q` | **92 passed** | MCP 子包无回归 |
| `uv run --no-sync ruff check astrophoto tests` | All checks passed | |
| `frontend/node_modules/.bin/vue-tsc --noEmit`（cwd `frontend`） | 通过（无输出） | 与报告"受并行改动类型错误影响"的旧结论相反 |
| `frontend/node_modules/.bin/eslint --config frontend/eslint.config.mjs frontend/src/features/storage frontend/src/api/storage.ts --max-warnings 0` | 通过 | |
| `frontend/node_modules/.bin/vitest run tests/components/StorageSettings.test.ts`（cwd `frontend`） | **7 passed** | Chromium，6.5 s |

探针脚本（临时目录，未入库）：`probe_storage_review.py`（R-01/R-05/R-04）、`probe_validate.py`（R-02）、`probe_crash_window.py`（R-03）。环境：Windows、Python 3.12.16（uv 工作区 `--no-sync`）、Node 26.x（无 `pnpm`，改用 `frontend/node_modules/.bin/*`）。

## 5. 未验证项

- 真实第二卷 / 物理拔插 / 盘符重映射 / ACL 矩阵 / 断电 / 非 Windows：延续 D-09 延期，本轮无新证据。
- 真实 ComfyUI 0.46.0 宿主进程退出与 `frontend/tests/host/storage-host.mjs`（需要隔离宿主）：本轮未运行，故 R-06 与"退出清空 Cache"的宿主侧结论仍是历史证据。
- Siril 真实 CLI 1.4.5 用例（3 项 skip）；R-14 的触发只做静态推断，未注入 DB 失败。
- 大文件/大目录下 `_inventory`、`file_hash`、`_clear_source` 双读带来的耗时与 I/O 峰值未测量。
- macOS `renamex_np`、Linux `renameat2` 与 `/proc/self/mountinfo` 分支未在本机执行。
- `pnpm -C frontend test`（含 `vite build`）、`check:build`、`check:proxy` 未按脚本执行（环境无 `pnpm`）。

## 6. 文档与实现/自身不一致

| 文档与位置 | 冲突内容 | 应以哪一侧为准 |
| --- | --- | --- |
| [DEV](../04_DEV.md) 表格 FR-02/FR-04 行（"忽略 source 保留"） | 写「原根数据保留；失败/取消可保留供检查的暂存」，而同一文档"当前 v1.1 落地"与实现是提交后按清单自动清源 | 实现（D-15）；该行需改写 |
| [DEV](../04_DEV.md)「v1.1 实施规格」开头 | 「以下是待实施的切片」，但切片 1～7 已落地（同文档"当前 v1.1 落地"也如此陈述） | 删除"待实施"表述 |
| [TEST PLAN v1.1](../05_TEST_PLAN.md) CASE-02 行 | 「D-15 的清理尚待代码及回归覆盖」，与 v1.1 段"已实现"及现有测试断言冲突 | v1.2 段已改写，见下文 |
| [TEST REPORT v1.1](../06_TEST_REPORT.md) 末行 | 「最新全前端检查受并行改动中的 `SirilNodes.tsx` 与 `host/canvas.ts` 类型错误影响」 | 本轮 `vue-tsc` 通过，该句失效 |
| [Close v1.1](../Close.md)「v1.1 实现收口」 | 「提交后自动清源…已接入真实业务入口」+ 建议可收口 | R-01/R-02/R-03 表明收尾与恢复仍有高/中高缺口，应维持 `PARTIAL` |
| [TEST PLAN](../05_TEST_PLAN.md) CASE-01 替换断言 | 要求"第一宿主持续持锁、第二宿主被拒"，当前仅有 `test_multi_process_bootstrap`（顺序通过）与 `DataRoots.open` 的"already open"断言 | 缺口仍在，v1.2 段保留 |
