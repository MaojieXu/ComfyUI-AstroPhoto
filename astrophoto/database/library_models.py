"""Persistent photography library records, separate from file identity."""

from sqlalchemy import ForeignKey, JSON, String, UniqueConstraint, select
from sqlalchemy.orm import Mapped, mapped_column

from .models import Base


class AssetAttributes(Base):
    __tablename__ = "asset_attributes"

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)
    revision: Mapped[int] = mapped_column(default=1)
    attributes: Mapped[dict] = mapped_column(JSON, default=dict)


class LibraryRecord(Base):
    __tablename__ = "library_records"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    kind: Mapped[str] = mapped_column(String, index=True)
    revision: Mapped[int] = mapped_column(default=1)
    data: Mapped[dict] = mapped_column(JSON)


class AssetImportFrame(Base):
    __tablename__ = "asset_import_frames"

    asset_id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)
    group_id: Mapped[str] = mapped_column(ForeignKey("library_records.id"), index=True)
    frame_index: Mapped[int] = mapped_column()


class FormalOutput(Base):
    __tablename__ = "formal_outputs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    workspace_id: Mapped[str] = mapped_column(ForeignKey("storage_locations.id"), index=True)
    relative_key: Mapped[str] = mapped_column(String)
    source_id: Mapped[str | None] = mapped_column(String)
    provenance: Mapped[dict] = mapped_column(JSON)
    __table_args__ = (UniqueConstraint("workspace_id", "relative_key"),)


def asset_metadata_references(session, resource_id, *fields):
    """Check library references while the equipment owner holds a write transaction."""
    for attributes in session.scalars(select(AssetAttributes.attributes)):
        for field in fields:
            value = attributes.get(field)
            if value == resource_id or isinstance(value, list) and resource_id in value:
                return True
    return False
