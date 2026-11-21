# 本地存储与工作区 · 技术设计

**版本** v0.4 · 2026-11-21 · 源码静态核对。代码基线见[索引](00_FEATURE_INDEX.md)。目标宿主 ComfyUI 0.46.0 / Frontend 1.59.6，独立开发 Python 3.12，发布下限 3.11。服务使用 aiohttp、SQLAlchemy/SQLite、Alembic、filelock，宿主契约复用 ComfyUI V3 `on_load` 和原生路由。 [开发环境](../../../docs/development.md)

## 模块、所有权与生命周期

- FR-01。扩展入口调用 `host_runtime`，在 `StorageRuntime.initialize` 中规范化数据根、获取实例锁、校验或生成 manifest/settings、打开 `databases/assets.db`。初始化标志在数据库、默认 Workspace 与 Cache 就绪后写入。可选处理 Bundle 的准备钩子在锁外、业务 operation 恢复前运行。失败时持有诊断码，Core 状态路由仍可报告降级。 [扩展入口](../../../__init__.py) · [Runtime](../../../astrophoto/storage/runtime.py) · [数据库管理](../../../astrophoto/database/manager.py)
- FR-02、FR-05。SQLite 保存位置 ID、绝对路径、规范键、启用与行 revision。工作区身份标记匹配实例和 ID；受管资产持久化 `workspace_id + relative_key`。默认切换只改设置；同身份重绑要求原位置标记不可用，迁移完成通过事务切换路径而保持 ID。路径要求本机绝对路径，限制重叠和重新解析点，禁止把任何数据目录登记到另一条管理边界。 [locations.py](../../../astrophoto/storage/locations.py) · [paths.py](../../../astrophoto/storage/paths.py) · [models.py](../../../astrophoto/database/models.py)
- FR-03。默认 `~/.astrophoto`，可由 `ASTROPHOTO_HOME` 指定；settings 默认 reference、活动 Cache 20 GB。全局 revision 保护默认值和 Cache 修改，行 revision 用于工作区改名、启停和删除。Cache 仅由本实例管理，切换不删除旧 Cache，清理凭实例标记、条目所有权和租约，文件仍在 Workspace 或用户原目录。 [initializer.py](../../../astrophoto/storage/initializer.py) · [cache.py](../../../astrophoto/storage/cache.py)
- FR-02、FR-04。operation 保存原始请求、固定计划、阶段与回执；两线程池配合跨进程 operation 锁和 workspace 租约。迁移先盘点受管目录、确认空间、按持久化清单暂存并校验文件，再写目标工作区标记并事务性切换。原根保留。可恢复阶段持久化错误，在重试或启动时继续；终态不重跑，查询无副作用。 [operations.py](../../../astrophoto/storage/operations.py) · [migration.py](../../../astrophoto/storage/migration.py)

## 当前 HTTP 契约

前缀 `/astrophoto/v1`。存储和资产路由使用 `ASTROPHOTO_LOCAL_STORAGE=1`，单用户监听 loopback、无 CORS，直连请求带 `X-AstroPhoto-Local: 1`；同源或无 Origin 的直连调用可通过，拒绝跨来源与代理头。Core `/status` 提供独立诊断。JSON 请求限 65,536 字节，UUID 采用规范表示。授信快照含 data_root、database、imports/revision、default_workspace_id、workspaces、cache、capabilities、recent operations；无权快照以 200 返回 unavailable，存储未初始化以 503 返回 error。普通错误是 `{error:{code,message,details?},request_id}`，常见为 403、404、409、423、507、503；其余无效请求通常为 422。

