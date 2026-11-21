---
task: equipment-delete
status: completed
updated: 2026-11-18
---

## Goal
设备和光路详情提供红色永久删除操作。

## Progress
- 设备删除沿用引用检查。光路增加事务删除及权限和版本校验。
- 删除光路时删除其旧快照，在同一个 SQLite 写事务中重建不可变触发器。

## Verified
- pytest 设备后端和 aiohttp 集成 17 项通过，覆盖旧快照、权限及版本冲突。
- 前端 typecheck 与 build 通过。真实宿主未验收。

## Decisions
- 引用中的设备按钮禁用，保留引用完整性。

## Blockers
- 无。

## Next
- 宿主重启后验证界面。
