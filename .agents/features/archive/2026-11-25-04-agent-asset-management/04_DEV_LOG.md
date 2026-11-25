# 开发记录

## DEV-001 · 本机直连与业务规则（进行中）

- 关联：FR-02、FR-03，AC-05 至 AC-17。
- 已按用户确认更新 PRD；新增 TECH 草案。工作树开始移除设备及素材库 MCP token 依赖，设备删除解除当前设备关联并保留快照，素材注销清理项目引用和校准绑定；项目删除不再要求影响确认，部分设备和目录写入不再拒绝旧版本。
- 局部验证：`tests/backend/test_equipment_simple.py tests/backend/test_agent_direct_rules.py` 7 passed；无 token MCP 到 HTTP 集成 1 passed；三个设备/素材注销 HTTP 用例 3 passed；`tests/integration/test_library_mcp.py` 2 passed；改动文件 Ruff 通过。
- 扩大回归：`tests/integration/test_photography_library.py` 23 passed、7 failed；精简输出显示这些失败与此前的冲突、引用或确认预期不符，但仍需逐项修改测试并验证剩余行为，不能视为回归通过。首次 `uv run` 因沙箱缓存写入拒绝而失败，改用项目 `.venv`；HTTP 测试在沙箱外隔离临时目录执行。
- 未完成：自动发现及重连、多实例选择和任务目标绑定；Storage 删除及外置受管文件验证；其余版本和引用检查与前端交互；现有 MCP/后端测试及文档同步；完整回归。当前实现不完整，勿当成交付。
- 未执行：真实 stdio、双物理盘、真实界面操作、Computer Use、真实 Agent 联调。

## DEV-002 · 本机直连与业务规则续做

- 关联：FR-02、FR-03；延续 DEV-001。按用户确认排除真实 stdio、双物理盘、真实界面操作、Computer Use，本轮不开展业务 Skill 或真实 Agent 联调。
- 本机业务工具去除 token 与聊天审批，设备/组合删除解除当前引用并保留历史快照；素材注销解除项目引用及校准绑定，项目删除无需影响确认；设备及目录按已提交字段更新。新增受管文件删除工具，外部引用文件保留；前端删除流程去除旧阻断及确认。
- MCP 默认发现 Desktop 端口锁提示与 8000/8188，HTTP 验证扩展和数据根；支持显式地址优先、多实例选择、按工具调用固定目标以及当前 MCP 进程内的导入任务来源绑定。端口锁仅作为候选提示，未校验 PID；任务来源映射在进程重启后不可恢复。
- 本地回归：素材库 32 passed；设备 API、素材 MCP 和设备规则合计 15 passed；存储 46 passed、2 skipped；MCP 排除 stdio 77 passed、6 deselected；前端两个组件测试 64 passed；vue-tsc、Vite build、Ruff 通过。最初 7 个素材库失败用例已修正并通过后续素材库回归。
- 前端全量 lint 未通过：未修改的 CatalogEditor.vue 有 8 处 no-explicit-any、ImportAssets.vue 有 1 处 prefer-const；本轮涉及的 Vue 文件单独 lint 通过。TSX 单独 lint 遇到现有配置解析问题，vue-tsc 和组件测试通过。
- 排除项未执行；Desktop 自动发现、跨平台端口锁和真实 Agent 未实测。`.agents/handoff` 处于工作区既有删除状态，未恢复或覆盖，无法原位同步。历史设备 host 脚本仍按旧的引用阻断规则设计，已在开发文档标明不可用于当前验收。

## DEV-003 · 修复端口归属、任务恢复和前端 lint

- 对应 FR-03、AC-08–10。Desktop 锁文件的 PID 必须拥有候选监听端口。自动连接继续通过状态 API 核对扩展，并以持久存储实例 ID 区分复用地址或数据路径的实例。
- 自动模式将任务来源保存到 MCP 本地 SQLite。重新启动 MCP 后可查询已记录的任务。如果原地址失效，只有唯一匹配原存储实例 ID 的地址可接续查询。升级前未保存来源的任务没有恢复记录。
- 素材编辑使用明确的记录类型，导入预检变量改为 const。全量前端 lint、类型检查和生产构建通过，隔离组件 64 项通过。MCP 80 项通过、6 项真实 stdio 排除，状态 HTTP 2 项通过。Ruff、依赖锁检查和变更空白检查通过。
- 真实 Desktop、真实 stdio、双物理盘、真实界面操作和 Computer Use 未执行。既有交接目录删除状态仍待处理。

