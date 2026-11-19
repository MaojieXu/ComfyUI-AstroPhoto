# Storage、Assets、设备与光路 · S8 分域来源核对

基线为 `main@003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505` 的当前工作树。SOURCE 指本轮查到的当前代码或有定位的历史文本，HISTORICAL_RUN 指既有执行回执，INFERENCE 指基于调用链推断的风险。此分域回执没有执行新业务测试，没有访问、删除或迁移用户数据。

来源简称：FRD = `.artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md`；GUIDE = 同目录 `AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md`；L = `.artifact/Handoff/Last_Handoff/sources/`；S8_1 = `.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/`。旧 ID 在原文件范围内有效，例如 REQ/矩阵编号和多个分域重复的测试编号不凭字符串直接合并。

## 决定、需求与演进

### D03 · 多 Workspace、独立 Cache 与落地范围

SOURCE。旧 L/06_DATA_MEMORY_RAG.md:3–10 当时仅有配置读取；后续 Storage v1.1 实现多 Workspace、独立 Cache、显式导入及可恢复迁移。S8_1/11_HANDOFF_RECONCILIATION.md 的 D03/D15 和 `.agent/notes/local-storage.md:14–36` 保留首期背景。工作区是受管资产及产物位置，Cache 可换目录但不自动搬旧缓存，两者都不能通过定位或注册任意覆盖既有目录。系统维护唯一默认 Workspace，允许多个可用的独立 Workspace。产品基线两份本地文档曾在 `.artifact/Local_Storage/`（`docs/local-storage.md:13`），现路径中该目录缺失；现存工作笔记、代码和历史回执可核实实施，无法证明全部原始条款或产品原话已恢复。建议保留为来源缺口 SRC-STORAGE-ORIGINAL。

### D04 · 导入授信与 Siril 专用直读

SOURCE。Asset Import 的 reference、copy、预检和外部引用重定位保留 `ASTROPHOTO_IMPORT_ROOTS`；受保护的 Data Root、活动/保留工作区和 Cache 不可当作导入根内的素材路径。Siril 的经验证直接 FITS 路径是另一消费者，经过科学验证与本机部署边界，不能作为通用 Asset Import 授信放宽的证据。对应 S8_1 D04、`astrophoto/assets/imports.py:29–42,213–217,241–245`、`astrophoto/siril/frames.py:17–36`。原始 Siril 需求首行补丁、旧 ASTRO_FRAME 示例和当前 IMAGE_PATH 细节归科学节点专题。

### D05 · 设备仅做档案和组合

SOURCE。L/02_REQUIREMENTS.md:84–103 的较宽长期需求保留（素材科学元数据、拍摄会话、观测地与校准），MVP 采用 FRD:14–29 的 Camera、Telescope/Lens、Optical Accessory、Filter 四类。滤镜轮、赤道仪、ASCOM/INDI、设备发现与控制、采集执行、光路画布、自动读拍摄参数与自动生成校准结果不属于该模块 MVP。设备入口是 Settings → Equipment & Optics，维持 Nodes / Assets / Settings 三个宿主主视图。内部 My Equipment / Optical Trains 两视图，默认设备；设备列表、类型选择、表单、详情和光路列表、编辑器、详情共七状态。用户后续决定以摘要卡片和分组 Accordion 展示，复用官方风格和宿主主题/locale。依据历史决定 D05、FRD:18–29,33–67 和 `docs/equipment.md:5–18,62–92`。

### D06 · 单配置替代新历史版本生产

SOURCE / HISTORICAL_RUN。FRD:23–28,443–503 的发布、派生、固定默认多版本，以及 GUIDE:368–420,1029–1039 的不可变历史写能力属于旧产品方案，当时通过了相应的浏览器和 SQLite 测试（`docs/equipment.md:93–119`）。S8_1/11 的 D06 记载后续用户纠偏为「不需要历史版本，删除历史版本」。现行行为为每条光路一份原位编辑配置；历史数据按兼容读保留，现行常规界面无历史发布或默认版本切换。API 历史列表与详情 GET 仍读既有数据，发布 POST 与默认 PUT 回 410；已有历史资源 PATCH/DELETE 校验存在再回 409；经用户确认整条光路永久删除则原子清除这条光路的历史、默认指针和当前配置。不要用旧验收证明当前支持新 Revision，也不要把不再创建历史理解为普通启动会清除旧记录。业务状态 D06 = 新写功能已替代，保留旧结构的读/删除兼容。

