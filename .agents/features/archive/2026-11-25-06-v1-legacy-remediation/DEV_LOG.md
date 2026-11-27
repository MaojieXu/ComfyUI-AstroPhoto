# V1 Legacy Remediation — DEV_LOG

初始化：chat1 · 2026-11-25T12:39:29-06:00

## 实现与决策历史

### DEV-chat1-001

- Chat: chat1
- Time: 2026-11-25T12:39:29-06:00
- Type: Decision / Audit
- Task / FR/AC: TASK-chat1-001；FR-chat1-001..005
- Related / Supersedes: 无
- Status: Audit implemented；business code unchanged
- 用户请求与最终决定:
  - 用户要求对全仓做实现级整改，先给出详细探查报告；确认 Chat ID `chat1`、Feature 目录 `2026-11-25-06-v1-legacy-remediation`。
  - 决断 D1：删除 Alembic 基线、依赖和 `database/migrations/`，SQLAlchemy metadata 为唯一 Schema 源。
  - 决断 D2：只保留目标宿主新 API，删除旧宿主适配（基线 Backend 0.46.0 / Frontend 1.59.6）；页面内反馈保留。
  - 决断 D3：保留工作区搬迁与 `DEV_SCHEMA_RESET_REQUIRED`，只清理旧回执/旧目录格式。
  - 决断 D4：统一 canonical API 名，清理同义别名，允许改对外 JSON；`catalog.CAPTURE` 映射保留并改名。
  - 决断 D5：允许重启 8188 做真实宿主验证，须先确认实例状态并分别记录。
- 实际结果与依据:
  - 已完成全仓只读审查，形成 `AUDIT.md`：327 个维护文件逐项结论，197 个 pytest + 47 个 MCP + 116 个前端测试用例逐项处理建议。
  - 未修改任何业务源码、测试、配置或依赖；工作树原有 `AGENTS.md`、`docs/architecture/overview.md`、`docs/product/requirements.md` 的未提交修改保持不动，未纳入本次归属。
  - 判定为非违规并保留的例子：工作区搬迁 `/storage/migrations/*`；`DEV_SCHEMA_RESET_REQUIRED`；导入/备份/重试等真实错误处理；宿主不可用时的页面内反馈；`catalog.CAPTURE` 的列名↔属性名映射。
  - 判定为需整改的类别：Alembic 双 Schema 源；旧回执 `asset_id`/`output_id`；旧候选目录、旧回执缺 `command_id` 的默认值；`asset_type`/`result_type` 与 `type`/`master_type` 双名；旧 `/previews/autostretch`；MCP 旧 untyped `connection_status` 文本；无效 token 参数/环境键；`toast.add` 与 `app.ui.settings.settingsValues` 手写持久化；旧 Siril 标题迁移；canvas 预览设置未持久化；死错误码/死字段/死导出。
- PRD 核对: PRD 已按 D1..D5 建立；无待决产品冲突。

#### Changed Files

