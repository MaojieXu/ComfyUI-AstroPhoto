# ComfyUI 扩展底座与绘图节点 · 技术设计

**版本** v0.4 · 2026-11-21 · 当前实现对账

## 系统职责与数据流

1. **宿主启动和观测。** `comfy_entrypoint()` 创建 V3 扩展，当前入口还装配 Siril Bundle。宿主调用 `on_load()` 时，已有 runtime 可重绑；首次装配通过 `host_runtime()` 初始化本地服务，同一宿主路由表注册状态及业务路由。随后宿主登记 `get_node_list()` 的节点。状态读取实时注册映射，节点尚未登记时允许降级。
2. **前端构件。** Vite 主输入 `extension/frontend-entry.ts` 通过宿主 app 执行 `initializeFrontend()`。扩展只交付一个发现用 JS 和共享 CSS；app/API 外部引用均按宿主相对路径解析。公共入口装配绘图、侧栏和已提供的 Bundle；绘图 Widget 的创建及销毁不依赖打开侧栏。
3. **工作流保存。** Vue Widget 在宿主 DOM Widget 的同步值接口读写 `{image, canvasDataURL?}`。画板初始化白板、笔画结束、清空及成功解码时生成 PNG 快照。新笔画或清空时保存值中的 `image` 重置为 null。真正编辑且快照变化时，Widget 向宿主 graph/canvas 发变更通知。保存工作流本身无需上传。
4. **Prompt 序列化。** `serializeValue()` 等待所持恢复 promise，读取组件记录的 Canvas PNG，经宿主 API 发送 multipart 文件到 `/upload/image`，`subfolder=threed`、`type=temp`。成功路径拼接 `{image: "threed/<name> [temp]"}`；当前异常捕获返回 `{image: null}`。
5. **后端执行。** V3 节点读取小写输入名 `custom_vue_component_basic`，类型为 `CUSTOM_VUE_COMPONENT_BASIC`，只产出一个 `IMAGE`。它先检查输入对象及字符串字段，再经宿主路径解析和 LoadImage。Mask 不进入输出。历史真实宿主执行失败，当前代码及替身不能证明正式链已修复。

## 接口和兼容约束

| 契约 | 形态与语义 | 兼容与验收 |
| --- | --- | --- |
| GET `/astrophoto/v1/status` | `extension.id/version`、`api_version`、`status`、`runtime.node_registered/routes_registered`、`data_home`、`capabilities`，能力项提供 `available/reason`。 | 已注册且数据库没有已报告故障才为 ok；能力仍各看授权和依赖，没有从配置路径推断健康。MCP 默认诊断独立读宿主系统/节点信息。 |
| V3 节点 ID 与数据 | 稳定 ID `vue-basic`，含既有自定义 Widget 类型及输入键，节点数据不写业务库。 | 真实宿主以 `/object_info/vue-basic` 核对 schema；旧工作流无 PNG 时可编辑，不能重建已缺失历史像素。 |
| 工作流 / prompt / 输出 | 前者可内嵌 PNG，prompt 只带临时引用，队列历史与 PreviewImage 验证正式执行。 | 保存 JSON、上传回执、prompt 中引用、队列 history 和下游图像分别留证。上传失败时应拒绝伪成功。 |
| 构件及依赖 | `WEB_DIRECTORY=./js`。ESM 主 JS 与相对 CSS/宿主模块，Registry Extension 和同版本 MCP 分开。 | 代理资源验证只覆盖资源 URL，不扩大本地业务写入授权。独立安装 wheel 和宿主加载各自验收。 |

## 失败、时序与风险

| ID | 核对到的行为 | 仍需验证或决定 |
| --- | --- | --- |
| R-01 | 宿主路径由 `get_annotated_filepath` 解析后交给 LoadImage。替身测试只证明委托。 | Q-01 决定影响完整发行的程度。独立宿主执行需要按真实 prompt ID 判断下游结果。 |
| R-02 | 每块画板保有恢复 revision。新恢复、落笔、保存、卸载使旧解码失效；解码成功后先看 revision，再检查 300×300 尺寸并画图。 | Q-03 决定用户是否可在恢复前落笔。当前 stale decode 成功会短路，但旧 promise 的拒绝处理仍可能在后来的编辑或成功恢复之后设置错误；活动笔画未提交快照时的队列输入也要实测。 |
| R-03 | 上传请求读取 `resp.json()`，当前未验证 HTTP 状态或 `name` 字段，带 JSON 的错误响应可能拼出 `threed/undefined [temp]`。节点只检查 image 类型。 | CASE-03C 作为契约缺口，验证失败不能算正常。修代码和扩大失败 UI 由后续开发处理。 |
| R-04 | PNG 随工作流保存。分享其副本也会传递像素；当前无专属剥离入口。 | Q-02 决定仅用宿主操作指引，还是增加选项。 |
| R-05 | 路由注册预检既有路由；配置错误能形成 runtime 降级。Bundle 与公共入口共享初始化。 | 测试路由冲突前后、副作用边界及单实例。首次宿主装配在路由预检前初始化存储，路由冲突时无部分注册与磁盘写入是否回滚分开取证。 |
| R-06 | 输入取显示坐标，未显式按 300×300 位图与显示尺寸比例换算，也没有 touchcancel handler。 | CASE-02A 对照窄布局、高缩放和触摸中断的落点与提交像素。 |
| R-07 | 状态由 status_handler 直接响应，包含 data_home；设备和存储权限由独立 handler 应用。 | CASE-01C 验证禁用本地操作时的状态可见性。披露策略变更需要产品决定。 |

**版本边界**。历史宿主 0.45.0 / 1.59.1 与迁移目标 0.46.0 / 1.59.6 分开。当前构件使用 Vue 3.5.42、Vite 8.2.2、Vue I18n 与浏览器 Canvas。宿主类型包锁定 1.59.1，类型检查不代替 1.59.6 运行验证。 [前端依赖](../../../frontend/package.json) [源码与规则](04_DEV.md) · [测试设计](05_TEST_PLAN.md) · [P0 宿主基线](../archive/comfyui-frontend-stack-migration/01_PRD.md)
