# AstroPhoto — Repository-Verified Handoff

审计日期：2026-11-17（America/Chicago）。软件版本 **0.0.1**；需求基线 v0.2、React FRD v1.0 和 Guide v1.1 都不是软件版本。

本文件可独立用于接手。原始资料保留在 `.artifact/Latest_Handoff/`，本次不改写原件、旧 FRD、Guide、AGENTS 或产品源码。详细差异见 [RECONCILIATION_REPORT.md](RECONCILIATION_REPORT.md)，命令、原始输出和未运行项见 [VALIDATION_EVIDENCE.md](VALIDATION_EVIDENCE.md)。

## 1. 首先恢复这些事实

项目位于 `C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`。分支 `main`，HEAD `06961eebe42674714dc2992b0a9de654b3a5a566`。大量迁移文件仍未提交/未跟踪；HEAD 不能重现当前软件。不要 reset、clean、恢复用户删除、切换分支、提交或发布。

当前是 **ComfyUI V3 Extension + 最小 Core/Status API + Vue 画板 + React Sidebar + 独立 FastMCP**。React 没有取代 Vue Widget，也不是待开始的空工程。只有 **1 个 Python 节点、1 条 Extension HTTP 路由、2 个 MCP Tools、0 个产品 Skills**。

真实宿主已运行于 Conda `comfyenv`。本轮只读 HTTP 确认 Backend **0.45.0**、Frontend **1.59.1**、Extension **0.0.1**、节点/路由注册成功。历史 base 环境 Torch 报错不能再作为当前宿主无法启动的理由。**IMAGE 执行的双重路径解析问题仍在，用户明确要求保留，不应顺手修复。**

审计期间其他操作更新了前端文件；本审计未写这些文件。`evidence/source-before.json`、`source-after.json`、`concurrent-changes.json` 记录前后状态。本文行号以最终审计快照为准，接手必须再次比对工作树。时间边界见 `evidence/snapshot.json`；它不是冻结用户工作区的承诺。

### 状态词典

| 状态 | 含义 |
|---|---|
| VERIFIED | 本轮有实际运行/测试证据，必须注明验证边界 |
| SOURCE_CONFIRMED | 当前源码确认，相关运行行为本轮未验收 |
| PARTIAL | 只完成需求的一部分 |
| PLANNED | 有效目标，未实现 |
| BLOCKED | 存在具体前置阻塞 |
| CONFLICT | 实现、测试或文档与有效要求矛盾 |
| SUPERSEDED | 历史结论已被新事实/用户决策取代 |
| UNKNOWN | 证据不足 |

历史日志单列为“历史证据”，不计入本轮 VERIFIED。源码由 CodeGraph 返回的当前磁盘逐行内容及直接配置读取核对；没有以符号索引摘要冒充实现。

## 2. 输入资料与可信边界

- 完整读取 `AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md` 全部 18 章，包括决策演变、源码调查、目标目录及末尾 Prompt。
- 读取 Bundle `sources/00` 至 `12`、两份 React FRD/Guide、manifest 与相关历史记录；`FULL_HANDOFF.md` 是汇编，不增加一份独立测试证据。
- 当前指定目录提供的是**已解包目录**，没有指定名称的原始 ZIP。本轮没有伪造 ZIP 或宣称已执行原包解压。已将资料复制到独立临时目录，并检查 manifest 路径均位于资料目录内。
- 外层 manifest 的 **26/26 SHA256 与字节数一致**；独立完整交接文件与包内副本一致。历史 `sources/MANIFEST.md` 的 48 条记录中，提供的 15 个文件全部匹配，33 个旧 `evidence/` 文件不在这份输入包内。缺失不等于校验失败，更不等于这些日志已经复验。
- 7 张截图只作为设计参考。本轮没有把它们当成运行截图或产品验收。

工程事实优先级：当前磁盘源码/配置 → 本轮测试与运行 → 实际安装类型/API → 固定版本官方源码 → 官方文档 → 历史审计 → 建议示例。产品需求优先级：用户最新明确要求 → 最新有效交接决策 → 未被覆盖的 FRD/长期需求 → 历史建议。代码缺失不能取消产品需求。

## 3. 当前物理架构

下图列实际重要文件，完整项目文件清单见 `evidence/repository-files.txt`。依赖、缓存、第三方参考源码和历史材料内部不展开；未来目录没有混入 CURRENT。

