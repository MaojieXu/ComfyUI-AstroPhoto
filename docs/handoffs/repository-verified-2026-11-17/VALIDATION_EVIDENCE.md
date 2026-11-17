# 本轮验证记录

日期：2026-11-17，用户时区America/Chicago。默认cwd为项目根。日志里的进程时间沿用进程本地输出，不据此改写用户日期。最终快照UTC时间在 `evidence/snapshot.json`。

## 1. 环境与操作边界

- 分支main，HEAD `06961eebe42674714dc2992b0a9de654b3a5a566`；`evidence/git-before.txt`保留全部未提交/未跟踪条目，不仅目录汇总。
- 开发解释器：根`.venv/Scripts/python.exe`，Python3.12.15。直接调用已安装解释器和pnpm，避免uv run触发自动同步。没有安装依赖或修改锁。
- 宿主解释器：`C:/ProgramData/anaconda3/envs/comfyenv/python.exe`，Python3.12.16。只读取metadata；运行服务已存在，本轮未启动/重启ComfyUI。
- 宿主HTTP：`http://127.0.0.1:8188`；只GET。未上传、执行prompt、改设置、写Workflow库、操纵用户当前画布。
- 前端浏览器测试使用已安装Chromium，在隔离测试页面运行，宿主app/API使用替身。
- Vite输出定向独立临时目录，同时覆盖`build.outDir`及`rollupOptions.output.dir`，没有覆盖根js；普通`pnpm test`会先构建，所以本轮使用`pnpm exec vitest run`。
- 输入Bundle没有提供原始ZIP。资料复制在临时目录，原件不动。新交付在docs/handoffs/repository-verified-2026-11-17。

## 2. 命令与实际结果

| ID | 实际命令/调用 | 结果 | 原始证据 |
|---|---|---|---|
| V01 | `git status --short`、`git status --porcelain=v1 -uall`、`git branch --show-current`、`git rev-parse HEAD` | main@06961ee；大量既有dirty/untracked | git-before.txt、git-after.txt、snapshot.json |
| V02 | Python hashlib逐文件检查输入manifest的sha256/bytes；resolve校验路径；复制到临时目录 | 26/26匹配，独立聊天交接同hash | input-hashes.json |
| V03 | 解析sources/MANIFEST.md并校验本包实际存在条目 | 48条；15存在且匹配，33旧evidence未提供 | historical-manifest-check.json |
| V04 | `node --version`、`pnpm --version`、`uv --version` | 26.8.2 / 11.13.1 / 0.13.8 | tool-versions.txt |
| V05 | `.venv/Scripts/python.exe`查询sys/importlib.metadata；`pnpm -C frontend list --depth 0 --json` | 当前安装版本已记录 | dev-versions.json、frontend-versions.json |
| V06 | comfyenv python查询sys/importlib.metadata；读host comfyui_version.py | Python3.12.16、Torch2.14.1+cu130、Frontend1.59.1；Backend0.45.0 | host-versions.txt、live-http.json |
| V07 | `.venv/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration -q -p no:cacheprovider`（无COMFYUI_TEST_URL） | **15 passed, 1 skipped**，0.14s | root-tests.txt |
| V08 | `.venv/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests -q -p no:cacheprovider` | **52 passed**，4.25s | mcp-tests.txt |
| V09 | `pnpm -C frontend test:react` | **6 suites / 33 passed**；最终复跑仍33，5.727s | react-tests.txt、react-tests-final.txt |
| V10 | `pnpm -C frontend typecheck` | PASS：vue-tsc+React tsc；并发变更后再次通过 | typecheck.txt、typecheck-final.txt |
| V11 | `pnpm -C frontend lint` | PASS：eslint ui/src，max-warnings0；最终再次通过 | lint.txt、lint-final.txt |
| V12 | `.venv/Scripts/python.exe -m pytest tests/packaging -k 'not mcp_artifacts_exclude_extension' -q -p no:cacheprovider` | **5 passed, 2 deselected**，0.90s | packaging-tests.txt |
| V13 | `.venv/Scripts/ruff.exe check --no-cache astrophoto nodes mcp/src mcp/tests scripts tests __init__.py` | All checks passed | ruff.txt |
| V14 | `.venv/Scripts/python.exe scripts/release.py check --tag v0.0.1` | 输出0.0.1；仅检查字符串，没有创建Tag | versions-check.txt |
| V15 | 设COMFYUI_TEST_URL后 `.venv/Scripts/python.exe -m pytest tests/integration -m host -q -p no:cacheprovider` | **1 passed, 2 deselected**，0.05s | host-http-tests.txt |
| V16 | `pnpm -C frontend exec vitest run` | **3文件 / 9 passed**，真实Chromium；不触发构建 | vue-tests.txt |
| V17 | `node <temp>/build-isolated.mjs` | PASS：320模块；第一次通过但Vue编译注释与CLI产物不同 | build.txt、build-comparison.diff |
| V18 | `$env:NODE_ENV='production'; node <temp>/build-isolated.mjs` | PASS：320模块；JS801.94kB、CSS12.01kB，gzip188.90/2.97kB | build-production.txt、build-isolated.mjs |
| V19 | `pnpm -C frontend check:build`；Python比较临时生产产物与工作树SHA256 | PASS单JS/双注册/CSS/相对URL；比较时两文件hash均一致 | check-build.txt、build-hashes.json |
| V20 | Python urllib GET `/system_stats`、`/astrophoto/v1/status`、`/object_info/vue-basic`、`/extensions` | 真宿主响应正常；唯一AstroPhoto JS入口 | live-http.json |
| V21 | FastMCP `Client(create_server(live_url),mode='legacy')` list tools/resources、call version/connection_status | 两工具成功；resources=[]；真实HTTP，不是MockTransport | mcp-live.json |
| V22 | urllib GET `https://pypi.org/pypi/astrophoto-mcp/0.0.1/json` | **HTTP404**，发布前置仍不满足 | pypi.json |
| V23 | `git -C reference/ComfyUI_frontend describe --tags --exact-match`、rev-parse、status | v1.59.1 / cded88f；仅.codegraph未跟踪 | reference-version.txt |
| V24 | 读取当前源/配置、安装index.d.ts、固定Tag源码、Backend loader/LoadImage/path checker | 见API结论，非端到端测试 | api-source-excerpts.txt、source-after.json |
| V25 | 重新打开官方Sidebar、JS Extensions、V3文档 | 支持接口定位；不是本地兼容性测试 | 主交接§7直接来源链接 |
| V26 | 最终文档/证据检查、输入hash复核、工作树hash比较 | 见delivery-check.json | delivery-check.json、git-after.txt |

