# Nodes / Siril 只读源码审计

本轮只读，未运行测试、真实 Siril 或 ComfyUI。下述全部 IMPLEMENTED_UNVERIFIED，缺口另标 PARTIAL / CONFLICT / UNKNOWN；测试函数存在不代表通过。行号为仓库相对路径。范围不包括 Vue/React UI 实现。

## 清单及 Feature

- N-01 `vue-basic`：V3 输入 `CUSTOM_VUE_COMPONENT_BASIC` dict，输出 IMAGE；验证 image 字符串后调用 host `get_annotated_filepath` → `LoadImage.load_image`，无本节点持久写入（nodes/ComfyUIFEExampleVueBasic.py:6-26）。历史节点保留；旧式 NODE_CLASS_MAPPINGS 不存在，注册测试列出四节点（tests/nodes/test_registration.py:4-22）。
- N-02 `AstroPhotoImagePath`：socketless string 原样输出自定义 IMAGE_PATH，无 IO 或验证（nodes/scientific.py:10-25）；是独立手工路径入口，消费者负责检查。
- N-03 `AstroPhotoFITSSource`：ASTRO_FITS_ASSET → IMAGE_PATH，解析资产/路径、只读 FITS 验证并 UI 返回身份；fingerprint 基于文件 stat，异常 NaN 触发重算（nodes/scientific.py:40-61）。
- N-04 `AstroPhotoSirilAutoStretch`：IMAGE_PATH → IMAGE_PATH，三个参数，输出节点，fingerprint 永远 NaN；正式运行产物为新资产路径，UI 携带资产、来源、原始参数；发客户端事件（nodes/scientific.py:64-111）。
- N-05 FITS：选择首个有效 2D mono 或首轴 3 的 RGB 图像 HDU；只读 memmap、不缩放加载，记录 BITPIX、有限元数据与坐标；preview 独立 PNG 代理，64 行分块 float64，NaN/Inf 置零，裁剪并可缩放；源前后 stat fingerprint 检查（astrophoto/siril/frames.py:61-154）。不把 PNG 作为科学输出。
- N-06 软件：平台目录/PATH 最多 8 个候选，逐一执行版本和 64×64 RGB 真实操作能力探测；严格版本 1.4.5，保存前验证二进制身份并原子配置；启用必须已有可验证配置，关闭/删除配置（astrophoto/siril/software.py:18-53,90-201）。
- N-07 执行：固定 SSF 含 requires、setcpu 4、setext、load、set32bits、autostretch、save；shell=False，独立临时目录、离线配置，轮询 checkpoint 并 kill/wait；复制源，处理副本，运行前后检查源 stat+SHA256（astrophoto/siril/processing.py:24-47,57-111,137-156；software.py:56-82）。
- N-08 正式输出：workspace lease 下 UUID 文件夹、manifest、scratch，成功校验尺寸后发布 FITS、hash 和 DB 资产；失败删除输出、记录失败/取消；重启只清理属于本实例且未登记的运行（processing.py:159-246）。
- N-09 预览：owner 新任务取消该 owner 旧 queued/running，thread jobs，完成任务在后续 start 按 900 秒/128 条淘汰；源 PNG 先产生，formal ID 校验 receipt/hash 或运行候选并按源 revision、参数 hash、软件指纹、renderer 和尺寸复用；前后尺寸和 WCS/ROWORDER 对齐检查（previews.py:18-83,118-215）。shutdown 设置停止标记并 join（47-60）。
- N-10 HTTP：软件 GET/discover/save/delete/enabled；资产分页；预览设置 GET/PUT；POST 任务、GET 状态、cancel、validate、before/after PNG，202 异步任务；隐藏 cache_key，PNG no-store/nosniff（astrophoto/api/siril.py:14-109）。

## Guards：输入 → 校验 → 业务 → 清理/响应

