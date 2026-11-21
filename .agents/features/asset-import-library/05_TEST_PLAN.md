# 素材导入与资产登记 · 测试计划

**版本** v0.4 · 2026-11-21 · 模式 B（当前已实现 API、占位和科学读取），恢复 UI 与开放产品行为保留预计场景。基线见[索引](00_FEATURE_INDEX.md)，规则来源为 [PRD](01_PRD.md)，真实行为来源为 [DEV](04_DEV.md)。所有当前运行状态均为 NOT_RUN。历史 React 浏览器导入保留在[历史测试报告](06_TEST_REPORT.md)，旧脚本可用 `git show 4c0cf4d:frontend/ui/storage-host.mjs` 查看；当前同名脚本测试 Storage/Environment，不执行素材导入。

独立运行 `frontend-vue-v1596-local-2026-11-21` 的 10-A/B 验证 CASE-05 的真实宿主占位、双语和零素材请求部分，05-A/B、08-A 验证科学入口和无 Bundle 的有限场景。该次运行的跨卷路径因缺少第二测试卷跳过，本轮未重跑。 [独立迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

## 环境、隔离与执行顺序

执行方式以本专题的产品决定为准。当前测试夹具使用隔离根和测试自建原件，任何目录清理只限该根。用户此前要求测试形成 API 删除闭环，现有资产 API 没有删除资产的操作，因此当前无法为导入资产实现该闭环。完成测试时应记录保留的资产及清理方式，将 API 删除作为待决能力，不能把解绑会话或删除文件当作删除资产的验证。

1. 用 pytest 的独立 `tmp_path` 造两份源文件树、Workspace、Cache 与库，通过 `ASTROPHOTO_IMPORT_ROOTS` 只放行本用例目录；比较字节、记录数、路径与显式操作 ID。容量和源变动用 monkeypatch/故障点，子进程崩溃流程退出后关闭操作线程，然后交由临时目录清理。两卷用 `ASTROPHOTO_TEST_SECOND_VOLUME` 显式指定隔离位置。
2. aiohttp `TestClient/TestServer` 检查 HTTP 授权、字段、状态和错误体。Vue 组件测试使用宿主替身，检查占位不调资产 API。科学路由使用测试生成的 Astropy FITS；真实工作流和宿主 Widget 在 ComfyUI 0.46.0 / Frontend 1.59.6 的回环专用实例验收，缺宿主或样本记录 BLOCKED。
3. 集中验证 `uv run pytest tests/backend/test_storage.py tests/integration/test_storage_api.py tests/backend/test_siril.py tests/integration/test_siril_api.py -q` 与 `pnpm -C frontend test`。真实宿主保存并重开与已登记 FITS ID 关联的样本，再运行来源节点；记录宿主、样本来源、版本、退出状态与未覆盖项。相关环境按[开发文档](../../../docs/development.md)准备。

## 用例与已知覆盖

| CASE / 需求与风险 | 前置、步骤及预期 | 已有覆盖与缺口 |
| --- | --- | --- |
| CASE-01 · FR-01 · 高 | 在两个授权目录放普通样本和子目录，加入重复来源与越界链接；先 POST preview，再查资产与 operation 数未增。reference 报候选及不写目的地，copy 报目标空间；测试越界/保护根、相对路径、只读、离线和满盘拒绝。用边界输入检查 0、100、101 个来源与候选上限，确认超限请求无登记。 | `test_reference_multiple_roots_mode_snapshot_and_relocation`／`test_copy_preflight_blocks_offline_read_only_full_and_unauthorized`／`test_reject_links_unc_and_relative_paths`；`test_http_storage_import_and_access_boundary` 校验预检与授权。边界计数、子项混合错误与预检无数据库写入的 HTTP 专测待补。 |
| CASE-02 · FR-02 · 高 | reference 后检查仅外部登记，copy 目的地内容相同且原件保留。重复同键和同一 body 只返回旧 ID，改变 body 报冲突。发布后事务前和复制途中故障或终止，重启/重试核对已有 object/回执无重复。再测可取消阶段和源变化，部分成功回执的 failed 项可和完成数分辨。 | `test_copy_override_idempotency_and_real_bytes`、`test_copy_detects_inflight_source_change`、`test_copy_recovers_after_publish_before_db_commit`、`test_cancel_partial_staging`、`test_process_exit_during_copy_resumes_own_staging`、`test_http_storage_import_and_access_boundary`。当前无浏览器导入；混合失败和容量边界需以隔离数据补测，界面恢复、结果定位与内容去重由 Q-02、Q-03、Q-04 核对。 |
| CASE-03 · FR-03 · 高 | 登记 ≥101 个小样本，通过 after 查完整去重结果和末页 null。移动外部文件并查 availability，原 ID 保留且报告离线。用同大小合法目标重绑后同 ID 可读，授权外、大小变化、受管资产或目标已登记的重绑失败且旧条目仍在。历史名称搜索/排序恢复后另从多页混合结果验证。 | `test_reference_multiple_roots_mode_snapshot_and_relocation` 断言原件移位与同 ID 重绑；`test_http_storage_import_and_access_boundary` 验证列表返回 managed。HTTP 超页、availability、随机同大小替换和所有重绑拒绝分支专测待补，同大小身份判据由 Q-01 决定。 |
| CASE-04 · FR-04 · 中 | 为资产分别附加两个会话，列表读双关联；重复附加再解除其一两次，库仍保留资产和另一关联，磁盘内容无变。拒绝非法 attached/session 与未知资产，不影响已写关系。 | `test_reference_shared_sessions_leave_the_file_and_other_reference` 直接覆盖服务语义。PATCH DTO、关联错误反馈与完整会话界面待补；界面归 Q-02。 |
| CASE-05 · FR-05 · 高 | 打开新侧栏与重新访问 Assets，检查显示本地化占位，监听无 `/assets` 列表或变更。另在隔离库登记 FITS，重开引用其 ID 的工作流，候选展示名称并解析同路径。原件移开后执行报来源错误；可信本机直接路径可用但不登记。 | `SidebarNavigation.test.ts` 检查 Assets 首屏零请求和语言；`test_scientific_api_access_source_and_cache` 检查已登记 FITS 候选与服务器读取；`test_generic_scientific_nodes_and_routes_without_siril` 检查通用节点及路由独立性。真实 Vue 宿主的已登记旧工作流重开与原件离线反馈待复验。 |
| CASE-06 · FR-02、FR-03 · 高 | 构造同路径相同 stat 重复 reference、变化 stat 冲突、两个独立 copy，以及大小相同但内容不同的重绑候选。按 ID、计数、目标路径和源摘要核对。 | 重复 reference、copy 和同大小重绑应分开验证。当前重绑只校验大小，不应把同大小候选误记为已验证内容一致。Q-01、Q-03 决定未来期望。 |
| CASE-07 · FR-01、FR-02 · 高 | 预检后改变目录再导入。分别创建部分失败、全部失败、超过 100 个失败项，以及取消前后已提交项。验证公开回执字段、计数、错误上限和终态，逐项核对源文件与登记数。 | `_files` 在预检及执行时独立运行。混合失败、错误上限和取消的 HTTP 对账需补测。完整失败路径和按项补导待 Q-04。 |
| CASE-08 · FR-02～05 · 高 | 每次测试创建专用素材，走预检、导入、查询、会话解绑、可用性和可执行的重绑。若将来引入资产删除，分别验证 external 与 managed 删除后的原件、副本、关系和工作流引用，再通过列表与 availability 验证删除结果，最后清除本测试隔离目录。 | 当前无资产删除 API，该闭环的删除步骤 BLOCKED，其他步骤可执行。删除语义和接口由 Q-05 评审。 |

现存位置：[后台](../../../tests/backend/test_storage.py) · [HTTP](../../../tests/integration/test_storage_api.py) · [侧栏](../../../frontend/tests/components/SidebarNavigation.test.ts) · [科学 HTTP](../../../tests/integration/test_siril_api.py) · [现行宿主脚本](../../../frontend/tests/host/storage-host.mjs)。报告明确区分已有测试、未覆盖路径和真实执行结论。
