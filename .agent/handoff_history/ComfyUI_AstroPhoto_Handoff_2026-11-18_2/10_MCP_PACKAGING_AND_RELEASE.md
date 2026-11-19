# MCP、打包与发布

本章核对工作树 main、HEAD 003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505；MCP、打包脚本、工作流及文档没有对应的未提交改动。SOURCE 表示当前源码，HISTORICAL_RUN 表示上轮留存的执行证据，CURRENT_RUN 表示本次迁移期间此专题实际运行。路径均相对项目根。旧版 Handoff 的测试通过与本次执行分别记账。

<a id="mcp-decisions"></a>
## 决定、约束和旧 ID

| 沿用 ID | 对象和当前判断 | 原始位置、变化和影响 |
| --- | --- | --- |
| ADR-01 / ADR-02 | 单仓、独立 Registry Extension 与 PyPI MCP 双发行。根项目为 Lockstep SemVer 真相源。同一稳定三段版本、匹配的固定依赖及 tag。 | .artifact/Handoff/Last_Handoff/sources/09_DECISIONS.md:7；docs/requirements.md:29,451,455–475；pyproject.toml:1–19,33–40；mcp/pyproject.toml:1–15。发行锁步已实现版本/构件检查；运行时跨包握手属于目标。 |
| ADR-07 | FastMCP 4.2.0 单工厂、stdio。ComfyUI 拥有画布、执行、宿主模型路径；Extension 拥有业务数据和服务；MCP 经支持的公开 API；Agent Harness 管规划及 Subagent。L0/L1/L2 是调用/发现顺序，单 Server 不用全局阶段开关影响其他客户端。 | Last_Handoff/sources/09_DECISIONS.md:12、05_MCP_AND_SKILLS.md:68–115；.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-16_1/04_MCP_Tools_Skills_知识库_记忆.md §2–4；docs/requirements.md:18,29–38,240–257。 |
| D13 | 默认两项诊断。仅配置合规设备读 token 且直连 IP 回环 URL 时注册六项设备/光路只读能力。 | 11-18_1/11_HANDOFF_RECONCILIATION.md:19；Last_Handoff/sources/05_MCP_AND_SKILLS.md 的「仅两诊断、无业务 Tool」为该时点证据；Siril Chat Handoff 的本期不加 Siril Agent Tool 仍适用；设备单独交付。源码 server.py:19–31。 |
| D06（跨专题） | 光路当前一份配置。历史 Revision GET 以兼容只读身份保留，旧发布/创建等写入口由后端拒绝；不能把 Tool 名称当作还支持新发布的证据。 | 11-18_1/11_HANDOFF_RECONCILIATION.md:12；astrophoto/api/equipment.py:64–90；astrophoto/equipment/trains.py:44–75,157–186；跨链 M-12/M-13。 |
| D14 / ADR-08 / ADR-11 / ADR-12 | 知识、记忆、实验、可认证 Agent 工具和在线画布 Bridge 继续作为需求。Asset SQLite/ORM 已落地；knowledge.db、memory.db 和相关业务模块未交付。 | Last_Handoff/sources/06_DATA_MEMORY_RAG.md:5–35、09_DECISIONS.md:13–17；11-18_1/11_HANDOFF_RECONCILIATION.md:20；docs/requirements.md:111–161；astrophoto/core/capabilities.py:4–39。 |
| ADR-13 | 只分发包内业务 Skill，选择 SkillsDirectoryProvider 的条件接线；没有生产 Skill，也没有安装/列举 Skill 的产品 CLI。 | Last_Handoff/sources/09_DECISIONS.md:18、05_MCP_AND_SKILLS.md:115–157；docs/requirements.md:163–179；server.py:26–31。SkillsDirectoryProvider 是本应用选用的 API；SkillCatalogProvider/Skill.from_directory/Skill.from_package 是历史读取的其他可选 API。开发 SOP v2.2 与 task-notes 属于仓库开发上下文。 |
| ADR-14 | 两项目最低 Python 3.11；开发 Python 3.12；ComfyUI 宿主 Python 独立。 | .agent/archive/fastmcp-42.md §§Verified/Decisions；Last_Handoff/sources/09_DECISIONS.md:19；根及 MCP pyproject.toml:10。历史 Python 3.10 最低支持撤销；旧 Python 3.10 客户端协商证据另有范围。 |

<a id="mcp-tool-contract"></a>
## 实际 Feature 与契约（SOURCE）

