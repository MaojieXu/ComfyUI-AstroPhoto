# AstroPhoto / ComfyUI Sidebar — 本次完整对话交接档案

> **文档类型**：Conversation-to-Agent Full Handoff（对话决策、证据、产品要求与实现边界）  
> **整理日期**：2026-11-17，America/Chicago  
> **覆盖范围**：本次对话从 16 份 Markdown 全量上下文注入，到 Frontend 1.59.1 Node Library `Search + Filter + Sort` 源码定位的全部讨论。  
> **适配基线**：ComfyUI Backend `0.45.0` / Frontend `1.59.1`；原工程审计版本 `0.0.1`。  
> **交付目的**：让新的产品/前端/Full-stack Coding Agent 在不依赖原聊天记录的情况下，完整恢复背景、理解决策变迁、识别已实现与未实现、继续快速迭代 AstroPhoto Sidebar，并在用户确认 UI 后才修改需求或源码。  
> **语言**：中文正文，保留英文代码标识与 API 原名。  
> **重要提醒**：本文件是**本次聊天的交接**，不是对 2026-11-17 实时 Windows 工作树的独立代码审计。下文所有“已验证”会注明是原 2026-11-16 仓库审计证据、官方固定版本源码、还是仅对话中达成的设计决定。

---

## 目录

