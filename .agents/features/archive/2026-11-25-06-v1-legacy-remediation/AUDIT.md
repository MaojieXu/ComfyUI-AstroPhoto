# V1 Legacy Remediation — 探查与全量覆盖报告（AUDIT）

- Chat: chat1
- Time: 2026-11-25T12:39:29-06:00
- 状态：只读审查完成；**本次未修改任何业务代码、测试、Schema、配置或依赖**。
- 基线：Git `HEAD f7a15f23` + 工作树既有文档修改（`AGENTS.md`、`docs/architecture/overview.md`、`docs/product/requirements.md`；未纳入本次归属）。
- 关联：`PRD.md`、`DEV.md`、`DEV_LOG.md`（DEV-chat1-001）、`TEST_PLAN.md`。

## 1. 判定依据

### 1.1 权威顺序

1. 用户确认的六条全局规则与本 Feature 决断 D1..D5（见 `PRD.md`）。
2. 现行设计文档：`docs/product/requirements.md`、`docs/architecture/overview.md`、`docs/domains/**`、`docs/api/**`、`docs/integrations/mcp.md`、`docs/development/**`。
3. 当前工作树实现、现有测试、依赖清单和配置。
4. `.agents/features/archive/**` 仅作为历史证据，不能作为现行设计依据。

### 1.2 六条规则的可执行解释

- **R1 无历史版本**：凡是“为了旧版本/旧数据仍能工作”而存在的分支、别名、默认值、迁移、恢复路径，均需删除；真实运行时错误处理、重试、fail-fast、资源清理不属于此类。
- **R2 最新设计唯一**：以用户决断和 `docs/` 现行条款为准；实现与文档冲突时先判断谁是最新确认设计，不默认相信代码或测试。
- **R3 禁止兼容实现**：包括 Migration、降级兜底、旧接口适配器、双轨实现、旧字段回退、旧目录/旧回执恢复。
- **R4 数据库直接重构**：Schema 变更直接改最新 Schema/初始化/测试数据，不写历史迁移。
- **R5 彻底替换**：新实现必须删除旧实现及其调用方、测试、配置、文档，不得为通过旧测试保留旧行为。
- **R6 复用优先**：先查项目现有实现、已引入依赖、标准库、框架能力、成熟第三方；成熟方案更合适时替换并删除旧自研，不保留双轨。

### 1.3 本次特意区分、判定为“保留”的内容

| 内容 | 判定 | 依据 |
| --- | --- | --- |
| 工作区搬迁 `astrophoto/storage/migration.py`、`/storage/migrations/*`、`storage_operations.kind='migration'` | 保留（当前产品能力） | `docs/product/requirements.md` §2“工作区搬迁”；`docs/domains/storage.md`；用户 D3 |
| `DEV_SCHEMA_RESET_REQUIRED`、旧库报错并指引新 Data Root | 保留（fail-fast，不是迁移） | 用户 D3；`docs/domains/equipment.md` |
| `RECOVERY_REQUIRED`、`SOURCE_CHANGED`、`COPY_VERIFY_FAILED`、`STORAGE_BUSY`、重试/清理/租约 | 保留（真实运行时可靠性） | 现有存储测试与领域文档 |
| 系统窗口不可用时回退网页目录浏览 | 保留（当前 UX 设计，不是版本兼容） | `docs/domains/storage.md`；用户 D2 末句 |
| 宿主通知不可用时的页面内错误/状态反馈 | 保留（当前 UX） | 用户 D2；`frontend/src/features/assets/LibraryError.vue` 等 |
| `catalog.CAPTURE`（模型列名 ↔ `library_rules` 属性名） | 保留并改名 | 用户 D4；它是传输/校验命名映射，不是旧字段别名 |
| `frontend/src/vendor/comfyui/**` | 保留（复用的宿主组件源码） | `vendor/comfyui/README.md`；宿主未提供可导入包 |
| FastMCP `mode="legacy"` 测试参数 | 保留（框架协议模式） | FastMCP 4.2 客户端模式，不是产品兼容层 |
| ComfyUI 工作流序列化 `{image}` / `canvasDataURL` | 保留（宿主工作流契约） | `docs/product/requirements.md` §6.2；`nodes/ComfyUIFEExampleVueBasic` 与 `VueExampleComponent` 的当前序列化契约 |

## 2. 覆盖方法与排除规则

### 2.1 文件范围

- 枚举命令：遍历仓库，排除 `.git`、`.venv`、`.codegraph`、`.artifact`、`node_modules`、`__pycache__`、`.ruff_cache`、`dist`、`.pytest_cache` 等目录。
- 计入 327 个维护文件：`astrophoto/` 53、`mcp/` 32、`extension/` 24、`frontend/` 138、`tests/` 31、`docs/` 25、`scripts/` 9、`nodes/` 3、`benchmark/` 3、`locales/` 3、根配置/文档 6。
- 排除规则与原因：
  - `js/**`：Vite 构建产物（`js/main.js`、`js/assets/main.css`），由 `pnpm -C frontend build` 生成；只审构建脚本与外部 URL 断言。
  - `frontend/src/vendor/comfyui/**`：从 ComfyUI Frontend 复制的第三方组件；只审 `README.md`、版本来源和调用侧。
  - `frontend/node_modules/`、`.venv/`、`.codegraph/`、`.ruff_cache/`、`dist/`、`__pycache__/`：依赖、缓存或生成物。
  - `.artifact/**`：本地证据/预览工作区，非产品源码。
  - `.agents/features/archive/**`：历史 Feature 证据，只读、不修改、不作为现行设计。
  - `uv.lock`、`frontend/pnpm-lock.yaml`：锁文件内容由工具生成；只核对依赖变更后的 `uv lock`/`pnpm install` 结果。
  - `.agents/skills/**`：Agent 工作流资料；本 Feature 只按 `feature-pipeline` 使用，不作为产品实现。
- 未排除：`.github/workflows/**`、`.comfyignore`、`requirements.txt`、`pyproject.toml`、`.pre-commit-config.yaml` 等发行/CI 相关配置（人工阅读，不在 327 文件表内逐行列出）。

### 2.2 审查深度

| 文件类型 | 方法 | 说明 |
| --- | --- | --- |
| Python/TS/TSX/Vue 实现 | 全量阅读 + 调用链追踪 | 逐文件阅读；对跨模块符号用 `rg`/CodeGraph 追踪调用方；测试文件逐个用例阅读 |
| 测试（pytest/MCP/Vitest） | 全量阅读 + 逐用例判定 | 197 + 47 + 116 个用例逐项给结论（§7） |
| 文档 | 全量阅读 | 现行条款与历史段落区分；生成页标注 REGEN |
| JSON locale | 全量键结构校验 + 变更键核对 | 现有 `Localization.test.ts` 已做 en/zh 键一致性；整改涉及的键逐项核对 |
| CSS | 全量规则阅读 + 选择器引用核对 | 只判断是否残留已删组件的样式或旧宿主变量；不改视觉设计 |
| 生成物 | 由源脚本核对 + 漂移测试 | `docs/api/inventory.json`、`docs/api/routes.md`、`docs/api/mcp/*.md` |
| 第三方/生成物 | 排除 | 见 §2.1 |

## 3. 结论摘要

- 327 个维护文件中：**需修改 88 个、需删除 2 个、需重新生成 9 个、需核对/调查 3 个、已审查无改动 225 个**（精确逐文件状态见 §6）。
- 360 个测试用例中：**需更新 60 个（其中 2 个仅重命名）、保留 300 个、需新增 8 类缺口**（逐用例见 §7）；另 §7.4 的 3 个前端宿主脚本需更新。
- 共记录 **31 项发现**：P0 6 项、P1 13 项、P2 8 项、P3 3 项、info 1 项。
- 没有发现需要用户再次裁决的产品级冲突；所有决断可按 D1..D5 落地。
- 未发现“模块导入/UI 挂载/节点执行时初始化存储”的违规；未发现 MCP 直接访问扩展业务数据库；未发现 Siril 命令注入（参数数组、固定脚本、路径校验存在）。

## 4. 整改清单（发现）

> 每条包含：规则、证据、为何不是正常运行处理、调用链、整改方案、受影响测试/文档。严重度：P0 阻断 v1 契约；P1 必须整改；P2 清理项；P3 命名/注释。

### F-chat1-001 · Alembic 基线与 SQLAlchemy 模型形成双 Schema 源

- 严重度：P0；规则：R3/R4/R6
- 证据：
  - `astrophoto/database/manager.py:10-12` 导入 Alembic；`:28` `SCHEMA = "0001_v1_baseline"`；`:91-92` 直接读 `alembic_version`；`:110,164` 用 `MigrationContext`；`:128-131` `command.upgrade` 建库。
  - `astrophoto/database/migrations/env.py`（11 行）与 `.../versions/0001_v1_baseline.py`（296 行）手写全部 DDL，与 `astrophoto/database/{models,catalog_models,equipment_models,library_models}.py` 重复；`expected_schema()` 再把模型编译成 SQL 反向比对。
  - `pyproject.toml:15`、`requirements.txt:5` 依赖 `alembic`；`scripts/release.py:90-91` 把 Alembic 文件加入 Registry 必需清单；`scripts/seed_equipment_fixture.py:75-77` 直接读 `alembic_version`。
- 判定：这不是“当前设计要求的 Schema 版本管理”，而是两套 Schema 描述并存的重复实现；仓库处于 v1 基线，历史 revision 无保留价值。
- 调用链：`StorageRuntime.initialize` → `DatabaseManager.initialize` → `command.upgrade` / `MigrationContext.get_current_revision`；`health()` 同样依赖 revision；打包与 fixture 脚本直接读 `alembic_version`。
- 整改：D1。删除 `astrophoto/database/migrations/` 与 `alembic` 依赖；用 `Base.metadata.create_all` + `TRIGGERS` 建库，设置独立 `SCHEMA_REVISION`（建议 SQLite `PRAGMA user_version`）；`expected_schema()`、`DEV_SCHEMA_RESET_REQUIRED` 保留；同步测试/文档/打包/fixture。
- 受影响：`tests/backend/test_storage.py:151,1024,1051`、`tests/integration/test_storage_init.py:135-157`、`tests/packaging/test_contents.py:29-30`、`docs/architecture/overview.md:14,54`、`docs/domains/equipment.md:23,31`、`docs/development/setup-and-testing.md:12`、`docs/development/publishing.md:58`。

### F-chat1-002 · 正式输出回执同时使用 `output_id` 与 `asset_id`，并重复输出字段

- 严重度：P0；规则：R3/R5、D4
- 证据：
  - `astrophoto/storage/migration.py:108` `receipt.get("output_id", receipt.get("asset_id"))`；`extension/siril/previews.py:143` 同样回退。
  - `extension/siril/processing.py:210-211,217` 同时写 `run_id`、`output.output_id`、顶层 `output_id`；`:190` 只在非 AutoStretch 时写 `command_id`，`:263`/`previews.py:141` 用默认值 `"autostretch"` 补读。
  - 测试也按双字段造 receipt（`tests/backend/test_storage.py:781-800`、`tests/integration/test_storage_api.py:507-516`、`tests/backend/test_siril.py:337-380`）。
- 判定：同一身份有 `run_id`、`output_id`、`output.output_id`、`asset_id` 四个名字，读取端以“先新后旧”兜底；这是旧回执格式兼容，不是正常解析。
- 调用链：`formal_run` 写 manifest → `FormalOutput.provenance` → `WorkspaceMigrationService.verify_formal_receipt` / `PreviewService._formal_result` / `recover_runs` 读取。
- 整改：统一为 `run_id`（运行/输出同一 UUID）与必有 `command_id`（AutoStretch 也写 `"autostretch"`）；删除 `output.output_id`、顶层 `output_id`、`asset_id` 回退与默认值；旧回执直接报 `RECOVERY_REQUIRED`/`PREVIEW_STALE`，不静默接受。
- 受影响：上述测试；`docs/domains/siril.md`（manifest 字段说明）；`tests/backend/test_siril.py`、`tests/integration/test_siril_api.py`。

### F-chat1-003 · 工作区搬迁混入旧式“AssetLocation 即正式输出”特判与旧 plan 分支

- 严重度：P1；规则：R3/R5
- 证据：
  - `astrophoto/storage/migration.py:53-55` 对 `outputs/{asset_id}/stretched.fit` 的 AssetLocation 特判并校验 manifest（该 AssetLocation 没有对应 FormalOutput，属旧注册形态）；`:99` `verify_formal_receipt(..., producer="siril-autostretch-v1")` 默认 producer。
  - `:664-669` `_bind_group` 为正式输出同步搬迁同名 `AssetLocation`（变量名 `legacy`）。该行为本身**是当前需要的**：用户主动收录正式输出后，`_collect_output` 会创建指向同一相对键的 AssetLocation，搬迁时必须一起改工作区；应保留并把 `legacy` 改名为 `collected`。
  - `:801` `_clear_source` “An older committed job has no deletion authorization in its frozen plan”；`:810` 注释“Older committed receipts record sizes but do not have hashes”，随后按旧回执缺 hash 的分支处理。
- 判定：`managed_groups` 的未登记 AssetLocation 特判、`_clear_source` 的旧 plan/旧 receipt 分支是旧数据兼容；`_bind_group` 的 AssetLocation 同步是当前双表一致性要求，不得误删。
- 调用链：`WorkspaceMigrationService.preflight/start/run` → `managed_groups`/`_bind_group`/`_clear_source`；`DataRoots._inspect_move` 也调用 `managed_groups`。
- 整改：删除未登记输出特判、`_clear_source` 旧 plan/旧 receipt 分支；保留 `_bind_group` 的已收录输出同步并改名；所有 plan 必须含 `owned`/`source_identity`/`_cleanup_hashes`。
- 受影响：`tests/backend/test_storage.py`（搬迁用例）、`tests/backend/test_siril.py::test_migrate_workspace_with_uncollected_formal_output`、`tests/backend/test_storage_review.py`、`docs/domains/storage.md`。

### F-chat1-004 · FITS 解析对“旧版本登记的输出”做兜底

