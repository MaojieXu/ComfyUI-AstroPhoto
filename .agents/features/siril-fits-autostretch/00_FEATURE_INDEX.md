# Siril 集成与 FITS AutoStretch · 阶段索引

**标识** `siril-fits-autostretch` · v0.6 · 2026-11-21 · 活动 Feature
**现状** 已补工作区与资产恢复、FITS 保真、候选与正式结果契约。独立 Feature 验收未运行。Close 草案为 `PARTIAL`。

可信本机加载合规单帧 FITS，以验证过的 Siril 1.4.5 生成候选和正式拉伸结果。候选用于比较；正式科学 FITS 与回执登记到活动默认 Workspace，路径可串联。

## 基线与变更

- 当前源码为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 dirty 工作树。`__init__.py`、`nodes/scientific.py`、`astrophoto/api/routes.py`、`tests/backend/test_siril.py`、`tests/integration/test_siril_api.py` 为修改；`extension/siril/`、`extension/frontend-entry.ts`、`astrophoto/api/scientific.py`、`astrophoto/assets/fits.py` 和 Vue 来源、候选、测试、宿主脚本为当前工作树新增路径。重复核对可使用 `git status --short -- __init__.py astrophoto extension frontend nodes tests`，对跟踪文件使用 `git diff HEAD -- <路径>`，对新增文件读取当前磁盘。
- 原处理模块 `astrophoto/siril/` 和 `astrophoto/api/siril.py` 在工作树删除，后端与浏览器生产入口迁至 Siril Bundle，通用 FITS 路径与设置独立注册。变更记录 `CH-01`（静态核验）影响 FR-01～05 的源码、UI 和测试路径，历史 ID 保留。`CH-02` 登记 Assets 页占位、画布固定尺寸、配置取消边界，涉及 Q-04、Q-05 和独立重验。无新的产品确认。
- `003c599` 为 FITS 路径、预览与正式处理的历史提交。Windows 0.45.0 / 1.59.1 和 Siril 1.4.5 的旧运行可回查；本轮未验证当前宿主、真实 CLI、异平台及容量与中断边界。另有 2026-11-21 Windows ComfyUI 0.46.0 / Frontend 1.59.6 / Siril 1.4.5 的既有验证，经典和 Nodes 2.0 都覆盖配置、候选、单节点正式输出及工作流重开。测试使用同 HEAD 加当时 dirty 工作树；旧日志不覆盖当前新增边界或证明所有 dirty 文件一致。原证据按各自基线保存。 [对应验证](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) [Siril 说明](../../../docs/siril.md) · [历史任务笔记](../../notes/siril-autostretch.md) · [测试报告](06_TEST_REPORT.md)

## 阶段与接续

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE · 已定位身份和当前基线 |
| PH-01 | [产品需求](01_PRD.md) | IN_PROGRESS · v0.6 边界评审稿，Q-01～20 待确认，FR-06～09 为待评审提案 |
| PH-02 | [交互规格](02_UI_UX.md) | IN_PROGRESS · 静态对齐，真实宿主、焦点和布局待验证 |
| PH-03 | [技术设计](03_TECH.md) | READY · 当前路由、数据与权限已定位 |
| PH-04 | [开发规格与实现](04_DEV.md) | READY · 实现与 Guard 已核对，产品差距保留 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | READY · CASE-01～14，含科学样本矩阵和工作区故障场景 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | NOT_STARTED · 独立 Feature 复验 NOT_RUN，原宿主与最终 Registry 证据已对账 |
| PH-07 | [Close 草案](Close.md) | IN_PROGRESS · 历史 PARTIAL，尚未关闭 |
| PH-08 | [专题总览](../INDEX.md) | NOT_STARTED · 活动目录 |

先评审科学结果和输入身份，再评审正式队列和恢复、软件配置和运行、展示和管理。现有验收证据与本轮新增提案分别追踪。 [待决问题](01_PRD.md#本轮待决问题) · [验收范围](05_TEST_PLAN.md)
