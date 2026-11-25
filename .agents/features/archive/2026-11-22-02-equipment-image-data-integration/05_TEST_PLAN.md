# 测试计划

## 1. 文档信息

| 项目 | 当前值 |
| --- | --- |
| Feature | `equipment-image-data-integration` |
| 计划版本 | v2.5（RUN-003 宿主验收完成；宿主脚本已对齐当前 UI；0001 升级用例已补） |
| 对应 PRD | [v0.19](01_PRD.md)（含 Q-01～Q-03 与 DEV-118 补充） |
| 对应 UXUI | [现行版](02_UXUI.md)（含确认卡差异/缺项与任务框重试说明） |
| 对应 TECH | [现行版](03_TECH.md)（含「复审修复后的执行、重试与摘要契约」） |
| 对应 DEV | DEV-001～DEV-118，见 [DEV_LOG](04_DEV_LOG.md) |
| 代码基线 | `1772bd5d12e2763212ff502e900ec981a6285700` 加 DEV-118 工作树；修复后清单 [DEV_118_FIX_INPUTS.json](DEV_118_FIX_INPUTS.json) |
| 维护与判定 | Main Agent 维护计划；正式执行、PASS/FAIL 与证据归 `06_TEST_REPORT.md`（当前未创建） |
| 当前状态 | 已设计；RUN-002 自动化与 RUN-003 隔离宿主通过；剩余阻断见 §13 与 TEST_REPORT

本文件只描述**应该测什么、怎么测、什么算通过**。任何未在 TEST_REPORT 中登记的执行结果都不代表已通过；DEV_LOG 中的局部自检仅用于定位，不作为验收结论。

## 2. 测试目标与范围

目标：

1. 覆盖 AC-01～AC-28，关键数据一致性与授权边界优先。
2. 验证宿主、扩展后端、业务库、存储布局与独立 MCP 使用同一批业务 ID 和规则。
3. 验证 FITS 科学数据在登记、复制、迁移与读取中保持精度和元数据（AC-05、AC-28）。
4. 验证失败可诊断、可恢复、可幂等重放，不产生部分写入或重复发布（AC-10、AC-26、AC-27）。
5. 为 TEST_REPORT 提供可执行的入口、夹具与证据要求。

范围内：FR-01～FR-07；Vue 侧栏/设置/任务框；扩展后端服务与路由；SQLite 结构与迁移；存储布局与迁移；MCP 工具、授权与聊天确认；宿主通知适配。

范围外：ComfyUI 核心引擎与节点执行正确性（另由既有节点测试覆盖）；Siril 算法正确性（只验证调用、诊断与错误传播）；第三方 Agent 客户端的实现细节；容量规划与压力测试；企业级安全扫描与远程部署；像素级视觉回归基线。

## 3. 测试策略

| 层次 | 对象 | 工具与入口 | 说明 |
| --- | --- | --- | --- |
| 单元/服务 | 设备、组合、素材规则、计划器、存储服务、迁移 | `pytest tests/backend` | 隔离 SQLite 与临时目录 |
| HTTP 集成 | 公开路由、授权、状态码、回执 | `pytest tests/integration`（aiohttp 进程内 TestServer） | ComfyUI 注册边界为替身 |
| MCP | 工具发现、参数、错误、授权 | `pytest mcp/tests`（FastMCP Client，进程内） | 生产为 stdio；另列 stdio 联调 |
| 前端组件 | 侧栏、设置、导入、任务框、通知 | `vitest`（Chromium headless） | 真实 DOM 与浏览器行为 |
| 宿主脚本 | 真实 8188 挂载、持久化、画布 | `frontend/tests/host/*.mjs` | 需真实宿主 |
| 验收 | 端到端、真实宿主、跨盘、旧库 | TEST_REPORT 的 RUN | 人工与脚本结合 |

优先级：

- **P0**：数据不可逆写入、科学数据完整性、授权与审批、迁移/发布一致性。
- **P1**：主要功能、关键集成、常见异常与恢复。
- **P2**：文案、命名、布局与低频边界。
- **P3**：低影响观察项。

设计技术：等价类（导入模式、设备类型、素材类型）、边界值（配额、分页、超时、字段长度）、状态迁移（提案→批准→导入→绑定→重试；作业→暂停/取消/完成）、决策表（授权域 × 操作；组合冲突/缺项）、错误猜测（崩溃点、重复提交、并发）。

自动化优先；视觉布局、真实宿主行为、跨物理盘与真实 Agent 客户端保留人工验收。测试实现不得以 Mock 结果替代真实宿主结论（见 §11）。

## 4. 需求覆盖矩阵

Coverage 语义按规范：Design 为 Missing/Planned/Designed；Implementation 为 Not Implemented/Implemented/Ready/Blocked。`Blocked` 表示缺少真实宿主、跨盘或旧库夹具，而非实现缺失。

| AC | FR | 主要 TC | 优先级 | Design | Implementation |
| --- | --- | --- | --- | --- | --- |
| AC-01 设备 CRUD 真实界面 | FR-01 | TC-009、TC-010、TC-114 | P0 | Designed | Implemented（真实宿主待 RUN） |
| AC-02 组合保存/归档设备引用 | FR-02 | TC-114 | P1 | Designed | Implemented |
| AC-03 删除组合/历史引用/归档恢复 | FR-02 | TC-114、TC-114-R1、TC-114-R2 | P0 | Designed | Implemented |
| AC-04 素材登记与关系回读 | FR-03 | TC-115 | P0 | Designed | Implemented |
| AC-05 回执/重复/缺失与科学精度 | FR-03 | TC-115、TC-115-R1、TC-020 | P0 | Designed | Implemented |
| AC-06 MCP 设备/组合 CRUD | FR-04 | TC-117 | P0 | Designed | Implemented |
| AC-07 分组提案与逐组批准 | FR-04 | TC-117、TC-117-R1～R6、TC-119、TC-122 | P0 | Designed | Implemented（R1～R3/R5）；R4/R6/TC-119/TC-122 为 Proposed |
| AC-08 全链路联合验收 | 全部 | TC-117-R7 | P0 | Designed | Blocked（真实宿主与客户端） |
| AC-09 首建工作区与三类写入 | FR-05 | TC-116、TC-120、TC-020、TC-115 | P0 | Designed | Implemented（启动锁超时为 Proposed） |
| AC-10 发布中断与重试一次 | FR-05 | TC-116-R2、TC-113 | P0 | Designed | Implemented |
| AC-11 离线工作区 | FR-05 | TC-116-R3、TC-012 | P1 | Designed | Blocked（外置卷与宿主） |
| AC-12 旧库升级 | FR-06 | TC-116 | P0 | Designed | Blocked（0001 副本未备；0002/0003 已覆盖） |
| AC-13 缺失库/身份冲突 | FR-06 | TC-116、TC-116-R1 | P0 | Designed | Implemented（MCP 侧为 Proposed） |
| AC-14 位置登记顺序与路径规则 | FR-07 | TC-006、TC-111、TC-054 | P1 | Designed | Implemented |
| AC-15 隐藏数据根展示 | FR-07 | TC-007 | P2 | Designed | Implemented |
| AC-16 设备/组合命名 | FR-01 | TC-009 | P2 | Designed | Implemented |
| AC-17 表单基础/高级分组 | FR-01 | TC-010 | P1 | Designed | Implemented |
| AC-18 隐藏导入策略摘要 | FR-03 | TC-011 | P2 | Designed | Implemented |
| AC-19 单张/批量导入 | FR-03 | TC-020、TC-118 | P1 | Designed | Implemented（预检失效两终态为 Proposed） |
| AC-20 项目添加已有素材 | FR-03 | TC-050 | P1 | Designed | Implemented |
| AC-21 项目文件夹树 | FR-03 | TC-060 | P1 | Designed | Implemented |
| AC-22 项目树拖拽与拒绝 | FR-03 | TC-070 | P1 | Designed | Implemented |
| AC-23 设置首页入口 | FR-01～03 | TC-080 | P2 | Designed | Blocked（仅宿主） |
| AC-24 项目统一树 | FR-03 | TC-090 | P1 | Designed | Implemented |
| AC-25 宿主通知与页内回退 | FR-03～07 | TC-100、TC-111 | P1 | Designed | Implemented（适配层）；真实宿主与计次为 Planned |
| AC-26 删除位置并迁移 | FR-05～07 | TC-110、TC-121、TC-014-R1、TC-123 | P0 | Designed | Implemented（崩溃点断言待补） |
| AC-27 侧栏全局任务进度 | FR-03/05 | TC-112、TC-112-R1 | P1 | Designed | Implemented |
| AC-28 子帧成组与多盘直写 | FR-03/05/06 | TC-113、TC-113-R1 | P0 | Designed | Implemented（模拟）；真实双 SSD 与 1000 帧为 Proposed |

