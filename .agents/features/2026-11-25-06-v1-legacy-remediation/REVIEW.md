# V1 Legacy Remediation — 代码审查

## REVIEW-chat4-001

- 审查与写入由 chat4（Code Reviewer）于 2026-11-25T14:00:03.4648631-06:00 完成。实施人为 chat2，范围为 TASK-chat1-002..007；chat1 的 TASK-chat1-001 / AUDIT 提供整改清单。
- 依据为 PRD 的 D1–D5、FR-chat1-001..005。比较基准为 `f7a15f237fe4c765ecfbac597388baf8ab83230f`，目标为其上的工作树。101 个已跟踪文件的 `git diff --binary HEAD` SHA-256 为 `def4c1c25522ebe867c84f974dc3958434da8f5739226c7b8b020683aa85b606`，与 RUN-chat2-003 一致，暂存区为空。
- 核对了 Schema 与工作区搬迁、素材导入和目录读写、MCP、Siril 执行与预览、前端宿主设置、测试与文档差异，并读取本 Feature 的六份未跟踪文档。复用生成器与构建验证记录；已生成的 JS/CSS、依赖锁内容、第三方源码和归档证据未逐行复审。AGENTS.md 等实施前已有的用户修改不归责于 chat2。

| 发现 ID | 位置 | 触发条件、预期与实际影响 | 修复建议 | 状态 |
| --- | --- | --- | --- | --- |
| REVIEW-chat4-001-F01 · P1 | `astrophoto/assets/catalog.py:431`；写入方 `astrophoto/assets/library.py:229`、`:408` | 在临时库里，通过 `PATCH /library/assets/{id}` 给 ImageResult 写入 `role=raw` 返回 200。随后 `GET /catalog/assets` 返回 409 `RECOVERY_REQUIRED`，一条记录阻断全库列表以及依赖它的 MCP 查询。收录正式输出时也允许调用方覆盖默认 role。FR-chat1-001/AC-03、FR-chat1-002/AC-01。 | 在收录及编辑事务提交前校验 ImageResult 的最终 role；保留读取端对实际损坏数据的检查。 | 已修复并经 chat2 验证。HTTP 回归验证非法 role 的编辑和收录返回 422，目录仍可读取。见 RUN-chat2-004。 |
| REVIEW-chat4-001-F02 · P1 | `astrophoto/assets/fits.py:27`、`:46`；`extension/siril/frontend/SirilNodes.tsx:89` | 将两个可预览 Siril 节点串联，上游已执行并验证、结果尚未收录时，前端将其输出 UUID 作为下游预览的 asset_id。临时库中该 UUID 经正式输出登记可解析，但预览输入解析返回 `ASSET_NOT_FOUND`。正式执行用同一文件路径记录的来源也成为路径字符串。下游预览无法直接使用本次运行已发布的文件。普通路径端口执行仍可读文件。FR-chat1-001/AC-03..04。 | 让前端传递正式输出的 IMAGE_PATH，或显式传递和解析正式输出来源；统一两端的来源身份，用未收录结果验证候选及正式预览。 | 已修复并经 chat2 验证。前端串联测试与 aiohttp 候选/正式预览回归通过，Siril 处理使用测试替身。见 RUN-chat2-004。 |
| REVIEW-chat4-001-F03 · P2 | `frontend/src/host/nodeBookmarks.ts:14` | 标签页内存只有 A，另一标签页已在服务器保存 A、B。当前页新增 C 时，以内存生成整张替换列表；模拟两个独立状态的宿主接口得到服务器 A、C，回读验证成功，B 丢失。FR-chat1-001/AC-03..04、D2。 | 用公开的 getSetting 读取持久化列表，再将单项变更合入并核对写回值。 | 已修复并经 chat2 验证。跨标签页已保存条目合并测试通过，两种真实宿主模式的 403 回归通过。见 RUN-chat2-004。 |
| REVIEW-chat4-001-F04 · P2 | `astrophoto/assets/imports.py:422`；`astrophoto/assets/catalog.py:277` | 合法的导入请求只给 `kind=image_result` 和名称，省略可选 result_type。同一次实际 HTTP 导入完成后，回执 asset_type 是 image_result，目录条目是 master_frame；MCP 的 library_import_status 直接转发前者。FR-chat1-002/AC-01。 | 在导入计划内确定一次最终类型，属性、回执与目录复用该值；若要将判别字段改为必填，须同步输入契约。 | 已修复并经 chat2 验证。HTTP 默认分类及主帧、MCP 导入状态与目录分类一致。见 RUN-chat2-004。 |
| REVIEW-chat4-001-F05 · P2 | `astrophoto/storage/migration.py:105`；登记方 `extension/siril/processing.py:216` | 给已登记的 autostretch 输出配置其余字段正确、command_id 为 gauss 的 manifest，当前搬迁分组校验照常接纳；搬迁会携带这份与登记矛盾的回执，正式预览的命令校验会拒绝它。FR-chat1-001/AC-03、D3。 | 将登记的 command_id 传给回执校验并核对相等；在预检阶段报告 RECOVERY_REQUIRED。 | 已修复并经 chat2 验证。搬迁预检拒绝错误 command_id，修正回执后搬迁成功。见 RUN-chat2-004。 |
| REVIEW-chat4-001-F06 · P3 | `extension/siril/frontend/SirilNodes.tsx:476`；`frontend/tests/components/ScientificNodes.test.ts:142` | 挂在 Siril 处理节点上的 onExecuted 仍在缺少 astrophoto_output 时读取 astrophoto_asset 并作为 formal_id 使用。现行处理节点发出 astrophoto_output，素材源节点自己的 astrophoto_asset 具有不同语义。现有迟到回执用例仍要求这个旧形状发起正式预览。FR-chat1-001/AC-01、FR-chat1-005/AC-02。 | 处理节点只消费现行输出字段，修改迟到回执夹具，补充旧形状不会触发正式预览的断言。 | 已修复并经 chat2 验证。迟到的现行回执与旧形状拒绝测试通过。见 RUN-chat2-004。 |

