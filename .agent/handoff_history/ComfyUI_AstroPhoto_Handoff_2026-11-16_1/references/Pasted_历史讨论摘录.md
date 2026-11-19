是的。对于 ComfyUI_AstroPhoto，我更推荐以实际 ComfyUI 宿主环境作为主要开发基准，而不是使用独立的最新 Python 环境。



尤其你的项目是 ComfyUI Extension，而不是独立运行的 Python 应用。最终代码必须在 ComfyUI 宿主环境中加载和执行。



ComfyUI 官方明确要求，自定义节点的 Python 依赖必须安装在 ComfyUI 实际使用的 Python 环境中。

GitHub



1\. 推荐的开发环境

结合你当前的环境：

组件	当前配置	我的建议

Python 开发环境	3.13.15	改为 3.12.x

ComfyUI 宿主 Python	3.12.4	保持不变

ComfyUI Backend	0.45.0	作为当前集成测试基准

ComfyUI Frontend	1.59.1	作为当前 UI 兼容性基准

PyTorch	2.3.0	复用宿主，不主动升级

NumPy	1.26.4	复用宿主，不主动升级

FastMCP	4.2.0	保持

uv	0.13.8	保持

Node.js / pnpm	26.8.2 / 11.13.1	独立管理前端构建



这里不需要让开发 .venv 完全复制宿主中的每一个 Package。Python 主版本、关键宿主 API 和科学计算依赖的兼容性最重要。

2\. 推荐采用双环境开发

开发环境



uv Workspace

Python 3.12

pytest / Ruff / FastMCP / 单元测试





宿主环境



ComfyUI Runtime

Python 3.12.4

V3 Nodes / Canvas / IMAGE / 集成测试







共享源码，独立管理环境





这样既可以享受 uv 的开发依赖管理、快速测试，又能在真实 ComfyUI 中验证节点注册、执行和前端行为。



不要直接对 ComfyUI 的 Python 环境执行 uv sync。 uv 官方明确说明，项目同步默认会删除环境中不属于锁文件的额外包，可能破坏宿主。

uv



3\. 如何修改当前 uv 配置？

建议在项目根目录执行：

uv python install 3.12

uv python pin 3.12

uv sync --python 3.12



uv run python --version





uv 官方支持通过 .python-version 选择项目默认 Python 版本，uv sync --python 可指定开发环境的解释器。

uv





最终：

ComfyUI_AstroPhoto/

├── .python-version       # 3.12

├── .venv/                # Python 3.12.x

├── pyproject.toml

└── uv.lock





pyproject.toml 的 Python 约束则可以继续使用：

[project]

requires-python = ">=3.11"





注意两者的区别：

\- .python-version = 3.12：本项目开发者默认使用 Python 3.12。

\- requires-python = ">=3.11"：声明发行包理论支持 Python 3.11 及以上，必须有相应测试证据。

如果没有实际验证 Python 3.11，就不应把它视为已经支持的环境。

4\. 还有一个必须关注的问题：V3 Node API

你已经明确使用 ComfyUI V3 Node API。



ComfyUI 官方指出，comfy_api.latest 指向正在开发的版本化 API，可能发生变化；因此需要在目标宿主版本中确认节点注册和执行行为。

ComfyUI





所以我建议：

\- 日常开发：使用 Python 3.12 的独立 uv 环境。

\- 节点集成测试：使用当前 ComfyUI 0.45.0 + Python 3.12.4。

\- 前端集成测试：使用实际 ComfyUI Frontend 1.59.1。

\- CI：保留 Python 3.11/3.12 测试，额外维护真实 ComfyUI 集成测试。

\- 发布前：再验证目标支持范围内的最新 ComfyUI 稳定版，避免仅兼容个人开发机。

目前 ComfyUI 官方也说明 Python 3.13 已有较好支持，3.12 是部分自定义节点存在兼容问题时的备选，因此选择 3.12 是基于你当前宿主的工程决策，并不是 ComfyUI 官方要求所有 Extension 都使用 3.12。

GitHub



最终建议

我建议在 docs/development.md 中固定一条规范：



\## Environment Compatibility



\- Use Python 3.12 as the primary development interpreter.

\- Use the installed ComfyUI host as the integration baseline.

\- Keep uv Workspace isolated from the ComfyUI runtime environment.

\- Validate V3 Nodes and frontend extensions against the actual host.

\- Reuse host-provided Torch and NumPy; avoid unverified upgrades.

\- Test additional supported Python and ComfyUI versions before release.







结论：将当前开发 Python 从 3.13.15 统一到 3.12.x 是合理的。 但保留独立 .venv，不要直接把 ComfyUI 的运行环境当作日常依赖同步环境。



这能更早发现版本兼容问题，也更符合你的目标：尽量复用 ComfyUI 原生环境和接口，减少 Extension 对宿主的侵入。ComfyUI_AstroPhoto — Extension Backend 最终目录架构方案

结合 ComfyUI 官方扩展规范、Python Packaging Guide、Cosmic Python 架构教程，以及成熟 Python Web 项目的文件组织方式，我推荐：



采用 Domain-first Modular Monolith（按业务域组织的模块化单体）+ 轻量 Service Layer + ComfyUI 原生适配层。



具体来说：

\- nodes/：定义 ComfyUI 节点和输入输出接口。

\- frontend/：管理 Vue UI 和 ComfyUI 前端扩展。

\- astrophoto/：负责所有天文业务逻辑、数据库、软件驱动、知识库和用户记忆。

\- mcp/：独立 FastMCP 分发包，提供外部 Agent 的控制接口。

这一方案不会额外建立 FastAPI 服务，也不需要微服务、依赖注入框架或独立任务调度平台。

1\. 标准 Python 后端通常如何组织？

我对比了四种常见规范：

参考规范	核心组织方式	对 AstroPhoto 的价值

FastAPI Bigger Applications	API 拆分成模块，入口负责组装	学习模块化 API 管理，不引入 FastAPI

Cosmic Python	Domain、Service Layer、Repository、Adapter	隔离业务规则、存储和外部软件调用

Python Packaging Guide	区分项目结构、Python 包和构建内容	避免开发环境与发行环境出现不同的导入行为

ComfyUI Custom Node Architecture	ComfyUI Node、Frontend、Server API	遵从宿主运行机制，不重复实现执行系统



FastAPI 官方将大型应用拆分为多个 Python 模块；Cosmic Python 则强调将业务服务与数据库、HTTP 接口分离。ComfyUI 已有自己的扩展加载和执行方式，因此这里借鉴的是文件组织原则，而非直接照搬框架。

FastAPI+2



一般成熟后端的分层结构

backend/

├── entrypoints/        # HTTP / CLI / 其他入口

├── application/        # 用例编排、业务流程

├── domain/             # 业务模型与规则

├── infrastructure/     # 数据库、文件、第三方软件

└── tests/              # 验证





典型调用关系：

HTTP / CLI / MCP

&#x20;       │

&#x20;       ▼

Application Service

&#x20;       │

&#x20;       ▼

Domain Logic

&#x20;       │

&#x20;       ▼

Infrastructure Adapters

&#x20;       │

&#x20;       ▼

Database / File / External Software





这是常见的分层思路，但不意味着必须创建这些全局目录。

为什么不直接照搬？

因为你的项目包含多个相对独立的业务域：



Assets、Software、Processing、Knowledge、Memory、Experiments



如果全部按照技术层横向组织，容易逐渐形成以下结构：

models/

├── assets.py

├── memory.py

├── experiments.py



services/

├── assets.py

├── memory.py

├── experiments.py



repositories/

├── assets.py

├── memory.py

├── experiments.py





后续新增功能时，Agent 需要在多个目录之间来回修改。



因此，我更推荐 按业务域纵向拆分，每个业务域内部再进行适度分层：

astrophoto/

├── core/             # 跨领域基础设施

├── api/              # ComfyUI HTTP 入口

├── assets/           # 资产业务及自身持久化

├── software/         # 软件管理及 Adapter

├── processing/       # 科学图像处理与数据类型

├── knowledge/        # RAG 业务及索引

├── memory/           # 用户记忆

└── experiments/      # 实验与调参记录





这个方案结合了 Cosmic Python 的服务边界与按业务域组织的开发习惯，更适合你的多领域 Extension。

2\. 为什么 astrophoto/ 应留在仓库根目录？

推荐保留：

ComfyUI_AstroPhoto/

├── \_\_init\_\_.py

├── nodes/

├── astrophoto/

├── frontend/

└── mcp/

&#x20;   └── src/astrophoto_mcp/





不建议现在为了遵循普通 Python 包的 src/ 习惯，把整个 Extension 迁移到 src/。



原因是 ComfyUI 官方的自定义节点加载方式：启动时扫描 custom_nodes/ 下的 Python 模块，加载其根部 \_\_init\_\_.py，并读取 NODE_CLASS_MAPPINGS 和 WEB_DIRECTORY。

ComfyUI





Extension 本身直接由 ComfyUI 加载，mcp/ 则是需要独立安装、发布到 PyPI 的 Python 包。这两种交付形式适合不同的结构。

Python 代码	推荐布局

ComfyUI Extension	根目录 \_\_init\_\_.py + nodes/ + astrophoto/

独立 PyPI MCP	mcp/src/astrophoto_mcp/

Extension 业务测试	根目录 tests/

MCP 测试	mcp/tests/



这样还可以直接沿用现有相对导入方式，避免通过修改 sys.path 来补救包结构问题。

3\. astrophoto/ 的最终推荐文件结构

以下结构按照当前确定的技术栈设计：Python、ComfyUI aiohttp、Pydantic 2、SQLite、SQLAlchemy 2、Alembic、Astropy、LangChain，以及 Siril/PixInsight 软件适配器。



