# 开发与验证

## 仓库布局

从仓库根目录按任务定位实际入口。模块之间的依赖和运行生命周期见[系统架构](../architecture/overview.md)。

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
| `docs/`、`.agents/` | 长期文档与开发 Agent 工作资料。Feature、Skill 及历史资料的入口见[仓库指引](../../AGENTS.md)。 |

## 开发环境与宿主

前端界面默认采用适合 ComfyUI 侧栏的紧凑布局：控制控件高度、宽度、内外间距及字号，避免不必要的空白；优先使用宿主组件和主题，选择框及其选项也保持紧凑。可展开分区使用项目的 `DetailAccordion` 或与之相同的线条箭头折叠样式，不使用浏览器默认的实心三角标记。字号以较小、清晰可读为原则，不牺牲键盘操作、焦点提示或点击区域。检查中英文、长名称、缩放和窄侧栏，必要时换行或提供完整内容查看方式，不遮挡信息。仅在用户明确要求时使用 Computer Use 检查界面。

| 环境 | 当前基准 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12、独立根 `.venv` | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | 隔离 .venv：Python 3.12.16、Torch 2.15.0+cpu、Backend 0.46.0、Frontend 1.59.6 | 真实节点加载、执行、UI 与状态路由 |
| CI | Python 3.11 / 3.12，Node 26.13.1 | 支持范围与独立自动验证 |

`.python-version` 指定 3.12，两个发行包的 `requires-python` 均为 `>=3.11`。根项目和 MCP workspace member 共用一个 `uv.lock`。在仓库独立 `.venv` 内运行 `uv sync`，禁止向 ComfyUI 的 Python 环境同步工作区依赖。节点单元测试使用 V3 替身，宿主依赖及其原生扩展接口由隔离的 ComfyUI 提供。集成时优先复用目标版本的原生机制。

## 安装与日常命令

从仓库根目录执行。CI 固定 uv 0.13.8、Node 26.13.1 与 pnpm 11.13.1，前端使用自己的锁文件。Linux CI 安装 Playwright 时额外传 `--with-deps` 安装 Chromium 系统依赖。见 [CI 配置](../../.github/workflows/ci.yml)和[前端脚本](../../frontend/package.json)。

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

开发时 uv 从本地 workspace 解析 MCP，源码 `requirements.txt` 中的 `./mcp` 也从仓库根解析。可在已启动的 ComfyUI 之外单独启动 stdio 服务，本机连接和自动发现见 [MCP](../integrations/mcp.md)。

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
MCP 测试使用 FastMCP 内存 Client、HTTPX MockTransport 和可选真实 stdio 子进程，覆盖基础诊断、本机业务工具和自动发现。真实 stdio 按本轮授权范围单独执行或排除。

### Integration Tests

```sh
uv run pytest tests/integration -m "not host"
```

aiohttp TestServer/TestClient 测试真实 HTTP、原生 RouteTableDef、重复注册与状态变化，
但 ComfyUI 注册边界为替身。Vitest Chromium 运行 Canvas 真像素、触摸、上传序列化、错误分支，
另加载真实构建 main.js 验证独立 Vue 初始化、主题、国际化与 onRemove 清理。
真实 ComfyUI 加载与执行另由宿主用例验证。

### Host Runtime Verification

#### 本机前端预览

本机启动 ComfyUI 前端时，统一使用仓库下的 `.artifact/frontend-preview/` 工作区。复用其中的 `input/`、`output/`、`temp/`、`user/` 目录和下文指定的数据根。宿主程序和 Python 环境位于相邻的 `ComfyUI-migration-v0.46.0/`，其 `custom_nodes/ComfyUI_AstroPhoto` 指向本仓库。前端源码有更新且尚未构建时，先运行 `pnpm -C frontend build`。

验收时分别记录 ComfyUI CLI 和 Desktop 实机结果。CLI 用隔离 Data Root 和回环地址，可验证扩展路由、stdio 连通性和常用端口回退。Desktop 还需启动一个已加载 AstroPhoto 的本机安装实例，核对 Desktop 端口锁记录的 PID、实际监听端口和 MCP 候选地址，并在宿主重启后检查重新发现。只有 Comfy Cloud 配置时，保留 Desktop 本机项的未覆盖状态。

当前预览将 `ASTROPHOTO_HOME` 指向同一工作区内的 `astrophoto-train-v3/`。新数据根的默认工作区位于 `storage/Local/`，旧测试数据根由开发环境按需重建。

从仓库根目录打开宿主环境的 PowerShell 执行以下命令。在 Codex 中，启动与探测都使用宿主环境执行（`require_escalated`）。

```powershell
# 先检查端口。若已有监听，核对进程使用的是本预览工作区，再验证 HTTP。
Get-NetTCPConnection -LocalPort 8188 -State Listen -ErrorAction SilentlyContinue
```

端口空闲时启动；如果本预览实例已在运行，直接跳到 HTTP 验证。

```powershell
New-Item -ItemType Directory -Force -Path '.artifact/frontend-preview/input', '.artifact/frontend-preview/output', '.artifact/frontend-preview/temp', '.artifact/frontend-preview/user' | Out-Null
$previewRoot = (Resolve-Path '.artifact/frontend-preview').Path
$comfyHostRoot = (Resolve-Path '../ComfyUI-migration-v0.46.0').Path
$env:ASTROPHOTO_HOME = Join-Path $previewRoot 'astrophoto-train-v3'
$launchArgs = @(
    'main.py'
    '--cpu'
    '--listen', '127.0.0.1'
    '--port', '8188'
    '--disable-all-custom-nodes'
    '--whitelist-custom-nodes', 'ComfyUI_AstroPhoto'
    '--input-directory', ('"{0}\input"' -f $previewRoot)
    '--output-directory', ('"{0}\output"' -f $previewRoot)
    '--temp-directory', ('"{0}\temp"' -f $previewRoot)
    '--user-directory', ('"{0}\user"' -f $previewRoot)
)
Start-Process -FilePath (Join-Path $comfyHostRoot '.venv\Scripts\python.exe') `
    -WorkingDirectory $comfyHostRoot -ArgumentList $launchArgs -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $previewRoot 'comfy-stdout.log') `
    -RedirectStandardError (Join-Path $previewRoot 'comfy-stderr.log') -PassThru
```