**本轮不同测试用例共115通过**：15+52+33+5+1+9。V07最初跳过的host用例由V15实际运行；V15取消选择的两项HTTP隔离用例已在V07执行，不是遗漏。V12两项MCP构建测试未运行；React等复跑不重复加数。

V12执行了版本检查、临时Registry ZIP构建与污染拒绝检查、现有JS路径检查。排除的两个用例会通过`uv build`创建构建环境/安装构建依赖，不在本轮授权内。不要把“5 passed”写成全部packaging通过。

## 3. 测试证明范围

| 测试 | 实际证明 | 不能证明 |
|---|---|---|
| Node/Core | V3替身契约、输入校验、委托、配置/无建目录副作用 | 真IMAGE tensor、FITS科学精度 |
| aiohttp integration | 真TestServer路由/状态/去重/冲突 | ComfyUI整个宿主生命周期 |
| Host HTTP | 活跃ComfyUI路由、节点Schema与状态 | 画板操作、Undo/Redo、保存菜单、执行成功 |
| React Jest/RTL | 导航、七模块、locale、搜索、catalog、请求、生命周期、Canvas替身 | 真浏览器几何、真实LiteGraph历史行为、跨区拖动 |
| Vue Chromium | 真Canvas像素/事件、保存恢复与上传序列化；宿主边界mock | 真宿主上传/IMAGE/工作流库保存 |
| MCP52 | tools/schema/配置/error、内存、stdio、stdout | 所有业务Tools已实现、版本握手、发布 |
| MCP live | 实际两个只读诊断工具访问运行宿主 | Agent在线、Canvas Bridge、MCP进程被Manager更新 |
| Build/check | 可编译、单入口、静态URL推导、hash一致 | 真实反代部署、浮动/200%缩放及全面CSS兼容 |

V17第一次隔离构建未显式设置NODE_ENV，Vue编译输出带开发注释，虽构建成功但hash不同。V18按生产环境重跑后与工作树一致。保留两次结果和diff，不将最初差异隐瞒或误判为产品源码错误。

Vue输出中的compiler macro提示、上传拒绝测试产生的预期console.error、Node localStorage ExperimentalWarning均已保留，不计为失败。辅助读取曾因Windows GBK解码UTF-8产物失败，显式encoding='utf8'后完成比较；定位安装types最初猜测的dist路径不存在，随后在真实index.d.ts查证。这些是审计辅助过程问题，没有改产品代码。

## 4. 当前HTTP与协议原始结果

`live-http.json`保存完整JSON响应：

