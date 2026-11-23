"""Equipment records and immutable optical train revisions in assets.db."""

from sqlalchemy import (
    JSON, Boolean, CheckConstraint, Float, ForeignKey, ForeignKeyConstraint, Index, String, UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from .models import Base


class Equipment(Base):
    __tablename__ = "equipment"
    id: Mapped[str] = mapped_column(primary_key=True)
    equipment_type: Mapped[str]
    name: Mapped[str] = mapped_column(index=True)
    manufacturer: Mapped[str | None]
    model: Mapped[str | None]
    notes: Mapped[str | None]
    archived_at_utc: Mapped[str | None]
    row_version: Mapped[int] = mapped_column(default=1)
    created_at_utc: Mapped[str]
    updated_at_utc: Mapped[str]
    __table_args__ = (
        CheckConstraint("equipment_type IN ('camera','primary_optics','optical_accessory','filter')"),
        CheckConstraint("length(trim(name)) BETWEEN 1 AND 120"),
        CheckConstraint("row_version >= 1"),
        Index("ix_equipment_type_archive", "equipment_type", "archived_at_utc"),
    )


class CameraSpec(Base):
    __tablename__ = "camera_specs"
    equipment_id: Mapped[str] = mapped_column(ForeignKey("equipment.id"), primary_key=True)
    sensor_name: Mapped[str | None]
    sensor_kind: Mapped[str | None] = mapped_column(
        CheckConstraint("sensor_kind IN ('mono','osc','color','other','unknown')")
    )
    sensor_width_px: Mapped[int | None] = mapped_column(CheckConstraint("sensor_width_px > 0"))
    sensor_height_px: Mapped[int | None] = mapped_column(CheckConstraint("sensor_height_px > 0"))
    pixel_size_x_um: Mapped[float | None] = mapped_column(CheckConstraint("pixel_size_x_um > 0"))
    pixel_size_y_um: Mapped[float | None] = mapped_column(CheckConstraint("pixel_size_y_um > 0"))
    bayer_pattern: Mapped[str | None]
    adc_bit_depth: Mapped[int | None] = mapped_column(CheckConstraint("adc_bit_depth > 0"))
    cooling_supported: Mapped[bool | None] = mapped_column(Boolean(create_constraint=True))
    max_bin_x: Mapped[int | None] = mapped_column(CheckConstraint("max_bin_x > 0"))
    max_bin_y: Mapped[int | None] = mapped_column(CheckConstraint("max_bin_y > 0"))


class CameraReadoutMode(Base):
    __tablename__ = "camera_readout_modes"
    id: Mapped[str] = mapped_column(primary_key=True)
    camera_id: Mapped[str] = mapped_column(ForeignKey("camera_specs.equipment_id"))
    mode_key: Mapped[str]
    display_name: Mapped[str]
    gain_min: Mapped[float | None]
    gain_max: Mapped[float | None]
    offset_min: Mapped[float | None]
    offset_max: Mapped[float | None]
    __table_args__ = (
        UniqueConstraint("camera_id", "mode_key"),
        CheckConstraint("length(trim(mode_key)) > 0 AND length(trim(display_name)) > 0"),
        CheckConstraint("gain_max >= gain_min"),
        CheckConstraint("offset_max >= offset_min"),
    )


class PrimaryOpticsSpec(Base):
    __tablename__ = "primary_optics_specs"
    equipment_id: Mapped[str] = mapped_column(ForeignKey("equipment.id"), primary_key=True)
    optics_kind: Mapped[str | None] = mapped_column(CheckConstraint("optics_kind IN ('telescope','lens')"))
    optical_design: Mapped[str | None]
    aperture_mm: Mapped[float | None] = mapped_column(CheckConstraint("aperture_mm > 0"))
    native_focal_length_mm: Mapped[float | None] = mapped_column(CheckConstraint("native_focal_length_mm > 0"))
    native_f_ratio: Mapped[float | None] = mapped_column(CheckConstraint("native_f_ratio > 0"))
    image_circle_mm: Mapped[float | None] = mapped_column(CheckConstraint("image_circle_mm > 0"))
    optical_notes: Mapped[str | None]


class OpticalAccessorySpec(Base):
    __tablename__ = "optical_accessory_specs"
    equipment_id: Mapped[str] = mapped_column(ForeignKey("equipment.id"), primary_key=True)
    accessory_kind: Mapped[str | None] = mapped_column(CheckConstraint("accessory_kind IN ('reducer','flattener','barlow')"))
    nominal_factor: Mapped[float | None] = mapped_column(CheckConstraint("nominal_factor > 0"))
    design_backfocus_mm: Mapped[float | None] = mapped_column(CheckConstraint("design_backfocus_mm >= 0"))
    clear_aperture_mm: Mapped[float | None] = mapped_column(CheckConstraint("clear_aperture_mm > 0"))
    optical_notes: Mapped[str | None]


class FilterSpec(Base):
    __tablename__ = "filter_specs"
    equipment_id: Mapped[str] = mapped_column(ForeignKey("equipment.id"), primary_key=True)
    filter_kind: Mapped[str | None]
    physical_size_mm: Mapped[float | None] = mapped_column(CheckConstraint("physical_size_mm > 0"))
    filter_format: Mapped[str | None]


class FilterPassband(Base):
    __tablename__ = "filter_passbands"
    id: Mapped[str] = mapped_column(primary_key=True)
    filter_id: Mapped[str] = mapped_column(ForeignKey("filter_specs.equipment_id"))
    position: Mapped[int] = mapped_column(CheckConstraint("position >= 0"))
    band_label: Mapped[str] = mapped_column(String(collation="NOCASE"), CheckConstraint("length(trim(band_label)) > 0"))
    center_nm: Mapped[float | None] = mapped_column(Float, CheckConstraint("center_nm > 0"))
    fwhm_nm: Mapped[float | None] = mapped_column(Float, CheckConstraint("fwhm_nm > 0"))
    __table_args__ = (UniqueConstraint("filter_id", "band_label"), UniqueConstraint("filter_id", "position"))


class OpticalTrain(Base):
    __tablename__ = "optical_trains"
    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(CheckConstraint("length(trim(name)) BETWEEN 1 AND 120"))
    notes: Mapped[str | None]
    archived_at_utc: Mapped[str | None]
    row_version: Mapped[int] = mapped_column(CheckConstraint("row_version >= 1"), default=1)
    created_at_utc: Mapped[str]
    updated_at_utc: Mapped[str]
    deleted_at_utc: Mapped[str | None]


class OpticalTrainRevision(Base):
    __tablename__ = "optical_train_revisions"
    id: Mapped[str] = mapped_column(primary_key=True)
    train_id: Mapped[str] = mapped_column(ForeignKey("optical_trains.id"))
    revision_number: Mapped[int] = mapped_column(CheckConstraint("revision_number >= 1"))
    base_revision_id: Mapped[str | None]
    snapshot_json: Mapped[dict] = mapped_column(JSON, CheckConstraint("json_valid(snapshot_json)"))
    change_summary: Mapped[str | None]
    published_at_utc: Mapped[str]
    idempotency_key: Mapped[str]
    published_draft_version: Mapped[int] = mapped_column(CheckConstraint("published_draft_version >= 1"))
    __table_args__ = (
        UniqueConstraint("train_id", "revision_number"), UniqueConstraint("train_id", "id"),
        UniqueConstraint("train_id", "idempotency_key"),
        ForeignKeyConstraint(("train_id", "base_revision_id"), ("optical_train_revisions.train_id", "optical_train_revisions.id")),
    )


class OpticalTrainDraft(Base):
    __tablename__ = "optical_train_drafts"
    train_id: Mapped[str] = mapped_column(ForeignKey("optical_trains.id"), primary_key=True)
    base_revision_id: Mapped[str | None]
    draft_json: Mapped[dict] = mapped_column(JSON, CheckConstraint("json_valid(draft_json)"))
    draft_version: Mapped[int] = mapped_column(CheckConstraint("draft_version >= 1"))
    updated_at_utc: Mapped[str]
    __table_args__ = (
        ForeignKeyConstraint(("train_id", "base_revision_id"), ("optical_train_revisions.train_id", "optical_train_revisions.id")),
    )


class OpticalTrainDefault(Base):
    __tablename__ = "optical_train_defaults"
    train_id: Mapped[str] = mapped_column(ForeignKey("optical_trains.id"), primary_key=True)
    revision_id: Mapped[str]
    __table_args__ = (
        ForeignKeyConstraint(("train_id", "revision_id"), ("optical_train_revisions.train_id", "optical_train_revisions.id")),
    )


SPEC_MODELS = {
    "camera": CameraSpec, "primary_optics": PrimaryOpticsSpec,
    "optical_accessory": OpticalAccessorySpec, "filter": FilterSpec,
}
TRIGGERS = {
    **{
        f"immutable_train_revision_{op.lower()}":
        f"BEFORE {op} ON optical_train_revisions BEGIN SELECT RAISE(ABORT,'PUBLISHED_REVISION_IMMUTABLE'); END"
        for op in ("UPDATE", "DELETE")
    },
    "immutable_train_revision_replace": (
        "BEFORE INSERT ON optical_train_revisions WHEN EXISTS (SELECT 1 FROM optical_train_revisions "
        "WHERE id=NEW.id OR (train_id=NEW.train_id AND "
        "(revision_number=NEW.revision_number OR idempotency_key=NEW.idempotency_key))) "
        "BEGIN SELECT RAISE(ABORT,'PUBLISHED_REVISION_IMMUTABLE'); END"
    ),
    "immutable_equipment_type": (
        "BEFORE UPDATE OF equipment_type ON equipment WHEN OLD.equipment_type <> NEW.equipment_type "
        "BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_IMMUTABLE'); END"
    ),
}
for kind, spec in SPEC_MODELS.items():
    for operation in ("INSERT", "UPDATE"):
        TRIGGERS[f"{spec.__tablename__}_type_{operation.lower()}"] = (
            f"BEFORE {operation} ON {spec.__tablename__} WHEN "
            f"(SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT '{kind}' "
            "BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END"
        )
