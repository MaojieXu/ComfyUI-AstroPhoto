# 设备、设备组合、素材与 MCP · 联合验收计划

## 联合验收顺序

1. 在同一隔离宿主和 Data Root 验证设备与设备组合的完整生命周期、引用保护和旧数据兼容。
2. 在同一基线验证 Assets 界面、预检、引用与复制、导入回执、重绑、原件保护和科学读取。
3. 以宿主记录为预期值验证 MCP 诊断、最终确定的设备与素材工具、授权和独立安装。按接口稳定顺序执行受影响用例。
4. 在统一报告记录运行基线、实际通过与未验证项。各组原 CASE 编号保留，用原专题编号区分。

下文保留原测试规格。新范围的具体断言随交互和 API 定稿更新。

<a id="04-equipment"></a>

## 设备与设备组合


**v0.5 · 官网样本覆盖、当前回归及待实现规则验收**。以 [索引](00_FEATURE_INDEX.md#04-equipment) 的 HEAD + dirty 工作树为范围，完整矩阵尚未执行，目录数据已在隔离服务层验证并接入 HTTP 集成测试的创建、读回与删除闭环。规范为 [PRD](01_PRD.md#04-equipment) 各 FR，实际入口、guard 与差异在 [DEV](04_DEV.md#04-equipment)。当前测试源码表示覆盖入口，结果及历史证据见 [报告](06_TEST_REPORT.md#04-equipment)。

### 夹具、隔离与顺序

- **F1 后端**。Python 3.12 和临时 `tmp_path` 资产库、隔离部署配置、aiohttp 测试会话。先跑 `uv run pytest tests/backend/test_equipment.py tests/integration/test_equipment_api.py -q`；通过 fixture 清理临时库，不清理真实 Data Root。旧快照测试用 SQLite 专项 fixture，保留只读历史的独立证据。
- **F2 Vue**。Vitest Chromium、组件 mount、真实 Reka 弹层、宿主 API 和确认替身。用隔离设备 UUID、可控状态/冲突/错误响应，卸载组件并清掉 mock 和挂载节点。运行 `pnpm -C frontend exec vitest run tests/components/Library.test.ts`；这是组件可观察行为，不证明真实权限、持久性或进程重启。
- **F3 真宿主和 MCP**。目标 0.46.0 / 1.59.6 的隔离回环、单用户、开启本地存储和独立 Data Root，设置 `COMFYUI_TEST_URL` 和唯一的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`，使用独立 UI 配置；`pnpm -C frontend test:equipment-host`，单次运行在退出前按 API 闭环清理。若测试跨重启，首步加 `--prepare-restart`，用同一测试根与运行标识重启后运行 `--verify-restart`，删除专项附 `--verify-delete`，第二步负责全部清理。MCP 先 `uv run --project mcp pytest mcp/tests/test_equipment.py -q`，再用独立凭据指向测试宿主。留存测试根身份、配置和结果，闭浏览器并恢复设置；删除及清理只针对已验证的隔离样本。环境未就绪用例记 BLOCKED。

| Case / 规则 / 实际入口 | 夹具与步骤 | 验收及覆盖 |
| --- | --- | --- |
| CASE-01 · FR-01 · EquipmentService / EquipmentForm / list_options | F1 创建四类样本，读取、编辑、重开，核查关键词、游标、未知值和边界；注入错误类型/枚举/长度、重复读出或通带、反向范围、外属通带 ID 及过期版本。F2/F3 在 UI 切四类型与双列表筛选、触发字段错误。 | 合法专业值一致，未知保持 null，非法值与旧版本无持久变化，表单保留输入。后端已有生命周期、非法输入、分页和回滚；Library 查懒加载、camera 字段与错误，四类型真实流程见宿主脚本。 |
| CASE-02 · FR-02 · OpticalTrainService._write_draft / train_to_dto / snapshots | F1 保存缺相机、缺主光学及齐备配置，交换配件次序并检查滤镜集合；注入缺设备、错类型、重复 ID、过期 draft 和归档光路。播种旧默认及无默认的历史样本，先回读再原位保存，修改设备名并读旧 revision。F2/F3 快速新增、键盘选择和保存。 | 部分与已配置状态准确，顺序不丢；拒绝状态不写表；优先级当前→旧默认→最近，历史快照不变；快速新增设备可独立查到。已有 `test_single_configuration_concurrent_save_and_live_specs`、`test_existing_default_loads_without_rewriting_legacy_history` 和 Library 快速新增；未见无默认与所有状态交叉的单列覆盖。 |
| CASE-03 · FR-03 · EquipmentDetails / OpticalTrainDetails / delete_unused_equipment / delete_train | F1/F2/F3 测归档恢复、取消删除、过期版本、当前引用与仅旧历史引用、无引用删除。F1 在旧修订删除后、触发器重建前注入失败，核对后再合法重试。 | 首次失败保留默认、配置、快照与保护触发器；重试仅删目标，组件和其他光路保留。已有 `test_legacy_train_delete_rolls_back_history_and_trigger`、aiohttp 响应、Library 引用/确认/冲突、宿主删除入口；同时发生的真实引用变化需复验。 |
| CASE-04 · FR-04 · EquipmentPage / useMutation / 编辑重基 | F2 开始两份表单，暂存后换标签并取消，重挂载恢复，再确认丢弃；保存中尝试离开。模拟另一写入先成功，拒绝陈旧版本，确认重基后再保存。F3 补浏览器离开和响应丢失，查列表再决定重试。 | 草稿保留/丢弃准确，无双击提交；409 有回执、保留编辑，更新基线后仍需显式保存。Library 已有 remount、guard、保存中、光路冲突；设备表单重基、创建不确定性和浏览器提示需实测。 |
| CASE-05 · FR-05 · authorize_equipment_request / runtime / MCP EquipmentHTTP | F1/F3 用同源浏览器、缺/错凭据、跨源/代理标记及正确只读 Bearer 请求；同根重启并读取设备、光路、旧历史。前后记录工作区配置和隔离原图摘要。 | 真实授权方读写正常，Bearer 只读，拒绝无副作用；重启保留且工作区/原图不变。已有 aiohttp 权限/回执、MCP 测试和宿主重启脚本；三端一致性和文件边界须 F3。 |
| CASE-06 · FR-02、FR-03、FR-04 · fetchSelectable / OpticalTrainEditor / validate_train_components | F1/F2 先保存含设备的配置并归档该设备，然后分别保留旧引用、试从 UI 和 API 新加入、解除引用；预填光学状态和变更备注，经界面另改名称并重读。 | 已有归档引用可保留或移除，创建或添加新归档引用拒绝且记录不变。移除并保存后重新添加应被拒绝。没有新增光学状态控件，普通编辑后兼容字段保留。当前后端拒绝新增仍待实施。 |
| CASE-07 · FR-01、FR-02、FR-04 · D-05 | F1/F2。设备和设备组合各测试同名新增、改名撞名、沿用自身名称、同型号不同自命名和并发同名。按 Q-07 补大小写、空白、归档及旧重名。 | 重名标到名称字段，输入保留，库无额外记录。并发仅一笔成功。待实现，未决定的比较变体不冻结。 |
| CASE-08 · FR-01、FR-04 · D-04、D-07 | F2/F3。切换两个列表并分别设置查询和单选筛选，离开并重开模块；查中英文入口、页签和引用用语。 | 筛选互不干扰，第二项替换第一项，模块重挂载恢复默认筛选，编辑草稿独立处理。术语更新后兼容 HTTP/MCP 入口仍可读。 |

### API 清理闭环

设备 HTTP 集成用例逐用例使用独立 SQLite 根。业务断言完成或抛错后，仍在当前 aiohttp 客户端可用时执行清理。分页读取测试记录，含归档项，用当前行版本先删除组合，再删除设备。逐条核对 DELETE 204、请求回执与详情 GET 404，并复读集合确认没有剩余。官网目录用例直接用 PRD 的 JSON，经 POST 创建、GET 核对、DELETE 清理。故障用例在创建组合后抛错，再用同一测试根上的新客户端确认空列表。

真实宿主按本次运行的精确名称筛选测试记录并执行相同的 DELETE 与读回。普通用例和重启验证最终阶段都在退出前清理。准备重启阶段成功时保留数据交给第二阶段，准备失败仍清理。保留业务错误与清理错误，清理错误使测试失败。

<a id="04-equipment-官网样本覆盖与执行顺序"></a>

### 官网样本覆盖与执行顺序

[PRD 数据目录](01_PRD.md#04-equipment-官网核验的临时验收数据)是四类设备的唯一规格来源。设备样本以 JSON 给出，每条的 payload 可用于设备创建入口，按目录编号查询厂商链接。先按用例创建所需型号，记录返回的 UUID，再组装设备组合。生产库、真实工作流、资产库及用户配置不参与。

| 子项 | 上层用例 / 主要层 | 用样本怎么测 | 可观察结果 |
| --- | --- | --- | --- |
| 01-A 类型与基本规格 | CASE-01 · F1/F2/F3 | 四类设备各创建、编辑、重开。用目录中的冷却彩色、冷却单色、非制冷、相机镜头、折射镜、反射镜、折反镜。涵盖字段有值、显式 null 和字段省略，切换类型并打开详情。 | 规格回读与写入一致，缺失保持未知，类型专属字段隔离。显示准确单位与真实型号。 |
| 01-B 通带、读出和非法值 | CASE-01 · F1/F2 | 从官网有模式的相机、有通带的窄带滤镜生成请求变体。用原有合法值测试多行、有序列表及修改；独立构造重复键、重复标签/ID、外属滤镜 ID、反向范围、追加未知字段、32/33 行、字符串长度 120/121、错误类型、越界和必填缺失。合法枚举逐一检查。 | 合法数据顺序和所有权正确，非法字段可定位，原记录和子记录不变。判错输入只用于拒绝用例，不写入目录冒充规格。 |
| 01-C 查询、分页 | CASE-01、CASE-08 · F1/F2/F3/MCP | 中文名称加测试前缀，按名称、厂商及型号查，含空、无匹配和归档结果。用同一真实型号建不同自命名实例，将专用测试库扩到 101 条。依次用 1、50、100 分页并测试失效游标、重复查询参数、0/101 页长。 | 设备数和 UUID 不重复、不遗漏，末页游标为空。无匹配可复原筛选，拒绝无写入。 |
| 02-A 部件、顺序与估算 | CASE-02 · F1/F2/F3 | 分别创建空组合、仅相机、仅主光学、齐全、无配件、有减焦、有平场、巴罗、多个滤镜。用两件已核验的配件做仅用于验证数组顺序的组合，保存后交换顺序。另测重复 UUID、错类别、未知 UUID 和 50/51 边界。 | 状态按基本部件判定，顺序独立、滤镜可复用。标称倍率有依据时核对估算，缺参保留未知，非法引用不改变版本或配置。 |
| 02-B 历史与活数据 | CASE-02、CASE-03 · F1 | 以同一官网样本构造旧格式快照，分别设置旧默认、仅有旧记录、已有当前配置。更新共享设备的用户名称后，读取当前结果和原快照。 | 当前配置优先，兼容回退按旧默认再最近历史，旧快照内容不随当前资料更新，不产生新发布记录。 |
| 03-A 删除、归档、恢复 | CASE-03 · F1/F2/F3 | 建立无引用、仅当前、仅旧历史、当前与历史、两个组合共用五种状态。分别取消、归档、恢复、尝试删设备、经确认删组合。注入快照清理与提交间故障，测试旧版本和重试。 | 引用保护、取消无写、下游关联和错误回执符合契约。仅目标组合及其历史随成功删除，其他组合和设备保留；故障回滚。 |
| 04-A 草稿、两客户端 | CASE-04、CASE-08 · F1/F2/F3 | 两个客户端编辑同一真实设备和组合，先提交一份，再提交过期版本；模拟响应丢失。测试快速新建设备后取消组合、保存中离开、临时收起、跨模块导航和键盘选择。 | 无静默覆盖或重复写。草稿按编辑会话恢复，快速新增已提交的设备可找回。用真实回执确认不明确的提交。 |
| 05-A 权限与重启 | CASE-05 · F1/F3/MCP | 同一临时根经浏览器创建组合，重启后以正确、错误、缺失凭据及带转发信息的请求读写；核对 MCP 列表、详情和旧快照。 | 浏览器授权写入与 MCP 只读分开，拒绝不改变记录。重启后名称、类型、规格和关系一致，工作区和源文件不变。 |
| 06-A 归档引用与兼容值 | CASE-06 · F1/F2 | 保存含真实配件的组合，归档其配件，原样保存、删除已存在引用、尝试新加、替换及删除后重新加入。已有兼容光学状态使用专项历史夹具。 | 原有归档引用及旧历史保留，新引用按 D-06 拒绝，普通编辑不清空兼容字段。新增拒绝属于待实施验收。 |
| 07-A 名称冲突 | CASE-07 · F1/F2 | 用同一真实型号做两个不同名称，随后以相同名称创建、改名和并发提交；组合另外独立运行。列出首尾空格、大小写、归档名称和历史重名。 | 产品要求按 D-05 提示改名且不新增记录；Q-07 的比较细节待确认。当前工作树未实现的结果按缺口记录。 |
| 08-A 两列表及界面 | CASE-08 · F2/F3 | 用四类和部分/齐全/归档组合遍历单选条件，跨列表、跨模块、重挂载，在中英文和窄栏执行。 | 列表独立状态、焦点和筛选可观察。术语以 D-04 实施结果验收；无额外光学状态编辑控件。 |

派生数据只改变名称、请求字段、关系或运行状态。用例生成的实例、UUID、版本号和错误请求留在隔离测试根，每次运行结束按 PRD 的清理步骤处理。试验工况中的太阳滤镜只用于目录读取、搜索与保存类型检查。

设备与光路专项在所需应用代码完成后集中复验。历史 React 发布/默认选择与早期 17 项 SQLite/aiohttp 结果保留为原运行语义。现行 Vue 不以旧发布路径验收，旧快照读和整条删除继续验证。 [原验证范围](../../../docs/equipment.md)

独立迁移批次 `frontend-vue-v1596-local-2026-11-21` 的 [设备宿主日志](../../../.artifact/frontend-migration/equipment-attempt-3.txt) 记录四类设备、光路编辑和布局，[重启日志](../../../.artifact/frontend-migration/equipment-restart.txt) 记录当前配置重启与真实保护删除。该批次的 Chromium 与后端回归另见 [迁移测试报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)，旧快照与未来决策仍按上表分项评估。

<a id="05-mcp"></a>

## MCP 诊断与设备只读查询


**版本** v0.5 · 2026-11-21 · 程序化验收规格。实际运行状态及覆盖范围见[测试报告](06_TEST_REPORT.md#05-mcp)。

最新待决项和已有 CASE 的影响映射见 PRD。各选项确认后再定稿新增断言。 [PRD 决策传播](01_PRD.md#05-mcp-需求评审闭环与下游传播)

<a id="05-mcp-程序化测试分层"></a>

### 程序化测试分层

所有层均由程序指定调用顺序、入参和断言。Agent 对话、模型输出、提示词评估和客户端 UI 不计入本 Feature 的验收。FastMCP 官方测试指南采用真实 Client/Server 进程内调用，并对传输相关行为使用 HTTP 或子进程。本仓库以锁定的 FastMCP 4.2.0 为执行基线。 [FastMCP 测试指南](https://gofastmcp.com/docs/development/tests) · [客户端传输](https://gofastmcp.com/docs/clients/transports)

| 层级 | 程序化方法 | 能证明的行为与缺口 |
| --- | --- | --- |
| 进程内 MCP + HTTP 替身 | pytest 构造 `create_server(url, transport=httpx.MockTransport(...))`，用 FastMCP `Client(server)` 调用 `list_tools` 和 `call_tool`。替身记录固定的 HTTP 方法、路径、参数和请求头，按夹具返回状态、错误及 DTO。 | 证明 FastMCP 注册、分发、入参与出参、错误转换。仓库已有诊断和设备用例，六个查询的成功结果和历史样本可按 CASE-02B 扩展。 |
| stdio 子进程 | FastMCP `Client(StdioTransport(command=sys.executable, args=["-m", "astrophoto_mcp"], env=...))` 启动实际入口，按固定顺序 initialize/list/call。需要检查完整 stdout 时由 subprocess 直接读写 JSON-RPC。 | 证明 CLI、握手、schema、协议专用 stdout 和工具清单。现有设备 stdio 测试执行枚举及 `version`。若要在此层连模拟后端，使用实际监听回环随机端口的测试 HTTP 服务，让子进程访问固定响应。 |
| 真实设备路由与宿主 | aiohttp TestServer 运行实际 Extension 路由。端到端场景由脚本启动隔离 ComfyUI，把其回环 URL 和一次性凭据传给 FastMCP stdio 子进程，依次调用六个查询。固定 HTTP 请求执行权限和清理断言。 | aiohttp 证明路由、授权与存储；隔离 ComfyUI 补证实际启动、进程链、轮换与撤销。固定场景独立记录状态。 |
| 独立安装 | 安装脚本创建临时 venv，安装 wheel 或公开固定版本，用 FastMCP stdio 调用 `version` 并断言版本和默认工具集。按 CASE-03 另行连接隔离宿主。 | 证明独立安装和协议启动。无宿主探测的安装用例仅承担安装与协议证据。 |

子进程用例显式传入本场 URL 和测试所需环境变量，使用独立传输与截止时间管理进程。轮换用例在宿主重启前后保持同一旧 MCP 子进程。需要管理临时数据的用例在结束时执行 API 清理，并在进程退出后清理本场环境。

### 环境、夹具和清理

- **F1 协议和 HTTP 替身**。用 Python 3.12 / pytest、FastMCP 4.2.0 legacy client、HTTPX MockTransport 或本地伪 HTTP 服务，准备空对象、异常和分页 DTO。真实 stdio 子进程只证明协议进程边界，伪 HTTP 不证明实际宿主授权。每例退出 client/process 并恢复环境变量和注入。
- **F2 Extension 隔离**。用 aiohttp TestServer 或隔离 ComfyUI 回环宿主与独立 Data Root 种入设备、设备组合及旧修订样本。当前宿主候选版本和历史版本分别留证。令牌只用于该测试，由独立进程配置注入，不把值或完整请求头落证。关闭服务，清理本次临时数据并还原客户端配置。
- **F3 构件与安装**。独立 checkout/临时输出和虚拟环境，记录 Python 版本、构件哈希及清单后清理。公开安装和本地 wheel 安装单独记录。
- 冻结时采集实际 `HEAD`、相关 dirty diff 和未跟踪代码及依赖锁、构件摘要与 host/依赖版本。本文基线 `main@4c0cf4d` 加当前工作树。未运行不生成 PASS。

### 需求—守卫—用例

| 用例 / 等级 | 规范、入口与夹具 | 操作 | 预期与覆盖入口 |
| --- | --- | --- | --- |
| CASE-01A P0 | FR-01、FR-04 · DEV S1 · F1 | 用合法地址启动 stdio 后 initialize/list/call；对比显式 URL、环境与默认值。用空环境配置、非法 scheme、内嵌凭证、前缀、IPv6 样本。用 legacy 原始帧核对 schema、消息和 stdout。 | 成功仅有协议帧。version 同时有 text 与 structuredContent，status 无 outputSchema/structuredContent。错误配置明确退出。已有 [配置](../../../mcp/tests/test_config.py) · [协议](../../../mcp/tests/test_server.py) · [版本](../../../mcp/tests/test_version.py)。 |
| CASE-01B P0 | FR-01、FR-04 · DEV S2 · F1/F2 | 分别让 stats 和节点端点得到 200、缺节点、404/500、畸形 JSON、非对象、坏 system、断连或超时；另在真实宿主核对 object_info。 | 仅有效响应返回 reachable=true，缺节点为未注册，缺 system 默认空对象。其余工具失败。已有 [诊断替身](../../../mcp/tests/test_client.py) · [工具错误](../../../mcp/tests/test_server.py)，真实宿主复验另记。 |
| CASE-02A P0 | FR-02、FR-05 · DEV S1/S3 · F1 | 用合法 token/缺失/格式非法 token，以及 IP 回环、localhost、代理前缀、非直连地址分别列工具，验证 schema 和只读提示。 | 只有合规 IP 回环根路径及合法格式 token 追加六个工具。默认诊断不受影响。已有 [工具枚举](../../../mcp/tests/test_equipment.py)。 |
| CASE-02B P0 | FR-02 · DEV S3 · F1/F2 | 调用六项，验证默认分页、上一页返回游标、类型/归档范围、当前设备组合与旧修订，注入非法 UUID、超长查询、越界 limit。 | 合法数据与库中 fixture 一致。非法输入在适配器拒绝，无设备写入。现有 MockTransport 验证列表参数和 GET；六项真实宿主全响应、坏游标和旧快照待补。[设备工具](../../../mcp/tests/test_equipment.py) · [HTTP 集成](../../../tests/integration/test_equipment_api.py)。 |
| CASE-02C P0 | FR-02、FR-05 · DEV S3 · F1 | 注入 403/404/5xx、302、超时、断连、非法 JSON、错误 items/next 及详情结构。核对工具错误、目标地址及脱敏。 | 无伪成功，不请求重定向目标，不回显令牌；有效返回保留 DTO。已有 [适配器质量门](../../../mcp/tests/test_equipment.py)，分页游标和各 DTO 类型的正反覆盖待扩展。 |
| CASE-02D P0 | FR-02、FR-05 · DEV S3 · F2 | 启用及禁用可信部署，使用正确、错误、缺失凭据读取；注入异站或转发标记；用正确读口令请求写，使用可信浏览器夹具 seed 数据。 | 权限拒绝为 403，错误/拒绝前后记录一致，可信浏览器和读令牌分别按路径授权。已有 [aiohttp 集成](../../../tests/integration/test_equipment_api.py)，真实宿主的六工具和拒写联合复验待执行。 |
| CASE-02E P0 | FR-05 / Q-01 · DEV S3/S5 · F2 | 按下方矩阵保留旧 stdio 会话，在同一 Data Root 上重启宿主，再以替换值启动独立客户端。 | 宿主切换后旧会话保持工具枚举且实际读失败，新会话读同一 ID；清除宿主凭据并重启后两者读取均拒绝。新版管理能力由产品决定。 |
| CASE-03A P0 | FR-03 · DEV S4 · F3 | 检查版本及 pin、生成 Registry/wheel/sdist，核对构件清单并对临时错配样本复查。 | 混入另一端源码/开发内容或版本错配报错。已有 [版本](../../../tests/packaging/test_versions.py) · [内容](../../../tests/packaging/test_contents.py)。 |
| CASE-03B P0 | FR-03 · DEV S4 · F3 | 清除继承的设备 token 和非法 URL 后对本地 wheel 新建隔离安装，调用 CLI 和 stdio 探针。 | 版本一致，initialize/list/version 通过，安装无本地源码依赖。已有 [安装探针](../../../scripts/check_install.py)，不代替诊断网络复验。 |
| CASE-03C P0 | FR-03 · DEV S4 · F3 | 正式发行流程从公开 PyPI 解析固定版本、隔离安装并验证，随后按既有发行流程核对 Registry 安装和宿主。 | 公开依赖和宿主加载均有真实证据；无公开构件时按环境记录 BLOCKED/NOT_RUN。本次无发布阶段。 |

按 CASE-01 → CASE-02 → CASE-03 执行。替身使用 `uv run --project mcp pytest mcp/tests -q` 与 `uv run pytest tests/integration/test_equipment_api.py tests/packaging -q`。真实宿主独立运行 F2，包构建和安装依 [发行命令](../../../docs/publishing.md)。宿主不可用记录 BLOCKED，不将替身结果填给真机子项。 [历史测试报告](06_TEST_REPORT.md#05-mcp)

### 设备 API 稳定后的真实宿主验收

使用目标 ComfyUI 0.46.0 / Frontend 1.59.6，隔离回环宿主与一次性 Data Root，记录宿主、扩展及 MCP 基线。设备 API 的验收输入为冻结的读取路由、DTO、分页、错误码和历史夹具。用可信同源浏览器分支登记活跃和已归档设备、当前组合，旧历史快照用可复核的兼容测试库预置。当前 API 无新增旧修订能力。校对六个工具时同时记录相应 HTTP 结果、记录 ID、归档范围、组合配置或快照版本；同样检查新组合的空历史及错误归属的 404。 [设备需求](01_PRD.md#04-equipment) · [设备接口测试](../../../tests/integration/test_equipment_api.py) · [历史夹具参考](../../../tests/backend/test_equipment.py)

CASE-02D 由测试程序以 FastMCP `StdioTransport` 启动 MCP，断言两个诊断和六个只读工具的清单，并用固定参数逐一调用。以两个使用同一受信配置的独立 stdio 进程并发读取同一记录，核对均能得到预期数据。另以只带相同 Bearer 的 HTTP 客户端测试既有写路由，至少覆盖设备创建、改名与删除，以及组合创建、配置保存、归档、恢复与删除。请求采用有效独立夹具和当前版本，预期 403、`UNAUTHORIZED_EQUIPMENT_OPERATION`。前后查询比较记录数、内容、行版本、组合配置版本与历史。单独以同源授权写一次，并确认返回和变化正确，用来证明写路由可用。旧修订写入还应区分 Bearer 403 与同源写端的 410 或 409。

读写断言结束后，在 `finally` 中通过可信同源 API 删除本场创建的组合，再以当前 `row_version` 删除本场设备。核对 204、后续读取 404 及列表没有本场新增记录。旧历史夹具用独立临时库，常规权限测试只查询它。关闭客户端与宿主后清理临时根。当前已有设备 aiohttp 测试包含 API 收尾，MCP 真实宿主脚本仍属待执行规格。 [API 测试与清理入口](../../../tests/integration/test_equipment_api.py)

#### CASE-02E 双客户端轮换与撤销

旧值和替换值均为格式有效、互不相同的一次性随机凭据，通过对应进程的私有环境注入。保留旧客户端 A 的同一个 stdio 进程。复用同一个测试 Data Root 和地址，宿主在每次重启后经基础诊断确认可达，避免把重启期间的断连记作授权拒绝。

| 检查点 | 宿主与客户端 | 预期结果 |
| --- | --- | --- |
| 初始 | 宿主使用旧值，客户端 A 使用旧值 | A 枚举八个工具，查询夹具成功，记录设备 ID 和版本。 |
| 先改客户端 | 宿主继续用旧值，临时客户端 B 用替换值 | A 读成功。B 仍列八个工具，读得 403，诊断正常。 |
| 替换宿主 | 宿主完整重启后使用替换值，A 继续运行，B 从替换值环境启动 | A 仍列八个工具，下一次读取 403。B 可读同一 ID 和版本。新值请求写入仍为 403。 |
| 撤销宿主 | 从宿主私有环境移除变量并重启，保持 A/B | A、B 的诊断恢复，之后设备读取均为 403。另启无凭据客户端仅列两个诊断工具。 |

每阶段记录作用进程、宿主就绪点、工具数量、HTTP 状态、错误码和目标记录 ID。用不落盘的值检查 stdout、stderr、工具错误和留档内容中是否出现测试凭据。

### CASE-03 独立安装与发行门槛

- 本地轮次在工作区外的新环境验证目标 wheel。用 `uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1` 完成隔离安装和 legacy stdio 握手，另在该类型独立安装环境检查 CLI 与模块入口。记录 wheel SHA-256、包位置、Python 与依赖版本。Python 3.11 最低版本和 3.12 开发基线分别记结果。
- 安装探针验证默认工具清单与 `version`。从本地 wheel 的独立进程再指向隔离真宿主，完成 `connection_status` 及授权读的抽查，分别记录协议、安装和端到端结果。
- Registry、wheel、sdist 校验内容和版本 pin；公开渠道验证另以 `astrophoto-mcp==0.0.1` 从索引安装并做握手，随后才进入 Registry 验收。当前文档评审不构成公开发布请求。 [发行与检查命令](../../../docs/publishing.md)

<a id="06-assets"></a>

## 素材导入与资产登记


**版本** v0.4 · 2026-11-21 · 模式 B（当前已实现 API、占位和科学读取），恢复 UI 与开放产品行为保留预计场景。基线见[索引](00_FEATURE_INDEX.md#06-assets)，规则来源为 [PRD](01_PRD.md#06-assets)，真实行为来源为 [DEV](04_DEV.md#06-assets)。所有当前运行状态均为 NOT_RUN。历史 React 浏览器导入保留在[历史测试报告](06_TEST_REPORT.md#06-assets)，旧脚本可用 `git show 4c0cf4d:frontend/ui/storage-host.mjs` 查看；当前同名脚本测试 Storage/Environment，不执行素材导入。

独立运行 `frontend-vue-v1596-local-2026-11-21` 的 10-A/B 验证 CASE-05 的真实宿主占位、双语和零素材请求部分，05-A/B、08-A 验证科学入口和无 Bundle 的有限场景。该次运行的跨卷路径因缺少第二测试卷跳过，本轮未重跑。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

### 环境、隔离与执行顺序

执行方式以本专题的产品决定为准。当前测试夹具使用隔离根和测试自建原件，任何目录清理只限该根。用户此前要求测试形成 API 删除闭环，现有资产 API 没有删除资产的操作，因此当前无法为导入资产实现该闭环。完成测试时应记录保留的资产及清理方式，将 API 删除作为待决能力，不能把解绑会话或删除文件当作删除资产的验证。

1. 用 pytest 的独立 `tmp_path` 造两份源文件树、Workspace、Cache 与库，通过 `ASTROPHOTO_IMPORT_ROOTS` 只放行本用例目录；比较字节、记录数、路径与显式操作 ID。容量和源变动用 monkeypatch/故障点，子进程崩溃流程退出后关闭操作线程，然后交由临时目录清理。两卷用 `ASTROPHOTO_TEST_SECOND_VOLUME` 显式指定隔离位置。
2. aiohttp `TestClient/TestServer` 检查 HTTP 授权、字段、状态和错误体。Vue 组件测试使用宿主替身，检查占位不调资产 API。科学路由使用测试生成的 Astropy FITS；真实工作流和宿主 Widget 在 ComfyUI 0.46.0 / Frontend 1.59.6 的回环专用实例验收，缺宿主或样本记录 BLOCKED。
3. 集中验证 `uv run pytest tests/backend/test_storage.py tests/integration/test_storage_api.py tests/backend/test_siril.py tests/integration/test_siril_api.py -q` 与 `pnpm -C frontend test`。真实宿主保存并重开与已登记 FITS ID 关联的样本，再运行来源节点；记录宿主、样本来源、版本、退出状态与未覆盖项。相关环境按[开发文档](../../../docs/development.md)准备。

### 用例与已知覆盖

| CASE / 需求与风险 | 前置、步骤及预期 | 已有覆盖与缺口 |
| --- | --- | --- |
| CASE-01 · FR-01 · 高 | 在两个授权目录放普通样本和子目录，加入重复来源与越界链接；先 POST preview，再查资产与 operation 数未增。reference 报候选及不写目的地，copy 报目标空间；测试越界/保护根、相对路径、只读、离线和满盘拒绝。用边界输入检查 0、100、101 个来源与候选上限，确认超限请求无登记。 | `test_reference_multiple_roots_mode_snapshot_and_relocation`／`test_copy_preflight_blocks_offline_read_only_full_and_unauthorized`／`test_reject_links_unc_and_relative_paths`；`test_http_storage_import_and_access_boundary` 校验预检与授权。边界计数、子项混合错误与预检无数据库写入的 HTTP 专测待补。 |
| CASE-02 · FR-02 · 高 | reference 后检查仅外部登记，copy 目的地内容相同且原件保留。重复同键和同一 body 只返回旧 ID，改变 body 报冲突。发布后事务前和复制途中故障或终止，重启/重试核对已有 object/回执无重复。再测可取消阶段和源变化，部分成功回执的 failed 项可和完成数分辨。 | `test_copy_override_idempotency_and_real_bytes`、`test_copy_detects_inflight_source_change`、`test_copy_recovers_after_publish_before_db_commit`、`test_cancel_partial_staging`、`test_process_exit_during_copy_resumes_own_staging`、`test_http_storage_import_and_access_boundary`。当前无浏览器导入；混合失败和容量边界需以隔离数据补测，界面恢复、结果定位与内容去重由 Q-02、Q-03、Q-04 核对。 |
| CASE-03 · FR-03 · 高 | 登记 ≥101 个小样本，通过 after 查完整去重结果和末页 null。移动外部文件并查 availability，原 ID 保留且报告离线。用同大小合法目标重绑后同 ID 可读，授权外、大小变化、受管资产或目标已登记的重绑失败且旧条目仍在。历史名称搜索/排序恢复后另从多页混合结果验证。 | `test_reference_multiple_roots_mode_snapshot_and_relocation` 断言原件移位与同 ID 重绑；`test_http_storage_import_and_access_boundary` 验证列表返回 managed。HTTP 超页、availability、随机同大小替换和所有重绑拒绝分支专测待补，同大小身份判据由 Q-01 决定。 |
| CASE-04 · FR-04 · 中 | 为资产分别附加两个会话，列表读双关联；重复附加再解除其一两次，库仍保留资产和另一关联，磁盘内容无变。拒绝非法 attached/session 与未知资产，不影响已写关系。 | `test_reference_shared_sessions_leave_the_file_and_other_reference` 直接覆盖服务语义。PATCH DTO、关联错误反馈与完整会话界面待补；界面归 Q-02。 |
| CASE-05 · FR-05 · 高 | 打开新侧栏与重新访问 Assets，检查显示本地化占位，监听无 `/assets` 列表或变更。另在隔离库登记 FITS，重开引用其 ID 的工作流，候选展示名称并解析同路径。原件移开后执行报来源错误；可信本机直接路径可用但不登记。 | `SidebarNavigation.test.ts` 检查 Assets 首屏零请求和语言；`test_scientific_api_access_source_and_cache` 检查已登记 FITS 候选与服务器读取；`test_generic_scientific_nodes_and_routes_without_siril` 检查通用节点及路由独立性。真实 Vue 宿主的已登记旧工作流重开与原件离线反馈待复验。 |
| CASE-06 · FR-02、FR-03 · 高 | 构造同路径相同 stat 重复 reference、变化 stat 冲突、两个独立 copy，以及大小相同但内容不同的重绑候选。按 ID、计数、目标路径和源摘要核对。 | 重复 reference、copy 和同大小重绑应分开验证。当前重绑只校验大小，不应把同大小候选误记为已验证内容一致。Q-01、Q-03 决定未来期望。 |
| CASE-07 · FR-01、FR-02 · 高 | 预检后改变目录再导入。分别创建部分失败、全部失败、超过 100 个失败项，以及取消前后已提交项。验证公开回执字段、计数、错误上限和终态，逐项核对源文件与登记数。 | `_files` 在预检及执行时独立运行。混合失败、错误上限和取消的 HTTP 对账需补测。完整失败路径和按项补导待 Q-04。 |
| CASE-08 · FR-02～05 · 高 | 每次测试创建专用素材，走预检、导入、查询、会话解绑、可用性和可执行的重绑。若将来引入资产删除，分别验证 external 与 managed 删除后的原件、副本、关系和工作流引用，再通过列表与 availability 验证删除结果，最后清除本测试隔离目录。 | 当前无资产删除 API，该闭环的删除步骤 BLOCKED，其他步骤可执行。删除语义和接口由 Q-05 评审。 |

现存位置：[后台](../../../tests/backend/test_storage.py) · [HTTP](../../../tests/integration/test_storage_api.py) · [侧栏](../../../frontend/tests/components/SidebarNavigation.test.ts) · [科学 HTTP](../../../tests/integration/test_siril_api.py) · [现行宿主脚本](../../../frontend/tests/host/storage-host.mjs)。报告明确区分已有测试、未覆盖路径和真实执行结论。

### 存储 v1.0 联动复验（预计）

在 CASE-01 不设旧开关和来源白名单，用两个明确的本机路径验证预检；受保护路径、OS 拒绝、越界链接、跨源请求仍失败。CASE-02 断言正常退出与异常重启保留已提交结果、回收归属明确的未提交暂存并且不续跑。copy 目标配额满时操作失败且不自动改盘。测试脚本在用例收尾先使用已有删除/解绑 API 回读校验；素材当前无公开资产删除接口，移除用例只通过隔离夹具回收，详见存储 CASE-03/08/09。 [存储测试计划](../local-storage-workspaces/05_TEST_PLAN.md)


## 摄影素材库 v0.7 · 当前验收规格

输入为 [实施记录](04_DEV.md#摄影素材库-v07-实现) 与 [UX-01～24](AstroPhoto_Assets_UI_UX_v1.0.md#12-验收用例矩阵uiux)。用 tmp_path Data Root、临时 Workspace 和合成 FITS／视频标识，不触及用户资料库。

| 用例 | 覆盖 | 起点与关键断言 |
| --- | --- | --- |
| LIB-01 | FR-01–04、18–19，UX-03–09、20–21 | aiohttp 原生路由。Copy 上传字节，预检冻结，配置变更拒绝，Operation 完成后比对实际字节。Reference 重复登记不同 ID，删除一项保留原片；拒绝 Reference 物理删除。 |
| LIB-02 | FR-05–09、14–17，UX-12–15、19 | SQLite 经 HTTP。重复成员、已知参数冲突、未知确认、多 Project 引用、同项目移动、目录环、关闭前引用计数和磁盘保护。 |
| LIB-03 | FR-10–13，UX-16–18 | 从设备库创建样本相机和光路。登记阻止未校准或无来源 Flat。Light 关联 Master 参数差异显示并要求确认，成功后校准状态照旧；资产版本冲突保留数据。 |
| LIB-04 | FR-23，UX-23 | aiohttp 用独立令牌申请，浏览器待办及批准，拒绝 Agent 自批和跨来源访问，授权后核对实际持久化。 |
| NODE-A1 / A2 | FR-20，UX-11 | V3 Source 注册、Asset 路径、Collection 有序列表、失联与缓存变化。用真实宿主调用验证支持能力。 |
| OUTPUT-A1 / A2 | FR-21，UX-22 | 确定性处理入口和可用的 Siril 1.4.5，正式输出是否主动收录、旧／新回执兼容、Workspace 迁移与重启。 |
| UI-A1 | FR-22，UX-01–24 | Vue 组件 API 及真实 Chromium。有条件执行独立 ComfyUI 宿主，分别记录文件对话框、跨 Tab/Canvas 拖放、缩放、键盘与宿主分支覆盖。 |
| L-MCP-01～05 | FR-23 | FastMCP Client(server) 走 list_tools / call_tool，替换服务端下游 HTTP 时显式标记。覆盖 opt-in、直接回环限制、注解、分页／CRUD、审批、脱敏拒绝、真实 stdio。实际 ComfyUI 联通另记。 |

正式验收缺证时记录 PARTIAL。历史记录继续可追溯。


### LIB-03B / LIB-05 当前补测

- LIB-03B 通过真实 aiohttp 批量关联多个用途。返回完整差异清单，未确认或遇重复用途时整批回滚，确认后一次写入，且保留 Light 的科学状态。
- LIB-05 注入第二条 Copy 的暂时失败。保留已成功的第一条，按原预检版本重试剩余文件，重复请求返回同一操作，核对新旧回执和数据库实际登记。
- Chromium 组件验证 S05 按用途选择、明确确认和终态重试后新回执。真实 ComfyUI 宿主验证了原有状态、Reference、Copy、拖放和处理，批量关联与剩余重试使用上述独立测试。

### UI 宿主风格适配补测

- 验证搜索旁设置弹层的排序、方向、分组，Escape 关闭与焦点回到触发器；筛选选项使用单选并保持原 API 查询。
- 空库与筛选无结果区分，清除筛选后恢复；窄侧栏、分类和校准入口保持可操作。

### 2026-11-21 动态筛选补测

- 搜索旁图标打开筛选；只显示全部分页素材中实际存在的字段和值，空库显示空提示，读取失败可重试。
- 筛选后再次打开保留可用值和已选项，选择、清除、Escape 与查询参数正确；搜索词不因清除筛选而消失。
