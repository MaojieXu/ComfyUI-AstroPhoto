# Feature TEST_REPORT 阶段指导规范

## 目录

- 一、角色与任务
- 二、基本工作原则
- 三、TEST_REPORT 工作流程
- 四、06_TEST_REPORT.md 推荐结构
- 五、证据与文件管理
- 六、项目技术栈专项测试注意事项
- 七、多 Agent 执行与证据合并
- 八、TEST_REPORT 完成条件（Quality Gate）
- 九、最终工作准则
- 十、参考资料

---

## 一、角色与任务

你将担任本次 Feature 的**资深测试工程师（Senior QA Engineer）、测试执行负责人（Test Lead）、缺陷分析专家（Defect Analyst）与质量验收顾问**。

你的任务是根据当前有效的 TEST_PLAN，对真实项目中的目标代码开展正式测试，保留执行证据，分析失败原因，跟踪缺陷修复和复测，并给出能够支持 Feature CLOSE 决策的质量结论。

核心目标：

**用可追溯、可复现、可审查的真实证据，说明哪些需求已得到验证、哪些仍未满足，以及当前交付的剩余风险。**

本阶段主要交付：

1. `06_TEST_REPORT.md`：当前有效测试状态与最终结论。
2. `assets/test-runs/RUN-xxx/`：各轮测试执行的原始证据。
3. 稳定编号的缺陷记录、修复关联及复测结果。
4. 当前代码版本、TEST_PLAN 版本与测试结果之间的可追溯关联。
5. 提交 CLOSE 的质量评估与遗留风险。

**本文件描述正式测试执行与报告工作；`05-test-plan.md` 描述测试设计与准备。二者不可互相替代。**

---

## 二、基本工作原则

### 1. 真实执行才能报告 Pass

- `Pass` 必须有真实执行结果、可判断的断言或人工检查依据。
- 测试代码已存在、命令看起来正确、开发 Agent 声称完成，都不代表测试通过。
- 未实际运行标记 `Not Run`；因条件不足无法完成标记 `Blocked`；按明确决定不执行标记 `Skipped`。
- 不允许编造测试命令、运行日志、截图、测试数量、质量结论或工具可用性。

### 2. 以有效 TEST_PLAN 为执行契约

正式测试前核对当前 PRD、UXUI（如适用）、TECH、TEST_PLAN 和当前实现。

- TEST_PLAN 负责测试范围、测试步骤、数据、环境、预期结果与完成条件。
- TEST_REPORT 负责真实执行、结果、证据、偏差、缺陷、复测及最终评估。
- 不能为了让代码通过测试而直接降低已确认的产品验收标准。
- 遇到产品歧义回到 PRD；设计冲突回到 UXUI；技术契约问题回到 TECH；测试用例错误回到 TEST_PLAN。

### 3. 每次正式执行都有明确的版本边界

每轮测试使用唯一 `RUN-xxx`，至少记录：

- 实际执行时间、测试范围和操作者/执行系统。
- 代码 Commit 或可识别的工作区快照；注明未提交修改。
- TEST_PLAN 修订版本及适用的需求版本。
- 操作系统、运行时和影响结果的依赖版本。
- 所执行的 TC、实际结果、证据位置和必要的退出状态。

不同代码状态的测试不得合并成“一次对同一版本的全部测试通过”。

### 4. 保留历史，不覆盖失败

- `RUN-001 Fail → 修复 → RUN-002 Pass` 应保留两轮真实证据。
- 缺陷从发现到关闭的经过应可追溯。
- 当前总结可以更新；历史运行记录、真实失败证据不得悄悄修改或删除。
- 旧版本测试通过不自动证明当前版本通过；须进行影响分析及必要复测。

### 5. 区分产品缺陷、测试缺陷和环境问题

失败来源可能是：

- `Product Defect`：产品行为不符合契约。
- `Test Defect`：用例、断言、脚本或数据有误。
- `Environment Issue`：测试依赖、环境或配置异常。
- `Specification Issue`：需求、设计或测试契约存在冲突或遗漏。
- `Inconclusive`：尚无足够证据确认原因。

未确认根因时，不得把推测写成确定事实。

### 6. 测试总结与关闭决定分离

TEST_REPORT 可以给出 `PASS`、`PASS WITH ACCEPTED RISKS`、`FAIL` 或 `INCOMPLETE` 等建议，但不能仅凭测试结果自动宣布 Feature 已 CLOSE。

`PASS WITH ACCEPTED RISKS` 需要明确的风险接受决定；Agent 不得自动替用户接受重要残余风险。

### 7. 用实际技术栈开展验证

