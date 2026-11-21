# MCP 诊断与设备只读查询 · 开发规格与实现

**版本** v0.4 · 2026-11-21 · 当前源码披露

Git 参考为 `main@4c0cf4d`，当前宿主 bootstrap、route 装配和发布脚本含未提交修改。下表以磁盘代码为准。

| 切片 | 当前路径和符号 | 执行、拒绝、副作用顺序 | 追溯 |
| --- | --- | --- | --- |
| S1 启动 | [CLI](../../../mcp/src/astrophoto_mcp/__main__.py) `main`；[配置](../../../mcp/src/astrophoto_mcp/config.py) `resolve_comfy_url` | CLI 参数覆盖 COMFYUI_URL，未设才用默认。去首尾空白，拒绝内嵌空白、反斜线、查询、片段、凭证、非法 scheme/host/port。正规化为以 / 结尾并保留前缀。无效配置在创建服务器前返回 argparse 错误。--version 直接输出安装版本并退出。 | FR-04 / CASE-01A |
| S1 枚举 | [FastMCP factory](../../../mcp/src/astrophoto_mcp/server.py) `create_server`；[诊断工具](../../../mcp/src/astrophoto_mcp/tools/status.py) `register_status` | 创建 FastMCP 并拒绝重名注册。先登记两个默认工具，再按 token 与 direct_url 添加设备只读工具。只有安装包内存在 Skill 时加载 provider，非法包内 Skill 可阻断启动。CLI 启动 stdio 且关闭 banner。 | FR-01、FR-02、FR-04 / CASE-01A、02A |
| S2 诊断 | [HTTP 客户端](../../../mcp/src/astrophoto_mcp/client.py) `diagnose`；[公共端点](../../../mcp/src/astrophoto_mcp/api/comfy.py) `fetch_status` | 创建异步 HTTPX 客户端，先 stats 后节点信息，各自 HTTP 检查后解析 JSON；校验两个顶层对象及 system 形态，结束关闭连接。节点键缺失只令 extension_registered=false。 | FR-01、FR-04 / CASE-01B |
| S3 工具与 DTO | [六个工具](../../../mcp/src/astrophoto_mcp/tools/equipment.py) `register_equipment_tools`；[适配器](../../../mcp/src/astrophoto_mcp/api/equipment.py) `credential/direct_url/canonical_id/list_params/valid_record/EquipmentHTTP.get` | 注册前 token 需 43–256 个 ASCII 字母数字或 -/_，URL 为 loopback IP 根路径。工具执行先校验 UUID 和分页值，query 最长 120、limit 1–100，默认 page 50。请求只 GET，携带 Bearer。校验状态及 JSON，再检查 equipment/train/revision DTO，分页检查返回游标；失败报告 ToolError 并关闭连接。 | FR-02、FR-05 / CASE-02A/B/C |
| S3 服务端授权 | [初始化](../../../astrophoto/bootstrap.py) `host_runtime`；[安全](../../../astrophoto/api/security.py) `trusted_deployment/direct_local_request/authorize_equipment_request/equipment_read_token`；[路由](../../../astrophoto/api/routes.py) `register_routes` | 宿主初始化时捕获 token，判断部署；设备路由走独立权限分支。远端、转发头、跨站或不合规 Host/Origin 先拒绝。带 Authorization 仅允许无 Origin/Fetch Metadata 的 GET，随后比较 Bearer；拒绝在服务操作前返回 403。浏览器同源分支使用 Fetch Metadata 和本地授权头。 | FR-02、FR-05 / CASE-02D/E |
| S4 发行 | [包元数据](../../../mcp/pyproject.toml)；[release.py](../../../scripts/release.py)；[check_install.py](../../../scripts/check_install.py) `main/probe` | 校验根版本、MCP pin、构件内容。check_install 用 uv 创建隔离环境，从指定 wheel 或公开索引安装；隔离 Python 启动并检查版本、默认工具和 version 调用，临时目录结束时清理。探针不调用真实 connection_status。 | FR-03 / CASE-03A/B/C |
| S5 凭据生命周期 | `server.py:create_server` → `EquipmentHTTP.__init__`；`bootstrap.py:host_runtime` → `api/routes.py:register_routes` → `api/security.py:authorize_equipment_request` | MCP 启动把值捕获到适配器；宿主初始化把值捕获到 runtime，鉴权时读运行态。重复注册同一 AstroPhoto RouteTableDef 复用原 runtime，仅替换节点探针，不能作为轮换入口。新宿主必须用同一测试 Data Root 和新环境重启，之后通过 403/200 区分旧、新客户端。 | FR-05 / CASE-02E |

## 使用错误与实际缺口

- 不合规凭据格式在 MCP 进程的枚举阶段隐藏工具。同形状错凭据只有实际调用时才从宿主得到拒绝。设备适配器仅选取受字符和长度约束的 `error.code`，以及 HTTP 状态。真实宿主以固定业务码返回，客户端 stderr、运行记录与证据仍单独检查脱敏。
- 设备组合工具描述仍含 “editable draft” 和 “default revision” 等旧词。当前 Extension 读取的是当前配置，新保存不创建旧式修订；历史列表/详情保持兼容读取。以实际 DTO 和设备专题为准。工具描述调整属于后续修改，回归应保留旧工具名和参数。
- `optical_train_list` 暴露 query/include_archived/cursor/limit，没有独立的可用性参数。PRD 保留按返回状态判断是否可用，不能写成工具已支持该筛选。
- 宿主单用户可信部署是一条部署边界。当前 token 单值且进程初始化时获取。轮换、权限细分与扩展诊断分别等待 Q-01～03。没有完成热撤销的声明。

[需求](01_PRD.md) · [技术设计](03_TECH.md) · [测试计划](05_TEST_PLAN.md)
