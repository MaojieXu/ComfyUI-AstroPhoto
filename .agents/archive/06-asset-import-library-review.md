---
task: 06-asset-import-library-review
status: handoff
updated: 2026-11-21
---

## Goal

按当前代码补充素材导入与资产登记文档，评审 Assets 界面、回执、重绑和原件保护。

## Progress

- 基于 main 4c0cf4d 与现有工作树更新专题 PRD、交互、技术、开发、测试计划及阶段状态。
- 现有 Assets 为 Vue 占位，素材导入后端可用。公开回执最多含 100 条顺序号和错误码，缺逐项路径与资产 ID。
- 用户要求测试通过 API 删除测试数据。现有资产路由没有删除端点，已记 Q-05 与 CASE-08。
- v0.6 对照导入、回执、路径、操作恢复及科学读取源码，补充 Q-06～18 与边界追溯矩阵，均待用户评审。

## Verified

- 静态核对 `astrophoto/assets/imports.py`、`astrophoto/assets/service.py`、`astrophoto/api/assets.py` 和侧栏入口。无本轮业务运行结果。

## Decisions

- 当前材料保持评审草案。恢复 Assets 和删除语义均未取得用户决定。

## Blockers

- 测试脚本的资产 API 删除闭环依赖删除语义和接口实现。

## Next

- 按 PRD 的建议顺序评审 Q-02、Q-05 及其余待决项，确认后传播到受影响文档和测试。
