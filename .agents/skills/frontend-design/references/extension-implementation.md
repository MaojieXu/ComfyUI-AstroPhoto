# 扩展实现与版本边界

设计方案中先区分“原生界面长什么样”和“扩展可以调用什么”。优先目标版本的公开接口、项目已有组件和依赖；上游内部 Vue 组件、CSS、图标与包导出需验证可用性，不能仅凭源码存在就假定第三方扩展可用。

## 入口与生命周期

| 任务 | 资料 | 核对点 |
| --- | --- | --- |
| 注册 JavaScript 扩展 | [JavaScript Extensions](https://docs.comfy.org/custom-nodes/js/javascript_overview)、[Hooks](https://docs.comfy.org/custom-nodes/js/javascript_hooks) | 目标版本的注册入口、回调时机和数据来源。 |
| 侧栏 | [Sidebar Tabs API](https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs)；项目 `frontend/src/host/sidebar.ts` | 容器挂载、重复注册、销毁清理、宽度变化和语言切换。 |
| 节点与 Widget | 项目 `.agents/skills/comfyui/references/node-frontend.md`、`frontend/src/host/fitsSource.tsx` | 原生 Widget 是否足够；DOM Widget 的尺寸、序列化、渲染模式与卸载清理。 |
| 画布和节点菜单 | [Context Menu API](https://docs.comfy.org/custom-nodes/js/context-menu-migration)、[Topbar Menu API](https://docs.comfy.org/custom-nodes/js/javascript_topbar_menu) | 目标版本公开入口、菜单上下文、可达性及动作适用范围。 |
| 主题、选择框与图标 | 项目 `frontend/src/styles/theme.css`、`frontend/src/shared/`、`frontend/src/vendor/comfyui/README.md` | 语义值、实际构建资源、许可、依赖与目标宿主渲染。 |

项目文档曾确认 ComfyUI 0.46.0 / Frontend 1.59.6，项目类型包与选择框来源为 1.59.1；这些是历史基线，不等于当前运行版本。设计和验证时记录目标实例的实际版本或无法确认的原因。上游 `main` 只能作为变化线索，具体行为以目标版本为准。

## 版本注意事项

[Frontend v1.59.1 PrimeVue 迁移说明](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md)指出，扩展不能假定宿主继续安装 PrimeVue、其主题或 `--p-*` 变量。该文同时把 `--base-background`、`--base-foreground`、`--border-default`、`--primary-background`、`--secondary-background` 标作旧别名；项目现有样式仍有使用。新方案需核对目标版本实际变量及项目约定，不为本条文档擅自重写既有样式。

需要新的上游组件或第三方依赖时，先验证公开导出、构建、主题和真实宿主行为；不能确认时说明限制并选择已验证的可行实现。遵守仓库最新设计与复用规则，不为猜测中的旧版本建立双轨实现。
