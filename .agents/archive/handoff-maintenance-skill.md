---
task: handoff-maintenance-skill
status: completed
updated: 2026-11-21
---

## Goal

将 Core 仓库树与 Module 文件树的日常维护纳入项目内 Skill，加入只读结构检查，保持 Git 暂存区。

## Progress

- 写入 Skill、两层文件地图样例及校验脚本。将拆分候选门槛更新为 200,000 Unicode 字符。

## Verified

- check_handoff.py --full 核对 Core 305 文件、94 目录，Module 212 文件和 98 个链接。增量检查 AGENTS.md、两处样例源码和 Skill 目录通过。
- 临时 Git 仓库走查新增、重命名、暂存文件从工作树删除、职责变化和错误分支变化，验证重复节点、失效锚点、外部链接及索引只读。后两项语义判断来自源码对照。
- skill-creator quick_validate.py 和 Ruff 检查通过。工作区暂存条目 SHA-256 与起始值一致。本次未运行产品测试。

## Decisions

- 增量校验按明确提供的路径过滤，全文职责和证据判断由维护者完成。
- 字符数超过门槛提示评估。Frontend 已有五篇，保留现有分组。

## Blockers

- 无。

## Next

- 后续任务按 AGENTS.md 入口检查并维护两层交接树。
