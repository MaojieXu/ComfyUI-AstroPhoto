---
name: feature-pipeline
description: 按 AstroPhoto Feature Lifecycle SOP v2.0 初始化、接续或推进单个 Feature。用于 PRD、交互原型、技术设计、定向源码披露、开发、测试、变更传播、Close、归档和重开。
---

# AstroPhoto Feature 生命周期 v2.0

先确认用户本轮要求和授权范围，定位唯一 Feature，读取最新完整主文档、现有索引和必要的上游材料。Local 有仓库访问时核对仓库根、HEAD、相关未提交改动与环境。已有产物从当前阶段继续，按需读取下表对应的长版 Prompt。只写文档或只读核对时按该范围交付。Prompt 中的示例、变量和“现在开始”都以本轮任务为前提。

## 阶段路由

| 阶段 | 触发与产物 | 加载 |
| --- | --- | --- |
| PH-00 初始化 | 新 Feature 或需定位阶段时核对身份、范围、基线、入口和续做位置，按需写 `00_FEATURE_INDEX.md`。 | [00 初始化](reference/00-initialize.md) |
| PH-01 产品需求 | 起草、迭代、评审或定稿需求，维护 `01_PRD.md`。用户明确要求保存草案可直接写，正式基线由定稿或明确导出要求确定。 | [01 PRD](reference/PRD.md) |
| PH-02 UI/UX | 用户可见交互或状态需要设计时制作实际可评审原型，确认后定稿 `02_UI_UX.md`。无需 UI 设计时记录 N/A 与原因。 | [02 原型与规格](reference/02-ux.md) |
| PH-03 技术设计 | 写模块、数据流、宿主接入、接口、错误和实现切片，产物为 `03_TECH.md`。技术事实缺依据时，可先用 04A 定向核实。 | [03 技术设计](reference/03-technical-design.md) |
| PH-04 源码披露 | 按请求只读核实真实路径、符号、调用关系、约束和复用依据，记录无法核实的事实。 | [04A 源码披露](reference/04A-source-disclosure.md) |
| PH-04 开发规格 | 用户要求实现计划或开发规格时写 `04_DEV.md`，细化到实际文件、函数、helper、拒绝规则和必要的副作用顺序。 | [04B 开发规格](reference/04B-development-spec.md) |
| PH-04 业务实现 | 获得实现授权后修改业务代码，并在 `04_DEV.md` 同步已落地行为、偏差和剩余工作。 | [04C 业务实现](reference/04C-implementation.md) |
| PH-05 测试设计 | `05_TEST_PLAN.md` 可先记录预计场景，业务实现后按真实代码定稿规则、分支和测试范围。 | [05 测试计划](reference/05-test-plan.md) |
| PH-06 测试与修复 | 实际编写并执行适用测试，定位失败、修复并复测，将基线、结果和证据写入 `06_TEST_REPORT.md`。 | [06 测试执行](reference/06-test-execution.md) |
| PH-07 Close | 对照需求、代码和验证证据判定完成度，记录遗留与复用候选，产物为 `Close.md`。 | [07 关闭](reference/07-close.md) |
| PH-08 归档与回流 | 归档已关闭的专题，核验移动、历史和引用，按证据与授权回流共享知识。 | [08 归档](reference/08-archive.md) |
| 跨阶段变更 | 融合最新决定、用户编辑或实现偏差，检查整条链路的影响，只更新受影响且在授权内的文件。 | [09 变更传播](reference/09-change-propagation.md) |
| 接续与重开 | 继续已有工作、只读查看归档或按授权重开，恢复基线与证据，保留旧关闭历史。 | [10 接续与重开](reference/10-resume-reopen.md) |

PH-00 至 PH-08 用于单个 Feature，与 `astrophoto-sop` 的 S0–S9 独立。设计有据返回上游时，只重开受影响的决定和验证。正式阶段结论引用真实证据，已有明确决定直接沿用。

## 路径与旧文档兼容

- 活动专题使用 `.agents/features/<feature-slug>/`，关闭后使用 `.agents/features/archive/<feature-slug>/`。保持 slug、FR、Q 和 Case 等编号稳定。`INDEX.md` 用于跨专题导航，`00_FEATURE_INDEX.md` 用于单专题状态和接续。原型、引用、执行证据分别按需放入 `prototypes/`、`references/`、`evidence/`。
- 新产物用阶段表的标准名。现有 `PRD.md`、`UXUI.md`、`Tech.md`、`Implement.md`、`Test_Plan.md`、`Test_Report.md` 依次视作 `01_PRD.md` 至 `06_TEST_REPORT.md` 的同阶段文档。通常更新现有权威文件，用户授权切换命名时核对身份和已有链接后再迁移。新旧名字同时存在时先查内容和引用，确认权威版本再写。
- 重开时先校验可恢复的归档快照，保留必要的未跟踪证据，再恢复唯一活动目录。`history/<closure-id>/` 与 `HISTORY_INDEX.md` 保留旧结论。再次归档先检查身份与目标冲突，保留历史，最后以最终清单和链接验证结果为准。

## 证据、测试与交接

- 分开写明用户确认的需求、建议或待决策、源码中的实际行为、运行观察和测试结论。测试记录保留 HEAD、相关未提交改动、依赖、环境、命令、结果和证据。基线改变后按影响决定复测范围，保留旧运行的原结果。
- 设计期可记录预计测试。业务实现结束后定稿测试规格、编写测试并集中回归。开发中的定向 Bug 诊断和已有强制质量门按实际需要执行。测试未执行、被阻塞、条件跳过或证据不足时记录对应状态。必要验收缺失时，Close 记录实际完成度和遗留事项。
- 稳定架构与契约回流 `docs/`，可复用协作方式回流 `.agents/workflows/` 或职责对应的 skill，长期路由留在 `AGENTS.md`。专题证据随 Feature 保存。安装或发布是单独的操作，按实际授权执行。
- 当前交接使用 `.agents/handoff/` 的唯一现行入口。Feature 任务影响交接时，按 [handoff-maintenance](../handoff-maintenance/SKILL.md) 核对并同步相关文件。`core/` 最多 20 篇 Markdown，`module/<模块>/` 中每个模块分别最多 20 篇。各目录递归、独立计数，整套 Handoff 没有合计篇数上限。交付包正文须自足，保留必要语义与原始证据。

路由与长版 Prompt 依据用户提供的《AstroPhoto Feature Lifecycle SOP v2.0》，2026-11-21。
