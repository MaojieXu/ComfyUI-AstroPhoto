# 节点、Siril、科学预览及绘图链路审计

审计基线为 main @ 003c599dbfc92fc9bb27a0f244f1cfa1fa0f0505。SOURCE 表示本次读源码或当前测试定义，HISTORICAL_RUN 表示已有报告或日志，CURRENT_RUN 表示迁移本轮执行。本分域未执行产品测试、浏览器、真实宿主队列、Siril 或原始原型。表中实现状态以源码为依据，旧测试仍保留其原环境。

来源简称

- O-PRD 与 O-TDD 来自 .artifact/Handoff/Original_request/Siril_Integrate/ 中的 Siril 1.4.5 AutoStretch PRD v1.1 与 Engineering Development Guide v1.0。
- C01…C13 来自 .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/ 对应编号正文。C-Primary 指该包 source_materials/primary/。其中相同文件名的 PRD/TDD 与 O 下的文件只有两行插入差异，O 增补了 2026-11-18 契约变更块及空行，仍是独立版本。
- H07、H11、H12 及 H-Tests 来自 .agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/ 的 07_NODE_SIRIL_IMAGE_PATH.md、11_HANDOFF_RECONCILIATION.md、12_GAPS_AND_RISKS.md、06_TEST_COVERAGE_MATRIX.md 和 evidence/。H-NodeAudit 指其中 evidence/subagents/nodes-siril.md。沿用其 N、GN、D 历史 ID。
- Note 指 .agent/notes/siril-autostretch.md。DrawArchive 与 JestArchive 指 .agent/archive/drawing-persistence.md 与 .agent/archive/react-jest-siril-regression.md。档案位置不影响 H0 注意力状态。

## D01 · DECISION · V3 根入口与绘图旧 ID 延续

旧 ID H11 D01、H-NodeAudit N-01。AGENTS.md Architecture 要求保留 vue-basic、CUSTOM_VUE_COMPONENT_BASIC、Widget 序列化、翻译和 PNG→LoadImage→IMAGE。SOURCE __init__.py:12–45 返回四个 V3 Node，on_load 复用现有运行时或在线程中启动 host_runtime，随后注册 aiohttp 路由、绑定两类受控科学节点。测试注册表覆盖实际 ID，现有行为待真实绘图队列重新验证。关联 SIR-DRAW-PERSISTENCE、SIR-DRAW-IMAGE、SIR-REGISTRATION-TEST。

## SIR-DRAW-PERSISTENCE · FEATURE · 原生工作流绘图保存和像素恢复

SOURCE frontend/src/main.ts:17–47 用宿主 addDOMWidget 及 Vue 生命周期，删除 Widget 时卸载 Vue。VueExampleComponent.vue:33–87 将可选 canvasDataURL 放原生 Workflow Widget value，等待异步恢复并用翻译显示恢复失败；serializeValue 是独立原生 API prompt 路径。DrawingBoard.vue:232–245 先加载保存数据再绘制。DrawArchive 记载按用户授权只修工作流像素保全和中文画笔 tooltip，以 300×300 PNG 内嵌且兼容旧空值。历史旧 JSON 若从未保存 PNG 像素，重开无法推回缺失像素。HISTORICAL_RUN 见 SIR-DRAW-TEST。关联 D01、SIR-DRAW-IMAGE。

## SIR-DRAW-IMAGE · ERROR · 绘图委托真实 IMAGE 历史失败

SOURCE nodes/ComfyUIFEExampleVueBasic.py:6–26 使用 CUSTOM_VUE_COMPONENT_BASIC dict，image 字段必须为字符串，经宿主 get_annotated_filepath 调宿主 LoadImage，丢弃 mask 并返回 IMAGE。前端上传 PNG 的序列化路径仍存在。当前仓库约束及 DrawArchive 明确授权保留未修改边界，H07/H12 标有正式 IMAGE 老问题。宿主 stub / Schema / 绘图可恢复均不足以认定真实队列已修。保留待办是在隔离 ComfyUI 运行 PNG→LoadImage→PreviewImage 并记录错误或结果。关联 SIR-DRAW-TEST，H11 D01。

## SIR-DRAW-TEST · TEST · 绘图恢复通过与正式 IMAGE 跳过

HISTORICAL_RUN DrawArchive Verified 记载 pnpm -C frontend typecheck、check:build、9 Chromium 测试通过，覆盖 PNG round-trip、坏载荷、旧空值与翻译键。旧宿主 8188 的 COMFYUI_TEST_URL 与 pnpm -C frontend test:host --skip-image-execution 通过 16 项，graphToPrompt/handleFile 后重开实际黑色像素恢复，IMAGE 显式 SKIP。SOURCE tests/nodes/test_image_io.py:4–20 的 host LoadImage 为替身，覆盖委托返回和 None、空 dict、image=None、image=123 提前拒绝。关联 SIR-DRAW-PERSISTENCE、SIR-DRAW-IMAGE。

## D08 · DECISION · 首期采用 V3 自定义 IMAGE_PATH

