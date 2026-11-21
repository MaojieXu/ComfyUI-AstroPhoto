# Siril 集成与 FITS AutoStretch · 测试报告

## 本轮执行

2026-11-21 为历史文档补建。本轮业务测试 `NOT_RUN`。下文引用历史实测和原有记录，当前工作树的验收结果待记录。

## 历史运行证据

**HIST-01**。真实 Windows 0.45.0 / 1.59.1 与 Siril 1.4.5。手工路径链 prompt `75def43a-cd64-4f59-a70d-97070a5c31c4`；双节点 `b4b3983a-e730-4d80-a85a-2bccdacbb914`，后一输入等于前一输出哈希且源未变化。另有旧实现 RGB、Horsehead 和 C:→D: 证据。

历史工作树有并行改动。原记录未给出的 diff、日志路径或逐项结果为未知。共用证据按各段实际范围引用。 [siril.md](../../../docs/siril.md) · [siril-autostretch.md](../../../.agents/notes/siril-autostretch.md) · [verification.md](../../../.agents/handoff/core/verification.md) · [verification.md](../../../.agents/handoff/core/verification.md)

| 用例 | 历史证据范围 | 本轮业务测试 |
| --- | --- | --- |
| CASE-01 | 历史真 CLI 与模拟版本拒绝证据 | NOT_RUN |
| CASE-02 | 历史真实浏览器与替身证据 | NOT_RUN |
| CASE-03 | 历史 Windows 真队列和串联有实证 | NOT_RUN |

## v0.4 既有 Bundle 证据对账

本轮只对账文档与已有原始产物，独立验收仍为 `NOT_RUN`。

| 已有 Run | 证据 | 适用范围 |
| --- | --- | --- |
| `frontend-vue-v1596-local-2026-11-21` | Windows ComfyUI 0.46.0 / Frontend 1.59.6 / Siril 1.4.5，经典与 Nodes 2.0 验证配置、候选、比较、正式单节点及重开。 | CASE-01～05 的主路径及发布资产的基础证据。 |
| `pi-close-2026-11-21` | 最终 Registry 解包实测两种画布，Prompt `ec1afec6-ed9c-4851-8961-4e64a48e140a` 和 `e9416392-6aff-41fc-9f9b-ff82c4d58bdf`。Astropy 记录输出 `(3,96,96)`、BITPIX = −32、OBJECT 保留。源 SHA-256 未变，输出与各自回执摘要一致。 | 无 WCS 的合成 RGB 单节点，覆盖 CASE-03/10 的部分检查。完整 Header、科学坐标、多 HDU、工作区迁移和资源故障仍待验。 |

[迁移运行报告](../archive/comfyui-frontend-stack-migration/06_TEST_REPORT.md) · [最终 Registry FITS 核对 JSON](../../../.artifact/frontend-migration/pi-close/registry-fits-verification.json)

## 待复验

在目标宿主复验两节点正式队列及资产重开，补 CASE-10 的科学样本差异、CASE-11 的预览到 Queue 输入变化、CASE-14 的默认目标故障和同身份迁移。真实 CLI、浏览器和故障注入分别记录。

[测试计划](05_TEST_PLAN.md) · [Close 草案](Close.md)
