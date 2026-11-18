"""Schema owned by the Extension."""

from sqlalchemy import Boolean, CheckConstraint, ForeignKey, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class StorageIdentity(Base):
    __tablename__ = "storage_identity"
    id: Mapped[int] = mapped_column(primary_key=True)
    instance_id: Mapped[str] = mapped_column(String, unique=True)
    __table_args__ = (CheckConstraint("id = 1"),)


class StorageLocation(Base):
    __tablename__ = "storage_locations"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    root_path: Mapped[str] = mapped_column(String)
    canonical_root: Mapped[str] = mapped_column(String, unique=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    revision: Mapped[int] = mapped_column(Integer, default=0)


class Asset(Base):
    __tablename__ = "assets"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    size_bytes: Mapped[int] = mapped_column(Integer)
    mtime_ns: Mapped[int] = mapped_column(Integer)


class AssetSession(Base):
    __tablename__ = "asset_sessions"
    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), primary_key=True)
    session_id: Mapped[str] = mapped_column(String, primary_key=True, index=True)


class AssetLocation(Base):
    __tablename__ = "asset_locations"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id"), index=True)
    storage_mode: Mapped[str] = mapped_column(String)
    external_path: Mapped[str | None] = mapped_column(String)
    external_key: Mapped[str | None] = mapped_column(String, unique=True)
    workspace_id: Mapped[str | None] = mapped_column(ForeignKey("storage_locations.id"), index=True)
    relative_key: Mapped[str | None] = mapped_column(String)
    __table_args__ = (
        UniqueConstraint("workspace_id", "relative_key"),
        CheckConstraint(
            "(storage_mode = 'external_reference' AND external_path IS NOT NULL AND external_key IS NOT NULL "
            "AND workspace_id IS NULL AND relative_key IS NULL) OR "
            "(storage_mode = 'managed' AND external_path IS NULL AND external_key IS NULL "
            "AND workspace_id IS NOT NULL AND relative_key IS NOT NULL)"
        ),
    )


class StorageOperation(Base):
    __tablename__ = "storage_operations"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    kind: Mapped[str] = mapped_column(String)
    key: Mapped[str] = mapped_column(String)
    phase: Mapped[str] = mapped_column(String, index=True)
    created_ns: Mapped[int] = mapped_column(Integer, default=0)
    request: Mapped[dict] = mapped_column(JSON)
    plan: Mapped[dict] = mapped_column(JSON, default=dict)
    receipt: Mapped[dict] = mapped_column(JSON, default=dict)
    error: Mapped[str | None] = mapped_column(String)
    cancel_requested: Mapped[bool] = mapped_column(Boolean, default=False)
    __table_args__ = (
        UniqueConstraint("kind", "key"),
        CheckConstraint("kind IN ('import', 'migration')"),
    )

