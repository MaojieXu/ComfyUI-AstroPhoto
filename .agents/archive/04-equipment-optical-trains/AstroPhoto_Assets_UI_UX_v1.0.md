# AstroPhoto 摄影素材库 · UI/UX 需求规格 v1.0

> 状态：UI/UX 设计基线（依据已通过的 3 个主界面与 5 个操作子界面原型；本版修订 Import Assets）  
> 日期：2026-11-19  
> 交付对象：产品、前端、后端、Local Agent、测试  
> 适用宿主：现有 ComfyUI AstroPhoto 单 Sidebar；历史核验基线 ComfyUI Frontend 1.59.1  
> 文档性质：交互与验收规格，不代表代码已经实现；具体函数/API 以下一阶段代码披露为准。

## 0. 本轮变更与结论

**已确定：**

1. 仍只保留 AstroPhoto `Nodes / Assets / Settings` 三个宿主主视图。`Assets` 内有 `Projects` 和 `All Assets` 两个横向切换视图；`Calibration Library` 从 `All Assets` 的分类筛选栏右侧进入，**不**在 Projects 中增设全局入口。
2. `All Assets` 的快速分类为 **全部 / 子帧 / 主帧 / 视频**。Light、Dark、Flat、Bias 是素材用途，不能与主帧和视频并列为同一分类维度。
3. Asset 和 Collection 通过拖拽直接进入 Canvas；通过拖拽进入 Project 虚拟文件夹。**不设置专门的“+ Canvas”按钮**。节点是否支持某种格式，由节点决定，不由素材库解码。
4. `Import Assets` 不再提供 Reference / Copy 选择控件，也不让用户在导入时重新选择 Workspace。**显示 Settings → Storage 中已经配置的导入策略及目标**（只读）。
5. `Import Assets` 提供并列的 **“选择文件”** 和 **“选择文件夹”**。点击调用当前平台允许的原生选择窗口；选完以**可增删的待导入条目列表**展示，不将大段系统路径自动粘贴进自由编辑的文本框。可重复添加选择、撤回单项、重新预检。
6. Calibration Library 同时展示校准子帧 Collection 与校准 Master；Dark、Dark Flat、Bias 以 Camera 为核心条件；Flat 同时绑定 Camera 与 Optical Train（及适用滤镜/光学条件）。**进入 Library 的 Flat 必须被 User 明确确认为已用 Bias 或 Dark Flat 校准，并记录其校准来源**；未校准 Flat 只能在普通素材/Collection 中管理。
7. Project 内 Collection 不嵌套，同一 Asset 最多归属一个 Collection；同一 Collection 可以跨 Project 引用，但同一 Project 内只有一个主要虚拟目录位置。Project 和 Calibration Library 的 Virtual Folder 可嵌套，且**不映射到 Workspace 物理目录**。
8. Node 正式输出**不自动收录**为 Asset；User / Agent 主动发起收录，临时预览不进入素材库。Agent 关键推断需经 User 确认；Reference 原文件不允许被素材库物理移动、覆盖或删除。

**文件选择的工程可行性边界（必须在开发前核验）：** 浏览器标准文件选择器能返回用户授权的 `File`/`FileList`，但**不给出真实 Windows 绝对路径**；目录选择返回目录内文件及相对路径。既有 AstroPhoto 服务端导入接口需要可访问的服务器路径。故「点击原生文件/文件夹选择框」与「仅登记原址 Reference」**不能直接等价**。具体处理见 §4.6 与 §11；不得使用 `C:\\fakepath\\...` 作为真实路径，不得伪称已经能够在所有浏览器下通过原生窗口生成 Reference。此处是待实现/待核验的接入差异，不反向修改已确定的产品方向。

---

## 1. 产品边界、对象与信息架构

### 1.1 产品对象

| 对象 | 用户如何理解 | UI 中出现的位置 |
|---|---|---|
| Asset | 一条实际文件登记；同一路径允许多个独立登记 | All Assets、详情、Project 虚拟目录 |
| Collection | 采集/处理条件一致的一组 Asset；不能嵌套 | All Assets（子帧为主）、Projects、编辑器 |
| MasterFrame | 可进入图像后期阶段的主帧；不等于已校准 | All Assets 的“主帧” |
| Calibration Master | 用于校准的 Dark/Flat/Bias 等 Master | Calibration Library；关联选择器 |
| Project | 相同目标或处理计划下的虚拟组织入口 | Projects |
| Virtual Folder | 可嵌套的逻辑文件夹，不改变磁盘 | Project Tree、Calibration Tree |
| Capture Session | 可选辅助采集归属；不强制成为层级 | 属性关联区及选择器 |
| Workspace | 物理受管文件位置 | 素材详情的只读定位信息；Settings → Storage 管理 |

### 1.2 界面总数

本阶段设计 **3 个主要界面 + 5 个操作子界面 = 8 个原型/交互模块**，不因表单、确认弹窗、空状态增加一级页面。

| 编号 | 界面 | 入口/形态 |
|---|---|---|
| M01 | Projects | Assets 内左侧主视图 |
| M02 | All Assets | Assets 内右侧主视图 |
| M03 | Calibration Library | All Assets 分类筛选栏右侧的固定入口，返回 All Assets |
| S01 | Import Assets | All Assets「导入」→ 对话框/侧栏内容 |
| S02 | Asset Details | 单击素材条目 → 详情/编辑面板 |
| S03 | Collection Editor | Collection 详情 → 编辑成员与条件 |
| S04 | Project / Folder Editor | Projects 新建、更多操作、右键/菜单 |
| S05 | Calibration Assignment | Light/Light Collection 的校准关联操作 |

