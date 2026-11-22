# 设备、设备组合、素材与 MCP · 产品需求

## 合并后的产品范围

| 范围           | 用户确认的交付                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| 设备与设备组合 | 纳入完整 UI/UX、后端 API 与 MCP 工具范围。设备组合按与设备一致的修改、归档、删除三层生命周期设计。         |
| Assets         | 纳入完整 Assets UI/UX、后端 API 与 MCP 工具范围。原 06 Q-02 中保留 Assets 占位作为最终交付的选项已不适用。 |
| 联合交付       | 三项共用一个 Feature、一次实现安排和一份验收报告。                                                         |

后续设计仍需明确组合删除是否释放名称、历史引用如何保留、资产删除对登记和文件的影响，以及 MCP 的具体工具、权限和披露边界。当前答复确认交付范围与生命周期，详细规则和原评审意见见下文。

<a id="04-equipment"></a>

## 设备与设备组合

**版本** v0.8 · 2026-11-21 · 合并产品与后端评审，部分规则待实现
**身份** `equipment-optical-trains` · 首版软件历史基线 0.0.1

沿用 FR-01～05、Q-01～06，吸收用户直接写在 v0.3 中的批注和答案。Confirmed 表示已确认的产品规则，Inferred 表示从交付回溯的需求，Proposed 表示建议，Open 表示未决。源码现状和既有运行证据单独记录。

### 背景、目标与使用者

用户需要把单件设备的规格与实际使用的设备组合分开维护，随时知道一条设备组合用了什么、缺什么，以及调整或删除记录会影响谁。成功信号是同一设备可复用，未完整的配置能保存，历史关联和错误操作有可查边界。

本机操作者创建设备、编辑设备组合和处理引用冲突。管理员开启本机许可。受权 Agent 只能通过 MCP 看设备、设备组合及旧历史，不能代替用户写入或永久删除。

### 业务对象及集成边界

设备包括相机、主光学设备（望远镜/镜头）、光学配件和滤镜。相机有可选读出和增益等规格，滤镜可含多个通带。设备组合包含至多一台相机、一项主光学、顺序有意义的配件及可用滤镜集合；多条设备组合可引用同一设备。历史修订是兼容快照，而非当前设备组合的一组可发布版本。当前配置可以是部分配置。设备与设备组合各由用户命名，名称用于辨识和检索，现有引用仍使用记录 ID。相同厂家型号的不同实体可以分别登记，使用不同自命名即可。

