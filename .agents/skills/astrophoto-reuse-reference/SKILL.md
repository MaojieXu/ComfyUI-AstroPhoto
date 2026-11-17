---
name: astrophoto-reuse-reference
description: 在 ComfyUI_AstroPhoto 项目进行前端或后端功能开发、修改与修复前，委派子代理通过 CodeGraph 检查 ComfyUI_frontend 参考源码，优先复用或小幅适配已有实现。
---

# 参考源码复用

实现前调用 `collaboration.spawn_agent`，指定 `model="gpt-6.1-terra"`、`reasoning_effort="medium"`、`fork_turns="none"`。向子代理传递当前需求、相关接口与兼容性约束，并交付以下任务：

1. 将工作目录切换至 `C:\Users\Administrator\Desktop\WorkSpace\ComfyUI\custom_nodes\ComfyUI_AstroPhoto\reference\ComfyUI_frontend`（Shell 调用显式设置 `workdir`）。只读检索，不修改参考仓库。
2. 优先使用 `codegraph_explore`，将 `projectPath` 设置为上述目录，按需求、符号或文件路径查询相似实现；也可在该目录运行 `codegraph explore "查询内容"`。没有索引时使用普通源码搜索，不自行建立索引。
3. 返回相关文件路径、符号、实现要点、依赖与宿主版本限制，以及直接复用或小幅适配的建议。后端任务也检查可复用的前后端接口约定；未找到合适实现时明确说明，不强行套用前端代码。

主代理取得结果后，优先通过已有宿主 API 或组件复用；需要移植时保留适用的许可声明，仅做满足当前需求的必要适配，并验证兼容性。无合适实现时再自行实现；检索失败时如实说明，不声称已完成源码核对。
