# 验证与证据边界

## 本地存储评审修复（2026-11-21）

HEAD `f84442b` 加工作树。R-01～R-05 的正式回归和预检/解绑 HTTP 用例通过。根 `pytest tests` 118 通过、6 跳过，MCP 92 通过，Storage Chromium 7 通过，Ruff 与 Vue 类型检查通过。两次 catalog 中断以故障注入验证，HTTP 使用 aiohttp TestServer。隔离真实宿主退出/恢复、真实第二卷和物理拔插等仍待验。 [后端流程](backend-overview.md)

## Siril CLI 1.4.5（2026-11-21）

官方 Windows Portable CLI 与 ComfyUI 0.46.0 / Frontend 1.59.6 核对 183 个原生 Siril 节点和 201 条命令目录。经典及 Nodes 2.0 均验证旧 AutoStretch 的候选、队列与保存重开，并跑通 crop → Gaussian Blur → Negative 的正式路径链。真实后端用例另覆盖序列、CSV 和原件不变。StarNet、Astrometry.net、远端星表和其他平台仍缺独立运行样本。

CH-05 在同版本隔离宿主复验中英文及经典和 Nodes 2.0。核对 18 个一级图像处理类别、21 条末级路径、183 个原生节点定义、201 条命令及别名搜索、节点介绍和工作流恢复。原生节点库实点验证多级色彩目录。定向 Python 43 项、前端 80 项、类型、Lint、构建与代理检查通过。

## 当前 Vue 构件验收（2026-11-21）

侧栏首页修复后，现行工作树前端 Vitest 14 文件 76 项通过，类型、Lint、构建及代理验证通过。本地 ComfyUI 0.46.0 / Frontend 1.59.6 的独立浏览器标签验证了重按 Nodes、Assets、Settings 回首页，以及切出存储后重新进入 Settings 模块列表。素材导入直达和编辑取消确认由组件测试覆盖。

| 范围 | 当前证据 |
| --- | --- |
| 构建和发行 | Node 26.13.1、pnpm 11.13.1、Vite 8.2.2、Vue 3.5.42。干净目录锁定构建，JS/CSS SHA-256 与工作区和 Registry 解包一致。独立官方 ComfyUI 0.46.0 / Frontend 1.59.6 在域根及代理子路径实际加载，未观测到浏览器异常。 |
| 本地回归 | Pi 修复后，Vitest Chromium 13 文件 61 用例通过，Python nodes/backend/integration 含真实 CLI 和宿主探测共 82 项通过、2 项跨卷条件跳过。打包 10 项、MCP 67 项通过。类型、lint 和相关 Ruff 通过。远端 CI 尚无本工作树记录。 |
| 真实宿主 | 经典及 Nodes 2.0 验证单侧栏、节点、子图、撤销/重做、保持目录打开切换画布并拖放、旧画板像素及临时 `[temp]` 引用。设备、工作区迁移和环境设置通过复验。重启持久性、删改约束及新旧 UI 对照保留自上一批真实宿主验证。 |
| 科学与 Bundle | 真实 Siril 1.4.5 两画布正式队列，FITS 同 `3 × 96 × 96`、`BITPIX=-32` 和样本 `OBJECT`，源哈希不变。无 Bundle 的独立真实宿主保留通用 FITS 和预览配置。主动缩小验收到前端临时绘图引用，Python IMAGE 下游保持独立。 |

下面的旧 React 与早期宿主数据为迁移前基线。

同日 F-6 定向复验使用真实 Siril 1.4.5。在 Windows 父环境 MSYSTEM=MINGW64 和未设置 MSYSTEM/MSYS 时，各 17 项通过，包含真实候选 PNG 和正式 FITS。普通环境另通过后端与集成 82 项，跨卷跳过 2 项，宿主标记用例未选中。此前双画布浏览器证据继续对应上一版构件。


## 最近期执行

2026-11-21，Windows 工作树 `4c0cf4d`。以下为本次交接前已执行的验证。

