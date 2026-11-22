# 设备、设备组合、素材与 MCP · 阶段索引



**活动 Feature** 04 · 2026-11-21 · 当前收口 PARTIAL

用户确认 [01_PRD.md 尾部 v0.7](01_PRD.md#astrophoto-摄影素材库-prd-v07) 与 [摄影素材库 UI/UX v1.0](AstroPhoto_Assets_UI_UX_v1.0.md) 为现行基线。PH-03～PH-06 已有同一 Feature 的技术、开发、测试规格和实现证据。PH-07 的当前判断与遗留见 [Close](Close.md#当前结论--摄影素材库-v07)。PH-08 保持待定。

以下是原 Feature 04、05、06 合并时保留的分组记录。各分组状态和测试结果归属原基线。

| 阶段 | 入口 | 当前范围 |
| --- | --- | --- |
| PH-01 | [产品需求](01_PRD.md) | 设备、设备组合、Assets 和 MCP 的联合交付范围 |
| PH-02 | [交互规格](02_UI_UX.md) | 本机设备与素材界面，MCP 客户端使用契约 |
| PH-03 | [技术设计](03_TECH.md#摄影素材库-v07--技术设计) | v0.7 技术切片与上游复用凭据 |
| PH-04 | [开发规格与实现记录](04_DEV.md#摄影素材库-v07-实现) | 当前入口、接口、guard 与实现边界 |
| PH-05 | [联合验收计划](05_TEST_PLAN.md#摄影素材库-v07--当前验收规格) | FR、UX、MCP、宿主及异常断言 |
| PH-06 | [测试报告](06_TEST_REPORT.md#2026-11-21--摄影素材库-v07-当前批次) | 当前实测、故障复测及历史保留 |
| PH-07 | [收口记录](Close.md) | PARTIAL，按合并范围统一收口 |

原编号按分组引用，例如「04 D-09」「05 CASE-02」「06 Q-05」。本文件各分组中的阶段状态为合并前记录。 [Feature 总览](../INDEX.md)

<a id="04-equipment"></a>

## 设备与设备组合


**标识** `equipment-optical-trains` · v0.5 · 2026-11-21 · 产品决定与官网样本

让天文摄影用户维护设备及设备组合，了解不完整配置、引用关系、冲突与历史边界。

当前收口重点为 D-05 重名拒绝、D-06 归档设备的新增引用保护，以及官网样本的创建、读取和 API 删除。2026-11-21 复核 20 项后端与 HTTP 测试通过，完整收口仍依赖前两项业务实现和验收。 [测试报告](06_TEST_REPORT.md#04-equipment) · [开发规格](04_DEV.md#04-equipment)

PRD v0.8 合并产品与后端评审，保留 Q-07～08 两项用户选择。D-09 已改变组合删除目标，当前实现与旧测试仍为物理删除。UX、技术、开发、测试及共享文档仍描述原实现，待决策后按影响同步；历史测试不得作为新删除语义的通过证据。 [产品需求与待决选项](01_PRD.md#04-equipment)

当前依据为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 已有未提交变更。设备服务、路由描述、数据库及专项 Python 测试与 HEAD 一致；注册、存储装配、Vue 入口、构件和宿主/组件脚本取工作树。 `003c599` 为单配置与四类设备的历史里程碑，旧 React 前端可从 `4c0cf4d:frontend/ui` 读取。目标宿主 Backend 0.46.0 / Frontend 1.59.6。 [规则与历史](../../../docs/equipment.md) · [环境](../../../docs/development.md)

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，已定位现行前后端与历史证据 |
| PH-01 | [产品需求](01_PRD.md#04-equipment) | IN_PROGRESS，D-04～10 已回填，评审共识已合并为工作方案，Q-07～08 待用户选择 |
| PH-02 | [交互规格](02_UI_UX.md#04-equipment) | IN_PROGRESS，现行源码已核对，目标宿主待复验 |
| PH-03 | [技术设计](03_TECH.md#04-equipment) | COMPLETE，已核对接口、存储和权限 |
| PH-04 | [开发规格与实现](04_DEV.md#04-equipment) | COMPLETE，已回填实际链路及差距 |
| PH-05 | [测试计划](05_TEST_PLAN.md#04-equipment) | READY，CASE-01～08 与官网样本矩阵已列，新增行为待实现与验证 |
| PH-06 | [测试报告](06_TEST_REPORT.md#04-equipment) | API 清理专项已验证；完整领域验收见报告及留存缺口 |
| PH-07 | [Close 草案](Close.md#04-equipment) | PARTIAL，当前验收待复验 |
| PH-08 | [专题总览](../INDEX.md) | 活动专题 |

后续先核对当前 Vue、SQLite 和 aiohttp，再在同一隔离根验收真实宿主重启、保护删除与只读 MCP。用户可见文案、重名校验和禁止新增归档引用待实现。筛选和表单已符合确认范围，仍需按计划复验。

独立迁移批次已记录设备/光路真实宿主正向路径、同根重启和保护删除；回溯计划保留未覆盖的输入冲突、旧历史互操作和数据边界。 [迁移批次](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

验收数据集中在 PRD，含 50 条带厂家来源的设备记录和 16 个组合。测试夹具按需在隔离环境生成并清理。 [样本与厂家来源](01_PRD.md#04-equipment-官网核验的临时验收数据) · [覆盖矩阵](05_TEST_PLAN.md#04-equipment-官网样本覆盖与执行顺序)

<a id="05-mcp"></a>

## MCP 诊断与设备只读查询


**标识** `mcp-diagnostics-equipment-read` · 产品评审与验收规格 · v0.8 · 2026-11-21

**当前状态** PH-01 至 PH-05 已按当前源码补档。PRD 待逐项评审，当前运行验收待复核。Close 初稿判定 `PARTIAL`。

让外部客户端通过独立 stdio 诊断宿主，并在明确的本机授权下查询设备和设备组合。

### 基线与来源

`5e39fcf` 引入独立 MCP 与诊断；`003c599` 增加受控设备/设备组合读取。 当前实现以 `main@4c0cf4d` 和磁盘上的宿主初始化、路由、构件等未提交改动为准。历史运行证据保留原有版本。[mcp.md](../../../docs/mcp.md) · [publishing.md](../../../docs/publishing.md) · [fastmcp-42.md](../../../.agents/archive/fastmcp-42.md) · [equipment.md](../../../docs/equipment.md)

### 阶段与接续

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | 文档已建立 |
| PH-01 | [产品需求](01_PRD.md#05-mcp-本轮待决问题) | v0.8，Q-02 A 已确认，支持受信本机 Agent 并行查询。Q-01 共享凭据轮换及 Q-03～16 待评审 |
| PH-02 | [交互规格](02_UI_UX.md#05-mcp) | N/A，无宿主 GUI 交互 |
| PH-03 | [技术设计](03_TECH.md#05-mcp) | 当前契约、授权与失败边界已对照源码 |
| PH-04 | [开发规格与实现](04_DEV.md#05-mcp) | 按实际调用链、守卫和工具差异补齐 |
| PH-05 | [测试计划](05_TEST_PLAN.md#05-mcp) | 分层程序化验收，含进程内模拟、真实 stdio、隔离宿主和独立安装 |
| PH-06 | [测试报告](06_TEST_REPORT.md#05-mcp) | 现有 MCP 自动化 67 项通过，stdio 加回环 HTTP 替身也通过。当前真实宿主与构件验收待补 |
| PH-07 | [Close 草案](Close.md#05-mcp) | 未关闭 |
| PH-08 | [专题总览](../INDEX.md) | 保持活动，待关闭后归档 |

优先评审访问范围、Bearer 路由、同机信任边界和 Close 条件（Q-03、Q-04、Q-06、Q-15、Q-16），再按 PRD 中的分组确认后续选择。CASE-01 和本地 wheel 安装可独立执行。设备 API 稳定后执行 CASE-02 全链路，并回填实际证据、公开发行状态与 Close。 [跨 Feature 顺序](../INDEX.md)

<a id="06-assets"></a>

## 素材导入与资产登记


**标识** `asset-import-library` · v0.6 · 2026-11-21

在保全原件的前提下登记天文文件，追踪外部引用或 Workspace 副本，提供导入回执、位置重绑、会话关联和科学节点读取。

### 基线与来源

`003c599` 引入历史导入服务和 React 浏览界面。当前实现为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 工作树。后端复用 `astrophoto/api/assets.py`、`astrophoto/assets/imports.py`、`astrophoto/assets/service.py`，路由装配和 runtime 变更，增加 `astrophoto/assets/fits.py`、`astrophoto/api/scientific.py`。Vue 侧栏新增占位和专用 FITS 控件，HEAD 的 React Assets 和旧浏览器脚本为历史证据。历史 Windows 0.45.0/1.59.1 与当前目标 0.46.0/1.59.6 分开记录。 [开发环境](../../../docs/development.md) · [资产历史交付](../../../docs/local-storage.md)

| 阶段 | 当前产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，当前与历史基线已定位 |
| PH-01 | [产品需求](01_PRD.md#06-assets) | IN_PROGRESS，v0.6 核对源码并扩充 Q-01～18、优缺点及边界矩阵，已有决定沿用 |
| PH-02 | [交互规格](02_UI_UX.md#06-assets) | READY，已记录 P0 占位、FITS 选择与历史界面，恢复 Assets 设计开放 |
| PH-03 | [技术设计](03_TECH.md#06-assets) | READY，路由、存储与科学消费边界已定位 |
| PH-04 | [开发规格与实现](04_DEV.md#06-assets) | READY，当前后端行为、guard 和差异已映射 |
| PH-05 | [测试计划](05_TEST_PLAN.md#06-assets) | READY，已实现切片与界面恢复场景分开 |
| PH-06 | [历史测试报告](06_TEST_REPORT.md#06-assets) | NOT_STARTED（独立 Feature 复验），本轮业务测试 NOT_RUN；当前工作树已有独立迁移报告中的有限证据 |
| PH-07 | [历史 Close 草案](Close.md#06-assets) | IN_PROGRESS，旧草案判定 PARTIAL |
| PH-08 | [专题总览](../INDEX.md) | NOT_STARTED，专题保持活动 |

独立迁移运行的 10-A/B 验证真实 Vue 宿主 Assets 默认入口、双语和无素材请求。该运行的跨卷回归因缺少第二测试卷跳过。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

Q-02 优先确定本专题是否恢复 Assets 页面。Q-05 关联此前要求的测试后 API 删除闭环，当前缺少资产删除接口。Q-06～18 是本轮架构和边界审视新增的未决项。CASE-01～07 可依现有接口复核，CASE-08 的删除步骤等待 Q-05 和实现，其他新增决定确认后再传播至测试计划。
