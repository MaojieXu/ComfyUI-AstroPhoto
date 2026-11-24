"""Equipment records and immutable optical train revisions in assets.db."""

from sqlalchemy import JSON, CheckConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column

from .models import Base


class Equipment(Base):
    __tablename__ = "equipment"
    id: Mapped[str] = mapped_column(primary_key=True)
    equipment_type: Mapped[str]
    name: Mapped[str] = mapped_column(index=True)
    product_name: Mapped[str]
    notes: Mapped[str | None]
    archived_at_utc: Mapped[str | None]
    row_version: Mapped[int] = mapped_column(default=1)
    created_at_utc: Mapped[str]
    updated_at_utc: Mapped[str]
    __table_args__ = (
        CheckConstraint("equipment_type IN ('camera','primary_optics','optical_accessory','filter','other')"),
        CheckConstraint("length(trim(name)) BETWEEN 1 AND 120"),
        CheckConstraint("length(trim(product_name)) BETWEEN 1 AND 120"),
        CheckConstraint("row_version >= 1"),
        Index("ix_equipment_type_archive", "equipment_type", "archived_at_utc"),
    )


class OpticalTrain(Base):
    __tablename__ = "optical_trains"
    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(CheckConstraint("length(trim(name)) BETWEEN 1 AND 120"))
    notes: Mapped[str | None]
    camera_id: Mapped[str | None]
    primary_optics_id: Mapped[str | None]
    accessory_id: Mapped[str | None]
    filter_ids: Mapped[list] = mapped_column(JSON)
    other_ids: Mapped[list] = mapped_column(JSON)
    archived_at_utc: Mapped[str | None]
    row_version: Mapped[int] = mapped_column(CheckConstraint("row_version >= 1"), default=1)
    created_at_utc: Mapped[str]
    updated_at_utc: Mapped[str]
    deleted_at_utc: Mapped[str | None]


TRIGGERS = {
    "immutable_equipment_type": (
        "BEFORE UPDATE OF equipment_type ON equipment WHEN OLD.equipment_type <> NEW.equipment_type "
        "BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_IMMUTABLE'); END"
    ),
    "asset_name_remove_collection": "AFTER DELETE ON subframe_collections BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END",
    "asset_name_remove_video": "AFTER DELETE ON videos BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END",
    "asset_name_remove_image": "AFTER DELETE ON image_results BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END",
    "asset_name_remove_calibration": "AFTER DELETE ON calibration_masters WHEN NOT EXISTS (SELECT 1 FROM image_results WHERE id=OLD.id) BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END",
}