**不新增独立页面：** Capture Session 维护并入属性与关联表单；Workspace 根目录/默认导入方式设置保持在 Settings；文件错误、批量操作与删除确认使用通用对话框。

### 1.3 导航原则

- ComfyUI 宿主只显示一个 AstroPhoto Sidebar。宿主外层 Nodes / Assets / Settings 三 Tab 保持原样。
- Assets 进入后提供 `Projects | All Assets` 两个紧凑、可用键盘切换的子 Tab。`Calibration Library` 是从 All Assets 打开的三级页面，不增加第三个同级主 Tab。
- 由 All Assets 进入 Calibration Library 时，返回按钮必须恢复 All Assets 先前的搜索、筛选和滚动状态。
- Projects 保留当前 Project、树展开、选中项、滚动与未保存编辑状态；离开正在编辑的表单应有防丢失提示。
- 若从 Project 内的校准组引用 Master，只打开局部关联选择器；**不在 Projects 头部复制全局 Calibration Library 入口**。

---

## 2. ComfyUI 视觉规范与交互通则

### 2.1 视觉语言

- 延用现有 React Sidebar 与 ComfyUI 前端视觉：紧凑左对齐圆角 Tab、搜索框、Filter Dropdown、Sort、悬停操作、Tree/List、轻量 Dialog、Toast、Accordion、明确的 Focus Ring。
- 背景、表面、分隔线、文本、强调色**继承宿主语义主题/扩展现有 AstroPhoto 主题适配**，同时支持深色和浅色。不要用另外一套独立皮肤或大面积彩色面板。
- 不新增大型 Dashboard、大缩略图矩阵或图片预览。图片/视频在素材库中显示**文件图标、名称及元数据**，要查看内容须拖入相应 Node/Inspector。
- 设备、光路等选择器复用现有 Comfy 风格选择器。中英文与宿主 locale 保持一致；不要额外设置素材库语言/主题开关。
- Danger 操作的视觉与普通编辑明显区分，但不因危险而隐藏常用操作；可访问性高于纯图标密度。

### 2.2 推荐布局（允许随宿主适配）

| 部分 | 说明 |
|---|---|
| 页面顶部 | 小标题 + 主要动作；搜索与过滤紧跟其下 |
| 主列表 | 单行主名称、次行关键属性、小型状态标签；不强制缩略图 |
| 详情 | 摘要卡片 + Accordion 分组；按需弹出编辑 |
| Dialog | 轻量、支持取消和 Esc；高危确认要求明确行动后果 |
| 侧栏宽度 | 在窄、中、宽尺寸与浏览器 200% 缩放下不横向溢出；小屏主侧栏可占满可用宽度 |
| 国际化 | 术语稳定：Project、Collection、Calibration Library、MasterFrame、Reference、Workspace；中文显示优先自然术语 |

### 2.3 共有交互

- 列表：单击选中或打开详情；批量复选不自动打开；右键/更多菜单提供编辑、归属与逻辑移除。
- 拖放：可拖动 Asset/Collection 到 Canvas；也可从 All Assets 放到 Projects 的虚拟目录。放下操作优先**链接引用，不复制物理文件**；必须显示目标高亮与成功/失败回执。
- 不支持拖入 Canvas 时：显示具体原因，如节点不可用、宿主只读、格式尚无节点支持、文件失联。不得创建一个会静默失败的假节点。
- 网络中断/请求失败：保留用户输入和当前选择，提供重试；请求返回前防止重复提交；成功才更新列表与计数。
- 可能写入多个对象的操作：呈现作用对象数量、冲突/跳过统计；失败不得暗示全部成功。

---

## 3. M01 · Projects 主视图

### 3.1 信息布局

1. 标题 `Projects`、新建 Project 与必要工具操作。
2. 搜索 Project/Virtual Folder/Collection。
3. Project 列表：名称、摘要（可选目标/数量）、选中高亮。
4. 当前 Project 的虚拟文件夹树，可展开多层，节点类型区分 Folder / Collection / Asset / 校准资源引用。
5. 当前选中条目的简要属性与状态，不额外添加 `+ Canvas` 按钮。

### 3.2 行为

- Project 可包含多个处理条件不同的 Collection、独立 Asset、MasterFrame 与项目校准组。
- User/Agent 可以创建、重命名、移动/删除虚拟文件夹，允许 `Raw / Intermediate / Results` 作为**可选模板**，绝非自动磁盘目录或素材处理阶段真相。
- 同一 Project 内一个 Collection 只有一个主要目录位置；跨 Project 共享 Collection 不复制文件。
- 从 All Assets 拖过 Projects Tab 时，应提供可感知的进入/根目录接收操作。优先支持拖悬停展开目标树，再放入目标文件夹；若宿主拖拽机制无法稳定跨 Tab 保持拖拽，则以可用的「放入 Project…」上下文操作作为键盘/兼容降级，不伪称已完成拖放。
- 虚拟文件夹重命名/移动**不更改磁盘文件路径**；Project 删除与大批量解除引用需额外确认。
- Capture Session 可选关联，不强制创建日期目录。

