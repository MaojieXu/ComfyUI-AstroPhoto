# 历史谱系、重复来源与冲突对账

<a id="reconciliation-lineage"></a>
## 版本谱系与证据身份

目录日期、正文日期、工作树提交、宿主进程版本和测试运行时间各有证据。下文简称 H16A、H16B、H18A、LAST 均指各自范围；现有编号按源文件命名空间解释。

| 来源 | 身份与演进 | 回查定位 |
| --- | --- | --- |
| H16A，.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-16_1 | 产品对话、长期 FR-01–08、ADR-01–15、C-01–15、验证清单和旧稿。正文明确其未读取本地仓库、启动宿主或运行 pytest/Vitest。v0.2 是需求版，Extension 与 MCP 的 0.0.1 是软件版。 | 00_README_交接索引.md:3–33,52–72,85–93；01_产品需求与范围.md:29–159；06_决策日志_冲突及待核验.md:5–150 |
| H16B，.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-16_2 | 包名日期 11-16_2，Sidebar 主交接日期为 2026-11-17 America/Chicago。产品 D-01–14、A–K 阶段演进、v1.59.1 固定版本官方源码调查、React FRD/Guide 与截图；随附的仓库校准在此前 06961ee 的工作树。 | AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md:1–9,42–66,69–120,216–324,1516–1570,1722–1783；嵌套 sources/01_CURRENT_STATE.md:20–26 |
| LAST，.artifact/Handoff/Last_Handoff | 28 个文件与 H16B 嵌套 AstroPhoto_Sidebar_Handoff_Bundle_2026-11-17 同相对位置 SHA-256 一致。包含 16 份旧项目 Markdown、两份后续 React 设计稿与图片等。README 说明该包没有执行实时宿主、Windows 工作树审计或发布。 | README.txt:1–17；sources/00_README.md:1–15,34–44 |
| H18A，.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1 | 旧 main@5e39fcf 加大量未提交实现的全局仓库核验。四个既有端口、两版本 pytest、默认 Jest/临时映射失败及真 Windows Siril CLI 均为历史运行。报告 81 项 Handoff 输入、62 个独立 SHA 值、149 个 Feature、65 个 Guard。 | 01_CURRENT_STATE_AND_VERSIONS.md:3–26；06_TEST_COVERAGE_MATRIX.md:3–36；11_HANDOFF_RECONCILIATION.md:3–37；evidence/integrity.txt:1–10 |
| 本次工作树 | Git 只读确认本地 main 与 origin/main 追踪引用均为 003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505。提交日期分别为 06961ee（11-16 18:04:37 -06）、5e39fcf（11-17 16:04:04 -06）、003c599（11-18 06:10:34 -06）。后两者提交树比较有 167 文件，旧包未提交工作树不等同于 5e39fcf 提交树。 | git log --format='%h %ad %s' --date=iso-strict；git show-ref --verify refs/remotes/origin/main；git diff 5e39fcf 003c599 --stat；git status --porcelain -uno |

历史 Handoff、草案、备份、子报告、重复导出及归纳进旧包的聊天文本均作为历史证据。新 H0 从零开始。旧包的审计次数、task note 状态和 archive 目录名不参与新计数。用户在本 Chat 指定的完整文件结构覆盖旧 note 的「少于 20 文件」要求。旧 note 仍保留其历史身份（.agent/notes/s8-handoff-2026-11-18-2.md:7–23）。

<a id="historical-duplicates"></a>
## 字节重复、内容演进和同名异义

- CURRENT_RUN 静态复核。遍历 LAST 相对路径，对 H16B 嵌套包同路径逐项 Get-FileHash SHA-256，结果 28/28 相同。Sidebar 主交接在 H16B 根、H16B 嵌套包、LAST、Chat_Handoff 四处同字节，SHA-256 为 5a8360eb7cafc710ac8e1c42af3b8db4399b2c4568639e4526e309a69dbe6ab2。各位置均保留引用，单次历史表述仍是一次事件。
- CURRENT_RUN 静态复核。用 Python hashlib 对 H18A evidence/source-hashes.json 的 461 个历史路径重新散列，445 相同、5 个旧 null 仍不存在、11 个字节有变，无新增缺失。变动为 .agent/notes/siril-autostretch.md、astrophoto/siril/{frames,previews,processing,software}.py、docs/{architecture,siril}.md、frontend/jest.config.cjs、frontend/ui/src/__tests__/siril.test.tsx、nodes/scientific.py、tests/backend/test_siril.py。字节比较支持复用既有源码审计，运行结果保持历史身份。变更文件及旧包未列的新文件须查当前版本。
- D01（H18A V3/Widget）、D-01（Sidebar 单入口）、ADR-01（单仓双包）、C-01（H16A V1/V3 冲突）、R1（LAST 旧宿主故障）各有命名空间。LAST 的 C01/H06 与 H16A C-01 有明确复述关系，保留原字面。H18A D 标签描述当轮消解，仍需保留原需求证据。B/A/N/F/M Feature 与 Guard/Test 的编号应沿用 H18A 所载关系；FR 长期目标关联多个独立 Feature。

