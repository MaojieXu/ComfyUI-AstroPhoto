# Repository-Verified Handoff

审计日期：2026-11-16，America/Chicago（UTC 为 2026-11-17）。软件版本 0.0.1；需求基线 v0.2 不是发行版本。

本包基于真实工作树、锁文件、安装环境和本轮测试。**工程基础已实现并通过隔离验证，但真实 ComfyUI 宿主验收未完成，不具备发布验收完成结论。**

## 输入与边界

仓库：`C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`。
原始资料：`.artifact/ComfyUI_AstroPhoto_Handoff_2026-11-16/`。已读取 00–09 正文及 MANIFEST，针对 V3、Skills、数据归属回查 references；FULL 是历史汇编，不作为第二份实现证据。原始包留在原处、未修改或移动；SHA256 见 `evidence/historical-hashes.json`。Registry 已排除 `.artifact/`。本次没有重建或假冒原始 ZIP。

Git：main，HEAD `06961eebe42674714dc2992b0a9de654b3a5a566`，大量既有未提交迁移文件。**仅 HEAD 不能复现当前实现**；应同时保留当前工作树和本包源码哈希清单。没有提交、推送、切换分支、发布或更改宿主依赖。本轮只修订文档与开发任务记录；构建/测试生成了忽略的产物与缓存。

## 阅读顺序

| 文件 | 用途 |
| --- | --- |
| 01_CURRENT_STATE.md | 当前事实、验证范围和工作树 |
| 02_REQUIREMENTS.md | 校准后的完整长期需求；保留 33 个候选 Skills |
| 03_ARCHITECTURE.md | 真实模块、数据流、完整项目文件清单 |
| 04_TECH_STACK.md | 实际版本、约束、两套环境和开发命令 |
| 05_MCP_AND_SKILLS.md | 两个 Tools、协议差异、Provider 条件和未来边界 |
| 06_DATA_MEMORY_RAG.md | 业务数据所有权与未来知识/记忆/实验设计 |
| 07_TEST_EVIDENCE.md | 本轮命令、结果、日志、未运行项目和打包规则 |
| 08_GAPS_AND_RISKS.md | 阻塞、源码风险与后续验收 |
| 09_DECISIONS.md | 保留/落地/替代的决策 |
| 10_NEXT_AGENT_PROMPT.md | 无需聊天记录的恢复提示词 |
| 11_RECONCILIATION.md | 双向差异与核心结论证据矩阵 |
| 12_SOURCES.md | 官方 API 与本地证据索引 |
| CHANGELOG.md | 本次文档修订范围 |
| FULL_HANDOFF.md | 上述各专题按序拼接的完整版本 |
| evidence/ | 实测日志、工作树、锁版本、源文件哈希 |

## 状态词典

- `VERIFIED`：具体结论有源码及本轮测试/查询证据；只适用于注明的范围。
- `IMPLEMENTED_UNVERIFIED`：源码存在，相关运行环境未通过或未验证。
- `PLANNED`：保留的需求/设计，不是可用功能。
- `PARTIAL`：已实现子集，仍缺完整需求。
- `CONFLICT`：配置/代码/已确认设计之间存在矛盾。
- `OBSOLETE`：旧结论已被明确替代。
- `UNKNOWN`：证据不足，不能猜测。

所有 `path:line` 均相对上述仓库根（注明 host 的除外），对应本次工作树，不是 HEAD 中的行号。`evidence/` 日志没有真实发布凭证；外发前仍需考虑本地路径信息。