- GN-01 节点 runtime → storage 存在且 trusted_local → resolve → 失败 StorageError（scientific.py:28-37）；ImagePath 本身 NO_GUARD_FOUND。
- GN-02 路径 → 非空字符串；UUID 解析资产，否则已注册路径，找不到再直接 source_stat；suffix FIT/FITS/FTS、HDU shape、verify、异常映射 FITS_INVALID、前后指纹不一致 SOURCE_CHANGED（frames.py:17-36,61-115）。按 D04/D19 保留现行行为：直接路径未限定 import roots，但 source_stat → checked_path 会拒绝相对路径（storage/manager.py:25-34；storage/paths.py:12-19）；历史最新要求受授权路径，见 05_NODE_IMAGE_PATH_CONTRACT.md §5。trusted_local 是部署级限制，非路径授权。
- GN-03 坏轴/损坏/权限 → 符合形状才读，OSError/ValueError 等映射 FITS_INVALID；没有明确尺寸上限或内存预算 guard（render_png 全尺寸 uint8；prepare_fits 偏移且有非有限值可分配整图 float64）。FITS 校验不验证科学像素均有限；处理副本将 NaN/Inf 归零，科学语义改变需明确。多 HDU 取第一个符合而非拒绝多个有效图；非有限 BSCALE/BZERO 归零（frames.py:61-115,125-154；processing.py:57-111）。
- GN-04 参数 → 精确字段，shadows 为有限数，target 0..1，linked 必须 bool，mono 强制 false → 安全数值格式脚本（processing.py:24-31,34-43）。shadowsclip 没有上下界，仅有限性；target NaN 因范围检查拒绝。
- GN-05 CLI → 绝对路径、允许名称、二进制签名及可执行权限；-v 必须精确 1.4.5，probe 真运行并比较结果；身份变化拒绝；无 shell，取消/timeout kill+wait（software.py:24-82,135-165）。**PARTIAL**：正式/候选 process 调用未传 timeout（processing.py:34,152）；probe 8/15 秒有超时。只校验输出维度/通道，非完整科学数据或像素非空验证（processing.py:50-54）。
- GN-06 正式处理 → 参数/软件/workspace → 租约、空间预算、临时副本 → 发布并登记；BaseException 失效产物删除和 receipt 状态；恢复只处理符合实例/路径/未注册的产物（processing.py:137-246）。manifest 和目录保留，非完整删除；写 manifest 本身失败的异常路径未证明完全回滚。
- GN-07 preview → owner UUID、参数、互斥 asset_id/image_path、formal UUID（api/siril.py:59-68）→ stop checkpoint → 状态/图片；读取源及 formal revision 检查，validate 再验软件身份、cache（previews.py:62-128,130-206）。普通单张 image 读取不检查软件身份；任务 TTL 仅 start 时清理，活跃任务总量无硬上限，owner 是调用方提供 UUID，非授权身份；cache 一致性依赖 stat 指纹，stat 不变的内容替换未证明能检测。
- GN-08 HTTP → fields 拒绝额外字段、canonical UUID、side 白名单；共享 storage route 权限边界仍需主审计核对（api/siril.py:59-109，api/storage.py:23-35）。PUT preview settings 验证 canvas 却仅传 preview_edge 给 update_settings；canvas_preview 无视存储配置并固定返回 480×320；故该兼容字段被接受但不生效（api/siril.py:49-56；core/config.py:18,100-109；storage/runtime.py:76-92）。前端将响应应用为 CSS 变量（frontend/ui/src/api/previewSettings.ts:17-18,25-53）；是否违反当前产品要求需对照最新决策，不能仅凭旧接口认定 bug。

## Test 双向映射（存在≠执行通过）

