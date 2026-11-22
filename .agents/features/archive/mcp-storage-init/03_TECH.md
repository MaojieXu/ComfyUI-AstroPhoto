# ComfyUI 启动时初始化 AstroPhoto 数据目录

TECH v0.9 · 根内协调变更及结项口径 · 2026-11-22 · 对应 [PRD v0.13](01_PRD.md) · UXUI 不适用

## 当前变更：根内协调

用户决定取消 `~/.astrophoto-control/`，将根管理记录放入 `.astrophoto/config/`，不做旧外部记录迁移。默认根及 `ASTROPHOTO_HOME` 指定根均采用配置根内协调。下文 v0.8 的外部协调及启动顺序为历史；与本节冲突时以本节为准，具体实现由 DEV 核实。

- 初始配置根 `config/` 下的记录与锁作为协调锚点，启动、预检及已有命令入口共用；定位实际根须核对实例身份，不得因重试覆盖数据。
- 根内锁不依赖 `runtime/`，后者缺失仍可补齐。空根首次初始化须区分未知已有内容和可安全新建的根；识别到已初始化实例配置缺失应报告并保留现场。
- 不读取或迁移旧 `.astrophoto-control/`。根内记录缺失的历史数据不得无依据认领或覆盖。用户确认目前机器上的实例和数据属于测试。
- 本次不新增搬迁功能。已有入口及提交/恢复协议如需调整，限制为根内协调所需的接线；根转移后锚点不可访问时不得猜测哪份副本可写。
- R-03 记录目标创建竞态的路径与错误；R-02 补充后端用例并由 TEST_REPORT 正式执行；R-04 沿用系统默认权限；R-05 新文档整理安排在 CLOSE；R-06 不引入旧布局迁移；R-07 保持现有缓存清理行为。

