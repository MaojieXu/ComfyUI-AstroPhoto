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
不自动启动 ComfyUI，不增加 HTTP MCP 服务、数据库或守护进程。
开发默认 Python 已由根 `.python-version` 固定为 3.12；最低发行版本仍为 3.11。
`--comfy-url` 优先于 `COMFYUI_URL`，默认 `http://127.0.0.1:8188`。
可包含反向代理路径前缀，例如 `/proxy/comfy/`。`resolve_comfy_url()` 统一验证
HTTP(S) 协议、主机和端口，保留路径并补齐尾部斜杠。显式空值、凭证、query、fragment、
内部空白及反斜杠被拒绝；不会把无效配置悄悄替换为默认地址。业务设备凭据仅用于下文指定的本地直连。

## 诊断与渐进式发现

外部客户端连接一个 stdio FastMCP 服务。先用 `list_tools` 查看该进程实际注册的工具，再按任务读取和操作。`create_server()` 始终注册基础诊断，设备只读凭据和素材库凭据分别决定是否增加各自的工具组。后端在每次业务请求时检查授权。

| Tool | 参数 | 返回 |
| --- | --- | --- |
| `version` | 无 | `{name, version}`，仅代表当前安装的 MCP 包 |
| `connection_status` | 无 | `{reachable: true, extension_registered: bool, system: object}` |

诊断只向配置的服务发送 `GET /system_stats` 和 `GET /object_info/vue-basic`，
超时为每次请求 10 秒。官方 `/object_info/{node_class}` 在节点不存在时返回 HTTP 200 `{}`，
此时 `extension_registered` 为 false；HTTP 404/500 都保留为错误，不视为节点缺失。
连接失败、超时、HTTP 错误、非法 JSON 或非对象响应
通过 MCP tool error 返回，不伪造成功状态。不推断远端 Extension 版本。

## 安装后初始化

