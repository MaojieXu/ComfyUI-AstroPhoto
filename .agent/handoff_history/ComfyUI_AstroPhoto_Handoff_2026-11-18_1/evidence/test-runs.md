# 命令与结果索引

日志保留实际命令及退出。配置探针早期失败记在原始日志。机器报告起源、skip 原因及真实路径环境见主要测试矩阵。

| 日志 | 命令 | 开始 | 结束 | exit | 秒 | 用例结果 |
| --- | --- | --- | --- | --- | --- | --- |
| [check-build.log](test-results/check-build.log) | `pnpm -C frontend check:build` | 2026-11-18T04:25:15.4646268-06:00 | 2026-11-18T04:25:16.0327574-06:00 | 0 | 0.5681306 |  |
| [check-proxy.log](test-results/check-proxy.log) | `pnpm -C frontend check:proxy` | 2026-11-18T04:25:15.4977840-06:00 | 2026-11-18T04:25:16.5589316-06:00 | 0 | 1.0611476 |  |
| [frontend-lint.log](test-results/frontend-lint.log) | `pnpm -C frontend lint` | 2026-11-18T04:25:15.3711816-06:00 | 2026-11-18T04:25:18.3952624-06:00 | 0 | 3.0240808 |  |
| [git-diff-check.log](test-results/git-diff-check.log) | `git diff --check` | 2026-11-18T04:25:15.4732776-06:00 | 2026-11-18T04:25:15.6043447-06:00 | 0 | 0.1310671 |  |
| [host-browser-GET.log](test-results/host-browser-GET.log) | `node "$logDir/audit-host-ui.mjs"` | 2026-11-18T04:28:37.8901158-06:00 | 2026-11-18T04:28:39.7843348-06:00 | 0 | 1.894219 |  |
| [host-get.log](test-results/host-get.log) | `& .venv/Scripts/python.exe -m pytest tests/integration/test_host_runtime.py -vv -rA -p no:cacheprovider --junitxml="$logDir/host-get.xml"` | 2026-11-18T04:25:15.4118536-06:00 | 2026-11-18T04:25:16.4293813-06:00 | 0 | 1.0175277 | PASS 1 |
| [isolated-vite.log](test-results/isolated-vite.log) | `node "$logDir/audit-build.mjs"` | 2026-11-18T04:28:37.8901355-06:00 | 2026-11-18T04:28:41.4912318-06:00 | 0 | 3.6010963 |  |
| [mcp.log](test-results/mcp.log) | `& .venv/Scripts/python.exe -m pytest -c mcp/pyproject.toml mcp/tests -vv -rA -p no:cacheprovider --junitxml="$logDir/mcp.xml"` | 2026-11-18T04:25:15.3512488-06:00 | 2026-11-18T04:25:23.8386524-06:00 | 0 | 8.4874036 | PASS 67 |
| [python-extension.log](test-results/python-extension.log) | `& .venv/Scripts/python.exe -m pytest tests/nodes tests/backend tests/integration tests/packaging -vv -rA -p no:cacheprovider --junitxml="$logDir/python-extension.xml"` | 2026-11-18T04:25:15.3516125-06:00 | 2026-11-18T04:25:32.1072878-06:00 | 0 | 16.7556753 | PASS 83; SKIPPED 3 |
| [python311-extension.log](test-results/python311-extension.log) | `& $testPython --version`<br>`& $testPython -m pytest tests/nodes tests/backend tests/integration tests/packaging -vv -rA -p no:cacheprovider --junitxml="$logDir/python311-extension.xml"` | 2026-11-18T04:27:26.9226951-06:00 | 2026-11-18T04:27:42.1974804-06:00 | 0 | 15.2747853 | PASS 83; SKIPPED 3 |
| [python311-mcp.log](test-results/python311-mcp.log) | `& $testPython --version`<br>`& $testPython -m pytest -c mcp/pyproject.toml mcp/tests -vv -rA -p no:cacheprovider --junitxml="$logDir/python311-mcp.xml"` | 2026-11-18T04:27:26.9223199-06:00 | 2026-11-18T04:27:35.2232641-06:00 | 0 | 8.3009442 | PASS 67 |
| [react-css-mapped.log](test-results/react-css-mapped.log) | `pnpm -C frontend test:react --config="$logDir/audit-jest.cjs" --json --outputFile="$logDir/react-css-mapped.json"` | 2026-11-18T04:34:00.8498657-06:00 | 2026-11-18T04:34:15.3116210-06:00 | 1 | 14.4617553 | PASSED 46; FAILED 1 |
| [react-css-probe.log](test-results/react-css-probe.log) | `pnpm -C frontend test:react --config="$logDir/audit-jest.cjs" --json --outputFile="$logDir/react-css-probe.json"` | 2026-11-18T04:28:37.8901407-06:00 | 2026-11-18T04:28:38.4402211-06:00 | 1 | 0.5500804 |  |
| [react-isolated.log](test-results/react-isolated.log) | `pnpm -C frontend test:react --moduleNameMapper="$map" --json --outputFile="$logDir/react-isolated.json"` | 2026-11-18T04:27:26.9228989-06:00 | 2026-11-18T04:27:27.3130618-06:00 | 1 | 0.3901629 |  |
| [react.log](test-results/react.log) | `pnpm -C frontend test:react --json --outputFile="$logDir/react.json"` | 2026-11-18T04:25:15.4848108-06:00 | 2026-11-18T04:25:23.9563706-06:00 | 1 | 8.4715598 | PASSED 13 |
| [release-check.log](test-results/release-check.log) | `& .venv/Scripts/python.exe scripts/release.py check` | 2026-11-18T04:25:15.4857292-06:00 | 2026-11-18T04:25:15.6907011-06:00 | 0 | 0.2049719 |  |
| [ruff.log](test-results/ruff.log) | `& .venv/Scripts/ruff.exe check --no-cache astrophoto nodes mcp/src mcp/tests scripts tests __init__.py` | 2026-11-18T04:25:15.4991094-06:00 | 2026-11-18T04:25:15.5622364-06:00 | 0 | 0.063127 |  |
| [typecheck.log](test-results/typecheck.log) | `pnpm -C frontend typecheck` | 2026-11-18T04:25:15.4769993-06:00 | 2026-11-18T04:25:20.3843448-06:00 | 0 | 4.9073455 |  |
| [uv-lock.log](test-results/uv-lock.log) | `uv lock --check --offline` | 2026-11-18T04:25:15.4846915-06:00 | 2026-11-18T04:25:15.5641910-06:00 | 0 | 0.0794995 |  |
| [vue.log](test-results/vue.log) | `pnpm -C frontend exec vitest run --reporter=verbose --reporter=junit --outputFile.junit="$logDir/vue.xml"` | 2026-11-18T04:25:15.3694195-06:00 | 2026-11-18T04:25:18.7817023-06:00 | 0 | 3.4122828 | PASS 9 |
