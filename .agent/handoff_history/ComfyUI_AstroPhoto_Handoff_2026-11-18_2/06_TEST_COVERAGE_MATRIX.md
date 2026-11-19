# S8 当前技术验证

## 快照与环境

- `CURRENT_RUN` 于 2026-11-18 09:42–09:45 CST 在现有工作树执行。分支 `main`，HEAD `003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505`，提交时间 06:10:34 CST。验证前后 Git 跟踪内容均无差异。已有未跟踪项目为 `.agent/`、`.agents/skills/astrophoto-sop/`、`.artifact/`、`reference/`。
- Windows，现有根 uv workspace 虚拟环境 Python 3.12.15、Pytest 8.4.2、aiohttp 3.14.5、Astropy 7.2.4、FastMCP 4.2.0。Node 26.8.2、pnpm 11.13.1、uv 0.13.8、Playwright 的既有 Chromium。临时结果根为系统 TEMP 中的 `astrophoto_h0_verify_work`。
- 根与 MCP 禁用 pytest cache provider，pytest 临时目录及 JUnit 写入 TEMP，正常 Python 及 Python 测试子进程禁用 pyc。发布 fixture 的 `uv build` 使用 `UV_OFFLINE=1`、已有构建依赖缓存及临时输出。未运行安装、同步、远程 CI、发布或宿主写入。

## 本轮实测

下列文件名指向本轮原始日志和机器报告。日志包含绝对 TEMP 位置、命令、起止时间和退出值。时间为 CST。

| 套件或检查 | 真实结果 | 原始证据 | 断言环境 |
| --- | --- | --- | --- |
| 根 pytest | 82 PASS、5 SKIP，exit 0 | `python-extension.txt` / `python-extension.xml` | 真实临时 SQLite / 文件 / 合成 FITS、aiohttp TestServer、宿主 API stub；临时 Registry ZIP、wheel 与 sdist |
| MCP pytest | 67 PASS，exit 0 | `mcp.txt` / `mcp.xml` | FastMCP 内存客户端、HTTPX MockTransport、真实 stdio 子进程；未连接真实授权宿主 |
| React 项目默认 Jest 配置 | 11 suites、51 PASS，exit 0 | `react.txt` / `react.json` | JSDOM / Testing Library，项目原有 CSS 映射与 Host mock；仅加无缓存及机器报告参数 |
| Vue Vitest Chromium | 3 files、9 PASS，exit 0 | `vue.txt` / `vue.xml` / `vitest-isolated.mts` | 现有真实 Chromium 和 Canvas，宿主 stub。临时配置只调整缓存目录与失败截图，测试加载现有 bundle |
| Vite 隔离生产构建 | 1000 modules，exit 0；JS/CSS 的 SHA-256 与工作树一致，工作树原字节 Git blob 与 HEAD 一致 | `isolated-build-fixed.txt` / `vite-isolated.mts` | 同一 Vite 配置，仅将两级输出目录及缓存转向 TEMP |
| 构件、代理 | 两条均 exit 0 | `check-build.txt` / `check-proxy.txt` | 单 JS／共享 CSS、相对宿主 URL；真实 Chromium + 回环 HTTP stub，无页面异常 |
| 前端静态检查 | typecheck / eslint 均 exit 0 | `typecheck.txt` / `frontend-lint.txt` | Vue/React 类型检查及 React lint |
| Python / 版本 / Git 静态检查 | Ruff、uv offline lock、release check、git diff --check 均 exit 0 | `ruff.txt` / `uv-lock.txt` / `release-check.txt` / `git-diff-check.txt` | release check 给出 lockstep `0.0.1`；uv 解析 125 packages |
| SOP v2.2 原包 | SHA-256 与 453 个包内链接校验通过，exit 0 | `bundle-check.txt` | 24 个 Markdown。此结果对应已安装技能包 |
| SOP 上下文引擎 | 20 合成用例 PASS，exit 0 | `context-tests.txt` | 临时目录状态机、视图和 CLI 输出，涉及 H0/H5、重放、提及、归档与完成门 |

