# 双向核对报告

日期：2026-11-17。范围为当前脏工作树及Latest_Handoff材料；没有修改产品代码来消除差异。状态词见主交接。

统计口径：**18项过时/错误工程陈述修正（C01–C18）、12项遗漏补充（N01–N12）、12项尚需跟进的风险/证据缺口（R01–R12）**。C/N是文档修改分类，R是未解决问题，不相加宣称修复了42个软件缺陷。历史文档本来标为设计/历史的内容，称“时效更新”，不追溯认定当时作假。

证据路径均相对仓库根，行号对应本轮工作树快照。`host:`表示仓库上两级ComfyUI根。C=完整聊天交接，FRD/Guide=输入sources两份React设计稿，Hxx=输入sources数字前缀历史审计。测试日志在本目录evidence，历史日志不算本轮运行。

## 一、历史/现有文档 → 当前实现

| ID | 原文结论/位置 | 当前源码证据 | 实际状态 | 修订方式 | 验证结果 |
|---|---|---|---|---|---|
| C01 | C§3、§5：React仅目标、迁移状态不明 | `frontend/entry.ts:2`；`frontend/ui/src/main.tsx:5`；`host/sidebar.tsx:8`（均frontend/ui/src下） | 已有React Sidebar，Vue并存 | CURRENT列出真实React模块；不称Vue整体迁React | React33通过、Vite通过；UI宿主操作历史证据 |
| C02 | C§3/14 H-01、H04：真实宿主是base Python3.12.4/Torch2.3.0、无法启动 | comfyenv安装metadata；`host:comfyui_version.py:3`；live-http.json | VERIFIED：运行宿主3.12.16/Torch2.14.1+cu130 | base错误降为历史，禁止建议先升级Torch | 本轮system_stats、status、node GET正常 |
| C03 | C§3.3、Guide§3.2：V3加载/Status只隔离测试 | `__init__.py:11`、`astrophoto/api/status.py:9` | VERIFIED真实节点/路由已加载 | 增加真实Host HTTP证据；不外推IMAGE | Host HTTP1通过 |
| C04 | C§3.3、H07：Vue6项为当前测试数 | `frontend/tests/widgets/serialization.test.ts`；本轮vue-tests.txt | VERIFIED：3文件9项 | 历史6项保留日期，本轮9项单列 | 9 passed |
| C05 | C§11/13目标测试树；docs/react-sidebar旧30项 | `frontend/ui/src/__tests__/`六个suite | VERIFIED：33项 | 实际测试树替代推荐文件名，记录本轮结果 | 33 passed；最终复跑不重复计数 |
| C06 | H08 R6、C H-16：画板保存恢复缺口；react-sidebar旧两失败段 | `VueExampleComponent.vue:41,79`；`DrawingBoard.vue:232`（frontend/src/components） | 恢复已实现；IMAGE独立问题未修 | 分开workflow值与prompt值，标SUPERSEDED旧像素故障 | 本轮Chromium往返；宿主像素仅历史证据 |
| C07 | H08 R7：中文pen-tooltip缺失 | `locales/zh/main.json:5` | VERIFIED修复存在 | 移出当前待修列表，不删除历史原件 | Vue测试通过；含恢复错误文案 |
| C08 | FRD§0/6/7/12、Guide§0.7/4.5/4.6：私有auto/zh/en选择 | `frontend/ui/src/host/locale.ts:3`；`features/settings/SettingsPage.tsx:7` | SUPERSEDED需求；生产仅跟随宿主 | 取消旧要求优先级；不恢复LanguageSelector | i18n测试验证旧偏好被忽略；真实全流程未重跑 |
| C09 | C§10/11、Guide树：ui/dist、npm尚待决 | `frontend/package.json:4`；`frontend/vite.config.mts:21`；`frontend/entry.ts:2` | SOURCE_CONFIRMED：frontend/ui、js、pnpm单锁 | 写实际路径，模板仅参考 | 隔离构建、清单通过 |
| C10 | C§14 H-04：三等分/下划线为当前待换UI | `frontend/ui/src/styles/theme.css:33`；`app/App.tsx:30` | 紧凑左对齐圆角已实现 | 更新CURRENT；保留视觉审批/Emoji未决 | React导航测试；历史原生Tab对比，不冒充本轮视觉 |
| C11 | C§9.9、H-05：Search+Filter+Sort仅建议增量 | `shared/SearchField.tsx:2`、`shared/SearchOptions.tsx:5`、NodesPage:57 | 当前两页已有共享控件 | 列出真实控件；180ms子串检索≠宿主300ms/Fuse | search suite通过 |
| C12 | docs/requirements§2目标清单、H02 FR04：节点目录未实现 | `frontend/ui/src/api/nodes.ts:6,32` | PARTIAL域：本地目录已做，MCP node_search未做 | 划清本地Sidebar与MCP领域 | 本轮HTTP真实schema + React catalog测试 |
| C13 | docs/react-sidebar文件树/API段：host/settings.ts仍存在、ID需要窄断言 | 当前文件清单；安装`index.d.ts:3305`；locale.ts:3 | SUPERSEDED文件/类型描述 | 新树不含settings.ts；现有get接受string | 实际路径检查、typecheck通过 |
| C14 | docs/react-sidebar顶部16项host pass可作为当前完整验收 | `frontend/ui/host-runtime.mjs:24,41,45,46,53` | CONFLICT：仍调用私有设置和已删除语言控件 | 旧结果明确标历史；现脚本待更新，不冒充当前通过 | 本轮静态确认，未运行有副作用脚本 |
| C15 | C§10.2/Guide§3.3把fetchNodeDefs列为可用类型接口 | reference固定Tag `src/types/comfy.ts:162`；安装types `index.d.ts:1375`附近无该声明 | PARTIAL：Tag有、安装声明无 | 保留差异；当前HTTP方案不依赖它 | 全安装d.ts搜索及typecheck；运行时该方法未探测 |
| C16 | docs/react-sidebar：唯一根外CSS是图标；features完全不接触host | `NodeHoverPreview.tsx:33,57,75`；theme.css:1及预览选择器；sidebar.tsx:18,26 | SOURCE_CONFIRMED存在Portal、专属容器与读取设置 | 明确scoped例外及轻量分层例外，不称全局污染已测 | 源码；CSS全宿主影响本轮未测 |
| C17 | H08/旧react-sidebar：构建545/786KB、CSS4.45KB | `evidence/build-production.txt`、build-hashes.json | VERIFIED本轮约801.94KB JS/12.01KB CSS | 更新本轮大小与生成证据，不把大小当功能故障 | 生产隔离构建与比较时工作树哈希一致 |
| C18 | 旧恢复Prompt：先处理Torch/重新实现Shell再接节点 | 当前V3/Core/React全链及R01；用户保留IMAGE决定 | SUPERSEDED任务起点 | 新Prompt优先更新失效宿主验证、保留有效产品方向 | 本轮只修文档，没有实施下一个工程任务 |

