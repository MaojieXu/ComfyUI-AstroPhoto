# 本轮验证证据

执行时间：2026-11-16 21:28 起（America/Chicago）；仓库根为默认cwd。命令在独立开发环境执行，例外明确注明。结果来自本轮工具输出，未引用历史通过数量充数。

## 命令与结果

| 检查 | 实际命令 | 结果 | 原始日志 |
| --- | --- | --- | --- |
| Extension单元/HTTP/发行 | `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 22 passed, 1 skipped；13单元+2HTTP+7发行；host skip | evidence/root-tests.txt |
| MCP内存/HTTP mock/CLI/stdio | `uv run --project mcp pytest mcp/tests -q` | 52 passed | evidence/mcp-tests.txt |
| Python3.11下限回归 | `& dist/check-py311/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration tests/packaging -q` | 22 passed, 1 skipped；Python3.11.18 | evidence/py311-root.txt |
| Python3.11 MCP | `& dist/check-py311/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests -q` | 52 passed | evidence/py311-mcp.txt |
| 前端类型 | `pnpm -C frontend typecheck` | vue-tsc成功；只src | evidence/typecheck.txt |
| 前端构建/浏览器 | `pnpm -C frontend test` | Vite成功，Chromium 3文件/6测试通过 | evidence/frontend-tests.txt |
| Python lint | `uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py` | All checks passed | evidence/ruff.txt |
| Workspace解析 | `uv lock --check` | 115包，锁未改 | evidence/uv-lock.txt |
| 前端peer | `pnpm -C frontend peers check` | 无peer问题（已配置类型包Vue例外） | evidence/peers.txt |
| Lockstep及Tag格式 | `uv run python scripts/release.py check --tag v0.0.1` | 0.0.1；仅检查字符串，没有创建Tag | evidence/version-check.txt |
| MCP独立构建 | `uv build mcp --no-sources --out-dir dist/mcp` | wheel+sdist成功 | evidence/build.txt |
| Registry暂存构建 | `uv run python scripts/release.py registry` | dist/registry.zip成功 | evidence/registry.txt |
| 发行清单 | `uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz` | Registry21 / wheel14 / sdist20，隔离与版本正确 | evidence/artifacts.txt |
| 独立安装+stdio | `uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1` | 新临时Python3.12.15 venv安装、initialize/list/version通过 | evidence/install.txt |
| 实际宿主启动 | `& C:/ProgramData/anaconda3/python.exe main.py --cpu --listen 127.0.0.1 --port 8199 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto`（ComfyUI根cwd） | **失败，退出1**；torch.library.custom_op缺失，未加载Extension | evidence/host-start.txt |
| 公共PyPI可用性 | Python urllib GET `https://pypi.org/pypi/astrophoto-mcp/0.0.1/json` | **HTTP404**；未发布 | evidence/pypi-availability.txt |

按Python3.12主验证入口计80个测试通过（22+52+6）、1个host跳过；3.11额外74通过/1跳过是同一套Python用例的另一个环境，不能当新增覆盖。Ruff/typecheck/build/install是检查项，不虚构pytest数量。

## 测试能证明什么

- Node测试用V3、folder_paths、LoadImage替身，仅断言契约/委托/返回对象，未处理真实IMAGE tensor。不可标“真实PNG到IMAGE端到端通过”。
- HTTP集成用真实aiohttp TestServer/TestClient和路由表，ComfyUI注册映射替身；证明返回/重复注册/冲突隔离，不证明真实PromptServer加载。
- 前端为真实Chromium Canvas像素与事件，ComfyUI API/node边界mock。构建JS测试使用独立Vue/PrimeVue主题，验证onRemove；没有实际Host图保存/重载。
- MCP52包含Tool Schema、URL优先级/反代、404/500/断线/超时/坏JSON、无效Skills、legacy与auto内存Client、子进程stdio和stdout逐行JSON。stdio测试调用version，不是假称已连接真实ComfyUI。
- 隔离wheel安装从本地wheel安装本包，依赖从公共PyPI解析；不是公共astrophoto-mcp0.0.1安装成功，也不是把MCP装进现有宿主。

## 附加运行查询

`uv --version`→0.13.8、`pnpm --version`→11.13.1、`node --version`→26.8.2。Python用importlib.metadata查询安装版本，FastMCP签名用inspect.signature记录。内存工具实际Schema及version结果见evidence/mcp-contract.json，未注册后端payload见status-example.json。

审计辅助抓取首次对Client CallToolResult调用model_dump失败，修正为读取其is_error/structured_content/content公开字段后成功；没有因此修改应用源码。不要把该Client结果误当Pydantic模型。

## 明确未执行

真实Host HTTP测试（未设置COMFYUI_TEST_URL）、真实画板保存重开/Preview Image、Manager安装更新、远程GitHub Actions、PyPI/Registry发布、业务软件/FITS/RAG/Memory/Skill Host兼容均未通过本轮运行验证。旧SDK1.30客户端、宿主3.12.4隔离wheel安装属于先前记录，本轮未重跑。未运行pre-commit自动fix和mypy；未修改或同步宿主环境。

## 包边界

Registry包含root入口、nodes、astrophoto10个Python模块、js/main.js及CSS、en/zh locales、README/LICENSE和发布metadata/requirements。无mcp/reference/frontend源码/tests/docs/notes/artifact/真实数据库；requirements为astrophoto-mcp==0.0.1。MCP wheel含9个自身源码模块和5个dist-info文件；无Extension源码或产品Skills。sdist20文件包含MCP自身测试。

