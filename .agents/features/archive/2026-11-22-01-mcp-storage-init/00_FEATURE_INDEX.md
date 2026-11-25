# 扩展启动时自动初始化 AstroPhoto 目录

| 项目 | 当前记录 |
| --- | --- |
| Feature ID | `mcp-storage-init`（沿用原目录和标识） |
| 创建日期 | 2026-11-22 |
| current_phase | CLOSE · `archived` |
| 需求与设计 | [PRD v0.13](01_PRD.md) 和 [TECH v0.9](03_TECH.md) 已记录最终验收范围及根内 `config/` 协调方案。 |
| 范围 | 安装扩展后，在 ComfyUI 加载扩展时自动创建四个目录和约定 JSON；不依赖 MCP 调用。只验收初始化结构。 |
| 已确认 | 安装扩展后启动或重启 ComfyUI，由扩展自动首建四个目录及 JSON，后续启动补建缺失的 `database/`、`storage/`、`runtime/`；无需 MCP 或手动创建文件。允许扩展正常启动所需文件存在；快速实现，不新增版本维护机制。 |
| 已确认的验收 | 只检查四个目录及可由现有逻辑读取的两份 JSON，首建实例和工作区 ID 有效且默认工作区 ID 与首建工作区 ID 一致；业务数据恢复及业务服务就绪不属于验收。字段和默认值由 TECH 复用现有实现。 |
| 关闭决定 | 用户选择不合并 K-001，直接归档。[关闭文档](07_CLOSE.md) |
| 执行与历史证据 | [最终测试报告](06_TEST_REPORT.md)记录 TC-01 通过及已退出验收的场景。[DEV 日志](04_DEV_LOG.md)与 [REVIEW-001](assets/reviews/REVIEW-001_report.txt)保留各自的历史记录。 |
| 代码审查状态 | [REVIEW-002](assets/reviews/REVIEW-002_report.txt) 对应 HEAD `f84442be5f16dd36f6cfff85a686ce30027dd383` 和 DEV LOG-002 的四个 blob，发现项已处理或记录。新的根内协调实现不在原审查覆盖范围。 |

| 阶段或门禁 | 状态 |
| --- | --- |
| PRD | v0.13 · `approved`，记录用户确认的最终验收范围 |
| UXUI | `n_a`，无图形界面需求 |
| TECH | v0.9 · 已核对实施基线与结项口径 |
| DEV | 已交付，R-01、R-03 和 R-02 用例的局部自检见 LOG-003/004 |
| TEST_PLAN | v0.8 · `ready`，本次验收只保留 V3 替身的 TC-01 |
| 独立 Code Review Gate | REVIEW-002 已完成且发现项已处理或记录；新根内协调实现不在其覆盖范围，不宣称已被审查 |
| TEST_REPORT | `passed`，最终范围 1/1 通过，其他场景经用户确认退出本次验收 |
| CLOSE | `archived`，[关闭文档](07_CLOSE.md)和原始证据已随 Feature 归档 |
