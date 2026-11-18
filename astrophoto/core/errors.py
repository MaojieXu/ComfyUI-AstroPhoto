"""Errors owned by the Extension, independent of transport and ComfyUI."""


class AstroPhotoError(Exception):
    """Base error for implemented Extension operations."""


class ConfigurationError(AstroPhotoError, ValueError):
    """Invalid application configuration."""

class StorageError(Exception):
    def __init__(self, code: str, message: str | None = None, *, details: dict | None = None):
        self.code = code
        self.details = details
        super().__init__(message or code)
