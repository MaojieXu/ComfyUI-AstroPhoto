# 跨端运行架构

| 所有者 | 生命周期与权限 |
|---|---|
| ComfyUI | 工作流、画布、保存、撤销和队列，宿主对象和模型路径。V3 on_load 早于 get_node_list，状态请求延迟查询真实注册。 |
| Extension | 原生 Server RouteTableDef、业务验证、数据库和文件。数据默认在 ~/.astrophoto，assets.db 存身份/关系，图像保留在文件系统。 |
| 浏览器 | 公共 Vue 界面、绘图和软件 Bundle 共用独立构建入口，与宿主 app/api 和画布适配。请求走宿主 fetchApi。 |
| MCP | 独立 stdio FastMCP 进程，经公共 HTTP 读取宿主及 Extension。默认诊断的宿主 URL 与设备只读的受控回环边界有不同条件。 |

端到端链路

- 画板保存走宿主 widget value，保留 PNG；队列序列化独立上传临时 PNG。后端节点解析宿主临时图像并委托 LoadImage。
- 导入经浏览器预检和确认进入原生 route，再交服务检查路径、租约、空间、校验与数据库登记；异步 operation 回执驱动 UI。reference 保留原路径；copy 独立发布。工作区迁移的 DB 根切换是权威检查点。
- Siril 候选由 UI 创建作业并轮询，输出可重建 Cache PNG；正式执行由宿主队列调用 V3 节点，发布独立 FITS 至 Workspace 并保存正式输出回执，收到收录请求后才建立素材登记。后续 IMAGE_PATH 节点可消费该输出。通用 CLI 节点在所需时加载路径的工作副本，并回传 FITS、目录或日志。
- 设备浏览器写入携带来源上下文；独立 MCP 发送只读 Bearer，复用 aiohttp GET 和服务 DTO。Session 由请求或操作持有，外部长任务不持有 SQLite 写事务。

## 宿主 Boot 与 HTTP 合约

根入口 `comfy_entrypoint()` 返回显式选入 Siril Bundle 的 V3 Extension。根 `on_load` 查是否已经接线的运行时，复用或调用 `astrophoto.bootstrap.host_runtime` 组装配置和存储，再向宿主 `PromptServer.instance.routes` 注册。已有自身状态路由会复用运行时；其他 handler 占用同路径时拒绝覆盖。宿主随后注册绘图、通用科学节点，以及由 Siril 命令表生成的 183 个 V3 节点。存储失败时保留基础状态路由。状态调用重新读取节点注册和服务可用性，避免用目录存在或初始化完成推断处理功能已经可用。

| 边界 | 调用方向和关键事实 |
| --- | --- |
| HTTP 注册 | `astrophoto/api/routes.py` 组合 Storage、Assets、Scientific、Equipment 及已选 Bundle 路由。共用 `/astrophoto/v1`，宿主代理场景由相对 `fetchApi`/相对构件 URL 保留前缀。 |
| 状态 | `GET /astrophoto/v1/status` 返回 extension 身份和版本、`api_version: "v1"`、总体状态、运行时和能力。能力对象按注册、数据健康、本机配置和实际 Siril 状态反映 unavailable。 |
| 浏览器业务请求 | 本地业务显式启用，检查监听地址、来源、主机和转发头。浏览器标记与设备只读 Bearer 分开。业务负载按路由校验，错误包含 code 和 request_id。 |
| MCP | `create_server` 负责注册；独立 stdio 进程通过 HTTP 访问 `system_stats`、`object_info/vue-basic` 与已开放的设备 GET。主机地址由 CLI、环境变量、默认值依次解析。设备凭据须同时满足客户端直连和宿主授权。 |
| 前端挂载 | `extension/frontend-entry.ts` 组装公共 Vue 与 Siril Bundle。Vite 输出 `js/main.js` 和 `js/assets/main.css`；侧栏销毁、Widget 原清理和宿主图状态由对应的原生生命周期负责。 |

## 数据的权威位置和提交顺序

- 默认 Data Root 为 `~/.astrophoto/`，首建 `config/`、`database/`、`storage/`、`runtime/`。业务库为 `database/assets.db`，首个工作区为 `storage/<工作区 UUID>/`。根设置有 revision，工作区的实际路径、身份及版本按数据库登记核对。资产的业务标识无需随工作区路径变更。 [后端概览](backend-overview.md#宿主启动与降级)
- Reference 只登记来源。Copy 用 staging 与 operation 记录源、目标及阶段，在校验后发布再登记。Workspace 迁移待目标清单验证后，在同一事务切换权威根和 `committed`。这一步决定恢复时以哪一根为准。
- Cache 可重建，按所属根及 lease 清理；正式输出驻留 Workspace。预览请求按 owner、输入和参数追踪候选，过期回执不应覆盖当前预览。正式 FITS 先落独立工作目录，校验后发布并记录正式输出，`manifest.json` 保存来源、哈希、参数、软件版本和结果。
- 光路当前配置由业务服务写入。历史 revision 可读，与当前编辑接口分开。现有 SQLite 用 WAL/外键/短事务；记忆和知识的目标库与资产是独立所有权，目前没有活跃域服务。

## 现行前端和 Bundle 接缝

公共 Vue 层拥有原生挂载、共享请求、可复用控件、资料库骨架和通用 Inspector。Siril 专属 Python/前端接线、配置、节点交互、预览请求和词条位于 `extension/siril/`。软件设置和注册回调通过 Bundle 接口接入。无 Bundle 时保留通用 FITS、`IMAGE_PATH`、`/previews/settings` 和其它公共能力。使用 Vite `8.2.2`、Vue `3.5.42`，沿用 AstroPhoto 自己的入口与构件路径。详见 [前端概览](frontend-overview.md) 和 [验证](verification.md)。
