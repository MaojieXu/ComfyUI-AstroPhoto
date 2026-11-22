# 开发与验证

## 仓库布局

从仓库根目录按任务定位实际入口。模块之间的依赖和运行生命周期见[系统架构](architecture.md)。

| 路径 | 开发入口 |
| --- | --- |
| `__init__.py`、`nodes/` | V3 扩展入口，绘图板与科学数据节点 |
| `astrophoto/bootstrap.py`、`astrophoto/bundles.py` | 宿主运行时装配与处理 Bundle 接口 |
| `astrophoto/core/`、`astrophoto/api/` | 配置、能力和领域错误，原生 aiohttp 状态及业务路由 |
| `astrophoto/storage/`、`astrophoto/database/` | 数据根、工作区、缓存和迁移，SQLite 模型、连接及 Alembic 版本 |
| `astrophoto/assets/`、`astrophoto/equipment/` | 摄影素材库、文件导入与 FITS 元数据，设备、光路及配置快照 |
| `extension/frontend-entry.ts`、`extension/siril/` | Vite 统一入口，Siril 命令、处理会话、节点和路由。Bundle 专用界面位于 `extension/siril/frontend/` |
| `frontend/src/` | `api/` 请求客户端，`bundles/` 接口，`features/` 业务界面，`host/` 宿主适配，`i18n/` 翻译，`shared/` 共用组件，`vendor/comfyui/` 复用的宿主组件 |
| `frontend/tests/`、`frontend/scripts/` | Vue 组件与控件、宿主适配及 Playwright 用例，构建产物和代理检查 |
| `js/`、`locales/` | 宿主加载的 JS/CSS 产物和随扩展发布的界面与节点翻译 |
| `mcp/src/astrophoto_mcp/`、`mcp/tests/` | 独立 CLI 与服务工厂，`api/` HTTP 客户端、`tools/` 领域工具及协议测试 |
| `tests/nodes/`、`tests/backend/`、`tests/integration/`、`tests/packaging/` | 节点、后端、跨组件与可选真实宿主、版本与发行边界 |
| `pyproject.toml`、`scripts/`、`.github/workflows/` | 版本源与 uv workspace，发行、安装验证和 Siril 翻译脚本，CI 与发布流程 |
| `docs/`、`.agents/` | 长期文档与开发 Agent 工作资料。Feature、Skill、Note、历史资料及两层交接的入口见[仓库指引](../AGENTS.md)。 |

## 开发环境与宿主

| 环境 | 当前基准 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12、独立根 `.venv` | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | 隔离 .venv：Python 3.12.16、Torch 2.15.0+cpu、Backend 0.46.0、Frontend 1.59.6 | 真实节点加载、执行、UI 与状态路由 |
| CI | Python 3.11 / 3.12，Node 26.13.1 | 支持范围与独立自动验证 |

`.python-version` 指定 3.12，两个发行包的 `requires-python` 均为 `>=3.11`。根项目和 MCP workspace member 共用一个 `uv.lock`。在仓库独立 `.venv` 内运行 `uv sync`，禁止向 ComfyUI 的 Python 环境同步工作区依赖。节点单元测试使用 V3 替身，宿主依赖及其原生扩展接口由隔离的 ComfyUI 提供。集成时优先复用目标版本的原生机制。

## 安装与日常命令

从仓库根目录执行。CI 固定 uv 0.13.8、Node 26.13.1 与 pnpm 11.13.1，前端使用自己的锁文件。Linux CI 安装 Playwright 时额外传 `--with-deps` 安装 Chromium 系统依赖。见 [CI 配置](../.github/workflows/ci.yml)和[前端脚本](../frontend/package.json)。

```sh
uv sync --frozen
uv run python --version
uv lock --check
uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend exec playwright install chromium
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test
pnpm -C frontend build
pnpm -C frontend check:build
pnpm -C frontend check:proxy
```

