# DEV 日志

## DEV-001 合并配置入口

2026-11-22。用户要求将 Settings 中的存储和环境配置合并为“配置”。沿用 storage 模块标识和素材导入跳转，配置页面同时显示预览分辨率和存储设置，中英文名称和说明同步。调整受影响组件与宿主脚本的入口定位。

基线 HEAD 为 1772bd5d12e2763212ff502e900ec981a6285700，加本次前端工作树变更。仓库另有既存修改。

局部验证：vue-tsc、ESLint、Vite 构建通过。AssetsLibrary 与 StorageSettings 浏览器组件测试 19 项通过。首次沙箱运行因浏览器缓存位置及本机网络限制失败，使用现有浏览器缓存并授权本机连接后重跑通过。真实宿主正式验收未执行。

## DEV-002 压缩预览设置

2026-11-22。预览分辨率移到配置页存储内容之后，选择框与保存按钮并排，保留说明及反馈。类型检查和构建通过。预览相关组件测试 3 项通过。完整 StorageSettings 组件运行 5 项通过、1 项失败，失败位于独立存储页面的工作区列表文本断言，期望 Local，实际包含 Local 及默认状态和路径。正式宿主验收未执行。

## DEV-003 预览分辨率单行配置

2026-11-22。按用户要求仅显示预览分辨率标签及选择框，选择后自动保存。保存失败恢复原值并显示错误，版本冲突可刷新后重新选择。同步组件测试及宿主测试的保存步骤。vue-tsc、构建通过，预览组件测试 3 项通过。正式宿主验收未执行。

## DEV-004 精简存储设置

2026-11-22 · FR-07、AC-14、TC-006。配置页提供只读数据根与工作区状态、默认导入方式及新增工作区。新增按 SQLite 登记顺序追加。已有卷配额只读。移除搬家、迁移、工作区行操作和缓存设置，以及退出清理提示。已有维护接口供兼容。导入方式更新共享设置版本后，预览控件重新读取当前设置。

局部验证：Chromium 组件两组 18 项、存储 HTTP 集成 5 项、类型检查、前端及 Python lint、构建和构件检查通过。ComfyUI 0.46.0 隔离宿主验证新增两个工作区、重载后顺序、原默认工作区和预览分辨率保存。HTTP 用例中的旧 `workspace/` 路径已改为从登记解析。联合 Feature 的正式验收待 TEST_REPORT。

## DEV-005 移除数据根目录展示

