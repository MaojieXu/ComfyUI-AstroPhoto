# RUN-001 环境

- 开始：2026-11-22 17:45（本机时间）
- 执行者：Main Agent（本机自动化）
- Code Revision：`1772bd5d12e2763212ff502e900ec981a6285700` + 未提交工作树（146 项变更；修复清单 `DEV_118_FIX_INPUTS.json`）
- TEST_PLAN：v2.1（执行前）；执行后按结果把新增用例标为 Implemented
- 操作系统：Windows（win32-x64）
- Python：3.12.16（`uv run python -V`）
- pytest：8.4.2
- Node：v26.13.1
- Vitest：5.1.1（`frontend/node_modules/.bin/vitest`）
- pnpm：未安装（packageManager 声明 11.13.1）；前端用仓库已安装的本地 vitest 运行
- ComfyUI 宿主：未启动（无 8188 实例）；真实宿主用例未执行
- MCP：进程内 FastMCP Client；未启动独立 stdio 进程
- 数据根：pytest `tmp_path` 隔离；无真实用户数据

执行命令：

```text
uv run pytest tests/backend tests/integration -q --junitxml=.../backend-integration.xml
uv run --project mcp pytest mcp/tests -q --junitxml=.../mcp.xml
cd frontend && ./node_modules/.bin/vitest run --no-file-parallelism --reporter=junit --outputFile=.../frontend.xml
```

说明：前端首次使用默认文件并行运行时，4 个测试文件在浏览器模式下动态导入失败（`Failed to fetch dynamically imported module`），59 项已收集用例通过；同一文件单独运行与串行全量均通过，判定为测试运行器的模块加载竞态（Environment Issue），串行结果作为本轮证据。