构建探针 `isolated-build.txt` 保留原始失败。第一次 CLI 仅传 `--outDir`，配置的 `rollupOptions.output.dir` 优先，Vite 在默认 `js/` 重写同内容构件，临时目录无文件，探针 exit 2。第二次同时覆盖两级目录，真实隔离输出成功。两份跟踪构件的原始字节 Git blob 与 HEAD 都一致，跟踪文件内容没有变更。JS SHA-256 `f4731ea6d6208e328096708d9f97375e38d173626f1774219a1eb0758f91081b`，CSS SHA-256 `62669a1fb90a0b1ef793125dc5117f5b3cf0e62866d2812e6e2b57ac485b86b4`。

### 本轮五项跳过及报告边界

| 测试位置 | 原因 |
| --- | --- |
| `tests/backend/test_siril.py:164`、`:201` | 两个真实 Siril 1.4.5 CLI 测试需要显式 `ASTROPHOTO_SIRIL_TEST_CLI`，本轮未启用 |
| `tests/backend/test_storage.py:345`、`:445` | 未指定授权的第二本地卷，测试进程未找到适用的第二卷 |
| `tests/integration/test_host_runtime.py:14` | 未设置 `COMFYUI_TEST_URL`，未接触存量真实宿主 |

本轮未启动真实 ComfyUI、未执行真实宿主队列／Storage、设备、Siril 的宿主写链、未复跑 Python 3.11、未进行远程发行、并发压力和平台矩阵。JUnit / Jest 用例计数与断言结果适用上述各环境。没有行覆盖率数据。

## 可复现命令

从项目根目录运行。准备一个新的 TEMP 子目录作为 `$testRoot`。已执行的原始命令见日志，以下保留同一参数：

```powershell
$env:UV_OFFLINE='1'
$env:PYTHONDONTWRITEBYTECODE='1'
& '.venv/Scripts/python.exe' -B -X utf8 -m pytest tests/nodes tests/backend tests/integration tests/packaging -p no:cacheprovider -q -ra --basetemp (Join-Path $testRoot 'extension-temp') --junitxml (Join-Path $testRoot 'python-extension.xml')
& '.venv/Scripts/python.exe' -B -X utf8 -m pytest -c mcp/pyproject.toml mcp/tests -p no:cacheprovider -q -ra --basetemp (Join-Path $testRoot 'mcp-temp') --junitxml (Join-Path $testRoot 'mcp.xml')
pnpm -C frontend test:react --no-cache --json --outputFile (Join-Path $testRoot 'react.json')
pnpm -C frontend exec vitest run --config $newConfig --configLoader runner --no-cache --reporter=verbose --reporter=junit ("--outputFile.junit=" + (Join-Path $testRoot 'vue.xml'))
pnpm -C frontend exec vite build --config $buildConfig --configLoader runner
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend check:build
pnpm -C frontend check:proxy
& '.venv/Scripts/ruff.exe' check --no-cache astrophoto nodes mcp/src mcp/tests scripts tests __init__.py
uv lock --check --offline
& '.venv/Scripts/python.exe' -B -X utf8 scripts/release.py check
git diff --check
& '.venv/Scripts/python.exe' -I -B -X utf8 .agents/skills/astrophoto-sop/scripts/verify_bundle.py .agents/skills/astrophoto-sop --check-manifest
& '.venv/Scripts/python.exe' -I -B -X utf8 -m unittest discover -s .agents/skills/astrophoto-sop/tests -p test_context_manager.py -v
```

`$newConfig` / `$buildConfig` 由证据目录的 `vitest-isolated.mts` / `vite-isolated.mts` 生成，原始绝对路径应按复跑机器调整。校验运行没有使用 build 后自动覆盖工作树的项目默认 `frontend test` 脚本。

## 代表性断言与环境边界