`test` 先构建再运行 Vitest Chromium。`build` 生成 `js/main.js` 和 `js/assets/main.css`。本地连续构建可用 `pnpm -C frontend watch`。产物就绪后，`check:build` 检查宿主相对路径，`check:proxy` 用 Chromium 检查代理前缀下的资源加载。

开发时 uv 从本地 workspace 解析 MCP，源码 `requirements.txt` 中的 `./mcp` 也从仓库根解析。可在已启动的 ComfyUI 之外单独启动 stdio 服务，业务授权参数见 [MCP](mcp.md)。

```sh
uv run astrophoto-mcp --version
uv run astrophoto-mcp --comfy-url http://127.0.0.1:8188
```

## 四类验证

### Unit Tests

```sh
uv run pytest tests/nodes tests/backend
uv run --project mcp pytest mcp/tests
```

节点测试核验 V3 entrypoint、节点列表、Schema、输入校验和 LoadImage 委托/NodeOutput，
使用按 0.45.0 源码签名编写的窄 test double。Core 测试验证路径/配置和导入无写入副作用。
MCP 测试使用 FastMCP 内存 Client、HTTPX MockTransport 和真实 stdio 子进程，覆盖基础诊断兼容、设备只读授权和素材库工具。

### Integration Tests

```sh
uv run pytest tests/integration -m "not host"
```

aiohttp TestServer/TestClient 测试真实 HTTP、原生 RouteTableDef、重复注册与状态变化，
但 ComfyUI 注册边界为替身。Vitest Chromium 运行 Canvas 真像素、触摸、上传序列化、错误分支，
另加载真实构建 main.js 验证独立 Vue 初始化、主题、国际化与 onRemove 清理。
真实 ComfyUI 加载与执行另由宿主用例验证。

### Host Runtime Verification

迁移验收使用 ComfyUI `v0.46.0` 与 Frontend `1.59.6`。从隔离宿主的 `.venv` 启动 CPU 环境，监听回环，使用独立 Data Root、input、output、temp 及用户目录。本机业务 API 要求直接回环、单用户且未启用 CORS。以下 PowerShell 示例假定已准备可重开的基线工作流及证据目录，路径可替换为本机实际位置。先检查运行中宿主的状态和注册，再运行两种画布的浏览器用例。

```powershell
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
uv run pytest tests/integration -m host
$env:ASTROPHOTO_BASELINE_WORKFLOW = (Resolve-Path '.artifact/frontend-migration/baseline/workflow.json').Path
$env:ASTROPHOTO_MIGRATION_EVIDENCE = (Resolve-Path '.artifact/frontend-migration').Path
pnpm -C frontend test:host
pnpm -C frontend test:host --nodes-2
```

`test:host` 使用真实浏览器检查侧栏、画布和旧工作流重开，绘图验收到临时 PNG 和 `[temp]` prompt 引用。Python `LoadImage` 到下游节点的完整执行仍待单独复验。实际宿主脚本位于 `frontend/tests/host/`。缺少基线文件时，从迁移前检出保存包含已绘制像素、FITS 来源和 AutoStretch 的工作流。历史 0.45.0 / 1.59.1 的证据见 [React 迁移前记录](react-sidebar.md)。

### Packaging Verification

```sh
uv run pytest tests/packaging
uv run python scripts/release.py check
uv build mcp --no-sources --out-dir dist/mcp
uv run python scripts/release.py registry
uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz
uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1
```

先构建前端再生成 Registry ZIP。上述 wheel/sdist 文件名以仓库版本 0.0.1 为例。发版检查和双包清单见[双包发布](publishing.md)。

根 pytest 默认收集 nodes/backend/integration/packaging，真实 host 测试默认 skip；不扫描
reference 或 MCP 的测试。MCP 有自己的 pytest 配置和 dev 依赖，保留独立入口。

## 现行前端边界

