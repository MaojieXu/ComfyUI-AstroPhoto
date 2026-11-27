# MCP 工具参考

在自动或可信本机直连配置下，先调用 `list_tool_categories`，再对所需分类调用 `list_category_tools` 获得工具的运行时输入 Schema，最后以 `call_tool` 传入工具名及 `arguments`。分类发现不是权限控制。连接和目标选择见 [MCP 集成](../../integrations/mcp.md)。

```json
{"name":"library_list","arguments":{"limit":10}}
```

上例是传给 `call_tool` 的参数结构示意，不代表真实数据或实测响应。精确字段与条件可用性以目标服务的实时 `list_category_tools` 为准。

## 工具分类

- [connection](connection.md)：版本、连接状态和目标选择。
- [equipment](equipment.md)：设备。
- [equipment_groups](equipment_groups.md)：设备组合。
- [library](library.md)：素材、导入、子帧和校准。
- [projects](projects.md)：项目、逻辑文件夹及引用。
- [canvas](canvas.md)：节点定义、当前画布和编辑回执。
- [workflow](workflow.md)：原生工作流文件、执行、任务回执和产物。
- [node](node.md)：单节点原图、参数预览和图像对照。

以上 Schema 快照由隔离进程内服务以自动模式提取。当前代码中显式非回环或带代理前缀的地址不注册本机业务工具；`connection_select` 仅自动模式注册。环境和注册条件见 [server.py](../../../mcp/src/astrophoto_mcp/server.py) 与 [target.py](../../../mcp/src/astrophoto_mcp/target.py)。

逐工具返回、调用链、错误和副作用见 [MCP 工具契约](contracts.md)。发现入口和各业务工具的输入与结果核对见 [隔离调用示例](examples.md)。
