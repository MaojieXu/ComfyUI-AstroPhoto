# 侧栏与节点浏览 · 阶段索引

**标识** `sidebar-node-browser` · 2026-11-21 · PRD v0.15 · PH-07 CLOSED

产品基线为 [PRD v0.15](01_PRD.md)，新增 D-19 顶层标签返回首页。当前验收目标为 ComfyUI Backend 0.46.0 / Frontend 1.59.6。源码核对基线为 `f84442b` 加工作树。历史 Vue 迁移源自 PRD 所记 `4c0cf4d` 加当期工作树。 [开发环境](../../../docs/development.md) · [历史侧栏](../../../docs/react-sidebar.md)

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，已定位现行源码与历史基线 |
| PH-01 | [产品需求](01_PRD.md) | COMPLETE，确认 D-12～17，D-18 同步已确认的素材库基线 |
| PH-02 | [交互规格](02_UI_UX.md) | v0.5，焦点、反馈和素材页联动已对照测试 |
| PH-03 | [技术设计](03_TECH.md) | v1.1，薄适配、目录客户端和设置回执在目标宿主已复验 |
| PH-04 | [开发规格与实现](04_DEV.md) | v1.2，已回填实际入口、保护条件和宿主适配 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | v1.2 模式 B，按本轮实际实现冻结 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | D-19 定向组件与当前宿主通过。历史集成证据见 v0.14 段。 |
| PH-07 | [Close](Close.md) | v1.3，CLOSED，已记录受支持组合与书签并发边界 |
| PH-08 | [专题总览](../INDEX.md) | 现行资料保留于本目录 |

| 决定 | 实施定位 | 验收定位 |
| --- | --- | --- |
| D-06 双画布原生对照 | TECH §3、DEV §2D | 03-A/B、07-A/B |
| D-07 失效收藏隐藏与恢复 | DEV §2C | 06-B |
| D-11 薄适配及按动作降级 | TECH §3、DEV §2D、R-06 | 03-C、07-B |
| D-12 刷新隐藏旧目录、失败重试 | DEV §2B、R-02 | 02-C、04-B、07-A |
| D-13 统一节点归属与资格 | DEV §2B/2D、R-01 | 02-A、07-A |
| D-14 精确收藏 | DEV §2C、R-03 | 06-A/B |
| D-15 默认 Assets、草稿优先 | DEV §2A、R-07 | 01-B、05-A/B |
| D-16 会话内草稿 | DEV §2A、R-07 | 05-B |
| D-17 已验证组合才承诺支持 | DEV §2D、R-04～06 | 03-A/B/C、07-A/B |
| D-18 Assets 接入摄影素材库 | PRD FR-05.1、TECH、DEV §2A | 05-A、integrated-r6 |

关闭证据为当前集成构件及 integrated-r6。经验证环境为 Windows / Chromium、Backend 0.46.0 / Frontend 1.59.6 的两种画布。 [本专题证据映射](06_TEST_REPORT.md#v014-共享集成验证)
