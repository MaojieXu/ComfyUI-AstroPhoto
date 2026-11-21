---
task: equipment-review-tests
status: completed
updated: 2026-11-18
---

## Goal
审查设备和光路改动，补齐永久删除回归，并更新真实宿主测试。

## Progress
- SQLite 注入旧 Revision 删除后、触发器重建前的失败，验证事务恢复配置、默认指针、快照及触发器。成功重试只影响目标光路。
- React 测试覆盖引用阻止删除、用户取消、409、重新获取版本、204 和返回列表。
- 更新 Playwright 的官方下拉、光路详情和重启验证。新增显式 `--verify-delete` 模式，仅用本次创建的测试记录。

## Verified
- `uv run --no-sync pytest tests/backend/test_equipment.py tests/integration/test_equipment_api.py -q`：18 通过。
- `uv run --no-sync pytest tests/nodes tests/backend tests/integration tests/packaging -q -rs`：82 通过、4 跳过（Siril CLI 2、第二卷 2）。`COMFYUI_TEST_URL` 指向独立 8211 宿主。
- `uv run --no-sync --project mcp pytest mcp/tests -q`：67 通过。Ruff、`uv lock --check` 通过。
- `pnpm -C frontend test:react`：46 通过。`pnpm -C frontend test`：构建成功，Vue Chromium 9 通过。typecheck、lint、check:build、check:proxy 通过。
- ComfyUI 0.45.0 / Frontend 1.59.1，独立测试根，`pnpm -C frontend test:equipment-host` 和重启后的 `--verify-restart --verify-delete` 通过。测试宿主已停止。

## Decisions
- 生产行为的变更留给后续修复。已向用户报告冲突重试可能覆盖其他人的字段、旧快照引用在界面中无法区分，以及光路删除复用设备文案。

## Blockers
- 无。外部 Siril CLI 和跨卷环境未纳入本次专项验证。

## Next
- 修复冲突重试时增加双客户端、不同字段的回归场景，定义旧快照专属引用的展示和解除方式。
