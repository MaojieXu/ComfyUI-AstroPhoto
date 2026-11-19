# 实际架构与物理文件地图

证据：根入口:11/23，节点类:6，bootstrap:16，routes:11，status:9；完整差异见11。下文是审计后的实际架构快照。当前Node只委托宿主LoadImage，没有天文Domain Service；长期分层规则不能被误读为所有层已经存在。

# 架构

当前采用 **Domain-first Modular Monolith + ComfyUI Native Extension + V3 Node API**。
软件版本为 0.0.1；Extension 通过 Registry ZIP 分发，MCP 独立通过 PyPI wheel 分发。
根 pyproject.toml 为唯一版本来源，uv workspace 共用一个 uv.lock。

## 已实现模块

| 模块 | 当前职责 |
| --- | --- |
| 根 __init__.py | comfy_entrypoint()、ComfyExtension、WEB_DIRECTORY；on_load 组装后端并注册路由 |
| nodes/ | 一个 V3 io.ComfyNode；Schema、输入校验、LoadImage 适配、NodeOutput |
| astrophoto/bootstrap.py | 创建轻量 Runtime，注入配置及实际节点注册查询 |
| astrophoto/core/ | AppConfig、ASTROPHOTO_HOME、配置错误、真实 capability 状态 |
| astrophoto/api/ | 原生 aiohttp 路由与可独立测试的状态 Handler |
| frontend/src/ | Vue UI、原生 DOM Widget 适配、独立 PrimeVue/i18n 初始化 |
| js/ | 构建后的 JS/CSS，不存业务源码 |
| locales/ | 中英文 main.json；已打入独立 Vue App 并包含于 Registry，宿主发现/显示仍待真实运行验证 |
| mcp/src/astrophoto_mcp/ | FastMCP 4.2 单 Server、Status Tools、公共 HTTP Adapter |
| tests/ | Extension 单元测试、HTTP 集成、宿主显式验证、发行检查 |
| reference/ | 参考项目；不修改、不导入、不打包 |

## V3 注册与现有数据流

此前标准化任务将实际 V1 源码迁为 V3；当前未同时导出 V1 映射，避免宿主优先走旧入口。本次交接审计只复核，未再次迁移。
本机 ComfyUI 0.45.0 的加载器依次调用 comfy_entrypoint → on_load → get_node_list → GET_SCHEMA。
因此状态 API 在每次请求时查询真实 NODE_CLASS_MAPPINGS，不能在 on_load 时就声称节点注册完成。

```text
ComfyUI → comfy_entrypoint → AstroPhotoExtension
  ├── on_load → bootstrap → register_routes(PromptServer.instance.routes)
  └── get_node_list → ComfyUIFEExampleVueBasic.define_schema

Canvas → PNG Data URL → state-save → widget.serializeValue
  → api.fetchApi('/upload/image', type=temp, subfolder=threed)
  → {image: 'threed/<name> [temp]'}
  → V3 execute → folder_paths.get_annotated_filepath → 宿主 LoadImage
  → io.NodeOutput(IMAGE)
```

保留 node_id `vue-basic`、自定义类型 `CUSTOM_VUE_COMPONENT_BASIC`、输入名
`custom_vue_component_basic`、输出名 `image`、category `examples`。
V3 使用 `io.Custom(...).Input(...)`，未增加 forceInput 或改变保存工作流的值结构。
无实际缓存需求，因此不添加 fingerprint_inputs。后续节点只做适配；领域业务委托 Service。

## 后端状态与数据目录

`GET /astrophoto/v1/status` 返回 Extension 标识/版本、API v1、ok/degraded、实际路由与节点
注册状态、配置的数据根路径、capabilities。状态不声称前端在线或 IMAGE 已执行成功。
status_api 与 drawing_node 由注册状态决定；storage/assets/software/processing/knowledge/
memory/experiments/canvas_bridge 为 unavailable，reason 为 not_implemented。

默认数据根为 ~/.astrophoto/；ASTROPHOTO_HOME 可覆盖为绝对路径。空值、相对路径、空字节
被拒绝。导入或读取配置不会 mkdir、创建数据库、扫描文件、下载依赖、加载模型或运行软件。
bootstrap 只读取发布包内的项目 metadata 并组装 Runtime。路由按实际 RouteTableDef 检查重复，
同一服务反复 on_load 不会重复添加；不同服务各自注册；非本扩展占用同路径时明确报错。

## 前端边界

