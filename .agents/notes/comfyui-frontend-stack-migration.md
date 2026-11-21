---
task: comfyui-frontend-stack-migration
status: completed
updated: 2026-11-21
---

## Goal

按专题 `references/04C-implementation-prompt.md` 实现并验证单一 Vue 前端、独立 Vite 交付、资料库及 Siril Bundle。

## Verified

- ComfyUI `0.46.0` / Frontend `1.59.6`。两种画布及官方 Siril `1.4.5` 真实执行、设备与光路重启及删除约束、存储与环境持久化、无 Bundle 运行已验证。
- Vitest 45、Python 后端与集成 77、打包 8、MCP 67 项通过。干净构建、归档及真实代理路径校验同一产物。测试精确范围与重试见 [报告](../features/archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)。

## Decisions

- Vue `3.5.42` 与 Vite `8.2.2` 用独立构建配置。类型包保持 `1.59.1`。保留 Assets 默认落点和无请求占位，Siril 经通用软件入口。
- 普通绘图修改走原生撤销/重做。Nodes 2.0 只在公开 `afterConfigureGraph` 后重挂扩展自有 DOM Widget。

## Follow-up scope

接续 F-6 至 F-10。Windows 原生 Siril 在 `MSYSTEM=MINGW64` 和普通环境分别 17 项通过。原 Registry 摘要已校正，本轮 Registry 独立留证。修订链接、v0.6 变更记录和现行 Handoff 文件地图。 [最终复验](../features/archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) · [关闭记录](../features/archive/comfyui-frontend-stack-migration/Close.md)

2026-11-21 接续 Pi F-1 至 F-5。收藏和翻译错误、拖放画布替换、Siril 暂存边界及 Windows 探测目录共享冲突已修复。过期字节码已移出仓库。最终通过前端 61、后端与集成 82、打包 10、MCP 67，以及 Registry 双画布、Siril 队列和代理加载。 [复验](../features/archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) · [Close](../features/archive/comfyui-frontend-stack-migration/Close.md)

专题已正式归档。远端 CI、缺第二卷的测试及已知下游 IMAGE 执行独立追踪。 [归档入口](../features/archive/comfyui-frontend-stack-migration/00_FEATURE_INDEX.md)
