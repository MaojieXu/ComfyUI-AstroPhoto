# ComfyUI 扩展底座与绘图节点 · 阶段索引

**标识** `comfyui-extension-drawing` · 现行实现对账与 PRD 评审 · v0.7 · 2026-11-21

**当前状态** PRD 至测试计划已按工作树补齐，Q-01 进入评审，Q-02/03 依次确认。业务当前验收仍待复核，Close 维持 `PARTIAL`。

让用户在原生 ComfyUI 画布绘制图像、保存工作流并恢复像素，同时让宿主与外部诊断能够识别扩展是否实际加载。

## 基线与来源

`06961ee` 起步，`5e39fcf` 接入 V3/Core，`003c599` 所在基线已包含绘图持久化。 历史参考为 `main@4c0cf4d`，当前对账使用磁盘上的 V3 启动、Siril Bundle、Vue Widget 与构件未提交改动。v0.4 补齐宿主变更通知、触摸坐标及状态权限边界，保留 Q-01～03 的待决状态。历史运行证据保留原有版本。[architecture.md](../../../docs/architecture.md) · [publishing.md](../../../docs/publishing.md) · [backend-standardization.md](../../../.agents/notes/backend-standardization.md) · [drawing-persistence.md](../../../.agents/archive/drawing-persistence.md) · [react-sidebar.md](../../../docs/react-sidebar.md)

## 阶段与接续

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | 文档已建立 |
| PH-01 | [产品需求](01_PRD.md) | v0.7 补充 Q-04～15 边界选择、利弊与影响，Q-01～15 待确认 |
| PH-02 | [交互规格](02_UI_UX.md) | v0.4 现行界面与状态，分享及恢复方案待确认 |
| PH-03 | [技术设计](03_TECH.md) | v0.4 真实输入、输出、时序与守卫缺口 |
| PH-04 | [开发规格与实现](04_DEV.md) | v0.4 按宿主、Widget、队列、发行切片核对源码 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | v0.4 按实际源码补齐 CASE-01～04，对决策相关分支待冻结 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | 历史证据已收录，本轮业务测试 NOT_RUN |
| PH-07 | [Close 草案](Close.md) | 未关闭 |
| PH-08 | [专题总览](../INDEX.md) | 保持活动，待关闭后归档 |

从 [PRD 待决问题](01_PRD.md#本轮待决问题) 先确认完整发行的 IMAGE 门槛，再依次确认分享与慢恢复。按影响回写下游。正式 IMAGE 证据由 CASE-03E 独立采集，迁移脚本只覆盖临时引用。
