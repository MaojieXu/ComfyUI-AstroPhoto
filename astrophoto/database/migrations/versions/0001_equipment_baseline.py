"""Frozen development baseline for Storage, Assets, Equipment and Optical Trains."""

from alembic import op

revision = "0001_equipment_baseline"
down_revision = None

DDL = (
    """CREATE TABLE assets (
	id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	size_bytes INTEGER NOT NULL, 
	mtime_ns INTEGER NOT NULL, 
	PRIMARY KEY (id)
)""",
    """CREATE TABLE equipment (
	id VARCHAR NOT NULL, 
	equipment_type VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	manufacturer VARCHAR, 
	model VARCHAR, 
	notes VARCHAR, 
	archived_at_utc VARCHAR, 
	row_version INTEGER NOT NULL, 
	created_at_utc VARCHAR NOT NULL, 
	updated_at_utc VARCHAR NOT NULL, 
	PRIMARY KEY (id), 
	CHECK (equipment_type IN ('camera','primary_optics','optical_accessory','filter')), 
	CHECK (length(trim(name)) BETWEEN 1 AND 120), 
	CHECK (row_version >= 1)
)""",
    """CREATE INDEX ix_equipment_name ON equipment (name)""",
    """CREATE INDEX ix_equipment_type_archive ON equipment (equipment_type, archived_at_utc)""",
    """CREATE TABLE optical_trains (
	id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120), 
	notes VARCHAR, 
	archived_at_utc VARCHAR, 
	row_version INTEGER NOT NULL CHECK (row_version >= 1), 
	created_at_utc VARCHAR NOT NULL, 
	updated_at_utc VARCHAR NOT NULL, 
	PRIMARY KEY (id)
)""",
    """CREATE TABLE storage_identity (
	id INTEGER NOT NULL, 
	instance_id VARCHAR NOT NULL, 
	PRIMARY KEY (id), 
	CHECK (id = 1), 
	UNIQUE (instance_id)
)""",
    """CREATE TABLE storage_locations (
	id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	root_path VARCHAR NOT NULL, 
	canonical_root VARCHAR NOT NULL, 
	enabled BOOLEAN NOT NULL, 
	revision INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (canonical_root)
)""",
    """CREATE TABLE storage_operations (
	id VARCHAR NOT NULL, 
	kind VARCHAR NOT NULL, 
	"key" VARCHAR NOT NULL, 
	phase VARCHAR NOT NULL, 
	created_ns INTEGER NOT NULL, 
	request JSON NOT NULL, 
	"plan" JSON NOT NULL, 
	receipt JSON NOT NULL, 
	error VARCHAR, 
	cancel_requested BOOLEAN NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (kind, "key"), 
	CHECK (kind IN ('import', 'migration'))
)""",
    """CREATE INDEX ix_storage_operations_phase ON storage_operations (phase)""",
    """CREATE TABLE asset_locations (
	id VARCHAR NOT NULL, 
	asset_id VARCHAR NOT NULL, 
	storage_mode VARCHAR NOT NULL, 
	external_path VARCHAR, 
	external_key VARCHAR, 
	workspace_id VARCHAR, 
	relative_key VARCHAR, 
	PRIMARY KEY (id), 
	UNIQUE (workspace_id, relative_key), 
	CHECK ((storage_mode = 'external_reference' AND external_path IS NOT NULL AND external_key IS NOT NULL AND workspace_id IS NULL AND relative_key IS NULL) OR (storage_mode = 'managed' AND external_path IS NULL AND external_key IS NULL AND workspace_id IS NOT NULL AND relative_key IS NOT NULL)), 
	FOREIGN KEY(asset_id) REFERENCES assets (id), 
	UNIQUE (external_key), 
	FOREIGN KEY(workspace_id) REFERENCES storage_locations (id)
)""",
    """CREATE INDEX ix_asset_locations_asset_id ON asset_locations (asset_id)""",
    """CREATE INDEX ix_asset_locations_workspace_id ON asset_locations (workspace_id)""",
    """CREATE TABLE asset_sessions (
	asset_id VARCHAR NOT NULL, 
	session_id VARCHAR NOT NULL, 
	PRIMARY KEY (asset_id, session_id), 
	FOREIGN KEY(asset_id) REFERENCES assets (id)
)""",
    """CREATE INDEX ix_asset_sessions_session_id ON asset_sessions (session_id)""",
    """CREATE TABLE camera_specs (
	equipment_id VARCHAR NOT NULL, 
	sensor_name VARCHAR, 
	sensor_kind VARCHAR CHECK (sensor_kind IN ('mono','osc','color','other','unknown')), 
	sensor_width_px INTEGER CHECK (sensor_width_px > 0), 
	sensor_height_px INTEGER CHECK (sensor_height_px > 0), 
	pixel_size_x_um DOUBLE CHECK (pixel_size_x_um > 0), 
	pixel_size_y_um DOUBLE CHECK (pixel_size_y_um > 0), 
	bayer_pattern VARCHAR, 
	adc_bit_depth INTEGER CHECK (adc_bit_depth > 0), 
	cooling_supported BOOLEAN, 
	max_bin_x INTEGER CHECK (max_bin_x > 0), 
	max_bin_y INTEGER CHECK (max_bin_y > 0), 
	PRIMARY KEY (equipment_id), 
	FOREIGN KEY(equipment_id) REFERENCES equipment (id), 
	CHECK (cooling_supported IN (0, 1))
)""",
    """CREATE TABLE filter_specs (
	equipment_id VARCHAR NOT NULL, 
	filter_kind VARCHAR, 
	physical_size_mm DOUBLE CHECK (physical_size_mm > 0), 
	filter_format VARCHAR, 
	PRIMARY KEY (equipment_id), 
	FOREIGN KEY(equipment_id) REFERENCES equipment (id)
)""",
    """CREATE TABLE optical_accessory_specs (
	equipment_id VARCHAR NOT NULL, 
	accessory_kind VARCHAR CHECK (accessory_kind IN ('reducer','flattener','barlow')), 
	nominal_factor DOUBLE CHECK (nominal_factor > 0), 
	design_backfocus_mm DOUBLE CHECK (design_backfocus_mm >= 0), 
	clear_aperture_mm DOUBLE CHECK (clear_aperture_mm > 0), 
	optical_notes VARCHAR, 
	PRIMARY KEY (equipment_id), 
	FOREIGN KEY(equipment_id) REFERENCES equipment (id)
)""",
    """CREATE TABLE optical_train_revisions (
	id VARCHAR NOT NULL, 
	train_id VARCHAR NOT NULL, 
	revision_number INTEGER NOT NULL CHECK (revision_number >= 1), 
	base_revision_id VARCHAR, 
	snapshot_json JSON NOT NULL CHECK (json_valid(snapshot_json)), 
	change_summary VARCHAR, 
	published_at_utc VARCHAR NOT NULL, 
	idempotency_key VARCHAR NOT NULL, 
	published_draft_version INTEGER NOT NULL CHECK (published_draft_version >= 1), 
	PRIMARY KEY (id), 
	UNIQUE (train_id, revision_number), 
	UNIQUE (train_id, id), 
	UNIQUE (train_id, idempotency_key), 
	FOREIGN KEY(train_id, base_revision_id) REFERENCES optical_train_revisions (train_id, id), 
	FOREIGN KEY(train_id) REFERENCES optical_trains (id)
)""",
    """CREATE TABLE primary_optics_specs (
	equipment_id VARCHAR NOT NULL, 
	optics_kind VARCHAR CHECK (optics_kind IN ('telescope','lens')), 
	optical_design VARCHAR, 
	aperture_mm DOUBLE CHECK (aperture_mm > 0), 
	native_focal_length_mm DOUBLE CHECK (native_focal_length_mm > 0), 
	native_f_ratio DOUBLE CHECK (native_f_ratio > 0), 
	image_circle_mm DOUBLE CHECK (image_circle_mm > 0), 
	optical_notes VARCHAR, 
	PRIMARY KEY (equipment_id), 
	FOREIGN KEY(equipment_id) REFERENCES equipment (id)
)""",
    """CREATE TABLE camera_readout_modes (
	id VARCHAR NOT NULL, 
	camera_id VARCHAR NOT NULL, 
	mode_key VARCHAR NOT NULL, 
	display_name VARCHAR NOT NULL, 
	gain_min DOUBLE, 
	gain_max DOUBLE, 
	offset_min DOUBLE, 
	offset_max DOUBLE, 
	PRIMARY KEY (id), 
	UNIQUE (camera_id, mode_key), 
	CHECK (length(trim(mode_key)) > 0 AND length(trim(display_name)) > 0), 
	CHECK (gain_max >= gain_min), 
	CHECK (offset_max >= offset_min), 
	FOREIGN KEY(camera_id) REFERENCES camera_specs (equipment_id)
)""",
    """CREATE TABLE filter_passbands (
	id VARCHAR NOT NULL, 
	filter_id VARCHAR NOT NULL, 
	position INTEGER NOT NULL CHECK (position >= 0), 
	band_label VARCHAR COLLATE "NOCASE" NOT NULL CHECK (length(trim(band_label)) > 0), 
	center_nm FLOAT CHECK (center_nm > 0), 
	fwhm_nm FLOAT CHECK (fwhm_nm > 0), 
	PRIMARY KEY (id), 
	UNIQUE (filter_id, band_label), 
	UNIQUE (filter_id, position), 
	FOREIGN KEY(filter_id) REFERENCES filter_specs (equipment_id)
)""",
    """CREATE TABLE optical_train_defaults (
	train_id VARCHAR NOT NULL, 
	revision_id VARCHAR NOT NULL, 
	PRIMARY KEY (train_id), 
	FOREIGN KEY(train_id, revision_id) REFERENCES optical_train_revisions (train_id, id), 
	FOREIGN KEY(train_id) REFERENCES optical_trains (id)
)""",
    """CREATE TABLE optical_train_drafts (
	train_id VARCHAR NOT NULL, 
	base_revision_id VARCHAR, 
	draft_json JSON NOT NULL CHECK (json_valid(draft_json)), 
	draft_version INTEGER NOT NULL CHECK (draft_version >= 1), 
	updated_at_utc VARCHAR NOT NULL, 
	PRIMARY KEY (train_id), 
	FOREIGN KEY(train_id, base_revision_id) REFERENCES optical_train_revisions (train_id, id), 
	FOREIGN KEY(train_id) REFERENCES optical_trains (id)
)""",
    """CREATE TRIGGER immutable_train_revision_update BEFORE UPDATE ON optical_train_revisions BEGIN SELECT RAISE(ABORT,'PUBLISHED_REVISION_IMMUTABLE'); END""",
    """CREATE TRIGGER immutable_train_revision_delete BEFORE DELETE ON optical_train_revisions BEGIN SELECT RAISE(ABORT,'PUBLISHED_REVISION_IMMUTABLE'); END""",
    """CREATE TRIGGER immutable_train_revision_replace BEFORE INSERT ON optical_train_revisions WHEN EXISTS (SELECT 1 FROM optical_train_revisions WHERE id=NEW.id OR (train_id=NEW.train_id AND (revision_number=NEW.revision_number OR idempotency_key=NEW.idempotency_key))) BEGIN SELECT RAISE(ABORT,'PUBLISHED_REVISION_IMMUTABLE'); END""",
    """CREATE TRIGGER immutable_equipment_type BEFORE UPDATE OF equipment_type ON equipment WHEN OLD.equipment_type <> NEW.equipment_type BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_IMMUTABLE'); END""",
    """CREATE TRIGGER camera_specs_type_insert BEFORE INSERT ON camera_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'camera' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER camera_specs_type_update BEFORE UPDATE ON camera_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'camera' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER primary_optics_specs_type_insert BEFORE INSERT ON primary_optics_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'primary_optics' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER primary_optics_specs_type_update BEFORE UPDATE ON primary_optics_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'primary_optics' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER optical_accessory_specs_type_insert BEFORE INSERT ON optical_accessory_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'optical_accessory' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER optical_accessory_specs_type_update BEFORE UPDATE ON optical_accessory_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'optical_accessory' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER filter_specs_type_insert BEFORE INSERT ON filter_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'filter' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
    """CREATE TRIGGER filter_specs_type_update BEFORE UPDATE ON filter_specs WHEN (SELECT equipment_type FROM equipment WHERE id=NEW.equipment_id) IS NOT 'filter' BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_MISMATCH'); END""",
)


def upgrade():
    for statement in DDL:
        op.execute(statement)
