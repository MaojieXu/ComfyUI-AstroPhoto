# AstroPhoto 前端技术栈迁移

**标识**　`comfyui-frontend-stack-migration` · P0 · ARCHIVED

**状态**　2026-11-21 · 已正式归档。 [关闭记录](Close.md) · [原始证据](evidence/README.md) · [校验清单](ARCHIVE_MANIFEST.json)

**原位置**　`.agents/features/comfyui-frontend-stack-migration/`。**归档位置**　`.agents/features/archive/comfyui-frontend-stack-migration/`。远程 CI、第二卷和独立绘图 IMAGE 的验证范围沿用关闭记录。

**目标**　活跃前端统一到 ComfyUI 官方 Vue 技术栈，退出 React 与绘图中的 PrimeVue/Aura，保持宿主接入、旧工作流和现有业务行为。设备与光路归资料库，Siril 由 `extension/siril/` 作为处理 Bundle 接入公共前端。

## 阶段与交付物

状态码：`NOT_STARTED / IN_PROGRESS / BLOCKED / READY / COMPLETE / N/A`。`COMPLETE` 只表示该阶段交付物齐备，不代表迁移后的运行验收已通过。

| 阶段 | 状态 | 入口 | 说明 |
| --- | --- | --- | --- |
| PH-00 初始化与接续 | COMPLETE | 本页 | 已核对范围、基线、阶段与续做位置。 |
| PH-01 产品需求 | COMPLETE | [01_PRD.md](01_PRD.md) | v1.3 定稿；FR-01–FR-09 均为 Confirmed。 |
| PH-02 UI/UX | COMPLETE | [02_UI_UX.md](02_UI_UX.md) | Assets 占位已确认。真实宿主的主题、语言与侧栏宽度对照已记录。 |
| PH-03 技术设计 | COMPLETE | [03_TECH.md](03_TECH.md) | 已对齐依赖、目录和现行 Bundle 契约。 |
| PH-04A 源码披露 | COMPLETE | [官方源码片段](04_DEV.md#4-官方源码复用清单与片段) · [本地入口](04_DEV.md#5-本地入口与开发约束) | 静态核对已完成；运行时兼容性留待实测。 |
| PH-04B 开发规格 | COMPLETE | [04_DEV.md](04_DEV.md) | 保存七步迁移与真实落点、偏离和失败修复。 |
| PH-04C 业务实现 | COMPLETE | [04_DEV.md §2](04_DEV.md#2-迁移顺序) | 各切片已实现，正式放行依 PH-06 证据。 |
| PH-05 测试设计 | COMPLETE | [05_TEST_PLAN.md](05_TEST_PLAN.md) | v0.6 模式 B，CASE-01–10 已纳入 Pi 补测和修复回归。 |
| PH-06 测试与修复 | COMPLETE | [06_TEST_REPORT.md](06_TEST_REPORT.md) | 完成独立审查处置、全量回归、目标宿主双画布和最终归档实测。 |
| PH-07 Close | COMPLETE | [Close.md](Close.md) | 逐项对账 FR-01–09 与两轮审查 F-1–F-10。 |
| PH-08 归档与回流 | COMPLETE | [归档清单](ARCHIVE_MANIFEST.json) | 整体归档并保全两轮审查原文、测试报告与关键运行证据，当前链接已同步。 |

## 文档版本

| 文档 | 版本与日期 | 权威内容 |
| --- | --- | --- |
| `01_PRD.md` | v1.3 · 2026-11-21 | 目标、场景、FR-01–09、验收口径、范围外、对象关系、流程状态、决策与未决 |
| `02_UI_UX.md` | 草案 · 2026-11-21 | 页面与操作、状态清单、文案语言、键盘无障碍、FR-07 对照方法 |
| `03_TECH.md` | 草案 · 2026-11-21 | 官方版本、目录、接口数据流、失败边界、决策、风险回退、切片 |
| `04_DEV.md` | 草案 · 2026-11-21 | 实施基线、七步迁移、完成定义、官方复用、本地入口与约束 |
| `05_TEST_PLAN.md` | v0.6 · 2026-11-21 | 环境夹具、CASE-01–10、失败分支与独立审查补测 |
| `06_TEST_REPORT.md` | 2026-11-21 | 原验收、Pi 审查、修复后复验、构件和未覆盖条件 |
| `Close.md` | 2026-11-21 | 关闭矩阵、复用回流和后续验证边界 |

## 基线与决定

- 静态对账 HEAD 为 `4c0cf4de91375f9eeb82997eee3aaa3bf99049b2`。工作树包含本轮迁移及原有并行文档改动。新构建入口为 `extension/frontend-entry.ts`。 [当前入口](../../../../extension/frontend-entry.ts) · [当前依赖](../../../../frontend/package.json)
- 正式验收组合是 ComfyUI `v0.46.0` / Frontend `1.59.6`。仓库记录的 `0.45.0` / `1.59.1` 属历史基线。 [历史验证](../../../../docs/development.md)
- 工具链：本机 Node `v26.13.1` 满足官方 `>=26.8.2 <27`；CI 已由 Node 22 提升到 `26.13.1`，pnpm 保持 `11.13.1`，待 CI 复跑。见 [D-02](03_TECH.md#6-决策记录)。
- 素材页入口已定（2026-11-21）：保留 Assets 标签，内容为 Vue 占位页，无数据请求；默认落点不变。见 `Q-01` / `D-01`。
- FR-06 验收到绘图工作流恢复和临时 PNG `[temp]` 引用提交；既存后端 `LoadImage` 故障由独立工作处理。FR-05 仍要求 Siril 正式队列与 FITS 输出验收。
- 官方公开接口和现有 Vue 移植件优先；新增移植需记录上游标签、路径、许可、本地差异及验证。Siril 专属实现进入 Bundle，设备与光路业务留在资料库页面。

## 最近一次测试适用范围

迁移前实际界面截图及旧工作流已保存在 `.artifact/frontend-migration/baseline/`。Vite 空 Bundle 候选、完整候选构建、整套 Vue 类型检查已有本地证据；迁移后的正式回归按 PH-06 报告记录。

## 阻塞与解除

| 编号 | 阻塞 | 影响 | 解除方式 |
| --- | --- | --- | --- |
| B-01 | ~~素材页标签与默认落点未决~~ **已解除（2026-11-21）** | — | 决定：保留标签 + Vue 占位页，默认落点不变；已同步 PRD、UX、TECH、DEV、CASE-10 |
| B-02 | 目标宿主已安装并采集主要迁移前基线 | 步骤 0、FR-07、全部宿主用例 | 隔离宿主版本、基线及真实运行结果见 DEV §6 和测试报告 |
| B-03 | ~~CI Node 22 与官方工具链范围不一致~~ **已处理** | — | 已提到 `26.13.1`；**待项**：CI 实际复跑安装、类型检查、lint、Vitest 与构建并记入报告 |
| B-04 | `@comfyorg/comfyui-frontend-types` 无 `1.59.6`（`1.59.1` 后直接到 `1.60.0`，`latest` 标签停在 `1.57.6`） | FR-01、FR-09 的编译依据 | 维持 `1.59.1` + 逐符号对照官方 `v1.59.6`；不默认改用 `1.60.0` |

B-01 与 B-03 已解除；B-02 已通过隔离目标宿主验证解除；B-04 只影响编译依据，不阻塞文档与结构工作。

## 接续

执行证据见 [测试报告](06_TEST_REPORT.md)，实现偏差见 [DEV 实际实现](04_DEV.md#6-实施回写2026-11-21)。远程 CI、跨卷和下游 IMAGE 的适用范围见 [关闭记录](Close.md)。

最新决定：Q-01 保留 Assets 标签 + Vue 占位页（2026-11-21）；Q-02 CI Node 提升到 `26.13.1`（待 CI 复跑）；B-04 已确认无 `1.59.6` 类型包。

**实现启动提示词：[references/04C-implementation-prompt.md](references/04C-implementation-prompt.md)。** 交给实现 Agent 前先确认已授权 PH-04C；提示词内含基线、偏离回写、测试新增与重试记录规则。本轮查缺补漏补齐：PRD 的对象关系/流程状态/决策章节，UI 的状态清单与键盘无障碍，TECH 的决策记录、风险回退与切片映射，DEV 的环境事实与完成定义，TEST 的版本与质量门；并修正工具链记录（原“本机 Node 20.17.0”已过期）。

早期 `PRD.md`、`Tech.md`、`Implement.md` 已迁至对应编号文件；PRD 正文与原有官方片段保留，交互基线与预计测试从现有需求和计划展开。
