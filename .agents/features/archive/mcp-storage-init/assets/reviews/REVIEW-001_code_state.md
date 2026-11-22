# REVIEW-001 被审查代码状态

| 项目 | 记录 |
| --- | --- |
| 审查编号 | REVIEW-001 |
| 记录时间 | 2026-11-22 |
| 仓库 HEAD | `f84442b`（统一前端技术栈） |
| 工作树 | 有未提交改动，属开发基线；本轮改动混合其他在研 Feature，审查范围见下 |
| 需求基线 | PRD v0.3、TECH v0.1（均已批准） |
| 测试方案 | 05_TEST_PLAN.md v0.1 |
| Diff 快照 | `assets/reviews/REVIEW-001_diff.patch`（2028 行，SHA-256 `0aefe28a73fade8adcec500b8cae8eab4e314d3a69fdab37576d9f336fd18e62`） |
| 审查模式 | 只读；不得修改生产代码、PRD 或 TECH |

## 审查范围内的文件（含 SHA-256 前缀）

| 文件 | sha256 前 16 位 |
| --- | --- |
| `astrophoto/storage/runtime.py` | `e1cf5e317a9b8316` |
| `astrophoto/storage/initializer.py` | `ae44f73dd6e3aab3` |
| `astrophoto/storage/locations.py` | `e0d3a4f7ae5c18e9` |
| `astrophoto/storage/paths.py` | `f0371ecaa9324d1a` |
| `astrophoto/storage/cache.py` | `368c7bef38491960` |
| `astrophoto/core/config.py` | `d081b949bfd903d3` |
| `astrophoto/database/manager.py` | `0b3a5cda3e5c993a` |
| `astrophoto/api/storage.py` | `c98c572ec1558532` |
| `astrophoto/api/routes.py` | `445d640a77768323` |
| `astrophoto/bootstrap.py` | `d265b9932373aed9` |
| `mcp/src/astrophoto_mcp/server.py` | `3d7af4dd803e41c1` |
| `mcp/src/astrophoto_mcp/tools/init.py`（新增） | `e64be4d835aa8c7b` |
| `mcp/tests/test_init.py`（新增） | `e720268e30fdb250` |
| `tests/backend/test_storage_init.py`（新增） | `554a4c78654b3ec8` |
| `tests/backend/test_storage_review.py`（新增） | `ba8dda58d7c65d97` |
| `tests/integration/test_storage_init.py`（新增） | `6a4dca21f4283b7e` |
| `tests/integration/test_storage_api.py` | `0fed36321c068ddf` |
| `scripts/check_install.py` | `3668c2279169e612` |

## 范围边界

- 只审查「通过本地 MCP 的 `init` 补齐 `.astrophoto/` 并一次调用内确认就绪」这一闭环：`init` 工具、`POST /astrophoto/v1/storage/init`、`StorageRuntime` 的在线补齐与复核、以及支撑上述路径的身份／锁／位置核对改动。
- 同工作树内的其他在研内容（摄影库 library、设备 equipment、Siril、前端）不在本次审查范围；`astrophoto/storage/migration.py`、`astrophoto/assets/*`、`astrophoto/api/library.py` 等不属于本 Feature 的实现，仅在被 `init` 路径直接引用时才作为上下文核对。
- `assets/dev/host-init.json` 是 DEV 阶段宿主观测记录，属开发者证据，不是本次审查的结论依据；审查需独立判断其覆盖是否与 PRD 的 AC 对应。