## 5. 测试环境

| 组件 | 版本与来源 | 用途 |
| --- | --- | --- |
| Python | 3.12.16（`uv run python -V`） | 后端与集成测试 |
| ComfyUI 宿主 | Backend 0.46.0、Frontend 1.59.6，隔离 `.venv`（[开发文档](../../../../docs/development.md)） | 宿主脚本与验收 |
| 前端依赖 | Vue 3.5、Vite 8、Vitest 5.1、Playwright 1.65、pnpm 11.13.1（`frontend/package.json`）；本机 Node v26.13.1 | 组件与浏览器 |
| MCP | FastMCP 4.2.0、mcp-types ≥2.3（`mcp/pyproject.toml`、`uv.lock`） | 工具与协议 |
| 数据库 | SQLite + SQLAlchemy 2 + Alembic（0001～0004） | 结构、迁移与并发 |
| 测试框架 | pytest 8.4（根与 `mcp/` 各自配置）、Vitest | 执行入口 |

执行入口（命令均已核实存在于仓库配置；实际运行状态见 TEST_REPORT）：

| 范围 | 命令 |
| --- | --- |
| 后端与 HTTP 集成 | `uv run pytest tests/backend tests/integration -q` |
| 仅后端 | `uv run pytest tests/backend -q` |
| 真实宿主状态/注册 | `$env:COMFYUI_TEST_URL='http://127.0.0.1:8188'; uv run pytest tests/integration -m host` |
| MCP | `uv run --project mcp pytest mcp/tests -q` |
| 前端组件 | `pnpm -C frontend test`（先 `vite build`，再 Chromium headless） |
| 宿主侧栏脚本 | `pnpm -C frontend test:host`、`test:equipment-host`、`test:storage-host`；素材宿主脚本用 `node frontend/tests/host/assets-host.mjs`。RUN-003 直接在隔离 8188 上以 `node` 运行并通过 |

环境变量（均在隔离 RUN 中设置，不入仓库）：

| 变量 | 用途 | 已核实来源 |
| --- | --- | --- |
| `COMFYUI_TEST_URL` | 宿主 pytest 与 Playwright 目标 | `docs/development.md:90` |
| `ASTROPHOTO_TEST_STORAGE_ROOT`、`ASTROPHOTO_TEST_SECOND_VOLUME` | 存储与跨盘脚本 | `docs/development.md:147` |
| `ASTROPHOTO_TEST_ASSETS_ROOT`、`ASTROPHOTO_TEST_ASSET_SOURCE` | 素材宿主脚本 | `docs/development.md:165` |
| `ASTROPHOTO_TEST_EQUIPMENT_RUN` | 设备宿主脚本 | `frontend/tests/host/equipment-host.mjs:10` |
| `ASTROPHOTO_HOME`、`ASTROPHOTO_IMPORT_ROOTS`、`ASTROPHOTO_LOCAL_STORAGE` | 宿主数据根与授权 | `docs/development.md:142` |
| `ASTROPHOTO_LIBRARY_TOKEN`、`ASTROPHOTO_EQUIPMENT_READ_TOKEN`、`ASTROPHOTO_EQUIPMENT_WRITE_TOKEN`、`ASTROPHOTO_APPROVAL_TOKEN`、`ASTROPHOTO_TRUST_CHAT_APPROVALS` | MCP 授权与聊天确认 | `mcp/tests/conftest.py`、`docs/mcp.md` |
| `ASTROPHOTO_BASELINE_WORKFLOW`、`ASTROPHOTO_MIGRATION_EVIDENCE` | 迁移宿主脚本 | `docs/development.md:89` |

环境约束：

- 端口固定 `http://127.0.0.1:8188/`，不得自行切换；占用时先确认进程与工作流状态。
- 根 pytest 不收集 `mcp/`、`frontend/`；MCP 使用独立入口与 dev 依赖。
- 跨卷用例在缺少 `ASTROPHOTO_TEST_SECOND_VOLUME` 时会 `pytest.skip`（`tests/backend/test_storage.py`）。跳过的用例不得计入通过；RUN 必须单独记录 skipped 名单及原因。
- 宿主脚本会写入或回滚真实数据根（`assets-host.mjs`、`storage-host.mjs`）；每次 RUN 使用新的 `ASTROPHOTO_TEST_*` 目录标识与隔离数据根。
- 设备持久化用两阶段重启：`--prepare-restart` → 重启宿主 → `--verify-restart`（见 `docs/development.md` 设备段）。
- 前端测试使用真实 Chromium；未安装浏览器时不得宣称交互用例通过。
- 本机业务 API 要求直接回环、单用户、未启用 CORS。

## 6. 测试数据与夹具

| 夹具 | 来源 | 隔离与清理 | 局限 |
| --- | --- | --- | --- |
| `extension` | `tests/conftest.py` | `tmp_path`，重定向 `HOME`/`USERPROFILE` | V3 宿主替身按 0.45.0 签名构造，不代表真实导入成功 |
| `host` / `runtime` | 各测试文件内定义（`test_direct_import.py:27`、`test_agent_imports.py:31`、`test_agent_import_plan.py:16`） | 临时数据根；用例结束由 pytest 清理 | 各自定制，不共享 |
| `coordinated_storage_app` | `tests/integration/test_storage_api.py:22` | 临时数据根与 TestServer | 进程内 HTTP，非真实宿主 |
| `service` | `tests/backend/test_storage.py` | 临时工作区与 SQLite | 单进程 |
| MCP `server` | `mcp/tests/conftest.py` | 清除五个凭据环境变量 | 构造时不连接 HTTP |
| 前端 host 替身 | `frontend/tests/host.ts`、`frontend/tests/host/fixtures.ts`、`tests/setup.ts` | 每用例重置 | 不含真实宿主样式 |
| FITS/科学数据 | 用例内以 astropy 生成小样本 | `tmp_path` | 不代表真实相机全字段 |

正式 RUN 另需：新建数据根、0001/0002/0003 旧库副本（脱敏）、离线位置、双物理 SSD 拓扑、1000 帧子帧集（含同名异内容）、真实 Agent 客户端（legacy 与现代原生确认）。样本与真实数据的对应关系须在 RUN 记录中说明。

## 7. 测试用例

约定：按领域分组，编号保留历史顺序；每条用例给出关联、优先级、级别与执行方式；`状态` 只表示设计与实现的准备度。所有“预期”均为判定标准，不得以实际实现反推降低。错误码仅在本计划或 TECH 明确要求时作为断言，其余作为回执证据记录。

### 7.1 设置与存储

#### TC-001 配置入口及设置

关联 FR-07/AC-15；P1；System。执行：`frontend/tests/host/storage-host.mjs` 与宿主人工。

- 前置：隔离数据根、可写工作区。
- 步骤：打开 Settings，确认只有一个「配置」入口；进入后核对预览分辨率与存储管理；修改并保存，重载；检查中英文标题与描述；返回后再次进入。
- 预期：入口唯一；两区均可见可操作；保存值重载后保持；无数据根展示区。
- 证据：截图、请求/响应、`settings.json` 摘要。

#### TC-002（已并入 TC-001）

导入页的存储设置入口与返回导航作为 TC-001 的步骤；保留编号与历史关联。

#### TC-003 错误与回归

关联 AC-14/AC-15、DEV-001～004；P2。

- 步骤：分别模拟存储与预览设置加载失败；检查版本冲突、工作区登记与导入模式；分别修改导入方式与预览分辨率。
- 预期：两块错误与重试各自独立，另一部分仍可用；同页表单使用最新共享版本。
- 执行：`StorageSettings.test.ts`（03-B/03-C）、`AssetsLibrary.test.ts`；宿主见 `storage-host.mjs`。

#### TC-004（已并入 TC-055）

预览分辨率的位置、紧凑布局与窄侧栏表现归 TC-055；保存、重载与冲突归 TC-001。保留编号与 DEV-002 关联。

#### TC-005（已并入 TC-001）

预览分辨率自动保存、失败恢复与冲突刷新作为 TC-001 的保存子步骤；组件实现在 `StorageSettings.test.ts`。

#### TC-006 工作区依次登记与存储设置精简

