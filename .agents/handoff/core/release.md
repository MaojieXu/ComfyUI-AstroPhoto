# 双包构件与发行

## 准备与检查（不发布）

```sh
uv run python scripts/release.py sync 0.0.1
uv lock
uv run python scripts/release.py check --tag v0.0.1
pnpm --dir frontend run build
uv run pytest tests/nodes tests/backend tests/integration tests/packaging -m "not host"
pnpm -C frontend typecheck
pnpm -C frontend lint
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
- Registry ZIP：根入口、nodes、astrophoto（Core／Storage／Assets／Equipment／Siril／原生 API）、js、locales、README、LICENSE、发布用 pyproject/requirements。
  requirements 与项目依赖固定相同的 MCP 版本并声明 Storage 依赖；包内没有源码 checkout 的本地引用。
- MCP wheel：仅 `astrophoto_mcp/` 与 dist-info；sdist 仅 MCP 自身的源码、测试及元数据。
- `.comfyignore` 排除 mcp、reference、前端源码、工具、测试与开发资料。
  同时排除 Python 环境备份、.python-version、数据库/日志/临时数据；清单检查拒绝运行数据混入包内。
  打包器以 Git tracked + 非忽略的新文件准备暂存目录，经 `.comfyignore` 过滤，
  然后在临时 Git index 中调用 comfy-cli 官方 `zip_files`。不会修改用户 Git index。
  严格清单校验会拒绝意外根目录文件，避免悄悄混入发行包。

不要在源码 checkout 根直接执行 `comfy node publish`：发布必须使用经验证的
暂存包，其中 requirements 已替换为 PyPI pin。开发源码不依赖 Registry 包中不存在的 `mcp/`。
官方打包行为见 comfy-cli file_utils。

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


历史公开 PyPI 查询曾返回 404，属于当时的证据。当前上线前仍需独立确认公开包、CI 环境凭证、Registry 发布及 Manager 安装。版本同步脚本连续更新多文件，遇中断重做版本检查。构件从允许路径枚举，发布前复核未提交运行文件和白名单；不应从本地构件验证推断线上成功。

## 构件契约和变更前检查

| 构件 | 收录及核对 |
| --- | --- |
| Registry | 根入口、nodes、astrophoto 运行 Python、共用 JS/CSS 和本地化、元数据及许可证。包含 SQLite 统一基线和 Siril 运行接线；Astropy、Pillow 等声明为依赖，Siril 官方程序另装。排除开发测试、参考代码、MCP 源码、锁、数据库和运行产物。 |
| Wheel | 独立 Python MCP，不含 Extension 源码。FastMCP 服务、CLI、诊断及 Equipment adapter 随包安装；以后添加的产品 Skills 只能在已验证的包内路径随包分发。 |
| Sdist | MCP 源码、发布元数据、README、LICENSE 与其测试。Hatchling 隔离构建版本由自身 build-system 约束，不能从根 uv.lock 推断精确后端版本。 |

当前 `scripts/release.py` 的 Registry 检查要求唯一 JS 入口，Python 源目录允许集为 nodes、astrophoto，且阻止符号链接输入、父目录路径以及私有运行数据。requirements.txt 必须逐行等于正式 pyproject 的运行依赖，版本和对应 MCP pin 必须匹配。在计划把 Siril Python 迁入 `extension/siril/` 时，需要同时修改暂存范围、验证白名单和回归用例；按草案选定新入口本身不会自动将 Python Bundle 发布。

## 部署、升级和故障取证

- 发布 CI 用 Python 3.11 和 3.12 分开验证，上传 3.12 构件给同一 tag 的两个发布阶段。Registry 阶段对公开 PyPI 安装重试并用隔离 stdio 探针核对版本和默认工具契约，再解包通过验证的 Registry 制品。
- 发布时分别记录构件版本和安装路径。Manager 更改其宿主环境依赖，并不更新别处运行的 uvx、独立 venv 或既有 MCP 进程；分离的 MCP 实例要独立升级和重启。跨进程自动版本握手仍待实现。
- 历史记录的包文件数受切片版本和功能增量影响，用当天构件清单做比较。PyPI 404 是历史查询。当前远端安装、真实 Manager 升级、目标宿主加载、包功能和新 Bundle 发行都需要对应证据，不能用旧的本地验包结果关闭这些项。

Registry 的 `extension/` 只打包已装配 Bundle 的 Python 文件。Vue 通过单一 JS/CSS 构件交付。
