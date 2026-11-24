"""Create the typed catalog without rewriting file locations or import receipts."""

from alembic import op

revision = "0005_asset_catalog"
down_revision = "0004_deleted_trains"


DDL = (
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
    """CREATE TABLE subframes (
	id VARCHAR NOT NULL,
	collection_id VARCHAR NOT NULL,
	frame_index INTEGER NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id) REFERENCES assets (id) ON DELETE CASCADE,
	FOREIGN KEY(collection_id) REFERENCES subframe_collections (id) ON DELETE CASCADE
)""",
    """CREATE INDEX ix_subframes_collection_id ON subframes (collection_id)""",
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
    """CREATE TABLE image_results (
	id VARCHAR NOT NULL,
	name VARCHAR NOT NULL,
	notes VARCHAR,
	revision INTEGER NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(id) REFERENCES assets (id) ON DELETE CASCADE
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
    """CREATE TABLE calibration_bindings (
	collection_id VARCHAR NOT NULL,
	master_id VARCHAR NOT NULL,
	created_at_utc VARCHAR NOT NULL,
	PRIMARY KEY (collection_id, master_id),
	FOREIGN KEY(collection_id) REFERENCES subframe_collections (id) ON DELETE CASCADE,
	FOREIGN KEY(master_id) REFERENCES calibration_masters (id) ON DELETE RESTRICT
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
    """CREATE INDEX ix_project_nodes_project_id ON project_nodes (project_id)""",
    """CREATE UNIQUE INDEX uq_project_node_name ON project_nodes (project_id, coalesce(parent_id, ''), name_key)""",
)


def upgrade():
    for statement in DDL:
        op.execute(statement)
    # Existing explicit single-file classifications are safe to promote. Legacy
    # groups, masters and projects can encode structures with no 1:1 mapping.
    op.execute("""
        INSERT INTO videos (id, name, notes, revision, filter_state)
        SELECT a.id, a.name, json_extract(m.attributes, '$.notes'), m.revision, 'unknown'
        FROM assets a JOIN asset_attributes m ON m.asset_id = a.id
        WHERE json_extract(m.attributes, '$.file_kind') = 'video'
    """)
    op.execute("""
        INSERT INTO image_results (id, name, notes, revision)
        SELECT a.id, a.name, json_extract(m.attributes, '$.notes'), m.revision
        FROM assets a JOIN asset_attributes m ON m.asset_id = a.id
        WHERE json_extract(m.attributes, '$.role') IN ('master_frame', 'processed')
          AND coalesce(json_extract(m.attributes, '$.file_kind'), '') <> 'video'
          AND NOT EXISTS (
            SELECT 1 FROM library_records r
            WHERE r.kind = 'masters' AND json_extract(r.data, '$.asset_id') = a.id
          )
    """)
