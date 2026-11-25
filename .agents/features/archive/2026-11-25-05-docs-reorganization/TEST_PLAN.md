# 文档重组 — TEST_PLAN

初始化：chat1 · 2026-11-25T08:05:55-06:00

## 范围与测试策略
- FR-chat1-001：核查目录、链接、现行规则、验证边界与 Skill 联动。
- Updated by: chat1 · 2026-11-25T08:05:55-06:00

## 测试覆盖
| TC ID | FR/AC | 场景及预期 | 层次 | 状态 | Chat |
| --- | --- | --- | --- | --- | --- |
| TC-chat1-001 | AC-01,03 | 导航及相对链接解析，旧入口无失效引用 | 静态 | Local static checked: DEV-chat1-001; formal pending | chat1 |
| TC-chat1-002 | AC-02 | 对照归档和源码核实模型、权限及验收边界 | 内容审查 | Local static checked: DEV-chat1-001; formal pending | chat1 |
| TC-chat1-003 | AC-04 | 素材注销相关文档导航与知识选择规则可定位；实际 Agent 行为联调本次不执行 | 静态检查 | Local static checked; Agent 行为不在本次范围 | chat1 |

## 待补覆盖与必要回归
真实宿主、Desktop 端口锁及双物理卷不在本次文档整理范围。

## 局部验证记录

- chat1 · 2026-11-25T08:08:22-06:00 · DEV-chat1-001：链接及锚点静态检查、素材注销场景入口定位通过；未执行独立 Agent 行为模拟或正式 RUN。


## 代码核查后的覆盖补充

- chat1 · 2026-11-25T08:13:12-06:00 · DEV-chat1-002：增加逐章源码/归档对照、设备版本字段的各入口行为、MCP 发现与信任边界、历史发行状态，以及隔离 Feature 生命周期场景。现有测试仅定位，未运行；TC-chat1-002/003 的先前静态结果不代表完整覆盖。

## 本次增量验证

- chat1 · 2026-11-25T08:18:00-06:00 · DEV-chat1-003：设备和素材注销后端定向测试 7 项通过；Markdown 文件和锚点静态扫描通过。MCP 分类测试两次及节点注册测试一次无输出后中止，未得到结论。隔离模板路由检查不等于 Agent 行为联调；TC-chat1-002/003 及正式 RUN 尚未完成。

## 回环环境复测

- chat1 · 2026-11-25T08:24:56-06:00 · DEV-chat1-004：MCP 分类测试 8 项、节点注册测试 1 项在允许回环的环境分别通过；加此前设备和素材注销定向 7 项。混合测试根目录的一次运行发生 conftest ImportError，尚未诊断。14 份入口文档路径与锚点扫描通过。实际 Agent 行为联调和正式 RUN 待执行。

- chat1 · 2026-11-25T08:25:46-06:00 · DEV-chat1-005：预加载 FastMCP 后混合运行 16 项通过、1 项插件重写警告；原混合命令的导入错误仍未确定根因。行为联调及正式 RUN 未完成。

## 验证范围修订

- chat1 · 2026-11-25T08:27:45-06:00：用户明确现在不需要实际 Agent 行为联调；已有静态检查不升级为行为通过。其他文档核验和正式验证范围保持。


## 章节对照与定向测试

- chat1 · 2026-11-25T08:30:12-06:00 · DEV-chat1-007：[内容核查矩阵](CONTENT_AUDIT.md)记录章节依据与余项。存储/设备/素材 53 passed、2 skipped；节点/Siril API 3 passed；MCP 发现/设备 24 passed。跳过原因按测试代码要求第二本地卷；不代表真实宿主或外部程序验收。

## 正式 RUN 测试映射

- chat1 · 2026-11-25T08:33:41-06:00：TC-chat1-001 映射 tests/packaging/test_document_navigation.py::test_maintained_markdown_links_resolve；TC-chat1-003 映射同文件 ::test_feature_pipeline_entrypoints_available（仅静态接口，不进行 Agent 行为联调）。
- TC-chat1-002：审阅 CONTENT_AUDIT.md 并核对各文档的现行/历史/规划边界；选用 tests/backend/test_storage.py、test_agent_direct_rules.py、test_equipment_simple.py、tests/nodes/test_registration.py、tests/integration/test_siril_api.py、mcp/tests/test_disclosure.py 和 test_equipment.py 进行关联回归；无法通过自动测试证明的各章语义仍列为内容审查限制。
- 运行前后记录被测文件哈希；第二物理卷、真实 Desktop、真实 Siril 及公共发行实测按用户决定搁置，不作为本次通过项。

