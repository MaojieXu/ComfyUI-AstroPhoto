# 补充文件级复核

本页补齐同名模块、兼容层和 helper 的具体引用。下列事实来自当前文件与调用方。现存测试仍以主矩阵的结果和场景为界。

| 文件 | 已复核内容及边界 |
|---|---|
| astrophoto/__init__.py、astrophoto/api/__init__.py、astrophoto/core/__init__.py、astrophoto/siril/__init__.py | 目前都是包文档入口，无初始化或运行副作用。 |
| astrophoto/core/errors.py:4–14 | ConfigurationError 同时继承 ValueError；独立 StorageError 保留 code/details 并提供 message。实际 HTTP 分类由 astrophoto/api/errors.py 控制。上下游错误编码不是这个类的实例类型自动保证。 |
| astrophoto/siril/previews.py:22–215 | stop 来自 Event；每个 owner 启动时标记自己的未完成任务停止，worker finally 移出集合。GET 校验 source fingerprint，formal after 额外验证输出，读取 Cache 通过租约检查。成功 job 排序缓存和 900s 淘汰按后续 start 触发。每次生成或缓存命中均先读并渲染 before，缓存复用只针对 after。线程启动失败清掉 job/worker；shutdown 的 join 未设 deadline，阻塞的文件 I/O 或渲染不会即时响应取消。 |
| frontend/src/types.ts:1–5 | DrawingValue 的 canvasDataURL 是工作流状态字段；执行端仍仅序列化 image。 |
| frontend/src/vendor/comfyui/multi-select/types.ts、frontend/src/vendor/comfyui/select/types.ts、frontend/src/vendor/comfyui/single-select/types.ts | 选项允许 string/number 与 disabled。搜索、清空、选中数量提示通过条件 TypeScript Props 约束可访问名称，运行时仍由组件实现负责。 |
| frontend/ui/src/features/settings/equipment/shared.tsx:7–93 | 宿主 confirm 结束后恢复触发元素焦点。useMutation 用 ref 阻止并发重发，卸载 abort 并保护错误／完成反馈。Field 保留 HTML min/max/step、必填/错误说明，仍支持原生 select fallback；imagingType 对 legacy osc 显示 color。后端 DTO 是最后防线。 |
| frontend/ui/src/features/siril/Inspector.tsx:1 | 历史路径仅重导出真实 Inspector。测试从此入口不证明生产 NodeView 使用同一 props。 |
| frontend/ui/src/features/storage/shared.tsx:16–96 | useStorageAction 在卸载后忽略反馈，pending 用 React state。OperationProgress 每 800ms poll，卸载 abort/clearTimeout，劣化错误显示 request code，提供 cancel/retry。retry 只适用于非 terminal 且 error 的状态，服务端失败为终态时 API 不重跑已结束实例。 |
| frontend/ui/src/i18n/locales/en/main.json、frontend/ui/src/i18n/locales/zh/main.json | 497 叶子路径各自一致，探针 i18n 测试；动态字符串 Key 与文案准确性未穷举。 |
| mcp/src/astrophoto_mcp/__init__.py:3–5、mcp/src/astrophoto_mcp/api/__init__.py、mcp/src/astrophoto_mcp/tools/__init__.py | 版本取安装 metadata；其余入口仅说明职责。 |
| mcp/src/astrophoto_mcp/api/equipment.py:14–116 | credential、direct_url、canonical_id、list_params、valid_record 拒绝部分坏输入；设备 GET 不跟 redirect、不使用 env proxy，10s 配置是 HTTPX 分阶段 I/O timeout；错误码净化，DTO 浅层验证；响应大小上限、嵌套完整性与真实端口 Token E2E 未确认。 |
| mcp/src/astrophoto_mcp/client.py:9–14、mcp/src/astrophoto_mcp/config.py:7–27 | 诊断请求坚持 public GET，优先级 CLI、env、默认；拒绝非法 URL，允许代理 base path，诊断客户端环境代理行为有别于设备。 |
| mcp/src/astrophoto_mcp/tools/status.py:11–24 | 声明本地安装 version 的输出 schema，connection_status 沿用 ToolResult JSON text。 |
| nodes/__init__.py:1–5 | 仅重导出稳定 V3 绘图类。科学节点由根 __init__.py 导入与注册。 |

另外复核了 frontend/ui/src/features/assets/AssetsPage.tsx:27–103。可用 Asset Library 的过滤作用于资产名及排序。帧类型选择只在未 ready 分支可见，选择值没有传给实际资产列表，现有导航测试只证明未可用时可选择。Session 列为关联标识。另查 astrophoto/equipment/schemas.py:192–196 和 OpticalTrainEditor.tsx:9–10,70，确认光路状态不再作为表单区，旧 DTO 仍保留，当前用户删除 UI 的决定未暗中擦除历史字段。
