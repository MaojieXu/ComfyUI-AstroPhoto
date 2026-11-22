# MCP

独立 PyPI 包名 `astrophoto-mcp`，模块 `astrophoto_mcp`，CLI `astrophoto-mcp`。
采用独立的 `fastmcp==4.2.0`，不再使用 `mcp.server.fastmcp.FastMCP`。
Python 最低版本为 3.11，HTTP 调用使用 HTTPX >=0.28,<1；依赖通过根 uv workspace 锁定。

```sh
uv run astrophoto-mcp --version
uv run astrophoto-mcp --comfy-url http://127.0.0.1:8188
# 已安装到 ComfyUI Python 环境时：
python -m astrophoto_mcp
```

默认 stdio，由 MCP 客户端启动并管理进程。stdout 为协议通道。
不自动启动 ComfyUI，不增加 HTTP MCP 服务、数据库或守护进程。
开发默认 Python 已由根 `.python-version` 固定为 3.12；最低发行版本仍为 3.11。
`--comfy-url` 优先于 `COMFYUI_URL`，默认 `http://127.0.0.1:8188`。
可包含反向代理路径前缀，例如 `/proxy/comfy/`。`resolve_comfy_url()` 统一验证
HTTP(S) 协议、主机和端口，保留路径并补齐尾部斜杠。显式空值、凭证、query、fragment、
内部空白及反斜杠被拒绝；不会把无效配置悄悄替换为默认地址。业务设备凭据仅用于下文指定的本地直连。

## 诊断与渐进式发现

外部客户端连接一个 stdio FastMCP 服务。先用 `list_tools` 查看该进程实际注册的工具，再按任务读取和操作。`create_server()` 始终注册基础诊断和 `init`，设备只读凭据和素材库凭据分别决定是否增加各自的工具组。后端在每次业务请求时检查授权。

| Tool | 参数 | 返回 |
| --- | --- | --- |
| `version` | 无 | `{name, version}`，仅代表当前安装的 MCP 包 |
| `connection_status` | 无 | `{reachable: true, extension_registered: bool, system: object}` |
| `init` | 无，调用参数为 `{}` | 本机扩展数据根的就绪回执，含实际路径和本次补齐项 |

诊断只向配置的服务发送 `GET /system_stats` 和 `GET /object_info/vue-basic`，
超时为每次请求 10 秒。官方 `/object_info/{node_class}` 在节点不存在时返回 HTTP 200 `{}`，
此时 `extension_registered` 为 false；HTTP 404/500 都保留为错误，不视为节点缺失。
连接失败、超时、HTTP 错误、非法 JSON 或非对象响应
通过 MCP tool error 返回，不伪造成功状态。不推断远端 Extension 版本。

## 安装后初始化

ComfyUI 加载扩展后，在 MCP 客户端调用 `init({})`。工具始终可发现，执行时要求直连本机回环地址、单用户宿主且关闭 CORS。使用宿主公开的 `POST /astrophoto/v1/storage/init`，请求体为 JSON 空对象，携带 `X-AstroPhoto-Local: 1`。该请求无需设备或素材库 token。MCP 只经 HTTP 访问宿主，目录和文件由扩展写入。

成功回执包含 `status: ready`、宿主有效根的绝对路径 `data_root`、`checks`、`created` 和 `request_id`。四组 `checks` 为 `config`、`database`、`storage`、`runtime`，各项均为 `ready`。`created` 仅记录本次实际补齐的目录，使用 `storage/<工作区 UUID>/<objects|outputs|.staging>/` 形式的逻辑相对名。宿主首建完成且布局齐全时为 `[]`。外置工作区沿用相同逻辑名，扩展按登记的实际位置核对和补齐。

