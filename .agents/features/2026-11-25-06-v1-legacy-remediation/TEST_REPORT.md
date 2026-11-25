# V1 Legacy Remediation — TEST_REPORT

### RUN-chat2-001

- Chat: chat2 · Time: 2026-11-25T13:41:46-06:00
- 基线：HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f` 加当前工作树；跟踪文件差异 SHA-256 `06082d10c5e984d679defdade41cfde522c03710ba4b32cdc18638382266d422`（含任务开始前的用户文档修改）。Feature 文档为未跟踪文件，见 DEV_LOG。
- 离线 `uv run pytest tests/nodes tests/backend tests/integration -m "not host" -q`：227 passed、5 skipped、1 deselected；三项真实 Siril CLI、两项第二物理卷条件未满足。
- MCP `uv run --project mcp pytest mcp/tests -q`：97 passed；公开 HTTP 的 MCP 集成受影响选择器 3 passed。
- `uv run pytest tests/packaging -q`：17 passed；API inventory 与 routes/MCP 文档通过项目脚本重建，漂移测试包含在此集合。第一次 4 项因进程继承不完整 Git 配置失败，清除该进程的 `GIT_CONFIG_COUNT` 后复测通过。
- `uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py`、`uv lock --check`：通过。
- `pnpm -C frontend typecheck`、`lint`、`build`、`test`、`check:build`、`check:proxy`：通过；Vitest 16 文件、135 passed。
- 真实宿主：Backend 0.46.0 / Frontend 1.59.6；重启前队列与存储操作为空，使用独立测试 Data Root。`COMFYUI_TEST_URL=http://127.0.0.1:8188 uv run pytest tests/integration -m host -q`：1 passed、82 deselected。`pnpm -C frontend test:host` classic 通过，Nodes 2.0 在最后一次后端重启前通过；当前工作流基线由本次宿主生成，不代表历史工作流验证。Siril 命令展示脚本中英文、classic/Nodes 2.0 四项通过。
- 首轮离线回归 224 passed、5 skipped、1 failed：清理旧环境键时误删当前 ASTROPHOTO_HOME 测试隔离，已恢复，失败选择器及全量复测通过。前端 host 脚本初次存在过时路径/标题/反馈假设，已修复复测；详细本地证据在 `.artifact/frontend-preview/`。
- 未通过/未覆盖：真实 HTTP 403 时宿主 `setting.set` 正常返回、内存乐观值与持久值不同；网络拒绝回滚通过，403 检测待决。Siril 1.4.5 CLI、第二物理卷未验证；npm 未提供目标 1.59.6 类型包，vendored 组件来源 1.59.1。故本 RUN 不能判定 Feature 全部验收通过。


### RUN-chat2-002 · 真实宿主补充检查

- Chat: chat2 · Time: 2026-11-25T13:43:14-06:00
- 在独立测试根对 `/previews/settings` PUT `{width:600,max_height:400}`，GET 回读相同值。
- `POST /previews/autostretch`：独立 aiohttp 测试为 404；真实 ComfyUI 0.46.0 为 405。对任意未知 POST 路径的对照请求同为 405，故该差异来自宿主路由行为，旧路由未注册。
- 设置 403 对照：注入 HTTP 403，`setting.set` 正常返回且内存显示新值；公开持久化读取仍为原值，已还原测试设置。该场景仍待决。
- 文档导航/API 漂移选择器：7 passed；`git -c core.longpaths=true diff --check` 通过（仅行尾提示）。

### RUN-chat2-003 · 书签 HTTP 403 复验

