# Siril 1.4.5 与 AutoStretch

需求基线为 .artifact/Siril_Integrate 下的 PRD v1.1，开发指南用于实施。目录中有两份 Markdown，未找到单独的 Inspector HTML 原型，布局采用 PRD 第 5 节。基线工作树 main HEAD 5e39fcf352995918c3ba3d06b88cd61a2cbeca1a 已含未提交 Storage、设备/光路、MCP 和 React 变更，本轮在其上增量开发。

## 用户流程

1. 在 AstroPhoto → Settings → 软件管理中打开对应服务器操作系统的安装指引。检测已安装的 Siril，或填入 ComfyUI 服务器上的完整 CLI 路径，验证并保存。
2. 从 Assets 导入单帧 FITS。在画布加入 FITS Source，选择资产，并把 FITS 路径连接到 Siril · AutoStretch。默认 Shadows clip 为 −2.8 σ、Target background 为 0.25，RGB 联动开启。
3. 修改输入或 Node 参数会更新候选。节点工具栏提供预览开关、图像对比、刷新和重置。图像对比窗口支持左右并排、滑动分割、单图切换、同步平移和缩放。可在右侧直接编辑当前画布节点的参数，也可拖动分隔线调整图像区宽度以及分析区和参数区的高度。若 WCS 或方向不足以确认一致，滑动分割禁用。

图像处理节点可复用 `frontend/ui/src/features/nodePreview/` 下的工具栏和图像对比组件，通过参数区插槽提供对应编辑控件。AutoStretch 将修改写回 ComfyUI 节点 Widget。节点使用宿主 `addDOMWidget` 挂载，工具栏采用 ComfyUI Frontend v1.59.1 `ImagePreview.vue` 的图标按钮和可访问命名方式，图像分割交互沿用现有 `VideoCompareSlider.vue` 适配。
4. 使用 ComfyUI 原生队列获取正式 FITS。资产登记在当前默认 Workspace，节点输出供下游使用的文件路径。工作流原生保存资产 ID、参数与连线，重新打开后重新解析资产并生成候选。已生成的 FITS 通过 Assets 提供持久引用。

节点端口使用 ComfyUI V3 自定义 `IMAGE_PATH` 类型，值为 FITS 绝对路径字符串。Load Image 可从已登记资产解析路径，也可读取 ComfyUI 服务器进程可访问的合规本地路径。AutoStretch 接收路径并将正式结果的路径交给下游，可直接连接另一个 AutoStretch。Siril 读取路径时无需配置 `ASTROPHOTO_IMPORT_ROOTS`。原有 ASTRO_FRAME 或 STRING 端口的工作流需要重新连接节点。

`AstroPhoto Image Path` 使用宿主原生文本控件原样输出输入字符串。AutoStretch 读取时检查本地路径、文件状态和 FITS 内容，并沿用受信本机部署要求。CLI 使用受控临时目录中的工作副本。FITS 元数据与指纹用于内部校验、预览和回执，资产 ID 用于登记与查询。

## 实现与复用

| 文件 | 职责和实际取舍 |
|---|---|
| **新增** astrophoto/siril/software.py | PATH/标准位置定位、原生二进制检查、Siril 版本和合成 RGB 实际处理验证、超时/取消与 config/settings.json 原子保存。 |
| **新增** astrophoto/siril/frames.py | AssetService 解析已登记路径；Astropy 检查 FITS 并提取元数据用于验证和回执；Pillow 生成可重建 PNG。 |
| **新增** astrophoto/siril/processing.py | 固定 CLI 脚本、源/输出 SHA-256、Workspace 专属锁、结果与运行回执、资产登记、未登记产物重入恢复。 |
| **新增** astrophoto/siril/previews.py | 候选作业隔离、状态/取消、缓存键以及正式结果的只读显示。 |
| **新增** astrophoto/siril/__init__.py、astrophoto/api/siril.py、nodes/scientific.py | 软件、FITS 枚举与预览路由；V3 源节点和处理节点。 |
| **修改** __init__.py、astrophoto/api/{routes,storage,errors}.py、astrophoto/core/capabilities.py、astrophoto/storage/{runtime,cache}.py | 复用 host on_load、RouteTableDef、现有直接本地受信授权、Workspace/Cache 和状态能力。 |
| **修改** pyproject.toml、requirements.txt、uv.lock | Extension 依赖 Astropy 和 Pillow。Registry 不携带第三方 CLI。 |
| **新增** frontend/ui/src/api/siril.ts、frontend/ui/src/features/settings/SoftwarePage.tsx、frontend/ui/src/features/siril/{Inspector.tsx,siril.css}、frontend/ui/src/host/scientific.tsx、locales/zh/nodeDefs.json | 单入口下的软件页和科学节点 DOM Widget。Inspector 的参数控件写回当前宿主节点。 |
| **修改** frontend/ui/src/{api/client.ts,features/settings/SettingsPage.tsx,main.tsx,i18n/locales/en/main.json,i18n/locales/zh/main.json}、js/{main.js,assets/main.css} | Settings 注册、统一错误与超时、双语和共享构建产物。 |
| **新增** tests/backend/test_siril.py、tests/integration/test_siril_api.py、frontend/ui/src/__tests__/siril.test.tsx、frontend/ui/siril-host.mjs | 进程、文件、HTTP、React 和真实 ComfyUI 浏览器验收。 |
| **修改** tests/{conftest.py,nodes/test_registration.py}、frontend/ui/{check-build.mjs,check-proxy.mjs} | 原生 V3 注册与共存回归，构建仍只有一个可发现 JS。 |

