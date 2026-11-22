---
task: 04-photography-library
status: handoff
updated: 2026-11-21
---

## Goal

按 01_PRD.md 尾部 v0.7 和 AstroPhoto_Assets_UI_UX_v1.0.md 开发素材库，覆盖 UI、SQLite、导入、Source、主动收录和 FastMCP 双入口。保留已确认基线原文。

## Progress

- 同一活动 Feature 已完成技术设计、实现记录、测试规格、实测报告及 PH-07 PARTIAL。
- 当前源码含 Copy 流式暂存、Reference 独立资产身份、计划冻结、终态重试、Project/Collection/Session/Calibration、独占受管文件保护、Asset/Collection Source、主动收录及浏览器确认的 FastMCP。
- 树和 Module 已做专项对账，Core 及各 Module 均在 20 Markdown 文件上限内。

## Verified

- main@f84442be5f16dd36f6cfff85a686ce30027dd383 加实际工作树。工作树并行包含 Storage、Nodes 和 Siril 其它开发。
- Python / HTTP / 节点 / 包回归 107 passed、4 skipped、1 deselected。Chromium 74 passed。FastMCP 4.2.0 包 92 passed，真实 Client 到 aiohttp/SQLite 的测试另通过。
- 真实 ComfyUI host 通过 Reference、浏览器 Copy、跨 Tab、V3 Asset/Collection 和 Siril Inspector 主动收录。2.5 GiB 合成文件通过本机真实 aiohttp 传输和源／目标 SHA-256 核对。
- 证据和派生决策在活动 Feature 的 06_TEST_REPORT.md 和 Close.md。两套隔离宿主已停止，临时 junction 已解除。

## Decisions

- 普通浏览器 Reference 使用受信服务端路径降级。Copy 采用原生文件选择和独立二进制传输。
- 受信浏览器执行敏感 Agent 提案。FastMCP 单独凭据与设备只读凭据分开。

## Blockers

- 实际 ComfyUI 进程中的附加 MCP stdio／审批测试因自动命令审查拒绝携带临时凭据启动隔离宿主而未执行。
- 大目录浏览器全流程、200% 缩放与完整辅助技术矩阵、独立界面 Agent 推荐与单文件移动／覆盖仍记录在 Close。

## Next

- 在相应宿主和批准的权限条件明确后，用冻结基线补跑对应集成与可用性验收。PH-08 保持待定。

## UI 样式适配补充（2026-11-21）
- 依据官方 Frontend 1.59.6 的素材工具栏、设置 Popover、空状态及既有 SingleSelect 做适配；`04_DEV.md` 记录源码与限制。
- Chromium AssetsLibrary 9 passed，typecheck、lint、build、check:build、check:proxy 通过。隔离宿主 `127.0.0.1:18469` 观察空库及设置弹层；测试数据为空，未覆盖有素材和全部辅助技术。
- 保持整体 Feature PARTIAL；后续按 Close 完成剩余验收。

## 筛选入口调整（2026-11-21）
- 搜索旁新增筛选图标；选项基于未过滤的全部分页素材和关系实际值，空库无选项，失败可重试。大库分页成本待验证。
- Chromium AssetsLibrary 12 passed；typecheck、lint、build、check:build、check:proxy 通过。隔离宿主观察空库弹层，非空实际宿主未验证。
