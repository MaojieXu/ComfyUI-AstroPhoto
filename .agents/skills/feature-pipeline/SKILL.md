---
name: feature-pipeline
description: >-
  管理 .agents/features/ 下单个 AstroPhoto Feature 的完整生命周期与交付物。
  当用户要求创建、规划、推进、评审、修订、同步、验收、关闭、归档或重开 Feature 时使用。
  涵盖 PRD、UXUI、TECH、DEV、TEST_PLAN、独立 Code Review Gate、TEST_REPORT 和 CLOSE。
  负责阶段路由、状态管理、变更影响追踪、交付物一致性及可复用知识沉淀。
  Main Agent 负责规划、门禁和最终交付，可委派开发和测试；独立代码审查由用户在新窗口发起。
  不用于与 Feature 生命周期无关的单次代码修改、测试命令或通用文档编辑。
---

# Feature Pipeline

## 1. 定位与边界

Main Agent 负责单个 Feature 的阶段路由、用户沟通、交付核对和状态管理。

- 单个 Feature 在 `.agents/features/{feature-name}/` 维护。按本流程关闭后默认归档到 `.agents/features/archive/{feature-name}/`。此前整理的专题从[历史 Feature 索引](../../archive/INDEX.md)查找，同期工程记录保存在该索引所在的 `.agents/archive/`。
- 以用户当次请求为操作边界：只执行所请求的阶段或维护任务，不擅自推进整个流水线。
- 产品规则由 PRD 决定；交互与视觉由 UXUI 决定；实现方案由 TECH 决定；实际代码以仓库为准；测试结论以真实执行证据为准。
- Main Agent 按第 3 节承担规划和协调，按需委派开发和测试，核对实际文件、差异和证据，维护 `00_FEATURE_INDEX.md` 并向用户最终交付。
- 不指定主开发 Agent、独立审查 Agent 的框架或模型；是否能调用 Agent 和执行工具，以当前环境实际能力为准。

## 2. 入口流程：每次触发都执行

1. **定位 Feature**：确定名称、目录及用户要执行的动作。优先使用用户明确指定的 Feature；不要凭空创建同名目录。重开时按上述归档路径或历史 Feature 索引查找已有记录。
2. **读取状态**：如存在，先读该 Feature 的 `00_FEATURE_INDEX.md`；然后读取与本次操作有关的当前有效文档和必要代码。缺少索引时检查实际文件，再按需要初始化；不得据空白索引宣称已有进度。
3. **识别操作**：区分新建、继续、评审文档、修订、阶段推进、跨文档同步、独立代码审查、验收、关闭、归档、重开。明确本次交付范围。
4. **按需加载**：根据第 3 节的路由表，读取对应 `references/` 文件；仅加载必要的上下游资料。不要每次无差别读完所有阶段指导稿。
5. **检查前置条件**：发现阻断问题、未批准的关键决策、过期的依据或缺少的 Reference，应说明具体限制，不得伪装阶段已通过。
6. **阶段执行与交接**：执行当前获准的阶段；委派时向 Subagent 交付对应 role prompt 和任务。核对交付物、关联需求与证据，再同步索引。
7. **汇报结果**：列出实际创建/修改的文件、已确认决策、验证证据、阻断项、尚待确认的问题，以及建议的下一步。不得将“建议执行”写成“已执行”。

## 3. 阶段路由（仅在需要时读取）

| 阶段或门禁 | 作为任务级 role prompt 的指导稿 | 主要交付物 |
| --- | --- | --- |
| PRD：需求讨论、定稿与修订 | [01-prd.md](references/01-prd.md) | `01_PRD.md` |
| UXUI：交互、视觉与原型 | [02-uxui.md](references/02-uxui.md) | `02_UXUI.md`、`assets/prototypes/` |
| TECH：技术研究与实施设计 | [03-tech.md](references/03-tech.md) | `03_TECH.md` |
| DEV：实现、调试、增量记录 | [04-dev.md](references/04-dev.md) | 工作代码、`04_DEV_LOG.md` |
| TEST_PLAN：测试设计与持续维护 | [05-test-plan.md](references/05-test-plan.md) | `05_TEST_PLAN.md` |
| Independent Review Gate：用户新窗口只读审查 | [review-gate.md](references/review-gate.md) | 可直接粘贴的审查指令、用户带回的审查结果 |
| TEST_REPORT：实际执行、缺陷与复测 | [06-test-report.md](references/06-test-report.md) | `06_TEST_REPORT.md`、`assets/test-runs/` |
| CLOSE：验收、沉淀、归档 | [07-close.md](references/07-close.md) | `07_CLOSE.md`、长期知识更新、归档 |

执行阶段前完整读取对应指导稿并按照其角色职责工作。派发时，将指导稿完整正文作为 Subagent 的任务级角色指令，或明确指令其先完整读取指定文件并据此工作；同时给出当前 Feature、已批准的输入、可修改范围、预期交付物与停止条件。检查文件存在且标题匹配，角色名称或摘要不足以替代正文。