- N-01：test_load_image_delegation_and_output / test_invalid_widget_data_rejected_before_host_io（tests/nodes/test_image_io.py:4-20）断言宿主调用及无效类型前拒绝；host 为 fixture stub，非真宿主。
- N-01~04：test_v3_registration_and_definition（tests/nodes/test_registration.py:4-23）断言四 ID、IMAGE_PATH 连通类型、UNC 原样、Vue schema 和构建文件；未证明真宿主工作流序列化。test_load_image_node_outputs_path_and_tracks_file_changes（tests/backend/test_siril.py:40-54）真实 FITS、fixture extension、storage，断言路径与变更指纹。
- N-05/GN-02/03：test_direct_fits_path_outside_import_roots（25-37）明确断言任意外部路径可用和坏 FITS 拒绝；test_frames_validate_precision_metadata_and_truncation（76-84）真实 RGB FITS，断言尺寸 BITPIX 元数据 PNG、源字节不变、截断拒绝。没有覆盖多有效 HDU、轴矩阵、NaN/Inf、超大内存或权限的明确测试函数。
- GN-04：test_parameters_reject_untrusted_script_values（87-93）断言布尔伪值、target 越界、NaN、注入字符串拒绝；test_mono_normalizes_linked（96-98）断言 mono/RGB。
- N-06/GN-05：test_config_rejects_incompatible_version_and_keeps_previous（101-111）monkeypatch executable/run_cli/verify_cli，断言错误版本不覆盖旧配置；test_invalid_and_gui_paths_rejected（114-120）验证路径错误；test_runner_timeout_and_mid_process_cancellation（123-135）真实 Python 子进程非 Siril，断言 timeout/KeyboardInterrupt 及随后进程可执行。
- N-08/GN-06：test_restart_reconciles_only_owned_unregistered_run（138-152）真实临时 storage/SQLite，断言中断标记、删除未登记输出、保留用户文件。test_real_cli_immutable_source_and_formal_output、test_real_cli_direct_path_and_repeated_runs（155-207）仅设置 ASTROPHOTO_SIRIL_TEST_CLI 才运行，断言真实 CLI 输出不同、源不变、取消与多次输出；本轮未执行，不可声称真 Siril 通过。
- N-09/10/GN-07/08：test_scientific_api_access_source_and_cache（tests/integration/test_siril_api.py:22-84）aiohttp TestServer、真实临时 FITS/SQLite，无配置 Siril，断言 trusted/origin 403、配置错误、列表、异步失败前 before 可读、after 404、源删除失效；不是实际 host/Siril。缺少明确候选成功、并发覆盖、缓存复用、formal receipt、启动失败和取消清理端到端断言。

## 交接差异及风险

- 最新专题 02/05 要求 IMAGE_PATH 和内部 load/process/save：N-02~04、07 已实现，但真实 Host E2E UNKNOWN；专题仍称尚无实施证据，现已过时。GN-02 允许可信本机读取导入根外的合规绝对路径。这是现行行为，导入 API 的来源限制另计。
- 原始 Siril PRD v1.1 / 工程规范 ASTRO_FRAME 端口被最新路径契约覆盖；内部 AstroFrame 为服务元数据，不是端口。用户最新确认 Inspector 参数可编辑，旧只读条款已替代；图像三模式仍适用，本期无 Trial，UI 归 frontend 审计，后端可提供 before/after、alignment 和 formal 标志但不能据此证明 UI 验收。
- 旧 Last_Handoff/sources/01_CURRENT_STATE.md:30 的仅一个节点/无外部软件管理为历史快照 OBSOLETE；保留 vue-basic 行为仍须真 Host 证明。
- 最新专题要求限时：probe 有限时、正式及候选无默认限时；要求快速候选和正式产物分离，代码有独立 cache 和 workspace，但并发身份和完整 UI 生命周期需测试。真实 Siril、host、文件权限及大图内存均 UNKNOWN。

## 已读 / 未读

已读上述代码和测试函数；对照 Chat_Handoff 专题 02、05、10 与 Last_Handoff 01；原始 PRD 通过专题冲突矩阵间接对照，未逐条阅读全文。bootstrap、共享 HTTP 授权、cache/storage 底层以及 frontend 由主审/其他范围核对；没有声称已逐项完成全仓审计。未运行任何测试。需要继续逐函数读取剩余 backend tests、bootstrap、完整原始 PRD、最新 Inspector 与 preview 契约并补证据。


## 补充：细粒度功能与完整 HTTP 映射

以下拆分 N-11～N-27 均为 IMPLEMENTED_UNVERIFIED；写入“无”指本函数无直接持久写入，不排除调用链副作用。

