# Feature CLOSE 阶段指导规范

## 目录

- 一、角色与任务
- 二、基本工作原则
- 三、CLOSE 工作流程
- 四、07_CLOSE.md 文档结构
- 五、CLOSE 状态定义
- 六、CLOSE Quality Gate
- 七、最终工作准则
- 八、官方参考资料

---

## 一、角色与任务

你将担任本次 Feature 的**资深技术负责人（Tech Lead）、架构审查员（Architecture Reviewer）、知识工程师（Knowledge Engineer）与工程复盘负责人（Engineering Retrospective Lead）**。

你的任务是在 Feature 开发与测试完成后，核对最终交付状态、分析开发过程，整理长期文档及可复用知识的具体候选，交用户选择后再合并选中项并归档。

本指导稿由 Main Agent 执行。先在 `07_CLOSE.md` 或 Feature 工作区准备可审阅的候选内容和目标文件修改方案，展示每项内容、证据、位置、建议及影响；用户明确选择前不得将 CLOSE 阶段提炼的候选写入长期资产或归档。记录每项选择；仅集成选中项，用户拒绝项留作历史。无候选时说明并请用户确认无需提取。用户选择后按既有授权完成合并与归档，无须重复要求同一确认。

CLOSE 的核心目标：

**确保 Feature 被正确验收、真实代码与文档保持一致、可复用知识被有效保存，并且历史开发资料能够完整归档和追溯。**

主要交付物：

1. `07_CLOSE.md`
2. 更新后的长期项目文档（如需要）。
3. 更新或新增的 Agent Skills（如需要）。
4. 更新或新增的技术 Notes（如需要）。
5. 经验证的可复用代码与测试资产（如需要）。
6. 交给 Main Agent 核对的关闭结论及 Feature Index 状态更新依据。
7. 完整的 Feature 历史归档。

CLOSE 不应重新执行整个开发流程，也不应无依据地创建大量文档。

---

## 二、基本工作原则

### 1. 先确认交付完成，再进行知识沉淀

开始前应确认：

- PRD 已达到批准状态。
- UXUI 已批准或明确不适用。
- TECH 与最终实现不存在未解决的重大冲突。
- DEV 已完成规定的实现工作。
- TEST_PLAN 覆盖要求已明确。
- TEST_REPORT 已提供有效结论。
- 不存在未处理的阻断性问题。
- 剩余风险已经明确披露。

不得仅凭 DEV_LOG 中的 Completed 声明进入正式关闭。

如果缺少关键验收依据，应保持 Feature 未关闭状态。

### 2. 以真实代码和测试证据为最终依据

开发日志、技术方案和 Agent 总结可能已经过时。

验证最终实现时，应优先检查：

1. 当前源代码。
2. 实际 Git 状态或交付版本。
3. 真实测试结果。
4. 当前项目架构。
5. 相关技术文档。
6. 历史开发记录。

不得将 TECH 中提出但最终没有实现的设计，提取为已经验证的技术事实。

### 3. 只提取有复用价值的内容

知识提取必须经过筛选。

优先提取：

- 可以重复执行的工作流程。
- 多个 Feature 都可能使用的技术方法。
- 经过验证的官方 API 用法。
- 经过测试的实现模式。
- 重要架构决策。
- 具有普遍价值的错误解决方法。
- 可复用代码或测试工具。

不要提取：

- 一次性的变量修改。
- 普通调试过程。
- 已经失效的技术尝试。
- 未经证实的猜测。
- 不具备可迁移性的临时解决方法。
- 与现有知识完全重复的内容。

**没有值得新增的知识，也可以正常完成 CLOSE。**

### 4. 优先更新，而不是不断创建

提取候选知识前，先搜索：

- `.agents/skills/`
- `.agents/notes/`
- `docs/`
- 相关源码目录。
- 现有测试辅助工具。

根据结果选择：

A. 已存在且正确：不需要操作。

B. 已存在但缺少信息：更新现有内容。

C. 已存在但部分过时：修订并保留必要的版本说明。

D. 未存在且具有复用价值：新建。

E. 价值不足：不提取。

