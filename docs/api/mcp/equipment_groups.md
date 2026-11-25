# MCP：equipment_groups

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `optical_train_list`

Search equipment groups by group or member name, with archive filter, sorting and pagination.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 130 行）。

[隔离调用与结果核对](examples.md#optical-train-list)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "archive_filter": {
      "default": "active",
      "description": "active: not archived; archived: archived only; all: both.",
      "enum": [
        "active",
        "archived",
        "all"
      ],
      "type": "string"
    },
    "cursor": {
      "anyOf": [
        {
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
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    },
    "query": {
      "default": "",
      "description": "Case-insensitive substring search.",
      "maxLength": 120,
      "type": "string"
    },
    "sort_by": {
      "default": "name_asc",
      "description": "name_asc/name_desc: name order; created_desc/updated_desc: newest first.",
      "enum": [
        "name_asc",
        "name_desc",
        "created_desc",
        "updated_desc"
      ],
      "type": "string"
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

## `optical_train_get`

Get an equipment group and its members by unique name.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 136 行）。

[隔离调用与结果核对](examples.md#optical-train-get)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "include_archived": {
      "default": false,
      "type": "boolean"
    },
    "name": {
      "description": "Unique equipment or equipment group name.",
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

## `optical_train_create`

Create an equipment group using existing equipment names. Camera, optics and accessory are single; filters and other are lists.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 168 行）。

[隔离调用与结果核对](examples.md#optical-train-create)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "accessory": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "camera": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "filters": {
      "default": [],
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "name": {
      "description": "Unique equipment or equipment group name.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "notes": {
      "anyOf": [
        {
          "maxLength": 4000,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Optional notes; null clears notes on update."
    },
    "other": {
      "default": [],
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "primary_optics": {
      "anyOf": [
        {
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

## `optical_train_update`

Update a group by name. Omitted fields are unchanged; null clears a single member, and [] clears a list.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 178 行）。

[隔离调用与结果核对](examples.md#optical-train-update)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "accessory": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "camera": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "filters": {
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "name": {
      "description": "Unique equipment or equipment group name.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "new_name": {
      "description": "Unique equipment or equipment group name.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "notes": {
      "anyOf": [
        {
          "maxLength": 4000,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "description": "Optional notes; null clears notes on update."
    },
    "other": {
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "primary_optics": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
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

## `optical_train_set_archived`

Archive or restore an equipment group by name.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 197 行）。

[隔离调用与结果核对](examples.md#optical-train-set-archived)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "archived": {
      "type": "boolean"
    },
    "name": {
      "description": "Unique equipment or equipment group name.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "name",
    "archived"
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

## `optical_train_delete`

Delete an equipment group while preserving historical snapshots.

注解：destructiveHint=True, idempotentHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 215 行）。

[隔离调用与结果核对](examples.md#optical-train-delete)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "name": {
      "description": "Unique equipment or equipment group name.",
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
