# 扩展启动自动初始化 · CLOSE

2026-11-22 · `mcp-storage-init` · **已关闭并归档**

本次验收已通过。按用户确认的范围，ComfyUI 加载扩展时由 V3 `on_load()` 负责首建。最终用例在隔离空根中调用实际的扩展入口，确认四个目录与两份配置 JSON 自动生成。用户安装扩展后启动 ComfyUI 即可触发初始化，无需额外运行 MCP。

## 交付与验收

| 项目 | 关闭核对 |
| --- | --- |
| 有效文档 | [PRD v0.13](01_PRD.md) · [TECH v0.9](03_TECH.md) · [DEV 日志](04_DEV_LOG.md) · [TEST_PLAN v0.8](05_TEST_PLAN.md) · [最终测试报告 v0.2](06_TEST_REPORT.md)。UXUI 不适用。 |
| 最终代码 | HEAD `f84442be5f16dd36f6cfff85a686ce30027dd383` 加未提交的工作树改动。结项时检查 [RUN-003 基线](assets/test-runs/RUN-003/baseline.json)，69 份记录文件的 SHA-256 均一致。 |
| FR-01、FR-02 首建部分 · AC-01 | **Accepted**。V3 替身调用实际 `on_load()`，生成 `config/`、`database/`、`storage/`、`runtime/`。现有读取器可读取 `manifest.json` 和 `settings.json`，实例 ID 和工作区 ID 有效，默认工作区 ID 与首建工作区 ID 一致。[RUN-003](assets/test-runs/RUN-003/pytest.xml) 1/1 通过。 |
| FR-02 补齐部分、FR-03、FR-04 | 作为已交付实现记录。按 PRD D-14，重启、目录补齐组合、配置异常及其他额外验证退出本次验收。历史测试记录保留原结果。 |
| 审查边界 | [REVIEW-002](assets/reviews/REVIEW-002_report.txt) 早于将数据根协调移入 `config/` 的实现。关闭结论以用户确认的验收范围和实际执行证据为准。 |

实现入口位于仓库 `__init__.py` 和 `astrophoto/bootstrap.py`。根协调及目录初始化分别位于 `astrophoto/storage/data_root.py` 和 `astrophoto/storage/initializer.py`。根登记和协调锁位于数据根的 `config/`，旧账号级记录不参与启动，也不做迁移。扩大测试范围或确认真实宿主安装不属于本次结项。

## 长期文档候选

DEV 已同步 `docs/architecture.md` 和 `docs/local-storage.md` 的启动入口、四目录和根内协调说明。现有仓库说明已经覆盖 V3 生命周期及替身适用范围。一次性验收脚本和运行记录随 Feature 保留。

**K-001 · 本地存储文档分隔当前契约与历史基线 · 用户选择不合并。** 来源是 REVIEW-002 的 R-05。当前文档虽已有「历史交付基线」，后面的实现矩阵、数据契约和验收章节仍与它同级，容易被读为现行说明。以下提案保留供追溯，目标原为 `docs/local-storage.md`：

- 将当前的「就绪检查与位置记录」改为「在线 `init` 就绪检查与位置记录」，清楚标明它与开头的自动首建是两个入口。
- 将「Implementation Matrix」「Data and HTTP contracts」「Safety and recovery」「验收状态」「Verification」降为「历史交付基线」下的三级标题。
- 在历史区开头明确：旧布局和验收数据只对应当时版本。当前在线 `init` 契约由 `docs/mcp.md` 的「安装后初始化」维护，当前首建布局以本页「当前使用方式」为准。历史内容与证据继续保留。

用户决定直接归档。本次关闭的长期文档集成结果为零项。

## 关闭与归档

本次复盘结论是先确定 Feature 的验收边界，再选择能提供直接证据的最小用例。RUN-003 在替身中确认了实际扩展入口的落盘结果，历史真实宿主记录保留各自的结论。

已将整个 Feature 移至 `.agents/features/archive/mcp-storage-init/`，包含索引、阶段文档和 `assets/` 下的审查及测试原始记录。移动前后核对全部 44 份文件的 SHA-256 一致。已有测试夹具清理受执行策略限制，详见测试报告，夹具本身不进入归档。