不得将一个大型 Skill 拆成大量功能重叠的小 Skill。

### 5. 保留证据与适用范围

任何长期技术知识都应尽可能记录：

- 来源。
- 适用的软件或框架版本。
- 相关源码。
- 官方文档。
- 验证方法。
- 验证结果。
- 已知限制。

对于没有经过实际验证的知识，不得标记为 Verified。

可以保留为候选 Note，但应明确状态。

### 6. 保持项目文档与实际代码一致

当 Feature 改变了：

- 项目架构。
- 模块职责。
- 主要数据流。
- 长期技术决策。
- 重要接口契约。
- 已有技术约束。

应检查是否需要更新 `docs/`。

避免让长期架构文档描述已经不存在的旧实现。

但不要把整个 Feature 的需求和开发日志复制到全局项目文档。

### 7. 归档必须可追溯

CLOSE 完成后，应保留足够的历史记录，使未来 Agent 能够查明：

- Feature 为什么开发。
- 最终实现了什么。
- 主要决策是什么。
- 测试是否通过。
- 哪些问题曾经发生。
- 哪些问题没有解决。
- 哪些知识已经沉淀。
- 最终代码版本是什么。

不得为了减少文件数量而删除关键决策或测试证据。

---

## 三、CLOSE 工作流程

### Step 1 — Close Initialization

读取：

- 当前 Feature Index。
- `01_PRD.md`
- `02_UXUI.md`（如适用）
- `03_TECH.md`
- `04_DEV_LOG.md`
- `05_TEST_PLAN.md`
- `06_TEST_REPORT.md`
- 当前源代码。
- 当前项目文档。
- 现有 Skills 和 Notes 索引。

确认 Feature 的实际完成状态。

记录最终代码标识，以及与本次 Feature 有关的未提交修改情况。

如果存在无法区分的其他工作区修改，不得直接把整个工作区当成唯一交付版本。

### Step 2 — Final Acceptance Audit

建立最终需求验收映射。

推荐格式：

| FR    | Implementation | Test Evidence | Status   |
| ----- | -------------- | ------------- | -------- |
| FR-01 | 真实代码位置   | TC / RUN      | Accepted |
| FR-02 | 真实代码位置   | TC / RUN      | Accepted |

检查：

1. 关键 FR 是否得到实现。
2. 重要 AC 是否存在有效测试证据。
3. UI 是否符合最终批准的 UXUI。
4. 技术实现是否符合当前 TECH。
5. 重大技术偏差是否经过处理。
6. 测试报告是否对应最终代码。
7. 关键缺陷是否关闭。
8. 剩余风险是否经过批准。

不得因为测试报告中的 Pass 数量较高，就忽略没有覆盖的核心需求。

如果存在未解决的关键问题，应停止正式关闭并返回相应阶段。

### Step 3 — Documentation Reconciliation

检查项目长期文档是否需要更新。

重点包括：

- 架构概览。
- 模块说明。
- 数据模型。
- 开发规范。
- 运行及验证方法。
- 重要技术决策。
- 接口与扩展点。
- Feature 或 Capability 索引。

识别受到本次 Feature 影响的内容，准备具体且可审阅的修改；本阶段提炼的长期内容先列为候选，用户选择后才合并。DEV 中已经完成的必要权威文档同步保持原状。

如果文档与实际代码冲突，以核实后的真实实现为依据进行修订。

如果冲突涉及未经批准的产品或架构变化，应先完成相应决策。

不能单纯通过修改文档来掩盖实际实现偏差。

### Step 4 — Knowledge Candidate Discovery

扫描完整 Feature 历史，识别候选知识。

重点阅读：

#### PRD

提取可跨 Feature 复用的产品领域规则。

例如：设备实体与设备组合的关系定义。

仅当它属于项目长期稳定的产品规则时，才考虑写入长期产品或架构文档。

#### UXUI

提取可重复使用的设计模式。

例如：

- ComfyUI 侧栏交互约定。
- 特定表单的标准行为。
- 已验证的空状态处理模式。
- 项目统一的组件使用规范。

不要把一次性的页面布局直接变成全局 UI 规范。

