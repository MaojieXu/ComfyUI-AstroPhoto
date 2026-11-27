# MCP 工具设计研究来源

以下 39 篇为 2026-11-27 查阅的独立文档、工程文章或原始研究。此清单用于追溯设计依据，不是逐条必须加载的教程；复用前核查当前来源、协议版本和 SDK 能力。MCP 规范入口当日指向 2026-07-28；下列明确标为 2025-11-25 的页面只证明该版行为。厂商建议不是协议要求，研究结果不是本项目模型实测。

## OpenAI：工具定义、执行与评估

1. [Function calling](https://developers.openai.com/api/docs/guides/function-calling) — 参数描述、函数调用与该 API 的严格模式。
2. [Using tools](https://developers.openai.com/api/docs/guides/tools) — 工具类型和运行环境。
3. [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) — 在支持的环境中按需发现工具。
4. [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) — 程序化组合与输出契约。
5. [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) — MCP 调用及批准机制的厂商实现。
6. [Async tool calling](https://developers.openai.com/api/docs/guides/async-tool-calling) — 异步调用和请求结果关联。
7. [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) — 定义评估目标、数据及评分。
8. [Testing Agent Skills with Evals](https://developers.openai.com/blog/eval-skills) — 以场景和可观察结果评估 Skill。
9. [A Practical Guide to Building AI Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) — 任务、工具、护栏与评估的整体关系。

## Anthropic：任务边界与上下文

10. [Writing effective tools for agents](https://www.anthropic.com/research/writing-tools-for-agents) — 任务边界、命名、有效结果及评估。
11. [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — 基于实际任务设计工具与反馈。
12. [Effective context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) — 上下文压缩与信息选择。
13. [Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) — 跨会话的增量进度与交接。
14. [Advanced tool use](https://www.anthropic.com/research/advanced-tool-use) — 工具搜索、程序化调用和示例。
15. [Code execution with MCP](https://www.anthropic.com/research/code-execution-with-mcp) — 按需发现与过滤数据的成本权衡。
16. [Demystifying evals for AI agents](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) — 任务、轨迹与不同评分方式。
17. [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) — Claude 的工具描述及输入 schema 指南。
18. [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) — 模型调用与客户端执行的边界。

## MCP：协议与能力协商

19. [当前规范入口](https://modelcontextprotocol.io/specification) — 查验当前版本与具体规范。
20. [Tools（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) — 发现、schema、结果与错误。
21. [Pagination（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/pagination) — 协议 opaque cursor。
22. [Progress（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/progress) — 可选进度通知。
23. [Cancellation（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/cancellation) — 取消通知及接收方行为。
24. [Tasks（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks) — 该版本的实验性任务能力。
25. [Security best practices（2025-11-25）](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices) — 授权和服务端威胁边界。
26. [Resources（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/server/resources) — 资源与上下文的协议建模。
27. [Lifecycle（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) — 连接生命周期及能力协商。
28. [Authorization（2025-11-25）](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) — 适用传输方式的授权要求。
29. [Server instructions](https://blog.modelcontextprotocol.io/posts/2025-11-03-using-server-instructions/) — 服务级说明补充工具契约，不能替代安全约束。
30. [Tool annotations](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/) — 注解是风险提示，有信任限制。

## SDK 与其他工具框架

31. [MCP Python SDK：Servers](https://py.sdk.modelcontextprotocol.io/servers/) — SDK 服务端能力入口。
32. [MCP Python SDK：Structured Output](https://py.sdk.modelcontextprotocol.io/v2/servers/structured-output/) — 结构化输出及版本范围。
33. [MCP TypeScript SDK v1](https://ts.sdk.modelcontextprotocol.io/) — SDK 与协议版本覆盖。
34. [FastMCP Tools](https://gofastmcp.com/docs/servers/tools) — AstroPhoto 使用的框架的工具注册和注解。
35. [LangChain Tools](https://docs.langchain.com/oss/python/langchain/tools) — 工具描述和参数定义实践。
36. [Google ADK Function Tools](https://adk.dev/tools-custom/function-tools/) — 函数工具及参数描述。
37. [Semantic Kernel Native Plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/adding-native-plugins) — 参数和返回信息给模型的方式。

## 原始研究：评估适用范围

38. [Berkeley Function Calling Leaderboard](https://proceedings.mlr.press/v267/patil25a.html) — 多任务、多轮工具调用评估。
39. [Lost in Execution](https://arxiv.org/abs/2601.05366) — 多语言工具调用中的参数值语言不匹配。