### 结论与验证限制

本轮要求修改，六项发现保持 Open。补充验证使用独立临时 Data Root、实际 aiohttp 路由、搬迁分组函数和前端书签函数；书签宿主边界使用内存与服务器值分离的替身。F06 来自源码与现有用例的核对。复测设计见 TEST_PLAN 的 chat4 修订。

定向执行仓库 .venv 的 `python -m pytest --basetemp=<独立短路径> tests/backend/test_siril.py tests/integration/test_photography_library.py tests/integration/test_siril_api.py -q`，共 56 passed、3 skipped。初次使用沙箱默认长路径时临时 manifest 创建失败，回环测试服务也未完成启动；改用短路径和允许回环的环境后取得上述结果。`git -c core.longpaths=true diff --check` 通过。本轮未重跑全量、真实 8188 宿主、真实 Siril CLI 或第二物理卷，已有 RUN-chat2-001..003 保留原证据。

## REVIEW-chat5-001

- 审查 Chat / 角色: chat5 / Code Reviewer（与实现 Chat chat2 不同；chat4 为上一轮独立审查者）
- 实施 Chat / 任务: chat2 / TASK-chat1-002..007
- 审查时间: 2026-11-25T14:08:45-06:00
- 写入 Chat / 时间: chat5 / 2026-11-25T14:08:45-06:00（同一 Chat 直接写回）
- 需求依据: PRD D1–D5；FR-chat1-001/AC-01..04、FR-chat1-002/AC-01..03、FR-chat1-003/AC-01、FR-chat1-004/AC-03、FR-chat1-005/AC-01..03
- 比较基准 / 被审快照: `f7a15f237fe4c765ecfbac597388baf8ab83230f` / 其上工作树；`git diff --binary HEAD` 的 SHA-256 为 `def4c1c25522ebe867c84f974dc3958434da8f5739226c7b8b020683aa85b606`，与 REVIEW-chat4-001、RUN-chat2-003 相同，暂存区为空，未跟踪项只有本 Feature 目录
- 范围与排除项: 101 个已跟踪文件的完整 diff、`docs/**` 与生成物、pytest/MCP/打包套件、前端类型/构建/单测与漂移脚本。排除 `.agents/features/archive/**`、`.artifact/**`、`frontend/src/vendor/**`（只查调用侧）、`node_modules`、`.venv`、`.codegraph`、`uv.lock` 内部条目（只核对 `uv lock --check`）、`js/main.js` 与 `js/assets/main.css` 逐行内容（只用构建与漂移脚本核对）。`AGENTS.md`、`docs/architecture/overview.md`、`docs/product/requirements.md` 中实施前已有的用户修改不归责于 chat2。
- 复审关联: REVIEW-chat4-001。本轮未发现修复提交，F01–F06 保持原状态；下表发现与之不重复（F01 与 chat4 的 F04 同区域，但修的是命名契约而非取值）。

