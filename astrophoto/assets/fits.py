"""Resolve and inspect FITS files without rewriting their pixels."""

from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from uuid import UUID

from sqlalchemy import func, select

from ..core.config import DEFAULT_PREVIEW_LONGEST_EDGE
from ..core.errors import StorageError
from ..database.models import Asset
from ..storage.manager import fingerprint, source_stat

SUFFIXES = frozenset({".fit", ".fits", ".fts"})


def resolve_input(runtime, value):
    """Resolve an asset ID or an absolute local FITS path."""
    if not isinstance(value, str) or not value:
        raise StorageError("FITS_INVALID")
    try:
        asset_id = str(UUID(value))
    except ValueError:
        asset_id = None
    if asset_id == value:
        return asset_id, runtime.assets.resolve_asset(asset_id)
    return resolve_fits_path(runtime, value)


def resolve_result(runtime, result_id):
    """Resolve a registered formal output."""
    return runtime.library.resolve_output(result_id)


def resolve_fits_path(runtime, value):
    """Resolve a local file path and identify it for run and preview receipts."""
    if not isinstance(value, str) or not value:
        raise StorageError("FITS_INVALID")
    try:
        return runtime.assets.resolve_registered_path(value)
    except StorageError as exc:
        if exc.code != "ASSET_NOT_FOUND":
            raise
    path = Path(value)
    source_stat(path)
    return str(path), path


@dataclass(frozen=True)
class FitsInfo:
    """Facts read from a file for validation and receipts."""

    revision: tuple[int, ...]
    width: int
    height: int
    channels: int
    bitpix: int
    metadata: tuple
    coordinate_keys: tuple

    @property
    def scratch_bytes(self) -> int:
        return self.revision[0] + self.width * self.height * self.channels * 8 + 2**20


def frame_assets(runtime, after=""):
    name = func.lower(Asset.name)
    with runtime.db.session() as session:
        rows = session.execute(select(Asset.id, Asset.name).where(
            Asset.id > after, (name.endswith(".fit") | name.endswith(".fits") | name.endswith(".fts"))
        ).order_by(Asset.id).limit(101)).all()
    return {"assets": [{"id": row.id, "name": row.name} for row in rows[:100]],
            "next": rows[99].id if len(rows) > 100 else None}


def image_hdu(hdus):
    from astropy.io import fits

    for index, hdu in enumerate(hdus):
        if not isinstance(hdu, (fits.PrimaryHDU, fits.ImageHDU, fits.CompImageHDU)):
            continue
        shape = hdu.shape
        if (len(shape) == 2 or len(shape) == 3 and shape[0] == 3) and min(shape) > 0:
            return index, hdu
    raise StorageError("FITS_INVALID", "Expected a mono or RGB image HDU")


def scaling_value(header, key, default):
    import math

    value = float(header.get(key, default))
    return value if math.isfinite(value) else 0.0


def inspect_fits(path: Path, *, thumbnail=False, longest_edge=DEFAULT_PREVIEW_LONGEST_EDGE):
    try:
        from astropy.io import fits
    except ImportError as exc:
        raise StorageError("FITS_DEPENDENCY_UNAVAILABLE") from exc
    if path.suffix.lower() not in SUFFIXES:
        raise StorageError("FITS_INVALID")
    initial = fingerprint(source_stat(path))
    try:
        with fits.open(path, mode="readonly", memmap=True, do_not_scale_image_data=True) as hdus:
            _, hdu = image_hdu(hdus)
            header = hdu.header
            hdu.verify("exception")
            shape = hdu.shape
            height, width = shape[-2:]
            channels = shape[0] if len(shape) == 3 else 1
            bitpix = header["BITPIX"]
            for key, default in (("BSCALE", 1), ("BZERO", 0)):
                scaling_value(header, key, default)
            data = hdu.data
            keys = ("OBJECT", "FILTER", "DATE-OBS", "EXPTIME", "BUNIT", "BSCALE", "BZERO", "ROWORDER")
            metadata = tuple((key, str(header[key])) for key in keys if key in header)
            coordinate_keys = tuple(sorted(
                (str(key), str(value)) for key, value in header.items()
                if key.startswith(("CD", "PC", "CRPIX", "CRVAL", "CTYPE", "CROTA", "ROWORDER"))
            ))
            info = FitsInfo(tuple(initial), width, height, channels, bitpix, metadata, coordinate_keys)
            png = render_png(data, header, longest_edge) if thumbnail else None
            del data
    except StorageError:
        raise
    except (OSError, ValueError, TypeError, IndexError, KeyError, Warning) as exc:
        raise StorageError("FITS_INVALID") from exc
    if fingerprint(source_stat(path)) != initial:
        raise StorageError("SOURCE_CHANGED")
    return info, png


