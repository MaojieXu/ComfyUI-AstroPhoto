# 当前状态、版本与工作树

| 范围 | 实际观察 |
|---|---|
| Git | main；HEAD 与本地 origin/main 引用均为 003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505。单工作树。远端实际状态本轮未知。 |
| 工作树 | 309 个 tracked 文件。初盘显示 .agent、.artifact、.agents/skills/astrophoto-sop、reference 未跟踪。无 tracked 内容变化。 |
| Extension + MCP | 根 pyproject 版本 0.0.1；独立发行；最低 Python 3.11，开发 .venv Python 3.12.15，宿主环境独立。 |
| 前端 | Node v26.8.2、pnpm 11.13.1，React/Vue 共用锁文件和入口；宿主相关版本边界在各专题。 |
| 运行证据 | 旧实例的 CLI、浏览器及正式工作流证据均保持历史身份。当前测试以隔离开发环境为准，未以 port 上的旧实例替代当前测试。 |
| H0 | 结构化库 revision 4。正式轮次 1，H0 为 ComfyUI_AstroPhoto_Handoff_2026-11-18_2，全部事项 idle_handoffs=0。 |

[版本、实际命令和测试记录](06_TEST_COVERAGE_MATRIX.md) · [源码和有效规则快照](sources/repository_snapshot.zip) · [H0 机器状态](migration/H0_STATUS.json)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/01_CURRENT_STATE_AND_VERSIONS.md)

```markdown
# 当前工作树和环境

| 项 | 本轮查询 |
|---|---|
| Extension Git | main，HEAD 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a，已有大量 tracked 与 untracked 改动。逐文件以快照为准 |
| 宿主 Git | 9fa6bc598950993c2980c52169115f2968012605 |
| Extension / API / MCP | 0.0.1 / v1 / 0.0.1 |
| Python | 系统 3.12.4，项目 .venv 3.12.15，既有隔离环境 3.11.18，真实 ComfyUI 进程 3.12.16 |
| Node / pnpm / uv | 26.8.2 / 11.13.1 / 0.13.8。CI workflow 使用 Node 22、Python 3.11/3.12 |
| 主要 Python 安装依赖 | SQLite 3.53.1、SQLAlchemy 2.1.9、Alembic 1.20.1、FileLock 3.32.7、Astropy 7.2.4、Pillow 12.3.0、NumPy 2.5.5、aiohttp 3.14.5、FastMCP 4.2.0、HTTPX 0.28.1 |
| 前端声明与锁 | React/ReactDOM 18.3.1，Vue 3.5.13，PrimeVue 4.3.3，Reka UI 2.11.0，Vite 6 系列，TypeScript 5.9.3，Comfy 前端类型 1.59.1。根 uv.lock、frontend/pnpm-lock.yaml |
| Siril CLI | 现有 Windows 便携版执行 --version 返回 siril 1.4.5。本轮未安装或更新 |
| 真实 ComfyUI | 8199、8201、8205、8207 均返回 Backend 0.45.0、Frontend 已安装/要求 1.59.1、Torch 2.14.1+cu130 |

## 已加载后端与当前磁盘产物

| 端口 | /object_info 观察 | 边界 |
|---|---|---|
| 8199 | vue-basic，三个科学节点路由查询无该类 | 不能用来验收科学节点 |
| 8201 | FITS Source STRING → ASTRO_FRAME，AutoStretch ASTRO_FRAME → ASTRO_FRAME | 更早节点契约 |
| 8205 | FITS Source ASTRO_FITS_ASSET → ASTRO_FRAME，AutoStretch ASTRO_FRAME → ASTRO_FRAME | 早期科学类型 |
| 8207 | FITS Source ASTRO_FITS_ASSET → IMAGE_PATH，文本 Image Path STRING → IMAGE_PATH，AutoStretch IMAGE_PATH → IMAGE_PATH | /status 与节点 Schema 实际 GET 通过。服务已运行，未重启；GET 不证明每个 Python 模块字节版本一致 |

四个端口所提供的 JS 与 CSS 均和磁盘现有产物 SHA-256 匹配。这同时证明静态文件与已加载后端必须分别识别。宿主根路径与业务数据不在日志中展开。

原始观察和精确版本见 [versions.txt](evidence/versions.txt)。[状态前](evidence/git-status-before.txt)、[状态后](evidence/git-status-after.txt)、[文件清单](evidence/repository-files.txt)、[源码哈希](evidence/source-hashes.json) 同时保留修改和未跟踪记录，JSON 的 null 表示基线列出的路径在磁盘不存在。完整性结果见 [完整性证明](evidence/integrity.txt)。
```
