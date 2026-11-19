[Web search]\(chatgpt-system-hint://search) 另外，在这个mcp中应该携带了大量的可用skill.



例如用户需要导入数据的时候，按照一定的工作流进行。\
例如用户需要完成某个数据处理的时候，也会按照一定的流程进行。



到网上看看，找找思路，一共可以出现哪些skill，帮助这个系统的，以及在这个项目中如何安装给agent使用呢

Worked for 2m 20s

我会重点查两件事：一是天文图像处理全流程可以拆成哪些可复用 Skill，二是这些 Skill 如何随 PyPI 的 MCP 包一起分发，并让 Codex、Claude Code、OpenCode 等外部 Agent 真正发现和使用。这里会严格区分 MCP Tool、MCP Prompt 和 Agent Skill，避免重复建设。

整理了技能架构

Planned skill coverage and defined skill boundaries

Consolidated the architecture

Searched the web

# **ComfyUI_AstroPhoto：Agent Skills 体系设计**

结合你的需求，我建议把 Agent Skills 正式纳入 `astrophoto-mcp`**&#x20;的 PyPI 发行包**，成为与 MCP Tools 并列的核心能力。

最重要的调研结果是：**FastMCP 4.2.0 已原生支持 Skills over MCP**，能够直接把 `SKILL.md` 及配套文件提供给外部 Agent，不需要自己重新开发完整的 Skill 分发协议。

FastMCP



## **1. 先确定 Skills、Tools、Knowledge 的职责**

| 组件               | 回答的问题      | 示例                                    |
| ---------------- | ---------- | ------------------------------------- |
| MCP Tool         | 能执行什么操作？   | 导入 FITS、查询校准帧、运行 Siril 节点             |
| Agent Skill      | 应该按什么流程执行？ | 导入 → 检查元数据 → 分类 → 匹配设备 → 关联校准帧        |
| Knowledge RAG    | 为什么这样处理？   | Siril 官方对 Flat 校准、背景提取等操作的解释          |
| User Memory      | 用户通常喜欢什么？  | 常用设备、偏好的 HOO 色彩、曾经采用的参数               |
| ComfyUI Workflow | 实际执行什么处理图？ | Calibration → Registration → Stacking |

这种职责分工也与 OpenAI 官方的 MCP + Skills 设计一致：MCP 提供实时数据和受控操作，Skill 提供工具调用顺序、决策条件、异常处理以及结果要求。

OpenAI Developers



一个典型任务应当是：

```
用户："导入昨天拍摄的 M31 数据并完成叠加"
                 │
                 ▼
Agent 发现并读取相关 Skills
                 │
       ┌─────────┴──────────┐
       ▼                    ▼
astrophoto-import    astrophoto-stack
       │                    │
       ▼                    ▼
  FastMCP Tools         FastMCP Tools
       │                    │
       └─────────┬──────────┘
                 ▼
      AstroPhoto Extension
                 │
                 ▼
         ComfyUI Runtime
```

**Skills 不应直接读写 SQLite、任意执行外部程序或绕过 ComfyUI 画布管理。** 它们编排工具，实际权限与数据一致性由 Extension 后端负责。

## **2. 可以为项目设计哪些 Skills？**

根据 Siril 官方工作流，天文图像处理至少涉及预处理、校准、配准、叠加、背景处理、颜色校准、拉伸及结果输出。Siril 官方教程还覆盖窄带处理、星点处理、马赛克、彗星和光度测量等专项流程。

Siril 1.4.4 documentation+2



结合你规划的资产库、设备库、记忆系统、知识库及 MCP 画布管理，我建议设计 **6 个 Skill 领域，首批规划 33 个候选 Skill**。

这里的 33 个是未来功能目录，不是 v0.0.1 需要立即实现的数量。

| 领域     | 候选 Skills                                                                                                                                                                                   | 数量 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -- |
| 系统与设备  | `check-environment`、`configure-software`、`setup-equipment`、`setup-site`                                                                                                                     | 4  |
| 资产管理   | `import-session`、`inspect-frames`、`organize-assets`、`match-calibration`、`build-masters`、`quality-review`                                                                                    | 6  |
| 工作流管理  | `plan-workflow`、`compose-workflow`、`run-workflow`、`debug-workflow`、`reproduce-workflow`                                                                                                     | 5  |
| 天文图像处理 | `preprocess-osc`、`preprocess-mono`、`register-stack`、`background-extract`、`color-calibrate`、`narrowband-combine`、`stretch`、`denoise-sharpen`、`star-processing`、`mosaic`、`planetary`、`export` | 12 |
| 知识与记忆  | `knowledge-guide`、`personalize-processing`、`memory-review`                                                                                                                                  | 3  |
| 自动调参   | `optimize-node`、`compare-trials`、`select-best-run`                                                                                                                                          | 3  |

建议完整 Skill 名称统一添加 `astrophoto-` 前缀，例如 `astrophoto-import-session`，避免与其他 Agent Skills 冲突。

### **优先开发哪几个？**

01

astrophoto-import-session

P0

导入拍摄文件、分类 Light/校准帧、识别设备并提交资产

02

astrophoto-match-calibration

P0

查找匹配校准场，识别缺失及不兼容的校准数据

03

astrophoto-plan-workflow

P0

结合数据类型、可用软件和知识库规划处理流程

04

astrophoto-compose-workflow

P0

搜索节点、获取 Schema、组装 ComfyUI 画布

05

astrophoto-register-stack

P1

校验输入帧、配准、叠加并检查输出质量

06

astrophoto-optimize-node

P1

固定输入与评价指标，执行单节点多轮参数实验

07

astrophoto-knowledge-guide

P1

根据官方文档指导处理决策，返回可追溯来源

08

astrophoto-personalize-processing

P2

根据明确的用户偏好及历史反馈调整处理策略

这里 P0/P1/P2 表示业务实施顺序。**当前 v0.0.1 仅有连接诊断等基础工具，因此这些业务 Skills 必须等相应 MCP Tools 可用后才能标记为可执行。**

特别建议不要为每个 Siril 命令建立一个 Skill。比如 `background-extract` 是一个含有操作前检查、参数选择、验证和恢复流程的 Skill；具体的背景提取算法则是 ComfyUI Node。

## **3. 最新 FastMCP 原生 Skill 分发方式**

这是此次调研中最值得采用的新机制。

FastMCP 4.2.0 的 `SkillsDirectoryProvider` 可以直接读取一组 Skill 文件夹，并通过 MCP 提供：

- `skills/list`：发现 Skill。
- `skills/get`：获取 Skill 元数据及文件清单。
- `resources/read`：读取 `SKILL.md` 和参考文件。

这基于 MCP 官方的 Skills Extension（`io.modelcontextprotocol/skills`）。当前扩展仍处于 Beta 阶段，支持它的 Agent Host 有限，所以需要兼容传统本地安装方式。

MCP Skills Extension+2



### **推荐的 MCP 目录结构**

```

mcp/
├── pyproject.toml
├── src/
│   └── astrophoto_mcp/
│       ├── __main__.py
│       ├── server.py
│       ├── client.py
│       ├── api/
│       ├── tools/
│       │   ├── status.py
│       │   ├── assets.py
│       │   ├── software.py
│       │   ├── nodes.py
│       │   ├── canvas.py
│       │   ├── workflows.py
│       │   ├── knowledge.py
│       │   ├── memory.py
│       │   └── experiments.py
│       │
│       └── skills/                  # Agent Skills 唯一来源
│           ├── astrophoto-import-session/
│           │   ├── SKILL.md
│           │   └── references/
│           │       └── fits-metadata.md
│           │
│           ├── astrophoto-match-calibration/
│           │   └── SKILL.md
│           │
│           ├── astrophoto-plan-workflow/
│           │   └── SKILL.md
│           │
│           ├── astrophoto-compose-workflow/
│           │   └── SKILL.md
│           │
│           ├── astrophoto-register-stack/
│           │   └── SKILL.md
│           │
│           └── astrophoto-optimize-node/
│               ├── SKILL.md
│               └── references/
│                   └── evaluation.md
│
└── tests/
    ├── tools/
    └── skills/
        ├── test_catalog.py
        ├── test_resources.py
        └── test_workflows.py

```

上面仅展示第一批代表性 Skill。未来新增其他 Skill，只需要继续向 `skills/` 添加符合标准的文件夹。

原有 `.agents/skills/task-notes/` 仍然保留，但它是**开发项目的 Coding Agent Skill**，不随 PyPI MCP 发行给普通天文用户。

### **在 FastMCP 中注册**

使用官方 `SkillsDirectoryProvider`：

```
from pathlib import Pathfrom fastmcp import FastMCPfrom fastmcp.skills.provider import SkillsDirectoryProviderSKILLS_DIR = Path(__file__).resolve().parent / "skills"def create_server(base_url: str) -> FastMCP:    mcp = FastMCP("AstroPhoto")    mcp.add_provider(        SkillsDirectoryProvider(SKILLS_DIR)    )    # 在这里继续注册现有 MCP Tools。    return mcp
```

这段代码展示的是 Skill Provider 接入部分；现有 `create_server(base_url)` 的 HTTP 客户端注入与 Tool 注册逻辑仍需保留。

FastMCP 也支持 `Skill.from_package()`，可直接从 Python 包读取 Skill，因此很适合随你的 PyPI 包发布。

FastMCP



## **4. 外部 Agent 如何安装和使用？**

推荐同时支持两种方式，但**优先使用 MCP 原生分发**。

### **方式 A：只安装 MCP，Skill 随包提供**

**ComfyUI-Manager 安装 Extension**

**PyPI 安装 astrophoto-mcp**

包含 FastMCP Server、Tools、Skills

**外部 Agent 连接 MCP**

使用支持 Skills Extension 的客户端

**发现并读取 Skill**

无需向 Agent 本地目录再复制 Skill

要使这一流程成立，MCP 的 Wheel 必须实际包含所有 `SKILL.md` 和 references。Hatchling 可以通过包文件选择和 `force-include` 控制分发文件；CI 应检查构建后的 Wheel 文件清单。

Hatch



这一模式最符合你要求的统一版本管理：MCP 从 `0.4.0` 升级到 `0.5.0` 后，下一次启动便可以提供 `0.5.0` 携带的 Skills，而无需维护单独的 Skill Release。

但是它**不保证 Codex、Claude Code、OpenCode 的所有版本都会自动展示这些远程 Skills**。这取决于 Agent Host 对 Skills Extension 的实际支持。

### **方式 B：将 Skills 安装到 Agent 本地**

对于尚未支持 MCP Skills Extension 的 Agent，使用已有的开源安装器：

[Skills CLI](https://skills.sh/?utm_source=chatgpt.com) 提供 `npx skills add`，支持从 GitHub 仓库及仓库子目录安装 Skills，并指定 Agent 类型。

GitHub



例如发布后可以提供这样的命令：

```
# 查看仓库指定版本的 Skills
npx skills add \
  https://github.com/OWNER/REPO/tree/v0.4.0/mcp/src/astrophoto_mcp/skills \
  --list

# 安装数据导入 Skill 到 Codex 用户目录
npx skills add \
  https://github.com/OWNER/REPO/tree/v0.4.0/mcp/src/astrophoto_mcp/skills \
  --skill astrophoto-import-session \
  -g -a codex -y
```

其中 `OWNER/REPO` 需要替换为实际 GitHub 仓库名，命令展示的是目标发行方式。

常见 Agent 的本地位置如下：

| Agent       | 本地 Skill 目录                                          |
| ----------- | ---------------------------------------------------- |
| Codex       | `~/.agents/skills/`                                  |
| Claude Code | `~/.claude/skills/`                                  |
| OpenCode    | `~/.config/opencode/skills/`，也兼容 `~/.agents/skills/` |

OpenCode+1

为了进一步降低用户操作成本，还可以在 MCP CLI 中实现一个安装入口：

```
astrophoto-mcp skills list
astrophoto-mcp skills install --agent codex
astrophoto-mcp skills install --agent claude-code
astrophoto-mcp skills install --agent opencode
```

**注意：这些是建议实现的项目命令，不是 FastMCP 已内置的 CLI 命令。**

这个 CLI 只负责将当前 PyPI 包中已经携带的 Skills 安装到用户明确选择的 Agent 目录中，因此不需要重新下载 GitHub 内容，且版本天然对应。

不过我不建议在 ComfyUI-Manager 更新 Extension 时未经用户确认就修改 `~/.agents/skills/` 或 `~/.claude/skills/`。安装到外部 Agent 应由用户主动触发，升级时还应区分用户自行修改过的 Skill 文件。

## **5. 一个 Skill 应该怎么写？**

以你最关注的 `astrophoto-import-session` 为例：

```

---
name: astrophoto-import-session
description: Import an astrophotography capture session, classify frames, associate equipment, and match calibration data. Use when a user wants to import new imaging files.
compatibility: Requires AstroPhoto MCP asset management capabilities.
---

# Import Capture Session

## Workflow

1. Call `connection_status` and check required capabilities.
2. Scan input files and inspect FITS metadata.
3. Classify Light, Dark, Flat, Bias, and Dark Flat.
4. Resolve equipment and capture-session associations.
5. Check duplicates, missing metadata, and calibration compatibility.
6. Present ambiguous classifications before committing.
7. Import through the Extension asset service.
8. Verify imported records and return an import summary.

## Rules

- Never alter or delete original capture files.
- Do not invent missing FITS metadata.
- Distinguish confirmed and inferred classifications.
- Report unresolved calibration requirements.
- Use only available MCP Tools; do not access SQLite directly.

## Output

Return imported counts, frame classifications,
equipment associations, calibration status,
warnings, and unresolved items.

```

这里的文件扫描、分类与导入属于未来 Asset MCP 能力，需要在对应 Tools 实现后连接。Skill 本身不提供这些功能。

**建议把每个 Skill 的主要内容控制在几个明确环节：触发条件、工具调用顺序、决策分支、异常处理、结果要求。** 专业细节放到 `references/` 或运行时知识库，避免每个 Skill 都复制整篇 Siril 官方教程。

## **6. Skill 如何与 Knowledge、Memory、软件可用性协作？**

可以进一步让 Skill 适应用户的实际环境，而不是采用完全固定的流程。

例如用户提出：

> 帮我处理昨晚拍摄的 M42，希望保持自然色彩，尽量减少星点过曝。

**astrophoto-plan-workflow**

理解目标并选择处理策略

**Asset Tools**

M42 数据、设备、校准帧

**Memory Tools**

颜色偏好、历史参数

**Knowledge Tools**

星点与高动态范围处理方法

**Software / Node Tools**

Siril、PixInsight 可用节点

**astrophoto-compose-workflow**

生成、连接并验证处理节点

**astrophoto-optimize-node**

多次试验、比较结果、选择参数

这里尤其要注意：**用户记忆不应直接写入 Skill 文件。**

Skill 是所有用户共享的工作流程；设备、审美偏好、观测地与实验历史都应该在运行时通过对应的 MCP Tools 获取，并遵守用户设置的记忆权限。

同样，软件安装情况也应通过 `capabilities` 查询。不能因为 Skill 文件存在，就默认 Siril 或 PixInsight 已经安装。

## **7. 如何统一维护和测试？**

我建议将 Skill 作为 MCP 的一等发行组件，而不是独立发布一套 Skill 包。

| 管理事项   | 推荐策略                              |
| ------ | --------------------------------- |
| 唯一来源   | `mcp/src/astrophoto_mcp/skills/`  |
| 格式     | Agent Skills 标准 `SKILL.md`        |
| MCP 发现 | FastMCP `SkillsDirectoryProvider` |
| 向后兼容   | 本地 Skill 安装与 MCP Resource         |
| 版本     | 与 `astrophoto-mcp` 锁步             |
| 发行     | 一并打入 PyPI Wheel                   |
| 工具依赖   | 通过 `capabilities` 和 Skill 兼容要求核对  |
| 验证     | Skill 格式、工具存在性、模拟完整工作流            |
| 更新     | MCP 升级后重新读取；本地副本需同步               |
| 安全     | 不自动执行未经审核的脚本或删除原始文件               |

MCP Skills 官方规范将服务端提供的 Skill 视为可能包含不可信指令的内容，并要求客户端对本地执行采取明确的安全措施。因此，Skill 中如需执行 Python 脚本，应优先改为受控 MCP Tool，不能将服务器提供的脚本默认视为可安全运行。

GitHub



## **最终推荐**

对 ComfyUI_AstroPhoto，建议确定下面这套方案：

**FastMCP Tools + FastMCP Skills Provider + Agent Skills 标准 + 双安装路径。**

开发次序上，先完成 `connection_status`、Asset、Node Catalog 和 Canvas 等基础工具，然后逐步交付能够真正调用这些工具的 Skills。

最终用户体验应当是：用户通过 ComfyUI-Manager 安装 Extension，MCP 随 PyPI 依赖安装；外部 Agent 连接 MCP 后，支持 Skills Extension 的客户端自动发现相关流程，其余客户端通过显式安装获得相同的 Skills。

这样你可以不断增加专业天文处理流程，而不必每增加一个 Skill 就扩展 MCP 协议、增加一个 MCP Server，或者修改 Agent Harness。

关键官方参考资料：

[FastMCP — Skills over MCP](https://gofastmcp.com/docs/servers/skills?utm_source=chatgpt.com) · [Agent Skills Specification](https://agentskills.io/specification?utm_source=chatgpt.com) · [Skills CLI](https://skills.sh/docs?utm_source=chatgpt.com) · [Siril 官方教程目录](https://siril.org/tutorials/?utm_source=chatgpt.com)