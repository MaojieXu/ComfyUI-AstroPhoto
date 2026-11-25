# 扩展启动自动初始化 · 最终测试验收报告

v0.2 · 2026-11-22 · [PRD v0.13](01_PRD.md) · [TECH v0.9](03_TECH.md) · [TEST_PLAN v0.8](05_TEST_PLAN.md)

**最终验收通过（PASS，1/1）。** 用户按 PRD D-14 确认只验收首建结构与 JSON，RUN-003 满足保留的唯一用例 TC-01。此前因待验证项得出的 `INCOMPLETE` 结论由本版替代。此次调整验收范围后沿用 RUN-003 的实测证据。

| 当前条件 | 实际结果 | 证据 |
| --- | --- | --- |
| AC-01 / TC-01 | 调用前隔离根不存在。通过 V3 接口替身调用实际扩展 `on_load()` 后，四个目录生成，两份配置 JSON 能由现有读取器读取，首建 ID 有效，默认工作区 ID 与首建工作区 ID 一致。 | [脚本](assets/test-runs/RUN-003/test_first_load.py) · [终端记录](assets/test-runs/RUN-003/execution.txt) · [JUnit](assets/test-runs/RUN-003/pytest.xml) |

## 验收证据和边界

RUN-003 在 Windows 10.0.26200、Python 3.12.16 的 uv 环境执行，1 项通过，耗时 1.68 秒。基线为 HEAD `f84442be5f16dd36f6cfff85a686ce30027dd383` 加未提交的工作树改动。结项时复核 [运行基线](assets/test-runs/RUN-003/baseline.json) 所记录的 69 份文件，SHA-256 均一致。REVIEW-002 的独立审查范围早于根内协调实现。

当前 PASS 仅适用于隔离环境中的扩展首建。真实宿主安装、启动、默认路径复测，以及原计划的重启、目录补齐组合和配置异常等场景均已移出本次验收。历史证据沿用原结果。

| 历史 RUN | 记录 |
| --- | --- |
| RUN-001 | [pytest](assets/test-runs/RUN-001/pytest.xml) 5 项通过。旧版宿主首建的[覆盖根场景通过](assets/test-runs/RUN-001/host/o/result.json)，[默认根场景在状态接口检查处失败](assets/test-runs/RUN-001/host/d/result.json)，未确定根因。 |
| RUN-002 | 已准备脚本，未执行。 |

RUN-003 的隔离夹具 `.artifact/mcp-storage-init/q3/` 仍保留。此前自动执行策略以 `blocked by policy` 拒绝递归清理命令。
