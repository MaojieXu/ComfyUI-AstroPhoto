# HTTP 接口约定

扩展路由前缀为 `/astrophoto/v1`，注册入口为 [routes.py](../../../astrophoto/api/routes.py)，完整方法与路径见[注册路由清单](routes.md)，逐操作请求、返回和副作用见[HTTP 契约](contracts.md)，首次调用示例见[隔离示例](catalog-contracts.md)。

## 信任与请求

设备、素材与存储各自使用请求授权函数；共同依赖受信本机部署、回环请求及 Host/Origin/转发头检查。具体要求以 [security.py](../../../astrophoto/api/security.py) 和 [library.py](../../../astrophoto/api/library.py) 为准，不能将不同入口的请求头要求混同。设置 `X-AstroPhoto-Instance-ID` 时，实例身份不一致返回 `TARGET_INSTANCE_MISMATCH`。

通用处理器对非流式请求要求 JSON，默认上限 65536 字节；宿主路径导入及预检上限为 512 KiB，浏览器直传预检上限为 16 MiB，上传流发送原始字节。处理器对非 204 结果加入 `request_id`；204 返回 `X-Request-ID`。错误通常包含 `error` 和 `request_id`，具体状态码及例外参见 [errors.py](../../../astrophoto/api/errors.py) 和 [storage.py](../../../astrophoto/api/storage.py)。

## 关键操作边界

| 动作 | 入口 | 结果与注意事项 |
| --- | --- | --- |
| 删除目录素材 | `DELETE /astrophoto/v1/catalog/{resource}/{id}` 及特定类型路径 | 清理登记、关联及受管文件，保留外部原件。存在关联时先查询删除影响。 |
| 查询删除影响 | 对应素材或子帧资源下的 `GET .../deletion-impact` | 返回关联、文件处理范围和用于确认的影响摘要。 |
| 移除项目节点 | `DELETE /astrophoto/v1/catalog/projects/{id}/nodes/{node_id}` | 移除逻辑结构和引用，不删除素材文件。 |
| 移除存储位置 | `DELETE /astrophoto/v1/storage/locations/{id}` | 处理受管数据迁移后移除登记；最后位置、冲突和活动操作受保护。 |

详细业务语义见[素材](../../domains/assets.md)和[存储](../../domains/storage.md)。设备更新按字段提交，由服务端执行原子写入。

已退役路径由宿主返回 404。共用的业务错误包括 403 信任边界、404 资源不存在、409 冲突、422 字段/业务校验、423 存储占用、503 存储未就绪和 507 容量不足。扩展原生状态路由可独立诊断。
