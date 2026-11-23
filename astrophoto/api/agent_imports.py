"""Native endpoints for immutable, per-group import approvals."""

from .library import authorize_library, is_agent
from .security import trusted_approval_bearer
from .storage import fields


def authorize_agent_import(request, runtime):
    return is_agent(request) and authorize_library(request, runtime)


def plan(service, _runtime, _request, body):
    return service.agent_imports.plan(body)


def propose(service, _runtime, _request, body):
    fields(body, ("plan_id", "group_id"))
    return service.agent_imports.propose(body["plan_id"], body["group_id"])


def status(service, _runtime, request, _body):
    return service.agent_imports.status(request.match_info["id"])


def decide(service, _runtime, request, body):
    fields(body, ("digest", "decision"))
    return service.agent_imports.decide(request.match_info["id"], body["digest"], body["decision"])


def retry_bindings(service, _runtime, request, body):
    fields(body)
    return service.agent_imports.retry_bindings(request.match_info["id"])


def agent_import_routes():
    return [
        ("POST", "/library/agent-imports/plan", plan, 200, authorize_agent_import),
        ("POST", "/library/agent-imports", propose, 202, authorize_agent_import),
        ("GET", "/library/agent-imports/{id}", status, 200, authorize_agent_import),
        ("POST", "/library/agent-imports/{id}/decision", decide, 200, trusted_approval_bearer),
        ("POST", "/library/agent-imports/{id}/retry-bindings", retry_bindings, 200, authorize_agent_import),
    ]
