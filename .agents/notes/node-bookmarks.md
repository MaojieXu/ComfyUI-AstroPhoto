---
task: node-bookmarks
status: handoff
updated: 2026-11-18
---

## Goal
扁平化 AstroPhoto 节点分类，翻译 Assets，并参考 ComfyUI 节点库提供收藏区和节点书签按钮。

## Progress
- 侧栏显示层去除 AstroPhoto 分类前缀，Assets 随宿主语言显示。原节点分类和 ID 保持不变。
- 收藏区与书签按钮使用宿主扩展设置接口读写 `Comfy.NodeLibrary.Bookmarks.V2`，保留其他节点和文件夹条目。活动页面定时同步宿主设置。
- 官方参考 ComfyUI Frontend v1.59.1 `src/components/sidebar/tabs/nodeLibrary/AllNodesPanel.vue`、`src/components/common/TreeExplorerV2Node.vue` 和 `src/stores/nodeBookmarkStore.ts`。组件依赖宿主内部 Vue/Pinia，React 树适配其外观与交互，设置接口直接复用。
- 前端发行资源通过 `pnpm -C frontend build` 生成。

## Verified
- 按用户指示本轮未新增或运行测试，未进行宿主联通验证。

## Decisions
- 收藏存储键和路径格式与 v1.59.1 官方实现一致，依赖该版本内部设置契约。收藏区只展示当前 AstroPhoto 节点。

## Blockers
- 收藏持久化、跨侧栏同步、语言与键盘交互尚未运行验证。

## Next
- 用户要求补充测试时，覆盖宿主收藏共享、目录收藏、搜索、双语及节点操作。
