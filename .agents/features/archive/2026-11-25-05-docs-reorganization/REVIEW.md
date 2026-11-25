# 文档重组 — 代码审查

## REVIEW-chat2-001

- 审查 Chat / 角色：chat2 / Code Reviewer。
- 实施 Chat / 任务：chat1 / TASK-chat1-001、TASK-chat1-002、TASK-chat1-003、TASK-chat1-004。
- 审查时间：2026-11-25，本 Chat 上一轮。
- 写入 Chat / 时间：chat2 / 2026-11-25T10:19:29-06:00。
- 需求依据：FR-chat1-001 v3、FR-chat1-002 v2、FR-chat1-003 v2，见 [PRD](PRD.md)。
- 比较基准 / 被审快照：`e74e5109f273f406d57be8121ed25ed437f05bd3` / 上轮审查时该 HEAD 上属于本 Feature 的未暂存变更和未跟踪文件，未记录完整工作树散列。
- 范围：文档导航与 Feature 引用、HTTP/MCP 契约、V1 启动与旧接口退役、相关调用方与回归检查。
- 复审关联：首次审查。

| 发现 ID | 优先级 | 位置 | 预期 / 实际行为及影响 | 建议 | 状态 |
| --- | --- | --- | --- | --- | --- |
| REVIEW-chat2-001-001 | P1 | [数据库启动探测](../../../../astrophoto/database/manager.py#L86) | V1 首建事务已提交且 `alembic_version` 仍在 WAL 中时，同一库应能重新打开。复现中普通只读连接读取到 `0001_v1_baseline`，完整性检查返回 `ok`，而 `immutable=1` 探测只读主文件，随后以 `DEV_SCHEMA_RESET_REQUIRED` 拒绝有效库并提示更换 Data Root。违反 FR-chat1-003 AC-01。 | 让版本探测读取包含已提交 WAL 的一致快照，保留对开发库和附属文件的字节保护。补充未 checkpoint 时的重启回归。 | 待修复 |
| REVIEW-chat2-001-002 | P1 | [受管文件删除处理器](../../../../astrophoto/api/library.py#L91)、[文件删除服务](../../../../astrophoto/assets/library.py#L300) | V1 参考公开 `confirmed` 和 `revision`，处理器接受后传给删除服务，服务未使用这两个字段。使用临时导入文件提交 `confirmed:false`、`revision:999` 实际得到 `deleted_file:true`，文件已不可用。调用方容易把显式否定当作取消。关联 FR-chat1-003 AC-02、AC-03 与 FR-chat1-002 AC-02。 | 建议从 V1 文档和调用方移除无效字段，服务端在执行前拒绝含这些旧字段的请求，同时保留已确认的直接删除能力。验证拒绝时文件字节与登记均保留。 | 待修复 |
| REVIEW-chat2-001-003 | P2 | [项目模块导入](../../../../astrophoto/assets/projects.py#L8)、[归档设备测试](../../../../tests/backend/test_equipment.py#L43) | 按 CI 的完整范围运行 Ruff，实际报 5 项错误。项目模块留下 `CalibrationMaster`、`ImageResult`、`identifier` 三个未使用导入，设备测试留下 `retained`、`removed` 两个未使用变量。 | 清理未使用导入，使用测试返回值断言归档相机分别被保留和移除，然后重跑完整 Ruff 检查。 | 待修复 |
| REVIEW-chat2-001-004 | P2 | [存储初始化](../../../../docs/api/http/contracts.md#L14)、[启动直传](../../../../docs/api/http/contracts.md#L73)、[移动项目节点](../../../../docs/api/http/contracts.md#L118) | 实测 `POST /storage/init` 返回 `checks`，`POST /library/direct-imports` 通过 `entries[].workspace_id` 给出位置，两种回执均无文档所列顶层 `workspaces`。项目节点自引用或成环在实现中返回 `INVALID_LIBRARY_REFERENCE`，文档列为 `FOLDER_CYCLE`。按文档解析的客户端可能将成功回执视为无效，或无法识别移动错误。违反 FR-chat1-002 AC-02。 | 按实际回执和错误码修订契约，为关键字段和错误分支增加对照检查。 | 待修复 |
| REVIEW-chat2-001-005 | P2 | [MCP 受管文件工具参考](../../../../docs/api/mcp/contracts.md#L58)、[清单漂移检查](../../../../tests/packaging/test_api_inventory.py) | FR-chat1-002 要求逐工具提供安全示例。以 `storage_delete_managed_file` 为例，已有运行时 Schema 和参数摘要，但没有工具专用的隔离调用及结果回读示例。当前漂移检查核对条目及 Schema，缺少示例也会通过。关联 FR-chat1-002 AC-02、AC-04。 | 为各工具关联隔离示例，标注示意或实测，检查输入符合运行时 Schema。受管文件删除示例使用专用临时文件。 | 待修复 |
| REVIEW-chat2-001-006 | P3 | [调查证据](DEV_LOG.md#L189)、[导航测试](../../../../tests/packaging/test_document_navigation.py) | DEV-chat1-013 的 0011 迁移链接指向随后删除的工作树路径，现已无法打开。导航检查未遍历活动 Feature 文档，因此仍通过。关联 FR-chat1-001 AC-04。 | 将历史引用固定到包含原文件的基准提交，将活动 Feature 的本地引用纳入检查。 | 待修复 |

### 结论与验证限制

本轮建议修复后再验收。上轮接口清单和导航共 6 项通过，按 CI 范围运行 Ruff 得到 5 项错误。WAL 重启、文件删除、存储初始化及直传回执通过临时数据库或 Data Root 单独核验。项目循环错误码通过源码核对。新增覆盖缺口见 [TEST_PLAN](TEST_PLAN.md#review-chat2-001-覆盖缺口)。

本轮未重跑 RUN-chat1-002 的 309 项通过用例。节点与 Siril 专项、真实 Desktop、第二物理卷、实际 Agent 行为联调和公开发行沿用既定验证边界。

## REVIEW-chat2-002

- 审查者及写入者为 chat2（Code Reviewer）。复审于 2026-11-25 完成，写入时间为 2026-11-25T10:40:03-06:00。
- 关联 chat1 的 TASK-chat1-005。依据 FR-chat1-001 v3 AC-04、FR-chat1-002 v2 AC-02/04、FR-chat1-003 v2 AC-01–03，核对[首轮六项发现](#review-chat2-001)及相关变更。
- 基准为 `e74e5109f273f406d57be8121ed25ed437f05bd3` 加复审当时的未暂存和未跟踪文件。35 个相关源码、测试、接口及 Feature 文档的合并 SHA-256 为 `5605e82d6cc560f350271c5979c2afe59b21109867d66ff105124d315d99d031`（写回前采样）。

### 首轮发现处置

| 首轮发现 | 复审状态 | 核实依据 |
| --- | --- | --- |
| REVIEW-chat2-001-001 | 已修复 | 版本只存在于已提交 WAL 时 V1 能重开。旧库拒绝用例验证了原文件保留。 |
| REVIEW-chat2-001-002 | 已修复 | 受管文件物理删除拒绝旧字段，拒绝后文件与登记均保留。空对象请求可删除受管副本。 |
| REVIEW-chat2-001-003 | 已修复 | CI 范围 Ruff 通过，首轮 5 项错误已清除。 |
| REVIEW-chat2-001-004 | 已修复 | 初始化回执的 `checks`、直传条目的 `workspace_id` 和项目成环错误码均与 HTTP 回归一致。 |
| REVIEW-chat2-001-005 | 已修复 | 39 个业务工具及 3 个发现入口均有隔离示例，输入通过运行时 Schema 校验。 |
| REVIEW-chat2-001-006 | 已修复 | Git 可定位基准提交中的旧迁移文件，导航检查已覆盖活动 Feature。 |

### 本轮发现

| 发现 ID | 优先级 | 位置 | 复现与影响 | 建议 | 状态 |
| --- | --- | --- | --- | --- | --- |
| REVIEW-chat2-002-001 | P1 | [素材注销](../../../../astrophoto/assets/library.py#L253)、[属性更新](../../../../astrophoto/assets/library.py#L230)、[HTTP 契约](../../../../docs/api/http/contracts.md#L84) | 在隔离数据上，注销处理器收到 `confirmed:false, revision:999` 仍返回 `deleted:true`，登记数从 1 变为 0，原文件保留。属性更新也接受了 `revision:999` 并写入备注。两个入口仍公开无效字段。关联 FR-chat1-003 AC-02 和 FR-chat1-002 AC-02。 | 注销仅接收空对象，属性更新仅接收有效字段。同步调用方及契约，验证旧字段被拒绝后登记、属性与文件均保留。 | 待处理 |
| REVIEW-chat2-002-002 | P2 | [WAL 启动探测](../../../../astrophoto/database/manager.py#L90) | 非空 WAL 触发向系统临时盘复制整库。V1 版本正确、`quick_check=ok`、WAL 为 8272 字节时，模拟复制遇到 `ENOSPC` 即重启失败；撤去故障后同一库成功打开。关联 FR-chat1-003 AC-01。 | 提供不依赖系统临时盘整库空间的探测或回退路径，同时保护旧库及其附属文件。 | 待处理 |

复审时 15 项定向测试通过，CI 范围 Ruff 通过。验证覆盖 WAL 重启和旧库保护、受管文件删除、HTTP 回执、MCP 清单与示例、文档导航。两项新增发现来自单独的隔离复现。未重跑完整 Feature 套件，正式 RUN 仍沿用原记录。建议两项处置后再验收。见[待补回归](TEST_PLAN.md#review-chat2-002-覆盖缺口)。

## REVIEW-chat3-001

- 审查 Chat / 角色：chat3 / Code Reviewer。未参与实现。
- 实施 Chat / 任务：chat1 / TASK-chat1-001、TASK-chat1-002、TASK-chat1-003、TASK-chat1-004、TASK-chat1-005。
- 审查时间：2026-11-25，写入 Chat / 时间：chat3 / 2026-11-25T10:45:39-06:00。
- 需求依据：FR-chat1-001 v3、FR-chat1-002 v2、FR-chat1-003 v2，见 [PRD](PRD.md)。
- 比较基准 / 被审快照：`e74e5109f273f406d57be8121ed25ed437f05bd3` 加当前未暂存和未跟踪文件。`astrophoto`、`extension`、`nodes`、`mcp`、`scripts`、`tests`、`frontend/src`、`frontend/tests`、`docs` 及根入口共 334 个文件的合并 SHA-256 为 `eb0e9b5b93d9aeaa6b56eedcddc3261f2a6303395de13a4949f9d9f171b98704`（写入本记录前采样）。
- 范围与排除项：docs 导航与链接、HTTP/MCP 参考、V1 启动与旧接口退役、相关调用方与回归检查。排除并仅按工作树现状记录：`.agents/archive`、`.agents/features/archive`、`.agents/handoff`、`.agents/skills` 的重组与删除（feature-pipeline 入口部分见 [DEV-chat2-002](DEV_LOG.md#dev-chat2-002)）以及 939 个 `.artifact/` 本地文件；这些不在本 Feature 的 DEV_LOG 变更清单内，归属未经确认，未作为本轮发现。节点/Siril 专项、真实 Desktop、第二物理卷、实际 Agent 行为联调沿用既有暂缓范围。
- 复审关联：独立复核 [REVIEW-chat2-001](#review-chat2-001) 与 [REVIEW-chat2-002](#review-chat2-002)，不改写 chat2 的结论。

### 首轮发现独立核实

| 首轮发现 | 核实结果 | chat3 依据 |
| --- | --- | --- |
| REVIEW-chat2-001-001 | 已修复 | `test_v1_reopens_with_schema_only_in_committed_wal`、`test_development_database_is_rejected_without_changing_files` 通过；探测改为在临时副本上重放已提交 WAL，主库、WAL、外部源字节保留。 |
| REVIEW-chat2-001-002 | 已修复 | `test_copy_preview_snapshot_and_reference_independent_identity`、`test_direct_import.py` 通过；含 `confirmed`/`revision` 的删除返回 `INVALID_REQUEST`，文件与登记保留，空对象可删除。 |
| REVIEW-chat2-001-003 | 已修复 | 按 CI 命令 `ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py` 复核为 All checks passed。 |
| REVIEW-chat2-001-004 | 已修复 | `checks`、`entries[].workspace_id`、`INVALID_LIBRARY_REFERENCE` 与 HTTP 回归断言一致。 |
| REVIEW-chat2-001-005 | 已修复 | `test_every_mcp_tool_has_an_example_validated_against_its_schema` 通过；示例为示意并接受运行时 Schema 校验，受管文件示例使用专用临时文件并可回读。 |
| REVIEW-chat2-001-006 | 已修复 | `git cat-file` 可读取基准提交中的 `0011_legacy_subframe_groups.py`；导航测试扫描活动 Feature，并识别 `#L` 行号锚点。 |

### chat2-002 独立复核

- REVIEW-chat2-002-001 与 REVIEW-chat2-002-002 在本轮快照中仍存在，chat3 独立复现与源码核对结论一致，状态保持待处理。
- 001：临时素材 `PATCH /library/assets/{id}` 携带 `revision:999` 返回 200；`DELETE /library/assets/{id}` 携带 `revision:999,confirmed:false` 返回 `deleted:true`，原件保留。
- 002：非空 WAL 时探测会先复制整库到系统临时目录；以 `ENOSPC` 替换 `shutil.copyfile` 后，同一健康 V1 库的 `initialize` 抛出 `OSError(28)`，未被转换为可回退的存储错误。

### 本轮发现

| 发现 ID | 优先级 | 位置 | 预期 / 实际行为及影响 | 建议 | 状态 |
| --- | --- | --- | --- | --- | --- |
| REVIEW-chat3-001-001 | P1 | [目录编辑](../../../../astrophoto/api/catalog.py#L126)、[目录删除](../../../../astrophoto/api/catalog.py#L281)、[项目编辑](../../../../astrophoto/api/catalog.py#L459)、[节点编辑](../../../../astrophoto/api/catalog.py#L517)、[未使用的版本校验](../../../../astrophoto/assets/catalog.py#L71)、[HTTP 契约](../../../../docs/api/http/contracts.md#L98)、[前端写入](../../../../frontend/src/api/assets.ts#L90) | 目录类写入仍公开 `revision`，但与 REVIEW-chat2-002-001 的素材入口相同，服务端只允许字段、从不比较：`catalog.revision()` 已无调用方。隔离复现中，`PATCH /catalog/projects/{id}`、`PATCH /catalog/projects/{id}/nodes/{node_id}`、`PATCH /catalog/video/{id}`、`DELETE /catalog/video/{id}` 使用 `revision:999` 均返回 200 并落库。`test_catalog_unregistration_accepts_stale_master_revision` 已把基准提交中断言 409 的用例改为接受 200，但 PRD、DEV 与 DEV_LOG 没有记录退役目录 `revision` 校验的决定，V1 处置清单也只覆盖设备/组合 `expected_version` 和项目删除令牌。前端仍发送当前版本并保留 `REVISION_CONFLICT` 重试路径，因此多窗口编辑会静默覆盖而不提示。关联 FR-chat1-003 AC-03、FR-chat1-002 AC-02。 | 与 REVIEW-chat2-002-001 合并处置：默认恢复类型化目录编辑/删除的版本校验（基准行为），错误返回 `REVISION_CONFLICT`；若确实要退役，需先取得明确决定，再同步删除文档的 `revision?`、前端调用和测试名，避免字段存在但无效果。为项目、节点、类型化资源各补一条陈旧版本回归。 | 待处理 |
| REVIEW-chat3-001-002 | P3 | [.artifact 残留](../../../../.gitignore) | `TASK-chat1-005` 的验证使用 `--basetemp .artifact/review-fix-tests`，工作树现有 939 个未跟踪的 `.artifact/` 文件，其中包含本轮修复的 `review-fix-tests` Data Root、`assets.db` 与锁文件，以及既有 `frontend-preview` 预览目录。`.gitignore` 只排除其中两个子路径，`git add -A` 会把测试数据和本机路径提交入库。 | 排除整个 `/.artifact/`（保留更具体条目亦可），并清理本轮测试残留；后续用仓库外或已忽略目录作 basetemp。 | 待处理 |

### 结论与验证限制

本轮建议修复后再验收。chat3 复跑 `pytest tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py tests/backend/test_storage.py::test_v1_reopens_with_schema_only_in_committed_wal`（8 passed）、`pytest tests/integration/test_storage_init.py tests/integration/test_direct_import.py tests/integration/test_photography_library.py::test_copy_preview_snapshot_and_reference_independent_identity`（23 passed）与 CI 范围 Ruff（通过）。两项新发现来自独立隔离探针，探针文件与临时数据已删除；本轮未修改业务代码，未重跑 RUN-chat1-002 的 309 项通过用例。正式 RUN 仍按 TEST_REPORT 原记录，不因本轮复审改写。
