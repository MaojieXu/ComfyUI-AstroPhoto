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
| `GET` | `/astrophoto/v1/catalog/projects` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 594） |
| `POST` | `/astrophoto/v1/catalog/projects` | 201 | [project_route](../../../astrophoto/api/catalog.py)（注册行 595） |
| `GET` | `/astrophoto/v1/catalog/projects/{id}` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 596） |
| `PATCH` | `/astrophoto/v1/catalog/projects/{id}` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 597） |
| `DELETE` | `/astrophoto/v1/catalog/projects/{id}` | 200 | [project_route](../../../astrophoto/api/catalog.py)（注册行 598） |
| `POST` | `/astrophoto/v1/catalog/projects/{id}/folders` | 201 | [project_folders](../../../astrophoto/api/catalog.py)（注册行 599） |
| `POST` | `/astrophoto/v1/catalog/source-folder` | 200 | [inspect_folder](../../../astrophoto/api/catalog.py)（注册行 600） |
| `POST` | `/astrophoto/v1/catalog/projects/{id}/nodes` | 201 | [project_node](../../../astrophoto/api/catalog.py)（注册行 601） |
| `POST` | `/astrophoto/v1/catalog/projects/{id}/references` | 201 | [add_references](../../../astrophoto/api/catalog.py)（注册行 602） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/files` | 200 | [collection_files](../../../astrophoto/api/catalog.py)（注册行 603） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/files/{file_id}` | 200 | [collection_files](../../../astrophoto/api/catalog.py)（注册行 604） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/files/{file_id}/deletion-impact` | 200 | [deletion_impact](../../../astrophoto/api/catalog.py)（注册行 605） |
| `POST` | `/astrophoto/v1/catalog/subframe_collection/{id}/files` | 202 | [append_subframes](../../../astrophoto/api/catalog.py)（注册行 606） |
| `DELETE` | `/astrophoto/v1/catalog/subframe_collection/{id}/files/{file_id}` | 200 | [remove_file](../../../astrophoto/api/catalog.py)（注册行 607） |
| `PATCH` | `/astrophoto/v1/catalog/projects/{id}/nodes/{node_id}` | 200 | [project_node](../../../astrophoto/api/catalog.py)（注册行 608） |
| `DELETE` | `/astrophoto/v1/catalog/projects/{id}/nodes/{node_id}` | 200 | [project_node](../../../astrophoto/api/catalog.py)（注册行 609） |
| `POST` | `/astrophoto/v1/catalog/subframe_collection/{id}/bindings` | 200 | [assignments](../../../astrophoto/api/catalog.py)（注册行 610） |
| `GET` | `/astrophoto/v1/catalog/subframe_collection/{id}/bindings` | 200 | [linked_masters](../../../astrophoto/api/catalog.py)（注册行 611） |
| `DELETE` | `/astrophoto/v1/catalog/subframe_collection/{id}/bindings/{master_id}` | 200 | [unlink](../../../astrophoto/api/catalog.py)（注册行 612） |
| `DELETE` | `/astrophoto/v1/catalog/subframe_collection/{id}` | 200 | [remove_collection](../../../astrophoto/api/catalog.py)（注册行 613） |
| `GET` | `/astrophoto/v1/catalog/{resource}/{id}/deletion-impact` | 200 | [deletion_impact](../../../astrophoto/api/catalog.py)（注册行 614） |
| `GET` | `/astrophoto/v1/catalog/{resource}` | 200 | [listing](../../../astrophoto/api/catalog.py)（注册行 615） |
| `GET` | `/astrophoto/v1/catalog/{resource}/{id}` | 200 | [detail](../../../astrophoto/api/catalog.py)（注册行 616） |
| `PATCH` | `/astrophoto/v1/catalog/{resource}/{id}` | 200 | [edit](../../../astrophoto/api/catalog.py)（注册行 617） |
| `DELETE` | `/astrophoto/v1/catalog/{resource}/{id}` | 200 | [remove_file](../../../astrophoto/api/catalog.py)（注册行 618） |

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

- `fields(body, (), ('revision', 'impact_revision'))`

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

### DELETE `/catalog/subframe_collection/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision', 'impact_revision'))`

### PATCH `/catalog/{resource}/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision', *optional))`

### DELETE `/catalog/{resource}/{id}`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, (), ('revision', 'impact_revision'))`

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

