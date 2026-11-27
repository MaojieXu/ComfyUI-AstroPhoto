# V1 Legacy Remediation — TEST_PLAN

初始化：chat1 · 2026-11-25T12:39:29-06:00

当前阶段：chat2 已完成整改与验证，环境跳过项见 TEST_REPORT。逐用例实施状态见 `AUDIT.md` §7，运行证据见 `TEST_REPORT.md`。

## 范围与基线

- 代码基线：本次审查时的 `HEAD f7a15f23` + 工作树既有文档修改（`AGENTS.md`、`docs/architecture/overview.md`、`docs/product/requirements.md`）。
- 运行环境：仓库独立 `.venv`（Python 3.12）；前端 pnpm + Chromium；真实宿主 `http://127.0.0.1:8188`（0.46.0 / 1.59.6）。Siril 1.4.5 未检出。
- 排除：`.agents/features/archive/**`、`.artifact/**`、`js/**`、`frontend/src/vendor/**`（只查调用侧）、`node_modules`、`.venv`、`.codegraph`、lock 文件的内部内容（只核对生成结果）。

## 测试用例

### TC-chat1-001 · Schema 单一来源与不兼容数据库

- 关联：FR-chat1-001/AC-01..02，D1
- 设计：空 Data Root 由 `Base.metadata.create_all` 创建；`expected_schema()`/`PRAGMA user_version` 校验；已知表结构或 revision 不匹配时返回 `DEV_SCHEMA_RESET_REQUIRED` 且不改写数据库；重启复用实例身份；WAL/外键/备份仍工作；仓库与 Registry 不再包含 Alembic 文件。
- 代码映射：`tests/backend/test_storage.py::test_never_replaces_an_existing_asset_database`、`::test_v1_reopens_with_schema_only_in_committed_wal`、`::test_legacy_dev_schema_is_preserved`（改写/重命名）、`tests/integration/test_storage_init.py::test_development_database_is_rejected`（改写）、`tests/packaging/test_contents.py::test_registry_archive`（更新断言）、`tests/backend/test_storage_init.py`。
- 缺口：新增“删除 Alembic 后无 `alembic_version` 表”“`user_version` 不匹配”“触发器由初始化创建并被结构校验覆盖”。

### TC-chat1-002 · 工作区搬迁与 fail-fast 保留

- 关联：FR-chat1-001/AC-03，D3
- 设计：工作区/整库搬迁的复制、校验、切换、回滚、清理、失败重试保持；`storage_operations.kind='migration'` 与 `/storage/migrations/*` 路由存在；旧回执/旧目录分支删除后新增格式仍可恢复。
- 代码映射：`tests/backend/test_storage.py`（搬迁相关 12 个用例）、`tests/backend/test_storage_init.py::test_migration_plan_directory_created_only_on_first_plan`、`tests/backend/test_storage_review.py`、`tests/integration/test_storage_api.py`。
- 缺口：新增“旧格式 manifest 不再被接受”的负向用例（明确错误，不得静默回退）。

### TC-chat1-003 · 单一 canonical 字段

- 关联：FR-chat1-002，D4
- 设计：列表/详情/项目节点/导入回执只返回 `asset_type` 与 `master_type`；receipt 只含 `run_id`、`command_id`；MCP/前端类型不读取旧别名；旧别名作为请求字段被拒绝。
- 代码映射：`tests/integration/test_photography_library.py`（导入/绑定/主帧/项目）、`tests/integration/test_library_mcp.py`、`tests/backend/test_siril.py`（receipt 断言）、`frontend/tests/components/{AssetsLibrary,ScientificNodes}.test.ts`。
- 缺口：新增 API 契约测试断言 `type`/`result_type`/`output_id`/`asset_id` 不再出现在响应；新增 `confirmed`/`comparison`/`requires_confirmation` 被拒绝的用例。

### TC-chat1-004 · 旧路由与旧宿主接口删除

