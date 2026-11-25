# 测试报告

## 1. Test Summary

| 项目 | 值 |
| --- | --- |
| Feature | `equipment-image-data-integration` |
| 最终被测代码 | `1772bd5d12e2763212ff502e900ec981a6285700` + 未提交工作树（`DEV_118_FIX_INPUTS.json` 可识别；RUN-002 含 SPEC-001 C 与 Q-04 A 的实现） |
| TEST_PLAN | v2.4（SPEC-001 C、Q-04 A 已确认并落地） |
| 最新有效 RUN | RUN-003（本机自动化 + 隔离 8188 宿主，2026-11-22） |
| 已执行范围 | 后端 + HTTP 集成 209 项、MCP 93 项、前端 Chromium 109 项、隔离宿主 4 个脚本/用例 |
| 未执行范围 | 独立 stdio MCP、真实 Agent 客户端、双物理 SSD 与 1000 帧实文件、Windows 原生对话框、宿主任务框与迁移真实卷 |
| **质量结论** | **INCOMPLETE**（已执行的自动化范围通过；关键验收链路未执行，不能作出 Feature 通过结论） |

结论依据：RUN-003 在隔离 8188 宿主（ComfyUI 0.46.0 / Frontend 1.59.6，Data Root `.artifact/frontend-preview/astrophoto`）上执行了 `pytest -m host`、`storage-host.mjs`、`assets-host.mjs` 与设备两阶段重启脚本，全部通过；同时补齐 0001 旧库升级用例，后端+集成 209 项、MCP 93 项、前端 109 项通过。AC-06/07/08 的真实 MCP 客户端、AC-26 的真实卷迁移、AC-28 的双 SSD 与 1000 帧仍未执行，故结论保持 INCOMPLETE。

## 2. Environment & Baseline

| 项目 | 值 |
| --- | --- |
| 操作系统 | Windows（win32-x64） |
| Python | 3.12.16 |
| pytest | 8.4.2（根与 `mcp/` 独立配置） |
| Node / Vitest | v26.13.1 / 5.1.1（本地 `frontend/node_modules/.bin/vitest`） |
| pnpm | 未安装（声明 11.13.1）；未执行 `vite build` |
| ComfyUI | 0.46.0 / Frontend 1.59.6，隔离 8188（RUN-003 期间启动，Data Root `.artifact/frontend-preview/astrophoto`） |
| MCP | 进程内 FastMCP Client（RUN-002）；独立 stdio 未启动 |
| 数据根 | pytest `tmp_path` 隔离，无用户数据 |
| 证据目录 | [RUN-001](assets/test-runs/RUN-001/)、[RUN-002](assets/test-runs/RUN-002/) |

前置状态：独立审查门禁为“已修复待确认”（`00_FEATURE_INDEX.md`），本轮由用户指示提前执行自动化测试；该偏差见 §8。

## 3. Run Overview

| Run ID | Code Revision | Plan Revision | Scope | Outcome | Evidence |
| --- | --- | --- | --- | --- | --- |
| RUN-001 | `1772bd5` + 工作树 | v2.1 | `tests/backend`+`tests/integration`；`mcp/tests`；`frontend/tests/**/*.test.ts` | Pass（自动化层） | `assets/test-runs/RUN-001/` |
| RUN-002 | 同上 + SPEC-001 C / Q-04 A 改动 | v2.4 | 同上，新增 `requires_new_approval` 与 `skipped_assets` 断言 | Pass（208/93/109） | `assets/test-runs/RUN-002/` |
| RUN-003 | 同上 + 0001 升级用例 + 宿主脚本修正 | v2.4 | 209/93/109 + `pytest -m host`、storage/assets/equipment 宿主脚本 | Pass（宿主 5 项检查） | `assets/test-runs/RUN-003/` |
| RUN-001（前端并行尝试） | 同上 | v2.1 | 默认文件并行的 Vitest 全量 | 环境失败（4 文件动态导入失败），不计入结果 | 首次执行日志（留存本地） |