## 在线画布

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `GET` | `/astrophoto/v1/canvas/socket` | 101 | [partial(socket, runtime=runtime, broker=broker, tuning=tuning)](../../../astrophoto/api/canvas.py)（注册行 320） |
| `GET` | `/astrophoto/v1/canvas/sessions` | 200 | [partial(bound, action='sessions')](../../../astrophoto/api/canvas.py)（注册行 321） |
| `POST` | `/astrophoto/v1/canvas/commands` | 200 | [partial(bound, action='command')](../../../astrophoto/api/canvas.py)（注册行 322） |
| `GET` | `/astrophoto/v1/canvas/commands/{id}` | 200 | [partial(bound, action='receipt')](../../../astrophoto/api/canvas.py)（注册行 323） |
| `POST` | `/astrophoto/v1/canvas/node/{action}` | 200 | [partial(bound, action='node')](../../../astrophoto/api/canvas.py)（注册行 324） |
| `POST` | `/astrophoto/v1/canvas/workflows` | 200 | [partial(create_workflow, runtime=runtime)](../../../astrophoto/api/canvas.py)（注册行 325） |
| `GET` | `/astrophoto/v1/canvas/outputs/{id}` | 200 | [partial(bound, action='output')](../../../astrophoto/api/canvas.py)（注册行 326） |

## 素材记录、导入与受管文件

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `POST` | `/astrophoto/v1/library/catalog-import` | 202 | [direct_catalog_import](../../../astrophoto/api/library.py)（注册行 97） |
| `GET` | `/astrophoto/v1/library/catalog-import/{id}` | 200 | [catalog_import_status](../../../astrophoto/api/library.py)（注册行 98） |
| `POST` | `/astrophoto/v1/library/imports/{id}/retry-remaining` | 202 | [retry_import](../../../astrophoto/api/library.py)（注册行 99） |
| `GET` | `/astrophoto/v1/library/assets` | 200 | [list_assets](../../../astrophoto/api/library.py)（注册行 100） |
| `GET` | `/astrophoto/v1/library/assets/{id}` | 200 | [asset_detail](../../../astrophoto/api/library.py)（注册行 101） |
| `GET` | `/astrophoto/v1/library/import-groups` | 200 | [list_import_groups](../../../astrophoto/api/library.py)（注册行 102） |
| `POST` | `/astrophoto/v1/library/assets` | 201 | [write_asset](../../../astrophoto/api/library.py)（注册行 103） |
| `PATCH` | `/astrophoto/v1/library/assets/{id}` | 200 | [write_asset](../../../astrophoto/api/library.py)（注册行 104） |
| `GET` | `/astrophoto/v1/library/assets/{id}/deletion-impact` | 200 | [deletion_impact](../../../astrophoto/api/library.py)（注册行 105） |
| `DELETE` | `/astrophoto/v1/library/assets/{id}` | 200 | [remove_file](../../../astrophoto/api/library.py)（注册行 106） |

### POST `/library/catalog-import`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body, ('sources', 'catalog'))`

### POST `/library/imports/{id}/retry-remaining`

处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：

- `fields(body)`

## 宿主路径导入与引用重定位

| 方法 | 路径 | 成功码 | 注册处理器与源码 |
| --- | --- | --- | --- |
| `POST` | `/astrophoto/v1/assets/import` | 202 | [import_assets](../../../astrophoto/api/assets.py)（注册行 33） |
| `POST` | `/astrophoto/v1/assets/import/preview` | 200 | [preview](../../../astrophoto/api/assets.py)（注册行 34） |
| `GET` | `/astrophoto/v1/assets/imports/{id}` | 200 | [operation_handler('import')](../../../astrophoto/api/assets.py)（注册行 35） |
| `POST` | `/astrophoto/v1/assets/imports/{id}/cancel` | 200 | [operation_handler('import', 'cancel')](../../../astrophoto/api/assets.py)（注册行 36） |
| `POST` | `/astrophoto/v1/assets/imports/{id}/retry` | 202 | [operation_handler('import', 'retry')](../../../astrophoto/api/assets.py)（注册行 37） |
| `POST` | `/astrophoto/v1/assets/{id}/relocate` | 200 | [relocate_asset](../../../astrophoto/api/assets.py)（注册行 38） |
| `GET` | `/astrophoto/v1/assets/{id}/path` | 200 | [asset_path](../../../astrophoto/api/assets.py)（注册行 39） |

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
