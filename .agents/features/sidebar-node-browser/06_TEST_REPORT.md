# 侧栏与节点浏览 · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## 当前目标宿主的既有证据

独立迁移批次 `frontend-vue-v1596-local-2026-11-21` 记录经典画布与 Nodes 2.0 的主图、子图正常添加和拖放，以及主图撤销、重做。该证据受其工作树、宿主版本及测试动作限定。本次文档更新未执行测试。子图撤销、覆盖层命中、画布切换和负向操作仍待本专题验收。 [迁移报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

## 历史运行证据

**HIST-01**。历史 `docs/react-sidebar.md` 记录实际宿主 Sidebar、动态语言、主题、创建/撤销/拖拽/子图通过；`.agents/notes/node-bookmarks.md` 记录书签设置接入。范围属于 React 历史基线。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [react-sidebar.md](../../../docs/react-sidebar.md) · [node-bookmarks.md](../../../.agents/notes/node-bookmarks.md) · [sidebar-node-tree.md](../../../.agents/archive/sidebar-node-tree.md) · [native-sidebar-tabs.md](../../../.agents/archive/native-sidebar-tabs.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史宿主与组件证据 | NOT_RUN |
| CASE-02 | 历史目录通过；书签有专项记录，目标宿主待重验 | NOT_RUN |
| CASE-03 | 历史宿主已验证主图、子图与撤销 | NOT_RUN |

## 待复验

按 P0 迁移的目标宿主分别验证节点目录、书签、经典画布和 Nodes 2.0，记录未覆盖的编辑模式。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