MCP 路径以 mcp/src/astrophoto_mcp/ 为基。入口 M-01 为 mcp/pyproject.toml:14–15 的 `astrophoto-mcp` 或 `python -m astrophoto_mcp` → `__main__.py:9–23::main` → `config.py:11–27::resolve_comfy_url` → `server.py:19–31::create_server` → `FastMCP.run(transport="stdio", show_banner=False)`。普通 CLI stdout 供 MCP JSON-RPC；显式 `--version` 打印并退出。应用没有另建 HTTP 宿主，也不会启动 ComfyUI。唯一工厂 `on_duplicate="error"`。

| 旧 ID | 可用性和输入 | 正式请求、结果及对应 Guard |
| --- | --- | --- |
| M-02 · version | 默认，无参 | tools/status.py:12–17 → 包自身 metadata 版本，structured/text object `{name,version}`，string-valued output schema。远端 Extension 版本由状态 API 另行表达。GM-06。 |
| M-02 · connection_status | 默认，无参 | tools/status.py:19–24 → client.py:9–14 → api/comfy.py:6–22，依序 GET `system_stats`、`object_info/vue-basic`；保留反代前缀。成功 JSON 文本 `{reachable:true,extension_registered,system}`；无 outputSchema 或 structuredContent。对缺节点的 HTTP 200 空对象映射 false；HTTP 404/500 是错误。GM-01/05/06。 |
| M-03 / M-14 · equipment_list | 条件，equipment_type 为 camera/primary_optics/optical_accessory/filter 或 null，query 空，include_archived false，cursor null，limit 50 | tools/equipment.py:9–19 → GET `astrophoto/v1/equipment`；映射 type,q,archived,after,limit；`{items,next}` equipment DTO。GM-02/03/04。 |
| M-03 / M-09 · equipment_get | 条件，equipment_id 为 canonical UUID | tools/equipment.py:21–24 → GET `astrophoto/v1/equipment/{id}`；单 equipment DTO。GM-02/03/04。 |
| M-03 / M-10 · optical_train_list | 条件，query 空、include_archived false、cursor null、limit 50 | tools/equipment.py:26–31 → GET `astrophoto/v1/optical-trains`；train 分页 DTO。GM-02/03/04。 |
| M-03 / M-11 · optical_train_get | 条件，train_id 为 canonical UUID | tools/equipment.py:33–36 → GET `astrophoto/v1/optical-trains/{id}`；单 train DTO，当前配置及兼容引用。GM-02/03/04。 |
| M-03 / M-12 · optical_train_revision_list | 条件，train_id 为 canonical UUID | tools/equipment.py:38–41 → GET `.../optical-trains/{id}/revisions`；只读兼容 revision 集合 `{items}`，无分页 next 要求。GM-02/03/04。 |
| M-03 / M-13 · optical_train_revision_get | 条件，train_id、revision_id 为 canonical UUID | tools/equipment.py:43–47 → GET `.../optical-trains/{id}/revisions/{revision_id}`；只读历史 revision detail 快照 DTO。GM-02/03/04。 |
| M-04 · Skill Provider | 条件接线，当前零个生产 Skill | server.py:26–31 仅包内 skills/**/SKILL.md 存在时加入目录 Provider；无效 Skill 构建会使工厂失败。工作区 .agents、用户目录不参与发现。GM-06。 |
| M-08 | 规划，未注册或未实施的业务能力 | 无 Siril/资产写入/Canvas/通用节点检索/Workflow/Knowledge/Memory/Experiment 工具，也无跨包版本握手。Extension 中已存在 Siril 业务处理并不改变 MCP 工具清单。 |

Extension 原生 `GET /astrophoto/v1/status` 由 astrophoto/api/routes.py:12–36 与 api/status.py 持有；其 HTTP 业务契约用 `api_version: "v1"`，旧 `api_schema_version` 名称为规划候选。目前诊断仅读取两项宿主公共端点；不据此推断业务路由、SQLite、Siril、知识或记忆可用。astrophoto/core/capabilities.py:4–39 在运行条件下覆盖真实 storage、database、assets、equipment、optical_trains、software、processing；长期 knowledge、memory、experiments、canvas_bridge 保持未实施。Host 加载和真实授权须按目标进程验证。

<a id="mcp-guard-test"></a>
## Guard、测试和风险

