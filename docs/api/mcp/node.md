# MCP：node

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `node_inspect`

Read current parameters, available input reference, and any verified current result.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/node_tuning.py)（第 27 行）。

[隔离调用与结果核对](examples.md#node-inspect)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "node_id": {
      "minimum": 0,
      "type": "integer"
    },
    "session_id": {
      "format": "uuid",
      "type": "string"
    },
    "target_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "session_id",
    "target_id",
    "node_id"
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

## `node_preview`

Try one parameter set on the inspected input without editing the workflow.

注解：idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/node_tuning.py)（第 32 行）。

[隔离调用与结果核对](examples.md#node-preview)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "expected_revision": {
      "format": "uuid",
      "type": "string"
    },
    "input_ref": {
      "format": "uuid",
      "type": "string"
    },
    "node_id": {
      "minimum": 0,
      "type": "integer"
    },
    "parameters": {
      "additionalProperties": {
        "anyOf": [
          {
            "type": "boolean"
          },
          {
            "type": "integer"
          },
          {
            "type": "number"
          },
          {
            "type": "string"
          }
        ]
      },
      "maxProperties": 32,
      "minProperties": 1,
      "type": "object"
    },
    "request_id": {
      "format": "uuid",
      "type": "string"
    },
    "session_id": {
      "format": "uuid",
      "type": "string"
    },
    "target_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "session_id",
    "target_id",
    "node_id",
    "expected_revision",
    "input_ref",
    "parameters",
    "request_id"
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

## `node_preview_status`

Read the processing state and effective parameters of one temporary preview.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/node_tuning.py)（第 39 行）。

[隔离调用与结果核对](examples.md#node-preview-status)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "preview_id": {
      "anyOf": [
        {
          "format": "uuid",
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "request_id": {
      "anyOf": [
        {
          "format": "uuid",
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    }
  },
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

## `node_compare`

View the original and current result, or compare one preview using the same view.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/node_tuning.py)（第 46 行）。

[隔离调用与结果核对](examples.md#node-compare)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "input_ref": {
      "format": "uuid",
      "type": "string"
    },
    "node_id": {
      "minimum": 0,
      "type": "integer"
    },
    "preview_id": {
      "anyOf": [
        {
          "format": "uuid",
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "reference": {
      "default": "input",
      "enum": [
        "input",
        "current"
      ],
      "type": "string"
    },
    "session_id": {
      "format": "uuid",
      "type": "string"
    },
    "target_id": {
      "format": "uuid",
      "type": "string"
    },
    "view": {
      "default": "full",
      "enum": [
        "full",
        "center",
        "tl",
        "tr",
        "bl",
        "br"
      ],
      "type": "string"
    }
  },
  "required": [
    "session_id",
    "target_id",
    "node_id",
    "input_ref"
  ],
  "type": "object"
}
```

## `node_preview_list`

List recent previews from this specific node instance.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/node_tuning.py)（第 60 行）。

[隔离调用与结果核对](examples.md#node-preview-list)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "limit": {
      "default": 10,
      "maximum": 50,
      "minimum": 1,
      "type": "integer"
    },
    "node_id": {
      "minimum": 0,
      "type": "integer"
    },
    "session_id": {
      "format": "uuid",
      "type": "string"
    },
    "target_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "session_id",
    "target_id",
    "node_id"
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

## `node_preview_discard`

Remove an ended temporary preview and its cached views.

注解：destructiveHint=True, idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/node_tuning.py)（第 66 行）。

[隔离调用与结果核对](examples.md#node-preview-discard)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "preview_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "preview_id"
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
