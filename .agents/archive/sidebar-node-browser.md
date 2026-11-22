---
task: sidebar-node-browser
status: completed
updated: 2026-11-21
---

## Goal

按侧栏 PRD v0.13 完成代码、回归、真实双画布宿主及 Feature Pipeline 证据闭环。

## Progress

- 从 f84442b 和既有 Feature 文档接续。按 Prompt 04C 实施目录、收藏、画布和导航，再按 Prompt 05/06 集中验证。
- 工作树还有工作区与 Siril 的并行改动，保留其内容。修复共享中英词条文件中两处会中断编译的缺逗号。
- 官方 1.59.6 的 app、GraphCanvas、settingStore、onboardingReset 提供薄适配依据，实际差异记录在专题 DEV。

## Verified

- `pnpm -C frontend typecheck` 在主体实现后通过。
- 隔离快照的 Chromium 13 文件 66 项通过，typecheck/lint/build/proxy 门通过。
- 改名包在 ComfyUI 0.46.0 / Frontend 1.59.6 双画布通过主/子图、只读及仅选择、Undo/Redo、重开、坐标、Nodes 2.0 目标与控件、旧拖放及精确收藏的宿主验证。详见专题 TEST_REPORT scope-r6。

## Decisions

- 已从摄影素材库现行索引核实用户确认的 v0.7 / UI/UX v1.0 决定；侧栏文档更新至 v0.14 / D-18。

## Close

- 集成基线为 PRD v0.14。共享构件 75 项通过；Windows / Chromium 的 ComfyUI 0.46.0 / Frontend 1.59.6 两画布均实测通过。详见专题 TEST_REPORT 的 integrated-r6 与 Close。
- 后续 D-19 修复顶层标签首页。基线 `f84442b` 加当前工作树，前端 14 文件 76 项通过，本地 8188 页面实测三标签返回首页。类型、Lint、构建和代理检查通过。见 PRD v0.15 和 TEST_REPORT 的 D-19 记录。