[存储](../local-storage-workspaces/01_PRD.md) · [MCP](01_PRD.md#05-mcp) · [侧栏](../sidebar-node-browser/01_PRD.md)

#### 可登记的专业规格

| 类别       | 基础规格与可选项                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 相机       | 传感器名称、单色/彩色类型、像素尺寸与数量、Bayer 排列、ADC 位深、制冷、最大合并像素。读出模式有名称及可选的增益/偏置范围，同一设备下模式键不能重复。 |
| 主光学设备 | 望远镜或镜头、光学设计、口径、原生焦距/焦比、像圈和说明。                                                                                            |
| 光学配件   | 减焦、平场或增倍类别，登记标称倍率、设计后截距、通光口径和说明。                                                                                     |
| 滤镜       | 类型、尺寸、规格形式和有序通带。通带可登记名称、中心波长及半高全宽，同一滤镜不接受重复通带名称。                                                     |

数值要符合单位及相应取值约束，读出范围有上下界时下界不能高于上界。表单拒绝不适用的类型字段。记录规格可未知，系统不得用 0 或默认物理参数代替未知。以上字段从现有设备交付和校验规则回溯。

### 主要场景

- S-01 从 设置 → 设备与设备组合 进入「我的设备」，按名称、厂家或型号搜索，按单选条件筛选类型或归档，选择类型后新建，或打开现有摘要和可折叠详情修改。
- S-02 在「设备组合」新建/编辑，先保存不完整组合，再加相机、主光学、配件和可用滤镜。设备详情原位更新后，当前设备组合读新资料。
- S-03 归档或恢复设备和设备组合。删除设备组合后对普通选择入口隐藏，已有历史引用继续可用，新的关联不能再选择已删除组合。设备删除仍需检查真实引用。遇并发冲突保留本地输入。
- S-04 读旧设备组合时优先用当前已保存配置，无当前记录再读旧默认或最近快照。已保存数据重启后可查。

### 状态、权限与异常规则

名称与设备类型受业务校验，厂商、型号、备注及专业字段允许未知；未知与明确否定区分。相机支持三态制冷、读出模式及增益/偏置能力；滤镜支持有序通带及同滤镜标签约束。设备组合必须有相机与主光学才算已配置；配件顺序不得丢失。设备组合表单无需新增旋转角度、变更备注、光学状态配置说明或平场适用性控件。编辑已有记录时，保留已存的兼容字段。有效焦距和焦比是标称估算，缺参数时为未知。受引用设备不能永久删除，允许查看原因；删除设备组合时历史引用继续可用，新关联不能再选用该组合，具体恢复方式待 Q-08 决定。设备和设备组合列表在设备模块当前挂载期间分别保持查询及单选筛选。单选条件中的归档与类型互斥；离开模块及重挂载后会话主要恢复编辑草稿。宿主收合/重新挂载可恢复未保存草稿，跨模块离开需确认，硬刷新沿用浏览器离开提示。陈旧写入无静默覆盖，创建结果不明确时先按名称核对列表。命名重复应在名称字段给出反馈，保留已编辑内容并请用户改名。对同一记录保存原名属于正常编辑。

### 交付范围与非目标

覆盖设备四类和规格、当前设备组合配置、列表/编辑/摘要、归档与删除、旧快照兼容。历史发布、默认修订选择和由历史派生的交互已被替代。硬件控制、设备/资产和 Capture Profile 绑定、校准自动判定、Agent 写入不在当前范围。

### 功能需求与验收

#### FR-01 四类设备、规格与查询

**状态、必要性及场景** Confirmed · 首版必要 · S-01。

创建、编辑、检索四类设备；允许未知值并显示类型规格。列表支持关键字及单选筛选，类别和归档作为互斥选项。详情分组可查看。用户自命名与已有设备同名时阻止保存并提示改名。

**验收** 同样的四类样本保存重开后规格一致；未选可选值保持未知，重复通带或无效字段报错并保留合法输入。新增和改名撞到另一现有设备时，名称处显示重复提示，记录数和已有记录不变。 [CASE-01、CASE-07](05_TEST_PLAN.md#04-equipment)

#### FR-02 单配置设备组合与兼容回读

**状态、必要性及场景** Confirmed · 首版必要 · S-02/S-04 · FR-01。

每条设备组合在前台呈现当前配置，允许不完整，已配置判断独立于归档。配置变化后前台动态显示最新内容，快照和版本仅用于后台管理，前台不提供版本展示或选择。保留配件顺序及滤镜集合；旧快照用于兼容和历史引用。设备组合拥有独立自命名，与另一设备组合同名时提示改名。新建或编辑时不能新加入已归档设备，已保存配置中的归档引用可以保持或移除，旧快照继续可读。移除并保存后再次加入属于新引用。界面选项和服务端写入遵循同一规则。

**验收** 保存缺主光学及完整配置，检验判定与顺序；改设备后当前详情读到新数据，原历史快照仍保持旧记录内容。组合重复名被拒绝。归档后旧引用可原样保存或移除，向任一设备位置新增归档引用被拒，当前配置在拒绝前后相同。 [CASE-02、CASE-06、CASE-07](05_TEST_PLAN.md#04-equipment)

#### FR-03 归档、恢复与删除

**状态、必要性及场景** Confirmed · 首版必要 · S-03 · FR-01/02。

对设备与设备组合支持归档和恢复。设备删除保护引用，归档设备后保留已有关系。用户确认删除设备组合后，隐藏该组合及其历史版本，既有引用继续可用，不能再建立新引用，关联设备保留。删除后的恢复能力由 Q-08 决定。

**验收目标，待实现** 被引用设备显示关联且删除被拒绝；取消确认不变；删除设备组合后普通列表和新关联入口不可选，先前关联仍能读取所需历史信息，关联设备不受影响。旧记录删除行为与该目标不同，现有 CASE-03 须在后续同步后重验。 [CASE-03](05_TEST_PLAN.md#04-equipment)

#### FR-04 编辑会话、并发与失败反馈

**状态、必要性及场景** Inferred · 首版必要 · S-01～04。

设备、设备组合列表在当前模块挂载期间保留各自查找条件。每个列表只启用一个筛选项，搜索可配合该筛选。跨模块离开后不要求恢复筛选，草稿恢复按编辑会话规则处理。可恢复宿主侧栏重挂载前的草稿；编辑冲突反馈清晰，重载前保留输入。

**验收** 双会话修改同一对象，后提交者可见冲突；收起再开保持草稿；跨模块确认取消时继续当前编辑。分别在设备和设备组合列表切换筛选并返回，验证会话内各自保留；跨模块重建后核对默认筛选及草稿状态。 [CASE-04、CASE-08](05_TEST_PLAN.md#04-equipment)

#### FR-05 共享资料与运行边界

**状态、必要性及场景** Inferred · 首版必要 · S-02/S-04。

设备和设备组合持久保存在本地资产域，写入不改变 Workspace、素材源文件或导入配置。MCP 读取本地已授权记录及兼容历史。

**验收** 重启后资料完整；通过本地权限与 MCP 只读边界验证同一数据，并核对文件和默认工作区设置不变。 [CASE-05](05_TEST_PLAN.md#04-equipment)

<a id="04-equipment-已有决定与历史差异"></a>

### 已有决定与历史差异

| 决定 | 状态      | 结论及依据                                                                                                                         | 影响                |
| ---- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| D-01 | Confirmed | 四类设备、未知可填、摘要/折叠详情，配件和滤镜语义采用交接 D05/D06/D18。                                                            | FR-01、02           |
| D-02 | Confirmed | 单配置替代多修订发布；旧历史读取保留。交接 D06。                                                                                   | FR-02               |
| D-03 | Confirmed | 归档与红色永久删除，保护真实引用和版本，不自动解除引用。交接 D07 与删除专项。                                                      | FR-03               |
| D-04 | Confirmed | 产品和界面使用「设备组合」称呼原「光学链路/光路」。现有代码标识作为兼容定位。                                                      | FR-01～05           |
| D-05 | Confirmed | 设备和设备组合均有用户自命名。同一列表内命名重复时阻止保存，提示更改名称。源自 Q-03 批注。                                         | FR-01、FR-02、FR-04 |
| D-06 | Confirmed | Q-04 选 A。保留旧引用及历史，允许移除，禁止新加入已归档设备。                                                                      | FR-02、FR-03        |
| D-07 | Confirmed | Q-05 选 A。两列表各用单选筛选，在当前模块会话保留。                                                                                | FR-01、FR-04        |
| D-08 | Confirmed | Q-06 回答不开放额外字段。表单范围延续现有设计，已保存兼容字段保留。                                                                | FR-02、FR-04        |
| D-09 | Confirmed | 用户在 Q-01 批注要求删除组合后隐藏历史，已有引用仍可用，禁止新增引用。替代 D-03 对组合及历史的物理删除规则，设备引用保护继续适用。 | FR-02、FR-03        |
| D-10 | Confirmed | 用户在 Q-02 批注要求快照和版本不向前台用户展示，组合变化时前台动态显示最新配置。历史冻结的工作方案见评审合并表。                   | FR-02、FR-05        |

#### 评审合并的工作方案

用户要求合并两位评审的结论。以下作为本轮文档的工作方案，来源是产品和后端评审，具体设计与验收仍需落实，不将其记为用户逐条选择或现有代码已实现。

| 来源             | 合并方案及范围                                                                                                                                                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q-07、Q-18、Q-15 | 设备与组合分别比较名称。去除首尾 Unicode 空白，比较时采用 NFC 和 Unicode 大小写折叠，保留可见名称。归档记录占名，已删除组合是否占名由 Q-07 决定。保留旧重名、ID 与原名，允许其按原比较键编辑，阻止新增冲突。写事务统一校验，处理旧库迁移和并发。                        |
| Q-09、Q-11       | 未来素材或观测会话建立关联时，记录消费方所需的组合身份、组件角色和顺序、名称、必要规格、来源时间及未知值。关联时间与实际采集时间分开，事后登记不推断过去的器材。具体字段、分段及关联时机在对应下游 Feature 完整设计。旧历史缺失字段保留未知，不能以当前规格冒充当时值。 |
| Q-10             | 首版保留当前设备引用保护。历史引用仍存在时允许归档，删除被拒绝并说明当前或历史引用。未来只有在历史自包含且不再作为当前配置回退依赖时，才重新评估放宽。                                                                                                                  |
| Q-12             | 组件是否齐全与设备是否归档分开判断，完整组合仍显示已配置，归档设备有标识。未来业务关联是否允许使用或需要提示由该入口决定。                                                                                                                                              |
| Q-13             | 写事务中检查聚合版本、当前状态及新增归档引用，真实冲突保留表单并提示处理。考虑无 draft 的历史回退及归档后恢复，不能只依赖现有 draft 版本。                                                                                                                              |
| Q-14             | 首版创建结果不明时保留输入并查询列表；仍无法确定时明确显示结果未确认，不能仅凭同名判定。持久幂等可在后续自动重试或批量创建需求中设计。                                                                                                                                  |
| Q-16             | 不完整组合可以保存和查看，区分缺少核心组件与可选规格未知。未来采集、素材和校准分别定义使用条件。                                                                                                                                                                        |
| Q-17             | 遵照用户逐次 API 清理要求，测试通过仅隔离测试应用显式装配的接口清除本次测试记录。先验证普通删除保留历史，再通过测试清理 API 按组合、设备顺序清除，并验证实际记录与测试根的清理结果。真实宿主的测试接口装配方式和失败恢复在技术与测试设计中验证。                        |
| Q-19、Q-20       | 首版规格保存后当前组合动态更新，不追加阻塞确认。估算标明基于已登记参数，缺少参与某项计算的参数时该项显示未知，实体兼容性保持未验证。相机或滤镜的归档状态是否影响焦距计算须按计算依赖核验。                                                                              |
| Q-21、Q-22       | 本地存储专题负责备份恢复，设备验收覆盖 ID、引用与历史。跨实例合并另立需求。列表支持分页、刷新及加载失败重试，验收超过一页的数据可搜可选，不承诺跨页固定快照。                                                                                                           |

### 证据、冲突与限制

**Observed**。旧发布/默认快照流程有 2026-11-18 真实宿主记录，只能证明旧需求。单配置、陈旧版本和事务回滚另有专项材料；P0 资料库入口须独立复验。原设备规格附件曾为空，专业规则依据当前交付与历史决定重建。

历史资料指向设备 UI FRD v1.0 与 Three Tier Engineering Guide v1.0，原规格附件曾记录为零字节且当前未检得完整副本。可恢复范围以现行设备交付、删除任务和交接决策为准。 Git `4c0cf4d` 中历史交接 `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_2/02_REQUIREMENTS_AND_DECISIONS.md`，记录 D01–D19。下文的交接决策编号引用该版本。

[现行设备规则](../../../docs/equipment.md) · [永久删除记录](../../notes/04-equipment-delete.md) · [MCP PRD](01_PRD.md#05-mcp) · [P0 PRD](../archive/comfyui-frontend-stack-migration/01_PRD.md)

### 本轮待决问题

仅保留评审双方存在实质分歧、需要用户选择的问题。已合并方案见“评审合并的工作方案”，原 Q 编号在那里保留追溯。

#### Q-07 已删除组合是否继续占用名称

**Open。** 两位评审一致建议归档记录占名、保留既有 ID。删除后保留历史的组合是否继续占名，需要结合 Q-08 决定。

| 选项 | 规则                                                           | 优点                                                 | 缺点                                                       |
| ---- | -------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| A    | 已删除组合继续占名。                                           | 如支持恢复，可以保留原名恢复；历史与新对象不易混淆。 | 若无法从前台恢复，用户可能遇到看不见且不能重新使用的名称。 |
| B    | 已删除组合释放名称；如允许恢复且名称已被占用，恢复时要求改名。 | 用户可以重建同名组合，历史仍以原 ID 识别。           | 若提供恢复，需要处理名称冲突；新旧组合可能同名。           |

影响 FR-02、FR-03 与 CASE-07。设备物理删除后的名称释放和设备归档占名沿用各自生命周期，不据组合规则改变。

#### Q-08 删除后如何恢复设备组合

**Open。** D-09 已要求历史引用继续可用、新引用禁止。这里选择用户是否能够重新启用被删除的组合。

| 选项 | 用户操作                                                     | 优点                                           | 缺点                                                   |
| ---- | ------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| A    | 提供单独的已删除列表，用户可恢复；恢复后才可再次用于新关联。 | 误删后可自行恢复，既有引用和组合身份保持连续。 | 需要删除列表、恢复交互及名称冲突处理。                 |
| B    | 前台不提供恢复；用户需要时新建组合，原历史引用仍可读取。     | 前台流程简单，删除后的选择范围明确。           | 误删无法在界面恢复原组合，新建会产生新的组合身份。     |
| C    | 提供限时恢复入口，到期后隐藏恢复入口，但继续保留历史引用。   | 兼顾短期误删恢复与日常列表简洁。               | 需要确定期限及过期表现，用户可能在期限后无法自行恢复。 |

产品经理建议 B，理由是用归档承接可恢复场景。后端工程师建议 A，理由是允许误删后恢复原 ID。C 需要额外期限机制。影响 FR-03、交互、删除 API、名称冲突和 CASE-03。删除后的历史资料保留是 D-09 的既定约束，以上选项均须遵循。

### 产品与架构审查

本节记录评审依据与实现差距，工作方案不能覆盖 D-01～10。Q-07～08 仍待选择。优先确定删除及引用的语义，再确定名称、并发与历史行为。实现中的行版本用于并发控制，不代表前台需要展示版本。未来的素材与采集关联目前尚未实现，以下跨 Feature 选项属于设计输入。

#### 评审依据与实施边界

产品经理与后端工程师于 2026-11-21 独立审查，基线 HEAD 为 `f84442be5f16dd36f6cfff85a686ce30027dd383`。一致建议已合并为上方工作方案，Q-08 保留两人的不同建议。旧 `4c0cf4d` 结果仍只证明原运行基线。

组合创建的外层名称与配置内名称目前都可能传入，后者在保存时覆盖前者。实现查重前必须定义权威名称。D-09 涉及普通详情、列表、草稿、历史、设备引用摘要及 MCP 的访问边界。D-10 不要求移除内部并发令牌，现有前端 DTO 依赖历史字段，接口变化需协调调用方。

当前数据库对不匹配的旧 schema 会拒绝启动。增加删除标记或名称字段需设计已有数据库的前向升级、失败保全及验证。旧代码物理删除的记录不能从现有库自动恢复。选择器当前逐页加载全部设备，跨页结果并非固定快照。

#### 当前实现与目标的主要差距

| 范围       | 当前源码事实                                                                            | 产品影响与待确认项                                                                             |
| ---------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 组合删除   | `OpticalTrainService.delete_train` 在事务中删除当前配置、旧快照、默认指针和组合主记录。 | D-09 要求隐藏后保留既有引用，现状不满足。已物理删除的历史不能仅通过新规则找回。                |
| 设备删除   | `check_equipment_references` 扫描当前配置和旧快照，检查与删除在写事务中执行。           | 首版继续保护历史引用，后续能否放宽依赖历史自包含和回退策略。                                   |
| 归档选择   | 前端读取包含归档设备的列表并限制新选择，服务端组件校验目前只检查存在性与类型。          | 直接 API 仍可能新加入归档设备。并发归档和保存时，必须以服务端事务检查结果为准。                |
| 组合配置   | 当前 draft 优先，缺 draft 时读取旧默认或最近历史；保存时校验组件并更新行版本。          | 旧历史回退情况下，“已有引用”的判断必须以保存前有效配置为基准，不能只检查 draft 是否存在。      |
| 并发和提交 | 更新携带行版本，创建没有专门的幂等键；数据库写事务用于写入。                            | 双端编辑、名称竞争和网络超时有不同解决方式，需分别定规则。                                     |
| 历史展示   | 历史读取 API 仍存在，旧历史写入接口拒绝。                                               | D-10 约束用户界面；已有 MCP/API 兼容读取如何限制仍需评估。                                     |
| 自动化清理 | 当前测试通过 DELETE 后检查 404 与集合为空。                                             | D-09 实现后，普通列表为空与内部记录清除是两个不同结果，测试须采用评审合并的隔离 API 清理方案。 |

源码依据见 `astrophoto/equipment/service.py`、`trains.py`、`snapshots.py`、`astrophoto/api/equipment.py` 和 `frontend/src/features/library/pages/OpticalTrainEditor.tsx`。上述为静态核对，不构成测试通过。

#### 决策依赖与边界用例

先确认 Q-08 的恢复方式与 Q-07 的名称占用，再将工作方案落实到交互、技术、开发及测试文档。当前实现与历史测试仍按各自原基线记录。

| 边界场景                               | 需要明确的结果或验收                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 两个客户端同时创建同名对象             | 同一比较规则下最多一个成功，失败者保留输入；确认旧重名记录不被修改。                                   |
| 组合编辑与设备归档并发                 | 已保存引用可保留或移除，新引用拒绝；提交结果以事务中的状态为准。                                       |
| 删除请求成功但响应丢失                 | 再查状态能够区分已隐藏、仍存在和请求失败；重试不会清除历史或影响共享设备。                             |
| 删除后恢复、同名已被占用               | 根据 Q-07、Q-08 定义恢复是否拒绝及改名过程，历史 ID 与引用不变。                                       |
| 只有旧默认或旧最新历史、没有当前 draft | 把读取时选中的有效配置作为已有引用的判断依据，避免普通保存时误拒绝归档设备。                           |
| 后台历史引用指向缺失或损坏的设备       | 保留可读字段并报告缺失，不将未知值当作零；按历史保护及诊断工作方案处理，具体修复策略在技术设计中确定。 |
| 同一设备被多个组合引用                 | 删除或归档一个组合不能删除共享设备，也不能更改其他组合。                                               |
| 快速新增设备后取消组合编辑             | 已单独保存的设备仍存在；提示和清理由产品确认，测试应使用 API 对本次测试数据收尾。                      |
| 测试失败、进程中断、重复运行           | 已创建样本可识别，清理按隔离测试 API 工作方案执行；验证用户删除语义、历史可读与测试库最终清除。        |
| Unicode 名称、旧重名与归档恢复         | 单独覆盖大小写、全角空格、规范化、同名旧数据及恢复冲突；不更改既有记录 ID。                            |
| 规格为未知、0、精度边界或类型不符      | 区分未知与有效零值，遵循字段单位及类型约束；修改前后复核组合估算和已保存历史。                         |
| 数据库不可用或备份恢复中断             | 保留原数据并返回可诊断错误，避免在未知状态下重建为空库；跨实例合并另立需求。                           |

### 当前工作树核对

**Verified（静态，main@4c0cf4d 加当前工作树）**。Vue 当前仍显示「设备与光学链路」和「光学链路」，英文页签为 Optical Trains，D-04 的文案改名待实施。建议英文显示 Equipment Combinations。现有路由、数据和 MCP 工具名仍可用原标识。资料库是复用组件和页面目录的名称，Assets 页仍是占位。设备编辑包含四类字段与可折叠摘要，光路直接保存，允许快速新增独立设备并返回光路编辑。快速新增提交后设备独立持久化，即使随后放弃光路，也可在「我的设备」找回。编辑器当前未提供变更备注、旋转和平场适用性字段；服务接口存取这些值，已有值随配置保存。光路状态和筛选沿用 `published` 兼容值，用户界面显示“已配置”。历史发布与默认切换仅有旧证据，当前兼容入口用于读取。设备及组合的名称校验检查必填与长度，服务和模型没有同名写入守卫。当前编辑器排除新选的归档设备，仍显示已保存的归档引用；后端检查存在性与类型，尚未拒绝新增归档引用。单选筛选和不新增光学字段的规则与现状一致。 [交互规格](02_UI_UX.md#04-equipment) · [技术契约](03_TECH.md#04-equipment) · [测试计划](05_TEST_PLAN.md#04-equipment)

<a id="04-equipment-官网核验的临时验收数据"></a>

### 官网核验的临时验收数据

设备目录含 **50 条**，包括 9 款相机、12 款主光学设备、11 款光学配件和 18 个滤镜记录。滤镜均为厂家销售的独立产品或明确列出的套装片，覆盖全部 13 种现有滤镜类型。型号、具体变体及填入的产品规格于 2026-11-21 核对厂家产品页、规格图或手册。字段缺乏厂家依据时省略。枚举、短名称和规格文字按本项目字段约定转换。太阳滤镜只在设备目录中验证。

#### 设备创建数据

下列为有效 JSON。每项的 payload 对应设备创建请求，id 是本文的查找键，由测试人员映射到创建后的服务端 UUID。英文商品名用作默认自命名；中文搜索和重名用例可以另选名称，厂商、型号与规格保持原值。表后的来源和这里的键一一对应。

```json
[
    {
        "id": "C01",
        "payload": {
            "equipment_type": "camera",
            "name": "ZWO ASI533MC Pro",
            "manufacturer": "ZWO",
            "model": "ASI533MC Pro",
            "specs": {
                "sensor_name": "IMX533",
                "sensor_kind": "osc",
                "sensor_width_px": 3008,
                "sensor_height_px": 3008,
                "pixel_size_x_um": 3.76,
                "pixel_size_y_um": 3.76,
                "adc_bit_depth": 14,
                "cooling_supported": true
            }
        }
    },
    {
        "id": "C02",
        "payload": {
            "equipment_type": "camera",
            "name": "ZWO ASI533MM Pro",
            "manufacturer": "ZWO",
            "model": "ASI533MM Pro",
            "specs": {
                "sensor_name": "IMX533",
                "sensor_kind": "mono",
                "sensor_width_px": 3008,
                "sensor_height_px": 3008,
                "pixel_size_x_um": 3.76,
                "pixel_size_y_um": 3.76,
                "adc_bit_depth": 14,
                "cooling_supported": true
            }
        }
    },
    {
        "id": "C03",
        "payload": {
            "equipment_type": "camera",
            "name": "ZWO ASI2600MC Pro",
            "manufacturer": "ZWO",
            "model": "ASI2600MC Pro",
            "notes": "4×4 为相机软件合并的最大模式，硬件最大为 3×3。",
            "specs": {
                "sensor_name": "IMX571",
                "sensor_kind": "osc",
                "sensor_width_px": 6248,
                "sensor_height_px": 4176,
                "pixel_size_x_um": 3.76,
                "pixel_size_y_um": 3.76,
                "adc_bit_depth": 16,
                "cooling_supported": true,
                "max_bin_x": 4,
                "max_bin_y": 4
            }
        }
    },
    {
        "id": "C04",
        "payload": {
            "equipment_type": "camera",
            "name": "ZWO ASI2600MM Pro",
            "manufacturer": "ZWO",
            "model": "ASI2600MM Pro",
            "notes": "4×4 为相机软件合并的最大模式，硬件最大为 3×3。",
            "specs": {
                "sensor_name": "IMX571",
                "sensor_kind": "mono",
                "sensor_width_px": 6248,
                "sensor_height_px": 4176,
                "pixel_size_x_um": 3.76,
                "pixel_size_y_um": 3.76,
                "adc_bit_depth": 16,
                "cooling_supported": true,
                "max_bin_x": 4,
                "max_bin_y": 4
            }
        }
    },
    {
        "id": "C05",
        "payload": {
            "equipment_type": "camera",
            "name": "ZWO ASI294MM Pro",
            "manufacturer": "ZWO",
            "model": "ASI294MM Pro",
            "notes": "像素和采样规格采用 Bin 2。",
            "specs": {
                "sensor_name": "IMX492",
                "sensor_kind": "mono",
                "sensor_width_px": 4144,
                "sensor_height_px": 2822,
                "pixel_size_x_um": 4.63,
                "pixel_size_y_um": 4.63,
                "adc_bit_depth": 14,
                "cooling_supported": true
            }
        }
    },
    {
        "id": "C06",
        "payload": {
            "equipment_type": "camera",
            "name": "ZWO ASI585MC",
            "manufacturer": "ZWO",
            "model": "ASI585MC",
            "notes": "型号为非 Pro；产品样本省略 cooling_supported。",
            "specs": {
                "sensor_name": "IMX585",
                "sensor_kind": "osc",
                "sensor_width_px": 3840,
                "sensor_height_px": 2160,
                "pixel_size_x_um": 2.9,
                "pixel_size_y_um": 2.9,
                "adc_bit_depth": 12
            }
        }
    },
    {
        "id": "C07",
        "payload": {
            "equipment_type": "camera",
            "name": "QHYCCD QHY268M PH",
            "manufacturer": "QHYCCD",
            "model": "QHY268M PH",
            "notes": "采用有效成像尺寸，不含 overscan。",
            "specs": {
                "sensor_name": "IMX571",
                "sensor_kind": "mono",
                "sensor_width_px": 6252,
                "sensor_height_px": 4176,
                "pixel_size_x_um": 3.76,
                "pixel_size_y_um": 3.76,
                "adc_bit_depth": 16,
                "cooling_supported": true,
                "readout_modes": [
                    {
                        "mode_key": "0",
                        "display_name": "Photographic DSO Mode"
                    },
                    { "mode_key": "1", "display_name": "High Gain Mode" },
                    {
                        "mode_key": "2",
                        "display_name": "Extended Full Well Mode"
                    },
                    {
                        "mode_key": "3",
                        "display_name": "Extended Full Well Mode-2CMS"
                    },
                    {
                        "mode_key": "4",
                        "display_name": "Photographic DSO Mode-2CMS"
                    },
                    { "mode_key": "5", "display_name": "High Gain Mode-2CMS" }
                ]
            }
        }
    },
    {
        "id": "C08",
        "payload": {
            "equipment_type": "camera",
            "name": "Canon EOS 6D Mark II",
            "manufacturer": "Canon",
            "model": "EOS 6D Mark II",
            "notes": "保留像元间距，未将 RAW 输出尺寸或编码位深填为传感器尺寸或 ADC。",
            "specs": {
                "sensor_kind": "color",
                "pixel_size_x_um": 5.67,
                "pixel_size_y_um": 5.67
            }
        }
    },
    {
        "id": "C09",
        "payload": {
            "equipment_type": "camera",
            "name": "Canon EOS Ra",
            "manufacturer": "Canon",
            "model": "EOS Ra",
            "specs": {
                "sensor_kind": "color",
                "pixel_size_x_um": 5.36,
                "pixel_size_y_um": 5.36
            }
        }
    },
    {
        "id": "T01",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sky Rover Optics 80GP S (80APO PRO)",
            "manufacturer": "Sky Rover Optics",
            "model": "80GP S (80APO PRO)",
            "notes": "采用 2024 款规格；焦距和口径见产品页的规格图。",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "Air-spaced triplet APO (Super ED)",
                "aperture_mm": 80,
                "native_focal_length_mm": 480,
                "native_f_ratio": 6
            }
        }
    },
    {
        "id": "T02",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sky-Watcher Evostar 72ED",
            "manufacturer": "Sky-Watcher",
            "model": "Evostar 72ED",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "ED apochromatic doublet",
                "aperture_mm": 72,
                "native_focal_length_mm": 420,
                "native_f_ratio": 5.8
            }
        }
    },
    {
        "id": "T03",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sky-Watcher Quattro 150P",
            "manufacturer": "Sky-Watcher",
            "model": "Quattro 150P",
            "notes": "采用原生规格。",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "Newtonian",
                "aperture_mm": 150,
                "native_focal_length_mm": 600,
                "native_f_ratio": 4
            }
        }
    },
    {
        "id": "T04",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Celestron EdgeHD 8 Optical Tube Assembly (CGE Dovetail)",
            "manufacturer": "Celestron",
            "model": "EdgeHD 8 Optical Tube Assembly (CGE Dovetail)",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "EdgeHD",
                "aperture_mm": 203.2,
                "native_focal_length_mm": 2032,
                "native_f_ratio": 10
            }
        }
    },
    {
        "id": "T05",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "William Optics Cat 51 WIFD",
            "manufacturer": "William Optics",
            "model": "Cat 51 WIFD",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "4-element Petzval",
                "aperture_mm": 51,
                "native_focal_length_mm": 250,
                "native_f_ratio": 4.9,
                "image_circle_mm": 48
            }
        }
    },
    {
        "id": "T06",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sky-Watcher BK MAK127 OTAW",
            "manufacturer": "Sky-Watcher",
            "model": "BK MAK127 OTAW",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "Maksutov-Cassegrain",
                "aperture_mm": 127,
                "native_focal_length_mm": 1500,
                "native_f_ratio": 12
            }
        }
    },
    {
        "id": "T07",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Canon EF 135mm f/2L USM",
            "manufacturer": "Canon",
            "model": "EF 135mm f/2L USM",
            "specs": {
                "optics_kind": "lens",
                "optical_design": "10 elements in 8 groups",
                "native_focal_length_mm": 135,
                "native_f_ratio": 2
            }
        }
    },
    {
        "id": "T08",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sigma 135mm F1.8 DG HSM | Art (Canon EF)",
            "manufacturer": "Sigma",
            "model": "135mm F1.8 DG HSM | Art (Canon EF)",
            "specs": {
                "optics_kind": "lens",
                "optical_design": "13 elements in 10 groups",
                "native_focal_length_mm": 135,
                "native_f_ratio": 1.8
            }
        }
    },
    {
        "id": "T09",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Canon RF50mm F1.8 STM",
            "manufacturer": "Canon",
            "model": "RF50mm F1.8 STM",
            "specs": {
                "optics_kind": "lens",
                "optical_design": "6 elements in 5 groups",
                "native_focal_length_mm": 50,
                "native_f_ratio": 1.8
            }
        }
    },
    {
        "id": "T10",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Celestron C8 Optical Tube Assembly (CGE Dovetail)",
            "manufacturer": "Celestron",
            "model": "C8 Optical Tube Assembly (CGE Dovetail)",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "Schmidt-Cassegrain",
                "aperture_mm": 203.2,
                "native_focal_length_mm": 2032,
                "native_f_ratio": 10
            }
        }
    },
    {
        "id": "T11",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sky Rover Optics 86MA Multipurpose Astrograph",
            "manufacturer": "Sky Rover Optics",
            "model": "86MA Multipurpose Astrograph",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "Air-spaced quadruplet",
                "aperture_mm": 86,
                "native_focal_length_mm": 602,
                "native_f_ratio": 7,
                "image_circle_mm": 44
            }
        }
    },
    {
        "id": "T12",
        "payload": {
            "equipment_type": "primary_optics",
            "name": "Sky-Watcher Evostar 80EDX",
            "manufacturer": "Sky-Watcher",
            "model": "Evostar 80EDX",
            "specs": {
                "optics_kind": "telescope",
                "optical_design": "Apochromatic doublet",
                "aperture_mm": 80,
                "native_focal_length_mm": 600,
                "native_f_ratio": 7.5
            }
        }
    },
    {
        "id": "A01",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Sky Rover Optics 1x Field Flattener for 80 APO PRO",
            "manufacturer": "Sky Rover Optics",
            "model": "1x Field Flattener for 80 APO PRO",
            "specs": {
                "accessory_kind": "flattener",
                "nominal_factor": 1,
                "design_backfocus_mm": 55
            }
        }
    },
    {
        "id": "A02",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Sky Rover Optics 0.8x Reducer Flattener for 80/90 APO PRO",
            "manufacturer": "Sky Rover Optics",
            "model": "0.8x Reducer Flattener for 80/90 APO PRO",
            "notes": "厂家标注 80/90 APO PRO，未额外声明覆盖其他 GPS 代际。",
            "specs": {
                "accessory_kind": "reducer",
                "nominal_factor": 0.8,
                "design_backfocus_mm": 55
            }
        }
    },
    {
        "id": "A03",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Celestron Reducer Lens .7x - EdgeHD 800",
            "manufacturer": "Celestron",
            "model": "Reducer Lens .7x - EdgeHD 800",
            "specs": {
                "accessory_kind": "reducer",
                "nominal_factor": 0.7,
                "design_backfocus_mm": 105
            }
        }
    },
    {
        "id": "A04",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Celestron Reducer - Corrector #94175",
            "manufacturer": "Celestron",
            "model": "Reducer - Corrector #94175",
            "specs": {
                "accessory_kind": "reducer",
                "nominal_factor": 0.63,
                "design_backfocus_mm": 105
            }
        }
    },
    {
        "id": "A05",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Celestron Reducer Lens .7x - EdgeHD 925",
            "manufacturer": "Celestron",
            "model": "Reducer Lens .7x - EdgeHD 925",
            "specs": {
                "accessory_kind": "reducer",
                "nominal_factor": 0.7,
                "design_backfocus_mm": 146
            }
        }
    },
    {
        "id": "A06",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Sky-Watcher Focal Reducer - 80ED #20236",
            "manufacturer": "Sky-Watcher",
            "model": "Focal Reducer - 80ED #20236",
            "specs": { "accessory_kind": "reducer", "nominal_factor": 0.85 }
        }
    },
    {
        "id": "A07",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "William Optics FLAT 6AIII",
            "manufacturer": "William Optics",
            "model": "FLAT 6AIII",
            "specs": { "accessory_kind": "reducer", "nominal_factor": 0.8 }
        }
    },
    {
        "id": "A08",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Celestron X-Cel LX 2x Barlow Lens - 1.25 inch",
            "manufacturer": "Celestron",
            "model": "X-Cel LX 2x Barlow Lens - 1.25 inch",
            "specs": { "accessory_kind": "barlow", "nominal_factor": 2 }
        }
    },
    {
        "id": "A09",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Celestron X-Cel LX 3x Barlow Lens - 1.25 inch",
            "manufacturer": "Celestron",
            "model": "X-Cel LX 3x Barlow Lens - 1.25 inch",
            "specs": { "accessory_kind": "barlow", "nominal_factor": 3 }
        }
    },
    {
        "id": "A10",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "APM Telescopes APM Comacorrecting 1 1/4 inch ED Barlow 2.7x",
            "manufacturer": "APM Telescopes",
            "model": "APM Comacorrecting 1 1/4 inch ED Barlow 2.7x",
            "notes": "后焦测量基准为最后一片镜片的中部。",
            "specs": {
                "accessory_kind": "barlow",
                "nominal_factor": 2.7,
                "design_backfocus_mm": 105,
                "clear_aperture_mm": 22
            }
        }
    },
    {
        "id": "A11",
        "payload": {
            "equipment_type": "optical_accessory",
            "name": "Baader Planetarium VIP Modular Barlow 2x",
            "manufacturer": "Baader Planetarium",
            "model": "VIP Modular Barlow 2x",
            "specs": {
                "accessory_kind": "barlow",
                "nominal_factor": 2,
                "clear_aperture_mm": 28
            }
        }
    },
    {
        "id": "F01",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia LRGB-V Pro L 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "LRGB-V Pro L 36mm Unmounted",
            "specs": {
                "filter_kind": "l",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted"
            }
        }
    },
    {
        "id": "F02",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia LRGB-V Pro R 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "LRGB-V Pro R 36mm Unmounted",
            "specs": {
                "filter_kind": "r",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted"
            }
        }
    },
    {
        "id": "F03",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia LRGB-V Pro G 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "LRGB-V Pro G 36mm Unmounted",
            "specs": {
                "filter_kind": "g",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted"
            }
        }
    },
    {
        "id": "F04",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia LRGB-V Pro B 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "LRGB-V Pro B 36mm Unmounted",
            "specs": {
                "filter_kind": "b",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted"
            }
        }
    },
    {
        "id": "F05",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia 3nm H-alpha Pro 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "3nm H-alpha Pro 36mm Unmounted",
            "specs": {
                "filter_kind": "ha",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted",
                "passbands": [
                    {
                        "band_label": "H-alpha",
                        "center_nm": 656.3,
                        "fwhm_nm": 3
                    }
                ]
            }
        }
    },
    {
        "id": "F06",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia 3nm Oxygen III Pro 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "3nm Oxygen III Pro 36mm Unmounted",
            "specs": {
                "filter_kind": "oiii",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted",
                "passbands": [
                    { "band_label": "OIII", "center_nm": 500.7, "fwhm_nm": 3 }
                ]
            }
        }
    },
    {
        "id": "F07",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia 3nm Sulfur II Pro 36mm Unmounted",
            "manufacturer": "Antlia",
            "model": "3nm Sulfur II Pro 36mm Unmounted",
            "specs": {
                "filter_kind": "sii",
                "physical_size_mm": 36,
                "filter_format": "36 mm unmounted",
                "passbands": [
                    { "band_label": "SII", "center_nm": 672.4, "fwhm_nm": 3 }
                ]
            }
        }
    },
    {
        "id": "F08",
        "payload": {
            "equipment_type": "filter",
            "name": "Astronomik CLS CCD 2-inch (M48)",
            "manufacturer": "Astronomik",
            "model": "CLS CCD 2-inch (M48)",
            "specs": {
                "filter_kind": "broadband",
                "filter_format": "2-inch M48 mounted"
            }
        }
    },
    {
        "id": "F09",
        "payload": {
            "equipment_type": "filter",
            "name": "Optolong UV/IR Cut 2-inch mounted",
            "manufacturer": "Optolong",
            "model": "UV/IR Cut 2-inch mounted",
            "specs": {
                "filter_kind": "uv_ir_cut",
                "filter_format": "2-inch mounted"
            }
        }
    },
    {
        "id": "F10",
        "payload": {
            "equipment_type": "filter",
            "name": "Baader Planetarium Solar Continuum 540nm 7.5nm 2-inch",
            "manufacturer": "Baader Planetarium",
            "model": "Solar Continuum 540nm 7.5nm 2-inch",
            "specs": {
                "filter_kind": "solar",
                "filter_format": "2-inch",
                "passbands": [
                    {
                        "band_label": "Solar Continuum",
                        "center_nm": 540,
                        "fwhm_nm": 7.5
                    }
                ]
            }
        }
    },
    {
        "id": "F11",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia ALP-T Dual Band 3nm SII&OIII 2-inch Mounted",
            "manufacturer": "Antlia",
            "model": "ALP-T Dual Band 3nm SII&OIII 2-inch Mounted",
            "specs": {
                "filter_kind": "dual_band",
                "filter_format": "2-inch M48x0.75 mounted",
                "passbands": [
                    { "band_label": "SII", "center_nm": 672.4, "fwhm_nm": 3 },
                    { "band_label": "OIII", "center_nm": 500.7, "fwhm_nm": 3 }
                ]
            }
        }
    },
    {
        "id": "F12",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia Quad Band Anti-Light Pollution 2-inch Mounted",
            "manufacturer": "Antlia",
            "model": "Quad Band Anti-Light Pollution 2-inch Mounted",
            "specs": {
                "filter_kind": "multi_band",
                "filter_format": "2-inch mounted"
            }
        }
    },
    {
        "id": "F13",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia Methane CH4 1.25-inch Mounted",
            "manufacturer": "Antlia",
            "model": "Methane CH4 1.25-inch Mounted",
            "specs": {
                "filter_kind": "other",
                "filter_format": "1.25-inch M28.5x0.6 mounted",
                "passbands": [{ "band_label": "CH4", "center_nm": 889 }]
            }
        }
    },
    {
        "id": "F14",
        "payload": {
            "equipment_type": "filter",
            "name": "Optolong L-eXtreme 2-inch mounted",
            "manufacturer": "Optolong",
            "model": "L-eXtreme 2-inch mounted",
            "specs": {
                "filter_kind": "dual_band",
                "filter_format": "2-inch mounted",
                "passbands": [
                    {
                        "band_label": "H-alpha",
                        "center_nm": 656.3,
                        "fwhm_nm": 7
                    },
                    { "band_label": "OIII", "center_nm": 500.7, "fwhm_nm": 7 }
                ]
            }
        }
    },
    {
        "id": "F15",
        "payload": {
            "equipment_type": "filter",
            "name": "Optolong L-eXtreme EOS-R Clip-in",
            "manufacturer": "Optolong",
            "model": "L-eXtreme EOS-R Clip-in",
            "specs": {
                "filter_kind": "dual_band",
                "filter_format": "Canon EOS R clip-in",
                "passbands": [
                    { "band_label": "H-alpha", "fwhm_nm": 7 },
                    { "band_label": "OIII", "fwhm_nm": 7 }
                ]
            }
        }
    },
    {
        "id": "F16",
        "payload": {
            "equipment_type": "filter",
            "name": "Optolong IR Pass685 1.25-inch Mounted",
            "manufacturer": "Optolong",
            "model": "IR Pass685 1.25-inch Mounted",
            "specs": {
                "filter_kind": "other",
                "filter_format": "1.25-inch mounted"
            }
        }
    },
    {
        "id": "F17",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia 3nm Oxygen III Pro 50x50mm Square Unmounted",
            "manufacturer": "Antlia",
            "model": "3nm Oxygen III Pro 50x50mm Square Unmounted",
            "specs": {
                "filter_kind": "oiii",
                "filter_format": "50 × 50 mm square unmounted",
                "passbands": [
                    { "band_label": "OIII", "center_nm": 500.7, "fwhm_nm": 3 }
                ]
            }
        }
    },
    {
        "id": "F18",
        "payload": {
            "equipment_type": "filter",
            "name": "Antlia ALP-T Dualband 3nm Ha&OIII 2-inch Mounted",
            "manufacturer": "Antlia",
            "model": "ALP-T Dualband 3nm Ha&OIII 2-inch Mounted",
            "specs": {
                "filter_kind": "dual_band",
                "filter_format": "2-inch M48x0.75 mounted",
                "passbands": [
                    {
                        "band_label": "H-alpha",
                        "center_nm": 656.3,
                        "fwhm_nm": 3
                    },
                    { "band_label": "OIII", "center_nm": 500.7, "fwhm_nm": 3 }
                ]
            }
        }
    }
]
```

#### 逐条厂家来源

| 编号 | 产品                                                        | 官网来源                                                                                                                                                                                             |
| ---- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C01  | ZWO ASI533MC Pro                                            | [规格](https://us.zwoastro.com/collections/dso_cooled_cameras/products/asi533-pro-series) · [补充依据 2](https://i.zwoastro.com/wp-content/uploads/2024/07/9f26af0bec5c60ea84107dfec8314859.pdf)     |
| C02  | ZWO ASI533MM Pro                                            | [规格](https://us.zwoastro.com/collections/dso_cooled_cameras/products/asi533-pro-series) · [补充依据 2](https://i.zwoastro.com/wp-content/uploads/2024/07/9f26af0bec5c60ea84107dfec8314859.pdf)     |
| C03  | ZWO ASI2600MC Pro                                           | [规格](https://www.zwoastro.com/product/asi2600/) · [补充依据 2](https://i.zwoastro.com/zwo-website/manuals/ZWO_ASI2600_Manual_EN.pdf)                                                               |
| C04  | ZWO ASI2600MM Pro                                           | [规格](https://www.zwoastro.com/product/asi2600/) · [补充依据 2](https://i.zwoastro.com/zwo-website/manuals/ZWO_ASI2600_Manual_EN.pdf)                                                               |
| C05  | ZWO ASI294MM Pro                                            | [规格](https://i.zwoastro.com/zwo-website/manuals/ASI294_Manual_EN_V2.2.pdf)                                                                                                                         |
| C06  | ZWO ASI585MC                                                | [规格](https://us.zwoastro.com/products/asi585mc-mm) · [补充依据 2](https://i.zwoastro.com/zwo-website/manuals/ASI585_Manual_EN_V1.0.pdf)                                                            |
| C07  | QHYCCD QHY268M PH                                           | [规格](https://www.qhyccd.com/astronomical-camera-qhy268/)                                                                                                                                           |
| C08  | Canon EOS 6D Mark II                                        | [规格](https://www.usa.canon.com/support/p/eos-6d-mark-ii)                                                                                                                                           |
| C09  | Canon EOS Ra                                                | [规格](https://www.usa.canon.com/support/p/eos-ra) · [补充依据 2](https://downloads.canon.com/nw/camera/products/eos/ra/specs/eos-ra-specifications.pdf)                                             |
| T01  | Sky Rover Optics 80GP S (80APO PRO)                         | [规格](https://skyroveroptics.com/products/80-apo-pro-f-6-telescope) · [补充依据 2](https://cdn.shopify.com/s/files/1/0661/3873/4829/files/D1_23f611d8-4514-4422-ad24-924cfe72f20d.png?v=1786692548) |
| T02  | Sky-Watcher Evostar 72ED                                    | [规格](https://skywatcher.com/product/evostar-72ed/)                                                                                                                                                 |
| T03  | Sky-Watcher Quattro 150P                                    | [规格](https://skywatcher.com/product/quattro-150p/)                                                                                                                                                 |
| T04  | Celestron EdgeHD 8 Optical Tube Assembly (CGE Dovetail)     | [规格](https://www.celestron.com/products/edgehd-8-optical-tube-assembly-cge-dovetail/)                                                                                                              |
| T05  | William Optics Cat 51 WIFD                                  | [规格](https://williamoptics.com/products/cat-51)                                                                                                                                                    |
| T06  | Sky-Watcher BK MAK127 OTAW                                  | [规格](https://www.skywatcher.com/product/bk-mak127-otaw/)                                                                                                                                           |
| T07  | Canon EF 135mm f/2L USM                                     | [规格](https://www.usa.canon.com/support/p/ef-135mm-f-2l-usm)                                                                                                                                        |
| T08  | Sigma 135mm F1.8 DG HSM \| Art (Canon EF)                   | [规格](https://www.sigma-global.com/en/lenses/a017_135_18/)                                                                                                                                          |
| T09  | Canon RF50mm F1.8 STM                                       | [规格](https://www.usa.canon.com/support/p/rf50mm-f1-8-stm)                                                                                                                                          |
| T10  | Celestron C8 Optical Tube Assembly (CGE Dovetail)           | [规格](https://www.celestron.com/products/c8-optical-tube-assembly-cge-dovetail)                                                                                                                     |
| T11  | Sky Rover Optics 86MA Multipurpose Astrograph               | [规格](https://skyroveroptics.com/products/86ma-multipurpose-astrograph-telescope)                                                                                                                   |
| T12  | Sky-Watcher Evostar 80EDX                                   | [规格](https://skywatcher.com/product/evostar-80edx/)                                                                                                                                                |
| A01  | Sky Rover Optics 1x Field Flattener for 80 APO PRO          | [规格](https://skyroveroptics.com/products/sky-rover-1x-field-flattener-photography-25-inches-full-frame-accessary-for-8090102130155-apo-pro)                                                        |
| A02  | Sky Rover Optics 0.8x Reducer Flattener for 80/90 APO PRO   | [规格](https://www.sky-rover.com/showproject.asp?ProdNum=222)                                                                                                                                        |
| A03  | Celestron Reducer Lens .7x - EdgeHD 800                     | [规格](https://www.celestron.com/products/reducer-lens-7x-edgehd-800)                                                                                                                                |
| A04  | Celestron Reducer - Corrector #94175                        | [规格](https://www.celestron.com/products/reducer-corrector) · [补充依据 2](https://www.celestron.com/blogs/knowledgebase/understanding-focal-reducers)                                              |
| A05  | Celestron Reducer Lens .7x - EdgeHD 925                     | [规格](https://www.celestron.com/products/reducer-lens-7x-edgehd-925)                                                                                                                                |
| A06  | Sky-Watcher Focal Reducer - 80ED #20236                     | [规格](https://skywatcher.com/product/focal-reducer-80ed/) · [补充依据 2](https://skywatcher.com/product/evostar-80edx/)                                                                             |
| A07  | William Optics FLAT 6AIII                                   | [规格](https://williamoptics.com/products/flat6Aiii)                                                                                                                                                 |
| A08  | Celestron X-Cel LX 2x Barlow Lens - 1.25 inch               | [规格](https://www.celestron.com/products/x-cel-lx-2x-barlow-lens-125in)                                                                                                                             |
| A09  | Celestron X-Cel LX 3x Barlow Lens - 1.25 inch               | [规格](https://www.celestron.com/products/x-cel-lx-3x-barlow-lens-125in)                                                                                                                             |
| A10  | APM Telescopes APM Comacorrecting 1 1/4 inch ED Barlow 2.7x | [规格](https://www.apm-telescopes.net/en/apm-comacorrecting-1-14-ed-barlow-27-x)                                                                                                                     |
| A11  | Baader Planetarium VIP Modular Barlow 2x                    | [规格](https://www.baader-planetarium.com/en/vip-2x-modular-barlow-lens-visual-and-photographic.html)                                                                                                |
| F01  | Antlia LRGB-V Pro L 36mm Unmounted                          | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted)                                                                                                       |
| F02  | Antlia LRGB-V Pro R 36mm Unmounted                          | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted)                                                                                                       |
| F03  | Antlia LRGB-V Pro G 36mm Unmounted                          | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted)                                                                                                       |
| F04  | Antlia LRGB-V Pro B 36mm Unmounted                          | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted)                                                                                                       |
| F05  | Antlia 3nm H-alpha Pro 36mm Unmounted                       | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-h-alpha-ha-pro-filter-36mm-unmounted)                                                                                            |
| F06  | Antlia 3nm Oxygen III Pro 36mm Unmounted                    | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-oxygen-iii-oiii-pro-filter-36mm-unmounted)                                                                                       |
| F07  | Antlia 3nm Sulfur II Pro 36mm Unmounted                     | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-sulfur-ii-sii-pro-filter-36mm-unmounted)                                                                                         |
| F08  | Astronomik CLS CCD 2-inch (M48)                             | [规格](https://www.astronomik.com/en/Astronomik-CLS-CCD-2-M48/10208200) · [补充依据 2](https://www.astronomik.com/en/Light-Pollution/CLS-CCD/)                                                       |
| F09  | Optolong UV/IR Cut 2-inch mounted                           | [规格](https://www.optolong.com/index.php/cms/document/detail/id/146.html)                                                                                                                           |
| F10  | Baader Planetarium Solar Continuum 540nm 7.5nm 2-inch       | [规格](https://www.baader-planetarium.com/en/7.5nm-solar-continuum-filter-540nm.html)                                                                                                                |
| F11  | Antlia ALP-T Dual Band 3nm SII&OIII 2-inch Mounted          | [规格](https://shop.antliafilter.com/products/antlia-alp-t-dual-band-3nm-sii-oiii-filter-2-mounted)                                                                                                  |
| F12  | Antlia Quad Band Anti-Light Pollution 2-inch Mounted        | [规格](https://shop.antliafilter.com/products/antlia-quad-band-anti-light-pollution-filter-2-mounted)                                                                                                |
| F13  | Antlia Methane CH4 1.25-inch Mounted                        | [规格](https://shop.antliafilter.com/products/antlia-methane-ch4-filter-1-25-mounted)                                                                                                                |
| F14  | Optolong L-eXtreme 2-inch mounted                           | [规格](https://www.optolong.com/cms/document/detail/id/100.html) · [补充依据 2](https://www.optolong.com/cms/document/detail/id/485.html)                                                            |
| F15  | Optolong L-eXtreme EOS-R Clip-in                            | [规格](https://www.optolong.com/cms/document/detail/id/612.html)                                                                                                                                     |
| F16  | Optolong IR Pass685 1.25-inch Mounted                       | [规格](https://www.optolong.com/cms/document/detail/id/102.html)                                                                                                                                     |
| F17  | Antlia 3nm Oxygen III Pro 50x50mm Square Unmounted          | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-oxygen-iii-oiii-pro-filter-50mm-x-50mm-square-unmounted)                                                                         |
| F18  | Antlia ALP-T Dualband 3nm Ha&OIII 2-inch Mounted            | [规格](https://shop.antliafilter.com/products/antlia-alp-t-dualband-3nm-ha-oiii-filter-2-mounted)                                                                                                    |

#### 设备组合数据

16 条组合覆盖彩色及单色深空、固定焦距镜头、原生平场、减焦、行星、空组合、不完整组合和多配件顺序。每个有部件的组合均可通过编号查到上表逐件官网证据。厂家明确确认的主镜配套见各组合的 scope，其余是用户在应用中可以登记的用例。这里的滤镜为可选集合。应用当前校验角色、已登记身份和引用关系；光学接口、后截距或整套实体配合需要独立证据。空组合、排序和故障状态是应用数据，厂家无对应商品。

以下为有效 JSON 组合定义。只将 name 和已解析的 UUID 字段写入服务。camera_ref → camera_id，primary_optics_ref → primary_optics_id，accessory_refs → accessory_ids，filter_refs → filter_ids，数组次序保留。使用已有创建接口接收的 draft 对象，拒绝用固定的假 UUID 替代实际记录。

```json
[
    {
        "id": "G01",
        "name": "80APO PRO 彩色平场",
        "camera_ref": "C01",
        "primary_optics_ref": "T01",
        "accessory_refs": ["A01"],
        "filter_refs": ["F09", "F14"],
        "scope": "厂家确认 T01 与 A01 的配套；相机和滤镜为应用登记样本。"
    },
    {
        "id": "G02",
        "name": "80APO PRO 彩色减焦",
        "camera_ref": "C01",
        "primary_optics_ref": "T01",
        "accessory_refs": ["A02"],
        "filter_refs": ["F14"],
        "scope": "A02 官网列 80 APO PRO；与 G01 共用设备，平场镜与减焦镜分两套配置。"
    },
    {
        "id": "G03",
        "name": "80APO PRO 单色 LRGB 与窄带",
        "camera_ref": "C04",
        "primary_optics_ref": "T01",
        "accessory_refs": ["A01"],
        "filter_refs": ["F01", "F02", "F03", "F04", "F05", "F06", "F07"],
        "scope": "七片是可用滤镜集合。"
    },
    {
        "id": "G04",
        "name": "Cat 51 原生平场",
        "camera_ref": "C03",
        "primary_optics_ref": "T05",
        "accessory_refs": [],
        "filter_refs": ["F08"],
        "scope": "主镜官网说明无需外置平场镜，验证空配件。"
    },
    {
        "id": "G05",
        "name": "Newtonian f/4 行星目录",
        "camera_ref": "C06",
        "primary_optics_ref": "T03",
        "accessory_refs": ["A10"],
        "filter_refs": ["F16"],
        "scope": "APM 指明面向 f/4 抛物面牛顿镜，按光学类型匹配，整套组合未做实物装调。"
    },
    {
        "id": "G06",
        "name": "EdgeHD 8 0.7x 深空目录",
        "camera_ref": "C03",
        "primary_optics_ref": "T04",
        "accessory_refs": ["A03"],
        "filter_refs": ["F12"],
        "scope": "Celestron 确认 A03 针对 EdgeHD 8。"
    },
    {
        "id": "G07",
        "name": "C8 0.63x 深空目录",
        "camera_ref": "C02",
        "primary_optics_ref": "T10",
        "accessory_refs": ["A04"],
        "filter_refs": ["F11"],
        "scope": "Celestron 明确 A04 适配标准型 C8，不适用于 EdgeHD。"
    },
    {
        "id": "G08",
        "name": "MA 86 原生焦面",
        "camera_ref": "C07",
        "primary_optics_ref": "T11",
        "accessory_refs": [],
        "filter_refs": [],
        "scope": "厂家提供原生平场和 44 mm 像圈；验证滤镜与配件皆空。"
    },
    {
        "id": "G09",
        "name": "Canon 6D Mark II EF 广域",
        "camera_ref": "C08",
        "primary_optics_ref": "T07",
        "accessory_refs": [],
        "filter_refs": [],
        "scope": "同品牌 EF 卡口场景；镜头口径未填，验证 UI 保留已知焦距，口径缺失时不推算有效焦比。"
    },
    {
        "id": "G10",
        "name": "EOS Ra RF 星野与卡入式滤镜",
        "camera_ref": "C09",
        "primary_optics_ref": "T09",
        "accessory_refs": [],
        "filter_refs": ["F15"],
        "scope": "Canon RF 卡口及 Optolong 对 EOS Ra 的卡入兼容分别由厂家确认。"
    },
    {
        "id": "G11",
        "name": "MK127 行星目录",
        "camera_ref": "C06",
        "primary_optics_ref": "T06",
        "accessory_refs": ["A08"],
        "filter_refs": ["F13"],
        "scope": "测试登记行星相机、巴罗与甲烷滤镜，整套机械间距未验证。"
    },
    {
        "id": "G12",
        "name": "80EDX 0.85x 深空目录",
        "camera_ref": "C05",
        "primary_optics_ref": "T12",
        "accessory_refs": ["A06"],
        "filter_refs": ["F18"],
        "scope": "主镜官网将 20236 列为配套减焦平场镜。"
    },
    {
        "id": "G13",
        "name": "待采购相机 · 72ED",
        "camera_ref": null,
        "primary_optics_ref": "T02",
        "accessory_refs": [],
        "filter_refs": [],
        "scope": "只选主光学；验证部分配置。"
    },
    {
        "id": "G14",
        "name": "待选择主镜 · QHY268M PH",
        "camera_ref": "C07",
        "primary_optics_ref": null,
        "accessory_refs": [],
        "filter_refs": [],
        "scope": "只选相机；验证部分配置。"
    },
    {
        "id": "G15",
        "name": "等候采购的空组合",
        "camera_ref": null,
        "primary_optics_ref": null,
        "accessory_refs": [],
        "filter_refs": [],
        "scope": "仅定义用户自命名，验证空配置。"
    },
    {
        "id": "G16",
        "name": "顺序校验专用组合",
        "camera_ref": "C01",
        "primary_optics_ref": "T01",
        "accessory_refs": ["A01", "A02"],
        "filter_refs": ["F09", "F14"],
        "scope": "只用于软件排列、拒绝和撤销用例，组合中的两件配件不得从此样本推断为可一起装机。"
    }
]
```

#### 派生数据、运行隔离与清理

- 正常路径取上方真实型号和规格。翻页、重名和并发派生用已核验型号创建不同测试记录实例。拒绝用例在副本中单独改变一个输入或状态，例如重复引用、空名称、无效版本和过期游标，错误值不入目录。
- 先创建一次性 ASTROPHOTO_HOME 和独立的回环测试宿主目录，真实宿主或 aiohttp fixture 内创建；分组记录 UUID、版本和回执。重复操作前查实际创建状态。测试中断恢复仅检查属于该运行的目录。
- 当前实现的测试在每个用例结束后，通过设备 API 先删除本次设备组合再删除设备，验证 DELETE 回执、详情 404 和集合为空。跨重启两阶段视为一个用例。D-09 落地后，用户删除将保留历史，普通列表为空和 404 无法证明物理清除，测试须按隔离 API 工作方案更新，并继续满足用户逐次 API 清理要求。随后停止测试宿主或关闭数据库连接，清理隔离环境并保留脱敏结果。
- 2026-11-21 使用当前设备和设备组合服务，在一次性 SQLite 数据根创建并重读 50 条设备及 16 条组合，13 条已配置、3 条部分配置。将临时设备实例扩至 101 条，以 1、50、100 的页长遍历，无遗漏或重复。退出后临时库已清除。此结果覆盖数据接纳、引用及分页，浏览器、MCP 和负向用例按计划另验。具体组合生命周期、隔离与失败断言见 [测试矩阵](05_TEST_PLAN.md#04-equipment-官网样本覆盖与执行顺序)。

### 需求评审闭环与下游传播

1. **R1／R2 已完成回溯与场景质询。** 沿用 FR-01～05，并使用现行 Vue、服务和历史证据交叉核对。
2. **R3 已回填 D-04～10。** 应用名称、重名、归档引用、筛选、表单以及删除历史和前台版本展示的用户决定。Q-07～08 保留开放，其余评审结论已合并为工作方案。UI 词条、重名服务校验、归档新增校验与组合删除语义属于待实施差异，既有证据按原基线保留。
3. **R4 待执行。** 代码实现后按测试计划集中复验。记录临时样本、实际受测版本、并发结果与数据清理。结果与决定不符时回流到对应 FR、Q 或实现说明。

CASE-01～06 保留编号，CASE-03 的组合删除预期需按 D-09 更新。CASE-07 核对创建与改名的重复提示及并发，CASE-08 核对两列表单选筛选及会话边界。Q-07～08 确认后同步受影响的界面、技术、开发和测试文档。 [Feature 索引](00_FEATURE_INDEX.md#04-equipment) · [界面](02_UI_UX.md#04-equipment) · [技术设计](03_TECH.md#04-equipment) · [开发规格](04_DEV.md#04-equipment) · [测试计划](05_TEST_PLAN.md#04-equipment)

<a id="05-mcp"></a>

## MCP 诊断与设备只读查询

**版本** v0.8 · 2026-11-21 · 补齐程序化验收约束
**身份** `mcp-diagnostics-equipment-read` · 首版软件历史基线 0.0.1

本稿保留 FR-01～05、D-01～03 及原 Q-01～03，新增 Q-04～16。代码基线为 main@4c0cf4d 加当前工作树。Confirmed 来自已有用户决定或采纳基线，Inferred 从已交付行为回溯，Proposed 为本轮建议，Open 等待事实或选择。源码事实、架构推断和历史实测分别标注。

### 背景、目标与使用者

本机用户希望从独立 MCP 客户端知道 ComfyUI 和 AstroPhoto 是否可用，并能决定是否向该客户端开放设备和设备组合读取。成功信号是协议兼容、诊断结论与实际调用相符，受权读取及越权阻断均可验证。

本机用户安装 MCP 并设置宿主地址及是否授权。MCP 客户端管理进程，Agent 只发现和调用实际开放的工具。ComfyUI/Extension 持有数据和权限裁决。发布维护者确认独立安装与两个发行渠道的顺序。

### 业务对象及集成边界

一个独立 MCP 安装有自己的版本和配置。客户端经 stdio 会话枚举和调用工具。配置的 ComfyUI 地址是诊断目标，本机凭据只用于设备读取。设备、设备组合及兼容快照由 Extension 管理，MCP 只消费查询结果。产品文档使用「设备组合」，现有 `optical_train_*` 工具名、`/optical-trains` 路径和参数沿用既有契约。

[扩展](../08-comfyui-extension-drawing/01_PRD.md) · [设备](01_PRD.md#04-equipment)

### 主要场景

- S-01 客户端启动 `astrophoto-mcp`，进行 initialize/list/call；默认看到版本和连接诊断。
- S-02 用户指定宿主 URL 或沿用默认地址。诊断区分宿主正常但扩展未注册、HTTP 错误、断连、超时和返回不合法。
- S-03 用户显式配置受信直连和只读凭据后，客户端可枚举六个查询并读取分页、详情或历史。错凭据有工具级错误，不能写。
- S-04 从独立安装包启动并核对版本与协议。正式发布先确保同版本 MCP 可从 PyPI 安装，再发布 Extension。
- S-05 替换或撤销本机读凭据，分别验证旧会话、新会话与基础诊断。当前支持经宿主重启替换单一凭据，客户端进程重启后读取自己的新环境。
- S-06 宿主运行但设备不可读。操作者要分辨错误地址、缺扩展路由、部署未受信、凭据失效、数据库不可用和目标记录不存在，并知道可以采取哪一步恢复。
- S-07 Agent 分页读取时，用户可能在宿主编辑、归档或删除设备。Agent 要知道分页与历史结果的语义，避免把跨页变化误当作完整清单。
- S-08 发布者交叉验证客户端、MCP 包、ComfyUI 和扩展版本。交付时分别观察本地构件、授权端到端和公开渠道的状态。

### 状态、权限与异常规则

Python 最低 3.11。MCP 由客户端启动，stdout 承载协议，日志走 stderr。地址优先级为 `--comfy-url`、`COMFYUI_URL`、默认 `http://127.0.0.1:8188`。诊断可用合规 HTTP(S) 和路径前缀，拒绝空配置、内嵌凭证、查询和片段。分页默认 50、范围 1–100，查询最长 120 字符，记录和游标用规范 UUID。

设备权限使用显式受信的单用户 ComfyUI。宿主需开启 `ASTROPHOTO_LOCAL_STORAGE=1`、只监听回环且关闭 CORS 配置，两端各在私有进程环境读取同一 `ASTROPHOTO_EQUIPMENT_READ_TOKEN`。凭据格式为 43–256 个 ASCII 字母数字、`-` 或 `_`。MCP 只对回环 IP 字面量根路径注册设备工具，localhost 可用于基础诊断。设备 HTTP 不使用环境代理、不跟随重定向，宿主对每次请求重新鉴权。凭据值不得进入命令、共享配置、工具输出和测试证据。

#### 工具返回的对象

| 工具                                                     | 用户可查询的内容                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| version                                                  | 当前 MCP 安装的名称和版本。                                                                |
| connection_status                                        | 宿主是否可达、是否发现扩展节点以及宿主系统信息。旧版正常响应不含扩展发行版本。             |
| equipment_list / equipment_get                           | 按设备类别、文字及归档筛选的分页，或指定设备的规格与引用。                                 |
| optical_train_list / optical_train_get                   | 按文字和归档获取设备组合分页，或读取当前配置和所用设备。当前工具未提供独立的可用状态筛选。 |
| optical_train_revision_list / optical_train_revision_get | 读取指定设备组合旧版本摘要，或按设备组合 ID 和修订 ID 查兼容快照。                         |

#### 注册、授权与撤销

| 场景                                   | 用户可观察的结果                                                                                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 缺少凭据、格式错误、非回环 IP 或子路径 | 基础诊断仍可枚举。设备工具不注册。有效诊断地址可以是 `localhost` 或带代理路径，设备直连只接受根路径的回环 IP 字面量。                                                            |
| 格式合法，实际凭据或部署不匹配         | 设备工具仍可枚举，调用由宿主拒绝。诊断可达表示公共端点工作，并不能确认设备访问已授权。                                                                                           |
| 正确凭据、可信宿主、直连 GET           | 可读设备及设备组合全库，包括显式请求的归档记录与兼容历史。无旧修订的新记录正常返回空历史列表。                                                                                   |
| 正确读凭据请求已有写路由               | 宿主在进入业务动作前返回 403。验证既有记录、版本和引用不变。同源浏览器的写授权由独立分支处理。                                                                                   |
| 替换或撤销凭据                         | 当前两端各在初始化时读取配置。宿主重启使用新配置后，旧客户端保持原工具列表，但后续读请求应返回 403。新客户端可用新凭据读取。清除宿主凭据并重启可撤销 Bearer 读，基础诊断仍可用。 |

设备 API 稳定后再执行当前宿主的全链路验收。冻结时至少确定六个 GET 的路由、分页与 DTO、当前组合配置、历史快照样本及拒绝码。基础诊断和本地 wheel 安装可提前验证。

### 交付范围与非目标

提供独立 stdio、诊断、条件只读工具、兼容契约及双包发行边界。没有独立业务数据库、HTTP MCP 服务、后台守护、自动启动宿主、业务写权限、Canvas Bridge、Siril 或素材操作工具。产品 Skills 目前无可执行交付，未来仅可依赖已有且验证的 Tools。

**已确认的测试方式（2026-11-21）**。MCP 验收由 pytest 和程序化客户端执行。测试代码指定工具名、参数、夹具与断言，覆盖进程内调用、stdio 子进程、隔离宿主和独立构件。LLM 推理、Agent 自主选工具、动态对话与第三方 Agent 界面均不作为本 Feature 的运行门槛。真实宿主验收同样由固定脚本执行。 [测试计划](05_TEST_PLAN.md#05-mcp-程序化测试分层)

### 功能需求与验收

#### FR-01 独立进程与默认诊断

**状态、必要性及场景** Confirmed · 首版必要 · S-01/S-02。

独立运行默认两个无参工具。`version` 仅表示 MCP 本地安装版本。`connection_status` 返回 reachable、extension_registered 和 system，从真实宿主取得事实。

首版保留现有基础诊断的工具名和输出。

**验收** 真实 stdio 握手可枚举及调用。宿主查不到节点且返回 200 空结果时是未注册；404/500、非法 JSON、断连和超时成为 MCP tool error。 [CASE-01](05_TEST_PLAN.md#05-mcp)

#### FR-02 受权设备/设备组合查询

**状态、必要性及场景** Confirmed · 首版必要 · S-03。

具备本机直连和有效配置时增加 `equipment_list/get`、`optical_train_list/get`、`optical_train_revision_list/get`。新版设备组合返回当前配置，历史工具仅用于兼容读取。新设备组合没有旧修订时，历史列表为空是正常结果。

**验收** 合法凭据分页及详情正确；无凭据或非直连只枚举诊断；返回结构无效或凭据错误返回错误。用正确读凭据试发写入，宿主拒绝且记录不变。 [CASE-02](05_TEST_PLAN.md#05-mcp)

#### FR-03 独立构件、安装与同步发行

**状态、必要性及场景** Confirmed · 首版必要 · S-04。

提供独立 PyPI 包、模块和 CLI，Extension 与 MCP 同版本，发行包各含自己的产物；先发布 MCP 并通过公开依赖解析再发布 Extension。

**验收** 隔离环境安装本地 wheel 后版本与握手正确；双构件版本一致且没有越界文件。真实发布只有公开安装和宿主验证后才可算通过。 [CASE-03](05_TEST_PLAN.md#05-mcp)

#### FR-04 诊断选择与响应兼容

**状态、必要性及场景** Inferred · 首版必要 · S-01/S-02 · FR-01。

明确地址来源和配置拒绝；保留既有 `version` 的 JSON text 与结构化内容，以及 `connection_status` 的 JSON text 契约。错误不可伪装成成功。

**验收** 使用显式地址覆盖环境配置，在非法地址上有错误而非静默回退；旧客户端 initialize/list/call 同样可用，握手消息无额外日志。 [CASE-01A/B](05_TEST_PLAN.md#05-mcp)

#### FR-05 授权与数据边界

**状态、必要性及场景** Inferred · 首版必要 · S-03 · FR-02。

枚举出工具仅表示客户端满足注册条件，每次请求仍受本机权限检查。当前只读凭据的设备路由范围覆盖设备和设备组合整库。当前工具验证必要字段后返回宿主响应对象，出参是否缩减由 Q-05 决定。SQLite 由 Extension 持有。

多个受信本机 Agent 可并行查询，首版不按 Agent 过滤设备记录。

**验收** 使用不匹配凭据的会话调用后得到权限错误，诊断仍可用，错误文本及记录不可包含凭据。已启动会话在轮换中的失效时点待 Q-01 确认及验证。 [CASE-02A/C/D/E](05_TEST_PLAN.md#05-mcp)

### 已有决定与历史差异

| 决定 | 状态      | 结论及依据                                                                                                                | 影响                  |
| ---- | --------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| D-01 | Confirmed | 独立发行，默认真实诊断，设备仅可信直连只读，凭据不进入证据。交接 D13。                                                    | FR-01、02、05         |
| D-02 | Inferred  | 将配置、枚举、实际读取成功和写授权拆成不同信号。依据当前接口和历史 403 证据。                                             | FR-02、04、05         |
| D-03 | Confirmed | Extension 和 MCP 同版本，先 MCP 后 Registry。项目当前发行基线；本地安装证据与公开发行分开。                               | FR-03                 |
| D-04 | Confirmed | Q-02 A。首版保留 version 与 connection_status 的工具名和输出。业务问题通过宿主状态和具体查询排查。                        | FR-01、FR-04、CASE-01 |
| D-05 | Confirmed | 用户在 Q-01 确认多个受信本机 Agent 可并行使用，无需按 Agent 增加数据过滤。沿用设备只读边界。共享凭据的轮换方式留在 Q-01。 | FR-02、FR-05、CASE-02 |

### 证据、冲突与限制

**当前源码**。默认诊断查询 ComfyUI 公共系统与节点端点。现有状态工具看不到 Extension 的版本、存储故障或能力降级。设备组合工具描述仍有旧版草稿和默认修订字样，当前保存行为以设备专题为准。当前自动化、真宿主与构件的验收状态见[测试报告](06_TEST_REPORT.md#05-mcp)。

**Observed**。历史 FastMCP 4.2.0 对旧 initialize/list/call 有真实 stdio 验证，合规令牌查询、错令牌错误和只读 POST 403 有隔离宿主证据。历史本地安装不能证明已公开上架。另有 2026-11-21 迁移验证批次记录 67 项 MCP pytest 通过，仍需按其实际替身与证据范围理解；该报告不替代当前受权真机和双客户端轮换。 [同日迁移验证](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

独立 MCP 从 `5e39fcf` 的诊断扩展到 `003c599` 的 6 个设备只读工具。FastMCP 迁移前后的响应契约与设备写入授权边界的证据来自既有本地材料。 Git `4c0cf4d` 中历史交接 `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_2/02_REQUIREMENTS_AND_DECISIONS.md`，记录 D01–D19。下文的交接决策编号引用该版本。

2026-11-21 查阅 MCP 2025-11-25 传输规格，核对客户端启动子进程及 stdout/stderr 责任。该规格不定义 AstroPhoto 的设备读取范围。

[MCP 契约与历史证据](../../../docs/mcp.md) · [发行约束](../../../docs/publishing.md) · [设备业务 PRD](01_PRD.md#04-equipment) · [MCP stdio 规格](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)

### 架构审查与边界用例

| 边界                     | 当前源码与可观察后果                                                                                                                                                                                                          | 需定下的行为                                                                                                                                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 设备 API 与浏览器信任    | Bearer 在设备路由上按来源和 GET 方法授权，覆盖六个 MCP 工具对应的 GET，也覆盖独立的组合草稿 GET。同源浏览器分支是单独权限，只读声明不构成对同一账号下任意本地进程的隔离。                                                     | 冻结 Bearer 路由范围和首版威胁模型。Q-03、Q-04、Q-06。 [授权逻辑](../../../astrophoto/api/security.py) · [路由](../../../astrophoto/api/equipment.py)                                                                                                          |
| 可达、注册、业务就绪     | 基础诊断依次请求系统信息和节点信息；只有两个响应都通过时才返回 `reachable: true`。节点注册基于 `vue-basic` 键存在。宿主仍可能因路由、数据库、部署或凭据导致业务查询失败。Core 状态提供扩展版本和能力，也包含 Data Root 路径。 | 诊断范围按 D-04。测试宿主活着但节点探测失败、节点存在但设备不可用。字段与兼容见 Q-05、Q-11。 [探测](../../../mcp/src/astrophoto_mcp/api/comfy.py) · [Core 状态](../../../astrophoto/api/status.py)                                                             |
| 诊断与设备访问的网络差异 | 诊断保留 HTTP(S) URL 前缀，客户端未显式关闭环境代理。设备链路要求回环 IP 字面量根路径，关闭环境代理和重定向。同一个配置可支持诊断，却没有设备工具。                                                                           | 选择网络模式及工具发现方式，覆盖 IPv4、IPv6、localhost、子路径、代理环境与两端重启。Q-07、Q-08。 [诊断客户端](../../../mcp/src/astrophoto_mcp/client.py) · [设备适配器](../../../mcp/src/astrophoto_mcp/api/equipment.py)                                      |
| 返回形状与数据外流       | MCP 对顶层对象、ID、关键字段和部分旧快照结构做浅校验，随后返回原 DTO。设备详情包含引用，组合详情包含当前配置与相关设备。基础诊断照传 `system` 对象。客户侧保存过的结果不会随撤销被收回。                                      | 确定字段投影和跨版本校验强度，准备含备注、嵌套字段及新增字段的夹具。Q-03、Q-05、Q-11。 [设备 DTO](../../../astrophoto/equipment/service.py) · [组合 DTO](../../../astrophoto/equipment/trains.py) · [适配器](../../../mcp/src/astrophoto_mcp/api/equipment.py) |
| 分页、过滤与并发编辑     | 设备查询按 UUID 排序并使用 `after`，每次读取各自提交的状态。两种列表接口的 DTO 可包含 `total`，MCP 只校验分页所需字段；`include_archived=true` 是活跃与归档一起查询。MCP 组合列表未暴露设备 API 的 `status`。                 | 选择在线分页、补筛选或一致性读取，覆盖改查找条件、删当前项、跨页归档和末页。Q-09。 [设备服务](../../../astrophoto/equipment/service.py) · [查询参数](../../../astrophoto/equipment/schemas.py) · [工具](../../../mcp/src/astrophoto_mcp/tools/equipment.py)    |
| 当前组合与旧历史         | 当前保存的配置与旧发布记录并存。旧历史列表可能为空，按另一个组合的修订 ID 查询需要 404。导出旧快照是兼容读取，当前配置及关联设备仍可变化。现有工具说明沿用部分旧术语。                                                        | 确定旧历史支持范围和保留周期，单列当前配置、旧快照、空历史及无法解析的旧数据。Q-10、Q-11。 [组合服务](../../../astrophoto/equipment/trains.py) · [工具说明](../../../mcp/src/astrophoto_mcp/tools/equipment.py)                                                |
| 调用预算与错误           | 两类 HTTP 客户端配置 10 秒 HTTPX 超时，诊断有两个顺序请求。适配器没有显式总截止时间、自动重试和响应体上限。设备错误提取受字符与长度约束的码，未按业务码集合闭合，也未透传宿主 `request_id`。                                  | 决定错误兼容、支持取证、较大数据量和超时边界，覆盖坏响应、慢请求、重启、取消与可重试故障。Q-12、Q-13。 [适配器](../../../mcp/src/astrophoto_mcp/api/equipment.py) · [HTTP 错误](../../../astrophoto/api/errors.py)                                             |
| 版本与发布证据           | 安装探针从临时 venv 握手、列出默认工具并调用 `version`。它不探测真实 ComfyUI。Tag 工作流先核验、再发 PyPI，公开独立安装通过后才发布 Registry。两渠道之间存在可预期的先后窗口。                                                | 确定支持矩阵、混合版本的失败行为、Close 门和部分发布恢复。Q-14～16。 [安装探针](../../../scripts/check_install.py) · [发布工作流](../../../.github/workflows/release.yml)                                                                                      |

授权边界、协议输出、真实业务读写等基本要求已经有 FR 和验收入口。下列决策评审的是首版是否扩大行为、收紧边界或接受明确局限。各选项的验收影响均为后续计划，当前未运行。

#### 关键异常与归属

| 场景                   | 已知行为或合格判据                                                                                                                                                                                                    | 归属                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 启动与目标发现         | CLI 地址优先于环境变量。显式空值和非法值导致配置错误；宿主未启动时，合法配置仍可启动 MCP。单独验证同一台机器的多个宿主，以及重启后旧端口指向另一实例时的诊断结果。当前 URL 和节点键不足以证明命中了预期的 Data Root。 | FR-01、FR-04 · Q-07、Q-08       |
| 权限与资源错误交叉     | 错凭据的读取首先拒绝。授权后的缺记录为 404，数据库不可用有独立服务错误。测试必须分别构造这些状态。拥有旧读凭据的客户端在宿主重启期间可能断连，宿主重新可用后才验证 403。                                              | FR-02、FR-05 · Q-01、Q-04、Q-13 |
| 撤销后保留记录         | 轮换控制后续请求。对撤销前已返回的数据、客户端本地保留的内容和正在完成的调用，按对应客户端与凭据方案界定行为。用已授权请求、切换时正在处理的请求、切换后新请求分别验证。                                              | FR-05 · Q-01、Q-03、Q-05        |
| Agent 消费用户录入内容 | 设备名、备注和历史字段是业务数据。授权读取允许返回这些值，且这些值可能进入外部客户端上下文。字段投影和使用说明需考虑文本、嵌套引用及诊断系统信息的可见范围。                                                          | FR-02、FR-05 · Q-05、Q-11       |
| 读写与夹具收尾         | 同一场景要观察成功读、拒绝写、记录与版本保持，以及同源分支的正常管理。结束时按设备测试计划通过 API 删除本场组合和设备并确认 404，保留可核对的测试证据。                                                               | FR-02、FR-05 · Q-04、Q-06、Q-15 |
| 独立安装失败与发布中断 | 区分依赖解析失败、CLI 无法启动、协议握手失败、宿主不可达和设备授权失败。两渠道发布中间态逐项记录，本地构件安装成功只证明该轮安装。                                                                                    | FR-03、FR-04 · Q-14～16         |

<a id="05-mcp-本轮待决问题"></a>

### 本轮待决问题

每题单选，可逐题或按组回复，例如 `Q-03 A，Q-04 B，Q-06 A`。A/B/C 是各题独立编号，带「推荐」的选项待用户确认。`Open` 表示决策未定，实际验收另行记录。先评审权限边界和本期关闭门槛，再评审数据契约和使用体验。完整索引见本节末尾。

#### Q-01 凭据撤销与轮换

**Open · 本期决策。** 多个受信本机 Agent 可并行使用同一宿主。更换共享凭据时，首版采用重启生效还是在线生效？

| 选项                               | 用户可观察的行为                                                                                       | 优点                                                     | 缺点与代价                                                                             | 实现与验收影响                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **A · 共享凭据，重启生效（推荐）** | 替换宿主的私有环境配置并重启 ComfyUI，仍持旧值的客户端下一次设备读取被拒。要继续读的客户端以新值重启。 | 沿用现有实现，配置和生效时点明确，可直接用隔离环境验收。 | 宿主重启有短时中断。共享同一旧值的客户端同时失效，需要逐个更新。                       | FR-02、FR-05。CASE-02E 验证旧会话 403、新会话 200、取消宿主凭据后全部 Bearer 读被拒。  |
| **C · 共享凭据，宿主在线轮换**     | 宿主通过受控配置入口切换共享读凭据，ComfyUI 继续运行。客户端仍需重新启动以取得新值。                   | 减少宿主停机，维护方式仍只有一个有效值。                 | 共享旧值的客户端仍同时失效。需要新增安全重载入口，并处理配置无效和并发请求的切换边界。 | FR-02、FR-05。新增在线切换、无效配置处理和并发请求验收，验证公共诊断在切换时持续可用。 |

推荐 A。当前实现已采用两端启动时读取配置。如果本期必须维持宿主在线，C 对应这一目标。[现有轮换验收](05_TEST_PLAN.md#05-mcp)
按 Agent 独立签发及单独撤销留作未来需求。

#### Q-03 最小披露和远程需求

**Open · 本期决策。** 给可信 MCP 客户端哪些数据访问范围，是否在本期支持远程接入？当前同一个读凭据适用于整套本机设备及设备组合 GET 路由。

| 选项                                     | 用户可观察的行为                                                                             | 优点                                            | 缺点与代价                                                                                       | 实现与验收影响                                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **A · 本机可信客户端，整库只读（推荐）** | 在单用户回环直连环境授予整库读取。凭据可读取设备、组合、归档数据和已有历史，写请求返回 403。 | 延续现有边界，配置简单，设备 API 稳定后可验收。 | 持凭据的本机进程能读取整个库，无法为每个分析任务缩小可见范围。远程使用另行立项。                 | FR-02、FR-05。CASE-02 复验完整读取、来源限制和写入拒绝。                                                         |
| **B · 本机按数据范围只读**               | 保持回环限制，配置允许读取的类别或能力，例如仅设备清单，或同时读取组合与历史。               | 可减少向分析客户端披露的数据。                  | 要定义列表、详情、历史和引用字段的一致过滤规则。多个客户端同时持有不同范围时，还需独立授权能力。 | FR-02、FR-05。新增跨工具范围、分页、历史和引用字段测试。若要求同时分配不同范围，需结合 Q-01 B。                  |
| **C · 本期纳入远程只读**                 | 在独立的远程接入方案中定义客户端身份、数据范围和撤销方式。                                   | 满足跨机器接入，可按外部使用场景明确授权。      | 扩大本期交付范围，需设计传输、身份校验、凭据管理及远程部署，并复验本机兼容性。                   | FR-02、FR-05。先确认远程使用者和数据范围，再设计单独授权契约、部署与验收矩阵。当前本机凭据不能直接用于远程接入。 |

推荐 A。当前交付目标是可信本机读取。如果本期必须让部分客户端只看到指定数据，选择 B，并说明最小可见范围。 [现有授权验收](05_TEST_PLAN.md#05-mcp)

#### Q-04 Bearer 授权随设备路由增长，还是显式限定读取入口？

**Open · 权限优先。** 即使选择整库读取，是否让现有凭据自动获得将来新增的设备 GET？当前另有组合草稿 GET，其可访问性未体现在六个工具清单上。

| 选项                               | 优点                                                                        | 缺点与验收影响                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **A · 维持设备域全部 GET**         | 沿用现有鉴权，直接 HTTP 客户端和新读入口可共用凭据。                        | 添加 GET 可能默认为现有凭据扩大范围。每次加路由都需复核授权，草稿 GET 的当前行为要列入公开契约。                                   |
| **B · 显式限定六条读路由（推荐）** | 凭据范围可审查，新增 GET 不会自然扩大暴露，工具支持范围和接口授权更易对照。 | 目前直接使用草稿 GET 的 Bearer 客户端会受影响。合并前需核对已有调用方，验证六条仍可读、草稿及测试新增 GET 拒绝、同源 UI 工作正常。 |
| **C · 单独建立 MCP 读取 API**      | 可独立设计字段、版本、分页和审计，管理 API 演进时影响较小。                 | 双套路径、版本和测试成本更高；需定义兼容迁移，业务规则仍要复用同一服务。                                                           |

Q-03 决定可读数据的范围，Q-04 决定这些权限从哪些路由进入。影响 FR-02、FR-05 和 CASE-02D。

#### Q-05 返回字段与 Agent 可见信息

**Open · 权限优先。** 用户可以授权整库读取，同时要求 Agent 看不到部分字段。当前设备与系统响应透传使添加字段也可能增加披露。基础诊断范围按 D-04。

| 选项                                           | 优点                                                                           | 缺点与验收影响                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **A · 保持当前透传并逐次审查扩展 DTO**         | 旧调用方继续使用规格、备注、引用及历史字段，新增字段可直接使用。               | 输出受上游 DTO 演进影响，无法稳定保证最小披露；要用含备注、嵌套对象和新增字段的夹具验证并标明整个响应的可见范围。         |
| **B · 固定必要字段，分阶段收敛旧输出（推荐）** | 可说明哪些字段会交给 Agent，新增后端字段不会自动披露；新诊断可只提供状态摘要。 | 需确认现有 Agent 依赖的备注、引用、历史字段和 `system` 内容，制定兼容期。验收跨列表、详情、组件、旧快照及诊断的字段契约。 |
| **C · 提供摘要和显式详细读取**                 | 默认数据量较低，确有需要时仍可取得完整上下文。                                 | 增加交互和接口复杂度。若详细读取需额外授权，须与 Q-03、Q-04 一并设计；客户端模式与授权均要验收。                          |

影响 FR-01、FR-02、FR-04、FR-05。任何字段策略都要明确客户端已经保存的结果如何由使用方管理。

#### Q-06 同机信任模型与写权限隔离

**Open · 权限优先。** 首版要证明的是「读凭据不能写」，还是还要隔离同一操作系统账号运行的第三方进程？当前可信本机浏览器分支以部署与请求上下文判断。

| 选项                                             | 优点                                                            | 缺点与验收影响                                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **A · 明确可信单用户边界（推荐）**               | 现有宿主 UI、Agent 只读流程可沿用，首版可验证 Bearer 写入拒绝。 | 将该账号下运行的本机程序纳入部署信任假设。文档、验收及对外声明均要限定边界，不能将拒写结论外推到所有本机调用。 |
| **B · 为宿主 UI 写入增加会话身份**               | 可设计独立写入口和授权条件，降低只依赖本机请求上下文的程度。    | 改动跨浏览器会话、Extension 路由和设备 UI，还需处理重启失效、兼容及会话回收。                                  |
| **C · 通过受隔离的部署账号或进程边界运行客户端** | 限制第三方客户端的本地权限，适合需要更高隔离的场景。            | 安装与运行复杂，需要按平台验证账号、网络和访问权限；当前单用户配置无法直接证明此模式。                         |

影响 FR-02、FR-05 和设备 Feature 的写入契约。若选择 B/C，应联动宿主专项验收。

#### Q-07 诊断地址、环境代理与直连预期

**Open · 部署决策。** 有系统代理或反向代理前缀时，诊断和设备读取是否应共享网络设置？当前两条链路的规则不同。

| 选项                                       | 优点                                                               | 缺点与验收影响                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **A · 保持当前诊断代理行为并明确说明**     | 兼容已经依赖环境代理或路径前缀的诊断客户端。                       | 相同地址在不同环境可能得到不同结果。需验证本机和代理配置的差异，并解释能诊断却看不到设备工具的原因。 |
| **B · 诊断默认直连，显式选用代理（推荐）** | 默认走配置的目标，企业或受限环境仍可明确启用代理，设备链路不改变。 | 依赖既有环境代理的用户需要迁移配置。验证 IPv4/IPv6、代理前缀、TLS 失败、直连与显式代理。             |
| **C · 所有诊断限制为本机**                 | 部署更一致，远程 HTTP 环境的认证和代理处理更少。                   | 会缩小当前基础诊断范围，远程或反向代理用户需要替代入口。                                             |

影响 FR-01、FR-04 和 CASE-01A/B。Q-03 的远程设备读取权限仍独立决策。

#### Q-08 工具发现、配置失败与恢复

**Open · 使用体验。** 当用户填了错误凭据、填了 `localhost` 或宿主尚未启动时，应在何时获得反馈？当前注册只依赖本机进程配置，实际授权直到请求时才可确认。

| 选项                                               | 优点                                                                      | 缺点与验收影响                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **A · 注册条件保持确定，补充本机配置反馈（推荐）** | 启动无需探测宿主，宿主晚启动时基础 stdio 可用；可清楚提示地址或配置原因。 | 格式合法的错值仍需调用才能确认。需验收缺失、非法、错值、未启动、重启，以及提示不含原凭据。 |
| **B · 启动时验证宿主授权后再列设备工具**           | 用户看到的清单更接近当时可用能力。                                        | 宿主启动顺序或临时 5xx 会改变清单；需要定义探测预算、重新枚举、客户端刷新和凭据验证选择。  |
| **C · 总是列出设备工具，调用时引导配置**           | 用户容易发现功能，清单稳定。                                              | 未授权会话会看到无法调用的工具，Agent 可能不断尝试；还需要明确禁用配置的错误与重试策略。   |

影响 FR-01、FR-02、FR-05，及 CASE-02A/E。若选 B/C，独立安装探针的默认工具清单也需调整。

#### Q-09 分页一致性、归档和状态筛选

**Open · 数据契约。** Agent 查几条记录与生成可复核的完整清单有不同的一致性需求。当前 UUID 游标不绑定查询条件，翻页过程可遇到并发编辑。

| 选项                                           | 优点                                                     | 缺点与验收影响                                                                                                           |
| ---------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **A · 在线分页，维持当前参数（推荐）**         | 沿用已有 API，无额外服务器状态；日常查询成本低。         | 并发新增、删除或归档可改变后续页和 `total`；组合状态和仅归档结果需客户端自行判断。验收同条件翻页、末页、变更后重新查询。 |
| **B · 在线分页，补齐服务端归档与组合状态筛选** | Agent 能直接获取指定状态，避免逐页过滤后的结果难以解释。 | 增加参数和优先级规则，要兼容现有 `include_archived`，对互斥条件和未知状态给一致反馈。跨页仍可能变化。                    |
| **C · 为全库导出提供一致快照**                 | 可重现完整结果，适合比对或批量处理。                     | 要定义数据范围、版本、过期、容量和清理。可能需要设备域新增快照能力，不能把普通游标当作快照。                             |

影响 FR-02、FR-05 和 CASE-02B。按用户主要任务选择，涉及整库导出时与 Q-05 的字段策略一起确认。

#### Q-10 历史快照的兼容等级

**Open · 数据契约。** 要维持已有两个历史查询工具多久，旧数据缺失或损坏时如何报告？当前保存组合不产生旧式发布修订。

| 选项                                               | 优点                                            | 缺点与验收影响                                                                                             |
| -------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **A · 首版保留六个工具，明示历史兼容语义（推荐）** | 工具名稳定，旧数据可查，新组合的空列表可解释。  | 需要维护可追溯的旧库夹具。核对合法旧快照、空历史、跨组合 404、不可解码旧快照，以及当前配置读取是否受影响。 |
| **B · 历史工具标记弃用并设过渡窗口**               | 给旧 Agent 迁移时间，同时为退出旧格式确定边界。 | 需要明确弃用版本、迁移方式和工具描述，过渡期仍需维护和测试旧读接口。                                       |
| **C · 本期移除历史工具**                           | 工具面和验收成本下降。                          | 既有调用会中断，团队需要明确替代访问路径并更新工具数、安装和迁移说明。                                     |

影响 FR-02、FR-04 和 CASE-02A/B。修订状态、不可变语义及旧库迁移仍由设备专题决定。

#### Q-11 DTO 校验与向前兼容

**Open · 数据契约。** 宿主返回合法形状但记录 ID 与请求不同、含未知状态或有新增字段时，Agent 应得到何种结果？当前适配校验对象本身的部分结构，详情缺少与请求目标的独立一致性检查。

| 选项                                             | 优点                                                           | 缺点与验收影响                                                            |
| ------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **A · 保持浅层校验**                             | 与上游新增可选字段兼容，维护成本较低。                         | 错配记录或不完整嵌套数据可能穿过适配层；Agent 的下游使用者需自行判定。    |
| **B · 校验稳定必需字段、请求身份与关联（推荐）** | 能识别错记录和跨组合历史，能在协议层保留对新增可选字段的容忍。 | 需定义哪些字段或状态可扩展，验证错 ID、未知状态、版本新增和旧数据缺字段。 |
| **C · 严格、版本化的完整模型**                   | 对自动化消费者最可预测，正反契约可集中维护。                   | 宿主和 MCP 需要维护多版本映射，版本协商、兼容和发布成本最高。             |

影响 FR-02、FR-04 及 CASE-02B/C，Q-05 决定最终可见字段，Q-14 决定跨版本覆盖范围。

#### Q-12 慢请求、取消和资源预算

**Open · 可靠性。** 慢宿主、大分页、旧历史或客户端断开时，需要给用户什么等待上限与恢复方式？当前 10 秒配置属于 HTTPX 超时设置，无法据此承诺工具从启动到完成的总时限。

| 选项                                               | 优点                                                           | 缺点与验收影响                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A · 维持现有超时，失败后由客户端重试**           | 实现简单，失败处理可预测，慢读不会自动叠加请求。               | 工具总耗时、结果体积及并发缺少专门产品约束，强依赖调用者自己管理。                               |
| **B · 设总预算和响应上限，明确错误及取消（推荐）** | 对慢响应、大结果和取消提供明确反馈，便于客户端调整范围或重试。 | 需要以常用和大量设备数据测定预算，避免正常历史响应被截断；验收慢响应、大响应、取消后资源回收。   |
| **C · 在 B 上加自动退避与服务端并发管理**          | 可缓解部分短暂故障和高并发压力。                               | 会增加单次调用预算与运维复杂度。必须定义可重试情况、次数与并发上限，权限和响应错误仍应及时结束。 |

影响 FR-01、FR-02、FR-04 和 CASE-01B/02C。当前没有支持吞吐或完成时间的实测指标。

#### Q-13 错误码、请求定位与记录边界

**Open · 可靠性。** 客户端应只显示错误，还是需要提供可定位宿主日志的编号和下一步？当前设备错误适配器输出状态与受格式约束的错误码，未透传宿主错误回执的请求编号。

| 选项                                             | 优点                                                       | 缺点与验收影响                                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **A · 保持文本错误，补充常见原因文档**           | 兼容旧客户端，开发成本低。                                 | Agent 解析困难，用户排障难与宿主日志关联。需说明 403、404、超时和存储不可用各自含义。          |
| **B · 固定可公开的错误码与脱敏请求编号（推荐）** | 用户可区分权限、缺记录和暂时故障，支持人员可关联宿主请求。 | 要为旧客户端保留可读文本，定义未知错误兜底和编号的允许格式，并验证响应、日志及测试证据的脱敏。 |
| **C · 加入本机操作审计**                         | 可调查多个客户端的读取行为和异常事件。                     | 增加留存、删除、访问控制及磁盘使用决策；单一凭据下无法自然区分出持有者。应与 Q-01 联动。       |

影响 FR-02、FR-04、FR-05 和 CASE-02C/D。凭据、完整授权头及敏感响应正文受既有证据限制。

#### Q-14 混合版本的支持方式

**Open · 兼容决策。** 双包发布版本锁步，但独立安装的 MCP 与目标宿主仍可能不同版本。应给这种组合什么承诺？

| 选项                                           | 优点                                                              | 缺点与验收影响                                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **A · 同版作为正式支持，混用尽力诊断（推荐）** | 测试矩阵小，保持已有锁步发布。基础诊断独立于设备 DTO 可继续尝试。 | 独立客户端升级先后可能出现临时失败。要说明版本定位及升级路径，避免把混合版本声明为通过。    |
| **B · 支持相邻版本的读契约**                   | 升级窗口更平滑，团队可分步安装。                                  | 发布前要保留前一版本的契约夹具、双向测试并定义旧版本的退出时间。                            |
| **C · 显式协商宿主 API 版本与能力**            | 可根据真实支持矩阵显示或调用功能，适合未来跨版本长期维护。        | 需设计版本发现、未知版本降级、权限和稳态缓存；与 Q-08 联动，不能只读取 MCP 自身版本来判断。 |

影响 FR-01～04。选定后将兼容组合纳入独立安装和宿主验收。

<a id="05-mcp-q-15-feature-close-和公开发行的完成条件"></a>

#### Q-15 Feature Close 和公开发行的完成条件

**Open · 关闭优先。** 设备 API 稳定后，需要哪些证据才能关闭专题？当前安装探针、本地授权全链路和公开发布各证明不同的结果。

| 选项                                                   | 优点                                                                  | 缺点与验收影响                                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **A · 本地授权全链路与独立安装通过后技术关闭（推荐）** | 可先交付已验证的 Feature，发布维护仍按 PyPI → Registry 顺序单独验收。 | Close 必须注明公开发行状态。发布渠道失败时由发行跟踪记录继续处理。                    |
| **B · 同版公开安装及 Registry 宿主加载后统一关闭**     | 从真实用户渠道安装到宿主运行均有证据。                                | 技术验收后仍依赖审批、索引和 Registry 的可用性，Feature 会长时间保持待关闭。          |
| **C · 先关闭默认诊断切片，授权读继续开放**             | 设备 API 或宿主夹具阻塞时可先接受诊断和安装证据。                     | 必须将整个 Feature 保持部分完成，不能用默认工具握手替代授权读、拒写、轮换及清理验收。 |

若 PyPI 已成功而 Registry 未成功，记录部分发行状态、对比测试构件，并按现有发布流程决定安全续发或升版。FR-03 和 CASE-03 的正式发行顺序继续适用。

#### Q-16 独立安装与客户端支持矩阵

**Open · 关闭优先。** Python 最低为 3.11。项目还需确定首版支持的宿主平台、Python 和 MCP 协议组合。所有选项均按程序化测试方式验收。

| 选项                                                               | 优点                                                           | 缺点与验收影响                                                             |
| ------------------------------------------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **A · 目标宿主加参考 stdio 客户端，验证 Python 3.11/3.12（推荐）** | 能证明声明的 Python 下限、基本协议与首版宿主链路，矩阵可维护。 | 其他平台或客户端的安装、私有环境配置和重启方式只能标明实际已测范围。       |
| **B · 本期覆盖主要平台与指定的协议配置**                           | 通过脚本验证更多实际安装、环境注入和进程启动方式。             | 需先确定平台和协议配置名单，维护更大的安装和连接矩阵。                     |
| **C · 先验收参考协议与构件**                                       | 可用较少环境启动技术验证。                                     | 真宿主链路证据留待补齐。若未完成授权端到端，只能与 Q-15 C 的部分关闭配套。 |

影响 FR-01、FR-03、FR-04。分别记录本地 wheel、公开 pin、进程启动、stdout 兼容与真实宿主读写边界。

#### 选择顺序与依赖

| 评审组     | 待决问题                     | 先决条件与建议                                                                                       |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| 首版边界   | Q-03、Q-04、Q-06、Q-15、Q-16 | 先确定谁能读、能读哪些入口，以及 Close 的证据边界。建议选择 Q-03 A、Q-04 B、Q-06 A、Q-15 A、Q-16 A。 |
| 访问和诊断 | Q-01、Q-07、Q-08             | 基础诊断按 D-04。共享凭据的宿主轮换和客户端读取新配置分别验收。                                      |
| 数据和兼容 | Q-05、Q-09、Q-10、Q-11、Q-14 | 先定可见字段与历史期限，再定跨版本、分页和格式。范围过滤要同时覆盖嵌套组件和历史。                   |
| 运行和排障 | Q-12、Q-13                   | 先用代表性数据确定参数，再定义超时、取消与请求编号。两题影响不同，可独立决定。                       |

<a id="05-mcp-需求评审闭环与下游传播"></a>

### 需求评审闭环与下游传播

1. **R1 回溯，已完成。** 将历史交付和已采纳规则写入 FR，分别记录当前事实、相反的早期方案和缺失证据。v0.1 的三个 FR 保留；新增 FR-04、FR-05 让之前埋在正文或跨 Feature 的行为能单独验收。
2. **R2 场景质询，已形成待决项。** 上述问题覆盖用户动作、失败及长期维护代价。先做对应只读核实或隔离复验，再聚合同一产品取舍；现有生效决定继续适用。
3. **R3 决策和传播，待进入。** 每个 Q 以场景、证据和产品取舍复审。记录采纳选项或延期理由、确认来源、负责人及日期，将对应 Q 更新为已决定或带影响的延期，必要时新增 D 并保留替代关系。随后递增 PRD 版本，同步受影响的 UI/UX、技术、开发规格和测试计划。
4. **R4 验收和回流，待进入。** 以确认后的 FR 和场景执行，测试报告保留目标版本、数据和结果。结果偏离承诺时回到对应 Q 或 FR 再评审。保留原历史结果，待 Close 对照实测后判定完成度。

CASE-01～03 不改号，各选择确认后的传播范围如下。

| 决策                   | 受影响的下游                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Q-01、Q-03、Q-04、Q-06 | 宿主安全与设备 API、MCP 配置与只读边界、DEV 守卫和 CASE-02 授权/轮换。若影响同源浏览器写入，回写设备 PRD 并复验宿主 UI。 |
| Q-07、Q-08             | 客户端诊断与配置说明、TECH 调用链、CASE-01/02、独立安装的默认工具清单。                                                  |
| Q-05、Q-09、Q-10、Q-11 | 设备数据契约、MCP 输出模型与兼容策略、CASE-02 数据和旧库夹具。                                                           |
| Q-12、Q-13             | 调用预算、错误及排障信息、CASE-01/02 的取消、错误和脱敏验收。                                                            |
| Q-14～16               | 支持矩阵、构件和真实宿主的验收门、Test Report 及 Close、公开发行证据。                                                   |

[Feature 索引](00_FEATURE_INDEX.md#05-mcp) · [现有测试计划](05_TEST_PLAN.md#05-mcp) · [跨 Feature 评审顺序](../INDEX.md)

<a id="06-assets"></a>

## 素材导入与资产登记

**版本** v0.6 · 2026-11-21 · 当前实现回溯、架构审视与产品评审稿
**身份** `asset-import-library` · 首版软件历史基线 0.0.1

本稿延续 v0.1 的 FR-01～03 编号，将当时放在链接中的产品规则展开为正文，并为原稿未单列的要求分配新编号。Confirmed 来自已有用户决定或采纳基线，Inferred 从已交付行为回溯，Proposed 为本轮建议，Open 等待事实或选择。Observed 记录实际验证，不用于认定产品选择。

### 背景、目标与使用者

操作者需要把大量天文原件变成能在工作流中再次定位的记录。目标是让每一文件的导入结果可追溯，整理目录或磁盘断开时能识别受影响资产，引用和副本的文件行为符合用户所选模式。当前公开回执尚不能逐项追溯，解决范围由 Q-04 评审。

本机用户显式选择来源、模式及目标并确认。资料库呈现已有记录及失败。工作流的 FITS Source 消费可定位 FITS；外部 Agent 暂不导入或移动素材。Storage 提供默认工作区和权限。

### 业务对象及集成边界

Asset ID 代表登记对象。外部引用位置用服务端原路径；受管副本使用 Workspace 身份下的位置。一个 Asset 可关联多个会话，一个会话可关联多个 Asset；首版只有基础关联。预检是无持久化的计算，导入 Operation 保存模式、目的地和汇总回执，错误详情受数量限制。正式处理产物也可登记，但处理回执由 Siril 负责。

[存储](../local-storage-workspaces/01_PRD.md) · [侧栏](../sidebar-node-browser/01_PRD.md) · [Siril](../07-siril-fits-autostretch/01_PRD.md)

### 主要场景

- S-01 通过可信本机接口明确指定本机来源路径，选择采用默认模式或临时覆盖，查看件数、目标和容量后确认。恢复 Assets 页面后提供这一入口的方案由 Q-02 评审。
- S-02 reference 保留源位置，copy 在目标 Workspace 保存受管副本。查看正在运行、部分失败或完成的回执。取消、网络中断与重试按原操作继续判断。
- S-03 读取已登记资产及分页数据，外部原件移动时仍可查到原登记与不可用原因，选可用新路径保存同一 ID。页面搜索和排序属于历史行为，恢复范围由 Q-02 评审。
- S-04 允许用户通过现有关系标记资产的会话归属。科学节点选已登记 FITS 后由本机服务解析，不要求把通用资产拖到画布。

### 状态、权限与异常规则

预检只枚举当前请求明确提交的目录或文件，不登记、不解码 FITS 或生成伪元数据。按存储 D-16，可信本机来源无需提前配置白名单；保留 OS、路径及受管边界校验，拒绝危险链接、目标离线或空间不足。默认导入验证为大小、源元信息和文件身份检查，历史 SHA-256 对照是验收证据而非每次默认计算行为。相同操作键重试不多登记；不同 copy 操作允许独立副本。复制期间源变化须报告失败。外部引用重绑保持 ID，受管位置通过 Workspace API 恢复。当前外部重绑按授权、大小和路径占用判断，同大小的不同文件可能被接受，内容身份保障由 Q-01 评审。界面帧类型偏好与真实帧分类分离。

### 当前用户可获得的结果

| 情况                   | 当前后端行为                                                                                   | 用户需要核对的结果                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 预检与确认之间文件变化 | 预检不冻结文件清单，作业执行时重新枚举并检查。                                                 | 预检数是当时的估算，完成后看实际回执和资产列表。                        |
| 重复选择同一外部路径   | 大小和修改时间相同的既有引用计入 skipped，可附加会话。元信息不同报重复冲突。                   | 读取 skipped/failed 计数。当前回执不返回对应资产 ID。                   |
| 相同文件独立 copy 两次 | 各操作可产生独立的受管副本。                                                                   | 各副本各有资产身份，原件保留。                                          |
| 部分文件失败           | 有成功或跳过项时可显示 completed，同时 failed 大于零；全部失败时 phase 为 failed。             | 查看总数、已处理数、各结果计数与错误，不能仅凭 completed 判定全部成功。 |
| 回执定位失败文件       | 最多保存 100 条错误，每条只有顺序号和错误码，不包含路径，完整清单不由公开回执返回。            | 超过 100 条的具体失败项和顺序号对应路径无法仅凭公开回执完整定位。       |
| 取消或中断             | 已提交的资产和计数保留，取消通过检查点生效；终态后再导入需要新的操作。                         | 确认最终状态和已登记资产，决定要重新选择哪些来源。                      |
| 原件移动或磁盘离线     | 资产列表保留记录，可用性查询返回原因。外部引用可在授权范围内重绑；工作区副本要恢复所属工作区。 | 检查 ID 和文件内容。当前仅凭同大小不能证明目标内容与原件相同。          |

本功能没有公开的资产删除接口。会话解绑只移除指定关联，文件和资产仍在。测试清理以每个测试专用的 Data Root 和源目录为边界，不把删除目录写成现有资产 API 能力。 [接口及数据模型](03_TECH.md#06-assets) · [隔离与验收](05_TEST_PLAN.md#06-assets)

**Verified · 导入边界。** 当前批次接受 1～100 个明确路径，枚举候选上限 10,000；超限时返回错误。文件夹可递归枚举，单个文件也可选择，同一批次按路径去重。预检总数与执行回执应分别理解，现有公开回执不提供完整逐项结果。默认模式变更不改已受理操作的有效模式；reference 没有写入目标，copy 可显式覆盖默认 Workspace。

### 交付范围与非目标

当前后端覆盖导入、可用性、ID 分页、外部重绑及基础会话关联。名称搜索、排序和 Assets 界面恢复纳入 Q-02 评审。历史真实 Assets 界面与 P0 占位分别验收。完整会话的创建/查询详情、Light/Dark/Flat/Bias/Dark Flat 真分类、Header 元数据、观测地/设备关联、通用素材拖拽、跨机路径和校准匹配保留为后续方向。

### 功能需求与验收

#### FR-01 来源预检与导入意图

**状态、必要性及场景** Confirmed · 首版必要 · S-01。

操作者提供服务端绝对路径，显式确认来源、有效模式及 copy 的目标工作区。预检显示候选数、估算和可用空间，不写入资产；OS 读取许可、请求来源和路径规则贯穿预检与执行。

**验收** 受信本机未设来源白名单时，可预检用户显式选取的合法本机文件或目录；OS 拒绝、越界链接、不可写/不足空间时显示具体反馈；预检前后资产数一致。 [CASE-01](05_TEST_PLAN.md#06-assets)

#### FR-02 引用、副本和恢复

**状态、必要性及场景** Confirmed · 首版必要 · S-02 · FR-01。

默认 reference，也可选择 copy。引用不生成副本，copy 创建独立受管文件。记录进度、结果计数、有限错误详情和取消；原操作安全查询或重试。完整逐项结果的需求见 Q-04。

**已确认的存储约束。** 采用部分成功，保留已提交素材，区分成功、跳过和失败。刷新后同一宿主会话可找回原导入，宿主关闭后清理未提交暂存并终止本批，重启不继续。现行代码仍会恢复未终结导入，需同步改造。导入界面、重复与失败重试由本专题维护；存储 Q-10 已通过 D-16 定稿。Q-12 只保留来源选择交互，沿用 Q-02 的页面评审。 [存储 PRD](../local-storage-workspaces/01_PRD.md)

**验收** 源文件未被修改；受管文件与源样本内容一致；同一操作重试无重复资产，源变化/断点可查，已完成项不被伪报失败或重复。 [CASE-02](05_TEST_PLAN.md#06-assets)

#### FR-03 登记列表、可用性与位置重绑

**状态、必要性及场景** Inferred · 首版必要 · S-03 · FR-02。

可分页浏览、按名称找记录、选择可用排序。外部位置离线时保留资产 ID，可在授权范围内改绑。只记录实际可判断的可用性。

**验收** 移动原件后列表保留 ID 并报告离线；合法重绑后按同一 ID 可读；非法位置或失败不变更原记录。 [CASE-03](05_TEST_PLAN.md#06-assets)

#### FR-04 基础会话关联

**状态、必要性及场景** Inferred · 首版必要 · S-04 · FR-03。

已登记 Asset 可关联、解除关联并列出会话引用；关系更新不改磁盘文件或其他会话。完整会话管理另议。

**验收** 同一资产绑定两个会话后解除其一，资产、原文件和另一关联均保留。 [CASE-04](05_TEST_PLAN.md#06-assets)

#### FR-05 素材入口与科学消费边界

**状态、必要性及场景** Confirmed · 当前 P0 范围 · S-04。

迁移期保留 Assets 标签与默认落点，只显示说明，不向素材服务发请求。保留已登记 FITS 供科学节点使用，历史 Assets 交付单独追溯。

**验收** P0 打开 Assets 不触发列表或写入；打开含已登记 FITS 的原工作流，来源解析按科学专题验收。 [CASE-05](05_TEST_PLAN.md#06-assets)

### 已有决定与历史差异

| 决定 | 状态      | 结论及依据                                                                                                  | 影响         |
| ---- | --------- | ----------------------------------------------------------------------------------------------------------- | ------------ |
| D-01 | Confirmed | 默认引用；允许复制且两者使用不同位置语义。交接 D03/D04 的来源白名单规则由存储 D-16 取代；现行实现仍需改造。 | FR-01、FR-02 |
| D-02 | Confirmed | P0 只保留素材占位，历史 Assets 功能在独立后续专题恢复。P0 Q-01。                                            | FR-05        |
| D-03 | Inferred  | 资产身份和文件位置分开，会话解除关联不等同物理删除。依据历史存储规格和实现。                                | FR-03、FR-04 |

### 证据、冲突与限制

**Verified · 当前代码。** Assets Sidebar 显示占位说明，历史导入、列表、搜索、排序、重绑及会话操作没有当前界面入口；后端保留授权的预检、导入、分页、逐项可用性、外部位置重绑、会话关联。当前通用列表以资产 ID 分页，历史名称搜索和排序发生在客户端。当前重绑按目标路径授权、同大小及位置唯一性判断，同大小不同内容可能被接受，归 Q-01。批量完成且存在成功项时回执可以同时含失败计数，API 阶段仍为 completed。候选 FITS 在独立科学入口可消费。

**Observed · 历史运行。** 历史 Storage 浏览器四组验收涵盖预检、引用/复制、迁移和重载；文件复制与来源变更有真实文件或注入证据。Vue P0 占位不会让历史 React 素材验收自动适用于目标宿主。

来源包括 Local Storage v1.1 的已留存交付记录、历史侧栏 FRD 的 FR-A01～04 和 P0 占位决策。首版以实际已确认的 reference/copy 和原件保护为基础，旧 FRD 中的会话/元数据/通用素材节点目标归后续。 Git `4c0cf4d` 中历史交接 `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_2/02_REQUIREMENTS_AND_DECISIONS.md`，记录 D01–D19。下文的交接决策编号引用该版本。

[存储与导入交付](../../../docs/local-storage.md) · [存储 PRD](../local-storage-workspaces/01_PRD.md) · [P0 占位决定](../archive/comfyui-frontend-stack-migration/01_PRD.md) · [Siril PRD](../07-siril-fits-autostretch/01_PRD.md)

存储 D-05 已确认用户需能把真实素材复制纳管。使用默认 Local 时，副本位于 Data Root 内的受管工作区，源文件保留，reference 保持当前默认。现有 API 继续承接复制请求，用户入口随素材专题评审。 [存储 FR-07](../local-storage-workspaces/01_PRD.md)

### 架构与产品审视

以下是对当前源码的静态核对和由此提出的产品问题。它们不构成新的用户决定，也不代表已完成运行验证。

| 范围       | 当前事实与边界                                                                                                      | 产品影响                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 用户确认   | 预检只返回汇总。受理时固化模式、目标和来源路径，工作线程之后重新枚举文件。                                          | 用户确认的数量可能与实际清单不同，详见 Q-06。                                                       |
| 可用性     | `resolve_asset` 解析位置并检查当前路径是可读取的普通文件，未与登记时保存的大小、时间或内容比较。                    | 同路径被替换后仍可能显示可用，Q-01 与 Q-07 应分别确定重绑及日常读取规则。                           |
| 完整性     | copy 默认检查源文件状态和副本大小，回执标记 `size_and_stat`。                                                       | 可以检查常见变化，但不能把这一结果解释为已做内容摘要对比，见 Q-08。                                 |
| 可恢复性   | 查询按操作 ID，recent 列表最多返回 16 条、混合迁移和导入。完成但有部分失败时可为 completed，终态 retry 不重新执行。 | 历史定位、部分成功和取消后的补导需要独立规则，见 Q-04、Q-10。                                       |
| 数据关系   | 同一 Asset 现有一个位置记录；外部路径和受管副本目前属于不同位置语义，独立 copy 可生成新 Asset。                     | 选择“复用内容”可能改变 ID、会话和工作流之间的关系，见 Q-03、Q-15。                                  |
| 科学读取   | FITS 候选按后缀筛选，实际读取才验证内容。可信本机科学入口可接收直接路径。                                           | 列表中出现不代表 FITS 有效，登记范围和直接路径的产品语义需澄清，见 Q-09、Q-16。                     |
| 目录扫描   | 扫描最多 10,000 个候选、最多遍历 40,000 个目录项，收集子项错误，授权路径与受保护位置受后端检查。                    | 空目录、超限、混合文件、隐藏文件和扫描期变化需要可预期结果，见 Q-06、Q-09、Q-17。                   |
| 并发与资源 | 操作服务当前最多允许 16 个非终态作业，线程池为 2，copy 使用工作区租约。                                             | 后续用户界面需区分等待、忙碌、重试与数据已提交，见 Q-11。真实多进程竞争及不同文件系统行为仍需验证。 |
| 清除与引用 | 当前没有资产删除接口，也无法完整追踪已保存工作流对资产的引用。                                                      | 删除登记会影响旧工作流，引用检查不能声称已经全面覆盖，见 Q-05、Q-14。                               |

**评审顺序建议**。先确定 Q-02 的用户入口和 Q-05 的删除与测试闭环，再确定 Q-06～Q-08 的导入真实性和完整性。Q-04、Q-10～Q-14 定义批次、状态和使用体验，Q-09、Q-15～Q-18 约定素材范围与长期边界。各项可独立讨论，涉及关联决策时按交叉引用一起确认。

**领域参考**。FITS 可包含主 HDU 与多个扩展，扩展类型包括图像和表格。因此“文件已登记”“文件是有效 FITS”和“当前科学节点支持其图像结构”需要分别判断。Astropy 文档说明，FITS 的 CHECKSUM/DATASUM 是 HDU 校验约定，默认打开时不会自动验证；文件整体摘要、FITS 内部校验和可读性检查各自提供不同证据，不能互相代替。此处作为 Q-08、Q-09、Q-16 的评审背景，当前项目的实际能力仍以源码与实测为准。2026-11-21 查阅。 [NASA FITS 扩展](https://fits.gsfc.nasa.gov/xtension.html) · [Astropy FITS 验证](https://docs.astropy.org/en/stable/io/fits/usage/verification.html)

### 本轮待决问题

以下每个问题单独选择一个选项，也可以提出调整。推荐为评审建议，所有选项保持 Proposed，直到用户确认。确认后将选择及适用范围记录为决定，并传播到交互、技术、开发和测试文档。

#### Q-01 重绑与内容身份

**场景**。原件移动后，用户希望重新指定文件，并继续使用原有资产 ID。新文件可能与原件大小相同、内容不同。当前实现只检查授权路径、文件大小及目标路径是否已被占用，无法证明内容一致。

| 选择                    | 行为                                                                                                                      | 优点                                                                                           | 缺点和影响                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **A，建议：核对后确认** | 展示原登记与候选文件的可用信息。证据不足时让用户明确确认继续使用原 ID，或选择新登记；有可用的内容摘要时一并展示比对结果。 | 保留现有资产和工作流引用的恢复路径，也让用户了解身份尚未确认。对没有历史摘要的旧资产仍可操作。 | 人工判断有出错可能，需要设计确认流程和提示。当前接口没有完整核对与确认流程，需要扩展。             |
| **B：摘要一致才重绑**   | 保存并比对内容摘要，只有确认一致时才恢复原 ID。旧资产若缺少可信摘要，需新登记或先通过另行定义的恢复流程。                 | 能以内容证据降低误绑不同文件的可能。                                                           | 大文件需要额外读取，旧资产缺摘要时无法直接自动证明身份。需要持久化摘要、设计旧数据处理和错误恢复。 |
| **C：沿用当前规则**     | 授权范围内的候选文件只要大小相同且路径未被其他资产占用，即允许重绑。                                                      | 现有后端已经支持，操作和计算开销较小。                                                         | 同大小的不同文件可能被绑定到原资产，后续工作流可能读取错误内容。仍需明确用户如何获知这一限制。     |

**影响与验证**。影响 FR-03、CASE-03、CASE-06 和 Siril 对资产身份的依赖。使用同名不同内容、同大小不同内容、移动后内容一致及历史无摘要的样本验证。当前在原路径发生替换时的识别能力也需纳入方案设计。

#### Q-02 后续恢复入口的最小范围

**场景**。当前 Assets 标签只有占位提示。用户需要通过可信接口导入素材，已有 FITS 可通过独立科学节点使用。存储 D-05 已确认用户需要能复制真实素材纳管，本问题决定交互入口和交付范围。

| 选择                                 | 行为                                                                                                 | 优点                                                             | 缺点和影响                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **A，建议：本 Feature 恢复基础页面** | 提供来源选择、reference/copy、预检、导入回执、资产列表和外部引用重绑。完整会话管理与真实帧分类单列。 | 用户可在侧栏完成从导入到查找和恢复的基础流程，也有复制纳管入口。 | 需要设计、实现及真实宿主验收。搜索排序、重绑确认和回执详情需结合 Q-01、Q-04 决定。         |
| **B：本 Feature 保持占位**           | 本 Feature 评审并验收现有后端与科学消费，素材界面作为独立后续交付。                                  | 本轮范围较小，可先核实已有接口。                                 | 用户仍不能通过当前侧栏导入或管理素材，D-05 的用户入口需要后续安排和跟踪。                  |
| **C：连同会话与帧分类一起恢复**      | 素材页面同时交付基础导入、完整会话管理和真实帧分类。                                                 | 用户可以在同一轮使用更完整的素材组织流程。                       | 需要先定义会话对象、分类规则和相关交互，范围和验收工作明显增加，基础入口交付时间可能延后。 |

**影响与验证**。影响 FR-01～05、Sidebar、存储 FR-07、UX 原型及真实宿主验收。A 和 C 均需先确认新界面的具体交互，B 需明确后续入口的归属与时间安排。

#### Q-03 重复导入策略

**场景**。同一文件可能被重复选择、从另一个路径导入，或用于多个会话。当前相同外部路径且大小和修改时间相符时计入 skipped，可附加会话；不同 copy 操作可生成独立副本。

| 选择                                  | 行为                                                                                                         | 优点                                       | 缺点和影响                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **A，建议：提示疑似重复，由用户选择** | 保留当前同操作幂等和独立 copy 语义，对能够识别的疑似重复提示用户复用或继续独立导入。提示依据需在设计时明确。 | 用户能根据用途决定是否共享，减少意外重复。 | 需要建立提示依据与交互，判断条件较弱时会漏报或误报。现有接口没有完整的跨路径疑似重复提示。 |
| **B：按内容自动复用**                 | 通过内容摘要识别重复文件，按统一规则复用资产或副本，并允许多个会话关联。                                     | 可减少重复副本和存储占用。                 | 大批量导入需要额外读取，必须定义跨路径、不同模式、共享文件及解绑后的行为。                 |
| **C：沿用当前行为**                   | 外部引用按当前路径和元信息处理，copy 按独立操作生成副本，不增加跨路径重复提示。                              | 规则与当前实现一致，导入流程较直接。       | 同一内容在不同路径或多次 copy 时可能产生重复记录和额外占用。                               |

**影响与验证**。影响 FR-02、FR-04 和 CASE-06。验证相同路径、不同路径、不同会话、不同模式以及同名不同内容，并评估大文件读取开销。

#### Q-04 导入完成后的结果获取与修改

**场景**。一次导入有 500 个文件，其中一部分失败。当前回执提供计数和最多 100 条顺序号、错误码，公开结果没有顺序号到文件路径的映射。离开页面后可以按已知操作 ID 查询。

| 选择                          | 行为                                                                                                | 优点                                   | 缺点和影响                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| **A：汇总回执**               | 保持现有汇总与有限错误，用户重新选择来源建立新操作。                                                | 现有后端接近此范围，返回数据量小。     | 无法仅凭公开回执完整定位失败文件，超过 100 条错误时详情也不完整，批量补导需要额外人工核对。 |
| **B，建议：可分页的逐项结果** | 保存并分页展示来源、结果、错误和已登记资产 ID，支持重新打开历史回执；失败项由用户选择后发起新操作。 | 能定位失败文件并对账，适合大批量素材。 | 需要扩展保存与查询契约，增加路径数据存储、分页和界面工作，并确定结果保留期限。              |
| **C：逐项结果加一键补导**     | 在 B 的基础上，从原结果直接选择失败项并创建新的补导操作。                                           | 减少大量失败项的重复选择，操作更方便。 | 需要处理来源变化、授权失效、重复点击和新旧作业关联，开发与验收范围更大。                    |

**影响与验证**。影响 FR-01、FR-02、FR-05 和 CASE-07，需与 Q-02 一起决定入口。验证混合失败、超过 100 条错误、刷新与重启、来源变化及重复补导。

#### Q-05 资产删除与测试闭环

**场景**。用户要求测试脚本在每次测试后调用 API 删除本次测试记录，并验证删除结果。当前素材 API 没有资产删除端点。资产既可能引用用户原件，也可能拥有受管副本或被会话、处理结果与工作流使用。

| 选择                              | 行为                                                                                                                       | 优点                                                 | 缺点和影响                                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **A，建议：删除登记，保留文件**   | 增加删除资产登记的 API，保留外部原件与受管副本。遇到关联时按确认后的保护规则处理；测试通过列表和可用性接口核对记录已删除。 | 可满足测试记录的 API 删除闭环，降低误删文件的风险。  | 受管副本会留在磁盘，需要保留可追踪信息并定义后续清理方式。删除登记后原资产 ID 的工作流引用需要明确反馈。 |
| **B：提供登记与受管副本两种删除** | 默认可删除登记，也提供明确选择以删除受管副本，始终保护外部原件。                                                           | 用户可释放受管副本占用的空间，测试也可验证两种行为。 | 需要定义确认、引用保护、文件删除失败及重试恢复，受管文件删除具有不可逆影响。                             |
| **C：当前保持无资产删除**         | 测试使用独立实例和隔离目录清理，不新增资产删除 API。                                                                       | 当前实现无需增加删除能力。                           | 无法满足用户要求的 API 删除闭环，用户也无法通过资产接口解除登记。                                        |

**影响与验证**。影响 FR-02～05 和 CASE-08。若选择 A 或 B，还需明确存在会话关联、处理结果及工作流引用时的行为，重复删除的返回结果，以及记录和文件操作部分失败后的状态。

#### Q-06 用户确认后的文件清单

**场景**。预检时目录有 100 个文件，用户确认前新增一张、删除一张。当前执行时重新扫描，实际处理集合可以不同。

| 选择                          | 行为                                                                     | 优点                                                         | 缺点和影响                                                               |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **A，建议：确认已冻结的清单** | 预检生成可过期的候选清单。确认后只处理该清单，文件缺失或变化时逐项报告。 | 用户确认的范围和实际处理范围可以对账，新增文件不会意外进入。 | 需要保存清单及过期规则，可能占用更多数据库空间；确认后仍要逐项复核变化。 |
| **B：确认时复检差异**         | 再次扫描，数量或文件有变化时展示差异并要求重新确认。                     | 用户能发现目录变化并决定是否纳入。                           | 大目录至少重复扫描，频繁变化的来源可能多次要求确认；要设计差异展示。     |
| **C：沿用执行时扫描**         | 确认的是来源目录和模式，执行时以重新扫描得到的集合为准。                 | 实现和操作较简单，可自动包含新文件。                         | 用户无法提前确认每个文件，预检和最终数量可能不同，需要明确提示。         |

**影响与验证**。FR-01、FR-02、Q-04、Q-17。覆盖目录增删、同名替换、预检过期、重启及授权变化。

#### Q-07 已登记文件在原位置被替换

**场景**。引用已登记后，另一个程序把相同路径的文件覆盖。当前可用性检查只验证当前路径可解析到普通文件，并不与登记信息比较。

| 选择                                  | 行为                                                                           | 优点                                                 | 缺点和影响                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **A，建议：变化时提示并阻止自动使用** | 读取时比较已有登记信息。可判断的变化先提示，用户选择重新确认、重绑或另行登记。 | 降低工作流悄悄读取替换文件的机会，保留用户处理空间。 | 需要读取前校验与确认界面；仅比较大小和时间无法检测所有变化，摘要能力另由 Q-08 决定。 |
| **B：标记变化但允许继续**             | 展示变化提示，用户仍可运行，并在结果中记录当次来源状态。                       | 用户可继续处理经常更新的文件。                       | 警告可能被忽略，旧工作流输出可能与原素材不同，需要结果回执记录。                     |
| **C：沿用路径可读判定**               | 当前路径是可读取普通文件时允许使用。                                           | 路径行为简单，现有读取接近此范围。                   | 替换文件可能被当作原资产，无法从可用状态判断内容一致。                               |

**影响与验证**。FR-03、FR-05、Q-01、Q-08、Siril。测试同路径替换、只改时间、同大小不同内容及替换后打开旧工作流。

#### Q-08 复制完整性的证据

**场景**。用户复制较大的 FITS 文件并保留原件，希望了解副本是否与源内容一致。当前 copy 校验源状态和副本大小，默认没有内容摘要比对。

| 选择                          | 行为                                                                     | 优点                                           | 缺点和影响                                                      |
| ----------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------- |
| **A，建议：提供可选内容校验** | 保持现行快速校验，提供明确的摘要校验选项，回执记录实际采用的方法和结果。 | 让用户按文件价值与耗时选择，并能区分验证等级。 | 有两套验收路径；摘要读取增加时间，历史资产无摘要仍需明确处理。  |
| **B：所有 copy 强制摘要校验** | 每次复制都计算并验证源与副本内容摘要。                                   | 回执可提供统一的内容一致性证据。               | 会增加 I/O 和导入耗时；失败、中断和恢复期间需保持摘要状态一致。 |
| **C：维持当前快速校验**       | 继续使用当前大小与文件状态校验，并在结果中清楚说明。                     | 性能和现有行为保持稳定。                       | 无法提供逐字节一致性的摘要证据。                                |

**影响与验证**。FR-02、Q-01、Q-07。比较不同大小文件的耗时，覆盖源变动、校验失败、磁盘满和中断重启。

#### Q-09 导入文件类型与无法识别的文件

**场景**。用户选择包含 FITS、普通照片、文本、隐藏文件和损坏 FITS 的目录。当前导入服务按普通文件处理，FITS 候选按文件名后缀筛选，读取时才验证格式。

| 选择                                      | 行为                                                                            | 优点                                                             | 缺点和影响                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **A，建议：允许普通文件并标明科学可用性** | 允许登记授权目录中的普通文件，科学节点另验证 FITS；列表和回执清楚显示验证状态。 | 保留原有通用导入能力，也能解释为何已登记文件不能用于 FITS 节点。 | 需要定义未验证、有效、无效等状态及何时刷新；扫描可能纳入用户没有预期的文件。 |
| **B：只导入明确支持的格式**               | 预检过滤或拒绝不在支持清单中的文件，并报告跳过原因。                            | 素材列表更聚焦，减少非目标文件。                                 | 需要维护格式和扩展名规则，可能排除用户需要保留的文件。                       |
| **C：用户在每次导入时选择范围**           | 提供全部普通文件与受支持格式等选项，回执记录实际过滤规则。                      | 灵活，适合混合目录。                                             | 增加交互和测试组合，需要定义隐藏文件、扩展名大小写及错误文件的处理。         |

**影响与验证**。FR-01、FR-05、Q-06。覆盖无扩展名、大小写、隐藏文件、损坏 FITS、多扩展 FITS、空目录和子目录。

#### Q-10 部分成功、取消和重试

**场景**。一批文件已有 60 项登记，接着磁盘离线、用户取消或出现 20 项失败。当前已提交项保留，终态操作不会通过 retry 再运行。

| 选择                                  | 行为                                                                                 | 优点                                                   | 缺点和影响                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **A，建议：保留成功项并明确部分结果** | 已成功项保留，明确显示部分成功、失败和未处理数量。用户选择失败或未处理项创建新操作。 | 符合现有逐项提交方式，恢复大批次时无需重复已成功文件。 | 用户需理解新旧操作关系；准确补导依赖 Q-04 的逐项结果。                         |
| **B：整批原子提交**                   | 只有所有文件完成后才统一登记，失败或取消则回滚整批。                                 | 结果容易理解，数据库中不会留下部分批次。               | 大文件暂存占空间，文件和数据库跨边界回滚复杂，长批次失败成本高，需要重新设计。 |
| **C：保持当前状态展示**               | 沿用 completed/failed/cancelled 与现有计数，不新增部分成功状态。                     | 接口改动较少。                                         | 仅看 completed 易误认为全部成功；失败项定位仍受现有回执限制。                  |

**影响与验证**。FR-02、Q-04、Q-06。分别在登记前、发布后登记前、部分成功后及终态后取消或重试，核对记录、文件、计数与原件。

#### Q-11 并发任务与同一素材竞争

**场景**。用户在两个窗口同时导入同一来源，或在工作区迁移时发起 copy。现有服务有任务数限制、操作锁与工作区租约，界面尚无并发管理体验。

| 选择                                      | 行为                                                                           | 优点                                         | 缺点和影响                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| **A，建议：保留隔离作业并显示等待与冲突** | 相同操作键复用作业，其他作业按目标和已有记录规则竞争；忙时给等待或可重试反馈。 | 保持可并行处理不同来源，用户能理解当前状态。 | 需定义可重试条件、重复提交与跨进程竞争，可能需要额外索引或约束验证。 |
| **B：所有导入串行**                       | 同一实例同一时间只处理一个导入批次。                                           | 状态更容易解释，资源竞争更少。               | 大批次会阻塞后续导入，吞吐可能下降；仍需处理迁移和外部文件变化。     |
| **C：冲突直接拒绝**                       | 检测到涉及相同来源或目标的活动作业时拒绝新作业，由用户稍后重试。               | 行为明确，减少自动排队复杂度。               | 用户需要手动重试，识别同一内容或不同路径同一文件本身也有成本。       |

**影响与验证**。FR-02、Q-03、Q-10、存储迁移。覆盖双窗口、同键不同请求、同一 reference、同一工作区 copy、迁移竞争和进程退出。

#### Q-12 来源授权与用户选取路径

**来源授权已确定。** 存储 D-16 取消受信本机额外导入开关及 `ASTROPHOTO_IMPORT_ROOTS` 白名单。用户明确选择文件或目录后，服务端仍检查请求来源、OS 读取许可、真实路径、链接和受管保护区域。当前版本仍要求配置白名单，作为实施与复验差距记录。交互候选为宿主适配的本机选择器与显式绝对路径输入，选择方式和界面交付范围归 Q-02，采用何种控件需核实宿主能力。 [存储 v1.0](../local-storage-workspaces/01_PRD.md)

**影响与验证。** FR-01、Q-02、Q-13。覆盖两个不同未预登记路径、受保护路径、权限拒绝、链接、路径大小写、长路径和作业过程中来源状态变化。

#### Q-13 导入目标离线或空间不足

**场景**。copy 已选择工作区后，工作区离线、变只读或写入时空间耗尽。当前作业计划保留选定目标，部分错误按阶段保留恢复状态。

| 选择                                    | 行为                                                                                       | 优点                                   | 缺点和影响                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- | -------------------------------------------------------------------------- |
| **A，建议：保留原目标并等待明确恢复**   | 停止或暂停受影响作业，保留已提交结果和原目标，恢复后按原作业规则重试；改目标时建立新作业。 | 文件去向清楚，减少结果散落不同工作区。 | 用户需要恢复原位置或重新选择未完成项，目标恢复和补导需要清晰指引。         |
| **B：允许用户将未完成项转到其他工作区** | 明确选择新目标，新建关联作业并记录新旧去向。                                               | 原磁盘长期不可用时仍可继续。           | 一批结果分布在多个工作区，必须区分已提交项和新作业，避免重复与混淆。       |
| **C：自动切换备用工作区**               | 按用户预先配置的策略自动选择备用目标。                                                     | 降低人工等待，适合无人值守场景。       | 需要持久策略与清晰回执，可能增加定位和管理成本，也需要与存储专题决定一致。 |

**影响与验证**。FR-02、Q-04、Q-10，以及存储专题 Q-02。覆盖预检后离线、复制中满盘、恢复后重试及更改默认工作区。

#### Q-14 删除时的关联与旧工作流

**场景**。资产被会话关联、Siril 结果引用，或 ID 已写入用户保存的 ComfyUI 工作流。系统未必能枚举所有离线工作流。

| 选择                                        | 行为                                                                                 | 优点                                         | 缺点和影响                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------ |
| **A，建议：阻止已知引用并保留不可解析提示** | 对数据库中可检查的关联提示并阻止或要求先处理；对不可枚举的工作流明确删除后可能失效。 | 可保护已知关系，同时如实说明无法检查的引用。 | 用户可能需要先解除关系；仍无法保证发现所有工作流。                       |
| **B：软删除并允许恢复**                     | 隐藏资产但保留可恢复记录，定义科学读取和关联如何处理。                               | 可恢复误操作，旧 ID 有机会重新使用。         | 需要增加状态、恢复和最终清理规则；软删除期间的文件与工作流语义需要设计。 |
| **C：立即删除并解除已知关联**               | 确认后删除登记及指定关系，旧工作流执行时报告资产不存在。                             | 操作直接，库中不会保留已删记录。             | 已知与未知引用都可能失效，恢复需要额外信息；确认和回执必须说明影响。     |

**影响与验证**。Q-05、FR-03～05。覆盖多会话、处理结果、离线工作流、重复删除、删除后重导与旧 ID 的行为。

#### Q-15 一个素材的多个位置

**场景**。用户先 reference 原件，随后 copy 到工作区，或同一内容在两块磁盘各有一份。当前模型每个 Asset 使用一个位置，独立 copy 可产生新的 Asset ID。

| 选择                              | 行为                                                            | 优点                                                 | 缺点和影响                                                                 |
| --------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| **A，建议：维持每个登记一个位置** | 引用与副本各自登记、各自有 ID，通过回执展示来源关系的需求另定。 | 与现有模型接近，每个 ID 的文件去向明确。             | 同一内容可能有多条资产，用户需要区分；自动故障切换无法直接实现。           |
| **B：一个资产支持多个位置**       | 同一资产登记多个引用或副本，并指定可用位置的选择规则。          | 可把多个位置视为同一素材并在位置失效时提供恢复选择。 | 需要定义内容一致性、优先级、并发变动、删除和旧数据迁移，改变现有数据模型。 |
| **C：保留独立资产并记录派生关系** | 各位置保持独立 ID，额外记录副本来自哪个资产或操作。             | 保留明确身份，同时能追溯复制来源。                   | 需要关系模型和界面，来源资产删除或内容变化时关系如何保留需要定义。         |

**影响与验证**。Q-01、Q-03、Q-05、Q-08 和 Siril。验证原件移动、多个副本、重新导入、关系删除与内容不一致。

#### Q-16 已登记素材与直接路径的科学使用

**场景**。当前科学节点可解析已登记素材，也可在可信本机使用未登记的 FITS 绝对路径。直接路径不产生资产登记。

| 选择                            | 行为                                                          | 优点                                           | 缺点和影响                                                   |
| ------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| **A，建议：两种入口并明确身份** | 保留直接路径和资产 ID，界面及处理回执区分登记资产与直接文件。 | 兼顾临时处理和可追溯工作流，延续当前可用入口。 | 直接路径移动后不具备资产重绑能力，需要用户理解并自行恢复。   |
| **B：正式处理必须先登记**       | 科学正式处理要求 Asset ID，临时预览路径是否保留另定。         | 统一资产身份，便于追溯、重绑和管理。           | 改变已有工作流，需要旧路径兼容和迁移方案，增加临时使用成本。 |
| **C：保持现有行为和提示**       | 保留现有路径和资产入口，不在本 Feature 新增身份区分。         | 改动范围较小。                                 | 用户可能不了解直接路径不会登记，也可能高估其恢复能力。       |

**影响与验证**。FR-05、Siril 和绘图/科学节点兼容。验证旧工作流、直接路径移动、资产离线重绑及处理回执。

#### Q-17 空目录、超限与大批量处理

**场景**。用户选择空目录、含大量子目录的素材库，或超出当前候选与遍历上限。当前空集合可进入完成流程，超限会返回错误。

| 选择                                          | 行为                                                   | 优点                                             | 缺点和影响                                                       |
| --------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| **A，建议：预检报告空结果与上限，超限不提交** | 空目录显示无可导入文件；超限说明上限与缩小范围的方法。 | 用户能理解为何没有记录，避免把截断当作完整导入。 | 用户需要手动拆分大批次；具体上限及目录计数应清楚显示。           |
| **B：自动分批处理**                           | 将大目录拆成多个关联子批次，汇总整体状态。             | 适合大型素材库，减少手动操作。                   | 需要持久化批次关系、进度、取消与失败恢复，错误汇总更复杂。       |
| **C：允许只处理上限内文件**                   | 处理一部分，明确标记其余未处理。                       | 可尽快导入部分素材。                             | 扫描顺序可能影响结果，需要稳定清单和继续导入机制，容易遗漏文件。 |

**影响与验证**。FR-01、FR-02、Q-04、Q-06。验证 0、1、100、101 个输入路径和候选、目录项数量上下界，以及无法读取的子目录。

#### Q-18 记录、路径信息与回执保留

**场景**。回执和操作计划可能包含来源路径、文件名与任务状态。用户需要在重启后找回结果，长期积累又会占用空间并保留路径信息。

| 选择                                    | 行为                                                                                         | 优点                           | 缺点和影响                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| **A，建议：用户可查看并清理已完成历史** | 保留正在运行与恢复所需的数据，允许用户查看并清理终态操作历史，明确删除历史不删除资产和文件。 | 兼顾追溯与用户控制。           | 需要定义保留时长、清理权限和资产来源关系的保留；清理后无法再找回完整历史。 |
| **B：自动按期限清理**                   | 终态记录达到设定时间后自动清理。                                                             | 无需手动维护，数据库增长可控。 | 用户可能在需要对账时发现记录已过期，需要提示期限及例外规则。               |
| **C：长期保留所有记录**                 | 操作记录持续保留，直至实例整体迁移或删除。                                                   | 长期对账较方便。               | 记录和路径信息持续积累，大批量任务可能增加存储与查询成本。                 |

**影响与验证**。Q-04、Q-05、FR-02。需区分公开回执、内部恢复计划和日志，验证非终态保护、重启恢复、终态清理和资产仍可读取。

### 边界场景与需求追溯

下表给出完整评审范围，选项确定后再将对应期望写入 FR 和测试计划。当前实现与目标存在差异的地方保持待验证状态。

| 场景                                                          | 需要核对的结果                                                               | 关联决定               |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------- |
| 预检后目录新增、删除或覆盖文件                                | 用户确认范围与实际作业范围一致，或明确显示变化及所选规则。                   | Q-06                   |
| 同路径被替换、同大小不同内容、源文件在复制中修改              | 列表、可用性、处理入口和回执对变化的判断一致，无法证明身份时不冒充内容一致。 | Q-01、Q-07、Q-08       |
| 空目录、重复路径、父子目录同时选择、扫描权限失败或超过上限    | 候选数、失败数、实际登记数可解释，用户能识别未处理范围。                     | Q-03、Q-06、Q-09、Q-17 |
| 100 个输入路径与 101 个输入路径，10,000 个候选与超限          | 返回明确结果和边界说明，超限时无意外登记。                                   | Q-17                   |
| 外部路径未列入旧授权根、路径包含链接、工作区与 Cache 作为来源 | 受信合法来源无需授权根；链接越界或受保护区域按路径规则拒绝并显示原因。       | Q-12、存储 D-16        |
| 同一个 reference 在多个会话导入，两个 copy 内容相同           | 已登记项、新副本、会话关系和重复提示符合所选身份策略。                       | Q-03、Q-15             |
| 原件或工作区离线、盘符变化、文件只读                          | 资产身份和登记保留，外部文件重绑与工作区整体恢复走各自规则。                 | Q-01、Q-07、Q-13       |
| 预检可写但执行期间满盘、源不可读或作业中断                    | 已提交、失败和未处理数量准确，恢复或补导不重复已提交记录。                   | Q-04、Q-08、Q-10、Q-13 |
| 同一操作超时重发、相同键不同请求、双窗口竞争                  | 相同意图、冲突和不同作业有明确反馈，源文件与已登记记录可核对。               | Q-03、Q-10、Q-11       |
| 部分失败超过 100 项、离开页面、重启宿主                       | 能按已选回执方案找回操作并解释失败；无法提供的信息应明确标注。               | Q-04、Q-18             |
| 取消发生在枚举、复制、发布和提交阶段                          | 清楚报告已完成与未处理项目，原件保留，恢复行为不依赖重复猜测。               | Q-06、Q-10             |
| 删除引用资产、受管副本、有会话或处理关系的资产                | 文件去向、关系、旧工作流、删除失败与重复请求均符合确认规则。                 | Q-05、Q-14、Q-15       |
| FITS 后缀但内容损坏、普通文件、直接路径输入                   | 登记、候选展示和实际科学处理的验证层次清楚。                                 | Q-09、Q-16             |
| 操作历史清理与实例重启                                        | 活动操作可恢复，终态历史和资产文件按用户确认规则保留或清理。                 | Q-18                   |

验收证据应分别注明模拟故障、隔离真实文件、当前目标宿主、真实卷变化及真实断电。物理设备或特定平台不可用时，相关场景记录为未验证。测试脚本须使用本次测试创建的数据，并按用户已提出的要求通过 API 验证删除闭环。当前资产删除能力缺失，Q-05 的 C 会使该要求仍然未满足。

### 需求评审闭环与下游传播

1. **R1 回溯，已完成。** 将历史交付和已采纳规则写入 FR，分别记录当前事实、相反的早期方案和缺失证据。v0.1 的三个 FR 保留；新增 FR-04、FR-05 让之前埋在正文或跨 Feature 的行为能单独验收。
2. **R2 场景质询，已形成待决项。** 上述问题覆盖用户动作、失败及长期维护代价。先做对应只读核实或隔离复验，再聚合同一产品取舍；现有生效决定继续适用。
3. **R3 决策和传播，待进入。** 每个 Q 以场景、证据和产品取舍复审。记录采纳选项或延期理由、确认来源、负责人及日期，将对应 Q 更新为已决定或带影响的延期，必要时新增 D 并保留替代关系。随后递增 PRD 版本，同步受影响的 UI/UX、技术、开发规格和测试计划。
4. **R4 验收和回流，待进入。** 以确认后的 FR 和场景执行，测试报告保留目标版本、数据和结果。结果偏离承诺时回到对应 Q 或 FR 再评审。保留原历史结果，待 Close 对照实测后判定完成度。

CASE-01～03 保留。CASE-04 对应双会话关联，CASE-05 对应 P0 无请求占位与已保存 FITS 的科学回归。Q-01 和 Q-03 若确认，更新可用性、重绑和重复提示的 UI、导入规则、测试夹具和历史结果适用标记。 [Feature 索引](00_FEATURE_INDEX.md#06-assets) · [现有测试计划](05_TEST_PLAN.md#06-assets) · [跨 Feature 评审顺序](../INDEX.md)

# AstroPhoto 摄影素材库 PRD v0.7

**状态：产品需求校准稿｜2026-11-19**

**范围：产品功能与用户行为，不涉及数据库、API 或代码实现方案。**

## 一、产品定位

构建统一的天文摄影素材管理模块，支持 User 通过前端、Agent 通过 MCP Tools 对素材及其组织关系进行增删改查。

素材库统一负责：

- 文件登记、分类与属性管理
- Collection 单层处理集合
- Project 与可嵌套虚拟文件夹
- Calibration Library 校准资源库
- Capture Session 辅助归属
- Workspace 文件管理与检索
- ComfyUI Canvas 数据入口

复用已经实现的设备库、光路库和 Storage 能力。

素材库不承担图像解码、图片或视频预览、自动校准及科学计算。

**核心原则：物理文件稳定、虚拟组织灵活、处理状态独立、User 决策优先。**

## 二、核心对象与关系

| 对象                | 定义                                                |
| ------------------- | --------------------------------------------------- |
| Asset               | 一条独立登记的实际文件记录                          |
| Collection          | 由处理条件一致的 Asset 构成的单层集合               |
| Project             | 组织同一目标、研究任务或处理计划的虚拟项目          |
| Virtual Folder      | Project 或 Calibration Library 中可嵌套的逻辑文件夹 |
| Calibration Library | 全局可复用的校准 Master 资源库                      |
| Capture Session     | 可选的拍摄活动及素材归属信息                        |
| Workspace           | 实际受管文件存储空间                                |

关系规则：

1. 一个 Asset 最多属于一个 Collection。
2. Collection 不允许嵌套，可以独立存在。
3. 一个 Collection 可以被多个 Project 引用，不复制实际文件。
4. 同一个 Collection 在同一个 Project 中仅保留一个主要虚拟目录位置。
5. Project 和 Calibration Library 均允许建立多级 Virtual Folder。
6. Virtual Folder 可包含 Collection、独立 Asset 或其他虚拟文件夹；Project 内也可以组织校准 Master 的引用。
7. Calibration Library 中的 Master 可以被不同 Project 和 Collection 复用。
8. Capture Session 不形成强制的组织层级。
9. 虚拟文件夹的名称和结构不决定实际物理文件位置。

## 三、素材登记、分类与状态

### FR-01｜通用文件导入

支持单个文件、批量文件、目录和视频导入，不限制文件格式。

支持：

- **Reference**：登记外部文件位置，保留原始文件。
- **Workspace Copy**：将文件复制到已配置的 Workspace 进行管理。

素材库不要求在导入时解析文件内容，不自动读取图像内部拍摄参数。

实际文件由后续 Node 通过文件路径读取。

### FR-02｜多维素材分类

不以 Subframe、MasterFrame、Video、Other 作为互斥的唯一分类。

使用多个相互独立的属性描述素材。

| 维度         | 可选属性                                                |
| ------------ | ------------------------------------------------------- |
| 文件形态     | 图片、视频、其他、未知                                  |
| 素材用途     | Light、Dark、Flat、Bias、Dark Flat、其他、未知          |
| 产物角色     | 原始素材、Calibration Master、MasterFrame、其他处理结果 |
| 校准状态     | 未校准、已校准、未知、不适用                            |
| 处理阶段     | 原始、预处理、配准、叠加、拼接、后期处理、完成、未知    |
| 文件可用状态 | 在线、失联、不可访问等                                  |
| 组织关系     | Project、Collection、Session、设备、光路等              |

**MasterFrame** 表示 User 确认可以进入图像后期处理阶段的主帧。

如果只有一张图像，或者 User 选择不进行校准，也可以将其归类为 MasterFrame。

**Calibration Master** 指用于校准的 Master Dark、Master Flat、Master Bias 等资源，与目标图像的 MasterFrame 不同。

MasterFrame 分类不会自动改变校准状态。

### FR-03｜素材属性管理

支持记录和编辑：

- 拍摄目标、采集时间、备注
- Camera、设备、Optical Train
- 滤镜、观测波段
- 曝光、Gain、Offset、Binning、温度
- 其他适用的人工描述信息

User 可以手动填写、修改和批量设置属性。

Agent 可以根据文件名及已有登记信息提出属性建议，但必须由 User 确认后写入。

无法判断的字段允许为空。

### FR-04｜素材 CRUD

支持查询、编辑、分类、批量修改、解除关联、取消登记和受控删除。

允许：

- 同一实际文件路径重复登记为多个 Asset。
- 不同路径下内容相同的文件登记为不同 Asset。
- 外部文件失联后继续保留逻辑记录。

不强制额外进行文件内容哈希去重。

取消某一 Asset 的登记，不得误删其他 Asset 仍在引用的实际文件。

## 四、Collection 单层数据集合

### FR-05｜Collection 一致性规则

Collection 表示一组可直接进入相同处理流程的数据，不等同于普通文件夹。

同一 Collection 中应具有一致的关键处理条件，包括：

- 素材用途
- 设备及光路
- 滤镜或波段
- 曝光、Gain、Offset、Binning
- 适用的校准关联
- 其他会影响统一处理的已知条件

采集时间和文件序号可以不同。

温度等允许一定容差，但容差由 User 或后续 Agent 规则决定，后端不自动进行科学匹配判断。

当参数不完整时：

- User 可以自行确认素材具有一致处理条件。
- Agent 必须向 User 确认后执行相关批量导入或分组。
- 已知参数存在冲突时，不允许未经确认直接混合。
- 后续修改素材属性导致 Collection 条件不一致时，应提示调整。

### FR-06｜Collection 使用场景

Collection 可以表示：

- 一组 Ha Light
- 一组 Dark、Flat、Bias 原始校准子帧
- 同一月面区域的多条连续 SER 视频
- 同一处理条件下的行星视频或其他文件序列

例如一个月面 Panel 的四条 SER 视频，在 User 确认处理条件一致后，可以作为一个 Collection，并保留视频的先后顺序。

Collection 不嵌套，也不要求对应实际磁盘目录或 Siril `.seq` 文件。

## 五、Project 与 Virtual Folder

### FR-07｜Project 管理

Project 用于组织具有共同拍摄目标或处理目标的数据。

一个 Project 可以包含：

- 多个不同条件的 Collection
- 独立 Asset
- Calibration Master 的引用
- 处理结果
- Capture Session 相关数据
- 虚拟文件夹及其组织结构

例如 M31 Project：

- 光路 A 的 Ha Collection
- 光路 A 的 OIII Collection
- 光路 B 的 RGB Collection
- 各通道 MasterFrame
- 最终合成结果

不同设备、滤镜和日期的数据可以属于同一 Project，但不应因此合并到同一个 Collection。

### FR-08｜Project 虚拟文件夹

Project 支持 User 或 Agent 创建、命名、移动和删除可嵌套的 Virtual Folder。

一个 Project 内，同一个 Collection 只有一个主要目录位置。

不同 Project 可引用相同 Collection，但各 Project 的文件夹结构可以不同。

**目录结构由用户需求决定，不强制所有 Project 使用同一层级。**

#### 推荐的初始组织模板

对于需要按照处理流程组织的 Project，建议提供可选模板：

**Raw / Intermediate / Results**

| 推荐文件夹   | 含义                                                   |
| ------------ | ------------------------------------------------------ |
| Raw          | 原始采集数据，如 Light、Dark、Flat 和原始 SER          |
| Intermediate | 已产生并需要保留的中间处理结果，如校准后、配准后的数据 |
| Results      | MasterFrame、已叠加图像、拼接结果及其他需要保留的成果  |

用户提出的 `Raw / Processing / Processed` 可以表达同样的组织意图，但建议使用 `Intermediate / Results`，避免把“中间文件”“当前正在运行”和“处理完成”混为一个概念。

模板不是强制分类，也不自动反映素材的真实处理状态。

允许 User 或 Agent 在文件夹下继续建立子目录，例如：

- Raw
    - Camera A
        - Ha
        - OIII
- Intermediate
    - Calibrated
    - Registered
- Results
    - Ha MasterFrame
    - Final Composite

对于月面拼接等项目，也可以直接采用 `Panel 01 / Panel 02 / Results`，不要求建立 Raw/Intermediate/Results。

未来通过专门的 **Project Management Skill**，使 Agent 根据用户要求建立或调整目录结构。

Skill 负责组织已授权的管理操作，不代表 Agent 获得了直接修改磁盘目录的权限。

### FR-09｜Capture Session

Capture Session 是可选的拍摄活动组织信息。

由 User 或 Agent 决定 Session 的划分，素材库保存名称、成员及关联信息。

不要求后端根据时间、目标或设备自动识别 Session。

Capture Session 不形成独立的强制目录层级，也不改变 Collection 的规则。

## 六、Calibration Library

### FR-10｜全局 Calibration Library

Calibration Library 是素材库的重要核心能力，具有明确的固定入口。

集中管理不同设备、光路、曝光、温度、滤镜等条件下的校准 Master。

包括：

- Master Dark
- Master Flat
- Master Bias
- Master Dark Flat
- 其他适用的校准 Master

Calibration Library 不要求预先建立固定的 Master 组合。

原始 Dark、Flat、Bias 等子帧仍作为普通 Asset 或 Collection 管理。

### FR-11｜Calibration Library 虚拟分类

Calibration Library 允许建立多层虚拟文件夹。

例如：

- Camera A
    - Master Dark
        - 180s
        - 300s
    - Master Bias
- Optical Train B
    - Master Flat
        - Ha
        - OIII

User 和 Agent 均可以管理分类目录。

这些目录仅组织校准资源，不建立新的物理文件副本。

全局 Calibration Library 的 Master 可以跨不同 Project 使用。

### FR-12｜校准 Master 关联

User 可以直接为 Light 或 Light Collection 选择 Master Dark、Master Flat、Master Bias 等多个不同用途的校准 Master。

Agent 可以根据现有属性推荐，但须经 User 确认。

如果 Master 和 Light 的参数明显不一致，或者必要信息未知：

- 展示不一致或缺失的信息。
- 向 User 发出警告。
- 经 User 二次确认后允许建立关联。

不由素材库自动判断科学上是否能够成功校准。

**选择校准 Master 不等于完成校准。**

Project 内可以创建自己的校准组，组织该项目选用的 Master 引用。

这些项目校准组不构成另一套独立的 Calibration Library，也不复制 Master 文件。

### FR-13｜校准状态与处理阶段

至少支持以下校准状态：

- 未校准
- 已校准
- 未知
- 不适用

User 可手动修改。

Agent 提出状态变更时须经 User 确认。

已有可信处理来源可以作为填写状态的依据，但不能仅凭文件名称或 Master 关联自动认定校准已完成。

校准状态、处理阶段和 MasterFrame 角色独立管理。

## 七、典型天文摄影场景

### FR-14｜深空多夜、多滤镜、多设备

一个目标 Project 可以包含不同日期、设备和滤镜的多组 Collection。

例如 M31 的 Ha、OIII、SII 与 RGB 分别管理，再通过 Project 汇总。

可以按设备、滤镜、日期、校准状态及处理阶段检索。

### FR-15｜月面、太阳与 Mosaic

一个 Project 可以组织多个 Panel / Tile。

每个 Panel 可以包含视频 Collection、叠加结果、MasterFrame 和其他中间结果。

支持按照 Panel 编号及 User 指定的顺序组织和查看。

太阳摄影还支持以波段和连续拍摄时间组织数据。

Panel 可通过业务属性或 Project 虚拟文件夹表达，但不建立嵌套 Collection。

### FR-16｜行星与时间序列

多个 SER/AVI 等视频可以按目标、波段、通道、设备和采集时间组织。

支持同一行星 Project 中分别管理 R/G/B 视频、多时间点序列和叠加结果。

视频是否能够组合进入同一处理流程，由 User 或 Agent 确认，素材库不自动判断。

后续视频叠加、行星自转修正和动画生成交给 Node 完成。

## 八、多维检索、筛选与排序

### FR-17｜检索与浏览

区分四类组织方式：

- **Virtual Folder**：持久的人工或 Agent 创建的目录层级。
- **Group**：根据属性临时分组显示。
- **Filter**：根据条件筛选符合要求的素材。
- **Sort**：按照指定字段排序。

主要支持：

| 维度       | 可用操作                               |
| ---------- | -------------------------------------- |
| 名称与文件 | 名称搜索、文件格式、大小、登记时间排序 |
| 目标       | 按目标名称、类别筛选和分组             |
| 采集时间   | 日期、时间、Session、先后顺序          |
| 滤镜与波段 | Ha、OIII、SII、RGB、太阳波段           |
| 设备与光路 | Camera、Optical Train、相关设备        |
| 采集参数   | 曝光、Gain、Offset、Binning、温度      |
| 科学状态   | 校准状态、处理阶段、产物角色           |
| Project    | Project、Collection、Virtual Folder    |
| 拼接区域   | Panel 编号、区域及自定义顺序           |
| 视频       | 时间、采集批次、通道、顺序             |
| 存储       | Workspace、Reference、在线、失联       |
| 校准资源   | Master 用途、设备及适用条件            |

支持多个筛选条件组合、适用字段的升降序，以及 Panel 等人工顺序。

缺失信息保留未知，不补造数据。

FWHM、SNR 等科学指标只有在 User 或其他处理系统明确提供后才可参与查询，不由素材库自动计算。

## 九、Workspace 文件管理

### FR-18｜Workspace 与业务组织分离

Workspace 负责实际文件存储，而 Project Virtual Folder 负责逻辑组织。

Workspace 根路径由 Settings 管理。

Assets 页面不能随意修改实际磁盘位置。

不要求按照 Project、滤镜、Panel、MasterFrame 等业务分类建立物理文件目录。

沿用现有受管导入、正式输出和内部暂存等存储职责。

Project 或 Virtual Folder 的创建、更名、移动不自动影响实际文件位置。

Reference 外部文件不可由素材库修改、移动或物理删除。

### FR-19｜安全删除与文件失联

支持取消登记、解除关系与受控的 Workspace 文件物理操作。

必须区分：

1. 移除虚拟文件夹中的对象引用。
2. 解除 Collection 或 Project 关系。
3. 取消 Asset 登记。
4. 永久删除实际文件。

虚拟文件夹删除不等于删除所包含的 Asset、Collection 或磁盘文件。

当删除、移动或重构整棵虚拟目录会造成大量业务关联变化时，需要 User 明确确认。

受管 Workspace 的文件移动、覆盖和永久删除也必须经 User 显式确认。

外部磁盘失联时保留全部登记、属性及业务关系，供之后重新定位。

## 十、Canvas 与正式输出

### FR-20｜Canvas 数据入口

单个 Asset 或 Collection 均可以拖入 ComfyUI Canvas。

系统根据素材类型创建并绑定相应 Source Node。

一个 Collection 由一个 Source Node 表示。

Project 可能包含不同处理条件，因此不默认直接转换为单个数据源节点。

素材库不提供图像或视频预览。

实际文件格式校验、读取、预览和处理交由对应 Node 完成。

### FR-21｜正式产物主动收录

Node 正式输出不自动进入素材库。

User 或 Agent 主动发起收录后，才建立 Asset 登记。

收录时允许记录：

- 来源 Asset 或 Collection
- 所属 Project
- 对应 Node / Workflow 来源
- 处理阶段与校准状态
- 用户备注

已收录结果可重新拖入 Canvas。

临时预览不登记为正式 Asset。

不建设独立的“未收录输出”浏览页面。

未来 Agent Skill 可以在处理完成后询问 User 是否将正式结果收录到素材库。

## 十一、前端入口

### FR-22｜Assets 双视图

保持 ComfyUI 的 Nodes / Assets / Settings 三个一级视图。

Assets 内部提供两个可以水平切换的主要页面：

**Projects**

- 浏览与管理 Project
- 展示 Project 内的 Virtual Folder
- 组织 Collection、独立 Asset、处理结果和项目校准组
- 支持 User/Agent 管理项目目录

**All Assets**

- 查看和管理全部已登记的素材
- 支持搜索、筛选、排序及批量操作
- 提供固定的 Calibration Library 入口
- 通过 Calibration Library 管理全局校准 Master 和其虚拟目录

**Calibration Library 的固定入口只位于 All Assets，不在 Projects 中再设一个全局入口。**

Projects 内部可以包含自己使用的校准组，并通过关联操作选择全局 Calibration Library 中的 Master。

具体布局、控件与交互在 UI 原型阶段确定。

## 十二、User 与 Agent 操作边界

### FR-23｜双入口管理

User 前端与 Agent MCP 均需要具备素材、Collection、Project、Virtual Folder、Calibration Library 和 Capture Session 的必要 CRUD 能力。

Agent 在已授权范围内可：

- 创建与调整 Project 虚拟目录
- 维护素材组织关系
- 执行逻辑分组和查询
- 提供属性分类及校准资源建议
- 协助主动收录处理结果

以下行为必须取得 User 确认：

- 根据推断信息写入素材属性
- 推荐并绑定校准 Master
- 修改科学处理或校准状态
- 会大量解除素材关联的目录重构或删除
- 受管文件的移动、覆盖或永久删除

Reference 文件始终不可由素材库执行物理修改。

未来 Project Management Skill 负责组织这些操作，但不能绕过 MCP 及产品权限规则。

## 十三、核心验收场景

1. **多滤镜深空项目**：同一 Project 管理 Ha/OIII/RGB 等不同 Collection，支持设备和滤镜的虚拟分层。
2. **跨 Project 复用**：同一 Collection 被两个 Project 引用，同一 Project 中仅有一个主要目录位置。
3. **Project 虚拟文件夹**：User/Agent 可以建立多级目录，更名和普通移动不影响磁盘。
4. **项目目录模板**：用户可以选择按 Raw/Intermediate/Results 组织，也能根据月面 Panel 等场景建立其他层级。
5. **Calibration Library**：可以按设备、滤镜和温度等分类 Master，支持跨项目复用。
6. **项目校准组**：Project 可以引用并组织 Master，但不新增独立的 Master 文件副本。
7. **校准关联**：Light Collection 可以选择多个不同用途的 Master，条件冲突需确认。
8. **科学状态独立**：MasterFrame 与“已校准”是不同属性，不能相互推导。
9. **月面拼接**：同一 Project 支持多个 Panel，维护多视频 Collection 和最终拼接结果。
10. **双视图**：Projects 与 All Assets 可以水平切换，全局 Calibration Library 从 All Assets 进入。
11. **文件保护**：虚拟目录删除不删除真实文件，Reference 始终保持原样。
12. **主动收录**：正式 Node 输出不会自动进入素材库，User/Agent 可主动登记并关联来源。

## 十四、不包含的功能

- 素材库内的图像或视频预览
- 素材导入时自动解析图像内部科学数据
- 自动校准、配准、叠加、拼接及视频处理
- 自动生成 Master 的科学算法
- 后端自动识别 Capture Session
- 自动判定科学参数容差和校准匹配
- 自动生成 FWHM、SNR 等科学指标
- Node 输出自动登记为正式 Asset
- 将业务虚拟目录自动同步到磁盘目录
- 为 Project 建设独立的科学处理执行引擎

## 十五、保留到下一阶段的设计选择

**D-01｜Project 默认目录模板**

推荐提供 Raw/Intermediate/Results 作为可选组织模板，但不强制每个 Project 创建。是否默认创建或仅在 User/Agent 选择后创建，留待下一轮 UI/交互设计确定。

**D-02｜Project Management Skill**

后续单独设计 Skill，支持按用户要求创建、整理和维护 Project 虚拟目录。具体模板、交互和批量管理策略在 Agent 能力设计阶段明确。

---

**PRD v0.7 已将本轮确认的产品决定纳入统一需求。后续可以以此为产品基线，开展 UI 原型和针对现有仓库的代码披露，再制定详细技术开发文档。**