| 旧 ID | 守卫、可见结果及状态 | 源码和断言 |
| --- | --- | --- |
| GM-01 | URL 优先级 CLI > COMFYUI_URL > http://127.0.0.1:8188。保留尾斜杠及反代路径；拒绝缺 scheme/host、空字符串或内部空白、反斜线、query、fragment、userinfo、非法端口、非 HTTP(S)。前后空白 trim。CLI 无效以 argparse code 2，stdout 空，stderr 有原因。 | config.py:7–27、__main__.py:17–20；mcp/tests/test_config.py:10–61 覆盖空 env、CLI 覆盖、IPv6、代理 path、CLI 配置成功/拒绝。 |
| GM-02 | 设备工具发现需 43–256 个 ASCII 字母数字或 -_ 的 token，URL host 为 loopback IP 且 path 根；localhost 字符串、反代路径、非回环和无/坏 token 降级到默认两工具。客户端 trust_env=False、follow_redirects=False。服务端另要求启用可信单用户 loopback、无 CORS/转发，remote、Host、Origin 同源规则通过；Bearer 只允许 GET、且拒绝携浏览器 Origin/Sec-Fetch-Site，constant-time compare。浏览器分支要求 same-origin Fetch Metadata + X-AstroPhoto-Local:1；该 header 自身不提供本地进程身份隔离。 | server.py:23–25、api/equipment.py:14–23,76–82；astrophoto/api/security.py:18–64 与 storage.py:107–128。mcp/tests/test_equipment.py:21–89 检查请求 method、Bearer、不注入浏览器 header、降级/302/错误脱敏/stdio 列举；tests/integration/test_equipment_api.py 为独立 aiohttp 授权边界。 |
| GM-03 | UUID 必须规范小写且 36 字符；query 最多 120；page size 1–100；cursor canonical UUID；归档布尔转 all/false，类型由 schema 枚举。失败 ToolError INVALID_REQUEST，调用不进入后端。 | api/equipment.py:26–41、tools/equipment.py:9–47；mcp/tests/test_equipment.py:21–41 有 camera/all 与必需字段断言，所有边界未逐一覆盖。 |
| GM-04 | 每请求 HTTPX AsyncClient 运行后关闭，10s timeout。状态错误只保留清洗后的 ASCII 码至多 80 字符和 HTTP 状态；TIMEOUT、NETWORK_ERROR、INVALID_RESPONSE 可区分。集合 items/list、分页 next、主要类型/id/row_version、train status/has_draft、revision 正整数、detail snapshot_version 1 与 train_id 相符以及 camera/primary_optics dict、accessories/filters list 经过浅层验证。 | api/equipment.py:44–67,76–116；mcp/tests/test_equipment.py:56–76 的 403/404/500/503、redirect、timeout、坏 JSON、坏 DTO 断言 error 和 token 不泄露。没有独立成功 equipment_get 或四个光路 Tool 调用断言；后四项仅枚举。响应大小/递归 DTO 验证/重试在已读链路未找到。 |
| GM-05 | two GET 各 raise_for_status，验证两个 JSON object 和 system object，HTTP/timeout/坏形状错误传到 MCP error；async context 退出。诊断所配任意 HTTP(S) URL 与设备的授权目标不同；诊断客户端未显式禁用环境代理。 | client.py:9–14 和 api/comfy.py:6–22；mcp/tests/test_client.py:9–62、test_server.py:44–79 分别覆盖 Proxy 前缀、空节点、404/500/503、连接和读取超时、非 JSON、system 非 object、错误文本无 structuredContent。 |
| GM-06 | FastMCP 重复工具名失败；包内没有技能时不挂 Provider；坏 frontmatter 不能启动。CLI stdio 禁 banner，实际协议 stdout 保持 NDJSON，进程失败/结束测试有 cleanup。 | server.py:16–31；mcp/tests/test_server.py:20–41,82–150 覆盖 auto/legacy 两模式、schema fixture、空资源、重复、坏 Skill、真实 stdio，test_version.py:10–22 覆盖 CLI 和结构/文本；test_equipment.py:79–89 的真 stdio 只完成条件工具枚举和 version。 |
| GM-07 | 版本、依赖 pin、tag 和 LICENSE 必须一致；构建以运行内容白名单及必需文件校验；拒绝不适用的私有路径、额外 JS、源 symlink、path traversal，sdist 只收允许前缀的普通文件。 | scripts/release.py:38–120,151–180；tests/packaging/test_versions.py:8–25 覆盖错误 tag、不同版本、sync 临时副本及不规范版本；test_contents.py:20–49 临时构件及注入路径失败。 |
| GM-08 | 安装验证在临时 venv 与隔离 Python 内运行；指定 PyPI 索引，不继承 uv config/cache；30 秒握手、45 秒探针子进程；临时目录自动清理。release 最多尝试五次公开安装，连续五次失败则阻断 Registry，各次失败等待 15 秒。 | scripts/check_install.py:12–52、.github/workflows/release.yml:50–60。安装探针继承设备 token/URL 时可能枚举八工具，当前只期望默认集合；开发者环境验证应确保诊断条件清楚。 |
| GM-09 | Vue/React 聚合入口保持相对宿主 imports，浏览器代理路径下同源。 | frontend/vite.config.mts:7–37；tests/packaging/test_contents.py:52–57 检查两条相对 import 经 urljoin 的代理结果；frontend/ui/check-build.mjs:1–24 检静态构件；check-proxy.mjs:1–57 以真实 Chromium 加本地 HTTP 假宿主，断言资源 200、注册次序、无 pageerror。 |

