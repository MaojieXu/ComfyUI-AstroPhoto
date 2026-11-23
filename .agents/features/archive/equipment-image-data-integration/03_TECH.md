# 设备、素材、存储与 MCP 技术交接

现有实现以前一轮审查基线为依据，新增产品要求见 PRD v0.19。以下记录当前工作树的实现边界与兼容要求。仓库级的启动、配置与安全边界见[架构](../../../../docs/architecture.md)、[本地存储](../../../../docs/local-storage.md)、[设备](../../../../docs/equipment.md)和 [MCP](../../../../docs/mcp.md)。

| 领域 | 当前设计和代码入口 | 审查所需的约束 |
| --- | --- | --- |
| 宿主与数据根 | [V3 入口](../../../../__init__.py) 在 on_load 装载业务服务并注册公开路由。[存储运行时](../../../../astrophoto/storage/runtime.py) 协调工作区、容量、任务和数据库。 | 初始化发生在宿主加载时。业务根与 ComfyUI 输入、输出、临时、用户目录分别解析。存储与数据库错误可诊断，已有文件受保护。 |
| 设备及组合 | 设置页通过 API 调用 [设备领域](../../../../astrophoto/equipment) 和 SQLite；组合保存和历史读取使用稳定 ID。 | 审查版本冲突、归档引用保护、旧记录兼容及组合删除的现状差异。AC-03、Q-02 保留。 |
| 素材及项目 | [素材库](../../../../astrophoto/assets/library.py) 管理 Asset、位置、属性和项目关联。项目树的目录和放置由库内关系表达。 [素材侧栏](../../../../frontend/src/features/assets) 依公开 API 编辑。 | 虚拟移动保留素材文件。引用登记保存外部路径，复制登记保存工作区 ID 与相对路径。复核版本冲突、失效引用和科学文件字节。 |
| 工作区与迁移 | [位置管理](../../../../astrophoto/storage/locations.py)、[迁移](../../../../astrophoto/storage/migration.py) 和 [容量管理](../../../../astrophoto/storage/capacity.py) 协调目标选择、校验、路径登记切换和清理。 | 最后一个位置受保护。已有目标文件不得被覆盖。提交前维持原登记可读，提交后按可验证回执恢复剩余清理。外部引用和未登记文件保留。 |
| 数据库迁移 | [管理器](../../../../astrophoto/database/manager.py) 校验实例身份与 schema，并负责 Alembic 迁移。版本链为 0001 设备、0002 摄影素材库、0003 子帧成员、0004 组合删除标记。SQLite 业务库为 database/assets.db。 | 受支持版本原 ID 与关系可回读。0003 增加 asset_import_frames 与组索引，已有文件按原位置解析。异常库及未知版本按错误策略处理。 |
| 宿主提醒与任务 | [通知适配](../../../../frontend/src/host/notify.ts) 复用宿主通道。[任务面板](../../../../frontend/src/features/tasks) 通过 GET /astrophoto/v1/storage/operations 读取活动任务和最近终态。 | 任务 ID 关联进度、详情和去重通知。会话级折叠与清除独立于持久回执。迁移按对象组、导入按文件计数。 |
| 独立 MCP | [Server 工厂](../../../../mcp/src/astrophoto_mcp/server.py) 按本机 URL 和各域令牌注册工具。独立进程通过公开 HTTP 访问扩展。 | 设备与组合查询和写入使用独立授权。分组提案的决定需要专用审批凭据，并通过受信的聊天确认取得。素材旧提案保留单次结果查询。随工作树核对旧 MCP 初始化工具移除与宿主 on_load 的兼容及打包。 |

## 子帧分组与多盘直写

对应 AC-28、DEV-113、TC-113。浏览器传输代码位于 [directTransfer.ts](../../../../frontend/src/features/assets/directTransfer.ts)，依次调用 [直传 HTTP 路由](../../../../astrophoto/api/direct_import.py)、[导入服务](../../../../astrophoto/assets/direct_import.py)和[分配器](../../../../astrophoto/storage/import_planner.py)。

### 数据与协议

一个逻辑导入组包含独立 Asset，每条组成员记录保存组 ID、素材 ID 和选择顺序。沿用 AssetLocation 的工作区 ID 与相对路径，组中成员可以位于不同工作区。组中的原文件名可以重复，发布路径必须唯一。单个文件发布与资产、属性、项目关系、组成员和完成回执在同一个数据库提交边界完成。已有素材沿用原相对路径和 ID。

