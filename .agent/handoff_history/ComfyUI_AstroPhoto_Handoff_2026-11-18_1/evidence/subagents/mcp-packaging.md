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