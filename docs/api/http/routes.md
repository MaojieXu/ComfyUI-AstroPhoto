# HTTP 注册路由清单

清单对照源码和宿主实际注册。状态码为声明的默认成功状态。请求、条件分支、错误和副作用见 [HTTP 契约](contracts.md)。

## 状态

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/status` | 200 | [status_handler](../../../astrophoto/api/routes.py)（注册行 15） |

## 存储

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/storage` | 200 | [snapshot](../../../astrophoto/api/storage.py)（注册行 380） |
| `GET` | `/astrophoto/v1/storage/operations` | 200 | [list_operations](../../../astrophoto/api/storage.py)（注册行 381） |
| `POST` | `/astrophoto/v1/storage/init` | 200 | [init_storage](../../../astrophoto/api/storage.py)（注册行 382） |
| `PATCH` | `/astrophoto/v1/storage/settings` | 200 | [settings](../../../astrophoto/api/storage.py)（注册行 383） |
| `PUT` | `/astrophoto/v1/storage/location-policy` | 200 | [update_location_policy](../../../astrophoto/api/storage.py)（注册行 384） |
| `POST` | `/astrophoto/v1/storage/locations` | 201 | [add_location](../../../astrophoto/api/storage.py)（注册行 385） |
| `GET` | `/astrophoto/v1/storage/directories` | 200 | [browse_directories](../../../astrophoto/api/storage.py)（注册行 386） |
| `POST` | `/astrophoto/v1/storage/native-picker` | 200 | [native_picker](../../../astrophoto/api/storage.py)（注册行 387） |
| `PATCH` | `/astrophoto/v1/storage/locations/{id}` | 200 | [update_location](../../../astrophoto/api/storage.py)（注册行 388） |
| `DELETE` | `/astrophoto/v1/storage/locations/{id}` | 200 | [remove_location](../../../astrophoto/api/storage.py)（注册行 389） |
| `POST` | `/astrophoto/v1/storage/locations/{id}/validate` | 200 | [validate_location](../../../astrophoto/api/storage.py)（注册行 390） |
| `POST` | `/astrophoto/v1/storage/locations/{id}/relocate` | 200 | [relocate](../../../astrophoto/api/storage.py)（注册行 391） |
| `PATCH` | `/astrophoto/v1/storage/locations/{id}/volume` | 200 | [update_volume](../../../astrophoto/api/storage.py)（注册行 392） |
| `POST` | `/astrophoto/v1/storage/cache/configure` | 200 | [configure_cache](../../../astrophoto/api/storage.py)（注册行 393） |
| `POST` | `/astrophoto/v1/storage/cache/clear` | 200 | [clear_cache](../../../astrophoto/api/storage.py)（注册行 394） |
| `POST` | `/astrophoto/v1/storage/migrations/preflight` | 200 | [migration_preflight](../../../astrophoto/api/storage.py)（注册行 395） |
| `POST` | `/astrophoto/v1/storage/data-root/preflight` | 200 | [data_root_preflight](../../../astrophoto/api/storage.py)（注册行 396） |
| `POST` | `/astrophoto/v1/storage/migrations` | 202 | [start_migration](../../../astrophoto/api/storage.py)（注册行 397） |
| `GET` | `/astrophoto/v1/storage/migrations/{id}` | 200 | [operation_handler('migration')](../../../astrophoto/api/storage.py)（注册行 398） |
| `POST` | `/astrophoto/v1/storage/migrations/{id}/cancel` | 200 | [operation_handler('migration', 'cancel')](../../../astrophoto/api/storage.py)（注册行 399） |
| `POST` | `/astrophoto/v1/storage/migrations/{id}/retry` | 202 | [operation_handler('migration', 'retry')](../../../astrophoto/api/storage.py)（注册行 400） |
| `POST` | `/astrophoto/v1/storage/migrations/{id}/discard-target` | 200 | [discard_migration_target](../../../astrophoto/api/storage.py)（注册行 401） |

### POST `/storage/init`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(payload)`

