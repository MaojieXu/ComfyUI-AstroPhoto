"""Track physical import groups without moving existing assets."""

from alembic import op

revision = "0003_subframe_groups"
down_revision = "0002_photography_library"


def upgrade():
    op.execute("""CREATE TABLE asset_import_frames (
        asset_id VARCHAR NOT NULL,
        group_id VARCHAR NOT NULL,
        frame_index INTEGER NOT NULL,
        PRIMARY KEY (asset_id),
        FOREIGN KEY(asset_id) REFERENCES assets (id) ON DELETE CASCADE,
        FOREIGN KEY(group_id) REFERENCES library_records (id)
    )""")
    op.execute("CREATE INDEX ix_asset_import_frames_group_id ON asset_import_frames (group_id)")