- 关联：FR-chat1-001/AC-01，D2
- 设计：`/previews/autostretch` 返回 404；`/previews/siril/{command_id}` 仍工作；`notifyHost` 只用 `toast.success/error/warning/info`，宿主 API 不可用时返回 false 并由页面内反馈兜底；书签通过 `extensionManager.setting.set` 写入，再通过 `app.api.getSetting` 核对服务器值。
- 代码映射：`tests/integration/test_siril_api.py`、`frontend/tests/components/ScientificNodes.test.ts`、`frontend/tests/components/AssetsLibrary.test.ts`（host notification 用例改写）、`frontend/tests/components/NodeCatalog.test.ts`（bookmark 用例改写）、`frontend/tests/host/host-runtime.mjs`。
- 缺口：新增“`toast.add` 不再被调用”“setting.set 失败时 UI 不误报成功”的用例；真实宿主书签持久化回读保留在 host-runtime。

### TC-chat1-005 · MCP 结构化状态与无凭据契约

- 关联：FR-chat1-001..002，D2/D4
- 设计：手动/自动 `connection_status` 都返回结构化内容及输出 Schema；不存在业务 token 环境变量或错误过滤；工具列表/分类发现不变；无 `draft`/`revision_detail` 死校验。
- 代码映射：`mcp/tests/test_server.py::test_in_memory_status_contract`（改写）、`test_proxy_preserves_manual_status_text_and_validation_error`（改写）、`mcp/tests/{test_catalog_tools,test_equipment,test_disclosure}.py`（清理 token 设置）、`mcp/tests/fixtures/status_contract.json`。
- 缺口：新增“旧文本响应不存在”“token 参数被移除后错误信息不含伪造凭据”的用例。

### TC-chat1-006 · canvas 预览设置持久化

- 关联：FR-chat1-002、FR-chat1-005
- 设计：`PUT /previews/settings` 的 `canvas` 保存并在 GET 返回；非法 canvas 拒绝；`frontend/src/api/previewSettings.ts` 与 `EnvironmentPage` 使用保存值设置 CSS 变量。
- 代码映射：`tests/integration/test_siril_api.py`/`test_status_api.py`（新增）、`frontend/tests/components/StorageSettings.test.ts`（更新 preview settings 用例）。
- 缺口：新增后端持久化与前端回读用例。

### TC-chat1-007 · 旧回执/旧候选目录清理

- 关联：FR-chat1-001/AC-03、FR-chat1-002
- 设计：缺 `command_id`/`run_id` 的旧 receipt 不再被接受；旧 `siril-` 候选目录不被恢复；新格式恢复/迁移/预览仍通过。
- 代码映射：`tests/backend/test_siril.py::test_restart_reconciles_only_owned_unregistered_run`、`::test_migrate_workspace_with_uncollected_formal_output`、`tests/backend/test_storage.py::test_partial_migration_moves_formal_result_and_required_receipt_together`。
- 缺口：新增负向用例。

### TC-chat1-008 · 复用优先判定

- 关联：FR-chat1-003
- 设计：每个疑似重复实现有明确结论；替换后删除旧实现与依赖；不引入无必要自研。
- 代码映射：`AUDIT.md` §5 的 R 类结论；现有 `tests/backend/test_import_planner.py`、`tests/backend/test_subframe_groups.py` 等继续验证保留的自研逻辑。
- 缺口：无自动化判定，靠审查记录与依赖清单核对。

### TC-chat1-009 · 生成物与文档

- 关联：FR-chat1-005
- 设计：`docs/api/inventory.json`、`routes.md`、`mcp/*.md` 重新生成且与运行时不漂移；文档不再声明已删除的兼容行为；链接可解析。
- 代码映射：`tests/packaging/test_api_inventory.py`、`tests/packaging/test_document_navigation.py`、`frontend/tests/components/Localization.test.ts`。
- 缺口：新增文档断言“无 `alembic_version`、无 `/previews/autostretch`、无 `ASTROPHOTO_IMPORT_ROOTS`”（可通过 grep 脚本或测试）。