O-PRD 和 O-TDD 第 3 行追加路径契约。C02:24–41、C05:32–106 与 H11 D08 记录更新，旧 ASTRO_FRAME → 一度 STRING → 最终 io.Custom("IMAGE_PATH")，值仍是服务器路径字符串。旧工作流 ASTRO_FRAME/STRING 连线需要重建，历史类型仍可作为未来科学数据方案的候选。保留源/候选/正式三种文件语义。Note Progress 可见中间版本及最终取代；docs/siril.md 首段旧路径仅说明当时来源。SOURCE nodes/scientific.py:10–25,40–61,64–109。老端口在旧 host 仍存在不影响工作树事实。关联 SIR-IMAGE-PATH、SIR-FITS-SOURCE、SIR-STRETCH-NODE、SIR-REGISTRATION-TEST。

## SIR-IMAGE-PATH · FEATURE · 手工路径值节点

旧 ID N-02，GN-01 中独立节点。SOURCE nodes/scientific.py:13–25 AstroPhotoImagePath 利用宿主 socketless STRING 文本控件输出相同路径值，无文件读取、无需 storage 或可信部署；对后续处理可见 IMAGE_PATH 类型。存储及文件验证由真正读取文件的节点负责。注册测试主动断言 UNC 字符串可作为原样值传递，读者后续仍拒绝此类输入。关联 D04、SIR-REGISTRATION-TEST。

## SIR-FITS-SOURCE · FEATURE · FITS Source 验证与资产身份

旧 ID N-03、N-11、N-12，产品 C04 LD-01～05、O-PRD FR-DT-01 及补丁。SOURCE nodes/scientific.py:40–61 的 AstroPhotoFITSSource 以自定义 ASTRO_FITS_ASSET picker 获取资产或兼容本地路径，resolve_input 后执行真实 FITS 检查，输出绝对 IMAGE_PATH 和 astrophoto_asset UI 身份。fingerprint_inputs 使用解析后的 stat，StorageError 返回 NaN；修改文件可触发重算。frames.py:17–58 以 canonical UUID 解析已登记资产，其他输入先匹配已登记位置，再回退本地路径。分页查询只按 .fit/.fits/.fts 后缀，查 101、返回最多 100 与 next，打开后才证明有可用像素。源码测试 40–54 以真 FITS 改写并断言指纹变化。关联 D04、SIR-FITS-READ、SIR-HTTP。

## D04 · DECISION · Siril 直读路径与资产导入根分开

旧 ID H11 D04、D19 与 GN-02/GN-09；O-PRD/TDD 第 3 行、C05 §5 给出较早授权导入目录措辞。H11 记载后续决定允许可信本机 Siril 读导入根之外的合规本地路径，Asset Import 仍依据导入根。SOURCE astrophoto/siril/frames.py:17–36、storage/manager.py:25–34、storage/paths.py:12–36 与 astrophoto/assets/imports.py:33–42。真实消费者拒绝相对、UNC、网络卷、reparse/link、含穿越或非普通文件路径；经过可信本机部署的 HTTP 和队列边界，进程自身的读取权限仍生效。后端接受纯路径回退的回归用例 tests/backend/test_siril.py:25–37；formal_run 仅路径、拒绝相对及 UUID，tests/backend/test_siril.py:87–90。前端候选请求则按 asset_id 或 image_path 区分。文档历史文字继续保留并标版本。关联 SIR-TRUST-GUARD。

## SIR-TRUST-GUARD · GUARD · 科学读取的部署与请求边界

旧 ID GN-01、GN-08、GN-11；关联 O-TDD §11.2、C08:56–76。SOURCE nodes/scientific.py:28–37 的受控节点需要 storage 和 trusted_local，失败分别 STORAGE_UNAVAILABLE、UNAUTHORIZED_STORAGE_OPERATION。astrophoto/api/security.py:18–43 与 api/storage.py:106–165 的 HTTP storage 共用 handler 要求显式启用、服务端直接 loopback、loopback Remote 和 Host、无 forwarded、同源上下文及 X-AstroPhoto-Local: 1；JSON 上限 65536 bytes、字段精确、受控错误与 request_id，并在线程执行。部署信任模型按本机单用户使用，源码与测试应继续核对共享/代理边界。关联 D04、SIR-API-TEST。

## SIR-FITS-READ · CONTRACT · 单帧 FITS、HDU 选择及只读规范

旧 ID N-05、N-13、GN-02/03。产品来源 O-PRD FR-DT-01、C05 §4，首期 .fit、.fits、.fts。压缩 FITS、TIFF/PNG/JPEG、RAW/XISF、SER 和多帧序列是后续独立输入契约。SOURCE frames.py:61–115 利用 Astropy readonly/memmap 且 do_not_scale_image_data，选择首个有效 2D mono 或首轴为 3 的 RGB HDU，验证头和图像尺寸，读取 BITPIX 与用于查看的基础头/WCS；异常 FITS_INVALID，前后 stat 不同 SOURCE_CHANGED。多个有效图时选择首个。SOURCE processing.py:57–111 仅修改临时副本，选择扩展 HDU 时引入 primary、去失效校验和，NaN/Inf 置零，BSCALE/BZERO 异常及非零偏移下的物理值转换均应作为处理规则保留。正式输出以实际元数据、位深、指纹和像素变化证据说明；WCS 可改写。关联 SIR-FITS-TEST、SIR-PREVIEW-RENDER、SIR-RESOURCE-RISK。

## SIR-FITS-TEST · TEST · 真 FITS 解析、内容与指纹断言