<a id="packaging-release"></a>
## 发行、CI 与未过边界（M-05/M-06/M-07）

- **M-05 · 构件内容。** 根项目 0.0.1，根 uv workspace 指向本地 mcp/；Registry staging 移去开发工作区/依赖组，生成固定 MCP pin 与 SQLAlchemy、Alembic、FileLock、Astropy、Pillow 等运行依赖。Hatchling >=1.27,<2 构建独立 wheel/sdist。wheel 包含 astrophoto_mcp/ Python 和未来同包产品技能；sdist 还含 MCP 本域测试、README、pyproject、LICENSE。Registry 保留 Python 扩展、nodes、locale、聚合 JS/CSS、Alembic 统一基线；排除 MCP 源、reference、tests、开发 Skill/交接、host 状态、用户数据和缓存。依据 pyproject.toml:1–40、mcp/pyproject.toml:1–32、.comfyignore:1–45、scripts/release.py:70–180。后缀/路径检查范围内可校验所列文件；允许路径里任意文本的秘密、完整 wheel 内部文件 allowlist 和签名在相关链路未发现。
- **M-06 · 构建。** Vite 的 Vue/React `entry.ts` 聚合为 `js/main.js` 与 CSS，comfy:app/api 外置相对 `../../scripts/{app,api}.js`；禁 sourcemap、不清空输出目录。保留 Vue Widget 本地化资源，不加第二个 WEB_DIRECTORY。待发布检查负责验证实际 staging 内容。依据 frontend/vite.config.mts:7–37、.github/workflows/ci.yml:34–42、test_contents.py:52–57。
- **M-07 · CI。** .github/workflows/ci.yml:3–71 在 main push、PR、workflow_call 运行 Ubuntu 3.11/3.12 matrix，Node 22、pnpm 11.13.1、uv 0.13.8，frozen 双锁。顺序涵盖 typecheck/lint、React Jest/RTL、Playwright Chromium/Vue、静态及假代理、Ruff、节点/后端双替身、aiohttp -m "not host"、打包边界、独立 MCP、版本及构件测试；只上传 3.12 的构件。
- **M-07 · 发布。** .github/workflows/release.yml:3–71 在 v* tag 并发串行，复用 CI；PyPI OIDC Trusted Publishing 后在独立 Registry job 从公共 PyPI 安装并握手，然后校验、解压已测试 Registry 构件，使用 COMFY_REGISTRY_TOKEN 发布。重跑已有 PyPI 文件 skip-existing，可再确认公开安装，需按远端状态处理 Registry 已发布时的版本（不可覆盖）。公开可装和同版本不证明远端文件与本地 wheel 的哈希完全相同。未配置/验证远端环境、凭证、动作与真正的 Manager 安装更新；workflow 未创建 GitHub Release，release notes 是需求路径中的计划。运行中外部 uvx/venv 或连接的 MCP 进程需独立更新重启。docs/publishing.md §§发布/当前阻塞；docs/requirements.md:459–475。
- **ATTEMPT · 开发期版本迁移。** .agent/archive/fastmcp-42.md §§Verified/Decisions 记录 Python 3.11/3.13 各 52 MCP、老 SDK 1.30 客户端在 Python 3.10.22 成功协商新服务端、3.12.4 临时 venv wheel+stdio 验证；FastMCP 4.2 导入路径、Client legacy 显式 initialize、ToolResult 保留旧输出。Host Torch 2.3.0+cpu 缺 torch.library.custom_op 是旧环境验收阻塞。不移植历史 Python 3.10/Registry 11 件或旧测试总数到当前 HEAD。
- **RISK · 本地发布前。** scripts/release.py:54–67 的 sync 连续写两个版本与 LICENSE，无事务回滚；失败可能有部分改写。70–81 枚举 tracked 加未忽略 untracked，本地允许路径中未提交文件可能进候选包；123–148 临时 staging 清理，但输出路径未做原子替换/失败清理保证。版本命令 check 为只读。
- **ERROR/SKIP · 历史远端与当前限度。** docs/publishing.md §§当前发布阻塞 记录 2026-11-16 公共 PyPI 0.0.1 URL HTTP 404。它属于历史事故；本次禁止对外发布，未检查当前远端状态，远端可用性 UNKNOWN。11-18_1/06_TEST_COVERAGE_MATRIX.md:9,18,34 历史 3.11.18/3.12.15 MCP 各 67 passed；根套件各 83 passed/3 skipped（其中 8 项 packaging 通过），临时包和代理检查历史通过。evidence/test-runs.md 记录命令；evidence/test-results/ 保留 mcp.log、mcp.xml、python311-mcp.log、python311-mcp.xml、release-check.log、check-proxy.log；这组运行无真实 token 宿主调用、远程发行或 Manager 安装。当前测试状态见 06 主章。
- **CURRENT_RUN · 本专题。** 通过已存在的独立 .venv 执行 `& ./.venv/Scripts/python.exe -I -B --version` → Python 3.12.15；`& ./.venv/Scripts/python.exe -I -B scripts/release.py check` → exit 0、0.0.1（核对稳定版、两个版本、根 pin、许可证）。未执行 sync、编译、安装、网络探测、真实 host Token、打包、发布或 Git 写入。本报告自身的 MCP pytest 为 NOT_RUN；总交接另记其他当轮执行。

