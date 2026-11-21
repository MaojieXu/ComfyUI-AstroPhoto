# 设备与光路管理 · Close 草案

## 初步判定

`PARTIAL` · 2026-11-21。历史业务已有交付，当前基线的逐项验收仍待核实。受影响的原始材料保留在对应来源。

| 需求 | 交付摘要 | 历史证据与当前状态 |
| --- | --- | --- |
| FR-01 | 四类设备与规格校验 | 早期四类 DTO 与后端专项证据。当前验收待复核。 |
| FR-02 | 单配置光路与旧值回读 | 当前规则有专项证据；历史发布交互另计。当前验收待复核。 |
| FR-03 | 归档、恢复与保护删除 | 单配置时代有删除与回滚证据。当前验收待复核。 |

## 遗留与接续

- R-01。早期修订发布的验证只适用于旧流程；ComfyUI 资料库新入口的真实宿主行为需与 P0 迁移对账。 负责人待指定。
- 复验当前单配置、旧快照兼容及删除冲突，分别记录后端测试和目标宿主交互。
- 可复用的既有契约与规则沿用下列来源。用户本轮确认的合并范围由专题总览追踪。 [equipment.md](../../../docs/equipment.md) · [equipment-optical-train.md](../../../.agents/archive/equipment-optical-train.md) · [equipment-review-tests.md](../../../.agents/archive/equipment-review-tests.md) · [equipment-delete.md](../../../.agents/notes/equipment-delete.md)

[索引](00_FEATURE_INDEX.md) · [实现](04_DEV.md) · [测试报告](06_TEST_REPORT.md)