| 仓库相对 File Path（重命名含新旧路径） | Action | Changes |
| --- | --- | --- |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/PRD.md` | Added | 需求、决断、验收条件 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/DEV.md` | Added | 工作包、范围、依赖与风险 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/DEV_LOG.md` | Added | 本记录 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/TEST_PLAN.md` | Added | 验证设计、现有测试映射与缺口 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/AUDIT.md` | Added | 详细探查报告与全量覆盖清单 |

业务代码、测试、Schema、配置、依赖和 `docs/`：无改动（本次仅审查）。

#### Local Verification

| 命令 / 场景 | 真实结果 / 证据 | 限制 |
| --- | --- | --- |
| 全仓文件枚举（排除 `.git`、`.venv`、`.codegraph`、`.artifact`、`node_modules`、`__pycache__`、`js/`、`frontend/src/vendor/`） | 327 个维护文件，清单见 `AUDIT.md` §6 | 生成物/第三方按规则排除，只审调用侧 |
| 测试用例枚举 | pytest 197；MCP 47；前端 116 | 未运行测试，本次为只读审查 |
| 8188 宿主探测 | `GET /system_stats` 返回 200，ComfyUI 0.46.0 / Frontend 1.59.6；`custom_nodes/ComfyUI_AstroPhoto` 指向本仓库 | 未重启、未执行宿主用例 |
| `.venv/Scripts/python.exe -m pytest tests/packaging/test_document_navigation.py -q` | `2 passed` | 仅验证新 Feature 文档链接可解析；未运行其他测试 |
| Siril CLI 探测 | 本机未检出 Siril 1.4.5 | 真实 CLI 用例实施后按环境跳过并记录 |

#### Untested / Next / Related TC

- 所有整改项尚未实施，未运行测试；TC-chat1-001..012 见 `TEST_PLAN.md`。
- 实施前需重新确认 8188 无活动导入/迁移任务，再重启加载新代码。
- 前端 `@comfyorg/comfyui-frontend-types` 1.59.1 与文档基线 1.59.6 的差异、vendored 组件来源版本，需在 TASK-chat1-006 核对（可能无可用 1.59.6 类型包）。


### DEV-chat2-001

- Chat: chat2 · Time: 2026-11-25T12:58:36-06:00
- 任务：TASK-chat1-002、TASK-chat1-003（部分）；FR-chat1-001/002/005。
- 状态：实施中；PRD 有效需求未变。
- 数据库：复用 SQLAlchemy metadata、SQLite user_version 和现有 Schema 校验创建/检查数据库；删除 Alembic 文件与依赖，保留 fail-fast。更新 fixture、Registry 检查、锁文件和相关文档。
- 后端部分：保存 canvas 设置，移除旧预览路由；Siril 回执统一 run_id/command_id；搬迁移除旧 plan、旧回执分支并保留已收录输出的 AssetLocation 同步。其余后端契约和后续任务尚未实施。
- 实际文件：`astrophoto/database/manager.py`、删除 `astrophoto/database/migrations/env.py` 和 `astrophoto/database/migrations/versions/0001_v1_baseline.py`、`astrophoto/api/scientific.py`、`astrophoto/core/config.py`、`astrophoto/storage/migration.py`、`extension/siril/processing.py`、`extension/siril/previews.py`、`extension/siril/routes.py`、`pyproject.toml`、`requirements.txt`、`uv.lock`、`scripts/release.py`、`scripts/seed_equipment_fixture.py`、`tests/backend/test_storage.py`、`tests/backend/test_storage_init.py`、`tests/backend/test_siril.py`、`tests/integration/test_storage_init.py`、`tests/integration/test_storage_api.py`、`tests/integration/test_siril_api.py`、`tests/packaging/test_contents.py`、`docs/architecture/overview.md`、`docs/development/publishing.md`、`docs/development/setup-and-testing.md`、`docs/domains/equipment.md`、本 Feature DEV/DEV_LOG/TEST_PLAN/AUDIT。`docs/architecture/overview.md` 原有未提交修改保留。
- 验证：数据库及打包局部运行 82 passed、2 skipped、4 failed；失败是本次临时目录被打包发现，移除目录后 `tests/packaging/test_contents.py` 8 passed。新增 schema/preview 用例 3 passed；搬迁/Siril 套件初次 82 passed、5 skipped、5 failed，修正旧夹具后受影响用例 7 passed。变更文件 Ruff 通过。沙箱内 uv lock 因网络失败，正常环境重试成功。
- 未验证：最终全量、宿主、生成物漂移；TASK-chat1-003 尚未完成，后续任务未开始。


### DEV-chat2-002

- Chat: chat2 · Time: 2026-11-25T13:41:46-06:00
- Task / FR: TASK-chat1-003..007；FR-chat1-001..005；关联 DEV-chat2-001。
- 状态：核心整改及大部分验证完成；TASK-chat1-005/007 因真实宿主 HTTP 403 检测决断保持 In Progress。PRD 的 D1–D5 未变。
- 实现：统一 HTTP/MCP/前端 `asset_type`、`master_type` 和 `catalog_resource`，移除绑定确认死字段、FITS 旧输出解析、旧通知和书签持久化分支、Siril 旧标题；Siril 输出的已收录 AssetLocation 搬迁保持同步。补真实回执、role fail-fast、旧字段拒绝测试；清理旧凭据和错误码。复用 SQLAlchemy、FastMCP 结构化输出、宿主 setting/toast 与设置事件、项目既有打包生成器；未引入新依赖。`_dependencies.py` 的两种导入上下文对应独立顶层测试/包与宿主嵌套包，保留并删除无用 models 导出。
- 宿主限制：1.59.6 的 `setting.set` 网络异常会拒绝，现有实现回滚内存并提示；真实探测 HTTP 403 时 Promise 正常完成、内存值更新而持久值不变，因此仅用 setting.get/set 无法识别该失败。是否使用宿主公开 `app.api.getSetting` 只读核验已向用户询问；未宣称该场景通过。npm 无 `@comfyorg/comfyui-frontend-types@1.59.6`，vendored 来源仍如实记录 1.59.1。
- 其他：旧 8188 测试库保留；重启使用 `.artifact/frontend-preview/astrophoto-remediation` 新测试根。Siril CLI 未安装、第二物理卷不可用。

#### 本轮实际变更文件

- `.pre-commit-config.yaml`（M）
- `README.md`（M）
- `astrophoto/api/catalog.py`（M）
- `astrophoto/api/errors.py`（M）
- `astrophoto/api/library.py`（M）
- `astrophoto/assets/catalog.py`（M）
- `astrophoto/assets/fits.py`（M）
- `astrophoto/assets/imports.py`（M）
- `astrophoto/assets/library.py`（M）
- `astrophoto/equipment/snapshots.py`（M）
- `astrophoto/storage/import_planner.py`（M）
- `astrophoto/storage/migration.py`（M）
- `docs/api/http/contracts.md`（M）
- `docs/api/http/routes.md`（M）
- `docs/api/inventory.json`（M）
- `docs/api/mcp/connection.md`（M）
- `docs/api/mcp/contracts.md`（M）
- `docs/api/mcp/examples.md`（M）
- `docs/api/mcp/library.md`（M）
- `docs/architecture/overview.md`（M）
- `docs/development/setup-and-testing.md`（M）
- `docs/domains/assets.md`（M）
- `docs/domains/siril.md`（M）
- `docs/integrations/mcp.md`（M）
- `docs/product/requirements.md`（M）
- `extension/siril/_dependencies.py`（M）
- `extension/siril/frontend/SirilNodes.tsx`（M）
- `extension/siril/processing.py`（M）
- `frontend/src/api/assets.ts`（M）
- `frontend/src/api/nodes.ts`（M）
- `frontend/src/api/previewSettings.ts`（M）
- `frontend/src/features/assets/AssetsPanel.vue`（M）
- `frontend/src/features/assets/CatalogCalibration.vue`（M）
- `frontend/src/features/assets/CatalogDetails.vue`（M）
- `frontend/src/features/assets/CatalogEditor.vue`（M）
- `frontend/src/features/assets/CatalogProjects.vue`（M）
- `frontend/src/features/assets/ImportAssets.vue`（M）
- `frontend/src/features/library/components/equipmentFields.tsx`（M）
- `frontend/src/features/nodes/NodesPage.tsx`（M）
- `frontend/src/features/nodes/preview/Inspector.tsx`（M）
- `frontend/src/features/storage/storage.css`（M）
- `frontend/src/host/canvas.ts`（M）
- `frontend/src/host/locale.ts`（M）
- `frontend/src/host/nodeBookmarks.ts`（M）
- `frontend/src/host/notify.ts`（M）
- `frontend/src/i18n/locales/en/assets.json`（M）
- `frontend/src/i18n/locales/en/sidebar.json`（M）
- `frontend/src/i18n/locales/zh/assets.json`（M）
- `frontend/src/i18n/locales/zh/sidebar.json`（M）
- `frontend/tests/components/AssetsLibrary.test.ts`（M）
- `frontend/tests/components/NodeCatalog.test.ts`（M）
- `frontend/tests/components/SidebarNavigation.test.ts`（M）
- `frontend/tests/host.ts`（M）
- `frontend/tests/host/api.test.ts`（M）
- `frontend/tests/host/host-runtime.mjs`（M）
- `frontend/tests/host/siril-presentation.mjs`（M）
- `frontend/tests/widgets/serialization.test.ts`（M）
- `js/assets/main.css`（M）
- `js/main.js`（M）
- `mcp/src/astrophoto_mcp/api/equipment.py`（M）
- `mcp/src/astrophoto_mcp/api/library.py`（M）
- `mcp/src/astrophoto_mcp/server.py`（M）
- `mcp/src/astrophoto_mcp/tools/catalog.py`（M）
- `mcp/src/astrophoto_mcp/tools/catalog_client.py`（M）
- `mcp/src/astrophoto_mcp/tools/catalog_models.py`（M）
- `mcp/src/astrophoto_mcp/tools/projects.py`（M）
- `mcp/src/astrophoto_mcp/tools/status.py`（M）
- `mcp/tests/conftest.py`（M）
- `mcp/tests/fixtures/status_contract.json`（M）
- `mcp/tests/test_catalog_tools.py`（M）
- `mcp/tests/test_disclosure.py`（M）
- `mcp/tests/test_equipment.py`（M）
- `mcp/tests/test_server.py`（M）
- `tests/backend/test_agent_direct_rules.py`（M）
- `tests/backend/test_siril.py`（M）
- `tests/backend/test_storage.py`（M）
- `tests/conftest.py`（M）
- `tests/integration/test_catalog_pagination.py`（M）
- `tests/integration/test_equipment_api.py`（M）
- `tests/integration/test_library_mcp.py`（M）
- `tests/integration/test_photography_library.py`（M）
- `tests/integration/test_storage_api.py`（M）
- `.agents/features/2026-11-25-06-v1-legacy-remediation/{PRD,DEV,DEV_LOG,TEST_PLAN,AUDIT,TEST_REPORT}.md`：chat2 状态、审计与证据。

`docs/architecture/overview.md`、`docs/product/requirements.md` 在本 Feature 开始前已有用户未提交修改，本轮仅增量修改相关措辞；保留其余内容。

- 局部/正式验证与失败复测：见 TEST_REPORT 的 RUN-chat2-001；最终 403 决断后的实现和验证尚未执行。


### DEV-chat2-003

- Chat: chat2 · Time: 2026-11-25T13:43:14-06:00 · TASK-chat1-007 验证补充；无业务代码修改。
- 真实宿主 canvas 保存及回读通过；旧预览 POST 在独立测试为 404，真实宿主与任意未知 POST 对照均为 405，详见 RUN-chat2-002。
- 修正空白格式：`astrophoto/api/errors.py`、`frontend/src/features/library/components/equipmentFields.tsx`；Feature 证据变动：`DEV_LOG.md`、`TEST_REPORT.md`。
- `git -c core.longpaths=true diff --check` 通过；文档/API 选择器 7 passed。403 检测依赖用户决断。

### DEV-chat2-004

- Chat: chat2 · Time: 2026-11-25T13:51:29-06:00
- TASK-chat1-005/007，FR-chat1-001/002/004/005。用户授权继续解决 403，D1–D5 不变。
- 通过宿主公开 `app.api.getSetting` 校验写入后的完整书签列表。回读不一致时以服务器实值恢复宿主状态并向用户报告失败。
- 修改 `frontend/src/host/nodeBookmarks.ts`、`frontend/tests/host.ts`、`frontend/tests/host/host-runtime.mjs`、`docs/architecture/overview.md`。重新构建前端（`js/main.js`）并同步本 Feature 的 DEV、DEV_LOG、TEST_PLAN、AUDIT、TEST_REPORT。
- 前端全量和打包通过，真实宿主 classic 与 Nodes 2.0 的 HTTP 403 均复验通过。详见 RUN-chat2-003。

### DEV-chat4-001 · 独立代码审查

- chat4 · 2026-11-25T14:00:03.4648631-06:00 · TASK-chat4-001 / REVIEW-chat4-001。核对 RUN-chat2-003 对应工作树，完成定向回归及边界场景复现，记录 F01..F06，状态均为 Open。
- 实际文件均在本 Feature 目录：新增 REVIEW.md，更新 DEV.md、DEV_LOG.md、TEST_PLAN.md。本轮业务代码变更为零。既有正式 RUN 仍保存在 TEST_REPORT.md。

### DEV-chat5-001 · 第二轮独立代码审查

- Chat: chat5 · Time: 2026-11-25T14:08:45-06:00 · TASK-chat5-001 / REVIEW-chat5-001。
- 角色：Code Reviewer（实现 Chat 为 chat2）。审查前重读 PRD、DEV、DEV_LOG、TEST_REPORT、TEST_PLAN、REVIEW-chat4-001 与工作树。
- 基线：`HEAD f7a15f237fe4c765ecfbac597388baf8ab83230f` + 工作树；`git diff --binary HEAD` SHA-256 `def4c1c25522ebe867c84f974dc3958434da8f5739226c7b8b020683aa85b606`，与 REVIEW-chat4-001、RUN-chat2-003 一致；暂存区为空；唯一未跟踪项为本 Feature 目录。文件修改前已再次读取四个共享文档，未覆盖 chat1/chat2/chat4 记录。
- 结论：要求修改。新增 REVIEW-chat5-001-F01（P2，`result_type` 请求名与 `asset_type` 响应名并存，违反 D4 与 FR-chat1-002/AC-01）、F02（P3，`frontend/tests/host/equipment-host.mjs` 仍在等待已删除的 `EQUIPMENT_REFERENCED`）、F03（P3，`astrophoto/assets/catalog.py` 内的恒假条件）、F04（P3，`assets/library.py` 新增的资源名内联映射与 `catalog.MODELS` 重复）。REVIEW-chat4-001 的 F01–F06 在本快照仍为 Open，本轮未复现、未核销。
- 测试缺口：TC-chat1-009 的文档内容断言（无 `alembic`、无 `/previews/autostretch`、无 `ASTROPHOTO_IMPORT_ROOTS`）未实现，已补记到 TEST_PLAN 的 chat5 修订。
- 验证：`uv run pytest tests/nodes tests/backend tests/integration -m "not host" -q` → 227 passed、5 skipped、1 deselected；`uv run --project mcp pytest mcp/tests -q` → 97 passed；`uv run pytest tests/packaging -q` → 17 passed；`uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py` → 通过；`uv lock --check` → 通过；前端（`frontend/node_modules/.bin`，本机无 `pnpm`）`vue-tsc --noEmit`、`vite build`、`check-build.mjs`、`check-proxy.mjs`、`vitest run --no-file-parallelism`（16 文件 135 项）全部通过。默认并发 `vitest run` 出现一次浏览器 iframe 启动超时，串行复测通过，按本机夹具抖动记录。
- 未验证：真实 8188 宿主、真实 Siril 1.4.5 CLI、第二物理卷（沿用 RUN-chat2-001..003）；书签跨标签页读取刷新是否由宿主 `.change` 事件覆盖未验证（风险记录，非发现）。
- PRD 核对：本轮未发现产品级新冲突；D1–D5 与 FR 未变，不改 PRD。正式 RUN 与结论仍以 TEST_REPORT 为准，本轮不改变任何 RUN 的有效性。

#### Changed Files

| 仓库相对 File Path | Action | Changes |
| --- | --- | --- |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/REVIEW.md` | M | 追加 REVIEW-chat5-001 轮次与结论 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/DEV.md` | M | 追加 TASK-chat5-001 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/DEV_LOG.md` | M | 本记录 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/TEST_PLAN.md` | M | chat5 覆盖修订（TC-chat1-009 缺口确认、F01 命名断言需求） |

业务代码、测试、配置、Schema、依赖、`docs/` 与生成物：本轮零改动（`git diff --binary HEAD` 的 SHA-256 审查前后不变）。

### DEV-chat2-005 · 处置两轮独立审查发现

- Chat: chat2 · Time: 2026-11-25T14:24:03-06:00 · TASK-chat2-001 · FR-chat1-001..005。PRD D1–D5 保持有效。
- REVIEW-chat4-001-F01..F06 和 REVIEW-chat5-001-F01..F04 的修复与逐项验证已写回 REVIEW。HTTP / MCP / 前端统一导入 `asset_type`。省略时 `kind=image_result` 默认导入为 `image_result`。目录和回执共享计划分类。文档内容断言已实现。
- 业务路径：`astrophoto/assets/catalog.py`、`astrophoto/assets/imports.py`、`astrophoto/assets/library.py`、`astrophoto/database/catalog_models.py`、`astrophoto/storage/migration.py`、`extension/siril/node.py`、`extension/siril/frontend/SirilNodes.tsx`、`frontend/src/features/assets/ImportAssets.vue`、`frontend/src/host/nodeBookmarks.ts`、`mcp/src/astrophoto_mcp/tools/catalog.py`、`scripts/import_library_test_assets.py`。
- 验证路径：`tests/backend/test_siril.py`、`tests/backend/test_storage.py`、`tests/integration/test_equipment_api.py`、`tests/integration/test_library_mcp.py`、`tests/integration/test_photography_library.py`、`tests/integration/test_siril_api.py`、`tests/integration/test_storage_api.py`、`tests/packaging/test_document_navigation.py`、`frontend/tests/components/AssetsLibrary.test.ts`、`frontend/tests/components/NodeCatalog.test.ts`、`frontend/tests/components/ScientificNodes.test.ts`、`frontend/tests/host/equipment-host.mjs`。
- 文档及构建：`docs/api/http/catalog-contracts.md`、`docs/api/http/contracts.md`、`docs/architecture/overview.md`、`docs/domains/siril.md`、`js/main.js`，以及本 Feature 的 DEV、DEV_LOG、REVIEW、TEST_PLAN、TEST_REPORT。现有生成器重跑 API inventory/参考页，打包漂移通过。
- 初次 Siril 测试替身漏填实际配置的 version 字段，补齐后定位用例与离线全量通过。首次运行设备宿主脚本时原归档确认框断言超时，脚本清理成功，按当前归档交互更新后全流程通过。
- 结果与环境边界见 RUN-chat2-004。此处记录实施 Chat 的验证，独立复审待安排。

### DEV-chat6-001 · 第三轮独立代码审查

- chat6（Code Reviewer）· 2026-11-25T14:29:14-06:00。TASK-chat6-001 / REVIEW-chat6-001。当前跟踪差异与 RUN-chat2-004 相同。复核 chat4、chat5 的修复，在 Siril 来源身份、校准主帧分类和书签回读失败路径各复现一项 P2。
- 实际修改均在 `.agents/features/2026-11-25-06-v1-legacy-remediation/` 内，分别为 `REVIEW.md`（结果及证据）、`DEV.md`（审查任务）、`DEV_LOG.md`（本记录）、`TEST_PLAN.md`（三项覆盖缺口）。需求依据及正式 RUN 沿用现有记录。独立定向检查 26 项通过。

### DEV-chat7-001 · 第四轮独立代码审查

- Chat: chat7 · Time: 2026-11-25T14:39:53.372410-06:00 · TASK-chat7-001 / REVIEW-chat7-001。角色 Code Reviewer，实施 Chat 为 chat2；与该任务的实现 Chat 不同。
- 基线：HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f` + 工作树；`git diff --binary HEAD` SHA-256 `a1a2f2820d7eee77ce419de16d1b1a702f4aca9abaf58edf497c099e71423f2d`，与 RUN-chat2-004、REVIEW-chat6-001 一致；暂存区为空；未跟踪项仅本 Feature 目录。审查前后哈希不变。
- 结论：要求修改。REVIEW-chat4-001-F01..F06、REVIEW-chat5-001-F01..F04 与 TC-chat1-009 按原触发条件复核已修复；REVIEW-chat6-001-F01..F03 用独立脚本/源码路径复核后仍为 Open。新增 REVIEW-chat7-001-F01（P2，`scripts/import_library_test_assets.py` 仍在校准主帧导入中使用已删除的 `type`，实测 422）、F02（P3，校准主帧在素材列表中的 `catalog_resource` 恒为 `image_result`，AUDIT F-chat1-012 的 `calibration_master`/`is_calibration_master` 未落地）、F03（P3，AUDIT 未随最近一轮修复更新，与 TASK-chat1-007 验收不符）。
- 验证：`python -m pytest tests/nodes tests/backend tests/integration -m "not host" -q` → 229 passed、5 skipped、1 deselected；MCP 97 passed；打包 18 passed；Ruff 通过；`vue-tsc --noEmit` 通过；Vitest 16 文件 137 项通过；7 项定向复核通过。复现脚本在 `.artifact/review-chat7/`（`test_chain_after_collect.py`、`test_calibration_resource.py`、`test_role_flip.py`），已被 git 忽略。
- 未验证：真实 8188 宿主、真实 Siril 1.4.5 CLI、第二物理卷（沿用现有环境跳过记录）；REVIEW-chat6-001-F03 未重建浏览器夹具。

