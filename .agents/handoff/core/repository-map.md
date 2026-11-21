# 仓库地图与工程披露清单

本页供无法访问仓库的 Web Agent 定位工程证据。先按问题使用导航和披露清单，再读需要的子树。若必须比较具体实现，而相应正文未交付，请操作者补给指定的代码或测试片段。

## 按任务定位

| 要做的判断 | 先读的事实 | 树中入口与常见影响面 |
| --- | --- | --- |
| 增改节点、执行或 Widget | [跨端架构](architecture.md) · [后端](backend-overview.md) · [前端](frontend-overview.md) | 根入口、nodes、前端注册、locales、节点和真实宿主测试。检查已保存工作流及 API prompt。 |
| 修改资产、存储、设备和光路 | [后端](backend-overview.md) · [兼容决定](decisions.md) | astrophoto 中的 service、api、database 和 storage；再查前端 DTO、MCP 读工具、持久化和回滚测试。 |
| 变更 Siril 或科学预览 | [后端](backend-overview.md) · [前端](frontend-overview.md) · [实测证据](verification.md) | nodes/scientific.py、extension/siril、前端科学节点及 Inspector、宿主验收脚本。分别审候选、正式产物和权限。 |
| 变更宿主 UI 或前端构建 | [项目概览](product-overview.md) · [前端](frontend-overview.md) · [开发](development.md) | extension/frontend-entry.ts、frontend/src、vendor、锁文件和检查脚本。js 是交付构件，源码修改还应核对构建与发行清单。 |
| 修改 MCP 协议或发布包 | [MCP](mcp-overview.md) · [双包发行](release.md) | mcp 的 CLI、工具、客户端、fixtures 和打包元数据；设备契约还涉及 Extension 路由、部署和授权。 |
| 决定实施顺序或发版 | [当前能力](capabilities.md) · [初版工程边界](first-release.md) · [验证](verification.md) | tests、frontend 宿主脚本、scripts、.github/workflows、包清单和锁。区分目标、已实现、历史验收和当前阻塞。 |

路径以仓库根为基准，仅用于定位。包内说明由上表链接承载。以下清单注明已披露到哪一层，以及哪类问题仍需补哪种证据。新增记录优先进入已有职责页或对应 Module 的子章节。

## 决策所需的披露范围

| 主题 | 交接包已给出的事实 | 需要进一步披露的精确材料 |
| --- | --- | --- |
| 快照与变化归属 | 此页记录 HEAD、非忽略工作树范围及逐路径职责树。README 说明基线含暂存与未跟踪文件。 | 针对正在审查的变更给出相关文件的实际差异、使用中的构件版本及会影响结论的未提交内容。职责描述基于本次文件检查。实际兼容或运行结果仍需对应代码、配置和验证证据。 |
| 系统范围、依赖、所有权 | [架构](architecture.md) 和 [项目概览](product-overview.md) 说明宿主、浏览器、Extension、MCP 分工及四条跨端链。 | 对新链路补触发者、输入、同步/异步边界、权威写入点及输出的消费者；有多条入口时逐条说明。 |
| 源码入口与公共符号 | 树覆盖源码、测试、夹具、文档、工具、规则、构件及译文。Module 将项目内导入、状态、执行分支和测试直接写在各文件节点下，Vue 文件另有模板绑定。 | 需要判断重构或复用时补具体符号签名、唯一写入者、上下游引用、关键分支及最小相关源码；不用成批复制 import 或纯转发函数。 |
| 能力与降级 | [能力](capabilities.md) 区分已实现、局部及规划能力；Module 记录运行条件。 | 按具体部署展示状态接口的最小响应，列出依赖未就绪、路由未注册、未启用授权及软件不就绪时的真实 reason 与用户行为。 |
| 外部接口和调用协议 | Backend、Frontend、MCP Module 已有路由、DTO、工具参数和部分错误映射。 | 审查接口变更时补 method、路径、必填/可选/默认字段、枚举、成功/失败样例、分页规则、并发和幂等方式，以及调用方处理。 |
| 图、Widget 和兼容 | 记录绘图 Widget 保存/恢复和 prompt 上传的区别，以及科学节点端口和 V3 生命周期。 | 提供最小工作流与 API prompt、节点 ID、Widget 顺序/默认值和必要的兼容夹具。说明已有图重开、重连和可能的迁移步骤。 |
| UI、宿主适配与可访问性 | 前端 Module 记录挂载、销毁、导航、主题、语言、选中和预览交互。 | 涉及新宿主或 UI 重构时补真实屏幕路径、状态表、键盘行为、空态、错误、窄宽与独立构建验证。保留上游组件出处和本地差异的事实摘要。 |
| 配置与支持矩阵 | [开发](development.md) 说明依赖隔离、启用条件及复验命令。 | 需要部署决策时列出当前/目标 Backend、Frontend、Python、Node、pnpm、Siril 和平台组合。环境变量仅披露名称、默认值、格式和谁消费，样例不得带真实凭据。 |
| 持久状态、身份、迁移 | Backend Module 说明 assets.db 基线、数据根、工作区、缓存、引用、副本和产物。 | 迁移前给关键表关系、身份与版本字段、兼容入口、权威提交点、可恢复与不可恢复分支、保留原件/旧根的边界。 |
| 并发、失败、恢复 | Backend Module 记录 lease、操作 phase、幂等、取消、重试与文件/DB 检查点；前端记录作业替换及取消。 | 遇到写入或队列变更时补状态转换、触发错误码、竞态、回滚或重试条件、已经落盘或仍可删除的对象。 |
| 权限、隐私与许可 | [架构](architecture.md) 及 Module 说明回环、浏览器来源、设备只读令牌、原件和包边界。 | 新外部入口须明确调用者、允许和拒绝的操作、数据敏感性、第三方组件许可、CLI 软件来源与输出范围。 |
| 科学输入输出与可复现性 | Backend Module 区分 FITS 科学数据、候选 PNG 和正式产物；有 Siril 样本验证范围。 | 涉及算法或格式时给最小合法样本的通道/位深/HDU/WCS 特征、参数、输入输出校验、资源边界、保真断言和明确未覆盖的格式。 |
| 测试、夹具与实际证据 | Module 有主要测试用例和实际断言摘录，[验证](verification.md) 记录命令、结果、历史宿主与跳过。 | 需要确认某条分支时补完整相关夹具、测试环境/版本、最小重现和实测回执。标记哪些依赖被替换，哪些真实执行。 |
| 构建、制品和升级恢复 | [发行](release.md) 提供构建、版本约束、双包顺序及恢复。文件树列实际 CI 和资源路径。 | 需要上线判断时附对应构件清单、内容检查、已安装版本/哈希、CI 环境矩阵、全新安装与升级实测。缺远端证据时保留为未验证。 |
| 已知债务与替代方案 | [决定](decisions.md) 和 [初版工程边界](first-release.md) 留存兼容选择、必要缺口及工程依赖。 | 决策争议时补受影响用户动作、当前不变量、选择的依据、替代方案被放弃的原因和可重新验证的条件。历史流水只提取仍影响代码的事实。 |
| 已归档的前端迁移 | `.agents/features/archive/comfyui-frontend-stack-migration/00_FEATURE_INDEX.md` 定位 PRD v1.3、交互基线、技术设计、实际开发规格、冻结的测试与验证报告。公共 Vue 和 Siril Bundle 已接入，目标宿主是 0.46.0 / 1.59.6。 | [初版工程边界](first-release.md) 已归并 FR-01–09、实施顺序、Assets 占位及默认入口和 Bundle 发版边界。实际复用差异、两轮独立审查和迁移后验收见归档报告。 |
| 设计文档、规则、技能和原始材料 | 职责树逐项标注源码、草案、历史归档和资源的用途。源码以外的会议、历史日志及大素材不默认全文展开。 | 若其中某项约束左右工程决定，提取可独立解释的结论、上下文和适用范围。仅有路径或旧截图不能代替现行实现证据。 |

