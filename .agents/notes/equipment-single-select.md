---
task: equipment-single-select
status: completed
updated: 2026-11-18
---

## Goal
- 新增和编辑设备复用技能收录的 ComfyUI 官方单选框。

## Progress
- 相机成像类型、制冷能力、光学类型、配件类型、滤镜类型接入同一官方 Vue 单选组件。

## Verified
- `pnpm -C frontend typecheck` 与 `pnpm -C frontend build` 通过。
- 8201 宿主提供的主样式含官方选择器和所需图标。按用户要求未运行测试，未进行浏览器验收。

## Decisions
- 使用 v1.59.1 源码。发布的 design-system 1.1.0 缺少该子路径，因此一并沿用参考库的 select.variants.ts。React 只同步值、状态和挂载生命周期。

## Blockers
- 无实现阻塞。

## Next
- 刷新 ComfyUI 前端查看新组件。
