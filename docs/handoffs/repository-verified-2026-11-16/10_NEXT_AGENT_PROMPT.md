# 下一位 Coding Agent 启动 Prompt

你接手 `C:/Users/Administrator/Desktop/WorkSpace/ComfyUI/custom_nodes/ComfyUI_AstroPhoto`，软件0.0.1。先读根 AGENTS.md、task-notes Skill、本包00/01/08/11和 docs/requirements.md。不要凭此快照覆盖后续代码。

1. 检查 Git branch/HEAD/status。审计时 main@06961eebe42674714dc2992b0a9de654b3a5a566，大量未提交迁移文件；不得 reset/clean/提交/推送/切换分支或恢复用户删除。比对 evidence/source-hashes.json 与实际工作树。
2. `.codegraph/` 存在则先 CodeGraph；query 精确路径，reference 也被索引。读取对应任务 note；本审计完成记录在 `.agent/archive/handoff-reconciliation.md`，宿主标准化的未完成验收在 `.agent/notes/backend-standardization.md`。
3. V3、Core/Status、FastMCP领域拆分、Python3.12、PrimeVue自带运行时已经实现，不重复迁移、不回退到V1。只1节点/1状态API/2Tools/0产品Skills。未来业务全部保留需求但尚未实现。
4. 默认独立 `.venv` Python3.12.15，共用根uv.lock；最低Python3.11，本机独立3.11.18测试也通过。宿主是 C:/ProgramData/anaconda3/python.exe 3.12.4、ComfyUI0.45.0、Frontend1.59.1、Torch2.3.0、NumPy1.26.4、Pillow10.3.0。不要在宿主 uv sync 或升级核心依赖。
5. 当前最高验收阻塞是宿主 main.py 导入 comfy_kitchen 时缺 torch.library.custom_op。若用户授权处理环境，先检查依赖兼容方案；否则明确阻塞，不改宿主。可在获准的独立可运行宿主验收。
6. 工作宿主可用后设 COMFYUI_TEST_URL，运行 `uv run pytest tests/integration -m host`；再手动验收画板绘图、保存、重新打开、中文、Preview Image真实输出。HTTP测试不包含工作流执行。重点调查上传错误响应及Canvas恢复缺口，修复需在后续代码任务范围内。
7. MCP只保留 version 与 connection_status。后者只调用 system_stats/object_info，不做版本握手，不请求Extension Status。任何后续协商扩展都保留旧返回Schema、错误行为、stdio stdout纯协议。
8. 按模块跑 `uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q`、`uv run --project mcp pytest mcp/tests -q`、`pnpm -C frontend typecheck`、`pnpm -C frontend test`。打包/安装命令见07。未运行、Mock、真实HTTP和真实宿主必须分开报告。
9. 本轮发现的翻译键、HTTP错误响应、Ruff Hook版本差异已记录08，未修改应用源码。不要声称测试全覆盖这些风险。
10. 公共PyPI astrophoto-mcp0.0.1审计时404。没有发布授权不得Tag/推送/发布。源码 requirements=./mcp；正式发布用 release.py 暂存包，PyPI先于Registry；独立MCP进程需用户自己的环境升级/重启。

如后续任务是业务开发，先取得具体业务范围，从可验证的Service/API/Tool增量开始；不批量生成全部域或33个占位Skills，不修改reference。保持长期需求、实现事实、测试证据三者区分。完成后更新受影响文档和task-notes，输出实际结果及剩余风险。
