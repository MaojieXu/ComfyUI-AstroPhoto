# Siril CLI 1.4.5

Siril 软件页提供可搜索的命令目录。201 条命令来自官方 1.4.5 发布包的命令表，其中标为可脚本执行的 183 条各有一个 ComfyUI 节点。带编译条件的命令取决于本机 Siril 构建。 [官方发布与源码](https://siril.org/download/2026-10-28-siril-1-4-5/)

## 查找命令与节点

在「AstroPhoto → 节点 → Siril」、ComfyUI 原生节点库和「设置 → 软件管理 → Siril」按同一套双语分类浏览。每个节点有一个主要目录，序列版本与单张版本放在一起。节点显示操作名和用途，展开「命令用法」可查看原始语法及前置条件。搜索支持原命令名、双语名称和常见术语，例如「去梯度」「高斯滤波」和「帧对齐」。更新 Python 节点后应重启 ComfyUI，再刷新浏览器。

| 一级目录 | 英文 | 节点数 | 示例 |
| --- | --- | ---: | --- |
| 文件、序列与元数据 | Files, Sequences and Metadata | 25 | `load`、`convert`、`save` |
| 传感器校正 | Sensor Correction | 13 | `calibrate`、`find_cosme` |
| 几何变换与重采样 | Geometry and Resampling | 11 | `crop`、`seqcrop`、`resample` |
| 图像配准 | Image Registration | 4 | `register`、`seqapplyreg` |
| 图像叠加 | Image Stacking | 5 | `stack`、`stackall`、`livestack` |
| 亮度与对比度 | Tone and Contrast | 20 | `autostretch`、`clahe`、`neg` |
| 色彩与通道 | Color and Channels | 22 | 色彩校准 5、色彩管理 3、色彩调整 2、通道管理 12 |
| 背景提取与梯度校正 | Background Extraction and Gradient Correction | 2 | `subsky`、`seqsubsky` |
| 伪影校正 | Artifact Correction | 3 | `fixbanding`、`seqfixbanding`、`unpurple` |
| 卷积与锐化 | Convolution and Sharpening | 3 | `gauss`、`unsharp`、`rgradient` |
| 反卷积 | Deconvolution | 7 | `makepsf`、`rl`、`sb`、`wiener` |
| 降噪 | Noise Reduction | 3 | `denoise`、`epf`、`fmedian` |
| 多尺度处理 | Multiscale Processing | 3 | `extract`、`wavelet`、`wrecons` |
| 特征检测与处理 | Feature Detection and Processing | 7 | `findstar`、`starnet`、`synthstar` |
| 像素与频域运算 | Pixel and Frequency-Domain Operations | 17 | `pm`、`iadd`、`fftd` |
| 图像测量与分析 | Image Measurement and Analysis | 15 | `histo`、`psf`、`light_curve` |
| 坐标标定与参考数据 | Coordinate Calibration and Reference Data | 7 | `platesolve`、`addwcs`、`catquery` |
| 运行与会话 | Runtime and Session | 16 | `setcpu`、`set32bits`、`cd` |
| 合计 | | **183** | 18 个一级目录，21 条末级路径 |

「色彩与通道」下的色彩校准（Color Calibration）包括 `pcc`、`spcc` 和颜色校正矩阵，色彩管理（Color Management）包括 ICC 操作，色彩调整（Color Adjustments）包括 `satu` 和 `rmgreen`，通道管理（Channel Management）包括 `split`、`rgbcomp` 以及 CFA 和窄带通道操作。其余 18 条命令沿用相同目录，仅在设置页提供说明。

## 使用路径连接节点

- 从 AstroPhoto Image Path 或已登记素材输出 `IMAGE_PATH`。Siril · crop 等需要当前图像的命令在 `image_path` 收到路径后加载工作副本，并将正式 FITS 路径传给下游。例如 crop 的 Arguments 填入 `[0, 0, 32, 32]`。
- 对 load、jsonmetadata 等命令，可连接 `file_path` 并在参数中用 `"{input}"` 代表工作副本。带空格的文件名作为 JSON 数组中单个元素。序列或多文件命令可接收本地目录并在参数中使用相对文件名。
- 若需保留 Siril 进程状态，例如 boxselect 后运行 psf，在前一个命令启用 Stage only，把 `SIRIL_STEPS` 接到后一个命令。末端保持 Stage only 关闭，整条链在一个 CLI 进程中执行。目录结果可通过 `SIRIL_DIRECTORY` 继续给序列处理节点。
- AutoStretch、Gaussian Blur 和 Negative 共用比较预览和正式 FITS 流程。通用节点共享日志控件。正式文件登记在默认 Workspace，有图像结果时输出图像文件路径，日志、序列和其他文件按各自端口处理。
- pyscript 接受宿主环境变量 `ASTROPHOTO_SIRIL_PYTHON_SCRIPTS` 中配置的绝对 Python 脚本路径，清单按系统路径分隔符分隔，通过 `file_path` 连接。会话默认离线，可使用 online 启用联网。set 支持临时会话内标量设置。StarNet 通过 `ASTROPHOTO_SIRIL_STARNET` 选择可执行文件。可选权重用 `ASTROPHOTO_SIRIL_STARNET_WEIGHTS` 设置。Astrometry.net 使用 `ASTROPHOTO_SIRIL_ASTROMETRY` 指定安装目录。

## 接口

后端命令表驱动原生 `/object_info`、`GET /astrophoto/v1/software/siril/commands` 和共享前端。命令比较用 `POST /astrophoto/v1/previews/siril/{command_id}` ，保留原 `/previews/autostretch` 和节点 ID `AstroPhotoSirilAutoStretch`。

## 用户流程

1. 在 AstroPhoto → Settings → 软件管理中打开对应服务器操作系统的安装指引。检测已安装的 Siril，或填入 ComfyUI 服务器上的完整 CLI 路径，验证并保存。
2. 在画布加入 FITS Source，选择已登记的单帧 FITS 或输入宿主合规路径，并把 FITS 路径连接到 Siril · AutoStretch。通用 Asset Source 也可提供已登记的文件路径。默认 Shadows clip 为 −2.8 σ、Target background 为 0.25，RGB 联动开启。
3. 修改输入或 Node 参数会更新候选。节点工具栏提供预览开关、图像对比、刷新和重置。图像对比窗口支持左右并排、滑动分割、单图切换、同步平移和缩放。可在右侧直接编辑当前画布节点的参数，也可拖动分隔线调整图像区宽度以及分析区和参数区的高度。若 WCS 或方向不足以确认一致，滑动分割禁用。

图像处理节点可复用 `frontend/src/features/nodes/preview/` 下的工具栏和图像对比组件，通过参数区插槽提供对应编辑控件。AutoStretch 将修改写回 ComfyUI 节点 Widget。节点使用宿主 `addDOMWidget` 挂载，工具栏采用 ComfyUI Frontend v1.59.1 `ImagePreview.vue` 的图标按钮和可访问命名方式，图像分割交互沿用现有 `VideoCompareSlider.vue` 适配。
4. 使用 ComfyUI 原生队列获取正式 FITS。正式结果发布到当前默认 Workspace，节点输出供下游使用的文件路径。工作流原生保存来源、参数和连线，重新打开后重新解析来源并生成候选。使用 Inspector 的收录操作或提交结果 ID 后，结果才进入 All Assets。

节点端口使用 ComfyUI V3 自定义 `IMAGE_PATH` 类型，值为 FITS 绝对路径字符串。Load Image 可从已登记资产解析路径，也可读取 ComfyUI 服务器进程可访问的合规本地路径。AutoStretch 接收路径并将正式结果的路径交给下游，可直接连接另一个 AutoStretch。Siril 读取路径时无需配置 `ASTROPHOTO_IMPORT_ROOTS`。原有 ASTRO_FRAME 或 STRING 端口的工作流需要重新连接节点。

`AstroPhoto Image Path` 使用宿主原生文本控件原样输出输入字符串。AutoStretch 读取时检查本地路径、文件状态和 FITS 内容，并沿用受信本机部署要求。CLI 使用受控临时目录中的工作副本。FITS 元数据与指纹用于内部校验、预览和回执，资产 ID 用于登记与查询。

## 实现与复用

| 文件 | 职责和实际取舍 |
|---|---|
| `extension/siril/software.py` | 发现、验证配置与受控 CLI 调用。 |
| `extension/siril/processing.py`、`previews.py` | 独立正式 FITS 与候选 PNG 生命周期。 |
| `extension/siril/bundle.py`、`node.py`、`routes.py` | 可选装配、V3 AutoStretch 注册及 Siril 请求路由。 |
| `astrophoto/assets/fits.py`、`astrophoto/api/scientific.py`、`nodes/scientific.py` | 通用 FITS 读写、来源、预览配置和 `IMAGE_PATH`，与处理 Bundle 解耦。 |
| `extension/siril/frontend/`、`frontend/src/host/fitsSource.tsx` | Bundle 提供软件设置、参数与候选界面；通用来源单独挂载。 |
| `tests/backend/test_siril.py`、`tests/integration/test_siril_api.py`、`frontend/tests/components/ScientificNodes.test.ts`、`frontend/tests/host/siril-host.mjs` | 后端、真实 HTTP、Vue Widget 交互和 ComfyUI 端到端证据。 |

路径端口复用 ComfyUI Backend 0.46.0 V3 的 `io.Custom` 和 `NodeOutput`。宿主将上游输出值直接交给下游，AstroPhoto 为 `IMAGE_PATH` 定义路径校验。UI 复用 Frontend 1.59.6 的 `registerExtension`、`nodeCreated`、`addDOMWidget`、`onWidgetChanged` 和 `fetchApi`，并沿用宿主主题与本地化。生命周期对齐官方 `uploadAudio.ts` 和 `previewAny.ts`。滑动分割的指针和键盘交互适配官方 `VideoCompareSlider.vue`。Siril 执行沿用 AstroPhoto 的受控目录及官方 CLI。

## 软件、HTTP 与存储

以下地址使用 `/astrophoto/v1` 前缀。当前软件配置和处理 API 沿用扩展的受信本机部署与请求校验，浏览器在同源请求中发送 `X-AstroPhoto-Local: 1`。宿主前置条件见[开发与验证](../development/setup-and-testing.md)。该部署假设信任同机用户与其选择的官方二进制。ComfyUI 原生队列的科学节点也验证宿主是否处于受信本地部署。

| 方法和路由 | 契约 |
|---|---|
| GET /software/siril | 服务器 OS、目标版本、状态，生效时包含路径、实际版本和验证时间。 |
| POST /software/siril/discover | 候选路径、来源、实际探测版本及验证状态，不自动写配置。 |
| PUT /software/siril | 接收绝对 CLI 路径。真实能力探测通过后，在同一次配置更新中保存路径并启用 Siril。 |
| DELETE /software/siril | 清除当前保存配置。 |
| GET /fits/assets?after= | 分页列出已登记 FITS 名称和资产 ID。像素有效性在读取时检查。 |
| GET /previews/settings | 返回 AstroPhoto 的预览 PNG 最长边、可选值、画布预览尺寸和设置修订号。 |
| PUT /previews/settings | 接收 `longest_edge`、`expected_revision` 和可选的 `canvas`，保存全局预览配置。 |
| POST /previews/autostretch | 输入 asset_id 或 image_path，另含 owner、parameters，可带已登记的 formal_id。返回 HTTP 202 与 job_id。 |
| GET /previews/jobs/{id} | queued/running/ready/failed/cancelled，包含可用图像、软件版本、尺寸、输入 revision、参数和错误。 |
| POST /previews/jobs/{id}/cancel | 请求取消；旧任务不会覆写新结果。 |
| GET /previews/jobs/{id}/validate | 重新检查缓存、素材 revision 和依赖。 |
| GET /previews/jobs/{id}/{before,after} | 读取确认归属的 PNG。 |

错误沿用 error.code / message / details 与顶层 request_id。正式结果在 assets.db 的 formal_outputs 表保存工作区位置和溯源。主动收录将同一个结果 ID 写入 assets/asset_locations。正式结果收录通过现行素材接口，详见 [HTTP 契约](../api/http/contracts.md#导入素材记录和文件)。持久文件为 Workspace 的 outputs/<run_id>/stretched.fit，manifest.json 记录输入 ID 和 revision、原始内容 SHA-256、参数、Siril 版本、输出位深、基本元数据、输出 SHA-256 和失败状态。生产结果先在同一 Workspace 独有临时目录生成并验证，再无覆盖发布并入库。经验证的源文件从不以写模式打开。恢复只处理与本实例及 Workspace 匹配、没有已登记资产的运行目录，重试分配新运行 ID。

「设置 → 环境配置」提供 512、1024、2048、4096 像素四档预览最长边，默认 1024。后端按比例将超过该边长的图像缩小，小图保留原尺寸。节点和 Inspector 共用缓存 PNG，Inspector 的 100% 对应 PNG 像素。候选和正式处理均使用原尺寸 FITS。

「设置 → 环境配置」的画布节点预览尺寸默认宽 480、最大高 320 个界面像素。节点较窄时预览随之缩小，图像等比完整显示。画布布局与 PNG 分辨率分别保存在 AstroPhoto 服务端设置中。AutoStretch 使用共享的画布预览样式和 PNG 尺寸配置。

预览 PNG 使用活动 Cache 的 previews 桶。每个候选在 processing 桶取得独立临时目录及锁。Cache 验证目录归属与空闲锁，按 Bundle 提供的目录前缀和已知文件名恢复中断任务。Siril 保留既有 `siril-` 目录前缀，旧的自有候选目录仍可恢复。Windows 探测目录遇到短暂共享冲突时有限重试清理。候选与正式执行由系统资源决定可运行规模，Cache 仍检查容量与磁盘空间。FITS 读取第一个有效的二维单色或三通道 RGB 图像 HDU，额外 HDU 可随源文件保留。若图像在扩展 HDU 中，处理副本会将该图像放入主 HDU。预览和处理副本中将非有限像素置零。AutoStretch 仍调用 Siril 的 set32bits，实际位深记录在回执中。

浏览器对该期源节点和已执行且未修改的直接上游 AutoStretch 自动获取候选。其他路径生产者和跨子图边界的自动候选解析尚未接入。正式队列由宿主执行。Windows 原生 Siril 子进程的环境副本会去掉 `MSYSTEM` 与 `MSYS`，避免从 MSYS2 Shell 启动 ComfyUI 时 Siril 报出初始化错误。进程取消和软恢复在旧端口契约下曾经测试；服务进程被强杀时，系统级外部子进程树清理没有跨平台验收。

## 验证边界

历史测试包含 Windows、Siril 1.4.5 和隔离 ComfyUI 环境；不能据此宣称当前工作树或其他平台已通过。适用测试及宿主前置条件见[开发与验证](../development/setup-and-testing.md)。外部进程被强杀后的跨平台子进程树清理仍需验证。