表中缩略源码路径如NodesPage均在 `frontend/ui/src/features/nodes/`；shared/host/app均在 `frontend/ui/src/`。安装types完整路径为 `frontend/node_modules/@comfyorg/comfyui-frontend-types/index.d.ts`。

## 二、当前仓库 → 原交接遗漏

| ID | 原文覆盖情况 | 当前源码证据 | 实际状态 | 修订方式 | 验证结果 |
|---|---|---|---|---|---|
| N01 | Vue保存仅笼统serializeValue | `frontend/src/components/VueExampleComponent.vue:32,41,87` | SOURCE_CONFIRMED双通道值协议 | 补{image,canvasDataURL} workflow与{image} prompt、旧值兼容 | Vue9含像素往返/错误恢复 |
| N02 | 无当前节点树实现 | `frontend/ui/src/features/nodes/NodeTree.tsx:11,87` | 已实现斜杠层级树 | 补独立展开、搜索展开、24px缩进、键盘 | React导航/搜索测试 |
| N03 | 无当前悬停Portal实现 | `frontend/ui/src/features/nodes/NodeHoverPreview.tsx:10,43,57` | SOURCE_CONFIRMED | 补左右定位、视口钳制、监听清理、元数据缩略图 | 隔离测试；真实几何仅历史note |
| N04 | 工具栏只有推荐树 | `NodesPage.tsx:25`；`AssetsPage.tsx:17`；`shared/useStoredChoice.ts` | 真实独立排序偏好 | 补localStorage键、非Memory、Assets无数据限制 | React33范围 |
| N05 | 页面请求仅设计建议 | `frontend/ui/src/api/client.ts:8`；`shared/useResource.ts:3` | 当前10秒超时/Abort/3态模型 | 补状态派生、hidden并不取消请求 | api suite通过 |
| N06 | Canvas为伪代码 | `frontend/ui/src/host/canvas.ts:11,20,35` | 本地版本Adapter已实现 | 补current graph、emitBefore/After、失败回滚 | Canvas隔离测试；历史Undo/Subgraph记录 |
| N07 | DnD示例涵盖node/asset/session | `frontend/ui/src/host/dragDrop.ts:8,15` | 当前仅node | 补allowed集合、自有MIME、canvas命中与清理；其他kind拒绝 | Canvas/drag隔离用例 |
| N08 | 语言只提出读取与待定同步 | `frontend/ui/src/host/locale.ts:10` | 可见500ms轮询+focus追赶 | 补具体同步机制，无私有Pinia、销毁清理 | i18n/lifecycle tests |
| N09 | 编译打包只有设想 | `frontend/entry.ts:2`；Vite配置；`ui/check-build.mjs:4` | 两注册一个JS/CSS | 补生产隔离构建方法与相对URL；不覆盖js | Vite、check-build、live /extensions |
| N10 | 原资料无法报告本轮环境/HTTP | `evidence/live-http.json`、host-versions.txt、mcp-live.json | VERIFIED | 补真实状态、Schema、两Tool真实HTTP调用及空Resources | 本轮GET与MCP调用成功 |
| N11 | 开发Skills清单无reference复用Skill | `.agents/skills/astrophoto-reuse-reference/SKILL.md:1` | 项目级开发Skill存在 | 补terra medium委派要求，区别产品0Skills | 文件确认；本轮非开发不触发委派 |
| N12 | 静态交接没有并发修改边界 | `evidence/concurrent-changes.json`；App.tsx:19；sidebar.tsx:26 | 审计期间外部前端更新 | 补标题i18n、宿主容器类和快照哈希；复跑受影响检查 | 最终React/typecheck/lint和生产构建重新检查 |