### 3.3 项目情境

- **M31 多滤镜**：Project 下不同设备的 Ha/OIII/RGB Collection 分组展示。
- **月面/太阳拼接**：按 Panel 01/02… 排序，同一 Panel 下可包含视频集合和结果。
- **木星时间序列**：按拍摄批次/时间/RGB 通道查看不同 Collection。

---

## 4. M02 + S01 · All Assets 与 Import Assets（本轮重点修订）

### 4.1 All Assets 主视图

- 标题 + `导入` 主操作。
- 搜索框。
- 同一筛选行：左侧 `全部 | 子帧 | 主帧 | 视频`；右侧紧凑 `Calibration Library` 入口，**不使用大尺寸独立入口卡片**。
- 过滤/排序：按目标、设备、光路、滤镜、曝光、时间、校准状态、处理阶段、Workspace/Reference、失联等。排序按名称、时间、大小、适用的数值等；缺少元数据时不可假造排序值。
- 子帧以 Collection 为主要展示单位，可展开查看成员，也支持独立未分组 Asset；主帧是可进入后期处理的单帧；视频按单视频/视频集合展示。原始 Dark/Flat/Bias 通过子帧用途属性进一步筛选。
- `Calibration Master` 与 `MasterFrame` 不是同一角色；全局校准资源在 Calibration Library 内专门组织，All Assets 的全部视图仍可通过相应标签找到登记。
- 单个 Asset/Collection 可拖到 Canvas、Projects 虚拟目录；**不展示加 Canvas 的按钮**。

### 4.2 Import Assets：页面文案及布局

**推荐设计：两个并列的原生选择入口 + 共同的待导入清单。**

```text
Import Assets                                         [×]
从电脑或当前受信本机导入文件 / 文件夹

[选择文件…]   [选择文件夹…]

当前存储策略：Reference（继承 Settings）  [查看 Storage 设置]
默认 Workspace：Default（如策略需要）

待导入（86 项）                                [清空选择]
☐ M31_Ha_001.fit           FITS / 90 MB         [移除]
☐ M31_Ha_002.fit           FITS / 89 MB         [移除]
☐ Moon/Panel01/part1.ser   SER / 2.5 GB        [移除]
…

基础分类（可选）[未分类 / 子帧 / 主帧 / 视频]
目标 Project（可选）[不关联 / M31 / …]

[预检导入]  → 已通过 83 / 失败 3
                                [取消] [确认导入]
```

文本框不应承担大批路径的主要展示任务；清单可以展开细节。路径/名称是**展示结果**，而非默认让用户大量手打的输入。若同一路径被重复选择，不自动内容去重；明确显示重复选择项或可能的重复登记，并由 User 决定处理。

### 4.3 文件 / 文件夹选择

- `选择文件…`：打开当前平台的原生文件选择器，允许一次选择单个或多个文件，不通过扩展名白名单限制天文文件。
- `选择文件夹…`：打开目录选择器，用户确认目录后收集其可访问的文件条目；**文件夹是导入来源，不自动等于 Project 或 Collection**。
- 选择后展示：名称、类型/扩展名、可得大小、所属所选文件夹、相对位置（仅在能够确定时）、待处理状态。**不做图像/视频预览或科学 Header 扫描**。
- 再次点击可以追加第二次选择；取消选择器时维持原列表；支持撤回单项/清空选择。
- 对超大目录可先展示目录名称与初步数量，后台异步枚举/预检；避免在侧栏渲染成千上万条完整 DOM 行（需虚拟滚动或分页）。
- `文件夹`选择不会自动建立 Collection；若希望整个目录按一个 Collection 批量归类，需要后续明确确认其处理条件一致。
- 允许 User 直接拖拽操作系统中的文件到**Import Assets 的待选区域**，仅在平台支持且授权范围满足时生效；此行为与将**已登记 Asset 拖到 Canvas**不同，需区分视觉提示。

### 4.4 存储策略完全继承 Settings

- Import 页面**不提供 Reference/Copy 切换**、不提供选择 Workspace 根目录或用户可编辑的任意目标路径。
- 通过当前 Storage 设置读取 **导入模式、默认 Workspace、运行状态/在线性**，顶部以紧凑只读提示展示。可以提供 `查看 Storage 设置` 链接，但应保护未完成选择、预检结果与导入草稿。
- Settings 导入策略变更后，原有预检结果失效，返回导入页必须重新预检；不能用旧策略继续提交。
- 侧栏 D-19 将顶层「素材」定义为「项目」首页入口。导入页的专用链接直接打开「设置 → 存储」，草稿留在导入编辑器中。再激活「素材」时，有草稿按现有确认流程处理，确认丢弃才返回「项目」，取消会保留草稿。 [侧栏需求](../sidebar-node-browser/01_PRD.md)
- Storage 未 ready、默认 Workspace 离线/只读、授权目录缺失或不满足当前模式时，清楚告知具体原因与可操作的设置入口；**不能默默改成另一种模式**。

### 4.5 导入提交顺序与回执

