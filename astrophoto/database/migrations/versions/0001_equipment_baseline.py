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
	product_name VARCHAR NOT NULL,
	notes VARCHAR,
	archived_at_utc VARCHAR,
	row_version INTEGER NOT NULL,
	created_at_utc VARCHAR NOT NULL,
	updated_at_utc VARCHAR NOT NULL,
	PRIMARY KEY (id),
	CHECK (equipment_type IN ('camera','primary_optics','optical_accessory','filter','other')),
	CHECK (length(trim(name)) BETWEEN 1 AND 120),
	CHECK (length(trim(product_name)) BETWEEN 1 AND 120),
	CHECK (row_version >= 1)
)""",
    """CREATE INDEX ix_equipment_name ON equipment (name)""",
    """CREATE INDEX ix_equipment_type_archive ON equipment (equipment_type, archived_at_utc)""",
    """CREATE TABLE optical_trains (
	id VARCHAR NOT NULL,
	name VARCHAR NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
	notes VARCHAR,
	camera_id VARCHAR,
	primary_optics_id VARCHAR,
	accessory_id VARCHAR,
	filter_ids JSON NOT NULL,
	other_ids JSON NOT NULL,
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
    """CREATE TRIGGER immutable_equipment_type BEFORE UPDATE OF equipment_type ON equipment WHEN OLD.equipment_type <> NEW.equipment_type BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_IMMUTABLE'); END""",
)


def upgrade():
    for statement in DDL:
        op.execute(statement)