宿主启动使用初始配置根的 `config/` 协调有效根记录和实例锁。`init` 回执中的 `data_root` 指向存放实例配置和数据库的有效根。 [数据根内协调](local-storage.md#数据根内协调)

已有数据的身份或配置无法核实、已登记文件缺失或外置工作区离线时，扩展保留现有数据和登记，MCP 报告工具错误与处理提示。服务收到响应超时后，可重新调用 `init` 核对实际状态。 [就绪检查与位置记录](local-storage.md#就绪检查与位置记录)

## Extension 原生状态 API

Extension 现在通过 ComfyUI 自身 aiohttp 注册 `GET /astrophoto/v1/status`，返回：

```json
{
  "extension": {"id": "ComfyUI_AstroPhoto", "version": "0.0.1"},
  "api_version": "v1",
  "status": "ok",
  "runtime": {"node_registered": true, "routes_registered": true},
  "data_home": "<effective absolute data directory>",
  "capabilities": {
    "status_api": {"available": true, "reason": null},
    "drawing_node": {"available": true, "reason": null},
    "assets": {"available": true, "reason": null}
  }
}
```

上例节选了受信本机、存储就绪时的响应字段。`storage`、`database`、`assets`、设备及光路按运行时状态报告。`software` 和 `processing` 还取决于 Bundle 和软件状态。`knowledge`、`memory`、`experiments`、`canvas_bridge` 目前返回 `not_implemented`。`data_home` 报告有效存储根或配置回退路径，`status` 汇总节点、路由和数据库健康。前端在线与实际执行结果需独立核实。

`connection_status` 保持两次诊断请求及返回契约。
`init` 遇到写路由缺失时可查询这个公开状态接口，以区分未加载扩展和已加载旧扩展。该状态接口已通过独立 aiohttp 测试，并在 comfyenv 中通过真实 ComfyUI HTTP 验证。

## 模块与已核验 API

```text
astrophoto_mcp/
├── __init__.py       # 从安装 metadata 读取版本
├── __main__.py       # CLI，stdio；show_banner=False
├── config.py         # resolve_comfy_url()、超时常量
├── server.py         # 唯一 create_server()，on_duplicate="error"
├── client.py         # diagnose()，HTTPX 与 MockTransport 注入
├── api/
│   ├── __init__.py
│   ├── comfy.py      # fetch_status()，端点及响应校验
│   ├── equipment.py  # 受控 HTTPX 设备查询
│   └── library.py    # 素材库与审批 HTTP 客户端
└── tools/
    ├── __init__.py
    ├── status.py     # register_status()，使用传入实例的 @mcp.tool
    ├── init.py       # register_init()，本机数据根初始化
    ├── equipment.py  # 设备及光路只读查询
    └── library.py    # 素材查询、组织、导入提案及审批回执
```

在独立 Python 3.11 环境安装 4.2.0 后检查签名，并在实际调用中验证：

| API | 已验证行为 |
| --- | --- |
| `from fastmcp import FastMCP, Client` | 单 Server；内存 `Client(server)` 支持 list/call |
| `FastMCP(..., on_duplicate="error")` | 重复注册抛出 ValueError |
| `@mcp.tool(output_schema=...)` | 注册工具；可显式保留输出 Schema |
| `from fastmcp.tools import ToolResult` | 使用框架序列化 JSON 文本，不自行实现协议 |
| `mcp.run(transport="stdio", show_banner=False)` | stdio；禁用 banner，日志在 stderr |
| `fastmcp.client.transports.StdioTransport` | 支持 command、args、env；真实子进程已测试 |
| `Client(..., mode="legacy", auto_initialize=False)` | 显式 initialize → list_tools → call_tool |
| `fastmcp.server.providers.local_provider.LocalProvider` | 实际 LocalProvider 路径；应用无需另建实例 |
| `fastmcp.skills.provider.SkillsDirectoryProvider` | 新导入路径；构造时扫描并校验 Skills |

4.2.0 在本次锁文件中解析到 MCP SDK 2.3.0，不能继续沿用 SDK 1.x 的 ClientSession
测试导入。FastMCP Client 的默认自动协商可能使用新协议 `server/discover`，没有
InitializeResult；需要验证传统握手时必须明确 `mode="legacy"`。
本次也用旧 SDK 1.30 客户端连接新服务，验证了原有 initialize/list/call 和版本返回。

## Schema 与返回兼容性

升级前从真实 SDK 1.30 Server 捕获的 Schema 保存于
`mcp/tests/fixtures/status_contract.json`，内存协议测试与之比较：

- `version` 保持 `{name, version}`、原 string-valued dict 输出 Schema，以及相同内容的 JSON text / structuredContent。
- `connection_status` 保持原字段、JSON text 响应、无 outputSchema、无 structuredContent；使用 `ToolResult(content=...)` 避免新版自动增加结构化输出。
- 输入仍为无参数对象。FastMCP 4.2 默认移除原参数 Schema 的 title 并增加 `additionalProperties: false`；这是明确记录的输入 Schema 差异，已有 `{}` 调用不变。
- JSON 文本的空白格式由框架决定，不作为契约；错误保持 MCP error，不改成成功返回的错误字典。
- Client 结果使用新版 `is_error`、`structured_content` 等字段；这是客户端 SDK Python API 的变化，MCP wire 字段仍由框架处理。

## Skills 与规划中的工具

Tool 执行受控操作，用户侧 Skill 描述操作顺序、前置能力和结果验证。Knowledge 提供专业资料，Memory 提供授权的用户上下文。ComfyUI 执行工作流图，外部 Agent Harness 负责规划与子 Agent 编排。

当前工作树没有产品 Skill。`create_server()` 仅在包内 `skills/` 存在且含 `SKILL.md` 时接入 FastMCP 4.2 的 `SkillsDirectoryProvider`，无效 Skill 会阻止启动。产品 Skill 的约定源码位置为 `mcp/src/astrophoto_mcp/skills/<name>/SKILL.md`，实现后随 MCP wheel 交付。发布前验证所需工具、能力、资源读取和包内容。仓库的 `.agents/skills/` 供开发 Agent 执行工程流程，位于产品 Provider 的扫描范围之外。见[服务工厂](../mcp/src/astrophoto_mcp/server.py)和[打包边界](publishing.md)。

渐进式发现以 L0 基础诊断、L1 查询、L2 操作作为建议使用顺序。实际可见的工具由同一服务按领域和配置注册。现有业务接口见下方设备和素材库工具表。下列名称是后续设计，须待依赖实现并验证后才能公开。

| 层次 | 规划的接口示例 |
| --- | --- |
| 状态与查询 | `capabilities`、`asset_search`、`software_list`、`software_detect`、`node_search`、`node_describe`、`knowledge_search`、`memory_context`、`memory_search` |
| 资产与软件操作 | `asset_import`、`equipment_upsert`、`calibration_match`、`software_configure` |
| 画布与执行 | `canvas_apply`、`workflow_run`、`workflow_status`、`workflow_cancel` |
| 实验与记忆操作 | `experiment_create`、`experiment_record_trial`、`experiment_list`、`experiment_finalize`、`memory_set`、`memory_feedback`、`memory_forget` |

新接口的设计要求包括稳定命名与 Pydantic Schema、能力协商、结构化错误、`request_id`、`actor`、`source` 和回执，需要时提供 `idempotency_key`。规划中的画布请求应携带 `canvas_session_id`、期望的 `graph_revision`、命令集合与请求 ID，由在线前端应用并返回执行结果。原设计的错误示例为 `CANVAS_UNAVAILABLE` 和 `GRAPH_CONFLICT`。工作流提交走宿主执行接口。现有浏览器 Canvas Adapter 仅服务本地交互。

## 官方依据与验证边界

- [FastMCP 4.2.0 Release](https://github.com/PrefectHQ/fastmcp/releases/tag/v4.2.0) 与 [PyPI metadata](https://pypi.org/project/fastmcp/4.2.0/)：固定版本及 Python 要求。
- [Tools](https://gofastmcp.com/docs/servers/tools)、[Client](https://gofastmcp.com/docs/clients/client)、[Testing](https://gofastmcp.com/docs/servers/testing)：装饰器、协议 Client 和内存测试。测试沿用 asyncio.run，不额外引入异步测试框架。
- [Skills over MCP](https://gofastmcp.com/docs/servers/skills)：新 Provider 路径和静态 Skills 校验。
- [ComfyUI Routes](https://docs.comfy.org/development/comfyui-server/comms_routes)：诊断端点；同时核对了本机 ComfyUI server.py 的实际路由。
- [uv workspaces](https://docs.astral.sh/uv/concepts/projects/workspaces/)：共享锁文件及 Python 要求交集。

Local Provider 文档页面在本次抓取时不可访问，相关签名与路径以本地安装的 4.2.0
源码和实际 duplicate 测试为准。已验证 Python 3.11 workspace 和本机 ComfyUI 所用
Python 3.12.4 的隔离 wheel 安装；没有改动宿主依赖。该历史 Python 来自 Anaconda base；
实际宿主 comfyenv 使用 Python 3.12.16 / Torch 2.14.1+cu130 并已正常启动。
HTTP 单元测试仍不依赖活跃宿主。

客户端配置示意（将路径替换为实际安装了 MCP 的 Python）：

```json
{
  "mcpServers": {
    "astrophoto": {
      "command": "C:/path/to/ComfyUI/python.exe",
      "args": ["-m", "astrophoto_mcp", "--comfy-url", "http://127.0.0.1:8188"]
    }
  }
}
```

## 仓库复核边界（2026-11-16）

该日期的源码与 52 项测试已核验，包含内存 Client、legacy stdio 及原始 JSON stdout 检查。上文旧 SDK 1.30 客户端和宿主 Python 3.12.4 隔离安装属于先前验证记录，本轮未重跑，不计入本轮通过项。

运行时版本握手/不匹配拒绝仍为 PLANNED：`version` 仅返回 MCP 自身版本，`connection_status` 不访问 `/astrophoto/v1/status`。产品 Skills 数量为零；有条件 Provider 接线不等于存在可用业务 Skills。`skills list/install` CLI、Node Search、工作流运行和 Canvas Bridge 都未实现。

FastMCP 间接依赖中存在 Starlette/Uvicorn。本项目入口仅调用 stdio。源码与日志索引见 [MCP 实现交接](../.agents/handoff/module/mcp/implementation.md)。


## 设备与设备组合只读授权

使用直接回环监听、单用户且未启用 CORS 的 ComfyUI 宿主。生成独立随机 URL-safe token（例如使用 Python `secrets.token_urlsafe(48)`），通过私有进程环境将同一值设为宿主与 MCP 的 `ASTROPHOTO_EQUIPMENT_READ_TOKEN`。避免将值提交 Git 或放进命令行、共享配置与日志。设备凭据缺失、格式无效、使用非 loopback IP 或反向代理前缀时，工厂跳过设备工具。素材库工具有独立的注册条件。设备查询应使用 `http://127.0.0.1:<port>` 或 IPv6 loopback 地址。后端每次检查部署、直连来源及 Bearer 凭据，错填凭据时返回 403；HTTPX 关闭代理环境和重定向。

| Tool | 入参 | 返回 |
| --- | --- | --- |
| `equipment_list` | 可选 `equipment_type, query, include_archived, cursor, limit` | 设备分页 |
| `equipment_get` | `equipment_id` | 设备规格及引用 |
| `optical_train_list` | 可选 `query, include_archived, cursor, limit` | 设备组合分页 |
| `optical_train_get` | `train_id` | 设备组合详情、当前配置及相关设备 |
| `optical_train_revision_list` | `train_id` | 旧记录的历史摘要，仅供兼容读取 |
| `optical_train_revision_get` | `train_id, revision_id` | 旧记录的只读快照及兼容模板 |

列表默认每页 50，范围 1–100，搜索最大 120 字符。ID 与游标使用规范 UUID。超时、无权访问、缺记录、无效 JSON 和返回结构错误均通过 MCP tool error 返回。此设备工具组只提供读取，后端拒绝设备 Bearer 凭据发出的非 GET 请求。只读凭据授予客户端访问整个本机设备/设备组合库的权限，适用于受信任的 MCP 客户端。

宿主和 MCP 客户端各自在启动时读取凭据。替换时，先更新宿主进程的私有环境并完整重启 ComfyUI，再用新值重启各 MCP 客户端进程。宿主恢复后，仍持旧值的客户端即使继续显示设备工具，下一次设备查询也会收到 403。撤销时，移除宿主环境的凭据并重启 ComfyUI 即可拒绝旧 Bearer 查询。重新打开界面或重新列工具不会更新进程内凭据。基础诊断继续使用公共宿主端点。


## 素材库工具

在 ComfyUI 和 MCP 进程设置同一个独立 `ASTROPHOTO_LIBRARY_TOKEN`，采用 43–256 位 ASCII URL 安全值。直连回环部署时，FastMCP 工厂注册 `library_list`、`library_get`、`library_create`、`library_update`、`library_delete`、`library_import_request` 和 `library_approval_get`。操作经扩展公开 HTTP 路由执行。审批状态依赖实际用户操作。

查询和允许的虚拟组织管理使用 `/astrophoto/v1/library`。涉及导入、资产及科学属性、Collection、校准和高影响目录操作时，Agent 获得 `approval_id`。用户在 Assets 的待办页面审阅并批准，Agent 通过 `library_approval_get` 查询。`library_delete` 的资产删除为取消登记。工具没有物理文件删除方法。

`uv run --project mcp pytest mcp/tests -q` 通过 FastMCP Client 及 stdio 验证，`uv run pytest tests/integration/test_library_mcp.py -q` 还会跨真实 aiohttp 路由及隔离 SQLite 验证。
