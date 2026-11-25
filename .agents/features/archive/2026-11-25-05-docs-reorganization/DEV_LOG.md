# 文档重组 — DEV_LOG

初始化：chat1 · 2026-11-25T08:05:55-06:00

## 实现与决策历史

### DEV-chat1-001

- Chat: chat1
- Time: 2026-11-25T08:08:22-06:00
- Type: Implementation
- Task / FR/AC: TASK-chat1-001 / FR-chat1-001 AC-01–04
- Status: 实现完成；正式 Feature 验收未执行。
- 请求及结果: 按领域结构整理文档和导航；核对现行模型、MCP 本机权限、设备组合版本语义和历史验收边界；保留用户已有未提交改动。无业务代码变更。
- PRD 核对: 已确认需求未变。

#### Changed Files

| 仓库相对路径 | Action | 变化 |
| --- | --- | --- |
| docs/requirements.md → docs/product/requirements.md | Renamed / Modified | 修正能力状态和链接 |
| docs/architecture.md → docs/architecture/overview.md | Renamed / Modified | 更新侧栏、MCP 和链接 |
| docs/equipment.md → docs/domains/equipment.md | Renamed / Modified | 更新版本参数说明 |
| docs/local-storage.md → docs/domains/storage.md | Renamed / Modified | 标记历史章节及修复链接 |
| docs/siril.md → docs/domains/siril.md | Renamed / Modified | 标记历史验证及修复链接 |
| docs/mcp.md → docs/integrations/mcp.md | Renamed / Modified | 更新相对链接 |
| docs/development.md → docs/development/setup-and-testing.md | Renamed / Modified | 更新相对链接 |
| docs/publishing.md → docs/development/publishing.md | Renamed / Modified | 更新相对链接 |
| docs/README.md, docs/domains/assets.md | Added | 导航和素材领域规则 |
| README.md, AGENTS.md, mcp/README.md, benchmark/README.md | Modified | 更新导航和引用 |
| .agents/features/docs-reorganization/PRD.md, DEV.md, DEV_LOG.md, TEST_PLAN.md | Added | Feature 需求、计划、记录和验证计划 |

#### Local Verification

- Python 扫描 README、AGENTS、docs、MCP 及 benchmark README 的 Markdown 相对文件链接：0 个缺失；标题锚点静态扫描无异常。
- 素材注销场景：确认素材/存储/MCP 文件及 feature-pipeline 需求、开发、测试、知识参考可定位，知识选择约束存在；未执行独立 Agent 行为模拟。
- git diff --check 通过；Git 提示 mcp/README.md 行尾将按配置转换。

#### Untested / Next / Related TC

TC-chat1-001 至 003 为局部静态核查；未执行正式 Feature 验收、真实宿主或独立 Agent 行为联调。历史文档中保留的细节仍应按当前工作树逐项核实；Desktop 与第二物理卷仍未验证。

### DEV-chat1-002

- Chat: chat1
- Time: 2026-11-25T08:13:12-06:00
- Type: Investigation / Planning
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 AC-01–04
- Status: 只读代码核查与计划完成；后续清理及正式测试未执行。
- 结果: 依据当前源码、现有测试和文档盘点记录了六阶段计划和需核实边界。
- PRD 核对: 用户要求补充实施顺序，不改变现行产品需求。
- Changed Files: .agents/features/docs-reorganization/DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified；记录计划、调查与覆盖缺口）；无业务代码或 docs 修改。
- Local Verification: 源码及现有测试静态阅读；未运行测试，不宣称通过。
- Untested / Next: 按 TASK-chat1-002 执行逐章核验、变更及隔离联调。

### DEV-chat1-003

- Chat: chat1
- Time: 2026-11-25T08:18:00-06:00
- Type: Implementation / Local Verification
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 AC-01–04
- Status: 文档清理和静态检查完成；MCP 测试、真实 Agent 行为联调及正式验收未完成。
- 结果: 清理存储和设备旧实施矩阵、Siril 旧验收流水、架构/MCP/开发/发行旧审计；保留当前规则及历史验证边界，修正发行和预览目录说明。Siril 命令表的 201/183 数量与现有注册测试断言相符，未执行该测试。
- PRD 核对: 现行需求未变，无业务代码变化。
- Changed Files: docs/domains/equipment.md, docs/domains/storage.md, docs/domains/siril.md, docs/architecture/overview.md, docs/development/setup-and-testing.md, docs/development/publishing.md, docs/integrations/mcp.md, docs/product/requirements.md；.agents/features/docs-reorganization/DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified）。
- Local Verification: Python Markdown 相对文件链接和标题锚点扫描均无缺失；git diff --check 通过（Git 行尾提示）。.venv/Scripts/python.exe -m pytest tests/backend/test_agent_direct_rules.py tests/backend/test_equipment_simple.py -q -p no:cacheprovider：7 passed。mcp/tests/test_disclosure.py 两次运行长时间无输出后人工中止；tests/nodes/test_registration.py 一次无输出后中止；不算通过。
- 联调: 使用临时目录从六个 Skill 模板构造文件，检查素材注销相关文档入口及知识选择约束；这只是静态路由和模板检查，不是 Agent 实际行为评估。
- Untested / Next: 排查 MCP 和节点 pytest 停滞；完成真实 Agent 场景行为联调、逐章剩余内容核验和正式 Feature 验收。Desktop 和第二物理卷不属于本次环境覆盖。