- 严重度：P0；规则：R3/R5
- 证据：`astrophoto/assets/fits.py:31-38` `resolve_result` docstring 明说 “including results registered by older versions”，`OUTPUT_NOT_FOUND` 时回退 `runtime.assets.resolve_asset`；`:50-60` 当路径形如 `outputs/<uuid>/{stretched,result}.fit` 时反推 output id 并尝试 `resolve_output`。
- 判定：正式输出只应由 `FormalOutput` 解析；AssetLocation 回退和路径形状推断都是为旧注册/未登记输出服务。正常本地路径应走 `resolve_fits_path` 的“已登记资产或原始路径”分支。
- 调用链：`nodes.scientific.AstroPhotoFITSSource`、`extension/siril/processing.formal_run`、`previews`、`tests` 均调用 `resolve_input/resolve_result/resolve_fits_path`。
- 整改：`resolve_result` 只查 `FormalOutput`；删除路径形状推断；未登记输出按普通本地文件处理或报 `OUTPUT_NOT_FOUND`。
- 受影响：`tests/backend/test_siril.py`、`tests/integration/test_siril_api.py`、`docs/domains/siril.md`。

### F-chat1-005 · AutoStretch 回执的 `command_id` 可选、读取端默认 `"autostretch"`

- 严重度：P1；规则：R3/R5、D4
- 证据：`extension/siril/processing.py:190`（仅非 AutoStretch 写）、`:217`（provenance 同样条件写）、`:263`（`receipt.get("command_id", "autostretch")`）；`previews.py:141` 同样默认。
- 判定：字段缺失是旧回执格式，默认值让旧数据“看起来有效”；当前所有命令都有稳定 `name`，没有理由省略。
- 整改：`formal_run` 与 session 回执一律写 `command_id`；读取端直接取字段，缺失即 `RECOVERY_REQUIRED`/`PREVIEW_STALE`。
- 受影响：`tests/backend/test_siril.py`（recover/预览/迁移回执）、`tests/backend/test_storage.py`、`tests/integration/test_storage_api.py`、`docs/domains/siril.md`。

### F-chat1-006 · 旧路由 `/previews/autostretch` 与默认命令

- 严重度：P1；规则：R3/R5
- 证据：`extension/siril/routes.py:36` 无 `command_id` 时默认 `AUTOSTRETCH`；`:83` 注册 `POST /previews/autostretch`；`docs/domains/siril.md:37` 明说“保留原 `/previews/autostretch`”；`docs/api/inventory.json:719`、`docs/api/http/routes.md:433` 已收录；`tests/integration/test_siril_api.py:23-100` 使用旧路由。
- 判定：通用路由 `/previews/siril/{command_id}` 已是现行契约，旧路由只是为旧客户端保留的适配器。
- 整改：删除旧路由与默认分支；`start_preview` 必须从 `command_id` 解析命令；同步文档/清单/测试。
- 受影响：`tests/integration/test_siril_api.py`、`docs/domains/siril.md`、`docs/api/http/{routes,contracts}.md`、`docs/api/inventory.json`。

### F-chat1-007 · `recover_runs` 以旧 Asset 记录判断已登记，并默认旧命令

- 严重度：P1；规则：R3/R5
- 证据：`extension/siril/processing.py:244` docstring “without a formal output or legacy asset record”；`:256` `command_for(receipt.get("command_id","autostretch"))`；`:271` `registered = session.get(models.Asset, folder.name) is not None`，随后 `if registered or runtime.library.has_output(folder.name): continue`。
- 判定：正式输出是否登记只应看 `FormalOutput`；`Asset` 是用户主动收录后的另一事实，把 Asset 当旧登记判据会掩盖旧数据并延迟清理。
- 整改：只查 `has_output`；删除旧 Asset 判据与 command 默认值；缺字段的目录按“非本实例输出”跳过或报错，不猜测。
- 受影响：`tests/backend/test_siril.py::test_restart_reconciles_only_owned_unregistered_run` 等。

### F-chat1-008 · Siril 旧标题迁移与旧候选目录恢复

- 严重度：P1；规则：R3/R5
- 证据：
  - `extension/siril/frontend/SirilNodes.tsx:600-602` 注释 “Saved workflows can carry the old generated caption as a title”，把 `Siril · {id,title,title_zh}` 旧标题改写成新标题。
  - `docs/domains/siril.md:96` “Siril 保留既有 `siril-` 目录前缀，旧的自有候选目录仍可恢复。”
  - 代码侧 `SCRATCH_PREFIX = "siril-"`（当前）与 `_recover_processing_scratch(bucket, prefix, files)` 按前缀恢复；需核对是否同时接受旧的自有前缀（audit 结论：仅按传入 prefix 匹配，旧前缀恢复主要存在于文档声明；删除文档声明并核对测试）。
- 判定：旧标题/旧目录属于旧版本产物；未发布版本没有必要保留。
- 整改：删除 legacy title 分支；文档删除“旧候选目录”声明；如测试断言旧前缀，删除或改为当前前缀。
- 受影响：`frontend/tests/components/ScientificNodes.test.ts`（标题断言）、`frontend/tests/host/siril-presentation.mjs`、`docs/domains/siril.md`。

### F-chat1-009 · `asset_type` / `result_type` 双输出与回退

- 严重度：P0；规则：R5、D4
- 证据：
  - `astrophoto/api/catalog.py:41-42` 为 image_result 行写 `result_type`；`:54-57` 以 `result_type` 过滤；`:101` 仅在跨类型列表加 `asset_type`；`catalog.view`（`astrophoto/assets/catalog.py:411-414`）只对 image_result 返回 `result_type`。
  - `astrophoto/assets/projects.py:75-76` 的项目节点用 `asset_type`。
  - `mcp/src/astrophoto_mcp/tools/catalog_client.py:39-40` `asset_kind` 先取 `asset_type` 再回退 `result_type`；`view()` 依赖它决定输出类型。
  - 前端 `CatalogEditor.vue:25,42` 用 `result_type` 判断 master；`CatalogDetails.vue:130` 用 `result_type` 决定显示；`ImportAssets.vue` 导入请求用 `result_type`（输入字段，属正常）。
- 判定：`asset_type` 与 `result_type` 在输出端表示同一分类概念（image_result / master_frame），同时存在导致 MCP/前端必须写回退。`result_type` 作为导入请求的“主帧/图像结果”判别可以保留为输入字段，但输出只应有一个名称。
- 整改（建议）：输出统一为 `asset_type`（值：`subframe_collection|video|image_result|master_frame`）；`result_type` 仅作为 `POST /assets/import`、`POST /library/catalog-import` 的输入字段；所有列表/详情/项目节点/MCP DTO 改读 `asset_type`；删除 `asset_kind` 回退。
- 受影响：`astrophoto/api/catalog.py`、`astrophoto/assets/catalog.py`、`astrophoto/assets/projects.py`、`mcp/.../tools/{catalog,catalog_client,projects}.py`、`frontend/src/features/assets/{CatalogEditor.vue,CatalogDetails.vue}`、`docs/api/**`、大量测试。

### F-chat1-010 · `type` / `master_type` 双名（校准主帧用途）

- 严重度：P0；规则：R5、D4
- 证据：
  - `astrophoto/assets/catalog.py:126-136`：`kind=calibration_master` 的输入/字段名为 `type`；`:187-188` image_result 用 `result_type`；`CalibrationMaster.type` 是内部列名。
  - `astrophoto/api/catalog.py:41-44` 列表摘要写 `master_type`（对 image_result）和 `type`（对 calibration master）；`:115-125` 编辑校准主帧接受 `master_type`，但 `catalog.prepare` 对 `calibration_master` 又要求 `type`；`filter_listing` 用 `type` 过滤。
  - `mcp/.../catalog_client.py:68` 输出同时有 `master_type` 和 `calibration_type`（`row.get("type")`）；`:118` `find` 用 `params["type"]`。
  - 前端 `CatalogCalibration.vue`、`ImportAssets.vue`、`CatalogDetails.vue`、`CatalogEditor.vue` 分别用 `type`/`master_type` 两个名字。
- 判定：同一业务概念（DARK/BIAS/FLAT/DARK_FLAT/LIGHT/UNKNOWN）在 HTTP/MCP/前端有 2–4 个名字，且输入路径不一致；这是旧字段兼容造成的双轨。
- 整改：canonical `master_type`。内部列 `CalibrationMaster.type` 可保留（SQLAlchemy 列），但 API 输入/输出、MCP DTO、前端类型全部用 `master_type`；删除 `calibration_type`、`type` 输入/输出与查询参数；`catalog.MASTER_TYPES` 不变。
- 受影响：`astrophoto/assets/catalog.py`、`astrophoto/api/catalog.py`、`astrophoto/assets/projects.py`、MCP catalog/catalog_client、前端 4 个组件、`docs/api/**`、测试。

### F-chat1-011 · `confirmed` / `comparison` / `requires_confirmation` 是无效契约

- 严重度：P1；规则：R3/R5、D4
- 证据：`astrophoto/api/catalog.py:317-326` 接受 `confirmed`、`comparison`，返回固定 `{"requires_confirmation": False}`；`astrophoto/assets/catalog.py:300-310` `bind(..., confirmed)` 参数未使用；`prepare`（`:172-178`）在子帧组导入时接受 `confirmed`；`docs/api/http/contracts.md` 绑定行仍列 `confirmed?,comparison?`；测试多处发送 `confirmed: True`。
- 判定：确认流程已取消（差异/未知不阻止绑定），这些字段没有行为，只是旧流程残留；保留会误导 Agent/客户端。
- 整改：删除绑定与导入的 `confirmed`/`comparison` 入参、`requires_confirmation` 出参、`bind` 的未用参数；同步文档与测试（改为直接绑定）。
- 受影响：`tests/integration/test_photography_library.py`、`frontend/tests/components/AssetsLibrary.test.ts`、`docs/api/http/contracts.md`、`docs/domains/assets.md`。

### F-chat1-012 · `catalog_kind` 暴露内部表名

- 严重度：P2；规则：R5、D4
- 证据：`astrophoto/assets/library.py:54-60` 返回 `catalog_kind = typed.__tablename__`（`videos`/`image_results`/`calibration_masters`）；前端 `CatalogDetails.vue:33`、`AssetsPanel.vue` 以此决定详情端点；测试大量使用复数表名。
- 判定：这是把 ORM 表名泄漏为 API 字段，改名/换表即破坏客户端；应使用稳定资源名。
- 整改：统一 `catalog_resource ∈ {subframe_collection, video, image_result, calibration_master}`（或复用 `asset_type` + 一个明确的 `is_calibration_master`），前端据稳定名路由；不返回表名。
- 受影响：`frontend/src/features/assets/{AssetsPanel.vue,CatalogDetails.vue,CatalogProjects.vue}`、`frontend/tests/components/AssetsLibrary.test.ts`、`docs/api/http/contracts.md`。
- 处置（chat2 · 2026-11-25T14:55:17-06:00）：素材接口复用 CATALOG_MODELS；真实校准主帧的列表和详情均返回 `catalog_resource=calibration_master`，普通主帧保留 `image_result`。前端从列表打开校准目录详情。HTTP 和 Chromium 验证通过，见 RUN-chat2-005。

### F-chat1-013 · MCP 手动 `connection_status` 保留旧 untyped JSON 文本

- 严重度：P1；规则：R3/R5
- 证据：`mcp/src/astrophoto_mcp/tools/status.py:41-45` 注释 “Preserve the old untyped-dict tool's JSON text response with no outputSchema or structuredContent”；函数声明 `@mcp.tool(output_schema=None)`；`mcp/tests/fixtures/status_contract.json` 的 `connection_status.outputSchema` 为 `null`；`mcp/tests/test_server.py::test_in_memory_status_contract` 断言 `structured_content is None` 并解析 `content[0].text`；`mcp/tests/test_disclosure.py::test_proxy_preserves_manual_status_text_and_validation_error` 断言文本相同；`docs/integrations/mcp.md` 末段明说保留手动 JSON 文本。
- 判定：这是为旧工具响应格式保留的适配，不是当前契约；同一工具在自动模式返回结构化、手动模式返回文本，客户端需双轨处理。
- 整改：手动模式也返回结构化 `diagnose` 结果并声明输出 Schema；删除旧注释、`output_schema=None`、fixture 旧契约与文本断言；同步 docs。
- 受影响：`mcp/tests/{test_server,test_disclosure}.py`、`mcp/tests/fixtures/status_contract.json`、`docs/integrations/mcp.md`、`docs/api/mcp/connection.md`、`docs/api/inventory.json`。

### F-chat1-014 · MCP 业务 token 与死校验分支

- 严重度：P1；规则：R3/R5
- 证据：
  - `mcp/src/astrophoto_mcp/api/equipment.py:92` `EquipmentHTTP.__init__(base_url, token, transport)`；`library.py` 同样；`mcp/src/astrophoto_mcp/server.py:56-60` 以 `None` 传入；错误处理仍以 `self.token` 过滤“泄露”（`equipment.py:130-140`、`library.py:30-48`）。
  - `equipment.py:63-81` `valid_record` 的 `draft` 分支与 `:82-89` `revision_detail` 分支无调用方（工具只用 `equipment`/`train`）。
  - `mcp/tests/conftest.py:5-11` 删除 `ASTROPHOTO_*TOKEN`；多个 MCP 测试设置这些环境变量并断言“凭据不泄露”。
- 判定：业务 token/审批已在单用户回环模型中取消（当前设计明确“不要求业务 token”）；保留参数、过滤逻辑和测试会把已删除的认证模型当作现行契约。
- 整改：删除 token 构造参数与过滤分支；`safe_fields` 只做长度/字符/敏感 token 白名单清理；删除死 `draft`/`revision_detail` 校验；删除测试中的 token/凭据用例；同步 docs/README。
- 受影响：`mcp/src/astrophoto_mcp/{server.py,api/equipment.py,api/library.py,tools/equipment.py}`、`mcp/tests/**`、`benchmark/checks/pi_astrophoto.py`（如设置 token）。

### F-chat1-015 · 前端通知保留旧 `toast.add` 分支