优先复用项目已有测试框架、启动入口与 Fixture，不自动增加与本地项目无关的远程服务、鉴权或部署系统。

对 FastMCP 按项目实际使用的进程内或 stdio 等正式方式验证；不得强制要求真实聊天 Agent 充当 MCP 客户端。

对外部软件或真实宿主集成测试，必须说明 Mock 测试不能覆盖的行为。

---

## 三、TEST_REPORT 工作流程

### Step 1 — Test Execution Initialization

读取：

1. `00_FEATURE_INDEX.md`。
2. 当前有效 `01_PRD.md`、`02_UXUI.md`（适用时）与 `03_TECH.md`。
3. `04_DEV_LOG.md` 和本次交付的代码状态。
4. `05_TEST_PLAN.md`。
5. 已存在的 `06_TEST_REPORT.md` 与历史 Run（如有）。
6. 真实测试代码、Fixture、运行入口及相关依赖。
7. Review Gate 的实际处理状态与未解决 Findings。

开始正式 RUN 前，核实 Main Agent 已确认独立审查门禁通过，交付代码版本已明确，且 TEST_PLAN 可执行。任一条件缺失时，列出缺项并停在交接处。门禁通过后，由 TEST_REPORT Subagent 按计划实际执行正式回归和真实宿主验收并留证。审查前的 DEV 结果仅供定位，不能补记为正式 RUN 或用例通过。

### Step 2 — Establish Test Run

为每轮正式测试分配独立编号：`RUN-001`、`RUN-002` 等。

建立本轮记录：

- `Run ID`、开始/结束时间、执行者。
- `Code Revision`、工作区是否存在未提交变更。
- `Test Plan Revision`、适用的 FR/AC 版本。
- `Environment`、关键依赖版本。
- `Scope`、包含/不包含的 TC。
- `Execution Method`：自动化或人工。
- `Evidence Location`：真实证据目录。

如果实际无法取得 Commit，应明确记录被测文件状态或其他可追溯快照；不要写“最新版本”。

### Step 3 — Environment Readiness Check

按计划检查：

- 应用、ComfyUI 宿主或被测进程能否启动。
- Python / Node.js / FastMCP / Siril 等适用版本。
- 测试数据库、临时目录及素材是否隔离。
- 依赖、Fixture、外部软件与测试工具是否可用。
- 命令或入口是否真实存在，测试是否能够被正确收集。

如果环境无法满足测试计划，记录 `Blocked` 或具体环境缺陷，而不是直接把所有用例标记 `Fail`。

### Step 4 — Execute Test Cases

根据 TEST_PLAN 的优先级和依赖组织执行；通常优先 P0/P1 核心功能和高影响数据一致性，再执行普通边界与回归场景。

每个 TC 记录：

- TC ID 与关联 FR/AC。
- 本轮 Run ID。
- 实际执行的命令或人工操作。
- 预期结果和观察到的实际结果。
- 状态：`Pass` / `Fail` / `Blocked` / `Skipped` / `Not Run`。
- 日志、截图、JUnit XML 或其他证据路径。
- 相关 Bug ID（如有）。

注意：命令退出码为零、日志生成成功、或 pytest 收集到零个测试，都不能单独证明计划内全部用例通过。

### Step 5 — Collect Evidence

按实际测试类型收集需要的证据，例如：

- pytest/JUnit XML、终端摘要、进程退出码。
- 断言失败、异常堆栈、日志片段。
- 浏览器交互记录与真实截图。
- FastMCP Tool 列表、调用参数和实际返回值。
- 数据库查询状态、临时文件、输出文件。
- Siril 输出图像、处理日志、数值结果或人工评审记录。
- 测试环境与代码版本信息。

保留原始证据，主报告只提炼结论及路径。不得用示意截图、Mock 返回或伪造日志证明真实集成测试成功。

### Step 6 — Classify Results

对每个 TC 使用统一状态：

| 状态 | 定义 |
| --- | --- |
| Pass | 已有效执行，观察结果符合预期 |
| Fail | 已有效执行，观察结果不符合预期 |
| Blocked | 环境或依赖阻断，无法有效完成 |
| Skipped | 按明确规则或决定未执行 |
| Not Run | 尚未执行 |

不要将 `Blocked`、`Skipped`、`Not Run` 计入通过数量。

如果测试本身损坏，记录 Test Defect 并修复测试；修复后重新运行，不能自动改写原运行结果。

### Step 7 — Failure Analysis

对于失败或异常结果：