1. 打开导入 → 读取 Settings 的有效存储策略。
2. 选择文件、文件夹（可多次追加）。
3. 审阅统一待选清单，必要时调整目标 Project、初始分类；未知元数据保持空值。
4. 点击 `预检导入`：检查可访问性、实际可处理数目、大小、授权、重复登记提示、策略与目标有效性。预检不是科学数据的图片预览。
5. 显示通过/跳过/失败以及原因；在用户确认前不写业务 Asset。`确认导入`仅在有效预检后启用。
6. 提交后台导入 Operation；显示进度、已完成/失败数、取消/重试入口。按现有能力处理部分成功和安全恢复。
7. 完成时显示真实结果数量，允许 `查看 All Assets` 或进入关联 Project；不自动创建 Collection、Session 或校准关系。

### 4.6 浏览器/Windows 文件选择的关键技术差异

| 使用环境与模式 | 用户期望 | 可行边界 / 必须处理的 UX |
|---|---|---|
| 标准浏览器 + Copy | 点击原生窗口选择文件/目录 | 浏览器可提供 `File`/目录内相对路径；**要复制到服务器 Workspace 需要具备可信上传/传输通道**，不得以路径字符串冒充上传成功；本功能是否已有需代码披露 |
| 标准浏览器 + Reference | 仅登记本机绝对路径、不复制字节 | 浏览器 `input[type=file]` **不提供真实绝对路径**；不能直接满足现有服务器路径导入。需要已验证的受信桌面/本机桥接，**或**改为从服务端已授权目录选择/录入绝对路径的能力；未实现时应明确说明并禁用无法完成的提交 |
| ComfyUI Desktop / 受信本机集成 | Windows/macOS/Linux 原生路径选择 | 只有确认目标安装环境公开且可维护的文件路径/目录选择接口后，才能作为 Reference 的实现依据；**不能仅因使用桌面 UI 就假定有此接口** |
| 目录选择 | 一次选择整个文件夹 | 浏览器 `webkitdirectory` 等返回文件集合与 `webkitRelativePath`，不是服务器绝对目录路径；对深层/大目录保留原层级仅作清单信息，不自动创建业务层级 |
| 非本机宿主/反代 | 选择浏览器所在电脑文件 | 浏览器与运行 ComfyUI 的服务器可能不是同一机器；不能把前端文件路径当服务器读取路径，也不能跳过原 Storage 授权模型 |

**推荐产品降级策略：** 仍保留文件/文件夹双主入口；当平台无法完成当前 Settings 中的 Reference 策略时，在点击选择前或选择后明确显示“当前为仅引用原位置；浏览器无法提供完整路径”，并给出**从已授权本机路径添加**的次级流程或跳转到 Settings。这个“路径录入”仅是 Reference 的受控兼容入口，不恢复通用的大文本框作为导入主操作；最终是否新增服务器文件浏览器/原生受信桥接，需 Local Agent 代码披露后定案。

**绝对禁止：** 把 `C:\\fakepath\\xxx.fit` 当作真实目录；把 `File.webkitRelativePath` 当作服务器绝对路径；在 Reference 模式下无提示改为 Copy；未经授权请求任意本机/远端绝对路径。

---

## 5. M03 · Calibration Library

### 5.1 入口与布局

- 从 All Assets 分类筛选栏**同一行右侧**打开；顶部有明确 `← All Assets` 返回。
- 标题、搜索、紧凑 `全部 / 子帧集合 / 校准 Master` 筛选、虚拟文件夹树、校准资源详情/登记。
- 按 `Camera` 与 `Optical Train` 区分资源归属：Dark / Dark Flat / Bias 以相机条件组织；Flat 需要对应的 Camera + Optical Train，并显示滤镜和校准来源。
- Calibration Library 可有多级虚拟文件夹，如 `Camera → Dark → 180s`、`Optical Train → Ha Flat`，但组织文件夹不等于改变实体的科学适用条件。
- 原始未校准 Flat 继续作为普通子帧管理，不以合格校准 Flat 身份显示在 Library。

### 5.2 登记要求

| 类型 | 主要绑定 | UI 规则 |
|---|---|---|
| Dark | Camera | 允许子帧 Collection 或 Master；展示曝光、Gain/Offset、温度等已填信息 |
| Dark Flat | Camera | 允许子帧 Collection 或 Master；强调与 Flat 相应的曝光/相机条件 |
| Bias | Camera | 允许子帧 Collection 或 Master；展示相机读取相关条件 |
| Flat | Camera + Optical Train | **必须确认已用 Bias 或 Dark Flat 校准，并记录来源**；还需记录适用滤镜/光路条件；未满足时禁止作为合格 Flat 登记 |

- 这是一条**用户确认/来源记录**规则；素材库不会自动解码 FITS 来证明像素确实经过校准。
- 经过校准的 Flat 子帧 Collection 不会因此自动成为 Master Flat，用户必须根据实际产物角色明确分类。
- Calibration Master 可以跨 Project/Collection 复用；Project 内可以创建校准组**引用**全局资源，不新增一份文件。

---

## 6. S02 · Asset Details

### 6.1 区域布局

