# 设备与光路管理 · 技术设计

**v0.3 · 当前工作树静态核验**。环境及来源见 [索引](00_FEATURE_INDEX.md)。Vue 界面通过宿主 `app.api.fetchApi` 查询或写入。宿主 V3 生命周期装配 StorageRuntime、DatabaseManager、EquipmentService 与 OpticalTrainService，注册原生 aiohttp RouteTable；授权和资源状态通过 handler 检查，实际业务转到线程执行。数据由扩展资产域持有，MCP FastMCP 只访问 HTTP。

## 持久化及接口

`ASTROPHOTO_HOME/databases/assets.db`（默认 `~/.astrophoto`）与 Storage/Assets 共用。Alembic `0001_equipment_baseline`，独立类型规格与一对多读出/通带，光路有主记录及唯一当前配置、旧快照和旧默认指针。SQLite FK、WAL、启动版本/结构/完整性检查和写事务 `BEGIN IMMEDIATE`；同一事务处理依赖行和版本。版本不符的库由健康检查报错，开发验证使用独立测试根。设备操作不写工作区、素材原件和导入配置。 [存储专题](../local-storage-workspaces/03_TECH.md) · [数据库规则](../../../docs/equipment.md)

| `/astrophoto/v1` 入口及需求 | 调用与主要契约 | 副作用与返回 |
| --- | --- | --- |
| FR-01 · GET/POST `/equipment` | 列表 `q,type,archived,after,limit`，UUID 游标，limit 默认为 50，允许 1–100；新增必需 `equipment_type,name`，可含厂商、型号、备注、类型专属 specs。 | 列表 `{items,next,total}`；新增 201 + Equipment DTO，基础行及规格一并写。 |
| FR-01、FR-03 · GET/PATCH/DELETE `/equipment/{id}`；POST `/archive`、`/restore` | UUID；修改、归档、恢复及删除携带 `expected_version`。详情包含 `usage_summary`，覆盖当前配置和旧历史。 | 更新返回新 DTO/版本；DELETE 204，版本冲突或有引用拒绝。 |
| FR-02、FR-03 · GET/POST `/optical-trains`；GET/DELETE `/optical-trains/{id}`；POST `/archive`、`/restore` | 列表支持 `status` 取代 `type`；创建 `name,notes?,draft?`；归档、恢复和删除用 `expected_version`。详情含 `configuration`、`components` 与历史兼容字段。 | 创建 201，其他成功 200 或删除 204。当前配置优先、其次旧默认或最近快照，不自动回填为新配置。 |
| FR-02、FR-04 · GET/PUT `/optical-trains/{id}/draft` | GET 返回 `{draft: null 或保存回执}`。PUT 入参 `{draft,expected_draft_version}`，初次写用 null，成功后原位更新 `draft_version`。 | 写入类型和存在的引用。归档光路、过期版本及无效引用拒绝。版本和当前配置同事务更新。 |
| FR-02、FR-05 · `/optical-trains/{id}/revisions`、`/revisions/{revision_id}`、`/default-revision` | GET 旧历史摘要和快照详情；老 publish POST/默认 PUT 拒绝 410 `TRAIN_HISTORY_READ_ONLY`，快照 PATCH/DELETE 409 `REVISION_IMMUTABLE`。 | 快照校验版本 1、所属光路及各部件类型与顺序。合法永久删除光路会同时删除其兼容历史及默认指针。 |

FR-05 的浏览器请求要求 `ASTROPHOTO_LOCAL_STORAGE=1`、受信单用户直连回环宿主、同源 Fetch Metadata、有效 Host/Origin、自定义标记且无代理标记。只读 MCP Bearer 仍受回环前提，无浏览器 Origin/Fetch Metadata，仅 GET。单一资产库的服务为数据边界。JSON body 最大 64 KiB；错误通常以 `{error:{code,message,details?},request_id}` 返回，204 使用 `X-Request-ID`。400 请求体或查询无法解析，403 权限，404 记录不存在，409 版本/引用/归档冲突，422 业务字段校验，423 数据库忙，503 依赖不可用或数据损坏。 [MCP 专题](../mcp-diagnostics-equipment-read/03_TECH.md)

## v0.4 待实现契约

D-04 更新用户可见术语。OpticalTrain、/optical-trains 和 MCP 工具名沿用兼容入口。D-05 待在设备和设备组合各自写入边界校验名称，创建、重命名及并发写入按同一规则，具体比较及旧重名处理随 Q-07 确认。D-06 以写入前的有效配置区分保留、移除和新增归档引用，拒绝新增后不改变已存配置或旧快照。 [决定与验收](01_PRD.md)

## 一致性、取舍与已知差异

- 光路当前关联实时查设备，历史快照内容保持其记录值。兼容 `published` 值表示已配置；归档优先显示。配件按数组位置展示，滤镜为去重的可用集合。比较旧历史回退和当前配置时，用单独的服务、API 与宿主用例。
- SQL 条件更新与写锁避免普通陈旧提交覆盖。界面重基只更新待提交版本号和比较基线，本地整个表单仍可能覆盖其他会话所改字段。创建没有幂等键，连接中断后需先确认实际结果。配置分多请求取详情、可选项和列表；组件 abort 防止过期响应更新，后端已提交写入不因客户端取消而撤销。
- 已归档设备在 Vue 可选项排除，后端组件校验存在和类型即可。光路配置保留旋转、变更备注和平场适用性字段，当前编辑器没有相应控件。D-06 已确认禁止新增归档引用，D-08 已确认不新增编辑控件，保留兼容字段。
- 搜索按 Unicode casefold 查询本地库，设备详情使用关系需要扫描当前配置和旧历史；未定义量化资源阈值，性能用分页、大历史样本和真实用户路径测量。对列表游标、UI 部件控制规模和过滤以实际规则为准。
- 宿主 V3、Sidebar、fetchApi、主题与确认弹窗沿用原生实现，设备领域及快照自有。单选、多选源码血缘为 ComfyUI Frontend 1.59.1，适配说明含版本、来源和许可证，目标宿主为 1.59.6。 [源码复用说明](../../../frontend/src/vendor/comfyui/README.md) · [逐入口定位](04_DEV.md) · [测试计划](05_TEST_PLAN.md)