## 三、未解决风险、冲突与缺证据

| ID | 原文/目标 | 当前证据 | 状态 | 修订方式/后续动作 | 验证结果 |
|---|---|---|---|---|---|
| R01 | 当前UI应跟随宿主；host脚本却测试私有语言 | `frontend/ui/host-runtime.mjs:41`；locale.ts:3 | CONFLICT | 后续授权更新宿主测试、独立证据输出；不改产品目标 | 静态确认，不执行旧脚本 |
| R02 | 完整PNG→IMAGE兼容 | `nodes/ComfyUIFEExampleVueBasic.py:24`；host:nodes.py:1764；folder_paths.py:352；历史failure.json | BLOCKED/已知保留 | 记录双重解析；用户未授权修复，禁止放宽宿主检查 | 未重跑IMAGE；历史失败+当前源码 |
| R03 | 上传错误必须可诊断 | `frontend/src/components/VueExampleComponent.vue:72,101` | PARTIAL | 后续补HTTP错误/缺name测试与校验；本次不修 | 未新增测试；现有rejected Promise不足 |
| R04 | 完整Assets搜索/导入/拖成Source | `AssetsPage.tsx:29,35`；capabilities.py:9；节点列表仅vue-basic | PLANNED | 保留需求，后端/Node就绪前禁止假成功 | 本轮status unavailable，源码无业务模块 |
| R05 | 工具链一致 | `.pre-commit-config.yaml:4` v0.4.9 vs dev-versions Ruff0.17.5 | CONFLICT | 后续单独统一；本轮不跑--fix hook | 当前Ruff无fix检查通过不消除冲突 |
| R06 | 全宿主UI已验收 | 当前脚本R01；历史notes/host-evidence | UNKNOWN当前完整范围 | 重新验证动态Locale、Portal、浮动、200%缩放、真实代理与Save/Save As | 本轮仅HTTP+隔离浏览器；不把历史截图当证据 |
| R07 | 要求原始ZIP清单/安全解压 | 输入只有已解包目录；manifest26匹配 | UNKNOWN ZIP容器完整性 | 保留原件；复制隔离目录，明确无法验证ZIP成员/封装哈希 | 外层26/26、历史可用15/15匹配 |
| R08 | 正式Registry依赖可安装 | `evidence/pypi.json` HTTP404 | BLOCKED发布前置 | 获发布授权后先PyPI/公共安装，再Registry | 本轮只读查404，未发布 |
| R09 | Registry/Manager/Actions真实通过 | `.github/workflows/release.yml`只有配置 | UNKNOWN | 未来实际安装/远程CI验收；不声称未查线上一定未发布 | 本轮未调用远程发布/管理功能 |
| R10 | 所有事实应对应同一稳定工作树 | `source-before/after.json`、并发文件列表 | UNKNOWN持续稳定性 | 声明审计截点、哈希；保留外部更改，接手重查 | 没有回滚用户工作；测试结果绑定执行时源码 |
| R11 | 最新docs全部内部一致 | docs/react-sidebar旧语言树/测试表；docs/requirements§2旧目标清单 | CONFLICT | 新校准文档覆盖旧CURRENT结论；遵从本次禁止改原文 | 已标SUPERSEDED，不改AGENTS/旧FRD/Guide |
| R12 | 固定版本接口/安装目录变化仍兼容 | types无fetchNodeDefs；api/nodes.ts:9精确python_module；canvas.ts:7 window.LiteGraph | PARTIAL | 保留版本适配边界；不同安装目录/宿主升级重验catalog和canvas | 当前canonical路径HTTP通过，不声称任意安装兼容 |