SOURCE tests/backend/test_siril.py:25–54,76–90。直接路径根外可读，丢失文件 SOURCE_NOT_FOUND，伪后缀 FITS_INVALID，实际节点输出路径并因真 FITS 重写改变指纹；真 RGB fixture 80×60×3、BITPIX −32、OBJECT 元数据、PNG 魔数和源字节不变，截断文件拒绝。formal_run 拒绝 UUID 及相对路径。多有效 HDU 次序、NaN/Inf 和高容量矩阵未在这些用例证明。旧专项 H-NodeAudit 中 test_frames_validate_precision_metadata_and_truncation 的文字对应当前 test_fits_inspection_validates_precision_metadata_and_truncation。关联 D04、SIR-FITS-READ。

## D09 · DECISION · Siril 1.4.5 CLI、算法三参数与用户安装

旧 ID H11 D09，O-PRD FR-SW-01～07、FR-ND-03、AC-01～05，C04 SW-01～07/ND-03,04、C06。目标 Windows UCRT64、macOS Intel/Apple Silicon 及 Linux 安装引导由服务端平台区分，首期仅官方 1.4.5 是兼容目标，Siril 独立安装。软件可以设置和探测，不隐式安装、升级、改 PATH、使用 sirilpy 或对工作流暴露内部 load/save 命令。shadowsclip 有限、缺省 −2.8 σ，targetbg 缺省 0.25 且 [0,1]，linked 为真布尔、产品默认 RGB true（原 CLI 不传是 false），单色归一为 false。旧 PRD 与当前结果都保留颜色校准后白平衡风险提示。SOURCE software.py:18–82,90–201、processing.py:24–54、nodes/scientific.py:64–82。关联 SIR-SOFTWARE、SIR-CLI、SIR-PARAM-TEST。

## SIR-SOFTWARE · FEATURE · 软件发现、探测和持久配置

旧 ID N-06、N-17、N-19、N-20、GN-05/GN-12。SOURCE software.py:24–53 检查绝对路径、平台可执行名/签名/可运行性。software.py:90–201 从 PATH 与标准目录查最多 8 个候选并分别实探，发现不保存；probe '-v' 上限 8s 并严格选 1.4.5，processing.py:114–134 的 15s 合成 RGB 实际检查输出数据变化与尺寸。保存需要探测成功、加锁前后身份一致，成功才写 settings 并启用。current 再核对已验证身份与 enabled，错误版本或探测失败保留此前有效配置，清除和停用各有独立操作。软件页 SOURCE frontend/ui/src/features/settings/SoftwarePage.tsx:7–68 + docs/siril.md 环境与路由说明。失败状态和重开保存证据见 SIR-JEST-REGRESSION。

## SIR-STRETCH-NODE · FEATURE · AutoStretch V3 正式队列入口

旧 ID N-04，O-PRD FR-ND-01～06、C04 ND-01～10，AC-04/05/09。SOURCE nodes/scientific.py:64–109 有 IMAGE_PATH 输入、三项 socketless Widgets、同类型 output_path、唯一节点 hidden ID 与 output-node flag。fingerprint 永远 NaN，使显式排队重验软件、源、当前 Workspace 并输出新资产。execute 复用原生取消 checkpoint，在 host client scope 发 transient astrophoto:siril 事件，成功携带 asset/source/原始参数给前端。后端正式入口校验服务器文件身份；同一个 AutoStretch 输出可直接给下游串联。关联 D08、SIR-CLI、SIR-FORMAL-RUN、SIR-REGISTRATION-TEST。

## SIR-CLI · CONTRACT · 固定 SSF 和可取消的独立工作副本

旧 ID N-07、N-15、N-16、N-18、N-21、GN-04/05/13；C05 §6、C06 §2、O-TDD §3/10。SOURCE processing.py:24–54,137–155 先检查空间与 CLI 身份、复制源文件并计算 SHA256、仅准备副本，用内部安全文件名和固定 SSF（requires、setcpu 4、setext fit、load input.fit、set32bits、autostretch、save result）。数值参数经验证规范化。软件子进程 offline、独立 config/cwd、无 shell 或 stdin，按 checkpoint 轮询，在失败/取消/探测超时时 kill/wait，检查退出或日志错误与产物。处理后核对源 fingerprint 和 SHA256。输出需为实际 FITS，尺寸与通道相同，Header/科学结果变化按真实样本记录；不能从尺寸断言推广至所有科学值。关联 D09、D12、SIR-CLI-TEST。

## SIR-FORMAL-RUN · FEATURE · 独立 Workspace 产物、回执和回滚恢复

旧 ID N-08、N-22/23，GN-06/GN-10/GN-13，C04 FR-DT-02/03、C08，O-TDD §10。SOURCE processing.py:158–207 使用当前默认 Workspace 租约及 outputs/{run_id} 中独立 scratch；先校验正式 FITS 再 fsync 与 no-replace 发布，记录真实元数据、SHA-256、软件版本/验证时间、参数和资产 ID，使用现有 assets.db 登记 Asset + managed AssetLocation。每次任务使用新 UUID。失败删除本次产物、写失败/取消 manifest 并发回执，之前已成功产物及原件保全。SOURCE processing.py:210–249 恢复只匹配实例、workspace、run/producer/state 与未登记资产，清理受控已知 scratch 和未登记输出，标 interrupted，跳过已登记及未知用户文件。SQLite 与文件落盘之间有 crash 窗口，有恢复实现及一个 fixture 静态断言，仍应保留整类 I/O 事务失败边界。关联 SIR-RECOVERY-TEST、SIR-CLI-TEST。

