---
task: equipment-optical-train
status: completed
updated: 2026-11-18
---

## Goal
完成设备档案与光路的 React、aiohttp、SQLite、授权 MCP 查询及回归。

## Progress
- WP-0：完整读取两份 v1.0，空的第三份略过，独立复用技能调研覆盖宿主注册、主题/对话框、CRUD 和鉴权。工作树 main @ 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a，保留既有未提交内容。
- WP-1/2/4：冻结统一 assets.db 基线，保留原 Storage/Assets 表。完成四类设备、光路及结构/版本/引用保护。
- WP-3/5：同一个 React Sidebar 新增设备设置内两视图七个页面，复用宿主确认/主题、单入口及错误契约。
- WP-6：FastMCP 单工厂有条件注册六个 HTTP 只读 Tool。诊断合同保留。
- WP-7：更新设备、架构、开发、MCP、需求、打包和存储文档，构建并检查本地产物。

## Verified
- Python 3.11/3.12 各 70，MCP 各 67，React 40，Vue 9，全通过。
- 真实 comfyenv 宿主 127.0.0.1:8201，设备七页、两个 Revision、默认指针重启持久化、Storage 与 Vue 绘图恢复、MCP stdio 六个实读工具、错误凭据及写入拒绝。
- Windows C: 与 D: 真实跨卷 Storage 回归，产物 Registry 45 / MCP wheel 16 / sdist 23，已安装 wheel 的真实 stdio 查询通过。
- 测试命令和路径/函数矩阵见 docs/equipment.md。无提交、发布或宿主依赖变更。

## Decisions
- UI 优先级决定具体子类可空；落地相机高级读出能力。光路/设备路由共用一个模块，使用相同 SQLite 写事务策略。
- 旧开发库显示 DEV_SCHEMA_RESET_REQUIRED，验证期间新开隔离 Data Root。保留真实数据。
- MCP 使用显式只读凭据。浏览器写授权仅适用于受信单用户直连部署。

## Blockers
- MCP 写工具受权限边界限制，维持禁用。既存 IMAGE 宿主执行未纳入本轮。

## Next
- 当前范围无待完成项。沿现有工作树继续开发，保留隔离环境和测试记录。
