# 后端公共层审计证据（2026-11-18）

## 范围、方法与状态

本次只读审计工作树 `main`，HEAD `5e39fcf352995918c3ba3d06b88cd61a2cbeca1a`；`git status --short` 显示大量已修改及未跟踪文件，包括本范围源码，故以下为工作树证据，不代表 HEAD。`.codegraph/` 存在，首先用 exact-path `codegraph explore` 查询入口及 API、storage/database；然后直接核对磁盘源码和测试。没有修改生产代码或测试。本子代理未运行测试；下表实现状态统一为 **IMPLEMENTED_UNVERIFIED**，表示本轮尚无可归属的运行证据，不表示通过。Host、跨卷、竞态、崩溃的完整验收不可由源码推断。Assets/Equipment 业务细节归其他审计，本表只包括公共接口和数据库约束。

覆盖文件：`__init__.py`、`astrophoto/bootstrap.py`、`astrophoto/core/{capabilities,config,errors,paths}.py`、`astrophoto/database/{manager,models,equipment_models}.py`、`astrophoto/database/migrations/{env.py,versions/0001_equipment_baseline.py}`、`astrophoto/storage/{runtime,initializer,locations,paths,manager,migration,operations,cache}.py`、`astrophoto/api/{routes,security,errors,status,storage}.py`。测试定位 `tests/backend/{test_core,test_status,test_storage}.py`、`tests/integration/{test_status_api,test_storage_api,test_host_runtime}.py`、`tests/nodes/test_registration.py`；这些测试以实际断言为准，未逐条执行。`api/assets.py`、`api/equipment.py`、`api/siril.py` 的业务操作在其他审计范围，公共 wrapper 在此。

## Feature 与调用链