```text
ComfyUI_AstroPhoto/
├── __init__.py                  # V3 Extension；WEB_DIRECTORY='./js'
├── pyproject.toml              # 0.0.1、Python>=3.11、uv workspace
├── .python-version             # 开发3.12
├── requirements.txt            # 源码安装 ./mcp
├── uv.lock
├── AGENTS.md / README.md / LICENSE
├── nodes/
│   ├── __init__.py
│   └── ComfyUIFEExampleVueBasic.py
├── astrophoto/
│   ├── __init__.py / bootstrap.py
│   ├── core/{__init__,config,paths,errors,capabilities}.py
│   └── api/{__init__,routes,status}.py
├── frontend/
│   ├── entry.ts                # 聚合Vue和React注册
│   ├── package.json / pnpm-lock.yaml / pnpm-workspace.yaml
│   ├── vite.config.mts / vitest.config.mts / tsconfig.json
│   ├── jest.config.cjs / eslint.config.mjs
│   ├── src/
│   │   ├── main.ts / host.d.ts / types.ts
│   │   └── components/{VueExampleComponent,DrawingApp,DrawingBoard,ToolBar}.vue
│   ├── tests/
│   │   ├── host.ts / setup.ts
│   │   ├── components/DrawingApp.test.ts
│   │   └── widgets/{registration,serialization}.test.ts
│   └── ui/
│       ├── tsconfig.json / check-build.mjs / host-runtime.mjs
│       └── src/
│           ├── main.tsx / app/App.tsx
│           ├── host/{comfy,locale,canvas,dragDrop}.ts
│           ├── host/sidebar.tsx
│           ├── api/{client,status,nodes}.ts
│           ├── features/nodes/{NodesPage,NodeTree,NodeHoverPreview}.tsx
│           ├── features/assets/AssetsPage.tsx
│           ├── features/settings/SettingsPage.tsx / moduleRegistry.ts
│           ├── shared/{SearchField,SearchOptions,Feedback}.tsx
│           ├── shared/{useResource,useStoredChoice}.ts
│           ├── i18n/index.ts / locales/{en,zh}/main.json
│           ├── styles/theme.css
│           └── __tests__/      # 6 suites，33 tests；另有setup/mock/fixtures
├── js/main.js / assets/main.css # 上述两套UI的单入口产物
├── locales/{en,zh}/main.json    # Vue画板文案
├── mcp/
│   ├── pyproject.toml / README.md / LICENSE
│   ├── src/astrophoto_mcp/
│   │   ├── __init__.py / __main__.py / server.py / config.py / client.py
│   │   ├── api/{__init__,comfy}.py
│   │   └── tools/{__init__,status}.py
│   └── tests/                  # server/client/config/version + contract fixture
├── tests/
│   ├── conftest.py
│   ├── nodes/{test_registration,test_image_io}.py
│   ├── backend/{test_core,test_status}.py
│   ├── integration/{test_status_api,test_host_runtime}.py
│   └── packaging/{test_contents,test_versions}.py
├── scripts/{release,check_install}.py
├── docs/{architecture,development,mcp,publishing,requirements,react-sidebar}.md
├── docs/handoffs/               # 历史及本次审计交付
├── .github/workflows/{ci,release}.yml
├── .agents/skills/              # task-notes、节点开发指南、astrophoto-reuse-reference
├── .agent/{notes,archive}/      # 开发任务记录，不是用户Memory
├── .artifact/                  # 原始交接、历史宿主证据
├── reference/                  # 包含ComfyUI_frontend v1.59.1等，不导入/打包
├── .codegraph/                 # 开发索引，不是业务数据库
└── dist/、.venv/、node_modules/等 # 本地生成与环境，不属于运行领域模块
```

没有 `astrophoto/assets|storage|software|processing|knowledge|memory|experiments|canvas` 的生产实现，没有产品 `mcp/src/astrophoto_mcp/skills/`。历史推荐的 `LanguageSelector.tsx`、`host/settings.ts`、`api/assets.ts`、`SearchToolbar.tsx` 等不能当成当前文件。实际复用控件为 SearchField / SearchOptions。

## 4. 技术栈、安装环境与发行

