# MCP 诊断与设备只读查询 · 测试计划

**版本** v0.4 · 2026-11-21 · 当前源码回溯规格。Q-01～03 对应新增产品行为待评审，本轮 NOT_RUN。

最新待决项和已有 CASE 的影响映射见 PRD v0.6。各选项确认后再定稿新增断言，此处现行运行规格基于既有实现。 [PRD 决策传播](01_PRD.md#需求评审闭环与下游传播)

## 环境、夹具和清理

- **F1 协议和 HTTP 替身**。用 Python 3.12 / pytest、FastMCP 4.2.0 legacy client、HTTPX MockTransport 或本地伪 HTTP 服务，准备空对象、异常和分页 DTO。真实 stdio 子进程只证明协议进程边界，伪 HTTP 不证明实际宿主授权。每例退出 client/process 并恢复环境变量和注入。
- **F2 Extension 隔离**。用 aiohttp TestServer 或隔离 ComfyUI 回环宿主与独立 Data Root 种入设备、设备组合及旧修订样本。当前宿主候选版本和历史版本分别留证。令牌只用于该测试，由独立进程配置注入，不把值或完整请求头落证。关闭服务，清理本次临时数据并还原客户端配置。
- **F3 构件与安装**。独立 checkout/临时输出和虚拟环境，记录 Python 版本、构件哈希及清单后清理。公开安装和本地 wheel 安装单独记录。
- 冻结时采集实际 `HEAD`、相关 dirty diff 和未跟踪代码及依赖锁、构件摘要与 host/依赖版本。本文基线 `main@4c0cf4d` 加当前工作树。未运行不生成 PASS。

## 需求—守卫—用例

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

按 CASE-01 → CASE-02 → CASE-03 执行。替身使用 `uv run --project mcp pytest mcp/tests -q` 与 `uv run pytest tests/integration/test_equipment_api.py tests/packaging -q`。真实宿主独立运行 F2，包构建和安装依 [发行命令](../../../docs/publishing.md)。宿主不可用记录 BLOCKED，不将替身结果填给真机子项。 [历史测试报告](06_TEST_REPORT.md)

## 设备 API 稳定后的真实宿主验收

使用目标 ComfyUI 0.46.0 / Frontend 1.59.6，隔离回环宿主与一次性 Data Root，记录宿主、扩展及 MCP 基线。设备 API 的验收输入为冻结的读取路由、DTO、分页、错误码和历史夹具。用可信同源浏览器分支登记活跃和已归档设备、当前组合，旧历史快照用可复核的兼容测试库预置。当前 API 无新增旧修订能力。校对六个工具时同时记录相应 HTTP 结果、记录 ID、归档范围、组合配置或快照版本；同样检查新组合的空历史及错误归属的 404。 [设备需求](../equipment-optical-trains/01_PRD.md) · [设备接口测试](../../../tests/integration/test_equipment_api.py) · [历史夹具参考](../../../tests/backend/test_equipment.py)

CASE-02D 使用当前版本的独立 stdio 客户端证明只列两个诊断和六个只读工具。另以只带相同 Bearer 的 HTTP 客户端测试既有写路由，至少覆盖设备创建、改名与删除，以及组合创建、配置保存、归档、恢复与删除。请求采用有效独立夹具和当前版本，预期 403、`UNAUTHORIZED_EQUIPMENT_OPERATION`；前后查询比较记录数、内容、行版本、组合配置版本与历史。单独以同源授权写一次，并确认返回和变化正确，用来证明写路由可用。旧修订写入还应区分 Bearer 403 与同源写端的 410 或 409。

读写断言结束后，在 `finally` 中通过可信同源 API 删除本场创建的组合，再以当前 `row_version` 删除本场设备。核对 204、后续读取 404 及列表没有本场新增记录。旧历史夹具用独立临时库，常规权限测试只查询它。关闭客户端与宿主后清理临时根。当前已有设备 aiohttp 测试包含 API 收尾，MCP 真实宿主脚本仍属待执行规格。 [API 测试与清理入口](../../../tests/integration/test_equipment_api.py)

### CASE-02E 双客户端轮换与撤销

旧值和替换值均为格式有效、互不相同的一次性随机凭据，通过对应进程的私有环境注入。保留旧客户端 A 的同一个 stdio 进程。复用同一个测试 Data Root 和地址，宿主在每次重启后经基础诊断确认可达，避免把重启期间的断连记作授权拒绝。

| 检查点 | 宿主与客户端 | 预期结果 |
| --- | --- | --- |
| 初始 | 宿主使用旧值，客户端 A 使用旧值 | A 枚举八个工具，查询夹具成功，记录设备 ID 和版本。 |
| 先改客户端 | 宿主继续用旧值，临时客户端 B 用替换值 | A 读成功。B 仍列八个工具，读得 403，诊断正常。 |
| 替换宿主 | 宿主完整重启后使用替换值，A 继续运行，B 从替换值环境启动 | A 仍列八个工具，下一次读取 403。B 可读同一 ID 和版本。新值请求写入仍为 403。 |
| 撤销宿主 | 从宿主私有环境移除变量并重启，保持 A/B | A、B 的诊断恢复，之后设备读取均为 403。另启无凭据客户端仅列两个诊断工具。 |

每阶段记录作用进程、宿主就绪点、工具数量、HTTP 状态、错误码和目标记录 ID。用不落盘的值检查 stdout、stderr、工具错误和留档内容中是否出现测试凭据。

## CASE-03 独立安装与发行门槛

- 本地轮次在工作区外的新环境验证目标 wheel。用 `uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1` 完成隔离安装和 legacy stdio 握手，另在该类型独立安装环境检查 CLI 与模块入口。记录 wheel SHA-256、包位置、Python 与依赖版本。Python 3.11 最低版本和 3.12 开发基线分别记结果。
- 安装探针验证默认工具清单与 `version`。从本地 wheel 的独立进程再指向隔离真宿主，完成 `connection_status` 及授权读的抽查，分别记录协议、安装和端到端结果。
- Registry、wheel、sdist 校验内容和版本 pin；公开渠道验证另以 `astrophoto-mcp==0.0.1` 从索引安装并做握手，随后才进入 Registry 验收。当前文档评审不构成公开发布请求。 [发行与检查命令](../../../docs/publishing.md)
