# 隔离环境中的请求示例

示例使用临时 Data Root 及自建测试文件。路径、端口、修订号和返回的 ID 均取自同一次隔离运行。实际操作、错误和返回字段见 [HTTP 操作契约](contracts.md)。

## 状态、设备和项目

在测试客户端里设置 `X-AstroPhoto-Local: 1` 与 `Sec-Fetch-Site: same-origin`，写入发送 `Content-Type: application/json`。在真实浏览器应用中由宿主请求上下文提供 Fetch Metadata。

1. `GET /astrophoto/v1/status` 检查 `api_version` 与能力。
2. 对 `POST /astrophoto/v1/equipment` 发送以下测试资料，从 201 响应取得设备 ID。可用同一 ID GET 回读，以 PATCH 只提交本次改动。
3. 对 `POST /astrophoto/v1/catalog/projects` 发送 `{"name":"Example project"}`，再用返回的项目 ID 查询 `?path=/&view=impact`。空项目的文件夹及素材引用数量均为 0。

```json
{"equipment_type":"camera","name":"Example camera","product_name":"Fixture"}
```

## 宿主路径引用导入

1. 查询 `GET /astrophoto/v1/storage`，确认默认导入模式为 `reference`，读取 `imports.revision`。
2. `POST /astrophoto/v1/assets/import/preview` 发送下例，并记录 `preview_id`。
3. 对 `POST /astrophoto/v1/assets/import` 重用同样的参数，再加入返回的 `preview_id` 与本次专用的 `idempotency_key`。保存任务 ID 并轮询 `GET /astrophoto/v1/assets/imports/{id}`。
4. 收到完成回执后，查询 `GET /astrophoto/v1/catalog/image_result?exact_name=Example%20image`，核对登记与原件仍可读。

```json
{
  "sources": ["C:/isolated-fixture/source.fit"],
  "settings_revision": 0,
  "catalog": {"kind": "image_result", "asset_type": "image_result", "name": "Example image"}
}
```

## 浏览器复制与恢复

Copy 模式下先 `POST /library/direct-imports/preview` 校验清单，再以返回的 `preview_id` 和唯一幂等键创建直传作业。按作业的条目 ID 逐个 PUT 文件原始字节。刷新后查询作业，保留已复制的条目，只重新选择和上传待传原文件。实际用例同时核对目标副本及原始文件内容。

[设备请求测试](../../../tests/integration/test_equipment_api.py) · [项目及引用导入测试](../../../tests/integration/test_photography_library.py) · [浏览器直传测试](../../../tests/integration/test_direct_import.py)
