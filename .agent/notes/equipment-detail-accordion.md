---
task: equipment-detail-accordion
status: handoff
updated: 2026-11-18
---

## Goal
设备和光路详情摘要及分组折叠展示。

## Progress
- 已连接设备、光路和历史版本只读接口，增加分组和设备跳转。
- 历史快照当前以原始 JSON 展示，需进一步完成本地化字段视图。

## Verified
- 前端 typecheck、build、Vue test 9 项通过。
- React 全量 40 通过、4 失败，均在 navigation.test.tsx。
- Accordion 与设备测试单独运行 7 项通过。

## Decisions
- 继续保存此前的隐藏光路状态数据，不修改后端。

## Blockers
- 真实宿主双语言、明暗、窄宽及历史版本交互未验收。

## Next
- 完善历史快照可读展示并补齐设备字段边界与真实宿主交互验证。
