# 活跃源码逐路径调查边界

本页把业务源码的文件名称引用与仅有清点区分开。报告中有名的引用可能来自局部函数、模块清查或测试，并不代表覆盖文件每一行，也不代表所有防御组合已实测。纯样式、vendor、翻译、构件及依赖的进一步限制见 14。

## 有专题证据引用

| 源码 | 报告文件名（范围） |
| --- | --- |
| `__init__.py` | 03_REPOSITORY_ARCHITECTURE.md, 04_COMPLETE_FEATURE_INVENTORY.md, 11_HANDOFF_RECONCILIATION.md, backend.md, mcp-packaging.md, requirements.md, source-review.md |
| `astrophoto/__init__.py` | source-review.md |
| `astrophoto/api/__init__.py` | source-review.md |
| `astrophoto/api/assets.py` | 03_REPOSITORY_ARCHITECTURE.md, 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md, backend.md |
| `astrophoto/api/equipment.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md |
| `astrophoto/api/errors.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md, source-review.md |
| `astrophoto/api/routes.py` | 04_COMPLETE_FEATURE_INVENTORY.md, assets-equipment.md, backend.md |
| `astrophoto/api/security.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md, backend.md, nodes-siril.md |
| `astrophoto/api/siril.py` | 03_REPOSITORY_ARCHITECTURE.md, 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 11_HANDOFF_RECONCILIATION.md, backend.md, nodes-siril.md |
| `astrophoto/api/status.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/api/storage.py` | 03_REPOSITORY_ARCHITECTURE.md, 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md, backend.md, nodes-siril.md |
| `astrophoto/assets/imports.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 11_HANDOFF_RECONCILIATION.md, assets-equipment.md |
| `astrophoto/assets/service.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md |
| `astrophoto/bootstrap.py` | 03_REPOSITORY_ARCHITECTURE.md, 04_COMPLETE_FEATURE_INVENTORY.md, backend.md |
| `astrophoto/core/__init__.py` | source-review.md |
| `astrophoto/core/capabilities.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 11_HANDOFF_RECONCILIATION.md, backend.md |
| `astrophoto/core/config.py` | 04_COMPLETE_FEATURE_INVENTORY.md, backend.md |
| `astrophoto/core/errors.py` | source-review.md |
| `astrophoto/core/paths.py` | 04_COMPLETE_FEATURE_INVENTORY.md, backend.md |
| `astrophoto/database/equipment_models.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md, backend.md |
| `astrophoto/database/manager.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/database/migrations/env.py` | backend.md |
| `astrophoto/database/migrations/versions/0001_equipment_baseline.py` | 11_HANDOFF_RECONCILIATION.md, backend.md |
| `astrophoto/database/models.py` | 04_COMPLETE_FEATURE_INVENTORY.md, assets-equipment.md, backend.md |
| `astrophoto/equipment/schemas.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md, source-review.md |
| `astrophoto/equipment/service.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md |
| `astrophoto/equipment/snapshots.py` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, assets-equipment.md |
| `astrophoto/equipment/trains.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 11_HANDOFF_RECONCILIATION.md, assets-equipment.md, requirements.md |
| `astrophoto/siril/__init__.py` | source-review.md |
| `astrophoto/siril/frames.py` | 04_COMPLETE_FEATURE_INVENTORY.md, nodes-siril.md |
| `astrophoto/siril/previews.py` | source-review.md |
| `astrophoto/siril/processing.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 07_NODE_SIRIL_IMAGE_PATH.md, nodes-siril.md |
| `astrophoto/siril/software.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 11_HANDOFF_RECONCILIATION.md, nodes-siril.md |
| `astrophoto/storage/cache.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/storage/initializer.py` | 04_COMPLETE_FEATURE_INVENTORY.md, backend.md |
| `astrophoto/storage/locations.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/storage/manager.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/storage/migration.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/storage/operations.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/storage/paths.py` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md |
| `astrophoto/storage/runtime.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, backend.md, nodes-siril.md |
| `frontend/entry.ts` | 03_REPOSITORY_ARCHITECTURE.md, 08_FRONTEND_UI_AND_INSPECTOR.md |
| `frontend/src/components/DrawingApp.vue` | frontend.md |
| `frontend/src/components/DrawingBoard.vue` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/src/components/ToolBar.vue` | frontend.md |
| `frontend/src/components/VueExampleComponent.vue` | 11_HANDOFF_RECONCILIATION.md, 12_GAPS_AND_RISKS.md, frontend.md |
| `frontend/src/host.d.ts` | frontend.md |
| `frontend/src/main.ts` | 04_COMPLETE_FEATURE_INVENTORY.md, 11_HANDOFF_RECONCILIATION.md, frontend.md |
| `frontend/src/types.ts` | source-review.md |
| `frontend/src/vendor/comfyui/composables/useAttrsClass.ts` | frontend.md |
| `frontend/src/vendor/comfyui/composables/usePopoverSizing.ts` | frontend.md |
| `frontend/src/vendor/comfyui/multi-select/MultiSelect.vue` | frontend.md |
| `frontend/src/vendor/comfyui/multi-select/MultiSelectContent.vue` | frontend.md |
| `frontend/src/vendor/comfyui/multi-select/MultiSelectTrigger.vue` | frontend.md |
| `frontend/src/vendor/comfyui/multi-select/types.ts` | source-review.md |
| `frontend/src/vendor/comfyui/select.variants.ts` | frontend.md |
| `frontend/src/vendor/comfyui/select/types.ts` | source-review.md |
| `frontend/src/vendor/comfyui/select/useSelectSearch.ts` | frontend.md |
| `frontend/src/vendor/comfyui/single-select/SearchableSingleSelect.vue` | frontend.md |
| `frontend/src/vendor/comfyui/single-select/SingleSelect.vue` | frontend.md |
| `frontend/src/vendor/comfyui/single-select/types.ts` | source-review.md |
| `frontend/src/vendor/comfyui/tailwind-utils.ts` | frontend.md |
| `frontend/ui/src/api/client.ts` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/api/equipment.ts` | frontend.md |
| `frontend/ui/src/api/nodes.ts` | frontend.md |
| `frontend/ui/src/api/previewSettings.ts` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md, nodes-siril.md |
| `frontend/ui/src/api/siril.ts` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md, requirements.md |
| `frontend/ui/src/api/status.ts` | frontend.md |
| `frontend/ui/src/api/storage.ts` | 04_COMPLETE_FEATURE_INVENTORY.md, frontend.md |
| `frontend/ui/src/app/App.tsx` | 11_HANDOFF_RECONCILIATION.md, frontend.md |
| `frontend/ui/src/features/assets/AssetsPage.tsx` | 04_COMPLETE_FEATURE_INVENTORY.md, frontend.md, source-review.md |
| `frontend/ui/src/features/assets/ImportDialog.tsx` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/features/nodePreview/Inspector.tsx` | 08_FRONTEND_UI_AND_INSPECTOR.md |
| `frontend/ui/src/features/nodePreview/NodePreview.tsx` | frontend.md |
| `frontend/ui/src/features/nodePreview/PanelDivider.tsx` | frontend.md |
| `frontend/ui/src/features/nodePreview/inspector.css` | frontend.md |
| `frontend/ui/src/features/nodePreview/nodePreview.css` | frontend.md |
| `frontend/ui/src/features/nodes/NodeHoverPreview.tsx` | frontend.md |
| `frontend/ui/src/features/nodes/NodeTree.tsx` | 04_COMPLETE_FEATURE_INVENTORY.md, frontend.md |
| `frontend/ui/src/features/nodes/NodesPage.tsx` | 08_FRONTEND_UI_AND_INSPECTOR.md, 11_HANDOFF_RECONCILIATION.md, frontend.md |
| `frontend/ui/src/features/settings/EnvironmentPage.tsx` | 11_HANDOFF_RECONCILIATION.md, frontend.md |
| `frontend/ui/src/features/settings/SettingsPage.tsx` | frontend.md |
| `frontend/ui/src/features/settings/SoftwarePage.tsx` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/features/settings/StoragePage.tsx` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/features/settings/environment.css` | frontend.md |
| `frontend/ui/src/features/settings/equipment/DetailAccordion.tsx` | frontend.md |
| `frontend/ui/src/features/settings/equipment/DetailActions.tsx` | frontend.md |
| `frontend/ui/src/features/settings/equipment/EquipmentDetails.tsx` | frontend.md |
| `frontend/ui/src/features/settings/equipment/EquipmentForm.tsx` | frontend.md |
| `frontend/ui/src/features/settings/equipment/EquipmentList.tsx` | frontend.md |
| `frontend/ui/src/features/settings/equipment/EquipmentPage.tsx` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/features/settings/equipment/OpticalTrainDetails.tsx` | frontend.md |
| `frontend/ui/src/features/settings/equipment/OpticalTrainEditor.tsx` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 11_HANDOFF_RECONCILIATION.md, frontend.md, source-review.md |
| `frontend/ui/src/features/settings/equipment/equipment.css` | frontend.md |
| `frontend/ui/src/features/settings/equipment/shared.tsx` | source-review.md |
| `frontend/ui/src/features/settings/moduleRegistry.ts` | frontend.md |
| `frontend/ui/src/features/settings/storage.css` | frontend.md |
| `frontend/ui/src/features/siril/Inspector.tsx` | source-review.md |
| `frontend/ui/src/features/siril/siril.css` | frontend.md |
| `frontend/ui/src/features/storage/shared.tsx` | source-review.md |
| `frontend/ui/src/host/canvas.ts` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 08_FRONTEND_UI_AND_INSPECTOR.md, frontend.md |
| `frontend/ui/src/host/comfy.ts` | frontend.md |
| `frontend/ui/src/host/dragDrop.ts` | 08_FRONTEND_UI_AND_INSPECTOR.md, frontend.md |
| `frontend/ui/src/host/locale.ts` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/host/scientific.tsx` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 08_FRONTEND_UI_AND_INSPECTOR.md, 11_HANDOFF_RECONCILIATION.md, frontend.md, requirements.md |
| `frontend/ui/src/host/sidebar.tsx` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, 08_FRONTEND_UI_AND_INSPECTOR.md, frontend.md |
| `frontend/ui/src/i18n/index.ts` | 04_COMPLETE_FEATURE_INVENTORY.md, frontend.md |
| `frontend/ui/src/i18n/locales/en/main.json` | source-review.md |
| `frontend/ui/src/i18n/locales/zh/main.json` | source-review.md |
| `frontend/ui/src/main.tsx` | frontend.md |
| `frontend/ui/src/shared/ComfyMultiSelect.tsx` | frontend.md |
| `frontend/ui/src/shared/ComfySingleSelect.tsx` | frontend.md |
| `frontend/ui/src/shared/DisclosureChevron.tsx` | frontend.md |
| `frontend/ui/src/shared/Feedback.tsx` | frontend.md |
| `frontend/ui/src/shared/SearchField.tsx` | frontend.md |
| `frontend/ui/src/shared/SearchOptions.tsx` | frontend.md |
| `frontend/ui/src/shared/SidebarTabs.tsx` | frontend.md |
| `frontend/ui/src/shared/useResource.ts` | 05_DEFENSIVE_PROGRAMMING_AUDIT.md, frontend.md |
| `frontend/ui/src/shared/useStoredChoice.ts` | frontend.md |
| `frontend/ui/src/shared/vue.d.ts` | frontend.md |
| `frontend/ui/src/styles/theme.css` | 04_COMPLETE_FEATURE_INVENTORY.md, frontend.md |
| `mcp/src/astrophoto_mcp/__init__.py` | source-review.md |
| `mcp/src/astrophoto_mcp/__main__.py` | 04_COMPLETE_FEATURE_INVENTORY.md, mcp-packaging.md |
| `mcp/src/astrophoto_mcp/api/__init__.py` | source-review.md |
| `mcp/src/astrophoto_mcp/api/comfy.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 05_DEFENSIVE_PROGRAMMING_AUDIT.md, mcp-packaging.md |
| `mcp/src/astrophoto_mcp/api/equipment.py` | source-review.md |
| `mcp/src/astrophoto_mcp/client.py` | source-review.md |
| `mcp/src/astrophoto_mcp/config.py` | source-review.md |
| `mcp/src/astrophoto_mcp/server.py` | 10_MCP_CI_PACKAGING.md |
| `mcp/src/astrophoto_mcp/tools/__init__.py` | source-review.md |
| `mcp/src/astrophoto_mcp/tools/equipment.py` | 04_COMPLETE_FEATURE_INVENTORY.md |
| `mcp/src/astrophoto_mcp/tools/status.py` | source-review.md |
| `nodes/ComfyUIFEExampleVueBasic.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 07_NODE_SIRIL_IMAGE_PATH.md, nodes-siril.md |
| `nodes/__init__.py` | source-review.md |
| `nodes/scientific.py` | 04_COMPLETE_FEATURE_INVENTORY.md, 07_NODE_SIRIL_IMAGE_PATH.md, 11_HANDOFF_RECONCILIATION.md, nodes-siril.md |

## 无足够独立具名证据

| 文件 | 当前状态 |
| --- | --- |
