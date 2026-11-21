# 素材导入与资产登记 · 交互规格

**版本** v0.4 · 2026-11-21 · 当前 Vue 行为回溯。证据为组件和测试源码。

## 当前入口

全新侧栏会话打开 AstroPhoto 默认落在 Assets。若现有设备会话要恢复，初始视图可进入 Settings。Assets tab 继承侧栏键盘导航、语义和宿主语言，唯一页面内容是中/英文说明“素材页将在后续版本提供。” 打开或返回该页不会请求资产列表或发起写入。占位页没有加载、空库、错误或导入状态，当前 FR-01～04 的界面验收待 Q-02 评审；后端仍有对应接口。 [Sidebar.tsx](../../../frontend/src/features/sidebar/Sidebar.tsx) · [AssetsPlaceholder.tsx](../../../frontend/src/features/assets/AssetsPlaceholder.tsx) · [中文词条](../../../frontend/src/i18n/locales/zh/sidebar.json)

FR-05 的科学消费从画布上的 AstroPhoto Load Image 开始。打开控件后读取已登记的 FITS 候选，候选显示名称与短 ID；用户选择资产或输入服务端 FITS 路径并保存到工作流。加载有占位文案，读取失败有重试，旧工作流保存但当前列表未返回的 UUID 作为“不可用资产”保留显示。实际能否读取以及 FITS 是否有效由节点执行校验，候选列表只按扩展名筛选。画布处于只读或 selectOnly 时不提交变更。键盘、窄画布、长名称与旧值回显仍需真实宿主复验。 [fitsSource.tsx](../../../frontend/src/host/fitsSource.tsx) · [科学处理规格](../siril-fits-autostretch/02_UI_UX.md)

## 历史界面与恢复设计范围

| 需求 | HEAD 中 React 界面、历史可见反馈或未来需定义的行为 |
| --- | --- |
| FR-01 | Assets 打开 ImportDialog，输入一行一个的服务端绝对路径，选择有效模式、目标，查看预检计数、大小和失败数。关闭或取消先于确认时不提交。 |
| FR-02 | 发起后用操作 ID 显示进度与回执、有限错误详情和取消状态。当前 Vue 没有管理该导入流程的控件。 |
| FR-03 | 历史列表获取后端所有分页，再筛选名称和新旧/名称排序；帧类型为偏好控件。历史外部资产有重绑表单，产品要求的可用性反馈应以当前独立 availability API 验证。 |
| FR-04 | 历史侧栏展示资产关联的会话标签，新界面是否增加附加和解除关联、是否一起恢复独立会话管理由 Q-02 决定。 |
| FR-05 | 当前占位与 FITS 控件独立，不需要经资产页恢复即可读取已登记 FITS。 |

历史文件可用 `git show 4c0cf4d:frontend/ui/src/features/assets/AssetsPage.tsx` 与 `git show 4c0cf4d:frontend/ui/src/features/assets/ImportDialog.tsx` 验证。完整素材页若进入后续设计，先用可交互原型确定预检确认、部分失败、长期回执、可用性解释和重绑证据，再按 Q-01～04 收敛。已有历史证据保留其版本。 [测试计划](05_TEST_PLAN.md) · [历史交付](../../../docs/local-storage.md)
## v0.4 评审补充

当前 Assets 保持占位。Q-02 若选择恢复，应覆盖来源路径、模式和目标、预检、提交、回执、分页、可用性及外部位置重绑，并为部分失败提供明确反馈。当前公开回执没有失败文件路径，也没有逐项资产 ID，页面无法仅靠现有回执提供完整失败项清单。错误详情、失败项重试和历史回执找回随 Q-04 确定。恢复后需更新实际原型并做宿主交互验收。 [产品问题](01_PRD.md) · [技术契约](03_TECH.md)