Frontend 1.59.1 已移除宿主 PrimeVue 插件和主题。扩展改为 native node.addDOMWidget，
自行 createApp + PrimeVue 4.3.3/Aura + vue-i18n，并在 widget.onRemove 卸载，同时保留宿主清理。
Vue 3.5.13、PrimeVue、国际化和主题均打入单个 main.js；不会把另一份 Vue 组件交给宿主 Vue 渲染。
主题使用 astrophoto 前缀，避免依赖宿主 --p-* 变量。Widget ID、序列化 JSON、画笔交互保持兼容。

源码以 comfy:app / comfy:api 引用宿主；Vite output.paths 明确映射到产物的
../../scripts/app.js 与 ../../scripts/api.js，不受源码目录层级影响，保留反向代理路径前缀。
这些是 ComfyUI API；未修改宿主源码。TypeScript/vue-tsc 是独立检查步骤，不由 Vite build 代替。

## 未来业务归属（均未创建）

| 域 | 未来职责和技术 |
| --- | --- |
| storage/ | SQLite、SQLAlchemy 2 Engine/Session、Alembic；真实数据库在 ~/.astrophoto/databases/ |
| assets/ | 设备、资产、校准关系、FITS 元数据 |
| software/ | Software Registry、受控 Runner、Siril/PixInsight Adapter |
| processing/ | Astropy/NumPy、科学数据与显式 IMAGE 转换，保留 FITS 精度与元数据 |
| knowledge/ | LangChain、SQLite FTS5、按需 sqlite-vec |
| memory/ | 用户授权下的行为、偏好、反馈与记忆生命周期 |
| experiments/ | 参数 Trial、指标、执行与复现记录 |
| canvas/ | 原生前端命令与真实执行回执，不把提交 prompt 等同于修改画布 |

依赖方向：Node / HTTP API → Domain Service → Repository / Adapter → Storage / External Software。
领域 Service 不导入 nodes、frontend、mcp。根据实际复杂度创建 models/schemas/service/repository，
不套用统一空模板。Session 由请求/操作管理，不跨并发任务共享；长运行软件不持有写事务。
模型路径由 ComfyUI folder_paths 管理。外部软件只能通过受控 Adapter，禁止任意 Agent Shell。

## MCP 边界

FastMCP 4.2 的 create_server 是唯一工厂，tools/status 注册两个既有工具；client/api
只访问公共 ComfyUI HTTP API。现有 connection_status 契约不变，本次不强制增加新的 HTTP
请求或 Tool；新状态接口可由 Frontend/外部 HTTP 客户端使用，未来再按需求扩展 MCP。
MCP 不读取 Extension 配置/数据库，不构成第二套业务后端。业务 Skills 尚未实现。

## 验证边界

独立测试使用 V3 API test doubles 和真实 aiohttp TestServer，不能证明实际 ComfyUI 加载。
本机 Python 3.12.4 / ComfyUI 0.45.0 在导入 comfy_api.latest 或启动 main.py 时均因
Torch 2.3.0 缺少 torch.library.custom_op 失败。完整 V3 加载、状态接口和宿主 UI 验证未完成。
已提供显式宿主 HTTP 测试入口；具体命令与测试证据见 development.md。