---

## 当前发布操作文档快照

# 双包发布

根 `pyproject.toml` 是唯一版本来源；MCP 项目版本和 Extension 的
`astrophoto-mcp==X.Y.Z` 是生成/同步副本。当前发布流程支持稳定 SemVer
`X.Y.Z`（不接受前导零或预发布标签）。两个发行单元对应同一个 `vX.Y.Z` Tag。

## 准备与检查（不发布）

```sh
uv run python scripts/release.py sync 0.0.1
uv lock
uv run python scripts/release.py check --tag v0.0.1
pnpm --dir frontend run build
uv run pytest tests/nodes tests/backend tests/integration tests/packaging -m "not host"
pnpm -C frontend typecheck
uv run --project mcp pytest mcp/tests
pnpm -C frontend test
uv build mcp --no-sources --out-dir dist/mcp
uv run python scripts/release.py registry
uv run python scripts/release.py artifacts --registry dist/registry.zip --wheel dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --sdist dist/mcp/astrophoto_mcp-0.0.1.tar.gz
uv run python scripts/check_install.py dist/mcp/astrophoto_mcp-0.0.1-py3-none-any.whl --version 0.0.1
```

`sync` 不带版本参数时从根版本同步；它也同步 LICENSE。
更改版本后必须 `uv lock` 并提交锁文件。前端是私有构建项目，不独立发布。

当前两个项目的 `requires-python` 均为 `>=3.11`，MCP 固定依赖 `fastmcp==4.2.0`。
Extension 的同版本 MCP 强依赖意味着 Python 3.10 ComfyUI 环境不能安装本版发行包。
发布前须在目标宿主 Python 中确认依赖兼容；不能仅依据节点源码仍能在 3.10 解析。

## 安装与打包边界

- 源码 checkout：uv workspace 解析本地 MCP；requirements 使用 `./mcp`，因此未发布版本不阻塞开发。
- Registry ZIP：根入口、nodes、astrophoto（Core/Bootstrap/Status API）、js、locales、README、LICENSE、发布用 pyproject/requirements。
  requirements 和项目依赖都固定为 `astrophoto-mcp==X.Y.Z`；不含本地路径或 workspace 配置。
- MCP wheel：仅 `astrophoto_mcp/` 与 dist-info；sdist 仅 MCP 自身的源码、测试及元数据。
- `.comfyignore` 排除 mcp、reference、前端源码、工具、测试与开发资料。
  同时排除 Python 环境备份、.python-version、数据库/日志/临时数据；清单检查拒绝运行数据混入包内。
  打包器以 Git tracked + 非忽略的新文件准备暂存目录，经 `.comfyignore` 过滤，
  然后在临时 Git index 中调用 comfy-cli 官方 `zip_files`。不会修改用户 Git index。
  严格清单校验会拒绝意外根目录文件，避免悄悄混入发行包。

不要在源码 checkout 根直接执行 `comfy node publish`：发布必须使用经验证的
暂存包，其中 requirements 已替换为 PyPI pin。开发源码不依赖 Registry 包中不存在的 `mcp/`。
官方打包行为见 [comfy-cli file_utils](https://github.com/Comfy-Org/comfy-cli/blob/main/comfy_cli/file_utils.py)。

## CI 发布顺序

`release.yml` 的 Tag 触发流程复用 `ci.yml`：Python/浏览器测试与前端构建
→ MCP 构建 → 双包清单及隔离安装验证 → PyPI → 从公共 PyPI 独立安装并握手
→ Comfy Registry。不会创建 GitHub Release。

需预先设置 PyPI Trusted Publisher（对应 `pypi` GitHub environment），
以及 `comfy-registry` environment 的 `COMFY_REGISTRY_TOKEN`。
本次只配置流程，未设置凭证、创建 Tag 或执行发布。
PyPI 成功但 Registry 失败时可以重跑同一 Tag：PyPI 跳过已有文件，仍须重新通过
公共 PyPI 安装检查。Registry 端已发布版本不可覆盖，需检查其状态后决定是否升版。
两个外部服务无法原子提交；不要删除或复用已发布版本。

## 当前发布阻塞

2026-11-16 只读检查 `https://pypi.org/pypi/astrophoto-mcp/0.0.1/json` 返回 HTTP 404。
因此本地 wheel 安装成功不能视为正式 Registry 依赖已可解析：必须先发布同版本 MCP
并通过公共 PyPI 安装验证，才可发布 Extension。另需完成真实 ComfyUI 宿主加载验收。
本任务没有发布、创建 Tag、提交或推送。

## 仓库复核边界（2026-11-16）

本轮 Registry 21 文件、MCP wheel 14 文件、sdist 20 文件检查通过；隔离 Python 3.12.15 安装 wheel 并进行 stdio 握手/工具调用通过。公共 PyPI 版本 URL 再次返回 404，仍是发布阻塞。证据见 [发行验证日志](evidence/artifacts.txt)。

Manager 只能影响其依赖安装所使用的环境，不能保证更新外部 uvx/venv 或已经运行的 MCP 进程；这些实例需单独升级和重启。当前没有运行时跨包版本握手。真实 Manager 安装/更新及 GitHub Actions 发布流程本轮未运行；配置审查与本地构建不能替代这些验证。构建后端声明 Hatchling >=1.27,<2，隔离构建不由根 uv.lock 固定 Hatchling 精确版本。