### TC-chat1-010 · 配置/依赖/打包

- 关联：FR-chat1-001/AC-04、FR-chat1-003
- 设计：`pyproject.toml`/`requirements.txt`/`uv.lock` 无 Alembic；Registry 清单不含 `database/migrations/`；MCP wheel/sdist 边界不变；版本与工具链一致。
- 代码映射：`tests/packaging/test_contents.py`、`tests/packaging/test_versions.py`、`tests/packaging/test_api_inventory.py`。
- 缺口：新增“Registry 不含 migrations 目录”断言。

### TC-chat1-011 · 离线全量回归

- 关联：FR-chat1-004/AC-03
- 命令：`uv run pytest tests/nodes tests/backend tests/integration -m "not host" -q`；`uv run --project mcp pytest mcp/tests -q`；`uv run pytest tests/packaging -q`；`uv run ruff check ...`；`pnpm -C frontend typecheck lint build test`；`pnpm -C frontend check:build check:proxy`。
- 证据：命令、退出码、失败摘要；环境问题单独标注。

### TC-chat1-012 · 真实宿主验证

- 关联：FR-chat1-004/AC-03，D5
- 前置：确认 8188 实例与活动任务；重启加载新代码。
- 命令：`COMFYUI_TEST_URL=http://127.0.0.1:8188 uv run pytest tests/integration -m host`；`pnpm -C frontend test:host`（必要时 `--nodes-2`）。
- 证据：宿主版本、PID/端口、测试输出、失败项与未覆盖项；Siril 真实 CLI 用例按环境跳过。

## 当前测试清单与整改映射

逐文件、逐用例的现状与处理建议见 `AUDIT.md` §7。汇总：

| 套件 | 文件 | 用例 | 需更新 | 删除 | 保留 | 新增缺口 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| pytest（backend/integration/nodes/packaging） | 31 | 197 | 见 AUDIT §7 | 0 | 其余 | TC-001/003/004/006/007/010 |
| MCP pytest | 10 | 47 | 见 AUDIT §7 | 0 | 其余 | TC-005 |
| frontend Vitest | 12 + host | 116 | 见 AUDIT §7 | 0 | 其余 | TC-004/006 |

## 正式验证顺序

1. 代码稳定后运行离线全量（TC-011）并修复本次引入的失败。
2. 重新生成 inventory/routes/MCP 文档并运行打包/漂移测试（TC-009/010）。
3. 确认宿主空闲后重启，运行 TC-012；记录真实宿主与离线结果。
4. 输出 `TEST_REPORT.md`，含真实 RUN、失败复测、未覆盖项与环境阻碍。


### chat2 局部证据 · 2026-11-25T12:58:36-06:00

TC-chat1-001/002/006/007 的部分局部验证见 DEV-chat2-001；不代表正式全量通过。其他 TC 和正式 RUN 待实施后执行。


### chat2 覆盖修订 · 2026-11-25T13:41:46-06:00

TC-chat1-001..010 的实现与局部/回归证据见 DEV-chat2-001/002 和 RUN-chat2-001；Schema 触发器、canvas 回读、旧字段拒绝、缺命令回执、已收录输出搬迁同步均有实际测试。TC-chat1-004 增加宿主 HTTP 403 持久化失败场景：当前宿主公开 setter 吞掉 403，待用户决断后实现并重测；网络拒绝场景已通过真实宿主测试。TC-chat1-011/012 的结果、Siril 和第二卷跳过见 TEST_REPORT。


### chat2 宿主路由差异 · 2026-11-25T13:43:14-06:00

TC-chat1-004 的旧路由未注册：独立 aiohttp 测试为 404，真实 ComfyUI 对未知 POST 统一返回 405；证据见 RUN-chat2-002。不得为制造 404 重新注册旧接口。

### chat2 覆盖修订 · 2026-11-25T13:51:29-06:00

