# MCP：storage

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `storage_delete_managed_file`

Delete one AstroPhoto-managed file; external reference files are not deleted.

For a subframe collection, provide the registered file_path of one member.
The catalog registration remains and may report the file unavailable.

注解：destructiveHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 286 行）。

[隔离调用与结果核对](examples.md#storage-delete-managed-file)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "file_path": {
      "anyOf": [
        {
          "description": "Path on the ComfyUI host.",
          "minLength": 1,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "name"
  ],
  "type": "object"
}
```

输出 Schema（仅包含已声明部分）：

```json
{
  "additionalProperties": true,
  "type": "object"
}
```