- 严重度：P0；规则：R3/R5、D2
- 证据：`frontend/src/host/notify.ts:6` 注释 “ComfyUI Frontend v1.58+ and its legacy extension toast API”；`:20-24` 当 `toast[kind]` 不存在时调用 `toast.add(...)`；`frontend/tests/components/AssetsLibrary.test.ts:1226-1240` 明确断言旧分支；`docs/architecture/overview.md:129` 明说“兼容新版与旧版通知接口”。
- 判定：目标宿主 1.59.6 的 `ToastManager` 已提供 `success/error/info/warning/loading` 并标记 `add` 为 deprecated；旧分支只为旧宿主保留。
- 整改：只使用 `toast[kind]`；不可用时返回 false，由页面内反馈兜底；删除旧测试与 docs 声明；不删除页面内反馈。
- 受影响：`notify.ts`、`AssetsLibrary.test.ts`、`frontend/tests/host.ts`（如需）、`docs/architecture/overview.md`。

### F-chat1-016 · 书签通过旧 `app.ui.settings.settingsValues` + 手写 HTTP 持久化

- 严重度：P1；规则：R3/R5/R6、D2
- 证据：`frontend/src/host/nodeBookmarks.ts:21-24` 注释 “legacy UI getter exposes the live host setting store”，使用 `app.ui.settings.settingsValues` 与 `app.api.storeSetting`；`:34` 手写 PUT `/settings/...` 并回读；`NodesPage.tsx` 用 500ms 轮询同步（`watch` 中 `setInterval(sync, 500)`）；`frontend/tests/host.ts` 提供 `ui.settings.settingsValues` proxy 与 `storeSetting` mock；`NodeCatalog.test.ts` 多处断言 `storeSetting` 且断言 `setting.set` 未被调用。
- 判定：宿主已提供 `app.extensionManager.setting.set(id, value)` 公开 API（当前 `ComfyApp` 类型）；手写持久化 + 轮询是旧接口适配和工作区自研，违反复用优先。
- 整改：`readNodeBookmarks` 用 `setting.get`；写入用 `setting.set`；删除 `storeSetting`/`settingsValues`/轮询；若宿主 `setting.set` 不返回持久化结果，失败时回读 `setting.get` 并报错；更新 testing double 与 host-runtime 书签持久化断言。
- 受影响：`nodeBookmarks.ts`、`NodesPage.tsx`、`frontend/tests/host.ts`、`NodeCatalog.test.ts`、`frontend/tests/host/host-runtime.mjs`。

### F-chat1-017 · canvas 预览设置被校验但不保存、不生效

- 严重度：P1；规则：R5、D4
- 证据：`astrophoto/api/scientific.py:25-33` 接受并校验 `canvas`，但调用 `service.update_settings(expected_revision, preview_edge=edge)` 未传 `preview_canvas`；`astrophoto/core/config.py:108-109` `canvas_preview(settings)` 永远返回默认 480×320；`api/scientific.py:18` GET 也返回默认；`frontend/src/api/previewSettings.ts` 保存时仍发送 canvas；`EnvironmentPage.vue` 无 canvas 编辑控件，`StorageSettings.test.ts` 的 preview 用例只覆盖 longest_edge。
- 判定：设置契约（校验、GET 字段、前端保存）存在，但后端丢弃；这是“半实现/死配置”，不是正常运行分支。
- 整改：`set_preview_settings` 传 `preview_canvas=body.get("canvas")`；`canvas_preview` 读取并校验 `settings["preview"]["canvas"]`；`load_storage_settings` 校验已存 canvas；补后端持久化/非法值测试；前端可选择增加 canvas 控件或明确只读展示。
- 受影响：`api/scientific.py`、`core/config.py`、`tests/integration/test_siril_api.py`/`test_status_api.py`、`frontend/tests/components/StorageSettings.test.ts`、`docs/domains/siril.md`。

### F-chat1-018 · 错误码表包含从未抛出的旧错误码

- 严重度：P2；规则：R5
- 证据：`astrophoto/api/errors.py:6` `EQUIPMENT_REFERENCED`、`TRAIN_REFERENCED`、`REVISION_IMMUTABLE`；`:12` `COLLECTION_CONFLICT`、`ASSET_ALREADY_IN_COLLECTION`、`CONFIRMATION_REQUIRED`、`FOLDER_CYCLE`；`:13` `DUPLICATE_CALIBRATION_ASSIGNMENT`；`:32` `MIGRATION_REQUIRED`；`:36` `TRAIN_HISTORY_READ_ONLY`；`:38` 404 列表含 `REVISION_NOT_FOUND`。全仓无抛出点（除测试对 `EQUIPMENT_REFERENCED` 的条件分支）。
- 判定：旧设备引用保护/光路版本/集合确认流程的残留；当前设计是删除设备即解除关联、无确认、无版本记录。
- 整改：删除死码与对应 i18n 文案；`test_equipment_api.py` 的条件 409 分支改为断言 204。
- 受影响：`api/errors.py`、`frontend/src/i18n/locales/{en,zh}/sidebar.json`、`tests/integration/test_equipment_api.py`、`docs/api/http/README.md`（错误列表）。

### F-chat1-019 · 死导出、旧值别名与防御性兜底

- 严重度：P2；规则：R5/R6
- 证据：
  - `frontend/src/features/library/components/equipmentFields.tsx:70-78` `numberValue`、`imagingType`（接受 `color` 或 `osc`）、`displayNumber` 均无调用方；`osc` 是旧相机类型名。
  - `frontend/src/features/nodes/preview/Inspector.tsx:70-76` `element.show()` 不存在时回退 `setAttribute("open","")`；`HTMLDialogElement.show` 是标准 API，兜底无必要。
  - `frontend/src/api/nodes.ts:11,52` `nodeCatalog(value, moduleName='custom_nodes.ComfyUI_AstroPhoto')` 默认包名；`fetchNodes` 在无法从 `import.meta.url` 解析包名时静默使用默认值，可能展示错误包节点。
  - `frontend/src/shared/SidebarTabs.tsx:1` 注释仍写 v1.59.1。
- 判定：死代码/旧值别名/静默默认；不是运行时必需。
- 整改：删除死导出与 `osc`；Inspector 直接 `show()`；`nodeCatalog` 的 `moduleName` 必填，解析失败返回空并报告；更新注释。
- 受影响：`equipmentFields.tsx`、`Inspector.tsx`、`api/nodes.ts`、`SidebarTabs.tsx`、相关测试。

### F-chat1-020 · `image_result_type` 对缺失 attributes 默认 `master_frame`

- 严重度：P2；规则：R3/R5
- 证据：`astrophoto/assets/catalog.py:430-432` `attrs = session.get(AssetAttributes,...); return "image_result" if attrs and attrs.attributes.get("role") == "processed" else "master_frame"`；`api/catalog.py:41-44` 同样默认。
- 判定：当前所有 ImageResult 创建路径（`_collect_output`、`catalog.publish`、direct import）都写 `role`；缺失 attributes 是旧/不一致数据。默认 master_frame 会把未知状态伪装成主帧。
- 整改：严格读取 `role`，必须为 `processed`/`master_frame`，否则 `RECOVERY_REQUIRED`（或明确的 `LIBRARY_RECORD_INVALID`）；更新直接插入 ImageResult 的测试夹具补 attributes。
- 受影响：`catalog.py`、`api/catalog.py`、`tests/integration/test_photography_library.py`（部分 raw fixture）、`tests/integration/test_catalog_pagination.py`。

### F-chat1-021 · 旧环境键、旧 runtime 属性与过时 test double 说明

- 严重度：P1；规则：R3/R5
- 证据：
  - `tests/backend/test_storage.py:31,654,984`、`tests/backend/test_siril.py:69,140` 使用 `{"ASTROPHOTO_IMPORT_ROOTS": ...}`；代码无此配置（`AssetImportService.validate_selected_source_path` 只校验根/缓存/保留位置/系统目录）。
  - `tests/integration/test_storage_api.py:226-227` 删除 `ASTROPHOTO_IMPORT_ROOTS`/`ASTROPHOTO_LOCAL_STORAGE`；两者均无代码读取。
  - `tests/integration/test_equipment_api.py:70` `runtime.equipment_read_token = TOKEN`；`Runtime` 无此字段；`:147-190` 设置 `ASTROPHOTO_EQUIPMENT_*_TOKEN`、`ASTROPHOTO_APPROVAL_TOKEN`、`ASTROPHOTO_TRUST_CHAT_APPROVALS`。
  - `tests/integration/test_library_mcp.py:26-29`、`tests/integration/test_catalog_pagination.py:25` 设置 `ASTROPHOTO_LIBRARY_TOKEN`。
  - `tests/conftest.py:18` 注释 “matched to inspected host 0.45.0 signatures”，文档基线已是 0.46.0。
- 判定：旧认证/导入根/本地存储开关均已删除；测试仍以“确保未设置/设置 token”方式保留旧语义，属于旧契约残留，并会误导后续维护。
- 整改：删除所有旧 env 设置/删除与 runtime 属性；test double 注释按 0.46.0 签名核对后更新；新增“旧 env 不改变行为”的断言可选。
- 受影响：上述测试与 `tests/conftest.py`、`docs/development/setup-and-testing.md`。

### F-chat1-022 · 配置/依赖/打包/脚本中的 Alembic 残留

- 严重度：P1；规则：R3/R4/R5（与 F-001 同源）
- 证据：`pyproject.toml:15`、`requirements.txt:5`；`scripts/release.py:90-91`（Registry 必需文件）；`scripts/seed_equipment_fixture.py:75-77`（读 `alembic_version`）；`tests/packaging/test_contents.py:29-30`（断言 baseline 文件）；`tests/backend/test_storage.py:161`（UPDATE `alembic_version`）；`tests/integration/test_storage_init.py:135-157`（历史 revision 名 `0001_equipment_baseline`、`0007_image_optical_binding`、`0011_legacy_subframe_groups`）。
- 判定：与 F-001 同一决定的调用方；必须一并删除/改写，否则删除 Alembic 后测试/打包立即失败。
- 整改：见 F-001；删除依赖后运行 `uv lock`；Registry 清单移除 migrations；seed 脚本改用 `PRAGMA user_version`；打包测试改为断言无 migrations 目录。
- 受影响：上述文件与 `uv.lock`、`docs/development/publishing.md`。

### F-chat1-023 · 文档仍声明已删除/待删除的兼容行为

- 严重度：P1；规则：R3/R5、D2/D4
- 证据（精确行）：
  - `docs/architecture/overview.md:14` “Alembic”；`:54` “V1 首建基线”；`:60` “Widget ID 和序列化继续兼容旧工作流”；`:129` “兼容新版与旧版通知接口”。
  - `docs/development/setup-and-testing.md:12` “SQLite 模型、连接及 Alembic 版本”。
  - `docs/development/publishing.md:58` “Alembic V1 首建基线”。
  - `docs/domains/equipment.md:23` “V1 由 `0001_v1_baseline` 初始化”；`:31` `alembic_version` 表。
  - `docs/domains/siril.md:37` “保留原 `/previews/autostretch`”；`:96` “旧的自有候选目录仍可恢复”；`:98` “旧端口契约”；`:37,?` “Frontend v1.59.1”（与基线 1.59.6 不一致）；`siril.md` 还提到 `ASTROPHOTO_IMPORT_ROOTS`。
  - `docs/integrations/mcp.md:105` “连接诊断保留手动模式的 JSON 文本与自动模式的结构化结果，以适配现行 MCP 客户端”；同文“原业务工具保持参数和返回契约”。
  - `docs/domains/assets.md:17` “历史集合节点保留已登记的工作流契约”。
  - `docs/api/http/contracts.md` 绑定行 `confirmed?,comparison?`；`docs/api/mcp/contracts.md` 手动模式“返回 JSON 文本诊断”。
  - `README.md:24` “The migration targets ComfyUI 0.46.0…”。
- 判定：这些是现行行为声明，不是历史记录；整改后必须删除或改写。`docs/domains/siril.md:98` 的实测历史可保留但需标注“历史”。
- 整改：按发现逐条改写；Alembic/旧路由/旧字段/旧 token/旧通知的声明删除；保留历史验证段落并标日期/版本。
- 受影响：上述文档、`docs/api/mcp/connection.md`、`docs/api/http/routes.md`（生成）、`docs/api/inventory.json`（生成）。

### F-chat1-024 · API 生成物已包含旧路由

- 严重度：P2；规则：R5、D4
- 证据：`docs/api/inventory.json:719` 收录 `/previews/autostretch`；`docs/api/http/routes.md:433` 列出该路由；MCP 分类页由 `scripts/render_api_reference.py` 从 inventory 生成，`mcp/.../status.py` 的旧输出会进入页面。
- 判定：生成物不是权威源，但必须先改源码再重新生成；当前快照与目标设计不一致。
- 整改：代码稳定后运行 `python -m scripts.api_inventory --output docs/api/inventory.json` 与 `python scripts/render_api_reference.py`，再跑 `tests/packaging/test_api_inventory.py` 漂移测试；不要手改生成页。
- 受影响：`docs/api/inventory.json`、`docs/api/http/routes.md`、`docs/api/mcp/*.md`。

### F-chat1-025 · 宿主版本/第三方组件版本漂移

- 严重度：P2；规则：R6、D2
- 证据：文档基线为 Backend 0.46.0 / Frontend 1.59.6；`frontend/package.json` 的 `@comfyorg/comfyui-frontend-types` 为 `1.59.1`；`frontend/src/vendor/comfyui/README.md` 记录组件来自 Frontend v1.59.1；`frontend/src/features/storage/storage.css:1` 注释 1.59.1；`docs/domains/siril.md` 两处 1.59.1；`tests/conftest.py:18` 0.45.0。
- 判定：类型包/复制组件落后于目标宿主，可能使用已 deprecated 的 API（如 `toast.add`）；需核对 npm 是否有 1.59.6 类型、能否从宿主源码重新 vendored；不能凭空假设。
- 整改：优先升级 `@comfyorg/comfyui-frontend-types` 到目标版本并重新复制上游组件；若 npm/上游不可得，记录为客观阻碍并在 README/DEV 标注来源版本与验证基线；至少统一注释与 test double 说明。
- 受影响：`frontend/package.json`、`frontend/pnpm-lock.yaml`、`frontend/src/vendor/**`、`frontend/src/features/storage/storage.css`、`docs/domains/siril.md`、`tests/conftest.py`。

### F-chat1-026 · 命名/注释残留旧语义

