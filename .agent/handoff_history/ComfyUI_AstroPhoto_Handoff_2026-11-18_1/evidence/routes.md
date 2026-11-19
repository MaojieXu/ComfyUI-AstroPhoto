# 实际路由表

返回码列来自 route 注册元组。认证、数据校验和状态冲突依 handler 返回其他结果。HEAD 隐式行为未枚举。

| 方法 | 路径 | handler | 注册状态 | 源码 | 授权 |
| --- | --- | --- | --- | --- | --- |
| GET | /astrophoto/v1/status | status_handler | 200 | astrophoto/api/routes.py:31 | public |
| GET | /astrophoto/v1/storage | `snapshot` | 200 | astrophoto\api\storage.py:178 | 直连 loopback + header |
| PATCH | /astrophoto/v1/storage/settings | `settings` | 200 | astrophoto\api\storage.py:179 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/locations | `add_location` | 201 | astrophoto\api\storage.py:180 | 直连 loopback + header |
| PATCH | /astrophoto/v1/storage/locations/{id} | `update_location` | 200 | astrophoto\api\storage.py:181 | 直连 loopback + header |
| DELETE | /astrophoto/v1/storage/locations/{id} | `remove_location` | 200 | astrophoto\api\storage.py:182 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/locations/{id}/validate | `validate_location` | 200 | astrophoto\api\storage.py:183 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/locations/{id}/relocate | `relocate` | 200 | astrophoto\api\storage.py:184 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/cache/configure | `configure_cache` | 200 | astrophoto\api\storage.py:185 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/cache/clear | `clear_cache` | 200 | astrophoto\api\storage.py:186 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/migrations | `start_migration` | 202 | astrophoto\api\storage.py:187 | 直连 loopback + header |
| GET | /astrophoto/v1/storage/migrations/{id} | `operation_handler("migration")` | 200 | astrophoto\api\storage.py:188 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/migrations/{id}/cancel | `operation_handler("migration", "cancel")` | 200 | astrophoto\api\storage.py:189 | 直连 loopback + header |
| POST | /astrophoto/v1/storage/migrations/{id}/retry | `operation_handler("migration", "retry")` | 202 | astrophoto\api\storage.py:190 | 直连 loopback + header |
| GET | /astrophoto/v1/assets | `list_assets` | 200 | astrophoto\api\assets.py:55 | 直连 loopback + header |
| POST | /astrophoto/v1/assets/import | `import_assets` | 202 | astrophoto\api\assets.py:56 | 直连 loopback + header |
| POST | /astrophoto/v1/assets/import/preview | `preview` | 200 | astrophoto\api\assets.py:57 | 直连 loopback + header |
| GET | /astrophoto/v1/assets/imports/{id} | `operation_handler("import")` | 200 | astrophoto\api\assets.py:58 | 直连 loopback + header |
| POST | /astrophoto/v1/assets/imports/{id}/cancel | `operation_handler("import", "cancel")` | 200 | astrophoto\api\assets.py:59 | 直连 loopback + header |
| POST | /astrophoto/v1/assets/imports/{id}/retry | `operation_handler("import", "retry")` | 202 | astrophoto\api\assets.py:60 | 直连 loopback + header |
| POST | /astrophoto/v1/assets/{id}/relocate | `relocate_asset` | 200 | astrophoto\api\assets.py:61 | 直连 loopback + header |
| PATCH | /astrophoto/v1/assets/{id}/sessions | `set_asset_session` | 200 | astrophoto\api\assets.py:62 | 直连 loopback + header |
| GET | /astrophoto/v1/assets/{id}/availability | `inspect_asset` | 200 | astrophoto\api\assets.py:63 | 直连 loopback + header |
| GET | /astrophoto/v1/equipment | `list_equipment` | 200 | astrophoto\api\equipment.py:83 | 设备独立策略 |
| GET | /astrophoto/v1/equipment/{id} | `get_equipment` | 200 | astrophoto\api\equipment.py:84 | 设备独立策略 |
| POST | /astrophoto/v1/equipment | `create_equipment` | 201 | astrophoto\api\equipment.py:85 | 设备独立策略 |
| PATCH | /astrophoto/v1/equipment/{id} | `update_equipment` | 200 | astrophoto\api\equipment.py:86 | 设备独立策略 |
| DELETE | /astrophoto/v1/equipment/{id} | `delete_equipment` | 204 | astrophoto\api\equipment.py:87 | 设备独立策略 |
| POST | /astrophoto/v1/equipment/{id}/archive | `archive("equipment", True)` | 200 | astrophoto\api\equipment.py:88 | 设备独立策略 |
| POST | /astrophoto/v1/equipment/{id}/restore | `archive("equipment", False)` | 200 | astrophoto\api\equipment.py:89 | 设备独立策略 |
| GET | /astrophoto/v1/optical-trains | `list_trains` | 200 | astrophoto\api\equipment.py:90 | 设备独立策略 |
| POST | /astrophoto/v1/optical-trains | `create_train` | 201 | astrophoto\api\equipment.py:91 | 设备独立策略 |
| GET | /astrophoto/v1/optical-trains/{id} | `get_train` | 200 | astrophoto\api\equipment.py:92 | 设备独立策略 |
| DELETE | /astrophoto/v1/optical-trains/{id} | `delete_train` | 204 | astrophoto\api\equipment.py:93 | 设备独立策略 |
| GET | /astrophoto/v1/optical-trains/{id}/draft | `get_draft` | 200 | astrophoto\api\equipment.py:94 | 设备独立策略 |
| PUT | /astrophoto/v1/optical-trains/{id}/draft | `save_draft` | 200 | astrophoto\api\equipment.py:95 | 设备独立策略 |
| GET | /astrophoto/v1/optical-trains/{id}/revisions | `list_revisions` | 200 | astrophoto\api\equipment.py:96 | 设备独立策略 |
| POST | /astrophoto/v1/optical-trains/{id}/revisions | `legacy_revision_write` | 410 | astrophoto\api\equipment.py:97 | 设备独立策略 |
| GET | /astrophoto/v1/optical-trains/{id}/revisions/{revision_id} | `get_revision` | 200 | astrophoto\api\equipment.py:98 | 设备独立策略 |
| PATCH | /astrophoto/v1/optical-trains/{id}/revisions/{revision_id} | `immutable_revision` | 409 | astrophoto\api\equipment.py:99 | 设备独立策略 |
| DELETE | /astrophoto/v1/optical-trains/{id}/revisions/{revision_id} | `immutable_revision` | 409 | astrophoto\api\equipment.py:100 | 设备独立策略 |
| PUT | /astrophoto/v1/optical-trains/{id}/default-revision | `legacy_revision_write` | 410 | astrophoto\api\equipment.py:101 | 设备独立策略 |
| POST | /astrophoto/v1/optical-trains/{id}/archive | `archive("optical_trains", True)` | 200 | astrophoto\api\equipment.py:102 | 设备独立策略 |
| POST | /astrophoto/v1/optical-trains/{id}/restore | `archive("optical_trains", False)` | 200 | astrophoto\api\equipment.py:103 | 设备独立策略 |
| GET | /astrophoto/v1/software/siril | `status` | 200 | astrophoto\api\siril.py:96 | 直连 loopback + header |
| POST | /astrophoto/v1/software/siril/discover | `discover` | 200 | astrophoto\api\siril.py:97 | 直连 loopback + header |
| PUT | /astrophoto/v1/software/siril | `save` | 200 | astrophoto\api\siril.py:98 | 直连 loopback + header |
| DELETE | /astrophoto/v1/software/siril | `clear` | 200 | astrophoto\api\siril.py:99 | 直连 loopback + header |
| PUT | /astrophoto/v1/software/siril/enabled | `set_enabled` | 200 | astrophoto\api\siril.py:100 | 直连 loopback + header |
| GET | /astrophoto/v1/fits/assets | `frames` | 200 | astrophoto\api\siril.py:101 | 直连 loopback + header |
| GET | /astrophoto/v1/previews/settings | `get_preview_settings` | 200 | astrophoto\api\siril.py:102 | 直连 loopback + header |
| PUT | /astrophoto/v1/previews/settings | `set_preview_settings` | 200 | astrophoto\api\siril.py:103 | 直连 loopback + header |
| POST | /astrophoto/v1/previews/autostretch | `start_preview` | 202 | astrophoto\api\siril.py:104 | 直连 loopback + header |
| GET | /astrophoto/v1/previews/jobs/{id} | `preview_status` | 200 | astrophoto\api\siril.py:105 | 直连 loopback + header |
| POST | /astrophoto/v1/previews/jobs/{id}/cancel | `cancel_preview` | 200 | astrophoto\api\siril.py:106 | 直连 loopback + header |
| GET | /astrophoto/v1/previews/jobs/{id}/validate | `validate_preview` | 200 | astrophoto\api\siril.py:107 | 直连 loopback + header |
| GET | /astrophoto/v1/previews/jobs/{id}/{side} | `image` | 200 | astrophoto\api\siril.py:108 | 直连 loopback + header |
