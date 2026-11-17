"""Configuration shared by the CLI and Python callers."""

import os

import httpx

DEFAULT_COMFY_URL = "http://127.0.0.1:8188"
HTTP_TIMEOUT = 10.0


def resolve_comfy_url(cli_url: str | None = None) -> str:
    """Select CLI > environment > default; validate and retain a proxy path."""
    raw = cli_url if cli_url is not None else os.environ.get("COMFYUI_URL", DEFAULT_COMFY_URL)
    raw = raw.strip()
    # Query/fragment/auth are not base-path configuration. Reject them instead
    # of silently sending requests to a different target than the user intended.
    if not raw or any(char.isspace() for char in raw) or any(char in raw for char in "\\?#"):
        raise ValueError("ComfyUI URL must be an HTTP(S) base URL without whitespace, query or fragment")
    try:
        url = httpx.URL(raw)
    except (httpx.InvalidURL, ValueError) as exc:
        raise ValueError("Invalid ComfyUI URL") from exc
    if url.scheme not in {"http", "https"} or not url.host:
        raise ValueError("ComfyUI URL requires http:// or https:// and a hostname")
    if url.userinfo or (url.port is not None and not 1 <= url.port <= 65535):
        raise ValueError("ComfyUI URL must not contain credentials and must use a valid port")
    return str(url).rstrip("/") + "/"
