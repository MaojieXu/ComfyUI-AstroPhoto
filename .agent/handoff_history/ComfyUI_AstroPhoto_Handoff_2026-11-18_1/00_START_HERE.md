# ComfyUI AstroPhoto 工程交接 · 2026-11-18

基线是 Windows 仓库 main 的未提交工作树，HEAD 为 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a。Extension 与独立 MCP 均为 0.0.1。当前运行中的 8207 返回 ComfyUI 0.45.0、Frontend 1.59.1 和 IMAGE_PATH 节点 Schema。其他本机端口可响应但节点契约较旧。

用户确认以当前本地实现为现行行为基线，可接受与旧 Chat 需求的设计差异。在已观察的主要流程中未发现明显的产品功能故障。实际测试失败及未验证场景见 [测试矩阵](06_TEST_COVERAGE_MATRIX.md)。

已实现的主线包括 V3 绘图节点及三个科学相关节点、React Sidebar、Vue 绘图 Widget、本地多 Workspace、SQLite 资产和设备、单配置光路、Siril 1.4.5 处理和比较预览，以及条件注册的 MCP 设备读取工具。本轮真实 Siril 进程验证了 FITS 独立输出及原始文件保持不变。真实宿主证据与模拟后端、Chromium 控件和 JSDOM 断言分开。

默认 React 测试配置及待验证项记在 [风险清单](12_GAPS_AND_RISKS.md)。Inspector 参数应可编辑，当前源码已将编辑同步到画布节点，待补实际调用链的回归测试。设备和光路均采用单一可编辑配置。旧光路快照仍走兼容 GET，UI 已移除历史维护入口。Knowledge、Memory、Experiments、全量观测站、硬件控制和完整 Capture Session 仍在规划。

## 阅读顺序

1. 核对 [版本与工作树](01_CURRENT_STATE_AND_VERSIONS.md) 和 [需求及决策](02_REQUIREMENTS_AND_DECISIONS.md)。
2. 用 [实际架构](03_REPOSITORY_ARCHITECTURE.md) 选择入口，再读 [功能](04_COMPLETE_FEATURE_INVENTORY.md)、[防御](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 和 [测试](06_TEST_COVERAGE_MATRIX.md)。
3. 按任务进入 [Siril](07_NODE_SIRIL_IMAGE_PATH.md)、[前端](08_FRONTEND_UI_AND_INSPECTOR.md)、[本地数据](09_STORAGE_ASSETS_EQUIPMENT.md) 或 [MCP 与发版](10_MCP_CI_PACKAGING.md)。
4. 修改产品行为前查 [新旧差异](11_HANDOFF_RECONCILIATION.md) 和 [证据](14_SOURCES_AND_EVIDENCE.md)。[下一任 Prompt](13_NEXT_AGENT_PROMPT.md) 可以直接交给新的 Coding Agent。

[全文交接](FULL_HANDOFF.md) 合并专题与详细证据。各条结论的 VERIFIED 只适用于明确覆盖的测试。语义阅读缺口、旧历史与本轮测试边界均在文内保留。