- N-11 资产选择列表：`frame_assets(after)` 查询后缀并按 ID 取 101 项，最多返回 100 条和 next；DB 只读（frames.py:51-58）。后缀筛选不是 FITS 数据校验。
- N-12 解析：`resolve_input` 对 canonical UUID 走资产解析，其他先已登记路径，再回退直接路径；路径最终 `source_stat` → `checked_path`，要求绝对路径、拒绝 UNC、`..`、链接/reparse、网络卷和非普通文件（frames.py:17-36；storage/manager.py:25-34；storage/paths.py:12-36）。没有 import roots 约束，但受本地可信部署边界约束。
- N-13 HDU/头：首个二维或首轴三通道三维、正尺寸图像；hdu.verify(exception)、读取 data，记录八类头信息和 WCS 前缀；仅显示时转换并下采样（frames.py:61-115）。
- N-14 图片代理：全尺寸 uint8 缓冲，BSCALE/BZERO 物理转换、非有限归零、裁剪到 0..1，非 TOP-DOWN 行翻转，RGB 转 HWC，Pillow 双线性缩放编码内存 PNG；只缓存 PNG，科学原件不改（frames.py:118-154）。正整数 BITPIX 除以 2^BITPIX-1，浮点按 1 归一，非自动拉伸。
- N-15 参数归一和脚本：严格字段、float 有限、target 范围、真正 bool；linked 限 RGB；固定脚本写临时目录及隔离 config，输出缺失或日志错误则失败（processing.py:20-47）。
- N-16 FITS 预处理：仅工作副本 update；扩展 HDU 转 primary，新文件替换；逐块非有限值变零，偏移存在时转换全图 float64 并删 scaling/blank；移除失效校验和（processing.py:57-111）。无明确科学精度无损保证；源不会由此直接修改。
- N-17 执行 probe：二进制签名/可执行验证 + `-v` 八秒、人工生成 FITS 实测十五秒，比较输出不相同、格式和形状；临时目录清理（software.py:24-53,135-155；processing.py:114-134）。
- N-18 CLI 子进程：无 shell、固定 cwd、无 stdin、环境 LC_ALL/LANG=C，临时日志文件，轮询进程/取消，超时 kill/wait 并检查退出码；正式调用未给 timeout（software.py:56-82；processing.py:152）。
- N-19 软件状态与配置：current 验证启用状态及持久二进制身份；save 先 probe 后持锁再次比身份、再写；clear 只清配置；enabled 严格 bool（software.py:90-172）。
- N-20 发现：PATH 和平台安装目录，去重并限制前八，probe 每项、保留错误状态；读本地并启动候选程序、不自动保存（software.py:174-201）。
- N-21 复制/一致性：空间估计、checkpoint、复制时 hash，处理前后身份、源 stat 和 hash 验证；scratch 有临时复制（processing.py:137-156；storage/manager.py:19-22,44-89）。
- N-22 正式发布：workspace lease 与 UUID 目录、manifest，成功后同卷 no-replace 发布、再次读取及 hash，DB 登记；失败删输出、写失败 receipt；output 和 receipt 是持久写入（processing.py:159-204；storage/manager.py:92-102）。
- N-23 启动恢复：初始化 storage、cache、workspace 后恢复；仅本实例、对应 workspace、UUID、producer、running/completed 且 DB 无资产的 receipt；删已知 scratch 文件、未登记输出、标 interrupted；异常日志延后（storage/runtime.py:56-74；processing.py:207-246）。
- N-24 预览生命周期：start 按 owner 替换未完任务；cancel 只设置 stop 并返回当下 state；线程 finally 移除 worker，shutdown 停止并 join；已完任务仅在后续 start 清理（previews.py:18-101）。
- N-25 预览缓存：先缓存 before，记录 revision、宽高、通道和标准参数；正式输出走 receipt/hash 认证；候选按输入、参数、CLI fingerprint、renderer 版本和 longest_edge 查找 ready job，cache 存 PNG（previews.py:130-201）。
- N-26 预览读取与校验：路径 UUID、side 限 before/after，读取检查源 stat 和 formal 输出 stat；validate 对所有现存图做 cache 校验及候选软件身份校验（api/siril.py:71-91；previews.py:103-128）。PNG 含 no-store/nosniff。
- N-27 设置：GET longest edge/options、固定 canvas 和 revision；PUT 校验 expected_revision、edge 和可选 canvas，但只写 edge；revision 乐观锁更新（api/siril.py:39-56；core/config.py:16-20,90-109；storage/runtime.py:76-92）。

HTTP 全路径前缀 `/astrophoto/v1`（api/siril.py:94-109）：

