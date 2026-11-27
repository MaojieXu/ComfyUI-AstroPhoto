# 文档导航

这些文档描述当前产品范围、架构、领域规则及开发流程。已实现、规划、历史和未验证的内容以各文说明为准；旧测试只证明对应环境及范围。Feature 的需求、开发记录和验收证据保留在 `.agents/features/`，已关闭记录在 `.agents/features/archive/`。

## 按任务查找

- [产品需求与范围](product/requirements.md)：目标、当前能力和规划。
- [系统架构](architecture/overview.md)：宿主、前端、后端和 MCP 边界。
- 架构调查：[现状报告](architecture/review-2026-11-27.md)和[边界与契约专项](architecture/boundaries-contracts-assessment-2026-11-27.md)，记录调查时的证据、结论和验证范围。
- [接口参考](api/README.md)：HTTP 路由、MCP 工具 Schema 和信任边界。
- [MCP 集成](integrations/mcp.md)：连接、工具发现和 Agent 联调。
- [开发与验证](development/setup-and-testing.md)：环境、构建、测试及联调。
- [双包发布](development/publishing.md)：Extension 与 MCP 的打包和发行。

## 领域

- [存储](domains/storage.md)：数据根、工作区、文件保护和恢复。
- [设备](domains/equipment.md)：设备、组合和快照。
- [素材](domains/assets.md)：导入、项目、校准和注销。
- [Siril](domains/siril.md)：外部软件与科学处理。

长期契约变化应更新相关领域文档；具体需求修订、开发、测试和知识候选按 [feature-pipeline](../.agents/skills/feature-pipeline/SKILL.md) 记录。历史结果不自动证明当前工作树已通过验证。
