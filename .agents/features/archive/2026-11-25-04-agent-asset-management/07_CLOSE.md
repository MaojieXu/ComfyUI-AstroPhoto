# 关闭与经验候选

Chat 为 chat1，记录时间 2026-11-25T07:43:47-06:00。状态为已关闭。测试事实见 [RUN-chat1-001](06_TEST_REPORT.md#run-chat1-001--本机功能及真实-agent-联调)。本机核心业务、真实 CLI、Pi 联调及发布前本地验证有执行证据。真实 Desktop 端口锁、第二物理卷仍待实测。

| ID | 候选 | 建议目标 | 来源及状态 |
| --- | --- | --- | --- |
| K-chat1-001 | 把 Pi 的显式 Skill 路径、AstroPhoto 工具白名单和隔离夹具写成联调步骤。保存会话、HTTP 请求 ID 和导入任务号，故障时用独立回读判断业务是否实际执行。 | 现有 docs/mcp.md 的本机联调说明 | RUN-chat1-001，Applied |
| K-chat1-002 | 将回环端口自动发现和 Desktop 端口锁实机验证分别列明，记录 CLI 只能覆盖常用端口回退，并注明 Desktop 冒烟需要本地安装实例。 | 现有 docs/development.md 的宿主验证说明 | RUN-chat1-001，Applied |

用户接受真实 Desktop 本机实例与第二物理卷的未覆盖范围，确认关闭及归档，并选择应用两项知识。chat1 于 2026-11-25T07:44:56-06:00 更新。

- K-chat1-001 写入 `docs/mcp.md` 的 Pi 联调步骤。
- K-chat1-002 写入 `docs/development.md` 的宿主验证说明。
- 归档目录为 `.agents/features/archive/2026-11-25-04-agent-asset-management/`，保留验收报告、实际证据摘要、原验收记录及关联历史。
