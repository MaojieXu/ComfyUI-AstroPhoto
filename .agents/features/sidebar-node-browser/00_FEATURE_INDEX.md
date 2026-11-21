# 侧栏与节点浏览 · 阶段索引

**标识** `sidebar-node-browser` · v0.7 · 2026-11-21 · 产品与架构评审

工作流作者通过 AstroPhoto Sidebar 查找、收藏和了解已注册节点，并把节点添加到当前工作流。

当前依据为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 已有未提交变更，涉及删除的 `frontend/ui/`、新增的 `frontend/src/{features,api,host,shared,styles}/`、`extension/frontend-entry.ts`、Vue/宿主测试和统一构建产物。React 参照为 `5e39fcf`、`003c599` 及 `4c0cf4d:frontend/ui/`。迁移目标为 Backend 0.46.0 / Frontend 1.59.6。 [开发环境](../../../docs/development.md) · [历史侧栏](../../../docs/react-sidebar.md)

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，已定位现行源码与历史基线 |
| PH-01 | [产品需求](01_PRD.md) | IN_PROGRESS，Q-04 已确认。Q-01～03、Q-05～14 待评审，按画布、目录收藏、导航预览分批确认 |
| PH-02 | [交互规格](02_UI_UX.md) | IN_PROGRESS，已核对现行源码，目标宿主待复验 |
| PH-03 | [技术设计](03_TECH.md) | COMPLETE，已记录契约和风险 |
| PH-04 | [开发规格与实现](04_DEV.md) | COMPLETE，已回填实际代码和差距 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | READY，已按代码定稿当前拟验证范围 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | 历史证据，本轮 NOT_RUN |
| PH-07 | [Close 草案](Close.md) | PARTIAL，待正式验收 |
| PH-08 | [专题总览](../INDEX.md) | 活动专题 |

同一迁移工作树已有独立宿主记录覆盖双画布正常添加、拖拽和撤销。下一次按当前测试计划核对详情缺口、画布负向覆盖和收藏异常。 [迁移批次](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)
