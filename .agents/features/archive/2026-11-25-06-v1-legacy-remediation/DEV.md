# V1 Legacy Remediation — DEV

初始化：chat1 · 2026-11-25T12:39:29-06:00

当前阶段：Closed。用户确认关闭，chat2 于 2026-11-25T15:38:42-06:00 更新。见 [CLOSE](CLOSE.md) 和 RUN-chat2-005。

## 策略

1. 先建立全量文件/测试用例清单与排除规则，逐文件给结论（`AUDIT.md`）。
2. 按“数据层 → 后端 API/契约 → MCP → 前端宿主与 UI → Siril Bundle → 打包/脚本/配置 → 文档与生成物”的顺序整改，先删兼容层再统一契约。
3. 修改前重新读取共享文件与工作树，确认其他 Chat 无未合并改动；本 Feature 当前由 chat1 独占写入。
4. 每个增量后运行最贴近的测试/lint；最后一轮跑 Feature 全量、打包与真实宿主验证，单独记录证据。
5. 生成物只在代码稳定后重新生成，不手工编辑。

## 任务

### TASK-chat1-001 · 全仓审查与报告

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat1
- 关联：FR-chat1-001..005
- 状态：Implemented
- 范围：`AGENTS.md`、`docs/**`、全部维护源码/测试/配置/脚本/依赖清单；排除生成物、第三方与归档证据。
- 结果：`AUDIT.md` 记录 327 个维护文件与 360 个测试用例（197 pytest + 47 MCP + 116 frontend）的审查结论；未修改业务代码。
- DEV_LOG：DEV-chat1-001

### TASK-chat1-002 · 数据库单一 Schema 源（D1）

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat2（用户授权接手）
- 关联：FR-chat1-001/AC-01..02，D1
- 状态：Implemented；最终验证待 TASK-chat1-007，见 DEV-chat2-001
- 预计范围：`astrophoto/database/manager.py`、`astrophoto/database/migrations/**`（删除）、`scripts/seed_equipment_fixture.py`、`scripts/release.py`、`tests/backend/test_storage.py`、`tests/integration/test_storage_init.py`、`tests/packaging/test_contents.py`、`pyproject.toml`、`requirements.txt`、`uv.lock`、`docs/architecture/overview.md`、`docs/domains/equipment.md`、`docs/development/setup-and-testing.md`、`docs/development/publishing.md`
- 策略：`Base.metadata.create_all` + `TRIGGERS` + SQLite `user_version`/独立 `SCHEMA_REVISION`；`expected_schema()` 继续做结构校验；`DEV_SCHEMA_RESET_REQUIRED` 保留；移除 Alembic 依赖与一切 `alembic_version` 读取。
- 局部验证：`uv run pytest tests/backend/test_storage.py tests/backend/test_storage_init.py tests/integration/test_storage_init.py tests/packaging/test_contents.py -q`；重建临时 Data Root；`uv lock --check`。

### TASK-chat1-003 · 后端契约与旧回执/旧路由清理（D3/D4）

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat2（用户授权接手）
- 关联：FR-chat1-001/AC-03、FR-chat1-002
- 状态：Implemented；见 DEV-chat2-002
- 预计范围：`astrophoto/storage/migration.py`、`astrophoto/assets/fits.py`、`astrophoto/assets/catalog.py`、`astrophoto/api/catalog.py`、`astrophoto/api/errors.py`、`astrophoto/api/scientific.py`、`astrophoto/core/config.py`、`astrophoto/equipment/snapshots.py`、`astrophoto/storage/import_planner.py`、`extension/siril/{routes,previews,processing,node}.py`
- 策略：删除 `asset_id`/`output_id`、`type`/`master_type`、`result_type`/`asset_type` 同义输出；统一 receipt 为 `run_id` + `command_id`；删除旧候选目录/旧回执分支；移除 `/previews/autostretch`；修复 canvas 预览设置未持久化；删除死错误码与 `confirmed/comparison/requires_confirmation`。
- 局部验证：对应 backend/integration 测试 + `uv run ruff check`。

