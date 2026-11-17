# 数据、Memory、Knowledge 与实验

本章业务内容均为 **PLANNED**。当前只实现 `astrophoto/core/paths.py:10` 的数据根解析与 `core/config.py:19` 配置读取；无建库、ORM、迁移、模型注册、扫描、软件调用。导入无建目录副作用由 `tests/backend/test_core.py` 验证。完整需求见 02。

## 所有权和目录

默认 `~/.astrophoto/`，`ASTROPHOTO_HOME` 可覆盖为绝对路径。当前不创建该目录。未来 `databases/assets.db`、`databases/knowledge.db`、`databases/memory.db` 分库；大 FITS/视频在文件系统，数据库保存引用、指纹、元数据。CodeGraph 自己的 `.codegraph/codegraph.db` 与这些业务数据库完全不同。

Assets 保存设备、Optical Train、CaptureSession、Light/Dark/Flat/Bias/Dark Flat、Master、Target、Site 和可解释校准关联。保留原始 Header，分 observed/inferred/user_confirmed，不默认覆盖原图。VIIRS 辐亮度、SQM、Bortle、现场测量分别建模；位置查询须授权并核对数据许可。

SQLAlchemy 2/Alembic 尚非项目运行依赖；未来按域建 ORM/Service/Repository，按操作持有短 Session，不跨线程共享、不在长软件进程期间持有写事务。三库跨库原子性不是现有保证。备份业务事实与重建知识索引必须分开。

## Knowledge

Extension `astrophoto/knowledge/` 未来负责 LangChain 文档采集、清洗、分块、FTS5；可选 sqlite-vec、FastEmbed/ONNX、Reranker。MCP 只通过公开 API 检索，外部 Agent 综合回答。文档保留 URL、许可、标题/章节、软件版本、时间、指纹与 chunk ID。返回可追溯摘录，无来源不编造。

中文 tokenizer、Windows 二进制兼容、软件文档许可仍 UNKNOWN。无 Embedding 模型时应能用 FTS5。模型由 ComfyUI folder_paths 管理专用 astrophoto_embedding/astrophoto_reranker 类别，不与 Textual Inversion 混淆；这些目录尚未注册。检索资料是数据，不是覆盖工具权限的指令。

## User Memory

Memory 由 Extension 管理且独立于 Agent Harness；不是聊天日志、task-notes 或知识库。资产事实只引用 assets ID；memory 保存授权事件、反馈、偏好及证据，actor 区分 human/agent/system。`nodeCreated` 可能来自打开旧工作流，不能直接当人类新建动作。

生命周期：Capture → Normalize → Deduplicate → Consolidate → Validate → Recall → Refresh/Expire → Forget。显式偏好优先于推断；推断含场景、confidence、source/evidence、last_verified。用户能关闭采集、审阅、纠错、导出、删除；30 天是候选短期保留值而非已实现默认策略。多用户需要真实认证，不能信任任意 profile_id。

HOO/SHO/RGB 的饱和度、背景、星点、降噪等偏好必须区分场景，不能从 Agent 自己的参数尝试推导用户审美。精确位置、设备序列号不自动上传，不写入公共 SKILL.md。

## Software、科学数据与 Experiments

Siril 优先，PixInsight 随后；Registry 验证路径/版本/许可，Adapter 生成受限参数，Runner 管单操作进程、超时/取消/日志，ComfyUI 管 DAG。禁止自由 Agent shell。软件缺失应报告不可用，不能破坏已保存节点的类型识别。

IMAGE 是普通展示契约，PNG 示例不是 FITS 精度验收。ASTRO_ASSET/ASTRO_FRAME 是待原型的名称，缓存、序列化、科学元数据保留仍 UNKNOWN。SER/XISF/RAW/视频逐格式验证，不一概宣布支持。

Experiment/Trial 未来记录 experiment_id、trial_id、prompt_id、workflow snapshot/hash、Node Schema、软件版本、输入输出 Asset、参数、指标、耗时、错误及人工反馈。SNR/FWHM/背景梯度与审美评价分开；必须有预算、停止、取消、恢复、幂等及可复现性。外部 Harness 管 Subagent 策略，不在 MCP 增设 Agent Runtime。