浏览器复制入口先向后端提交有顺序的文件清单、大小、分类、项目、配置版本及用户选择的工作区。预检只计算分配。确认时用幂等键建立可查询任务和独立条目。每次上传只处理一个指定条目，服务端从持久计划解析路径和大小，同卷暂存后发布。逐帧结果支持部分失败、取消、重试及请求重放。引用、旧路径调用和 MCP 提案继续走已有业务入口。

### 调度

默认整批选择一个可写且有足够空间的位置。并行模式按物理盘归并写入队列，位置和卷分别核对空间与预留；优先按待写字节平衡分配。拓扑不明时保守串行。动态变更目标只能使用经用户选定、重新通过容量检查的位置，并在传输与发布前确定。已发布或等待核实发布的条目继续按原位置恢复。单盘的多个目录不代表多盘带宽。

### 风险和验证

需要对源读取速度、真实 SSD 拓扑、浏览器请求及 SQLite 写入开销分别取证。TC-113 的三组对照使用同一批原文件。测试数据库和测试目录与用户数据隔离。现阶段设计不承诺固定加速倍数。

## MCP 待批提案有效期

提案持久保存 UTC 到期时间。创建时只统计未到期的待批提案，仍限制同时待批最多 100 条。待批提案 24 小时到期并返回 expired，旧版没有到期字段的待批提案同样返回 expired。已应用、已拒绝和正在应用的回执沿用原状态。到期提案保持可查询，决策入口拒绝应用。Q-03 的混合分组提案单独沿用 30 分钟的导入预检有效期。决定和回执按组保存。

## 直传暂停与写入恢复（REVIEW-001）

没有运行中的上传时，未完成直传返回 paused，原任务及条目仍可续传。上传期间使用工作区租约，持久写入意图用于保护尚待回收的字节。确定性发布失败时仅移除能归属本次写入的暂存和未登记副本。宿主启动后核对残存意图、文件身份及取消记录；没有可恢复字节时，后续上传重新暂存。已占用的数据库路径在发布前返回冲突，无关文件和已登记资产保留。目标位置被移除时返回 DIRECT_IMPORT_REPLAN_REQUIRED。任务列表合并全部活动任务与最近 16 项暂停或终态任务，并保留最多 100 条逐帧错误。

## Q-01～Q-03 实施设计

- Q-01 复用原设备与组合 HTTP 路由与版本。查询保留既有只读凭据，MCP 写入使用独立设备写入凭据并限可信回环。创建、修改、归档、恢复与受保护删除经过同一业务服务。MCP 删除还需要独立的用户确认权限，由受信聊天客户端通过原生确认取得。
- Q-02 在现有设备组合记录上保存删除标记与时间，保留 ID、草稿、历史及素材关联。活动列表、归档列表和新关联排除已删除组合，历史按 ID 查回。归档继续占用名称，可恢复。组合删除释放名称并禁止恢复及编辑，沿用 SQLite 写事务保护名称检查。迁移保留现有版本、引用和数据。
- Q-03 在可信回环提供 POST /library/agent-imports/plan，接收明确选取的路径清单，每项可附项目/类别、设备名/组合名以及已有校准主帧 ID。宿主复用路径授权与文件预检，读取 FITS 头作为候选证据。设备精确规范化名称匹配或经用户选择稳定 ID，存在歧义、缺失或冲突时输出需确认项。校准场复用已登记主帧及现有相机、增益、偏置、binning、曝光、温度、光路和滤镜差异规则，逐项输出匹配依据。全部共享项目、设备/组合、分类、滤镜、校准候选与执行策略的条目才同组，组内保留输入顺序；不明确项独立暂停。
- POST /library/agent-imports 以服务端预检生成的不可变组创建持久提案。GET /library/agent-imports/{id} 供聊天显示组范围、实际目标、绑定和回执。POST /library/agent-imports/{id}/decision 使用专用审批凭据，核对提案 ID、摘要、有效期和决定，并拒绝重放引起的重复执行。普通素材令牌不能提交决定。聊天中逐组调用 MCP 原生 elicitation，经显式配置的受信聊天客户端呈现确认。用户拒绝时返回终态，取消保留待定；客户端未声明支持或缺少独立批准凭据时保留提案并说明。秘密只在服务进程间使用。Legacy 协议由 Context.elicit 返回用户决定，现代协议由 InputRequiredResult 请求原生确认，并以 SDK 封存的 request_state 绑定当次范围。信任边界是经过本机显式启用、由用户控制且真实呈现确认交互的客户端。
- 执行以不可变组为单位。复用导入预检及作业幂等键，导入阶段先写文件、基础属性和项目关系。设备与校准绑定从已成功登记的素材 ID 执行，各素材在独立数据库事务内应用完整绑定，失败保留已导入素材和回执。POST /library/agent-imports/{id}/retry-bindings 仅处理已批准组的尚未成功绑定，不重跑已完成导入、不修改原批准参数。优先复用现有关系校验。目标版本在启动前变化时报 `import_failed` 并标记 `requires_new_approval`；导入完成后的绑定期变化记为 `binding_failed`，同样标记该字段，重试入口保留，用户可手动绑定或重新提案。所有接口经同一公开 HTTP 层连接独立 MCP。