## DEV-004 · 产品 Skill 打包与本地安装

- 实现 `astrophoto-management`，涵盖素材导入、校准、设备与设备组合、项目组织及受管文件删除。FastMCP 将包内 Skill 提供为资源和 Skills 扩展。命令 `astrophoto-mcp --install-skill <skills父目录>` 支持写入本地客户端目录。
- 使用 uv 离线构建 wheel 和 sdist，从本地 wheel 安装到独立 Python 3.12.16 环境。验证 CLI 导出、重复安装保留已有内容、进程内 Skills 扩展发现和 legacy 资源读取。读取内容与导出文件一致。
- Skill 结构校验、Ruff、MCP 81 项和发行清单 8 项通过，6 项 stdio 用例排除。首次发行检查发现 Registry 清单仍要求已移除的 Agent 导入模块，改为核对现行目录与素材模块后全部通过。
- 产物位于 `.artifact/astrophoto-management-dist`，本地安装样本位于 `.artifact/astrophoto-management-installed-skills`。真实 Agent 联调、真实 stdio、双物理盘、真实界面操作和 Computer Use 按本轮范围排除。

### DEV-004 验证证据补录

- 安装环境位于 `.artifact/astrophoto-management-install`，使用 Windows CPython 3.12.16、FastMCP 4.2.0 和本地 `astrophoto-mcp 0.0.1` wheel。通过 `astrophoto-mcp --install-skill` 生成安装样本。通过进程内客户端调用 `list_skills`、`read_skill` 及 legacy `read_resource`，核对 `skill://astrophoto-management/SKILL.md`。
- 补录时重新核对源码、wheel 内文件、sdist 内文件和本地安装样本，四者字节一致。当前工作树产物的 SHA-256 如下。

| 文件 | SHA-256 |
| --- | --- |
| `astrophoto_mcp-0.0.1-py3-none-any.whl` | `976884b4bffb0f05f7381ce8da7f70c4078d422b596605ffd046b49b1251525a` |
| `astrophoto_mcp-0.0.1.tar.gz` | `ca6c06b90554cf97be5cdafd21440198fcc5aa5016aca10297c8acf51f9e10a3` |
| `SKILL.md` | `1f883e37a5b5336782a0873b39d4b6bef52be1afa4a093572f91a5c4a1a91625` |

- 回归入口为 `python -m pytest mcp/tests -q -k "not stdio"` 和 `python -m pytest tests/packaging/test_contents.py -q`。此前执行结果见 DEV-004。此次仅复核产物和文档。PRD 的本地安装与发现要求已核对，目标客户端的激活、操作执行和业务结果回读仍待 FR-01 联调验证。


## DEV-005 独立审查修复

按确认的七项审查结论实施。显式选择绑定存储实例 ID，设备和组合编辑提交变动字段，项目删除返回事务计数，重复删除组合返回 TRAIN_NOT_FOUND，历史详情保留滤镜快照展示，素材集成测试验证帧类型与来源解绑，恢复交接与历史归档并同步 MCP 两层快照。PRD 的 AC-15、AC-16 与 FR-03 已核对。

本机发现回归 10 通过。真实 Agent、真实 stdio、双物理盘、真实界面和 Computer Use 排除。

扩大回归首轮 44 通过、1 失败。归档相机用例仍将省略相机字段视为清除关联，改用显式 null 后该设备测试文件 2 通过。设备组合及素材 MCP 的最终相关用例 5 通过，涵盖重复删除及 reference/copy。MCP 全套范围内 81 通过、6 排除，含端口互换、离线及恢复的写请求。前端全套 134 通过，构建、类型检查、lint 和本轮 Python Ruff 检查通过。交接入口和历史索引存在，归档与交接目录无残余跟踪文件删除。

