# 前端迁移验证报告

**运行标识** `frontend-vue-v1596-local-2026-11-21` · PH-06。基于 HEAD `4c0cf4de91375f9eeb82997eee3aaa3bf99049b2` 加当前工作树执行。验证结果按实际命令与夹具记录。 [冻结规格](05_TEST_PLAN.md) · [实现回写](04_DEV.md#6-实施回写2026-11-21)

## 环境与证据

- Windows，Node `26.13.1`，pnpm `11.13.1`，Vite `8.2.2`，Vue `3.5.42`，Vue Vite 插件 `6.0.8`，Tailwind `4.3.2`，TypeScript `6.0.3`，Vitest `5.1.1`，Playwright `1.65.1`。宿主 API 类型包锁为 `1.59.1`，运行在独立 ComfyUI `0.46.0` / Frontend `1.59.6`，宿主 Python `3.12.16` / CPU Torch `2.15.0`。Siril 正式处理使用官方便携 CLI `1.4.5` 与合成数据。 `frontend/pnpm-lock.yaml` 改变，`uv.lock` 未因迁移改变。
- 本轮主要证据在根目录 `.artifact/frontend-migration/`、后端与合成 FITS 日志在 `.artifact/frontend-migration-siril/`。存储隔离验证记录在同工作区的 ComfyUI 迁移宿主目录 `.migration-run/storage-ph06/logs/`。这些是本机测试产物，历史失败日志仍保留。
- 相关改动为公共 Vue、Siril Bundle、Vite / TypeScript / CI / 构件及归档、接口迁移回归和配套文档。其它并行交接与仓库文档修改保留原状态。远程 CI 未运行，本轮以本地同职责命令和官方发行宿主证据为准。

## 执行结果

| 子项 | 状态与证据 |
| --- | --- |
| 01-A 独立构建和 React 退出 | PASS。锁定安装、peer 检查、`typecheck`、ESLint、Vitest Chromium 9 文件 45 用例、Vite 构建及 `check:build`。生产入口/源码/锁中无 React、PrimeVue/Aura 或 Jest 工具链。 |
| 01-B 代理和发行 | PASS。`uv run pytest tests/packaging` 8 通过，`scripts/release.py check` 返回 `0.0.1`。独立解包到官方目标宿主，在实际根路径和 `/proxy/comfy/` 验证同一归档构件、CSS 与宿主模块。`registry-host.json` 记录 HTTP 加载及 JS/CSS 哈希。干净目录重建与工作区构件哈希一致，见 `clean-build-hashes-final.json`。 |
| 02-A 节点目录 | PASS。真实宿主的 ID 搜索、节点行、悬停、详情与收藏持久设置；Chromium 同测别名、输入法、防抖、清空、手动激活、搜索跨标签及取消。 |
| 02-B 两种画布及子图 | PASS。经典和 Nodes 2.0 的点击与真实拖放均通过，宿主 Undo/Redo 和子图内放置均有运行断言。原生单侧栏反复打开无重复根。 |
| 02-C 防御路径 | PASS。`tests/host/canvas.test.ts` 覆盖只读/选择态、未知类型、非法负载和插入失败清理，结合实际画布变更边界。 |
| 03-A 工作区、缓存、系统 | PASS。真实宿主设置、键盘方式改导入默认模式、迁移 HTTP 202 与终态回执、复制摘要一致及源保留、缓存配置与本机确认。实测缓存夹具为空，非空清理走 API/替身回归。 |
| 03-B 预览设置 | PASS。真实 Reka 选择与 PUT、重开持久化、布局 CSS。无 Bundle 条件下也完成同一环境界面保存。 |
| 03-C 冲突与错误 | PASS。存储与环境 Chromium 7 项，包括已过期 revision、重新拉取并保留输入、网络取消和响应校验。HTTP/服务端回归独立通过。 |
| 04-A/B/C 设备与光路 | Chromium 资料库 10 项通过。真实宿主通过四种规格、组合配置、排序、快速新增、归档恢复、未保存提示、窄栏与中英文。`equipment-restart.txt` 验证正式进程重启后的配置、受引用设备无法删除、解除引用后可删，以及其它设备保持。 |
| 05-A/B Siril 与 Inspector | PASS。两种画布均验证配置、无效路径保留上次配置、FITS Source、候选、参数与图像对比、明暗及语言。真实浏览器组件测试覆盖 read-only/select-only、原生变更边界、取消与单通道禁用链接。最终发行归档的 Nodes 2.0 再跑完整正式流程，见 `registry-siril-final.txt`。 |
| 05-C 正式 FITS | PASS。两种画布均有独立 ComfyUI 队列回执、正式结果标记与工作流重开。Astropy 验证输出与源同为 `3 × 96 × 96`、`BITPIX=-32`，`OBJECT` 保持、输出哈希匹配 manifest、源哈希未改。该夹具不含 WCS，未将本项扩展为完整 WCS 认证。证据 `fits-verification.json`。 |
| 06-A/B 绘图 | PASS。真实宿主验证旧图像素、笔画、原生撤销/重做、重新打开和临时 PNG `threed/<name> [temp]`。证据见 `drawing-undo-classic-final.txt`、`drawing-undo-nodes-2-r2.txt`。下游 Python IMAGE 路径独立于此 Feature。 |
| 07 界面对照 | PASS。同宿主重放旧构件与新构件，记录 `en/暗色/280px`、`zh/亮色/313px` 两组宽度、同状态和旧工作流。节点、存储、环境、设备、软件及绘图前后成对截图见 `ui-compare/`。Inspector 使用同一真实 FITS 和主题，记录 `inspector-old.png` 与 `inspector-new.png`。调整公共 CSS 顺序恢复缓存表单样式，并还原窄栏画板按键和色块尺寸，保持现有页面顺序。显式差异为 Q-01 的占位内容、原生绘图控件和少量图标。 |
| 08-A 无 Bundle | PASS。使用抽离前后端 Siril 装配的隔离真实宿主，工作区、设备和通用科学节点注册有效；FITS 查询、环境设置 UI 往返保存、无 Siril 路由与网络请求。证据 `no-bundle-host.json`。 |
| 08-B Siril 不可用及可用 | PASS。真实无配置时 `/status` 反映 `SIRIL_NOT_CONFIGURED`，其余功能可读。配置错误及可用路径由两种画布真实队列复验。 |
| 09 官方复用 | PASS。对照开发规格中的上游版本、路径和适配，验证宿主接入、单多选、搜索、树、构建和大图交互。Node 库数据、拖放和收藏仍通过本项目已有适配。 |
| 10-A/B 占位与单入口 | PASS。真实宿主检查中英文、默认 Assets、无素材请求和重复挂载；设备草稿回到 Settings 由 Chromium 回归。构件检查与代理 Chromium 检查单一 JS/CSS。 |

### 其它回归

- `uv run --frozen --no-sync pytest tests/nodes tests/backend tests/integration -m 'not host' -q -ra` 加真实 CLI 路径后 77 通过，2 条跨卷路径因缺第二测试卷跳过，1 条宿主标记用例由独立真实浏览器批次覆盖相关入口。后端打包回归 8 通过。Ruff 通过。
- `uv run --project mcp pytest mcp/tests -q` 67 通过。

## 失败、修复和重试记录

| 尝试与触发 | 假设与改动 | 结果与原始证据 |
| --- | --- | --- |
| 旧 `host-runtime` 在 Assets 等待不可用提示超时 | 目标隔离宿主启用了本地存储。使用旧构件采集真实基线，不修改权限来配合旧断言。 | 已保存旧图和侧栏截图，`baseline/`。 |
| Vite 8 构件含 `process.env.NODE_ENV` | Library 模式保留运行时环境分支，恢复原 Vite 的生产期替换。 | `check-build`、`check-proxy` 复跑 PASS。 |
| AutoStretch `nodeCreated` 时无 Graph | Vue 立即挂载后扫描早于宿主挂接。`AutoStretch.tsx` 保护图尚未加入及已移除的扫描与尺寸回调。 | `host-classic-attempt-1.txt` 保留异常，经典/Nodes 2.0 重跑无页面异常。 |
| 后端真实 CLI 测试 FITS 别名错误，另一次 Windows 清理被临时文件锁阻断 | `astropy.io.fits` 局部变量遮蔽共享 FITS 模块，改用 `frame_io`。文件锁单项复测与完整回归均未复现。 | `backend-regression.txt`、`backend-cli-retest.txt`、`backend-regression-r2.txt`。 |
| Registry 打包发现 `.codex/`、`.cursor/`、`.pi/` | 既有工作树配置被归档拒绝；完善 `.comfyignore`，继续仅含运行文件。 | `registry-regression.txt` 首次失败保留，8 项打包测试通过。 |
| Chromium 测试清理 Teleport 与样式断言不准确 | 测试先卸载 Vue，再移除 body；验证实际 interval ID 成对回收。Vitest 检查相对样式 link，真实浏览器再检查已解析样式及绘图工具栏样式。 | 首次核心结果 `vitest-core-attempt-2.txt`；Vitest 全量复跑通过。 |
| 官方 Vue 对齐后 Reka 键盘两项失败 | 可见列表仍在定位，键盘焦点转移后需等待真实焦点再提交。测试保留键盘断言，使用 Reka 实际焦点同步。 | `final-vitest.txt` 42/44，重跑 `final-vitest-r3.txt` 为 44/44。 |
| TypeScript 6 的 ESLint peer 未满足 | `typescript-eslint` 升至上游使用的 `8.69.0`，删除原 Vue peer 放行，改用匹配声明的 `3.5.42`。 | 锁定安装与 `pnpm peers check` 通过。 |
| 设备、Siril、无 Bundle 与 Nodes 2.0 脚本定位超时 | 复核真实宿主名称、首次模板对话框、Reka 搜索角色和 Nodes 2.0 DOM 覆盖的位置。按领域标签选控件并找无遮挡画布点。节点排序文案实际为 `Alphabetical`。 | 各首次日志保留；不放宽业务断言，复跑有效。 |
| Storage 宿主诊断的请求匹配和确认错误 | 官方宿主经 `/api` 前缀发请求，删除确认显示 Delete；调整脚本匹配。另修复版本冲突后可刷新并保留缓存草稿。 | 隔离 `host-run-05.log` PASS、`vitest-run-04.log` 7/7。 |

### 宿主撤销与迟到回执

- 原画板只更新 Widget 值。如果不进入宿主变更边界，单次撤销可能回到整图的前一个快照。将用户绘图和清屏纳入宿主 Undo/Redo，加载、初始空白与像素恢复保持独立。测试更新内部事件断言，仍校验实际 PNG 字节和渲染像素。
- 在 Nodes 2.0 初次实跑中，撤销正确恢复序列化数据，原生 `WidgetDOM` 却保留旧容器。`drawing-undo-diagnosis-r4.txt` 对照了新 Widget 的 ID、画布挂接与序列化像素摘要。引用宿主公开 `afterConfigureGraph` 后，仅恢复扩展自有 DOM 元素，已复验绘图像素及其他 Widget 无页面错误。 [DEV 回写](04_DEV.md#6-实施回写2026-11-21)
- 晚到的正式回执在对应来源通过服务端校验前不用于串联预览。遇到 `PREVIEW_STALE` 后清理并恢复当前来源候选，新增 Chromium 回归见 `ScientificNodes.test.ts`。

## 样本与边界

当前真实处理样本为本轮合成 RGB 与后端集成用到的科研夹具。两种画布使用同一个迁移前工作流接入口，公开宿主代码及依赖未修改。远程 CI、跨卷和已拆分的 Python LoadImage 端到端执行分别按未执行、条件跳过和独立范围记录。实际归档、宿主状态及对照见上表。

## Pi 独立审查与补测

**范围**　HEAD `4c0cf4d` 加当前工作树，含未跟踪源码 `extension/`、`astrophoto/{bundles.py,assets/fits.py,api/scientific.py}`、`frontend/src/**`、`frontend/scripts/**`。按 PRD v1.3 的 FR-01–09 逐项对照差异与未跟踪文件，再据本页用例编号核对覆盖。业务代码未修改，改动仅限新增测试；未执行 `git add`/`git reset`，原有暂存内容保持原状。

### 环境与方法

- Windows；Node `26.13.1`；本机无 `pnpm`，按仓库指定版本改用 `npx --yes pnpm@11.13.1`（解析为 `11.13.1`）；Vitest `5.1.1` Chromium headless（Playwright `1.65.1`）；Vue `3.5.42`、Vite `8.2.2`、`vue-tsc` `3.3.14`；Python 由 `uv` 管理（3.12），统一 `uv run --frozen --no-sync`。
- **只读取证。** 本机已有一个仍在运行的隔离宿主（`127.0.0.1:8188`，ComfyUI `0.46.0` / Frontend `1.59.6`，Data Root 位于 `ComfyUI-migration-v0.46.0/.migration-run/astrophoto`）。本次只发送 GET（`/object_info`、`/extensions`、`/astrophoto/v1/{status,previews/settings,fits/assets,software/siril,storage}`），未运行会写入数据根或队列的宿主脚本。
- **构件可复现。** `vite build --outDir <临时目录> --emptyOutDir` 的产物与仓库内 `js/main.js`（sha256 前 16 位 `7b16d7578b6507a5`，605145 B）、`js/assets/main.css`（`1749b75be704355c`，35371 B）逐字节一致，正式 `js/` 未被改写。

### 审查发现（按严重程度）

**F-1｜P2｜收藏写入失败时提示“无法创建节点”，恢复指引与实际失败不符**
- 位置：`frontend/src/shared/Feedback.tsx:12`（`const code = error instanceof ApiError ? error.code : 'canvas'`）、`frontend/src/features/nodes/NodesPage.tsx:116-133`（`toggleBookmark` 的同步 `catch` 与 Promise 拒绝分支都写入 `feedback.value = { error }`）。
- 触发：宿主 `app.extensionManager.setting.set('Comfy.NodeLibrary.Bookmarks.V2', …)` 同步抛错或返回被拒绝的 Promise（例如设置不可写、宿主设置后端不可用）。
- 影响：界面显示 "Could not create a node. Check that the canvas is editable and the node is registered."，但本次没有发生节点插入；用户会去排查画布与节点注册，真实失败点是宿主设置写入。收藏状态本身仍回到宿主实际值（`bookmarks.value = readBookmarks()`），因此是文案与恢复路径错误，不丢数据。对应 FR-02/02-A“模拟收藏写入拒绝，状态应回到宿主实际值并反馈”和 FR-07。
- 复现证据：临时用例捕获 `BOOKMARK_ALERT="Could not create a node. Check that the canvas is editable and the node is registered."`、`BOOKMARK_HOST=[]`（临时文件已删除）。新增用例 N-02/N-03 固化“拒绝或同步抛错后 `aria-pressed` 仍为 false、宿主值不变、出现 `role=alert`”。
- 修复建议（业务代码，本次未改）：给 `Feedback` 增加显式错误码或上下文（收藏路径传 `settings`），并补 `errors.settings` 词条；`errors.canvas` 继续用于 `INVALID_DRAG`、`NODE_NOT_REGISTERED`、`GRAPH_ADD_FAILED`、`CANVAS_UNAVAILABLE`。

**F-2｜P3｜设备/光路错误词条触发 intlify 缺键告警**
- 位置：`frontend/src/features/library/components/equipmentFields.tsx:12`，`t('equipment.errors.' + code, t('errors.' + code, t('errors.unknown')))` 会先求值内层 `t('errors.' + code)`。
- 触发：任何设备校验失败或 409 冲突（如 `EQUIPMENT_VALIDATION_FAILED`、`DRAFT_VERSION_CONFLICT`）。
- 影响：`equipment.errors.*` 命中，界面文案正确，但每次都会打印 `[intlify] Not found 'errors.<CODE>' key in 'en' locale messages.`。开发与测试日志出现噪声，也会掩盖真正的缺键。
- 证据：本次全量 Vitest 输出中的 `[intlify] Not found 'errors.EQUIPMENT_VALIDATION_FAILED' …` 与 `'errors.DRAFT_VERSION_CONFLICT' …`。
- 修复建议：先用 `te('equipment.errors.' + code)` / `te('errors.' + code)` 判断命中再取值，避免提前求值。

**F-3｜P3｜观察（非本次迁移引入）：公共存储层仍内嵌 Siril 暂存命名**
- 位置：`astrophoto/storage/cache.py:21`（`SIRIL_SCRATCH`）、`:82`、`:91`（`autostretch.ssf`、`siril.config`）、`:115`（`prefix="siril-"`）。
- 该文件不在 `4c0cf4d…` 迁移差异内，属既有耦合。与 DEV §5、CASE-08 表述的“公共层不持有 Siril 专属处理”相比，缓存清理仍认识 Siril 的暂存目录与产物名；后续新增 Bundle 若要复用同一机制，需要改动公共存储代码。
- 影响：不影响本次验收。新增的边界用例按“入口与符号”判定（禁用 `SirilBundle`、`siril_routes`、`SoftwareService`、`PreviewService`、`formal_run`、`renderCandidate`、`extension.siril`），不把注释和暂存常量计为违规，因此不会在此误报。

**F-4｜P3｜未验证风险：节点目录的拖放监听绑定在 attach 时的 canvas 元素**
- 位置：`frontend/src/host/dragDrop.ts:16-34`（`const surface = app.canvas?.canvas` 之后 `addEventListener`，解绑也针对该元素）、`frontend/src/features/nodes/NodesPage.tsx:58-73`（只在 `props.resource` 变化时重建监听）。
- 触发：侧栏保持打开、节点目录未重新加载时切换经典画布 ↔ Nodes 2.0；若宿主替换 `app.canvas.canvas` 元素，监听仍挂在旧元素上。
- 影响（若成立）：切换后的新画布不再接管 AstroPhoto 拖放（点击添加不受影响），需刷新目录或重开侧栏才恢复。本报告 02-B 已记录两种画布通过，但未记录“切换模式时侧栏保持打开”的顺序，因此此项未证实。
- 建议复核：真实宿主中保持侧栏打开 → 切换画布 → 直接拖放，观察是否新增节点；若需加固，在宿主画布对象变化或 `afterConfigureGraph` 时重建监听。

**F-5｜P4｜已删除 Siril 模块的 `__pycache__` 残留**
- 路径：`astrophoto/siril/__pycache__/`、`astrophoto/api/__pycache__/siril.cpython-312.pyc`。
- 不进发行包（`.comfyignore` 与 `check_registry` 都拒绝 `__pycache__`），Git 不跟踪；仅影响本地检索会命中旧模块名。建议删除目录。

**复核为“无问题”的关键点**（用于支撑结论）
- 真实宿主 `object_info`：`vue-basic`（输入 `custom_vue_component_basic: ["CUSTOM_VUE_COMPONENT_BASIC", {}]`、输出 `IMAGE`）、`AstroPhotoFITSSource`（`asset_id`）、`AstroPhotoImagePath`（`image_path`）、`AstroPhotoSirilAutoStretch`（`image_path`、`shadowsclip`、`targetbg`、`linked`）的节点 ID、类别与 Widget 键与迁移前一致；四者 `python_module` 均为 `custom_nodes.ComfyUI_AstroPhoto`，与 `frontend/src/api/nodes.ts` 的目录过滤条件一致（否则目录会为空）。
- `/extensions` 只返回一条 `extensions/ComfyUI_AstroPhoto/main.js`（CASE-10 单入口）。
- 公共源码零 Siril 引用：`frontend/src/**` 无 `siril`（大小写不敏感）；`astrophoto/**`、`nodes/**` 无具体 Bundle 符号。
- 词条对齐：`sidebar` 388/388、`siril` 93/93、绘图 6/6，键集完全一致；公共源码中 100 个以上字面量 `t('…')` 键在中英文均可解析。

### 新增测试与覆盖行为

| 编号 | 文件与用例 | 覆盖行为 |
| --- | --- | --- |
| N-01 | `frontend/tests/components/NodeCatalog.test.ts` · 02-A 排序偏好 | 排序写入本地偏好 `AstroPhoto.Nodes.Sort`，重开目录沿用并改变树行顺序 |
| N-02 | 同上 · 02-A 收藏写入/拒绝 | 收藏写入 `Comfy.NodeLibrary.Bookmarks.V2`、收藏区出现、再次点击移除；异步拒绝时回滚到宿主值并提示 |
| N-03 | 同上 · 02-A 同步拒绝 | 宿主设置同步抛错时宿主值不变、`aria-pressed` 保持 false、出现 `role=alert` |
| N-04 | 同上 · 02-A 分类筛选 | 分类多选与“All categories”复位只改变可见行 |
| N-05 | 同上 · 02-B 画布拖放 | 匹配 MIME 的拖放在宿主画布新增节点；外部 MIME 不被拦截；未知节点给出提示；卸载后监听解除 |
| N-06 | 同上 · 02-C 详情添加 | 详情页“Add to canvas”走宿主事务；`graph.add` 失败时有可观察反馈 |
| N-07 | `frontend/tests/host/domWidgetMounts.test.ts` · 挂接 | `trackDomWidget` 保留宿主 `onAdded` 并在挂接后写入 owner 标记 |
| N-08 | 同上 · 重挂 | Nodes 2.0 撤销后只恢复扩展自有元素：原位替换旧容器、继承宿主尺寸类、保持元素身份 |
| N-09 | 同上 · 非自有目标 | 外部容器、同节点其它 Widget、无重挂元素、无画布时均不改动 DOM |
| N-10 | `frontend/tests/components/BundleBoundary.test.ts` · 公共入口装配 | `initializeFrontend` 注册 `vue-basic`/`AstroPhoto.ScientificNodes`/`AstroPhoto.Sidebar`；每个 Bundle 只调用一次 `registerNodes`；侧栏 `setup` 只注册一个标签并触发一次预览设置预取 |
| N-11 | 同上 · 空 Bundle | 无 Bundle 时 Software 入口为 Unavailable，界面与网络记录均无 Siril 内容或请求 |
| N-12 | 同上 · 第二 Bundle | 非 Siril Bundle 经公共 software 入口呈现，自有词条中英文均生效，可返回列表（FR-08 公共接口可复用） |
| N-13 | `frontend/tests/components/Localization.test.ts` · 键集 | 侧栏、绘图、Siril 三套词条中英键集一致且无空值 |
| N-14 | 同上 · Bundle 词条合并 | `createFrontendI18n([sirilBundle])` 在中英两种语言下同时解析公共与 Bundle 词条 |
| N-15 | 同上 · 字面量键 | 公共源码所有字面量 `t('…')` 键在中英均可解析（同时阻止公共层改用 Bundle 私有键） |
| N-16 | `tests/packaging/test_contents.py` · 发行内容 | Registry 仅含 `extension/__init__.py` 与 `extension/siril/*.py` 九个运行文件；`extension/siril/frontend/**` 不入包；把嵌套前端资源塞入归档会被 `check_registry` 拒绝 |
| N-17 | 同上 · 公共/Bundle 方向 | `frontend/src/**` 无 `siril` 或 `extension` 引用；`astrophoto/**`、`nodes/**` 无具体 Bundle 符号 |

N-16/N-17 属 CASE-01 01-B 与 CASE-08 08-A 的发行与边界证据，因浏览器模式的 Vitest 不能读取仓库文件系统，放在既有 Python 打包套件中。

### 实际执行记录

| 命令 | 结果 |
| --- | --- |
| `npx --yes pnpm@11.13.1 -C frontend exec vitest run` | **PASS** 13 文件 / 60 用例（原 45 + 新增 15），Chromium headless |
| `frontend/node_modules/.bin/vue-tsc --noEmit` | **PASS**（`include` 不含 `tests`，校验公共源码与 Bundle） |
| `eslint --config frontend/eslint.config.mjs frontend/src extension --max-warnings 0` | **PASS** |
| `node frontend/scripts/check-build.mjs` | **PASS** `Vue-only single JS, sidebar and scientific widgets, shared CSS and proxy-relative URLs` |
| `node frontend/scripts/check-proxy.mjs` | **PASS** `/proxy/comfy/` 下 4 个扩展注册、单一 CSS、无页面错误 |
| `vite build --outDir <临时目录> --emptyOutDir` | **PASS** 与仓库 `js/main.js`、`js/assets/main.css` 哈希一致 |
| `uv run --frozen --no-sync pytest tests/packaging -q` | **PASS** 10 通过（原 8 + 新增 2） |
| `uv run --frozen --no-sync pytest tests/nodes tests/backend tests/integration -m 'not host' -q -ra` | **PASS** 75 通过 / 4 跳过 / 1 取消选择 |
| `uv run --frozen --no-sync ruff check tests/packaging/test_contents.py` | **PASS** |
| 只读宿主探测（GET，隔离宿主 `127.0.0.1:8188`） | 200：`/object_info`、`/extensions`、`/astrophoto/v1/{status,previews/settings,fits/assets,software/siril,storage}`；ComfyUI `0.46.0` / Frontend `1.59.6` |

新增用例调试期间出现数次断言失败：收藏区行序按“收藏区在前”而非字母序、用例漏注册被点击的节点 ID、重挂用例复制了 Widget 对象导致 `WeakMap` 键不匹配。均为测试自身错误，修正后四组分别 6/6、3/3、3/3、3/3 通过，未由此发现新的业务缺陷。

### 未运行、跳过与边界

- **宿主脚本未运行**：`test:host`、`test:equipment-host`、`test:storage-host`、`test:siril-host` 需要浏览器驱动的宿主会话并写入数据根或处理队列。本机唯一可达宿主是本页上文已用于 PH-06 的隔离实例，其数据根与证据需原样保留；本次审查未另建隔离宿主，因此不据此新增通过结论，相关结论沿用上文记录。
- **`mcp/tests`（67 项）未复跑**：迁移差异不涉及 MCP 包，属独立发行物。
- **后端条件跳过 4 项**：`ASTROPHOTO_SIRIL_TEST_CLI` 未设置的 2 条真实 Siril CLI 用例；缺第二本地卷的 2 条跨卷用例。`-m 'not host'` 另取消选择 1 条真实宿主用例（`tests/integration/test_host_runtime.py`）。
- **F-4 未证实**：需要真实宿主按“切换画布时保持侧栏打开”的顺序复现，本次仅有源码证据。
- 本页上文的 PH-06 记录未被改写；本节通过结论只覆盖上表命令与新增加固的代码路径。

## Pi 审查修复与最终复验

**运行标识** `pi-close-2026-11-21`。基于 `4c0cf4d` 加迁移、Pi 补测及本轮修复的工作树。Windows、Node 26.13.1、pnpm 11.13.1、ComfyUI 0.46.0 / Frontend 1.59.6、Siril 1.4.5。隔离宿主使用独立用户目录、数据根和合成 FITS。原始日志、浏览器结果及归档位于 `.artifact/frontend-migration/pi-close/`。 [实施回写](04_DEV.md)

| 项目 | 处置与复验 |
| --- | --- |
| F-1 收藏失败 | 节点目录显示中英文专用错误。Chromium 覆盖宿主同步抛错、异步拒绝、收藏状态回滚、再次提交成功时清除提示。 |
| F-2 设备错误翻译 | 专用错误优先，公共和通用文案补位。设备校验回归断言正确提示、字段及请求编号，并检查无该缺键告警。 |
| F-3 Siril 暂存耦合 | Bundle 提供前缀和允许恢复的文件名。原 Siril 暂存命名继续生效。Cache 回归验证空闲且归属匹配才清理，保留其他处理器、其他实例、活跃租约和未知文件，并拒绝跨目录输入。 |
| F-4 模式切换后拖放 | 修复前官方宿主实测两次原位切换均沿用同一个 canvas。修复后，目录监听在事件发生时检查当前画布。Chromium 强制替换 canvas 后仅接受新画布，覆盖卸载；最终归档的两种初始模式均实测保留目录和搜索，往返切换后可拖入节点。见 `initial/classic/report.json` 和 `registry-host/{classic,nodes-2}/report.json`。 |
| F-5 过期字节码 | 核对后将旧 Siril 模块的六个未跟踪 .pyc 移至系统临时目录，仓库原路径已不存在。Registry 打包检查继续拒绝字节码。 |
| Windows 复验发现 | 首轮真实 CLI 回归出现 `WinError 32`，Siril 已退出但系统尚未释放探测目录，发现流程因此失败。探测目录只对该错误有限重试，其余权限错误保留原失败。新增替身断言，最终全量与归档实测通过。首次失败保留在 `backend.txt`，复跑见 `backend-final.txt`。 |

| 实际执行 | 结果 |
| --- | --- |
| `npx --yes pnpm@11.13.1 -C frontend exec vitest run` | 13 文件、61 通过，含 Pi 新增断言及强制替换画布回归。 |
| `uv run --frozen --no-sync pytest tests/nodes tests/backend tests/integration -q -ra` | 82 通过，2 条跨卷测试因无第二可写卷跳过。已配置真实 Siril CLI 和隔离宿主 URL，包含宿主标记用例。 |
| `uv run --frozen --no-sync pytest tests/packaging -q`；`uv run --project mcp --frozen --no-sync pytest mcp/tests -q` | 分别 10、67 通过。 |
| 前端 `typecheck`、`lint`、`build`、`check-build.mjs`、`check-proxy.mjs`，后端变更及相关测试 Ruff，`scripts/release.py check` | 通过。Vite 独立目录二次构建与仓库 JS/CSS 的摘要相同。该次 Registry SHA-256 为 `c27cbbcd2b7c306a894b16e40785a9f0c59c1ceae8470a830f6d956681726469`。 |
| `node frontend/tests/host/{host-runtime,equipment-host,storage-host,siril-host}.mjs` 分别执行，宿主和 Siril 脚本各用两种画布 | 全部通过。工作区、缓存和环境写入隔离根。最终 Registry 再次从隔离解包运行宿主和 Siril，根路径与代理子路径加载同一产物。 |
| Astropy 读取最终 Registry 的两份正式 FITS | 维度 `3 × 96 × 96`、`BITPIX=-32`、`OBJECT` 与输入一致；两次输出均匹配各自回执摘要，源文件摘要与原始夹具一致。见 `registry-fits-verification.json`。 |

远程 GitHub CI 尚无本工作树运行记录。两条跨卷用例需第二可写本地卷。真实 FITS 夹具无 WCS，未作完整 WCS 验证。无 Bundle 与重启持久性保留原真实宿主记录，本轮通过当前组件/API 回归和其他相关实测覆盖修改。绘图验收到临时 PNG 引用提交，独立的后端 IMAGE 问题见 PRD。 [关闭记录](Close.md)

## 最终复审 F-6 至 F-10

**运行标识** `pi-close-f6-f10-2026-11-21`。HEAD `4c0cf4d` 加当前工作树，Windows 原生 Siril CLI 1.4.5，使用临时数据根与合成 FITS，原始日志位于 `.artifact/frontend-migration/pi-close/f6-f10/`。

| 发现 | 修复与复验 |
| --- | --- |
| F-6 MSYS2 误报 | 修复前，父环境 `MSYSTEM=MINGW64` 下真实 CLI 已生成 FITS 并报告脚本成功，但日志里的 MSYS2 初始化错误被判为 `SIRIL_RUN_FAILED`。新增子进程回归在旧实现红灯，修复后 Windows 只从 Siril 子进程的环境副本去掉 `MSYSTEM` 和 `MSYS`，保留父进程环境、其他变量及错误判断。真实 CLI 分别在下列两种父环境通过。见 `runner-before.txt`、`mingw64.txt`、`ordinary.txt`。 |
| F-7 摘要 | 对上一版 `pi-close/registry.zip` 重算 SHA-256，已补正文中漏写的一位。旧文件保留。 |
| F-8 失效链接与 Git 属性 | 修复五处旧 Handoff 断链，需求文档另补现行能力入口。将换行保留规则迁到 `.agents/handoff/**`。`git check-attr text` 返回 `unset`。 |
| F-9 版本记录 | 测试计划补齐 v0.6 变更记录及 CASE-05 的复验矩阵，与 Feature 索引一致。 |
| F-10 文件地图 | 对照当前源码更新路由聚合、能力读取、Siril 子进程与测试节点。公共科学路由和可选 Bundle 的实际调用及测试已入图，全量 Handoff 校验通过。 |

| 执行 | 结果 |
| --- | --- |
| 设置 `ASTROPHOTO_SIRIL_TEST_CLI`，父环境 `MSYSTEM=MINGW64`，运行 `uv run --frozen --no-sync pytest tests/backend/test_siril.py -q -ra --tb=short` | **17 通过**。包括软件探测、真实候选前后 PNG、正式 FITS、两级串联、回执和源文件完整性。 |
| 保持相同 CLI 与测试命令，清除父环境 `MSYSTEM`、`MSYS` | **17 通过**，覆盖同一组场景。 |
| 普通环境运行 `uv run --frozen --no-sync pytest tests/nodes tests/backend tests/integration -m 'not host' -q -ra` | **82 通过、2 跨卷跳过、1 宿主标记用例未选中**。见 `backend.txt`。 |
| `uv run --frozen --no-sync pytest tests/packaging -q`、变更文件 Ruff、`scripts/release.py check` | **10 通过**，Ruff 通过，版本仍为 0.0.1。另行构建本轮 `f6-f10/registry.zip`，SHA-256 为 `e08f2eb73db5128add837964b944d81e4c378aac084b1f9732a062c0d4c2a3a9`。 |
| Handoff 全量校验、本地链接与归档对账 | 113 个 Handoff 链接和 167 个 Feature/正式文档相对链接通过检查。两版归档摘要均与报告一致。新包包含修正的 Python 入口，JS/CSS 与上一版逐字节一致。`git diff --check` 通过。 |

本轮真实 Siril 执行在后端测试进程和临时数据根完成。前端及官方宿主浏览器验收沿用上一批记录，远程 CI 仍无本工作树结果。 [关闭记录](Close.md)
