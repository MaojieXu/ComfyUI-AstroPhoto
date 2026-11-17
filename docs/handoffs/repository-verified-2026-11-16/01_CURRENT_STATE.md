# 当前状态

## 结论

| 范围 | 状态 | 当前事实/边界 |
| --- | --- | --- |
| Extension/MCP 版本及本地构建 | VERIFIED | 0.0.1，单 uv workspace，包内容隔离 |
| V3 入口与 IMAGE 适配 | VERIFIED | 入口/Schema/委托单元测试；使用 V3 和 LoadImage 替身，不是实际 tensor 执行 |
| 真实宿主 V3、Status、完整 UI 工作流 | IMPLEMENTED_UNVERIFIED | ComfyUI 启动在插件加载前失败，不能验收 |
| Core/Bootstrap/HTTP Status | VERIFIED | 配置/路径/能力、真实 aiohttp TestServer 测试通过；宿主边界为替身 |
| Frontend | PARTIAL | 真 Chromium Canvas、Widget、上传序列化和独立样式通过；完整宿主保存/重开/IMAGE 未验证 |
| MCP | VERIFIED | 仅 version、connection_status；内存 Client、MockTransport、真实 stdio、独立安装通过 |
| FR-01 全面能力发现 | PARTIAL | 有基础状态，无版本握手、软件检测、前端在线/多用户身份协议 |
| Assets/Software/Processing/Knowledge/Memory/Experiments/Bridge | PLANNED | 没有业务实现、数据库或假 Tool |
| 产品 Skills | PLANNED | 零个；仅有工厂条件接入 Provider，33 个是候选 |
| 发布 | PARTIAL | 本地双包验证通过；公共 PyPI 0.0.1 返回 404，未执行任何真实发布 |

具体函数/行号、历史差异与行动逐项见 `11_RECONCILIATION.md`；测试命令见 `07_TEST_EVIDENCE.md`。

## 工作树与 Agent 基础

分支 main；HEAD 为 `06961eebe42674714dc2992b0a9de654b3a5a566`（提交时间 2026-11-16T18:04:37-06:00）。Git 状态见 `evidence/git-before.txt`：旧根 src/package/Vite 文件删除、monorepo 目录未跟踪、根 init/metadata/js 修改均早于本审计。用户 `doc/img.png` 删除也保留，不恢复或提交。

`.codegraph/` 存在且已实际调用 CodeGraph 探查；包含大体积数据库及 daemon 状态文件，索引还包括 reference。SQLite 索引是开发工具数据，**不是 AstroPhoto 业务数据库**。不因文件存在声称 daemon 永久健康或索引完整。

`.agents/skills/` 有 task-notes 和九个 comfyui-node-* 开发 Skill（advanced/basics/datatypes/frontend/inputs/lifecycle/migration/outputs/packaging）。它们不属于产品 MCP Skills，也不进入发行包。活动历史记录包括 architecture-migration、backend-standardization；本任务记录为 handoff-reconciliation，完成后归档。CodeGraph、notes、reference、.artifact 都是开发/历史资料。

## 实际最小运行面

一个节点 `vue-basic`；一个 Widget ID `CUSTOM_VUE_COMPONENT_BASIC`；一个 Extension 路由 `GET /astrophoto/v1/status`；两个 MCP Tools。没有天文工作流执行 Tool、数据库、外部软件进程管理器、第二个 Web Server 或内部 Agent Harness。

状态 API 的 `ok` 只说明路由与节点注册，不能证明画板在线、PNG 已上传或工作流执行成功。已有测试不会自动启动 ComfyUI；真实宿主测试只在指定 `COMFYUI_TEST_URL` 时运行。
