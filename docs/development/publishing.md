# 双包发布

扩展与 MCP 采用锁步语义化版本（Lockstep SemVer）。根 `pyproject.toml` 是唯一版本来源，MCP 项目版本、扩展的 `astrophoto-mcp==X.Y.Z` 依赖和 Git Tag `vX.Y.Z` 必须一致。当前脚本接受无前导零的稳定版 `X.Y.Z`。运行时跨包版本协商仍属规划。

## 准备与检查（不发布）

从仓库根运行。以下以 0.0.1 为例，`sync` 用于有意变更版本，省略版本时从根项目同步。它也同步两份 LICENSE。升版后运行 `uv lock` 并随变更保存锁文件。

```sh
uv run python scripts/release.py sync 0.0.1
uv lock
uv run python scripts/release.py check --tag v0.0.1
```

发布前执行扩展、前端和 MCP 回归及适用的跨组件验证，再构建前端、MCP wheel/sdist 和 Registry ZIP。以 `release.py artifacts` 校验这组产物，用 `check_install.py` 在独立环境安装 wheel 并验证 stdio 握手与工具调用。完整本地命令、构件文件名和真实宿主前置条件见[开发与验证](setup-and-testing.md)。

两个项目的 `requires-python` 均为 `>=3.11`，MCP 依赖固定为 `fastmcp==4.2.0`。发布前在目标宿主 Python 中确认依赖兼容。宿主、前端、外部软件和模型保留各自的版本。

## 安装与打包边界

- 源码 checkout：uv workspace 解析本地 MCP；requirements 使用 `./mcp`，因此未发布版本不阻塞开发。
- Registry ZIP 包含根入口、`nodes/`、`astrophoto/`、`extension/` 所需的 Siril Python 运行文件、`js/main.js`、`js/assets/main.css`、`locales/`、README、LICENSE 和发行元数据。打包时根据根项目依赖生成 `requirements.txt`，含同版 MCP pin、存储和科学数据依赖。
- MCP wheel 包含 `astrophoto_mcp/` 与 dist-info，sdist 包含 MCP 自身的源码、测试及元数据。两者都交付 `astrophoto-management/SKILL.md`，发布校验要求它存在。仓库开发用的 `.agents/skills/` 排除在发行包之外。
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

## 公共 PyPI 与历史验证

2026-11-16 只读检查 `https://pypi.org/pypi/astrophoto-mcp/0.0.1/json` 返回 HTTP 404。
本地 wheel 安装成功不能证明 Registry 依赖可解析：发布 Extension 前须确认同版本 MCP 已在公共 PyPI 可安装；如尚未发布，先发布并验证。宿主加载与画板恢复已在 comfyenv 验证；
绘图下游 IMAGE 的完整执行仍待复验，见[开发与验证](setup-and-testing.md)。
该次检查记录的是当日的公共索引状态。发版时须重新验证同版本 MCP 在公共 PyPI 可安装。

Manager 只影响其安装依赖所用的环境；外部 uvx/venv 与已运行的 MCP 进程需单独升级和重启。真实 Manager 安装、更新及发布流程需在目标环境验证，历史本地构建不能替代。

## 运行文件与清单验证

Registry 包随扩展提供 SQLite 模型与 Schema 初始化、Vue 构件和翻译。过滤规则排除 MCP 源码、Bundle 前端源码、开发资料、用户 Data Root、数据库及 WAL/SHM、锁和临时文件。MCP 工具及客户端随 wheel 分发。包边界由[打包脚本](../../scripts/release.py)、[清单测试](../../tests/packaging/test_contents.py)及[发布工作流](../../.github/workflows/release.yml)核对。

## Siril 扩展发行内容

Registry 包包含科学节点、Astropy/Pillow 依赖声明、共享 JS/CSS 及节点本地化资源。
Siril 官方程序由用户独立安装。样本 FITS、处理回执、配置、Workspace、Cache 和验收截图保留在本地隔离目录。
本地构建结果见 [Siril 实现](../domains/siril.md)。
