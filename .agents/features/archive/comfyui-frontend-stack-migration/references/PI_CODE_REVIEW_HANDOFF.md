# Pi Agent 交接：前端迁移代码审查与测试补强

请独立审查 AstroPhoto 的前端迁移，为确认的覆盖缺口增补回归测试，实际运行测试并将结果写入现有测试报告。先对照 [PRD v1.3](../01_PRD.md) 和当前工作树形成审查判断，再查阅 [测试计划](../05_TEST_PLAN.md) 和 [测试报告](../06_TEST_REPORT.md) 核对覆盖范围。

## 审查范围

基线是 `4c0cf4d` 加当前工作树。请同时查看基线差异和未跟踪源码。工作树还有其他任务的改动，按迁移范围取证并保留现有暂存状态。

```powershell
git diff 4c0cf4d -- frontend extension astrophoto nodes tests __init__.py .github .comfyignore scripts/release.py js
git ls-files --others --exclude-standard -- frontend extension astrophoto nodes tests
```

核对 Vue 迁移、宿主和旧工作流兼容性、资料库交互、Siril Bundle 边界及发行入口。预期宿主为 ComfyUI `v0.46.0` / Frontend `1.59.6`。需要定位入口时查阅 [技术设计](../03_TECH.md) 和 [开发说明](../04_DEV.md)。

## 补测与交付

- 复跑相关现有测试，补齐确认的缺口，然后实际运行新增测试和受影响的回归套件。可用 `pnpm -C frontend exec vitest run` 运行前端测试，后端用 `uv run --frozen --no-sync pytest` 加上相关用例路径。需要真实宿主时使用隔离环境。
- 审查发现按严重程度排序，给出文件与行号、触发条件、用户影响和可复现证据。业务代码问题另列修复建议，代码改动限于增补测试。
- 在现有 [06_TEST_REPORT.md](../06_TEST_REPORT.md) 末尾追加「Pi 独立审查与补测」，保留原有记录。写明新增用例及其覆盖行为、实际执行命令、环境和结果。失败项附证据并关联审查发现，跳过或未运行项写明原因。
