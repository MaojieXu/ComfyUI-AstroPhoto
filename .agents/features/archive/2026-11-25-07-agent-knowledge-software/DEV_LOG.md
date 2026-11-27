# Agent、天文知识库与软件节点 SOP — DEV_LOG

初始化：chat1 · 2026-11-25 16:37 -06:00

## 实现与决策历史

### DEV-chat1-001

- Chat / Time: chat1 · 2026-11-25 16:37 -06:00
- Type / Status: 初始化 / 完成
- Task: TASK-chat1-001、TASK-chat1-002、TASK-chat1-003
- 用户请求与结果：建立共享 Feature，记录三个 Chat 的工作方向；细节待确认，无业务代码变化。
- PRD：记录用户明确的范围，不虚构验收条款。

#### Changed Files

| File Path | Action | Changes |
| --- | --- | --- |
| .agents/features/2026-11-25-07-agent-knowledge-software/PRD.md | Added | 范围与待决事项 |
| .agents/features/2026-11-25-07-agent-knowledge-software/DEV.md | Added | 三条任务及并行协调 |
| .agents/features/2026-11-25-07-agent-knowledge-software/DEV_LOG.md | Added | 初始化记录 |
| .agents/features/2026-11-25-07-agent-knowledge-software/TEST_PLAN.md | Added | 测试方向与覆盖缺口 |

#### Local Verification

文档初始化；未执行代码测试。写后核对文件和工作区状态。

#### Untested / Next

需求、实现及测试均待各方向细化；尚无正式验证。

### DEV-chat3-001

- Chat / Time: chat3 · 2026-11-25 16:58 -06:00
- Task / PRD: TASK-chat3-001 / FR-chat3-001；实现单素材来源节点增量，保留 IMAGE_PATH。
- Changed Files: Modified astrophoto/api/assets.py、nodes/scientific.py、frontend/src/features/assets/AssetsPanel.vue、frontend/src/features/assets/CatalogProjects.vue、frontend/src/host/fitsSource.tsx、frontend/src/i18n/locales/en/sidebar.json、frontend/src/i18n/locales/zh/sidebar.json、frontend/tests/components/AssetsLibrary.test.ts、js/main.js、js/assets/main.css、docs/domains/assets.md、docs/api/http/contracts.md；Modified 本 Feature PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification: frontend typecheck、lint、build 通过；AssetsLibrary.test.ts 51 passed；pytest tests/backend/test_siril.py -k registered_source_nodes 使用工作区 basetemp 1 passed；ruff 通过。沙箱首次组件测试缺少浏览器，使用本机浏览器重试通过；默认临时目录的 pytest 因 Windows 长路径失败，短路径重试通过。
- Untested / Next: 真实宿主拖入、节点重开、路径接口及离线状态端到端未验证；当前预览含用户未保存工作流，未重启。


### DEV-chat3-002

- Chat / Time: chat3 · 2026-11-25 17:01 -06:00
- Task / PRD: TASK-chat3-001 / FR-chat3-001；用户要求展示名称和绝对路径。移除来源选择器内 UUID 显示，素材 ID 仍用于绑定。当前 8188 宿主实际仍加载旧 STRING 定义。
- Changed Files: Modified frontend/src/host/fitsSource.tsx、js/main.js、js/assets/main.css；Modified 本 Feature DEV_LOG.md、DEV.md、TEST_PLAN.md。
- Local Verification: typecheck、lint、build 通过；隔离 ComfyUI 0.46.0 / Frontend 1.59.6，导入测试素材后通过详情创建源节点，实际显示 M31_L_stretched 及完整宿主绝对路径；未改动原预览的未保存工作流。
- Untested / Next: 原 8188 宿主重启后用户数据的拖入与工作流重开尚未验证。


### DEV-chat3-003

- Chat / Time: chat3 · 2026-11-25 17:06 -06:00
- Type / Status: 用户工作方式纠正 / 已记录；关联 TASK-chat3-001、DEV-chat3-002。
- 用户要求：今后实现需重启才能查看时直接自动重启，不再询问。已写入 AGENTS.md；重启前核对目标实例和数据根、保留未保存工作，重启后验证。无业务代码变化。
- Changed Files: Modified AGENTS.md、.agents/features/2026-11-25-07-agent-knowledge-software/DEV_LOG.md、.agents/features/2026-11-25-07-agent-knowledge-software/DEV.md、.agents/features/2026-11-25-07-agent-knowledge-software/TEST_PLAN.md。
- Local Verification: 文档写后复读及 diff 核对；未运行代码测试。
- Untested / Next: 本次重启后已恢复原素材库并在真实宿主看到素材名称及路径；素材拖入和离线场景仍待验证。


### DEV-chat3-004

- Chat / Time: chat3 · 2026-11-25 17:16 -06:00
- Type / Status: 需求确认与计划 / 已记录；FR-chat3-002、TASK-chat3-002、TC-chat3-002。
- 用户确认分层结构化操作清单与统一节点生成方向，要求记录；每软件独立适配，以 Siril 作为首个分析样例。示例目录和 YAML 不作为已确认的最终格式。现有 FR-chat3-001 未被明确否决，继续保留；无业务代码变化。
- Changed Files: Modified `.agents/features/2026-11-25-07-agent-knowledge-software/PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。
- Local Verification: 本次为文档记录；写后复读核对，未运行代码测试。
- Untested / Next: 清单及生成器未实现；真实软件 CLI、文件格式与预览行为、具体目录和测试选择器待设计确认。

### DEV-chat3-005

- Chat / Time: chat3 · 2026-11-25 17:40 -06:00
- Type / Status: 需求修订 / 已记录；FR-chat3-001 v2、TASK-chat3-003、TC-chat3-003。
- 用户确认聚合通过复制而非移动，文件夹默认不递归，同名加后缀；此前已明确两个来源加中间聚合节点替换四节点。旧单素材设计与 v2 冲突部分被替代，原 ID 绑定等未冲突行为保留；未授权编码，无业务代码改动。
- Changed Files: Modified `.agents/features/2026-11-25-07-agent-knowledge-software/PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。
- Local Verification: 文档写后复读核对；未运行代码测试。
- Untested / Next: 未实现；端口、后缀格式、递归选项、运行生命周期及目标软件所需文件名待设计与验证。

### DEV-chat3-006

- Chat / Time: chat3 · 2026-11-25 17:45 -06:00
- Type / Status: 局部实现 / 未完成；TASK-chat3-003、FR-chat3-001 v2、TC-chat3-003。
- 实现聚合基础函数：展开目录第一层、按确定顺序复制、同名加数字后缀并避开已有名称、复制后检查来源变化、失败清理临时副本；尚未接入运行时与画布节点。
- Changed Files: Added `astrophoto/storage/aggregation.py`、`tests/backend/test_aggregation.py`；Modified 本 Feature `DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。PRD 无变化。
- Local Verification: `.venv\Scripts\python.exe -m pytest tests/backend/test_aggregation.py -q --basetemp .artifact/pytest-aggregation`：3 passed；ruff check 两个新增文件通过。
- Untested / Next: 三节点、素材和项目入口、动态多输入、Siril 目录端口、容量配额、跨下游生命周期、崩溃恢复、宿主进度、正式测试和文档尚未完成。当前代码未改变现有节点，未重启宿主。

### DEV-chat3-007

- Chat / Time: chat3 · 2026-11-25 17:52 -06:00
- Type / Status: 局部验证 / 未完成；TASK-chat3-003、FR-chat3-001 v2、TC-chat3-003。
- 新增聚合复制后源文件变化时拒绝结果并清理副本的测试。曾尝试节点接线，但下游使用与缓存目录生命周期尚未解决，已撤回该未完成接线，避免破坏现有节点；PRD 不变。
- Changed Files: Modified `tests/backend/test_aggregation.py`、`.agents/features/2026-11-25-07-agent-knowledge-software/DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。
- Local Verification: `.venv\Scripts\python.exe -m pytest tests/backend/test_aggregation.py -q --basetemp .artifact/pytest-aggregation2`：4 passed；ruff 和前端 typecheck 通过。节点注册测试尝试未完成并已中断，不能作为通过证据。
- Untested / Next: 三节点仍未注册；容量配额、目录保活和恢复、前端、Siril 接线、真实宿主验证均未完成，预览未重启。

### DEV-chat3-008

