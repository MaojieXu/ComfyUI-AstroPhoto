---
name: task-notes
description: Manage notes for complex or cross-session coding tasks. Use when creating, updating, verifying, handing off, or completing tasks.
---

# Task Notes

One task, one file: `.agents/notes/<task-id>.md`.

## Lifecycle

1. **Create**: Define goal, acceptance criteria, and initial state.
2. **Update**: Record progress, decisions, and blockers after significant changes.
3. **Verify**: Check claims against source code, Git, and test results. Distinguish real host execution, mocked boundary tests, static checks, and unverified work. Record exact commands and relevant environment constraints.
4. **Compact**: Remove duplication, outdated assumptions, and unnecessary logs.
5. **Handoff**: Before context reset or session end, preserve current state and actionable next steps.
6. **Promote**: Move verified, reusable knowledge into `docs/`.
7. **Archive**: Move completed notes with historical value into `.agents/archive/`. If acceptance is blocked, retain an active/handoff note with the failing command and next action instead of marking it complete.
8. **Prune**: Delete obsolete, redundant, or superseded notes.

On task resume, read the existing note and verify its state before proceeding.

## Format

Use this template for every task note:

```markdown
---
task: <task-id>
status: active
updated: YYYY-MM-DD
---

## Goal
目标与验收标准。

## Progress
- 已完成及进行中的工作。

## Verified
- 测试命令、结果及 Git 证据。

## Decisions
- 关键决策及原因。

## Blockers
- 未解决的问题。

## Next
- 下一步具体操作。
```

Statuses: `active | blocked | handoff | completed`.

Keep notes concise, factual, and recoverable without conversation history.
