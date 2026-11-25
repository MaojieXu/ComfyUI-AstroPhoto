"""Business records backed by the existing file identity and location registry."""

from sqlalchemy import CheckConstraint, ForeignKey, Index, JSON, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from .models import Base


class NamedRecord:
    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    notes: Mapped[str | None]
    revision: Mapped[int] = mapped_column(default=1)


class Timestamped:
    created_at_utc: Mapped[str]
    updated_at_utc: Mapped[str]


class CaptureParameters:
    exposure_seconds: Mapped[float | None]
    iso: Mapped[float | None]
    gain: Mapped[float | None]
    offset: Mapped[float | None]
    binning: Mapped[str | None]
    readout_mode: Mapped[str | None]
    temperature_c: Mapped[float | None]


class OpticalBinding:
    equipment_train_id: Mapped[str | None]
    equipment_snapshot: Mapped[dict | None] = mapped_column(JSON)
    filter_state: Mapped[str] = mapped_column(default="unknown")
    filter_id: Mapped[str | None]
    filter_snapshot: Mapped[dict | None] = mapped_column(JSON)


class SubframeCollection(NamedRecord, Timestamped, CaptureParameters, OpticalBinding, Base):
    __tablename__ = "subframe_collections"
    frame_type: Mapped[str]
    calibration_state: Mapped[str]
    __table_args__ = (
        CheckConstraint("frame_type IN ('light','dark','flat','bias','dark_flat','unknown')"),
        CheckConstraint("calibration_state IN ('calibrated','uncalibrated','unknown')"),
    )


class CollectionDirectory(Base):
    __tablename__ = "collection_directories"
    workspace_id: Mapped[str] = mapped_column(ForeignKey("storage_locations.id", ondelete="CASCADE"), primary_key=True)
    relative_key: Mapped[str] = mapped_column(primary_key=True)
    collection_id: Mapped[str] = mapped_column(ForeignKey("subframe_collections.id", ondelete="CASCADE"), index=True)


class Subframe(Base):
    __tablename__ = "subframes"
    id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)
    collection_id: Mapped[str] = mapped_column(ForeignKey("subframe_collections.id", ondelete="CASCADE"), index=True)
    frame_index: Mapped[int]


class Video(NamedRecord, OpticalBinding, Base):
    __tablename__ = "videos"
    id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)


class ImageResult(NamedRecord, OpticalBinding, CaptureParameters, Base):
    __tablename__ = "image_results"
    id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="CASCADE"), primary_key=True)
    source_collection_id: Mapped[str | None] = mapped_column(ForeignKey("subframe_collections.id", ondelete="SET NULL"))


class CalibrationMaster(NamedRecord, Timestamped, CaptureParameters, OpticalBinding, Base):
    __tablename__ = "calibration_masters"
    id: Mapped[str] = mapped_column(ForeignKey("assets.id", ondelete="RESTRICT"), primary_key=True)
    type: Mapped[str]
    source_collection_id: Mapped[str | None] = mapped_column(
        ForeignKey("subframe_collections.id", ondelete="SET NULL"),
    )
    camera_id: Mapped[str | None]
    camera_snapshot: Mapped[dict | None] = mapped_column(JSON)
    __table_args__ = (CheckConstraint("type IN ('dark','bias','dark_flat','flat')"),)


class CalibrationBinding(Base):
    __tablename__ = "calibration_bindings"
    collection_id: Mapped[str] = mapped_column(ForeignKey("subframe_collections.id", ondelete="CASCADE"), primary_key=True)
    master_id: Mapped[str] = mapped_column(ForeignKey("calibration_masters.id", ondelete="RESTRICT"), primary_key=True)
    created_at_utc: Mapped[str]


class AssetName(Base):
    __tablename__ = "asset_names"
    name_key: Mapped[str] = mapped_column(primary_key=True)
    resource_id: Mapped[str] = mapped_column(unique=True)


class Project(NamedRecord, Timestamped, Base):
    __tablename__ = "projects"
    name_key: Mapped[str] = mapped_column(unique=True)


class ProjectNode(Base):
    __tablename__ = "project_nodes"
    id: Mapped[str] = mapped_column(primary_key=True)
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    parent_id: Mapped[str | None] = mapped_column(ForeignKey("project_nodes.id", ondelete="CASCADE"))
    name: Mapped[str]
    name_key: Mapped[str]
    kind: Mapped[str]
    resource_id: Mapped[str | None]
    revision: Mapped[int] = mapped_column(default=1)
    __table_args__ = (
        CheckConstraint("(kind = 'folder' AND resource_id IS NULL) OR "
                        "(kind IN ('subframe_collection','video','image_result') AND resource_id IS NOT NULL)"),
        UniqueConstraint("project_id", "kind", "resource_id"),
        Index("uq_project_node_name", "project_id", func.coalesce(parent_id, ""), "name_key", unique=True),
    )