| 发现 ID | 位置 | 预期 / 实际行为及影响 | 建议 | 状态 |
| --- | --- | --- | --- | --- |
| REVIEW-chat5-001-F01 · P2 | 请求侧 `astrophoto/assets/catalog.py:123-136`、`:184-185`，`frontend/src/features/assets/ImportAssets.vue:311`，`mcp/src/astrophoto_mcp/tools/catalog.py:169-171`；响应侧 `astrophoto/assets/catalog.py:385`、`astrophoto/assets/imports.py:422`、`astrophoto/api/catalog.py:56` 与 `:75`；文档 `docs/api/http/contracts.md:62`、`docs/api/http/catalog-contracts.md:28` | 同一概念在请求侧仍叫 `result_type`，在响应、筛选参数和 MCP 入参叫 `asset_type`：`POST` 目录导入用 `catalog.result_type` 指定类型，同一次导入的收据返回同值 `asset_type`；`GET /catalog/image_result` 显式拒绝 `result_type=` 查询参数，却仍接受 `result_type` 作为导入请求字段；MCP 以 `asset_type` 为入参再翻译成 `result_type` 发往 HTTP。违反 D4 与 FR-chat1-002/AC-01「同一概念只用一个名称、不再接受同义别名」：按响应名提交请求得到 422，按请求名筛选也得到 422，契约无法从响应自洽推导。 | 统一为一个名称（响应已用 `asset_type`），把导入请求、MCP 入参/翻译、前端 `ImportAssets.vue` 与两份 HTTP 契约文档同步改名；若坚持请求名不同，须在 PRD 记录例外而不是留在实现里。 | 已修复并经 chat2 验证。HTTP 拒绝旧导入字段，HTTP/MCP/前端 canonical 导入回归通过。见 RUN-chat2-004。 |
| REVIEW-chat5-001-F02 · P3 | `frontend/tests/host/equipment-host.mjs:147` | 该真实宿主清理脚本仍以 `receipt.status() === 409 && error.code === 'EQUIPMENT_REFERENCED'` 保护被引用设备并 `continue`。该错误码已从 `astrophoto/api/errors.py` 的 CONFLICTS（原 409 映射）移除，设备删除不再因引用而失败；全仓仅此一处仍在等待它，分支永不命中：`protectedIds`、其后「unreferenced test devices removed」提示以及对旧删除语义的假设都成为陈述已删除行为的死代码。FR-chat1-001/AC-04、FR-chat1-005/AC-02。 | 删除该分支与 `protectedIds`，按现行删除语义直接断言 204/404，并同步 PASS 提示。 | 已修复并经 chat2 验证。真实设备宿主清理通过，HTTP 验证引用解除、204 和 404。见 RUN-chat2-004。 |
| REVIEW-chat5-001-F03 · P3 | `astrophoto/assets/catalog.py:126` | 外层 `if master_type is not None and body.get("kind") == "image_result":` 之内再次判断 `body.get("kind") != "image_result"`。进入该分支时前半条件恒为假，实际只校验 `result_type == "master_frame"`；读者会误以为还存在其它 kind 路径。属残留死条件，不是行为缺陷。FR-chat1-001/AC-04。 | 只保留 `if body.get("result_type") != "master_frame": raise StorageError("INVALID_REQUEST")`，或用统一的 kind 局部变量表达真实条件。 | 已修复并经 chat2 验证。恒假判断已删，目录导入和光学元数据集成回归通过。见 RUN-chat2-004。 |
| REVIEW-chat5-001-F04 · P3 | `astrophoto/assets/library.py:59` | `catalog_resource` 新增内联字典 `{Video: "video", ImageResult: "image_result", CalibrationMaster: "calibration_master"}[type(typed)]` 反查资源名，而 `astrophoto/assets/catalog.py:20` 的 `MODELS` 已维护同一组「资源名→模型」映射。两处分别演进会漏项 `KeyError`（500）或让返回名与 HTTP 资源段不一致，属本次新增的重复实现。FR-chat1-003/AC-01。 | 把资源名映射定为单一常量（放在 `MODELS` 旁，或 `database/catalog_models.py`、`library_rules.py`），由 `MODELS` 与 `assets/library.py` 共用；`library.py` 不导入 `catalog.py`，无导入环。 | 已修复并经 chat2 验证。目录与素材资料共用模型映射，目录 HTTP 回归通过。见 RUN-chat2-004。 |

