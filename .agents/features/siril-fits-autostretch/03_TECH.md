# Siril 集成与 FITS AutoStretch · 技术设计

**版本** v0.4 · 2026-11-21 · 当前工作树静态核验。基线及历史区分见 [索引](00_FEATURE_INDEX.md)。发行版本 0.0.1，Python 最低 3.11、开发默认 3.12、Astropy ≥6.1,<8。历史真实宿主为 Windows ComfyUI 0.45.0 / Frontend 1.59.1，既有 Bundle 验证用 ComfyUI 0.46.0 / Frontend 1.59.6；本轮未复跑。 [Bundle 验证环境](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) Siril 目标版本为 1.4.5。 [项目依赖](../../../pyproject.toml) · [历史证据](06_TEST_REPORT.md)

## 组成与所有权

| 层 | 入口及职责 | 归属 |
| --- | --- | --- |
| 宿主 | 原生 V3 `io.Custom("IMAGE_PATH")` 和 `NodeOutput` 承载字符串，ComfyUI 负责节点注册、图保存、队列、缓存与中断。后端 `comfy_entrypoint` 装配 `SirilBundle`，由 `on_load` 初始化存储并注册原生 aiohttp 路由。 | ComfyUI 调用，Extension 提供实现 |
| 通用科学路径 | `AstroPhotoFITSSource` 保存/解析 Asset UUID 或服务器绝对路径并检查 FITS，`AstroPhotoImagePath` 原样发出字符串。`astrophoto/assets/fits.py` 承担只读 FITS 检查、资产枚举与 PNG 转换。通用节点和 HTTP `scientific_routes()` 在无处理 Bundle 的实例中仍注册。 | Extension |
| Siril 后端 | `SirilBundle` 提供节点、软件状态、路由、预览服务和重启恢复。软件配置归现有 Data Root 的存储配置；处理只运行适配器生成的固定脚本。 | Siril Bundle |
| 前端 | `extension/frontend-entry.ts` 调用 `initializeFrontend(app, [sirilBundle])`。通用来源独立注册，Siril Bundle 贡献软件卡片/详情、词条和节点 Widget；主题、locale、网络走现用宿主适配。 | ComfyUI 保存和编辑工作流，Extension 挂载 Vue |
| 文件与登记 | 原始文件归用户；Cache 包含临时候选代理及处理副本；Workspace 保存正式 FITS 和运行回执。成功的正式资产使用现有 `assets` / `asset_locations`，服务端唯一访问数据库。 | Storage/Assets；无 MCP 处理工具 |

## 当前接口

下列 HTTP 路径使用 `/astrophoto/v1` 前缀并经过 Storage handler。须满足 `ASTROPHOTO_LOCAL_STORAGE=1`、单用户、仅 loopback 监听、无 CORS 配置，并检查直连同源且不接收转发标头；要求 `X-AstroPhoto-Local: 1`。科学执行节点也检查 Runtime 可用及受信部署。HTTP 业务错误沿用 `error.code/message/details` 与 `request_id`。 [权限](../../../astrophoto/api/security.py) · [当前路由](../../../astrophoto/api/routes.py)

| 调用方与需求 | 方法、输入与结果 | 生命周期、拒绝与恢复 |
| --- | --- | --- |
| 来源选择器 FR-04 | `GET /fits/assets?after=<UUID>` 返回 `{assets: [{id,name}],next}`，每页最多 100 项；根据文件名的 `.fit/.fits/.fts` 后缀筛选。 | 缺失文件可以仍在枚举中，真正可读性在打开时核验；不存在的 UUID 无同名回退。 |
| Environment FR-05 | `GET /previews/settings` 返回 `longest_edge/options/canvas/canvas_min/canvas_max/revision`；`PUT` 要求 `expected_revision` 和允许的整数长边，可携带 `canvas`。 | 修订不匹配 409。当前 `canvas` 输入范围为 64–4096 且字段恰为 `width/max_height`，通过校验也不持久化；读取始终 480×320。 |
| Software FR-01 | `GET /software/siril` 返回 `os/target_version/state/enabled`，就绪时含 `path/version/verified_at`。`POST /discover` 返回候选。`PUT` 接收 `{path}`，校验后启用；`DELETE` 清除验证记录；`PUT /enabled` 接收布尔值。 | 后三个路径相对 `/software/siril`。查找和校验后方写配置；CLI 被替换须重验。切换禁用保留配置，重新启用检查指纹。 |
| 画布与 Inspector FR-02、05 | `POST /previews/autostretch` 需要 `owner` UUID、`parameters` 和 `asset_id` UUID / `image_path` 二选一；可携带已有 `formal_id`。202 返回 `job_id/state`。`GET /previews/jobs/{id}` 返回状态、存在的图像标志、尺寸、通道、输入 revision、有效参数、错误等。 | `POST .../{id}/cancel` 设置请求取消；`GET .../{id}/validate` 验证有效性；`GET .../{id}/{before,after}` 返回 no-store PNG。服务端可能在处理后图失败时仍持有前图；旧 job 过期或缓存失效需要重新渲染。 |
| 原生队列 FR-03 | `AstroPhotoSirilAutoStretch` 接受 `IMAGE_PATH`、有限阴影裁剪值、目标背景 0–1 与布尔 linked；输出绝对 `IMAGE_PATH`。UI 回执包含 `astrophoto_asset`、`astrophoto_source` 和 `astrophoto_parameters`。 | 以 `NaN` 指纹令显式队列重验；每次成功分配独立 UUID。纯路径节点输出无格式保证，正式处理入口负责检查。 |