### D07 · 删除与引用保护

SOURCE。FRD:332–349 主张引用中的设备只能归档，未引用才允许永久删除；较新历史 D07 和 `.agent/notes/equipment-delete.md:7–25` 接受设备和光路详情的红色永久删除操作，使用可信浏览器授权和版本检查。现界面有引用时点击删除显示引用光路并停止，服务独立拒绝引用设备（旧笔记说“禁用”需按实际 UI 细化）。单条光路整链删除原子移除其历史与配置，保留设备；取消确认不发送请求；错误/409 可复查当前记录。引用信息内仍有历史 revision 来源，旧引用与当前引用在普通 UI 中的表达不足。旧审查另有“光路删除复用设备文案”历史观察，现 `OpticalTrainDetails.tsx:32–35` 的确认标题和描述使用光路专属翻译，公共按钮 “永久删除” 属通用动作。

### D15 · 设备统一 assets.db 与旧库安全

SOURCE。旧 `docs/local-storage.md:26` 的两条 Alembic 迁移和 session_id 回填是历史实现。设备 GUIDE:193–242 与 D15 采用开发期统一固化单基线 `0001_equipment_baseline`，不作为生产旧库许可。实际启动遇到旧库或相同版本定义不符，返回 `DEV_SCHEMA_RESET_REQUIRED`，保留字节与既有路径；测试使用隔离新根。SQLite 配置 WAL、每个连接外键、3 秒 busy timeout、quick_check / foreign_key_check、schema 版本与定义/触发器检查加 storage_identity。6 张 Storage/Assets 表、11 张 Equipment/Train 表及 alembic_version。未发现本期共享库中建独立 Observing Sites、Capture Session、Knowledge、Memory 或实验表的依据。见 `astrophoto/database/manager.py:45–144`、`astrophoto/database/migrations/versions/0001_equipment_baseline.py`、`docs/equipment.md:20–39`、`.agent/archive/equipment-optical-train.md:23–29`。

### D18 · 光路状态界面与选择行为

SOURCE。FRD:418–454 的旋转角、Flat 适用、变更备注表单和显式发布流程由后续用户纠偏替代；配件顺序、滤镜集合及同款下拉多选保留。当前编辑器给名称、备注、单选相机/主光学、可排序多配件和多滤镜，仍保留后端兼容字段，不在表单引入图形画布。有效焦距 = 已知标称主光学焦距乘所有已知配件倍率，缺必要参数或选项失效时显示未知，焦比还依赖非空口径，估算不是实测。光路状态码 `published` 沿用历史协议表示配置含相机与主光学，UI 显示「已配置」；只有不齐时可保存不完整状态，不生成新版本。见 `OpticalTrainEditor.tsx:9–10,18–73,104–128`、`OpticalTrainDetails.tsx:17–23,41–54`、`astrophoto/equipment/schemas.py:192–196` 和 S8_1 D18。

### FR-02 · 长期资产、设备与观测地

SOURCE。L/02_REQUIREMENTS.md:84–103、L/06_DATA_MEMORY_RAG.md:7–11 保留按 Capture Session、目标、设备/滤镜、Frame Type 索引的长期意图，以及 Light/Dark/Flat/Bias/Dark Flat、Master、Target、Site、分类科学 Header 和可解释校准场关系；用户源图须保留。地理坐标最小披露；观测地数据中的辐亮度、SQM、Bortle 和现场测量各有独立证据。当前 `asset_sessions` 只存关系键，没有名称、时间、Capture Profile、主观测实体或校准匹配；设备与素材未绑定。设置中删去观测地行属于 UI 纠偏，不取消未来产品意图。S8_1 D14、`astrophoto/database/models.py:28–62` 与 `AGENTS.md`。

