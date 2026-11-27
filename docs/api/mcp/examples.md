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

只在自动模式下使用。将编号替换为同一会话 `connection_status` 返回的实例编号，再核对已选实例。

```json
{"selection":"A1B2C3D4"}
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

预先创建临时组合。查看 `items`、`has_more` 和 `continue_with`。

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

只删除隔离测试视频；检查 `removed`、受管文件删除结果及外部原件保留情况。若有关联，先检查影响并取得用户同意。

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

先创建临时项目。查看 `items`、`has_more` 和 `continue_with`。

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

### canvas-list-sessions

```json
{}
```

### canvas-get

```json
{"session_id":"00000000-0000-4000-8000-000000000001"}
```

### canvas-find-nodes

```json
{"query":"PreviewImage"}
```

### node-search

```json
{"query":"PreviewImage"}
```

### node-describe

```json
{"node_type":"PreviewImage"}
```

### canvas-apply

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000002","expected_revision":"00000000-0000-4000-8000-000000000003","command_id":"00000000-0000-4000-8000-000000000004","commands":[{"action":"add_node","node_type":"PreviewImage"}]}
```

### canvas-command-status

```json
{"command_id":"00000000-0000-4000-8000-000000000004"}
```

### canvas-list-subgraphs

以 `canvas_get` 返回的 `session_id,target_id` 查询。核对 `graphs` 包含主图及当前工作流中的实例。

### canvas-open-subgraph

使用同一 `session_id,target_id`、列表返回的 `graph_id` 与新 `request_id`。进入后以返回的 `target_id` 继续操作。用 `graph_id: "root"` 返回主图。

### workflow-list

从 `canvas_list_sessions` 选择页面。以 `query` 搜索测试工作流，分页继续传入 `next_cursor`。

### workflow-get

从列表选定 `path`，读取 `workflow` 与 `file_revision`。当前画布草稿通过 `canvas_get` 读取。

### workflow-new

传 `session_id` 与新 `request_id`。使用返回的目标读取空白图。

### workflow-open

用 `session_id,path,request_id` 打开文件。若该文件已打开，核对返回同一标签中的草稿。

### workflow-save

传 `session_id,target_id,expected_revision,path,request_id` 保存为新测试文件，再用 `workflow_get` 或 ComfyUI 重开核对。

### workflow-rename

用已关闭测试文件的 `path,file_revision` 构造 `path,expected_file_revision`，再传 `new_path,request_id`。

### workflow-delete

仅对已关闭的测试副本传 `path,expected_file_revision,request_id`。通过列表核对。

### workflow-import

用测试图对象作为 `workflow`，并传新 `path,request_id`。通过 `workflow_get` 核对内容。

### workflow-run

从主图读取 `session_id,target_id,revision`，提交前三个对应字段和新 `request_id`。成功回执包含任务 ID。

### workflow-status

传 `task_id` 或已知提交的 `request_id`。用 `outputs` 的产物 ID 查询你的测试图。

### workflow-cancel

只传要停止的测试任务 `task_id`。通过状态工具观察最终结果。

### artifact-get

传状态工具返回的 `artifact_id`。可用时从返回的宿主视图引用查看产物。

### node-inspect

从当前画布读取 `session_id,target_id,node_id`。以连接 FITS 的自动拉伸节点获得 `input_ref`。

### node-preview

沿用该节点目标和输入引用，传最新图修订、一组 `parameters` 和新 `request_id`。画布参数仍可从 `canvas_get` 回读。

### node-preview-status

传 `preview_id` 或 `request_id`，等待 `ready` 并读取有效参数。

### node-compare

传节点目标和输入引用查看原图。带 `preview_id` 查看本轮输出，可指定 `view: "center"` 检查原始像素。

### node-preview-list

传同一节点目标查询其近期预览，核对候选 ID 和结果状态。

### node-preview-discard

传已结束的 `preview_id`，清除该预览及对应临时图像。

## 工作流、子图与节点示例

以下标识和路径均为占位示例；实际调用使用当前工具返回的值，并只操作隔离测试实例。

### library-deletion-impact

```json
{"name":"Demo Video"}
```

### canvas-list-subgraphs

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001"}
```

### canvas-open-subgraph

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","graph_id":"root","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-list

```json
{}
```

### workflow-get

```json
{"path":"demo.json"}
```

### workflow-new

```json
{"session_id":"00000000-0000-4000-8000-000000000001","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-open

```json
{"session_id":"00000000-0000-4000-8000-000000000001","path":"demo.json","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-save

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","expected_revision":"00000000-0000-4000-8000-000000000001","path":"demo.json","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-rename

```json
{"path":"demo.json","new_path":"renamed.json","expected_file_revision":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-delete

```json
{"path":"demo.json","expected_file_revision":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-import

```json
{"path":"demo.json","workflow":{},"request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-run

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","expected_revision":"00000000-0000-4000-8000-000000000001","request_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-status

```json
{"task_id":"00000000-0000-4000-8000-000000000001"}
```

### workflow-cancel

```json
{"task_id":"00000000-0000-4000-8000-000000000001"}
```

### artifact-get

```json
{"artifact_id":"00000000-0000-4000-8000-000000000001:0"}
```

### node-inspect

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","node_id":1}
```

### node-preview

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","node_id":1,"expected_revision":"00000000-0000-4000-8000-000000000001","input_ref":"00000000-0000-4000-8000-000000000001","parameters":{"value":1},"request_id":"00000000-0000-4000-8000-000000000001"}
```

### node-preview-status

```json
{"preview_id":"00000000-0000-4000-8000-000000000001"}
```

### node-compare

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","node_id":1,"input_ref":"00000000-0000-4000-8000-000000000001"}
```

### node-preview-list

```json
{"session_id":"00000000-0000-4000-8000-000000000001","target_id":"00000000-0000-4000-8000-000000000001","node_id":1}
```

### node-preview-discard

```json
{"preview_id":"00000000-0000-4000-8000-000000000001"}
```
