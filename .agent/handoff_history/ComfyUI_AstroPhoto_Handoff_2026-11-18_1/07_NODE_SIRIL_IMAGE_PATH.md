# 节点、Siril 1.4.5 和 IMAGE_PATH

## 实际节点与入口

| V3 ID | 入口和键 | 当前行为 |
|---|---|---|
| vue-basic | nodes/ComfyUIFEExampleVueBasic.py → ComfyUI 原生 LoadImage | Widget 提供 temp PNG 路径，返回宿主 IMAGE。工作流像素恢复经测试，历史正式 IMAGE 委托失败仍未重测。 |
| AstroPhotoImagePath | nodes/scientific.py:13 → execute(image_path) | 把 STRING 作为轻量 IMAGE_PATH 输出。这个节点不检验文件，使用者负责验证。 |
| AstroPhotoFITSSource | nodes/scientific.py:40 → resolve_input/fits_frame | 内部 ASTRO_FITS_ASSET picker 取注册 ID 或兼容路径，返回绝对 IMAGE_PATH 和 astrophoto_asset UI payload。 |
| AstroPhotoSirilAutoStretch | nodes/scientific.py:64 → parameters/resolve_input/formal_run | IMAGE_PATH 与 shadowsclip、targetbg、linked；返回新受管 FITS 路径，并发布 job/node UI 信息。旧 ASTRO_FRAME 工作流需要重新连接。 |

## 参数、文件、执行与保护

- 参数数值及缺省值出自 Schema 和 processing.parameters（astrophoto/siril/processing.py:24）。正式处理同一验证链，拒绝 bool 冒充 number、非有限值及 targetbg 越界。shadowsclip 的后端保证是值有限，linked 只作用于 RGB；UI 单色禁用关联控制。 画布与 Inspector 均可编辑当前节点参数，Inspector 通过同一 widget 写入。
- frames.resolve_input:17 对 canonical UUID 调 AssetService。路径先尝试匹配注册位置，找不到才走可读绝对本地路径。storage.manager.source_stat:25 拒绝相对路径/不支持文件、共享及链接边界，实际精细行为见 [Siril 专项](evidence/subagents/nodes-siril.md)。IMAGE_PATH 原文是轻量契约，不能将包含真实物理路径的 HTTP 面向不可信来源。
- frames.fits_frame:80 检查 .fit/.fits/.fts、存在及 stat fingerprint，以 Astropy readonly memmap 选择首个支持的 mono/RGB HDU、验证 header 与形状；预览代理转换 NaN/±Inf 为零。processing.prepare_fits:57 将科学工作副本规范化交给 Siril，并保持原件不改变。整个图像的显示数组仍按原始尺寸分配，即使最后输出较小 PNG。
- software.SoftwareService:85 拆分发现、验证保存、清空和启停。禁止 GUI EXE、错误文件名或不受支持版本；配置保存前会以实际 CLI 探测，错误保留旧配置。run_cli:56 不用 shell，检查进程退出与取消，探测有限时，正式与候选处理无默认 wall-clock timeout。先检查空闲空间和文件身份，暂存与正式产物隔离。
- processing.process:34 固定脚本 load → autostretch → save，使用内部生成目录与文件名。output FITS 必须存在，解析合法，尺寸及通道符合源。formal_run:159 从当前默认 Workspace 的自有运行目录处理并注册 Asset，recover_runs:207 区分已入库、未注册和未完成，清理仅限自有运行目录。跨进程 crash 窗口须照 [Guard](05_DEFENSIVE_PROGRAMMING_AUDIT.md) 理解。
- previews.PreviewService:40 使用 Cache 并按 owner 替换、取消旧任务，提供 status、validation、before/after 与 Cache 租约。正式结果与源/参数匹配时用于显示。候选失败仍可保留 before 与 error。进程内状态不等同于持久正式 run，未配置 Siril 也可显示合法源图。

## 本轮验收边界

- 崭新的真实 FITS 和 Windows Siril 1.4.5 在临时 Workspace 下，验证源字节、正式输出科学像素变化与登记、不同结果隔离、直接路径和取消。确切断言见 tests/backend/test_siril.py:155–210。
- aiohttp TestServer 验证授权与错误、候选前图和 CLI 未配置回执。V3 调用边界另有 API stub 与 8207 真实 Schema GET。
- 本轮未用真实 ComfyUI 排队执行。完整宿主工作流/Inspector 的历史证据归 docs/siril.md 与 .agent/notes/siril-autostretch.md。当前 Hook 对复杂 subgraph input 的解析、真实高容量和 Linux/macOS 行为仍未验证。

