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
