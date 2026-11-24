"""Make older import groups visible in the typed catalog."""

from datetime import UTC, datetime
from unicodedata import normalize

from alembic import op
from sqlalchemy import text

revision = "0011_legacy_subframe_groups"
down_revision = "0010_collection_directories"


def upgrade():
    connection = op.get_bind()
    names = set(connection.scalars(text("SELECT name_key FROM asset_names")))
    groups = connection.execute(text("""
        SELECT r.id, json_extract(r.data, '$.name') AS name
        FROM library_records r
        WHERE r.kind = 'import_group'
          AND EXISTS (SELECT 1 FROM asset_import_frames f WHERE f.group_id = r.id)
          AND NOT EXISTS (SELECT 1 FROM subframe_collections g WHERE g.id = r.id)
        ORDER BY r.id
    """)).all()
    stamp = datetime.now(UTC).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    for ident, old_name in groups:
        base = (old_name.strip() if isinstance(old_name, str) else "")[:120].rstrip() or "Imported frames"
        name, number = base, 2
        while (key := normalize("NFC", name.casefold())) in names:
            suffix = f" ({number})"
            name = base[:120 - len(suffix)].rstrip() + suffix
            number += 1
        connection.execute(text("""
            INSERT INTO subframe_collections
                (id, name, revision, created_at_utc, updated_at_utc, frame_type, calibration_state, filter_state)
            VALUES (:id, :name, 1, :stamp, :stamp, 'unknown', 'unknown', 'unknown')
        """), {"id": ident, "name": name, "stamp": stamp})
        connection.execute(text("INSERT INTO asset_names (name_key, resource_id) VALUES (:key, :id)"),
                           {"key": key, "id": ident})
        names.add(key)
    connection.execute(text("""
        INSERT INTO subframes (id, collection_id, frame_index)
        SELECT f.asset_id, f.group_id, f.frame_index
        FROM asset_import_frames f JOIN subframe_collections g ON g.id = f.group_id
        WHERE NOT EXISTS (SELECT 1 FROM subframes s WHERE s.id = f.asset_id)
    """))
    directories = {}
    for workspace, path, group in connection.execute(text("""
        SELECT a.workspace_id, a.relative_key, s.collection_id
        FROM asset_locations a LEFT JOIN subframes s ON s.id = a.asset_id
        WHERE a.storage_mode = 'managed' AND a.relative_key LIKE 'objects/subframes/%/%'
    """)):
        directories.setdefault((workspace, path.rpartition("/")[0]), set()).add(group)
    for (workspace, path), owners in directories.items():
        if len(owners) != 1 or None in owners:
            continue
        connection.execute(text("""
            INSERT INTO collection_directories (workspace_id, relative_key, collection_id)
            VALUES (:workspace, :path, :group)
            ON CONFLICT (workspace_id, relative_key) DO NOTHING
        """), {"workspace": workspace, "path": path, "group": next(iter(owners))})