1. **顶部摘要**：名称、文件类型图标、实际位置/存储方式、可用性、Project/Collection 归属摘要。
2. **科学分类/状态**：文件形态（图片/视频/其他）、素材用途（Light/Dark/Flat/Bias/Dark Flat/…）、产物角色（原始 / Calibration Master / MasterFrame / 处理结果）、校准状态（未校准/已校准/未知/不适用）、处理阶段（原始/预处理/配准/叠加/拼接/后期/完成/未知）；不同维度不得互相推断。
3. **拍摄与设备信息**：目标、Camera、Optical Train、滤镜/波段、曝光、Gain、Offset、Binning、温度、Session；可留空。
4. **来源与备注**：User 手动备注、Node/Workflow/来源 Asset 或 Collection（已记录才显示）。
5. **存储与安全**：Reference/Managed、失联/重新定位、取消登记、受保护物理删除。

### 6.2 交互

- User 手动修改状态/属性后保存；Agent 推断的数据需 User 确认。未知保持未知。
- 所属 Collection 存在时，修改会改变一致性的字段应提示冲突，并提供“取消更改 / 先移出集合 / 转至 Collection Editor”等明确选择，不静默覆写整组属性。
- `MasterFrame` 表示后期可处理主帧，**不自动标记为已校准**。选择校准 Master 同样不自动切换状态。
- 取消登记 ≠ 删除磁盘文件。Reference 禁止物理修改；Managed 物理删除须 User 明确确认并确认无其他登记或任务引用。
- 不提供图片预览和 `+ Canvas` 按钮；可在条目列表直接拖入 Canvas。键盘环境可通过上下文命令达到等价行为。

---

## 7. S03 · Collection Editor

### 7.1 页面布局

- 当前 Collection 名称与摘要（成员总数、拍摄条件、校准状态/阶段、关联校准 Master）。
- **统一处理条件**卡片：用途、Camera、Optical Train、滤镜、曝光、Gain、Offset、Binning、温度确认范围、校准关联。
- **当前成员**可排序列表：文件名称、关键差异提示、移出动作（只解除成员关系）。
- **可加入素材**搜索/筛选列表：尚未归入其他 Collection 的 Asset；批量选择/添加。
- **校验与确认**：错误的已知参数不可静默混入；缺失值需明确 User 确认。Agent 批量导入同理。

### 7.2 编辑规则

- Collection 不嵌套；一个 Asset 最多加入一个 Collection。
- 同一 Collection 中必须有一致处理条件与统一的校准关联；采集时间/序号可以不同。温度容差科学判断由 User/Agent 决定并取得确认，后端不自行推断阈值。
- 允许对未知参数成员人工确认一致性，但**已知明确不一致**时提示分组/拆分，不默认把不一致数据当成已经验证。
- 已保存后显示成功计数，失败保留原成员关系与用户草稿；不可将失败视为保存完成。
- 一个 Collection 可在多个 Project 引用，但在同一 Project 仅有一个主要虚拟位置。

---

## 8. S04 · Project / Folder Editor

### 8.1 页面布局

- Project 切换器与名称/目标/摘要。
- 可展开的 Virtual Folder Tree，显示已放入的 Collection/Asset、引用状态。
- 当前节点操作：新建子文件夹、重命名、移动到其他文件夹、移除引用、删除虚拟结构。
- 允许创建 `Raw / Intermediate / Results` 作为**可选** Project 模板；月面可选按 Panel、行星按时间与通道组织。

### 8.2 交互与删除保护

- 通过在树中拖拽或选择目标文件夹移动**虚拟位置**，不移动物理文件。
- 拖入同 Project 已有的 Collection 时应显示“移动现有虚拟位置”，不要创建第二个同项目主要引用。
- 不允许将父文件夹移动到其子孙文件夹下，不允许在操作后形成环。
- 删除空文件夹可轻量确认；**删除含多个对象/大量引用的子树必须显示受影响数量和明确二次确认**，默认只移除 Project 虚拟关系，不删除 Asset/Collection/Workspace 文件。
- Agent 可按授权创建并组织 Virtual Folder；可能大幅解除 Project 关系的操作须 User 确认。后续 Project Management Skill 不得绕过业务授权。

---

## 9. S05 · Calibration Assignment

### 9.1 页面布局

- 顶部目标：Light Asset 或 Light Collection 的名称、Camera、Optical Train、滤镜/曝光/Gain/校准状态摘要。
- 分组选择：Master Dark / Master Flat / Master Bias（必要时按实际科学节点支持扩展 Dark Flat），每组可选适用的资源或明确“无”。
- 每个候选显示：名称、适用 Camera、Optical Train（Flat）、滤镜、曝光/Gain/温度等已登记信息、来源/校准方法、已知冲突与缺失。
- 底部：`Agent 推荐（仅提出候选）`、`确认关联`；无单独 Canvas 按钮。

### 9.2 规则

- User 可以直接选择；Agent 可以建议，但**不自动提交**；写入须 User 确认。
- Dark / Dark Flat / Bias 主要按相机与相应采集条件匹配；Flat 要校验 Camera + Optical Train + 滤镜等相关属性，而且必须经过 Bias / Dark Flat 校准。
- 已知条件不一致或关键信息缺失时显示差异警告，**User 二次确认后允许关联**；不强行在素材库中判定科学算法能否运行。
- 不合格/未校准 Flat **不能作为有效校准资源被选择**。
- 关联后的 Light 校准状态保持原值；“已关联 Master”与“已执行校准”分开显示。
- 单个目标可以关联不同用途的多个 Master，不因关联生成新文件或运行节点。

---

## 10. 交互状态、错误提示与无障碍

### 10.1 页面级状态

