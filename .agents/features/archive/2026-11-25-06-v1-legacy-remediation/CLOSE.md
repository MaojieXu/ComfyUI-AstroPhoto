# V1 Legacy Remediation — CLOSE

初始化：chat2 · 2026-11-25T15:38:42-06:00

## 完成范围

- 用户本轮确认可以关闭 Feature。范围为 [PRD](PRD.md) D1–D5、TASK-chat1-002..007 和 TASK-chat2-001/002。交付基线为已推送到 `origin/main` 的 `40836a8122cb9e2e510f0517c1581866fac84c47`。
- 验收证据见 [TEST_REPORT](TEST_REPORT.md) 的 RUN-chat2-004/005 与 [AUDIT](AUDIT.md)。[REVIEW](REVIEW.md) 中的 16 项均已由实施 Chat 修复并验证，最后 6 项尚无独立复审记录。
- 真实宿主覆盖 Classic / Nodes 2.0 书签回归。之后重启隔离宿主加载当前后端，完成合成数据导入，核对 69 个文件、42 台设备、7 套设备组合、2 个项目及校准绑定。真实 Siril CLI 与第二物理卷仍受环境限制，见 RUN-chat2-005。
- 提交对应的 [GitHub Actions CI](https://github.com/MaojieXu/ComfyUI-AstroPhoto/actions/runs/45705840454) 的 Python 3.11 和 3.12 作业均通过。chat2 · 2026-11-25T15:40:00.5613744-06:00 补记。
- 状态：Closed。Updated by chat2 · 2026-11-25T15:38:42-06:00。

## 知识候选

| K ID | Chat / 时间 | 来源 | 候选内容与适用范围 | 建议目标与理由 | 状态 |
| --- | --- | --- | --- | --- | --- |
| K-chat2-001 | chat2 · 2026-11-25T15:38:42-06:00 | D4、REVIEW-chat5-001-F01、REVIEW-chat7-001-F01、RUN-chat2-005 | 修改公开字段时，用真实维护脚本的计划函数和生成夹具提交 HTTP 预检，同时断言新字段可用、旧字段被拒绝。API 清单漂移检查继续验证发布的接口清单。 | `.agents/skills/feature-pipeline/references/testing.md` · 补充 HTTP/MCP/前端与维护脚本共同消费同一契约时的验证方式。 | Proposed |
| K-chat2-002 | chat2 · 2026-11-25T15:38:42-06:00 | REVIEW-chat6-001-F03、RUN-chat2-003/005 | 宿主设置持久化测试分别覆盖 HTTP 拒绝、写入成功但回读断网、另一标签页保存后的恢复。区分宿主内存与服务器值，并断言故障后只有用户请求的那次写入。 | `docs/development/setup-and-testing.md` · 补充现有真实宿主回归步骤；架构文档已有书签行为说明。 | Proposed |
| K-chat2-003 | chat2 · 2026-11-25T15:38:42-06:00 | RUN-chat2-005、合成数据实际导入的两次回执 | 使用既有隔离宿主做端到端验证时，先确认 Data Root 和任务队列。Python 契约变更后用当前代码启动宿主。若脚本已部分写入，核对回执和服务端记录后再继续剩余任务。 | `docs/development/setup-and-testing.md` · 补充现有合成素材导入章节的宿主核对和部分失败复核。 | Proposed |

## 用户选择与落实

三项均待用户选择。目标文件暂无知识落地记录。
