# 双向证据矩阵

历史文件缩写 H00–H09 对应原包数字前缀。C01–C15 是历史06冲突编号。行号相对仓库根；测试结果来自本轮07及evidence日志。VERIFIED仅限列明范围，不向宿主运行泛化。

## 历史 → 当前

| ID/历史陈述 | 当前结论与状态 | 文件/函数/API证据 | 测试或查询 | 修订/后续 |
| --- | --- | --- | --- | --- |
| C01/H00/06 已报告V3，旧稿V1 | VERIFIED 当前V3；旧稿OBSOLETE；真实加载IMPLEMENTED_UNVERIFIED | `__init__.py:11` AstroPhotoExtension、:23 entrypoint；`nodes/ComfyUIFEExampleVueBasic.py:6` | root22通过1跳过；host-start失败 | 不再依据用户报告判V3；以当前类/入口为证，保留宿主验收 |
| C02/H06 Directory/Catalog冲突 | VERIFIED Directory合法且条件接线；业务Skills PLANNED | `mcp/src/astrophoto_mcp/server.py:7,16,22` | 本地4.2签名导入及无效Skill测试 | Catalog也是官方选项，不要求替换工厂；修需求中唯一Catalog措辞 |
| C03/H03 Manager强制升级 | PARTIAL 发行同版pin；运行握手PLANNED，Manager实际安装UNKNOWN | `pyproject.toml:16`、`mcp/src/astrophoto_mcp/api/comfy.py:6` | 版本/打包通过，未跑Manager | 独立环境与已运行进程需单独升级/重启 |
| C04/H03 ./mcp发行冲突 | VERIFIED 暂存已修复 | `scripts/release.py:107` build_registry，:124写PyPI pin | Registry21文件、检查通过 | 源码继续本地依赖，不能根目录直接publish；PyPI404阻塞仍在 |
| C05/H03 uv.lock控制Manager | OBSOLETE 假设；VERIFIED workspace仅开发 | 根pyproject tool.uv.workspace/sources，根uv.lock | uv lock --check115包 | 不在宿主sync，不声称Manager消费uv.lock |
| C06/H03 3.13开发尚未迁移 | OBSOLETE；VERIFIED 默认3.12.15 | `.python-version:1`、`.venv/pyvenv.cfg`，旧备份cfg | dev版本与3.11/3.12测试日志 | 保留最低>=3.11，不重复迁环境 |
| C07/H03 PrimeVue需检查 | VERIFIED 独立初始化/打包；宿主兼容IMPLEMENTED_UNVERIFIED | `frontend/src/main.ts:24,29,31,35` | Chromium6、typecheck通过 | Vue/PrimeVue/Aura/i18n自带，类型peer例外单列 |
| C08/H05 工程完成度未知/owner限制 | VERIFIED 本地测试配置与执行；远程CI UNKNOWN | `.github/workflows/ci.yml` 无owner条件，release.yml顺序 | root22/MCP52/browser6，YAML审查 | 不保留“无测试/仍owner限制”说法；不能称云端CI已跑 |
| C09/H06 三DB创建时机 | VERIFIED 当前不创建；业务PLANNED | `astrophoto/core/paths.py:10`、config:19、capabilities:9 | core路径/无创建测试 | 默认根已实现；三库与目录初始化不在当前版本 |
| C10/H04 33Skills | PLANNED 候选33，当前0 | MCP源码清单、server:22条件 | resources空、包14文件无Skills | 保留完整候选表，不制造可执行Skill |
| C11/H06 Tool Search=Node Search | PLANNED 自有node_search，无实际Tool | `mcp/src/astrophoto_mcp/tools/status.py:11`仅两个 | list_tools精确集合断言 | ComfyUI节点发现未来基于object_info，不混淆MCP工具列表 |
| C12/H06 多用户认证 | PLANNED；当前缺此机制 | `astrophoto/api/status.py:9`状态返回；无身份服务 | 不存在用户隔离测试 | Future Assets/Memory上线前设计认证；当前不承诺远程安全边界 |
| C13/H06 prompt=画布 | OBSOLETE等价假设，Bridge PLANNED | 当前无canvas/broker/tool；官方routes | 本轮未运行prompt或CanvasBridge | 保留目标session/revision/receipt，不宣称能改当前图 |
| C14/H06 PNG=科学FITS | OBSOLETE外推，科学类型PLANNED | `nodes/ComfyUIFEExampleVueBasic.py:24`委托LoadImage | sentinel委托测试，不是真FITS/tensor | Astropy、科学引用类型及精度测试未来增量实现 |
| C15/H06 Tool visibility动态隐藏Python节点 | PLANNED可用性设计，非当前能力 | MCP单工厂；唯一节点列表 | 当前仅vue-basic | 不通过MCP visibility改变宿主注册；保持已保存节点类型 |
| H02 Core配置Pydantic示例 | OBSOLETE作为当前描述 | `astrophoto/core/config.py:12` frozen dataclass/tomllib | config测试通过 | 轻量标准库实现；Pydantic只作为未来Schema选型/间接依赖 |
| H02 service/api_version示例 | VERIFIED 实际extension/api_version/runtime/data_home/capabilities | `astrophoto/api/status.py:9` | 真实aiohttp TestClient两项 | 示例service不是现有响应；api_schema_version也是旧候选名 |
| H03 尚无typescript/vue-tsc，types1.22.1 | OBSOLETE | frontend/package.json与pnpm锁：TS5.9.3/vue-tsc3.3.14/types1.59.1 | 独立typecheck通过 | 保留Vite≠类型检查；tests不在vue-tsc范围 |
| H04 扁平MCP只有server/client | OBSOLETE 文件清单 | `config.py:11`、`api/comfy.py:6`、`tools/status.py:11` | MCP52 | 记录领域拆分已完成，不重复重构 |
| H05 当前标准化P0待做 | PARTIAL 整体验收；多项实现VERIFIED | Core/V3/Frontend/包文件与07 | 独立检查通过；宿主失败 | 下一轮先宿主验收/风险，不再按旧Prompt新建模块 |
| H03 Hatchling1.33.0 | UNKNOWN 本轮隔离构建精确版本 | mcp/pyproject build-system `>=1.27,<2`；uv.lock不含hatchling | uv build成功，无本轮精确版本输出 | 历史1.33.0仅历史观测，不能当当前锁版本 |

