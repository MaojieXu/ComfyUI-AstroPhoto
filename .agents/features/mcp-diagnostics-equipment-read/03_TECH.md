# MCP 诊断与设备只读查询 · 技术设计

**版本** v0.4 · 2026-11-21 · 当前源码契约

## 基线与职责

当前源码为 `main@4c0cf4d` 加未提交工作树。MCP Python ≥3.11，FastMCP 4.2.0、HTTPX ≥0.28 且 <1，包版本 0.0.1。宿主 aiohttp 路由与 SQLite 属于 Extension。宿主和 MCP 不共享数据库或进程内状态。当前 V3 启动调整影响路由和运行态装配；默认诊断通过宿主公共端点保持独立。

| FR | 调用链 | 契约 |
| --- | --- | --- |
| FR-01/04 | 客户端 stdio → CLI → FastMCP → HTTPX | `version` 有 JSON text 与 structuredContent，`connection_status` 只有 JSON text，且无 outputSchema。后者顺序 GET `system_stats` 和 `object_info/vue-basic`；有效对象的节点键决定注册，system 缺失默认空对象。可达成功才返回 reachable=true；HTTP、网络及数据错误由 FastMCP 表达为工具失败。 |
| FR-02 | FastMCP → EquipmentHTTP → `/astrophoto/v1/` 设备路由 | 两种分页列表响应为 `{items, next}`，详情为对象，修订列表为 `{items}`。设备类型和归档、查询条件转为 HTTP query。当前设备组合配置和历史兼容 DTO 分别消费，完整字段含义由设备专题持有；MCP 检查必要结构后传递响应。 |
| FR-05 | MCP 注册门 → 每个 GET 的宿主鉴权 → 设备服务 | 客户端只接受 IP 字面量 loopback 和根路径，注册需 token 格式合规。设备 HTTP禁系统代理、禁跟随重定向。宿主要求显式启用本机存储、监听地址受信、单用户且无 CORS 配置，逐次检查来源和 Bearer，浏览器写权限走独立分支。 |
| FR-03 | 两个构件 → 独立环境安装 → stdio 探针 → 发行 | Registry 只打包 Extension，MCP wheel/sdist 单独。根版本同步并固定依赖 MCP 版本。公开发布顺序沿用现行发行文档。 |

## 错误、异步与配置边界

- 两类 HTTP 调用均使用源码配置的 10 秒 timeout，诊断的两次请求各自受 HTTPX 控制，此值不等同整个工具的总截止时间。设备请求不自动重试、分页不提供跨请求事务快照。并发改库可能让后续页与先前页来自不同数据时点。
- 设备适配器只传播经过字符约束的服务端错误码及 HTTP 状态，缺少有效码时使用 HTTP_ERROR；连接、超时、坏 JSON 和 DTO 分别转工具错误。它不会把响应正文或令牌拼进结果。仍需在独立客户端核对日志和配置失败路径脱敏。
- MCP token 读取于进程装配，宿主 token 读取于 runtime 初始化。重新打开 UI 或重新枚举不会更新它们。宿主相同 RouteTableDef 的 runtime 复用意味着扩展重绑不保证轮换。Q-01 的关键证据是两个隔离客户端及明确的宿主重启。
- 基础诊断可以使用合法 HTTP(S) 和路径前缀，不发送设备令牌。设备查询更严格。若 Q-02 要扩展诊断，先定义版本或能力字段与数据暴露范围。若 Q-03 改作用域，决定应先传播到设备路由和旧客户端兼容测试，再改变工具注册和输入。

## 工具与 Extension 契约

所有设备工具发送 `GET /astrophoto/v1/<path>`。下表是当前适配范围。

| 工具 | 路径 | 当前返回或校验 |
| --- | --- | --- |
| `equipment_list` | `equipment` | 可选类型追加 `type`。与组合列表共用 `q`、`archived`、`after`、`limit`，返回 `items` 和 `next`。 |
| `equipment_get` | `equipment/{equipment_id}` | 设备 DTO，含规格与引用字段。 |
| `optical_train_list` | `optical-trains` | 组合分页及状态摘要。设备 API 支持 `status`，MCP 列表工具当前未暴露该参数。 |
| `optical_train_get` | `optical-trains/{train_id}` | 当前组合详情。旧版兼容字段可保留，当前配置读取以 `configuration` 为准。 |
| `optical_train_revision_list` | `optical-trains/{train_id}/revisions` | 返回 `items`，新组合通常为空。 |
| `optical_train_revision_get` | `optical-trains/{train_id}/revisions/{revision_id}` | 读取归属该组合的旧快照与兼容模板。不存在或归属其他组合返回 404。 |

设备路由的 Bearer 守卫作用于 GET 方法与调用来源。设备 API 另有 `GET /optical-trains/{id}/draft`；合规 Bearer 可直接读取该路由，MCP 当前没有对应独立工具。凭据范围与工具数量应分开描述。同源浏览器授权在该分支外，拒绝的 Bearer 写请求不会转交浏览器分支。 [工具](../../../mcp/src/astrophoto_mcp/tools/equipment.py) · [宿主路由](../../../astrophoto/api/equipment.py) · [授权](../../../astrophoto/api/security.py)

## 切片与关联

先核对配置和默认协议，再核对宿主部署与设备工具的读写权限，最后复验本地构件和真实宿主；公开渠道单独取证。 [实现与拒绝规则](04_DEV.md) · [测试](05_TEST_PLAN.md) · [宿主底座](../comfyui-extension-drawing/00_FEATURE_INDEX.md) · [设备与设备组合](../equipment-optical-trains/00_FEATURE_INDEX.md) · [发行](../../../docs/publishing.md)
