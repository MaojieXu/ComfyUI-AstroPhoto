# ComfyUI_AstroPhoto Extension Backend 标准化指导教程（V3 Node API 修订）

> 适用基线：ComfyUI_AstroPhoto `0.0.1`；节点 API 按用户确认的 V3 现状修订；以下代码是**教学用最小实现/未来模块范例**，没有对本地仓库运行或修改。目标是在保留现有 `vue-basic` 画板、`CUSTOM_VUE_COMPONENT_BASIC`、序列化与 PNG 上传→LoadImage→IMAGE 数据流的前提下，建立 AstroPhoto 后端的稳定边界。

## 0. 使用当前环境，而不是假设一套全新环境

| 组件 | 已知实际版本 | 操作含义 |
|---|---|---|
| ComfyUI Backend | 0.45.0 | 在此宿主上做最终导入、路由和节点验证 |
| ComfyUI Frontend | 1.59.1 | 不能依赖宿主自动注入 PrimeVue |
| ComfyUI Python | 3.12.4 | Extension 必须在此环境安装并运行实际所需依赖 |
| 独立开发 `.venv` | 3.13.15 | 只能代表开发环境测试，不能代替宿主验证 |
| FastMCP | 4.2.0 | 保留已经开展的 MCP 重构；不把业务服务迁入 MCP |
| HTTPX | 0.28.1 | MCP 使用它调用 ComfyUI/Extension HTTP API |
| Vue/Vite/PrimeVue | 3.5.13 / 6.3.5 / 4.3.3 | 维持现有画板与构建流程，不修改节点 ID |
| Python CI | 3.11 / 3.12 | 单元测试可并行；宿主集成验证单独执行 |
| PyTorch/NumPy/Pillow（宿主） | 2.3.0 / 1.26.4 / 10.3.0 | 不因 AstroPhoto 新增业务模块强制升级宿主核心包 |

> SQLAlchemy、Alembic、Astropy、LangChain 的**安装版本未在本次环境清单中确认**。以下示例说明目标接口，不能把它们视为当前已安装并可执行。

## 1. 目录标准与依赖方向

依据：ComfyUI V3 Node API 通过 `comfy_entrypoint()` 返回 `ComfyExtension`，其 `get_node_list()` 注册 `io.ComfyNode` 节点，`WEB_DIRECTORY` 仍用于暴露前端静态资源；Python 后端参考模块化单体、Service Layer 与 Adapter 边界。官方依据：<https://docs.comfy.org/custom-nodes/v3_migration>，<https://github.com/Comfy-Org/ComfyUI/blob/master/custom_nodes/example_node.py.example>。

> **节点版本约束：** 以当前已安装宿主 ComfyUI 0.45.0 实际支持的 V3 API 为准。`comfy_api.latest` 仍可能在后续版本调整；升级宿主时重新验证 Schema 与注册行为。不要将本项目恢复为 V1。

```text
ComfyUI_AstroPhoto/
├── __init__.py                     # 插件载入；仅注册 Node、Web 与轻量路由
├── nodes/                          # ComfyUI Node Schema / 执行入口
├── frontend/                       # Vue 组件、Settings、Sidebar、Canvas Bridge
├── js/                             # 编译后的 JS/CSS；不是 Python 业务代码
├── locales/                        # 宿主本地化资源
├── astrophoto/                     # Extension 业务后端（以下为目标结构）
│   ├── __init__.py
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
```

**依赖方向：** `nodes/` 和 `astrophoto/api/` 调用 `astrophoto/<domain>/service.py`；Service 再使用 Repository 或 Adapter；`mcp/` 只访问公开 HTTP API；ComfyUI 自身负责工作流图、队列、执行和 Undo。不要使业务 Service 反向 import `nodes/`、`frontend/` 或 `mcp/`。

### Python Import 约束

ComfyUI 以插件包导入根 `__init__.py`。在 Extension 内优先使用**包相对导入**，例如 `from .nodes import ...` 和 `from ..astrophoto.software.service import ...`，不要通过插入 `sys.path` 来制造另一个顶层 `astrophoto` 包。单元测试需要准备模拟的 ComfyUI 宿主或通过可注入函数测试纯业务逻辑；简单地导入 `ComfyUI_AstroPhoto.astrophoto` 也会先执行根 `__init__.py`。

## 1.1 V3 节点 API 与测试约束（对当前 v0.0.1 现状的修订）

