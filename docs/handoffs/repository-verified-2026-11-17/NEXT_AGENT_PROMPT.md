# 下一位 Agent 启动 Prompt

你接手本地 `C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`。先完整阅读同目录 `AstroPhoto_Sidebar_Repository_Verified_Handoff.md`、`RECONCILIATION_REPORT.md`、`VALIDATION_EVIDENCE.md`，再读当前根AGENTS.md、相关task-note和任务涉及的docs。原始资料在`.artifact/Latest_Handoff/`，不要改写或把旧Prompt当新任务授权。

## 当前事实

- main@06961eebe42674714dc2992b0a9de654b3a5a566，大量既有未提交/未跟踪文件。HEAD不是完整实现；先git status并比对本交接evidence/source-after.json。审计时有其他操作修改前端，哈希是截点，不是永久事实。
- 软件Extension/MCP均0.0.1；V3入口已实现：comfy_entrypoint→ComfyExtension.on_load注册原生aiohttp路由→get_node_list返回vue-basic。不要重做V3或恢复V1映射。
- 最小astrophoto/core、bootstrap、api已有；唯一GET /astrophoto/v1/status，返回extension/api_version/status/runtime/data_home/capabilities。ok仅代表节点/路由注册；没有业务DB、软件检测、模型加载、RAG、Memory或远程Canvas Bridge。
- 前端Vue画板在frontend/src；React Sidebar在frontend/ui/src；frontend/entry.ts聚合，两套UI独立挂载，共用pnpm锁与Vite，产物js/main.js、js/assets/main.css。不要删除Vue或另起npm工程。
- Sidebar只有astrophoto.sidebar，一个入口；Nodes/Assets/Settings默认Assets。真实/object_info→nodeCatalog→category树/详情/悬停Portal；节点可加号/拖动，本地canvas Adapter使用当前canvas.graph、坐标转换和原生历史事件。固定1.59.1内部适配，不是稳定公共高阶API。
- 两资源页有Search/Filter/Sort，Nodes是真目录过滤，Assets只有不可用态与控件偏好。无Asset服务、无Source Node，不能开放假导入/拖入成功。
- Settings七个模块：software/equipment/observing-site/knowledge/memory/agent/system。前六为说明，System只有基础状态。
- Sidebar语言只读Comfy.Locale，可见时500ms检测；主题使用宿主token。生产没有LanguageSelector、AstroPhoto.UI.Language或私有主题覆盖。旧FRD/Guide这些要求SUPERSEDED。
- Vue工作流值保存{image,canvasDataURL}，恢复PNG像素；prompt serializeValue仍上传并输出{image}。旧空工作流不能找回丢失像素。
- **IMAGE双重路径解析仍保留，用户明确拒绝本轮修复**。节点先解析[temp]再交LoadImage，宿主再次按input边界检查失败；不要放宽宿主安全校验或顺手修后端。
- MCP是独立fastmcp4.2.0 stdio，只有version和connection_status，后者仅两个GET。不做远端版本握手、Canvas控制或业务写操作。Resources/产品Skills为0；有条件Provider接线不是业务Skill。开发.agents/skills与产品Skills分开。

## 不可丢失的产品方向

一个AstroPhoto Sidebar，Nodes/Assets/Settings三个主视图默认Assets；两资源页Search/Filter/Sort，节点由原生V3 Registry注册；素材未来拖出固定AssetSource实例并保存asset_id，FITS/SER保持原始精度/元数据。Workflow保存、加载、Undo/Redo、执行都归ComfyUI，不建workflows.db或第二个编辑器。

七Settings模块均可进入说明/返回；无Experiments/Trials前端页；语言和主题跟随全局系统；简约专业、紧凑左对齐圆角Tab。图标/Emoji最终方案仍需用户视觉选择，不因现有代码而宣布已批准。长期FR01–FR08、三库、Knowledge/Memory隐私、软件Adapters和33候选Skills仍保留规划；本次UI排除实验页不等于取消长期后台实验概念。

## 环境与验证

开发根.venv Python3.12.15，最低发行3.11；宿主是Conda comfyenv Python3.12.16 / Torch2.14.1+cu130 / Backend0.45.0 / Frontend1.59.1。base Python3.12.4/Torch2.3启动错误是历史错误环境，不要因此升级宿主。永远不向宿主uv sync。

本交接本轮通过115个不同用例：根节点/Core/HTTP15、MCP52、React33、Vue9、选择性packaging5、真实Host HTTP1；前端types/lint、Ruff、版本、隔离生产build及现有产物hash比较通过。完整打包安装、当前真实UI操作、IMAGE、Manager/发布没有本轮通过证据。

**下一项最有价值的工程工作（仅在用户授权编码时）：更新失效的宿主验证入口。** `frontend/ui/host-runtime.mjs`仍查找已经删除的Language选择器、写AstroPhoto.UI.Language，并覆盖`.artifact/react-sidebar`历史证据。应改成测试宿主Locale跟随，允许独立输出目录，保留明确的`--skip-image-execution`，再验证当前真实Sidebar生命周期/主题/节点添加/Undo/拖动/像素往返。不要先执行现有脚本然后宣称通过；本次交接没有授权你改测试或操作宿主。

其它后续风险：上传未校验resp.ok/name、pre-commit Ruff0.4.9与安装0.17.5不一致、安装types无fetchNodeDefs而Tag类型有、catalog硬编码python_module归属、浮动/200%/真实反代/Save菜单未完整验收。公共PyPI astrophoto-mcp0.0.1本轮404；Registry线上未知。没有发布授权不得Tag/commit/push/publish。

## 工作方式

1. 根据用户当前任务确认是原型、文档还是编码；不默认接管所有长期目标。如果只要画UI，做可交互原型评审，不自动改源码/FRD。
2. `.codegraph/`存在先用CodeGraph，query精确路径，读取当前磁盘源码。参考ComfyUI_frontend固定Tag为v1.59.1，实际已安装index.d.ts优先于示例。
3. 用项目task-notes记录复杂任务；前/后端开发时按项目级astrophoto-reuse-reference Skill委派gpt-6.1-terra、medium、fork_turns=none，在reference/ComfyUI_frontend只读检索复用实现。不要把开发Skill发布给产品用户。
4. 不改用户已有dirty work、不重做迁移、不创建规划空模块、不修改reference。产品数据仅Extension服务拥有；MCP只通过公开API；外部软件只能受控Adapter。
5. 先检查命令副作用。已有环境可运行直接.venv pytest、pnpm typecheck/lint/test:react、pnpm exec vitest run。普通pnpm test会覆盖js，uv build/check_install可能安装依赖；只读审计不要照抄执行。
6. 报告时分VERIFIED/SOURCE_CONFIRMED/PARTIAL/PLANNED/BLOCKED/CONFLICT/SUPERSEDED/UNKNOWN；历史日志、mock、真实HTTP、真实Canvas必须分开。记录具体命令、输出、源码行和验证时hash。

原始ZIP未提供，输入已解包manifest26/26一致，历史manifest仅15可用匹配、33旧日志缺失。不要重新打包历史材料后宣称完成新的仓库验证。
