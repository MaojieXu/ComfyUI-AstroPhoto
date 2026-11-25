# MCP 初始化开发日志

开发基线为已批准的 [PRD v0.3](01_PRD.md) 和 [TECH v0.1](03_TECH.md)。本轮在 HEAD `f84442b` 上已有改动的工作树中开发。

| 任务 | 范围 | 验证入口 |
| --- | --- | --- |
| DEV-01 | 身份核对、锁、允许补齐的清单及复核 | 存储单测，TC-01、02、04 至 07 |
| DEV-02 | 本机存储路由、权限和 JSON 空对象契约 | aiohttp 集成，TC-05、08 |
| DEV-03 | MCP 工具注册、直连 HTTP、错误和回执校验 | FastMCP auto / legacy / stdio，TC-03、08、09 |
| DEV-04 | stdio 到宿主回执及磁盘证据、安装说明、测试计划 | [测试计划](05_TEST_PLAN.md)，TC-01 至 09 |

## 本轮交付

本节及下方“验证与交接”记录首次提交独立审查时的开发状态。审查后的修改与待决事项见文末 LOG-001。

- DEV-01 在当前存储实例上核对持久配置、SQLite、默认工作区、持久缓存标记及运行目录。检查身份、在途操作及工作区登记，获取工作区 lease 和 bootstrap 锁，在允许范围内独占创建并复核。保存设置和原始身份；已登记的根不允许因 manifest 回退为未完成而重新首建。离线搬迁同时保存外置工作区的位置证据，并记录新位置的内部目录身份。
- DEV-02 在既有存储路由注册 `POST /astrophoto/v1/storage/init`。请求先经过现有受信本机边界，再验证空 JSON 对象，经工作线程访问有效根。非法请求不会补建缺项。
- DEV-03 在本地 MCP 工厂注册无参 `init`。HTTPX 固定直连回环写端点，区分连接、超时、缺少扩展和版本不支持等情况；回执验证包括规范请求 ID、五组检查、绝对根路径和本次补齐项。更新独立安装探针及默认工具集合的协议回归。
- DEV-04 已同步双端说明、MCP 契约及测试计划。完整链路在临时用户目录、独立安装的 MCP wheel 和真实 ComfyUI CPU 宿主之间验证。项目可复跑的 stdio + aiohttp + SQLite 测试位于 `tests/integration/test_storage_init.py`。

## 验证与交接

| 开发级核对 | 结果及边界 |
| --- | --- |
| 存储、重启、搬迁及保护性回归 | `tests/backend/test_storage_init.py tests/backend/test_storage.py tests/backend/test_storage_review.py` 合计 59 通过、2 项跨卷条件跳过。初次全套发现搬迁故障注入的替身未转发 `replace=False`，修正替身后原有故障断言通过。 |
| MCP | `uv run --no-sync --project mcp python -m pytest mcp/tests` 全部 119 项通过，其中 27 项覆盖新工具。 |
| HTTP/stdio 专项 | `tests/integration/test_storage_init.py` 与 `test_storage_init_validates_request_before_writing` 合计 4 项通过，含损坏、缺失及恢复后的真实 stdio 调用。 |
| 打包与静态检查 | `tests/packaging` 全部 10 项通过。独立 wheel 安装、stdio 握手、工具发现及版本调用通过。全仓 Ruff、`uv lock --check` 通过。 |
| 扩展整体回归 | 在开发中的工作树重跑后端、节点与非宿主集成，129 通过、5 跳过、2 项未选。未选项为带 host 标记的测试与设备目录用例 `test_official_catalog_create_read_and_delete`；后者在首次整套运行时失败，因为它读取的设备 PRD 已从活动 Feature 目录归档。该设备用例保持原样。存储最终增补用例的结果见上方存储专项。 |

宿主开发验证在 Windows 回环单用户环境运行 ComfyUI v0.46.0 CPU，通过独立 venv 安装本地生成的 wheel。扩展和 MCP 分别使用隔离用户目录，宿主以默认的 `~/.astrophoto/` 首建。首次就绪后移去测试根中的空迁移目录，下一次回执仅列出 `runtime/migrations/`，再次调用得到空清单。实例身份、非默认设置和用户样本得到保留。

最终构件也实测了在线和冷启动丢失 manifest、损坏 settings、恢复后重启，以及扩展未加载和宿主未启动。十条观测保存在[真实宿主开发回执](assets/dev/host-init.json)，其中四条成功回执的临时用户目录已匿名化，保留了检查结果、补齐清单和原请求 ID。

已验证构件的 SHA-256 为 Registry ZIP `0bd7151e0df5c3b39f10dff77a86c0b64332ead10c88b31e587da3647b19285f` 和 MCP wheel `8a7cf6809790dc2782cfeb36c41948255fea089dbe4409e86903aa439d794194`。比对构件内的 Python 文件与最终工作树，Registry 62 份、wheel 14 份内容一致。DEV 交付状态为 ready_for_review，独立代码审查及正式 TEST_REPORT 待执行。

