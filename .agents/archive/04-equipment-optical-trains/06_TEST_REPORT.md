# 设备、设备组合、素材与 MCP · 测试报告

以下是合并前各专题的运行记录。保留其原基线、命令、通过项和限制。合并后的联合验收尚未执行。

<a id="04-equipment"></a>

## 设备与设备组合


### 本轮执行

2026-11-21 为历史文档补建。该历史补档批次业务测试 `NOT_RUN`。当前 API 清理专项结果如下。

### API 清理专项（2026-11-21）

**复核 run `equipment-api-2026-11-21-rerun`**。Windows，Python 3.12.16，HEAD `4c0cf4d`，含工作树设备 API 测试改动。执行 `uv run --frozen --no-sync pytest tests/integration/test_equipment_api.py tests/backend/test_equipment.py -q`，退出码 0，20 项通过，耗时 10.51 秒。测试脚本 SHA-256 分别为 `C9EA5A3D8CE886F5DE5F1625D4C3D2C4E050DACA789C24642C3A3E013D0EEFB3` 和 `FF00BA34B856B31D0307498BE805E219ABCB6AD5A2F652E3C62A62B460CF1C1A`。包括官网目录创建、读取和 API 清理及异常后的空库检查。该批次不证明尚未实现的同名拦截与归档设备新增引用拦截。

基线为 HEAD `4c0cf4d` 加当前工作树的测试脚本改动。后端脚本 SHA-256 为 `C9EA5A3D8CE886F5DE5F1625D4C3D2C4E050DACA789C24642C3A3E013D0EEFB3`，宿主脚本 SHA-256 为 `DBFC938515F2332F94678F30AE4E31FA72E11B605212CCB30315BCA0B96870BD`。

- `.venv/Scripts/python.exe -m pytest tests/integration/test_equipment_api.py tests/backend/test_equipment.py -q` 退出 0，20 项通过。50 条官网设备、16 套组合经 HTTP 创建、读回，随后先删组合再删设备并读回 404。故障用例在创建组合、归档相机后抛错，随后通过新 HTTP 客户端确认两集合为空。
- Windows 隔离 ComfyUI 0.46.0 与 Playwright Chromium 运行 `node frontend/tests/host/equipment-host.mjs`、加 `--prepare-restart`、重启同根后加 `--verify-restart --verify-delete`。三个 Node 脚本均通过。普通用例与重启最终阶段分别输出 `PASS API cleanup: equipment and optical trains from this run are gone`。宿主结束后的外层 Windows 临时目录清理遇到锁住的 host.log，外层退出 1。检查该目录只剩日志，无测试数据库。
- Python Ruff 和 Node 语法检查通过。本次结果覆盖 CASE-01、CASE-02、CASE-03、CASE-05 的相关创建、读回、删除及重启路径，未执行完整矩阵。

### 历史运行证据

