# AstroPhoto Feature 总览

本索引对应此前整理的专题和工程记录。早期报告使用当时的目录名，引用旧路径时可从下表进入对应专题。例如，原 `.agents/notes/` 中的[后端标准化记录](backend-standardization.md)与[设备删除记录](04-equipment-delete.md)现与本索引同级，前端迁移的[测试报告](archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)位于本目录的 `archive/` 下。旧 `.agents/features/07-siril-fits-autostretch/` 的资料可从下表的 Siril 专题进入。报告引用的已替换源码和开发 Skill 按当时的工作树解读，`.artifact/` 路径指向当次运行机上的证据。

新 Feature 的状态入口和默认归档位置由 [feature-pipeline](../skills/feature-pipeline/SKILL.md) 维护。以下盘点保留原日期及验收结论。

2026-11-21 按实际源码回溯七项历史 Feature。基线是 `main@4c0cf4d` 加当前磁盘工作树，其 Vue 入口、宿主装配、Siril Bundle 和发行脚本含未提交改动。原第 1、2 项按用户决定合并。编号目录 04、05、06 已合并为一个 Feature，沿用 04 的路径。

每项均有可独立阅读的 PRD、当前交互或不适用说明、技术契约、符号级实现及测试规格。协议、组件替身、真实宿主和历史结果的证据范围分别记录。当前工作树的测试结果需由 PH-06 正式记录。