### FR-EQ-01 到 FR-EQ-11 · 原设备验收映射

SOURCE。保留 FRD:151–345 全文作为需求来源。FR-EQ-01/02 是按名称、厂家、型号搜索与分类/归档筛选、无结果/加载/错误区分；FR-EQ-03 是先选类型再填表，不先创建；FR-EQ-04 到 08 是通用字段、相机、主光学、配件、滤镜专业规格；FR-EQ-09 为验证、后端实回执、取消不留记录；FR-EQ-10/11 是摘要/详情及引用、归档和受保护删除。类型与名称必填，专业未知可留空；GUIDE 的要求分歧按 FRD 优先处理，具体光学/配件/滤镜子类可空。相机 Mono/OSC、三态制冷、分辨率/像元物理参数和可选读取模式的增益/偏置；主光学焦距/口径、配件倍率及 Backfocus 等只在适用类型显示；滤镜多个有序 Passband，波长和单位如原文，不从同名目录或硬件探测自动填。完整字段、允许范围见 FRD:230–307 与 `astrophoto/equipment/schemas.py:70–168`。源需求映射 A-10/11, A-24–30 → GA-09/10 → T-EQ-SVC/T-EQ-API。

### FR-OT-01 到 FR-OT-08 · 原光路验收映射

SOURCE。FRD:376–503 的列表、搜索、归档，Camera/Optics 单选、配件有序、滤镜多选、多窗口并发保护保留；快速增加缺失设备后返回光路编辑器，尽可能选中新设备并保持原未提交值（Story F:552–561）。可在光路间复用设备，从当前合法设备看展示属性。FR-OT-04 原状态编辑表单由 D18 替代，FR-OT-05/07/08 的新版本生产部分由 D06 替代，旧读及参考完整性仍须维护；FR-OT-06 “不能覆盖其他窗口”保留业务意图，服务 CAS 已有，普通 UI 设备冲突重新提供旧完整表单的新版本风险见 R-EQ-CAS。源需求映射 A-12–14, A-31–44 → GA-09/11/12 → T-EQ-SVC/T-EQ-API。

## 当前入口、契约与防护

### F-STORAGE-BOOTSTRAP · V3 生命周期、数据根与数据库

SOURCE。保留旧 Feature B-01–05/B-17/B-36、Guard GB-03/04/06/11/12。V3 `__init__.py::AstroPhotoExtension.on_load` → `astrophoto/bootstrap.py::host_runtime` → `storage/runtime.py:46–74`。初始化需要可支持的绝对本地根（默认 `~/.astrophoto`，覆盖 `ASTROPHOTO_HOME`），无导入、React UI mount 或节点执行隐式初始化。Bootstrap FileLock 内校验根、读/建 manifest、settings/数据库，关联 instance_id、workspace/cache ownership 和 SQLite storage_identity。确认初次必需目录和标记后原子写 initialized；重启后恢复 Siril runs 和业务 operations。损坏/缺失/不兼容进入诊断；不会自动擦除非空或不兼容已有库。状态路由占用先验证，同插件 runtime 重挂复用；其他占用拒绝。公共 GET status 返回 version、路径与 capability；仅返回 capability 无法证明业务成功。

### F-STORAGE-WORKSPACE · 多根、重定位与移除

SOURCE。B-07–10/B-19–25，GB-01/03/04/06/07。共有 API 基址 `/astrophoto/v1`，GET `/storage` 为可信端快照；未授权时回 200 unavailable 且不含具体工作区。PATCH `/storage/settings` 接 revision 及 imports/workspace/cache 和合法 preview 字段，原子写配置，409 冲突。POST locations 引入空目录 ownership marker；PATCH locations 的名称/启停和设置默认按校验后的 revision，默认不可禁用；POST validate 试建临时文件；POST relocate 验原标记不在且目标是同 instance/Workspace 的正确 marker，只重新绑定目录；DELETE 非默认空且无活动操作的注册项只删 DB 行。实际路径/DB/租约分层处理 UNC、本地 volume、链接/reparse、跨保留根重叠、路径越界、默认与引用限制。见 `api/storage.py:38–82`、`storage/runtime.py:76–92`、`storage/locations.py:32–36,64–100,124–236`、`storage/paths.py:12–92`。