ComfyUI_AstroPhoto/

│

├── \_\_init\_\_.py                       # ComfyUI 扩展注册入口

├── nodes/                            # ComfyUI 节点定义

├── frontend/                         # Vue 前端

├── mcp/                              # 独立 FastMCP

│

└── astrophoto/                       # Extension 业务后端

&#x20;   ├── \_\_init\_\_.py

&#x20;   ├── bootstrap.py                  # 业务服务初始化与依赖组装

&#x20;   │

&#x20;   ├── core/                         # 跨业务公共基础

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── config.py                 # 应用配置

&#x20;   │   ├── paths.py                  # 用户数据目录

&#x20;   │   ├── errors.py                 # 统一业务异常

&#x20;   │   └── capabilities.py           # 可用能力目录

&#x20;   │

&#x20;   ├── api/                          # ComfyUI aiohttp API

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── routes.py                 # 路由统一注册

&#x20;   │   ├── status.py                 # 状态与能力查询

&#x20;   │   ├── assets.py                 # 资产与设备接口

&#x20;   │   ├── software.py               # 软件配置接口

&#x20;   │   ├── knowledge.py              # 知识检索接口

&#x20;   │   ├── memory.py                 # 用户记忆接口

&#x20;   │   ├── experiments.py            # 实验管理接口

&#x20;   │   └── canvas.py                 # 画布命令桥接接口

&#x20;   │

&#x20;   ├── storage/                      # 公共数据库基础设施

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── sqlite.py                 # Engine / Session 工厂

&#x20;   │   └── migrations/              # Alembic 迁移

&#x20;   │       ├── assets/

&#x20;   │       └── memory/

&#x20;   │

&#x20;   ├── assets/                       # 天文摄影资产领域

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── models.py                 # SQLAlchemy ORM

&#x20;   │   ├── schemas.py                # Pydantic API Schema

&#x20;   │   ├── repository.py             # 资产数据访问

&#x20;   │   ├── service.py                # 导入、分类、资产管理

&#x20;   │   ├── calibration.py            # 校准帧匹配

&#x20;   │   └── metadata.py               # 文件元数据提取

&#x20;   │

&#x20;   ├── software/                     # 外部天文软件领域

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── service.py                # 软件操作业务入口

&#x20;   │   ├── registry.py               # 软件路径、版本、能力

&#x20;   │   ├── runner.py                 # 外部进程执行控制

&#x20;   │   └── adapters/

&#x20;   │       ├── \_\_init\_\_.py

&#x20;   │       ├── base.py               # Adapter 协议

&#x20;   │       ├── siril.py              # Siril CLI / Script

&#x20;   │       └── pixinsight.py         # PixInsight PJSR

&#x20;   │

&#x20;   ├── processing/                   # 科学图像数据处理

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── types.py                  # 科学图像数据契约

&#x20;   │   ├── fits.py                   # FITS 读取、写入、Header

&#x20;   │   └── conversion.py             # 图像格式及类型转换

&#x20;   │

&#x20;   ├── knowledge/                    # 知识库 / RAG

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── service.py                # 检索业务入口

&#x20;   │   ├── ingestion.py              # 文档清洗与分块

&#x20;   │   ├── indexing.py               # SQLite 检索索引

&#x20;   │   └── retrieval.py              # FTS5 / 语义检索

&#x20;   │

&#x20;   ├── memory/                       # 用户记忆领域

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── models.py                 # 记忆 ORM

&#x20;   │   ├── service.py                # 记忆增删改查

&#x20;   │   ├── events.py                 # 行为事件

&#x20;   │   ├── consolidation.py          # 记忆归纳与更新

&#x20;   │   └── retrieval.py              # 场景化记忆召回

&#x20;   │

&#x20;   ├── experiments/                  # 参数优化与实验

&#x20;   │   ├── \_\_init\_\_.py

&#x20;   │   ├── models.py                 # Run / Trial 记录

&#x20;   │   ├── service.py                # 实验生命周期

&#x20;   │   └── metrics.py                # 结果评价指标

&#x20;   │

&#x20;   └── canvas/                       # 前端画布通信协调

&#x20;       ├── \_\_init\_\_.py

&#x20;       └── broker.py                 # 命令路由、状态、回执







这是最终业务模块的目标结构，而不是现在应立即创建的全部文件。当前 v0.0.1 阶段应优先落实公共边界与实际需要的代码，业务文件随功能开发逐步落地。

为什么这样分配？

目录	使用技术	主要职责

core/	Python、Pydantic	配置、路径、错误、能力注册

api/	aiohttp、Pydantic	接收 Frontend / MCP 的业务请求

storage/	SQLite、SQLAlchemy、Alembic	公共连接、事务、Schema 迁移

assets/	SQLAlchemy、Astropy	设备、资产、校准关联

software/	subprocess、软件 CLI/脚本	软件发现、验证、进程控制

processing/	Astropy、NumPy	科学图像数据及转换

knowledge/	LangChain、FTS5、可选 sqlite-vec	知识文档索引与检索

memory/	SQLAlchemy、规则归纳	记录用户行为、偏好和经验

experiments/	Python、SQLAlchemy	多轮调参、指标与实验历史

canvas/	aiohttp、ComfyUI WebSocket	画布命令与前端执行回执



建议 core/ 只保留真正跨领域共享的代码。不要把所有业务类放到一个不断膨胀的 core/ 或 utils/ 中。



4\. 各业务域内部应该遵守什么标准？

以 assets/ 为例：

assets/

├── models.py

├── schemas.py

├── repository.py

├── service.py

├── calibration.py

└── metadata.py





文件	具体职责	不应该包含

models.py	资产、设备、拍摄会话的 ORM 映射	HTTP 处理

schemas.py	请求与响应的数据校验 Schema	数据库事务

repository.py	SQLAlchemy 数据查询及持久化	复杂业务决策

service.py	导入、分类、关联等用例编排	ComfyUI 节点注册

calibration.py	Dark/Flat/Bias 匹配规则	直接操作 UI

metadata.py	FITS Header 和拍摄元数据提取	管理整个资产数据库



推荐的执行关系是：

api/assets.py

&#x20;      │

&#x20;      ▼

assets/service.py

&#x20;      │

&#x20;      ├── assets/metadata.py

&#x20;      ├── assets/calibration.py

&#x20;      └── assets/repository.py

&#x20;                   │

&#x20;                   ▼

&#x20;              storage/sqlite.py

&#x20;                   │

&#x20;                   ▼

&#x20;                assets.db





这与 Cosmic Python 的 Service Layer、Repository、Unit of Work 思路一致。

Cosmic Python





不过不要求每个业务域都有相同的六个文件。例如 processing/ 以文件与数组处理为主，不需要 Repository；software/ 的主要外部依赖是应用程序，而不是数据库，因此需要 Adapter 和 Runner。

数据库事务边界

我建议沿用 SQLAlchemy 官方的 Session 生命周期管理：

\- 由 API 入口或 Application Service 建立事务边界。

\- Repository 接收 Session，不自行到处创建数据库连接。

\- 每次请求或独立操作使用自己的 Session。

\- 长时间运行 Siril 或读取大型 FITS 时，不保持 SQLite 写事务开启。

SQLAlchemy 官方特别强调 Session 不应跨并发线程或异步任务共享，应保持事务简短。

SQLAlchemy 2.0 Documentation





5\. ComfyUI Extension 的特殊规范

这一部分是普通 Python 后端教程无法直接解决的，也是 AstroPhoto 必须严格遵守的地方。

5.1 \_\_init\_\_.py 只负责插件加载

根目录 \_\_init\_\_.py 的主要职责应保持有限：

Extension \_\_init\_\_.py

&#x20;      │

&#x20;      ├── 导出 NODE_CLASS_MAPPINGS

&#x20;      ├── 导出 NODE_DISPLAY_NAME_MAPPINGS

&#x20;      ├── 设置 WEB_DIRECTORY = "./js"

&#x20;      ├── 注册 AstroPhoto API

&#x20;      └── 注册必要的 ComfyUI 模型路径





不要在导入时执行数据库全量扫描、RAG 模型加载、软件检测或长时间的初始化操作。



ComfyUI 会在启动加载插件时执行这个文件，一旦异常向外传播，就可能导致整个自定义节点包加载失败。

ComfyUI





因此建议 astrophoto/bootstrap.py 只负责依赖组装；较重的服务在实际需要时初始化。

5.2 Node 执行与业务逻辑分离

以 Siril 背景提取为例，最终调用链应当是：

ComfyUI Execution Engine

&#x20;       │

&#x20;       ▼

nodes/siril/background.py

&#x20;       │

&#x20;       ▼

astrophoto/software/service.py

&#x20;       │

&#x20;       ▼

astrophoto/software/registry.py

&#x20;       │

&#x20;       ▼

astrophoto/software/runner.py

&#x20;       │

&#x20;       ▼

astrophoto/software/adapters/siril.py

&#x20;       │

&#x20;       ▼

&#x20;     siril-cli





nodes/siril/background.py 仅完成 ComfyUI Schema、参数转换、业务调用和结果返回。



service.py 检查操作是否可执行，registry.py 确认软件位置和能力，runner.py 管理进程、超时和取消，adapters/siril.py 将操作转换为 Siril 支持的命令或脚本。



ComfyUI 调度 Node 之间的执行顺序；AstroPhoto 只负责 Node 内部的处理操作。



另外，ComfyUI 支持通过 IS_CHANGED 等机制控制节点缓存，因此对于依赖外部文件内容的节点，未来需要把文件签名或相关状态纳入变更判断。

ComfyUI



5.3 API 用 ComfyUI 原生 aiohttp