| 领域 | SOURCE 定位与断言 | 执行证据 |
| --- | --- | --- |
| Core / Storage | `tests/backend/test_storage.py:52–61` 校验重入 identity、默认引用模式、20 GB 配额、SQLite WAL/FK；`:259–280` 模拟受管文件已发布而 DB flush 后失败，确认错误与空资产列表，再启动后的幂等恢复、一个成品和清空 staging | 根 pytest，临时真实文件和 SQLite |
| 设备光路 | `tests/backend/test_equipment.py:238–260` 注入光路历史删除后故障并断言光路状态恢复，后续断言保护他项历史和不可变触发器；`:87–92` 无效字段不持久化 | 根 pytest，SQLite／事务 |
| Node / Vue IMAGE 边界 | `tests/nodes/test_image_io.py:4–20` 验证 V3 LoadImage 委托返回宿主对象，坏路径在宿主 IO 之前报错；`frontend/tests/widgets/serialization.test.ts:8–78` 覆盖像素精确恢复、空旧值、坏值、上传请求和断网时 null contract | 根 pytest 的 Host stub 与 Vue Chromium 分别验证；真实 Vue workflow 尚缺当前执行 |
| Siril/科学 API | `tests/backend/test_siril.py:76–157` 比较 FITS 精度/头信息、拒绝截断或非绝对路径、参数范围、版本前置校验及受控子进程取消/超时；`tests/integration/test_siril_api.py:22` 源与缓存身份及 HTTP 边界 | 根 pytest 的真实 FITS 与测试 HTTP；两个官方 Siril 子进程用例明确 SKIP |
| Inspector 交互 | `frontend/ui/src/__tests__/scientific-node.test.tsx:83–151` 真实生产 Node View 由受控替身挂载，断言参数越界拒绝、宿主 Widget 通知、预览 HTTP payload、重置、宿主拒绝编辑及单色禁联动；`siril.test.tsx:9–75` 校验版本不配时保留配置、对比视图及键盘交互 | 默认 Jest 当前全绿，测试 Host mock |
| MCP | `mcp/tests/test_server.py:44–80` 验证内存 Tool 状态/诊断错误契约，`:93–108` 测试真实 stdio 初始化、工具列出/调用及关键输出流格式 | MCP pytest，宿主使用 mock／未连接真实授权用户 |
| 包装和反代 | `tests/packaging/test_contents.py:20–57` 断言 Registry 运行时文件、拒绝 MCP/数据库泄漏、MCP wheel/sdist 拒绝扩展代码、宿主 URL 保持前缀；`frontend/ui/check-proxy.mjs:33–47` 断言三个扩展按预期注册、全资源 200、页面无错误 | 根 pytest / Chromium 本地 loopback stub |
| H0–H5 状态机 | `.agents/skills/astrophoto-sop/tests/test_context_manager.py:190` 五个后继轮归档且业务事实保留，`:241` 缺观察和 UNKNOWN 阻断，`:263` touch 恢复正文后新 H0，`:284` 老事件重导出不唤醒 | 20 个合成用例 PASS。本轮真实 H0 与语义覆盖由迁移输入、正式检查及 Main 回执独立证明 |

## 历史运行及冲突处置

- `HISTORICAL_RUN` 2026-11-18_1 的 `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/evidence/test-runs.md` 和同目录 `test-results/` 保存隔离 Python 3.11/3.12 各 83 PASS、3 SKIP（包含两个真实 Siril 1.4.5 用例）、各 67 MCP PASS、9 Vue PASS、一个只读真实宿主 GET 及浏览器检查。历史测试文件和范围与当前 HEAD 有差异。历史 Vue/真实宿主存在多种实例和 schema，须成对使用各自端口与快照。
- `HISTORICAL_RUN` 旧默认 Jest 因 CSS loader 未收集六个 suite，临时 CSS 映射探针仍有坏 Siril fixture。当前 `frontend/jest.config.cjs` 明确映射 CSS、SingleSelect 和 MultiSelect Vue 替身；当前默认命令 11 suites/51 PASS。旧失败继续保留历史身份，当前判定使用本轮命令和机器报告。
- `SOURCE` 当前 `docs/siril.md:67–69` 记录两个成功的 Windows 隔离原生队列回执及 Prompt ID，包含链式 IMAGE_PATH、输入哈希、未登记路径、第二 Workspace 与保存重开。证据属于历史真宿主运行。当前实际执行覆盖见上表。



