# 本地存储与工作区 · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## v0.4 证据对账

本次更新为文档对账，未追加执行。独立前端迁移运行 `frontend-vue-v1596-local-2026-11-21` 覆盖真实宿主常规设置和同卷迁移，Cache 清理用空夹具。修订冲突等属于该运行的组件与 HTTP 证据。第二卷测试在该运行中条件跳过。 [运行基线和结果](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md)

CASE-04 已定位到迁移切换事务前后的服务层故障注入，CASE-05 已定位到隔离目录重命名和重绑测试，物理拔插与当前宿主进程中断未取得证据。CASE-06 是跨设备、素材与 Siril 的组合验收，当前仅有分项入口。三项独立 Feature 复验均为 `NOT_RUN`。 [测试计划](05_TEST_PLAN.md)

## Windows 路径定向核验

`storage-windows-profile-2026-11-21`，Windows 当前账号，`main@4c0cf4d` 加现行工作树。使用 `uv run --frozen --no-sync python -` 运行内联探针。当前 `Path.home()` 与 `USERPROFILE` 同为 `C:\Users\48008`，默认路径解析正确。用该用户目录下的临时子目录作为显式根，执行两次 `StorageRuntime.initialize` 并关闭线程和数据库连接，快照均为 ready 且默认工作区 ID 一致，退出后临时根已清理。实际默认 Data Root 只读检查发现已有 manifest。此结果覆盖 CASE-01 的路径与初始化片段。真实 ComfyUI 宿主首启、整库搬家、真实素材纳管及全量测试仍为 `NOT_RUN`。

## 历史运行证据

**HIST-01**。历史 Windows comfyenv 0.45.0 / 1.59.1 的 `pnpm -C frontend test:storage-host` 记录 4 组通过。重启前后 workspace ID/root、mode、schema 与资产数一致，4 份物理副本 SHA-256 与源一致。真实第二卷测试有记录，拔插与其他平台未运行。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [local-storage.md](../../../docs/local-storage.md) · [equipment.md](../../../docs/equipment.md) · [storage-comfyui-frontend.md](../../../.agents/archive/storage-comfyui-frontend.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史双进程、故障注入与宿主证据 | NOT_RUN |
| CASE-02 | 历史跨卷与重启证据；物理重映射未验 | NOT_RUN |
| CASE-03 | 历史自动化与浏览器回执证据 | NOT_RUN |

## 待复验

先用隔离 Data Root 重跑首次启动、跨卷校验和中断恢复；再安排物理离线盘用例。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
