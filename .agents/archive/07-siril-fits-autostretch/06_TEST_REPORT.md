# Siril CLI 集成 · 测试报告

## CH-05 · 图像处理目录（2026-11-21）

- `HEAD f84442b` 加本轮工作树。Windows、Python 3.12、官方 Portable Siril 1.4.5。生成的翻译、Ruff 和 `uv run --no-sync pytest tests/nodes tests/backend/test_siril.py tests/integration/test_siril_api.py tests/packaging -q` 通过，43 项。核对 183 个节点 ID、21 个末级计数、全部 Schema 与 API 分类和别名的一致性、18 条说明命令、序列分组以及真实 CLI 路径回归。首次并行测试有一次 CLI 发现失败，单项重试和全组重跑均通过。
- `pnpm -C frontend test` 通过 14 个测试文件、80 个用例。typecheck、lint、build、check:build、check:proxy 通过。
- 隔离 `8278` 使用 ComfyUI 0.46.0 / Frontend 1.59.6，`siril-presentation.mjs` 的英文和中文各通过经典和 Nodes 2.0。检查侧栏 18 个一级目录、色彩多级路径、201 条命令及双语别名搜索、所有 183 个原生节点的本地化路径、旧标题及参数恢复。另在原生 Node Library 展开 Color and Channels → Channel Management，显示 Compose RGB Image。此轮未逐一执行各命令。 [浏览器验收脚本](../../../frontend/tests/host/siril-presentation.mjs)
- 实际 `8188` 在队列为空时保留原参数及数据根重启，独立浏览器用 `--current` 复验当前中文 Nodes 2.0 的注册、目录、搜索和画布。隔离 `8278` 验证结束后关闭。

## CH-04 · 分类、节点内介绍与双语（2026-11-21）

- 对照 Siril 1.4.5 命令表验证 201 条双语文案、183 个节点定义与 11 个功能分类。中文原生节点资源与生成器输出一致。
- ComfyUI 0.46.0 / Frontend 1.59.6 的英文和中文分别在经典画布和 Nodes 2.0 通过真实浏览器验证。核对原生与侧栏分类、裁剪与序列裁剪同组、节点内用途、展开语法和中文参数名。旧默认标题升级，自定义标题、原参数值与序列化长度保留。
- 实际 `8188` 保留原配置和数据根重启。读出新节点注册，并在其当前中文 Nodes 2.0 模式复验侧栏和画布。 [浏览器验收脚本](../../../frontend/tests/host/siril-presentation.mjs)
- Chromium 前端回归 14 套件、80 用例通过。类型、Lint、中文文件同步、单构件与代理路径检查通过。Registry 构建通过。

## CH-03 · Siril CLI 实测（2026-11-21）

- Windows 官方 Portable Siril CLI 1.4.5，隔离 ComfyUI 0.46.0、Frontend 1.59.6；工作树 HEAD f84442b 加当前修改。原生命令目录 201 条，/object_info 核对 183 个脚本节点。
- 经典和 Nodes 2.0 均通过命令搜索、CLI 验证、旧 AutoStretch 的候选／Inspector／正式队列／保存重开，以及 crop → Gaussian Blur → Negative 的路径队列。链中输入输出摘要相符，原件 SHA-256 保持一致。跨命令 prompt 分别为 d3c21184-3df3-49e2-986e-92ed836dbf0e 和 f0fafd0f-0540-4c5e-93d3-72bb91b314e5。
- 真实 CLI 回归覆盖单帧 crop、gauss、neg，连续 load 和 mirrory，序列 convert 和 seqstat；覆盖新旧正式结果登记、会话恢复与批量迁移。Windows 浏览器证据存于隔离测试目录，包含两种渲染器的 cli-run.json、run.json、命令目录和 Inspector 截图。
- Python 回归 115 通过、2 项按环境条件跳过，已启用真实 Siril 和真实宿主；相关 Ruff 通过。前端 Chromium 14 套件、74 用例通过。类型、lint、单构件与代理路径检查通过；Registry 构建与内容检查通过。
- 183 个节点均已核对注册和输入输出定义。实际执行按代表性样本验证，StarNet、Astrometry.net、远端星表、全部图像格式和 macOS/Linux 尚无本轮实机结果。

## CH-03 · 8188 节点目录复验

已有宿主进程最初在 `/object_info` 只返回 `AstroPhotoSirilAutoStretch`，新命令目录路由返回 404。确认队列为空后，用相同启动参数与数据目录重启。原生 API 返回 183 个节点，命令目录返回 201 条；Chromium 展开 AstroPhoto 节点页的 Siril 和 CLI 后，对实际渲染的节点行计数为 183，并确认 Siril CLI 仍为 ready，版本 1.4.5。此次为宿主注册与展示定向核对。 [开发规格与实现](04_DEV.md)

## 旧基线报告

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## 历史运行证据

**HIST-01**。真实 Windows 0.45.0 / 1.59.1 与 Siril 1.4.5。手工路径链 prompt `75def43a-cd64-4f59-a70d-97070a5c31c4`；双节点 `b4b3983a-e730-4d80-a85a-2bccdacbb914`，后一输入等于前一输出哈希且源未变化。另有旧实现 RGB、Horsehead 和 C:→D: 证据。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [siril.md](../../../docs/siril.md) · [07-siril-autostretch.md](../../../.agents/notes/07-siril-autostretch.md) · [verification.md](../../../.agents/handoff/core/verification.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史真 CLI 与模拟版本拒绝证据 | NOT_RUN |
| CASE-02 | 历史真实浏览器与替身证据 | NOT_RUN |
| CASE-03 | 历史 Windows 真队列和串联有实证 | NOT_RUN |

## v0.4 既有 Bundle 证据对账

本轮只对账文档与已有原始产物，独立验收仍为 `NOT_RUN`。

| 已有 Run | 证据 | 适用范围 |
| --- | --- | --- |
| `frontend-vue-v1596-local-2026-11-21` | Windows ComfyUI 0.46.0 / Frontend 1.59.6 / Siril 1.4.5，经典与 Nodes 2.0 验证配置、候选、比较、正式单节点及重开。 | CASE-01～05 的主路径及发布资产的基础证据。 |
| `pi-close-2026-11-21` | 最终 Registry 解包实测两种画布，Prompt `ec1afec6-ed9c-4851-8961-4e64a48e140a` 和 `e9416392-6aff-41fc-9f9b-ff82c4d58bdf`。Astropy 记录输出 `(3,96,96)`、BITPIX = −32、OBJECT 保留。源 SHA-256 未变，输出与各自回执摘要一致。 | 无 WCS 的合成 RGB 单节点，覆盖 CASE-03/10 的部分检查。完整 Header、科学坐标、多 HDU、工作区迁移和资源故障仍待验。 |

[迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) · [最终 Registry FITS 核对 JSON](../../../.artifact/frontend-migration/pi-close/registry-fits-verification.json)

## 待复验

在目标宿主复验两节点正式队列及资产重开，补 CASE-10 的科学样本差异、CASE-11 的预览到 Queue 输入变化、CASE-14 的默认目标故障和同身份迁移。真实 CLI、浏览器和故障注入分别记录。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