| 状态 | UI 行为 |
|---|---|
| 首次加载 | Skeleton/紧凑 Loading，保留既有导航，不展示错误的空列表 |
| 空项目/空素材/空校准库 | 说明当前为空和可执行入口，不用图像占位图充满 Sidebar |
| 搜索无结果 | 显示当前筛选条件和“清除筛选” |
| 保存中 | 禁止重复写入，显示进度；可取消范围按服务能力区别 |
| 部分成功 | 明确成功数/失败数/跳过数和原因，可重新尝试失败部分 |
| 失联 Reference | Asset 仍可查询分类及关联，显示离线状态与允许的重新定位入口 |
| 失联 Workspace | 禁用实际文件处理/移动，仍保留逻辑数据及项目目录 |
| 未授权 / Storage 不可用 | 解释原因，不披露不应暴露的本机私有路径；附设置/重试动作 |
| 版本冲突 | 告知数据已变化，支持比较/重载，禁止自动用旧表单覆盖新版 |
| 宿主只读 | 禁止拖入 Canvas 创建节点和其他不允许的修改，提供说明 |
| 关键科学属性未知 | 保留未知，禁止无证据自动匹配；允许 User 确认的 Collection 例外 |
| 校准条件冲突 | 参数差异可见，User 二次确认后允许绑定；未校准 Flat 不能入库 |

### 10.2 输入、焦点与键盘

- Search 支持 IME 组合输入；Debounce 与卸载清理沿用现有模式。
- Tab 顺序从顶部操作、搜索、过滤到列表/详情；快捷方向键移动树焦点，左右键展开/折叠，Enter/Space 选中或激活。
- Dialog 支持 Esc 关闭（高危确认不应被误当作完成）；关闭后返回触发按钮焦点。
- 拖拽需要键盘兼容入口（例如上下文“放入 Project…”或“创建对应 Source 节点”命令），但仍不在常规详情里额外展示 `+ Canvas` 按钮。
- 颜色不单独承载校准状态和错误，需同时有文字；按钮/字段有可读名称、错误与目标字段关联。
- 大文件名、Windows 长路径、中文、特殊字符和超长 Project 名称须省略显示且支持查看完整内容，不出现布局溢出。
- 中文/英文随宿主切换，主题自动继承宿主，不增加独立语言/主题设置。

### 10.3 动效与交互反馈

- 拖起时源条目轻微弱化、放置区域显示虚线高亮；放下后反馈**关联建立成功 / 目标无权限 / 该 Collection 在本 Project 已存在**等具体状态。
- All Assets → Projects 跨视图拖动需要对“拖到 Tab”和“最终落到文件夹”的状态做单独验收，不可依赖偶然存在的浏览器 DOM 元素。
- 列表操作、Dialog 和科学状态变更不应触发 Node 重新计算；只有真正修改工作流参数/队列行为时才交给宿主运行。

---

## 11. 现有实现差异与工程披露门槛（非 UI 设计待决）

以下事实来自交接 H0 中的**源码/测试审计说明**，不是本次直接检出完整仓库，也不等同于当前宿主全链路已验收。Local Agent 需要逐项回到真实代码确认。

| 事项 | H0 可见现状 | 本次 UI/UX 目标/披露要求 |
|---|---|---|
| 主导航和 UI 组件 | React Sidebar 已有 Nodes/Assets/Settings，搜索、设备选择器、主 Tab、主题/locale 适配 | 复用，不引入第二套宿主 Sidebar；保留已验证节点/设备交互 |
| 导入界面 | `ImportDialog.tsx` 当前使用服务端路径预检、可选择 Reference/Copy、Workspace；`assets/imports.py` 接服务器绝对路径 | 导入界面去掉模式/目标选择并改为 Settings 只读；检查 File Picker、上传/可信本机路径桥接真实可行性 |
| 导入目录/大小限制 | 当前有用户授权导入根、目录枚举/条目限制与 operation 状态 | 展示真实 preflight、错误/跳过数；不能直接把浏览器目录列表当服务器授权源 |
| 重复导入 | 现有 Reference 同路径/size/mtime 会跳过或拒绝 | 新 PRD 允许同一路径独立登记；需披露需要改变的身份/引用行为及测试 |
| Asset CRUD | 列表/导入/失联/重新定位/Session 字符串关系已存在，通用实体删除尚未完整实现 | 明确新增编辑、取消登记、受管文件删除/保护及关系回执 |
| Project/Collection/Calibration | H0 中尚无这套完整实体与 UI；Session 为轻量关系 | UI 是目标设计，不能假定已有 API 或权限闭环 |
| Canvas | Nodes 拖拽已有宿主适配，FITS Source 已有路径选择 | 复用已有 Host 接入，但 Asset/Collection → Source 需真实节点支持与运行校验 |
| 输出收录 | 现有 Siril 正式处理有输出 Asset 登记 | 新 PRD 要求 User/Agent 主动收录；必须明确过渡/兼容影响，不能只改 UI 文案 |
| MCP | 已有诊断及受控设备/光路只读 Tool | Asset/Project/Calibration 的 MCP 写工具是**未来目标**，不能声称已可由 Agent 实际操控 |

### 11.1 导入交互的工程前置验证清单（优先级最高）