### DEV-chat1-004

- Chat: chat1
- Time: 2026-11-25T08:24:56-06:00
- Type: Investigation / Fix / Local Verification
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 AC-01–04
- Status: 定向测试与导航检查通过；实际 Agent 行为联调及正式验收待完成。
- 结果: 诊断 pytest 卡住于 Windows asyncio 本地 socket 创建；沙箱外分别运行 MCP 分类与节点注册测试通过。清理 MCP 过时只读模块图、产品安全边界和预览历史日志，README 按当前本机业务能力修订。
- PRD 核对: 现行需求未变，无业务代码变化。
- Changed Files: README.md、docs/integrations/mcp.md、docs/product/requirements.md、docs/development/setup-and-testing.md；.agents/features/docs-reorganization/DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified）。
- Local Verification: 沙箱外分别运行 .venv/Scripts/python.exe -m pytest mcp/tests/test_disclosure.py -q -p no:cacheprovider：8 passed；同命令运行 tests/nodes/test_registration.py：1 passed。前次后端定向 7 passed 见 DEV-chat1-003。合并两个测试根目录的一次调用在 conftest 加载时发生 FastMCP ImportError；分别运行通过，不视为合并测试通过。14 份入口 Markdown 的相对路径与锚点扫描零缺失，git diff --check 通过（行尾提示）。
- Untested / Next: 隔离模板检查不等同实际 Agent 行为联调；正式 Feature 全量测试与用户验收未执行；历史内容仍需按目标用途检查，不宣称所有行为均已验证。真实 Desktop、双物理卷未覆盖。

### DEV-chat1-005

- Chat: chat1
- Time: 2026-11-25T08:25:46-06:00
- Type: Investigation / Local Verification
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 AC-02–04
- Status: 混合定向测试经预加载绕行通过；原导入失败根因未确定。
- Changed Files: .agents/features/docs-reorganization/DEV_LOG.md、TEST_PLAN.md（Modified）；无业务代码或 docs 变更。
- Local Verification: 在允许回环环境，Python 先 import fastmcp.server.server，再以 pytest.main 运行 tests/backend/test_agent_direct_rules.py、tests/backend/test_equipment_simple.py、tests/nodes/test_registration.py 和 mcp/tests/test_disclosure.py：16 passed，1 PytestAssertRewriteWarning（anyio 预加载）。常规混合命令及 importlib 模式均在加载 MCP conftest 时失败，根因未确认；各测试目录单独运行已通过。
- Untested / Next: 实际 Agent 行为联调及正式 Feature 验收仍未执行。

### DEV-chat1-006

- Chat: chat1
- Time: 2026-11-25T08:27:45-06:00
- Type: Decision
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 v2 AC-04
- Status: 用户明确实际 Agent 行为联调本次不执行；静态导航检查和限制保留。
- Changed Files: .agents/features/docs-reorganization/PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified）；无业务代码或 docs 修改。
- Local Verification: 复读范围修订；未运行测试。
- Untested / Next: 文档逐章核验及其他正式验证按原范围继续，历史测试结果不变。

### DEV-chat1-007

- Chat: chat1
- Time: 2026-11-25T08:30:12-06:00
- Type: Investigation / Documentation / Local Verification
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 v2 AC-01–03
- Status: 章节级对照与已发现过时内容修正；实际 Agent 行为联调按用户要求不执行。
- 结果: 根据 storage/locations.py 将架构和开发文档中的旧 UUID 默认路径改为 storage/Local；移除开发文档对已删除的两层交接的描述。建立 CONTENT_AUDIT.md，记录各章节关键依据和未实测范围。
- PRD 核对: 仅整理现行事实，无产品契约变化。
- Changed Files: docs/architecture/overview.md、docs/development/setup-and-testing.md（Modified）；.agents/features/docs-reorganization/CONTENT_AUDIT.md（Added）、DEV_LOG.md、TEST_PLAN.md（Modified）。无业务代码变更。
- Local Verification: 隔离临时数据运行 tests/backend/test_storage.py tests/backend/test_agent_direct_rules.py tests/backend/test_equipment_simple.py：53 passed, 2 skipped（第二本地卷）；tests/nodes/test_registration.py tests/integration/test_siril_api.py：3 passed；mcp/tests/test_disclosure.py mcp/tests/test_equipment.py：24 passed。git diff --check 通过，有既有行尾提示。
- Untested / Next: 各项为定向测试，不代表真实宿主、真实 Siril、Desktop 或第二物理卷完成验收；公共发布状态未查询。正式 Feature 验收仍需另行执行。