## 三条数据流

1. **配置。** 服务器标准安装目录与绝对 PATH 目录用于发现；有效 CLI 固定名称与平台签名。探针检查版本并处理内生合成 RGB 样本，在现有设置锁下重核可执行文件后保存指纹。适配器以参数列表、`shell=False`、独立目录与配置执行预定义操作；没有透传用户命令。
2. **候选。** 浏览器从直接上游来源 Widget 或当前参数仍匹配的已执行上游 AutoStretch 解析输入。请求归属每节点随机 owner，服务端启动 worker，用源 revision、参数摘要、软件指纹、转换版本与 PNG 长边复用有效后图。前/后图自原尺寸 FITS 生成 8-bit PNG；候选临时处理使用 Cache。匹配已登记 formal 时，以结果路径布局、manifest 源身份/版本/参数/成功状态、产物哈希和输出形状验证，随后生成显示代理。
3. **正式。** 受信节点打开源检测 FITS，检查软件，租用默认 Workspace；在唯一 `outputs/<run_id>` 内记录 running、复制输入、检查容量、处理副本、验证输出形状、无覆盖发布 `stretched.fit`、记录完成回执并事务登记 Asset 与 Location。原图只读。异常清理当前运行的发布文件，记录失败或取消。启动恢复按 producer、实例、Workspace、运行 ID 与数据库登记过滤，仅处理未登记的运行中/已完成孤儿。Siril 路由处理经 `asyncio.to_thread` 交给工作线程；保存请求无断连传入的检查点。

## FITS 边界、失败和资源

- `inspect_fits` 选择首个有效 2D 或首维为 3 的图像 HDU，记录尺寸、通道、BITPIX、部分 metadata、坐标键和文件指纹。缩放与行序仅为 PNG 显示转换，`prepare_fits` 对处理副本则可移动扩展图像、修改缩放或将非有限值置零。正式 `check_output` 约束形状及通道，未要求 BITPIX、全 Header、WCS 或辅助 HDU 完全一致。WCS 关键字不一致或非支持行序时禁用分割，原始保护独立于输出科学有效性。
- 本地路径可位于导入根之外；路径和文件检查、受信部署、固定 CLI 和源文件工作副本共同限定边界。处理中重新检查软件指纹及原文件 stat/SHA-256；候选媒体读取重新检查源 revision 和 formal 文件 revision；这不能保证预览后再运行一定消费同一个版本，见 Q-02。
- 同 owner 新候选请求取消旧排队/运行任务。前端只呈现当前请求键中的结果；过期响应释放 Blob URL，折叠状态影响校验轮询。设置采用 revision 并发控制；运行目录/发布采用唯一 ID 与无覆盖发布；文件与数据库之间通过回执恢复，有中断窗口而无跨资源单事务。
- 正常候选/正式流程无产品级固定最大图像大小或全局工作队列上限承诺，仍受实际缓存容量、磁盘与内存约束。探针 `-v` 超时 8 秒、合成处理超时 15 秒。取消检查点可终止直接子进程；宿主强杀和跨平台进程树清理待验。大小、磁盘耗尽、并发与恢复归 CASE-11/12，元数据归 CASE-10。

### 科学校验、身份和提交点

- **工作副本。** `image_hdu` 接受首个满足 2D 单色或 `(3,H,W)` 的 Primary/Image/CompImage HDU。选中扩展图像时，`prepare_fits` 用所选图像生成新主 HDU 再替换工作副本，其他 HDU 不随此转换复制。规整非有限物理值时，非零 BZERO 的分支可改为 float64 物理值并删除 BSCALE/BZERO/BLANK；生成文件和原文件的头部/位深应分开记录。
- **形状与对齐。** 正式 `check_output` 比较宽、高、通道数。对齐比较检查已知 ROWORDER 并排除 ROWORDER 后比较记录的坐标键文本。两边缺坐标键也可相等，表示当前比较行为，不能据其推断坐标变换或所有 WCS 关键字都一致。科学有效性用独立 FITS/WCS 检查读取产物。 [FITS 读取](../../../astrophoto/assets/fits.py) · [对齐实现](../../../extension/siril/previews.py)
- **路径与权威记录。** FITS Source 用 ID 找到当前位置后发出绝对路径，AutoStretch 用路径匹配登记记录或直接路径。SQLite 的 `AssetLocation.workspace_id + relative_key` 是结果跨工作区根变化的定位依据。手工路径和已经返回的节点路径不会随重绑改写。新正式任务在取得默认 ID 的 Workspace 租约后调用 `require`，不可写时在建运行目录之前退出。 [工作区实现](../../../astrophoto/storage/locations.py) · [正式执行](../../../extension/siril/processing.py)
- **提交与恢复。** 成功 manifest 早于 Asset/Location 事务落盘，因此同时具备成功回执、完整 FITS 与已提交登记才算正式发布成功。启动时只对实例、工作区、运行 ID 和生产者均匹配且未登记的运行执行孤儿清理。离线或忙工作区恢复会延后，此轮启动没有可保证的自动重试时点。

官方机制和项目实现的对应证据沿用当前 [Siril 开发说明](../../../docs/siril.md)；历史版本参考 [Siril 1.4.5 官方发布](https://siril.org/download/2026-10-28-siril-1-4-5/)。继续核对的次序是通用来源/权限、软件探针、候选、真实队列与恢复。 [开发规格](04_DEV.md) · [测试计划](05_TEST_PLAN.md)