| 范围 | 本轮确认的实际版本 | 依据 |
|---|---|---|
| Extension / MCP | 0.0.1 / 0.0.1 | 两份pyproject、版本检查、运行status、MCP version |
| 开发 Python | 3.12.15，独立根 `.venv` | `evidence/dev-versions.json` |
| 发行下限 | >=3.11 | 两份pyproject；本轮未重跑3.11环境 |
| 宿主 Python / Torch | comfyenv 3.12.16 / 2.14.1+cu130 | 安装metadata及实际 `/system_stats` |
| 宿主 Backend / Frontend | 0.45.0 / 1.59.1 | 宿主源码、安装metadata、运行HTTP |
| 宿主 NumPy / Pillow / aiohttp | 2.5.4 / 13.0.0 / 3.14.5 | comfyenv metadata；不导入GPU模型验证 |
| FastMCP / MCP SDK / HTTPX | 4.2.0 / 2.3.0 / 0.28.1 | 当前开发安装metadata |
| Pydantic / pytest / Ruff / comfy-cli | 2.14.3 / 8.4.2 / 0.17.5 / 1.26.0 | 当前开发安装metadata |
| Node / pnpm / uv | 26.8.2 / 11.13.1 / 0.13.8 | 本轮命令查询；CI Node22是另一配置 |
| React / ReactDOM | 18.3.1 | 安装依赖树 |
| i18next / react-i18next | 23.16.8 / 14.1.3 | 安装依赖树 |
| Vue / PrimeVue / Aura / vue-i18n | 3.5.13 / 4.3.3 / 4.3.3 / 9.14.4 | 安装依赖树 |
| Vite / TypeScript / vue-tsc | 6.3.5 / 5.9.3 / 3.3.14 | 安装依赖树及实际检查 |
| Jest / RTL / ESLint | 29.7.0 / 16.3.0 / 9.27.0 | 安装依赖树及测试 |
| Vitest / Playwright / 前端类型包 | 4.0.18 / 1.65.1 / 1.59.1 | 安装依赖树及浏览器测试 |

依赖声明、锁文件、安装版本和运行版本分别保存；不要把间接安装 Pydantic/Uvicorn 误读为已实现 Pydantic Core 配置或第二个 Web 服务。Core 实际使用 frozen dataclass + tomllib。SQLAlchemy/Alembic/Astropy/LangChain/sqlite-vec/FastEmbed 是目标选型，非当前业务实现。

唯一前端包管理器是 pnpm，共享 `frontend/pnpm-lock.yaml`；Vue + React 共用一个 Vite entry，产物仍在根 `js/`。Python 使用 uv workspace；**绝不在 ComfyUI 宿主执行 uv sync**。本轮没有安装或升级依赖。

发布边界：根版本为唯一来源；Registry ZIP 包含根入口、nodes、astrophoto、js、locales、README/LICENSE/发布元数据；排除 MCP 源码、前端源码、reference、docs、技能、数据库等。源码 requirements 为 `./mcp`；`scripts/release.py` 在临时暂存目录改为 `astrophoto-mcp==0.0.1`。MCP wheel 只包含本包与元数据。CI 配置是 Python3.11/3.12 + Node22；release 先 PyPI，公共安装验证后再 Registry，不创建 GitHub Release。

本轮 PyPI `astrophoto-mcp/0.0.1/json` 仍 HTTP404（`evidence/pypi.json`）。Registry 线上状态、远程 Actions、Manager 安装/升级为 UNKNOWN；本地配置不能证明已发布。本轮未创建 Tag、提交、推送或发布。

## 5. Extension、Node、HTTP 与数据流

### 5.1 V3 唯一入口

`__init__.py:11` 的 `AstroPhotoExtension` 在 `on_load()` 组装 Runtime 并注册 PromptServer 原生路由；`:19` 返回单一节点类；`:23` 为 `comfy_entrypoint()`。不导出 V1 映射，不启动 MCP。宿主 `../../nodes.py:2329` 先 on_load、再 get_node_list / GET_SCHEMA，因此注册状态必须在请求时查询。

`nodes/ComfyUIFEExampleVueBasic.py:8` 的 Schema：

| 项 | 当前契约 |
|---|---|
| node_id / display_name | `vue-basic` / `Vue Basic` |
| category | `examples` |
| 必需输入 | `custom_vue_component_basic: CUSTOM_VUE_COMPONENT_BASIC` |
| 输出 | 单个 `IMAGE`，显示名 `image` |
| 执行 | `execute(dict)` 校验 image 是字符串，委托宿主 LoadImage，返回 io.NodeOutput |

