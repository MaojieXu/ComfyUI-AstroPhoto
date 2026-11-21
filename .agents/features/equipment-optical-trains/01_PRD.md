# 设备与光路管理 · 产品需求

**版本** v0.7 · 2026-11-21 · 产品与架构边界评审，部分规则待实现
**身份** `equipment-optical-trains` · 首版软件历史基线 0.0.1

沿用 FR-01～05、Q-01～06，吸收用户直接写在 v0.3 中的批注和答案。Confirmed 表示已确认的产品规则，Inferred 表示从交付回溯的需求，Proposed 表示建议，Open 表示未决。源码现状和既有运行证据单独记录。

## 背景、目标与使用者

用户需要把单件设备的规格与实际使用的设备组合分开维护，随时知道一条设备组合用了什么、缺什么，以及调整或删除记录会影响谁。成功信号是同一设备可复用，未完整的配置能保存，历史关联和错误操作有可查边界。

本机操作者创建设备、编辑设备组合和处理引用冲突。管理员开启本机许可。受权 Agent 只能通过 MCP 看设备、设备组合及旧历史，不能代替用户写入或永久删除。

## 业务对象及集成边界

设备包括相机、主光学设备（望远镜/镜头）、光学配件和滤镜。相机有可选读出和增益等规格，滤镜可含多个通带。设备组合包含至多一台相机、一项主光学、顺序有意义的配件及可用滤镜集合；多条设备组合可引用同一设备。历史修订是兼容快照，而非当前设备组合的一组可发布版本。当前配置可以是部分配置。设备与设备组合各由用户命名，名称用于辨识和检索，现有引用仍使用记录 ID。相同厂家型号的不同实体可以分别登记，使用不同自命名即可。

[存储](../local-storage-workspaces/01_PRD.md) · [MCP](../mcp-diagnostics-equipment-read/01_PRD.md) · [侧栏](../sidebar-node-browser/01_PRD.md)

### 可登记的专业规格

| 类别       | 基础规格与可选项                                                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 相机       | 传感器名称、单色/彩色类型、像素尺寸与数量、Bayer 排列、ADC 位深、制冷、最大合并像素。读出模式有名称及可选的增益/偏置范围，同一设备下模式键不能重复。 |
| 主光学设备 | 望远镜或镜头、光学设计、口径、原生焦距/焦比、像圈和说明。                                                                                            |
| 光学配件   | 减焦、平场或增倍类别，登记标称倍率、设计后截距、通光口径和说明。                                                                                     |
| 滤镜       | 类型、尺寸、规格形式和有序通带。通带可登记名称、中心波长及半高全宽，同一滤镜不接受重复通带名称。                                                     |

数值要符合单位及相应取值约束，读出范围有上下界时下界不能高于上界。表单拒绝不适用的类型字段。记录规格可未知，系统不得用 0 或默认物理参数代替未知。以上字段从现有设备交付和校验规则回溯。

## 主要场景

- S-01 从 设置 → 设备与设备组合 进入「我的设备」，按名称、厂家或型号搜索，按单选条件筛选类型或归档，选择类型后新建，或打开现有摘要和可折叠详情修改。
- S-02 在「设备组合」新建/编辑，先保存不完整组合，再加相机、主光学、配件和可用滤镜。设备详情原位更新后，当前设备组合读新资料。
- S-03 归档或恢复设备和设备组合。删除设备组合后对普通选择入口隐藏，已有历史引用继续可用，新的关联不能再选择已删除组合。设备删除仍需检查真实引用。遇并发冲突保留本地输入。
- S-04 读旧设备组合时优先用当前已保存配置，无当前记录再读旧默认或最近快照。已保存数据重启后可查。

## 状态、权限与异常规则

名称与设备类型受业务校验，厂商、型号、备注及专业字段允许未知；未知与明确否定区分。相机支持三态制冷、读出模式及增益/偏置能力；滤镜支持有序通带及同滤镜标签约束。设备组合必须有相机与主光学才算已配置；配件顺序不得丢失。设备组合表单无需新增旋转角度、变更备注、光学状态配置说明或平场适用性控件。编辑已有记录时，保留已存的兼容字段。有效焦距和焦比是标称估算，缺参数时为未知。受引用设备不能永久删除，允许查看原因；删除设备组合时历史引用继续可用，新关联不能再选用该组合，具体恢复方式待 Q-08 决定。设备和设备组合列表在设备模块当前挂载期间分别保持查询及单选筛选。单选条件中的归档与类型互斥；离开模块及重挂载后会话主要恢复编辑草稿。宿主收合/重新挂载可恢复未保存草稿，跨模块离开需确认，硬刷新沿用浏览器离开提示。陈旧写入无静默覆盖，创建结果不明确时先按名称核对列表。命名重复应在名称字段给出反馈，保留已编辑内容并请用户改名。对同一记录保存原名属于正常编辑。

## 交付范围与非目标

覆盖设备四类和规格、当前设备组合配置、列表/编辑/摘要、归档与删除、旧快照兼容。历史发布、默认修订选择和由历史派生的交互已被替代。硬件控制、设备/资产和 Capture Profile 绑定、校准自动判定、Agent 写入不在当前范围。

## 功能需求与验收

### FR-01 四类设备、规格与查询

**状态、必要性及场景** Confirmed · 首版必要 · S-01。

创建、编辑、检索四类设备；允许未知值并显示类型规格。列表支持关键字及单选筛选，类别和归档作为互斥选项。详情分组可查看。用户自命名与已有设备同名时阻止保存并提示改名。

**验收** 同样的四类样本保存重开后规格一致；未选可选值保持未知，重复通带或无效字段报错并保留合法输入。新增和改名撞到另一现有设备时，名称处显示重复提示，记录数和已有记录不变。 [CASE-01、CASE-07](05_TEST_PLAN.md)

### FR-02 单配置设备组合与兼容回读

**状态、必要性及场景** Confirmed · 首版必要 · S-02/S-04 · FR-01。

每条设备组合在前台呈现当前配置，允许不完整，已配置判断独立于归档。配置变化后前台动态显示最新内容，快照和版本仅用于后台管理，前台不提供版本展示或选择。保留配件顺序及滤镜集合；旧快照用于兼容和历史引用。设备组合拥有独立自命名，与另一设备组合同名时提示改名。新建或编辑时不能新加入已归档设备，已保存配置中的归档引用可以保持或移除，旧快照继续可读。移除并保存后再次加入属于新引用。界面选项和服务端写入遵循同一规则。

**验收** 保存缺主光学及完整配置，检验判定与顺序；改设备后当前详情读到新数据，原历史快照仍保持旧记录内容。组合重复名被拒绝。归档后旧引用可原样保存或移除，向任一设备位置新增归档引用被拒，当前配置在拒绝前后相同。 [CASE-02、CASE-06、CASE-07](05_TEST_PLAN.md)

### FR-03 归档、恢复与删除

**状态、必要性及场景** Confirmed · 首版必要 · S-03 · FR-01/02。

对设备与设备组合支持归档和恢复。设备删除保护引用，归档设备后保留已有关系。用户确认删除设备组合后，隐藏该组合及其历史版本，既有引用继续可用，不能再建立新引用，关联设备保留。删除后的恢复能力由 Q-08 决定。

**验收目标，待实现** 被引用设备显示关联且删除被拒绝；取消确认不变；删除设备组合后普通列表和新关联入口不可选，先前关联仍能读取所需历史信息，关联设备不受影响。旧记录删除行为与该目标不同，现有 CASE-03 须在后续同步后重验。 [CASE-03](05_TEST_PLAN.md)

### FR-04 编辑会话、并发与失败反馈

**状态、必要性及场景** Inferred · 首版必要 · S-01～04。

设备、设备组合列表在当前模块挂载期间保留各自查找条件。每个列表只启用一个筛选项，搜索可配合该筛选。跨模块离开后不要求恢复筛选，草稿恢复按编辑会话规则处理。可恢复宿主侧栏重挂载前的草稿；编辑冲突反馈清晰，重载前保留输入。

**验收** 双会话修改同一对象，后提交者可见冲突；收起再开保持草稿；跨模块确认取消时继续当前编辑。分别在设备和设备组合列表切换筛选并返回，验证会话内各自保留；跨模块重建后核对默认筛选及草稿状态。 [CASE-04、CASE-08](05_TEST_PLAN.md)

### FR-05 共享资料与运行边界

**状态、必要性及场景** Inferred · 首版必要 · S-02/S-04。

设备和设备组合持久保存在本地资产域，写入不改变 Workspace、素材源文件或导入配置。MCP 读取本地已授权记录及兼容历史。

**验收** 重启后资料完整；通过本地权限与 MCP 只读边界验证同一数据，并核对文件和默认工作区设置不变。 [CASE-05](05_TEST_PLAN.md)

## 已有决定与历史差异

