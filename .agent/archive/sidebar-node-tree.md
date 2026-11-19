---
task: sidebar-node-tree
status: completed
updated: 2026-11-17
---

## Goal

将节点分类渲染为 ComfyUI 1.59.1 风格的树。支持多层分类、独立展开、紧凑节点行和搜索展开。

## Progress

- 核对宿主 TreeExplorerV2Node、缩进及搜索展开逻辑。前一轮工具栏代码已在工作区。
- 从分类路径生成 React 树，独立控制文件夹展开。紧凑节点行保留详情、添加、拖放。更新宿主脚本以先展开 examples。

## Verified

- 节点列表继续使用现有 `/object_info` 目录。
- `pnpm -C frontend test:react` 通过 33 项，覆盖多层分类、筛选、排序和搜索展开。`typecheck`、`lint`、`build`、`check:build` 通过。
- Chromium 在真实宿主验证 examples 默认收起、子行多 24px 缩进、详情、搜索及恢复展开状态、加号与实拖创建 vue-basic。

## Decisions

- 从真实 category 路径构建树，在 React 侧使用原生按钮和列表。保留节点详情、添加及拖放。

## Blockers

- 本次宿主验证覆盖节点树与画布添加。素材列表仍依赖素材服务。

## Next

- 刷新 ComfyUI 并在节点页展开 examples。
