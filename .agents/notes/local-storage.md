---
task: local-storage
status: handoff
updated: 2026-11-21
---

## Goal

实现与验证 Storage v1.1 P0/P1，并同步工程文档。产品约束和技术清单为用户提供的两份本地 Storage 文档。

## Progress

- main @ 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a。保留工作树既有 Skill 修改、reference 和历史资料。未提交或发布。
- V3 on_load 初始化真实 Data Root 和独立 SQLite。接入 Settings、Workspace、Cache、导入、迁移、重定位及资产会话关联。
- 复用 frontend/ui、宿主注册与单一 Vite 产物。加入双语 Storage、Assets 导入与回执、General 和 opt-in 宿主 Playwright。
- 发布检查包含专用 Alembic 脚本与共享 JS/CSS，排除业务运行文件。

## Verified

- Python 3.12 53 通过，含真实宿主 HTTP、真实 C:→D: 迁移和 C:/D: reference。独立 Python 3.11 52 通过，1 宿主跳过。MCP 两版本各 52 通过。
- Jest/RTL 37、Vue Chromium 9。build/typecheck/lint/check:proxy/ruff/uv lock/diff 检查通过。
- ComfyUI 0.45.0+33 / Frontend 1.59.1，使用已安装 comfyenv，独立 host base。浏览器预检、复制、迁移、设置、主题、双语、PNG 上传和像素工作流回读均通过。进程重启保留根路径与 Asset ID 关联。
- Registry ZIP（40）与 MCP Wheel（14）、sdist（20）通过；独立安装及 stdio 通过。
- 完整命令和验收状态见 docs/local-storage.md。

## Decisions

存储 API 需要直接本机单用户部署及 ASTROPHOTO_LOCAL_STORAGE=1。导入只接受管理员配置的 ASTROPHOTO_IMPORT_ROOTS。受管 copy 校验为 size_and_stat，Workspace 迁移为 SHA256。失败的目标暂存保留用于恢复和诊断。

## Blockers

物理外置盘拔插／盘符重映射、真实反向代理部署、非 Windows 真实宿主、既有 LoadImage 执行未运行。保持 NOT_RUN，不用模拟结果代替。受信权限边界不覆盖恶意本机特权进程。

## Next

如安排可安全拔插的测试设备，在独立宿主上补运行盘符变化与真实断电恢复。其余未覆盖场景及现有 IMAGE 路径问题查 docs/local-storage.md。

## 当前 Feature 文档评审

- `main@4c0cf4d` 加 Vue/Siril Bundle 等在途工作树。已更新 `.agents/features/local-storage-workspaces/` 至 v0.4。保留历史实测及 PARTIAL，现行宿主常规路径引用独立迁移运行。
- 先确认 Q-02 默认卷离线的写入策略，再确认 Q-01、Q-03、Q-04、Q-05 并向相应阶段传播。CASE-06 合并验证设备数据库、受管素材与 Siril 输出和 Cache 的存储边界。
- 本轮为文档工作，业务测试未执行。实际跨卷、重映射和迁移故障仍需独立验收。

## v0.5 用户批注

- D-04 默认 Windows 宿主账号下的 `.astrophoto`；D-05 确认整库搬家和真实素材复制纳管。整库流程与免配置可写能力仍属设计建议。
- 当前用户目录解析为 `C:\Users\48008`，实际默认根仅做只读检查。账号下的隔离目录已通过两次 `StorageRuntime.initialize`，退出后清理。全量复验尚未进行。
- 先评审 Q-06 本机体验及写入权限。CASE-07 追踪整库搬家，CASE-08 追踪真实素材复制。

## v0.7 架构与产品评审

- 按 `main@4c0cf4d` 与现行工作树核对启动、数据库、目录身份、迁移、导入、缓存、Siril 和 Vue 交互。PRD 映射 Q-01～32 及对应边界；本轮没有新增已确认选项。
- 先确认 Q-06/07/10/11 的首次使用，再评审 Q-12～15 的整库范围、切换与备份。Q-31/32 向工作流与素材专题传播。测试计划已追加追踪，待确认后写具体断言。
- 本轮为静态审查和文档校验，业务与宿主未复验。历史运行范围不变。