#### Changed Files

| 仓库相对 File Path | Action | Changes |
| --- | --- | --- |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/REVIEW.md` | M | 追加 REVIEW-chat7-001（范围、3 项新发现、chat6 复核、验证与结论） |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/DEV.md` | M | 追加 TASK-chat7-001 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/DEV_LOG.md` | M | 本记录 |
| `.agents/features/2026-11-25-06-v1-legacy-remediation/TEST_PLAN.md` | M | chat7 覆盖修订（3 项新发现对应的测试缺口） |

业务代码、测试、配置、Schema、依赖、`docs/`、生成物与正式 RUN：本轮零改动。

### DEV-chat2-006 · 处置 chat6 与 chat7 审查发现

- chat2 · 2026-11-25T14:56:12-06:00 · TASK-chat2-002 · REVIEW-chat6-001-F01..F03、REVIEW-chat7-001-F01..F03。实施完成，PRD D1–D5 保持有效。
- `astrophoto/assets/service.py`：按已登记工作区与相对路径查 FormalOutput 并复用 resolve_output。正式输出在收录前后使用同一 ID。原有路径和文件可读校验保留。
- `astrophoto/assets/library.py`：校准主帧优先作为素材目录资源，在事务内拒绝会使主帧仍有校准登记却失去 master_frame 角色的编辑。类型化目录编辑继续维护用途和绑定。
- `scripts/import_library_test_assets.py`：校准主帧任务提交 master_type，移除旧 type。
- `frontend/src/host/nodeBookmarks.ts`、`frontend/src/features/nodes/NodesPage.tsx`、`frontend/src/i18n/locales/en/sidebar.json`、`frontend/src/i18n/locales/zh/sidebar.json`：继续使用现有宿主 setter 和公开 getSetting；删除补偿写入，显示验证后的服务器列表，回读失败时提示状态未知。网络恢复、焦点和激活触发只读同步。本地宿主设置事件保留即时同步。
- `tests/integration/test_siril_api.py`、`tests/integration/test_photography_library.py`、`frontend/tests/components/NodeCatalog.test.ts`、`frontend/tests/components/AssetsLibrary.test.ts`、`frontend/tests/host/host-runtime.mjs`：补串联收录、主帧分类与绑定、脚本请求、书签故障恢复、真实 403 重试及校准详情路由回归。
- `docs/api/http/contracts.md`、`docs/domains/siril.md`、`docs/architecture/overview.md`：同步目录、预览和书签契约。重建 `js/main.js` 并检查构建结果。API inventory、routes 和 MCP 参考页重新生成，未见契约漂移。
- Feature 文档变更：`REVIEW.md` 更新六项状态，`AUDIT.md` 同步 F-chat1-012 和相关文件/测试，`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`、`TEST_REPORT.md` 同步任务与验证。原审查结论保留原快照含义。
- RUN-chat2-005 记录全量、真实宿主、初次失败与复测，和真实 Siril CLI、第二物理卷的环境限制。原书签设置 API 没有原子合并，本次回归验证已完成写入在回读失败后不会被补偿覆盖。

### DEV-chat2-007 · Feature 关闭

- chat2 · 2026-11-25T15:38:42-06:00。用户确认关闭，交付基线为 `40836a81`。核对 PRD、REVIEW 与 RUN-chat2-005 后更新状态。产品契约与验收条件沿用 PRD。
- 新增本 Feature 的 `CLOSE.md`，更新 `DEV.md` 当前阶段，追加本文件记录。候选 K-chat2-001..003 等待选择，Feature 文档保留在原目录。
