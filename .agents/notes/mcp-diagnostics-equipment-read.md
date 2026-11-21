---
task: mcp-diagnostics-equipment-read
status: handoff
updated: 2026-11-21
---

## Goal

本轮更新 MCP 诊断与设备只读查询的 Feature 文档，从 PRD 到测试计划，并对账既有报告、Close 与交接。

## Progress

- v0.4 补齐六个工具与设备 API 映射、只读拒写、双客户端轮换/撤销和本地 wheel 独立安装门。
- 为真实宿主验收规定 API 清理，先删本用例创建的组合，再删设备并读回 404。
- v0.6 补齐 16 项架构与产品决策，记录当前 Bearer 路由范围、诊断代理行为、DTO 透传、分页一致性、错误回执和独立发布证据的边界。

## Verified

- main@4c0cf4d 加工作树。静态核对 MCP 工厂、HTTP 适配器、宿主安全与路由装配、设备 HTTP 测试和安装探针。历史运行适用范围见专题测试报告。本轮业务运行 NOT_RUN。

## Decisions

- Q-01～16 均待产品决定。当前轮换步骤基于两端进程初始化实现。

## Blockers

- 设备 API 冻结、当前宿主六个真实调用及拒写、双客户端轮换、独立构件和公开发行均待相应阶段取证。

## Next

- 先评审 Q-03、Q-04、Q-06、Q-15、Q-16。CASE-01 和本地 wheel 独立安装可先行。设备 API 稳定后执行 CASE-02B/D/E，同步测试报告与 Close。
