# MCP 隔离调用示例

每个小节只演示一个工具。示例均为示意，自动检查入参符合运行时 Schema。使用新的临时 Data Root 和专门生成的测试文件，将 `C:/astrophoto-demo/inputs` 替换为宿主上的隔离来源目录，实例地址和任务 ID 也使用本次运行实际取得的值。写入和删除只针对该隔离实例。

发现工具和 `call_tool` 示例的 JSON 参数直接传给对应入口。业务工具示例的 JSON 是业务入参，可直接传给已知工具，或放入 `call_tool` 的 `arguments` 并指定 `name`。

## 发现和连接

### list-tool-categories

启动隔离 MCP 服务。查看 `categories` 中实际提供的分类。

```json
{}
```

### list-category-tools

使用提供 `library` 的可信本机实例。查看 `tools` 中的名称和输入 Schema。

```json
{"category":"library"}
```

### call-tool

在隔离 MCP 服务中调用已发现的 `version`。查看返回的 `name` 和 `version`。

```json
{"name":"version","arguments":{}}
```

### version

查看隔离 MCP 服务的包名称和版本。

```json
{}
```

### connection-status

使用隔离 MCP 服务。查看当前连接状态，自动模式下也检查候选。

```json
{}
```

### connection-select

只在自动模式下使用。将地址替换为 `connection_status` 已发现的临时宿主地址。再调用 `connection_status` 核对已选实例。

```json
{"url":"http://127.0.0.1:8188"}
```

## 设备和设备组合

### equipment-list

预先登记临时相机。确认 `items` 中只有符合筛选的记录。

```json
{"equipment_type":"camera","limit":5}
```

### equipment-get

预先登记临时相机。核对返回的名称和设备类型。

```json
{"name":"Demo Camera","include_archived":true}
```

### equipment-create

预留唯一名称。创建后用 `equipment_get` 回读。

```json
{"equipment_type":"camera","name":"Demo Camera","product_name":"Fixture Camera"}
```

### equipment-update

预先创建临时相机。用 `equipment_get` 核对备注。

```json
{"name":"Demo Camera","notes":"isolated fixture"}
```

### equipment-set-archived

预先创建临时相机。用 `equipment_get` 加 `include_archived:true` 核对归档状态。

```json
{"name":"Demo Camera","archived":true}
```

### equipment-delete

只使用专门创建的临时相机。检查 `deleted`，再按名称确认条目已消失。

```json
{"name":"Demo Camera"}
```

### optical-train-list

预先创建临时组合。查看 `items` 和 `next_cursor`。

```json
{"limit":5}
```

### optical-train-get

预先创建临时组合。检查组合名和成员摘要。

```json
{"name":"Demo Train","include_archived":true}
```

### optical-train-create

预先创建未归档的临时相机。用 `optical_train_get` 核对成员。

```json
{"name":"Demo Train","camera":"Demo Camera"}
```

### optical-train-update

预先创建装有临时相机的组合。确认组合的相机字段已清空。

```json
{"name":"Demo Train","camera":null}
```

### optical-train-set-archived

预先创建临时组合。用 `optical_train_get` 加 `include_archived:true` 核对归档状态。

```json
{"name":"Demo Train","archived":true}
```

### optical-train-delete

只使用专门创建的临时组合。检查 `deleted`，再按名称确认组合已消失。

```json
{"name":"Demo Train"}
```

## 素材、导入和校准

### library-list

先登记临时视频。核对 `items` 中的类型和名称。

```json
{"query":"Demo","asset_type":"video","limit":5}
```

### library-get

先登记临时子帧组。查看组摘要和校准绑定。

```json
{"name":"Demo Lights"}
```

### library-list-subframes

先登记含至少一帧的临时组。查看成员文件名及 `file_path`。

```json
{"collection_name":"Demo Lights","limit":5}
```

### library-inspect-folder

只列隔离来源目录。检查 `items` 中的相对路径。

```json
{"folder_path":"C:/astrophoto-demo/inputs","limit":5}
```

