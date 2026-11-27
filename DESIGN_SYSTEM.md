# AstroPhoto 前端设计规范

AstroPhoto 的节点和扩展界面沿用目标 ComfyUI 版本的交互习惯。界面的布局和反馈应帮助用户识别图像、输入、输出和下一步操作。单次功能的方案和验收记录放在对应的 Feature 或专题文档中。

## 本地基线

2026-11-25 从隔离预览环境的版本文件和已安装软件包确认 ComfyUI **0.46.0**、Frontend **1.59.6**。本次校对依据仓库源码和宿主构建产物，深浅主题、实际画布渲染和组件表现待运行时验证。每次设计按目标实例重新核对版本、主题和画布渲染模式，并记录证据。

| 范围 | 仓库入口与复用方式 |
| --- | --- |
| 扩展入口 | [Bundle 入口](extension/frontend-entry.ts) 调用 [公共初始化](frontend/src/main.ts)，加载 `js/main.js` 对应的 `js/assets/main.css` 并注册节点与侧栏。 |
| 侧栏 | [宿主侧栏接入](frontend/src/host/sidebar.ts) 使用 `registerSidebarTab`，将 AstroPhoto 的 Vue 界面挂载到宿主侧栏。 |
| 节点控件 | 先检查原生 Widget。需要渲染项目界面时参考[文件和文件夹来源控件](frontend/src/host/fitsSource.tsx)，通过 `getCustomWidgets` 和 `addDOMWidget` 挂载 Vue，并处理控件尺寸与释放。 |
| 通用选择框 | 优先复用 [ComfySingleSelect](frontend/src/shared/ComfySingleSelect.tsx) 和 [ComfyMultiSelect](frontend/src/shared/ComfyMultiSelect.tsx)。[组件来源说明](frontend/src/vendor/comfyui/README.md) 记录引入版本为 Frontend **1.59.1**。新的上游组件或 `@comfyorg/design-system` 导入须先在扩展的独立构建与宿主中验证。 |
| 可展开分区 | 复用 [DetailAccordion](frontend/src/features/library/components/DetailAccordion.tsx) 或沿用相同的线条箭头样式。 |

已确认的项目决定约束用户行为，目标宿主的运行表现、源码和接口确定工程边界。同版本官方资料用于核对，上游 `main` 和 Comfy Design Standards 用于补充设计依据。引用上游时记录版本、提交或访问日期。 [Comfy Design Standards 入口](https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/AGENTS.md#design-standards) · [官方主题说明](https://docs.comfy.org/interface/appearance) · [官方扩展开发文档](https://docs.comfy.org/custom-nodes/js/javascript_overview)

## 主题与图标

优先沿用 [AstroPhoto 的作用域样式](frontend/src/styles/theme.css)。下列宿主变量均在本地 Frontend 1.59.6 的构建 CSS 中找到定义，表中只记录静态映射。深浅主题的对比度和控件状态以实际渲染为准。

这些映射描述现有代码，不表示推荐新代码继续使用旧名称。[Frontend v1.59.1 迁移说明](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md)将 `--base-background`、`--base-foreground`、`--secondary-background`、`--border-default` 和 `--primary-background` 标为旧别名，并分别指向 `--background`、`--foreground`、`--secondary`、`--border` 和 `--primary`。设计时核对目标宿主版本和当前主题；本说明不代表现有样式已经迁移。

| 用途 | AstroPhoto 当前用法 | 宿主变量 |
| --- | --- | --- |
| 背景 | `--ap-bg` | `--base-background` |
| 正文 | `--ap-fg` | `--base-foreground` |
| 次级文字 | `--ap-muted` | `--muted-foreground` |
| 控件表面 | `--ap-surface` | `--secondary-background` |
| 边框 | `--ap-border` | `--border-default` |
| 焦点 | `.astrophoto-ui :focus-visible` 的轮廓 | `--primary-background` |

节点标题、表面和端口保留宿主样式。自定义控件随宿主主题变化。颜色用于强调有语义的状态，重要信息同时用文字或图标表达。截图只用于分析可见布局和内容。

优先复用当前构建可渲染的宿主图标，按动作或对象选择，并统一线条、尺寸和对齐。新增 `icon-[lucide--*]` 类时先核对宿主生成的 CSS，再确认实际渲染。图标按钮提供可理解的无障碍名称。

## 布局、交互与文案

- **节点**。让标题、端口、控件和文件摘要各有清楚的层级。在画布缩放、窄节点和折叠状态下检查关键识别信息与端口布局。
- **侧栏与弹窗**。默认使用适合 ComfyUI 侧栏的紧凑布局。收紧控件、选项和间距，同时保证文字清晰、焦点可见和点击区域易操作。按任务顺序组织内容，使主操作、取消与关闭易于定位。
- **长内容与多语言**。复用 [前端 i18n](frontend/src/i18n) 写中英文文案。用用户能理解的任务语言描述动作和错误。文件名作为摘要时，提供适合场景的完整查看和路径复制方式，并检查超长名称、路径和窄尺寸。
- **交互状态**。按功能实际可到达的状态设计空态、加载、就绪、运行、成功、失败、禁用和数据缺失。关键错误要有文字反馈。检查键盘操作、焦点顺序与焦点提示。

附件提到的 `AstroPhoto 素材源`、`Light_0003.fit` 和 `frontend_only` 来自历史截图。当前工作树的 [科学节点定义](nodes/scientific.py) 已区分文件来源和文件夹来源。后续设计以实际节点和控件为准，核对长路径对节点布局和端口的影响，以及文件切换、缺失时的反馈。

## 设计确认与视觉验收

按[仓库的前端改动流程](AGENTS.md#用户可见前端改动)审阅方案。实施后对照获准方案，按改动范围检查真实宿主中的主题、画布模式、缩放、窄尺寸、长内容、中英文、键盘和可到达的状态。构建、源码、模拟环境与真实宿主的证据分别记录。预览和测试方式见[开发与验证](docs/development/setup-and-testing.md#本机前端预览)。