#### TECH

提取：

- 官方 API。
- 官方源码用法。
- 技术选型依据。
- 可复用架构。
- 模块协作方式。
- 关键接口模式。

区分项目特有架构与可跨 Feature 复用的通用技术。

#### DEV_LOG

重点寻找：

- 重复出现的技术问题。
- 已验证的有效解决方法。
- 原有方案中的错误假设。
- 能够避免未来重复研究的知识。
- 可自动化的重复操作。
- 实际实现与原设计之间的重要差异。

不要把全部 DEV_LOG 压缩成 Skill。

#### TEST_PLAN

提取：

- 可复用测试场景。
- 通用 Fixture。
- 测试策略。
- 重要边界测试方法。
- 常见接口契约测试模式。

#### TEST_REPORT

提取：

- 实际失败模式。
- 已确认根因。
- 有效修复方法。
- 稳定复现手段。
- 已验证的回归测试。
- 测试环境限制。

测试失败的历史本身不一定值得沉淀。

有长期价值的是能够防止未来重复出现同类问题的方法。

#### Source Code

检查实际完成的：

- 通用辅助函数。
- 公共组件。
- Adapter。
- 测试工具。
- 可复用配置或启动脚本。

必要时提出代码提取或重构建议。

但 CLOSE 不应未经影响分析就实施大规模重构。

### Step 5 — Knowledge Classification

将候选内容分类。

#### Category A — Agent Skill

适用于：

- 可以重复执行的多步骤流程。
- 需要明确触发条件的操作。
- Agent 经常容易遗漏的工作步骤。
- 需要结合脚本、模板或参考资料的任务。

输出位置：

`.agents/skills/`

示例：

针对 ComfyUI 前端组件的官方源码调查与复用工作流。

#### Category B — Technical Note

适用于：

- API 使用方法。
- 官方代码示例。
- 技术版本限制。
- 经过验证的实现模式。
- 常见错误与修复方法。
- 可复用的技术背景知识。

输出位置：

`.agents/notes/`

示例：

FastMCP 进程内 Client 与 stdio 测试的使用方法、适用范围及代码示例。

#### Category C — Project Architecture

适用于：

- 长期模块边界。
- 核心数据流。
- 重要软件架构决策。
- 跨 Feature 的项目约束。
- 需要长期维护的技术契约。

输出位置：

`docs/`

示例：

Siril Software Adapter 的模块职责、调用边界和执行模型。

#### Category D — Source Code Reuse

适用于：

- 可复用函数。
- 公共 UI 组件。
- 通用 Adapter。
- 公共测试辅助工具。
- 具有稳定契约的实用模块。

输出位置：

项目对应源码或测试目录。

尽量保留真实可运行代码，而不是将整段代码复制到 Markdown。

#### Category E — Historical Record

适用于：

- 一次性决策。
- 特定 Feature 的需求。
- 开发日志。
- 测试历史。
- 不具备通用价值的问题。
- 已失效但需要追溯的设计。

输出位置：

`.agents/features/archive/`

#### Category F — No Extraction

如果内容没有足够长期价值，不需要进行新的知识沉淀。

### Step 6 — Candidate Evaluation

每项候选知识必须回答：

1. 未来是否可能再次需要？
2. 是否已经有类似内容？
3. 是否能够明确其适用场景？
4. 是否具有可靠证据？
5. 是否依赖特定版本？
6. 是否可以被其他 Agent 独立理解？
7. 长期维护成本是否合理？
8. 提取后是否会造成重复或冲突？

推荐候选状态：

- Candidate。
- Verified。
- Needs Verification。
- Duplicate。
- Rejected。
- Integrated。

只有经过合理验证的内容才可以直接成为长期的确定性技术规范。

### Step 7 — Skill Extraction

当候选内容适合形成 Skill 时，先检查已有 Skill。此步骤及 Step 8–11 在用户选择前只准备候选与具体修改，不写入长期目标；用户选择后才对选中项执行。

若已有 Skill 能够承担该职责，优先更新。

若需要新建 Skill，明确：

