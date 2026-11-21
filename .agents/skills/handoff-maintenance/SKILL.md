---
name: handoff-maintenance
description: 在 AstroPhoto 任务收尾时同步单版本交接文档，核对 Core 仓库树和 Backend、Frontend、MCP 的文件树。用于增量更新、只读核对或全量对账。
---

# AstroPhoto Handoff 维护

每轮收尾检查本轮变更是否影响 `.agents/handoff/core/` 和 `.agents/handoff/module/`。默认原位更新受影响节点。用户要求核对时仅检查并报告，要求全面对账时将 Core 对照全仓库、Module 对照三端范围。两层共有一份现行版本。

1. **确认影响。** 按本轮任务范围读暂存、未暂存及未跟踪变更，区分已有改动。重命名同时检查旧路径和新路径。读当前源码、调用方、写入点、失败处理及相关测试。结合最新有效文档复核决定，分别标明现行实现、设计草案、历史实测和本轮静态核对。
2. **核对 Core。** 更新 `core/repository-map.md` 的增删移动节点、父目录和文件／目录计数。路径不变但职责变化时也更新文件名后的描述。目录边界、工程入口、跨端契约、决定或验证结论变化时同步相关导航、三端概览和其他受影响的 Core 页面。每端概览写齐需求、当前能力、基础流程和验收边界，使 Core 可单独交付。范围包括源码、测试、构件、译文、配置和工程文档。
3. **核对 Module。** 按 [文件地图格式](references/file-map-format.md) 在文件树内更新项目内导入、变量初值和读写点、执行顺序、分支、错误和测试。只改函数错误分支时，复核 Core 职责是否仍准确，再更新 Module 的行为和证据。跨文件机制留在模块入口，避免把同一个文件节点写两遍。
4. **对账。** 核对 Core 的职责与 Module 行为一致。Core 和各 Module 分别最多 20 篇 Markdown。单篇 Module 超过 200,000 个 Unicode 字符后才考虑按职责拆分。Core 的 Markdown 链接只指向 Core。补发的 Module 文档用路径说明用途，Module 的 Markdown 链接可指向 Core 或 Module。源码路径和行号写成定位文本。把外部资料的必要事实归纳到交接内，确保 Web Agent 能独立阅读。

从仓库根运行校验器。增量传入本轮路径，含已删除路径；全量核对使用 `--full`。

```powershell
python .agents/skills/handoff-maintenance/scripts/check_handoff.py -- astrophoto/storage/runtime.py
python .agents/skills/handoff-maintenance/scripts/check_handoff.py --full
```

校验器核对结构、路径、链接及篇数。职责、分支和断言是否准确由维护者对照源码和测试判断。涉及 Core 阅读路径或概览时，仅凭 Core 回答相关需求、正常及失败流程、实际证据与待验收点。完成后报告改过的节点、核对范围和未核实项。除非用户另行授权，保持 Git 暂存区原状。