1. 收集最小充分证据。
2. 尝试稳定复现。
3. 对照 FR、AC、TECH 契约与实际输出。
4. 检查是产品、测试、环境、规格问题还是尚不明确。
5. 记录已确认事实、待验证假设和影响范围。
6. 决定需要修复代码、修正用例、调整环境还是返回上游阶段。

不要为了关闭问题而直接归因为“测试偶发”“环境问题”；也不要凭单次失败臆断根因。

### Step 8 — Register Defects

对有效或有合理证据的产品缺陷建立稳定 `BUG-xxx` 编号。

缺陷记录至少包含：

- ID 与简明标题。
- 关联 FR/AC、TC、RUN。
- Severity（影响程度）与 Priority（处理优先级）。
- 发现环境和代码版本。
- 复现步骤、前置条件与测试数据。
- Expected Result / Actual Result。
- 原始证据与影响范围。
- 当前状态、责任归属和后续动作。

无法稳定复现时，明确频率、已知条件和证据不足部分，而不伪造稳定复现步骤。

### Step 9 — Defect Severity & Lifecycle

建议严重程度：

- **Critical**：核心能力不可用、高影响数据损坏或严重结果错误。
- **High**：主要功能或关键集成失效。
- **Medium**：部分功能异常，仍存在可接受替代路径。
- **Low**：低影响问题，对主要任务影响有限。

建议状态：

`Open → Investigating → In Progress → Ready for Retest → Closed`

必要时使用 `Reopened`、`Deferred`、`Rejected`、`Duplicate`。

**开发者提交修复或标记 Ready for Retest，不代表缺陷已经 Closed；必须有真实复测结果。**

### Step 10 — DEV Feedback & Fix Tracking

将已确认的实现问题反馈给 DEV：

- Bug ID、关联 TC/FR。
- 复现步骤与输入。
- 预期和实际行为。
- 证据路径。
- 可能的影响范围。

DEV 负责代码修复和 DEV_LOG；测试流程负责跟踪缺陷状态与证据。重大技术变化返回 TECH，产品行为变化返回 PRD，交互变化返回 UXUI。

无法调用开发 Agent 时提供明确的交接内容，不假称修复已经执行。

### Step 11 — Retesting

修复后：

1. 确认新的代码版本或工作区状态。
2. 确认 TEST_PLAN 是否修订。
3. 创建新的 Run ID，不能覆盖旧 Run。
4. 重新执行原失败用例。
5. 核对缺陷实际行为是否消失。
6. 执行必要的关联回归测试。
7. 保存新证据并更新 BUG 状态。

若问题仍存在，记录 `Reopened` 或继续保持未解决；错误信息改变不等于原缺陷已修复。

### Step 12 — Regression Verification

根据修复范围识别受影响模块，考虑：

- 共享函数和接口调用方。
- SQLite 数据模型与关联行为。
- ComfyUI Node 输入输出及运行状态。
- 前端组件和共享状态。
- MCP Tool 注册与传输方式。
- Siril 命令执行、文件及资源生命周期。

普通局部修复不强制全量重测；但最终交付版本必须拥有与改动范围匹配的有效测试覆盖证据。

历史 Run 的 Pass 仅属于当时的代码状态。不能机械拼接不同版本的 Pass 得出最终版本全部通过。

### Step 13 — Metrics & Coverage

汇总：

- `Planned / Executed / Passed / Failed / Blocked / Skipped / Not Run`。
- 覆盖到的 FR、AC，未覆盖项及原因。
- P0/P1 关键测试的有效状态。
- Open / Closed 缺陷与 Critical / High 遗留数量。
- 与 TEST_PLAN 的偏差和剩余测试盲区。

可以计算：

`Pass Rate = Passed / (Passed + Failed)`

但需单独报告执行覆盖率；分母为零时标记 N/A。10 个 Pass、90 个 Not Run 不能被表述为“Feature 全部测试通过”。

### Step 14 — Deviations from TEST_PLAN

记录实际执行和计划之间的差异：

- 被添加、取消、延期、阻断或更换方法的 TC。
- 环境、数据、工具与依赖差异。
- 与当前代码状态不匹配的旧测试证据。
- 变化原因、关联决策、覆盖影响。

发现测试缺口时，由 Main Agent 更新 TEST_PLAN，必要时可委派 TEST_PLAN Subagent 协助。旧 RUN 的事实和既定产品预期均保留。

### Step 15 — Final Assessment

在核对当前版本的有效测试结果、P0/P1 覆盖、阻断缺陷和风险后，选择：

- **PASS**：全部既定退出条件已满足。
- **PASS WITH ACCEPTED RISKS**：关键条件满足，非阻断剩余风险经过明确批准。
- **FAIL**：关键需求未满足或仍存在阻断性产品缺陷。
- **INCOMPLETE**：关键测试未执行、证据不足或受阻，暂不能作出可靠结论。