### F-STORAGE-CACHE · 独立缓存、拥有者、限额与清理

SOURCE。B-11/12/B-26–30、GB-05/10。配置新 Cache 根确认身份并检查 revision，不复制或自动删除旧目录。已知 bucket（预览与 Siril）以 UUID 和描述符存条目，限额和磁盘可用空间独立检查。读取/清理先校验根身份、条目 marker、单硬链接与普通文件、租约；未知、活跃、非自有文件跳过；范围仅已知 bucket/all，返回 removed/skipped/failed。Siril scratch 只清自己 marker 下已知文件名。描述符和内容写入是两步，部分失败可能留孤儿描述/文件，历史 BK 审计没有复锤所有组合。见 `storage/cache.py:30–80,80–155,156–212`。

### F-STORAGE-MIGRATION · Workspace 迁移与恢复

SOURCE。B-13–16/B-31–35、GB-06/08/09。提交 POST migrations 创建相同请求可安全重试的 operation；同键不同输入冲突。锁内冻结目标空性与 inventory，文件 staging 和同卷无覆盖发布，各文件 SHA256 与源变化复核；再写目标 marker，DB 中同一事务 rebind + committed，恢复时核验目标标记和清单，完成后清自有迁移 marker，原源保留。失败/取消且目标已写可保留中间文件；已 committed 只向完成恢复，不撤销。API status 隐藏内部 receipt 字段；cancel 在安全 checkpoint 检查；retry 对终态只返回状态，重试接口 202 不是一定重跑；启动恢复与锁竞争由持久记录/进程间租约支撑。见 `storage/migration.py:24–170`、`storage/operations.py:29–126`。

### F-ASSET-IMPORT · 预检、引用、复制与资产回执

SOURCE。A-01–06/A-16–20 → GA-01–06。React `AssetsPage` 和 `ImportDialog` → `POST /assets/import/preview`（不写资产，返回范围、模式、目标、限制及保留原素材状态）→ 用户确认后 `POST /assets/import`（同键同请求返回既有 operation），operation 可查询、取消、重试。授权根下选 1–100 路径、目录最多 10000 项和 40000 访问，无法读取的单项保留失败回执。Reference 保存规范化路径及 stat，不拷贝；同路径和相符 size/mtime 跳过并可新增 session link，不符报 `DUPLICATE_ASSET`。Copy 明确目标 Workspace，先租约和空间检查，再复制到 owned staging，发布无覆盖、登记 managed 及对应 receipt 同事务，校验等级 size_and_stat，原件独立保留；同内容不同 key 可独立复制。根授权在执行复核；源变化保护、取消边界与 crash 后重入保护见 `assets/imports.py:29–152,153–269`、`api/assets.py:17–28,53–63`。全项目通用导入没有科学格式解码；FITS 数据校验属于科学消费者。

### F-ASSET-LOCATION · 列表、失联、重新定位与会话

SOURCE。A-07–09/A-15/A-21–23 → GA-07/08。GET assets 游标分页及关系键，managed 用 workspace_id + relative key，external 保存路径。GET availability 验真实资产与文件；POST relocate 只接外部引用，校验根/可访问性/文件大小、重复引用路径；保留 Asset ID 更新 path/name/mtime，不靠内容哈希证明同一文件。PATCH sessions 仅是 attach/detach 关系，空/非字符串/超 120 及非法类型拒绝。未找到通用资产实体删除入口。见 `astrophoto/api/assets.py:10–14,31–50,53–63`、`astrophoto/assets/service.py:14–21,35–41,67–112`。相关缺口 R-ASSET-IDENTITY、FR-02。

### F-EQUIPMENT · 设备服务、表单及删除

