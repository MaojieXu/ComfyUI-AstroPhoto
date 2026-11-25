# MCP：connection

以下 Schema 从自动发现模式的隔离进程内服务导出。逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。

## `version`

Return the installed MCP package version (not the remote extension version).

注解：未声明。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/status.py)（第 16 行）。

[隔离调用与结果核对](examples.md#version)

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
  "additionalProperties": {
    "type": "string"
  },
  "title": "versionDictOutput",
  "type": "object"
}
```

## `connection_status`

Report the configured endpoint or discover local AstroPhoto instances and their selection state.

注解：未声明。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/status.py)（第 21 行）。

[隔离调用与结果核对](examples.md#connection-status)

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

## `connection_select`

Select a discovered local instance when more than one is available.

注解：未声明。

实现：[源码](../../../mcp/src/astrophoto_mcp/tools/status.py)（第 49 行）。

[隔离调用与结果核对](examples.md#connection-select)

输入 Schema：

```json
{
  "additionalProperties": false,
  "properties": {
    "url": {
      "type": "string"
    }
  },
  "required": [
    "url"
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
