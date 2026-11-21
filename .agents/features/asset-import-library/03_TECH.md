# 素材导入与资产登记 · 技术设计

**版本** v0.4 · 2026-11-21 · 源码静态核对。代码基线见[索引](00_FEATURE_INDEX.md)。aiohttp 路由、SQLAlchemy/SQLite 和文件操作由 Extension 执行，目标宿主 ComfyUI 0.46.0 / Frontend 1.59.6。复用宿主 `on_load`、路由和 Widget 接口。 [开发环境](../../../docs/development.md)

## 数据所有权与关系

`Asset` 存 UUID、名称、大小、mtime。外部 `AssetLocation` 存规范路径/唯一键，受管 `AssetLocation` 存 Workspace ID 与唯一的相对键；前者引用本机原件，后者以 `objects/<asset_id>/<name>` 管理副本。科学 Bundle 还可登记受管输出。 `AssetSession` 以资产 ID 与业务会话字符串关联多对多，没有完整会话实体。大文件与 FITS 像素留在文件系统，Asset/关系/operation 由业务服务经现有 SQLite 数据库写入。 [模型](../../../astrophoto/database/models.py) · [Workspace 技术设计](../local-storage-workspaces/03_TECH.md) · [科学处理设计](../siril-fits-autostretch/03_TECH.md)

## API 契约

前缀 `/astrophoto/v1`，使用本机可信部署和 `X-AstroPhoto-Local: 1`。导入授权根由 `ASTROPHOTO_IMPORT_ROOTS` 指定，选择与执行检查真实路径、排除 Data Root、Cache 和登记/保留的工作区，规则复用 storage handler。错误返回 request_id 与 error.code，拒绝来源 403、缺项 404、冲突 409、忙 423、容量 507，默认无效输入 422。受理后失败看 operation.error 和 receipt，与 HTTP 受理分开。

| 操作 | 输入、返回与副作用 |
| --- | --- |
| `POST /assets/import/preview` | sources 为 1～100 个服务端绝对路径；可选 import_mode_override、workspace_id、session_id，copy 使用显式或默认工作区。返回 effective_import_mode、workspace_id、file_count、size_bytes、free_bytes、failed、originals_retained。预检无资产或 operation 写入；正式执行独立校验并枚举。 |
| `POST /assets/import` | 同预检的选择字段并增加 idempotency_key。202 返回 operation_id，受理冻结有效模式与目标；工作线程持久化文件清单。 |
| `GET /assets/imports/{id}`；`POST .../{cancel,retry}` | 按 ID 和 kind 获取阶段、取消请求、error 与 receipt。终态重试仅返回原状态；非终态由持久计划继续。 |
| `GET /assets?after=<UUID>` | 资产 ID 升序游标，每页最多 100 条，next 指向本页末项或 null。单条返回 id、name、size_bytes、mtime_ns（字符串）、session_ids、storage_mode、workspace_id；可用性另读，无名称搜索和排序参数。 |
| `GET /assets/{id}/availability` | 存在资产返回 available/reason；物理路径或 Workspace 不可读时返回可观察原因，未知资产返回 404。 |
| `POST /assets/{id}/relocate` | new_path，要求外部引用、授权目标、同大小和目标键不冲突。更新路径、名称和 mtime，返回 asset_id/relocated。 |
| `PATCH /assets/{id}/sessions` | session_id、attached:bool。重复附加/解除幂等，仅修改指定关联。 |
| `GET /fits/assets` | 独立科学候选接口，分页返回有 FITS 后缀的资产 ID、名称，由节点实际读取时校验。 |

[资产路由](../../../astrophoto/api/assets.py) · [科学路由](../../../astrophoto/api/scientific.py) · [本机边界](../../../astrophoto/api/security.py) · [共享 DTO 和错误](../../../astrophoto/api/storage.py)

## 导入、一致性与性能

预检和 import 工作线程复用来源枚举，按规范路径去重，保留可枚举失败计数；候选上限 10,000，遍历目录项保护上限 40,000。reference 复检大小、时间等文件 stat，以路径键去重，相符的已有引用可附加会话；copy 在 workspace 租约内检查空间，写拥有者标记及 .part，再有保护地发布对象，事务登记 Asset/位置/关联及回执。默认 copy 验证 `size_and_stat`；真实样本可通过测试额外对比摘要。失败处理依持久 plan、staging 和发布检查点；原件未移动。已完成项回执与登记一起提交，轮询不会继续处理，取消在适用检查点生效。成功与失败混合时可为 completed，调用方仍需读取计数。

Q-01 需定义作品内容身份，当前重绑判据不足以确认同大小文件的内容。Q-03 需决定是否跨路径查重，读全量内容会提高大目录 I/O。Q-04 需决定逐项结果的粒度与可见路径；当前记录计数和最多 100 个按序号错误。没有真实吞吐或长批次容量基准。Vue 占位后通用导入 API 由 API 验证，科学控件与背景服务独立回归。 [实际实现](04_DEV.md) · [测试计划](05_TEST_PLAN.md)

## 回执与恢复的边界

预检返回聚合结果，正式导入工作线程重新枚举并把清单固化到计划。回执公开 `processed`、`total`、`registered`、`copied`、`skipped`、`failed` 以及至多 100 条仅含 `entry` 和 `code` 的错误。公开回执不提供完整清单、路径与资产 ID 的对应关系。对已受理操作的查询没有复制副作用。部分失败且有其他结果时可为 `completed`，客户端必须同时检查计数。

发布前暂存由 operation 标记归属。发布状态在登记事务前持久化，恢复时重新校验副本并完成登记。已提交资产与其计数同事务写入。终态 retry 返回原状态，不能作为失败项补导接口。支持查询和重试的边界由 operation 阶段决定，恢复界面及按项结果需经 Q-02/Q-04 决定。当前资产路由没有资产删除端点，测试不能假设存在删除 API。 [导入服务](../../../astrophoto/assets/imports.py) · [操作服务](../../../astrophoto/storage/operations.py)
