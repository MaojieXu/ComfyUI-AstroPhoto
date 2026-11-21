# 素材导入与资产登记 · 开发规格与实现

**版本** v0.4 · 2026-11-21 · 当前源码静态核对，基线见[索引](00_FEATURE_INDEX.md)。下表为现存实现，产品规则见 [PRD](01_PRD.md)。

| 需求 / 用例 | 入口和函数 | 实际分支、副作用与限制 |
| --- | --- | --- |
| FR-01 / CASE-01 | `api/assets.py:preview/import_assets` → `assets/imports.py:_selection/validate_selected_source_path/_files/_walk/preview` | DTO 校验 sources 与可选字段，workspace UUID 规范；包含 1～100 项且每项为字符串，模式两选一，会话为非空字符串且长度 ≤120。所选路径在授权根且与保护区不重叠；子项再次校验，按规范键去重。逐项累积检查错误，候选超 10,000 或遍历超 40,000 项报 TOO_MANY_FILES。copy 的预检要求在线可写目标和剩余空间，结果只返回计数、空间、有效模式及目标。 |
| FR-02 / CASE-02 | `AssetImportService.import_assets/run/_run_files` → `storage/operations.py:find/create/submit/run/status/cancel/retry` | 同一把全局锁先查 kind/key 与 payload 一致性，再解析选择、检查 copy 目标和受理。入队记录固定模式、目标和 session，worker 枚举后持久化文件清单，复按当时状态校验空间与路径。非终态可重启继续，终态复访无重做。处理完成但有部分失败时 phase 为 completed，全部失败时 phase 为 failed。 |
| FR-02 / CASE-02 | `AssetImportService.import_reference/_asset/_record` | 重查路径和原 stat，写入前变更报 SOURCE_CHANGED。已登记路径若大小和 mtime 相符则 skipped，可同事务补关系；不符则 DUPLICATE_ASSET。新登记的回执计数与 Asset/位置/会话同事务写。 |
| FR-02 / CASE-02 | `AssetImportService.import_copy/_clear_staging` → `storage/manager.py:stage_copy/publish_object` | 以工作区租约与 operation 所有者保护 .staging。源复检、写 .part，检查目录变动、取消和对象冲突，持久化 publishing 及已暂存指纹。恢复可重新核对已有对象，匹配后同一事务登记及推进计数；已记录的临时文件可按计划清理。写失败及发布后 DB 中断需对照持久态，保留读回证据。 |
| FR-03 / CASE-03 | `api/assets.py:list_assets/inspect_asset/relocate_asset` → `assets/service.py:list/resolve_asset/relocate` | 列表游标与 availability 分离，接受规范 UUID；外部读取走记录路径，受管解析 Workspace + relative_key，校验文件 stat。重绑先检授权和文件，再在锁内拒绝受管记录、大小变化及其他资产占用的目标键。成功只更新已有记录的位置与显示元数据，无物理副本或内容哈希校验。 |
| FR-04 / CASE-04 | `api/assets.py:set_asset_session` → `assets/service.py:validate_session/set_session/assign_session` | DTO 只接受布尔 attached。校验非空 session 字符串后，锁和事务内确认资产，再增删单个关系，已有/缺少关系可重复提交。不能从会话字符串推断有对应的完整会话对象。 |
| FR-05 / CASE-05 | `frontend/src/features/sidebar/Sidebar.tsx` → `AssetsPlaceholder.tsx`；`frontend/src/host/fitsSource.tsx`；`api/scientific.py:frames` → `assets/fits.py:frame_assets/resolve_input/inspect_fits` → `nodes/scientific.py:AstroPhotoFITSSource.execute` | Vue 侧栏占位不加载资产数据。独立 Widget 按页获取 FITS 候选，选 ID 或绝对路径。已登记 ID 走数据库位置解析，直接路径受 stat/FITS 检查；执行需要可信宿主和可用 storage。节点验证后传出 IMAGE_PATH，原科学文件保持不动。 |

## 差异与接续

- `frontend/ui/src/features/assets/AssetsPage.tsx`、`ImportDialog.tsx` 与旧 `frontend/ui/storage-host.mjs` 都属于 HEAD 的历史 React，当前 Vue 仅复用侧栏和科学 Widget 的入口。现有通用后端 list 不过滤/排序名称，历史 React 获取全部页面后在客户端筛选与排序。
- Q-01 同大小替换、Q-03 跨路径重复、Q-04 混合失败结果缺少路径级详情仍待产品决定。Q-02 恢复界面前先按 DEV 路径复核 API 写入、错误与恢复，再连接 UI。
- 科学 FITS 与导入选择的授权边界不同。可信本机科学输入可读绝对 FITS；该读取不会新建登记。正式处理产物登记在相应 Bundle 内处理。 [FITS 与 Siril 实现](../siril-fits-autostretch/04_DEV.md)
- 若 Q-02 选择恢复界面，须另行设计并实现来源选择、预检确认、分页、各阶段回执和两种位置恢复入口。现有导入错误只有序号和代码，不能展示可靠的失败文件路径；必须先决定 Q-04 的数据契约。当前技术能力及已实现内容保持上表所列范围。
- 资产缺少删除 API。现有 `PATCH /assets/{id}/sessions` 是关系解绑，不能用于清除资产记录。测试若需要通过 API 删除每条记录，需先定义资产删除对原件、受管副本、会话和既有工作流引用的语义，再将其作为实现及测试需求评审。
