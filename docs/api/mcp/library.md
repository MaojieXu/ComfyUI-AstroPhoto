# MCP：library

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `library_list`

Search library assets by name and recorded properties. Returns paginated results.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 74 行）。

[隔离调用与结果核对](examples.md#library-list)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "asset_type": {
      "anyOf": [
        {
          "enum": [
            "subframe_collection",
            "video",
            "master_frame",
            "image_result"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Restrict results to an asset type."
    },
    "calibration_state": {
      "anyOf": [
        {
          "enum": [
            "calibrated",
            "uncalibrated",
            "unknown"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Restrict collections by calibration state."
    },
    "cursor": {
      "anyOf": [
        {
          "description": "Cursor returned for the same listing and filters.",
          "maxLength": 8192,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Continuation cursor from the same search."
    },
    "equipment_group": {
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
      "default": null,
      "description": "Exact recorded equipment group name."
    },
    "filter_name": {
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
      "default": null,
      "description": "Exact recorded filter name."
    },
    "frame_type": {
      "anyOf": [
        {
          "enum": [
            "light",
            "dark",
            "flat",
            "bias",
            "dark_flat",
            "unknown"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Restrict subframe collections to a frame type."
    },
    "limit": {
      "default": 50,
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    },
    "master_type": {
      "anyOf": [
        {
          "enum": [
            "light",
            "dark",
            "flat",
            "bias",
            "dark_flat",
            "unknown"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Restrict master frames to a master type."
    },
    "query": {
      "default": "",
      "description": "Search text for the asset name.",
      "type": "string"
    },
    "sort_by": {
      "default": "name_asc",
      "description": "Sort order for the results.",
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

## `library_get`

Get a library asset by its unique name, including recorded metadata and relationships.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 101 行）。

[隔离调用与结果核对](examples.md#library-get)

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

## `library_list_subframes`

List registered files in a subframe collection. Capture parameters belong to the collection.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 114 行）。

[隔离调用与结果核对](examples.md#library-list-subframes)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "collection_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "cursor": {
      "anyOf": [
        {
          "description": "Cursor returned for the same listing and filters.",
          "maxLength": 8192,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Continuation cursor from this collection listing."
    },
    "limit": {
      "default": 50,
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    }
  },
  "required": [
    "collection_name"
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

## `library_inspect_folder`

List files in a server folder without reading image or video metadata.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 128 行）。

[隔离调用与结果核对](examples.md#library-inspect-folder)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "cursor": {
      "anyOf": [
        {
          "description": "Cursor returned for the same listing and filters.",
          "maxLength": 8192,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Continuation cursor from this folder listing."
    },
    "folder_path": {
      "description": "Path on the ComfyUI host.",
      "minLength": 1,
      "type": "string"
    },
    "limit": {
      "default": 100,
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    }
  },
  "required": [
    "folder_path"
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

## `library_import`

Import one asset; use selected files or folders for one collection, or one file for a single-file asset.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 142 行）。

[隔离调用与结果核对](examples.md#library-import)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "asset_type": {
      "description": "Type of the asset to import.",
      "enum": [
        "subframe_collection",
        "video",
        "master_frame",
        "image_result"
      ],
      "type": "string"
    },
    "calibration_state": {
      "anyOf": [
        {
          "enum": [
            "calibrated",
            "uncalibrated",
            "unknown"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Calibration state for a subframe collection."
    },
    "capture": {
      "anyOf": [
        {
          "additionalProperties": false,
          "properties": {
            "binning": {
              "anyOf": [
                {
                  "maxLength": 256,
                  "minLength": 1,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "exposure_seconds": {
              "anyOf": [
                {
                  "minimum": 0,
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "gain": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "iso": {
              "anyOf": [
                {
                  "minimum": 0,
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "offset": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "readout_mode": {
              "anyOf": [
                {
                  "maxLength": 256,
                  "minLength": 1,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "temperature_c": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null,
              "description": "Recorded temperature in degrees Celsius."
            }
          },
          "type": "object"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Recorded capture parameters for a collection or master frame."
    },
    "equipment": {
      "anyOf": [
        {
          "additionalProperties": false,
          "properties": {
            "equipment_group": {
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
            "filter_name": {
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
            "filter_state": {
              "enum": [
                "selected",
                "none",
                "unknown"
              ],
              "type": "string"
            }
          },
          "type": "object"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Equipment group name and the filter used for capture."
    },
    "frame_type": {
      "anyOf": [
        {
          "enum": [
            "light",
            "dark",
            "flat",
            "bias",
            "dark_flat",
            "unknown"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Frame type for a subframe collection."
    },
    "master_type": {
      "anyOf": [
        {
          "enum": [
            "light",
            "dark",
            "flat",
            "bias",
            "dark_flat",
            "unknown"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Purpose of a master frame, including calibration types."
    },
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
      "default": null,
      "description": "Optional user notes."
    },
    "source_collection_name": {
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
      "default": null,
      "description": "Optional name of the source subframe collection for a master."
    },
    "source_paths": {
      "description": "Host file or folder paths; single-file assets require exactly one file.",
      "items": {
        "description": "Path on the ComfyUI host.",
        "minLength": 1,
        "type": "string"
      },
      "maxItems": 1000,
      "minItems": 1,
      "type": "array"
    }
  },
  "required": [
    "asset_type",
    "name",
    "source_paths"
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

## `library_import_status`

Get the progress and result of an import or subframe append.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 187 行）。

[隔离调用与结果核对](examples.md#library-import-status)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "task": {
      "description": "Short task number returned by library_import or library_add_subframes.",
      "type": "string"
    }
  },
  "required": [
    "task"
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

## `library_add_subframes`

Add selected files or folders to an existing collection without changing its capture parameters.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 209 行）。

[隔离调用与结果核对](examples.md#library-add-subframes)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "collection_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "source_paths": {
      "description": "Host file or folder paths to add.",
      "items": {
        "description": "Path on the ComfyUI host.",
        "minLength": 1,
        "type": "string"
      },
      "maxItems": 1000,
      "minItems": 1,
      "type": "array"
    }
  },
  "required": [
    "collection_name",
    "source_paths"
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

## `library_update`

Update explicitly supplied fields by unique asset name; omit unchanged fields and use null to clear optional values.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 221 行）。

[隔离调用与结果核对](examples.md#library-update)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "calibration_state": {
      "description": "Calibration state for a subframe collection.",
      "enum": [
        "calibrated",
        "uncalibrated",
        "unknown"
      ],
      "type": "string"
    },
    "capture": {
      "anyOf": [
        {
          "additionalProperties": false,
          "properties": {
            "binning": {
              "anyOf": [
                {
                  "maxLength": 256,
                  "minLength": 1,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "exposure_seconds": {
              "anyOf": [
                {
                  "minimum": 0,
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "gain": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "iso": {
              "anyOf": [
                {
                  "minimum": 0,
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "offset": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "readout_mode": {
              "anyOf": [
                {
                  "maxLength": 256,
                  "minLength": 1,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "default": null
            },
            "temperature_c": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ],
              "default": null,
              "description": "Recorded temperature in degrees Celsius."
            }
          },
          "type": "object"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Capture fields to update; null clears each individual field."
    },
    "equipment": {
      "anyOf": [
        {
          "additionalProperties": false,
          "properties": {
            "equipment_group": {
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
            "filter_name": {
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
            "filter_state": {
              "enum": [
                "selected",
                "none",
                "unknown"
              ],
              "type": "string"
            }
          },
          "type": "object"
        },
        {
          "type": "null"
        }
      ],
      "description": "Equipment and filter binding, or null to clear it."
    },
    "frame_type": {
      "description": "Frame type for a subframe collection.",
      "enum": [
        "light",
        "dark",
        "flat",
        "bias",
        "dark_flat",
        "unknown"
      ],
      "type": "string"
    },
    "master_type": {
      "description": "Purpose of a master frame.",
      "enum": [
        "light",
        "dark",
        "flat",
        "bias",
        "dark_flat",
        "unknown"
      ],
      "type": "string"
    },
    "name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
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
      ],
      "description": "User notes, or null to clear them."
    },
    "source_collection_name": {
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
      "description": "Source subframe collection name, or null to clear it."
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

## `library_remove`

Unregister a library asset and its project references while keeping its physical files.

注解：destructiveHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 253 行）。

[隔离调用与结果核对](examples.md#library-remove)

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

## `library_remove_subframe`

Unregister one file from a subframe collection while keeping the physical file.

注解：destructiveHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 264 行）。

[隔离调用与结果核对](examples.md#library-remove-subframe)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "collection_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "file_path": {
      "description": "Path on the ComfyUI host.",
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "collection_name",
    "file_path"
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

## `library_find_calibration`

Find calibration masters and report recorded differences and unknown values without excluding them.

注解：openWorldHint=False, readOnlyHint=True。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 313 行）。

[隔离调用与结果核对](examples.md#library-find-calibration)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "collection_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "cursor": {
      "anyOf": [
        {
          "description": "Cursor returned for the same listing and filters.",
          "maxLength": 8192,
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Continuation cursor from the same search."
    },
    "limit": {
      "default": 50,
      "description": "Maximum number of results per page.",
      "maximum": 100,
      "minimum": 1,
      "type": "integer"
    },
    "master_type": {
      "anyOf": [
        {
          "enum": [
            "dark",
            "bias",
            "flat",
            "dark_flat"
          ],
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "description": "Optional calibration master type."
    },
    "query": {
      "default": "",
      "description": "Search text for the master name.",
      "type": "string"
    },
    "sort_by": {
      "default": "name_asc",
      "description": "Sort order for the results.",
      "enum": [
        "name_asc",
        "name_desc",
        "created_desc",
        "updated_desc"
      ],
      "type": "string"
    }
  },
  "required": [
    "collection_name"
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

## `library_bind_calibration`

Bind calibration masters by name. Differences do not block binding; multiple masters of one type are allowed and existing bindings are retained.

注解：destructiveHint=False, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 335 行）。

[隔离调用与结果核对](examples.md#library-bind-calibration)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "collection_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "master_names": {
      "description": "Unique names of calibration master frames to bind.",
      "items": {
        "description": "Display name, in the original language.",
        "maxLength": 120,
        "minLength": 1,
        "type": "string"
      },
      "maxItems": 100,
      "minItems": 1,
      "type": "array"
    }
  },
  "required": [
    "collection_name",
    "master_names"
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

## `library_unbind_calibration`

Remove a calibration binding while keeping both assets and their physical files.

注解：destructiveHint=True, openWorldHint=False。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/catalog.py)（第 351 行）。

[隔离调用与结果核对](examples.md#library-unbind-calibration)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "collection_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    },
    "master_name": {
      "description": "Display name, in the original language.",
      "maxLength": 120,
      "minLength": 1,
      "type": "string"
    }
  },
  "required": [
    "collection_name",
    "master_name"
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
