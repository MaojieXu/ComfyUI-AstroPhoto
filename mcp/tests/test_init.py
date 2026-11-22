import asyncio

from fastmcp import Client
import httpx
import pytest

from astrophoto_mcp.server import create_server

URL = "http://127.0.0.1:8188"
INIT = "/astrophoto/v1/storage/init"
REQUEST = "44444444-4444-4444-8444-444444444444"
WORKSPACE = "550e8400-e29b-41d4-a716-446655440000"
RECEIPT = {
    "status": "ready",
    "data_root": "/opt/test/.astrophoto",
    "checks": dict.fromkeys(("config", "database", "storage", "runtime"), "ready"),
    "created": [f"storage/{WORKSPACE}/{subdir}/" for subdir in ("objects", "outputs", ".staging")],
    "request_id": REQUEST,
}


def call_init(handler, *, url=URL, mode="auto"):
    async def call():
        server = create_server(url, transport=httpx.MockTransport(handler))
        async with Client(server, mode=mode) as client:
            return await client.call_tool("init", {}, raise_on_error=False)

    return asyncio.run(call())


@pytest.mark.parametrize("mode", ["auto", "legacy"])
def test_init_discovery_and_two_calls(mode):
    posts = []

    def handler(request):
        assert request.method == "POST" and request.url.path == INIT
        assert request.url.host == "127.0.0.1"
        assert request.content == b"{}" and request.headers["X-AstroPhoto-Local"] == "1"
        assert "Authorization" not in request.headers
        posts.append(request)
        return httpx.Response(200, json=RECEIPT if len(posts) == 1 else RECEIPT | {"created": []})

    async def exercise():
        server = create_server("http://localhost:8188", transport=httpx.MockTransport(handler))
        async with Client(server, mode=mode) as client:
            init = next(tool for tool in await client.list_tools() if tool.name == "init")
            assert init.input_schema == {"type": "object", "properties": {}, "additionalProperties": False}
            assert init.annotations.idempotent_hint and not init.annotations.read_only_hint
            bad_args = await client.call_tool("init", {"path": "/wrong-root"}, raise_on_error=False)
            assert bad_args.is_error and not posts
            for expected in (RECEIPT, RECEIPT | {"created": []}):
                result = await client.call_tool("init", {})
                assert not result.is_error and result.structured_content == expected
        assert len(posts) == 2

    asyncio.run(exercise())


@pytest.mark.parametrize("url", ["http://example.invalid", "http://127.0.0.1/prefix", "http://localhost/proxy"])
def test_init_requires_direct_local_url(url):
    def no_request(request):
        pytest.fail(f"Unexpected HTTP request to {request.url}")

    result = call_init(no_request, url=url)
    assert result.is_error and "LOCAL_HOST_REQUIRED" in result.content[0].text


@pytest.mark.parametrize(("stats", "extension", "code"), [
    ({"system": {"os": "nt"}}, None, "EXTENSION_NOT_LOADED"),
    ({"system": {"os": "nt"}}, {"extension": {"id": "ComfyUI_AstroPhoto"}}, "INIT_UNAVAILABLE"),
    ({}, None, "HOST_NOT_CONFIRMED"),
    ({"system": {"os": "linux"}}, {"extension": "other"}, "INVALID_RESPONSE"),
])
def test_missing_init_route_uses_read_only_diagnostics(stats, extension, code):
    requests = []

    def handler(request):
        requests.append((request.method, request.url.path))
        if request.method == "POST":
            return httpx.Response(404, text="route not found")
        assert "X-AstroPhoto-Local" not in request.headers
        if request.url.path == "/system_stats":
            return httpx.Response(200, json=stats)
        return httpx.Response(404) if extension is None else httpx.Response(200, json=extension)

    result = call_init(handler)
    assert result.is_error and code in result.content[0].text
    expected = [("POST", INIT), ("GET", "/system_stats")]
    if stats:
        expected.append(("GET", "/astrophoto/v1/status"))
    assert requests == expected


