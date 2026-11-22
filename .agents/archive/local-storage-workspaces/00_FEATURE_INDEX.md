# 本地存储与工作区 · 阶段索引

**标识** `local-storage-workspaces` · v1.3 · 2026-11-21

本专题管理本机 Data Root、工作区、默认写入位置和可重建 Cache，并追踪迁移结果、取消与中断恢复。

## 基线与来源

`003c599` 是历史存储提交。既有源码披露基线为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加当时工作树。实现基线 HEAD 为 `f84442b` 加当前工作树，本轮运行新的后端、Chromium 与目标宿主。旧披露时相关未提交变更包含 `__init__.py`、`astrophoto/bootstrap.py`、`astrophoto/storage/runtime.py`、`astrophoto/api/routes.py`、Vue 侧栏/存储模块与测试，HEAD 的 React 页面和旧宿主脚本仅用于解释历史行为。历史 Windows 0.45.0/1.59.1 与当前目标 0.46.0/1.59.6 分开记录。 [开发环境](../../../docs/development.md) · [历史交付](../../../docs/local-storage.md) · [历史界面证据](../../archive/storage-comfyui-frontend.md)

| 阶段 | 当前产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，当前与历史基线已定位 |
| PH-01 | [产品需求](01_PRD.md) | COMPLETE，PRD v1.1；Q-01、Q-10、Q-33～43 已归并为 D-15～27 |
| PH-02 | [交互规格](02_UI_UX.md) | 实现并经 Chromium 与真实 ComfyUI 验证；[评审原型](prototypes/storage-review.html)保留 |
| PH-03 | [技术设计](03_TECH.md) | v1.3 更新有效根判定、搬家共用预检和状态/清源契约 |
| PH-04 | [开发规格与实现](04_DEV.md) | R-01～R-05 已修复 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | CASE-10～14 转正式回归，补 R-04/R-05 HTTP；其余缺口保留 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | v1.3 定向 9 通过，后端 118 通过 / 6 跳过，MCP 92 通过，组件 7 通过 |
| PH-07 | [Close](Close.md) | PARTIAL，真实宿主退出与回归待验 |
| PH-08 | [专题总览](../INDEX.md) | NOT_STARTED，专题保持活动 |

独立迁移运行覆盖真实宿主 Storage 常规操作和部分错误回归（03-A～03-C）。真实宿主清理用空 Cache，第二卷用例跳过；完整 Feature 的权限、Cache 文件记账、迁移提交前后恢复和真实离线卷仍需验收。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

已确认本机默认写入、单写宿主、停机搬家、部分迁移、工作区迁移后自动清源、每盘配额及会话清理。免额外来源授权、同卷共享配额、手动换盘及按量迁移算法也已定稿。自动清源、仅重试剩余清理已用同卷受管数据及故障注入复验，跨卷和压力测试延期。

## 决定与下游追踪

| 决定 | UX 与技术/开发落点 | 预计验收 |
| --- | --- | --- |
| D-15 自动清除已迁受管源副本 | 完整/按量预检及回执，T-03，DEV 切片 4 | CASE-02/04/07D |
| D-16 本机业务直接可用 | 动作级可用性与素材来源，T-02，切片 2 | CASE-03/06/08 |
| D-17 同卷共享额度、D-18 手动选址 | 每卷一行及手动切换，T-04，切片 3/5 | CASE-02/04/06/09 |
| D-19～22 按量计划、百分比、组序、差额确认 | 预检/确认/回执与原型，T-03，切片 4/7 | CASE-07B～D，CASE-09 |
| D-08 停机整库、D-12 会话清理 | 实例入口与临时数据，T-01/T-05，切片 1/5/6 | CASE-01/03/07A/08 |

按当前 [TEST REPORT](06_TEST_REPORT.md) 查询有效证据及条件跳过。

## v1.2 评审

2026-11-21 的[代码评审](references/code-review.md)在基线 `f84442b` 加现行工作树上确认 1 项高、5 项中高/中、8 项低问题（R-01～R-15），其中 R-01（提交后清源无目标核验）、R-02（Validate 漏报缺件）与 R-03（整库搬家崩溃窗口无恢复路径）阻断收口。缺陷已用 `tests/backend/test_storage_review.py` 的 5 项 `xfail(strict=True)` 锁住实际行为，修复后必须转正并更新 [测试计划](05_TEST_PLAN.md#v12-评审增量--2026-11-21) 与 [Close](Close.md)。本轮业务代码未改动，Close 维持 `PARTIAL`。

## Pi 评审接续

Q-39～43 已确认，产品规则已同步至 UX、TECH、DEV 和测试计划。实例写排他、共享卷容量、已提交清源和退出接线已落地。测试覆盖和实际运行见上表。
