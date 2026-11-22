# ComfyUI 扩展底座与绘图节点 · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## 现行迁移运行的可引用范围

`frontend-vue-v1596-local-2026-11-21` 在 Windows、ComfyUI 0.46.0 / Frontend 1.59.6 上记录两种画布的旧图恢复、笔画、宿主撤销重做、重开和临时 PNG 引用。证据文件为 `drawing-undo-classic-final.txt` 与 `drawing-undo-nodes-2-r2.txt`。该运行报告说明下游 Python IMAGE 路径独立，不能作为 CASE-03E 的成功记录。相关前端产物哈希及工作树适用范围以原报告为准。 [迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

本次文档对账未执行新的绘图测试。CASE-02D 的受控慢恢复、CASE-02E 分享副本和 CASE-03E 的正式队列均待独立验证。

## 历史运行证据

**HIST-01**。历史 Windows ComfyUI 0.45.0 / Frontend 1.59.1。`pnpm -C frontend test` 记录 9 项 Chromium 通过；真实宿主 `pnpm -C frontend test:host --skip-image-execution` 记录 16 项通过，IMAGE 明确 SKIP；更早的正式 IMAGE 路径失败保留。详见绘图归档与 Core 验证汇总。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [architecture.md](../../../docs/architecture.md) · [publishing.md](../../../docs/publishing.md) · [backend-standardization.md](../../../.agents/notes/backend-standardization.md) · [drawing-persistence.md](../../../.agents/archive/drawing-persistence.md) · [react-sidebar.md](../../../docs/react-sidebar.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史宿主读取与自动化有证据 | NOT_RUN |
| CASE-02 | 历史真实像素回归通过 | NOT_RUN |
| CASE-03 | 上传有历史证据；正式队列历史 FAIL，后续 SKIP | NOT_RUN |

## 待复验

在隔离宿主复跑 `vue-basic → PreviewImage`，核对临时路径、队列 history 和下游图像，保存失败或成功的原始回执。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