<a id="historical-conflicts"></a>
## 决策冲突与去向

| 旧编号和材料 | 当前采用内容 | 历史条件、边界和验证 |
| --- | --- | --- |
| H16A ADR-05/C-01；architecture-migration.md:27–30；H18A D01 | V3 唯一；根 AstroPhotoExtension.on_load 注册，get_node_list 返回稳定 Vue 和科学节点，保留 vue-basic 和 CUSTOM_VUE_COMPONENT_BASIC。 | 脚手架曾采用 V1。用户纠正与实际入口各有证据。Drawing 保存恢复与 PNG→LoadImage 正式执行分开。根 __init__.py:12–45；backend-standardization.md:10–35。 |
| H16A ADR-01–02/C-03–05；LAST R2/R4/R10 | 本地版本锁、暂存 Registry 改写成 PyPI pin、先 PyPI 再 Registry，宿主环境独立。 | Runtime handshake、真实 Manager 路径、外部 MCP 环境升级与远程发布待独立证据。旧 PyPI 404 为历史查询，uv Workspace 用于开发。 |
| H16A ADR-07/C-02/C-10/C-11；LAST N06/N07；H18A D13 | FastMCP 4.2 单工厂，保留诊断契约，授权条件下六个设备只读工具。SkillsDirectoryProvider 条件接线，33 个产品 Skills 为候选。 | Catalog 也是合法机制，诊断输入框架差异保留，旧版 SDK 的 legacy/stdout 证据只适用当时环境。FastMCP Tool Search 与 ComfyUI 节点目录各有作用。fastmcp-42.md:16–38；H18A 06:8–9,34。 |
| H16A ADR-08–12/C-09/C-12–15、FR-02–08；H18A D03/D04/D14/D15 | assets.db 已有业务；Siril、部分资产与光路实施。RAG、Memory、显式 consent、多用户、完整 Capture Session/Calibrations/Sites、Canvas Bridge、长期实验仍待推进。 | 「无资产/软件/数据库」是当时事实。导入根授权与受信本机科学路径回退分开，三库长线目标不生成空库。保留科学原件精度，MCP 走公开 API。 |
| Sidebar D-01–04、D-09–14；H18A D02、D16 | 单入口三视图，宿主管主题和语言，取消 General 与观测地设置行，Node Library 使用真实注册数据。 | Emoji 尚未冻结，旧图适用当时讨论。旧语言选择器和设置模块断言已替代；长期 Trials/观测地要求继续保留。 |
| Sidebar D-05–08；FR-04；H18A D14 | 原生 ComfyUI 管画布、保存、Undo/Redo、队列。资产登记、FITS Source 与将任意资产拖入画布成为节点各需独立验收。 | 收藏使用宿主版本特定书签键，原节点分类与 ID 不变。已有资产登记，帧类型尚未进入可用 Asset Library 查询。frontend/ui/src/features/assets/AssetsPage.tsx:14–35,83–103；node-bookmarks.md:10–26。 |
| H18A D05–07、D18；原设备 v1.0；equipment-detail-accordion.md:10–26 | 专业设备字段、单光路配置、永久删除、旧 Revision 兼容 GET。用户取消历史版本 UI，滤镜仍多选，旧 DTO 状态字段保留兼容。 | 之前 immutable Revision 交互和旧快照 JSON 展示属历史，旧写 410。并行冲突重试及仅存在于旧快照中的引用提示待核实或定义。 |
| H18A D08–10、D12；siril-autostretch.md:10–20,33–40 | IMAGE_PATH 自定义端口为正式链路，Siril 1.4.5、三参数、候选与正式生命周期分离，显示预览按设置缩放，原件保留。 | ASTRO_FRAME 与 STRING 草案保留时间线。文本节点原样传递，处理节点独立验证来源。取消早期硬 cap 和处理超时为有记录选择，大负载仍未量测。 |
| H18A D11、旧 Siril Chat 只读条款；siril-autostretch.md:22–27,35–36 | Inspector 可编辑并同步实际 widget，保留只读/仅选择和单色限制。 | H18A 当时的通用 JSDOM 只覆盖详情；后续存在生产入口的 JSDOM 和一个版本的隔离真宿主证据。 |
| H18A D17/P0；LAST R1/R3/R5–R12 | 默认 Jest CSS 与 Siril fixture/导航项后续修正；绘图像素、中文 tooltip 已修。正式 IMAGE、上传响应字段、Ruff hook 和远程发布证据仍待验证。 | frontend/jest.config.cjs:7–12 有 CSS mapper；.agent/archive/react-jest-siril-regression.md:9–28 报 47 pass；.agent/notes/react-sidebar.md:34–44 保存两阶段。base Conda 故障与隔离 comfyenv 成功对应不同环境。 |