ComfyUI 加载 AstroPhoto 扩展时，`on_load()` 自动初始化数据根。MCP 无需参与，也不提供 `init` 工具。目录结构和宿主 HTTP 接口见[本地存储](local-storage.md#当前使用方式)。

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


## 设备与设备组合授权

使用直接回环监听、单用户且未启用 CORS 的 ComfyUI 宿主。生成独立随机 URL-safe token（例如使用 Python `secrets.token_urlsafe(48)`），通过私有进程环境将同一值设为宿主与 MCP 的 `ASTROPHOTO_EQUIPMENT_READ_TOKEN`。避免将值提交 Git 或放进命令行、共享配置与日志。设备凭据缺失、格式无效、使用非 loopback IP 或反向代理前缀时，工厂跳过设备工具。素材库工具有独立的注册条件。设备查询应使用 `http://127.0.0.1:<port>` 或 IPv6 loopback 地址。后端每次检查部署、直连来源及 Bearer 凭据，错填凭据时返回 403；HTTPX 关闭代理环境和重定向。

| Tool | 主要参数 | 用途 |
| --- | --- | --- |
| `equipment_list` | `query, equipment_type, archive_filter, sort_by, cursor, limit` | 搜索设备名称及产品名，筛选、排序和分页 |
| `equipment_get` | `name, include_archived` | 按名称获取设备和引用 |
| `equipment_create` | `equipment_type, name, product_name, notes` | 创建设备 |
| `equipment_update` | `name, new_name, product_name, notes` | 修改设备；省略字段保持原值，notes=null 清空 |
| `equipment_set_archived` | `name, archived` | 归档或恢复 |
| `equipment_delete` | `name` | 聊天确认后删除未引用设备 |
| `optical_train_list` | `query, archive_filter, sort_by, cursor, limit` | 搜索组合及成员名称，筛选、排序和分页 |
| `optical_train_get` | `name, include_archived` | 按名称获取组合及成员 |
| `optical_train_create` | `name, notes, camera, primary_optics, accessory, filters, other` | 用设备名称创建组合 |
| `optical_train_update` | `name, new_name, notes, camera, primary_optics, accessory, filters, other` | 局部修改；省略不变，单项 null 清空，列表 [] 清空 |
| `optical_train_set_archived` | `name, archived` | 归档或恢复 |
| `optical_train_delete` | `name` | 聊天确认后删除组合 |

`equipment_type` 枚举为 `camera`, `primary_optics`, `optical_accessory`, `filter`, `other`。`archive_filter` 为 `active`, `archived`, `all`；`sort_by` 为 `name_asc`, `name_desc`, `created_desc`, `updated_desc`。工具说明和协议标识使用英文，名称与备注原样保存。分页每页默认 50、范围 1–100；游标绑定查询和排序，修改条件后不得复用。分页不是跨并发写入的固定快照。

组合创建允许不完整配置；相机、主光学设备、附件各至多一个，滤镜及其他设备各至多 50 个。名称解析通过读取公开 API，按 NFC、大小写折叠及去除首尾空白精确匹配。设备、组合分别唯一；归档名称继续占用，删除组合释放名称。MCP 不返回内部 ID 或版本供调用方输入，更新时使用读到的版本，冲突返回错误；确认绑定名称、内部 ID 和版本。旧组合草稿及版本工具已移除。

只读工具需读取凭据。写入工具需独立的 `ASTROPHOTO_EQUIPMENT_WRITE_TOKEN`，名称解析及修改还需读取凭据，删除还需独立审批凭据及受信聊天确认。若只有写入凭据，创建设备或不含成员的组合不需要读取。需要解析名称的操作报告 READ_ACCESS_REQUIRED。删除设备会永久移除记录，直接引用设备的校准主帧等引用仍受保护。删除组合保留记录。设备变更不回写已保存的素材快照，素材重新绑定时更新快照。HTTP 客户端通过公开接口访问宿主。现有前端使用 UUID 分页接口，MCP 使用排序游标。

宿主和 MCP 客户端各自在启动时读取凭据。替换时，先更新宿主进程的私有环境并完整重启 ComfyUI，再用新值重启各 MCP 客户端进程。宿主恢复后，仍持旧值的客户端即使继续显示设备工具，下一次设备查询也会收到 403。撤销时，移除宿主环境的凭据并重启 ComfyUI 即可拒绝旧 Bearer 查询。重新打开界面或重新列工具不会更新进程内凭据。基础诊断继续使用公共宿主端点。


## 素材、校准与项目工具

在 ComfyUI 和 MCP 进程配置同一独立的 `ASTROPHOTO_LIBRARY_TOKEN`（43–256 位 ASCII URL 安全字符），并使用直连回环地址。该凭据授权下表中的读写操作。按名称解析新设备绑定还需要设备读取凭据。Agent 获得用户授权后可直接导入，由宿主预检并返回异步任务引用。运行时 schema 以 `tools/list` 为准，工具描述和枚举使用英文，用户名称和备注保留原语言。

| 模块 | 工具 |
| --- | --- |
| 素材 | `library_list`、`library_get`、`library_list_subframes`、`library_inspect_folder`、`library_import`、`library_import_status`、`library_add_subframes`、`library_update`、`library_remove`、`library_remove_subframe`、`library_find_calibration`、`library_bind_calibration`、`library_unbind_calibration` |
| 项目 | `project_list`、`project_get`、`project_create`、`project_update`、`project_delete`、`project_create_folders`、`project_add_assets`、`project_update_node`、`project_remove_node`、`project_impact` |

四类素材名称在整个素材库内唯一，素材工具使用名称定位并在内部解析 ID；子帧以组名称及已登记文件路径定位。一个调用导入一个素材或一组子帧，可向已有组追加文件或文件夹，不修改其共同参数。目录检查只列出文件名。导入和追加返回持久化短任务号（IMP- 加 8 位随机十六进制字符）；状态查询返回计数、错误及素材名称。素材工具的文件路径为宿主绝对路径。新的目录记录跟踪创建和更新时间，历史记录缺少已知创建时间时不推测。项目按名称与逻辑路径访问；`project_add_assets` 的 `assets` 接受 `{name, alias?}` 列表，无须类型或 UUID，批量提交原子执行。`project_get` 默认列出直接子项，`recursive=true` 返回按路径层级排序的平面后代列表，均支持分页；不返回素材内部 ID。删除项目或非空目录需要回传影响预览的 `impact_token`，移除登记或项目引用保留磁盘文件。递归查询目前仍在后端枚举项目节点，大项目性能有待验证。

`library_import` 的四类素材均可传 `equipment`。主帧提供来源子帧组时，省略 `capture.binning` 会继承组值，显式传 `null` 保存为未知。子帧组及未指定来源的主帧省略该字段时使用 `1`。

设备、设备组合、素材和项目更新保持扁平参数：省略字段保持原值，可清空字段传 null，非空字段不接受 null；设备组合的多选列表使用空数组清空。工具 schema 标识可选性与可空性，内部缺省标记不作为 JSON 默认值暴露。MCP 包显式依赖 Pydantic 2.14 至 2.x。

追加按可追溯的来源路径检查重复；历史复制记录或浏览器上传若未保留原始绝对路径，无法可靠判定它与新选路径是否为同一源文件，Agent 应先核对组内文件。移除子帧登记会释放来源路径记录，物理文件保持不变。

通过 `library_import` 以 `asset_type=master_frame` 和 `master_type` 导入主帧；所有主帧可提供来源子帧组及拍摄参数。已有主帧可通过 `library_update` 修改用途、来源和参数，`library_get` 返回来源及参数。Light 可绑定 Dark、Bias、Flat，Flat 可绑定 Bias、Dark Flat。候选保留差异及未知，绑定返回比较提示但不因此拒绝；温度仅记录。同一类型可绑定多张不同主帧，重复指定同一主帧报错，已存在的绑定保持不变。被引用校准主帧修改仍受保护。

只有校准记录的历史主帧可用素材工具按名称读取、修改和注销，也可用项目工具引用和读取。素材注销遵循目录版本与引用保护规则。素材目录分页反映查询当时的记录。跨页遇到并发修改时，以最新查询结果为准，游标对应记录已移除时从第一页重新查询。项目删除的影响令牌在写事务中重验，预览发生变化时需重新获取影响范围并确认。

这些工具经 `/astrophoto/v1/catalog` 和 `/astrophoto/v1/library/catalog-import` 调用宿主。旧的通用素材、会话和审批 MCP 工具已从发现列表移除。定向协议和 HTTP 验证见 `mcp/tests/test_catalog_tools.py`、`tests/integration/test_library_mcp.py`。
