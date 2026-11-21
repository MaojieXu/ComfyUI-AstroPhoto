# MCP 需求、现行流程与验收边界

## 需求与当前能力

外部 Agent 需要从 ComfyUI 应用外确认宿主与 AstroPhoto 节点可用，并在被授权时读取设备、光路和兼容历史。MCP 独立安装，以 FastMCP 提供本地 stdio。数据通过宿主和扩展公共 HTTP 获取，SQLite、正式文件和画布仍由原主端管理。Extension 状态 API 单独提供业务能力，MCP 的连接诊断只反映其声明的探测结果。

| 能力 | 当前范围 |
|---|---|
| `version` | 默认工具，无参数，返回 MCP 包名和自身版本。 |
| `connection_status` | 默认工具，无参数，依次读取宿主 `system_stats` 和 `object_info/vue-basic`，保留 URI 路径前缀；返回可达性、`extension_registered` 和系统信息。节点查询返回空对象时标记未注册，HTTP 错误、超时或坏响应走工具错误。正常结果保留 JSON 文本协议。 |
| 设备与光路只读 | 条件注册六个工具，分别列出和读取设备、光路、历史 revision。执行只调用扩展公开 GET。列表使用分页与筛选，记录 ID、游标和主要字段按契约校验。 |
| 后续能力 | 工作流提交、在线改图、资产或设备写入、Siril 处理、知识、记忆、实验均未作为 MCP 工具交付。产品 Skills 只从包内条件加载，目前没有生产 Skill 随包分发。 |

## 基础实现流程

1. `astrophoto-mcp` 读取启动参数。地址优先级为 `--comfy-url`、`COMFYUI_URL`、默认 `http://127.0.0.1:8188`。校验 HTTP(S) 地址并保留代理路径，拒绝内嵌凭据、查询、片段和不合法地址。参数错误退出并写 stderr。工厂注册工具，运行时 stdout 保留给 MCP JSON-RPC。
2. 诊断请求向配置的宿主发两个 GET，解析 JSON 类型和系统对象。可达和节点已注册不会证明资产数据库、设备授权或 Siril 可用。检查业务能力时要看 Extension 状态与对应调用是否成功。
3. **客户端注册设备工具的条件。** MCP 进程拥有合规的 `ASTROPHOTO_EQUIPMENT_READ_TOKEN`，长度 43–256，仅 ASCII 字母数字或 `-`、`_`。设备工具只接受根路径的直连回环 IP，例如 `127.0.0.1` 或 `[::1]`。主机名 `localhost`、代理前缀、非回环或无有效凭据时仍可使用默认诊断，设备工具不出现。
4. **宿主真正允许读取的条件。** ComfyUI 进程显式启用 `ASTROPHOTO_LOCAL_STORAGE=1`，监听范围为回环，单用户且无 CORS 配置。请求须通过回环地址和 Host 检查，拒绝转发头。客户端发送与宿主匹配的 Bearer，设备授权分支只允许 GET，并拒绝浏览器 Origin 和 Sec-Fetch-Site。浏览器的同源请求授权分支独立于 MCP Bearer。工具已枚举仍可能收到 403 或服务不可用。
5. 输入先做 UUID、游标等检查，再发送带 Bearer 的受控请求。设备 HTTP 禁止环境代理和重定向；按 HTTP、超时、网络和响应格式分类错误，只保留清洗后的业务码和状态。成功响应验证集合、DTO 及分页结构再返回给 Agent。扩展端工作流程见 [后端概览](backend-overview.md)。
6. 当前宿主和 MCP 各在进程初始化时读取单一凭据。宿主完整重启取得替换值后，持旧值会话的既有工具清单仍可见，实际读应为 403。新值客户端重新启动后读取成功。清除宿主凭据并重启撤销所有 Bearer 读。双客户端轮换、撤销及从本地 wheel 连真机均需独立验收。

## 证据与补发定位

- 现有测试涵盖默认工具 Schema、真实 stdio 枚举和协议输出、模拟 HTTP 错误分类及扩展 aiohttp 授权。历史隔离宿主有正确令牌读取、错误令牌失败和 Bearer POST 被拒的记录。当前快照需要独立复验真实双进程。相同令牌与直连回环根路径下，`tools/list` 应列出两个默认工具和六个设备工具，并逐个读取实际记录。把错令牌 GET 和同令牌 POST 的拒绝、浏览器同源分支、使用代理路径或 localhost 时只保留诊断分别记录。即使授权成功，存储服务或目标记录不可用仍需验证对应错误。[验证](verification.md)
- 后续 Agent 工作流若进入同版本发行，需要真实的连接、工具发现、授权、目标会话和执行回执。包保持双端锁步版本，先验证 PyPI MCP，再发布 Registry Extension。[初版工程边界](first-release.md) · [双包发行](release.md)
- 审查完整工具 Schema、HTTP DTO、授权分支和逐用例断言时，补发 `module/mcp/implementation.md`。审查宿主设备 GET 和写入约束时，另补发 `module/backend/source-index-services.md`。