## 正式 RUN 范围修订

- chat1 · 2026-11-25T08:35:43-06:00：用户明确节点与 Siril 部分开发及专项验证暂缓，后续重新完整开发；本次聚焦 MCP、存储、设备、素材与文档导航。历史及刚才的节点/Siril 测试记录保留，但不计入本次闭环通过项。硬件、外部发行状态及实际 Agent 行为联调继续搁置。

## 正式 RUN

- chat1 · 2026-11-25T08:37:59-06:00：RUN-chat1-001 已完成，测试结果、跳过项、范围及稳定性限制详见 [TEST_REPORT](TEST_REPORT.md)。节点/Siril 专项及硬件实测按用户决定暂缓；实际 Agent 行为联调不在本次范围。

## 接口参考覆盖计划

- chat1 · 2026-11-25T08:45:50-06:00 · FR-chat1-002 / TASK-chat1-003：新增路由清单与 MCP 工具清单覆盖，核验条件注册、请求语义、错误及副作用、HTTP 映射、导航链接和漂移。原 RUN-chat1-001 未覆盖本新增需求；保留历史，需新验证。节点/Siril 专项、真实 Desktop 与第二物理卷继续暂缓。

## 接口文档初版局部验证

- chat1 · 2026-11-25T08:51:51-06:00 · DEV-chat1-011：tests/packaging/test_api_inventory.py 与 test_document_navigation.py 共 5 passed；注册清单/Schema 快照覆盖自动、本机及远程三种配置。HTTP 逐接口请求、返回、错误与副作用及可执行示例仍未覆盖；不能将初版当成 FR-chat1-002 全部验收通过。RUN-chat1-001 对新增 FR 不适用。

- chat1 · 2026-11-25T08:52:46-06:00 · DEV-chat1-012：源码字段线索和工具定位重新生成后，接口与导航测试 5 passed；HTTP 静态线索不是完整 Schema，逐项契约与隔离示例仍待完成。

## v1 基线与接口验证

chat1 · 2026-11-25T09:10:00-06:00 · TASK-chat1-004 / FR-chat1-003、FR-chat1-002 v2。以下为实施后的覆盖计划。

