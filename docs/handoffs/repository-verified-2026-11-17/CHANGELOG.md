# 文档修订记录

## 2026-11-17 — 当前工作树与Latest_Handoff双向校准

新增完整独立交接、双向报告、验证记录、下一Agent Prompt及本记录；附带本轮日志、输入hash、源码hash、并发变更清单与交付manifest。没有改写原始聊天交接、Bundle、截图、旧FRD/Guide、AGENTS或已有产品文档。

### 修正与时效更新：18项

对应报告C01–C18：React已有且与Vue并存；真实宿主是comfyenv而非base；V3/Status已经在运行宿主确认；当前Vue9/React33测试；画板像素与中文tooltip已修；独立语言覆盖废弃；实际frontend/ui+pnpm+js结构；原生紧凑Tab与搜索筛选排序已做；本地节点目录已有；旧settings.ts/类型断言描述过期；现host-runtime仍有旧语言操作；安装fetchNodeDefs声明差异；Portal/宿主容器CSS例外；当前构建大小；新Agent起点更新。

这些是文档修正，不是本次修改软件修好了18个bug。

### 补充遗漏：12项

对应N01–N12：画板双通道序列化、分类树、悬停预览、分视图排序偏好、Abort/请求状态、Canvas事务、node-only DnD、Locale检测、单产物构建、当前运行证据、项目级reference Skill及并发工作树变化。

### 保留未解决项：12项

对应R01–R12：3个冲突、4个证据未知、2个阻塞、2个部分实现和1个规划能力缺口。包括失效的宿主测试、用户明确保留的IMAGE错误、上传响应校验、Assets前置、Ruff版本差异、完整宿主验收、ZIP缺失、PyPI404、发布状态未知、并发快照边界、旧文档内部矛盾及固定API/安装目录兼容性。

### 有效需求保全

保留单Sidebar、三视图默认Assets、Search/Filter/Sort、原生Registry/Workflow、素材成为Source Node、七Settings模块、无实验前端页、语言主题跟随宿主、简约风格与图标待定。长期FR01–FR08、数据隐私/三库/科学精度/软件Adapter/33候选Skills未取消；不存在的模块没有被创建来填目录图。

### 证据更新

本轮115个不同用例通过，另有静态检查、隔离生产构建、真实只读HTTP/MCP与输入26条hash验证。原始宿主UI日志、Python3.11、wheel安装、旧SDK互操作均继续作为历史，不混入本轮通过数。原始ZIP未提供，明确记录未解压/未验证ZIP封装；历史manifest缺失的33条日志不冒充已读。

### 未修改范围

本任务未修改业务源码、测试、依赖配置、锁文件、宿主环境、reference及已有历史材料；未commit/reset/clean/checkout/push/Tag/发布。隔离测试生成临时产物与缓存，交付只新增文档/证据和开发任务记录。

共享工作区有其他操作修改前端源码及js产物；本任务保留并审阅，绝不回滚。细节见evidence/concurrent-changes.json。因而“本任务未改源码”不等于“整个工作树在审计期间没有变化”。
