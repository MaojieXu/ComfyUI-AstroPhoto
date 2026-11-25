"""Shared AstroPhoto modules in standalone and ComfyUI package contexts."""

if __package__ == "extension.siril":
    from astrophoto.api import storage as storage_api
    from astrophoto.assets import fits
    from astrophoto.core import config, errors
    from astrophoto.storage import manager, paths
else:
    from ...astrophoto.api import storage as storage_api
    from ...astrophoto.assets import fits
    from ...astrophoto.core import config, errors
    from ...astrophoto.storage import manager, paths

__all__ = ["config", "errors", "fits", "manager", "paths", "storage_api"]