## D12 · DECISION · 取消旧硬资源阈值并保留取消和磁盘检查

旧 ID H11 D12；O-TDD §8.2/11.2 和 C10 R07/AC-10 的早期上限须按 Note Progress 后续方向解释。已取消旧 96 MiB、4 MiB、60/180 s、总并发封顶，以及 HDU 数/样本/位深白名单；不恢复已明确放弃硬值。SOURCE 软件探测仍保留 8/15s 超时；正式/候选 process 调用无 timeout（software.py:56–82，processing.py:34,114–155），保留 checkpoint 与 Cache/Workspace 空间检查。预览工作的进程级调度、耗尽风险和资源测量是独立未决。关联 SIR-RESOURCE-RISK。

## SIR-RESOURCE-RISK · RISK · 大 FITS、候选队列与清理验收缺口

旧 ID R07、H12 P1、GN-03/05/07。SOURCE frames.py:125–154 代理渲染虽逐块缩放，先分配全尺寸 uint8；processing.py:57–111 遇非零偏移加非有限值可产生整图 float64。候选 worker 当前无全域硬 cap，旧 owner 取消依赖 checkpoint 退出，已完成内存记录约 900s/128 项仅在后续 start 判定淘汰；正式与候选没有默认 wall clock timeout。已有 Cache 空间预算、owner 替换与配额保护，需独立超大样本、积压、取消和孤立外部进程验证，不能以成功小样本覆盖。关联 D12、SIR-PREVIEW-JOBS、SIR-HOST-GAPS。

## D10 · DECISION · 单主图、手动刷新及全局 PNG 分辨率

旧 ID H11 D10，C04 ND-06/07、O-TDD §8.1、前一轮 Node Interaction PRD v0.1。源码的单主图随折叠与 Inspector 开关变化，参数或来源变化触发候选 400ms、防止旧图覆盖，打开 Inspector 复用同一候选。SOURCE frontend/ui/src/host/scientific.tsx:68–135 的候选 effect 并未按 expanded/inspector 门控，收起仍可能随参数变化计算；active 与 document.hidden 门控定期验证，不等同于候选调度。早期“有可见预览才计算”的需求与后续取消视口触发的记录保留。画布布局不受 PNG 档位直接改变。关联 SIR-PREVIEW-JOBS、SIR-SETTINGS-CANVAS。

## SIR-PREVIEW-RENDER · FEATURE · 只读显示代理与对齐限制

旧 ID N-14、N-25。SOURCE frames.py:118–154 读取物理像素，非有限值归零、标准化/clamp、行方向矫正，RGB 转 HWC 后按等比双线性缩到设置最长边，编码 PNG；候选和正式计算仍用原始 FITS 尺寸。单一 PNG 表示显示代理，100% 是代理像素比例。SOURCE previews.py:130–215 比较正式/候选 before/after 的尺寸与通道、方向编码和 WCS 坐标键，只有可对齐时开启 wipe；维度一致而 WCS 改写仍需并排或单图。Horsehead 的真实旧测试为此情形，见 SIR-HOST-HISTORY。

## SIR-PREVIEW-JOBS · FEATURE · 候选、前图和正式结果隔离

旧 ID N-09、N-24/25/26、GN-07/14，C04 ND-06～09、C08 文件保留、O-TDD §8。SOURCE previews.py:18–215。以每个 Node 的 owner 替换旧队列/运行任务，取消设置 stop；完成任务过期和数量约束影响内存，不是正式文件清理。先缓存 before，使 CLI 未配置/候选失败时仍可回读前图；显式 disabled 在开始时拒绝。候选按输入、源 stat 版本、参数 hash、二进制指纹、renderer、最长边复用有效 Cache，Cache scratch 与 Workspace 正式结果隔离。formal_id 要求确切受管文件路径和对应 manifest 的 asset/source/revision/params/state、SHA256，读取验证跟踪当前 stat。前端用 AbortController、generation key、撤销 object URL 和 8s 可见验证，输入/参数不匹配的上游正式结果不用于当前显示。按周期检查软件身份发生在 validate；单张图片端点不会独立完成同等软件验证。普通 stat 相同的内容替换能否检测仍有边界。关联 SIR-API-TEST、SIR-RESOURCE-RISK。

## SIR-SETTINGS-CANVAS · CONTRACT · PNG 档位可写，画布预览尺寸固定

旧 ID N-27、GN-15、H11 D10。SOURCE api/siril.py:39–56、core/config.py:16–20,90–109、storage/runtime.py:76–92。全局 PNG 最长边 512/1024/2048/4096，默认 1024，PUT 结合 expected_revision 乐观锁。历史 canvas 参数仍按两个 64～4096 整数校验，当前此路径 PUT 只写 longest_edge，GET canvas 固定 480×320；源码中旧保存字段的出现不证明此接口可调。docs/siril.md 仍写两项都持久可配，H11 已识别为兼容接口事实，应在接手时按当前实现与历史区别解读。关联 SIR-HTTP、D10。

## D11 · DECISION · Inspector 同一宿主参数可编辑