| TC | 对应需求 | 场景及可观察预期 | 测试位置及状态 |
| --- | --- | --- | --- |
| TC-chat1-004 | FR-chat1-003 AC-01 | 空 Data Root 初始化 v1，重启保留 v1 记录。已知开发期数据库返回可识别错误，文件、内容和版本保持原样。 | tests/backend/test_storage.py、tests/integration/test_storage_init.py。拟补最小开发期夹具与前后散列比对。Planned。 |
| TC-chat1-005 | FR-chat1-003 AC-02、03 | 检查确认退役的 HTTP 路径、动态资源和旧字段。旧通配分支不能落到其他写操作。前端和 MCP 只发送 v1 请求，并保留影响数量和有效并发检查。 | tests/backend/test_agent_direct_rules.py、tests/integration/test_equipment_api.py、test_library_mcp.py、mcp/tests/test_catalog_tools.py、test_equipment.py。按最终保留清单补选择器。Planned。 |
| TC-chat1-006 | FR-chat1-003 AC-03 | 验证类型化主帧、校准、项目引用、浏览器引用和复制导入。v1 自建任务暂停、重启或重试后仍能回读。验证注销、受管文件删除和工作区迁移的文件保护。 | 复用 tests/integration/test_photography_library.py 的主帧和直传恢复用例，另核对 test_direct_import.py、test_storage_api.py 及相关前端组件。Planned，变更前证据见 [DEV-chat1-013](DEV_LOG.md#dev-chat1-013)。 |
| TC-chat1-007 | FR-chat1-002 v2 AC-01–05、FR-chat1-003 AC-01、02 | 保留接口具备可追溯说明及隔离示例。清单与实际 HTTP 注册和 MCP Schema 一致。COMFYUI_URL 不影响自动模式采样。核对生成页、链接及发行包中的 v1 基线。 | tests/packaging/test_api_inventory.py、test_document_navigation.py、test_contents.py 和相应集成选择器。现有清单/导航检查有局部证据，生成隔离、逐接口及新基线验证待执行。 |

- 旧版自动迁移及旧校准记录回退的正向测试属于历史调查证据。按最终退役范围改为验证拒绝旧输入与保留原数据，并继续覆盖当前模型。6 项历史复验的选择器见 DEV-chat1-013。
- RUN-chat1-001 保留在 [TEST_REPORT](TEST_REPORT.md)，仅覆盖原基线。FR-chat1-002 v2 和 FR-chat1-003 待实施后建立新 RUN。真实 Desktop、第二物理卷、节点/Siril 专项及实际 Agent 行为联调继续暂缓。


### V1 实际实现映射

chat1 · 2026-11-25T09:35:22-06:00 · TASK-chat1-003、004 / DEV-chat1-014。本段给出实际实现测试，替代上述 Planned 状态。执行结果见 RUN-chat1-002。

| TC | 选择器与实证边界 |
| --- | --- |
| TC-chat1-004 | tests/backend/test_storage.py::test_first_start_and_reentry、test_bootstrap_interrupted_after_database_commit、test_legacy_dev_schema_is_preserved。tests/integration/test_storage_init.py::test_development_database_is_rejected_without_changing_files 覆盖三个开发期版本、WAL/SHM、数据库及外部源，并经 HTTP 核对错误和指引。 |
| TC-chat1-005 | tests/integration/test_photography_library.py::test_retired_library_routes_and_import_fields_cannot_write、test_project_concurrent_updates_and_removal_use_current_tree。test_equipment_api.py、test_library_mcp.py 及两个 Vitest 组件套件检验新的参数和项目逻辑。 |
| TC-chat1-006 | test_photography_library.py 的类型化校准、项目引用、直传重启、受管文件及外置工作区用例。test_direct_import.py、test_storage_api.py 和 tests/backend/test_storage.py 覆盖在途恢复、存储位置及文件保护。 |
| TC-chat1-007 | tests/packaging/test_api_inventory.py、test_document_navigation.py、test_contents.py。覆盖实际注册（含可选 Bundle）、MCP 运行时三模式及 COMFYUI_URL 隔离、文档条目、导航和 V1 发行包组成。隔离业务例由相应集成套件核验。 |

### REVIEW-chat2-001 覆盖缺口

chat2 · 2026-11-25T10:19:29-06:00 · TASK-chat2-001。以下为 [REVIEW-chat2-001](REVIEW.md#review-chat2-001) 确认的待补覆盖。

| 既有 TC | 关联发现 | 待补验证 |
| --- | --- | --- |
| TC-chat1-004 | REVIEW-chat2-001-001 | 用主文件尚未 checkpoint 的 V1 数据库重启，验证可继续使用。复用开发库 WAL/SHM 字节保护用例验证拒绝路径。 |
| TC-chat1-005、TC-chat1-006 | REVIEW-chat2-001-002 | 用隔离受管文件覆盖含无效旧参数的拒绝行为，核对文件和登记均保留，并验证 V1 有效请求可直接删除受管文件。 |
| TC-chat1-007 | REVIEW-chat2-001-004、005 | 将实际回执字段和项目循环错误码纳入隔离契约核对，检查各工具示例存在且输入符合其运行时 Schema。 |
| TC-chat1-001、TC-chat1-003 | REVIEW-chat2-001-006 | 扫描活动 Feature 的本地路径和锚点，核对已移除的历史源码通过基准版本引用可定位。 |

### 审查修复的测试映射

chat1 · 2026-11-25T10:29:41-06:00 · TASK-chat1-005。以下已实现，局部验证见 [DEV-chat1-015](DEV_LOG.md#dev-chat1-015)。

| 既有 TC | 修订后的选择器与预期 |
| --- | --- |
| TC-chat1-004 | `tests/backend/test_storage.py::test_v1_reopens_with_schema_only_in_committed_wal` 保持读事务以阻止 checkpoint，重开后读回实例身份。 `tests/integration/test_storage_init.py::test_development_database_is_rejected_without_changing_files` 核对 WAL 中的旧版本及原文件字节。 |
| TC-chat1-005、TC-chat1-006 | `tests/integration/test_photography_library.py::test_copy_preview_snapshot_and_reference_independent_identity` 验证旧字段单独或同时出现都拒绝，保留文件及登记。空对象可删除受管副本，登记仍可查询。前端用空对象发出请求。 |
| TC-chat1-007 | `tests/integration/test_storage_init.py::test_http_init_repairs_and_rechecks_the_host_root` 核对 `checks`。 `tests/integration/test_direct_import.py::test_manifest_and_direct_upload_routes` 核对条目的工作区。 `tests/integration/test_photography_library.py::test_project_concurrent_updates_and_removal_use_current_tree` 核对自引用和成环时的 HTTP 错误码。 `tests/packaging/test_api_inventory.py::test_every_mcp_tool_has_an_example_validated_against_its_schema` 检查全部入口的示例。该检查验证入参 Schema，示例结果为使用说明。 |
| TC-chat1-001、TC-chat1-003 | `tests/packaging/test_document_navigation.py::test_maintained_markdown_links_resolve` 纳入活动 Feature 的本地链接与 Markdown 锚点。基准提交历史引用由 `git cat-file` 核对。 |

### REVIEW-chat2-002 覆盖缺口

chat2 · 2026-11-25T10:40:03-06:00。以下为[本轮复审](REVIEW.md#review-chat2-002)发现的待补回归。

| 现有用例 | 发现 | 待补验证 |
| --- | --- | --- |
| TC-chat1-005、TC-chat1-006 | REVIEW-chat2-002-001 | 对临时素材分别提交含旧字段的注销及属性更新请求，断言请求被拒绝、登记和属性未变、原文件可读。再验证空对象注销和有效属性更新。 |
| TC-chat1-004 | REVIEW-chat2-002-002 | 对有已提交 WAL 的健康 V1 库模拟系统临时盘空间不足，验证可重启并读回已提交数据。复用旧库拒绝用例核对主库、WAL 和 SHM 字节保留。 |

### REVIEW-chat3-001 覆盖缺口

chat3 · 2026-11-25T10:45:39-06:00。以下为 [REVIEW-chat3-001](REVIEW.md#review-chat3-001) 发现的待补回归。

| 现有用例 | 发现 | 待补验证 |
| --- | --- | --- |
| TC-chat1-005、TC-chat1-006 | REVIEW-chat3-001-001 | 对项目、节点和至少一类类型化素材分别用陈旧 `revision` 提交 PATCH/DELETE，断言按处置决定被拒绝（`REVISION_CONFLICT`）或字段被拒；不允许出现接受但忽略。若保留校验，恢复 `test_catalog_unregistration_uses_the_displayed_master_revision` 的冲突断言。 |
| TC-chat1-007 | REVIEW-chat3-001-002 | 不新增业务测试；在 `.gitignore` 覆盖 `.artifact/` 后核对 `git status --porcelain` 不再出现该目录，并清理本轮测试残留。 |

### TASK-chat1-006 修订映射

chat1 · 2026-11-25T11:06:19-06:00。以下替代上方审查缺口中与开发期数据保护相关的预期，依据 FR-chat1-003 v3。局部验证见 [DEV-chat1-016](DEV_LOG.md#dev-chat1-016)。

- TC-chat1-004：`tests/backend/test_storage.py::test_v1_reopens_with_schema_only_in_committed_wal` 验证无临时数据库副本时读取已提交 WAL 并重启。 `tests/integration/test_storage_init.py::test_development_database_is_rejected` 检查不兼容版本提示，不再要求旧数据库或附属文件字节保持原样。
- TC-chat1-005/006：`tests/integration/test_photography_library.py` 验证素材无效字段拒绝、项目和节点并发冲突、视频编辑及注销冲突、主帧注销和子帧组陈旧版本冲突；`tests/integration/test_library_mcp.py` 验证并发修改时 MCP 报冲突并可在回读后重试。
- TC-chat1-007：`tests/packaging/test_api_inventory.py` 比较 Schema 时忽略枚举值顺序，仍校验枚举集合及其他字段。检查 `git check-ignore` 与 `git status`，清理本轮和 TASK-chat1-005 的测试目录。
