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
