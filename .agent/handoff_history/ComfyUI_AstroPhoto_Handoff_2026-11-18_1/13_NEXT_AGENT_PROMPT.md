# 下一任 Coding Agent 启动 Prompt

你负责本地 Windows 项目 C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto。在接受续作后先读取 AGENTS.md、.agents/skills/task-notes/SKILL.md，以及本包的 00、01、02、06、11、12。存在 .codegraph 时先用精确路径 CodeGraph，注意 reference 也可能被索引。用 git status 与当前源码复核，不用 HEAD 或本包代替新工作树。

工程已有 V3 Vue 绘图和三个科学节点、单 JS React Sidebar、aiohttp 原生 routes、SQLite 本地数据与 Workspace/Cache/Assets/Equipment、单配置光路、Siril CLI 和独立 MCP。宿主拥有画布、工作流、队列与撤销。按最新用户决定，以本地实现为当前行为基线。旧 Chat 与原始规格中的设计差异保留作历史参考。接手时按当前任务和实际复现证据决定修改范围。

## 首个修改任务的建议次序

1. 重现前端默认测试失败。完善 CSS mock mapping 并用正规命令跑完整套件。检查现有 Vue/browser/host 脚本断言是否基于最新 UI。
2. 保留 Inspector 与画布双向编辑同一组 shadowsclip、targetbg、linked，支持重置。本期无 Trial。补实际 NodeView 的调参与重置同步、宿主 read_only/selectOnly 拒绝写入、单色 linked 禁用、候选预览刷新及旧请求清理测试。
3. 任务涉及并发编辑、归档设备或引用提示时，先复现具体问题，再按当前行为和用户要求处理。单配置与现有 API 是接手基线。
4. 对工作范围需要的真实宿主动作在获授权的临时用户、输入、输出、Cache、Workspace 和数据根启动独立实例。检查节点 Schema 确为 IMAGE_PATH。历史 8199/8201/8205 均不适合通用科学验收。

## 安全与核验命令

- 保留所有用户未提交更改。禁止 reset、clean、覆盖无关文件、修改宿主核心、运行宿主 uv sync 或变更用户资产，本轮交接不构成提交或发布授权。
- Python：.venv/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration tests/packaging；MCP：.venv/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests。
- 前端：pnpm -C frontend test:react、typecheck、lint。只读工作采用 pnpm -C frontend exec vitest run，因为 pnpm -C frontend test 会重建 js/。构建后检查单入口、CSS、相对 proxy。真实宿主脚本条件见 docs/development.md。
- 真实 Windows Siril 1.4.5：ASTROPHOTO_SIRIL_TEST_CLI 指向现有受控 CLI 可运行两条临时数据测试；其他平台必须独立测试，不要升级宿主。真实跨盘测试需明确隔离的第二卷临时目录。
- GET /astrophoto/v1/status 与 /object_info/AstroPhotoSirilAutoStretch 验证已加载 Schema，结合 /system_stats 区分实际版本。GET 检查不执行 workflow。
- 审计报告给出的测试失败、风险与精确行号是一份快照。按 [证据索引](14_SOURCES_AND_EVIDENCE.md) 回查，修正后更新项目开发文档与测试，并说明哪些已跑及哪些未重测。