| Feature | 原盘点 | 当前实现与待验收边界 |
| --- | --- | --- |
| [ComfyUI 扩展底座与绘图节点](08-comfyui-extension-drawing/00_FEATURE_INDEX.md) | 1、2 | V3 生命周期、状态、宿主 Widget 和工作流像素保存。临时 PNG 引用到正式下游 IMAGE 的执行待复验。 |
| [侧栏与节点浏览](sidebar-node-browser/00_FEATURE_INDEX.md) | 3 | 公共 Vue 侧栏、节点目录和宿主画布联动。按两类画布复核操作、错误降级和旧交互保真。 |
| [本地存储与工作区](local-storage-workspaces/00_FEATURE_INDEX.md) | 4 | Data Root、工作区、缓存及迁移回执。离线、取消、重启找回和保留源文件复验单列。 |
| [设备、设备组合、素材与 MCP](04-equipment-optical-trains/00_FEATURE_INDEX.md) | 5、6、8 | 摄影素材库 PRD v0.7 与 UX v1.0 已确认。Assets、后端与 FastMCP 已实现并进入 PH-07 PARTIAL。详见 [Close](04-equipment-optical-trains/Close.md#当前结论--摄影素材库-v07)。 |
| [Siril CLI 集成](07-siril-fits-autostretch/00_FEATURE_INDEX.md) | 7 | Siril 1.4.5 全量脚本命令由 Bundle 注册为独立节点，图像使用路径连线，旧 AutoStretch 工作流保留。 |
| [ComfyUI 前端技术栈迁移](archive/comfyui-frontend-stack-migration/00_FEATURE_INDEX.md) | 独立 P0 | 已归档。保留两轮审查、测试报告和运行证据。 [Close](archive/comfyui-frontend-stack-migration/Close.md) |

FR、Q、CASE 编号在各专题内独立。跨专题引用使用 slug 或专题名称加编号。PRD 的产品决定、代码事实和运行证据各有来源。既有 Test Report 和 Close 保留原有结论。

## Feature 闭环顺序

本表按共享基线、契约依赖和关闭准备度排序。编号是建议的 PH-07 收口顺序。评审、修复和隔离测试可以重叠推进。前置专题需提供下游依赖的稳定契约和适用证据，下游无需等待前置专题完成行政归档。

| 顺序 | Feature | 依赖与收口条件 |
| --- | --- | --- |
| 1 | [ComfyUI 前端技术栈迁移](archive/comfyui-frontend-stack-migration/00_FEATURE_INDEX.md) | 已归档。下游沿用已验收的 Vue 构件、ComfyUI 0.46.0 / Frontend 1.59.6 与双画布基线。 |
| 2 | [本地存储与工作区](local-storage-workspaces/00_FEATURE_INDEX.md) | PRD v1.1 已纳入超额确认、自动切根、无配额用实际空间、缺件降级重绑和退出清空 Cache。v1.1 已实现并完成同卷、目标宿主和关键恢复验收；硬件延期项见报告。 |
| 3 | [侧栏与节点浏览](sidebar-node-browser/00_FEATURE_INDEX.md) | CLOSED。共享构件验证单侧栏、目录和精确收藏、双画布主图和子图、原生历史及 Assets 与 Settings 导航接缝。 |
| 4 | [设备、设备组合、素材与 MCP](04-equipment-optical-trains/00_FEATURE_INDEX.md) | 依赖本机存储和侧栏。设备契约、素材流程和 MCP 工具共用一份联合验收计划。 |
| 5 | [Siril CLI 集成](07-siril-fits-autostretch/00_FEATURE_INDEX.md) | 新增全量 Siril CLI 目录和 183 个脚本节点，当前实测双画布路径链与旧图。原 PRD v0.6 的科学输出、工作区和恢复开放项仍在活动专题。 |
| 6 | [ComfyUI 扩展底座与绘图节点](08-comfyui-extension-drawing/00_FEATURE_INDEX.md) | 宿主注册、状态和 Widget 契约从第 1 项起共同取证，绘图 Q-01 仍优先评审。正式 Close 的独立缺口是 `vue-basic → PreviewImage` 下游 IMAGE。用真实 prompt/history 验证 CASE-03E，并结清分享及慢恢复要求。完整发行是否等待该项按 Q-01 决定。 |

每个 Feature 在进入 PH-07 前需用同一有效基线核对 PRD/验收条件、现行代码与 PH-06 结果。必要用例缺证或未满足验收时保留 PARTIAL/BLOCKED。已明确接受的非阻塞遗留记录影响、负责人及接续。PH-08 归档在形成关闭结论后另行处理。

## 跨 Feature 评审顺序

下表聚合共享规则。每个专题的专属问题和完整选项留在相应 PRD。R3 记录用户决定、证据、受影响 FR 与下游传播。R4 固定同一代码及宿主基线执行，再按偏差回流 PRD、实现或用例。已确认的 P0 范围继续适用。

| 顺序 | 需要一起决定的事 | 建议与当前边界 | 接续证据与影响 |
| --- | --- | --- | --- |
| 1 | 完整发行是否要求绘图可产下游 IMAGE，两种画布的交互失败如何定性 | P0 绘图仍验收到临时引用。完整发行门槛继续从绘图 Q-01 开始，区分已验证的上传和未证实的正式执行。 | 隔离宿主记录两种画布、真实 upload、prompt、history 和 PreviewImage。联动绘图、侧栏和发行口径。 |
| 2 | 工作区离线、迁移源清理、重启找回及旧库兼容 | 工作区迁移提交前保全源，提交后自动清理已搬走的源副本。目标缺失时提示配置，不隐式改写。 | 用独立目录验证同卷切换、失败回执和清理范围，保留旧库样本的版本证据。 |
| 3 | 素材重绑、同名替换及候选与正式运行间的文件身份 | 先区分路径变化和内容变化。确认是否需要保持原登记、提示重新预览或阻止旧身份提交。 | 比较同名不同内容、合法重绑、候选回执和正式队列证据，联动素材与 Siril。 |
| 4 | 正式 FITS 最低保真、资源处理与预览配置 | 分开检查候选 PNG 显示与科学产物。按代表性样本决定必须保留字段及资源失败反馈。画布尺寸另核对当前固定行为与配置承诺。 | 位深、WCS、HDU、资源失败和多次运行证据，传播到处理回执、Environment 与 Inspector。 |
| 5 | Assets 界面和会话绑定光路的历史数据范围 | 完整 Assets 界面已纳入合并 Feature。会话快照、资产删除及光路删除保护按统一 PRD 评审。 | 用真实导入、离线重绑和采集样本核对素材、设备、侧栏与科学消费路径。 |
| 6 | 外部诊断深度、撤销与披露范围 | 沿用当前本机只读与兼容协议。先验证轮换和拒绝，再决定独立状态工具或细分权限。 | 隔离双客户端核对旧凭据的失效时点、错误脱敏、设备和历史的可见范围；联动底座状态与 MCP。 |

绘图 Q-01～03 继续逐项评审。本轮源码回溯产生的建议与旧历史差异，均等待相应产品确认或针对性证据。