- Chat / Time: chat3 · 2026-11-25 18:08 -06:00
- TASK-chat3-003、FR-chat3-001 v2、TC-chat3-003。替换四个旧来源节点，接入文件来源、文件夹来源、文件聚合与素材库和项目拖拽。聚合目录以宿主 prompt 生命周期管理，记录副本对应关系并参与 Cache 容量检查。沿用 IMAGE_PATH，新增 FOLDER_PATH。用户将 Siril 适配和测试移出本任务范围。
- Changed Files: Modified __init__.py、nodes/scientific.py、astrophoto/storage/aggregation.py、astrophoto/storage/cache.py、astrophoto/storage/runtime.py、frontend/src/host/fitsSource.tsx、frontend/src/features/assets/AssetsPanel.vue、frontend/src/features/assets/CatalogProjects.vue、frontend/src/styles/fits-source.css、frontend/src/i18n/locales/en/sidebar.json、frontend/src/i18n/locales/zh/sidebar.json、locales/zh/nodeDefs.json、js/main.js、js/assets/main.css、docs/domains/assets.md、docs/architecture/overview.md、tests/conftest.py、tests/nodes/test_registration.py、tests/backend/test_siril.py、tests/integration/test_siril_api.py、tests/backend/test_aggregation.py、共享 DEV.md、DEV_LOG.md、TEST_PLAN.md。Added tests/nodes/test_sources.py 及忽略的 .artifact/agg-host 验证夹具与脚本。PRD 无变化。
- Local Verification: 文件来源与聚合 6 项通过，前端素材组件 51 项通过；typecheck、lint、构建及 Ruff 通过。扩展存储回归在沙箱中 50 通过、2 跳过、1 因 Windows 链接权限失败，单项离开沙箱重跑通过。
- Host: ComfyUI 0.46.0 隔离环境以独立目录消费者验证两个下游、重跑、后缀、非递归以及成功和报错后的清理。8188 已按原素材数据根重启，object_info 只返回三个现行素材节点，前端资源返回 200。
- Untested / Next: 真实多物理卷、两种画布模式的手动拖入与直接取消未实测。聚合复制中断与残留回收已在局部测试覆盖。Siril 测试不在本轮范围。


### DEV-chat3-009

- Chat / Time: chat3 · 2026-11-25 18:15 -06:00；FR-chat3-001；节点文案及来源界面优化。
- Changed Files: Modified frontend/src/host/fitsSource.tsx、frontend/src/i18n/locales/zh/sidebar.json、frontend/src/i18n/locales/en/sidebar.json、locales/zh/nodeDefs.json、js/main.js、js/assets/main.css、Feature PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification: 前端 typecheck、lint、build 通过；随后补充选择窗口忙提示并重新构建。预览工作流已保存，宿主重启。
- Untested / Next: 手动输入展开、长路径及两种画布实际布局尚需真实界面检查。


### DEV-chat3-010

- Chat / Time: chat3 · 2026-11-26 11:21 -06:00
- Type / Status: 记录补全 / 完成。核对共享文档及工作区后，将已确认的 FR-chat3-001 界面修订归入对应需求，更新 DEV 过时的初始化状态和 TASK-chat3-003 状态。
- Changed Files: Modified `.agents/features/2026-11-25-07-agent-knowledge-software/PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。无业务代码变化。
- Local Verification: 复读文档核对条目、引用和 chat3 写入身份；未重新运行代码测试。
- Untested / Next: DEV-chat3-008、DEV-chat3-009 已记录真实多物理卷、两种画布拖拽与布局检查缺口；未执行的项目仍不能视为通过。FR-chat3-002 的分层清单仍待实施。

### DEV-chat3-011

- Chat / Time: chat3 · 2026-11-26 16:00 -06:00；TASK-chat3-003 / FR-chat3-001；用户批准三个节点界面优化。产品经理与独立 UI/UX 子 Agent 已审阅，后者源码复核提出的问题已修正。
- Changed Files: Modified `frontend/src/host/fitsSource.tsx`、`frontend/src/styles/fits-source.css`、`frontend/src/i18n/locales/zh/sidebar.json`、`frontend/src/i18n/locales/en/sidebar.json`、`locales/zh/nodeDefs.json`、`nodes/scientific.py`、构建产物 `js/main.js`、`js/assets/main.css`，以及本 Feature `PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。工作树原有其他 Chat 和本 Chat 的未提交修改未归属本次。
- Local Verification: `pnpm -C frontend typecheck`、`pnpm -C frontend lint`、`pnpm -C frontend build` 通过；`.venv\Scripts\python.exe -m pytest tests/nodes/test_sources.py tests/backend/test_aggregation.py -q --basetemp .artifact/pytest-chat3-ux` 6 passed。独立 UI/UX 审阅为源码复核，未实测界面。
- Untested / Next: 两种画布、主题、长路径、状态切换和键盘交互待真实宿主视觉验证；未执行 Siril 测试。预览重启结果以本次最终状态为准。
- Preview: 8188 队列为空后按原数据根 astrophoto-remediation 重启，HTTP 200 且 object_info 返回新英文端口名；未刷新浏览器页面以保留编辑状态。

### DEV-chat3-012

- Chat / Time: chat3 · 2026-11-26 16:07 -06:00；TASK-chat3-003 / FR-chat3-001。用户指出节点和 item0 等命名难懂；产品经理和独立 UI/UX 子 Agent 审阅后简化中英文节点、端口及提示，动态端口只调整显示标签，内部 itemN 保持不变。
- Changed Files: Modified `nodes/scientific.py`、`locales/zh/nodeDefs.json`、`frontend/src/host/fitsSource.tsx`、`frontend/src/i18n/locales/zh/sidebar.json`、`frontend/src/i18n/locales/en/sidebar.json`、`js/main.js`、`js/assets/main.css`、本 Feature `PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`；Added `frontend/tests/components/SourceLabels.test.ts`。保留已有其他工作树改动。
- Local Verification: `pnpm -C frontend typecheck`、`pnpm -C frontend lint`、`pnpm -C frontend build` 通过；`pytest tests/nodes/test_sources.py` 1 passed；`pnpm -C frontend exec vitest run tests/components/SourceLabels.test.ts` 沙箱内无法找到测试浏览器，转本机运行：先修正测试桩后 1 passed；覆盖新增动态端口及切换语言时标签和内部键。独立 UI/UX 为源码复核。
- Untested / Next: 未验证两种真实宿主画布、旧工作流重开、缩放及动态端口连接时视觉表现；Siril 不在本轮范围。预览队列为空后重启，未强制刷新浏览器。

### DEV-chat3-013

- Chat / Time: chat3 · 2026-11-26 17:23 -06:00；TASK-chat3-004 / FR-chat3-003。用户确认素材变更后自动同步；产品经理和独立 UI/UX 子 Agent 审阅，保留选中值和草稿并区分已移除和加载失败。
- Changed Files: Modified `__init__.py`、`astrophoto/database/manager.py`、`frontend/src/features/assets/AssetsPanel.vue`、`frontend/src/features/assets/CatalogProjects.vue`、`frontend/src/host/fitsSource.tsx`、`frontend/src/i18n/locales/zh/sidebar.json`、`frontend/src/i18n/locales/en/sidebar.json`、`frontend/src/i18n/locales/zh/assets.json`、`frontend/src/i18n/locales/en/assets.json`、`frontend/tests/host.ts`、`docs/domains/assets.md`、构建产物 `js/main.js`、`js/assets/main.css`、本 Feature `PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`；Added `frontend/src/host/libraryChanges.ts`、`frontend/tests/components/LibraryChanges.test.ts`、`frontend/tests/components/SourceSync.test.ts`、`tests/backend/test_library_notifications.py`。保留工作树其他既有修改。
- Local Verification: `pnpm -C frontend typecheck`、`pnpm -C frontend lint`、`pnpm -C frontend build`；`pytest tests/backend/test_library_notifications.py tests/nodes/test_sources.py tests/backend/test_aggregation.py` 7 passed；前端四个相关测试文件 55 passed。首次后端测试发现 IdentitySet union 参数错误并修正，首次节点组件测试因测试未等待 Vue 更新失败并修正；复测通过。独立 UI/UX 进行源码复核，未实际渲染。
- Host: 8188 队列为空后按原 astrophoto-remediation 数据根重启；通过 MCP 导入临时测试素材，实际 ComfyUI WebSocket 收到 astrophoto.library_changed，随后移除探针并确认原 18 条素材保留。浏览器页面未强制刷新以保留编辑状态，首次加载新前端需用户保存后刷新。
- Untested / Next: 尚未在真实宿主两种画布模式直接观察事件触发后的侧栏及节点视觉更新，也未实际断网重连、测试并发编辑表单或批量部分失败的完整端到端体验；覆盖范围见 TC-chat3-004。

### DEV-chat3-014