### TASK-chat1-004 · MCP 契约与凭据残留清理（D2/D4）

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat2（用户授权接手）
- 关联：FR-chat1-001、FR-chat1-002
- 状态：Implemented；见 DEV-chat2-002
- 预计范围：`mcp/src/astrophoto_mcp/tools/{status,catalog,catalog_client,equipment}.py`、`mcp/src/astrophoto_mcp/api/{equipment,library}.py`、`mcp/src/astrophoto_mcp/server.py`、`mcp/tests/**`、`mcp/tests/fixtures/status_contract.json`
- 策略：删除旧 untyped status 文本响应（统一结构化输出与 Schema）；删除 `asset_type`/`result_type` 回退、`master_type`/`calibration_type` 双字段、死 `draft`/`revision_detail` 校验、无效 token 参数与相关测试夹具。
- 局部验证：`uv run --project mcp pytest mcp/tests -q` 与真实 stdio 冒烟。

### TASK-chat1-005 · 前端宿主 API 与 UI 契约（D2/D4）

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat2（用户授权接手）
- 关联：FR-chat1-001、FR-chat1-002
- 状态：Implemented；见 DEV-chat2-004 / RUN-chat2-003
- 预计范围：`frontend/src/host/{notify,nodeBookmarks}.ts`、`frontend/src/features/assets/{CatalogDetails.vue,CatalogEditor.vue,CatalogCalibration.vue,ImportAssets.vue}`、`frontend/src/features/library/components/equipmentFields.tsx`、`frontend/src/features/nodes/preview/Inspector.tsx`、`frontend/src/api/nodes.ts`、`frontend/src/i18n/locales/**`、`frontend/tests/**`、`frontend/tests/host.ts`
- 策略：通过 `extensionManager.setting.get/set` 访问宿主设置，通过公开 `app.api.getSetting` 回读核对持久化值，并使用当前 toast API；删除 `app.ui.settings.settingsValues` + `storeSetting` 手写持久化与 500ms 轮询；删除死导出/旧字段别名；更新 locale 键与测试。
- 局部验证：`pnpm -C frontend typecheck`、`lint`、`build`、`test`。

### TASK-chat1-006 · 配置、脚本与生成物

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat2（用户授权接手）
- 关联：FR-chat1-004、FR-chat1-005
- 状态：Implemented；见 DEV-chat2-002
- 预计范围：`.pre-commit-config.yaml`、`frontend/package.json`（类型版本核对）、`frontend/src/vendor/comfyui/README.md`（版本核对）、`scripts/api_inventory.py`、`scripts/render_api_reference.py`、`docs/api/inventory.json`、`docs/api/http/routes.md`、`docs/api/mcp/*.md`
- 策略：对齐开发工具版本；确认 vendored 组件的目标宿主版本或记录无法升级的原因；代码稳定后重新生成 inventory/routes/MCP 页面并跑漂移测试。
- 局部验证：`uv run pytest tests/packaging -q`。

### TASK-chat1-007 · 文档同步与最终验证

- Created by: chat1 · 2026-11-25T12:39:29-06:00
- Owner: chat2（用户授权接手）
- 关联：FR-chat1-004、FR-chat1-005，D5
- 状态：Implemented；见 RUN-chat2-001..003
- 预计范围：`docs/architecture/overview.md`、`docs/domains/{siril,equipment,assets,storage}.md`、`docs/integrations/mcp.md`、`docs/api/http/contracts.md`、`docs/api/mcp/contracts.md`、`docs/development/*.md`、`README.md`、`AGENTS.md`（如需）
- 策略：删除已不存在的兼容声明，保留历史段落并标日期；运行全量离线套件、打包检查与真实宿主套件；`TEST_REPORT.md` 记录真实 RUN。
- 验收：返工后的 `AUDIT.md` 全项状态更新；残留扫描无旧接口/旧键/旧迁移入口。

## 依赖与风险

- 依赖 D1..D5 已确认；无阻塞。
- 真实宿主验证需重启 8188：实施前检查活动任务与队列，避免中断；Siril 1.4.5 未检出时相关真实 CLI 用例按环境跳过并注明。
- 删除 `result_type` 输出与 `type`→`master_type` 会影响 HTTP/MCP JSON 与前端；必须按 D4 全链路同步。
- `image_result_type` 的缺省行为（无 attributes 时视为 master_frame）属于旧数据兜底，整改后应改为严格校验；会要求测试夹具补齐 attributes。

## 预计修改范围说明

