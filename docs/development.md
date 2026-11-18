# 开发与验证

## 两套环境

| 环境 | 当前基准 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12.15、独立根 .venv | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | Conda comfyenv：Python 3.12.16、Torch 2.14.1+cu130、Backend 0.45.0、Frontend 1.59.1 | 真实节点加载、执行、UI 与状态路由 |
| CI | Python 3.11 / 3.12，Node 22 | 支持范围与独立自动验证 |

.python-version 为 3.12；最低发行 requires-python 仍为 >=3.11。根 uv.lock 和 MCP workspace
保持单一来源。切换前检查了旧 .venv（Python 3.13.15），已移动到 .venv-backup-3.13 保存；
备份不被 Git/Registry 打包。不要从备份直接运行带旧绝对路径的 console scripts；若需恢复，
应在没有使用当前环境的进程时将其移回原 .venv 路径。

**绝不在 ComfyUI 宿主环境执行 uv sync。** 未升级或修改宿主 Torch、NumPy、Pillow、ComfyUI。
开发环境不安装这些重型宿主包，V3 单元测试明确使用 test doubles。

## 安装与日常命令

从仓库根目录执行，使用 uv 0.13.8、pnpm 11.13.1（本机 Node 26.8.2，CI Node 22）：

```sh
uv sync --frozen
uv run python --version
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend exec playwright install chromium
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test:react
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
另加载真实构建 main.js 验证独立 Vue/PrimeVue 初始化、主题、国际化与 onRemove 清理。
这些都不等于真实 ComfyUI 宿主验收。

### Host Runtime Verification

先激活正确环境，从当前项目目录进入宿主，再显式指定地址（PowerShell）：

```powershell
conda activate comfyenv
cd ..
cd ..
python main.py
```

开发测试使用另一个终端，回到 AstroPhoto 仓库根目录：

```powershell
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
uv run pytest tests/integration -m host
pnpm -C frontend test:host
```

未设置地址时测试跳过，不启动 ComfyUI、不修改宿主环境。
检查 /astrophoto/v1/status 和 /object_info/vue-basic 后，还需浏览器手工验证
vue-basic → Preview Image 的绘图、保存工作流、重新打开与 IMAGE 输出。

本次实际尝试在 ComfyUI 目录运行：

```sh
python main.py --cpu --listen 127.0.0.1 --port 8199 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto
```

上述历史尝试误用了 Anaconda base：Torch 2.3.0+cpu 没有 torch.library.custom_op。
后来激活 comfyenv，未升级任何宿主依赖即成功启动。V3 加载、状态接口和 Sidebar 交互
现已通过；不能再以 base 环境错误称宿主阻塞。
Vue 像素恢复已修复；`test:host` 默认仍会因原有 IMAGE 路径问题退出 1，按用户要求不修该项。
本次前端验证使用 `pnpm -C frontend test:host --skip-image-execution` 显式跳过该执行测试；完整结果见
[React Sidebar](react-sidebar.md)。它会产生 temp 图片和执行历史，并在结束后恢复测试修改的语言/主题设置。

### Packaging Verification

```sh
uv run pytest tests/packaging
uv build mcp --no-sources --out-dir dist/mcp
uv run python scripts/release.py registry
uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz
uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1
uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py
```

根 pytest 默认收集 nodes/backend/integration/packaging，真实 host 测试默认 skip；不扫描
reference 或 MCP 的测试。MCP 有自己的 pytest 配置和 dev 依赖，保留独立入口。

## 新增依赖与前端边界

- HTTP 层使用 ComfyUI 已提供的 aiohttp，存储层增加独立 SQLAlchemy 2、Alembic 与 FileLock；独立 dev group 新增 aiohttp>=3.9,<4，
  实际锁定 3.14.5，与宿主已安装版本一致。没有安装 SQLAlchemy/Alembic/Astropy/LangChain。
- TypeScript 5.9.3、vue-tsc 3.3.14 独立执行；strict=true，skipLibCheck 仅跳过第三方声明内部检查。
  Vite build 仅构建，不替代源码类型检查。
- 类型包改为 @comfyorg/comfyui-frontend-types 1.59.1。它的 Vue peer 是 ^3.5.42，
  本项目保留 Vue 3.5.13；仅对这个纯类型依赖声明精确 peer 例外，源码类型/浏览器验证通过。
  这不是宿主运行时兼容性的替代证明。
- PrimeVue 4.3.3 和配套 Aura 4.3.3 由扩展独立安装/打包/初始化，vue-i18n 9.14.4 保持；
  这些旧版本的维护警告不在本次范围内以升级整个 UI 栈解决。主题使用独立 CSS 前缀。
- ComfyUI 1.59.1 不再安装 PrimeVue。前端通过原生 addDOMWidget 挂载独立 Vue app，
  使用官方 app/api URL；不导入内部 domWidget 模块，不依赖宿主 Vue 注入。

## 数据根目录

ASTROPHOTO_HOME 可设为绝对目录，默认 ~/.astrophoto/。状态 API 报告配置路径但不会创建它。
未来真实业务在显式操作时初始化数据库/运行目录；模型路径仍由 ComfyUI folder_paths 管理。

## 仓库复核记录（2026-11-16）

本轮重新执行：Python 3.12.15 根测试 22 passed / 1 skipped、MCP 52 passed；现有独立 Python 3.11.18 验证环境同样 22 passed / 1 skipped、MCP 52 passed。前端 Chromium 6 passed，vue-tsc、Vite、Ruff、uv lock --check、双包清单和 Python 3.12.15 隔离 wheel 安装均通过。宿主启动再次失败，完整原始日志见 [测试证据](handoffs/repository-verified-2026-11-16/07_TEST_EVIDENCE.md)。这些结果不是远程 GitHub Actions 已成功的证明。

本轮发现但未修改源码的问题：中文缺少 `vue-basic.pen-tooltip`，测试出现英文回退警告；上传代码尚未检查 HTTP 状态和响应 name；保存后恢复 Canvas 像素未获真实宿主验证。详见交接中的风险清单。

`.pre-commit-config.yaml` 仍固定 Ruff v0.4.9，与 uv/CI Ruff 0.17.5 不一致；本轮未运行会自动改文件的 pre-commit。根 pyproject 有 mypy 配置，但 mypy 未作为项目依赖或 CI 检查，不能宣称完整 Python 类型检查通过。前端 vue-tsc 只检查 src，排除了 tests。

## React Sidebar 增量验证

上述“仓库复核记录”属于历史快照；最新宿主使用 comfyenv。新增 React 位于 frontend/ui，
共用唯一 frontend/pnpm-lock.yaml 与 Vite 配置。`typecheck` 同时运行 vue-tsc 和 React tsc
（包含 React 测试）；`test:react` 为 Jest/RTL；`test` 仍为 Vue 浏览器测试。
需求映射、依赖精确版本、运行证据与两个真实失败见 [react-sidebar.md](react-sidebar.md)。

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
uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py
uv lock --check
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend test:react
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
- `pnpm -C frontend test:react` 覆盖懒加载、字段错误、导航与暂存。
- 真实宿主使用已有 `comfyenv`，保持 loopback 单用户，隔离 Data Root、用户、输入、输出及 temp 目录。设置 `ASTROPHOTO_LOCAL_STORAGE=1`。确认 `COMFYUI_TEST_URL` 指向隔离实例，设置新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`（短字母数字标识），运行 `pnpm -C frontend test:equipment-host`。停止并用**同一个测试根**重启宿主，再运行 `pnpm -C frontend test:equipment-host --verify-restart` 验证当前光路配置持久化。脚本会写入测试设备与光路。
- 在同一隔离实例中，可用 `pnpm -C frontend test:equipment-host --verify-restart --verify-delete` 追加永久删除验证。脚本先检查被光路引用的相机会阻止删除，再删除本次运行创建的光路及其相机，并验证其他测试设备仍在。每次完整重跑应使用新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`。
- MCP 使用独立测试环境运行 `uv run --project mcp pytest mcp/tests -q`。显式凭据配置见 [MCP](mcp.md)。

## Siril 1.4.5 验证

扩展增加 Astropy 和 Pillow，保持 uv workspace 与宿主分离。真实宿主验证使用现有 comfyenv，
Astropy 和其缺失的配套包通过独立目录提供，保持宿主 Torch、NumPy 和 Pillow 的已安装版本。
设置 ASTROPHOTO_SIRIL_TEST_CLI 后运行 Python 测试以启用真实 CLI 用例。
浏览器验收命令为 pnpm -C frontend exec node ui/siril-host.mjs，要求隔离 COMFYUI_TEST_URL、
ASTROPHOTO_SIRIL_TEST_CLI、已授权的 ASTROPHOTO_SIRIL_TEST_FITS 和 ASTROPHOTO_SIRIL_EVIDENCE。
完整矩阵见 [Siril 实现](siril.md)。