补充顺序优先考虑会改变决策的证据。当前首先值得补的是所审查接口的请求/响应与失败 DTO、关键写入的状态流和回滚、宿主与工具链真实验证，以及进行中的前端迁移相对现有行为的差异。对应内容可按问题在包内读取，必需原文缺失时再单独提供。

## 完整工作树与逐路径职责

**快照**　2026-11-21，HEAD `4c0cf4de91375f9eeb82997eee3aaa3bf99049b2`。树覆盖 **424 个文件、109 个目录**（仓库根不计入目录数）。范围是当前实际存在的 Git 跟踪文件和未忽略新增文件。忽略的依赖、缓存、用户资产及 Git 内部状态不列入。树中的构件和已 vendored 文件保留各自路径及职责。

每行 `路径 — 职责`。目录职责说明其在工程内的边界；文件职责以源码逻辑、配置、测试断言或文档正文为依据。生成构件和锁文件核对入口、构成或元数据。树中出现的草案、档案或第三方实现按身份标记。需要决定某项行为时，将相关分支和测试一起提供给 Web Agent。

每轮校验受影响的 Core 和 Module 节点，全面对账时核对整棵树。维护时以 `git ls-files -z --cached --others --exclude-standard` 核对当前路径，去重并过滤工作树中已不存在的文件。新增、移动、删除路径或改变职责时更新对应行，参考上方披露清单决定是否同步其 Module。

