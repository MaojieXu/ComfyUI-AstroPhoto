import pytest

from astrophoto_mcp.server import create_server


@pytest.fixture
def server():
    # No HTTP connection is made while constructing or inspecting this server.
    return create_server("http://127.0.0.1:1")