| ID | 用户行为/输入 → 输出；调用、写入及副作用 | 证据 | 关联测试 |
|---|---|---|---|
| B-01 | 启动宿主 → V3 节点列表、注册一次路由；已存在标记 runtime 则复用，否则线程执行 `host_runtime`，评估可信部署后注册；没有在 import 初始化。 | `__init__.py:12`, `__init__.py:29`, `astrophoto/bootstrap.py:49` | T01 T02 T03 |
| B-02 | 设置 `ASTROPHOTO_HOME` → 绝对本地数据根；无效配置回退默认但标记 `INVALID_STORAGE_PATH`，不尝试初始化；其他初始化异常记录并降级。版本来自根 pyproject。 | `astrophoto/core/paths.py:10`, `astrophoto/core/config.py:30`, `astrophoto/bootstrap.py:36` | T01 T04 |
| B-03 | 首启或重启 → 锁住数据根，创建/检查 manifest、settings、SQLite、默认 Workspace、Cache marker；创建完成后原子标记 initialized，再恢复 runs 和未完成 operation。异常并不伪装 ready。 | `astrophoto/storage/runtime.py:46`, `astrophoto/storage/runtime.py:56`, `astrophoto/storage/initializer.py:41`, `astrophoto/storage/initializer.py:53`, `astrophoto/storage/initializer.py:75` | T05 T06 T07 T08 |
| B-04 | SQLite 打开、建库/检查、备份 → `DatabaseManager` 通过 Alembic baseline，外键、busy timeout、FULL 和 WAL；事务 context 异常回滚；health 验证 revision、schema、identity 和 WAL；备份到独立目标。旧/不符 schema 不自动删除。 | `astrophoto/database/manager.py:27`, `astrophoto/database/manager.py:52`, `astrophoto/database/manager.py:64`, `astrophoto/database/manager.py:111`, `astrophoto/database/manager.py:120`, `astrophoto/database/manager.py:128`, `astrophoto/database/manager.py:144` | T07 T09 T10 |
| B-05 | 查状态 → 未经 storage wrapper 的公共 GET status 输出 extension/version、注册状态、data_home、能力；数据库失败或节点/路由未注册则 degraded。不能证明实际执行成功。 | `astrophoto/api/status.py:11`, `astrophoto/core/capabilities.py:4` | T02 T11 |
| B-06 | GET `/storage` → wrapper 授权 → `snapshot` → DB health、settings、Workspace status、Cache status 和最近 operation；不可信请求返回不可用且不披露工作区。 | `astrophoto/api/storage.py:38`, `astrophoto/storage/runtime.py:94`, `astrophoto/api/storage.py:112` | T12 |
| B-07 | PATCH storage/settings 输入 revision、imports/workspace/cache → 验证后锁内比对 revision、原子写 settings 并递增 revision；冲突不写。 | `astrophoto/api/storage.py:45`, `astrophoto/storage/runtime.py:76`, `astrophoto/core/config.py:132` | T12 T13 |
| B-08 | 注册 Workspace path/name → 路径规范/无重叠、空目录所有权 marker、建立 objects/outputs/.staging、写 DB；中断后仅相同实例 marker 且无业务数据可重入。 | `astrophoto/api/storage.py:58`, `astrophoto/storage/locations.py:64`, `astrophoto/storage/locations.py:75`, `astrophoto/storage/locations.py:100` | T12 T13 |
| B-09 | 更新名称、启停、设默认、校验 → lease+lock/revision，默认不能停；验证在线且 staging 可创建临时文件。状态包括 offline、identity_mismatch、read_only、disabled、migrating、error。 | `astrophoto/storage/locations.py:124`, `astrophoto/storage/locations.py:151`, `astrophoto/storage/locations.py:173` | T12 T13 |
| B-10 | 重定位离线 Workspace → 原路径 marker 不匹配/不存在，目标必须同实例同 workspace marker，再 DB 重绑；仅改变引用，不移动文件。删除只删注册记录；默认、有资产或活动操作拒绝，目录保留。 | `astrophoto/storage/locations.py:202`, `astrophoto/storage/locations.py:219`, `astrophoto/storage/locations.py:236` | T12 T13 |
| B-11 | 修改 Cache 路径/上限 → 校验 revision、路径和 marker；新目录 claim 后原子更新配置，旧 cache 保留而非搬运。 | `astrophoto/api/storage.py:84`, `astrophoto/storage/cache.py:156` | T14 |
| B-12 | 写/读/清 Cache → 只在命名 bucket 存 UUID 文件并保存身份描述；预算和磁盘检查；清除仅验证单硬链接、完整 marker 的文件，锁冲突跳过，返回 removed/skipped/failed；Siril scratch 限已知名称清理。 | `astrophoto/storage/cache.py:35`, `astrophoto/storage/cache.py:54`, `astrophoto/storage/cache.py:75`, `astrophoto/storage/cache.py:80`, `astrophoto/storage/cache.py:124`, `astrophoto/storage/cache.py:175` | T14 |
| B-13 | 请求迁移 workspace 到空目标及幂等 key → 复用相同请求 operation，不同请求同 key 冲突，检查 active operation，创建 queued 并异步 submit。 | `astrophoto/api/storage.py:93`, `astrophoto/storage/migration.py:24`, `astrophoto/storage/migration.py:31`, `astrophoto/storage/operations.py:29` | T15 T16 |
| B-14 | 迁移 preparing/copying/verifying → lease、盘点对象/输出，要求 staging 空、引用文件存在、足量空间；每文件复制到 part、校验 SHA256 并发布，保存 receipt；二次盘点并核对原始指纹及 hash。 | `astrophoto/storage/migration.py:48`, `astrophoto/storage/migration.py:75`, `astrophoto/storage/migration.py:83`, `astrophoto/storage/migration.py:103`, `astrophoto/storage/manager.py:37` | T15 T16 |
| B-15 | 迁移 publishing/committed → 写目标 workspace marker；锁内同一 SQLite 事务 rebind 及 operation committed；恢复 committed 后验证目标、移除自有 migration marker、completed。旧源保留；失败不会声称回滚已经发布的文件。 | `astrophoto/storage/migration.py:134`, `astrophoto/storage/migration.py:143`, `astrophoto/storage/migration.py:150`, `astrophoto/storage/migration.py:158` | T15 T16 |
| B-16 | 查询/取消/重试 operation → status 去除私有 receipt 字段；非终态且非 committed 标记 cancel，checkpoint 抛取消；启动重投非终态，可能保留 checkpoint 和中间文件供恢复；committed 不可取消。 | `astrophoto/storage/operations.py:51`, `astrophoto/storage/operations.py:76`, `astrophoto/storage/operations.py:90`, `astrophoto/storage/operations.py:110`, `astrophoto/storage/operations.py:116` | T15 T17 |
| B-17 | HTTP 路由注册与公共错误 → status route ownership 检查、冲突拒绝，其他 definitions 经共享 wrapper；授权、JSON、资源可用性、异常分类后回 request_id/no-store；I/O 及业务 action 离开事件循环。 | `astrophoto/api/routes.py:15`, `astrophoto/api/storage.py:106`, `astrophoto/api/errors.py:14` | T02 T12 |
| B-18 | HTTP 身份边界 → 只有显式开启并 listen 全回环、无 multi-user/CORS 的环境才可信；检查 remote、host、origin、Fetch-Site、forwarded 和专用 header；设备只读 bearer 为单独路径。公开 status 不走此授权。 | `astrophoto/api/security.py:18`, `astrophoto/api/security.py:25`, `astrophoto/api/security.py:42`, `astrophoto/api/security.py:46`, `astrophoto/api/status.py:26` | T12；设备专测见其他审计 |