[命令与结构化回执](migration/VALIDATION_COMMANDS.md) · [Test 映射](migration/OLD_ID_MAP.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/06_TEST_COVERAGE_MATRIX.md)

```markdown
# 测试覆盖与本轮实际结果

2026-11-18 Windows 本地，已装环境。每个运行的完整命令、开始和结束、时长及退出码见 [执行索引](evidence/test-runs.md)。[反向用例表](evidence/test-inventory.md) 保存 pytest 参数化结果、Jest / Vue 实际用例，以及源码定义和断言索引。子报告提供断言的人读解释。未用 coverage 工具，以下没有行覆盖率。

| 套件或检查 | 本轮状态 | 断言环境和范围 |
|---|---|---|
| Python 3.12.15 根套件 | 83 passed / 3 skipped，exit 0 | 真实临时 SQLite、文件、合成 FITS、aiohttp TestServer、宿主 API stub 和临时 wheel/sdist/Registry 构件。含两个真实 Siril 1.4.5 进程用例。分组 62 backend、6 nodes、7 aiohttp integration、8 packaging 通过 |
| Python 3.11.18 既有隔离环境同根套件 | 83 passed / 3 skipped，exit 0 | 同一测试定义独立跑。两条真实 CLI 用例也启用。与 3.12 是重复验证 |
| MCP 3.12.15 / 3.11.18 | 各 67 passed，exit 0 | HTTPX MockTransport、FastMCP 内存 Client 与真实 stdio 子进程；无真实 Token 连宿主 |
| React 项目默认 Jest 命令 | 4 suites / 13 tests passed；6 suites 在加载时报错，exit 1 | CSS 缺少 moduleNameMapper，EnvironmentPage 和 Inspector 导入触发。六个套件未收集，不能算作通过或断言失败 |
| React 临时 CSS 映射 | 9 suites / 46 tests passed；1 suite / 1 test failed，exit 1 | 仅用交接目录的 audit-jest.cjs 和 CSS 空模块。siril.test.tsx:8 的 fixture 缺少必填 enabled，Siril DTO 拒绝，实际呈现 Cannot reach the Siril service；测试也仍按旧详情入口直接查表单。当前默认结果保持失败 |
| Vue Vitest Chromium | 3 files / 9 tests passed，exit 0 | 真实 Canvas 与上传 payload、内存替身宿主注册。直接 vitest run 使用当前磁盘 bundle，绕开默认 test 脚本重建 |
| 真实 ComfyUI HTTP | 1 passed，exit 0 | 8207 的 GET status、vue-basic 真实注册；另以只读 GET 检查四节点 Schema 和两产物哈希 |
| 真实 ComfyUI 浏览器 | 1 项只读脚本成功，exit 0 | 8207 Chromium，仅放行同源 GET/HEAD/OPTIONS，确认单 Sidebar、中文三栏、Nodes 搜索存在、Storage/Equipment/Software/Environment 入口、观测地已移除。未改设置与用户图 |
| Vite 和代理 | 隔离新构建、check:build、check:proxy 均 exit 0 | 新输出在系统 TEMP，JS/CSS 哈希与工作树相同；代理是本地 Chromium + 测试 HTTP 服务和假宿主 API |
| 类型、Lint 与依赖 | 前端 typecheck、eslint、Ruff、uv lock --check --offline、release.py check、git diff --check 均 exit 0 | Git 输出 CRLF 提示，非 diff 错误。CI Ubuntu 远程没有运行证据 |
| 跨卷和正式宿主 workflow | NOT_RUN | 两条跨卷按显式第二测试卷未选入。host 标记在根套件跳过，独立只读 host-get 已通过。通用 host-runtime、storage/equipment/siril-host 会写设置、流程或数据/外部证据，为本轮保持只读未运行 |
| 远程发行和联网安装 | NOT_RUN | 本地包装与清单已测，未上传或装 PyPI 已发布版本。三平台、未安装版本及资源压力不可由当前测试推广 |

没有记录 xfail。临时配置探针的两次命令拼装失败留在日志，不计入应用测试结果。完整结果以机器报告和最终通过执行的日志为准。

## 正常、错误与恢复覆盖

| Feature | 正常和边界 | 错误、恢复与清理 | 测试与证据 | 缺口 |
|---|---|---|---|---|
| B-01..05 初始化/配置/DB | 重入、真实 WAL/事务、版本 | 被损坏/过期 DB 保留，锁争用与备份、初始化中断 | test_core.py、test_status.py、test_storage.py、test_status_api.py | 异常 FS / 锁竞态矩阵 |
| B-06..37 Workspace/Cache/操作 | 多 Workspace、默认/禁用、租约和 owned 清理、真实同盘迁移 | 权限/冲突、低空间、路径、迁移前后 DB checkpoint 与中间操作 | test_storage.py、test_storage_api.py 实际隔离 | Windows 第二卷、所有失电状态与外部篡改，失败可能留自有目标 |
| A-01..19 资产 | reference/copy/preflight、覆盖策略、真实文件、Session 关系 | 源变更、staging、取消、幂等、进程重启恢复 | 同盘的 SQLite 与文件；TestServer 限定路由 DTO | 跨卷，完整 HTTP inspect/会话/失联操作，真实限权目录 |
| A-20..44 设备与光路 | 规格 CRUD、passbands、光路顺序和兼容 GET、归档及物理删除 | 错误角色/重复、FK、乐观并发、含历史时失败注入、权限/Bearer | test_equipment.py backend / aiohttp 与 JSDOM（仅 CSS 探针） | 并发合并正确性、历史-only 引用与新归档设备、活宿主写链 |
| N-01..05 Node/FITS | V3 注册、mono/RGB、真实前图和科学文件 | 损坏截断、路径、fingerprint；旧 Vue DTO 异常 | Node stub、当前宿主 GET、Astropy tempfile | 正式 Vue host IMAGE、轴/大文件/内存、连接复杂子图 |
| N-06..08 / N-15..23 Siril | 指定 1.4.5、参数默认、实际正式 FITS 产出 | 错版本、坏 path、参数注入拒绝、真实子进程 timeout/cancel；原件保持、部分 run 恢复 | test_siril.py pytest+真 CLI 两用例，本轮非宿主 queue | 大资源压力、Linux/macOS、真实 CLI 进程中取消的完整场景 |
| N-09..10 / N-24..27 Preview | 临时 source PNG 与状态、分辨率设置静态链 | 未配置 CLI、跨源、源消失报失效、after 404 | test_siril_api.py 的 TestServer、真实 FITS/Pillow | 成功候选、布置更新和并发、Blob 资源及真宿主 |
| F-01..21 前端 | Tab、搜索、翻译、Canvas 与详情，通用 Inspector 分割 | 负面 DTO、只读 Canvas、卸载、删除拒绝（替身），旧绘图像素 | React 默认失败与探针分列；真浏览器 8207 GET+Vue Chromium | 实际 Inspector 调参／重置同步到画布、预览刷新及宿主编辑限制、主题/窄栏比较、收藏跨页同步、处理配置 fixture |
| M-01..08 / M-09..14 MCP/包 | 工具枚举、stdio、版本、部分 HTTP、打包边界 | 重复注册、无效配置、DTO/timeout、模拟坏 archive | 67 MCP 用例、根套件 8 项打包、隔离构建与 proxy | 4 个条件光路工具只有枚举断言，缺真实授权与远程发行 |

每个 Feature 的相关 guard/测试代码定位沿 [清单](04_COMPLETE_FEATURE_INVENTORY.md) 到 [防御矩阵](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 和所属子报告。机器反向索引遇到 helper、动态生成及断言跨函数时标识限度，不能以同域测试数量推断某个 Guard 已有效负面验证。
```