在宿主环境等待 `comfy-stderr.log` 出现 `Starting server` 和 GUI 地址，然后执行：

```powershell
Get-Content .artifact/frontend-preview/comfy-stderr.log -Tail 20
curl.exe --noproxy '*' -sS -o NUL -w '%{http_code}\n' --max-time 5 http://127.0.0.1:8188/
curl.exe --noproxy '*' -sS -o NUL -w '%{http_code}\n' --max-time 5 http://127.0.0.1:8188/extensions/ComfyUI_AstroPhoto/main.js
```

新预览可以用以下命令生成、验证和导入分场景测试数据。导入命令核对当前宿主的数据根，并拒绝已有同名记录。

```powershell
.\.venv\Scripts\python.exe scripts/generate_library_test_assets.py .artifact/test-assets
.\.venv\Scripts\python.exe scripts/verify_library_test_assets.py .artifact/test-assets
.\.venv\Scripts\python.exe scripts/import_library_test_assets.py .artifact/test-assets --data-root .artifact/frontend-preview/astrophoto-train-v3 --seed-equipment --execute
```

首页返回 HTTP 200 即确认预览已启动。第二条请求确认 AstroPhoto 前端资源也返回 HTTP 200。进程 ID 只表明启动命令已创建进程，须等 HTTP 检查通过再报告就绪。

#### 宿主回归验证

迁移验收使用 ComfyUI `v0.46.0` 与 Frontend `1.59.6`。从隔离宿主的 `.venv` 启动 CPU 环境，监听回环，使用独立 Data Root、input、output、temp 及用户目录。本机业务 API 要求直接回环、单用户且未启用 CORS。以下 PowerShell 示例假定已准备可重开的基线工作流及证据目录，路径可替换为本机实际位置。先检查运行中宿主的状态和注册，再运行两种画布的浏览器用例。

```powershell
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
uv run pytest tests/integration -m host
$env:ASTROPHOTO_BASELINE_WORKFLOW = (Resolve-Path '.artifact/frontend-migration/baseline/workflow.json').Path
$env:ASTROPHOTO_MIGRATION_EVIDENCE = (Resolve-Path '.artifact/frontend-migration').Path
pnpm -C frontend test:host
pnpm -C frontend test:host --nodes-2
```

`test:host` 使用真实浏览器检查侧栏、画布和旧工作流重开，绘图验收到临时 PNG 和 `[temp]` prompt 引用。Python `LoadImage` 到下游节点的完整执行仍待单独复验。实际宿主脚本位于 `frontend/tests/host/`。缺少基线文件时，从迁移前检出保存包含已绘制像素、FITS 来源和 AutoStretch 的工作流。历史 Backend 0.45.0 / Frontend 1.59.1 宿主测试中，绘图节点将解析后的临时绝对路径交给 LoadImage 时触发路径边界错误；该历史现象不代表当前版本仍可复现，完整 IMAGE 执行需在目标宿主重新验证。

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

开发验证从独立的 V1 Data Root 初始化。遇到开发期数据库，按[存储基线](../domains/storage.md#v1-数据与接口)切换到新的隔离位置。

`ASTROPHOTO_HOME` 可设为绝对目录，默认 `~/.astrophoto/`。宿主在 V3 `on_load` 初始化存储。读取配置和查询状态只读。四目录首建使用隔离的空数据根，宿主启动后核对 `config/`、`database/assets.db`、`storage/Local/` 和 `runtime/locks/`。已存在的旧目录布局由开发者保留，四目录验证可另选空根。维护和迁移操作见[本地存储](../domains/storage.md)。

扩展侧的初始化测试入口为 `tests/backend/test_storage_init.py`、`tests/integration/test_storage_api.py` 和 `tests/integration/test_storage_init.py`。集成用例直接调用扩展的 HTTP 接口，MCP 工具清单由 MCP 包的测试独立核对。

## 验证边界

历史 Feature 的运行结果和范围保留在 `.agents/features/archive/`。真实 Desktop 端口锁与第二物理卷未在 Agent 管理 Feature 的最终范围中实测。绘图节点到下游 IMAGE 的完整宿主执行仍需复验。

## Pi 自然语言只读联调

在配置好 Pi 默认模型与本机 AstroPhoto MCP，并启动 8188 预览宿主后，从仓库根运行 `.venv\Scripts\python.exe benchmark\checks\pi_astrophoto.py`。脚本通过独立 stdio MCP 查询取得对照，再让 Pi 以自然语言查询设备、素材和项目；为本次运行使用独立的 Pi 项目 MCP 配置和直接暴露的三个发现入口。输出位于 `.artifact/pi-astrophoto-smoke/<运行编号>/`，包括可读对话、Pi 会话和事件、工具调用、对照结果及测试摘要。`review_required` 表示需人工核对回答与对照数据，不是验收通过。该脚本禁用 Skill 和普通内置工具；不验证 Skill 激活，也不验证写入操作。日志可能包含数据名称及本地路径，分享前需检查。
