# 差距与风险

本轮只修文档；下面的源码问题未擅自修复。状态适用于具体结论，不将疑点伪装成已复现的宿主故障。

| ID/优先级 | 状态 | 证据与影响 | 下一步及验证 |
| --- | --- | --- | --- |
| R1 / 发布阻塞 | VERIFIED | `evidence/host-start.txt`：宿主 comfy_kitchen 导入需要 torch.library.custom_op，Torch 2.3.0 无此属性；插件尚未加载 | 经用户授权解决宿主环境，或准备批准的独立可运行宿主；不得在当前宿主 uv sync。再跑 host 测试和 UI |
| R2 / 发布阻塞 | VERIFIED | `evidence/pypi-availability.txt`：0.0.1 返回 404 | 获发布授权后先 PyPI，再公共安装/stdio，最后 Registry；当前不得发布强依赖不存在包的 Extension |
| R3 / P0 验收 | IMPLEMENTED_UNVERIFIED | 完整绘图→上传→真实 LoadImage tensor→Preview Image、保存/重开链路没有实际宿主通过证据 | host HTTP 测试仅检查 status/object_info，另手工验证工作流 JSON 与像素恢复、英中 UI、清理 |
| R4 / P1 | PLANNED | `mcp/src/astrophoto_mcp/api/comfy.py:6` 只请求两个 ComfyUI 端点；没有跨包版本握手/拒绝 | 新增能力发现设计时保持两个旧 Tool 契约，单独测试兼容版本与不匹配 |
| R5 / P1 源码审查 | PARTIAL | `frontend/src/components/VueExampleComponent.vue:48` 调用 resp.json()，未检查 resp.ok/name；错误 JSON 可能形成 threed/undefined [temp]。当前测试只覆盖 rejected Promise | 补 HTTP 4xx/5xx、错误 JSON/name 的浏览器测试，再授权修复，保留既有失败契约 |
| R6 / P1 证据不足 | UNKNOWN | 同组件:24、60 只有本地 canvasDataURL 和 serializeValue，未见读取持久 Widget 值并重绘的路径；当前测试不覆盖保存/重开 | 先在真实宿主复现，不将“序列化通过”写成“画板恢复通过”；再定义恢复语义和测试 |
| R7 / P2 | VERIFIED | `locales/zh/main.json` 缺少 pen-tooltip；`evidence/frontend-tests.txt` 出现英文 fallback | 增补翻译并断言中文 tooltip，无需架构重构 |
| R8 / P2 | CONFLICT | `.pre-commit-config.yaml:4` Ruff v0.4.9，uv.lock/CI 实际 Ruff 0.17.5 | 后续统一版本并审查 format/fix 的改动；本轮不执行自动改写 Hook |
| R9 / P1 兼容 | IMPLEMENTED_UNVERIFIED | 类型包 1.59.1 peer Vue ^3.5.42；runtime 3.5.13，有精确 allowedVersions 例外。vue-tsc/Chromium 通过 | 真宿主1.59.1验证；不得把 peer 例外当兼容证明，也不盲目升级 UI |
| R10 / P2 | UNKNOWN | CI/release YAML 本地审查通过，未查询或运行远程 Actions；Manager 三种安装路径未实际验收 | 发布前执行真实矩阵/Manager安装更新，保留日志，独立 MCP 环境单独升级/重启 |
| R11 / P2 | PARTIAL | 根 pyproject 有 mypy 配置，但没有项目依赖/CI 调用；vue-tsc 排除 tests | 明确当前检查范围，若引入 Python 类型检查需实际配置和验证 |
| R12 / 未来业务前置 | PLANNED | API status 暴露配置 data_home，没有新增认证/用户隔离；目前无写 API | 开放 Assets/Memory/远程部署前定义认证、路径范围、CSRF/Origin、回执；本地诊断不等于权限系统 |

构建输出约 545 kB 单 JS，非当前失败；Node 26 的 localStorage ExperimentalWarning、Vue compiler macro 导入警告也未造成测试失败。MCP 安装日志中依赖解析警告有原始记录，不宣称整个宿主依赖环境健康。

PyPI、Registry、Node/Browser/Host 安装版本会变化；使用此包接手时先核对时间和哈希。历史“所有功能保护已完成”的泛化结论应缩小到隔离测试范围。
