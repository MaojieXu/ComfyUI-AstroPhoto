# 04｜FastMCP、Tools、Skills、RAG、Memory 与调参实验的完整契约

> **基本边界**：本章主要是**目标业务与接口规划**。截至用户最后报告，MCP 只有 `version`、`connection_status` 的真实能力；Memory、Knowledge、Experiment、Assets 的 Tools 与用户业务 Skills 尚未完成。绝不能仅凭下面出现名称就把它注册为可执行 Tool。

## 1. MCP 当前已报告代码与调用链

```text
mcp/
├── pyproject.toml                # astrophoto-mcp 0.0.1 / Hatchling / FastMCP 4.2.0 / httpx
├── README.md
├── LICENSE
├── src/astrophoto_mcp/
│   ├── __init__.py               # 从 metadata 读取已安装版本
│   ├── __main__.py               # astrophoto-mcp / python -m astrophoto_mcp / stdio
│   ├── server.py                 # create_server(base_url)、version、connection_status
│   └── client.py                 # diagnose(base_url, transport=None)，httpx
└── tests/
    ├── conftest.py
    ├── test_server.py
    ├── test_client.py
    └── test_version.py
```

```text
Agent MCP Client
  → stdio → __main__.py → create_server(base_url)
                            ├── version() → importlib.metadata.version("astrophoto-mcp")
                            └── connection_status()
                                  → client.diagnose()
                                     GET /system_stats
                                     GET /object_info/vue-basic
```

用户描述的 URL 优先级是 `--comfy-url` → `COMFYUI_URL` → `http://127.0.0.1:8188`。`diagnose()` 以 `httpx` 访问上述路径，10 秒超时，测试可注入 `MockTransport`；应保留反向代理 URL path prefix（例如 `/proxy/comfy/`）和 404/连接错误的区别。**现有运行时不会自动启动 ComfyUI**。

MCP 包 CLI 的 stdout 属于 stdio 协议专用，不允许普通 Banner、日志混入；`--version` 显式调用时允许打印并结束。兼容 MCP SDK 的内存 Client 测试优先，另外保留一套真实子进程 stdio 握手测试。

## 2. MCP 最终文件归属

```text
mcp/src/astrophoto_mcp/
├── __init__.py
├── __main__.py
├── server.py                    # 一个 FastMCP Server；服务组装
├── config.py                    # ComfyUI URL、timeout、环境变量
├── client.py                    # HTTPX transport/connection/错误基础层
├── api/
│   ├── comfy.py                 # /system_stats、/object_info、/prompt、/history、/ws
│   ├── extension.py             # AstroPhoto /astrophoto/v1/*
│   └── canvas.py                # 前端 Bridge API（确实实现后）
├── tools/
│   ├── status.py                # L0
│   ├── assets.py                # L1/L2：将来
│   ├── software.py              # 将来
│   ├── nodes.py                 # 将来
│   ├── canvas.py                # 将来
│   ├── workflows.py             # 将来
│   ├── experiments.py           # 将来
│   ├── knowledge.py             # 将来
│   └── memory.py                # 将来
├── schemas/                     # 跨工具复用的 Pydantic 模型；按需增
└── skills/                      # 随 PyPI Wheel 分发的真实 Agent Skills
```

不在 `mcp/` 建立 `database/`、`langchain/`、`software_adapters/` 或 `agent_orchestrator/`。MCP 只发 HTTP/WS 请求，Extension 负责数据与执行；外部 Agent 负责规划、Subagent。

**FastMCP 4.2 API 核验（2026-11-16 官方文档）**：

- `from fastmcp import FastMCP`，用 `@mcp.tool` 注册并由框架生成 Tool Schema。
- `fastmcp.Client(mcp)` 可在进程内测试 Server。
- `fastmcp.skills.provider.SkillsDirectoryProvider` 用于已有文件夹中包含 `SKILL.md` 的 Skills。
- `fastmcp.skills.provider.SkillCatalogProvider` 配合 `Skill.from_directory()` / `Skill.from_package()` 用于显式管理 Skill 列表。
- 旧版导入 `fastmcp.server.providers.skills` 在 4.2 为兼容路径并提示弃用；不要把它当新项目目标 API。
- MCP Skills 扩展支持随 Agent Host 实现而变，FastMCP 资源也能被旧 Host 读取；**发布 Skill ≠ 外部 Host 必然自动加载**。

参考：<https://gofastmcp.com/docs/servers/skills>、<https://gofastmcp.com/docs/servers/testing>。

