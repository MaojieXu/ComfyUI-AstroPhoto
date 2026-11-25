# 文档重组 — TEST_REPORT

## RUN-chat1-001 · 文档导航、MCP、存储、设备与素材

- Chat / Time: chat1 · 2026-11-25T08:37:59-06:00
- 需求基线: PRD FR-chat1-001 v3，AC-01–04；见 TEST_PLAN 的正式 RUN 范围修订。
- 运行基线: HEAD e74e5109f273f406d57be8121ed25ed437f05bd3，工作树包含未提交和未跟踪变更；HEAD 不代表完整工作树。
- 稳定性: 14 个入口 Markdown 和 8 个选定测试文件在前后采样得到相同聚合 SHA-256 590b55a809947e2c6d38e1348feeff91a666405fc77c29cb1adce1509743229d（按相对路径排序，以路径 UTF-8、零字节及文件 SHA-256 二进制值依次输入 SHA-256）。
- 实际聚合 SHA-256: 590b55a809947e2c6d38e1348feeff91a666405fc77c29cb1adce1509743229d。该对照不覆盖所有源码、依赖、测试及 Feature 文档，不能证明全工作树无并发漂移。
- 环境: Windows，仓库 .venv Python 3.12.16；MCP、HTTP、浏览器组件测试使用支持回环的环境；无头 Chromium。真实 ComfyUI、真实 Desktop 和第二物理卷不在本次范围。

| 覆盖 | 实际测试 / 核查 | 结果 |
| --- | --- | --- |
| AC-01、03、04 / TC-chat1-001、003 | python -m pytest tests/packaging/test_document_navigation.py -q -p no:cacheprovider | 2 passed；检查 14 个入口 Markdown 的本地路径、锚点及 Skill 参考/模板存在；不验证真实 Agent 行为。 |
| AC-02 / TC-chat1-002 | CONTENT_AUDIT.md 对照、git diff --check | 已完成章节级关键规则对照和差异检查；不是全部参数、平台或源码分支的穷尽证明。Git 对 mcp/README.md 提示行尾转换。 |
| 存储、设备、素材后端 | python -m pytest tests/backend/test_storage.py tests/backend/test_agent_direct_rules.py tests/backend/test_equipment_simple.py -q -rs -p no:cacheprovider | 53 passed、2 skipped；第二本地卷不可用或未配置。 |
| HTTP 集成 | python -m pytest tests/integration/test_equipment_api.py tests/integration/test_library_mcp.py tests/integration/test_storage_api.py -q -rs -p no:cacheprovider | 20 passed；采用测试宿主和隔离数据，不等于真实 ComfyUI。 |
| MCP 套件 | python -m pytest mcp/tests -q -rs -p no:cacheprovider | 98 passed；不等于真实 Desktop 端口锁或全部外部客户端验收。 |
| 素材、设备界面组件 | pnpm -C frontend exec vitest run tests/components/AssetsLibrary.test.ts tests/components/Library.test.ts | 2 files / 66 tests passed，无头 Chromium；不等于真实宿主人工验收。 |

## 范围和结论

合计本次范围 239 passed、2 skipped；跳过不计通过。用户明确暂缓节点和 Siril 开发及专项验证、真实硬件及发布状态验证，亦不要求实际 Agent 行为联调。先于范围修订执行的节点/Siril 3 项结果不计入本 RUN。

文档导航及所选 MCP、存储、设备、素材自动回归通过；第二卷测试按约定暂缓。文档语义为章节级核对而非逐项实测，全工作树稳定性未完整采样，故本报告不声称全部内容及真实部署均已验证。用户最终验收和 Feature 关闭尚未发生。



## RUN-chat1-002 · V1 代码基线、接口参考与发行边界