旧 ID H11 D11。O-PRD FR-IN-05 / AC-08、O-TDD §9、C02:34–36、C04:39/55、HTML 初稿为只读；H11 记录用户明确「inspector的参数就不应该是只读，而是可以修改的。」现行 SOURCE frontend/ui/src/host/scientific.tsx:150–193 更新同一宿主 Widget，走 graph/canvas beforeChange、onWidgetChanged、afterChange 和重绘，没连接 graph、read_only 或 selectOnly 不写。单色时禁用 RGB linked，重置写三项默认值。保留三布局、分析真实空态和不做 Trial/历史/不同方案比较。旧只读 UI 用例针对无参数插槽的复用组件，不能覆盖生产 NodeView。SOURCE 生产 NodeView Jest 测试写入、重置回调、直读路径预览、只读/仅选择保护和单色。关联 SIR-INSPECTOR、SIR-JEST-REGRESSION。

## SIR-INSPECTOR · FEATURE · 当前节点输入和实际输出的三种图像比较

旧 ID C04 FR-IN、AC-07/08，O-PRD FR-IN-01～06，C07 §4，O-TDD §9。SOURCE features/nodePreview/Inspector.tsx 用可复用详情、参数区插槽和图像布局；生产入口 registerScientific → nodeCreated → addDOMWidget（scientific.tsx:263–313），临时预览 widget 不序列化。对比左右并排、符合对齐条件时可键盘/指针 wipe、单图切换，支持共同平移/缩放、fit/100%，参数编辑按 D11，分析待定。C-Primary HTML 源第 23–25,60–89 行以 wipe 为原型初始状态、用内嵌 SVG 示意图、静态只读参数；原型保留原样，生产默认以并排和真实科学代理数据为准。通用组件和运行中 NodeView 分开的两组测试证据并存。第三方路径节点和跨 subgraph 的自动候选尚缺；正式执行由原生宿主队列处理。关联 SIR-PREVIEW-RENDER、SIR-HOST-GAPS。

## SIR-HTTP · CONTRACT · 软件、FITS 和预览 HTTP 契约

旧 ID N-10/11/26/27，SOURCE astrophoto/api/siril.py:14–109。/astrophoto/v1 下，GET /software/siril 读状态，POST /software/siril/discover 探测，PUT /software/siril 验证并保存，DELETE 清配置，PUT /software/siril/enabled 修改启用。GET /fits/assets 支持 canonical UUID after。GET/PUT /previews/settings 查询和更新档位，参见 SIR-SETTINGS-CANVAS。POST /previews/autostretch 要求 owner UUID、精确 parameters、asset_id/image_path 二选一，可带 formal_id，返回 HTTP 202 和 job。GET /previews/jobs/{id}、POST 同路径 /cancel、GET /validate 和 /{before,after} 提供进度/取消/复验/PNG；内部 cache_key 不公开、图像 no-store/nosniff。错误统一 code/message/details 与顶层 request_id。关联 SIR-TRUST-GUARD、SIR-API-TEST。

## SIR-REGISTRATION-TEST · TEST · 四个 V3 节点和宿主输入类型

SOURCE tests/nodes/test_registration.py:4–23 核对 vue-basic、AstroPhotoFITSSource、AstroPhotoImagePath、AstroPhotoSirilAutoStretch，检查输入/输出 custom types 和路径原样、构件与历史 drawing 类型。HISTORICAL_RUN H-Tests 有 8207 真实 /object_info 确认四节点与新 Schema，同一时间 8201/8205 较老 Schema 和共有前端构件并存。注册查询不代替队列或图保存/重开。关联 D08、SIR-IMAGE-PATH、SIR-HOST-HISTORY。

## SIR-PARAM-TEST · TEST · 参数、版本和旧配置保护断言

SOURCE tests/backend/test_siril.py:93–127。精确业务参数拒绝 linked=0、targetbg=1.1、shadowsclip=NaN 和非数字字符串；mono 归一 false，RGB 保留 true。版本 fixture 先允许 1.4.5，然后模拟 1.4.4/1.5.0-dev 两次失败并断言旧状态完整；另测无效和 GUI 路径。真 CLI 探测及格式仍需 SIR-CLI-TEST 的实证。关联 D09、SIR-SOFTWARE。

## SIR-RECOVERY-TEST · TEST · 进程中断、重启恢复和已登记结果保护

SOURCE tests/backend/test_siril.py:129–158，timeout/cancel 用真实 Python 子进程，非处理流程真实 Siril；检查超时、中断和后续进程能执行。真实临时 storage/SQLite 的恢复测试保留用户文件并将匹配未登记运行标 interrupted。正式真实 CLI 测试另有 KeyboardInterrupt 保留已成功产物。由 StorageError/Exception 与 BaseException 区分的失败标记需留在诊断语境，取消不能仅凭字样推断操作成功。关联 SIR-FORMAL-RUN、SIR-CLI-TEST。

## SIR-CLI-TEST · TEST · 真 Siril 1.4.5 的科学产物、原件不变及串联

