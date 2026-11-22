"""Add virtual photography records and allow independent Reference registrations."""

from alembic import op

revision = "0002_photography_library"
down_revision = "0001_equipment_baseline"

DDL = (
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
    """CREATE TABLE asset_attributes (
	asset_id VARCHAR NOT NULL, 
	revision INTEGER NOT NULL, 
	attributes JSON NOT NULL, 
	PRIMARY KEY (asset_id), 
	FOREIGN KEY(asset_id) REFERENCES assets (id) ON DELETE CASCADE
)""",
    """CREATE TABLE library_records (
	id VARCHAR NOT NULL, 
	kind VARCHAR NOT NULL, 
	revision INTEGER NOT NULL, 
	data JSON NOT NULL, 
	PRIMARY KEY (id)
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
    """CREATE INDEX ix_asset_locations_asset_id ON asset_locations (asset_id)""",
    """CREATE INDEX ix_asset_locations_external_key ON asset_locations (external_key)""",
    """CREATE INDEX ix_asset_locations_workspace_id ON asset_locations (workspace_id)""",
    """CREATE INDEX ix_library_records_kind ON library_records (kind)""",
    """CREATE INDEX ix_formal_outputs_workspace_id ON formal_outputs (workspace_id)""",
)


def upgrade():
    op.execute("ALTER TABLE asset_locations RENAME TO old_asset_locations")
    op.execute("DROP INDEX ix_asset_locations_asset_id")
    op.execute("DROP INDEX ix_asset_locations_workspace_id")
    for sql in DDL:
        op.execute(sql)
    op.execute("INSERT INTO asset_locations SELECT * FROM old_asset_locations")
    op.execute("DROP TABLE old_asset_locations")
    op.execute("""
        INSERT INTO formal_outputs (id, workspace_id, relative_key, source_id, provenance)
        SELECT a.id, l.workspace_id, l.relative_key, NULL,
               json_object('producer', 'siril-autostretch-v1', 'size_bytes', a.size_bytes, 'mtime_ns', a.mtime_ns)
        FROM assets a JOIN asset_locations l ON l.asset_id = a.id
        WHERE l.storage_mode = 'managed' AND l.relative_key = 'outputs/' || a.id || '/stretched.fit'
    """)