API 文件应使用 ComfyUI 已经提供的 PromptServer.instance.routes，不应创建独立 FastAPI 应用。



例如：

from aiohttp import webfrom server import PromptServerroutes = PromptServer.instance.routes\@routes.get("/astrophoto/v1/status")async def astrophoto_status(request):    return web.json_response({        "status": "ok",    })







这是官方支持的自定义路由模式。业务路由应进一步调用相应 Service，而不是在 Handler 内编写 SQL 或执行 Siril。

ComfyUI





我建议对外业务 API 固定使用统一前缀：



/astrophoto/v1/



这样未来 MCP 的 HTTP Client 只需要适配一套清晰的接口契约。版本 v1 指 API 契约版本，不需要随 Extension 的每个 SemVer 版本递增。



Canvas API 也走这个前缀，但真实画布操作仍然要由已连接的 ComfyUI Frontend 执行。



6\. 存储文件与源代码要完全分开

你之前设计的三个 SQLite 数据库可以保留，但它们的实际文件不属于项目源码。

源码目录

astrophoto/

├── storage/

├── assets/

├── knowledge/

├── memory/

└── experiments/





管理规则、模型、服务与持久化逻辑



用户数据目录

\~/.astrophoto/

├── databases/

│   ├── assets.db

│   ├── knowledge.db

│   └── memory.db

├── config/

├── knowledge/

├── runs/

├── cache/

└── logs/





管理实际用户数据、索引、运行记录与缓存





其中：

\- assets.db 保存设备、观测地、帧资产、校准关系，以及与资产相关的 ProcessingRun/Trial。

\- knowledge.db 保存知识索引，允许根据原始文档重建。

\- memory.db 保存用户行为、偏好、反馈和长期记忆。

不同数据库之间通过逻辑标识符关联，而不是依赖跨数据库外键。



Alembic 官方提供多迁移环境管理方案，因此 assets.db 和 memory.db 可以维护独立的版本历史；知识库的可重建索引则可以在 knowledge/indexing.py 中单独管理。

Alembic 1.20.1 documentation





至于 Embedding/Reranker 模型文件，继续使用 ComfyUI 注册的模型目录，而非放入 Git 仓库。ComfyUI 的 folder_paths.add_model_folder_path() 提供了相关扩展机制。

GitHub



7\. 哪些部分现在就应该标准化？

考虑到你目前只有 v0.0.1 的 Vue 画板及 MCP 基础功能，我不建议立刻创建上面所有未来业务文件。



应先确定这一版最小骨架：

ComfyUI_AstroPhoto/

├── \_\_init\_\_.py

├── nodes/                         # 已有节点，保持原样

├── frontend/                      # 已有前端，保持原样

├── mcp/                           # 已在开发，不重复重构

│

└── astrophoto/

&#x20;   ├── \_\_init\_\_.py

&#x20;   ├── bootstrap.py

&#x20;   ├── core/

&#x20;   │   ├── config.py

&#x20;   │   ├── paths.py

&#x20;   │   └── errors.py

&#x20;   └── api/

&#x20;       ├── \_\_init\_\_.py

&#x20;       └── status.py





其中 api/status.py 应实现真实的 Extension 状态接口，让现有 MCP 可以进一步识别 Extension 是否成功加载。不要仅为了填充目录而创建没有调用方的抽象。



其余业务模块在真正开始开发对应功能时创建。

推荐的标准化顺序

优先级	范围	应达到的结果

P0	astrophoto/core/	配置、路径、错误规范统一

P0	astrophoto/api/	ComfyUI 原生 HTTP 注册及标准响应

P0	bootstrap.py	服务初始化有唯一入口、易于测试

P1	astrophoto/storage/	数据库连接和事务管理规范统一

按需	assets/、software/ 等	对应功能开发时建立内部结构

持续	tests/、docs/architecture.md	验证目录边界与真实实现



最后需要确保 .comfyignore 不会排除新增加的 astrophoto/，因为这个目录属于 Extension 运行代码。Comfy Registry 官方默认打包 Git 跟踪的文件，发布时仍需要校验实际文件清单。

ComfyUI





8\. 应写入架构文档的最终规范

建议将以下内容保存到 docs/architecture.md 的 Backend Architecture 部分：



\## Extension Backend Architecture



The Extension uses a domain-first modular monolith.



\### Module Ownership



