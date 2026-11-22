# Siril CLI 集成 · 开发规格与实现

**CH-03 实现基线** · 2026-11-21 · `HEAD f84442b` 加相关工作树改动。已核对当前源码和本机 ComfyUI。历史 `003c599` 和 `4c0cf4d` 的 AutoStretch 证据见文末与测试报告。 [阶段索引](00_FEATURE_INDEX.md) · [技术设计](03_TECH.md)

## CH-05 按图像处理操作重分目录

- 用户确认参考 PixInsight Process 分类。按配准、叠加、卷积与锐化、反卷积、降噪、多尺度处理等操作分组。色彩与通道下有色彩校准、色彩管理、色彩调整、通道管理。全部 183 个节点分布在 18 个一级目录、21 条末级路径，18 条非脚本命令也有同源分类。另设色彩调整收纳饱和度及抑制绿色偏色。 [完整目录与计数](../../../docs/siril.md#查找命令与节点) · [PixInsight 分类接口](https://gitlab.com/pixinsight/PCL/-/blob/7122c29/include/pcl/MetaProcess.h)
- `command_presentation.GROUPS` 维护相同结构的英文与中文目录路径；`SEQUENCE_VARIANTS` 从单图命令继承目录及补充搜索词。`Command.category` 生成 `AstroPhoto/Siril/<目录路径>`，共用 V3 Schema 与命令目录的 `category`，后者的 `category_zh` 为 Siril 下的中文路径。`Command.search_aliases` 同时提供 CLI 原名、中英文节点名及适用的常见术语给原生 Schema 和 Settings。每个节点有一个目录，旧工作流继续按同一节点 ID 加载和执行。 [文案](../../../extension/siril/command_presentation.py) · [注册表](../../../extension/siril/commands.py) · [V3 工厂](../../../extension/siril/node.py)
- `scripts.siril_locales` 按路径分段生成 `nodeCategories`。直接沿用 ComfyUI v0.46.0 的 `io.Schema.category` 与 `/object_info`，以及 Frontend v1.59.6 的节点库、原生菜单和分段翻译。AstroPhoto 侧栏复用现有节点树，`SirilCommands` 使用相同路径组织 Settings 的命令分组。 [生成器](../../../scripts/siril_locales.py) · [命令目录](../../../extension/siril/frontend/SirilCommands.tsx) · [宿主分类翻译](https://github.com/Comfy-Org/ComfyUI_frontend/blob/v1.59.6/src/scripts/app.ts)

## CH-04 节点展示、分类及双语

- `command_presentation.py` 为 1.4.5 命令表中的 201 条命令提供中英文标题和用途，`Command.category/title/description` 供原生 Schema 及命令目录共用。CH-04 初版的 11 个功能分组已由 CH-05 目录替代。节点标题直接显示操作名。 [命令文案](../../../extension/siril/command_presentation.py) · [注册表](../../../extension/siril/commands.py)
- `scripts.siril_locales` 从同一文案生成 183 个原生中文节点定义及分类翻译，保留通用绘图和科学节点的现有资源。宿主读取 `nodeDefs.json` 与 `nodeCategories`；AstroPhoto 侧栏对 `/object_info` 卡片使用同一资源，搜索支持中文、英文、命令和节点 ID。Settings 命令目录按功能分组，并由宿主语言选择名称、用途和前置条件。 [生成器](../../../scripts/siril_locales.py) · [侧栏翻译](../../../frontend/src/i18n/nodeDefinitions.ts)
- `SirilCommandDetails` 在已创建和重新加载的节点内显示用途，展开「命令用法」可查看原始 CLI 语法和本地化前置条件。通用节点使用不序列化的 DOM widget，FITS 节点复用比较预览挂载。只在旧工作流保留了自动生成的 `Siril · …` 标题时迁移该标题，保留其他自定义标题。原节点 ID、参数键、端口类型与执行流程沿用 CH-03。 [介绍组件](../../../extension/siril/frontend/SirilCommandDetails.tsx) · [挂载与兼容](../../../extension/siril/frontend/SirilNodes.tsx)

## 宿主装配、命令注册与前端

- `comfy_entrypoint` 选择 `SirilBundle`；`on_load` 复用或初始化宿主运行时、注册原生路由并绑定节点运行时。`SirilBundle.initialize_storage` 创建软件与预览服务，调用 `recover_runs` 和 `recover_sessions`。公共 FITS、Image Path 与素材节点独立于 Bundle。 [宿主入口](../../../__init__.py) · [Bundle](../../../extension/siril/bundle.py)
- `COMMAND_TABLE` 固定官方 1.4.5 命令名、用法、最少参数数、脚本标志和前提。`Command` 提供稳定节点 ID 和前端描述。`node_types` 为每条可脚本执行的命令缓存一个独立 V3 类，`get_node_list` 在宿主启动时交给 ComfyUI。201 条可搜索，183 条注册，18 条保留目录说明。构建条件及插件前提由描述携带。 [命令表](../../../extension/siril/command_table.py) · [注册表](../../../extension/siril/commands.py) · [V3 工厂](../../../extension/siril/node.py)
- `GET /astrophoto/v1/software/siril/commands` 由 `catalogue` 返回版本和命令描述，未安装 Siril 也可在受信本机访问。节点目录继续读取 ComfyUI 原生 `/object_info`；Settings 的 `SirilCommands` 使用公共 `SearchField` 搜索用法、名称和节点。`getCommands` 复用目录请求，失败允许后续重试。`registerSirilNodes` 按节点 ID 选择共享 Inspector 或 CLI 日志，挂载失败时原生 Schema 控件仍可使用。 [路由](../../../extension/siril/routes.py) · [节点目录](../../../frontend/src/api/nodes.ts) · [搜索目录](../../../extension/siril/frontend/SirilCommands.tsx) · [共享展示](../../../extension/siril/frontend/SirilNodes.tsx)
- 宿主在启动时加载 Python 节点。代码更新后，已有运行进程需要重启才能让 `/object_info` 返回新节点，浏览器再刷新目录。`8188` 曾仅返回旧 AutoStretch；保留启动参数与数据目录重启后，`/object_info` 和展开后的侧栏均核对到 183 个 Siril 节点。 [运行证据](06_TEST_REPORT.md)

## 通用 CLI 节点与路径执行

- `SirilCommandNode.define_schema` 提供 JSON 参数数组、`stage_only` 和路径输入。要求当前图像的命令可接 `image_path: IMAGE_PATH`；`file_path: IMAGE_PATH` 可作为参数中的 `{input}`；序列可通过 `directory_path: SIRIL_DIRECTORY` 或宿主绝对 `source_directory` 输入，两个目录入口互斥。输出为主图像路径、结果目录、日志及 `SIRIL_STEPS`。`stage_only` 只生成步骤；末端节点用 `previous_steps` 执行同一会话。 [节点 Schema](../../../extension/siril/node.py)
- `make_step` 解析独立参数，检查类型、命令最少参数、控制字符、路径穿越与原始绝对路径。后端按注册表生成命令行，`_stage` 把文件复制到独立工作目录，并按元数据插入 `load`；需要回传当前图像时追加 `save`。会话目录接续保留可用的序列成员，原件只读。无已加载图像时按命令返回明确的前置条件错误或 Siril 诊断。 [参数与暂存](../../../extension/siril/session.py)
- `ScientificNode.storage` 限定受信本机。`SoftwareService.current` 校验启用状态与已验证 CLI，`run_script` 生成临时脚本和配置，`run_cli` 用固定参数启动无 shell 子进程。通用会话处理上限为 3600 秒，检查宿主中断、关闭和 CLI 指纹；失败向宿主报告。会话以离线模式启动，Siril `online` 步骤可显式联网。`pyscript` 仅接受宿主 `ASTROPHOTO_SIRIL_PYTHON_SCRIPTS` 指定的脚本；`set` 支持会话内标量。StarNet、权重及 Astrometry.net 由宿主环境指定。 [软件检测](../../../extension/siril/software.py) · [CLI Runner](../../../extension/siril/processing.py) · [宿主配置](../../../docs/siril.md)
- `execute_session` 在当前默认 Workspace 租约内于 `.staging` 建立会话。CLI 返回后筛选产物、检查主 FITS 和容量、计算 SHA-256，再将目录发布到 `outputs/<run_id>/` 并由 `record_outputs` 在同一数据库事务登记各文件。没有文件输出时只返回日志和空路径；数据库登记异常则把目录退回暂存。`recover_sessions` 依据实例、工作区和运行标记清理自有未提交目录，对已登记产物只清理标记。`managed_groups` 以会话为单位迁移序列及附属文件。 [会话与恢复](../../../extension/siril/session.py) · [批量登记](../../../astrophoto/assets/library.py) · [迁移](../../../astrophoto/storage/migration.py)

## FITS 比较和旧工作流兼容

- AutoStretch、Gaussian Blur 和 Negative 由 `SirilFITSNode` 提供原生路径及参数控件。`SirilFITSNode.execute → formal_run → stretch` 复用同一个 CLI Runner。工作副本规范化 FITS HDU 和非有限像素，输出经形状检查、无覆盖发布、回执和正式结果登记。保留 `AstroPhotoSirilAutoStretch` ID、旧参数与默认值，以及 `stretched.fit` 和 `siril-autostretch-v1`。其余两种命令用 `result.fit`，回执含命令 ID。两种正式回执布局都可迁移，未登记运行由 `recover_runs` 核对所有权后处理。 [节点](../../../extension/siril/node.py) · [FITS 处理](../../../extension/siril/processing.py) · [回执路径](../../../astrophoto/storage/locations.py)
- `POST /astrophoto/v1/previews/siril/{command_id}` 只接受支持比较的命令，并严格校验参数和输入身份，原 `/previews/autostretch` 路由继续接收旧请求。`PreviewService` 以命令 ID、输入修订、参数与软件指纹等区分缓存。正式预览核对命令、回执、输入和结果散列；候选替换取消旧作业，WCS 或方向不能确认对齐时只展示允许的比较模式。共享 Inspector 写回原生 widget，遵循宿主编辑权限、撤销和序列化边界。 [路由](../../../extension/siril/routes.py) · [候选服务](../../../extension/siril/previews.py) · [Inspector 接线](../../../extension/siril/frontend/SirilNodes.tsx)

## 方案变化与验证边界

- 已确认范围从三个代表命令扩大到全部 183 个脚本节点。三种 FITS 命令提供结构化参数与比较预览；其他命令共用原生参数、路径、会话和日志接口。图像端口传文件路径，`SIRIL_STEPS` 只携带会话步骤。
- 已实测注册、侧栏呈现、旧图重开、代表性单帧路径链、序列及迁移。逐命令科学输出、插件、远端星表及 macOS/Linux 尚需各自样本。既有 Q-01～20 按 PRD 保持追踪。 [需求与开放问题](01_PRD.md) · [测试计划](05_TEST_PLAN.md) · [测试报告](06_TEST_REPORT.md)

下表记录 CH-03 前的行为，供回查早期 AutoStretch 实现与限制。

## CH-01／CH-02 历史基线

| 实施切片 | 当前函数、输入与消费方 | 实际动作和结果 |
| --- | --- | --- |
| 装配 FR-01～05 | `comfy_entrypoint → AstroPhotoExtension.on_load → host_runtime → initialize_storage_runtime → SirilBundle.initialize_storage`；`register_routes`；`initializeFrontend` | 注册通用节点/路由，按可选 Bundle 追加处理节点、路由/能力。Bundle 建立软件和候选服务，执行 `recover_runs`。前端在单一入口注入 Siril 设置、双语词条和 Widget。 [入口](../../../__init__.py) · [后端 Bundle](../../../extension/siril/bundle.py) · [前端入口](../../../extension/frontend-entry.ts) |
| 配置 FR-01 | `siril_routes → SoftwareService.discover/probe/save/current/set_enabled/clear`；`executable`、`run_cli`、`verify_cli` | 探测最多 8 个去重路径，逐个探针，不写配置。保存先校验 CLI 字符串/绝对路径/名称/签名/权限，调用 `-v`、验证精确版本、用 64×64 RGB 合成数据校验有输出且像素改变；通过后锁内重查指纹、设置有效记录和启用，再回传状态。禁用保留记录，启用前核查现有指纹；清除仅删除保存项。 [软件](../../../extension/siril/software.py) · [处理探针](../../../extension/siril/processing.py) |
| 来源与通用设置 FR-02、FR-04、FR-05 | `frame_assets`、`resolve_input`、`resolve_fits_path`、`inspect_fits`；`AstroPhotoFITSSource.fingerprint_inputs/execute`；`get_preview_settings/set_preview_settings` | FITS 列表经 UUID cursor 和后缀筛选；canonical UUID 通过 Assets 解析，其余参数根据已登记路径或绝对路径读取。Fingerprint 读 stat；失败返回 `NaN`。execute 检查所选图像 HDU、输出 `IMAGE_PATH` 与名为 `astrophoto_asset` 的身份字段。Settings 检查字段和 revision，仅将 `preview_edge` 传给存储；`canvas_preview` 固定读取默认。 [FITS](../../../astrophoto/assets/fits.py) · [节点](../../../nodes/scientific.py) · [通用路由](../../../astrophoto/api/scientific.py) |
| 候选 FR-02、05 | `start_preview → PreviewService.start → _run_worker/_run → _formal_result` 或 `stretch`；`read/validate/cancel` | 预先校验参数与 Siril 开关，再按 owner 软取消旧任务并创建 UUID 与后台 worker；先落前图。formal 验证 manifest 与哈希；普通候选检查软件和缓存后图，未命中则以 Cache scratch 处理。再检查结果形状、对齐，提交 ready；异常保留已可用前图和错误码。取消置位 stop，由 checkpoint 使作业退出；读取重新验证 stat 与缓存条目。 [候选](../../../extension/siril/previews.py) · [路由](../../../extension/siril/routes.py) |
| 正式和恢复 FR-03、05 | `AstroPhotoSirilAutoStretch.execute → formal_run → stretch → prepare_fits/process/check_output`；`recover_runs` | 解析路径并检查源，锁定有效 CLI，在默认 Workspace 租约内启动唯一运行。先写 running manifest，再按源 stat 复制并计算 SHA-256。规范化工作副本 HDU 与非有限值，运行固定 `autostretch` 脚本，处理输出并重核源 stat/hash。检查形状、fsync、无覆盖发布，写完成回执并登记资产。失败移除本次输出并写 failed/cancelled，原件未写。恢复只调和本实例和 Workspace 自有的未登记运行。 [正式节点](../../../extension/siril/node.py) · [处理与恢复](../../../extension/siril/processing.py) |
| Widget FR-02、FR-04、FR-05 | `registerFitsSource → SourcePicker`、`registerAutoStretch → AutoStretch`、`sourceId`、`renderCandidate`、`updateParameters` | 来源值从登记列表或路径写入原生序列化 Widget。AutoStretch 每 200 ms 检查图与参数，400 ms 防抖；只展示匹配请求键的结果。候选轮询 350 ms，可见时有效性复核间隔 8 秒。参数有效变化使用宿主图/画布 change hooks；单色禁用联动。宿主 `onExecuted` 结果存于 WeakMap，匹配源和参数时用 formal ID。Widget 移除清理监听、挂载、回调及 Blob URL。 [来源](../../../frontend/src/host/fitsSource.tsx) · 历史 AutoStretch.tsx，现入口见上文 · [客户端](../../../extension/siril/frontend/api.ts) |

### 历史拒绝、状态与副作用

| Guard | 触发与位置 | 可观察行为及恢复 | 规范及用例 |
| --- | --- | --- | --- |
| G-01 | `storage.handler` 检查部署、请求来源、标头；`ScientificNode.storage` 检查受信部署与存储 | HTTP 403 或 V3 `UNAUTHORIZED_STORAGE_OPERATION` / `STORAGE_UNAVAILABLE`。调用不会启动处理；在授权本地部署复试。 | [PRD](01_PRD.md) FR-01、FR-02、FR-04 · CASE-05 |
| G-02 | `executable/probe/current` 校验绝对路径、非空字符串 ≤4096 且无 NUL、允许名称、签名、可执行性、版本及指纹 | `SIRIL_EXECUTABLE_INVALID`、`SIRIL_GUI_ONLY`、`SIRIL_NOT_FOUND`、`SIRIL_VERSION_MISMATCH`、`SIRIL_REVALIDATION_REQUIRED` 或 `SIRIL_DISABLED`。失败不提交配置。配置请求断连本身无后端取消令牌。 | FR-01 · CASE-01、09 |
| G-03 | `resolve_input/resolve_fits_path/source_stat/inspect_fits` 检查来源、路径、后缀、HDU、格式与读取前后 stat | 不合法/不可读报存储路径错误、`FITS_INVALID`、依赖缺失或 `SOURCE_CHANGED`；正式处理未登记资产。校验失败不回退到同名文件。 | FR-02、FR-03、FR-04 · CASE-04、05、10 |
| G-04 | `routes.start_preview` 检查身份二选一和 UUID；`parameters` 要求键精确、阴影有限、目标 0–1、联动布尔 | 请求形状错误报 `INVALID_REQUEST`；坏参数报 `INVALID_AUTOSTRETCH_PARAMETERS`。单色将有效联动归一为 false；WCS 不符或行序未知禁用分割。 | FR-02 · CASE-02、05、06、10 |
| G-05 | `PreviewService.start/_job/read/validate` 与浏览器请求键 | 同 owner 替换作业，读取或验证失败显示 `PREVIEW_NOT_FOUND`、`PREVIEW_STALE` 或底层来源/软件错误，可刷新；普通验证检查软件指纹，formal 读后图检查输出 revision。终态闲置 900 秒或在约 128 条清理阈值下回收 terminal job，条件在创建新任务时检查，非并发硬限。 | FR-02、05 · CASE-06、11 |
| G-06 | `stretch/formal_run/recover_runs` 中资源、源、输出、取消、所有权和入库 | 容量/CLI/输入变化或尺寸不同会阻断；CLI 异常输出报 `SIRIL_RUN_FAILED`，尺寸不匹配报 `SIRIL_OUTPUT_INVALID`。已发布但未登记的异常由本次清理或重启恢复；恢复只删除已知文件，外来或已登记运行保留。 | FR-03、05 · CASE-03、07、10、12 |
| G-07 | `set_preview_settings` 和 Environment 页控制 | 长边枚举之外、canvas 字段或范围不合时报 `INVALID_PREVIEW_RESOLUTION`，设置版本过期返回 409；刷新再保存。尺寸通过检查仍固定默认，见 Q-04。 | FR-05 · CASE-08、13 |
| G-08 | `AstroPhotoFITSSource.execute` → `resolve_input` → `AssetService.resolve_asset` → `resolve_managed`；正式 `formal_run` → `WorkspaceRegistry.lease/require` | 受管资产 ID 通过登记的工作区根和相对键重解。失去工作区权限或遇到迁移时，正式任务不建运行目录，不向其他根写；已有结果按 ID 可经新根重新读取，旧绝对路径保持旧含义。 | FR-03、04 · CASE-03、04、14 |
