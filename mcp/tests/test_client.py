import asyncio

import httpx
import pytest

from astrophoto_mcp.client import diagnose


def test_diagnostics_public_api():
    paths = []

    def handler(request):
        paths.append(request.url.path)
        data = {"system": {"comfyui_version": "test"}} if request.url.path.endswith("system_stats") else {"vue-basic": {}}
        return httpx.Response(200, json=data)

    result = asyncio.run(diagnose("http://comfy.test/prefix", transport=httpx.MockTransport(handler)))
    assert paths == ["/prefix/system_stats", "/prefix/object_info/vue-basic"]
    assert result == {"reachable": True, "extension_registered": True, "system": {"comfyui_version": "test"}}


def test_absent_extension_and_http_error():
    result = asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(lambda _: httpx.Response(200, json={}))))
    assert result["extension_registered"] is False
    with pytest.raises(httpx.HTTPStatusError):
        asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(lambda _: httpx.Response(503))))


@pytest.mark.parametrize("endpoint", ["system_stats", "object_info/vue-basic"])
@pytest.mark.parametrize("status", [404, 500])
def test_http_errors_at_either_endpoint(endpoint, status):
    def handler(request):
        return httpx.Response(status if request.url.path == "/" + endpoint else 200, json={})

    with pytest.raises(httpx.HTTPStatusError) as exc:
        asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(handler)))
    assert exc.value.response.status_code == status


@pytest.mark.parametrize("error_type", [httpx.ConnectError, httpx.ConnectTimeout, httpx.ReadTimeout])
def test_transport_errors_and_timeout_configuration(error_type):
    def handler(request):
        assert set(request.extensions["timeout"].values()) == {10.0}
        raise error_type("test failure", request=request)

    with pytest.raises(error_type):
        asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(handler)))


@pytest.mark.parametrize("endpoint", ["system_stats", "object_info/vue-basic"])
@pytest.mark.parametrize("bad_body", [b"not JSON", b"[]", b"null", b'"text"'])
def test_invalid_json_response(endpoint, bad_body):
    def handler(request):
        return httpx.Response(200, content=bad_body if request.url.path == "/" + endpoint else b"{}")

    with pytest.raises(ValueError):
        asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(handler)))


def test_invalid_system_shape():
    with pytest.raises(ValueError, match="system_stats.system"):
        asyncio.run(diagnose("http://comfy.test", transport=httpx.MockTransport(lambda _: httpx.Response(200, json={"system": []})) ))