\- \`nodes/\`: ComfyUI node schemas, execution entrypoints, and I/O adapters.

\- \`frontend/\`: Vue UI, widgets, settings, and frontend canvas integration.

\- \`astrophoto/core/\`: Shared configuration, paths, errors, and capabilities.

\- \`astrophoto/api/\`: ComfyUI aiohttp endpoints; no direct business logic.

\- \`astrophoto/storage/\`: Shared database connection and migration infrastructure.

\- \`astrophoto/assets/\`: Equipment, image assets, metadata, and calibration relationships.

\- \`astrophoto/software/\`: Software discovery, adapters, and process execution.

\- \`astrophoto/processing/\`: Scientific image data types and format conversion.

\- \`astrophoto/knowledge/\`: Document indexing and retrieval.

\- \`astrophoto/memory/\`: User activity, preferences, and persistent memory.

\- \`astrophoto/experiments/\`: Parameter trials, metrics, and experiment records.

\- \`astrophoto/canvas/\`: Frontend command coordination and receipts.

\- \`mcp/\`: External FastMCP tools and skills, communicating only through public APIs.



\### Dependency Rules



\- ComfyUI owns workflow scheduling, graph state, execution, and undo.

\- Nodes and API handlers invoke domain services.

\- Domain services own business rules and coordinate adapters or repositories.

\- Repositories own persistence; software adapters own external application integration.

\- Domain services must not import \`nodes/\`, \`frontend/\`, or \`mcp/\`.

\- MCP must not directly access Extension databases or ComfyUI internal modules.

\- Heavy dependencies and optional software integrations load on demand.

\- Runtime data belongs outside the repository, under a configurable user data directory.

\- Create modules only when required by implemented features.







最终选择

我推荐正式确定 astrophoto/ 为 Domain-first Modular Monolith。



这不是把普通 FastAPI 项目搬到 ComfyUI 内，而是借鉴成熟后端的领域分离、Service Layer 和 Adapter 规范，同时服从 ComfyUI 的节点与执行生命周期。



对你的项目，最重要的长期边界是：



nodes/ 定义操作入口，astrophoto/ 实现操作，frontend/ 展示和管理，mcp/ 向 Agent 暴露能力，而 ComfyUI 负责工作流执行。



这样将来从一个 vue-basic 节点扩展到上百个 Siril/PixInsight 处理节点时，仍然可以复用统一的软件驱动、资产服务、配置和执行记录，不必重复开发每个 Node 的业务后端。ComfyUI_AstroPhoto Extension Backend 标准化指导教程（V3 Node API 修订）

适用基线：ComfyUI_AstroPhoto 0.0.1；节点 API 按用户确认的 V3 现状修订；以下代码是教学用最小实现/未来模块范例，没有对本地仓库运行或修改。目标是在保留现有 vue-basic 画板、\`CUSTOM_VUE_COMPONENT_BASIC\`、序列化与 PNG 上传→LoadImage→IMAGE 数据流的前提下，建立 AstroPhoto 后端的稳定边界。



0\. 使用当前环境，而不是假设一套全新环境

组件	已知实际版本	操作含义

ComfyUI Backend	0.45.0	在此宿主上做最终导入、路由和节点验证

ComfyUI Frontend	1.59.1	不能依赖宿主自动注入 PrimeVue

ComfyUI Python	3.12.4	Extension 必须在此环境安装并运行实际所需依赖

独立开发 .venv	3.13.15	只能代表开发环境测试，不能代替宿主验证

FastMCP	4.2.0	保留已经开展的 MCP 重构；不把业务服务迁入 MCP

HTTPX	0.28.1	MCP 使用它调用 ComfyUI/Extension HTTP API

Vue/Vite/PrimeVue	3.5.13 / 6.3.5 / 4.3.3	维持现有画板与构建流程，不修改节点 ID

Python CI	3.11 / 3.12	单元测试可并行；宿主集成验证单独执行

PyTorch/NumPy/Pillow（宿主）	2.3.0 / 1.26.4 / 10.3.0	不因 AstroPhoto 新增业务模块强制升级宿主核心包





SQLAlchemy、Alembic、Astropy、LangChain 的安装版本未在本次环境清单中确认。以下示例说明目标接口，不能把它们视为当前已安装并可执行。



1\. 目录标准与依赖方向

依据：ComfyUI V3 Node API 通过 comfy_entrypoint() 返回 ComfyExtension，其 get_node_list() 注册 io.ComfyNode 节点，\`WEB_DIRECTORY\` 仍用于暴露前端静态资源；Python 后端参考模块化单体、Service Layer 与 Adapter 边界。官方依据：https\://docs.comfy.org/custom-nodes/v3_migration，https\://github.com/Comfy-Org/ComfyUI/blob/master/custom_nodes/example_node.py.example。

节点版本约束： 以当前已安装宿主 ComfyUI 0.45.0 实际支持的 V3 API 为准。\`comfy_api.latest\` 仍可能在后续版本调整；升级宿主时重新验证 Schema 与注册行为。不要将本项目恢复为 V1。



ComfyUI_AstroPhoto/

├── \_\_init\_\_.py                     # 插件载入；仅注册 Node、Web 与轻量路由

├── nodes/                          # ComfyUI Node Schema / 执行入口

├── frontend/                       # Vue 组件、Settings、Sidebar、Canvas Bridge

├── js/                             # 编译后的 JS/CSS；不是 Python 业务代码

├── locales/                        # 宿主本地化资源

├── astrophoto/                     # Extension 业务后端（以下为目标结构）

│   ├── \_\_init\_\_.py

│   ├── bootstrap.py                # 组装业务服务，不做重负载操作

│   ├── core/

│   │   ├── paths.py                # 数据根目录和 ComfyUI 模型路径

│   │   ├── config.py               # 统一业务配置

│   │   ├── errors.py               # 领域错误

│   │   └── capabilities.py         # 真实能力发现

│   ├── api/

│   │   ├── routes.py               # PromptServer 路由注册

│   │   └── status.py               # 已具备能力的最小状态 API

│   ├── storage/

│   │   └── sqlite.py               # Engine/Session 工厂

│   ├── assets/                     # ORM/Repository/Service/FITS 元数据（按需创建）

│   ├── software/                   # Registry/Runner/Adapters（按需创建）

│   ├── processing/                 # FITS 等科学数据（按需创建）

│   ├── knowledge/                  # LangChain/FTS5（按需创建）

│   ├── memory/                     # 用户行为与长期偏好（按需创建）

│   ├── experiments/                # Trials/指标（按需创建）

│   └── canvas/                     # 前端命令 Broker（按需创建）

├── mcp/                            # 独立 PyPI 包：HTTP Client + FastMCP Tools/Skills

└── tests/                          # Extension 与跨包验证

依赖方向： nodes/ 和 astrophoto/api/ 调用 astrophoto/\<domain>/service.py；Service 再使用 Repository 或 Adapter；\`mcp/\` 只访问公开 HTTP API；ComfyUI 自身负责工作流图、队列、执行和 Undo。不要使业务 Service 反向 import nodes/、\`frontend/\` 或 mcp/。

Python Import 约束

ComfyUI 以插件包导入根 \_\_init\_\_.py。在 Extension 内优先使用包相对导入，例如 from .nodes import ... 和 from ..astrophoto.software.service import ...，不要通过插入 sys.path 来制造另一个顶层 astrophoto 包。单元测试需要准备模拟的 ComfyUI 宿主或通过可注入函数测试纯业务逻辑；简单地导入 ComfyUI_AstroPhoto.astrophoto 也会先执行根 \_\_init\_\_.py。

1.1 V3 节点 API 与测试约束（对当前 v0.0.1 现状的修订）

\- 根 \_\_init\_\_.py：保留实际已实现的 comfy_entrypoint()，返回 ComfyExtension；\`get_node_list()\` 暴露节点类，\`WEB_DIRECTORY = "./js"\` 不变。

\- nodes/：节点继承 io.ComfyNode，使用 define_schema() 返回 io.Schema（node_id、category、typed inputs/outputs）；\`execute()\` 是类方法并返回 io.NodeOutput。

\- V3 的 fingerprint_inputs() 对应旧式缓存控制。读取外部 FITS/资产路径的节点必须考虑文件内容变化，不能仅比较字符串路径。

\- 保留真实 Node ID vue-basic、Widget ID CUSTOM_VUE_COMPONENT_BASIC、序列化及 /upload/image 行为。不得由于重构而更改存量工作流 JSON 中的节点类型。

\- Extension API 的 aiohttp 路由可以由根入口轻量注册；它与 V3 Node Schema 是两个独立扩展面，不要求将业务服务放进节点类。

\- 单元测试至少校验 define_schema().node_id、输入输出类型、\`get_node_list()\` 包含当前节点、\`execute()\` 的 NodeOutput 行为；真实 ComfyUI 宿主须做节点加载与前端 Widget 回归。

\- 官方 V3 API 仍在演进：在发布 CI 中对实际宿主版本执行回归，不可仅依据静态类型文件作兼容性结论。

2\. 运行路径：\`astrophoto/core/paths.py\`

不要把 .db、模型、日志或工作文件放在 Git 仓库中。Windows/Linux/macOS 使用 pathlib，并提供明确的本地数据目录覆盖入口。

\# astrophoto/core/paths.py

import os

from pathlib import Path

from typing import Literal



DatabaseName = Literal["assets", "knowledge", "memory"]





def data_home() -> Path:

&#x20;   custom = os.environ.get("ASTROPHOTO_HOME")

&#x20;   root = Path(custom).expanduser() if custom else Path.home() / ".astrophoto"

&#x20;   return root.resolve()





def database_path(name: DatabaseName) -> Path:

&#x20;   return data_home() / "databases" / f"{name}.db"





def ensure_database_dir() -> Path:

&#x20;   folder = data_home() / "databases"

&#x20;   folder.mkdir(parents=True, exist_ok=True)

&#x20;   return folder

要点： 导入这个模块不会创建目录。真实初始化、存储升级、导入资产或写入文件时才创建；测试可以通过临时设置 ASTROPHOTO_HOME 做隔离。不要自动扫描整个硬盘上的天文文件。



ComfyUI 模型文件则保留在宿主管理的 model paths；独立注册额外模型类别：

\# astrophoto/core/model_paths.py（需要该功能时再创建）

from pathlib import Path



def register_model_paths() -> None:

&#x20;   import folder_paths  # 仅在 ComfyUI 宿主中调用

&#x20;   root = Path(folder_paths.models_dir)

&#x20;   folder_paths.add_model_folder_path("astrophoto_embedding", str(root / "astrophoto_embedding"))

&#x20;   folder_paths.add_model_folder_path("astrophoto_reranker", str(root / "astrophoto_reranker"))

注意：\`folder_paths\` 负责模型路径发现，不负责保证 Hugging Face 多文件模型完整性、下载许可或加载推理；这些以后属于 knowledge/。

3\. 最先落地的功能：Extension Status API

3.1 纯状态处理器

\# astrophoto/api/status.py

from aiohttp import web





def status_payload() -> dict:

&#x20;   return {

&#x20;       "service": "astrophoto",

&#x20;       "api_version": "v1",

&#x20;       "status": "ok",

&#x20;       "capabilities": {

&#x20;           "assets": False,

&#x20;           "software": False,

&#x20;           "canvas_bridge": False,

&#x20;           "knowledge": False,

&#x20;           "memory": False,

&#x20;           "experiments": False,

&#x20;       },

&#x20;   }





async def status_handler(\_request: web.Request) -> web.Response:

&#x20;   return web.json_response(status_payload())

目前返回 False 是对尚未实现能力的真实表述；不能因未来目录存在就报告为 True。等实现后从实际 Service/Adapter 检测结果生成能力状态。

3.2 与 ComfyUI 原生 aiohttp 集成

\# astrophoto/api/routes.py

from .status import status_handler





def register_routes(routes=None) -> None:

&#x20;   \# 可注入 routes，方便不启动 ComfyUI 的测试。

&#x20;   if routes is None:

&#x20;       from server import PromptServer

&#x20;       routes = PromptServer.instance.routes



&#x20;   routes.get("/astrophoto/v1/status")(status_handler)

官方自定义 HTTP 路由使用 PromptServer.instance.routes，不需要 FastAPI/Uvicorn。路由注册必须只执行一次，避免开发热重载或重复导入造成冲突；只在服务可用后调用。

3.3 根入口只做轻量注册

\# ComfyUI_AstroPhoto/\_\_init\_\_.py（V3 结构示意；与真实代码合并）

from comfy_api.latest import ComfyExtension, io



from .nodes import get_node_classes  # 示例：按仓库实际出口实现/保留现有注册

from .astrophoto.api.routes import register_routes



WEB_DIRECTORY = "./js"



\# 只注册轻量 aiohttp 路由；不得在这里加载模型或扫描资产。

register_routes()





class AstroPhotoExtension(ComfyExtension):

&#x20;   async def get_node_list(self) -> list[type[io.ComfyNode]]:

&#x20;       return get_node_classes()





async def comfy_entrypoint() -> ComfyExtension:

&#x20;   return AstroPhotoExtension()





\_\_all\_\_ = ["comfy_entrypoint", "WEB_DIRECTORY"]

get_node_classes() 是示意性的节点目录聚合接口，并非当前项目已经存在的函数。实际修改时应复用你仓库现有的 V3 get_node_list() / comfy_entrypoint()，不要重复注册，必须保持节点 ID vue-basic 与自定义 Widget ID CUSTOM_VUE_COMPONENT_BASIC 不变。



V3 官方要求 get_node_list() 为异步方法；\`comfy_entrypoint()\` 可同步或异步。不要再导出 V1 的 NODE_CLASS_MAPPINGS 作为主注册方式。



这个入口需要在 ComfyUI 0.45.0 中实际加载验证。不要在它里面创建 DB、执行迁移、启动 RAG、检查所有 Siril/PixInsight 软件位置或触发下载。若当前测试通过模拟 server 导入，需要同步更新 fixture，避免重复路由注册。

3.4 前端调用接口

ComfyUI 推荐使用已有 api.fetchApi()，以保留宿主的前缀、认证及路由行为。不要在源码里拼 http\://127.0.0.1:8188：

// frontend/src/api/status.ts — 由现有 ComfyUI API 实例注入

interface ComfyApi {

&#x20; fetchApi(path: string, init?: RequestInit): Promise\<Response>

}



export async function getAstroPhotoStatus(api: ComfyApi) {

&#x20; const response = await api.fetchApi("/astrophoto/v1/status")

&#x20; if (!response.ok) throw new Error(\`AstroPhoto status: ${response.status}\`)

&#x20; return await response.json()

}

Vue UI 所用的 api 实例应沿用当前已验证的前端宿主集成方式。不要猜测 Vite 源文件中的 ../../scripts/api.js 相对路径；检查打包后的 import 与生产加载 URL。



前端 1.59.1 特别注意： ComfyUI 宿主已移除 PrimeVue 插件和主题。你仍可以继续使用自身依赖的 PrimeVue 4.3.3，但必须在自建 Vue App/插件注入中配置 PrimeVue 和 CSS 主题，或优先使用宿主前端扩展 UI API。不能依赖 $primevue 或旧的 --p-\* CSS 变量。

4\. 业务数据库模式：\`astrophoto/storage/\` + 领域服务

这里以 assets.db 中一个设备表演示 SQLAlchemy 2.x 的官方 DeclarativeBase、\`Mapped\` 与 Session 使用。此节是未来资产模块教学示例，不是当前 v0.0.1 已实现的功能。

4.1 ORM 模型归领域，不放入全局 models.py

\# astrophoto/assets/models.py

from sqlalchemy import String

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column



class AssetBase(DeclarativeBase):

&#x20;   pass



class Equipment(AssetBase):

&#x20;   \_\_tablename\_\_ = "equipment"

&#x20;   id: Mapped[int] = mapped_column(primary_key=True)

&#x20;   name: Mapped[str] = mapped_column(String(120), nullable=False)

4.2 共享 SQLite 连接工厂

\# astrophoto/storage/sqlite.py

from pathlib import Path

from sqlalchemy import URL, create_engine

from sqlalchemy.orm import sessionmaker





def make_session_factory(path: Path):

&#x20;   path.parent.mkdir(parents=True, exist_ok=True)

&#x20;   url = URL.create("sqlite+pysqlite", database=str(path))

&#x20;   engine = create_engine(url, connect_args={"timeout": 20})

&#x20;   return engine, sessionmaker(engine, expire_on_commit=False)

数据库文件是用户数据，不能被发布包携带；Engine 可以按 DB 文件复用，但 Session 不可跨线程/asyncio task 共享。

4.3 Service 管事务，Repository 管查询（有必要时才拆）

\# astrophoto/assets/service.py

from .models import Equipment



def create_equipment(session_factory, name: str) -> dict:

&#x20;   with session_factory.begin() as session:

&#x20;       item = Equipment(name=name)

&#x20;       session.add(item)

&#x20;       session.flush()  # 获取自增主键；上下文成功退出才提交

&#x20;       return {"id": item.id, "name": item.name}

session_factory.begin() 在异常时自动回滚。对于简单 CRUD，Service 直接操作 ORM 就够用；复杂查询增多时再建立 assets/repository.py。正式发布时使用 Alembic 管迁移；\`AssetBase.metadata.create_all(engine)\` 只适合作为测试/初始原型初始化方案，不是可维护的升级机制。

4.4 aiohttp 不应阻塞事件循环

\# 一个 API handler 内调用同步 SQLAlchemy Service 的示意

import asyncio

from aiohttp import web

from pydantic import BaseModel, ConfigDict, Field, ValidationError



class EquipmentCreate(BaseModel):

&#x20;   model_config = ConfigDict(extra="forbid")

&#x20;   name: str = Field(min_length=1, max_length=120)



async def handle_create_equipment(request: web.Request, session_factory) -> web.Response:

&#x20;   try:

&#x20;       body = EquipmentCreate.model_validate(await request.json())

&#x20;   except (ValueError, ValidationError):

&#x20;       raise web.HTTPBadRequest(text="Invalid equipment payload")



&#x20;   \# 工厂可跨线程传递，Session 必须在工作线程内创建和销毁。

&#x20;   result = await asyncio.to_thread(create_equipment, session_factory, body.name)

&#x20;   return web.json_response(result, status=201)

该 handler 是可注入示例，未注册为现有路由。等开发资产模块时，由 api/assets.py 绑定真实 Service，避免编造数据库 API；生产环境还需记录安全日志、拒绝越权访问、处理唯一性冲突。

5\. 外部软件：\`software/registry.py\`、\`runner.py\` 与 Adapter

三个层次的区别：

\- registry.py：保存/验证软件位置、版本和能力；UI/Agent 提交的候选路径只能经验证后生效。

\- runner.py：统一进程超时、退出码、工作目录、日志和取消。

\- adapters/siril.py、\`adapters/pixinsight.py\`：只将受支持的结构化操作转换为对应软件的命令和脚本；不能向 Agent 暴露自由 Shell 命令。

\# astrophoto/software/runner.py：同步 Node 执行可直接调用

from pathlib import Path

from subprocess import CompletedProcess, run

from collections.abc import Sequence





def run_program(

&#x20;   executable: Path,

&#x20;   argv: Sequence[str],

&#x20;   working_dir: Path,

&#x20;   timeout_seconds: int = 600,

) -> CompletedProcess[str]:

&#x20;   if not executable.is_file():

&#x20;       raise FileNotFoundError(f"Executable not found: {executable}")

&#x20;   if not working_dir.is_dir():

&#x20;       raise NotADirectoryError(working_dir)

&#x20;   return run(

&#x20;       [str(executable), \*argv],

&#x20;       cwd=working_dir,

&#x20;       capture_output=True,

&#x20;       text=True,

&#x20;       errors="replace",

&#x20;       timeout=timeout_seconds,

&#x20;       check=True,

&#x20;       shell=False,

&#x20;   )

重要：\`argv\` 应由 Adapter 从参数 Schema 构造，不允许 MCP 用户直接提供任意命令或脚本内容；工作目录应使用 \~/.astrophoto/runs/\<run_id>/，输出与原始文件隔离。实际 Siril/PixInsight 选项、退出行为必须针对已安装版本和官方软件文档核验。长运行任务还需考虑日志大小上限、取消与子进程树清理（Windows 特别测试）。



ComfyUI 的 Node 本身只做 Schema、输入转换和 Service 调用：

\# nodes/example_v3.py：V3 API 形状教学示例（不注册到正式项目）

from comfy_api.latest import io





class ImagePassThrough(io.ComfyNode):

&#x20;   @classmethod

&#x20;   def define_schema(cls) -> io.Schema:

&#x20;       return io.Schema(

&#x20;           node_id="AstroPhoto_ImagePassThrough_Example",

&#x20;           display_name="Image Pass Through (Example)",

&#x20;           category="AstroPhoto/Examples",

&#x20;           inputs=[io.Image.Input("image")],

&#x20;           outputs=[io.Image.Output()],

&#x20;       )



&#x20;   @classmethod

&#x20;   def execute(cls, image) -> io.NodeOutput:

&#x20;       \# 真实 Siril Node 应调用 astrophoto/software/service.py；

&#x20;       \# 不应在 Node 内管理外部进程、数据库或软件路径。

&#x20;       return io.NodeOutput(image)

这是官方 V3 io.ComfyNode → define_schema → execute → io.NodeOutput 形状的最小教学实例。真正的 Siril 节点应定义其受支持的科学输入/输出 Schema 并委托 astrophoto/software/service.py，不应把未实现的操作注册成可用节点。



这个示例不得注册为可用节点，直到 Service 和 Adapter 已真正实现；保留现有 vue-basic 的 ID、Widget、IMAGE 数据流不变。Node 级执行顺序由 ComfyUI 控制，无需再写一个 DAG/任务调度框架。

6\. FITS 科学数据：\`processing/\` 和 assets/metadata.py

用户资产以 FITS/RAW/TIFF 为主，不能把所有处理数据默默压缩为 PNG 或 [B,H,W,C] Tensor。下面是只提取 Header 的示例：

\# astrophoto/assets/metadata.py

from pathlib import Path





def inspect_fits(path: Path) -> dict:

&#x20;   from astropy.io import fits  # 功能需要时导入

&#x20;   with fits.open(path, mode="readonly", memmap=True) as hdul:

&#x20;       header = hdul[0].header

&#x20;       fields = ("IMAGETYP", "EXPTIME", "FILTER", "GAIN", "OFFSET")

&#x20;       return {field: header.get(field) for field in fields}

要区分缺失、未知、推断与用户确认的元数据；不要因为 Header 缺少某字段就填造值。\`memmap=True\` 适合处理大型 FITS，但注意访问 .data 后可能产生额外文件句柄。天文科学数据应明确设计专用输入输出契约，只有用户需要普通 IMAGE 时才进行显式、可测试的转换。

7\. Knowledge 与 Memory：模块归属，不提前开发空功能

目标模块	主要文件	数据归属	原则

knowledge/	ingestion.py, indexing.py, retrieval.py, service.py	knowledge.db	FTS5 起步；LangChain 负责文档管道，Embedding 可选，引用来源必须保留

memory/	events.py, consolidation.py, service.py, retrieval.py	memory.db	行为事件与长期记忆分离；用户可关闭、查看、纠正、删除；不要把 Agent 自动操作当成用户偏好

experiments/	service.py, metrics.py, models.py	本地运行记录/关联资产	记录 prompt_id、参数、输入、输出、指标；Subagent 在外部编排

canvas/	broker.py	ComfyUI 前端图状态	发送画布命令到真实前端并收到回执，不能假定 /prompt 修改画布





FTS5 官方示例（将来由 knowledge/indexing.py 使用，并保存真实 source IDs）：

CREATE VIRTUAL TABLE chunks_fts USING fts5(title, body, source_id UNINDEXED);

注意中文分词与精确的软件参数名称检索效果；先证明检索结果准确，再叠加 sqlite-vec/embedding。用户记忆可能涉及位置，应明示采集范围，不自动上传精确坐标。

8\. 测试与验证顺序

验证	目标	环境

api/status.py 纯函数	返回能力与状态一致、未实现能力始终为 false	开发 Python 3.11/3.12/3.13（视配置）

api/routes.py 注入的 RouteTableDef	路由只注册一次、方法正确	pytest + aiohttp

core/paths.py	ASTROPHOTO_HOME 隔离、导入不创建用户目录	tmp_path

storage/sqlite.py	事务成功提交、错误回滚、跨线程不共享 Session	pytest + SQLite temp file

software/runner.py	无效路径、超时、失败返回码、无 shell=True	pytest，调用受控测试程序

nodes/	V3 comfy_entrypoint/get_node_list/define_schema、\`vue-basic\` Node ID、IMAGE 输出不回归	ComfyUI Test Double + 宿主集成

frontend/	Vue 组件/序列化；PrimeVue 独立初始化与宿主兼容	Vitest 4.0.18 + Browser 测试

mcp/	version、\`connection_status\`、stdio；工具接口不变	FastMCP 4.2.0 + httpx MockTransport

packaging/	Registry 含 astrophoto、nodes、js、locales；不含 mcp/ref	comfy-cli 1.26.0





开发命令必须以仓库实际配置为准。可能的现有验证入口：

uv run pytest tests/nodes tests/packaging

uv run --package astrophoto-mcp pytest mcp/tests

pnpm -C frontend build

pnpm -C frontend exec vitest run

关于 TypeScript： 目前项目没有独立锁定 typescript 和 vue-tsc，不能声称已启用独立类型检查。建议先确认宿主类型包（1.22.1）与宿主前端（1.59.1）的兼容性，再显式添加 TypeScript/vue-tsc 和 CI 检查；确保 Vite build 不被误认为完整类型检查。



关于宿主依赖： 开发 .venv Python 3.13.15 的通过结果不能替代 ComfyUI Python 3.12.4 的验证。新增 SQLAlchemy/Astropy 等依赖前，必须测试它们与宿主 torch 2.3.0 / NumPy 1.26.4 / Pillow 10.3.0 的解析和导入兼容。

9\. Registry / PyPI 发布边界

\- Comfy Registry 包含根 \_\_init\_\_.py、\`nodes/\`、\`astrophoto/\`、\`js/\`、\`locales/\`，通过 .comfyignore 排除 mcp/、\`reference/\`、测试、临时数据、\`.agent/\`。

\- MCP PyPI Wheel 只包含 astrophoto_mcp 包、真实 Tools/Skills 及必要元数据，不能把 Extension 源码、数据库或运行时数据混入 MCP。

\- 必须解决当前 requirements.txt 的本地 ./mcp 引用： mcp/ 在 Registry 包中被排除，发行包安装时不能继续引用它。开发期用 uv Workspace Sources；发行元数据使用同版本的 astrophoto-mcp==X.Y.Z，通过构建后安装测试验证。

\- 同仓库 Lockstep SemVer，一个 Git Tag，先发布 PyPI 再发布 Registry。发布流程检查源码与归档内容分离。

\- uv Workspace 共享一个 lock，要求项目成员的 Python 约束存在交集。默认 ComfyUI 宿主不必也使用开发环境的 3.13。

10\. 推荐的标准化验收标准

完成当前仓库结构标准化的最低条件：

1\. Extension 使用 V3 comfy_entrypoint / ComfyExtension.get_node_list() 在 ComfyUI 0.45.0 / Python 3.12.4 加载，保持 vue-basic、Widget 和 PNG→IMAGE 数据流。

2\. /astrophoto/v1/status 在实际宿主返回可验证状态，且未实现能力仍标记 unavailable。

3\. astrophoto/ 中仅包含当前真实需要的 Core、Status API 和少量引导代码，其他业务域以文档规划，不创建空实现。

4\. 所有新增处理逻辑明确位于 astrophoto/，Node、UI、MCP 仅保留各自适配职责。

5\. 数据不写入源码目录；导入模块不执行重负载业务；同步 IO 不阻塞 aiohttp 事件循环。

6\. 确认 .venv、宿主、CI 环境差异；前端不依赖 ComfyUI 提供 PrimeVue。

7\. 单元测试与真实宿主验证分别报告，不把未验证工作标记为完成。

官方参考资料

\- ComfyUI V3 节点迁移和接口（本项目使用）：https\://docs.comfy.org/custom-nodes/v3_migration

\- ComfyUI V3 官方样例：https\://github.com/Comfy-Org/ComfyUI/blob/master/custom_nodes/example_node.py.example

\- ComfyUI 自定义节点概述：https\://docs.comfy.org/custom-nodes/overview

\- ComfyUI HTTP/WS、自定义 aiohttp 路由：https\://docs.comfy.org/development/comfyui-server/comms_routes

\- Comfy Registry 打包与 .comfyignore：https\://docs.comfy.org/registry/publishing

\- ComfyUI Frontend Extension 开发：https\://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/core.md

\- PrimeVue 移除迁移：https\://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/primevue-removal-migration.md

\- SQLAlchemy 2.0 ORM Quick Start：https\://docs.sqlalchemy.org/en/20/orm/quickstart.html

\- SQLAlchemy Session Basics：https\://docs.sqlalchemy.org/en/20/orm/session_basics.html

\- Pydantic 模型和验证：https\://docs.pydantic.dev/latest/concepts/models/

\- Python asyncio.to_thread：https\://docs.python.org/3.12/library/asyncio-task.html

\- Python subprocess：https\://docs.python.org/3.12/library/subprocess.html

\- Astropy FITS I/O：https\://docs.astropy.org/en/stable/io/fits/

\- SQLite FTS5：https\://www\.sqlite.org/fts5.html

\- uv Workspace：https\://docs.astral.sh/uv/concepts/projects/workspaces/ComfyUI_AstroPhoto Extension Backend 标准化指导教程

适用基线：ComfyUI_AstroPhoto 0.0.1；2026-11-16 核验；以下代码是教学用最小实现/未来模块范例，没有对本地仓库运行或修改。目标是在保留现有 vue-basic 画板、\`CUSTOM_VUE_COMPONENT_BASIC\`、序列化与 PNG 上传→LoadImage→IMAGE 数据流的前提下，建立 AstroPhoto 后端的稳定边界。



0\. 使用当前环境，而不是假设一套全新环境

组件	已知实际版本	操作含义

ComfyUI Backend	0.45.0	在此宿主上做最终导入、路由和节点验证

ComfyUI Frontend	1.59.1	不能依赖宿主自动注入 PrimeVue

ComfyUI Python	3.12.4	Extension 必须在此环境安装并运行实际所需依赖

独立开发 .venv	3.13.15	只能代表开发环境测试，不能代替宿主验证

FastMCP	4.2.0	保留已经开展的 MCP 重构；不把业务服务迁入 MCP

HTTPX	0.28.1	MCP 使用它调用 ComfyUI/Extension HTTP API

Vue/Vite/PrimeVue	3.5.13 / 6.3.5 / 4.3.3	维持现有画板与构建流程，不修改节点 ID

Python CI	3.11 / 3.12	单元测试可并行；宿主集成验证单独执行

PyTorch/NumPy/Pillow（宿主）	2.3.0 / 1.26.4 / 10.3.0	不因 AstroPhoto 新增业务模块强制升级宿主核心包





SQLAlchemy、Alembic、Astropy、LangChain 的安装版本未在本次环境清单中确认。以下示例说明目标接口，不能把它们视为当前已安装并可执行。



1\. 目录标准与依赖方向

依据：ComfyUI 的节点包从根 \_\_init\_\_.py 导出 NODE_CLASS_MAPPINGS/\`WEB_DIRECTORY\`；Python 后端参考模块化单体、Service Layer 与 Adapter 边界。

ComfyUI_AstroPhoto/

├── \_\_init\_\_.py                     # 插件载入；仅注册 Node、Web 与轻量路由

├── nodes/                          # ComfyUI Node Schema / 执行入口

├── frontend/                       # Vue 组件、Settings、Sidebar、Canvas Bridge

├── js/                             # 编译后的 JS/CSS；不是 Python 业务代码

├── locales/                        # 宿主本地化资源

├── astrophoto/                     # Extension 业务后端（以下为目标结构）

│   ├── \_\_init\_\_.py

│   ├── bootstrap.py                # 组装业务服务，不做重负载操作

│   ├── core/

│   │   ├── paths.py                # 数据根目录和 ComfyUI 模型路径

│   │   ├── config.py               # 统一业务配置

│   │   ├── errors.py               # 领域错误

│   │   └── capabilities.py         # 真实能力发现

│   ├── api/

│   │   ├── routes.py               # PromptServer 路由注册

│   │   └── status.py               # 已具备能力的最小状态 API

│   ├── storage/

│   │   └── sqlite.py               # Engine/Session 工厂

│   ├── assets/                     # ORM/Repository/Service/FITS 元数据（按需创建）

│   ├── software/                   # Registry/Runner/Adapters（按需创建）

│   ├── processing/                 # FITS 等科学数据（按需创建）

│   ├── knowledge/                  # LangChain/FTS5（按需创建）

│   ├── memory/                     # 用户行为与长期偏好（按需创建）

│   ├── experiments/                # Trials/指标（按需创建）

│   └── canvas/                     # 前端命令 Broker（按需创建）

├── mcp/                            # 独立 PyPI 包：HTTP Client + FastMCP Tools/Skills

└── tests/                          # Extension 与跨包验证

依赖方向： nodes/ 和 astrophoto/api/ 调用 astrophoto/\<domain>/service.py；Service 再使用 Repository 或 Adapter；\`mcp/\` 只访问公开 HTTP API；ComfyUI 自身负责工作流图、队列、执行和 Undo。不要使业务 Service 反向 import nodes/、\`frontend/\` 或 mcp/。

Python Import 约束

ComfyUI 以插件包导入根 \_\_init\_\_.py。在 Extension 内优先使用包相对导入，例如 from .nodes import ... 和 from ..astrophoto.software.service import ...，不要通过插入 sys.path 来制造另一个顶层 astrophoto 包。单元测试需要准备模拟的 ComfyUI 宿主或通过可注入函数测试纯业务逻辑；简单地导入 ComfyUI_AstroPhoto.astrophoto 也会先执行根 \_\_init\_\_.py。

2\. 运行路径：\`astrophoto/core/paths.py\`

不要把 .db、模型、日志或工作文件放在 Git 仓库中。Windows/Linux/macOS 使用 pathlib，并提供明确的本地数据目录覆盖入口。

\# astrophoto/core/paths.py

import os

from pathlib import Path

from typing import Literal



DatabaseName = Literal["assets", "knowledge", "memory"]





def data_home() -> Path:

&#x20;   custom = os.environ.get("ASTROPHOTO_HOME")

&#x20;   root = Path(custom).expanduser() if custom else Path.home() / ".astrophoto"

&#x20;   return root.resolve()





def database_path(name: DatabaseName) -> Path:

&#x20;   return data_home() / "databases" / f"{name}.db"





def ensure_database_dir() -> Path:

&#x20;   folder = data_home() / "databases"

&#x20;   folder.mkdir(parents=True, exist_ok=True)

&#x20;   return folder

要点： 导入这个模块不会创建目录。真实初始化、存储升级、导入资产或写入文件时才创建；测试可以通过临时设置 ASTROPHOTO_HOME 做隔离。不要自动扫描整个硬盘上的天文文件。



ComfyUI 模型文件则保留在宿主管理的 model paths；独立注册额外模型类别：

\# astrophoto/core/model_paths.py（需要该功能时再创建）

from pathlib import Path



def register_model_paths() -> None:

&#x20;   import folder_paths  # 仅在 ComfyUI 宿主中调用

&#x20;   root = Path(folder_paths.models_dir)

&#x20;   folder_paths.add_model_folder_path("astrophoto_embedding", str(root / "astrophoto_embedding"))

&#x20;   folder_paths.add_model_folder_path("astrophoto_reranker", str(root / "astrophoto_reranker"))

注意：\`folder_paths\` 负责模型路径发现，不负责保证 Hugging Face 多文件模型完整性、下载许可或加载推理；这些以后属于 knowledge/。

3\. 最先落地的功能：Extension Status API

3.1 纯状态处理器

\# astrophoto/api/status.py

from aiohttp import web





def status_payload() -> dict:

&#x20;   return {

&#x20;       "service": "astrophoto",

&#x20;       "api_version": "v1",

&#x20;       "status": "ok",

&#x20;       "capabilities": {

&#x20;           "assets": False,

&#x20;           "software": False,

&#x20;           "canvas_bridge": False,

&#x20;           "knowledge": False,

&#x20;           "memory": False,

&#x20;           "experiments": False,

&#x20;       },

&#x20;   }





async def status_handler(\_request: web.Request) -> web.Response:

&#x20;   return web.json_response(status_payload())

目前返回 False 是对尚未实现能力的真实表述；不能因未来目录存在就报告为 True。等实现后从实际 Service/Adapter 检测结果生成能力状态。

3.2 与 ComfyUI 原生 aiohttp 集成

\# astrophoto/api/routes.py

from .status import status_handler





def register_routes(routes=None) -> None:

&#x20;   \# 可注入 routes，方便不启动 ComfyUI 的测试。

&#x20;   if routes is None:

&#x20;       from server import PromptServer

&#x20;       routes = PromptServer.instance.routes



&#x20;   routes.get("/astrophoto/v1/status")(status_handler)

官方自定义 HTTP 路由使用 PromptServer.instance.routes，不需要 FastAPI/Uvicorn。路由注册必须只执行一次，避免开发热重载或重复导入造成冲突；只在服务可用后调用。

3.3 根入口只做轻量注册

\# ComfyUI_AstroPhoto/\_\_init\_\_.py（结构示意；与真实文件合并）

from .nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

from .astrophoto.api.routes import register_routes



WEB_DIRECTORY = "./js"

register_routes()



\_\_all\_\_ = [

&#x20;   "NODE_CLASS_MAPPINGS",

&#x20;   "NODE_DISPLAY_NAME_MAPPINGS",

&#x20;   "WEB_DIRECTORY",

]

这个入口需要在 ComfyUI 0.45.0 中实际加载验证。不要在它里面创建 DB、执行迁移、启动 RAG、检查所有 Siril/PixInsight 软件位置或触发下载。若当前测试通过模拟 server 导入，需要同步更新 fixture，避免重复路由注册。

3.4 前端调用接口

ComfyUI 推荐使用已有 api.fetchApi()，以保留宿主的前缀、认证及路由行为。不要在源码里拼 http\://127.0.0.1:8188：

// frontend/src/api/status.ts — 由现有 ComfyUI API 实例注入

interface ComfyApi {

&#x20; fetchApi(path: string, init?: RequestInit): Promise\<Response>

}



export async function getAstroPhotoStatus(api: ComfyApi) {

&#x20; const response = await api.fetchApi("/astrophoto/v1/status")

&#x20; if (!response.ok) throw new Error(\`AstroPhoto status: ${response.status}\`)

&#x20; return await response.json()

}

Vue UI 所用的 api 实例应沿用当前已验证的前端宿主集成方式。不要猜测 Vite 源文件中的 ../../scripts/api.js 相对路径；检查打包后的 import 与生产加载 URL。



前端 1.59.1 特别注意： ComfyUI 宿主已移除 PrimeVue 插件和主题。你仍可以继续使用自身依赖的 PrimeVue 4.3.3，但必须在自建 Vue App/插件注入中配置 PrimeVue 和 CSS 主题，或优先使用宿主前端扩展 UI API。不能依赖 $primevue 或旧的 --p-\* CSS 变量。

4\. 业务数据库模式：\`astrophoto/storage/\` + 领域服务

这里以 assets.db 中一个设备表演示 SQLAlchemy 2.x 的官方 DeclarativeBase、\`Mapped\` 与 Session 使用。此节是未来资产模块教学示例，不是当前 v0.0.1 已实现的功能。

4.1 ORM 模型归领域，不放入全局 models.py

\# astrophoto/assets/models.py

from sqlalchemy import String

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column



class AssetBase(DeclarativeBase):

&#x20;   pass



class Equipment(AssetBase):

&#x20;   \_\_tablename\_\_ = "equipment"

&#x20;   id: Mapped[int] = mapped_column(primary_key=True)

&#x20;   name: Mapped[str] = mapped_column(String(120), nullable=False)

4.2 共享 SQLite 连接工厂

\# astrophoto/storage/sqlite.py

from pathlib import Path

from sqlalchemy import URL, create_engine

from sqlalchemy.orm import sessionmaker





def make_session_factory(path: Path):

&#x20;   path.parent.mkdir(parents=True, exist_ok=True)

&#x20;   url = URL.create("sqlite+pysqlite", database=str(path))

&#x20;   engine = create_engine(url, connect_args={"timeout": 20})

&#x20;   return engine, sessionmaker(engine, expire_on_commit=False)

数据库文件是用户数据，不能被发布包携带；Engine 可以按 DB 文件复用，但 Session 不可跨线程/asyncio task 共享。

4.3 Service 管事务，Repository 管查询（有必要时才拆）

\# astrophoto/assets/service.py

from .models import Equipment



def create_equipment(session_factory, name: str) -> dict:

&#x20;   with session_factory.begin() as session:

&#x20;       item = Equipment(name=name)

&#x20;       session.add(item)

&#x20;       session.flush()  # 获取自增主键；上下文成功退出才提交

&#x20;       return {"id": item.id, "name": item.name}

session_factory.begin() 在异常时自动回滚。对于简单 CRUD，Service 直接操作 ORM 就够用；复杂查询增多时再建立 assets/repository.py。正式发布时使用 Alembic 管迁移；\`AssetBase.metadata.create_all(engine)\` 只适合作为测试/初始原型初始化方案，不是可维护的升级机制。

4.4 aiohttp 不应阻塞事件循环

\# 一个 API handler 内调用同步 SQLAlchemy Service 的示意

import asyncio

from aiohttp import web

from pydantic import BaseModel, ConfigDict, Field, ValidationError



class EquipmentCreate(BaseModel):

&#x20;   model_config = ConfigDict(extra="forbid")

&#x20;   name: str = Field(min_length=1, max_length=120)



async def handle_create_equipment(request: web.Request, session_factory) -> web.Response:

&#x20;   try:

&#x20;       body = EquipmentCreate.model_validate(await request.json())

&#x20;   except (ValueError, ValidationError):

&#x20;       raise web.HTTPBadRequest(text="Invalid equipment payload")



&#x20;   \# 工厂可跨线程传递，Session 必须在工作线程内创建和销毁。

&#x20;   result = await asyncio.to_thread(create_equipment, session_factory, body.name)

&#x20;   return web.json_response(result, status=201)

该 handler 是可注入示例，未注册为现有路由。等开发资产模块时，由 api/assets.py 绑定真实 Service，避免编造数据库 API；生产环境还需记录安全日志、拒绝越权访问、处理唯一性冲突。

5\. 外部软件：\`software/registry.py\`、\`runner.py\` 与 Adapter

三个层次的区别：

\- registry.py：保存/验证软件位置、版本和能力；UI/Agent 提交的候选路径只能经验证后生效。

\- runner.py：统一进程超时、退出码、工作目录、日志和取消。

\- adapters/siril.py、\`adapters/pixinsight.py\`：只将受支持的结构化操作转换为对应软件的命令和脚本；不能向 Agent 暴露自由 Shell 命令。

\# astrophoto/software/runner.py：同步 Node 执行可直接调用

from pathlib import Path

from subprocess import CompletedProcess, run

from collections.abc import Sequence





def run_program(

&#x20;   executable: Path,

&#x20;   argv: Sequence[str],

&#x20;   working_dir: Path,

&#x20;   timeout_seconds: int = 600,

) -> CompletedProcess[str]:

&#x20;   if not executable.is_file():

&#x20;       raise FileNotFoundError(f"Executable not found: {executable}")

&#x20;   if not working_dir.is_dir():

&#x20;       raise NotADirectoryError(working_dir)

&#x20;   return run(

&#x20;       [str(executable), \*argv],

&#x20;       cwd=working_dir,

&#x20;       capture_output=True,

&#x20;       text=True,

&#x20;       errors="replace",

&#x20;       timeout=timeout_seconds,

&#x20;       check=True,

&#x20;       shell=False,

&#x20;   )

重要：\`argv\` 应由 Adapter 从参数 Schema 构造，不允许 MCP 用户直接提供任意命令或脚本内容；工作目录应使用 \~/.astrophoto/runs/\<run_id>/，输出与原始文件隔离。实际 Siril/PixInsight 选项、退出行为必须针对已安装版本和官方软件文档核验。长运行任务还需考虑日志大小上限、取消与子进程树清理（Windows 特别测试）。



ComfyUI 的 Node 本身只做 Schema、输入转换和 Service 调用：

\# nodes/siril/example.py（未来节点的概念示例，勿作为现有可运行节点）

class SirilExampleNode:

&#x20;   @classmethod

&#x20;   def INPUT_TYPES(cls):

&#x20;       return {"required": {"source": ("STRING", {"default": ""})}}



&#x20;   RETURN_TYPES = ("STRING",)

&#x20;   FUNCTION = "execute"

&#x20;   CATEGORY = "AstroPhoto/Siril"



&#x20;   def execute(self, source: str):

&#x20;       \# 未来调用已验证的 processing/software service，

&#x20;       \# 不在 Node 内构建 shell 命令、写数据库或检测安装目录。

&#x20;       raise NotImplementedError("Requires a verified Siril adapter")

这个示例不得注册为可用节点，直到 Service 和 Adapter 已真正实现；保留现有 vue-basic 的 ID、Widget、IMAGE 数据流不变。Node 级执行顺序由 ComfyUI 控制，无需再写一个 DAG/任务调度框架。

6\. FITS 科学数据：\`processing/\` 和 assets/metadata.py

用户资产以 FITS/RAW/TIFF 为主，不能把所有处理数据默默压缩为 PNG 或 [B,H,W,C] Tensor。下面是只提取 Header 的示例：

\# astrophoto/assets/metadata.py

from pathlib import Path





def inspect_fits(path: Path) -> dict:

&#x20;   from astropy.io import fits  # 功能需要时导入

&#x20;   with fits.open(path, mode="readonly", memmap=True) as hdul:

&#x20;       header = hdul[0].header

&#x20;       fields = ("IMAGETYP", "EXPTIME", "FILTER", "GAIN", "OFFSET")

&#x20;       return {field: header.get(field) for field in fields}

要区分缺失、未知、推断与用户确认的元数据；不要因为 Header 缺少某字段就填造值。\`memmap=True\` 适合处理大型 FITS，但注意访问 .data 后可能产生额外文件句柄。天文科学数据应明确设计专用输入输出契约，只有用户需要普通 IMAGE 时才进行显式、可测试的转换。

7\. Knowledge 与 Memory：模块归属，不提前开发空功能

目标模块	主要文件	数据归属	原则

knowledge/	ingestion.py, indexing.py, retrieval.py, service.py	knowledge.db	FTS5 起步；LangChain 负责文档管道，Embedding 可选，引用来源必须保留

memory/	events.py, consolidation.py, service.py, retrieval.py	memory.db	行为事件与长期记忆分离；用户可关闭、查看、纠正、删除；不要把 Agent 自动操作当成用户偏好

experiments/	service.py, metrics.py, models.py	本地运行记录/关联资产	记录 prompt_id、参数、输入、输出、指标；Subagent 在外部编排

canvas/	broker.py	ComfyUI 前端图状态	发送画布命令到真实前端并收到回执，不能假定 /prompt 修改画布





FTS5 官方示例（将来由 knowledge/indexing.py 使用，并保存真实 source IDs）：

CREATE VIRTUAL TABLE chunks_fts USING fts5(title, body, source_id UNINDEXED);

注意中文分词与精确的软件参数名称检索效果；先证明检索结果准确，再叠加 sqlite-vec/embedding。用户记忆可能涉及位置，应明示采集范围，不自动上传精确坐标。

8\. 测试与验证顺序

验证	目标	环境

api/status.py 纯函数	返回能力与状态一致、未实现能力始终为 false	开发 Python 3.11/3.12/3.13（视配置）

api/routes.py 注入的 RouteTableDef	路由只注册一次、方法正确	pytest + aiohttp

core/paths.py	ASTROPHOTO_HOME 隔离、导入不创建用户目录	tmp_path

storage/sqlite.py	事务成功提交、错误回滚、跨线程不共享 Session	pytest + SQLite temp file

software/runner.py	无效路径、超时、失败返回码、无 shell=True	pytest，调用受控测试程序

nodes/	vue-basic、注册映射、IMAGE 输出不回归	ComfyUI Test Double + 宿主集成

frontend/	Vue 组件/序列化；PrimeVue 独立初始化与宿主兼容	Vitest 4.0.18 + Browser 测试

mcp/	version、\`connection_status\`、stdio；工具接口不变	FastMCP 4.2.0 + httpx MockTransport

packaging/	Registry 含 astrophoto、nodes、js、locales；不含 mcp/ref	comfy-cli 1.26.0





开发命令必须以仓库实际配置为准。可能的现有验证入口：

uv run pytest tests/nodes tests/packaging

uv run --package astrophoto-mcp pytest mcp/tests

pnpm -C frontend build

pnpm -C frontend exec vitest run

关于 TypeScript： 目前项目没有独立锁定 typescript 和 vue-tsc，不能声称已启用独立类型检查。建议先确认宿主类型包（1.22.1）与宿主前端（1.59.1）的兼容性，再显式添加 TypeScript/vue-tsc 和 CI 检查；确保 Vite build 不被误认为完整类型检查。



关于宿主依赖： 开发 .venv Python 3.13.15 的通过结果不能替代 ComfyUI Python 3.12.4 的验证。新增 SQLAlchemy/Astropy 等依赖前，必须测试它们与宿主 torch 2.3.0 / NumPy 1.26.4 / Pillow 10.3.0 的解析和导入兼容。

9\. Registry / PyPI 发布边界

\- Comfy Registry 包含根 \_\_init\_\_.py、\`nodes/\`、\`astrophoto/\`、\`js/\`、\`locales/\`，通过 .comfyignore 排除 mcp/、\`reference/\`、测试、临时数据、\`.agent/\`。

\- MCP PyPI Wheel 只包含 astrophoto_mcp 包、真实 Tools/Skills 及必要元数据，不能把 Extension 源码、数据库或运行时数据混入 MCP。

\- 必须解决当前 requirements.txt 的本地 ./mcp 引用： mcp/ 在 Registry 包中被排除，发行包安装时不能继续引用它。开发期用 uv Workspace Sources；发行元数据使用同版本的 astrophoto-mcp==X.Y.Z，通过构建后安装测试验证。

\- 同仓库 Lockstep SemVer，一个 Git Tag，先发布 PyPI 再发布 Registry。发布流程检查源码与归档内容分离。

\- uv Workspace 共享一个 lock，要求项目成员的 Python 约束存在交集。默认 ComfyUI 宿主不必也使用开发环境的 3.13。

10\. 推荐的标准化验收标准

完成当前仓库结构标准化的最低条件：

1\. Extension 仍可在 ComfyUI 0.45.0 / Python 3.12.4 加载，保留 vue-basic 与其数据流。

2\. /astrophoto/v1/status 在实际宿主返回可验证状态，且未实现能力仍标记 unavailable。

3\. astrophoto/ 中仅包含当前真实需要的 Core、Status API 和少量引导代码，其他业务域以文档规划，不创建空实现。

4\. 所有新增处理逻辑明确位于 astrophoto/，Node、UI、MCP 仅保留各自适配职责。

5\. 数据不写入源码目录；导入模块不执行重负载业务；同步 IO 不阻塞 aiohttp 事件循环。

6\. 确认 .venv、宿主、CI 环境差异；前端不依赖 ComfyUI 提供 PrimeVue。

7\. 单元测试与真实宿主验证分别报告，不把未验证工作标记为完成。

官方参考资料

\- ComfyUI 自定义节点：https\://docs.comfy.org/custom-nodes/walkthrough

\- ComfyUI HTTP/WS、自定义 aiohttp 路由：https\://docs.comfy.org/development/comfyui-server/comms_routes

\- Comfy Registry 打包与 .comfyignore：https\://docs.comfy.org/registry/publishing

\- ComfyUI Frontend Extension 开发：https\://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/core.md

\- PrimeVue 移除迁移：https\://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/primevue-removal-migration.md

\- SQLAlchemy 2.0 ORM Quick Start：https\://docs.sqlalchemy.org/en/20/orm/quickstart.html

\- SQLAlchemy Session Basics：https\://docs.sqlalchemy.org/en/20/orm/session_basics.html

\- Pydantic 模型和验证：https\://docs.pydantic.dev/latest/concepts/models/

\- Python asyncio.to_thread：https\://docs.python.org/3.12/library/asyncio-task.html

\- Python subprocess：https\://docs.python.org/3.12/library/subprocess.html

\- Astropy FITS I/O：https\://docs.astropy.org/en/stable/io/fits/

\- SQLite FTS5：https\://www\.sqlite.org/fts5.html

\- uv Workspace：https\://docs.astral.sh/uv/concepts/projects/workspaces/