TC-chat1-004/012：在真实宿主对设置 POST 注入 HTTP 403，断言发生拒绝、服务器仍持有原书签、侧栏未显示为已添加并报告失败。两种节点模式均通过，见 RUN-chat2-003。

### chat4 审查覆盖修订 · 2026-11-25T14:00:03.4648631-06:00

- TC-chat1-003（F01、F04）：收录与 PATCH 分别提交不合法的 ImageResult role，验证拒绝写入并保持完整目录可读；省略 result_type 完成导入后，对比任务回执、目录列表、详情中的 asset_type。
- TC-chat1-004/012（F03）：两个标签页先后添加不同书签，第二页内存未刷新；核对服务器保留两次添加和原有书签。
- TC-chat1-002/007（F05）：构造登记命令和 manifest 命令不符、其余身份一致的正式产物，验证搬迁预检拒绝该组并保留源文件。
- TC-chat1-004/007（F02、F06）：两个 Siril 节点串联并保持上游结果未收录，覆盖下游候选与正式预览；迟到回执发送当前 astrophoto_output，单独验证仅含旧字段的处理结果不会触发正式预览。以上为待补回归用例，复现证据见 REVIEW-chat4-001。

### chat5 审查覆盖修订 · 2026-11-25T14:08:45-06:00

- TC-chat1-003（REVIEW-chat5-001-F01）：现有用例只断言响应不含 `result_type`、查询参数 `result_type` 被拒；缺少“导入请求使用同一名称 `asset_type`”的断言。整改后应补：`POST` 目录导入用 `asset_type` 指定 master_frame/image_result，`result_type` 作为请求字段被 422 拒绝；MCP `library_import` 不再翻译字段名；回执与目录条目同名同值。
- TC-chat1-001（REVIEW-chat5-001-F02）：`EQUIPMENT_REFERENCED` 删除后，真实宿主清理脚本的 409 分支无对应用例覆盖其删除；整改后由 `test_equipment_api`/`equipment-host.mjs` 直接断言删除已解除引用的设备返回 204、随后 GET 404。
- TC-chat1-009（缺口确认）：设计要求“无 `alembic`、无 `/previews/autostretch`、无 `ASTROPHOTO_IMPORT_ROOTS`”的文档断言，当前 `tests/packaging` 只有链接解析与生成物漂移检查，没有文档内容断言。`rg` 已确认实现中不存在该测试，本轮登记为未覆盖项；整改时补最小断言或明确放弃并在 DEV 记录理由。
- TC-chat1-002/007、TC-chat1-004/012 的 chat4 待补用例仍为待补状态，本轮未新增。

### chat2 审查回归修订 · 2026-11-25T14:22:46-06:00

- TC-chat1-003：`test_image_result_import_uses_one_asset_type_and_rejects_invalid_roles` 验证默认及显式分类、拒绝旧字段、编辑和收录角色校验。MCP `test_name_tools_import_append_and_calibration` 核对完成回执与目录分类。
- TC-chat1-002/007：`test_partial_migration_moves_formal_result_and_required_receipt_together` 验证回执错配时预检失败，修正后完成搬迁。
- TC-chat1-004/007：`test_uncollected_formal_output_feeds_candidate_and_formal_previews` 使用 Siril 处理替身验证后端链路。ScientificNodes 组件测试覆盖串联路径和旧回执不会触发正式预览。
- TC-chat1-004/012：NodeCatalog 模拟另一标签页已保存条目，真实宿主两种模式复验 HTTP 403。设备脚本及 HTTP 设备测试验证删除和引用语义。
- TC-chat1-009：`test_maintained_docs_exclude_retired_contracts` 扫描现行 docs 下 Markdown 与 JSON 文件。结果见 RUN-chat2-004。

### chat6 审查覆盖修订 · 2026-11-25T14:29:14-06:00

