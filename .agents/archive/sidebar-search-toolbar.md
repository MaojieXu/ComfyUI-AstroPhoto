---
task: sidebar-search-toolbar
status: completed
updated: 2026-11-17
---

## Goal

用 ComfyUI 1.59.1 节点库的单行搜索、筛选和排序布局替换 AstroPhoto 两个列表的工具栏。

## Progress

- 核对 SidebarTopArea、SearchInput、FilterDropdown 和节点排序策略的本地参考源码。
- 两页共用单行搜索样式、筛选与排序菜单，保留输入法与清空行为。节点筛选作用于真实目录，两页分别保存排序偏好。

## Verified

- 当前节点目录来自 `/object_info`。素材页仅有状态 API，尚无素材记录接口。
- `pnpm -C frontend test:react` 通过 33 项，`typecheck`、`lint`、`build` 和 `check:build` 均通过。
- 真实 ComfyUI 的 967×955 视口中，两页工具栏的位置、间距、尺寸、圆角和背景与原生节点库一致。验证了节点筛选入口、搜索清空、素材筛选和排序菜单、Escape 焦点恢复以及 535px 下单行无溢出。实际排序顺序由多节点 React 测试覆盖。

## Decisions

- 节点使用真实分类及原始／字母顺序。素材保留帧类型并记录排序偏好，接入真实数据后才能应用。

## Blockers

- 真实素材列表的筛选与排序需要素材服务。本次工具栏已实现。

## Next

- 刷新 ComfyUI 页面查看工具栏。
