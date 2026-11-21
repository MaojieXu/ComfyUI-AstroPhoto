# Frontend Module

[前端概览](../../core/frontend-overview.md) · [公共入口与宿主](source-index-sidebar.md) · [领域界面及 Bundle](source-index-sidebar-domains.md) · [画板与构件](source-index-widget-tests.md) · [实际测试](source-index-frontend-tests.md)

## 初始化与隔离

`extension/frontend-entry.ts` 调用公共 `initializeFrontend` 并传入 `sirilBundle`。公共层装载一份相对 CSS，再注册绘图、FITS Source 和原生侧栏。软件摘要、设置、词条和节点贡献由 Bundle 派入。没有 Bundle 时可构建并挂载公共根。退出历史 React 入口所保留的迁移前证据来自 HEAD `4c0cf4d`。

`registerSidebar` 检查原生实例 ID，同一容器复用 Vue 根。替换容器或宿主销毁时停止语言监听并卸载。普通首次挂载选 Assets，设备有草稿时选 Settings。节点和设置请求在首次访问时启动，卸载中止活动的 `useResource` 请求。各挂载根使用 Vue I18n，默认宿主词条映射中英；CSS 通过宿主主题变量继承。

## 领域边界

- 节点目录经 `app.api.fetchApi('/object_info')` 生成卡片。搜索、排序和分类由 Vue 维护，收藏使用宿主设置。鼠标悬停使用 Teleport 和可回收监听。点击与拖放都经 `createCanvasNode` 检查活动图、部署模式、类型和坐标，配对宿主撤销边界。失败图插入时清理。
- 画板同步 Widget 值保存 `{image, canvasDataURL}`，异步序列化等待旧像素恢复并上传临时 PNG。坏像素提示，失败序列化返回 `{image: null}`，成功保持 `threed/<name> [temp]`。笔画和清屏走宿主变更事务。退出时链回宿主清理。Nodes 2.0 重载时公开 afterConfigureGraph 恢复宿主残留容器中的自有 Widget DOM。Python IMAGE 独立于此验收。
- 工作区、迁移、缓存和环境续用现有本机鉴权、revision 和回执。回执轮询与取消随组件销毁；缓存冲突可以刷新服务端快照，同时保留未确认的输入。
- 设备和光路页面使用共用列表、详情折叠、空态和错误组件。实体校验、版本、草稿和回填留在页面与 API，复用 Reka 的 Vue 组件。导航前询问未保存，保存中保留原位置。
- 公共 FITS 选择器保存原 `asset_id`，通用 Inspector 持有对比、缩放、焦点及可访问状态。AutoStretch 接入 `extension/siril/frontend/`，按来源与参数请求并取消旧候选。桌面视图可见只是候选证据，正式 FITS 需走原生队列。处理回执只有来源和参数仍匹配时用于当前显示。卸载释放监听、计时器、对象 URL，恢复宿主原执行回调。

## 验证入口

通过 Vitest Chromium 验证 Vue 和真实 Canvas，正式宿主检查见 `frontend/tests/host/`。构件、代理、类型和 lint 分别执行。运行按 ComfyUI 0.46.0 与 Frontend 1.59.6，保留迁移前证据和真实与替身的区别。现场证据索引见 [验证](../../core/verification.md)。