## 复审修复后的执行、重试与摘要契约（DEV-118）

对应最新整体复审 N-01～N-08 与用户确认口径。基线 `1772bd5`，代码范围以 DEV-118 为准。

- **分组失败帧重试**：已批准分组的 `retry-remaining` 作业在计划中保存 `agent_approval_id`，并在逐帧回执中继续累积素材 ID。作业完成后与原作业一样进入绑定流程；组状态合并原作业与重试作业的回执，按组内条目“每帧只计一次”推导未完成数，避免历史失败被重复累计。绑定重试与启动恢复遍历同一关联集合。无该关联的普通导入不受影响。
- **校准差异确认**：显式提供 `master_ids` 时，主帧与素材的差异和缺失字段不再阻止提案，而是按主帧分别写入 `calibration.differences = {conflicts, unknown}`，随不可变组一起冻结并在聊天确认中展示；用户批准即等同既有素材库的 `confirmed` 语义，绑定以 `confirmed=true` 写入。自动匹配仍只接受无差异候选；同类型多候选仍报歧义。`CALIBRATION_MATCH_UNRESOLVED` 不再由该路径产生。
- **组合匹配**：组合保存字段为空记“缺项”，字段非空且与 FITS/显式证据不一致记“冲突”。显式给出组合 ID 或名称时不因缺项丢弃该选择，缺项写入 `configuration_gaps` 并在摘要中展示；仅推导且候选只有缺项时报 `MATCH_INCOMPLETE`，仅冲突时报 `MATCH_CONFLICT`；没有组合或主镜线索时只绑定相机。
- **启动失败**：容量与可用性错误（`STORAGE_BUSY`、`WORKSPACE_OFFLINE`、`*_QUOTA_EXCEEDED`、`INSUFFICIENT_DISK_SPACE`、`STORAGE_PATH_UNWRITABLE`）及取容量时的 `OSError` 记为可重试，批准保持 `approved` 并返回 `{"retryable": true}`；`retry-bindings` 在该状态重新触发启动。来源变化、目标版本变化等确定性错误仍为 `import_failed`。
- **直传取消**：取消逐条目独立回收；目标位置已移除时清除写入意图并继续。作业最终收敛为 `cancelled` 并保留逐帧错误，不再因单个位置缺失整批中止。
- **组合删除**：版本不符统一返回 `REVISION_CONFLICT`；已删除记录的重放校验删除时版本，陈旧版本仍报冲突。
- **MCP 错误面**：只透传长度与字符受限、且不含任何凭据的 `details.fields`（例如 `name=duplicate`），其余明细与路径继续隐藏。
- **依赖**：MCP 包显式声明 `mcp-types>=2.3,<3`，与 `fastmcp` 使用的协议包一致。

## 已确认口径：绑定期版本变化与已登记同源（SPEC-001 C、Q-04 A）

2026-11-22 用户确认：SPEC-001 选 **C**（保留重试，状态标记 `requires_new_approval`），Q-04 选 **A**（维持 `partial`，返回跳过明细）。两处原先只有一句总述（“版本或目标变化需重新提案确认”“重复源返回原记录”），实现分属不同阶段与终态；本节记录现状、示例与已采用口径。

### A. 目标版本在绑定期变化

**触发条件**：组在提案时冻结 `target_versions`（设备/组合的 `row_version`、校准主帧 `revision`、项目 `revision`）。批准后到绑定前，其中任一记录被修改。

**示例**（复制模式，单相机，两帧）：

| 时点 | 动作 | 观察结果 |
| --- | --- | --- |
| t0 | 提案，相机 `cam-7` 为 `row_version=3` | 组内 `target_versions.equipment = {cam-7: 3}` |
| t1 | 用户在聊天中批准 | 导入作业入队，`status=importing` |
| t2 | 两帧复制完成 | 回执 `copied=2`；素材 `a1`、`a2` 已登记 |
| t3 | 另一窗口把相机改名 | `cam-7` 变为 `row_version=4` |
| t4 | 绑定阶段复核版本 | `_bind` 抛 `REVISION_CONFLICT`，两条绑定均为 `failed`；`status=binding_failed`；素材与回执保留，无任何关系写入 |
| t5 | 调用 `POST /library/agent-imports/{id}/retry-bindings` | 仍为 `binding_failed`；`row_version` 单调递增，一旦从 3 变为 4 就不可能再等于 3，重试永远不会成功 |

