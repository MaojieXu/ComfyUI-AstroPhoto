---
name: astrophoto-frontend-reuse
description: AstroPhoto 前端开发时，遇到类似组件需求，优先复用本技能收录的 ComfyUI 官方组件。
---

# ComfyUI 前端复用

先查下方组件清单，优先复用匹配的模板。按宿主版本核对 `reference/ComfyUI_frontend`。优先调用公开组件或接口；可复用的内部组件沿用上游原源码、依赖与主题。模板为官方 Vue 源码，`@/` 别名、Reka UI、设计系统和宿主国际化等依赖按对应版本解析。

## 可复用组件

来源为 ComfyUI Frontend `v1.59.1`（`cded88fdffbb78f191fc8e454e7f2cfa5016ee43`）。素材工具栏的组合入口是 `src/platform/assets/components/MediaAssetFilterBar.vue`。

| 组件 | 原码模板 | 上游位置 |
| --- | --- | --- |
| 素材搜索框 | [SearchInput.vue](template/SearchInput.vue) | `src/components/ui/search-input/SearchInput.vue` |
| 素材排序入口与弹层 | [MediaAssetSettingsButton.vue](template/MediaAssetSettingsButton.vue) | `src/platform/assets/components/MediaAssetSettingsButton.vue` |
| 素材排序选项与勾选标记 | [MediaAssetSettingsMenu.vue](template/MediaAssetSettingsMenu.vue) | `src/platform/assets/components/MediaAssetSettingsMenu.vue` |
| 带勾选标记的单选下拉框 | [SingleSelect.vue](template/SingleSelect.vue) | `src/components/ui/single-select/SingleSelect.vue` |
| 节点目录折叠行 | [TreeExplorerV2Node.vue](template/TreeExplorerV2Node.vue) | `src/components/common/TreeExplorerV2Node.vue` |
| 节点目录树容器 | [TreeExplorerV2.vue](template/TreeExplorerV2.vue) | `src/components/common/TreeExplorerV2.vue` |

节点目录由 `src/components/sidebar/tabs/nodeLibrary/AllNodesPanel.vue` 组装。折叠行依赖 Reka UI 的 `TreeItem` 和宿主 `src/components/ui/tree/treeStyles.ts`，树容器管理展开状态。

## 添加

用户说「添加」时，核对指定组件的官方路径和版本，将上游源码按组件存到 `template/`，每个组件一个文件。同步补充清单及必要的版本、依赖和许可信息，并核对模板与上游原码一致。[模板许可](template/LICENSE)