SOURCE tests/backend/test_siril.py:161–217 的两个用例经 ASTROPHOTO_SIRIL_TEST_CLI 显式启用，否则 SKIP。第一个发现真 CLI、变更当前默认 Workspace，校验外部资产 ID、正式资产登记和回执、位深 −32、像素变化、源原字节、取消后旧结果保留。当前第二函数 test_real_cli_direct_path_and_chained_output 将第一正式输出作为第二输入并关闭 linked，断言第一源为直接路径、第二源为第一资产 ID、两个输出均登记且不同、输出仍存在、第二结果 RGB、manifest 身份正确并且原件和第一结果不变。旧 11-18_1 的 test_real_cli_direct_path_and_repeated_runs 对应此演进，后续不能把重复执行旧测试当新串联定义。HISTORICAL_RUN 旧交接 Python 3.12/3.11 各 83 passed/3 skipped，并通过两个当时版本的真实 CLI 测试；Note 此后记载 84 passed/3 skipped，含已演进串联用例。

## SIR-API-TEST · TEST · 临时 aiohttp/SQLite/FITS 负面路径与代理状态

SOURCE tests/integration/test_siril_api.py:22–84 的 aiohttp TestServer + 真临时数据库/FITS，覆盖信任/Origin 403、读配置、错误路径、资产列表、202 预览任务、CLI 未配置而 before 可取、after 404、源删除后之前图片变 stale；不是运行中 ComfyUI 或 Siril。真实候选成功、同 owner 竞争、缓存复用、正式回执错误、远程部署与 cache 清理仍应按对应目标独立验证。关联 SIR-TRUST-GUARD、SIR-PREVIEW-JOBS、SIR-HTTP。

## SIR-JEST-REGRESSION · ERROR · 默认 Jest CSS 加载与 Siril DTO Fixture 回归

HISTORICAL_RUN H-Tests 与 evidence/test-runs.md 保留最初默认 Jest 4 套件/13 测试通过、6 套件在收集时报错（CSS map 缺失）；临时 CSS map 后 9 套件/46 通过，Siril 软件用例使用缺少 enabled 的旧 DTO，并需要按列表→详情导航，仍失败。JestArchive 记载用户选方案 A 后用测试空 CSS module 和当前 DTO/导航，覆盖错误版本提示、旧活动路径以及详情重开重取，10 套件 47 测试通过；typecheck/lint 通过。后续 Note 生产 NodeView 的覆盖为 11 套件 51 测试，HTTP/host 替身。SOURCE frontend/ui/src/__tests__/siril.test.tsx:9–55 与 scientific-node.test.tsx:33–155。区分历史失败、后续修复以及本次未运行。关联 D11、SIR-SOFTWARE、SIR-HOST-GAPS。

## SIR-HOST-HISTORY · TEST · 历史 Windows 原生队列、跨卷、图重开

HISTORICAL_RUN docs/siril.md 测试章节与 Note Verified。早期 8205 ComfyUI 0.45.0+33、Frontend 1.59.1、Siril 1.4.5 的隔离宿主浏览器跑软件检测、外部 FITS、候选、Inspector、工作流重开和真实队列；Prompt f04ab85b-2688-4588-8c07-0ee94643fd3c 合成 RGB 96×96、BITPIX −32→−32；c562b5e9-9f1b-4054-9544-5ed01ed01407 Horsehead 891×893、BITPIX 16→16、WCS 改写后禁用 wipe；5b11249a-9470-46b8-8dca-b446873015d8 源 C:、目标外置 D:、Cache C:。8207 后续 Prompt 75def43a-cd64-4f59-a70d-97070a5c31c4 验证直接未登记且带空格路径、双语主题、Inspector、原生队列、第二 Workspace、源 SHA 不变与原生工作流重开。另一个隔离宿主 Prompt b4b3983a-e730-4d80-a85a-2bccdacbb914 路径节点串联两个 AutoStretch，第二输入哈希等于第一输出，源哈希一致，隔离实例已结束。不同版本证据单独成立。来自 docs 的旧 AC-08 PASS 是当时对只读要求的测试，后续用户纠偏采用 D11。关联 SIR-CLI-TEST、SIR-HOST-GAPS。

## SIR-HOST-ATTEMPT · ATTEMPT · 宿主启动失败到隔离证据演进

C03 §4 与 C10 §2 历史调查在 8188 连接被拒，早期 11/16 另记 Torch 与 comfy_kitchen/torch.library.custom_op 冲突。Note Verified 的 8206 初次没加载 Astropy，改从独立依赖路径启动 8207 后通过。H-Tests 11-18_1 仅查询已有运行实例并未重新真实排队；这组证据覆盖 API/Schema，不能覆盖部署、真实工作流执行或旧绘图失败。历史环境未升级宿主核心依赖。ACTIVE 待办见 SIR-HOST-GAPS。

## SIR-HOST-GAPS · QUESTION · 未重验宿主、平台及后续验收项

H07/H12、C13、Note Blockers；覆盖变化。CURRENT_RUN 本分域只有仓库/路径、源码与已有历史证据核对，无产品测试执行。历史真 Windows E2E 覆盖不同流程与版本，后续应按需要复验当前独立宿主工作流、Vue IMAGE、软件失联和取消、跨沙箱运行、跨子图与第三方路径自动候选。macOS/Linux、完整 Unicode/特殊字符/不同磁盘同一矩阵、高容量 FITS、跨平台进程树强杀、完整 WCS/非有限值矩阵无据提升为当前通过。仍待产品决定的长期事项包括跨主机路径重现、稳定资产 ID 扩展、运行报告是否新增接口、扩展 Siril 版本及高级科学类型；1.4.5、三参数、内部 load/save 已明确。关联 SIR-DRAW-IMAGE、SIR-RESOURCE-RISK、SIR-HOST-HISTORY。

