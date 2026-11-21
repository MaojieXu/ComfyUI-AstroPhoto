# MCP 诊断与设备只读查询 · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

v0.4 文档对账未新增业务运行。独立前端迁移报告记载 67 项 MCP pytest 通过，其范围包括替身、进程内和 stdio 验证。该证据不覆盖当前隔离宿主六个真实 GET、写入矩阵、双客户端轮换/撤销或从同一轮构建的 wheel 完成真实设备读取。 [迁移验证批次](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

## 历史运行证据

**HIST-01**。历史独立 FastMCP 客户端使用真实 stdio 调用六个查询工具；正确凭据成功、错误凭据工具报错、正确只读凭据 POST 403。交接记录 2026-11-21 既有 MCP 套件 67 通过，含 HTTPX 模拟、进程内客户端与真实 stdio，真实授权宿主当日未复验。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [mcp.md](../../../docs/mcp.md) · [publishing.md](../../../docs/publishing.md) · [fastmcp-42.md](../../../.agents/archive/fastmcp-42.md) · [equipment.md](../../../docs/equipment.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史真实 stdio 与诊断 HTTP 证据 | NOT_RUN |
| CASE-02 | 历史真实授权链路与错误证据 | NOT_RUN |
| CASE-03 | 历史本地打包和安装有证据；公开版待验 | NOT_RUN |

## 待复验

设备 API 稳定后执行 CASE-02B/D/E，分别记录六个真实 GET、写入拒绝前后的数据对照、两次宿主重启的失效时点与 API 清理。CASE-03B 单独记录本地 wheel 及安装握手，CASE-03C 记录公开渠道结果。 [测试计划](05_TEST_PLAN.md)

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