## 数据库表与约束

`assets.db` 当前唯一创建的业务库；knowledge/memory 返回 not_initialized（`astrophoto/database/manager.py:128`）。SQLAlchemy 表：`storage_identity` 单行 id=1 且 instance 唯一；`storage_locations` canonical_root 唯一；`assets`；`asset_sessions` 复合主键和 asset FK；`asset_locations` FK、workspace+relative 唯一，external 和 managed 字段互斥 check；`storage_operations` kind+key 唯一且 kind 限 import/migration（`astrophoto/database/models.py:11`, `:18`, `:28`, `:36`, `:42`, `:62`）。Equipment 表在 `astrophoto/database/equipment_models.py:11`：equipment 类型/名称/版本检查；camera_specs、primary_optics_specs、optical_accessory_specs、filter_specs 各有 equipment FK 和数值/类型检查；camera_readout_modes 的 camera+mode 唯一及上下界；filter_passbands 的 filter+label/position 唯一；optical_trains、revisions、drafts、defaults 的 FK、版本、JSON 及复合唯一/复合 FK；类型 trigger `:162`。baseline DDL `astrophoto/database/migrations/versions/0001_equipment_baseline.py:8`；精确 schema SQL 比对而非任意向前迁移（`astrophoto/database/manager.py:111`），未知版本须人工处理。上述 schema 不意味着 Equipment 业务在本审计已验收。

## Guard 矩阵

| ID | 场景 → 验证 → 业务/底层 → 异常或清理 → 表现 |
|---|---|
| GB-01 | 请求部署身份 → env 开关、listen 均回环、禁 multi-user/CORS → remote/Host/Origin/forwarded/Fetch-Site → 拒绝 → 403；storage snapshot 特例为 unavailable 200。`astrophoto/api/security.py:18`, `:25`, `astrophoto/api/storage.py:115`；T12。 |
| GB-02 | 设备 bearer → 仅 GET、无 Origin/Fetch-Site、43–256 ASCII token 且 constant-time 比较；浏览器路径要求 same-origin 与专用 header；不识别其他本地进程。`astrophoto/api/security.py:46`, `:60`；设备测试另查。 |
| GB-03 | 非 JSON、超 65536 字节、非法 JSON、字段缺失/多余、非 canonical UUID → wrapper/DTO 拒绝 → `INVALID_REQUEST`；普通 storage 422，equipment 400。`astrophoto/api/storage.py:23`, `:32`, `:132`, `astrophoto/api/errors.py:33`；未逐项找到本范围断言。 |
| GB-04 | 路径相对、UNC、链接/reparse、穿越、跨保留根重叠 → `checked_path`/`canonicalize_root`/`safe_join_workspace` 及 candidate 拒绝；底层不创建业务文件。`astrophoto/storage/paths.py:12`, `:39`, `:60`, `:77`, `:83`, `astrophoto/storage/locations.py:64`；T13 T18。 |
| GB-05 | 磁盘不足/权限不足/满盘 → `choose_space`、读写异常 → `INSUFFICIENT_DISK_SPACE` 507 或 `STORAGE_PATH_UNWRITABLE` 422；operation 可保留 checkpoint。`astrophoto/storage/manager.py:37`, `astrophoto/api/storage.py:154`, `astrophoto/storage/operations.py:126`；T19。 |
| GB-06 | 重复/并发修改 → 进程锁、workspace lease、revision 与唯一键；锁超时/active 为 busy，revision conflict 409；SQLite 事务异常回滚。`astrophoto/storage/locations.py:32`, `:36`, `:173`, `astrophoto/storage/operations.py:29`, `astrophoto/database/manager.py:120`；T08 T09 T13。 |
| GB-07 | 默认 Workspace 停用/删除，含资产删除，原路径仍在线重定位，目标 marker 不符 → 拒绝，不删除目录或重绑定。`astrophoto/storage/locations.py:173`, `:202`, `:219`；T12 T13。 |
| GB-08 | 迁移目标非空、未知源内容、staging 未恢复、引用丢失、源变动或 hash 不一致 → 在切换前失败，源保留；失败目标可留自有数据。`astrophoto/storage/migration.py:24`, `:48`, `:75`, `:134`；T16。 |
| GB-09 | 迁移取消和进程中断 → checkpoint/锁+持久 operation；提交后只恢复完成，不可撤销；复制阶段中间文件不保证被删除。`astrophoto/storage/operations.py:76`, `:90`, `:110`, `:126`, `astrophoto/storage/migration.py:150`；T15 T17。 |
| GB-10 | Cache 清理非自有文件、硬链接、正在使用条目、错误 marker → 不删或跳过；范围只能已知 bucket/all；scratch 只处理匹配且拥有 marker 的已知名称。`astrophoto/storage/cache.py:35`, `:80`, `:175`；T14。 |
| GB-11 | 库丢失、损坏、revision 不匹配、WAL 不可用 → 保留既有文件、错误或 degraded，不创建假 ready；schema 校验包含模型及 trigger。`astrophoto/database/manager.py:64`, `:111`, `:128`；T07 T10。 |
| GB-12 | 公共 status 的本地绝对 data_home → **NO_GUARD_FOUND**：`status_handler` 直接返回 `status_payload`，不经过存储授权或 no-store wrapper（`astrophoto/api/status.py:11`, `:26`）。是否适合远程部署需单独评估。 |