def preview_dimensions(width: int, height: int, longest_edge: int) -> tuple[int, int]:
    original_edge = max(width, height)
    if longest_edge == 0 or original_edge <= longest_edge:
        return width, height
    return max(1, round(width * longest_edge / original_edge)), max(1, round(height * longest_edge / original_edge))


def render_png(data, header, longest_edge, *, region=None):
    """Linear display proxy only. The source and Siril output retain their FITS representation."""
    import numpy as np
    from PIL import Image

    ordering = str(header.get("ROWORDER", "")).strip().upper()
    if region is not None:
        x, y, width, height = region
        start = y if ordering == "TOP-DOWN" else data.shape[-2] - y - height
        data = data[..., start:start + height, x:x + width]
    display = np.empty(data.shape, dtype=np.uint8)
    scale = scaling_value(header, "BSCALE", 1)
    zero = scaling_value(header, "BZERO", 0)
    divisor = (1 << header["BITPIX"]) - 1 if header["BITPIX"] > 0 else 1
    for row in range(0, data.shape[-2], 64):
        rows = (..., slice(row, row + 64), slice(None))
        pixels = data[rows].astype(np.float64)
        with np.errstate(invalid="ignore", over="ignore"):
            pixels *= scale
            pixels += zero
        np.nan_to_num(pixels, copy=False, nan=0, posinf=0, neginf=0)
        pixels /= divisor
        display[rows] = np.rint(np.clip(pixels, 0, 1) * 255)
    if ordering != "TOP-DOWN":
        display = display[..., ::-1, :]
    if display.ndim == 3:
        display = np.moveaxis(display, 0, -1)
    stream = BytesIO()
    image = Image.fromarray(display)
    size = preview_dimensions(*image.size, longest_edge)
    if image.size != size:
        image = image.resize(size, Image.Resampling.BILINEAR)
    image.save(stream, "PNG")
    return stream.getvalue()


def agent_views(path, expected, views=("full", "center", "tl", "tr", "bl", "br")):
    """Reference all regions to the top-left of the full, oriented FITS frame."""
    from astropy.io import fits

    info, _ = inspect_fits(path)
    if info.revision != expected:
        raise StorageError("SOURCE_CHANGED")
    width, height = info.width, info.height
    w, h = min(512, width), min(512, height)
    rects = {"full": (0, 0, width, height), "center": ((width - w) // 2, (height - h) // 2, w, h),
             "tl": (0, 0, w, h), "tr": (width - w, 0, w, h),
             "bl": (0, height - h, w, h), "br": (width - w, height - h, w, h)}
    result = {}
    with fits.open(path, mode="readonly", memmap=True, do_not_scale_image_data=True) as hdus:
        _, hdu = image_hdu(hdus)
        for view in views:
            rect = rects[view]
            full = view == "full"
            data = render_png(hdu.data, hdu.header, 1024 if full else 0, region=None if full else rect)
            result[view] = ({"width": width, "height": height, "region": rect, "channels": info.channels,
                             "rendered_size": preview_dimensions(width, height, 1024) if full else (w, h),
                             "orientation": str(hdu.header.get("ROWORDER", "BOTTOM-UP")).strip().upper(),
                             "display": "linear-0-1"}, data)
    if tuple(fingerprint(source_stat(path))) != expected:
        raise StorageError("SOURCE_CHANGED")
    return result

