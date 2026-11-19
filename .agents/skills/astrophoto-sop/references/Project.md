# AstroPhoto 项目背景、复用与验证

[返回 SKILL.md](../SKILL.md) · [核心原则](Principles.md) · [记录字段](Records.md) · [官方来源](Sources.md)

## 目录

- [资料身份与使用边界](#project-snapshot)
- [项目职责与需保留的背景](#project-boundaries)
- [官方和项目代码复用](#project-reuse)
- [版本与运行实例](#project-runtime)
- [验证层级与命令](#project-verification)
- [容易误判的具体案例](#project-cases)
- [数据与环境处置](#project-data)

<a id="project-snapshot"></a>

## 1. 资料身份与使用边界

本文件保留用户上传的 SOP v1.0、v1.1、评估文件与窗口对齐规则中的项目知识，供后续 Agent 定位。它不是本轮源码审计或测试报告。

原材料记载的接手快照为 **2026-11-18、`main`、提交 `003c599`**；更早审计提及 `5e39fcf` 及其未提交工作树。版本示例为 Extension/MCP `0.0.1`、ComfyUI `0.45.0`、Frontend `1.59.1`，Siril 目标 `1.4.5`。执行前从实际环境重新取证，不将这些值写成本轮查询结果。

历史本机根目录为 `C:\Users\Administrator\Desktop\WorkSpace\ComfyUI\custom_nodes\ComfyUI_AstroPhoto`。优先使用用户当前指定或已经确认的目录；以下代码路径均为历史仓库相对定位线索。

对照源码后分别记录“保留的产品决定”“当前源码事实”“运行实例事实”“历史验证”和“本轮验证”。新明确要求决定目标，当前代码决定现状，二者不相互冒充。

材料记载的源码路径、函数和测试只能帮助检索；未能访问对应文件时写清缺口，不能声称已经核实。S4/S8 的完整包必须带入完成本次工作所需的背景、来源和边界，不依赖接手者另找本文件或旧附件补齐必要事实。

<a id="project-boundaries"></a>

## 2. 项目职责与需保留的背景

| 领域 | 材料记载的行为与边界 | 后续查证入口 |
|---|---|---|
| 宿主 | ComfyUI 拥有 Graph、Canvas、队列、Undo/Redo 和工作流执行 | 实际宿主源树及当前扩展接入点 |
| Extension | 负责天文业务、持久化、资产、设备和受控 API；复用宿主能力 | 扩展注册入口、`astrophoto/`、`nodes/` |
| React Sidebar | Nodes / Assets / Settings 页面；需保留主题、窄栏、键盘和生命周期行为 | `frontend/ui/` |
| Vue Widget | 与 React Sidebar 共存；相关图内控件有独立挂载、更新与销毁边界 | `frontend/src/` |
| 前端构件 | Vite 曾向宿主输出可发现的 `js/main.js`；CSS、资产 URL 和代理路径需一起检查 | `frontend/vite.config.mts`、`frontend/ui/check-build.mjs` |
| 数据根与资产 | 默认 Data Root `~/.astrophoto/`；独立 `assets.db` 管理多个 Workspace | `astrophoto/storage/`、`astrophoto/assets/`、`docs/local-storage.md` |
| 导入方式 | 默认 reference 保留原件；copy 按次授权，记录复制与登记的结果 | 实际导入服务、HTTP 入口及文件操作 |
| 产物归属 | 持久产物归 Workspace，可重建预览归 Cache；接收、发布和最终登记分别核查 | 实际路径规划、资产登记、清理与恢复代码 |
| 设备与光路 | 单个可编辑配置、有序配件与滤镜集合；旧 Revision 的兼容读取单独保留 | `astrophoto/equipment/trains.py`、`frontend/ui/src/features/settings/equipment/`、`docs/equipment.md` |
| 科学节点 | V3 AutoStretch 接收一个 `IMAGE_PATH` 并输出结果文件路径；资产 ID 用于登记和回执 | `nodes/scientific.py`、`astrophoto/siril/processing.py` |
| Siril 与图像 | 受控目录内执行 `load → autostretch → save`；正式处理产物为 FITS，预览 PNG 分开 | 实际处理链、输出验证与 `docs/siril.md` |
| Inspector | 编辑当前节点的 `shadowsclip`、`targetbg`、`linked` 并写回宿主节点；受宿主权限和单色条件约束 | `frontend/ui/src/host/scientific.tsx` |
| 独立 MCP | 通过 Extension HTTP 访问；不能直接读写 SQLite，不能把本地加节点解释成远程 Canvas Bridge 已实现 | `mcp/src/astrophoto_mcp/server.py`、`astrophoto/api/`、`docs/mcp.md` |
| 设备 MCP | 历史首期为可信本机直连/回环条件下的只读能力，另核对有效凭据；诊断工具保留其契约 | 实际服务端授权、tool 注册及调用链 |

光路的旧多版本产品流程已在材料中标为被取代。保留旧 Revision 读取兼容，不等于恢复发布版本或重新引入多配置编辑。

Asset Import 的授权根与可信本机 Siril 的路径读取属于不同信任边界，必须各自沿服务端调用链核查。不能将其中一套放行规则套到另一套入口。

历史明确撤销的文件大小限制、正式处理 timeout 和总并发硬上限，不因新 Agent 的默认偏好自动恢复。新的限制先给出实际问题、影响和用户可见取舍；已有明确决定直接沿用。

<a id="project-reuse"></a>

## 3. 官方和项目代码复用

1. 按可观察行为拆分需求，明确前端、后端、Node、MCP 或外部 CLI 所属，记录目标宿主版本。
2. 读取实际仓库生效的 `AGENTS.md` 和相关 Skill。历史定位为 `.agents/skills/astrophoto-reuse-reference/SKILL.md` 与 `.agents/skills/astrophoto-frontend-reuse/SKILL.md`，是否存在及内容以现场为准。
3. 有 `.codegraph/` 且索引可用时先查精确路径、符号、调用方，再读源码；核验索引标记过期的文件。没有可用索引时使用 `rg`，注明搜索范围。
4. 前端先读当前组件表、`template/` 原码、项目已有适配，再查目标版本 `reference/ComfyUI_frontend` 或官方前端源树。
5. 后端查真正 ComfyUI 宿主源树，排除本扩展及其 `reference/`，避免把项目实现当作上游能力。
6. 对官方滚动文档中的 API，再核对锁定版本或实际安装源码；文档较新不构成升级授权。
7. 优先使用适用公开 API 和项目已接入的实现；内部 API 记录版本耦合。移植上游最小原码时保留来源、许可、必要依赖、键盘、主题和生命周期行为。
8. 区分未找到匹配、只找到部分匹配和检索未完成；不能把搜索失败写成“官方不支持”。

复用记录采用：**需求/AC｜上游版本与路径/符号｜公开性｜现有项目调用点｜直接调用/修改/移植/补足｜原因｜消费者｜待验证行为**。

历史前后端开发 Skill 要求独立只读 `gpt-6.1-terra`、推理 `medium`、`fork_turns="none"`。当前执行以目标仓库现行要求、用户指令及实际工具能力为准；无法采用时记录真实执行者与研究缺口，不伪称模型切换。完整任务写法见 [Subagents.md](Subagents.md)。

<a id="project-runtime"></a>

## 4. 版本与运行实例

同一工作树可以给多个端口提供同一份 JS，但 Python 进程仍可能保留旧 Node Schema。先确认用户正在看的实例，再判断刷新、构建或代码改动是否生效。

实例记录至少包括 URL/端口、进程身份或加载时间、后端 Schema、前端构件来源、关键配置和观察时点。涉及重启或写入时遵守已有授权。

包版本、依赖锁、安装版本和实际进程版本分别取证。测试在独立 worktree 或隔离宿主通过时，记录其版本，不能移作另一个目标实例的通过证据。

前端浏览器能打开、宿主 GET 成功、Node 入队、图完成执行分别属于不同观测。实际图执行还要看 prompt ID、history、输出文件及下游回执。

<a id="project-verification"></a>

## 5. 验证层级与命令

选择能观察 AC 的最低必要层级，跨层状态传播补充实际经过该边界的验证。读取测试断言及前置条件，不能只检查标题或成功数量。

| 行为 | 有效记录要素 |
|---|---|
| 校验、配置、复制、事务与恢复 | 精确测试、真实临时 SQLite/文件或替身、失败注入位置、最终状态 |
| HTTP 与权限 | aiohttp TestServer 等实际请求、handler、HTTP 状态、业务错误码、宿主/CLI 替身 |
| React | Jest/RTL 与 JSDOM、真实挂载组件、模拟 HTTP/宿主、用户动作及状态断言 |
| Vue | Vitest Chromium 或对应浏览器环境、实际控件、构件版本与宿主边界 |
| 视觉与生命周期 | 必要的宿主浏览器观察：主题、焦点、窄 Sidebar、键盘、挂载/卸载 |
| Siril | 真实 CLI 版本、隔离输入输出、FITS 可读性、原件完整性、串联后收到的路径和内容 |
| ComfyUI | 注册 GET、入队、完成记录和产物分别记录；下游消费者验证另列 |
| MCP 与发行 | MockTransport、stdio 子进程、带凭据真实宿主 GET、wheel/Registry 检查和实际发行分别记录 |

以下命令来自历史项目资料，运行前检查实际 `frontend/package.json`、`.github/workflows/ci.yml`、`docs/development.md`、依赖及参数。命令表本身不表示已经执行。

| 用途 | 历史命令或前置条件 |
|---|---|
| 工作树 | `git status --short --branch`；`git rev-parse HEAD`；`git diff --name-status`；`git diff --cached --name-status` |
| Python/HTTP | `uv run pytest tests/nodes tests/backend -q`；`uv run pytest tests/integration -m "not host" -q` |
| MCP/分包 | `uv run --project mcp pytest mcp/tests -q`；`uv run pytest tests/packaging -q` |
| React | `pnpm -C frontend test:react` |
| 类型/lint | `pnpm -C frontend typecheck`；`pnpm -C frontend lint` |
| Vue/构件 | `pnpm -C frontend test` 曾先执行 Vite build 并写入 `js/` |
| 只跑 Vue | 已有依赖和适用构件时，`pnpm -C frontend exec vitest run`；仍需核对当轮行为并注明构件来源 |
| 构件/代理检查 | `pnpm -C frontend check:build`；`pnpm -C frontend check:proxy` |
| 真宿主/CLI | 指定隔离 `COMFYUI_TEST_URL`、临时 `ASTROPHOTO_HOME`；真实 CLI 用例需要 `ASTROPHOTO_SIRIL_TEST_CLI` |
| 跨卷 | 需要真实不同测试卷及已授权输入；不能用同卷临时目录冒充 |

检查命令是否会下载依赖、重写前端资源、修改数据库或调用真实宿主。只读审计采用合适的隔离副本/输出，或记录 `NOT_RUN`；业务开发按本轮授权执行。

每条结果记录 AC/功能、路径/函数、Guard、测试名、关键断言、环境/替身、命令、时间、退出码、通过/失败/跳过数及限制。采用 [Records.md](Records.md) 的分离状态字段。

<a id="project-cases"></a>

## 6. 容易误判的具体案例

**Inspector。** 历史材料中的 `NodeView.updateParameters` 写 ComfyUI widget 并通知 graph。通用 Inspector 用例名称包含 “read-only values”，另有生产 NodeView 的参数写回、重置和预览测试。需要查 `frontend/ui/src/host/scientific.tsx`、`frontend/ui/src/__tests__/siril.test.tsx` 与 `frontend/ui/src/__tests__/scientific-node.test.tsx` 的实际断言，不能仅凭一个标题推导 Inspector 只读。

**科学节点。** 历史 `AstroPhotoSirilAutoStretch` 的正式输入输出为路径，资产 ID 用于 UI 回执。CLI 串联测试、宿主注册与原生队列执行应分别取证；不因 CLI 通过就宣布整张宿主工作流通过。定位线索为 `nodes/scientific.py`、`tests/backend/test_siril.py` 和 `docs/siril.md`。

**保存后启用。** 历史调用链为 `astrophoto/api/siril.py::save` → `astrophoto/siril/software.py::SoftwareService.save` → 配置写入，再由 `SoftwarePage.tsx` 读取返回的 `enabled`。材料记载服务先探测、持锁复核文件身份，再保存路径和启用位。

相关历史测试 `tests/backend/test_siril.py::test_config_rejects_incompatible_version_and_keeps_previous` 验证版本拒绝时保护旧配置。React 的 `manual verification preserves the active configuration on version mismatch` 从 `enabled: true` 开始；两者不能单独证明“初始禁用 → 成功保存 → 开关启用”。这项 AC 需要相应前置状态、成功保存、返回列表和重新读取的断言。上述定位仍须查当前源码。

**过期失败记录。** 历史 `5e39fcf` 审计提及 Jest 缺 CSS 映射导致六个套件未加载；`003c599` 的后续材料已记载 CSS 映射、含 `enabled` 的 fixture 和生产 NodeView 测试。不能沿用旧失败数量，也不能把新测试文件存在写成实际执行通过。

测试配置失败、过期 fixture、环境失败和产品失败分别诊断。套件加载失败应记未完成收集；临时探针与标准命令结果均保留，不挑选较好结果替代完整记录。

<a id="project-data"></a>

## 7. 数据与环境处置

- 保护原始素材、真实 Workspace、已有历史交接和未提交工作树。reference、copy、临时文件、持久产物的所有者与删除责任分别明确。
- 用户曾明确对当时的阶段性测试数据允许直接替换、无需迁移。仅在当前任务仍适用的已授权数据范围执行；不能扩张成所有历史数据可删，也不能默认给该范围新增迁移方案。
- 不擅自恢复用户已经撤销的硬限制；有关取舍按最新有效决定执行。
- 宿主依赖与扩展测试环境保持独立，不在真实 ComfyUI 宿主执行未经授权的 `uv sync`、升级或依赖修复。
- 已明确授权的操作无需重复确认；新的不可逆处置、发布或权限扩大按本次任务范围判断。
- S4/S8 保留全部必要背景、语义与证据边界。旧信息失效时留下替代关系；未核实内容保持未知，不能通过删去条目营造一致性。
