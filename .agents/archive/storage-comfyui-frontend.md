---
task: storage-comfyui-frontend
status: completed
updated: 2026-11-17
---

## Goal

按 ComfyUI Frontend 官方实现重做 AstroPhoto Storage 设置页，保留现有存储业务接线。

## Progress

- 使用 astrophoto-reuse-reference 委派三次只读调研，落实官方弹窗接口、设置分组、紧凑表单、单选与列表模式。源码对照见 docs/react-sidebar.md。
- 新建工作区按需展开；工作区操作收在省略号内，Escape 收起并恢复焦点。重命名、迁移、重定位、移除和清理接入官方宿主弹窗。
- 重新构建共享前端资源并在内置浏览器打开新版。

## Verified

- `pnpm -C frontend typecheck`、`lint`、`test:react`（37）、`test`（Vue Chromium 9）、`check:build`、`check:proxy` 通过。
- 真实 ComfyUI 1.59.1 上验证 16 px 单选、280/420/640 px 表单宽度、中英／明暗、原生迁移与清理弹窗、Escape 焦点。检查未发出存储写入。
- React 测试验证宿主弹窗取消、迁移回执和清理回执。更新全量宿主脚本选择器并通过 `node --check`。

## Decisions

宿主 Vue 设置控件未通过公开模块导出。沿用公开侧栏及 dialog 服务，按官方源码适配 React 版业务表单。

## Blockers

本次未在浏览器重新执行实际迁移或清理。真实宿主验证覆盖打开与取消，业务写入回归使用 React 测试。

## Next

存储下一次端到端验收时，在独立宿主重跑 `pnpm -C frontend test:storage-host`。