### DEV-chat1-008

- Chat: chat1
- Time: 2026-11-25T08:33:41-06:00
- Type: Test Suite
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 v2 AC-01–04
- Status: 已建设正式验证所需的文档入口测试，待执行 RUN。
- Changed Files: tests/packaging/test_document_navigation.py（Added，相对路径、标题锚点及 Feature skill 模板/参考入口）；.agents/features/docs-reorganization/DEV_LOG.md、TEST_PLAN.md（Modified）。
- PRD 核对: 用户要求完整正式 RUN，需求行为未变。
- Local Verification: 待正式运行；不得以存在测试文件视作通过。
- Untested / Next: TC-chat1-001、003 执行新测试；TC-chat1-002 对照内容审查并执行定向回归；实际 Agent 行为联调及外部硬件/发行实测按用户决定不在本次范围。

### DEV-chat1-009

- Chat: chat1
- Time: 2026-11-25T08:35:43-06:00
- Type: Scope Decision
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 v3
- Status: 正式 RUN 范围调整；节点及 Siril 开发、专项验证暂缓；MCP、存储、设备、素材和导航继续。
- Changed Files: .agents/features/docs-reorganization/PRD.md、DEV_LOG.md、TEST_PLAN.md（Modified）；无业务代码变化。
- Local Verification: 无；已开始的节点/Siril 测试结果只作历史记录，不计本次闭环。
- Untested / Next: 按修订范围继续定向及集成回归；不推断用户已接受其他未覆盖问题。

### DEV-chat1-010

- Chat: chat1
- Time: 2026-11-25T08:37:59-06:00
- Type: Formal Verification
- Task / FR/AC: TASK-chat1-002 / FR-chat1-001 v3 AC-01–04
- Status: RUN-chat1-001 已执行，等待用户验收；范围与限制见 TEST_REPORT。
- Changed Files: .agents/features/docs-reorganization/TEST_REPORT.md（Added）、DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified）；无业务代码变化。
- Local Verification: 本次范围 239 passed、2 skipped；详细测试与限制见正式报告。节点/Siril 专项和真实硬件按用户决定暂缓。
- Untested / Next: 用户验收；不要将章节审查或模拟环境结果扩大为真实部署验证。

### DEV-chat1-011

- Chat: chat1
- Time: 2026-11-25T08:51:51-06:00
- Type: Implementation / Local Verification
- Task / FR/AC: TASK-chat1-003 / FR-chat1-002 AC-01–05
- Status: 接口清单和 MCP Schema 初版已构建；HTTP 逐接口完整契约、逐工具错误和验证示例尚未完成。
- 结果: 隔离提取 105 个 HTTP 注册定义；MCP 自动/本机/远程配置分别 39/38/2 个业务工具。生成分类清单、输入及已声明输出 Schema，补充通用信任边界、业务操作差异、关键 HTTP 请求和 MCP/HTTP 主要映射；同步入口。未修改业务代码或访问用户数据库。
- Changed Files: docs/api/inventory.json、docs/api/README.md、docs/api/http/README.md、docs/api/http/routes.md、docs/api/http/catalog-contracts.md、docs/api/mcp/README.md、docs/api/mcp/connection.md、docs/api/mcp/equipment.md、docs/api/mcp/equipment_groups.md、docs/api/mcp/library.md、docs/api/mcp/projects.md、docs/api/mcp/storage.md（Added）；scripts/api_inventory.py、scripts/render_api_reference.py、tests/packaging/test_api_inventory.py（Added）；docs/README.md、AGENTS.md（Modified）；.agents/features/docs-reorganization/PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified）。
- Local Verification: 进程内 Schema 提取与渲染成功；tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py：5 passed；git diff --check 通过。测试覆盖路由定义、三种注册模式 MCP 输入/输出 Schema 与注解、生成页工具和输入 Schema、文档链接；不验证 HTTP 字段完整性或实际业务调用。
- PRD 核对: 新增 FR-chat1-002 已记录，逐接口完整性尚未达成；RUN-chat1-001 不覆盖新增需求。
- Untested / Next: 对所有本轮 HTTP 接口逐项补齐请求、返回、错误、副作用及受测示例；逐 MCP 工具补充错误/返回、源 HTTP 路由和隔离示例；核查旧接口状态、自动提取局限。旧 RUN 保留，不虚报完成。