- TC-chat1-004/007（REVIEW-chat6-001-F01）在两个 Siril 节点执行后先验证下游正式预览，再收录上游，使用相同 IMAGE_PATH 和下游 formal_id 重新验证，期望仍可显示同一正式结果。
- TC-chat1-003（REVIEW-chat6-001-F02）导入 dark 校准主帧，经素材接口尝试改 role 为 processed，检查编辑响应、两类详情及筛选结果，确保保持同一分类及绑定。
- TC-chat1-004/012（REVIEW-chat6-001-F03）模拟书签设置写入已落盘、另一标签页保存独立项、原页验证 GET 失败，断言服务器保留两项变更，恢复读取后侧栏与服务器一致。
- 以上为已复现、待补自动化的场景。复现条件及现有测试的实际范围见 REVIEW-chat6-001。

### chat7 审查覆盖修订 · 2026-11-25T14:39:53.372410-06:00

- TC-chat1-003/010（REVIEW-chat7-001-F01）：维护脚本 `scripts/import_library_test_assets.py` 的校准主帧导入使用已删除的 `type`。需覆盖：用生成器输出的 `calibration_master` 夹具跑导入预览/计划，断言 `master_type` 被接受且 `type` 被 422 拒绝。当前无任何测试执行该脚本；手工复核使用 `catalog.prepare` 直接验证。
- TC-chat1-003（REVIEW-chat7-001-F02）：`/library/assets` 需断言校准主帧的 `catalog_resource` 为 `calibration_master`（或存在明确的 `is_calibration_master`），并与 `/catalog/calibration_master/{id}`、前端详情路由一致。现有 `test_unified_calibration_master_import_binding_and_edit` 只断言普通 master_frame 的 `catalog_resource == 'image_result'`，未覆盖真实校准主帧。
- TC-chat1-004/007/012（REVIEW-chat6-001-F01..F03）：chat6 登记的“收录后串联预览”“角色与校准主帧一致性”“书签回读失败后不得用旧快照覆盖”仍待补自动化；本轮未新增实现，保留原缺口。
- 证据：REVIEW-chat7-001 的定向命令与 `.artifact/review-chat7/` 复现脚本；正式 RUN 结论仍以 TEST_REPORT 为准。

### chat2 审查覆盖补齐 · 2026-11-25T14:56:12-06:00

以下用例已实现。正式运行见 RUN-chat2-005，替代 chat6/chat7 上文对应的待补记录。

- TC-chat1-004/007 · REVIEW-chat6-001-F01：`test_formal_output_feeds_downstream_previews_before_and_after_collection` 在收录前验证候选与正式预览，通过真实 HTTP 收录后以相同 IMAGE_PATH、下游 formal_id 和参数重新验证。Siril 处理使用 FITS 复制替身。
- TC-chat1-003 · REVIEW-chat6-001-F02、REVIEW-chat7-001-F02：`test_unified_calibration_master_import_binding_and_edit` 覆盖 422 后属性和修订保持、两类详情及筛选、集合绑定、素材列表及详情资源名、目录改用途后的普通主帧资源名。AssetsLibrary 的 `the library opens a calibration master through its catalog resource` 核对详情端点。
- TC-chat1-004/012 · REVIEW-chat6-001-F03：NodeCatalog 的 `an unverified bookmark write never overwrites another tab and readback recovers the catalog` 使用本地和服务器分离的设置替身，验证双页变更保留、没有二次写入、错误提示和恢复读后的侧栏。真实宿主 `host-runtime.mjs` 在两种模式验证 403 单次写入、持久值不变和解除拒绝后的重试成功。
- TC-chat1-003/010 · REVIEW-chat7-001-F01：`test_fixture_import_plans_calibration_master_with_canonical_field` 调用脚本实际计划函数并用 aiohttp 验证 canonical 预检接受及别名拒绝。另以仓库生成器产出的 dark FITS 和 manifest 做相同 HTTP 预检。
- REVIEW-chat7-001-F03：AUDIT §4、§6 和测试增量均核对，文档内容回归 `test_maintained_docs_exclude_retired_contracts` 随打包测试通过。