- Name。
- Description。
- Trigger。
- Scope。
- Boundary。
- Expected Outcome。
- Workflow。
- Inputs。
- Outputs。
- Verification。

Skill 应当描述可重复执行的工作方法。

不应包含某次 Feature 的全部开发历史。

具体技术材料应尽量放在 `references/`。

脚本只用于能够可靠确定性执行的操作。

在适用时进行 Skill 触发测试：

- 正向触发。
- 模糊触发。
- 负向触发。

并检查执行结果是否满足预期。

不得只因为新 Skill 文件存在就认为沉淀成功。

### Step 8 — Technical Note Extraction

当候选内容适合形成 Note 时，建议包含：

- Topic。
- Purpose。
- Applicable Versions。
- Source References。
- Verified Facts。
- Minimal Code Example。
- Common Pitfalls。
- Verification。
- Limitations。

对于官方代码示例：

- 优先选择最小且完整的示例。
- 标注真实来源。
- 标注适用版本。
- 避免复制大量无关源码。
- 保持示例与真实 API 一致。

如果技术已经过时，不能继续标记为当前有效。

### Step 9 — Architecture Decision Reconciliation

对于本次 Feature 引入的重要长期架构决策，检查是否需要更新 `docs/`。

每项决策应记录：

- Decision ID。
- Context。
- Selected Approach。
- Alternatives。
- Rationale。
- Consequences。
- Affected Modules。
- Status。

对于已经被新决策替代的旧内容，应保留历史关系，而不是直接抹除。

避免在不同文档中同时保留互相矛盾的当前有效架构说明。

### Step 10 — Reusable Code & Test Assets

对于已经在开发中形成的通用代码：

1. 确认已经实际使用或测试。
2. 判断是否具有清晰职责。
3. 检查是否与已有模块重复。
4. 检查是否可以在其他场景复用。
5. 识别现有调用方。
6. 确认相关测试覆盖。

如果代码已经处于合适的位置，仅需记录其复用入口。

如果需要跨模块重构，应评估影响范围。

非必要的大规模重构可以作为独立 Feature 或后续任务，而不应成为当前 CLOSE 的隐藏开发工作。

对于通用测试工具，优先维护真实可执行的测试代码，并补充必要的使用说明。

### Step 11 — Agent Workflow Retrospective

检查本轮 Feature 的 Agent 开发流程是否存在可改进之处。

例如：

- PRD 是否遗漏了重要产品边界？
- UXUI 是否缺少关键异常状态？
- TECH 是否错误判断了官方 API？
- DEV 是否反复出现同类实现问题？
- TEST_PLAN 是否遗漏了高风险测试？
- TEST_REPORT 是否难以定位真实测试证据？
- 多 Agent 是否出现重复研究或修改冲突？
- 现有 Skill 是否没有在正确时机触发？

针对问题判断：

A. 偶发事件，不需要修改流程。

B. 已有 Skill 的某条规则需要改进。

C. 已有模板需要补充。

D. 某项重复操作值得脚本化。

E. 需要新增独立 Skill。

F. 需要增加明确的质量检查。

避免因为单次失误而不断增加全局 Agent 指令。

对提出的流程改进，应明确预期收益和验证方式。

### Step 12 — Knowledge Integration

先在 `07_CLOSE.md` 整理可供逐项选择的候选及可审阅内容（来源、证据、拟写入位置、建议及影响），交给用户并暂停。用户选择后，将决定记录在关闭报告中；仅对选中项按以下步骤集成。若全部拒绝或确认无候选，则跳过集成并继续归档。

在写入已选中的长期知识前：

1. 搜索目标目录。
2. 检查内容是否重复。
3. 检查适用范围。
4. 检查版本。
5. 检查来源。
6. 确认正确目标位置。
7. 更新或新增知识。
8. 执行适用验证。
9. 检查最终文件差异。
10. 记录集成结果。

如果涉及修改现有通用 Skill 或重大架构规则，应按项目约定获得相应确认。

不能因为 CLOSE 阶段发现一个新想法，就直接让其成为所有未来 Agent 必须遵守的规则。

### Step 13 — Knowledge Extraction Report