关联 FR-07/AC-14；P1。

- 步骤：顺序新增两个名称与字母序相反的位置；重载核对；用无效路径提交；检查隐藏项。
- 预期：均追加到底部且顺序稳定；无效路径保留草稿；整库搬家/缓存管理/清理说明不可见。
- 执行：`StorageSettings.test.ts`、`test_storage_api.py::test_location_policy_http_and_ordered_capacity`。

#### TC-007 配置页数据根展示

关联 FR-07/AC-15、DEV-005；P2。执行：`StorageSettings.test.ts`（03-A）。

- 预期：无数据根路径、来源或数据库状态；导入方式、位置列表与新增入口仍可用。

#### TC-008（已并入 TC-014）

位置入口、表单、导入界面与错误提示的文案一致性作为 TC-014 的核对项；保留 DEV-006 关联。

#### TC-012 存储位置排序、限额与自动选择（原 TC-008）

关联 AC-14/AC-26、DEV-010～013；P1。

- 前置：同卷与跨卷多个位置，设置名称与上限。
- 步骤：调整顺序并重启；制造首项离线/只读/空间不足/达限额；并发预检与受理；缩额到低于已用量；升级旧配置；检查在途任务目标固定。
- 预期：新任务按序选首个可用位置；回执显示目标与原因；全部不可用返回明确原因；空间与额度预留不超卖；缩额不破坏已受理任务。
- 执行：`test_storage.py::test_location_priority_quota_and_reservation`、`test_import_planner.py`、`test_storage_api.py::test_location_policy_http_and_ordered_capacity`；真实跨卷待 RUN。

#### TC-014 存储位置菜单和状态（原 TC-010）

关联 AC-14/AC-26、DEV-013；P1。

- 步骤：中英文与窄侧栏检查菜单、路径展开、绿/红点与文字、键盘操作、排序与容量编辑、受保护移除。
- 预期：常态隐藏路径、展开可见；状态颜色与文字一致；菜单可用键盘；移除受保护位置被拒绝并说明原因。
- 证据：截图、请求与错误码。

#### TC-014-R1 移除非默认且无排序/额度记录的位置（DEV-118）

关联 AC-14；P1；Integration。执行：`test_storage_api.py::test_http_storage_import_and_access_boundary`。

- 步骤：记录设置版本；移除该位置；以原版本 PATCH 设置。
- 预期：设置版本不变；PATCH 成功；位置实际移除。

#### TC-015（已并入 TC-012）

拖动与菜单排序均属 TC-012 的排序一致性场景；组件实现在 `StorageSettings.test.ts`。

#### TC-055 配置项紧凑布局

关联 DEV-056；P2。执行：`StorageSettings.test.ts` 与宿主双语/窄侧栏。

- 预期：导入方式选项整行可点、可键盘操作；标题与返回同行；窄屏不截断。

#### TC-054 非空目录登记与系统选择

关联 AC-14；P1。执行：宿主人工 + `test_storage_api.py::test_native_picker_authorization_and_selection`。

- 步骤：用空目录、含原文件目录、含非空 `AstroPhoto` 子目录分别登记；取消系统窗口；禁用系统窗口。
- 预期：登记到预期路径、原文件保留、冲突可见；取消保留表单；回退网页浏览可用。

#### TC-111 新增位置的路径校验与重复通知

关联 AC-14/AC-25、DEV-111；P1。

- 前置：父目录同时包含数据根与普通空子目录；每次只点击一次保存，记录完整输入、请求次数、响应码、通知次数与操作后的列表。
- 判定依据：PRD AC-14 的路径规则与 AC-25 的通知可用性；错误码仅作为回执证据记录，不作为单独通过条件。