SOURCE。A-10/11/A-24–30 → GA-09/10/13。GET/POST equipment、GET/PATCH/DELETE equipment/{id}、POST archive/restore。后端 UUID 游标、limit 1–100、名称/厂商/型号 casefold、过滤、数据状态与独立 DTO；创建给 201，删除给 204 带请求 ID。客户端 `frontend/ui/src/api/equipment.ts:36–64,103–117` 读返回结构后渲染。服务 `equipment/service.py:30–60,92–163` 以 BEGIN IMMEDIATE 和 CAS 同事务保存设备父表、专业规格、读取模式和多通带；`equipment/schemas.py:32–219` 拒绝格式、额外字段、不合法枚举、类型、非有限/重复/越界，数据库独立约束。`EQUIPMENT_VERSION_CONFLICT` 或 `EQUIPMENT_REFERENCED` 不删设备；引用查询同时覆盖活的工作配置和 legacy revision。界面按当前真实 `usage_summary` 显示用户可追到的光路；无引用才请求确认和服务删除。历史-only 引用需 R-EQ-HISTORY-REF。

### F-OPTICAL-TRAIN · 光路读写与历史兼容

SOURCE。A-12–14/A-31–44 → GA-09/11/12。GET/POST trains，GET/DELETE detail，GET/PUT draft，archive/restore；`create_train` 允许初始配置，缺相机/主光学可保存。草稿保存校验 `expected_draft_version`、归档 train 及组件存在/类型/重复；配件顺序和滤镜集合进 SQLite；旧历史只读路径语义详 D06。DTO 优先 saved draft，缺时用原 default 或最近 legacy snapshot，经 snapshot validation 再转当前配置，详情用现有设备名称/字段；修改设备会影响当前展示，不修改旧 snapshot。当前后端组件验证检查存在和类型，未拒绝 archived equipment，UI 可选列表过滤 archived，既有选值给禁选/无效标记。whole train 删除检查 row_version，在同一 SQLite 写事务内清默认、现配置和旧历史，临时解除并重建 immutability DELETE trigger；错误事务回滚。见 `astrophoto/api/equipment.py:39–103`、`astrophoto/equipment/trains.py:44–97,99–212`、`astrophoto/equipment/snapshots.py:13–43`、`frontend/ui/src/features/settings/equipment/OpticalTrainEditor.tsx:18–59`。

### F-EQUIPMENT-UI · 官方控件、导航、状态、冲突

SOURCE。FRD:60–119,563–699 和 GUIDE:695–852。设备页复用 SidebarTabs、SearchField/SearchOptions、ComfySingleSelect 与 ComfyMultiSelect，沿用 v1.59.1 官方源码适配。Narrow、键盘、宿主主题及国际化是有效验收，见历史执行边界。分别保存设备/光路搜索筛选；点当前或另一内部标签走统一 leave guard 并回对应列表，dirty 需要确认；原宿主 Sidebar close/remount 保留未提交 session 草稿，hard reload 的 beforeunload 只给离开提示，不保证草稿落盘。快速新增设备成功回原光路、组装选中新值；状态依赖真实 API 返回，保存中阻挡重复，error 保留输入。不复用浏览器 History 或新增宿主标签。详情用摘要/Accordion、跳转到相关设备/光路；旧“raw JSON 历史详情”条目随不再展示历史流的决定失去当前优先级。 `EquipmentPage.tsx:23–83,123–166`、`EquipmentDetails.tsx:15–63`、`OpticalTrainDetails.tsx:16–70`、`.agent/notes/equipment-single-select.md:7–24`、`.agent/notes/equipment-tab-navigation.md:7–23`、`.agent/notes/equipment-detail-accordion.md:7–26`。

### F-STORAGE-EQUIPMENT-ACCESS · HTTP 安全与错误合同