`AUDIT.md` 第 6 节按文件列出全部结论；本节只列工作包。实际实施中因真实依赖新增的文件必须回写本 DEV 与 DEV_LOG。

<!-- chat2 2026-11-25T12:58:36-06:00: TASK-chat1-002 实现并局部验证；TASK-chat1-003 进行中，详见 DEV-chat2-001。 -->

<!-- Updated by chat2 · 2026-11-25: 接手 TASK-chat1-002/003；保留其他任务历史归属。 -->

<!-- Updated by chat2 · 2026-11-25T13:41:46-06:00：更新 TASK-chat1-002..007 的接手和实际状态；403 检测冲突未标完成。 -->

<!-- chat2 · 2026-11-25T13:51:29-06:00：完成书签 HTTP 403 整改及验收回归。 -->

### TASK-chat4-001 · 正式代码审查

- chat4 · 2026-11-25T14:00:03.4648631-06:00 · Owner chat4（Code Reviewer）。关联 TASK-chat1-002..007、FR-chat1-001..005。
- 状态为审查完成，整改待处理。REVIEW-chat4-001 有 2 项 P1、3 项 P2、1 项 P3；后续复审按原发现 ID 核销。

### TASK-chat5-001 · 第二轮正式代码审查

- chat5 · 2026-11-25T14:08:45-06:00 · Owner chat5（Code Reviewer）。关联 TASK-chat1-002..007、FR-chat1-001..005。
- 状态：审查完成，整改待处理。产出 REVIEW-chat5-001：4 项新发现（F01 P2、F02–F04 P3）加 1 项 TC-chat1-009 测试缺口；REVIEW-chat4-001 的 F01–F06 在同一快照下仍为 Open，未核销。
- 业务代码、测试、配置与生成物：零改动；本轮只写 REVIEW/DEV/DEV_LOG/TEST_PLAN。

### TASK-chat2-001 · 修复 chat4 和 chat5 的审查发现

- Owner: chat2。Updated by chat2 · 2026-11-25T14:22:46-06:00。状态 Implemented。
- 范围为 REVIEW-chat4-001-F01..F06、REVIEW-chat5-001-F01..F04 及 TC-chat1-009 文档内容断言。
- 实际文件与证据见 DEV-chat2-005、RUN-chat2-004。独立复审保留原审查者与发现 ID。

### TASK-chat6-001 · 独立代码审查与修复复核

- chat6（Owner / Code Reviewer）· 2026-11-25T14:29:14-06:00。关联 TASK-chat1-002..007、TASK-chat2-001、FR-chat1-001..005。
- 审查完成，要求修改。原 10 项发现按原触发条件复核，新增 3 项 P2，见 REVIEW-chat6-001。

### TASK-chat7-001 · 第四轮独立代码审查

- chat7（Owner / Code Reviewer）· 2026-11-25T14:39:53.372410-06:00。关联 TASK-chat1-002..007、TASK-chat2-001、TASK-chat6-001、FR-chat1-001..005。
- 状态：审查完成，要求修改。产 REVIEW-chat7-001：独立复现 REVIEW-chat6-001-F01..F03（仍为 Open），新增 F01（P2，测试素材脚本仍发 `type`）、F02（P3，校准主帧 `catalog_resource`）、F03（P3，AUDIT 未随修复更新）。
- 业务代码、测试、配置与生成物：零改动；本轮只写 REVIEW/DEV/DEV_LOG/TEST_PLAN。复现脚本在 `.artifact/review-chat7/`（git 忽略）。

### TASK-chat2-002 · 修复 chat6 和 chat7 的审查发现

- Owner / Updated by：chat2 · 2026-11-25T14:46:18.9406504-06:00；2026-11-25T14:56:12-06:00 更新为 Implemented。
- 范围为 REVIEW-chat6-001-F01..F03、REVIEW-chat7-001-F01..F03，关联 FR-chat1-001/002/004/005 和 TEST_PLAN 的 chat6/chat7 修订。
- 预计涉及 Siril 输入标识、素材目录与角色校验、测试素材脚本、宿主书签与侧栏、对应 HTTP/前端回归及 Feature 台账。以进入任务时的现有工作树为基线。
- 6 项已由实施 Chat 修复及验证。实际改动和验证见 DEV-chat2-006、RUN-chat2-005。后续独立复审沿用原发现 ID。
