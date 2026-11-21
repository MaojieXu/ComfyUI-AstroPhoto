# MCP 协议与客户端

逐文件职责、项目内依赖、状态与分支见 [MCP 文件地图](#mcp-source-index)。

## 启动和工具契约

轮换涉及两处启动快照。MCP 的 `server.py:create_server` 将凭据传给 `EquipmentHTTP.__init__`，宿主 `astrophoto/bootstrap.py:host_runtime` 写入 `Runtime.equipment_read_token`。已有宿主路由再次注册时复用原 runtime。双客户端验收应跨完整宿主重启保留旧 stdio 会话，分别记录它的工具枚举、旧值 GET 403 和新会话 GET 200。现有测试记录尚未覆盖这组轮换。

MCP 路径以 mcp/src/astrophoto_mcp/ 为基。入口为 mcp/pyproject.toml:14–15 的 `astrophoto-mcp` 或 `python -m astrophoto_mcp` → `__main__.py:9–23::main` → `config.py:11–27::resolve_comfy_url` → `server.py:19–31::create_server` → `FastMCP.run(transport="stdio", show_banner=False)`。普通 CLI stdout 供 MCP JSON-RPC；显式 `--version` 打印并退出。应用没有另建 HTTP 宿主，也不会启动 ComfyUI。唯一工厂 `on_duplicate="error"`。

| 工具或机制 | 可用性和输入 | 正式请求、结果及对应 Guard |
| --- | --- | --- |
| version | 默认，无参 | tools/status.py:12–17 → 包自身 metadata 版本，structured/text object `{name,version}`，string-valued output schema。远端 Extension 版本由状态 API 另行表达。 |
| connection_status | 默认，无参 | tools/status.py:19–24 → client.py:9–14 → api/comfy.py:6–22，依序 GET `system_stats`、`object_info/vue-basic`；保留反代前缀。成功 JSON 文本 `{reachable:true,extension_registered,system}`；无 outputSchema 或 structuredContent。对缺节点的 HTTP 200 空对象映射 false；HTTP 404/500 是错误。 |
| equipment_list | 条件，equipment_type 为 camera/primary_optics/optical_accessory/filter 或 null，query 空，include_archived false，cursor null，limit 50 | tools/equipment.py:9–19 → GET `astrophoto/v1/equipment`；映射 type,q,archived,after,limit；`{items,next}` equipment DTO。 |
| equipment_get | 条件，equipment_id 为 canonical UUID | tools/equipment.py:21–24 → GET `astrophoto/v1/equipment/{id}`；单 equipment DTO。 |
| optical_train_list | 条件，query 空、include_archived false、cursor null、limit 50 | tools/equipment.py:26–31 → GET `astrophoto/v1/optical-trains`；train 分页 DTO。 |
| optical_train_get | 条件，train_id 为 canonical UUID | tools/equipment.py:33–36 → GET `astrophoto/v1/optical-trains/{id}`；单 train DTO，当前配置及兼容引用。 |
| optical_train_revision_list | 条件，train_id 为 canonical UUID | tools/equipment.py:38–41 → GET `.../optical-trains/{id}/revisions`；只读兼容 revision 集合 `{items}`，无分页 next 要求。 |
| optical_train_revision_get | 条件，train_id、revision_id 为 canonical UUID | tools/equipment.py:43–47 → GET `.../optical-trains/{id}/revisions/{revision_id}`；只读历史 revision detail 快照 DTO。 |
| Skill Provider | 条件接线，当前零个生产 Skill | server.py:26–31 仅包内 skills/**/SKILL.md 存在时加入目录 Provider；无效 Skill 构建会使工厂失败。工作区 .agents、用户目录不参与发现。 |
| 规划能力 | 规划，未注册或未实施的业务能力 | 无 Siril/资产写入/Canvas/通用节点检索/Workflow/Knowledge/Memory/Experiment 工具，也无跨包版本握手。Extension 中已存在 Siril 业务处理并不改变 MCP 工具清单。 |

Extension 原生 `GET /astrophoto/v1/status` 由 astrophoto/api/routes.py:12–36 与 api/status.py 持有；其 HTTP 业务契约用 `api_version: "v1"`，旧 `api_schema_version` 名称为规划候选。目前诊断仅读取两项宿主公共端点；不据此推断业务路由、SQLite、Siril、知识或记忆可用。astrophoto/core/capabilities.py:4–39 在运行条件下覆盖真实 storage、database、assets、equipment、optical_trains、software、processing；长期 knowledge、memory、experiments、canvas_bridge 保持未实施。Host 加载和真实授权须按目标进程验证。

## 输入、防护与协议测试

| 检查项 | 守卫、可见结果及状态 | 源码和断言 |
| --- | --- | --- |
| 地址配置 | URL 优先级 CLI > COMFYUI_URL > 默认 `http://127.0.0.1:8188`。拒绝缺少 scheme/host、空字符串或内部空白、反斜线、query、fragment、userinfo、非法端口、非 HTTP(S)。前后空白 trim。CLI 无效以 argparse code 2，stdout 空，stderr 有原因。 | config.py:7–27、__main__.py:17–20；mcp/tests/test_config.py:10–61 覆盖空 env、CLI 覆盖、IPv6、代理 path、CLI 配置成功/拒绝。 |
| 只读授权 | 设备工具发现需 43–256 个 ASCII 字母数字或 -_ 的 token，URL host 为 loopback IP 且 path 根；localhost 字符串、反代路径、非回环和无/坏 token 降级到默认两工具。客户端 trust_env=False、follow_redirects=False。服务端另要求启用可信单用户 loopback、无 CORS/转发，remote、Host、Origin 同源规则通过；Bearer 只允许 GET、且拒绝携浏览器 Origin/Sec-Fetch-Site，constant-time compare。浏览器分支要求 same-origin Fetch Metadata + X-AstroPhoto-Local:1；该 header 自身不提供本地进程身份隔离。 | server.py:23–25、api/equipment.py:14–23,76–82；astrophoto/api/security.py:18–64 与 storage.py:107–128。mcp/tests/test_equipment.py:21–89 检查请求 method、Bearer、不注入浏览器 header、降级/302/错误脱敏/stdio 列举；tests/integration/test_equipment_api.py 为独立 aiohttp 授权边界。 |
| 输入校验 | UUID 必须规范小写且 36 字符；query 最多 120；page size 1–100；cursor canonical UUID；归档布尔转 all/false，类型由 schema 枚举。失败 ToolError INVALID_REQUEST，调用不进入后端。 | api/equipment.py:26–41、tools/equipment.py:9–47；mcp/tests/test_equipment.py:21–41 有 camera/all 与必需字段断言，所有边界未逐一覆盖。 |
| 设备 HTTP 与 DTO | 每请求 HTTPX AsyncClient 运行后关闭，10s timeout。状态错误只保留清洗后的 ASCII 码至多 80 字符和 HTTP 状态；TIMEOUT、NETWORK_ERROR、INVALID_RESPONSE 可区分。集合 items/list、分页 next、主要类型/id/row_version、train status/has_draft、revision 正整数、detail snapshot_version 1 与 train_id 相符以及 camera/primary_optics dict、accessories/filters list 经过浅层验证。 | api/equipment.py:44–67,76–116；mcp/tests/test_equipment.py:56–76 的 403/404/500/503、redirect、timeout、坏 JSON、坏 DTO 断言 error 和 token 不泄露。没有独立成功 equipment_get 或四个光路 Tool 调用断言；后四项仅枚举。响应大小/递归 DTO 验证/重试在已读链路未找到。 |
| 诊断 HTTP | two GET 各 raise_for_status，验证两个 JSON object 和 system object，HTTP/timeout/坏形状错误传到 MCP error；async context 退出。诊断所配任意 HTTP(S) URL 与设备的授权目标不同；诊断客户端未显式禁用环境代理。 | client.py:9–14 和 api/comfy.py:6–22；mcp/tests/test_client.py:9–62、test_server.py:44–79 分别覆盖 Proxy 前缀、空节点、404/500/503、连接和读取超时、非 JSON、system 非 object、错误文本无 structuredContent。 |
| 注册与协议 | FastMCP 重复工具名失败；包内没有技能时不挂 Provider；坏 frontmatter 不能启动。CLI stdio 禁 banner，实际协议 stdout 保持 NDJSON，进程失败/结束测试有 cleanup。 | server.py:16–31；mcp/tests/test_server.py:20–41,82–150 覆盖 auto/legacy 两模式、schema fixture、空资源、重复、坏 Skill、真实 stdio，test_version.py:10–22 覆盖 CLI 和结构/文本；test_equipment.py:79–89 的真 stdio 只完成条件工具枚举和 version。 |

## Schema 与返回兼容性

升级前从真实 SDK 1.30 Server 捕获的 Schema 保存于
`mcp/tests/fixtures/status_contract.json`，内存协议测试与之比较：

- `version` 保持 `{name, version}`、原 string-valued dict 输出 Schema，以及相同内容的 JSON text / structuredContent。
- `connection_status` 保持原字段、JSON text 响应、无 outputSchema、无 structuredContent；使用 `ToolResult(content=...)` 避免新版自动增加结构化输出。
- 输入仍为无参数对象。FastMCP 4.2 默认移除原参数 Schema 的 title 并增加 `additionalProperties: false`；这是明确记录的输入 Schema 差异，已有 `{}` 调用不变。
- JSON 文本的空白格式由框架决定，不作为契约；错误保持 MCP error，不改成成功返回的错误字典。
- Client 结果使用新版 `is_error`、`structured_content` 等字段；这是客户端 SDK Python API 的变化，MCP wire 字段仍由框架处理。

运行和分发见 [开发](../../core/development.md) 与 [发行](../../core/release.md)。真实回环授权需同时满足服务器和客户端条件。历史真实宿主及当前替身测试边界见 [验证](../../core/verification.md)。

## 关键实现摘录：mcp/src/astrophoto_mcp/server.py

```python
def create_server(base_url: str | None = None, *, transport: httpx.AsyncBaseTransport | None = None) -> FastMCP:
    server = FastMCP("ComfyUI AstroPhoto", version=__version__, on_duplicate="error")
    url = resolve_comfy_url(base_url)
    register_status(server, url, transport=transport)
    token = credential(os.environ.get("ASTROPHOTO_EQUIPMENT_READ_TOKEN", ""))
    if token and direct_url(url):
        register_equipment_tools(server, EquipmentHTTP(url, token, transport))
    # Only package-owned business skills can be served. Never discover .agents/
    # or user home directories. The official provider validates each skill and
    # fails startup for invalid content; no skills ship in v0.0.1.
    if SKILLS_DIRECTORY.is_dir() and any(SKILLS_DIRECTORY.rglob("SKILL.md")):
        server.add_provider(SkillsDirectoryProvider(SKILLS_DIRECTORY))
    return server
```

## 测试用例与断言定位

以下按维护中的测试文件列出用例和实际断言摘录。断言可能位于参数化用例的多个分支；执行环境和通过数见 [验证](../../core/verification.md)。

### mcp/tests/test_client.py

- `test_diagnostics_public_api`（9 行）。断言摘录。`paths == ['/prefix/system_stats', '/prefix/object_info/vue-basic']`；`result == {'reachable': True, 'extension_registered': True, 'system': {'comfyui_version': 'test'}}`
- `test_absent_extension_and_http_error`（22 行）。断言摘录。`result['extension_registered'] is False`；`pytest.raises(httpx.HTTPStatusError)`
- `test_http_errors_at_either_endpoint`（31 行）。断言摘录。`pytest.raises(httpx.HTTPStatusError)`；`exc.value.response.status_code == status`
- `test_transport_errors_and_timeout_configuration`（41 行）。断言摘录。`set(request.extensions['timeout'].values()) == {10.0}`；`pytest.raises(error_type)`
- `test_invalid_json_response`（52 行）。断言摘录。`pytest.raises(ValueError)`
- `test_invalid_system_shape`（60 行）。断言摘录。`pytest.raises(ValueError, match='system_stats.system')`

### mcp/tests/test_config.py

- `test_url_precedence`（10 行）。断言摘录。`resolve_comfy_url() == DEFAULT_COMFY_URL + '/'`；`resolve_comfy_url() == 'https://env.test/proxy/'`；`resolve_comfy_url('http://cli.test/root/') == 'http://cli.test/root/'`；`resolve_comfy_url('http://cli.test') == 'http://cli.test/'`
- `test_invalid_urls`（23 行）。断言摘录。`pytest.raises(ValueError)`
- `test_empty_environment_is_not_silently_ignored`（28 行）。断言摘录。`pytest.raises(ValueError)`
- `test_ipv6_and_proxy_path`（34 行）。断言摘录。`resolve_comfy_url(' http://[::1]:8188/proxy/comfy ') == 'http://[::1]:8188/proxy/comfy/'`
- `test_cli_passes_resolved_url_to_stdio`（39 行）。断言摘录。`calls == ['http://cli.test/path/' if explicit else 'http://env.test/proxy/', {'transport': 'stdio', 'show_banner': False}]`
- `test_cli_invalid_url_is_argparse_error`（54 行）。断言摘录。`pytest.raises(SystemExit)`；`exc.value.code == 2`；`output.out == ''`；`'ComfyUI URL' in output.err`

### mcp/tests/test_equipment.py

- `test_read_tools_schema_permissions_and_adapter`（21 行）。断言摘录。`request.headers['Authorization'] == 'Bearer ' + TOKEN`；`'X-AstroPhoto-Local' not in request.headers and request.method == 'GET'`；`request.url.path == '/astrophoto/v1/equipment'`；`request.url.params['type'] == 'camera' and request.url.params['archived'] == 'all'`
- `test_missing_credential_or_nondirect_host_keeps_diagnostics`（46 行）。断言摘录。`{tool.name for tool in await client.list_tools()} == {'version', 'connection_status'}`
- `test_invalid_or_denied_backend_is_mcp_error`（57 行）。断言摘录。`result.is_error and TOKEN not in result.content[0].text`
- `test_opted_in_stdio_lists_read_only_tools`（79 行）。断言摘录。`{tool.name for tool in await client.list_tools()} == EXPECTED | {'version', 'connection_status'}`；`not result.is_error`

### mcp/tests/test_server.py

- `test_registered_tool_schemas`（20 行）。断言摘录。`{tool.name for tool in tools} == set(original)`；`tool.input_schema == expected`；`tool.output_schema == original[tool.name]['outputSchema']`；`await client.list_resources() == []`
- `test_duplicate_registration_fails`（39 行）。断言摘录。`pytest.raises(ValueError)`
- `test_in_memory_status_contract`（44 行）。断言摘录。`not result.is_error`；`result.structured_content is None`；`json.loads(result.content[0].text) == {'reachable': True, 'extension_registered': True, 'system': {'os': 'test'}}`
- `test_diagnostic_failures_are_mcp_errors`（62 行）。断言摘录。`result.is_error`；`result.structured_content is None`
- `test_invalid_packaged_skill_fails_startup`（82 行）。断言摘录。`pytest.raises(ValueError)`
- `test_stdio_initialize_list_and_call`（93 行）。断言摘录。`initialized.server_info.name == 'ComfyUI AstroPhoto'`；`{tool.name for tool in tools} == {'version', 'connection_status'}`；`not result.is_error`；`json.loads(result.content[0].text)['version'] == __version__`
- `test_stdio_stdout_contains_only_protocol_json`（108 行）。断言摘录。`line`；`message['jsonrpc'] == '2.0'`；`'error' not in message`；`(await response(1))['serverInfo']['name'] == 'ComfyUI AstroPhoto'`

### mcp/tests/test_version.py

- `test_module_cli_version`（10 行）。断言摘录。`result.stdout.strip() == __version__`
- `test_version_tool_reports_installed_package`（15 行）。断言摘录。`result.structured_content == {'name': 'astrophoto-mcp', 'version': __version__}`；`result.data == result.structured_content`；`json.loads(result.content[0].text) == result.structured_content`

<a id="mcp-source-index"></a>

## MCP 文件地图 · 源码、打包、测试与夹具

覆盖 **21 个文件**。文件名后的职责和子节点一起阅读。L 为该文件中的工作树行号；变量赋值和读取穿插在对应执行步骤中。

项目内导入记录可定位到仓库文件的依赖。分支下列出满足条件时的操作；函数和回调随调用而执行。提前返回、跳过、抛错、捕获和清理就地标注。依赖抛出的异常沿调用栈传递，遇到捕获分支后按该分支处理。省略号代表较长的表达式摘录。测试断言属于静态核对。

````text
└── mcp/ — 独立打包的 MCP 服务、文档和测试。
    ├── LICENSE — MCP 包使用的 GPL-3.0 许可证全文。
    ├── README.md — 说明独立 MCP 服务的安装、配置、只读工具、权限、测试和打包。
    ├── pyproject.toml — 定义 MCP 包版本、Python 与依赖要求、CLI 入口和构建测试配置。
    │   └── 配置与默认值
    │       ├── build-system
    │       │   ├── requires ← ['hatchling>=1.27,<2']
    │       │   └── build-backend ← hatchling.build
    │       ├── project
    │       │   ├── name ← astrophoto-mcp
    │       │   ├── version ← 0.0.1
    │       │   ├── description ← Standalone MCP interface for ComfyUI AstroPhoto
    │       │   ├── readme ← README.md
    │       │   ├── requires-python ← >=3.11
    │       │   ├── license ← GPL-3.0-only
    │       │   ├── dependencies ← ['fastmcp==4.2.0', 'httpx>=0.28,<1']
    │       │   ├── scripts ← {'astrophoto-mcp': 'astrophoto_mcp.__main__:main'}
    │       │   └── urls ← {'Repository': 'https://github.com/MaojieXu/ComfyUI-AstroPhoto'}
    │       ├── dependency-groups
    │       │   └── dev ← ['pytest>=8,<9']
    │       └── tool
    │           ├── pytest ← {'ini_options': {'minversion': '8.0', 'testpaths': ['tests'], 'addopts': '--import-mode=importlib -p mcp'}}
    │           └── hatch ← {'build': {'targets': {'wheel': {'packages': ['src/astrophoto_mcp']}, 'sdist': {'include': ['/src', '/tests', '/README.md', '/pyproject.toml', '/LICENSE']}}}}
    ├── src/ — MCP Python 包源码根目录。
    │   └── astrophoto_mcp/ — 独立 FastMCP 服务、配置、客户端及领域工具。
    │       ├── __init__.py — 独立 MCP 包标识，不导入 ComfyUI 或扩展。
    │       │   ├── __version__ ← version('astrophoto-mcp') [L5]
    │       │   └── 相关测试（直接导入本文件；断言见对应测试节点）
    │       │       ├── mcp/tests/test_server.py
    │       │       └── mcp/tests/test_version.py
    │       ├── __main__.py — 解析 CLI 参数并启动标准输入输出 MCP 服务，保留 stdout 给协议。
    │       │   ├── 跨函数行为
    │       │   │   └── main() 先由 argparse 处理版本和参数，校验通过后才导入服务工厂并打开 stdio。URL 无效时 parser.error() 写 stderr 并退出 2，跳过工厂导入和启动。
    │       │   ├── 项目内导入
    │       │   │   ├── __version__ ← mcp/src/astrophoto_mcp/__init__.py（L5），用于 parser.add_argument("--version", action="version", version=__version__)
    │       │   │   ├── resolve_comfy_url ← mcp/src/astrophoto_mcp/config.py（L6），用于 base_url = resolve_comfy_url(args.comfy_url)
    │       │   │   └── create_server ← mcp/src/astrophoto_mcp/server.py（L21），用于 create_server(base_url).run(transport="stdio", show_banner=False)
    │       │   ├── 函数 main() → None [L9]
    │       │   │   ├── parser ← argparse.ArgumentParser(description='ComfyUI AstroPhoto MCP (stdio)')；parser 在 L11、12、16、20 读 [L10]
    │       │   │   ├── 执行 parser.add_argument('--version', action='version', version=__version__) [L11]
    │       │   │   ├── 执行 parser.add_argument('--comfy-url', help='ComfyUI base URL (default: COMFYUI_URL or http://127.0.0.1:8188)') [L12]
    │       │   │   ├── args ← parser.parse_args()；args 在 L18 读 [L16]
    │       │   │   ├── 尝试 [L17]
    │       │   │   │   └── base_url ← resolve_comfy_url(args.comfy_url)；base_url 在 L23 读 [L18]
    │       │   │   ├── 捕获 ValueError → exc [L19]
    │       │   │   │   └── 报告 CLI 参数错误并退出（状态 2）：parser.error(str(exc)) [L20]
    │       │   │   └── 执行 create_server(base_url).run(transport='stdio', show_banner=False) [L23]
    │       │   ├── 若 __name__ == '__main__' [L26]
    │       │   │   └── 执行 main() [L27]
    │       │   └── 测试覆盖
    │       │       └── mcp/tests/test_config.py
    │       │           ├── test_cli_passes_resolved_url_to_stdio：CLI 参数优先，传给服务的传输参数为 stdio 并关闭 banner。
    │       │           └── test_cli_invalid_url_is_argparse_error：断言退出状态 2、stdout 为空、stderr 报 URL 参数错误。
    │       ├── api/ — ComfyUI 与扩展公共 HTTP API 客户端适配。
    │       │   ├── __init__.py — 公开 HTTP API 适配器包。
    │       │   ├── comfy.py — 读取并解释 ComfyUI system_stats 与 vue-basic object_info 诊断接口。
    │       │   │   └── 异步函数 fetch_status(client: httpx.AsyncClient) → dict [L6]
    │       │   │       ├── stats ← await client.get('system_stats')；stats 在 L9、12 读 [L8]
    │       │   │       ├── 执行 stats.raise_for_status() [L9]
    │       │   │       ├── info ← await client.get('object_info/vue-basic')；info 在 L11、12 读 [L10]
    │       │   │       ├── 执行 info.raise_for_status() [L11]
    │       │   │       ├── (stats_data, node_data) ← (stats.json(), info.json())；stats_data 在 L13、15 读，node_data 在 L13、20 读 [L12]
    │       │   │       ├── 若 not isinstance(stats_data, dict) or not isinstance(node_data, dict) [L13]
    │       │   │       │   └── 抛出 ValueError('ComfyUI diagnostic endpoints must return JSON objects') [L14]
    │       │   │       ├── system ← stats_data.get('system', {})；system 在 L16、21 读 [L15]
    │       │   │       ├── 若 not isinstance(system, dict) [L16]
    │       │   │       │   └── 抛出 ValueError('ComfyUI system_stats.system must be a JSON object') [L17]
    │       │   │       └── 返回 {'reachable': True, 'extension_registered': 'vue-basic' in node_data, 'system': system} [L18]
    │       │   └── equipment.py — 校验回环 URL、令牌、标识和查询，通过只读 HTTP 访问设备接口。
    │       │       ├── 跨函数行为
    │       │       │   └── EquipmentHTTP.get() 仅发 GET，不用环境代理、不跟随重定向；超时、连接失败、HTTP 失败及坏 JSON 分别映射为工具错误。分页场景还要验证 next 存在且为 null 或规范 UUID。
    │       │       ├── 项目内导入
    │       │       │   └── HTTP_TIMEOUT ← mcp/src/astrophoto_mcp/config.py（L9），用于 async with httpx.AsyncClient(base_url=self.base_url, timeout=HTTP_TIMEOUT, transport=self.transport,
    │       │       ├── PREFIX ← 'astrophoto/v1/'；PREFIX 在 L80 读 [L11]
    │       │       ├── 函数 credential(value) [L14]
    │       │       │   └── 返回 value if 43 <= len(value) <= 256 and value.isascii() and all((c.isalnum() or c in '-_' for c in value)) else None [L15]
    │       │       ├── 函数 direct_url(base_url) [L18]
    │       │       │   ├── url ← httpx.URL(base_url)；url 在 L21 读 [L19]
    │       │       │   ├── 尝试 [L20]
    │       │       │   │   └── 返回 ip_address(url.host).is_loopback and url.path == '/' [L21]
    │       │       │   └── 捕获 ValueError [L22]
    │       │       │       └── 提前返回 False [L23]
    │       │       ├── 函数 canonical_id(value) [L26]
    │       │       │   ├── 尝试 [L27]
    │       │       │   │   └── 若 len(value) == 36 and str(UUID(value)) == value [L28]
    │       │       │   │       └── 提前返回 value [L29]
    │       │       │   ├── 捕获 ValueError [L30]
    │       │       │   └── 抛出 ToolError('INVALID_REQUEST: expected a canonical UUID') [L32]
    │       │       ├── 函数 list_params(query, include_archived, cursor, limit, **options) [L35]
    │       │       │   ├── 若 len(query) > 120 or not 1 <= limit <= 100 [L36]
    │       │       │   │   └── 抛出 ToolError('INVALID_REQUEST: query limit is 120 characters and page size is 1–100') [L37]
    │       │       │   ├── result ← {'q': query, 'archived': 'all' if include_archived else 'false', 'limit': str(limit)}；result 在 L40、41 读 [L38]
    │       │       │   ├── 若 cursor is not None [L39]
    │       │       │   │   └── result['after'] ← canonical_id(cursor) [L40]
    │       │       │   └── 返回 result | {key: value for key, value in options.items() if value is not None} [L41]
    │       │       ├── 函数 valid_record(value, kind) [L44]
    │       │       │   ├── 若 not isinstance(value, dict) or not isinstance(value.get('id'), str) [L45]
    │       │       │   │   └── 提前返回 False [L46]
    │       │       │   ├── 尝试 [L47]
    │       │       │   │   └── 执行 canonical_id(value['id']) [L48]
    │       │       │   ├── 捕获 ToolError [L49]
    │       │       │   │   └── 提前返回 False [L50]
    │       │       │   ├── 若 kind == 'equipment' [L51]
    │       │       │   │   └── 提前返回 value.get('equipment_type') in ('camera', 'primary_optics', 'optical_accessory', 'filter') and isinstance(value.get('name'), str) and isinstance(value.get('specs'), dict)… [L52]
    │       │       │   ├── 若 kind == 'train' [L55]
    │       │       │   │   └── 提前返回 value.get('status') in ('draft', 'published', 'archived') and isinstance(value.get('name'), str) and isinstance(value.get('summary'), dict) and (type(value.get('row_versi… [L56]
    │       │       │   ├── 若 type(value.get('revision_number')) is not int or value['revision_number'] < 1 or (not isinstance(value.get('train_id'), str)) [L59]
    │       │       │   │   └── 提前返回 False [L60]
    │       │       │   ├── 若 kind == 'revision_detail' [L61]
    │       │       │   │   ├── snapshot ← value.get('snapshot')；snapshot 在 L63、64、65、66 读 [L62]
    │       │       │   │   └── 提前返回 isinstance(snapshot, dict) and snapshot.get('snapshot_version') == 1 and (snapshot.get('train_id') == value['train_id']) and isinstance(snapshot.get('camera'), dict) and … [L63]
    │       │       │   └── 返回 True [L67]
    │       │       └── 类 EquipmentHTTP [L70]
    │       │           ├── 函数 __init__(self, base_url, token, transport=None) [L71]
    │       │           │   ├── self.base_url ← base_url；self.base_url 在 L77 读 [L72]
    │       │           │   ├── self.token ← token；self.token 在 L80 读 [L73]
    │       │           │   └── self.transport ← transport；self.transport 在 L77 读 [L74]
    │       │           └── 异步函数 get(self, path, kind, *, params=None, collection=False, paged=False) [L76]
    │       │               ├── 进入上下文 httpx.AsyncClient(base_url=self.base_url, timeout=HTTP_TIMEOUT, transport=self.transport, trust_env=False, follow_redirects=False) → client，退出时交由上下文释放资源 [L77]
    │       │               │   ├── 尝试 [L79]
    │       │               │   │   ├── response ← await client.get(PREFIX + path, params=params, headers={'Authorization': f'Bearer {self.token}'})；response 在 L81、85、92、98 读 [L80]
    │       │               │   │   └── 执行 response.raise_for_status() [L81]
    │       │               │   ├── 捕获 httpx.HTTPStatusError → exc [L82]
    │       │               │   │   ├── code ← 'HTTP_ERROR'；code 在 L92 读 [L83]
    │       │               │   │   ├── 尝试 [L84]
    │       │               │   │   │   ├── payload ← response.json()；payload 在 L86、87 读 [L85]
    │       │               │   │   │   └── 若 isinstance(payload, dict) and isinstance(payload.get('error'), dict) [L86]
    │       │               │   │   │       ├── candidate ← payload['error'].get('code')；candidate 在 L88、89 读 [L87]
    │       │               │   │   │       └── 若 isinstance(candidate, str) and candidate.isascii() and candidate.replace('_', '').isalnum() [L88]
    │       │               │   │   │           └── code ← candidate[:80]；code 在 L92 读 [L89]
    │       │               │   │   ├── 捕获 ValueError [L90]
    │       │               │   │   └── 抛出 ToolError(f'{code}: AstroPhoto HTTP {response.status_code}')，保留原异常 exc [L92]
    │       │               │   ├── 捕获 httpx.TimeoutException → exc [L93]
    │       │               │   │   └── 抛出 ToolError('TIMEOUT: AstroPhoto did not respond in time')，保留原异常 exc [L94]
    │       │               │   └── 捕获 httpx.HTTPError → exc [L95]
    │       │               │       └── 抛出 ToolError('NETWORK_ERROR: AstroPhoto could not be reached')，保留原异常 exc [L96]
    │       │               ├── 尝试 [L97]
    │       │               │   └── result ← response.json()；result 在 L102、105、106、108、109 等 7 处 读 [L98]
    │       │               ├── 捕获 ValueError → exc [L99]
    │       │               │   └── 抛出 ToolError('INVALID_RESPONSE: AstroPhoto returned invalid JSON')，保留原异常 exc [L100]
    │       │               ├── 若 collection [L101]
    │       │               │   ├── records ← result.get('items') if isinstance(result, dict) else None；records 在 L103 读 [L102]
    │       │               │   ├── valid ← isinstance(records, list) and all((valid_record(item, kind) for item in records))；valid 在 L105、106、114 读 [L103]
    │       │               │   └── 若 paged [L104]
    │       │               │       ├── valid ← valid and 'next' in result；valid 在 L105、106、114 读 [L105]
    │       │               │       └── 若 valid and result['next'] is not None [L106]
    │       │               │           ├── 尝试 [L107]
    │       │               │           │   ├── 执行 canonical_id(result['next']) if isinstance(result['next'], str) else None [L108]
    │       │               │           │   └── valid ← isinstance(result['next'], str)；valid 在 L105、106、114 读 [L109]
    │       │               │           └── 捕获 ToolError [L110]
    │       │               │               └── valid ← False；valid 在 L105、106、114 读 [L111]
    │       │               ├── 否则 [L101]
    │       │               │   └── valid ← valid_record(result, kind)；valid 在 L105、106、114 读 [L113]
    │       │               ├── 若 not valid [L114]
    │       │               │   └── 抛出 ToolError('INVALID_RESPONSE: AstroPhoto returned an unexpected equipment DTO') [L115]
    │       │               └── 返回 result [L116]
    │       ├── client.py — 建立 HTTPX 客户端并通过 ComfyUI 公共接口诊断连接与扩展注册。
    │       │   ├── 项目内导入
    │       │   │   ├── fetch_status ← mcp/src/astrophoto_mcp/api/comfy.py（L5），用于 return await fetch_status(client)
    │       │   │   ├── HTTP_TIMEOUT ← mcp/src/astrophoto_mcp/config.py（L6），用于 base_url=resolve_comfy_url(base_url), timeout=HTTP_TIMEOUT, transport=transport
    │       │   │   └── resolve_comfy_url ← mcp/src/astrophoto_mcp/config.py（L6），用于 base_url=resolve_comfy_url(base_url), timeout=HTTP_TIMEOUT, transport=transport
    │       │   ├── 异步函数 diagnose(base_url: str, *, transport: httpx.AsyncBaseTransport | None=None) → dict — Probe system stats and the stable node ID without running a workflow. [L9]
    │       │   │   └── 进入上下文 httpx.AsyncClient(base_url=resolve_comfy_url(base_url), timeout=HTTP_TIMEOUT, transport=transport) → client，退出时交由上下文释放资源 [L11]
    │       │   │       └── 返回 await fetch_status(client) [L14]
    │       │   └── 相关测试（直接导入本文件；断言见对应测试节点）
    │       │       └── mcp/tests/test_client.py
    │       ├── config.py — 按 CLI、环境变量、默认值优先级解析并验证 ComfyUI URL。
    │       │   ├── DEFAULT_COMFY_URL ← 'http://127.0.0.1:8188'；DEFAULT_COMFY_URL 在 L13 读 [L7]
    │       │   ├── HTTP_TIMEOUT ← 10.0 [L8]
    │       │   ├── 函数 resolve_comfy_url(cli_url: str | None=None) → str — Select CLI > environment > default; validate and retain a proxy path. [L11]
    │       │   │   ├── raw ← cli_url if cli_url is not None else os.environ.get('COMFYUI_URL', DEFAULT_COMFY_URL)；raw 在 L14、17、20 读 [L13]
    │       │   │   ├── raw ← raw.strip()；raw 在 L14、17、20 读 [L14]
    │       │   │   ├── 若 not raw or any((char.isspace() for char in raw)) or any((char in raw for char in '\\?#')) [L17]
    │       │   │   │   └── 抛出 ValueError('ComfyUI URL must be an HTTP(S) base URL without whitespace, query or fragment') [L18]
    │       │   │   ├── 尝试 [L19]
    │       │   │   │   └── url ← httpx.URL(raw)；url 在 L23、25、27 读 [L20]
    │       │   │   ├── 捕获 (httpx.InvalidURL, ValueError) → exc [L21]
    │       │   │   │   └── 抛出 ValueError('Invalid ComfyUI URL')，保留原异常 exc [L22]
    │       │   │   ├── 若 url.scheme not in {'http', 'https'} or not url.host [L23]
    │       │   │   │   └── 抛出 ValueError('ComfyUI URL requires http:// or https:// and a hostname') [L24]
    │       │   │   ├── 若 url.userinfo or (url.port is not None and (not 1 <= url.port <= 65535)) [L25]
    │       │   │   │   └── 抛出 ValueError('ComfyUI URL must not contain credentials and must use a valid port') [L26]
    │       │   │   └── 返回 str(url).rstrip('/') + '/' [L27]
    │       │   └── 相关测试（直接导入本文件；断言见对应测试节点）
    │       │       └── mcp/tests/test_config.py
    │       ├── server.py — 创建唯一 FastMCP 服务，注册现有工具及校验已打包技能。
    │       │   ├── 跨函数行为
    │       │   │   └── create_server() 先注册诊断工具。凭据有效且目标为直连回环地址时才注册设备只读工具。无包内目录或无 SKILL.md 时跳过 provider；provider 验证失败可使启动失败。
    │       │   ├── 项目内导入
    │       │   │   ├── __version__ ← mcp/src/astrophoto_mcp/__init__.py（L10），用于 server = FastMCP("ComfyUI AstroPhoto", version=__version__, on_duplicate="error")
    │       │   │   ├── EquipmentHTTP ← mcp/src/astrophoto_mcp/api/equipment.py（L11），用于 register_equipment_tools(server, EquipmentHTTP(url, token, transport))
    │       │   │   ├── credential ← mcp/src/astrophoto_mcp/api/equipment.py（L11），用于 token = credential(os.environ.get("ASTROPHOTO_EQUIPMENT_READ_TOKEN", ""))
    │       │   │   ├── direct_url ← mcp/src/astrophoto_mcp/api/equipment.py（L11），用于 if token and direct_url(url):
    │       │   │   ├── resolve_comfy_url ← mcp/src/astrophoto_mcp/config.py（L12），用于 url = resolve_comfy_url(base_url)
    │       │   │   ├── register_equipment_tools ← mcp/src/astrophoto_mcp/tools/equipment.py（L13），用于 register_equipment_tools(server, EquipmentHTTP(url, token, transport))
    │       │   │   └── register_status ← mcp/src/astrophoto_mcp/tools/status.py（L14），用于 register_status(server, url, transport=transport)
    │       │   ├── SKILLS_DIRECTORY ← Path(__file__).with_name('skills')；SKILLS_DIRECTORY 在 L29、30 读 [L16]
    │       │   ├── 函数 create_server(base_url: str | None=None, *, transport: httpx.AsyncBaseTransport | None=None) → FastMCP [L19]
    │       │   │   ├── server ← FastMCP('ComfyUI AstroPhoto', version=__version__, on_duplicate='error')；server 在 L22、25、30、31 读 [L20]
    │       │   │   ├── url ← resolve_comfy_url(base_url)；url 在 L22、24、25 读 [L21]
    │       │   │   ├── 执行 register_status(server, url, transport=transport) [L22]
    │       │   │   ├── token ← credential(os.environ.get('ASTROPHOTO_EQUIPMENT_READ_TOKEN', ''))；token 在 L24、25 读 [L23]
    │       │   │   ├── 若 token and direct_url(url) [L24]
    │       │   │   │   └── 执行 register_equipment_tools(server, EquipmentHTTP(url, token, transport)) [L25]
    │       │   │   ├── 若 SKILLS_DIRECTORY.is_dir() and any(SKILLS_DIRECTORY.rglob('SKILL.md')) [L29]
    │       │   │   │   └── 执行 server.add_provider(SkillsDirectoryProvider(SKILLS_DIRECTORY)) [L30]
    │       │   │   └── 返回 server [L31]
    │       │   └── 测试覆盖
    │       │       └── mcp/tests/test_server.py
    │       │           ├── test_registered_tool_schemas：auto 与 legacy 模式都核对工具集合、输入输出 Schema 和空资源。
    │       │           ├── test_duplicate_registration_fails：重复注册诊断工具抛出 ValueError。
    │       │           ├── test_in_memory_status_contract / test_diagnostic_failures_are_mcp_errors：核对诊断成功结构与六类工具失败。
    │       │           └── test_invalid_packaged_skill_fails_startup：包内 Skill 缺少 frontmatter 时工厂抛出 ValueError。
    │       └── tools/ — MCP 诊断与设备只读工具注册。
    │           ├── __init__.py — MCP 领域工具注册包。
    │           ├── equipment.py — 注册设备、光学链及历史修订的六个只读查询工具。
    │           │   ├── 项目内导入
    │           │   │   ├── EquipmentHTTP ← mcp/src/astrophoto_mcp/api/equipment.py（L7），用于 def register_equipment_tools(server: FastMCP, api: EquipmentHTTP):
    │           │   │   ├── canonical_id ← mcp/src/astrophoto_mcp/api/equipment.py（L7），用于 return await api.get("equipment/" + canonical_id(equipment_id), "equipment") / return await api.get("optical-trains/" + canonical_id(train_id), "train") / return await api.get(f"optical-trains/{canonical_id(train_id)}/revisions", "revision", collection=True) / route = f"optical-trains/{canonical_id(train_id)}/revisions/{canonical_id(revision_id)}"
    │           │   │   └── list_params ← mcp/src/astrophoto_mcp/api/equipment.py（L7），用于 params = list_params(query, include_archived, cursor, limit, type=equipment_type) / params = list_params(query, include_archived, cursor, limit)
    │           │   ├── EquipmentType ← Literal['camera', 'primary_optics', 'optical_accessory', 'filter']；EquipmentType 在 L15 读 [L9]
    │           │   ├── READ ← {'readOnlyHint': True, 'openWorldHint': False}；READ 在 L14、21、26、33、38 等 6 处 读 [L10]
    │           │   └── 函数 register_equipment_tools(server: FastMCP, api: EquipmentHTTP) [L13]
    │           │       ├── 异步函数 equipment_list(equipment_type: EquipmentType | None=None, query: str='', include_archived: bool=False, cursor: str | None=None, limit: int=50) → dict — List the user's AstroPhoto equipment by category, name, manufacturer or model. [L15]
    │           │       │   ├── params ← list_params(query, include_archived, cursor, limit, type=equipment_type)；params 在 L19 读 [L18]
    │           │       │   └── 返回 await api.get('equipment', 'equipment', params=params, collection=True, paged=True) [L19]
    │           │       ├── 异步函数 equipment_get(equipment_id: str) → dict — Read typed specifications and optical-train references for one device. [L22]
    │           │       │   └── 返回 await api.get('equipment/' + canonical_id(equipment_id), 'equipment') [L24]
    │           │       ├── 异步函数 optical_train_list(query: str='', include_archived: bool=False, cursor: str | None=None, limit: int=50) → dict — List saved optical trains, their equipment summaries and default revisions. [L27]
    │           │       │   ├── params ← list_params(query, include_archived, cursor, limit)；params 在 L31 读 [L30]
    │           │       │   └── 返回 await api.get('optical-trains', 'train', params=params, collection=True, paged=True) [L31]
    │           │       ├── 异步函数 optical_train_get(train_id: str) → dict — Read a saved optical train, including its current editable draft and default revision. [L34]
    │           │       │   └── 返回 await api.get('optical-trains/' + canonical_id(train_id), 'train') [L36]
    │           │       ├── 异步函数 optical_train_revision_list(train_id: str) → dict — List published revision identifiers, timestamps and change notes for one optical train. [L39]
    │           │       │   └── 返回 await api.get(f'optical-trains/{canonical_id(train_id)}/revisions', 'revision', collection=True) [L41]
    │           │       └── 异步函数 optical_train_revision_get(train_id: str, revision_id: str) → dict — Read an immutable published optical configuration and its equipment specifications. [L44]
    │           │           ├── route ← f'optical-trains/{canonical_id(train_id)}/revisions/{canonical_id(revision_id)}'；route 在 L47 读 [L46]
    │           │           └── 返回 await api.get(route, 'revision_detail') [L47]
    │           └── status.py — 注册版本与连接状态诊断工具。
    │               ├── 项目内导入
    │               │   ├── __version__ ← mcp/src/astrophoto_mcp/__init__.py（L7），用于 return {"name": "astrophoto-mcp", "version": __version__}
    │               │   └── diagnose ← mcp/src/astrophoto_mcp/client.py（L8），用于 return ToolResult(content=await diagnose(base_url, transport=transport))
    │               ├── 函数 register_status(mcp: FastMCP, base_url: str, *, transport: httpx.AsyncBaseTransport | None=None) → None [L11]
    │               │   ├── 函数 version() → dict[str, str] — Return the installed MCP package version (not the remote extension version). [L15]
    │               │   │   └── 返回 {'name': 'astrophoto-mcp', 'version': __version__} [L17]
    │               │   └── 异步函数 connection_status() → ToolResult — Check the configured ComfyUI HTTP endpoint and vue-basic registration. [L20]
    │               │       └── 返回 ToolResult(content=await diagnose(base_url, transport=transport)) [L24]
    │               └── 相关测试（直接导入本文件；断言见对应测试节点）
    │                   └── mcp/tests/test_server.py
    └── tests/ — MCP 客户端、配置、协议、设备与版本测试。
        ├── conftest.py — 提供测试使用的 FastMCP 服务 fixture。
        │   ├── 项目内导入
        │   │   └── create_server ← mcp/src/astrophoto_mcp/server.py（L3），用于 return create_server("http://127.0.0.1:1")
        │   └── 函数 server() [L7]
        │       └── 返回 create_server('http://127.0.0.1:1') [L9]
        ├── fixtures/ — MCP 测试的固定契约数据。
        │   └── status_contract.json — 固定版本和连接状态工具的输入输出 JSON Schema 期望值。
        │       └── 配置或夹具字段
        │           ├── version
        │           │   ├── inputSchema ← {"properties": {}, "title": "versionArguments", "type": "object"}
        │           │   └── outputSchema ← {"additionalProperties": {"type": "string"}, "title": "versionDictOutput", "type": "object"}
        │           └── connection_status
        │               ├── inputSchema ← {"properties": {}, "title": "connection_statusArguments", "type": "object"}
        │               └── outputSchema ← null
        ├── test_client.py — 测试诊断端点路径、扩展缺席、HTTP 和传输错误、超时与无效 JSON 或系统结构。
        │   ├── 项目内导入
        │   │   └── diagnose ← mcp/src/astrophoto_mcp/client.py（L6），用于 result = asyncio.run(diagnose("http://comfy.test/prefix", transport=httpx.MockTransport(handler))) / result = asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(lambda _: httpx.Response(200, json={})))) / asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(lambda _: httpx.Response(503)))) / asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(handler)))
        │   ├── 函数 test_diagnostics_public_api() [L9]
        │   │   ├── paths ← []；paths 在 L13、18 读 [L10]
        │   │   ├── 函数 handler(request) [L12]
        │   │   │   ├── 执行 paths.append(request.url.path) [L13]
        │   │   │   ├── data ← {'system': {'comfyui_version': 'test'}} if request.url.path.endswith('system_stats') else {'vue-basic': {}}；data 在 L15 读 [L14]
        │   │   │   └── 返回 httpx.Response(200, json=data) [L15]
        │   │   ├── result ← asyncio.run(diagnose('http://comfy.test/prefix', transport=httpx.MockTransport(handler)))；result 在 L19 读 [L17]
        │   │   ├── 断言 paths == ['/prefix/system_stats', '/prefix/object_info/vue-basic']，失败抛出 AssertionError [L18]
        │   │   └── 断言 result == {'reachable': True, 'extension_registered': True, 'system': {'comfyui_version': 'test'}}，失败抛出 AssertionError [L19]
        │   ├── 函数 test_absent_extension_and_http_error() [L22]
        │   │   ├── result ← asyncio.run(diagnose('http://comfy.test', transport=httpx.MockTransport(lambda _: httpx.Response(200, json={}))))；result 在 L24 读 [L23]
        │   │   ├── 断言 result['extension_registered'] is False，失败抛出 AssertionError [L24]
        │   │   └── 进入上下文 pytest.raises(httpx.HTTPStatusError)，退出时交由上下文释放资源 [L25]
        │   │       └── 执行 asyncio.run(diagnose('http://comfy.test', transport=httpx.MockTransport(lambda _: httpx.Response(503)))) [L26]
        │   ├── 函数 test_http_errors_at_either_endpoint(endpoint, status) [L31]
        │   │   ├── 函数 handler(request) [L32]
        │   │   │   └── 返回 httpx.Response(status if request.url.path == '/' + endpoint else 200, json={}) [L33]
        │   │   ├── 进入上下文 pytest.raises(httpx.HTTPStatusError) → exc，退出时交由上下文释放资源 [L35]
        │   │   │   └── 执行 asyncio.run(diagnose('http://comfy.test', transport=httpx.MockTransport(handler))) [L36]
        │   │   └── 断言 exc.value.response.status_code == status，失败抛出 AssertionError [L37]
        │   ├── 函数 test_transport_errors_and_timeout_configuration(error_type) [L41]
        │   │   ├── 函数 handler(request) [L42]
        │   │   │   ├── 断言 set(request.extensions['timeout'].values()) == {10.0}，失败抛出 AssertionError [L43]
        │   │   │   └── 抛出 error_type('test failure', request=request) [L44]
        │   │   └── 进入上下文 pytest.raises(error_type)，退出时交由上下文释放资源 [L46]
        │   │       └── 执行 asyncio.run(diagnose('http://comfy.test', transport=httpx.MockTransport(handler))) [L47]
        │   ├── 函数 test_invalid_json_response(endpoint, bad_body) [L52]
        │   │   ├── 函数 handler(request) [L53]
        │   │   │   └── 返回 httpx.Response(200, content=bad_body if request.url.path == '/' + endpoint else b'{}') [L54]
        │   │   └── 进入上下文 pytest.raises(ValueError)，退出时交由上下文释放资源 [L56]
        │   │       └── 执行 asyncio.run(diagnose('http://comfy.test', transport=httpx.MockTransport(handler))) [L57]
        │   ├── 函数 test_invalid_system_shape() [L60]
        │   │   └── 进入上下文 pytest.raises(ValueError, match='system_stats.system')，退出时交由上下文释放资源 [L61]
        │   │       └── 执行 asyncio.run(diagnose('http://comfy.test', transport=httpx.MockTransport(lambda _: httpx.Response(200, json={'system': []})))) [L62]
        │   └── 测试覆盖（本文件的用例与断言）
        │       ├── test_diagnostics_public_api（9 行） → paths == ['/prefix/system_stats', '/prefix/object_info/vue-basic']，result == {'reachable': True, 'extension_registered': True, 'system': {'comfyui_version': 'test'}}
        │       ├── test_absent_extension_and_http_error（22 行） → result['extension_registered'] is False，pytest.raises(httpx.HTTPStatusError)
        │       ├── test_http_errors_at_either_endpoint（31 行） → pytest.raises(httpx.HTTPStatusError)，exc.value.response.status_code == status
        │       ├── test_transport_errors_and_timeout_configuration（41 行） → set(request.extensions['timeout'].values()) == {10.0}，pytest.raises(error_type)
        │       ├── test_invalid_json_response（52 行） → pytest.raises(ValueError)
        │       └── test_invalid_system_shape（60 行） → pytest.raises(ValueError, match='system_stats.system')
        ├── test_config.py — 测试 URL 配置优先级、非法和空值、IPv6、代理前缀以及 CLI 参数处理。
        │   ├── 项目内导入
        │   │   ├── DEFAULT_COMFY_URL ← mcp/src/astrophoto_mcp/config.py（L6），用于 assert resolve_comfy_url() == DEFAULT_COMFY_URL + "/"
        │   │   ├── resolve_comfy_url ← mcp/src/astrophoto_mcp/config.py（L6），用于 assert resolve_comfy_url() == DEFAULT_COMFY_URL + "/" / assert resolve_comfy_url() == "https://env.test/proxy/" / assert resolve_comfy_url("http://cli.test/root/") == "http://cli.test/root/" / assert resolve_comfy_url("http://cli.test") == "http://cli.test/"
        │   │   └── main ← mcp/src/astrophoto_mcp/__main__.py（L7），用于 main()
        │   ├── 函数 test_url_precedence(monkeypatch) [L10]
        │   │   ├── 执行 monkeypatch.delenv('COMFYUI_URL', raising=False) [L11]
        │   │   ├── 断言 resolve_comfy_url() == DEFAULT_COMFY_URL + '/'，失败抛出 AssertionError [L12]
        │   │   ├── 执行 monkeypatch.setenv('COMFYUI_URL', 'https://env.test/proxy') [L13]
        │   │   ├── 断言 resolve_comfy_url() == 'https://env.test/proxy/'，失败抛出 AssertionError [L14]
        │   │   ├── 断言 resolve_comfy_url('http://cli.test/root/') == 'http://cli.test/root/'，失败抛出 AssertionError [L15]
        │   │   ├── 执行 monkeypatch.setenv('COMFYUI_URL', 'invalid') [L16]
        │   │   └── 断言 resolve_comfy_url('http://cli.test') == 'http://cli.test/'，失败抛出 AssertionError [L17]
        │   ├── 函数 test_invalid_urls(url) [L23]
        │   │   └── 进入上下文 pytest.raises(ValueError)，退出时交由上下文释放资源 [L24]
        │   │       └── 执行 resolve_comfy_url(url) [L25]
        │   ├── 函数 test_empty_environment_is_not_silently_ignored(monkeypatch) [L28]
        │   │   ├── 执行 monkeypatch.setenv('COMFYUI_URL', '') [L29]
        │   │   └── 进入上下文 pytest.raises(ValueError)，退出时交由上下文释放资源 [L30]
        │   │       └── 执行 resolve_comfy_url() [L31]
        │   ├── 函数 test_ipv6_and_proxy_path() [L34]
        │   │   └── 断言 resolve_comfy_url(' http://[::1]:8188/proxy/comfy ') == 'http://[::1]:8188/proxy/comfy/'，失败抛出 AssertionError [L35]
        │   ├── 函数 test_cli_passes_resolved_url_to_stdio(monkeypatch, explicit) [L39]
        │   │   ├── calls ← []；calls 在 L45、46、50 读 [L40]
        │   │   ├── 执行 monkeypatch.setenv('COMFYUI_URL', 'http://env.test/proxy') [L41]
        │   │   ├── 执行 monkeypatch.setattr(sys, 'argv', ['astrophoto-mcp'] + (['--comfy-url', 'http://cli.test/path'] if explicit else [])) [L42]
        │   │   ├── 函数 factory(url) [L44]
        │   │   │   ├── 执行 calls.append(url) [L45]
        │   │   │   └── 返回 SimpleNamespace(run=lambda **kwargs: calls.append(kwargs)) [L46]
        │   │   ├── 执行 monkeypatch.setattr('astrophoto_mcp.server.create_server', factory) [L48]
        │   │   ├── 执行 main() [L49]
        │   │   └── 断言 calls == ['http://cli.test/path/' if explicit else 'http://env.test/proxy/', {'transport': 'stdio', 'show_banner': False}]，失败抛出 AssertionError [L50]
        │   ├── 函数 test_cli_invalid_url_is_argparse_error(monkeypatch, capsys) [L54]
        │   │   ├── 执行 monkeypatch.setattr(sys, 'argv', ['astrophoto-mcp', '--comfy-url', 'ftp://bad']) [L55]
        │   │   ├── 进入上下文 pytest.raises(SystemExit) → exc，退出时交由上下文释放资源 [L56]
        │   │   │   └── 执行 main() [L57]
        │   │   ├── 断言 exc.value.code == 2，失败抛出 AssertionError [L58]
        │   │   ├── output ← capsys.readouterr()；output 在 L60、61 读 [L59]
        │   │   ├── 断言 output.out == ''，失败抛出 AssertionError [L60]
        │   │   └── 断言 'ComfyUI URL' in output.err，失败抛出 AssertionError [L61]
        │   └── 测试覆盖（本文件的用例与断言）
        │       ├── test_url_precedence（10 行） → resolve_comfy_url() == DEFAULT_COMFY_URL + '/'，resolve_comfy_url() == 'https://env.test/proxy/'，resolve_comfy_url('http://cli.test/root/') == 'http://cli.test/root/'，resolve_comfy_url('http://cli.test') == 'http://cli.test/'
        │       ├── test_invalid_urls（23 行） → pytest.raises(ValueError)
        │       ├── test_empty_environment_is_not_silently_ignored（28 行） → pytest.raises(ValueError)
        │       ├── test_ipv6_and_proxy_path（34 行） → resolve_comfy_url(' http://[::1]:8188/proxy/comfy ') == 'http://[::1]:8188/proxy/comfy/'
        │       ├── test_cli_passes_resolved_url_to_stdio（39 行） → calls == ['http://cli.test/path/' if explicit else 'http://env.test/proxy/', {'transport': 'stdio', 'show_banner': False}]
        │       └── test_cli_invalid_url_is_argparse_error（54 行） → pytest.raises(SystemExit)，exc.value.code == 2，output.out == ''，'ComfyUI URL' in output.err
        ├── test_equipment.py — 测试只读设备工具注册、令牌和回环限制、后端错误及 stdio 工具列表。
        │   ├── 项目内导入
        │   │   └── create_server ← mcp/src/astrophoto_mcp/server.py（L11），用于 async with Client(create_server(URL, transport=httpx.MockTransport(mock))) as client: / async with Client(create_server(url)) as client:
        │   ├── URL ← 'http://127.0.0.1:8188'；URL 在 L32、45、72、82 读 [L13]
        │   ├── TOKEN ← 'test-only-' + 'a' * 45；TOKEN 在 L22、25、44、45、58 等 7 处 读 [L14]
        │   ├── ID ← '11111111-1111-4111-8111-111111111111'；ID 在 L16、73 读 [L15]
        │   ├── EQUIPMENT ← {'id': ID, 'equipment_type': 'camera', 'name': 'Camera', 'row_version': 1, 'specs': {}}；EQUIPMENT 在 L29、39 读 [L16]
        │   ├── EXPECTED ← {'equipment_list', 'equipment_get', 'optical_train_list', 'optical_train_get', 'optical_train_revision_list', 'optical_train_revision_get'}；EXPECTED 在 L34、85 读 [L17]
        │   ├── 函数 test_read_tools_schema_permissions_and_adapter(monkeypatch) [L21]
        │   │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_EQUIPMENT_READ_TOKEN', TOKEN) [L22]
        │   │   ├── 函数 mock(request) [L24]
        │   │   │   ├── 断言 request.headers['Authorization'] == 'Bearer ' + TOKEN，失败抛出 AssertionError [L25]
        │   │   │   ├── 断言 'X-AstroPhoto-Local' not in request.headers and request.method == 'GET'，失败抛出 AssertionError [L26]
        │   │   │   ├── 断言 request.url.path == '/astrophoto/v1/equipment'，失败抛出 AssertionError [L27]
        │   │   │   ├── 断言 request.url.params['type'] == 'camera' and request.url.params['archived'] == 'all'，失败抛出 AssertionError [L28]
        │   │   │   └── 返回 httpx.Response(200, json={'items': [EQUIPMENT], 'next': None}) [L29]
        │   │   ├── 异步函数 exercise() [L31]
        │   │   │   └── 进入上下文 Client(create_server(URL, transport=httpx.MockTransport(mock))) → client，退出时交由上下文释放资源 [L32]
        │   │   │       ├── tools ← {tool.name: tool for tool in await client.list_tools()}；tools 在 L34、35、36 读 [L33]
        │   │   │       ├── 断言 set(tools) == EXPECTED | {'version', 'connection_status'}，失败抛出 AssertionError [L34]
        │   │   │       ├── 断言 tools['equipment_get'].input_schema['required'] == ['equipment_id']，失败抛出 AssertionError [L35]
        │   │   │       ├── 断言 tools['equipment_get'].annotations.read_only_hint，失败抛出 AssertionError [L36]
        │   │   │       ├── result ← await client.call_tool('equipment_list', {'equipment_type': 'camera', 'include_archived': True})；result 在 L38、39 读 [L37]
        │   │   │       ├── 断言 not result.is_error，失败抛出 AssertionError [L38]
        │   │   │       └── 断言 json.loads(result.content[0].text)['items'] == [EQUIPMENT]，失败抛出 AssertionError [L39]
        │   │   └── 执行 asyncio.run(exercise()) [L41]
        │   ├── 函数 test_missing_credential_or_nondirect_host_keeps_diagnostics(monkeypatch, url, token) [L46]
        │   │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_EQUIPMENT_READ_TOKEN', token) [L47]
        │   │   ├── 异步函数 exercise() [L49]
        │   │   │   └── 进入上下文 Client(create_server(url)) → client，退出时交由上下文释放资源 [L50]
        │   │   │       └── 断言 {tool.name for tool in await client.list_tools()} == {'version', 'connection_status'}，失败抛出 AssertionError [L51]
        │   │   └── 执行 asyncio.run(exercise()) [L53]
        │   ├── 函数 test_invalid_or_denied_backend_is_mcp_error(monkeypatch, failure) [L57]
        │   │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_EQUIPMENT_READ_TOKEN', TOKEN) [L58]
        │   │   ├── 函数 mock(request) [L60]
        │   │   │   ├── 若 failure == 'timeout' [L61]
        │   │   │   │   └── 抛出 httpx.ReadTimeout('timeout', request=request) [L62]
        │   │   │   ├── 若 failure == 'bad-json' [L63]
        │   │   │   │   └── 提前返回 httpx.Response(200, text='bad') [L64]
        │   │   │   ├── 若 failure == 'bad-shape' [L65]
        │   │   │   │   └── 提前返回 httpx.Response(200, json={'items': []}) [L66]
        │   │   │   ├── 若 failure == 'redirect' [L67]
        │   │   │   │   └── 提前返回 httpx.Response(302, headers={'Location': 'https://example.invalid'}) [L68]
        │   │   │   └── 返回 httpx.Response(int(failure), json={'error': {'code': 'TEST_ERROR'}}) [L69]
        │   │   ├── 异步函数 exercise() [L71]
        │   │   │   └── 进入上下文 Client(create_server(URL, transport=httpx.MockTransport(mock))) → client，退出时交由上下文释放资源 [L72]
        │   │   │       ├── result ← await client.call_tool('equipment_get', {'equipment_id': ID}, raise_on_error=False)；result 在 L74 读 [L73]
        │   │   │       └── 断言 result.is_error and TOKEN not in result.content[0].text，失败抛出 AssertionError [L74]
        │   │   └── 执行 asyncio.run(exercise()) [L76]
        │   ├── 函数 test_opted_in_stdio_lists_read_only_tools() [L79]
        │   │   ├── 异步函数 exercise() [L80]
        │   │   │   ├── transport ← StdioTransport(command=sys.executable, args=['-m', 'astrophoto_mcp'], env={**os.environ, 'COMFYUI_URL': URL, 'ASTROPHOTO_EQUIPMENT_READ_TOKEN': TOKEN})；transport 在 L84 读 [L81]
        │   │   │   └── 进入上下文 Client(transport, mode='legacy') → client，退出时交由上下文释放资源 [L84]
        │   │   │       ├── 断言 {tool.name for tool in await client.list_tools()} == EXPECTED | {'version', 'connection_status'}，失败抛出 AssertionError [L85]
        │   │   │       ├── result ← await client.call_tool('version', {})；result 在 L87 读 [L86]
        │   │   │       └── 断言 not result.is_error，失败抛出 AssertionError [L87]
        │   │   └── 执行 asyncio.run(exercise()) [L89]
        │   └── 测试覆盖（本文件的用例与断言）
        │       ├── test_read_tools_schema_permissions_and_adapter（21 行） → request.headers['Authorization'] == 'Bearer ' + TOKEN，'X-AstroPhoto-Local' not in request.headers and request.method == 'GET'，request.url.path == '/astrophoto/v1/equipment'，request.url.params['type'] == 'camera' and request.url.params['archived'] == 'all'
        │       ├── test_missing_credential_or_nondirect_host_keeps_diagnostics（46 行） → {tool.name for tool in await client.list_tools()} == {'version', 'connection_status'}
        │       ├── test_invalid_or_denied_backend_is_mcp_error（57 行） → result.is_error and TOKEN not in result.content[0].text
        │       └── test_opted_in_stdio_lists_read_only_tools（79 行） → {tool.name for tool in await client.list_tools()} == EXPECTED | {'version', 'connection_status'}，not result.is_error
        ├── test_server.py — 测试工具 Schema、重复注册、诊断结果与错误、无效技能、stdio 握手和纯协议 stdout。
        │   ├── 项目内导入
        │   │   ├── __version__ ← mcp/src/astrophoto_mcp/__init__.py（L14），用于 assert json.loads(result.content[0].text)["version"] == __version__ / assert (await response(3))["structuredContent"] == {"name": "astrophoto-mcp", "version": __version__}
        │   │   ├── create_server ← mcp/src/astrophoto_mcp/server.py（L15），用于 server = create_server("http://comfy.test/proxy", transport=httpx.MockTransport(handler)) / async with Client(create_server("http://comfy.test", transport=httpx.MockTransport(handler))) as client:
        │   │   └── register_status ← mcp/src/astrophoto_mcp/tools/status.py（L16），用于 register_status(server, "http://127.0.0.1:8188")
        │   ├── 函数 test_registered_tool_schemas(server, mode) [L20]
        │   │   ├── original ← json.loads((Path(__file__).parent / 'fixtures/status_contract.json').read_text(encoding='utf-8'))；original 在 L26、30、34 读 [L21]
        │   │   ├── 异步函数 exercise() [L23]
        │   │   │   └── 进入上下文 Client(server, mode=mode) → client，退出时交由上下文释放资源 [L24]
        │   │   │       ├── tools ← await client.list_tools()；tools 在 L26、27 读 [L25]
        │   │   │       ├── 断言 {tool.name for tool in tools} == set(original)，失败抛出 AssertionError [L26]
        │   │   │       ├── 循环 tool ← tools [L27]
        │   │   │       │   ├── expected ← dict(original[tool.name]['inputSchema'])；expected 在 L31、32、33 读 [L30]
        │   │   │       │   ├── 执行 expected.pop('title') [L31]
        │   │   │       │   ├── expected['additionalProperties'] ← False [L32]
        │   │   │       │   ├── 断言 tool.input_schema == expected，失败抛出 AssertionError [L33]
        │   │   │       │   └── 断言 tool.output_schema == original[tool.name]['outputSchema']，失败抛出 AssertionError [L34]
        │   │   │       └── 断言 await client.list_resources() == []，失败抛出 AssertionError [L35]
        │   │   └── 执行 asyncio.run(exercise()) [L36]
        │   ├── 函数 test_duplicate_registration_fails(server) [L39]
        │   │   └── 进入上下文 pytest.raises(ValueError)，退出时交由上下文释放资源 [L40]
        │   │       └── 执行 register_status(server, 'http://127.0.0.1:8188') [L41]
        │   ├── 函数 test_in_memory_status_contract() [L44]
        │   │   ├── 函数 handler(request) [L45]
        │   │   │   ├── data ← {'system': {'os': 'test'}} if request.url.path.endswith('system_stats') else {'vue-basic': {}}；data 在 L47 读 [L46]
        │   │   │   └── 返回 httpx.Response(200, json=data) [L47]
        │   │   ├── 异步函数 exercise() [L49]
        │   │   │   ├── server ← create_server('http://comfy.test/proxy', transport=httpx.MockTransport(handler))；server 在 L51 读 [L50]
        │   │   │   └── 进入上下文 Client(server) → client，退出时交由上下文释放资源 [L51]
        │   │   │       ├── result ← await client.call_tool('connection_status', {})；result 在 L53、54、55 读 [L52]
        │   │   │       ├── 断言 not result.is_error，失败抛出 AssertionError [L53]
        │   │   │       ├── 断言 result.structured_content is None，失败抛出 AssertionError [L54]
        │   │   │       └── 断言 json.loads(result.content[0].text) == {'reachable': True, 'extension_registered': True, 'system': {'os': 'test'}}，失败抛出 AssertionError [L55]
        │   │   └── 执行 asyncio.run(exercise()) [L58]
        │   ├── 函数 test_diagnostic_failures_are_mcp_errors(failure) [L62]
        │   │   ├── 函数 handler(request) [L63]
        │   │   │   ├── 若 failure == 'disconnect' [L64]
        │   │   │   │   └── 抛出 httpx.ConnectError('disconnected', request=request) [L65]
        │   │   │   ├── 若 failure == 'timeout' [L66]
        │   │   │   │   └── 抛出 httpx.ReadTimeout('timed out', request=request) [L67]
        │   │   │   ├── 若 failure == 'invalid-json' [L68]
        │   │   │   │   └── 提前返回 httpx.Response(200, text='not JSON') [L69]
        │   │   │   ├── 若 failure == 'wrong-shape' [L70]
        │   │   │   │   └── 提前返回 httpx.Response(200, json=[]) [L71]
        │   │   │   └── 返回 httpx.Response(int(failure)) [L72]
        │   │   ├── 异步函数 exercise() [L74]
        │   │   │   └── 进入上下文 Client(create_server('http://comfy.test', transport=httpx.MockTransport(handler))) → client，退出时交由上下文释放资源 [L75]
        │   │   │       ├── result ← await client.call_tool('connection_status', {}, raise_on_error=False)；result 在 L77、78 读 [L76]
        │   │   │       ├── 断言 result.is_error，失败抛出 AssertionError [L77]
        │   │   │       └── 断言 result.structured_content is None，失败抛出 AssertionError [L78]
        │   │   └── 执行 asyncio.run(exercise()) [L79]
        │   ├── 函数 test_invalid_packaged_skill_fails_startup(monkeypatch, tmp_path) [L82]
        │   │   ├── skill ← tmp_path / 'broken'；skill 在 L86、87 读 [L85]
        │   │   ├── 执行 skill.mkdir() [L86]
        │   │   ├── 执行 (skill / 'SKILL.md').write_text('missing frontmatter', encoding='utf-8') [L87]
        │   │   ├── 执行 monkeypatch.setattr(module, 'SKILLS_DIRECTORY', tmp_path) [L88]
        │   │   └── 进入上下文 pytest.raises(ValueError)，退出时交由上下文释放资源 [L89]
        │   │       └── 执行 module.create_server('http://comfy.test') [L90]
        │   ├── 函数 test_stdio_initialize_list_and_call() [L93]
        │   │   ├── 异步函数 exercise() [L94]
        │   │   │   └── 进入上下文 anyio.fail_after(30)，退出时交由上下文释放资源 [L95]
        │   │   │       ├── transport ← StdioTransport(command=sys.executable, args=['-m', 'astrophoto_mcp'], env=dict(os.environ))；transport 在 L97 读 [L96]
        │   │   │       └── 进入上下文 Client(transport, mode='legacy', auto_initialize=False) → client，退出时交由上下文释放资源 [L97]
        │   │   │           ├── initialized ← await client.initialize()；initialized 在 L99 读 [L98]
        │   │   │           ├── 断言 initialized.server_info.name == 'ComfyUI AstroPhoto'，失败抛出 AssertionError [L99]
        │   │   │           ├── tools ← await client.list_tools()；tools 在 L101 读 [L100]
        │   │   │           ├── 断言 {tool.name for tool in tools} == {'version', 'connection_status'}，失败抛出 AssertionError [L101]
        │   │   │           ├── result ← await client.call_tool('version', {})；result 在 L103、104 读 [L102]
        │   │   │           ├── 断言 not result.is_error，失败抛出 AssertionError [L103]
        │   │   │           └── 断言 json.loads(result.content[0].text)['version'] == __version__，失败抛出 AssertionError [L104]
        │   │   └── 执行 asyncio.run(exercise()) [L105]
        │   ├── 函数 test_stdio_stdout_contains_only_protocol_json() — Unlike SDK clients which may tolerate stray lines, reject stdout noise. [L108]
        │   │   ├── 异步函数 exercise() [L110]
        │   │   │   ├── process ← await asyncio.create_subprocess_exec(sys.executable, '-m', 'astrophoto_mcp', stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)；process 在 L117、118、122、142、143 等 10 处 读 [L111]
        │   │   │   ├── 异步函数 send(message) [L116]
        │   │   │   │   ├── 执行 process.stdin.write((json.dumps({'jsonrpc': '2.0', **message}) + '\n').encode()) [L117]
        │   │   │   │   └── 执行 await process.stdin.drain() [L118]
        │   │   │   ├── 异步函数 response(request_id) [L120]
        │   │   │   │   └── 循环 True [L121]
        │   │   │   │       ├── line ← await process.stdout.readline()；line 在 L123、124 读 [L122]
        │   │   │   │       ├── 断言 line，失败抛出 AssertionError [L123]
        │   │   │   │       ├── message ← json.loads(line)；message 在 L125、126、127、128 读 [L124]
        │   │   │   │       ├── 断言 message['jsonrpc'] == '2.0'，失败抛出 AssertionError [L125]
        │   │   │   │       └── 若 message.get('id') == request_id [L126]
        │   │   │   │           ├── 断言 'error' not in message，失败抛出 AssertionError [L127]
        │   │   │   │           └── 提前返回 message['result'] [L128]
        │   │   │   ├── 尝试 [L130]
        │   │   │   │   └── 进入上下文 anyio.fail_after(30)，退出时交由上下文释放资源 [L131]
        │   │   │   │       ├── 执行 await send({'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': {'name': 'stdout-contract-test', 'version': '1'… [L132]
        │   │   │   │       ├── 断言 (await response(1))['serverInfo']['name'] == 'ComfyUI AstroPhoto'，失败抛出 AssertionError [L136]
        │   │   │   │       ├── 执行 await send({'method': 'notifications/initialized'}) [L137]
        │   │   │   │       ├── 执行 await send({'id': 2, 'method': 'tools/list', 'params': {}}) [L138]
        │   │   │   │       ├── 断言 {tool['name'] for tool in (await response(2))['tools']} == {'version', 'connection_status'}，失败抛出 AssertionError [L139]
        │   │   │   │       ├── 执行 await send({'id': 3, 'method': 'tools/call', 'params': {'name': 'version', 'arguments': {}}}) [L140]
        │   │   │   │       ├── 断言 (await response(3))['structuredContent'] == {'name': 'astrophoto-mcp', 'version': __version__}，失败抛出 AssertionError [L141]
        │   │   │   │       ├── 执行 process.stdin.close() [L142]
        │   │   │   │       ├── 执行 await process.wait() [L143]
        │   │   │   │       ├── 循环 line ← (await process.stdout.read()).splitlines() [L144]
        │   │   │   │       │   └── 断言 json.loads(line)['jsonrpc'] == '2.0'，失败抛出 AssertionError [L145]
        │   │   │   │       └── 断言 process.returncode == 0，失败抛出 AssertionError [L146]
        │   │   │   └── finally 退出清理 [L130]
        │   │   │       └── 若 process.returncode is None [L148]
        │   │   │           ├── 执行 process.kill() [L149]
        │   │   │           └── 执行 await process.wait() [L150]
        │   │   └── 执行 asyncio.run(exercise()) [L151]
        │   └── 测试覆盖（本文件的用例与断言）
        │       ├── test_registered_tool_schemas（20 行） → {tool.name for tool in tools} == set(original)，tool.input_schema == expected，tool.output_schema == original[tool.name]['outputSchema']，await client.list_resources() == []
        │       ├── test_duplicate_registration_fails（39 行） → pytest.raises(ValueError)
        │       ├── test_in_memory_status_contract（44 行） → not result.is_error，result.structured_content is None，json.loads(result.content[0].text) == {'reachable': True, 'extension_registered': True, 'system': {'os': 'test'}}
        │       ├── test_diagnostic_failures_are_mcp_errors（62 行） → result.is_error，result.structured_content is None
        │       ├── test_invalid_packaged_skill_fails_startup（82 行） → pytest.raises(ValueError)
        │       ├── test_stdio_initialize_list_and_call（93 行） → initialized.server_info.name == 'ComfyUI AstroPhoto'，{tool.name for tool in tools} == {'version', 'connection_status'}，not result.is_error，json.loads(result.content[0].text)['version'] == __version__
        │       └── test_stdio_stdout_contains_only_protocol_json（108 行） → line，message['jsonrpc'] == '2.0'，'error' not in message，(await response(1))['serverInfo']['name'] == 'ComfyUI AstroPhoto'
        └── test_version.py — 测试模块 CLI 与版本工具返回已安装包版本。
            ├── 项目内导入
            │   └── __version__ ← mcp/src/astrophoto_mcp/__init__.py（L7），用于 assert result.stdout.strip() == __version__ / assert result.structured_content == {"name": "astrophoto-mcp", "version": __version__}
            ├── 函数 test_module_cli_version() [L10]
            │   ├── result ← subprocess.run([sys.executable, '-m', 'astrophoto_mcp', '--version'], capture_output=True, text=True, check=True, timeout=20)；result 在 L12 读 [L11]
            │   └── 断言 result.stdout.strip() == __version__，失败抛出 AssertionError [L12]
            ├── 函数 test_version_tool_reports_installed_package(server) [L15]
            │   ├── 异步函数 exercise() [L16]
            │   │   └── 进入上下文 Client(server) → client，退出时交由上下文释放资源 [L17]
            │   │       ├── result ← await client.call_tool('version', {})；result 在 L19、20、21 读 [L18]
            │   │       ├── 断言 result.structured_content == {'name': 'astrophoto-mcp', 'version': __version__}，失败抛出 AssertionError [L19]
            │   │       ├── 断言 result.data == result.structured_content，失败抛出 AssertionError [L20]
            │   │       └── 断言 json.loads(result.content[0].text) == result.structured_content，失败抛出 AssertionError [L21]
            │   └── 执行 asyncio.run(exercise()) [L22]
            └── 测试覆盖（本文件的用例与断言）
                ├── test_module_cli_version（10 行） → result.stdout.strip() == __version__
                └── test_version_tool_reports_installed_package（15 行） → result.structured_content == {'name': 'astrophoto-mcp', 'version': __version__}，result.data == result.structured_content，json.loads(result.content[0].text) == result.structured_content
````