- 严重度：P3；规则：R5/R6
- 证据：`astrophoto/equipment/snapshots.py:1` docstring “read legacy optical snapshots”（函数只做组件校验）；`astrophoto/storage/import_planner.py:93-94` 注释 “On legacy hosts CreateDirectoryW…”（实际是未启用长路径的 Windows 能力判断）；`astrophoto/assets/library.py:298` “Keep each statement within SQLite's parameter limit for older installs.”；`extension/siril/processing.py:24` “AutoStretch parameter contract for existing callers”；`frontend/src/features/assets/CatalogDetails.vue:20,33,72` `editedLegacyMaster`；`CatalogDetails.vue` 显示用 `type` 回退（同 F-010）。
- 判定：行为多数正常，名称/注释暗示已不存在的兼容或旧数据，会误导后续维护。
- 整改：改名/改注释；`import_planner` 逻辑保留（宿主能力差异），注释改为“未启用 Win32 长路径的主机预留 8.3 名称空间”；`library.py` 注释改为 SQLite 参数上限。
- 受影响：上述文件，无行为变化。

### F-chat1-027 · 测试断言旧行为、条件分支失效与覆盖缺口

- 严重度：P2；规则：R5、D4
- 证据（概要；逐用例见 §7）：
  - `frontend/tests/components/AssetsLibrary.test.ts:1226` 断言旧 `toast.add`；`NodeCatalog.test.ts:113-154` 断言 `storeSetting` 且 `setting.set` 未被调用。
  - `tests/integration/test_storage_init.py:137` 断言历史 Alembic revision 名；`tests/packaging/test_contents.py:29` 断言 Alembic baseline；`tests/backend/test_storage.py:161,1051` 操作 `alembic_version`。
  - `tests/integration/test_equipment_api.py:40-47` 仅在 409 时断言 `EQUIPMENT_REFERENCED`，当前删除设备总是 204，该分支永不执行；`remove_test_records` 因此保留死逻辑。
  - `tests/integration/test_catalog_pagination.py:25`、`test_library_mcp.py:26`、`test_equipment_api.py:70,147` 的旧 token/env 设置不验证当前行为。
  - `tests/backend/test_siril.py:56` 测试名“outside_import_roots”与当前“本地 FITS 路径”语义不符。
  - `frontend/tests/widgets/serialization.test.ts:31` 测试名 “legacy empty workflow values” 把正常空值/损坏值错误处理标为 legacy（行为可保留，名称需改）。
  - 缺口：无 `connection_status` 结构化断言、无 canvas 持久化、无旧字段拒绝、无 Registry 不含 migrations、无文档残留扫描。
- 判定：测试需要跟随新行为；旧断言不能作为保留废弃实现的理由。
- 整改：逐用例更新/重命名；删除死条件断言；新增 §TEST_PLAN 的缺口用例。
- 受影响：见 §7。

### F-chat1-028 · 设备删除测试保留旧引用保护分支

- 严重度：P2；规则：R5
- 证据：`tests/integration/test_equipment_api.py:40-47`；`astrophoto/equipment/service.py:120-166` 当前删除会解除组合/主帧/属性引用并删除设备，`api/equipment.py:31-33` 返回 204；`errors.py:6` 的 `EQUIPMENT_REFERENCED` 无抛出点。
- 判定：旧“被引用设备不可删除，请归档”流程已废弃；测试条件分支是残留。
- 整改：删除条件 409 分支与 `EQUIPMENT_REFERENCED`；保留“删除后引用解除”的断言。
- 受影响：`tests/integration/test_equipment_api.py`、`api/errors.py`、i18n。

### F-chat1-029 · pre-commit Ruff 版本落后

- 严重度：P3；规则：R6（工具一致性）
- 证据：`.pre-commit-config.yaml:4` `rev: v0.4.9`；`pyproject.toml` dev 依赖 `ruff>=0.11,<1`；CI 与本地 `uv run ruff` 版本不一致。
- 判定：不是产品兼容，但会让 pre-commit 与 CI 规则漂移。
- 整改：将 pre-commit 固定到与 `pyproject.toml`/CI 一致的 Ruff 版本，并跑一次全仓 `ruff check`。
- 受影响：`.pre-commit-config.yaml`。

### F-chat1-030 · 复用优先判定（无违规，记录依据）

- 严重度：info；规则：R6
- 逐项结论：
  - `rename_noreplace`（`ctypes` 调 `renameat2`/`renamex_np`/Windows `os.rename`）：Python 标准库无“不覆盖原子重命名”，保留自研；有平台分支，非版本兼容。
  - `fingerprint`/`file_hash`：标准库 `hashlib`/`os.stat`，无成熟替代；保留。
  - `write_json_atomically`/`sync_directory`：小型原子写工具；无必要引入第三方；保留。
  - keyset pagination（`astrophoto/equipment/pagination.py`）：SQLAlchemy 无内建 keyset；无成熟轻量替代；保留。
  - ZIP/Registry 打包：使用 comfy-cli `zip_files` + `pathspec`，已复用官方工具；保留。
  - PowerShell 原生目录选择器：Windows 系统对话框无跨平台 Python 依赖；脚本为固定常量、参数白名单；保留，建议改为绝对 `powershell.exe` 路径并记录。
  - 前端 `vendor/comfyui`：宿主组件没有可导入包，复制是唯一复用方式；需跟进版本（F-025）。
  - MCP 客户端 DTO/校验：MCP 是独立发行包，不能导入 Extension；保留客户端校验，但字段 canonical 同步。
  - Siril 命令表/本地化：官方 1.4.5 命令表驱动；保留。
  - `extension/siril/_dependencies.py`：支持“顶层 package”和“宿主嵌套 package”两种导入上下文，不是版本兼容；需在实现阶段核对能否用单一相对导入消除，若不能则记录为打包上下文约束。
- 判定：除 Alembic 外，未发现“有成熟方案却重复自研”的明确违规；上述自研有技术必要性，整改时在 DEV_LOG 记录。

### F-chat1-031 · 语言切换用 500ms 轮询代替宿主设置变更事件

- 严重度：P3；规则：R6、D2
- 证据：`frontend/src/host/locale.ts:9-10` `setInterval(check, 500)` + `focus` 事件；同一代码库的 `frontend/src/host/dragDrop.ts:84` 已使用 `app.ui.settings.addEventListener('Comfy.VueNodes.Enabled.change', cancel)`，说明宿主设置对话框会派发 `<SettingId>.change` 事件。
- 判定：轮询是手写重复实现，不是旧版本兼容；会造成不必要的定时器与延迟。
- 整改：改为监听 `Comfy.Locale.change`（设置对话框/宿主 API 可用时），保留 `focus` 作为可见性兜底；若无该事件则保留轮询并注明宿主限制。
- 受影响：`frontend/src/host/locale.ts`、`SidebarNavigation.test.ts`（定时器断言）、`frontend/tests/host.ts`。

## 5. 需求/设计冲突与判定

未发现两个现行设计互斥。以下看似冲突但已判定：

1. `docs/product/requirements.md` §6.2 要求 `vue-basic`/PNG/`IMAGE` 路径不回归，`docs/architecture/overview.md:60` 说“兼容旧工作流”。判定：这是 ComfyUI 工作流序列化的**当前契约**与非回归验收，不是为旧版本保留的代码；保留 `widget.options.getValue/setValue` 与 `serializeValue`，不新增旧格式转换层。文档措辞改为“当前工作流契约”，不再用“继续兼容旧工作流”。
2. `docs/domains/storage.md` 的“系统窗口不可用时回退网页浏览”与 R3 的“降级兜底”。判定：这是当前 UX 的双入口设计（用户 D2 末句确认保留页面内反馈/替代路径），不是旧版本回退。
3. `docs/domains/storage.md` 的“工作区搬迁”与 R3 的“Migration”。判定：搬迁是当前产品能力（D3），保留；只删除旧回执/旧目录格式。
4. `docs/domains/siril.md:98` 的“旧端口契约下曾经测试”与 R3。判定：这是历史验证记录，不是现行实现承诺；保留在“验证边界”并标注历史日期/版本即可。
5. MCP 测试的 `mode="legacy"` 与 R3。判定：FastMCP 客户端协议模式，不是产品旧接口。

## 6. 逐文件审查清单

> 状态说明：`CLEAN` 已审查无改动；`CHANGE` 计划修改；`DELETE` 计划删除；`REGEN` 生成物，代码稳定后重新生成；`INVESTIGATE` 需在实现阶段核对（可能无改动）。
> 方法说明：`READ` 全量阅读；`TEST` 全量阅读并逐用例审查；`DOC` 全量阅读；`GEN` 生成物/由脚本核对；`STRUCT` 结构或引用校验；`EXCL` 排除（仅调用侧审查）。

