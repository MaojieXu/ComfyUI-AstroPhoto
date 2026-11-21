---
task: sidebar-host-settings
status: completed
updated: 2026-11-17
---

## Goal

根据浏览器批注移除 AstroPhoto 设置中的「常规」。语言和外观由 ComfyUI 管理。

## Progress

- 删除模块、表单和中英文本。语言适配器读取 `Comfy.Locale`，主题继承宿主颜色变量。
- 更新 React 回归和两个宿主测试脚本。内置浏览器的新标签页已打开新版设置列表。

## Verified

- `pnpm -C frontend typecheck`、`lint`、`build`、`check:build` 通过，`test:react` 36 项通过。
- 真实 ComfyUI 8199 的 Playwright 检查验证中英、明暗、旧本地偏好停用、常规模块缺失、存储 DB ready。设置写入仅在测试浏览器内拦截，未更改服务器偏好。
- 两个宿主测试脚本通过 `node --check`。完整的 `test:storage-host` 在第二套隔离实例等待侧栏超时，后续启动命令被工具拒绝。

## Decisions

用已接入的公开宿主设置读取方法和 CSS token。保留现有存储入口与设置状态。

## Blockers

已完成本次界面需求。完整的导入和迁移宿主回归未在本次复测。

## Next

后续存储交付时，在已完成 ComfyUI 首次引导的隔离实例运行完整宿主套件。