- chat3 · 2026-11-26 17:59 -06:00。FR-chat3-004 / TASK-chat3-005。MCP 经独立连接绑定在线页面，提供节点发现、当前图读取、查找、增加、改参数、删除、连线、断开及命令回执。侧栏显示画布连接与当前目标。批量编辑沿用各操作的宿主历史边界。
- 新增：`astrophoto/api/canvas.py`、`mcp/src/astrophoto_mcp/tools/canvas.py`、`frontend/src/host/canvasActions.ts`、`frontend/src/host/canvasBridge.ts`、`frontend/tests/host/canvas-bridge.mjs`、`tests/integration/test_canvas_api.py`、`docs/api/mcp/canvas.md`。
- 修改：`astrophoto/api/routes.py`、`mcp/src/astrophoto_mcp/api/library.py`、`mcp/src/astrophoto_mcp/server.py`、`mcp/src/astrophoto_mcp/disclosure.py`、`mcp/tests/test_disclosure.py`、`frontend/src/main.ts`、`frontend/src/host/canvas.ts`、`frontend/src/features/sidebar/Sidebar.tsx`、`frontend/src/styles/theme.css`、`frontend/src/i18n/locales/en/sidebar.json`、`frontend/src/i18n/locales/zh/sidebar.json`、`js/main.js`、`js/assets/main.css`、`scripts/api_inventory.py`、`scripts/render_api_reference.py`、`docs/api/inventory.json`、`docs/api/http/routes.md`、`docs/api/http/contracts.md`、`docs/api/mcp/contracts.md`、`docs/api/mcp/examples.md`、`docs/api/mcp/README.md`、`docs/integrations/mcp.md`、`docs/product/requirements.md`、`docs/architecture/overview.md` 和 Feature PRD、DEV、DEV_LOG、TEST_PLAN。接口快照同步包含工作树原有路径路由变更。
- 局部验证：前端 build/typecheck/lint、Ruff 与差异检查通过。MCP 分类与发现 8 项、画布 HTTP 和状态 3 项、接口清单与导航等 9 项通过，含重复覆盖。独立 UI/UX 源码复核后修正连接文案、窄栏状态和无关输入焦点阻挡。
- 真实宿主：8191 独立数据根，ComfyUI 0.46.0 / Frontend 1.59.6，Playwright 两模式通过侧栏状态、stdio MCP 查找/增删改/连线/断开、占用、版本冲突、同命令重放检查。两份不同宽度的根图快照并发调用 graphToPrompt 与 app.api.queuePrompt，按返回的 prompt_id 读 history，匹配正确图和产物。首轮因输入焦点与正式运行更新画布而失败，缩小焦点检查并将两份快照先冻结后复测。8188 保留原数据根重启并验证状态、路由、构建资源。
- 缺口：正式 workflow_run MCP、宿主高层 queuePrompt 的完整 Widget 提交回调与任务 ID 关联、批量一次撤销、复杂第三方控件、全部子图/多标签视觉路径尚未验收。

### DEV-chat3-015

- Chat / Time: chat3 · 2026-11-26 18:02 -06:00。Type: 对话和验证记录补全。关联 FR-chat3-005、TASK-chat3-006、FR-chat3-004。
- 用户提出人工实时调参与 Agent 循环调参，Agent 可为主 Agent 或子 Agent；每轮查看全图最长边 1024 及中心、四角 512×512。画布操作为通用基础能力，调参为其上的场景。产品经理与 UI/UX 子 Agent 曾只读审阅，方案待进一步确认。
- 数据操作事实：用户提供的测试压缩包解压至 `测试数据/整理后的测试数据/`，通过 AstroPhoto MCP 引用导入 3 组 M86 子帧和 15 个主帧；随后用户要求移除其他素材，MCP 注销 33 条旧素材记录和对应项目引用，保留磁盘文件，回读素材库为 18 条。本记录不表示数据已纳入版本控制。
- 当前会话连接检查：先前旧 MCP 进程未暴露 canvas 分类；随后通过本地新建新版 MCP 客户端只读查询到 8188 的一个可编辑根画布，读取到 13 个节点。该检查没有执行画布编辑，也不代表聊天中的旧 MCP 连接已重载。
- Changed Files: Modified 本 Feature `PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`。本次记录补全无业务代码修改。
- Untested / Next: FR-chat3-005 未实施；FR-chat3-004 的正式 MCP 工作流执行工具和真实画布其他边界仍按 DEV-chat3-014、TC-chat3-005 跟踪。本次未重新运行测试。

### DEV-chat3-016

- Chat / Time: chat3 · 2026-11-26 19:13 -06:00。Type: MCP 工具更新与会话重连经验记录，关联 FR-chat3-004 / TASK-chat3-005。
- 当前 Codex 的 AstroPhoto MCP 以独立 stdio 进程运行。MCP 工具代码或注册变更后，已运行的 Agent/MCP 会话可能仍使用旧工具目录，需要重启或重新连接该 Agent 的 MCP 会话，才能加载更新；仅重启 ComfyUI 不会更新已运行的 MCP 进程。具体重连方式取决于客户端，若安装的是固定版本的包，还需先更新该包。重连后应通过当前 Agent 的工具发现接口验证新工具，而不是仅以独立测试进程的结果代替。
- 本次排查：旧 Chat 连接的 canvas_list_sessions 返回 UNKNOWN_TOOL；以 Codex 相同启动程序新建 stdio 会话后发现 7 个 Canvas 工具并读取 13 个节点。随后当前 Chat 的 MCP 工具发现已出现 canvas，canvas_list_sessions 和 canvas_get 返回成功，读取到一个可编辑画布、13 个节点与 10 条连线。本次观察未修改画布。
- Changed Files: Modified `.agents/features/2026-11-25-07-agent-knowledge-software/DEV_LOG.md`；无业务代码变化。
- Untested / Next: 本次验证为工具发现与读取，未在重新连接后的当前 Chat 再次执行全部画布写入工具；工作流文件 CRUD 仍为讨论方案，未确认实现方案或开始实施。

### DEV-chat3-017

- chat3 · 2026-11-26 19:20 -06:00。需求记录，关联 FR-chat3-006 / TASK-chat3-007 / TC-chat3-007。根据用户要求记录 Workflow、Canvas、Node 三层管理和记忆，以及跨工作流的 MCP 业务日志与用户偏好。保留既有在线 Canvas 验证和节点调参范围。
- Changed Files: 本 Feature 的 PRD.md、DEV.md、TEST_PLAN.md、DEV_LOG.md。仅文档增量，未实施接口或数据库变更。
- Local Verification / Next: 核对四份文档的编号和交叉引用。待确定文件 CRUD 的画布交互、记忆生命周期和 MCP 契约，再安排实施与验证。


### DEV-chat3-018

- chat3 · 2026-11-26 19:23 -06:00。关联 FR-chat3-006 / TASK-chat3-007 / TC-chat3-007。用户确认扩展统一管理记忆、SQLite 分表以及 MCP 访问边界，本轮补齐各层写入、查询和清理规则。
- Changed Files: 本 Feature 的 PRD.md、DEV.md、TEST_PLAN.md、DEV_LOG.md。仅记录需求与验收设计，无业务代码或 Schema 变更。
- Local Verification / Next: 核对四份增量及关联编号。文档阶段未运行程序测试；具体接口、表结构和待决策略留待后续设计。



### DEV-chat3-019

- chat3 · 2026-11-26 19:53 -06:00。记录 FR-chat3-005 / FR-chat3-006 的最新边界和 TASK-chat3-008 拟议实施流程、TC-chat3-008 逐套手验。沿用用户要求的主 Agent 自审，未委派产品子 Agent。
- Changed Files · 本 Feature 的 PRD.md、DEV.md、TEST_PLAN.md、DEV_LOG.md。仅文档更新，未改业务代码、Schema 或工具注册。
- Local Verification · 核对现有 Canvas 注册、ComfyUI userdata 与单任务路由、Siril 预览服务和既有运行快照证据。未运行测试，实施、实机回归与用户手验待执行。


### DEV-chat3-020

- chat3 · 2026-11-26 19:56 -06:00。关联 TASK-chat3-008、TC-chat3-008 与 FR-chat3-004/005/006。用户要求开展完整描述，本轮形成技术契约提案。
- Changed Files · 新增本 Feature TECH.md，修改 DEV.md、TEST_PLAN.md 和 DEV_LOG.md。无业务代码变更。
- Local Verification · 核对现有 Canvas 工具、正式提交的候选宿主 API 和回执风险。新增契约与手验链尚未实施或执行；配置和目标宿主的实际行为留待联调。

## DEV-chat3-021 · 工作流文件、任务执行及逐轮节点调参