## 3. 三层渐进式披露（不是三层进程）

**L0 Bootstrap**（只读）：`version`、`connection_status`、未来 `capabilities`。解决是否连接、版本、依赖和权限是否满足。

**L1 Discovery**（查找/解释）：`asset_search`、`equipment_list`、`software_list`、`software_detect`、`node_search`、`node_describe`、`knowledge_search`、`memory_context`、`memory_search` 等。

**L2 Operation**（受控副作用）：`asset_import`、`equipment_upsert`、`calibration_match`、`software_configure`、`canvas_apply`、`workflow_run`、`workflow_status`、`workflow_cancel`、`experiment_create`/`record_trial`/`finalize`、`memory_set`/`feedback`/`forget` 等。

这些名字是**候选契约**，不是承诺逐一实现。不要为每个具体 Siril 算法暴露独立 MCP Tool；那样会形成超长、难搜索的 Tool list。通过 ComfyUI Node Catalog 与有限通用 Canvas/Workflow Tool 编排具体操作。

FastMCP `tags` / visibility 等能力可以辅助组织，但 L0/L1/L2 首先是 Agent 使用顺序，**不应将其实现成全局 `enable()/disable()` 阶段，影响其他并发客户端**。

### 公共调用契约候选

```json
{
  "request_id": "uuid",
  "actor": "agent",
  "capability": "workflow.run",
  "inputs": {"workflow_id": "..."},
  "idempotency_key": "optional"
}
```

```json
{
  "request_id": "uuid",
  "status": "accepted | completed | failed",
  "operation_id": "optional",
  "result": {},
  "error": {"code": "VERSION_MISMATCH", "message": "..."}
}
```

Schema 只是候选，需结合 Pydantic 与现有 Tool 的真实返回契约定型；不要随意改动已有 `version`、`connection_status` 让客户端崩溃。

## 4. Node Catalog、Canvas 与 Workflow Tool 如何互相配合

```text
用户: “用 Siril 对 M31 背景提取并叠加”
  → status/capabilities（确认 ComfyUI / Siril / API）
  → node_search（选择已有 V3 Node）
  → node_describe（真实 io.Schema 及可用性）
  → canvas_apply（在线前端受控编辑；需要目标 Canvas）
  → workflow_run（独立提交工作流；由 ComfyUI 执行）
  → workflow_status / ComfyUI history（结果/异常）
  → experiment_record_trial（如执行优化，记录参数/评价）
```

### Canvas 指令最小设计

`request_id` / `canvas_session_id` / `expected_graph_revision` / `commands[]` → Broker → 在线 Frontend Extension → ComfyUI 当前图 → Receipt。

- 只有真实在线的指定 Canvas 才能报告完成编辑；断连→`CANVAS_UNAVAILABLE`。
- Revision 变化→`GRAPH_CONFLICT`，需重新读取后再编辑。
- `/prompt` **不会**修改打开的浏览器画布，它是运行队列提交 API。
- 多会话/多浏览器时不应广播无目标的写命令。
- ComfyUI 自己继续拥有保存、Undo 与 Workflows。

## 5. 用户 Agent Skills：目标 33 个候选目录

六大领域，统一 `astrophoto-` 前缀。**Skill 表示任务流程**，不应该将每条 Siril CLI 命令写成一个 Skill。

| 领域 | 候选 Skill（在文件夹/Frontmatter 加 `astrophoto-`） | 数量 |
|---|---|---:|
| 环境/设备 | `check-environment`, `configure-software`, `setup-equipment`, `setup-site` | 4 |
| 资产 | `import-session`, `inspect-frames`, `organize-assets`, `match-calibration`, `build-masters`, `quality-review` | 6 |
| 工作流 | `plan-workflow`, `compose-workflow`, `run-workflow`, `debug-workflow`, `reproduce-workflow` | 5 |
| 天文处理 | `preprocess-osc`, `preprocess-mono`, `register-stack`, `background-extract`, `color-calibrate`, `narrowband-combine`, `stretch`, `denoise-sharpen`, `star-processing`, `mosaic`, `planetary`, `export` | 12 |
| 知识与记忆 | `knowledge-guide`, `personalize-processing`, `memory-review` | 3 |
| 优化 | `optimize-node`, `compare-trials`, `select-best-run` | 3 |
| **总计** | **候选总目录，不是已实现数量** | **33** |