<a id="long-term-mcp"></a>
## 仍有效的长期需求与验收

- **FR-01／运行时发现。** 可识别 Extension、MCP、ComfyUI/前端版本、节点注册、DB、软件与能力。保留本地诊断稳定返回和 API `api_version: v1`，远端协商未实现。老 SDK 和新 tool schema（输入无 title，additionalProperties=false）的契约历史继续保留。依据 docs/requirements.md:73–80,475；Last_Handoff/sources/05_MCP_AND_SKILLS.md:104–115。
- **FR-04／Canvas 和 Workflow。** 使用 ComfyUI 自有图、保存、撤销和队列；未来受控 Broker 发目标 session/预期 graph_revision/commands/request_id 至在线前端并返回真实 receipt。断线或无目标 Canvas 应报 CANVAS_UNAVAILABLE，版本冲突 GRAPH_CONFLICT，不能广播给无目标客户端。通用 node_search、node_describe 和 `/prompt` 工作流提交与当前浏览器 Canvas 编辑有独立契约。依据 docs/requirements.md:111–119,240–257；11-16_1/04_MCP_Tools_Skills_知识库_记忆.md §3–4。验收需在线命令与离线失败、真实多标签 session/revision，以及可独立提交已保存流程。
- **FR-05／Knowledge。** Extension 负责受许可来源的采集、清洗、分块、LangChain/SQLite FTS5 查询，使用 URL、许可、章节、软件版本、时间、fingerprint、chunk id 留闭环。可选 sqlite-vec/Embedding/Reranker，本地无模型仍可 FTS；中文 tokenizer、Windows 二进制、许可、模型选择待验。通过 ComfyUI folder_paths 独立类别 `astrophoto_embedding`、`astrophoto_reranker`，避免原 Textual Inversion 模型目录。MCP 只调用知识 API，外部 Agent 生成回答；返回有来源的片段，文档是检索数据。验收至少一个可验证官方来源及章节、可重建索引、FTS 无模型可用。依据 docs/requirements.md:120–128,314–322,509；Last_Handoff/sources/06_DATA_MEMORY_RAG.md:13–17；11-16_1/04_MCP_Tools_Skills_知识库_记忆.md §7。
- **FR-06／Memory。** Extension owns memory.db，资产事实引用 assets ID，按 profile 隔离且验证真实身份；不向外自动上传精确坐标、设备序列号或把用户数据写进公共 Skill。区分 human/agent/system，nodeCreated 也能由加载旧工作流触发；不能从一次 Agent 参数尝试推断审美。授权事件、偏好、反馈、证据、会话和 consents 保持来源/置信/场景/生命周期，显式偏好优先，HOO/SHO/RGB 等细分适用场景。生命周期 Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh/Expire → Forget；30 天为候选短留，不是产品默认。支持关停、审阅、纠错、导出与删除，删除后检索不得恢复；Agent memory_context 返回有限相关项及证据，不能用仓库 task-notes 或 Chat History 替换。无需强制 Mem0/Zep/LangGraph，智能归纳可后续插拔。依据 docs/requirements.md:129–152,294–310,484,510；Last_Handoff/sources/06_DATA_MEMORY_RAG.md:19–25；11-16_1/04_MCP_Tools_Skills_知识库_记忆.md §8。
- **FR-07／Experiment。** Extension 保存实验及每条 Trial，外部 Agent 管搜索策略。记录 experiment_id/trial_id/prompt_id/node_id、workflow snapshot/hash、软件版本、输入 Asset/输出、参数、计量、耗时、错误、反馈及出处；保留失败与非最优尝试，区分科学指标 SNR/FWHM/背景梯度与用户/模型审美，模型需有版本及依据。支持复现、预算、取消、恢复、幂等，保护原件，不由 FastMCP Background Tasks 替换宿主队列。依据 docs/requirements.md:154–161,511；Last_Handoff/sources/06_DATA_MEMORY_RAG.md:27–35；11-16_1/04_MCP_Tools_Skills_知识库_记忆.md §9。
- **FR-08／Agent Skills。** six groups/33 个候选（环境设备 4、资产 6、工作流 5、天文处理 12、知识记忆 3、优化 3）。第一批候选 import-session、match-calibration、plan-workflow、compose-workflow，后续 register-stack、optimize-node、knowledge-guide、personalize-processing；发布前必须验证所依赖工具。Skill 只组织已授权受控操作，无自由 Shell、不读写 SQLite。Skills over MCP 支持依 Host 验证；本地显式授权安装或 Resource 读取可作为降级；`astrophoto-mcp skills list/install --agent ...` 属于拟议功能。Skill 文档指令不是系统授权。设备/场地隐私从受控业务接口取，不变成公共流程静态数据。依据 docs/requirements.md:163–194,545–547；11-16_1/04_MCP_Tools_Skills_知识库_记忆.md §5、§10；11-16_1/references/Skills_讨论原稿.md 保留早期提案。
- **QUESTION · 计划待决。** Codex/Claude Code/OpenCode 协议支持与本地安装降级（docs/requirements.md:547）、知识索引许可/中文分词/Windows 模型运行、用户 profile 认证与保留策略具体值、多 Canvas 选择和版本冲突策略、外部运行时握手，都须后续定案/验收。现有设备 READ token 不应据此扩权到其他域。