## 双向测试矩阵（源码断言，未运行）

| ID / 精确测试 | 核对的实际断言与性质 | Feature/Guard |
|---|---|---|
| T01 `tests/backend/test_core.py:11`, `:24`, `:31` | import/config 不建立目录、默认路径、无效路径；临时文件/单元 | B-01 B-02 |
| T02 `tests/integration/test_status_api.py:14`, `:36` | 同一 status route、degraded→ok、DB 存在；ownership 冲突、server 隔离；aiohttp + 宿主替身 | B-01 B-05 B-17 |
| T03 `tests/nodes/test_registration.py:4` | V3 定义与注册替身；不能证明真实宿主 | B-01 |
| T04 `tests/integration/test_storage_api.py:92` | 无效根保留已有文件，status 200 degraded，storage 不可用而 drawing 可用 | B-02 |
| T05 `tests/backend/test_storage.py:52` | 首启重入同 workspace/instance、reference 默认、cache 20、只创建 assets.db、WAL/FK；真实临时 SQLite/FS | B-03 B-04 |
| T06 `tests/backend/test_storage.py:64` | monkeypatch cache 初始化失败后重入，instance 和初始 workspace 保持；真实 FS + 故障注入 | B-03 |
| T07 `tests/backend/test_storage.py:85` | manifest/settings/db 缺失、损坏、revision 不匹配均报预期码，保留文件字节 | B-03 B-04 GB-11 |
| T08 `tests/backend/test_storage.py:103` | 两真实子进程同时启动均成功且 instance 相同 | B-03 GB-06 |
| T09 `tests/backend/test_storage.py:116` | FK 错误回滚、双连接写锁、备份 integrity_check 和默认位置 | B-04 GB-06 |
| T10 `tests/backend/test_storage.py:463`, `:482` | 强制 WAL 失败不建表；旧 dev schema 不重置且 DB 字节相同 | B-04 GB-11 |
| T11 `tests/backend/test_status.py:6` | 能力跟随注册而非规划 | B-05 |
| T12 `tests/integration/test_storage_api.py:14` | 真 aiohttp TestServer，拒绝无权限/代理；可信快照、注册/校验/停用/删除（目录仍在）、设置冲突、导入和源不变；本地部署依赖模拟 | B-06–B-10 B-17 B-18 GB-01 GB-07 |
| T13 `tests/backend/test_storage.py:135` | 多 Workspace、嵌套及 cache 重叠拒绝、停用、离线及错误身份重定位、重启保留路径 | B-07–B-10 GB-04 GB-06 GB-07 |
| T14 `tests/backend/test_storage.py:161` | 更换 Cache 后旧数据保留；持锁文件跳过，未知及正式 Workspace 文件保留，只有自有文件删除 | B-11 B-12 GB-10 |
| T15 `tests/backend/test_storage.py:301` | 参数化 DB switch 周围故障恢复到 completed、路径重绑、源数据及 marker 保留；mock 故障 + 真 DB/FS | B-13–B-16 GB-09 |
| T16 `tests/backend/test_storage.py:342`, `:400` | 实际跨盘测试仅在 `ASTROPHOTO_TEST_SECOND_VOLUME` 提供时执行，否则 skip；hash 故障后 failed、旧根和字节保留、不写目标 workspace marker | B-13–B-15 GB-08 |
| T17 `tests/backend/test_storage.py:283`, `:370` | 取消部分 staging、模拟子进程退出及恢复 import；不能直接证明迁移各阶段取消的所有效果 | B-16 GB-09（部分） |
| T18 `tests/backend/test_storage.py:419` | 拒绝 links/UNC/相对路径及不应创建文件 | GB-04 |
| T19 `tests/backend/test_storage.py:219` | 导入 preflight 覆盖 offline/read-only/full/unauthorized 的错误；不是迁移全过程磁盘满测试 | GB-05（部分） |
| T20 `tests/integration/test_host_runtime.py:11` | 实际宿主需环境配置；本次未运行或获得结果，不能视为 Host 验收 | B-01 B-05 |