| 文件 | 状态 | 方法 | 结论/备注 | chat2 实施状态 |
| --- | --- | --- | --- | --- |
| `.pre-commit-config.yaml` | CHANGE | READ | Ruff 0.4.9 与依赖 >=0.11 对齐。 | 已修改，见 DEV-chat2-002 |
| `AGENTS.md` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `README.md` | CHANGE | READ | “migration targets”措辞与当前基线；无旧接口声明需改。 | 已修改，见 DEV-chat2-002 |
| `__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/assets.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/catalog.py` | CHANGE | READ | 删除 confirmed/comparison/requires_confirmation；统一 asset_type/master_type。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/api/direct_import.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/equipment.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/errors.py` | CHANGE | READ | 删除未抛出的旧错误码与旧引用保护映射。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/api/library.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/routes.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/scientific.py` | CHANGE | READ | canvas 设置未传 update_settings；补齐持久化。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/api/security.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/status.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/api/storage.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/assets/catalog.py` | CHANGE | READ | 统一导入 asset_type 并在预检冻结分类；移除恒假条件；校准主帧目录编辑维护类型和绑定。 | HTTP/MCP 分类及绑定回归通过，见 RUN-chat2-004/005 |
| `astrophoto/assets/direct_import.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/assets/fits.py` | CHANGE | READ | 移除旧输出回退与路径形状推断；沿用统一的路径解析入口。 | 收录前后串联预览回归通过，见 RUN-chat2-005 |
| `astrophoto/assets/import_groups.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/assets/imports.py` | CHANGE | READ | 回执复用导入计划中冻结的 asset_type，包含追加集合。 | HTTP/MCP 分类回归通过，见 RUN-chat2-004/005 |
| `astrophoto/assets/library.py` | CHANGE | READ | 返回 canonical catalog_resource，共用 CATALOG_MODELS，优先校准主帧；收录或编辑前校验最终 role。 | HTTP 列表、详情、编辑、筛选和绑定回归通过，见 RUN-chat2-004/005 |
| `astrophoto/assets/library_rules.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/assets/managed_rename.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/assets/projects.py` | CHANGE | READ | 项目节点 asset_type/master_type 统一。 | 已核对；现行实现或既有测试已覆盖 |
| `astrophoto/assets/service.py` | CHANGE | READ | 以工作区 ID 与相对路径查询正式输出，优先用登记 ID 标识路径。 | 收录前后串联预览回归通过，见 RUN-chat2-005 |
| `astrophoto/bootstrap.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/bundles.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/core/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/core/capabilities.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/core/config.py` | CHANGE | READ | canvas_preview 忽略 settings；改为读取并校验。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/core/errors.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/core/paths.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/database/catalog_models.py` | CHANGE | READ | 目录与素材服务复用 CATALOG_MODELS 资源映射。 | HTTP 目录与素材详情回归通过，见 RUN-chat2-004/005 |
| `astrophoto/database/equipment_models.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/database/library_models.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/database/manager.py` | CHANGE | READ | Alembic 建库/revision 探测替换为 metadata create_all + schema revision。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/database/migrations/env.py` | DELETE | READ | Alembic 基线/env，随 D1 删除。 | 已删除 |
| `astrophoto/database/migrations/versions/0001_v1_baseline.py` | DELETE | READ | Alembic 基线/env，随 D1 删除。 | 已删除 |
| `astrophoto/database/models.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/equipment/pagination.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/equipment/schemas.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/equipment/service.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/equipment/snapshots.py` | CHANGE | READ | docstring “legacy optical snapshots”与实现不符。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/equipment/trains.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/cache.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/capacity.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/data_root.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/import_planner.py` | CHANGE | READ | “legacy hosts”注释指 Win32 长路径能力，保留逻辑改注释。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/storage/initializer.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/locations.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/manager.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/migration.py` | CHANGE | READ | 删除未登记输出特判、旧回执/旧 plan 分支；保留已收录输出的 AssetLocation 同步（改名）。 | 已修改，见 DEV-chat2-002 |
| `astrophoto/storage/operations.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/paths.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `astrophoto/storage/runtime.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `benchmark/README.md` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `benchmark/checks/pi_astrophoto.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `benchmark/checks/pi_hello.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/README.md` | CLEAN | DOC | 现行条款核对；无兼容声明（历史段落保留）。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/api/README.md` | CLEAN | DOC | 现行条款核对；无兼容声明（历史段落保留）。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/api/http/README.md` | CLEAN | DOC | 现行条款核对；无兼容声明（历史段落保留）。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/api/http/catalog-contracts.md` | CLEAN | DOC | 现行条款核对；无兼容声明（历史段落保留）。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/api/http/contracts.md` | CHANGE | DOC | 同步 canonical 导入字段，说明 catalog_resource 和校准主帧角色约束。 | 文档检查及打包通过，见 RUN-chat2-005 |
| `docs/api/http/routes.md` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/api/inventory.json` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/api/mcp/README.md` | CLEAN | DOC | 现行条款核对；无兼容声明（历史段落保留）。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/api/mcp/connection.md` | REGEN | DOC | connection_status 结构化输出说明。 | 已生成并核查 |
| `docs/api/mcp/contracts.md` | CHANGE | DOC | 手动状态文本、type/master_type 契约更新。 | 已修改，见 DEV-chat2-002 |
| `docs/api/mcp/equipment.md` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/api/mcp/equipment_groups.md` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/api/mcp/examples.md` | CHANGE | DOC | 字段/Schema 变更后的示例核对。 | 已修改，见 DEV-chat2-002 |
| `docs/api/mcp/library.md` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/api/mcp/projects.md` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/api/mcp/storage.md` | REGEN | DOC | 由项目脚本生成，代码稳定后重建。 | 已生成并核查 |
| `docs/architecture/overview.md` | CHANGE | DOC | 说明现行书签接口、读后确认及断网恢复。 | 文档检查及打包通过，见 RUN-chat2-005 |
| `docs/development/publishing.md` | CHANGE | DOC | Alembic 发布内容声明更新。 | 已修改，见 DEV-chat2-002 |
| `docs/development/setup-and-testing.md` | CHANGE | DOC | Alembic 描述、0.45 历史说明、主机基线统一。 | 已修改，见 DEV-chat2-002 |
| `docs/domains/assets.md` | CHANGE | DOC | “历史集合节点”措辞。 | 已修改，见 DEV-chat2-002 |
| `docs/domains/equipment.md` | CHANGE | DOC | 0001 baseline/alembic_version 表更新为当前 Schema 标识。 | 已修改，见 DEV-chat2-002 |
| `docs/domains/siril.md` | CHANGE | DOC | 同步通用预览路由及收录前后稳定的串联来源 ID。 | 文档检查及串联回归通过，见 RUN-chat2-005 |
| `docs/domains/storage.md` | CLEAN | DOC | 现行条款核对；无兼容声明（历史段落保留）。 | 沿用 chat1 审查；回归见测试报告 |
| `docs/integrations/mcp.md` | CHANGE | DOC | 旧手动 JSON 文本/原契约声明更新。 | 已修改，见 DEV-chat2-002 |
| `docs/product/requirements.md` | CHANGE | DOC | 当前状态/兼容表述与实现同步（仅必要处）。 | 已修改，见 DEV-chat2-002 |
| `extension/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/frontend-entry.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/_dependencies.py` | INVESTIGATE | READ | 双导入上下文 shim；核对能否统一为相对导入（F-030）。 | 已核对；保留独立包/宿主两种导入上下文 |
| `extension/siril/bundle.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/command_presentation.py` | CLEAN | STRUCT | 201 条命令展示数据；核对分类/标题/别名，无旧命名。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/command_table.py` | CLEAN | STRUCT | 官方 1.4.5 命令表；183 条可脚本命令由测试核对。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/commands.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/SirilCommandDetails.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/SirilCommands.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/SirilNodes.tsx` | CHANGE | READ | 删除旧标题迁移。 | 已修改，见 DEV-chat2-002 |
| `extension/siril/frontend/SirilSettings.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/api.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/index.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/locales/en/siril.json` | CLEAN | STRUCT | en/zh 键结构与引用核对；无旧错误码/字段。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/locales/zh/siril.json` | CLEAN | STRUCT | en/zh 键结构与引用核对；无旧错误码/字段。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/frontend/siril.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/node.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/previews.py` | CHANGE | READ | 回执 output_id/asset_id 与 command_id 默认值删除。 | 已修改，见 DEV-chat2-002 |
| `extension/siril/processing.py` | CHANGE | READ | 回执 canonical；recover_runs 去旧 Asset 判据；docstring。 | 已修改，见 DEV-chat2-002 |
| `extension/siril/publication.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/routes.py` | CHANGE | READ | 删除 `/previews/autostretch` 与默认命令。 | 已修改，见 DEV-chat2-002 |
| `extension/siril/session.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `extension/siril/software.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/eslint.config.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/package.json` | INVESTIGATE | READ | 需核对版本/宿主事件 API，可能无代码改动。 | 已核对；npm 无 1.59.6 类型包 |
| `frontend/pnpm-lock.yaml` | REGEN | GEN | 由项目脚本生成，代码稳定后重建。 | 未变更；目标类型版本不可用 |
| `frontend/pnpm-workspace.yaml` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/scripts/check-build.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/scripts/check-proxy.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/assets.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/client.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/directImport.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/equipment.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/fits.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/nativePicker.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/nodes.ts` | CHANGE | READ | 删除默认包名回退。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/api/previewSettings.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/status.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/api/storage.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/bundles/types.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/AssetAttributes.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/AssetEditor.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/AssetFilterPopover.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/AssetPicker.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/AssetsPanel.vue` | CHANGE | READ | catalog_kind/type 显示同步。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/assets/CaptureFields.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/CatalogCalibration.vue` | CHANGE | READ | master_type 契约。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/assets/CatalogDetails.vue` | CHANGE | READ | result_type/type 双名、editedLegacyMaster 命名、catalog_kind。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/assets/CatalogEditor.vue` | CHANGE | READ | result_type/master_type 契约。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/assets/CatalogOpticalBinding.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/CatalogProjects.vue` | CHANGE | READ | catalog_kind 稳定资源名。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/assets/DirectImportProgress.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/ImportAssets.vue` | CHANGE | READ | master_type 契约。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/assets/LibraryError.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/ProjectSubframes.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/RetryCalibrationBinding.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/SourceBrowser.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/assetFacets.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/assets.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/attributes.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/assets/directTransfer.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/drawing/DrawingApp.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/drawing/DrawingBoard.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/drawing/ToolBar.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/drawing/VueExampleComponent.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/components/DetailAccordion.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/components/DetailActions.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/components/RecordRows.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/components/ResourceContent.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/components/equipment.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/components/equipmentFields.tsx` | CHANGE | READ | 删除死导出与 osc 别名。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/library/components/useMutation.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/pages/EquipmentDetails.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/pages/EquipmentForm.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/pages/EquipmentList.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/pages/EquipmentPage.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/pages/OpticalTrainDetails.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/library/pages/OpticalTrainEditor.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/nodes/NodeHoverPreview.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/nodes/NodeTree.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/nodes/NodesPage.tsx` | CHANGE | READ | 侧栏使用服务端回读值，在网络恢复或焦点变化时刷新。 | Chromium 组件回归通过，见 RUN-chat2-005 |
| `frontend/src/features/nodes/preview/Inspector.tsx` | CHANGE | READ | 删除 dialog.show 非标准回退。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/nodes/preview/NodePreview.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/nodes/preview/PanelDivider.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/nodes/preview/inspector.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/nodes/preview/nodePreview.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/sidebar/SettingsPage.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/sidebar/Sidebar.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/sidebar/SoftwarePage.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/sidebar/moduleRegistry.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/sidebar/software.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/storage/EnvironmentPage.vue` | CHANGE | READ | canvas API 变更后核对（如加控件）。 | 已核对；现行实现或既有测试已覆盖 |
| `frontend/src/features/storage/OperationProgress.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/storage/StorageError.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/storage/StoragePage.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/storage/environment.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/storage/format.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/storage/storage.css` | CHANGE | STRUCT | 注释 1.59.1 版本对齐。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/features/storage/useStorageAction.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/tasks/TaskPanel.vue` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/tasks/taskState.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/features/tasks/tasks.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host.d.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host/canvas.ts` | CHANGE | READ | 注释“Version adapter”与实际的 API 能力校验不符（F-026）。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/host/comfy.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host/domWidgetMounts.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host/dragDrop.ts` | INVESTIGATE | READ | 需核对版本/宿主事件 API，可能无代码改动。 | 已核对；两种宿主画布模式已验证 |
| `frontend/src/host/drawing.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host/fitsSource.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host/locale.ts` | CHANGE | READ | 500ms 轮询改为宿主设置变更事件（F-031）。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/host/mountWidget.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/host/nodeBookmarks.ts` | CHANGE | READ | 用公开 getSetting 读取当前值与确认写入结果；删除整表补偿写入。 | Chromium 组件回归和真实宿主验证见 RUN-chat2-005 |
| `frontend/src/host/notify.ts` | CHANGE | READ | 删除 toast.add 旧分支，保留页面内反馈。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/host/sidebar.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/i18n/index.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/i18n/locales/en/assets.json` | CHANGE | STRUCT | master_type 字段文案同步。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/i18n/locales/en/sidebar.json` | CHANGE | STRUCT | 补充书签保存状态未知文案。 | 前端构建及 Chromium 组件回归通过，见 RUN-chat2-005 |
| `frontend/src/i18n/locales/zh/assets.json` | CHANGE | STRUCT | master_type 字段文案同步。 | 已修改，见 DEV-chat2-002 |
| `frontend/src/i18n/locales/zh/sidebar.json` | CHANGE | STRUCT | 补充书签保存状态未知文案。 | 前端构建通过，见 RUN-chat2-005 |
| `frontend/src/i18n/nodeDefinitions.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/main.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/ComfyMultiSelect.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/ComfySingleSelect.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/DisclosureChevron.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/Feedback.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/SearchField.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/SearchOptions.tsx` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/SidebarTabs.tsx` | CHANGE | READ | 注释宿主版本更新。 | 已核对；现行实现或既有测试已覆盖 |
| `frontend/src/shared/useResource.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/shared/useStoredChoice.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/styles/fits-source.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/styles/load.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/styles/theme.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/styles/utilities.css` | CLEAN | STRUCT | 规则与组件引用核对；无已删组件样式。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/src/types.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts` | CHANGE | READ | 断言素材列表中的校准主帧打开 canonical 目录详情。 | Chromium 组件回归通过，见 RUN-chat2-005 |
| `frontend/tests/components/BundleBoundary.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/DirectTransfer.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/DrawingApp.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Localization.test.ts` | CHANGE | READ | 错误码/字段键变更同步。 | 已核对；现行实现或既有测试已覆盖 |
| `frontend/tests/components/NodeCatalog.test.ts` | CHANGE | READ | 模拟跨标签保存及回读失败，断言一次写入、服务端值保留、恢复后重新显示。 | Chromium 组件回归通过，见 RUN-chat2-005 |
| `frontend/tests/components/ScientificNodes.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/SidebarNavigation.test.ts` | CHANGE | TEST | F-031：locale 事件化后更新定时器断言。 | 已修改，见 DEV-chat2-002 |
| `frontend/tests/components/StorageSettings.test.ts` | CHANGE | READ | canvas 持久化用例补充。 | 已核对；现行实现或既有测试已覆盖 |
| `frontend/tests/components/TaskPanel.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host.ts` | CHANGE | READ | 移除 settingsValues/storeSetting mock，补 setting.set 持久化语义。 | 已修改，见 DEV-chat2-002 |
| `frontend/tests/host/api.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/assets-host.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/canvas.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/domWidgetMounts.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/equipment-host.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/fixtures.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/host-runtime.mjs` | CHANGE | READ | 真实宿主断言 HTTP 403 仅尝试一次写入，解除拒绝后重试成功。 | Classic 与 Nodes 2.0 结果见 RUN-chat2-005 |
| `frontend/tests/host/siril-host.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/siril-presentation.mjs` | CHANGE | READ | F-008：旧标题迁移断言更新。 | 已修改，见 DEV-chat2-002 |
| `frontend/tests/host/storage-host.mjs` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/setup.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/registration.test.ts` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/serialization.test.ts` | CHANGE | READ | “legacy”测试名改为空值/损坏值恢复。 | 已修改，见 DEV-chat2-002 |
| `frontend/tsconfig.json` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `locales/en/main.json` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `locales/zh/main.json` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `locales/zh/nodeDefs.json` | CLEAN | GEN | 由 `scripts/siril_locales.py` 生成；与命令表一致（`siril_locales.py --check`）。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/README.md` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/pyproject.toml` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/__main__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/api/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/api/comfy.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/api/equipment.py` | CHANGE | READ | token 参数、死 draft/revision_detail 校验删除。 | 已修改，见 DEV-chat2-002 |
| `mcp/src/astrophoto_mcp/api/library.py` | CHANGE | READ | token 参数删除。 | 已修改，见 DEV-chat2-002 |
| `mcp/src/astrophoto_mcp/client.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/config.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/disclosure.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/server.py` | CHANGE | READ | 移除 EquipmentHTTP/LibraryHTTP 的无效 token 参数。 | 已修改，见 DEV-chat2-002 |
| `mcp/src/astrophoto_mcp/skills/astrophoto-management/SKILL.md` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/target.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/tools/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/tools/catalog.py` | CHANGE | READ | asset_type/master_type 契约同步。 | 已修改，见 DEV-chat2-002 |
| `mcp/src/astrophoto_mcp/tools/catalog_client.py` | CHANGE | READ | 删除 asset_kind 回退与 calibration_type 双字段。 | 已修改，见 DEV-chat2-002 |
| `mcp/src/astrophoto_mcp/tools/catalog_models.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/tools/equipment.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/src/astrophoto_mcp/tools/projects.py` | CHANGE | READ | 节点/素材 DTO 字段同步。 | 已修改，见 DEV-chat2-002 |
| `mcp/src/astrophoto_mcp/tools/status.py` | CHANGE | READ | 手动 connection_status 改结构化输出。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/conftest.py` | CHANGE | TEST | 删除旧 token 环境隔离 fixture。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/fixtures/status_contract.json` | CHANGE | READ | connection_status 输出 Schema 改为非 null。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/test_catalog_tools.py` | CHANGE | TEST | 旧 token/别名断言更新。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/test_client.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_disclosure.py` | CHANGE | TEST | 手动状态文本断言改为结构化。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/test_equipment.py` | CHANGE | TEST | 旧 token/凭据用例清理。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/test_equipment_names.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_server.py` | CHANGE | TEST | 旧 untyped 状态契约更新。 | 已修改，见 DEV-chat2-002 |
| `mcp/tests/test_target_discovery.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_version.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `nodes/ComfyUIFEExampleVueBasic.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `nodes/__init__.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `nodes/scientific.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `pyproject.toml` | CHANGE | READ | 移除 alembic 依赖；其余配置核对通过。 | 已修改，见 DEV-chat2-002 |
| `requirements.txt` | CHANGE | READ | 移除 alembic；Registry 依赖由脚本生成。 | 已修改，见 DEV-chat2-002 |
| `scripts/api_inventory.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `scripts/check_install.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `scripts/generate_library_test_assets.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `scripts/import_library_test_assets.py` | CHANGE | READ | 普通结果用 asset_type，校准主帧用 master_type。 | 脚本计划接入 HTTP 预检，实际生成夹具复测 200/422，见 RUN-chat2-005 |
| `scripts/release.py` | CHANGE | READ | Registry 必需清单移除 Alembic 文件。 | 已修改，见 DEV-chat2-002 |
| `scripts/render_api_reference.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `scripts/seed_equipment_fixture.py` | CHANGE | READ | alembic_version 改 user_version。 | 已修改，见 DEV-chat2-002 |
| `scripts/siril_locales.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `scripts/verify_library_test_assets.py` | CLEAN | READ | 全量阅读；无旧版本分支/别名/双轨；职责与现行文档一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_agent_direct_rules.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_core.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment_simple.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_library_capture_properties.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_managed_rename.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py` | CHANGE | TEST | 旧 env、回执字段、命令默认值断言更新。 | 已修改，见 DEV-chat2-002 |
| `tests/backend/test_status.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py` | CHANGE | TEST | alembic_version、旧 import roots env、回执字段更新。 | 已修改，见 DEV-chat2-002 |
| `tests/backend/test_storage_init.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_review.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_subframe_groups.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/conftest.py` | CHANGE | TEST | 0.45.0 test double 注释按 0.46.0 核对。 | 已修改，见 DEV-chat2-002 |
| `tests/integration/test_catalog_pagination.py` | CHANGE | TEST | 删除无效 LIBRARY_TOKEN 设置。 | 已修改，见 DEV-chat2-002 |
| `tests/integration/test_direct_import.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_equipment_api.py` | CHANGE | TEST | 旧 token/runtime 属性、条件 409 分支更新。 | 已修改，见 DEV-chat2-002 |
| `tests/integration/test_host_runtime.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_library_mcp.py` | CHANGE | TEST | 旧 token 环境清理。 | 已修改，见 DEV-chat2-002 |
| `tests/integration/test_photography_library.py` | CHANGE | TEST | 覆盖导入脚本请求、校准主帧列表与详情、非法角色和分类/绑定一致性。 | HTTP 集成回归通过，见 RUN-chat2-005 |
| `tests/integration/test_siril_api.py` | CHANGE | TEST | 保留通用预览路由回归，验证上下游正式结果收录前后可预览。 | aiohttp 与 Siril 替身回归通过，见 RUN-chat2-005 |
| `tests/integration/test_status_api.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py` | CHANGE | TEST | 旧 env 删除、回执字段更新。 | 已修改，见 DEV-chat2-002 |
| `tests/integration/test_storage_init.py` | CHANGE | TEST | 历史 Alembic revision 用例改写为 user_version 不匹配。 | 已修改，见 DEV-chat2-002 |
| `tests/integration/test_train_flat.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/nodes/test_image_io.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/nodes/test_registration.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_api_inventory.py` | CHANGE | TEST | 重新生成 inventory 后核对。 | 已核对；现行实现或既有测试已覆盖 |
| `tests/packaging/test_contents.py` | CHANGE | TEST | 移除 Alembic baseline 断言，断言无 migrations 目录。 | 已修改，见 DEV-chat2-002 |
| `tests/packaging/test_document_navigation.py` | CHANGE | TEST | 新增文档废弃契约断言并保留原导航检查。 | 打包及文档检查通过，见 RUN-chat2-004/005 |
| `tests/packaging/test_versions.py` | CLEAN | TEST | 逐用例审查；无旧断言或已列入 §7。 | 沿用 chat1 审查；回归见测试报告 |
## 7. 测试用例审查清单