<a id="history-executions"></a>
## 失败、跳过、真实测试与尝试的历史链

| 原始位置 | 内容与适用范围 |
| --- | --- |
| .agent/notes/architecture-migration.md:19–38；backend-standardization.md:19–45；.agent/archive/handoff-reconciliation.md:13–28 | base Conda Python 3.12.4/Torch 2.3.0 在 comfy_kitchen 需要 torch.library.custom_op 时先于插件加载失败，Core/aiohttp TestServer 独立通过。PyPI 0.0.1 曾 HTTP 404。历史仓库核验在 3.11/3.12 各 root22+1 host skip、MCP52，Chromium6。 |
| .agent/archive/latest-handoff-reconciliation.md:13–31；.agent/notes/react-sidebar.md:16–44 | 七个前端文件/构件在旧审计时并行变化，逐文件散列并复读。115 项为 root15+MCP52+React33+Vue9+包装5+host HTTP1，两个 MCP build 用例因避免安装依赖排除。comfyenv 的 status/schema 与旧正式 IMAGE 失败同时成立。旧 UI 建图缺少 undo，补 canvas 与 graph 两层事件更正。早期像素/IMAGE 是实际两项失败。 |
| .agent/archive/drawing-persistence.md:7–28；sidebar-host-settings.md:7–32；storage-comfyui-frontend.md:17–33 | 300×300 PNG 像素往返、旧空值、坏 payload、locale 回归已验证；宿主 16 项使用显式 --skip-image-execution。8199 locale/主题实测拦截写入；第二隔离实例 storage-host 等待侧栏超时，后续启动命令被拒。Storage 后续纯打开和取消不能等同实迁移。 |
| .agent/notes/local-storage.md:20–36；.agent/archive/equipment-optical-train.md:17–29 | 储存专项以前跑过真实 C→D 迁移、跨卷引用、隔离宿主复制与重启持久化；拔插、盘符重映射、反代、非 Windows、LoadImage 标 NOT_RUN。设备历史基线两版本各 70、MCP67、React40、Vue9、8201 七页及两个 Revision 重启、真实 stdio 读工具与拒绝写入。当时仍处于多 Revision 阶段。 |
| .agent/archive/equipment-review-tests.md:10–29；.agent/notes/equipment-delete.md:10–25 | 删旧 Revision 后、重建 trigger 前故障注入证明事务能恢复，成功重试仅影响目标光路。专项根 82/4 skip，跳过 Siril CLI 两项和第二卷两项，隔离宿主 8211 有显式 --verify-delete；并行冲突重试风险仍在。详情 Accordion 在另一次运行 40 pass/4 navigation fail，专项 7 pass（equipment-detail-accordion.md:14–26）。 |
| H18A 06_TEST_COVERAGE_MATRIX.md:7–20；evidence/test-runs.md:5–26 | 两版本 root83/3，MCP 各 67，Vue9。默认 Jest 4 suites/13 tests pass，6 suites 未收集，exit 1。两个探针命令拼装失败。临时 CSS mapper 后 46 pass/1 fail，Siril fixture 缺 enabled 与旧详情入口后续被更正。8207 浏览器只放行 GET/HEAD/OPTIONS，宿主写工作流、迁移及跨卷未执行。 |
| .agent/archive/react-jest-siril-regression.md:9–28；.agent/notes/siril-autostretch.md:22–36 | 两项方案 A 后默认 Jest 47 pass，未跑真实宿主/CLI。后续记录 51 个 JSDOM、84/3 pytest（含真 CLI）、真实隔离 ComfyUI 路径链 b4b3983a-e730-4d80-a85a-2bccdacbb914。8206 未载入 Astropy 后失败，8207 加独立依赖路径后通过 75def43a-cd64-4f59-a70d-97070a5c31c4。79/3、83/3、84/3 和 React45/47/51 属不同验证过程。 |