```text
ComfyUI-AstroPhoto/ — ComfyUI Extension 与独立 MCP 的共同工作树和发布版本源。
├── .agents/ — 代理工作资料根目录：技能、任务、Feature 与交接。
│   ├── archive/ — 已完成任务和历史对账记录归档。
│   │   ├── drawing-persistence.md — 已完成归档：画板工作流 PNG 像素恢复与中文提示修复，保留 IMAGE 路径问题。
│   │   ├── equipment-optical-train.md — 已完成归档：设备与光路跨 React、HTTP、SQLite 和 MCP 的交付记录。
│   │   ├── equipment-review-tests.md — 已完成归档：设备及光路删除、引用和版本冲突回归测试记录。
│   │   ├── fastmcp-42.md — 已完成归档：MCP 迁移 FastMCP 4.2、工厂与诊断契约验证。
│   │   ├── handoff-maintenance-skill.md — 任务归档：交接维护技能、只读校验和暂存区核对。
│   │   ├── handoff-module-filemaps.md — 已完成归档：三端文件地图、逐端覆盖和暂存区核对。
│   │   ├── handoff-reconciliation.md — 已完成归档：历史交接与仓库、测试证据的首次对账。
│   │   ├── handoff-repository-map.md — 已完成归档：交接仓库地图及披露清单的编制与覆盖核对。
│   │   ├── historical-feature-pipeline-refresh.md — 七项 Feature 当前源码回溯、验证与评审接续。
│   │   ├── latest-handoff-reconciliation.md — 已完成归档：侧栏历史交接材料与工作树的对账和风险矩阵。
│   │   ├── native-sidebar-tabs.md — 已完成归档：侧栏标签复用 ComfyUI 原生外观和交互。
│   │   ├── react-jest-siril-regression.md — 已完成归档：Jest CSS 映射及 Siril 状态回归修复。
│   │   ├── sidebar-host-settings.md — 已完成归档：侧栏语言和主题统一继承宿主设置。
│   │   ├── sidebar-node-preview.md — 已完成归档：节点原生悬停预览、拖拽与图标适配。
│   │   ├── sidebar-node-tree.md — 已完成归档：节点树层级、展开和拖放交互适配。
│   │   ├── sidebar-search-toolbar.md — 已完成归档：节点搜索、筛选与排序工具栏复用。
│   │   ├── storage-comfyui-frontend.md — 已完成归档：存储设置页面复用官方组件和迁移交互。
│   │   ├── test-layout.md — 已完成归档：节点、MCP、前端测试布局和独立运行命令。
│   │   └── unified-handoff.md — 已完成归档：精简统一 core/module 交接及旧材料迁移记录。
│   ├── features/ — Feature 生命周期文档。
│   │   ├── archive/ — 已关闭 Feature 的正式归档。
│   │   │   └── comfyui-frontend-stack-migration/ — P0 前端统一迁移档案、两轮独立审查和收尾。
│   │           ├── 00_FEATURE_INDEX.md — 阶段状态、有效决定、源代码基线与续做入口。
│   │           ├── 01_PRD.md — 已定稿 PRD v1.3，覆盖 React 退出、宿主及工作流兼容、资料库与处理 Bundle。
│   │           ├── 02_UI_UX.md — 各模块的交互保真基线、界面对照办法及 Assets 占位决定。
│   │           ├── 03_TECH.md — Vue 公共层、资料库与 Siril Bundle 的技术边界、宿主与构件兼容草案。
│   │           ├── 04_DEV.md — 七步迁移顺序、本地符号入口、失败约束和官方源码复用证据。
│   │           ├── 05_TEST_PLAN.md — 按实际入口冻结的 CASE-01–10 及验收环境。
│   │           ├── 06_TEST_REPORT.md — 本轮宿主、组件、FITS、归档及失败重试证据。
│   │           ├── Close.md — 需求验收、Pi 审查处置及后续独立验收边界。
│   │           ├── ARCHIVE_MANIFEST.json — 归档前后文件清单、字节及 SHA-256。
│   │           ├── evidence/ — 审查原文及两轮关键测试原始证据。
│   │           │   ├── README.md — 审查或测试证据。
│   │           │   ├── backend-final.txt — 审查或测试证据。
│   │           │   ├── backend-first-run.txt — 审查或测试证据。
│   │           │   ├── canvas-classic.json — 审查或测试证据。
│   │           │   ├── canvas-nodes-2.json — 审查或测试证据。
│   │           │   ├── equipment.txt — 审查或测试证据。
│   │           │   ├── f6-backend.txt — 审查或测试证据。
│   │           │   ├── f6-mingw64.txt — 审查或测试证据。
│   │           │   ├── f6-ordinary.txt — 审查或测试证据。
│   │           │   ├── f6-packaging.txt — 审查或测试证据。
│   │           │   ├── f6-runner-before.txt — 审查或测试证据。
│   │           │   ├── ph06-verification.txt — 审查或测试证据。
│   │           │   ├── pi-final-review.txt — 审查或测试证据。
│   │           │   ├── pi-review.txt — 审查或测试证据。
│   │           │   ├── registry-fits-verification.json — 审查或测试证据。
│   │           │   ├── registry-host.json — 审查或测试证据。
│   │           │   ├── registry-proxy.txt — 审查或测试证据。
│   │           │   ├── storage.txt — 审查或测试证据。
│   │           │   └── vitest.txt — 审查或测试证据。
│   │           └── references/ — references 对应的工程文件。
│   │               ├── 04C-implementation-prompt.md — 历史实施指令。
│   │               └── PI_CODE_REVIEW_HANDOFF.md — 前端迁移独立代码审查与补测交接。
│   │   ├── asset-import-library/ — 活动专题，维护素材导入、回执、重绑与原件保护，Assets 恢复和资产删除待评审。
│   │   │   ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │   │   ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │   │   ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │   │   ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │   │   ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │   │   ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │   │   ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │   │   └── Close.md — 初步完成度和遗留。
│   │   ├── comfyui-extension-drawing/ — ComfyUI 扩展底座与绘图节点的历史专题。
│   │   │   ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │   │   ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │   │   ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │   │   ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │   │   ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │   │   ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │   │   ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │   │   └── Close.md — 初步完成度和遗留。
│   │   ├── equipment-optical-trains/ — 设备与光路管理的历史专题。
│   │   │   ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │   │   ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │   │   ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │   │   ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │   │   ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │   │   ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │   │   ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │   │   └── Close.md — 初步完成度和遗留。
│   │   ├── INDEX.md — 七项 Feature 的当前源码回溯、验收边界、跨专题评审及闭环顺序，以及独立 P0 入口。
│   │   ├── local-storage-workspaces/ — 活动专题，维护 Data Root、默认工作区、离线重绑、迁移恢复与下游验收。
│   │   │   ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │   │   ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │   │   ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │   │   ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │   │   ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │   │   ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │   │   ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │   │   └── Close.md — 初步完成度和遗留。
│   │   ├── mcp-diagnostics-equipment-read/ — MCP 诊断、设备授权读、拒写、凭据轮换与独立安装的专题评审及验收规格。
│   │   │   ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │   │   ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │   │   ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │   │   ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │   │   ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │   │   ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │   │   ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │   │   └── Close.md — 初步完成度和遗留。
│   │   ├── sidebar-node-browser/ — 侧栏与节点浏览的历史专题。
│   │   │   ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │   │   ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │   │   ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │   │   ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │   │   ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │   │   ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │   │   ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │   │   └── Close.md — 初步完成度和遗留。
│   │   └── siril-fits-autostretch/ — 活动专题。记录候选、正式队列、科学保真与工作区恢复的需求和验收。
│   │       ├── 00_FEATURE_INDEX.md — 身份、阶段与接续入口。
│   │       ├── 01_PRD.md — 自足产品需求、现行证据、验收条件与开放决定。
│   │       ├── 02_UI_UX.md — 现行交互、历史差异或无 GUI 的适用性说明。
│   │       ├── 03_TECH.md — 数据流、依赖与失败边界。
│   │       ├── 04_DEV.md — 真实源码入口、调用顺序、守卫与落地差异。
│   │       ├── 05_TEST_PLAN.md — 需求追溯、夹具、观测断言及各层回归入口。
│   │       ├── 06_TEST_REPORT.md — 历史实测与待复验证据。
│   │       └── Close.md — 初步完成度和遗留。
│   ├── handoff/ — 供接手者使用的当前核心和模块交接。
│   │   ├── core/ — 跨模块全局、能力、证据和仓库地图。
│   │   │   ├── architecture.md — 现行交接：宿主、扩展、浏览器和 MCP 的生命周期与数据边界。
│   │   │   ├── backend-overview.md — 后端需求、启动、资产保护、科学处理与验收边界。
│   │   │   ├── capabilities.md — 现行交接：逐项列出现有能力、限制及尚未实现的范围。
│   │   │   ├── decisions.md — 现行交接：兼容性决策、历史方案差异和待验证边界。
│   │   │   ├── development.md — 现行交接：开发与宿主环境、复验命令及四类验证。
│   │   │   ├── first-release.md — 现行交接：初版发行链路、前置依赖和待关闭的验收缺口。
│   │   │   ├── frontend-overview.md — 前端需求、现行交互、Vue 迁移目标及目标宿主验收。
│   │   │   ├── mcp-overview.md — MCP 诊断、设备读取授权、协议流程与验收边界。
│   │   │   ├── product-overview.md — 现行交接：产品使用路径、代码入口和跨端责任。
│   │   │   ├── README.md — 现行交接入口：说明基线、各交接文档用途和按问题选取上下文。
│   │   │   ├── release.md — 现行交接：双包版本同步、构件边界和 CI 发布顺序。
│   │   │   ├── repository-map.md — 当前工作树目录及逐文件职责，配套决策所需的证据清单和路径导航。
│   │   │   └── verification.md — 现行交接：近期和历史验证证据、环境及未验证范围。
│   │   └── module/ — 按运行端拆分的具体实现交接。
│   │       ├── backend/ — 后端、节点与业务服务交接。
│   │       │   ├── implementation.md — 后端运行链、接口边界、数据归属、节点和行为测试的主要交接。
│   │       │   ├── source-index-runtime.md — 根 V3 入口、Core、数据库、存储及资产的文件职责、依赖、状态与分支。
│   │       │   ├── source-index-services.md — HTTP 路由、设备、Siril 和 V3 节点的文件职责、依赖、状态与分支。
│   │       │   └── source-index-tests-build.md — 后端、节点、集成和包装测试、发布脚本与配置的文件地图。
│   │       ├── frontend/ — 前端与宿主适配交接。
│   │       │   ├── implementation.md — 现有 Vue 画板与 React 侧栏、宿主适配、领域界面及行为测试。
│   │       │   ├── source-index-frontend-tests.md — Vue 和 React 自动化测试、用例支撑文件及断言。
│   │       │   ├── source-index-sidebar-domains.md — Sidebar 中资产、节点、预览、设置、设备与科学处理界面的文件地图。
│   │       │   ├── source-index-sidebar.md — Sidebar 入口、API、宿主适配、翻译、主题和共享控件的文件地图。
│   │       │   └── source-index-widget-tests.md — Vue Widget、复用组件、构建、构件、译文和宿主验证工具的文件地图。
│   │       └── mcp/ — 独立 MCP 服务交接。
│   │           └── implementation.md — MCP 启动、工具契约、权限、版本兼容、测试及展开到启动、客户端、工具和测试文件的地图。
│   ├── notes/ — 任务进展、验证和待续交接笔记。
│   │   ├── asset-import-library-review.md — 素材导入文档评审、待定页面范围及删除接口缺口。
│   │   ├── architecture-migration.md — 任务交接：架构迁移、双包和前端构建的进展及验证。
│   │   ├── backend-standardization.md — 任务交接：V3 后端标准化、原生状态 API 和环境隔离。
│   │   ├── comfyui-frontend-stack-migration.md — comfyui-frontend-stack-migration.md 的工程入口或配套实现。
│   │   ├── equipment-delete.md — 已完成任务记录：设备与光路删除权限、引用及版本验证。
│   │   ├── equipment-detail-accordion.md — 任务交接：设备和光路详情折叠、历史快照只读视图。
│   │   ├── equipment-single-select.md — 已完成任务记录：设备编辑选项复用官方单选组件。
│   │   ├── equipment-tab-navigation.md — 已完成任务记录：设备和光路标签切换与列表状态保留。
│   │   ├── local-storage.md — 任务交接：本地存储、工作区、导入迁移和验收边界。
│   │   ├── mcp-diagnostics-equipment-read.md — MCP 文档评审、轮换验收与独立安装接续。
│   │   ├── node-bookmarks.md — 任务交接：节点分类扁平化与宿主书签设置同步。
│   │   ├── react-sidebar.md — 任务交接：React 侧栏实现、宿主适配与真实环境验证。
│   │   ├── s8-handoff-2026-11-18-2.md — 标记 active 的历史任务记录：2026-11-18 交接材料整理及基线。
│   │   └── siril-autostretch.md — 任务交接：FITS Source、IMAGE_PATH、Siril AutoStretch 与预览处理。
│   └── skills/ — 项目开发技能及其参考材料。
│       ├── astrophoto-frontend-reuse/ — 官方前端组件复用技能及模板。
│       │   ├── SKILL.md — 现行开发技能：查找并适配收录的 ComfyUI 官方前端组件。
│       │   └── template/ — 可适配的官方 Vue 组件与许可证。
│       │       ├── LICENSE — 官方组件模板附带的 GPL-3.0 许可证正文。
│       │       ├── MediaAssetSettingsButton.vue — 官方 Vue 模板：媒体资产视图设置弹出按钮。
│       │       ├── MediaAssetSettingsMenu.vue — 官方 Vue 模板：媒体资产列表、网格和显示设置菜单。
│       │       ├── SearchInput.vue — 官方 Vue 模板：支持状态与插槽的搜索输入框。
│       │       ├── SingleSelect.vue — 官方 Vue 模板：普通与可搜索的单选控件。
│       │       ├── TreeExplorerV2.vue — 官方 Vue 模板：支持展开与上下文菜单的树容器。
│       │       └── TreeExplorerV2Node.vue — 官方 Vue 模板：树节点、目录及拖拽交互渲染。
│       ├── astrophoto-reuse-reference/ — 前后端官方源码复用流程。
│       │   └── SKILL.md — 现行开发技能：逐项查证、复用 ComfyUI 官方前后端实现。
│       ├── comfyui-node-advanced/ — ComfyUI 节点高级模式技能。
│       │   └── SKILL.md — 节点开发参考：动态输入、类型匹配、循环和节点展开。
│       ├── comfyui-node-basics/ — ComfyUI 节点基础技能。
│       │   └── SKILL.md — 节点开发参考：V3 Schema、执行方法与扩展注册基础。
│       ├── comfyui-node-datatypes/ — ComfyUI 节点数据类型技能。
│       │   └── SKILL.md — 节点开发参考：图像、模型、音视频及自定义数据类型。
│       ├── comfyui-node-frontend/ — ComfyUI 前端扩展技能与 API 参考。
│       │   ├── api-reference.md — 前端脚本 API 参考：app、api、widgets 等模块和稳定性。
│       │   └── SKILL.md — 节点开发参考：前端扩展钩子、控件、侧栏与设置。
│       ├── comfyui-node-inputs/ — ComfyUI 节点输入技能。
│       │   └── SKILL.md — 节点开发参考：基础、可选、隐藏及延迟输入配置。
│       ├── comfyui-node-lifecycle/ — ComfyUI 节点执行生命周期技能。
│       │   └── SKILL.md — 节点开发参考：执行顺序、缓存指纹、验证和延迟求值。
│       ├── comfyui-node-migration/ — ComfyUI 节点V1 到 V3 迁移技能。
│       │   └── SKILL.md — 节点开发参考：V1 节点迁移 V3 的方法和字段对应。
│       ├── comfyui-node-outputs/ — ComfyUI 节点输出技能。
│       │   └── SKILL.md — 节点开发参考：NodeOutput、预览及保存结果。
│       ├── comfyui-node-packaging/ — ComfyUI 节点打包技能。
│       │   └── SKILL.md — 节点开发参考：项目结构、注册、依赖和发布打包。
│       ├── feature-pipeline/ — Feature 生命周期 v2.0 工作流与分阶段提示。
│       │   ├── reference/ — PH-00 至 PH-08 及各跨阶段动作的长版 Prompt 参考。
│       │   │   ├── 00-initialize.md — Prompt 00：核对 Feature 身份、范围、基线与续做阶段，按需建立索引。
│       │   │   ├── 02-ux.md — Prompt 02：制作可评审原型并将界面契约定稿为 UI/UX 文档。
│       │   │   ├── 03-technical-design.md — Prompt 03：核实架构后写模块、数据流、接口和错误设计。
│       │   │   ├── 04A-source-disclosure.md — Prompt 04A：只读披露真实路径、符号、调用链、守卫与复用依据。
│       │   │   ├── 04B-development-spec.md — Prompt 04B：把设计细化为逐文件、逐函数的开发规格和拒绝规则。
│       │   │   ├── 04C-implementation.md — Prompt 04C：在授权内实现业务代码并同步已落地行为和偏差。
│       │   │   ├── 05-test-plan.md — Prompt 05：先记预计场景，实现后按真实代码定稿测试规格。
│       │   │   ├── 06-test-execution.md — Prompt 06：编写并执行测试，记录失败、修复、复测和证据。
│       │   │   ├── 07-close.md — Prompt 07：对照需求、代码和证据判定完成度并留下未决事项。
│       │   │   ├── 08-archive.md — Prompt 08：归档已关闭 Feature，核验移动、历史和引用并回流知识。
│       │   │   ├── 09-change-propagation.md — Prompt 09：融合最新决定或实现偏差并只更新受影响文件。
│       │   │   ├── 10-resume-reopen.md — Prompt 10：从归档或既有产物恢复基线、证据和唯一活动目录。
│       │   │   └── PRD.md — Prompt 01：通过多轮讨论发现、收敛、验收并定稿 Feature PRD。
│       │   └── SKILL.md — 现行开发技能：按 v2.0 阶段路由初始化、推进、归档或重开单个 Feature。
│       ├── handoff-maintenance/ — 单版本 Core 仓库树与 Module 文件树的维护和校验。
│       │   ├── references/ — 文件职责、内部流程和测试证据的写法。
│       │   │   └── file-map-format.md — 对照展示 Core 与 Module 的存储运行时节点，以及前端请求取消和清理。
│       │   ├── scripts/ — 按变更路径或全量检查交接结构的工具。
│       │   │   └── check_handoff.py — 只读核对 Git 工作树、两层文件覆盖、篇数和包内链接。
│       │   └── SKILL.md — 每轮任务收尾判定、原位更新和报告两层交接结果。
│       └── task-notes/ — 跨会话代码任务的状态、证据与归档工作流。
│           └── SKILL.md — 现行开发技能：任务笔记创建、状态、交接与归档规则。
├── .comfyignore — Registry 打包排除清单，去掉 MCP 源码、开发环境、测试、文档和运行数据，保留 js 与 locales。
├── .editorconfig — 设置一般文本用 UTF-8、LF、四空格并清尾部空白，另为 bat、Makefile、LICENSE 保留例外。
├── .gitattributes — 标记 js 构件为 generated 并跳过其空白检查，对归档、笔记、现行 Handoff 和正式 Feature 归档禁用换行转换。
├── .github/ — GitHub Actions 与仓库托管侧配置，覆盖持续验证和双包发布。
│   └── workflows/ — CI 与发版编排，发布复用 CI 测试过的构件。
│       ├── ci.yml — Python 3.11/3.12、Node 22 矩阵与冻结依赖，运行两类前端测试、代理检查、Python/MCP 测试、构件边界和隔离安装；上传 3.12 构件。
│       └── release.yml — 在 v* tag 复用 CI，先以 Trusted Publishing 发布 MCP，再确认公开 PyPI 安装与握手，最后发布暂存 Registry 包。
├── .gitignore — 屏蔽 Python/Node 环境和缓存、本地环境变量文件、IDE 与 Playwright 结果，界定未跟踪文件的收录范围。
├── .pre-commit-config.yaml — 固定 Ruff pre-commit v0.4.9 的 lint 自动修复及格式化 hook，与 CI 从 uv lock 安装的 Ruff 版本分开。
├── .python-version — 指定开发默认 Python 3.12；发行下限另由两个 pyproject 定义。
├── __init__.py — ComfyUI V3 扩展入口与 WEB_DIRECTORY，装配或复用 runtime、注册 PromptServer 路由并绑定四个节点。
├── AGENTS.md — 仓库级开发规则，定义 ComfyUI/Extension/MCP 所有权、V3 和本地数据约束、双包发行、Feature 生命周期及交接维护。
├── astrophoto/ — 扩展后端：API、存储、资产、设备、数据库与 Siril 服务。
│   ├── __init__.py — 后端包入口，导入时不初始化存储。
│   ├── api/ — 将后端服务暴露为 ComfyUI 原生 HTTP 路由。
│   │   ├── __init__.py — ComfyUI 原生 aiohttp 路由适配包。
│   │   ├── assets.py — 提供资产游标列表、导入预检与幂等提交、操作取消/重试、引用重定位、会话关联和可用性查询；不读取图像预览。
│   │   ├── equipment.py — 设备及光路的增删查改、当前配置更新和旧历史修订的只读 HTTP 接口。
│   │   ├── errors.py — 将存储错误转换为统一 HTTP 状态与错误响应。
│   │   ├── routes.py — 在 ComfyUI 路由表注册状态及业务接口并检查路由冲突。
│   │   ├── scientific.py — 独立通用 FITS 枚举与预览设置，沿用现有 URL 和权限。
│   │   ├── security.py — 检查直接回环部署、本地请求、存储操作授权及设备只读令牌。
│   │   ├── status.py — 生成扩展状态和能力信息并提供 HTTP 响应。
│   │   └── storage.py — 存储状态、设置、工作区、缓存和迁移操作的 HTTP 参数转换及线程外执行。
│   ├── assets/ — 资产导入、引用、路径与会话管理。
│   │   ├── fits.py — 公共路径解析、FITS HDU/WCS、精度和元数据校验。
│   │   ├── imports.py — 扫描和校验导入来源，按引用或副本导入文件，记录逐文件检查点并支持恢复。
│   │   └── service.py — 资产查询、路径解析、引用重定位和拍摄会话关联。
│   ├── bootstrap.py — 由宿主生命周期显式组装运行时和初始化存储。
│   ├── bundles.py — 后端处理 Bundle 的结构接口。
│   ├── core/ — 扩展配置、能力、错误及数据路径基础设施。
│   │   ├── __init__.py — 共享配置与运行状态基础包。
│   │   ├── capabilities.py — 根据实际注册及存储状态报告扩展能力。
│   │   ├── config.py — 加载扩展和存储设置、校验选项并原子写入 JSON。
│   │   ├── errors.py — 定义配置和存储领域错误类型。
│   │   └── paths.py — 按需解析数据目录且不在导入时创建目录。
│   ├── database/ — SQLite 模型、数据库管理与迁移。
│   │   ├── equipment_models.py — 定义设备、类型规格、光学链草稿及不可变历史修订的数据库模型。
│   │   ├── manager.py — 管理 SQLite 连接、模式和身份检查、事务、健康检查与备份。
│   │   ├── migrations/ — Alembic 数据库迁移运行配置。
│   │   │   ├── env.py — 配置并运行在线 Alembic 数据库迁移。
│   │   │   └── versions/ — 数据库模式迁移版本。
│   │   │       └── 0001_equipment_baseline.py — 冻结存储、资产、设备和光学链的初始数据库迁移。
│   │   └── models.py — 定义存储身份、工作区、资产、会话、位置及操作记录模型。
│   ├── equipment/ — 设备和光学链校验、服务与快照。
│   │   ├── schemas.py — 校验设备规格、光学链草稿、分页及查询 JSON 输入。
│   │   ├── service.py — 事务性管理设备及类型规格，实施版本检查和引用保护。
│   │   ├── snapshots.py — 校验光学链组件和快照，并读取历史快照。
│   │   └── trains.py — 管理可编辑光学链配置与只读历史修订，提供版本检查和删除。
│   └── storage/ — 数据根、工作区、缓存、文件操作和迁移。
│       ├── cache.py — 管理单个带身份校验的缓存、容量预算、临时处理空间和受控清理。
│       ├── initializer.py — 以锁和身份标记可重入地初始化数据根目录及设置。
│       ├── locations.py — 注册和校验工作区，管理身份、租约、默认位置、重定位与删除。
│       ├── manager.py — 校验源文件并分阶段复制、校验、发布或解析受管理文件。
│       ├── migration.py — 复制并验证整个工作区，通过数据库根路径切换完成可恢复迁移。
│       ├── operations.py — 持久化后台操作、执行租约、检查点、取消重试与恢复。
│       ├── paths.py — 校验本地路径、卷和根目录重叠，安全拼接工作区路径。
│       └── runtime.py — 组装并初始化存储服务，更新设置并汇总实时状态。
├── docs/ — 项目架构、开发、功能及发布文档。
│   ├── architecture.md — 工程架构：已实现模块、V3 数据流、持久化和计划领域边界。
│   ├── development.md — 开发指南：隔离环境、安装、构建与各层验证命令。
│   ├── equipment.md — 设备和光路：操作规则、SQLite、HTTP 权限与验收记录。
│   ├── local-storage.md — 本地存储交付记录：工作区、迁移、资产导入、安全及验收。
│   ├── mcp.md — MCP 指南：独立服务、状态和设备只读工具契约与授权。
│   ├── publishing.md — 发布指南：锁步版本、双包构件、CI 次序及发行阻塞。
│   ├── react-sidebar.md — React 侧栏实施映射、宿主适配证据与已知 IMAGE 路径问题。
│   ├── requirements.md — 产品需求与架构基线：业务域、当前能力、目标和非目标。
│   └── siril.md — Siril 集成：软件配置、FITS 与 AutoStretch 流程和验证证据。
├── extension/ — 产品组装与可独立的软件 Bundle。
│   ├── __init__.py — 包边界，保持导入与运行时装配分开。
│   ├── frontend-entry.ts — 显式把公共 Vue 层与发行中 Siril Bundle 组装。
│   └── siril/ — Siril 专有业务、节点、路由与前端贡献。
│       ├── __init__.py — 包边界，保持导入与运行时装配分开。
│       ├── _dependencies.py — _dependencies.py 的工程入口或配套实现。
│       ├── bundle.py — 初始化软件与预览服务、恢复 Siril 结果并贡献路由与 V3 节点。
│       ├── frontend/ — Siril 软件卡片、设置、节点交互和双语。
│       │   ├── api.ts — 访问 Siril 软件状态、预览作业和 PNG。
│       │   ├── AutoStretch.tsx — 在宿主 Widget 挂载 AutoStretch 预览和参数。
│       │   ├── index.ts — 注册 Siril 摘要、设置、词条和宿主节点。
│       │   ├── locales/ — 翻译资源。
│       │   │   ├── en/ — 英文词条。
│       │   │   │   └── siril.json — siril 的结构化资源与翻译。
│       │   │   └── zh/ — 中文词条。
│       │   │       └── siril.json — siril 的结构化资源与翻译。
│       │   ├── siril.css — siril 的样式、作用域与主题变量。
│       │   └── SirilSettings.tsx — Siril 配置摘要、启用和发现/验证/清除。
│       ├── node.py — 保持 AstroPhotoSirilAutoStretch V3 节点 ID 和正式队列处理。
│       ├── previews.py — 候选作业与只读正式显示、取消、PNG 缓存和几何对齐校验。
│       ├── processing.py — 调度受控 Siril CLI、写入正式 FITS 和运行回执、恢复未登记产物。
│       ├── routes.py — 软件配置、Siril 候选及本机安全检查。
│       └── software.py — 发现、探测与验证 Siril CLI，并隔离 Windows 子进程的 MSYS2 环境变量。
├── frontend/ — AstroPhoto 独立 Vue 工程、构建、测试和宿主验证。
│   ├── eslint.config.mjs — 配置 React 侧栏 TypeScript 与 Hooks 规则，排除旧 Vue 源码和测试。
│   ├── package.json — 声明 Vue、React、宿主类型和前端依赖，以及构建、类型检查、单测和宿主验证命令。
│   ├── pnpm-lock.yaml — 锁定前端依赖、传递依赖及 peer 解析版本。
│   ├── pnpm-workspace.yaml — 允许 esbuild 构建并指定宿主类型包使用已验证的 Vue 版本。
│   ├── scripts/ — 独立构件和代理网络断言。
│   │   ├── check-build.mjs — 断言构件单一、依赖退出和相对路径。
│   │   └── check-proxy.mjs — Chromium 验证代理路径下解析外部模块和 CSS。
│   ├── src/ — 公共 Vue 前端，不依赖任何特定软件 Bundle。
│   │   ├── api/ — 宿主 HTTP 客户端、响应校验和领域调用。
│   │   │   ├── client.ts — 解析宿主 HTTP、超时、取消、校验错误和请求 ID。
│   │   │   ├── equipment.ts — 按 DTO 验证设备、关联和光路，发起受控读写。
│   │   │   ├── fits.ts — 通过稳定 FITS 资产 ID 分页拉取候选来源。
│   │   │   ├── nodes.ts — 从 /object_info 构造 AstroPhoto 节点卡片。
│   │   │   ├── previewSettings.ts — 保存共享预览配置，拒绝过期响应。
│   │   │   ├── status.ts — 校验扩展、运行时和能力状态。
│   │   │   └── storage.ts — 工作区、存储设置、缓存和操作回执 HTTP 接线。
│   │   ├── bundles/ — bundles 对应的工程文件。
│   │   │   └── types.ts — FrontendBundle 的公共接口。
│   │   ├── features/ — 按产品场景封装页面和组件。
│   │   │   ├── assets/ — assets 对应的工程文件。
│   │   │   │   └── AssetsPlaceholder.tsx — AssetsPlaceholder.tsx 的工程入口或配套实现。
│   │   │   ├── drawing/ — Canvas 绘图、工具栏和工作流像素。
│   │   │   │   ├── DrawingApp.vue — 连接画板和工具栏，转发画笔与画布状态。
│   │   │   │   ├── DrawingBoard.vue — 运行实际 Canvas 绘图并管理异步像素恢复。
│   │   │   │   ├── ToolBar.vue — 原生画笔、清屏、颜色和范围控件。
│   │   │   │   └── VueExampleComponent.vue — 画板的宿主 Widget 存储与队列序列化边界。
│   │   │   ├── library/ — 设备与光路的业务页面，共享组件可接入其它资料库。
│   │   │   │   ├── components/ — 领域共用展示组件。
│   │   │   │   │   ├── DetailAccordion.tsx — 资料详情折叠及可访问状态。
│   │   │   │   │   ├── DetailActions.tsx — DetailActions.tsx 的工程入口或配套实现。
│   │   │   │   │   ├── equipment.css — equipment 的样式、作用域与主题变量。
│   │   │   │   │   ├── equipmentFields.tsx — equipmentFields.tsx 的工程入口或配套实现。
│   │   │   │   │   ├── RecordRows.tsx — 接收通用行展示数据与渲染回调的资料列表。
│   │   │   │   │   ├── ResourceContent.tsx — 通用资源加载、空态与错误/重试呈现。
│   │   │   │   │   └── useMutation.ts — useMutation.ts 的工程入口或配套实现。
│   │   │   │   └── pages/ — 领域页面和表单流程。
│   │   │   │       ├── EquipmentDetails.tsx — 设备查看、归档和受限删除。
│   │   │   │       ├── EquipmentForm.tsx — 设备字段编辑与提交、各规格组的详情展示。
│   │   │   │       ├── EquipmentList.tsx — 设备与光路共享列表中的领域查询和分页。
│   │   │   │       ├── EquipmentPage.tsx — 设备与光路现行入口、导航、草稿恢复和版本重读。
│   │   │   │       ├── OpticalTrainDetails.tsx — 光路状态、关联设备和可读配置。
│   │   │   │       └── OpticalTrainEditor.tsx — 光路草稿编辑、组件排序、版本条件和快速回填。
│   │   │   ├── nodes/ — 目录搜索、收藏、画布交互和通用图像预览。
│   │   │   │   ├── NodeHoverPreview.tsx — Teleported 悬停预览和侧栏相对定位。
│   │   │   │   ├── NodesPage.tsx — 搜索、分类、排序、收藏与节点交互状态。
│   │   │   │   ├── NodeTree.tsx — 按类别递归构造目录并绘制节点行。
│   │   │   │   └── preview/ — 候选及正式结果通用显示控件。
│   │   │   │       ├── inspector.css — inspector 的样式、作用域与主题变量。
│   │   │   │       ├── Inspector.tsx — 通用 Inspector，负责缩放、并排、单图与滑动比较。
│   │   │   │       ├── nodePreview.css — nodePreview 的样式、作用域与主题变量。
│   │   │   │       ├── NodePreview.tsx — 挂接通用预览工具栏、状态和图像资源。
│   │   │   │       └── PanelDivider.tsx — 支持鼠标和键盘的视图区分隔件。
│   │   │   ├── sidebar/ — 侧栏导航、系统和 Bundle 软件设置。
│   │   │   │   ├── moduleRegistry.ts — moduleRegistry.ts 的工程入口或配套实现。
│   │   │   │   ├── SettingsPage.tsx — 显示设置入口与能力，挂载环境、存储和资料库。
│   │   │   │   ├── Sidebar.tsx — 单侧栏三标签与请求范围。
│   │   │   │   ├── software.css — software 的样式、作用域与主题变量。
│   │   │   │   └── SoftwarePage.tsx — 共享软件导航与 Bundle 贡献渲染。
│   │   │   └── storage/ — 工作区、缓存、后台操作回执和预览环境。
│   │   │       ├── CacheSettings.vue — 保存缓存路径/限额和清理。
│   │   │       ├── environment.css — environment 的样式、作用域与主题变量。
│   │   │       ├── EnvironmentPage.vue — 公共预览分辨率与布局只读信息。
│   │   │       ├── format.ts — format.ts 的工程入口或配套实现。
│   │   │       ├── OperationProgress.vue — 可中止的回执轮询和终态刷新。
│   │   │       ├── storage.css — storage 的样式、作用域与主题变量。
│   │   │       ├── StorageError.vue — StorageError.vue 的工程入口或配套实现。
│   │   │       ├── StoragePage.vue — 绑定原工作区、缓存和迁移入口，组合共享操作反馈。
│   │   │       ├── useStorageAction.ts — useStorageAction.ts 的工程入口或配套实现。
│   │   │       └── WorkspaceActions.vue — 工作区重命名、变更位置、迁移、删除确认及默认位置操作。
│   │   ├── host/ — 宿主公开 API、画布和挂载生命周期适配。
│   │   │   ├── canvas.ts — 在活动画布或子图上增加节点。
│   │   │   ├── comfy.ts — comfy.ts 的工程入口或配套实现。
│   │   │   ├── dragDrop.ts — 校验扩展 MIME 负载并在目标画布插入。
│   │   │   ├── drawing.ts — 注册稳定的 vue-basic 节点 Widget、挂载和释放画板。
│   │   │   ├── domWidgetMounts.ts — 通过 afterConfigureGraph 恢复 Nodes 2.0 中旧 DOM Widget 容器的扩展元素。
│   │   │   ├── fitsSource.tsx — 独立注册 ASTRO_FITS_ASSET 和通用来源选择。
│   │   │   ├── locale.ts — 按需要跟随 Comfy.Locale 并解除轮询。
│   │   │   ├── mountWidget.ts — 为 DOM Widget 统一 Vue、语言和释放。
│   │   │   └── sidebar.ts — 用原生侧栏 API 挂载和释放 Vue 根。
│   │   ├── host.d.ts — 声明宿主提供的 comfy:app 与 comfy:api 模块类型。
│   │   ├── i18n/ — Vue I18n 工厂、宿主语言归一化和公共词条。
│   │   │   ├── index.ts — index.ts 的工程入口或配套实现。
│   │   │   └── locales/ — 翻译资源。
│   │   │       ├── en/ — 英文词条。
│   │   │       │   └── sidebar.json — sidebar 的结构化资源与翻译。
│   │   │       └── zh/ — 中文词条。
│   │   │           └── sidebar.json — sidebar 的结构化资源与翻译。
│   │   ├── main.ts — 通过 initializeFrontend 一次接入公共界面与选定 Bundle。
│   │   ├── shared/ — 跨功能通用 Vue 控件和 composable。
│   │   │   ├── ComfyMultiSelect.tsx — 直接渲染已有 Reka 多选，映射本地 ID 与选项。
│   │   │   ├── ComfySingleSelect.tsx — 直接渲染已有 Reka 单选并编码空值与禁用项。
│   │   │   ├── DisclosureChevron.tsx — DisclosureChevron.tsx 的工程入口或配套实现。
│   │   │   ├── Feedback.tsx — Feedback.tsx 的工程入口或配套实现。
│   │   │   ├── SearchField.tsx — 基于官方 SearchInput 模式的 Reka 搜索和清空。
│   │   │   ├── SearchOptions.tsx — 筛选与排序控件共享的可访问选择面板。
│   │   │   ├── SidebarTabs.tsx — tablist 手动激活与键盘焦点移动。
│   │   │   ├── useResource.ts — 加载可取消资源，维护 loading/ready/error 和版本刷新。
│   │   │   └── useStoredChoice.ts — useStoredChoice.ts 的工程入口或配套实现。
│   │   ├── styles/ — styles 对应的工程文件。
│   │   │   ├── fits-source.css — fits-source 的样式、作用域与主题变量。
│   │   │   ├── load.ts — load.ts 的工程入口或配套实现。
│   │   │   ├── theme.css — theme 的样式、作用域与主题变量。
│   │   │   └── utilities.css — utilities 的样式、作用域与主题变量。
│   │   ├── types.ts — 定义绘图 widget 的图片引用和工作流内嵌画布数据类型。
│   │   └── vendor/ — 保存复用的上游前端代码。
│   │       └── comfyui/ — 受控复用的 ComfyUI 组件、样式和来源。
│   │           ├── composables/ — 选择控件使用的 Vue 属性与弹层尺寸组合函数。
│   │           │   ├── useAttrsClass.ts — 从 Vue 透传属性中拆出 class 供内部元素合并。
│   │           │   └── usePopoverSizing.ts — 计算选择控件弹层最小和最大宽度样式。
│   │           ├── multi-select/ — 上游多选控件、内容、触发器及类型。
│   │           │   ├── MultiSelect.vue — 组合多选根组件、触发器与内容，管理选择、搜索及弹层状态。
│   │           │   ├── MultiSelectContent.vue — 呈现多选搜索结果和已选项，处理键盘与焦点关闭行为。
│   │           │   ├── MultiSelectTrigger.vue — 呈现多选触发器、所选值及数量等状态。
│   │           │   └── types.ts — 定义多选选项、搜索、清空、计数和弹层配置类型。
│   │           ├── README.md — 记录移植组件的 ComfyUI 版本、上游路径、本地适配与许可证。
│   │           ├── select/ — 单选和多选共用的选项类型及搜索逻辑。
│   │           │   ├── types.ts — 定义选择选项的值、名称和禁用状态。
│   │           │   └── useSelectSearch.ts — 基于查询对选择选项执行模糊搜索。
│   │           ├── select.variants.ts — 定义选择器触发器、选项与弹层样式变体及 Escape 事件隔离。
│   │           ├── single-select/ — 上游单选和可搜索单选组件及属性类型。
│   │           │   ├── SearchableSingleSelect.vue — 实现带搜索、键盘交互和结果列表的单选控件。
│   │           │   ├── SingleSelect.vue — 实现原生风格单选弹层和选项选择，支持禁用项。
│   │           │   └── types.ts — 定义单选控件选项、尺寸、校验及搜索等属性。
│   │           └── tailwind-utils.ts — 组合并合并条件类名，避免冲突的 Tailwind 样式。
│   ├── tests/ — Vitest Chromium 与真实宿主回归。
│   │   ├── components/ — 验证画布与工具栏交互的组件测试。
│   │   │   ├── BundleBoundary.test.ts — 公共入口、空 Bundle 和第二 Bundle 的接入测试。
│   │   │   ├── DrawingApp.test.ts — 用真实 Canvas 验证绘制、清空、工具栏颜色尺寸及触摸笔画。
│   │   │   ├── Library.test.ts — 设备字段、本地化校验反馈、版本和草稿、真实 Reka 键盘。
│   │   │   ├── Localization.test.ts — 验证词条键集、Bundle 合并和公共源码字面量键。
│   │   │   ├── NodeCatalog.test.ts — 验证节点目录排序、收藏、筛选、拖放和画布替换。
│   │   │   ├── ScientificNodes.test.ts — 孤立宿主 Widget 下 Inspector 的写入、撤销边界、只读、取消与单通道。
│   │   │   ├── SidebarNavigation.test.ts — 默认 Assets 无请求、搜索与输入法、语言、单根挂载和清理。
│   │   │   └── StorageSettings.test.ts — 版本冲突与保留草稿、工作区迁移回执、缓存确认、分辨率恢复。
│   │   ├── host/ — 可控宿主边界测试与 opt-in 真实 ComfyUI 浏览器场景。
│   │   │   ├── api.test.ts — api 行为的 Vitest 断言。
│   │   │   ├── canvas.test.ts — canvas 行为的 Vitest 断言。
│   │   │   ├── domWidgetMounts.test.ts — 撤销后重挂扩展自有 Widget 和忽略外部元素。
│   │   │   ├── equipment-host.mjs — 真实浏览器设备/光路、跨重启验收及按运行限定的 API 删除和读回。
│   │   │   ├── fixtures.ts — fixtures.ts 的工程入口或配套实现。
│   │   │   ├── host-runtime.mjs — 目标宿主添加、撤销、保持侧栏打开时切换画布并拖放、旧图与 PNG 引用。
│   │   │   ├── siril-host.mjs — 真实 Siril 配置、FITS 候选、Inspector、源哈希和正式队列。
│   │   │   └── storage-host.mjs — 真实浏览器工作区迁移、缓存确认和预览设置持久化。
│   │   ├── host.ts — 提供测试用宿主 API、widget、挂载配置及画布笔画工具。
│   │   ├── setup.ts — 初始化 Vue 浏览器测试所需的宿主环境。
│   │   └── widgets/ — 验证原生 widget 注册、像素序列化和上传的测试。
│   │       ├── registration.test.ts — 验证构建后的 widget 在原生 DOM widget 中挂载独立 Vue、PrimeVue 和翻译。
│   │       └── serialization.test.ts — 验证 PNG 像素往返、旧值和损坏值处理、上传契约及中英文键一致。
│   ├── tsconfig.json — 设置共享 TypeScript 编译选项及 Vue 源码类型检查范围。
│   ├── vite.config.mts — Vite 8 独立 Vue ESM 构建。
│   └── vitest.config.mts — 配置 Vue 浏览器测试、Playwright 和宿主模块模拟别名。
├── js/ — ComfyUI 通过 WEB_DIRECTORY 加载的现行构建产物。
│   ├── assets/ — 供共用脚本加载的前端静态样式资源。
│   │   └── main.css — Vite 生成的 Vue 作用域组件样式、React 侧栏样式和 AstroPhoto 主题变量合并文件。
│   └── main.js — 单份 Vite 8 生成的 Vue 扩展与所选 Bundle，保留代理相对宿主模块。
├── LICENSE — 记录仓库 GNU GPL v3 授权全文，MCP 发布同步许可证时读取。
├── locales/ — 随 Registry 发布的宿主及绘图翻译。
│   ├── en/ — 英文画板词条资源。
│   │   └── main.json — 定义 vue-basic 英文标题、画笔、笔刷大小、清屏和恢复错误等词条。
│   └── zh/ — 中文画板词条和科学节点本地化定义。
│       ├── main.json — 与英文画板资源对应的中文词条，包括画笔提示和恢复错误。
│       └── nodeDefs.json — 翻译 Image Path、FITS Source 和 AutoStretch 的节点名、输入输出和科学参数提示。
├── mcp/ — 独立打包的 MCP 服务、文档和测试。
│   ├── LICENSE — MCP 包使用的 GPL-3.0 许可证全文。
│   ├── pyproject.toml — 定义 MCP 包版本、Python 与依赖要求、CLI 入口和构建测试配置。
│   ├── README.md — 说明独立 MCP 服务的安装、配置、只读工具、权限、测试和打包。
│   ├── src/ — MCP Python 包源码根目录。
│   │   └── astrophoto_mcp/ — 独立 FastMCP 服务、配置、客户端及领域工具。
│   │       ├── __init__.py — 独立 MCP 包标识，不导入 ComfyUI 或扩展。
│   │       ├── __main__.py — 解析 CLI 参数并启动标准输入输出 MCP 服务，保留 stdout 给协议。
│   │       ├── api/ — ComfyUI 与扩展公共 HTTP API 客户端适配。
│   │       │   ├── __init__.py — 公开 HTTP API 适配器包。
│   │       │   ├── comfy.py — 读取并解释 ComfyUI system_stats 与 vue-basic object_info 诊断接口。
│   │       │   └── equipment.py — 校验回环 URL、令牌、标识和查询，通过只读 HTTP 访问设备接口。
│   │       ├── client.py — 建立 HTTPX 客户端并通过 ComfyUI 公共接口诊断连接与扩展注册。
│   │       ├── config.py — 按 CLI、环境变量、默认值优先级解析并验证 ComfyUI URL。
│   │       ├── server.py — 创建唯一 FastMCP 服务，注册现有工具及校验已打包技能。
│   │       └── tools/ — MCP 诊断与设备只读工具注册。
│   │           ├── __init__.py — MCP 领域工具注册包。
│   │           ├── equipment.py — 注册设备、光学链及历史修订的六个只读查询工具。
│   │           └── status.py — 注册版本与连接状态诊断工具。
│   └── tests/ — MCP 客户端、配置、协议、设备与版本测试。
│       ├── conftest.py — 提供测试使用的 FastMCP 服务 fixture。
│       ├── fixtures/ — MCP 测试的固定契约数据。
│       │   └── status_contract.json — 固定版本和连接状态工具的输入输出 JSON Schema 期望值。
│       ├── test_client.py — 测试诊断端点路径、扩展缺席、HTTP 和传输错误、超时与无效 JSON 或系统结构。
│       ├── test_config.py — 测试 URL 配置优先级、非法和空值、IPv6、代理前缀以及 CLI 参数处理。
│       ├── test_equipment.py — 测试只读设备工具注册、令牌和回环限制、后端错误及 stdio 工具列表。
│       ├── test_server.py — 测试工具 Schema、重复注册、诊断结果与错误、无效技能、stdio 握手和纯协议 stdout。
│       └── test_version.py — 测试模块 CLI 与版本工具返回已安装包版本。
├── nodes/ — ComfyUI V3 绘图和科学图像节点。
│   ├── __init__.py — 导出工作流节点注册类。
│   ├── ComfyUIFEExampleVueBasic.py — 定义 V3 绘图组件节点，将上传图像交给宿主 LoadImage 并输出 IMAGE。
│   └── scientific.py — 定义 IMAGE_PATH、FITS 源和 Siril 自动拉伸 V3 节点及输入指纹。
├── pyproject.toml — 根项目版本与 Registry 元数据，声明锁步 MCP 和运行依赖、uv workspace、Python 下限及 pytest/Ruff/mypy 设置。
├── README.md — 用户安装和开发入口，介绍 uv、pnpm、绘图与宿主验证；其中资产不可用和 MCP 只有诊断是早期状态描述，需结合当前代码。
├── requirements.txt — 从源码安装 Extension 时使用本地 ./mcp 和运行依赖；Registry 暂存时换成同版本 PyPI pin。
├── scripts/ — 发布版本同步、包边界校验及隔离安装探针。
│   ├── check_install.py — 临时 venv 安装 wheel 或公共 PyPI pin，验证版本、stdio 握手、工具枚举与 version 调用。
│   └── release.py — 核对并同步根/MCP 版本及许可证，暂存 Registry ZIP、替换依赖 pin，校验 ZIP、wheel 和 sdist 文件范围。
├── tests/ — 扩展后端、宿主集成、节点和打包测试。
│   ├── backend/ — 领域服务及存储单元测试。
│   │   ├── test_core.py — 测试配置与路径解析不创建目录、默认数据目录和非法路径。
│   │   ├── test_equipment.py — 测试设备生命周期、规格校验、分页回滚、数据库约束、光学链并发与历史修订保护。
│   │   ├── test_siril.py — 验证 FITS、参数、子进程环境、执行恢复及真实 Siril 候选与正式输出链。
│   │   ├── test_status.py — 测试能力状态随实际注册变化，未实现功能不被报告为可用。
│   │   └── test_storage.py — 测试存储初始化恢复、并发、工作区与缓存、引用及副本导入、取消、迁移、路径和数据库故障。
│   ├── conftest.py — 提供隔离的 ComfyUI 宿主替身和扩展 fixture。
│   ├── integration/ — HTTP 路由及可选真实宿主集成测试。
│   │   ├── test_equipment_api.py — 测试设备及组合 HTTP 授权、版本、历史、路由冲突及官网样本创建、读回和逐用例 API 清理。
│   │   ├── test_host_runtime.py — 设置 COMFYUI_TEST_URL 后读取真实宿主状态及 vue-basic schema，断言绘图节点注册、输入 CUSTOM_VUE_COMPONENT_BASIC 和输出类型 IMAGE；不提交队列。
│   │   ├── test_siril_api.py — 在临时数据根目录测试 Siril 接口授权、科学图像来源和预览缓存。
│   │   ├── test_status_api.py — 用 aiohttp 测试 V3 加载时状态路由注册、路由所有权及服务器隔离。
│   │   └── test_storage_api.py — 测试存储 HTTP 授权、工作区设置、资产导入和配置无效时状态降级。
│   ├── nodes/ — 节点注册、输入和图像输出测试。
│   │   ├── test_image_io.py — 测试绘图节点委托 LoadImage 并输出宿主图像，以及无效组件数据在宿主 I/O 前被拒绝。
│   │   └── test_registration.py — 测试 V3 节点注册、稳定节点 ID、IMAGE_PATH 连接类型及绘图组件 Schema。
│   └── packaging/ — 发布包内容、代理路径与版本一致性测试。
│       ├── test_contents.py — 测试 Registry 和 MCP 构建包内容与泄漏检查，以及前端外部 URL 保留代理前缀。
│       └── test_versions.py — 测试版本及标签一致性、版本同步和 SemVer 不匹配错误。
└── uv.lock — 锁定根 Extension 和 MCP workspace 及其 125 个解析包，含 Python 3.11+ 平台条件和分发哈希。
```
