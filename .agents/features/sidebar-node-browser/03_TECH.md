# 侧栏与节点浏览 · 技术设计

**v0.3 · 当前工作树静态核验**。环境见 [索引](00_FEATURE_INDEX.md)。Vue 和 Vue I18n 随单一 Vite 构件交付，适配宿主的 tab 注册、主题样式、设置与图接口。

| 领域 | 所有权、入口与数据契约 | 失败与恢复 |
| --- | --- | --- |
| FR-01、FR-05 注册 | `extension/frontend-entry.ts` 组合公共扩展和 Siril Bundle。公共 `main.ts` 调用 `registerSidebar`，使用 `astrophoto.sidebar` 注册 custom tab；宿主 render 才创建 Vue 实例。Assets 是本地占位。 | 同容器重复 render 不挂新 root；换容器和 destroy 先卸载，清除 locale 监听和自有元素；设备 Session 随注册实例保留。 |
| FR-02 目录 | `GET /object_info` 经宿主 `fetchApi` 返回节点定义映射，`nodeCatalog` 规范化为 `NodeCard[]`（id/title/description/category/aliases 和输入输出名称/类型）。识别模块名 `custom_nodes.ComfyUI_AstroPhoto`，兼容没有模块名的 `vue-basic`；UI 排除首段为 examples 的节点。 | 无效响应或本域必要字段损坏进入 schema 错误；刷新、请求变化或卸载取消旧信号；旧结果禁止覆盖新状态。 |
| FR-02 浏览及书签 | 查询、选中、分类及折叠为 Vue 状态。`AstroPhoto.Nodes.Sort` 保存至 localStorage。书签为宿主 `Comfy.NodeLibrary.Bookmarks.V2` 字符串数组，接受裸 ID 和当前 `category/id`。 | 写前重读，只编辑本节点的两种引用，保留其他合法字符串。异步写入失败重读宿主并反馈；跨客户端无原子合并。 |
| FR-03 建图 | 依赖宿主活动 `canvas.graph`、LiteGraph 类型工厂和坐标换算。投放 MIME `application/x-astrophoto-resource+json`，载荷 `{v:1,kind:'node',nodeId}`，对照当前目录 ID。 | 不可编辑、注册缺失及坐标错误在变更前拒绝；事务内失败尝试清理节点并配对变更通知，宿主拥有撤销及最终保存。 |
| FR-04 元数据 | 详情和 Teleport 悬停共用 NodeCard，展示 DOM 不实例化节点。ResizeObserver、滚动及窗口尺寸事件维护定位。 | 没有真实帮助和逐节点依赖检查；缺内容使用空项或提示。浮层离开释放监听。 |

搜索框和筛选控件参考 ComfyUI Frontend 1.59.6 的 `SearchInput.vue` 与 `FilterDropdown.vue`，保留本项目去抖和搜索状态。`SidebarTabs` 的键盘行为取自 1.59.1 media sidebar。LiteGraph adapter 注释中的验证版本为 Frontend 1.59.1，目标 1.59.6 的经典 Canvas、Nodes 2.0 正常路径已有迁移批次证据，边缘和负向用例需要分模式记录。投放监听注册在 document 捕获阶段，每次事件动态比较当前 `app.canvas.canvas` 和事件目标，卸载时移除监听。画布替换及覆盖层命中仍须实测。目录全量取回并本地筛选，无数据库、分页或声明的量化性能上限。Agent 图编辑与工作流执行属于其他边界。 [实际调用和守卫](04_DEV.md) · [验证入口](05_TEST_PLAN.md) · [历史证据](../../../docs/react-sidebar.md)
