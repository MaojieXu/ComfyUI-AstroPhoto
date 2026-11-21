# 本地存储与工作区 · 阶段索引

**标识** `local-storage-workspaces` · v0.7 · 2026-11-21

本专题管理本机 Data Root、工作区、默认写入位置和可重建 Cache，并追踪迁移结果、取消与中断恢复。

## 基线与来源

`003c599` 是历史存储提交。当前实现以 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加 2026-11-21 工作树为准。相关未提交变更包含 `__init__.py`、`astrophoto/bootstrap.py`、`astrophoto/storage/runtime.py`、`astrophoto/api/routes.py`、Vue 侧栏/存储模块与测试，HEAD 的 React 页面和旧宿主脚本仅用于解释历史行为。历史 Windows 0.45.0/1.59.1 与当前目标 0.46.0/1.59.6 分开记录。 [开发环境](../../../docs/development.md) · [历史交付](../../../docs/local-storage.md) · [历史界面证据](../../archive/storage-comfyui-frontend.md)

| 阶段 | 当前产物 | 状态 |
| --- | --- | --- |
| PH-00 | 本页 | COMPLETE，当前与历史基线已定位 |
| PH-01 | [产品需求](01_PRD.md) | IN_PROGRESS，完成源码边界审查，Q-01～32 按四组评审，选项待用户确认 |
| PH-02 | [交互规格](02_UI_UX.md) | IN_PROGRESS，已有 Vue 规格保留，整库搬家与导入入口待评审 |
| PH-03 | [技术设计](03_TECH.md) | IN_PROGRESS，默认路径实现已核对，整库搬家设计待决 |
| PH-04 | [开发规格与实现](04_DEV.md) | IN_PROGRESS，整库搬家待实现，复制纳管 API 已有 |
| PH-05 | [测试计划](05_TEST_PLAN.md) | IN_PROGRESS，已实现路径保持静态对照，整库新增预计用例 |
| PH-06 | [测试报告](06_TEST_REPORT.md) | Windows 路径定向验证通过，完整 Feature 尚未复验 |
| PH-07 | [历史 Close 草案](Close.md) | IN_PROGRESS，旧草案判定 PARTIAL |
| PH-08 | [专题总览](../INDEX.md) | NOT_STARTED，专题保持活动 |

独立迁移运行覆盖真实宿主 Storage 常规操作和部分错误回归（03-A～03-C）。真实宿主清理用空 Cache，第二卷用例跳过；完整 Feature 的权限、Cache 文件记账、迁移提交前后恢复和真实离线卷仍需验收。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

先评审 Q-06、Q-07、Q-10、Q-11，确定干净安装从首次启动到首次导入的实际路径。再评审 Q-12～Q-15，确定整库搬家的包含范围、交付形态、切换权威和备份恢复。其余按 PRD 的评审顺序。CASE-01～08 保留，审查产生的验收增量仍待对应决定。
