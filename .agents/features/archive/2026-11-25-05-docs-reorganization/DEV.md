# 文档重组 — DEV

初始化：chat1 · 2026-11-25T08:05:55-06:00

## 当前状态
- 阶段: V1 基线、遗留清理及 API 参考已交付，RUN-chat1-002 已执行。第二轮复审完成，待处置新发现后验收。
- Updated by: chat2 · 2026-11-25T10:40:03-06:00
- 当前任务: TASK-chat1-003、TASK-chat1-004 已实现。依据 [DEV-chat1-014](DEV_LOG.md#dev-chat1-014) 与 [RUN-chat1-002](TEST_REPORT.md)。
- 接续入口: 本页 TASK-chat1-004、[PRD](PRD.md)、[调查记录](DEV_LOG.md#dev-chat1-013)、[覆盖计划](TEST_PLAN.md#v1-基线与接口验证)。原 RUN-chat1-001 覆盖 FR-chat1-001 的历史范围。
- 审查状态：chat2 · 2026-11-25T10:40:03-06:00。首轮 6 项已修复，本轮 P1、P2 各 1 项待处理。见 [REVIEW-chat2-002](REVIEW.md#review-chat2-002)。
- 审查状态：chat3 · 2026-11-25T10:45:39-06:00。独立复核确认 chat2-002 两项仍存在，另记目录写入版本校验与 `.artifact/` 残留 2 项。见 [TASK-chat3-001](#task-chat3-001--独立代码审查第三轮)。

## 实施策略
依工作树和归档整理领域文档，修复旧路径与内容冲突，保留明确的验证限制；只在发现具体缺陷时调整 Skill。

## TASK-chat1-001
- Created / Updated by: chat1 · 2026-11-25T08:05:55-06:00
- Owner Chat: chat1
- FR/AC: FR-chat1-001 / AC-01–04
- 预计 File Path: docs/**、README.md、AGENTS.md、mcp/README.md、benchmark/README.md、本 Feature 文档。
- Local Verification Plan: 链接、旧路径、Feature 路由及内容自检。
- Status: Implemented; formal verification pending


## TASK-chat1-002 · 代码核验后的文档清理与联调计划

- Created / Updated by: chat1 · 2026-11-25T08:13:12-06:00
- Owner Chat: chat1
- FR/AC: FR-chat1-001 / AC-01–04；用户要求先探寻代码、再制定完整计划。
- 状态: 实现及局部验证进行中；MCP 定向测试已通过；实际 Agent 行为联调本次不执行；内容核验及正式验收待完成。
- 依据: 当前工作树源码、现有测试和 Feature 归档；本次没有执行测试或真实宿主。
- 预计 File Path: docs/**、README.md、AGENTS.md、mcp/README.md、benchmark/README.md；必要时 Feature 文档及 Skill（仅发现实际缺陷时）。

### 分阶段计划

1. 内容清单：逐章节映射现行行为、规划、历史和不可获取证据，逐条对照源码、测试及归档；保留当前约束和历史兼容，确认替代关系。
2. 内容修订：修复素材侧栏、旧集合与兼容接口、设备版本、MCP 权限/发现/Skill、Siril 版本、存储与文件删除差异；更新公开导航及交叉引用。
3. 清理历史：清除仅描述旧工作树或已不可访问证据的冗余章节，保留未覆盖风险与有唯一价值记录；历史文件本身不重写。
4. 对齐运行与发行：核对包配置、构建产物、预览脚本、测试选择器；将历史 PyPI 404 改为历史事实并以当前检查判断发行状态，不虚报实时结论。
5. feature-pipeline 联动：检查导航及引用；用户于本次修订明确实际 Agent 行为联调暂不执行，保留已有静态检查及其限制。
6. 验证：全范围相对路径和锚点、旧路径引用、内容对照与相关定向测试；真实宿主、Desktop、第二物理卷未执行时记录为未覆盖。正式验收按用户后续指令执行。

### 调查事实与未决

- AssetsPanel 当前标签为 allAssets/projects；旧 Calibration Library 独立页面不应作为当前入口。
- MCP disclosure 实现六类和三个发现入口，打包的 astrophoto-management Skill 与 --install-skill 存在。
- EquipmentService 和 OpticalTrainService 的更新、归档/删除使用读取到的当前 row_version；调用方 expected_version 的兼容及各 API 路径需分别核对，内部并发检查仍存在。
- 测试代码含旧版本更新、注销保留文件和 MCP 分类测试；本次未运行。
- 存储文档保留历史矩阵；设备文档保留迁移前章节；架构及发行文档仍有历史审计或过时发行结论，需要重新归类。



## 范围修订

- chat1 · 2026-11-25T08:27:45-06:00：用户明确现在不需要实际 Agent 行为联调；不影响文档内容核验、链接检查及其他定向验证。


## 正式 RUN

- chat1 · 2026-11-25T08:37:59-06:00：RUN-chat1-001 已执行；详见 TEST_REPORT。节点/Siril 专项、第二物理卷、真实 Desktop 与实际 Agent 行为联调按用户决定暂缓。


## TASK-chat1-003 · 构建接口文档

- Created / Updated by: chat1 · 2026-11-25T08:45:50-06:00
- Owner Chat: chat1
- FR/AC: FR-chat1-002 v2 AC-01–05
- 状态: Implemented · chat1 · 2026-11-25T09:37:07-06:00。已按 V1 保留清单交付逐操作 HTTP 与 MCP 参考、实例注册检查及漂移测试。
- 策略: 对照当前路由注册、处理函数、MCP 运行时 Schema 和测试建立清单；按 HTTP/MCP 领域组织，补充权限、副作用、调用链、错误和示例；建立漂移检查并同步导航。
- 预计 File Path: docs/api/**、docs/README.md、AGENTS.md、相关领域及 MCP 文档、tests/packaging/**、本 Feature 文档。
- 验证: 在隔离环境核对路由及 MCP 条件注册、清单漂移、链接和相关测试；不访问用户数据库。
- 既有 RUN: RUN-chat1-001 未覆盖新 FR，保留原结论并需增量验证。

- chat1 · 2026-11-25T08:51:51-06:00 · TASK-chat1-003：接口清单和 MCP Schema 初版完成，HTTP 逐项契约和逐工具错误/示例仍待补齐，见 DEV-chat1-011。

## TASK-chat1-004 · 收敛 v1 基线与接口

- Created / Updated by: chat1 · 2026-11-25T09:10:00-06:00
- Owner Chat: chat1
- FR/AC: FR-chat1-003 AC-01–03、FR-chat1-002 v2 AC-01–05
- 状态: Implemented · chat1 · 2026-11-25T09:37:07-06:00。处置清单及正式复验见 DEV-chat1-014 和 RUN-chat1-002。
- 预计范围: 数据库初始化、Alembic 基线和发行校验，素材/设备/项目 HTTP、前端及 MCP 调用、相关测试和 docs/api。实施前核对最新工作树及现有未提交变更。

### 实施顺序

1. 确定 v1 保留清单，标明现行调用、维护接口、纯开发期遗留、已退役和暂缓专项。逐项核实拍摄会话、独立资产列表/可用性查询，以及缓存、位置验证/重定位和单独卷额度等未见当前界面调用的维护接口。保留存储初始化检查、搬迁预检和现行故障恢复语义。
2. 建立空 Data Root 可初始化的 v1 基线。拟将当前最终 DDL 收敛为首版迁移，同步数据库管理器、测试和发行脚本的旧文件路径断言。独立验证对旧库的明确拒绝和数据保留。
3. 优先处理四条旧 Agent 导入审批路由，再成组核对旧暂存上传的路由、uploads 字段、暂存文件读取和恢复分支。去掉仅兼容旧库的单独校准记录回退前，先覆盖正常主帧的查询、编辑、绑定和项目引用。无类型导入回退和重复元数据适配须在浏览器及 MCP 当前读写完成收敛后移除。
4. 同步收敛前端、HTTP、MCP 及测试中的无效参数。区分项目旧确认令牌与影响数量，以及设备 expected_version 与服务端实际并发检查。检查保留的文件所有权规则和 v1 在途任务恢复。
5. 重新生成注册表、Schema 和生成页，修正 /assets 整组标作 legacy-assets 及自动模式采样受 COMFYUI_URL 影响的问题。核对实际 HTTP 注册和 Bundle 条件，再补逐 HTTP 接口及逐 MCP 工具的入参、结果、错误、副作用、调用链和隔离示例，迁移重复的领域及集成表格。
6. 执行新范围的验证并记录实际 RUN。旧 RUN 和调查复验保留各自范围。节点/Siril 专项、实际 Agent 行为联调、真实 Desktop 和第二物理卷继续暂缓。


### V1 处置清单

chat1 · 2026-11-25T09:35:22-06:00 · TASK-chat1-004。用户批准实施，前序调查见 DEV-chat1-013。

| 对象 | 处置和核查证据 |
| --- | --- |
| 0001–0011 开发期数据库 | 合并为 0001_v1_baseline 首建。开发库由只读版本探测拒绝，不打开写连接。隔离夹具核验旧库、WAL/SHM 和外部原件前后内容。未登记的数据根仍受协调检查保护。 |
| /library/import-requests、/library/approvals | 最新 Agent 归档改为本机直连且不使用聊天审批。退役旧路由、状态和界面遗留，保留 catalog-import 与浏览器确认。 |
| /library/uploads、assets/import 的 uploads | 当前前端使用直传作业与成员作为恢复依据，MCP 使用宿主路径。退役无调用的旧上传实现，保留现行任务、预检及已发布成果。 |
| /library/sessions、/assets/<built-in function id>/sessions、GET /assets、GET /assets/<built-in function id>/availability | 拍摄会话归规划，移除存储模型和入口。目录列表和 library/assets 已提供素材记录与可用性，将 library 路由改为显式注册。 |
| 旧孤立校准主帧、目录映射与导入布局 | 移除旧主帧聚合、编辑补建、项目回退和旧布局标识。现行校准物料配套写入图像结果与校准记录。当前低层路径/直传仍支持文件登记属性输入，无旧库迁移依赖。 |
| 设备/组合 expected_version、项目删除确认及令牌 | 入口、MCP 和前端同步移除。设备保留内部并发检查，项目影响查询返回当前数量。 |
| 缓存、位置验证/重定位、卷额度、整库搬迁 | 代码与存储测试明确提供维护用途，列入 V1 API。保留独立的受管文件删除及工作区归属校验。 |
| 节点、Siril 与已收录正式产物 | 保留当前跨域使用的登记接口和工作流契约，专项暂缓。 |

## TASK-chat2-001 · 独立代码审查

- Created / Updated by：chat2 · 2026-11-25T10:19:29-06:00。
- Owner Chat / 角色：chat2 / Code Reviewer。
- 关联实施：chat1 的 TASK-chat1-001、TASK-chat1-002、TASK-chat1-003、TASK-chat1-004。
- FR/AC：FR-chat1-001 v3 AC-01–04、FR-chat1-002 v2 AC-01–05、FR-chat1-003 v2 AC-01–04。
- 范围：导航和文档引用、HTTP/MCP 契约、V1 启动与旧接口退役、相关调用方与回归检查。
- 状态：chat2 · 2026-11-25T10:40:03-06:00。已完成对 TASK-chat1-005 的独立复审。首轮见 [REVIEW-chat2-001](REVIEW.md#review-chat2-001)，当前结论见 [REVIEW-chat2-002](REVIEW.md#review-chat2-002)。

## TASK-chat1-005 · 修复 chat2 审查发现

- Created / Updated by、Owner：chat1 · 2026-11-25T10:22:40-06:00。
- 依据：[REVIEW-chat2-001](REVIEW.md#review-chat2-001) 的 001–006，FR-chat1-001 v3 AC-04、FR-chat1-002 v2 AC-02/04、FR-chat1-003 v2 AC-01–03。
- 状态：Implemented · chat1 · 2026-11-25T10:30:16-06:00。六项发现的处置和局部验证见 [DEV-chat1-015](DEV_LOG.md#dev-chat1-015)。chat2 于 2026-11-25T10:40:03-06:00 核实该任务对应的六项修复，见 [第二轮复审](REVIEW.md#review-chat2-002)。
- 范围：SQLite 首启/重启探测、受管文件删除及浏览器调用、Ruff 错误、HTTP/MCP 参考及示例、活动 Feature 导航与对应回归测试。

## TASK-chat3-001 · 独立代码审查（第三轮）

- Created / Updated by、Owner：chat3 · 2026-11-25T10:45:39-06:00。
- Owner Chat / 角色：chat3 / Code Reviewer（未参与实现）。
- 关联实施：chat1 的 TASK-chat1-001 至 TASK-chat1-005。
- FR/AC：FR-chat1-001 v3 AC-01–04、FR-chat1-002 v2 AC-01–05、FR-chat1-003 v2 AC-01–04。
- 范围：docs 导航与链接、HTTP/MCP 参考、V1 启动与旧接口退役、相关调用方与回归检查。
- 状态：chat3 · 2026-11-25T10:45:39-06:00。首轮 6 项独立复核为已修复；chat2-002 两项仍存在；新增 `REVIEW-chat3-001-001`（P1，目录写入 `revision` 无校验）与 `REVIEW-chat3-001-002`（P3，`.artifact/` 残留）。见 [REVIEW-chat3-001](REVIEW.md#review-chat3-001)。
- 待补回归见 [TEST_PLAN](TEST_PLAN.md#review-chat3-001-覆盖缺口)；本轮未修改业务代码。

## TASK-chat1-006 · 修复第二、三轮审查发现

- Created / Updated / Owner：chat1 · 2026-11-25T10:53:08-06:00。
- 依据：REVIEW-chat2-002-001/002、REVIEW-chat3-001-001/002，FR-chat1-001 v3 AC-04、FR-chat1-002 v2 AC-02/04、FR-chat1-003 v2 AC-01–03。
- 状态：Implemented · chat1 · 2026-11-25T11:06:19-06:00。实现及局部验证见 [DEV-chat1-016](DEV_LOG.md#dev-chat1-016)，待独立复审与正式 RUN。
- 需求更新：用户明确开发期数据库及原内容无需迁移或保护，适用 FR-chat1-003 v3 AC-01。现行 V1 文件操作及恢复范围继续适用。
