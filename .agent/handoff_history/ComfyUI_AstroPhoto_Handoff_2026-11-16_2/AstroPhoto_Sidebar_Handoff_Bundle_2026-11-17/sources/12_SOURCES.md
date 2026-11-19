# 来源、定位与可信边界

## 本轮重新打开的官方资料

以本地已安装版本/API签名和实测为先；官网为滚动文档，不能代替当前宿主通过证据。

| 来源 | 本轮用途 |
| --- | --- |
| [ComfyUI V3](https://docs.comfy.org/custom-nodes/v3_migration) | V3入口/Schema/执行契约，另核本地0.45.0 loader |
| [ComfyUI routes](https://docs.comfy.org/development/comfyui-server/comms_routes) | 原生状态与object_info、prompt与画布职责 |
| [Registry publishing](https://docs.comfy.org/registry/publishing) | 官方打包机制；本地comfy-cli1.26.0实际构建 |
| [FastMCP Skills](https://gofastmcp.com/docs/servers/skills) | 4.2 Provider导入与Skill分发；本地4.2.0实际import |
| [FastMCP Testing](https://gofastmcp.com/docs/servers/testing) | 内存Client验证方式；项目用asyncio.run，不因此强加pytest-asyncio |
| [FastMCP Client](https://gofastmcp.com/docs/clients/client) | 内存与stdio调用，实际legacy参数以本地签名和测试为准 |
| [uv workspace](https://docs.astral.sh/uv/concepts/projects/workspaces/) | 共享lock、本地member、Python交集，不等于Host环境 |
| [Frontend1.59.1迁移](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md) | 对应Tag的PrimeVue迁移资料；本次网页呈现主要为GitHub页框架，不据此声称完整文档抓取或宿主UI验证 |

本地签名原样记录在 `evidence/dev-versions-api.txt`：FastMCP构造含on_duplicate，Client含mode/auto_initialize，SkillsDirectoryProvider(roots, reload=False)，run含transport/show_banner。4.2.0的Requires-Python实际为>=3.11。

宿主定位：`C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/comfyui_version.py:3`为0.45.0；host `nodes.py:2316`开始V3入口分支，:2329 on_load、:2330 get_node_list、:2336 GET_SCHEMA；host `server.py:774` system_stats、:905 object_info/{node_class}。节点缺失返回200空对象，而非项目自行假定404。

## 原始资料审计方式

原包00/06先读，随后01/02/03/04/05及07/08/09/MANIFEST；原包明确不是仓库审计，不能把其中用户报告判定为已测事实。references中的旧V1、Skill Catalog示例、Pydantic配置和三DB示意只作历史/规划对照。原文件哈希留存，本轮未修改。新的完整需求取自审计修订后的仓库需求，而不是无检查复制旧交接。

本包不声称独立验证所有未来技术（SQLAlchemy、Astropy、LangChain、sqlite-vec、Siril/PixInsight）。对应接口/许可证/ABI仍需实施时核验。项目内CodeGraph数据库、第三方reference、开发技能不能作为业务功能已经存在的证明。

## 证据可复现性

`evidence/repository-files.txt`为开发项目文件清单（排除reference历史包和生成/忽略环境），`source-hashes.json`覆盖非文档配置/源码/测试；`git-before.txt`保留既有工作树状态，`git-after.txt`用于交付对照。测试日志按命令分类，失败与跳过不删除。

历史Hatchling1.33.0、SDK1.30旧Client与宿主3.12.4隔离安装来自先前记录；本轮未重跑这些精确场景。不能用本轮3.12.15 wheel安装替代宿主环境包兼容证明。当前开发/安装依赖版本已查询，不应沿用历史表格而不核对。