实际 `/object_info/vue-basic` 已确认上述 Schema 与 `python_module=custom_nodes.ComfyUI_AstroPhoto`。注册成功并不保证执行成功。

### 5.2 画板保存与执行是两条链路

```text
DrawingBoard Canvas → PNG Data URL → DrawingApp → VueExampleComponent
  ├─ workflow同步保存：widget.options.getValue/setValue
  │    → {image, canvasDataURL} → ComfyUI Workflow JSON
  │    → restoreCanvas / image.decode → 校验PNG、尺寸、revision → 恢复像素
  └─ API prompt异步序列化：widget.serializeValue
       → /upload/image (type=temp, subfolder=threed)
       → {image:'threed/<name> [temp]'}
       → Python execute → get_annotated_filepath → LoadImage再次解析
       → 已知路径边界错误；本轮没有宣称IMAGE成功
```

证据：`frontend/src/components/VueExampleComponent.vue:32` 规范化旧值，`:41` 原生读写 hooks，`:79` 恢复与序列化；`DrawingBoard.vue:232` 恢复 PNG。本轮 9 项 Chromium 用例验证像素往返/非法数据恢复等，宿主边界仍为 mock。历史真实 `graphToPrompt/handleFile` 像素恢复见 `.agent/archive/drawing-persistence.md`，本轮没有再次操作真实画布。

历史已丢失的空 widgets_values 无法恢复原像素。小画板 PNG 内嵌不等于未来允许把大型 FITS/SER 文件嵌进 Workflow。

IMAGE 问题证据：节点 `:24` 先解析 `[temp]`，`:25` 再把绝对路径交给宿主；宿主 `../../nodes.py:1764` 再次 `get_annotated_filepath`；`../../folder_paths.py:352` 默认 input 并做目录边界检查。历史 `image-execution-failure.json` 有 ValueError。不要放宽宿主路径校验；修复须是后续明确授权的任务。

另一个未修问题：`VueExampleComponent.vue:72` 未检查 resp.ok / 返回 name，`:101` 直接拼路径。HTTP错误JSON可能形成错误引用，现有 rejected-Promise 测试不覆盖全部响应形状。

### 5.3 最小 Core 与唯一 Extension 路由

`astrophoto/bootstrap.py:16` 仅装配配置与查询函数；`core/config.py:19` 从根 pyproject 读身份；`core/paths.py:10` 默认 `~/.astrophoto`，ASTROPHOTO_HOME 可设非空绝对路径。无 mkdir、数据库、扫描、下载、模型加载或软件执行。

`GET /astrophoto/v1/status` → `api/routes.py:11 register_routes` → `api/status.py:21 status_handler` → `:9 status_payload`。

```json
{
  "extension": {"id": "ComfyUI_AstroPhoto", "version": "0.0.1"},
  "api_version": "v1",
  "status": "ok",
  "runtime": {"node_registered": true, "routes_registered": true},
  "data_home": "C:\\Users\\Administrator\\.astrophoto",
  "capabilities": {
    "status_api": {"available": true, "reason": null},
    "drawing_node": {"available": true, "reason": null},
    "storage": {"available": false, "reason": "not_implemented"},
    "assets": {"available": false, "reason": "not_implemented"},
    "software": {"available": false, "reason": "not_implemented"},
    "processing": {"available": false, "reason": "not_implemented"},
    "knowledge": {"available": false, "reason": "not_implemented"},
    "memory": {"available": false, "reason": "not_implemented"},
    "experiments": {"available": false, "reason": "not_implemented"},
    "canvas_bridge": {"available": false, "reason": "not_implemented"}
  }
}
```

这是本轮真实 GET 回包的字段，不是未来 Schema。status 只有 ok/degraded；不包含 ComfyUI/Frontend/MCP 全版本、身份、前端在线或执行回执。配置路径不证明数据库已创建。重复路由复用既有 Runtime，异主占用抛 RuntimeError；没有自定义结构化业务错误中间件。Assets/sessions/import/catalog 接口仍是规划。

## 6. React Sidebar CURRENT

`frontend/entry.ts:2` 先导入 Vue，再导入 React；`ui/src/main.tsx:5` 注册 `AstroPhoto.Sidebar`。`host/sidebar.tsx:8` 对 `astrophoto.sidebar` 去重，`:14` 清理 locale watcher / React Root / DOM / 专属宿主容器类，`:22` 重入同容器不重复 mount。

