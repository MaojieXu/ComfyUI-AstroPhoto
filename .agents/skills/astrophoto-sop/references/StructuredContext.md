# 结构化上下文：事项、事件、计数与可再生成的视图

[返回入口](../SKILL.md) · [Chat提取](ChatExtraction.md) · [归档规则](Archiving.md) · [批量注入](LocalChatIntake.md) · [脚本](../scripts/context_manager.py) · [输入 Schema](../schemas/context_input.schema.json) · [测试](../tests/test_context_manager.py)

目录：[职责](#roles) · [计数](#counting) · [存储](#storage) · [记录](#record) · [事件](#events) · [周期输入](#cycle) · [命令](#commands) · [完整交付](#handoff) · [迁移与故障](#recovery) · [设计依据](#sources)

<a id="roles"></a>
## 1. Agent 提取语义，脚本执行确定性规则

使用 `scripts/context_manager.py` 管理已取得资料中的 DECISION、TEST、ERROR、RISK、QUESTION、CONSTRAINT、ATTEMPT。它只读写明确指定的上下文工作目录；不读取未提供的 Chat，不监听窗口，不执行测试或删除业务源码。

Main 负责实际读取、稳定 ID、原文定位、完整条件、用户决定与证据身份、新旧范围、提及含义、固定保留和覆盖结论。脚本负责字段校验、去重、父子轮次、计数、ACTIVE/ARCHIVED 转换、完整历史与视图生成。自然语言没有对应 ID 时先由 Main 根据原文映射；不能让关键词命中直接决定归档状态。

计数和 Markdown 不分别维护。记录先进入规范化状态，活动、归档和索引都从同一版状态生成。不要手工编辑生成视图后期待下次运行保留这些改动；将修订作为有来源的完整 upsert 和事件输入。

<a id="counting"></a>
## 2. 一个权威计数及派生显示

`idle_handoffs` 表示最近有效提及或实质改变之后，连续完成且逐项复核的未使用 S8 轮次。归档阈值固定为 5。剩余轮次可显示为 `max(0, 5 - idle_handoffs)`，无需另建会漂移的加减分系统。

| 事件/条件 | 计数与状态 |
|---|---|
| 新建完整记录，或完成新提及/改变的基线 H0 | 0，ACTIVE |
| 下一独立完整 S8，复核为未变且无有效新提及 | 加 1；达到 5 且未固定时 ARCHIVED |
| 新输入有效提及、实际 TEST_RUN、ERROR_RECURRED、USER_DIRECTIVE 或 CHANGE | 归零，ACTIVE；原归档全文回活动视图 |
| 日常 `touch` 命中 | 立即归零/恢复，不增加 Handoff 轮次；下一完整 S8 建立新 H0=0 |
| 历史复制、旧日志重传、生成视图、ROUTINE_CHECK | 不唤醒；本轮仍须按真实复核情况判断是否计次 |
| 归档条目没有新触发 | 保持归档，不继续无意义累加 |
| `pinned=true` | 保持活动；记录固定原因，不据计数取消有效约束 |
| 缺来源、UNKNOWN、缺活动项观察或完成门未过 | 不提交本轮，不增加任何正式轮次 |
| 同一 Handoff 或事件原样重放 | 幂等，不多加一次；同 ID 不同内容报冲突 |

该规则管理当前关注，不修改 `business_state`。历史 FAIL 保持其事实身份，AC 和权限仍生效，测试代码继续存在。`related_ids` 是导航关系，不自动把相关的全部事项一起唤醒；确有影响时逐项提取事件与依据。

<a id="storage"></a>
## 3. 完整状态与当前视图

工作目录建议为 `.artifact/ContextState/`，与旧 Handoff 目录分开。`CURRENT` 指向 `snapshots/` 中的一代完整快照。每代包含：

| 文件 | 内容 |
|---|---|
| `state.json` | 当前事项全文、业务状态、脚本状态、完整记录版本、事件及已处理轮次 |
| `ACTIVE_CONTEXT.md` | 当前活动事项全文，包括固定保留项 |
| `16_ARCHIVED_ITEMS.md` | 当前归档事项全文；已恢复事项留稳定入口并跳至活动全文 |
| `CONTEXT_INDEX.md` | 所有事项的轻量索引、状态、计数及当前位置 |
| `MANIFEST.sha256` | 本代实际文件的字节校验，排除清单自身 |

保存时先构建完整新代，再切换 CURRENT；旧代不改写。独占写入锁防止多个 Main 同时写同一存储。`expected_revision` 可阻止旧计划覆盖新的 touch；实际协作中每次从 CURRENT 取得当前 revision 后填写它。

原始 Markdown 正文在生成视图中以保留原文本的围栏承载，避免把历史内部链接误当本版导航。有效导航由脚本生成；原文与附件仍须按来源协议实际同包携带。state 的完整历史不能只放工作目录、在交接时遗漏。

普通 Chat 先读取有效约束、索引、活动正文与任务必需来源，再按 ID 取回相关归档。存储里完整存在的资料不必每轮全部灌入模型。最终 S8 的全量范围与 Main 的来源核对义务仍然保留。

<a id="record"></a>
## 4. 事项记录契约

所有 upsert 均给出完整记录，不接收用于改计数的片段补丁。必填字段如下：

| 字段 | 类型与用途 |
|---|---|
| `id` | 稳定字符串 ID；复用真实历史编号 |
| `type` | DECISION / TEST / ERROR / RISK / QUESTION / CONSTRAINT / ATTEMPT |
| `title` | 简短且可辨认的标题 |
| `body_md` | 完整当前语义，含条件、反例、结果、理由与未知；不是仅一行摘要 |
| `business_state` | 对象；分别记录决定、实现、执行、环境或阻塞等适用字段 |
| `aliases` | 字符串数组，用于候选查找；重名不自动猜测归属 |
| `source_refs` | 非空来源引用数组；能够回查真实原文/证据 |
| `related_ids` | 相关记录 ID 数组；目标应已存在或在本次 upsert 中 |
| `pinned` | 布尔值；仍有效约束、当前必办或必要阻塞信息据事实固定 |
| `pin_reason` | 字符串；固定时必须给明确原因 |

`CONSTRAINT` 必须固定。若一个被接受决定包含长期有效规则和可退出活动区的讨论，拆成关联的规则与讨论记录，保持原 ID 映射。不要让“归档理由”代替当前有效规范。

`attention_state`、`idle_handoffs`、基线、历史和处理轮次由脚本维护，不能通过 upsert 直接注入。新增/修订记录必须有本批有效来源事件支持；完整旧版本保留，不因 upsert 丢失旧正文。

配套 JSON Schema 使用 Draft 2020-12，可供编辑器和上游校验器检查输入形状。脚本自身仅依赖标准库并执行严格校验；跨记录引用、轮次顺序、事件重复与真实来源覆盖不能仅靠 Schema 证明。所有 ID 使用英数字起始及英数字、下划线、点、冒号、连字符，最长 128 字符；中文含义写入标题、正文和来源摘录。

<a id="events"></a>
## 5. 提及与发生事件

每个事件必填 `event_id`、`item_id`、`kind`、`origin`、`source_id`、`source_revision`、`locator`、`excerpt`。事件 ID 表示一次发生，事项 ID 表示被讨论的对象。

有效唤醒类型为 `MENTION / CHANGE / TEST_RUN / ERROR_RECURRED / USER_DIRECTIVE`，并且 `origin=NEW_INPUT`。历史或无关类型为 `CARRY_FORWARD / ROUTINE_CHECK / HISTORICAL_QUOTE / NOT_RELEVANT`；`origin=CARRY_FORWARD` 不产生唤醒。

同一条原消息重新导出时，复用原事件 ID 和原 payload；导出文件的新版本记在来源登记中，不把原事件的发生身份改成新消息。脚本另按来源、定位、事项与发生内容去重，单纯换导出版本不构成新提及。同一 event_id 的内容改变会报冲突；真正修正须追加有来源的新事件，不篡改旧历史。

### 假设示例：再次提及已归档错误

以下仅演示输入形状，不是本项目真实消息。只有 `DEMO-E-01` 已存在且 Main 确认这是真实新输入时，才能把对应的实际事件提交：

```json
{
  "schema_version": 1,
  "expected_revision": 6,
  "upserts": [],
  "events": [{
    "event_id": "DEMO-EVT-NEW-01",
    "item_id": "DEMO-E-01",
    "kind": "MENTION",
    "origin": "NEW_INPUT",
    "source_id": "DEMO-LC-01",
    "source_revision": "r2",
    "locator": "message-42",
    "excerpt": "DEMO-E-01 现在还有什么影响？"
  }]
}
```

其中 expected_revision 仅为示例，必须替换为实际 CURRENT 的版本。不要从归档原文中复制这段示例来制造真实唤醒。

<a id="cycle"></a>
## 6. 每轮输入与完成声明

`advance` 输入包含：`schema_version: 1`、可选但推荐的 `expected_revision`、`handoff`、`upserts`、`observations`、`events`。

`handoff` 必填 `id`、`parent_id`、`source_batch_id`、`completed`、`intake_closed`、`coverage_complete` 和非空 `evidence_refs`。首个父版本为 null，之后必须对应上一正式 Handoff。同一 source_batch_id 不能靠反复包装充当多轮独立收集。

每个更新后为 ACTIVE 的条目，包括本轮新增/唤醒项，都需一条 observation：`id`、`result`、非空 `evidence_refs`、`reason`。result 为 `UNCHANGED / CHANGED / MENTIONED / UNKNOWN`。正文不变但存在有效新提及必须按事件处理；UNKNOWN 或缺行不能写成已经完整复核。

观察值描述相对于本次调用读入的 CURRENT 的变化：本次实际新增/变更 upsert 对应 CHANGED，本次新有效事件对应 MENTIONED。若事件和状态已提前通过 touch 保存，本次原样重放不再是新变化或新提及；无其他变化时填 UNCHANGED 并引用 touch 回执，脚本仍凭待建立基线状态设为 H0=0，不会加成闲置第 1 轮。

完成声明的具体语义：

- `intake_closed=true`：全部预期来源实际取得、读取、融合并核对最后更新，15 的批次已关闭。
- `coverage_complete=true`：Chat 提取没有遗漏范围或待判候选，活动条目逐项观察完整，输入→输出与反向来源已核对。
- `completed=true`：Main 已完成本轮独立全量 S8 的外部包检查；不是脚本自己判定业务测试全通过。

脚本检查字段、引用和状态转换，无法证明布尔值背后的人或 Agent 真的读完了材料。不得为了通过脚本把未完成门改成 true。已完整记录的业务待决不自动使来源缺失，仍要保持决定状态与阻塞说明。

首次建立记录时，从实际来源登记全部相关事项，以本次 H0 计 0。新建记录的来源事件记录这次登记及原始依据，不能伪造旧用户原话或把历史导入说成产品刚发生变化。

<a id="commands"></a>
## 7. 可执行命令

使用 Python 3.9+，仅标准库，无需安装第三方依赖。下列命令从解压后的 `astrophoto-sop` 目录运行；Windows 可选用实际环境的 Python，`-X utf8` 明确文本编码。所有示例路径须替换为实际已取得材料。

### 7.1 对明确的新消息范围产生候选

```text
python -X utf8 scripts/context_manager.py scan --store .artifact/ContextState --text .artifact/HandoffInput/B01/new_messages.md --source-id LC01 --source-revision r2
```

只扫描显式提供的新增片段。输出精确 ID/别名候选与定位，不直接恢复事项；Main 按 ChatExtraction 分类并形成 events。原始完整导出继续保存，新增片段仅用于避免旧材料自唤醒。没有字面命中也不能据此证明没有间接语义提及。

### 7.2 预览轮次与生成候选正文

```text
python -X utf8 scripts/context_manager.py advance --store .artifact/ContextState --input .artifact/HandoffInput/B01/context_cycle.json
python -X utf8 scripts/context_manager.py advance --store .artifact/ContextState --input .artifact/HandoffInput/B01/context_cycle.json --preview-dir .artifact/ContextPreview/H01
```

第一条默认不写文件。第二条仅向全新目录写标记为 PREVIEW 的候选视图，不改变 CURRENT 或正式计数。它允许 `completed=false`；来源、提取覆盖和观察仍须足够完整。存在缺口时先处理可完成部分并保留 INCOMPLETE，不伪造有效候选。

### 7.3 完成门通过后保存同一轮

```text
python -X utf8 scripts/context_manager.py advance --store .artifact/ContextState --input .artifact/HandoffInput/B01/context_cycle.json --apply
```

Main 先用预览核对输入/输出和包结构，完成外部检查后填写真实完成声明再提交。期间发生新 touch、迟到用户反馈或正文变化时，更新 expected_revision、重新预览和核对。只有本轮完成条件成立才能正式增加闲置轮次；同一已完成包的重导出沿用同一身份。

### 7.4 新提及时即时恢复

```text
python -X utf8 scripts/context_manager.py touch --store .artifact/ContextState --input .artifact/HandoffInput/B01/context_touch.json
python -X utf8 scripts/context_manager.py touch --store .artifact/ContextState --input .artifact/HandoffInput/B01/context_touch.json --apply
```

touch 输入为 `schema_version`、可选 expected_revision、完整 upserts 数组与 events 数组，不含 Handoff 递增声明。先核对来源；它可以在整轮 S8 尚未关闭时响应明确新提及，正式计次继续等待下一完整 S8。

若新事件同时改变正文、业务状态或 pinned，先读 CURRENT 的完整记录，将全部有效内容合入 upsert，并与该事件在同一次 touch 中提交。只有关注状态发生变化时，才使用空 upserts。已提交事件会被去重，不能先仅提交事件，再靠原样重放为新的 upsert 提供“新事件”；不要换 ID 绕过。来源或完整记录尚缺失时保留待处理输入，先完成可以可靠执行的只读核对。

### 7.5 导出当前完整上下文组件

```text
python -X utf8 scripts/context_manager.py render --store .artifact/ContextState --out .artifact/ContextExport/H01
python -B -m unittest discover -s tests -p test_context_manager.py -v
```

render 写入全新目录，导出同一 CURRENT 的完整状态与视图，不递增计数。第二条运行本脚本的合成数据测试，不能作为 AstroPhoto 业务测试或真实 Handoff 已完成的证据。

<a id="handoff"></a>
## 8. 放回 S4/S8 全量交付

上下文组件不是整个 S8。Main 仍需全项目范围、来源、Feature/Guard/Test、领域、风险、合订本、清单和完整 ZIP。

从同一个已确认快照携入 `state.json`、`ACTIVE_CONTEXT.md`、`CONTEXT_INDEX.md`、`16_ARCHIVED_ITEMS.md`，直接放在新 Handoff 根目录，保持生成的相对链接。合订本全文合入活动、索引和归档正文；state 中的所有历史仍作为同包必要文件携带。重算覆盖整个最终目录的清单，不用组件清单冒充全包清单。

原来的 19 份主 Markdown 结构继续保留，启用引擎后再加 ACTIVE/INDEX 两份，实际至少 21 份 Markdown，原始聊天另计。内容完整与可恢复优先，不改后缀或删记录凑文件数。普通 Chat 默认读取的仍是相关活动内容与轻量入口。

S4 只携带本专题相关的完整记录、必要关系与原文，但不得把悬空 related_ids 或未携带旧包链接当完整来源。旧 Handoff 不被脚本重新生成或覆盖。

<a id="recovery"></a>
## 9. 迁移、冲突与故障边界

v2.1 的未变次数不包含“新提及也归零”的新语义。首次启用本脚本时重建真实结构化基线 H0；原五轮记录作为历史保留，不直接修改生成状态以导入计数。脚本不自动解析任意旧 Markdown 的语义或重建未提供的会话。

相同轮次相同 payload 重放不会增加计数；相同 ID 不同 payload、父版本不一致、expected_revision 过时等报冲突，先核对来源和当前快照，不随意换 ID 绕过。新消息若已经通过 touch 保存，周期输入复用原事件身份，不伪造新事件。

锁占用或写入失败时保留 CURRENT 与旧快照，按实际错误检查是否有仍在工作的写入者；不盲删正在使用的锁。不完整或孤立临时目录不等于正式完成轮次。Markdown 视图丢失时从仍可读的完整 state 重新生成；state 或校验损坏时先恢复可信完整快照，不通过刷新哈希掩盖异常。

该工具管理本地上下文状态事务。整个 S8 的资料真实性、业务验证、外部打包或传送仍由 Main 的完成回执负责；发生失败须明确报告并在同一轮修复，不能靠改名再加一次计数。

<a id="sources"></a>
## 10. 设计依据与适用限制

[Anthropic 的上下文工程文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 讨论使用轻量定位和按需读取管理工作上下文。[Microsoft 的 Event Sourcing 模式](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) 说明历史事件与当前投影视图的分离，同时强调实现成本。本实现借用来源、历史和视图分离的做法，采用本地 JSON 完整快照，不引入服务、队列或外部数据库。

“连续五轮”、具体唤醒类型和固定规则是用户目标驱动的本项目策略，不是这些资料证明的普遍最优参数。脚本不保证语义识别零误差或数学上的信息无损；完整原文、逐项去向和实际读取回执仍是必要依据。官方来源访问日期及用户要求见 [Sources](Sources.md)。