| 决定 | 状态      | 结论及依据                                                                    | 影响      |
| ---- | --------- | ----------------------------------------------------------------------------- | --------- |
| D-01 | Confirmed | 四类设备、未知可填、摘要/折叠详情，配件和滤镜语义采用交接 D05/D06/D18。       | FR-01、02 |
| D-02 | Confirmed | 单配置替代多修订发布；旧历史读取保留。交接 D06。                              | FR-02     |
| D-03 | Confirmed | 归档与红色永久删除，保护真实引用和版本，不自动解除引用。交接 D07 与删除专项。 | FR-03     |
| D-04 | Confirmed | 产品和界面使用「设备组合」称呼原「光学链路/光路」。现有代码标识作为兼容定位。 | FR-01～05 |
| D-05 | Confirmed | 设备和设备组合均有用户自命名。同一列表内命名重复时阻止保存，提示更改名称。源自 Q-03 批注。 | FR-01、FR-02、FR-04 |
| D-06 | Confirmed | Q-04 选 A。保留旧引用及历史，允许移除，禁止新加入已归档设备。 | FR-02、FR-03 |
| D-07 | Confirmed | Q-05 选 A。两列表各用单选筛选，在当前模块会话保留。 | FR-01、FR-04 |
| D-08 | Confirmed | Q-06 回答不开放额外字段。表单范围延续现有设计，已保存兼容字段保留。 | FR-02、FR-04 |
| D-09 | Confirmed | 用户在 Q-01 批注要求删除组合后隐藏历史，已有引用仍可用，禁止新增引用。替代 D-03 对组合及历史的物理删除规则，设备引用保护继续适用。 | FR-02、FR-03 |
| D-10 | Confirmed | 用户在 Q-02 批注要求快照和版本不向前台用户展示，组合变化时前台动态显示最新配置。历史冻结时机另见 Q-09。 | FR-02、FR-05 |

## 证据、冲突与限制

**Observed**。旧发布/默认快照流程有 2026-11-18 真实宿主记录，只能证明旧需求。单配置、陈旧版本和事务回滚另有专项材料；P0 资料库入口须独立复验。原设备规格附件曾为空，专业规则依据当前交付与历史决定重建。

历史资料指向设备 UI FRD v1.0 与 Three Tier Engineering Guide v1.0，原规格附件曾记录为零字节且当前未检得完整副本。可恢复范围以现行设备交付、删除任务和交接决策为准。 Git `4c0cf4d` 中历史交接 `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_2/02_REQUIREMENTS_AND_DECISIONS.md`，记录 D01–D19。下文的交接决策编号引用该版本。

[现行设备规则](../../../docs/equipment.md) · [永久删除记录](../../notes/equipment-delete.md) · [MCP PRD](../mcp-diagnostics-equipment-read/01_PRD.md) · [P0 PRD](../archive/comfyui-frontend-stack-migration/01_PRD.md)

## 本轮待决问题

各 Q 的选项及推荐均为 Proposed。问题在取得所列证据、记录实际决定并回写影响范围后才关闭。

### Q-01 历史删除边界

**已确认 · D-09。** 用户原话“即使删除，也只是把历史版本隐藏，过去引用过的依旧能使用。但是最新的不能再添加”。当前代码会物理删除组合及旧快照，需按新规则实现。删除后如何恢复见 Q-08。

### Q-02 配置随现有设备变化

**已确认界面规则 · D-10。** 用户原话“快照，版本这些内容顶多是后台方便管理披露的，不允许在前台让User看到。当光路改变时，前台则动态更新到新版本”。捕获历史的冻结时机仍待 Q-09 选择。

### Q-03 重复命名与创建结果不明确

**已确认 · D-05。** 设备名称和设备组合名称分别在各自列表内检查。例如，两台相同型号望远镜可以分别命名为“主镜”和“备用镜”；两台设备都叫“主镜”时，第二次保存应提示改名并保留输入。设备和设备组合可以各有一条叫“主镜”的记录。编辑原记录沿用自己的名称可以保存，改成另一条记录的名称则拒绝。创建超时时保留表单，先通过列表核对是否已经创建，再决定是否重试。

仍需确认的比较细节见 Q-07。以两次同名创建、编辑沿用原名、改名撞名和并发创建为证据。影响 FR-01、FR-02、FR-04。

### Q-04 已归档设备的引用

**已确认 · D-06。** 已保存的归档设备可保留或移除，新引用禁止。旧快照内容继续可读。在原配置历史回退到旧快照时，应按加载到的有效配置区分已有引用与新引用。新增、替换、移除后重新加入，均需验证拒绝后没有生成或修改记录。影响 FR-02、FR-03。

### Q-05 组合筛选与会话记忆

**已确认 · D-07。** 设备和设备组合列表各用单选筛选，查询与筛选在当前模块会话独立记忆。跨模块不要求记住筛选。影响 FR-01、FR-04。

### Q-06 编辑光学状态的入口

**已确认 · D-08。** 设备组合表单保持现有编辑范围，不新增旋转角度、变更备注、光学状态配置说明或平场适用性控件。已有兼容值继续保存和读取。影响 FR-02、FR-04。

### Q-07 同名的比较口径

**Open。** 若输入只差大小写、首尾空格，或原记录已归档，是否算重名？

选择一项作为设备和设备组合各自的比较规则。保存自身原名允许通过。历史重名记录先保留，可继续读取和沿用自身名称。

| 选项 | 规则 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 去除首尾空白、忽略大小写；归档或删除后保留的记录继续占用名称。 | 名称容易区分，恢复记录时不会与新记录撞名。 | 用户不能只靠大小写或归档释放名称；长期保留的名称可能越来越多。 |
| B | 去除首尾空白，区分大小写；归档或删除后保留的记录继续占用名称。 | 容许用大小写区分自命名，恢复时不必处理名称冲突。 | 相似名称容易看错，手动查找和选择时辨识成本较高。 |
| C | 去除首尾空白、忽略大小写；归档或删除后保留的记录释放名称。 | 当前列表可重复利用旧名称，命名空间更灵活。 | 恢复时可能撞名，需要让用户改名才能恢复，历史记录与新记录可能同名。 |

影响 FR-01、FR-02、FR-03、FR-04 与 CASE-07。大小写折叠的具体字符范围、旧重名记录的更新规则需在选项确定后落入技术规格及并发验收。

### Q-08 删除后如何恢复设备组合

**Open。** D-09 已要求历史引用继续可用、新引用禁止。这里选择用户是否能够重新启用被删除的组合。

| 选项 | 用户操作 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 提供单独的已删除列表，用户可恢复；恢复后才可再次用于新关联。 | 误删后可自行恢复，既有引用和组合身份保持连续。 | 需要删除列表、恢复交互及名称冲突处理。 |
| B | 前台不提供恢复；用户需要时新建组合，原历史引用仍可读取。 | 前台流程简单，删除后的选择范围明确。 | 误删无法在界面恢复原组合，新建会产生新的组合身份。 |
| C | 提供限时恢复入口，到期后隐藏恢复入口，但继续保留历史引用。 | 兼顾短期误删恢复与日常列表简洁。 | 需要确定期限及过期表现，用户可能在期限后无法自行恢复。 |

影响 FR-03、交互、删除 API、名称冲突和 CASE-03。删除后的历史资料保留是 D-09 的既定约束，以上选项均须遵循。

### Q-09 历史引用何时记录配置

**Open。** 前台始终显示当前配置且不展示版本。未来素材或观测会话引用组合时，需要确定后台保留哪一时刻的配置，才能在组合后来改变或被删除后解释过去的关联。

| 选项 | 记录时机 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 在素材或观测会话正式建立关联时保存当时配置。 | 历史关联能反映建立时的设备情况，后续改动不会改写过去。 | 需要在关联事务中记录完整配置；关联后实际器材变化需另行更新关联。 |
| B | 在会话结束或素材导入完成时保存配置。 | 能记录一次流程结束时的最终配置，适合结束前经常调整的场景。 | 中途改变可能无法逐段还原，流程异常结束时需要补记规则。 |
| C | 历史只保留组合身份，使用时读取组合的最新配置。 | 数据和实现较简单，规格修正能立即反映。 | 后续编辑会改变历史显示，无法可靠还原当时的设备配置。 |

影响 FR-02、FR-05，以及未来素材和观测会话的数据契约。当前这些关联尚未实现，选择后需在相应 Feature 建立具体字段和测试。

## 产品与架构审查

本节为评审草案，所有新选项都是 Proposed，不能覆盖 D-01～10。Q-07～09 仍待选择。优先确定删除及引用的语义，再确定名称、并发与历史行为。实现中的行版本用于并发控制，不代表前台需要展示版本。未来的素材与采集关联目前尚未实现，以下跨 Feature 选项属于设计输入。

### 当前实现与目标的主要差距

