# PH-04C 实现启动提示词｜AstroPhoto 前端技术栈迁移

> 用途：交给负责**业务实现**的 Agent（新会话亦可）作为唯一启动说明。本文与 Feature 文档冲突时，以 Feature 文档的当前版本为准，本文只规定**工作方式**。
> 生成日期：2026-11-21 · 本文保留实施前交接内容。现行阶段、产物和测试结果见 [Feature 索引](../00_FEATURE_INDEX.md)。

---

## 0. 角色、授权与边界

你是本 Feature 的**实现者**（PH-04C）。本轮授权范围是：按 [开发规格](../04_DEV.md) 修改**前端与必要的 Bundle 装配代码**，并同步更新相关 Feature 文档。

**授权内**

- 新建/修改 `frontend/`、`extension/` 下的前端与装配代码
- 需要时调整 `frontend/package.json`、`vite.config.mts`、`tsconfig`、`eslint`、Vue/React 插件与测试配置
- 按 [开发规格第 2 节](../04_DEV.md#2-迁移顺序) 移动/改写现有前端源码
- 更新 `04_DEV.md`、`05_TEST_PLAN.md`、`06_TEST_REPORT.md`、`00_FEATURE_INDEX.md`

**授权外（先停下并说明，不要自行扩大）**

- 修改 `nodes/`、`astrophoto/` 的**业务语义**（SQLite 结构、路由契约、FITS 处理算法、权限模型）
- 修改 `mcp/`、`.agents/handoff/` 之外的其它文档体系
- `git commit` / `git push` / 发版 / 安装到真实宿主 / 修改宿主 ComfyUI 源码
- 删除拍摄原片、Workspace 文件、未知数据库或用户数据
- 为通过验收而降低 PRD 验收条件（[01_PRD.md](../01_PRD.md) FR-01–FR-09）

**测试时序（项目既定偏好）**：先完成业务实现，再定稿测试规格、编写测试并集中执行。开发期间不预生成测试文件、不逐函数跑回归；仅当真实 Bug 需要定位时写最小定向用例。详见根 [AGENTS.md](../../../../../AGENTS.md)。

---

## 1. 读取顺序（按此顺序，读完再动手）

1. 根 `AGENTS.md`：项目约束与业务域边界
2. [00_FEATURE_INDEX.md](../00_FEATURE_INDEX.md)：当前状态、已定决定、阻塞、接续点
3. [01_PRD.md](../01_PRD.md)：FR-01–FR-09 与验收条件（产品权威）
4. [02_UI_UX.md](../02_UI_UX.md)：页面、状态清单、键盘无障碍、Assets 占位决定
5. [03_TECH.md](../03_TECH.md)：目录、接口、决策 D-01–D-06、风险 R-01–R-07、切片
6. [04_DEV.md](../04_DEV.md)：七步迁移、符号级入口、完成定义（**执行主依据**）
7. [05_TEST_PLAN.md](../05_TEST_PLAN.md)：CASE-01–10、夹具、质量门
8. `.agents/skills/feature-pipeline/reference/04C-implementation.md`、`06-test-execution.md`：流程要求

仓库有 `.codegraph/` 索引：定位代码与调用链优先用 `codegraph explore "<符号或问题>"`，再核对源码，不要用全仓 grep 代替。

---

## 2. 当前基线与既有事实（不要重复劳动）

- **代码基线**：HEAD `4c0cf4de91375f9eeb82997eee3aaa3bf99049b2`。工作树**不干净**，先跑 `git status` 看清：
  - 已暂存的 `.agent/ → .agents/` 交接文档迁移（大量 `D`/`R`）
  - 文档类修改（`AGENTS.md`、`docs/`、`.agents/handoff/`、本 Feature 文档）
  - `.comfyignore`：仅删除已迁移的 `.agent/` 一行
  - `.github/workflows/ci.yml`：Node `22 → 26.13.1`
  - 不要回退以上改动，不要 `git checkout` 覆盖他人工作
- **运行时不变量**：本机 Node `v26.13.1`；CI Node `26.13.1` + pnpm `11.13.1`；官方目标 Frontend `1.59.6`（Node `>=26.8.2 <27`）。本机 shell 可能没有 pnpm，用 corepack 或项目既有方式。
- **已定决定**（不要重新讨论）：
  - `Q-01`/`D-01`：保留 `Assets` 标签，内容为 **Vue 占位页**，无任何数据请求，默认落点不变
  - `Q-02`/`D-02`：CI 已提升，待流水线复跑
  - `Q-04`：不保留旧入口与跨框架兼容层
  - `D-03`：类型包无 `1.59.6`（`1.59.1` 后直接 `1.60.0`），**保持锁 `1.59.1`** + 逐符号对照官方 `v1.59.6` 源码，不默认升级 `1.60.0`
- **并行任务**：目标宿主 `v0.46.0` / Frontend `1.59.6` 的安装与迁移前基线采集由**另一个 Agent** 处理。不要重复安装；开工前确认基线是否就绪，若未就绪先做不依赖宿主的静态/构建工作，并记录该缺口。
- **未决但可绕过**：`D-04`（通用 FITS 与 `IMAGE_PATH` 归属）在步骤 5 前置项确认前，不移动后端文件。

---

## 3. 执行方式

### 3.1 步骤顺序

严格按 [04_DEV.md §2](../04_DEV.md#2-迁移顺序) 的 **0 → 1 → 2 → 3/4 → 5 → 6**。每步结束对照 [完成定义与出口条件](../04_DEV.md#完成定义与出口条件) 自检；未满足的条件不要用“已完成”表述，写在 `04_DEV.md` 对应步骤下。

步骤 3 与 4 可在步骤 2 通过后并行。步骤 6（切换发行入口、移除 React）必须最后做，且只注册一套侧栏。

### 3.2 必须保持的契约（破坏即视为回归）

- 节点 ID `vue-basic`、类型 `CUSTOM_VUE_COMPONENT_BASIC`、输入名 `custom_vue_component_basic`、输出名 `image`、category `examples`
- 绘图 Widget 的 `getValue`/`setValue`（像素）与 `serializeValue`（上传临时 PNG → `threed/<name> [temp]`）
- 科学节点的 `IMAGE_PATH`、FITS 精度与元数据、正式队列回执
- 侧栏注册 ID `astrophoto.sidebar`
- 产物路径 `js/main.js`、`js/assets/main.css`、根 `locales/`、`WEB_DIRECTORY` 与代理子路径
- 后端 `on_load` 装配与 `/astrophoto/v1/*` 契约

### 3.3 依赖与工作区隔离

Python 用 `uv`（`.python-version` = 3.12，发行最低 3.11）；前端用 `pnpm`。**不要**把 uv 环境同步进 ComfyUI 宿主环境。

---

## 4. 偏离处理：与 `04_DEV.md` 不符时怎么办

这是本轮**强制动作**，不是可选记录。触发条件：实际文件路径、函数/符号名、调用者、数据流、拒绝分支、副作用顺序与 `04_DEV.md` 不符，或某步无法按其描述完成。

处理顺序：

1. **先判断性质**
   - 仅实现细节不同 → 直接按现实实现，并回写文档
   - 改变用户可见行为 / 验收条件 / 范围 → **停止实现**，按 [09 变更传播](../../../../skills/feature-pipeline/reference/09-change-propagation.md) 上报（涉及 PRD 或 UX 的改动不得由实现者单方决定）
2. **同轮回写** `04_DEV.md` 对应步骤：
   - 实际路径与符号、与设计不同的原因
   - 迁移前后的调用者变化
   - 未迁移的分支与后续验证
   - 新增/删除的依赖与配置项
3. **同步受影响文档**：接口或目录变化 → `03_TECH.md`；状态/文案/焦点变化 → `02_UI_UX.md`；用例落点变化 → `05_TEST_PLAN.md`；阶段状态变化 → `00_FEATURE_INDEX.md`
4. 在 `06_TEST_REPORT.md` 记录该偏离是否已被验证覆盖

**禁止**：把未实现的分支写成“已实现”，把待验证写成“已验证”，或删掉设计中原有但暂未完成的内容。

---

## 5. 测试新增与测试计划更新

- `05_TEST_PLAN.md` 现为 **v0.4 模式 A（预计规格）**，CASE 编号与子项编号（`01-A`…`10-B`）**保持不变**。
- 实现期间若发现需要新增用例：追加到现有 CASE 下的新子项；确需新 CASE 时用 **CASE-11 起**，并同步更新第 2 节追溯表、第 4 节失败分支、第 6 节质量门。
- 业务实现完成后进入 **模式 B 冻结**（[05_TEST_PLAN.md §5](../05_TEST_PLAN.md#5-执行冻结与证据)）：把预计路径替换为真实 `path:symbol`、真实测试文件、真实命令；标明保留/调整/排除的预计项。
- 冻结后再写测试代码并集中执行。测试文件命名与位置按仓库既有约定（Vitest 于 `frontend/tests/`，宿主脚本于 `frontend/ui/*.mjs`）。
- 不得为了让用例通过而修改断言期望值；断言依据必须能追到 PRD 验收条件或既有契约。

---

## 6. `06_TEST_REPORT.md` 构建要求

按 `.agents/skills/feature-pipeline/reference/06-test-execution.md` 创建，至少包含：

| 栏目 | 内容 |
| --- | --- |
| 运行标识 | `run-id`、日期、执行者（Agent 标识） |
| 基线 | HEAD、相关未提交改动的文件清单与摘要、`pnpm-lock`/`uv.lock` 是否变化 |
| 环境 | 宿主与 Frontend 版本、Python、Node、pnpm、浏览器、操作系统、Siril 版本（如适用） |
| 用例结果 | 按 CASE/子项逐条：`PASS / FAIL / BLOCKED / SKIP / 未执行`，附命令、关键输出、证据路径 |
| 失败与修复 | 失败现象 → 根因 → 修改 → 重跑结果；保留**首次失败**记录，不覆盖 |
| 重试记录 | 见下节字段 |
| 跳过与阻塞 | 原因、影响的验收项、解除条件 |
| 未覆盖 | 已知缺口与后续归属 |

**重试记录字段（每次重试一行/一段，必填）**

```
尝试 #n
- 触发：命令或操作 + 失败现象（关键报错/状态）
- 假设：认为的原因
- 改动：改了什么（文件:符号）
- 结果：仍失败 / 通过 / 改换方向
- 证据：日志、截图、请求记录路径
- 是否改变设计：若改变，指向 04_DEV.md 的回写位置
```

---

## 7. 出错与重试纪律

1. **先记录再生效**：任何修复尝试前先写“触发 + 假设”，避免连续盲改。
2. **保留原失败**：修复后开新运行记录，不删除或改写旧的失败结论。
3. **同类失败上限**：同一问题连续 **3 次**修复失败 → 停止，写 `BLOCKED` 并上报：缺什么、卡在哪、需要谁决定。
4. **不得伪造通过**：不用 `skip`、放宽断言、删除用例、`any` 逃逸或注释代码来“通过”。类型问题必须显式记录。
5. **环境类失败单独归类**：宿主未就绪、CLI 缺失、权限不足导致的失败记 `BLOCKED`，不计为代码失败。
6. **服务端/并发类问题**：先确认是否既有行为（读 `tests/integration/`），不得为实现方便擅改后端契约。
7. **回退纪律**：某步实现导致既有基线用例失败且 3 次内无法修复 → 回退该步改动、保留分支说明，并把结论写入 `04_DEV.md` 与报告。

---

## 8. 何时必须停下问，而不是继续

- 需要改变 PRD 验收条件、范围排除或用户可见导航（除已定的 Assets 占位）
- 需要修改后端业务语义或数据库结构
- 需要升级/更换宿主类型包（`D-03` 已定：不升级）
- 需要超出官方公开接口深度依赖宿主内部实现
- 发行包白名单需要变更但会影响 MCP 或 Registry 语义
- 发现两份文档相互矛盾且无法判断权威版本

停下时输出：**具体缺口 + 证据位置 + 可选方案 + 影响范围 + 建议**，其余不依赖该决定的工作继续推进。

---

## 9. 常用命令（现有入口，迁移后按实际更新并回写 05）

```bash
# 前端
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend typecheck
pnpm -C frontend lint
pnpm -C frontend build
pnpm -C frontend test            # build + vitest
pnpm -C frontend test:react      # 仅作迁移前基线
pnpm -C frontend check:build
pnpm -C frontend check:proxy
pnpm -C frontend test:host --skip-image-execution
pnpm -C frontend test:equipment-host
pnpm -C frontend test:storage-host   # 含素材段，按需拆分

# 后端与发行
uv run pytest tests/nodes tests/backend
uv run pytest tests/packaging
uv run python scripts/release.py check
```

命令不存在或已改名时：不要静默跳过，记入报告并回写 `04_DEV.md` 的验证入口表。

---

## 10. 交付物清单（完成时逐项自查）

- [ ] 步骤 0–6 按完成定义逐条放行，未达成项显式记录
- [ ] `frontend/src/` 结构符合 [技术设计 §2](../03_TECH.md#2-文件结构)，`extension/frontend-entry.ts` 与 `extension/siril/` 就位
- [ ] `Assets` 为 Vue 占位页，无素材请求；`AssetsPage`/`ImportDialog` 已退出
- [ ] React、`@vitejs/plugin-react`、Jest/RTL、i18next 等专用依赖与配置已退出
- [ ] PrimeVue/Aura 已退出绘图与入口样式
- [ ] `04_DEV.md` 已回写实际路径、符号、偏离、剩余工作
- [ ] `05_TEST_PLAN.md` 已冻结为模式 B，用例与真实文件一致
- [ ] `06_TEST_REPORT.md` 已按第 6 节结构建立，含重试记录与证据路径
- [ ] `00_FEATURE_INDEX.md` 状态与阻塞已更新（PH-04C、PH-05、PH-06）
- [ ] 发行包检查通过，`scripts/release.py` 白名单已包含 `extension/` 实际所需文件
- [ ] 未执行 `git commit`/`push`/发布（除非用户另行要求）

## 11. 完成时的回报格式

1. 本次完成的步骤与对应 FR
2. 与 `04_DEV.md` 的偏离清单（每条：设计 → 实际 → 原因 → 回写位置）
3. 新增/调整的测试用例（CASE/子项）与结果统计
4. `06_TEST_REPORT.md` 的 run-id、PASS/FAIL/BLOCKED 数量、失败重试摘要
5. 未完成项与阻塞（含需要用户决定的问题）
6. 建议的下一步（PH-06 集中执行 / PH-07 Close 条件是否满足）
