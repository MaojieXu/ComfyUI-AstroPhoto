# 设备与光路管理 · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。该历史补档批次业务测试 `NOT_RUN`。当前 API 清理专项结果如下。

## API 清理专项（2026-11-21）

**复核 run `equipment-api-2026-11-21-rerun`**。Windows，Python 3.12.16，HEAD `4c0cf4d`，含工作树设备 API 测试改动。执行 `uv run --frozen --no-sync pytest tests/integration/test_equipment_api.py tests/backend/test_equipment.py -q`，退出码 0，20 项通过，耗时 10.51 秒。测试脚本 SHA-256 分别为 `C9EA5A3D8CE886F5DE5F1625D4C3D2C4E050DACA789C24642C3A3E013D0EEFB3` 和 `FF00BA34B856B31D0307498BE805E219ABCB6AD5A2F652E3C62A62B460CF1C1A`。包括官网目录创建、读取和 API 清理及异常后的空库检查。该批次不证明尚未实现的同名拦截与归档设备新增引用拦截。

基线为 HEAD `4c0cf4d` 加当前工作树的测试脚本改动。后端脚本 SHA-256 为 `C9EA5A3D8CE886F5DE5F1625D4C3D2C4E050DACA789C24642C3A3E013D0EEFB3`，宿主脚本 SHA-256 为 `DBFC938515F2332F94678F30AE4E31FA72E11B605212CCB30315BCA0B96870BD`。

- `.venv/Scripts/python.exe -m pytest tests/integration/test_equipment_api.py tests/backend/test_equipment.py -q` 退出 0，20 项通过。50 条官网设备、16 套组合经 HTTP 创建、读回，随后先删组合再删设备并读回 404。故障用例在创建组合、归档相机后抛错，随后通过新 HTTP 客户端确认两集合为空。
- Windows 隔离 ComfyUI 0.46.0 与 Playwright Chromium 运行 `node frontend/tests/host/equipment-host.mjs`、加 `--prepare-restart`、重启同根后加 `--verify-restart --verify-delete`。三个 Node 脚本均通过。普通用例与重启最终阶段分别输出 `PASS API cleanup: equipment and optical trains from this run are gone`。宿主结束后的外层 Windows 临时目录清理遇到锁住的 host.log，外层退出 1。检查该目录只剩日志，无测试数据库。
- Python Ruff 和 Node 语法检查通过。本次结果覆盖 CASE-01、CASE-02、CASE-03、CASE-05 的相关创建、读回、删除及重启路径，未执行完整矩阵。

## 历史运行证据

**HIST-01**。2026-11-18 早期方案用 `pnpm -C frontend test:equipment-host` 与 `--verify-restart` 完成真实宿主验证，17 项 SQLite/aiohttp 专项为当时结果。单配置时代的证据另见 Core：真实宿主删除、故障引发事务回滚及重试。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [equipment.md](../../../docs/equipment.md) · [equipment-optical-train.md](../../../.agents/archive/equipment-optical-train.md) · [equipment-review-tests.md](../../../.agents/archive/equipment-review-tests.md) · [equipment-delete.md](../../../.agents/notes/equipment-delete.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 早期四类 DTO 与后端专项证据 | NOT_RUN |
| CASE-02 | 当前规则有专项证据；历史发布交互另计 | NOT_RUN |
| CASE-03 | 单配置时代有删除与回滚证据 | NOT_RUN |

## 待复验

复验当前单配置、旧快照兼容及删除冲突，分别记录后端测试和目标宿主交互。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