- system_stats：Backend0.45.0、安装Frontend1.59.1、Python3.12.16、Torch2.14.1+cu130、RTX4090D。内存数字是查询瞬间值，不作为配置常量。
- status：Extension0.0.1、api_version=v1、ok、node/routes=true；8个未来能力false/not_implemented。
- object_info：唯一vue-basic契约，与V3当前源码一致。
- extensions：完整宿主列表，其中AstroPhoto仅`/extensions/ComfyUI_AstroPhoto/main.js`。

`mcp-live.json`保存两次ToolResult内容。version有structured_content，connection_status无structured_content；后者仅报告节点键存在，不验证对应类所有权/实际执行，也不做Extension版本比较。

## 5. 历史证据：本轮只读，未冒充重跑

- `.artifact/react-sidebar/host-evidence.json`：17条记录，其中IMAGE明确SKIP、其余16条，无pageerrors；含旧“language persistence…manual override”名称。没有当前源码hash绑定，不能覆盖本轮最新UI。
- `.artifact/react-sidebar/image-execution-failure.json`：历史IMAGE ValueError与工作流。当前Python仍有相同双重解析路径；本轮不提交prompt重现。
- `.agent/archive/drawing-persistence.md`：记录9项Vue及真实宿主PNG重载通过、IMAGE主动跳过。
- `.agent/archive/native-sidebar-tabs.md`：历史原生Tab几何/键盘比较。
- `.agent/archive/sidebar-search-toolbar.md`、`sidebar-node-tree.md`、`sidebar-node-preview.md`：历史真宿主工具栏、树、Portal与拖动检查；当前源文件确实存在，但这些不是本轮截图或浏览器会话。
- 2026-11-16旧包的22+52+6、Python3.11下限、独立wheel安装、旧SDK1.30互操作均只属历史；未重新安装或重跑下限环境。

## 6. 未运行项目与原因

| 未运行 | 原因/状态 |
|---|---|
| 原始ZIP检查/解压 | 指定ZIP未提供；只有已解包26文件manifest，ZIP容器完整性UNKNOWN |
| `pnpm -C frontend test:host`（含skip-image变体） | 源码仍要求已删语言控件；会写宿主语言/主题、上传/执行并覆盖原证据。此次只读审计不执行 |
| IMAGE执行、绘制/拖动/Undo/Save菜单 | 会改变宿主状态/产生历史；保留已有失败，不绕过用户禁修范围 |
| uv sync、pnpm install、Playwright install | 禁止安装/下载或改运行环境；现有依赖已足够 |
| uv build MCP、全packaging、check_install | 创建安装环境或联网下载构建依赖；记录未运行，不将旧wheel当本轮新包 |
| PyPI包安装、Registry安装、发布、Tag/commit/push | 不在授权范围；PyPI版本GET足够确认当前前置缺失 |
| 远程Actions、Manager三安装路径 | 无本轮执行证据，UNKNOWN |
| pre-commit、mypy | pre-commit会自动fix且版本冲突；mypy未纳入项目实际依赖/CI |
| 真实代理、浮动Sidebar、200%缩放、Siril/FITS/Memory/RAG | 前者缺本轮环境验收；后者产品未实现 |

## 7. 工作树并发变更与保全

开始时以git tracked+非忽略新文件建立136文件hash基线，排除第三方reference、原始资料及旧handoffs大包，另对输入26文件做manifest校验。最终source-after对相同路径比较。

本审计自身只新增五份交接、evidence及task-note，未写源码/配置/测试。期间外部操作更新了App标题翻译、sidebar宿主容器、CSS和编译产物；这些在`concurrent-changes.json`逐项列明，并已重新读取和复跑相关检查。不能声称整个共享工作树自始至终完全没变，也不能将这些变更归功于本审计。

原始Latest_Handoff再次按manifest复核；AGENTS、旧FRD、Guide、已有需求/开发文档、锁和后端未被本任务改写。输出证据文件哈希清单见`DELIVERY_MANIFEST.json`。文件hash帮助识别漂移，不证明测试覆盖所有功能。

## 8. 证据重放

日志命名对应表V01–V26。`build-isolated.mjs`保存实际隔离构建辅助程序；复制到独立临时目录再执行，并设置NODE_ENV=production。不要在evidence目录直接运行后将生成产物混入交付。其它命令按表在仓库根运行，确认依赖已安装与当前任务授权后再选择。

检查输入hash可复现为：读取原bundle/manifest.json，依次对`files[].path`进行resolve+根目录包含校验，比较SHA256和bytes。完整内容见input-hashes.json；历史缺失日志记录在historical-manifest-check.json。
