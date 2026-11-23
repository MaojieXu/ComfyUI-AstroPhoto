import pytest

from astrophoto_mcp.server import create_server


@pytest.fixture(autouse=True)
def isolate_opt_in_credentials(monkeypatch):
    monkeypatch.delenv("ASTROPHOTO_LIBRARY_TOKEN", raising=False)
    monkeypatch.delenv("ASTROPHOTO_EQUIPMENT_READ_TOKEN", raising=False)
    monkeypatch.delenv("ASTROPHOTO_EQUIPMENT_WRITE_TOKEN", raising=False)
    monkeypatch.delenv("ASTROPHOTO_APPROVAL_TOKEN", raising=False)
    monkeypatch.delenv("ASTROPHOTO_TRUST_CHAT_APPROVALS", raising=False)


@pytest.fixture
def server():
    # No HTTP connection is made while constructing or inspecting this server.
    return create_server("http://127.0.0.1:1")
