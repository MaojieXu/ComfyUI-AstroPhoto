# 三套交接与当前工作树双向对齐

来源简写 C 指 Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18，L 指 Last_Handoff/sources，O 指 Original_request。直接用户指令来自当前会话，优先于版本或文件日期。原始全文/截图/副本的文件覆盖见 [需求文件账本](evidence/subagents/requirements.md)。重要主路径逐项以工作树证据复核。

| Decision ID | 主题 | 原始需求 | 上次结论 | 本次产品要求 / 后续指令 | 当前源码和本轮测试 | 对齐结论 |
|---|---|---|---|---|---|---|
| D01 | V3 入点和 Vue | 保留旧 Widget 与 IMAGE 契约；旧目录文档偶有 V1 示例 | L01_CURRENT_STATE、L03_ARCHITECTURE 已见 vue-basic | native V3、旧 Widget 行为仍保留 | __init__.py:12–45 四节点；frontend/src/main.ts、VueExampleComponent；Python stub、Chromium 像素和 8207 Schema 通过 | 保留；历史输入执行失败尚未重验 |
| D02 | Sidebar/语言 | Sidebar FRD 三视图，设置模块与可见占位 | L02_REQUIREMENTS、L07_TEST_EVIDENCE 记录原先 default Assets 与 8 设置模块 | 明确按宿主 locale/theme，删 General 与观测地行 | App.tsx:12–38、moduleRegistry.ts、locale.ts；8207 真浏览器中文三栏、关键模块可见 | General/观测地入口旧断言 OBSOLETE；观测长期意图保留 |
| D03 | 多 Workspace/Cache | 旧原型偏单 active 位置，后续本地存储 v1.1 允许多个 | L06_DATA_MEMORY_RAG 多数作为规划 | C08_WORKSPACE_SECURITY_AND_LIFECYCLE 要求预览/正式不同生命周期 | StorageRuntime、WorkspaceRegistry、CacheManager、DatabaseManager；SQLite fixture 验证搬迁、取消、恢复和路径操作 | 旧规划 OBSOLETE，跨盘本轮跳过 |
| D04 | 导入与直读路径 | O Siril 产品/工程新增第一行补丁要求授权目录；文档也有旧 ASTRO_FRAME 示例 | 未实现 assets 的旧事实 | 本会话归档历史明确仅 Siril 可读根外本地 FITS，Asset Import 仍限制授权根 | imports.py:33–42 强制 roots；frames.py:17–36 + manager.py:25 路径回退与本机权限；test_direct_fits_path_outside_import_roots 实际通过 | 产品保留最新更正，路径文档需更新。部署级信任与逐路径授信需区分 |
| D05 | 设备模块 | O设备 UI v1.0:14–29 四类设备、专业表单、多通带 | 曾归为计划 | 当前会话确定摘要卡片和 Accordion、用官方风格控件 | equipment schemas 与 SQL，EquipmentDetails/EquipmentForm，Vue picker bridges；DB/HTTP 测试与隔离前端断言 | 已实施主路径，当前真实浏览器 CRUD 未重跑 |
| D06 | 光路版本 | O设备 UI 与 Three-Tier guide 需不可变 Revision、默认版本、派生与历史 | 历史验收围绕发布/归档 | 当前会话明确两域都不要多个版本，「不需要历史版本，删除历史版本」 | trains.py:44–75、:157–186 与 API equipment.py:64–78；单配置，兼容 GET，旧写 410；集成测试断言 | 旧产品规则 OBSOLETE，数据兼容不应误会为 UI 或新版本支持 |
| D07 | 删除与引用 | 原始方案以归档/版本为主 | 部分历史包未提永久删除 | 编辑、归档及红色永久删除。设备用量必须说明 | service.py:47、:172；trains.py:83；React 共用 DetailActions，SQLite 触发器恢复测试 | PARTIAL，历史-only 引用提示不清，UI 冲突重试风险 |
| D08 | IMAGE_PATH | O 补丁取代首期 ASTRO_FRAME，保留内部科学表示 | L01 只展示老节点 | C02、C05 路径契约、保存正式 FITS | scientific.py:10–111；8207 真 Schema；8201/8205 仍旧端口，JS 同一当前哈希 | 当前源码符合首期，历史契约 OBSOLETE，工作流迁移仍人工 |
| D09 | Siril 版本/三参数 | O PRD v1.1 主目标 1.4.5 与三业务参数 | L 范围早于实现 | C06 版本、CLI 语义及输出要求 | software.py:135–165、processing.py:24–54；两个真实 1.4.5 用例与合成验证 | 已验证范围为 Windows CLI，当前正式宿主 E2E NOT_RUN |
| D10 | 预览 | 较早 Node Interaction PRD 提多视图/设定变化，产品迭代取消视口触发 | L 无当前科学预览 | 单主图、手动刷新、全局 PNG 长边，界面固定上限 | scientific.tsx:68–135、api/siril.py:39–56、EnvironmentPage；隐身时参数变化仍触发；只打开不发新的候选 | 画布窗格字段只校验不保存是历史兼容；不把 PRD「不必」当绝对禁止 |
| D11 | Inspector | O 工程早期允许更广的编辑；历史 Node实现(3) 确认参数同步编辑 | L 尚无生产 Inspector | C02:34–36、C04:39/55 曾采用只读。用户现明确「inspector的参数就不应该是只读，而是可以修改的。」 | scientific.tsx:150–193 编辑并重置实际节点 widget；通用 JSDOM 仅覆盖 details 展示 | 旧只读条款 OBSOLETE。可编辑与当前源码一致，实际同步/预览回归仍待验证。Trial 管理不在本期 |
| D12 | 输入限制、异常 | O 历史规格含可撤销的大小/超时要求 | L 主要为运行风险 | 当前会话早期 Node 决策明确去掉 96 MiB、4 MiB、60/180 s 和总并发硬上限；保留空间与取消 | software.py:56、processing.py:137、frames.py:125、previews.py:62；probe 有 timeout，正式/候选无默认硬上限 | 旧值 OBSOLETE。内存安全没有验证，不能以成功小样本推广 |
| D13 | MCP | O设备指南要求可验证只读能力，遵从权限 | L05 只有两个诊断工具 | Siril 专题本期不添加 Siril 工具，不否定独立设备工作 | MCP 工厂条件添加 6 读 tools；真实 stdio、MockTransport、独立设备 aiohttp 负面授权测试 | 历史「全域无业务工具」过期；真实 Token→宿主 GET 未做 |
| D14 | 长期产品 | 观测站、Capture Session、校准、知识、记忆、实验、Agent Workflow | L02/L06 未来阶段 | C04:71 首期不扩展；会话当前删掉观测地设置行 | asset_sessions 是关联表；core/capabilities.py 对知识/记忆/实验/远程画布为 false；没有业务仓 | 保留为 PLANNED 或 PARTIAL；已替代的是旧 UI 行，不是全部观测目标 |
| D15 | DB 初始化 | 设备开发期库允许重建，启动禁止擦除真实数据 | 历史路径/库模型较简 | 多 Workspace/设备共享目前有效基线，生产数据不可重置 | database/migrations/versions/0001_equipment_baseline.py 与 manager.py；损坏/旧 schema fixture 验证 | 保留设计约束，旧库迁移无交付 |
| D16 | 交接漏项 | 旧 Node PRD 不含当前收藏/环境设置/Proxy UI | L 曾记录基础搜索，但没有收藏与科学节点三栏联动 | 当前开发便签有宿主收藏与环境配置；继承宿主设置 | NodesPage.tsx:16–83、NodeTree.tsx:80，frontend/ui/src/features/settings/EnvironmentPage.tsx；收藏本轮未测试真实写入 | 实现存在，历史 Handoff 遗漏；收藏宿主内部键是版本耦合 |
| D17 | 工程证据 | 历史报告只代表当时 | 含上轮宿主失败或仅原生加载 | 新报告要求当前命令、时间、退出码、原始日志 | 3.11/3.12 现有环境、当前真 CLI、隔离构建和既有宿主 GET，Jest 默认失败 | 旧计数不继承，详见 [本轮结果](06_TEST_COVERAGE_MATRIX.md) |
| D18 | 光路状态与多选 | O 设备 UI FRD:418–442 要求可选旋转角度、Flat 备注、可用滤镜多选 | 旧版本表单呈现光路状态 | 当前会话明确不需要光路状态，滤镜选择使用同款下拉多选 | OpticalTrainEditor.tsx:9–10,70、ComfyMultiSelect；schemas.py:192–196 保留兼容字段 | 保留单配置、机械顺序和滤镜；旧光路状态表单已替代，后端兼容字段仍合法 |
| D19 | 现行基线 | 原始文档保留设计意图 | 上次交接记录当时的实现与证据 | 用户确认可以接受与旧 Chat 需求的偏差，以本地实现为准 | 本地工作树描述现行行为，测试证据单独记录 | 旧差异留作演进记录。仅凭旧文档差异无需安排代码修改 |