其他 `tests/backend/test_storage.py:176`, `:202`, `:241`, `:259`, `:358`, `:442` 主要覆盖资产 reference/copy、幂等、源变化、发布前后恢复、共享 session 和可选第二卷；资产业务由其他审计关联。本矩阵不声称已经覆盖全部错误/取消组合。

## 三套交接差异与风险

- `Last_Handoff/sources/01_CURRENT_STATE.md:5` 是历史快照，将 Assets/数据库列 PLANNED，且最小路由只有 status；当前 `database/models.py:11`、`storage/runtime.py:46`、`api/routes.py:24` 已有实现，历史状态 **OBSOLETE**，不能推断本轮 VERIFIED。
- `Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/08_WORKSPACE_SECURITY_AND_LIFECYCLE.md:60` 要求路径、允许根、权限、生命周期安全和多盘验证；当前已有本地路径、marker 和回环边界，但用户身份/远程授权不在现有模型内，真实多盘及竞态仍须运行验证。
- `Original_request/Siril_Integrate/AstroPhotoFlow_Siril_1.4.5_AutoStretch_Engineering_Development_Guide_v1.0.md:441` 要复用现存数据根、外置 Workspace 和独立 Cache，不强制搬迁原图；Cache configure 实际是切换新目录并保留旧数据，并非迁移旧 cache（B-11）。同文 `:682` 反对静默删除旧数据，当前 schema 不兼容时要求人工 reset 而非自动迁移（B-04）。
- 公共 status 返回物理 `data_home` 且不使用存储授权，远程暴露有信息披露风险；其是否违反部署策略取决于宿主网络配置（GB-12）。单用户 loopback 并不识别其他本地进程（`astrophoto/api/security.py:55`）。
- 对迁移失败/取消，不应笼统宣称跨文件系统事务回滚或自动清除所有目标数据；source 保留、checkpoint 可继续，已提交不能取消。全阶段恢复、目标清理、恶意路径竞态、磁盘满、真实 Windows 第二卷及宿主需要本轮专项证据。
- 本子代理未取得主代理的综合套件结果；本文件不把历史报告或测试源码等同本轮测试通过。未完成逐个函数的测试断言穷举以及逐表每列约束复核，相关结论为部分审计而非完整验收。

## 补充：逐项存储 API 和功能边界

状态仍为 IMPLEMENTED_UNVERIFIED，除非另列本轮运行证据。路径前缀均 `/astrophoto/v1`。所有下列 storage 请求先经 `handler` 授权，再检验 body 并以线程执行（`astrophoto/api/storage.py:106`）；错误经 `astrophoto/api/errors.py:14`，具体 UI 显示另见前端审计。