- 根 `__init__.py`：保留实际已实现的 `comfy_entrypoint()`，返回 `ComfyExtension`；`get_node_list()` 暴露节点类，`WEB_DIRECTORY = "./js"` 不变。
- `nodes/`：节点继承 `io.ComfyNode`，使用 `define_schema()` 返回 `io.Schema`（`node_id`、category、typed inputs/outputs）；`execute()` 是类方法并返回 `io.NodeOutput`。
- V3 的 `fingerprint_inputs()` 对应旧式缓存控制。读取外部 FITS/资产路径的节点必须考虑文件内容变化，不能仅比较字符串路径。
- 保留真实 Node ID `vue-basic`、Widget ID `CUSTOM_VUE_COMPONENT_BASIC`、序列化及 `/upload/image` 行为。**不得由于重构而更改存量工作流 JSON 中的节点类型。**
- Extension API 的 aiohttp 路由可以由根入口轻量注册；它与 V3 Node Schema 是两个独立扩展面，不要求将业务服务放进节点类。
- 单元测试至少校验 `define_schema().node_id`、输入输出类型、`get_node_list()` 包含当前节点、`execute()` 的 `NodeOutput` 行为；真实 ComfyUI 宿主须做节点加载与前端 Widget 回归。
- 官方 V3 API 仍在演进：在发布 CI 中对实际宿主版本执行回归，不可仅依据静态类型文件作兼容性结论。

## 2. 运行路径：`astrophoto/core/paths.py`

不要把 `.db`、模型、日志或工作文件放在 Git 仓库中。Windows/Linux/macOS 使用 `pathlib`，并提供明确的本地数据目录覆盖入口。

```python
# astrophoto/core/paths.py
import os
from pathlib import Path
from typing import Literal

DatabaseName = Literal["assets", "knowledge", "memory"]


def data_home() -> Path:
    custom = os.environ.get("ASTROPHOTO_HOME")
    root = Path(custom).expanduser() if custom else Path.home() / ".astrophoto"
    return root.resolve()


def database_path(name: DatabaseName) -> Path:
    return data_home() / "databases" / f"{name}.db"


def ensure_database_dir() -> Path:
    folder = data_home() / "databases"
    folder.mkdir(parents=True, exist_ok=True)
    return folder
```

**要点：** 导入这个模块不会创建目录。真实初始化、存储升级、导入资产或写入文件时才创建；测试可以通过临时设置 `ASTROPHOTO_HOME` 做隔离。不要自动扫描整个硬盘上的天文文件。

ComfyUI 模型文件则保留在宿主管理的 model paths；独立注册额外模型类别：

```python
# astrophoto/core/model_paths.py（需要该功能时再创建）
from pathlib import Path

def register_model_paths() -> None:
    import folder_paths  # 仅在 ComfyUI 宿主中调用
    root = Path(folder_paths.models_dir)
    folder_paths.add_model_folder_path("astrophoto_embedding", str(root / "astrophoto_embedding"))
    folder_paths.add_model_folder_path("astrophoto_reranker", str(root / "astrophoto_reranker"))
```

注意：`folder_paths` 负责模型路径发现，不负责保证 Hugging Face 多文件模型完整性、下载许可或加载推理；这些以后属于 `knowledge/`。

## 3. 最先落地的功能：Extension Status API

### 3.1 纯状态处理器

```python
# astrophoto/api/status.py
from aiohttp import web


def status_payload() -> dict:
    return {
        "service": "astrophoto",
        "api_version": "v1",
        "status": "ok",
        "capabilities": {
            "assets": False,
            "software": False,
            "canvas_bridge": False,
            "knowledge": False,
            "memory": False,
            "experiments": False,
        },
    }


async def status_handler(_request: web.Request) -> web.Response:
    return web.json_response(status_payload())
```

目前返回 `False` 是对尚未实现能力的真实表述；不能因未来目录存在就报告为 `True`。等实现后从实际 Service/Adapter 检测结果生成能力状态。

### 3.2 与 ComfyUI 原生 aiohttp 集成

```python
# astrophoto/api/routes.py
from .status import status_handler


def register_routes(routes=None) -> None:
    # 可注入 routes，方便不启动 ComfyUI 的测试。
    if routes is None:
        from server import PromptServer
        routes = PromptServer.instance.routes

    routes.get("/astrophoto/v1/status")(status_handler)
```