| 范围 | 当前源码事实 | 产品影响与待确认项 |
| --- | --- | --- |
| 组合删除 | `OpticalTrainService.delete_train` 在事务中删除当前配置、旧快照、默认指针和组合主记录。 | D-09 要求隐藏后保留既有引用，现状不满足。已物理删除的历史不能仅通过新规则找回。 |
| 设备删除 | `check_equipment_references` 扫描当前配置和旧快照，检查与删除在写事务中执行。 | 保存历史后，历史引用是否持续阻止删除设备取决于历史记录包含什么及 Q-10。 |
| 归档选择 | 前端读取包含归档设备的列表并限制新选择，服务端组件校验目前只检查存在性与类型。 | 直接 API 仍可能新加入归档设备。并发归档和保存时，必须以服务端事务检查结果为准。 |
| 组合配置 | 当前 draft 优先，缺 draft 时读取旧默认或最近历史；保存时校验组件并更新行版本。 | 旧历史回退情况下，“已有引用”的判断必须以保存前有效配置为基准，不能只检查 draft 是否存在。 |
| 并发和提交 | 更新携带行版本，创建没有专门的幂等键；数据库写事务用于写入。 | 双端编辑、名称竞争和网络超时有不同解决方式，需分别定规则。 |
| 历史展示 | 历史读取 API 仍存在，旧历史写入接口拒绝。 | D-10 约束用户界面；已有 MCP/API 兼容读取如何限制仍需评估。 |
| 自动化清理 | 当前测试通过 DELETE 后检查 404 与集合为空。 | D-09 实现后，普通列表为空与内部记录清除是两个不同结果，测试清理策略见 Q-17。 |

源码依据见 `astrophoto/equipment/service.py`、`trains.py`、`snapshots.py`、`astrophoto/api/equipment.py` 和 `frontend/src/features/library/pages/OpticalTrainEditor.tsx`。上述为静态核对，不构成测试通过。

### Q-10 历史组合引用的设备能否删除

**场景** 某设备只出现在已删除组合的历史记录中，用户想删除该设备。

| 选项 | 规则 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 历史记录保存足够的设备信息后允许删除设备，历史显示保留当时信息。 | 可清理不用的设备，历史仍可解释。 | 需要定义快照字段、旧数据补全与损坏时的处理，现有引用扫描需调整。 |
| B | 只要任一历史引用存在就阻止物理删除，允许归档。 | 实现规则直接，设备详情仍可从原记录读取。 | 随历史增长，用户可能永远不能删除设备，需要清晰展示阻止原因。 |
| C | 将设备删除也改为隐藏并保留身份，所有旧引用继续指向原记录。 | 设备与组合生命周期一致，已有引用容易保持。 | 数据持续增长，搜索、恢复、命名和权限都要处理隐藏状态。 |

**依赖** Q-09、Q-11 和数据保留期限。现有已确认的设备引用保护在选择新规则前继续适用。

### Q-11 关联历史需要保存哪些内容

**场景** 已关联的设备后来改名、修正规格、调整配件顺序或被删除。

| 选项 | 保存内容 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 保存组合身份、当时设备身份、名称、类型、规格、配件顺序及来源时间，保留未知值。 | 可解释当时配置，设备之后改名或删除也能读。 | 存储重复资料，需明确字段版本、单位及旧数据缺失的显示。 |
| B | 仅保存设备身份和组合关系，读取时查询实时设备。 | 存储量小，信息修正会自动反映。 | 删除或修改设备后历史可能不可读或失真，须额外解决 D-09 的可用性。 |
| C | 保存身份、名称和少量关键光学参数。 | 存储与可读性居中。 | 关键字段清单需持续维护，遗漏参数可能影响未来复现。 |

**依赖** Q-09、Q-10。若选择 B，必须额外保留可供历史引用使用的设备记录，不能承诺任意物理删除。

### Q-12 已保存的归档设备如何影响“已配置”

**场景** 一个完整组合包含后来归档的相机。D-06 已允许保留旧引用。

| 选项 | 状态与后续使用 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 组合仍显示已配置，明确标识归档设备；未来建立新业务关联前提示用户检查。 | 保留已有组合和历史，状态不会突然变成缺设备。 | 使用时需要额外提示和清晰的处理路径。 |
| B | 组合改为需要检查，保留设备引用但禁止用于新业务关联。 | 防止误用已停用设备。 | 用户可能只是整理列表，归档操作会影响原本可用的组合。 |
| C | 维持已配置，允许新业务关联且不提示。 | 操作最少。 | 用户可能没有注意到设备已归档，不能轻易判断实际器材状态。 |

**依赖** D-06、未来业务关联入口。新加入归档设备仍禁止。

### Q-13 归档、删除与编辑发生竞争时如何处理

**场景** 页面 A 正在编辑组合，页面 B 归档其中一个设备、删除组合或改变其配置。

| 选项 | 冲突处理 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 写事务内重新检查组合状态、行版本及组件状态；拒绝冲突，保留输入并展示最新状态供用户处理。 | 防止过时写入和新增归档引用，用户可判断再提交。 | 需要清晰的冲突提示与恢复步骤。 |
| B | 自动加载新状态并合并未冲突字段后保存。 | 简单修改时减少重复操作。 | 需定义字段级合并、配件顺序与删除冲突，自动合并结果可能出乎意料。 |
| C | 最后一次提交覆盖之前的修改。 | 实现简单。 | 可能丢失其他页面的更改，也难以保护归档后的新引用。 |

**约束** C 与既有“陈旧写入无静默覆盖”冲突，仅作取舍比较，采用须明确变更既有决定。

### Q-14 创建请求结果不明确时如何避免重复

**场景** 服务端已经提交创建，但网络中断导致页面没有收到结果。D-05 已要求先保留输入、查列表。

| 选项 | 重试方式 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 保留当前人工核对流程，同时为创建请求提供持久幂等键；同键同请求返回原结果，不同请求报冲突。 | 响应丢失后可安全重试，也能处理并发和重启。 | 需要保存请求与结果、定义保留期限、清理和旧客户端兼容。 |
| B | 只保留当前人工核对流程，重名规则阻止重复。 | 改动较少。 | 名称查找无法可靠证明是否为同一次请求，旧重名和名称变化会增加歧义。 |
| C | 超时后页面自动以新请求重试。 | 用户操作少。 | 可能创建多条记录或收到不易理解的重名错误。 |

**依赖** Q-07 的名称规则。幂等与名称唯一性分别解决请求重试和业务命名。

### Q-15 旧数据库中的同名和异常历史如何处理

**场景** 现有代码允许重名，旧库可能有同名设备、同名组合或无法完整读取的历史。

| 选项 | 升级后行为 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 保留旧记录与 ID，允许无改名编辑；新建或改名不得制造新的冲突。无法解析的历史保留并报告诊断。 | 不破坏既有数据，用户可逐步整理。 | 数据库唯一性需要兼容旧冲突，列表仍可能暂时有同名项。 |
| B | 升级时自动给重名记录追加后缀。 | 后续能采用统一名称约束，列表更容易区分。 | 会未经用户选择改变名称，外部记录和用户习惯可能受到影响。 |
| C | 检测到重名就暂停升级，要求先手动整理。 | 升级后数据规则最一致。 | 可能阻止用户访问其他正常数据，恢复流程和支持成本较高。 |

**依赖** Q-07、Q-18。应单独验证旧库备份、升级中断及回滚，不能以全新测试库证明兼容性。

### Q-16 不完整设备组合允许进入哪些下游流程

**场景** 用户只配置了相机，或设备信息中缺焦距、口径、倍率。

| 选项 | 使用范围 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 可以保存和查看；未来关联流程明确显示缺失项，是否允许继续由具体业务决定。 | 用户能渐进整理设备，避免把未知值伪造为零。 | 下游需要逐项定义最低要求和提示。 |
| B | 只有相机与主光学均存在且关键规格完整才允许任何关联。 | 下游校验统一，记录较完整。 | 会阻挡只知道部分器材信息的用户，也可能把可选规格变成必填。 |
| C | 允许所有不完整组合进入所有流程且不提示。 | 操作最快。 | 缺失条件可能导致计算结果无法解释或关联错误。 |

**依赖** 未来素材、采集与校准需求。现有“已配置”仅依据相机和主光学存在，不能推导出物理兼容性。

### Q-17 删除后 API 语义与测试数据清理

**场景** D-09 要求隐藏组合并保留历史。原测试会删除组合后断言 404，并要求隔离库无记录。

| 选项 | 用户删除与测试收尾 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A | 用户 DELETE 产生隐藏状态并验证历史仍可用；测试通过专门的隔离库生命周期清理数据库，分别断言 API 可见性和隔离环境清除。 | 兼顾业务语义与测试闭环，避免普通 API 暴露清除历史能力。 | 仅用用户 DELETE 无法证明物理无残留，也不满足用户提出的逐项 API 清除要求。 |
| B（建议） | 提供仅在隔离测试宿主启用的受控清理 API，测试通过它删除本次记录；普通删除仍保留历史。 | 符合用户要求的逐项 API 清除，也可验证物理无残留。 | 需设计隔离宿主限定、授权、关联检查和失败恢复，不能把真实用户数据纳入该能力。 |
| C | 只检查普通列表无记录，保留隐藏行并结束测试。 | 实施成本低。 | 无法证明测试数据被清除，重复运行会累积记录，也与用户要求的无残留目标冲突。 |

**特别说明** 用户此前要求每次测试通过 API 删除测试数据形成闭环。A 的物理清理由隔离库生命周期完成，与该要求存在差异；B 更贴近原要求，但永久清除接口的边界需用户决定。不能把 404 或列表为空单独当作数据库无残留。

### Q-18 名称的 Unicode 与旧重名精确比较

**场景** 全角空格、组合重音、不同 Unicode 表示或英文大小写可能让名称看起来相同。Q-07 已讨论普通空白、大小写和归档占名。