| 方法及路径 | 输入/输出和副作用 |
|---|---|
| GET /software/siril | 状态、版本、enabled/path；只读 |
| POST /software/siril/discover | 启动候选 probe，返回候选；不持久化 |
| PUT /software/siril | 精确 body path，probe 成功才写配置 |
| DELETE /software/siril | 删除已保存配置 |
| PUT /software/siril/enabled | 精确 body enabled，严格 bool，持久化 |
| GET /fits/assets | 可选 canonical UUID after，分页只读 |
| GET /previews/settings | 返回 edge/options、固定 canvas、限制和 revision |
| PUT /previews/settings | 必需 expected_revision/longest_edge，canvas 可选；仅 edge 生效 |
| POST /previews/autostretch | owner UUID、严格 parameters、asset_id/image_path 二选一，optional formal_id；创建后台任务，202 |
| GET /previews/jobs/{id} | UUID 状态，剔除内部 cache_key |
| POST /previews/jobs/{id}/cancel | 设置 stop，返回当前 state |
| GET /previews/jobs/{id}/validate | 检查图片及软件身份，valid true |
| GET /previews/jobs/{id}/{side} | side 仅 before/after，PNG 二进制 no-store/nosniff |

所有上述端点走共享 handler：必须 trusted_local、loopback remote 和 host、无 forwarded、Fetch-Site 空或 same-origin、Origin 空或同源且 `X-AstroPhoto-Local: 1`；JSON body 最多 65536 字节并在线程执行；错误有 request_id/no-store，403/404/409/423/507/503，其余业务错误多为 422（api/security.py:18-43；api/storage.py:106-165；api/errors.py:5-40）。此边界信任本机进程，不能等同每个文件的授权身份。

## 补充 Guard 和测试边界

- GN-09 source_stat → checked_path 禁止相对、UNC、网络驱动器、链接及 reparse；不存在 SOURCE_NOT_FOUND，普通文件以外/OS 错误 SOURCE_UNREADABLE。更正上文早期疑虑：相对路径最终会被拒绝，不是未检查（storage/paths.py:12-36；storage/manager.py:25-34）。
- GN-10 图片写入 → 独立 scratch → no-replace 同卷 publish，目标已存在拒绝；清理仅允许单链接普通文件（storage/manager.py:92-127）。异常清理本身可能抛错；启动恢复也不删除未知 scratch 内容。
- GN-11 HTTP JSON/身份/响应 → 先认证，再检查服务、JSON 类型及大小，动作在线程运行；StorageError 映射受控响应；精确字段和规范 UUID 拒绝额外值（api/storage.py:23-35,106-165；api/security.py:25-43；api/errors.py:14-40）。
- GN-12 检查配置 → current 确认存储版本/二进制身份，save 探测成功且锁内身份复核才写；discover 最多 8 项，失败不自动覆盖（software.py:90-201）。
- GN-13 正式取消 → checkpoint 异常时 run_cli kill/wait、TemporaryDirectory 清理、formal_run 捕获 BaseException 删除 output 和记账；Interrupted 若为 Exception 会记录 failed，非 Exception（如 KeyboardInterrupt）记录 cancelled（software.py:56-82；processing.py:159-203）。
- GN-14 formal preview → 固定 outputs/{UUID}/stretched.fit，receipt source identity/revision/parameters/state/asset_id 及 output SHA256；不符 PREVIEW_STALE；图片读取时仅 stat fingerprint（previews.py:103-116,130-142）。
- GN-15 canvas 旧参数 → 输入 64..4096 两个整数必须合法，PUT 忽略该值；GET 恒返回默认；内部 update_settings 虽可保存 preview_canvas，但 getter 仍忽略存储值。是兼容接口实际语义，不应推断用户当前要求可配置（core/config.py:100-109；api/siril.py:49-56；storage/runtime.py:88-92）。

测试精确参数：`test_parameters_reject_untrusted_script_values` 四例 linked=0、targetbg=1.1、shadowsclip=NaN、包含换行命令的字符串；`test_invalid_widget_data_rejected_before_host_io` 四例 None、空 dict、image=None、image=123。两个真实 CLI 测试由主 Agent 表示本轮已启用，实际执行结果、环境、退出码以主 Agent 原始证据为准；这里仍不自行声明通过。源文件及测试上文标明真实 FITS/SQLite、stub 或真实 CLI 的区分。