前端串行全量（`--no-file-parallelism`）16 文件 109 项通过，作为本轮有效证据；并行运行的模块加载竞态记为 `ENV-001`（非产品缺陷）。

## 4. Current Test Results

状态为当前代码的有效结果，含 RUN-002 自动化与 RUN-003 隔离 8188 宿主；`Partial` 表示 TC 的部分断言未执行。宿主脚本证据在 `assets/test-runs/RUN-003/`。

| TC | FR/AC | 自动化状态 | 覆盖 | 验收状态 | 证据 |
| --- | --- | --- | --- | --- | --- |
| TC-001 | FR-07/AC-15 | Pass | Full（宿主） | — | `storage-host.mjs`（RUN-003）、`StorageSettings.test.ts` |
| TC-002 | UXUI | Skipped | 已并入 TC-001 | — | — |
| TC-003 | AC-14/15 | Pass | Full（组件+宿主配置） | — | `StorageSettings.test.ts`、`storage-host.mjs` |
| TC-004/005 | DEV-002/003 | Skipped | 已并入 TC-055/TC-001 | — | — |
| TC-006/007 | AC-14/15 | Pass | Full（宿主登记/顺序/隐藏项） | — | `storage-host.mjs`、`test_storage_api.py` |
| TC-008/015 | DEV-006/015 | Skipped | 并入 TC-014/TC-012 | — | — |
| TC-009/010 | AC-16/17 | Pass | Full（宿主四类设备、表单、双语） | — | `equipment-host.mjs`、`test_equipment.py` |
| TC-011 | AC-18 | Pass | Partial（导入页与模式） | 批量分类待验 | `assets-host.mjs`、`AssetsLibrary.test.ts` |
| TC-012 | AC-14 | Pass | Partial（模拟卷） | 真实跨卷待验 | `test_storage.py::test_location_priority_quota_and_reservation` |
| TC-013 | AC-10/12 | Pass | Partial（模拟并发） | 真实宿主待验 | `test_import_planner.py`、`test_storage.py` |
| TC-014/TC-014-R1 | AC-14 | Pass | R1 Full；TC-014 Partial（添加/排序/首选） | 菜单细节待验 | `storage-host.mjs`、`test_storage_api.py` |
| TC-020 | AC-19 | Pass | Partial（单张 Reference/Copy） | 批量文件夹与分类待验 | `assets-host.mjs`、`AssetsLibrary.test.ts` |
| TC-021/030/040 | FR-03 | Pass | Partial（目录浏览/标签/顶部操作） | 目录边界待验 | `storage-host.mjs`、`AssetsLibrary.test.ts` |
| TC-031 | AC-14 | Skipped | Obsolete（DEV-053） | — | — |
| TC-041 | DEV-041 | Skipped | 并入 TC-021/TC-054 | — | — |
| TC-050/051/060/070/090 | AC-20～22/24 | Pass | Partial（项目模板、Reference、虚拟移动、树导航） | 批量多选与拖拽边界待验 | `assets-host.mjs`、`AssetsLibrary.test.ts` |
| TC-052 | DEV-052 | Blocked | — | 需 Windows 交互桌面 | — |
| TC-054/055/080 | AC-14/23 | Pass | 055/080 Full；054 Partial（表单登记） | 系统选择器边界待验 | `storage-host.mjs`、`test_storage_api.py` |
| TC-100 | AC-25 | Pass | Partial（宿主通知替代页内回执） | 通知计次与消失未断言 | `equipment-host.mjs`、`AssetsLibrary.test.ts` |
| TC-110 | AC-26 | Blocked | 后端迁移通过 | 需真实卷/宿主 | `test_storage_api.py` 4 项迁移用例 |
| TC-111 | AC-14/25 | Blocked | 无专项自动化 | 需宿主 | — |
| TC-112 | AC-27 | Blocked | 组件+后端通过 | 需宿主全局任务框 | `TaskPanel.test.ts`、`test_storage_api.py` |
| TC-112-R1 | AC-27 | Pass | Full | — | `test_direct_import.py::test_cancel_finishes_after_its_location_was_removed` |
| TC-113 | AC-28 | Blocked | 调度与组逻辑通过 | 需双 SSD、1000 帧实文件 | `test_subframe_groups.py`、`test_import_planner.py` |
| TC-113-R1 | AC-28 | Pass | Full（调度层） | — | `test_import_planner.py::test_shared_volume_budget_and_overlapping_or_unresolved_hardware` |
| TC-115 | AC-04/05 | Pass | Partial（Reference/Copy 导入与回读） | 校准关系界面待验 | `assets-host.mjs`、`test_photography_library.py` |
| TC-115-R1 | AC-05 | Pass | Full | — | `test_photography_library.py::test_copy_import_preserves_fits_bytes_and_scientific_headers` |
| TC-116 | AC-09～13 | Pass | Full（0001/0002/0003 升级 + 新库） | 真实旧库副本仍为 in-process | `test_storage_init.py`、`test_subframe_groups.py` |
| TC-116-R1 | AC-13 | Blocked | — | 需异常库夹具 + MCP 串联 | — |
| TC-116-R2 | AC-10 | Pass | Partial（发布重试用例） | 重启对照待补 | `test_direct_import.py::test_retry_only_failed_frame_and_recover_after_publish` |
| TC-116-R3 | AC-11 | Blocked | — | 需外置卷与宿主 | — |
| TC-117 | AC-06～08 | Blocked | 进程内 MCP 通过 | 需真实宿主/stdio/客户端 | `mcp/tests/*`、`test_library_mcp.py` |
| TC-117-A | AC-06 | Pass | Full | — | `test_library_mcp.py`（expired → 409） |
| TC-117-B | AC-07 | Pass | Full | — | `test_library_mcp.py::test_mixed_group_chat_approval_applies_only_the_approved_group` |
| TC-117-C | AC-07 | Pass | Full（`requires_new_approval` 已验证） | — | `test_agent_imports.py` 恢复/绑定重试与版本冲突用例 |
| TC-117-R1～R6 | AC-07/03 | Pass | Full | — | 见 §11 索引 |
| TC-117-R7 | AC-08 | Blocked | — | 需宿主 + 旧根副本 | — |
| TC-118 | AC-19/10 | Pass | Full | — | `test_direct_import.py::test_preview_expiry_and_revision_conflict_leave_no_job` |
| TC-119 | AC-07/10 | Pass | Full | — | `test_agent_imports.py::test_source_change_after_approval_keeps_the_frozen_fingerprint` |
| TC-120 | AC-09/13 | Pass | Full（锁映射） | 跨进程实锁待验 | `test_storage_init.py::test_bootstrap_lock_timeout_and_restart_reuse_identity` |
| TC-121 | AC-26 | Pass | Partial（DB 切换前/后） | 复制/发布第 2 帧崩溃点待补 | `test_storage.py::test_migration_recovers_around_database_switch` |
| TC-122 | AC-07 | Pass | Full（`partial` + `skipped_assets`） | — | `test_agent_imports.py::test_approved_intent_recovers_after_restart_and_skips_existing_asset` |
| TC-123 | AC-10 | Pass | Full | — | `test_agent_imports.py::test_retry_rejects_completed_groups_and_changed_settings` |