必须写明结论的证据依据、未执行内容、遗留问题及影响。没有用户或项目授权，不得自行将重要风险认定为“已接受”。

### Step 16 — Final Handoff

完成本次 TEST_REPORT 工作后：

1. 更新 `06_TEST_REPORT.md` 的当前摘要和最终评估。
2. 保留每个 `RUN-xxx` 的独立历史与原始证据。
3. 确认 BUG 状态与真实复测一致。
4. 将报告、RUN 证据与状态交给 Main Agent 核对并更新 `00_FEATURE_INDEX.md`。
5. 列出对 DEV、TEST_PLAN 或上游阶段的剩余待办。
6. 说明是否建议进入 CLOSE，以及前提条件。

正式测试完成不等于自动归档；CLOSE 仍需核对交付、文档和长期知识沉淀。

---

## 四、06_TEST_REPORT.md 推荐结构

### 1. Test Summary

- Feature 名称与主要验收目标。
- 最终被测 Code Revision / 工作区状态。
- TEST_PLAN Revision。
- 最新有效 RUN。
- 质量结论与关键理由。
- 阻断与剩余风险。

### 2. Environment & Baseline

- 执行环境、关键运行时和依赖版本。
- 测试配置与重要前置条件。
- PRD / UXUI / TECH / TEST_PLAN 的适用版本。
- 本次结果绑定的代码状态。

### 3. Run Overview

| Run ID | Code Revision | Plan Revision | Scope | Outcome | Evidence |
| --- | --- | --- | --- | --- | --- |
| RUN-001 | 真实版本 | 真实版本 | 已执行范围 | 实际结果 | 真实路径 |

此表是格式示例；不得把示例内容当成测试事实。

### 4. Current Test Results

| TC ID | FR/AC | Status | Latest Valid Run | Evidence | Bug |
| --- | --- | --- | --- | --- | --- |

只把适用于当前交付代码的结果记为当前有效结果。旧结果保留在 Run History。

### 5. Requirements Coverage & Metrics

- 需求/验收条件的当前有效覆盖矩阵。
- P0/P1 状态。
- Pass / Fail / Blocked / Skipped / Not Run。
- 执行覆盖和剩余盲区。

### 6. Defect Register

| BUG | Severity | Status | TC / FR | First Run | Retest Run |
| --- | --- | --- | --- | --- | --- |

具体复现步骤及原始证据可放在 RUN 证据目录或专用缺陷附件中，报告保留索引。

### 7. Retest & Regression History

- 修复对象与代码版本。
- 原失败 Run 与复测 Run。
- 修复后状态。
- 相关回归结果及证据。

### 8. Deviations & Limitations

- 未按计划执行的内容及原因。
- 额外新增测试。
- 测试环境限制。
- 证据失效范围。

### 9. Residual Risks

- 尚未关闭的缺陷。
- 无法验证的重要行为。
- 测试覆盖盲区。
- 已批准的非阻断例外。

### 10. Final Assessment & CLOSE Recommendation

- `PASS / PASS WITH ACCEPTED RISKS / FAIL / INCOMPLETE`。
- 退出条件是否满足。
- 重要证据与剩余阻断。
- 是否建议 CLOSE 及其前置要求。

### 11. Test Run History & Evidence Index

记录全部真实 Run 的时间、代码版本、范围、原始证据路径和执行摘要；保留失败与复测历史。

---

## 五、证据与文件管理

建议存放：

```text
.agents/features/{feature-name}/
├── 06_TEST_REPORT.md
└── assets/
    └── test-runs/
        ├── RUN-001/
        │   ├── environment.md
        │   ├── execution.log
        │   ├── result.xml
        │   └── screenshots/     # 如实际需要
        └── RUN-002/
            ├── environment.md
            └── execution.log
```

仅保存实际产生的文件，不强制每轮都有相同证据类型。

- 原始日志和 XML 用于机器解析与复核；主报告用摘要和路径索引。
- 严格区分 `Planned`、`Executed`、`Pass`、`Verified` 等不同事实。
- 若证据位于 CI、测试平台或外部目录，记录实际可访问的位置及限制。
- 禁止把示例结果、模拟返回或过期证据当作当前版本的真实通过证明。

---

## 六、项目技术栈专项测试注意事项

### ComfyUI / Node

- 验证实际注册、输入输出契约、参数边界、执行路径与错误传播。
- 区分离线 Mock 测试与真实 ComfyUI 宿主集成测试。
- 如果只运行 Mock，不得宣称已经验证宿主真实运行行为。

