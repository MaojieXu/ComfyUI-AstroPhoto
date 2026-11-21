---
task: unified-handoff
status: completed
updated: 2026-11-21
---

## Goal
交付可独立阅读的单版本 core/module，并清理工作区旧交接目录。

## Progress
- Core 七篇按职责重写，三端各一篇。去重后均低于 100,000 字符，未拆分。
- 冷读子代理仅使用交接 Markdown 跟踪五条端到端链路。按反馈核对并修正 Alembic 单基线、Siril 选项和参数、光路路由、存储操作恢复、MCP 双进程凭据及发布边界。
- 本地工作区旧日期目录及 docs/handoffs 已移走。递归永久删除被系统策略拦截，旧文件移至仓库外 Temp 可恢复目录。原有 Git 暂存区留待用户按工作流整理。

## Verified
- 七篇 core、三个 module、19 个包内链接及旧路径缺席验证通过，Git whitespace 检查通过。
- 使用归档中 2026-11-21 的产品测试结果。本次只重写文档，未复跑产品测试。

## Decisions
- 保留能影响行为的历史原因、故障证据和兼容限制。历史附件与日志缺口已写入 verification。
- 先去重再计数。所有 Markdown 跳转均闭合于 core/module。

## Blockers
- 无。历史真实宿主与发布的尚未复验项已在交接中记录。

## Next
- 实现或契约变更时原位维护对应文档。