官方自定义 HTTP 路由使用 `PromptServer.instance.routes`，不需要 FastAPI/Uvicorn。路由注册必须只执行一次，避免开发热重载或重复导入造成冲突；只在服务可用后调用。

### 3.3 根入口只做轻量注册

```python
# ComfyUI_AstroPhoto/__init__.py（V3 结构示意；与真实代码合并）
from comfy_api.latest import ComfyExtension, io

from .nodes import get_node_classes  # 示例：按仓库实际出口实现/保留现有注册
from .astrophoto.api.routes import register_routes

WEB_DIRECTORY = "./js"

# 只注册轻量 aiohttp 路由；不得在这里加载模型或扫描资产。
register_routes()


class AstroPhotoExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return get_node_classes()


async def comfy_entrypoint() -> ComfyExtension:
    return AstroPhotoExtension()


__all__ = ["comfy_entrypoint", "WEB_DIRECTORY"]
```

`get_node_classes()` 是示意性的节点目录聚合接口，并非当前项目已经存在的函数。实际修改时应复用你仓库现有的 V3 `get_node_list()` / `comfy_entrypoint()`，不要重复注册，必须保持节点 ID `vue-basic` 与自定义 Widget ID `CUSTOM_VUE_COMPONENT_BASIC` 不变。

V3 官方要求 `get_node_list()` 为异步方法；`comfy_entrypoint()` 可同步或异步。**不要再导出 V1 的 `NODE_CLASS_MAPPINGS` 作为主注册方式。**

这个入口需要在 ComfyUI 0.45.0 中实际加载验证。不要在它里面创建 DB、执行迁移、启动 RAG、检查所有 Siril/PixInsight 软件位置或触发下载。若当前测试通过模拟 `server` 导入，需要同步更新 fixture，避免重复路由注册。

### 3.4 前端调用接口

ComfyUI 推荐使用已有 `api.fetchApi()`，以保留宿主的前缀、认证及路由行为。不要在源码里拼 `http://127.0.0.1:8188`：

```typescript
// frontend/src/api/status.ts — 由现有 ComfyUI API 实例注入
interface ComfyApi {
  fetchApi(path: string, init?: RequestInit): Promise<Response>
}

export async function getAstroPhotoStatus(api: ComfyApi) {
  const response = await api.fetchApi("/astrophoto/v1/status")
  if (!response.ok) throw new Error(`AstroPhoto status: ${response.status}`)
  return await response.json()
}
```

Vue UI 所用的 `api` 实例应沿用当前已验证的前端宿主集成方式。不要猜测 Vite 源文件中的 `../../scripts/api.js` 相对路径；检查打包后的 import 与生产加载 URL。

**前端 1.59.1 特别注意：** ComfyUI 宿主已移除 PrimeVue 插件和主题。你仍可以继续使用自身依赖的 PrimeVue 4.3.3，但必须在自建 Vue App/插件注入中配置 PrimeVue 和 CSS 主题，或优先使用宿主前端扩展 UI API。不能依赖 `$primevue` 或旧的 `--p-*` CSS 变量。

## 4. 业务数据库模式：`astrophoto/storage/` + 领域服务

这里以 `assets.db` 中一个设备表演示 SQLAlchemy 2.x 的官方 `DeclarativeBase`、`Mapped` 与 `Session` 使用。**此节是未来资产模块教学示例，不是当前 v0.0.1 已实现的功能。**

### 4.1 ORM 模型归领域，不放入全局 `models.py`

```python
# astrophoto/assets/models.py
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class AssetBase(DeclarativeBase):
    pass

class Equipment(AssetBase):
    __tablename__ = "equipment"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
```

### 4.2 共享 SQLite 连接工厂

```python
# astrophoto/storage/sqlite.py
from pathlib import Path
from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker


def make_session_factory(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    url = URL.create("sqlite+pysqlite", database=str(path))
    engine = create_engine(url, connect_args={"timeout": 20})
    return engine, sessionmaker(engine, expire_on_commit=False)
```

数据库文件是用户数据，不能被发布包携带；Engine 可以按 DB 文件复用，但 **Session 不可跨线程/asyncio task 共享**。

### 4.3 Service 管事务，Repository 管查询（有必要时才拆）