同一事件提前到 t0.5（批准后、导入启动前）：`_start_once` 复核版本失败，写 `import_error`，`status=import_failed`，不创建导入作业。

**状态对照**：

| 事件时点 | 当前结果 | 可重试 | 是否要求重新提案 |
| --- | --- | --- | --- |
| 启动前版本不符 | `import_failed` + `REVISION_CONFLICT`，返回 `requires_new_approval: true` | 否 | 是 |
| 绑定期版本不符 | `binding_failed` + `REVISION_CONFLICT`，返回 `requires_new_approval: true` | 是（保留重试） | 提示可能；不强制作废 |

**候选口径**：

| 选项 | 做法 | 影响 |
| --- | --- | --- |
| A | 绑定期版本不符即把批准标记为失效（如 `failed` + `requires_new_approval=true`），`retry-bindings` 返回 409 | 语义最干净；需改 `_bind`、`retry_bindings`、MCP 工具说明、状态展示与 TC-117-C |
| B | 只修 TECH：启动前 → `import_failed`；绑定 → `binding_failed`，并明确“目标版本单调递增，重试不会成功”，退出路径是手动绑定或重新提案 | 不动代码；但保留一个永远失败的重试按钮，需在 UI/Agent 文档说明 |
| C | 保留可重试，但在状态中增加 `requires_new_approval` 提示（检测到版本已不一致时） | 改动小于 A；仍需前端/Agent 展示 |

**已采用 C**：`status()` 在 `import_error == REVISION_CONFLICT` 或任一绑定失败且错误码为 `REVISION_CONFLICT` 时返回 `requires_new_approval: true`；该字段按当前状态动态计算，不写入批准记录，重试成功后自动消失。A/D 未采用；B 只解释现状，已被 C 取代。

### B. 组内已登记同源（跳过）

**触发条件**：登记（Reference）模式下，组内某源在库中已有 `external_key` 相同、且 `size_bytes`/`mtime_ns` 一致的记录。复制模式不做跳过，重复源会再复制一份。

**示例**（两帧，一帧已有）：

| 输入 | 状态 |
| --- | --- |
| `Light_0001.fit` | 新文件 |
| `Light_0002.fit` | 已登记为素材 `old-2`，指纹一致 |

批准内容：加入项目 `P`、绑定相机 `C`、写入批准属性。

**实际结果**：

| 对象 | 复制/登记 | 项目 | 属性/绑定 |
| --- | --- | --- | --- |
| `a1`（新） | `registered=1` | 加入 `P` | 绑定 `C`，属性按批准写入 |
| `old-2`（已存在） | `skipped=1` | **不加入** | **不写入、不绑定** |

组状态计算（`agent_imports.status`）：`imported=1`、`skipped=1`、`remaining = 2-1-1 = 0`、`bindings=1`，无失败；因 `skipped` 非零仍返回 `partial`。`retry-bindings` 不改变该结果，因为 `old-2` 从未进入 `_agent_asset_ids`。

代码位置：`imports.import_reference` 的跳过分支只做 `assign_session` 后记 `skipped`；`imports._record` 仅对 `registered`/`copied` 累积 `_agent_asset_ids`；`agent_imports.status` 把 `skipped` 计入 `partial`。

**候选口径**：

| 选项 | 做法 | 影响 |
| --- | --- | --- |
| A | 维持“不动既有记录”；状态返回 `skipped` 数量与被跳过的素材 ID，确认卡说明“已登记，未修改” | 安全；用户需自行处理该帧；`partial` 是诚实结果 |
| B | 跳过时也应用批准的项目/属性/绑定，然后允许 `completed` + `skipped` 计数 | 结果完整，但会隐式改写用户已整理的素材；需差异展示与确认语义 |
| C | 维持 A，另提供“将本次批准应用到已存在素材”的单独确认动作 | 最稳妥；新增接口与前端入口，工作量最大 |

**已采用 A**：跳过分支把既有素材 ID 记入回执 `_skipped_asset_ids`；`status()` 返回 `skipped_assets: [{"asset_id", "reason": "ALREADY_REGISTERED"}]`，组仍为 `partial`，不修改既有素材的项目、属性或绑定。B 留作后续产品能力，C 可作为后续显式动作。