Vite 8、Vue 插件与 Tailwind 接法对齐 ComfyUI Frontend `v1.59.6`，保留独立的 AstroPhoto 配置和锁。`extension/frontend-entry.ts` 组装公共 `frontend/src/main.ts` 与 Siril Bundle，运行构件为 `js/main.js` 和 `js/assets/main.css`。宿主 `app`、`api` 仍走相对链接。Vue 和 Vue I18n 由扩展自己的构建提供，按宿主回调挂载和释放；绘图使用作用域样式，Tailwind 不引入全局重置。

## 数据根目录

`ASTROPHOTO_HOME` 可设为绝对目录，默认 `~/.astrophoto/`。宿主在 V3 `on_load` 初始化存储。读取配置和查询状态只读。四目录首建使用隔离的空数据根，宿主启动后核对 `config/`、`database/assets.db`、`storage/<工作区 UUID>/` 和 `runtime/locks/`。已存在的旧目录布局由开发者保留，四目录验证可另选空根。维护和迁移操作见[本地存储](local-storage.md)。

扩展侧的初始化测试入口为 `tests/backend/test_storage_init.py`、`tests/integration/test_storage_api.py` 和 `tests/integration/test_storage_init.py`。MCP 使用 `uv run --project mcp pytest mcp/tests/test_init.py -q` 验证工具及回执契约。真实宿主验收使用隔离的直接回环、单用户且关闭 CORS 的实例，首次 `init` 应返回四组 `ready`、宿主有效根及空 `created`。 [MCP 初始化](mcp.md#安装后初始化)

## 仓库复核记录（2026-11-16）

当日记录为 Python 3.12.15 根测试 22 passed / 1 skipped、MCP 52 passed；现有独立 Python 3.11.18 验证环境同样 22 passed / 1 skipped、MCP 52 passed。前端 Chromium 6 passed，vue-tsc、Vite、Ruff、uv lock --check、双包清单和 Python 3.12.15 隔离 wheel 安装均通过。宿主启动再次失败，历史结果见 [交接中的验证记录](../.agents/handoff/core/verification.md)。远程 GitHub Actions 状态单独记录。

当时观察到中文缺少 `vue-basic.pen-tooltip`，测试出现英文回退警告；上传代码尚未检查 HTTP 状态和响应 name；保存后恢复 Canvas 像素当时缺少真实宿主验证。2026-11-17 的记录补验了像素恢复并修复了该中文词条。见[迁移前侧栏记录](react-sidebar.md)。

当时切换 Python 环境时，曾将旧 3.13.15 `.venv` 临时移至 `.venv-backup-3.13`。含绝对路径的 console script 需恢复到原 `.venv` 路径后使用。

`.pre-commit-config.yaml` 仍固定 Ruff v0.4.9，与 uv/CI Ruff 0.17.5 不一致；本轮未运行会自动改文件的 pre-commit。根 pyproject 有 mypy 配置，但 mypy 未作为项目依赖或 CI 检查，不能宣称完整 Python 类型检查通过。当前 vue-tsc 覆盖 `frontend/src` 与 `extension` 的前端源码，排除测试。

## 迁移前侧栏验证

旧 React 入口、Jest 测试及其宿主环境见 [历史记录](react-sidebar.md)。现行侧栏、资料库、科学节点和绘图均由 Vitest Chromium 与对应 Playwright 宿主脚本验证。

## 隔离的本地存储验收

在隔离宿主进程设置 `ASTROPHOTO_HOME`，例如 `C:/AstroPhoto-Test/astrophoto`，并使用 `--listen 127.0.0.1`、单用户、关闭 CORS。浏览器从同源访问本机 API，侧栏发送 `X-AstroPhoto-Local: 1`。当前宿主按部署和请求判断受信本机，存储与素材路径导入无需设置旧的 `ASTROPHOTO_LOCAL_STORAGE` 或 `ASTROPHOTO_IMPORT_ROOTS`。在 Assets 中使用服务器可访问的本地素材，先预检，再提交。

需要合并执行扩展回归时，从仓库根运行 `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q`。独立 MCP 仍使用上面的 workspace 命令。

默认配置下宿主测试与真实跨卷测试会跳过。在支持的 Windows 测试主机上，
用 `ASTROPHOTO_TEST_SECOND_VOLUME` 指定可创建临时目录的第二卷，测试断言设备号不同。
`COMFYUI_TEST_URL` 指向隔离宿主后，`pytest -m host` 验证状态和 Node 注册。
浏览器全链路脚本另需设置 `ASTROPHOTO_TEST_STORAGE_ROOT` 为隔离运行目录，其中 `astrophoto/` 为该宿主 Data Root。运行 `pnpm -C frontend test:storage-host`。脚本创建测试工作区，迁移后通过 API 恢复原默认项、解除测试登记并回读确认。正常退出清理另用非空缓存并在重启前验证。
SQLite 文件系统测试、aiohttp 替身宿主、真实宿主及未覆盖项的证据见 [本地存储交付](local-storage.md)。


## 设备与光路开发验收

新建独立 `ASTROPHOTO_HOME` 测试根以验证 Alembic 初始化。符合设备基线的旧库可升级至摄影素材库版本，未知或结构不匹配的开发 schema 将保留原库并报告 `DEV_SCHEMA_RESET_REQUIRED`。使用新的临时目录即可启动验证，不需删除旧根或碰触原始素材。

- `uv run pytest tests/backend/test_equipment.py tests/integration/test_equipment_api.py -q`
- `pnpm -C frontend test` 覆盖懒加载、字段错误、导航与暂存。
- 真实宿主使用隔离的 ComfyUI 环境，保持 loopback 单用户，隔离 Data Root、用户、输入、输出及 temp 目录。确认 `COMFYUI_TEST_URL` 指向隔离实例，设置新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`（短字母数字标识），运行 `pnpm -C frontend test:equipment-host`。用例结束后通过 API 先删测试光路、再删设备，核对 204 回执与 GET 404。重启持久化是一次跨进程用例，先运行 `pnpm -C frontend test:equipment-host --prepare-restart`，用同一个测试根和运行标识重启，再运行 `pnpm -C frontend test:equipment-host --verify-restart`，结束时执行 API 清理。
- 在同一隔离实例中，可用 `pnpm -C frontend test:equipment-host --verify-restart --verify-delete` 追加永久删除验证。脚本先检查被光路引用的相机会阻止删除，再删除本次运行创建的光路及其相机，并验证其他测试设备在用例断言阶段仍在。随后统一清理本次剩余记录。每次完整重跑应使用新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`。
- MCP 使用独立测试环境运行 `uv run --project mcp pytest mcp/tests -q`。显式凭据配置见 [MCP](mcp.md)。

## 摄影素材库宿主验收

`frontend/tests/host/assets-host.mjs` 是独立 Playwright 脚本。设置 `COMFYUI_TEST_URL` 为隔离的 `http://127.0.0.1:<port>`，`ASTROPHOTO_TEST_ASSETS_ROOT` 为该宿主实际 Data Root 的绝对路径（脚本会核对），`ASTROPHOTO_TEST_ASSET_SOURCE` 为宿主可读的专用测试素材绝对路径。使用之前安装的 Chromium，从仓库根运行 `node frontend/tests/host/assets-host.mjs`。

## Siril 1.4.5 验证

扩展增加 Astropy 和 Pillow，保持 uv workspace 与宿主分离。历史 comfyenv 验证曾通过独立目录提供 Astropy 及配套包。真实宿主需使用能加载扩展运行依赖的隔离环境。
设置 ASTROPHOTO_SIRIL_TEST_CLI 后运行 Python 测试以启用真实 CLI 用例。
运行 `pnpm -C frontend test:siril-host` 前，指定隔离 `COMFYUI_TEST_URL`、`ASTROPHOTO_SIRIL_TEST_CLI`、专用测试 FITS 的 `ASTROPHOTO_SIRIL_TEST_FITS` 和证据目录 `ASTROPHOTO_SIRIL_EVIDENCE`。
完整矩阵见 [Siril 实现](siril.md)。