- Main Agent 直接构建 PRD、UXUI、TECH 和 CLOSE，与用户讨论并负责最终交付。
- Main Agent 负责构建和维护 TEST_PLAN；可委派 TEST_PLAN Subagent 协助设计或起草，Main Agent 整合并把关最终计划。
- DEV 和 TEST_REPORT 可按任务需要委派对应角色的 Subagent；无法或不适合委派时，Main Agent 可以承担获准的阶段工作。DEV 与 TEST_PLAN 同时获准时可并行，但由各自负责人维护 DEV_LOG 和 TEST_PLAN。
- 独立 Code Review Gate 仍由用户在新窗口发起，不委派 review Subagent。

DEV 存在可分离的实现任务时，Main Agent 可按 [DEV 多 Agent 开发规则](references/04-dev.md) 同时派发多个 DEV Subagent，分别注入 DEV 指导稿并协调分工、接口和集成。任务强耦合或并发资源不足时，按依赖顺序派发。

用户只要求评审或修改某个阶段文档时，只路由该文档及必要依赖；“文档评审”不等于 Independent Code Review Gate。

## 4. Feature 工作区与状态契约

每个 Feature 的工作目录通常包含：

```text
.agents/features/{feature-name}/
├── 00_FEATURE_INDEX.md
├── 01_PRD.md
├── 02_UXUI.md                  # 无 UI 时可 N/A
├── 03_TECH.md
├── 04_DEV_LOG.md
├── 05_TEST_PLAN.md
├── 06_TEST_REPORT.md
├── 07_CLOSE.md
└── assets/
    ├── prototypes/           # 仅有 UI 时
    ├── reviews/              # REVIEW-xxx 的真实审查证据
    └── test-runs/            # RUN-xxx 的真实执行证据
```

- **`00_FEATURE_INDEX.md` 是单一状态入口**：至少记录 Feature 标识、主阶段、各阶段状态、关键文档的有效版本或状态、阻断与待决策事项、Review Gate 状态、下一步操作；涉及实际代码或测试时记录可识别的代码版本。
- 新建 Feature 时按需要创建当前阶段交付物；不要预先写出七份看似完整的空文档。
- `current_phase` 只表示当前主阶段；TEST_PLAN 可以与 DEV 并行维护，分别记录各自状态。
- 建议状态语义：`not_started`、`in_progress`、`blocked`、`approved`、`n_a`；关闭与归档另用 `closed` / `archived`。保留现有 Feature 已采用的有效状态命名，不为改名批量迁移。
- 只有具备实际证据和相应确认，才能标记 `approved`、`passed` 或 `closed`。文件存在、Agent 声称完成、测试计划完成，均不能单独证明验收成功。
- 保留稳定的 FR、AC、TC、DEV、RUN、Finding 等编号及重要决策关联；避免因重新整理而无故重编号。

## 5. 生命周期与阶段门禁

**主线**：`PRD → UXUI（适用时）→ TECH → DEV → Independent Review Gate → TEST_REPORT → CLOSE`。

**并行线**：在 TECH 建立可用基线后可启动 TEST_PLAN；DEV、审查发现和缺陷修复可以持续推动其更新。同步计划只授权设计和准备。

**测试执行边界**：DEV 针对当前代码增量选择能回答具体实现问题的最小自检，问题得到回答即停止。TEST_PLAN 设计 TC、夹具、环境和取证方法。正式回归、按计划逐项执行 AC/TC、最终构件的端到端及真实宿主验收，统一由 TEST_REPORT 阶段在独立审查门禁通过后按 RUN 执行并取证，可委派对应 Subagent。提前取得的开发证据保留其原始阶段归属。

- **PRD → UXUI / TECH**：关键产品行为、业务规则和验收条件清晰，阻断性产品抉择已解决；按阶段规范取得必要确认。
- **UXUI → TECH**：需要 UI 的 Feature 已确认必要原型与交互规范；无 UI 可标记 `n_a` 并说明理由。
- **TECH → DEV**：关键架构与接口确定，已有实现及官方 API 已核实，文件/函数变更方案可执行，阻断性技术决策已处理。
- **DEV → Review Gate**：计划内实现完成并完成必要局部检查；DEV_LOG 更新；TEST_PLAN 与当前实现同步；审查代码状态可识别。
- **Review Gate 交接与暂停**：Main Agent 按审查指导稿生成已填妥、可直接粘贴到新窗口的指令，交给用户后结束本轮。保持 DEV 为 `ready_for_review` 或等效状态，门禁待完成。不调用 Review Subagent，不代开窗口或自行审查。仅在用户带回审查结果后恢复门禁处理。
- **Review Gate → TEST_REPORT**：默认每个 Feature 执行一次独立、只读、与模型无关的正式审查；DEV 负责核实并修复有效 Findings，完成必要的局部自检。Main Agent 核对审查记录、阻断项处理及交付代码版本，门禁通过且正式测试获准后才执行或委派 TEST_REPORT。默认不重复整轮独立审查。
- **TEST_REPORT → CLOSE**：正式测试结果与交付代码版本对应；关键验收条件满足，阻断缺陷已解决或按规则明确处理，剩余风险透明。
- **CLOSE → Archived**：完成验收和关闭草案后，向用户展示具体可复用内容及拟合并位置，等待用户逐项选择；仅合并选中项，再完成必要核对和归档。无候选时说明并等待用户确认无须提取。未获选择时保持待关闭，不得归档。