- Chat: chat2 · Time: 2026-11-25T13:51:29-06:00
- 基线：HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f` 加工作树，跟踪文件差异 SHA-256 `def4c1c25522ebe867c84f974dc3958434da8f5739226c7b8b020683aa85b606`。
- `pnpm -C frontend typecheck`、`lint`、`test`（含构建）、`check:build`、`check:proxy` 通过。Vitest 16 文件，135 项通过。
- `uv run pytest tests/packaging -q` 通过，17 项。包括 Registry 打包和 API 漂移。
- 真实 ComfyUI 0.46.0 / Frontend 1.59.6 的 `pnpm -C frontend test:host` 和 `pnpm -C frontend test:host --nodes-2` 均通过。在设置 POST 注入 HTTP 403，核对拒绝、持久值、侧栏和失败提示。证据位于 `.artifact/frontend-preview/bookmark-403/`。
- 此次为前端书签收尾，后端、MCP 和 Siril 采用 RUN-chat2-001/002 的验证结果及环境跳过记录。

### RUN-chat2-004 · chat4 与 chat5 审查修复回归

- Chat: chat2 · Time: 2026-11-25T14:24:03-06:00。HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f` 加跟踪工作树差异 SHA-256 `a1a2f2820d7eee77ce419de16d1b1a702f4aca9abaf58edf497c099e71423f2d`。
- `uv run pytest tests/nodes tests/backend tests/integration -m "not host" -q`：229 passed、5 skipped、1 deselected。首次运行 228 passed、1 failed、5 skipped，Siril 替身漏填 version，补齐后全量复测通过。
- `uv run --project mcp pytest mcp/tests -q`：97 passed。`uv run pytest tests/integration/test_library_mcp.py -q`：补上的完成回执分类断言复测 2 passed。Ruff 全范围通过。
- `uv run pytest tests/packaging -q`：18 passed，包括新增文档内容、生成物漂移、Registry 打包。API inventory 和参考页已用项目生成器刷新。
- 前端 typecheck、lint、build、check:build 和 check:proxy 通过。Vitest 16 文件 137 项通过。
- 真实 ComfyUI 0.46.0 / Frontend 1.59.6 的现有隔离测试实例：host pytest 1 passed，84 deselected。书签在 Classic 和 Nodes 2.0 均通过，证据在 `.artifact/frontend-preview/review-fixes/`。设备宿主脚本的创建、归档、恢复、语言、响应布局和 API 清理均通过。首次脚本在旧归档确认步骤超时，按当前交互修订后复测通过。本轮真实宿主用于受影响的浏览器与设备流程，Python 变更由工作树离线测试覆盖。
- Siril 串联和预览由处理替身覆盖。真实 Siril CLI 和第二物理卷依环境跳过。书签跨标签页测试覆盖另一标签页先完成保存再写入的场景，宿主接口没有原子比较并写入能力。
- 逐项发现与测试对应见 REVIEW 的 chat2 状态列和 TEST_PLAN 的 chat2 审查回归修订。

### RUN-chat2-005 · chat6 和 chat7 审查修复回归

- chat2 · 2026-11-25T14:56:12-06:00 · TASK-chat2-002、DEV-chat2-006、当前 PRD D1–D5 与本轮 TEST_PLAN 修订。快照为 HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f` 加跟踪工作树差异 SHA-256 `7a2cd0904546fd6c5ce9aad9c46c7b96dc916a136966ba7579031febfdf7a6c3`。未跟踪的 Feature 文档单列于 DEV-chat2-006。
- `uv run pytest tests/nodes tests/backend tests/integration -m "not host" -q`：230 passed、5 skipped、1 deselected。首次定向 1 passed、2 failed，收录请求补用浏览器同源头，素材状态比较限定为属性、资源名和修订，随后全量通过。
- `uv run --project mcp pytest mcp/tests -q`：97 passed。`uv run pytest tests/packaging -q`：18 passed，含 API 漂移、文档和打包检查。在仓库根目录加入 PYTHONPATH 后通过 `scripts/api_inventory.py --output docs/api/inventory.json` 和 `scripts/render_api_reference.py` 重建清单、路由及 MCP 参考页；初次未加仓库路径时导入失败。Ruff 和 `git -c core.longpaths=true diff --check` 通过。
- `pnpm -C frontend test` 首轮 16 个文件 139 项通过。根据真实宿主结果修订设置事件后，最终 `pnpm -C frontend exec vitest run --no-file-parallelism` 再次 16 个文件 139 项通过，typecheck、lint、build、check:build 和 check:proxy 均通过。
- 仓库生成器生成 71 个合成文件。用实际 manifest 的 dark 主帧条目运行导入计划，将请求发送给隔离 aiohttp 服务。验证 `master_type` 的预检 200、单文件无错误，替换为旧 `type` 时 422 INVALID_REQUEST。
- 真实 ComfyUI 0.46.0 / Frontend 1.59.6：确认 8188 测试宿主队列为空，复用实例。Classic、Nodes 2.0 的 `test:host` 都通过 HTTP 403 单次写入、持久原值、失败提示和解除拒绝后的重试。首次 Classic 在宿主直接清空书签时超时，确认宿主变更事件早于写入完成，恢复该事件的本地同步后重跑通过。`uv run pytest tests/integration -m host -q -rs`：1 passed、85 deselected。浏览器证据位于 `.artifact/frontend-preview/review-chat6-chat7/`。
- 真实宿主未重启，新的 Python 行为由当前工作树的隔离接口集成测试验证。没有可用的真实 Siril 1.4.5 CLI 或第二物理卷，相关用例跳过。独立复审待执行。