根内协调已按 [DEV LOG-004](04_DEV_LOG.md#log-004--2026-11-22--review-002-r-01r-02) 交付。此变更超出 REVIEW-002 原覆盖范围。按 PRD D-14，本次结项只以 V3 替身核对 `on_load()` 的首建结构和配置 ID，其他额外验证移出验收。执行证据及工作树标识见[测试报告](06_TEST_REPORT.md)。

## v0.8 历史方案

## 目标与生命周期

安装仅交付扩展文件和依赖。首次启动 ComfyUI 并加载 AstroPhoto 时，扩展在 V3 `on_load()` 中自动完成数据目录首建。默认根是运行 ComfyUI 的操作系统用户的 `~/.astrophoto/`。沿用宿主现有根解析，隔离环境可指定 `ASTROPHOTO_HOME`。验收对象为 `config/`、`database/`、`storage/`、`runtime/` 和 `config/` 中两份可由现有逻辑读取的 JSON。目录可以包含宿主正常启动所需的文件和子目录。

同一数据根的后续启动会补齐缺失的 `database/`、`storage/` 和 `runtime/`，保留已有路径和有效配置。扩展加载是唯一触发点。单纯导入模块、挂载界面或执行节点不初始化目录。

## 当前实现与差异

| 位置 | 当前源码行为 |
| --- | --- |
| [扩展入口](../../../../__init__.py) · `AstroPhotoExtension.on_load()` | 通过 `asyncio.to_thread()` 调用 `host_runtime()`。同一宿主已有一个绑定到路由的运行时时，复用该运行时。 |
| [宿主装配](../../../../astrophoto/bootstrap.py) · `host_runtime()`、`initialize_storage_runtime()` | 装配宿主配置，经 `DataRoots.open()` 打开实际根并创建 `StorageRuntime`。装配失败记录启动异常并将 `runtime.storage` 设为 `None`。 |
| [根协调](../../../../astrophoto/storage/data_root.py) · `DataRoots.open()` | 启动时解析实际根、读取清单、取得实例锁及宿主锁。宿主锁地址位于 `runtime/locks/host.lock`，其父目录可随启动创建。 |
| [存储首建](../../../../astrophoto/storage/runtime.py) · `StorageRuntime._initialize()` | 在现有首建流程读取或创建配置。仅清单处于未初始化状态时调用 `ensure_data_root()` 批量确保目录。首次存储首建完成后，将清单的 `initialized` 写为 `true`。 |
| [首建辅助函数](../../../../astrophoto/storage/initializer.py) · `ensure_data_root()`、`load_or_create_manifest()`、`load_or_create_settings()` | 已有四目录和两份 JSON 的首建逻辑。已初始化清单对应的设置文件缺失时会报错。 |
| [数据库打开](../../../../astrophoto/database/manager.py) · `DatabaseManager.initialize()` | 已初始化实例缺少 `database/assets.db` 时报告恢复错误，因此数据库服务可能未装配。 |

由源码可知，新实例的宿主自动首建已经有实现。已初始化实例缺项时，当前代码没有统一补齐三个顶层目录的步骤。`runtime/` 可以随启动锁路径创建，缺失的 `database/` 或 `storage/` 缺少等价的启动补齐入口。已存在的旧版按需初始化入口仍是当前代码事实。此次草案以宿主加载流程作为产品入口。

ComfyUI 的 V3 加载器在取得扩展对象后等待 `extension.on_load()` 再取得节点列表。方案沿用仓库已有的原生钩子及线程调用方式，宿主验证基线为 ComfyUI Backend 0.46.0 和 Python 3.12。文件补齐采用 `Path.mkdir()`，`parents=False` 限定一次创建一层，`exist_ok=False` 使并发创建时可以捕获冲突并重新核对对象类型。见 [ComfyUI V3 加载源码（主分支）](https://github.com/Comfy-Org/ComfyUI/blob/master/nodes.py)、[Python Path.mkdir](https://docs.python.org/3.12/library/pathlib.html#pathlib.Path.mkdir)、[开发与验证](../../../../docs/development.md)。

## 启动实施方案

1. **首次加载空的实际数据根。** 在既有启动协调下沿用 `ensure_data_root()`、`load_or_create_manifest()` 和 `load_or_create_settings()`。校验目标路径种类后创建目录，沿用现有原子写入与首建完成标记。宿主正常首建可继续生成运行所需的内部文件。
2. **加载已初始化实例。** `DataRoots.open()` 先解析实际根，用既有只读装载函数校验清单，并按现有顺序取得实例锁。持锁后检查设置的可读性及格式。当前入口在已有注册记录但清单缺失时提前失败。实施时在该分支指出 `config/manifest.json` 的缺项，整个 `config/` 缺失时同时指出两份 JSON。配置无效时也记录具体路径，原文件及其他配置保留。
3. **补齐已有实例的顶层目录。** 在取得实例锁之后、尝试打开 `runtime/` 内的宿主锁和调用业务存储工厂之前，由拟新增的 `ensure_top_level_directories(root)` 检查三个固定路径，完成全部缺项的单层 `mkdir()`。实例锁不依赖 `runtime/` 内的文件，可以在整个 `runtime/` 缺失时保护此步骤。这个步骤只检查目标路径，可直接重建单个或多个缺失目录。已存在的路径如不是安全的本地目录，报告路径冲突并保留现场。调用不覆盖文件、创建占位数据库或复原业务数据。
4. **核对后继续宿主装配。** 复查四个目录存在且类型正确，并确认两个配置文件有效。接着运行既有宿主装配，允许它按现有生命周期写入其正常运行文件。目录与 JSON 齐全即满足初始化结构验收。业务文件重建、数据恢复及业务服务就绪均超出本次验收范围。宿主仍按现有方式报告业务存储未就绪等启动错误。

| 位置 | 后续获准开发时的改动 |
| --- | --- |
| [首建辅助函数](../../../../astrophoto/storage/initializer.py) · `ensure_top_level_directories(root)`（Proposed） | 只接收宿主已确定的绝对根，复用 `checked_path()`，先核对全部固定目标的类型，再创建缺项。返回成功或抛出带目标路径的异常。 |
| [启动协调](../../../../astrophoto/storage/data_root.py) · `DataRoots.open()` | 在已初始化分支接入单次目录补齐，放在依赖 `runtime/` 及业务数据的启动步骤之前。复用既有实例锁的持有和异常释放逻辑。对已登记实例直接报告配置缺项。 |
| [宿主装配](../../../../astrophoto/bootstrap.py) · `initialize_storage_runtime()` | 复用现有路由前的装配错误和日志记录。目录类型冲突、配置缺失或写入受阻要能从启动日志定位到具体路径。 |

### 配置 JSON 与现有读写

首版配置以身份 ID 为主，字段和默认值复用现有首建写入器、读取器和设置保存逻辑。首次写入沿用现有原子写入，宿主再次启动时保留已有有效 JSON。见 [PRD v0.11](01_PRD.md#配置文件)。

- `config/manifest.json` 的 `instance_id` 和 `initial_workspace_id` 由宿主首建时生成规范 UUID。`initialized` 在首建开始时为 `false`，完成后为 `true`。现有写入器写入 `format_version: 1`，读取器校验该字段、两个 ID 和首建状态。见 [首建辅助函数](../../../../astrophoto/storage/initializer.py)。
- `config/settings.json` 的 `workspace.default_workspace_id` 首建时取清单的 `initial_workspace_id`。`workspace.write_policy` 默认为 `default`，`imports.default_mode` 默认为 `reference`，`cache.path` 为实际根下 `runtime/cache` 的绝对路径，`cache.max_size_gb` 默认为 `20`。现有读写依赖 `schema_version: 1` 和初始为 `0` 的 `revision`。`revision` 用于拒绝过期写入，设置保存时按现有逻辑递增。见 [首建辅助函数](../../../../astrophoto/storage/initializer.py)、[设置读写](../../../../astrophoto/core/config.py)。

### 失败与重试

目标路径为普通文件、不支持的链接或其他非目录对象时，扩展记录具体路径，保留已有对象。创建受权限、只读文件系统或磁盘空间所阻时，报告实际失败原因。若某个缺项已创建而后续步骤失败，保留本次已创建的目录，下一次启动从实际磁盘状态继续。遇到并发创建时，复查已经出现的路径，只有它仍是预期目录才继续。整个复核仍受宿主现有启动协调保护。

## 验收交接

| 需求与验收 | 场景与覆盖点 |
| --- | --- |
| FR-01、FR-02 / AC-01 | 安装扩展后先检查目标结构尚未创建，再在没有 MCP 客户端或服务的隔离环境启动 ComfyUI。核对四个目录，用现有的 `load_manifest()` 和 `load_storage_settings()` 读取两个 JSON，核对首建的 `instance_id` 与 `initial_workspace_id` 均为有效的规范 UUID，且 `workspace.default_workspace_id` 等于 `initial_workspace_id`。 |
| FR-03 / AC-02、AC-06 | 完整布局或仅缺少目录内业务文件时，用同一根重启。目标结构齐全，已有有效 JSON 内容和现存文件保留。业务服务可报告自身的未就绪状态。 |
| FR-02 / AC-03、AC-05 | 停止宿主后分别移除单项、两项或三项可补建目录。单次启动补齐全部缺项，保留现存 JSON 和文件。复查目录和有效 JSON 即可判定初始化结构是否满足验收。 |
| FR-04 / AC-04、AC-07 | 覆盖路径冲突、写入失败、JSON 损坏、两份 JSON 分别缺失及整个 `config/` 缺失。由启动日志定位具体原因，保留已有配置与文件。恢复有效配置或排除写入障碍后重试。 |

后续可复用 [存储首建测试入口](../../../../tests/backend/test_storage_init.py) 和 [宿主加载测试入口](../../../../tests/integration/test_status_api.py)。后续获准时按上述口径更新 TEST_PLAN，开发时先实施启动补齐与必要局部验证。候选构件的安装和真实宿主启动验收按 Feature 审查门禁后的 TEST_REPORT 执行。本轮只有文档修订和源码静态核对，尚无新设计的运行或测试证据。

## 已确认的技术决定

- 已确认在宿主初始化中，于取得实例锁后、业务存储装配前补齐三个顶层目录。后续业务存储装配沿用现有流程，并报告实际状态。