## SIR-AC-MAP · REQUIREMENT · AC 验收去向

| 旧编号 | 现行承接 | 验证边界 |
|---|---|---|
| AC-01、AC-02、AC-03 | D09、SIR-SOFTWARE、SIR-PARAM-TEST、SIR-CLI-TEST | Windows 历史真 1.4.5，版本拒绝含替身，其余平台未验 |
| AC-04、AC-05 | D08、D09、SIR-STRETCH-NODE、SIR-REGISTRATION-TEST | 自定义端口覆盖旧 ASTRO_FRAME；原生路径链有历史证据 |
| AC-06、AC-07 | D10、SIR-PREVIEW-JOBS、SIR-INSPECTOR、SIR-PREVIEW-RENDER | 先前真实 Windows 图像和当前源码；可见性与压力边界保留 |
| AC-08 | D11、SIR-JEST-REGRESSION | 只读要求已替代，可编辑同步仍保留宿主只读授权约束，无 Trial / History |
| AC-09、AC-10 | SIR-CLI、SIR-CLI-TEST、SIR-FORMAL-RUN、SIR-RECOVERY-TEST、D12 | 真 CLI 和临时环境的故障/回执断言分别保留，弃用硬限制 |
| AC-11、AC-12、AC-13 | SIR-HOST-HISTORY、SIR-HOST-GAPS、D04 | 历史 Windows workflow reopen、跨卷、双语、主题、端到端，当前迁移只带入证据 |

## SIR-PRD10-SCOPE · DECISION · Siril MVP 初稿的范围演进

C 的 source_materials/previous_prd/AstroPhotoFlow_Siril_AutoStretch_MVP_PRD_v1.0.md:12–40（D-01～D-12）及 :286–333（FR-IN-01～08）。沿用单 Sidebar 三页、用户安装、GUI/CLI 区分、唯一主图、原生保存和真实科学产物。D-07 曾把直方图、参数编辑、告警及试验回滚放入首版；O-PRD v1.1 §0.2 拆出分析与 Trial，曾把编辑移出 Inspector；后续 D11 只恢复可编辑参数，未恢复直方图、Trial、采用/恢复或跨历史比较。旧 D-06 的预览独立于正式产物、D-08 的真实像素处理与 GUI 显示区别仍生效。旧 D-09 的科学输出语义由真实 FITS 路径落实，早期 ASTRO_REPORT 仅建议。D-12 面向未来 Agent 共用验证与归因，首期无 Siril MCP 或自动调参。关联 D08–D12、SIR-INSPECTOR、SIR-FORMAL-RUN。

## SIR-NODE-LONGTERM · REQUIREMENT · 通用科学交互、分析及授权试验的长期要求

C 的 source_materials/previous_prd/AstroPhotoFlow_Node_Interaction_PRD_v0.1.md:86–212（FR-01～12）、:213–294（US-01～06、分阶段及待决），来源是较早通用目标。Node 按输入、处理、分析、交互、查看和导出区分，并允许序列与报告；可独立复用时才为 Mask/点集/选区建节点。算法按能力显示工具，共用 Inspector 保持查看无副作用。通用背景采样、色彩参考区域、Masks/ROI 须注明用途、保存坐标与输入版本，裁剪、旋转、重采样、配准后需要报失效或确认。实际分析应显示统计口径、通道、输入、版本、采样范围及限制，追溯异常最早出现位置而不强判根因。Draft→Trial→Commit 须独立区分预览、完整或近似运算，记录输入、算法、参数、软件、产物、状态、告警和授权；用户显式采用，失败不覆盖成功，旧提议不能覆盖更新的人类状态。原生图撤销独立于产物回滚，Checkpoint 必须检查依赖、可恢复性、资源保留及工作区离线。上述属于未来范围，不等于首期 AutoStretch 验收。开放项保留检查点方式、试验期限/固定、Agent 逐次或预算授权、分析集合、选区共享/重映射、失联缓存、未来对比模式与新手引导。关联 SIR-PRD10-SCOPE、SIR-HOST-GAPS。

## SIR-SOURCE-SCREENSHOTS · ATTEMPT · 两张截图证明过往文档位置

本轮直接查看 C 的 source_materials/screenshots/image(20261118-053401).png 与 image(20261118-061202).png。前者是文件夹列表，显示 Equipment UI v1.0、Siril PRD v1.1 和一项 PRD.md，后者显示当时的 .artifact/Siril_Integrate 窗口，含约 65KB 工程规范和 40KB PRD。二者是历史附件定位，可解释 docs/siril.md 的旧目录引用以及「当时需求目录只见两个 Markdown」。实际工程规范和 PRD 现从 Original_request/Siril_Integrate 读取，原型从 Chat_Handoff 内 C-Primary 取得。截图不展示 Inspector 或运行结果。
## 阅读覆盖