| 选项 | 比较方式 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 去除首尾 Unicode 空白，并做 Unicode 规范化与大小写折叠；保存用户原始可见名称。 | 中英文和常见等价字符的行为较一致，减少视觉相同的重复。 | 少数语言的折叠规则可能不符合用户预期，升级时要检测新增冲突。 |
| B | 只处理首尾空白和 ASCII 大小写。 | 行为容易解释，与既有数据库比较较容易对应。 | 非 ASCII 字母及等价字符可能形成视觉重复。 |
| C | 仅逐字符比较，首尾空白按 Q-07 处理。 | 最少改变用户输入的语义。 | 视觉上几乎相同的名称可以并存，查找和选择更困难。 |

**依赖** Q-07 和 Q-15。名称唯一性需要与实际数据库写入在同一并发保护范围内完成，不能只依赖前端检查。

### Q-19 设备规格变化对现有组合的提示

**场景** 相机像元尺寸、望远镜焦距或减焦倍率被修改，多个组合的当前估算会随之变化。

| 选项 | 行为 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 保存前显示受影响组合数量或名称，确认后更新当前组合详情；历史关联按 Q-09/Q-11 保存的规则处理。 | 用户能理解修改范围，符合当前配置动态更新。 | 需要计算引用并展示，频繁修正时多一步操作。 |
| B | 直接保存并刷新当前组合，无额外提示。 | 操作简单，符合当前实时读取模型。 | 用户可能不知道其他组合的估算也已改变。 |
| C | 禁止修改被引用的设备规格，要求新建设备。 | 既有组合不会因规格变动而改变。 | 会阻碍纠正错误并制造重复设备，与当前动态更新方向存在冲突。 |

### Q-20 配件兼容性与估算可信度

**场景** 用户组合多片减焦/平场配件，或倍率、后截距及像圈不完整。实际效果可能受器材匹配与安装距离影响。

| 选项 | 产品行为 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 允许保存，已有计算标明为基于登记参数的估算，缺参数显示未知；对适配性保持未验证。 | 尊重真实配置的复杂性，避免把标称计算当成实际兼容结论。 | 不能自动保证用户的器材可用，需要用户自行核实。 |
| B | 建立型号级兼容关系，匹配失败禁止保存。 | 已核验的组合可得到更明确约束。 | 需要持续维护可靠型号与适配数据库，缺数据时容易误阻断。 |
| C | 只计算并展示数值，不区分标称与验证状态。 | 界面简洁。 | 可能让用户误认为结果代表实测和兼容性。 |

### Q-21 数据备份、恢复与身份冲突

**场景** 用户恢复旧资产数据库，或者将另一实例的设备数据搬入现有实例。

| 选项 | 产品支持范围 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 本期保留数据库备份和恢复的工程流程，整库恢复前确认目标；跨实例合并另立需求。 | 交付范围清晰，避免把名称当成稳定身份而误合并。 | 用户不能在当前设备页面直接合并两套资料。 |
| B | 提供设备导出、预览冲突并由用户逐项导入合并。 | 适合跨机器迁移和选择性恢复。 | 需设计 ID 映射、重复、历史引用、失败回滚及兼容版本。 |
| C | 以名称自动合并不同实例设备。 | 使用步骤少。 | 同型号不同实体可能被误合并，历史引用也可能指向错误对象。 |

**依赖** 本地存储专题的备份与恢复契约。当前无设备导入合并能力。

### Q-22 搜索、分页与大量设备的行为

**场景** 快速新增或批量使用后，设备超过一页，列表遍历期间又有新增、归档或改名。

| 选项 | 读取方式 | 优点 | 缺点 |
| --- | --- | --- | --- |
| A（建议） | 维持分页与稳定 ID 游标，明确并发更改时可刷新结果；选择器逐页读取并处理失败。 | 与现有接口接近，资源用量可控。 | 翻页期间变化可能导致同一次浏览不是固定快照，需要提供刷新路径。 |
| B | 每次查询提供固定快照及快照游标。 | 翻页结果一致，便于严格对账。 | 增加服务状态、过期处理和资源开销。 |
| C | 页面一次加载全部数据。 | 客户端筛选简单。 | 大量设备时延迟、内存与网络成本上升。 |

### 决策依赖与边界用例

1. 先确定 Q-08、Q-10、Q-11、Q-17。删除、历史引用、设备保护及测试清理必须共同成立。Q-09 决定历史采集时机，Q-12 决定归档设备能否用于未来业务。
2. 再确定 Q-07、Q-15、Q-18。名称比较与历史重名、恢复时的冲突处理属于同一闭环。Q-14 的请求幂等独立于名称判断。
3. Q-13、Q-16、Q-19～22 涉及并发、计算、批量读取及跨 Feature 范围，可按首版和后续能力分别选择。
4. 每项选择要记录决定来源、日期、影响的 FR 和对应测试；同步 UX、技术、开发、测试计划与实际 API 文档。尚未实现的决定保持待实现，旧测试仅证明原基线。

| 边界场景 | 需要明确的结果或验收 |
| --- | --- |
| 两个客户端同时创建同名对象 | 同一比较规则下最多一个成功，失败者保留输入；确认旧重名记录不被修改。 |
| 组合编辑与设备归档并发 | 已保存引用可保留或移除，新引用拒绝；提交结果以事务中的状态为准。 |
| 删除请求成功但响应丢失 | 再查状态能够区分已隐藏、仍存在和请求失败；重试不会清除历史或影响共享设备。 |
| 删除后恢复、同名已被占用 | 根据 Q-07、Q-08 定义恢复是否拒绝及改名过程，历史 ID 与引用不变。 |
| 只有旧默认或旧最新历史、没有当前 draft | 把读取时选中的有效配置作为已有引用的判断依据，避免普通保存时误拒绝归档设备。 |
| 后台历史引用指向缺失或损坏的设备 | 保留可读字段并报告缺失，不将未知值当作零；修复或降级策略由 Q-10、Q-11、Q-15 决定。 |
| 同一设备被多个组合引用 | 删除或归档一个组合不能删除共享设备，也不能更改其他组合。 |
| 快速新增设备后取消组合编辑 | 已单独保存的设备仍存在；提示和清理由产品确认，测试应使用 API 对本次测试数据收尾。 |
| 测试失败、进程中断、重复运行 | 已创建样本可识别，清理按 Q-17 执行；验证用户删除语义、历史可读与测试库最终清除。 |
| Unicode 名称、旧重名与归档恢复 | 单独覆盖大小写、全角空格、规范化、同名旧数据及恢复冲突；不更改既有记录 ID。 |
| 规格为未知、0、精度边界或类型不符 | 区分未知与有效零值，遵循字段单位及类型约束；修改前后复核组合估算和已保存历史。 |
| 数据库不可用或备份恢复中断 | 保留原数据并返回可诊断错误，避免在未知状态下重建为空库；跨实例合并按 Q-21。 |

## 当前工作树核对

**Verified（静态，main@4c0cf4d 加当前工作树）**。Vue 当前仍显示「设备与光学链路」和「光学链路」，英文页签为 Optical Trains，D-04 的文案改名待实施。建议英文显示 Equipment Combinations。现有路由、数据和 MCP 工具名仍可用原标识。资料库是复用组件和页面目录的名称，Assets 页仍是占位。设备编辑包含四类字段与可折叠摘要，光路直接保存，允许快速新增独立设备并返回光路编辑。快速新增提交后设备独立持久化，即使随后放弃光路，也可在「我的设备」找回。编辑器当前未提供变更备注、旋转和平场适用性字段；服务接口存取这些值，已有值随配置保存。光路状态和筛选沿用 `published` 兼容值，用户界面显示“已配置”。历史发布与默认切换仅有旧证据，当前兼容入口用于读取。设备及组合的名称校验检查必填与长度，服务和模型没有同名写入守卫。当前编辑器排除新选的归档设备，仍显示已保存的归档引用；后端检查存在性与类型，尚未拒绝新增归档引用。单选筛选和不新增光学字段的规则与现状一致。 [交互规格](02_UI_UX.md) · [技术契约](03_TECH.md) · [测试计划](05_TEST_PLAN.md)

## 官网核验的临时验收数据

设备目录含 **50 条**，包括 9 款相机、12 款主光学设备、11 款光学配件和 18 个滤镜记录。滤镜均为厂家销售的独立产品或明确列出的套装片，覆盖全部 13 种现有滤镜类型。型号、具体变体及填入的产品规格于 2026-11-21 核对厂家产品页、规格图或手册。字段缺乏厂家依据时省略。枚举、短名称和规格文字按本项目字段约定转换。太阳滤镜只在设备目录中验证。

### 设备创建数据

下列为有效 JSON。每项的 payload 对应设备创建请求，id 是本文的查找键，由测试人员映射到创建后的服务端 UUID。英文商品名用作默认自命名；中文搜索和重名用例可以另选名称，厂商、型号与规格保持原值。表后的来源和这里的键一一对应。