2026-11-22。按用户要求从配置页面移除数据根路径、来源和数据库状态的展示区。类型检查及前端构建通过。真实宿主正式验收未执行。 [FR-07、AC-15](01_PRD.md#fr-07-精简存储设置) · [TC-007](05_TEST_PLAN.md#tc-007-配置页数据根展示)

## DEV-006 存储位置命名

2026-11-22。配置与素材界面的用户可见工作区名称改为存储位置，新增表单使用位置名称和本机绝对路径。同步英文及关联组件、宿主脚本文案定位。类型检查、构建及相关浏览器组件测试 18 项通过。正式宿主验收未执行。

## DEV-010 存储位置管理与自动切换（原 DEV-006）

2026-11-22。用户确认按位置设置容量上限、支持不限额及顺序调整，按顺序自动选择可写位置。位置菜单支持编辑名称和容量、上移下移及移除登记，排序提供拖动或等效操作。任务受理后固定目标，回执显示实际位置。受管素材、处理输出及在途预留参与容量计算，另检查所在磁盘实际剩余空间。

该段为当时的源码核对：工作区按登记顺序读取，容量按物理卷统计，导入及 Siril 输出分别选取默认工作区。现有卷级额度不能直接等同位置限额，需协调并发预留、导入预检和任务受理、正式输出及历史配置兼容。本项开发 in_progress，尚未改动实现或执行验证。

## DEV-007 设备页面命名

2026-11-22。按用户要求将设备入口和页面命名为「设备」，标签使用「我的设备」和「设备组合」，同步中英文操作、错误提示和素材字段。相关定位测试和宿主脚本文案同步。关联 FR-01、AC-16、TC-009。

局部验证：类型检查和前端构建通过，设备界面浏览器组件测试 10 项通过。正式宿主验收待 TEST_REPORT。

## DEV-011 存储位置重命名与移除入口（原 DEV-007）

2026-11-22。前端接入现有位置重命名和移除登记 API，移除前展示位置名称、路径及文件保留说明，默认位置的移除按钮禁用。后端既有引用及活动任务保护继续生效。类型检查、构建和 StorageSettings 组件测试 6 项通过。新增入口的真实宿主操作、排序、按位置限额和自动切换仍待实现与验证。

## DEV-008 设备表单基础与高级分组

2026-11-22。四类设备表单按 FR-01 将名称及成像关键参数放在基础区，其他共有字段和专业规格放在默认折叠的高级区。相机读出模式和滤镜通带保留在高级区。详情继续展示各类全部规格，校验高级字段时展开高级区。同步组件和宿主脚本。关联 AC-17、TC-010。正式宿主验收待 TEST_REPORT。

局部验证：前端类型检查、lint、构建及构件检查通过，设备组件浏览器测试 16 项通过，包括四类分组、高级字段提交错误与折叠通带必填校验。正式宿主验收未执行。

## DEV-012 存储位置策略初版（原 DEV-008）

2026-11-22。新增版本校验的存储位置顺序和单位置额度接口及状态字段；配置页接入上移、下移和容量编辑菜单。导入预检按顺序选择位置，并将目标保存到预检和操作计划；Siril 正式处理开始时按顺序选取。素材预检显示选中的位置。旧配置以原默认位置优先，显式旧导入模式保留原目标语义。

验证：存储后端既有测试 34 passed、2 skipped；新增位置额度/预留和导入目标测试 2 passed，HTTP 接口测试 1 passed；前端现有组件测试 18 passed，新增排序组件测试 1 passed；Ruff 和前端构建通过。前端类型检查当前被工作树中的 EquipmentForm.tsx / EquipmentDetails.tsx 错误阻断，这些文件非本批修改。

未完成：任务排队阶段的并发容量预留、自动切换失败原因的界面呈现、正式输出与位置上限的完整回归、真实宿主的前后端联合验证。当前实现仅为开发中增量，不能视为完整交付。

### DEV-012 补充核对

前端类型检查后续重跑通过，构建和 Ruff 通过。新增排序菜单组件用例 1 项通过。位置顺序、限额、预检冻结和 HTTP 接口定向测试共 3 项通过；提交操作前新增位置容量复核。导入预检展示选中的位置，无可用位置时显示后端返回的逐项原因。仍需解决排队任务并发容量预留，并完成真实宿主联调及正式输出边界复核。

## DEV-009 隐藏导入策略摘要

2026-11-22。素材导入页隐藏继承的导入策略和首选存储位置摘要，保留存储设置入口。导入仍读取当前配置并校验版本。前端类型检查、构建和素材库组件测试 12 项通过。正式宿主验收待 TEST_REPORT。关联 TC-011。

## DEV-013 存储位置菜单与状态点（原 DEV-009）

2026-11-22。将路径放入每个位置右上角菜单，默认列表隐藏路径；名称、容量、顺序和移除操作保留在同一菜单。按用户原文将在线与离线状态点均设为红色。类型检查、构建及 7 项存储组件测试通过，新增路径隐藏与展开断言通过。宿主验收待执行。排序、限额和自动切换的剩余并发问题仍按 DEV-012 跟踪。

## 记录核对 · 本聊天

本聊天的 Feature 初始化与存储、数据库范围见索引和 PRD；隔离前端预览使用 `.artifact/frontend-preview`，启动时宿主 input、output、temp、user 路径及 stdout/stderr 日志由预览启动配置指定。存储设置精简见 DEV-004；数据根展示移除及 PRD 同步见 DEV-005；设备命名见 DEV-007；设备表单分组见 DEV-008；导入策略摘要隐藏见 DEV-009。DEV-001～003、DEV-006、DEV-010～013 含其他工作树并发记录，保留原执行证据。设备命名的局部验证已移回 DEV-007。重复编号整理时原 DEV-006 / DEV-007 / DEV-008 的存储位置条目分别改为 DEV-010 / DEV-011 / DEV-012，原 DEV-009 存储位置菜单条目改为 DEV-013，原 TC-008 排序、TC-009 并发及 TC-010 菜单用例分别改为 TC-012 / TC-013 / TC-014。

## DEV-014 存储位置状态颜色

2026-11-22。根据用户修订，将存储位置在线状态点改为绿色，离线状态点保持红色。该决定更新 DEV-013 的颜色要求，关联 TC-014。前端构建和差异空白检查通过，真实宿主验收待执行。

## DEV-015 存储位置拖动与菜单

2026-11-22。增加存储位置拖动手柄，拖放后通过现有策略接口保存顺序，并保留菜单中的上移下移供键盘操作。菜单按钮改为紧凑列表，路径折叠到“查看路径”。类型检查、构建与 8 项存储组件测试通过，其中包含拖放提交与路径展开检查。真实宿主拖动、窄屏和触屏行为待验。排序和容量策略的并发问题继续按 DEV-012 跟踪。

## DEV-020 单张与批量导入

2026-11-22。素材列表提供单张与批量入口；单张文件选择替换原选择并禁止一次提交多个文件，Reference 路径预检发现多文件时阻止确认。批量保留多选与文件夹选择，分类和项目统一应用到本次选择。沿用存储策略、预检、草稿保护及提交过程。关联 FR-03、AC-19、TC-020。正式宿主验收待 TEST_REPORT。

局部验证：类型检查、lint、构建及构件检查通过，素材库浏览器组件测试 15 项通过，覆盖单张替换、Reference 多文件阻止、批量分类及项目提交。正式宿主验收未执行。

## DEV-021 存储位置目录选择

2026-11-22。新增受信本机目录浏览接口与配置页选择面板，允许进入目录、返回上级、选择并填入路径或取消。登记沿用原有路径校验。前端类型检查、lint、构建、目录选择组件检查，后端 Ruff 及隔离 HTTP 授权/路径测试通过。真实宿主界面和其他操作系统尚未验证。现有宿主需重启加载新增接口。

## DEV-022 导入入口直接选择文件

2026-11-22。复制模式点击单张或批量入口直接触发相应文件选择器，进入导入页后仍可重新选择。登记模式进入服务端路径输入，浏览器文件选择不提供可登记的服务端绝对路径。关联 FR-03、AC-19、TC-020。类型检查、lint、构建及素材库组件测试 15 项通过，测试检查选择器触发。真实宿主系统选择器行为待验收。

## DEV-023 存储位置表单按钮布局

2026-11-22。选择文件夹与保存按钮置于同一行，目录选择面板在按钮下方展开。前端构建及文件夹选择组件检查通过。真实宿主和窄侧栏布局待验。

## DEV-030 素材标签顺序

2026-11-22。素材页标签调整为「全部素材」「项目」从左到右，沿用项目默认选中和原有切换行为。前端构建及素材库组件测试 15 项通过，含顺序及方向键焦点检查。正式宿主验收待 TEST_REPORT。关联 FR-03、TC-030。

## DEV-031 跨磁盘批量登记存储位置

2026-11-22。用户明确选择批量登记存储目标，文件夹面板可跨本地磁盘累计多个目录，每个目录按现有 API 登记为独立存储位置。默认名称取目录名，成功项从列表移除，遇到失败停止并保留余项供重试。登记要求空目录。类型检查、lint、构建及 10 项存储组件测试通过，其中包含跨磁盘选择及部分失败重试的模拟。真实双磁盘宿主未验，批量登记不表示并行导入或 I/O 加速。

## DEV-040 移除素材顶部更多操作

2026-11-22。移除全部素材顶部更多操作菜单、正式产物收录表单和 Agent 审批页面。选中素材后的集合创建入口保留。素材审批的现有 MCP 工具只能读取状态，Agent 内审批决策能力待设计和实现，见 Q-03。类型检查、lint、构建及素材库组件测试 15 项通过，MCP 素材工具测试 25 项通过。正式宿主验收待 TEST_REPORT。关联 FR-03、FR-04、TC-040。

## DEV-041 文件夹选择弹窗

2026-11-22。现有受信本机目录浏览改为模态弹窗，提供磁盘入口、可点击面包屑、上一级、当前路径和跨位置选择列表。保留单目录填入、批量登记和失败重试。类型检查、lint、构建及 10 项存储组件测试通过，包含面包屑导航和跨磁盘选择。真实宿主、窄屏及其他操作系统待验。

## DEV-050 项目添加已有素材

2026-11-22。项目详情新增搜索、多选已登记素材的表单，使用现有搜索和侧栏样式。直接关联或集合包含的素材显示已在项目中。新增浏览器侧批量关联接口，单事务校验并建立缺失关联，重复提交保留现有位置。成功后刷新项目，失败保留选择。类型检查、前端 lint、构建、Ruff、素材组件测试 16 项及针对事务与重复处理的 API 集成测试 1 项通过。真实宿主验收待 TEST_REPORT。关联 FR-03、AC-20、TC-050。

## DEV-051 素材源路径浏览

2026-11-22。扩展受信本机目录浏览接口，按需返回普通文件；引用导入增加后端文件浏览弹窗，单张选文件，批量可选文件或目录，保留手动输入及预检路径校验。类型检查、lint、构建、Ruff、目录浏览 HTTP 测试、既有导入 HTTP 测试及浏览器组件定向测试通过。当前预览后端仍为旧进程，真实宿主完整链路待验证。关联 FR-03、TC-051。

## DEV-060 项目文件夹树内管理

2026-11-22。项目根文件夹在树内输入创建，每个项目文件夹的菜单支持新建子文件夹、重命名和删除，回车保存、Esc 取消。删除使用现有确认与关联保护，保留文件；校准库沿用现有文件夹入口，创建项目的模板保留。类型检查、lint、构建与素材库组件测试 18 项通过，涵盖根与子文件夹创建、重命名和删除。真实宿主验收待 TEST_REPORT。关联 FR-03、AC-21、TC-060。

## DEV-070 项目文件树交互

2026-11-22。选中文件夹后工具栏新建在其下创建子文件夹；项目根目录按钮清除选择并接收拖放。右键打开文件夹现有操作菜单；拖放文件夹或已有素材使用现有接口，前端拒绝文件夹移入自身、后代、同父级或跨项目，后端沿用循环校验。素材库组件测试 20 项通过，覆盖右键、选中创建、移动到文件夹及根和禁止循环；类型检查、lint、构建通过。组件测试初次受沙箱网络限制失败，授权重跑通过。正式宿主验收待 TEST_REPORT。关联 FR-03、AC-22、TC-070。

## DEV-052 Windows 原生路径选择

2026-11-22。新增受信本机原生选择接口，以 Windows Forms 选择文件或文件夹；限制同时一个窗口，处理取消、忙碌及不可用，网页选择保留为备选。素材引用与存储位置新增原生入口，路径仍由原业务流程验证。类型检查、lint、前端构建、Ruff 和模拟子进程的 HTTP 授权、选择、取消、并发测试通过；真实 Windows 窗口、焦点和宿主联调未验证，需重启 8188 宿主加载代码。关联 TC-052。

## DEV-080 设置首页入口整理

2026-11-22。设置首页按设备、软件管理、配置排序，移除知识库、用户记忆与隐私、Agent 上下文与 MCP、系统状态入口。前端类型检查和构建通过；真实宿主验收未执行。关联 AC-23、TC-080。

### DEV-052 宿主验证补充

8188 重启后浏览接口返回 200；对原生 file 和 folder 分别发起真实 HTTP 请求，子进程保持运行，但自动化桌面窗口清单未发现可操作窗口，无法验证实际选择及返回路径。为清理悬挂请求结束了两次测试子进程，接口随后返回 unavailable；这不是用户取消或自然失败的证据。原生窗口是否显示及焦点原因仍待核实。

## DEV-090 项目统一树

2026-11-22。项目作为可独立展开的树根，项目菜单和右键提供已有素材、根文件夹与编辑入口；项目行作为根级拖放目标。搜索支持项目、文件夹、已关联素材及祖先路径，保留项目范围内拖放保护。项目展开箭头复用 DisclosureChevron 和文件夹现有样式。素材组件测试 21 项通过；类型检查、lint 和构建通过；真实宿主验收待 TEST_REPORT。关联 AC-24、TC-090。

## DEV-053 移除存储位置批量列表

2026-11-22。根据用户要求，移除存储位置网页选择器的批量列表、批量登记及相关样式；每次选择一个目录并填入表单，多个位置仍可逐个添加。前端类型检查、构建和存储设置 Chromium 组件测试 9 项通过；真实宿主检查待执行。关联 TC-041。

## DEV-091 项目拖放提示精简

2026-11-22。项目文件夹及素材拖放成功后刷新树，不再显示“已保存虚拟位置”提示；失败反馈保留。前端构建通过，正式宿主验收未执行。关联 TC-090。

### DEV-052 原生窗口可见性复核

Win32 枚举确认旧目录对话框已创建，所属窗体隐藏且无任务栏入口，焦点留在其他应用。保持所属窗体可见、置顶并提供 AstroPhoto 任务栏入口后，在 8188 重启复测，直接操作真实文件窗口选择 README.md 和目录窗口选择 Desktop，两个 HTTP 响应均为 selected，绝对路径核对通过。后台触发时键盘焦点仍可能留在原应用。此次检查覆盖后端触发至原生窗口返回，未执行素材导入。

## DEV-100 宿主通知复用

2026-11-22。新增宿主通知轻量适配，支持新版 success/error/warning/info 与旧版 add，失败或不可用时保留页内回退。迁移节点创建、画布与收藏错误、素材画布/常规保存、项目拖放一般错误、目录操作一般错误及设备操作成功与简单动作错误。表单、冲突、详细错误、批量结果及重试保留；不恢复拖放成功提示。前端类型检查、lint、构建及素材、设备、节点组件测试 49 项通过；组件测试覆盖新版/旧版/不可用适配及节点调用。新增节点测试首次因完整文案比断言更长而失败，修正断言后通过。真实宿主验收待 TEST_REPORT。关联 AC-25、TC-100。

## DEV-101 扩大宿主提醒覆盖

2026-11-22。扩展共享素材、设备、存储及通用反馈组件，导入校验、配置冲突、Siril 操作和目录加载、FITS 与绘图恢复错误、设备引用警告接入宿主通知；需要重试、字段位置、批量详情的内容继续原位显示。相同通知同一微任务去重，宿主不可用仍保留页内提示。五组组件测试 65 项通过；类型检查、lint 与构建通过，真实宿主验收待执行。关联 AC-25、TC-100。

## DEV-054 非空目录创建存储位置

2026-11-22。存储位置表单只显示‘选择文件夹’，优先系统窗口并在不可用时回退网页浏览。选择非空目录时登记其下的 AstroPhoto 子目录，子目录已有内容时保留并拒绝登记。后端定向测试 2 项、前端组件测试 9 项及构建通过。正式宿主验收待执行。关联 TC-054。

## DEV-055 配置项紧凑布局

2026-11-22。默认素材导入方式改用宿主风格下拉选择，选项说明复制行为；预览分辨率行收紧间距并保留自动保存。前端类型检查、构建和存储设置组件测试 9 项通过，真实宿主视觉验收待执行。关联 TC-055。

## DEV-056 配置项与页面标题调整

2026-11-22。默认素材导入方式恢复紧凑单选组，保留两种方式说明及保存反馈；预览分辨率缩小控件并支持窄侧栏换行。配置和软件管理标题与返回按钮同行，复用设备页标题布局。真实宿主视觉验收待执行。关联 TC-055。

## DEV-110 删除位置并迁移至已有位置

2026-11-22。配置页保护最后一个位置；用户从其余在线位置中选择目的地，确认后通过位置删除接口提交迁移。后端检查版本、活动任务、容量和目标文件冲突，复制并校验受管文件与正式输出，在事务内更新素材位置与迁移记录。清理已核对的受管副本后移除位置登记。删除默认位置时将默认设置指向所选目标。外部引用、原始采集文件、未登记文件以及项目与素材的关联保留。可恢复中断沿用同一目标继续；提交前遇到永久冲突时保留原绑定并回收已核对的本次副本。

开发自检使用临时目录、SQLite 和 aiohttp 测试服务，覆盖移除 Local、目标路径读取、重启、项目成员与产物回执、同名文件和限额保护、复制中途空间不足与校验失败。存储删除相关后端与 HTTP 检查共 6 项通过。Chromium 存储组件 11 项通过，前端类型检查、lint 和构建通过。本次没有对用户正在使用的位置执行迁移。关联 FR-05～07、AC-26、TC-110。

## DEV-057 项目菜单样式与关闭交互

2026-11-22。项目及文件夹菜单采用宿主弹出层的颜色、圆角和悬停样式；点击菜单外或打开其他菜单时关闭，保留 Escape、菜单操作和右键入口。前端构建与类型检查通过，真实宿主视觉验收待执行。关联 TC-090。

## DEV-058 统一操作菜单关闭行为

2026-11-22。检查前端菜单后，素材及集合的操作菜单改为宿主风格弹出菜单；存储位置菜单统一配色。上述菜单支持点击外部与 Escape 关闭，选择存储操作后关闭菜单，项目和文件夹菜单继续支持原有右键和操作。前端构建、类型检查及素材和存储组件测试通过，真实宿主视觉验收待执行。关联 TC-090。

## DEV-111 新增存储位置的两次路径诊断

2026-11-22，关联 FR-07、AC-14、AC-25、TC-111。两次操作均发生在「设置 → 配置 → 新增存储位置」，属于路径登记，与 DEV-110 删除位置时迁移数据是两个入口。

| 现场资料 | 核对结果 |
| --- | --- |
| 第一次截图（含本机路径，原件留存本地）显示 STORAGE_PATH_CONFLICT，字段可见前缀为 %USERPROFILE%\Desktop。 | 预览的数据根位于桌面下的 Workspace\ComfyUI-AstroPhoto\.artifact\frontend-preview\astrophoto。若当时选的是桌面本身，它包含数据根和 Local。后端先校验所选目录，再判断是否在非空目录中使用 AstroPhoto 子目录，因此会先报重叠。截图没有显示完整路径，当次请求体也未取证。 |
| [第二次截图](assets/observations/storage-drive-root.png)显示 INVALID_STORAGE_PATH。随后只读查看 8188 表单，位置名称为「桌面」，本机绝对路径为 C:\。 | 实际字段是磁盘根。checked_path 在检查路径与父目录相同时拒绝该路径；更改显示名称不会改变校验对象。聊天中举例的 Desktop\AstroPhoto-Materials 是独立子目录方案，没有代用户创建或登记，成功结果待验证。 |
| 两张截图各出现三条相同的宿主通知。 | 截图证明通知叠加；没有对应的请求次数和事件记录，尚不能判定重复提交、重复渲染或多次独立操作。建议卷根提示「不能选择整个磁盘，请选择盘内的文件夹」，作为待评估文案记录。上述两次诊断均未修改业务代码。 |

源码入口：[登记顺序](../../../../astrophoto/storage/locations.py)、[路径校验](../../../../astrophoto/storage/paths.py)、[存储错误提示](../../../../frontend/src/features/storage/StorageError.vue)。

### DEV-057 / DEV-058 验证补充

开发自检针对当前未提交工作树、HEAD 1772bd5 执行。前端 build 和 typecheck 通过；AssetsLibrary.test.ts 与 StorageSettings.test.ts 共 35 项 Chromium 组件测试通过，覆盖素材菜单外部点击及 Escape、项目与文件夹菜单操作和存储设置交互。随后针对存储位置菜单的外部点击关闭补充断言，定向测试 1 项通过。正式 8188 宿主视觉及跨页面交互验收仍待 TEST_REPORT。


## DEV-112 右侧任务进度接入核查

2026-11-22。根据用户要求核查当前宿主 ComfyUI 0.46.0 的已安装前端包 1.59.6，build-manifest 的提交为 c62d747f378e0fa277cbb5137bffaf282598c64c。读取包内 app-CfkZixD5.js.map、GraphView-Dh85FLak.js.map 和 sidebarTabStore-62FmsE9-.js.map 的 sourcesContent。RightSidePanel.vue 的 tabs 列表与模板内容固定由宿主生成，rightSidePanelStore.ts 的标签类型固定；未发现向 Workflow Overview 注册扩展标签或内容的公开挂载接口。sidebarTabStore 注册的扩展进入宿主侧栏，LiteGraphCanvasSplitterOverlay.vue 根据 Comfy.Sidebar.Location 将侧栏和属性面板布置在相反两侧；调整该设置会改变现有整体布局。

技术上可针对当前 DOM 结构注入自建内容，但该方式依赖宿主内部结构与生命周期，不能等同于宿主支持的扩展点，宿主更新、重新挂载和布局变化需要额外维护。本次未选择此方案，也未更改用户布局。素材导入已有 operation_id 和 processed/total 回执，OperationProgress.vue 轮询；位置删除迁移当前请求等待迁移完成后返回，因此要实现实时统一进度还需设计可及时发现任务的接口和任务恢复。未执行前端或迁移测试，没有修改代码或运行用户数据迁移。关联 AC-27、TC-112。

## DEV-113 子帧分组和多盘直写

2026-11-22。关联 FR-03、FR-05、FR-06、AC-28、TC-113。浏览器复制导入改为先提交清单，再逐帧流式写目标卷。整组单盘为默认；并行模式使用指定位置，按字节和物理设备分队列，提交时再核对工作区和卷的容量。每个已确认任务都有可查询的逐帧回执，跳过已成功条目的重试。SQLite 0003 增加组成员与原始顺序，旧素材保留相对路径。子帧列表可打开同一跨盘组，显示成员和各位置计数。位置迁移、单帧删除、正在使用的位置保护、项目插入及任务列表已接入。

开发自检使用隔离 Windows 工作区和回环 HTTP 服务。8 张 2048 × 2048 的 16-bit FITS 共 64.03 MiB；同一批文件按 ABBA 顺序比较两个实现，每种两次，计入预检、传输、发布和数据库完成。中转 2.404、2.452 秒，直写 1.729、2.205 秒。每轮逐文件核对 SHA-256。样本位于同一 C: 卷，可能命中系统缓存。1000 条、95,085 字节的清单预检返回 1000 项，耗时 0.129 秒，未产生正式文件。双物理 SSD 性能尚未测量。

另用 1000 张不同内容的 5760 字节 FITS 经真实回环 HTTP 倒序上传，至最后一帧提交并查询完成用时 195.106 秒。逐页核对素材库仍按原序返回 1000 个唯一 ID，单盘仅产生一个组目录，所有文件内容与原件一致，暂存区为空。该样本用于核对千帧完整性和逐帧开销。最终定向后端、API 和打包测试 27 项通过，Chromium 素材库与直传测试 27 项通过，前端类型、lint、构建和产物检查通过。Windows 长路径缩短、重启续传、取消停滞上传和迁移后单帧删除均有定向覆盖。


## DEV-114 侧栏全局任务进度

2026-11-22。Sidebar 根部挂载 TaskPanel，复用 DisclosureChevron 与宿主主题，支持折叠、展开、会话内隐藏结束任务及从直传任务进入恢复页。taskState 在页面会话中轮询并以任务 ID 去重 ComfyUI 成功、失败和部分失败通知；任务详情和重试留在面板，迁移页面的完成通知按同一 ID 去重。素材引用导入、浏览器直传与存储位置迁移共享任务列表。直传文件中断后，恢复页读取已有回执并让用户重新选择未完成原文件。

新增受信本机 GET /astrophoto/v1/storage/operations，读取全部进行中和最近 16 个终态任务，合并 storage_operations 与直传任务回执，不扫描存储目录；保留现有同步删除位置 API 与迁移事务。迁移任务在删除请求尚未返回时即可查询，完成响应附 operation_id。导入按文件计数，位置删除迁移按受管对象组计数；未实现字节级文件内进度。展开与清除状态仅存 sessionStorage，服务端任务记录不受影响。

开发自检：隔离 HTTP/SQLite 三项检查通过，覆盖 17 个直传活动任务不截断、删除位置请求进行中查询、迁移后素材读取及直传重启恢复。Chromium 侧栏、素材、配置和任务框组件共 42 项通过，覆盖跨页面返回直传恢复、完成通知、折叠恢复和清除；前端类型检查、lint、构建与相关 Python Ruff 通过。现有 8188 宿主有未保存工作流，未重启加载新后端接口；真实宿主及大文件、跨卷和正式验收未执行。关联 AC-27、TC-112。

## 独立审查交接摘要

本轮交接以 DEV-001～114、在册的局部检查及审查清单中的工作树为依据。DEV-110 覆盖位置删除迁移，DEV-113 覆盖分组和直写，DEV-114 覆盖侧栏任务。各节保留原执行范围与计数。此前的隔离回环、SQLite、Chromium、构建和打包均属于开发自检。

已知差异和待决项为 AC-03 的组合删除策略、Q-01 的 MCP 设备写入范围、Q-03 的 Agent 审批授权以及 TC-111 的通知重复来源。正式 8188 宿主、独立 stdio 联合链路及真实双 SSD 持续吞吐待验。下一步由用户在新窗口发起只读审查。审查结果回传后核对快照、处理发现，再进入正式验收。

## DEV-115 审查修复：审批超时与设备规则

来源为 [REVIEW-001](assets/reviews/REVIEW-001.txt)。原审查输入为基线 1772bd5 上清单锁定的 125 项，清单 SHA-256 为 7efc23fa4476ff357693d5505d7344a06dd78cbdac40c3f29674195aebf27cde。

- F-02 队列阻断已修复。待批提案 24 小时到期，旧版无到期字段的待批提案视为过期。过期后保留回执、拒绝应用、释放名额，MCP 接受 expired。回环 HTTP/FastMCP 集成 1 项通过，覆盖 100 条限额、到期后重新提案及无业务副作用。用户审批协议仍见 D-03、Q-03。
- D-02 重名保护已修复。设备和组合使用各自名称空间，在 SQLite 写事务内核对去除首尾空白、NFC 规范化及 Unicode 大小写折叠后的名称。旧重名档案可继续用原名编辑，归档仍保留名称。
- D-04 已归档组件保护已修复。组合允许保留或移除既有归档引用，禁止新增或重新加入。仅有旧快照时以默认快照或最新快照为对照。设备后端 19 项、HTTP 4 项通过。
- D-01/Q-02 的组合删除、恢复与名称规则，以及 Q-01 的设备 MCP 写入范围仍待决定。原报告的结论适用于原清单版本，审批状态、设备写入和归档引用修复属于审查后改动。

## DEV-116 审查修复：直传暂停、恢复及失败回执

已处理 REVIEW-001 的 F-01、F-03～F-06。未完成且无活动传输的直传显示已暂停，正在写入及未完成对账的字节仍受保护。新增 60 秒请求体空闲超时、启动对账与取消恢复。丢失可恢复字节时允许重新暂存。发布冲突和明确的容量或关联失败清理本次可验证的文件，保留异常或归属不明的文件供处理。已占用的数据库键按 OBJECT_CONFLICT 返回。目标已移除时提示重新预检，暂停及取消回执保持可用错误信息。

21 项直传及存储定向后端/HTTP 测试、29 项素材与任务 Chromium 测试通过，前端类型检查、lint、构建、产物检查和范围内 Python Ruff 通过。3 项 Registry 打包检查通过。Q-01～Q-03 未定，AC-03 和 AC-07 待相应决策。保留原审查清单和原报告。修复后代码以 [修复输入清单](REMEDIATION_INPUTS.json) 识别，本节改动属于原独立审查之后的开发自检。

## DEV-117 设备 CRUD、组合删除及聊天内混合审批

实现 PRD v0.19 的 Q-01～Q-03、AC-03、AC-06～07。验证代码为基于 1772bd5 的当前未提交工作树。REVIEW-001 和已归档清单仍绑定其原始版本，本节增量待后续审查覆盖。

- Q-01 设备与组合 MCP CRUD 复用公开宿主 API。查询、写入和确认分别授权。删除通过原生聊天确认，直接 HTTP 写入凭据无法代替批准。FastMCP legacy 往返在真实回环 HTTP 上覆盖拒绝和批准。
- Q-02 新增 0004_deleted_trains。删除组合释放名称并保留旧配置与历史引用，普通列表和新关联排除该记录；旧素材仍显示原名。不允许恢复被删除组合，可恢复停用用归档。
- Q-03 混合计划读取 FITS 头、明确名称、路径线索和稳定业务 ID，匹配项目、设备/组合及兼容校准主帧。无法唯一确认的条目单列。已解析组冻结源指纹、目录记录版本、目标工作区和绑定；聊天原生确认通过专用凭据和摘要提交决定。覆盖现代 MCP InputRequiredResult 和 legacy elicitation，缺少能力时不执行。
- 用户批准后复用既有导入任务，已登记素材继续保留。绑定按素材事务提交，导入成功但绑定失败可仅重试绑定。绑定重试沿用原批准范围，不重新复制文件；目标版本或选项变化须重新确认相应绑定。
- 定向后端和 HTTP/MCP 集成 54 项通过，MCP 包工具和独立 stdio 53 项通过，设备与素材 Chromium 43 项通过，构件测试 8 项通过。类型检查、lint、Ruff、前端构建与产物检查通过。Windows 恢复夹具修正外部路径 normcase 后最终回归通过。
- 正式 8188 宿主、用户实际聊天客户端及真实双 SSD 吞吐待验。原生审批在受信本机客户端和进程隔离边界内生效，旧有单条提案状态查询保持兼容。

## DEV-118 复审修复：分组重试、校准差异、不完整组合及边界收敛

2026-11-22。来源为最新整体复审（基线 `1772bd5`，清单 SHA-256 `a410dcf1…a024`）的 N-01～N-08。用户确认口径：N-01 采用“重试回挂原批准”，N-02 采“聊天内批准等同既有 `confirmed` 差异确认”，N-02b 分开报告 `conflicts` 与 `unknown`。本批由获得用户授权的窗口直接实施，属审查后代码改动，REVIEW-001 与本次报告的覆盖范围以本节列出的文件为界。

### N-01 分组失败帧重试保持绑定（High）

- `astrophoto/assets/imports.py`：`retry_remaining` 在原作业键为 `agent-group:` 时把 `agent_approval_id` 写入新作业计划；`_record` 对带该标记的重试作业也累积 `_agent_asset_ids`。
- `astrophoto/storage/operations.py`：`run()` 在作业键为分组键**或**计划带 `agent_approval_id` 时调用 `after_import`。
- `astrophoto/assets/agent_imports.py`：新增 `_approval_id` / `_linked` / `_operations`；`status()` 合并原作业与重试作业的逐帧回执，按“每帧只计一次”推导 `remaining`，并返回 `retry_operations`；`after_import` 接受重试作业且仍校验原批准与请求；`retry_bindings` 遍历全部关联作业；`recover()` 对每个已批准分组的原作业与重试作业补绑定。
- 回归：`tests/integration/test_agent_imports.py::test_failed_frame_retry_keeps_the_group_binding`（一帧 `FILE_COPY_FAILED` → `partial` → 浏览器 `retry-remaining` → 组变 `completed`，两个素材均绑定原相机）。

### N-02 / N-02b 显式校准差异由聊天批准确认（Medium）

- `astrophoto/assets/agent_import_plan.py`：显式 `master_ids` 带差异或缺失字段时不再整体拒绝；`calibration["differences"]` 逐主帧分别给出 `conflicts` 与 `unknown`，随不可变组一起冻结并进入摘要。
- `astrophoto/assets/library.py`：`bind_imported_asset` 以 `confirmed=True` 调 `_assignment`，沿用既有“确认后写入”规则；非显式的自动匹配仍只接受无差异候选。
- `mcp/src/astrophoto_mcp/tools/agent_imports.py`：确认摘要新增 `calibration_differences` 与 `configuration_gaps`。
- 回归：`tests/backend/test_agent_import_plan.py::test_explicit_calibration_differences_are_reported_and_confirmed`、`::test_missing_calibration_cards_are_reported_separately_from_conflicts`；`tests/backend/test_agent_import_plan.py::test_no_unsafe_source_or_calibration_guess` 改为断言显式差异被记录。

### N-03 不完整组合不再判为冲突（Medium）

- `astrophoto/assets/agent_import_plan.py`：组合保存字段为空时记为 `missing`，字段非空且不一致才记 `conflict`；显式命名或指定 ID 的组合不再因空字段被丢弃，缺失项写入 `configuration_gaps` 并进入确认摘要；纯推导且只有空字段候选时报 `MATCH_INCOMPLETE`，纯冲突仍报 `MATCH_CONFLICT`；相机侧同理（空值不再触发冲突）；无组合线索时保持只绑定相机。
- 回归：`tests/backend/test_agent_import_plan.py::test_incomplete_optical_train_reports_missing_fields_instead_of_conflict`。

### N-04 启动导入的瞬时失败可重试（Low）

- `astrophoto/assets/agent_imports.py`：`_start_once` 对 `STORAGE_BUSY / WORKSPACE_OFFLINE / *_QUOTA_EXCEEDED / INSUFFICIENT_DISK_SPACE / STORAGE_PATH_UNWRITABLE` 及 `OSError` 写 `import_pending_error`（可重试）而非终态 `import_error`；成功启动时清除该标记；`status()` 返回 `approved` 并附 `{"retryable": true}`；`retry_bindings` 在该状态下重新触发启动。

### N-05 取消在目标位置消失后仍收敛（Low）

- `astrophoto/assets/direct_import.py`：取消时逐条目独立处理；`WORKSPACE_NOT_FOUND` 清 `writing/publish_stat`（无可回收字节），其他错误保留意图并记录；最终无条件把 `cancel_requested` 作业置为 `cancelled`。
- 回归：`tests/integration/test_direct_import.py::test_cancel_finishes_after_its_location_was_removed`。

### N-06 / N-07 / N-08 边界收敛

- `mcp/src/astrophoto_mcp/api/equipment.py`：新增 `safe_fields`，仅透传长度受限、字符受限且不含凭据的 `details.fields`；`api/library.py` 复用同一函数。重名等校验原因现可被 Agent 读取。
- `mcp/pyproject.toml`：显式声明 `mcp-types>=2.3,<3`（根 `uv.lock` 已同步）。
- `astrophoto/equipment/trains.py`：组合删除版本不符统一报 `REVISION_CONFLICT`；已删除记录的重放校验删除时版本（`row_version - 1`），陈旧版本仍报冲突。
- 回归：`mcp/tests/test_equipment.py::test_validation_reasons_reach_the_agent_without_leaking_credentials`；`tests/backend/test_equipment.py` 的墓碑与旧默认记录用例补充陈旧版本断言。

### 附带修复：无实质变化的移除不再递增设置版本

- `astrophoto/storage/locations.py`：`unregister_empty` 只在默认位置、顺序或额度实际变化时写 `settings.json`。此前每次移除位置都会递增设置版本，导致其他页面持有未变更版本时被误判为冲突；该问题由本次执行 `tests/integration/test_storage_api.py` 暴露（此前未运行该文件的全量用例）。

### 局部验证

`uv run pytest tests/backend tests/integration -q`：200 passed、6 skipped。其中新增 4 项用例（见上）；`tests/integration/test_library_mcp.py`、`tests/integration/test_agent_imports.py`、`tests/integration/test_direct_import.py`、`tests/integration/test_storage_api.py`、`tests/backend/test_equipment.py` 全部通过。`uv run --project mcp pytest mcp/tests/test_equipment.py -q`：16 passed。前端未改动。

未执行：真实 8188 宿主、真实 Agent 客户端、真实旧库副本升级、真实双 SSD；`js/main.js` 无需重建（前端无改动）。文档同步见下节。

### 文档、清单与验证记录同步

- `03_TECH.md` 新增“复审修复后的执行、重试与摘要契约（DEV-118）”。
- `01_PRD.md` §8 增加 Q-03 补充决定；分组与确认设计约束补充差异/缺项口径。
- `02_UXUI.md` 确认卡与任务框重试说明更新。
- `05_TEST_PLAN.md` 新增 TC-117-R1～R5、TC-112-R1、TC-114-R1、TC-014-R1。
- `docs/mcp.md` 更新聊天确认步骤、错误字段透传与 `ASTROPHOTO_TRUST_CHAT_APPROVALS` 的实际生效侧。
- 新增 [DEV_118_FIX_INPUTS.json](DEV_118_FIX_INPUTS.json)（25 项，基线 `1772bd5`）：记录修复后的文件与 SHA-256。原 `DEV_117_REVIEW_INPUTS.json` 与整体复审报告继续作为修复前快照，不覆盖本批改动。
- `00_FEATURE_INDEX.md` 记录 Review Gate 为“已修复待确认”，并注明原报告覆盖失效范围。

## DEV-119 TEST_PLAN 对齐与四路只读评审归并

2026-11-22，仅文档，无代码改动。用户要求把 `05_TEST_PLAN.md` 对齐 TEST_PLAN 规范并做最后一次评审。Main Agent 直接构建与收口计划；四个只读 `reviewer` 子代理各自先完整读取 `references/05-test-plan.md`（910 行）再工作，分别从需求追踪、自动化可执行性、异常边界与文档结构门禁四个角度审查。子代理不写文件，结论由 Main Agent 归并。

### 结构补齐

- 计划升至 v2.1：新增文档信息、测试目标/范围、策略与优先级、AC 覆盖矩阵、环境与命令、夹具、自动化映射、集成回归、Entry/Exit、风险、修订历史与 Open Decisions。
- 环境节补 Python 3.12、宿主 0.46.0/Frontend 1.59.6、FastMCP 4.2.0、pnpm/Playwright 版本与来源；补 `ASTROPHOTO_TEST_SECOND_VOLUME` 等 7 组环境变量、`node frontend/tests/host/assets-host.mjs` 入口与两阶段重启协议。
- 修正三处跨文件误引（`test_group_confirmation_comes_from_chat_elicitation` 在 `test_library_mcp.py`；`test_independent_approval_*` 与 `test_changed_preview_*` 在 `test_agent_imports.py`）。
- 恢复并补全 P0 用例 TC-115（AC-04/05），新增 TC-115-R1（FITS 头字段与字节摘要）。

### 评审归并的新增用例

| 编号 | 场景 | 依据 |
| --- | --- | --- |
| TC-118 | 预检失效两终态（`REVISION_CONFLICT` / `PREVIEW_EXPIRED`，零写入） | 仓库无 `PREVIEW_EXPIRED` 用例 |
| TC-119 | 批准后源变更 → 失败帧 → 重试仍用原批准 | 冻结只校验目标版本，源变更在复制时才失败 |
| TC-120 | 启动锁超时与同进程二次初始化 | `STORAGE_BUSY` 映射无断言 |
| TC-121 | 迁移崩溃点矩阵（复制后/发布后/root 切换后） | 计划原只写“重启后执行一次导入” |
| TC-122 | 组内跳过源的终态与计数 | 当前 skipped 且 remaining=0 仍为 `partial` |
| TC-123 | 重试被拒三分支（无失败帧/设置版本变/目标离线） | 三条失败侧均无 TC |
| TC-117-R6/R7、TC-114-R2、TC-113-R1、TC-116-R1～R3 | 组摘要、联合验收、组合删除新关联、拓扑退化、MCP 可用性、发布幂等、离线重定位 | AC-03/07/08/10/11/13/28 |

### 冗余与失效处理

- TC-002 并入 TC-001；TC-004 并入 TC-055；TC-005 并入 TC-001；TC-008 并入 TC-014；TC-015 并入 TC-012；TC-041 并入 TC-021/TC-054；TC-031 标 Obsolete（批量列表已由 DEV-053 移除）。编号与 DEV 关联保留，未直接删除。
- 移除无 PRD 依据的通过条件：TC-111 的通知条数改为观察项，错误码改为证据；新增 §13-9 讨论是否纳入 AC-25。

### 待确认（不阻断文档，阻断相应 RUN）

TC-122 的 skipped 终态、批准后主帧版本变化的处理（TECH 要求重新提案，当前实现记为 binding_failed）、AC-08 仍为 Proposed、旧库副本来源、pnpm 环境、真实客户端矩阵。见计划 §13。

### 验证

文档级检查：TC 标题 52 个唯一、无重复；所有 `TC-xxx` 引用均有对应标题或表格行；交叉引用文件与函数经子代理逐条核实。未执行任何测试，未改动代码。

## DEV-120 补齐 TEST_PLAN 新增用例并执行 RUN-001

2026-11-22，关联 TEST_PLAN v2.1→v2.2、TEST_REPORT RUN-001。按计划补齐自动化用例并本地执行；未改动产品代码。

### 新增用例（7）

| 文件::用例 | 覆盖 | 方式 |
| --- | --- | --- |
| `tests/integration/test_direct_import.py::test_preview_expiry_and_revision_conflict_leave_no_job` | TC-118 预检过期与设置版本变化均零写入 | 直接修改预览记录的 `expires`；提升设置版本 |
| `test_agent_imports.py::test_source_change_after_approval_keeps_the_frozen_fingerprint` | TC-119 批准绑定冻结指纹 | 在复制前改写源，复制阶段报 `SOURCE_CHANGED`；重试返回 `NO_RETRYABLE_FILES` |
| `test_agent_imports.py::test_retryable_start_failure_keeps_the_approval` | TC-117-R4 可重试启动 | 让 `import_assets` 抛 `INSUFFICIENT_DISK_SPACE`，再 `retry-bindings` 完成 |
| `test_agent_imports.py::test_group_plan_summary_and_unresolved_are_separate` | TC-117-R6 组摘要与未匹配分离 | 断言组内数量、项目、相机、校准缺省与 `unresolved` |
| `test_agent_imports.py::test_retry_rejects_completed_groups_and_changed_settings` | TC-123 重试被拒 | 已完成组 `NO_RETRYABLE_FILES`；设置版本变化 `REVISION_CONFLICT` |
| `tests/backend/test_storage_init.py::test_bootstrap_lock_timeout_and_restart_reuse_identity` | TC-120 启动锁超时与身份复用 | `Timeout` 映射 `STORAGE_BUSY`；二次启动身份一致、`created == []` |
| `tests/integration/test_photography_library.py::test_copy_import_preserves_fits_bytes_and_scientific_headers` | TC-115-R1 FITS 字节与头字段 | 复制导入后比对 SHA-256 与 9 个头字段 |

### 关键语义确认

- `SOURCE_CHANGED` 不在 `RETRYABLE_FAILURES`，源变更后不能沿用旧批准重试；正确路径是重新提案。计划 TC-119 已按此修订，避免把“重试成功”写成预期。
- 组内 `skipped` 且 `remaining == 0` 时状态仍为 `partial`；已作为产品待决项保留。

### 执行证据（RUN-001）

| 范围 | 结果 |
| --- | --- |
| `uv run pytest tests/backend tests/integration -q` | 207 passed, 6 skipped |
| `uv run --project mcp pytest mcp/tests -q` | 93 passed |
| `frontend/node_modules/.bin/vitest run --no-file-parallelism` | 109 passed / 16 files |

前端默认并行时 4 个文件动态导入失败，串行全量通过，记为环境问题（ENV-001），不计入产品失败。真实 8188 宿主、独立 stdio、真实客户端、0001 旧库、双 SSD 未执行，结论为 INCOMPLETE。

证据目录：[RUN-001](assets/test-runs/RUN-001/)。

## DEV-121 细化绑定期版本变化与跳过源口径（文档）

2026-11-22，仅文档，无代码改动。RUN-001 暴露两处口径只有一句话、难以判定，用户要求补完整并举例。

### 变更

| 文件 | 内容 |
| --- | --- |
| `03_TECH.md` | 新增“待确认口径：绑定期版本变化与已登记同源”：触发条件、两段时间线示例、阶段对照表、A/B/C 候选与影响、代码位置（`_bind`、`retry_bindings`、`import_reference` 跳过分支、`_agent_asset_ids`、`status`） |
| `01_PRD.md` | §8 增加 Q-04（待确认）与“已登记同源与固定版本”小节，用两帧示例说明当前结果与三个产品选项 |
| `05_TEST_PLAN.md` | v2.3：TC-117-C 补固定版本时间线与三种口径的预期；TC-122 补两帧示例、逐对象结果、当前断言与决策分支 |
| `06_TEST_REPORT.md` | 新增 6.1（SPEC-001 时间线）与 6.2（TC-122 计数与影响范围），保留 INCOMPLETE 结论 |

### 未决

- SPEC-001：A 补实现（绑定期版本变化作废批准）、B 只修订 TECH、C 保留重试并加提示。
- TC-122/PRD Q-04：A 维持并展示跳过明细、B 对已登记素材施加批准内容、C 单独的“应用到已有素材”确认。

未选择前不改变实现、测试断言与验收预期；选择后按 DEV 流程改代码/测试并更新本节与相关文档。

### 验证

文档级检查：新增章节锚点可解析；示例中的状态、计数与代码行为一致（`imported=1`、`skipped=1`、`remaining=0` → `partial`；绑定版本不符 → `binding_failed`）。未运行测试。

## DEV-122 落地 SPEC-001 C 与 Q-04 A

2026-11-22，关联 TEST_PLAN v2.4、RUN-002。用户确认：SPEC-001 选 C（保留重试并标记 `requires_new_approval`），Q-04 选 A（维持 `partial` 并返回跳过明细）。

### 代码

| 文件 | 变更 |
| --- | --- |
| `astrophoto/assets/agent_imports.py` | `status()` 在 `import_error == REVISION_CONFLICT` 或任一绑定失败且错误码为 `REVISION_CONFLICT` 时返回 `requires_new_approval: true`；字段按状态动态计算，不写入批准记录，重试成功后消失。读取关联作业的 `_skipped_asset_ids`，返回 `skipped_assets: [{asset_id, reason: "ALREADY_REGISTERED"}]`（去重、跨原作业与重试作业合并） |
| `astrophoto/assets/imports.py` | 登记模式跳过已存在源时，把既有素材 ID 写入回执 `_skipped_asset_ids`；仍不写入属性/项目/绑定 |

`retry_bindings` 未改：`binding_failed` 仍可重试；未引入新状态，MCP 的 `GROUP_STATES` 无需变更。

### 测试

- 新增 `test_agent_imports.py::test_binding_version_conflict_flags_new_approval_and_keeps_retry`：绑定首次冲突 → `binding_failed` + `requires_new_approval`，重试成功 → `completed` 且字段消失。
- `test_changed_preview_source_or_targets_require_new_approval` 增加启动期 `requires_new_approval` 断言。
- `test_approved_intent_recovers_after_restart_and_skips_existing_asset` 增加 `skipped_assets` 断言与既有素材属性不变的核对。

### RUN-002

| 命令 | 结果 |
| --- | --- |
| `uv run pytest tests/backend tests/integration -q` | 208 passed, 6 skipped |
| `uv run --project mcp pytest mcp/tests -q` | 93 passed |
| `frontend/node_modules/.bin/vitest run --no-file-parallelism` | 109 passed / 16 files |

证据：[RUN-002](assets/test-runs/RUN-002/)。真实宿主/客户端/旧库/双 SSD 仍未执行，TEST_REPORT 结论保持 INCOMPLETE。

### 文档

`03_TECH.md` 改为“已确认口径（SPEC-001 C、Q-04 A）”并同步原句；`01_PRD.md` Q-04 标为已确认 A；`05_TEST_PLAN.md` v2.4 更新 TC-117-C/TC-122 预期并关闭 §13-7/8；`06_TEST_REPORT.md` 增加 RUN-002。

## DEV-123 隔离宿主验收与 0001 旧库用例

2026-11-22，关联 TEST_PLAN v2.5、RUN-003。产品代码未改；调整两个宿主脚本的过期 UI 期望，新增 0001 旧库升级用例。

### 宿主环境

- 8188 原进程加载的是 DEV-118 之前的后端代码（启动于 08:24）。确认 `/queue` 为空后停止，并以同一隔离参数重启：ComfyUI 0.46.0、Frontend 1.59.6、`--disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto`、Data Root `.artifact/frontend-preview/astrophoto`。
- 首次重启漏设 `ASTROPHOTO_HOME`，宿主回落到 `%USERPROFILE%\.astrophoto`；`storage-host.mjs` 在写入前断言失败，未产生测试工作区。补充环境变量后重启，`/storage` 返回 `source: ASTROPHOTO_HOME` 与 schema `0004_deleted_trains`。
- 设备两阶段用例在 prepare 与 verify 之间重启同一数据根。

### 测试脚本修正（Test Defect）

| 脚本 | 过期期望 | 修正 |
| --- | --- | --- |
| `storage-host.mjs` | 设置首页的 “System Status” 已由 D-15 移除 | 改为断言 Equipment/Software/Configuration 三项；版本改由 `/status` 读取 |
| `storage-host.mjs` | 导入模式标签 “Index in database only / Copy into a managed storage location” 已改文案 | 改为 “Index original files / Copy to storage” |
| `storage-host.mjs` | “Preferred” 被断言在默认工作区行 | 改为断言列表首行（排序首项即首选位置） |
| `equipment-host.mjs` | 等待页内 “Equipment saved.” / “Equipment group saved.” | 宿主通知可用时回执走通知；改为以详情标题与 API 回执判定 |

### 新增用例

`tests/integration/test_storage_init.py::test_legacy_0001_database_upgrades_and_preserves_equipment`：用 Alembic 构造 0001 schema（含 `storage_identity`、默认位置、设备与相机规格），替换到已初始化的数据根后重启，断言升级到 0004 且设备 ID、名称、`row_version` 保留。补齐 TC-116 的 0001 副本。

### RUN-003

| 范围 | 结果 |
| --- | --- |
| `uv run pytest tests/backend tests/integration -q` | 209 passed, 6 skipped |
| `COMFYUI_TEST_URL=… pytest tests/integration -m host` | 1 passed |
| `node frontend/tests/host/storage-host.mjs` | PASS（设置、导入模式、位置追加、预览、重载） |
| `node frontend/tests/host/assets-host.mjs` | PASS（项目模板、Reference、Copy 上传、跨标签拖放、虚拟移动、树导航） |
| `node frontend/tests/host/equipment-host.mjs --prepare-restart` → 重启 → `--verify-restart --verify-delete` | PASS（七屏、四类设备、重启持久化、删除保护） |

证据：[RUN-003](assets/test-runs/RUN-003/)。MCP 与前端组件沿用 RUN-002 结果，本轮未改相关代码。双 SSD、1000 帧上传、真实 MCP 客户端、任务框与真实卷迁移仍未执行。