| 页面/职责 | 当前实现与证据 | 状态与限制 |
|---|---|---|
| 三主视图 | `app/App.tsx:9` Nodes/Assets/Settings；`:13` 默认Assets；`:64` hidden保留各页 | VERIFIED React tests；关闭销毁后不承诺全部会话状态持久化 |
| Header/Tab | App:19 标题走 nav.title；有资源刷新、无额外齿轮；CSS:33 紧凑左对齐圆角Tab | SOURCE_CONFIRMED；本轮未做视觉验收；齿轮是可选快捷入口 |
| Nodes目录 | `api/nodes.ts:6 nodeCatalog`，`:32 GET /object_info` | VERIFIED；按python_module和旧vue-basic兼容规则过滤，不是第二套Registry |
| Search | SearchField:6 180ms debounce与IME保护；NodesPage:35 多字段大小写归一后的子串匹配 | VERIFIED；不是宿主Fuse模糊检索，不是300ms完整复制 |
| Filter/Sort | NodesPage:59 分类多选、空选择=all；:69 original/alphabetical | VERIFIED测试集合；当前真实仅一个节点，多节点排序来自fixtures测试 |
| 目录树 | NodeTree:11 按category的斜杠层级建树；NodesPage:18 独立展开，搜索展开匹配 | VERIFIED React tests；不是宿主TreeExplorer组件直接导入 |
| 悬停预览 | NodeHoverPreview:10 / :57 Portal到body，节点元数据缩略图、端口、边界定位 | SOURCE_CONFIRMED + React测试；不执行节点，仍可点击详情/加号 |
| Canvas | canvas.ts:11 当前canvas.graph、坐标、可编辑性、注册检查、回滚、before/after事件 | VERIFIED隔离测试；真实Undo/Subgraph为历史证据，本轮未重跑 |
| Drag | dragDrop.ts:3 自有MIME；:8 只接受v1/kind=node/allowed nodeId；:15只接管canvas | VERIFIED隔离测试；asset/session负载不支持 |
| Assets | AssetsPage:19 工具栏、:29禁用导入、:32会话空态、:35 capability提示 | PARTIAL；没有真实素材记录、详情、导入、添加或拖放 |
| Settings | moduleRegistry:1 七项；SettingsPage:10 系统页partial、其他planned | VERIFIED React tests；业务模块是说明，不是配置表单 |
| 语言 | locale.ts:3读取Comfy.Locale；:10可见时500ms检测，focus追赶，destroy清理 | VERIFIED隔离；没有生产LanguageSelector/私有覆盖 |
| 主题 | theme.css 使用宿主token；无私有主题状态 | SOURCE_CONFIRMED；Portal、图标及容器专用类在根外，不是所有CSS都在根内 |

七个模块的稳定 ID：`software`、`equipment`、`observing-site`、`knowledge`、`memory`、`agent`、`system`。展示名称分别为 Software、Equipment & Optics、Observing Sites、Knowledge、Memory & Privacy、Agent Context & MCP、System Status；中文完整对应。Agent说明页不能被解读为Agent在线。

网络层 `api/client.ts:8 getJson` 使用宿主 fetchApi、10秒Abort超时，区分http/json/network/timeout；DTO在nodes/status中验证。`useResource.ts:3` 只有loading/error/ready，空/不可用由页面派生；历史6态Loadable是建议，不是现有类型。取消发生在卸载/刷新；hidden切页不等于卸载。

Node和Asset排序分别保存在 `AstroPhoto.Nodes.Sort`、`AstroPhoto.Assets.Sort`；这些轻量浏览偏好不是Memory，也不是语言/主题覆盖。Assets帧类型和排序控件已有，但缺记录服务，不能声明筛选真实素材成功。

## 7. 宿主接口：哪些可依赖，哪些只是版本适配

本地参考仓库 `reference/ComfyUI_frontend` 为 `v1.59.1`，HEAD `cded88fdffbb78f191fc8e454e7f2cfa5016ee43`；其 `.codegraph/` 未跟踪。实际安装类型包同为1.59.1，但并非所有源码类型都出现在发布声明中。