| Feature | 方法与输入 → 实际处理、返回及测试 |
|---|---|
| B-19 | GET `/storage` → `snapshot`；未授权特例 200 unavailable、不含路径；已授权检查 DB、工作区、Cache 和最近任务，200。T12。`astrophoto/api/storage.py:38` |
| B-20 | PATCH `/storage/settings` revision 必填，至少一个 imports/workspace/cache → `update_settings` 原子替换文件；错误 revision 409。T12。`astrophoto/api/storage.py:45`, `astrophoto/storage/runtime.py:76` |
| B-21 | POST `/storage/locations` path/name → 候选路径、空目录 claim、创建私有目录及 DB row，201；认领成功但 DB 写失败时标记可能残留，重入仅认可同实例且空布局。T12 T13。`astrophoto/storage/locations.py:75`, `:100` |
| B-22 | PATCH `/storage/locations/{id}` revision 和 name/enabled/default → revision 校验、DB 更新或单独原子设默认；default 不可与名称/启停同时提交，默认位置不可停。T12 T13 部分。`astrophoto/api/storage.py:63`, `astrophoto/storage/locations.py:173` |
| B-23 | POST `/storage/locations/{id}/validate` → 租约、状态和 `.staging` 临时文件探测；只返回状态，不修复。T12。`astrophoto/storage/locations.py:151` |
| B-24 | POST `/storage/locations/{id}/relocate` new_path → 原 marker 不在且目标身份匹配才 DB rebind；不搬运文件。T13；HTTP 路由成功及失败本文件未断言。`astrophoto/storage/locations.py:202` |
| B-25 | DELETE `/storage/locations/{id}` expected_revision → 检查默认、引用、活动任务后只删 DB 行、保留目录。T12 验证保留目录；含资产、活动任务和 revision 的 HTTP 失败未验证。`astrophoto/storage/locations.py:219` |
| B-26 | POST `/storage/cache/configure` path/max_size_gb/revision → 认领空目标或核验同目标；写配置，不复制/删除旧条目。T14；新 marker 创建后设置文件写失败可能留下已认领目录，未找到对应故障测试。`astrophoto/storage/cache.py:156` |
| B-27 | POST `/storage/cache/clear` scope → 仅带正确实例/条目 marker 的普通单链接文件，可锁时删数据再删 descriptor，返回统计。T14；descriptor unlink 失败可能留下孤儿描述，计 failed，非文件级事务。`astrophoto/storage/cache.py:175` |
| B-28 | cache producer `store` → bucket 检查、预算和剩余盘空间、独占创建、fsync、原子写 descriptor；descriptor 写失败可留下未被 `_entries` 认领的孤儿文件。未找到该窗口专项测试。`astrophoto/storage/cache.py:35`, `:54` |
| B-29 | cache `read_entry` → 检查桶/名称/root marker，条目锁、普通文件/单链接和身份描述，返回 bytes 或 validate-only；无效 `PREVIEW_NOT_FOUND`。本范围无独立断言。`astrophoto/storage/cache.py:124` |
| B-30 | cache scratch → registry 锁、预算、独占临时目录/锁和 owner marker；上下文退出清临时目录；启动使用时只清自己 marker 下固定 Siril 文件，未知内容保留。异常/崩溃完整矩阵未验证。`astrophoto/storage/cache.py:80`, `:103` |
| B-31 | POST `/storage/migrations` workspace_id/target_path/idempotency_key → UUID/字段、键复用及请求一致性、目标空闲、没有活动 workspace 操作，202 返回 operation_id。T15 为服务层成功/故障，HTTP 迁移提交未断言。`astrophoto/api/storage.py:93`, `astrophoto/storage/migration.py:31` |
| B-32 | GET `/storage/migrations/{id}` → 校验 UUID 和 kind，返回 phase、公开 receipt、cancel/error；不存在 404。`astrophoto/storage/operations.py:51`, `:58`。独立 HTTP 错误测试未找到。 |
| B-33 | POST `/storage/migrations/{id}/cancel` → 非终态且非 committed 设置 cancel_requested、提交 worker；在 checkpoint 变 cancelled；committed/终态不撤销。`astrophoto/storage/operations.py:76`, `:90`。本范围仅 import 取消 T17，不代表迁移所有阶段取消通过。 |
| B-34 | POST `/storage/migrations/{id}/retry` → 非终态清 error 并 submit，终态仅回状态；HTTP 定义 202，不保证已重新执行。`astrophoto/storage/operations.py:83`, `astrophoto/api/storage.py:176`。未找到独立 HTTP 断言。 |
| B-35 | 恢复 operation → 启动重新提交所有非终态；进程内 `_scheduled` 去重和进程间 FileLock；锁未取得直接返回，后续恢复/重试依赖另一次触发。`astrophoto/storage/operations.py:94`, `:110`, `:116`；T15 T17（不同 worker）。 |
| B-36 | 路由 ownership → status 冲突若无本插件 runtime 拒绝；若有则重用并更新 node callback；预先检查其他路由冲突，避免本次部分注册。`astrophoto/api/routes.py:15`；T02。 |
| B-37 | HTTP 错误映射 → 身份/来源 403、找不到 404、冲突 409、锁 423、空间不足 507、初始化/schema/WAL 503，其余请求错误通常 422，equipment INVALID_REQUEST 400；意外异常 500 且记录 request_id。`astrophoto/api/errors.py:14`, `astrophoto/api/storage.py:146`；T12 只覆盖部分状态。 |