路径端口复用 ComfyUI Backend 0.45.0 V3 的 `io.Custom` 和 `NodeOutput`。宿主将上游输出值直接交给下游，AstroPhoto 为 `IMAGE_PATH` 定义路径校验。UI 复用 Frontend 1.59.1 的 `registerExtension`、`nodeCreated`、`addDOMWidget`、`onWidgetChanged` 和 `fetchApi`，并沿用宿主主题与本地化。生命周期对齐官方 `uploadAudio.ts` 和 `previewAny.ts`。滑动分割的指针和键盘交互适配官方 `VideoCompareSlider.vue`。Siril 执行沿用 AstroPhoto 的受控目录及官方 CLI。

## 软件、HTTP 与存储

以下地址使用 /astrophoto/v1 前缀。软件路径和处理权限沿用显式 ASTROPHOTO_LOCAL_STORAGE=1、直接 loopback、单用户、同源请求和 X-AstroPhoto-Local 机制。该部署假设信任同机用户与其选择的官方二进制。ComfyUI 原生队列的科学节点也验证宿主是否处于受信本地部署。

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

错误沿用 error.code / message / details 与顶层 request_id。正式结果用现有 assets.db 的 assets/asset_locations 表，不增加数据库、表或迁移。持久文件为 Workspace 的 outputs/<run_id>/stretched.fit，manifest.json 记录输入 ID 和 revision、原始内容 SHA-256、参数、Siril 版本、输出位深、基本元数据、输出 SHA-256 和失败状态。生产结果先在同一 Workspace 独有临时目录生成并验证，再无覆盖发布并入库。经验证的源文件从不以写模式打开。恢复只处理与本实例及 Workspace 匹配、没有已登记资产的运行目录，重试分配新运行 ID。

「设置 → 环境配置」提供 512、1024、2048、4096 像素四档预览最长边，默认 1024。后端按比例将超过该边长的图像缩小，小图保留原尺寸。节点和 Inspector 共用缓存 PNG，Inspector 的 100% 对应 PNG 像素。候选和正式处理均使用原尺寸 FITS。

「设置 → 环境配置」的画布节点预览尺寸默认宽 480、最大高 320 个界面像素。节点较窄时预览随之缩小，图像等比完整显示。画布布局与 PNG 分辨率分别保存在 AstroPhoto 服务端设置中。AutoStretch 使用共享的画布预览样式和 PNG 尺寸配置。

预览 PNG 使用活动 Cache 的 previews 桶。每个候选在 processing 桶取得独立临时目录及锁。候选与正式执行由系统资源决定可运行规模，Cache 仍检查容量与磁盘空间。FITS 读取第一个有效的二维单色或三通道 RGB 图像 HDU，额外 HDU 可随源文件保留。若图像在扩展 HDU 中，处理副本会将该图像放入主 HDU。预览和处理副本中将非有限像素置零。AutoStretch 仍调用 Siril 的 set32bits，实际位深记录在回执中。

浏览器对该期源节点和已执行且未修改的直接上游 AutoStretch 自动获取候选。其他路径生产者和跨子图边界的自动候选解析尚未接入。正式队列由宿主执行。进程取消和软恢复在旧端口契约下曾经测试；服务进程被强杀时，系统级外部子进程树清理没有跨平台验收。

## 测试与证据

当前路径链重新在独立 Windows ComfyUI 0.45.0 / Frontend 1.59.1 和 Siril 1.4.5 上通过原生队列验证。图像路径节点直接连接两个串联的 AutoStretch。第二个节点的输入哈希与第一个节点的输出哈希一致，两个输出均在隔离测试 Workspace 中，原件哈希保持一致。Prompt ID 为 `b4b3983a-e730-4d80-a85a-2bccdacbb914`。宿主验证通过原生 HTTP 队列执行。Inspector 的生产 NodeView 回归通过受控宿主替身挂载，验证参数写入、重置、预览 HTTP 请求、宿主编辑限制与单色禁用联动。React 11 个套件共 51 项通过。

2026-11-18 在 Windows 隔离宿主 ComfyUI 0.45.0 / Frontend 1.59.1 上使用官方 Siril 1.4.5 重新验证了 `IMAGE_PATH`。直接输入带空格的未登记 FITS 路径，经授权根目录校验后完成候选预览、Inspector、参数修改、正式处理及工作流保存重开。输出位于第二 Workspace，输入 SHA-256 保持一致。Prompt ID 为 `75def43a-cd64-4f59-a70d-97070a5c31c4`。

下表记录的是修改为路径端口之前的实现。

| 级别 | 实际命令或路径 | 结果 |
|---|---|---|
| E0 基线 | uv run pytest tests/nodes tests/backend tests/integration tests/packaging -q | 67 通过，3 跳过。 |
| E0 前端基线 | pnpm -C frontend test:react | 设备筛选工具栏用例首次失败，最终完整复跑通过，本轮未修改设备代码。 |
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

