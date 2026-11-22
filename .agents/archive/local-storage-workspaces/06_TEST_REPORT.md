# 本地存储与工作区 · 测试报告

## 本轮执行

v0.8 为需求合并与宿主源码核对，新增场景的业务执行为 `NOT_RUN`。真实跨卷、外置盘和压力测试按 D-09 延期。旧独立 Cache 与导入恢复证据保留原基线，待按会话清理契约重验。

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## v0.4 证据对账

本次更新为文档对账，未追加执行。独立前端迁移运行 `frontend-vue-v1596-local-2026-11-21` 覆盖真实宿主常规设置和同卷迁移，Cache 清理用空夹具。修订冲突等属于该运行的组件与 HTTP 证据。第二卷测试在该运行中条件跳过。 [运行基线和结果](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

CASE-04 已定位到迁移切换事务前后的服务层故障注入，CASE-05 已定位到隔离目录重命名和重绑测试，物理拔插与当前宿主进程中断未取得证据。CASE-06 是跨设备、素材与 Siril 的组合验收，当前仅有分项入口。三项独立 Feature 复验均为 `NOT_RUN`。 [测试计划](05_TEST_PLAN.md)

## Windows 路径定向核验

`storage-windows-profile-2026-11-21`，Windows 当前账号，`main@4c0cf4d` 加现行工作树。使用 `uv run --frozen --no-sync python -` 运行内联探针。当前 `Path.home()` 与 `USERPROFILE` 同为 `C:\Users\48008`，默认路径解析正确。用该用户目录下的临时子目录作为显式根，执行两次 `StorageRuntime.initialize` 并关闭线程和数据库连接，快照均为 ready 且默认工作区 ID 一致，退出后临时根已清理。实际默认 Data Root 只读检查发现已有 manifest。此结果覆盖 CASE-01 的路径与初始化片段。真实 ComfyUI 宿主首启、整库搬家、真实素材纳管及全量测试仍为 `NOT_RUN`。

## 历史运行证据

**HIST-01**。历史 Windows comfyenv 0.45.0 / 1.59.1 的 `pnpm -C frontend test:storage-host` 记录 4 组通过。重启前后 workspace ID/root、mode、schema 与资产数一致，4 份物理副本 SHA-256 与源一致。真实第二卷测试有记录，拔插与其他平台未运行。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [local-storage.md](../../../docs/local-storage.md) · [equipment.md](../../../docs/equipment.md) · [storage-comfyui-frontend.md](../../../.agents/archive/storage-comfyui-frontend.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史双进程、故障注入与宿主证据 | NOT_RUN |
| CASE-02 | 历史跨卷与重启证据；物理重映射未验 | NOT_RUN |
| CASE-03 | 历史自动化与浏览器回执证据 | NOT_RUN |

## 待复验

D-15 确认的工作区自动清源尚未实现或运行。旧报告中的「成功后保留源」是当时实现的证据，提交前失败保留源的覆盖仍保留。新验收应覆盖提交后清理、失败回执和重复请求。

当前先验证隔离 Data Root、同卷迁移和中断恢复。真实第二卷和物理离线盘按 D-09 延期。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)

## v1.0 证据对账 · 2026-11-21

文档同步工作树的 HEAD 为 `f84442b`。本轮未改业务/测试代码，未运行 Storage、Siril、设备、导入或宿主业务回归；实际运行命令、测试数和退出码没有新记录。历史 v0.4、Windows 定向检查、HIST-01 与独立迁移运行继续按各自环境与命令解释。若某个历史记录缺少源码 diff、依赖清单或日志，仍以该历史报告已披露的范围为准。

| 验收 | 当前状态 | 历史证据限制与复验原因 |
| --- | --- | --- |
| CASE-01 | NOT_RUN | 用户目录解析与隔离初始化已做定向检查；实例级跨根互斥、显式创建/打开及异常宿主未验。 |
| CASE-02/04 | NOT_RUN | 旧迁移证据验证切换、SHA-256 或原根保留；目标新增预检和提交后按清单清源，含部分失败、幂等及重试。 |
| CASE-03/08 | NOT_RUN | 旧授权开关、来源白名单、独立 Cache、跨启动恢复导入与 D-12/D-16 不同；需验证默认本机、来源/OS 安全、会话清理、真实 FITS 和不重跑。 |
| CASE-05/06 | NOT_RUN | 分项入口与隔离路径换址存在；真实目标宿主联动、卷身份与容量变化后的读写保护待验。 |
| CASE-07A～D | NOT_RUN | 旧工作区迁移不覆盖整库停机切换、按量选择、最小超额确认、分组权威或旧计划拒绝。 |
| CASE-09 | NOT_RUN | 旧物理空间检查不证明同卷共享配额、预留竞争或手动选址。 |
| 真实双卷、拔插、盘符重映射、ACL 矩阵、断电、其他系统和压力性能 | DEFERRED | 当前验收限定 Windows 小数据同卷和异常注入，历史双卷记录仍可查。 |

后续每次实际 run 记录 CASE、命令、退出码、测试结果、基线/环境、文件摘要、已执行的 API 收尾和精确跳过理由。 [执行规格](05_TEST_PLAN.md#v11-验收规格) · [关闭状态](Close.md)

### 本轮文档与原型检查

在工作树 `f84442b` 用现有 Playwright Chromium 打开本地 HTML，以 360 px 视口检查预检 8/12 GB 两个可选结果、显式确认、清理重试、同卷超额受阻、恰好匹配、百分比基数、手动切换默认及无横向溢出；无页面脚本错误。此处数据和回执均为模拟，适用范围为 PH-02 原型。另对 17 份 Markdown 的 213 个本地链接及标题锚点、交接中的 114 个链接执行结构检查，均未发现错误。

## Pi 评审历史证据补记

D-23～27 均为 `NOT_RUN`：空基础清单超额、普通启动自动切根、无配额卷、部分可用重绑、正常退出清空非空 Cache。历史用例保留原适用范围。

本轮仅根据用户提供的静态评审同步文档，无新增业务测试或宿主执行。双进程初始化记录只证明启动临界区互斥；迁移提交后保留源、导入重启续跑以及两个旧授权前置都属于旧规则，对应替代断言见 [TEST PLAN](05_TEST_PLAN.md#pi-评审补充--旧断言迁移与新增检查)。

真实第二卷已有条件用例，本轮未执行。目标宿主退出接线、Windows 卷与锁语义、真实硬件及大规模哈希/空间峰值仍无本轮运行证据。原型 360 px 检查仅有历史执行说明，当前未留存可重新运行的脚本或截图。

## v1.1 实现回归 · 2026-11-21

工作树基线 HEAD f84442b，包含本专题的后端、Vue、测试更新及工作树中同时开发的正式输出登记。环境为 Windows、Python 3.12.16、Node 26.13.1、ComfyUI 0.46.0（a277b5b）和 Frontend 1.59.6。业务和构件验证均在隔离根运行。

| 执行 | 结果 | 对应验收 |
| --- | --- | --- |
| `uv run --no-sync pytest tests/backend/test_storage.py tests/backend/test_siril.py tests/integration/test_storage_api.py -q -ra` | 56 passed，2 skipped，退出码 0。使用官方 Siril CLI 1.4.5；真实第二卷未配置。 | CASE-01～09 的后端同卷、HTTP、真实 Siril、故障注入。覆盖 2→3 GB 等比小样本、Siril 正式结果与必要回执成组迁移、清源失败后保持目标权威及重试、降级重绑后读写、共享预算、旧库保护与预启动回滚。 |
| `pnpm -C frontend exec vitest run tests/components/StorageSettings.test.ts` | Chromium 7 passed，退出码 0。 | 确认、取消、刷新、预检与提交、Cache 设置、权限和版本冲突的组件行为。 |
| 隔离 ComfyUI 真实进程生命周期探针 | PASS。宿主 on_load 写入非空预览与诊断缓存，可信回环在两个历史开关均未设时可用；正常关停后、重启前验证文件已消失。离线执行 `python -m astrophoto.storage.data_root move`，带完全相同的启动参数重启后快照指向新根，同 Workspace ID，旧库 SQLite 仍在。 | CASE-01、03、07A。宿主用独立 base、用户、输入、输出、temp、Data Root 和控制目录。 |
| 真实隔离宿主 `node frontend/tests/host/storage-host.mjs` | 03-A、03-B PASS，退出码 0。登录隔离宿主后完成完整迁移预检、原生确认、SHA-256 回执、Cache 设置与手动清理、刷新回读。最后通过 API 恢复原默认工作区、解除测试登记并验证登记已消失。 | 实际 ComfyUI 与 Chromium 的设置/迁移操作。该测试将未知夹具留在原位置，自动清除受管源文件由后端测试验证。 |
| Ruff、ESLint、隔离 Vite 产物构建 | 通过。Vue typecheck 曾通过，最新全前端检查受并行改动中的 `SirilNodes.tsx` 与 `host/canvas.ts` 类型错误影响。 | Storage Chromium 最新 7/7；根切换、清源等 8 个高风险用例在后续工作树复测通过。 |

首轮发现旧用例仍期望未提交导入重启续跑，按 D-12 更新为停止并回收，再运行成功。Chromium 的旧完整迁移替身未模拟预检，更新为预检、取消确认、确认提交后通过。隔离浏览器首次运行遇到宿主首启弹窗和确认按钮定位，测试按宿主真实对话框路径修正后通过。真实跨卷、拔插、盘符硬件重映射和压力性能仍按 D-09 延期。

## v1.2 评审复跑 · 2026-11-21

本轮为按[代码评审交接](references/code-review.md)执行的静态评审 + 基线复跑 + 探针。基线 HEAD `f84442b` 加未提交工作树（含未跟踪 `astrophoto/storage/data_root.py`、`capacity.py`）。未修改业务代码；新增一个只含 `xfail(strict=True)` 探针的测试文件。环境：Windows、Python 3.12.16（`uv run --no-sync`）、Node 26.x；本机无 `pnpm`，前端改用 `frontend/node_modules/.bin/*`。

| 执行 | 结果（退出码） | 对应验收 |
| --- | --- | --- |
| `uv run --no-sync pytest tests/backend/test_storage.py tests/backend/test_siril.py tests/integration/test_storage_api.py -q -ra` | **58 passed, 5 skipped**（0）。skip = `ASTROPHOTO_SIRIL_TEST_CLI` 3 项 + `ASTROPHOTO_TEST_SECOND_VOLUME` 2 项。 | CASE-01～09 的后端/HTTP 子集（与 v1.1 的 56/2 差异来自本机无 Siril CLI、无第二卷，不是回归）。 |
| `uv run --no-sync pytest tests -q` | **111 passed, 6 skipped, 5 xfailed**（0）。 | 全后端、集成、打包；5 xfailed 即 CASE-10～14 的缺陷探针。 |
| `uv run --no-sync pytest tests/backend/test_storage_review.py -q --runxfail --tb=line` | 5 failed（1）。失败点为 `:71`、`:84`、`:99`、`:115`、`runtime.py:61`，逐条对应 R-01、R-02、R-05、R-04、R-03。 | 确认 xfail 只因目标断言失败，而非夹具错误。 |
| `uv run --no-sync pytest mcp/tests -q` | **92 passed**（0）。 | MCP 子包无回归。 |
| `uv run --no-sync ruff check astrophoto tests` | All checks passed（0）。 | 静态门。 |
| `frontend/node_modules/.bin/vue-tsc --noEmit`（cwd `frontend`） | 通过，无输出（0）。 | 全前端类型检查；**推翻** v1.1 段“受 `SirilNodes.tsx`/`host/canvas.ts` 类型错误影响”的旧结论。 |
| `frontend/node_modules/.bin/eslint --config frontend/eslint.config.mjs frontend/src/features/storage frontend/src/api/storage.ts --max-warnings 0` | 通过（0）。 | 存储前端与 API 客户端 lint。 |
| `frontend/node_modules/.bin/vitest run tests/components/StorageSettings.test.ts`（cwd `frontend`） | **7 passed**（0），Chromium，6.5 s。 | CASE-03/04 的组件子集（模式修订、完整迁移预检+确认、Cache 清理/修订、预览设置）。 |

### 探针结论（实测）

| 探针 | 触发 | 实际观测 | 用例 |
| --- | --- | --- | --- |
| `probe_storage_review.py` 段 1 | 迁移 committed 后删旧根 + 删目标文件，再跑收尾 | 回执 `completed`、`cleanup_remaining=[]`、`cleared=1`、`old_root_retained=false`，目标文件不存在 | CASE-10 / R-01 |
| `probe_validate.py` | 导入 copy 后直接删受管文件，再 `validate` | `online`、`missing_count=0`、`missing=[]`；`GET /storage` 同样 online | CASE-11 / R-02 |
| `probe_storage_review.py` 段 2 | 活动迁移 A→B 时 `remove(B)` | `{"removed": true}`，B 登记被删除 | CASE-14 / R-05 |
| `probe_storage_review.py` 段 3 | 删受管文件后先 `DataRoots.plan` 再 `move` | `plan` 通过（4 files / 291411 B），`move` 抛 `SOURCE_NOT_FOUND` | CASE-13 / R-04 |
| `probe_crash_window.py` | 恢复搬家前 catalog 并保留 `root-transfer.json`（模拟两次原子写之间断电） | `open` → `RECOVERY_REQUIRED previous snapshot`；`rollback` → `RECOVERY_REQUIRED Move the active instance back`；`move` 到新目标可用；目标副本完整 | CASE-12 / R-03 |

### 用例状态（v1.2）

| 验收 | 本轮状态 | 依据 |
| --- | --- | --- |
| CASE-01 首启/重入/坏配置/双进程 | PASS（I 层） | `test_first_start_and_reentry`、`test_bootstrap_interrupted_after_database_commit`、`test_multi_process_bootstrap`、`test_explicit_wal_failure_has_no_fake_ready`、`test_invalid_storage_config_preserves_status_route`。实例级“第二宿主持续被拒”仍缺独立用例。 |
| CASE-02 完整迁移 + 提交后清源 | PASS（I 层，正常路径） | `test_migration_recovers_around_database_switch`（before/after）、`test_committed_workspace_cleanup_retries_without_changing_authority`；异常分支见 CASE-10。 |
| CASE-03 Cache/授权/会话 | PASS（I+Vue 子集） | `test_cache_owner_entries_only_with_live_lease`、`test_close_clears_nonempty_session_cache_and_keeps_managed_assets`、`test_http_storage_import_and_access_boundary`、StorageSettings 7 项；H 层与 `processing/` 回收未跑（CASE-18）。 |
| CASE-04 幂等/取消/中断 | PASS（I 层） | `test_copy_override_idempotency_and_real_bytes`、`test_cancel_partial_staging`、`test_restart_discards_published_copy_without_db_commit`、`test_process_exit_during_copy_discards_own_staging`；退出阻塞未测（CASE-15）。 |
| CASE-05 离线/重绑/解除 | PASS（I 层）+ 缺陷 | `test_multiple_workspaces_default_disable_and_offline_relocation`、`test_rebind_partial_keeps_available_assets_and_write_access`；缺件检测与目标解除见 CASE-11/14。 |
| CASE-06 跨模块联动 | PARTIAL | 分项入口在（导入、Siril 正式输出、设备 HTTP），组合场景与真实 FITS 全链路未跑；CASE-22 待补。 |
| CASE-07A 整库搬家 | PARTIAL | `test_offline_root_move_restarts_from_new_root_and_protects_old_snapshot`、`test_offline_root_move_can_roll_back_before_new_root_opens`；崩溃窗口与预检一致性见 CASE-12/13。 |
| CASE-07B/C/D 按量 | PASS（I 层，小样本） | `test_partial_migration_requires_explicit_smallest_overshoot_and_cleans_source`、`test_partial_migration_moves_formal_result_and_required_receipt_together`；0 字节组见 CASE-21。 |
| CASE-08 真实 FITS 导入 | NOT_RUN | 本轮未准备可分享真实 FITS；仅合成字节夹具。 |
| CASE-09 容量/配额 | PASS（I 层，注入） | `test_volume_budget_uses_all_space_until_quota_is_set`、`test_copy_preflight_blocks_offline_read_only_full_and_unauthorized`；配额随搬家见 CASE-19。 |
| CASE-10～14 | XFAIL（缺陷锁定） | `tests/backend/test_storage_review.py`，需在修复后转正并回填本表与 Close。 |
| CASE-15～22 | NOT_RUN | 无入口，见[测试计划](05_TEST_PLAN.md#v12-评审增量--2026-11-21)。 |

### 对历史结论的更正

1. v1.1 段“Vue typecheck 受并行改动影响”失效：本轮 `vue-tsc --noEmit` 全通过。
2. v1.1 段“56 passed / 2 skipped”属“带真实 Siril CLI + 第二卷”环境；本轮同命令为 58/5。两者不能互相替代，报告须同时记录环境与命令。
3. v1.1 段“根切换、清源等 8 个高风险用例在后续工作树复测通过”不包括“旧根缺失 + 目标缺失”的收尾分支（R-01）与“非 partial 工作区缺件”（R-02），因此不得据此判 Close。
4. `frontend/tests/host/storage-host.mjs`（真实隔离宿主）本轮未运行，相关结论仍为历史证据。

## v1.3 修复回归 · 2026-11-21

**范围** R-01～R-05。Windows、HEAD `f84442b` 加工作树，Python 3.12.16、uv 0.13.6、Node 26.13.1、pnpm 11.25.0。修复涉及 `storage/{data_root,initializer,locations,migration,runtime}.py`、`database/manager.py`，以及以下两个测试文件。变更叠加在已有未提交实现上。五个 `xfail` 全部转为普通断言，R-03/R-05 的测试名按报告编号对调。 [实现](04_DEV.md#v13-评审修复) · [测试规格](05_TEST_PLAN.md#v13-正式回归规格--2026-11-21)

| 运行 | 实际命令 | 结果 |
| --- | --- | --- |
| STOR-13-TARGET | `uv run --no-sync pytest tests/backend/test_storage_review.py tests/integration/test_storage_api.py -q -ra` | 9 passed（0）。五项普通回归、两项新增 HTTP 回归及两项已有 HTTP 回归。 |
| STOR-13-ROOT | `uv run --no-sync pytest tests -q -ra` | 118 passed、6 skipped（0），含节点、后端、集成、打包，零 xfail。跳过为官方 Siril CLI 3、真实第二卷 2、真实宿主探测 1。 |
| STOR-13-MCP | `uv run --no-sync --project mcp pytest mcp/tests -q` | 92 passed（0）。 |
| STOR-13-UI | `pnpm -C frontend exec vitest run tests/components/StorageSettings.test.ts` | Chromium 7 passed（0），使用组件替身。 |
| STOR-13-STATIC | `uv run --no-sync ruff check astrophoto tests`；`pnpm -C frontend typecheck`；`git diff --check` | 全部通过（0）。Git 仅提示已有 LF/CRLF 转换。 |

| 用例 | 结果及证据边界 |
| --- | --- |
| CASE-10 / R-01 | PASS。旧根已缺失时，目标缺失与同尺寸篡改均保留待核验键和 `SOURCE_CLEANUP_PENDING`；目标原内容恢复后，同一操作重试成功，仍从目标读原资产。 |
| CASE-11 / R-02 | PASS。直接删除一个登记文件后，后端复检、快照和 HTTP 均报告缺失相对键及 `partial`；其他素材可读、新 copy 可写；补回后恢复 `online`。 |
| CASE-12 / R-03 | PASS。注入搬家 catalog 写入前、回退 catalog 写入后的异常，原入口恢复有效根，受管资产可读、两边文件保留。正常搬家/回退和旧根写保护同时通过。属于故障注入，未做物理断电。 |
| CASE-13 / R-04 | PASS。`plan` 与停机 `move` 以相同错误码和明细拒绝缺件。HTTP 验证缺失、错误标记、脏暂存、活动任务和非空目标的错误明细，解除原因后返回 200。预检未创建目标副本。 |
| CASE-14 / R-05 | PASS。HTTP 在数据库内存在活动迁移且目标租约未被 worker 持有时返回 423，目标仍显示 `migrating`；测试将作业转终态，再用 DELETE 解除登记，回读确认目标目录及标记仍在。 |

R-06～R-15 仍按 v1.2 遗留范围跟踪。真实 ComfyUI 宿主脚本未重跑，CASE-15 的大迁移退出耗时与恢复仍待验证。真实双卷、拔插、ACL、断电和压力仍按 D-09 延期。 [Close](Close.md)
