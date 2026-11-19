# 有效产品要求与决策

实现和测试状态分别在 [Feature 清单](04_COMPLETE_FEATURE_INVENTORY.md) 与 [测试](06_TEST_COVERAGE_MATRIX.md)。本页只界定产品行为。D 编号在 [对齐矩阵](11_HANDOFF_RECONCILIATION.md) 中可追踪到三个输入来源。

| ID | 有效决定 |
|---|---|
| D01 | ComfyUI V3 原生节点和原生 aiohttp 扩展，保留 vue-basic 的节点 ID、Widget ID、上传与工作流绘画像素。独立 MCP 走 HTTP。 |
| D02 | 只有 Nodes、Assets、Settings 三个主视图。语言和主题跟随 ComfyUI。观察地占位行已被当前会话明确要求移除，观测数据长期需求的后续范围仍可单独讨论。 |
| D03 | 使用本地数据根、默认及外置 Workspace、独立 Cache。默认引用，用户可选择复制。正式产物属于 Workspace，预览可重建并属于 Cache。不要写 ComfyUI 的全局目录设置。 |
| D04 | 引用资产原址和复制资产分开。来源授权目录是 Asset Import 的边界。已确认 Siril 在可信本机处理可用的导入根外绝对 FITS 路径。两条路径不共享相同授权策略。 |
| D05 | 设备类别为 Camera、主光学、光学配件、Filter 含 Passbands。可选未知规格允许留空。设备和光路详情使用紧凑摘要与可折叠分组。 |
| D06 | 设备和光路均不维护多份历史版本。光路保留单一配置、可保存未完成状态、关联设备和有序配件、多个滤镜。原始发布、选默认 Revision、由历史派生工作流已被替代；兼容数据保留与删除行为按当前实现核查。 |
| D07 | 设备与光路有编辑、归档和红色永久删除动作。删除应尊重真实引用、权限和并发，避免误删。旧 UI 中为启用按钮而自动删除关联的授权未发现。 |
| D08 | 科学流程首期使用 IMAGE_PATH，路径由 Source/Text Path 输出并供 AutoStretch 使用；正式结果依然是科学 FITS。更丰富科学类型是保留的长期目标。 |
| D09 | Siril 首期目标 1.4.5，使用 CLI 及 Settings 软件管理。AutoStretch 仅 shadowsclip、targetbg、linked 三个处理参数。内部 load、autostretch、save，保留输入及元数据，验证真实输出。 |
| D10 | 画布显示一个可折叠主预览，手工刷新，输入或参数变化可触发新预览。开 Inspector、缩放、平移、折叠、聚焦不应独立触发计算。全局「环境配置」管 PNG 分辨率，画布固定显示上限与正式 FITS 大小分开。 |
| D11 | Inspector 支持并排、分割滑杆、单图、平移缩放和焦点管理。用户本轮明确确认参数可编辑。Inspector 与画布共用当前节点的 shadowsclip、targetbg、linked，支持重置；宿主只读模式及单色输入的限制继续适用。旧交接的参数只读条款标为 OBSOLETE。本期不纳入 Trial 管理。 |
| D12 | CLI 输入/输出隔离、进程与文件失败要正确回执并保护原件。历史固定输入字节、PNG 大小、正式/候选 CLI timeout 和任务并发硬上限已被后续明确要求撤销。资源风险独立记录，不能默默恢复旧限制。 |
| D13 | MCP 仅提供能实际调用的 Tools，单独发行。设备读取需可信直连与有效 token。密码/token 不进入证据。本期无 MCP 设备写权限。 |
| D14 | 保留 Capture Session 管理和校准关联、更多科学格式与算法、厂商处理软件、知识检索、隐私可控记忆、实验/优化、33 个候选 Agent Skills 与 Agent 工作流长期目标。现 UIs 中的规划页与 API capability false 不等于完成。 |
| D15 | 现有 DB 非兼容版本应明确失败。开发基线可用于隔离新建，不自动清空既有用户数据。 |
| D16 | Nodes 收藏复用宿主收藏表；当前 AstroPhoto 页只展示可匹配本域节点，保留非本域条目。 |
| D17 | 当前未提交工作树、运行宿主 Schema、构件和测试命令分别取证；旧结果仅用于追溯。 |
| D18 | 创建设备与光路使用已复用的 Comfy 风格选择器，滤镜是可用集合、下拉支持多选。光路状态字段从 UI 移除。 |
| D19 | 用户确认以当前本地工作树实现为现行行为基线，可接受与旧 Chat 需求文档的设计偏差。差异用于追溯，判断缺陷须看现行行为、最新明确要求和实际证据。 |

Chat_Handoff、Last_Handoff 与 Original_request 用于追溯历史设计和长期范围。当前功能状态、行为边界和测试结论分别以当前源码与对应运行证据为准。
