# ComfyUI 扩展底座与绘图节点 · Close 草案

## 初步判定

`PARTIAL` · 2026-11-21。历史业务已有交付，当前基线的逐项验收仍待核实。受影响的原始材料保留在对应来源。

| 需求 | 交付摘要 | 历史证据与当前状态 |
| --- | --- | --- |
| FR-01 | V3 加载和状态真实 | 历史宿主读取与自动化有证据。当前验收待复核。 |
| FR-02 | 画板像素与旧值兼容 | 历史真实像素回归通过。当前验收待复核。 |
| FR-03 | PNG 到下游 IMAGE | 上传有历史证据；正式队列历史 FAIL，后续 SKIP。当前验收待复核。 |

## 遗留与接续

- R-01。真实 PNG 上传后 `LoadImage → IMAGE` 曾失败，后续宿主像素回归显式跳过该队列步骤。 负责人待指定。
- 在隔离宿主复跑 `vue-basic → PreviewImage`，核对临时路径、队列 history 和下游图像，保存失败或成功的原始回执。
- 可复用的既有契约与规则沿用下列来源。用户本轮确认的合并范围由专题总览追踪。 [architecture.md](../../../docs/architecture.md) · [publishing.md](../../../docs/publishing.md) · [backend-standardization.md](../../../.agents/notes/backend-standardization.md) · [drawing-persistence.md](../../../.agents/archive/drawing-persistence.md) · [react-sidebar.md](../../../docs/react-sidebar.md)

## v0.5 接续

维持 `PARTIAL`。前端迁移的两种画布运行已覆盖像素恢复、撤销重做和临时上传，正式 IMAGE、分享规则与慢恢复仍按各自用例评审和验收。Q-01～03 均未决定。 [需求](01_PRD.md) · [证据范围](06_TEST_REPORT.md)

[索引](00_FEATURE_INDEX.md) · [实现](04_DEV.md) · [测试报告](06_TEST_REPORT.md)
