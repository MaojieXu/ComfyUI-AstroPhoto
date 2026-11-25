# 文档内容核查矩阵

chat1 · 2026-11-25T08:30:12-06:00。范围为现有 docs 文档；工作树包含既有未提交修改，归档为历史范围证据。核查是源码、测试和归档的定向对照，不等同所有硬件及外部程序行为实测。

| 文档 / 章节 | 对照依据 | 处理 / 余项 |
| --- | --- | --- |
| README 导航：按任务、领域 | docs 实际目录、AGENTS、feature-pipeline 入口 | 相对路径与锚点检查通过。 |
| 产品：状态、目标、范围、FR-01～08 | 前端 AssetsPanel、扩展入口、MCP disclosure、Feature 归档 PRD | 侧栏、业务 Skill、信任边界按当前代码修正；观测地、知识、记忆、实验、画布桥接保持规划；具体未来实现不是已验收。 |
| 产品：安装、安全、测试、优先级、工程问题、资料 | pyproject、发布脚本、MCP/存储实现及 docs 测试入口 | 区分本机 MCP 直接操作和界面确认；计划和工程问题保持目标/待验证。 |
| 架构：模块、V3、存储、前端 | __init__.py、bootstrap.py、frontend/src/main.ts、storage/locations.py | 默认工作区修正为 storage/Local；保留宿主和业务边界。 |
| 架构：领域规划、MCP、目录模型、验证、Siril | 领域模型和迁移、MCP server、Siril bundle、归档 TEST_REPORT | 代码与历史验证分开；旧迁移仅描述数据演进，不作为所有现有业务入口。完整 IMAGE 宿主路径需复验。 |
| 存储：初始化、导入、工作区、迁移、恢复 | storage/initializer.py、locations.py、data_root.py、api/security.py；初始化/素材归档 | 清理旧矩阵，保留文件所有权、路径保护与故障恢复；真实第二物理卷测试跳过。 |
| 设备：规则、SQLite、HTTP、验证 | equipment/service.py、trains.py、api/equipment.py、database/manager.py | 版本字段与内部并发区分；旧实施与验收流水已移除。 |
| 素材：导入、项目、校准、接口、验证 | assets/catalog.py、api/catalog.py、tests/backend/test_agent_direct_rules.py、素材归档 | 注销与文件删除区分；旧集合来源节点仍注册，旧接口支持边界不假定完全移除。 |
| Siril：目录、路径、接口、用户流程、实现、软件、验证 | extension/siril/command_table.py、node.py、software.py、session.py、tests/nodes/test_registration.py、tests/integration/test_siril_api.py | 201 条命令 / 183 节点定向测试有覆盖；真实 Siril、平台及全部命令未逐个运行，保留验证边界。 |
| MCP：连接、发现、Skill、工具、权限、验证 | mcp/src/astrophoto_mcp/server.py、disclosure.py、target.py、tools/、mcp/tests/test_disclosure.py、Agent 归档 | 六类/三入口测试通过；明确本机可信边界与非回环限制。真实 Desktop 端口锁未实测。 |
| 开发：布局、环境、命令、测试、宿主、构建、数据根、Pi | package.json、pyproject.toml、.github/workflows、benchmark/checks、初始化实现 | 更新 Local 路径、预览目录准备、删除不存在的交接引用；宿主、Pi、Manager 当前环境未运行。 |
| 发布：版本、包边界、CI、公共索引、Siril | scripts/release.py、pyproject、.github/workflows/release.yml | PyPI 404 是历史事实，当前发布状态须另查；真实发行和 Manager 未执行。 |

## 局部验证

- 存储、设备及素材后端：53 passed，2 skipped；代码中的跳过条件要求第二本地卷。
- 节点注册与 Siril API：3 passed；使用测试替身/测试环境，不能替代真实宿主和 Siril 处理。
- MCP 发现与设备：24 passed；不代表真实 Desktop 端口锁已验证。
- 用户明确本次不做实际 Agent 行为联调；保留静态导航检查结果，不宣称行为通过。

## 仍需单独验证

文档涉及大量业务分支、外部硬件和历史兼容；上表完成章节级入口与关键规则对照，不声称对每个参数、路径和平台组合穷尽实测。需要目标环境时执行相应测试，不将历史结果冒充本轮结果。公共 PyPI 和 Manager 当前状态未查询。