- 本次逐段核对 O-PRD 目标、版本对比、§3–6、状态矩阵、AC、开放事项及补丁，O-TDD §0–17 的分批正文与约束，核对两份 O 与 C-Primary 同名版本差异；回读 C02/C04/C05/C06/C07/C08/C10/C13 的相关章节、C-Primary HTML 的布局和事件关键源码，以及过往 H07/H11/H-Tests、H-NodeAudit、Note、DrawArchive、JestArchive、docs/siril.md 的分域记录。
- CodeGraph 实际读取根入口、科学 nodes、Vue 节点委托、FITS 读取与参数、原始处理/保存、软件配置、预览与 HTTP、科学前端挂载和参数绑定、关键后端/HTTP/Node/Jest 测试。CodeGraph 修剪掉的其他函数及旧文档中未逐项展示的内容仍需在总账标明分域阅读范围。
- Siril Chat 的 older PRD/历史副本与两个 PNG 的文件身份已登记；已读旧 PRD 的有意义业务范围、需求、版本差异和待决正文，并直接查看两个 PNG；早期项目历史副本仍只核对关联章节和身份，未接入任一窗口的完整原始对话。C01/C03/C09/C11/C12、FULL 和 manifest 由整包来源账及 Main 复核。未运行历史命令、外部链接、原型或宿主，避免改变共享数据。



[稳定编号和逐项出处](migration/OLD_ID_MAP.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/07_NODE_SIRIL_IMAGE_PATH.md)

```markdown
# 节点、Siril 1.4.5 和 IMAGE_PATH

## 实际节点与入口

| V3 ID | 入口和键 | 当前行为 |
|---|---|---|
| vue-basic | nodes/ComfyUIFEExampleVueBasic.py → ComfyUI 原生 LoadImage | Widget 提供 temp PNG 路径，返回宿主 IMAGE。工作流像素恢复经测试，历史正式 IMAGE 委托失败仍未重测。 |
| AstroPhotoImagePath | nodes/scientific.py:13 → execute(image_path) | 把 STRING 作为轻量 IMAGE_PATH 输出。这个节点不检验文件，使用者负责验证。 |
| AstroPhotoFITSSource | nodes/scientific.py:40 → resolve_input/fits_frame | 内部 ASTRO_FITS_ASSET picker 取注册 ID 或兼容路径，返回绝对 IMAGE_PATH 和 astrophoto_asset UI payload。 |
| AstroPhotoSirilAutoStretch | nodes/scientific.py:64 → parameters/resolve_input/formal_run | IMAGE_PATH 与 shadowsclip、targetbg、linked；返回新受管 FITS 路径，并发布 job/node UI 信息。旧 ASTRO_FRAME 工作流需要重新连接。 |

## 参数、文件、执行与保护

- 参数数值及缺省值出自 Schema 和 processing.parameters（astrophoto/siril/processing.py:24）。正式处理同一验证链，拒绝 bool 冒充 number、非有限值及 targetbg 越界。shadowsclip 的后端保证是值有限，linked 只作用于 RGB；UI 单色禁用关联控制。 画布与 Inspector 均可编辑当前节点参数，Inspector 通过同一 widget 写入。
- frames.resolve_input:17 对 canonical UUID 调 AssetService。路径先尝试匹配注册位置，找不到才走可读绝对本地路径。storage.manager.source_stat:25 拒绝相对路径/不支持文件、共享及链接边界，实际精细行为见 [Siril 专项](evidence/subagents/nodes-siril.md)。IMAGE_PATH 原文是轻量契约，不能将包含真实物理路径的 HTTP 面向不可信来源。
- frames.fits_frame:80 检查 .fit/.fits/.fts、存在及 stat fingerprint，以 Astropy readonly memmap 选择首个支持的 mono/RGB HDU、验证 header 与形状；预览代理转换 NaN/±Inf 为零。processing.prepare_fits:57 将科学工作副本规范化交给 Siril，并保持原件不改变。整个图像的显示数组仍按原始尺寸分配，即使最后输出较小 PNG。
- software.SoftwareService:85 拆分发现、验证保存、清空和启停。禁止 GUI EXE、错误文件名或不受支持版本；配置保存前会以实际 CLI 探测，错误保留旧配置。run_cli:56 不用 shell，检查进程退出与取消，探测有限时，正式与候选处理无默认 wall-clock timeout。先检查空闲空间和文件身份，暂存与正式产物隔离。
- processing.process:34 固定脚本 load → autostretch → save，使用内部生成目录与文件名。output FITS 必须存在，解析合法，尺寸及通道符合源。formal_run:159 从当前默认 Workspace 的自有运行目录处理并注册 Asset，recover_runs:207 区分已入库、未注册和未完成，清理仅限自有运行目录。跨进程 crash 窗口须照 [Guard](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 理解。
- previews.PreviewService:40 使用 Cache 并按 owner 替换、取消旧任务，提供 status、validation、before/after 与 Cache 租约。正式结果与源/参数匹配时用于显示。候选失败仍可保留 before 与 error。进程内状态不等同于持久正式 run，未配置 Siril 也可显示合法源图。

## 本轮验收边界

- 崭新的真实 FITS 和 Windows Siril 1.4.5 在临时 Workspace 下，验证源字节、正式输出科学像素变化与登记、不同结果隔离、直接路径和取消。确切断言见 tests/backend/test_siril.py:155–210。
- aiohttp TestServer 验证授权与错误、候选前图和 CLI 未配置回执。V3 调用边界另有 API stub 与 8207 真实 Schema GET。
- 本轮未用真实 ComfyUI 排队执行。完整宿主工作流/Inspector 的历史证据归 docs/siril.md 与 .agent/notes/siril-autostretch.md。当前 Hook 对复杂 subgraph input 的解析、真实高容量和 Linux/macOS 行为仍未验证。
```
