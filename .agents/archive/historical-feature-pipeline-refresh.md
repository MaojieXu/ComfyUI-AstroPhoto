---
task: historical-feature-pipeline-refresh
status: completed
updated: 2026-11-21
---

## Goal

按实际工作树补齐七项历史 Feature 的阶段索引及 PRD 至测试计划。独立前端迁移专题和原始测试结论由各自任务保留。

## Progress

以 Feature Pipeline v2.0 的阶段长版 Prompt 加载 Prompt 00、01、02、03、04A、04B、04C、05、09。流程先做源码披露，再依上游到下游更新需求、交互、技术、DEV、测试计划和入口。04C 仅用实现回写与证据边界。三个 GPT-6.2 Sol medium 子 Agent 分别负责存储和素材、侧栏和设备、Siril 和 FITS。主 Agent 处理绘图底座、MCP 和一致性核对。

## Verified

- main@4c0cf4d 加当前磁盘 Vue、Siril Bundle、宿主初始化与打包等未提交变更。七项共 42 份阶段文件及总览，34 个 FR 均可定位 DEV 和 Test Plan；核对 29 个开放问题、62 个 CASE（含子项）和 460 条本地链接。全量交接校验覆盖 112 条链接，结构错误为零。
- 开始时存在的 21 个迁移或报告及 Close 文件保持相同 SHA-256。并行工作新增迁移报告，按其实际范围只读引用和同步仓库地图。
- 业务测试本轮 NOT_RUN。留存证据按确切执行基线映射，不授予当前快照运行结论。

## Decisions

保留历史 FR、Q 和 CASE；新发现的取舍保持 Open。按当前源码明确 Assets 占位、Siril Bundle、现行光路和旧修订、MCP 逐次受权及绘图队列边界。未修改产品和测试代码。

## Blockers

本次文档无阻塞。后续验收受具体产品决定及测试环境约束，详见各索引。

## Next

从扩展底座与绘图 Q-01 继续逐项评审，登记确认来源并向相关文档传播，再按实际宿主状态进入测试执行。
