"""Errors owned by the Extension, independent of transport and ComfyUI."""


class AstroPhotoError(Exception):
    """Base error for implemented Extension operations."""


class ConfigurationError(AstroPhotoError, ValueError):
    """Invalid application configuration."""