| 操作 | 输入与结果 |
| --- | --- |
| `GET /storage`；`PATCH /storage/settings` | 读快照；写传整数 expected_revision 和至少一项 imports.default_mode、workspace.default_workspace_id、cache.max_size_gb，返回更新设置。 |
| `POST /storage/locations` | path、name，201 返回工作区视图。 |
| `PATCH/DELETE /storage/locations/{id}` | PATCH 带 expected_revision、name/enabled 或单独 default:true；DELETE 带行 revision，返回 removed，不删除目录。 |
| `POST /storage/locations/{id}/validate`；`POST .../relocate` | 验证返回状态视图；重绑 body 带 new_path，返回同 ID 的位置。 |
| `POST /storage/cache/{configure,clear}` | configure 接 path、max_size_gb、expected_revision；clear 接 scope，返回 removed、removed_bytes、skipped、failed。 |
| `POST /storage/migrations` | workspace_id、target_path、idempotency_key，202 仅返回 operation_id 与请求 ID。 |
| `GET /storage/migrations/{id}`；`POST .../{cancel,retry}` | 按 ID 查询，或提交取消/重试；返回 phase、receipt、cancel_requested、error 等。 |

[路由定义](../../../astrophoto/api/storage.py) · [权限检查](../../../astrophoto/api/security.py) · [错误映射](../../../astrophoto/api/errors.py)

## 默认选择、状态与恢复

| 路径 | 读取的权威状态 | 失败、重试与副作用 |
| --- | --- | --- |
| 再启动 | 已初始化时 `ensure_default` 检查默认 ID 仍有登记；快照分别探测实际 Cache 与工作区状态。 | 已登记的默认目录离线可显示为 `degraded`，不会因缺盘再建初始 Local。坏配置、丢失默认登记或失效数据库走启动诊断。 |
| 新建写入 | copy 将目标 ID 固化在计划里，正式 Siril 每次执行读取默认 ID，两者均要求选定位置可写。受管资产读取用 `require(write=False)` 和安全相对键。 | 只读且标记有效可读取既有受管文件；写入拒绝。迁移中返回 `STORAGE_BUSY`。默认变化不会把已受理的 copy 作业转到别处。设备服务与组合服务只依赖资产数据库。 |
| 提交前恢复 | 作业计划存源/目标、工作区 ID、清单和阶段；目标迁移标记绑定实例、作业和工作区。数据库仍指向源，复制过的文件最终参与全量源清单和 SHA-256 核对。 | 非终态保留错误和检查点，允许同 ID 重调度。取消要经过检查点，包括切换事务中最后一次检查。终态的重复请求返回原作业，保留源和可能的目标残留。 |
| 提交后恢复 | 工作区路径变更与 `committed` 在同一 SQLite 事务里。 | 继续核对新根和目标文件尺寸，按归属移除本作业迁移标记，记录 `completed`。不会回滚到源，也不会重新复制或删除源。 |

状态探测先查目录与身份，再查容量和权限，禁用和进行中的迁移可覆盖其显示值。诊断应同时检查工作区状态、作业阶段和错误码。 [工作区登记](../../../astrophoto/storage/locations.py) · [路径解析](../../../astrophoto/storage/manager.py) · [素材导入](../../../astrophoto/assets/imports.py) · [Siril 正式处理](../../../extension/siril/processing.py)

## 技术取舍和风险

**v0.5 补充。** 启动路径由 `core/paths.py:data_home` 解析，`ASTROPHOTO_HOME` 优先且必须是绝对路径；无覆盖则使用 `Path.home() / ".astrophoto"`。解析不创建目录，创建由宿主初始化负责。现行工作区 migration 改 SQLite 中一个工作区的根，整库搬家还须处理目标根的实例配置、SQLite 一致性、根内外的路径分类和回到旧根的启动切换。建议停机版本先明确哪些可重建数据可跳过，并验证旧根在目标可用前一直可启动。相关机制留待 FR-06 技术评审。 [PRD](01_PRD.md) · [路径解析](../../../astrophoto/core/paths.py)

默认工作区离线时没有代码级自动改写目标的策略。数据库按现行 Alembic 基线、实例身份、WAL 和外键要求打开，不兼容库保留原件。真实盘符转换、访问权限和原始断电仍需实机验证。迁移首次受理只核对目标路径、目录状态及既有 operation；后续工作线程盘点、容量估算并复制。应按典型大图测量清单遍历、读写/哈希耗时和复制期间额外磁盘开销，当前无基准指标。文件系统与 SQLite 跨边界遇到故障依靠 marker、receipt 与回载校验，提交窗口保留分支。 [实现规格](04_DEV.md) · [用例](05_TEST_PLAN.md)
