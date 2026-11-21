# 素材导入与资产登记 · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## v0.4 文档对账

本次未新增业务运行。CASE-06、CASE-07 为基于现行代码补充的对账场景。CASE-08 的 API 删除步骤因资产删除接口缺失而 BLOCKED，其余步骤需在独立测试根执行。历史 React 界面结果不代表当前 Vue Assets 已恢复。 [测试计划](05_TEST_PLAN.md)

## 历史运行证据

**HIST-01**。本地存储交付记录覆盖多目录引用、C:/D: 真实卷、copy/retry 和刷新；真实浏览器导入及持久回执纳入 4 组 `test:storage-host`。ENOSPC 和源变更是受控故障注入。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [local-storage.md](../../../docs/local-storage.md) · [architecture.md](../../../docs/architecture.md) · [capabilities.md](../../../.agents/handoff/core/capabilities.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史自动化与浏览器预检证据 | NOT_RUN |
| CASE-02 | 历史真实文件和受控恢复证据 | NOT_RUN |
| CASE-03 | 历史位置和重启证据，迁移 UI 待核 | NOT_RUN |

## 待复验

在历史基线复验导入重入与离线重绑，迁移版本单列后端可用性和界面范围。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
