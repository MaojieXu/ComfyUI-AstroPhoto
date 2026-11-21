# 本地存储与工作区 · 开发规格与实现

**版本** v0.4 · 2026-11-21 · 当前源码静态对照。基线及与 HEAD 的差异见[索引](00_FEATURE_INDEX.md)。下表记录现存入口和 guard。

| 规则来源 / 用例 | 文件与符号 | 顺序、拒绝与副作用 |
| --- | --- | --- |
| FR-01 / CASE-01 | `__init__.py:on_load` → `bootstrap.py:host_runtime/initialize_storage_runtime` → `storage/runtime.py:StorageRuntime._initialize` | 宿主加载决定授信并注册路由。根检查 → 锁 → 配置与 manifest → 资产库初始化 → 默认工作区和 Cache → 写初始化完成 → 处理 Bundle 准备 → `Operations.recover`。路径/配置/DB 不合法返回存储诊断；Core status 仍注册，持久库不被重置。 |
| FR-01 / CASE-01 | `storage/initializer.py:check_data_root/load_or_create_manifest/load_or_create_settings`；`database/manager.py:DatabaseManager.initialize/_check_schema` | 拒绝未知占用的根、坏 manifest 或 settings、数据库丢失/身份不符、未知或旧开发 schema、无法使用 WAL。SQLite 开外键和 busy timeout；仅保留首次补齐流程的明确条件。 |
| FR-02、FR-05 / CASE-02、CASE-05 | `storage/locations.py:WorkspaceRegistry.candidate/register/check_status/validate` | 规范化绝对本地路径，检查父目录和防重叠，再 claim 标记、建布局、登记。已有标记只在同实例、空业务布局、ID 未登记时可接续。快照读取身份和空间，显式 validate 在租约内尝试在 .staging 建临时文件，仅在线执行探针。 |
| FR-02、FR-05 / CASE-02、CASE-05 | `WorkspaceRegistry.update/relocate/remove`；`rebind_workspace` | 租约与全局锁；default 用 settings revision 且必须在线，不与改名/启停合并。普通修改用行 revision，默认不能禁用。重绑拒绝原标记可用或目标标记不匹配，成功保持 ID 并递增行 revision。默认、有资产引用、有活动 operation 拒绝解除；成功只删登记。 |
| FR-03 / CASE-03 | `api/security.py:trusted_deployment/direct_local_request/authorize_storage_operation`；`api/storage.py:handler/fields` | 授权先于服务访问和解析。快照 unauthorized 返回不可用，变更 403。授权后解析/限制 JSON 并移到线程；DTO 拒绝缺字段或多余字段并规范化 UUID。 |
| FR-03 / CASE-03 | `storage/runtime.py:update_settings`；`storage/cache.py:configure/clear_owned_cache` | 锁内比较 revision，Cache 路径通用检查，验证/创建实例标记再原子替换设置。清理遍历已知 bucket，逐项验证所有权和独占租约，仅删除匹配维护对象并返回计数；忙碌跳过，I/O 失败计数，切换保留旧缓存。 |
| FR-02、FR-04 / CASE-02、CASE-04 | `storage/migration.py:validate/start/run/_inventory/_copy_and_commit/_complete` | 路径、空目标、可写源和同工作区活动任务在受理前检查；线程租约下盘点 objects/outputs、检查 .staging 和注册键、估算空间。目标授权标记和 .part 暂存、逐项 receipt、校验 SHA-256，再等待最终取消检查，事务切换 root 和 committed；提交后验证目标尺寸、移除本 operation 标记并记 completed。原根数据保留；失败/取消可保留供检查的暂存或已复制文件。 |
| FR-04 / CASE-04 | `storage/operations.py:find/create/status/cancel/retry/recover/run` | 1～128 字符键，kind/key 唯一；同键异体报冲突，最多 16 笔非终态。取消写标志，committed/终态拒绝变更回执；非终态重试清错误并调度。publishing/committed 等关键阶段异常保留可恢复记录，其他拒绝按代码终态失败，进程恢复调度非终态。 |
| FR-01～05 / CASE-01～05 | `frontend/src/api/storage.ts:fetchStorage/mutate/fetchReceipt`；`StoragePage.vue:change/add/migrate`；`OperationProgress.vue:poll` | DTO 校验、异常翻译，成功由快照确认。迁移及回执独立轮询，间隔 800 ms，离开组件清理请求。缓存保存按服务端数值消除已提交草稿。 |
| FR-01、FR-05 / CASE-01、CASE-05 | `storage/locations.py:ensure_default/check_status/require`；`storage/runtime.py:snapshot` | 首启从 manifest 引导 Local，要求工作区在线。实例已初始化后只核查默认 ID 已登记；离线则在快照中降级，不重新创建。require 写入只接受在线，读取额外接受 read_only，其他状态返回相应错误。 |
| FR-02、FR-05 / CASE-06 | `storage/runtime.py:StorageRuntime.__init__`；`assets/service.py` → `storage/manager.py:resolve_managed`；`assets/imports.py:AssetImportService`；`extension/siril/processing.py:formal_run` | 设备与组合直接由同一资产库构造。copy 计划把选定工作区 ID 持久化；受管读取从当前登记的根与相对键定位。Siril 正式执行读取当前默认 ID，取租约、要求在线后写入工作区。候选预览走 Cache。 |

## 已有实现偏差与适用边界

- v0.5 补充 FR-01 的入口为 `core/paths.py:data_home` → `core/config.py:load_config` → `bootstrap.py:host_runtime` → `StorageRuntime.initialize`。配置解析本身无磁盘副作用。FR-06 缺少整库预检、停机复制、目标启动验证和回切实现；单工作区 worker 只处理工作区目录。FR-07 复制 API 由 `AssetImportService` 承接，用户入口由素材 Feature 接续。

- 原 React `frontend/ui/src/features/settings/StoragePage.tsx` 和旧 `frontend/ui/storage-host.mjs` 可用 `git show 4c0cf4d:<path>` 回查，当前 Vue 路径见[交互规格](02_UI_UX.md)。Vue 当前未提供迁移容量预检摘要、多笔操作历史或原根清理。Cache 表单最小值为 0.001 GB，服务端接受有限数值 0 < GB ≤ 100000；端到端回归应区分界面与 API 的下界。Q-01、Q-04 仍开放。
- 前端只允许部分状态提交重绑，服务端还要求旧标记失效；例如禁用但原标记仍可用时返回 `WORKSPACE_NOT_OFFLINE`。CASE-05 保留此区别。
- 特别检查移除 guard 与显示、重复/终态操作、后台出现错误时的重试及许可校验。真实卷拔插和权限变化留待隔离宿主/设备。
- 将导入和迁移的故障注入标注为各自操作。导入取消与强制退出测试只能证明导入的对应检查点。迁移取消、实际宿主杀进程前后和真实离线重绑仍分别验收。 [测试计划](05_TEST_PLAN.md)
