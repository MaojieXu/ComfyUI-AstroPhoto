# ComfyUI_AstroPhoto

AstroPhoto 是面向 ComfyUI 的本地优先天文摄影扩展，与独立打包的 MCP 服务在同一仓库开发。V3 节点和 Vue 侧栏已接入宿主，外部 MCP 的画布桥接仍属规划。详见[产品需求](docs/requirements.md)和[系统架构](docs/architecture.md)。

## 仓库级约束

- ComfyUI 管理工作流图、画布、保存与撤销、节点注册与执行，以及模型路径。保持节点 ID 和已有工作流的控件序列化、翻译与输出契约兼容。
- 持久化数据由扩展业务服务管理。宿主在 V3 `on_load` 初始化存储并注册路由，禁止在模块导入、UI 挂载或节点执行时初始化存储。
- 外部 MCP 只调用 ComfyUI 和扩展公开的 API，禁止直接访问宿主内部实现或业务数据库。
- 保留 FITS 科学数据的精度与元数据。转为普通 `IMAGE` 时须明确提示转换及其影响。
- 外部软件的路径、参数与操作须经后端适配器验证，禁止执行 Agent 提供的任意命令。
- 按实际功能建立领域模块，避免为规划能力创建空包、占位实现或无用途的抽象。

## 任务路由

| 任务 | 入口 |
| --- | --- |
| 核对当前能力、产品决策或规划 | [需求与范围](docs/requirements.md) |
| 修改模块边界、存储生命周期、节点或前后端数据流 | [系统架构](docs/architecture.md) |
| 定位源码、安装依赖、构建或选取测试与宿主用例 | [开发与验证](docs/development.md) |
| 修改 MCP 工具、通信契约或用户侧 Skills | [MCP](docs/mcp.md) |
| 同步版本、打包或发布 | [双包发布](docs/publishing.md) |

## 开发纪律

按任务读取相关文档与源码。说明过期时用当前工作树核对实现，用对应环境的执行记录核对验证范围。明确区分已实现、规划、历史、未验证和已废弃的内容。

Python 使用独立 uv workspace，前端使用 pnpm。禁止向 ComfyUI 宿主环境同步工作区依赖。优先复用目标宿主的原生接口，运行与变更相关的验证。实现或长期契约变更时，同步 `docs/` 中对应的权威文档。

## Agent 工作流

- 单个 Feature 的规划、推进、验收、关闭与重开使用 [feature-pipeline](.agents/skills/feature-pipeline/SKILL.md)。从 `.agents/features/<name>/00_FEATURE_INDEX.md` 读取状态，阶段文档与证据随 Feature 保存。新归档默认使用 `.agents/features/archive/<name>/`，此前整理的专题见[历史 Feature 索引](.agents/archive/INDEX.md)，同期工程记录在 `.agents/archive/`。
- 可重复执行的开发流程放在 `.agents/skills/`，按任务加载，例如[ComfyUI 开发参考](.agents/skills/comfyui/SKILL.md)。经验证且可复用的 API 用法和实现经验放在 `.agents/notes/`，沉淀规则见 [CLOSE 指南](.agents/skills/feature-pipeline/references/07-close.md)。
- 交接从 [Handoff Core](.agents/handoff/core/README.md) 开始，按需补充[模块快照](.agents/handoff/module/)。契约或文件职责变化时，按交接入口原位同步受影响的两层快照。

<!-- CODEGRAPH_START -->
## CodeGraph

如果仓库根目录存在 `.codegraph/`，说明仓库已建立 CodeGraph 索引。需要理解或定位代码时，先使用 CodeGraph，再考虑使用 grep、find 或直接读取文件。

- **MCP 工具**可用时，`codegraph_explore` 一次调用即可回答大多数代码问题。它会返回相关符号的原始代码及其调用路径，包括 grep 无法追踪的动态分派。查询中可指定文件或符号来读取带行号的当前源码。如果工具已列出但尚未加载，通过工具搜索加载。
- **Shell** 中始终可以运行 `codegraph explore "<symbol names or question>"`，输出内容相同。

如果没有 `.codegraph/` 目录，跳过 CodeGraph。是否建立索引由用户决定。
<!-- CODEGRAPH_END -->
