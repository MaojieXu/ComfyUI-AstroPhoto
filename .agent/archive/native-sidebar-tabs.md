---
task: native-sidebar-tabs
status: completed
updated: 2026-11-17
---

## Goal

让 AstroPhoto 的三项导航采用 ComfyUI 原生媒体资产栏标签的外观和交互。

## Progress

- 在 ComfyUI Frontend v1.59.1 核对 AssetsSidebarTab、TabList、Tab 和 tab.variants。
- 在 React App 和局部样式中移植布局、主题状态、横向滚动及键盘导航。重新构建扩展。

## Verified

- `pnpm -C frontend typecheck`、`lint`、`build`、`check:build` 均通过，`test:react` 通过 30 项。
- Chromium 535×955 真实宿主对比通过。标签起点、间距、高度、圆角、内边距、字体与选中和未选中配色一致。验证了箭头键移动焦点、Enter 和空格切换、点击切换。
- `COMFYUI_TEST_URL=http://127.0.0.1:8188 pnpm -C frontend test:host --skip-image-execution` 通过 16 项，按既定范围跳过 IMAGE 执行。

## Decisions

- React 保持三项视图和默认素材页。CSS 使用宿主主题变量及扩展自己的选择器。

## Blockers

无。

## Next

刷新 ComfyUI 后加载新构建。