- Chat / Time：chat3 · 2026-11-26 20:48 -06:00。实施及局部验证，关联 TASK-chat3-008、TC-chat3-008、FR-chat3-004/005/006。用户批准实施，随后取消 MCP 工作流 JSON 导出。当前提供 Workflow 12 个（含执行与产物）、Canvas 9 个、Node 6 个。未开启原位覆盖。记忆和历史版本仍为后续范围。
- 宿主复用原生工作流标签、userdata、图序列化、prompt 与 Jobs API。文件限定本机单用户工作流目录，改名和删除要求文件关闭、单页面及文件修订。MCP 运行通过提交请求 ID 核对宿主任务 ID，定向取消调用单任务接口。现有 Siril Inspector 识别新的文件来源节点；Agent 用输入引用逐轮处理、查看全图或局部并核验后写回。
- Changed Files（新增）：astrophoto/api/node_tuning.py、frontend/src/host/canvasRun.ts、frontend/src/host/workflowActions.ts、mcp/src/astrophoto_mcp/tools/workflow.py、mcp/src/astrophoto_mcp/tools/node_tuning.py、docs/api/mcp/workflow.md、docs/api/mcp/node.md。
- Changed Files（修改）：__init__.py、astrophoto/bootstrap.py、astrophoto/api/canvas.py、astrophoto/api/status.py、astrophoto/assets/fits.py、astrophoto/core/capabilities.py、astrophoto/storage/cache.py、extension/siril/frontend/SirilNodes.tsx、extension/siril/previews.py、frontend/src/host/canvasBridge.ts、mcp/src/astrophoto_mcp/api/library.py、mcp/src/astrophoto_mcp/tools/canvas.py、mcp/src/astrophoto_mcp/disclosure.py、mcp/src/astrophoto_mcp/server.py、js/main.js、js/assets/main.css（构建）、frontend/tests/host/canvas-bridge.mjs、mcp/tests/test_disclosure.py、tests/backend/test_status.py、tests/integration/test_canvas_api.py、tests/integration/test_siril_api.py（修正旧节点数量与返回断言）。
- 文档同步：docs/api/inventory.json、docs/api/http/routes.md、docs/api/http/contracts.md、docs/api/mcp/{README,canvas,contracts,examples}.md、docs/architecture/overview.md、docs/integrations/mcp.md、docs/product/requirements.md，以及本 Feature 的 PRD、DEV、TECH、TEST_PLAN、DEV_LOG。工作区已有其他 Chat 的改动，以上仅记录本次触及内容。
- Local Verification：Python Ruff 已通过本次模块。frontend lint、typecheck、build 均通过。MCP 包 98 passed。后端相关回归 27 passed / 3 skipped，跳过的是需要真正 Siril CLI 的用例。真实宿主 8192 为 ComfyUI 0.46.0 / Frontend 1.59.6，Classic 和 Nodes 2.0 均通过 stdio MCP 工作流管理、画布增删改连、子图进入和返回、Widget 回调、两种参数对应的任务回执和产物、FITS 原图 MCP 图像交付。Classic 两个任务 ID 为 de39e886-1fc4-4f96-8993-3da9b1ac56e4 / 94f2440a-2a1c-4e00-986b-4426365d98d7。Nodes 2.0 为 1bfc01f7-ed4d-4563-b3ce-ae5182f2b5e1 / 45997269-13ba-4c5d-92b9-71545779daa4。早期联调发现纯序列化会把运行后的临时布局当成版本变化，改用节点和子图的编辑状态后，两模式复测通过。
- 部署：原 8188 使用原数据根和存储实例 ID 重启，验证状态、Node 路由和实际前端资源 SHA-256。保留用户原浏览器标签，未刷新。当前 Chat 的既有 MCP 连接仍报告旧分类，独立启动的新 stdio 进程已通过工具发现与业务测试。
- Untested / Next：真实 Siril CLI 未配置，候选处理使用模拟验证；活动任务定向取消验证使用模拟宿主，真实宿主覆盖任务终态及取消无操作。用户手验和当前 Agent 重连验证继续按 TC-chat3-008。产物查找当前验证的是宿主 View 文件。未知上游图像生产者需提供可验证的输出解析。

## DEV-chat3-022 · 实施 Chat 代码初审与独立审查交接

- 2026-11-26 20:53 -06:00 · chat3（实施 Chat）。用户要求代码审查。核对 TASK-chat3-008 实际代码及 DEV-chat3-021，准备独立审查交接。此记录为初审，无 REVIEW ID 和业务代码修改。
- 比较基准为当前 HEAD 40836a81。审查目标为该基准上的工作树，包含相关未跟踪源码。定位快照（Git blob）：workflowActions.ts 5fbc5cc3，canvasBridge.ts 7fb640f6，canvasActions.ts aab6165b，canvasRun.ts 2d415953，canvas.py 70f4c9de，node_tuning.py e582c259，previews.py 6dbf2dcc，MCP workflow.py ae0a1ced。对照 ComfyUI 0.46.0 后端 userdata 和 Frontend 1.59.6 内置源码映射。排除已撤销的 JSON 导出、后置功能及其他 Chat 的变更。
- F01 · P1 · frontend/src/host/workflowActions.ts:84。两个页面同时另存或导入到同一个新路径时，各自的写入锁无法互斥。宿主在读取请求体前检查是否存在，随后用替换发布文件，可能让两个调用都成功并覆盖先保存的结果。需要宿主端独占创建，或使目标路径的提交在可靠边界内串行并核对冲突。
- F02 · P2 · frontend/src/host/canvasActions.ts:172。先断线再给同一个已连接控件设值时，预检仍读取原始连接状态，直接拒绝本应按顺序应用的有效批次。预检需使用前序命令得到的端口状态。
- F03 · P2 · frontend/src/host/canvasRun.ts:17。MCP 只调用实际控件的 beforeQueued/afterQueued，遗漏宿主原生对子图提升控件执行的控制逻辑。设置了随机化或递增的提升 seed 时，同一图的执行行为会因提交入口不同而变。复用宿主等效提交逻辑，并核对实际发送的参数及运行后的控件值。
- F04 · P2 · mcp/src/astrophoto_mcp/tools/workflow.py:113。只持有 request_id 的 Agent 在命令票据被读操作挤出后收到 CANVAS_COMMAND_UNKNOWN。宿主还保留使用同一 ID 的任务，但代码在查询原生任务前失败。对已淘汰票据保留足够的提交关联，或在确定宿主归属时按已知原生 ID 恢复。
- F05 · P2 · astrophoto/api/node_tuning.py:143。开始预览前验证了输入指纹，创建后台任务时只传素材路径或 ID。文件在校验和 worker 打开之间被替换时，worker 会以新内容为准执行并报告 ready，比较或应用时才被拒绝。应把预期指纹传给 worker，在生成预览及启动 Siril 前核对。
- F06 · P2 · mcp/src/astrophoto_mcp/tools/workflow.py:28。产物解析只接受原生 filename 对象，Siril 正式处理回报为 astrophoto_output 中的 UUID 字符串。这类任务能显示完成却未返回 FITS 产物，artifact_get 也无法定位。应从该任务的可信回执读取正式产物 ID，再经扩展公开接口核对可用性。
- 本轮复跑 tests/integration/test_canvas_api.py（2 passed）及 MCP tests/test_disclosure.py（9 passed）。发现依据为静态路径核对。缺少 F01～F06 的专项回归，真实 Siril、实机定向取消、手验及当前 Agent 新工具发现仍沿用 TC-chat3-008 的待验证状态。
- Changed Files：本 Feature 的 DEV.md、DEV_LOG.md 和 TEST_PLAN.md。后续业务缺陷修复另行执行。

## DEV-chat3-023 · 审查问题修复进行中

- 2026-11-26 20:54 -06:00 · chat3。关联 DEV-chat3-022、TASK-chat3-008、TC-chat3-008。修复 F02 的有序断线预检，以及 F05 后台预览启动时核对预期输入指纹。修改 frontend/src/host/canvasActions.ts、extension/siril/previews.py、astrophoto/api/node_tuning.py。
- 局部验证：frontend typecheck 通过；tests/integration/test_canvas_api.py 2 passed。六项专项回归未完成。F01、F03、F04、F06 尚未修复，F02、F05 仍需专项回归和宿主验证。本轮未重启预览实例。

## DEV-chat3-024 · 六项代码初审问题修复与专项回归