SOURCE。B-17/18/B-37、GB-01/02/03/12、GA-13、GUIDE API-01/04/05/08/09。原生 aiohttp RouteTableDef，通过共享 handler 将业务 I/O 放至线程。要求显式 `ASTROPHOTO_LOCAL_STORAGE=1`、回环监听、单用户、无 CORS，检查 remote/Host、同源 Origin、Fetch Metadata 和转发头。Storage 浏览器请求需 `X-AstroPhoto-Local: 1`；Equipment 浏览器路径另要求 Fetch-Site= same-origin。独立 MCP bearer 只读，禁止 Origin/Fetch Metadata 混入 GET，直接回环，合法 token 43–256 ASCII 安全字符、常量时间比较；仅六个 Equipment/Train GET Tool，没有写 Tool 和直接 DB。JSON 写字段检查及 64 KiB 限制，错误携 request_id：授权 403、资源 404、版本/引用 409、旧发布/默认写 410、忙锁 423、参数 422 或设备 JSON 400、依赖 503、空间 507、意外 500。由 `api/security.py:18–64`、`api/storage.py:106–155`、`api/errors.py:14–39` 和 `api/routes.py:15–37` 佐证；此边界信任同一台机器的特权进程。不要把联合坏请求拒绝归因到单一 header。

## 测试、错误、跳过、尝试与未完成事项

### T-STORAGE-SVC · 真实临时 SQLite/文件断言

SOURCE（测试定义）与 HISTORICAL_RUN（日志）。`tests/backend/test_storage.py` :52–134 验幂等/显式初启、并发与 busy/外键/回滚/backup；:135–175 验多个 Workspace、默认禁停、临时移动目录后同身份重定位、Cache owned entry 与 lease；:176–218 验多个授权根、reference mode 快照、真实复制字节与幂等；:219–300 验 offline/read-only/full/unauthorized 在预检拒绝、源中途变化阻止登记、已 publish 尚未入库后恢复、part 取消；:301–418 验切换前后故障、真实内容哈希错误使源权威不变、真实子进程退出后自有 staging 恢复和多会话 reference；:419–498 验危险路径、真实第二卷 opt-in、WAL 失败、保留 legacy schema。对应旧 T07–T19/GB-04–11/GA-01–08。现场盘权限或物理掉电未因模拟通过被证明。详 S8_1 `evidence/test-results/python-extension.{log,xml}`。

### T-STORAGE-API · 原生 TestServer 与前端

SOURCE。 `tests/integration/test_storage_api.py:14–91` 验授权/不可信请求、revision/conflict、无权限路径/预检/导入/状态、文件与关系等样本；:92–108 验错误配置仍保留 status 注册和诊断。 `frontend/ui/src/__tests__/storage.test.tsx:24–121` 验设置成功/失败后的选值、迁移后服务回执及刷新路径、Host confirm 后清缓存和回执；使用测试替身而非实机写入。HISTORICAL_RUN `docs/local-storage.md:126–143` 记录当时真宿主四组浏览器、重启、SHA256 字节验证；`.agent/archive/storage-comfyui-frontend.md:19–33` 的重做界面仅实机打开与取消，业务写入回归为 React 测试。无法以一者替代另一次运行范围。

### T-EQ-SVC · 设备与光路持久性、并发与不可变保护

SOURCE。`tests/backend/test_equipment.py:47–116` 各类专业字段、版本/归档/恢复、多通带、未知值、分页重复型号与保存中断全回滚；:117–147 直接 SQLite 约束、相同版本结构不符保留和缺组件/错误类型；:148–188 并发保存后过期版本被拒、当前 DTO 读取最新设备规格；:210–237 默认版回退且不重写旧实际 snapshot；:238–276 旧历史删除途中注入异常，断言默认指针、配置、快照和触发器恢复，重试只删目标光路并保留其他设备/光路。对应 GUIDE DB-01–17 中当前适用项与旧版意图；旧 DB-12/13/15 的新发布、并行发布/default 调整已替代，不能用旧 PASS 覆盖。HISTORICAL_RUN 来自 S8_1 日志与 `.agent/archive/equipment-review-tests.md:10–20`，后者附 18 项专项。

### T-EQ-API · 权限、返回与原生路由隔离

SOURCE。`tests/integration/test_equipment_api.py:15–101` 验未授权和 Origin/Proxy 拒绝，合法浏览器写与只读 bearer、错误凭据、非法字段/UUID、409/422/410、永久删除 204；:104–114 验路由冲突不部分注册。只读 token 通过真实 aiohttp TestServer，测试不是 MCP→当前宿主端到端。独立 MCP MockTransport/stdio 与历史真宿主查询须分别取证。对照 GUIDE API-01–09、MCP-01–06 及 GA-13。

