# RUN-003 环境（隔离 8188 宿主）

- 日期：2026-11-22
- 宿主机：Windows（win32-x64）
- ComfyUI：0.46.0，Frontend 1.59.6（`/system_stats` 实测）
- 启动参数：`--cpu --listen 127.0.0.1 --port 8188 --disable-auto-launch --disable-all-custom-nodes --whitelist-custom-nodes ComfyUI_AstroPhoto`
- 扩展：`ComfyUI-migration-v0.46.0/custom_nodes/ComfyUI_AstroPhoto` 指向工作区
- Data Root：`ComfyUI-AstroPhoto/.artifact/frontend-preview/astrophoto`（`ASTROPHOTO_HOME`，API 返回 `source: ASTROPHOTO_HOME`）
- user/input/output/temp：`.artifact/frontend-preview/{user,input,output,temp}`
- 重启前确认：`/queue` 的 running 与 pending 均为空
- 代码：`1772bd5` + 工作树（含 DEV-118/122/123；`DEV_118_FIX_INPUTS.json`）

环境变量：

```text
COMFYUI_TEST_URL=http://127.0.0.1:8188
ASTROPHOTO_TEST_STORAGE_ROOT=.../.artifact/frontend-preview
ASTROPHOTO_TEST_ASSETS_ROOT=.../.artifact/frontend-preview/astrophoto
ASTROPHOTO_TEST_ASSET_SOURCE=.../.artifact/host-run/source.png
ASTROPHOTO_TEST_EQUIPMENT_RUN=eq1222b
```

执行：

| 命令 | 结果 |
| --- | --- |
| `uv run pytest tests/integration -m host` | 1 passed |
| `node frontend/tests/host/storage-host.mjs` | PASS（03-A、03-B） |
| `node frontend/tests/host/assets-host.mjs` | PASS |
| `node frontend/tests/host/equipment-host.mjs --prepare-restart` | PASS |
| 重启宿主（同一 Data Root 与环境变量） | `/system_stats` 200 |
| `node frontend/tests/host/equipment-host.mjs --verify-restart --verify-delete` | PASS |

说明：首次重启漏设 `ASTROPHOTO_HOME`，宿主回落到 `%USERPROFILE%\.astrophoto`；`storage-host.mjs` 在写入前断言失败，未产生测试工作区。补设后重跑通过。
