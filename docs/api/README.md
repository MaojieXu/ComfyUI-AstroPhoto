# 接口参考

AstroPhoto 的浏览器前端使用宿主提供的 HTTP 接口，外部 Agent 使用独立 MCP 服务。MCP 通过公开 HTTP 接口操作业务数据，不直接访问扩展业务数据库。

- [HTTP 接口](http/README.md)：信任边界、路由清单及业务操作后果。
- [MCP 工具](mcp/README.md)：发现、条件可用性、工具 Schema 和 HTTP 对应关系。
- [素材规则](../domains/assets.md)、[设备规则](../domains/equipment.md)、[存储规则](../domains/storage.md)：业务对象和数据所有权。
- [MCP 安装与连接](../integrations/mcp.md)：进程启动和目标发现。

`inventory.json` 是从当前实际 HTTP 路由注册及隔离进程内 MCP 服务提取的快照，不是 OpenAPI 规范。真实请求、返回字段及兼容性以目标版本的实现、测试和 MCP 运行时 Schema 为准。节点与 Siril 专项暂缓，清单仅标出其当前注册定义。

## 更新与检查

在项目独立 Python 环境、允许本机回环的执行环境中，从仓库根运行：

```powershell
.\.venv\Scripts\python.exe -m scripts.api_inventory --output docs\api\inventory.json
.\.venv\Scripts\python.exe scripts\render_api_reference.py
.\.venv\Scripts\python.exe -m pytest tests/packaging/test_api_inventory.py tests/packaging/test_document_navigation.py -q
```

提取器创建进程内 MCP 服务并读取工具目录，不调用业务工具或连接真实用户数据库。漂移测试核对源码路由定义、不同连接模式的 MCP 输入/输出 Schema 与注解，以及生成页面是否包含条目；请求字段、错误分支及工具业务行为由对应处理器、契约页与隔离集成测试核对。