## 5. Requirements Coverage & Metrics

| 指标 | 值 |
| --- | --- |
| 计划内 TC（不含已并入/Obsolete） | 54 |
| Pass | 45（24 项 Full + 21 项 Partial） |
| Blocked（缺客户端/硬件/真实卷） | 9 |
| Skipped（并入或 Obsolete） | 7 |
| 执行率（有执行结果 / 计划内） | 45/54 ≈ 83.3% |
| Pass Rate（Pass / (Pass+Fail)） | 45/45 = 100%（仅适用于已执行范围） |

AC 覆盖（当前有效证据）：

| AC | 自动化证据 | 验收 |
| --- | --- | --- |
| AC-03 | TC-114-R1/TC-114-R2 部分 | 待宿主 |
| AC-05 | TC-115-R1 | 待 Assets 界面 |
| AC-07 | TC-117-B、R1～R6、TC-119、TC-122 | 待真实客户端 |
| AC-10 | TC-116-R2、TC-118、TC-119、TC-123 | 部分 |
| AC-13 | TC-120（锁） | 待异常库/MCP |
| AC-14 | TC-012、TC-014-R1 | 待宿主 |
| AC-19 | TC-118、TC-020 组件层 | 待宿主 |
| AC-26 | TC-110 后端、TC-121、TC-112-R1 | 待真实卷 |
| AC-27 | TC-112-R1 | 待宿主 |
| AC-28 | TC-113-R1 | 待双 SSD |
| AC-01/02/04/06/08/09/11/12/15～18/20～25 | 组件或集成层部分 | 待宿主 |

