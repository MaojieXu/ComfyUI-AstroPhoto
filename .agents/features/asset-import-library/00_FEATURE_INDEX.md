# 素材导入与资产登记 · 阶段索引

**标识** `asset-import-library` · v0.6 · 2026-11-21

在保全原件的前提下登记天文文件，追踪外部引用或 Workspace 副本，提供导入回执、位置重绑、会话关联和科学节点读取。

## 基线与来源

`003c599` 引入历史导入服务和 React 浏览界面。当前实现为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 工作树。后端复用 `astrophoto/api/assets.py`、`astrophoto/assets/imports.py`、`astrophoto/assets/service.py`，路由装配和 runtime 变更，增加 `astrophoto/assets/fits.py`、`astrophoto/api/scientific.py`。Vue 侧栏新增占位和专用 FITS 控件，HEAD 的 React Assets 和旧浏览器脚本为历史证据。历史 Windows 0.45.0/1.59.1 与当前目标 0.46.0/1.59.6 分开记录。 [开发环境](../../../docs/development.md) · [资产历史交付](../../../docs/local-storage.md)

| 阶段 | 当前产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，当前与历史基线已定位 |
| PH-01 | [产品需求](01_PRD.md) | IN_PROGRESS，v0.6 核对源码并扩充 Q-01～18、优缺点及边界矩阵，已有决定沿用 |
| PH-02 | [交互规格](02_UI_UX.md) | READY，已记录 P0 占位、FITS 选择与历史界面，恢复 Assets 设计开放 |
| PH-03 | [技术设计](03_TECH.md) | READY，路由、存储与科学消费边界已定位 |
| PH-04 | [开发规格与实现](04_DEV.md) | READY，当前后端行为、guard 和差异已映射 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | READY，已实现切片与界面恢复场景分开 |
| PH-06 | [历史测试报告](06_TEST_REPORT.md) | NOT_STARTED（独立 Feature 复验），本轮业务测试 NOT_RUN；当前工作树已有独立迁移报告中的有限证据 |
| PH-07 | [历史 Close 草案](Close.md) | IN_PROGRESS，旧草案判定 PARTIAL |
| PH-08 | [专题总览](../INDEX.md) | NOT_STARTED，专题保持活动 |

独立迁移运行的 10-A/B 验证真实 Vue 宿主 Assets 默认入口、双语和无素材请求。该运行的跨卷回归因缺少第二测试卷跳过。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

Q-02 优先确定本专题是否恢复 Assets 页面。Q-05 关联此前要求的测试后 API 删除闭环，当前缺少资产删除接口。Q-06～18 是本轮架构和边界审视新增的未决项。CASE-01～07 可依现有接口复核，CASE-08 的删除步骤等待 Q-05 和实现，其他新增决定确认后再传播至测试计划。
