# MCP：projects

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `project_list`

Search unique project names and paginate the sorted results.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 52 行）。

[隔离调用与结果核对](examples.md#project-list)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "continue_with": {
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
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    },
    "query": {
      "type": "string"
    },
    "sort_by": {
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

## `project_get`

Read a folder's children or paginated descendants, or one asset reference, by logical path.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 70 行）。

[隔离调用与结果核对](examples.md#project-get)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "continue_with": {
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
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    },
    "path": {
      "description": "Logical project path; / is the project root.",
      "pattern": "^/",
      "type": "string"
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "recursive": {
      "type": "boolean"
    }
  },
  "required": [
    "project_name"
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

## `project_create`

Create an empty project with a unique name.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 110 行）。

[隔离调用与结果核对](examples.md#project-create)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "notes": {
      "anyOf": [
        {
          "maxLength": 4000,
          "minLength": 1,
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

## `project_update`

Update a project by its current exact name. Omit unchanged fields; null clears notes.

new_name changes the project name. Returns changed and cleared visible fields.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 115 行）。

[隔离调用与结果核对](examples.md#project-update)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "new_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "notes": {
      "anyOf": [
        {
          "maxLength": 4000,
          "minLength": 1,
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name"
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

## `project_delete`

Remove a project and its references; catalog assets and source files are preserved.

注解：destructiveHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 128 行）。

[隔离调用与结果核对](examples.md#project-delete)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name"
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

## `project_create_folders`

Create project-internal logical paths atomically, including missing parents.

Each path starts with '/', e.g. paths=['/Raw/Lights']; paths are not host disk folders.
Existing folders are retained; a conflict rolls back the batch.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 133 行）。

[隔离调用与结果核对](examples.md#project-create-folders)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "paths": {
      "items": {
        "description": "Logical project path; / is the project root.",
        "pattern": "^/",
        "type": "string"
      },
      "maxItems": 1000,
      "minItems": 1,
      "type": "array"
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name",
    "paths"
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

## `project_add_assets`

Atomically add library assets by exact name to a project-internal logical folder.

assets is a list of objects, e.g. [{name: M31 Light, alias: Lights}]. The optional
alias changes only the project reference, not the library asset or file.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 145 行）。

[隔离调用与结果核对](examples.md#project-add-assets)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "assets": {
      "items": {
        "additionalProperties": false,
        "properties": {
          "alias": {
            "anyOf": [
              {
                "description": "Display name, in the original language.",
                "maxLength": 120,
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
      },
      "maxItems": 100,
      "minItems": 1,
      "type": "array"
    },
    "folder_path": {
      "description": "Logical project path; / is the project root.",
      "pattern": "^/",
      "type": "string"
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name",
    "folder_path",
    "assets"
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

## `project_update_node`

Rename or move a project folder or asset alias, without changing the underlying file.

path identifies the current project-internal item; new_name and new_parent_path
specify its new name or destination logical folder, not a host disk path.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 167 行）。

[隔离调用与结果核对](examples.md#project-update-node)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "new_name": {
      "anyOf": [
        {
          "description": "Display name, in the original language.",
          "maxLength": 120,
          "minLength": 1,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "new_parent_path": {
      "anyOf": [
        {
          "description": "Logical project path; / is the project root.",
          "pattern": "^/",
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "path": {
      "description": "Logical project path; / is the project root.",
      "pattern": "^/",
      "type": "string"
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name",
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

## `project_remove_node`

Remove a logical folder and descendants, or one asset reference. Library records and files are preserved.

注解：destructiveHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 181 行）。

[隔离调用与结果核对](examples.md#project-remove-node)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "path": {
      "description": "Logical project path; / is the project root.",
      "pattern": "^/",
      "type": "string"
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name",
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

## `project_impact`

Preview descendant folder and reference counts. Removal requires no confirmation or impact token.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/projects.py)（第 188 行）。

[隔离调用与结果核对](examples.md#project-impact)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "path": {
      "default": "/",
      "description": "Logical project path; / is the project root.",
      "pattern": "^/",
      "type": "string"
    },
    "project_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "project_name"
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
