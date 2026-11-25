# 正式验收报告

## RUN-chat1-001 · 本机功能及真实 Agent 联调

- 执行 Chat 为 chat1，记入时间 2026-11-25T07:43:47-06:00。覆盖 FR-01 至 FR-04 与 TC-chat1-001 至 TC-chat1-005。
- 基线为 HEAD `e74e5109f273f406d57be8121ed25ed437f05bd3` 加现有工作树修改，文件哈希见 [基线](assets/test-runs/RUN-chat1-001/feature-close-baseline.json)。验收补充了外置工作区用例和 Pi 工具白名单，复测输入见 [哈希](assets/test-runs/RUN-chat1-001/retest-hashes.json)。另一个工作区写入更新了 PRD 的历史归档链接，FR/AC 文本未变。验收矩阵追加见 05_TEST_PLAN.md。
- 环境为 Windows、Python 3.12.16、Node 26.13.1、pnpm 11.25.0、FastMCP 4.2.0、Pi 1.6.0、OpenCode Go Plan 的 DeepSeek V4.1 Flash。Pi 使用真实 stdio，连接隔离 aiohttp 中注册的实际 AstroPhoto 路由。另对独立的真实 ComfyUI 0.46.0 CLI 做了扩展和回环连接检查。

| 条目 | 结果 | 执行及证据 |
| --- | --- | --- |
| TC-chat1-001 / AC-01–04 | 通过。事件缺失为离线回放 | 已保存 [Agent 验证摘要](assets/test-runs/RUN-chat1-001/feature-close-verified-agent.json) 和 [执行脚本](assets/test-runs/RUN-chat1-001/feature_acceptance_agent.py)。Pi 读到导出的 Skill，执行 11 次业务工具调用。创建的设备、组合、视频、项目与 1 条引用经公开 HTTP 核对，导入任务为 IMP-A136D026。重复创建项目得到 HTTP 409 和 REVISION_CONFLICT。移除回放中的失败完成事件，用 toolCallId 在 Pi 会话中恢复。现场订阅断线、逐调用自动透传和不可获的客户端内部信息未验证。HTTP 关联使用操作顺序、任务号及请求 ID。 |
| TC-chat1-002 / AC-05–06、AC-11–17 | 通过，第二物理卷环境缺口 | 扩展、节点、非宿主接口与打包 `pytest tests/nodes tests/backend tests/integration tests/packaging -m "not host"` 238 通过、5 跳过、1 排除。补充外置工作区删除覆盖后 `pytest tests/integration/test_photography_library.py` 35 通过。外置工作区在数据根之外、同一物理卷内。5 个跳过为 Siril 1.4.5 原生 CLI 3 个及第二卷 2 个，日志见 [Python 回归](assets/test-runs/RUN-chat1-001/feature-close-host.txt)。 |
| TC-chat1-003 / AC-07–10 | 部分通过，真实 Desktop 待验 | `pytest mcp/tests` 98 通过，覆盖端口锁、监听 PID、优先顺序、手动配置、重新发现和实例拒写。真实 ComfyUI CLI 的 host 用例 1 通过，并用真实 stdio 自动连上 8188 后查询设备、素材、项目。已安装的 Desktop 只有 Comfy Cloud 配置，没有可用的本地安装实例用于实测端口锁。 |
| TC-chat1-004 / FR-04 | 通过 | 98 项 MCP 回归含分类、代理、直接调用、Skill 资源和真实 stdio，见 [MCP 回归](assets/test-runs/RUN-chat1-001/feature-close-mcp.txt)。`uv build mcp --offline --no-sources` 构建 wheel 与 sdist。离线安装到新 venv 后运行 `scripts/check_install.py --probe`，真实 stdio 握手、三个入口和 version 通过。Ruff 与 release 版本检查通过。线上 GitHub Actions 未执行。 |
| TC-chat1-005 / 兼容回归 | 通过 | `pnpm -C frontend typecheck`、lint、test、check:build 和 check:proxy 通过。16 个文件、135 项无头 Chromium 测试通过，代理前缀资源验证通过。 |

首次 Pi 运行只允许 read，工具未进入模型可用列表，公开回读证实无写入。随后明确允许 AstroPhoto MCP 工具并复测通过。真实 ComfyUI CLI 首次就绪探测超时，复测改用直接 HTTP 请求并核对隔离数据根，宿主测试和 stdio 查询通过。

chat1 于 2026-11-25T07:44:56-06:00 记录用户接受 Desktop 实机与第二物理卷缺口，并确认关闭。本次验收结论按上述范围成立，未覆盖项目保留原状态。原始 Pi 运行证据位于仓库 .artifact，仅保留必要摘要和可复查的哈希在 Feature 内。
