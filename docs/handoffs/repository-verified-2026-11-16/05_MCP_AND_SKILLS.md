# MCP实际实现与Skills边界

VERIFIED：源码9个Python文件、2个Tools、CLI、内存协议与独立stdio。产品Skills为PLANNED/零个；有条件Provider接线本身只完成基础设施。没有SQLite、ComfyUI内部import、软件执行或内部Agent调度。

关键证据：server.py:16唯一工厂、tools/status.py:11注册、config.py:11 URL优先级与验证、client.py:9 HTTPX生命周期、api/comfy.py:6两个GET及响应验证、__main__.py:9 CLI。实际协议抓取在evidence/mcp-contract.json。

下文为修订后的接口文档完整快照；先前验证与本轮重跑的区别见末节。本轮官方签名采用安装的4.2.0，不依赖历史SDK1.x猜测。

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
内部空白及反斜杠被拒绝；不会把无效配置悄悄替换为默认地址。未实现额外认证头配置。

| Tool | 参数 | 返回 |
| --- | --- | --- |
| `version` | 无 | `{name, version}`，仅代表当前安装的 MCP 包 |
| `connection_status` | 无 | `{reachable: true, extension_registered: bool, system: object}` |

诊断只向配置的服务发送 `GET /system_stats` 和 `GET /object_info/vue-basic`，
超时为每次请求 10 秒。官方 `/object_info/{node_class}` 在节点不存在时返回 HTTP 200 `{}`，
此时 `extension_registered` 为 false；HTTP 404/500 都保留为错误，不视为节点缺失。
连接失败、超时、HTTP 错误、非法 JSON 或非对象响应
通过 MCP tool error 返回，不伪造成功状态。不推断远端 Extension 版本。

## Extension 原生状态 API

Extension 现在通过 ComfyUI 自身 aiohttp 注册 `GET /astrophoto/v1/status`，返回：

```json
{
  "extension": {"id": "ComfyUI_AstroPhoto", "version": "0.0.1"},
  "api_version": "v1",
  "status": "ok",
  "runtime": {"node_registered": true, "routes_registered": true},
  "data_home": "<configured absolute data directory>",
  "capabilities": {
    "status_api": {"available": true, "reason": null},
    "drawing_node": {"available": true, "reason": null},
    "assets": {"available": false, "reason": "not_implemented"}
  }
}
```

示例省略了其余 unavailable 领域；实际同时返回 storage/software/processing/knowledge/
memory/experiments/canvas_bridge。节点注册缺失时状态为 degraded，不能根据目录存在推断能力。
data_home 仅表示配置，不表示已创建数据库。status ok 不表示前端在线或工作流已验证。

本次保持 `connection_status` 的两次请求及返回契约，不强制调用新 API、不增加新 Tool。
未来若需要详细状态发现，再由 MCP API Adapter 使用此公开路由；不能 import astrophoto
或读取其本地配置/存储。该接口已通过独立 aiohttp 测试，真实 ComfyUI 运行验证仍受宿主阻塞。

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
│   └── comfy.py      # fetch_status()，端点及响应校验
└── tools/
    ├── __init__.py
    └── status.py     # register_status()，使用传入实例的 @mcp.tool
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

## Skills 与未来领域

当前没有用户业务 Skills，也没有 skills/ 空包或伪 Capability。
将来仅扫描 `astrophoto_mcp/skills/` 中真实 `SKILL.md`，通过
`SkillsDirectoryProvider` 校验后注册；无效内容阻止启动。不会扫描 `.agents/skills/`
或用户主目录，不使用已弃用的 4.1 Provider 路径。
Hatch 的包目录规则会将真实 Skills 随 wheel 发布；添加时需补充资源读取和打包测试。

未来领域方向为 status / assets / software / nodes / canvas / workflows /
experiments / knowledge / memory。只在业务实现后新增对应注册函数，复用同一个 Server
并通过 API Adapter 调用 Extension；MCP 不直接访问 SQLite、ComfyUI 内部模块或天文软件。

## 官方依据与验证边界

- [FastMCP 4.2.0 Release](https://github.com/PrefectHQ/fastmcp/releases/tag/v4.2.0) 与 [PyPI metadata](https://pypi.org/project/fastmcp/4.2.0/)：固定版本及 Python 要求。
- [Tools](https://gofastmcp.com/docs/servers/tools)、[Client](https://gofastmcp.com/docs/clients/client)、[Testing](https://gofastmcp.com/docs/servers/testing)：装饰器、协议 Client 和内存测试。测试沿用 asyncio.run，不额外引入异步测试框架。
- [Skills over MCP](https://gofastmcp.com/docs/servers/skills)：新 Provider 路径和静态 Skills 校验。
- [ComfyUI Routes](https://docs.comfy.org/development/comfyui-server/comms_routes)：诊断端点；同时核对了本机 ComfyUI server.py 的实际路由。
- [uv workspaces](https://docs.astral.sh/uv/concepts/projects/workspaces/)：共享锁文件及 Python 要求交集。

Local Provider 文档页面在本次抓取时不可访问，相关签名与路径以本地安装的 4.2.0
源码和实际 duplicate 测试为准。已验证 Python 3.11 workspace 和本机 ComfyUI 所用
Python 3.12.4 的隔离 wheel 安装；没有改动宿主依赖。真实 ComfyUI 仍受原有 Torch /
comfy_kitchen 启动问题限制，HTTP 单元测试不依赖活跃宿主。

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

未来工作流能力应使用 ComfyUI HTTP/WebSocket 或 Extension 公共接口。
资产管理、Siril、知识库、前端桥接与工作流执行工具尚未实现。

## 仓库复核边界（2026-11-16）

当前源码与本轮 52 项测试已核验，包含内存 Client、legacy stdio 及原始 JSON stdout 检查。上文旧 SDK 1.30 客户端和宿主 Python 3.12.4 隔离安装属于先前验证记录，本轮未重跑，不计入本轮通过项。

运行时版本握手/不匹配拒绝仍为 PLANNED：`version` 仅返回 MCP 自身版本，`connection_status` 不访问 `/astrophoto/v1/status`。产品 Skills 数量为零；有条件 Provider 接线不等于存在可用业务 Skills。`skills list/install` CLI、Node Search、工作流运行和 Canvas Bridge 都未实现。

FastMCP 间接依赖中存在 Starlette/Uvicorn；这不表示本项目启动了第二个 Web 服务。实际入口仅调用 stdio。源码与日志索引见 [MCP 审计](05_MCP_AND_SKILLS.md)。

## 未来披露与产品Skill

L0状态/能力，L1资产/软件/节点/知识/记忆发现，L2导入/配置/画布/执行/实验/记忆变更；这些是使用顺序和领域组织，不是三个Server，也不通过全局visibility改变并发客户端。当前只实现L0的两个诊断Tool。

保留9个领域方向：status/assets/software/nodes/canvas/workflows/experiments/knowledge/memory。33候选完整表见02（4环境设备+6资产+5工作流+12处理+3知识记忆+3优化），均不作为当前Tool或Skill注册。将来产品Skill在包内skills发布且先验证Tool依赖；不支持MCP Skills的Agent Host可经用户主动选择本地安装，当前尚无skills list/install CLI。
