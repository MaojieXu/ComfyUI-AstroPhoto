# Frontend 文件地图 · 画板、编译、语言及交付构件

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 32 个文件。按现行工作树核对，实际运行结论见 Core 验证页。

```text
├── frontend/ — AstroPhoto 独立 Vue 工程、构建、测试和宿主验证。
│   ├── eslint.config.mjs — eslint.config.mjs 的工程入口或配套实现。
│   ├── package.json — package 的结构化资源与翻译。
│   ├── pnpm-lock.yaml — pnpm-lock.yaml 的工程入口或配套实现。
│   ├── pnpm-workspace.yaml — pnpm-workspace.yaml 的工程入口或配套实现。
│   ├── scripts/ — 独立构件和代理网络断言。
│   │   ├── check-build.mjs — 断言构件单一、依赖退出和相对路径。
│   │   └── check-proxy.mjs — Chromium 验证代理路径下解析外部模块和 CSS。
│   ├── src/ — 公共 Vue 前端，不依赖任何特定软件 Bundle。
│   │   ├── features/ — 按产品场景封装页面和组件。
│   │   │   └── drawing/ — Canvas 绘图、工具栏和工作流像素。
│   │   │       ├── DrawingApp.vue — 连接画板和工具栏，转发画笔与画布状态。
│   │   │       ├── DrawingBoard.vue — 运行实际 Canvas 绘图并管理异步像素恢复。
│   │   │       │   └── revision 使迟到恢复不覆盖新绘制或已卸载节点；鼠标和触屏共用画线状态。
│   │   │       ├── ToolBar.vue — 原生画笔、清屏、颜色和范围控件。
│   │   │       │   └── 中文/英文提示经 Vue I18n，样式作用域限定在画板。
│   │   │       └── VueExampleComponent.vue — 画板的宿主 Widget 存储与队列序列化边界。
│   │   │           ├── getValue/setValue 同步保存 canvasDataURL。序列化等候恢复，向 /upload/image 发送 temp PNG。
│   │   │           └── 上传返回 threed/<name> [temp]；坏 PNG 或失败不把错误名称写到工作流。
│   │   └── vendor/ — vendor 对应的工程文件。
│   │       └── comfyui/ — 受控复用的 ComfyUI 组件、样式和来源。
│   │           ├── composables/ — composables 对应的工程文件。
│   │           │   ├── useAttrsClass.ts — useAttrsClass.ts 的工程入口或配套实现。
│   │           │   └── usePopoverSizing.ts — usePopoverSizing.ts 的工程入口或配套实现。
│   │           ├── multi-select/ — multi-select 对应的工程文件。
│   │           │   ├── MultiSelect.vue — MultiSelect.vue 的工程入口或配套实现。
│   │           │   ├── MultiSelectContent.vue — MultiSelectContent.vue 的工程入口或配套实现。
│   │           │   ├── MultiSelectTrigger.vue — MultiSelectTrigger.vue 的工程入口或配套实现。
│   │           │   └── types.ts — types.ts 的工程入口或配套实现。
│   │           ├── README.md — 上游版本、许可和与本地源码的适配对照。
│   │           ├── select/ — select 对应的工程文件。
│   │           │   ├── types.ts — types.ts 的工程入口或配套实现。
│   │           │   └── useSelectSearch.ts — useSelectSearch.ts 的工程入口或配套实现。
│   │           ├── select.variants.ts — select.variants.ts 的工程入口或配套实现。
│   │           ├── single-select/ — single-select 对应的工程文件。
│   │           │   ├── SearchableSingleSelect.vue — SearchableSingleSelect.vue 的工程入口或配套实现。
│   │           │   ├── SingleSelect.vue — SingleSelect.vue 的工程入口或配套实现。
│   │           │   └── types.ts — types.ts 的工程入口或配套实现。
│   │           └── tailwind-utils.ts — tailwind-utils.ts 的工程入口或配套实现。
│   ├── tsconfig.json — tsconfig 的结构化资源与翻译。
│   ├── vite.config.mts — Vite 8 独立 Vue ESM 构建。
│   │   └── Vue、Vue JSX、Tailwind 插件；锁定 js/main.js 与 assets/main.css，外部宿主模块相对到 scripts。
│   └── vitest.config.mts — vitest.config.mts 的工程入口或配套实现。
├── js/ — ComfyUI 通过 WEB_DIRECTORY 加载的现行构建产物。
│   ├── assets/ — assets 对应的工程文件。
│   │   └── main.css — main 的样式、作用域与主题变量。
│   └── main.js — main.js 的工程入口或配套实现。
└── locales/ — 随 Registry 发布的宿主及绘图翻译。
    ├── en/ — 英文词条。
    │   └── main.json — main 的结构化资源与翻译。
    └── zh/ — 中文词条。
        ├── main.json — main 的结构化资源与翻译。
        └── nodeDefs.json — nodeDefs 的结构化资源与翻译。
```
