# Siril 集成与 FITS AutoStretch · 开发规格与实现

**版本** v0.4 · 2026-11-21 · 当前工作树静态核验，业务代码未在本轮改动。`003c599` 为历史工作流证据；当前以 `main@4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加相关 dirty 文件为准。旧 `astrophoto/siril/{software,frames,previews,processing}.py`、`astrophoto/api/siril.py`、`frontend/ui/src/host/scientific.tsx`、`frontend/ui/src/api/siril.ts` 可从该 HEAD 的 Git 对象回查。当前代码分为通用科学路径和 Siril Bundle。 [基线](00_FEATURE_INDEX.md) · [接口](03_TECH.md)

## 实际入口及函数调用次序

| 实施切片 | 当前函数、输入与消费方 | 实际动作和结果 |
| --- | --- | --- |
| 装配 FR-01～05 | `comfy_entrypoint → AstroPhotoExtension.on_load → host_runtime → initialize_storage_runtime → SirilBundle.initialize_storage`；`register_routes`；`initializeFrontend` | 注册通用节点/路由，按可选 Bundle 追加处理节点、路由/能力。Bundle 建立软件和候选服务，执行 `recover_runs`。前端在单一入口注入 Siril 设置、双语词条和 Widget。 [入口](../../../__init__.py) · [后端 Bundle](../../../extension/siril/bundle.py) · [前端入口](../../../extension/frontend-entry.ts) |
| 配置 FR-01 | `siril_routes → SoftwareService.discover/probe/save/current/set_enabled/clear`；`executable`、`run_cli`、`verify_cli` | 探测最多 8 个去重路径，逐个探针，不写配置。保存先校验 CLI 字符串/绝对路径/名称/签名/权限，调用 `-v`、验证精确版本、用 64×64 RGB 合成数据校验有输出且像素改变；通过后锁内重查指纹、设置有效记录和启用，再回传状态。禁用保留记录，启用前核查现有指纹；清除仅删除保存项。 [软件](../../../extension/siril/software.py) · [处理探针](../../../extension/siril/processing.py) |
| 来源与通用设置 FR-02、FR-04、FR-05 | `frame_assets`、`resolve_input`、`resolve_fits_path`、`inspect_fits`；`AstroPhotoFITSSource.fingerprint_inputs/execute`；`get_preview_settings/set_preview_settings` | FITS 列表经 UUID cursor 和后缀筛选；canonical UUID 通过 Assets 解析，其余参数根据已登记路径或绝对路径读取。Fingerprint 读 stat；失败返回 `NaN`。execute 检查所选图像 HDU、输出 `IMAGE_PATH` 与名为 `astrophoto_asset` 的身份字段。Settings 检查字段和 revision，仅将 `preview_edge` 传给存储；`canvas_preview` 固定读取默认。 [FITS](../../../astrophoto/assets/fits.py) · [节点](../../../nodes/scientific.py) · [通用路由](../../../astrophoto/api/scientific.py) |
| 候选 FR-02、05 | `start_preview → PreviewService.start → _run_worker/_run → _formal_result` 或 `stretch`；`read/validate/cancel` | 预先校验参数与 Siril 开关，再按 owner 软取消旧任务并创建 UUID 与后台 worker；先落前图。formal 验证 manifest 与哈希；普通候选检查软件和缓存后图，未命中则以 Cache scratch 处理。再检查结果形状、对齐，提交 ready；异常保留已可用前图和错误码。取消置位 stop，由 checkpoint 使作业退出；读取重新验证 stat 与缓存条目。 [候选](../../../extension/siril/previews.py) · [路由](../../../extension/siril/routes.py) |
| 正式和恢复 FR-03、05 | `AstroPhotoSirilAutoStretch.execute → formal_run → stretch → prepare_fits/process/check_output`；`recover_runs` | 解析路径并检查源，锁定有效 CLI，在默认 Workspace 租约内启动唯一运行。先写 running manifest，再按源 stat 复制并计算 SHA-256。规范化工作副本 HDU 与非有限值，运行固定 `autostretch` 脚本，处理输出并重核源 stat/hash。检查形状、fsync、无覆盖发布，写完成回执并登记资产。失败移除本次输出并写 failed/cancelled，原件未写。恢复只调和本实例和 Workspace 自有的未登记运行。 [正式节点](../../../extension/siril/node.py) · [处理与恢复](../../../extension/siril/processing.py) |
| Widget FR-02、FR-04、FR-05 | `registerFitsSource → SourcePicker`、`registerAutoStretch → AutoStretch`、`sourceId`、`renderCandidate`、`updateParameters` | 来源值从登记列表或路径写入原生序列化 Widget。AutoStretch 每 200 ms 检查图与参数，400 ms 防抖；只展示匹配请求键的结果。候选轮询 350 ms，可见时有效性复核间隔 8 秒。参数有效变化使用宿主图/画布 change hooks；单色禁用联动。宿主 `onExecuted` 结果存于 WeakMap，匹配源和参数时用 formal ID。Widget 移除清理监听、挂载、回调及 Blob URL。 [来源](../../../frontend/src/host/fitsSource.tsx) · [AutoStretch](../../../extension/siril/frontend/AutoStretch.tsx) · [客户端](../../../extension/siril/frontend/api.ts) |

## 拒绝、状态与副作用

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

历史能力和既有 Bundle 证据分别保留，最新快照与新增边界仍需运行确认。待处理的产品偏差依 [PRD](01_PRD.md) Q-01～05，包括 Header/源内容身份、资源与中断、固定画布尺寸及配置取消。旧素材导入页面快捷路径当前不可用；候选自动解析仅支持当前已知直接入口。无拟新增函数或运行观察被纳入本轮现状，后续测试按 [测试计划](05_TEST_PLAN.md) 定位到具体入口。
