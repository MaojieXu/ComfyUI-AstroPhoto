# 开发与验证

## 两套环境

| 环境 | 当前基准 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12.15、独立根 .venv | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | 隔离 .venv：Python 3.12.16、Torch 2.15.0+cpu、Backend 0.46.0、Frontend 1.59.6 | 真实节点加载、执行、UI 与状态路由 |
| CI | Python 3.11 / 3.12，Node 26.13.1 | 支持范围与独立自动验证 |

.python-version 为 3.12；最低发行 requires-python 仍为 >=3.11。根 uv.lock 和 MCP workspace
保持单一来源。切换前检查了旧 .venv（Python 3.13.15），已移动到 .venv-backup-3.13 保存；
备份不被 Git/Registry 打包。不要从备份直接运行带旧绝对路径的 console scripts；若需恢复，
应在没有使用当前环境的进程时将其移回原 .venv 路径。

**绝不在 ComfyUI 宿主环境执行 uv sync。** 未升级或修改宿主 Torch、NumPy、Pillow、ComfyUI。
开发环境不安装这些重型宿主包，V3 单元测试明确使用 test doubles。

## 安装与日常命令

从仓库根目录执行，使用 uv 0.13.8、pnpm 11.13.1（Node 26.13.1）：

```sh
uv sync --frozen
uv run python --version
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend exec playwright install chromium
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test
pnpm -C frontend build
pnpm -C frontend check:build
```

不需要 MCP 已发布：uv source 指向本地 workspace member。源码 requirements.txt 的 ./mcp
也只能在源码根目录安装；正式 Registry 包由 release.py 替换为同版本 PyPI pin。

## 四类验证

### Unit Tests

```sh
uv run pytest tests/nodes tests/backend
uv run --project mcp pytest mcp/tests
```

节点测试核验 V3 entrypoint、节点列表、Schema、输入校验和 LoadImage 委托/NodeOutput，
使用按 0.45.0 源码签名编写的窄 test double。Core 测试验证路径/配置和导入无写入副作用。
MCP 使用 FastMCP 内存 Client、HTTPX MockTransport 和真实 stdio 子进程，保留两个 Tool 契约。

### Integration Tests

```sh
uv run pytest tests/integration -m "not host"
pnpm -C frontend test
```

aiohttp TestServer/TestClient 测试真实 HTTP、原生 RouteTableDef、重复注册与状态变化，
但 ComfyUI 注册边界为替身。Vitest Chromium 运行 Canvas 真像素、触摸、上传序列化、错误分支，
另加载真实构建 main.js 验证独立 Vue 初始化、主题、国际化与 onRemove 清理。
这些都不等于真实 ComfyUI 宿主验收。

### Host Runtime Verification

迁移验收使用 ComfyUI `v0.46.0` 与 Frontend `1.59.6`。从隔离宿主的 `.venv` 启动 CPU 环境，监听回环，使用独立 Data Root、input、output、temp 及用户目录。需要真实本机 API 时，设置 `ASTROPHOTO_LOCAL_STORAGE=1` 和授权导入根。在 AstroPhoto 仓库根执行：

```powershell
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
$env:ASTROPHOTO_BASELINE_WORKFLOW = (Resolve-Path '.artifact/frontend-migration/baseline/workflow.json').Path
$env:ASTROPHOTO_MIGRATION_EVIDENCE = (Resolve-Path '.artifact/frontend-migration').Path
pnpm -C frontend test:host
pnpm -C frontend test:host --nodes-2
```

`test:host` 使用真实浏览器检查侧栏、画布和旧工作流重开，绘图验收到临时 PNG 和 `[temp]` prompt 引用。不改变已知的 Python LoadImage 下游问题。实际宿主脚本位于 `frontend/tests/host/`。缺少基线文件时，从迁移前检出保存包含已绘制像素、FITS 来源和 AutoStretch 的工作流。历史 0.45.0 / 1.59.1 的证据见 [React 迁移前记录](react-sidebar.md)。

### Packaging Verification

```sh
uv run pytest tests/packaging
uv build mcp --no-sources --out-dir dist/mcp
uv run python scripts/release.py registry
uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz
uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1
uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py
```

根 pytest 默认收集 nodes/backend/integration/packaging，真实 host 测试默认 skip；不扫描
reference 或 MCP 的测试。MCP 有自己的 pytest 配置和 dev 依赖，保留独立入口。

## 现行前端边界

Vite 8、Vue 插件与 Tailwind 接法对齐 ComfyUI Frontend `v1.59.6`，保留独立的 AstroPhoto 配置和锁。`extension/frontend-entry.ts` 组装公共 `frontend/src/main.ts` 与 Siril Bundle，运行构件为 `js/main.js` 和 `js/assets/main.css`。宿主 `app`、`api` 仍走相对链接。Vue 和 Vue I18n 由扩展自己的构建提供，按宿主回调挂载和释放；绘图使用作用域样式，Tailwind 不引入全局重置。

## 数据根目录

ASTROPHOTO_HOME 可设为绝对目录，默认 ~/.astrophoto/。状态 API 报告配置路径但不会创建它。
未来真实业务在显式操作时初始化数据库/运行目录；模型路径仍由 ComfyUI folder_paths 管理。

## 仓库复核记录（2026-11-16）

本轮重新执行：Python 3.12.15 根测试 22 passed / 1 skipped、MCP 52 passed；现有独立 Python 3.11.18 验证环境同样 22 passed / 1 skipped、MCP 52 passed。前端 Chromium 6 passed，vue-tsc、Vite、Ruff、uv lock --check、双包清单和 Python 3.12.15 隔离 wheel 安装均通过。宿主启动再次失败，历史结果见 [交接中的验证记录](../.agents/handoff/core/verification.md)。远程 GitHub Actions 状态单独记录。