依据：[V3 API](https://docs.comfy.org/custom-nodes/v3_migration)、
[原生路由](https://docs.comfy.org/development/comfyui-server/comms_routes)、
[Frontend 1.59.1 PrimeVue 迁移](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.1/docs/extensions/primevue-removal-migration.md)、
[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、
[Cosmic Python](https://www.cosmicpython.com/)。以目标安装版本源码及运行验证为准。

## 仓库审计补充（2026-11-16）

当前 Node 直接委托宿主 LoadImage，没有天文 Domain Service。配置使用标准库 dataclass/tomllib，而非历史示例中的 Pydantic 配置系统。状态能力为 `{available, reason}`，无软件探测或实例身份协议。完整快照与双向差异见 [审计交接](00_README.md)。

## 当前项目源码/配置树

来自Git tracked与未忽略新文件的实际存在性检查。这里展开全部94个审计前项目文件，不展开reference、历史交接、依赖、缓存、Git内部文件；新交接目录索引见00，忽略的Agent记录单列。不是目标目录图。

```text
ComfyUI_AstroPhoto/
├── .agents/
│   └── skills/
│       ├── comfyui-node-advanced/
│       │   └── SKILL.md
│       ├── comfyui-node-basics/
│       │   └── SKILL.md
│       ├── comfyui-node-datatypes/
│       │   └── SKILL.md
│       ├── comfyui-node-frontend/
│       │   ├── SKILL.md
│       │   └── api-reference.md
│       ├── comfyui-node-inputs/
│       │   └── SKILL.md
│       ├── comfyui-node-lifecycle/
│       │   └── SKILL.md
│       ├── comfyui-node-migration/
│       │   └── SKILL.md
│       ├── comfyui-node-outputs/
│       │   └── SKILL.md
│       ├── comfyui-node-packaging/
│       │   └── SKILL.md
│       └── task-notes/
│           └── SKILL.md
├── .comfyignore
├── .editorconfig
├── .gitattributes
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── .gitignore
├── .pre-commit-config.yaml
├── .python-version
├── AGENTS.md
├── LICENSE
├── README.md
├── __init__.py
├── astrophoto/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── status.py
│   ├── bootstrap.py
│   └── core/
│       ├── __init__.py
│       ├── capabilities.py
│       ├── config.py
│       ├── errors.py
│       └── paths.py
├── docs/
│   ├── architecture.md
│   ├── development.md
│   ├── mcp.md
│   ├── publishing.md
│   └── requirements.md
├── frontend/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── src/
│   │   ├── components/
│   │   │   ├── DrawingApp.vue
│   │   │   ├── DrawingBoard.vue
│   │   │   ├── ToolBar.vue
│   │   │   └── VueExampleComponent.vue
│   │   ├── host.d.ts
│   │   ├── main.ts
│   │   └── types.ts
│   ├── tests/
│   │   ├── components/
│   │   │   └── DrawingApp.test.ts
│   │   ├── host.ts
│   │   ├── setup.ts
│   │   └── widgets/
│   │       ├── registration.test.ts
│   │       └── serialization.test.ts
│   ├── tsconfig.json
│   ├── vite.config.mts
│   └── vitest.config.mts
├── js/
│   ├── assets/
│   │   └── main.css
│   └── main.js
├── locales/
│   ├── en/
│   │   └── main.json
│   └── zh/
│       └── main.json
├── mcp/
│   ├── LICENSE
│   ├── README.md
│   ├── pyproject.toml
│   ├── src/
│   │   └── astrophoto_mcp/
│   │       ├── __init__.py
│   │       ├── __main__.py
│   │       ├── api/
│   │       │   ├── __init__.py
│   │       │   └── comfy.py
│   │       ├── client.py
│   │       ├── config.py
│   │       ├── server.py
│   │       └── tools/
│   │           ├── __init__.py
│   │           └── status.py
│   └── tests/
│       ├── conftest.py
│       ├── fixtures/
│       │   └── status_contract.json
│       ├── test_client.py
│       ├── test_config.py
│       ├── test_server.py
│       └── test_version.py
├── nodes/
│   ├── ComfyUIFEExampleVueBasic.py
│   └── __init__.py
├── pyproject.toml
├── requirements.txt
├── scripts/
│   ├── check_install.py
│   └── release.py
├── tests/
│   ├── backend/
│   │   ├── test_core.py
│   │   └── test_status.py
│   ├── conftest.py
│   ├── integration/
│   │   ├── test_host_runtime.py
│   │   └── test_status_api.py
│   ├── nodes/
│   │   ├── test_image_io.py
│   │   └── test_registration.py
│   └── packaging/
│       ├── test_contents.py
│       └── test_versions.py
└── uv.lock
```

另实际存在：`.agent/notes/`（architecture-migration、backend-standardization以及本轮任务，后者完成后归档）、`.codegraph/`、`.artifact/ComfyUI_AstroPhoto_Handoff_2026-11-16/`、`reference/`、`.venv/`、`.venv-backup-3.13/`、`frontend/node_modules/`、`dist/`。这些不是运行模块。当前无 astrophoto/assets、software、processing、knowledge、memory、experiments、canvas、storage 业务目录，MCP无产品skills目录。

## Status具体契约

GET /astrophoto/v1/status → status_handler → status_payload。extension={id,version}、api_version='v1'、status=ok/degraded、runtime={node_registered,routes_registered}、data_home字符串、capabilities各项={available,reason}。能力ID共有10个：status_api、drawing_node及8个未来域；没有 enabled/status/version 子字段的完整未来Capability模型。pure payload示例见evidence/status-example.json（故意未注册，degraded，非宿主HTTP回包）。
