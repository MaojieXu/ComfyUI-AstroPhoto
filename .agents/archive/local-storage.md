---
task: local-storage
status: completed
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

## v0.8 决议回写

- 用户批准的选项已融合为 D-06～D-14，按盘配额新增 FR-08。剩余 Q-01、Q-10、Q-33～Q-35。素材的部分成功和批次生命周期归素材 Feature。
- 已只读核对目标 ComfyUI `a277b5b` 的临时生命周期。产品改为关闭清理 Cache 与未提交导入，未完成导入不跨重启续跑，已提交持久结果保留。
- 本次为文档更新。当前仅安排小数据同卷和故障模拟，真实跨卷、拔插及压力测试延期。

## v0.10 补录批注

- 对照磁盘上的 v0.9 与 Git 差异，确认 Q-01 下增加了「原地址自动清除已经牵走的」。已归并 D-15 并移出待选。工作区提交后按清单清理源副本，整库切换继续按 D-08。
- 现行 `_complete` 仍保留源，自动清源改造与同卷测试待开展。待选仅 Q-10、Q-33～Q-35。

## v1.0 文档交付

- 用户定稿的 D-16～22 已传播到 UX/原型、TECH、DEV、TEST PLAN、TEST REPORT、Close、索引及关联素材契约。D-15 继续有效。
- 本轮 HEAD `f84442b`，沿用既有源码披露，工作区属文档/原型更新，业务当前 PARTIAL。接续为交互评审与 Windows 卷/锁、宿主退出、资产组归属核实，实施后定稿 CASE-01～09 并执行同卷与故障验收。

## Pi 评审补记

- 按用户附件吸收启动锁、现行目录盘点、卷身份、重绑、作业重提、容量单位及生命周期差异。验收保留旧断言作用范围，列明需要替换的旧预期。
- D-15～22 继续有效。用户确认 Q-39 A、Q-40 B、Q-41 无配额用全部实际可用空间、Q-42 B、Q-43 退出清空 Cache，纳入 v1.1 / D-23～27。

## v1.1 代码实现

- 实现于 HEAD f84442b 的工作树。已贯通 DataRoots、卷预算、按量预检与清源、降级重绑和宿主 Cache 退出链路。保留当前并行素材库与 Siril 的正式输出登记契约。
- 后端 56 passed，2 个真实第二卷条件跳过。Chromium 存储组件 7 passed，Ruff、Vue typecheck、ESLint 和隔离 Vite 构建通过。真实 ComfyUI 生命周期证明非空 Cache 正常退出清空，以及停机搬家后使用原启动方式切根。真实隔离宿主浏览器 03-A/03-B 通过，脚本最后用 API 恢复默认并解除测试登记。最新全局 typecheck 发现并行范围内 SirilNodes 和 host/canvas 类型错误，存储范围验证通过。
- 交接本变更范围检查通过。全库结构检查受其他 Feature 在途目录及 `.artifact` 影响。后续硬件拔插与跨卷压力按 D-09 延期。

## v1.3 评审修复

- `main@f84442b` 加当前工作树。R-01～R-05 修复已落地，沿用全部已确认 PRD 决定。完整迁移提交时保存摘要，协调 catalog 决定中断后有效根，整库预检和执行共用只读盘点，存储快照可查缺件，迁移两端均受解绑保护。
- 五个 xfail 转正。定向后端与 HTTP 9 通过，全后端 118 通过 / 6 跳过，MCP 92 通过，存储 Chromium 7 通过，Ruff 和 Vue typecheck 通过。R-05 HTTP 测试通过 DELETE 解除登记并回读。命令和环境见 Feature 的 `06_TEST_REPORT.md` v1.3。
- 本轮交付完成，Feature 仍为 PARTIAL。接续 R-06～R-15，优先按 CASE-15 在隔离宿主测退出耗时和恢复，并复跑真实宿主 Storage。D-09 硬件延期不变。
