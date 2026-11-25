"""Storage uses a direct, single-user loopback deployment boundary."""

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
    return direct_local_request(request, runtime) and (
        request.headers.get("X-AstroPhoto-Local") == "1"
        or (request.headers.get("Origin") is None and request.headers.get("Sec-Fetch-Site") is None)
    )
