# Siril 集成与 FITS AutoStretch · Close 草案

## 初步判定

`PARTIAL` · 2026-11-21。历史业务已有交付，当前基线的逐项验收仍待核实。受影响的原始材料保留在对应来源。

| 需求 | 交付摘要 | 历史证据与当前状态 |
| --- | --- | --- |
| FR-01 | CLI 探测与验证 | 历史真 CLI 与模拟版本拒绝证据。当前验收待复核。 |
| FR-02 | FITS 候选与 Inspector | 历史真实浏览器与替身证据。当前验收待复核。 |
| FR-03 | 真实 FITS 处理、持久化与串联 | 历史 Windows 真队列和串联有实证。当前验收待复核。 |

## 遗留与接续

- R-01。当前 Bundle 路径、前端构建入口及原有测试夹具需对账；目标宿主、其他平台和大资源样本缺同基线验收证据。 负责人待指定。
- 对齐 P0 Bundle 的后端路由、浏览器注册和测试夹具；在隔离宿主复跑配置、候选、真实 CLI 链和重新打开工作流。
- 可复用的既有契约与规则沿用下列来源。用户本轮确认的合并范围由专题总览追踪。 [siril.md](../../../docs/siril.md) · [siril-autostretch.md](../../../.agents/notes/siril-autostretch.md) · [verification.md](../../../.agents/handoff/core/verification.md)

[索引](00_FEATURE_INDEX.md) · [实现](04_DEV.md) · [测试报告](06_TEST_REPORT.md)

## v0.4 接续判定

维持 `PARTIAL`。当前范围已有 Bundle 和最终 Registry 的 Windows 双画布单节点实测。完整 Close 需对照 Q-01、Q-02、Q-06 的决定，取得原生双节点、完整科学样本矩阵及工作区迁移/离线复验证据。旧串联与 Horsehead 记录保留其原基线。 [PRD](01_PRD.md) · [当前测试计划](05_TEST_PLAN.md)