```python
# astrophoto/assets/service.py
from .models import Equipment

def create_equipment(session_factory, name: str) -> dict:
    with session_factory.begin() as session:
        item = Equipment(name=name)
        session.add(item)
        session.flush()  # 获取自增主键；上下文成功退出才提交
        return {"id": item.id, "name": item.name}
```

`session_factory.begin()` 在异常时自动回滚。对于简单 CRUD，Service 直接操作 ORM 就够用；复杂查询增多时再建立 `assets/repository.py`。**正式发布时使用 Alembic 管迁移**；`AssetBase.metadata.create_all(engine)` 只适合作为测试/初始原型初始化方案，不是可维护的升级机制。

### 4.4 aiohttp 不应阻塞事件循环

```python
# 一个 API handler 内调用同步 SQLAlchemy Service 的示意
import asyncio
from aiohttp import web
from pydantic import BaseModel, ConfigDict, Field, ValidationError

class EquipmentCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str = Field(min_length=1, max_length=120)

async def handle_create_equipment(request: web.Request, session_factory) -> web.Response:
    try:
        body = EquipmentCreate.model_validate(await request.json())
    except (ValueError, ValidationError):
        raise web.HTTPBadRequest(text="Invalid equipment payload")

    # 工厂可跨线程传递，Session 必须在工作线程内创建和销毁。
    result = await asyncio.to_thread(create_equipment, session_factory, body.name)
    return web.json_response(result, status=201)
```

该 handler 是可注入示例，未注册为现有路由。等开发资产模块时，由 `api/assets.py` 绑定真实 Service，避免编造数据库 API；生产环境还需记录安全日志、拒绝越权访问、处理唯一性冲突。

## 5. 外部软件：`software/registry.py`、`runner.py` 与 Adapter

**三个层次的区别：**
- `registry.py`：保存/验证软件位置、版本和能力；UI/Agent 提交的候选路径只能经验证后生效。
- `runner.py`：统一进程超时、退出码、工作目录、日志和取消。
- `adapters/siril.py`、`adapters/pixinsight.py`：只将**受支持的结构化操作**转换为对应软件的命令和脚本；不能向 Agent 暴露自由 Shell 命令。

```python
# astrophoto/software/runner.py：同步 Node 执行可直接调用
from pathlib import Path
from subprocess import CompletedProcess, run
from collections.abc import Sequence


def run_program(
    executable: Path,
    argv: Sequence[str],
    working_dir: Path,
    timeout_seconds: int = 600,
) -> CompletedProcess[str]:
    if not executable.is_file():
        raise FileNotFoundError(f"Executable not found: {executable}")
    if not working_dir.is_dir():
        raise NotADirectoryError(working_dir)
    return run(
        [str(executable), *argv],
        cwd=working_dir,
        capture_output=True,
        text=True,
        errors="replace",
        timeout=timeout_seconds,
        check=True,
        shell=False,
    )
```

重要：`argv` 应由 Adapter 从参数 Schema 构造，不允许 MCP 用户直接提供任意命令或脚本内容；工作目录应使用 `~/.astrophoto/runs/<run_id>/`，输出与原始文件隔离。实际 Siril/PixInsight 选项、退出行为必须针对已安装版本和官方软件文档核验。长运行任务还需考虑日志大小上限、取消与子进程树清理（Windows 特别测试）。

ComfyUI 的 Node 本身只做 Schema、输入转换和 Service 调用：

```python
# nodes/example_v3.py：V3 API 形状教学示例（不注册到正式项目）
from comfy_api.latest import io


class ImagePassThrough(io.ComfyNode):
    @classmethod
    def define_schema(cls) -> io.Schema:
        return io.Schema(
            node_id="AstroPhoto_ImagePassThrough_Example",
            display_name="Image Pass Through (Example)",
            category="AstroPhoto/Examples",
            inputs=[io.Image.Input("image")],
            outputs=[io.Image.Output()],
        )

    @classmethod
    def execute(cls, image) -> io.NodeOutput:
        # 真实 Siril Node 应调用 astrophoto/software/service.py；
        # 不应在 Node 内管理外部进程、数据库或软件路径。
        return io.NodeOutput(image)
```

这是官方 V3 `io.ComfyNode → define_schema → execute → io.NodeOutput` 形状的最小教学实例。真正的 Siril 节点应定义其受支持的科学输入/输出 Schema 并委托 `astrophoto/software/service.py`，不应把未实现的操作注册成可用节点。

