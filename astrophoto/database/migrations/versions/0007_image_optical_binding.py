"""Preserve image results while adding optional optical binding snapshots."""

from alembic import op

revision = "0007_image_optical_binding"
down_revision = "0006_retire_legacy_library"


def upgrade():
    # Recreate the table so its schema matches the ORM's canonical column order.
    # The surrounding initialization transaction protects both the old records
    # and their asset IDs if anything fails.
    op.execute("CREATE TEMP TABLE image_results_before_0007 AS SELECT id, name, notes, revision FROM image_results")
    op.execute("DROP TABLE image_results")
    op.execute("""CREATE TABLE image_results (
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
    )""")
    op.execute("""INSERT INTO image_results (id, name, notes, revision, filter_state)
                  SELECT id, name, notes, revision, 'unknown' FROM image_results_before_0007""")
    op.execute("DROP TABLE image_results_before_0007")