| 命令 | 结果与边界 |
|---|---|
| `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 82 通过、5 跳过。真实临时文件、SQLite、aiohttp 与宿主替身及本地构件。未输出逐项跳过原因；历史同套件的可选测试分别需要 Siril CLI、第二卷及真实宿主地址。 |
| `uv run --project mcp pytest mcp/tests -q` | 67 通过。包括 HTTPX 模拟、FastMCP 内存客户端和真实 stdio。 |
| `pnpm -C frontend test:react` | 11 套件，51 通过。JSDOM/RTL 与宿主模拟。 |
| `pnpm -C frontend test` | 首次缺 Chromium；安装后构建成功，3 文件、9 Vue Chromium 通过。真实 Canvas，宿主和上传替身。 |
| `pnpm -C frontend typecheck`、`pnpm -C frontend lint` | 通过。 |

## 仍适用的历史结果

- 宿主 0.45.0 / Frontend 1.59.1、Conda comfyenv 接入成功。旧 base 环境因 Torch 缺 custom_op 在插件加载前失败。2026-11-17 真实宿主 GET 验证状态、vue-basic schema 及单 JS，两个默认诊断工具也经真宿主 HTTP 验证。该次以读取为主，未执行队列或改写设置。
- 隔离宿主使用 `pnpm -C frontend test:host --skip-image-execution` 通过 16 项，含真实 PNG 工作流重开和像素保持，显式跳过正式 IMAGE。更早的真实 IMAGE 路径失败仍单独保留。
- 独立宿主曾验证 Sidebar 的 Unicode 语言切换、明暗主题、键盘焦点、窄宽布局和迁移弹窗取消；纯打开和取消没有证明数据迁移。另有隔离存储专项验证 C→D 迁移、外部引用、copy 及重启持久化；拔插、真实 ACL、盘符重映射及其他平台仍缺证据。
- 设备旧光路版本历史曾测试重启持久化与真实 stdio 读取。单配置时代的专项覆盖版本保护与删除故障回滚，隔离宿主运行过删除验收。旧版本发布交互不得算作当前可用。
- Siril 1.4.5 曾以 Windows 隔离宿主完成资产输入、独立本机路径、Inspector、队列和重开；另有两个 AutoStretch 串联，第二节点输入哈希等于前一个输出，原件哈希不变。C: 源及缓存与 D: Workspace 的历史验证需与当前工作树复验区分。
- 真实授权宿主、当前 Siril、跨卷、真实 IMAGE、线上安装与发布本次均未复验。原始历史聊天和部分附件/日志缺失，旧审计曾记录 33 个被引用的日志未提供。已有报告支持上述结果及边界。

## 绘图 IMAGE 的独立复验

在隔离宿主运行 `pnpm -C frontend test:host`，不传 --skip-image-execution；检查旧脚本的侧栏前置断言是否仍适用。最小队列链需要图像上传已返回 `threed/<name> [temp]`。Prompt 中节点 1 为 vue-basic，输入 `custom_vue_component_basic: {image: "threed/<name> [temp]"}`；节点 2 为 PreviewImage，输入 `images: ["1", 0]`。按 prompt ID 读取 /history，只有 status_str 为 success 且节点 2 有 images 才通过。脚本失败时输出 `FAIL existing Python LoadImage path contract` 并保存该次 history。历史摘要未保存可逐字核实的异常原文。

## 历史材料的迁移边界

旧项目审计的 2026-11-16 本地证据含两版本 Python、旧宿主启动失败、Registry 21 / wheel 14 / sdist 20 项和隔离 wheel 握手。2026-11-17 的真实宿主只读证据以及后续画板、存储、设备和 Siril 宿主操作证据已按上文保留。旧截图布局的有效约束进入前端章节与兼容决定；多版同义快照、机器哈希清单、旧工具过程日志、草图和无行为差异的旧测试数字已合并或省略。早期原始 Storage 需求、设备规格空附件、部分旧日志及完整聊天仍缺失，无法恢复原文。

## 各项证据的证明范围

| 领域 | 可复用的实测结果 | 仍须明确的验收边界 |
| --- | --- | --- |
| 真实宿主 UI | 已对照单侧栏的标签宽度、间距、选中态、键盘、主题与语言。存储 280/420/640px 布局、原生弹窗取消有独立记录。 | 这些结果针对旧宿主版本和旧栈，不能证明迁移后的 Vue、Nodes 2.0 或新浏览器流程。取消弹窗与真实写链分别记录。 |
| 存储与资产 | 隔离宿主浏览器覆盖预检、导入、迁移、刷新与重绑，重启后核对 Workspace ID/root、mode、schema、资产数。真跨卷对照 4 份副本与源 SHA-256。 | 受信本机单用户条件、真实第二卷和试验根必须记录。离线盘的目录移走、故障注入和真正断电或任意 ACL 是不同证据。 |
| 设备及光路 | 单配置时代隔离 0.45.0 / 1.59.1 上运行试验和重启后删除。后端故障注入发生在删旧 revision、重建 trigger 之前，回滚保留配置、默认指针及快照；成功重试只影响目标。 | 旧可发布 revision 浏览流程只证明旧版。过期写冲突、旧快照专属引用和多客户端分别验收；不凭单次冲突测试证明任意并发合并。 |
| 设备 MCP | 历史隔离 ComfyUI 上，正确令牌可调六个只读工具，错误令牌返回工具错误，正确只读令牌发 POST 得到 403；另有独立 FastMCP legacy stdio 证据。 | 工具在客户端枚举出来不代表目标宿主已启用或令牌匹配。当前快照上没有重跑这些真实授权调用。 |
| Siril 工作流 | Windows 0.45.0 / 1.59.1 和 Siril 1.4.5 曾用未登记路径进行候选、Inspector、正式运行与重开。链式 run 的 prompt ID 为 `b4b3983a-e730-4d80-a85a-2bccdacbb914`，后一输入哈希等于前一输出。Horsehead 的 WCS 被改写时禁用 wipe，尺寸和位深按实际输入输出记录。 | 当前真 CLI、强杀后的跨平台进程清理、macOS/Linux、高容量、复杂子图及新宿主均有独立覆盖缺口。处理样本的位深结果不能外推到所有 FITS。 |
| 包与代理 | 历史构建校验单 JS / CSS、代理前缀和本地双包，做过独立环境 wheel 安装和 stdio 探针。 | 本地构件与公开上架是两道验证；公共 PyPI 能否解析、Registry 后的 Manager 装机、实际升级仍需运行证据。 |

## P0 迁移如何记录结果

开始前保存旧工作流及输入样本，记录主题、语言、侧栏宽度、画布模式、宿主与依赖版本。模块验收用相同条件逐项记录 UI 变化、状态及原生操作，再在指定版本做真实宿主复验。验证链涵盖当前实现基线、干净锁定安装、类型与 lint、Vue 组件/Vitest、代理构件、两种画布真实宿主、设备/存储写入、Siril 和双包检查。每项提供 FR 号、执行条件、具体操作或命令、回执及未验证原因。当前 P0 只有定稿要求和设计/实施草案，没有迁移完成结果。


## 摄影素材库 v0.7 验证

2026-11-21，HEAD f84442b 加同时存在的工作树改动。FastMCP 4.2.0 包内 Client 与实际 stdio 测试 92 项通过；真实 FastMCP Client 经原生 aiohttp 到隔离 SQLite 的审批流程另有通过记录。真实 ComfyUI 0.46.0 / Frontend 1.59.6 运行 Reference、浏览器 Copy、跨 Tab 拖放、V3 资产／集合执行与 Siril 主动收录。经典及 Nodes 2.0 均取得浏览器运行证据。2.5 GiB Copy 单独通过 loopback HTTP 和内容哈希。Chromium 前端最终回归 74 项通过。真实宿主带令牌的 FastMCP stdio 审批、超大目录浏览器全流程与辅助技术矩阵仍缺证。