### DEV-chat1-012

- Chat: chat1
- Time: 2026-11-25T08:52:46-06:00
- Type: Implementation / Local Verification
- Task / FR/AC: TASK-chat1-003 / FR-chat1-002 AC-01–05
- Status: 构建进行中；尚未达到全部逐接口契约验收。
- 结果: 为 HTTP 清单附加源码字段校验线索；每项 MCP 工具 Schema 附加源码定位。不能从静态线索推断完整请求或返回行为。
- Changed Files: scripts/api_inventory.py、scripts/render_api_reference.py、docs/api/inventory.json、docs/api/http/routes.md、docs/api/mcp/connection.md、equipment.md、equipment_groups.md、library.md、projects.md、storage.md（Modified）。.agents/features/docs-reorganization/DEV_LOG.md、TEST_PLAN.md（Modified）。无业务代码修改。
- Local Verification: 重新隔离生成快照与文档；tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py 5 passed。
- Untested / Next: 逐 HTTP 接口的完整请求/响应/错误/副作用和经验证示例、逐工具错误与具体 HTTP 链尚未完成；节点/Siril 专项和真实硬件按用户决定暂缓。

### DEV-chat1-013

- Chat: chat1
- Time: 2026-11-25T09:10:00-06:00
- Type: Scope Decision / Investigation
- Task / FR/AC: TASK-chat1-003、004 / FR-chat1-002 v2、FR-chat1-003 AC-01–03
- Status: v1 兼容边界及接续计划已记录。调查复验针对当前实现，v1 基线和接口退役尚未实施。
- 用户决定: 当前是 v1 首次构建。开发期接口和以前开发数据库不纳入兼容支持。节点/Siril 专项继续暂缓。
- 数据库调查: 数据库管理器校验并接受开发期 0001–0010，自动升级到 0011，新库也走同一链。0011 补齐旧导入组及目录归属。旧校准表独立记录存在目录聚合、按 ID 解析、编辑补建和项目引用回退。新建校准主帧仍使用 ImageResult 和 CalibrationMaster。legacy_attributes 还会在类型化导入中写出当前目录读取的 role/master_type 等字段，需先收敛当前读写。
- 接口调查: 四条旧 Agent 审批路由仍注册，未见现行仓库调用，MCP 使用 /library/catalog-import。两条旧暂存上传路由仍可配合 /assets/import 的 uploads 分支使用。未见拍摄会话、独立 GET /assets 和 GET /assets/{id}/availability 的现行产品调用。旧 /library 的 collections/projects/folders/masters/assignments/placements 已有 404 测试。现行引用导入仍用 /assets/import 及预检和任务路径，复制走 /library/direct-imports。任务页使用 retry-remaining，素材界面使用 /library/assets 及 /library/import-groups，Siril 正式结果收录还使用 POST /library/assets。
- 参数调查: 项目删除工具接受并转发旧确认及影响令牌，当前服务删除逻辑未读取这些参数，影响数量仍可查询。设备前端和 MCP 发送 expected_version，服务端使用读到的当前 row_version 做内部并发检查。移除无效参数需要同步调用方和 Schema。
- 接口文档调查: 快照共有 105 条 HTTP 定义，其中含 15 条暂缓科学/Siril 定义。MCP 分类工具自动/显式本机/显式非本机为 39/38/2，三个发现入口另计。MCP 输入 Schema 已提取，输出 Schema 未枚举具体响应字段。快照和导航检查 5 项通过。将 COMFYUI_URL 设为虚构地址 http://example.test 后，生成器的 auto 分组只剩 2 个工具，已复现环境依赖。以上数量属于当前调查基线。
- 依据: [数据库初始化](../../../../astrophoto/database/manager.py#L85)、[基准提交中的旧分组迁移](https://github.com/MaojieXu/ComfyUI-AstroPhoto/blob/e74e5109f273f406d57be8121ed25ed437f05bd3/astrophoto/database/migrations/versions/0011_legacy_subframe_groups.py)、[目录 API](../../../../astrophoto/api/catalog.py)、[素材库路由](../../../../astrophoto/api/library.py)、[导入界面](../../../../frontend/src/features/assets/ImportAssets.vue)、[生成器](../../../../scripts/api_inventory.py)、[Agent 管理需求](../2026-11-25-04-agent-asset-management/01_PRD.md)。
- Changed Files: .agents/features/docs-reorganization/PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md（Modified）。本轮实际修改为 Feature 文档。
- Local Verification: 前轮在允许本机回环的隔离环境使用 .venv Python 执行 tests/integration/test_photography_library.py 中的 test_frozen_database_upgrade_preserves_existing_data、test_retired_relationships_are_purged_and_routes_are_gone（两个参数）、test_legacy_calibration_master_project_reference_is_atomic、test_unified_calibration_master_import_binding_and_edit、test_direct_group_resumes_after_host_restart_and_preserves_project，共 6 passed。此为变更前调查证据，本轮未复跑业务测试。
- Untested / Next: v1 空库初始化、拒绝开发库且保留原文件、退役入口拒绝、调用方与签名一致性及重新生成的文档待实施后验证。仓库外开发客户端的调用情况未核实。RUN-chat1-001 保留原覆盖。


### DEV-chat1-014

- Chat / Time: chat1 · 2026-11-25T09:37:07-06:00
- Type: Implementation / API contract / Formal verification
- Task / FR: TASK-chat1-003、TASK-chat1-004 / FR-chat1-002 v2、FR-chat1-003 v2。
- Status: Implemented。正式结果见 RUN-chat1-002，Feature 待用户验收。
- 实施: 旧开发修订由 V1 首建基线替换。启动对已有文件先做只读探测，同时保留 Schema、实例身份、WAL 和完整性检查。退役旧审批、上传、会话和重复文件查询，保留现行参考导入、直传、维护和作业恢复。资料保存中的校准主帧与 ImageResult 使用相同身份，独立历史主帧的列表、编辑与项目回退已去掉。保留有有效消费方的文件级登记属性。新库只写现行受管目录布局和所有权；用途详见 DEV 处置清单。
- 客户端: 前端与 MCP 移除设备和组合的旧版本参数、项目删除的确认和影响令牌。项目影响查询仅计算当前数量。新版前端重新构建，既有仓库中节点/Siril 结果可通过现行素材路径登记。
- 文档: 路由定义 97 项，包含 15 项暂缓科学/Siril。HTTP 逐操作参考为 82 项。MCP 分类工具分别为自动 39、本机 38、非本机 2，另记 3 个发现入口。调整实际注册核验、生成环境隔离、契约、领域与发布说明。
- Changed Files:
  - Added: astrophoto/database/migrations/versions/0001_v1_baseline.py；docs/api/http/contracts.md、docs/api/mcp/contracts.md。
  - Deleted: astrophoto/database/migrations/versions/0001_equipment_baseline.py、0002_photography_library.py、0003_subframe_groups.py、0004_deleted_trains.py、0005_asset_catalog.py、0006_retire_legacy_library.py、0007_image_optical_binding.py、0008_master_capture.py、0009_asset_names.py、0010_collection_directories.py、0011_legacy_subframe_groups.py；astrophoto/assets/uploads.py。
  - Modified backend: astrophoto/api/assets.py、catalog.py、equipment.py、errors.py、library.py、routes.py；astrophoto/assets/catalog.py、direct_import.py、imports.py、library.py、library_rules.py、projects.py、service.py；astrophoto/bootstrap.py；astrophoto/database/catalog_models.py、manager.py、models.py；astrophoto/equipment/schemas.py、service.py、trains.py。
  - Modified frontend: frontend/src/api/equipment.ts；frontend/src/features/assets/CatalogProjects.vue、assets.css；frontend/src/features/library/pages/EquipmentPage.tsx、OpticalTrainEditor.tsx；frontend/src/i18n/locales/en/assets.json、zh/assets.json；js/main.js、js/assets/main.css（重建）。
  - Modified MCP: mcp/src/astrophoto_mcp/tools/catalog.py、equipment.py、projects.py；mcp/tests/test_equipment_names.py。
  - Modified tools and packaging: .comfyignore、scripts/api_inventory.py、scripts/render_api_reference.py、scripts/release.py。
  - Modified tests: tests/backend/test_agent_direct_rules.py、test_equipment.py、test_equipment_simple.py、test_storage.py、test_subframe_groups.py；tests/integration/test_equipment_api.py、test_library_mcp.py、test_photography_library.py、test_storage_api.py、test_storage_init.py、test_train_flat.py；tests/packaging/test_api_inventory.py、test_contents.py；frontend/tests/components/AssetsLibrary.test.ts、Library.test.ts；frontend/tests/host/assets-host.mjs、equipment-host.mjs。
  - Modified docs: AGENTS.md、docs/api/README.md、inventory.json；docs/api/http/README.md、catalog-contracts.md、routes.md；docs/api/mcp/README.md、connection.md、equipment.md、equipment_groups.md、library.md、projects.md、storage.md；docs/architecture/overview.md；docs/development/publishing.md、setup-and-testing.md；docs/domains/assets.md、equipment.md、siril.md、storage.md；docs/integrations/mcp.md；docs/product/requirements.md。
  - Modified Feature: .agents/features/docs-reorganization/PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md、TEST_REPORT.md。
- Verification: RUN-chat1-002 合计 309 passed、2 skipped。修复初轮发现的收录 UUID 依赖、注销内部入口、旧主帧测试夹具、旧库夹具的协调根及 Registry 的 benchmark 排除。测试环境中 MCP/扩展套件分别启动，Registry git 枚举与 MCP 构建也分开运行。Vue 类型检查、前端生产构建、定向 Ruff F 检查及 git diff --check 已核验。
- Untested / Next: 实际 Agent 行为、真实 ComfyUI Desktop、第二物理卷、节点/Siril 专项及公开发布未执行。API 参考由实际注册、源码和隔离回归核对，分支错误及示例并非均单独实测。归档未重写。

### DEV-chat2-001

- Chat / Time：chat2 · 2026-11-25T10:19:29-06:00。
- 类型 / 任务：独立审查记录 / TASK-chat2-001。
- 结果：按用户指定的 Chat ID 写入 [REVIEW-chat2-001](REVIEW.md#review-chat2-001)。6 项发现待处置。审查复现与验证范围见 REVIEW。
- 实际改动：`.agents/features/docs-reorganization/REVIEW.md` 新增，`.agents/features/docs-reorganization/DEV.md`、`.agents/features/docs-reorganization/DEV_LOG.md`、`.agents/features/docs-reorganization/TEST_PLAN.md` 更新。

### DEV-chat1-015

- Chat / Time：chat1 · 2026-11-25T10:30:16-06:00。
- 任务 / 需求：TASK-chat1-005，FR-chat1-001 v3 AC-04、FR-chat1-002 v2 AC-02/04、FR-chat1-003 v2 AC-01–03。按现行验收条件修复，PRD 无需修订。
- 状态：Implemented。处置 [REVIEW-chat2-001](REVIEW.md#review-chat2-001) 的六项发现，待独立复审。

| 关联发现 | 修复与验证 |
| --- | --- |
| REVIEW-chat2-001-001 | 启动时在隔离临时副本上读取已有的非空 WAL。使用主库尚未 checkpoint 的 V1 数据库验证重启，并核对 WAL 中旧版修订的识别及原数据库、WAL、SHM、外部源字节保护。 |
| REVIEW-chat2-001-002 | 删除端点只接受空对象。含 `confirmed` 或 `revision` 的请求在文件操作之前拒绝。浏览器调用随之更新，MCP 已发送空对象。隔离回归验证拒绝后文件和登记仍在，并验证有效删除后的登记回读。 |
| REVIEW-chat2-001-003 | 移除项目模块未使用的导入，并用设备组合更新的返回值断言归档相机的保留和移除。CI 范围 Ruff 通过。 |
| REVIEW-chat2-001-004 | 对照 HTTP 测试修订初始化的 `checks`、直传作业的 `entries[].workspace_id` 与项目循环的 `INVALID_LIBRARY_REFERENCE`。 |
| REVIEW-chat2-001-005 | 补齐 39 个业务工具和 3 个发现入口的隔离示例。各业务工具参考链接到独立示例，自动验证示例输入与运行时 Schema 一致。 |
| REVIEW-chat2-001-006 | DEV-chat1-013 的旧分组迁移引用固定到基准提交，使用 Git 核对该提交中的文件。导航检查覆盖活动 Feature 并识别 Markdown 行号锚点。本次修订由 chat1 写入。 |

- 本轮实际文件：
  - 后端：`astrophoto/database/manager.py`、`astrophoto/api/library.py`、`astrophoto/assets/library.py`、`astrophoto/assets/projects.py`。
  - 前端：`frontend/src/api/assets.ts`、`frontend/tests/host/assets-host.mjs`。重建 `js/main.js` 和 `js/assets/main.css`，构建前两者已有工作树改动。
  - 测试：`tests/backend/test_equipment.py`、`tests/backend/test_storage.py`、`tests/integration/test_direct_import.py`、`tests/integration/test_photography_library.py`、`tests/integration/test_storage_init.py`、`tests/packaging/test_api_inventory.py`、`tests/packaging/test_document_navigation.py`。
  - 文档与生成：`scripts/render_api_reference.py`、`docs/api/inventory.json`、`docs/api/http/contracts.md`、`docs/api/http/routes.md`、`docs/api/mcp/README.md`、`docs/api/mcp/connection.md`、`docs/api/mcp/equipment.md`、`docs/api/mcp/equipment_groups.md`、`docs/api/mcp/library.md`、`docs/api/mcp/projects.md`、`docs/api/mcp/storage.md`。新增 `docs/api/mcp/examples.md`。
  - Feature：`.agents/features/docs-reorganization/DEV.md`、`.agents/features/docs-reorganization/DEV_LOG.md`、`.agents/features/docs-reorganization/TEST_PLAN.md`、`.agents/features/docs-reorganization/TEST_REPORT.md`。
- 局部验证：仓库 Python 运行 `pytest tests/backend/test_storage.py tests/backend/test_equipment.py tests/integration/test_storage_init.py tests/integration/test_direct_import.py tests/integration/test_photography_library.py tests/integration/test_library_mcp.py tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py -q -rs --tb=short -p no:cacheprovider --basetemp .artifact/review-fix-tests`，110 passed、2 skipped（第二物理卷）。CI 范围 Ruff、Vue 类型检查与生产构建通过。 `pnpm -C frontend exec vitest run tests/components/AssetsLibrary.test.ts tests/components/Library.test.ts` 得到 66 passed。
- 验证过程：初次 Python 运行遇到沙箱临时路径过长及回环限制。用仓库下较短临时路径与可访问回环的验证进程复测。Playwright 改用本机已有的浏览器缓存，回环测试通过。纳入活动 Feature 后发现早期审查记录使用行号锚点，完善检查再复测。
- 待验证：独立复审和新正式 RUN 尚待执行。示例通过 Schema 校验，仍标为示意。真实 Desktop、实际 Agent、第二物理卷、节点/Siril 专项和公开发行沿用现有范围。

### DEV-chat2-002

- chat2 · 2026-11-25T10:40:03-06:00 · TASK-chat2-001。按用户指定身份写回[第二轮复审](REVIEW.md#review-chat2-002)。首轮 6 项均已核实修复，本轮 P1、P2 各 1 项待处理。
- 本次更新 `.agents/features/docs-reorganization/` 下的 `REVIEW.md`、`DEV.md`、`DEV_LOG.md` 和 `TEST_PLAN.md`。新增回归缺口关联 TC-chat1-004、005、006。复审的 15 项定向测试、Ruff 及隔离复现证据见 REVIEW-chat2-002。
- 用户要求今后正式审查和复审完成后主动同步 Feature。本次更新 `.agents/skills/feature-pipeline/SKILL.md`、`references/review.md` 和 `evals/trigger-cases.csv`（后两项相对于该 Skill 目录）。

### DEV-chat3-001

- Chat / Time：chat3 · 2026-11-25T10:45:39-06:00。
- 类型 / 任务：独立代码审查 / TASK-chat3-001。
- 需求依据：FR-chat1-001 v3、FR-chat1-002 v2、FR-chat1-003 v2。PRD 无变化，本轮无业务代码修改。
- 结果：按用户指定身份完成第三轮独立审查并写入 [REVIEW-chat3-001](REVIEW.md#review-chat3-001)。首轮 6 项独立复核为已修复；chat2-002 的 P1、P2 仍存在。新增 `REVIEW-chat3-001-001`（P1：目录类编辑/删除接受并忽略 `revision`，前端与契约仍按版本语义使用）和 `REVIEW-chat3-001-002`（P3：939 个未跟踪 `.artifact/` 文件未纳入忽略）。
- 快照：基准提交 `e74e5109f273f406d57be8121ed25ed437f05bd3` 加未暂存/未跟踪文件；`astrophoto`、`extension`、`nodes`、`mcp`、`scripts`、`tests`、`frontend/src`、`frontend/tests`、`docs` 与根入口 334 个文件的合并 SHA-256 为 `eb0e9b5b93d9aeaa6b56eedcddc3261f2a6303395de13a4949f9d9f171b98704`。
- 范围外记录：`.agents/archive`、`.agents/features/archive`、`.agents/handoff` 的删除与 `.agents/skills` 的重组不在本 Feature 的变更清单内（其中 feature-pipeline 入口部分见 DEV-chat2-002），归属未经确认，仅按工作树现状说明，未计为发现。
- Changed Files：`.agents/features/docs-reorganization/REVIEW.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`（Modified）。审查用的临时探针 `tests/integration/test_zz_chat3_probe.py` 与 `.artifact/review-chat3/` 已删除，不在工作树保留。
- Local Verification：CI 范围 `ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py` 通过。`pytest tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py tests/backend/test_storage.py::test_v1_reopens_with_schema_only_in_committed_wal -q`：8 passed。`pytest tests/integration/test_storage_init.py tests/integration/test_direct_import.py tests/integration/test_photography_library.py::test_copy_preview_snapshot_and_reference_independent_identity -q`：23 passed。隔离探针复现：项目、节点、video 的陈旧 `revision` 写入均返回 200；`ENOSPC` 模拟下 WAL 探测抛出 `OSError(28)`。
- Untested / Next：未重跑 RUN-chat1-002 的 309 项通过用例，正式 RUN 记录不变。两项新发现与 chat2-002 两项待实施 Chat 处置后再复审；节点/Siril 专项、真实 Desktop、第二物理卷和实际 Agent 行为沿用暂缓范围。

### DEV-chat1-016

- Chat / Time：chat1 · 2026-11-25T11:06:19-06:00。
- 任务 / 需求：TASK-chat1-006；FR-chat1-001 v3、FR-chat1-002 v2、FR-chat1-003 v3。用户明确开发期原数据库与原内容无需迁移或保护，PRD AC-01 已据此更新并保留修订历史。当前 V1 业务文件规则不变。
- 状态：Implemented，REVIEW-chat2-002-001/002 和 REVIEW-chat3-001-001/002 已按现行需求处置，待独立复审。
- 处理：素材属性写入只接收 attributes，素材注销只接收空对象，调用方同步。目录资源、组成员、项目和节点在提供 revision 时检查当前版本，项目及节点删除继续使用空对象。正常只读 SQLite 连接直接读取 WAL，不再创建整库副本。 `/.artifact/` 已忽略，删除 TASK-chat1-005 与本轮实际创建的审查测试目录，其他预览数据未清理。
- 测试和文档：补充项目/节点、视频/主帧/子帧组过期版本、素材无效字段与有效请求、V1 未 checkpoint WAL 重启、MCP 并发冲突重试。清单漂移检查按枚举集合比较，排除 Python Literal 缓存造成的顺序差异。HTTP 契约、开发期数据规则及需求记录已同步。
- Changed Files：
  - 后端与前端：`astrophoto/database/manager.py`、`astrophoto/assets/library.py`、`astrophoto/api/catalog.py`、`frontend/src/api/assets.ts`、`frontend/tests/host/assets-host.mjs`、`frontend/tests/components/AssetsLibrary.test.ts`、`js/main.js`、`js/assets/main.css`。
  - 测试：`tests/backend/test_storage.py`、`tests/backend/test_agent_direct_rules.py`、`tests/integration/test_storage_init.py`、`tests/integration/test_photography_library.py`、`tests/integration/test_library_mcp.py`、`tests/packaging/test_api_inventory.py`。
  - 规则和文档：`.gitignore`、`AGENTS.md`、`docs/api/http/contracts.md`、`docs/product/requirements.md`、`docs/domains/equipment.md`、`docs/domains/storage.md`、`.agents/features/docs-reorganization/PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`、`TEST_REPORT.md`。
- Local Verification：隔离运行 `pytest tests/integration/test_photography_library.py tests/integration/test_library_mcp.py tests/integration/test_direct_import.py tests/backend/test_storage.py tests/backend/test_agent_direct_rules.py tests/integration/test_storage_init.py -q -rs --tb=short -p no:cacheprovider`，105 passed、2 skipped（第二物理卷）。接口和导航测试 7 passed。前端两个组件文件 66 passed，Vue 类型检查和生产构建通过。CI 范围 Ruff 和 `git diff --check` 通过，Git 显示已有换行提示。
- 过程记录：早期运行发现旧测试仍期待接受陈旧版本，以及开发期 SHM 字节保持要求与新决定冲突。更新测试预期后复测通过。清单检查初次因枚举顺序不同失败，按枚举语义比较后复测通过。
- Untested / Next：第二物理卷、真实 Desktop、节点/Siril 专项、实际 Agent 和公开发行沿用暂缓范围。独立复审和新正式 RUN 尚未执行。

### DEV-chat1-017

- Chat / Time：chat1 · 2026-11-25T11:10:51-06:00。
- 类型：用户要求建立 CLOSE 阶段记录。根据现有需求、审查、测试及用户反馈整理阶段结论和 K-chat1-001–003 候选。最终正式 RUN、独立复审及不保留向后兼容的完整处置仍待完成。
- Changed Files：新增 `.agents/features/docs-reorganization/CLOSE.md`，更新本 DEV_LOG。无业务代码变化。
- Local Verification：核对 PRD、DEV、TEST_REPORT、REVIEW、知识沉淀指南及建议目标的现有内容。候选待用户选择。

### DEV-chat1-018

- Chat / Time：chat1 · 2026-11-25T11:12:31-06:00。
- 用户决定：K-chat1-001–003 不写入长期知识，并要求归档 Feature。保留未完成的正式 RUN、独立复审和兼容清理现状。
- Changed Files：更新 `.agents/features/docs-reorganization/CLOSE.md`、`DEV_LOG.md`，随后归档整个 Feature 到 `.agents/features/archive/2026-11-25-05-docs-reorganization/` 并修正移动后的相对链接。