### 结论与验证限制

本轮要求修改，另列 4 项新发现（1 项 P2、3 项 P3）。REVIEW-chat4-001 的 F01–F06 在本快照下仍为 Open：工作树 `git diff --binary HEAD` SHA-256 与 chat4 基线相同、DEV_LOG 无处置记录，故未重复复现也未核销。本轮新增 F01 与 chat4 F04 同属 `result_type`/`asset_type` 区域但修复面不同：F04 修同一次导入的取值分叉，F01 修跨请求/响应的命名分叉，两者都改完才算按 D4 收敛。

已执行的检查与真实结果：`git diff --binary HEAD` 的 SHA-256 为 `def4c1c2…`（与 chat4 轮次、RUN-chat2-003 一致，说明本轮无代码漂移；我的 `vite build` 未改变产物）。`uv run pytest tests/nodes tests/backend tests/integration -m "not host" -q` → 227 passed、5 skipped、1 deselected；`uv run --project mcp pytest mcp/tests -q` → 97 passed；`uv run pytest tests/packaging -q` → 17 passed（含生成物漂移与文档链接）；`uv run ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py` → 通过；`uv lock --check` → 通过。前端用 `frontend/node_modules/.bin` 直接执行（本机 `pnpm` 不在 PATH）：`vue-tsc --noEmit` 通过、`vite build` 通过、`check-build.mjs` PASS、`check-proxy.mjs` PASS、`vitest run --no-file-parallelism` 16 文件 135 项通过。首次按默认并发跑 `vitest run` 时 `tests/widgets/serialization.test.ts` 的浏览器 iframe 60 秒内未就绪；单文件与串行全量均通过，判定为本机浏览器夹具的启动抖动，与本 Feature 断言无关，但如实记录。

未验证：真实 8188 宿主（沿用 RUN-chat2-001..003 证据）、真实 Siril 1.4.5 CLI、第二物理卷、`pnpm -C frontend <script>` 原样入口（改为本地二进制等价命令）。另记录一处未复现的风险而非发现：书签跨标签页刷新从 500ms 轮询改为监听宿主 `Comfy.NodeLibrary.Bookmarks.V2.change`，宿主是否为其它标签页的服务器变更派发该事件未经真实宿主验证；写入侧跨标签页丢失已由 chat4 F03 记录。