1. [十分钟恢复：当前最终结论](#1-十分钟恢复当前最终结论)
2. [资料清单、证据等级与阅读方法](#2-资料清单证据等级与阅读方法)
3. [项目真实工程基线（历史审计快照）](#3-项目真实工程基线历史审计快照)
4. [对话全过程：产品与技术决策演变](#4-对话全过程产品与技术决策演变)
5. [决策台账：确定、废弃、待定](#5-决策台账确定废弃待定)
6. [目标 UI：Sidebar-AstroPhoto 信息架构](#6-目标-uisidebar-astrophoto-信息架构)
7. [三主视图的详细行为与交互状态](#7-三主视图的详细行为与交互状态)
8. [界面风格、图标、主题与国际化](#8-界面风格图标主题与国际化)
9. [官方 Node Library 搜索 / 筛选 / 排序源码调查](#9-官方-node-library-搜索--筛选--排序源码调查)
10. [React 与 ComfyUI 的边界和官方 API](#10-react-与-comfyui-的边界和官方-api)
11. [推荐前端文件树及组件契约](#11-推荐前端文件树及组件契约)
12. [素材即节点 / Workflow 所有权 / 数据契约](#12-素材即节点--workflow-所有权--数据契约)
13. [实现范围、可验证能力、验收矩阵](#13-实现范围可验证能力验收矩阵)
14. [技术风险与文档冲突清单](#14-技术风险与文档冲突清单)
15. [建议下一位 Agent 的具体行动方式](#15-建议下一位-agent-的具体行动方式)
16. [官方文档及固定版本源码链接](#16-官方文档及固定版本源码链接)
17. [历史材料、UI 截图和完整出处索引](#17-历史材料ui-截图和完整出处索引)
18. [附录：可直接复制给本地 Agent 的接手 Prompt](#18-附录可直接复制给本地-agent-的接手-prompt)

---

# 1. 十分钟恢复：当前最终结论

## 1.1 产品定位

AstroPhoto 是嵌入 **ComfyUI** 的本地优先（local-first）天文摄影工作台。**ComfyUI 是唯一工作流编辑/执行宿主**；AstroPhoto 提供天文专业 Node、素材/拍摄 Session、外部软件能力和相关知识/上下文。外部 AI Agent 可通过独立 FastMCP 使用公开能力，但本次聊天的实际主线是 **Sidebar 的产品信息架构、交互原型和 React 前端设计**。

## 1.2 最后明确的产品决策（以这些为准）

| 编号 | 当前有效的结论 | 实施含义 |
|---|---|---|
| D-01 | **一个**名为 `AstroPhoto` 的 ComfyUI Sidebar 入口 | 不在宿主侧边栏为 Assets、Nodes、Memory 等分别增加图标 |
| D-02 | Sidebar 内保留 **节点 Nodes / 素材 Assets / 设置 Settings** 三个主视图 | 是三个可切换的本地视图，不是三个宿主 Sidebar Tabs |
| D-03 | 「设置」必须完整披露未来业务模块；模块可点入信息详情，即使还未实现 | 用户能看懂每个模块负责什么，尚未实现的只能显示规划/不可用 |
| D-04 | **主题、语言自动跟随整个 ComfyUI 系统** | **不提供** AstroPhoto 专属的语言下拉框、auto/zh/en 模式或主题切换器；这是对旧 FRD/技术指南的明确覆盖 |
| D-05 | Node Library 和 Asset Library 是最重要的两个高频入口 | 两者均应支持查找与向画布添加对象 |
| D-06 | **素材自身可以拖入 Canvas 成为节点实例**，不是必须手工先放 `Load Image` | 每个素材绑定一个稳定的 Asset Source Node Class 实例；不是每文件注册一个 Python Node Class |
| D-07 | 所有可执行节点仍由 **ComfyUI V3 原生 Registry** 注册和执行 | AstroPhoto 的节点库只负责专业发现/展示/交互，不建立第二套 Node Registry |
| D-08 | Workflow 直接复用 **ComfyUI 原生工作流保存、加载、Undo/Redo** | 不创建 `workflows.db`，不开发另一套 Workflow 列表/编辑器 |
| D-09 | **不展示、不建设 Experiments/Trials 前端页面** | 旧 FR-07 长期设想不应自动推导为本次 Sidebar 任务；不据此擅自删除旧需求文档中的长期内容 |
| D-10 | UI 的 `style` 指 **简约、克制、专业**，不是必须照抄 ComfyUI 媒体资产的布局 | 交互结构按 AstroPhoto 任务组织，视觉可参考 ComfyUI 原生组件 |
| D-11 | 主导航的选择态优先参考 ComfyUI 原生 **紧凑、左对齐、圆角背景 Tab** | 不再默认使用三等分大按钮或白色下划线方案；最终图仍可继续迭代 |
| D-12 | 节点工具栏需参考 Frontend `v1.59.1` 的**搜索框 + Filter + Sort** | 相关源码已定位；React 自己实现同等视觉与行为，不直接 import 宿主 Vue SFC |
| D-13 | **现阶段首先做 UI 原型迭代**；用户明确说过“现在不需要更新 document，只需要先把图画出来” | 除本次要求的新交接文档外，不自动改写已有 FRD、Technical Guide 或工程源码 |
| D-14 | 用户要求可在聊天中直接看到的**组件化、可切换 UI 原型** | 不把 UI 讨论退化成 ASCII 图、静态 AI 图片或未经要求的 React 源码包 |

**尚未冻结**：Emoji 与线性图标如何搭配。用户曾指出对旧版“不满意，并且没有 emoji”；助手曾给出 Emoji / Lucide / 纯文字对比器，但用户没有最终选定图标方案。不能把“必须无 emoji”或“每个 Tab 必须 emoji”写成已确认需求。最后一轮源码定位本身未决定新的最终 UI 原型。

## 1.3 下一步实际应做什么

如果用户继续说“画 UI”、“调整这几个按钮”、“再迭代 Sidebar”，**直接在聊天中用交互式组件渲染**，一次只调整指定模块，保持其他部分稳定。当前最自然的继续点是：**根据 v1.59.1 的真实 `SearchInput`、`FilterDropdown`、`MenuRadioGroup` 和紧凑 Tab 视觉，重新画 Nodes / Assets / Settings 三视图；优先迭代 Nodes 的 Search + Filter + Sort 及三视图顶部导航。** 只有用户确认后，再把最终设计回写需求/实施文档。

---

# 2. 资料清单、证据等级与阅读方法

## 2.1 本次聊天开始时注入的 16 份文档

用户上传并要求“先全量注入这些 markdown 文件”；以下文件均实际存在于本次交接素材：

| 文件 | 作用 |
|---|---|
| `00_README.md` | Repository-Verified Handoff 入口、证据边界、阅读顺序 |
| `01_CURRENT_STATE.md` | 2026-11-16 真实实现/验证状态快照 |
| `02_REQUIREMENTS.md` | 项目长期 FR-01～FR-08、33 个候选 Agent Skills、技术/业务原则 |
| `03_ARCHITECTURE.md` | 真实模块与源码物理文件树、V3、前后端边界 |
| `04_TECH_STACK.md` | 开发/宿主双环境、实际依赖版本与运行命令 |
| `05_MCP_AND_SKILLS.md` | FastMCP Server、2 个已实现工具、Skills 规划与契约 |
| `06_DATA_MEMORY_RAG.md` | Assets/Knowledge/Memory/Experiments 规划与数据所有权 |
| `07_TEST_EVIDENCE.md` | 具体测试命令、通过/跳过、打包、宿主失败与发布阻塞 |
| `08_GAPS_AND_RISKS.md` | R1～R12 风险列表 |
| `09_DECISIONS.md` | 已落地、未落地和过期 ADR |
| `10_NEXT_AGENT_PROMPT.md` | 原代码库 Coding Agent 接手 Prompt |
| `11_RECONCILIATION.md` | 历史陈述与当前仓库证据的双向对照 |
| `12_SOURCES.md` | 官方/本地证据索引 |
| `CHANGELOG.md` | 2026-11-16 文档校准内容 |
| `FULL_HANDOFF.md` | 上述主题文档的整合版，非额外独立证据 |
| `MANIFEST.md` | 上述交接包的文件及 SHA256 清单；额外列出原包中的 `evidence/` |

**重要**：这 16 份文件反映的是**此前仓库审计结果**，不是今天实时仓库快照。完整 `FULL_HANDOFF.md` 含大量重复内容，应避免当作新的一份独立实测。`MANIFEST.md` 中的 `evidence/` 原始日志文件没有全部单独上传本对话，仅列出清单、哈希和相关结论，不能假装已逐字复验原始日志。

## 2.2 在本次聊天中进一步生成并重新上传的两份 React 文档

| 文件 | 版本 | 何时制定、局限 |
|---|---|---|
| `AstroPhoto_React_Sidebar_Requirements_v1.0.md` | 产品需求 v1.0 | 527 行：三主视图、七个设置模块、Nodes/Assets、i18n、交互/测试。**部分需求已被之后的聊天覆盖** |
| `AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md` | 技术指南 v1.1 | 958 行：React `ui/` 文件树、官方接口、代码例子、构建、测试、未决问题。**语言/导航/搜索工具栏等部分需要按后续聊天修订** |

这两份文档**是设计稿，不是当前仓库已实现代码的证明**。尤其要纠正它们曾经要求的 `LanguageSelector.tsx`、`AstroPhoto.UI.Language`、`auto/zh/en` 下拉设置；用户最后明确取消这些独立设置。

## 2.3 证据等级（每位 Agent 都要使用）

- **[USER]** 用户明确指令与确认（本交接中的优先产品决策来源）。
- **[AUDIT-2026-11-16]** 16 份交接文档报告的仓库审计/隔离测试；不能扩大为今天实时工程状态。
- **[OFFICIAL-TAG]** 官方仓库指定 Tag `v1.59.1` / `v0.45.0` 的实际源码、类型签名和组件结构。
- **[OFFICIAL-DOC]** 官网公开文档；可能是滚动版本，固定版本优先。
- **[DESIGN]** 本次讨论推荐 UI/文件架构，不表示已投入开发。
- **[PROTOTYPE]** 在 ChatGPT 中显示的交互式组件原型或示意素材，非生产 React 代码。
- **[PLANNED]** 目标能力、未实现 API、未注册 Node 或未安装软件。
- **[HOST-UNVERIFIED]** 必须在真实 ComfyUI 前端运行后确认的行为，尤其 Canvas 拖放与卸载。

## 2.4 信息冲突优先级

对产品：**用户在本次对话中最后的明确指令** > 早期对话决策 > React FRD v1.0 > 原项目长期需求中未涉及的展示设想。  
对代码：**实际当下工作树与测试** > 固定版本源码/类型 > 用户已上传的历史审计 > 官方滚动文档 > 助手示例。  
对安全与真实性：**不得将规划内容冒充已实现、不得修改用户宿主或发布**，优先级高于目录图美观与演示体验。

---

# 3. 项目真实工程基线（历史审计快照）

## 3.1 项目路径和版本

- 仓库（审计时）：`C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`。
- 分支/提交（2026-11-16 审计）：`main` / `06961eebe42674714dc2992b0a9de654b3a5a566`；**存在大量既有未提交迁移文件**，仅 HEAD 无法复现工作树。
- 软件发行元数据：Extension = `0.0.1`，MCP = `0.0.1`；长期需求基线 v0.2 不等于软件版本。
- 开发：Python `3.12.15`（`.venv`、`.python-version`）、最低发行 `>=3.11`，曾验证 Python `3.11.18`。
- 真实宿主：Python `3.12.4` Anaconda / Backend `0.45.0` / Frontend `1.59.1` / Torch `2.3.0`。
- 前端历史审计：Vue `3.5.13` + PrimeVue/Aura `4.3.3`、Vite `6.3.5`、TypeScript `5.9.3`、Vue-tsc `3.3.14`；**不是已完成 React 移植**。
- MCP：FastMCP `4.2.0`、HTTPX `0.28.1`、MCP SDK `2.3.0`；std​io 单 Server。
- 开发包管理器：uv workspace + `uv.lock`、原 Vue `frontend/` 使用 pnpm/`pnpm-lock.yaml`；React Template 自带 npm/`package-lock.json`。**不能默认最终本地仓库已选定 npm 取代 pnpm**。

## 3.2 真正存在的功能（审计时）

| 域 | 2026-11-16 状态 | 事实 |
|---|---|---|
| Extension 入口 | 已有，隔离验证 | `__init__.py` V3 `comfy_entrypoint()`、`ComfyExtension`、`WEB_DIRECTORY` |
| Node | 仅 1 个示例 | `vue-basic`，ID 和 Widget 输入契约保留；没有天文专业节点 |
| Widget | 仅一个绘图 Widget | `CUSTOM_VUE_COMPONENT_BASIC`；Canvas → PNG Data URL → `/upload/image` → Python LoadImage → `IMAGE`；真实端到端宿主验收缺失 |
| HTTP | 仅 1 条 AstroPhoto 路由 | `GET /astrophoto/v1/status`，原生 aiohttp 路由，报告当前注册与 8 个未实现能力 |
| MCP | **2 个 Tools** | `version`、`connection_status`；其余 node_search / asset_import / canvas_apply 等均未实现 |
| 产品 Skills | **0 个** | 只有条件式 FastMCP SkillsDirectoryProvider 接线；33 个是候选清单 |
| 业务 DB | **0 个** | `assets.db` / `knowledge.db` / `memory.db` 只是规划；`.codegraph/codegraph.db` 是开发索引，非业务数据 |
| React Sidebar | 目标设计，非已证实运行 | 本次聊天选择 React Template 方案，但上传资料并未证明 Windows 当前代码已迁至 React |
| Canvas Bridge、Software Adapters、RAG、Memory、Experiments | 均规划中 | 不存在可声明完成的业务 Service、Runner、数据库或工具 |

## 3.3 宿主运行与测试状态

原审计报告（2026-11-16）：

- Extension 根测试：**22 passed / 1 skipped**（宿主测试跳过）。
- MCP 测试：**52 passed**。
- 前端 Chromium/Vitest：**6 passed**。
- Python 3.11 测试：同一套用例另验证 22 passed/1 skipped 与 MCP 52 passed，不能算成新增覆盖。
- `vue-tsc`、Vite、Ruff、打包内容检查、隔离 wheel 安装与 stdio 握手通过。
- ComfyUI 宿主在插件加载前失败：Torch `2.3.0` 缺少 `torch.library.custom_op`，导致 `comfy_kitchen` 导入失败。**未完成真实 ComfyUI V3 加载、状态端点现场访问、Canvas 拖拽、保存重开和真正 IMAGE tensor 链路的验收**。
- 公共 PyPI `astrophoto-mcp==0.0.1` 在审计时返回 404，未发布；Registry 也未发布。
- 本次对话没有连接本地 Windows 代码库执行新测试，不能声称上述阻塞已经修复。

## 3.4 当前 Vue 前端目录（用户提供并确认的完整解释）

```text
frontend/
├── src/
│   ├── main.ts                     # 宿主 Extension 注册、Vue 挂载、主题和 i18n
│   ├── host.d.ts                   # 宿主模块类型声明
│   ├── types.ts                    # Widget / 画板类型
│   └── components/
│       ├── VueExampleComponent.vue # PNG 上传与序列化
│       ├── DrawingApp.vue         # 画板应用
│       ├── DrawingBoard.vue       # Canvas 绘制
│       └── ToolBar.vue            # 工具栏
├── tests/
│   ├── setup.ts
│   ├── host.ts
│   ├── components/DrawingApp.test.ts
│   └── widgets/
│       ├── registration.test.ts
│       └── serialization.test.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── vite.config.mts
└── vitest.config.mts
```

**此树是 2026-11-16 审计及用户补充确认的基线，不代表后来未新增文件**。既有 Vue Drawing Widget 与拟新增 React Sidebar 是两条需要保兼容的前端工作线，不允许直接为了换 React 删除旧 Widget。

## 3.5 基础架构的所有权（原项目长期决策）

```text
Human User → ComfyUI Frontend / Sidebar / Canvas
                                      │
External Agent → FastMCP（stdio）→ ComfyUI / AstroPhoto HTTP API
                                      │
                   ComfyUI Backend + AstroPhoto Extension
                     ├─ Node Registry / Workflow / Queue / Undo
                     ├─ AstroPhoto Asset / Software / Knowledge / Memory 等业务域（未来）
                     └─ ~/.astrophoto/（业务数据库与运行产物，未来）
```

- Workflow 图和原生文件保存：**ComfyUI**。
- Node 类型/执行队列/历史：**ComfyUI V3**。
- Asset、Session、设备、软件检测、知识、记忆、业务凭证：**AstroPhoto Extension**（对应业务尚未落地）。
- MCP 只是受控网络访问与 Agent 工具，不是第二套数据库或执行引擎。
- Node 是操作能力；Agent Skill 是操作流程；Knowledge 是专业依据；Memory 是用户授权背景。不要混成一个 UI Tab。


---

# 4. 对话全过程：产品与技术决策演变

这部分专为下一位 Agent 恢复“为什么走到今天”而写。历史提案全部保留，但明确哪些**不能再当作最终决定**。

## 阶段 A — 全量注入项目背景

1. 用户上传上述 16 份仓库审计/交接 Markdown，要求全部读取。
2. 助手确认主边界：ComfyUI V3 Native Extension、FastMCP 4.2、单仓双包；1 Node / 1 Status API / 2 MCP Tools / 0 产品 Skills；宿主测试被 Torch 阻塞。
3. 用户询问“现在能否看到前端 folder 结构”；助手首先按照 `03_ARCHITECTURE.md` 复述目录，然后用户补充了更清楚的 `frontend/` 逐文件职责表。这个 Vue 目录已在 §3.4 保留。

**结果**：用户希望对前端进行产品级重新设计，但没有提供一个可直接操作的实时本地 Git 仓库。所有新前端设计都必须以“目标方案”表述。

## 阶段 B — ComfyUI 原生媒体资产截图与首次模块拆分

4. 用户展示 ComfyUI 原生“媒体资产” Sidebar 截图（深色主题、已生成/已导入、小搜索、筛选、空态），询问 AstroPhoto 需要哪些 UI 模块，以及 Node 是否直接放原生媒体资产。
5. 助手起初按后端业务归属推荐 6 个业务视图：天文资产、设备/观测、节点/软件、处理/实验、知识、记忆，另加状态设置。
6. 助手建议专业资产与原生媒体资产分离；Node 类型仍进入 ComfyUI 原生 Registry；AstroPhoto 增加自己的专用侧栏，提供专业节点发现。
7. 用户反问“为什么不把 Node 库也放到 AstroPhoto 里面？”；助手接受该方向，明确两种入口共存：**ComfyUI 原生节点库仍能搜索到 AstroPhoto Node；AstroPhoto Sidebar 也提供专业 Node Library**。

**结果保留**：双入口、单 Node Registry；天文资产独立于普通生成媒体资产。  
**废弃**：用户每天必须先到原生媒体资产查天文文件，或必须把所有 6 个业务域做成一级导航。

## 阶段 C — “风格”与“布局”的误解被纠正

8. 用户要求简约、符合 ComfyUI 风格。
9. 助手误以为必须完整模仿原生“媒体资产”页签与列表布局，于是做出标题栏/Tab/搜索/树列表的单纯复刻。
10. 用户明确纠正：“**我之前说的 style 指的是简约风格，而非布局要像他们一样。**”
11. 助手调整为任务导向信息架构，不再追求一比一照搬原生布局。

**永远保留的原则**：ComfyUI 风格 = 简约、密度合理、主题融入、成熟编辑器体验，不等于 UI 位置/控件顺序固定复制。真正布局可随 AstroPhoto 业务设计。

## 阶段 D — Nodes 与 Assets 的关系及拖出节点

12. 用户要求“**素材本身也能作为节点拉出，而不是完全依靠图像输入**”。
13. 助手比较“统一资源浏览器”与分开的 Nodes/Assets 页：统一搜索有可行性，但后续用户对图形原型更偏好**Nodes / Assets 两个主资源类别**。
14. 明确技术模型：用户拖一个 FITS/SER/视频/Session → ComfyUI Canvas 中新增一个**已注册稳定 Node Class 的实例**，将 `asset_id/session_id` 绑定为 Widget/输入；不能每个素材都注册一个节点类；不能把 FITS 不加说明地转 PNG 当成精度保留处理。
15. 点击“+ 添加”必须作为拖放的替代操作（可访问性与无拖拽环境）。

**当前有效**：Nodes 和 Assets 均可点击/拖拽添加到画布；Asset 的真实成功路径以业务 API、Asset Source Node、宿主 Canvas Adapter 落地为前提。

## 阶段 E — Experiments 被用户去除

16. 早期助手曾推荐「节点 / 素材 / 实验」三个一级 Tab，实验包含 Trial 对比等。
17. 用户明确说：“**节点，素材，我们需要，但是实验不需要。**”
18. 助手把 Experiments 从本次前端范围中移除，保留 Nodes / Assets，其他业务能力放到设置或上下文帮助。

**当前有效**：不显示 Experiments Tab、不在 Settings 里偷加实验页、不在本次 React Sidebar 任务生成 `features/experiments/`。  
**边界说明**：原 02 长期需求仍有 FR-07 Experiments/Subagents；本次 UI 排除不等于用户授权删除所有未来技术概念。需要讨论 FR-07 未来是否彻底取消时另问，不自动改旧长期档案。

## 阶段 F — Workflow 完全委托 ComfyUI

19. 用户提出：Workflow 直接保存到 ComfyUI 既有工作流即可。
20. 助手采纳：使用原生 Workflow Store、Save/Save As、用户数据路径、Undo/Redo、队列。无需 `workflows.db`、单独的 Workflow Page 或重复 JSON 文件管理器。
21. AstroPhoto Asset Source Node 的 `asset_id` 随 ComfyUI Workflow JSON 保存；原始 FITS/SER 媒体文件不嵌入 Workflow JSON。缺失引用要可诊断/重新定位。

**关键区别**：`POST /prompt` 提交执行、点击添加节点修改当前 Canvas、保存 Workflow 到用户文件，是**三个不同操作**，任何一个成功都不能冒称另外两个成功。

## 阶段 G — 将关注范围收紧到 React Template 的前端

22. 用户提供了 `ComfyUI_frontend_vue_basic/` 原模板结构，并重申 Backend 0.45.0 / Frontend 1.59.1，问最终结构。
23. 助手曾给出涵盖 `nodes/ + astrophoto/ + frontend/ + mcp/` 的较大项目目录树。
24. 用户随后**明确缩小范围**：只聚焦 **`ComfyUI-React-Extension-Template/` 及其 `ui/`**，不要再展开 Python/MCP/数据库整体代码目录。
25. 用户展示一个新的浅色简约界面截图，要求：`Nodes` / `Assets` / `Settings` 能在 Sidebar 中切换；设置至少展示未来模块名称、用途、状态和子页；中英双语适配。
26. 助手生成了两份文件：
    - `AstroPhoto_React_Sidebar_Requirements_v1.0.md`（产品需求）；
    - `AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md`（技术开发）；
   以及一份面向本地 Coding Agent 的实施 Prompt。

**当前有效**：React + TypeScript Sidebar 是目标方案；后端仅作为必需的 API/Node 契约提及；不要因此擅自改整个 Monorepo。

## 阶段 H — 用户强调“直接在聊天画图”，不是只要 ASCII 或代码

27. 用户多次要求“把之前你认为的 UI 前端结构图展现出来”，后用截图指向 ChatGPT 对话中直接渲染的可交互界面，问“**这个用什么画的**”。
28. 助手解释：那是 ChatGPT 对话内**组件化的交互式 UI 渲染**，并非 Figma、Matplotlib、AI 图片，也不是已生成的 React 项目。
29. 用户希望沿用这一方式快速迭代 UI；**图与文档要分开**，不应一边画一边自动改需求文件。

**当前有效**：用户说“画一下”时，直接呈现实际视觉层级和可切换状态的交互式原型；不用文字结构树代替 UI。原型展示数据需标“示例，不是已实现”。

## 阶段 I — 主导航冻结为三个视图；基础设置又被去掉

30. 用户展示 Settings 页原型，要求重画，并说：**主题和语言随着整个系统调整，不再单独添加模块**。
31. 助手确认 `Comfy.Locale` 与 `Comfy.ColorPalette` 的宿主设置存在；提出移除独立语言选择/主题选择，自动跟随 ComfyUI。
32. 助手准备修改旧文档时，用户立即纠正：“**现在不需要更新 document，只需要你先把图画出来，我们对图一步一步快速迭代**”。
33. 助手随后输出可切换的 AstroPhoto 原型：Nodes / Assets / Settings 三视图；Settings 中 7 个专业业务模块；无语言/主题控件；可进入模块说明子页并返回。

**这是后期最重要的需求覆盖**：旧 FRD v1.0 和技术指南 v1.1 均仍写着 AstroPhoto 私有 `auto/zh/en` 选择和 `LanguageSelector.tsx`。这些**已过期**，不能让 Agent 继续按旧文档照做；待 UI 定稿后统一修订。

## 阶段 J — 用户不满意现有 Tab 样式；深入研究 v1.59.1 官方源码

34. 用户展示两个 Tab 截图：
    - ComfyUI 媒体资产小圆角选中背景「已生成 / 已导入」；
    - AstroPhoto 早期三选项「节点 / 素材 / 设置」的白色下划线选中态。
35. 用户要求查 ComfyUI 前端原始实现，表示不满意当前 AstroPhoto 版本，并提到“没有 emoji”。
36. 助手定位到 ComfyUI `TabList.vue`、`Tab.vue`、`tab.variants.ts` 和 `AssetsSidebarTab.vue`，推荐**紧凑圆角选中背景 Tab**、左对齐、非三等分、动效克制。
37. 助手制作了 Emoji / 线性图标 / 纯文字三种模式的**演示选择器**，但用户**没有明确批准其中某一种**。

**当前有效**：最新已选定的交互参考是 ComfyUI 的紧凑原生 Tab 设计；图标最终形态未决。官方前端 Vue 组件是**视觉与行为参考**，React Extension 不应直接 import Vue SFC 或宿主私有组件。

## 阶段 K — 最后一轮：精准定位 Search + Filter + Sort

38. 用户截图指向节点库工具栏：搜索框 + 两个图标按钮，要求直接定位源代码实现。
39. 经固定 Tag `v1.59.1` 的 GitHub 源码检查，确定截图对应 **`NodeLibrarySidebarTabV2.vue`**，并非旧版 `NodeLibrarySidebarTab.vue`。
40. 新版实际结构是：`SearchInput`（文字输入） + `FilterDropdown`（多选分类过滤） + `Menu`/`MenuRadioGroup`（排序单选）。**截图中的按钮次序是 Filter → Sort**。
41. 定位了数据逻辑：`NodeSearchService`（Fuse.js 模糊检索）、`nodeOrganizationService`（分类/排序）、`useLocalStorage`/`usePerTabState`（保留每个 Tab 排序状态）及 `SidebarTopArea.vue`（Flex 排布）。
42. 助手建议 AstroPhoto 的 Nodes 与 Assets **共用一套 React SearchToolbar UI 外壳**，但各有自己的搜索字段、筛选项、排序策略和结果处理。

**当前对话停在此处**。用户尚未再次要求新的图形迭代，转而要求生成本完整交接。

---

# 5. 决策台账：确定、废弃、待定

## 5.1 需求/技术状态矩阵

| 议题 | 最终确定 | 不应再执行的旧方案 | 保留风险 / 待确认 |
|---|---|---|---|
| 宿主入口 | 1 个 AstroPhoto Sidebar | 按域生成多个宿主侧栏图标 | Sidebar 生命周期与实例重挂载实测 |
| 内部导航 | Nodes / Assets / Settings 三视图 | 6～8 个主模块；Nodes/Assets/Experiments | Tab 精确图标方案待选 |
| UI 风格 | 极简、专业、融入主题 | 原生媒体资产布局的逐项复刻；大卡片 Dashboard | 颜色/紧凑度需用户视觉确认 |
| Tab 选中态 | 紧凑圆角背景，左对齐 | 三等分大按钮、白色下划线默认 | 微交互、左边距微调 |
| 节点 | AstroPhoto 专属目录 + ComfyUI 原生 Node Registry | 只放原生节点库，或自行建第二套注册 | Python Node 可用性由真实能力决定 |
| 素材 | Asset Library；拖入生成 Source Node 实例 | 依赖 LoadImage 手工选；每素材注册 Node Class | Asset API/Source Node 尚未实现 |
| Workflow | 完全归 ComfyUI 原生 | workflows.db、AstroPhoto Workflow 页面 | 编辑 vs 保存 vs 执行回执 |
| Experiments | 本次 UI 不展示 | 实验一级 Tab、Settings 实验页 | 长期 FR-07 不自动删 |
| 语言 | 跟随 ComfyUI 全局语言 | 独立语言选择、覆盖模式 `auto/zh/en` | `Comfy.Locale` 实时监听机制需要版本实测 |
| 主题 | 跟随 ComfyUI 全局主题 | 独立主题选项与持久化偏好 | 自定义主题 token 以及切换时 CSS 验证 |
| 国际化 | `zh` + `en` UI 文本均有翻译资源 | 用 UI 选择器显式切换作为生产需求 | 模板 HTTP locale 路径需隔离 |
| Settings | 7 个可点击、能返回的专业模块信息页 | 7 个业务空表单、假按钮 | 状态与后端 capability 实际对应 |
| 搜索/过滤/排序 | 参考 `NodeLibrarySidebarTabV2` 的 Search+Filter+Sort | 只有搜索+一个笼统滑块按钮 | React 组件语义和分类选项需具体实现 |
| 管理软件 | Settings / Node 可用性上下文 | 软件路径和节点参数混在一个 Widget | 软件未安装应清楚显示 |
| Knowledge / Memory | 上下文帮助 / Settings 说明页 | 每个业务域占一级 Tab | 授权、隐私与来源可信性 |
| Agent Context | Settings 入口 + 未来按需上下文 | 长驻大型聊天或 Debug 页 | MCP 是否在线不可由 Status `ok` 推断 |
| React | 目标 `ui/` 方案 | 把历史 Vue 当前状态写成 React 已实现 | 旧 Vue Widget 与新 React 并存/迁移仍待验证 |
| 包管理 | 需基于真实仓库最终选一种前端锁 | 直接同时保留 npm+pnpm 双锁 | 用户本次只指定 React Template，不等于已迁工程 |
| 宿主兼容 | 以 Backend 0.45.0 / Frontend 1.59.1 为准 | 直接照最新 `main` 的内部 API | Torch 阻塞真实集成验收 |

## 5.2 不能假定已作出的决定

- **不能**假定用户已选择“全站禁止 Emoji”：他曾明确指出原型“没有 Emoji”而不满意；也**不能**假定已选择全 Emoji。保留图标/Emoji 对比供用户继续评审。
- **不能**因为最新助手建议 Search+Filter+Sort 就声称用户已经视觉确认了最终三按钮尺寸、弹出菜单或顺序。用户确认的是“请定位原生源码”，仍有 UI 迭代空间。
- **不能**假定独立 React 工程已覆盖或删除原 Vue 工程；此前仅有设计文档和 Prompt，没有对本地代码写操作。
- **不能**假定 2026-11-16 的审计结论在 2026-11-17 的工作树里依旧完全成立；新 Agent 必须重新 `git status`、读真实文件。
- **不能**把过去助手回复中的示意 `Load FITS`、`Siril Stacking`、`M31_Light_001.fit` 视为真实节点/业务数据。
- **不能**从某 API 文档存在推断用户的宿主已启动、MCP 已发布、工作流拖拽已通过。

---

# 6. 目标 UI：Sidebar-AstroPhoto 信息架构

## 6.1 最终信息架构

```text
ComfyUI（宿主）
│
├── 原生左侧主导航
│   ├── 原生 Node Library（依旧包含已注册的 AstroPhoto Nodes）
│   ├── 原生 Media Assets（普通输出/导入媒体）
│   ├── 原生 Workflows
│   └── AstroPhoto                  ← 只增加一个原生 Sidebar 入口
│       │
│       ┌─────────────────────────────────────────┐
│       │ AstroPhoto                 [帮助] [设置] [关闭]
│       ├─────────────────────────────────────────┤
│       │ [节点] [素材] [设置]                      ← 左对齐紧凑 Tab
│       ├─────────────────────────────────────────┤
│       │                                         │
│       │ NODES 页面                             │
│       │ [搜索节点……              ] [Filter] [Sort]
│       │ ├─ 分类 / 软件归属 / 运行状态            │
│       │ ├─ 节点列表 / 折叠树                     │
│       │ └─ 点击详情 / +添加 / 拖到 Canvas        │
│       │                                         │
│       │ ASSETS 页面                            │
│       │ [搜索素材、Session……      ] [Filter] [Sort]
│       │ ├─ 导入拍摄目录（能力未就绪时禁用）       │
│       │ ├─ 拍摄 Session / Light Dark Flat Bias  │
│       │ ├─ 文件和素材详情                       │
│       │ └─ 点击详情 / +添加 / 拖成 Asset Source  │
│       │                                         │
│       │ SETTINGS 页面                          │
│       │ ├─ 软件管理                            │
│       │ ├─ 设备与光学链路                      │
│       │ ├─ 观测地与光污染                      │
│       │ ├─ 知识库                              │
│       │ ├─ 用户记忆与隐私                      │
│       │ ├─ Agent 上下文与 MCP                  │
│       │ └─ 系统状态                            │
│       │      └─ 模块说明子页 → 返回 Settings    │
│       │                                         │
│       └─────────────────────────────────────────┘
│
└── 中央：ComfyUI Canvas（唯一 Graph / Workflow 所有者）
    ├── 普通 AstroPhoto Processing Node
    ├── AstroPhoto Asset Source Node（绑定 asset_id）
    ├── 原生 Widget / Properties
    ├── Native Workflow Save / Load / Undo
    └── Native Queue / Execution
```

**ASCII 是说明信息架构，不是最终美术稿。** 用户真正要快速迭代的是在聊天中展示的可交互组件式 UI。

## 6.2 UI 区域层次

1. **Header（固定）**：AstroPhoto 品牌；可选帮助入口；Settings 快捷图标；关闭交给宿主 API。顶部齿轮必须和第三个 Settings Tab 进入同一个状态，不存在两个设置中心。
2. **PrimaryTabs（固定）**：`Nodes / Assets / Settings`，紧凑左对齐内容宽度、选中背景圆角、支持键盘与焦点状态。不是等宽分屏按钮。
3. **View Toolbar（随视图）**：Nodes 与 Assets 显示 Search + Filter + Sort；Settings 不需要显示资源检索工具栏。
4. **Content Scroll（可滚动）**：树/列表和设置模块目录；切换 Tab 后尽量恢复每页搜索与滚动。
5. **Details（子视图）**：节点详情、素材详情、Settings 模块说明在所属主视图内展开；有返回入口，保持主 Tab 导航可用。
6. **Feedback（按需）**：加载/错误/能力缺失才出现；避免长期底部“已连接”“演示状态”装饰条占用稀缺空间；这些固定 footer 来自早期原型而非已冻结要求。

## 6.3 非本 Sidebar 的其他 UI 放在哪里

| 信息/交互 | 推荐放置 | 原因 |
|---|---|---|
| Node 标准参数 | 节点 Widget + ComfyUI 原生 Properties | 复用 Graph 与序列化 |
| Node 专业说明 | Nodes 详情子页；可带知识引用 | 上下文相关，减少导航层级 |
| FITS Header / Asset 元数据 | Assets 详情子页；较长字段可弹出对话框 | 素材上下文最强 |
| 软件安装路径/版本 | Settings → 软件管理（未来） | 全局状态，不是每个节点重复配置 |
| 相机/光学链路/观测地 | Settings 信息页，将来实际配置；Asset 详情显示引用 | 低频维护与高频浏览分开 |
| Knowledge 检索 | Node/Asset 帮助的上下文入口 + Settings 知识概览 | 避免大面积常驻知识 Tab |
| 用户偏好与记忆 | Settings → 用户记忆与隐私 | 需要透明授权与管理 |
| Agent 当前上下文 | Settings → Agent Context & MCP 概览，未来按需显示 | 区分 Agent 侧推理与 UI 本身 |
| 运行队列与 Workflow | ComfyUI 原生 | 不重复造系统 |
| 深度调参/实验对比 | **本次不展示** | 用户明确不需要实验页 |

---

# 7. 三主视图的详细行为与交互状态

## 7.1 共同导航与状态

- 启动时默认展示 **Assets**（这是旧 FRD 明确约定，用户后续未更改；若新 UI 原型需要另一默认页，可在评审中提出，不擅改）。
- 点击 `Nodes / Assets / Settings` 立即切换 React 视图，**不修改 ComfyUI Canvas、Workflow、Queue**。
- 每个 Tab 保留自己的 query、Filter、Sort、展开树、选中项、滚动位置，至少在同一个 Sidebar Mount 生命周期内；如果关闭后再次打开是否持久化需明确策略，未决定长期存储。
- 顶栏齿轮切换到同一个 Settings；不能同时叠加第二个 Settings Overlay。
- 设置模块信息页与 Node/Asset 详情页不是新主 Tab；点击返回恢复原列表/滚动；主导航始终可达。
- 键盘：`Tab` 到达控件；Tablist 支持 Left/Right 导航；Enter/Space 激活；Search 处理中文 IME composition；拖放必须有 `+` 替代操作。
- 与 UI 语言有关的显示文案通过 i18n 资源，**不在 Settings 中提供独立语言控件**。

## 7.2 Nodes（处理节点库）

**目标用户动作**：找到需要的 AstroPhoto 专业节点 → 确认类型/依赖/端口 → 添加到工作流。

最低展示信息：

- `node_id`（稳定技术 ID，主键，不随语言变化）；
- `display_name`（展示名）；
- 简短说明；
- 分类和软件/处理域归属；
- 可选输入/输出类型与软件依赖；
- 真实可用性/不可用原因（必须来源于注册信息与能力判断）。

交互：

- 搜索：名字、显示名、已声明别名。建议尽量对齐原生 `NodeSearchService` 行为，但 AstroPhoto 只展示其真实拥有的节点。
- Filter：软件/类别/能力可用状态，选项在数据来源足够时启用；暂时没有软件检测时不能显示“已安装”。
- Sort：原生分类/原始顺序、名称 A-Z；专业扩展未来可以增加“最近使用”，但必须有事件数据，不能凭空排序。
- 列表分组/展开：源于真实分类，不通过单纯文件路径推断节点可用性。
- 点击行主体 → NodeDetails；点击 `+` → 正式创建 Node 实例；拖动行 → 当前 Canvas 指定坐标。注意此前原生 V2 点击节点会触发拖拽流程，AstroPhoto 的“行点击看详情”是**本产品自行选择的交互**，不要错误宣称是 ComfyUI V2 完全相同行为。
- 节点详情：名称、说明、真实端口、Node ID、所属软件、帮助/来源、添加动作、错误和返回。
- 仅有当前 `vue-basic` 注册时就只显示这个真实节点（是否纳入 AstroPhoto Catalog 应由稳定 ID/归属清单确认），不要把 `Load FITS`、Siril 等规划节点作为可创建条目。

## 7.3 Assets（素材库）

**目标用户动作**：浏览观测 Session 与天文原始文件 → 查看状态 → 直接添加素材对应的 Source Node。

基础对象：

- Capture Session（会话/拍摄批次）；
- Asset（单个文件/原始引用；FITS、SER、TIFF/PNG 等具体格式按真实 Adapter 能力支持）；
- Frame Type：Light、Dark、Flat、Bias、Dark Flat；
- 后期还可以有 Master Calibration、处理产物、设备和观测地引用，但本 UI 不需要读取所有科学参数。

交互：

- Search：文件名、Session 名、目标名称；不以读取图像内部参数为当前前端前置条件。
- Filter：文件类型/Frame Type/Session/设备等（实际字段不足时隐藏或禁用）。
- Sort：时间、名称、大小等，在有真实字段时生效。
- Session 树分组示例 `M31 / Light(36) / Dark(12) / Flat(20) / Bias(50)` 来自用户 UI 截图/助手原型，**只是演示数据**。
- 导入目录入口必须始终可发现，但在后端尚无安全授权/资产导入时显示“规划中/不可用”，不能假装扫描文件系统。
- 点击文件 → AssetDetails；点击 `+` 或拖拽 → 创建 `AstroPhotoAssetSource` 并绑定稳定 Asset ID。对于 Session 是否创建 `AstroPhotoSessionSource` 需业务接口成熟后再决定，不擅自展开为几十个节点。
- 文件失联、格式不支持、无缩略图、无权限要分开提示。
- 整个 FITS/SER 文件不嵌入 Workflow JSON，不强制转换成 PNG；高精度/元数据由 AstroPhoto 业务服务持有。

## 7.4 Settings（功能披露而非完整配置面板）

**用户明确要求**：即使现在不需要复杂配置，点击 Settings 也必须能看到“其他模块属于什么、以后做什么”，可点进去看功能介绍并返回。

七个模块：

| 稳定 ID | 中文名 | English label | 初版说明必须覆盖 | 现实状态（2026-11-16） |
|---|---|---|---|---|
| `software` | 软件管理 | Software | Siril/PixInsight 安装检测、程序路径、版本、可用操作 | PLANNED |
| `equipment` | 设备与光学链路 | Equipment & Optics | Camera、Telescope、Filters、Optical Train | PLANNED |
| `observing-site` | 观测地与光污染 | Observing Sites | 用户设置的地点、时间区、光污染来源/不确定性 | PLANNED |
| `knowledge` | 知识库 | Knowledge | 官方教程、文档索引、可追溯检索和节点帮助 | PLANNED |
| `memory` | 用户记忆与隐私 | Memory & Privacy | 经授权的偏好、事件证据、查看/删除与用户控制 | PLANNED |
| `agent` | Agent 上下文与 MCP | Agent Context & MCP | 外部 Agent、MCP Tools、上下文范围与能力发现 | 仅基础 MCP 2 Tools，业务部分 PLANNED |
| `system` | 系统状态 | System Status | Extension/宿主版本、注册与能力状态、错误 | Status API 基础已有；真实 Host 未验收 |

设置页结构：

```text
[节点] [素材] [设置（选中）]

AstroPhoto 设置
功能模块与配置入口

功能模块
  软件管理                   规划中      >
  设备与光学链路             规划中      >
  观测地与光污染             规划中      >
  知识库                     规划中      >
  用户记忆与隐私             规划中      >
  Agent 上下文与 MCP         规划中      >
  系统状态                   基础接口    >
```

**与旧截图的差异**：取消“基础设置 → 语言/主题”分组和两行控件。可直接从“功能模块”开始，顶部说明尽量简洁。

Settings 模块页通用字段：`id/title/description/status/reason/back`。系统状态页可读取已有真实 Status API，但 HTTP 失败必须显示错误，不把 404/500 视为已连接。所有“规划中”页**不得出现能执行保存/导入/安装的假按钮**。

## 7.5 全局状态与能力门禁

建议使用区分清楚的加载状态：

```ts
type Loadable<T> =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'ready'; data: T }
  | { state: 'empty' }
  | { state: 'unavailable'; reason: string }
  | { state: 'error'; message: string; status?: number }
```

- `idle` ≠ `empty` ≠ `unavailable` ≠ `error`。
- `status_api.available` 不说明 Canvas、Assets、Siril、Memory 或 Agent 已在线。
- 动作“成功”要获得对应 API/宿主事务的真实回执；节点创建、Workflow 保存、业务导入互不替代。
- 规划节点应展示“功能预留”而非像真的一样可拖拽。

---

# 8. 界面风格、图标、主题与国际化

## 8.1 风格不是布局的克隆

产品设计语言：**Minimal、专业编辑器、信息密度适中、中性色为主，低视觉干扰**。不要做大面积渐变、彩色状态徽章、笨重 Dashboard 卡片，尤其不要因为有七个业务模块就在 Settings 中堆七块大卡片。

参考 ComfyUI 的视觉节奏：

- Header 字重明显但占用空间低；
- Tab 使用紧凑、高度约 32px、横向按内容排列；
- 搜索框约 32px 高、圆角、柔和次级背景、清晰焦点态；
- Filter / Sort 为相同尺寸的方形 Icon Button；
- 列表行可用线性图标、标题 + 简短次文案；
- 展开/收起，鼠标悬停、键盘 Focus、无结果提示要一致；
- 色彩跟随宿主，只有错误和警告才强调。

这些尺寸是对 **v1.59.1 当前组件样式**的概括，用户尚未对 AstroPhoto 逐像素最终审核。

## 8.2 图标与 Emoji：未决设计事项

历史对话重要转折：用户嫌旧版“没有 emoji”，助手试过三种样式：

1. Emoji（`🧩 / 🗂️ / ⚙️` 等，仅原型演示）；
2. Lucide 单色线性图标（`boxes / folder-open / settings`）；
3. 纯文字。

**仍需用户视觉选择**。不要在最终需求中写“绝不使用 emoji”；也不要为了回应“没有 emoji”将所有专业列表、Settings 模块塞满 Emoji。建议下一次原型用**对照小区域**展示图标组合，用户选定后统一全产品，不把“图标模式切换器”作为正式设置项。

ComfyUI Sidebar 官方文档推荐 `icon-[lucide--<icon-name>]`，但指出图标类只保证已经被宿主构建包含的集合。用于 React 扩展的图标若要稳定，应依实际构建验证或由扩展自行打包 SVG/icon 资源；模板的 PrimeIcons `pi pi-*` 不适宜作为新增依赖基准。

## 8.3 主题：完全跟随系统

用户最后确认：**AstroPhoto 不需要独立主题设置**。

- 使用宿主设计变量：`--background`、`--foreground`、`--secondary`、`--border`、`--muted-foreground`、`--ring` 等。
- `Comfy.ColorPalette` 作为全局主题设置，由 ComfyUI 控制；不要让 AstroPhoto 单独写一个 `AstroPhoto.Theme` 或覆盖宿主。
- AstroPhoto CSS 应限定到 `.astrophoto-ui`；不覆盖全局 `body/button/.p-*`；Dark/Light/自定义主题下均需可读。
- 原 Frontend 1.59.1 不应依赖宿主的 PrimeVue 全局运行时和 `--p-*` 变量。

示意 CSS（实现前测试真实变量覆盖）：

```css
.astrophoto-ui {
  color: var(--foreground);
  background: var(--background);
  font: inherit;
  min-width: 0;
}
.astrophoto-ui .ap-search {
  background: var(--secondary);
  color: var(--foreground);
  border-radius: 8px;
}
.astrophoto-ui .ap-tab[aria-selected='true'] {
  background: var(--accent);
  color: var(--foreground);
}
.astrophoto-ui :focus-visible {
  outline: 2px solid var(--ring, currentColor);
}
```

## 8.4 语言：完全跟随系统，但继续中英双语适配

用户最后确认：**不再单独展示语言下拉框**，不是“取消国际化”。

- 仍需 `zh`（简体中文）和 `en`（英文）的全量翻译资源。
- 根据宿主 `Comfy.Locale` 决定当前语言；例如 `zh-CN / zh-Hans` → `zh`，`en-US` → `en`，其它回退英文。
- 宿主全局语言改变时应同步更新 AstroPhoto；不能写入宿主语言，也不能保存独立 AstroPhoto 语言覆盖模式。
- 当前文件 `AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md` 的 `LanguageSelector.tsx`、`AstroPhoto.UI.Language`、`auto/zh/en` 手动模式**已被本次聊天覆盖**。
- 同样，`AstroPhoto_React_Sidebar_Requirements_v1.0.md` 中 FR-S01“基础设置语言选择”与 FR-I01“用户主动覆盖”也**已过期**。
- 宿主语言**实时变更通知的稳定公开订阅方式尚未确认**；技术指南指出只知道读取 `app.extensionManager.setting.get('Comfy.Locale')`，不能假定 `.get()` 自动响应。React Host Adapter 必须有明确定义的同步策略，并在真实 1.59.1 中验证；不要不加边界直接 import 宿主内部 Pinia Store。
- 将 en/zh 文案作为 AstroPhoto 独立资源打包，避免全局 `/locales/...` 静态路径与其他 Extension 冲突。

示意逻辑：

```ts
function normalizeComfyLocale(value: unknown): 'zh' | 'en' {
  return typeof value === 'string' && /^zh(?:-|$)/i.test(value)
    ? 'zh'
    : 'en'
}

function syncAstroPhotoLocale(app: ComfyApp) {
  const comfyLocale = app.extensionManager.setting.get<string>('Comfy.Locale')
  const next = normalizeComfyLocale(comfyLocale)
  if (i18n.language !== next) void i18n.changeLanguage(next)
}
```

**这是项目建议示例**，不表示 `onSettingChanged` 有已核验的公开 React 接口。必须补加载时同步、可见时全局语言变更、卸载清理和 CI 翻译 Key 检查。


---

# 9. 官方 Node Library 搜索 / 筛选 / 排序源码调查

这是本次对话中**最后完成、后续必须承接**的专项调查。用户给出的截图布局为：

```text
[ ◯  搜索节点……              ] [ ≡ Filter ] [ ⚙ Sort ]
```

**定位结论**：Frontend **v1.59.1** 的新版节点库 `NodeLibrarySidebarTabV2.vue`，不是旧版 `NodeLibrarySidebarTab.vue`。截图中靠右两个按钮从左到右是 **Filter → Sort**，不要倒写为 Sort → Filter。`Comfy.NodeLibrary.NewDesign` 开关决定宿主使用旧版还是 V2，见 `useNodeLibrarySidebarTab.ts`。

## 9.1 源码地图（固定版本 v1.59.1）

| 文件 | 精确职责 | 目标 React 处理 |
|---|---|---|
| `src/components/sidebar/tabs/NodeLibrarySidebarTabV2.vue` | 组合 Nodes 视图的搜索、过滤、排序、分类和列表 | 只参考组织与状态，不导入 Vue |
| `src/components/sidebar/tabs/NodeLibrarySidebarTab.vue` | 旧版节点库：SearchInput + NodeSearchFilter Popover、GroupBy/Sort 按钮 | 防止拿旧版当目标截图 |
| `src/composables/sidebarTabs/useNodeLibrarySidebarTab.ts` | 通过 `Comfy.NodeLibrary.NewDesign` 选旧版或 V2 | 可用于解释版本差异，不直接依赖内部开关 |
| `src/components/sidebar/tabs/SidebarTopArea.vue` | 搜索与 actions 的 Flex 行容器 | React `SearchToolbar` 参考 |
| `src/components/ui/search-input/SearchInput.vue` | 搜索、清空、loading、focus、debounce 事件 | React `SearchInput` 实现同等行为 |
| `src/components/ui/search-input/searchInput.variants.ts` | h-6/h-8/h-10/h-12 变体、圆角、token 与 icon 定位 | CSS 视觉对齐，建议使用 `md` |
| `src/components/common/FilterDropdown.vue` | 多选分类 Filter、All 与边界状态 | React `FilterDropdown` 同样的模型 |
| `src/components/ui/menu/Menu.vue` | 通用菜单/Portal/Trigger | React 应用可访问的 Popover/Menu 语义 |
| `src/components/ui/menu/MenuRadioGroup.vue` | 单选项 Sort 菜单 | React `SortDropdown` |
| `src/services/nodeSearchService.ts` | Fuse.js 搜索索引、类型过滤、searchNode() | 复刻必要行为，不从宿主内部 import |
| `src/services/nodeOrganizationService.ts` | Node 分组、来源分类、排序策略 | React Node 分组/Sort 策略参考 |
| `src/components/sidebar/tabs/nodeLibrary/AllNodesPanel.vue` | 节点区块、书签区块、TreeExplorerV2 | 分类列表与渲染参考 |
| `src/composables/usePerTabState.ts` | 按 Tab 维护独立排序和状态 | React 按 view 保存状态 |
| `src/components/tab/Tab.vue` / `TabList.vue` / `tab.variants.ts` | 紧凑圆角 Tab 的布局和激活态 | React PrimaryTabs 设计参考 |
| `src/components/sidebar/tabs/AssetsSidebarTab.vue` | 另一个「已生成/已导入」Tab 的使用范例 | 标签语义与间距参考 |

**全部是 Comfy-Org/ComfyUI_frontend 仓库中 `v1.59.1` 版本路径**。在 §16 给出直达 URL。

## 9.2 `SidebarTopArea.vue`：顶部行为什么这样排？

固定版本中可概括为：

```text
SidebarTopArea
└─ display:flex; align-items:center; gap:8px; padding-x:16px; padding-y:8px
   ├─ flex:1; min-width:0
   │  └─ SearchInput（占据剩余水平空间）
   └─ flex-shrink:0; display:flex; gap:8px
      ├─ FilterDropdown Icon Button
      └─ Menu（Sort） Icon Button
```

在 AstroPhoto 里，Nodes 和 Assets 共用**同一 UI 外壳**；不同业务页分别传入 `searchPlaceholder`、`filterOptions`、`sortOptions`、`query`、callbacks。

## 9.3 `SearchInput.vue` + `searchInput.variants.ts`

真正的 `SearchInput` 底层是 `reka-ui` 的 Combobox 系列组件，使用 `v-model` 绑定输入字符串；默认图标为 Lucide Search；带 clear（有内容时出现）、loading spinner、禁用、尺寸与焦点状态。默认 `debounceTime` 为 **300ms**，使用 `@vueuse/core` 的 `watchDebounced` 触发 `search` 事件。

`searchInput.variants.ts` 的默认 `md` 变体（来自 1.59.1 源码）：

- 高度：`h-8` = 32px；
- 内边距：`px-2 py-1.5`；
- `rounded-lg`；
- 背景使用 `bg-secondary`，文字用 `text-foreground`；
- 焦点使用 `focus-within:ring-1 focus-within:ring-ring`；
- 搜索图标约 16px（`size-4`），左侧 10px、输入左内边距约 32px；
- 无边框式输入控件，输入主体透明。

**非常重要的细节**：在 `NodeLibrarySidebarTabV2.vue` 中，真正搜索数据的 `filteredNodeDefs` 是 **computed**，会随 `searchQuery` 的改变更新；300ms 的 `@search` 回调还负责等待 nextTick、展开搜索结果 Tree。不能简单地说“整个节点检索都统一在 300ms 后才执行”。

推荐 React 实施：

```tsx
// 项目建议，非宿主 Vue 源码复制；仅展示接口语义
type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  onDebouncedSearch?: (value: string) => void
  disabled?: boolean
}

function SearchInput(props: SearchInputProps) {
  // input：受控 value + onChange，clear、focus、中文 IME 处理
  // onDebouncedSearch：用于服务端查询/树展开；按需调用
  // 视觉：md 32px、rounded-lg、secondary 背景、focus ring
  return null // 交接中的接口伪代码；不要直接交付这个占位实现
}
```

这不是可发布组件，请勿原样用 `return null` 充当完成。真正交付时需键盘/ARIA/IME/清空/取消请求/去重和测试。

## 9.4 `NodeSearchService.ts`：如何查到 Node

固定版本的搜索服务使用 Fuse.js 封装的 `FuseSearch / FuseFilter`。主要参数：

```text
keys = [name, display_name, search_aliases]
includeScore = true
threshold = 0.3
shouldSort = false（主 FuseSearch）
useExtendedSearch = true
advancedScoring = true（项目封装）
```

`searchNode(query, filters, options, extraOptions)`：

1. 搜索候选节点；
2. 对候选按当前 Filter 列表做 `every(...)` 交集检查；
3. 若 `matchWildcards` 允许则对剩余候选再匹配 wildcard；
4. 按 `limit` 截取结果。

V2 Sidebar 实际调用语义：

```ts
nodeDefStore.nodeSearchService.searchNode(
  searchQuery,
  [],
  { limit: 64 },
  { matchWildcards: false }
)
```

源码内建立了四种 `FuseFilter`：`inputTypeFilter`、`outputTypeFilter`、`nodeCategoryFilter`、`nodeSourceFilter`，对应 Input Type、Output Type、Category、Source。旧版 `NodeSearchFilter.vue` 更直接使用字段值过滤；**新版 Sidebar 的 FilterDropdown 更偏向节点来源/分类开关，不完全等于旧版高级字段过滤 Popover**。

**AstroPhoto 推荐**：共享 UI，但 Node Search 的索引逻辑独立，`query` 字段不能与 Asset Search 强行套一个索引模型。文件和拍摄 Session 可采用服务端索引/本地小集合过滤，必要时另建搜索服务；不必为了复刻 Fuse.js 而拖入全部 ComfyUI 内部服务。

## 9.5 `FilterDropdown.vue`：不是一个普通单选下拉框

FilterDropdown 的输入是 `Record<string, boolean>`，例如 V2 All Nodes 的过滤类别：

```ts
type NodeFilters = {
  blueprints: boolean
  comfyNodes: boolean
  partnerNodes: boolean
  extensions: boolean
}
```

V2 `NodeLibrarySidebarTabV2.vue` 用 `nodeFilterLabels` 定义上述四个类别。Essentials 子 Tab 另有媒体类型：`image/video/text/audio/3d`。**不同 Tab 的 Filter 选项并不相同。**

行为要点：

- 菜单中的 `All` 可以全选；
- 可切换每个分类；
- 当“原本全选”时选择某一类别，可转为只看该类别；
- 避免所有类别都为 false 的不易理解状态：若关到最后一个，组件会重新回到全选；
- 菜单可保持展开，允许连续多次切换；
- 每个选项状态使用 `checked` / checkbox menu 的可访问语义。

React 目标应做成无业务耦合的控件，例如：

```ts
type FilterDropdownProps<K extends string> = {
  selected: Record<K, boolean>
  options: ReadonlyArray<{ id: K; label: string }>
  onChange: (next: Record<K, boolean>) => void
  allLabel: string
}
```

**不得**把旧版 `NodeSearchFilter.vue`（输入端口、输出端口等 Fuse 过滤器）直接说成 V2 截图那一颗按钮的唯一实现。

## 9.6 Sort：`Menu` + `MenuRadioGroup` + NodeOrganizationService

新版 V2 的 All Nodes 视图使用 `Menu` 触发器，图标（固定版）是 **`icon-[lucide--settings-2]`**，菜单内部是 `MenuRadioGroup`。`Menu.vue` 基于 `reka-ui` DropdownMenu；`MenuRadioGroup.vue` 使用 `DropdownMenuRadioGroup` 等原语。

排序策略从 `nodeOrganizationService.getSortingStrategies()` 取得。固定版本至少有两种：

| Sort ID | 业务含义 | 实际策略 |
|---|---|---|
| `original` | 默认分类/原顺序 | compare 返回 0；保留原组织结构 |
| `alphabetical` | A-Z | `display_name.localeCompare()`，在 V2 中还可将多个分类合并为字母顺序树 |

V2 保存按 Tab 的排序值：

```text
useLocalStorage('Comfy.NodeLibrary.SortByTab', {
  essentials: DEFAULT_SORTING_ID,
  all: DEFAULT_SORTING_ID,
  blueprints: 'alphabetical'
})
```

然后用 `usePerTabState(selectedTab, sortOrderByTab)` 映射当前选中 Tab 的 Sort。**这说明排序属于每一个浏览视图状态，不应由 Nodes 的 Sort 改变 Assets 的 Sort。**

V2 `essentials` 下相同位置不是普通 Sort，而是 `Jump To` (`icon-[lucide--list-tree]`)；不能脱离模式笼统认为第二按钮永远是 Sort。对于 AstroPhoto，由于只做 Nodes/Assets 两个主要资源页，当前推荐 Nodes 标准模式使用 Sort，Assets 另定义适用排序。

## 9.7 分组与列表：`nodeOrganizationService` / `AllNodesPanel`

- 节点分类不是简单 `array.sort()`；`nodeOrganizationService.organizeNodesTab()` 会按 Blueprint、Comfy Nodes、Partner Nodes、Extension 等来源组织 NodeSections。
- `AllNodesPanel.vue` 包含 Favorites/Bookmarks、分类区块、`TreeExplorerV2`。
- `NodeLibrarySidebarTabV2.vue` 根据 Filter 把对应 section 保留/隐藏，按 Sort 决定保持分组还是合并字母序。
- 条目的 icon、拖放与点击处理在 V2 的 Tree 节点转换/拖拽 composable 中实现。

AstroPhoto 不必照搬完整 ComfyUI 来源分类；它主要展示自己已注册 Node，可以按 **处理阶段/软件** 分类。必须先确认数据来源是否足够判定这些元信息，不能靠用户界面静态字符串使 Node 真的可执行。

## 9.8 老版与新版源码差异（切勿混用）

| 对比 | NodeLibrarySidebarTab.vue（旧） | NodeLibrarySidebarTabV2.vue（新） |
|---|---|---|
| 搜索 | SearchInput + 显式 handleSearch | SearchInput + computed 搜索结果 |
| 过滤 | NodeSearchFilter Popover，过滤 Input/Output/Category/Source | FilterDropdown，节点来源类别开关/Essentials 媒体类型 |
| 排序 | 顶部 `tool-buttons` 内独立 GroupBy/Sort Popover | 与搜索同一行，右侧 Filter + Sort（All）；Essentials 改 JumpTo |
| 树 | TreeExplorer + BookmarkTree | AllNodesPanel / EssentialNodesPanel + TreeExplorerV2 |
| 状态持久化 | GroupBy/Sort 各一份 localStorage | per-tab Sort 状态 localStorage |
| 本次截图目标 | 不是这张 | **是** |

切换在 `src/composables/sidebarTabs/useNodeLibrarySidebarTab.ts`，取 `Comfy.NodeLibrary.NewDesign` 决定组件。用户本地实际页面是否打开 NewDesign，还需看设置值；由于截图符合 V2 布局，本轮以 V2 为设计参考。

## 9.9 对 AstroPhoto React 新目录的具体增量要求

最终 React 技术指南 v1.1 的基础树只有 `shared/components/SearchField.tsx`，尚未吸收上述最后一轮发现。建议在用户确认 UI 后，将共享资源工具栏明确拆分：

```text
ui/src/
├── shared/
│   └── search/
│       ├── SearchToolbar.tsx          # 单行布局：Search → Filter → Sort
│       ├── SearchInput.tsx            # 32px / clear / loading / IME / focus
│       ├── FilterDropdown.tsx         # checkbox 多选 + All
│       ├── SortDropdown.tsx           # radio 单选
│       └── searchTypes.ts             # 类型与回调契约（按真实复用需要）
│
└── features/
    ├── nodes/
    │   ├── useNodeSearch.ts          # NodeDef 索引与过滤
    │   ├── nodeSortOptions.ts        # 来源分类 / alphabetical
    │   └── NodesPage.tsx
    └── assets/
        ├── useAssetSearch.ts         # 资产 / Session 查询
        ├── assetSortOptions.ts       # 名称 / 时间 / 文件类型等
        └── AssetsPage.tsx
```

这是一条**新建议**，不是之前 v1.1 文档已落地的源码。若实际只需三个通用控件，也不必增加空的 `searchTypes.ts` 等模板文件。优先围绕真实使用的抽象复用。

## 9.10 推荐下一次在聊天里怎样画这部分

将 Nodes 视图顶部只展示如下紧凑交互组件（视觉优先，详细列表以后迭代）：

```text
AstroPhoto                                 [Help] [Settings] [Close]
─────────────────────────────────────────────────────────────────
[ 节点 ] [ 素材 ] [ 设置 ]    ← content-width, left-aligned, rounded selected

[ 搜索节点...                            ] [Filter] [Sort]
    ↑ 无边框 32px、放大镜、可清空            ↑多选   ↑单选

（选择后按条件展示真实节点分类/树）
```

图标：放大镜、`list-filter`、`settings-2`/排序图标皆为源代码样式参考；具体 Emoji 是否加入主 Tab 尚待用户选择。Filter 与 Sort 的 Popover 菜单可以做真实可交互原型，但**此阶段不需要接入真实 ComfyUI 节点列表**。原型控件必须真的切换筛选/排序示例数据，不做完全无行为的装饰。


---

# 10. React 与 ComfyUI 的边界和官方 API

## 10.1 官方 React Extension Template 只是参考，不是要全量照搬

用户明确提供的原模板：

```text
ComfyUI-React-Extension-Template/
├── __init__.py
├── pyproject.toml
├── ui/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── vite-env.d.ts
│   │   ├── setupTests.ts
│   │   ├── utils/i18n.ts
│   │   └── __tests__/dummy.test.tsx
│   ├── public/locales/{en,zh}/main.json
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── jest.config.js
│   ├── jest.setup.js
│   ├── eslint.config.js
│   ├── .eslintrc.json
│   └── .prettierrc
├── .github/workflows/react-build.yml
├── .gitignore
├── README.md
└── LICENSE
```

助手当时提出的工程修正：

- 保留 `ui/src/main.tsx` 作为唯一入口，用 `app.registerExtension()` 与宿主生命期对齐，避免纯 `window.app` 轮询成为生产核心；
- Sidebar 的 `render()`/`destroy?()` 管 React Root；
- React 不依赖宿主 Vue/PrimeVue 实例；
- i18n 资源内置 `ui/src/i18n/locales/`，避免模板演示的 `/locales/...` 全局命名冲突；
- 类型包以 Frontend `1.59.1` 为目标版本，不能盲用模板旧 `^1.20.2`；
- `vite.config.ts`、`jest.config.js`、`eslint.config.js` 各保留一份配置，不同时维护 `.js/.ts` 重复入口；
- 此 React Template 原 `__init__.py` 的 V1 映射不可覆盖现有 ComfyUI_AstroPhoto V3 `comfy_entrypoint()`；
- 避免 `vendor` 多 chunk 造成被 ComfyUI `/extensions` 扫描为额外脚本入口（需要固定版本构建实测）；
- **选择 npm 或 pnpm 只能保留一套当前仓库实际使用的锁文件**，不是必须机械把 pnpm 换 npm；
- 原模板里 About/Bottom Panel/Run/Clear Workflow 演示功能不是 AstroPhoto UI 需求。

**当前不确定**：实际 Windows 项目可能继续以 `frontend/` 为主，并以 Vite 产出 `js/`；目标 React Template 使用 `ui/` 和 `dist/`。在拿到真实代码并决定单仓集成方式之前，**文件名 `frontend/` vs `ui/` 和输出 `js/` vs `dist/` 不是已迁完的事实**。本次用户明确要求设计仅针对 React Template `ui/`，所以 §11 使用 `ui/` 目标树。

## 10.2 固定版本 API：稳定边界与内部实现

| 功能 | 来源 / 接口 | 能直接当扩展依赖？ | 注意 |
|---|---|---|---|
| 注册 Extension | `app.registerExtension({...})` | 官方扩展生命周期 | 不要多个名字/入口重复注册 |
| 注册 Sidebar | `app.extensionManager.registerSidebarTab({...})` | 官方 Sidebar API | `type:'custom'`、`render(element)`；`destroy?()` 在 1.59.1 类型中存在 |
| 提供 Host App | `../../scripts/app.js` 等扩展脚本映射 | 需根据最终产物路径配置 | 不能假设 `/scripts` 根 URL 在任意代理前缀下都正确 |
| 获取 Node Definitions | `app.getNodeDefs()` / `app.fetchNodeDefs()` | 固定版本类型中存在 | 前端应复用已加载 defs，按实际运行时结果验收 |
| Node Schema 网络接口 | `GET /object_info` / `GET /object_info/{node_class}` | 后端公开接口 | 不存在节点可能返回 HTTP 200 与空对象，需检查 body |
| Canvas 坐标变换 | `app.clientPosToCanvasPos([x,y])` | 固定版本类型有定义 | 仍需确认 Sidebar→Canvas 事件命中、当前 Graph/Subgraph |
| 创建 Node 内部过程 | `LiteGraph.createNode`、`canvas.graph.add`、`graph.change` | **内部低层方式，非官方稳定高阶扩展 API** | 必须隔离到 Host Adapter、真实验收 Undo/Redo |
| ComfyUI Settings | `app.extensionManager.setting.get(id)` | 官方/固定版 | 读取宿主 Locale；不建立 AstroPhoto UI Locale 覆盖 |
| HTTP 请求 | `app.api.fetchApi(route, options)` | 宿主公开接口 | 处理子路径代理、401/403/404/500、Abort |
| Status | `GET /astrophoto/v1/status` | 项目已有路线（隔离验证） | 不代表业务在线，也非宿主必然已加载 |
| Workflow 保存 | 原生 Workflow Store/命令 | 原生宿主管理 | 不经 AstroPhoto 自己保存 JSON；保存是否成功要真实回执 |
| V3 Node | `io.ComfyNode`、`io.Schema`、`io.NodeOutput`、`ComfyExtension.get_node_list()` | 官方后端 V3 模型 | 本任务只定义接口契约，不批量实现业务 Nodes |

当前官方 JS Sidebar 文档示例：`registerSidebarTab({ id, icon, title, tooltip, type:'custom', render })`，React 示例使用 `createRoot(container)`。固定版 `extensionTypes.ts` 还提供可选 `destroy()`；**不得假设任何 hide/toggle 都会触发 destroy**，需要在宿主测试。

## 10.3 React Root 生命周期的推荐封装

以下属于对官方 API 的**项目示例**，不是本机已编译完成的产品代码：

```tsx
// ui/src/main.tsx —— 示例，不含旧 languageModeSetting
import { app } from '/scripts/app.js'
import { registerAstroPhotoSidebar } from './host/sidebar'

app.registerExtension({
  name: 'AstroPhoto.Sidebar',
  async setup() {
    registerAstroPhotoSidebar(app)
  },
})
```

```tsx
// ui/src/host/sidebar.tsx —— 实际 app import/type 需按固定版确认
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { App } from '../app/App'

let root: Root | undefined
let mountElement: HTMLElement | undefined

export function registerAstroPhotoSidebar(app: ComfyApp) {
  const id = 'astrophoto.sidebar'
  if (app.extensionManager.getSidebarTabs().some(tab => tab.id === id)) return

  app.extensionManager.registerSidebarTab({
    id, type: 'custom', title: 'AstroPhoto', tooltip: 'AstroPhoto',
    icon: 'icon-[lucide--aperture]', // 必须确认该图标确实随构建可用
    render(container) {
      root?.unmount()
      mountElement?.remove()
      mountElement = document.createElement('div')
      mountElement.className = 'astrophoto-ui'
      container.appendChild(mountElement)
      root = createRoot(mountElement)
      root.render(<React.StrictMode><App /></React.StrictMode>)
    },
    destroy() {
      root?.unmount()
      root = undefined
      mountElement?.remove()
      mountElement = undefined
    },
  })
}
```

**注意**：这个例子只说明 `render/destroy` 和单 Root 原则；本文件没有核实 `ComfyApp` 的全部 import 路径或 React 测试装配，不能作为无修改即可编译的代码。目标测试：单一 Tab、重复 render 不泄漏 Root、destroy 幂等、关闭/浮动/切换后没有重复监听、无无效 Hook 引用。

## 10.4 HTTP 范围：现有与规划严格分开

| HTTP | 归属 | 状态 | AstroPhoto Sidebar 用法 |
|---|---|---|---|
| `GET /extensions` | ComfyUI Backend | 已有 | 部署诊断，检查输出 JS 是否被正确枚举 |
| `GET /object_info` | ComfyUI Backend | 已有 | Node Library 的原始定义 |
| `GET /object_info/{node_class}` | ComfyUI Backend | 已有 | NodeDetails 等；不能只凭 HTTP 200 判定节点存在 |
| `GET /system_stats` | ComfyUI Backend | 已有 | System Status 可用的部分宿主信息 |
| `GET /features` | ComfyUI Backend | 已有 | 能力诊断时使用 |
| `GET/POST/DELETE /userdata/...` | ComfyUI Backend | 已有 | Workflow 原生系统内部使用，AstroPhoto 不需直接造保存器 |
| `POST /prompt` | ComfyUI Backend | 已有 | 工作流提交执行；不代表编辑当前 Canvas |
| `GET /queue`、`GET /history/...`、`WS /ws` | ComfyUI Backend | 已有 | 当前不新增实验/队列 UI |
| `POST /upload/image` | ComfyUI Backend | 已有 | 旧绘图 Widget PNG 上传；**不是 FITS/SER 业务资产入口** |
| `GET /astrophoto/v1/status` | AstroPhoto Extension | 已存在、隔离测试通过 | System Status 初版唯一已知业务 API |
| `GET /astrophoto/v1/assets` | AstroPhoto Extension | **PLANNED** | 将来素材列表，不存在时显示真实 unavailable |
| `GET /astrophoto/v1/sessions` | AstroPhoto Extension | **PLANNED** | 将来会话列表 |
| `GET /astrophoto/v1/assets/{asset_id}` | AstroPhoto Extension | **PLANNED** | 将来素材详情 |
| `POST /astrophoto/v1/assets/import` | AstroPhoto Extension | **PLANNED** | 将来授权导入，不得允许任意本机路径滥用 |
| `GET /astrophoto/v1/catalog` | AstroPhoto Extension | **可选规划** | 将来专业元信息；不能复制注册 Node Schema |

端口 `8188` 是本地 ComfyUI 常见默认/示例端口，并非不可更改固定值；UI 应通过同源宿主 `app.api.fetchApi` 工作。

## 10.5 统一 HTTP 适配层

```ts
// ui/src/api/client.ts —— 推荐示例
export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

export async function getJson(path: string, signal?: AbortSignal) {
  const response = await app.api.fetchApi(path, { signal })
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP_${response.status}`)
  }
  const data: unknown = await response.json().catch(() => {
    throw new ApiError(response.status, 'INVALID_JSON')
  })
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ApiError(response.status, 'INVALID_RESPONSE')
  }
  return data
}
```

**实现时仍需 DTO 结构校验**，不能 `as SomeType` 就视为接收安全。通过 `AbortController` 防关闭或切页后 setState；鉴别空结果、权限不足、超时/断线和 404 未实现。

## 10.6 构建与资源路径

官方 JS 扩展机制：Python 模块导出 `WEB_DIRECTORY`，宿主发现其中的 `.js`，浏览器装载这些扩展脚本。Backend `0.45.0` 的 `/extensions` 枚举 `WEB_DIRECTORY` 下 `.js` 的情况在旧技术指南中已经核查。因此：

1. 推荐 React 入口编成**一个可被发现的主 JS**，避免 `vendor` chunks 被当作另一扩展入口加载；
2. 必须检验 Vite `external`/`output.paths` 的实际相对层级，**不能把模板 `../../scripts/app.js` 不经判断复制到不同输出目录**；
3. CSS 如独立产出必须有可靠加载策略；可以由 `import.meta.url` 计算相对路径，不把 `/locales/`、`/assets/` 写死为站点根；
4. UI 不要把 ComfyUI 宿主的所有 Vue/PrimeVue 依赖重新打包进 React；
5. Chrome Network 和 `/extensions` 必须实测 `main.js/CSS`、语言、动态资源无 404、重复加载或多次注册；
6. React Template 自带 npm 作为示例，实际合入旧 pnpm Monorepo 时统一工具链后再 build；
7. `dist/` 与原项目 `js/` 输出名是路径适配问题，用户当前没有要求在聊天原型阶段解决它。

技术指南中给出的 Vite `lib`、`inlineDynamicImports` 和 CSS loader 是**推荐配置示例**，并非本机已执行 `npm run build` 的证据。真正实施前必须逐项跑 build 与文件清单验证。

---

# 11. 推荐前端文件树及组件契约

下述结构为**新版交接建议的 React `ui/` 目标结构**。基于原 Technical Guide v1.1，额外吸收了**最近的主题/语言规则变更**和**Search + Filter + Sort 源码调查**。不是要求 Agent 创建所有空文件。名称可按真实代码调整，但职责边界不能模糊。

## 11.1 最终建议目录（前端限定版）

```text
ComfyUI-React-Extension-Template/
├── __init__.py                         # 仅说明宿主静态资源入口；不能覆盖现有 V3 入口
├── pyproject.toml                      # 发行元数据；本轮不调整整个 Monorepo
│
└── ui/
    ├── src/
    │   ├── main.tsx                   # 一个 Extension 注册入口
    │   ├── vite-env.d.ts
    │   │
    │   ├── app/
    │   │   ├── App.tsx                # Sidebar Shell、三主视图路由状态
    │   │   ├── App.css                # 根布局（不含业务详情样式）
    │   │   └── navigation.ts          # Nodes/Assets/Settings、详情/返回、本地状态
    │   │
    │   ├── host/                      # ComfyUI 1.59.1 API 版本适配边界
    │   │   ├── comfy.ts              # app/api 获取与就绪处理
    │   │   ├── comfy-shims.d.ts       # 宿主模块 TypeScript 声明
    │   │   ├── sidebar.tsx           # 注册 Sidebar、React Root 挂载/卸载
    │   │   ├── locale.ts             # 只读取/同步 Comfy.Locale；不保存私有选择
    │   │   ├── theme.ts              # [可选] 宿主主题联动，若纯 CSS 足够不必建
    │   │   ├── canvas.ts             # [能力就绪后] Node 创建、当前图事务
    │   │   └── dragDrop.ts           # [能力就绪后] AstroPhoto 专用资源 DnD
    │   │
    │   ├── api/                       # 唯一网络请求边界
    │   │   ├── client.ts             # fetchApi、Abort、HTTP/JSON/DTO 错误
    │   │   ├── status.ts             # 现有 /astrophoto/v1/status
    │   │   ├── nodes.ts              # [可选] /object_info 映射；优先宿主 defs
    │   │   └── assets.ts             # [待后端实现] 素材/Session API
    │   │
    │   ├── features/
    │   │   ├── nodes/
    │   │   │   ├── NodesPage.tsx
    │   │   │   ├── NodeList.tsx
    │   │   │   ├── NodeRow.tsx
    │   │   │   ├── NodeDetails.tsx
    │   │   │   ├── nodeCatalog.ts    # ComfyUI NodeDef → Astro NodeViewModel
    │   │   │   ├── useNodes.ts        # NodeDef 获取/缓存/错误
    │   │   │   ├── useNodeSearch.ts   # [新增建议] 名称/别名搜索
    │   │   │   └── nodeSortOptions.ts # [新增建议] 分类/字母序
    │   │   │
    │   │   ├── assets/
    │   │   │   ├── AssetsPage.tsx
    │   │   │   ├── SessionTree.tsx
    │   │   │   ├── AssetList.tsx
    │   │   │   ├── AssetRow.tsx
    │   │   │   ├── AssetDetails.tsx
    │   │   │   ├── assetTypes.ts      # 未来 Asset/Session DTO
    │   │   │   ├── useAssets.ts       # 请求/错误/空态
    │   │   │   ├── useAssetSearch.ts  # [新增建议] 文件/Session 搜索
    │   │   │   └── assetSortOptions.ts # [新增建议] 名称/时间/大小等
    │   │   │
    │   │   └── settings/
    │   │       ├── SettingsPage.tsx   # 七模块目录；不含独立语言/主题
    │   │       ├── ModuleList.tsx
    │   │       ├── ModuleInfoPage.tsx
    │   │       └── moduleRegistry.ts  # ID、名称与说明 i18n key、真实状态
    │   │
    │   ├── shared/
    │   │   ├── components/
    │   │   │   ├── SidebarHeader.tsx
    │   │   │   ├── PrimaryTabs.tsx    # 紧凑 ComfyUI 式 Tabs
    │   │   │   ├── EmptyState.tsx
    │   │   │   └── StatusText.tsx
    │   │   ├── search/               # 本次最新版建议
    │   │   │   ├── SearchToolbar.tsx  # Search + Filter + Sort
    │   │   │   ├── SearchInput.tsx
    │   │   │   ├── FilterDropdown.tsx
    │   │   │   └── SortDropdown.tsx
    │   │   ├── types.ts
    │   │   └── errors.ts
    │   │
    │   ├── i18n/
    │   │   ├── index.ts              # i18next zh/en，随宿主语言同步
    │   │   └── locales/
    │   │       ├── zh/main.json
    │   │       └── en/main.json
    │   │
    │   ├── styles/
    │   │   ├── theme.css             # 跟随 ComfyUI CSS tokens、scoped
    │   │   └── components.css        # Tab/Search/Row 共享视觉规则
    │   │
    │   └── __tests__/
    │       ├── setupTests.ts
    │       ├── fixtures.ts           # 仅测试的 M31、规划 Node 模拟数据
    │       ├── navigation.test.tsx
    │       ├── settings.test.tsx
    │       ├── i18n.test.tsx         # 自动跟随 Comfy.Locale + Key 完整性
    │       ├── theme.test.tsx        # Light/Dark 可见性及不污染宿主
    │       ├── search-toolbar.test.tsx
    │       ├── filter-sort.test.tsx
    │       ├── lifecycle.test.tsx
    │       ├── api.test.ts
    │       ├── node-catalog.test.ts
    │       ├── canvas.test.ts        # [能力就绪后]
    │       └── drag-drop.test.tsx    # [能力就绪后]
    │
    ├── package.json
    ├── package-lock.json             # 若仍独立使用 npm；合仓则以实际管理器统一
    ├── vite.config.ts                # 一个可信构建配置
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── jest.config.js                # 保留模板 Jest；若工程已有 Vitest 则做明确选择
    ├── eslint.config.js
    ├── .prettierrc
    └── README.md                     # 开发/构建/验证命令
```

**不应保留的旧目标文件/职责**：`LanguageSelector.tsx`、`host/settings.ts` 中仅用于 `AstroPhoto.UI.Language` 的私有设置注册、React 级 `ThemeSelector`、`features/experiments`、`features/workflows`、第二个节点注册系统、直接导入 Vue `Tab.vue`。若未来 `host/settings.ts` 有其他真正的非主题/语言设置用途，可以保留；不能为了目录图强删有用代码。

## 11.2 层级职责（重要性高于文件名）

```text
main.tsx
  → host/sidebar.tsx
      → app/App.tsx
          ├── shared/PrimaryTabs.tsx
          ├── NodesPage.tsx
          │    ├── shared/search/SearchToolbar.tsx
          │    ├── NodeList/Row/Details
          │    └── nodeCatalog → app.getNodeDefs() / object_info
          ├── AssetsPage.tsx
          │    ├── shared/search/SearchToolbar.tsx
          │    ├── SessionTree/AssetList/AssetDetails
          │    └── useAssets → AstroPhoto Assets API（未来）
          └── SettingsPage.tsx
               ├── ModuleList（7 条）
               ├── ModuleInfoPage（共用一套）
               └── status API（系统状态，可按需读取）

Nodes + Assets 中的 Add / Drag
  → host/canvas.ts + host/dragDrop.ts
  → ComfyUI 当前 Canvas / Graph
  → ComfyUI 自有 Workflow Save / Load / Undo
```

- `host/` 才能直接访问 `app`、Canvas、窗口扩展接口；
- `api/` 是通用 HTTP、Status、Assets 数据出口，不依赖 React；
- `features/*` 是业务用户界面，不直接 `window.app`、不自行拼绝对 URL；
- `shared/*` 只放真实跨 Nodes/Assets 复用的组件；
- `i18n` 只读宿主语言、负责本 UI 文案，不能修改全局系统语言；
- `app/` 只管理 Sidebar 的导航和组合，**不维护另一个 Workflow Store**。

## 11.3 哪些文件属于第一批真正应该存在？

不建议机械创建上面所有目录。按现有能力与用户本轮重点，最小有效目标为：

- `main.tsx`、`host/sidebar.tsx`、`app/App.tsx`、`app/navigation.ts`；
- `shared/components/PrimaryTabs.tsx`、`SidebarHeader.tsx`；
- `shared/search/SearchToolbar.tsx` 及可交互的 Search/Filter/Sort（即使数据先用测试 fixtures，在生产无服务时要显示空态）；
- `features/nodes/NodesPage.tsx`（真实 NodeDef 或空态）；
- `features/assets/AssetsPage.tsx`（真实不可用/空态，不假导入）；
- `features/settings/SettingsPage.tsx`、`ModuleList.tsx`、`ModuleInfoPage.tsx`、`moduleRegistry.ts`；
- `i18n/` zh/en 与 `host/locale.ts`；
- `styles/theme.css`；
- 对应导航、Settings、i18n、Search、生命周期与构建检查。

Node/Asset 拖放 Host Adapter 有真实宿主与数据前置，不能仅凭代码文件出现就标已交付。


---

# 12. 素材即节点 / Workflow 所有权 / 数据契约

## 12.1 两种 Sidebar 资源，同一 Canvas 创建管线

```text
NodesPage                       AssetsPage
   │                               │
   ├─ NodeRow +                   ├─ AssetRow +
   ├─ NodeRow Drag                ├─ AssetRow Drag
   │                               │
   └──────────────┬────────────────┘
                  ▼
          host/canvas.ts
          host/dragDrop.ts
                  │
                  ├─ 识别资源类型（Node/Asset/Session）
                  ├─ 检查真实 Node Class / Capability
                  ├─ 检查可编辑 Canvas 与当前 Graph/Subgraph
                  ├─ 客户端坐标 → Canvas 坐标
                  ├─ 创建 Node 实例
                  ├─ Asset/Session：设置稳定 ID
                  ├─ 通知图变更/撤销系统
                  └─ 回执 created / failed（**不是 saved**）
                            │
                            ▼
                     ComfyUI Workflow
```

拖动 Node 不等于执行 Node；拖动 Asset 不等于导入文件；把 Node 放进当前 Graph 不等于自动保存 Workflow。用户希望的是一个顺滑可操作的编辑器，而不是绕开宿主状态所有权。

## 12.2 建议的拖拽负载（前端结构化示例）

```ts
const ASTRO_DRAG_MIME = 'application/x-astrophoto-resource+json'

type AstroDragResource =
  | { v: 1; kind: 'node'; nodeId: string }
  | { v: 1; kind: 'asset'; assetId: string }
  | { v: 1; kind: 'session'; sessionId: string }
```

- 自定义 MIME 只包含版本和稳定资源 ID，不包含本地绝对文件路径、命令、授权凭证；
- 仅在放置到目标 Canvas 且是自己 MIME 时接管事件，不能全局无条件 `preventDefault` 导致 ComfyUI 原生文件拖放失效；
- 对 JSON、`v`、ID 类型、资源存在、Node 注册、用户权限作验证；
- 支持取消拖拽、drop 失败的预览清理；
- 输入不可用时禁用成功动作；
- 真实内部 LiteGraph/Canvas 操作只在 `host/canvas.ts` 中调用，接口应可注入模拟以便测试。

## 12.3 推荐的 Asset Source Node 语义

> 以下仅为跨前后端的目标接口，不是当前 Python 仓库已创建的 Node，也不是现在这轮 React UI 实施的授权范围。

```python
# [PLANNED] 目标接口示例
from comfy_api.latest import io

class AstroPhotoAssetSource(io.ComfyNode):
    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="AstroPhotoAssetSource",
            display_name="AstroPhoto Asset Source",
            category="AstroPhoto/Assets",
            inputs=[io.String.Input("asset_id", default="")],
            outputs=[io.Custom("ASTRO_ASSET").Output(display_name="asset")],
        )

    @classmethod
    def execute(cls, asset_id: str) -> io.NodeOutput:
        # 尚未实现：需要通过后端 Asset Service 验证/读取引用
        ref = resolve_verified_asset(asset_id)
        return io.NodeOutput(ref)
```

`resolve_verified_asset()` 是**纯占位设计函数**；不能让它出现在当前可用功能清单，也不能在真实工程中留一个虚假成功实现。

目前已有的专业类型提案：

| Node Class（建议） | 输入 | 输出 | 实施状态 |
|---|---|---|---|
| `AstroPhotoAssetSource` | `asset_id: STRING` | `asset: ASTRO_ASSET` | 规划 |
| `AstroPhotoSessionSource` | `session_id: STRING` | 批量资产结构待明确 | 规划 |
| `AstroPhotoFrameDecode` | `asset: ASTRO_ASSET` | `frame: ASTRO_FRAME` | 规划 |
| `AstroPhotoPreview` | `frame: ASTRO_FRAME` | ComfyUI `IMAGE` | 规划 |

`ASTRO_ASSET`、`ASTRO_FRAME` 尚未完成真实类型、缓存、序列化、执行的宿主验证；不能因为 Code Example 出现就把这些当作正式 ComfyUI 公共数据类型。FITS/SER/视频、深度和科学元数据保留需要独立测试。

## 12.4 为什么工作流只保存引用

用户从 AssetLibrary 拖入 `M31_Light_001.fit` 后，Workflow 中保存：

- Node Class ID：`AstroPhotoAssetSource`（未来注册成功后）；
- Widget/输入数据：稳定 `asset_id`；
- 节点位置与连接关系；
- 其他处理节点所需参数。

Workflow **不应该**序列化整个 FITS 文件或大视频；原始素材仍由 AstroPhoto 业务服务管理。重新打开时解析 `asset_id`；若路径移动、文件丢失、权限不再允许，界面和执行逻辑应给诊断与重新定位策略。

```text
ComfyUI Workflow JSON
  └── Node( AstroPhotoAssetSource, asset_id='asset-...' )
                     │
                     ▼
               AstroPhoto Asset Service
                     │
                     ├─ path / fingerprint / format / state
                     ├─ Session / FrameType 引用
                     └─ 文件仍保留在用户原位置
```

原数据默认只读、原址引用。不可把 `/upload/image` 图像上传方案视为专业 FITS 数据的无损存储方案。

## 12.5 Browser 选择目录的实际限制

技术指南特别指出：浏览器 `webkitdirectory` / File API 通常提供 `File` 对象与相对路径，并**不保证能拿到操作系统可由 Python 直接使用的原始绝对目录**。因此“选择本地目录 → Python 原址扫描”的能力必须经由真正的用户授权流程和后端受控 API；不能在 UI 里直接将显示路径传给任意文件系统 API。

## 12.6 Workflow 和历史/队列行为

- 当前画布编辑 = 用户正在操作的活动 Graph，有可能是 Subgraph；
- Workflow 保存 = ComfyUI 自己负责，不复制第二份 `AstroPhotoWorkflowStore`；
- API Workflow 提交 = 调用 `/prompt` 执行已提交快照，并不是修改活跃画布；
- Agent 想修改在线 Canvas = 未来需要 Canvas Bridge、Session 目标、revision、真实前端回执，不能仅在 MCP 后端修改 JSON 就声称已改当前浏览器；
- 取消、重试、执行记录仍以宿主机制为第一责任方；本次不新建 Experiments/Task UI。

---

# 13. 实现范围、可验证能力、验收矩阵

## 13.1 本轮用户实际要求是什么？

**此刻要的是：一份完整的对话交接 Markdown**，不是让 Agent 直接编码或现在更新旧需求文档。下一轮用户更可能先继续快速迭代 UI。不要把本交接中的示例和计划自动视为“已获授权开发”。

将来用户明确转入实现时，可以以以下能力矩阵推进，但需要先真实核对工作树。

## 13.2 前端可独立完成的基线

| 能力 | 是否可在缺资产后端时完成 | 验收重点 |
|---|---|---|
| 一个 AstroPhoto Sidebar Tab 与 React Root | 可以（需宿主加载验证） | 注册唯一、重复挂载清理、关闭/打开稳定 |
| Nodes/Assets/Settings 三主视图 | 可以 | 默认 Assets、切换响应、无 Workflow 副作用 |
| 原生风格紧凑 Tab | 可以 | 视觉密度、选中态、hover/focus、键盘可用 |
| Search+Filter+Sort 共用 UI | 可以 | 搜索输入、菜单多选/单选、独立页面状态、中文 IME |
| 7 个 Settings 信息模块 | 可以 | 每条可点进、返回、状态真实、无假表单 |
| ComfyUI 全局主题 | 可以（真实 UI 验证） | Light/Dark/自定义、样式隔离、无 CSS 污染 |
| ComfyUI 全局语言 | 可以做接口，但真实通知仍待确认 | 中英文本完整、切换后同步、无独立选择 |
| Nodes 真数据列表 | 宿主 NodeDefs 可用时 | `vue-basic`/真实已注册 Node、空态/失败状态 |
| 节点点击添加与拖动 | 必须真实宿主和 Canvas Adapter | Graph 创建成功、Undo、Subgraph、保存重开 |
| Asset 真数据浏览与导入 | **不能**在后端缺失时冒充完成 | API 真数据、权限、读取失联状态 |
| Asset Source Node 创建 | **不能**在未注册 Node 类时启用 | Asset ID 与 Node Schema、Widget 序列化、Undo |
| Siril/PixInsight 软件能力 | **不能**在 Adapter 缺失时标成功 | 实际软件路径版本检测和执行验证 |

## 13.3 UI 功能验收清单

### Navigation

- [ ] 只注册一个 `AstroPhoto` 宿主 Sidebar Tab。
- [ ] 有三个同级 Tab：Nodes / Assets / Settings。
- [ ] 默认页面为 Assets，符合当前已讨论文档，除非用户后续改动。
- [ ] 顶栏 Settings 快捷操作指向同一页面。
- [ ] 所有 Tab 语义化支持键盘、aria-selected、focus-visible。
- [ ] 切换回另一个 Tab 时 query/filter/sort/滚动尽量保留。
- [ ] ModuleInfoPage、NodeDetails、AssetDetails 都能返回，不丢列表。
- [ ] 在窄 Sidebar、宽 Sidebar、浮动模式下没有横向滚动/控件重叠。

### Nodes Search + Filter + Sort

- [ ] SearchInput 的搜索图标、清空、Focus、Loading 与无障碍 Label 正常。
- [ ] 输入事件不会在中文 IME 组合中异常提交。
- [ ] Filter 是多选类别，支持 All 与清晰的选中反馈。
- [ ] Sort 是单选菜单，不与 Filter 混淆。
- [ ] 样式顺序 Search → Filter → Sort，`md` 约 32px 高；微调由 UI 迭代决定。
- [ ] 数据结果按指定筛选与排序更新，不是只有视觉菜单。
- [ ] Nodes 和 Assets 的 Filter/Sort 彼此不串状态。
- [ ] Nodes 可从真实 NodeDef 获取 ID/name/display/aliases；不会硬编码规划节点为可用。
- [ ] 无结果、加载中、权限错误、后端断开、Node 不存在有不同提示。

### Assets

- [ ] 没有后端时显示真实 unavailable/空态；M31 测试数据不会进入生产列表。
- [ ] 导入目录按钮在未授权/未实现时不触发假操作。
- [ ] Session Tree 显示真实 Session、FrameType、计数。
- [ ] 文件行点击进入详情，显示真实字段。
- [ ] Source Node 能力没准备好时 `+`/拖动不可假成功。
- [ ] 实现后 Asset ID 进入 Widget；保存/重开仍能解析或给出缺失提示。

### Settings

- [ ] 七项模块名称/说明/子页/返回可用。
- [ ] 状态从 `ModuleRegistry` + 真实 `capabilities` 合并，不仅由 UI 项存在判定 available。
- [ ] 不出现 `LanguageSelector`、`ThemeSelector`、私人 language override 等 UI。
- [ ] 不插入 Experiment/Trial 入口。
- [ ] System 状态 HTTP 失败不是“已连接”。

### i18n & Theme

- [ ] zh/en 翻译 Key 集合完整一致，长名称/tooltip/空态/错误覆盖。
- [ ] 默认宿主中文 → 中文、宿主英文 → English。
- [ ] 切换 ComfyUI Locale，Sidebar 中可见文本在规定时机同步。
- [ ] AstroPhoto 不单独保存语言设置、不写 `Comfy.Locale`。
- [ ] ComfyUI Light/Dark/自定义配色变动后，样式跟随。
- [ ] CSS 不污染 ComfyUI 全局 Button、Dialog、Tab、Menu 等组件。

### Lifecycle & Build

- [ ] `registerExtension` 与 `registerSidebarTab` 仅调用预期次数。
- [ ] React Root 重入/Unmount、Abort 和事件监听清理正确。
- [ ] 打包输出资源仅包含预期 Extension 入口；`/extensions` 没错误多入口。
- [ ] JS/CSS/i18n 路径兼容代理子路径，Network 无错误。
- [ ] TypeScript、Lint、Jest/RTL 或现有测试框架、Vite Build 真实执行通过。
- [ ] 真实 ComfyUI 启动无法完成时明确标记 HOST-UNVERIFIED，不以 Mock 冒充。

## 13.4 宿主真实验收顺序（进入开发任务后）

1. 验证当前 Git status/环境，先在允许的隔离宿主解决 Torch 依赖阻塞；未经授权不可在现有宿主 `uv sync` 或升级核心依赖。
2. 运行 ComfyUI 0.45.0 / Frontend 1.59.1；检查扩展入口、日志、`/extensions`。
3. 打开 AstroPhoto Tab，测试打开/关闭/反复切换和 `destroy()` 实际触发时机。
4. 主题、Locale 变化、语言资源、键盘交互、浮动/拖拽/窄宽容器。
5. 用真实 `/object_info` 和 `app.getNodeDefs()` 获取 Node，测试 NodeDetails。
6. 在真实 Canvas 中验证 `+` 添加、拖动坐标、Subgraph、Graph 更新、Undo/Redo。
7. 用 ComfyUI 原生保存和重新打开 Workflow 验证 Node 类型、Widget 参数与连接保留。
8. 只有真实资产 API / Asset Source Node 到位后，才验收 FITS/SER/Session 拖放与文件失联。
9. 完成包清单与安装检查；不得把本地 Build 成功当成 PyPI/Registry 发布完成。

## 13.5 开发命令的归属：不要混用

历史 Vue Monorepo 验证（2026-11-16 文档中运行过）：

```sh
uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q
uv run --project mcp pytest mcp/tests -q
pnpm -C frontend typecheck
pnpm -C frontend test
pnpm -C frontend build
```

官方 React Template 的预期工作方式（**需要确认 package.json 真正存在这些 scripts**）：

```sh
cd ui
npm ci
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build
```

`npm run watch` 是重复构建，不是全部宿主 React HMR 的自动保证。**不要同时维护 npm 与 pnpm 两套锁**；真实集成时再选当前仓库唯一管理器。

---

# 14. 技术风险与文档冲突清单

| ID | 级别 | 问题 / 冲突 | 正确处理 |
|---|---|---|---|
| H-01 | 阻塞 | 宿主 Torch 2.3.0 缺 `torch.library.custom_op` 导致 `comfy_kitchen` 导入失败 | 未获授权不得改宿主；可使用批准的隔离环境；真实加载未通过前不宣称兼容 |
| H-02 | 阻塞 | 真实 Canvas 拖放与 Undo/Redo 无宿主验收 | Adapter 内实测，不能照最新 API 写死 |
| H-03 | 高 | 老 v1.0 FRD / v1.1 Guide 包含 AstroPhoto 独立 `LanguageSelector` 和 `AstroPhoto.UI.Language` | 用户最新明确取消；下一次获准更新文档时删除所有相关状态、组件、测试 |
| H-04 | 高 | 早期原型三等分 / 白色下划线 Tabs 已不符合用户偏好 | 用 v1.59.1 紧凑圆角、左对齐方案重新画，不直接复制 Vue |
| H-05 | 中 | 旧技术指南只有 SearchField+Filter，未整合最终 v1.59.1 Search+Filter+Sort 研究 | 建议抽共享 SearchToolbar；Nodes/Assets 逻辑分开 |
| H-06 | 高 | `ui/` React 与旧 `frontend/` Vue 并存/迁移状态不明 | 先查真实 Git；绝不覆盖原有 `vue-basic` Widget |
| H-07 | 高 | Vite vendor chunk 可能被后端 `/extensions` 当作多入口脚本 | 检查固定版本服务端扫描与实际构建结果 |
| H-08 | 中 | ESM 导入与 CSS 路径受 `/extensions/...` 和代理前缀影响 | output.paths、import.meta.url、Network 实测 |
| H-09 | 中 | `Comfy.Locale` 读取存在，实时变化的公开订阅未明 | 按官方设置 API/目标版运行时设计可测试同步策略；不依赖内部 store 隐式稳定性 |
| H-10 | 高 | Asset API、资产数据库、Asset Source Node 尚未建立 | 只做可用 UI 壳/空态；不插假资源成功 |
| H-11 | 高 | 规划 `ASTRO_ASSET` 等专业类型缺真实运行时验证 | Node 注册、缓存、序列化、精度独立验收 |
| H-12 | 中 | Node ID 与业务 category 不一定同一前缀 | 用稳定归属表 + NodeDef 校验；现有 `vue-basic` category 为 examples |
| H-13 | 中 | 用户曾说“没有 Emoji”但没有最终定稿图标 | 下轮展示样式备选，不冻结为“有/无 Emoji” |
| H-14 | 中 | Settings 模块早期合并“设备+观测地”为 6 条 | **当前 FRD 七项**要求将设备与观测地拆成两模块（除非用户后续再改） |
| H-15 | 中 | Browser 目录选择并不自动给 Python 可用绝对路径 | 资产导入需要后端授权路径策略，不仅是 `<input webkitdirectory>` |
| H-16 | 中 | 旧 Vue Widget `upload/image` 未检查 HTTP resp.ok/name；Canvas 数据恢复需宿主验证 | 旧 08 风险 R5/R6；前端重构不得让其回归或误报已修 |
| H-17 | 中 | `.pre-commit` Ruff v0.4.9 与 uv/CI Ruff 0.17.5 冲突（原审计） | 任务涉及工具链时确认实际文件；本次前端 UI 不擅自修改 |
| H-18 | 中 | 原项目公开 PyPI 0.0.1 审计时 404 | 新 Agent 要重新核验时效；不在此聊天任务发布 |
| H-19 | 低 | 模板重复 vite/jest/eslint 文件、双包管理器风险 | 选择单份配置，保留可验证测试 |
| H-20 | 高 | UI 页面存在会被误判成 capability 可用 | 只能基于真实 API/Node 注册与软件能力输出状态；任何“已导入/已创建/已保存”必须有对应真实回执 |
| H-21 | 中 | 后端 FR-07 实验需求仍在历史文档，用户本次不要 Experiments UI | 保留长期历史背景，本次页面/目录/实现计划不加入实验；之后若要彻底取消再明确决策 |
| H-22 | 高 | 当前“确认过源码”并不等于真实 Windows 工作区已测试 | 明确官方 Tag 静态源码、历史审计、实际本地实测三种证据层次 |

## 14.1 两份旧 React 文档的待修订清单（待用户确认 UI 后再动）

### `AstroPhoto_React_Sidebar_Requirements_v1.0.md`

- 第 0 节第 8 条：把“用户允许手动覆盖语言”改为“严格跟随 ComfyUI，不提供私有语言偏好”。
- 信息架构 Settings “基础语言/主题说明”行：删除专用基础设置区域，保留七个业务模块。
- FR-S01：删除语言模式选择及主题读写控件要求。
- FR-I01：删除语言覆盖优先级和独立持久化；保留 zh/en 适配、宿主变更同步、英文回退。
- FR-I02：推荐内置语言资源，确认无需全局 `/locales` 路由。
- i18n tests：从 `manual override` 改为 `host locale sync`。
- Tab 样式：改为左对齐紧凑圆角背景选中态；确认图标最终方案后再冻结。
- Search/Sort/Filter：补上 V2 搜索栏与两颗操作按钮、语义、独立状态、验收条件。

### `AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md`

- 第 0.7 条和 `main.tsx` 示例：移除 `languageModeSetting`。
- 文件树：移除 `features/settings/LanguageSelector.tsx`；`host/settings.ts` 如仅承担私有语言选择也移除。
- §4.5 `AstroPhoto.UI.Language` 示例：删除/替换为只读 `Comfy.Locale` 同步方案。
- §4.6：删除 `LanguageMode/auto/zh/en` 参数，保留从宿主自动同步。
- §6.1/6.4 Settings：去掉独立语言设置，仍列出七项。
- §8.1：重写 i18n 测试与 Settings 测试，不再验证 UI 覆盖语言选项。
- 增加 `shared/search/SearchToolbar.tsx` / FilterDropdown / SortDropdown 与 `NodeLibrarySidebarTabV2` 源码对应表。
- 增加 UI 图标未决项，避免把上轮 Emoji/线性图标试验误写成最终需求。

**禁止现在自动改旧文档**：用户在最近的 UI 迭代环节说了“现在不需要更新 document”，本次另建交接档案不意味着那条限制已撤销。下一位 Agent 必须由用户明确指示何时回写。

---

# 15. 建议下一位 Agent 的具体行动方式

## 15.1 如果用户继续要求“画 UI”

立即用**可交互的聊天内组件**画一个版本，不要先生成文档/React 工程、不用 AI 图片取代可交互原型。默认保持：

- Header `AstroPhoto`；
- 左对齐紧凑圆角 Tab：Nodes / Assets / Settings；
- 主 Tab 可切换，默认 Assets（除非用户指定本轮重点页）；
- Nodes 页面显示 Source 中验证的 Search → Filter → Sort；
- Assets 页面同样 Search → Filter → Sort，但各有筛选/排序选项；
- Settings 显示七个专业模块与各自说明子页，不再展示语言/主题；
- 明暗主题随宿主的设计思路，不要强制暗色；
- 用户说“没有 Emoji”需重新考虑图标是否增加，但无需主动创建三套生产控制器；
- 示例数据必须注明 UI prototype，不冒充已实现 API；
- 一轮只改用户指出的视觉/交互问题，保留已被用户接受的其他部分。

如需确认用户的具体审美，只问**一个最关键问题**（例如是否保留 Emoji）；不要一次给十几个问题表单，用户希望快速迭代。

## 15.2 如果用户说“更新需求文档”

1. 先读本文件与旧 FRD v1.0、Technical v1.1 原文；
2. 应用 §14.1 列出的最新覆盖修订；
3. 维护“用户确认”和“待讨论”标记；
4. 既不改 backend/MCP/数据库，也不把 React 设计稿冒充实际工程完成；
5. 对改动输出完整 Diff/Changelog 和新的版本号，例如 FRD v1.1、Guide v1.2（仅示例，按用户实际指定）。

## 15.3 如果用户说“让 Coding Agent 开发”

- 先读取 `AGENTS.md`、这份交接、用户批准的最新版 FRD/Guide、`01_CURRENT_STATE.md`、`08_GAPS_AND_RISKS.md`、`11_RECONCILIATION.md`。
- 查看当前 branch/HEAD/status，保护用户未提交的工作树；不得 `reset/clean/checkout/push/publish`。
- 不要先做大的 Monorepo 重构；用户此前明确只要求 React Sidebar `ui/` 的设计。
- 以固定 ComfyUI 0.45.0/Frontend 1.59.1 的源码/类型验证接口，区分官方扩展接口与宿主私有低层实现。
- 优先做 React Sidebar Shell、完整 i18n/主题、SearchToolbar、七个设置模块，再逐步接真实 NodeDefs；Asset/Canvas 操作只有真实后端/Node 前置就绪才启用。
- 测试 TypeScript/Jest/RTL 或实际项目测试、构建、资源打包、无障碍和真实宿主；不能用 Mock 通过声称真实宿主通过。
- 任何需要修改宿主 Torch/ComfyUI 依赖的操作须获用户授权；审计时宿主本身有已知阻塞。

## 15.4 每次任务结束的最短输出协议

让 Agent 报告：

1. **本轮实际改了什么**（文件列表、主要 API/组件）；
2. **基于什么证据**（用户决策/固定版源码/当前实际工作树）；
3. **哪些测试真实执行了**（命令、PASS/FAIL/SKIP）；
4. **哪些任务只是设计/占位/阻塞**；
5. **下一步最小可执行动作**；
6. **未动的用户文件/宿主/发布状态**。


---

# 16. 官方文档及固定版本源码链接

> 来源核验规则：优先固定 Tag `v1.59.1` / `v0.45.0`，不要因官网页面持续更新而认为今天的 latest API 一定适用于用户现有宿主。下面的前端文件路径来自本次对话最后的 GitHub 源码查阅；URL 可直接给下一个 Agent 打开。若某个旧路径以后迁移，应以该 Tag 仓库 Tree 和文件内容为准，不猜测新路径。

## 16.1 官方开发指南

| 文档 | 地址 | 用途 |
|---|---|---|
| React Extension Template | https://github.com/Comfy-Org/ComfyUI-React-Extension-Template | React 脚手架；不能不改就覆盖既有 V3 工程 |
| Sidebar Tabs | https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs | `registerSidebarTab`、React `render` |
| JavaScript Extensions | https://docs.comfy.org/custom-nodes/js/javascript_overview | `WEB_DIRECTORY`、`.js` 装载、`registerExtension` |
| Settings API | https://docs.comfy.org/custom-nodes/js/javascript_settings | 宿主设置，当前只需读取 Locale/Theme 而不是新增私有选择 |
| JS Hooks | https://docs.comfy.org/custom-nodes/js/javascript_hooks | 观察宿主生命周期与扩展 Hook |
| Selection Toolbox | https://docs.comfy.org/custom-nodes/js/javascript_selection_toolbox | 未来节点上下文动作（非当前核心） |
| V3 Migration | https://docs.comfy.org/custom-nodes/v3_migration | `ComfyNode`、`io.Schema`、`comfy_entrypoint()` |
| HTTP/WS & Routes | https://docs.comfy.org/development/comfyui-server/comms_routes | `/object_info`、`/prompt`、aiohttp 扩展接口 |
| PrimeVue Removal | https://docs.comfy.org/custom-nodes/js/primevue-removal-migration | Frontend 去宿主 PrimeVue 的设计变量边界 |
| Frontend 版本源码 | https://github.com/Comfy-Org/ComfyUI_frontend/tree/v1.59.1 | 本次 UI 对标标准 |
| Backend 版本源码 | https://github.com/Comfy-Org/ComfyUI/tree/v0.45.0 | Python/HTTP/Node Loader 对标标准 |

## 16.2 精确节点库源码

**新版 Node Library 主体**

- `NodeLibrarySidebarTabV2.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/NodeLibrarySidebarTabV2.vue
- 旧版 `NodeLibrarySidebarTab.vue`（**不要**用于 V2 截图工具栏）  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/NodeLibrarySidebarTab.vue
- Node Library 版本开关 composable  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/composables/sidebarTabs/useNodeLibrarySidebarTab.ts

**搜索及顶部工具栏**

- `SidebarTopArea.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/SidebarTopArea.vue
- `SearchInput.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/ui/search-input/SearchInput.vue
- `searchInput.variants.ts`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/ui/search-input/searchInput.variants.ts
- `FilterDropdown.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/common/FilterDropdown.vue
- `Menu.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/ui/menu/Menu.vue
- `MenuRadioGroup.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/ui/menu/MenuRadioGroup.vue

**数据搜索、分组、状态**

- `nodeSearchService.ts`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/services/nodeSearchService.ts
- `nodeOrganizationService.ts`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/services/nodeOrganizationService.ts
- `AllNodesPanel.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/nodeLibrary/AllNodesPanel.vue
- `usePerTabState.ts`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/composables/usePerTabState.ts

**Tab 原生样式与另一类媒体资产参考**

- `Tab.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/tab/Tab.vue
- `TabList.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/tab/TabList.vue
- `tab.variants.ts`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/tab/tab.variants.ts
- `AssetsSidebarTab.vue`  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/AssetsSidebarTab.vue

**源码级测试参考**

- Node V2 行为测试  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/sidebar/tabs/NodeLibrarySidebarTabV2.test.ts
- FilterDropdown 测试  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/src/components/common/FilterDropdown.test.ts
- NodeLibrary 浏览器测试  
  https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/browser_tests/tests/sidebar/nodeLibraryV2.spec.ts

## 16.3 React Adapter、服务端与宿主类型

- Frontend `ComfyApp` 类型：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/types/comfy.ts
- Frontend `extensionTypes.ts`：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/types/extensionTypes.ts
- Frontend 内部 Node 创建函数（**仅参考内部实现**）：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/utils/createNode.ts
- Frontend Settings 定义（文件位置需要核对 Tag）：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/v1.59.1/src/platform/settings/constants/coreSettings.ts
- Backend API 路由/扩展 JS 加载（固定版）：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI/v0.45.0/server.py
- Backend V3 Node Loader（固定版）：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI/v0.45.0/nodes.py
- React Template 入口示例：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/src/main.tsx
- React Template i18n 示例：  
  https://raw.githubusercontent.com/Comfy-Org/ComfyUI-React-Extension-Template/main/ui/src/utils/i18n.ts

**外部来源使用备注**：本次新交接编制时已通过 `web.run` 重新打开官方 Sidebar Tabs、Settings、JavaScript Extensions、V3 Migration 以及 React Template README；针对 Node V2 的具体实现，则沿用了同一对话中刚完成的**指定 Tag 源码逐文件读取**，本轮没有重新在用户真实 ComfyUI 宿主运行代码。官网/第三方关于 UI 的一般设计建议是辅助参考，最终布局由用户决定。

---

# 17. 历史材料、UI 截图和完整出处索引

## 17.1 对话中的截图源文件（用户提供）

| 文件名 | 在对话中的含义 | 交接用途 |
|---|---|---|
| `image(20261117-041729).png` | 深色 ComfyUI 原生媒体资产截图（窄侧栏） | 观察原生 Header、媒体 Tab、搜索、空态 |
| `image(20261117-042528).png` | 宽一点的 ComfyUI 媒体资产截图 | 观察尺寸变化与布局，不意味着必须照搬布局 |
| `image(20261117-044420).png` | AstroPhoto 浅色素材页设计草图 | 用户期望的简约资源树、会话/文件、信息密度 |
| `image(20261117-073629).png` | AstroPhoto Settings 原型（当时含语言/主题行） | **历史版本**：后续明确删除独立语言/主题设置 |
| `image(20261117-074740).png` | ComfyUI 原生小圆角选中背景 Tabs（已生成/已导入） | 新 Tab 视觉参考 |
| `image(20261117-074801).png` | AstroPhoto 早期三 Tab 下划线选中态 | 用户不满意的对照版；不是最终风格 |
| `image(20261117-075258).png` | ComfyUI Node Library Search + Filter + Sort | 最新源码定位目标图 |

注意：聊天中助手直接展示的**可交互组件式 UI 原型**不一定存在单独可复用的 PNG/React 源文件；这些由对话组件运行时渲染，不能声称已生成可直接移植的生产组件。上述截图是用户在聊天中实际上传的参考图，不是软件源码测试结果。

## 17.2 两份最新 React 设计文档索引

- `AstroPhoto_React_Sidebar_Requirements_v1.0.md`：产品 FRD，527 行，约 36 KB；UI 目标、七模块、Nodes/Assets/Settings、i18n、状态、验收。**注意§14.1 已明确标记部分已过期内容**。
- `AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md`：技术 Guide，958 行，约 57 KB；目标文件树、API Matrix、Host Adapter 示例、Vite/React 生命周期、测试。**注意§14.1 中的覆盖决策**。

这两份文件在本次聊天内被重复上传过，交接包里只保留相同文件名的当前可访问副本。不要按用户上传次数误算成不同版本的已发布规范。

## 17.3 原项目文档怎样读

建议最短阅读顺序：

```text
本文件（最新聊天交接）
    ↓
01_CURRENT_STATE.md             # 2026-11-16 的实际实现快照
    ↓
03_ARCHITECTURE.md              # 当时真实文件树与 V3、Status、Widget
    ↓
08_GAPS_AND_RISKS.md            # 宿主阻塞、前端旧风险
    ↓
11_RECONCILIATION.md            # 历史冲突与证据等级
    ↓
React FRD v1.0 + Technical Guide v1.1
    ↓
用户当前工作树与锁文件（若进入编码任务）
```

长期业务域的完整细节请查看 `02_REQUIREMENTS.md`（FR-01～FR-08 与 33 个候选 Skills），不要只凭这份 UI 交接就把后端业务字段设计简化为最终 Schema。

## 17.4 用户最后几轮明确命令的原意

- “**style 指的是简约风格，而非布局要像他们一样**” → 只参考设计语言，不复制 ComfyUI 媒体资产布局。
- “**素材本身也能作为节点被拉出**” → 必须走固定 Asset Source Node 类实例 + `asset_id`，不是仅文件预览。
- “**实验不需要**” → 本次 Sidebar 不要实验页。
- “**workflow 直接存储到 ComfyUI 原本配置的工作流**” → 不建独立 Workflow 存储。
- “**只需要聚焦于 React Extension Template 这部分文件结构**” → 不扩写整个 Monorepo。
- “**至少要加上 Setting，点进去能披露其他模块**” → 七模块描述和进入/返回是 P0 的正式 UI 要求。
- “**主题和语言随着整个系统调整，这里就不单独添加模块了**” → 删除 AstroPhoto 独立语言/主题设置控件与覆盖模式。
- “**现在不需要更新 document，只需要你先把图画出来**” → UI 迭代优先，文档待确认后再更新。
- “**这个你用什么画的**” → 指可交互的聊天内组件，不是 Markdown ASCII、Figma 或图片生成。
- “**对我们现在的版本不满意，并且没有 Emoji**” → UI 字体/导航/视觉仍需迭代；Emoji 需求不能反推已定稿。
- “**定位这个节点模块的搜索框 + sort + filter 源代码**” → 最后一轮精确定位 v1.59.1 V2 官方组件。
- “**这个 chat attention 涣散，上下文混乱；不限制交接文档长度**” → 本文件的当前任务。

---

# 18. 附录：可直接复制给本地 Agent 的接手 Prompt

> 可以复制本节给新 Coding Agent、产品设计 Agent 或下个 ChatGPT 会话；若仅做 UI 原型，执行“模式 A”；若获得编码授权，再执行“模式 B”。

```text
你接手的是 ComfyUI_AstroPhoto / AstroPhoto React Sidebar 的持续设计工作。

请先完整阅读：
1) AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md（本次聊天完整交接，最新版决定最高优先）；
2) AstroPhoto_React_Sidebar_Requirements_v1.0.md；
3) AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md；
4) 如需工程背景再读 01_CURRENT_STATE.md、03_ARCHITECTURE.md、08_GAPS_AND_RISKS.md、11_RECONCILIATION.md。

基线版本：ComfyUI Backend 0.45.0 / Frontend 1.59.1。
请严格区分用户确认的设计、旧设计、官方固定版源码、规划功能和真实本地代码。

不可丢失的产品决策：
- ComfyUI 中只增加一个 AstroPhoto Sidebar 入口；
- 其中固定 Nodes / Assets / Settings 三个主视图；
- Nodes、Assets 支持查询、筛选、排序，未来可添加/拖拽到 Canvas；
- FITS/SER 等 Astro Assets 不是简单必须通过 LoadImage，素材拖放将绑定到固定 Asset Source Node 类实例；
- Nodes 依旧由 ComfyUI V3 原生 Registry 注册，AstroPhoto 只是专属发现器；
- Workflow 保存/载入/Undo/执行全部归 ComfyUI 原生；
- 不展示 Experiments/Trials 页面；
- Settings 展示 Software、Equipment、Observing Sites、Knowledge、Memory、Agent Context & MCP、System Status 七项说明/子页；
- 主题和中英 UI 语言完全跟随 ComfyUI 全局状态，不添加专属选择器；
- UI 最重要的风格是简约、专业，而非强行复制媒体资产布局；
- 最新导航样式参考 1.59.1 的紧凑、左对齐、圆角背景选中 Tab；
- 搜索工具栏以 1.59.1 NodeLibrarySidebarTabV2.vue 为标准：SearchInput + FilterDropdown + Sort(MenuRadioGroup)，右侧顺序 Filter → Sort；
- 图标与 Emoji 还未最终选定，需让用户快速对比；
- 当前优先在聊天中直接画可交互原型，用户确认后才更新旧 FRD/Guide/工程。

用户已经说过“现在不需要更新 document，只需要先把图画出来”。因此：

模式 A：UI 迭代（默认）
- 直接在聊天里渲染可切换的视觉原型，不要用大篇 ASCII 或 AI 图片替代；
- Nodes / Assets / Settings 可以切换，七模块可进入/返回；
- Nodes 与 Assets 顶部展示真实交互的 Search + Filter + Sort 示例；
- 去掉独立语言/主题设置，不增加实验页面；
- 保持样式低噪声，不把 demo 数据误当真实业务；
- 每次只改用户指出的具体 UI 维度，不自动重写文档；
- 如果要选择 Emoji/图标方案，可给小面积对比，但不要擅自冻结。

模式 B：工程实施（仅在用户明确要求编码时）
- 首先核对当前本地 Git、文件树与已有未提交改动，不 reset/clean/覆盖旧 Vue Widget；
- 固定版本源码优先：ComfyUI_frontend v1.59.1，ComfyUI backend v0.45.0；
- React Extension Template 仅做参考，不用其旧式 window.app、全局 /locales 或 V1 Python 映射替换已存在 V3；
- 先实现 Sidebar Shell / React Root 生命周期、Nodes/Assets/Settings 切换、七 Settings 信息页、宿主 i18n/theme、共享 SearchToolbar；
- Nodes 数据使用真实 getNodeDefs/object_info；没有实现的 Siril/FITS 节点不要造假；
- Canvas 创建/拖入一律隔离 host/canvas.ts 和 host/dragDrop.ts，LiteGraph 内部 API 要在真实宿主验证；
- Assets API 和 Asset Source Node 没有后端前置时只交付真实空态与接口设计，不假导入、不假成功；
- 不实现第二套 Workflow 管理；
- 测试实际 typecheck/lint/test/build、JS/CSS 包清单、无障碍、Host 生命周期和真正的 Canvas Undo/Redo/保存重开；
- 宿主已有 Torch/comfy_kitchen 启动阻塞，未经授权不得升级宿主依赖；
- 输出实际改动、验证记录、剩余风险，不声称 mock 通过等于真实宿主通过。

如果文档中仍出现 LanguageSelector.tsx、AstroPhoto.UI.Language、auto/zh/en 私有覆盖，
那是旧 v1.0/v1.1 的过期要求；应以本次聊天最后的“跟随 ComfyUI 系统”要求覆盖。

如果关于下一步没有其他明确要求，优先把【紧凑 Tabs + Search/Filter/Sort + Nodes/Assets/Settings】
重画成更符合用户审美的 ChatGPT 内交互式 UI 原型，并让用户逐项评审。
```

---

## 交接终点状态

- **本次完成**：历史项目上下文、React FRD/技术指南、用户 UI 迭代、官方 Node Library 固定版源码定位及全部决策的统一整理。
- **本次未做**：没有连接用户当前 Windows 工程实时审计；没有运行 ComfyUI；没有修改 React/Vue/Python/MCP 源码；没有发布；没有替用户重写前两份需求文档；没有生成已运行生产 React Sidebar。
- **后续最有价值的动作**：用户继续看图时，基于最新确定的紧凑 Tab 与官方 Search + Filter + Sort，直接在聊天中迭代一版 AstroPhoto 三视图 UI，并集中讨论图标/Emoji 与工具栏细节。