用户明确未授权测试的小次变更详见 .agent/notes/equipment-single-select.md:13–18、equipment-tab-navigation.md:13–20、node-bookmarks.md:16–26。相关历史 NOT_RUN 不随其他测试成功而改变。

<a id="historical-review-limits"></a>
## 范围与缺口

本专题逐行读取 14 份 archive、11 份 notes 和 H16A 的交接索引与决策冲突正文，核对原需求与测试章节编号和定位；读 H16B/LAST 的 Sidebar 交接入口、用户控制的决策表、LAST 的校准 ADR、冲突/反向证据与 R1–R12、README 与工作树记录；读 H18A 的版本、测试、对账、遗留、源码补充与完整性证据。合订副本、旧指南和未单独引用附录由迁移清单登记，本专题未作逐段人工断言。PNG 以字节身份参与查重，界面语义留给前端专题。本专题执行 Git、文件散列、当前配置和入口的静态复核。

- LAST 主交接第 2.1 节记载旧审计包清单中的部分原始 evidence 日志未随对话上传。.agent/archive/latest-handoff-reconciliation.md:16–28 记录此前 33 个旧日志和原 ZIP 缺失。H18A 日志为另一轮验证。共享对话链接曾超时，本专题未取得其中消息。
- .artifact/Handoff/Original_request/设备板块/设备管理与光学链路前后端需求规格.md 是零字节，保留空原件及缺第三份正文的事实。两份非空原件各有原位置。
- H18A 11_HANDOFF_RECONCILIATION.md:35–37 记载 Sidebar 主交接提及的 source/current、source/design 独立目录缺失。H16A 是整理稿，Sidebar 是对话交接，未取得的逐条原始消息与窗口仍保持未知。
- 端口证据属于 H18A 的历史环境。8199 无科学节点，8201/8205 各为不同旧契约，8207 当时是 IMAGE_PATH。四个进程当时提供相同磁盘 JS/CSS，不足以确认目前进程或后端版本。


## 迁移中的去重与编号去向

- 231 个历史实体中有 183 个不同 SHA-256，28 组同字节，重复额外实体 48 个。所有原路径和输入版本都在包内。
- 全部捕获范围中，对 1906 个逐段同文实例共用正文，保留每个来源事件。不同字节和不同来源义项继续共存。
- 572 个旧编号具有显式声明索引，其中 354 个有多个上下文候选。同名候选保留历史、出处与原因。这里的数量是多目标映射，不能当作待裁决产品冲突数。经核对的实际冲突由正文逐条说明。
- state 版本账记录本次结构化迁移后的版本；迁移前的正文变体随独立原文和现有 HISTORICAL_QUOTE 事件入库。迁移补登产生 CHANGE 事件描述的是上下文登记时间，旧决定/测试/错误的发生时间按各证据引用。
- 旧 archive 与 v2.2 自动归档没有迁移绑定。所有历史正文字节和事件均按原证据保留。

[旧 ID 映射](migration/OLD_ID_MAP.md) · [完整映射](migration/OLD_ID_MAP.json) · [逐范围去向](migration/SOURCE_COVERAGE.jsonl) · [逐事项反向证据](migration/ITEM_PROVENANCE.jsonl) · [全量原文件](migration/HISTORICAL_SOURCE_INDEX.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/11_HANDOFF_RECONCILIATION.md)

```markdown
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
```

## H0 关闭记录

用户接受现有资料快照作为项目基线。原 INCOMPLETE 草案结果保存在引擎快照和历史执行回执，正式首轮使用本包同名 Handoff ID。现有资料去向已重新核对，旧编号歧义与证据缺口保持待判。此次 H0 只建立基线，空闲累计从后续合格轮次开始。[正式范围](migration/BASELINE_ACCEPTANCE.md)。