- Chat / Time: chat1 · 2026-11-25T09:37:07-06:00
- 需求: FR-chat1-002 v2 AC-01–05、FR-chat1-003 v2 AC-01–04，相关 TC-chat1-004–007。RUN-chat1-001 维持其历史基线与范围。
- 代码基线: HEAD e74e5109f273f406d57be8121ed25ed437f05bd3，另有现行未提交和未跟踪文件。335 个活跃源码、测试、构建配置与文档文件的 SHA-256 汇总 eea4b6735e4378f21a08e31774b231d1dab571dc9328873a8923d5f460f65b02 在最终后端运行前后相同。路径顺序按全名排序，每项输入 UTF-8 路径、零字节和文件摘要。MCP、发行与组件在相同业务源码上运行。最终仅调整了后端旧库测试夹具，再重跑整个后端/HTTP 组。
- 环境: Windows，仓库独立 Python 3.12.16，现有 pnpm 工具链与无头 Chromium。测试使用隔离 Data Root 和回环服务器。

| 覆盖 | 实际命令及选择器 | 结果 |
| --- | --- | --- |
| 后端与 HTTP / TC-chat1-004–006 | python -m pytest tests/backend/test_storage.py tests/backend/test_equipment.py tests/backend/test_equipment_simple.py tests/backend/test_agent_direct_rules.py tests/backend/test_subframe_groups.py tests/integration/test_equipment_api.py tests/integration/test_train_flat.py tests/integration/test_photography_library.py tests/integration/test_library_mcp.py tests/integration/test_storage_api.py tests/integration/test_storage_init.py tests/integration/test_direct_import.py tests/integration/test_status_api.py -q -rs --tb=short -p no:cacheprovider | 131 passed，2 skipped。三个旧库测试验证可识别 HTTP 错误及磁盘字节保护。两项真实第二卷用例按范围跳过。 |
| MCP / TC-chat1-005–007 | python -m pytest mcp/tests -q -rs --tb=short -p no:cacheprovider | 98 passed。 |
| 接口与导航 / TC-chat1-007 | python -m pytest tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py -q -rs --tb=short -p no:cacheprovider | 6 passed。核对 97 条 HTTP 注册、核心和 Bundle 条件、MCP 三种配置快照与逐操作文档覆盖。 |
| Registry / TC-chat1-007 | python -m pytest tests/packaging/test_contents.py -k 'not mcp_artifacts' -q --tb=short -p no:cacheprovider | 6 passed。V1 基线是包内唯一数据库迁移，Registry 排除 benchmark。 |
| MCP 发行包 / TC-chat1-007 | python -m pytest tests/packaging/test_contents.py -k mcp_artifacts -q --tb=short -p no:cacheprovider | 2 passed。隔离构建 wheel/sdist 后检查内容。 |
| 界面 / TC-chat1-005、006 | pnpm -C frontend run typecheck；pnpm -C frontend exec vitest run tests/components/AssetsLibrary.test.ts tests/components/Library.test.ts | 类型检查通过，2 个文件 66 passed。 |
| 生产构建及自检 | pnpm -C frontend run build；Ruff F 类定向检查；git diff --check | 通过。Git 仅提示现有工作树换行转换。 |

复测记录：旧测试尝试访问退役主帧路径、调用旧设备参数或以无协调记录的根模拟旧库，已更新对应夹具并复测。发行检查发现 benchmark 被收入 Registry，更新过滤后复测通过。首次将两套 Python 测试合并启动及部分 Windows 沙箱中运行 Git 和 uv 的命令出现环境错误，改为分别运行各检查，结果见上表。

本 RUN 合计 309 passed、2 skipped。文档语义通过源码、接口和关键流程测试校验。可选维护分支和文档示意样例并非均单独执行。真实 Agent、Desktop、第二物理卷、节点/Siril 专项与公开发布留在既定验证边界。Feature 待用户验收。

### 修复后的证据适用范围

chat1 · 2026-11-25T10:29:41-06:00 · TASK-chat1-005。RUN-chat1-002 保留原基线。启动探测、受管文件删除及其前端调用、HTTP 契约、MCP 示例和 Feature 引用已变化，这些部分以 [DEV-chat1-015](DEV_LOG.md#dev-chat1-015) 的局部复测为当前证据，正式结果待下次 RUN。

chat1 · 2026-11-25T11:06:19-06:00 · TASK-chat1-006。FR-chat1-003 v3 已替代 v2 的开发期数据保护要求。启动探测、素材与目录写入、前端调用和接口清单检查发生变更，RUN-chat1-002 相关结果保留为历史，当前局部证据见 [DEV-chat1-016](DEV_LOG.md#dev-chat1-016)，完整正式 RUN 待重做。