### PATCH `/storage/settings`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(payload, ('expected_revision',), ('imports', 'workspace', 'cache'))`
- `fields(payload['cache'], ('max_size_gb',))`
- `fields(payload['imports'], ('default_mode',))`
- `fields(payload['workspace'], ('default_workspace_id',))`

### PUT `/storage/location-policy`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('expected_revision', 'order', 'quotas'))`

### POST `/storage/locations`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('path', 'name'), ('request_id',))`

### POST `/storage/native-picker`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('kind',), ('language',))`

### PATCH `/storage/locations/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('expected_revision',), ('name', 'enabled', 'default'))`

### DELETE `/storage/locations/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('expected_revision',), ('target_workspace_id',))`

### POST `/storage/locations/{id}/relocate`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('new_path',), ('allow_partial',))`

### PATCH `/storage/locations/{id}/volume`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('quota_bytes', 'expected_revision'))`

### POST `/storage/cache/configure`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('path', 'max_size_gb', 'expected_revision'))`

### POST `/storage/cache/clear`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('scope',))`

### POST `/storage/migrations/preflight`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('workspace_id', 'target_path'))`
- `fields(body, ('workspace_id', 'target_workspace_id', 'amount', 'unit'))`

### POST `/storage/data-root/preflight`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('target_path',))`

### POST `/storage/migrations`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('plan_id', 'option_id', 'idempotency_key'))`
- `fields(body, ('workspace_id', 'target_path', 'idempotency_key'))`

### POST `/storage/migrations/{id}/discard-target`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('confirm',))`

## 设备和设备组合

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/equipment` | 200 | [list_equipment](../../../astrophoto/api/equipment.py)（注册行 61） |
| `GET` | `/astrophoto/v1/equipment/{id}` | 200 | [get_equipment](../../../astrophoto/api/equipment.py)（注册行 62） |
| `POST` | `/astrophoto/v1/equipment` | 201 | [create_equipment](../../../astrophoto/api/equipment.py)（注册行 63） |
| `PATCH` | `/astrophoto/v1/equipment/{id}` | 200 | [update_equipment](../../../astrophoto/api/equipment.py)（注册行 64） |
| `DELETE` | `/astrophoto/v1/equipment/{id}` | 204 | [delete_equipment](../../../astrophoto/api/equipment.py)（注册行 65） |
| `POST` | `/astrophoto/v1/equipment/{id}/archive` | 200 | [archive('equipment', True)](../../../astrophoto/api/equipment.py)（注册行 66） |
| `POST` | `/astrophoto/v1/equipment/{id}/restore` | 200 | [archive('equipment', False)](../../../astrophoto/api/equipment.py)（注册行 67） |
| `GET` | `/astrophoto/v1/optical-trains` | 200 | [list_trains](../../../astrophoto/api/equipment.py)（注册行 68） |
| `POST` | `/astrophoto/v1/optical-trains` | 201 | [create_train](../../../astrophoto/api/equipment.py)（注册行 69） |
| `GET` | `/astrophoto/v1/optical-trains/{id}` | 200 | [get_train](../../../astrophoto/api/equipment.py)（注册行 70） |
| `DELETE` | `/astrophoto/v1/optical-trains/{id}` | 204 | [delete_train](../../../astrophoto/api/equipment.py)（注册行 71） |
| `PATCH` | `/astrophoto/v1/optical-trains/{id}` | 200 | [update_train](../../../astrophoto/api/equipment.py)（注册行 72） |
| `POST` | `/astrophoto/v1/optical-trains/{id}/archive` | 200 | [archive('optical_trains', True)](../../../astrophoto/api/equipment.py)（注册行 73） |
| `POST` | `/astrophoto/v1/optical-trains/{id}/restore` | 200 | [archive('optical_trains', False)](../../../astrophoto/api/equipment.py)（注册行 74） |

### DELETE `/equipment/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `object_fields(body, ())`

### DELETE `/optical-trains/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `object_fields(body, ())`

