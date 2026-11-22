# Independent Code Review Gate

## 目录

- 1. Purpose
- 2. Trigger
- 3. Reviewer Responsibilities
- 4. Review Context
- 5. Review Constraints
- 6. Findings
- 7. Resolution
- 8. Completion Criteria
- 9. Outputs
- 10. Final Principle

---

## 1. Purpose

在 Feature 开发完成后、正式系统测试前，执行一次独立代码审查。

原窗口的 Main Agent 负责交接与门禁。用户自行打开新窗口并粘贴指令，由新窗口的审查者在全新上下文中直接执行只读审查，将结果回复给用户带回。

本规范不绑定特定 Agent 框架、模型或服务商。

## 2. Trigger

满足以下条件时触发：

- DEV 的计划内实现已完成。
- 必要的局部测试已经执行。
- DEV_LOG 已更新。
- TEST_PLAN 已建立并与当前实现同步。
- 当前代码状态能够被明确识别。
- 不存在阻止有效审查的开发问题。

每个 Feature 默认进行一次正式独立审查。

### 原窗口交给用户的指令

Main Agent 核实第 4 节列出的资料后，将下列方括号内容全部替换为实际值，用一个可复制的代码块交付。写明仓库和指导稿的绝对路径，其余文件可用相对于该仓库的路径。审查目标含未提交改动时，给出比较基线、范围内的已修改及未跟踪文件，以及可核对其当前内容的标识，避免仅凭 HEAD 定位。

```text
请在当前新窗口直接担任独立代码审查者，对 [Feature 名称及目标] 做只读 Code Review。
仓库位于 [绝对路径]。先完整读取 [review-gate.md 绝对路径]，按其中的审查职责和 Findings 要求工作。
审查范围为 [比较基线、目标代码状态、相关文件及范围边界]。
Feature 索引和已确认的需求、设计、DEV 日志、测试计划位于 [实际文件路径，按适用性列出]。
请核对实际代码状态和差异，必要时追踪调用方。若目标无法对应，请说明缺少的信息并暂停。
只读分析代码和测试，不委派审查、不修复代码、不执行正式测试。请在本窗口回复一份可原样带回的报告，写明实际审查的版本、范围、Findings、阻断项和未覆盖项。每项发现附严重度、文件位置、依据、影响和修复建议。若没有发现问题，也请明确写出结论。
```

原窗口交付指令即停止推进，等待用户带回报告。仅交付指令时不生成审查记录。新窗口直接回复报告后结束本次审查。

## 3. Reviewer Responsibilities

独立 Review Agent 负责：

- 检查需求实现完整性。
- 检查实际代码与 TECH 的一致性。
- 检查 UXUI 的关键交互要求。
- 分析逻辑错误与边界行为。
- 检查接口和数据一致性。
- 检查异常处理与资源生命周期。
- 识别潜在回归。
- 识别重要测试覆盖缺口。

## 4. Review Context

提供：

- 已确认的 PRD。
- 已确认的 UXUI（如适用）。
- 当前 TECH。
- 当前 DEV_LOG。
- 当前 TEST_PLAN。
- Feature 完整代码 Diff。
- 相关源代码与测试文件。

审查 Agent 应独立分析代码，不依赖开发 Agent 对实现正确性的主观结论。

## 5. Review Constraints

- 审查过程采用只读模式。
- 不直接修改生产代码。
- 不自行变更 PRD 或 TECH。
- 不将未经核实的推测视为确定缺陷。
- 不只检查 Diff，必要时追踪相关调用方。
- 审查结果必须绑定被审查的代码状态。

## 6. Findings

每条 Finding 应包含：

- Finding ID。
- Severity。
- File / Symbol。
- Description。
- Evidence。
- Impact。
- Suggested Resolution。

优先报告具有实际影响的问题。

避免将单纯风格偏好作为阻断性缺陷。

## 7. Resolution

用户带回报告后，原窗口 Main Agent 先核对受审版本和范围。结果缺失或版本无法对应时门禁保持待完成，向用户指出需补充之处。核对后将 Findings 路由给 DEV Subagent，由 DEV Subagent：

1. 核实每条 Finding。
2. 识别误报。
3. 修复确认的问题。
4. 对修复执行必要的局部自检。
5. 检查修复 Diff。
6. 更新 DEV_LOG。
7. 通过 Main Agent 将设计或覆盖变化交给对应阶段同步。

默认不重复启动完整独立审查。

## 8. Completion Criteria

满足以下条件后，Review Gate 通过：

- 独立审查已完成。
- 所有 Findings 已分类。
- 阻断性问题已修复并验证。
- 非阻断问题已记录。
- 修复所需的局部自检已执行。
- 最终代码状态已明确。
- 审查结果已归档。

如果审查后发生重大代码变更，应明确记录原审查不再覆盖的部分，不得将原审查结论直接套用到新实现。

## 9. Outputs

原窗口 Main Agent 将用户带回的审查结果归档到：

`.agents/features/{feature-name}/assets/reviews/`

DEV_LOG 仅记录审查摘要、主要 Findings 和处理状态。

Main Agent 核对审查交接后，在 Feature Index 记录 Review Gate 的当前状态。

## 10. Final Principle

Independent Review Gate 是生命周期质量门禁，而不是独立开发阶段。

Review Agent 负责发现问题。

DEV Subagent 负责核实和修复问题。

TEST_REPORT 负责最终测试验证。

CLOSE 负责最终验收与归档。
