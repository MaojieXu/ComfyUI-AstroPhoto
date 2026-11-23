# Frontend Module

## Siril 命令目录与通用展示

SirilCommands 使用公共 SearchField 浏览目录，按 category 的英文路径组织多层分组并显示对应语言的目录名。搜索涵盖路径、原始用法、标题和别名。SirilNodes 通过缓存的目录描述按节点 ID 挂载参数 Inspector 或日志；未知或失败时宿主原生控件保持可用。节点目录和原生宿主复用生成的标题、分段类别翻译与端口资源；节点共享简介和可展开语法。FITS 比较共享同一组件，参数默认值、类型和比较能力来自注册表。

[前端概览](../../core/frontend-overview.md) · [公共入口与宿主](source-index-sidebar.md) · [领域界面及 Bundle](source-index-sidebar-domains.md) · [画板与构件](source-index-widget-tests.md) · [实际测试](source-index-frontend-tests.md)

## 初始化与隔离

`extension/frontend-entry.ts` 调用公共 `initializeFrontend` 并传入 `sirilBundle`。公共层装载一份相对 CSS，再注册绘图、FITS Source 和原生侧栏。软件摘要、设置、词条和节点贡献由 Bundle 派入。没有 Bundle 时可构建并挂载公共根。退出历史 React 入口所保留的迁移前证据来自 HEAD `4c0cf4d`。

`registerSidebar` 检查原生实例 ID，同一容器复用 Vue 根。替换容器或宿主销毁时停止语言监听并卸载。普通首次挂载选 Assets，设备有草稿时选 Settings。节点和设置请求在首次访问时启动，卸载中止活动的 `useResource` 请求。各挂载根使用 Vue I18n，默认宿主词条映射中英；CSS 通过宿主主题变量继承。

## 领域边界

- 节点目录经 `app.api.fetchApi('/object_info')` 生成卡片。搜索、排序和分类由 Vue 维护，收藏使用宿主设置。鼠标悬停使用 Teleport 和可回收监听。点击与拖放都经 `createCanvasNode` 检查活动图、部署模式、类型和坐标，配对宿主撤销边界。失败图插入时清理。
- 画板同步 Widget 值保存 `{image, canvasDataURL}`，异步序列化等待旧像素恢复并上传临时 PNG。坏像素提示，失败序列化返回 `{image: null}`，成功保持 `threed/<name> [temp]`。笔画和清屏走宿主变更事务。退出时链回宿主清理。Nodes 2.0 重载时公开 afterConfigureGraph 恢复宿主残留容器中的自有 Widget DOM。Python IMAGE 独立于此验收。
- 配置页在本机授权下登记位置；删除前选择另一个可写位置并确认，操作完成后刷新列表。导入方式和预览设置按共享 revision 刷新，预览保存失败时恢复服务端值并反馈错误。素材操作回执请求随组件销毁取消。
- 设备和光路页面使用共用列表、详情折叠、空态和错误组件。实体校验、版本、草稿和回填留在页面与 API，复用 Reka 的 Vue 组件。导航前询问未保存，保存中保留原位置。
- 公共 FITS 选择器保存原 `asset_id`，通用 Inspector 持有对比、缩放、焦点及可访问状态。AutoStretch 接入 `extension/siril/frontend/`，按来源与参数请求并取消旧候选。桌面视图可见只是候选证据，正式 FITS 需走原生队列。处理回执只有来源和参数仍匹配时用于当前显示。卸载释放监听、计时器、对象 URL，恢复宿主原执行回调。

## 验证入口

通过 Vitest Chromium 验证 Vue 和真实 Canvas，正式宿主检查见 `frontend/tests/host/`。构件、代理、类型和 lint 分别执行。运行按 ComfyUI 0.46.0 与 Frontend 1.59.6，保留迁移前证据和真实与替身的区别。现场证据索引见 [验证](../../core/verification.md)。

存储位置表单可通过 GET /astrophoto/v1/storage/directories 列出本机目录并选择路径。接口与既有存储操作共用受信本机授权，排除链接和不支持的网络位置。组件及隔离 HTTP 验证见 Feature 开发日志，实际宿主待验。

存储位置目录选择面板每次选择一个目录并填入表单；不同磁盘的位置可分别添加。真实双盘宿主验证待执行。

存储位置目录选择现为模态弹窗，显示磁盘入口、面包屑和跨位置选择列表。继续使用受信本机目录浏览接口；组件验证已执行，真实宿主和跨平台表现待验。

项目详情的 ProjectAssetsPicker 使用搜索、分页和多选。项目已有直接素材及集合成员显示已加入；提交通过项目批量关联接口，失败保留选择。

素材引用导入的 `SourceBrowser.vue` 调用受信本机目录浏览接口（`files=1`），单张选择文件，批量可选择文件或文件夹，选择结果进入现有预检与导入流程。真实宿主验收仍待完成。

项目虚拟文件夹通过 LibraryTree 树内创建、重命名和确认删除，校准库维持独立文件夹表单。

素材引用导入及存储设置提供 Windows 系统窗口选择入口，并保留网页浏览。

一次性操作反馈经 `frontend/src/host/notify.ts` 调用宿主 toast；失败回退页内，详情、冲突与重试保持上下文。


ImportAssets 通过 directImport.ts 请求清单预检和任务。DirectImportProgress、directTransfer 协调分盘上传、进度、重新选择和续传。AssetsPanel 通过 import-groups 及 import_group_id 查询组和成员；项目关联保持原素材 ID。

全局任务框由 frontend/src/features/tasks/TaskPanel.vue 与 taskState.ts 实现，挂在 Sidebar 根部并轮询任务回执；暂停的直传可通过任务 ID 返回已有导入恢复界面，取消回执可显示已有逐帧错误，通知按任务 ID 去重。sessionStorage 保存折叠及已清除状态，文件内字节进度尚未实现。