## 当前 → 历史遗漏

| ID/新增事实 | 状态 | 源码与证据 | 历史缺口/修订行动 |
| --- | --- | --- | --- |
| N01 路由在on_load组装，请求时查询节点注册 | VERIFIED 隔离 | `__init__.py:12`、status:10；host nodes.py:2329–2336静态源；HTTP测试 | 不能在on_load尚未get_node_list时标节点ready |
| N02 幂等注册/异主冲突/多server隔离 | VERIFIED | `astrophoto/api/routes.py:11`；integration两项 | 新增Runtime注入与错误边界说明，不靠全局bool |
| N03 unavailable能力与路径验证 | VERIFIED | capabilities:9；paths:15；root测试 | 精确列storage/assets/software/processing/knowledge/memory/experiments/canvas_bridge |
| N04 frontend构建固定宿主imports、CSS路径、onRemove | VERIFIED 构建/浏览器 | `frontend/vite.config.mts` output.paths；main:14,35；packaging URL测试 | 增补反代前缀与独立Vue生命周期 |
| N05 TouchEvent路径与真像素测试 | VERIFIED Chromium | DrawingBoard.vue触摸处理；DrawingApp.test.ts三例 | 历史仅泛称Canvas；现在测试使用真实浏览器API、宿主API仍mock |
| N06 outputSchema兼容与输入Schema小差异 | VERIFIED | `tools/status.py:12,19`、`mcp/tests/test_server.py:19`、fixtures/status_contract.json | 输出保持；输入移除title/禁多余字段，不能说字节级完全相同 |
| N07 raw stdio无噪声与legacy模式 | VERIFIED | `mcp/tests/test_server.py:93,108`；check_install.py:12 | 自动Client协商不一定是initialize；独立验证传统握手 |
| N08 真实host Torch阻塞 | VERIFIED 失败 | evidence/host-start.txt；host Python3.12.4，Torch metadata2.3.0 | 从“宿主待验证”升级为具体可复现失败，不能替用户升级 |
| N09 packaging防泄漏/临时Git暂存 | VERIFIED | release.py:70,81,107,135；packaging7通过 | 包含astrophoto，排除artifact/notes/db，pin在暂存改写 |
| N10 中文tooltip缺键 | VERIFIED | locales/zh/main.json；frontend-tests日志 | 新问题，写入风险，未改翻译代码 |
| N11 上传响应检查和Canvas恢复缺口 | PARTIAL/UNKNOWN | VueExampleComponent.vue:24,48,60；serialization两项测试 | 错误码/响应shape/重开测试不足，不能把上传mock成功写成全部通过 |
| N12 开发工具配置冲突 | CONFLICT | pre-commit Ruff0.4.9 vs uv0.17.5；pyproject mypy无CI | 文档补检查边界，源码/配置不在本次改动范围 |
| N13 需求文档内部V1/Python3.10残留 | OBSOLETE并已修订 | docs/requirements第7/8/9节；当前V3/metadata | 不只修历史包，也修仓库长期文档；所有长期FR保留 |
| N14 同宿主主版本但独立环境 | VERIFIED | dev-versions-api、host-versions、py311日志 | dev3.12.15不等于host3.12.4，同版本不是同环境 |

## 长期需求保全核对

H01 FR01→当前基础状态PARTIAL；FR02设备/资产/校准/地点→PLANNED；FR03软件/科学数据→PLANNED；FR04节点目录/Bridge/Workflow→PLANNED；FR05 RAG→PLANNED；FR06授权Memory→PLANNED；FR07实验/Subagent→PLANNED；FR08产品Skills→PLANNED。完整细节在02而非从当前状态章节删除。

H01六个验收故事（M31导入、Siril校准叠加、Agent画布、HOO偏好、知识问答、长周期Coding）分别保留为未来业务验收与已落地开发记录机制；不把开发task-notes当作Memory实现。H04的33个候选、L0/L1/L2、手工Skills安装后备方案均保留为设计。历史示例中的未实现函数、路径、DB表不纳入实际文件树。


## 教程示例与实际接口的额外区别

references中的 `database_path()`、`ensure_database_dir()`、`register_model_paths()`、`get_node_classes()` 都未实现；不能从教学代码推导当前可调用函数。实际 `data_home(environ=None)` 拒绝相对/空/空字节路径，不是示例的静默默认或 resolve()；实际 `register_routes(routes, runtime)` 需要显式注入，根入口在on_load调用而非import阶段调用。Skills讨论稿的无条件Provider创建被当前工厂的真实SKILL.md存在检查取代。上述为OBSOLETE示例/PLANNED能力，未新增同名占位接口。