## 补充：每张表的主约束及持久性

数据库建表由 `0001_equipment_baseline.py:8` 的 Alembic baseline 提供；`DatabaseManager.expected_schema` 用 SQLAlchemy metadata 和 trigger SQL 做严格比较（`astrophoto/database/manager.py:34`, `:111`）。`Mapped[T]` 非可选列由模型产生 NOT NULL；可选列允许 NULL，SQLite CHECK 对 NULL 不等于拒绝。以下行号均指 `astrophoto/database/models.py` 或 `astrophoto/database/equipment_models.py`。

| 表 | 主键、唯一、引用、检查及索引 | 行 |
|---|---|---|
| storage_identity | id PK 且 id=1，instance_id UNIQUE | models.py:11 |
| storage_locations | id PK，canonical_root UNIQUE；enabled/revision 默认 true/0；无数据库级路径重叠检查，应用层承担 | models.py:18 |
| assets | id PK，名称、size、mtime 非空；未见 size 非负 CHECK | models.py:28 |
| asset_sessions | (asset_id,session_id) 复合 PK；asset_id FK，session_id 索引 | models.py:36 |
| asset_locations | id PK，asset FK 和 workspace FK/索引，external_key UNIQUE，(workspace_id,relative_key) UNIQUE；CHECK 强制 external_reference 或 managed 两组字段互斥 | models.py:42 |
| storage_operations | id PK，(kind,key) UNIQUE；kind 只能 import/migration；phase 索引，request/plan/receipt JSON；phase 无枚举 CHECK | models.py:62 |
| equipment | id PK，type 四选一，trim name 1–120，row_version≥1，name 与 type/archive 索引；type 更新 trigger 禁止 | equipment_models.py:11, :174 |
| camera_specs | equipment_id PK/FK，sensor kind 枚举、像素尺寸/位深/bin 值为正，cooling bool 检查；type trigger 要求 camera | equipment_models.py:31, :181 |
| camera_readout_modes | id PK，camera_id FK；camera+mode_key UNIQUE，key/name 非空，gain/offset max≥min | equipment_models.py:49 |
| primary_optics_specs | equipment_id PK/FK；kind telescope/lens，口径/焦距/焦比/像圈为正；类型 trigger | equipment_models.py:67, :181 |
| optical_accessory_specs | equipment_id PK/FK；kind reducer/flattener/barlow，factor/clear aperture >0，backfocus ≥0；类型 trigger | equipment_models.py:79, :181 |
| filter_specs | equipment_id PK/FK；physical_size >0；类型 trigger | equipment_models.py:89, :181 |
| filter_passbands | id PK，filter_id FK；position≥0，label 非空 NOCASE，中心/带宽>0；filter+label 和 filter+position 分别 UNIQUE | equipment_models.py:97 |
| optical_trains | id PK，名称 1–120、row_version≥1 | equipment_models.py:108 |
| optical_train_revisions | id PK，train FK；revision/draft version≥1，snapshot JSON 有效；train+revision、train+id、train+idempotency UNIQUE；(train,base_revision) 复合 FK；UPDATE/DELETE 和冲突 INSERT trigger 拒绝 | equipment_models.py:119, :162 |
| optical_train_drafts | train_id PK/FK，draft JSON 有效、version≥1，(train,base_revision) 复合 FK | equipment_models.py:137 |
| optical_train_defaults | train_id PK/FK，(train,revision) 复合 FK | equipment_models.py:149 |
| alembic_version | Alembic 管理 schema 版本，实际期望 `0001_equipment_baseline`；未知版本拒绝而不重置 | `astrophoto/database/manager.py:27`, `:111` |

## 测试反向补全：两个指定文件全部测试函数

