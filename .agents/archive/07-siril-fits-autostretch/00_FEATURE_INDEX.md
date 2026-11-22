# Siril CLI 集成 · 阶段索引

**标识** `siril-fits-autostretch` · v0.6 · 2026-11-21 · 活动 Feature
**现状** Siril CLI 全量脚本节点及路径执行已交付，经典与 Nodes 2.0 有当前测试报告。此前的科学与跨平台开放问题继续追踪。

可信本机通过 ComfyUI 队列调用 Siril 1.4.5。图像、序列和结果在节点间按路径传递；三个 FITS 命令提供比较预览，正式产物登记到默认 Workspace。


## 2026-11-21 范围更新

CH-03 将 Feature 07 扩展至 Siril CLI 1.4.5。官方命令表共有 201 条，183 条可脚本执行并生成节点，18 条仅列入命令目录。Feature 路径及旧节点、FR/Q/CASE 编号沿用。双画布真实 CLI、路径链和工作流重开已复验。现行调用链、兼容性和剩余范围见 [开发规格与实现](04_DEV.md)，早期 AutoStretch 资料作为历史基线保留。

## CH-04 · 分类与双语

按 Siril 操作用途为 183 个节点分组，为 201 条官方命令提供中英文标题和介绍。侧栏、画布和命令目录使用同源文案，节点内部显示用途和可展开的命令用法。 [实现](04_DEV.md) · [交互](02_UI_UX.md) · [验收](05_TEST_PLAN.md)

## CH-05 · 图像处理目录

按用户确认的 PixInsight 参考方案重分 183 个节点。目录含 18 个一级分类、21 条末级路径，色彩与通道有 4 个子分类。 [实现](04_DEV.md#ch-05-按图像处理操作重分目录) · [完整分类](../../../docs/siril.md#查找命令与节点) · [验收](05_TEST_PLAN.md)

## 基线与变更

- CH-01／CH-02 历史源码基线为 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 dirty 工作树。`__init__.py`、`nodes/scientific.py`、`astrophoto/api/routes.py`、`tests/backend/test_siril.py`、`tests/integration/test_siril_api.py` 为修改；`extension/siril/`、`extension/frontend-entry.ts`、`astrophoto/api/scientific.py`、`astrophoto/assets/fits.py` 和 Vue 来源、候选、测试、宿主脚本为当前工作树新增路径。重复核对可使用 `git status --short -- __init__.py astrophoto extension frontend nodes tests`，对跟踪文件使用 `git diff HEAD -- <路径>`，对新增文件读取当前磁盘。
- 原处理模块 `astrophoto/siril/` 和 `astrophoto/api/siril.py` 在工作树删除，后端与浏览器生产入口迁至 Siril Bundle，通用 FITS 路径与设置独立注册。变更记录 `CH-01`（静态核验）影响 FR-01～05 的源码、UI 和测试路径，历史 ID 保留。`CH-02` 登记 Assets 页占位、画布固定尺寸、配置取消边界，涉及 Q-04、Q-05 和独立重验。无新的产品确认。
- `003c599` 为 FITS 路径、预览与正式处理的历史提交。Windows 0.45.0 / 1.59.1 和 Siril 1.4.5 的旧运行可回查；该段历史证据不覆盖 CH-03 的新增边界。另有 2026-11-21 Windows ComfyUI 0.46.0 / Frontend 1.59.6 / Siril 1.4.5 的既有验证，经典和 Nodes 2.0 都覆盖配置、候选、单节点正式输出及工作流重开。测试使用同 HEAD 加当时 dirty 工作树；旧日志不覆盖当前新增边界或证明所有 dirty 文件一致。原证据按各自基线保存。 [对应验证](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) [Siril 说明](../../../docs/siril.md) · [历史任务笔记](../../notes/07-siril-autostretch.md) · [测试报告](06_TEST_REPORT.md)

## 阶段与接续

| 阶段 | 产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE · 已定位身份和当前基线 |
| PH-01 | [产品需求](01_PRD.md) | IN_PROGRESS · v0.6 边界评审稿，Q-01～20 待确认，FR-06～09 为待评审提案 |
| PH-02 | [交互规格](02_UI_UX.md) | IN_PROGRESS · 静态对齐，真实宿主、焦点和布局待验证 |
| PH-03 | [技术设计](03_TECH.md) | READY · 当前路由、数据与权限已定位 |
| PH-04 | [开发规格与实现](04_DEV.md) | COMPLETE · CH-03 执行及 CH-05 分类按实际调用链回写 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | READY · CASE-01～16，含路径、分类、介绍与双语 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | PARTIAL · CH-05 分类及中英文双画布通过，逐命令及跨平台仍待验 |
| PH-07 | [Close 草案](Close.md) | IN_PROGRESS · 历史 PARTIAL，尚未关闭 |
| PH-08 | [专题总览](../INDEX.md) | NOT_STARTED · 活动目录 |

先评审科学结果和输入身份，再评审正式队列和恢复、软件配置和运行、展示和管理。现有验收证据与本轮新增提案分别追踪。 [待决问题](01_PRD.md#本轮待决问题) · [验收范围](05_TEST_PLAN.md)
