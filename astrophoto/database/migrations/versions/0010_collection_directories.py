"""Keep managed subframe directory ownership independent of frame registration."""

from alembic import op
from sqlalchemy import text

revision = "0010_collection_directories"
down_revision = "0009_asset_names"


def upgrade():
    op.execute("""CREATE TABLE collection_directories (
        workspace_id VARCHAR NOT NULL, relative_key VARCHAR NOT NULL, collection_id VARCHAR NOT NULL,
        PRIMARY KEY (workspace_id, relative_key),
        FOREIGN KEY(workspace_id) REFERENCES storage_locations (id) ON DELETE CASCADE,
        FOREIGN KEY(collection_id) REFERENCES subframe_collections (id) ON DELETE CASCADE
    )""")
    op.execute("CREATE INDEX ix_collection_directories_collection_id ON collection_directories (collection_id)")
    conn = op.get_bind()
    rows = conn.execute(text("""SELECT a.workspace_id, a.relative_key, s.collection_id
        FROM asset_locations a JOIN subframes s ON s.id = a.asset_id
        WHERE a.storage_mode = 'managed' AND a.relative_key LIKE 'objects/subframes/%/%'"""))
    directories = {(workspace, key.rpartition("/")[0], collection) for workspace, key, collection in rows}
    if directories:
        conn.execute(text("""INSERT INTO collection_directories (workspace_id, relative_key, collection_id)
            VALUES (:workspace, :key, :collection)"""),
            [{"workspace": workspace, "key": key, "collection": collection}
             for workspace, key, collection in sorted(directories)])