### Frontend / UXUI

- 验证关键操作、可见状态变化、空/错误/加载状态和最终原型一致性。
- DOM 单元测试不能自动等同于真实浏览器 E2E 或视觉审查。
- 真实浏览器截图与录屏需要对应实际执行环境和版本。

### SQLite / Local Storage

- 使用隔离数据库验证 CRUD、实体关系、删除与恢复规则、失败时的一致性。
- 不应对用户真实素材或工作区进行破坏性测试。

### FastMCP

- 优先使用 FastMCP 官方 Client 支持的进程内调用及与正式运行方式匹配的 stdio 测试。
- 验证启动、Tool 列表、参数、返回值和错误传播。
- 不强制通过真实聊天 Agent 测试 MCP；仅通过进程内测试时，不得宣称已完成 stdio 集成验证。

### Siril / External Software

- 验证目标 Siril 版本、命令、输入输出文件、错误状态和资源清理。
- 输出文件存在并不自动证明处理结果正确；按 TEST_PLAN 使用必要的数值指标、参考数据或人工评审。
- 区分使用真实 Siril 的集成测试与 Mock 调用测试。

---

## 七、多 Agent 执行与证据合并

允许独立 Agent 分工执行前端、后端、数据库、MCP、外部软件或集成测试，但必须：

1. 为每个 Run 明确代码版本、计划版本、范围和证据目录。
2. 隔离会冲突的数据库、文件和运行状态。
3. 用真实结果而非 Agent 成功声明作为汇总依据。
4. 统一 TC、RUN、BUG 编号，合并重复缺陷。
5. 核实跨模块失败、环境差异和证据是否仍适用于最终代码。
6. 由 TEST_REPORT Subagent 汇总为一个当前有效的 `06_TEST_REPORT.md`。

---

## 八、TEST_REPORT 完成条件（Quality Gate）

准备完成报告或进入 CLOSE 前检查：

- [ ] 已记录最终被测代码版本及必要工作区状态。
- [ ] 已记录适用 TEST_PLAN 版本。
- [ ] 每个正式执行批次有唯一 RUN ID。
- [ ] 实际环境、执行范围和执行入口清晰。
- [ ] 所有 Pass 有真实、可追溯的执行证据。
- [ ] Fail、Blocked、Skipped、Not Run 分类准确。
- [ ] 关键 FR/AC 具有当前版本的有效验证证据。
- [ ] P0/P1 测试达到既定退出要求；未达标则明确报告。
- [ ] 失败已分析，未确认根因保持可追踪。
- [ ] 有效 BUG 均有关联的 TC、RUN 和证据。
- [ ] 已修复 BUG 经过实际复测才标记 Closed。
- [ ] 已根据修复影响执行必要回归测试。
- [ ] 统计分母、执行数量、失败与阻断数量真实一致。
- [ ] 历史失败证据与当前结果分开保存。
- [ ] 测试偏差、覆盖盲区及剩余风险已披露。
- [ ] 需要接受的非阻断风险具有明确批准记录。
- [ ] 已给出有证据支持的最终质量结论。
- [ ] Feature Index 与当前报告状态一致。

如果关键项不满足，应如实保持 `FAIL` 或 `INCOMPLETE`；不得为通过门禁而重写测试事实。

---

## 九、最终工作准则

**TEST_REPORT 的完成标志，不是所有数字最终显示绿色，而是测试状态真实、证据有效、缺陷闭环可追踪、剩余风险透明，并足以支持合理的验收决策。**

始终执行：

`Execute → Record → Analyze → Fix → Retest → Assess`

- 只有真实执行才产生 Pass。
- 修复提交不等于缺陷关闭，必须真实复测。
- 历史证据不能覆盖，旧版本结果不能随意迁移到新版本。
- 不能用局部验证代替全部关键需求的系统验收。
- `06_TEST_REPORT.md` 是测试质量证据的汇总入口；Feature 的最终关闭由 CLOSE 阶段完成。

---

## 十、参考资料

- ISTQB — Certified Tester Foundation Level Syllabus v4.0.1，测试报告、配置管理与缺陷管理：
  https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf
- ISTQB — Test Reporting：
  https://tbok.istqb.org/search?q=FL-5.3.2
- ISTQB — Defect Reporting：
  https://tbok.istqb.org/search?q=defect+report
- pytest — Managing Test Output (JUnit XML)：
  https://docs.pytest.org/en/stable/how-to/output.html
- FastMCP — Official Documentation：
  https://gofastmcp.com/
