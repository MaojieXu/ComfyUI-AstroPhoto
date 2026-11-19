# MCP、CI 与打包

## 独立协议

mcp/src/astrophoto_mcp/server.py:19 的 create_server 使用 FastMCP 4.2.0。默认仅 version 和 connection_status。stdio 至少从真实子进程测试验证握手、工具枚举、调用和 stdout NDJSON 协议。status HTTP /object_info 的兼容、错误响应和敌对 payload 大多由 HTTPX MockTransport 验证，不等于全链路在真实 ComfyUI 上执行。

配置合法 ASTROPHOTO_EQUIPMENT_READ_TOKEN 且设备使用直连回环 URL 时才注册六个只读工具。具体工具名和参数见 [逐 Tool 契约](evidence/subagents/mcp-packaging.md)。配置不合法或非直连时只留下诊断工具。服务端拒绝浏览器 Bearer 和非 GET Token，常量时序比较，非身份标头不能授予 Agent 写权限。默认 status 诊断可以用其他 HTTP URL，设备 adapter 不跟随重定向、不继承环境代理；单独区分验证边界。

产品 Skill 仅从包内 skills 目录加载有效 SKILL.md，工作区开发技能不会随发行提供。延期的 MCP 写操作、工作流执行、Siril 操作、Memory/RAG/实验不计为 Tool。

## 发行边界

- .github/workflows/ci.yml Python 3.11/3.12 双矩阵，冻结 uv/pnpm，编译检查、测试、真实 Playwright（部分为替身宿主）、Registry 和 Wheel/sdist、隔离安装验证。
- scripts/release.py 统一 0.0.1、检查 tag、筛选 Registry 白名单，含 JS、CSS、locales、Python 和 DB baseline；SQL/用户数据、测试、reference、mcp 与构建依赖应排除。MCP wheel/sdist 不携带 Extension。
- pytest packaging 会在临时目录实际生成 Registry ZIP 和 MCP 构件并检查内容，插入异常路径做负面测试。生产 PyPI、Comfy Registry、Github Release 工作流未执行，也没有远程哈希等价证明。
- [证据](evidence/subagents/mcp-packaging.md) 记录分发顺序、安装探针继承 token/URL 时精确工具枚举失败的风险、sync 非事务、路径白名单与内容泄露区别。不要把本地构件结果算作远程发布成功。
