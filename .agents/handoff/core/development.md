# 开发环境与复验命令

## 两套环境

| 环境 | 仓库配置或历史实测 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12.15、独立根 .venv | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | 隔离 Python 3.12.16、Torch 2.15.0+cpu、ComfyUI 0.46.0、Frontend 1.59.6 | 真实节点加载、执行、UI 与状态路由 |
| CI | Python 3.11 / 3.12，Node 26.13.1 | 支持范围与独立自动验证 |

.python-version 为 3.12；最低发行 requires-python 仍为 >=3.11。根 uv.lock 和 MCP workspace
保持单一来源。切换前检查了旧 .venv（Python 3.13.15），已移动到 .venv-backup-3.13 保存；
备份不被 Git/Registry 打包。不要从备份直接运行带旧绝对路径的 console scripts；若需恢复，
应在没有使用当前环境的进程时将其移回原 .venv 路径。

**绝不在 ComfyUI 宿主环境执行 uv sync。** 未升级或修改宿主 Torch、NumPy、Pillow、ComfyUI。
开发环境不安装这些重型宿主包，V3 单元测试明确使用 test doubles。

## 安装与日常命令

从仓库根目录执行。当前 CI 固定 uv 0.13.8、pnpm 11.13.1、Node 26.13.1；实际本机 Node 版本按验证记录单独确认。

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


## 额外验收准备

可信本地业务宿主显式设置 ASTROPHOTO_LOCAL_STORAGE=1，监听回环，保持单用户并关闭 CORS。用独立 ASTROPHOTO_HOME 和指定 ASTROPHOTO_IMPORT_ROOTS；不要在用户活动数据根里做写入验收。设置 ASTROPHOTO_SIRIL_TEST_CLI 可启用真实 Siril 测试，设置 ASTROPHOTO_TEST_SECOND_VOLUME 可运行授权跨卷测试。目标宿主脚本在 frontend/tests/host/，先核对当前 UI 前置和断言。

### MCP 设备只读配置

将相同的 `ASTROPHOTO_EQUIPMENT_READ_TOKEN` 分别设置在可信 ComfyUI 宿主和独立 MCP 进程的环境中，启动或重启两个进程。值必须为 43–256 个 ASCII 字母数字或 -_。MCP 的 `COMFYUI_URL` 或 `--comfy-url` 指向回环 IP 和根路径，例如 `http://127.0.0.1:8188`。用 tools/list 验证出现八个工具，再调用 equipment_list 确认服务端也授权；仅出现工具不足以证明服务端 token 匹配。不要将凭据写入示例或日志。

## 开发约定与宿主版本选择

- Python 默认 3.12，软件最低 3.11。根 uv 管理两个 Python 项目；前端一个 pnpm lockfile 和一套 Vite 配置。依赖变化须同步锁，CI 用 frozen 安装。旧目录和已生成 JS/CSS 可用于行为对照。
- Python Ruff 的项目规则关注未定义引用、空白和动态执行；CI 静态检查覆盖 Extension、MCP、脚本和测试。仓库编辑默认 UTF-8、LF、文件末尾换行；生成的 js 按 Git 属性单独处理。前端统一 Vue 类型检查、ESLint 与 Vitest Chromium，单独检查代理构件和真实宿主。
- 历史真实宿主是 comfyenv / 0.45.0 / 1.59.1。P0 前端迁移正式目标是官方 0.46.0 / 1.59.6。官方独立前端的依赖声明、已发布类型包、本机 Node 和 CI 环境可能不同，不能只凭类型编译推断真实宿主兼容。迁移须分别确认 Node/pnpm/Vite 可用组合、宿主公开 API 与内部适配层。
- Feature 文档通过 `$feature-pipeline` 管理。先读 `00_FEATURE_INDEX.md`，按请求加载 PRD、UXUI、TECH、DEV、TEST_PLAN、TEST_REPORT 或 CLOSE 指引。初始化、阶段转换、变更传播、归档与重开按共享规则处理。跨会话任务用 `$task-notes` 保存状态，收尾用 `$handoff-maintenance` 核对两层交接。工程决策、接口和测试变化完成后同步到交接包。编写项目代码先查匹配版本的官方原生能力并记录复用原因，详见 [决策与交互风格](decisions.md)。

## 宿主专项复验的输入和副作用

| 验证 | 安排 |
| --- | --- |
| 浏览器宿主 | 用独立 host base、用户目录、输入/输出和临时目录启动，`COMFYUI_TEST_URL` 指向该实例。`pytest -m host` 只查 HTTP 状态及节点 Schema，浏览器脚本另测界面、上传和队列。 |
| 资产和迁移 | 配置独立 Data Root 和授权的 `ASTROPHOTO_IMPORT_ROOTS`，使用测试素材 `ASTROPHOTO_TEST_CAPTURE` 和未占用的 `ASTROPHOTO_TEST_MIGRATION_TARGET` 运行 `pnpm -C frontend test:storage-host`。该脚本会写入副本、变更工作区并生成回执。第二卷测试通过 `ASTROPHOTO_TEST_SECOND_VOLUME` 启用。 |
| 设备和光路 | 在独立根设置新的 `ASTROPHOTO_TEST_EQUIPMENT_RUN`，运行 `pnpm -C frontend test:equipment-host`。默认退出时经 API 删除该次记录；跨重启先用 `--prepare-restart`，保留该测试根与标识，重启后用 `--verify-restart`，可追加 `--verify-delete`，最终阶段执行 API 清理。 |
| Siril | `ASTROPHOTO_SIRIL_TEST_CLI` 启用真实 Python CLI 试验。浏览器还需 `ASTROPHOTO_SIRIL_TEST_FITS`、`ASTROPHOTO_SIRIL_EVIDENCE` 及隔离宿主，运行 `pnpm -C frontend test:siril-host`。准备可保留的科学输入、工作区和实际输出验证。 |
| 构件与子路径 | `pnpm -C frontend check:build` 核对构件；`pnpm -C frontend check:proxy` 在 Chromium 检查嵌套 URL 中的宿主导入、脚本和样式。不能用代理资源加载结果推断本地业务权限允许反代。 |

若隔离宿主连不上，不要将只读状态、宿主替身测试或跳过视为通过。责任分配与各阶段证据见 [验证](verification.md)。