### library-import

先在隔离来源目录放入临时视频。保存返回的 `task` 并查询作业。

```json
{"asset_type":"video","name":"Demo Video","source_paths":["C:/astrophoto-demo/inputs/video.ser"]}
```

### library-import-status

用隔离导入实际返回的任务号替换示意值。检查 `status`，完成后用 `library_get` 回读。

```json
{"task":"IMP-0123ABCD"}
```

### library-add-subframes

准备临时子帧组和未登记的临时帧。轮询 `library_import_status`，再查看组成员。

```json
{"collection_name":"Demo Lights","source_paths":["C:/astrophoto-demo/inputs/next.fit"]}
```

### library-update

先登记临时视频。用 `library_get` 核对新备注。

```json
{"name":"Demo Video","notes":"isolated fixture"}
```

### library-remove

只注销临时视频。检查 `removed`，并在隔离目录核对文件仍存在。

```json
{"name":"Demo Video"}
```

### library-remove-subframe

对以引用模式导入的临时组使用 `library_list_subframes` 返回的准确路径。检查 `removed`、成员列表及原文件。

```json
{"collection_name":"Demo Lights","file_path":"C:/astrophoto-demo/inputs/next.fit"}
```

### library-find-calibration

登记已指定帧类型的临时组和临时暗场主帧。查看候选及逐字段比较。

```json
{"collection_name":"Demo Lights","master_type":"dark"}
```

### library-bind-calibration

准备可绑定的临时组及主帧。用 `library_get` 检查绑定。

```json
{"collection_name":"Demo Lights","master_names":["Demo Dark"]}
```

### library-unbind-calibration

先在临时组绑定临时主帧。确认该绑定已移除且主帧仍可查询。

```json
{"collection_name":"Demo Lights","master_name":"Demo Dark"}
```

## 项目

### project-list

先创建临时项目。查看 `items` 和 `next_cursor`。

```json
{"query":"Demo","limit":5}
```

### project-get

预先建立临时项目和 `/Raw` 文件夹。查看节点和直接子项。

```json
{"project_name":"Demo Project","path":"/Raw"}
```

### project-create

预留唯一名称。用 `project_get` 回读空项目。

```json
{"name":"Demo Project"}
```

### project-update

先创建临时项目。用 `project_get` 核对备注。

```json
{"project_name":"Demo Project","notes":"isolated fixture"}
```

### project-delete

只使用专门创建的临时项目。先用 `project_impact` 查看当前数量，删除后核对项目列表和原素材登记。

```json
{"project_name":"Demo Project"}
```

### project-create-folders

先创建临时项目。用 `project_get` 查看新路径。

```json
{"project_name":"Demo Project","paths":["/Raw/Lights"]}
```

### project-add-assets

准备临时项目、文件夹和已登记的临时视频。用 `project_get` 核对别名路径。

```json
{"project_name":"Demo Project","folder_path":"/Raw","assets":[{"name":"Demo Video","alias":"Demo Clip"}]}
```

### project-update-node

先建立临时引用。回读新路径并核对引用仍指向同一素材。

```json
{"project_name":"Demo Project","path":"/Raw/Demo Clip","new_name":"Renamed Clip"}
```

### project-remove-node

只移除临时引用。用 `project_get` 查看父文件夹，用 `library_get` 验证素材仍登记。

```json
{"project_name":"Demo Project","path":"/Raw/Demo Clip"}
```

### project-impact

预先建立临时树。核对 `affected_folders` 与 `affected_references`。

```json
{"project_name":"Demo Project","path":"/Raw"}
```

## 受管文件

### storage-delete-managed-file

将专门生成的临时视频以 Copy 模式导入全新的隔离 Data Root，并用 `library_get` 确认素材名称及受管位置。删除返回 `deleted_file:true` 后，再用 `library_get` 确认素材登记仍可读，并在临时工作区检查受管副本已删除、隔离来源文件字节仍在。

```json
{"name":"Demo Disposable Video"}
```