## 6. Defect Register

本轮未发现产品缺陷（0 个 BUG）。非缺陷观察：

| ID | 类型 | 内容 | 处理 |
| --- | --- | --- | --- |
| ENV-001 | Environment Issue | Vitest 默认文件并行时 4 个文件动态导入失败（`Failed to fetch dynamically imported module`）；单文件与串行全量通过 | 串行运行取证；不计入产品缺陷 |
| SPEC-001 | Specification Issue | TECH 原文要求“版本或目标变化需重新提案”，实现把绑定期版本变化记为 `binding_failed` 并允许重试 | 已确认口径 **C**：动态返回 `requires_new_approval: true`，保留重试；TC-117-C 已覆盖，RUN-002 通过 |

### 6.1 SPEC-001：绑定期版本变化的实际表现

示例：提案时相机 `cam-7` 为 `row_version=3`，批准并复制两帧后、绑定前在另一窗口把相机改名（版本 4）。

| 步骤 | 观察 |
| --- | --- |
| 提案 | 组冻结 `target_versions.equipment = {cam-7: 3}` |
| 批准 → 复制完成 | 回执 `copied=2`，素材 `a1`、`a2` 已登记 |
| 绑定阶段复核 | `REVISION_CONFLICT`，两条绑定 `failed`，组 `binding_failed`；素材与回执保留，无关系写入 |
| `POST …/retry-bindings` | 版本保持 4 时持续失败；无“作废批准/要求重新提案”的状态或 409 |

