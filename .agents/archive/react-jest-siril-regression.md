---
task: react-jest-siril-regression
status: completed
updated: 2026-11-18
---

## Goal

按用户选定的两项方案 A 修复默认 Jest 的 CSS 加载和 Siril 软件管理回归用例。

## Progress

- Jest 将 CSS 导入映射到测试专用空模块，保留宿主与 Vue 控件映射。
- Siril 用例使用当前状态响应及软件列表到详情的导航。错误版本提交后检查提示、活动路径，并重开详情验证重新读取到的配置。

## Verified

- pnpm -C frontend test:react · 10 个套件、47 个测试通过。
- pnpm -C frontend typecheck · 通过。
- pnpm -C frontend lint · 通过。

## Decisions

使用已有 JSDOM 测试入口和模拟 HTTP。上一版交接报表保留原审计结果。

## Blockers

无。只涉及上述前端测试和配置，真实 ComfyUI 与 Siril CLI 未在本次运行。