1. **运行形态：** 浏览器中的 ComfyUI、ComfyUI Desktop、反向代理下的浏览器是否均要求本功能；哪种环境具备经官方支持的原生路径选择接口？
2. **路径能力：** 目前后端 `ASTROPHOTO_IMPORT_ROOTS` 与 `Source` 枚举如何获得可验证的绝对路径？如果没有可信桌面桥接，纯浏览器 Reference 使用何种受信路径选择/录入降级？
3. **Copy 能力：** 是否已有受控的客户端文件上传流、断点/取消、临时 staging 到 Workspace 的发布路径？不得仅依 `POST /assets/import` 服务器路径接口推断浏览器可直接传大视频。
4. **目录能力：** 用户选的目录是否会递归展开、是否包含符号链接、如何限制枚举、如何处理超大目录和不受支持浏览器？
5. **Settings 归属：** 导入 mode、default Workspace、路径权限和 settings revision 的真实读取及无竞态快照是否可复用？
6. **向后兼容：** 当前 `ImportDialog` 的已有手工路径输入是否需要作为受信本机 Reference 的次级入口保留？需根据真实部署环境确定。
7. **安全与结果：** 路径脱敏、no-overwrite、重复登记、未知文件不解码、Reference 不物理改写、部分失败恢复均要在真实 File Picker 路径与 API 之间有证据。

**设计判定：** 用户要求的“选择文件/文件夹打开系统窗口”是目标 UI；由于标准 Web 不能返回源文件绝对路径，这并非对现有 Reference 接口的简单前端替换。Local Agent 必须先披露受信平台接入或可行降级，并在工程方案中解决；不可擅自引入不安全的任意本地文件访问。

---

## 12. 验收用例矩阵（UI/UX）

| 用例 | 操作 | 必须观察到的结果 |
|---|---|---|
| UX-01 | Assets 中切换 Projects / All Assets / Calibration 并返回 | 导航正确，Calibration 仅从 All Assets 固定入口进入，搜索/滚动状态可恢复 |
| UX-02 | 窄 Sidebar、420px、650px 与 200% 缩放 | 不溢出、不丢操作按钮，主题、locale 与宿主一致 |
| UX-03 | Import 点击“选择文件”，一次选多文件 | 打开原生选择器，待选清单展示多条，可追加、移除、取消 |
| UX-04 | Import 点击“选择文件夹” | 进入目录选择流程，列出所选目录的文件/相对路径；不自动创建 Collection/Project |
| UX-05 | Import 查看策略 | 不出现 Reference/Copy 及 Workspace 重新配置控件，显示 Settings 真实值 |
| UX-06 | Settings 改变存储策略后返回待导入页 | 原预检过期，确认前重新检查策略和目标，不静默切换 |
| UX-07 | Web 浏览器当前策略为 Reference | 不能凭 `fakepath` 创建登记；提供受信路径流程或明确不可用原因 |
| UX-08 | Copy 模式选择大视频/目录 | 使用真实可行的数据传输与 Operation 回执，成功/失败/取消分开计数 |
| UX-09 | 用户允许同路径重复登记 | UI 不强制内容去重；遵循新 PRD 的独立登记语义，后端真实验证 |
| UX-10 | 子帧/主帧/视频筛选 | 与素材用途 Light/Dark/Flat 独立，未校准 Flat 仍可以是子帧 |
| UX-11 | 拖拽 Asset / Collection 至 Canvas | 创建真实支持的 Source Node；无 `+ Canvas` 按钮；只读模式不能修改图 |
| UX-12 | 从 All Assets 拖入 Project 文件夹 | 新建虚拟引用或在本 Project 内移动主要位置，不移动磁盘文件 |
| UX-13 | 同一 Collection 引用两个 Project | 两个 Project 可见且不复制物理数据；同一个 Project 不生成重复主要位置 |
| UX-14 | Asset 详情修改校准状态与处理阶段 | 两个属性独立保存，MasterFrame 不自动标已校准 |
| UX-15 | 编辑 Collection 加入 OIII 或不同曝光的 Light | 显示明确冲突，不静默混合；未知温度需显式 User 确认 |
| UX-16 | 校准库登记 Flat，未填光路或 Bias/Dark Flat 来源 | 阻止合格 Flat 登记，字段错误明确 |
| UX-17 | 校准库登记 Dark/Bias/Dark Flat | 不强制 Optical Train，关联 Camera 与适用条件 |
| UX-18 | Light 选择参数不匹配 Master | 展示差异，二次确认后允许绑定；Light 仍保持原校准状态 |
| UX-19 | 虚拟文件夹删除非空子树 | 说明解除的关系数量；确认后只删虚拟组织，不删 Asset/磁盘 |
| UX-20 | 删除 Reference 文件 | 物理删除不可用；取消登记与移除 Project 仍按授权规则可用 |
| UX-21 | 受管文件有其他 Asset 引用 | 不允许因本条登记删除而物理删除共享文件 |
| UX-22 | Node 正式输出完成 | 不自动出现在 All Assets；主动收录后可登记来源并再次拖入 Canvas |
| UX-23 | UI/API 请求失败、并发冲突、离线 | 用户输入不丢失，明确失败/跳过/重试与最新服务器状态 |
| UX-24 | 键盘、IME、屏幕阅读器与 Dialog 焦点 | 可操作搜索、树、选择器、确认、取消与替代拖拽动作 |

---

## 13. 用户文案表（建议）

