# Frontend 文件地图 · 前端自动化与真实宿主验证

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 21 个文件。按现行工作树核对，实际运行结论见 Core 验证页。

```text
└── frontend/ — AstroPhoto 独立 Vue 工程、构建、测试和宿主验证。
    └── tests/ — Vitest Chromium 与真实宿主回归。
        ├── components/ — 领域共用展示组件。
        │   ├── BundleBoundary.test.ts — 公共入口注册、空 Bundle 与第二 Bundle 接入。
        │   ├── DrawingApp.test.ts — DrawingApp 行为的 Vitest 断言。
        │   ├── Library.test.ts — 设备字段、本地化校验反馈、版本、重复激活设置时的草稿保护及真实 Reka 键盘。
        │   ├── Localization.test.ts — 验证中英文键集、Bundle 合并和公共字面量键。
        │   ├── NodeCatalog.test.ts — 排序、收藏失败与重试、筛选、拖放、画布替换和卸载。
        │   ├── ScientificNodes.test.ts — 孤立宿主 Widget 下 Inspector 的写入、撤销边界、只读、取消与单通道。
        │   ├── SidebarNavigation.test.ts — 默认 Projects 的只读加载、节点详情返回目录、查询与输入法、语言、单根挂载和清理。
        │   └── StorageSettings.test.ts — 工作区登记、旧操作入口的移除，以及导入方式和预览设置的错误恢复。
        ├── host/ — 可控宿主边界测试与 opt-in 真实 ComfyUI 浏览器场景。
        │   ├── api.test.ts — api 行为的 Vitest 断言。
        │   ├── canvas.test.ts — canvas 行为的 Vitest 断言。
        │   ├── domWidgetMounts.test.ts — 只对扩展自有 Widget 重挂及保留宿主类名。
        │   ├── equipment-host.mjs — 真实浏览器设备/光路、跨重启验收及按运行限定的 API 删除和读回。
        │   ├── fixtures.ts — fixtures.ts 的工程入口或配套实现。
        │   ├── host-runtime.mjs — 隔离宿主验证精确收藏和 HTTP 失败、详情焦点、主图/子图添加及撤销重做、旧拖放拒绝和工作流重开。
        │   ├── siril-presentation.mjs — 核对原生分类、多级侧栏和命令目录、别名及双画布兼容。
        │   ├── siril-host.mjs — 实测全部生成的节点定义、目录搜索、旧图兼容与跨命令路径队列。
        │   └── storage-host.mjs — 真实浏览器工作区登记顺序及导入和预览设置的重载核对。
        ├── host.ts — host.ts 的工程入口或配套实现。
        ├── setup.ts — setup.ts 的工程入口或配套实现。
        └── widgets/ — 宿主 Widget 回归。
            ├── registration.test.ts — registration 行为的 Vitest 断言。
            └── serialization.test.ts — serialization 行为的 Vitest 断言。
```