优先候选：`astrophoto-import-session`、`astrophoto-match-calibration`、`astrophoto-plan-workflow`、`astrophoto-compose-workflow`、再到 `astrophoto-register-stack`、`astrophoto-optimize-node`、`astrophoto-knowledge-guide`、`astrophoto-personalize-processing`。

### 统一 Skill 格式（示例）

```markdown
---
name: astrophoto-import-session
description: Import an astrophotography capture session, classify frames, associate equipment, and match calibration data. Use when importing new imaging files.
compatibility: Requires AstroPhoto MCP asset import and calibration capabilities.
---

# Import Capture Session

1. Check `connection_status` and required `capabilities`.
2. Scan only authorized input paths; inspect FITS metadata.
3. Classify Light/Dark/Flat/Bias/Dark Flat; mark ambiguity.
4. Resolve equipment and capture session; check duplicates.
5. Suggest calibration matches with explanations.
6. Ask for confirmation where needed; import through MCP Tool.
7. Verify recorded assets and return counts, gaps and source refs.

Never overwrite originals, invent metadata, or write SQLite directly.
```

这种 Skill 在所需 Asset Tools 尚不存在时只能写为**规划稿**，不能作为“可执行 Skill”发布。

### 两条分发路径

1. **FastMCP Skills Provider**：`mcp/src/astrophoto_mcp/skills/` 作为 Wheel 包数据；支持 MCP Skills Extension 的 Host 可发现、读取。FastMCP 4.2 的 `SkillsDirectoryProvider` 属于推荐方案，`SkillCatalogProvider` 也是官方支持的另一方案。两个可择其一，避免重叠。
2. **手动本地安装**：给不支持该扩展的 Codex、Claude Code、OpenCode 提供显式的用户确认式安装。`astrophoto-mcp skills list/install --agent ...` 在聊天中只是**拟议的未来 CLI 功能**，不是已实现命令或 FastMCP 内置命令；不要在安装 Extension 时未经同意自动改写 Agent 目录。

Skills 是公用流程文件；用户设备/审美/位置从运行时 Memory/Asset Tool 读，**不把个人信息写进可分发 SKILL.md**。

## 6. 开发 Agent 的 task-notes 与产品 Memory 不同

开发人员使用的 Skills：`.agents/skills/task-notes/SKILL.md`、可能有 `comfyui-node-*` 等针对 Coding Agent 的技能。这些**只用于开发仓库**，不发布至 PyPI 产品 Skills。

`task-notes` 生命周期：`Create → Update → Verify → Compact → Handoff → Promote / Archive / Prune`。

活动文件：`.agent/notes/<task-id>.md`，含 frontmatter：`task`、`status`、`updated`；正文固定 `Goal` / `Progress` / `Verified` / `Decisions` / `Blockers` / `Next`。`AGENTS.md` 只写调用触发和阅读规则，具体管理动作在 Skill 中。任务归档 `.agent/archive/`，经过验证、可复用的架构事实提升到 `docs/`。

**不要将开发 Notes 送入用户 Memory 数据库，也不要将 Agent 全部对话放进 knowledge.db。**

## 7. Knowledge/RAG 设计细节

- **事实存储**：`knowledge.db` 分 Document、Source、Chunk、FTS5 + 可选 sqlite-vec。原始文档存于 `~/.astrophoto/knowledge/sources/`，来源许可/URL/文档版本保留。
- **Pipeline**：Loader → 清洗 → 分块 → 元数据索引 → FTS5 检索 → （可选）Embedding/向量 → （可选）Rerank → 有来源的 Chunks 返回。
- **工程职责**：Extension `astrophoto/knowledge/` 运行 LangChain；MCP `tools/knowledge.py` 只调用 Extension API；外部 Agent 生成用户可读答案。
- **中文检索**：SQLite 默认 FTS 分词未必适合全部中文，需用真实语料评估。对命令、参数、节点 ID 的精确匹配更偏好 FTS/标识符索引。
- **模型目录**：ComfyUI `folder_paths` 注册 `astrophoto_embedding`、`astrophoto_reranker` 专用类别；不是将 SentenceTransformer 直接丢进宿主的 Textual Inversion `models/embeddings`。
- **资源控制**：不因每次 `knowledge_search` 运行一个 ComfyUI Graph，也不强制下载多 GB 模型；FTS5 无模型时仍可工作。
- **软件版本**：Siril/PixInsight 文档检索要保留软件版本上下文，避免把不兼容版本的命令建议为通用操作。