```json
[
  {"id":"C01","payload":{"equipment_type":"camera","name":"ZWO ASI533MC Pro","manufacturer":"ZWO","model":"ASI533MC Pro","specs":{"sensor_name":"IMX533","sensor_kind":"osc","sensor_width_px":3008,"sensor_height_px":3008,"pixel_size_x_um":3.76,"pixel_size_y_um":3.76,"adc_bit_depth":14,"cooling_supported":true}}},
  {"id":"C02","payload":{"equipment_type":"camera","name":"ZWO ASI533MM Pro","manufacturer":"ZWO","model":"ASI533MM Pro","specs":{"sensor_name":"IMX533","sensor_kind":"mono","sensor_width_px":3008,"sensor_height_px":3008,"pixel_size_x_um":3.76,"pixel_size_y_um":3.76,"adc_bit_depth":14,"cooling_supported":true}}},
  {"id":"C03","payload":{"equipment_type":"camera","name":"ZWO ASI2600MC Pro","manufacturer":"ZWO","model":"ASI2600MC Pro","notes":"4×4 为相机软件合并的最大模式，硬件最大为 3×3。","specs":{"sensor_name":"IMX571","sensor_kind":"osc","sensor_width_px":6248,"sensor_height_px":4176,"pixel_size_x_um":3.76,"pixel_size_y_um":3.76,"adc_bit_depth":16,"cooling_supported":true,"max_bin_x":4,"max_bin_y":4}}},
  {"id":"C04","payload":{"equipment_type":"camera","name":"ZWO ASI2600MM Pro","manufacturer":"ZWO","model":"ASI2600MM Pro","notes":"4×4 为相机软件合并的最大模式，硬件最大为 3×3。","specs":{"sensor_name":"IMX571","sensor_kind":"mono","sensor_width_px":6248,"sensor_height_px":4176,"pixel_size_x_um":3.76,"pixel_size_y_um":3.76,"adc_bit_depth":16,"cooling_supported":true,"max_bin_x":4,"max_bin_y":4}}},
  {"id":"C05","payload":{"equipment_type":"camera","name":"ZWO ASI294MM Pro","manufacturer":"ZWO","model":"ASI294MM Pro","notes":"像素和采样规格采用 Bin 2。","specs":{"sensor_name":"IMX492","sensor_kind":"mono","sensor_width_px":4144,"sensor_height_px":2822,"pixel_size_x_um":4.63,"pixel_size_y_um":4.63,"adc_bit_depth":14,"cooling_supported":true}}},
  {"id":"C06","payload":{"equipment_type":"camera","name":"ZWO ASI585MC","manufacturer":"ZWO","model":"ASI585MC","notes":"型号为非 Pro；产品样本省略 cooling_supported。","specs":{"sensor_name":"IMX585","sensor_kind":"osc","sensor_width_px":3840,"sensor_height_px":2160,"pixel_size_x_um":2.9,"pixel_size_y_um":2.9,"adc_bit_depth":12}}},
  {"id":"C07","payload":{"equipment_type":"camera","name":"QHYCCD QHY268M PH","manufacturer":"QHYCCD","model":"QHY268M PH","notes":"采用有效成像尺寸，不含 overscan。","specs":{"sensor_name":"IMX571","sensor_kind":"mono","sensor_width_px":6252,"sensor_height_px":4176,"pixel_size_x_um":3.76,"pixel_size_y_um":3.76,"adc_bit_depth":16,"cooling_supported":true,"readout_modes":[{"mode_key":"0","display_name":"Photographic DSO Mode"},{"mode_key":"1","display_name":"High Gain Mode"},{"mode_key":"2","display_name":"Extended Full Well Mode"},{"mode_key":"3","display_name":"Extended Full Well Mode-2CMS"},{"mode_key":"4","display_name":"Photographic DSO Mode-2CMS"},{"mode_key":"5","display_name":"High Gain Mode-2CMS"}]}}},
  {"id":"C08","payload":{"equipment_type":"camera","name":"Canon EOS 6D Mark II","manufacturer":"Canon","model":"EOS 6D Mark II","notes":"保留像元间距，未将 RAW 输出尺寸或编码位深填为传感器尺寸或 ADC。","specs":{"sensor_kind":"color","pixel_size_x_um":5.67,"pixel_size_y_um":5.67}}},
  {"id":"C09","payload":{"equipment_type":"camera","name":"Canon EOS Ra","manufacturer":"Canon","model":"EOS Ra","specs":{"sensor_kind":"color","pixel_size_x_um":5.36,"pixel_size_y_um":5.36}}},
  {"id":"T01","payload":{"equipment_type":"primary_optics","name":"Sky Rover Optics 80GP S (80APO PRO)","manufacturer":"Sky Rover Optics","model":"80GP S (80APO PRO)","notes":"采用 2024 款规格；焦距和口径见产品页的规格图。","specs":{"optics_kind":"telescope","optical_design":"Air-spaced triplet APO (Super ED)","aperture_mm":80,"native_focal_length_mm":480,"native_f_ratio":6}}},
  {"id":"T02","payload":{"equipment_type":"primary_optics","name":"Sky-Watcher Evostar 72ED","manufacturer":"Sky-Watcher","model":"Evostar 72ED","specs":{"optics_kind":"telescope","optical_design":"ED apochromatic doublet","aperture_mm":72,"native_focal_length_mm":420,"native_f_ratio":5.8}}},
  {"id":"T03","payload":{"equipment_type":"primary_optics","name":"Sky-Watcher Quattro 150P","manufacturer":"Sky-Watcher","model":"Quattro 150P","notes":"采用原生规格。","specs":{"optics_kind":"telescope","optical_design":"Newtonian","aperture_mm":150,"native_focal_length_mm":600,"native_f_ratio":4}}},
  {"id":"T04","payload":{"equipment_type":"primary_optics","name":"Celestron EdgeHD 8 Optical Tube Assembly (CGE Dovetail)","manufacturer":"Celestron","model":"EdgeHD 8 Optical Tube Assembly (CGE Dovetail)","specs":{"optics_kind":"telescope","optical_design":"EdgeHD","aperture_mm":203.2,"native_focal_length_mm":2032,"native_f_ratio":10}}},
  {"id":"T05","payload":{"equipment_type":"primary_optics","name":"William Optics Cat 51 WIFD","manufacturer":"William Optics","model":"Cat 51 WIFD","specs":{"optics_kind":"telescope","optical_design":"4-element Petzval","aperture_mm":51,"native_focal_length_mm":250,"native_f_ratio":4.9,"image_circle_mm":48}}},
  {"id":"T06","payload":{"equipment_type":"primary_optics","name":"Sky-Watcher BK MAK127 OTAW","manufacturer":"Sky-Watcher","model":"BK MAK127 OTAW","specs":{"optics_kind":"telescope","optical_design":"Maksutov-Cassegrain","aperture_mm":127,"native_focal_length_mm":1500,"native_f_ratio":12}}},
  {"id":"T07","payload":{"equipment_type":"primary_optics","name":"Canon EF 135mm f/2L USM","manufacturer":"Canon","model":"EF 135mm f/2L USM","specs":{"optics_kind":"lens","optical_design":"10 elements in 8 groups","native_focal_length_mm":135,"native_f_ratio":2}}},
  {"id":"T08","payload":{"equipment_type":"primary_optics","name":"Sigma 135mm F1.8 DG HSM | Art (Canon EF)","manufacturer":"Sigma","model":"135mm F1.8 DG HSM | Art (Canon EF)","specs":{"optics_kind":"lens","optical_design":"13 elements in 10 groups","native_focal_length_mm":135,"native_f_ratio":1.8}}},
  {"id":"T09","payload":{"equipment_type":"primary_optics","name":"Canon RF50mm F1.8 STM","manufacturer":"Canon","model":"RF50mm F1.8 STM","specs":{"optics_kind":"lens","optical_design":"6 elements in 5 groups","native_focal_length_mm":50,"native_f_ratio":1.8}}},
  {"id":"T10","payload":{"equipment_type":"primary_optics","name":"Celestron C8 Optical Tube Assembly (CGE Dovetail)","manufacturer":"Celestron","model":"C8 Optical Tube Assembly (CGE Dovetail)","specs":{"optics_kind":"telescope","optical_design":"Schmidt-Cassegrain","aperture_mm":203.2,"native_focal_length_mm":2032,"native_f_ratio":10}}},
  {"id":"T11","payload":{"equipment_type":"primary_optics","name":"Sky Rover Optics 86MA Multipurpose Astrograph","manufacturer":"Sky Rover Optics","model":"86MA Multipurpose Astrograph","specs":{"optics_kind":"telescope","optical_design":"Air-spaced quadruplet","aperture_mm":86,"native_focal_length_mm":602,"native_f_ratio":7,"image_circle_mm":44}}},
  {"id":"T12","payload":{"equipment_type":"primary_optics","name":"Sky-Watcher Evostar 80EDX","manufacturer":"Sky-Watcher","model":"Evostar 80EDX","specs":{"optics_kind":"telescope","optical_design":"Apochromatic doublet","aperture_mm":80,"native_focal_length_mm":600,"native_f_ratio":7.5}}},
  {"id":"A01","payload":{"equipment_type":"optical_accessory","name":"Sky Rover Optics 1x Field Flattener for 80 APO PRO","manufacturer":"Sky Rover Optics","model":"1x Field Flattener for 80 APO PRO","specs":{"accessory_kind":"flattener","nominal_factor":1,"design_backfocus_mm":55}}},
  {"id":"A02","payload":{"equipment_type":"optical_accessory","name":"Sky Rover Optics 0.8x Reducer Flattener for 80/90 APO PRO","manufacturer":"Sky Rover Optics","model":"0.8x Reducer Flattener for 80/90 APO PRO","notes":"厂家标注 80/90 APO PRO，未额外声明覆盖其他 GPS 代际。","specs":{"accessory_kind":"reducer","nominal_factor":0.8,"design_backfocus_mm":55}}},
  {"id":"A03","payload":{"equipment_type":"optical_accessory","name":"Celestron Reducer Lens .7x - EdgeHD 800","manufacturer":"Celestron","model":"Reducer Lens .7x - EdgeHD 800","specs":{"accessory_kind":"reducer","nominal_factor":0.7,"design_backfocus_mm":105}}},
  {"id":"A04","payload":{"equipment_type":"optical_accessory","name":"Celestron Reducer - Corrector #94175","manufacturer":"Celestron","model":"Reducer - Corrector #94175","specs":{"accessory_kind":"reducer","nominal_factor":0.63,"design_backfocus_mm":105}}},
  {"id":"A05","payload":{"equipment_type":"optical_accessory","name":"Celestron Reducer Lens .7x - EdgeHD 925","manufacturer":"Celestron","model":"Reducer Lens .7x - EdgeHD 925","specs":{"accessory_kind":"reducer","nominal_factor":0.7,"design_backfocus_mm":146}}},
  {"id":"A06","payload":{"equipment_type":"optical_accessory","name":"Sky-Watcher Focal Reducer - 80ED #20236","manufacturer":"Sky-Watcher","model":"Focal Reducer - 80ED #20236","specs":{"accessory_kind":"reducer","nominal_factor":0.85}}},
  {"id":"A07","payload":{"equipment_type":"optical_accessory","name":"William Optics FLAT 6AIII","manufacturer":"William Optics","model":"FLAT 6AIII","specs":{"accessory_kind":"reducer","nominal_factor":0.8}}},
  {"id":"A08","payload":{"equipment_type":"optical_accessory","name":"Celestron X-Cel LX 2x Barlow Lens - 1.25 inch","manufacturer":"Celestron","model":"X-Cel LX 2x Barlow Lens - 1.25 inch","specs":{"accessory_kind":"barlow","nominal_factor":2}}},
  {"id":"A09","payload":{"equipment_type":"optical_accessory","name":"Celestron X-Cel LX 3x Barlow Lens - 1.25 inch","manufacturer":"Celestron","model":"X-Cel LX 3x Barlow Lens - 1.25 inch","specs":{"accessory_kind":"barlow","nominal_factor":3}}},
  {"id":"A10","payload":{"equipment_type":"optical_accessory","name":"APM Telescopes APM Comacorrecting 1 1/4 inch ED Barlow 2.7x","manufacturer":"APM Telescopes","model":"APM Comacorrecting 1 1/4 inch ED Barlow 2.7x","notes":"后焦测量基准为最后一片镜片的中部。","specs":{"accessory_kind":"barlow","nominal_factor":2.7,"design_backfocus_mm":105,"clear_aperture_mm":22}}},
  {"id":"A11","payload":{"equipment_type":"optical_accessory","name":"Baader Planetarium VIP Modular Barlow 2x","manufacturer":"Baader Planetarium","model":"VIP Modular Barlow 2x","specs":{"accessory_kind":"barlow","nominal_factor":2,"clear_aperture_mm":28}}},
  {"id":"F01","payload":{"equipment_type":"filter","name":"Antlia LRGB-V Pro L 36mm Unmounted","manufacturer":"Antlia","model":"LRGB-V Pro L 36mm Unmounted","specs":{"filter_kind":"l","physical_size_mm":36,"filter_format":"36 mm unmounted"}}},
  {"id":"F02","payload":{"equipment_type":"filter","name":"Antlia LRGB-V Pro R 36mm Unmounted","manufacturer":"Antlia","model":"LRGB-V Pro R 36mm Unmounted","specs":{"filter_kind":"r","physical_size_mm":36,"filter_format":"36 mm unmounted"}}},
  {"id":"F03","payload":{"equipment_type":"filter","name":"Antlia LRGB-V Pro G 36mm Unmounted","manufacturer":"Antlia","model":"LRGB-V Pro G 36mm Unmounted","specs":{"filter_kind":"g","physical_size_mm":36,"filter_format":"36 mm unmounted"}}},
  {"id":"F04","payload":{"equipment_type":"filter","name":"Antlia LRGB-V Pro B 36mm Unmounted","manufacturer":"Antlia","model":"LRGB-V Pro B 36mm Unmounted","specs":{"filter_kind":"b","physical_size_mm":36,"filter_format":"36 mm unmounted"}}},
  {"id":"F05","payload":{"equipment_type":"filter","name":"Antlia 3nm H-alpha Pro 36mm Unmounted","manufacturer":"Antlia","model":"3nm H-alpha Pro 36mm Unmounted","specs":{"filter_kind":"ha","physical_size_mm":36,"filter_format":"36 mm unmounted","passbands":[{"band_label":"H-alpha","center_nm":656.3,"fwhm_nm":3}]}}},
  {"id":"F06","payload":{"equipment_type":"filter","name":"Antlia 3nm Oxygen III Pro 36mm Unmounted","manufacturer":"Antlia","model":"3nm Oxygen III Pro 36mm Unmounted","specs":{"filter_kind":"oiii","physical_size_mm":36,"filter_format":"36 mm unmounted","passbands":[{"band_label":"OIII","center_nm":500.7,"fwhm_nm":3}]}}},
  {"id":"F07","payload":{"equipment_type":"filter","name":"Antlia 3nm Sulfur II Pro 36mm Unmounted","manufacturer":"Antlia","model":"3nm Sulfur II Pro 36mm Unmounted","specs":{"filter_kind":"sii","physical_size_mm":36,"filter_format":"36 mm unmounted","passbands":[{"band_label":"SII","center_nm":672.4,"fwhm_nm":3}]}}},
  {"id":"F08","payload":{"equipment_type":"filter","name":"Astronomik CLS CCD 2-inch (M48)","manufacturer":"Astronomik","model":"CLS CCD 2-inch (M48)","specs":{"filter_kind":"broadband","filter_format":"2-inch M48 mounted"}}},
  {"id":"F09","payload":{"equipment_type":"filter","name":"Optolong UV/IR Cut 2-inch mounted","manufacturer":"Optolong","model":"UV/IR Cut 2-inch mounted","specs":{"filter_kind":"uv_ir_cut","filter_format":"2-inch mounted"}}},
  {"id":"F10","payload":{"equipment_type":"filter","name":"Baader Planetarium Solar Continuum 540nm 7.5nm 2-inch","manufacturer":"Baader Planetarium","model":"Solar Continuum 540nm 7.5nm 2-inch","specs":{"filter_kind":"solar","filter_format":"2-inch","passbands":[{"band_label":"Solar Continuum","center_nm":540,"fwhm_nm":7.5}]}}},
  {"id":"F11","payload":{"equipment_type":"filter","name":"Antlia ALP-T Dual Band 3nm SII&OIII 2-inch Mounted","manufacturer":"Antlia","model":"ALP-T Dual Band 3nm SII&OIII 2-inch Mounted","specs":{"filter_kind":"dual_band","filter_format":"2-inch M48x0.75 mounted","passbands":[{"band_label":"SII","center_nm":672.4,"fwhm_nm":3},{"band_label":"OIII","center_nm":500.7,"fwhm_nm":3}]}}},
  {"id":"F12","payload":{"equipment_type":"filter","name":"Antlia Quad Band Anti-Light Pollution 2-inch Mounted","manufacturer":"Antlia","model":"Quad Band Anti-Light Pollution 2-inch Mounted","specs":{"filter_kind":"multi_band","filter_format":"2-inch mounted"}}},
  {"id":"F13","payload":{"equipment_type":"filter","name":"Antlia Methane CH4 1.25-inch Mounted","manufacturer":"Antlia","model":"Methane CH4 1.25-inch Mounted","specs":{"filter_kind":"other","filter_format":"1.25-inch M28.5x0.6 mounted","passbands":[{"band_label":"CH4","center_nm":889}]}}},
  {"id":"F14","payload":{"equipment_type":"filter","name":"Optolong L-eXtreme 2-inch mounted","manufacturer":"Optolong","model":"L-eXtreme 2-inch mounted","specs":{"filter_kind":"dual_band","filter_format":"2-inch mounted","passbands":[{"band_label":"H-alpha","center_nm":656.3,"fwhm_nm":7},{"band_label":"OIII","center_nm":500.7,"fwhm_nm":7}]}}},
  {"id":"F15","payload":{"equipment_type":"filter","name":"Optolong L-eXtreme EOS-R Clip-in","manufacturer":"Optolong","model":"L-eXtreme EOS-R Clip-in","specs":{"filter_kind":"dual_band","filter_format":"Canon EOS R clip-in","passbands":[{"band_label":"H-alpha","fwhm_nm":7},{"band_label":"OIII","fwhm_nm":7}]}}},
  {"id":"F16","payload":{"equipment_type":"filter","name":"Optolong IR Pass685 1.25-inch Mounted","manufacturer":"Optolong","model":"IR Pass685 1.25-inch Mounted","specs":{"filter_kind":"other","filter_format":"1.25-inch mounted"}}},
  {"id":"F17","payload":{"equipment_type":"filter","name":"Antlia 3nm Oxygen III Pro 50x50mm Square Unmounted","manufacturer":"Antlia","model":"3nm Oxygen III Pro 50x50mm Square Unmounted","specs":{"filter_kind":"oiii","filter_format":"50 × 50 mm square unmounted","passbands":[{"band_label":"OIII","center_nm":500.7,"fwhm_nm":3}]}}},
  {"id":"F18","payload":{"equipment_type":"filter","name":"Antlia ALP-T Dualband 3nm Ha&OIII 2-inch Mounted","manufacturer":"Antlia","model":"ALP-T Dualband 3nm Ha&OIII 2-inch Mounted","specs":{"filter_kind":"dual_band","filter_format":"2-inch M48x0.75 mounted","passbands":[{"band_label":"H-alpha","center_nm":656.3,"fwhm_nm":3},{"band_label":"OIII","center_nm":500.7,"fwhm_nm":3}]}}}
]
```

