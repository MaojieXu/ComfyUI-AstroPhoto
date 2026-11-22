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

## AutoStretch 历史与已有验证

需求基线为 .artifact/Siril_Integrate 下的 PRD v1.1，开发指南用于实施。目录中有两份 Markdown，未找到单独的 Inspector HTML 原型，布局采用 PRD 第 5 节。基线工作树 main HEAD 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a 已含未提交 Storage、设备/光路、MCP 和 React 变更，本轮在其上增量开发。

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

以下地址使用 `/astrophoto/v1` 前缀。当前软件配置和处理 API 沿用扩展的受信本机部署与请求校验，浏览器在同源请求中发送 `X-AstroPhoto-Local: 1`。宿主前置条件见[开发与验证](development.md)。该部署假设信任同机用户与其选择的官方二进制。ComfyUI 原生队列的科学节点也验证宿主是否处于受信本地部署。

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

错误沿用 error.code / message / details 与顶层 request_id。正式结果在 assets.db 的 formal_outputs 表保存工作区位置和溯源。主动收录将同一个结果 ID 写入 assets/asset_locations。升级到 0002_photography_library 会回填旧版已登记的正式 Siril 结果。持久文件为 Workspace 的 outputs/<run_id>/stretched.fit，manifest.json 记录输入 ID 和 revision、原始内容 SHA-256、参数、Siril 版本、输出位深、基本元数据、输出 SHA-256 和失败状态。生产结果先在同一 Workspace 独有临时目录生成并验证，再无覆盖发布并入库。经验证的源文件从不以写模式打开。恢复只处理与本实例及 Workspace 匹配、没有已登记资产的运行目录，重试分配新运行 ID。

「设置 → 环境配置」提供 512、1024、2048、4096 像素四档预览最长边，默认 1024。后端按比例将超过该边长的图像缩小，小图保留原尺寸。节点和 Inspector 共用缓存 PNG，Inspector 的 100% 对应 PNG 像素。候选和正式处理均使用原尺寸 FITS。

「设置 → 环境配置」的画布节点预览尺寸默认宽 480、最大高 320 个界面像素。节点较窄时预览随之缩小，图像等比完整显示。画布布局与 PNG 分辨率分别保存在 AstroPhoto 服务端设置中。AutoStretch 使用共享的画布预览样式和 PNG 尺寸配置。

预览 PNG 使用活动 Cache 的 previews 桶。每个候选在 processing 桶取得独立临时目录及锁。Cache 验证目录归属与空闲锁，按 Bundle 提供的目录前缀和已知文件名恢复中断任务。Siril 保留既有 `siril-` 目录前缀，旧的自有候选目录仍可恢复。Windows 探测目录遇到短暂共享冲突时有限重试清理。候选与正式执行由系统资源决定可运行规模，Cache 仍检查容量与磁盘空间。FITS 读取第一个有效的二维单色或三通道 RGB 图像 HDU，额外 HDU 可随源文件保留。若图像在扩展 HDU 中，处理副本会将该图像放入主 HDU。预览和处理副本中将非有限像素置零。AutoStretch 仍调用 Siril 的 set32bits，实际位深记录在回执中。

浏览器对该期源节点和已执行且未修改的直接上游 AutoStretch 自动获取候选。其他路径生产者和跨子图边界的自动候选解析尚未接入。正式队列由宿主执行。Windows 原生 Siril 子进程的环境副本会去掉 `MSYSTEM` 与 `MSYS`，避免从 MSYS2 Shell 启动 ComfyUI 时 Siril 报出初始化错误。进程取消和软恢复在旧端口契约下曾经测试；服务进程被强杀时，系统级外部子进程树清理没有跨平台验收。

## 测试与证据

当前路径链重新在独立 Windows ComfyUI 0.45.0 / Frontend 1.59.1 和 Siril 1.4.5 上通过原生队列验证。图像路径节点直接连接两个串联的 AutoStretch。第二个节点的输入哈希与第一个节点的输出哈希一致，两个输出均在隔离测试 Workspace 中，原件哈希保持一致。Prompt ID 为 `b4b3983a-e730-4d80-a85a-2bccdacbb914`。宿主验证通过原生 HTTP 队列执行。Inspector 的生产 NodeView 回归通过受控宿主替身挂载，验证参数写入、重置、预览 HTTP 请求、宿主编辑限制与单色禁用联动。React 11 个套件共 51 项通过。

2026-11-18 在 Windows 隔离宿主 ComfyUI 0.45.0 / Frontend 1.59.1 上使用官方 Siril 1.4.5 重新验证了 `IMAGE_PATH`。直接输入带空格的未登记 FITS 路径，经授权根目录校验后完成候选预览、Inspector、参数修改、正式处理及工作流保存重开。输出位于第二 Workspace，输入 SHA-256 保持一致。Prompt ID 为 `75def43a-cd64-4f59-a70d-97070a5c31c4`。

下表记录的是修改为路径端口之前的实现。

