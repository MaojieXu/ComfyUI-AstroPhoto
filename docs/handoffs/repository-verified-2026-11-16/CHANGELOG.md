# 本次校准变更

本轮没有新增/修改应用源码、测试实现、依赖、CI或宿主配置。构建检查会重生成 js 与 dist；源码哈希检查用于检测审计期间意外漂移。

- 完整核对历史00–09的当前状态、目标目录、版本、工具/Skill、ADR和验收要求，原件不修改；原件哈希与工作树清单留证。
- `docs/requirements.md`：修正残留V1表格/根入口注释、Python>=3.10、唯一Catalog Provider描述、数据库示意路径；明确版本握手为计划、真实字段api_version；保留全部FR及33候选Skills。
- `docs/architecture.md`：区分locales打包与真实宿主发现；补当前dataclass配置、无业务Service、能力字段等实际边界。
- `docs/development.md`：补本轮3.12/3.11测试数量、宿主重现失败、警告与检查范围，记录Ruff Hook差异及mypy未启用。
- `docs/mcp.md`：明确本轮与先前SDK1.30/3.12.4隔离安装记录；无运行时握手、无产品Skills、无第二Web服务；间接Uvicorn不等于项目启用它。
- `docs/publishing.md`：补实际包清单/安装/404、Manager与外部环境边界、Hatchling隔离构建版本未锁死、远程流程未运行。
- AGENTS.md 当前规则准确，未为任务日志修改。原始 `.artifact/` 和 `reference/` 原样保留。
- 新增本包索引、主题文档、双向矩阵、证据日志、FULL与ZIP；task-notes完成后归档。

新增发现不等于本轮新实现：Core/Status、V3、Python3.12、前端自带依赖与typecheck、FastMCP模块化和打包修复均已在审计开始前存在。本轮贡献是证据校准和文档纠错。