## LOG-001 · 2026-11-22 · REVIEW-001 发现处理

独立审查在 HEAD `f84442b` 的指定工作树快照上完成，报告记载六项非阻断发现。其覆盖范围截至该快照。下表记录审查后对 DEV-01 至 DEV-04 的局部修改和自检。[审查报告](assets/reviews/REVIEW-001_report.txt) · [审查版本](assets/reviews/REVIEW-001_code_state.md)

| 发现 | 处理与证据 |
| --- | --- |
| F-01 · 已修复 | MCP 的 `init` 对工作区离线、已登记文件缺失、工作区停用、只读和目标非空分别给出下一步。错误码及请求 ID 继续保留。 |
| F-02 · 现行契约已核实，恢复方案待决 | 冷启动旧根若缺少位置记录、会话内可信记录和可佐证的登记文件，GET 快照可显示 `ready`，而 `init` 返回 `RECOVERY_REQUIRED`，保留位置记录及迁移目录的缺失现场。已加强后端断言并同步使用说明。现行 TECH §3 仍要求独立位置证据。用户正在讨论由 Agent Harness 辅助恢复的方向，方案和授权边界待确认。 |
| F-03 · 已修复 | 宿主启动失败时为已知的清单和设置异常保留可公开的原因，初始化路由随稳定错误码返回诊断。stdio 用例分别断言清单缺失和设置损坏的回执。 |
| F-04 · 已同步 | 存储与 MCP 文档登记了初始化路由、请求与回执、账号级协调目录和旧根证据不足时的行为；Handoff Core 及后端模块快照同步了受影响的职责。[本地存储](../../../../docs/local-storage.md) · [MCP](../../../../docs/mcp.md) |
| F-05 · 已补覆盖 | 持有真实工作区租约时，`ensure_layout` 返回 `STORAGE_BUSY` 并保留目录缺项，释放后可补齐。存在排队中的迁移时，重启会将缺项保留至任务恢复阶段。 |
| F-06 · 已修复 | 修复前已复现锁目录被替换后仍补建、启动期迁移目录恢复后触发 `KeyError`。现于取得工作区租约及 bootstrap 锁后再次核对锁目录身份；启动期按最终缺项决定是否建目录。 |

MCP 错误回执定向自检 9 项通过，宿主启动错误与路由定向自检 3 项通过。存储定向自检 7 项通过、17 项未选，覆盖旧根位置证据、持锁时的写入边界、在途迁移和目录竞态；存储运行时及其测试文件的 Ruff 检查通过。[MCP 用例](../../../../mcp/tests/test_init.py) · [启动错误用例](../../../../tests/integration/test_storage_init.py) · [存储用例](../../../../tests/backend/test_storage_init.py)

上述修复后差异取得的是 DEV 自检证据。首次构件指纹与开发期宿主回执仅对应原交付版本。正式回归及真实宿主验收仍待 TEST_REPORT 建立 RUN。F-02 的恢复方案决定后，由 Main Agent 核对决策影响及交付代码状态，更新门禁记录。

## LOG-002 · 2026-11-22 · ComfyUI 启动初始化

当前开发基线为已确认的 [PRD v0.11](01_PRD.md) 和 [TECH v0.8](03_TECH.md)。以上记录对应此前的 MCP 初始化方案。此次启动实现及局部自检已完成，待独立代码审查及正式验证。

| 任务 | 对应需求 | 实现和局部核对 |
| --- | --- | --- |
| DEV-005 | FR-01 至 FR-03 | 沿用 V3 `on_load` 和原首建 JSON 写入器。`DataRoots.open()` 持实例锁验证已有配置，调用 `ensure_top_level_directories()` 预检并创建缺项，复查目标结构后打开宿主锁和业务存储工厂。临时根自检通过，核对首建 ID、同次补齐三个目录和保留配置。 |
| DEV-006 | FR-04 | 已登记根遗漏配置时，启动日志列出缺失的 JSON；方向明确的 `StorageError` 详情随启动异常记录。临时根自检通过，缺少整个 `config/` 时日志指出两份 JSON，配置及待补目录保持缺失。 |

业务工厂在自检中照常报告 `Asset database missing or unsafe`。此时四个顶层目录和两份有效 JSON 齐全。目录补齐不创建替代数据库。正式用例仍须覆盖单项和多项缺失、重复启动、路径冲突、写入受阻及重试、无效或单项缺失的 JSON，以及独立 ComfyUI 安装与首次加载。

`uv run --no-sync` 下的临时目录接线探针调用 `initialize_storage_runtime(coordinate=True)` 和真实 `StorageRuntime`，仅替换协调目录以隔离账号数据。修改的三个 Python 模块和现有 V3 用例文件通过 Ruff。V3 用例内断言的数据库路径修正为 `database/assets.db`。该用例、正式回归和真实宿主验收本轮未运行。

