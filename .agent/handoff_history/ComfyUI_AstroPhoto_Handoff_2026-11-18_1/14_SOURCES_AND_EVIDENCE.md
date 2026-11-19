# 证据索引、方法和边界

## 本地证据

| 证据 | 内容 |
|---|---|
| [源码账本](evidence/source-inventory.md) | 活跃源码、测试、工程配置和供应商构件逐文件 SHA 所属范围，说明核对级别。 [逐路径具名证据与清点限制](evidence/source-provenance.md)，[补充文件级复核](evidence/source-review.md) |
| [全部快照路径](evidence/repository-files.txt) / [SHA](evidence/source-hashes.json) | Git tracked + untracked（未排除文件）完整审计基线；另包含输入与被 ignore 的任务笔记 |
| [路由索引](evidence/routes.md) | 从当前 route registry 源码提取方法、路径、处理入口及成功响应，包括兼容拒绝路径 |
| [测试执行](06_TEST_COVERAGE_MATRIX.md) / [断言与用例](evidence/test-inventory.md) | 原始 pytest XML / Jest JSON / Chromium JUnit 和命令日志。静态断言摘录与本轮执行分离 |
| [需求输入](evidence/subagents/requirements.md) | 三套输入递归清单、SHA/重复、九张截图、两个 Siril 文档 diff；含子报告未通读的边界 |
| [后端](evidence/subagents/backend.md) | Router/Boot/SQLite/Workspace/Cache 分项，DDL、事务、路径/恢复 |
| [资产与设备](evidence/subagents/assets-equipment.md) | DTO、规格、当前配置、兼容 Revision、实际业务测试断言 |
| [Node/Siril](evidence/subagents/nodes-siril.md) | FITS/CLI/预览函数、端点与真实 CLI 的测试入口 |
| [前端](evidence/subagents/frontend.md) | React/Vue 真实入口、Inspector、vendor bridge、翻译与测试函数 |
| [MCP/构建](evidence/subagents/mcp-packaging.md) | 工具、网络及权限、协议、包内容、CI 与摘要 |

## 官方与历史事实来源

- 本机 ComfyUI 安装版本和四个活宿主的 /system_stats、/object_info、JS/CSS 产物 GET；见 [版本日志](evidence/versions.txt)。
- ComfyUI V3 入口和 Frontend host types 的当前依赖，参照项目 docs/react-sidebar.md 以及 vendor/comfyui/README.md 中的移植来源。
- 官方 Siril 1.4.5 下载出处和历史使用场景见项目 docs/siril.md:93。本轮执行安装现存二进制的 --version，并运行真实 CLI 测试。
- 11-16/17 历史交接、历史测试与截图用于区分演进。它们的计数不参与 11-18 本轮结果。设备共享链接尝试读取超时，已使用本地规格补充。
- 遇到新旧设计差异，以当前工作树为准。演进记录见 [对齐矩阵](11_HANDOFF_RECONCILIATION.md)，运行结论以原始测试记录为准。子报告里的「未运行」指只读子任务本身，不表示主审没有运行见证测试。

## 已知未完成的覆盖

输入目录清点、哈希和截图已完成。输入存在 81 个文件、62 个不同 SHA，旧全文汇编和副本较多。部分历史章节和原始长规格只做了关键决策交叉检查，非相同哈希的文本没有全部人工逐行语义核验。底层依赖/锁文件全依赖项、纯样式与 vendor 字段组合、生成 bundle 每行、reference 上游完整仓库不在语义审计覆盖内。文件覆盖账本是路径级核对，不能以哈希或机器提取代替人工判读。内部链接、快照差异和 Manifest 核对详见 [完整性](evidence/integrity.txt)。
