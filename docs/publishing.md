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
pnpm -C frontend lint
pnpm -C frontend test:react
uv run --project mcp pytest mcp/tests
pnpm -C frontend test
pnpm -C frontend check:build
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
并通过公共 PyPI 安装验证，才可发布 Extension。宿主加载与画板恢复已在 comfyenv 验证；
完整 IMAGE 路径问题按用户要求保留，见 react-sidebar.md，不能视为完整执行验收通过。
本任务没有发布、创建 Tag、提交或推送。

## 仓库复核边界（2026-11-16）

本轮 Registry 21 文件、MCP wheel 14 文件、sdist 20 文件检查通过；隔离 Python 3.12.15 安装 wheel 并进行 stdio 握手/工具调用通过。公共 PyPI 版本 URL 再次返回 404，仍是发布阻塞。证据见 [发行验证日志](handoffs/repository-verified-2026-11-16/evidence/artifacts.txt)。

Manager 只能影响其依赖安装所使用的环境，不能保证更新外部 uvx/venv 或已经运行的 MCP 进程；这些实例需单独升级和重启。当前没有运行时跨包版本握手。真实 Manager 安装/更新及 GitHub Actions 发布流程本轮未运行；配置审查与本地构建不能替代这些验证。构建后端声明 Hatchling >=1.27,<2，隔离构建不由根 uv.lock 固定 Hatchling 精确版本。

React Sidebar 与 Vue 合并为一个 js/main.js，同一 main.css；Registry 仍是 21 文件。
frontend/ui 与测试被已有 frontend/ 排除规则覆盖，不需要另开 WEB_DIRECTORY 或静态路由。
React 双语资源内置 JS；根 locales 继续服务原有 Vue Widget。CI 包含 React/Jest 与 ESLint。
