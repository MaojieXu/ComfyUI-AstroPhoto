# 活跃源码、测试和工程文件账本

与工作树快照对应的路径范围。范围归类表示发现/归档，不保证每个 helper 每一行都已人工语义审计。历史参考、工作区依赖、二进制和截图在完整文件或输入账本独立追踪。

- 工程配置 8 个
- 工程、产物与文档 93 个
- Extension Python 44 个
- 前端源码 80 个
- 测试和 fixture 42 个
- MCP 源码 11 个

| 仓库相对路径 | 领域 | 基线哈希前缀 | 核对范围 |
| --- | --- | --- | --- |
| `.comfyignore` | 工程配置 | c9790c8d85ab | 配置关键项，锁文件非逐依赖审查 |
| `.github/workflows/ci.yml` | 工程、产物与文档 | dbc4b4690ec3 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `.github/workflows/release.yml` | 工程、产物与文档 | 332c76838a71 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `.python-version` | 工程配置 | 7b55f8e67b56 | 配置关键项，锁文件非逐依赖审查 |
| `AGENTS.md` | 工程配置 | 1338a235e3e5 | 配置关键项，锁文件非逐依赖审查 |
| `README.md` | 工程配置 | 7c2429f42041 | 配置关键项，锁文件非逐依赖审查 |
| `__init__.py` | Extension Python | b8011bd853f3 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/__init__.py` | Extension Python | 3abcd5e8bc08 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/__init__.py` | Extension Python | e94d8dd91b68 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/assets.py` | Extension Python | 5a7ba9850e8d | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/equipment.py` | Extension Python | 19d3cff04e16 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/errors.py` | Extension Python | d66fddb1e008 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/routes.py` | Extension Python | 2cee86b3f645 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/security.py` | Extension Python | 40c320715c27 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/siril.py` | Extension Python | 81e39c9d5550 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/status.py` | Extension Python | c384623b6ae8 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/api/storage.py` | Extension Python | 83a81b60d4b7 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/assets/imports.py` | Extension Python | bb99ea4dcba0 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/assets/service.py` | Extension Python | 9946338c1526 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/bootstrap.py` | Extension Python | 28a759ea9a95 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/core/__init__.py` | Extension Python | eea5f7ed2ca9 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/core/capabilities.py` | Extension Python | 349f00e3fa07 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/core/config.py` | Extension Python | b03d19e15e8c | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/core/errors.py` | Extension Python | 5e1a937eefec | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/core/paths.py` | Extension Python | 5ea2d3cbd421 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/database/equipment_models.py` | Extension Python | 8a1ac1855e09 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/database/manager.py` | Extension Python | 249e4f6060d5 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/database/migrations/env.py` | Extension Python | b7cfc0737fda | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/database/migrations/versions/0001_equipment_baseline.py` | Extension Python | cb9ac8a40297 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/database/models.py` | Extension Python | 7ae34d615dad | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/equipment/schemas.py` | Extension Python | 757a11fc0fa1 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/equipment/service.py` | Extension Python | dc8b098973e7 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/equipment/snapshots.py` | Extension Python | f1376f77f5b3 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/equipment/trains.py` | Extension Python | 152c39660058 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/siril/__init__.py` | Extension Python | c397dcef933e | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/siril/frames.py` | Extension Python | 857e739b1440 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/siril/previews.py` | Extension Python | b909b101a39d | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/siril/processing.py` | Extension Python | 5213bbf206cd | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/siril/software.py` | Extension Python | 351d01fb1127 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/cache.py` | Extension Python | a0bd6cd46995 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/initializer.py` | Extension Python | cfbd3aeaf26f | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/locations.py` | Extension Python | 755b8b8b4d25 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/manager.py` | Extension Python | b978ba46d1f2 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/migration.py` | Extension Python | 1f77b7c02085 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/operations.py` | Extension Python | 47c6d3c98540 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/paths.py` | Extension Python | 3f92bc542e01 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `astrophoto/storage/runtime.py` | Extension Python | 0b8c0f6ebd0d | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `docs/architecture.md` | 工程、产物与文档 | 13cc1d68dd35 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/development.md` | 工程、产物与文档 | aa84632ad5d6 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/equipment.md` | 工程、产物与文档 | 6168a95750ca | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16.zip` | 工程、产物与文档 | b5574827e23b | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/00_README.md` | 工程、产物与文档 | 7c481bbf93a3 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/01_CURRENT_STATE.md` | 工程、产物与文档 | 6010cd98dd03 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/02_REQUIREMENTS.md` | 工程、产物与文档 | 5ffb35a102b4 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/03_ARCHITECTURE.md` | 工程、产物与文档 | ab16bf582c02 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/04_TECH_STACK.md` | 工程、产物与文档 | 642ea6fb9017 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/05_MCP_AND_SKILLS.md` | 工程、产物与文档 | 2bfde66a2e2d | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/06_DATA_MEMORY_RAG.md` | 工程、产物与文档 | 148c0b833b65 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/07_TEST_EVIDENCE.md` | 工程、产物与文档 | 2dc9929b7a86 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/08_GAPS_AND_RISKS.md` | 工程、产物与文档 | 7119e87172b4 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/09_DECISIONS.md` | 工程、产物与文档 | b0cb0751a3f7 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/10_NEXT_AGENT_PROMPT.md` | 工程、产物与文档 | dcf1297f1160 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/11_RECONCILIATION.md` | 工程、产物与文档 | b85f0fc3abf6 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/12_SOURCES.md` | 工程、产物与文档 | 98f55b2a6099 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/CHANGELOG.md` | 工程、产物与文档 | 16d37e0fccd3 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/FULL_HANDOFF.md` | 工程、产物与文档 | fa5aa1e5a75e | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-16/MANIFEST.md` | 工程、产物与文档 | 92bec1495eda | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/AstroPhoto_Sidebar_Repository_Verified_Handoff.md` | 工程、产物与文档 | 6e1270305b74 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/CHANGELOG.md` | 工程、产物与文档 | 4e9886bf1bd8 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/DELIVERY_MANIFEST.json` | 工程、产物与文档 | 8b982c97bed5 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/NEXT_AGENT_PROMPT.md` | 工程、产物与文档 | 91bfbed117c9 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/RECONCILIATION_REPORT.md` | 工程、产物与文档 | d57f0cf5d2a2 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/VALIDATION_EVIDENCE.md` | 工程、产物与文档 | 626637616fcc | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/api-source-excerpts.txt` | 工程、产物与文档 | db24480869ab | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/build-comparison.diff` | 工程、产物与文档 | e1961c8a962d | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/build-hashes.json` | 工程、产物与文档 | 520ddd8a9826 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/build-isolated.mjs` | 工程、产物与文档 | b1dedd0303fd | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/build-production.txt` | 工程、产物与文档 | fed7bb8cb3ea | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/build.txt` | 工程、产物与文档 | ad93213f8290 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/check-build.txt` | 工程、产物与文档 | e0ccedf2e40e | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/concurrent-changes.json` | 工程、产物与文档 | 75ad9663ec90 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/delivery-check.json` | 工程、产物与文档 | 06fdc99a22fb | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/dev-versions.json` | 工程、产物与文档 | 45878ba4f527 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/frontend-versions.json` | 工程、产物与文档 | 4ca7fb63450d | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/git-after.txt` | 工程、产物与文档 | 07e819aa10a7 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/git-before.txt` | 工程、产物与文档 | f69f74d9ea85 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/historical-manifest-check.json` | 工程、产物与文档 | eb9e6f28d29a | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/host-http-tests.txt` | 工程、产物与文档 | e0a63d6c5938 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/host-versions.txt` | 工程、产物与文档 | 9650b885e36f | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/input-hashes.json` | 工程、产物与文档 | ecc26aaff4b5 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/lint-final.txt` | 工程、产物与文档 | e4a12e0b7bea | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/lint.txt` | 工程、产物与文档 | e4a12e0b7bea | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/live-http.json` | 工程、产物与文档 | 1b21634f6ae2 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/mcp-live.json` | 工程、产物与文档 | fd71bf8b4409 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/mcp-tests.txt` | 工程、产物与文档 | 2eaa00ebbc8b | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/packaging-tests.txt` | 工程、产物与文档 | bd6004fec783 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/pypi.json` | 工程、产物与文档 | 9b56c7146314 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/react-tests-final.txt` | 工程、产物与文档 | 1ba618e729be | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/react-tests.txt` | 工程、产物与文档 | a78b71406e1a | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/reference-version.txt` | 工程、产物与文档 | e77c7a411f5c | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/repository-files.txt` | 工程、产物与文档 | 5710d059f69a | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/root-tests.txt` | 工程、产物与文档 | b6344aac41b9 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/ruff.txt` | 工程、产物与文档 | a4443afdcfb6 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/snapshot.json` | 工程、产物与文档 | 6f39f4dba50f | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/source-after.json` | 工程、产物与文档 | 49c0536648df | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/source-before.json` | 工程、产物与文档 | 0cf6bb5b0c47 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/tool-versions.txt` | 工程、产物与文档 | e1df845a3528 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/typecheck-final.txt` | 工程、产物与文档 | 2e873f371797 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/typecheck.txt` | 工程、产物与文档 | 2e873f371797 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/versions-check.txt` | 工程、产物与文档 | 33035df4486e | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/handoffs/repository-verified-2026-11-17/evidence/vue-tests.txt` | 工程、产物与文档 | 24b2956d1f9f | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/local-storage.md` | 工程、产物与文档 | 13cd0125bcb6 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/mcp.md` | 工程、产物与文档 | d0c13c7f9703 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/publishing.md` | 工程、产物与文档 | e2c816dc88a1 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/react-sidebar.md` | 工程、产物与文档 | 33b15dfd7478 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/requirements.md` | 工程、产物与文档 | fe4f6bb16621 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `docs/siril.md` | 工程、产物与文档 | ada8e949849b | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/entry.ts` | 前端源码 | c6c1ee7dbe57 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/eslint.config.mjs` | 工程、产物与文档 | 58c168ecf027 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/jest.config.cjs` | 工程、产物与文档 | 91dc96c28be3 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/package.json` | 工程、产物与文档 | 78e815274e44 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/pnpm-lock.yaml` | 工程、产物与文档 | 8cb96df9a91f | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/pnpm-workspace.yaml` | 工程、产物与文档 | e4dc4c2cb52a | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/src/components/DrawingApp.vue` | 前端源码 | f8c4bd6091b5 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/components/DrawingBoard.vue` | 前端源码 | 07f71daa9cf5 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/components/ToolBar.vue` | 前端源码 | 80b538fa1d22 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/components/VueExampleComponent.vue` | 前端源码 | 6d8c42f62f09 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/host.d.ts` | 前端源码 | 3a781faf2b25 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/main.ts` | 前端源码 | a885b1b9e67f | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/types.ts` | 前端源码 | 39b1cef2088e | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/composables/useAttrsClass.ts` | 前端源码 | 051ed28991fe | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/composables/usePopoverSizing.ts` | 前端源码 | 6aafd2cb98ee | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/multi-select/MultiSelect.vue` | 前端源码 | d833c1e54a94 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/multi-select/MultiSelectContent.vue` | 前端源码 | a08d0b033e0a | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/multi-select/MultiSelectTrigger.vue` | 前端源码 | 4e995914430c | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/multi-select/types.ts` | 前端源码 | f2ad9518f983 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/select.variants.ts` | 前端源码 | 98b6be6ec5e0 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/select/types.ts` | 前端源码 | cb653f931a63 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/select/useSelectSearch.ts` | 前端源码 | ec3e268f6565 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/single-select/SearchableSingleSelect.vue` | 前端源码 | 3f3f20ee549e | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/single-select/SingleSelect.vue` | 前端源码 | 9721efca4860 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/single-select/types.ts` | 前端源码 | 7253c1fa299d | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/src/vendor/comfyui/tailwind-utils.ts` | 前端源码 | cbb27469e551 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/tests/components/DrawingApp.test.ts` | 测试和 fixture | 614c9e7db970 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/tests/host.ts` | 测试和 fixture | 53702aa3ef7c | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/tests/setup.ts` | 测试和 fixture | b27fa8e4c652 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/tests/widgets/registration.test.ts` | 测试和 fixture | 1818429023db | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/tests/widgets/serialization.test.ts` | 测试和 fixture | f9fb9aeb66b2 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/tsconfig.json` | 工程、产物与文档 | 398208f718ab | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/ui/check-build.mjs` | 工程、产物与文档 | c210cc5ead2a | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/ui/check-proxy.mjs` | 工程、产物与文档 | 6096dfe40e55 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/ui/equipment-host.mjs` | 工程、产物与文档 | b0d9651a999c | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/ui/host-runtime.mjs` | 工程、产物与文档 | 7c30ef1ce234 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/ui/siril-host.mjs` | 工程、产物与文档 | c7581b0bd1d8 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/ui/src/__tests__/api.test.ts` | 测试和 fixture | a4ba5221bb95 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/canvas.test.ts` | 测试和 fixture | e2cf370ce007 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/detailAccordion.test.tsx` | 测试和 fixture | 622886b6b8b6 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/equipment.test.tsx` | 测试和 fixture | c8ec4c68ca20 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/fixtures.ts` | 测试和 fixture | 58a0128b4c29 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/hostMock.ts` | 测试和 fixture | 352f666d6c59 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/i18n.test.tsx` | 测试和 fixture | a17d8fd4398e | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/lifecycle.test.tsx` | 测试和 fixture | aa3775d7b96d | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/multiSelectMock.ts` | 测试和 fixture | 6e9ea39d0fd4 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/navigation.test.tsx` | 测试和 fixture | ad94ed95a719 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/search.test.tsx` | 测试和 fixture | 50d95a46ceae | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/setupTests.ts` | 测试和 fixture | ff1019506224 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/singleSelectMock.ts` | 测试和 fixture | 6cdfb03d9f47 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/siril.test.tsx` | 测试和 fixture | 157c6e09a85c | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/__tests__/storage.test.tsx` | 测试和 fixture | 9daf85c54c14 | 测试账本和专项，配置/fixture不计测试函数 |
| `frontend/ui/src/api/client.ts` | 前端源码 | 1387584310c4 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/api/equipment.ts` | 前端源码 | 15fe8091ad3b | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/api/nodes.ts` | 前端源码 | 94fbd9b3a836 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/api/previewSettings.ts` | 前端源码 | 904f0980f7cb | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/api/siril.ts` | 前端源码 | 27c5f7319e88 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/api/status.ts` | 前端源码 | e54e21f5b0cf | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/api/storage.ts` | 前端源码 | 9598a265ee41 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/app/App.tsx` | 前端源码 | e6ff56f1e59d | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/assets/AssetsPage.tsx` | 前端源码 | 44b7c458adc9 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/assets/ImportDialog.tsx` | 前端源码 | 18ada3dfc7cc | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodePreview/Inspector.tsx` | 前端源码 | e6c86bfb8cbd | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodePreview/NodePreview.tsx` | 前端源码 | 66990b4c0276 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodePreview/PanelDivider.tsx` | 前端源码 | cfc3355d8d5e | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodePreview/inspector.css` | 前端源码 | d18e41c3960b | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodePreview/nodePreview.css` | 前端源码 | 7cc54a3dc8b0 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodes/NodeHoverPreview.tsx` | 前端源码 | 29ea4ded6187 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodes/NodeTree.tsx` | 前端源码 | 0d23c913bb74 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/nodes/NodesPage.tsx` | 前端源码 | 2017ae2d618c | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/EnvironmentPage.tsx` | 前端源码 | 22b577ddbe17 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/SettingsPage.tsx` | 前端源码 | 97bff885f5d5 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/SoftwarePage.tsx` | 前端源码 | 4cd66f44ef3c | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/StoragePage.tsx` | 前端源码 | c170f79b3e75 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/environment.css` | 前端源码 | 32350deb774a | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/DetailAccordion.tsx` | 前端源码 | 44b6d7908f15 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/DetailActions.tsx` | 前端源码 | b5c7edfa0cf2 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/EquipmentDetails.tsx` | 前端源码 | e247466d45e3 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/EquipmentForm.tsx` | 前端源码 | 3c6f9c9d3cc2 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/EquipmentList.tsx` | 前端源码 | 8d8f1ee6fa0d | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/EquipmentPage.tsx` | 前端源码 | 9117e3e8badd | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/OpticalTrainDetails.tsx` | 前端源码 | b5c2d35a14a9 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/OpticalTrainEditor.tsx` | 前端源码 | b8e6873529d8 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/equipment.css` | 前端源码 | d8f2e69e9c92 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/equipment/shared.tsx` | 前端源码 | 8437eeec8f02 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/moduleRegistry.ts` | 前端源码 | f3ed12feffcc | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/settings/storage.css` | 前端源码 | bb69c15d6f7d | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/siril/Inspector.tsx` | 前端源码 | 29995cbf6888 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/siril/siril.css` | 前端源码 | ed205f39e75e | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/features/storage/shared.tsx` | 前端源码 | 4e463a329dca | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/host/canvas.ts` | 前端源码 | b8823bef39f6 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/host/comfy.ts` | 前端源码 | 7d75b3fa2eed | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/host/dragDrop.ts` | 前端源码 | 365e6eae5b66 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/host/locale.ts` | 前端源码 | 0df2745ecdfa | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/host/scientific.tsx` | 前端源码 | 673593d74a48 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/host/sidebar.tsx` | 前端源码 | f98fefc02c73 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/i18n/index.ts` | 前端源码 | e40a34bcdcd6 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/i18n/locales/en/main.json` | 前端源码 | 5a13c64d1ef4 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/i18n/locales/zh/main.json` | 前端源码 | 3ad3ee679d53 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/main.tsx` | 前端源码 | d6a89c66c8e7 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/ComfyMultiSelect.tsx` | 前端源码 | c70fdbc26c51 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/ComfySingleSelect.tsx` | 前端源码 | 5fed72b85b16 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/DisclosureChevron.tsx` | 前端源码 | 7dd6f2b8c2f6 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/Feedback.tsx` | 前端源码 | e0dc69f37666 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/SearchField.tsx` | 前端源码 | 5d45b2701fa5 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/SearchOptions.tsx` | 前端源码 | bf7d2c73bb27 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/SidebarTabs.tsx` | 前端源码 | f1725e4f4221 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/useResource.ts` | 前端源码 | 17be2372ce10 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/useStoredChoice.ts` | 前端源码 | 859a95231377 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/shared/vue.d.ts` | 前端源码 | 40b8f839c139 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/src/styles/theme.css` | 前端源码 | 6c6c5032a812 | 前端专项；纯样式、翻译及 vendor 取关键路径 |
| `frontend/ui/storage-host.mjs` | 工程、产物与文档 | 43610a736048 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/vite.config.mts` | 工程、产物与文档 | 169977113a87 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `frontend/vitest.config.mts` | 工程、产物与文档 | a0fe77d3ba98 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `js/assets/main.css` | 工程、产物与文档 | 62669a1fb90a | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `js/main.js` | 工程、产物与文档 | f4731ea6d620 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `locales/en/main.json` | 工程、产物与文档 | dbf5b7e09cf2 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `locales/zh/main.json` | 工程、产物与文档 | 0d090044896d | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `locales/zh/nodeDefs.json` | 工程、产物与文档 | 751534c94483 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `mcp/pyproject.toml` | 工程配置 | cf413d333398 | 配置关键项，锁文件非逐依赖审查 |
| `mcp/src/astrophoto_mcp/__init__.py` | MCP 源码 | 064b1c70363e | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/__main__.py` | MCP 源码 | c74b021a0700 | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/api/__init__.py` | MCP 源码 | 32f25b2e0d0f | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/api/comfy.py` | MCP 源码 | 9d9f4c012648 | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/api/equipment.py` | MCP 源码 | bb12f6b0f0d9 | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/client.py` | MCP 源码 | 394fa7e6eacd | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/config.py` | MCP 源码 | 61067b3e25d6 | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/server.py` | MCP 源码 | e08e6c0db864 | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/tools/__init__.py` | MCP 源码 | 1cbb4e5f8698 | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/tools/equipment.py` | MCP 源码 | 83270484d1dd | MCP专项，包入口与实现 |
| `mcp/src/astrophoto_mcp/tools/status.py` | MCP 源码 | 2cb7ec7c68e3 | MCP专项，包入口与实现 |
| `mcp/tests/conftest.py` | 测试和 fixture | e80b18ca5021 | 测试账本和专项，配置/fixture不计测试函数 |
| `mcp/tests/fixtures/status_contract.json` | 测试和 fixture | 698fadb37125 | 测试账本和专项，配置/fixture不计测试函数 |
| `mcp/tests/test_client.py` | 测试和 fixture | 3ead96a0307b | 测试账本和专项，配置/fixture不计测试函数 |
| `mcp/tests/test_config.py` | 测试和 fixture | 00ea3bd0b699 | 测试账本和专项，配置/fixture不计测试函数 |
| `mcp/tests/test_equipment.py` | 测试和 fixture | 6145b4a4ed3e | 测试账本和专项，配置/fixture不计测试函数 |
| `mcp/tests/test_server.py` | 测试和 fixture | 77d1d7a00d98 | 测试账本和专项，配置/fixture不计测试函数 |
| `mcp/tests/test_version.py` | 测试和 fixture | 25d3a02a794f | 测试账本和专项，配置/fixture不计测试函数 |
| `nodes/ComfyUIFEExampleVueBasic.py` | Extension Python | 3a7909bc7005 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `nodes/__init__.py` | Extension Python | 7f292255fa38 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `nodes/scientific.py` | Extension Python | a3903371cf80 | 后端 / 资产设备 / Node专项，关键业务调用链 |
| `pyproject.toml` | 工程配置 | ca5b4cfdc6c6 | 配置关键项，锁文件非逐依赖审查 |
| `requirements.txt` | 工程配置 | e6f1dccd39f8 | 配置关键项，锁文件非逐依赖审查 |
| `scripts/check_install.py` | 工程、产物与文档 | bed5bb16a247 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `scripts/release.py` | 工程、产物与文档 | 58ebc74d44b4 | 版本/交接/本地构建与专项；bundle 按哈希及加载核对 |
| `tests/backend/test_core.py` | 测试和 fixture | 420981704088 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/backend/test_equipment.py` | 测试和 fixture | 5e8d241541af | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/backend/test_siril.py` | 测试和 fixture | 2083ff31db42 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/backend/test_status.py` | 测试和 fixture | ac47899de848 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/backend/test_storage.py` | 测试和 fixture | 129248a96bd2 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/conftest.py` | 测试和 fixture | 0336f48b4dff | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/integration/test_equipment_api.py` | 测试和 fixture | 49829d7e8377 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/integration/test_host_runtime.py` | 测试和 fixture | ea108c03efd5 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/integration/test_siril_api.py` | 测试和 fixture | e1bed100e039 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/integration/test_status_api.py` | 测试和 fixture | 9dcd99098500 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/integration/test_storage_api.py` | 测试和 fixture | cc6795b8f546 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/nodes/test_image_io.py` | 测试和 fixture | dd737d24747d | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/nodes/test_registration.py` | 测试和 fixture | 26af6fc7ea2f | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/packaging/test_contents.py` | 测试和 fixture | 1c2fdb27f374 | 测试账本和专项，配置/fixture不计测试函数 |
| `tests/packaging/test_versions.py` | 测试和 fixture | afb40838b6a7 | 测试账本和专项，配置/fixture不计测试函数 |
| `uv.lock` | 工程配置 | 949194768c6c | 配置关键项，锁文件非逐依赖审查 |