## 依赖关系与判断来源

- 按 D19 采用本地实现为基线，旧专题及补丁提供时间线。历史材料中的目录、接口或状态与工作树有差异时，记录差异和当前行为。
- 现工作树补齐了 Last_Handoff 未提的 Storage/Assets、设备、Siril、预览 settings、科学节点与新增 read tools。旧原始设备 Revision 需求已经有直接明确的取消证据。
- 共享讨论链接尝试读取时超时。本地 Original_request 的两个设备文件可读，第三份规格文件 0 字节。没有引用无法访问的对话内容。
## 历史风险回读

- L08_GAPS_AND_RISKS R1 的旧 Torch 启动阻塞不适用于本轮 4 个已运行宿主，不能推定新安装均可启动。R2 旧 PyPI 404 未在本轮复查，标 UNKNOWN。
- L08 R5 的 PNG 上传响应验证缺口在当前 VueExampleComponent.vue:56–72,98–102 仍存在。R6 的恢复路径和 R7 的中文画笔 key 已有 Chromium 实测修正。R8 的 Ruff hook 版本和本轮工具仍不匹配。R12 的公共 data_home 披露尚存，同时现在已有本机隔离业务路由。
- Chat_Handoff/00_READ_FIRST.md 说明的 source/current 与 source/design 路径在本轮提供的 Chat_Handoff 没有作为独立目录出现。其汇编/引用只能用已实际出现的内容验证，缺失目录标 UNKNOWN。
- 候选首期保持单 FITS。当前通用资产登记早于科学文件处理，未实现 SER/RAW/XISF/视频完整读取，也未实现进程中分块输出科学预览；未来多输入、多输出不受当前节点限制。