本轮发现但未修改源码的问题：中文缺少 `vue-basic.pen-tooltip`，测试出现英文回退警告；上传代码尚未检查 HTTP 状态和响应 name；保存后恢复 Canvas 像素未获真实宿主验证。详见交接中的风险清单。

`.pre-commit-config.yaml` 仍固定 Ruff v0.4.9，与 uv/CI Ruff 0.17.5 不一致；本轮未运行会自动改文件的 pre-commit。根 pyproject 有 mypy 配置，但 mypy 未作为项目依赖或 CI 检查，不能宣称完整 Python 类型检查通过。前端 vue-tsc 只检查 src，排除了 tests。

## 迁移前侧栏验证

旧 React 入口、Jest 测试及其宿主环境见 [历史记录](react-sidebar.md)。现行侧栏、资料库、科学节点和绘图均由 Vitest Chromium 与对应 Playwright 宿主脚本验证。

## 隔离的本地存储验收

Storage 入口在本机、单用户、关闭 CORS 的 ComfyUI 实例中显式启用。
测试启动必须使用独立的 host base 和 AstroPhoto Data Root，并指定已授权的素材目录。
以下例子假定测试准备流程已创建这些专用目录，且宿主是经允许启动的独立实例。

```powershell
$env:ASTROPHOTO_HOME = 'C:/AstroPhoto-Test/data'
$env:ASTROPHOTO_LOCAL_STORAGE = '1'
$env:ASTROPHOTO_IMPORT_ROOTS = 'C:/AstroPhoto-Test/capture;D:/AstroPhoto-Test/capture'
```

使用宿主 `--listen 127.0.0.1`。Storage API 读写要求同源直连及自定义请求头
`X-AstroPhoto-Local: 1`，Sidebar 自动发送。外部监听、多用户及转发请求的 UI 显示不可用。
本机用户在 Assets 中输入 ComfyUI 服务端绝对路径，一行一个来源，先检查文件和空间再提交。

```powershell
uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q
uv run --project mcp pytest mcp/tests -q
uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py
uv lock --check
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test
pnpm -C frontend test
pnpm -C frontend build
pnpm -C frontend check:build
pnpm -C frontend check:proxy
```

默认配置下宿主测试与真实跨卷测试会跳过。在支持的 Windows 测试主机上，
用 `ASTROPHOTO_TEST_SECOND_VOLUME` 指定可创建临时目录的第二卷，测试断言设备号不同。
`COMFYUI_TEST_URL` 指向隔离宿主后，`pytest -m host` 验证状态和 Node 注册。
浏览器全链路脚本额外接收 `ASTROPHOTO_TEST_CAPTURE` 与一个尚未使用的
`ASTROPHOTO_TEST_MIGRATION_TARGET`，运行 `pnpm -C frontend test:storage-host`。
该脚本会创建受管副本并迁移默认 Workspace，务必只用于隔离数据。
SQLite 文件系统测试、aiohttp 替身宿主、真实宿主及未覆盖项的证据见 [本地存储交付](local-storage.md)。


## 设备与光路开发验收

新建独立 `ASTROPHOTO_HOME` 测试根以验证统一 Alembic 基线。运行时遇到旧设备/Storage 开发 schema 时保留数据库并报告 `DEV_SCHEMA_RESET_REQUIRED`。使用新的临时目录即可启动验证，不需删除旧根或碰触原始素材。

- `uv run pytest tests/backend/test_equipment.py tests/integration/test_equipment_api.py -q`
- `pnpm -C frontend test` 覆盖懒加载、字段错误、导航与暂存。
- 真实宿主使用已有 `comfyenv`，保持 loopback 单用户，隔离 Data Root、用户、输入、输出及 temp 目录。设置 `ASTROPHOTO_LOCAL_STORAGE=1`。确认 `COMFYUI_TEST_URL` 指向隔离实例，设置新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`（短字母数字标识），运行 `pnpm -C frontend test:equipment-host`。用例结束后通过 API 先删测试光路、再删设备，核对 204 回执与 GET 404。重启持久化是一次跨进程用例，先运行 `pnpm -C frontend test:equipment-host --prepare-restart`，用同一个测试根和运行标识重启，再运行 `pnpm -C frontend test:equipment-host --verify-restart`，结束时执行 API 清理。
- 在同一隔离实例中，可用 `pnpm -C frontend test:equipment-host --verify-restart --verify-delete` 追加永久删除验证。脚本先检查被光路引用的相机会阻止删除，再删除本次运行创建的光路及其相机，并验证其他测试设备在用例断言阶段仍在。随后统一清理本次剩余记录。每次完整重跑应使用新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`。
- MCP 使用独立测试环境运行 `uv run --project mcp pytest mcp/tests -q`。显式凭据配置见 [MCP](mcp.md)。

## Siril 1.4.5 验证

扩展增加 Astropy 和 Pillow，保持 uv workspace 与宿主分离。真实宿主验证使用现有 comfyenv，
Astropy 和其缺失的配套包通过独立目录提供，保持宿主 Torch、NumPy 和 Pillow 的已安装版本。
设置 ASTROPHOTO_SIRIL_TEST_CLI 后运行 Python 测试以启用真实 CLI 用例。
浏览器验收命令为 pnpm -C frontend test:siril-host，要求隔离 COMFYUI_TEST_URL、
ASTROPHOTO_SIRIL_TEST_CLI、已授权的 ASTROPHOTO_SIRIL_TEST_FITS 和 ASTROPHOTO_SIRIL_EVIDENCE。
完整矩阵见 [Siril 实现](siril.md)。