阶段不必机械串行：用户可要求补充早期文档、重开某阶段或直接检查当前状态；但不能绕过明确的阻断项并宣称阶段已批准。明确不适用的阶段可以 `n_a`，需记录原因。

## 6. 跨阶段变更控制

任何已确认需求、原型、技术接口或代码行为变化后：

1. 确认**变更源头和决策权**：产品行为回到 PRD；交互变化回到 UXUI；核心架构变化回到 TECH；局部代码实现变化在 DEV 处理。
2. 通过稳定编号及代码位置列出**受影响范围**，只对实际受影响的下游交付物重新检查，不无故将整个 Feature 重置。
3. 同步受影响文件；无法即时同步时，在 Feature Index 标记 `needs_review` 或明确的待处理事项，不声称已同步。
4. DEV 新增失败模式、接口或回归风险时，检查 TEST_PLAN 是否需要增加或调整 TC；TEST_PLAN 的预期结果不能为迎合代码而任意降低。
5. TEST_REPORT 中的历史 RUN、失败记录及证据不可覆盖；重新测试必须关联新的代码状态与测试计划版本。
6. 独立审查之后若发生重大代码修改，应标注原 Review 的覆盖失效范围；若坚持只审查一次，不得宣称改动后的全部代码仍受独立审查覆盖。
7. 已确认决策发生改变时，更新正文当前生效规则并保存必要的决策历史；不得同时留下互相矛盾的生效要求。

## 7. 资料真实性与执行边界

- 已确认的 PRD 与 UXUI 是目标契约；TECH 是批准的实施设计；实际仓库代码说明当前实现事实；DEV_LOG 是实现历史；TEST_PLAN 是验证方案；TEST_REPORT 是真实执行证据。它们发生冲突时应标出冲突并走相应变更流程，不能简单认定某一份文档自动覆盖其他职责。
- 引用现有文件路径、函数、官方 API 或测试命令前须核实；拟新增对象标记 `Proposed`，未验证对象标记 `Unverified`。
- 未实际启动的 Agent、未运行的测试、未完成的原型确认和未写入的知识资产，不能宣称已完成。
- 不因本 Skill 被触发就擅自进行代码开发、正式测试、归档移动或修改全局规范；执行范围以用户请求及项目既有授权为准。
- 重大产品决定与验收例外应由用户确认；不要将 Agent 推荐、推测或待决问题自动升级为已批准决定。

## 8. CLOSE 与重开

- CLOSE 根据实际证据在 `07_CLOSE.md` 整理可复用候选，逐项说明内容、证据、拟合并目标和建议，并准备可审阅的具体修改。先交用户选择，记录选中和拒绝项；仅将选中项合并至相应 `.agents/skills/`、`.agents/notes/`、`docs/` 或代码和测试工具，验证并记录结果。已在 DEV 完成的必要权威文档同步不因本门禁回撤；未经选择不提前合并 CLOSE 提炼候选。全部拒绝或没有候选，经用户确认后仍可归档。
- 默认归档路径：`.agents/features/archive/{feature-name}/`。移动前检查目标是否存在和是否有其他任务正在引用；不覆盖已有归档、不丢失测试证据。
- 重开时先读取归档索引与关闭结论，建立新的变更目标和影响范围，保留旧版本的事实与证据；不能直接把历史测试通过结果当作新版本的证明。

## 9. 每次响应的交付要求

根据用户请求提供阶段文档、评审意见或实际操作结果，并简明说明：

- **Done**：实际创建、修改、审查或归档了哪些文件/对象。
- **Decisions**：本次确认或仍待确认的重要决策。
- **Sync**：哪些下游文档受到影响，已同步哪些，哪些仍需处理。
- **Evidence**：实际运行的检查、审查或测试及其证据；未执行明确标记。
- **Next**：下一项可执行操作与其前置条件。

用户要求完整文档时，返回当前完整有效版本，不要只给零散修订；文档草案的待决问题按所属阶段指导稿放在最末尾。若本次仅是检查或建议，不得将未进行的磁盘写入描述为已完成。