@pytest.mark.parametrize(("status", "code"), [(404, "WORKSPACE_NOT_FOUND"), (409, "RECOVERY_REQUIRED"),
                                              (403, "UNAUTHORIZED_STORAGE_OPERATION"), (423, "STORAGE_BUSY")])
def test_init_preserves_storage_error_and_request_id(status, code):
    def handler(request):
        assert request.method == "POST"
        return httpx.Response(status, json={"error": {"code": code, "message": "existing storage issue"}, "request_id": REQUEST})

    result = call_init(handler)
    assert result.is_error and result.structured_content is None
    assert all(value in result.content[0].text for value in (code, REQUEST, "existing storage issue"))


@pytest.mark.parametrize(("code", "next_step"), [
    ("WORKSPACE_OFFLINE", "Remount the default workspace volume"),
    ("WORKSPACE_FILES_MISSING", "Restore the missing registered files from a verified backup"),
    ("WORKSPACE_DISABLED", "Enable the default workspace in Storage Settings"),
    ("WORKSPACE_READ_ONLY", "Restore write access to the default workspace"),
    ("TARGET_NOT_EMPTY", "Use the verified storage location for this instance or an empty location for a new installation"),
])
def test_init_reports_actionable_storage_recovery(code, next_step):
    def handler(request):
        assert request.method == "POST" and request.url.path == INIT
        return httpx.Response(409, json={"error": {"code": code, "message": code}, "request_id": REQUEST})

    result = call_init(handler)
    assert result.is_error and result.structured_content is None
    assert all(value in result.content[0].text for value in (code, REQUEST, next_step))


@pytest.mark.parametrize(("exception", "code"), [
    (httpx.ConnectError, "HOST_UNREACHABLE"), (httpx.ConnectTimeout, "CONNECT_TIMEOUT"),
    (httpx.ReadTimeout, "TIMEOUT"), (httpx.ReadError, "NETWORK_ERROR"),
])
def test_init_transport_failure(exception, code):
    def handler(request):
        raise exception("transport problem", request=request)

    result = call_init(handler)
    assert result.is_error and code in result.content[0].text


@pytest.mark.parametrize("changes", [
    {"status": "partial"}, {"data_root": "relative"}, {"request_id": "unrecognized"},
    {"checks": {"config": "ready"}}, {"checks": RECEIPT["checks"] | {"runtime": "missing"}},
    {"checks": dict.fromkeys(("config", "databases", "workspace", "cache", "runtime"), "ready")},
    {"checks": RECEIPT["checks"] | {"cache": "ready"}},
    {"created": [None]}, {"created": [f"storage/{WORKSPACE}/outputs/"] * 2},
    {"created": ["runtime/migrations/"]}, {"created": [f"runtime/workspace-{WORKSPACE}.json"]},
    {"created": ["workspace/outputs/"]}, {"created": [f"/storage/{WORKSPACE}/outputs/"]},
    {"created": [f"storage/{WORKSPACE.upper()}/outputs/"]}, {"created": ["storage/invalid/outputs/"]},
    {"created": [f"storage/{WORKSPACE}/outputs"]}, {"created": [f"storage/{WORKSPACE}/outputs/file.fit"]},
    {"created": [f"storage/{WORKSPACE}/../outputs/"]}, {"created": [f"storage/{WORKSPACE}/scratch/"]},
    {"created": [f"storage\\{WORKSPACE}\\outputs\\"]},
])
def test_init_rejects_invalid_success_receipts(changes):
    result = call_init(lambda request: httpx.Response(200, json=RECEIPT | changes))
    assert result.is_error and result.structured_content is None
    assert "INVALID_RESPONSE" in result.content[0].text


def test_init_redirect_is_an_error_without_followup():
    def handler(request):
        assert request.url.host == "::1" and request.method == "POST" and request.url.path == INIT
        return httpx.Response(307, headers={"location": "https://elsewhere.invalid"})

    result = call_init(handler, url="http://[::1]:8188")
    assert result.is_error and "HTTP_ERROR" in result.content[0].text