| 接口 | 分类与本轮结论 |
|---|---|
| app.registerExtension | 官方扩展入口；已安装index.d.ts:1410 |
| registerSidebarTab / getSidebarTabs | 官方扩展接口；index.d.ts:3298；固定版extensionTypes.ts:90 |
| render / destroy | custom类型在index.d.ts:2764/2765；隐藏时是否销毁依宿主生命周期，不假定每次toggle都destroy |
| React createRoot/unmount | 本扩展自带React18；sidebar.tsx管理，不注入Vue组件树 |
| app.getNodeDefs | 安装声明index.d.ts:1375存在；项目当前实际走GET /object_info |
| app.fetchNodeDefs | 固定Tag `src/types/comfy.ts:162` 有；已安装index.d.ts无该符号。不是可直接假定存在的已发布类型契约 |
| clientPosToCanvasPos | index.d.ts:1416；实际创建路径使用该坐标转换 |
| window.LiteGraph / graph.add / emitBeforeChange | 固定版本内部适配，非稳定高阶创建API；参考utils/createNode.ts:13、changeTracker.ts:773 |
| setting.get/set | 官方接口；安装index.d.ts:3305，get接受string；当前生产只读Locale，无旧设置ID窄断言需要 |
| Workflow保存加载 | ComfyUI拥有；项目没有第二套Workflow存储。历史round-trip不是Save/Save As服务器菜单完整验收 |
| comfy_entrypoint / ComfyExtension / io.Schema | 实际Backend源码及节点定义已核对；本轮HTTP证明节点已加载，不证明执行tensor正确 |

