---
task: 04-equipment-tab-navigation
status: completed
updated: 2026-11-18
---

## Goal
- 点击「我的设备」或「光学链路」返回对应列表，包括再次点击当前标签。

## Progress
- EquipmentPage 将标签激活交给现有离开确认，再打开对应列表。列表搜索和筛选仍由各自状态保存。

## Verified
- `pnpm -C frontend build` 通过，重新生成单一前端入口。按用户要求未运行测试。

## Decisions
- 官方 v1.59.1 的 Tab 将每次点击交给选择回调。沿用已有 SidebarTabs，在 EquipmentPage 处理业务导航。

## Blockers
- 本次未在 ComfyUI 浏览器中验证。

## Next
- 刷新前端查看此次变更。