> 判定：`KEEP` 保留；`UPDATE` 按现行设计修改；`RENAME` 仅重命名；`DELETE` 删除。计数见 §3。

### 7.1 pytest（tests/**，197 例）

| 用例 | 判定 | 说明 | chat2 实施状态 |
| --- | --- | --- | --- |
| `tests/backend/test_agent_direct_rules.py:11` · `test_deleting_equipment_unlinks_group_and_preserves_other_members` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_agent_direct_rules.py:25` · `test_unregister_asset_removes_project_reference_but_not_file` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_agent_direct_rules.py:48` · `test_successive_equipment_updates_preserve_other_fields` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_agent_direct_rules.py:60` · `test_project_delete_removes_tree_without_deleting_asset` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_core.py:11` · `test_import_and_config_do_not_create_directories` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_core.py:24` · `test_default_data_home` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_core.py:31` · `test_invalid_home` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment.py:19` · `test_concurrent_duplicate_device_writes_keep_one_record` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment.py:39` · `test_archived_component_can_be_retained_but_not_added` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment_simple.py:18` · `test_single_record_configuration_and_references` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment_simple.py:59` · `test_names_are_unique_across_create_rename_and_archive` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_equipment_simple.py:83` · `test_sorted_equipment_and_train_cursor` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:33` · `test_default_co_locates_entire_batch_and_respects_location_selection` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:44` · `test_distributes_by_bytes_and_preserves_user_order` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:53` · `test_shared_volume_budget_and_overlapping_or_unresolved_hardware` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:66` · `test_separate_jobs_share_physical_device_locks` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:91` · `test_managed_paths_preserve_source_and_catalog_names` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:97` · `test_path_limit_rejects_overflow_without_rewriting_file` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_import_planner.py:106` · `test_conflict_rejects_foreign_directories_and_casefold_duplicates` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_library_capture_properties.py:7` · `test_iso_and_readout_mode_are_separate_optional_capture_properties` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_library_capture_properties.py:15` · `test_invalid_iso_is_rejected` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_managed_rename.py:14` · `test_managed_group_directory_rename_and_recovery` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:27` · `test_siril_temporary_directory_retries_only_windows_sharing_violations` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:56` · `test_direct_fits_path_outside_import_roots` | UPDATE | F-004/F-021：语义与名称改为本地 FITS 路径。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_siril.py:71` · `test_load_image_node_outputs_path_and_tracks_file_changes` | UPDATE | F-021：移除旧 env。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_siril.py:87` · `test_registered_source_nodes_keep_order_and_fail_on_missing_member` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:155` · `test_fits_inspection_validates_precision_metadata_and_truncation` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:166` · `test_formal_run_requires_an_absolute_path` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:176` · `test_parameters_reject_untrusted_script_values` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:181` · `test_mono_normalizes_linked` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:186` · `test_config_rejects_incompatible_version_and_keeps_previous` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:199` · `test_invalid_and_gui_paths_rejected` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:208` · `test_runner_timeout_and_mid_process_cancellation` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:224` · `test_windows_runner_isolates_siril_from_msys_environment` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:235` · `test_restart_reconciles_only_owned_unregistered_run` | UPDATE | F-005/F-007：回执/恢复判据更新。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_siril.py:254` · `test_real_cli_immutable_source_and_formal_output` | UPDATE | F-002：回执字段 canonical。 | Siril 未安装；跳过 |
| `tests/backend/test_siril.py:311` · `test_real_cli_direct_path_and_chained_output` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | Siril 未安装；跳过 |
| `tests/backend/test_siril.py:337` · `test_migrate_workspace_with_uncollected_formal_output` | UPDATE | F-002：回执字段 canonical。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_siril.py:384` · `test_generic_siril_arguments_are_tokens_not_script_lines` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_siril.py:397` · `test_real_cli_shared_path_commands` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | Siril 未安装；跳过 |
| `tests/backend/test_siril.py:441` · `test_siril_session_directory_moves_as_one_group` | KEEP | 现行 Siril 行为（真实 CLI 用例按环境跳过）。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_status.py:6` · `test_capabilities_follow_registration_not_plans` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:50` · `test_register_requires_empty_selected_directory` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:70` · `test_location_priority_quota_and_reservation` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:93` · `test_import_preview_freezes_automatic_location` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:118` · `test_first_start_and_reentry` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:130` · `test_bootstrap_interrupted_after_database_commit` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:151` · `test_never_replaces_an_existing_asset_database` | UPDATE | F-001/F-022：改用 schema revision/user_version。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_storage.py:169` · `test_multi_process_bootstrap` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:182` · `test_foreign_keys_busy_rollback_and_backup` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:201` · `test_multiple_workspaces_default_disable_and_offline_relocation` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:227` · `test_cache_owner_entries_only_with_live_lease` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:242` · `test_processing_scratch_recovers_only_owned_producer_files_without_a_live_lease` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:275` · `test_reference_multiple_roots_mode_snapshot_and_relocation` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:300` · `test_copy_override_idempotency_and_real_bytes` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:317` · `test_copy_preflight_blocks_offline_read_only_full_and_unauthorized` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:339` · `test_copy_detects_inflight_source_change` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:357` · `test_restart_discards_published_copy_without_db_commit` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:384` · `test_copy_name_race_finishes_without_leaving_staged_bytes` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:428` · `test_copy_group_members_move_together_and_delete_individually` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:454` · `test_reference_subframes_are_grouped_and_visible` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:478` · `test_group_retry_after_publication_preserves_original_indices_and_sibling` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:512` · `test_named_group_key_stays_owned_after_move` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:540` · `test_direct_write_intent_protects_migration_and_removal` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:563` · `test_cancel_partial_staging` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:581` · `test_migration_recovers_around_database_switch` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:624` · `test_migration_actual_cross_volume` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:640` · `test_process_exit_during_copy_discards_own_staging` | UPDATE | F-021：移除 ASTROPHOTO_IMPORT_ROOTS。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_storage.py:673` · `test_partial_migration_requires_explicit_smallest_overshoot_and_cleans_source` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:702` · `test_remove_location_retries_after_second_copy_fails` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:760` · `test_remove_location_rejects_insufficient_target_quota_on_same_volume` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:781` · `test_partial_migration_moves_formal_result_and_required_receipt_together` | UPDATE | F-002：回执改 run_id/command_id。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_storage.py:810` · `test_volume_budget_uses_all_space_until_quota_is_set` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:826` · `test_rebind_partial_keeps_available_assets_and_write_access` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:854` · `test_offline_root_move_restarts_from_new_root_and_protects_old_snapshot` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:885` · `test_offline_root_move_can_roll_back_before_new_root_opens` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:901` · `test_committed_workspace_cleanup_retries_without_changing_authority` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:928` · `test_close_clears_nonempty_session_cache_and_keeps_managed_assets` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:942` · `test_migration_verification_error_keeps_source` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:961` · `test_reject_links_unc_and_relative_paths` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:984` · `test_reference_on_distinct_windows_volumes` | UPDATE | F-021：移除 ASTROPHOTO_IMPORT_ROOTS。 | 第二物理卷未覆盖；按环境跳过 |
| `tests/backend/test_storage.py:1005` · `test_explicit_wal_failure_has_no_fake_ready` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage.py:1024` · `test_v1_reopens_with_schema_only_in_committed_wal` | UPDATE | F-001：改为 user_version/schema identity。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_storage.py:1051` · `test_legacy_dev_schema_is_preserved` | UPDATE | F-001/F-022：改为不兼容 user_version 并重命名。 | 已同步或核对；回归见测试报告 |
| `tests/backend/test_storage_init.py:28` · `test_init_confirms_default_and_repairs_only_safe_gaps` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:51` · `test_init_preserves_missing_identity_or_data` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:66` · `test_init_cannot_recreate_directory_over_missing_registered_asset` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:80` · `test_reentry_preserves_conflicting_evidence_and_accepts_absent_record` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:106` · `test_init_uses_effective_workspace_and_persistent_cache` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:130` · `test_init_does_not_replace_a_live_lock_directory` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:144` · `test_init_rechecks_lock_directory_after_acquiring_locks` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:163` · `test_init_defers_repair_while_workspace_lease_is_held` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:175` · `test_concurrent_init_converges_and_retry_preserves_completed_steps` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:209` · `test_init_after_offline_root_move_preserves_location_identity` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:230` · `test_migration_plan_directory_created_only_on_first_plan` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:250` · `test_registered_root_never_reenters_creation_after_manifest_regression` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:274` · `test_host_startup_checks_and_repairs_top_level_directories` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:307` · `test_staging_repair_waits_for_import_or_pending_cleanup` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:321` · `test_unreadable_or_unsafe_evidence_blocks_repairs` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_init.py:340` · `test_bootstrap_lock_timeout_and_restart_reuse_identity` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_review.py:38` · `test_r01_cleanup_verifies_target_before_reporting_cleared` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_review.py:79` · `test_r02_validate_reports_registered_files_that_are_missing` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_review.py:102` · `test_r05_remove_blocks_the_target_of_an_active_migration` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_review.py:117` · `test_r04_data_root_preflight_reports_missing_registered_files` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_storage_review.py:138` · `test_r03_offline_move_crash_before_catalog_update_stays_recoverable` | KEEP | 现行存储/搬迁/恢复行为，与 D3 一致。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/backend/test_subframe_groups.py:11` · `test_group_counts_follow_frame_membership_and_storage_location` | KEEP | 现行后端行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_catalog_pagination.py:21` · `test_catalog_pagination_with_unique_names` | UPDATE | F-021：删除无效 ASTROPHOTO_LIBRARY_TOKEN。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_catalog_pagination.py:70` · `test_catalog_cursor_recovers_after_writes_and_anchor_removal` | UPDATE | F-021：删除无效 token。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_catalog_pagination.py:112` · `test_large_calibration_candidate_listing` | UPDATE | F-010/F-021：字段与 token 清理。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_direct_import.py:43` · `test_manifest_and_direct_upload_routes` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:105` · `test_restart_after_direct_import_directory_publication` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:149` · `test_retry_only_failed_frame_and_recover_after_publish` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:182` · `test_paused_failure_releases_location_and_preserves_cancelled_errors` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:205` · `test_missing_publication_checkpoint_restages_from_the_browser` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:223` · `test_rejected_publication_releases_owned_bytes` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:248` · `test_path_conflicts_release_stage_without_touching_other_assets` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:281` · `test_startup_reconciles_partial_stage_and_interrupted_cancel` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:307` · `test_parallel_writes_and_reassignment_keep_order` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:348` · `test_cancel_releases_a_stalled_browser_stream` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:378` · `test_abandoned_browser_stream_pauses_and_releases_staging` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:407` · `test_cancel_finishes_after_its_location_was_removed` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_direct_import.py:441` · `test_preview_expiry_and_revision_conflict_leave_no_job` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_equipment_api.py:84` · `test_equipment_and_train_api_permissions_receipts_and_errors` | UPDATE | F-014/F-021：旧 token/runtime 属性清理。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_equipment_api.py:106` · `test_equipment_crud_without_credentials_or_delete_approval` | UPDATE | F-021/F-028：旧凭据语义清理，保留无审批删除行为。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_equipment_api.py:147` · `test_equipment_mcp_crud_and_chat_deletion_against_public_http` | UPDATE | F-014/F-021：旧 token/env 清理。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_equipment_api.py:191` · `test_equipment_catalog_create_and_combination` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_equipment_api.py:222` · `test_equipment_api_cleanup_runs_after_case_error` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_equipment_api.py:248` · `test_equipment_route_conflict_has_no_partial_registration` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_host_runtime.py:11` · `test_running_comfyui_status_and_node` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_library_mcp.py:21` · `test_name_tools_import_append_and_calibration` | UPDATE | F-010/F-014/F-021：token/env 与字段更新。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_photography_library.py:21` · `test_mcp_local_equipment_and_catalog_without_tokens` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:40` · `test_bound_mcp_request_cannot_write_to_replacement_instance` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:58` · `test_mcp_storage_delete_removes_managed_copy_and_preserves_source` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:119` · `test_changing_collection_type_detaches_incompatible_calibration` | UPDATE | F-011：删除 confirmed。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_photography_library.py:141` · `test_calibration_master_project_reference_is_atomic` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:187` · `test_catalog_unregistration_uses_displayed_master_revision` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:216` · `test_direct_calibration_camera_unlinked_on_equipment_deletion` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:242` · `test_removed_optical_devices_preserve_master_history_and_compare` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:316` · `test_large_collection_unregistration_batches_and_rolls_back` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:404` · `test_project_concurrent_updates_and_removal_use_current_tree` | UPDATE | F-011：retired field 断言更新。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_photography_library.py:446` · `test_missing_import_submission_receipt_can_be_recovered_after_restart` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:525` · `test_retired_library_routes_and_import_fields_cannot_write` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:559` · `test_typed_catalog_import_calibration_and_project_tree` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:614` · `test_unified_calibration_master_import_binding_and_edit` | UPDATE | F-010/F-011 预期及校准主帧资源路由、非法角色、筛选、绑定、类型化编辑。 | 已通过，见 RUN-chat2-005 |
| `tests/integration/test_photography_library.py:660` · `test_catalog_names_unique_across_types_and_released_on_removal` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:697` · `test_concurrent_catalog_name_reservations_are_atomic` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:722` · `test_ordinary_master_capture_source_and_type_changes` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:758` · `test_calibration_master_can_change_purpose` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:775` · `test_reference_subframe_group_imports_selected_files_from_multiple_folders` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:792` · `test_reference_image_result_categories_are_separate` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:810` · `test_image_result_optical_binding_import_update_and_clear` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:855` · `test_remove_subframes_preserves_files_and_empty_collection` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:883` · `test_edit_and_remove_collection_preserves_files_and_project_protection` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:915` · `test_typed_copy_import_uses_one_image_result_record` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:945` · `test_copy_binding_failure_preserves_published_collection` | UPDATE | F-010/F-011：confirmed/comparison。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_photography_library.py:990` · `test_video_filter_must_belong_to_train_and_snapshot_is_stable` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:1023` · `test_copy_preview_snapshot_and_reference_independent_identity` | UPDATE | F-011：retired field 断言更新。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_photography_library.py:1092` · `test_direct_group_resumes_after_host_restart_and_preserves_project` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:1138` · `test_retry_remaining_preserves_completed_copies` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_photography_library.py:1180` · `test_copy_import_preserves_fits_bytes_and_scientific_headers` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_siril_api.py:23` · `test_scientific_api_access_source_and_cache` | UPDATE | F-006：旧路由改 /previews/siril/autostretch。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_siril_api.py:103` · `test_generic_scientific_nodes_and_routes_without_siril` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_status_api.py:14` · `test_v3_load_registers_one_live_status_route` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_status_api.py:36` · `test_route_ownership_and_per_server_isolation` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:41` · `test_storage_init_validates_request_before_writing` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:71` · `test_operation_list_reports_live_import_and_migration_without_storage_scan` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:108` · `test_location_policy_http_and_ordered_capacity` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:135` · `test_browse_directories_requires_local_authorization` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:162` · `test_native_picker_authorization_and_selection` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:224` · `test_http_storage_import_and_access_boundary` | UPDATE | F-021：删除旧 env。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_storage_api.py:311` · `test_invalid_storage_config_preserves_status_route` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:331` · `test_http_data_root_preflight_reports_move_blockers` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:413` · `test_http_active_migration_target_cannot_be_removed` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:461` · `test_removal_migration_is_visible_before_delete_returns` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_api.py:499` · `test_delete_migrates_local_library_and_preserves_references` | UPDATE | F-002：回执字段 canonical。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_storage_api.py:564` · `test_delete_collision_keeps_registered_source_and_can_retry` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_init.py:53` · `test_http_init_repairs_and_rechecks_the_host_root` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_init.py:92` · `test_http_init_preserves_a_failed_startup_and_recovers` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/integration/test_storage_init.py:137` · `test_development_database_is_rejected` | UPDATE | F-001/F-022：历史 Alembic revision 改写为 user_version。 | 已同步或核对；回归见测试报告 |
| `tests/integration/test_train_flat.py:13` · `test_train_flat_http` | KEEP | 现行 HTTP/集成行为，无旧断言。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/nodes/test_image_io.py:4` · `test_load_image_delegation_and_output` | KEEP | V3 节点契约，无旧字段。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/nodes/test_image_io.py:16` · `test_invalid_widget_data_rejected_before_host_io` | KEEP | V3 节点契约，无旧字段。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/nodes/test_registration.py:5` · `test_v3_registration_and_definition` | KEEP | V3 节点契约，无旧字段。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_api_inventory.py:14` · `test_registered_http_definitions_match_inventory` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_api_inventory.py:23` · `test_siril_bundle_routes_are_listed_only_when_registered` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_api_inventory.py:30` · `test_mcp_tool_names_and_input_schemas_match_inventory` | UPDATE | F-013/F-024：状态 Schema 更新后重生成。 | 已同步或核对；回归见测试报告 |
| `tests/packaging/test_api_inventory.py:55` · `test_rendered_reference_contains_every_inventory_entry` | UPDATE | F-024：生成页更新。 | 已同步或核对；回归见测试报告 |
| `tests/packaging/test_api_inventory.py:74` · `test_every_mcp_tool_has_an_example_validated_against_its_schema` | UPDATE | F-024：示例/Schema 更新。 | 已同步或核对；回归见测试报告 |
| `tests/packaging/test_contents.py:21` · `test_registry_archive` | UPDATE | F-022：移除 Alembic baseline 断言。 | 已同步或核对；回归见测试报告 |
| `tests/packaging/test_contents.py:39` · `test_mcp_artifacts_exclude_extension` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_contents.py:57` · `test_built_frontend_external_urls_preserve_proxy_prefix` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_contents.py:70` · `test_registry_archive_ships_only_the_siril_runtime` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_contents.py:104` · `test_public_sources_stay_independent_of_the_processing_bundle` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_document_navigation.py:16` · `test_maintained_markdown_links_resolve` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_document_navigation.py:45` · `test_feature_pipeline_entrypoints_available` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_versions.py:8` · `test_versions_and_tag` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |
| `tests/packaging/test_versions.py:14` · `test_sync_and_mismatch` | KEEP | 发行/导航契约，随生成物核对。 | 沿用 chat1 审查；回归见测试报告 |