测试缺口：TC-chat1-009 的「文档断言」仍停留在设计里——`tests/packaging` 只有链接解析与生成物漂移检查，没有任何断言 `docs/**` 不出现已删除的 `alembic`、`/previews/autostretch`、`ASTROPHOTO_IMPORT_ROOTS`（`rg` 已确认无测试覆盖；路由与 Registry 清单部分由 inventory/打包测试间接覆盖）。已写入 TEST_PLAN 的 chat5 修订。

### chat2 实施回写 · 2026-11-25T14:22:46-06:00

上表状态列为本次处置结果。两轮审查的原结论描述当时的快照。10 项均已由实施 Chat 修复并验证，独立复审尚未进行。TC-chat1-009 文档内容断言已加入打包套件。详见 DEV-chat2-005 和 RUN-chat2-004。

## REVIEW-chat6-001

- 审查者、写入者为 chat6（Code Reviewer），实施者为 chat2。2026-11-25T14:29:14-06:00。依据为 D1–D5、FR-chat1-001..005，对照 TASK-chat1-002..007 及 TASK-chat2-001。
- 基准为 HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f`，目标为其上 112 个跟踪文件的工作树差异，`git diff --binary HEAD` SHA-256 为 `a1a2f2820d7eee77ce419de16d1b1a702f4aca9abaf58edf497c099e71423f2d`，与 RUN-chat2-004 一致。暂存区为空，未跟踪项为本 Feature 的 7 份文档。
- 核对重点为数据库初始化、搬迁与回执、HTTP/MCP 分类、Siril 处理和预览、宿主书签及其测试。参考 AUDIT 和正式 RUN；生成 JS/CSS、锁文件、vendored 代码、归档和已有用户修改未作逐行复审。

| 发现 ID | 位置 | 触发过程与影响 | 建议 | 状态 |
| --- | --- | --- | --- | --- |
| REVIEW-chat6-001-F01 · P2 | `astrophoto/assets/fits.py:47`，`extension/siril/previews.py:138` | 串联执行两个 Siril 节点时，上游正式输出尚未收录，下游回执保存上游文件路径。相同输入、参数、revision 的正式预览首次成功。收录上游后，原路径解析成素材 UUID，同一下游正式预览返回 PREVIEW_STALE。收录只新增数据库登记，原 FITS 内容和参数均未变。FR-chat1-001/AC-03..04，域契约见 docs/domains/siril.md 的串联预览。 | 由当前 FormalOutput 登记为同一正式文件提供稳定来源身份，保持 IMAGE_PATH 传输，并保留 revision 与哈希校验。 | 已修复并经 chat2 验证。 正式执行和预览复用登记的输出 ID；aiohttp 测试同一 IMAGE_PATH 在收录前后都能显示下游正式预览，保留版次和哈希检查。 见 RUN-chat2-005。 |
| REVIEW-chat6-001-F02 · P2 | `astrophoto/assets/library.py:244`，`astrophoto/assets/catalog.py:382` | 导入 dark 校准主帧，然后 PATCH 素材 attributes.role 为 processed，得到 HTTP 200。GET 同一 ID 的 image_result 详情返回 asset_type=image_result、master_type=dark，calibration_master 详情却返回 asset_type=master_frame、master_type=dark。普通结果的筛选会纳入这条仍登记为校准主帧的记录。FR-chat1-002/AC-01。 | 在素材编辑事务内校验 CalibrationMaster 与最终 role 的一致性。需要改变校准分类时使用能同时维护关联记录的目录编辑流程。 | 已修复并经 chat2 验证。 素材 PATCH 转为 processed 返回 422，属性和版本不变；两类详情、筛选与原集合绑定保持一致，类型化目录仍可修改用途。 见 RUN-chat2-005。 |
| REVIEW-chat6-001-F03 · P2 | `frontend/src/host/nodeBookmarks.ts:30` | A 页读到 [A]，成功保存 [A,C]。B 页随后保存 B，服务器为 [A,C,B]。A 页的验证 GET 此时网络失败，catch 用最初的 [A] 再次调用持久化 setter，服务器最终只剩 [A]。第二次写入覆盖了已成功保存的两个更改。使用当前 TypeScript 函数与分开的内存/服务端设置替身复现。FR-chat1-001/AC-03..04、D2。 | 将回读失败视为状态未知并反馈，恢复读取后再同步。避免使用操作前的快照发出补偿性整表写入。 | 已修复并经 chat2 验证。 删除旧快照补偿写入。Chromium 复现另一页保存后验证 GET 失败，断言服务器保留两次写入、恢复联网后侧栏同步。真实宿主两种模式复验 403 和重试。 见 RUN-chat2-005。 |

### 历史发现复核

- REVIEW-chat4-001-F01..F06 的原触发条件均已修复。F01 的非法角色 raw、F02 的未收录串联、F03 的另一页先完成写入、F04 的默认导入分类、F05 的 command_id 错配、F06 的旧节点回执均有当前源码或定向回归支持。本轮 F01..F03 的触发条件另列于上表。
- REVIEW-chat5-001-F01..F04 的原问题已修复。导入链使用 asset_type，设备清理分支已删除，prepare 已删除恒假条件，资源模型共用 CATALOG_MODELS。TC-chat1-009 的现行文档断言已执行通过。

### 验证与结论

要求修改。6 项后端/HTTP/MCP 定向用例、1 项文档断言和 19 项 Chromium 组件用例全部通过。后端定向范围为 image_result 导入与非法角色、未收录输出串联预览、部分搬迁的回执、设备删除及两个 MCP 导入模式；前端执行 ScientificNodes.test.ts、NodeCatalog.test.ts。git diff --check 通过。

独立复现使用临时 Data Root、实际 aiohttp 路由、当前 Siril 正式执行与预览校验函数（以复制 FITS 替代 CLI）、当前书签函数和宿主设置替身。本轮的浏览器与回环用例在沙箱外使用已有依赖执行。未重跑离线全量、真实 8188 宿主、真实 Siril CLI 或第二物理卷。正式 RUN 仍见 TEST_REPORT。

## REVIEW-chat7-001

- 审查 Chat / 角色：chat7 / Code Reviewer（实施 Chat 为 chat2；前序审查者为 chat4、chat5、chat6）
- 实施 Chat / 任务：chat2 / TASK-chat2-001，复审 REVIEW-chat4-001、REVIEW-chat5-001、REVIEW-chat6-001 的处置结果
- 审查时间 / 写入：chat7 / 2026-11-25T14:39:53.372410-06:00（同一 Chat 直接写回）
- 需求依据：PRD D1–D5；FR-chat1-001/AC-01..04、FR-chat1-002/AC-01..03、FR-chat1-003/AC-01、FR-chat1-004/AC-01..03、FR-chat1-005/AC-01..03
- 比较基准 / 被审快照：HEAD `f7a15f237fe4c765ecfbac597388baf8ab83230f` + 其上 112 个跟踪文件的工作树差异；`git diff --binary HEAD` SHA-256 为 `a1a2f2820d7eee77ce419de16d1b1a702f4aca9abaf58edf497c099e71423f2d`，与 RUN-chat2-004、REVIEW-chat6-001 相同；暂存区为空；未跟踪项仅本 Feature 目录。差异中的 6 个删除项为 `astrophoto/database/migrations/**` 两项（D1 预期）和 `.agents/features/archive/**` 的 4 个 PNG（审查排除的既有证据目录本地状态，不影响结论）。审查复现脚本位于 `.artifact/review-chat7/**`（git 忽略，不是产品代码）。
- 范围与排除项：112 个跟踪文件差异、`docs/**` 与生成物、pytest/MCP/打包套件、前端类型/构建/单测。排除 `.agents/features/archive/**`、`.artifact/**`（只读复现证据）、`frontend/src/vendor/**`（只查调用侧）、`node_modules`、`.venv`、`.codegraph`、锁文件内部条目、`js/main.js` 与 `js/assets/main.css` 逐行内容（只用构建与漂移脚本核对）。`AGENTS.md` 等实施前已有的用户修改不归责于 chat2。
- 复审关联：REVIEW-chat6-001-F01..F03 由本轮独立复现，仍为 Open，沿用原发现 ID；REVIEW-chat4-001-F01..F06、REVIEW-chat5-001-F01..F04、TC-chat1-009 按原触发条件复核为已修复。

| 发现 ID | 位置 | 触发过程与影响 | 建议 | 状态 |
| --- | --- | --- | --- | --- |
| REVIEW-chat7-001-F01 · P2 | `scripts/import_library_test_assets.py:110` | 文档化的测试素材导入脚本（`docs/development/setup-and-testing.md:140-142`）对校准主帧仍发送已删除的 `type`：`{"kind":"calibration_master", "name":..., "type": file["category"]}`。生成器 `scripts/generate_library_test_assets.py:147` 确有 `entry='calibration_master'` 夹具。实测当前 `catalog.prepare` 对该请求抛 `INVALID_REQUEST`（HTTP 422），换用 `master_type` 正常；脚本执行到校准主帧即中断。删除别名后调用方未全部同步，违反 FR-chat1-001/AC-04、FR-chat1-002/AC-02。 | 改为 `"master_type": file["category"]`，并在 AUDIT 中更新该文件的结论与验证方式。 | 已修复并经 chat2 验证。 脚本生成 master_type。常规 HTTP 回归与生成器输出的真实合成 dark 夹具均验证 canonical 预检 200、旧字段 422。 见 RUN-chat2-005。 |
| REVIEW-chat7-001-F02 · P3 | `astrophoto/assets/library.py:59`、`:132`；`astrophoto/database/catalog_models.py:122` | 校准主帧会同时登记 `CalibrationMaster` 与影子 `ImageResult`。`_search_assets` 以 `video or image or master` 取模型，`_asset_data` 也先命中 `ImageResult`，因此 `catalog_resource` 恒为 `image_result`。实测 dark 校准主帧的 `/library/assets` 返回 `catalog_resource=image_result`，而 `/catalog/calibration_master/{id}` 存在且返回 `asset_type=master_frame`。前端 `AssetsPanel.vue`/`CatalogDetails.vue` 中 `catalog_resource === 'calibration_master'` 的分支永不命中；AUDIT F-chat1-012 计划的 `catalog_resource` 含 `calibration_master` 及 `is_calibration_master` 未落地。违反 FR-chat1-002/AC-03 的准确命名要求。 | 取模型时优先 `CalibrationMaster`（或补 `is_calibration_master`），并增加校准主帧的素材列表断言。 | 已修复并经 chat2 验证。 素材列表和详情返回 calibration_master；HTTP 回归核对转为普通主帧后的资源名，Chromium 验证打开校准详情。 见 RUN-chat2-005。 |
| REVIEW-chat7-001-F03 · P3 | `AUDIT.md`（`scripts/import_library_test_assets.py`、`astrophoto/assets/imports.py`、`astrophoto/assets/library.py` 行；文件末次修订仍为 13:51） | 最近一轮修复完成后 AUDIT 未同步：`scripts/import_library_test_assets.py` 仍为 CLEAN（实际已因 `type` 失效）；`astrophoto/assets/imports.py` 仍为 CLEAN（实际已多次修改）；`library.py` 只记 `catalog_kind` 泄露，未记最终 role 校验与 `CATALOG_MODELS` 共用；F-chat1-012 的整改未核销。TASK-chat1-007 的验收明确要求“返工后的 `AUDIT.md` 全项状态更新”（DEV.md）。违反 FR-chat1-004/AC-01..02。 | 按当前实现更新受影响文件的结论、F-chat1-012 状态和验证方式，标注写入 Chat 与时间。 | 已修复并经 chat2 验证。 更新 AUDIT F-chat1-012、相关文件和用例条目，补记上轮导入回执与共用模型映射。 见 RUN-chat2-005。 |

### REVIEW-chat6-001 复核

- F01：已用本轮独立脚本复现。临时 Data Root 中先后执行两个 Siril 节点（复制 FITS 代替 CLI），未收录时下游正式预览 ready；收录上游后 `fits.resolve_input(上游路径)` 返回素材 UUID，同一 `image_path` + `formal_id` 请求的作业失败为 `PREVIEW_STALE`。跟踪差异未变，仍为 Open。
- F02：已复现。dark 校准主帧经 `PATCH /library/assets/{id}` 将 role 改为 `processed` 返回 200；随后 `/catalog/image_result/{id}` 报 `asset_type=image_result`，`/catalog/calibration_master/{id}` 报 `asset_type=master_frame`，两个 `asset_type` 筛选互相矛盾。仍为 Open。
- F03：按当前 `frontend/src/host/nodeBookmarks.ts:20-30` 复核。若写后回读抛错，`restore` 仍是操作前的快照，catch 分支会用该快照再做一次整表写入，覆盖其它标签页已保存的条目。现有 NodeCatalog 用例只覆盖“回读与写入不一致”，未覆盖“回读失败后回滚”。仍为 Open。

### 结论与验证限制

本轮要求修改。chat4/chat5 的 10 项原发现按原触发条件均已修复；chat6 的 3 项 P2 在同一快照下仍存在；本轮新增 1 项 P2、2 项 P3。

已执行并取得的真实结果（仓库 `.venv`，因本机 `pnpm` 不在 PATH，前端使用 `frontend/node_modules/.bin` 等价的本地二进制）：`python -m pytest tests/nodes tests/backend tests/integration -m "not host" -q --basetemp=<短路径>` → 229 passed、5 skipped、1 deselected；`python -m pytest mcp/tests -q` → 97 passed；`python -m pytest tests/packaging -q` → 18 passed；`ruff check astrophoto extension nodes mcp/src mcp/tests scripts tests __init__.py` → 通过；`vue-tsc --noEmit` → 通过；`vitest run --no-file-parallelism` → 16 文件 137 项通过。`git diff --binary HEAD` 的 SHA-256 在审查前后保持 `a1a2f28…`，暂存区始终为空。

定向复核：`tests/integration/test_photography_library.py -k "one_asset_type or calibration_master_import"`、`tests/packaging/test_document_navigation.py`、`tests/backend/test_storage.py -k "document or partial_migration"` 合计 7 passed。审查复现脚本：`.artifact/review-chat7/test_chain_after_collect.py`（收录上游后下游正式预览失败）、`test_calibration_resource.py`（校准主帧 `catalog_resource`）、`test_role_flip.py`（角色漂移），均独立运行并保留原输出。

未验证：真实 8188 宿主、真实 Siril 1.4.5 CLI、第二物理卷（沿用 RUN-chat2-001..004 的环境跳过记录）。chat6-F03 未重写浏览器夹具，仅按当前源码路径复核；其测试缺口见 TEST_PLAN 的 chat7 修订。

### chat2 实施回写 · 2026-11-25T14:55:17-06:00

REVIEW-chat6-001-F01..F03、REVIEW-chat7-001-F01..F03 的逐项处置见状态列。原结论记录各自审查时的快照。补齐的用例见 TEST_PLAN 的 chat2 修订，实际验证见 RUN-chat2-005。本次回写记录实施验证。