### 逐条厂家来源

| 编号 | 产品 | 官网来源 |
| --- | --- | --- |
| C01 | ZWO ASI533MC Pro | [规格](https://us.zwoastro.com/collections/dso_cooled_cameras/products/asi533-pro-series) · [补充依据 2](https://i.zwoastro.com/wp-content/uploads/2024/07/9f26af0bec5c60ea84107dfec8314859.pdf) |
| C02 | ZWO ASI533MM Pro | [规格](https://us.zwoastro.com/collections/dso_cooled_cameras/products/asi533-pro-series) · [补充依据 2](https://i.zwoastro.com/wp-content/uploads/2024/07/9f26af0bec5c60ea84107dfec8314859.pdf) |
| C03 | ZWO ASI2600MC Pro | [规格](https://www.zwoastro.com/product/asi2600/) · [补充依据 2](https://i.zwoastro.com/zwo-website/manuals/ZWO_ASI2600_Manual_EN.pdf) |
| C04 | ZWO ASI2600MM Pro | [规格](https://www.zwoastro.com/product/asi2600/) · [补充依据 2](https://i.zwoastro.com/zwo-website/manuals/ZWO_ASI2600_Manual_EN.pdf) |
| C05 | ZWO ASI294MM Pro | [规格](https://i.zwoastro.com/zwo-website/manuals/ASI294_Manual_EN_V2.2.pdf) |
| C06 | ZWO ASI585MC | [规格](https://us.zwoastro.com/products/asi585mc-mm) · [补充依据 2](https://i.zwoastro.com/zwo-website/manuals/ASI585_Manual_EN_V1.0.pdf) |
| C07 | QHYCCD QHY268M PH | [规格](https://www.qhyccd.com/astronomical-camera-qhy268/) |
| C08 | Canon EOS 6D Mark II | [规格](https://www.usa.canon.com/support/p/eos-6d-mark-ii) |
| C09 | Canon EOS Ra | [规格](https://www.usa.canon.com/support/p/eos-ra) · [补充依据 2](https://downloads.canon.com/nw/camera/products/eos/ra/specs/eos-ra-specifications.pdf) |
| T01 | Sky Rover Optics 80GP S (80APO PRO) | [规格](https://skyroveroptics.com/products/80-apo-pro-f-6-telescope) · [补充依据 2](https://cdn.shopify.com/s/files/1/0661/3873/4829/files/D1_23f611d8-4514-4422-ad24-924cfe72f20d.png?v=1786692548) |
| T02 | Sky-Watcher Evostar 72ED | [规格](https://skywatcher.com/product/evostar-72ed/) |
| T03 | Sky-Watcher Quattro 150P | [规格](https://skywatcher.com/product/quattro-150p/) |
| T04 | Celestron EdgeHD 8 Optical Tube Assembly (CGE Dovetail) | [规格](https://www.celestron.com/products/edgehd-8-optical-tube-assembly-cge-dovetail/) |
| T05 | William Optics Cat 51 WIFD | [规格](https://williamoptics.com/products/cat-51) |
| T06 | Sky-Watcher BK MAK127 OTAW | [规格](https://www.skywatcher.com/product/bk-mak127-otaw/) |
| T07 | Canon EF 135mm f/2L USM | [规格](https://www.usa.canon.com/support/p/ef-135mm-f-2l-usm) |
| T08 | Sigma 135mm F1.8 DG HSM \| Art (Canon EF) | [规格](https://www.sigma-global.com/en/lenses/a017_135_18/) |
| T09 | Canon RF50mm F1.8 STM | [规格](https://www.usa.canon.com/support/p/rf50mm-f1-8-stm) |
| T10 | Celestron C8 Optical Tube Assembly (CGE Dovetail) | [规格](https://www.celestron.com/products/c8-optical-tube-assembly-cge-dovetail) |
| T11 | Sky Rover Optics 86MA Multipurpose Astrograph | [规格](https://skyroveroptics.com/products/86ma-multipurpose-astrograph-telescope) |
| T12 | Sky-Watcher Evostar 80EDX | [规格](https://skywatcher.com/product/evostar-80edx/) |
| A01 | Sky Rover Optics 1x Field Flattener for 80 APO PRO | [规格](https://skyroveroptics.com/products/sky-rover-1x-field-flattener-photography-25-inches-full-frame-accessary-for-8090102130155-apo-pro) |
| A02 | Sky Rover Optics 0.8x Reducer Flattener for 80/90 APO PRO | [规格](https://www.sky-rover.com/showproject.asp?ProdNum=222) |
| A03 | Celestron Reducer Lens .7x - EdgeHD 800 | [规格](https://www.celestron.com/products/reducer-lens-7x-edgehd-800) |
| A04 | Celestron Reducer - Corrector #94175 | [规格](https://www.celestron.com/products/reducer-corrector) · [补充依据 2](https://www.celestron.com/blogs/knowledgebase/understanding-focal-reducers) |
| A05 | Celestron Reducer Lens .7x - EdgeHD 925 | [规格](https://www.celestron.com/products/reducer-lens-7x-edgehd-925) |
| A06 | Sky-Watcher Focal Reducer - 80ED #20236 | [规格](https://skywatcher.com/product/focal-reducer-80ed/) · [补充依据 2](https://skywatcher.com/product/evostar-80edx/) |
| A07 | William Optics FLAT 6AIII | [规格](https://williamoptics.com/products/flat6Aiii) |
| A08 | Celestron X-Cel LX 2x Barlow Lens - 1.25 inch | [规格](https://www.celestron.com/products/x-cel-lx-2x-barlow-lens-125in) |
| A09 | Celestron X-Cel LX 3x Barlow Lens - 1.25 inch | [规格](https://www.celestron.com/products/x-cel-lx-3x-barlow-lens-125in) |
| A10 | APM Telescopes APM Comacorrecting 1 1/4 inch ED Barlow 2.7x | [规格](https://www.apm-telescopes.net/en/apm-comacorrecting-1-14-ed-barlow-27-x) |
| A11 | Baader Planetarium VIP Modular Barlow 2x | [规格](https://www.baader-planetarium.com/en/vip-2x-modular-barlow-lens-visual-and-photographic.html) |
| F01 | Antlia LRGB-V Pro L 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted) |
| F02 | Antlia LRGB-V Pro R 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted) |
| F03 | Antlia LRGB-V Pro G 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted) |
| F04 | Antlia LRGB-V Pro B 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-lrgb-v-pro-series-filters-36mm-unmounted) |
| F05 | Antlia 3nm H-alpha Pro 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-h-alpha-ha-pro-filter-36mm-unmounted) |
| F06 | Antlia 3nm Oxygen III Pro 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-oxygen-iii-oiii-pro-filter-36mm-unmounted) |
| F07 | Antlia 3nm Sulfur II Pro 36mm Unmounted | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-sulfur-ii-sii-pro-filter-36mm-unmounted) |
| F08 | Astronomik CLS CCD 2-inch (M48) | [规格](https://www.astronomik.com/en/Astronomik-CLS-CCD-2-M48/10208200) · [补充依据 2](https://www.astronomik.com/en/Light-Pollution/CLS-CCD/) |
| F09 | Optolong UV/IR Cut 2-inch mounted | [规格](https://www.optolong.com/index.php/cms/document/detail/id/146.html) |
| F10 | Baader Planetarium Solar Continuum 540nm 7.5nm 2-inch | [规格](https://www.baader-planetarium.com/en/7.5nm-solar-continuum-filter-540nm.html) |
| F11 | Antlia ALP-T Dual Band 3nm SII&OIII 2-inch Mounted | [规格](https://shop.antliafilter.com/products/antlia-alp-t-dual-band-3nm-sii-oiii-filter-2-mounted) |
| F12 | Antlia Quad Band Anti-Light Pollution 2-inch Mounted | [规格](https://shop.antliafilter.com/products/antlia-quad-band-anti-light-pollution-filter-2-mounted) |
| F13 | Antlia Methane CH4 1.25-inch Mounted | [规格](https://shop.antliafilter.com/products/antlia-methane-ch4-filter-1-25-mounted) |
| F14 | Optolong L-eXtreme 2-inch mounted | [规格](https://www.optolong.com/cms/document/detail/id/100.html) · [补充依据 2](https://www.optolong.com/cms/document/detail/id/485.html) |
| F15 | Optolong L-eXtreme EOS-R Clip-in | [规格](https://www.optolong.com/cms/document/detail/id/612.html) |
| F16 | Optolong IR Pass685 1.25-inch Mounted | [规格](https://www.optolong.com/cms/document/detail/id/102.html) |
| F17 | Antlia 3nm Oxygen III Pro 50x50mm Square Unmounted | [规格](https://shop.antliafilter.com/products/antlia-3nm-narrowband-oxygen-iii-oiii-pro-filter-50mm-x-50mm-square-unmounted) |
| F18 | Antlia ALP-T Dualband 3nm Ha&OIII 2-inch Mounted | [规格](https://shop.antliafilter.com/products/antlia-alp-t-dualband-3nm-ha-oiii-filter-2-mounted) |

### 设备组合数据

16 条组合覆盖彩色及单色深空、固定焦距镜头、原生平场、减焦、行星、空组合、不完整组合和多配件顺序。每个有部件的组合均可通过编号查到上表逐件官网证据。厂家明确确认的主镜配套见各组合的 scope，其余是用户在应用中可以登记的用例。这里的滤镜为可选集合。应用当前校验角色、已登记身份和引用关系；光学接口、后截距或整套实体配合需要独立证据。空组合、排序和故障状态是应用数据，厂家无对应商品。

以下为有效 JSON 组合定义。只将 name 和已解析的 UUID 字段写入服务。camera_ref → camera_id，primary_optics_ref → primary_optics_id，accessory_refs → accessory_ids，filter_refs → filter_ids，数组次序保留。使用已有创建接口接收的 draft 对象，拒绝用固定的假 UUID 替代实际记录。

```json
[
  {"id":"G01","name":"80APO PRO 彩色平场","camera_ref":"C01","primary_optics_ref":"T01","accessory_refs":["A01"],"filter_refs":["F09","F14"],"scope":"厂家确认 T01 与 A01 的配套；相机和滤镜为应用登记样本。"},
  {"id":"G02","name":"80APO PRO 彩色减焦","camera_ref":"C01","primary_optics_ref":"T01","accessory_refs":["A02"],"filter_refs":["F14"],"scope":"A02 官网列 80 APO PRO；与 G01 共用设备，平场镜与减焦镜分两套配置。"},
  {"id":"G03","name":"80APO PRO 单色 LRGB 与窄带","camera_ref":"C04","primary_optics_ref":"T01","accessory_refs":["A01"],"filter_refs":["F01","F02","F03","F04","F05","F06","F07"],"scope":"七片是可用滤镜集合。"},
  {"id":"G04","name":"Cat 51 原生平场","camera_ref":"C03","primary_optics_ref":"T05","accessory_refs":[],"filter_refs":["F08"],"scope":"主镜官网说明无需外置平场镜，验证空配件。"},
  {"id":"G05","name":"Newtonian f/4 行星目录","camera_ref":"C06","primary_optics_ref":"T03","accessory_refs":["A10"],"filter_refs":["F16"],"scope":"APM 指明面向 f/4 抛物面牛顿镜，按光学类型匹配，整套组合未做实物装调。"},
  {"id":"G06","name":"EdgeHD 8 0.7x 深空目录","camera_ref":"C03","primary_optics_ref":"T04","accessory_refs":["A03"],"filter_refs":["F12"],"scope":"Celestron 确认 A03 针对 EdgeHD 8。"},
  {"id":"G07","name":"C8 0.63x 深空目录","camera_ref":"C02","primary_optics_ref":"T10","accessory_refs":["A04"],"filter_refs":["F11"],"scope":"Celestron 明确 A04 适配标准型 C8，不适用于 EdgeHD。"},
  {"id":"G08","name":"MA 86 原生焦面","camera_ref":"C07","primary_optics_ref":"T11","accessory_refs":[],"filter_refs":[],"scope":"厂家提供原生平场和 44 mm 像圈；验证滤镜与配件皆空。"},
  {"id":"G09","name":"Canon 6D Mark II EF 广域","camera_ref":"C08","primary_optics_ref":"T07","accessory_refs":[],"filter_refs":[],"scope":"同品牌 EF 卡口场景；镜头口径未填，验证 UI 保留已知焦距，口径缺失时不推算有效焦比。"},
  {"id":"G10","name":"EOS Ra RF 星野与卡入式滤镜","camera_ref":"C09","primary_optics_ref":"T09","accessory_refs":[],"filter_refs":["F15"],"scope":"Canon RF 卡口及 Optolong 对 EOS Ra 的卡入兼容分别由厂家确认。"},
  {"id":"G11","name":"MK127 行星目录","camera_ref":"C06","primary_optics_ref":"T06","accessory_refs":["A08"],"filter_refs":["F13"],"scope":"测试登记行星相机、巴罗与甲烷滤镜，整套机械间距未验证。"},
  {"id":"G12","name":"80EDX 0.85x 深空目录","camera_ref":"C05","primary_optics_ref":"T12","accessory_refs":["A06"],"filter_refs":["F18"],"scope":"主镜官网将 20236 列为配套减焦平场镜。"},
  {"id":"G13","name":"待采购相机 · 72ED","camera_ref":null,"primary_optics_ref":"T02","accessory_refs":[],"filter_refs":[],"scope":"只选主光学；验证部分配置。"},
  {"id":"G14","name":"待选择主镜 · QHY268M PH","camera_ref":"C07","primary_optics_ref":null,"accessory_refs":[],"filter_refs":[],"scope":"只选相机；验证部分配置。"},
  {"id":"G15","name":"等候采购的空组合","camera_ref":null,"primary_optics_ref":null,"accessory_refs":[],"filter_refs":[],"scope":"仅定义用户自命名，验证空配置。"},
  {"id":"G16","name":"顺序校验专用组合","camera_ref":"C01","primary_optics_ref":"T01","accessory_refs":["A01","A02"],"filter_refs":["F09","F14"],"scope":"只用于软件排列、拒绝和撤销用例，组合中的两件配件不得从此样本推断为可一起装机。"}
]
```

### 派生数据、运行隔离与清理

- 正常路径取上方真实型号和规格。翻页、重名和并发派生用已核验型号创建不同测试记录实例。拒绝用例在副本中单独改变一个输入或状态，例如重复引用、空名称、无效版本和过期游标，错误值不入目录。
- 先创建一次性 ASTROPHOTO_HOME 和独立的回环测试宿主目录，真实宿主或 aiohttp fixture 内创建；分组记录 UUID、版本和回执。重复操作前查实际创建状态。测试中断恢复仅检查属于该运行的目录。
- 每个用例结束后，先通过设备 API 删除该次测试创建的设备组合，再删除设备，并验证 DELETE 回执、详情 404 和集合无残留。跨重启两阶段视为一个用例，重启验证退出时完成删除。随后停止测试宿主或关闭数据库连接，再按隔离目录策略清理测试环境。保留正式测试报告需要的脱敏断言与结果。无需在项目中创建同一套数据的第二份副本或分发测试数据库。
- 2026-11-21 使用当前设备和设备组合服务，在一次性 SQLite 数据根创建并重读 50 条设备及 16 条组合，13 条已配置、3 条部分配置。将临时设备实例扩至 101 条，以 1、50、100 的页长遍历，无遗漏或重复。退出后临时库已清除。此结果覆盖数据接纳、引用及分页，浏览器、MCP 和负向用例按计划另验。具体组合生命周期、隔离与失败断言见 [测试矩阵](05_TEST_PLAN.md#官网样本覆盖与执行顺序)。

## 需求评审闭环与下游传播

1. **R1／R2 已完成回溯与场景质询。** 沿用 FR-01～05，并使用现行 Vue、服务和历史证据交叉核对。
2. **R3 已回填 D-04～10。** 应用名称、重名、归档引用、筛选、表单以及删除历史和前台版本展示的用户决定。Q-07～09 保留开放。UI 词条、重名服务校验、归档新增校验与组合删除语义属于待实施差异，既有证据按原基线保留。
3. **R4 待执行。** 代码实现后按测试计划集中复验。记录临时样本、实际受测版本、并发结果与数据清理。结果与决定不符时回流到对应 FR、Q 或实现说明。

CASE-01～06 保留编号，CASE-03 的组合删除预期需按 D-09 更新。CASE-07 核对创建与改名的重复提示及并发，CASE-08 核对两列表单选筛选及会话边界。Q-07～09 确认后同步受影响的界面、技术、开发和测试文档。 [Feature 索引](00_FEATURE_INDEX.md) · [界面](02_UI_UX.md) · [技术设计](03_TECH.md) · [开发规格](04_DEV.md) · [测试计划](05_TEST_PLAN.md)