### 7.2 MCP pytest（mcp/tests/**，47 例）

| 用例 | 判定 | 说明 | chat2 实施状态 |
| --- | --- | --- | --- |
| `mcp/tests/test_catalog_tools.py:36` · `test_filter_state_optional_but_not_nullable` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_catalog_tools.py:44` · `test_catalog_tool_discovery` | UPDATE | F-009/F-010/F-014：字段与 token 清理。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_catalog_tools.py:82` · `test_tools_require_direct_loopback_and_credential` | UPDATE | F-014：凭据概念删除，保留回环限制断言。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_catalog_tools.py:92` · `test_stdio_update_schemas_preserve_optional_and_nullable_fields` | UPDATE | F-014：token env 删除。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_catalog_tools.py:112` · `test_catalog_errors_do_not_leak_credential` | UPDATE | F-014：改为敏感信息过滤（无 token 概念）。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_catalog_tools.py:131` · `test_catalog_schema_rejects_invalid_requests_before_http` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_client.py:9` · `test_diagnostics_public_api` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_client.py:22` · `test_absent_extension_and_http_error` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_client.py:31` · `test_http_errors_at_either_endpoint` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_client.py:41` · `test_transport_errors_and_timeout_configuration` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_client.py:52` · `test_invalid_json_response` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_client.py:60` · `test_invalid_system_shape` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py:10` · `test_url_precedence` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py:23` · `test_invalid_urls` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py:28` · `test_empty_environment_is_not_silently_ignored` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py:34` · `test_ipv6_and_proxy_path` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py:39` · `test_cli_passes_explicit_url_to_stdio_factory` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_config.py:54` · `test_cli_invalid_url_is_argparse_error` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_disclosure.py:13` · `test_category_catalog_and_direct_calls` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_disclosure.py:46` · `test_auto_proxy_import_and_poll_retains_origin` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_disclosure.py:80` · `test_proxy_preserves_manual_status_text_and_validation_error` | UPDATE | F-013：手动状态改结构化断言。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_equipment.py:29` · `test_read_tools_schema_permissions_and_adapter` | UPDATE | F-014：token env 与命名更新。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_equipment.py:54` · `test_missing_credential_or_nondirect_host_keeps_base_tools` | UPDATE | F-014：删除凭据参数化，保留非直连主机用例。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_equipment.py:69` · `test_invalid_or_denied_backend_is_mcp_error` | UPDATE | F-014：token 泄露断言更新。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_equipment.py:91` · `test_opted_in_stdio_lists_read_only_tools` | UPDATE | F-014：token env 删除。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_equipment.py:104` · `test_validation_reasons_reach_the_agent_without_leaking_credentials` | UPDATE | F-014：改为字段过滤断言。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_equipment_names.py:41` · `test_schema_and_optional_update` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_server.py:29` · `test_registered_tool_schemas` | UPDATE | F-013：connection_status 输出 Schema 更新。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_server.py:47` · `test_packaged_management_skill_is_discoverable_and_matches_tools` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_server.py:67` · `test_duplicate_registration_fails` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_server.py:73` · `test_in_memory_status_contract` | UPDATE | F-013：断言结构化内容。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_server.py:107` · `test_diagnostic_failures_are_mcp_errors` | UPDATE | F-013：错误内容结构同步。 | 已同步或核对；回归见测试报告 |
| `mcp/tests/test_server.py:127` · `test_invalid_packaged_skill_fails_startup` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_server.py:138` · `test_stdio_initialize_list_and_call` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_server.py:155` · `test_stdio_stdout_contains_only_protocol_json` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:15` · `test_discovery_multiple_selection_and_reconnect` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:65` · `test_discovery_prefers_usable_desktop` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:91` · `test_import_task_never_moves_to_another_instance` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:120` · `test_no_instance_then_late_start` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:144` · `test_import_result_records_origin_for_future_poll` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:162` · `test_import_poll_remains_bound_to_original_host` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:197` · `test_explicit_target_is_never_replaced` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:211` · `test_reports_comfyui_without_astrophoto` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:229` · `test_desktop_lock_requires_listener_owner` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_target_discovery.py:245` · `test_lock_owner_matches_real_loopback_listener` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_version.py:10` · `test_module_cli_version` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |
| `mcp/tests/test_version.py:15` · `test_version_tool_reports_installed_package` | KEEP | 现行 MCP 工具/协议行为。 | 沿用 chat1 审查；回归见测试报告 |

### 7.3 前端 Vitest（frontend/tests/**，116 例）

