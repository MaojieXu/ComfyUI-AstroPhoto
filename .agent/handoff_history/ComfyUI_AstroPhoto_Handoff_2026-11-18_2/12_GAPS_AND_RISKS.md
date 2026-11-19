# 缺口、冲突与风险

用户已采纳当前范围为项目基线。下表保留证据局限和后续验证问题。

| 顺位 | 问题 | 事实、影响及后续允许范围 |
|---|---|---|
| 证据 G1 | 历史会话覆盖 | 缺原 Web Chat 全部相关消息范围、部分附件字节、原始旧日志和逐窗最后检查点。可见 Codex 历史截面和 Handoff 不能证明最终全齐。详细清单在注入章。 |
| 证据 G2 | 原始需求证据 | 原 Storage FRD v1.1、工程指南 v1.0 及设备第三个 0 B 文件需定位或明确其现有等价替代。原始需求 AC 无法全部对账。 |
| 证据 G3 | 语义对账边界 | 源码清点和原文逐段索引已完成。重点由分域复核，尚无凭据声明每段及同号冲突已人工对账；原始范围、候选、无正文/未取得材料继续可查。 |
| 产品 | Assets frame 简化/未完整实装 | 当前资产浏览、导入和重定位存在。真实帧筛选、管理详情、通用素材拖图和完整 Capture Session 仍需对照产品目标。 |
| 产品 | Vue IMAGE 路径历史问题 | Drawing workflow 像素保存和上传行为保留。历史旧 IMAGE 绝对路径重复解析未纳入当前改动；普通 Vue IMAGE 不能借科学图走通声明解决。 |
| 运行 | Siril 与目标宿主 | 当前有静态/隔离验证，真实 Windows Siril 1.4.5、正式队列、外置盘、回收和资源竞争证据另按历史与 skip 记录。 |
| 运行 | 部署及发布 | 真实 Token 宿主、远端构建/安装/签收与发布未本轮验证。旧 release 命令不能视为本轮部署授权。 |
| 规划 | 采集、知识、记忆、画布桥、实验 | 保持待实现或局部基础能力。首用时需最新需求、隐私控制、公开接口和运行证据。 |

[Chat 来源与补件](15_LOCAL_CHAT_INTAKE.md) · [H0 采纳范围与证据边界](migration/H0_STATUS.json) · [历史冲突](11_HANDOFF_RECONCILIATION.md)


## 11-18_1 原章节全文

以下历史原文保留当时的定位、证据身份与结论。现行结论见本章前部及各分域复核。上版出站链接在原件中保留。

[历史原件](sources/local-chats/.agent/handoff_history/ComfyUI_AstroPhoto_Handoff_2026-11-18_1/12_GAPS_AND_RISKS.md)

```markdown
# 缺口与风险

在已观察的主要流程中未发现明显的产品功能故障。以下是测试工程失败、静态观察及待验证场景的审计优先级。历史文档差异依 D19 作为演进记录。

| 优先级 | 风险与证据 | 下一步及验收 |
|---|---|---|
| P0 | 当前默认 Jest 在加载 CSS 时报 unexpected token，即使类型检查通过仍有套件未执行。frontend/jest.config.cjs 只映射 host 与 Vue，Environment/Inspector 等新样式未处理 | 添加明确 CSS 测试映射，更新确已过期的 test assertions，运行原始命令且全部收集。保留临时探针与原始失败区别 |
| P1 | Inspector 已按产品要求支持编辑。实际 NodeView 调参、重置和候选预览同步尚缺直接回归；通用 Inspector 用例只覆盖 details 展示 | 在隔离宿主验证 Inspector 和画布双向同步、重置、单色 linked 禁用、宿主只读拒绝写入及参数变化后的预览刷新 |
| P1 | 静态观察表明冲突重试会重发旧表单，并行编辑时可能覆盖其他字段（EquipmentPage:155、OpticalTrainEditor:123） | 显示新旧差异，针对冲突字段明确合并。用两个不同字段的并发编辑重现 |
| P1 | 当前后端允许向光路关联归档设备。历史引用阻止删除，提示未区分当前与历史来源 | 保留现有语义。若涉及此场景，先复现具体问题，并核对引用提示是否足够 |
| P1 | 物理路径与处理入口信任部署的本机调用者，公开 status 暴露数据根。端口数据契约不一致，代理环境不能依赖本机 header | 核实可用环境，检查最小数据披露；在隔离的代理、跨源和本机测试覆盖可信限制。首期本机直接路径规则按有效决策保留 |
| P1 | Siril 大 FITS 全尺寸 display 分配、活跃 previews 无硬 cap、处理无 timeout、缓存耗尽/大图可能资源压力 | 量测可取消性、资源积压和空间错误。默认限制属于明确历史选择，变更前重新对齐需求 |
| P1 | 当前 host-runtime.mjs 按无 Assets、含观测地且无 Environment 的旧场景断言，并会写宿主设置；真实浏览器科学/设备/储存写链本轮未重跑 | 更新断言，在获授权的隔离宿主分别运行脚本，保持原用户实例和数据不变 |
| P1 | 多端口运行不同后端 Schema，但提供相同前端构件。光路版本和 Siril 路径的旧文档描述已过时 | 按现行 Schema 验证并同步文档，旧工作流兼容性按需检查 |
| P1 | Vue Drawing 正式 IMAGE 委托历史失败依然待当前宿主重验；端口健康不代表队列成功 | 在隔离宿主跑 PNG→LoadImage→PreviewImage 并保留失败证据 |
| P2 | 第二卷测试、非 Windows、狭窄 Sidebar/动态主题、复杂子图执行、网络/FITS 损坏矩阵仍不完整 | 按 [测试](06_TEST_COVERAGE_MATRIX.md) 扩样。不要将 mock 路径提升为真实系统边界 |
| P2 | Capture Session 主体、观测地 UI、校准记录、知识/记忆/试验等长期事项按范围推进 | 先确定规格和持久化策略；现能力状态保持可信 |
| P2 | 阻止未授权安装、包内容语义秘密/REMOTE 发行散列等未穷举 | 保持现有白名单与正常发行流程，校验构件和安装日志 |

新增可定位问题包括测试配置、Inspector 参数同步覆盖缺口、已归档设备新关联、多个宿主 Schema 差异及遗留工具脚本。更多文件/阶段异常详见 [防御矩阵](05_DEFENSIVE_PROGRAMMING_AUDIT.md)。
## 继承并复核的缺口

- P1 · frontend/src/components/VueExampleComponent.vue:56–72,87–105 上传处理仅等待 json()，未检 resp.ok 或返回 name。HTTP 拒绝但 JSON 可解析时，可能生成无效 temp 路径。serialization.test.ts 的模拟上传拒绝样本只测试 Promise rejection；缺 4xx/5xx JSON 和成功缺 name。该历史风险仍有效。
- P2 · .pre-commit-config.yaml 固定 Ruff v0.4.9 且含 --fix，与本轮实际 0.17.5 的手动只读检查不同；本轮未运行 hook 或自动格式化。
- P2 · 公共 PyPI 可用性的旧失败是历史证据；依据本轮测试无法确认远端发包状态。
- P2 · AssetsPage 的帧类型菜单只在未 ready 分支可见，frame 参数不参与真实资产列表。通用资产只登记基本文件信息，不能假装已有 Light/Dark/Flat 科学分类属性。
```