## 素材目录、校准与项目

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/catalog/projects` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 550） |
| `POST` | `/astrophoto/v1/catalog/projects` | 201 | [project_route](../../../astrophoto/api/catalog.py)（注册行 551） |
| `GET` | `/astrophoto/v1/catalog/projects/{id}` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 552） |
| `PATCH` | `/astrophoto/v1/catalog/projects/{id}` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 553） |
| `DELETE` | `/astrophoto/v1/catalog/projects/{id}` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 554） |
| `POST` | `/astrophoto/v1/catalog/projects/{id}/folders` | 201 | [project_folders](../../../astrophoto/api/catalog.py)（注册行 555） |
| `POST` | `/astrophoto/v1/catalog/source-folder` | 200 | [inspect_folder](../../../astrophoto/api/catalog.py)（注册行 556） |
| `POST` | `/astrophoto/v1/catalog/projects/{id}/nodes` | 201 | [project_node](../../../astrophoto/api/catalog.py)（注册行 557） |
| `POST` | `/astrophoto/v1/catalog/projects/{id}/references` | 201 | [add_references](../../../astrophoto/api/catalog.py)（注册行 558） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/files` | 200 | [collection_files](../../../astrophoto/api/catalog.py)（注册行 559） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/files/{file_id}` | 200 | [collection_files](../../../astrophoto/api/catalog.py)（注册行 560） |
| `POST` | `/astrophoto/v1/catalog/subframe_collection/{id}/files` | 202 | [append_subframes](../../../astrophoto/api/catalog.py)（注册行 561） |
| `DELETE` | `/astrophoto/v1/catalog/subframe_collection/{id}/files/{file_id}` | 200 | [remove_file](../../../astrophoto/api/catalog.py)（注册行 562） |
| `PATCH` | `/astrophoto/v1/catalog/projects/{id}/nodes/{node_id}` | 200 | [project_node](../../../astrophoto/api/catalog.py)（注册行 563） |
| `DELETE` | `/astrophoto/v1/catalog/projects/{id}/nodes/{node_id}` | 200 | [project_node](../../../astrophoto/api/catalog.py)（注册行 564） |
| `POST` | `/astrophoto/v1/catalog/subframe_collection/{id}/bindings` | 200 | [assignments](../../../astrophoto/api/catalog.py)（注册行 565） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/bindings` | 200 | [linked_masters](../../../astrophoto/api/catalog.py)（注册行 566） |
| `DELETE` | `/astrophoto/v1/catalog/subframe_collection/{id}/bindings/{master_id}` | 200 | [unlink](../../../astrophoto/api/catalog.py)（注册行 567） |
| `DELETE` | `/astrophoto/v1/catalog/calibration_master/{id}` | 200 | [remove_master](../../../astrophoto/api/catalog.py)（注册行 568） |
| `DELETE` | `/astrophoto/v1/catalog/subframe_collection/{id}` | 200 | [remove_collection](../../../astrophoto/api/catalog.py)（注册行 569） |
| `GET` | `/astrophoto/v1/catalog/{resource}` | 200 | [listing](../../../astrophoto/api/catalog.py)（注册行 570） |
| `GET` | `/astrophoto/v1/catalog/{resource}/{id}` | 200 | [detail](../../../astrophoto/api/catalog.py)（注册行 571） |
| `PATCH` | `/astrophoto/v1/catalog/{resource}/{id}` | 200 | [edit](../../../astrophoto/api/catalog.py)（注册行 572） |
| `DELETE` | `/astrophoto/v1/catalog/{resource}/{id}` | 200 | [remove_file](../../../astrophoto/api/catalog.py)（注册行 573） |

### GET `/catalog/projects`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('name',), ('notes',))`
- `fields(body, (), ('revision', 'name', 'notes'))`

### POST `/catalog/projects`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('name',), ('notes',))`
- `fields(body, (), ('revision', 'name', 'notes'))`

### GET `/catalog/projects/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('name',), ('notes',))`
- `fields(body, (), ('revision', 'name', 'notes'))`

### PATCH `/catalog/projects/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('name',), ('notes',))`
- `fields(body, (), ('revision', 'name', 'notes'))`

### DELETE `/catalog/projects/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('name',), ('notes',))`
- `fields(body, (), ('revision', 'name', 'notes'))`

