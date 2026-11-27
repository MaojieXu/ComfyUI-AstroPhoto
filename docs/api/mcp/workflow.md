# MCP：workflow

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `workflow_list`

List saved native workflow files for the selected ComfyUI page.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 61 行）。

[隔离调用与结果核对](examples.md#workflow-list)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "cursor": {
      "anyOf": [
        {
          "maxLength": 240,
          "minLength": 1,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "folder": {
      "anyOf": [
        {
          "maxLength": 240,
          "minLength": 1,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "limit": {
      "default": 50,
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    },
    "query": {
      "anyOf": [
        {
          "maxLength": 240,
          "minLength": 1,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "session_id": {
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

## `workflow_get`

Read a saved workflow and its file revision. Use canvas_get for live edits.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 68 行）。

[隔离调用与结果核对](examples.md#workflow-get)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
    },
    "session_id": {
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
  "required": [
    "path"
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

## `workflow_new`

Open an empty workflow in a new tab; the current draft stays open.

注解：idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 73 行）。

[隔离调用与结果核对](examples.md#workflow-new)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "request_id": {
      "format": "uuid",
      "type": "string"
    },
    "session_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "session_id",
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

## `workflow_open`

Open a saved workflow or focus its existing tab and draft.

注解：idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 78 行）。

[隔离调用与结果核对](examples.md#workflow-open)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
    },
    "request_id": {
      "format": "uuid",
      "type": "string"
    },
    "session_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "session_id",
    "path",
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

## `workflow_save`

Save a snapshot of the guarded main graph as a new workflow file.

注解：idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 83 行）。

[隔离调用与结果核对](examples.md#workflow-save)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "expected_revision": {
      "format": "uuid",
      "type": "string"
    },
    "mode": {
      "const": "save_as",
      "default": "save_as",
      "type": "string"
    },
    "path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
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
    "expected_revision",
    "path",
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

## `workflow_rename`

Move a closed saved workflow within the library without overwriting a destination.

注解：destructiveHint=True, idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 90 行）。

[隔离调用与结果核对](examples.md#workflow-rename)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "expected_file_revision": {
      "pattern": "^[a-f0-9]{64}$",
      "type": "string"
    },
    "new_path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
    },
    "path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
    },
    "request_id": {
      "format": "uuid",
      "type": "string"
    },
    "session_id": {
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
  "required": [
    "path",
    "new_path",
    "expected_file_revision",
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

## `workflow_delete`

Delete a closed saved workflow only if its file revision still matches.

注解：destructiveHint=True, idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 97 行）。

[隔离调用与结果核对](examples.md#workflow-delete)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "expected_file_revision": {
      "pattern": "^[a-f0-9]{64}$",
      "type": "string"
    },
    "path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
    },
    "request_id": {
      "format": "uuid",
      "type": "string"
    },
    "session_id": {
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
  "required": [
    "path",
    "expected_file_revision",
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

## `workflow_import`

Store a native ComfyUI graph in a new workflow file.

注解：idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 104 行）。

[隔离调用与结果核对](examples.md#workflow-import)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "path": {
      "maxLength": 240,
      "minLength": 1,
      "type": "string"
    },
    "request_id": {
      "format": "uuid",
      "type": "string"
    },
    "session_id": {
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
    "workflow": {
      "additionalProperties": true,
      "type": "object"
    }
  },
  "required": [
    "path",
    "workflow",
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

## `workflow_run`

Submit one snapshot of the current main graph. Keep request_id to recover the receipt.

注解：idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 110 行）。

[隔离调用与结果核对](examples.md#workflow-run)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "expected_revision": {
      "format": "uuid",
      "type": "string"
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
    "expected_revision",
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

## `workflow_status`

Read a host job by task_id, or recover its submission receipt using request_id.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 117 行）。

[隔离调用与结果核对](examples.md#workflow-status)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
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
    },
    "task_id": {
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

## `workflow_cancel`

Request cancellation of exactly this ComfyUI job.

注解：destructiveHint=True, idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 147 行）。

[隔离调用与结果核对](examples.md#workflow-cancel)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "task_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "task_id"
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

## `artifact_get`

Resolve an output reported by this host job; return its native view reference.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/workflow.py)（第 165 行）。

[隔离调用与结果核对](examples.md#artifact-get)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "artifact_id": {
      "pattern": "^[0-9a-f-]{36}:[0-9]{1,8}$",
      "type": "string"
    }
  },
  "required": [
    "artifact_id"
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