官方资料本轮重新打开：[Sidebar](https://docs.comfy.org/custom-nodes/js/javascript_sidebar_tabs)、[JS Extensions](https://docs.comfy.org/custom-nodes/js/javascript_overview)、[V3 Migration](https://docs.comfy.org/custom-nodes/v3_migration)。这些用于接口定位；本机兼容性以安装类型、固定Tag源码和运行证据为准。

原生Node Library V2调查仍有效：`NodeLibrarySidebarTabV2.vue:11` 的Search→Filter→Sort（Essentials是JumpTo）；SearchInput.vue:91默认300ms只描述search事件；实际检索是computed；FilterDropdown.vue:34处理全选/末项取消；节点来源四类别与AstroPhoto自身category不是同一业务模型。React只是小范围行为/视觉适配，没有import宿主Vue SFC或照搬Fuse服务。共享控件文件名不同不构成架构失败。

## 8. MCP CURRENT

`mcp/src/astrophoto_mcp/server.py:16 create_server` 是唯一FastMCP工厂；`__main__.py:23` 运行stdio、show_banner=False。URL优先级为CLI > COMFYUI_URL > localhost:8188，校验HTTP(S)、端口，拒绝凭证/query/fragment/内部空白并保留代理路径。

| Tool | 输入 | 输出/边界 |
|---|---|---|
| version | 无参数对象 | `{name:'astrophoto-mcp', version:'0.0.1'}`；JSON文本与structuredContent，显式输出Schema |
| connection_status | 无参数对象 | `{reachable:true, extension_registered:bool, system:object}`；JSON文本、无outputSchema/structuredContent |

`api/comfy.py:6` 只GET system_stats与object_info/vue-basic。200空对象表示节点缺失；404/500、超时、坏JSON等是tool error。没有跨包版本比较，也不访问 `/astrophoto/v1/status`，没有写数据库、提交prompt或控制Canvas。

本轮52项测试包含内存auto/legacy、HTTP MockTransport、真实stdio initialize/list/call、stdout纯JSON。另以真实HTTP连接运行宿主调用两工具成功；Resources列表为空。条件式SkillsDirectoryProvider接线仅在包内有真实SKILL.md时加载（server.py:22），不是产品Skill已交付。旧SDK1.30互操作是历史记录，本轮未安装或重跑。

`.agents/skills/astrophoto-reuse-reference/` 只用于本项目开发：未来前/后端实现前委派gpt-6.1-terra medium检索固定参考源码；本次是文档审计，没有启动业务开发或因此创建子代理。开发Skills不随MCP发行。

## 9. 有效产品目标（TARGET，不因未实现而删除）

### 9.1 Sidebar产品决策与符合度

| 有效要求 | 当前符合度 |
|---|---|
| 一个AstroPhoto宿主Sidebar | 已满足，注册去重；本轮组件测试 |
| Nodes/Assets/Settings、默认Assets、键盘与返回 | 已满足核心导航；浮动/200%缩放仍缺本轮实测 |
| 两资源页Search/Filter/Sort | Nodes满足当前真目录；Assets只有控件与偏好，业务结果未实现 |
| 原生Node Registry；Nodes可添加/拖放 | 已有本地适配；不代表MCP Bridge或科学处理完成 |
| 素材拖出成为稳定Asset Source Node实例 | PLANNED；无Asset API/Source Node，生产禁用成功路径 |
| Workflow原生保存/加载/Undo/执行 | 源码遵循；服务器Save/Save As完整验收UNKNOWN |
| 不增加Experiments/Trials前端页 | 已满足；长期FR-07未被取消 |
| Settings七个业务模块，可进入说明/返回 | 已满足；仅System基础接口，不造假配置表单 |
| 语言/主题跟随ComfyUI，无独立选择器 | Sidebar生产源码满足；旧host-runtime脚本CONFLICT |
| 简约专业、左对齐紧凑圆角Tab | 当前源码已适配；美术最终批准、Emoji方案仍UNKNOWN |
| 详情/加号替代拖放、错误反馈、无假数据 | Nodes已实现；Assets未来要求保留 |

无论生产代码目前如何，都不能恢复旧LanguageSelector、AstroPhoto.UI.Language、auto/zh/en覆盖模式、主题选择器、六业务主Tab或实验页面。顶栏Help/齿轮在交接中是可选示意，当前无齿轮不等于两个设置中心。图标/Emoji没有最终用户选择，现有SVG/文字不能冒充用户已批准全站方案。

### 9.2 长期业务要求

| 领域 | 保留目标与验收要点 | 当前 |
|---|---|---|
| FR-01 状态能力 | Extension/MCP/Host版本协商、数据库/软件/前端在线、缺依赖原因 | PARTIAL：只有基础状态与诊断 |
| FR-02 资产设备地点 | Camera/Telescope/Filter/Optical Train，Session/Target/Light/Dark/Flat/Bias/DarkFlat/Master；FITS原Header+标准字段；去重/缺失/重定位；曝光温度Gain/Offset/Binning等解释校准关联；地点时区及可选坐标、光污染来源与不确定性 | PLANNED |
| FR-03 专业软件/科学类型 | Siril先、PixInsight后；路径/版本验证、受控参数、超时取消日志；未装软件节点仍可识别但不可执行；ASTRO_ASSET/FRAME传引用及科学元数据，显式IMAGE转换 | PLANNED |
| FR-04 工作流/Bridge | 节点发现、在线canvas_session_id/revision命令回执、断线失败；/prompt与画布编辑不同；原生保存与Undo | PARTIAL：本地目录/创建已做，远程Bridge/执行Tool未做 |
| FR-05 Knowledge | LangChain采集/分块；官方或许可来源；SQLite FTS5优先，可选sqlite-vec/FastEmbed；返回url/section/version/excerpt/score；无模型可检索，索引可重建 | PLANNED |
| FR-06 Memory | Extension独立持有；授权采集，actor区分human/agent/system；显式偏好优先，推断有场景/置信度/证据；审阅纠错导出删除，最小上下文召回 | PLANNED |
| FR-07 Experiments | 可复现snapshot/hash、软件/Schema/输入版本、参数指标/反馈、预算停止取消恢复；Harness外部编排Subagent | PLANNED长期后台；本次Sidebar明确不展示 |
| FR-08 产品Skills | 真实Tools先实现；包内Skills随wheel，声明capabilities；支持Host发现/用户主动本地安装后备；缺能力不能假执行 | PLANNED，0个产品Skill |

数据所有权：仅Extension业务服务可读写未来三库 `assets.db / knowledge.db / memory.db`；大文件原址只读引用，不入SQLite、不嵌Workflow。未来AssetSource固定Node Class + asset_id；SessionSource批次语义待设计。浏览器webkitdirectory不保证获得Python可用原始绝对路径，必须设计受控授权入口。

未来SQLAlchemy2/Alembic、短事务、备份迁移和分库ID引用，不承诺跨库原子事务。Knowledge来源/许可/版本可追溯；Memory不复制资产事实，不等于聊天或task-notes，不从Agent自行动作推断用户偏好。敏感位置与设备信息不自动外发，采集可关闭和删除；多用户需认证，不信任自报profile_id。模型路径由ComfyUI folder_paths管理，专用embedding/reranker类别尚未注册。

保留33个候选Skill（共同前缀 `astrophoto-`，全部PLANNED）：

- 系统设备4：check-environment、configure-software、setup-equipment、setup-site。
- 资产6：import-session、inspect-frames、organize-assets、match-calibration、build-masters、quality-review。
- 工作流5：plan-workflow、compose-workflow、run-workflow、debug-workflow、reproduce-workflow。
- 处理12：preprocess-osc、preprocess-mono、register-stack、background-extract、color-calibrate、narrowband-combine、stretch、denoise-sharpen、star-processing、mosaic、planetary、export。
- 知识记忆3：knowledge-guide、personalize-processing、memory-review。
- 调参3：optimize-node、compare-trials、select-best-run。

L0/L1/L2只是未来工具渐进发现/操作层次，不是多Server或全局隐藏开关。Tools管操作、Skills管流程、Knowledge给依据、Memory给授权上下文，外部Harness负责推理和编排。

## 10. 本轮验证与未决问题

本轮测试通过 **115 项**：根节点/Core/HTTP 15、MCP52、React33、Vue9、选择性packaging5、真实Host HTTP1。第一次根测试未设URL跳过1项，之后单独Host测试通过；不得把重跑再计入新增覆盖。两项需uv隔离构建的MCP打包测试未运行，避免安装构建依赖。

TypeScript/vue-tsc、ESLint、Ruff、Lockstep检查、构建清单通过。隔离生产Vite构建（不覆盖js）与最终比较时工作树JS/CSS逐字节一致；本轮没有重新安装wheel、完整发布或运行修改设置/产生工作流的host-runtime。

优先风险：

1. **CONFLICT**：host-runtime.mjs:41等仍操作已删除语言选择器，旧16项日志不能当当前全套通过。最有价值的后续工程任务是经授权更新这一验证入口：跟随Comfy.Locale、输出独立证据目录、保留IMAGE显式skip，再做当前宿主UI回归。
2. **BLOCKED/已知限制**：IMAGE双重路径解析仍在；用户未授权修复，不得放宽宿主检查。
3. **PARTIAL**：上传HTTP状态/name校验仍缺；Assets没有服务或Source Node；状态与Node注册不证明科学处理可用。
4. **CONFLICT**：pre-commit Ruff v0.4.9 vs 安装/CI解析0.17.5；本轮只跑无fix检查，不擅改配置。
5. **UNKNOWN**：浮动Sidebar、200%浏览器缩放、真实代理部署、服务器工作流保存菜单、Manager安装、远程CI与Registry线上状态。
6. **BLOCKED**：公共PyPI同版本仍404；先完成验收并取得发布授权，再执行发布。
7. **证据边界**：工作树并发变化、缺原始ZIP、历史证据名称过期、安装类型与Tag源码差异，均不可被“文档已校准”掩盖。

当前文档自身也有过期段落：docs/react-sidebar.md顶部已纠正语言/像素，但后续树和表仍含host/settings.ts、manual override及两处旧失败；docs/requirements.md开头承认节点目录已实现，旧目标清单仍列节点目录未实现。AGENTS中“前端桥未实现”应限定为MCP远程Bridge，不否认本地Canvas Adapter。按用户范围，本次只在新文档标注，未改旧文件。

## 11. 接手顺序与可复现命令

先读本文件、差异报告、验证记录、当前AGENTS及任务note；比对工作树/哈希；检查正在使用的宿主环境。不要重做V3/React迁移，不删除Vue，不按历史目标树建空模块。

在依赖已经安装的情况下，本轮安全入口为：

```powershell
.venv/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration -q -p no:cacheprovider
.venv/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests -q -p no:cacheprovider
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test:react
pnpm -C frontend exec vitest run
pnpm -C frontend check:build
.venv/Scripts/ruff.exe check --no-cache astrophoto nodes mcp/src mcp/tests scripts tests __init__.py
```

`exec vitest run`有意绕过`pnpm test`的前置构建，不覆盖用户js；本轮另以隔离构建验证。常规开发的build/test命令仍见docs/development.md，但不能在只读审计里机械照跑安装/写产物命令。Host HTTP只GET可单独设置COMFYUI_TEST_URL后运行；当前test:host需要先处理旧语言假设，不能不看源码直接执行。

如果用户下一步要看UI，继续可交互原型评审，保留三视图与有效决策；如果明确授权编码，优先收敛当前验证缺口，再按指定范围推进Assets服务/稳定Source Node。不要自动修IMAGE、实现实验页或发布。独立启动Prompt见 [NEXT_AGENT_PROMPT.md](NEXT_AGENT_PROMPT.md)。