### POST `/catalog/projects/{id}/folders`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('paths',))`

### POST `/catalog/source-folder`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('path',))`

### POST `/catalog/projects/{id}/nodes`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('kind',), ('name', 'parent_id', 'parent_path', 'resource_id'))`
- `fields(body, (), ('revision', 'name', 'parent_id', 'parent_path'))`

### POST `/catalog/projects/{id}/references`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('parent_path', 'assets'))`
- `fields(item, ('kind', 'resource_id'), ('name',))`

### POST `/catalog/subframe_collection/{id}/files`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('sources',))`

### DELETE `/catalog/subframe_collection/{id}/files/{file_id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision',))`

### PATCH `/catalog/projects/{id}/nodes/{node_id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('kind',), ('name', 'parent_id', 'parent_path', 'resource_id'))`
- `fields(body, (), ('revision', 'name', 'parent_id', 'parent_path'))`

### DELETE `/catalog/projects/{id}/nodes/{node_id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`
- `fields(body, ('kind',), ('name', 'parent_id', 'parent_path', 'resource_id'))`
- `fields(body, (), ('revision', 'name', 'parent_id', 'parent_path'))`

### POST `/catalog/subframe_collection/{id}/bindings`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('master_ids',), ('preview',))`

### DELETE `/catalog/calibration_master/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision',))`

### DELETE `/catalog/subframe_collection/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision',))`

### PATCH `/catalog/{resource}/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision', *optional))`

### DELETE `/catalog/{resource}/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision',))`

## 浏览器直传

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `POST` | `/astrophoto/v1/library/direct-imports/preview` | 200 | [preview](../../../astrophoto/api/direct_import.py)（注册行 71） |
| `POST` | `/astrophoto/v1/library/direct-imports` | 201 | [start](../../../astrophoto/api/direct_import.py)（注册行 72） |
| `GET` | `/astrophoto/v1/library/direct-imports/{id}` | 200 | [status](../../../astrophoto/api/direct_import.py)（注册行 73） |
| `DELETE` | `/astrophoto/v1/library/direct-imports/{id}` | 200 | [cancel](../../../astrophoto/api/direct_import.py)（注册行 74） |
| `PUT` | `/astrophoto/v1/library/direct-imports/{id}/files/{entry_id}` | 200 | [put_file](../../../astrophoto/api/direct_import.py)（注册行 75） |

### POST `/library/direct-imports/preview`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('files', 'settings_revision'), ('attributes', 'parallel', 'workspace_ids', 'catalog'))`

### POST `/library/direct-imports`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('preview_id', 'idempotency_key'))`

### DELETE `/library/direct-imports/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`

## 素材记录、导入与受管文件

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `POST` | `/astrophoto/v1/library/catalog-import` | 202 | [direct_catalog_import](../../../astrophoto/api/library.py)（注册行 105） |
| `GET` | `/astrophoto/v1/library/catalog-import/{id}` | 200 | [catalog_import_status](../../../astrophoto/api/library.py)（注册行 106） |
| `POST` | `/astrophoto/v1/library/imports/{id}/retry-remaining` | 202 | [retry_import](../../../astrophoto/api/library.py)（注册行 107） |
| `POST` | `/astrophoto/v1/library/assets/{id}/delete-file` | 200 | [delete_file](../../../astrophoto/api/library.py)（注册行 108） |
| `GET` | `/astrophoto/v1/library/assets` | 200 | [list_assets](../../../astrophoto/api/library.py)（注册行 109） |
| `GET` | `/astrophoto/v1/library/assets/{id}` | 200 | [asset_detail](../../../astrophoto/api/library.py)（注册行 110） |
| `GET` | `/astrophoto/v1/library/import-groups` | 200 | [list_import_groups](../../../astrophoto/api/library.py)（注册行 111） |
| `POST` | `/astrophoto/v1/library/assets` | 201 | [write_asset](../../../astrophoto/api/library.py)（注册行 112） |
| `PATCH` | `/astrophoto/v1/library/assets/{id}` | 200 | [write_asset](../../../astrophoto/api/library.py)（注册行 113） |
| `DELETE` | `/astrophoto/v1/library/assets/{id}` | 200 | [unregister_asset](../../../astrophoto/api/library.py)（注册行 114） |

