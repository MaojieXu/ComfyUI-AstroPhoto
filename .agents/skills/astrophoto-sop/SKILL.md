---
name: astrophoto-sop
description: 用于 ComfyUI_AstroPhoto 的 Web Chat × Local 多 Agent 开发。用户要求上下文注入、S0–S9、PRD/原型、源码披露、完整开发包、实现纠偏、专题收尾、全局 Handoff、Local Chat 细粒度提取和批量注入、结构化事项计数、五轮闲置归档、再次提及唤醒或窗口同步时使用。保持完整基线、跳跃链接、残差融合及用户 bias；S4 专题全量、S8 项目全量。Agent 提取有来源的事件，脚本去重计数并生成活动/归档视图，历史完整保留。
---

# AstroPhoto 开发 SOP · v2.2

生效依据：2026-11-18 用户要求 S4/S8 全量、跳跃连接、残差融合、持续用户 bias、五轮归档和 Local Chat 汇合；随后要求事项结构化、脚本计数、再次提及移回活动区，以及更细致的 Chat 提取。v2.2 保留全部仍有效规则与 S0–S9 编号，将归档条件明确为连续五次有效 S8 中既未实质改变、也未在新输入中有效提及；历史重复携带不算提及。`SKILL.md` 为唯一流程入口。

