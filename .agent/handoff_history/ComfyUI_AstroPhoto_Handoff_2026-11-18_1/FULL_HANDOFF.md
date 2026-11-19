# ComfyUI AstroPhoto · FULL HANDOFF · 2026-11-18

本文件收录主交接各专题以及六个静态审计附录。运行结果、旧决策纠正与证据边界以主交接章节为准。
命令原始日志、完整用例账本、输入与源码哈希位于 evidence/。

- [00_START_HERE](00_START_HERE.md)
- [01_CURRENT_STATE_AND_VERSIONS](01_CURRENT_STATE_AND_VERSIONS.md)
- [02_REQUIREMENTS_AND_DECISIONS](02_REQUIREMENTS_AND_DECISIONS.md)
- [03_REPOSITORY_ARCHITECTURE](03_REPOSITORY_ARCHITECTURE.md)
- [04_COMPLETE_FEATURE_INVENTORY](04_COMPLETE_FEATURE_INVENTORY.md)
- [05_DEFENSIVE_PROGRAMMING_AUDIT](05_DEFENSIVE_PROGRAMMING_AUDIT.md)
- [06_TEST_COVERAGE_MATRIX](06_TEST_COVERAGE_MATRIX.md)
- [07_NODE_SIRIL_IMAGE_PATH](07_NODE_SIRIL_IMAGE_PATH.md)
- [08_FRONTEND_UI_AND_INSPECTOR](08_FRONTEND_UI_AND_INSPECTOR.md)
- [09_STORAGE_ASSETS_EQUIPMENT](09_STORAGE_ASSETS_EQUIPMENT.md)
- [10_MCP_CI_PACKAGING](10_MCP_CI_PACKAGING.md)
- [11_HANDOFF_RECONCILIATION](11_HANDOFF_RECONCILIATION.md)
- [12_GAPS_AND_RISKS](12_GAPS_AND_RISKS.md)
- [13_NEXT_AGENT_PROMPT](13_NEXT_AGENT_PROMPT.md)
- [14_SOURCES_AND_EVIDENCE](14_SOURCES_AND_EVIDENCE.md)

---

# ComfyUI AstroPhoto 工程交接 · 2026-11-18

基线是 Windows 仓库 main 的未提交工作树，HEAD 为 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a。Extension 与独立 MCP 均为 0.0.1。当前运行中的 8207 返回 ComfyUI 0.45.0、Frontend 1.59.1 和 IMAGE_PATH 节点 Schema。其他本机端口可响应但节点契约较旧。

用户确认以当前本地实现为现行行为基线，可接受与旧 Chat 需求的设计差异。在已观察的主要流程中未发现明显的产品功能故障。实际测试失败及未验证场景见 [测试矩阵](06_TEST_COVERAGE_MATRIX.md)。

已实现的主线包括 V3 绘图节点及三个科学相关节点、React Sidebar、Vue 绘图 Widget、本地多 Workspace、SQLite 资产和设备、单配置光路、Siril 1.4.5 处理和比较预览，以及条件注册的 MCP 设备读取工具。本轮真实 Siril 进程验证了 FITS 独立输出及原始文件保持不变。真实宿主证据与模拟后端、Chromium 控件和 JSDOM 断言分开。

默认 React 测试配置及待验证项记在 [风险清单](12_GAPS_AND_RISKS.md)。Inspector 参数应可编辑，当前源码已将编辑同步到画布节点，待补实际调用链的回归测试。设备和光路均采用单一可编辑配置。旧光路快照仍走兼容 GET，UI 已移除历史维护入口。Knowledge、Memory、Experiments、全量观测站、硬件控制和完整 Capture Session 仍在规划。

## 阅读顺序

1. 核对 [版本与工作树](01_CURRENT_STATE_AND_VERSIONS.md) 和 [需求及决策](02_REQUIREMENTS_AND_DECISIONS.md)。
2. 用 [实际架构](03_REPOSITORY_ARCHITECTURE.md) 选择入口，再读 [功能](04_COMPLETE_FEATURE_INVENTORY.md)、[防御](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 和 [测试](06_TEST_COVERAGE_MATRIX.md)。
3. 按任务进入 [Siril](07_NODE_SIRIL_IMAGE_PATH.md)、[前端](08_FRONTEND_UI_AND_INSPECTOR.md)、[本地数据](09_STORAGE_ASSETS_EQUIPMENT.md) 或 [MCP 与发版](10_MCP_CI_PACKAGING.md)。
4. 修改产品行为前查 [新旧差异](11_HANDOFF_RECONCILIATION.md) 和 [证据](14_SOURCES_AND_EVIDENCE.md)。[下一任 Prompt](13_NEXT_AGENT_PROMPT.md) 可以直接交给新的 Coding Agent。

[全文交接](FULL_HANDOFF.md) 合并专题与详细证据。各条结论的 VERIFIED 只适用于明确覆盖的测试。语义阅读缺口、旧历史与本轮测试边界均在文内保留。

---

# 当前工作树和环境

| 项 | 本轮查询 |
|---|---|
| Extension Git | main，HEAD 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a，已有大量 tracked 与 untracked 改动。逐文件以快照为准 |
| 宿主 Git | 9fa6bc598950993c2980c52169115f2968012605 |
| Extension / API / MCP | 0.0.1 / v1 / 0.0.1 |
| Python | 系统 3.12.4，项目 .venv 3.12.15，既有隔离环境 3.11.18，真实 ComfyUI 进程 3.12.16 |
| Node / pnpm / uv | 26.8.2 / 11.13.1 / 0.13.8。CI workflow 使用 Node 22、Python 3.11/3.12 |
| 主要 Python 安装依赖 | SQLite 3.53.1、SQLAlchemy 2.1.9、Alembic 1.20.1、FileLock 3.32.7、Astropy 7.2.4、Pillow 12.3.0、NumPy 2.5.5、aiohttp 3.14.5、FastMCP 4.2.0、HTTPX 0.28.1 |
| 前端声明与锁 | React/ReactDOM 18.3.1，Vue 3.5.13，PrimeVue 4.3.3，Reka UI 2.11.0，Vite 6 系列，TypeScript 5.9.3，Comfy 前端类型 1.59.1。根 uv.lock、frontend/pnpm-lock.yaml |
| Siril CLI | 现有 Windows 便携版执行 --version 返回 siril 1.4.5。本轮未安装或更新 |
| 真实 ComfyUI | 8199、8201、8205、8207 均返回 Backend 0.45.0、Frontend 已安装/要求 1.59.1、Torch 2.14.1+cu130 |

## 已加载后端与当前磁盘产物

| 端口 | /object_info 观察 | 边界 |
|---|---|---|
| 8199 | vue-basic，三个科学节点路由查询无该类 | 不能用来验收科学节点 |
| 8201 | FITS Source STRING → ASTRO_FRAME，AutoStretch ASTRO_FRAME → ASTRO_FRAME | 更早节点契约 |
| 8205 | FITS Source ASTRO_FITS_ASSET → ASTRO_FRAME，AutoStretch ASTRO_FRAME → ASTRO_FRAME | 早期科学类型 |
| 8207 | FITS Source ASTRO_FITS_ASSET → IMAGE_PATH，文本 Image Path STRING → IMAGE_PATH，AutoStretch IMAGE_PATH → IMAGE_PATH | /status 与节点 Schema 实际 GET 通过。服务已运行，未重启；GET 不证明每个 Python 模块字节版本一致 |

四个端口所提供的 JS 与 CSS 均和磁盘现有产物 SHA-256 匹配。这同时证明静态文件与已加载后端必须分别识别。宿主根路径与业务数据不在日志中展开。

原始观察和精确版本见 [versions.txt](evidence/versions.txt)。[状态前](evidence/git-status-before.txt)、[状态后](evidence/git-status-after.txt)、[文件清单](evidence/repository-files.txt)、[源码哈希](evidence/source-hashes.json) 同时保留修改和未跟踪记录，JSON 的 null 表示基线列出的路径在磁盘不存在。完整性结果见 [完整性证明](evidence/integrity.txt)。

---

# 有效产品要求与决策

实现和测试状态分别在 [Feature 清单](04_COMPLETE_FEATURE_INVENTORY.md) 与 [测试](06_TEST_COVERAGE_MATRIX.md)。本页只界定产品行为。D 编号在 [对齐矩阵](11_HANDOFF_RECONCILIATION.md) 中可追踪到三个输入来源。

| ID | 有效决定 |
|---|---|
| D01 | ComfyUI V3 原生节点和原生 aiohttp 扩展，保留 vue-basic 的节点 ID、Widget ID、上传与工作流绘画像素。独立 MCP 走 HTTP。 |
| D02 | 只有 Nodes、Assets、Settings 三个主视图。语言和主题跟随 ComfyUI。观察地占位行已被当前会话明确要求移除，观测数据长期需求的后续范围仍可单独讨论。 |
| D03 | 使用本地数据根、默认及外置 Workspace、独立 Cache。默认引用，用户可选择复制。正式产物属于 Workspace，预览可重建并属于 Cache。不要写 ComfyUI 的全局目录设置。 |
| D04 | 引用资产原址和复制资产分开。来源授权目录是 Asset Import 的边界。已确认 Siril 在可信本机处理可用的导入根外绝对 FITS 路径。两条路径不共享相同授权策略。 |
| D05 | 设备类别为 Camera、主光学、光学配件、Filter 含 Passbands。可选未知规格允许留空。设备和光路详情使用紧凑摘要与可折叠分组。 |
| D06 | 设备和光路均不维护多份历史版本。光路保留单一配置、可保存未完成状态、关联设备和有序配件、多个滤镜。原始发布、选默认 Revision、由历史派生工作流已被替代；兼容数据保留与删除行为按当前实现核查。 |
| D07 | 设备与光路有编辑、归档和红色永久删除动作。删除应尊重真实引用、权限和并发，避免误删。旧 UI 中为启用按钮而自动删除关联的授权未发现。 |
| D08 | 科学流程首期使用 IMAGE_PATH，路径由 Source/Text Path 输出并供 AutoStretch 使用；正式结果依然是科学 FITS。更丰富科学类型是保留的长期目标。 |
| D09 | Siril 首期目标 1.4.5，使用 CLI 及 Settings 软件管理。AutoStretch 仅 shadowsclip、targetbg、linked 三个处理参数。内部 load、autostretch、save，保留输入及元数据，验证真实输出。 |
| D10 | 画布显示一个可折叠主预览，手工刷新，输入或参数变化可触发新预览。开 Inspector、缩放、平移、折叠、聚焦不应独立触发计算。全局「环境配置」管 PNG 分辨率，画布固定显示上限与正式 FITS 大小分开。 |
| D11 | Inspector 支持并排、分割滑杆、单图、平移缩放和焦点管理。用户本轮明确确认参数可编辑。Inspector 与画布共用当前节点的 shadowsclip、targetbg、linked，支持重置；宿主只读模式及单色输入的限制继续适用。旧交接的参数只读条款标为 OBSOLETE。本期不纳入 Trial 管理。 |
| D12 | CLI 输入/输出隔离、进程与文件失败要正确回执并保护原件。历史固定输入字节、PNG 大小、正式/候选 CLI timeout 和任务并发硬上限已被后续明确要求撤销。资源风险独立记录，不能默默恢复旧限制。 |
| D13 | MCP 仅提供能实际调用的 Tools，单独发行。设备读取需可信直连与有效 token。密码/token 不进入证据。本期无 MCP 设备写权限。 |
| D14 | 保留 Capture Session 管理和校准关联、更多科学格式与算法、厂商处理软件、知识检索、隐私可控记忆、实验/优化、33 个候选 Agent Skills 与 Agent 工作流长期目标。现 UIs 中的规划页与 API capability false 不等于完成。 |
| D15 | 现有 DB 非兼容版本应明确失败。开发基线可用于隔离新建，不自动清空既有用户数据。 |
| D16 | Nodes 收藏复用宿主收藏表；当前 AstroPhoto 页只展示可匹配本域节点，保留非本域条目。 |
| D17 | 当前未提交工作树、运行宿主 Schema、构件和测试命令分别取证；旧结果仅用于追溯。 |
| D18 | 创建设备与光路使用已复用的 Comfy 风格选择器，滤镜是可用集合、下拉支持多选。光路状态字段从 UI 移除。 |
| D19 | 用户确认以当前本地工作树实现为现行行为基线，可接受与旧 Chat 需求文档的设计偏差。差异用于追溯，判断缺陷须看现行行为、最新明确要求和实际证据。 |

Chat_Handoff、Last_Handoff 与 Original_request 用于追溯历史设计和长期范围。当前功能状态、行为边界和测试结论分别以当前源码与对应运行证据为准。

---

# 当前源码架构

| 源路径 | 当前职责 |
|---|---|
| __init__.py、nodes/ | comfy_entrypoint、on_load、get_node_list。绘图节点与三个科学节点，返回宿主 V3 Schema。 |
| astrophoto/bootstrap.py、astrophoto/core/ | 纯配置 bootstrap、宿主启动时初始化、失败降级、作用域配置验证、capabilities 与版本。 |
| astrophoto/api/ | Comfy PromptServer RouteTableDef。route registration、共享 auth/DTO/error、分域 storage、assets、equipment、siril。 |
| astrophoto/storage/、astrophoto/database/ | 文件授权、初始化锁、SQLite baseline、Workspace、Cache、后台 operations、复制及迁移恢复。 |
| astrophoto/assets/、astrophoto/equipment/ | 资产对象/位置/Session 关系、设备规格、光路 JSON 当前配置以及读兼容快照。 |
| astrophoto/siril/ | 可执行探测，固定处理脚本，FITS I/O、候选预览、正式处理与恢复。 |
| frontend/entry.ts、frontend/src/ | Vue Widget、PrimeVue、绘图/上传、原生宿主导入与复用的 Vue 控件组件。 |
| frontend/ui/src/ | React Sidebar、公开 Host API adapter、页面、DTO、科学节点 DOM Widget 和独立 Inspector。 |
| mcp/src/astrophoto_mcp/ | 独立 FastMCP 4.2.0 CLI/server/client 和 HTTP adapter，发包与 Extension 分离。 |
| scripts/、.github/ | 版本同步/预检、Registry 与 PyPI 构件边界、CI、发版和隔离安装检查。 |

## 入口和依赖方向

- __init__.py:12–45 → bootstrap.host_runtime → StorageRuntime.initialize → 数据根、DB、缓存、未完成 operation 与 Siril run 恢复。initialize_storage_runtime 捕获错误，status 仍可报告 degraded。宿主入口有重复 route/runtime 判断。
- ComfyUI 环境的浏览器 → Host Adapter 的 fetchApi → route registry → 权限及 JSON 解析 → asyncio.to_thread → domain service → DB transaction/operation。长时 I/O 走业务 worker 和持久 plan/receipt。
- root config/settings.json 设 workspace id、import mode、cache budget、PNG 分辨率，配置锁和 revision；Databases/assets.db 保存身份/Workspace/资产关系/操作/设备与光路。文件分布在各 Workspace、外部原路径、Cache 和 runtime。
- Comfy Vue Widget 装入原生 DOM widget，拥有自己的 Vue 生命周期；React Sidebar 装入宿主 sidebar render 容器；科学节点 Inspector 另有 React root/widget 生命周期，发布产物共享单个 js/main.js 和 JS 相对链接的 assets/main.css。
- Comfy graph 是节点修改、Undo/Redo、工作流与正式队列执行的拥有者。Sidebar Nodes 的添加/拖拽在当前图上调宿主 API。status 中 canvas_bridge false 指远程/Agent 能力，不能据此否认这条本地交互。
- MCP stdio → create_server → 诊断或设备 Tool → HTTP 边界 → Extension Service，MCP 无 DB/import 依赖 Extension。详见 [MCP](10_MCP_CI_PACKAGING.md)。

## 路由入口

统一前缀 /astrophoto/v1。GET /status 是单独的公开 status handler。其余声明从 api/storage.py:176、api/assets.py:53、api/equipment.py:81、api/siril.py:94 加入原生路由表。可从 [路由索引](evidence/routes.md) 跳到每条实际方法、handler 与预期 HTTP status。四组业务路由共用 body 限制与错误包装，equipment 切换独立授权策略。

这是审计范围内项目树。reference、历史交接、node_modules 与 .venv 是参考或依赖证据，未按本项目实际运行模块计数。逐路径覆盖账本见 [source-inventory.md](evidence/source-inventory.md)。

---

# 当前工作树 Feature 清单

本表按实际调用点，用同一功能下可独立调用的路由和 UI 划分。不同层可能有重叠行，例如 service、HTTP 和 UI。编号数量表示审计行数。业务能力不能把相同调用链重复累计。每行的状态只适用于紧随其后的证据范围。

- 当前本地实现是现行行为基线。历史设计差异单独记录。VERIFIED 仅指明确通过的局部断言。其余作 IMPLEMENTED_UNVERIFIED、PARTIAL、CONFLICT、OBSOLETE、PLANNED 或 UNKNOWN。
- 实现描述、I/O、副作用和源码路径来自分域探查，经 [范围账本](evidence/source-inventory.md) 对照。精确调用链与约束见本表的证据列。
- 列出同域候选 Guard/Test 不等于验证该行的所有细节。证据列的原报告保留每条映射的边界。没有定位到 Guard 的功能标 NO_GUARD_FOUND 或规则不适用；未能穷举时保留 UNKNOWN。
- 完整项目文件已清点，语义审计仍有边界，见 [证据索引](14_SOURCES_AND_EVIDENCE.md)。

## 分域索引

| ID | 行为 / 入点 / I/O 与数据 | 状态与验证边界 | Guard 关联 | 用例分域和结果 | 专题源码及断言 |
| --- | --- | --- | --- | --- | --- |
| B-01 | 启动宿主 → V3 节点列表、注册一次路由；已存在标记 runtime 则复用，否则线程执行 `host_runtime`，评估可信部署后注册；没有在 import 初始化。 · `__init__.py:12`, `__init__.py:29`, `astrophoto/bootstrap.py:49` · T01 T02 T03 | VERIFIED：V3 stub、现存 8207 注册 GET；不含重复进程冲突 | GB-11 / 注册去重见 astrophoto/api/routes.py:15 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:13](evidence/subagents/backend.md) |
| B-02 | 设置 `ASTROPHOTO_HOME` → 绝对本地数据根；无效配置回退默认但标记 `INVALID_STORAGE_PATH`，不尝试初始化；其他初始化异常记录并降级。版本来自根 pyproject。 · `astrophoto/core/paths.py:10`, `astrophoto/core/config.py:30`, `astrophoto/bootstrap.py:36` · T01 T04 | VERIFIED：Core 非法配置之 fixture | GB-04 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:14](evidence/subagents/backend.md) |
| B-03 | 首启或重启 → 锁住数据根，创建/检查 manifest、settings、SQLite、默认 Workspace、Cache marker；创建完成后原子标记 initialized，再恢复 runs 和未完成 operation。异常并不伪装 ready。 · `astrophoto/storage/runtime.py:46`, `astrophoto/storage/runtime.py:56`, `astrophoto/storage/initializer.py:41`, `astrophoto/storage/initializer.py:53`, `astrophoto/storage/initializer.py:75` · T05 T06 T07 T08 | VERIFIED：首次/重入/进程样本 | GB-04 / GB-06 / GB-11 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:15](evidence/subagents/backend.md) |
| B-04 | SQLite 打开、建库/检查、备份 → `DatabaseManager` 通过 Alembic baseline，外键、busy timeout、FULL 和 WAL；事务 context 异常回滚；health 验证 revision、schema、identity 和 WAL；备份到独立目标。旧/不符 schema 不自动删除。 · `astrophoto/database/manager.py:27`, `astrophoto/database/manager.py:52`, `astrophoto/database/manager.py:64`, `astrophoto/database/manager.py:111`, `astrophoto/database/manager.py:120`, `astrophoto/database/manager.py:128`, `astrophoto/database/manager.py:144` · T07 T09 T10 | VERIFIED：WAL、FK、busy rollback、备份与旧基线 fixture | GB-06 / GB-11 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:16](evidence/subagents/backend.md) |
| B-05 | 查状态 → 未经 storage wrapper 的公共 GET status 输出 extension/version、注册状态、data_home、能力；数据库失败或节点/路由未注册则 degraded。不能证明实际执行成功。 · `astrophoto/api/status.py:11`, `astrophoto/core/capabilities.py:4` · T02 T11 | VERIFIED：8207 GET 及独立健康状态测试 | GB-12 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:17](evidence/subagents/backend.md) |
| B-06 | GET `/storage` → wrapper 授权 → `snapshot` → DB health、settings、Workspace status、Cache status 和最近 operation；不可信请求返回不可用且不披露工作区。 · `astrophoto/api/storage.py:38`, `astrophoto/storage/runtime.py:94`, `astrophoto/api/storage.py:112` · T12 | VERIFIED：aiohttp 未授权与状态 DTO | GB-01 / GB-12 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:18](evidence/subagents/backend.md) |
| B-07 | PATCH storage/settings 输入 revision、imports/workspace/cache → 验证后锁内比对 revision、原子写 settings 并递增 revision；冲突不写。 · `astrophoto/api/storage.py:45`, `astrophoto/storage/runtime.py:76`, `astrophoto/core/config.py:132` · T12 T13 | IMPLEMENTED_UNVERIFIED | GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:19](evidence/subagents/backend.md) |
| B-08 | 注册 Workspace path/name → 路径规范/无重叠、空目录所有权 marker、建立 objects/outputs/.staging、写 DB；中断后仅相同实例 marker 且无业务数据可重入。 · `astrophoto/api/storage.py:58`, `astrophoto/storage/locations.py:64`, `astrophoto/storage/locations.py:75`, `astrophoto/storage/locations.py:100` · T12 T13 | VERIFIED：临时 Workspace 创建 | GB-04 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:20](evidence/subagents/backend.md) |
| B-09 | 更新名称、启停、设默认、校验 → lease+lock/revision，默认不能停；验证在线且 staging 可创建临时文件。状态包括 offline、identity_mismatch、read_only、disabled、migrating、error。 · `astrophoto/storage/locations.py:124`, `astrophoto/storage/locations.py:151`, `astrophoto/storage/locations.py:173` · T12 T13 | VERIFIED：离线/默认/禁用 fixture | GB-05 / GB-06 / GB-07 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:21](evidence/subagents/backend.md) |
| B-10 | 重定位离线 Workspace → 原路径 marker 不匹配/不存在，目标必须同实例同 workspace marker，再 DB 重绑；仅改变引用，不移动文件。删除只删注册记录；默认、有资产或活动操作拒绝，目录保留。 · `astrophoto/storage/locations.py:202`, `astrophoto/storage/locations.py:219`, `astrophoto/storage/locations.py:236` · T12 T13 | VERIFIED：离线 relo fixture，移除独立边界仍有限 | GB-04 / GB-07 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:22](evidence/subagents/backend.md) |
| B-11 | 修改 Cache 路径/上限 → 校验 revision、路径和 marker；新目录 claim 后原子更新配置，旧 cache 保留而非搬运。 · `astrophoto/api/storage.py:84`, `astrophoto/storage/cache.py:156` · T14 | IMPLEMENTED_UNVERIFIED | GB-04 / GB-06 / GB-10 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:23](evidence/subagents/backend.md) |
| B-12 | 写/读/清 Cache → 只在命名 bucket 存 UUID 文件并保存身份描述；预算和磁盘检查；清除仅验证单硬链接、完整 marker 的文件，锁冲突跳过，返回 removed/skipped/failed；Siril scratch 限已知名称清理。 · `astrophoto/storage/cache.py:35`, `astrophoto/storage/cache.py:54`, `astrophoto/storage/cache.py:75`, `astrophoto/storage/cache.py:80`, `astrophoto/storage/cache.py:124`, `astrophoto/storage/cache.py:175` · T14 | VERIFIED：owned Cache 清理与 live lease fixture | GB-05 / GB-10 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:24](evidence/subagents/backend.md) |
| B-13 | 请求迁移 workspace 到空目标及幂等 key → 复用相同请求 operation，不同请求同 key 冲突，检查 active operation，创建 queued 并异步 submit。 · `astrophoto/api/storage.py:93`, `astrophoto/storage/migration.py:24`, `astrophoto/storage/migration.py:31`, `astrophoto/storage/operations.py:29` · T15 T16 | VERIFIED：同盘迁移启动 | GB-06 / GB-08 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:25](evidence/subagents/backend.md) |
| B-14 | 迁移 preparing/copying/verifying → lease、盘点对象/输出，要求 staging 空、引用文件存在、足量空间；每文件复制到 part、校验 SHA256 并发布，保存 receipt；二次盘点并核对原始指纹及 hash。 · `astrophoto/storage/migration.py:48`, `astrophoto/storage/migration.py:75`, `astrophoto/storage/migration.py:83`, `astrophoto/storage/migration.py:103`, `astrophoto/storage/manager.py:37` · T15 T16 | VERIFIED：同盘迁移/HASH 及失败注入 | GB-04 / GB-05 / GB-08 / GB-09 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:26](evidence/subagents/backend.md) |
| B-15 | 迁移 publishing/committed → 写目标 workspace marker；锁内同一 SQLite 事务 rebind 及 operation committed；恢复 committed 后验证目标、移除自有 migration marker、completed。旧源保留；失败不会声称回滚已经发布的文件。 · `astrophoto/storage/migration.py:134`, `astrophoto/storage/migration.py:143`, `astrophoto/storage/migration.py:150`, `astrophoto/storage/migration.py:158` · T15 T16 | VERIFIED：同盘切换前后恢复 | GB-06 / GB-08 / GB-09 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:27](evidence/subagents/backend.md) |
| B-16 | 查询/取消/重试 operation → status 去除私有 receipt 字段；非终态且非 committed 标记 cancel，checkpoint 抛取消；启动重投非终态，可能保留 checkpoint 和中间文件供恢复；committed 不可取消。 · `astrophoto/storage/operations.py:51`, `astrophoto/storage/operations.py:76`, `astrophoto/storage/operations.py:90`, `astrophoto/storage/operations.py:110`, `astrophoto/storage/operations.py:116` · T15 T17 | IMPLEMENTED_UNVERIFIED | GB-06 / GB-09 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:28](evidence/subagents/backend.md) |
| B-17 | HTTP 路由注册与公共错误 → status route ownership 检查、冲突拒绝，其他 definitions 经共享 wrapper；授权、JSON、资源可用性、异常分类后回 request_id/no-store；I/O 及业务 action 离开事件循环。 · `astrophoto/api/routes.py:15`, `astrophoto/api/storage.py:106`, `astrophoto/api/errors.py:14` · T02 T12 | VERIFIED：aiohttp 业务请求，非完整错误矩阵 | GB-01 / GB-03 / GB-05 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:29](evidence/subagents/backend.md) |
| B-18 | HTTP 身份边界 → 只有显式开启并 listen 全回环、无 multi-user/CORS 的环境才可信；检查 remote、host、origin、Fetch-Site、forwarded 和专用 header；设备只读 bearer 为单独路径。公开 status 不走此授权。 · `astrophoto/api/security.py:18`, `astrophoto/api/security.py:25`, `astrophoto/api/security.py:42`, `astrophoto/api/security.py:46`, `astrophoto/api/status.py:26` · T12；设备专测见其他审计 | VERIFIED：aiohttp trusted local 与拒绝样本 | GB-01 / GB-02 / GB-12 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:30](evidence/subagents/backend.md) |
| B-19 | GET `/storage` → `snapshot`；未授权特例 200 unavailable、不含路径；已授权检查 DB、工作区、Cache 和最近任务，200。T12。`astrophoto/api/storage.py:38` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:95](evidence/subagents/backend.md) |
| B-20 | PATCH `/storage/settings` revision 必填，至少一个 imports/workspace/cache → `update_settings` 原子替换文件；错误 revision 409。T12。`astrophoto/api/storage.py:45`, `astrophoto/storage/runtime.py:76` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:96](evidence/subagents/backend.md) |
| B-21 | POST `/storage/locations` path/name → 候选路径、空目录 claim、创建私有目录及 DB row，201；认领成功但 DB 写失败时标记可能残留，重入仅认可同实例且空布局。T12 T13。`astrophoto/storage/locations.py:75`, `:100` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:97](evidence/subagents/backend.md) |
| B-22 | PATCH `/storage/locations/{id}` revision 和 name/enabled/default → revision 校验、DB 更新或单独原子设默认；default 不可与名称/启停同时提交，默认位置不可停。T12 T13 部分。`astrophoto/api/storage.py:63`, `astrophoto/storage/locations.py:173` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:98](evidence/subagents/backend.md) |
| B-23 | POST `/storage/locations/{id}/validate` → 租约、状态和 `.staging` 临时文件探测；只返回状态，不修复。T12。`astrophoto/storage/locations.py:151` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:99](evidence/subagents/backend.md) |
| B-24 | POST `/storage/locations/{id}/relocate` new_path → 原 marker 不在且目标身份匹配才 DB rebind；不搬运文件。T13；HTTP 路由成功及失败本文件未断言。`astrophoto/storage/locations.py:202` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:100](evidence/subagents/backend.md) |
| B-25 | DELETE `/storage/locations/{id}` expected_revision → 检查默认、引用、活动任务后只删 DB 行、保留目录。T12 验证保留目录；含资产、活动任务和 revision 的 HTTP 失败未验证。`astrophoto/storage/locations.py:219` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:101](evidence/subagents/backend.md) |
| B-26 | POST `/storage/cache/configure` path/max_size_gb/revision → 认领空目标或核验同目标；写配置，不复制/删除旧条目。T14；新 marker 创建后设置文件写失败可能留下已认领目录，未找到对应故障测试。`astrophoto/storage/cache.py:156` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:102](evidence/subagents/backend.md) |
| B-27 | POST `/storage/cache/clear` scope → 仅带正确实例/条目 marker 的普通单链接文件，可锁时删数据再删 descriptor，返回统计。T14；descriptor unlink 失败可能留下孤儿描述，计 failed，非文件级事务。`astrophoto/storage/cache.py:175` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:103](evidence/subagents/backend.md) |
| B-28 | cache producer `store` → bucket 检查、预算和剩余盘空间、独占创建、fsync、原子写 descriptor；descriptor 写失败可留下未被 `_entries` 认领的孤儿文件。未找到该窗口专项测试。`astrophoto/storage/cache.py:35`, `:54` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:104](evidence/subagents/backend.md) |
| B-29 | cache `read_entry` → 检查桶/名称/root marker，条目锁、普通文件/单链接和身份描述，返回 bytes 或 validate-only；无效 `PREVIEW_NOT_FOUND`。本范围无独立断言。`astrophoto/storage/cache.py:124` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:105](evidence/subagents/backend.md) |
| B-30 | cache scratch → registry 锁、预算、独占临时目录/锁和 owner marker；上下文退出清临时目录；启动使用时只清自己 marker 下固定 Siril 文件，未知内容保留。异常/崩溃完整矩阵未验证。`astrophoto/storage/cache.py:80`, `:103` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:106](evidence/subagents/backend.md) |
| B-31 | POST `/storage/migrations` workspace_id/target_path/idempotency_key → UUID/字段、键复用及请求一致性、目标空闲、没有活动 workspace 操作，202 返回 operation_id。T15 为服务层成功/故障，HTTP 迁移提交未断言。`astrophoto/api/storage.py:93`, `astrophoto/storage/migration.py:31` | IMPLEMENTED_UNVERIFIED | GB-01 / GB-03 / GB-06 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:107](evidence/subagents/backend.md) |
| B-32 | GET `/storage/migrations/{id}` → 校验 UUID 和 kind，返回 phase、公开 receipt、cancel/error；不存在 404。`astrophoto/storage/operations.py:51`, `:58`。独立 HTTP 错误测试未找到。 | IMPLEMENTED_UNVERIFIED | GB-09 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:108](evidence/subagents/backend.md) |
| B-33 | POST `/storage/migrations/{id}/cancel` → 非终态且非 committed 设置 cancel_requested、提交 worker；在 checkpoint 变 cancelled；committed/终态不撤销。`astrophoto/storage/operations.py:76`, `:90`。本范围仅 import 取消 T17，不代表迁移所有阶段取消通过。 | IMPLEMENTED_UNVERIFIED | GB-06 / GB-09 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:109](evidence/subagents/backend.md) |
| B-34 | POST `/storage/migrations/{id}/retry` → 非终态清 error 并 submit，终态仅回状态；HTTP 定义 202，不保证已重新执行。`astrophoto/storage/operations.py:83`, `astrophoto/api/storage.py:176`。未找到独立 HTTP 断言。 | IMPLEMENTED_UNVERIFIED | GB-05 / GB-10 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:110](evidence/subagents/backend.md) |
| B-35 | 恢复 operation → 启动重新提交所有非终态；进程内 `_scheduled` 去重和进程间 FileLock；锁未取得直接返回，后续恢复/重试依赖另一次触发。`astrophoto/storage/operations.py:94`, `:110`, `:116`；T15 T17（不同 worker）。 | IMPLEMENTED_UNVERIFIED | GB-10 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:111](evidence/subagents/backend.md) |
| B-36 | 路由 ownership → status 冲突若无本插件 runtime 拒绝；若有则重用并更新 node callback；预先检查其他路由冲突，避免本次部分注册。`astrophoto/api/routes.py:15`；T02。 | IMPLEMENTED_UNVERIFIED | GB-04 / GB-10 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:112](evidence/subagents/backend.md) |
| B-37 | HTTP 错误映射 → 身份/来源 403、找不到 404、冲突 409、锁 423、空间不足 507、初始化/schema/WAL 503，其余请求错误通常 422，equipment INVALID_REQUEST 400；意外异常 500 且记录 request_id。`astrophoto/api/errors.py:14`, `astrophoto/api/storage.py:146`；T12 只覆盖部分状态。 | IMPLEMENTED_UNVERIFIED | GB-06 / GB-09 | SQLite、文件、aiohttp，见 06 与 backend | [backend.md:113](evidence/subagents/backend.md) |
| A-01 | 预览选择文件/目录：POST `/assets/import/preview` → `preview` → `_selection/_files/_walk`；返回模式、目标、数量、大小、剩余空间、失败数、保留原文件；遍历文件系统无资产入库。 · IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:24`、`astrophoto/assets/imports.py:44,59,86,105` | VERIFIED：导入预检数量与容量 fixture | GA-01 / GA-02 / GA-03 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:9](evidence/subagents/assets-equipment.md) |
| A-02 | 格式处理：所有枚举项经过路径及 stat，无扩展名白名单、内容探测或科学格式校验。 · IMPLEMENTED_UNVERIFIED / NO_GUARD_FOUND；`astrophoto/assets/imports.py:59-103`；非声称 FITS 解码或元数据提取 | IMPLEMENTED_UNVERIFIED：通用导入没有内容校验要求 | NO_GUARD_FOUND（入口无独立校验） | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:10](evidence/subagents/assets-equipment.md) |
| A-03 | 授权路径：选择路径 resolve 后必须位于 `ASTROPHOTO_IMPORT_ROOTS`，且不可重叠 data、cache、保留 workspace；执行时重验。 · IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:29-42,213-217,241-245` | VERIFIED：拒绝未授权路径样本 | GA-01 / GA-02 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:11](evidence/subagents/assets-equipment.md) |
| A-04 | reference：POST import 返回 operation_id，任务保存路径及文件 stat、可绑定 session；原文件不复制；按规范化路径和 size/mtime 去重，同路径改变时报错。 · IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:118-130,204-231` | VERIFIED：外部位置、不复制与 mode 快照 | GA-01 / GA-04 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:12](evidence/subagents/assets-equipment.md) |
| A-05 | copy：选择或默认 workspace，lease、空间检查、staging、checkpoint、原子发布并核对 stat，资产和 receipt 同事务写入；原件保留。不同 key 对同内容没有内容去重。 · IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:132-163,233-269` | VERIFIED：真实 copy 字节、重试和幂等 | GA-01 / GA-03 / GA-05 / GA-06 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:13](evidence/subagents/assets-equipment.md) |
| A-06 | 查询/取消/重试导入：GET `/assets/imports/{id}`、POST `.../cancel`、`.../retry`；任务逐文件 receipt，取消在非 publishing 检查，清理自有 staging；全部失败为 failed，部分成功可 completed。 · IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:55-60`、`astrophoto/assets/imports.py:139-202`；operation 通用状态机由 backend agent 覆盖 | VERIFIED：staging 中断与恢复样本 | GA-05 / GA-06 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:14](evidence/subagents/assets-equipment.md) |
| A-07 | 列表、归属：GET `/assets` 按 UUID 游标返回最多 100 条、session_ids、mode、workspace_id；PATCH session 幂等挂接/解除，session 为字符串关联，并非独立观测 session 实体。 · IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:10-14,46-50`、`astrophoto/assets/service.py:14-21,86-112`、`astrophoto/database/models.py:28-45` | IMPLEMENTED_UNVERIFIED | GA-05 / GA-06 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:15](evidence/subagents/assets-equipment.md) |
| A-08 | 失联检查 GET availability → resolve → stat；重新定位 POST 仅外部 reference，须授权且大小相等、路径不被占，更新 path/name/mtime。 · IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:31-43`、`astrophoto/assets/service.py:35-41,67-84`；内容身份不作哈希验证 | IMPLEMENTED_UNVERIFIED | GA-07 / GA-08 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:16](evidence/subagents/assets-equipment.md) |
| A-09 | 工作区归属：managed location 保存 workspace_id + relative_key，resolve 经注册工作区；reference 保存 external_path/key；copy workspace 变更有 lease 与身份检查。Registry 具体策略由另一审计覆盖。 · IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:132-137,233-269`、`astrophoto/assets/service.py:35-41` | IMPLEMENTED_UNVERIFIED | GA-07 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:17](evidence/subagents/assets-equipment.md) |
| A-10 | 设备类型：camera、primary_optics、optical_accessory、filter；创建/编辑共通字段和按类型规格、可空值；camera readout modes，filter 多 passband。 · IMPLEMENTED_UNVERIFIED；`astrophoto/equipment/schemas.py:8-29,90-155`、`astrophoto/database/equipment_models.py:11-106` | IMPLEMENTED_UNVERIFIED | GA-08 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:18](evidence/subagents/assets-equipment.md) |
| A-11 | 设备列表/详情/创建/更新/归档/恢复/删除：`/equipment` 系列 → EquipmentService → SQLite，Unicode casefold 搜索、游标、版本 CAS、关联使用情况。删除已引用设备拒绝。 · IMPLEMENTED_UNVERIFIED；`astrophoto/api/equipment.py:11-36,81-88`、`astrophoto/equipment/service.py:30-60,92-160` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-10 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:19](evidence/subagents/assets-equipment.md) |
| A-12 | 光路列表、创建、详情、草稿保存、归档/恢复、删除：`/optical-trains` → OpticalTrainService；单可编辑配置、版本比较、设备类型检查；camera 与 primary 同时存在即 status `published`，并非发布历史。 · IMPLEMENTED_UNVERIFIED；`astrophoto/equipment/trains.py:44-76,83-97,99-194,207-212` | PARTIAL：历史-only 引用解释 | GA-09 / GA-10 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:20](evidence/subagents/assets-equipment.md) |
| A-13 | 历史：只读 legacy revision 列表/详情、默认优先于最新 revision 作回退；保存新草稿不改旧快照；发布 revision 和设默认写入口返回 410。 · IMPLEMENTED_UNVERIFIED；旧版原需求已被本聊天明确取消多版本的后续决定取代；`astrophoto/api/equipment.py:64-78`、`astrophoto/equipment/trains.py:44-55,196-205` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-11 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:21](evidence/subagents/assets-equipment.md) |
| A-14 | 设备关联与历史影响：光路配置存稳定设备 ID；详情读当前设备资料与名称，改设备即时影响当前展示；历史 snapshot 保留，引用阻止设备删除；删除光路会删除其 draft、default 和历史。资产与设备/光路关联未见实现。 · IMPLEMENTED_UNVERIFIED / 资产关联 PLANNED；`astrophoto/equipment/service.py:47-60,153-160`、`astrophoto/equipment/trains.py:44-75,83-97`、`astrophoto/database/models.py:28-45` | IMPLEMENTED_UNVERIFIED | GA-11 / GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:22](evidence/subagents/assets-equipment.md) |
| A-15 | GET `/assets` → `list_assets` → `AssetService.list(after)`；UUID 游标，返回 assets/next，读库。`astrophoto/api/assets.py:10-14,55`、`astrophoto/assets/service.py:99-112` | IMPLEMENTED_UNVERIFIED | GB-03 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:78](evidence/subagents/assets-equipment.md) |
| A-16 | POST `/assets/import/preview` → `AssetImportService.preview`；sources/可选模式、workspace、session；枚举计数及空间，读取文件系统。`astrophoto/api/assets.py:24-28,57`、`astrophoto/assets/imports.py:105-116` | IMPLEMENTED_UNVERIFIED | GA-01 / GA-02 / GA-03 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:79](evidence/subagents/assets-equipment.md) |
| A-17 | POST `/assets/import` → `import_assets`；同前加 idempotency_key；返回 operation_id，创建并异步提交。`astrophoto/api/assets.py:17-21,56`、`astrophoto/assets/imports.py:118-130` | IMPLEMENTED_UNVERIFIED | GA-01 / GA-03 / GA-05 / GA-06 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:80](evidence/subagents/assets-equipment.md) |
| A-18 | GET `/assets/imports/{id}` → operations.status；查询 receipt。`astrophoto/api/assets.py:58`、`astrophoto/api/storage.py:99-103` | IMPLEMENTED_UNVERIFIED | GA-06 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:81](evidence/subagents/assets-equipment.md) |
| A-19 | POST `/assets/imports/{id}/cancel` → operations.cancel；请求取消。`astrophoto/api/assets.py:59`、`astrophoto/api/storage.py:99-103` | IMPLEMENTED_UNVERIFIED | GA-06 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:82](evidence/subagents/assets-equipment.md) |
| A-20 | POST `/assets/imports/{id}/retry` → operations.retry；重试任务。`astrophoto/api/assets.py:60`、`astrophoto/api/storage.py:99-103`；通用状态边界另由 backend 审计。 | IMPLEMENTED_UNVERIFIED | GA-05 / GA-06 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:83](evidence/subagents/assets-equipment.md) |
| A-21 | POST `/assets/{id}/relocate` → `AssetService.relocate(new_path)`；更新外部位置。`astrophoto/api/assets.py:31-32,61`、`astrophoto/assets/service.py:67-84` | IMPLEMENTED_UNVERIFIED | GA-07 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:84](evidence/subagents/assets-equipment.md) |
| A-22 | PATCH `/assets/{id}/sessions` → `set_session(session_id,attached)`；增删映射。`astrophoto/api/assets.py:46-50,62`、`astrophoto/assets/service.py:86-97` | IMPLEMENTED_UNVERIFIED | GA-08 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:85](evidence/subagents/assets-equipment.md) |
| A-23 | GET `/assets/{id}/availability` → `resolve_asset`；available/reason，检查文件。`astrophoto/api/assets.py:35-43,63` | IMPLEMENTED_UNVERIFIED | GA-07 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:86](evidence/subagents/assets-equipment.md) |
| A-24 | GET `/equipment` → `list_equipment`；type/q/archived/after/limit，返回 total/items/next。`astrophoto/api/equipment.py:11-12,83`、`astrophoto/equipment/service.py:104-119` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:87](evidence/subagents/assets-equipment.md) |
| A-25 | GET `/equipment/{id}` → `get_equipment`；规格及使用情况。`astrophoto/api/equipment.py:15-16,84`、`astrophoto/equipment/service.py:121-123` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:88](evidence/subagents/assets-equipment.md) |
| A-26 | POST `/equipment` → `create_equipment`；类型、名称及规格，201 与新实体，事务插入。`astrophoto/api/equipment.py:19-20,85`、`astrophoto/equipment/service.py:125-134` | IMPLEMENTED_UNVERIFIED | GA-09 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:89](evidence/subagents/assets-equipment.md) |
| A-27 | PATCH `/equipment/{id}` → `update_equipment`；expected_version 和修改字段；CAS 及规格更新。`astrophoto/api/equipment.py:23-24,86`、`astrophoto/equipment/service.py:136-144` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-10 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:90](evidence/subagents/assets-equipment.md) |
| A-28 | DELETE `/equipment/{id}` → `delete_unused_equipment`；expected_version，成功 204；拒绝被引用。`astrophoto/api/equipment.py:34-36,87`、`astrophoto/equipment/service.py:153-160` | VERIFIED：独立临时 DB 删除以及调用者状态检查 | GA-10 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:91](evidence/subagents/assets-equipment.md) |
| A-29 | POST `/equipment/{id}/archive` → `set_archived(...,True)`；expected_version，设置时间。`astrophoto/api/equipment.py:27-31,88`、`astrophoto/equipment/service.py:146-151` | IMPLEMENTED_UNVERIFIED | GA-10 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:92](evidence/subagents/assets-equipment.md) |
| A-30 | POST `/equipment/{id}/restore` → `set_archived(...,False)`；清除归档时间。`astrophoto/api/equipment.py:89`、`astrophoto/equipment/service.py:146-151` | IMPLEMENTED_UNVERIFIED | GA-10 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:93](evidence/subagents/assets-equipment.md) |
| A-31 | GET `/optical-trains` → `list_trains`；q/status/archived/after/limit，total/items/next。`astrophoto/api/equipment.py:39-40,90`、`astrophoto/equipment/trains.py:99-143` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-11 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:94](evidence/subagents/assets-equipment.md) |
| A-32 | POST `/optical-trains` → `create_train`；名称、备注、可选 draft，201；事务插入。`astrophoto/api/equipment.py:43-44,91`、`astrophoto/equipment/trains.py:145-157` | IMPLEMENTED_UNVERIFIED | GA-09 / GA-11 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:95](evidence/subagents/assets-equipment.md) |
| A-33 | GET `/optical-trains/{id}` → `get_train`；当前配置、设备与摘要。`astrophoto/api/equipment.py:47-48,92`、`astrophoto/equipment/trains.py:44-76,159-161` | IMPLEMENTED_UNVERIFIED | GA-11 / GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:96](evidence/subagents/assets-equipment.md) |
| A-34 | DELETE `/optical-trains/{id}` → `delete_train`；expected_version，204，事务删除配置和旧历史。`astrophoto/api/equipment.py:51-53,93`、`astrophoto/equipment/trains.py:83-97` | VERIFIED：SQLite 回滚和 aiohttp 删除 | GB-06 / GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:97](evidence/subagents/assets-equipment.md) |
| A-35 | GET `/optical-trains/{id}/draft` → `get_draft`；读取 draft，可为空。`astrophoto/api/equipment.py:56-57,94`、`astrophoto/equipment/trains.py:163-166` | IMPLEMENTED_UNVERIFIED | GA-11 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:98](evidence/subagents/assets-equipment.md) |
| A-36 | PUT `/optical-trains/{id}/draft` → `save_draft`；draft、expected_draft_version，更新配置并返回版本。`astrophoto/api/equipment.py:60-61,95`、`astrophoto/equipment/trains.py:169-194` | VERIFIED：旧版本冲突；归档设备关联保护缺失 | GA-09 / GA-11 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:99](evidence/subagents/assets-equipment.md) |
| A-37 | GET `/optical-trains/{id}/revisions` → `list_revisions`；读取历史列表。`astrophoto/api/equipment.py:64-65,96`、`astrophoto/equipment/trains.py:196-201` | IMPLEMENTED_UNVERIFIED | GA-12 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:100](evidence/subagents/assets-equipment.md) |
| A-38 | GET `/optical-trains/{id}/revisions/{revision_id}` → `get_revision`；读取校验过的历史快照。`astrophoto/api/equipment.py:68-69,98`、`astrophoto/equipment/trains.py:21-35,203-205` | IMPLEMENTED_UNVERIFIED | GA-12 / GA-13 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:101](evidence/subagents/assets-equipment.md) |
| A-39 | POST `/optical-trains/{id}/revisions` → `legacy_revision_write`，410；本聊天已取消多版本，停用为预期。`astrophoto/api/equipment.py:72-73,97` | VERIFIED：HTTP 410 回归 | GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:102](evidence/subagents/assets-equipment.md) |
| A-40 | PATCH `/optical-trains/{id}/revisions/{revision_id}` → 检查存在后 `REVISION_IMMUTABLE`，409。`astrophoto/api/equipment.py:76-78,99` | IMPLEMENTED_UNVERIFIED | GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:103](evidence/subagents/assets-equipment.md) |
| A-41 | DELETE `/optical-trains/{id}/revisions/{revision_id}` → 同 A-40；409。`astrophoto/api/equipment.py:76-78,100` | IMPLEMENTED_UNVERIFIED | GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:104](evidence/subagents/assets-equipment.md) |
| A-42 | PUT `/optical-trains/{id}/default-revision` → `legacy_revision_write`，410；停用为预期。`astrophoto/api/equipment.py:72-73,101` | VERIFIED：HTTP 410 回归 | GA-12 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:105](evidence/subagents/assets-equipment.md) |
| A-43 | POST `/optical-trains/{id}/archive` → `set_archived(...,True)`，版本 CAS。`astrophoto/api/equipment.py:27-31,102`、`astrophoto/equipment/trains.py:207-212` | IMPLEMENTED_UNVERIFIED | GA-11 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:106](evidence/subagents/assets-equipment.md) |
| A-44 | POST `/optical-trains/{id}/restore` → `set_archived(...,False)`，版本 CAS。`astrophoto/api/equipment.py:103`、`astrophoto/equipment/trains.py:207-212` | IMPLEMENTED_UNVERIFIED | GA-11 | 真实临时 SQLite/文件，见 06 与 assets-equipment | [assets-equipment.md:107](evidence/subagents/assets-equipment.md) |
| N-01 | `vue-basic`：V3 输入 `CUSTOM_VUE_COMPONENT_BASIC` dict，输出 IMAGE；验证 image 字符串后调用 host `get_annotated_filepath` → `LoadImage.load_image`，无本节点持久写入（nodes/ComfyUIFEExampleVueBasic.py:6-26）。历史节点保留；旧式 NODE_CLASS_MAPPINGS 不存在，注册测试列出四节点（tests/nodes/test_registration.py:4-22）。 | VERIFIED：绘图 V3 注册与 mock LoadImage，真执行未重跑 | GN-01 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:7](evidence/subagents/nodes-siril.md) |
| N-02 | `AstroPhotoImagePath`：socketless string 原样输出自定义 IMAGE_PATH，无 IO 或验证（nodes/scientific.py:10-25）；是独立手工路径入口，消费者负责检查。 | VERIFIED：stub 路径透传与真实 schema | NO_GUARD_FOUND（入口无独立校验） | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:8](evidence/subagents/nodes-siril.md) |
| N-03 | `AstroPhotoFITSSource`：ASTRO_FITS_ASSET → IMAGE_PATH，解析资产/路径、只读 FITS 验证并 UI 返回身份；fingerprint 基于文件 stat，异常 NaN 触发重算（nodes/scientific.py:40-61）。 | VERIFIED：文件变动 fingerprint、真实 schema | GN-01 / GN-02 / GN-09 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:9](evidence/subagents/nodes-siril.md) |
| N-04 | `AstroPhotoSirilAutoStretch`：IMAGE_PATH → IMAGE_PATH，三个参数，输出节点，fingerprint 永远 NaN；正式运行产物为新资产路径，UI 携带资产、来源、原始参数；发客户端事件（nodes/scientific.py:64-111）。 | VERIFIED：真实 schema 与正式服务 CLI，宿主未队列执行 | GN-01 / GN-04 / GN-05 / GN-06 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:10](evidence/subagents/nodes-siril.md) |
| N-05 | FITS：选择首个有效 2D mono 或首轴 3 的 RGB 图像 HDU；只读 memmap、不缩放加载，记录 BITPIX、有限元数据与坐标；preview 独立 PNG 代理，64 行分块 float64，NaN/Inf 置零，裁剪并可缩放；源前后 stat fingerprint 检查（astrophoto/siril/frames.py:61-154）。不把 PNG 作为科学输出。 | VERIFIED：有限 FITS RGB/截断样本 | GN-02 / GN-03 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:11](evidence/subagents/nodes-siril.md) |
| N-06 | 软件：平台目录/PATH 最多 8 个候选，逐一执行版本和 64×64 RGB 真实操作能力探测；严格版本 1.4.5，保存前验证二进制身份并原子配置；启用必须已有可验证配置，关闭/删除配置（astrophoto/siril/software.py:18-53,90-201）。 | VERIFIED：Windows 1.4.5 probe 与旧配置保留样本 | GN-05 / GN-12 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:12](evidence/subagents/nodes-siril.md) |
| N-07 | 执行：固定 SSF 含 requires、setcpu 4、setext、load、set32bits、autostretch、save；shell=False，独立临时目录、离线配置，轮询 checkpoint 并 kill/wait；复制源，处理副本，运行前后检查源 stat+SHA256（astrophoto/siril/processing.py:24-47,57-111,137-156；software.py:56-82）。 | VERIFIED：正式处理真实 CLI | GN-04 / GN-05 / GN-10 / GN-13 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:13](evidence/subagents/nodes-siril.md) |
| N-08 | 正式输出：workspace lease 下 UUID 文件夹、manifest、scratch，成功校验尺寸后发布 FITS、hash 和 DB 资产；失败删除输出、记录失败/取消；重启只清理属于本实例且未登记的运行（processing.py:159-246）。 | VERIFIED：真实 CLI 输出、取消样本和重启清理 fixture | GN-06 / GN-10 / GN-13 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:14](evidence/subagents/nodes-siril.md) |
| N-09 | 预览：owner 新任务取消该 owner 旧 queued/running，thread jobs，完成任务在后续 start 按 900 秒/128 条淘汰；源 PNG 先产生，formal ID 校验 receipt/hash 或运行候选并按源 revision、参数 hash、软件指纹、renderer 和尺寸复用；前后尺寸和 WCS/ROWORDER 对齐检查（previews.py:18-83,118-215）。shutdown 设置停止标记并 join（47-60）。 | IMPLEMENTED_UNVERIFIED | GN-07 / GN-14 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:15](evidence/subagents/nodes-siril.md) |
| N-10 | HTTP：软件 GET/discover/save/delete/enabled；资产分页；预览设置 GET/PUT；POST 任务、GET 状态、cancel、validate、before/after PNG，202 异步任务；隐藏 cache_key，PNG no-store/nosniff（astrophoto/api/siril.py:14-109）。 | IMPLEMENTED_UNVERIFIED | GN-08 / GN-11 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:16](evidence/subagents/nodes-siril.md) |
| N-11 | 资产选择列表：`frame_assets(after)` 查询后缀并按 ID 取 101 项，最多返回 100 条和 next；DB 只读（frames.py:51-58）。后缀筛选不是 FITS 数据校验。 | IMPLEMENTED_UNVERIFIED | GN-08 / GN-11 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:55](evidence/subagents/nodes-siril.md) |
| N-12 | 解析：`resolve_input` 对 canonical UUID 走资产解析，其他先已登记路径，再回退直接路径；路径最终 `source_stat` → `checked_path`，要求绝对路径、拒绝 UNC、`..`、链接/reparse、网络卷和非普通文件（frames.py:17-36；storage/manager.py:25-34；storage/paths.py:12-36）。没有 import roots 约束，但受本地可信部署边界约束。 | VERIFIED：允许根外绝对路径是现行语义，见 D04 | GN-02 / GN-09 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:56](evidence/subagents/nodes-siril.md) |
| N-13 | HDU/头：首个二维或首轴三通道三维、正尺寸图像；hdu.verify(exception)、读取 data，记录八类头信息和 WCS 前缀；仅显示时转换并下采样（frames.py:61-115）。 | VERIFIED：真实 FITS 尺寸/精度/损坏样本 | GN-02 / GN-03 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:57](evidence/subagents/nodes-siril.md) |
| N-14 | 图片代理：全尺寸 uint8 缓冲，BSCALE/BZERO 物理转换、非有限归零、裁剪到 0..1，非 TOP-DOWN 行翻转，RGB 转 HWC，Pillow 双线性缩放编码内存 PNG；只缓存 PNG，科学原件不改（frames.py:118-154）。正整数 BITPIX 除以 2^BITPIX-1，浮点按 1 归一，非自动拉伸。 | IMPLEMENTED_UNVERIFIED | GN-03 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:58](evidence/subagents/nodes-siril.md) |
| N-15 | 参数归一和脚本：严格字段、float 有限、target 范围、真正 bool；linked 限 RGB；固定脚本写临时目录及隔离 config，输出缺失或日志错误则失败（processing.py:20-47）。 | VERIFIED：参数负面与真 CLI 固定脚本 | GN-04 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:59](evidence/subagents/nodes-siril.md) |
| N-16 | FITS 预处理：仅工作副本 update；扩展 HDU 转 primary，新文件替换；逐块非有限值变零，偏移存在时转换全图 float64 并删 scaling/blank；移除失效校验和（processing.py:57-111）。无明确科学精度无损保证；源不会由此直接修改。 | IMPLEMENTED_UNVERIFIED | GN-03 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:60](evidence/subagents/nodes-siril.md) |
| N-17 | 执行 probe：二进制签名/可执行验证 + `-v` 八秒、人工生成 FITS 实测十五秒，比较输出不相同、格式和形状；临时目录清理（software.py:24-53,135-155；processing.py:114-134）。 | IMPLEMENTED_UNVERIFIED | GN-05 / GN-12 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:61](evidence/subagents/nodes-siril.md) |
| N-18 | CLI 子进程：无 shell、固定 cwd、无 stdin、环境 LC_ALL/LANG=C，临时日志文件，轮询进程/取消，超时 kill/wait 并检查退出码；正式调用未给 timeout（software.py:56-82；processing.py:152）。 | VERIFIED：通用真实子进程与真实 CLI 样本 | GN-05 / GN-13 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:62](evidence/subagents/nodes-siril.md) |
| N-19 | 软件状态与配置：current 验证启用状态及持久二进制身份；save 先 probe 后持锁再次比身份、再写；clear 只清配置；enabled 严格 bool（software.py:90-172）。 | IMPLEMENTED_UNVERIFIED | GN-12 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:63](evidence/subagents/nodes-siril.md) |
| N-20 | 发现：PATH 和平台安装目录，去重并限制前八，probe 每项、保留错误状态；读本地并启动候选程序、不自动保存（software.py:174-201）。 | IMPLEMENTED_UNVERIFIED | GN-05 / GN-12 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:64](evidence/subagents/nodes-siril.md) |
| N-21 | 复制/一致性：空间估计、checkpoint、复制时 hash，处理前后身份、源 stat 和 hash 验证；scratch 有临时复制（processing.py:137-156；storage/manager.py:19-22,44-89）。 | IMPLEMENTED_UNVERIFIED | GN-06 / GN-09 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:65](evidence/subagents/nodes-siril.md) |
| N-22 | 正式发布：workspace lease 与 UUID 目录、manifest，成功后同卷 no-replace 发布、再次读取及 hash，DB 登记；失败删输出、写失败 receipt；output 和 receipt 是持久写入（processing.py:159-204；storage/manager.py:92-102）。 | VERIFIED：真实 CLI 返回+登记与字节原件 | GN-06 / GN-10 / GN-13 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:66](evidence/subagents/nodes-siril.md) |
| N-23 | 启动恢复：初始化 storage、cache、workspace 后恢复；仅本实例、对应 workspace、UUID、producer、running/completed 且 DB 无资产的 receipt；删已知 scratch 文件、未登记输出、标 interrupted；异常日志延后（storage/runtime.py:56-74；processing.py:207-246）。 | VERIFIED：隔离恢复 | GN-06 / GN-10 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:67](evidence/subagents/nodes-siril.md) |
| N-24 | 预览生命周期：start 按 owner 替换未完任务；cancel 只设置 stop 并返回当下 state；线程 finally 移除 worker，shutdown 停止并 join；已完任务仅在后续 start 清理（previews.py:18-101）。 | PARTIAL：取消实现存在，成功/压力/清理验证不足 | GN-07 / GN-13 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:68](evidence/subagents/nodes-siril.md) |
| N-25 | 预览缓存：先缓存 before，记录 revision、宽高、通道和标准参数；正式输出走 receipt/hash 认证；候选按输入、参数、CLI fingerprint、renderer 版本和 longest_edge 查找 ready job，cache 存 PNG（previews.py:130-201）。 | IMPLEMENTED_UNVERIFIED | GN-07 / GN-14 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:69](evidence/subagents/nodes-siril.md) |
| N-26 | 预览读取与校验：路径 UUID、side 限 before/after，读取检查源 stat 和 formal 输出 stat；validate 对所有现存图做 cache 校验及候选软件身份校验（api/siril.py:71-91；previews.py:103-128）。PNG 含 no-store/nosniff。 | IMPLEMENTED_UNVERIFIED | GN-07 / GN-11 / GN-14 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:70](evidence/subagents/nodes-siril.md) |
| N-27 | 设置：GET longest edge/options、固定 canvas 和 revision；PUT 校验 expected_revision、edge 和可选 canvas，但只写 edge；revision 乐观锁更新（api/siril.py:39-56；core/config.py:16-20,90-109；storage/runtime.py:76-92）。 | IMPLEMENTED_UNVERIFIED | GN-08 / GN-15 | 节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril | [nodes-siril.md:71](evidence/subagents/nodes-siril.md) |
| F-01 | 单一扩展入口注册 Sidebar 和科学节点：main.tsx:10–17 → host/sidebar.tsx:9–33；重复 render 复用，同容器外替换 destroy，Locale watcher 随根释放。 · IMPLEMENTED_UNVERIFIED；GF-01；T-lifecycle | VERIFIED：Chromium 真宿主单 root；重复卸载由 JSDOM 探针 | GF-01 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:11](evidence/subagents/frontend.md) |
| F-02 | Nodes/Assets/Settings 三主 Tab，Assets 默认，键盘 focus/selection 分离；App.tsx:12–27 → shared/SidebarTabs.tsx。 · IMPLEMENTED_UNVERIFIED；T-navigation:15 | VERIFIED：真宿主中三栏可见 + 隔离 Jest | GF-01 / GF-15 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:12](evidence/subagents/frontend.md) |
| F-03 | Nodes 查询 object_info，搜索、类别/排序、展开树、详情；NodesPage.tsx:22–133 → NodeTree.tsx:12–102 → api/nodes.ts；切视图保留状态。 · IMPLEMENTED_UNVERIFIED；GF-02；T-navigation:32,57,96、T-search | IMPLEMENTED_UNVERIFIED | GF-02 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:13](evidence/subagents/frontend.md) |
| F-04 | 添加、拖拽节点至当前画布；NodesPage.tsx:93,133 → host/canvas.ts:11–35、dragDrop.ts:3–34，修改 Comfy graph 而非业务数据库。 · IMPLEMENTED_UNVERIFIED；GF-03；T-canvas、T-host-runtime | IMPLEMENTED_UNVERIFIED | GF-03 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:14](evidence/subagents/frontend.md) |
| F-05 | 节点收藏读写宿主 Comfy.NodeLibrary.Bookmarks.V2；NodesPage.tsx:16–22,72–73；设置失败回读并显示错误。 · IMPLEMENTED_UNVERIFIED；GF-04；测试映射未完成 | IMPLEMENTED_UNVERIFIED | GF-04 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:15](evidence/subagents/frontend.md) |
| F-06 | Assets 搜索、排序/筛选；导入目录预览然后开始异步操作、引用/复制选择及 workspace，重新定位路径；AssetsPage.tsx:17–72 → ImportDialog.tsx:6–71 → api/storage.ts。 · PARTIAL；GF-05；T-navigation:140、T-storage-host；筛选是否实际作用于服务数据须进一步验证 | PARTIAL：资产引入及查看，完整 Session 无 UI | GF-05 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:16](evidence/subagents/frontend.md) |
| F-07 | Settings 模块导航、系统状态、未实现模块占位；SettingsPage.tsx:12–49；agent 等并非已有业务能力。 · PARTIAL；T-navigation | PARTIAL：占位与实装区分 | GF-02 / GF-15 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:17](evidence/subagents/frontend.md) |
| F-08 | Storage 默认导入模式、workspace 添加/重命名/迁移/重定位/启停/移除/设默认，Cache 路径/容量配置与清理；StoragePage.tsx:20–215 → api/storage.ts → /astrophoto/v1/storage。服务持久化，前端提供 expected_revision 和 operation idempotency key。 · IMPLEMENTED_UNVERIFIED；GF-06；T-storage | IMPLEMENTED_UNVERIFIED | GF-06 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:18](evidence/subagents/frontend.md) |
| F-09 | Equipment 设备搜索、过滤、分页、按类型新增/编辑、详情、归档/删除；EquipmentPage.tsx、EquipmentList.tsx:10–54、EquipmentForm.tsx、EquipmentDetails.tsx → api/equipment.ts。 · IMPLEMENTED_UNVERIFIED；GF-07、GF-08；T-equipment:40,72,195 | IMPLEMENTED_UNVERIFIED | GF-07 / GF-08 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:19](evidence/subagents/frontend.md) |
| F-10 | Optical trains 草稿创建/编辑、器材快速添加、选择相机/光学件/附件/滤镜、附件排序、估算、删除；OpticalTrainEditor.tsx:14–129 → api/equipment.ts；发布/版本历史并非现有 UI（equipment-host.mjs:156,209 断言缺席）。 · PARTIAL；GF-07、GF-08；T-equipment:126,180,195 | IMPLEMENTED_UNVERIFIED：单配置为目标，隔离 UI 探针覆盖部分流 | GF-07 / GF-08 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:20](evidence/subagents/frontend.md) |
| F-11 | Software 页面 Siril 自动发现、候选选择、手动路径验证、启停和删除；PixInsight 控件禁用；SoftwarePage.tsx:7–114 → api/siril.ts:14–28。 · IMPLEMENTED_UNVERIFIED；GF-09；T-siril:8 | IMPLEMENTED_UNVERIFIED：旧测试与当前 DTO/入口不一致，见 06 | GF-09 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:21](evidence/subagents/frontend.md) |
| F-12 | Environment 预览分辨率选择、revision 保存、冲突提示；EnvironmentPage.tsx:10–59 → api/previewSettings.ts，成功触发变更事件。 · IMPLEMENTED_UNVERIFIED；GF-06；未找到专门测试，需全量核实 | IMPLEMENTED_UNVERIFIED | GF-06 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:22](evidence/subagents/frontend.md) |
| F-13 | SourcePicker 选服务器侧 FITS 资产或输入路径，显示加载/错误、刷新；host/scientific.tsx:217–247。 · IMPLEMENTED_UNVERIFIED；GF-10；T-siril-host | IMPLEMENTED_UNVERIFIED | GF-10 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:23](evidence/subagents/frontend.md) |
| F-14 | 科学节点候选：每 200ms 读取输入来源、参数与正式执行记录，400ms 去抖调用 renderCandidate，显示主图和状态；scientific.tsx:68–116,145–179 → api/siril.ts:64–105 → preview jobs。&#124; PARTIAL；GF-10、GF-11；T-siril-host；隐藏时仍请求，是否违背最终要求需确认 | PARTIAL：源码存在，真实候选竞态未测 | GF-10 / GF-11 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:24](evidence/subagents/frontend.md) |
| F-15 | Inspector side/wipe/single、双图对齐门控、缩放、100%、fit、拖动画布/分割线、键盘滑块、布局分隔、焦点恢复；nodePreview/Inspector.tsx:18–161。 · IMPLEMENTED_UNVERIFIED；GF-12；T-siril:28、T-siril-host | VERIFIED：通用组件 CSS 探针，非真实 NodeView | GF-12 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:25](evidence/subagents/frontend.md) |
| F-16 | 实际科学节点 Inspector 注入数值输入、linked 开关、reset 并写 graph；scientific.tsx:150–193。符合用户最新确认的可编辑要求。 · IMPLEMENTED_UNVERIFIED；GF-13；T-siril:28 仅测通用展示，未覆盖实际编辑调用 | IMPLEMENTED_UNVERIFIED：实际 Inspector 调参同步与重置待回归 | GF-13 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:26](evidence/subagents/frontend.md) |
| F-17 | Vue 绘图：画笔/颜色/大小/橡皮/清空，鼠标触摸，PNG workflow 值恢复，上传至宿主；frontend/src/main.ts、components/{DrawingApp,DrawingBoard,ToolBar,VueExampleComponent}.vue。 · IMPLEMENTED_UNVERIFIED；GF-14；T-vue | VERIFIED：Chromium 真实 Canvas 和模拟上传 | GF-14 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:27](evidence/subagents/frontend.md) |
| F-18 | 双语与主题：host/locale.ts:4–16 watcher 和卸载，i18n/index.ts 与 ui/src/i18n/locales/{en,zh}/main.json；styles/theme.css 使用宿主主题；Vue locales 在根 locales/。 · IMPLEMENTED_UNVERIFIED；GF-15；T-i18n、T-host-runtime | VERIFIED：中英资源断言与中文版真宿主，未改真实主题 | GF-15 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:28](evidence/subagents/frontend.md) |
| F-19 | 复用原生 Vue 下拉与多选的 React 桥及搜索控件；shared/{ComfySingleSelect,ComfyMultiSelect,SearchField,SearchOptions}.tsx → frontend/src/vendor/comfyui/。 · IMPLEMENTED_UNVERIFIED；GF-16；T-search；vendor 完整审计缺口 | IMPLEMENTED_UNVERIFIED | GF-16 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:29](evidence/subagents/frontend.md) |
| M-01 | CLI `astrophoto-mcp` / `python -m astrophoto_mcp`，`--version` 或 `--comfy-url` → `resolve_comfy_url` → `create_server` → FastMCP stdio，无 banner，stdout 协议。无常驻 HTTP 服务或数据库写入（`mcp/pyproject.toml:18`, `mcp/src/astrophoto_mcp/__main__.py:9-23`）。 | VERIFIED：真实 stdio 子进程 | GM-01 / GM-06 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:11](evidence/subagents/mcp-packaging.md) |
| M-02 | `version()` 无参 → `{name, version}`，仅本地安装包版本；`connection_status()` 无参 → `diagnose` → GET `system_stats`、`object_info/vue-basic` → JSON 文本 `{reachable,extension_registered,system}`，不提供远端版本握手（`tools/status.py:11-24`, `client.py:9-14`, `api/comfy.py:6-22`）。 | VERIFIED：真实 stdio version／MockTransport connection | GM-05 / GM-06 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:12](evidence/subagents/mcp-packaging.md) |
| M-03 | 配置 `ASTROPHOTO_EQUIPMENT_READ_TOKEN` 合法且 URL 为根路径 IP loopback 才注册六个只读工具：`equipment_list(equipment_type?,query,include_archived,cursor?,limit)`、`equipment_get(equipment_id)`、`optical_train_list(query,include_archived,cursor?,limit)`、`optical_train_get(train_id)`、`optical_train_revision_list(train_id)`、`optical_train_revision_get(train_id,revision_id)`；分别 GET `astrophoto/v1/equipment[/{id}]`、`optical-trains[/{id}[/revisions[/{revision_id}]]]`；传 bearer，返回验证后的 DTO；没有写操作（`server.py:19-25`, `tools/equipment.py:9-47`, `api/equipment.py:70-116`）。每请求新建并关闭 HTTP 客户端，不直接访问数据库。 | IMPLEMENTED_UNVERIFIED | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:13](evidence/subagents/mcp-packaging.md) |
| M-04 | 仅包内 `skills/**/SKILL.md` 存在时添加 `SkillsDirectoryProvider`，无产品 skill；发现和验证依赖框架，未实现用户 Skills 安装 CLI（`server.py:26-30`）。 | PARTIAL：provider 支持，当前无产品 Skill | GM-06 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:14](evidence/subagents/mcp-packaging.md) |
| M-05 | 独立 MCP Hatch wheel/sdist；根扩展固定同版本 MCP、Python >=3.11；根 uv workspace 开发使用 workspace source，Registry 构建改写运行时 metadata 和 requirements，从 PyPI 安装（`pyproject.toml:1-32`, `mcp/pyproject.toml:1-32`, `scripts/release.py:123-147`）。版本 0.0.1，FastMCP 4.2.0。 | VERIFIED：两套根测试临时 Wheel/sdist/Registry | GM-07 / GM-08 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:15](evidence/subagents/mcp-packaging.md) |
| M-06 | Vite Vue+React 单入口 `entry.ts` 输出 `js/main.js`/CSS，`comfy:app/api` 外置相对 `../../scripts/{app,api}.js`，保持代理前缀；构建不清空输出、禁 sourcemap（`frontend/vite.config.mts:7-37`）。 | VERIFIED：隔离 Vite 字节一致、Chromium proxy stub | GM-09 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:16](evidence/subagents/mcp-packaging.md) |
| M-07 | CI Python 3.11/3.12 frozen uv/pnpm、前后端检查、模拟与 aiohttp 集成、包检查、构建和独立安装；tag release 先复用 CI，再 PyPI Trusted Publishing，随后确认公开安装，最后 Registry（`.github/workflows/ci.yml:13-71`, `release.yml:14-71`）。 | IMPLEMENTED_UNVERIFIED：本地检查与 CI 运行分开 | GM-07 / GM-08 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:17](evidence/subagents/mcp-packaging.md) |
| M-08 | Siril、资产操作、工作流执行与 Canvas bridge、节点检索、知识/记忆/实验的业务 MCP 工具及运行时跨包版本握手未发现实现；设备六个读工具不能推论这些领域已实现。 | PLANNED：新增业务 tools | 不适用 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:18](evidence/subagents/mcp-packaging.md) |
| M-09 | equipment_get：canonical ID → GET /equipment/{id} → DTO；成功调用的独立用例未定位（mcp/src/astrophoto_mcp/tools/equipment.py:21–24）。 | IMPLEMENTED_UNVERIFIED | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:46](evidence/subagents/mcp-packaging.md) |
| M-10 | optical_train_list：分页与归档筛选 → GET /optical-trains → 列表；真调用未验证（mcp/src/astrophoto_mcp/tools/equipment.py:26–31）。 | IMPLEMENTED_UNVERIFIED | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:47](evidence/subagents/mcp-packaging.md) |
| M-11 | optical_train_get：按 ID 读取 train DTO；不写库（mcp/src/astrophoto_mcp/tools/equipment.py:33–36）。 | IMPLEMENTED_UNVERIFIED | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:48](evidence/subagents/mcp-packaging.md) |
| M-12 | optical_train_revision_list：按 train ID → 兼容历史 GET；不写库（mcp/src/astrophoto_mcp/tools/equipment.py:38–41）。 | IMPLEMENTED_UNVERIFIED | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:49](evidence/subagents/mcp-packaging.md) |
| M-13 | optical_train_revision_get：两个 ID → 只读快照 DTO（mcp/src/astrophoto_mcp/tools/equipment.py:43–47）。 | IMPLEMENTED_UNVERIFIED | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:50](evidence/subagents/mcp-packaging.md) |
| M-14 | equipment_list：设备类型与搜索、归档筛选 → 设备分页 DTO；MockTransport 实际调用（mcp/src/astrophoto_mcp/tools/equipment.py:9–19）。 | VERIFIED：FastMCP 内存 + MockTransport | GM-02 / GM-03 / GM-04 | MockTransport/真 stdio/构件，见 06 与 mcp-packaging | [mcp-packaging.md:45](evidence/subagents/mcp-packaging.md) |
| F-20 | 保留宿主其他节点与目录的收藏条目，活动页 500ms 同步，忽略 folder 标识作为设备节点、现场失败回读。NodesPage.tsx:16–81 与 NodeTree.tsx:80。 | IMPLEMENTED_UNVERIFIED | GF-04 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:81](evidence/subagents/frontend.md) |
| F-21 | 科学输出面板主图折叠、手工刷新、固定画布几何；NodePreview.tsx / host/scientific.tsx:176–178。 | IMPLEMENTED_UNVERIFIED | GF-10 / GF-11 | Jest CSS 探针／Chromium／真 GET，见 06 与 frontend | [frontend.md:81](evidence/subagents/frontend.md) |
| P-01 | 完整 Capture Session 主实体、浏览和校准关联。当前是关系键和占位，astrophoto/database/models.py:36、frontend/ui/src/features/assets/AssetsPage.tsx。 | PLANNED | 不适用 | NOT_RUN | [决策](02_REQUIREMENTS_AND_DECISIONS.md) |
| P-02 | Observing Site / light-pollution domain。当前 Settings 注册表无该入口；没有业务服务/表。 | PLANNED | 不适用 | NOT_RUN | [决策](02_REQUIREMENTS_AND_DECISIONS.md) |
| P-03 | Knowledge/RAG、Memory、Experiments 与试验历史。astrophoto/core/capabilities.py 为 false。 | PLANNED | 不适用 | NOT_RUN | [决策](02_REQUIREMENTS_AND_DECISIONS.md) |
| P-04 | 非本期的校准链、硬件驱动和 PixInsight 生产处理。Software 页仅计划项。 | PLANNED | 不适用 | NOT_RUN | [决策](02_REQUIREMENTS_AND_DECISIONS.md) |
| P-05 | 可认证的远程 Canvas/工作流创作、Siril MCP Tool 和资产写 Tool。现仅设备只读条件工具。 | PLANNED | 不适用 | NOT_RUN | [决策](02_REQUIREMENTS_AND_DECISIONS.md) |
| P-06 | 首期端口 ASTRO_FRAME 与新增光路发布/默认选择已明确替代。内部 AstroFrame 元数据与旧只读快照仍保留。 | OBSOLETE | 不适用 | NOT_RUN | [决策](02_REQUIREMENTS_AND_DECISIONS.md) |

---

# 防御性编程审计

以调用点为单位验证。矩阵的自动索引附在本页下文，保留子报告的源码位置和触发条件。静态存在、测试用例存在、通过三个层次分开；标明测试族只表示通往精确测试的导航。

| 检查项 | 实际机制、触发和结果 | 本轮验证范围 / 剩余缺口 |
|---|---|---|
| 空路径、非法相对路径、遍历、UNC、链接 | storage/paths.py:12–36 的 checked_path 进入 source_stat 和 Workspace 函数，拒绝不受支持路径与链接；注册位置验证 known root 和 marker，relative key 有前缀分隔 | test_reject_links_unc_and_relative_paths，真实临时文件与部分 Windows 路径。竞争替换和所有 junction 类型未验证 |
| 目录、权限、访问丢失 | AssetService._location/resolve_asset，storage/manager.source_stat；不存在、坏文件、读写受限映射结构化错误，storage handler 区分 ENOSPC、EACCES、EROFS、SQLite locked | 失联、只读/空间 fixture 与实际文件变更。真实 OS ACL、文件占用及网络盘条件未穷举 |
| 多卷、越界和复制发布 | stage_copy 基于 fingerprint 侦测源修改；独立 staging、no-replace publish，迁移校验 SHA-256 后切 DB 路径，原源保留 | 同卷中断及竞争失败，跨盘本轮跳过。移除失败 plan 可能留受控目标文件 |
| 通用资产格式和防覆盖 | 枚举 stat/根验证，不检查内容后缀；SHA 校验等级依路径而异；重复 operation key 锁与状态。reference 格式由消费者验证 | 通用格式没有额外 guard 是接口设计事实。内容等同、欺骗 stat、跨批重复未核实 |
| FITS 格式、维度、损坏 | frames.fits_frame → image_hdu → verify/readonly → 后置 fingerprint。限制后缀、2D/首维3、尺寸正数；坏内容为 FITS_INVALID | 真实 RGB/损坏截断、有改动，未覆盖不同 HDU、非法 WCS、权限、0 文件尺寸、header 警告全集 |
| 非有限数和大图 | frames.render_png 与 processing.prepare_fits 转换副本；源 FITS 不覆写。PNG resize 在全尺寸 uint8 缓冲后，白名单分辨率不等于输入内存上限 | 样本精度与安全，缺 NaN/Inf 元数据矩阵、多 HDU/BITPIX、大图资源压力与降级 |
| 参数、互斥与状态 | storage.fields 精确字段；UUID canonical；processing.parameters finite shadowsclip / targetbg 0..1 / bool linked；preview 资产与路径互斥。设备 DTO 类型、数值、重复与事务版本 | schema、错误字段、越界/假 bool、并发均有测试。合法极端 finite shadowsclip、归档设备新关联、前端覆盖未完善 |
| API 授权与 JSON | trusted_local 明确开启、本机请求及 Host/Origin/Fetch-Site、无转发。设备 Bearer 只 GET，浏览器 same-origin 与 header；JSON 64 KiB，统一 request_id 和错误 | aiohttp 错域/读令牌/无头；公开 status 有 data_home。默认信任本机进程，未测反代配置/部署矩阵 |
| SQLite schema、初始化与复用 | 文件锁、identity/marker、Alembic baseline、真实 WAL、FK 和 schema 约束，异常 rollback；注册路由对已有 runtime 复用 | DB 损坏/并发/唯一与迁移 checkpoint。不能推断所有文件系统操作和数据库原子 |
| 重复、状态冲突与清理 | operation kind/key、plan/receipt、租约、owner 保护；Siril work UUID 和输出 hash，重启只动自有数据；光路 DELETE 在同事务恢复触发器 | 重入、进程退出、回滚、ID 同一性。取消/失败清理二次异常、所有并发和隔离边界未验证 |
| Siril 进程和版本 | software.executable → 允许名称/可执行签名与 stat；版本和真实探测成功才保存。run_cli 固定 args/cwd/temp、无 shell、exit code、取消或探测 timeout kill/wait | 错版本 Mock、真实 CLI、Python 子进程通用超时/取消；正式与候选无默认 timeout 是事实；进程树的后代和临时二次失败未验证 |
| 输出缺失/错误/保旧 | processing.check_output 尺寸通道、缓存/正式两个生命周期，file/DB 错误不注册新结果；正式结果关联 receipt/hash | 已有输出来自不重复 UUID 的真实测试，完整 FITS 科学等价性或 malformed 输出矩阵未覆盖 |
| React 并发、卸载、失配 | client timeout/abort，useResource 丢弃旧响应；scientific NodeView 对当前输入匹配结果，释放 Blob，Inspector 不对齐禁用 wipe；Sidebar root/destroy。API DTO 不满足即报错误 | JSDOM 配置问题计入真实状态；组件替身不等同宿主。真实 Node 删除、无 Host、DOM image onerror、语言缺 key、图像实验和数据竞争依各 Guard 条目 |
| 读配置失败与令牌密钥 | Config/Storage 初始化可降级，token 精确格式、CompareDigest，不记录秘密；MCP 独立 HTTP 验证并拒绝 redirect。环境 keep-old config | 负面手工配置、MCP Mock 与协议测试，可信真实进程 Token 对接未测 |
| 无机制 | N-02 手工 ImagePath 节点原样转发（下游检查），A-02 通用格式无内容 guard；F-20 收藏设置 read 缺宿主异常 fallback，MCP HTTP 无显式大小限，预览活跃总量无硬限 | 对部分功能属于 NO_GUARD_FOUND 或设计选择；风险按接手任务复核，不能虚构已防御。 |

## 使用矩阵

B / GB 为公共后端，A / GA 为资产设备，N / GN 为节点 Siril，F / GF 为前端，M / GM 为 MCP。每个 Guard 的精确正负向用例和物理副作用在对应证据报告与 [测试账本](evidence/test-inventory.md)。下方测试状态按本轮整合标注，存在局部通过时仍保留缺口。

## Guard 编号索引

| Guard | Feature | 触发 → 处理 → 回执/风险 | 本轮实际范围 | 精确证据 |
| --- | --- | --- | --- | --- |
| GB-01 | B-06, B-17, B-18, B-19, B-20, B-21, B-22, B-23, B-24, B-25, B-26, B-27, B-28, B-29, B-30, B-31 | 请求部署身份 → env 开关、listen 均回环、禁 multi-user/CORS → remote/Host/Origin/forwarded/Fetch-Site → 拒绝 → 403；storage snapshot 特例为 unavailable 200。`astrophoto/api/security.py:18`, `:25`, `astrophoto/api/storage.py:115`；T12。 | tests/integration/test_storage_api.py::test_http_storage_import_and_access_boundary — PASS：回环、header、Origin 与 capability 响应样本。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:40](evidence/subagents/backend.md) |
| GB-02 | B-18 | 设备 bearer → 仅 GET、无 Origin/Fetch-Site、43–256 ASCII token 且 constant-time 比较；浏览器路径要求 same-origin 与专用 header；不识别其他本地进程。`astrophoto/api/security.py:46`, `:60`；设备测试另查。 | tests/integration/test_equipment_api.py::test_equipment_and_train_api_permissions_receipts_and_errors — PASS：浏览器/只读 Token、错误 Origin/权限；无真实宿主 Token。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:41](evidence/subagents/backend.md) |
| GB-03 | B-01, B-07, B-17, B-19, B-20, B-21, B-22, B-23, B-24, B-25, B-26, B-27, B-28, B-29, B-30, B-31 | 非 JSON、超 65536 字节、非法 JSON、字段缺失/多余、非 canonical UUID → wrapper/DTO 拒绝 → `INVALID_REQUEST`；普通 storage 422，equipment 400。`astrophoto/api/storage.py:23`, `:32`, `:132`, `astrophoto/api/errors.py:33`；未逐项找到本范围断言。 | tests/integration/test_equipment_api.py::test_equipment_and_train_api_permissions_receipts_and_errors — PASS：坏 DTO/UUID 样本。JSON chunk 超限未定位。 部分负向；body 64 KiB/chunk 全矩阵未确认 | [backend.md:42](evidence/subagents/backend.md) |
| GB-04 | B-02, B-03, B-08, B-10, B-11, B-14, B-36 | 路径相对、UNC、链接/reparse、穿越、跨保留根重叠 → `checked_path`/`canonicalize_root`/`safe_join_workspace` 及 candidate 拒绝；底层不创建业务文件。`astrophoto/storage/paths.py:12`, `:39`, `:60`, `:77`, `:83`, `astrophoto/storage/locations.py:64`；T13 T18。 | tests/backend/test_storage.py::test_reject_links_unc_and_relative_paths — PASS：拒绝路径且真实目录保持空。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:43](evidence/subagents/backend.md) |
| GB-05 | B-09, B-12, B-14, B-17, B-34 | 磁盘不足/权限不足/满盘 → `choose_space`、读写异常 → `INSUFFICIENT_DISK_SPACE` 507 或 `STORAGE_PATH_UNWRITABLE` 422；operation 可保留 checkpoint。`astrophoto/storage/manager.py:37`, `astrophoto/api/storage.py:154`, `astrophoto/storage/operations.py:126`；T19。 | tests/backend/test_storage.py::test_copy_preflight_blocks_offline_read_only_full_and_unauthorized — PASS：模拟空间/状态；未真实耗尽卷。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:44](evidence/subagents/backend.md) |
| GB-06 | B-03, B-04, B-07, B-08, B-09, B-11, B-13, B-15, B-16, B-19, B-20, B-21, B-22, B-23, B-24, B-25, B-26, B-27, B-28, B-29, B-30, B-31, B-33, B-37 | 重复/并发修改 → 进程锁、workspace lease、revision 与唯一键；锁超时/active 为 busy，revision conflict 409；SQLite 事务异常回滚。`astrophoto/storage/locations.py:32`, `:36`, `:173`, `astrophoto/storage/operations.py:29`, `astrophoto/database/manager.py:120`；T08 T09 T13。 | tests/backend/test_storage.py::test_multi_process_bootstrap、test_foreign_keys_busy_rollback_and_backup、test_copy_override_idempotency_and_real_bytes — PASS；并发覆盖有限。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:45](evidence/subagents/backend.md) |
| GB-07 | B-09, B-10 | 默认 Workspace 停用/删除，含资产删除，原路径仍在线重定位，目标 marker 不符 → 拒绝，不删除目录或重绑定。`astrophoto/storage/locations.py:173`, `:202`, `:219`；T12 T13。 | tests/backend/test_storage.py::test_multiple_workspaces_default_disable_and_offline_relocation — PASS；全量删除拒绝与真实宿主无测试。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:46](evidence/subagents/backend.md) |
| GB-08 | B-13, B-14, B-15 | 迁移目标非空、未知源内容、staging 未恢复、引用丢失、源变动或 hash 不一致 → 在切换前失败，源保留；失败目标可留自有数据。`astrophoto/storage/migration.py:24`, `:48`, `:75`, `:134`；T16。 | tests/backend/test_storage.py::test_migration_verification_error_keeps_source — PASS；test_migration_actual_cross_volume SKIPPED。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:47](evidence/subagents/backend.md) |
| GB-09 | B-14, B-15, B-16, B-32, B-33, B-37 | 迁移取消和进程中断 → checkpoint/锁+持久 operation；提交后只恢复完成，不可撤销；复制阶段中间文件不保证被删除。`astrophoto/storage/operations.py:76`, `:90`, `:110`, `:126`, `astrophoto/storage/migration.py:150`；T15 T17。 | tests/backend/test_storage.py::test_migration_recovers_around_database_switch、test_process_exit_during_copy_resumes_own_staging — PASS；实际持久层隔离样本。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:48](evidence/subagents/backend.md) |
| GB-10 | B-11, B-12, B-34, B-35, B-36 | Cache 清理非自有文件、硬链接、正在使用条目、错误 marker → 不删或跳过；范围只能已知 bucket/all；scratch 只处理匹配且拥有 marker 的已知名称。`astrophoto/storage/cache.py:35`, `:80`, `:175`；T14。 | tests/backend/test_storage.py::test_cache_owner_entries_only_with_live_lease — PASS：live 锁、不认识的文件；descriptor crash 组合无测试。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:49](evidence/subagents/backend.md) |
| GB-11 | B-01, B-03, B-04 | 库丢失、损坏、revision 不匹配、WAL 不可用 → 保留既有文件、错误或 degraded，不创建假 ready；schema 校验包含模型及 trigger。`astrophoto/database/manager.py:64`, `:111`, `:128`；T07 T10。 | tests/backend/test_storage.py::test_never_replaces_an_existing_asset_database、test_explicit_wal_failure_has_no_fake_ready、test_legacy_dev_schema_is_preserved — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [backend.md:50](evidence/subagents/backend.md) |
| GB-12 | B-05, B-06, B-18 | 公共 status 的本地绝对 data_home → **NO_GUARD_FOUND**：`status_handler` 直接返回 `status_payload`，不经过存储授权或 no-store wrapper（`astrophoto/api/status.py:11`, `:26`）。是否适合远程部署需单独评估。 | tests/integration/test_host_runtime.py::test_running_comfyui_status_and_node — PASS 只证实 status，未断言敏感路径披露约束。 NO_GUARD_FOUND；直接 status payload 已静态复查 | [backend.md:51](evidence/subagents/backend.md) |
| GA-01 | A-01, A-03, A-04, A-05, A-16, A-17 | 未授权路径 → canonical roots 包含且不与受保护路径重叠 → `SOURCE_NOT_AUTHORIZED`；无写入；执行时重验。 · `astrophoto/assets/imports.py:33-42,213-217,241-245` | tests/backend/test_storage.py::test_copy_preflight_blocks_offline_read_only_full_and_unauthorized — PASS；业务源路径拒绝。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:28](evidence/subagents/assets-equipment.md) |
| GA-02 | A-01, A-03, A-16 | 选择非列表、零或超过100、非字符串 → `INVALID_SOURCES`；目录最多10000项、最多40000访问 → `TOO_MANY_FILES`；单项不可读记录失败。 · `astrophoto/assets/imports.py:44-47,59-103` | 未定位 100/10000/40000 边界的专项断言。test_http_storage_import_and_access_boundary 只覆盖基本预检。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:29](evidence/subagents/assets-equipment.md) |
| GA-03 | A-01, A-05, A-16, A-17 | 复制目标不存在/离线/只读/空间不足 → require/choose_space 抛错，任务记录 error，不注册资产；具体底层由 registry 审计。 · `astrophoto/assets/imports.py:105-116,125-128,145-152`；T-03 | tests/backend/test_storage.py::test_copy_preflight_blocks_offline_read_only_full_and_unauthorized — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:30](evidence/subagents/assets-equipment.md) |
| GA-04 | A-04 | 路径重复 reference → 相同 size/mtime skipped 并可追加 session；不同 metadata `DUPLICATE_ASSET`；NO_GUARD_FOUND 内容 hash / copy 内容去重。 · `astrophoto/assets/imports.py:220-231` | tests/backend/test_storage.py::test_reference_shared_sessions_leave_the_file_and_other_reference — PASS；同路径异内容但相同 size/mtime 不受此机制保护。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:31](evidence/subagents/assets-equipment.md) |
| GA-05 | A-05, A-06, A-07, A-17, A-20 | 执行中源变化 → fingerprint 比较/复制核验，`SOURCE_CHANGED`、清理 part、receipt failed；发布后 DB 异常保留 publishing 以恢复。 · `astrophoto/assets/imports.py:213-219,238-269`；T-04/T-05 | tests/backend/test_storage.py::test_copy_detects_inflight_source_change、test_copy_recovers_after_publish_before_db_commit — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:32](evidence/subagents/assets-equipment.md) |
| GA-06 | A-05, A-06, A-07, A-17, A-18, A-19, A-20 | staging 所有权 marker 不匹配 → `RECOVERY_REQUIRED`，不删除他人数据；取消 checkpoint 清 part，不撤销已完成条目；publishing 阶段不抢断。 · `astrophoto/assets/imports.py:153-191,238-250` | tests/backend/test_storage.py::test_cancel_partial_staging、test_process_exit_during_copy_resumes_own_staging — PASS；取消状态和孤儿 staging 有限。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:33](evidence/subagents/assets-equipment.md) |
| GA-07 | A-08, A-09, A-21, A-23 | relocate managed / size 变化 / 重复路径 → `ASSET_NOT_EXTERNAL` / `SOURCE_CHANGED` / `DUPLICATE_ASSET`；事务内拒绝；NO_GUARD_FOUND 同尺寸不同内容鉴别。 · `astrophoto/assets/service.py:67-84` | tests/backend/test_storage.py::test_reference_multiple_roots_mode_snapshot_and_relocation — PASS；同尺寸新文件的内容验证无此 Guard。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:34](evidence/subagents/assets-equipment.md) |
| GA-08 | A-08, A-10, A-22 | session 为空/非字符串/长度>120、asset 缺失、attached 非 bool → INVALID_REQUEST / ASSET_NOT_FOUND；数据库事务不更新。 · `astrophoto/assets/service.py:14-21,86-97`、`astrophoto/api/assets.py:46-50` | tests/backend/test_storage.py::test_reference_shared_sessions_leave_the_file_and_other_reference — PASS；Session 输入全矩阵未确认。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:35](evidence/subagents/assets-equipment.md) |
| GA-09 | A-11, A-12, A-13, A-24, A-25, A-26, A-27, A-31, A-32, A-36 | 设备/光路 JSON：未知字段、缺失、无效 UUID、非有限值或 bool 冒充数值、越界、重复 passband/组件、枚举不符 → `EQUIPMENT_VALIDATION_FAILED` 字段详情；事务前或事务回滚。 · `astrophoto/equipment/schemas.py:32-219`；数据库第二层约束 `astrophoto/database/equipment_models.py:11-155` | tests/backend/test_equipment.py::test_invalid_fields_never_persist、test_database_constraints_and_incompatible_same_version — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:36](evidence/subagents/assets-equipment.md) |
| GA-10 | A-11, A-12, A-27, A-28, A-29, A-30 | 设备并发更新/归档和删除 → expected_version 检查及 SQL CAS，版本不匹配 `EQUIPMENT_VERSION_CONFLICT`；引用 draft/revision 拒绝 `EQUIPMENT_REFERENCED`。 · `astrophoto/equipment/service.py:47-60,92-97,136-160` | tests/backend/test_equipment.py::test_equipment_lifecycle_and_optional_specs、test_single_configuration_concurrent_save_and_live_specs — PASS；UI 冲突合并未覆盖。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:37](evidence/subagents/assets-equipment.md) |
| GA-11 | A-13, A-14, A-31, A-32, A-33, A-35, A-36, A-43, A-44 | 草稿设备缺失/类型不对、归档 train、旧 draft 版本 → validation / `EQUIPMENT_TYPE_MISMATCH` / `TRAIN_ARCHIVED` / `DRAFT_VERSION_CONFLICT`，事务回滚；已归档设备是否可新关联 NO_GUARD_FOUND（组件校验只检查存在和类型）。 · `astrophoto/equipment/snapshots.py:13-22`、`astrophoto/equipment/trains.py:169-194` | tests/backend/test_equipment.py::test_incomplete_configuration_and_reference_validation — PASS；归档组件新关联不受后端 guard。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:38](evidence/subagents/assets-equipment.md) |
| GA-12 | A-14, A-33, A-34, A-37, A-38, A-39, A-40, A-41, A-42 | 历史不可变 → 更新/删除由 DB trigger 阻断，API 对旧写接口 410；删除 train 特意在同事务临时移除并恢复删除 trigger 后删除历史，失败回滚。 · `astrophoto/api/equipment.py:72-78`、`astrophoto/equipment/trains.py:83-97`、`astrophoto/database/equipment_models.py:162`；T-12 | tests/backend/test_equipment.py::test_legacy_train_delete_rolls_back_history_and_trigger、test_existing_default_loads_without_rewriting_legacy_history — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:39](evidence/subagents/assets-equipment.md) |
| GA-13 | A-15, A-18, A-24, A-25, A-35, A-37, A-38 | 权限/HTTP → 测试覆盖 trusted local、origin、proxy、bearer 只读；不得将复合输入拒绝归因于 Comfy-User 标头；拒绝 403、格式 400、校验 422、冲突 409、历史写 410；详细实际中间件条件由 backend agent 审计。 · `tests/integration/test_equipment_api.py:25-51,63-90`；`tests/integration/test_storage_api.py:27-38,68-85` | tests/integration/test_equipment_api.py::test_equipment_and_train_api_permissions_receipts_and_errors — PASS；复合拒绝条件不能单归某个标头。 部分见证或未测：按子报告精确测试及当前结果核对 | [assets-equipment.md:40](evidence/subagents/assets-equipment.md) |
| GN-01 | N-01, N-03, N-04 | 节点 runtime → storage 存在且 trusted_local → resolve → 失败 StorageError（scientific.py:28-37）；ImagePath 本身 NO_GUARD_FOUND。 | tests/nodes/test_image_io.py::test_invalid_widget_data_rejected_before_host_io — PASS；ImagePath 边界本身透传。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:20](evidence/subagents/nodes-siril.md) |
| GN-02 | N-03, N-05, N-12, N-13 | 路径 → 非空字符串；UUID 解析资产，否则已注册路径，找不到再直接 source_stat；suffix FIT/FITS/FTS、HDU shape、verify、异常映射 FITS_INVALID、前后指纹不一致 SOURCE_CHANGED（frames.py:17-36,61-115）。按 D04/D19 保留现行行为：直接路径未限定 import roots，但 source_stat → checked_path 会拒绝相对路径（storage/manager.py:25-34；storage/paths.py:12-19）；历史最新要求受授权路径，见 05_NODE_IMAGE_PATH_CONTRACT.md §5。trusted_local 是部署级限制，非路径授权。 | tests/backend/test_siril.py::test_direct_fits_path_outside_import_roots — PASS。 PASS：测试用例覆盖几个直接路径与损坏样本，用户路径授权为部署级 | [nodes-siril.md:21](evidence/subagents/nodes-siril.md) |
| GN-03 | N-05, N-13, N-14, N-16 | 坏轴/损坏/权限 → 符合形状才读，OSError/ValueError 等映射 FITS_INVALID；没有明确尺寸上限或内存预算 guard（render_png 全尺寸 uint8；prepare_fits 偏移且有非有限值可分配整图 float64）。FITS 校验不验证科学像素均有限；处理副本将 NaN/Inf 归零，科学语义改变需明确。多 HDU 取第一个符合而非拒绝多个有效图；非有限 BSCALE/BZERO 归零（frames.py:61-115,125-154；processing.py:57-111）。 | tests/backend/test_siril.py::test_frames_validate_precision_metadata_and_truncation — PASS；非有限值、超大图及多 HDU 全矩阵无测试。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:22](evidence/subagents/nodes-siril.md) |
| GN-04 | N-04, N-07, N-15 | 参数 → 精确字段，shadows 为有限数，target 0..1，linked 必须 bool，mono 强制 false → 安全数值格式脚本（processing.py:24-31,34-43）。shadowsclip 没有上下界，仅有限性；target NaN 因范围检查拒绝。 | tests/backend/test_siril.py::test_parameters_reject_untrusted_script_values、test_mono_normalizes_linked — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:23](evidence/subagents/nodes-siril.md) |
| GN-05 | N-04, N-06, N-07, N-17, N-18, N-20 | CLI → 绝对路径、允许名称、二进制签名及可执行权限；-v 必须精确 1.4.5，probe 真运行并比较结果；身份变化拒绝；无 shell，取消/timeout kill+wait（software.py:24-82,135-165）。**PARTIAL**：正式/候选 process 调用未传 timeout（processing.py:34,152）；probe 8/15 秒有超时。只校验输出维度/通道，非完整科学数据或像素非空验证（processing.py:50-54）。 | tests/backend/test_siril.py::test_real_cli_immutable_source_and_formal_output、test_runner_timeout_and_mid_process_cancellation — PASS；后者使用真实 Python 子进程。 PASS：真实 1.4.5、版本 Mock、真实通用子进程；无默认处理 timeout | [nodes-siril.md:24](evidence/subagents/nodes-siril.md) |
| GN-06 | N-04, N-08, N-21, N-22, N-23 | 正式处理 → 参数/软件/workspace → 租约、空间预算、临时副本 → 发布并登记；BaseException 失效产物删除和 receipt 状态；恢复只处理符合实例/路径/未注册的产物（processing.py:137-246）。manifest 和目录保留，非完整删除；写 manifest 本身失败的异常路径未证明完全回滚。 | tests/backend/test_siril.py::test_restart_reconciles_only_owned_unregistered_run、test_real_cli_direct_path_and_repeated_runs — PASS。 PASS：真实 CLI 输出与隔离文件/SQLite 恢复样本 | [nodes-siril.md:25](evidence/subagents/nodes-siril.md) |
| GN-07 | N-09, N-24, N-25, N-26 | preview → owner UUID、参数、互斥 asset_id/image_path、formal UUID（api/siril.py:59-68）→ stop checkpoint → 状态/图片；读取源及 formal revision 检查，validate 再验软件身份、cache（previews.py:62-128,130-206）。普通单张 image 读取不检查软件身份；任务 TTL 仅 start 时清理，活跃任务总量无硬上限，owner 是调用方提供 UUID，非授权身份；cache 一致性依赖 stat 指纹，stat 不变的内容替换未证明能检测。 | tests/integration/test_siril_api.py::test_scientific_api_access_source_and_cache — PASS；缺成功候选复用与竞态。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:26](evidence/subagents/nodes-siril.md) |
| GN-08 | N-10, N-11, N-27 | HTTP → fields 拒绝额外字段、canonical UUID、side 白名单；共享 storage route 权限边界仍需主审计核对（api/siril.py:59-109，api/storage.py:23-35）。PUT preview settings 验证 canvas 却仅传 preview_edge 给 update_settings；canvas_preview 无视存储配置并固定返回 480×320；故该兼容字段被接受但不生效（api/siril.py:49-56；core/config.py:18,100-109；storage/runtime.py:76-92）。前端将响应应用为 CSS 变量（frontend/ui/src/api/previewSettings.ts:17-18,25-53）；是否违反当前产品要求需对照最新决策，不能仅凭旧接口认定 bug。 | tests/integration/test_siril_api.py::test_scientific_api_access_source_and_cache — PASS：相关 API 权限；未确认 canvas 字段接受不生效。 部分 PASS：aiohttp 鉴权；配置兼容值不生效为静态观察 | [nodes-siril.md:27](evidence/subagents/nodes-siril.md) |
| GN-09 | N-03, N-12, N-21 | source_stat → checked_path 禁止相对、UNC、网络驱动器、链接及 reparse；不存在 SOURCE_NOT_FOUND，普通文件以外/OS 错误 SOURCE_UNREADABLE。更正上文早期疑虑：相对路径最终会被拒绝，不是未检查（storage/paths.py:12-36；storage/manager.py:25-34）。 | tests/backend/test_storage.py::test_reject_links_unc_and_relative_paths + test_direct_fits_path_outside_import_roots — PASS；Windows 设备和共享路径集合不全。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:95](evidence/subagents/nodes-siril.md) |
| GN-10 | N-07, N-08, N-22, N-23 | 图片写入 → 独立 scratch → no-replace 同卷 publish，目标已存在拒绝；清理仅允许单链接普通文件（storage/manager.py:92-127）。异常清理本身可能抛错；启动恢复也不删除未知 scratch 内容。 | tests/backend/test_siril.py::test_restart_reconciles_only_owned_unregistered_run — PASS：未注册输出和用户文件；同名并发未见专项。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:96](evidence/subagents/nodes-siril.md) |
| GN-11 | N-10, N-11, N-26 | HTTP JSON/身份/响应 → 先认证，再检查服务、JSON 类型及大小，动作在线程运行；StorageError 映射受控响应；精确字段和规范 UUID 拒绝额外值（api/storage.py:23-35,106-165；api/security.py:25-43；api/errors.py:14-40）。 | tests/integration/test_siril_api.py::test_scientific_api_access_source_and_cache — PASS；body 阈值/异常 JSON 未穷举。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:97](evidence/subagents/nodes-siril.md) |
| GN-12 | N-06, N-17, N-19, N-20 | 检查配置 → current 确认存储版本/二进制身份，save 探测成功且锁内身份复核才写；discover 最多 8 项，失败不自动覆盖（software.py:90-201）。 | tests/backend/test_siril.py::test_config_rejects_incompatible_version_and_keeps_previous、test_invalid_and_gui_paths_rejected — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:98](evidence/subagents/nodes-siril.md) |
| GN-13 | N-07, N-08, N-18, N-22, N-24 | 正式取消 → checkpoint 异常时 run_cli kill/wait、TemporaryDirectory 清理、formal_run 捕获 BaseException 删除 output 和记账；Interrupted 若为 Exception 会记录 failed，非 Exception（如 KeyboardInterrupt）记录 cancelled（software.py:56-82；processing.py:159-203）。 | tests/backend/test_siril.py::test_runner_timeout_and_mid_process_cancellation、test_real_cli_immutable_source_and_formal_output — PASS；正式阶段的全部取消窗口未覆盖。 部分见证或未测：按子报告精确测试及当前结果核对 | [nodes-siril.md:99](evidence/subagents/nodes-siril.md) |
| GN-14 | N-09, N-25, N-26 | formal preview → 固定 outputs/{UUID}/stretched.fit，receipt source identity/revision/parameters/state/asset_id 及 output SHA256；不符 PREVIEW_STALE；图片读取时仅 stat fingerprint（previews.py:103-116,130-142）。 | NOT_RUN：曾有真实宿主历史证据，本轮未运行前端 formal 预览脚本。 NOT_RUN：真实 formal receipt 之后的浏览器预览 | [nodes-siril.md:100](evidence/subagents/nodes-siril.md) |
| GN-15 | N-27 | canvas 旧参数 → 输入 64..4096 两个整数必须合法，PUT 忽略该值；GET 恒返回默认；内部 update_settings 虽可保存 preview_canvas，但 getter 仍忽略存储值。是兼容接口实际语义，不应推断用户当前要求可配置（core/config.py:100-109；api/siril.py:49-56；storage/runtime.py:88-92）。 | NOT_RUN：未定位对旧 PUT canvas 字段而固定响应的专项断言。 NOT_RUN：旧 canvas 配置接受但忽略的专项断言 | [nodes-siril.md:101](evidence/subagents/nodes-siril.md) |
| GF-01 | F-01, F-02 | Sidebar id 去重、替换/销毁卸载 root、移除 DOM 和 watcher；host/sidebar.tsx:9–33、locale.ts:11–16。 · T-lifecycle；真宿主 T-host-runtime，均未运行 | lifecycle.test.tsx:5 — PASS：测试环境与探针；真实 8207 只测一个 root。 部分见证或未测：按子报告精确测试及当前结果核对 | [frontend.md:35](evidence/subagents/frontend.md) |
| GF-02 | F-03, F-07 | useResource.ts:3–15 AbortController 取消旧请求，忽略 aborted 响应并分 loading/error/ready；api/client.ts:12–39 超时、caller abort、HTTP/JSON/network 分流及 timer/listener cleanup；NodesPage 错误可重试。 · T-api、T-navigation:57；权限后端验证未审 | api.test.ts:10,16,26 — PASS；navigation.test.tsx:57 探针 PASS，默认加载失败。 部分见证或未测：按子报告精确测试及当前结果核对 | [frontend.md:36](evidence/subagents/frontend.md) |
| GF-03 | F-04 | canvas.ts:11–35 检查只读/selectOnly/注册，失败回滚并结束 graph change；dragDrop.ts:8–34 检查类型/白名单、只在 canvas 接收并卸载监听。 · T-canvas:15,21,27,31；T-host-runtime:85–102 | canvas.test.ts:15,21,27,31 — PASS：宿主替身 mutation 与清理；真宿主写入 NOT_RUN。 部分 PASS：canvas.test.ts；真实写模式 NOT_RUN | [frontend.md:37](evidence/subagents/frontend.md) |
| GF-04 | F-05, F-20 | 收藏保存 promise 失败回读设置及反馈；NodesPage.tsx:16–22,72–73。 · 写冲突保护 NO_GUARD_FOUND（仅本次所读范围）；并发写测试未定位 | 真实收藏同步及并行写 NOT_RUN；未定位专项用例。 NOT_RUN：宿主收藏写入/竞态 | [frontend.md:38](evidence/subagents/frontend.md) |
| GF-05 | F-06 | ImportDialog.tsx:30–68 输入变化清空预览，pending 禁用 fieldset，离线 workspace 禁用；AssetsPage.tsx:38 按 import capability 禁用；服务端最终验证未审。 · 请求完成前关闭、取消或重复提交专项覆盖未定位 | navigation.test.tsx:140 探针 PASS，验证未可用时筛选操作，未验证真实服务帧分类。导入写链 NOT_RUN。 部分探针；取消或竞态无专项结论 | [frontend.md:39](evidence/subagents/frontend.md) |
| GF-06 | F-08, F-12 | StoragePage.tsx:30–56,99–130,151–152,180–201 expected_revision，能力/状态禁用，删除与 cache clear 确认；EnvironmentPage.tsx:28–53 conflict 禁用。 · T-storage:24,55,96；服务端权限及并发验证须由后端审计 | storage.test.tsx:24,55,96 探针 PASS；默认加载失败；Environment revision 专测未定位。 部分见证或未测：按子报告精确测试及当前结果核对 | [frontend.md:40](evidence/subagents/frontend.md) |
| GF-07 | F-09, F-10 | EquipmentPage.tsx:39–67 dirty/busy 拦截导航、beforeunload 注册清理和 session 恢复；shared.tsx:17–42 mutation 防重复/abort/error。 · T-equipment:72；真 host remount T-equipment-host:214–230 | equipment.test.tsx:72,126 探针 PASS；默认加载失败；MCP 和真实 host 不推定。 部分见证或未测：按子报告精确测试及当前结果核对 | [frontend.md:41](evidence/subagents/frontend.md) |
| GF-08 | F-09, F-10 | OpticalTrainEditor.tsx:25–26,38–54,90–110 检查无效/归档器材，排序边界、去除重复可选项、附件/滤镜上限 50；字段校验与错误由 shared.tsx:66–87 显示。 · T-equipment:40,126；后端验证与并发另审 | equipment.test.tsx:40,180,195 探针 PASS；真正 Vue picker 与最多 50 项边界需专测。 部分见证或未测：按子报告精确测试及当前结果核对 | [frontend.md:42](evidence/subagents/frontend.md) |
| GF-09 | F-11 | SoftwarePage.tsx:14–24,64–76 卸载 abort、错误保留，pending 禁用；选择仅 ready 候选，手动路径发后端校验。 · T-siril:8；T-siril-host:51 | siril.test.tsx:8 FAIL（临时 CSS 映射）；严格 enabled DTO 拒绝旧 fixture。真实配置写入 NOT_RUN。 FAIL：CSS 探针 test manual verification，fixture/入口与当前契约不一致 | [frontend.md:43](evidence/subagents/frontend.md) |
| GF-10 | F-13, F-14, F-21 | scientific.tsx:91–116 请求 key 匹配才显示，400ms debounce、取消旧请求、过时对象 URL 释放；api/siril.ts:48–105 取消 job、验证 PNG 内容类型，异常释放；121–132 周期 validate 防失效；卸载清理 timer/listeners/abort。 · 无专门竞态、失配、旧图及实际生命周期断言已确认；不等于已通过 | NOT_RUN：未定位真实 NodeView 竞态、失配、旧图、写 graph 循环的精确断言。 NOT_RUN：真实竞态及卸载 | [frontend.md:44](evidence/subagents/frontend.md) |
| GF-11 | F-14, F-21 | scientific.tsx:93–116 effect 输入未含 active；active 到 117 行才定义，仅用于后续验证；在 collapsed + Inspector closed 时仍可 renderCandidate。 · NO_GUARD_FOUND；原始 PRD 可见条件与“不必”措辞需区别，不能单凭此断言违约；无对应测试已确认 | NOT_RUN：可见性未限定输入变化的竞态行为；无此 guard。 NO_GUARD_FOUND；可见性只限制 validate | [frontend.md:45](evidence/subagents/frontend.md) |
| GF-12 | F-15 | Inspector.tsx:36–47 焦点恢复，双图 aligned 才允许 wipe；:49–68 主指针、界限与 zoom clamp；:82–120 dialog cancel、键盘 slider。 · T-siril:28；窄栏/失焦/实际浏览器多设备验证未定位 | siril.test.tsx:28 通用 Inspector 探针 PASS；实际 NodeView 另计。 PASS：通用 Inspector JSDOM；实际编辑链见 GF-13 | [frontend.md:46](evidence/subagents/frontend.md) |
| GF-13 | F-16 | scientific.tsx:150–172 在 graph 不存在、read_only/selectOnly 时拒绝写，并通过 graph before/after 包装；:180–193 参数可编辑或重置；单色禁用 linked。 · 通用 details 展示用例没有覆盖实际调参、重置、预览同步或拒绝写入 | NOT_RUN：siril.test.tsx:28 未传 parameters，未覆盖实际 NodeView 的调参、重置及同步。 专项验证待补：宿主编辑限制和单色 linked 门控 | [frontend.md:47](evidence/subagents/frontend.md) |
| GF-14 | F-17 | DrawingBoard.vue:55–56,234–238 revision 防异步恢复覆盖新绘制/卸载；VueExampleComponent.vue:31–38,73–103 非法恢复/上传异常反馈。 · T-vue serialization:31,67；宿主已知 IMAGE 执行路径问题须独立验证 | frontend/tests/widgets/serialization.test.ts 恢复/上传多用例 PASS；当前宿主 IMAGE 队列 NOT_RUN。 PASS：Chromium；真实 queue NOT_RUN | [frontend.md:48](evidence/subagents/frontend.md) |
| GF-15 | F-02, F-07, F-18 | host/locale.ts:11–16 focus/interval 同步并清理；i18n.test.tsx:10 key 集合等价。 · 缺失动态 key 的实际渲染 fallback/窄栏完整验证未定位 | i18n.test.tsx:10,12 探针 PASS，Vue 键等价与中文真宿主 PASS；当前切换主题/宽度未跑。 部分见证或未测：按子报告精确测试及当前结果核对 | [frontend.md:49](evidence/subagents/frontend.md) |
| GF-16 | F-19 | SearchField IME 组合及 debounce cleanup 有测试；单/多选桥依赖宿主 Vue 组件。 · T-search；无 host 环境降级保护 NO_GUARD_FOUND（main.tsx 静态依赖 comfy:app）；须明确只支持宿主 | search.test.tsx:3 PASS：IME 与去抖；React Vue bridge 用替身；空宿主与真实 dropdown NOT_RUN。 部分 PASS：搜索 JSDOM，Vue bridge 为 Mock / 真宿主下拉 NOT_RUN | [frontend.md:50](evidence/subagents/frontend.md) |
| GM-01 | M-01 | URL/配置：CLI > 环境 > 默认 `127.0.0.1:8188`；拒绝空值、空白、反斜线、query、fragment、非 HTTP(S)、userinfo、非法端口；保留代理路径，错误 CLI exit 2/stderr（`config.py:7-27`, `__main__.py:17-20`）。测试 `test_config.py:10-61` 覆盖优先级、非法、空环境、IPv6、CLI；未运行。 | mcp/tests/test_config.py::test_invalid_urls、test_url_precedence — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:21](evidence/subagents/mcp-packaging.md) |
| GM-02 | M-03, M-09, M-10, M-11, M-12, M-13, M-14 | 权限和泄露：仅 43–256 ASCII 字母数字/`-_` token 且 IP loopback 根路径时发现工具；localhost 名称、远端、代理路径或短 token 静默只暴露诊断；设备请求 `trust_env=False`, `follow_redirects=False`，禁止经环境代理和重定向携 token（`api/equipment.py:14-23,76-80`, `server.py:23-25`）。`test_equipment.py:21-74` MockTransport 验证 bearer/GET、无本地头、降级、302、403/404/500/503、超时/坏 JSON/坏形状及 token 不出错误文本；未运行。此客户端限制不等于服务端授权已验证。 | mcp/tests/test_equipment.py::test_missing_credential_or_nondirect_host_keeps_diagnostics、test_invalid_or_denied_backend_is_mcp_error — PASS；实际 HTTP 使用替身。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:22](evidence/subagents/mcp-packaging.md) |
| GM-03 | M-03, M-09, M-10, M-11, M-12, M-13, M-14 | 输入：canonical UUID 精确小写及 36 字符；query 最多 120、limit 1–100、cursor UUID，枚举由 FastMCP 类型 schema 约束，错误 ToolError `INVALID_REQUEST`（`api/equipment.py:26-41`, `tools/equipment.py:9-16`）。对应 MCP 测试未见单独覆盖所有边界；NO_GUARD_FOUND：设备响应 body 大小上限、重试。 | mcp/tests/test_equipment.py::test_read_tools_schema_permissions_and_adapter — PASS：部分 schema；全输入边界未独立测试。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:23](evidence/subagents/mcp-packaging.md) |
| GM-04 | M-03, M-09, M-10, M-11, M-12, M-13, M-14 | 设备 HTTP：10 秒超时；HTTP 错误仅返回清洗后 ASCII 错误码最多 80 字符和状态码，timeout/network/坏 JSON/DTO 分类 ToolError；校验集合 `items`、分页 `next`、主要 ID/类型/版本和 revision snapshot 的浅层形状（`api/equipment.py:44-67,76-116`）。测试 `test_equipment.py:56-74` 为 Mock HTTP，断言 error 和 token 不泄露，并未逐一断言具体错误码或完整 DTO；未运行。NO_GUARD_FOUND：递归验证所有嵌套数据、响应大小限制、重试。 | mcp/tests/test_equipment.py::test_invalid_or_denied_backend_is_mcp_error — PASS：错误/秘密不出回执；非网络代理实测。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:24](evidence/subagents/mcp-packaging.md) |
| GM-05 | M-02 | 诊断：两个 GET 顺序、各自 HTTP 状态、JSON object 和 system object 验证，异常传播成 MCP error；HTTP 客户端 async context 清理（`api/comfy.py:6-22`, `client.py:9-14`）。`test_client.py:9-62` Mock 成功、缺节点、两端错误、网络/超时、坏 JSON/形状；`test_server.py:44-78` 内存 MCP 错误；未运行。诊断客户端未显式关闭环境代理，与设备客户端信任边界不同；NO_GUARD_FOUND：诊断重试和显式响应大小上限。 | mcp/tests/test_client.py::test_invalid_json_response、test_invalid_system_shape、test_transport_errors_and_timeout_configuration — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:25](evidence/subagents/mcp-packaging.md) |
| GM-06 | M-01, M-02, M-04 | 发现/协议：重复 tool 注册错误；无技能不注册 provider；无效 skill 启动失败（`server.py:19-30`）；`test_server.py:20-41,82-89` 内存 schema、空 resources、重复和坏 skill。`test_server.py:93-146` 真 stdio 子进程初始化、列表、调用、stdout JSON、关闭；`test_version.py:10-21` 真 CLI 和内存工具；`test_equipment.py:79-89` 真子进程带 token 仅列表与 version，未发真实设备请求。均未运行。 | mcp/tests/test_server.py::test_duplicate_registration_fails、test_invalid_packaged_skill_fails_startup、test_stdio_stdout_contains_only_protocol_json — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:26](evidence/subagents/mcp-packaging.md) |
| GM-07 | M-05, M-07 | 供应链/内容：版本稳定 SemVer、根/MCP/依赖/tag/许可证一致，否则失败；Registry 输入禁止符号链接并通过 .comfyignore、必需文件/根/私有数据扩展名/metadata 检查；wheel 顶层白名单与必需模块、sdist 前缀/普通文件/路径内容白名单（`scripts/release.py:38-50,70-120,151-180`）。`test_versions.py:8-25` 临时副本版本/错误；`test_contents.py:20-49` 构建并注入泄露文件拒绝；这些测试会 build，本轮按限制未运行。过滤主要基于路径和后缀，NO_GUARD_FOUND：任意允许文本内秘密内容扫描、依赖漏洞扫描、产物签名验证。 | tests/packaging/test_contents.py::test_registry_archive、test_mcp_artifacts_exclude_extension；test_versions.py::test_versions_and_tag — PASS。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:27](evidence/subagents/mcp-packaging.md) |
| GM-08 | M-07 | 安装/分发：临时目录 uv venv、明确 PyPI index、无 config/cache、隔离 Python、30 秒握手和 45 秒子进程时限，清理由 TemporaryDirectory 和 async context 完成（`scripts/check_install.py:12-52`）。release 对公开 PyPI 安装最多五次、每次失败等待 15 秒后失败终止 Registry（`release.yml:50-60`）。真实网络安装和 CI 此轮未执行；`skip-existing: true` 意味重跑可跳过已有 PyPI 文件，需依赖随后公开安装确认版本，未发现远程与本次构建字节等同性校验。 | NOT_RUN：独立联网安装或生产发行。 NOT_RUN：联网公开安装/远程工作流 | [mcp-packaging.md:28](evidence/subagents/mcp-packaging.md) |
| GM-09 | M-06 | 前端代理：`test_contents.py:52-57` 从现有产物提取两个相对导入并用 urljoin 检查代理前缀；非真实代理 HTTP，未运行。`ci.yml:41-42` 另调用 build/proxy 检查，脚本实现本轮未细审。 | tests/packaging/test_contents.py::test_built_frontend_external_urls_preserve_proxy_prefix 与 check-proxy — PASS；本地测试前缀。 部分见证或未测：按子报告精确测试及当前结果核对 | [mcp-packaging.md:29](evidence/subagents/mcp-packaging.md) |

---

# 测试覆盖与本轮实际结果

2026-11-18 Windows 本地，已装环境。每个运行的完整命令、开始和结束、时长及退出码见 [执行索引](evidence/test-runs.md)。[反向用例表](evidence/test-inventory.md) 保存 pytest 参数化结果、Jest / Vue 实际用例，以及源码定义和断言索引。子报告提供断言的人读解释。未用 coverage 工具，以下没有行覆盖率。

| 套件或检查 | 本轮状态 | 断言环境和范围 |
|---|---|---|
| Python 3.12.15 根套件 | 83 passed / 3 skipped，exit 0 | 真实临时 SQLite、文件、合成 FITS、aiohttp TestServer、宿主 API stub 和临时 wheel/sdist/Registry 构件。含两个真实 Siril 1.4.5 进程用例。分组 62 backend、6 nodes、7 aiohttp integration、8 packaging 通过 |
| Python 3.11.18 既有隔离环境同根套件 | 83 passed / 3 skipped，exit 0 | 同一测试定义独立跑。两条真实 CLI 用例也启用。与 3.12 是重复验证 |
| MCP 3.12.15 / 3.11.18 | 各 67 passed，exit 0 | HTTPX MockTransport、FastMCP 内存 Client 与真实 stdio 子进程；无真实 Token 连宿主 |
| React 项目默认 Jest 命令 | 4 suites / 13 tests passed；6 suites 在加载时报错，exit 1 | CSS 缺少 moduleNameMapper，EnvironmentPage 和 Inspector 导入触发。六个套件未收集，不能算作通过或断言失败 |
| React 临时 CSS 映射 | 9 suites / 46 tests passed；1 suite / 1 test failed，exit 1 | 仅用交接目录的 audit-jest.cjs 和 CSS 空模块。siril.test.tsx:8 的 fixture 缺少必填 enabled，Siril DTO 拒绝，实际呈现 Cannot reach the Siril service；测试也仍按旧详情入口直接查表单。当前默认结果保持失败 |
| Vue Vitest Chromium | 3 files / 9 tests passed，exit 0 | 真实 Canvas 与上传 payload、内存替身宿主注册。直接 vitest run 使用当前磁盘 bundle，绕开默认 test 脚本重建 |
| 真实 ComfyUI HTTP | 1 passed，exit 0 | 8207 的 GET status、vue-basic 真实注册；另以只读 GET 检查四节点 Schema 和两产物哈希 |
| 真实 ComfyUI 浏览器 | 1 项只读脚本成功，exit 0 | 8207 Chromium，仅放行同源 GET/HEAD/OPTIONS，确认单 Sidebar、中文三栏、Nodes 搜索存在、Storage/Equipment/Software/Environment 入口、观测地已移除。未改设置与用户图 |
| Vite 和代理 | 隔离新构建、check:build、check:proxy 均 exit 0 | 新输出在系统 TEMP，JS/CSS 哈希与工作树相同；代理是本地 Chromium + 测试 HTTP 服务和假宿主 API |
| 类型、Lint 与依赖 | 前端 typecheck、eslint、Ruff、uv lock --check --offline、release.py check、git diff --check 均 exit 0 | Git 输出 CRLF 提示，非 diff 错误。CI Ubuntu 远程没有运行证据 |
| 跨卷和正式宿主 workflow | NOT_RUN | 两条跨卷按显式第二测试卷未选入。host 标记在根套件跳过，独立只读 host-get 已通过。通用 host-runtime、storage/equipment/siril-host 会写设置、流程或数据/外部证据，为本轮保持只读未运行 |
| 远程发行和联网安装 | NOT_RUN | 本地包装与清单已测，未上传或装 PyPI 已发布版本。三平台、未安装版本及资源压力不可由当前测试推广 |

没有记录 xfail。临时配置探针的两次命令拼装失败留在日志，不计入应用测试结果。完整结果以机器报告和最终通过执行的日志为准。

## 正常、错误与恢复覆盖

| Feature | 正常和边界 | 错误、恢复与清理 | 测试与证据 | 缺口 |
|---|---|---|---|---|
| B-01..05 初始化/配置/DB | 重入、真实 WAL/事务、版本 | 被损坏/过期 DB 保留，锁争用与备份、初始化中断 | test_core.py、test_status.py、test_storage.py、test_status_api.py | 异常 FS / 锁竞态矩阵 |
| B-06..37 Workspace/Cache/操作 | 多 Workspace、默认/禁用、租约和 owned 清理、真实同盘迁移 | 权限/冲突、低空间、路径、迁移前后 DB checkpoint 与中间操作 | test_storage.py、test_storage_api.py 实际隔离 | Windows 第二卷、所有失电状态与外部篡改，失败可能留自有目标 |
| A-01..19 资产 | reference/copy/preflight、覆盖策略、真实文件、Session 关系 | 源变更、staging、取消、幂等、进程重启恢复 | 同盘的 SQLite 与文件；TestServer 限定路由 DTO | 跨卷，完整 HTTP inspect/会话/失联操作，真实限权目录 |
| A-20..44 设备与光路 | 规格 CRUD、passbands、光路顺序和兼容 GET、归档及物理删除 | 错误角色/重复、FK、乐观并发、含历史时失败注入、权限/Bearer | test_equipment.py backend / aiohttp 与 JSDOM（仅 CSS 探针） | 并发合并正确性、历史-only 引用与新归档设备、活宿主写链 |
| N-01..05 Node/FITS | V3 注册、mono/RGB、真实前图和科学文件 | 损坏截断、路径、fingerprint；旧 Vue DTO 异常 | Node stub、当前宿主 GET、Astropy tempfile | 正式 Vue host IMAGE、轴/大文件/内存、连接复杂子图 |
| N-06..08 / N-15..23 Siril | 指定 1.4.5、参数默认、实际正式 FITS 产出 | 错版本、坏 path、参数注入拒绝、真实子进程 timeout/cancel；原件保持、部分 run 恢复 | test_siril.py pytest+真 CLI 两用例，本轮非宿主 queue | 大资源压力、Linux/macOS、真实 CLI 进程中取消的完整场景 |
| N-09..10 / N-24..27 Preview | 临时 source PNG 与状态、分辨率设置静态链 | 未配置 CLI、跨源、源消失报失效、after 404 | test_siril_api.py 的 TestServer、真实 FITS/Pillow | 成功候选、布置更新和并发、Blob 资源及真宿主 |
| F-01..21 前端 | Tab、搜索、翻译、Canvas 与详情，通用 Inspector 分割 | 负面 DTO、只读 Canvas、卸载、删除拒绝（替身），旧绘图像素 | React 默认失败与探针分列；真浏览器 8207 GET+Vue Chromium | 实际 Inspector 调参／重置同步到画布、预览刷新及宿主编辑限制、主题/窄栏比较、收藏跨页同步、处理配置 fixture |
| M-01..08 / M-09..14 MCP/包 | 工具枚举、stdio、版本、部分 HTTP、打包边界 | 重复注册、无效配置、DTO/timeout、模拟坏 archive | 67 MCP 用例、根套件 8 项打包、隔离构建与 proxy | 4 个条件光路工具只有枚举断言，缺真实授权与远程发行 |

每个 Feature 的相关 guard/测试代码定位沿 [清单](04_COMPLETE_FEATURE_INVENTORY.md) 到 [防御矩阵](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 和所属子报告。机器反向索引遇到 helper、动态生成及断言跨函数时标识限度，不能以同域测试数量推断某个 Guard 已有效负面验证。

---

# 节点、Siril 1.4.5 和 IMAGE_PATH

## 实际节点与入口

| V3 ID | 入口和键 | 当前行为 |
|---|---|---|
| vue-basic | nodes/ComfyUIFEExampleVueBasic.py → ComfyUI 原生 LoadImage | Widget 提供 temp PNG 路径，返回宿主 IMAGE。工作流像素恢复经测试，历史正式 IMAGE 委托失败仍未重测。 |
| AstroPhotoImagePath | nodes/scientific.py:13 → execute(image_path) | 把 STRING 作为轻量 IMAGE_PATH 输出。这个节点不检验文件，使用者负责验证。 |
| AstroPhotoFITSSource | nodes/scientific.py:40 → resolve_input/fits_frame | 内部 ASTRO_FITS_ASSET picker 取注册 ID 或兼容路径，返回绝对 IMAGE_PATH 和 astrophoto_asset UI payload。 |
| AstroPhotoSirilAutoStretch | nodes/scientific.py:64 → parameters/resolve_input/formal_run | IMAGE_PATH 与 shadowsclip、targetbg、linked；返回新受管 FITS 路径，并发布 job/node UI 信息。旧 ASTRO_FRAME 工作流需要重新连接。 |

## 参数、文件、执行与保护

- 参数数值及缺省值出自 Schema 和 processing.parameters（astrophoto/siril/processing.py:24）。正式处理同一验证链，拒绝 bool 冒充 number、非有限值及 targetbg 越界。shadowsclip 的后端保证是值有限，linked 只作用于 RGB；UI 单色禁用关联控制。 画布与 Inspector 均可编辑当前节点参数，Inspector 通过同一 widget 写入。
- frames.resolve_input:17 对 canonical UUID 调 AssetService。路径先尝试匹配注册位置，找不到才走可读绝对本地路径。storage.manager.source_stat:25 拒绝相对路径/不支持文件、共享及链接边界，实际精细行为见 [Siril 专项](evidence/subagents/nodes-siril.md)。IMAGE_PATH 原文是轻量契约，不能将包含真实物理路径的 HTTP 面向不可信来源。
- frames.fits_frame:80 检查 .fit/.fits/.fts、存在及 stat fingerprint，以 Astropy readonly memmap 选择首个支持的 mono/RGB HDU、验证 header 与形状；预览代理转换 NaN/±Inf 为零。processing.prepare_fits:57 将科学工作副本规范化交给 Siril，并保持原件不改变。整个图像的显示数组仍按原始尺寸分配，即使最后输出较小 PNG。
- software.SoftwareService:85 拆分发现、验证保存、清空和启停。禁止 GUI EXE、错误文件名或不受支持版本；配置保存前会以实际 CLI 探测，错误保留旧配置。run_cli:56 不用 shell，检查进程退出与取消，探测有限时，正式与候选处理无默认 wall-clock timeout。先检查空闲空间和文件身份，暂存与正式产物隔离。
- processing.process:34 固定脚本 load → autostretch → save，使用内部生成目录与文件名。output FITS 必须存在，解析合法，尺寸及通道符合源。formal_run:159 从当前默认 Workspace 的自有运行目录处理并注册 Asset，recover_runs:207 区分已入库、未注册和未完成，清理仅限自有运行目录。跨进程 crash 窗口须照 [Guard](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 理解。
- previews.PreviewService:40 使用 Cache 并按 owner 替换、取消旧任务，提供 status、validation、before/after 与 Cache 租约。正式结果与源/参数匹配时用于显示。候选失败仍可保留 before 与 error。进程内状态不等同于持久正式 run，未配置 Siril 也可显示合法源图。

## 本轮验收边界

- 崭新的真实 FITS 和 Windows Siril 1.4.5 在临时 Workspace 下，验证源字节、正式输出科学像素变化与登记、不同结果隔离、直接路径和取消。确切断言见 tests/backend/test_siril.py:155–210。
- aiohttp TestServer 验证授权与错误、候选前图和 CLI 未配置回执。V3 调用边界另有 API stub 与 8207 真实 Schema GET。
- 本轮未用真实 ComfyUI 排队执行。完整宿主工作流/Inspector 的历史证据归 docs/siril.md 与 .agent/notes/siril-autostretch.md。当前 Hook 对复杂 subgraph input 的解析、真实高容量和 Linux/macOS 行为仍未验证。

---

# 前端、Vue Widget 与 Inspector

## 侧栏和输入控件

- frontend/entry.ts 是唯一构建入口，导入 Vue 与 React。main.tsx 注册 Sidebar 和科学节点插件。host/sidebar.tsx render/destroy 重用同容器 root 并清理旧监听。App.tsx 的 Nodes/Assets/Settings 主 Tab 保留各页状态，Assets 为默认。主题使用 Comfy 变量；React Locale 订阅宿主，Vue 在挂载时取值。
- NodesPage 和 NodeTree 从 object_info 列出此扩展节点，并过滤 examples 类别，支持搜索、排序、类别、展开、提示与点击/拖拽添加。host/canvas.ts 与 dragDrop.ts 防只读、错误区域及未知节点，失败时结束图变更。没有增加一个远程画布编辑工具。收藏通过 NodesPage.tsx:16–81 共享宿主 Comfy.NodeLibrary.Bookmarks.V2，保留其他节点和目录条目，活动时每 500ms 同步，失败恢复宿主状态或显示错误。真实收藏写入未重跑。
- Settings 页实装 Storage、Software、Equipment、Environment、System Status，并展示 Knowledge、Memory、Agent Context 规划页。观测地和 General 行已移除。Assets 有真实资产列表、导入预检和任务状态，Capture Sessions 面板可列出当前资产关联的会话标识，但尚未形成会话详情浏览或编辑。
- Equipment 与 Optical Train 共用 DetailAccordion、DetailActions、Comfy 风格控件。设备建档、专业规格、引用跳转、编辑归档删除。光路组件按真实顺序，滤镜多选，多设备可从编辑器新增，单配置和引用显示。有些归档设备和删除失败需要参见 [业务缺口](09_STORAGE_ASSETS_EQUIPMENT.md)。
- 复用的 vendor Vue SingleSelect、MultiSelect 由 React bridge createApp 挂载和卸载，官方修改点、依赖和样式在 frontend/src/vendor/comfyui/README.md。Jest 将这两套 Vue 选择器替换为测试组件，Keyboard/focus/弹层真行为不能从该替身推定。
- Vue DrawingBoard 与 DrawingApp 提供画笔、橡皮、画笔颜色/大小、触摸/鼠标及清屏、Canvas 像素保存还原。VueExampleComponent 实际序列化先上传 PNG，成功返回 temp 路径，异常返回 image:null。Chromium 的真实 Canvas/模拟宿主上传断言见 [测试矩阵](06_TEST_COVERAGE_MATRIX.md)。

## 科学节点

host/scientific.tsx:36–46 跟踪相连上游及同一来源/参数的正式结果。NodeView:68–115 在参数、输入、手工刷新、分辨率环境设置变化后发新请求，400ms debounce，AbortController 防旧响应并释放 Blob URL。展开状态和 Inspector 打开用于 TTL/validate 轮询（:117–135），不是请求 effect 依赖；开发者需要区分隐藏期间仍处理输入变更与仅打开窗口触发重算。

NodePreview 提供单张主图、折叠、刷新与大图入口。EnvironmentPage 和 api/previewSettings 管全局 PNG：512/1024/2048/4096/full；默认 1024，画布 480×320 上限与节点宽度协调。正式 FITS 不受该设置压缩。

Inspector 与主预览共用最新图像，提供并排、单图、对齐时擦拭比较、平移缩放、分区 resize 和键盘输入。失配禁用擦拭，关闭后恢复原焦点。通用组件位于 frontend/ui/src/features/nodePreview/Inspector.tsx，历史 features/siril/Inspector.tsx 是重导出兼容层。用户确认 Inspector 可以修改当前节点的 shadowsclip、targetbg、linked，也可重置。实际 NodeView 通过 updateParameters 和 graph change 更新画布，同一组参数驱动候选预览。单色输入禁用 linked，宿主 read_only/selectOnly 时拒绝写入。通用 Inspector 的 JSDOM 展示用例未覆盖上述编辑链。本期不纳入 Trial 管理。

## 验证差异

[本轮日志](06_TEST_COVERAGE_MATRIX.md) 区分 React 默认配置、临时 CSS 映射、Vue Chromium、代理模拟应用和真实宿主 GET。通用 host-runtime.mjs 仍含旧资产 unavailable 与观测地断言并写 Comfy 设置，应先更新测试或在授权的隔离宿主重跑。当前分辨率写入回执、图像失败降级、窄栏主题/动态 locale、多节点竞争及复杂 subgraph 均需按具体证据确认。

---

# 本地数据、Workspace、Assets 与设备

## 文件和数据库

- 默认 ~/.astrophoto，ASTROPHOTO_HOME 必须是支持的绝对路径。目录布局由 storage/initializer.py、runtime.py 和 core/config.py 管理。manifest 的 instance_id、SQLite storage_identity、Workspace/Cache marker 互相核对。数据库或 manifest 损坏/旧基线不自动擦除。schema 为 0001_equipment_baseline，WAL、事务 foreign_keys/busy timeout 与完整 schema 检查。表、约束及触发器逐项见 [表证据](evidence/subagents/backend.md)。
- 6 张 storage/assets 业务表和 11 张设备/光路业务表，另有 alembic_version。设备专业表按相机、readout modes、主光学、配件、滤镜、passbands 独立。光路当前配置保存在 draft JSON，兼容 revision/default 关系有复合 FK。现行版本无 observing_sites、Capture Session 主实体或 Trials/RAG/Memory 表。
- Workspace 支持初始默认、新建、检查、重新定位、重命名、设为默认、禁用、移除和迁移。安全路径、身份 marker、不重叠、离线状态、使用中版本限制稳定。迁移以 plan、文件清单、检查点、验证、DB 切换与恢复为界，源不自动删除；阶段失败可保留自有目标中间文件。copy/reference 的实体状态测试不代表跨盘真实运行。
- Cache 配额、租约、Owned entry 和清理由 CacheManager 管理。换目录不迁移旧缓存；预算与实际可用空间检查不同。SQLite、应用锁、文件 marker 与 checkpoint 是互补边界，文件系统和 SQLite 不能假定原子提交。

## Asset 与设备行为

- Asset Import 的预检、reference 和 copy 都要求 ASTROPHOTO_IMPORT_ROOTS 下合法源。枚举限制、文件快照和绝对路径对通用文件有效。reference 不复制且检查路径/size/mtime，copy 用 staging 和 no-overwrite publish，完成后注册 managed，回执明确校验等级。取消、恢复与重试按 operation id/key，部分失败独立报告。通用导入不验证科学内容，格式验证在 FITS 消费者实施。
- Assets list、单项 resolve/inspect、外部引用 relocate、Session attach/detach 已在服务/API 层。Session 是关系键，非有名称/时间的实体。外部引用重定位依赖 stat/授权查询，暂未发现内容哈希验证。没有已验证的通用资产实体删除。
- Equipment schema/服务校验同类规格、范围、枚举、可选值与 Passband 集合；字段见设备类型专用表。所有写入纳入 SQLite 事务，加乐观版本防同一表单重写。设备还原与 Archive 使用版本和 UTC，存在当前或历史引用时设备物理删除被阻止。
- OpticalTrainService 保存一套配置，允许不完整项，完整性影响 DTO 的内部 draft/published 状态。配件顺序、滤镜列表、组件类型及存在性校验。后端可新关联已归档设备，UI 多数选择只展示在用或默认选中项。旧 Revision GET 仍经 snapshot Schema 校验，发布/切 default 写入口返回 410；整条光路永久删除原子移除当前和遗留引用并恢复保护触发器，不能把只读快照说成永久保留。
- 乐观冲突本身由后端拒绝。UI 的 Retry 更新版本并重发旧表单，可能覆盖无关的并发更改。历史-only 引用阻止设备删除但 UI 不区分来源。这两项此前评审未修，并非本轮通过的验收能力。

详见 [后端逐功能/DB/Guard](evidence/subagents/backend.md)、[资产设备接口/字段/测试](evidence/subagents/assets-equipment.md)。

---

# MCP、CI 与打包

## 独立协议

mcp/src/astrophoto_mcp/server.py:19 的 create_server 使用 FastMCP 4.2.0。默认仅 version 和 connection_status。stdio 至少从真实子进程测试验证握手、工具枚举、调用和 stdout NDJSON 协议。status HTTP /object_info 的兼容、错误响应和敌对 payload 大多由 HTTPX MockTransport 验证，不等于全链路在真实 ComfyUI 上执行。

配置合法 ASTROPHOTO_EQUIPMENT_READ_TOKEN 且设备使用直连回环 URL 时才注册六个只读工具。具体工具名和参数见 [逐 Tool 契约](evidence/subagents/mcp-packaging.md)。配置不合法或非直连时只留下诊断工具。服务端拒绝浏览器 Bearer 和非 GET Token，常量时序比较，非身份标头不能授予 Agent 写权限。默认 status 诊断可以用其他 HTTP URL，设备 adapter 不跟随重定向、不继承环境代理；单独区分验证边界。

产品 Skill 仅从包内 skills 目录加载有效 SKILL.md，工作区开发技能不会随发行提供。延期的 MCP 写操作、工作流执行、Siril 操作、Memory/RAG/实验不计为 Tool。

## 发行边界

- .github/workflows/ci.yml Python 3.11/3.12 双矩阵，冻结 uv/pnpm，编译检查、测试、真实 Playwright（部分为替身宿主）、Registry 和 Wheel/sdist、隔离安装验证。
- scripts/release.py 统一 0.0.1、检查 tag、筛选 Registry 白名单，含 JS、CSS、locales、Python 和 DB baseline；SQL/用户数据、测试、reference、mcp 与构建依赖应排除。MCP wheel/sdist 不携带 Extension。
- pytest packaging 会在临时目录实际生成 Registry ZIP 和 MCP 构件并检查内容，插入异常路径做负面测试。生产 PyPI、Comfy Registry、Github Release 工作流未执行，也没有远程哈希等价证明。
- [证据](evidence/subagents/mcp-packaging.md) 记录分发顺序、安装探针继承 token/URL 时精确工具枚举失败的风险、sync 非事务、路径白名单与内容泄露区别。不要把本地构件结果算作远程发布成功。

---

# 三套交接与当前工作树双向对齐

来源简写 C 指 Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18，L 指 Last_Handoff/sources，O 指 Original_request。直接用户指令来自当前会话，优先于版本或文件日期。原始全文/截图/副本的文件覆盖见 [需求文件账本](evidence/subagents/requirements.md)。重要主路径逐项以工作树证据复核。

| Decision ID | 主题 | 原始需求 | 上次结论 | 本次产品要求 / 后续指令 | 当前源码和本轮测试 | 对齐结论 |
|---|---|---|---|---|---|---|
| D01 | V3 入点和 Vue | 保留旧 Widget 与 IMAGE 契约；旧目录文档偶有 V1 示例 | L01_CURRENT_STATE、L03_ARCHITECTURE 已见 vue-basic | native V3、旧 Widget 行为仍保留 | __init__.py:12–45 四节点；frontend/src/main.ts、VueExampleComponent；Python stub、Chromium 像素和 8207 Schema 通过 | 保留；历史输入执行失败尚未重验 |
| D02 | Sidebar/语言 | Sidebar FRD 三视图，设置模块与可见占位 | L02_REQUIREMENTS、L07_TEST_EVIDENCE 记录原先 default Assets 与 8 设置模块 | 明确按宿主 locale/theme，删 General 与观测地行 | App.tsx:12–38、moduleRegistry.ts、locale.ts；8207 真浏览器中文三栏、关键模块可见 | General/观测地入口旧断言 OBSOLETE；观测长期意图保留 |
| D03 | 多 Workspace/Cache | 旧原型偏单 active 位置，后续本地存储 v1.1 允许多个 | L06_DATA_MEMORY_RAG 多数作为规划 | C08_WORKSPACE_SECURITY_AND_LIFECYCLE 要求预览/正式不同生命周期 | StorageRuntime、WorkspaceRegistry、CacheManager、DatabaseManager；SQLite fixture 验证搬迁、取消、恢复和路径操作 | 旧规划 OBSOLETE，跨盘本轮跳过 |
| D04 | 导入与直读路径 | O Siril 产品/工程新增第一行补丁要求授权目录；文档也有旧 ASTRO_FRAME 示例 | 未实现 assets 的旧事实 | 本会话归档历史明确仅 Siril 可读根外本地 FITS，Asset Import 仍限制授权根 | imports.py:33–42 强制 roots；frames.py:17–36 + manager.py:25 路径回退与本机权限；test_direct_fits_path_outside_import_roots 实际通过 | 产品保留最新更正，路径文档需更新。部署级信任与逐路径授信需区分 |
| D05 | 设备模块 | O设备 UI v1.0:14–29 四类设备、专业表单、多通带 | 曾归为计划 | 当前会话确定摘要卡片和 Accordion、用官方风格控件 | equipment schemas 与 SQL，EquipmentDetails/EquipmentForm，Vue picker bridges；DB/HTTP 测试与隔离前端断言 | 已实施主路径，当前真实浏览器 CRUD 未重跑 |
| D06 | 光路版本 | O设备 UI 与 Three-Tier guide 需不可变 Revision、默认版本、派生与历史 | 历史验收围绕发布/归档 | 当前会话明确两域都不要多个版本，「不需要历史版本，删除历史版本」 | trains.py:44–75、:157–186 与 API equipment.py:64–78；单配置，兼容 GET，旧写 410；集成测试断言 | 旧产品规则 OBSOLETE，数据兼容不应误会为 UI 或新版本支持 |
| D07 | 删除与引用 | 原始方案以归档/版本为主 | 部分历史包未提永久删除 | 编辑、归档及红色永久删除。设备用量必须说明 | service.py:47、:172；trains.py:83；React 共用 DetailActions，SQLite 触发器恢复测试 | PARTIAL，历史-only 引用提示不清，UI 冲突重试风险 |
| D08 | IMAGE_PATH | O 补丁取代首期 ASTRO_FRAME，保留内部科学表示 | L01 只展示老节点 | C02、C05 路径契约、保存正式 FITS | scientific.py:10–111；8207 真 Schema；8201/8205 仍旧端口，JS 同一当前哈希 | 当前源码符合首期，历史契约 OBSOLETE，工作流迁移仍人工 |
| D09 | Siril 版本/三参数 | O PRD v1.1 主目标 1.4.5 与三业务参数 | L 范围早于实现 | C06 版本、CLI 语义及输出要求 | software.py:135–165、processing.py:24–54；两个真实 1.4.5 用例与合成验证 | 已验证范围为 Windows CLI，当前正式宿主 E2E NOT_RUN |
| D10 | 预览 | 较早 Node Interaction PRD 提多视图/设定变化，产品迭代取消视口触发 | L 无当前科学预览 | 单主图、手动刷新、全局 PNG 长边，界面固定上限 | scientific.tsx:68–135、api/siril.py:39–56、EnvironmentPage；隐身时参数变化仍触发；只打开不发新的候选 | 画布窗格字段只校验不保存是历史兼容；不把 PRD「不必」当绝对禁止 |
| D11 | Inspector | O 工程早期允许更广的编辑；历史 Node实现(3) 确认参数同步编辑 | L 尚无生产 Inspector | C02:34–36、C04:39/55 曾采用只读。用户现明确「inspector的参数就不应该是只读，而是可以修改的。」 | scientific.tsx:150–193 编辑并重置实际节点 widget；通用 JSDOM 仅覆盖 details 展示 | 旧只读条款 OBSOLETE。可编辑与当前源码一致，实际同步/预览回归仍待验证。Trial 管理不在本期 |
| D12 | 输入限制、异常 | O 历史规格含可撤销的大小/超时要求 | L 主要为运行风险 | 当前会话早期 Node 决策明确去掉 96 MiB、4 MiB、60/180 s 和总并发硬上限；保留空间与取消 | software.py:56、processing.py:137、frames.py:125、previews.py:62；probe 有 timeout，正式/候选无默认硬上限 | 旧值 OBSOLETE。内存安全没有验证，不能以成功小样本推广 |
| D13 | MCP | O设备指南要求可验证只读能力，遵从权限 | L05 只有两个诊断工具 | Siril 专题本期不添加 Siril 工具，不否定独立设备工作 | MCP 工厂条件添加 6 读 tools；真实 stdio、MockTransport、独立设备 aiohttp 负面授权测试 | 历史「全域无业务工具」过期；真实 Token→宿主 GET 未做 |
| D14 | 长期产品 | 观测站、Capture Session、校准、知识、记忆、实验、Agent Workflow | L02/L06 未来阶段 | C04:71 首期不扩展；会话当前删掉观测地设置行 | asset_sessions 是关联表；core/capabilities.py 对知识/记忆/实验/远程画布为 false；没有业务仓 | 保留为 PLANNED 或 PARTIAL；已替代的是旧 UI 行，不是全部观测目标 |
| D15 | DB 初始化 | 设备开发期库允许重建，启动禁止擦除真实数据 | 历史路径/库模型较简 | 多 Workspace/设备共享目前有效基线，生产数据不可重置 | database/migrations/versions/0001_equipment_baseline.py 与 manager.py；损坏/旧 schema fixture 验证 | 保留设计约束，旧库迁移无交付 |
| D16 | 交接漏项 | 旧 Node PRD 不含当前收藏/环境设置/Proxy UI | L 曾记录基础搜索，但没有收藏与科学节点三栏联动 | 当前开发便签有宿主收藏与环境配置；继承宿主设置 | NodesPage.tsx:16–83、NodeTree.tsx:80，frontend/ui/src/features/settings/EnvironmentPage.tsx；收藏本轮未测试真实写入 | 实现存在，历史 Handoff 遗漏；收藏宿主内部键是版本耦合 |
| D17 | 工程证据 | 历史报告只代表当时 | 含上轮宿主失败或仅原生加载 | 新报告要求当前命令、时间、退出码、原始日志 | 3.11/3.12 现有环境、当前真 CLI、隔离构建和既有宿主 GET，Jest 默认失败 | 旧计数不继承，详见 [本轮结果](06_TEST_COVERAGE_MATRIX.md) |
| D18 | 光路状态与多选 | O 设备 UI FRD:418–442 要求可选旋转角度、Flat 备注、可用滤镜多选 | 旧版本表单呈现光路状态 | 当前会话明确不需要光路状态，滤镜选择使用同款下拉多选 | OpticalTrainEditor.tsx:9–10,70、ComfyMultiSelect；schemas.py:192–196 保留兼容字段 | 保留单配置、机械顺序和滤镜；旧光路状态表单已替代，后端兼容字段仍合法 |
| D19 | 现行基线 | 原始文档保留设计意图 | 上次交接记录当时的实现与证据 | 用户确认可以接受与旧 Chat 需求的偏差，以本地实现为准 | 本地工作树描述现行行为，测试证据单独记录 | 旧差异留作演进记录。仅凭旧文档差异无需安排代码修改 |

## 依赖关系与判断来源

- 按 D19 采用本地实现为基线，旧专题及补丁提供时间线。历史材料中的目录、接口或状态与工作树有差异时，记录差异和当前行为。
- 现工作树补齐了 Last_Handoff 未提的 Storage/Assets、设备、Siril、预览 settings、科学节点与新增 read tools。旧原始设备 Revision 需求已经有直接明确的取消证据。
- 共享讨论链接尝试读取时超时。本地 Original_request 的两个设备文件可读，第三份规格文件 0 字节。没有引用无法访问的对话内容。
## 历史风险回读

- L08_GAPS_AND_RISKS R1 的旧 Torch 启动阻塞不适用于本轮 4 个已运行宿主，不能推定新安装均可启动。R2 旧 PyPI 404 未在本轮复查，标 UNKNOWN。
- L08 R5 的 PNG 上传响应验证缺口在当前 VueExampleComponent.vue:56–72,98–102 仍存在。R6 的恢复路径和 R7 的中文画笔 key 已有 Chromium 实测修正。R8 的 Ruff hook 版本和本轮工具仍不匹配。R12 的公共 data_home 披露尚存，同时现在已有本机隔离业务路由。
- Chat_Handoff/00_READ_FIRST.md 说明的 source/current 与 source/design 路径在本轮提供的 Chat_Handoff 没有作为独立目录出现。其汇编/引用只能用已实际出现的内容验证，缺失目录标 UNKNOWN。
- 候选首期保持单 FITS。当前通用资产登记早于科学文件处理，未实现 SER/RAW/XISF/视频完整读取，也未实现进程中分块输出科学预览；未来多输入、多输出不受当前节点限制。

---

# 缺口与风险

在已观察的主要流程中未发现明显的产品功能故障。以下是测试工程失败、静态观察及待验证场景的审计优先级。历史文档差异依 D19 作为演进记录。

| 优先级 | 风险与证据 | 下一步及验收 |
|---|---|---|
| P0 | 当前默认 Jest 在加载 CSS 时报 unexpected token，即使类型检查通过仍有套件未执行。frontend/jest.config.cjs 只映射 host 与 Vue，Environment/Inspector 等新样式未处理 | 添加明确 CSS 测试映射，更新确已过期的 test assertions，运行原始命令且全部收集。保留临时探针与原始失败区别 |
| P1 | Inspector 已按产品要求支持编辑。实际 NodeView 调参、重置和候选预览同步尚缺直接回归；通用 Inspector 用例只覆盖 details 展示 | 在隔离宿主验证 Inspector 和画布双向同步、重置、单色 linked 禁用、宿主只读拒绝写入及参数变化后的预览刷新 |
| P1 | 静态观察表明冲突重试会重发旧表单，并行编辑时可能覆盖其他字段（EquipmentPage:155、OpticalTrainEditor:123） | 显示新旧差异，针对冲突字段明确合并。用两个不同字段的并发编辑重现 |
| P1 | 当前后端允许向光路关联归档设备。历史引用阻止删除，提示未区分当前与历史来源 | 保留现有语义。若涉及此场景，先复现具体问题，并核对引用提示是否足够 |
| P1 | 物理路径与处理入口信任部署的本机调用者，公开 status 暴露数据根。端口数据契约不一致，代理环境不能依赖本机 header | 核实可用环境，检查最小数据披露；在隔离的代理、跨源和本机测试覆盖可信限制。首期本机直接路径规则按有效决策保留 |
| P1 | Siril 大 FITS 全尺寸 display 分配、活跃 previews 无硬 cap、处理无 timeout、缓存耗尽/大图可能资源压力 | 量测可取消性、资源积压和空间错误。默认限制属于明确历史选择，变更前重新对齐需求 |
| P1 | 当前 host-runtime.mjs 按无 Assets、含观测地且无 Environment 的旧场景断言，并会写宿主设置；真实浏览器科学/设备/储存写链本轮未重跑 | 更新断言，在获授权的隔离宿主分别运行脚本，保持原用户实例和数据不变 |
| P1 | 多端口运行不同后端 Schema，但提供相同前端构件。光路版本和 Siril 路径的旧文档描述已过时 | 按现行 Schema 验证并同步文档，旧工作流兼容性按需检查 |
| P1 | Vue Drawing 正式 IMAGE 委托历史失败依然待当前宿主重验；端口健康不代表队列成功 | 在隔离宿主跑 PNG→LoadImage→PreviewImage 并保留失败证据 |
| P2 | 第二卷测试、非 Windows、狭窄 Sidebar/动态主题、复杂子图执行、网络/FITS 损坏矩阵仍不完整 | 按 [测试](06_TEST_COVERAGE_MATRIX.md) 扩样。不要将 mock 路径提升为真实系统边界 |
| P2 | Capture Session 主体、观测地 UI、校准记录、知识/记忆/试验等长期事项按范围推进 | 先确定规格和持久化策略；现能力状态保持可信 |
| P2 | 阻止未授权安装、包内容语义秘密/REMOTE 发行散列等未穷举 | 保持现有白名单与正常发行流程，校验构件和安装日志 |

新增可定位问题包括测试配置、Inspector 参数同步覆盖缺口、已归档设备新关联、多个宿主 Schema 差异及遗留工具脚本。更多文件/阶段异常详见 [防御矩阵](05_DEFENSIVE_PROGRAMMING_AUDIT.md)。
## 继承并复核的缺口

- P1 · frontend/src/components/VueExampleComponent.vue:56–72,87–105 上传处理仅等待 json()，未检 resp.ok 或返回 name。HTTP 拒绝但 JSON 可解析时，可能生成无效 temp 路径。serialization.test.ts 的模拟上传拒绝样本只测试 Promise rejection；缺 4xx/5xx JSON 和成功缺 name。该历史风险仍有效。
- P2 · .pre-commit-config.yaml 固定 Ruff v0.4.9 且含 --fix，与本轮实际 0.17.5 的手动只读检查不同；本轮未运行 hook 或自动格式化。
- P2 · 公共 PyPI 可用性的旧失败是历史证据；依据本轮测试无法确认远端发包状态。
- P2 · AssetsPage 的帧类型菜单只在未 ready 分支可见，frame 参数不参与真实资产列表。通用资产只登记基本文件信息，不能假装已有 Light/Dark/Flat 科学分类属性。

---

# 下一任 Coding Agent 启动 Prompt

你负责本地 Windows 项目 C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto。在接受续作后先读取 AGENTS.md、.agents/skills/task-notes/SKILL.md，以及本包的 00、01、02、06、11、12。存在 .codegraph 时先用精确路径 CodeGraph，注意 reference 也可能被索引。用 git status 与当前源码复核，不用 HEAD 或本包代替新工作树。

工程已有 V3 Vue 绘图和三个科学节点、单 JS React Sidebar、aiohttp 原生 routes、SQLite 本地数据与 Workspace/Cache/Assets/Equipment、单配置光路、Siril CLI 和独立 MCP。宿主拥有画布、工作流、队列与撤销。按最新用户决定，以本地实现为当前行为基线。旧 Chat 与原始规格中的设计差异保留作历史参考。接手时按当前任务和实际复现证据决定修改范围。

## 首个修改任务的建议次序

1. 重现前端默认测试失败。完善 CSS mock mapping 并用正规命令跑完整套件。检查现有 Vue/browser/host 脚本断言是否基于最新 UI。
2. 保留 Inspector 与画布双向编辑同一组 shadowsclip、targetbg、linked，支持重置。本期无 Trial。补实际 NodeView 的调参与重置同步、宿主 read_only/selectOnly 拒绝写入、单色 linked 禁用、候选预览刷新及旧请求清理测试。
3. 任务涉及并发编辑、归档设备或引用提示时，先复现具体问题，再按当前行为和用户要求处理。单配置与现有 API 是接手基线。
4. 对工作范围需要的真实宿主动作在获授权的临时用户、输入、输出、Cache、Workspace 和数据根启动独立实例。检查节点 Schema 确为 IMAGE_PATH。历史 8199/8201/8205 均不适合通用科学验收。

## 安全与核验命令

- 保留所有用户未提交更改。禁止 reset、clean、覆盖无关文件、修改宿主核心、运行宿主 uv sync 或变更用户资产，本轮交接不构成提交或发布授权。
- Python：.venv/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration tests/packaging；MCP：.venv/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests。
- 前端：pnpm -C frontend test:react、typecheck、lint。只读工作采用 pnpm -C frontend exec vitest run，因为 pnpm -C frontend test 会重建 js/。构建后检查单入口、CSS、相对 proxy。真实宿主脚本条件见 docs/development.md。
- 真实 Windows Siril 1.4.5：ASTROPHOTO_SIRIL_TEST_CLI 指向现有受控 CLI 可运行两条临时数据测试；其他平台必须独立测试，不要升级宿主。真实跨盘测试需明确隔离的第二卷临时目录。
- GET /astrophoto/v1/status 与 /object_info/AstroPhotoSirilAutoStretch 验证已加载 Schema，结合 /system_stats 区分实际版本。GET 检查不执行 workflow。
- 审计报告给出的测试失败、风险与精确行号是一份快照。按 [证据索引](14_SOURCES_AND_EVIDENCE.md) 回查，修正后更新项目开发文档与测试，并说明哪些已跑及哪些未重测。

---

# 证据索引、方法和边界

## 本地证据

| 证据 | 内容 |
|---|---|
| [源码账本](evidence/source-inventory.md) | 活跃源码、测试、工程配置和供应商构件逐文件 SHA 所属范围，说明核对级别。 [逐路径具名证据与清点限制](evidence/source-provenance.md)，[补充文件级复核](evidence/source-review.md) |
| [全部快照路径](evidence/repository-files.txt) / [SHA](evidence/source-hashes.json) | Git tracked + untracked（未排除文件）完整审计基线；另包含输入与被 ignore 的任务笔记 |
| [路由索引](evidence/routes.md) | 从当前 route registry 源码提取方法、路径、处理入口及成功响应，包括兼容拒绝路径 |
| [测试执行](06_TEST_COVERAGE_MATRIX.md) / [断言与用例](evidence/test-inventory.md) | 原始 pytest XML / Jest JSON / Chromium JUnit 和命令日志。静态断言摘录与本轮执行分离 |
| [需求输入](evidence/subagents/requirements.md) | 三套输入递归清单、SHA/重复、九张截图、两个 Siril 文档 diff；含子报告未通读的边界 |
| [后端](evidence/subagents/backend.md) | Router/Boot/SQLite/Workspace/Cache 分项，DDL、事务、路径/恢复 |
| [资产与设备](evidence/subagents/assets-equipment.md) | DTO、规格、当前配置、兼容 Revision、实际业务测试断言 |
| [Node/Siril](evidence/subagents/nodes-siril.md) | FITS/CLI/预览函数、端点与真实 CLI 的测试入口 |
| [前端](evidence/subagents/frontend.md) | React/Vue 真实入口、Inspector、vendor bridge、翻译与测试函数 |
| [MCP/构建](evidence/subagents/mcp-packaging.md) | 工具、网络及权限、协议、包内容、CI 与摘要 |

## 官方与历史事实来源

- 本机 ComfyUI 安装版本和四个活宿主的 /system_stats、/object_info、JS/CSS 产物 GET；见 [版本日志](evidence/versions.txt)。
- ComfyUI V3 入口和 Frontend host types 的当前依赖，参照项目 docs/react-sidebar.md 以及 vendor/comfyui/README.md 中的移植来源。
- 官方 Siril 1.4.5 下载出处和历史使用场景见项目 docs/siril.md:93。本轮执行安装现存二进制的 --version，并运行真实 CLI 测试。
- 11-16/17 历史交接、历史测试与截图用于区分演进。它们的计数不参与 11-18 本轮结果。设备共享链接尝试读取超时，已使用本地规格补充。
- 遇到新旧设计差异，以当前工作树为准。演进记录见 [对齐矩阵](11_HANDOFF_RECONCILIATION.md)，运行结论以原始测试记录为准。子报告里的「未运行」指只读子任务本身，不表示主审没有运行见证测试。

## 已知未完成的覆盖

输入目录清点、哈希和截图已完成。输入存在 81 个文件、62 个不同 SHA，旧全文汇编和副本较多。部分历史章节和原始长规格只做了关键决策交叉检查，非相同哈希的文本没有全部人工逐行语义核验。底层依赖/锁文件全依赖项、纯样式与 vendor 字段组合、生成 bundle 每行、reference 上游完整仓库不在语义审计覆盖内。文件覆盖账本是路径级核对，不能以哈希或机器提取代替人工判读。内部链接、快照差异和 Manifest 核对详见 [完整性](evidence/integrity.txt)。

---

## 静态审计附录 · assets-equipment

# Assets / Equipment 只读源码审计

范围：`astrophoto/assets/{imports,service}.py`、`astrophoto/equipment/{schemas,service,trains,snapshots}.py`、`astrophoto/api/{assets,equipment}.py`、`astrophoto/database/{models,equipment_models}.py` 及相关测试。路径均相对仓库。先以 exact-path CodeGraph 探索，再补读其省略段；本轮子代理未运行测试，所有实现状态均为 IMPLEMENTED_UNVERIFIED，除明确标注。实际套件结果由主代理独立记录；测试代码断言不等于通过或真实宿主验收。

## Feature / 入口 / 数据流

| ID | 用户行为、入口 → 调用链 / I-O、读写副作用 | 状态与证据 |
|---|---|---|
| A-01 | 预览选择文件/目录：POST `/assets/import/preview` → `preview` → `_selection/_files/_walk`；返回模式、目标、数量、大小、剩余空间、失败数、保留原文件；遍历文件系统无资产入库。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:24`、`astrophoto/assets/imports.py:44,59,86,105` |
| A-02 | 格式处理：所有枚举项经过路径及 stat，无扩展名白名单、内容探测或科学格式校验。 | IMPLEMENTED_UNVERIFIED / NO_GUARD_FOUND；`astrophoto/assets/imports.py:59-103`；非声称 FITS 解码或元数据提取 |
| A-03 | 授权路径：选择路径 resolve 后必须位于 `ASTROPHOTO_IMPORT_ROOTS`，且不可重叠 data、cache、保留 workspace；执行时重验。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:29-42,213-217,241-245` |
| A-04 | reference：POST import 返回 operation_id，任务保存路径及文件 stat、可绑定 session；原文件不复制；按规范化路径和 size/mtime 去重，同路径改变时报错。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:118-130,204-231` |
| A-05 | copy：选择或默认 workspace，lease、空间检查、staging、checkpoint、原子发布并核对 stat，资产和 receipt 同事务写入；原件保留。不同 key 对同内容没有内容去重。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:132-163,233-269` |
| A-06 | 查询/取消/重试导入：GET `/assets/imports/{id}`、POST `.../cancel`、`.../retry`；任务逐文件 receipt，取消在非 publishing 检查，清理自有 staging；全部失败为 failed，部分成功可 completed。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:55-60`、`astrophoto/assets/imports.py:139-202`；operation 通用状态机由 backend agent 覆盖 |
| A-07 | 列表、归属：GET `/assets` 按 UUID 游标返回最多 100 条、session_ids、mode、workspace_id；PATCH session 幂等挂接/解除，session 为字符串关联，并非独立观测 session 实体。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:10-14,46-50`、`astrophoto/assets/service.py:14-21,86-112`、`astrophoto/database/models.py:28-45` |
| A-08 | 失联检查 GET availability → resolve → stat；重新定位 POST 仅外部 reference，须授权且大小相等、路径不被占，更新 path/name/mtime。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:31-43`、`astrophoto/assets/service.py:35-41,67-84`；内容身份不作哈希验证 |
| A-09 | 工作区归属：managed location 保存 workspace_id + relative_key，resolve 经注册工作区；reference 保存 external_path/key；copy workspace 变更有 lease 与身份检查。Registry 具体策略由另一审计覆盖。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:132-137,233-269`、`astrophoto/assets/service.py:35-41` |
| A-10 | 设备类型：camera、primary_optics、optical_accessory、filter；创建/编辑共通字段和按类型规格、可空值；camera readout modes，filter 多 passband。 | IMPLEMENTED_UNVERIFIED；`astrophoto/equipment/schemas.py:8-29,90-155`、`astrophoto/database/equipment_models.py:11-106` |
| A-11 | 设备列表/详情/创建/更新/归档/恢复/删除：`/equipment` 系列 → EquipmentService → SQLite，Unicode casefold 搜索、游标、版本 CAS、关联使用情况。删除已引用设备拒绝。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/equipment.py:11-36,81-88`、`astrophoto/equipment/service.py:30-60,92-160` |
| A-12 | 光路列表、创建、详情、草稿保存、归档/恢复、删除：`/optical-trains` → OpticalTrainService；单可编辑配置、版本比较、设备类型检查；camera 与 primary 同时存在即 status `published`，并非发布历史。 | IMPLEMENTED_UNVERIFIED；`astrophoto/equipment/trains.py:44-76,83-97,99-194,207-212` |
| A-13 | 历史：只读 legacy revision 列表/详情、默认优先于最新 revision 作回退；保存新草稿不改旧快照；发布 revision 和设默认写入口返回 410。 | IMPLEMENTED_UNVERIFIED；旧版原需求已被本聊天明确取消多版本的后续决定取代；`astrophoto/api/equipment.py:64-78`、`astrophoto/equipment/trains.py:44-55,196-205` |
| A-14 | 设备关联与历史影响：光路配置存稳定设备 ID；详情读当前设备资料与名称，改设备即时影响当前展示；历史 snapshot 保留，引用阻止设备删除；删除光路会删除其 draft、default 和历史。资产与设备/光路关联未见实现。 | IMPLEMENTED_UNVERIFIED / 资产关联 PLANNED；`astrophoto/equipment/service.py:47-60,153-160`、`astrophoto/equipment/trains.py:44-75,83-97`、`astrophoto/database/models.py:28-45` |

## Guard 矩阵

| ID | 场景 → 校验 → 底层、失败处理/响应 | 证据 |
|---|---|---|
| GA-01 | 未授权路径 → canonical roots 包含且不与受保护路径重叠 → `SOURCE_NOT_AUTHORIZED`；无写入；执行时重验。 | `astrophoto/assets/imports.py:33-42,213-217,241-245` |
| GA-02 | 选择非列表、零或超过100、非字符串 → `INVALID_SOURCES`；目录最多10000项、最多40000访问 → `TOO_MANY_FILES`；单项不可读记录失败。 | `astrophoto/assets/imports.py:44-47,59-103` |
| GA-03 | 复制目标不存在/离线/只读/空间不足 → require/choose_space 抛错，任务记录 error，不注册资产；具体底层由 registry 审计。 | `astrophoto/assets/imports.py:105-116,125-128,145-152`；T-03 |
| GA-04 | 路径重复 reference → 相同 size/mtime skipped 并可追加 session；不同 metadata `DUPLICATE_ASSET`；NO_GUARD_FOUND 内容 hash / copy 内容去重。 | `astrophoto/assets/imports.py:220-231` |
| GA-05 | 执行中源变化 → fingerprint 比较/复制核验，`SOURCE_CHANGED`、清理 part、receipt failed；发布后 DB 异常保留 publishing 以恢复。 | `astrophoto/assets/imports.py:213-219,238-269`；T-04/T-05 |
| GA-06 | staging 所有权 marker 不匹配 → `RECOVERY_REQUIRED`，不删除他人数据；取消 checkpoint 清 part，不撤销已完成条目；publishing 阶段不抢断。 | `astrophoto/assets/imports.py:153-191,238-250` |
| GA-07 | relocate managed / size 变化 / 重复路径 → `ASSET_NOT_EXTERNAL` / `SOURCE_CHANGED` / `DUPLICATE_ASSET`；事务内拒绝；NO_GUARD_FOUND 同尺寸不同内容鉴别。 | `astrophoto/assets/service.py:67-84` |
| GA-08 | session 为空/非字符串/长度>120、asset 缺失、attached 非 bool → INVALID_REQUEST / ASSET_NOT_FOUND；数据库事务不更新。 | `astrophoto/assets/service.py:14-21,86-97`、`astrophoto/api/assets.py:46-50` |
| GA-09 | 设备/光路 JSON：未知字段、缺失、无效 UUID、非有限值或 bool 冒充数值、越界、重复 passband/组件、枚举不符 → `EQUIPMENT_VALIDATION_FAILED` 字段详情；事务前或事务回滚。 | `astrophoto/equipment/schemas.py:32-219`；数据库第二层约束 `astrophoto/database/equipment_models.py:11-155` |
| GA-10 | 设备并发更新/归档和删除 → expected_version 检查及 SQL CAS，版本不匹配 `EQUIPMENT_VERSION_CONFLICT`；引用 draft/revision 拒绝 `EQUIPMENT_REFERENCED`。 | `astrophoto/equipment/service.py:47-60,92-97,136-160` |
| GA-11 | 草稿设备缺失/类型不对、归档 train、旧 draft 版本 → validation / `EQUIPMENT_TYPE_MISMATCH` / `TRAIN_ARCHIVED` / `DRAFT_VERSION_CONFLICT`，事务回滚；已归档设备是否可新关联 NO_GUARD_FOUND（组件校验只检查存在和类型）。 | `astrophoto/equipment/snapshots.py:13-22`、`astrophoto/equipment/trains.py:169-194` |
| GA-12 | 历史不可变 → 更新/删除由 DB trigger 阻断，API 对旧写接口 410；删除 train 特意在同事务临时移除并恢复删除 trigger 后删除历史，失败回滚。 | `astrophoto/api/equipment.py:72-78`、`astrophoto/equipment/trains.py:83-97`、`astrophoto/database/equipment_models.py:162`；T-12 |
| GA-13 | 权限/HTTP → 测试覆盖 trusted local、origin、proxy、bearer 只读；不得将复合输入拒绝归因于 Comfy-User 标头；拒绝 403、格式 400、校验 422、冲突 409、历史写 410；详细实际中间件条件由 backend agent 审计。 | `tests/integration/test_equipment_api.py:25-51,63-90`；`tests/integration/test_storage_api.py:27-38,68-85` |

## 测试双向映射（均为源码断言，未在本子任务运行）

| ID | 精确函数、边界与断言 → 覆盖功能/Guard；环境 |
|---|---|
| T-01 | `tests/backend/test_storage.py:176` `test_reference_multiple_roots_mode_snapshot_and_relocation`：多目录 reference、模式快照、重复 skipped、session、失联与 relocation → A-03/04/07/08，GA-04；真实临时 SQLite/文件，submit monkeypatch。 |
| T-02 | `:202` `test_copy_override_idempotency_and_real_bytes`：字节相等、不同 inode、同 key 返回同 operation、异 payload 冲突、staging 空 → A-05/06、GA-04；真实文件/SQLite。 |
| T-03 | `:219` `test_copy_preflight_blocks_offline_read_only_full_and_unauthorized`：离线、mock 权限/空间、禁止路径，无资产 → GA-01/03。 |
| T-04 | `:241` `test_copy_detects_inflight_source_change`：checkpoint 注入改源，SOURCE_CHANGED、无资产和 staging → GA-05；真实文件、monkeypatch。 |
| T-05 | `:259` `test_copy_recovers_after_publish_before_db_commit`：SQLAlchemy after_flush 注入故障，publishing/无数据库资产，重启恢复一份文件 → A-06、GA-05/06；真实 SQLite、故障注入。 |
| T-06 | `:283` `test_cancel_partial_staging`：checkpoint 取消，cancelled、无资产、源保留、staging 清空 → A-06、GA-06；monkeypatch。 |
| T-07 | `:358` `test_reference_shared_sessions_leave_the_file_and_other_reference`：两个 session 共用资产，解绑一个保留另一个与文件 → A-07、GA-08。 |
| T-08 | `:370` `test_process_exit_during_copy_resumes_own_staging`：子进程 os._exit(77)，重启恢复 copy 并清 staging → A-06、GA-06；真实子进程/SQLite。 |
| T-09 | `tests/backend/test_equipment.py:47` `test_equipment_lifecycle_and_optional_specs`：四类型、空/false、通带顺序/ID、Unicode 搜索、版本冲突、归档恢复和删除 → A-10/11、GA-09/10；真实 SQLite。 |
| T-10 | `:87` `test_invalid_fields_never_persist`：错误类型、无穷、0、重复通带不入库 → GA-09；`:94` `test_pagination_same_model_and_rollback` 注入规格写后异常并验证名称与通带回滚 → A-11、GA-09/10。 |
| T-11 | `:117` `test_database_constraints_and_incompatible_same_version`：类型 trigger、外键和 schema 完整性；`:136` `test_incomplete_configuration_and_reference_validation`：错误设备类型、草稿保持、无 revision → A-12/13、GA-09/11。 |
| T-12 | `:148` `test_single_configuration_concurrent_save_and_live_specs`：两个线程同版本恰一冲突、设备改名实时展示、引用删除被拒、重开保持 → A-12/14、GA-10/11；`:210` legacy 默认、快照不可变及删除；`:238` 注入历史删除故障后验证 trigger 和历史回滚 → A-13/14、GA-12。 |
| T-13 | `tests/integration/test_equipment_api.py:15` `test_equipment_and_train_api_permissions_receipts_and_errors`：aiohttp TestClient/真实临时 SQLite，403、400、422、分页、201、409、410、删除 204；`:104` 路由冲突不部分注册 → A-10–14、GA-09–13；非真实 ComfyUI 宿主。 |
| T-14 | `tests/integration/test_storage_api.py:14` `test_http_storage_import_and_access_boundary`：aiohttp、临时真实文件/SQLite，授权、预览、异步 copy receipt、源字节未变 → A-01/03/05/06、GA-01/03/13；非真实宿主。 |

反向覆盖缺口：A-02 无扩展名筛选是观察到的行为，未找到通用导入必须筛选扩展名的产品要求，不能当成缺陷；A-08 同尺寸替换的身份安全、GA-11 已归档设备能否选用、目录巨大/链接竞争、真实宿主端到端以及 copy 内容去重均未见上述测试证明；不等于断言整个仓库绝无其他测试。

## 三套交接材料对照

- Chat_Handoff `FULL_CONTEXT.md:21-25,60,101`：当时报设备/光路尚无业务实现、资产默认 reference 可 copy；前者为旧快照，现行 `equipment/service.py:100-160` 和 `trains.py:79-212` 已有后端实现，后者与 `imports.py:44-57` 一致。不能从后端推断三端或真实宿主验收。
- Last_Handoff `sources/02_REQUIREMENTS.md:69,84-88` 把资产/设备持久化列为目标、包括 mount/filterwheel 等；现行仅 A-01–14 子集和四类设备，前者过时、广义目标仍未完成。
- Original_request `设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md:21-26` 四类设备、多通带、可排序配件与后端部分一致；其不可变 revision 发布及派生编辑要求与 A-13 显式 410 有历史差异；本聊天已明确取消多版本，故当前停用符合最新决策。`...Three_Tier_Engineering_Guide_v1.0.md:17-18,65-67` 要求历史/默认、将来资产关联；目前历史只读、资产关联尚无。需求文档并不证明实现或通过。

## 风险、已读与未覆盖

主要风险：旧交接的多版本需求已被本聊天明确取消的决定取代，不应据此报告当前实现缺陷；`published` 仅表示配置完整；设备当前资料非冻结历史；删除光路连带移除旧历史；导入未按格式筛选（未证明是需求缺陷），reference 身份仅路径/stat，relocate 仅 size；同一文件不同 copy 操作可多份；session 仅字符串，非完整资产领域。权限边界、operation retry 全状态、Workspace Registry 与前端/MCP 由其他代理负责，不能以本报告替代。已读取本报告引用的实现片段、测试函数与三组交接的相关片段；未逐行审核全部交接文档、模型迁移、所有 storage/path/operation 底层或其余测试；详细 GUI/宿主行为未覆盖。`设备管理与光学链路前后端需求规格.md` 按 Chat Handoff 称为空白，未当作需求事实。


## 补充：按独立 HTTP 操作拆分（均 IMPLEMENTED_UNVERIFIED，路径前缀 `/astrophoto/v1`）

| ID | 方法及路径 → 方法、输入与输出、数据或副作用 |
|---|---|
| A-15 | GET `/assets` → `list_assets` → `AssetService.list(after)`；UUID 游标，返回 assets/next，读库。`astrophoto/api/assets.py:10-14,55`、`astrophoto/assets/service.py:99-112` |
| A-16 | POST `/assets/import/preview` → `AssetImportService.preview`；sources/可选模式、workspace、session；枚举计数及空间，读取文件系统。`astrophoto/api/assets.py:24-28,57`、`astrophoto/assets/imports.py:105-116` |
| A-17 | POST `/assets/import` → `import_assets`；同前加 idempotency_key；返回 operation_id，创建并异步提交。`astrophoto/api/assets.py:17-21,56`、`astrophoto/assets/imports.py:118-130` |
| A-18 | GET `/assets/imports/{id}` → operations.status；查询 receipt。`astrophoto/api/assets.py:58`、`astrophoto/api/storage.py:99-103` |
| A-19 | POST `/assets/imports/{id}/cancel` → operations.cancel；请求取消。`astrophoto/api/assets.py:59`、`astrophoto/api/storage.py:99-103` |
| A-20 | POST `/assets/imports/{id}/retry` → operations.retry；重试任务。`astrophoto/api/assets.py:60`、`astrophoto/api/storage.py:99-103`；通用状态边界另由 backend 审计。 |
| A-21 | POST `/assets/{id}/relocate` → `AssetService.relocate(new_path)`；更新外部位置。`astrophoto/api/assets.py:31-32,61`、`astrophoto/assets/service.py:67-84` |
| A-22 | PATCH `/assets/{id}/sessions` → `set_session(session_id,attached)`；增删映射。`astrophoto/api/assets.py:46-50,62`、`astrophoto/assets/service.py:86-97` |
| A-23 | GET `/assets/{id}/availability` → `resolve_asset`；available/reason，检查文件。`astrophoto/api/assets.py:35-43,63` |
| A-24 | GET `/equipment` → `list_equipment`；type/q/archived/after/limit，返回 total/items/next。`astrophoto/api/equipment.py:11-12,83`、`astrophoto/equipment/service.py:104-119` |
| A-25 | GET `/equipment/{id}` → `get_equipment`；规格及使用情况。`astrophoto/api/equipment.py:15-16,84`、`astrophoto/equipment/service.py:121-123` |
| A-26 | POST `/equipment` → `create_equipment`；类型、名称及规格，201 与新实体，事务插入。`astrophoto/api/equipment.py:19-20,85`、`astrophoto/equipment/service.py:125-134` |
| A-27 | PATCH `/equipment/{id}` → `update_equipment`；expected_version 和修改字段；CAS 及规格更新。`astrophoto/api/equipment.py:23-24,86`、`astrophoto/equipment/service.py:136-144` |
| A-28 | DELETE `/equipment/{id}` → `delete_unused_equipment`；expected_version，成功 204；拒绝被引用。`astrophoto/api/equipment.py:34-36,87`、`astrophoto/equipment/service.py:153-160` |
| A-29 | POST `/equipment/{id}/archive` → `set_archived(...,True)`；expected_version，设置时间。`astrophoto/api/equipment.py:27-31,88`、`astrophoto/equipment/service.py:146-151` |
| A-30 | POST `/equipment/{id}/restore` → `set_archived(...,False)`；清除归档时间。`astrophoto/api/equipment.py:89`、`astrophoto/equipment/service.py:146-151` |
| A-31 | GET `/optical-trains` → `list_trains`；q/status/archived/after/limit，total/items/next。`astrophoto/api/equipment.py:39-40,90`、`astrophoto/equipment/trains.py:99-143` |
| A-32 | POST `/optical-trains` → `create_train`；名称、备注、可选 draft，201；事务插入。`astrophoto/api/equipment.py:43-44,91`、`astrophoto/equipment/trains.py:145-157` |
| A-33 | GET `/optical-trains/{id}` → `get_train`；当前配置、设备与摘要。`astrophoto/api/equipment.py:47-48,92`、`astrophoto/equipment/trains.py:44-76,159-161` |
| A-34 | DELETE `/optical-trains/{id}` → `delete_train`；expected_version，204，事务删除配置和旧历史。`astrophoto/api/equipment.py:51-53,93`、`astrophoto/equipment/trains.py:83-97` |
| A-35 | GET `/optical-trains/{id}/draft` → `get_draft`；读取 draft，可为空。`astrophoto/api/equipment.py:56-57,94`、`astrophoto/equipment/trains.py:163-166` |
| A-36 | PUT `/optical-trains/{id}/draft` → `save_draft`；draft、expected_draft_version，更新配置并返回版本。`astrophoto/api/equipment.py:60-61,95`、`astrophoto/equipment/trains.py:169-194` |
| A-37 | GET `/optical-trains/{id}/revisions` → `list_revisions`；读取历史列表。`astrophoto/api/equipment.py:64-65,96`、`astrophoto/equipment/trains.py:196-201` |
| A-38 | GET `/optical-trains/{id}/revisions/{revision_id}` → `get_revision`；读取校验过的历史快照。`astrophoto/api/equipment.py:68-69,98`、`astrophoto/equipment/trains.py:21-35,203-205` |
| A-39 | POST `/optical-trains/{id}/revisions` → `legacy_revision_write`，410；本聊天已取消多版本，停用为预期。`astrophoto/api/equipment.py:72-73,97` |
| A-40 | PATCH `/optical-trains/{id}/revisions/{revision_id}` → 检查存在后 `REVISION_IMMUTABLE`，409。`astrophoto/api/equipment.py:76-78,99` |
| A-41 | DELETE `/optical-trains/{id}/revisions/{revision_id}` → 同 A-40；409。`astrophoto/api/equipment.py:76-78,100` |
| A-42 | PUT `/optical-trains/{id}/default-revision` → `legacy_revision_write`，410；停用为预期。`astrophoto/api/equipment.py:72-73,101` |
| A-43 | POST `/optical-trains/{id}/archive` → `set_archived(...,True)`，版本 CAS。`astrophoto/api/equipment.py:27-31,102`、`astrophoto/equipment/trains.py:207-212` |
| A-44 | POST `/optical-trains/{id}/restore` → `set_archived(...,False)`，版本 CAS。`astrophoto/api/equipment.py:103`、`astrophoto/equipment/trains.py:207-212` |

归档关联精确结论：`validate_train_components` 对每个请求中 ID 仅检查设备存在及类型，完全不检查 `archived_at_utc` 或此前草稿；因此 **所有已归档设备均可在后端新加入或继续关联**，而不只是保留已关联者（`astrophoto/equipment/snapshots.py:13-22`、`astrophoto/equipment/trains.py:169-176`）。此为源码推断，未进行实际调用，也不自动认定是违反需求。

权限精确边界：资产路由经 storage handler，要求可信本机部署、loopback remote/Host、无代理转发、同源 Origin/Fetch，且 `X-AstroPhoto-Local: 1`；设备路由同样要求直接本机，浏览器写/读须同源 Fetch 与本地标头；Bearer 仅 GET，不能带 Origin/Fetch，token 为 43–256 ASCII 字母数字或 `-_`；不识别其他本地进程。`astrophoto/api/routes.py:24-35`、`astrophoto/api/security.py:18-63`、`astrophoto/api/storage.py:106-110`。本机信任而非用户级隔离，`Comfy-User` 本身未被 security.py 检查：测试中的该 header 拒绝案例同时缺少设备必需 Fetch 标头或发生在 trusted_local=False，不能归因于该 header；handler 限制 JSON 体 65536 字节并映射错误（`astrophoto/api/storage.py:112-172`）。

格式需求纠正：`Chat_Handoff/FULL_CONTEXT.md:614` 将格式当独立字段，Siril 专项 `AstroPhotoFlow_Siril_Handoff_2026-11-18/04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:28` 要求 FITS 单图实际有效而不能仅靠扩展名；它适用于专门的 FITS 路径，不能推导通用导入必须使用扩展名白名单。A-02 只是通用导入无过滤的事实，未证明白名单是产品要求。尚未逐字搜索全部资料，需求真实性范围有限。

专业规格和 DB 补充：相机支持 sensor_name/kind、宽高 px、像素 x/y、Bayer、ADC、冷却、bin x/y、最多32 readout modes；主光学含 kind/design、口径、焦距、f ratio、像圈、备注；配件含 kind、factor、backfocus、clear aperture、备注；滤镜含 kind、尺寸、format、最多32 passbands，通带 label 唯一、center/fwhm 可空，顺序持久化。数值有限，普通值 >0，backfocus 可为0；整数上限宽高 1000000、ADC 64、bin 1024；readout gain/offset 为 -1000000..1000000 且最小不大于最大。`astrophoto/equipment/schemas.py:8-29,80-155`。设备规格表通过 FK 和正值/枚举约束；passband 每 filter 的位置与标签唯一；revision 每 train 的编号和幂等键唯一，复合 FK 限定同 train 的 base/default。trigger 禁止历史 UPDATE/DELETE/冲突 REPLACE，禁止改设备类型，规格 INSERT/UPDATE 与设备类型匹配；`astrophoto/database/equipment_models.py:11-185`。删除 train 暂时 DROP 后重建删除 trigger 处在写事务中，回滚依赖 T-12 源码测试，尚无本轮测试结果。

## 精确测试函数补充与未匹配

以下每行是一条函数而非聚合，均未在本子任务执行；此前 T-01–14 中被合并的函数以此拆开：

- `tests/backend/test_equipment.py:47 test_equipment_lifecycle_and_optional_specs` → A-24–30；四类型及 passband、版本、归档恢复；真实 SQLite。
- `:87 test_invalid_fields_never_persist` → A-26/27、GA-09；参数化坏规格无记录。
- `:94 test_pagination_same_model_and_rollback` → A-24/26/27；分页和 monkeypatch 写后失败回滚。
- `:117 test_database_constraints_and_incompatible_same_version` → GA-09/12；SQLite FK/type trigger 及 schema 完整性。
- `:136 test_incomplete_configuration_and_reference_validation` → A-32/36；不完整、错类型及回滚。
- `:148 test_single_configuration_concurrent_save_and_live_specs` → A-33/36；双线程冲突、实时设备名、关联禁止删除、重启。
- `:210 test_existing_default_loads_without_rewriting_legacy_history` → A-33/34/36–38；种植 legacy，默认优先、历史不可变、删除。
- `:238 test_legacy_train_delete_rolls_back_history_and_trigger` → A-34、GA-12；SQLAlchemy 事件注入故障，回滚 trigger/历史。
- `tests/integration/test_equipment_api.py:15 test_equipment_and_train_api_permissions_receipts_and_errors` → A-24–44 的部分路径和 GA-13；aiohttp TestClient、真实临时 SQLite，并未逐个调用每一条路径。
- `:104 test_equipment_route_conflict_has_no_partial_registration` → 路由注册冲突，非运行时设备操作。
- `tests/backend/test_storage.py:176 test_reference_multiple_roots_mode_snapshot_and_relocation` → A-17/21/23。
- `:202 test_copy_override_idempotency_and_real_bytes` → A-17/18。
- `:219 test_copy_preflight_blocks_offline_read_only_full_and_unauthorized` → A-16/17。
- `:241 test_copy_detects_inflight_source_change` → A-17/18。
- `:259 test_copy_recovers_after_publish_before_db_commit` → A-17/18，注入故障。
- `:283 test_cancel_partial_staging` → A-19，注入取消。
- `:358 test_reference_shared_sessions_leave_the_file_and_other_reference` → A-22。
- `:370 test_process_exit_during_copy_resumes_own_staging` → A-17/18，真实子进程崩溃。
- `:419 test_reject_links_unc_and_relative_paths` → GA-01 路径原语；Windows symlink 不可用时 junction。
- `:442 test_reference_on_distinct_windows_volumes` → A-17 跨盘，环境变量缺失会 skip，不能宣称覆盖运行。
- `tests/integration/test_storage_api.py:14 test_http_storage_import_and_access_boundary` → A-15–18；aiohttp 测试服务器和临时文件。
- `:92 test_invalid_storage_config_preserves_status_route` → 配置错误 status 降级和保留用户文件；模拟 extension，非真实宿主。

同文件未映射到资产/设备功能的函数：`tests/backend/test_storage.py` 的 `test_first_start_and_reentry`、`test_bootstrap_interrupted_after_database_commit`、`test_never_replaces_an_existing_asset_database`、`test_multi_process_bootstrap`、`test_foreign_keys_busy_rollback_and_backup`、`test_multiple_workspaces_default_disable_and_offline_relocation`、`test_cache_owner_entries_only_with_live_lease`、`test_migration_recovers_around_database_switch`、`test_migration_actual_cross_volume`、`test_migration_verification_error_keeps_source`、`test_explicit_wal_failure_has_no_fake_ready`、`test_legacy_dev_schema_is_preserved` 主要属于通用 storage/database/cache/migration，由 backend agent 覆盖，未逐一映射。`tests/backend/test_siril.py:155,192` 和 `tests/integration/test_siril_api.py` 间接使用 Asset，属 Siril 审计，不在此宣称完整核验。独立 HTTP A-20、A-25、A-28–30、A-35、A-38、A-40–44 尚未在以上逐个测试的断言中明确匹配；需由主审计补查，不能把整体集成测试等同于逐端点覆盖。

---

## 静态审计附录 · backend

# 后端公共层审计证据（2026-11-18）

## 范围、方法与状态

本次只读审计工作树 `main`，HEAD `5e39fcf352995918c3ba3d06b88cd61a2cbeca1a`；`git status --short` 显示大量已修改及未跟踪文件，包括本范围源码，故以下为工作树证据，不代表 HEAD。`.codegraph/` 存在，首先用 exact-path `codegraph explore` 查询入口及 API、storage/database；然后直接核对磁盘源码和测试。没有修改生产代码或测试。本子代理未运行测试；下表实现状态统一为 **IMPLEMENTED_UNVERIFIED**，表示本轮尚无可归属的运行证据，不表示通过。Host、跨卷、竞态、崩溃的完整验收不可由源码推断。Assets/Equipment 业务细节归其他审计，本表只包括公共接口和数据库约束。

覆盖文件：`__init__.py`、`astrophoto/bootstrap.py`、`astrophoto/core/{capabilities,config,errors,paths}.py`、`astrophoto/database/{manager,models,equipment_models}.py`、`astrophoto/database/migrations/{env.py,versions/0001_equipment_baseline.py}`、`astrophoto/storage/{runtime,initializer,locations,paths,manager,migration,operations,cache}.py`、`astrophoto/api/{routes,security,errors,status,storage}.py`。测试定位 `tests/backend/{test_core,test_status,test_storage}.py`、`tests/integration/{test_status_api,test_storage_api,test_host_runtime}.py`、`tests/nodes/test_registration.py`；这些测试以实际断言为准，未逐条执行。`api/assets.py`、`api/equipment.py`、`api/siril.py` 的业务操作在其他审计范围，公共 wrapper 在此。

## Feature 与调用链

| ID | 用户行为/输入 → 输出；调用、写入及副作用 | 证据 | 关联测试 |
|---|---|---|---|
| B-01 | 启动宿主 → V3 节点列表、注册一次路由；已存在标记 runtime 则复用，否则线程执行 `host_runtime`，评估可信部署后注册；没有在 import 初始化。 | `__init__.py:12`, `__init__.py:29`, `astrophoto/bootstrap.py:49` | T01 T02 T03 |
| B-02 | 设置 `ASTROPHOTO_HOME` → 绝对本地数据根；无效配置回退默认但标记 `INVALID_STORAGE_PATH`，不尝试初始化；其他初始化异常记录并降级。版本来自根 pyproject。 | `astrophoto/core/paths.py:10`, `astrophoto/core/config.py:30`, `astrophoto/bootstrap.py:36` | T01 T04 |
| B-03 | 首启或重启 → 锁住数据根，创建/检查 manifest、settings、SQLite、默认 Workspace、Cache marker；创建完成后原子标记 initialized，再恢复 runs 和未完成 operation。异常并不伪装 ready。 | `astrophoto/storage/runtime.py:46`, `astrophoto/storage/runtime.py:56`, `astrophoto/storage/initializer.py:41`, `astrophoto/storage/initializer.py:53`, `astrophoto/storage/initializer.py:75` | T05 T06 T07 T08 |
| B-04 | SQLite 打开、建库/检查、备份 → `DatabaseManager` 通过 Alembic baseline，外键、busy timeout、FULL 和 WAL；事务 context 异常回滚；health 验证 revision、schema、identity 和 WAL；备份到独立目标。旧/不符 schema 不自动删除。 | `astrophoto/database/manager.py:27`, `astrophoto/database/manager.py:52`, `astrophoto/database/manager.py:64`, `astrophoto/database/manager.py:111`, `astrophoto/database/manager.py:120`, `astrophoto/database/manager.py:128`, `astrophoto/database/manager.py:144` | T07 T09 T10 |
| B-05 | 查状态 → 未经 storage wrapper 的公共 GET status 输出 extension/version、注册状态、data_home、能力；数据库失败或节点/路由未注册则 degraded。不能证明实际执行成功。 | `astrophoto/api/status.py:11`, `astrophoto/core/capabilities.py:4` | T02 T11 |
| B-06 | GET `/storage` → wrapper 授权 → `snapshot` → DB health、settings、Workspace status、Cache status 和最近 operation；不可信请求返回不可用且不披露工作区。 | `astrophoto/api/storage.py:38`, `astrophoto/storage/runtime.py:94`, `astrophoto/api/storage.py:112` | T12 |
| B-07 | PATCH storage/settings 输入 revision、imports/workspace/cache → 验证后锁内比对 revision、原子写 settings 并递增 revision；冲突不写。 | `astrophoto/api/storage.py:45`, `astrophoto/storage/runtime.py:76`, `astrophoto/core/config.py:132` | T12 T13 |
| B-08 | 注册 Workspace path/name → 路径规范/无重叠、空目录所有权 marker、建立 objects/outputs/.staging、写 DB；中断后仅相同实例 marker 且无业务数据可重入。 | `astrophoto/api/storage.py:58`, `astrophoto/storage/locations.py:64`, `astrophoto/storage/locations.py:75`, `astrophoto/storage/locations.py:100` | T12 T13 |
| B-09 | 更新名称、启停、设默认、校验 → lease+lock/revision，默认不能停；验证在线且 staging 可创建临时文件。状态包括 offline、identity_mismatch、read_only、disabled、migrating、error。 | `astrophoto/storage/locations.py:124`, `astrophoto/storage/locations.py:151`, `astrophoto/storage/locations.py:173` | T12 T13 |
| B-10 | 重定位离线 Workspace → 原路径 marker 不匹配/不存在，目标必须同实例同 workspace marker，再 DB 重绑；仅改变引用，不移动文件。删除只删注册记录；默认、有资产或活动操作拒绝，目录保留。 | `astrophoto/storage/locations.py:202`, `astrophoto/storage/locations.py:219`, `astrophoto/storage/locations.py:236` | T12 T13 |
| B-11 | 修改 Cache 路径/上限 → 校验 revision、路径和 marker；新目录 claim 后原子更新配置，旧 cache 保留而非搬运。 | `astrophoto/api/storage.py:84`, `astrophoto/storage/cache.py:156` | T14 |
| B-12 | 写/读/清 Cache → 只在命名 bucket 存 UUID 文件并保存身份描述；预算和磁盘检查；清除仅验证单硬链接、完整 marker 的文件，锁冲突跳过，返回 removed/skipped/failed；Siril scratch 限已知名称清理。 | `astrophoto/storage/cache.py:35`, `astrophoto/storage/cache.py:54`, `astrophoto/storage/cache.py:75`, `astrophoto/storage/cache.py:80`, `astrophoto/storage/cache.py:124`, `astrophoto/storage/cache.py:175` | T14 |
| B-13 | 请求迁移 workspace 到空目标及幂等 key → 复用相同请求 operation，不同请求同 key 冲突，检查 active operation，创建 queued 并异步 submit。 | `astrophoto/api/storage.py:93`, `astrophoto/storage/migration.py:24`, `astrophoto/storage/migration.py:31`, `astrophoto/storage/operations.py:29` | T15 T16 |
| B-14 | 迁移 preparing/copying/verifying → lease、盘点对象/输出，要求 staging 空、引用文件存在、足量空间；每文件复制到 part、校验 SHA256 并发布，保存 receipt；二次盘点并核对原始指纹及 hash。 | `astrophoto/storage/migration.py:48`, `astrophoto/storage/migration.py:75`, `astrophoto/storage/migration.py:83`, `astrophoto/storage/migration.py:103`, `astrophoto/storage/manager.py:37` | T15 T16 |
| B-15 | 迁移 publishing/committed → 写目标 workspace marker；锁内同一 SQLite 事务 rebind 及 operation committed；恢复 committed 后验证目标、移除自有 migration marker、completed。旧源保留；失败不会声称回滚已经发布的文件。 | `astrophoto/storage/migration.py:134`, `astrophoto/storage/migration.py:143`, `astrophoto/storage/migration.py:150`, `astrophoto/storage/migration.py:158` | T15 T16 |
| B-16 | 查询/取消/重试 operation → status 去除私有 receipt 字段；非终态且非 committed 标记 cancel，checkpoint 抛取消；启动重投非终态，可能保留 checkpoint 和中间文件供恢复；committed 不可取消。 | `astrophoto/storage/operations.py:51`, `astrophoto/storage/operations.py:76`, `astrophoto/storage/operations.py:90`, `astrophoto/storage/operations.py:110`, `astrophoto/storage/operations.py:116` | T15 T17 |
| B-17 | HTTP 路由注册与公共错误 → status route ownership 检查、冲突拒绝，其他 definitions 经共享 wrapper；授权、JSON、资源可用性、异常分类后回 request_id/no-store；I/O 及业务 action 离开事件循环。 | `astrophoto/api/routes.py:15`, `astrophoto/api/storage.py:106`, `astrophoto/api/errors.py:14` | T02 T12 |
| B-18 | HTTP 身份边界 → 只有显式开启并 listen 全回环、无 multi-user/CORS 的环境才可信；检查 remote、host、origin、Fetch-Site、forwarded 和专用 header；设备只读 bearer 为单独路径。公开 status 不走此授权。 | `astrophoto/api/security.py:18`, `astrophoto/api/security.py:25`, `astrophoto/api/security.py:42`, `astrophoto/api/security.py:46`, `astrophoto/api/status.py:26` | T12；设备专测见其他审计 |

## 数据库表与约束

`assets.db` 当前唯一创建的业务库；knowledge/memory 返回 not_initialized（`astrophoto/database/manager.py:128`）。SQLAlchemy 表：`storage_identity` 单行 id=1 且 instance 唯一；`storage_locations` canonical_root 唯一；`assets`；`asset_sessions` 复合主键和 asset FK；`asset_locations` FK、workspace+relative 唯一，external 和 managed 字段互斥 check；`storage_operations` kind+key 唯一且 kind 限 import/migration（`astrophoto/database/models.py:11`, `:18`, `:28`, `:36`, `:42`, `:62`）。Equipment 表在 `astrophoto/database/equipment_models.py:11`：equipment 类型/名称/版本检查；camera_specs、primary_optics_specs、optical_accessory_specs、filter_specs 各有 equipment FK 和数值/类型检查；camera_readout_modes 的 camera+mode 唯一及上下界；filter_passbands 的 filter+label/position 唯一；optical_trains、revisions、drafts、defaults 的 FK、版本、JSON 及复合唯一/复合 FK；类型 trigger `:162`。baseline DDL `astrophoto/database/migrations/versions/0001_equipment_baseline.py:8`；精确 schema SQL 比对而非任意向前迁移（`astrophoto/database/manager.py:111`），未知版本须人工处理。上述 schema 不意味着 Equipment 业务在本审计已验收。

## Guard 矩阵

| ID | 场景 → 验证 → 业务/底层 → 异常或清理 → 表现 |
|---|---|
| GB-01 | 请求部署身份 → env 开关、listen 均回环、禁 multi-user/CORS → remote/Host/Origin/forwarded/Fetch-Site → 拒绝 → 403；storage snapshot 特例为 unavailable 200。`astrophoto/api/security.py:18`, `:25`, `astrophoto/api/storage.py:115`；T12。 |
| GB-02 | 设备 bearer → 仅 GET、无 Origin/Fetch-Site、43–256 ASCII token 且 constant-time 比较；浏览器路径要求 same-origin 与专用 header；不识别其他本地进程。`astrophoto/api/security.py:46`, `:60`；设备测试另查。 |
| GB-03 | 非 JSON、超 65536 字节、非法 JSON、字段缺失/多余、非 canonical UUID → wrapper/DTO 拒绝 → `INVALID_REQUEST`；普通 storage 422，equipment 400。`astrophoto/api/storage.py:23`, `:32`, `:132`, `astrophoto/api/errors.py:33`；未逐项找到本范围断言。 |
| GB-04 | 路径相对、UNC、链接/reparse、穿越、跨保留根重叠 → `checked_path`/`canonicalize_root`/`safe_join_workspace` 及 candidate 拒绝；底层不创建业务文件。`astrophoto/storage/paths.py:12`, `:39`, `:60`, `:77`, `:83`, `astrophoto/storage/locations.py:64`；T13 T18。 |
| GB-05 | 磁盘不足/权限不足/满盘 → `choose_space`、读写异常 → `INSUFFICIENT_DISK_SPACE` 507 或 `STORAGE_PATH_UNWRITABLE` 422；operation 可保留 checkpoint。`astrophoto/storage/manager.py:37`, `astrophoto/api/storage.py:154`, `astrophoto/storage/operations.py:126`；T19。 |
| GB-06 | 重复/并发修改 → 进程锁、workspace lease、revision 与唯一键；锁超时/active 为 busy，revision conflict 409；SQLite 事务异常回滚。`astrophoto/storage/locations.py:32`, `:36`, `:173`, `astrophoto/storage/operations.py:29`, `astrophoto/database/manager.py:120`；T08 T09 T13。 |
| GB-07 | 默认 Workspace 停用/删除，含资产删除，原路径仍在线重定位，目标 marker 不符 → 拒绝，不删除目录或重绑定。`astrophoto/storage/locations.py:173`, `:202`, `:219`；T12 T13。 |
| GB-08 | 迁移目标非空、未知源内容、staging 未恢复、引用丢失、源变动或 hash 不一致 → 在切换前失败，源保留；失败目标可留自有数据。`astrophoto/storage/migration.py:24`, `:48`, `:75`, `:134`；T16。 |
| GB-09 | 迁移取消和进程中断 → checkpoint/锁+持久 operation；提交后只恢复完成，不可撤销；复制阶段中间文件不保证被删除。`astrophoto/storage/operations.py:76`, `:90`, `:110`, `:126`, `astrophoto/storage/migration.py:150`；T15 T17。 |
| GB-10 | Cache 清理非自有文件、硬链接、正在使用条目、错误 marker → 不删或跳过；范围只能已知 bucket/all；scratch 只处理匹配且拥有 marker 的已知名称。`astrophoto/storage/cache.py:35`, `:80`, `:175`；T14。 |
| GB-11 | 库丢失、损坏、revision 不匹配、WAL 不可用 → 保留既有文件、错误或 degraded，不创建假 ready；schema 校验包含模型及 trigger。`astrophoto/database/manager.py:64`, `:111`, `:128`；T07 T10。 |
| GB-12 | 公共 status 的本地绝对 data_home → **NO_GUARD_FOUND**：`status_handler` 直接返回 `status_payload`，不经过存储授权或 no-store wrapper（`astrophoto/api/status.py:11`, `:26`）。是否适合远程部署需单独评估。 |

## 双向测试矩阵（源码断言，未运行）

| ID / 精确测试 | 核对的实际断言与性质 | Feature/Guard |
|---|---|---|
| T01 `tests/backend/test_core.py:11`, `:24`, `:31` | import/config 不建立目录、默认路径、无效路径；临时文件/单元 | B-01 B-02 |
| T02 `tests/integration/test_status_api.py:14`, `:36` | 同一 status route、degraded→ok、DB 存在；ownership 冲突、server 隔离；aiohttp + 宿主替身 | B-01 B-05 B-17 |
| T03 `tests/nodes/test_registration.py:4` | V3 定义与注册替身；不能证明真实宿主 | B-01 |
| T04 `tests/integration/test_storage_api.py:92` | 无效根保留已有文件，status 200 degraded，storage 不可用而 drawing 可用 | B-02 |
| T05 `tests/backend/test_storage.py:52` | 首启重入同 workspace/instance、reference 默认、cache 20、只创建 assets.db、WAL/FK；真实临时 SQLite/FS | B-03 B-04 |
| T06 `tests/backend/test_storage.py:64` | monkeypatch cache 初始化失败后重入，instance 和初始 workspace 保持；真实 FS + 故障注入 | B-03 |
| T07 `tests/backend/test_storage.py:85` | manifest/settings/db 缺失、损坏、revision 不匹配均报预期码，保留文件字节 | B-03 B-04 GB-11 |
| T08 `tests/backend/test_storage.py:103` | 两真实子进程同时启动均成功且 instance 相同 | B-03 GB-06 |
| T09 `tests/backend/test_storage.py:116` | FK 错误回滚、双连接写锁、备份 integrity_check 和默认位置 | B-04 GB-06 |
| T10 `tests/backend/test_storage.py:463`, `:482` | 强制 WAL 失败不建表；旧 dev schema 不重置且 DB 字节相同 | B-04 GB-11 |
| T11 `tests/backend/test_status.py:6` | 能力跟随注册而非规划 | B-05 |
| T12 `tests/integration/test_storage_api.py:14` | 真 aiohttp TestServer，拒绝无权限/代理；可信快照、注册/校验/停用/删除（目录仍在）、设置冲突、导入和源不变；本地部署依赖模拟 | B-06–B-10 B-17 B-18 GB-01 GB-07 |
| T13 `tests/backend/test_storage.py:135` | 多 Workspace、嵌套及 cache 重叠拒绝、停用、离线及错误身份重定位、重启保留路径 | B-07–B-10 GB-04 GB-06 GB-07 |
| T14 `tests/backend/test_storage.py:161` | 更换 Cache 后旧数据保留；持锁文件跳过，未知及正式 Workspace 文件保留，只有自有文件删除 | B-11 B-12 GB-10 |
| T15 `tests/backend/test_storage.py:301` | 参数化 DB switch 周围故障恢复到 completed、路径重绑、源数据及 marker 保留；mock 故障 + 真 DB/FS | B-13–B-16 GB-09 |
| T16 `tests/backend/test_storage.py:342`, `:400` | 实际跨盘测试仅在 `ASTROPHOTO_TEST_SECOND_VOLUME` 提供时执行，否则 skip；hash 故障后 failed、旧根和字节保留、不写目标 workspace marker | B-13–B-15 GB-08 |
| T17 `tests/backend/test_storage.py:283`, `:370` | 取消部分 staging、模拟子进程退出及恢复 import；不能直接证明迁移各阶段取消的所有效果 | B-16 GB-09（部分） |
| T18 `tests/backend/test_storage.py:419` | 拒绝 links/UNC/相对路径及不应创建文件 | GB-04 |
| T19 `tests/backend/test_storage.py:219` | 导入 preflight 覆盖 offline/read-only/full/unauthorized 的错误；不是迁移全过程磁盘满测试 | GB-05（部分） |
| T20 `tests/integration/test_host_runtime.py:11` | 实际宿主需环境配置；本次未运行或获得结果，不能视为 Host 验收 | B-01 B-05 |

其他 `tests/backend/test_storage.py:176`, `:202`, `:241`, `:259`, `:358`, `:442` 主要覆盖资产 reference/copy、幂等、源变化、发布前后恢复、共享 session 和可选第二卷；资产业务由其他审计关联。本矩阵不声称已经覆盖全部错误/取消组合。

## 三套交接差异与风险

- `Last_Handoff/sources/01_CURRENT_STATE.md:5` 是历史快照，将 Assets/数据库列 PLANNED，且最小路由只有 status；当前 `database/models.py:11`、`storage/runtime.py:46`、`api/routes.py:24` 已有实现，历史状态 **OBSOLETE**，不能推断本轮 VERIFIED。
- `Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/08_WORKSPACE_SECURITY_AND_LIFECYCLE.md:60` 要求路径、允许根、权限、生命周期安全和多盘验证；当前已有本地路径、marker 和回环边界，但用户身份/远程授权不在现有模型内，真实多盘及竞态仍须运行验证。
- `Original_request/Siril_Integrate/AstroPhotoFlow_Siril_1.4.5_AutoStretch_Engineering_Development_Guide_v1.0.md:441` 要复用现存数据根、外置 Workspace 和独立 Cache，不强制搬迁原图；Cache configure 实际是切换新目录并保留旧数据，并非迁移旧 cache（B-11）。同文 `:682` 反对静默删除旧数据，当前 schema 不兼容时要求人工 reset 而非自动迁移（B-04）。
- 公共 status 返回物理 `data_home` 且不使用存储授权，远程暴露有信息披露风险；其是否违反部署策略取决于宿主网络配置（GB-12）。单用户 loopback 并不识别其他本地进程（`astrophoto/api/security.py:55`）。
- 对迁移失败/取消，不应笼统宣称跨文件系统事务回滚或自动清除所有目标数据；source 保留、checkpoint 可继续，已提交不能取消。全阶段恢复、目标清理、恶意路径竞态、磁盘满、真实 Windows 第二卷及宿主需要本轮专项证据。
- 本子代理未取得主代理的综合套件结果；本文件不把历史报告或测试源码等同本轮测试通过。未完成逐个函数的测试断言穷举以及逐表每列约束复核，相关结论为部分审计而非完整验收。

## 补充：逐项存储 API 和功能边界

状态仍为 IMPLEMENTED_UNVERIFIED，除非另列本轮运行证据。路径前缀均 `/astrophoto/v1`。所有下列 storage 请求先经 `handler` 授权，再检验 body 并以线程执行（`astrophoto/api/storage.py:106`）；错误经 `astrophoto/api/errors.py:14`，具体 UI 显示另见前端审计。

| Feature | 方法与输入 → 实际处理、返回及测试 |
|---|---|
| B-19 | GET `/storage` → `snapshot`；未授权特例 200 unavailable、不含路径；已授权检查 DB、工作区、Cache 和最近任务，200。T12。`astrophoto/api/storage.py:38` |
| B-20 | PATCH `/storage/settings` revision 必填，至少一个 imports/workspace/cache → `update_settings` 原子替换文件；错误 revision 409。T12。`astrophoto/api/storage.py:45`, `astrophoto/storage/runtime.py:76` |
| B-21 | POST `/storage/locations` path/name → 候选路径、空目录 claim、创建私有目录及 DB row，201；认领成功但 DB 写失败时标记可能残留，重入仅认可同实例且空布局。T12 T13。`astrophoto/storage/locations.py:75`, `:100` |
| B-22 | PATCH `/storage/locations/{id}` revision 和 name/enabled/default → revision 校验、DB 更新或单独原子设默认；default 不可与名称/启停同时提交，默认位置不可停。T12 T13 部分。`astrophoto/api/storage.py:63`, `astrophoto/storage/locations.py:173` |
| B-23 | POST `/storage/locations/{id}/validate` → 租约、状态和 `.staging` 临时文件探测；只返回状态，不修复。T12。`astrophoto/storage/locations.py:151` |
| B-24 | POST `/storage/locations/{id}/relocate` new_path → 原 marker 不在且目标身份匹配才 DB rebind；不搬运文件。T13；HTTP 路由成功及失败本文件未断言。`astrophoto/storage/locations.py:202` |
| B-25 | DELETE `/storage/locations/{id}` expected_revision → 检查默认、引用、活动任务后只删 DB 行、保留目录。T12 验证保留目录；含资产、活动任务和 revision 的 HTTP 失败未验证。`astrophoto/storage/locations.py:219` |
| B-26 | POST `/storage/cache/configure` path/max_size_gb/revision → 认领空目标或核验同目标；写配置，不复制/删除旧条目。T14；新 marker 创建后设置文件写失败可能留下已认领目录，未找到对应故障测试。`astrophoto/storage/cache.py:156` |
| B-27 | POST `/storage/cache/clear` scope → 仅带正确实例/条目 marker 的普通单链接文件，可锁时删数据再删 descriptor，返回统计。T14；descriptor unlink 失败可能留下孤儿描述，计 failed，非文件级事务。`astrophoto/storage/cache.py:175` |
| B-28 | cache producer `store` → bucket 检查、预算和剩余盘空间、独占创建、fsync、原子写 descriptor；descriptor 写失败可留下未被 `_entries` 认领的孤儿文件。未找到该窗口专项测试。`astrophoto/storage/cache.py:35`, `:54` |
| B-29 | cache `read_entry` → 检查桶/名称/root marker，条目锁、普通文件/单链接和身份描述，返回 bytes 或 validate-only；无效 `PREVIEW_NOT_FOUND`。本范围无独立断言。`astrophoto/storage/cache.py:124` |
| B-30 | cache scratch → registry 锁、预算、独占临时目录/锁和 owner marker；上下文退出清临时目录；启动使用时只清自己 marker 下固定 Siril 文件，未知内容保留。异常/崩溃完整矩阵未验证。`astrophoto/storage/cache.py:80`, `:103` |
| B-31 | POST `/storage/migrations` workspace_id/target_path/idempotency_key → UUID/字段、键复用及请求一致性、目标空闲、没有活动 workspace 操作，202 返回 operation_id。T15 为服务层成功/故障，HTTP 迁移提交未断言。`astrophoto/api/storage.py:93`, `astrophoto/storage/migration.py:31` |
| B-32 | GET `/storage/migrations/{id}` → 校验 UUID 和 kind，返回 phase、公开 receipt、cancel/error；不存在 404。`astrophoto/storage/operations.py:51`, `:58`。独立 HTTP 错误测试未找到。 |
| B-33 | POST `/storage/migrations/{id}/cancel` → 非终态且非 committed 设置 cancel_requested、提交 worker；在 checkpoint 变 cancelled；committed/终态不撤销。`astrophoto/storage/operations.py:76`, `:90`。本范围仅 import 取消 T17，不代表迁移所有阶段取消通过。 |
| B-34 | POST `/storage/migrations/{id}/retry` → 非终态清 error 并 submit，终态仅回状态；HTTP 定义 202，不保证已重新执行。`astrophoto/storage/operations.py:83`, `astrophoto/api/storage.py:176`。未找到独立 HTTP 断言。 |
| B-35 | 恢复 operation → 启动重新提交所有非终态；进程内 `_scheduled` 去重和进程间 FileLock；锁未取得直接返回，后续恢复/重试依赖另一次触发。`astrophoto/storage/operations.py:94`, `:110`, `:116`；T15 T17（不同 worker）。 |
| B-36 | 路由 ownership → status 冲突若无本插件 runtime 拒绝；若有则重用并更新 node callback；预先检查其他路由冲突，避免本次部分注册。`astrophoto/api/routes.py:15`；T02。 |
| B-37 | HTTP 错误映射 → 身份/来源 403、找不到 404、冲突 409、锁 423、空间不足 507、初始化/schema/WAL 503，其余请求错误通常 422，equipment INVALID_REQUEST 400；意外异常 500 且记录 request_id。`astrophoto/api/errors.py:14`, `astrophoto/api/storage.py:146`；T12 只覆盖部分状态。 |

## 补充：每张表的主约束及持久性

数据库建表由 `0001_equipment_baseline.py:8` 的 Alembic baseline 提供；`DatabaseManager.expected_schema` 用 SQLAlchemy metadata 和 trigger SQL 做严格比较（`astrophoto/database/manager.py:34`, `:111`）。`Mapped[T]` 非可选列由模型产生 NOT NULL；可选列允许 NULL，SQLite CHECK 对 NULL 不等于拒绝。以下行号均指 `astrophoto/database/models.py` 或 `astrophoto/database/equipment_models.py`。

| 表 | 主键、唯一、引用、检查及索引 | 行 |
|---|---|---|
| storage_identity | id PK 且 id=1，instance_id UNIQUE | models.py:11 |
| storage_locations | id PK，canonical_root UNIQUE；enabled/revision 默认 true/0；无数据库级路径重叠检查，应用层承担 | models.py:18 |
| assets | id PK，名称、size、mtime 非空；未见 size 非负 CHECK | models.py:28 |
| asset_sessions | (asset_id,session_id) 复合 PK；asset_id FK，session_id 索引 | models.py:36 |
| asset_locations | id PK，asset FK 和 workspace FK/索引，external_key UNIQUE，(workspace_id,relative_key) UNIQUE；CHECK 强制 external_reference 或 managed 两组字段互斥 | models.py:42 |
| storage_operations | id PK，(kind,key) UNIQUE；kind 只能 import/migration；phase 索引，request/plan/receipt JSON；phase 无枚举 CHECK | models.py:62 |
| equipment | id PK，type 四选一，trim name 1–120，row_version≥1，name 与 type/archive 索引；type 更新 trigger 禁止 | equipment_models.py:11, :174 |
| camera_specs | equipment_id PK/FK，sensor kind 枚举、像素尺寸/位深/bin 值为正，cooling bool 检查；type trigger 要求 camera | equipment_models.py:31, :181 |
| camera_readout_modes | id PK，camera_id FK；camera+mode_key UNIQUE，key/name 非空，gain/offset max≥min | equipment_models.py:49 |
| primary_optics_specs | equipment_id PK/FK；kind telescope/lens，口径/焦距/焦比/像圈为正；类型 trigger | equipment_models.py:67, :181 |
| optical_accessory_specs | equipment_id PK/FK；kind reducer/flattener/barlow，factor/clear aperture >0，backfocus ≥0；类型 trigger | equipment_models.py:79, :181 |
| filter_specs | equipment_id PK/FK；physical_size >0；类型 trigger | equipment_models.py:89, :181 |
| filter_passbands | id PK，filter_id FK；position≥0，label 非空 NOCASE，中心/带宽>0；filter+label 和 filter+position 分别 UNIQUE | equipment_models.py:97 |
| optical_trains | id PK，名称 1–120、row_version≥1 | equipment_models.py:108 |
| optical_train_revisions | id PK，train FK；revision/draft version≥1，snapshot JSON 有效；train+revision、train+id、train+idempotency UNIQUE；(train,base_revision) 复合 FK；UPDATE/DELETE 和冲突 INSERT trigger 拒绝 | equipment_models.py:119, :162 |
| optical_train_drafts | train_id PK/FK，draft JSON 有效、version≥1，(train,base_revision) 复合 FK | equipment_models.py:137 |
| optical_train_defaults | train_id PK/FK，(train,revision) 复合 FK | equipment_models.py:149 |
| alembic_version | Alembic 管理 schema 版本，实际期望 `0001_equipment_baseline`；未知版本拒绝而不重置 | `astrophoto/database/manager.py:27`, `:111` |

## 测试反向补全：两个指定文件全部测试函数

前述 T05–T10、T12–T19 已列大多数；补充本次逐行阅读遗漏的每个函数。所有结果是**断言内容**，不是本子代理运行结果。

| 测试函数 | 断言及边界 → Feature |
|---|---|
| `tests/backend/test_storage.py:176` | 暂缓 submit 后改默认模式，任务仍按创建时 reference 注册两个并保留原始字节；再次导入 skipped 2、session M42、原址失联后重定位；mock submit + 真 FS/SQLite → B-07/B-16，资产业务另审 |
| `tests/backend/test_storage.py:202` | copy 完成、1 个复制、size_and_stat、内容相同 inode 不同；同 key 同请求复用，同 key 改模式冲突，staging 空 → B-16/GB-06，资产业务另审 |
| `tests/backend/test_storage.py:241` | checkpoint 注入源追加，receipt SOURCE_CHANGED、无资产、staging 清空 → GB-08 类似源变化保护，但此为 import，不证明迁移同窗口 |
| `tests/backend/test_storage.py:259` | after_flush 注入异常，publishing/INTERNAL_STORAGE_ERROR 且无 asset；重启恢复 copied=1、对象恰一份、staging 空 → B-16/GB-09，import 发布窗口 |
| `tests/backend/test_storage.py:358` | 两次 reference 共两个 session，删除一个关联后剩余一个且源文件可读 → 资产业务 |
| `tests/backend/test_storage.py:442` | 需要显式第二卷，否则 skip；两文件跨卷 reference 注册 2、源字节保留、objects 空 → 资产业务；本轮不授权额外卷，未测 |
| `tests/backend/test_storage.py:52`, `:64`, `:85`, `:103`, `:116`, `:135`, `:161`, `:219`, `:283`, `:301`, `:342`, `:370`, `:400`, `:419`, `:463`, `:482` | 全部各自的成功、失败、Mock、临时真实 FS/SQLite 和限制已分别列于 T05–T10、T13–T19。`:301` 注入 DB switch 前后异常（不是杀进程）；`:370` 杀进程但仅针对 import。 |
| `tests/integration/test_storage_api.py:14` | 唯一综合请求测试：初始不可信 GET 返回 unavailable、PATCH 403；可信后坏 Origin/forwarded 返回 unavailable；snapshot online、注册 201、验证、停用、删除保留目录；无效模式 422、合法 revision 递增、旧 revision 409；来源禁止 403、预检、导入 202/轮询、managed 和源不变。直接将 `runtime.trusted_local=True`，没有测试部署参数自动推导。→ B-06–B-10/B-17/B-18 |
| `tests/integration/test_storage_api.py:92` | 以 extension 宿主替身加载已有非空根，status 200 degraded、storage unavailable、drawing available，目录内容不动 → B-02/B-05 |

## 补充：失败窗口与已观察结果

- 迁移复制前 inventory 拒绝未识别根内容、非空 staging、缺失受管文件；复制时校验源指纹、空间、目标 hash；错误可留下带 migration marker 的目标和 part。`astrophoto/storage/migration.py:48`, `:109`, `:125`。对 checksum 故障测试只断言旧源保留、旧 DB 根不变、目标没有 workspace marker（`tests/backend/test_storage.py:400`）；**没有断言目标为空**。
- publishing 写目标 workspace marker 后，在 DB 同一事务修改根和 operation=committed（`astrophoto/storage/migration.py:143`）；写 marker 到 DB 提交之间故障不会自动撤回 marker；`tests/backend/test_storage.py:301` 用 rebind 故障注入断言 publishing 和旧 DB 路径，再重启恢复，commit 后模拟 `_complete` 失败则断言 committed、新 DB 路径后恢复。该测试本代理未执行，且不等同真实断电。
- 取消 checkpoint 在提交前触发为 cancelled（`astrophoto/storage/operations.py:90`, `:139`）；源码没有迁移目标全量回滚或删除机制；committed 阶段取消不会设置请求。当前无迁移所有阶段取消、恶意替换路径 TOCTOU、满盘后恢复或真实跨卷故障的本轮运行证据。
- 来自主代理的本轮独立观察：8207 的真实 GET status 和旧节点通过；同盘迁移使用 isolated fixture，不能外推跨盘；跨盘因本轮谨慎不授权额外卷路径而跳过。精确命令、返回和测试汇总由主代理报告，不将其扩写成其他 Feature 全部 VERIFIED。

---

## 静态审计附录 · frontend

# 前端只读审计（部分完成，2026-11-18）

## 方法与限制

先以 CodeGraph 查询前端，再对关键源码、需求及测试断言进行只读抽样；没有修改源码，没有执行 build 或测试。以下所有实现状态均为 IMPLEMENTED_UNVERIFIED，除非明确标记 CONFLICT、PARTIAL 或 PLANNED；没有本次运行证据，不宣称 VERIFIED。此报告并非完成全部递归逐行审计：vendor、全部 CSS/翻译键、所有测试断言及完整三套交接尚未逐项核查；矩阵中的 NO_GUARD_FOUND 仅指所述范围所见，不是全库证明。报告只能作为主审计输入。

## Feature 与调用链

| ID | 行为/输入→输出与持久化；入口及源码 | 状态/对应 Guard、Test |
|---|---|---|
| F-01 | 单一扩展入口注册 Sidebar 和科学节点：main.tsx:10–17 → host/sidebar.tsx:9–33；重复 render 复用，同容器外替换 destroy，Locale watcher 随根释放。 | IMPLEMENTED_UNVERIFIED；GF-01；T-lifecycle |
| F-02 | Nodes/Assets/Settings 三主 Tab，Assets 默认，键盘 focus/selection 分离；App.tsx:12–27 → shared/SidebarTabs.tsx。 | IMPLEMENTED_UNVERIFIED；T-navigation:15 |
| F-03 | Nodes 查询 object_info，搜索、类别/排序、展开树、详情；NodesPage.tsx:22–133 → NodeTree.tsx:12–102 → api/nodes.ts；切视图保留状态。 | IMPLEMENTED_UNVERIFIED；GF-02；T-navigation:32,57,96、T-search |
| F-04 | 添加、拖拽节点至当前画布；NodesPage.tsx:93,133 → host/canvas.ts:11–35、dragDrop.ts:3–34，修改 Comfy graph 而非业务数据库。 | IMPLEMENTED_UNVERIFIED；GF-03；T-canvas、T-host-runtime |
| F-05 | 节点收藏读写宿主 Comfy.NodeLibrary.Bookmarks.V2；NodesPage.tsx:16–22,72–73；设置失败回读并显示错误。 | IMPLEMENTED_UNVERIFIED；GF-04；测试映射未完成 |
| F-06 | Assets 搜索、排序/筛选；导入目录预览然后开始异步操作、引用/复制选择及 workspace，重新定位路径；AssetsPage.tsx:17–72 → ImportDialog.tsx:6–71 → api/storage.ts。 | PARTIAL；GF-05；T-navigation:140、T-storage-host；筛选是否实际作用于服务数据须进一步验证 |
| F-07 | Settings 模块导航、系统状态、未实现模块占位；SettingsPage.tsx:12–49；agent 等并非已有业务能力。 | PARTIAL；T-navigation |
| F-08 | Storage 默认导入模式、workspace 添加/重命名/迁移/重定位/启停/移除/设默认，Cache 路径/容量配置与清理；StoragePage.tsx:20–215 → api/storage.ts → /astrophoto/v1/storage。服务持久化，前端提供 expected_revision 和 operation idempotency key。 | IMPLEMENTED_UNVERIFIED；GF-06；T-storage |
| F-09 | Equipment 设备搜索、过滤、分页、按类型新增/编辑、详情、归档/删除；EquipmentPage.tsx、EquipmentList.tsx:10–54、EquipmentForm.tsx、EquipmentDetails.tsx → api/equipment.ts。 | IMPLEMENTED_UNVERIFIED；GF-07、GF-08；T-equipment:40,72,195 |
| F-10 | Optical trains 草稿创建/编辑、器材快速添加、选择相机/光学件/附件/滤镜、附件排序、估算、删除；OpticalTrainEditor.tsx:14–129 → api/equipment.ts；发布/版本历史并非现有 UI（equipment-host.mjs:156,209 断言缺席）。 | PARTIAL；GF-07、GF-08；T-equipment:126,180,195 |
| F-11 | Software 页面 Siril 自动发现、候选选择、手动路径验证、启停和删除；PixInsight 控件禁用；SoftwarePage.tsx:7–114 → api/siril.ts:14–28。 | IMPLEMENTED_UNVERIFIED；GF-09；T-siril:8 |
| F-12 | Environment 预览分辨率选择、revision 保存、冲突提示；EnvironmentPage.tsx:10–59 → api/previewSettings.ts，成功触发变更事件。 | IMPLEMENTED_UNVERIFIED；GF-06；未找到专门测试，需全量核实 |
| F-13 | SourcePicker 选服务器侧 FITS 资产或输入路径，显示加载/错误、刷新；host/scientific.tsx:217–247。 | IMPLEMENTED_UNVERIFIED；GF-10；T-siril-host |
| F-14 | 科学节点候选：每 200ms 读取输入来源、参数与正式执行记录，400ms 去抖调用 renderCandidate，显示主图和状态；scientific.tsx:68–116,145–179 → api/siril.ts:64–105 → preview jobs。| PARTIAL；GF-10、GF-11；T-siril-host；隐藏时仍请求，是否违背最终要求需确认 |
| F-15 | Inspector side/wipe/single、双图对齐门控、缩放、100%、fit、拖动画布/分割线、键盘滑块、布局分隔、焦点恢复；nodePreview/Inspector.tsx:18–161。 | IMPLEMENTED_UNVERIFIED；GF-12；T-siril:28、T-siril-host |
| F-16 | 实际科学节点 Inspector 注入数值输入、linked 开关、reset 并写 graph；scientific.tsx:150–193。符合用户最新确认的可编辑要求。 | IMPLEMENTED_UNVERIFIED；GF-13；T-siril:28 仅测通用展示，未覆盖实际编辑调用 |
| F-17 | Vue 绘图：画笔/颜色/大小/橡皮/清空，鼠标触摸，PNG workflow 值恢复，上传至宿主；frontend/src/main.ts、components/{DrawingApp,DrawingBoard,ToolBar,VueExampleComponent}.vue。 | IMPLEMENTED_UNVERIFIED；GF-14；T-vue |
| F-18 | 双语与主题：host/locale.ts:4–16 watcher 和卸载，i18n/index.ts 与 ui/src/i18n/locales/{en,zh}/main.json；styles/theme.css 使用宿主主题；Vue locales 在根 locales/。 | IMPLEMENTED_UNVERIFIED；GF-15；T-i18n、T-host-runtime |
| F-19 | 复用原生 Vue 下拉与多选的 React 桥及搜索控件；shared/{ComfySingleSelect,ComfyMultiSelect,SearchField,SearchOptions}.tsx → frontend/src/vendor/comfyui/。 | IMPLEMENTED_UNVERIFIED；GF-16；T-search；vendor 完整审计缺口 |

## Guard 矩阵（源码静态证据）

| ID | 输入/验证、异常、清理与显示 | 测试或缺口 |
|---|---|---|
| GF-01 | Sidebar id 去重、替换/销毁卸载 root、移除 DOM 和 watcher；host/sidebar.tsx:9–33、locale.ts:11–16。 | T-lifecycle；真宿主 T-host-runtime，均未运行 |
| GF-02 | useResource.ts:3–15 AbortController 取消旧请求，忽略 aborted 响应并分 loading/error/ready；api/client.ts:12–39 超时、caller abort、HTTP/JSON/network 分流及 timer/listener cleanup；NodesPage 错误可重试。 | T-api、T-navigation:57；权限后端验证未审 |
| GF-03 | canvas.ts:11–35 检查只读/selectOnly/注册，失败回滚并结束 graph change；dragDrop.ts:8–34 检查类型/白名单、只在 canvas 接收并卸载监听。 | T-canvas:15,21,27,31；T-host-runtime:85–102 |
| GF-04 | 收藏保存 promise 失败回读设置及反馈；NodesPage.tsx:16–22,72–73。 | 写冲突保护 NO_GUARD_FOUND（仅本次所读范围）；并发写测试未定位 |
| GF-05 | ImportDialog.tsx:30–68 输入变化清空预览，pending 禁用 fieldset，离线 workspace 禁用；AssetsPage.tsx:38 按 import capability 禁用；服务端最终验证未审。 | 请求完成前关闭、取消或重复提交专项覆盖未定位 |
| GF-06 | StoragePage.tsx:30–56,99–130,151–152,180–201 expected_revision，能力/状态禁用，删除与 cache clear 确认；EnvironmentPage.tsx:28–53 conflict 禁用。 | T-storage:24,55,96；服务端权限及并发验证须由后端审计 |
| GF-07 | EquipmentPage.tsx:39–67 dirty/busy 拦截导航、beforeunload 注册清理和 session 恢复；shared.tsx:17–42 mutation 防重复/abort/error。 | T-equipment:72；真 host remount T-equipment-host:214–230 |
| GF-08 | OpticalTrainEditor.tsx:25–26,38–54,90–110 检查无效/归档器材，排序边界、去除重复可选项、附件/滤镜上限 50；字段校验与错误由 shared.tsx:66–87 显示。 | T-equipment:40,126；后端验证与并发另审 |
| GF-09 | SoftwarePage.tsx:14–24,64–76 卸载 abort、错误保留，pending 禁用；选择仅 ready 候选，手动路径发后端校验。 | T-siril:8；T-siril-host:51 |
| GF-10 | scientific.tsx:91–116 请求 key 匹配才显示，400ms debounce、取消旧请求、过时对象 URL 释放；api/siril.ts:48–105 取消 job、验证 PNG 内容类型，异常释放；121–132 周期 validate 防失效；卸载清理 timer/listeners/abort。 | 无专门竞态、失配、旧图及实际生命周期断言已确认；不等于已通过 |
| GF-11 | scientific.tsx:93–116 effect 输入未含 active；active 到 117 行才定义，仅用于后续验证；在 collapsed + Inspector closed 时仍可 renderCandidate。 | NO_GUARD_FOUND；原始 PRD 可见条件与“不必”措辞需区别，不能单凭此断言违约；无对应测试已确认 |
| GF-12 | Inspector.tsx:36–47 焦点恢复，双图 aligned 才允许 wipe；:49–68 主指针、界限与 zoom clamp；:82–120 dialog cancel、键盘 slider。 | T-siril:28；窄栏/失焦/实际浏览器多设备验证未定位 |
| GF-13 | scientific.tsx:150–172 在 graph 不存在、read_only/selectOnly 时拒绝写，并通过 graph before/after 包装；:180–193 参数可编辑或重置；单色禁用 linked。 | 通用 details 展示用例没有覆盖实际调参、重置、预览同步或拒绝写入 |
| GF-14 | DrawingBoard.vue:55–56,234–238 revision 防异步恢复覆盖新绘制/卸载；VueExampleComponent.vue:31–38,73–103 非法恢复/上传异常反馈。 | T-vue serialization:31,67；宿主已知 IMAGE 执行路径问题须独立验证 |
| GF-15 | host/locale.ts:11–16 focus/interval 同步并清理；i18n.test.tsx:10 key 集合等价。 | 缺失动态 key 的实际渲染 fallback/窄栏完整验证未定位 |
| GF-16 | SearchField IME 组合及 debounce cleanup 有测试；单/多选桥依赖宿主 Vue 组件。 | T-search；无 host 环境降级保护 NO_GUARD_FOUND（main.tsx 静态依赖 comfy:app）；须明确只支持宿主 |

## 测试矩阵及边界

所有测试仅静态阅读，未执行。React Jest/JSDOM 为 mocked 宿主、API 及 DOM，不证明真实 ComfyUI、真实 Siril、浏览器绘图或网络。`frontend/tests` Vitest 测试需根据项目配置确认浏览器环境；host-runtime、storage-host、equipment-host、siril-host 使用 Playwright Chromium 对真实 host，但脚本存在不代表运行通过。

| 标识 | 测试函数与行 / 断言 → Feature、Guard |
|---|---|
| T-lifecycle | lifecycle.test.tsx:5–16：一个 tab、复用、更换容器、清除 timers → F-01/GF-01 |
| T-canvas | canvas.test.ts:15,21,27,31：当前 graph/事务、只读拒绝、失败清理、白名单 → F-04/GF-03 |
| T-api | api.test.ts:10,16,26：JSON/network、timeout/abort、响应契约 → F-03/GF-02 |
| T-search | search.test.tsx:3：IME/debounce 清理 → F-03,F-19/GF-16 |
| T-navigation | navigation.test.tsx:15,32,57,65,96,140：默认/键盘、catalog 状态保留、错误重试、刷新、树、不可用时筛选 → F-02,F-03,F-06,F-07/GF-02 |
| T-storage | storage.test.tsx:24–52 成功后变模式和 revision；:55–93 迁移回执/禁用；:96–114 清理确认和回执 → F-08/GF-06 |
| T-equipment | equipment.test.tsx:40–69 懒加载和字段错误；:72–86 导航确认和恢复；:126–177 删除陈旧版本及刷新；:180–192 键盘与草稿；:195–224 独立搜索过滤 → F-09,F-10/GF-07,GF-08。:89–123 的设备被引用及删除断言亦需回看其测试函数边界。 |
| T-siril | siril.test.tsx:8–25 验证版本不匹配保留配置；:28–48 三模式/未对齐/键盘/只读值；后者未使用实际 NodeView 的 parameters → F-11,F-15/GF-09,GF-12；不覆盖 F-16 |
| T-i18n | i18n.test.tsx:10,12 翻译键等价、跟随宿主语言 → F-18/GF-15 |
| T-vue | tests/components/DrawingApp.test.ts:6,26,38 绘制、工具、触摸；tests/widgets/serialization.test.ts:8,31,43,48,67 恢复、异常、翻译和上传；registration.test.ts:4 注册 → F-17/GF-14 |
| T-host-runtime | frontend/ui/host-runtime.mjs:27–34,62,85–102,126–175 检查挂载、主题、插入、持久化及单入口 → F-01,F-04,F-17,F-18；未运行 |
| T-storage-host | storage-host.mjs:31–119 检查真实 host 中设置、导入、语言、挂载、序列化 → F-06,F-08,F-17；未运行 |
| T-equipment-host | equipment-host.mjs:79–251 host 器材流程、草稿恢复、语言；明确不显示发布及历史 → F-09,F-10/GF-07；未运行 |
| T-siril-host | siril-host.mjs:51,96–141,164–187 执行配置、图像模式、变换、正式结果 manifest/hash 与重开输入；其实际是否覆盖参数编辑需看交互，不能凭脚本存在推断通过 → F-11,F-13,F-14,F-15；未运行 |
| T-accordion | detailAccordion.test.tsx:4 折叠受控状态 → F-09；未运行 |

## 交接差异及风险

1. Chat_Handoff 07_UI_DESKTOP_SPEC.md:101–103、04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:39,55 曾要求 Inspector 参数只读，已被用户当前的可编辑决定替代。scientific.tsx:180–193 注入编辑控件及 reset，并写回图。siril.test.tsx:28–42 仅构造 details 展示，尚未覆盖编辑。
2. 原始 PRD v1.1:265–271 要求可见时更新，并称均关闭时“不必”处理（非明确禁止）。scientific.tsx:93–116 不以展开/Inspector 可见性为依赖或条件，而 active 在 117 行后定义：隐藏状态仍触发请求；参数及输入变化会使候选更新。有关可见性完整期望仍需与最新交接并读。
3. Chat_Handoff 02_LATEST_DECISIONS_AND_CONFLICTS.md:14–15 明言调查时无 Siril/FITS/Inspector 是旧快照，scientific.tsx、siril.ts 与 Inspector.tsx 已存在，不能把旧交接当当前状态；是否符合路径及后端规范需后端审计。
4. Last_Handoff/sources/01_CURRENT_STATE.md:7 等 VERIFIED 属历史证据，不是此轮运行结果。host 脚本包含真实运行意图，不代表当前主机已通过；完整翻译缺键、窄栏、失败竞态、权限、后端写冲突、过期图片及科学预览性能仍需主 Agent 核查。

## 实际阅读与清查边界

实际看过 CodeGraph 输出（scientific、siril、storage、Inspector 的部分行），及 rg 输出中 frontend/ui/src、frontend/src 和测试的符号/部分断言；完整读取或行级筛选了 scientific.tsx 68–196、useResource.ts、sidebar.tsx、main.tsx、siril Inspector 重导出、StoragePage.tsx/SoftwarePage.tsx/EnvironmentPage.tsx/ImportDialog.tsx/Inspector.tsx 的特征行，以及列出的测试断言。交接读取：Chat_Handoff 的 02、04、07 相关匹配行；Last_Handoff 的 01 相关行；Original_request 的 Siril PRD 相关匹配行。未逐行阅读全部文件，不应冒称全部已审核。

下方是递归清查的文件清单（清单本身不等于阅读）。

`	ext
frontend/src\components\DrawingApp.vue
frontend/src\components\DrawingBoard.vue
frontend/src\components\ToolBar.vue
frontend/src\components\VueExampleComponent.vue
frontend/src\host.d.ts
frontend/src\main.ts
frontend/src\types.ts
frontend/src\vendor\comfyui\composables\useAttrsClass.ts
frontend/src\vendor\comfyui\composables\usePopoverSizing.ts
frontend/src\vendor\comfyui\multi-select\MultiSelect.vue
frontend/src\vendor\comfyui\multi-select\MultiSelectContent.vue
frontend/src\vendor\comfyui\multi-select\MultiSelectTrigger.vue
frontend/src\vendor\comfyui\multi-select\types.ts
frontend/src\vendor\comfyui\README.md
frontend/src\vendor\comfyui\select.variants.ts
frontend/src\vendor\comfyui\select\types.ts
frontend/src\vendor\comfyui\select\useSelectSearch.ts
frontend/src\vendor\comfyui\single-select\SearchableSingleSelect.vue
frontend/src\vendor\comfyui\single-select\SingleSelect.vue
frontend/src\vendor\comfyui\single-select\types.ts
frontend/src\vendor\comfyui\tailwind-utils.ts
frontend/tests\components\DrawingApp.test.ts
frontend/tests\host.ts
frontend/tests\setup.ts
frontend/tests\widgets\registration.test.ts
frontend/tests\widgets\serialization.test.ts
frontend/ui/src\__tests__\api.test.ts
frontend/ui/src\__tests__\canvas.test.ts
frontend/ui/src\__tests__\detailAccordion.test.tsx
frontend/ui/src\__tests__\equipment.test.tsx
frontend/ui/src\__tests__\fixtures.ts
frontend/ui/src\__tests__\hostMock.ts
frontend/ui/src\__tests__\i18n.test.tsx
frontend/ui/src\__tests__\lifecycle.test.tsx
frontend/ui/src\__tests__\multiSelectMock.ts
frontend/ui/src\__tests__\navigation.test.tsx
frontend/ui/src\__tests__\search.test.tsx
frontend/ui/src\__tests__\setupTests.ts
frontend/ui/src\__tests__\singleSelectMock.ts
frontend/ui/src\__tests__\siril.test.tsx
frontend/ui/src\__tests__\storage.test.tsx
frontend/ui/src\api\client.ts
frontend/ui/src\api\equipment.ts
frontend/ui/src\api\nodes.ts
frontend/ui/src\api\previewSettings.ts
frontend/ui/src\api\siril.ts
frontend/ui/src\api\status.ts
frontend/ui/src\api\storage.ts
frontend/ui/src\app\App.tsx
frontend/ui/src\features\assets\AssetsPage.tsx
frontend/ui/src\features\assets\ImportDialog.tsx
frontend/ui/src\features\nodePreview\inspector.css
frontend/ui/src\features\nodePreview\Inspector.tsx
frontend/ui/src\features\nodePreview\nodePreview.css
frontend/ui/src\features\nodePreview\NodePreview.tsx
frontend/ui/src\features\nodePreview\PanelDivider.tsx
frontend/ui/src\features\nodes\NodeHoverPreview.tsx
frontend/ui/src\features\nodes\NodesPage.tsx
frontend/ui/src\features\nodes\NodeTree.tsx
frontend/ui/src\features\settings\environment.css
frontend/ui/src\features\settings\EnvironmentPage.tsx
frontend/ui/src\features\settings\equipment\DetailAccordion.tsx
frontend/ui/src\features\settings\equipment\DetailActions.tsx
frontend/ui/src\features\settings\equipment\equipment.css
frontend/ui/src\features\settings\equipment\EquipmentDetails.tsx
frontend/ui/src\features\settings\equipment\EquipmentForm.tsx
frontend/ui/src\features\settings\equipment\EquipmentList.tsx
frontend/ui/src\features\settings\equipment\EquipmentPage.tsx
frontend/ui/src\features\settings\equipment\OpticalTrainDetails.tsx
frontend/ui/src\features\settings\equipment\OpticalTrainEditor.tsx
frontend/ui/src\features\settings\equipment\shared.tsx
frontend/ui/src\features\settings\moduleRegistry.ts
frontend/ui/src\features\settings\SettingsPage.tsx
frontend/ui/src\features\settings\SoftwarePage.tsx
frontend/ui/src\features\settings\storage.css
frontend/ui/src\features\settings\StoragePage.tsx
frontend/ui/src\features\siril\Inspector.tsx
frontend/ui/src\features\siril\siril.css
frontend/ui/src\features\storage\shared.tsx
frontend/ui/src\host\canvas.ts
frontend/ui/src\host\comfy.ts
frontend/ui/src\host\dragDrop.ts
frontend/ui/src\host\locale.ts
frontend/ui/src\host\scientific.tsx
frontend/ui/src\host\sidebar.tsx
frontend/ui/src\i18n\index.ts
frontend/ui/src\i18n\locales\en\main.json
frontend/ui/src\i18n\locales\zh\main.json
frontend/ui/src\main.tsx
frontend/ui/src\shared\ComfyMultiSelect.tsx
frontend/ui/src\shared\ComfySingleSelect.tsx
frontend/ui/src\shared\DisclosureChevron.tsx
frontend/ui/src\shared\Feedback.tsx
frontend/ui/src\shared\SearchField.tsx
frontend/ui/src\shared\SearchOptions.tsx
frontend/ui/src\shared\SidebarTabs.tsx
frontend/ui/src\shared\useResource.ts
frontend/ui/src\shared\useStoredChoice.ts
frontend/ui/src\shared\vue.d.ts
frontend/ui/src\styles\theme.css
frontend/ui\check-build.mjs
frontend/ui\check-proxy.mjs
frontend/ui\equipment-host.mjs
frontend/ui\host-runtime.mjs
frontend/ui\siril-host.mjs
frontend/ui\src\__tests__\api.test.ts
frontend/ui\src\__tests__\canvas.test.ts
frontend/ui\src\__tests__\detailAccordion.test.tsx
frontend/ui\src\__tests__\equipment.test.tsx
frontend/ui\src\__tests__\fixtures.ts
frontend/ui\src\__tests__\hostMock.ts
frontend/ui\src\__tests__\i18n.test.tsx
frontend/ui\src\__tests__\lifecycle.test.tsx
frontend/ui\src\__tests__\multiSelectMock.ts
frontend/ui\src\__tests__\navigation.test.tsx
frontend/ui\src\__tests__\search.test.tsx
frontend/ui\src\__tests__\setupTests.ts
frontend/ui\src\__tests__\singleSelectMock.ts
frontend/ui\src\__tests__\siril.test.tsx
frontend/ui\src\__tests__\storage.test.tsx
frontend/ui\src\api\client.ts
frontend/ui\src\api\equipment.ts
frontend/ui\src\api\nodes.ts
frontend/ui\src\api\previewSettings.ts
frontend/ui\src\api\siril.ts
frontend/ui\src\api\status.ts
frontend/ui\src\api\storage.ts
frontend/ui\src\app\App.tsx
frontend/ui\src\features\assets\AssetsPage.tsx
frontend/ui\src\features\assets\ImportDialog.tsx
frontend/ui\src\features\nodePreview\inspector.css
frontend/ui\src\features\nodePreview\Inspector.tsx
frontend/ui\src\features\nodePreview\nodePreview.css
frontend/ui\src\features\nodePreview\NodePreview.tsx
frontend/ui\src\features\nodePreview\PanelDivider.tsx
frontend/ui\src\features\nodes\NodeHoverPreview.tsx
frontend/ui\src\features\nodes\NodesPage.tsx
frontend/ui\src\features\nodes\NodeTree.tsx
frontend/ui\src\features\settings\environment.css
frontend/ui\src\features\settings\EnvironmentPage.tsx
frontend/ui\src\features\settings\equipment\DetailAccordion.tsx
frontend/ui\src\features\settings\equipment\DetailActions.tsx
frontend/ui\src\features\settings\equipment\equipment.css
frontend/ui\src\features\settings\equipment\EquipmentDetails.tsx
frontend/ui\src\features\settings\equipment\EquipmentForm.tsx
frontend/ui\src\features\settings\equipment\EquipmentList.tsx
frontend/ui\src\features\settings\equipment\EquipmentPage.tsx
frontend/ui\src\features\settings\equipment\OpticalTrainDetails.tsx
frontend/ui\src\features\settings\equipment\OpticalTrainEditor.tsx
frontend/ui\src\features\settings\equipment\shared.tsx
frontend/ui\src\features\settings\moduleRegistry.ts
frontend/ui\src\features\settings\SettingsPage.tsx
frontend/ui\src\features\settings\SoftwarePage.tsx
frontend/ui\src\features\settings\storage.css
frontend/ui\src\features\settings\StoragePage.tsx
frontend/ui\src\features\siril\Inspector.tsx
frontend/ui\src\features\siril\siril.css
frontend/ui\src\features\storage\shared.tsx
frontend/ui\src\host\canvas.ts
frontend/ui\src\host\comfy.ts
frontend/ui\src\host\dragDrop.ts
frontend/ui\src\host\locale.ts
frontend/ui\src\host\scientific.tsx
frontend/ui\src\host\sidebar.tsx
frontend/ui\src\i18n\index.ts
frontend/ui\src\i18n\locales\en\main.json
frontend/ui\src\i18n\locales\zh\main.json
frontend/ui\src\main.tsx
frontend/ui\src\shared\ComfyMultiSelect.tsx
frontend/ui\src\shared\ComfySingleSelect.tsx
frontend/ui\src\shared\DisclosureChevron.tsx
frontend/ui\src\shared\Feedback.tsx
frontend/ui\src\shared\SearchField.tsx
frontend/ui\src\shared\SearchOptions.tsx
frontend/ui\src\shared\SidebarTabs.tsx
frontend/ui\src\shared\useResource.ts
frontend/ui\src\shared\useStoredChoice.ts
frontend/ui\src\shared\vue.d.ts
frontend/ui\src\styles\theme.css
frontend/ui\storage-host.mjs
frontend/ui\tsconfig.json
locales\en\main.json
locales\zh\main.json
locales\zh\nodeDefs.json
```


## 补充审计：控件桥、翻译、测试和需求边界

### 控件桥与 legacy Inspector

- `ComfySingleSelect.tsx:1–42` 是 React `useLayoutEffect` → Vue `render(h(SingleSelect))`；空值编码为 `unspecified`，其他值添加 `value:`，不存在选项时退回空值，`update:modelValue` 转回字符串；卸载 `render(null,node)`。消费者：`EnvironmentPage.tsx:47–48`、`EquipmentForm.tsx:76`、`OpticalTrainEditor.tsx:80–98`。vendor `single-select/SingleSelect.vue:25–95,132–160` 通过 Reka Select，disabled 选项及 Escape；搜索分支仅 `searchable && searchLabel && emptyText` 时进入，而此 React wrapper 没传这些属性，因此当前走非搜索分支。`SearchableSingleSelect.vue:170–197` 支持检索和 Escape，但不能由此推断当前桥启用搜索。
- `ComfyMultiSelect.tsx:7–31` 将 id 映射成对象，未知 id 保留为 `{value:id,name:id}`，从 Vue model 事件映射回 id，卸载清理。消费者仅 `OpticalTrainEditor.tsx:103–110`。vendor `MultiSelect.vue:2–42,64–95` → Trigger/Content，默认不显示搜索框，Content:162–180 支持已选项、Escape 与阻止焦点外关闭；筛选来自 `useSelectSearch.ts:7–20`。Jest 的 `frontend/jest.config.cjs:2,9–10` 映射为 mock，下拉组件在 Jest 中非真实 Reka；equipment-host.mjs:66–70,162–183 才有真实 Chromium 下的选择和已选状态脚本断言，但本次未运行。
- `features/siril/Inspector.tsx:1` 只是 `features/nodePreview/Inspector` 重导出，不是第二套旧 UI；实际生产入口 `host/scientific.tsx:9,180` 直接导入通用 Inspector，重导出仅 `siril.test.tsx:4` 引用。组件入口唯一不代表参数只读，实际注入详见 F-16。

### 两套语言资源及消费边界

- React 的 `ui/src/i18n/index.ts:3–12` 独立加载 `ui/src/i18n/locales/{en,zh}/main.json`；本次静态 JSON 扁平键集合对比各 497 键且完全相同。`host/locale.ts:4–16` 读取 Comfy.Locale、500ms 可见轮询及 focus，并停止计时器/监听。`i18n.test.tsx:10–23` 测对等、五类 locale 归一化、宿主语言切换，未测试每个动态组合键或文字语义。
- Vue Widget 的 `frontend/src/main.ts:9–10,28–30` 单独加载仓库 `locales/{en,zh}/main.json`；静态各 6 叶键且集合一致；静态扫描 `frontend/src/components` 中字面 `t('...')` 未发现缺失。`tests/widgets/serialization.test.ts:43` 断言画板英文键包含于中文及 pen tooltip。两套资源只需各自匹配消费者，不要求 React 的 497 键复制到 Vue 六键；`locales/zh/nodeDefs.json` 是宿主节点定义翻译，非 React i18next 资源，且无对应英文文件不等于缺失 React 翻译。
- 字面键静态扫描未发现真正缺失；字符串拼接（如 `scientific.tsx:145`, `storage/shared.tsx:13`, `equipment/shared.tsx:49–51`）需依据运行时后端枚举进一步核实；部分具有 `defaultValue`，状态字符串直接显示并非翻译齐全的证据。Vue i18n 在 widget 创建时采样一次 host locale（main.ts:28–30），没有像 React 一样看到运行期 watcher，语言变化已挂载 widget 是否实时跟随需要实测，NO_GUARD_FOUND（当前读取范围）。

### 补足测试函数级映射与运行边界

React tests 均完整读取；`test.each` 不能被 `^test(` 名称提取遗漏：

- `api.test.ts:6–9` 四种 401/403/404/500 保留 status；:10–15 区分 JSON/network；:16–25 超时/调用方取消且计时清空；:26–34 status 校验、catalog 过滤/输出/空与畸形拒绝 → F-03/GF-02。
- `canvas.test.ts:15–35` 坐标+change 边界、只读与未注册拒绝、插入失败 cleanup、drag 版本/kind/白名单 → F-04/GF-03。
- `detailAccordion.test.tsx:4–13` aria-expanded/controls 与 hidden 切换 → F-09。
- `equipment.test.tsx:40–69` 校验 422 保留输入与 aria-invalid，再成功展示回执；:72–86 阻止跨 tab 丢弃、重挂恢复且切语言保值；**:89–124 `test.each([false,true])`** 检查被引用时阻止删除并显示光路，未引用时取消不删、确认只删一次；:126–177 两次删除携带版本 3→4、409 request id、重试再删除；:180–192 键盘 focus 与选中分离、空设备草稿可保存且无发布；:195–224 两类搜索条件、Escape 聚焦、清空 → F-09/F-10/GF-07/GF-08。
- `i18n.test.tsx:10–23` 两语言键相同、`test.each` 五种 locale、宿主偏好优先且不写宿主 setting → F-18/GF-15。
- `lifecycle.test.tsx:5–18` 注册去重、同容器复用、替换销毁/计时器归零 → F-01/GF-01。
- `navigation.test.tsx:15–31` 默认、键盘、无假数据；:32–45 搜索/详情/切页保持；**:46–56 `test.each(modules)`** 每模块有标题/无假 Save/返回；:57–64 错误重试；:65–89 活动 tab 刷新请求；:96–138 嵌套树/分类/排序/搜索与键盘；:140–159 服务不可用筛选仍可选、排序偏好持久且禁用导入 → F-02/F-03/F-06/F-07。
- `search.test.tsx:3–18` 组合输入、180ms debounce、清除焦点及卸载清计时 → F-03/F-19/GF-16。
- `siril.test.tsx:8–26,28–49` 失败不覆盖已保存软件配置；仅以 details 参数的通用 Inspector 测三模式/未对齐禁 wipe/键盘/无 spinbutton，非真实 NodeView → F-11/F-15/GF-09/GF-12。
- `storage.test.tsx:24–53,55–94,96–115` revision 冲突回滚 UI、迁移确认/回执、cache 清理确认 → F-08/GF-06。
- `frontend/vitest.config.mts:26–30` Vue 测试配置 Chromium（Playwright），与 React Jest/JSDOM 区分；host scripts 才接真实 ComfyUI。主 Agent 运行情况另行汇总，此处未运行，不能因测试源而称通过。

### 样式与宿主脚本的具体覆盖

- `inspector.css:1–5,11–20,24–34,75–78` 限制 dialog viewport、图像网格及缩放，600px 以下切为上下排列且隐藏横向分隔；`siril.css:3,14–20,52` 路径换行、flex 收缩；`storage.css:87` forced colors；这些是静态设计，非已通过布局证明。
- `equipment-host.mjs:125–188` 创建四类设备、滤镜、链路及快速新增，在真实 Vue select 验选中，计算 768mm/9.6；:190–219 编辑/归档/恢复/未保存导航/重开；:221–251 语言主题、280/420/650px 与 200% 下 body 不超 panel、单 JS。它不等价于整个 Inspector 窄屏布局测试。`--verify-restart`/`--verify-delete` 是可选分支，不能默认为运行。
- `siril-host.mjs:73–101` 真实输入及依次修改三个 widget 等待图像 src 更新；:103–131 双图相同 pan、unaligned 模式禁 wipe 或键盘+指针分割、单图；:135–148 light/dark 文字颜色、zh/en；:151–187 正式 execution、manifest 参数与 source/output SHA、工作流重开。脚本不断言 Inspector 的编辑控件缺失，也没有关闭预览后请求数量断言。
- `storage-host.mjs:31–58` 16px radio、键盘触发保存、导入预览/202/回执；:60–96 迁移、主题、语言、重载、入口；:98–119 真实画布绘制及 PNG 上传/像素恢复。`check-build.mjs:3–20` 检查既有产物单 JS/字符串/CSS/相对路径；`check-proxy.mjs:24–46` 是模拟 host 的 Chromium 代理路径静态服务，不是真 ComfyUI。上述皆为脚本断言，不代表执行成功。

### 预览触发要求校正

将两个问题分开：原始 PRD v1.1:265–271 要求输入有效且主预览开启时参数变化自动更新，并说两处关闭时“不必执行”，这是可见性优化措辞，**不应自行升级为严格禁止或必然冲突**；源码确实在 hidden 状态仍可请求，记为可观察差异与资源风险。此前用户历史所说取消非输入触发，不能推演为取消输入变化预览或禁止首个有效输入；原始 PRD 明确位置/布局/缩放不触发，旧 PRD `source_materials/previous_prd/AstroPhotoFlow_Siril_AutoStretch_MVP_PRD_v1.0.md:391–393` 也区分输入/参数与布局。`scientific.tsx:68–116` 依 asset、参数 key、正式结果和显式 refresh 触发，位置、布局、缩放未包含在 requestKey；分辨率事件显式 refresh 属独立触发，是否符合最新用户约束需主 Agent 对照具体历史原话，不可在此无依据下定论。

---

## 静态审计附录 · mcp-packaging

# MCP、打包及协议只读审计

范围与状态：本轮仅静态检查，未运行测试、构建或发布；以下实现均标 IMPLEMENTED_UNVERIFIED，测试均为“本轮未运行”，历史通过数不是本轮验证。路径均相对仓库。CodeGraph 首先按路径查询，部分索引误命中 reference，继而以精确路径查询。未修改业务、测试、依赖或构建产物。

## 文件功能清单
- `mcp/src/astrophoto_mcp/{__main__,server,config,client}.py`：CLI、唯一工厂、配置、诊断客户端；`api/{comfy,equipment}.py`：HTTP 协议及 DTO 校验；`tools/{status,equipment}.py`：实际注册；`__init__.py`：包版本，`api/__init__.py`、`tools/__init__.py`：包入口。
- `mcp/tests/{test_server,test_client,test_config,test_equipment,test_version,conftest}.py` 和 `fixtures/status_contract.json`：协议、配置、模拟 HTTP 和真实子进程；`tests/packaging/{test_contents,test_versions}.py`：包边界及版本。
- `scripts/{release,check_install}.py`：版本同步、包检查、临时隔离安装；`.github/workflows/{ci,release}.yml`：CI 和发布编排；`.comfyignore`：Registry 排除；根及 MCP `pyproject.toml`、`uv.lock`：工作区和依赖锁；`frontend/{vite.config.mts,package.json,pnpm-lock.yaml}`：构建与锁定。未逐条审查两个锁文件的全部依赖或散列。

## Feature 和调用链
- M-01 IMPLEMENTED_UNVERIFIED：CLI `astrophoto-mcp` / `python -m astrophoto_mcp`，`--version` 或 `--comfy-url` → `resolve_comfy_url` → `create_server` → FastMCP stdio，无 banner，stdout 协议。无常驻 HTTP 服务或数据库写入（`mcp/pyproject.toml:18`, `mcp/src/astrophoto_mcp/__main__.py:9-23`）。
- M-02 IMPLEMENTED_UNVERIFIED：`version()` 无参 → `{name, version}`，仅本地安装包版本；`connection_status()` 无参 → `diagnose` → GET `system_stats`、`object_info/vue-basic` → JSON 文本 `{reachable,extension_registered,system}`，不提供远端版本握手（`tools/status.py:11-24`, `client.py:9-14`, `api/comfy.py:6-22`）。
- M-03 IMPLEMENTED_UNVERIFIED：配置 `ASTROPHOTO_EQUIPMENT_READ_TOKEN` 合法且 URL 为根路径 IP loopback 才注册六个只读工具：`equipment_list(equipment_type?,query,include_archived,cursor?,limit)`、`equipment_get(equipment_id)`、`optical_train_list(query,include_archived,cursor?,limit)`、`optical_train_get(train_id)`、`optical_train_revision_list(train_id)`、`optical_train_revision_get(train_id,revision_id)`；分别 GET `astrophoto/v1/equipment[/{id}]`、`optical-trains[/{id}[/revisions[/{revision_id}]]]`；传 bearer，返回验证后的 DTO；没有写操作（`server.py:19-25`, `tools/equipment.py:9-47`, `api/equipment.py:70-116`）。每请求新建并关闭 HTTP 客户端，不直接访问数据库。
- M-04 PARTIAL：仅包内 `skills/**/SKILL.md` 存在时添加 `SkillsDirectoryProvider`，无产品 skill；发现和验证依赖框架，未实现用户 Skills 安装 CLI（`server.py:26-30`）。
- M-05 IMPLEMENTED_UNVERIFIED：独立 MCP Hatch wheel/sdist；根扩展固定同版本 MCP、Python >=3.11；根 uv workspace 开发使用 workspace source，Registry 构建改写运行时 metadata 和 requirements，从 PyPI 安装（`pyproject.toml:1-32`, `mcp/pyproject.toml:1-32`, `scripts/release.py:123-147`）。版本 0.0.1，FastMCP 4.2.0。
- M-06 IMPLEMENTED_UNVERIFIED：Vite Vue+React 单入口 `entry.ts` 输出 `js/main.js`/CSS，`comfy:app/api` 外置相对 `../../scripts/{app,api}.js`，保持代理前缀；构建不清空输出、禁 sourcemap（`frontend/vite.config.mts:7-37`）。
- M-07 IMPLEMENTED_UNVERIFIED：CI Python 3.11/3.12 frozen uv/pnpm、前后端检查、模拟与 aiohttp 集成、包检查、构建和独立安装；tag release 先复用 CI，再 PyPI Trusted Publishing，随后确认公开安装，最后 Registry（`.github/workflows/ci.yml:13-71`, `release.yml:14-71`）。
- M-08 PLANNED：Siril、资产操作、工作流执行与 Canvas bridge、节点检索、知识/记忆/实验的业务 MCP 工具及运行时跨包版本握手未发现实现；设备六个读工具不能推论这些领域已实现。

## Guard → 测试双向关联
- GM-01 URL/配置：CLI > 环境 > 默认 `127.0.0.1:8188`；拒绝空值、空白、反斜线、query、fragment、非 HTTP(S)、userinfo、非法端口；保留代理路径，错误 CLI exit 2/stderr（`config.py:7-27`, `__main__.py:17-20`）。测试 `test_config.py:10-61` 覆盖优先级、非法、空环境、IPv6、CLI；未运行。
- GM-02 权限和泄露：仅 43–256 ASCII 字母数字/`-_` token 且 IP loopback 根路径时发现工具；localhost 名称、远端、代理路径或短 token 静默只暴露诊断；设备请求 `trust_env=False`, `follow_redirects=False`，禁止经环境代理和重定向携 token（`api/equipment.py:14-23,76-80`, `server.py:23-25`）。`test_equipment.py:21-74` MockTransport 验证 bearer/GET、无本地头、降级、302、403/404/500/503、超时/坏 JSON/坏形状及 token 不出错误文本；未运行。此客户端限制不等于服务端授权已验证。
- GM-03 输入：canonical UUID 精确小写及 36 字符；query 最多 120、limit 1–100、cursor UUID，枚举由 FastMCP 类型 schema 约束，错误 ToolError `INVALID_REQUEST`（`api/equipment.py:26-41`, `tools/equipment.py:9-16`）。对应 MCP 测试未见单独覆盖所有边界；NO_GUARD_FOUND：设备响应 body 大小上限、重试。
- GM-04 设备 HTTP：10 秒超时；HTTP 错误仅返回清洗后 ASCII 错误码最多 80 字符和状态码，timeout/network/坏 JSON/DTO 分类 ToolError；校验集合 `items`、分页 `next`、主要 ID/类型/版本和 revision snapshot 的浅层形状（`api/equipment.py:44-67,76-116`）。测试 `test_equipment.py:56-74` 为 Mock HTTP，断言 error 和 token 不泄露，并未逐一断言具体错误码或完整 DTO；未运行。NO_GUARD_FOUND：递归验证所有嵌套数据、响应大小限制、重试。
- GM-05 诊断：两个 GET 顺序、各自 HTTP 状态、JSON object 和 system object 验证，异常传播成 MCP error；HTTP 客户端 async context 清理（`api/comfy.py:6-22`, `client.py:9-14`）。`test_client.py:9-62` Mock 成功、缺节点、两端错误、网络/超时、坏 JSON/形状；`test_server.py:44-78` 内存 MCP 错误；未运行。诊断客户端未显式关闭环境代理，与设备客户端信任边界不同；NO_GUARD_FOUND：诊断重试和显式响应大小上限。
- GM-06 发现/协议：重复 tool 注册错误；无技能不注册 provider；无效 skill 启动失败（`server.py:19-30`）；`test_server.py:20-41,82-89` 内存 schema、空 resources、重复和坏 skill。`test_server.py:93-146` 真 stdio 子进程初始化、列表、调用、stdout JSON、关闭；`test_version.py:10-21` 真 CLI 和内存工具；`test_equipment.py:79-89` 真子进程带 token 仅列表与 version，未发真实设备请求。均未运行。
- GM-07 供应链/内容：版本稳定 SemVer、根/MCP/依赖/tag/许可证一致，否则失败；Registry 输入禁止符号链接并通过 .comfyignore、必需文件/根/私有数据扩展名/metadata 检查；wheel 顶层白名单与必需模块、sdist 前缀/普通文件/路径内容白名单（`scripts/release.py:38-50,70-120,151-180`）。`test_versions.py:8-25` 临时副本版本/错误；`test_contents.py:20-49` 构建并注入泄露文件拒绝；这些测试会 build，本轮按限制未运行。过滤主要基于路径和后缀，NO_GUARD_FOUND：任意允许文本内秘密内容扫描、依赖漏洞扫描、产物签名验证。
- GM-08 安装/分发：临时目录 uv venv、明确 PyPI index、无 config/cache、隔离 Python、30 秒握手和 45 秒子进程时限，清理由 TemporaryDirectory 和 async context 完成（`scripts/check_install.py:12-52`）。release 对公开 PyPI 安装最多五次、每次失败等待 15 秒后失败终止 Registry（`release.yml:50-60`）。真实网络安装和 CI 此轮未执行；`skip-existing: true` 意味重跑可跳过已有 PyPI 文件，需依赖随后公开安装确认版本，未发现远程与本次构建字节等同性校验。
- GM-09 前端代理：`test_contents.py:52-57` 从现有产物提取两个相对导入并用 urljoin 检查代理前缀；非真实代理 HTTP，未运行。`ci.yml:41-42` 另调用 build/proxy 检查，脚本实现本轮未细审。

## 交接差异和风险
- `Last_Handoff/sources/05_MCP_AND_SKILLS.md:3,154-168` 和 `Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/03_CURRENT_REPOSITORY_SNAPSHOT.md:39,57` 记两个诊断工具、无业务工具；现行源码条件注册六个设备只读工具，历史描述在启用设备 token 时 OBSOLETE。交接历史测试数量不能升级为本轮 VERIFIED。
- `Chat_Handoff/.../04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:61,71` 要求 Siril 1.4.5 并说明本期不添加 Agent 业务工具；现有设备读工具与该阶段声明有范围冲突，不能据此认定 Siril 工具存在。`Original_request` 含 Siril 与设备需求，本轮未逐项对照原件全部细节，故其细分需求状态 UNKNOWN；交由对应领域审计。
- 设备发现失败静默降级会让客户端仅看到两个诊断工具；代理 URL 不提供设备工具是有意的 token 边界。当前 `check_install.py:25` 期望精确两工具，若继承有效 token 且 URL 指向 loopback 可能失败。
- 路径白名单并非内容级审计；wheel 的 `astrophoto_mcp/` 内文件不细分白名单。没有本轮真实宿主、真实 PyPI、Registry 或端到端 token 请求证据。

## 阅读和未调查
实际读取 CodeGraph 展示的 MCP 核心源码、测试断言索引、完整设备测试、打包测试、版本/构建配置、CI 和发布脚本，以及两份交接中 MCP/范围关键段；`mcp/tests/conftest.py`、测试完整参数矩阵、原始需求全文、锁文件逐项、frontend `check-proxy` 实现、服务端设备鉴权/DTO 全链未完整细读；不得据本记录声称全部覆盖。没有在本轮执行任何测试或构建。
## 补充：每个实际 Tool 的精确契约
以下均为 IMPLEMENTED_UNVERIFIED；有条件注册的工具只有在工厂初始化时满足 GM-02 才可发现，后续环境变量变化不会动态重配。引用均相对 `mcp/src/astrophoto_mcp/`。

| Tool | 输入及默认 | 请求 / 输出 | 本套精确测试 |
|---|---|---|---|
| `version` | 无输入 | 无 I/O；`name=astrophoto-mcp`、安装包 metadata 版本；output schema string-valued object（`tools/status.py:12-17`, `__init__.py:3-5`） | `test_version.py:15-21` 比 structured content、data、文本；`test_server.py:93-104,108-146` 真 stdio；`test_server.py:20-35` 两种发现模式 schema |
| `connection_status` | 无输入 | GET `system_stats` 后 `object_info/vue-basic`；无 output schema，文本 JSON，不返回 structuredContent（`tools/status.py:19-24`, `api/comfy.py:6-22`） | `test_client.py:9-62`；`test_server.py:44-78`；fixture schema `fixtures/status_contract.json` |
| `equipment_list` | 可选类型 camera/primary_optics/optical_accessory/filter，query `""`、include_archived false、cursor null、limit 50 | GET `equipment`，参数 `type,q,archived,after,limit`；分页 `{items,next}`，equipment DTO（`tools/equipment.py:9-19`） | `test_equipment.py:21-41` 仅 camera/all 成功和列表等值；其他分页边界无独立断言 |
| `equipment_get` | 必需 equipment_id，canonical UUID | GET `equipment/{id}`；单 equipment DTO（`tools/equipment.py:21-24`） | `test_equipment.py:34-35,56-76` 必需 schema 和八种失败；没有此工具的成功 DTO 测试 |
| `optical_train_list` | query `""`、include_archived false、cursor null、limit 50 | GET `optical-trains`；分页 train DTO（`tools/equipment.py:26-31`） | `test_equipment.py:17-18,34` 只断言工具存在；无调用断言 |
| `optical_train_get` | 必需 train_id | GET `optical-trains/{id}`；单 train DTO（`tools/equipment.py:33-36`） | 同上，仅发现 |
| `optical_train_revision_list` | 必需 train_id | GET `optical-trains/{id}/revisions`；`{items}` revision 集合，无分页 `next` 要求（`tools/equipment.py:38-41`, `api/equipment.py:101-111`） | 同上，仅发现 |
| `optical_train_revision_get` | 必需 train_id、revision_id | GET `optical-trains/{id}/revisions/{revision_id}`；revision detail/snapshot DTO（`tools/equipment.py:43-47`） | 同上，仅发现 |

校验精度：equipment 校验 id、枚举、name、specs dict、正整数 row_version；train 校验 id、status、name、summary dict、正整数 row_version、bool has_draft；revision 校验 id、正整数 revision_number 和字符串 train_id；detail 还校验 snapshot_version=1、train_id 匹配及 camera/primary_optics dict、accessories/filters list。并非完整嵌套 schema（`api/equipment.py:44-67`）。

## 补充：逐测试断言账本
执行结果由主代理统一登记；以下记录静态断言而非声称通过。`test_equipment.py` 共 4 个函数，参数化展开；`test_client.py` 6 个；`test_config.py` 6 个；`test_server.py` 7 个；`test_version.py` 2 个；packaging 5 个。具体展开总数以主代理 XML 为准。

- `mcp/tests/test_client.py:9-19` MockTransport：路径严格按前缀排序及整个结果字典；`:22-26` 空对象节点缺失 false，503 抛 HTTPStatusError；`:29-37` 两端 × 404/500，异常状态等于输入；`:40-47` 三种 ConnectError/ConnectTimeout/ReadTimeout，所有 HTTPX timeout 为 10 且原异常传播；`:50-57` 两端 × 四种无效 JSON/非 object 均 ValueError；`:60-62` system 为 list 时匹配错误文本。
- `mcp/tests/test_config.py:10-17` 默认、环境、CLI 优先级及 CLI 覆盖非法环境；`:20-25` 13 个空、无 scheme、scheme/host/port/认证/query/fragment/空白/反斜线错误；`:28-31` 空环境拒绝；`:34-35` IPv6 与前后空白、代理路径标准化；`:38-51` Mock factory 两种参数分别断言 URL 与 `stdio/show_banner=False`；`:54-61` argparse exit 2、stdout 空、stderr 包含 URL 信息。
- `mcp/tests/test_server.py:20-36` in-memory auto/legacy 两模式，发现名称等于 fixture、输入去 title 并禁止额外属性、输出完全相等、资源为空；`:39-41` 重复注册抛 ValueError；`:44-58` Mock HTTP 下 status 文本结果精确字典，structured content None；`:61-79` 404、500、断开、超时、坏 JSON、错误形状各为 MCP error，structured None；`:82-90` 临时缺 frontmatter skill 导致构造 ValueError；`:93-105` 真子进程 30 秒内初始化、两工具、version 文本；`:108-150` 原始 JSON-RPC 真子进程验证初始化、通知、列表、工具调用、后续每行 JSON、零退出，finally 存活则 kill/wait。进程测试受继承环境影响。
- `mcp/tests/test_version.py:10-12` 真子进程 `--version` stdout 等包版本，20 秒超时；`:15-22` 内存调用 structured/data/JSON 文本全相等。
- `mcp/tests/test_equipment.py:21-41` Mock HTTP 断言 Bearer、GET、无 `X-AstroPhoto-Local`、路径及 type/archive 参数，发现八工具、get 必需参数及 read-only hint、list 成功 items 完全相等；`:44-53` localhost、非 loopback、代理路径、短/空 token 仅发现两工具；`:56-76` 403/404/500/503、超时、坏 JSON/形状、重定向产生 MCP error 且响应文本不含 token；`:79-89` 真 stdio 启用 token 后八工具、version 成功，仅发现与本地版本，无真实 HTTP。
- `tests/packaging/test_versions.py:8-25` 正确 tag 成功、错误 tag 抛；临时副本 sync 1.2.3、版本验证，篡改 MCP 版本拒绝、非规范 01.2.3 拒绝。`tests/packaging/test_contents.py:12-17` fixture 在临时目录调用 uv build；`:20-33` 三种泄露路径分别构建 Registry，排除四目录、必需 locale/status/paths/migration 存在，注入泄露拒绝；`:36-49` 两个 Extension 模块注入 wheel 拒绝，必需 MCP 模块及 sdist server 存在；`:52-57` 提取构建 JS 的两个导入路径且 urljoin 保留代理前缀。均构建相关测试，本子任务未运行。
- `frontend/ui/check-build.mjs:1-24` 静态检索恰一个 JS、两 host imports、三个注册/组件字符串、生产环境无 Node env 及硬编码 loopback、CSS selector、根和代理 URL 解析；`check-proxy.mjs:1-57` 本地 HTTP server 模拟 `/proxy/comfy`、Playwright 真 Chromium 取静态资源，断言三个注册名顺序、所有资源 200、无 pageerror，finally 关闭 browser/server。它不是运行中的真实 ComfyUI 或反向代理。

## 补充：发布保护逐条与未验证区
- P-01 `release.py:38-51` 检查稳定三段 SemVer、MCP 版本、根依赖精确 pin、可选 tag 与两个 LICENSE 一致；`sync` 可写两个版本和许可证（`:54-67`），无事务回滚：中间失败可能部分写入；版本测试仅覆盖上述部分情况。
- P-02 `release.py:70-81` Git tracked + 未忽略 untracked，经 `.comfyignore` 排除且拒绝输入 symlink；这会纳入未提交但未忽略的允许路径，故本地包需要人工检查。`:84-120` required 列表、单 JS、允许根、路径/私有后缀、metadata 和 requirements；不做秘密内容扫描。
- P-03 `release.py:123-148` 临时 staging、生成 runtime metadata、临时 git index、官方 `zip_files`、退出后校验；TemporaryDirectory 与 `chdir` finally 清理；失败可留下输出目标的部分文件，NO_GUARD_FOUND 原子替换和失败删除。
- P-04 `release.py:151-164` wheel 顶层白名单、必需模块、唯一 METADATA 版本；`:167-180` sdist 前缀、普通文件、`..`、允许范围、版本。没有完整内容语义/包内 secret 或 wheel 所有文件的白名单。
- P-05 `check_install.py:12-52` 独立 venv、指定 PyPI、不用 cache/config、隔离解释器、stdio version，限制 30/45 秒；没有调用真实扩展或设备端点，也没有锁定安装传递依赖的 hash。
- P-06 `.github/workflows/ci.yml:3-71` push main/PR/workflow_call，contents read，3.11/3.12 矩阵，固定 Node/pnpm/uv 版本、frozen 锁，类型/静态检查、React、真实 Chromium Vue、前端检查、Ruff、host doubles、非 host aiohttp 集成、包边界、MCP，随后构建、校验、独立安装，只上传 3.12 产物。workflow 使用 action 版本标签而非 commit SHA；本审计未验证远端 action 内容或本轮 CI 状态。
- P-07 `.github/workflows/release.yml:3-71` v* tag 串行同 ref；复用 CI、下载已测 artifact，PyPI environment 与 OIDC、`skip-existing: true`；Registry job needs PyPI、重新校验 tag，公网 PyPI 独立安装 5 次，每次失败 sleep 15，随后校验并解压 Registry artifact，environment secret 发布。NO_GUARD_FOUND 对已存在 PyPI 版本内容与当前 wheel hash 对比；没有已发布 Registry/PyPI 的本轮证据、生产端认证及服务器的可用性证据。等待时长和公开索引一致性并不保证发布成功。

---

## 静态审计附录 · nodes-siril

# Nodes / Siril 只读源码审计

本轮只读，未运行测试、真实 Siril 或 ComfyUI。下述全部 IMPLEMENTED_UNVERIFIED，缺口另标 PARTIAL / CONFLICT / UNKNOWN；测试函数存在不代表通过。行号为仓库相对路径。范围不包括 Vue/React UI 实现。

## 清单及 Feature

- N-01 `vue-basic`：V3 输入 `CUSTOM_VUE_COMPONENT_BASIC` dict，输出 IMAGE；验证 image 字符串后调用 host `get_annotated_filepath` → `LoadImage.load_image`，无本节点持久写入（nodes/ComfyUIFEExampleVueBasic.py:6-26）。历史节点保留；旧式 NODE_CLASS_MAPPINGS 不存在，注册测试列出四节点（tests/nodes/test_registration.py:4-22）。
- N-02 `AstroPhotoImagePath`：socketless string 原样输出自定义 IMAGE_PATH，无 IO 或验证（nodes/scientific.py:10-25）；是独立手工路径入口，消费者负责检查。
- N-03 `AstroPhotoFITSSource`：ASTRO_FITS_ASSET → IMAGE_PATH，解析资产/路径、只读 FITS 验证并 UI 返回身份；fingerprint 基于文件 stat，异常 NaN 触发重算（nodes/scientific.py:40-61）。
- N-04 `AstroPhotoSirilAutoStretch`：IMAGE_PATH → IMAGE_PATH，三个参数，输出节点，fingerprint 永远 NaN；正式运行产物为新资产路径，UI 携带资产、来源、原始参数；发客户端事件（nodes/scientific.py:64-111）。
- N-05 FITS：选择首个有效 2D mono 或首轴 3 的 RGB 图像 HDU；只读 memmap、不缩放加载，记录 BITPIX、有限元数据与坐标；preview 独立 PNG 代理，64 行分块 float64，NaN/Inf 置零，裁剪并可缩放；源前后 stat fingerprint 检查（astrophoto/siril/frames.py:61-154）。不把 PNG 作为科学输出。
- N-06 软件：平台目录/PATH 最多 8 个候选，逐一执行版本和 64×64 RGB 真实操作能力探测；严格版本 1.4.5，保存前验证二进制身份并原子配置；启用必须已有可验证配置，关闭/删除配置（astrophoto/siril/software.py:18-53,90-201）。
- N-07 执行：固定 SSF 含 requires、setcpu 4、setext、load、set32bits、autostretch、save；shell=False，独立临时目录、离线配置，轮询 checkpoint 并 kill/wait；复制源，处理副本，运行前后检查源 stat+SHA256（astrophoto/siril/processing.py:24-47,57-111,137-156；software.py:56-82）。
- N-08 正式输出：workspace lease 下 UUID 文件夹、manifest、scratch，成功校验尺寸后发布 FITS、hash 和 DB 资产；失败删除输出、记录失败/取消；重启只清理属于本实例且未登记的运行（processing.py:159-246）。
- N-09 预览：owner 新任务取消该 owner 旧 queued/running，thread jobs，完成任务在后续 start 按 900 秒/128 条淘汰；源 PNG 先产生，formal ID 校验 receipt/hash 或运行候选并按源 revision、参数 hash、软件指纹、renderer 和尺寸复用；前后尺寸和 WCS/ROWORDER 对齐检查（previews.py:18-83,118-215）。shutdown 设置停止标记并 join（47-60）。
- N-10 HTTP：软件 GET/discover/save/delete/enabled；资产分页；预览设置 GET/PUT；POST 任务、GET 状态、cancel、validate、before/after PNG，202 异步任务；隐藏 cache_key，PNG no-store/nosniff（astrophoto/api/siril.py:14-109）。

## Guards：输入 → 校验 → 业务 → 清理/响应

- GN-01 节点 runtime → storage 存在且 trusted_local → resolve → 失败 StorageError（scientific.py:28-37）；ImagePath 本身 NO_GUARD_FOUND。
- GN-02 路径 → 非空字符串；UUID 解析资产，否则已注册路径，找不到再直接 source_stat；suffix FIT/FITS/FTS、HDU shape、verify、异常映射 FITS_INVALID、前后指纹不一致 SOURCE_CHANGED（frames.py:17-36,61-115）。按 D04/D19 保留现行行为：直接路径未限定 import roots，但 source_stat → checked_path 会拒绝相对路径（storage/manager.py:25-34；storage/paths.py:12-19）；历史最新要求受授权路径，见 05_NODE_IMAGE_PATH_CONTRACT.md §5。trusted_local 是部署级限制，非路径授权。
- GN-03 坏轴/损坏/权限 → 符合形状才读，OSError/ValueError 等映射 FITS_INVALID；没有明确尺寸上限或内存预算 guard（render_png 全尺寸 uint8；prepare_fits 偏移且有非有限值可分配整图 float64）。FITS 校验不验证科学像素均有限；处理副本将 NaN/Inf 归零，科学语义改变需明确。多 HDU 取第一个符合而非拒绝多个有效图；非有限 BSCALE/BZERO 归零（frames.py:61-115,125-154；processing.py:57-111）。
- GN-04 参数 → 精确字段，shadows 为有限数，target 0..1，linked 必须 bool，mono 强制 false → 安全数值格式脚本（processing.py:24-31,34-43）。shadowsclip 没有上下界，仅有限性；target NaN 因范围检查拒绝。
- GN-05 CLI → 绝对路径、允许名称、二进制签名及可执行权限；-v 必须精确 1.4.5，probe 真运行并比较结果；身份变化拒绝；无 shell，取消/timeout kill+wait（software.py:24-82,135-165）。**PARTIAL**：正式/候选 process 调用未传 timeout（processing.py:34,152）；probe 8/15 秒有超时。只校验输出维度/通道，非完整科学数据或像素非空验证（processing.py:50-54）。
- GN-06 正式处理 → 参数/软件/workspace → 租约、空间预算、临时副本 → 发布并登记；BaseException 失效产物删除和 receipt 状态；恢复只处理符合实例/路径/未注册的产物（processing.py:137-246）。manifest 和目录保留，非完整删除；写 manifest 本身失败的异常路径未证明完全回滚。
- GN-07 preview → owner UUID、参数、互斥 asset_id/image_path、formal UUID（api/siril.py:59-68）→ stop checkpoint → 状态/图片；读取源及 formal revision 检查，validate 再验软件身份、cache（previews.py:62-128,130-206）。普通单张 image 读取不检查软件身份；任务 TTL 仅 start 时清理，活跃任务总量无硬上限，owner 是调用方提供 UUID，非授权身份；cache 一致性依赖 stat 指纹，stat 不变的内容替换未证明能检测。
- GN-08 HTTP → fields 拒绝额外字段、canonical UUID、side 白名单；共享 storage route 权限边界仍需主审计核对（api/siril.py:59-109，api/storage.py:23-35）。PUT preview settings 验证 canvas 却仅传 preview_edge 给 update_settings；canvas_preview 无视存储配置并固定返回 480×320；故该兼容字段被接受但不生效（api/siril.py:49-56；core/config.py:18,100-109；storage/runtime.py:76-92）。前端将响应应用为 CSS 变量（frontend/ui/src/api/previewSettings.ts:17-18,25-53）；是否违反当前产品要求需对照最新决策，不能仅凭旧接口认定 bug。

## Test 双向映射（存在≠执行通过）

- N-01：test_load_image_delegation_and_output / test_invalid_widget_data_rejected_before_host_io（tests/nodes/test_image_io.py:4-20）断言宿主调用及无效类型前拒绝；host 为 fixture stub，非真宿主。
- N-01~04：test_v3_registration_and_definition（tests/nodes/test_registration.py:4-23）断言四 ID、IMAGE_PATH 连通类型、UNC 原样、Vue schema 和构建文件；未证明真宿主工作流序列化。test_load_image_node_outputs_path_and_tracks_file_changes（tests/backend/test_siril.py:40-54）真实 FITS、fixture extension、storage，断言路径与变更指纹。
- N-05/GN-02/03：test_direct_fits_path_outside_import_roots（25-37）明确断言任意外部路径可用和坏 FITS 拒绝；test_frames_validate_precision_metadata_and_truncation（76-84）真实 RGB FITS，断言尺寸 BITPIX 元数据 PNG、源字节不变、截断拒绝。没有覆盖多有效 HDU、轴矩阵、NaN/Inf、超大内存或权限的明确测试函数。
- GN-04：test_parameters_reject_untrusted_script_values（87-93）断言布尔伪值、target 越界、NaN、注入字符串拒绝；test_mono_normalizes_linked（96-98）断言 mono/RGB。
- N-06/GN-05：test_config_rejects_incompatible_version_and_keeps_previous（101-111）monkeypatch executable/run_cli/verify_cli，断言错误版本不覆盖旧配置；test_invalid_and_gui_paths_rejected（114-120）验证路径错误；test_runner_timeout_and_mid_process_cancellation（123-135）真实 Python 子进程非 Siril，断言 timeout/KeyboardInterrupt 及随后进程可执行。
- N-08/GN-06：test_restart_reconciles_only_owned_unregistered_run（138-152）真实临时 storage/SQLite，断言中断标记、删除未登记输出、保留用户文件。test_real_cli_immutable_source_and_formal_output、test_real_cli_direct_path_and_repeated_runs（155-207）仅设置 ASTROPHOTO_SIRIL_TEST_CLI 才运行，断言真实 CLI 输出不同、源不变、取消与多次输出；本轮未执行，不可声称真 Siril 通过。
- N-09/10/GN-07/08：test_scientific_api_access_source_and_cache（tests/integration/test_siril_api.py:22-84）aiohttp TestServer、真实临时 FITS/SQLite，无配置 Siril，断言 trusted/origin 403、配置错误、列表、异步失败前 before 可读、after 404、源删除失效；不是实际 host/Siril。缺少明确候选成功、并发覆盖、缓存复用、formal receipt、启动失败和取消清理端到端断言。

## 交接差异及风险

- 最新专题 02/05 要求 IMAGE_PATH 和内部 load/process/save：N-02~04、07 已实现，但真实 Host E2E UNKNOWN；专题仍称尚无实施证据，现已过时。GN-02 允许可信本机读取导入根外的合规绝对路径。这是现行行为，导入 API 的来源限制另计。
- 原始 Siril PRD v1.1 / 工程规范 ASTRO_FRAME 端口被最新路径契约覆盖；内部 AstroFrame 为服务元数据，不是端口。用户最新确认 Inspector 参数可编辑，旧只读条款已替代；图像三模式仍适用，本期无 Trial，UI 归 frontend 审计，后端可提供 before/after、alignment 和 formal 标志但不能据此证明 UI 验收。
- 旧 Last_Handoff/sources/01_CURRENT_STATE.md:30 的仅一个节点/无外部软件管理为历史快照 OBSOLETE；保留 vue-basic 行为仍须真 Host 证明。
- 最新专题要求限时：probe 有限时、正式及候选无默认限时；要求快速候选和正式产物分离，代码有独立 cache 和 workspace，但并发身份和完整 UI 生命周期需测试。真实 Siril、host、文件权限及大图内存均 UNKNOWN。

## 已读 / 未读

已读上述代码和测试函数；对照 Chat_Handoff 专题 02、05、10 与 Last_Handoff 01；原始 PRD 通过专题冲突矩阵间接对照，未逐条阅读全文。bootstrap、共享 HTTP 授权、cache/storage 底层以及 frontend 由主审/其他范围核对；没有声称已逐项完成全仓审计。未运行任何测试。需要继续逐函数读取剩余 backend tests、bootstrap、完整原始 PRD、最新 Inspector 与 preview 契约并补证据。


## 补充：细粒度功能与完整 HTTP 映射

以下拆分 N-11～N-27 均为 IMPLEMENTED_UNVERIFIED；写入“无”指本函数无直接持久写入，不排除调用链副作用。

- N-11 资产选择列表：`frame_assets(after)` 查询后缀并按 ID 取 101 项，最多返回 100 条和 next；DB 只读（frames.py:51-58）。后缀筛选不是 FITS 数据校验。
- N-12 解析：`resolve_input` 对 canonical UUID 走资产解析，其他先已登记路径，再回退直接路径；路径最终 `source_stat` → `checked_path`，要求绝对路径、拒绝 UNC、`..`、链接/reparse、网络卷和非普通文件（frames.py:17-36；storage/manager.py:25-34；storage/paths.py:12-36）。没有 import roots 约束，但受本地可信部署边界约束。
- N-13 HDU/头：首个二维或首轴三通道三维、正尺寸图像；hdu.verify(exception)、读取 data，记录八类头信息和 WCS 前缀；仅显示时转换并下采样（frames.py:61-115）。
- N-14 图片代理：全尺寸 uint8 缓冲，BSCALE/BZERO 物理转换、非有限归零、裁剪到 0..1，非 TOP-DOWN 行翻转，RGB 转 HWC，Pillow 双线性缩放编码内存 PNG；只缓存 PNG，科学原件不改（frames.py:118-154）。正整数 BITPIX 除以 2^BITPIX-1，浮点按 1 归一，非自动拉伸。
- N-15 参数归一和脚本：严格字段、float 有限、target 范围、真正 bool；linked 限 RGB；固定脚本写临时目录及隔离 config，输出缺失或日志错误则失败（processing.py:20-47）。
- N-16 FITS 预处理：仅工作副本 update；扩展 HDU 转 primary，新文件替换；逐块非有限值变零，偏移存在时转换全图 float64 并删 scaling/blank；移除失效校验和（processing.py:57-111）。无明确科学精度无损保证；源不会由此直接修改。
- N-17 执行 probe：二进制签名/可执行验证 + `-v` 八秒、人工生成 FITS 实测十五秒，比较输出不相同、格式和形状；临时目录清理（software.py:24-53,135-155；processing.py:114-134）。
- N-18 CLI 子进程：无 shell、固定 cwd、无 stdin、环境 LC_ALL/LANG=C，临时日志文件，轮询进程/取消，超时 kill/wait 并检查退出码；正式调用未给 timeout（software.py:56-82；processing.py:152）。
- N-19 软件状态与配置：current 验证启用状态及持久二进制身份；save 先 probe 后持锁再次比身份、再写；clear 只清配置；enabled 严格 bool（software.py:90-172）。
- N-20 发现：PATH 和平台安装目录，去重并限制前八，probe 每项、保留错误状态；读本地并启动候选程序、不自动保存（software.py:174-201）。
- N-21 复制/一致性：空间估计、checkpoint、复制时 hash，处理前后身份、源 stat 和 hash 验证；scratch 有临时复制（processing.py:137-156；storage/manager.py:19-22,44-89）。
- N-22 正式发布：workspace lease 与 UUID 目录、manifest，成功后同卷 no-replace 发布、再次读取及 hash，DB 登记；失败删输出、写失败 receipt；output 和 receipt 是持久写入（processing.py:159-204；storage/manager.py:92-102）。
- N-23 启动恢复：初始化 storage、cache、workspace 后恢复；仅本实例、对应 workspace、UUID、producer、running/completed 且 DB 无资产的 receipt；删已知 scratch 文件、未登记输出、标 interrupted；异常日志延后（storage/runtime.py:56-74；processing.py:207-246）。
- N-24 预览生命周期：start 按 owner 替换未完任务；cancel 只设置 stop 并返回当下 state；线程 finally 移除 worker，shutdown 停止并 join；已完任务仅在后续 start 清理（previews.py:18-101）。
- N-25 预览缓存：先缓存 before，记录 revision、宽高、通道和标准参数；正式输出走 receipt/hash 认证；候选按输入、参数、CLI fingerprint、renderer 版本和 longest_edge 查找 ready job，cache 存 PNG（previews.py:130-201）。
- N-26 预览读取与校验：路径 UUID、side 限 before/after，读取检查源 stat 和 formal 输出 stat；validate 对所有现存图做 cache 校验及候选软件身份校验（api/siril.py:71-91；previews.py:103-128）。PNG 含 no-store/nosniff。
- N-27 设置：GET longest edge/options、固定 canvas 和 revision；PUT 校验 expected_revision、edge 和可选 canvas，但只写 edge；revision 乐观锁更新（api/siril.py:39-56；core/config.py:16-20,90-109；storage/runtime.py:76-92）。

HTTP 全路径前缀 `/astrophoto/v1`（api/siril.py:94-109）：

| 方法及路径 | 输入/输出和副作用 |
|---|---|
| GET /software/siril | 状态、版本、enabled/path；只读 |
| POST /software/siril/discover | 启动候选 probe，返回候选；不持久化 |
| PUT /software/siril | 精确 body path，probe 成功才写配置 |
| DELETE /software/siril | 删除已保存配置 |
| PUT /software/siril/enabled | 精确 body enabled，严格 bool，持久化 |
| GET /fits/assets | 可选 canonical UUID after，分页只读 |
| GET /previews/settings | 返回 edge/options、固定 canvas、限制和 revision |
| PUT /previews/settings | 必需 expected_revision/longest_edge，canvas 可选；仅 edge 生效 |
| POST /previews/autostretch | owner UUID、严格 parameters、asset_id/image_path 二选一，optional formal_id；创建后台任务，202 |
| GET /previews/jobs/{id} | UUID 状态，剔除内部 cache_key |
| POST /previews/jobs/{id}/cancel | 设置 stop，返回当前 state |
| GET /previews/jobs/{id}/validate | 检查图片及软件身份，valid true |
| GET /previews/jobs/{id}/{side} | side 仅 before/after，PNG 二进制 no-store/nosniff |

所有上述端点走共享 handler：必须 trusted_local、loopback remote 和 host、无 forwarded、Fetch-Site 空或 same-origin、Origin 空或同源且 `X-AstroPhoto-Local: 1`；JSON body 最多 65536 字节并在线程执行；错误有 request_id/no-store，403/404/409/423/507/503，其余业务错误多为 422（api/security.py:18-43；api/storage.py:106-165；api/errors.py:5-40）。此边界信任本机进程，不能等同每个文件的授权身份。

## 补充 Guard 和测试边界

- GN-09 source_stat → checked_path 禁止相对、UNC、网络驱动器、链接及 reparse；不存在 SOURCE_NOT_FOUND，普通文件以外/OS 错误 SOURCE_UNREADABLE。更正上文早期疑虑：相对路径最终会被拒绝，不是未检查（storage/paths.py:12-36；storage/manager.py:25-34）。
- GN-10 图片写入 → 独立 scratch → no-replace 同卷 publish，目标已存在拒绝；清理仅允许单链接普通文件（storage/manager.py:92-127）。异常清理本身可能抛错；启动恢复也不删除未知 scratch 内容。
- GN-11 HTTP JSON/身份/响应 → 先认证，再检查服务、JSON 类型及大小，动作在线程运行；StorageError 映射受控响应；精确字段和规范 UUID 拒绝额外值（api/storage.py:23-35,106-165；api/security.py:25-43；api/errors.py:14-40）。
- GN-12 检查配置 → current 确认存储版本/二进制身份，save 探测成功且锁内身份复核才写；discover 最多 8 项，失败不自动覆盖（software.py:90-201）。
- GN-13 正式取消 → checkpoint 异常时 run_cli kill/wait、TemporaryDirectory 清理、formal_run 捕获 BaseException 删除 output 和记账；Interrupted 若为 Exception 会记录 failed，非 Exception（如 KeyboardInterrupt）记录 cancelled（software.py:56-82；processing.py:159-203）。
- GN-14 formal preview → 固定 outputs/{UUID}/stretched.fit，receipt source identity/revision/parameters/state/asset_id 及 output SHA256；不符 PREVIEW_STALE；图片读取时仅 stat fingerprint（previews.py:103-116,130-142）。
- GN-15 canvas 旧参数 → 输入 64..4096 两个整数必须合法，PUT 忽略该值；GET 恒返回默认；内部 update_settings 虽可保存 preview_canvas，但 getter 仍忽略存储值。是兼容接口实际语义，不应推断用户当前要求可配置（core/config.py:100-109；api/siril.py:49-56；storage/runtime.py:88-92）。

测试精确参数：`test_parameters_reject_untrusted_script_values` 四例 linked=0、targetbg=1.1、shadowsclip=NaN、包含换行命令的字符串；`test_invalid_widget_data_rejected_before_host_io` 四例 None、空 dict、image=None、image=123。两个真实 CLI 测试由主 Agent 表示本轮已启用，实际执行结果、环境、退出码以主 Agent 原始证据为准；这里仍不自行声明通过。源文件及测试上文标明真实 FITS/SQLite、stub 或真实 CLI 的区分。

---

## 静态审计附录 · requirements

# 需求与决策只读审计（局部，未完成）

本报告基于文件清点、专题读取、以下明确引用的内容、CodeGraph 源码及九张截图的视觉检查；不声称完整阅读每篇文本。本轮未运行测试，以下均不得标 VERIFIED。主审应补齐全文、截图及独立功能链路的检查。输入共 81 文件。相同 SHA 的文件是同一内容，不算独立来源；两个原始 Siril 文件和交接 primary 副本哈希不同；逐行 diff 确认各仅多一条开头契约补丁，详见补充。零字节中文设备需求文件不提供需求证据。

## 文件清单与覆盖

| 路径 | 字节 | SHA256 | 检查状态 |
|---|---:|---|---|
| .artifact/Handoff/Chat_Handoff/00_READ_FIRST.md | 5872 | 9D119FD39A878F9FE93EDC952DA3C727B84DB24220E8D6D0E73FC0F246E8D8DB | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/13_NEXT_CHAT_RECOVERY_PROMPT.md | 5513 | 8DD3AEB43D7EB23652491E7EFFDB1371208D76B58B5C87D68A81346F86CB3CB6 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md | 120047 | 5A8360EB7CAFC710AC8E1C42AF3B8DB4399B2C4568639E4526E309A69DBE6AB2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/FULL_CONTEXT.md | 120863 | D53316F0333FBFE36251D915BB8E338CABD9C5460A0D4DED7D8998CF9C70AE46 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/00_START_HERE.md | 4203 | F45CDC21DBD139DD194A6C14722720E4EFE1830FCC12089351EDE6416CAE509F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/01_PROJECT_VISION_AND_SCOPE.md | 4012 | 60C708CF2711D29E80D01DF077CB454384ED55AFDAE6FDFC7370E78CFB8DE558 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/02_LATEST_DECISIONS_AND_CONFLICTS.md | 5397 | 9D62482757AAD1BE1BF6E7BC8E3434C80114D70DC5E3E8757DBFDEBDC867227A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/03_CURRENT_REPOSITORY_SNAPSHOT.md | 6813 | 5C371825A4AE118B3E70321AF769201FBD2089650CAA3C67D90593E84B098B57 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md | 7880 | 421A3BE79B59002CA68B7649DF425525075219AA8E11F6CE75BE2653252A6D69 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/05_NODE_IMAGE_PATH_CONTRACT.md | 7580 | 8AD6FCA42C9815E5D72245A6EF07EB748449157AA26D8A56639E2472053C1D90 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/06_SIRIL_1_4_5_FACTS.md | 6635 | CC581F5E1567688A7CB4339C0B344E9BDA2E8575C301EC4DD64F585E5E9F9A34 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/07_UI_DESKTOP_SPEC.md | 9636 | 41FFDFD678CB22B3591BF47914499323BFF2574AF3A6BB4FDC8321C5B9BACB91 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/08_WORKSPACE_SECURITY_AND_LIFECYCLE.md | 4920 | 2D8143BE088D3D39F375D0AA48BF3286FE6E23E5B571A855465BF393902BEC83 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/09_IMPLEMENTATION_ROADMAP.md | 7493 | 535E680C3EEA8929F5001E8815D5CC4DA08D580F2FD41D5A26FB99522DDED048 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/10_TEST_ACCEPTANCE_RISKS.md | 6247 | 004198F316D3BB7A6AB51F3872998D26D0911149FAF9864FCB11D843C2805742 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/11_NEXT_AGENT_PROMPT.md | 4211 | 48E6596BF3D3FE3C5C049725E25252EF04B6CF8A73A38A38BA81F5E622CB10C0 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/12_SOURCE_INDEX_AND_EVIDENCE.md | 5661 | 82D48B74FD8D08532F9A2C1DE01849DB25A7FA026CF5A2E54E43F6DADFFCB01D | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/13_OPEN_QUESTIONS.md | 3464 | 6118750C81ADCAE0E81784AE6CB26B856B01C8FFB3CA40545CF4BF00CA170849 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/FULL_HANDOFF.md | 85744 | 90D3040A5089A6EE5E664D66C2F7F4F1FFF1CDD9C85AC9A9ACA1F9AAB046F500 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/HANDOFF_MANIFEST.json | 8330 | DF0CE59E57BA5BA3B2DF4A30B69C2D1ED8838C779ACF9EBCA4C1531CBD572DD2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/MANIFEST_SHA256.txt | 5007 | 3E9457E484BA196B6FC61FDC8A2EA397CC747872C7D92FF7126A59A6F0A8D4BB | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/新Chat导入说明.txt | 724 | F17EDEC62B02A3F981D1B3D3E7734F2185CD1ED24C93C5CA0B7EBD843A532B4A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/00_README(4).md | 3015 | 7C481BBF93A32A0C1009C406EAC64EB64A0FFF8914BFD336E46086211D1E4BE8 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/01_CURRENT_STATE(4).md | 3000 | 6010CD98DD03A675ACB1C9AD7433B0E631C8B67219C276C48C2958D019EB7348 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/02_REQUIREMENTS(4).md | 43133 | 5FFB35A102B4CC96DCADB3365B35F0CFC3A7D9454264261239FB1B8C3EBDBE9F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/03_ARCHITECTURE(4).md | 13429 | AB16BF582C021066E77DE57686C37001C83E6C5C230CEFF0EFF87B1EC3F43C01 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/04_TECH_STACK(4).md | 9396 | 642EA6FB901727CB65835117570EFFE27E04070DC84043DFA55CEEA0A4D3B9F5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/05_MCP_AND_SKILLS(4).md | 10891 | 2BFDE66A2E2DAC10613231FFD16C6499ED67F131142C09AEAC391B1F576D916B | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/06_DATA_MEMORY_RAG(4).md | 3901 | 148C0B833B65B47B3CAE6074C07B8A9714D1A39A6EB67C90A4CD2D96E339A184 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/07_TEST_EVIDENCE(4).md | 10424 | 2DC9929B7A864B188AACA9D4A539015E590F69564459D09CFB0579D270EA2BCC | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/08_GAPS_AND_RISKS(4).md | 3658 | 7119E87172B40921D34B6AB0FBF6C809E27EA1117CFB9FDC8A01B4A47B22DFB0 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/09_DECISIONS(4).md | 2629 | B0CB0751A3F70F983B93B6B79D00F42EBDC06F5AAC7A2FC39E4264E7C0F1798D | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/10_NEXT_AGENT_PROMPT(4).md | 3107 | DCF1297F116020B67A2C6507D4B14C71BD84BCE8333AF6512D7F42143487282E | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/11_RECONCILIATION(4).md | 9447 | B85F0FC3ABF65854F53BB2D74D7BC1F536C9B093971B83921877BABB6D1279FD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/12_SOURCES(4).md | 3323 | 98F55B2A6099D30A090FDDA67E03B629E69C854AEF5D7363547C4A8A49DC36DD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/CHANGELOG(4).md | 1651 | 16D37E0FCCD3BEBA3C2AACA7A0290FA8A06625CED2702360BB1DDDF8D1B63063 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/FULL_HANDOFF(4).md | 122573 | FA5AA1E5A75EB1E6594B6F3447750EE60DF401B7E9D750C82B97B7A4D1049792 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/MANIFEST(4).md | 5250 | 92BEC1495EDA6E9C417FDAAA5D02A32C7F0E02424F57F0C405716FCD9D7A13AE | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/previous_prd/AstroPhotoFlow_Node_Interaction_PRD_v0.1.md | 24827 | 1CE5A0C7C3E3FE0F1EB00194F9CD71AB46F394D6A79709518E8EB848E5BE2869 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/previous_prd/AstroPhotoFlow_Siril_AutoStretch_MVP_PRD_v1.0.md | 45544 | 5A80D81C1F0790558BFF72451DB507F2A1D60198D79135F446FAFCADFD858FE9 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/AstroPhotoFlow_Inspector_Final_Desktop_Prototype.html | 16829 | D81427CCDCD497D6B86DADB11AD3975A58A2EDA77C1E81588929AA7542843FDF | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/AstroPhotoFlow_Siril_1.4.5_AutoStretch_Engineering_Development_Guide_v1.0.md | 66441 | 843782AA900C6E2414E65B218DFA22E98A0F87C5314CA3C2DF9AD90DF09B342F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/AstroPhotoFlow_Siril_1.4.5_AutoStretch_PRD_v1.1.md | 40184 | 279F656DDC368B67B7BDF81326C81AFCCEAFF8616D504AC1521428B3C07FFE2A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/Pasted markdown(4).md | 25998 | 458CF40ECC4D26B90A257C0D944F042D22166165B4B26A01BF0290C56123FE3A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/react_sidebar/AstroPhoto_React_Sidebar_Requirements_v1.0(2).md | 36336 | A8E330927264EEBD68DB631E5720A13883B7EF3D1861C60544B4176AAFF95BE5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/react_sidebar/AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1(2).md | 57102 | A733156E0ABE20098C698CD69190CA9FC58B84349D7E88963DF6658829EB6311 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/screenshots/image(20261118-053401).png | 20827 | A5FFA9291B68141573050213A20E25D0C89E5605B28341906C50F0ACED68A71E | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/screenshots/image(20261118-061202).png | 30163 | 2BD9B22BF89A4367AAAC97480A50F0F593C627303E6DCD8BB2D7F37BFA96A0D7 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md | 120047 | 5A8360EB7CAFC710AC8E1C42AF3B8DB4399B2C4568639E4526E309A69DBE6AB2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/manifest.json | 4624 | C0BE1A39A141A8AA371DDDD03816F8B078C874AC35E026E70551F3C4E0CDDE8F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/README.txt | 769 | 4F69C9FB0D54BD49CF65963048A068959D556E0AAA6F3A52F514FC73E0889371 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-041729).png | 48872 | B1F667936D2F77E240E9D4C2E8108CE18561FD3CA0C8D4F4B636E148714AD865 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-042528).png | 52711 | 16A2F51CEA6D46155A9F2DF6F45443D64F81F4640DDEB63E033528854C191885 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-044420).png | 27626 | 8D13AEE2FBD8B2D17BA1A1244E5AE83ED8EAA6B395433227FC8378ECBBFD09D6 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-073629).png | 35062 | D9F6167A71C0F0F8021F39D33D54FB1A0EA9DE1BFBBD951AD49080EA27884067 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-074740).png | 2978 | 90974F422DCFDB1765A7EF5EADD66B660E89AEAE7611921F25CC922825AA1DC9 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-074801).png | 2546 | 0BBE2ADDB03927D6AEABAE7FA7BAD843543073DF3BFEB23DAD705BA79D619C8F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-075258).png | 4001 | 8FF328820049A46F36AE573AFC2C85F94FCA48BA68A9C86C393E6694250671D9 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/00_README.md | 3015 | 7C481BBF93A32A0C1009C406EAC64EB64A0FFF8914BFD336E46086211D1E4BE8 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/01_CURRENT_STATE.md | 3000 | 6010CD98DD03A675ACB1C9AD7433B0E631C8B67219C276C48C2958D019EB7348 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/02_REQUIREMENTS.md | 43133 | 5FFB35A102B4CC96DCADB3365B35F0CFC3A7D9454264261239FB1B8C3EBDBE9F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/03_ARCHITECTURE.md | 13429 | AB16BF582C021066E77DE57686C37001C83E6C5C230CEFF0EFF87B1EC3F43C01 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/04_TECH_STACK.md | 9396 | 642EA6FB901727CB65835117570EFFE27E04070DC84043DFA55CEEA0A4D3B9F5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/05_MCP_AND_SKILLS.md | 10891 | 2BFDE66A2E2DAC10613231FFD16C6499ED67F131142C09AEAC391B1F576D916B | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/06_DATA_MEMORY_RAG.md | 3901 | 148C0B833B65B47B3CAE6074C07B8A9714D1A39A6EB67C90A4CD2D96E339A184 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/07_TEST_EVIDENCE.md | 10424 | 2DC9929B7A864B188AACA9D4A539015E590F69564459D09CFB0579D270EA2BCC | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/08_GAPS_AND_RISKS.md | 3658 | 7119E87172B40921D34B6AB0FBF6C809E27EA1117CFB9FDC8A01B4A47B22DFB0 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/09_DECISIONS.md | 2629 | B0CB0751A3F70F983B93B6B79D00F42EBDC06F5AAC7A2FC39E4264E7C0F1798D | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/10_NEXT_AGENT_PROMPT.md | 3107 | DCF1297F116020B67A2C6507D4B14C71BD84BCE8333AF6512D7F42143487282E | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/11_RECONCILIATION.md | 9447 | B85F0FC3ABF65854F53BB2D74D7BC1F536C9B093971B83921877BABB6D1279FD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/12_SOURCES.md | 3323 | 98F55B2A6099D30A090FDDA67E03B629E69C854AEF5D7363547C4A8A49DC36DD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/AstroPhoto_React_Sidebar_Requirements_v1.0.md | 36336 | A8E330927264EEBD68DB631E5720A13883B7EF3D1861C60544B4176AAFF95BE5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md | 57102 | A733156E0ABE20098C698CD69190CA9FC58B84349D7E88963DF6658829EB6311 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/CHANGELOG.md | 1651 | 16D37E0FCCD3BEBA3C2AACA7A0290FA8A06625CED2702360BB1DDDF8D1B63063 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/FULL_HANDOFF.md | 122573 | FA5AA1E5A75EB1E6594B6F3447750EE60DF401B7E9D750C82B97B7A4D1049792 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/MANIFEST.md | 5250 | 92BEC1495EDA6E9C417FDAAA5D02A32C7F0E02424F57F0C405716FCD9D7A13AE | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/Siril_Integrate/AstroPhotoFlow_Siril_1.4.5_AutoStretch_Engineering_Development_Guide_v1.0.md | 66733 | 046C9EA2F6CB9939D6A839D5EF94DC61A000DFFE6FA137762F6A79BC7F5738EC | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/Siril_Integrate/AstroPhotoFlow_Siril_1.4.5_AutoStretch_PRD_v1.1.md | 40564 | 8B8A615D5110C84C69D092FCCBD692A7ED3EBD90C09AAF2542ED34AABED7F4D2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md | 88466 | F5F5EC3940916F7E08562E9C3ED44C366EAF98E7C751844A5F406EB63C598879 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md | 41670 | 8BAE1CD4A2ECE6EA2964AD3DED65DC8CBA5AE4285ACCFF7A724D4895BA7B63F3 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/设备板块/设备管理与光学链路前后端需求规格.md | 0 | E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |

## 决策矩阵（限已定位证据；路径均相对项目根）

| ID | 原始 / 上次 / 本次及冲突 | 现源码与结论 |
|---|---|---|
| D01 Inspector | 旧专题 .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/02_LATEST_DECISIONS_AND_CONFLICTS.md:34–36 与 04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:35–39,46–55 曾指定只读。用户目前明确 Inspector 参数可以修改。 | frontend/ui/src/host/scientific.tsx:150–172,180–193 修改并重置实际 widget 参数。判为实现符合最新决定，编辑链回归待核验。旧只读条款 OBSOLETE。本期无 Trial 管理。 |
| D02 IMAGE_PATH | 旧 ASTRO_FRAME 方案被首期实际路径字符串取代；Source → Siril 内部 load/process/save，非独立命令节点，未来科学类型未全局否决（`02_LATEST_DECISIONS_AND_CONFLICTS.md:15-30`，`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:24-28,35-38`）。| `__init__.py:5-6,40-41` 注册 FITS source、ImagePath、Siril；`frontend/ui/src/host/scientific.tsx:12-14,36-46` 跟踪路径/上游结果。**PARTIAL**：此处仅核对入口，完整类型、缓存、权限及产物链应由代码审计核实，不得由节点存在推断全部验收。 |
| D03 Siril | `02_LATEST_DECISIONS_AND_CONFLICTS.md:37-38` CLI、仅 1.4.5 首期；`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:61-67` 三参数，受控输出且原图不变。 | `frontend/ui/src/api/siril.ts:4-7,14-17` 配置和预览 API、默认参数与严格 ready 版本检查；`__init__.py:40-41` 节点注册。**IMPLEMENTED_UNVERIFIED**；后端执行、权限和真实 CLI 未在本轮验证。 |
| D04 数据与 workspace | `08_WORKSPACE_SECURITY_AND_LIFECYCLE.md:27-37,54-62,66-74` 复用现有存储；外部原址不隐式复制；正式产物持久、预览缓存；路径受控检查、CLI 不经 shell；物理路径会泄露，需要信任边界。设备指南 `.artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md:9,24,102-103` 仅开发测试 DB 可显式重建，无旧库迁移但禁止启动自动擦除。| **PARTIAL / UNKNOWN**：本专题未核对全部真实路径策略、迁移与恢复行为；现有开发库授权不能推及用户生产数据。`tests/backend/test_siril.py:25-31` 明确测试导入根外直接 FITS 路径可用，需核对实际信任边界，不能将“导入根限制”当作已实现 guard。 |
| D05 Sidebar | 原始设备 UI 需求 `.artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md:14-21` Settings 下设备和光路，宿主仍 Nodes/Assets/Settings 三主视图。| **UNKNOWN**：未完整核对当前视图注册及宿主；旧版交接是历史快照，不能证明当前 UI 或运行通过。 |
| D06 设备及光路历史 | 原始 UI `.../AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md:22-29`；工程指南 `.../AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md:17-18,78-84` 要求草稿、发布不可变 revision、历史 snapshot，设备修改不重写历史。| `astrophoto/equipment/trains.py:1` 明示单一可编辑光路、旧 revision 只读；**OBSOLETE（旧多版本需求）/ IMPLEMENTED_UNVERIFIED（单配置）**：当前会话用户明确要求设备和光路不维护历史版本，并要求删除历史版本；此更新决定覆盖原始文档。遗留 revision 的保留/访问与删除范围需按当前源码和授权另审。尚未完整核查服务与 UI。 |
| D07 权限 | `08_WORKSPACE_SECURITY_AND_LIFECYCLE.md:37,58-62` 要求服务器路径许可、规范化和信任限制，不能给远程 Agent 任意读写。| `__init__.py:20-38` 在 on_load 确定 trusted_local 并注册路由；不是各端点授权充分性的证据。**UNKNOWN**，请核查 guard 触发、HTTP 错误及实际允许范围。 |
| D08 长期目标 | `02_LATEST_DECISIONS_AND_CONFLICTS.md:11,28` 保留泛化科学类型和未来交互可能，`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:71` 不把 Memory/RAG/Experiments/业务 MCP 与完整格式支持算成本期。 | **PLANNED / UNKNOWN**：禁止依据规划文档宣称实施。设备文档明确不做驱动、硬件控制和校准匹配（设备 UI:29；工程指南:24）。 |

## 功能、Guard 与测试裂缝

- Inspector 有输入、输出、刷新与参数修改路径，编辑造成 workflow 变化；当 `canvas.read_only` 或 `selectOnly` 为真时 `scientific.tsx:153` 提前返回，其他情况通过 `beforeChange` / `onWidgetChanged` / `graph.change` / `afterChange` 改变状态（150-172）。这些是可编辑功能的宿主权限守卫。
- 预览源路径从连接的 source/image path/上游已匹配执行结果获取（`scientific.tsx:36-46`）；参数或来源变化后匹配失效（68-76），400ms 请求候选（93-115），活跃预览每 8 秒验证并将失败标为 stale（117-133）；这些是源码陈述，未运行验证。路径可达性、请求权限、缓存回收、正式结果恢复须由主审逐条核对。
- `tests/integration/test_siril_api.py:22,43-49,55-80` 使用 aiohttp TestClient/TestServer，断言无本地头和跨源写入 403、配置错误、无 Siril 时可生成 before 而 after 缺失；**测试源码存在，不是本轮运行结果**。`tests/backend/test_siril.py:40-51,76-81,91-110,138-151` 有文件变更 fingerprint、精度/元数据、参数错误、版本拒绝保留旧配置与恢复只清自有运行目录等断言；真实 CLI 测试从 155 行起，环境与 skip 条件需要另行完整核查。
- `frontend/ui/equipment-host.mjs:103-122,246-252` 是包含真实宿主与重启/删除断言的脚本源码，不是本轮运行证明；其中会修改设备与设置，不在本只读任务运行。
- 每个独立功能的 I/O、调用链、持久副作用、并发、校验、异常与恢复、精确测试环境及断言未完成逐项审核；正式 guard 亦未列全。请主审合并其他代码审计并保留此限制。

## 证据级别与未覆盖

历史交接中的测试结论仅为历史自述；本轮没有运行测试，不能标 VERIFIED。已比较原始/副本差异并视觉检查九张 PNG；三套材料尚未全文逐行语义阅读，完整正式执行/权限边界及测试断言分析仍未完成。应把未确认项保留 UNKNOWN，禁止用本局部矩阵代表完整需求验收。


## 后续指令与证据纠正

- 设备与光路：当前会话/直接用户指令为“设备不需要维护多个历史版本”“光路也不需要维护多个版本”“不需要历史版本，删除历史版本”。这晚于原始 UI 和工程文档；D06 的原历史版本设计为 OBSOLETE，当前单配置方向与明确用户意图相符，是否实现彻底及遗留数据处理仍以代码审计为准。
- Inspector 当前会话明确可编辑，替代上一轮审计引用的只读条款，与 Node实现(3) 的参数同步设计及当前源码一致。
- 逐行差异：Git `diff --no-index --unified=2` 对原始 `Original_request/Siril_Integrate/` 两个文件和 `Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/` 同名副本执行。每一对唯一文本差异均是原始文件第 3 行新增 2026-11-18 契约补丁：工程规范明确自定义 IMAGE_PATH、底层字符串、登记资产与授权导入目录服务端校验、Workspace 输出；PRD 明确 Source 到 Siril 的 IMAGE_PATH 与合法 FITS/工作区输出。交接副本仍保留 ASTRO_FRAME 的原始正文；补丁声明该正文为历史记录及未来规划。由此差别是实质边界而非换行或仅格式。两份补丁措辞包含“授权导入目录”，而源码测试 `tests/backend/test_siril.py:25-31` 接受导入根外直接路径；这只能定位权限契约差异，是否在当前 trusted-local 策略下获较新授权须主审结合当前会话和代码确认。

## 九张截图逐项视觉检查

| 文件名（完整目录见清单） | 本轮实际看到 | 证据限度 |
|---|---|---|
| image(20261118-053401).png | 资源管理器列出设备 UI、Siril PRD、PRD.md | 只证明当时文件列表，非产品截图 |
| image(20261118-061202).png | Siril_Integrate 目录列出两个 Markdown 文件、显示大小 | 文件存在历史画面，非运行 |
| image(20261117-041729).png | 暗色宿主媒体资产面板，生成/导入切换及生成空态 | UI 参考，不是 AstroPhoto 功能通过 |
| image(20261117-042528).png | 同类媒体资产面板的较宽布局与空态 | 宿主参考，不证明响应式验收 |
| image(20261117-044420).png | 浅色 AstroPhoto 素材概念图：拍摄会话、Light/Dark/Flat/Bias 和 FITS | 模拟数据及设计参考，非当前实现 |
| image(20261117-073629).png | 浅色 Settings 原型，含语言、主题及规划模块 | 历史设计，后续删除独立语言/主题行见 `Last_Handoff/AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md:1731` |
| image(20261117-074740).png | 深色“已生成/已导入”切换局部 | 视觉参考 |
| image(20261117-074801).png | 深色“节点/素材/设置”导航局部 | 视觉参考 |
| image(20261117-075258).png | 深色节点搜索、排序、筛选控件局部 | 视觉参考 |

## 阅读与去重补充

`05_NODE_IMAGE_PATH_CONTRACT.md`、`06_SIRIL_1_4_5_FACTS.md`、`10_TEST_ACCEPTANCE_RISKS.md`、`13_OPEN_QUESTIONS.md` 本轮全文读取；`02_LATEST_DECISIONS_AND_CONFLICTS.md`、`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md`、`08_WORKSPACE_SECURITY_AND_LIFECYCLE.md`、两份设备原始文档、Siril 原始 PRD/工程规范按关键主题读取，余下文本以清单和标题/关键词抽查为主，不能标全文已读。FULL 汇编和专题同时清点及抽查：Siril `FULL_HANDOFF.md` 汇集专题（例如全文 146-184 对应专题 02；349-390 对应 04），不将同一决策计为独立证明；`FULL_CONTEXT.md` 是合订本但有设备相关独立内容（如 140、409、738、768 行），不能仅凭名称判完全重复；历史 FULL 与专题文件同样须区分汇编与独立来源。精确相同 SHA 文件仅计一个内容，其他哈希不同的文本未证明完全重复。当前未完成用户要求的所有独立文本全文实质阅读；这里明确保留缺口。

哈希统计：81 个文件、62 个不同 SHA-256、19 组重复（每组各两份）。重复包括 Last_Handoff/sources 的 00–12、CHANGELOG、MANIFEST、FULL 与 Chat_Handoff 的 historical_2026-11-16 同名 `(4)` 副本，React Sidebar 两份规范及 Sidebar Chat Full 两份。清单中保留两条路径便于追溯，但每组只能算一份内容。`FULL_CONTEXT.md`、新版 Siril `FULL_HANDOFF.md` 和历史 FULL 不同 SHA，不能按字节相同合并；它们的汇编内容仅作同源材料核对，专有前言、冲突和合订内容仍需要阅读。

旧 Siril 调查的 50 passed/3 skipped、MCP 52、React 7 suites/37 的数字来自 `03_CURRENT_REPOSITORY_SNAPSHOT.md:85-96` 及 `10_TEST_ACCEPTANCE_RISKS.md:23-29`，是历史报告，不是当前执行；该报告明确 Vue Vitest、build、真实 Host 未运行。Siril `10_TEST_ACCEPTANCE_RISKS.md:3-20` 的 13 条 AC 均是调查时待验证；不能据此声称现仓仍未实现，也不能把后续实现自动标通过。
