# 当前源码架构

| 源路径 | 当前职责 |
|---|---|
| __init__.py、nodes/ | comfy_entrypoint、on_load、get_node_list。绘图节点与三个科学节点，返回宿主 V3 Schema。 |
| astrophoto/bootstrap.py、astrophoto/core/ | 纯配置 bootstrap、宿主启动时初始化、失败降级、作用域配置验证、capabilities 与版本。 |
| astrophoto/api/ | Comfy PromptServer RouteTableDef。route registration、共享 auth/DTO/error、分域 storage、assets、equipment、siril。 |
| astrophoto/storage/、astrophoto/database/ | 文件授权、初始化锁、SQLite baseline、Workspace、Cache、后台 operations、复制及迁移恢复。 |
| astrophoto/assets/、astrophoto/equipment/ | 资产对象/位置/Session 关系、设备规格、光路 JSON 当前配置以及读兼容快照。 |
| astrophoto/siril/ | 可执行探测，固定处理脚本，FITS I/O、候选预览、正式处理与恢复。 |
| frontend/entry.ts、frontend/src/ | Vue Widget、PrimeVue、绘图/上传、原生宿主导入与复用的 Vue 控件组件。 |
| frontend/ui/src/ | React Sidebar、公开 Host API adapter、页面、DTO、科学节点 DOM Widget 和独立 Inspector。 |
| mcp/src/astrophoto_mcp/ | 独立 FastMCP 4.2.0 CLI/server/client 和 HTTP adapter，发包与 Extension 分离。 |
| scripts/、.github/ | 版本同步/预检、Registry 与 PyPI 构件边界、CI、发版和隔离安装检查。 |

## 入口和依赖方向

- __init__.py:12–45 → bootstrap.host_runtime → StorageRuntime.initialize → 数据根、DB、缓存、未完成 operation 与 Siril run 恢复。initialize_storage_runtime 捕获错误，status 仍可报告 degraded。宿主入口有重复 route/runtime 判断。
- ComfyUI 环境的浏览器 → Host Adapter 的 fetchApi → route registry → 权限及 JSON 解析 → asyncio.to_thread → domain service → DB transaction/operation。长时 I/O 走业务 worker 和持久 plan/receipt。
- root config/settings.json 设 workspace id、import mode、cache budget、PNG 分辨率，配置锁和 revision；Databases/assets.db 保存身份/Workspace/资产关系/操作/设备与光路。文件分布在各 Workspace、外部原路径、Cache 和 runtime。
- Comfy Vue Widget 装入原生 DOM widget，拥有自己的 Vue 生命周期；React Sidebar 装入宿主 sidebar render 容器；科学节点 Inspector 另有 React root/widget 生命周期，发布产物共享单个 js/main.js 和 JS 相对链接的 assets/main.css。
- Comfy graph 是节点修改、Undo/Redo、工作流与正式队列执行的拥有者。Sidebar Nodes 的添加/拖拽在当前图上调宿主 API。status 中 canvas_bridge false 指远程/Agent 能力，不能据此否认这条本地交互。
- MCP stdio → create_server → 诊断或设备 Tool → HTTP 边界 → Extension Service，MCP 无 DB/import 依赖 Extension。详见 [MCP](10_MCP_CI_PACKAGING.md)。

## 路由入口

统一前缀 /astrophoto/v1。GET /status 是单独的公开 status handler。其余声明从 api/storage.py:176、api/assets.py:53、api/equipment.py:81、api/siril.py:94 加入原生路由表。可从 [路由索引](evidence/routes.md) 跳到每条实际方法、handler 与预期 HTTP status。四组业务路由共用 body 限制与错误包装，equipment 切换独立授权策略。

这是审计范围内项目树。reference、历史交接、node_modules 与 .venv 是参考或依赖证据，未按本项目实际运行模块计数。逐路径覆盖账本见 [source-inventory.md](evidence/source-inventory.md)。