前述 T05–T10、T12–T19 已列大多数；补充本次逐行阅读遗漏的每个函数。所有结果是**断言内容**，不是本子代理运行结果。

| 测试函数 | 断言及边界 → Feature |
|---|---|
| `tests/backend/test_storage.py:176` | 暂缓 submit 后改默认模式，任务仍按创建时 reference 注册两个并保留原始字节；再次导入 skipped 2、session M42、原址失联后重定位；mock submit + 真 FS/SQLite → B-07/B-16，资产业务另审 |
| `tests/backend/test_storage.py:202` | copy 完成、1 个复制、size_and_stat、内容相同 inode 不同；同 key 同请求复用，同 key 改模式冲突，staging 空 → B-16/GB-06，资产业务另审 |
| `tests/backend/test_storage.py:241` | checkpoint 注入源追加，receipt SOURCE_CHANGED、无资产、staging 清空 → GB-08 类似源变化保护，但此为 import，不证明迁移同窗口 |
| `tests/backend/test_storage.py:259` | after_flush 注入异常，publishing/INTERNAL_STORAGE_ERROR 且无 asset；重启恢复 copied=1、对象恰一份、staging 空 → B-16/GB-09，import 发布窗口 |
| `tests/backend/test_storage.py:358` | 两次 reference 共两个 session，删除一个关联后剩余一个且源文件可读 → 资产业务 |
| `tests/backend/test_storage.py:442` | 需要显式第二卷，否则 skip；两文件跨卷 reference 注册 2、源字节保留、objects 空 → 资产业务；本轮不授权额外卷，未测 |
| `tests/backend/test_storage.py:52`, `:64`, `:85`, `:103`, `:116`, `:135`, `:161`, `:219`, `:283`, `:301`, `:342`, `:370`, `:400`, `:419`, `:463`, `:482` | 全部各自的成功、失败、Mock、临时真实 FS/SQLite 和限制已分别列于 T05–T10、T13–T19。`:301` 注入 DB switch 前后异常（不是杀进程）；`:370` 杀进程但仅针对 import。 |
| `tests/integration/test_storage_api.py:14` | 唯一综合请求测试：初始不可信 GET 返回 unavailable、PATCH 403；可信后坏 Origin/forwarded 返回 unavailable；snapshot online、注册 201、验证、停用、删除保留目录；无效模式 422、合法 revision 递增、旧 revision 409；来源禁止 403、预检、导入 202/轮询、managed 和源不变。直接将 `runtime.trusted_local=True`，没有测试部署参数自动推导。→ B-06–B-10/B-17/B-18 |
| `tests/integration/test_storage_api.py:92` | 以 extension 宿主替身加载已有非空根，status 200 degraded、storage unavailable、drawing available，目录内容不动 → B-02/B-05 |

## 补充：失败窗口与已观察结果

- 迁移复制前 inventory 拒绝未识别根内容、非空 staging、缺失受管文件；复制时校验源指纹、空间、目标 hash；错误可留下带 migration marker 的目标和 part。`astrophoto/storage/migration.py:48`, `:109`, `:125`。对 checksum 故障测试只断言旧源保留、旧 DB 根不变、目标没有 workspace marker（`tests/backend/test_storage.py:400`）；**没有断言目标为空**。
- publishing 写目标 workspace marker 后，在 DB 同一事务修改根和 operation=committed（`astrophoto/storage/migration.py:143`）；写 marker 到 DB 提交之间故障不会自动撤回 marker；`tests/backend/test_storage.py:301` 用 rebind 故障注入断言 publishing 和旧 DB 路径，再重启恢复，commit 后模拟 `_complete` 失败则断言 committed、新 DB 路径后恢复。该测试本代理未执行，且不等同真实断电。
- 取消 checkpoint 在提交前触发为 cancelled（`astrophoto/storage/operations.py:90`, `:139`）；源码没有迁移目标全量回滚或删除机制；committed 阶段取消不会设置请求。当前无迁移所有阶段取消、恶意替换路径 TOCTOU、满盘后恢复或真实跨卷故障的本轮运行证据。
- 来自主代理的本轮独立观察：8207 的真实 GET status 和旧节点通过；同盘迁移使用 isolated fixture，不能外推跨盘；跨盘因本轮谨慎不授权额外卷路径而跳过。精确命令、返回和测试汇总由主代理报告，不将其扩写成其他 Feature 全部 VERIFIED。