**HIST-01**。2026-11-18 早期方案用 `pnpm -C frontend test:equipment-host` 与 `--verify-restart` 完成真实宿主验证，17 项 SQLite/aiohttp 专项为当时结果。单配置时代的证据另见 Core：真实宿主删除、故障引发事务回滚及重试。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [equipment.md](../../../docs/equipment.md) · [equipment-optical-train.md](../../../.agents/archive/equipment-optical-train.md) · [equipment-review-tests.md](../../../.agents/archive/equipment-review-tests.md) · [04-equipment-delete.md](../../../.agents/notes/04-equipment-delete.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 早期四类 DTO 与后端专项证据 | NOT_RUN |
| CASE-02 | 当前规则有专项证据；历史发布交互另计 | NOT_RUN |
| CASE-03 | 单配置时代有删除与回滚证据 | NOT_RUN |

### 待复验

复验当前单配置、旧快照兼容及删除冲突，分别记录后端测试和目标宿主交互。

[测试计划](05_TEST_PLAN.md#04-equipment) · [Close 草案](Close.md#04-equipment)

<a id="05-mcp"></a>

## MCP 诊断与设备只读查询


### 本轮执行

**RUN-2026-11-21-FASTMCP**。HEAD `f84442b`，Windows、Python 3.12.16、FastMCP 4.2.0。执行 `uv run --project mcp --frozen --no-sync pytest mcp/tests -q -ra`，67 项通过，11.97 秒。覆盖现有配置、进程内工具与 HTTP 替身、设备工具枚举、CLI/stdio 和原始 JSON-RPC stdout 断言。 [设备测试](../../../mcp/tests/test_equipment.py) · [协议测试](../../../mcp/tests/test_server.py)

同基线用 `uv run --project mcp --frozen --no-sync python -` 运行一次性检查。标准库 HTTP 替身监听随机回环端口，FastMCP `StdioTransport` 拉起真实 `python -m astrophoto_mcp` 子进程。脚本验证 initialize、八个工具枚举、诊断结果、带一次性凭据的设备 GET 成功与缺记录 404 工具错误，并核对两次诊断 GET 无授权头。通过。检查结束关闭 MCP 子进程和 HTTP 替身。该次检查仅覆盖模拟后端，真实宿主权限、六工具完整调用、轮换及独立安装仍待验。

### 历史运行记录

2026-11-21 历史补档时，独立业务测试记为 `NOT_RUN`。以下为当时归档的记录。

v0.4 文档对账未新增业务运行。独立前端迁移报告记载 67 项 MCP pytest 通过，其范围包括替身、进程内和 stdio 验证。该证据不覆盖当前隔离宿主六个真实 GET、写入矩阵、双客户端轮换/撤销或从同一轮构建的 wheel 完成真实设备读取。 [迁移验证批次](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

### 历史运行证据

**HIST-01**。历史独立 FastMCP 客户端使用真实 stdio 调用六个查询工具；正确凭据成功、错误凭据工具报错、正确只读凭据 POST 403。交接记录 2026-11-21 既有 MCP 套件 67 通过，含 HTTPX 模拟、进程内客户端与真实 stdio，真实授权宿主当日未复验。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [mcp.md](../../../docs/mcp.md) · [publishing.md](../../../docs/publishing.md) · [fastmcp-42.md](../../../.agents/archive/fastmcp-42.md) · [equipment.md](../../../docs/equipment.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史真实 stdio 与诊断 HTTP 证据 | NOT_RUN |
| CASE-02 | 历史真实授权链路与错误证据 | NOT_RUN |
| CASE-03 | 历史本地打包和安装有证据；公开版待验 | NOT_RUN |

### 待复验

设备 API 稳定后执行 CASE-02B/D/E，分别记录六个真实 GET、写入拒绝前后的数据对照、两次宿主重启的失效时点与 API 清理。CASE-03B 单独记录本地 wheel 及安装握手，CASE-03C 记录公开渠道结果。 [测试计划](05_TEST_PLAN.md#05-mcp)

[测试计划](05_TEST_PLAN.md#05-mcp) · [Close 草案](Close.md#05-mcp)

<a id="06-assets"></a>

## 素材导入与资产登记


### 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

### v0.4 文档对账

本次未新增业务运行。CASE-06、CASE-07 为基于现行代码补充的对账场景。CASE-08 的 API 删除步骤因资产删除接口缺失而 BLOCKED，其余步骤需在独立测试根执行。历史 React 界面结果不代表当前 Vue Assets 已恢复。 [测试计划](05_TEST_PLAN.md#06-assets)

### 历史运行证据

**HIST-01**。本地存储交付记录覆盖多目录引用、C:/D: 真实卷、copy/retry 和刷新；真实浏览器导入及持久回执纳入 4 组 `test:storage-host`。ENOSPC 和源变更是受控故障注入。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [local-storage.md](../../../docs/local-storage.md) · [architecture.md](../../../docs/architecture.md) · [capabilities.md](../../../.agents/handoff/core/capabilities.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史自动化与浏览器预检证据 | NOT_RUN |
| CASE-02 | 历史真实文件和受控恢复证据 | NOT_RUN |
| CASE-03 | 历史位置和重启证据，迁移 UI 待核 | NOT_RUN |

### 待复验

在历史基线复验导入重入与离线重绑，迁移版本单列后端可用性和界面范围。

[测试计划](05_TEST_PLAN.md#06-assets) · [Close 草案](Close.md#06-assets)


## 2026-11-21 · 摄影素材库 v0.7 当前批次

基线 `main@f84442be5f16dd36f6cfff85a686ce30027dd383` 加本轮真实工作树，含并行的 Workspace／Nodes 改动。运行使用隔离数据库、测试目录、合成数据与两套回环 ComfyUI 实例。Python 开发工作区与 ComfyUI 宿主使用各自环境。真实宿主 ComfyUI 0.46.0、Frontend 1.59.6、Python 3.12.16 CPU 和 Siril 1.4.5。FastMCP 锁定 4.2.0。

| 用例 | 执行与证据 | 结论 |
| --- | --- | --- |
| LIB-01～04 | `uv run --no-sync pytest tests/integration/test_photography_library.py tests/integration/test_library_mcp.py -q`。真实 aiohttp/SQLite；测试替换宿主。 | 最新专项包含 Reference 独立资产身份、Copy 字节与预检失效、迁移旧 schema、虚拟树条件拒绝、Flat 资格及审批不能自批。 |
| L-MCP-01～05 | `uv run --project mcp --no-sync pytest mcp/tests -q`。官方 Client(server) auto／legacy，真实 StdioTransport 子进程，关键契约保护。 | 92 passed。MCP 单包替换下游 HTTP 的协议测试和 FastMCP → aiohttp → SQLite 的应用集成分别记录。 |
| NODE-A1/A2、OUTPUT-A1/A2 | 设置 `ASTROPHOTO_SIRIL_TEST_CLI` 为官方 Siril 1.4.5；`uv run --frozen pytest -q tests/nodes/test_registration.py tests/backend/test_siril.py tests/integration/test_siril_api.py`。 | 23 passed。包含有序 Collection、旧／新回执、主动收录、整根和部分迁移。 |
| 真实 Asset UI | `node frontend/tests/host/assets-host.mjs`，`COMFYUI_TEST_URL=http://127.0.0.1:18468`；另指定同隔离主机的测试根和 FITS。 | PASS。Reference 预检、原片不变、跨 Tab 真实鼠标拖拽到 Projects、实际浏览器 Copy 和字节相等、恢复 Storage 配置。 |
| 真实 Siril UI 与节点 | `pnpm -C frontend test:siril-host` 和 `pnpm -C frontend test:siril-host --nodes-2`；独立原生 prompt/history 执行 Asset Source 和反序 Collection。 | PASS。经典和 Nodes 2.0 的真实队列与 Inspector 主动收录，未收录前不可从素材库枚举；单 Asset 和有序双成员链路输入 SHA-256 不变。正式临时目录出现 Windows 文件占用，复用有限重试后真实节点链路复测通过。 |
| Vue 回归 | `pnpm -C frontend test`（Vite + Vitest Chromium）。 | 14 files / 72 passed。最初旧 Assets 占位、翻译字典索引及并行 Storage fixture 导致的失败均有当前复测。 |
| 构件与代理 | `pnpm -C frontend check:build`、`pnpm -C frontend check:proxy`。 | 通过。一个 Vue JS/CSS 构件；Chromium 使用带代理前缀的资源路径。 |

原始记录在本机 `.artifact/assets-scientific-130841/` 和 `.artifact/assets-scientific-retest/`。入口包括 `pytest-scientific.log`、`siril-classic/run.json`、`siril-nodes2/run.json`、`native-source-execution.json`、`assets-host.log`、`frontend-test.log`。日志中的测试文件和工作区均为隔离验证数据。

额外验收已通过 2.5 GiB 流式上传和独立 SHA-256 比对，以及 1,701 项预检清单。真实浏览器选取超大目录的完整上传压力、原生桌面 Reference 绝对路径桥接、200% 缩放及完整辅助技术矩阵仍缺证。实际发布与外部目标平台仍待单独验收。原合并前的结果依旧保留其历史版本。


### 当前补测及环境限制

- LIB-03B 和 LIB-05 已验证批量校准的未确认整批回滚、重复用途失败、确认后同事务保存，以及从部分失败终态只重复未完成条目。MCP 与库 HTTP 专项及打包 `uv run --no-sync pytest tests/packaging tests/integration/test_photography_library.py tests/integration/test_library_mcp.py -q --tb=short` 为 **16 passed**。
- 大文件采用同一真实 loopback HTTP、临时 SQLite 与 Workspace，传输 2,684,354,560 字节。上传 8.77 秒，提交后的复制阶段约 5 秒，落盘和原始合成文件 SHA-256 一致。数字仅为本机采样。证据 `.artifact/assets-scientific-retest/large-copy.json`。浏览器真实上传另用小样本验证。
- 已请求真实隔离 ComfyUI 的额外 MCP stdio＋浏览器审批。自动命令审查拒绝了携带临时测试令牌启动隔离宿主的命令，结论为未执行。FastMCP 真实 stdio 使用回环 HTTP 替身，跨端客户端使用真实 aiohttp／SQLite，分别通过。
- 打包回归顺应同时进行的 Siril 工作，保留必需运行模块和单 Bundle 边界断言，允许新增直接运行模块，明确拒绝开发目录及同级测试源码。旧门槛因新增 Siril 命令模块出现失败，修正清单判定后专项通过。


### 共享工作树最后回归

`uv run --no-sync pytest tests/backend tests/integration tests/nodes tests/packaging -m 'not host' -q --tb=short` **107 passed, 4 skipped, 1 deselected**。日志 `.artifact/assets-scientific-retest/backend-regression-final.log`。适配并行的 Siril 命令扩展后，节点测试使用稳定 node_id 定位并检查重复注册，直接使用的源码依然是当前工作树。构件、代理路径、Ruff、Git diff 检查及交接专项结构校验通过。选定当前源文件的 SHA-256 记录在 `.artifact/assets-scientific-retest/feature-source-sha256.json`。


`pnpm -C frontend test` 的中间批次为 **14 files / 73 passed**。后续并行编辑曾造成重复 async 修饰符，已合并同一测试夹具。最终 `pnpm -C frontend exec vitest run` 为 **14 files / 74 passed**。共享 Siril 前端改用服务端命令描述后，测试更新为加载实际描述结构并等待异步挂载，保留参数边界、宿主只读、取消和旧回执断言。最终日志 `.artifact/assets-scientific-retest/frontend-regression-verified.log`。表格的 72 项对应此前素材库验收批次。

### 2026-11-21 素材界面风格适配

基线 `f84442be5f16dd36f6cfff85a686ce30027dd383` 加共享未提交工作树。Chromium：`pnpm -C frontend exec vitest run tests/components/AssetsLibrary.test.ts` 9 passed，含设置弹层排序请求、Escape 和焦点恢复，既有窄侧栏和导航用例通过。`pnpm -C frontend typecheck`、`lint`、`build`、`check:build`、`check:proxy` 均通过。另在隔离 ComfyUI 0.46.0 / Frontend 1.59.6 宿主截图观察空素材、设置弹层及排序下拉；该实例数据为空，未以本次截图验证有素材列表、表单或完整无障碍矩阵。以上不替代旧批次的全量回归与原有 PARTIAL 缺口。

### 2026-11-21 动态筛选实测

基线 `f84442be5f16dd36f6cfff85a686ce30027dd383` 加共享未提交工作树。`pnpm -C frontend exec vitest run tests/components/AssetsLibrary.test.ts` **12 passed**，包括跨页值、无数据、请求失败重试、筛选请求及清除时保留搜索；`typecheck`、`lint`、`build`、`check:build`、`check:proxy` 通过。隔离真实 ComfyUI 宿主中观察搜索旁筛选按钮与空库提示；真实非空库和大库分页读取性能未在本次宿主验证。