补充复测。新增滤镜历史快照断言后，素材和设备两组前端测试共 65 通过。


## DEV-006 第二轮独立审查修复

关联 FR-02、FR-03 及 AC-06、AC-07–11、AC-15–16。PRD 的字段更新、历史快照、项目删除和连接状态条款已核对。

- 素材编辑用表单初始值识别组合和滤镜改动。MCP 仅发送显式字段，目录 PATCH 在写事务内按当前组合验证滤镜，保留未修改的组合及其快照。
- 新建和转换校准主帧继承相机快照并校验当前关联。导入最终登记时再次核对相机，避免恢复排队时已删除的关联。校准比较用拍摄快照保留已知的相机和滤镜匹配或差异。
- 项目预览返回无需确认和影响数量，删除回执继续报告事务计数。自动连接诊断分别报告扩展可用性和当前目标状态。同步 MCP、需求文档和两层交接快照。

验证按确认顺序执行。素材绑定的前端专项 2 通过，进程内 FastMCP 的 reference 与 copy 集成 2 通过。集成初跑发现测试夹具读取公开响应未返回的 reference，改用事务前已解析的 HTTP 路由后复测通过。设备历史及主帧专项 4 通过，项目预览专项 1 通过，连接诊断专项 23 通过、2 排除。扩大回归为后端与 HTTP 66 通过、MCP 82 通过及 6 排除、无头前端 135 通过。构建、类型检查、前端 lint、本轮 Ruff 和差异空白检查通过。

验证范围为隔离后端、回环 HTTP、进程内 FastMCP、模拟宿主和无头组件。真实 Agent 联调、真实 stdio、双物理盘、真实界面操作和 Computer Use 均排除。

## DEV-007 · MCP 工具按类别披露

- 关联 FR-04，延续 DEV-006。新增英文 server instructions、六类目录及代理，保留已知名称的直接调用；更新业务 Skill、MCP 文档及自动测试。
- FastMCP 4.2.0 不支持 server-level transform 与 SkillsExtension 共同发现 Skill，改为 local_provider 级 transform；技能发现回归已覆盖。目标中间件跳过发现与代理外层，内部真实工具调用保留目标与任务来源逻辑。
- 局部验证：MCP 全套 95 项通过（包含真实 stdio），素材 MCP HTTP 集成 2 项通过；Ruff 通过。真实 stdio 自动发现预览宿主 ready，代理读取设备 42、素材 33、项目 2。旧 CLI 测试预期已按当前工厂处理地址的分工修正。
- 待验：真实 Codex 新会话是否注入 instructions 及使用分类代理；其他客户端行为、正式验收与独立审查。

- 补充验证：分类专项 8 项通过，覆盖手动连接 JSON 文本结果及参数错误经代理传播；真实 stdio 初始化说明专项 15 项通过。

### DEV-007 补充：当前 Codex 会话检查

- 当前会话工具描述包含英文 server instructions，并仅暴露 list_tool_categories、list_category_tools、call_tool；实际列出六类，equipment、library、projects 分类定义均可读取。该观察说明内容到达本会话工具描述，不推断其他客户端行为。
- 通过代理查询 connection_status 返回 auto / no_candidates，reachable=false；equipment_list、library_list、project_list 均返回 COMFYUI_NOT_FOUND。当前会话中业务数据查询未成功，待宿主恢复后复验。此前独立 stdio 连接预览宿主读取 42 件设备、33 项素材和 2 个项目的结果仍是独立客户端证据，不等同当前会话成功。
- 本次为记录和只读检查，未改代码；独立审查与正式验收未执行。

## DEV-008 · Pi 自然语言只读联调

关联 FR-01 / AC-01–03 与 FR-04。PRD 已核对，既有要求覆盖本次工作，无需修改。新增 `scripts/pi_astrophoto_smoke.py`：检查 Pi、8188 宿主和独立 stdio MCP，保留基线；启动使用 direct 披露的 Pi 会话，通过自然语言查询设备、素材和项目，保存可读对话、原始会话、事件、调用与结果。禁用 Skill 和普通内置工具，因此不宣称 Skill 已激活；`review_required` 要求人工核对，不是正式验收通过。

