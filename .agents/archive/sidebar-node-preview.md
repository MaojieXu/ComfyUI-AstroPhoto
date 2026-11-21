---
task: sidebar-node-preview
status: completed
updated: 2026-11-17
---

## Goal

让 AstroPhoto 节点行显示原生风格的悬停预览，放在侧栏外并在拖动时隐藏。

## Progress

- 核对本地 ComfyUI 1.59.1 的行组件、预览定位、预览卡片和节点图标。
- 节点行使用原生图标；预览挂到 body，保留点击详情、加号和拖放。

## Verified

- 当前目录的节点名称、描述和端口来自真实节点定义。
- `pnpm -C frontend test:react` 通过 33 项；`typecheck`、`lint`、`build`、`check:build` 通过。
- 从 `comfyenv` 启动真实宿主。Chromium 验证左右侧栏的 16px 间距、535×350 视口的边界约束、端口内容、切换标签后关闭、加号创建以及真实拖放时隐藏预览。

## Decisions

- 使用 React Portal 与宿主主题。缩略图根据节点定义渲染，不创建画布节点或运行 widget。

## Blockers

- 暂无。

## Next

- 刷新 ComfyUI，在节点树中展开 examples 并悬停 Vue Basic。