| 场景 | 推荐文案 |
|---|---|
| 导入空态 | “选择文件或文件夹，随后检查待导入清单。” |
| 当前导入策略 | “当前方式：仅引用原文件位置 · 来自 Settings → Storage” |
| Browser Reference 限制 | “当前浏览器不能提供文件的完整本机路径。请从授权路径导入，或在 Settings 中配置可用的导入方式。” |
| 文件选择已取消 | “未更改待导入清单。” |
| 预检完成 | “通过 {success} 项，跳过 {skipped} 项，失败 {failed} 项。请检查后继续。” |
| 未知属性 | “该参数尚未确认，不能据此自动判断校准匹配。” |
| Collection 冲突 | “所选文件的滤镜/曝光等处理条件不同，不能直接加入当前 Collection。” |
| 未校准 Flat | “需要确认 Flat 已通过 Bias 或 Dark Flat 校准，并指定来源后才能登记为校准资源。” |
| Master 参数警告 | “所选 Master 与目标数据存在条件差异。确认后仍可关联，但这不代表已完成校准。” |
| Reference 删除 | “Reference 文件由外部位置持有，素材库不会移动或删除原文件。” |
| 虚拟目录删除 | “仅删除虚拟目录与其中的项目引用，不删除实际文件。” |
| Node 输出 | “处理结果已生成。是否将其收录到素材库？”（由 User 操作或 Agent Skill 询问，不自动写入） |

---

## 14. 已确认决定与非本阶段范围

**不可在实现中擅自反转的决定：**

- 导入方式与 Workspace 由 Settings 管理，Import 不重复配置。
- 文件/文件夹为两个原生选择入口，选择结果以待导入条目列表呈现。
- 同一路径可以有多个 Asset 登记；不强制文件内容去重。
- 素材库不预览、不解码；Canvas 才是查看/处理入口。
- 子帧、主帧、视频为快速分类；校准状态、处理阶段、用途另行维护。
- Flat 入 Library 必须先经 Bias/Dark Flat 校准并记录来源，绑定 Camera + Optical Train。
- Project/Calibration 虚拟目录与 Workspace 物理文件严格分离。
- 正式 Node 输出主动收录；不自动登记全部输出；不显示“未收录输出”独立页面。
- Reference 永不在素材库中被物理修改、移动或删除。

**本阶段不做：** 在素材库中实现天文图像预览、Header 自动解析、科学校准算法、视频处理、自动生成 Master、自动定义 Session 边界、自动质量指标、任意深度的物理目录重排、额外独立 Workspace 文件浏览器、未经代码披露就声称跨平台原生路径桥接可用。

---

## 15. 可复用的现有工程入口（仅来自 H0 交接；需代码披露复核）

- `frontend/ui/src/features/assets/AssetsPage.tsx`、同域 `ImportDialog.tsx`：现有素材列表和导入 UI。
- `frontend/ui/src/features/settings/StoragePage.tsx`、`frontend/ui/src/api/`：Storage 设置及接口适配。
- `frontend/ui/src/app/App.tsx`、`shared/SidebarTabs`、`shared/SearchField`/`SearchOptions`、`shared/ComfySingleSelect`、`shared/ComfyMultiSelect`、`DetailAccordion`/`DetailActions`：宿主风格与组件复用候选。
- `frontend/ui/src/host/canvas.ts`、`host/dragDrop.ts`、`host/scientific.tsx`：宿主 Canvas 及科学路径节点接线候选。
- `astrophoto/api/assets.py`、`astrophoto/assets/imports.py`、`astrophoto/assets/service.py`：资产路径导入/预检/登记与失联。
- `astrophoto/storage/`、`astrophoto/database/`：Workspace/Cache/Operation/SQLite/配置 ownership。
- `mcp/src/astrophoto_mcp/`：当前独立 MCP 工厂；Assets 写工具须另行扩展，并保持授权边界。

上述路径可帮助 Local Agent 发起**短小精确的代码披露**，但不代表已经给出每个函数的最终修改清单。

## 16. 官方参考资料

1. [ComfyUI Frontend 官方仓库](https://github.com/Comfy-Org/ComfyUI_frontend) — Sidebar / Node Library / 主题与交互参考；实际以前端目标安装版本为准。
2. [ComfyUI Frontend 开发贡献规范](https://github.com/Comfy-Org/ComfyUI_frontend/blob/main/CONTRIBUTING.md) — 语义主题、国际化与图标方向（当前 main 只作参考，不能代替 v1.59.1 实测）。
3. [MDN：`<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file) — 多文件及真实路径不公开的安全模型。
4. [MDN：`webkitdirectory`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory) — 目录选择返回文件集合与目录内相对路径。
5. [MDN：File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API) — 浏览器授权的文件对象访问。
6. [MDN：File System API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) — 用户授权的文件/目录句柄，不意味着可读取真实绝对路径。
7. [MDN：文件拖放](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop) — OS 文件导入 Drop Zone 与浏览器文件输入结合。

---

**结论：** 本文定义 3 个主界面 + 5 个子界面的 UI/UX 行为；仅 Import Assets 从原操作原型作本轮修改。产品目标已经明确。工程上最先需要确认的是“原生选择窗口 + Settings Reference 策略”的真实路径授权能力，随后才可以无歧义地拆分 React UI、HTTP/Storage 接入与真实宿主验收。