| 级别 | 实际命令或路径 | 结果 |
|---|---|---|
| E0 基线 | uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q | 67 通过，3 跳过。 |
| E0 前端基线 | pnpm -C frontend test | 设备筛选工具栏用例首次失败，最终完整复跑通过，本轮未修改设备代码。 |
| L1/L2/L3 | 设置 ASTROPHOTO_SIRIL_TEST_CLI 后运行 uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q 及隔离 uv run --python 3.11 pytest tests/nodes tests/backend tests/integration tests/packaging -q | Python 3.12 与 3.11 各 79 通过、3 跳过。含真实 SQLite/aiohttp、真实 CLI 自动发现/验证/处理；版本拒绝使用 Mock。取消和超时用真实独立测试子进程。 |
| L1 | uv run --project mcp pytest mcp/tests -q | 67 通过。 |
| 前端 | pnpm -C frontend typecheck、lint、test:react | 类型和 lint 通过，React 45 通过。 |
| Chromium | pnpm -C frontend test、check:build、check:proxy | Vue 9 通过，单 JS 与 CSS，以及代理前缀资源验证通过。 |
| 静态 | uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py；uv lock --check | 通过。 |
| L4 | pnpm -C frontend exec node ui/siril-host.mjs --expect-discovery；天文样本额外使用 --expect-unaligned | 真实 Windows comfyenv、Backend 0.45.0+33、Frontend 1.59.1，端口 8205。RGB 和 Horsehead 两次完整通过。 |
| L4 | COMFYUI_TEST_URL=http://127.0.0.1:8205 uv run pytest tests/integration -m host -q | 1 通过，7 未选。实际宿主 status 与 vue-basic V3 注册仍有效。 |
| L4 跨卷 | 重跑 ui/siril-host.mjs，读 C: 的已登记 RGB FITS，输出证据与外置 Workspace 写入 D: | 第三次完整通过。Cache 仍在 C:。 |
| L5 | uv run python scripts/release.py registry --output <隔离目录>/registry.zip；uv build --package astrophoto-mcp --out-dir <隔离目录>/mcp；uv run python scripts/release.py artifacts --registry ... --wheel ... --sdist ... | Registry 53 文件，wheel 16，sdist 23。 |

真实浏览器从软件检测与校验开始，登记外部 FITS、经 V3 节点连线、逐项修改可用参数并验证候选刷新、切换 Inspector，使用宿主队列提交正式处理，最后以原生工作流 JSON 重新打开。两个样本的结果均登记到独立 Workspace，原图 SHA-256 前后一致。通过 Astropy 复查 FITS 像素有限、维度不变、像素发生变化。

| 样本 | Prompt ID | FITS |
|---|---|---|
| 合成 RGB 96×96 | f04ab85b-2688-4588-8c07-0ee94643fd3c | 64edb4ee-a0a6-4288-a138-bcbd48e6feb7，BITPIX −32 → −32。三种 Inspector 模式与同步平移通过。 |
| Horsehead 主 HDU 891×893 | c562b5e9-9f1b-4054-9544-5ed01ed01407 | d72d3de5-91e0-4593-ac3b-61654fa76cbe，BITPIX 16 → 16。Siril 重写 WCS，滑动分割按预期禁用。 |
| 合成 RGB C: → D: | 5b11249a-9470-46b8-8dca-b446873015d8 | c1cdb7a8-7b61-497e-a31c-8728c264ef3b，BITPIX −32 → −32。 |

Horsehead 测试素材从 [Astropy 教程数据](https://github.com/astropy/astropy-data/blob/gh-pages/tutorials/FITS-images/HorseHead.fits) 的主图像 HDU 另存为测试文件，保留该图像像素和头信息，省去辅助表。第三方二进制来自 [Siril 1.4.5 官方发布](https://siril.org/download/2026-10-28-siril-1-4-5/)。二者及证据均在隔离临时目录，不进入 Registry 或 Git。

### PRD 验收

- **AC-01–04 PASS，Windows**。官方指引、真实自动检测/保存、错误路径、1.4.5 正式探测、V3 注册及连线已验。1.4.4/1.5 拒绝逻辑有 Mock 证据。
- **AC-05–08 PASS，覆盖实测图像尺寸**。原生参数、RGB/单色语义、候选刷新、三种模式、键盘/拖动分割和只读参数区已验。大图原始像素级细节受代理采样上限约束。
- **AC-09–11 PASS，Windows**。真实 FITS 输出、显式错误保护、旧产物保留、原图散列和原生保存重开已验。进程超时/取消与崩溃回执恢复为隔离测试证据。
- **AC-12 PASS，Windows 同卷与 C: → D:**。独立 Workspace、中文/英文和宿主 Light/Dark。macOS 和 Linux 为 NOT_RUN。
- **AC-13 PASS，Windows**。真实 Siril 1.4.5、真实 ComfyUI 0.45.0/1.59.1、双包本地预检。既有 vue-basic 的 IMAGE 委托历史问题本轮未改动，旧 Widget 通过 Vue 单测及原生节点加载回归。