目录：[动作与路线](#routing) · [阶段导航](#phases) · [持续规则](#rules) · [调用上下文](#context) · [公共规范](#references) · [常见调用](#usage)

<a id="routing"></a>
## 先确定本次动作

1. 识别上下文注入、路线推荐、具体阶段执行、仅 Prompt、窗口同步或完整交付。按语义理解，不把“S3 对象存储”等业务词当阶段号；不把 S10 拆成 S1/S0。
2. 恢复当前对话已给出的目标、明确决定、相关附件和实际回执。Local 再定位仓库、工作树与适用指令；Web Chat 使用可读附件，不能把 Windows 路径当成已经获得的源码。
3. 只要求注入时，确认范围、来源、版本关系和未知项后结束。只要解释或 Prompt 时按指定形式返回。用户要求实现、修正或交付时，推进范围内已授权工作，不重复索取同一决定。
4. 未指定阶段时按下表选最短有效路径，保留依赖并沿用已完成工作。S4/S8 一旦调用，其完整交付范围不得缩为差异附件。
5. 加载本入口与 [核心原则](references/Principles.md)，再读取对应阶段及其指定材料。按需阅读降低单次加载量，完整资料与最终交付范围不因此缩小。

| 任务情况 | 路线 |
|---|---|
| 明确局部修复、既有契约不变 | Local 核对后 S5；已交付功能的明确反馈可直接 S6 |
| 只解释实现或需要本地事实 | S3；上下文注入不等于 S0 审计完成 |
| 新功能、新交互、共享 Node/API/Schema 或多专题 | 按缺口 S0 → S1 → S2 → S3 → S4 → S5 → S6 |
| 正式完整开发包 | S4；缺少事实时定向补 S3 |
| 本专题收尾 | S7，完整回收专题有效范围 |
| 整轮/全局交接 | S8，先完成 Local Chat 来源批量注入，再融合和归档；完整覆盖全项目 |
| 结构化计数与五轮剪枝 | 先按 ChatExtraction 提取事项/事件，再按 StructuredContext 预览并执行脚本；归档和恢复均保留完整历史 |
| 接手完整包 | S9，根据任务重核当前事实后继续 |

<a id="phases"></a>
## 阶段导航与角色

| 阶段 | 默认负责人 | 文件 | 交付重点 |
|---|---|---|---|
| S0 基线核验 | Local Main | [Phase0](Phases/Phase0.md) | 工作树、实例、历史来源与缺口 |
| S1 专题分工 | Web Chat / Main | [Phase1](Phases/Phase1.md) | 范围、负责人、消费者、共享契约 |
| S2 需求与原型 | Web Chat + 用户 | [Phase2](Phases/Phase2.md) | PRD、AC、适用的离线交互原型 |
| S3 定向源码披露 | Local | [Phase3](Phases/Phase3.md) | 正式入口、符号、Guard、断言与证据 |
| S4 全量开发包 | Web Chat / Main | [Phase4](Phases/Phase4.md) | 本专题完整可实施包及同名 ZIP |
| S5 实现与验证 | Local Main | [Phase5](Phases/Phase5.md) | 已接受 AC 的代码落地与实际回执 |
| S6 持续纠偏 | 用户 + Local / Web Chat | [Phase6](Phases/Phase6.md) | bias 传播、最小修正、有效规则更新 |
| S7 专题完整收尾 | 各 Web Chat | [Phase7](Phases/Phase7.md) | 专题完整事实、未交付项与共享影响 |
| S8 全量全局交接 | Local Main | [Phase8](Phases/Phase8.md) | 来源批量注入、全项目盘点、归档与完整新快照 |
| S9 下一轮接手 | 新 Web Chat / Local | [Phase9](Phases/Phase9.md) | 按链接恢复基线并开始任务 |

用户决定用户可见行为、范围与数据处置。Web Chat 负责设计、研究、原型及工程规范。Local Main 负责源码事实、共享契约、最终集成和验证结论。子 Agent 承担明确限定的调查或受控实现；共享工作树默认一名 Main 统筹写入，重要结论由 Main 复核。

<a id="rules"></a>
## 持续执行的规则

- **完整基线直传。** S4 本专题全量，S8 全项目全量；未变化内容也进入新包。不得用“同上版”、旧包链接或变化清单替代应有正文。
- **残差融合。** 保留旧条目的稳定 ID、来源与去向，把新增、修订、纠错、替代关系融合进完整正文。
- **持续 bias。** 用户明确纠偏即时进入有效决定、PRD/AC、原型、契约、实施和测试。仅对仍未决定的实质取舍提问。
- **事实分层。** 用户决定说明要什么；工作树说明实现什么；实例说明运行什么；断言和回执说明验证什么。历史、拟建与当前实测分别标注。
- **最小代码改动。** 官方/项目复用 → 最小修改 → 局部适配 → 必要新增。完整文档交付不要求重写所有代码，也不授权扩大业务范围。
- **可跳转证据链。** 需求、用户决定、契约、Feature、Guard、测试和风险使用稳定 ID、来源和包内锚点，允许越级访问并双向追溯关键关系。
- **保全信息。** 保留条件、反例、错误/skip/清理、长期需求、未完成项与证据边界。合并等价重复保留来源映射，不能因篇幅或文件数删有效语义。
- **先汇合再交接。** S8 登记预期 Local Chat、接收实际来源、逐份读取并映射去向，复核收集后新增内容，再生成最终结论。`15_LOCAL_CHAT_INTAKE.md` 留回执，原始材料随包；缺预期来源时标 INCOMPLETE。
- **结构化剪枝。** 事项和事件分开编号。最后有效提及/实质变化的 H0 后，每个完成并复核的全量 S8 未使用时 `idle_handoffs + 1`；达到 5 且未固定保留才归档。新输入有效提及即沿原 ID 恢复 ACTIVE、计数归零，当前全文从归档视图移回活动视图；历史事件、旧正文和旧快照继续保留。生效规则、当前必办与必要阻塞信息固定保留。只有收集及完整性门通过才正式增加轮次。
- **防止历史自唤醒。** 生成 Handoff、复制旧聊天、扫描索引或重读归档不算新提及。精确 ID/别名匹配仅给候选，Main 核对新输入范围和原文语义后生成事件；缺覆盖、歧义未解不能写成“未使用”。
- **全量保存，按需加载。** 日常 Chat 先读有效约束、`CONTEXT_INDEX.md`、`ACTIVE_CONTEXT.md` 和当前任务必需原文；相关归档按 ID 取回。正式 S4/S8 仍携带其完整范围、原始来源和历史，不把工作上下文变短误写成删包。
- **保护既有状态。** 保留未提交修改、真实资产、宿主环境和旧交接。提交、发布与破坏性处置按实际授权；测试数据可替换/无需迁移只在明确范围生效。

<a id="context"></a>
## 每次阶段调用的最小上下文

从上下文恢复已知值，不要求用户重复填写。

| 字段 | 内容 |
|---|---|
| 阶段、专题与结果 | 交付什么；Local 或 Web Chat |
| 有效 bias | 最新明确决定与仍有效旧约束；来源和范围 |
| 输入 | 可读完整包、相关正文、披露或执行回执 |
| 来源与归档 | S8 的预期 Local Chat 清单、覆盖范围/读取回执；相关归档 ID、复核账与新变化 |
| 版本与范围 | 包版本；Local 的仓库/工作树/HEAD/脏树；目标实例 |
| 操作边界 | 已授权修改、测试、宿主、数据与外发操作 |
| 缺口 | 哪个未知影响哪个 AC；可继续工作与真正依赖的材料 |

Local 能执行所点阶段时给实际产物。Web Chat 无法观察本地事实时提供短定向 Prompt，并说明要带回的具体证据。跨 Chat Prompt 填入已知目标和决定，独立可读；不能依赖接收方记得本 Chat，不能假装已访问未提供的窗口或已完成交接。

给用户转发的主 Prompt 默认约 200–500 个中文字；复杂 S4/S8 可扩到约 600–900 字。优先引用接收方可访问的本技能阶段文件和完整包，把详细步骤留在正文。保留目标、关键 AC、有效纠偏、操作范围和交付要求，不因限长删掉约束。用户只要 Prompt 时只给一个可复制代码块，不把整份阶段手册复制进去。独立子任务的完整输入按 Subagents 处理，用户明确要求长版时按其要求。

<a id="references"></a>
## 公共规范

| 文件 | 读取时机 |
|---|---|
| [Principles](references/Principles.md) | 所有阶段；全量、跳跃/残差连接、bias 和事实优先级 |
| [Records](references/Records.md) | 需求、决定、契约、Feature/Guard/Test、来源与条目去向 |
| [Packages](references/Packages.md) | S4/S7/S8；目录、完整性、合订本、ZIP、清单与校验 |
| [Project](references/Project.md) | Local 开始前、官方复用与验证；背景全部带快照身份 |
| [Subagents](references/Subagents.md) | 多窗口、研究、分域审计、集成与独立子任务 Prompt |
| [LocalChatIntake](references/LocalChatIntake.md) | S8 生成前的来源登记、批量读取、融合、截止检查与缺口 |
| [Archiving](references/Archiving.md) | 五轮闲置复核、新提及归零、归档全文、恢复与固定保留边界 |
| [ChatExtraction](references/ChatExtraction.md) | 从完整 Chat 来源提取稳定事项、事件、新旧边界、去向与覆盖证明 |
| [StructuredContext](references/StructuredContext.md) | JSON 输入契约、脚本命令、预览/提交、状态与 Markdown 视图、迁移和恢复 |
| [CHAT_EXTRACTION 模板](templates/CHAT_EXTRACTION.md) | 逐来源提取与语义对账；空模板不代表已取得任何聊天 |
| [15_LOCAL_CHAT_INTAKE 模板](templates/15_LOCAL_CHAT_INTAKE.md) | 新 Handoff 的来源注入登记；复制后按真实收集结果填写 |
| [16_ARCHIVED_ITEMS 模板](templates/16_ARCHIVED_ITEMS.md) | 新 Handoff 的完整档案；沿用旧档案并追加本轮事件 |
| [Sources](references/Sources.md) | 本版来源、旧条款去向、官方资料及版本适用范围 |

包内链接及可选 SHA256 检查使用 [verify_bundle.py](scripts/verify_bundle.py)，命令见 Packages。脚本不证明语义无损、源码正确或业务测试通过，仍须逐项核对有效条目。

事项计数、去重、归档与恢复使用 [context_manager.py](scripts/context_manager.py)。`advance`/`touch` 默认仅预览；明确 `--apply` 才保存状态。脚本按已核对的结构化事件执行，不自行访问其他 Chat、不替用户判定产品行为。[输入 Schema](schemas/context_input.schema.json) 辅助编辑与结构校验；验证确定性规则可运行 [测试文件](tests/test_context_manager.py)。

<a id="usage"></a>
## 常见调用

```text
使用 $astrophoto-sop，只注入这些附件，确认基线和缺口。
```

```text
使用 $astrophoto-sop，为“设备导出”选择路线并给出各阶段可复制 Prompt。
```

```text
使用 $astrophoto-sop，执行 S4。依据已确认 PRD 和源码披露，输出本专题全量开发包。
```

```text
使用 $astrophoto-sop，执行 S8。先登记并批量读取各 Local Chat 的完整相关来源，融合我的全部有效纠偏，再核对全项目及全部专题。将符合五轮闲置条件且未固定的条目完整归档；有效新提及归零并恢复。输出含注入登记、完整状态、活动/归档全文和原始来源的新全量交接包。
```

```text
使用 $astrophoto-sop，只同步我指定的窗口，在当前回复列出决定、代码落点、集成状态和测试证据。
```

```text
使用 $astrophoto-sop，把已提供的 Chat 按事项和事件提取。区分新提及、实际测试/错误、历史携带与重复导出，保留原文定位和完整条件；先预览计数和归档，再在本轮完整性门通过后保存。新输入提及已归档事项时立即恢复活动全文，旧历史保留。
```

阶段中收到新反馈时，先定位影响，再沿受影响路径更新并继续任务。未取消范围继续保留。阶段结束说明实际完成、证据、缺口与下一步；S4/S8 明确完整性状态及条目去向检查结果。
