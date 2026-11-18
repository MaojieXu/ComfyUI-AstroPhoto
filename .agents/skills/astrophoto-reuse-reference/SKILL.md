---
name: astrophoto-reuse-reference
description: 在 ComfyUI_AstroPhoto 设计、实现、修改或修复前端或后端功能时，先拆分需求并逐项查找 ComfyUI 官方实现，复制并适配可复用的源码，缺失部分才自行实现。
---

# 参考源码复用

## 实现前逐项查证

1. 先把需求拆成可独立查证的实现项，例如页面容器、各个控件与交互、API、校验、持久化和错误处理。为每项标明所需行为、所属端及宿主版本。前后端均执行这一步，跨端需求同时核对两端契约。
2. 在确定方案或编写实现前，调用 `collaboration.spawn_agent` 委派只读源码调研，指定 `model="gpt-6.1-terra"`、`reasoning_effort="medium"`、`fork_turns="none"`。传递拆分后的需求、兼容性约束和检索范围。独立的组件或前后端职责可以分批委派，直至每项都有源码结论。
3. 逐项记录官方仓库与版本、文件路径、符号、实现行为、依赖和可复用性。区分公开扩展接口、可移植的内部实现、仅部分匹配和未找到。检索失败单独记录，优先换用同版本的官方仓库继续查证。

## 检索范围

- 前端先查 `C:\Users\Administrator\Desktop\WorkSpace\ComfyUI\custom_nodes\ComfyUI_AstroPhoto\reference\ComfyUI_frontend`，对应官方 `Comfy-Org/ComfyUI_frontend`。
- 后端先查 `C:\Users\Administrator\Desktop\WorkSpace\ComfyUI` 的宿主源码，排除整个 `custom_nodes/ComfyUI_AstroPhoto/` 子树及其索引，对应官方 `Comfy-Org/ComfyUI`。
- 优先使用与已安装宿主相符的源码。Shell 显式设置 `workdir`，目标目录有 CodeGraph 索引时先用 `codegraph_explore` 并指定 `projectPath`，或在该目录执行 `codegraph explore`。没有索引时直接搜索源码。参考库只读。

## 选用实现

- **有合适的官方实现**：公开接口能调用同一实现时直接接入。其余情况下，把符合许可且可移植的最小实现复制到 AstroPhoto，保留必要的来源和许可声明，再适配类型、宿主版本或业务接口。前端同时沿用适用的交互、键盘行为和主题变量。
- **部分匹配或仅有内部实现**：先复用可独立适配的部分。内部依赖或版本差异妨碍移植时，记录具体原因和实际沿用的做法。
- **没有合适的官方实现**：核对后才自行实现缺失部分。为每项验证实际行为，并在交付中注明直接接入、复制适配或自行实现及其依据。
