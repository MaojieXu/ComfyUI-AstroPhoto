# 本地数据、Workspace、Assets 与设备

## 文件和数据库

- 默认 ~/.astrophoto，ASTROPHOTO_HOME 必须是支持的绝对路径。目录布局由 storage/initializer.py、runtime.py 和 core/config.py 管理。manifest 的 instance_id、SQLite storage_identity、Workspace/Cache marker 互相核对。数据库或 manifest 损坏/旧基线不自动擦除。schema 为 0001_equipment_baseline，WAL、事务 foreign_keys/busy timeout 与完整 schema 检查。表、约束及触发器逐项见 [表证据](evidence/subagents/backend.md)。
- 6 张 storage/assets 业务表和 11 张设备/光路业务表，另有 alembic_version。设备专业表按相机、readout modes、主光学、配件、滤镜、passbands 独立。光路当前配置保存在 draft JSON，兼容 revision/default 关系有复合 FK。现行版本无 observing_sites、Capture Session 主实体或 Trials/RAG/Memory 表。
- Workspace 支持初始默认、新建、检查、重新定位、重命名、设为默认、禁用、移除和迁移。安全路径、身份 marker、不重叠、离线状态、使用中版本限制稳定。迁移以 plan、文件清单、检查点、验证、DB 切换与恢复为界，源不自动删除；阶段失败可保留自有目标中间文件。copy/reference 的实体状态测试不代表跨盘真实运行。
- Cache 配额、租约、Owned entry 和清理由 CacheManager 管理。换目录不迁移旧缓存；预算与实际可用空间检查不同。SQLite、应用锁、文件 marker 与 checkpoint 是互补边界，文件系统和 SQLite 不能假定原子提交。

## Asset 与设备行为

- Asset Import 的预检、reference 和 copy 都要求 ASTROPHOTO_IMPORT_ROOTS 下合法源。枚举限制、文件快照和绝对路径对通用文件有效。reference 不复制且检查路径/size/mtime，copy 用 staging 和 no-overwrite publish，完成后注册 managed，回执明确校验等级。取消、恢复与重试按 operation id/key，部分失败独立报告。通用导入不验证科学内容，格式验证在 FITS 消费者实施。
- Assets list、单项 resolve/inspect、外部引用 relocate、Session attach/detach 已在服务/API 层。Session 是关系键，非有名称/时间的实体。外部引用重定位依赖 stat/授权查询，暂未发现内容哈希验证。没有已验证的通用资产实体删除。
- Equipment schema/服务校验同类规格、范围、枚举、可选值与 Passband 集合；字段见设备类型专用表。所有写入纳入 SQLite 事务，加乐观版本防同一表单重写。设备还原与 Archive 使用版本和 UTC，存在当前或历史引用时设备物理删除被阻止。
- OpticalTrainService 保存一套配置，允许不完整项，完整性影响 DTO 的内部 draft/published 状态。配件顺序、滤镜列表、组件类型及存在性校验。后端可新关联已归档设备，UI 多数选择只展示在用或默认选中项。旧 Revision GET 仍经 snapshot Schema 校验，发布/切 default 写入口返回 410；整条光路永久删除原子移除当前和遗留引用并恢复保护触发器，不能把只读快照说成永久保留。
- 乐观冲突本身由后端拒绝。UI 的 Retry 更新版本并重发旧表单，可能覆盖无关的并发更改。历史-only 引用阻止设备删除但 UI 不区分来源。这两项此前评审未修，并非本轮通过的验收能力。

详见 [后端逐功能/DB/Guard](evidence/subagents/backend.md)、[资产设备接口/字段/测试](evidence/subagents/assets-equipment.md)。