| 用例 | 判定 | 说明 | chat2 实施状态 |
| --- | --- | --- | --- |
| `frontend/tests/components/AssetsLibrary.test.ts:94` · `asset type filter offers only types found in the catalog` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:113` · `filter sections use the shared disclosure and retain selected options when collapsed` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:130` · `facet filtering keeps matching subframe groups and combines categories` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:179` · `catalog unregistration submits the visible catalog revision` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:203` · `catalog equipment binding can be selected, saved, and explicitly unbound` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:239` · `asset edits preserve a deleted equipment group by its historical ID` | UPDATE | F-014/F-026：移除 has_draft 旧 fixture 字段。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:289` · `outer asset rows show name and type without batch selection or actions` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:298` · `asset rows identify videos, masters, results and unknown types` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:313` · `calibration candidates show differences and missing metadata` | UPDATE | F-010：type→master_type。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:339` · `subframe group editor submits group parameters and preserves optical snapshot when unchanged` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:357` · `subframe group displays shared parameters and read-only frame details` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:416` · `reference import offers four types and returns to the type choices on cancel` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:434` · `reference import falls back to the browser and keeps a single selected file` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:453` · `UX-01/02: preserves the Assets filters and retains three host tabs in a narrow sidebar` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:483` · `filter popover remains available and view settings are removed` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:492` · `filter menu loads all catalog pages and preserves search on clear` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:512` · `empty asset library offers no filter categories` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:521` · `filter options report a loading failure and can retry` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:538` · `reference subframe import appends folders, removes frames and submits the retained files` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:570` · `copy subframe selection appends folders and removes only the selected frame` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:591` · `copy previews file metadata, writes on confirmation and resumes only the missing original after reopening` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:671` · `parallel copy is opt-in and preflights only the selected online locations` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:710` · `UX-14/20/23: revision conflict preserves modified metadata; Reference delete keeps only unregister action` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:773` · `calibration master is configured during the master frame import` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:793` · `capture editor keeps sensitivity values and places binning in more parameters` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:808` · `catalog editor displays a clear duplicate name error` | UPDATE | F-009：结果类型字段。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:825` · `asset import displays a clear duplicate name error` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:840` · `an existing master frame can be edited into a calibration master` | UPDATE | F-009/F-010：result_type/master_type。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:860` · `new projects create folders and reference an imported catalog record` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:902` · `project picker retains selections across asset filters and submits mixed assets atomically` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:938` · `project removal submits directly without confirmation or impact preview` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:960` · `project picker keeps selection and shows a localized missing-record error` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:981` · `project opens a calibration master through its V1 image result` | UPDATE | F-009：结果类型字段。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1003` · `asset context menu adds to its parent folder` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1019` · `project inline creation cancels blank, invalid and duplicate inputs, and saves on blur` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1052` · `project tree drag moves references within a project and rejects folder cycles` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1086` · `project and node renames save on blur and escape cancels` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1132` · `project context menu opens without an ellipsis button and supports keyboard dismissal` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1153` · `empty project area offers project creation with mouse and keyboard` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1172` · `project inline creation preserves a valid name and can retry after a service failure` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1198` · `project tree supports keyboard navigation and retains ancestors in search` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1226` · `host notification adapter uses current and legacy APIs with a safe fallback` | UPDATE | F-015：删除旧 toast.add 断言，保留不可用兜底。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1242` · `project subframe groups expand in place, retry a page, and expose read-only file facts` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/AssetsLibrary.test.ts:1298` · `detailed library errors notify the host and retain their retry control` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/BundleBoundary.test.ts:80` · `08-A: the public entry registers the shared extensions once and delegates bundle nodes` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/BundleBoundary.test.ts:103` · `08-A: without a bundle the software entry stays unavailable and exposes no bundle entry` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/BundleBoundary.test.ts:117` · `08-A: a second bundle plugs into the shared software entry and its own messages` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/DirectTransfer.test.ts:8` · `one writer per disk, idle disk steals whole frames and a rejected reassignment falls back once` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/DrawingApp.test.ts:6` · `real Canvas drawing emits and saves changed PNG data, then clears` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/DrawingApp.test.ts:26` · `toolbar updates brush color and size and renders Chinese text` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/DrawingApp.test.ts:38` · `touch drawing uses real TouchEvents and saves Canvas pixels` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:59` · `equipment edits preserve concurrent changes and send explicit clears` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:119` · `04-A/B: equipment loads lazily and a field rejection preserves input before save and archive` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:166` · `04-B: navigation cancellation retains the form, host remount restores it, and confirmed navigation discards it` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:210` · `04-B/C: train deletion proceeds without a confirmation` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:235` · `04-A: device and train filters remain independent and the tabs support manual keyboard activation` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:276` · `04-A/C: real Reka options support keyboard selection and Escape in a narrow sidebar, then save a train with quick-added optics` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:354` · `04-A/B: editing a stale optical draft retains changes and rebases onto the current server revision` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:395` · `04-A: generic record rows and detail folding also work with a non-device record` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Library.test.ts:411` · `04-C: disabled choices remain unavailable and the empty selection survives a keyboard round trip` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Localization.test.ts:44` · `07: the sidebar, assets, drawing and Siril dictionaries keep identical Chinese keys` | UPDATE | F-018/F-027：错误码/字段键同步。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/Localization.test.ts:52` · `07: the shipped bundle messages merge into both interface locales` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/Localization.test.ts:66` · `07: every literal t() key in the public sources resolves in both locales` | UPDATE | F-018/F-027：新键补齐。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:75` · `02-A: the sort preference is stored locally and reorders the rendered tree` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:94` · `CASE-02/04: equally named nodes retain their identities and descriptions render as text` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:113` · `02-A: bookmarking writes the host setting and a rejected write keeps the stored value` | UPDATE | F-016：校验 403 和重试时的持久值与侧栏反馈。 | 已通过，见 RUN-chat2-005 |
| `frontend/tests/components/NodeCatalog.test.ts:140` · `02-A: a synchronous host setting rejection leaves the catalog unbookmarked and reports it` | UPDATE | F-016：setting.set 同步失败。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:155` · `CASE-06: top-level and folder references are separate and a missing definition returns by ID` | UPDATE | F-016：删除 storeSetting 断言。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:180` · `02-A: the category filter narrows the tree and the all-categories choice restores it` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:245` · `02-B: canvas drops accept owned node payloads, ignore foreign drags and detach on unmount` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:274` · `02-B: the mounted catalog follows a replacement canvas and ignores the old element` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:292` · `CASE-07: an in-flight drag cannot survive a graph change, refresh or tab change` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:311` · `02-C: the node detail adds through the host canvas and reports a rejected insertion` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/NodeCatalog.test.ts:331` · `node canvas actions use host notifications when available` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/ScientificNodes.test.ts:94` · `Inspector preserves host change boundaries and stale candidate cancellation` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/ScientificNodes.test.ts:129` · `mono candidates disable linking in the Inspector and native Widget` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/ScientificNodes.test.ts:138` · `a late formal receipt reverts to the current candidate when the server reports it stale` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/ScientificNodes.test.ts:152` · `Gaussian Blur uses the shared Inspector and sends its own command ID` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/SidebarNavigation.test.ts:24` · `one Vue sidebar starts on Assets, loads its library, follows host locale and cleans up` | UPDATE | F-031：按设置事件替代 500ms 轮询更新定时器/清理断言。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/SidebarNavigation.test.ts:64` · `loads the catalog when visited and preserves the search across sidebar tabs` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/SidebarNavigation.test.ts:96` · `IME defers debounced search, clear focuses the input and unmount cancels pending updates` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/SidebarNavigation.test.ts:119` · `CASE-02: refresh hides stale actions, rejects a late result and retries a failure` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:48` · `03-C rejected mode revision preserves the checked server value, accepted mode refreshes it` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:78` · `03-A the storage page shows only workspace registration and existing quotas are read-only` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:128` · `removing the preferred location requires an explicit target and confirmation` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:176` · `a refreshed removal resumes only against its recorded destination` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:206` · `folder browser fills the storage location path and can cancel` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:239` · `storage location order is saved through the policy API` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:259` · `dragging a storage location saves the reordered IDs` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:285` · `03-C a rejected workspace registration keeps the draft and allows another attempt` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:316` · `03-B/03-C preview selection saves and conflict reloads the current revision` | UPDATE | F-017：canvas 持久化断言。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:367` · `03-C leaving before preview settings respond aborts the GET and suppresses a delayed failure` | UPDATE | F-017：可选 canvas 字段。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:385` · `03-C preview settings reject an invalid server response and recover on retry` | UPDATE | F-017：canvas 校验。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:395` · `location panel saves name and limit, and cancel discards changes` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:432` · `location panel reports a partially saved limit and retries only the name` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/StorageSettings.test.ts:461` · `location panel displays the current capacity reference and help, not used space` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/TaskPanel.test.ts:9` · `tracks import and migration across views, restores state and clears only finished entries` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/components/TaskPanel.test.ts:52` · `paused direct imports can resume or dismiss and cancelled imports retain frame errors` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/api.test.ts:11` · `bad JSON and disconnection differ` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/api.test.ts:17` · `timeout and caller abort cancel the host request` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/api.test.ts:27` · `status and node response guards reject invalid contracts` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/api.test.ts:35` · `CASE-02: a renamed installation keeps valid ports and skips invalid and foreign definitions` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/canvas.test.ts:16` · `uses current graph, coordinates and native change boundary` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/canvas.test.ts:22` · `read-only/select-only/unregistered actions fail before mutation` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/canvas.test.ts:28` · `failed insertion cleans up and ends transaction` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/canvas.test.ts:32` · `rejects an incomplete host or coordinates before opening a history boundary` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/canvas.test.ts:41` · `drag payload only accepts registered owned node IDs` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/domWidgetMounts.test.ts:28` · `trackDomWidget keeps the host onAdded hook and stamps the current owner` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/domWidgetMounts.test.ts:42` · `restoreDomWidgetMounts reattaches the recreated element in place of the stale container` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/domWidgetMounts.test.ts:71` · `restoreDomWidgetMounts leaves foreign containers, other widgets and missing graphs alone` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/registration.test.ts:4` · `built widget mounts Vue and i18n on a native DOM widget` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/serialization.test.ts:8` · `saved workflow value restores exact PNG pixels and preserves upload contract` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/serialization.test.ts:31` · `legacy empty workflow values stay editable and malformed saved pixels report an error` | UPDATE | F-027：仅重命名，行为保留。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/widgets/serialization.test.ts:43` · `Chinese drawing translations include every English key and the pen tooltip` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/serialization.test.ts:48` · `serializes current Canvas pixels into the existing upload contract` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/widgets/serialization.test.ts:67` · `upload rejection keeps the existing null-image failure contract` | KEEP | 现行 UI/宿主行为，无旧接口断言。 | 沿用 chat1 审查；回归见测试报告 |

### 7.4 前端宿主/测试夹具（非 Vitest 用例）

| 文件 | 判定 | 说明 | chat2 实施状态 |
| --- | --- | --- | --- |
| `frontend/tests/host.ts` | UPDATE | F-016：移除 settingsValues/storeSetting mock。 | 已同步或核对；回归见测试报告 |
| `frontend/tests/setup.ts` | KEEP | 测试环境初始化；无旧接口。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/fixtures.ts` | KEEP | Node/status 夹具；字段随 API 更新时同步。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/host-runtime.mjs` | UPDATE | F-016：书签持久化经 setting.set 后复核真实宿主断言。 | classic/Nodes 2.0 已运行 |
| `frontend/tests/host/assets-host.mjs` | KEEP | 真实宿主素材流程；字段随 §4 变更同步。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/equipment-host.mjs` | KEEP | 真实宿主设备流程，无旧字段。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/storage-host.mjs` | KEEP | 真实宿主存储流程，工作区搬迁保留。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/siril-host.mjs` | KEEP | 真实宿主 Siril 流程；标题迁移删除后无需断言旧标题。 | 沿用 chat1 审查；回归见测试报告 |
| `frontend/tests/host/siril-presentation.mjs` | UPDATE | F-008：删除“Siril · 旧标题”迁移断言，改为当前标题。 | 中英文及两种画布模式已运行 |


## 8. 验证计划与客观阻碍

### 8.1 离线验证（实现后）

```sh
uv sync --frozen
uv lock --check
uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py
uv run pytest tests/nodes tests/backend -q
uv run pytest tests/integration -m "not host" -q
uv run pytest tests/packaging -q
uv run --project mcp pytest mcp/tests -q
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend build
pnpm -C frontend test
pnpm -C frontend check:build
pnpm -C frontend check:proxy
uv run python -m scripts.api_inventory --output docs/api/inventory.json
uv run python scripts/render_api_reference.py
uv run pytest tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py -q
```

### 8.2 真实宿主验证（实现后）

1. `GET http://127.0.0.1:8188/system_stats` 确认 0.46.0 / 1.59.6，`custom_nodes/ComfyUI_AstroPhoto` 指向本仓库。
2. 检查 `GET /astrophoto/v1/storage/operations` 与导入/迁移队列，确认无活动任务后重启宿主。
3. 运行 `COMFYUI_TEST_URL=http://127.0.0.1:8188 uv run pytest tests/integration -m host -q`。
4. 运行 `pnpm -C frontend test:host`（必要时 `--nodes-2`）。
5. 分别记录真实宿主与离线结果；不得用构建成功代替功能验证。

### 8.3 客观阻碍/未验证

- Siril 1.4.5 本机未检出：`ASTROPHOTO_SIRIL_TEST_CLI` 相关真实 CLI 用例将 skip，不作为本次失败；离线单测/HTTP 用例仍需通过。
- 前端类型包/vendored 组件为 1.59.1，目标宿主 1.59.6：若 npm/上游无法提供 1.59.6 组件，需在实现阶段记录为版本阻碍，不能伪造升级。
- 真实 Desktop 端口锁、第二物理卷、Canvas Bridge 等不在本 Feature 范围；不宣称覆盖。
- 生成物必须在代码稳定后重建；手工修改生成页视为不合规。

### 8.4 完成前检查

- [ ] `AUDIT.md` 每项 CHANGE/DELETE/REGEN 有最终状态与验证结果。
- [ ] 旧接口/旧字段/旧配置键/旧迁移入口的全仓搜索为零（含测试夹具、动态引用）。
- [ ] `docs/` 与生成物与现行实现一致，历史段落标注历史属性。
- [ ] 离线全量与真实宿主结果写入 `TEST_REPORT.md`，失败项有复现命令与证据。



## chat2 实施状态 · 2026-11-25T12:58:36-06:00

F-chat1-001/022 的代码与局部测试已处理；F-chat1-002/003/005/006/007/017 部分处理，见 DEV-chat2-001。§6 和 §7 各行原判定为审计建议，除上述明确部分外均为待处理/待逐项复核，REGEN 待代码稳定后执行；不得将 READ 或 KEEP 当作本次验证通过。


### chat2 逐项状态修订 · 2026-11-25T13:38-06:00

§6/§7 新增实施状态列；原判定保留为审计历史。具体测试结果、跳过与环境限制以 TEST_REPORT 和 DEV-chat2-002 为准。


### chat2 宿主接口实测 · 2026-11-25T13:41:46-06:00

Frontend 1.59.6 的 `setting.set` 在被测 POST 返回 403 时正常完成，`setting.get` 返回乐观更新值而服务器持久值不变；网络拒绝则抛错。严格只用 get/set 无法检测该 403，待用户决定是否允许使用公开 `app.api.getSetting` 进行只读回读。该项和关联测试不得标为完全通过。

### chat2 复验 · 2026-11-25T13:51:29-06:00

F-chat1-016 已完成。§6 的书签实现及 §7 的宿主脚本均由 RUN-chat2-003 覆盖，替代此前 403 待决状态。

### chat2 审查整改同步 · 2026-11-25T14:55:17-06:00

上方 §4 和 §6 已核对 F-chat1-012、导入服务和脚本、素材服务及受影响调用方。以下为 §7 补充用例，沿用原 TC，验证见 RUN-chat2-005。

| 测试 | 处置 | 验证 |
| --- | --- | --- |
| `tests/integration/test_siril_api.py` · `test_formal_output_feeds_downstream_previews_before_and_after_collection` | UPDATE | 收录前候选和正式预览、收录后同一正式预览均通过。 |
| `tests/integration/test_photography_library.py` · `test_fixture_import_plans_calibration_master_with_canonical_field` | ADD | 脚本计划接入 HTTP，canonical 200、旧字段 422。实际生成夹具复测通过。 |
| `frontend/tests/components/AssetsLibrary.test.ts` · 校准主帧目录详情 | ADD | 从素材列表打开 calibration_master 详情，Chromium 通过。 |
| `frontend/tests/components/NodeCatalog.test.ts` · 跨页回读失败后恢复 | ADD | 仅发一次写入、保留服务器数据、恢复读取后刷新侧栏，Chromium 通过。 |
| `frontend/tests/host/host-runtime.mjs` · HTTP 403 后重试 | UPDATE | Classic 与 Nodes 2.0 通过。 |
| `tests/packaging/test_document_navigation.py` · `test_maintained_docs_exclude_retired_contracts` | ADD | 上轮补齐文档断言，本轮打包复测通过。 |
