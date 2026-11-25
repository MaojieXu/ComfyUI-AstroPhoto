# MCP

**设备 MCP** 按名称操作设备及设备组合，通过公开 HTTP API 解析 ID 和版本。素材保存绑定时的设备和滤镜快照。

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
由用户启动 ComfyUI。业务数据库由扩展管理。MCP 本地 SQLite 仅记录自动模式下的导入任务来源。
开发默认 Python 已由根 `.python-version` 固定为 3.12；最低发行版本仍为 3.11。
`--comfy-url` 优先于 `COMFYUI_URL`；均未设置时自动发现本机实例。
可包含反向代理路径前缀，例如 `/proxy/comfy/`。`resolve_comfy_url()` 统一验证
HTTP(S) 协议、主机和端口，保留路径并补齐尾部斜杠。显式空值、凭证、query、fragment、
内部空白及反斜杠被拒绝；不会把无效配置悄悄替换为默认地址。

## 诊断与渐进式发现

外部客户端连接一个 stdio FastMCP 服务。`tools/list` 仅显示 `list_tool_categories`、`list_category_tools` 和 `call_tool`。先列出类别，再按类别获取真实工具的名称、说明、输入 Schema 和注解，通过 `call_tool` 传入工具名及 `arguments` 调用。可选类别为 `connection`、`equipment`、`equipment_groups`、`library`、`projects` 和 `storage`；仅返回当前连接配置下已注册的类别和工具。`connection_select` 只在自动发现模式可用。英文 server instructions 说明发现流程，客户端是否提供给模型取决于客户端实现。

分类只改变发现列表，不是权限边界；已知名称仍可直接调用业务工具。原业务工具保持参数和返回契约。发现入口不选择目标，代理的内部业务调用仍走正常中间件，按真实工具名固定目标并记录导入任务来源。本机设备、素材和项目工具不要求业务 token；后端仍限定单用户回环直连。Skill 继续通过资源及 Skills 扩展提供。

未指定地址时，MCP 先核对 Desktop 端口锁中的 PID 与对应监听端口，通过 `/astrophoto/v1/status` 验证设备和素材能力。没有可用的 Desktop 候选时才探测 8000 和 8188。多个候选时，`connection_status` 返回候选并使用 `connection_select` 选择；显式选择按存储实例 ID 保留，地址变化时重新匹配，所选实例不可用时可等待恢复或重新选择。自动模式每次工具调用固定目标 URL 和存储实例 ID，并随业务 HTTP 请求发送该 ID。扩展在处理操作前校验，身份不匹配时返回 `TARGET_INSTANCE_MISMATCH`。导入任务的地址和存储实例 ID 写入本地 SQLite。MCP 重启后可继续查询已保存的任务。原地址失效时，只有唯一发现的实例拥有同一个存储实例 ID 才会继续查询。任务来源文件为 `tasks.sqlite3`。可用 `ASTROPHOTO_MCP_STATE_DIR` 指定目录。默认使用 Windows 上 `LOCALAPPDATA` 下的 `astrophoto-mcp` 目录，其他平台使用 `XDG_STATE_HOME/astrophoto-mcp`，未设置时回退到 `~/.local/state/astrophoto-mcp`。端口锁和各平台 Desktop 的真实行为尚未实测。

| Tool | 参数 | 返回 |
| --- | --- | --- |
| `version` | 无 | `{name, version}`，仅代表当前安装的 MCP 包 |
| `connection_status` | 无 | 显示连接来源和地址。自动发现模式同时返回候选列表与连接状态 |
| `connection_select` | `url` | 自动发现存在多个有效实例时选择其中一个 |

- 自动模式向候选地址请求 `GET /astrophoto/v1/status`，若响应非 200 则探测 `GET /system_stats` 以区分宿主可达与扩展可用。每次请求的超时为 1 秒。至少一个候选通过扩展验证时，`extension_registered` 为 true。只有目标就绪时 `address` 才有值。结构化响应的 `connection_state` 为 `ready`、`selection_required`、`selected_instance_unavailable` 或 `no_candidates`。仅宿主可达时可通过 `reachable` 和空候选识别。
- 手动模式向配置的服务发送 `GET /system_stats` 和 `GET /object_info/vue-basic`，超时为每次请求 10 秒。节点查询返回 HTTP 200 `{}` 时，`extension_registered` 为 false。HTTP 404/500、连接失败、超时、非法 JSON 或非对象响应通过 MCP tool error 返回。手动 HTTP 回环地址还探测扩展状态并以 `astrophoto_loaded` 报告结果。

