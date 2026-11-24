"""Add capture information for ordinary master frames."""
from alembic import op

revision = "0008_master_capture"
down_revision = "0007_image_optical_binding"


def upgrade():
    op.execute("CREATE TEMP TABLE image_results_before_0008 AS SELECT * FROM image_results")
    op.execute("DROP TABLE image_results")
    op.execute('''CREATE TABLE image_results (
        id VARCHAR NOT NULL, source_collection_id VARCHAR, name VARCHAR NOT NULL,
        notes VARCHAR, revision INTEGER NOT NULL, equipment_train_id VARCHAR,
        equipment_snapshot JSON, filter_state VARCHAR NOT NULL, filter_id VARCHAR,
        filter_snapshot JSON, exposure_seconds DOUBLE, iso DOUBLE, gain DOUBLE,
        "offset" DOUBLE, binning VARCHAR, readout_mode VARCHAR, temperature_c DOUBLE,
        PRIMARY KEY (id), FOREIGN KEY(id) REFERENCES assets (id) ON DELETE CASCADE,
        FOREIGN KEY(source_collection_id) REFERENCES subframe_collections (id) ON DELETE SET NULL
    )''')
    columns = "id, name, notes, revision, equipment_train_id, equipment_snapshot, filter_state, filter_id, filter_snapshot"
    op.execute(f"INSERT INTO image_results ({columns}) SELECT {columns} FROM image_results_before_0008")
    op.execute("DROP TABLE image_results_before_0008")
