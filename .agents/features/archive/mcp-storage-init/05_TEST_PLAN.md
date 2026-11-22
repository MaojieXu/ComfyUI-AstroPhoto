# 扩展启动时自动初始化 AstroPhoto 目录测试计划

v0.8 · 2026-11-22 · [PRD v0.13](01_PRD.md) · [TECH v0.9](03_TECH.md)

## 最终验收范围

依照 PRD D-14，本次结项只保留 TC-01。用仓库现有的 ComfyUI V3 接口替身调用实际扩展的 `on_load()`，数据根使用仓库 `.artifact/mcp-storage-init/` 下的隔离空目录。验收无需启动真实宿主或运行 MCP。

| 用例 | 操作 | 通过条件 |
| --- | --- | --- |
| TC-01 / AC-01 | 设置隔离根，导入扩展并取得入口对象，随后调用 `on_load()`。 | 调用前目标结构不存在。调用后自动生成 `config/`、`database/`、`storage/`、`runtime/`。现有读取器可读取 `config/manifest.json` 和 `config/settings.json`。实例 ID 和首建工作区 ID 有效，默认工作区 ID 与首建工作区 ID 一致。 |

执行及取证见[测试报告](06_TEST_REPORT.md)和 [RUN-003 脚本](assets/test-runs/RUN-003/test_first_load.py)。测试临时文件置于仓库 `.artifact/` 下，原始证据保留在 Feature 的 `assets/test-runs/`。

## 历史范围

v0.7 取消了 TC-01 的真实宿主首建和默认路径复测。v0.8 移除原 AC-02 至 AC-07 对应的验收用例，以及 TC-07、TC-20 的单列验收要求。重启、目录缺失组合、路径冲突、写入受阻、配置缺失或损坏等场景已退出本次验收。原功能需求仍见 PRD，已执行的历史测试保留原结果。
