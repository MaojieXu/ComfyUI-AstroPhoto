"""Initial AstroPhoto V1 SQLite schema."""

from alembic import op


revision = "0001_v1_baseline"
down_revision = None
branch_labels = None
depends_on = None

DDL = (
    """CREATE TABLE asset_names (
    name_key VARCHAR NOT NULL,
    resource_id VARCHAR NOT NULL,
    PRIMARY KEY (name_key),
    UNIQUE (resource_id)
)""",
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
    """CREATE TABLE library_records (
    id VARCHAR NOT NULL,
    kind VARCHAR NOT NULL,
    revision INTEGER NOT NULL,
    data JSON NOT NULL,
    PRIMARY KEY (id)
)""",
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
    deleted_at_utc VARCHAR,
    PRIMARY KEY (id)
)""",
    """CREATE TABLE projects (
    name_key VARCHAR NOT NULL,
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    notes VARCHAR,
    revision INTEGER NOT NULL,
    created_at_utc VARCHAR NOT NULL,
    updated_at_utc VARCHAR NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (name_key)
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
    """CREATE TABLE subframe_collections (
    frame_type VARCHAR NOT NULL,
    calibration_state VARCHAR NOT NULL,
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    notes VARCHAR,
    revision INTEGER NOT NULL,
    created_at_utc VARCHAR NOT NULL,
    updated_at_utc VARCHAR NOT NULL,
    exposure_seconds DOUBLE,
    iso DOUBLE,
    gain DOUBLE,
    "offset" DOUBLE,
    binning VARCHAR,
    readout_mode VARCHAR,
    temperature_c DOUBLE,
    equipment_train_id VARCHAR,
    equipment_snapshot JSON,
    filter_state VARCHAR NOT NULL,
    filter_id VARCHAR,
    filter_snapshot JSON,
    PRIMARY KEY (id),
    CHECK (frame_type IN ('light','dark','flat','bias','dark_flat','unknown')),
    CHECK (calibration_state IN ('calibrated','uncalibrated','unknown'))
)""",
    """CREATE TABLE asset_attributes (
    asset_id VARCHAR NOT NULL,
    revision INTEGER NOT NULL,
    attributes JSON NOT NULL,
    PRIMARY KEY (asset_id),
    FOREIGN KEY(asset_id) REFERENCES assets (id) ON DELETE CASCADE
)""",
    """CREATE TABLE asset_import_frames (
    asset_id VARCHAR NOT NULL,
    group_id VARCHAR NOT NULL,
    frame_index INTEGER NOT NULL,
    PRIMARY KEY (asset_id),
    FOREIGN KEY(asset_id) REFERENCES assets (id) ON DELETE CASCADE,
    FOREIGN KEY(group_id) REFERENCES library_records (id)
)""",
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
    FOREIGN KEY(workspace_id) REFERENCES storage_locations (id)
)""",
    """CREATE TABLE calibration_masters (
    id VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    source_collection_id VARCHAR,
    camera_id VARCHAR,
    camera_snapshot JSON,
    name VARCHAR NOT NULL,
    notes VARCHAR,
    revision INTEGER NOT NULL,
    created_at_utc VARCHAR NOT NULL,
    updated_at_utc VARCHAR NOT NULL,
    exposure_seconds DOUBLE,
    iso DOUBLE,
    gain DOUBLE,
    "offset" DOUBLE,
    binning VARCHAR,
    readout_mode VARCHAR,
    temperature_c DOUBLE,
    equipment_train_id VARCHAR,
    equipment_snapshot JSON,
    filter_state VARCHAR NOT NULL,
    filter_id VARCHAR,
    filter_snapshot JSON,
    PRIMARY KEY (id),
    CHECK (type IN ('dark','bias','dark_flat','flat')),
    FOREIGN KEY(id) REFERENCES assets (id) ON DELETE RESTRICT,
    FOREIGN KEY(source_collection_id) REFERENCES subframe_collections (id) ON DELETE SET NULL
)""",
    """CREATE TABLE collection_directories (
    workspace_id VARCHAR NOT NULL,
    relative_key VARCHAR NOT NULL,
    collection_id VARCHAR NOT NULL,
    PRIMARY KEY (workspace_id, relative_key),
    FOREIGN KEY(workspace_id) REFERENCES storage_locations (id) ON DELETE CASCADE,
    FOREIGN KEY(collection_id) REFERENCES subframe_collections (id) ON DELETE CASCADE
)""",
    """CREATE TABLE formal_outputs (
    id VARCHAR NOT NULL,
    workspace_id VARCHAR NOT NULL,
    relative_key VARCHAR NOT NULL,
    source_id VARCHAR,
    provenance JSON NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (workspace_id, relative_key),
    FOREIGN KEY(workspace_id) REFERENCES storage_locations (id)
)""",
    """CREATE TABLE image_results (
    id VARCHAR NOT NULL,
    source_collection_id VARCHAR,
    name VARCHAR NOT NULL,
    notes VARCHAR,
    revision INTEGER NOT NULL,
    equipment_train_id VARCHAR,
    equipment_snapshot JSON,
    filter_state VARCHAR NOT NULL,
    filter_id VARCHAR,
    filter_snapshot JSON,
    exposure_seconds DOUBLE,
    iso DOUBLE,
    gain DOUBLE,
    "offset" DOUBLE,
    binning VARCHAR,
    readout_mode VARCHAR,
    temperature_c DOUBLE,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES assets (id) ON DELETE CASCADE,
    FOREIGN KEY(source_collection_id) REFERENCES subframe_collections (id) ON DELETE SET NULL
)""",
    """CREATE TABLE project_nodes (
    id VARCHAR NOT NULL,
    project_id VARCHAR NOT NULL,
    parent_id VARCHAR,
    name VARCHAR NOT NULL,
    name_key VARCHAR NOT NULL,
    kind VARCHAR NOT NULL,
    resource_id VARCHAR,
    revision INTEGER NOT NULL,
    PRIMARY KEY (id),
    CHECK ((kind = 'folder' AND resource_id IS NULL) OR (kind IN ('subframe_collection','video','image_result') AND resource_id IS NOT NULL)),
    UNIQUE (project_id, kind, resource_id),
    FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY(parent_id) REFERENCES project_nodes (id) ON DELETE CASCADE
)""",
    """CREATE TABLE subframes (
    id VARCHAR NOT NULL,
    collection_id VARCHAR NOT NULL,
    frame_index INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES assets (id) ON DELETE CASCADE,
    FOREIGN KEY(collection_id) REFERENCES subframe_collections (id) ON DELETE CASCADE
)""",
    """CREATE TABLE videos (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    notes VARCHAR,
    revision INTEGER NOT NULL,
    equipment_train_id VARCHAR,
    equipment_snapshot JSON,
    filter_state VARCHAR NOT NULL,
    filter_id VARCHAR,
    filter_snapshot JSON,
    PRIMARY KEY (id),
    FOREIGN KEY(id) REFERENCES assets (id) ON DELETE CASCADE
)""",
    """CREATE TABLE calibration_bindings (
    collection_id VARCHAR NOT NULL,
    master_id VARCHAR NOT NULL,
    created_at_utc VARCHAR NOT NULL,
    PRIMARY KEY (collection_id, master_id),
    FOREIGN KEY(collection_id) REFERENCES subframe_collections (id) ON DELETE CASCADE,
    FOREIGN KEY(master_id) REFERENCES calibration_masters (id) ON DELETE RESTRICT
)""",
    """CREATE INDEX ix_equipment_name ON equipment (name)""",
    """CREATE INDEX ix_equipment_type_archive ON equipment (equipment_type, archived_at_utc)""",
    """CREATE INDEX ix_library_records_kind ON library_records (kind)""",
    """CREATE INDEX ix_storage_operations_phase ON storage_operations (phase)""",
    """CREATE INDEX ix_asset_import_frames_group_id ON asset_import_frames (group_id)""",
    """CREATE INDEX ix_asset_locations_asset_id ON asset_locations (asset_id)""",
    """CREATE INDEX ix_asset_locations_external_key ON asset_locations (external_key)""",
    """CREATE INDEX ix_asset_locations_workspace_id ON asset_locations (workspace_id)""",
    """CREATE INDEX ix_collection_directories_collection_id ON collection_directories (collection_id)""",
    """CREATE INDEX ix_formal_outputs_workspace_id ON formal_outputs (workspace_id)""",
    """CREATE INDEX ix_project_nodes_project_id ON project_nodes (project_id)""",
    """CREATE UNIQUE INDEX uq_project_node_name ON project_nodes (project_id, coalesce(parent_id, ''), name_key)""",
    """CREATE INDEX ix_subframes_collection_id ON subframes (collection_id)""",
    """CREATE TRIGGER immutable_equipment_type BEFORE UPDATE OF equipment_type ON equipment WHEN OLD.equipment_type <> NEW.equipment_type BEGIN SELECT RAISE(ABORT,'EQUIPMENT_TYPE_IMMUTABLE'); END""",
    """CREATE TRIGGER asset_name_remove_collection AFTER DELETE ON subframe_collections BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END""",
    """CREATE TRIGGER asset_name_remove_video AFTER DELETE ON videos BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END""",
    """CREATE TRIGGER asset_name_remove_image AFTER DELETE ON image_results BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END""",
    """CREATE TRIGGER asset_name_remove_calibration AFTER DELETE ON calibration_masters WHEN NOT EXISTS (SELECT 1 FROM image_results WHERE id=OLD.id) BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END""",
)


def upgrade():
    for statement in DDL:
        op.execute(statement)