### T-EQ-UI · 设备界面与历史真实宿主阶段区别

SOURCE。`frontend/ui/src/__tests__/equipment.test.tsx` 测已引用设备阻止删除、取消确认、409、重新获取版本、204 后返回，以及两个列表共用搜索工具栏且独立筛选 (:195)。`.agent/archive/equipment-optical-train.md:18–21` 的 8201 真浏览器七状态、两 Revision、默认重启及 MCP 六查询属于单配置改动前；`docs/equipment.md:93–119` 记同批记录的 280/420/650 px、200%、主题、双语、键盘和 remount，保留而不直接继承当前验收。`.agent/archive/equipment-review-tests.md:16–23` 记 8211 真实 ComfyUI 0.45.0 / Frontend 1.59.1，`pnpm -C frontend test:equipment-host` 与重启后 `--verify-restart --verify-delete` 验历史阶段永久删除，写入限隔离测试数据；设备和光路产品规则后续仍可能演进。S8_1 真实 8207 是 GET + 浏览器只读/显示检查，更新后的当前浏览器全设备 CRUD、校准、数据持久写与 MCP token 真实宿主链路单列未跑。

### E-EQ-MODEL / E-STORAGE-PATH-ALIAS · 历史问题与更正

HISTORICAL_RUN。`docs/equipment.md:109–112` 记录早期浏览器编辑 DTO `model` 字段与内部函数参数名冲突，后以完整 DTO 往返回归修正；原先 Storage 宿主脚本用 Windows 短目录别名直接比较迁移结果，改用 resolve 后的绝对路径，重跑通过。原错误与更正都保留，证据晚于原失败不抹去事件，也不自动声称本轮复现。早期独立 ReACT 特定失败 `.agent/notes/equipment-detail-accordion.md:14–23` 的 40 PASS/4 导航 FAIL 和 7 项专项 PASS 是历史构建阶段；当前阶段不同结果分别留原日期/环境。

### SKIP-STORAGE-ENV · 外部介质、宿主与跨卷边界

HISTORICAL_RUN。`docs/local-storage.md:98–142` 早期隔离 host 53 PASS，独立 3.11 52 PASS/1 host skip、曾用真正 Windows C:/D: 做不同卷 reference 与 C→D 迁移；S8_1 各 Python 83 PASS / 3 SKIP，两个第二卷案例和未配置通用真宿主入口在通跑中跳过，另有 8207 的独立真宿主 GET；证据不可互换。实际物理拔插/盘符重映射、断电、商业反向代理与非 Windows 宿主仍未验证。故障注入与移动实际目录只是对应模拟，既有 PNG→IMAGE 执行仍独立未通过/未运行。详 `.agent/notes/local-storage.md:18–36` 和 S8_1 `evidence/test-runs.md`。

### R-EQ-CAS · 重新加载版本与双客户端更新冲突

INFERENCE / 已知风险。服务正确拒绝 stale row_version 或 draft_version。设备表单 409 由 `EquipmentForm.tsx:55` 触发重新请求，`EquipmentPage.tsx:153–158` 确认后用当前服务器设备执行重基线，现有编辑状态与 `api/equipment.ts:107–110` 的完整表单提交可带第二客户端已经改过的旧字段。光路编辑的旧值和新版本重新基线行为也需做真实双客户端、不同字段回归。历史 `.agent/archive/equipment-review-tests.md:23–29` 已报告，未表示本轮修复。后续产品取舍是逐字段比较/合并与明确重新加载，本交付只登记风险。

### R-EQ-HISTORY-REF · 历史专属设备引用与 UI 引用粒度

INFERENCE / SOURCE。`equipment/service.py:47–60,153–163` 保护草稿及旧快照，`EquipmentDetails.tsx:19–20,49–61` 平台主要列关联光路，未从操作结果区分“当前可解除引用”和“历史版本单独引用”。如果解绑当前配置后仍有历史-only 引用，服务仍拒绝设备物理删除；不能误导用户认为还存在当前配置引用。如何提供只读出处/指导解除须单独决定；目前整个光路删除可删其历史，放宽保护或移除单个历史仍不在授权内。