风险分组：3项CONFLICT、4项UNKNOWN、2项BLOCKED、2项PARTIAL、1项PLANNED，共12项。部分问题同时有历史失败或当前隔离测试证据，但未因此判为已解决。

## 四、有效需求覆盖与SUPERSEDED列表

用户最后确认的需求保持：单Sidebar；三视图默认Assets；两页Search/Filter/Sort；原生Registry与Workflow；素材作为固定Source Node实例；七Settings模块；无Experiments UI；语言主题跟随宿主；简约专业。当前源码满足不等于用户已经批准最后一版美术或Emoji方案。

明确SUPERSEDED的旧要求：FRD§0.8、§6 FR-S01基础语言区、§7 FR-I01覆盖优先级、§8 LanguageMode、§9 LanguageSelector及§12语言验收；Guide§0.7、§1文件树、§4.2 settings注册、§4.5私有语言、§4.6手动模式、§6.1语言行、§8.1/§9相关测试/交付。旧主Tab三等分/下划线不再默认实施。Guide的目标文件名不是强制重构清单。

长期FR01–FR08及33候选Skills全部保留于主交接；FR07不展示前端页面并不取消长期可复现参数试验后台。六个历史验收故事（M31导入、Siril校准叠加、Agent在线画布、HOO偏好、可引用知识问答、长周期coding恢复）均保留：只有开发task-notes已有，不能误称Memory产品已实现。

## 五、完整聊天18章逐章覆盖

| 原章 | 核对处理 |
|---|---|
| 1 最终结论 | 保留D01–D14产品/工作方式；工程状态按C01–C18更新；原型优先不覆盖本次明确文档审计授权 |
| 2 资料证据 | 核验26条manifest、历史15条可用；无ZIP、33条旧日志缺失；重复FULL不重复计证据 |
| 3 历史基线 | 重核版本、HEAD、脏工作树、真实环境、V3/Core/React/MCP及本轮测试 |
| 4 决策演变 | 保留单Registry、素材节点、无实验页、Workflow原生、设置七模块、语言覆盖被取消的背景 |
| 5 决策台账 | 用CURRENT/TARGET/UNKNOWN分离；图标、浮动/代理/Save完整验收未擅自定论 |
| 6 信息架构 | 对照App、三个页面、moduleRegistry；Header帮助/齿轮视为可选示意 |
| 7 三视图交互 | 对照搜索状态、树/详情、真实节点、禁用导入、七模块与错误反馈 |
| 8 视觉语言主题 | 当前CSS/locale/语言包核对；旧选择器SUPERSEDED，Portal/容器例外补记 |
| 9 官方工具栏调查 | 对照本地干净v1.59.1参考源码；保留V2/旧版区分；记录180ms/子串/分类差异 |
| 10 接入API | 安装types、实际Backend、固定Tag与运行HTTP对照；fetchNodeDefs差异明确 |
| 11 推荐树 | 与实际136文件基线比对；没有批量创建空文件或替换Vue |
| 12 素材/Workflow契约 | 保留asset_id、科学引用、原址只读、目录授权；当前无Source类，node-only DnD |
| 13 验收矩阵 | 当前115测试、静态/构建/GET、历史宿主操作、未运行安装发布分列 |
| 14 风险 | 已修像素/翻译退出当前待修；新增失效host脚本、并发快照、类型差异；其余继续保留 |
| 15 接手行动 | 改为从已实现React/Core出发；不再默认解决base Torch或重建Shell |
| 16 官方来源 | 重新打开3个官方页，读取固定Tag/API与本机Backend；不沿用main作为版本承诺 |
| 17 截图/历史索引 | 7截图为设计参考；历史notes记录归属明确；完整输入未删除 |
| 18 Prompt | 新NEXT_AGENT_PROMPT自包含；保留原型/开发授权边界、IMAGE禁修与真实验证区分 |

## 六、需要用户决策的事项

本次审计无需额外决策即可完成。后续才需明确：下一任务是UI原型评审、宿主验证脚本维护还是Assets首个业务增量；图标/Emoji最终方案；何时允许修复IMAGE；何时进行发布。它们不是本次默认授权，也不阻止本次完整文档交付。
