"""Short-lived state restricted to a verified MCP connection scope."""

import time

from fastmcp.exceptions import ToolError


def _scope(ctx):
    # FastMCP 4.2 legacy sessions have stable ctx state. In the modern
    # protocol it is request-scoped; this application's stdio entry point
    # serves exactly one client per process, so process scope is sufficient.
    request = ctx.request_context
    if request is None or not request.protocol_version:
        raise ToolError('SESSION_SCOPE_UNAVAILABLE: no negotiated MCP session')
    if request.protocol_version < '2026-07-28':
        return 'session'
    if ctx.transport == 'stdio':
        return 'stdio'
    raise ToolError('SESSION_SCOPE_UNAVAILABLE: reconnect using the stdio MCP service')


async def get_state(ctx, key):
    if _scope(ctx) == 'session':
        return await ctx.get_state(key)
    value = getattr(ctx.fastmcp, '_astrophoto_short_state', {}).get(key)
    if value and value.get('expires', 0) > time.time():
        return value
    return None


async def set_state(ctx, key, value):
    if _scope(ctx) == 'session':
        return await ctx.set_state(key, value)
    cache = getattr(ctx.fastmcp, '_astrophoto_short_state', None)
    if cache is None:
        cache = {}
        ctx.fastmcp._astrophoto_short_state = cache
    now = time.time()
    for old in [k for k, v in cache.items() if v.get('expires', 0) <= now]:
        cache.pop(old, None)
    if len(cache) >= 1024:
        raise ToolError('SESSION_STATE_FULL: retry after existing handles expire')
    cache[key] = value
