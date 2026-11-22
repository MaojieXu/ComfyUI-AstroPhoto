"""Storage uses a direct, single-user loopback deployment boundary."""

from hmac import compare_digest
from ipaddress import ip_address
from urllib.parse import urlsplit


def loopback(address):
    if address == "localhost":
        return True
    try:
        ip = ip_address(address)
        return ip.is_loopback or bool(getattr(ip, "ipv4_mapped", None) and ip.ipv4_mapped.is_loopback)
    except ValueError:
        return False


def trusted_deployment(args):
    return (bool(getattr(args, "listen", None))
            and all(loopback(item.strip()) for item in args.listen.split(","))
            and not getattr(args, "multi_user", False) and not getattr(args, "enable_cors_header", None))


def direct_local_request(request, runtime):
    if not runtime.trusted_local or not loopback(request.remote or ""):
        return False
    if (request.headers.get("Sec-Fetch-Site") not in (None, "same-origin")
            or any(name.lower() == "forwarded" or name.lower().startswith("x-forwarded-") for name in request.headers)):
        return False
    try:
        host = urlsplit(f"//{request.host}")
        if not loopback(host.hostname or "") or host.username or host.path:
            return False
        origin = request.headers.get("Origin")
        return origin is None or origin == f"{request.scheme}://{request.host}"
    except ValueError:
        return False



def authorize_storage_operation(request, runtime):
    return direct_local_request(request, runtime) and (
        request.headers.get("Sec-Fetch-Site") == "same-origin"
        or request.headers.get("Origin") is not None
        or request.headers.get("X-AstroPhoto-Local") == "1"
    )


def authorize_equipment_request(request, runtime):
    if not direct_local_request(request, runtime):
        return False
    authorization = request.headers.get("Authorization")
    if authorization is not None:
        if request.method != "GET" or request.headers.get("Origin") or request.headers.get("Sec-Fetch-Site"):
            return False
        token = runtime.equipment_read_token
        return bool(token and compare_digest(authorization.encode("utf-8"), f"Bearer {token}".encode("ascii")))
    # The approved single-user loopback deployment trusts its browser. Fetch metadata
    # prevents cross-site browser requests. It does not identify other local processes.
    return request.headers.get("Sec-Fetch-Site") == "same-origin" and request.headers.get("X-AstroPhoto-Local") == "1"


def equipment_read_token(environ):
    return valid_local_token(environ.get("ASTROPHOTO_EQUIPMENT_READ_TOKEN", ""))


def valid_local_token(token):
    if 43 <= len(token) <= 256 and token.isascii() and all(c.isalnum() or c in "-_" for c in token):
        return token
    return None