### R-EQ-ARCHIVED-LINK · 归档设备后端选择保护缺口

SOURCE / INFERENCE。`equipment/snapshots.py:13–22` 仅验证组件存在和匹配类型，`OpticalTrainEditor.tsx:26,43–52` UI 过滤归档项且既有选项可作为无效项展示。直达已授权 API 仍可能新关联归档设备。FRD:169 与 GUIDE DB-16 的“不能作为默认新选项”对应 UI 保证；是否要后端全面禁止后续修改复用或只禁新增需保持兼容性并等业务确认。历史 GA-11 支持，此处没有新执行。

### R-ASSET-IDENTITY · 业务身份与路径校验边界

SOURCE / INFERENCE。Reference 重复匹配基于路径、size 和 mtime，外部重定位主要基于授权根、可访问和尺寸；无法确认同尺寸不同内容总被识别。Copy 公开为 size_and_stat；Workspace 迁移 SHA256 与之独立，不能混为一套内容保证。强内容 hash 的性能、按需计算及向前兼容需要另行决策，当前真实原图保持只读。通用素材未分类、解码或推断科学数据，也是 FR-02 的部分完成解释。

### R-STORAGE-TRANSACTION · 文件系统与 SQLite 原子边界

SOURCE / INFERENCE。注册 marker 后 DB 写失败可留空 ownership；缓存 configure 新 marker 后设置写失败可留目录；Cache store 文件落盘而 descriptor 写失败可留未认领内容，clear 删数据后清描述失败留描述；迁移提交前失败目标可留自有中间文件，提交后恢复不能撤销。成功时各自守护的单位不同，不能把 DB 事务等同整个文件系统事务。历史 S8_1 B-21/B-26–30/GB-08–10：未定位完整故障专项矩阵，严禁根据测试题名填 PASS。

### R-STORAGE-PUBLIC-STATUS · 公共目录披露

SOURCE / INFERENCE。GB-12 `astrophoto/api/status.py:11,26` 状态路由绕过业务 handler，可返回绝对 data_home。业务路由未授权不返回路径不足以证明公开诊断相同。已知部署范围为本机受信单用户，真实代理部署及远端披露策略尚待单独裁决；无需为本迁移改代码。

### Q-STORAGE-SOURCES · 仍有来源缺口

SOURCE。两份设备原始正文实际存在，其同目录 `设备管理与光学链路前后端需求规格.md` 是 0 字节，须在覆盖账记录空文件哈希与无正文状态，不能用其他文件冒充。先前两份 Storage 原始 v1.1/技术指南在 `.artifact/Local_Storage/` 现缺，原文缺失情况由 `docs/local-storage.md` 和历史专题定位确认。旧共享讨论链在 S8_1/11 记载为读取超时；本分域未尝试越过已给的真实路径去访问外部分享。原始窗口或附件缺口与已经读到的 Handoff 摘要证据分别登记。

### ATT-EQ-REUSE · 历史复用、试验及写权限阻塞

HISTORICAL_RUN。`.agent/archive/equipment-optical-train.md:10–29` 原实施 WP-0–WP-7 使用既有 Host Lifecycle、Theme/Dialog、CRUD 安全、SQLite BEGIN IMMEDIATE、单 MCP 工厂，保持 workflow/domain 分离；设备/光路数据服务自行实现。录入 UI 技能适配选择使用 v1.59.1 官方 SingleSelect，仓库 notes 记录 design system 1.1.0 构件没有所需子路径，一并使用官方参考库 variant。GUIDE WP-6 与 MCP-05 的写工具前提仍未满足，当前明确只读，原开发期可重置决策不视作真实数据处理授权；旧的真宿主验证均用隔离 Data Root。现场迁移只可按用户范围更新 Handoff。


[稳定编号和逐项出处](migration/OLD_ID_MAP.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/09_STORAGE_ASSETS_EQUIPMENT.md)

```markdown
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
```
