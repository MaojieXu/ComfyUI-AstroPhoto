# AstroPhoto Feature 总览

2026-11-21 按实际源码回溯七项历史 Feature。基线是 `main@4c0cf4d` 加当前磁盘工作树，其 Vue 入口、宿主装配、Siril Bundle 和发行脚本含未提交改动。原第 1、2 项按用户决定合并。

每项均有可独立阅读的 PRD、当前交互或不适用说明、技术契约、符号级实现及测试规格。协议、组件替身、真实宿主和历史结果的证据范围分别记录。当前工作树的测试结果需由 PH-06 正式记录。

| Feature | 原盘点 | 当前实现与待验收边界 |
| --- | --- | --- |
| [ComfyUI 扩展底座与绘图节点](comfyui-extension-drawing/00_FEATURE_INDEX.md) | 1、2 | V3 生命周期、状态、宿主 Widget 和工作流像素保存。临时 PNG 引用到正式下游 IMAGE 的执行待复验。 |
| [侧栏与节点浏览](sidebar-node-browser/00_FEATURE_INDEX.md) | 3 | 公共 Vue 侧栏、节点目录和宿主画布联动。按两类画布复核操作、错误降级和旧交互保真。 |
| [本地存储与工作区](local-storage-workspaces/00_FEATURE_INDEX.md) | 4 | Data Root、工作区、缓存及迁移回执。离线、取消、重启找回和保留源文件复验单列。 |
| [素材导入与资产登记](asset-import-library/00_FEATURE_INDEX.md) | 5 | 本机后端继续有预检、引用、复制及登记和重绑。Assets 标签为无请求占位，现有资产可由科学节点消费。 |
| [设备与光路管理](equipment-optical-trains/00_FEATURE_INDEX.md) | 6 | Settings 管理类型化设备和单一现行光路配置。旧修订仅兼容读取，编辑、依赖保护及版本冲突各有用例。 |
| [Siril 集成与 FITS AutoStretch](siril-fits-autostretch/00_FEATURE_INDEX.md) | 7 | Siril 由当前 Bundle 装配，通用科学源和预览配置继续由公共层提供。候选预览与正式 FITS 队列及保真分开。 |
| [MCP 诊断与设备只读查询](mcp-diagnostics-equipment-read/00_FEATURE_INDEX.md) | 8 | 独立 stdio、默认诊断和条件只读工具。客户端枚举、宿主逐次授权、轮换和构件安装各自验证。 |
| [ComfyUI 前端技术栈迁移](archive/comfyui-frontend-stack-migration/00_FEATURE_INDEX.md) | 独立 P0 | 已归档。保留两轮审查、测试报告和运行证据。 [Close](archive/comfyui-frontend-stack-migration/Close.md) |

FR、Q、CASE 编号在各专题内独立。跨专题引用使用 slug 或专题名称加编号。PRD 的产品决定、代码事实和运行证据各有来源。既有 Test Report 和 Close 保留原有结论。

## Feature 闭环顺序

本表按共享基线、契约依赖和关闭准备度排序。编号是建议的 PH-07 收口顺序。评审、修复和隔离测试可以重叠推进。前置专题需提供下游依赖的稳定契约和适用证据，下游无需等待前置专题完成行政归档。