同一事件提前到“导入启动前”则返回 `import_failed`，两种阶段结果不同。安全性没有缺口（都不会用旧版本写入），差异在契约与可收尾性。**已确认 C**：`status()` 在任一绑定失败且错误码为 `REVISION_CONFLICT` 时返回 `requires_new_approval: true`，重试保持可用；字段按状态动态计算，重试成功后消失。A（作废批准）与 D（重新确认并重冻）未采用。详见 [TECH 已确认节](03_TECH.md#已确认口径绑定期版本变化与已登记同源spec-001-cq-04-a)。

### 6.2 TC-122：跳过源的计数与影响范围

示例（登记模式；复制模式不跳过）：组内 `Light_0001.fit` 为新文件、`Light_0002.fit` 已登记为 `old-2` 且指纹一致；批准内容为项目 `P`、相机 `C`、批准属性。

| 对象 | 复制/登记 | 项目 | 属性与绑定 |
| --- | --- | --- | --- |
| `a1`（新） | `registered=1` | 加入 `P` | 绑定 `C`，属性写入 |
| `old-2` | `skipped=1` | 不加入 | 不写入、不绑定 |

组计数为 `imported=1`、`skipped=1`、`remaining=0`、`bindings=1`，因此状态为 `partial`，并返回 `skipped_assets: [{"asset_id": "old-2", "reason": "ALREADY_REGISTERED"}]`；`retry-bindings` 不改变结果。**已确认 A**：不修改既有素材，只披露跳过明细；B（施加批准内容）与 C（单独动作）保留为后续能力。见 PRD Q-04 与 TEST_PLAN TC-122。

## 7. Retest & Regression History

- 本轮新增 7 个用例在开发过程中曾因测试自身错误失败（`snapshot["revision"]` 键、`direct_import` 属性名、`calibration`/`configuration_gaps` 缺省键、`SOURCE_CHANGED` 不在可重试集合）。均在进入 RUN-001 前修正，属 Test Defect，不计入产品失败。
- RUN-001 无失败用例。
- RUN-002：按 SPEC-001 C 与 Q-04 A 修改 `agent_imports.status`、`imports.import_reference` 并补充断言后重跑全量，208/93/109 全部通过；新增 `test_binding_version_conflict_flags_new_approval_and_keeps_retry`，并在跳过用例中断言 `skipped_assets`。
- RUN-003：隔离宿主上补齐设备/存储/素材宿主用例；修正宿主脚本的过期 UI 期望（设置首页三项、导入模式标签、成功回执走宿主通知、首选标记按列表首行），新增 0001 旧库升级用例；209/93/109 与 4 个宿主脚本通过。
- 回归范围：DEV-118 涉及模块的全部既有用例（`test_agent_imports.py`、`test_agent_import_plan.py`、`test_direct_import.py`、`test_storage_api.py`、`test_equipment.py`、`test_equipment_api.py`、`mcp/tests`）随全量执行通过。

## 8. Deviations & Limitations

1. **审查门禁未确认为通过**：`00_FEATURE_INDEX.md` 记录为“已修复待确认”。按 TEST_REPORT 规范应在门禁通过后执行；本轮由用户直接指示提前执行，结论只覆盖自动化范围。
2. **宿主已执行但隔离范围有限**：8188 使用隔离 Data Root 与 `--disable-all-custom-nodes --whitelist-custom-nodes`；宿主脚本覆盖设置、设备、素材与重启持久化，但不覆盖任务框、真实卷迁移与通知计次。
3. **前端命令偏差**：环境无 pnpm，未执行 `vite build`；用本地 `vitest` 直接运行组件测试。`node frontend/scripts/check-build.mjs` 已通过，`js/main.js` 与源码一致（O-6 已核）。
4. **前端并行竞态**：见 ENV-001。
5. **TC-119 预期修订**：原计划假设“源变更后重试可完成”；实测 `SOURCE_CHANGED` 不在重试集合，批准绑定冻结指纹，正确行为是重新提案。已按该契约更新 TEST_PLAN 与用例。
6. **TC-121 部分覆盖**：现有用例覆盖 DB 切换前/后崩溃点，未覆盖“复制/发布第 2 帧后”中断；未新增该夹具。
7. **TC-122 终态**：已确认口径 A——`skipped` 且 `remaining=0` 仍为 `partial`，并返回 `skipped_assets` 明细；计划 §13-7 已关闭。
8. **AC-08 仍为 Proposed**：联合验收未执行。
9. **MCP 仅进程内**：未启动独立 stdio，未验证真实传输。
10. **宿主脚本修正**：`storage-host.mjs` 的设置首页三项、导入模式标签、首选标记，以及 `equipment-host.mjs` 的成功回执等待已过期（DEV-080/DEV-100 后回执走宿主通知），本轮修正后才通过；属 Test Defect。
11. **旧库升级在进程内执行**：0001/0002/0003 副本由测试夹具构造，不是用户现场库副本。
12. **新增用例的测试实现由 Main Agent 编写并自测**，未经独立审查；其断言强度见 §4 覆盖列。

## 9. Residual Risks

- 宿主通知的计次、语言与消失行为未断言（AC-25）。
- 真实 Agent 客户端（legacy 与现代确认）未验证（AC-07）。
- 异常库（身份冲突、缺库、未知结构）未验证（AC-13）；0001/0002/0003 升级已在进程内验证（AC-12）。
- 双物理 SSD、1000 帧实文件与吞吐未验证（AC-28）。
- 跨卷拓扑判定、真实配额与容量竞争未验证（AC-14/26/28）。
- 任务框在宿主上的全局可见性与刷新恢复未验证（AC-27）。
- 前端并行运行不稳定，可能影响后续 CI 判定（ENV-001）。

## 10. Final Assessment & CLOSE Recommendation

**INCOMPLETE**。已执行范围的 45 项 TC 通过（24 项 Full、21 项 Partial），未发现产品缺陷；隔离宿主、0001/0002/0003 升级与 SPEC-001/Q-04 已复测。真实 MCP 客户端、真实卷迁移、双 SSD 与任务框仍未执行，且审查门禁尚未确认，不能给出 `PASS` 或 `PASS WITH ACCEPTED RISKS`。

不建议现在进入 CLOSE。前置条件：

1. 独立审查门禁确认（或用户明确接受按当前证据推进）。
2. 准备真实卷（第二物理盘）执行 TC-110 迁移与 TC-113 双盘吞吐；准备 1000 帧并通过浏览器上传。
3. 启动独立 stdio MCP 与真实 Agent 客户端（legacy 与现代确认），执行 TC-117/TC-117-R7 与 AC-08 串联。
4. 执行 TC-116-R1 异常库与 TC-116-R3 离线重定位；补齐 TC-112 宿主任务框与 TC-121 剩余崩溃点。
5. 全绿后复核结论；SPEC-001 C 与 Q-04 A 已确认并落地。

## 11. Test Run History & Evidence Index

| 证据 | 路径 |
| --- | --- |
| 环境记录 | [assets/test-runs/RUN-001/environment.md](assets/test-runs/RUN-001/environment.md) |
| RUN-003 环境与宿主参数 | [assets/test-runs/RUN-003/environment.md](assets/test-runs/RUN-003/environment.md) |
| 后端+集成XML | `assets/test-runs/RUN-001/backend-integration.xml` |
| MCP XML | `assets/test-runs/RUN-001/mcp.xml` |
| 前端XML | `assets/test-runs/RUN-001/frontend.xml` |
| 后端+集成结果 | 207 passed, 6 skipped（164.02s） |
| MCP 结果 | 93 passed（17.24s） |
| 前端结果 | 109 passed / 16 files（36.96s，串行） |
| RUN-002 后端+集成 | 208 passed, 6 skipped（143.03s） |
| RUN-002 MCP | 93 passed（16.50s） |
| RUN-002 前端 | 109 passed / 16 files（33.84s，串行） |
| RUN-003 后端+集成 | 209 passed, 6 skipped（137.35s） |
| RUN-003 宿主 pytest | 1 passed（`tests/integration/test_host_runtime.py`，7.72s） |
| RUN-003 存储宿主 | `storage-host.mjs` 两段 PASS（设置、导入模式、位置追加、预览设置、重载） |
| RUN-003 素材宿主 | `assets-host.mjs` PASS（项目模板、Reference、Copy 上传、跨标签拖放、虚拟移动、树导航） |
| RUN-003 设备宿主 | `equipment-host.mjs` prepare + verify(delete) 通过（七屏、四类设备、重启持久化、删除保护） |

本轮新增用例（8，RUN-002 后）：

- `tests/integration/test_direct_import.py::test_preview_expiry_and_revision_conflict_leave_no_job`
- `tests/integration/test_agent_imports.py::test_source_change_after_approval_keeps_the_frozen_fingerprint`
- `tests/integration/test_agent_imports.py::test_retryable_start_failure_keeps_the_approval`
- `tests/integration/test_agent_imports.py::test_group_plan_summary_and_unresolved_are_separate`
- `tests/integration/test_agent_imports.py::test_retry_rejects_completed_groups_and_changed_settings`
- `tests/integration/test_storage_init.py::test_bootstrap_lock_timeout_and_restart_reuse_identity`
- `tests/integration/test_photography_library.py::test_copy_import_preserves_fits_bytes_and_scientific_headers`
- `tests/integration/test_agent_imports.py::test_binding_version_conflict_flags_new_approval_and_keeps_retry`（RUN-002）
- `tests/integration/test_storage_init.py::test_legacy_0001_database_upgrades_and_preserves_equipment`（RUN-003）

## 用户验收决定

2026-11-22，用户明确接受本报告列明的剩余缺口。Feature 按带例外的决定关闭，RUN-003 实测结论仍为 INCOMPLETE。详见 [CLOSE](07_CLOSE.md)。