**这个示例不得注册为可用节点**，直到 Service 和 Adapter 已真正实现；保留现有 `vue-basic` 的 ID、Widget、IMAGE 数据流不变。Node 级执行顺序由 ComfyUI 控制，无需再写一个 DAG/任务调度框架。

## 6. FITS 科学数据：`processing/` 和 `assets/metadata.py`

用户资产以 FITS/RAW/TIFF 为主，不能把所有处理数据默默压缩为 PNG 或 `[B,H,W,C]` Tensor。下面是只提取 Header 的示例：

```python
# astrophoto/assets/metadata.py
from pathlib import Path


def inspect_fits(path: Path) -> dict:
    from astropy.io import fits  # 功能需要时导入
    with fits.open(path, mode="readonly", memmap=True) as hdul:
        header = hdul[0].header
        fields = ("IMAGETYP", "EXPTIME", "FILTER", "GAIN", "OFFSET")
        return {field: header.get(field) for field in fields}
```

要区分缺失、未知、推断与用户确认的元数据；不要因为 Header 缺少某字段就填造值。`memmap=True` 适合处理大型 FITS，但注意访问 `.data` 后可能产生额外文件句柄。天文科学数据应明确设计专用输入输出契约，只有用户需要普通 IMAGE 时才进行显式、可测试的转换。

## 7. Knowledge 与 Memory：模块归属，不提前开发空功能

| 目标模块 | 主要文件 | 数据归属 | 原则 |
|---|---|---|---|
| `knowledge/` | `ingestion.py`, `indexing.py`, `retrieval.py`, `service.py` | `knowledge.db` | FTS5 起步；LangChain 负责文档管道，Embedding 可选，引用来源必须保留 |
| `memory/` | `events.py`, `consolidation.py`, `service.py`, `retrieval.py` | `memory.db` | 行为事件与长期记忆分离；用户可关闭、查看、纠正、删除；不要把 Agent 自动操作当成用户偏好 |
| `experiments/` | `service.py`, `metrics.py`, `models.py` | 本地运行记录/关联资产 | 记录 prompt_id、参数、输入、输出、指标；Subagent 在外部编排 |
| `canvas/` | `broker.py` | ComfyUI 前端图状态 | 发送画布命令到真实前端并收到回执，不能假定 `/prompt` 修改画布 |

FTS5 官方示例（将来由 `knowledge/indexing.py` 使用，并保存真实 source IDs）：

```sql
CREATE VIRTUAL TABLE chunks_fts USING fts5(title, body, source_id UNINDEXED);
```

注意中文分词与精确的软件参数名称检索效果；先证明检索结果准确，再叠加 sqlite-vec/embedding。用户记忆可能涉及位置，应明示采集范围，不自动上传精确坐标。

## 8. 测试与验证顺序

| 验证 | 目标 | 环境 |
|---|---|---|
| `api/status.py` 纯函数 | 返回能力与状态一致、未实现能力始终为 false | 开发 Python 3.11/3.12/3.13（视配置） |
| `api/routes.py` 注入的 RouteTableDef | 路由只注册一次、方法正确 | `pytest` + aiohttp |
| `core/paths.py` | `ASTROPHOTO_HOME` 隔离、导入不创建用户目录 | `tmp_path` |
| `storage/sqlite.py` | 事务成功提交、错误回滚、跨线程不共享 Session | pytest + SQLite temp file |
| `software/runner.py` | 无效路径、超时、失败返回码、无 `shell=True` | pytest，调用受控测试程序 |
| `nodes/` | V3 `comfy_entrypoint/get_node_list/define_schema`、`vue-basic` Node ID、IMAGE 输出不回归 | ComfyUI Test Double + 宿主集成 |
| `frontend/` | Vue 组件/序列化；PrimeVue 独立初始化与宿主兼容 | Vitest 4.0.18 + Browser 测试 |
| `mcp/` | `version`、`connection_status`、stdio；工具接口不变 | FastMCP 4.2.0 + httpx MockTransport |
| `packaging/` | Registry 含 astrophoto、nodes、js、locales；不含 mcp/ref | comfy-cli 1.26.0 |

开发命令必须以仓库实际配置为准。可能的现有验证入口：

```bash
uv run pytest tests/nodes tests/packaging
uv run --package astrophoto-mcp pytest mcp/tests
pnpm -C frontend build
pnpm -C frontend exec vitest run
```