<a id="mcp-source-coverage"></a>
## 来源覆盖及限制

- 当前查阅 CodeGraph 中 MCP 入口、配置、HTTP、工具注册、status、设备鉴权/路由、能力、release/check_install 与专项测试；查阅 .github/workflows/*、根/MCP pyproject、.comfyignore。锁文件只核对声明及当期证据，未逐锁条目审计。当前工作树源码与历史宿主/运行证据分别记载。
- 正式 Handoff 11-18_1 的 02/04/06/10/11/12 相关原文定位及 evidence/subagents/mcp-packaging.md、11-16_1 的 MCP 规划、.agent/archive/fastmcp-42.md、.artifact/Handoff/Last_Handoff/sources/05_MCP_AND_SKILLS.md、06_DATA_MEMORY_RAG.md、09_DECISIONS.md。11-16_2 中对应旧材料和 docs/handoffs/repository-verified-2026-11-16/17 的复本及原始日志由总包来源表逐文件登记；本子专题章节不声明这些复本的所有区间已由此专员逐行读取。
- Siril/设备专题的原始 PRD/TDD 含跨域考虑，独立专题核对细项；本章只裁决 MCP 暴露、协议、权限和发布边界。未发现当前生产 PyPI/Registry 状态或支持跨会话运行的证据。以上历史来源不会生成新提及或旧轮次计数。


[稳定编号和逐项出处](migration/OLD_ID_MAP.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/10_MCP_CI_PACKAGING.md)

```markdown
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
```
