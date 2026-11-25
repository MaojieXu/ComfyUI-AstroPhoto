# MCP：equipment

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `equipment_list`

Search equipment by name or product name. Filter by type and archive status, then sort and paginate.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 118 行）。

[隔离调用与结果核对](examples.md#equipment-list)

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
    "equipment_type": {
      "anyOf": [
        {
          "description": "camera: main camera; primary_optics: telescope or lens; optical_accessory: main optical-path accessory; filter: imaging filter; other: other equipment or software.",
          "enum": [
            "camera",
            "primary_optics",
            "optical_accessory",
            "filter",
            "other"
          ],
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

## `equipment_get`

Get one equipment item and equipment group references by its unique name.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 125 行）。

[隔离调用与结果核对](examples.md#equipment-get)

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

## `equipment_create`

Register one equipment item with a unique instance name and product name.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 143 行）。

[隔离调用与结果核对](examples.md#equipment-create)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "equipment_type": {
      "description": "camera: main camera; primary_optics: telescope or lens; optical_accessory: main optical-path accessory; filter: imaging filter; other: other equipment or software.",
      "enum": [
        "camera",
        "primary_optics",
        "optical_accessory",
        "filter",
        "other"
      ],
      "type": "string"
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
    "product_name": {
      "description": "Product name or model; may be shared by multiple equipment items.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "equipment_type",
    "name",
    "product_name"
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

## `equipment_update`

Update equipment fields by name. Omit notes to keep them; pass null to clear them.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 149 行）。

[隔离调用与结果核对](examples.md#equipment-update)

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
    "product_name": {
      "description": "Product name or model; may be shared by multiple equipment items.",
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

## `equipment_set_archived`

Archive or restore an equipment item by name.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 161 行）。

[隔离调用与结果核对](examples.md#equipment-set-archived)

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

## `equipment_delete`

Delete an equipment item and unlink current references.

注解：destructiveHint=True, idempotentHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/equipment.py)（第 210 行）。

[隔离调用与结果核对](examples.md#equipment-delete)

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
