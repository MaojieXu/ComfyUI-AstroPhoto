# 侧栏与节点浏览 · Close 草案

## 初步判定

`PARTIAL` · 2026-11-21。历史业务已有交付，当前基线的逐项验收仍待核实。受影响的原始材料保留在对应来源。

| 需求 | 交付摘要 | 历史证据与当前状态 |
| --- | --- | --- |
| FR-01 | 单侧栏与宿主同步 | 历史宿主与组件证据。当前验收待复核。 |
| FR-02 | 真实节点目录与书签 | 历史目录通过；书签有专项记录，目标宿主待重验。当前验收待复核。 |
| FR-03 | 本机画布实例创建 | 历史宿主已验证主图、子图与撤销。当前验收待复核。 |

## 遗留与接续

目前维持 PARTIAL。目标宿主的两种画布正常路径已有独立迁移批次证据，子图撤销、覆盖层与错误场景、收藏失败和导航状态仍按测试计划核对。Settings 各领域功能和 Assets 实际启用分别由对应专题确认。 [测试计划](05_TEST_PLAN.md)

- R-01。历史 React/宿主 API 兼容证据对应 0.45.0 / 1.59.1，Vue 迁移后的书签和两种画布需独立验证。 负责人待指定。
- 按 P0 迁移的目标宿主分别验证节点目录、书签、经典画布和 Nodes 2.0，记录未覆盖的编辑模式。
- 可复用的既有契约与规则沿用下列来源。用户本轮确认的合并范围由专题总览追踪。 [react-sidebar.md](../../../docs/react-sidebar.md) · [node-bookmarks.md](../../../.agents/notes/node-bookmarks.md) · [sidebar-node-tree.md](../../../.agents/archive/sidebar-node-tree.md) · [native-sidebar-tabs.md](../../../.agents/archive/native-sidebar-tabs.md)

[索引](00_FEATURE_INDEX.md) · [实现](04_DEV.md) · [测试报告](06_TEST_REPORT.md)
