# ComfyUI 扩展底座与绘图节点 · 开发规格与实现

**版本** v0.4 · 2026-11-21 · 工作树现状披露

## 基线与改动切片

Git 参考点为 `4c0cf4d`。当前工作树含 Vue 入口、绘图组件移动、前端测试和后端 Bundle/路由改动。以下记录实际入口和守卫。尚未确认的产品选择列在 PRD 中；对应未来改动不计为已实施。

| 切片 | 当前真实路径与入口 | 行为、副作用顺序与拒绝 | 追溯 |
| --- | --- | --- | --- |
| S1 宿主加载 | [入口](../../../__init__.py) · `comfy_entrypoint`、`AstroPhotoExtension.on_load`、`_bind_runtime`、`get_node_list` | 构造 V3 对象并装配处理 Bundle；扫描该宿主路由表，已有带 runtime 的 handler 则重绑并返回；否则用线程装配 runtime，计算可信部署状态，注册路由再绑定。节点注册探针比较宿主映射中的类身份。 | FR-01 · CASE-01A |
| S1 数据初始化 | [bootstrap](../../../astrophoto/bootstrap.py) · `bootstrap`、`host_runtime`、`initialize_storage_runtime` | bootstrap 装配配置与 runtime；无初始化调用就不创建数据库。非法数据根配置产生 `INVALID_STORAGE_PATH`，保留回退配置用于诊断，不启动该次存储。存储初始化异常记录 `storage_error`、置空 runtime.storage，保留状态。 | FR-01 · CASE-01B |
| S1 状态路由 | [注册](../../../astrophoto/api/routes.py) · `register_routes`；[状态](../../../astrophoto/api/status.py) · `status_payload`、`status_handler`；[能力](../../../astrophoto/core/capabilities.py) · `capabilities`、`storage_capabilities` | 已存在本扩展状态时复用，更新注册探针；外部状态路由或其他同 method/path 先报冲突，不添加本次部分路由。状态用实时注册、数据库健康与服务条件生成；缺注册、缺路由或数据库故障为 degraded。 | FR-01 · CASE-01A/B/C |
| S2 Widget 装卸 | [公共入口](../../../frontend/src/main.ts) · `initializeFrontend`；[绘图接线](../../../frontend/src/host/drawing.ts) · `registerDrawing` 的 `getCustomWidgets`、`nodeCreated`、`widget.onRemove`；[语言](../../../frontend/src/host/locale.ts) · `watchLocale` | 注册工厂经 `addDOMWidget` 创建小写键，Widget 显示高度 460。只对 `vue-basic` 设节点最小尺寸 300×520。初始化语言，Web 窗口焦点和可见时同步；移除先停订阅再卸载 Vue，最后委托既有回调。 | FR-02/04 · CASE-02A/04A |
| S2 图像编辑 | [绘图板](../../../frontend/src/features/drawing/DrawingBoard.vue) · `setupCanvas`、`startDrawing`、`draw`、`stopDrawing`、`clearCanvas`、`saveState`；[容器](../../../frontend/src/features/drawing/DrawingApp.vue)；[工具栏](../../../frontend/src/features/drawing/ToolBar.vue) | 初始化与清空填白；落笔开始使旧恢复失效，画笔移动需要活动笔画和 context；结束生成 PNG 并向父组件传播。颜色和大小更新工具当前值，只有像素快照作为工作流数据恢复。getCoordinates 直接取显示坐标，没有尺寸比例换算或 touchcancel 分支。 | FR-02 · CASE-02A |
| S2 保存与恢复 | [Widget](../../../frontend/src/features/drawing/VueExampleComponent.vue) · `normalizeValue`、值 hook、`handleStateSave`、`onMounted` watch；DrawingBoard `restoreCanvas` | 非对象转空引用，字符串字段保留。挂载时先保留已保存值，watch 同步安排异步恢复。前缀不符、解码失败和尺寸不符拒绝；已失效或无 context 则短路。成功绘入并重新产生 PNG。保存读取同步 Widget 值。仅编辑、挂图且 PNG 变化时，handleStateSave 依次发 beforeChange、提交值并调用 graph.change，最后由 finally 发 afterChange。 | FR-02 · CASE-02B～D/02F |
| S3 临时上传 | VueExampleComponent `uploadTempImage`、`widget.serializeValue` | 等待当前保存的恢复任务，缺快照返回空引用。将 PNG 转 blob 后构建 multipart，使用宿主 API，解析 JSON 再拼接临时引用。抛错返回空引用。HTTP 成败与 JSON name 尚无单独守卫。 | FR-03 · CASE-03A～C |
| S3 正式节点 | [Python 节点](../../../nodes/ComfyUIFEExampleVueBasic.py) · `define_schema`、`execute` | 注册现有 V3 schema。非 dict 或 image 非字符串，抛 ValueError，不调用宿主 I/O。通过检查后路径交给宿主解析、LoadImage 加载，仅返回 image；空字符串也能过现有类型守卫，能否加载由宿主决定。 | FR-03 · CASE-03D/E |
| S4 发行物 | [Vite](../../../frontend/vite.config.mts) · [发行入口](../../../extension/frontend-entry.ts) · [release.py](../../../scripts/release.py) · [check_install.py](../../../scripts/check_install.py) | 输出一个发现用 JS 及公共 CSS，宿主模块和 CSS 相对寻址。同版本检查、Registry 与 MCP 内容检查、wheel 独立安装握手各自生效。正式发布次序为 MCP → 公开解析与安装 → Registry。 | FR-04 · CASE-04A/B |

## 已知差异和后续落点

- **Q-01 / FR-03**。当前真实浏览器脚本仅验到 `graphToPrompt()` 和临时引用。完整队列用隔离宿主与下游结果复验，记录历史已知失败和真实返回。若调整发行门槛，传播到 PRD、CASE-03E、发行口径及后续 Close。
- **Q-02 / FR-02**。当前通过宿主工作流直接分享内嵌图像，无脱敏入口。若采纳说明方案，UX 与用户指南提供用副本清空并复读的具体步骤；若采纳独立选项，先评审宿主导出接入和可逆性。
- **Q-03 / FR-02**。当前用版本计数保护 decode 成功后的绘制。代码没有恢复期间交互锁；也未对过时 decode 失败提示施加相同检查。笔画期间提交的最新快照语义须以受控 decode 测试记录。确认后再判断现有实现需补哪项保障。
- **FR-03 上传响应**。非 JSON 或请求直接异常会返回 null。HTTP 错误但返回 JSON、缺失名称等需作为明确的预期失败与实现差异，修复需在业务实现阶段完成。
- **共用入口**。绘图 Widget、宿主状态与构件脚本可能影响侧栏和科学节点。修改这些共享入口时，用代表性启动和构件回归，Siril 细节由它自己的专题覆盖。

[PRD](01_PRD.md) · [技术设计](03_TECH.md) · [测试计划](05_TEST_PLAN.md)