| 顺序 | Feature | 依赖与收口条件 |
| --- | --- | --- |
| 1 | [ComfyUI 前端技术栈迁移](archive/comfyui-frontend-stack-migration/00_FEATURE_INDEX.md) | 已归档。下游沿用已验收的 Vue 构件、ComfyUI 0.46.0 / Frontend 1.59.6 与双画布基线。 |
| 2 | [本地存储与工作区](local-storage-workspaces/00_FEATURE_INDEX.md) | PRD v0.7 对照源码审查 32 项决策。先评审首次导入的本机与来源授权，再收口整库搬家、并发恢复和磁盘支持范围。 |
| 3 | [侧栏与节点浏览](sidebar-node-browser/00_FEATURE_INDEX.md) | 依赖迁移后的共同入口。复核单侧栏挂载、节点发现与详情、主图/子图点击和拖放、两类画布降级、书签和重开行为，明确 Settings 与 Assets 占位的界面边界。可与存储并行。 |
| 4 | [设备与设备组合](equipment-optical-trains/00_FEATURE_INDEX.md) | 依赖本机存储和 Settings 入口。先处理确实影响验收的重名比较、归档新增引用及旧历史删除边界，再验四类规格、组合保存、引用保护及失败恢复。50 条器材、16 套组合用于真实数据验收；API 清理闭环需证明删除回执和无残留。 |
| 5 | [MCP 诊断与设备只读查询](mcp-diagnostics-equipment-read/00_FEATURE_INDEX.md) | 默认诊断可提前验证。设备查询及历史兼容等设备 API 稳定后收口，补 stdio、宿主正确/错误/未设凭据、只读拒写、轮换边界和隔离 wheel 安装。 |
| 6 | [素材导入与资产登记](asset-import-library/00_FEATURE_INDEX.md) | 依赖工作区及侧栏边界，可在 2、3 的契约稳定后与 4、5 并行。先确认本轮验收覆盖现有导入 API 加 Assets 占位，还是要求恢复完整界面，再验证预检、引用/复制、回执、重绑与原件保护。设备组合的观测会话快照仅在纳入同轮范围时成为依赖。 |
| 7 | [Siril 集成与 FITS AutoStretch](siril-fits-autostretch/00_FEATURE_INDEX.md) | PRD v0.6 含 20 项待评审取舍，先确认输入图像、科学输出和预览版本，再确认原生队列、工作区、恢复及结果管理。最终 Registry 已验证双画布 RGB 单节点。 |
| 8 | [ComfyUI 扩展底座与绘图节点](comfyui-extension-drawing/00_FEATURE_INDEX.md) | 宿主注册、状态和 Widget 契约从第 1 项起共同取证，绘图 Q-01 仍优先评审。正式 Close 的独立缺口是 `vue-basic → PreviewImage` 下游 IMAGE。用真实 prompt/history 验证 CASE-03E，并结清分享及慢恢复要求。完整发行是否等待该项按 Q-01 决定。 |

每个 Feature 在进入 PH-07 前需用同一有效基线核对 PRD/验收条件、现行代码与 PH-06 结果。必要用例缺证或未满足验收时保留 PARTIAL/BLOCKED。已明确接受的非阻塞遗留记录影响、负责人及接续。PH-08 归档在形成关闭结论后另行处理。

## 跨 Feature 评审顺序

下表聚合共享规则。每个专题的专属问题和完整选项留在相应 PRD。R3 记录用户决定、证据、受影响 FR 与下游传播。R4 固定同一代码及宿主基线执行，再按偏差回流 PRD、实现或用例。已确认的 P0 范围继续适用。

| 顺序 | 需要一起决定的事 | 建议与当前边界 | 接续证据与影响 |
| --- | --- | --- | --- |
| 1 | 完整发行是否要求绘图可产下游 IMAGE，两种画布的交互失败如何定性 | P0 绘图仍验收到临时引用。完整发行门槛继续从绘图 Q-01 开始，区分已验证的上传和未证实的正式执行。 | 隔离宿主记录两种画布、真实 upload、prompt、history 和 PreviewImage。联动绘图、侧栏和发行口径。 |
| 2 | 工作区离线、迁移源保留、重启找回及旧库兼容 | 建议禁止隐式换落盘目标，保留旧源和失败诊断；复核损坏或不兼容库的保护。 | 保存拔插前后配置、失败回执和旧库样本的证据，统一存储、素材、科学链的落盘前提。 |
| 3 | 素材重绑、同名替换及候选与正式运行间的文件身份 | 先区分路径变化和内容变化。确认是否需要保持原登记、提示重新预览或阻止旧身份提交。 | 比较同名不同内容、合法重绑、候选回执和正式队列证据，联动素材与 Siril。 |
| 4 | 正式 FITS 最低保真、资源处理与预览配置 | 分开检查候选 PNG 显示与科学产物。按代表性样本决定必须保留字段及资源失败反馈。画布尺寸另核对当前固定行为与配置承诺。 | 位深、WCS、HDU、资源失败和多次运行证据，传播到处理回执、Environment 与 Inspector。 |
| 5 | Assets 恢复，以及会话绑定光路的历史数据范围 | 当前 Assets 为占位。建议以已实现的后端导入和恢复为界评审恢复入口，并把会话快照与光路删除保护一起讨论。 | 用真实导入、离线重绑和采集样本核对素材、设备、侧栏与科学消费路径。 |
| 6 | 外部诊断深度、撤销与披露范围 | 沿用当前本机只读与兼容协议。先验证轮换和拒绝，再决定独立状态工具或细分权限。 | 隔离双客户端核对旧凭据的失效时点、错误脱敏、设备和历史的可见范围；联动底座状态与 MCP。 |

绘图 Q-01～03 继续逐项评审。本轮源码回溯产生的建议与旧历史差异，均等待相应产品确认或针对性证据。