**关于 TypeScript：** 目前项目没有独立锁定 `typescript` 和 `vue-tsc`，不能声称已启用独立类型检查。建议先确认宿主类型包（1.22.1）与宿主前端（1.59.1）的兼容性，再显式添加 TypeScript/vue-tsc 和 CI 检查；确保 Vite build 不被误认为完整类型检查。

**关于宿主依赖：** 开发 `.venv` Python 3.13.15 的通过结果不能替代 ComfyUI Python 3.12.4 的验证。新增 SQLAlchemy/Astropy 等依赖前，必须测试它们与宿主 torch 2.3.0 / NumPy 1.26.4 / Pillow 10.3.0 的解析和导入兼容。

## 9. Registry / PyPI 发布边界

- Comfy Registry 包含根 `__init__.py`、`nodes/`、`astrophoto/`、`js/`、`locales/`，通过 `.comfyignore` 排除 `mcp/`、`reference/`、测试、临时数据、`.agent/`。
- MCP PyPI Wheel 只包含 `astrophoto_mcp` 包、真实 Tools/Skills 及必要元数据，不能把 Extension 源码、数据库或运行时数据混入 MCP。
- **必须解决当前 `requirements.txt` 的本地 `./mcp` 引用：** `mcp/` 在 Registry 包中被排除，发行包安装时不能继续引用它。开发期用 uv Workspace Sources；发行元数据使用同版本的 `astrophoto-mcp==X.Y.Z`，通过构建后安装测试验证。
- 同仓库 Lockstep SemVer，一个 Git Tag，先发布 PyPI 再发布 Registry。发布流程检查源码与归档内容分离。
- uv Workspace 共享一个 lock，要求项目成员的 Python 约束存在交集。默认 ComfyUI 宿主不必也使用开发环境的 3.13。

## 10. 推荐的标准化验收标准

完成当前仓库结构标准化的最低条件：

1. Extension 使用 V3 `comfy_entrypoint` / `ComfyExtension.get_node_list()` 在 ComfyUI 0.45.0 / Python 3.12.4 加载，保持 `vue-basic`、Widget 和 PNG→IMAGE 数据流。
2. `/astrophoto/v1/status` 在实际宿主返回可验证状态，且未实现能力仍标记 unavailable。
3. `astrophoto/` 中仅包含当前真实需要的 Core、Status API 和少量引导代码，其他业务域以文档规划，不创建空实现。
4. 所有新增处理逻辑明确位于 `astrophoto/`，Node、UI、MCP 仅保留各自适配职责。
5. 数据不写入源码目录；导入模块不执行重负载业务；同步 IO 不阻塞 aiohttp 事件循环。
6. 确认 `.venv`、宿主、CI 环境差异；前端不依赖 ComfyUI 提供 PrimeVue。
7. 单元测试与真实宿主验证分别报告，不把未验证工作标记为完成。

## 官方参考资料

- ComfyUI V3 节点迁移和接口（本项目使用）：https://docs.comfy.org/custom-nodes/v3_migration
- ComfyUI V3 官方样例：https://github.com/Comfy-Org/ComfyUI/blob/master/custom_nodes/example_node.py.example
- ComfyUI 自定义节点概述：https://docs.comfy.org/custom-nodes/overview
- ComfyUI HTTP/WS、自定义 aiohttp 路由：https://docs.comfy.org/development/comfyui-server/comms_routes
- Comfy Registry 打包与 `.comfyignore`：https://docs.comfy.org/registry/publishing
- ComfyUI Frontend Extension 开发：https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/core.md
- PrimeVue 移除迁移：https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/docs/extensions/primevue-removal-migration.md
- SQLAlchemy 2.0 ORM Quick Start：https://docs.sqlalchemy.org/en/20/orm/quickstart.html
- SQLAlchemy Session Basics：https://docs.sqlalchemy.org/en/20/orm/session_basics.html
- Pydantic 模型和验证：https://docs.pydantic.dev/latest/concepts/models/
- Python `asyncio.to_thread`：https://docs.python.org/3.12/library/asyncio-task.html
- Python `subprocess`：https://docs.python.org/3.12/library/subprocess.html
- Astropy FITS I/O：https://docs.astropy.org/en/stable/io/fits/
- SQLite FTS5：https://www.sqlite.org/fts5.html
- uv Workspace：https://docs.astral.sh/uv/concepts/projects/workspaces/
