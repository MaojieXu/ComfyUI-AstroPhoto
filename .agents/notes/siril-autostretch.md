---
task: siril-autostretch
status: handoff
updated: 2026-11-21
---

## Goal
按 Siril PRD v1.1 实现软件管理、FITS Source、真实 AutoStretch、单预览和轻量 Inspector，并区分单测、真实 CLI、真实宿主和打包验证。

## Progress
- 正式 AutoStretch 入口直接接收 `IMAGE_PATH` 字符串；已删除 AstroFrame 中转，FITS 检查结果仅用于校验、预览与回执。正式输出的路径可直接连入另一个 AutoStretch。资产选择器仍可用资产 ID 解析源文件。
- 新增环境配置的预览分辨率，默认最长边 1024 像素。复用 ComfyUI 前端 SingleSelect 和宿主 server.py 的等比双线性缩放方式，设置沿用 AstroPhoto 的服务端修订号。节点与 Inspector 共用显示尺寸，Siril 处理原尺寸 FITS。
- 取消 FITS 的 HDU 数量、样本数和位深白名单，以及预览文件大小、分辨率、PNG 大小、预览任务与 CLI 的并发上限。预览和正式处理取消 CLI 超时与日志上限。非有限值只在预览和处理副本中置零。按用户约定未运行测试。
- 新增 `AstroPhotoImagePath` 节点，原样输出文本为 IMAGE_PATH，独立于存储和信任状态。AutoStretch 前端可识别该节点并请求候选预览，实际读取仍受处理节点的授权约束。
- `IMAGE_PATH` 使用 V3 自定义端口，保留原有节点 ID。输入节点可选资产或填写授权根目录内的直接路径，预览和正式处理沿用同一受控解析。历史 ASTRO_FRAME/STRING 连线需重建。
- 按用户新要求将节点间数据改为 ComfyUI STRING 文件路径。FITS Source 输出已登记素材路径，AutoStretch 通过路径匹配已登记资产并输出结果路径。原 ASTRO_FRAME 工作流需要重新连接；新契约尚未运行测试。
- E0 读取 PRD/工程指南与现有工作树。main @ 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a，保留既有 Storage、设备与光路改动。复用技能调研固定版本 ComfyUI IO/取消、官方 CLI、原生 DOM Widget 和比较交互。
- E1–E3 完成软件发现和版本/能力验证、V3 科学节点、外部/受管素材读取、精度验证、Workspace 发布和 SQLite 登记。
- E4 完成候选生成、后台取消、Cache 隔离、正式回执读取、三模式 Inspector、双语和 Light/Dark。
- E5 三条 Windows 浏览器流程与两套开发 Python 回归均通过，新增文档 docs/siril.md 和现有工程文档的链接。

## Verified
- 生产 NodeView 通过 registerScientific → nodeCreated 挂载，React 11 套件、51 测试通过。新增覆盖三参数写入、重置回调、路径预览请求、宿主只读/仅选择保护、单色禁用联动。HTTP 为替身。前端 typecheck、ESLint 与相关 Ruff 检查通过。
- Python 后端、节点、集成与包装共 84 passed、3 skipped，含 Siril 1.4.5 的真实路径串联测试。新启隔离 ComfyUI 0.45.0 / Frontend 1.59.1 实例执行图像路径 → AutoStretch → AutoStretch，Prompt `b4b3983a-e730-4d80-a85a-2bccdacbb914`；第二个节点的输入哈希与前一个输出一致，源文件保持原样。隔离实例已结束。现存 8201/8205/8207 分属不同进程和启动时间。
- 新增路径节点后 `uv run pytest tests/nodes -q` 为 6 passed，前端 build 与相关 Ruff 检查通过。新节点尚未在真实宿主重启后验收。
- 设置 `ASTROPHOTO_SIRIL_TEST_CLI` 后 `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q` 为 83 passed、3 skipped；包含真实 Siril 直接路径重复执行及源文件保护。`pnpm -C frontend test:react` 为 45 passed，`pnpm -C frontend test` 为 9 passed；typecheck、lint、build、Ruff 通过。MCP 为 67 passed。
- Windows 隔离宿主 8207，真实 ComfyUI 0.45.0 / Frontend 1.59.1 / Siril 1.4.5，`pnpm -C frontend exec node ui/siril-host.mjs` 通过直接路径预览、Inspector、双语主题、正式执行、源 SHA-256 与工作流重开。Prompt `75def43a-cd64-4f59-a70d-97070a5c31c4`。8206 首次尝试未载入 Astropy，使用独立依赖路径启动 8207 后通过。
- 根 pytest 在 Python 3.12、3.11 各 79 passed, 3 skipped，含官方 Siril 1.4.5 Windows UCRT64 的光学样本处理测试。真实宿主 smoke 1 passed。
- MCP 67，React 45，Vue Chromium 9。Ruff、锁、类型、lint、单入口构建及代理 URL 测试通过。
- 真实 ComfyUI 0.45.0+33 / Frontend 1.59.1，隔离 127.0.0.1:8205。见 docs/siril.md 的 Prompt ID 和分级命令。C:→D: 真跨卷通过。
- 本地 Registry 53 文件，MCP wheel 16，sdist 23。未提交或发布。未升级宿主核心依赖。

## Decisions
- Siril 1.4.5 对输入 16 位的 Horsehead 保留 16 位输出，浮点 RGB 保留 32 位。保留原文件并登记输出实际位深。
- 正式和候选走同一固定 CLI，预览与有效正式产物分别驻留 Cache、Workspace。短时数据库事务沿用现有资产表。
- Inspector 的参数可编辑并同步到画布节点。空间对齐信息一致时开放 wipe。Horsehead 经 Siril 改写 WCS，走并排和单图。

## Blockers
- macOS/Linux 未取得本机运行证据。跨子图和第三方路径节点的自动候选解析尚未接入。
- 单独的 Inspector HTML 未在需求目录找到，布局采用 PRD 第 5 节。原有 vue-basic IMAGE 委托问题保持原状。

## Next
- 用户要求补充测试后，覆盖路径匹配、外部与多 Workspace、文件变更和链式执行，并重新进行真实宿主验收。
- 如需扩大验收矩阵，复用 ui/siril-host.mjs 在相应平台运行，保留现有隔离环境、软件版本和证据。

## 2026-11-21 接续

- 当前专题移到 Bundle/Vue 基线。PRD 到测试计划已更新为 v0.4，测试报告保留历史结果并补录 Pi 最终 Registry 的 RGB 双画布证据。本轮只有文档与原始证据核对。
- 待决策 Q-01 FITS 输出门槛、Q-02 输入版本和 Q-06 迁移后找回。先评审，再复验真宿主双节点、完整 Horsehead 和可控边界样本、默认卷故障与源 ID 恢复。 [Feature 索引](../features/siril-fits-autostretch/00_FEATURE_INDEX.md)