## 用 Pi 联调 AstroPhoto

联调时使用隔离 Data Root 与合成素材。先通过 `astrophoto-mcp --install-skill <skills父目录>` 导出管理 Skill。在联调目录的 `.pi/mcp.json` 注册 AstroPhoto stdio 服务并设为 direct 披露，使用显式的测试地址。启动 Pi 时用 `--skill <astrophoto-management/SKILL.md>` 指定 Skill 文件，使用 `--tools "read,mcp__astrophoto__*"` 允许读取 Skill 和调用该 MCP。已验证组合为 Pi 1.6.0 与 `opencode-go/deepseek-v4.1-flash:low`。

保存 `--mode json` 输出与独立的 `--session-dir`。确认 Skill 读取事件，再检查工具调用、结果、后台任务号和公开 HTTP 回读。以 Pi 的工具调用 ID 在会话中追查缺失的完成事件。HTTP 请求 ID、状态与导入任务号有助于核对结果。记录关联方法和缺口，使用合成路径和数据减少记录中的隐私信息。

## 安装后初始化

ComfyUI 加载 AstroPhoto 扩展时，`on_load()` 自动初始化数据根。MCP 无需参与，也不提供 `init` 工具。目录结构和宿主 HTTP 接口见[本地存储](../domains/storage.md#当前使用方式)。

宿主状态、权限和结果格式见[状态 HTTP 契约](../api/http/contracts.md#状态与存储)。工具的调用与诊断返回见[连接工具契约](../api/mcp/contracts.md#发现与连接)。

## 模块入口

`server.py` 装配 FastMCP、业务工具和 Skill Provider；`disclosure.py` 提供分类发现，`target.py` 管理自动发现模式的目标与导入任务来源。`api/` 负责公开 HTTP 接口，`tools/equipment.py`、`tools/catalog.py` 和 `tools/projects.py` 提供对应业务工具。具体注册和可用工具以当前服务与测试为准。

## Skills 与规划中的工具

Tool 执行受控操作，用户侧 Skill 描述操作顺序、前置能力和结果验证。Knowledge 提供专业资料，Memory 提供授权的用户上下文。ComfyUI 执行工作流图，外部 Agent Harness 负责规划与子 Agent 编排。

`astrophoto-management` 随 MCP 包交付，覆盖素材、设备、设备组合和项目管理。FastMCP 4.2 的 `SkillsDirectoryProvider` 提供 `skill://astrophoto-management/SKILL.md`，支持 Skills 扩展的客户端也可以通过 `skills/list` 查找。仅从磁盘加载 Skill 的客户端可使用 `astrophoto-mcp --install-skill <skills父目录>` 安装。已有同名目录时报错。仓库的 `.agents/skills/` 位于产品 Provider 扫描范围之外。见[打包边界](../development/publishing.md)。

渐进式发现以 L0 基础诊断、L1 查询、L2 操作作为建议使用顺序。实际可见的工具由同一服务按领域和配置注册。现有业务接口见 [MCP 契约](../api/mcp/contracts.md)。下列名称是后续设计，须待依赖实现并验证后才能公开。

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

运行时版本握手、Node Search、工作流运行和 Canvas Bridge 仍待实现；`version` 返回 MCP 自身版本。

## 本机业务调用

使用单用户、未启用 CORS 的 ComfyUI 直接回环监听。业务工具由现行部署和连接方式决定，具体头部和权限见[HTTP 约定](../api/http/README.md)。工具请求及返回见[MCP 参考](../api/mcp/README.md)。连接诊断保留手动模式的 JSON 文本与自动模式的结构化结果，以适配现行 MCP 客户端。