权威说明已同步至 [本地存储](../../../../docs/local-storage.md) 和 [架构](../../../../docs/architecture.md)，对应的 [Core 后端概览](../../../handoff/core/backend-overview.md) 和 [后端启动源码索引](../../../handoff/module/backend/source-index-runtime.md) 已更新。当前无已知 DEV 阻断。

### 代码状态

基于未提交工作树，HEAD 为 `f84442be5f16dd36f6cfff85a686ce30027dd383`。以下 Git blob ID 识别本轮交付所涉及的代码文件，包含进入本轮前的工作树改动。未提交或暂存文件。

| 路径 | Git blob ID |
| --- | --- |
| `astrophoto/bootstrap.py` | `ec2cb2cb27110031318c8c6183dcff42f771f256` |
| `astrophoto/storage/data_root.py` | `021004d31596af636d3bd9186fa053e125d3d63d` |
| `astrophoto/storage/initializer.py` | `ae4d73f9b32f8044cccb5909a2835c4f5757c181` |
| `tests/integration/test_status_api.py` | `f1bca22167ee0b636642f716ad6e8f89d1eac6f8` |

## LOG-003 · 2026-11-22 · REVIEW-002 R-03

用户确认处理 R-03 的诊断边界。`_ensure_directories()` 捕获 `FileExistsError` 后复核目标。如果目标已消失，抛出 `StorageError`，保留现有 `STORAGE_INITIALIZATION_FAILED` 启动错误码、原始异常链，并在启动日志中提供消失原因和目标路径。另一进程留下有效目录或留下路径冲突对象时，沿用已有处理。

局部临时目录探针注入 `mkdir()` 的 `FileExistsError`，保持目标实际缺失。已核对错误码、原因、目标绝对路径、原始异常链和其余缺项未创建。`initializer.py` 的 Ruff 与跟踪文件差异检查通过。正式回归与真实宿主验收未运行。

HEAD 仍为 `f84442be5f16dd36f6cfff85a686ce30027dd383`。`astrophoto/storage/initializer.py` 的当前 Git blob 为 `b82f99ed6ab67a01550c33f2434e044799fe08a0`，对应 REVIEW-002 后的 R-03 增量。

## LOG-004 · 2026-11-22 · REVIEW-002 R-01、R-02

依据 [PRD v0.12](01_PRD.md) 和 [TECH v0.9](03_TECH.md)，启动、HTTP 预检及离线 CLI 用初始配置根 `config/roots.json` 协调有效根。根内登记锁和实例锁独立于 `runtime/`。首建先独占保存清单种子，再进入现有业务首建流程，重试沿用同一身份。可辨识的未登记旧根、配置缺失和损坏均报错并保留现场。旧外部目录不参与运行。现行架构、存储、MCP 说明与受影响的交接快照已同步。

整库搬迁在目标发布前持久化定位记录，沿用原子登记切换和首次业务写入前的回滚边界。启动从初始入口或移动后的入口定位同一登记，读取失败时保留副本并报告原因。初始配置根必须可访问。通过目标路径执行回滚需要能读取其定位记录。范围内没有删除旧实例、协调记录或移动快照。

为 R-02 新增 Runtime 单缺、三目录同时缺失和普通文件冲突三个后端参数场景，并对现有离线移动测试改用根内登记。开发局部自检在 `.artifact/mcp-storage-init/dd78b` 下通过 4 项，包含三个 R-02 场景和既有的离线切换、回滚中断恢复用例。第一次尝试的长隔离路径在搬迁前的 Windows 资产导入阶段出现路径错误。缩短同一隔离范围内的运行路径后通过。修改的 Python 文件 Ruff 通过，跟踪文件的差异检查通过。正式回归和真实宿主验收未运行。

PowerShell 隔离测试目录清理命令被执行策略拒绝，成功探针目录 `dfd4d`、`dd78b` 与首次失败留存目录均保留在 `.artifact/mcp-storage-init/`。真实用户目录与运行进程未改动。

本轮沿用 HEAD `f84442be5f16dd36f6cfff85a686ce30027dd383`。当前工作树代码标识如下。

| 路径 | Git blob ID |
| --- | --- |
| `astrophoto/storage/data_root.py` | `4e88a37e4c96cc74b3f6e0c3a4c2e34d0ad1cb10` |
| `astrophoto/storage/initializer.py` | `2b0f999e238074331bf0f9a011780d725f4aa5c6` |
| `astrophoto/bootstrap.py` | `8036783d71385320bc0132946a42723ac43c34dc` |
| `astrophoto/api/storage.py` | `8b5aef4a8d2d08646a04b0e7366239048222c78b` |
| `tests/backend/test_storage.py` | `8e4558170c1dc6cf9d72f81e927b52756faa5e99` |
| `tests/backend/test_storage_review.py` | `35cb05fc636c1c052e354438f51a65e9b72c8b48` |
| `tests/backend/test_storage_init.py` | `a37003211738eda5ed74d98404be53d88ad5c57a` |