## 8. User Memory：Extension 持久服务，独立于任何 Agent Harness

### 用户希望保留的信息

- 每次 ComfyUI 启动、用户明确操作的关键行为（不是所有鼠标移动）。
- 用户审美倾向：颜色、背景亮度、饱和度、对比、星点、降噪/锐化等；区分窄带 HOO、SHO、RGB 等上下文。
- 用户已拥有设备/Optical Train、观测地、光污染与设备使用历史（主要业务事实仍属于 assets.db）。
- 常用工作流、成功/失败参数、试验评分、用户最终选择、明确反馈。
- 会话状态（短期）与长期偏好（可修正/撤销）。

### 记忆数据结构（示例）

```text
memory.db
├── profiles                   # 受授权用户身份、显示偏好
├── sessions                   # ComfyUI 使用会话
├── activity_events            # 时间、actor、source、event_type、对象 ID
├── memories                   # key/value、scope、confidence、origin、生命周期
├── memory_evidence            # 来源事件或 feedback 的证据链
├── feedback                   # 图像/试验评价；明确 vs 推断
└── consents                   # 采集授权与范围
```

**记忆生命周期**：`Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh / Expire → Forget`。

- Explicit preference 胜于 Inferred preference；推断必须附条件与证据，不从一次 Agent 尝试直接判断用户喜欢。
- 用户可以禁用行为采集、查看、纠错、删除、导出记忆。保留期建议例如事件 30 天可配置，不是官方强制值。
- 位置和光污染：ObservingSite + LightPollutionEstimate 是资产领域事实，Memory 只在有授权时引用；精确经纬度上传外部数据源需要提示和许可检查。
- 多用户隔离：必须使用经过认证的 session/profile 关联，不能让 MCP 客户端传任何 profile_id 就读取他人记忆。

### 记忆工具（规划）

`memory_context(task/asset_ids)`、`memory_search(query)`、`memory_get(id)`、`memory_set(...)`、`memory_feedback(...)`、`memory_forget(...)`。API 返回有限相关记忆与证据，避免把全部操作日志注入 Agent Context；写入/删除应有权限、确认与审计回执。

**不要强制使用 Mem0、Zep、LangGraph/LLM 记忆系统**：业务数据结构已经可被 SQLite/Service 表达；必要时未来把智能归纳作为可插拔能力。

## 9. Parameter Experiment 与 Subagent

- Experiment 生命周期及 Trial 持久化**属于 Extension**；MCP 暴露读写接口；外部 Agent Harness 控制反复调参策略。
- 每次 Trial：`experiment_id`, `trial_id`, `prompt_id`, `node_id`, `workflow_hash`, `input_asset_ids`, `params`, `software_version`, `outputs`, `metrics`, `human_feedback`, `failure_reason`, `timestamps`。
- 不可只记录最终最好参数，必须可追溯每次成功/失败及其条件。
- 科学质量指标（例如 SNR/FWHM/背景梯度）与审美评价必须分开；分数若出自模型评审，保留模型版本、输入和评估方式。
- 试验需要上限、取消、恢复、预算与幂等；原始文件默认不可被试验覆盖。
- 不在 MCP 里实现 Subagent 创建或独立 DAG Scheduler，也不用默认打开 FastMCP Background Tasks 替代 ComfyUI 的执行队列。

## 10. API / Skills / Memory 安全底线

- MCP Tool 的写操作必须校验权限、路径允许范围、Actor 与最终效果；不要仅相信 JSON Schema 就足够安全。
- 用户可查看/删除 Memory 与自身审美偏好，不自动上传精确坐标/资产路径。
- Skills 是可执行流程指令的来源，不天然享有系统命令权限；附带脚本和远端内容可能不可信。
- RAG 检索文档是第三方内容，应当作数据/引用，不当成覆盖系统或工具指令的命令。
- 删除、移动用户文件，执行软件脚本、广播画布命令均需要项目级明确审批/能力约束。

## 11. 参考链接

- FastMCP Skills over MCP：<https://gofastmcp.com/docs/servers/skills>
- FastMCP Testing：<https://gofastmcp.com/docs/servers/testing>
- Agent Skills Specification：<https://agentskills.io/specification>
- ComfyUI Server Routes：<https://docs.comfy.org/development/comfyui-server/comms_routes>
- SQLite FTS5：<https://www.sqlite.org/fts5.html>
- LangGraph memory 概念参考（非必需依赖）：<https://docs.langchain.com/oss/python/langgraph/add-memory>