- 2026-11-26 21:13 -06:00 · chat3。关联 TASK-chat3-008、DEV-chat3-022/023、TC-chat3-008。按用户要求先处理 F01，再完成 F02～F06 修复与专项回归，PRD 无需求变更。
- F01：工作流另存与导入通过扩展发布同目录完整临时文件，使用原子硬链接创建目标，冲突时不覆盖；前端继续使用 ComfyUI 工作流目录和原生刷新。双页面并发导入和另存验证一个成功、另一个返回冲突。
- F02：预检沿用前序断线的端口状态。F03：MCP 使用宿主原生队列和提升控件回调，提交时关联原生任务 ID；为正确读取带提升输入的子图节点，从所属图读取实际链接。F04：命令回执淘汰时按当前宿主对应的原生任务 ID 查询。F05：后台 worker 收到输入的预期指纹，处理前拒绝已替换的源。F06：任务输出解析 astrophoto_output 登记 ID，经扩展公开接口查询正式 FITS 产物。
- Changed Files：astrophoto/api/canvas.py、astrophoto/api/node_tuning.py、extension/siril/previews.py、frontend/src/host/canvasActions.ts、frontend/src/host/canvasBridge.ts、frontend/src/host/canvasRun.ts、frontend/src/host/workflowActions.ts、mcp/src/astrophoto_mcp/tools/workflow.py；新增 frontend/tests/components/CanvasReview.test.ts，修改 frontend/tests/host/canvas-bridge.mjs、mcp/tests/test_disclosure.py、tests/backend/test_siril.py、tests/integration/test_canvas_api.py。F02/F05 业务文件首次修改见 DEV-chat3-023。
- 文档及构建：docs/api/http/contracts.md、docs/api/http/routes.md、docs/api/inventory.json、docs/api/mcp/contracts.md、docs/api/mcp/*.md 的生成 Schema、js/main.js、js/assets/main.css；以及本 Feature 的 DEV.md、DEV_LOG.md、TEST_PLAN.md。
- 验证：MCP 全包 99 passed；相关后端 30 passed、3 skipped（缺少 Siril CLI）；前端 lint、typecheck 和两项专项 Vitest 均通过；Python Ruff 通过。独立宿主 ComfyUI 0.46.0 / Frontend 1.59.6 的 Classic 和 Nodes 2.0 通过真实双页面同名写入、任务 ID 与输出、子图提升 seed。提升 seed 的运行请求由测试路由模拟响应，验证发送的 seed 与运行后控件值；其余基础任务实际提交宿主。Classic 原生任务 ID 为 cb994493-ffeb-4671-a6bf-e4fe739659df / 35f861d7-7211-4549-81bd-70ec65dfe2de；Nodes 2.0 为 d81b5fa2-7a95-4fec-85ae-a4f835448a20 / 9a3cf0e6-27e5-4dae-88ad-02088ada31f8。早期真实宿主测试发现提升子图输入读取异常，修正后重测通过。隔离宿主首次重启尚未就绪导致一次连接失败，启动完成后重试通过。
- 范围与限制：真实 Siril CLI 处理未验证；F06 的 MCP 任务与正式产物查询使用模拟传输及独立 API 测试，未以真实 Siril 运行验证。用户手验和独立复审尚未执行。当前 Chat 的已启动 MCP 服务需要重新连接才能载入新代码。
- 预览：确认 8188 原实例数据根和空队列且无在线画布后重启，保留原数据根；完成后的状态以本次最终复核为准。

- 2026-11-26 21:14 -06:00 · chat3。8188 最终复核状态 ok，原数据根和实例 ID 1db29e0b-0eab-4540-b920-840f8a2cfd48 保持，Canvas 可用，正式产物路由返回 OUTPUT_NOT_FOUND，前端资源 SHA-256 与当前构建一致。

## DEV-chat3-025 · 独立子 Agent 审查七项修复

- 2026-11-26 21:51 -06:00 · chat3。用户授权处理 REVIEW-agent-origin-main-001 的七项发现，优先任务 ID，关联 FR-chat3-003/004/005/006、TASK-chat3-008、TC-chat3-008。原需求不变。审查者为 origin_main_review 子 Agent，审查事实补录在 REVIEW.md，未冒用其他 Chat 身份。
- 任务提交：按 ComfyUI Frontend 1.59.6 原生 LIFO 队列的请求序号识别目标，先于宿主控件回调复核图修订，并在序列化期间检查图变化。MCP ID 仅注入目标快照对应的原生提交；其他原生队列任务与直接提交保留自己的 ID。宿主已有同 ID 任务时返回 reused 与任务 ID，不声称当前图就是原快照。适配依赖此宿主版本的队列内部字段，字段缺失时显式返回 CANVAS_UNSUPPORTED。
- 数据一致性：Siril CLI 暂存时记录源文件指纹。画布节点检查同时校验上游节点连接、参数、文件选择与已记录源文件指纹，变化时拒绝使用旧 CLI 输出。子帧组和素材详情订阅库变化事件；编辑时延后刷新，保留本地草稿与原修订。
- 宿主与打包：host-runtime.mjs 改用 AstroPhotoFileSource，siril-host.mjs 两处来源及当前正式结果字段同步，增加不依赖外部 CLI 的 registration-only 检查。本地测试数据目录加入 Git 和 Registry 忽略。修复被现有打包回归发现的模块边界问题：通用 Canvas Bridge 通过软件 Bundle 接口获取节点预览能力。
- 本次 Changed Files：.gitignore、.comfyignore、frontend/src/host/canvasRun.ts、frontend/src/host/canvasBridge.ts、frontend/src/bundles/types.ts、frontend/src/main.ts、frontend/src/features/assets/CatalogDetails.vue、extension/siril/frontend/SirilNodes.tsx、extension/siril/frontend/index.ts、extension/siril/node.py、extension/siril/session.py、astrophoto/api/node_tuning.py；frontend/tests/components/CanvasReview.test.ts、frontend/tests/components/ScientificNodes.test.ts、frontend/tests/components/AssetsLibrary.test.ts、frontend/tests/host/canvas-bridge.mjs、frontend/tests/host/host-runtime.mjs、frontend/tests/host/siril-host.mjs、tests/backend/test_siril.py、tests/packaging/test_contents.py；docs/api/mcp/contracts.md、docs/integrations/mcp.md、docs/domains/siril.md、js/main.js、js/assets/main.css；本 Feature 的 REVIEW.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。共享工作区内其他已有改动未回退。
- 验证：frontend 全量 Vitest 20 files / 152 passed，frontend typecheck、lint、build 通过；MCP 全包 99 passed；相关后端及 Registry 37 passed、3 skipped、2 deselected，三个跳过用例需要真实 Siril CLI。Registry 实际打包与目录过滤测试通过。独立宿主 ComfyUI 0.46.0 / Frontend 1.59.6 的 Classic 与 Nodes 2.0 均通过 canvas-bridge 及 test:host，siril-host --registration-only 通过；任务交错和提升 seed 的 HTTP 提交由测试路由模拟响应，基础图真实执行。Classic 基础任务 ID 为 b027c503-98e0-4c43-ac11-72f7061e795b / 2e6dfafd-d19b-4bed-a7bf-fa07fedb9e00；Nodes 2.0 的任务 ID 为 dcbb4724-6143-4722-9a39-1a23bfaed598 / 96a392bc-7523-4baa-a675-636b932f4378。额外测试在真实宿主回执缓存淘汰后按同一 ID 重试并恢复任务。
- 验证过程：素材测试初版使用错误的测试定位器，修正后通过。扩展边界测试发现原 Canvas Bridge 直接依赖处理软件，改为 Bundle 注入后复测通过。用户手验、真实 Siril CLI 处理与修复后独立复审未执行。既有 Chat MCP 进程需重连以加载新的服务代码。

- 2026-11-26 21:52 -06:00 · chat3。8188 在确认空队列、无在线画布后重启。启动初期连接被拒，等待后复核状态 ok，原数据根和实例 ID 1db29e0b-0eab-4540-b920-840f8a2cfd48 保持，Canvas 可用，前端资源与最终构建的 SHA-256 一致。

- 2026-11-26 21:53 -06:00 · chat3。补充核对 Stage-only 上游文件引用及 CLI 运行期间切换文件后的迟到结果。最终 ScientificNodes 与 CanvasReview 专项 15 项通过，后端来源检查通过，前端 typecheck、lint、build 复测通过。8188 提供的最终前端资源与本次构建 SHA-256 一致。

- 2026-11-26 21:54 -06:00 · chat3。ScientificNodes 专项补入 Stage-only 上游文件选择变更的可执行断言，8 项通过。

## DEV-chat3-026 · Feature 状态与契约同步

- 2026-11-27 07:21 -06:00 · chat3。用户要求更新 Feature。核对现有源码、PRD、DEV、TECH、TEST_PLAN 和 REVIEW，以 DEV-chat3-025 为最近实现证据。更新 PRD 中已过时的实施状态、DEV 顶部及审查交接状态、TECH 的队列和回执说明及 TEST_PLAN 当前覆盖缺口；保留原时间点的历史记录。原需求未变。
- Changed Files：本 Feature 的 PRD.md、DEV.md、TECH.md、TEST_PLAN.md 和 DEV_LOG.md。无业务代码或测试代码改动。
- Local Verification：按当前工作树核对关联实现和原有验证记录；本次未重跑测试。真实 Siril CLI、活动任务定向取消、当前 Agent MCP 重连、用户手验和修复后独立复审仍未验证。见 TC-chat3-008 和 REVIEW-agent-origin-main-001。
# DEV-chat3-027：统一素材删除需求与实施准备

- chat3 · 2026-11-27 07:29 -06:00；FR-chat3-007 / TASK-chat3-009。用户批准删除语义及移除独立 MCP 物理删除工具，并要求实现、测试和更新 Feature。
- 核对现有实现：物理删除当前保留登记，登记删除清理关联；需要后端协调故障和并发，不能只串接两个 MCP 请求。产品经理子 Agent 已完成只读审阅。
- Changed Files：本 Feature 的 PRD.md、DEV.md、TEST_PLAN.md、DEV_LOG.md（均修改）；无业务代码及测试代码修改。
- Local Verification：只读检查现有源码与接口；未执行功能测试。Untested / Next：TASK-chat3-009 实现和 TC-chat3-009 全部场景。

- chat3 · 2026-11-27 07:30 -06:00 用户修订：删除行为按文件归属自动决定，受管文件直接删除，外部文件只移除登记与引用，不设置两级删除缓冲。取代先前选择保留或删除受管文件的方案。无业务代码更改。

- chat3 · 2026-11-27 07:32 -06:00 用户指出没有“混合子帧组”这一产品概念，删除该表述；源码检查发现追加子帧读取当时的导入设置，未核实已有实际混合数据，具体存储归属仍须按成员核对。无业务代码更改。

## DEV-chat3-028：统一删除实施中

- chat3 · 2026-11-27 07:35 -06:00；FR-chat3-007 / TASK-chat3-009；未完成。
- Changed Files：`mcp/src/astrophoto_mcp/tools/catalog.py` 移除独立 MCP 删除工具；`mcp/src/astrophoto_mcp/disclosure.py` 移除 storage 分类；新增 `tests/integration/test_unified_asset_removal.py`；本 Feature DEV.md、DEV_LOG.md、TEST_PLAN.md 更新。
- Local Verification：隔离环境运行 `.venv/Scripts/python.exe -m pytest tests/integration/test_unified_asset_removal.py -q`，1 passed、1 failed：外部引用保留通过，受管副本仍未随素材登记删除。第一次运行 2 failed，发现 storage 分类仍存在，移除后复测。沙箱内运行受环境限制，使用提升权限运行本地集成测试。
- Untested / Next：后端完整删除、故障恢复、子帧组、子帧、共享文件与并发检查；清理旧测试、契约文档和 HTTP 入口；MCP 重连及宿主集成验证。当前源码中已移除独立工具但新删除流程尚未实现，不能视为可交付。

## DEV-chat3-029：删除关联确认需求

- chat3 · 2026-11-27 07:38 -06:00；FR-chat3-007 / TASK-chat3-009。用户要求有关联时删除前向用户报告并取得同意，MCP、后端、前端一致；文件安全检查保留。已启动独立产品及 UI/UX 审阅。
- Changed Files：本 Feature PRD.md、DEV.md、TEST_PLAN.md、DEV_LOG.md；本次尚无业务代码或测试代码更改。
- Local Verification：源码只读检查，确认存在素材详情、子帧和旧 AssetEditor 等删除入口。新增确认行为尚未实现和测试。

## DEV-chat3-030：删除影响检查原型

- chat3 · 2026-11-27 07:42 -06:00；FR-chat3-007 / TASK-chat3-009；未完成。新增后端只读影响检查原型，汇总项目、校准、来源关系及存储记录并计算影响摘要；尚未接入 HTTP、MCP、删除保护或前端，不能用于实际确认。
- Changed Files：新增 `astrophoto/assets/deletion_impact.py`；修改 `tests/integration/test_unified_asset_removal.py` 增加项目引用变化的检查；本 Feature DEV_LOG.md 和 TEST_PLAN.md。
- Local Verification：`.venv/Scripts/python.exe -m pytest tests/integration/test_unified_asset_removal.py -q`（提升权限的隔离环境）2 passed / 1 failed：新增项目关联摘要变化测试通过，受管文件随素材删除仍失败。
- Untested / Next：影响摘要仍需验证文件状态和全部关联；确认凭据及事务检查、文件删除与中断恢复、MCP / HTTP / UI 接线、旧入口清理和手动验证均未完成。

## DEV-chat3-031：目录删除关联检查接线

- chat3 · 2026-11-27 07:45 -06:00；FR-chat3-007 / TASK-chat3-009；未完成。目录 API 新增删除影响查询，目录删除在事务内核对关联影响摘要；缺少确认或影响过期时拒绝。MCP 添加 `library_deletion_impact` 并允许删除请求携带摘要。不能将摘要视为服务端证明用户已同意。
- Changed Files：`astrophoto/api/catalog.py`、`astrophoto/api/errors.py`、`mcp/src/astrophoto_mcp/tools/catalog.py`、`tests/integration/test_unified_asset_removal.py`、本 Feature DEV_LOG.md / TEST_PLAN.md。
- Local Verification：隔离运行 `.venv/Scripts/python.exe -m pytest tests/integration/test_unified_asset_removal.py -q`：2 passed / 1 failed。项目关联未确认、过期摘要拒绝及 MCP 摘要查询/确认删除通过；受管文件随登记删除仍失败。
- Untested / Next：旧 `/library/assets/{id}` 与 `delete-file` 路由尚未统一及防绕过；摘要未覆盖所有文件状态；前端未接入；受管文件删除及中断恢复未实现；子帧组和其他关联未完整验证。未重启宿主或重连 MCP。当前不得视为统一确认已完成。

## DEV-chat3-032：完成统一素材删除

- chat3 · 2026-11-27 08:03 -06:00；FR-chat3-007 / TASK-chat3-009 / TC-chat3-009。完成受管文件删除、外部原件保留、关联确认和旧入口清理。普通素材、子帧及组共用后端文件保护；两类 HTTP 删除入口均核对关联影响。文件删除前记录恢复意图，提交登记清理后移除记录。组内部分失败提交已完成成员，保留组和剩余成员供重试。未设置回收站。
- AstroPhoto MCP 返回删除及部分完成信息，附带用户已同意的影响摘要时仍检查素材、关联和文件状态。前端共用宿主确认弹窗，窄屏正文始终显示文件处理方式和关联数量，长列表显示前四条及剩余数。
- Changed Files：新增 `astrophoto/assets/managed_delete.py`、`frontend/src/features/assets/deleteAsset.ts`。修改 `astrophoto/assets/{deletion_impact,library}.py`、`astrophoto/api/{catalog,library,errors}.py`；`mcp/src/astrophoto_mcp/api/library.py`、`mcp/src/astrophoto_mcp/tools/catalog.py`、`mcp/src/astrophoto_mcp/server.py`、打包 Skill `mcp/src/astrophoto_mcp/skills/astrophoto-management/SKILL.md`。修改 `frontend/src/api/assets.ts`、`frontend/src/features/assets/{AssetEditor,AssetsPanel,CatalogDetails,LibraryError}.vue`、`frontend/src/features/library/components/useMutation.ts`、`frontend/src/i18n/locales/{en,zh}/assets.json`、构建 `js/main.js`。
- Changed Files（测试和文档）：`tests/integration/{test_unified_asset_removal,test_photography_library,test_direct_import,test_library_mcp}.py`、`tests/backend/test_agent_direct_rules.py`、`mcp/tests/test_catalog_tools.py`、`frontend/tests/components/AssetsLibrary.test.ts`、`docs/domains/{assets,storage}.md`、`docs/architecture/overview.md`、`docs/api/http/{README,contracts,routes}.md`、`docs/api/mcp/{README,contracts,library}.md`、`docs/api/inventory.json`。删除 `docs/api/mcp/storage.md`。本 Feature DEV、DEV_LOG、TEST_PLAN 同步。
- Local Verification：相关扩展回归 62 通过（上述四个集成测试文件及 `test_agent_direct_rules.py`）；最后对恢复回执与来源关联复测 8 通过。MCP 套件 99 通过。前端 typecheck、lint、build 和 Chromium 20 文件 / 152 测试通过。早期失败来自仍使用旧语义的删除调用、断言和浏览器模拟，已修正并复跑。
- Host Verification：8188 原数据根重启后 status OK，实例 ID 未变。真实宿主影响读取通过、旧路由 HTTP 405、最终前端包已加载。新建 stdio MCP 能发现新工具并读取同一宿主的删除影响。独立 UI/UX 在真实宿主以拦截影响数据复核 484×613 深色弹窗，模拟 40 个关联，取消时无 DELETE，证据 `.artifact/delete-confirm-narrow-final.png`。
- Untested / Next：当前聊天已经打开的 MCP 连接仍显示旧清单。真实宿主不对现有预览素材做破坏性验证，物理删除由隔离集成测试覆盖。浅色、英文的真实宿主确认弹窗未独立复核。

## DEV-chat3-033：MCP 工具清单与 Feature 状态同步

- chat3 · 2026-11-27 08:18 -06:00；TASK-chat3-008、TASK-chat3-009。用户要求按 feature-pipeline 更新。前一轮依据工具 Schema 解释 Workflow、Canvas、Node 各工具；该解释未改变产品需求或实现。
- 用户要求清点工具时，实际查询当前聊天的 MCP，仍返回旧 storage 分类且无 library_deletion_impact。另以新建自动发现模式 stdio MCP 进程只读列举，得到 8 个分类、66 个业务工具及 3 个发现入口，与 docs/api/inventory.json 一致。新建会话清单不能证明本聊天旧连接已更新。
- Changed Files：本 Feature DEV.md、DEV_LOG.md、TEST_PLAN.md；无业务代码或测试代码变化。PRD 经核对未变化。
- Local Verification：重读共享 PRD、DEV、DEV_LOG、TEST_PLAN、工作树及生成的 Canvas / Workflow / Node Schema；本次未运行功能回归，历史证据沿用 DEV-chat3-025、DEV-chat3-032。当前聊天 MCP 重连、真实 Siril CLI、用户手验及独立复审仍未完成。


## DEV-chat3-034：侧栏标题整合画布状态
- 2026-11-27 08:29 -06:00 · chat3 · FR-chat3-017 / TASK-chat3-017。标题中显示画布摘要，原生详情控件展示完整连接状态、工作流、范围及未保存/只读信息；刷新功能和画布桥接保持不变。
- Changed Files：frontend/src/features/sidebar/Sidebar.tsx、frontend/src/styles/theme.css、frontend/src/i18n/locales/zh/sidebar.json、frontend/src/i18n/locales/en/sidebar.json、frontend/tests/components/SidebarNavigation.test.ts、frontend/tests/host/canvas-bridge.mjs、js/main.js、js/assets/main.css（构建产物）；Feature 的 PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification：pnpm -C frontend typecheck、lint、build 通过；定向浏览器组件测试 2 文件 8 项通过，覆盖长名称文本、断连与未就绪状态。独立 UI 复核在 ComfyUI 8188、Chromium 542×613、侧栏宽 312px 深色主题进行：键盘 Enter 打开详情，目标和连接状态可见；初次发现浮层左侧溢出，调整定位后复测面板完全位于侧栏内。复核使用独立页面，未修改用户工作流。
- Untested/Next：长名称、浅色主题、真实断连和只读状态未完成实机视觉复核；现有用户页面需刷新以加载构建资源；本次未重启宿主或进行 Feature 全量验收。

## DEV-chat3-035：标题栏单行画布状态
- 2026-11-27 08:44 -06:00 · chat3 · FR-chat3-017 / TASK-chat3-017。用户选择单行图标方案，替代 DEV-chat3-034 的常驻摘要：正常状态仅显示图标，断开或未就绪时显示简短提示；详情展示目标和状态。Escape 收起并返回焦点，点击外部收起。
- Changed Files：frontend/src/features/sidebar/Sidebar.tsx、frontend/src/styles/theme.css、frontend/tests/components/SidebarNavigation.test.ts、frontend/tests/host/canvas-bridge.mjs、js/main.js、js/assets/main.css（构建产物）；Feature PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification：pnpm -C frontend typecheck、lint、build 通过；定向浏览器组件测试 2 文件 8 项通过。独立 UI 在真实 ComfyUI 8188、Chromium 542×613、312px 侧栏复核：单行标题、信息图标、目标详情、键盘 Enter 和 Escape 焦点返回、外点关闭及浮层位于侧栏范围内均通过；未修改用户画布。
- Untested/Next：异常、长名称、中英文与浅色主题的真实宿主视觉未全覆盖；模拟状态见组件测试。用户当前页面需要刷新，未擅自重载。未执行 Feature 全量验收。

## DEV-chat3-036：确认前五类 MCP 参数优化方案
- 2026-11-27 09:15 -06:00 · chat3 · FR-chat3-018 / TASK-chat3-018。用户要求结合 AGENTS.md Global Rules 给出最终完整方案；确认复用优先、直接替换、无需迁移或兼容，并先不做小模型测试。产品经理只读审阅了分页隔离、删除确认、名称/路径歧义、现有导入默认值和更新语义。
- Changed Files：.agents/features/2026-11-25-07-agent-knowledge-software/PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md；无业务代码改动。
- Local Verification：重新读取 AGENTS.md、现有 PRD/DEV、MCP 工具 schema 和源码；本轮未执行功能测试。已确认 mcp/__main__.py 当前以 stdio 启动，不能据此假定所有客户端/运行方式均已实现可靠会话隔离。
- Untested/Next：按 TC-chat3-018 执行确定性回归及隔离真实宿主/MCP 验证；短编号方案须在实现前核实 FastMCP 与上下文能力。小模型测试按用户要求暂缓。方案未实现。

## DEV-chat4-001：Siril 软件面板三部分优化
- 2026-11-27 09:28 -06:00 · chat4 · FR-chat4-001 / TASK-chat4-001。状态、连接 Siril 和获取 Siril 三部分组织；检测、选择、保存、更改与清除复用现有流程；提供原生文件选择并允许手动输入。移除设置内 Siril 命令目录，保留节点共享命令定义。
- Changed Files：extension/siril/frontend/SirilSettings.tsx、siril.css、locales/zh/siril.json、locales/en/siril.json；删除 extension/siril/frontend/SirilCommands.tsx；新增 frontend/tests/components/SirilSettings.test.ts；更新 frontend/tests/host/siril-host.mjs、siril-presentation.mjs、docs/domains/siril.md；构建 js/main.js、js/assets/main.css；Feature PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification：pnpm frontend typecheck、lint、build 通过；Chromium 定向组件测试 3 passed，覆盖检测选择保存、原生选择器不可用保留手动输入、更改失败保留原配置和草稿。独立 UI 复核：真实 8188 宿主、独立 headless Chromium 542×613；无横向溢出、键盘展开安装说明；通过拦截 API 验证无候选和选择器不可用，未修改用户配置或画布。差异检查通过。
- Untested/Next：真实 Siril CLI 检测与保存、真实原生文件窗口、多候选、浅色/英文及长路径视觉未验证；Siril host 脚本依赖真实 CLI，未执行。本次为前端静态资源构建，用户当前页面需刷新；未重启服务。

## DEV-chat4-002：安装指引展开样式统一
- 2026-11-27 09:33 -06:00 · chat4 · FR-chat4-001 / TASK-chat4-001。用户指出原生展开三角与项目风格不一致；复用 DetailAccordion，并把其样式从设备页面提取为组件直接加载的共享样式，确保首次进入 Siril 设置也生效。既有安装内容和默认折叠不变。
- Changed Files：extension/siril/frontend/SirilSettings.tsx、siril.css；frontend/src/features/library/components/DetailAccordion.tsx、equipment.css；新增 frontend/src/features/library/components/detail-accordion.css；构建 js/main.js、js/assets/main.css；Feature DEV.md、DEV_LOG.md、TEST_PLAN.md。PRD 行为不变。
- Local Verification：pnpm -C frontend typecheck、lint、build 通过；SirilSettings 组件测试 3 passed；git diff --check 通过。独立真实宿主 8188、Chromium 542×613 首次打开 Siril：共享箭头正确加载，鼠标、Enter、Space 展开收起及 aria-expanded 正确，无横向溢出；未修改用户画布或配置。
- Untested/Next：英文和浅色主题未实机复核；当前已打开页面需刷新加载构建资源。

## DEV-chat3-037：实现 MCP 前五类工具优化
- 2026-11-27 09:39 -06:00 · chat3 · FR-chat3-018 / TASK-chat3-018。用户授权实现；按 AGENTS.md 直接替换 MCP 旧参数。八个列表使用短续读，删除使用短确认与明确确认信号，连接选择使用短 selection；保留后端原游标、影响哈希、文件保护及实例校验。补名称/路径与导入说明、字段修改回执、唯一子帧名与歧义保护。现代 stdio 入口使用单客户端进程作用域，传统协议使用 FastMCP 会话状态；缺乏可靠作用域的模式安全拒绝。
- Changed Files（本次实际修改；与工作树既有修改和其他 Chat 共享，非整文件归属）：mcp/src/astrophoto_mcp/api/equipment.py、api/library.py、server.py、target.py、tools/status.py、tools/equipment.py、tools/catalog.py、tools/catalog_client.py、tools/projects.py、tools/continuation.py（新增）、tools/session_state.py（新增）、skills/astrophoto-management/SKILL.md；mcp/tests/test_catalog_tools.py、test_equipment.py、test_equipment_names.py、test_target_discovery.py、test_short_continuation.py（新增）、test_instance_guard.py（新增）、test_project_update_summary.py（新增）；tests/integration/test_unified_asset_removal.py、test_photography_library.py、test_library_mcp.py；docs/api/http/contracts.md、routes.md、docs/api/inventory.json、docs/api/mcp/contracts.md、examples.md、connection.md、equipment.md、equipment_groups.md、library.md、projects.md、canvas.md、workflow.md、node.md、docs/integrations/mcp.md（参考页由脚本生成，部分先前为未跟踪文件）；本 Feature PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification：uv run --package astrophoto-mcp pytest mcp/tests -q --tb=short：115 passed；隔离素材三组集成：44 passed，覆盖真实 modern stdio、确认隔离、影响变化、同名子帧及受管/外部删除；分页专项 12 passed，含八工具及实例替换、项目同名重建；2025 与 2026 stdio 真实宿主 library_list 跨请求续读通过；目标实例选择 14 passed，含模拟 modern stdio；API 清单测试 5 passed；相关 Ruff 通过。直接使用根 .venv 组合运行 MCP 测试首次报 FastMCP server support 导入错误，改用 uv MCP workspace 环境后全套通过。git diff --check 退出码 0，但工作树既有超长路径警告需注明。
- Untested/Next：真实多个 ComfyUI 宿主的选择切换、当前对话 MCP 重连后的新 schema 和用户手验尚未执行；用户要求暂不做小模型测试。真实宿主操作使用只读/隔离数据，未删除用户素材。此次未修改前端或宿主代码，无需重启 ComfyUI；现有 Agent MCP 进程需重连。旧协议状态与现代 stdio 已分别验证，不对匿名 HTTP/无可信作用域宣称支持。

## DEV-chat4-003：Siril Windows 安装发现修复
- 2026-11-27 09:51 -06:00 · chat4 · TASK-chat4-002。Windows 环境变量字典规范化后读取 PATH、PROGRAMFILES、PROGRAMFILES(X86) 与 LOCALAPPDATA，修复标准目录遗漏，保留既有候选验证和用户选择保存流程。
- Changed Files：extension/siril/software.py、tests/backend/test_siril.py；Feature DEV.md、DEV_LOG.md、TEST_PLAN.md。既有产品契约未变，PRD 不变。
- Local Verification：针对环境变量大小写测试 4 passed；ruff 和 git diff --check 通过。完整 tests/backend/test_siril.py 在沙箱执行时前 8 项后长时间无输出，已中断，不能记为通过。按原数据根重启空闲 8188 宿主，状态 ok、实例与数据根不变；真实 discover 返回 C:\Program Files\Siril\bin\siril-cli.exe、1.4.5、ready（含自动拉伸探测），siril.exe 返回 SIRIL_GUI_ONLY。未保存或修改 Siril 配置。
- Untested/Next：完整后端测试未完成，真实前端手动选择保存尚待用户执行；页面可能需重新检测。重启时当前两个活动画布为 solar 且均无未保存标记，队列为空，浏览器页面未被重载。

## DEV-chat4-004：Siril 检测并连接
- 2026-11-27 10:03 -06:00 · chat4 · FR-chat4-001 / TASK-chat4-003。用户要求检测后自动连接；唯一 ready CLI 自动调用既有保存和复验，多个 ready 时选择即连接，过滤 GUI 候选，零可用保留手动输入和说明。失败保留旧配置和路径草稿；不自动安装。
- Changed Files：extension/siril/frontend/SirilSettings.tsx、locales/zh/siril.json、locales/en/siril.json；frontend/tests/components/SirilSettings.test.ts、frontend/tests/host/siril-host.mjs；docs/domains/siril.md；构建 js/main.js、js/assets/main.css；Feature PRD.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。
- Local Verification：frontend typecheck、lint、build、git diff --check 通过；SirilSettings 组件测试 6 passed，覆盖唯一候选自动连接、多个候选、无候选、GUI 过滤及失败保留旧配置和输入。独立 UI 复核真实 8188 宿主、独立 Chromium 542×613，API 拦截模拟单/多候选及失败，未改真实配置；发现候选误显示已连接，修正为可连接并复测通过，键盘可触发，窄侧栏无横向溢出。
- Untested/Next：真实用户点击保存、系统选择窗口及浅色/英文真实视觉尚未验证；host 脚本未运行以避免改变现有 Siril 配置。当前页面需刷新加载静态资源。

## DEV-chat3-038：创建 MCP 工具设计 Skill
- 2026-11-27 10:10 -06:00 · chat3 · TASK-chat3-019，相关 FR-chat3-018。用户确认项目级 Skill 方案并授权实现。将工具任务定位、参数/描述契约、长任务/恢复、小模型适配的设计假设和评估方法沉淀为按需加载的指引；协议、SDK、厂商建议和 AstroPhoto 案例分别标注。资料清单保留 39 个不同链接及查阅日期。
- Changed Files（新增）：.agents/skills/mcp-tool-design/SKILL.md；.agents/skills/mcp-tool-design/references/planning.md、contracts.md、operation.md、evaluation.md、sources.md。Feature 同步修改 DEV.md、DEV_LOG.md、TEST_PLAN.md；核对 PRD 后无产品契约变化，无 MCP 业务代码变更。
- Local Verification：设置 PYTHONUTF8=1 后运行 skill-creator/scripts/quick_validate.py .agents/skills/mcp-tool-design，结果 Skill is valid；检查来源链接数量 39、唯一 39，SKILL.md 指向的 5 个参考文件均存在；安装文件与草稿哈希一致。首次使用系统 Python 默认 GBK 运行验证器出现 UnicodeDecodeError，启用 UTF-8 后重试通过。独立 Agent 对素材查找、分页、影响确认及删除进行只读技能试用，能依据现行代码和需求给出流程，未执行删除或联网；其发现部分失败信息可读性可进一步评估，本任务未修改运行时代码。
- Untested/Next：未执行小模型实测、实际素材删除或 MCP 功能回归；独立试用未核验当前对话连接的实际工具版本。上述为 Skill 局部验证，不代表整个 Feature 正式验收。

### DEV-chat2-001：记录知识库讨论

- Chat / Time: chat2 · 2026-11-27 13:18 -06:00
- Type / Status: 需求方向与方案记录 / 完成；TASK-chat1-002、FR-chat2-001。
- 记录用户明确的知识库职责、未来 `list_node` 边界、图文及视频资料方向；将三阶段流程和工具作为候选，训练与验收保持待决。未修改业务代码，未声明实现或验收。
- Changed Files: `.agents/features/2026-11-25-07-agent-knowledge-software/PRD.md`、`DEV.md`、`DEV_LOG.md`、`TEST_PLAN.md`（均追加 chat2 内容）。
- Local Verification: 写后复读本次记录与共享文件；本次仅文档，无代码测试。
- Untested / Next: 资料授权、清洗与检索质量、视频采样、节点映射、真实工作流和评测均未验证；后续确定产品规则、接口与验收。

### DEV-chat1-002：记录 Pi 联调讨论

- Chat / Time: chat1 · 2026-11-27 13:19 -06:00
- Type / Status: 讨论记录 / 完成；TASK-chat1-001、TC-chat1-001。
- 用户要求按 skill 记录目前内容；记录场景到 Pi 调用、过程与独立结果核对、教程调研和参数示例。各项仍为提案，未确认产品行为或验收标准；PRD 现行契约未改。
- Changed Files: Modified .agents/features/2026-11-25-07-agent-knowledge-software/DEV.md、TEST_PLAN.md、DEV_LOG.md；无业务代码或测试代码变化。
- Local Verification: 写后复读追加内容及检查工作区状态；未执行 Pi、MCP、宿主或正式测试。
- Untested / Next: 确认方案、场景及参数后再设计可执行测试；实际能力及共享接口与 chat3 协调。既有其他 Chat 的工作不归属于本次修改。

## DEV-chat4-005：Siril Feature 状态补充
- 2026-11-27 13:19 -06:00 · chat4 · FR-chat4-001 / TASK-chat4-001～003 / TC-chat4-001～003。按用户要求核对并澄清面板、Windows 自动检测和一键连接的现行状态；不覆盖历史，明确一键连接取代早期逐项选择再保存流程。
- Changed Files：.agents/features/2026-11-25-07-agent-knowledge-software/DEV.md、TEST_PLAN.md、DEV_LOG.md；本次无业务代码改动，PRD 已反映现行决定无需修改。
- Local Verification：复读共享 Feature、现有工作区状态并经独立只读核对；本轮未运行测试，不将旧局部证据等同正式验收。真实 CLI 发现及探测见 DEV-chat4-003，组件与模拟 UI 验证见 DEV-chat4-004。
- Untested/Next：真实前端一键保存、真实节点完整处理、原生文件选择窗口、用户手验、浅色与英文实机视觉，以及中断后的完整 Siril 后端套件仍待验证；不覆盖其他 Chat 正在进行的工作。

## DEV-chat3-039：记录全部 MCP 工具的只读设计审查
- 2026-11-27 13:19 -06:00 · chat3 · TASK-chat3-020；相关 FR-chat3-004/005/006/007/018。用户要求使用 mcp-tool-design 审查全部工具并记录当前内容；按现行 Skill 将流程、参数、描述、长期运行和小模型适配建议写入 TECH.md 的 MCP-REVIEW-chat3-001，均为 Proposed，未升格为新 PRD 或授权实施。
- Changed Files（修改）：.agents/features/2026-11-25-07-agent-knowledge-software/TECH.md、DEV.md、DEV_LOG.md、TEST_PLAN.md。PRD 经核对未变；无 MCP 业务代码、前端、测试代码或长期契约变更。
- Local Verification：前一轮只读读取当前 MCP 8 个分类的 Schema 与源码/清单；调用 connection_status 与 canvas_list_sessions，观察到当时会话旧参数及 3 个同名 solar 页面。复核了现行工具源码、docs/api/inventory.json 与相关 FR。无自动测试或功能写入。
- Untested/Next：审查建议未经产品确认；未重连当前 MCP、未操作画布/导入/删除、未跑功能回归或小模型实测，未完成 Feature 正式验收。后续验证候选见 TC-chat3-020。

### DEV-chat1-003：修复审查问题

- chat1 · 2026-11-27 13:32 -06:00；TASK-chat1-004；实施中，PRD 未变。统一文件夹端口，扩充画布修订指纹，收录复查处理已删除记录，通用 Siril 会话发布产物标识及类型，清除旧来源预览分支并更新测试替身。
- Changed Files：Modified nodes/scientific.py 的类型由 extension/siril/node.py 复用，实际修改 extension/siril/node.py、extension/siril/session.py、extension/siril/frontend/SirilNodes.tsx、frontend/src/host/canvasActions.ts、frontend/tests/components/ScientificNodes.test.ts、astrophoto/assets/library.py、mcp/src/astrophoto_mcp/tools/workflow.py、js/main.js，以及本 Feature 的 DEV.md、TEST_PLAN.md、DEV_LOG.md。nodes/scientific.py 本次未修改。
- Local Verification：pnpm run build 成功；Python compileall 成功。uv pytest 因缓存权限失败；直接调用 .venv pytest 的两组测试未返回完整结果后中断；Vitest 因 Playwright 浏览器缺失未运行。
- Untested / Next：TC-chat1-002 尚需专项自动回归、真实宿主和真实 Siril 验证，重启预览并确认加载。未将此记录视为验收通过。
