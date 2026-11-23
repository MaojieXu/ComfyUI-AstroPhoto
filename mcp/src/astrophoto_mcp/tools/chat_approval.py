"""Collect a decision through an explicitly trusted MCP chat host."""

from hashlib import sha256

from fastmcp.exceptions import ToolError
from mcp_types import ElicitRequest, ElicitRequestFormParams, ElicitResult, InputRequiredResult
from mcp_types.version import MODERN_PROTOCOL_VERSIONS


async def confirm_chat(ctx, message):
    request = ctx.request_context
    if request is not None and request.protocol_version in MODERN_PROTOCOL_VERSIONS:
        return guard_confirmation(ctx, message)
    try:
        response = await ctx.elicit(message, bool, response_title="Approve this exact operation")
    except Exception as exc:
        # Unsupported clients and closed sessions both leave the proposal unchanged.
        raise ToolError("CHAT_CONFIRMATION_UNAVAILABLE: This chat cannot provide a user decision") from exc
    return decision(response.action, getattr(response, "data", None))


def guard_confirmation(ctx, message):
    key = "astrophoto-user-approval"
    # FastMCP seals request_state on the wire. Bind it to the exact operation
    # shown by this tool, including its digest or expected resource version.
    state = sha256(message.encode()).hexdigest()
    if not ctx.input_responses and not ctx.request_state:
        return InputRequiredResult(request_state=state, input_requests={
            key: ElicitRequest(method="elicitation/create", params=ElicitRequestFormParams(
                mode="form", message=message, requested_schema={
                    "type": "object",
                    "properties": {"value": {"type": "boolean", "title": "Approve this exact operation"}},
                    "required": ["value"],
                },
            )),
        })
    response = (ctx.input_responses or {}).get(key)
    if ctx.request_state != state or not isinstance(response, ElicitResult):
        raise ToolError("CHAT_CONFIRMATION_UNAVAILABLE: Invalid or stale confirmation")
    return decision(response.action, (response.content or {}).get("value"))


def decision(action, value):
    if action == "accept" and value is True:
        return "accepted"
    if action == "decline" or action == "accept" and value is False:
        return "declined"
    return "cancelled"
