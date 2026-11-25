import sys
from types import SimpleNamespace

import pytest

from astrophoto_mcp.config import DEFAULT_COMFY_URL, resolve_comfy_url
from astrophoto_mcp.__main__ import main


def test_url_precedence(monkeypatch):
    monkeypatch.delenv("COMFYUI_URL", raising=False)
    assert resolve_comfy_url() == DEFAULT_COMFY_URL + "/"
    monkeypatch.setenv("COMFYUI_URL", "https://env.test/proxy")
    assert resolve_comfy_url() == "https://env.test/proxy/"
    assert resolve_comfy_url("http://cli.test/root/") == "http://cli.test/root/"
    monkeypatch.setenv("COMFYUI_URL", "invalid")
    assert resolve_comfy_url("http://cli.test") == "http://cli.test/"


@pytest.mark.parametrize("url", ["", " ", "localhost:8188", "ftp://host", "http:///", "http://host:0",
                                  "http://host:65536", "http://host:abc", "http://user:password@host",
                                  "http://host/path?q=1", "http://host/#anchor", "http://ho st", "http://host\\path"])
def test_invalid_urls(url):
    with pytest.raises(ValueError):
        resolve_comfy_url(url)


def test_empty_environment_is_not_silently_ignored(monkeypatch):
    monkeypatch.setenv("COMFYUI_URL", "")
    with pytest.raises(ValueError):
        resolve_comfy_url()


def test_ipv6_and_proxy_path():
    assert resolve_comfy_url(" http://[::1]:8188/proxy/comfy ") == "http://[::1]:8188/proxy/comfy/"


@pytest.mark.parametrize("explicit", [False, True])
def test_cli_passes_explicit_url_to_stdio_factory(monkeypatch, explicit):
    calls = []
    monkeypatch.setenv("COMFYUI_URL", "http://env.test/proxy")
    monkeypatch.setattr(sys, "argv", ["astrophoto-mcp"] + (["--comfy-url", "http://cli.test/path"] if explicit else []))

    def factory(url):
        calls.append(url)
        return SimpleNamespace(run=lambda **kwargs: calls.append(kwargs))

    monkeypatch.setattr("astrophoto_mcp.server.create_server", factory)
    main()
    assert calls == ["http://cli.test/path" if explicit else None,
                     {"transport": "stdio", "show_banner": False}]


def test_cli_invalid_url_is_argparse_error(monkeypatch, capsys):
    monkeypatch.setattr(sys, "argv", ["astrophoto-mcp", "--comfy-url", "ftp://bad"])
    with pytest.raises(SystemExit) as exc:
        main()
    assert exc.value.code == 2
    output = capsys.readouterr()
    assert output.out == ""
    assert "ComfyUI URL" in output.err