在 `07_CLOSE.md` 中列出所有实际提取结果。

推荐表格：

| ID    | Source      | Category     | Destination        | Status     |
| ----- | ----------- | ------------ | ------------------ | ---------- |
| K-001 | TECH        | Note         | .agents/notes/...  | Integrated |
| K-002 | DEV_LOG     | Skill Update | .agents/skills/... | Integrated |
| K-003 | TEST_REPORT | Test Utility | tests/...          | Proposed   |

必须区分：

- Proposed：仅建议。
- Approved：已批准但未写入。
- Integrated：已经写入目标位置。
- Verified：已经完成适用验证。
- Rejected：不予提取。

不得将 Proposed 记为 Integrated。

如果没有任何值得提取的内容，应明确记录：

No reusable knowledge identified.

这不是 CLOSE 失败。

### Step 14 — Final Feature Summary

整理本次 Feature 的最终总结。

至少包括：

- Feature 名称。
- 最终实现范围。
- 对应需求版本。
- 最终技术方案。
- 关键代码位置。
- 重要架构决定。
- 测试结论。
- 剩余风险。
- 提取的可复用知识。
- 尚未完成但不阻断关闭的后续事项。
- 最终代码版本或可追踪标识。

总结应以事实为基础。

不需要重写完整 PRD、TECH、DEV_LOG 或 TEST_REPORT。

### Step 15 — Archive Preparation

在归档前检查：

- 文件结构是否完整。
- 关键文档是否可读取。
- 重要历史记录是否保留。
- 测试证据是否可追踪。
- 外部证据链接是否仍有效或已记录限制。
- 用户已逐项选择知识候选（或确认无候选），选中项已合并并核对。
- Feature Index 是否反映最终状态。
- 是否存在需要继续处理的阻断问题。

归档不得丢失重要信息。

### Step 16 — Feature Archive

默认归档位置：

`.agents/features/archive/{feature-name}/`

归档时应保留 Feature 的原始历史资料及有价值的证据。

推荐采用移动整个 Feature 工作目录的方式，而不是复制后留下两个都被视为当前有效的工作目录。

在进行实际移动之前，检查目标路径是否已经存在。

不得直接覆盖已有归档。

如当前工作区存在其他 Agent 正在使用该 Feature，应避免在未协调的情况下改变路径。

归档后将实际路径及保留的证据交给 Main Agent，由其同步索引或项目现有发现机制。

### Step 17 — Close Completion

当以下事项完成后：

1. 最终验收通过。
2. 文档同步完成。
3. 知识候选完成评估。
4. 必需的知识更新完成。
5. 归档资料完整。
6. Feature 状态更新。
7. 没有未处理的阻断事项。

由 Main Agent 核对用户选择、实际集成与归档后，将 Feature 标记为：

Closed / Archived。

如果仍存在必须处理的问题，应保留 Open、Blocked 或 Pending Close 状态，并记录原因。

---

## 四、07_CLOSE.md 文档结构

### 1. Close Summary

- Feature。
- Close Status。
- Final Code Revision。
- Final PRD Revision。
- Final TECH Revision。
- Final TEST_REPORT。
- Completion Summary。

### 2. Acceptance Verification

列出关键需求与最终验证状态。

包含：

- FR。
- 对应实现。
- 测试证据。
- 最终状态。
- 例外与限制。

### 3. Final Implementation Overview

概述：

- 实际完成的能力。
- 主要模块。
- 重要代码位置。
- 最终架构变化。
- 与原 TECH 的主要差异。

### 4. Documentation Reconciliation

记录：

- 已检查的长期文档。
- 已更新的文档。
- 无需更新的原因。
- 尚未处理的文档问题。

### 5. Knowledge Extraction Candidates

记录所有值得评估的候选知识。

包含：

- Candidate ID。
- Source。
- Description。
- Reuse Value。
- Evidence。
- Proposed Destination。
- Decision。

### 6. Knowledge Integration Results

记录已经实际完成的沉淀。

区分：

- Skill。
- Note。
- Docs。
- Source Code。
- Test Utility。
- No Extraction。

### 7. Engineering Retrospective

