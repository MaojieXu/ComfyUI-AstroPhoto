"""Short-lived, session-scoped handles for paginated business tools."""

import secrets
import time

from fastmcp import Context
from fastmcp.exceptions import ToolError

from ..target import LocalTarget
from .session_state import get_state, set_state

_LIFETIME_SECONDS = 600


async def target_binding(api):
    """Bind handles to the actual selected instance, not merely its URL."""
    base = api.base_url
    if isinstance(base, LocalTarget):
        return list(base.binding())
    probe = LocalTarget(api.transport)
    if not await probe.probe(str(base)):
        raise ToolError('INSTANCE_UNAVAILABLE: cannot verify the AstroPhoto instance')
    return [str(base), probe.identities[str(base)]]


async def load_page(ctx: Context, handle: str, tool: str, target: list, identity: dict, overrides: dict | None = None):
    """Recover a page request, refusing mismatched or expired handles."""
    record = await get_state(ctx, 'pagination:' + handle)
    if (not isinstance(record, dict) or record.get('expires', 0) <= time.time()
            or record.get('tool') != tool or record.get('target') != target
            or record.get('identity') != identity):
        raise ToolError('CONTINUATION_EXPIRED: rerun the original search')
    for name, (value, default) in (overrides or {}).items():
        if value != default and value != record['arguments'].get(name):
            raise ToolError('CONTINUATION_MISMATCH: use the original search parameters')
    return record['arguments'], record['cursor']


async def save_page(ctx: Context, tool: str, target: list, identity: dict, arguments: dict, result: dict):
    """Replace an opaque backend cursor with an independent short handle."""
    cursor = result.pop('next_cursor', None)
    result['returned'] = len(result.get('items', []))
    result['has_more'] = bool(cursor)
    result['continue_with'] = None
    if cursor:
        handle = secrets.token_hex(5).upper()
        await set_state(ctx, 'pagination:' + handle, {
            'expires': time.time() + _LIFETIME_SECONDS, 'tool': tool, 'target': target,
            'identity': identity, 'arguments': arguments, 'cursor': cursor,
        })
        result['continue_with'] = handle
    return result
