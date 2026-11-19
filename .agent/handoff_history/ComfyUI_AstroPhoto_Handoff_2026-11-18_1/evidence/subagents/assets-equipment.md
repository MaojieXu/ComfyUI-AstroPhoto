# Assets / Equipment 只读源码审计

范围：`astrophoto/assets/{imports,service}.py`、`astrophoto/equipment/{schemas,service,trains,snapshots}.py`、`astrophoto/api/{assets,equipment}.py`、`astrophoto/database/{models,equipment_models}.py` 及相关测试。路径均相对仓库。先以 exact-path CodeGraph 探索，再补读其省略段；本轮子代理未运行测试，所有实现状态均为 IMPLEMENTED_UNVERIFIED，除明确标注。实际套件结果由主代理独立记录；测试代码断言不等于通过或真实宿主验收。

## Feature / 入口 / 数据流

| ID | 用户行为、入口 → 调用链 / I-O、读写副作用 | 状态与证据 |
|---|---|---|
| A-01 | 预览选择文件/目录：POST `/assets/import/preview` → `preview` → `_selection/_files/_walk`；返回模式、目标、数量、大小、剩余空间、失败数、保留原文件；遍历文件系统无资产入库。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:24`、`astrophoto/assets/imports.py:44,59,86,105` |
| A-02 | 格式处理：所有枚举项经过路径及 stat，无扩展名白名单、内容探测或科学格式校验。 | IMPLEMENTED_UNVERIFIED / NO_GUARD_FOUND；`astrophoto/assets/imports.py:59-103`；非声称 FITS 解码或元数据提取 |
| A-03 | 授权路径：选择路径 resolve 后必须位于 `ASTROPHOTO_IMPORT_ROOTS`，且不可重叠 data、cache、保留 workspace；执行时重验。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:29-42,213-217,241-245` |
| A-04 | reference：POST import 返回 operation_id，任务保存路径及文件 stat、可绑定 session；原文件不复制；按规范化路径和 size/mtime 去重，同路径改变时报错。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:118-130,204-231` |
| A-05 | copy：选择或默认 workspace，lease、空间检查、staging、checkpoint、原子发布并核对 stat，资产和 receipt 同事务写入；原件保留。不同 key 对同内容没有内容去重。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:132-163,233-269` |
| A-06 | 查询/取消/重试导入：GET `/assets/imports/{id}`、POST `.../cancel`、`.../retry`；任务逐文件 receipt，取消在非 publishing 检查，清理自有 staging；全部失败为 failed，部分成功可 completed。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:55-60`、`astrophoto/assets/imports.py:139-202`；operation 通用状态机由 backend agent 覆盖 |
| A-07 | 列表、归属：GET `/assets` 按 UUID 游标返回最多 100 条、session_ids、mode、workspace_id；PATCH session 幂等挂接/解除，session 为字符串关联，并非独立观测 session 实体。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:10-14,46-50`、`astrophoto/assets/service.py:14-21,86-112`、`astrophoto/database/models.py:28-45` |
| A-08 | 失联检查 GET availability → resolve → stat；重新定位 POST 仅外部 reference，须授权且大小相等、路径不被占，更新 path/name/mtime。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/assets.py:31-43`、`astrophoto/assets/service.py:35-41,67-84`；内容身份不作哈希验证 |
| A-09 | 工作区归属：managed location 保存 workspace_id + relative_key，resolve 经注册工作区；reference 保存 external_path/key；copy workspace 变更有 lease 与身份检查。Registry 具体策略由另一审计覆盖。 | IMPLEMENTED_UNVERIFIED；`astrophoto/assets/imports.py:132-137,233-269`、`astrophoto/assets/service.py:35-41` |
| A-10 | 设备类型：camera、primary_optics、optical_accessory、filter；创建/编辑共通字段和按类型规格、可空值；camera readout modes，filter 多 passband。 | IMPLEMENTED_UNVERIFIED；`astrophoto/equipment/schemas.py:8-29,90-155`、`astrophoto/database/equipment_models.py:11-106` |
| A-11 | 设备列表/详情/创建/更新/归档/恢复/删除：`/equipment` 系列 → EquipmentService → SQLite，Unicode casefold 搜索、游标、版本 CAS、关联使用情况。删除已引用设备拒绝。 | IMPLEMENTED_UNVERIFIED；`astrophoto/api/equipment.py:11-36,81-88`、`astrophoto/equipment/service.py:30-60,92-160` |
| A-12 | 光路列表、创建、详情、草稿保存、归档/恢复、删除：`/optical-trains` → OpticalTrainService；单可编辑配置、版本比较、设备类型检查；camera 与 primary 同时存在即 status `published`，并非发布历史。 | IMPLEMENTED_UNVERIFIED；`astrophoto/equipment/trains.py:44-76,83-97,99-194,207-212` |
| A-13 | 历史：只读 legacy revision 列表/详情、默认优先于最新 revision 作回退；保存新草稿不改旧快照；发布 revision 和设默认写入口返回 410。 | IMPLEMENTED_UNVERIFIED；旧版原需求已被本聊天明确取消多版本的后续决定取代；`astrophoto/api/equipment.py:64-78`、`astrophoto/equipment/trains.py:44-55,196-205` |
| A-14 | 设备关联与历史影响：光路配置存稳定设备 ID；详情读当前设备资料与名称，改设备即时影响当前展示；历史 snapshot 保留，引用阻止设备删除；删除光路会删除其 draft、default 和历史。资产与设备/光路关联未见实现。 | IMPLEMENTED_UNVERIFIED / 资产关联 PLANNED；`astrophoto/equipment/service.py:47-60,153-160`、`astrophoto/equipment/trains.py:44-75,83-97`、`astrophoto/database/models.py:28-45` |

## Guard 矩阵

| ID | 场景 → 校验 → 底层、失败处理/响应 | 证据 |
|---|---|---|
| GA-01 | 未授权路径 → canonical roots 包含且不与受保护路径重叠 → `SOURCE_NOT_AUTHORIZED`；无写入；执行时重验。 | `astrophoto/assets/imports.py:33-42,213-217,241-245` |
| GA-02 | 选择非列表、零或超过100、非字符串 → `INVALID_SOURCES`；目录最多10000项、最多40000访问 → `TOO_MANY_FILES`；单项不可读记录失败。 | `astrophoto/assets/imports.py:44-47,59-103` |
| GA-03 | 复制目标不存在/离线/只读/空间不足 → require/choose_space 抛错，任务记录 error，不注册资产；具体底层由 registry 审计。 | `astrophoto/assets/imports.py:105-116,125-128,145-152`；T-03 |
| GA-04 | 路径重复 reference → 相同 size/mtime skipped 并可追加 session；不同 metadata `DUPLICATE_ASSET`；NO_GUARD_FOUND 内容 hash / copy 内容去重。 | `astrophoto/assets/imports.py:220-231` |
| GA-05 | 执行中源变化 → fingerprint 比较/复制核验，`SOURCE_CHANGED`、清理 part、receipt failed；发布后 DB 异常保留 publishing 以恢复。 | `astrophoto/assets/imports.py:213-219,238-269`；T-04/T-05 |
| GA-06 | staging 所有权 marker 不匹配 → `RECOVERY_REQUIRED`，不删除他人数据；取消 checkpoint 清 part，不撤销已完成条目；publishing 阶段不抢断。 | `astrophoto/assets/imports.py:153-191,238-250` |
| GA-07 | relocate managed / size 变化 / 重复路径 → `ASSET_NOT_EXTERNAL` / `SOURCE_CHANGED` / `DUPLICATE_ASSET`；事务内拒绝；NO_GUARD_FOUND 同尺寸不同内容鉴别。 | `astrophoto/assets/service.py:67-84` |
| GA-08 | session 为空/非字符串/长度>120、asset 缺失、attached 非 bool → INVALID_REQUEST / ASSET_NOT_FOUND；数据库事务不更新。 | `astrophoto/assets/service.py:14-21,86-97`、`astrophoto/api/assets.py:46-50` |
| GA-09 | 设备/光路 JSON：未知字段、缺失、无效 UUID、非有限值或 bool 冒充数值、越界、重复 passband/组件、枚举不符 → `EQUIPMENT_VALIDATION_FAILED` 字段详情；事务前或事务回滚。 | `astrophoto/equipment/schemas.py:32-219`；数据库第二层约束 `astrophoto/database/equipment_models.py:11-155` |
| GA-10 | 设备并发更新/归档和删除 → expected_version 检查及 SQL CAS，版本不匹配 `EQUIPMENT_VERSION_CONFLICT`；引用 draft/revision 拒绝 `EQUIPMENT_REFERENCED`。 | `astrophoto/equipment/service.py:47-60,92-97,136-160` |
| GA-11 | 草稿设备缺失/类型不对、归档 train、旧 draft 版本 → validation / `EQUIPMENT_TYPE_MISMATCH` / `TRAIN_ARCHIVED` / `DRAFT_VERSION_CONFLICT`，事务回滚；已归档设备是否可新关联 NO_GUARD_FOUND（组件校验只检查存在和类型）。 | `astrophoto/equipment/snapshots.py:13-22`、`astrophoto/equipment/trains.py:169-194` |
| GA-12 | 历史不可变 → 更新/删除由 DB trigger 阻断，API 对旧写接口 410；删除 train 特意在同事务临时移除并恢复删除 trigger 后删除历史，失败回滚。 | `astrophoto/api/equipment.py:72-78`、`astrophoto/equipment/trains.py:83-97`、`astrophoto/database/equipment_models.py:162`；T-12 |
| GA-13 | 权限/HTTP → 测试覆盖 trusted local、origin、proxy、bearer 只读；不得将复合输入拒绝归因于 Comfy-User 标头；拒绝 403、格式 400、校验 422、冲突 409、历史写 410；详细实际中间件条件由 backend agent 审计。 | `tests/integration/test_equipment_api.py:25-51,63-90`；`tests/integration/test_storage_api.py:27-38,68-85` |

## 测试双向映射（均为源码断言，未在本子任务运行）

| ID | 精确函数、边界与断言 → 覆盖功能/Guard；环境 |
|---|---|
| T-01 | `tests/backend/test_storage.py:176` `test_reference_multiple_roots_mode_snapshot_and_relocation`：多目录 reference、模式快照、重复 skipped、session、失联与 relocation → A-03/04/07/08，GA-04；真实临时 SQLite/文件，submit monkeypatch。 |
| T-02 | `:202` `test_copy_override_idempotency_and_real_bytes`：字节相等、不同 inode、同 key 返回同 operation、异 payload 冲突、staging 空 → A-05/06、GA-04；真实文件/SQLite。 |
| T-03 | `:219` `test_copy_preflight_blocks_offline_read_only_full_and_unauthorized`：离线、mock 权限/空间、禁止路径，无资产 → GA-01/03。 |
| T-04 | `:241` `test_copy_detects_inflight_source_change`：checkpoint 注入改源，SOURCE_CHANGED、无资产和 staging → GA-05；真实文件、monkeypatch。 |
| T-05 | `:259` `test_copy_recovers_after_publish_before_db_commit`：SQLAlchemy after_flush 注入故障，publishing/无数据库资产，重启恢复一份文件 → A-06、GA-05/06；真实 SQLite、故障注入。 |
| T-06 | `:283` `test_cancel_partial_staging`：checkpoint 取消，cancelled、无资产、源保留、staging 清空 → A-06、GA-06；monkeypatch。 |
| T-07 | `:358` `test_reference_shared_sessions_leave_the_file_and_other_reference`：两个 session 共用资产，解绑一个保留另一个与文件 → A-07、GA-08。 |
| T-08 | `:370` `test_process_exit_during_copy_resumes_own_staging`：子进程 os._exit(77)，重启恢复 copy 并清 staging → A-06、GA-06；真实子进程/SQLite。 |
| T-09 | `tests/backend/test_equipment.py:47` `test_equipment_lifecycle_and_optional_specs`：四类型、空/false、通带顺序/ID、Unicode 搜索、版本冲突、归档恢复和删除 → A-10/11、GA-09/10；真实 SQLite。 |
| T-10 | `:87` `test_invalid_fields_never_persist`：错误类型、无穷、0、重复通带不入库 → GA-09；`:94` `test_pagination_same_model_and_rollback` 注入规格写后异常并验证名称与通带回滚 → A-11、GA-09/10。 |
| T-11 | `:117` `test_database_constraints_and_incompatible_same_version`：类型 trigger、外键和 schema 完整性；`:136` `test_incomplete_configuration_and_reference_validation`：错误设备类型、草稿保持、无 revision → A-12/13、GA-09/11。 |
| T-12 | `:148` `test_single_configuration_concurrent_save_and_live_specs`：两个线程同版本恰一冲突、设备改名实时展示、引用删除被拒、重开保持 → A-12/14、GA-10/11；`:210` legacy 默认、快照不可变及删除；`:238` 注入历史删除故障后验证 trigger 和历史回滚 → A-13/14、GA-12。 |
| T-13 | `tests/integration/test_equipment_api.py:15` `test_equipment_and_train_api_permissions_receipts_and_errors`：aiohttp TestClient/真实临时 SQLite，403、400、422、分页、201、409、410、删除 204；`:104` 路由冲突不部分注册 → A-10–14、GA-09–13；非真实 ComfyUI 宿主。 |
| T-14 | `tests/integration/test_storage_api.py:14` `test_http_storage_import_and_access_boundary`：aiohttp、临时真实文件/SQLite，授权、预览、异步 copy receipt、源字节未变 → A-01/03/05/06、GA-01/03/13；非真实宿主。 |

反向覆盖缺口：A-02 无扩展名筛选是观察到的行为，未找到通用导入必须筛选扩展名的产品要求，不能当成缺陷；A-08 同尺寸替换的身份安全、GA-11 已归档设备能否选用、目录巨大/链接竞争、真实宿主端到端以及 copy 内容去重均未见上述测试证明；不等于断言整个仓库绝无其他测试。

## 三套交接材料对照

- Chat_Handoff `FULL_CONTEXT.md:21-25,60,101`：当时报设备/光路尚无业务实现、资产默认 reference 可 copy；前者为旧快照，现行 `equipment/service.py:100-160` 和 `trains.py:79-212` 已有后端实现，后者与 `imports.py:44-57` 一致。不能从后端推断三端或真实宿主验收。
- Last_Handoff `sources/02_REQUIREMENTS.md:69,84-88` 把资产/设备持久化列为目标、包括 mount/filterwheel 等；现行仅 A-01–14 子集和四类设备，前者过时、广义目标仍未完成。
- Original_request `设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md:21-26` 四类设备、多通带、可排序配件与后端部分一致；其不可变 revision 发布及派生编辑要求与 A-13 显式 410 有历史差异；本聊天已明确取消多版本，故当前停用符合最新决策。`...Three_Tier_Engineering_Guide_v1.0.md:17-18,65-67` 要求历史/默认、将来资产关联；目前历史只读、资产关联尚无。需求文档并不证明实现或通过。

## 风险、已读与未覆盖

主要风险：旧交接的多版本需求已被本聊天明确取消的决定取代，不应据此报告当前实现缺陷；`published` 仅表示配置完整；设备当前资料非冻结历史；删除光路连带移除旧历史；导入未按格式筛选（未证明是需求缺陷），reference 身份仅路径/stat，relocate 仅 size；同一文件不同 copy 操作可多份；session 仅字符串，非完整资产领域。权限边界、operation retry 全状态、Workspace Registry 与前端/MCP 由其他代理负责，不能以本报告替代。已读取本报告引用的实现片段、测试函数与三组交接的相关片段；未逐行审核全部交接文档、模型迁移、所有 storage/path/operation 底层或其余测试；详细 GUI/宿主行为未覆盖。`设备管理与光学链路前后端需求规格.md` 按 Chat Handoff 称为空白，未当作需求事实。


## 补充：按独立 HTTP 操作拆分（均 IMPLEMENTED_UNVERIFIED，路径前缀 `/astrophoto/v1`）

| ID | 方法及路径 → 方法、输入与输出、数据或副作用 |
|---|---|
| A-15 | GET `/assets` → `list_assets` → `AssetService.list(after)`；UUID 游标，返回 assets/next，读库。`astrophoto/api/assets.py:10-14,55`、`astrophoto/assets/service.py:99-112` |
| A-16 | POST `/assets/import/preview` → `AssetImportService.preview`；sources/可选模式、workspace、session；枚举计数及空间，读取文件系统。`astrophoto/api/assets.py:24-28,57`、`astrophoto/assets/imports.py:105-116` |
| A-17 | POST `/assets/import` → `import_assets`；同前加 idempotency_key；返回 operation_id，创建并异步提交。`astrophoto/api/assets.py:17-21,56`、`astrophoto/assets/imports.py:118-130` |
| A-18 | GET `/assets/imports/{id}` → operations.status；查询 receipt。`astrophoto/api/assets.py:58`、`astrophoto/api/storage.py:99-103` |
| A-19 | POST `/assets/imports/{id}/cancel` → operations.cancel；请求取消。`astrophoto/api/assets.py:59`、`astrophoto/api/storage.py:99-103` |
| A-20 | POST `/assets/imports/{id}/retry` → operations.retry；重试任务。`astrophoto/api/assets.py:60`、`astrophoto/api/storage.py:99-103`；通用状态边界另由 backend 审计。 |
| A-21 | POST `/assets/{id}/relocate` → `AssetService.relocate(new_path)`；更新外部位置。`astrophoto/api/assets.py:31-32,61`、`astrophoto/assets/service.py:67-84` |
| A-22 | PATCH `/assets/{id}/sessions` → `set_session(session_id,attached)`；增删映射。`astrophoto/api/assets.py:46-50,62`、`astrophoto/assets/service.py:86-97` |
| A-23 | GET `/assets/{id}/availability` → `resolve_asset`；available/reason，检查文件。`astrophoto/api/assets.py:35-43,63` |
| A-24 | GET `/equipment` → `list_equipment`；type/q/archived/after/limit，返回 total/items/next。`astrophoto/api/equipment.py:11-12,83`、`astrophoto/equipment/service.py:104-119` |
| A-25 | GET `/equipment/{id}` → `get_equipment`；规格及使用情况。`astrophoto/api/equipment.py:15-16,84`、`astrophoto/equipment/service.py:121-123` |
| A-26 | POST `/equipment` → `create_equipment`；类型、名称及规格，201 与新实体，事务插入。`astrophoto/api/equipment.py:19-20,85`、`astrophoto/equipment/service.py:125-134` |
| A-27 | PATCH `/equipment/{id}` → `update_equipment`；expected_version 和修改字段；CAS 及规格更新。`astrophoto/api/equipment.py:23-24,86`、`astrophoto/equipment/service.py:136-144` |
| A-28 | DELETE `/equipment/{id}` → `delete_unused_equipment`；expected_version，成功 204；拒绝被引用。`astrophoto/api/equipment.py:34-36,87`、`astrophoto/equipment/service.py:153-160` |
| A-29 | POST `/equipment/{id}/archive` → `set_archived(...,True)`；expected_version，设置时间。`astrophoto/api/equipment.py:27-31,88`、`astrophoto/equipment/service.py:146-151` |
| A-30 | POST `/equipment/{id}/restore` → `set_archived(...,False)`；清除归档时间。`astrophoto/api/equipment.py:89`、`astrophoto/equipment/service.py:146-151` |
| A-31 | GET `/optical-trains` → `list_trains`；q/status/archived/after/limit，total/items/next。`astrophoto/api/equipment.py:39-40,90`、`astrophoto/equipment/trains.py:99-143` |
| A-32 | POST `/optical-trains` → `create_train`；名称、备注、可选 draft，201；事务插入。`astrophoto/api/equipment.py:43-44,91`、`astrophoto/equipment/trains.py:145-157` |
| A-33 | GET `/optical-trains/{id}` → `get_train`；当前配置、设备与摘要。`astrophoto/api/equipment.py:47-48,92`、`astrophoto/equipment/trains.py:44-76,159-161` |
| A-34 | DELETE `/optical-trains/{id}` → `delete_train`；expected_version，204，事务删除配置和旧历史。`astrophoto/api/equipment.py:51-53,93`、`astrophoto/equipment/trains.py:83-97` |
| A-35 | GET `/optical-trains/{id}/draft` → `get_draft`；读取 draft，可为空。`astrophoto/api/equipment.py:56-57,94`、`astrophoto/equipment/trains.py:163-166` |
| A-36 | PUT `/optical-trains/{id}/draft` → `save_draft`；draft、expected_draft_version，更新配置并返回版本。`astrophoto/api/equipment.py:60-61,95`、`astrophoto/equipment/trains.py:169-194` |
| A-37 | GET `/optical-trains/{id}/revisions` → `list_revisions`；读取历史列表。`astrophoto/api/equipment.py:64-65,96`、`astrophoto/equipment/trains.py:196-201` |
| A-38 | GET `/optical-trains/{id}/revisions/{revision_id}` → `get_revision`；读取校验过的历史快照。`astrophoto/api/equipment.py:68-69,98`、`astrophoto/equipment/trains.py:21-35,203-205` |
| A-39 | POST `/optical-trains/{id}/revisions` → `legacy_revision_write`，410；本聊天已取消多版本，停用为预期。`astrophoto/api/equipment.py:72-73,97` |
| A-40 | PATCH `/optical-trains/{id}/revisions/{revision_id}` → 检查存在后 `REVISION_IMMUTABLE`，409。`astrophoto/api/equipment.py:76-78,99` |
| A-41 | DELETE `/optical-trains/{id}/revisions/{revision_id}` → 同 A-40；409。`astrophoto/api/equipment.py:76-78,100` |
| A-42 | PUT `/optical-trains/{id}/default-revision` → `legacy_revision_write`，410；停用为预期。`astrophoto/api/equipment.py:72-73,101` |
| A-43 | POST `/optical-trains/{id}/archive` → `set_archived(...,True)`，版本 CAS。`astrophoto/api/equipment.py:27-31,102`、`astrophoto/equipment/trains.py:207-212` |
| A-44 | POST `/optical-trains/{id}/restore` → `set_archived(...,False)`，版本 CAS。`astrophoto/api/equipment.py:103`、`astrophoto/equipment/trains.py:207-212` |

归档关联精确结论：`validate_train_components` 对每个请求中 ID 仅检查设备存在及类型，完全不检查 `archived_at_utc` 或此前草稿；因此 **所有已归档设备均可在后端新加入或继续关联**，而不只是保留已关联者（`astrophoto/equipment/snapshots.py:13-22`、`astrophoto/equipment/trains.py:169-176`）。此为源码推断，未进行实际调用，也不自动认定是违反需求。

权限精确边界：资产路由经 storage handler，要求可信本机部署、loopback remote/Host、无代理转发、同源 Origin/Fetch，且 `X-AstroPhoto-Local: 1`；设备路由同样要求直接本机，浏览器写/读须同源 Fetch 与本地标头；Bearer 仅 GET，不能带 Origin/Fetch，token 为 43–256 ASCII 字母数字或 `-_`；不识别其他本地进程。`astrophoto/api/routes.py:24-35`、`astrophoto/api/security.py:18-63`、`astrophoto/api/storage.py:106-110`。本机信任而非用户级隔离，`Comfy-User` 本身未被 security.py 检查：测试中的该 header 拒绝案例同时缺少设备必需 Fetch 标头或发生在 trusted_local=False，不能归因于该 header；handler 限制 JSON 体 65536 字节并映射错误（`astrophoto/api/storage.py:112-172`）。

格式需求纠正：`Chat_Handoff/FULL_CONTEXT.md:614` 将格式当独立字段，Siril 专项 `AstroPhotoFlow_Siril_Handoff_2026-11-18/04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:28` 要求 FITS 单图实际有效而不能仅靠扩展名；它适用于专门的 FITS 路径，不能推导通用导入必须使用扩展名白名单。A-02 只是通用导入无过滤的事实，未证明白名单是产品要求。尚未逐字搜索全部资料，需求真实性范围有限。

专业规格和 DB 补充：相机支持 sensor_name/kind、宽高 px、像素 x/y、Bayer、ADC、冷却、bin x/y、最多32 readout modes；主光学含 kind/design、口径、焦距、f ratio、像圈、备注；配件含 kind、factor、backfocus、clear aperture、备注；滤镜含 kind、尺寸、format、最多32 passbands，通带 label 唯一、center/fwhm 可空，顺序持久化。数值有限，普通值 >0，backfocus 可为0；整数上限宽高 1000000、ADC 64、bin 1024；readout gain/offset 为 -1000000..1000000 且最小不大于最大。`astrophoto/equipment/schemas.py:8-29,80-155`。设备规格表通过 FK 和正值/枚举约束；passband 每 filter 的位置与标签唯一；revision 每 train 的编号和幂等键唯一，复合 FK 限定同 train 的 base/default。trigger 禁止历史 UPDATE/DELETE/冲突 REPLACE，禁止改设备类型，规格 INSERT/UPDATE 与设备类型匹配；`astrophoto/database/equipment_models.py:11-185`。删除 train 暂时 DROP 后重建删除 trigger 处在写事务中，回滚依赖 T-12 源码测试，尚无本轮测试结果。

## 精确测试函数补充与未匹配

以下每行是一条函数而非聚合，均未在本子任务执行；此前 T-01–14 中被合并的函数以此拆开：

- `tests/backend/test_equipment.py:47 test_equipment_lifecycle_and_optional_specs` → A-24–30；四类型及 passband、版本、归档恢复；真实 SQLite。
- `:87 test_invalid_fields_never_persist` → A-26/27、GA-09；参数化坏规格无记录。
- `:94 test_pagination_same_model_and_rollback` → A-24/26/27；分页和 monkeypatch 写后失败回滚。
- `:117 test_database_constraints_and_incompatible_same_version` → GA-09/12；SQLite FK/type trigger 及 schema 完整性。
- `:136 test_incomplete_configuration_and_reference_validation` → A-32/36；不完整、错类型及回滚。
- `:148 test_single_configuration_concurrent_save_and_live_specs` → A-33/36；双线程冲突、实时设备名、关联禁止删除、重启。
- `:210 test_existing_default_loads_without_rewriting_legacy_history` → A-33/34/36–38；种植 legacy，默认优先、历史不可变、删除。
- `:238 test_legacy_train_delete_rolls_back_history_and_trigger` → A-34、GA-12；SQLAlchemy 事件注入故障，回滚 trigger/历史。
- `tests/integration/test_equipment_api.py:15 test_equipment_and_train_api_permissions_receipts_and_errors` → A-24–44 的部分路径和 GA-13；aiohttp TestClient、真实临时 SQLite，并未逐个调用每一条路径。
- `:104 test_equipment_route_conflict_has_no_partial_registration` → 路由注册冲突，非运行时设备操作。
- `tests/backend/test_storage.py:176 test_reference_multiple_roots_mode_snapshot_and_relocation` → A-17/21/23。
- `:202 test_copy_override_idempotency_and_real_bytes` → A-17/18。
- `:219 test_copy_preflight_blocks_offline_read_only_full_and_unauthorized` → A-16/17。
- `:241 test_copy_detects_inflight_source_change` → A-17/18。
- `:259 test_copy_recovers_after_publish_before_db_commit` → A-17/18，注入故障。
- `:283 test_cancel_partial_staging` → A-19，注入取消。
- `:358 test_reference_shared_sessions_leave_the_file_and_other_reference` → A-22。
- `:370 test_process_exit_during_copy_resumes_own_staging` → A-17/18，真实子进程崩溃。
- `:419 test_reject_links_unc_and_relative_paths` → GA-01 路径原语；Windows symlink 不可用时 junction。
- `:442 test_reference_on_distinct_windows_volumes` → A-17 跨盘，环境变量缺失会 skip，不能宣称覆盖运行。
- `tests/integration/test_storage_api.py:14 test_http_storage_import_and_access_boundary` → A-15–18；aiohttp 测试服务器和临时文件。
- `:92 test_invalid_storage_config_preserves_status_route` → 配置错误 status 降级和保留用户文件；模拟 extension，非真实宿主。

同文件未映射到资产/设备功能的函数：`tests/backend/test_storage.py` 的 `test_first_start_and_reentry`、`test_bootstrap_interrupted_after_database_commit`、`test_never_replaces_an_existing_asset_database`、`test_multi_process_bootstrap`、`test_foreign_keys_busy_rollback_and_backup`、`test_multiple_workspaces_default_disable_and_offline_relocation`、`test_cache_owner_entries_only_with_live_lease`、`test_migration_recovers_around_database_switch`、`test_migration_actual_cross_volume`、`test_migration_verification_error_keeps_source`、`test_explicit_wal_failure_has_no_fake_ready`、`test_legacy_dev_schema_is_preserved` 主要属于通用 storage/database/cache/migration，由 backend agent 覆盖，未逐一映射。`tests/backend/test_siril.py:155,192` 和 `tests/integration/test_siril_api.py` 间接使用 Asset，属 Siril 审计，不在此宣称完整核验。独立 HTTP A-20、A-25、A-28–30、A-35、A-38、A-40–44 尚未在以上逐个测试的断言中明确匹配；需由主审计补查，不能把整体集成测试等同于逐端点覆盖。