| 输入或操作 | 预期 |
| --- | --- |
| 名称「桌面」，路径 `C:\` | 拒绝登记（卷根不可用），保留草稿与原列表；记录实际错误码（DEV-111 现场为 `INVALID_STORAGE_PATH`） |
| 选择包含数据根的父目录 | 拒绝登记（与数据根重叠），不自动创建受管目录，原文件与列表保持；DEV-111 现场为 `STORAGE_PATH_CONFLICT` |
| 改选与数据根互不包含的可写空目录 | 登记成功，重载后指向所选目录（非空规则见 TC-054） |
| 同一错误做一次与两次独立提交 | 核对一次点击只产生一次登记请求；通知条数与请求的对应关系作为观察项记录。若通知多于请求，先区分重复提交、重复渲染与多次独立操作，写入 TEST_REPORT 的 Finding |

状态：Design=Designed，Implementation=Not Implemented（无专项自动化），Execution=Not Run。DEV-111 的截图属开发观察，不构成本用例结果。

### 7.2 设备与设备组合

#### TC-009 设备页面命名

关联 FR-01/AC-16、DEV-007；P2。执行：`equipment-host.mjs`、`AssetsLibrary.test.ts`、双语人工。

- 预期：入口「设备」、页面「我的设备」「设备组合」；英文 Equipment / My Equipment / Equipment Groups；素材属性字段同步。

#### TC-010 设备表单基础与高级分组

关联 FR-01/AC-17、DEV-008；P1。

- 步骤：四类设备分别新增与编辑；仅填名称保存；填写高级字段（含相机读出模式、滤镜通带）保存并重载；制造高级字段校验错误。
- 预期：基础区字段正确、高级区默认折叠且全部可达；校验错误自动展开并保留输入；双语与键盘可用。
- 执行：`test_equipment.py`（参数化 CRUD）、`Library.test.ts`（高级字段与折叠）。

#### TC-114 设备与组合持久化与引用保护

关联 AC-01～03、AC-16～17、DEV-110；P0。

- 前置：四类设备、一个不完整组合、一条已关联素材、第二条未引用组合；`ASTROPHOTO_TEST_EQUIPMENT_RUN` 指向新建目录。
- 步骤：新增/编辑/重名/归档/恢复/旧版本修改；向已归档设备新增引用；移除旧引用；删除已引用组合；同名新建；删除后读取历史素材；用 `test:equipment-host --prepare-restart` 写入后重启同一数据根，再执行 `--verify-restart`（可选 `--verify-delete`）。
- 预期：重名被拒且原记录不变；归档设备不可新增引用但可保留或移除旧引用；删除释放名称、列表隐藏、历史素材仍解析旧 ID；归档恢复保持原 ID。
- 执行：`test_equipment.py::test_equipment_lifecycle_and_optional_specs`、`::test_archived_components_can_be_retained_or_removed_but_cannot_be_added`、`test_equipment_api.py::test_equipment_mcp_crud_and_chat_deletion_against_public_http`、`equipment-host.mjs`。
- 证据：界面、HTTP、素材原引用与数据库记录。

#### TC-114-R1 组合删除的版本重放（DEV-118）

关联 AC-03；P1；Backend。执行：`test_equipment.py`（删除与墓碑用例）。

- 步骤：删除后以陈旧版本重放；以删除时版本（`row_version - 1`）重放。
- 预期：陈旧版本 `REVISION_CONFLICT`；删除时版本幂等成功；墓碑与历史引用不变。

#### TC-114-R2 组合删除后的新关联与归档路径（补 AC-03 覆盖）

关联 AC-03/AC-07；P1；Integration/Manual。

- 步骤：删除组合后打开素材编辑的新关联选择；同名新建组合；归档设备后恢复；再删除其组合。
- 预期：新关联只列正常记录；同名新建获得新 ID；历史素材仍读旧 ID；归档恢复不复活已删除组合。

### 7.3 素材与项目

#### TC-011 素材导入策略摘要

关联 FR-03/AC-18、DEV-009；P2。执行：`AssetsLibrary.test.ts`（导入页）。

- 预期：不显示继承策略与首选位置摘要；导入采用当前设置；设置入口与不可用提示可用；复制预检显示实际位置。

#### TC-118 预检失效的两种终态（AC-19/AC-10）

关联 AC-19/AC-10、DEV-020；P1；Integration。

- 前置：复制模式、单个小文件、隔离数据根。
- 步骤：(a) 预检后修改 `imports.default_mode` 再启动；(b) 预检后把过期时间改到过去再启动。
- 预期：(a) `REVISION_CONFLICT`；(b) `PREVIEW_EXPIRED`；两者均零资产、零暂存、无 `direct_import` 作业行。
- 执行：`tests/integration/test_direct_import.py`（新增；仓库现无 `PREVIEW_EXPIRED` 用例）；证据：错误码、`Asset`/`AssetLocation` 与暂存目录计数。

#### TC-020 单张与批量导入

关联 FR-03/AC-19、DEV-020/022；P1。

- 步骤：检查两个入口在两种模式下的行为；单张选择与替换；批量多文件/文件夹、分类与项目；不指定分类与项目；未保存返回保护；配置变化后的预检失效。
- 预期：复制模式点击即开系统选择，登记模式进入服务端路径；单张只能一个文件；批量分类/项目应用到全部；不指定也可导入；预检失效要求重新预检。
- 执行：`AssetsLibrary.test.ts`（single/batch import、native picker）、`test_storage_api.py` 导入路由、`test_import_planner.py`。

#### TC-021 存储位置目录选择

关联 DEV-021/023；P2。执行：`StorageSettings.test.ts::folder browser…`、`test_storage_api.py::test_browse_directories_requires_local_authorization`。

- 预期：目录面板可进出并填入路径；取消保留原值；空目录、无权限、无效路径、非受信来源、网络卷与链接按规则处理；选择与保存按钮同行且窄屏可用。

#### TC-030 素材标签顺序

关联 FR-03、DEV-030；P2。执行：`AssetsLibrary.test.ts`（top-level tabs）。

- 预期：「全部素材」「项目」顺序固定；点击与方向键按显示顺序；切换内容正确。

#### TC-031（Obsolete）

跨磁盘批量登记列表已由 DEV-053 移除，不再有对应界面。跨盘单目录登记由 TC-054 覆盖，顺序与路径规则由 TC-012/TC-111 覆盖。保留编号与 DEV-053 追溯。

#### TC-040 素材顶部操作精简

关联 FR-03/FR-04、DEV-040；P1。执行：`AssetsLibrary.test.ts`（菜单）。

- 预期：顶部无更多操作菜单及四项跳转；已选素材可创建集合；导入与筛选正常；审批走 MCP 流程（TC-117）。

#### TC-041（已并入 TC-021 与 TC-054）

网页目录浏览仍用于新增位置与 Reference 路径，已由 TC-021 统一覆盖；原生系统选择器由 TC-054 与 TC-052 覆盖。保留编号与 DEV-041 关联。

#### TC-050 项目添加已有素材

关联 FR-03/AC-20、DEV-050；P1。

- 步骤：准备多项目、已登记素材、项目文件夹与集合；搜索、分页、多选；提交已添加项；删除一个所选素材后提交。
- 预期：提交后可见；已添加项禁用；重复提交不改原位置；删除导致整体失败并保留选择，恢复后可重试。
- 执行：`AssetsLibrary.test.ts::project adds selected existing assets…`、`test_photography_library.py`。

#### TC-051 素材源路径浏览

关联 FR-03、DEV-051；P1。执行：`AssetsLibrary.test.ts`（Reference 路径）、`test_storage_api.py::test_browse_directories_requires_local_authorization`。

- 预期：单文件与批量文件夹路径正确、预检与确认正常；原文件绝对路径登记；磁盘/面包屑/取消/不可读/授权拒绝/原件移动/空文件夹/窄屏均按规则。

#### TC-052 Windows 原生路径选择

关联 DEV-052；P2。执行：8188 本机交互桌面人工。

- 预期：文件与目录选择、中文路径、取消、切回焦点、并发请求、超时、网页回退与授权均正确；其他平台回退可用。

#### TC-060 项目文件夹树内管理

关联 FR-03/AC-21、DEV-060；P1。执行：`AssetsLibrary.test.ts::project folders can be created…`。

- 预期：根与多层子文件夹创建、重命名、回车/Esc、重载层级正确；删除含子文件夹与素材关联时提示、取消与确认正确，磁盘文件保留；双语、键盘与模板可用。

#### TC-070 项目文件树交互

关联 FR-03/AC-22、DEV-070；P1。执行：`AssetsLibrary.test.ts::project folder context menu and drag moves…`。

- 步骤：未选中与选中时创建目录；右键菜单；拖到其他目录与根；拖到自身/后代/其他项目；同名、版本冲突、网络失败与取消。
- 预期：父级正确；子树、素材关联与原件不变；非法拖放被拒且数据不变；失败保留原层级并反馈；双语与窄屏可用。

#### TC-090 项目统一树

关联 FR-03/AC-24、DEV-090/091；P1。执行：`AssetsLibrary.test.ts::project roots expand independently…`、`Library.test.ts` 的菜单部分。

- 预期：多项目同时展开；搜索命中子项并显示祖先；右键与菜单操作正常；根与同项目拖动成功且无多余提示；跨项目与循环被拒；刷新后关系保持；箭头复用、双语、键盘与窄屏正常。

### 7.4 导入执行、直传与迁移

#### TC-115 素材属性、科学文件和校准关联

关联 AC-04/AC-05、DEV-115；P0。

- 前置：含元数据的 FITS 与对应校准主帧各一；一份登记、一份副本、一条已登记但路径缺失的素材。
- 步骤：将素材关联设备、组合、项目及适用校准主帧；刷新后用公开接口读取同一批 ID 与关系；再次提交同一来源并检查预检与回执；制造版本冲突与缺失文件；对照原件、受管副本与头字段。
- 预期：界面、公开接口与库记录返回同一批 ID 与关系；同一来源重复提交按现有回执或 `DUPLICATE_ASSET` 处理，不新建重复记录；版本冲突与缺失文件可处理；原件保留；FITS 头字段与字节精度不变（细化见 TC-115-R1）。
- 执行：`tests/integration/test_photography_library.py`、`frontend/tests/host/assets-host.mjs`。
- 证据：关系表、预检与回执、原件与副本摘要。

#### TC-115-R1 FITS 精度与元数据不被改写（AC-05）

关联 AC-04/AC-05；P0；Integration。

- 前置：16-bit 与 32-bit FITS 各一（含 `BSCALE`/`BZERO`、`EXPTIME`、`GAIN`、`CCD-TEMP`）。
- 步骤：登记与复制各一份；比对登记前后 SHA-256；逐项读取 `BITPIX`、`NAXIS*`、`BSCALE`、`BZERO`、`EXPTIME`、`GAIN`、`CCD-TEMP`。
- 预期：文件摘要一致；头字段逐项相同；无静默量化或重写；副本与原件一致。
- 执行：`tests/integration/test_photography_library.py`（新增断言）；证据：前后摘要与头字段 diff。

#### TC-013 并发任务与目标固定（原 TC-009）

关联 AC-10/AC-12、DEV-012；P1。执行：`test_import_planner.py`、`test_storage.py` 并发段落。

- 步骤：多个导入同时预检与受理；额度在受理前后变化；首次目标失效；同盘多位置共享实际空间；Siril 输出与未知大小。
- 预期：容量预留、任务目标与失败原因一致；已受理任务目标固定；同盘写入串行。

#### TC-110 删除位置并迁移素材

关联 D-18/AC-26、DEV-110；P0。

- 前置：三个位置；源含项目内 Copy 素材、正式输出、Reference 原件与未登记文件；记录源目录文件数与应用数据根内的组数。
- 步骤：尝试删除最后一个位置与自身目标；取消；选择第三位置确认；重启后继续未完成迁移再执行一次 Copy 导入；注入限额不足、写满、校验失败、同名冲突、源离线、文件缺失、迁移中重复请求，以及在直传写入意图存在时删除同一位置。
- 预期：受管文件逐字节迁移且素材 ID 不变；项目关联有效；目标目录文件数等于受管组数（无重复）；源目录只剩未登记文件；外部引用零变化；不覆盖同名；失败保留可读文件与记录；取消零写入；默认位置始终有效；有写入意图时返回 `STORAGE_BUSY` 而不是进入迁移。
- 失败分码：源离线 `WORKSPACE_OFFLINE`；文件缺失 `WORKSPACE_FILES_MISSING`；需恢复 `RECOVERY_REQUIRED`；删除默认位置时 `DEFAULT_WORKSPACE_REQUIRED`（无目标）。
- 执行：`test_storage_api.py::test_delete_migrates_local_library_and_preserves_references`、`::test_delete_collision_keeps_registered_source_and_can_retry`、`::test_removal_migration_is_visible_before_delete_returns`、`::test_http_active_migration_target_cannot_be_removed`、`test_storage.py` 的迁移重启与写入意图用例。
- 证据：迁移前后摘要、素材 ID、目标/源文件计数、项目关联、回执。

#### TC-121 迁移崩溃点矩阵（AC-26）

关联 AC-26、DEV-110；P0；Backend。

- 前置：源含 3 个受管文件 + 1 个 Reference + 1 个未登记文件，目标为空。
- 步骤：分别在“复制第 2 个后”“发布第 2 个后”“root 切换后”终止进程，再 `initialize` 并等待恢复。
- 预期：续做同一目标；目标文件数等于受管组数且无重复；素材 ID、`relative_key` 与项目关联不变；Reference 与未登记文件字节不变；无残留 `cleanup_pending`。
- 执行：`tests/backend/test_storage.py`（迁移重启用例补断言）；证据：文件计数、ID 映射表、操作回执。

#### TC-112 侧栏全局任务进度

关联 AC-27、DEV-114；P1。

- 步骤：准备多文件引用导入、复制直传、位置迁移与两个目标位置；检查隐藏/折叠/展开、并发与超过 16 条活动任务；第 17 个受理被拒；切换页面、关闭侧栏、刷新；注入一帧失败、空间不足、断网与部分成功；直传切页后返回；清除终态。
- 预期：阶段、数量、进度与结果正确；未知总量不显示虚构百分比；一帧失败且无活动传输时作业为 `paused`，错误可读且可重试，不得伪报为 `completed`；刷新后从服务端恢复；第 17 个活动作业返回 `STORAGE_BUSY`；清除只影响本会话，`storage_operations`/`direct_import` 行不变；不改变素材 ID、项目关联与迁移结果。
- 执行：`TaskPanel.test.ts`、`DirectTransfer.test.ts`、`test_storage_api.py::test_operation_list_reports_live_import_and_migration_without_storage_scan`、`test_direct_import.py`。

#### TC-112-R1 取消遇位置移除（DEV-118）

关联 AC-27；P1；Integration。执行：`test_direct_import.py::test_cancel_finishes_after_its_location_was_removed`。

- 步骤：写入意图存在时移除其位置；取消任务。
- 预期：作业收敛为 `cancelled`；写入意图清除；错误回执仍可读。

#### TC-123 重试被拒的三个分支（AC-10）

关联 AC-10/AC-19；P1；Integration。

- 步骤：(a) 无失败帧时调 `retry-remaining`；(b) 失败后将 `settings.json` 版本 +1 再重试；(c) 将目标位置置离线后重试。
- 预期：分别为 `NO_RETRYABLE_FILES`、`REVISION_CONFLICT`、目标不可用错误；三者均不新增作业行、不修改原回执、不复制文件。
- 执行：`tests/integration/test_direct_import.py` 与 `tests/backend/test_storage.py`（新增）；证据：错误体、作业表行数、回执 diff。

#### TC-113 子帧组、目标卷直写和多盘并行

关联 AC-28、DEV-113；P0。

- 前置：1000 张可逐字节核对的子帧（含同名异内容）、一张主帧、一个视频、原库快照；同卷两个位置与两个独立物理 SSD；记录源设备、目标卷、容量与限额。
- 场景与取证：

| 场景 | 核对与取证 |
| --- | --- |
| 预检、确认、受管布局 | 预检只有清单；确认后同卷暂存、逐帧发布；业务根无整批中转；默认整组同目录；主帧与视频独立；原件字节一致 |
| 多位置与多盘 | 仅写入入选位置；同盘串行、独立盘可重叠；配额、剩余空间与预留正确 |
| 成员与兼容 | 1000 个稳定 ID、同组、原帧序；各位置计数之和等于组内受管成员数且等于 `asset_import_frames` 行数；单帧检索/预览/删除/项目引用正常；旧库升级与迁移后 ID/相对位置/内容不变 |
| 故障与续传 | 传输/发布/提交处中断、离线、同名、重复 PUT、超时、取消、重载、并发；已完成帧保留，重试只传未完成原文件；同键不同清单返回 `IDEMPOTENCY_CONFLICT`；同一链路重复写入被拒为 `STORAGE_BUSY` |
| 吞吐量 | 原中转、单盘直写、双盘直写依次运行；记录总字节、耗时、持续 MiB/s、环境与重复次数；模拟多卷只验证调度与一致性 |

- 执行：`test_subframe_groups.py`、`test_import_planner.py`、`test_direct_import.py::test_parallel_writes_and_reassignment_keep_order`、`::test_retry_only_failed_frame_and_recover_after_publish`；真实双盘与吞吐待 RUN。

### 7.5 数据根与迁移

#### TC-113-R1 拓扑不可判定时保守串行（AC-28）

关联 AC-28；P1；Integration。

- 前置：两个位置无法判定是否同物理盘（无盘符信息或同一伪装卷）。
- 步骤：开启多盘并行导入并记录每次写入的起止时间与目标卷标识。
- 预期：写入区间不重叠；无跨卷并发；结果字节一致。
- 执行：`test_import_planner.py::test_shared_volume_budget_and_overlapping_or_unresolved_hardware`、直传时间序列日志。

#### TC-116 数据根首建、旧库升级与恢复

关联 AC-09～13、DEV-110/116；P0。

- 步骤：空数据根首建；在 0001、0002、0003 副本上启动目标构件；核对 schema 0004、实例身份、工作区、素材相对路径与业务 ID；检查 Copy/Reference/正式输出/离线位置/恢复；模拟发布中断并重启。
- 预期：首建可用；升级保留 ID 与关系；`expected_schema()` 比对的索引与触发器（含 `ix_asset_import_frames_group_id`）与目标 revision 一致；发布中断可续且只发布一次；身份不符、缺库、未知结构报可诊断错误并保留原文件。
- 执行：`tests/backend/test_storage_init.py`、`tests/integration/test_storage_init.py`、`test_direct_import.py::test_missing_publication_checkpoint_restages_from_the_browser`、`::test_startup_reconciles_partial_stage_and_interrupted_cancel`。
- 证据：升级前后库快照与查询、文件摘要、错误状态。

### 7.6 MCP 与联合验收

#### TC-116-R1 异常数据根下 MCP 与实际可用性一致（AC-13）

关联 AC-13；P0；Integration。

- 前置：身份冲突、缺库、未知结构三个独立夹具。
- 步骤：分别启动，调用设备查询与素材库工具，并读取界面状态。
- 预期：MCP 与界面返回一致的失败状态；无可诊断性之外的写入；原文件保留。
- 执行：`tests/integration/test_storage_init.py`、`mcp/tests/test_library.py`；证据：脱敏错误体、文件清单哈希。

#### TC-116-R2 发布动词幂等（AC-10）

关联 AC-10；P0；Integration。

- 步骤：在发布提交点中断；重启后按原回执重试；比对目标目录文件数、登记数与摘要。
- 预期：每条目恰好一个文件与一条登记；摘要与原件一致；不产生重复发布。
- 执行：`tests/integration/test_direct_import.py`；证据：回执、目录列表、摘要。

#### TC-116-R3 离线工作区与重定位（AC-11）

关联 AC-11；P1；System/Manual。

- 步骤：断开外置卷；分别读取设置页与素材页状态；重连后重新定位同一素材。
- 预期：两入口状态同源；登记与引用保留；恢复后按原 ID 打开同字节文件。
- 执行：`frontend/tests/host/storage-host.mjs` 与人工；证据：两页截图、素材 ID、摘要。

#### TC-120 启动锁超时与重复初始化（AC-09/AC-13）

关联 AC-09/AC-13；P1；Backend。

- 前置：隔离数据根；另一进程持有 `runtime/locks/bootstrap.lock`。
- 步骤：调用 `initialize`；释放后重试；同进程再次 `initialize`。
- 预期：首次返回 `STORAGE_BUSY` 且 `database/assets.db` 不存在或结构未半初始化；释放后成功且 `instance_id` 稳定；二次启动复用同一实例身份，`ensure_layout()["created"] == []`。
- 执行：`tests/backend/test_storage_init.py`（新增）；证据：错误体、数据根文件清单、实例身份。

#### TC-117 真实宿主与独立 MCP 联合链路

关联 AC-06～08；P0。

- 前置：正式构件、隔离宿主（8188）、独立 MCP（stdio）、新建数据根与旧库副本。
- 步骤：用缺失/无效/单域/双域授权检查工具发现与错误；Settings 创建设备与组合；Assets 登记并组织素材；客户端按业务 ID 查询设备、组合历史、素材与项目；执行 Q-01 CRUD；重启后复核。
- 预期：授权域隔离、缺少授权零写入；Settings 与 MCP 的 ID、数据、版本一致；重名、引用保护与归档规则一致；重启后记录不变。
- 执行：`test_library_mcp.py`、`test_equipment_api.py`、`mcp/tests/test_equipment.py`、`mcp/tests/test_library.py`、`test_agent_imports.py`；真实宿主与 stdio 待 RUN。
- 证据：去凭据的请求/响应、副作用、界面回读。

##### TC-117-A 提案到期（REVIEW-001 F-02）

- 前置：100 条未到期提案与一条无期限旧提案。
- 预期：活动队列满时 `STORAGE_BUSY`；到期后查询为 expired 且不可应用；可提交新提案；业务记录未变。
- 执行：`test_library_mcp.py`。

##### TC-117-B 混合素材与聊天内分组确认

- 前置：不同目标、滤镜、组合的 Light 子帧，Dark/Flat 校准素材；唯一名称匹配、名称歧义、缺 FITS 头、兼容失败、已有明确校准组。
- 步骤：逐组批准、拒绝、暂缓；重放批准；改变组内容；用普通提案凭据代批；用不支持确认的客户端。
- 预期：仅批准组写入预期项目、设备、组合与校准关系；主帧 ID 与审批时一致；其余操作零额外写入。
- 执行：`test_library_mcp.py::test_mixed_group_chat_approval_applies_only_the_approved_group`、`test_agent_imports.py::test_independent_approval_same_group_replay_and_binding_retry`、`::test_changed_preview_source_or_targets_require_new_approval`。

##### TC-117-C 执行与恢复

- legacy 与现代客户端批准/拒绝/取消，再用无确认能力客户端；核对凭据、摘要变化与重放无法额外写入。
- 导入后第二条校准关系失败：整组绑定回滚，素材文件/项目/ID/回执保留；解除后仅重试绑定并核对两个主帧；原路径不可访问时不得复制。
- 批准写入后、作业入队前退出：重启核对批准与作业关联、未导入组不被绑定、重复源返回原记录。
- **固定版本示例**（口径 C）：提案时相机 `cam-7` 为 `row_version=3`；批准并复制完成后、绑定前把相机改名（版本 4）。预期：两条绑定 `failed`、`REVISION_CONFLICT`、组 `binding_failed`，返回 `requires_new_approval: true`，素材与回执保留；`retry-bindings` 仍可调用并再次尝试（`row_version` 单调递增，实际不会成功）；该字段在重试成功后消失。
- 执行：`test_agent_imports.py::test_approved_intent_recovers_after_restart_and_skips_existing_asset`、`::test_ordinary_token_cannot_also_be_configured_as_approver`、`test_library_mcp.py::test_group_confirmation_comes_from_chat_elicitation`（legacy 与现代两种确认）。

##### TC-117-R6 组摘要内容与未匹配项（AC-07）

关联 AC-07；P1；Integration/Manual。

- 前置：AC-07 混合素材夹具，含缺 FITS 头与名称歧义各一。
- 步骤：提交计划后在聊天与 `GET /library/agent-imports/{id}` 逐组比对：数量、目标项目、设备/组合、校准关系、未匹配或待补项。
- 预期：五项均存在且与输入逐条对得上；未匹配项独立成组，不进入任何批准单元；组内容不可变。
- 执行：`tests/integration/test_agent_imports.py`（新增断言）与一次人工聊天核对；证据：脱敏提案 JSON、截图、组计数表。

##### TC-117-R7 全链路串联联合验收（AC-08）

关联 AC-08；P0；System。

- 前置：同一交付基线；新建数据根与 0003 旧根副本各一；记录宿主、前端与 MCP 版本。
- 步骤：每个数据根依次执行 on_load 初始化 → Settings 建设备与组合 → Assets 登记并关联素材 → MCP 查询 → MCP 获准写入 → 界面查回；逐 ID 对账界面、公开 API、`storage/<workspace>/` 实物与 `assets.db`；重启后复查代表记录。
- 预期：四侧 ID 与引用一致；重启后代表记录与文件不变；产出新建根与旧根并列的联合报告。
- 执行：`tests/integration/test_storage_init.py` 与 `test_library_mcp.py` 串联脚本，加 8188 人工复核；证据：对账表、路径清单、摘要、重启前后查询。

##### TC-117-R1～R5（DEV-118 复审修复）

关联 AC-03/AC-06/AC-07/AC-14/AC-26/AC-27。

| 编号 | 场景 | 预期 | 执行 |
| --- | --- | --- | --- |
| R1 | 已批准分组一帧 `FILE_COPY_FAILED`，任务框重试未完成帧 | 组 `partial`→`completed`；两帧均绑定原批准；`retry_operations` 可查；每帧恰 1 个受管文件、`asset_import_frames` 2 行且帧序唯一 | `test_agent_imports.py::test_failed_frame_retry_keeps_the_group_binding`（补文件与帧行计数断言） |
| R2 | 显式主帧存在曝光/温度差异或缺 `GAIN`/`CCD-TEMP` | 提案不被拒；确认卡分列 `conflicts` 与 `unknown`；批准后绑定且属性与主帧一致；无差异时摘要不出现空 `differences` 键 | `test_agent_import_plan.py::test_explicit_calibration_differences_are_reported_and_confirmed`、`::test_missing_calibration_cards_are_reported_separately_from_conflicts` |
| R3 | `TELESCOP` 匹配不完整组合且用户显式给出 | 不报冲突；显示“配置缺项”；绑定使用该组合；显式组合字段非空且不一致时仍报 `MATCH_CONFLICT` | `test_agent_import_plan.py::test_incomplete_optical_train_reports_missing_fields_instead_of_conflict` |
| R4 | 批准后容量不足/离线，随后恢复 | 保持 `approved` 并带可重试错误；`library_retry_group_bindings` 可重启；确定性错误仍 `import_failed` | 无现有用例（`agent_imports.py` 的可重试启动分支无断言） |
| R4 | 批准后容量不足/离线，随后恢复 | 保持 `approved` 并带可重试错误；`library_retry_group_bindings` 可重启；确定性错误仍 `import_failed` | `test_agent_imports.py`（启动失败路径）；宿主注入待 RUN |
| R5 | 缺授权、重名、引用删除经 MCP 返回 | 含受限 `details.fields`（如 `name=duplicate`），不含凭据与路径 | `mcp/tests/test_equipment.py::test_validation_reasons_reach_the_agent_without_leaking_credentials` |

#### TC-119 批准后源变更与冻结指纹（AC-07/AC-10）

关联 AC-07/AC-10；P0；Integration。实现：`test_agent_imports.py::test_source_change_after_approval_keeps_the_frozen_fingerprint`。

- 前置：两帧已批准组，第一帧可复制；批准后、复制前改写第二帧内容。
- 步骤：启动 → 观察逐帧回执 → `retry-remaining` → 再次观察；再对改动源重新提案。
- 预期：首帧 `copied` 并绑定原批准；第二帧 `SOURCE_CHANGED` 失败、组 `partial`；该错误不在可重试集合，`retry-remaining` 返回 `NO_RETRYABLE_FILES`；不得以新内容静默重绑旧批准；改动源需重新提案。
- 证据：字节摘要前后对比、回执、素材计数。

#### TC-122 组内跳过源的终态与计数（AC-07）

关联 AC-07/AC-28；P1；Integration。实现：`test_agent_imports.py::test_approved_intent_recovers_after_restart_and_skips_existing_asset`（`partial` 与 `skipped=1`）。

- 前置：登记（Reference）模式；组内两帧，`Light_0001.fit` 为新文件，`Light_0002.fit` 已登记为素材 `old-2` 且指纹一致；批准内容为项目 `P`、相机 `C` 和批准属性。复制模式不会产生 `skipped`，另测重复复制。
- 步骤：批准 → 等待组进入终态 → `GET /library/agent-imports/{id}` → 读取 `old-2` 的项目与属性 → 调用 `retry-bindings` → 再次读取。
- 预期（已确认口径 A）：
  - 新帧：`registered=1`（登记模式），加入 `P`，绑定 `C`，属性按批准写入。
  - 已登记帧：`skipped=1`，**不加入 `P`、不写入属性、不绑定 `C`**；素材 `old-2` 的属性与项目关系保持不变。
  - 组：`imported=1`、`skipped=1`、`remaining=0`、`bindings=1`，状态 `partial`；返回 `skipped_assets: [{"asset_id": "old-2", "reason": "ALREADY_REGISTERED"}]`；`retry-bindings` 不改变计数与 `partial`。

- 证据：组状态 JSON、`old-2` 属性/项目 diff、回执。

### 7.7 通知与入口

#### TC-080 设置首页入口

关联 AC-23、DEV-080；P2。执行：宿主人工。

- 预期：仅显示设备、软件管理、配置且顺序正确；四个已移除入口不可见；分别进入并返回正常。

#### TC-100 宿主通知和上下文错误

关联 AC-25、DEV-100/101；P1。

- 步骤：触发节点创建/失败、收藏失败、画布操作、项目拖放失败、设备保存与操作失败；覆盖共享错误、导入校验、配置冲突、Siril 设置与命令、FITS 节点与绘图恢复。
- 预期：宿主通知与页内可恢复信息同时可用；同一事件不重复提示；加载进度与空状态不弹通知；通知接口不可用时有回退。
- 执行：`AssetsLibrary.test.ts::host notification adapter…`、`::detailed library errors notify the host…`；真实宿主待 RUN。

## 8. 自动化实现映射

状态：`Implemented` 表示已有可执行回归；`Ready` 表示命令与环境已就绪；`Blocked` 表示缺真实宿主/跨盘/旧库。函数名均取自当前仓库。

| TC | 测试文件::函数 | 状态 | 命令 |
| --- | --- | --- | --- |
| TC-001/004/005/055 | `frontend/tests/components/StorageSettings.test.ts` | Implemented（组件）；布局为 Blocked | `pnpm -C frontend test` |
| TC-011/019/020/040/050/060/070/090/100 | `frontend/tests/components/AssetsLibrary.test.ts`（含 `project adds…`、`project folders…`、`project roots…`、`host notification adapter…`） | Implemented（真实宿主 Blocked） | 同上 |
| TC-009/010/114 | `tests/backend/test_equipment.py::test_equipment_lifecycle_and_optional_specs`、`::test_archived_components_can_be_retained_or_removed_but_cannot_be_added`；`frontend/tests/components/Library.test.ts`（高级字段与折叠） | Implemented（后端与组件） | `uv run pytest tests/backend -q`、`pnpm -C frontend test` |
| TC-114（HTTP） | `tests/integration/test_equipment_api.py::test_equipment_mcp_crud_and_chat_deletion_against_public_http` | Implemented | `uv run pytest tests/integration -q` |
| TC-006/012/014/015/054 | `tests/backend/test_storage.py::test_location_priority_quota_and_reservation`、`tests/integration/test_storage_api.py::test_location_policy_http_and_ordered_capacity`、`StorageSettings.test.ts`（排序与拖动） | Implemented（模拟）；真实跨卷 Blocked | `uv run pytest tests/integration -q`、`pnpm -C frontend test` |
| TC-111 | 无专项自动化；`test_storage.py:199` 仅覆盖 `STORAGE_PATH_CONFLICT` | Proposed | — |
| TC-013/TC-113（计划与调度） | `tests/backend/test_import_planner.py`、`tests/backend/test_subframe_groups.py` | Implemented | `uv run pytest tests/backend -q` |
| TC-110 | `tests/integration/test_storage_api.py::test_delete_migrates_local_library_and_preserves_references` 等 | Implemented | `uv run pytest tests/integration -q` |
| TC-112 | `frontend/tests/components/TaskPanel.test.ts`、`DirectTransfer.test.ts` | Implemented | `pnpm -C frontend test` |
| TC-112/113（直传） | `tests/integration/test_direct_import.py` | Implemented | `uv run pytest tests/integration -q` |
| TC-116 | `tests/backend/test_storage_init.py`、`tests/integration/test_storage_init.py`（含 0001 升级）、`tests/backend/test_subframe_groups.py`（0002/0003） | Implemented（RUN-003） | `uv run pytest tests/backend tests/integration -q` |
| TC-116-R1/R2/R3 | `tests/integration/test_storage_init.py`、`test_direct_import.py`、`frontend/tests/host/storage-host.mjs` | R2 Existing；R1/R3 Proposed | 同上 |
| TC-118（预检失效） | `tests/integration/test_direct_import.py::test_preview_expiry_and_revision_conflict_leave_no_job` | Implemented | `uv run pytest tests/integration -q` |
| TC-120（启动锁） | `tests/backend/test_storage_init.py::test_bootstrap_lock_timeout_and_restart_reuse_identity` | Implemented | `uv run pytest tests/backend -q` |
| TC-121（迁移崩溃点） | `tests/backend/test_storage.py::test_migration_recovers_around_database_switch`、`::test_partial_migration_requires_explicit_smallest_overshoot_and_cleans_source` | Implemented | 同上 |
| TC-123（重试被拒） | `tests/integration/test_agent_imports.py::test_retry_rejects_completed_groups_and_changed_settings` | Implemented | `uv run pytest tests/integration -q` |
| TC-119 / TC-122（源变更 / 跳过终态） | `tests/integration/test_agent_imports.py::test_source_change_after_approval_keeps_the_frozen_fingerprint`、`::test_approved_intent_recovers_after_restart_and_skips_existing_asset` | Implemented | `uv run pytest tests/integration -q` |
| TC-117 | `tests/integration/test_library_mcp.py`、`test_agent_imports.py`、`mcp/tests/*` | Implemented | `uv run pytest tests/integration -q`、`uv run --project mcp pytest mcp/tests -q` |
| TC-117-R1/R2/R3/R5 | `test_agent_imports.py::test_failed_frame_retry_keeps_the_group_binding`、`test_agent_import_plan.py`（三项）、`mcp/tests/test_equipment.py::test_validation_reasons_reach_the_agent_without_leaking_credentials` | Implemented | 同上 |
| TC-117-R4/R6/R7 | R4：`test_agent_imports.py::test_retryable_start_failure_keeps_the_approval`；R6：`::test_group_plan_summary_and_unresolved_are_separate`；R7 无现有用例 | R4/R6 Implemented；R7 Proposed | `uv run pytest tests/integration -q` |
| TC-114-R1 | `tests/backend/test_equipment.py`（墓碑/删除） | Implemented | `uv run pytest tests/backend -q` |
| TC-014-R1 | `tests/integration/test_storage_api.py::test_http_storage_import_and_access_boundary` | Implemented | `uv run pytest tests/integration -q` |
| TC-001/003/004/005/054/080/100/111 | `frontend/tests/host/storage-host.mjs`、`assets-host.mjs` | Implemented（RUN-003） | `node frontend/tests/host/storage-host.mjs`、`node frontend/tests/host/assets-host.mjs` |
| TC-009/052/080/117 | `equipment-host.mjs` 两阶段重启；TC-052/TC-117 仍为人工/真实客户端 | TC-009/080 已执行；052/117 Blocked | `node frontend/tests/host/equipment-host.mjs --prepare-restart` → 重启 → `--verify-restart` |

`Proposed`（尚未实现，需在 TEST_REPORT 前补齐或被明确接受）：TC-111 的卷根拒绝与请求/通知计数；TC-116 的 0001 副本夹具；TC-113 的 1000 帧实文件、双盘与吞吐（现有 `test_direct_import.py:49` 仅覆盖 1000 条清单）；TC-117-R7；TC-116-R1/R3。

## 9. 集成与回归计划

| 变更域（DEV-110～118） | 受影响 | 必跑回归 |
| --- | --- | --- |
| 导入作业与重试（N-01） | `assets/imports.py`、`storage/operations.py`、`agent_imports.py` | `test_agent_imports.py`、`test_direct_import.py`、`test_storage_api.py` |
| 分组提案与匹配（N-02/N-03） | `assets/agent_import_plan.py`、`assets/library.py`、MCP 摘要 | `test_agent_import_plan.py`、`test_library_mcp.py`、`mcp/tests/test_library.py` |
| 启动失败可重试（N-04） | `agent_imports.py` 状态机 | `test_agent_imports.py`、MCP 状态查询 |
| 直传取消（N-05） | `direct_import.py` | `test_direct_import.py` |
| 错误透传（N-06） | `mcp/api/equipment.py`、`api/library.py` | `mcp/tests/test_equipment.py`、`test_library.py` |
| 依赖声明（N-07） | `mcp/pyproject.toml`、`uv.lock` | `uv run --project mcp pytest mcp/tests -q` |
| 组合删除（N-08） | `equipment/trains.py` | `test_equipment.py`、`test_equipment_api.py` |
| 设置版本（附带） | `storage/locations.py` | `test_storage_api.py`、`test_storage.py` |

回归原则：以 DEV-118 清单为界，优先直接相关模块；共享接口（公开 HTTP、MCP 工具 schema、`settings.json` 版本）任一变化都触发对应集成用例；不因局部修改要求全量真实宿主回归，但正式 RUN 必须覆盖 §4 的 P0。

## 10. Entry & Exit Criteria

进入正式执行（TEST_REPORT）前：

- [ ] 独立审查门禁完成，阻断 Findings 已修复并复核；代码状态可由 `DEV_118_FIX_INPUTS.json` 识别。
- [ ] 真实 8188 隔离宿主可用，端口未被无关进程占用；前端构件与源码一致。
- [ ] MCP 独立进程可启动，授权域凭据与确认令牌按 Q-03 配置。
- [ ] 旧库副本（0001/0002/0003）与新建数据根就绪，来源与脱敏方式已记录。
- [ ] 双物理 SSD、1000 帧夹具、真实 Agent 客户端（legacy 与现代）就绪。
- [ ] 前端依赖可安装并可运行浏览器测试（当前分析环境未安装 pnpm，需在 RUN 环境确认）。
- [ ] TC-118/TC-119/TC-120/TC-121/TC-122/TC-123 与 R4/R6/R7 已实现，或在 RUN 记录中逐项明确接受为未覆盖。
- [ ] AC-08 的 Proposed 状态已由用户确认（§13-10）；TC-122 的终态口径已由 PRD/TECH 确认（§13-7）。
- [ ] 已记录本次 RUN 的 skipped 名单及原因；跨卷用例未因缺少 `ASTROPHOTO_TEST_SECOND_VOLUME` 被跳过并计入通过。

RUN 记录与证据约定：

- 标识：`RUN-xxx`，同时记录基线 commit、`DEV_118_FIX_INPUTS.json` 的 SHA-256 与工作树状态。
- 逐 TC 记录：状态（Not Run/Pass/Fail/Blocked/Skipped）、命令、环境变量、夹具、证据路径。
- 证据按 `assets/test-runs/RUN-xxx/TC-yyy/` 存放，文件名不使用中文空格；截图与 JSON 均附生成时间。
- 复测关联原 RUN 与 Finding/DEV 编号；历史记录不覆盖。

完成标准：

- [ ] AC-01～AC-28 均有 RUN 结果；P0 全部通过，或失败已定位并记录风险。
- [ ] 失败项标明是产品错误、测试错误、环境问题还是需求歧义。
- [ ] 证据包含请求/响应、数据库查询、文件摘要、截图与日志，且与代码版本绑定。
- [ ] 未覆盖或 Blocked 项在报告中显式列出，不以 DEV 自检替代。

## 11. 风险与限制

| 风险 | 影响 | 处理 |
| --- | --- | --- |
| V3 宿主替身按 0.45.0 签名构造 | 不能证明 0.46.0 导入与运行 | 真实宿主用例单独判定 |
| 前端构建产物 `js/main.js` 可能与源码不同步 | 宿主行为与组件测试不一致 | RUN 前重建并比对（O-6） |
| 当前环境无 pnpm | 前端与宿主脚本无法直接执行 | RUN 环境安装 pnpm 11.13.1 或用已验证的本地 `node_modules` |
| 跨盘拓扑与吞吐依赖硬件 | TC-113 结论不可外推 | 记录设备型号与重复次数 |
| 旧库副本来源有限 | AC-12 覆盖不足 | 从历史检出生成副本并脱敏 |
| 浏览器直传与流式中断的时序敏感 | 用例偶发 | 固定夹具、延长超时、记录事件序 |
| 真实 Agent 客户端差异（legacy/modern） | 确认流程行为不同 | 客户端矩阵单列，不合并结论 |
| 1000 帧用例耗时 | 回归成本高 | 归入正式 RUN，不纳入每次局部自检 |
| 宿主通知接口差异 | 反馈缺失 | 接口不可用时的页内回退单独核对 |
| 跨卷用例默认 skip | 可能把跳过当通过 | 强制记录 skipped 名单（§10） |
| 前端 pnpm 缺失 | 组件与宿主脚本不可执行 | 已在 §13 列为阻断决策 |

明确不自动化：视觉布局与文案审阅、真实系统文件选择器、真实双盘吞吐、旧库升级的现场操作。

## 12. 修订历史

| 版本 | 日期 | 变更 | 关联 |
| --- | --- | --- | --- |
| v1.0 | 2026-11-22 | 建立配置、存储与预览增量用例 | DEV-001～016 |
| v1.1 | 2026-11-22 | 增加设备、素材、导入、项目、通知与联合验收用例 | DEV-020～091 |
| v1.2 | 2026-11-22 | 增加存储初始化、删除迁移、子帧组、任务框与 REVIEW-001 回归 | DEV-110～114 |
| v2.0 | 2026-11-22 | 对齐规范结构：版本信息、策略、覆盖矩阵、环境、夹具、自动化映射、回归计划、门禁、风险与修订历史；新增 DEV-118 回归 TC-117-R1～R5、TC-112-R1、TC-114-R1、TC-014-R1、TC-117-R6 | DEV-118 |
| v2.1 | 2026-11-22 | 归并四路只读评审：恢复 TC-115 并补 TC-115-R1、TC-116-R1～R3、TC-113-R1、TC-117-R6/R7、TC-114-R2；新增 TC-118（预检失效）、TC-119（源变更）、TC-120（启动锁）、TC-121（迁移崩溃点）、TC-122（跳过终态）、TC-123（重试被拒）；修正跨文件误引；TC-002/004/005/008/015/041 并入、TC-031 标 Obsolete；区分 Implemented/Proposed/Blocked；补环境变量、skip 程序、两阶段重启与 RUN 证据约定；移除无 PRD 依据的通知计次与错误码通过条件 | 评审 F-A～F-D |
| v2.5 | 2026-11-22 | RUN-003：隔离 8188 宿主执行 `pytest -m host` 与 storage/assets/equipment 脚本；修正宿主脚本过期 UI 期望；补 0001 升级用例；TC-116 与宿主行标为 Implemented | RUN-003、DEV-123 |
| v2.4 | 2026-11-22 | 落地已确认口径：TC-117-C 断言 `requires_new_approval`，TC-122 断言 `skipped_assets`；同步 TECH/PRD 与 RUN-002 | SPEC-001 C、Q-04 A |
| v2.3 | 2026-11-22 | 为 TC-122 与 TC-117-C 补充示例数据、当前预期与决策分支（PRD Q-04、TECH 待确认节） | 决定待确认 |
| v2.2 | 2026-11-22 | RUN-001 后同步：TC-115-R1、TC-118、TC-119、TC-120、TC-121、TC-122、TC-123、TC-117-R4/R6 标为 Implemented；TC-119 预期改为「源变更不可重试、需重新提案」；补充测试报告链 | RUN-001、DEV-120 |

## 13. Open Test Decisions

1. **旧库副本来源**：是否用历史检出重建 0001/0002/0003 数据根，或由用户提供脱敏副本。影响 AC-12 的正式判定；建议重建并记录 schema 摘要。阻断：是（AC-12）。
2. **1000 帧夹具**：入库或脚本生成。入库会增大仓库；建议脚本生成并在 RUN 记录校验和。阻断：否。
3. **双盘吞吐基线**：是否以固定数据集与三次重复作为通过条件。建议记录而不设硬阈值，避免硬件差异误判。阻断：否。
4. **前端执行环境**：RUN 机器是否安装 pnpm 11.13.1；若不安装，是否接受用现有 `node_modules/.bin/vitest`。阻断：是（前端用例）。
5. **真实 Agent 客户端矩阵**：需覆盖哪些版本/能力组合（legacy elicitation、现代 InputRequiredResult）。建议至少各一。阻断：是（AC-07）。
6. **通知与布局的人工基线**：是否引入截图基线；建议仅保存证据，不做像素比对。阻断：否。
7. **组内跳过源的终态**（已确认 2026-11-22）：维持 `partial`，并返回 `skipped` 计数与 `skipped_assets` 明细；不修改既有素材。阻断：否。
8. **批准后目标版本变化的处理**（已确认 2026-11-22）：保留重试，状态动态返回 `requires_new_approval: true`；不作废批准。阻断：否。
9. **通知计次是否入 AC-25**：TC-111 只核对“一次点击一次请求”，不把通知条数作为通过条件；是否将“同一提交一条通知”写入 PRD？阻断：否。
10. **AC-08 仍为 Proposed**：联合验收的正式判定是否纳入本 Feature 验收，需用户确认后才能在 TEST_REPORT 中作为 Pass 依据。阻断：是（AC-08）。