2026-11-24，Pi 1.6.0、opencode-go/deepseek-v4.1-flash、thinking low；隔离预览宿主 `astrophoto-train-v3`。首次运行在宿主启动前返回连接拒绝。宿主就绪后两次真实会话均完成三类调用；第一轮尝试读取临时文件时资源工具报错，第二轮调用无工具错误。第二轮独立 MCP 基线为 42 设备、33 素材、2 项目；Pi 总数一致，但将主光学 6 件写为 7、滤镜 23 件写为 22，回答未完全通过人工核对。证据为 `.artifact/pi-astrophoto-smoke/20261124T223120Z-950ed0ff/`。脚本 Ruff 通过。仅覆盖只读试运行；真实 Skill 激活、写入链路、正式验收及独立审查仍未执行。


## DEV-009 第三轮审查修复

校对 FR-02、FR-03、FR-04 与现有验收条件。CI 安装探针验证三个分类入口并实际调用 version。自动发现先验证 Desktop，再回退常用端口，并剔除设备或素材不可用的候选。自动目标的业务请求携带存储实例 ID，由扩展在调用处理器前校验。导入发布时清除已删除的滤镜关联并保留历史快照。受管文件删除按正式输出登记核对所有权，保留素材记录与同目录清单。恢复交接入口和两层快照，更新 MCP 连接文档。

回归结果为 MCP 92 通过、6 排除、回环 HTTP 58 通过、打包 10 通过。wheel 与 sdist 离线构建通过，wheel 安装到隔离目录后以进程内传输执行 CI 探针断言及版本调用。此项覆盖工具契约，真实 stdio 安装握手和线上 CI 待验证。本轮 Ruff 和差异空白检查通过。

## DEV-chat1-001 · 正式验收与外置工作区测试

Chat 为 chat1，记录时间 2026-11-25T07:43:47-06:00。对应 TASK-chat1-001、FR-01 至 FR-04。核对当前 PRD，产品契约未改。本 Chat 补充以下实际文件。

- 修改 `tests/integration/test_photography_library.py`，参数化验证内部与外置的受管目录，保留正式输出清单和外部原始文件。
- 新增 `.artifact/feature_acceptance_agent.py` 并保留 Pi 与 HTTP 原始日志，核验后的脱敏摘要和可复跑脚本随正式验收归档。
- 新增本 Feature 下的 `DEV.md`、`06_TEST_REPORT.md`、`07_CLOSE.md` 和 `assets/test-runs/RUN-chat1-001/` 下的基线、复测哈希、两份 Python 测试日志、Agent 摘要及脚本。修改 `04_DEV_LOG.md`、`05_TEST_PLAN.md`、`00_FEATURE_INDEX.md`。
- 执行结果、初次失败和未覆盖场景见 RUN-chat1-001。无业务代码改动。

## DEV-chat1-002 · 确认关闭并归档

Chat 为 chat1，时间 2026-11-25T07:44:56-06:00。用户接受 Desktop 实机和第二物理卷缺口，确认关闭并选择 K-chat1-001 与 K-chat1-002。未改变产品契约。

- 修改 `docs/mcp.md`、`docs/development.md`，纳入已验证的 Pi 联调步骤及宿主验收边界。
- 修改 `00_FEATURE_INDEX.md`、`DEV.md`、`06_TEST_REPORT.md`、`07_CLOSE.md`、`04_DEV_LOG.md`，记录决策及证据。更新 `01_PRD.md` 在归档目录下的历史相对链接。
- 将本 Feature 文档与证据移至 `.agents/features/archive/2026-11-25-04-agent-asset-management/`。知识来源和正式测试事实见 RUN-chat1-001。

chat1 于 2026-11-25T07:45:30-06:00 核对归档。修改索引、PRD、TECH 与 TEST_PLAN 状态说明，保留旧需求和测试证据。
