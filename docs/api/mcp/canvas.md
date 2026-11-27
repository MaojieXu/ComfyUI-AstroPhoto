# MCP：canvas

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `canvas_list_sessions`

List connected ComfyUI pages and their current workflow/graph targets.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 107 行）。

[隔离调用与结果核对](examples.md#canvas-list-sessions)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {},
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

## `canvas_get`

Read the live graph, including unsaved nodes, widget values, slots and links.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 112 行）。

[隔离调用与结果核对](examples.md#canvas-get)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
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
    "target_id": {
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

## `canvas_find_nodes`

Find instances in the current graph by title, node type or graph-local node ID.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 119 行）。

[隔离调用与结果核对](examples.md#canvas-find-nodes)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "node_id": {
      "anyOf": [
        {
          "minimum": 0,
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "query": {
      "default": "",
      "maxLength": 200,
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
    "target_id": {
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

## `node_search`

Find installed node types. This is separate from searching node instances.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 131 行）。

[隔离调用与结果核对](examples.md#node-search)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "query": {
      "maxLength": 200,
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
    "source": {
      "anyOf": [
        {
          "maxLength": 200,
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
    "query"
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

## `node_describe`

Read the host definition for an installed node type.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 137 行）。

[隔离调用与结果核对](examples.md#node-describe)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "node_type": {
      "maxLength": 200,
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
    "node_type"
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

## `canvas_apply`

Apply commands, or apply a verified preview using node_id and preview_id. Reuse command_id for retries.

注解：destructiveHint=True, idempotentHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 142 行）。

[隔离调用与结果核对](examples.md#canvas-apply)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "command_id": {
      "format": "uuid",
      "type": "string"
    },
    "commands": {
      "anyOf": [
        {
          "items": {
            "oneOf": [
              {
                "additionalProperties": false,
                "properties": {
                  "action": {
                    "const": "add_node",
                    "type": "string"
                  },
                  "node_type": {
                    "maxLength": 200,
                    "minLength": 1,
                    "type": "string"
                  },
                  "position": {
                    "anyOf": [
                      {
                        "maxItems": 2,
                        "minItems": 2,
                        "prefixItems": [
                          {
                            "type": "number"
                          },
                          {
                            "type": "number"
                          }
                        ],
                        "type": "array"
                      },
                      {
                        "type": "null"
                      }
                    ],
                    "default": null,
                    "description": "Coordinates in the graph"
                  },
                  "ref": {
                    "anyOf": [
                      {
                        "pattern": "^[a-zA-Z0-9_-]{1,48}$",
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
                  "action",
                  "node_type"
                ],
                "type": "object"
              },
              {
                "additionalProperties": false,
                "properties": {
                  "action": {
                    "const": "set_parameters",
                    "type": "string"
                  },
                  "node_id": {
                    "anyOf": [
                      {
                        "minimum": 0,
                        "type": "integer"
                      },
                      {
                        "type": "null"
                      }
                    ],
                    "default": null
                  },
                  "ref": {
                    "anyOf": [
                      {
                        "pattern": "^[a-zA-Z0-9_-]{1,48}$",
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ],
                    "default": null
                  },
                  "values": {
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
                  }
                },
                "required": [
                  "action",
                  "values"
                ],
                "type": "object"
              },
              {
                "additionalProperties": false,
                "properties": {
                  "action": {
                    "const": "remove_node",
                    "type": "string"
                  },
                  "node_id": {
                    "anyOf": [
                      {
                        "minimum": 0,
                        "type": "integer"
                      },
                      {
                        "type": "null"
                      }
                    ],
                    "default": null
                  },
                  "ref": {
                    "anyOf": [
                      {
                        "pattern": "^[a-zA-Z0-9_-]{1,48}$",
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
                  "action"
                ],
                "type": "object"
              },
              {
                "additionalProperties": false,
                "properties": {
                  "action": {
                    "const": "connect",
                    "type": "string"
                  },
                  "from": {
                    "additionalProperties": false,
                    "properties": {
                      "node_id": {
                        "anyOf": [
                          {
                            "minimum": 0,
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ],
                        "default": null
                      },
                      "ref": {
                        "anyOf": [
                          {
                            "pattern": "^[a-zA-Z0-9_-]{1,48}$",
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ],
                        "default": null
                      },
                      "slot": {
                        "minimum": 0,
                        "type": "integer"
                      }
                    },
                    "required": [
                      "slot"
                    ],
                    "type": "object"
                  },
                  "replace": {
                    "default": false,
                    "type": "boolean"
                  },
                  "to": {
                    "additionalProperties": false,
                    "properties": {
                      "node_id": {
                        "anyOf": [
                          {
                            "minimum": 0,
                            "type": "integer"
                          },
                          {
                            "type": "null"
                          }
                        ],
                        "default": null
                      },
                      "ref": {
                        "anyOf": [
                          {
                            "pattern": "^[a-zA-Z0-9_-]{1,48}$",
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ],
                        "default": null
                      },
                      "slot": {
                        "minimum": 0,
                        "type": "integer"
                      }
                    },
                    "required": [
                      "slot"
                    ],
                    "type": "object"
                  }
                },
                "required": [
                  "action",
                  "from",
                  "to"
                ],
                "type": "object"
              },
              {
                "additionalProperties": false,
                "properties": {
                  "action": {
                    "const": "disconnect",
                    "type": "string"
                  },
                  "node_id": {
                    "anyOf": [
                      {
                        "minimum": 0,
                        "type": "integer"
                      },
                      {
                        "type": "null"
                      }
                    ],
                    "default": null
                  },
                  "ref": {
                    "anyOf": [
                      {
                        "pattern": "^[a-zA-Z0-9_-]{1,48}$",
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ],
                    "default": null
                  },
                  "slot": {
                    "minimum": 0,
                    "type": "integer"
                  }
                },
                "required": [
                  "slot",
                  "action"
                ],
                "type": "object"
              }
            ]
          },
          "maxItems": 32,
          "minItems": 1,
          "type": "array"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "expected_revision": {
      "format": "uuid",
      "type": "string"
    },
    "node_id": {
      "anyOf": [
        {
          "minimum": 0,
          "type": "integer"
        },
        {
          "type": "null"
        }
      ],
      "default": null
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
    "command_id"
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

## `canvas_command_status`

Check the receipt before retrying an edit whose outcome is unconfirmed.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 158 行）。

[隔离调用与结果核对](examples.md#canvas-command-status)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "command_id": {
      "format": "uuid",
      "type": "string"
    }
  },
  "required": [
    "command_id"
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

## `canvas_list_subgraphs`

List the main graph and each subgraph instance without switching the canvas.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 163 行）。

[隔离调用与结果核对](examples.md#canvas-list-subgraphs)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
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
    "target_id"
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

## `canvas_open_subgraph`

Open an instance from canvas_list_subgraphs; root returns to the main canvas.

注解：未声明。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/canvas.py)（第 168 行）。

[隔离调用与结果核对](examples.md#canvas-open-subgraph)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "graph_id": {
      "maxLength": 200,
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
    "graph_id",
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
