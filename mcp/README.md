# astrophoto-mcp

AstroPhoto 的独立 FastMCP 服务，使用 stdio 与 Agent 客户端通信，通过公开 HTTP API 访问同一台机器上的 ComfyUI 与 AstroPhoto 扩展。Python >=3.11；不会自动启动 ComfyUI。

```powershell
uv sync
uv run astrophoto-mcp --version
uv run astrophoto-mcp
# 需要时指定地址：
uv run astrophoto-mcp --comfy-url http://127.0.0.1:8000
```

未指定地址时先核对 Desktop 端口锁 PID 和监听端口。通过扩展状态接口确认设备和素材能力，没有可用 Desktop 候选时再尝试本机 8000、8188。多个实例需使用 `connection_select` 选择；`connection_status` 显示候选。`--comfy-url` 优先于 `COMFYUI_URL`，显式地址不会自动切换。自动模式固定每个调用的目标地址与存储实例 ID，由扩展在执行业务操作前校验。导入任务的来源保存在本地 SQLite，重启后按 AstroPhoto 存储实例 ID 恢复查询。Desktop 端口锁跨平台实机行为尚未验证。

工具按类别逐步发现：`tools/list` 返回 `list_tool_categories`、`list_category_tools`、`call_tool`。通过类别获取业务工具 Schema，再用 `call_tool` 传入工具名和参数；已知业务工具名称仍可直接调用。类别发现不是权限控制，客户端是否使用英文 server instructions 取决于客户端。

本机单用户、直接回环且未开启 CORS 的宿主上，设备、素材和项目工具不要求业务 token 或聊天审批。注销素材保留文件并移除其项目引用与校准绑定；项目删除保留素材和磁盘文件。Storage 受管文件删除与素材注销是不同操作。

`astrophoto-management` 随 MCP 包交付。支持资源读取的客户端可从 `skill://astrophoto-management/SKILL.md` 读取。需要磁盘上的 Skill 时，请指定客户端的 skills 父目录：

```powershell
astrophoto-mcp --install-skill C:/path/to/agent/skills
```

命令会在目标目录下创建 `astrophoto-management/SKILL.md`，已有同名目录时报错。Agent 执行 Skill 中的操作时仍需连接 AstroPhoto MCP。

完整接口及验证边界见[仓库 MCP 文档](../docs/integrations/mcp.md)。隔离回归可使用 `uv run --project mcp pytest mcp/tests -k 'not stdio'`；真实 stdio 与真实宿主须单独验证。
