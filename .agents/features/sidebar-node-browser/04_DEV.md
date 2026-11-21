# 侧栏与节点浏览 · 开发规格与实现

**v0.3 · 当前源码回溯**。基线见 [索引](00_FEATURE_INDEX.md)。旧 `frontend/ui/` 可用 `git show 4c0cf4d:frontend/ui/src/host/sidebar.tsx` 等定位，只作 React 行为参照。

| 需求 | 现行文件/符号 | 调用、分支和副作用 | 验证 |
| --- | --- | --- | --- |
| FR-01、FR-05 | `frontend/src/host/sidebar.ts:registerSidebar`、`host/locale.ts:watchLocale`、`features/sidebar/Sidebar.tsx:Sidebar`、`SettingsPage.tsx:SettingsPage` | 查宿主 tab ID 后注册；render 换容器先 destroy；创建 div、i18n、Vue root。初始同步 locale，后续可见时轮询或 focus 更新；销毁幂等。主标签按访问懒挂载，后续 hidden；Settings 离开检查设备 guard。Settings 读取 status/storage，Assets 无素材请求。 | CASE-01、05 |
| FR-02 | `frontend/src/api/nodes.ts:fetchNodes,nodeCatalog`、`shared/useResource.ts:useResource`、`shared/SearchField.tsx:SearchField` | 校验 name、output、input 和 required/optional 规格；数组类型转 COMBO，无输出名称回退索引。可选元数据有回退。刷新或卸载 abort；SearchField 180 ms 去抖，IME 完成后查询，清除回焦。 | CASE-02 |
| FR-02 | `frontend/src/features/nodes/NodesPage.tsx:NodesPage`、`NodeTree.tsx:buildNodeTree,NodeTree,NodeLeaf`、`shared/useStoredChoice.ts:useStoredChoice` | 去除显示前缀，按搜索、类别缩小集合，逐层建树，可选 locale 名称排序；搜索折叠独立。活动页每 500 ms 同步收藏，写前读设置，新增裸 ID，删除本 ID 和当前完整路径；收藏以末段 ID 匹配已筛选目录。设置读值若非数组回退为空，写失败反馈。 | CASE-02、06 |
| FR-03 | `frontend/src/host/dragDrop.ts:writeNodeDrag,readNodeDrag,attachCanvasDrop`、`host/canvas.ts:createCanvasNode` | 随资源状态替换 drop 监听；无 surface 跳过，非专用 MIME 或目标不是 surface 放行。解析 JSON/version/kind/允许 ID，随后检查 ready、图、read_only、selectOnly、allow_interaction、类型和有限坐标。beforeChange 后创建/定位/graph.add，失败尝试移除已添加节点或执行 onRemoved；进入创建 try 后由 finally 发送 afterChange。 | CASE-03、07 |
| FR-04 | `frontend/src/features/nodes/NodesPage.tsx:NodesPage`、`NodeHoverPreview.tsx:NodeHoverPreview` | 以选择的 ID 显示详情，Back 清除 ID，添加调用共用适配器。鼠标、拖动或标签变更控制预览，观察器及窗口事件随作用域退出释放。 | CASE-04 |

设备草稿恢复为默认 Assets 的例外，出处为 [设备专题](../equipment-optical-trains/04_DEV.md)。节点类别在树中展示，详情缺独立类别项。代码中没有真实帮助查询或逐节点软件可用性判定。drop 监听同挂载页隐藏时仍可存在，监听在 document 捕获阶段动态检查当前 canvas DOM，是否在画布替换和覆盖层交互时符合预期需实测。上述及双画布兼容进入 [测试计划](05_TEST_PLAN.md)。 [历史书签](../../notes/node-bookmarks.md)