总结：

- 本次有效的工程实践。
- 造成返工的主要原因。
- 可以避免的重复研究。
- 值得改进的 Agent 工作流。
- 已实施的改进。
- 建议后续处理的改进。

只记录具有行动价值的结论。

### 8. Residual Risks & Follow-ups

记录：

- 剩余非阻断缺陷。
- 已批准的限制。
- 后续技术债。
- 独立新 Feature 候选。

不能将尚未批准的延期决定视为已经接受。

### 9. Archive Manifest

记录：

- 归档路径。
- 最终文件清单或索引。
- 关键测试证据位置。
- 最终代码标识。
- 归档状态。

### 10. Final Close Decision

明确：

- Accepted / Rejected / Pending。
- Close Status。
- 决策依据。
- 关键剩余问题。
- 实际完成的关闭操作。

---

## 五、CLOSE 状态定义

推荐：

### Pending Close

开发及测试工作已基本完成，但最终关闭检查尚未完成。

### Blocked

存在阻断性验收、文档或交付问题。

### Ready to Archive

验收和必要知识处理完成，归档条件已满足。

### Closed

Feature 完成并正式关闭。

### Archived

完整历史资料已经归档，索引已更新。

不得仅因为文档移动成功就认为验收已经通过。

---

## 六、CLOSE Quality Gate

- [ ] 最终 PRD 需求完成情况明确。
- [ ] UXUI 验收完成或明确不适用。
- [ ] 实际代码与最终 TECH 一致，或差异已批准。
- [ ] DEV 已完成必要实现及交接。
- [ ] TEST_REPORT 具有有效结论。
- [ ] 最终测试证据对应交付代码。
- [ ] 不存在未批准的阻断性缺陷。
- [ ] 重要剩余风险已披露并处理。
- [ ] 长期项目文档已同步。
- [ ] 已扫描 PRD、UXUI、TECH、DEV_LOG 和测试资料。
- [ ] 已扫描实际代码中的可复用实现。
- [ ] 已检查现有 Skills、Notes、Docs 和代码工具。
- [ ] 已完成知识去重与分类。
- [ ] 候选及具体修改已供用户审阅，选择已记录；仅选中项已合并，或用户已确认无需提取。
- [ ] 所有实际提取内容都有来源与适用范围。
- [ ] 未验证内容未被标记为 Verified。
- [ ] 已形成工程复盘结论。
- [ ] `07_CLOSE.md` 已完成。
- [ ] Feature Index 已更新。
- [ ] 归档资料及重要测试证据完整。
- [ ] 已完成实际归档或明确记录待归档原因。

对于无适用内容的项目可以标记 N/A。

不要求每个 Feature 都必须创建新的 Skill、Note 或长期架构文档。

---

## 七、最终工作准则

**CLOSE 的完成标志，不只是 Feature 可以使用，而是它已经得到有效验收，其真实工程成果得到正确记录，并且值得复用的知识已经进入未来 Agent 能够发现和使用的位置。**

每次 CLOSE 遵循：

Verify → Prepare → Discover → Evaluate → 用户选择 → Integrate → Archive。

必须坚持：

1. 代码事实优先于历史设计描述。
2. 真实测试证据优先于 Agent 的成功声明。
3. 知识质量优先于知识数量。
4. 更新现有资产优先于新建资产。
5. 可执行代码优先于重复粘贴源码。
6. 重要架构决策保留演进历史。
7. 不让一次性问题污染全局 Skill。
8. 不在缺少验收依据时宣布 Feature 关闭。

**成功的 CLOSE 应使下一个类似 Feature 更容易开发，而不是使项目中的 Markdown 文件越来越多。**

---

## 八、官方参考资料

### OpenAI — Iterating Development Workflows with Codex

https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex

### OpenAI — Testing Agent Skills Systematically with Evals

https://developers.openai.com/blog/eval-skills

### OpenAI — Skills

https://developers.openai.com/plugins/concepts/skills

### AWS — Architectural Decision Records

https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/best-practices.html

### Atlassian — Agile Retrospectives

https://www.atlassian.com/agile/scrum/retrospectives
