# Frontend 文件地图 · 前端自动化与真实宿主验证

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 20 个文件。按现行工作树核对，实际运行结论见 Core 验证页。

```text
└── frontend/ — AstroPhoto 独立 Vue 工程、构建、测试和宿主验证。
    └── tests/ — Vitest Chromium 与真实宿主回归。
        ├── components/ — 领域共用展示组件。
        │   ├── BundleBoundary.test.ts — 公共入口注册、空 Bundle 与第二 Bundle 接入。
        │   ├── DrawingApp.test.ts — DrawingApp 行为的 Vitest 断言。
        │   ├── Library.test.ts — 设备字段、本地化校验反馈、版本和草稿、真实 Reka 键盘。
        │   ├── Localization.test.ts — 验证中英文键集、Bundle 合并和公共字面量键。
        │   ├── NodeCatalog.test.ts — 排序、收藏失败与重试、筛选、拖放、画布替换和卸载。
        │   ├── ScientificNodes.test.ts — 孤立宿主 Widget 下 Inspector 的写入、撤销边界、只读、取消与单通道。
        │   ├── SidebarNavigation.test.ts — 默认 Assets 无请求、搜索与输入法、语言、单根挂载和清理。
        │   └── StorageSettings.test.ts — 版本冲突与保留草稿、工作区迁移回执、缓存确认、分辨率恢复。
        ├── host/ — 可控宿主边界测试与 opt-in 真实 ComfyUI 浏览器场景。
        │   ├── api.test.ts — api 行为的 Vitest 断言。
        │   ├── canvas.test.ts — canvas 行为的 Vitest 断言。
        │   ├── domWidgetMounts.test.ts — 只对扩展自有 Widget 重挂及保留宿主类名。
        │   ├── equipment-host.mjs — 真实浏览器设备/光路、跨重启验收及按运行限定的 API 删除和读回。
        │   ├── fixtures.ts — fixtures.ts 的工程入口或配套实现。
        │   ├── host-runtime.mjs — 保持目录打开并切换画布后拖放，验证子图、撤销、旧图与 PNG 引用。
        │   ├── siril-host.mjs — 真实 Siril 配置、FITS 候选、Inspector、源哈希和正式队列。
        │   └── storage-host.mjs — 真实浏览器工作区迁移、缓存确认和预览设置持久化。
        ├── host.ts — host.ts 的工程入口或配套实现。
        ├── setup.ts — setup.ts 的工程入口或配套实现。
        └── widgets/ — 宿主 Widget 回归。
            ├── registration.test.ts — registration 行为的 Vitest 断言。
            └── serialization.test.ts — serialization 行为的 Vitest 断言。
```
