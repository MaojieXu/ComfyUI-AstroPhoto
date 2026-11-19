# 技术栈与环境

本轮实际查询版本；Python运行环境与声明范围分列。完整查询和API签名见evidence/dev-versions-api.txt、host-versions.txt、frontend-versions.txt、lock-versions.json。锁文件不是宿主锁。

| 组件 | 本轮实际版本/约束 | 来源/状态 |
| --- | --- | --- |
| Extension / MCP | 0.0.1 / 0.0.1 | 两份pyproject、版本测试、wheel metadata VERIFIED |
| 开发Python | 3.12.15；默认3.12 | .venv、.python-version VERIFIED |
| 最低支持/本地补测 | >=3.11；3.11.18测试通过 | 两份pyproject、py311日志 VERIFIED |
| 宿主Python | 3.12.4 Anaconda | 指定宿主解释器查询 VERIFIED |
| ComfyUI Backend / Frontend | 0.45.0 / 1.59.1 | host comfyui_version.py与安装metadata VERIFIED版本；运行被阻塞 |
| Torch / NumPy / Pillow | 2.3.0 / 1.26.4 / 10.3.0 | host安装metadata VERIFIED；不表示整体依赖健康 |
| aiohttp | dev/host均3.14.5 | dev约束>=3.9,<4；host提供运行时 |
| FastMCP | 4.2.0固定 | 独立fastmcp包，Requires-Python>=3.11 |
| MCP SDK / HTTPX / Pydantic | 2.3.0 / 0.28.1 / 2.14.3 | 锁与安装一致；HTTPX约束>=0.28,<1 |
| pytest / Ruff / comfy-cli | 8.4.2 / 0.17.5 / 1.26.0 | uv.lock与实际查询 |
| uv / pnpm / Node | 0.13.8 / 11.13.1 / 26.8.2 | 本机命令；CI Node22、Python3.11/3.12为配置 |
| Vue / PrimeVue / Aura | 3.5.13 / 4.3.3 / 4.3.3 | pnpm安装及lock；扩展自带 |
| vue-i18n | 9.14.4 | 自带运行时；中文tooltip缺键 |
| Vite / plugin-vue / vue-devtools | 6.3.5 / 5.2.3 / 7.7.2 | 安装及pnpm-lock，package中部分为范围 |
| TypeScript / vue-tsc / ComfyUI类型包 | 5.9.3 / 3.3.14 / 1.59.1 | 已配置独立类型检查 |
| Vitest / browser-playwright | 4.0.18 / 4.0.18 | Chromium实际运行 |
| Vue Test Utils / Playwright | 2.6.0 / 1.65.1 | 实际安装 |
| Hatchling | >=1.27,<2；本轮精确build版本UNKNOWN | 独立build-system，不在uv.lock；历史1.33.0不可直接沿用 |
| pre-commit Ruff | v0.4.9 | 仅配置；与上述0.17.5 CONFLICT，未执行自动fix |

SQLAlchemy、Alembic、Astropy、LangChain、sqlite-vec、FastEmbed是PLANNED，不能把历史选型表当已安装项目依赖。FastMCP间接安装Starlette1.10.0/Uvicorn0.54.0，不代表本项目启用HTTP服务。根LICENSE是GPLv3全文，MCP metadata声明GPL-3.0-only且LICENSE字节一致；根metadata写GNU General Public License v3，未在本轮变更许可。

原3.13环境仍保存在.venv-backup-3.13；不从该目录直接执行含旧绝对路径的console scripts。开发/宿主共用源码而不共用Python环境；本轮未uv sync宿主或升级任何宿主包。

---

# 开发与验证

## 两套环境

| 环境 | 当前基准 | 用途 |
| --- | --- | --- |
| uv workspace | Python 3.12.15、独立根 .venv | 开发、单元/HTTP 集成、MCP、打包测试 |
| ComfyUI 宿主 | Python 3.12.4、Backend 0.45.0、Frontend 1.59.1 | 真实节点加载、执行、UI 与状态路由 |
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
pnpm -C frontend build
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

宿主修复后，先正常启动 ComfyUI，再显式指定地址（PowerShell）：

```powershell
$env:COMFYUI_TEST_URL = 'http://127.0.0.1:8188'
uv run pytest tests/integration -m host
```

未设置地址时测试跳过，不启动 ComfyUI、不修改宿主环境。
检查 /astrophoto/v1/status 和 /object_info/vue-basic 后，还需浏览器手工验证
vue-basic → Preview Image 的绘图、保存工作流、重新打开与 IMAGE 输出。

本次实际尝试在 ComfyUI 目录运行：

```sh
python main.py --cpu --listen 127.0.0.1 --port 8199 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto
```

宿主在插件加载前失败：Torch 2.3.0+cpu 没有 torch.library.custom_op，comfy_kitchen 导入失败。
直接导入 comfy_api.latest 也失败。因此真实 V3 加载、状态路由访问与 Frontend 1.59.1 交互
仍未完成，不以隔离测试冒充通过。未主动修复/升级宿主核心依赖。

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

- 后端只使用标准库与 ComfyUI 已提供的 aiohttp；独立 dev group 新增 aiohttp>=3.9,<4，
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

本轮重新执行：Python 3.12.15 根测试 22 passed / 1 skipped、MCP 52 passed；现有独立 Python 3.11.18 验证环境同样 22 passed / 1 skipped、MCP 52 passed。前端 Chromium 6 passed，vue-tsc、Vite、Ruff、uv lock --check、双包清单和 Python 3.12.15 隔离 wheel 安装均通过。宿主启动再次失败，完整原始日志见 [测试证据](07_TEST_EVIDENCE.md)。这些结果不是远程 GitHub Actions 已成功的证明。

本轮发现但未修改源码的问题：中文缺少 `vue-basic.pen-tooltip`，测试出现英文回退警告；上传代码尚未检查 HTTP 状态和响应 name；保存后恢复 Canvas 像素未获真实宿主验证。详见交接中的风险清单。

`.pre-commit-config.yaml` 仍固定 Ruff v0.4.9，与 uv/CI Ruff 0.17.5 不一致；本轮未运行会自动改文件的 pre-commit。根 pyproject 有 mypy 配置，但 mypy 未作为项目依赖或 CI 检查，不能宣称完整 Python 类型检查通过。前端 vue-tsc 只检查 src，排除了 tests。
