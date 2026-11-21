# 本地存储与工作区 · 交互规格

**版本** v0.4 · 2026-11-21 · 当前 Vue 行为回溯。证据为组件与测试源码。历史 React 与已留存的宿主截图、测试记录各自维持原适用范围。

## 入口与可见状态

在 ComfyUI 左侧打开 AstroPhoto → Settings → Storage。当前 Storage 卡显示 Data Root 路径和来源、资产库健康、默认导入模式、工作区、迁移回执与 Cache。Settings → System Status 提供独立的储存可用性和启动诊断。首次等待显示加载状态，GET 错误提供 Refresh。写能力关闭或本页已有动作时，变更入口禁用。保存后重新读取服务端快照，冲突提示可刷新；Cache 草稿可在刷新后保留。 [StoragePage.vue](../../../frontend/src/features/storage/StoragePage.vue) · [SettingsPage.tsx](../../../frontend/src/features/sidebar/SettingsPage.tsx)

| 场景 | 前提、动作与结果 |
| --- | --- |
| FR-01 初始化/诊断 | 进入 Storage 读取快照。显示根路径和数据库状态；读取失败显示错误与刷新，亦可去 System Status 查看可用性。 |
| FR-02 登记与默认 | 展开 Add workspace，填名称和服务端绝对路径后保存。已登记行显示名称、路径、状态、容量和默认徽记。操作面板可验证、启停、改名，在线非默认项可设为默认；结果刷新，验证有文本通知。 |
| FR-02 / FR-04 迁移 | 在线行打开 Migrate workspace，原生输入框提交目标路径，取消输入框不提交。服务端拒绝后显示错误。受理后显示 ID、阶段和可取得的计数、验证方式及错误；后端轮询失败给刷新入口，非终态支持取消，收到非终态错误时可申请重试。终态继续呈现回执，刷新行路径以快照为准。 |
| FR-03 模式与 Cache | 选择 Reference 或 Copy，按服务端刷新值高亮。Cache 展示使用量和状态，编辑路径或限额后保存。在线时可打开清理确认；确认框含当前路径，取消无请求，确认后显示删除数量、字节、跳过和失败数。 |
| FR-05 重绑与解除 | 当前 UI 在离线、标记不匹配或禁用时提供重绑路径输入，服务端仍检查原标记、目标身份与租约。移除需宿主确认，默认项与迁移中项禁用，资产或活动任务拦截由服务端反馈。 |

## 反馈、键盘与待验收项

评审时按三个独立入口走查。更改默认后以服务端快照的默认徽记为准，旧行路径应保持原值。使用重绑时输入已移动的目录，原行 ID 保持，只有成功后才显示新路径。迁移受理后继续展示作业阶段，待服务端提交和刷新才改变行路径。遇到离线或身份不符时，保留原工作区和默认徽记，用户可恢复原路径、按条件重绑，或另选在线工作区用于后续作业。请求失败时保留服务端确认的值。真实宿主还需复核离线回到在线、非终态错误后重试和刷新找回回执。 [Q-02、Q-04](01_PRD.md) · [CASE-04～05](05_TEST_PLAN.md)

Workspace 更多动作按钮有名称、展开状态和控制关系，Escape 收起并返回按钮焦点。单选和表单使用 HTML 原生控件，迁移、改名、重绑和清理确认复用宿主对话框。状态含文本，验证/清理回执使用 status 区域，文案来自英/中词条，Theme 由侧栏样式接入。真实宿主中需复核窄侧栏、长路径、键盘对话框回焦及错误宣布。 [WorkspaceActions.vue](../../../frontend/src/features/storage/WorkspaceActions.vue) · [OperationProgress.vue](../../../frontend/src/features/storage/OperationProgress.vue) · [CacheSettings.vue](../../../frontend/src/features/storage/CacheSettings.vue) · [英文字词条](../../../frontend/src/i18n/locales/en/sidebar.json)

当前发起迁移只有路径输入，容量和清单在服务端受理后检查。页面从快照取第一笔迁移或本页新启动的一笔。多个操作的历史选择、预检摘要和重载恢复体验由 Q-04 评审。离开 Storage 子页或卸载侧栏会清理该组件的轮询与请求。只切换侧栏标签可能保留已访问的 Settings 实例；后端任务仍可由 ID 查询。原型和宿主实测沿用历史材料；本轮未运行浏览器。 [历史交付](../../../docs/local-storage.md) · [历史 UI 资料](../../archive/storage-comfyui-frontend.md) · [CASE-01～05](05_TEST_PLAN.md)

## v0.5 待评审交互

建议普通入口只展示当前存储位置、可用状态和导入操作。选择复制时显示副本位置，选择引用时提示文件留在原处。将全实例「搬家」和单行「迁移工作区」分别放到实例与工作区层级。正式的搬家原型还需评审预检、停止并重启宿主、失败回到原根和最近一笔回执。当前 Assets 页面为占位。 [FR-06、FR-07 与 Q-04、Q-06](01_PRD.md)