### POST `/library/catalog-import`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('sources', 'catalog'))`

### POST `/library/imports/{id}/retry-remaining`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`

### POST `/library/assets/{id}/delete-file`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`

## 宿主路径导入与引用重定位

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `POST` | `/astrophoto/v1/assets/import` | 202 | [import_assets](../../../astrophoto/api/assets.py)（注册行 29） |
| `POST` | `/astrophoto/v1/assets/import/preview` | 200 | [preview](../../../astrophoto/api/assets.py)（注册行 30） |
| `GET` | `/astrophoto/v1/assets/imports/{id}` | 200 | [operation_handler('import')](../../../astrophoto/api/assets.py)（注册行 31） |
| `POST` | `/astrophoto/v1/assets/imports/{id}/cancel` | 200 | [operation_handler('import', 'cancel')](../../../astrophoto/api/assets.py)（注册行 32） |
| `POST` | `/astrophoto/v1/assets/imports/{id}/retry` | 202 | [operation_handler('import', 'retry')](../../../astrophoto/api/assets.py)（注册行 33） |
| `POST` | `/astrophoto/v1/assets/{id}/relocate` | 200 | [relocate_asset](../../../astrophoto/api/assets.py)（注册行 34） |

### POST `/assets/import`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('idempotency_key',), (*IMPORT_OPTIONS, 'preview_id'))`

### POST `/assets/import/preview`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), IMPORT_OPTIONS)`

### POST `/assets/{id}/relocate`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('new_path',))`

## 科学接口（暂缓专项）

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/fits/assets` | 200 | [frames](../../../astrophoto/api/scientific.py)（注册行 38） |
| `GET` | `/astrophoto/v1/previews/settings` | 200 | [get_preview_settings](../../../astrophoto/api/scientific.py)（注册行 39） |
| `PUT` | `/astrophoto/v1/previews/settings` | 200 | [set_preview_settings](../../../astrophoto/api/scientific.py)（注册行 40） |

### PUT `/previews/settings`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('expected_revision', 'longest_edge'), ('canvas',))`

## Siril Bundle（暂缓专项）

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/software/siril` | 200 | [partial(status, bundle)](../../../extension/siril/routes.py)（注册行 76） |
| `POST` | `/astrophoto/v1/software/siril/discover` | 200 | [partial(discover, bundle)](../../../extension/siril/routes.py)（注册行 77） |
| `PUT` | `/astrophoto/v1/software/siril` | 200 | [partial(save, bundle)](../../../extension/siril/routes.py)（注册行 78） |
| `DELETE` | `/astrophoto/v1/software/siril` | 200 | [partial(clear, bundle)](../../../extension/siril/routes.py)（注册行 79） |
| `PUT` | `/astrophoto/v1/software/siril/enabled` | 200 | [partial(set_enabled, bundle)](../../../extension/siril/routes.py)（注册行 80） |
| `GET` | `/astrophoto/v1/software/siril/commands` | 200 | [commands](../../../extension/siril/routes.py)（注册行 81） |
| `POST` | `/astrophoto/v1/previews/siril/{command_id}` | 202 | [partial(start_preview, bundle)](../../../extension/siril/routes.py)（注册行 82） |
| `GET` | `/astrophoto/v1/previews/jobs/{id}` | 200 | [partial(preview_status, bundle)](../../../extension/siril/routes.py)（注册行 83） |
| `POST` | `/astrophoto/v1/previews/jobs/{id}/cancel` | 200 | [partial(cancel_preview, bundle)](../../../extension/siril/routes.py)（注册行 84） |
| `GET` | `/astrophoto/v1/previews/jobs/{id}/validate` | 200 | [partial(validate_preview, bundle)](../../../extension/siril/routes.py)（注册行 85） |
| `GET` | `/astrophoto/v1/previews/jobs/{id}/{side}` | 200 | [partial(image, bundle)](../../../extension/siril/routes.py)（注册行 86） |
