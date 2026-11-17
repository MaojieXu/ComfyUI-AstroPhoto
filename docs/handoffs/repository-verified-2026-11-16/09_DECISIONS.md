# 决策校准

这里的 VERIFIED 只指相应工程事实；未来设计保持 PLANNED。历史 ADR ID 来自原 06 决策日志。

| ADR | 结果 | 状态/行动 |
| --- | --- | --- |
| 01/02 单仓双包、Lockstep | 根版本0.0.1、本地 workspace、同版依赖、Tag检查、双包隔离已有 | VERIFIED 本地；发布流程 PARTIAL；运行时握手 PLANNED |
| 03 宿主管图与执行 | 没有另建 DAG/Canvas 引擎；原生 DOM Widget 与节点 | VERIFIED 源码；完整宿主体验未验收 |
| 04 Domain-first | astrophoto Core/API/Bootstrap 已有，无业务空包 | VERIFIED；未来领域仍 PLANNED |
| 05 V3 唯一标准 | 当前根入口只导出 V3 和 WEB_DIRECTORY | VERIFIED 隔离；历史 V1 说明 OBSOLETE |
| 06 原生 aiohttp | on_load 注册 PromptServer 路由，无第二服务器 | VERIFIED 独立 HTTP；实际宿主未验证 |
| 07 FastMCP4.2 单 Server | tools/status 注册到唯一工厂，stdio、HTTPX | VERIFIED；九领域/三层发现仅是后续组织方向 |
| 08 三 DB | assets/knowledge/memory 未来分库 | PLANNED；不创建数据库以满足目录图 |
| 09 科学数据 | 默认保留原数据与 Header | PLANNED；PNG/IMAGE 适配不能证明 FITS |
| 10 软件 Adapter | Registry+Runner+per-software Adapter | PLANNED；无 Siril/PixInsight 执行 |
| 11 Bridge+Receipt | /prompt 不等于修改在线 Canvas | PLANNED；无 canvas Tool |
| 12 独立 User Memory | Extension 持有，用户授权，分清 actor | PLANNED；不以 task-notes 代替 |
| 13 Skills Wheel | 当前 SkillsDirectoryProvider 条件接线，有效业务 Skill 才发行 | PARTIAL 接线，产品 Skills PLANNED/零个；Catalog 是可选 API，不是唯一合法 API |
| 14 Python3.12 | .python-version与独立.venv已落实，旧环境保留 | VERIFIED；“尚未迁移” OBSOLETE，最低3.11未提升 |
| 15 先基础不扩业务 | 基础实现/验证已做，宿主/发布验收仍缺 | PARTIAL 总验收；下一 Agent 不重复重构 |

新增工程决策：配置采用标准库 frozen dataclass/tomllib；状态请求时读真实宿主注册表，避免 on_load 时机误报；路由按 RouteTableDef 去重并拒绝异主；前端自带 Vue/PrimeVue/Aura/i18n，不依赖宿主插件；comfy:app/api 构建后固定宿主 URL；Registry 暂存时替换 ./mcp，源码保留本地开发；测试三个独立入口，根集中跨组件与发行检查。

没有取消 Assets、Memory、RAG、软件 Adapter、实验或33候选 Skill。没有引入 Pydantic Core 配置、SQLAlchemy 空模型、Redis、LangGraph 或 Subagent 编排器。没有因文档审计改业务实现。
