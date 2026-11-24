"""Enforce one normalized name namespace for catalog assets."""
from unicodedata import normalize

from alembic import op
from sqlalchemy import text

revision = "0009_asset_names"
down_revision = "0008_master_capture"


def upgrade():
    conn = op.get_bind()
    op.execute('''CREATE TABLE asset_names (
        name_key VARCHAR NOT NULL, resource_id VARCHAR NOT NULL,
        PRIMARY KEY (name_key), UNIQUE (resource_id)
    )''')
    rows = []
    for table in ('subframe_collections', 'videos', 'image_results', 'calibration_masters'):
        rows.extend((table, row.id, row.name) for row in conn.execute(text(f'SELECT id, name FROM {table} ORDER BY id')))
    seen_ids, seen_names = {}, set()
    for table, ident, original in rows:
        if ident in seen_ids:
            if table == 'calibration_masters':
                conn.execute(text('UPDATE calibration_masters SET name=:name WHERE id=:id'), {'name': seen_ids[ident], 'id': ident})
            continue
        base = original.strip()
        name, index = base, 2
        key = normalize('NFC', name.casefold())
        while key in seen_names:
            suffix = f' ({index})'
            name = base[:120-len(suffix)] + suffix
            key = normalize('NFC', name.casefold())
            index += 1
        if name != original:
            conn.execute(text(f'UPDATE {table} SET name=:name WHERE id=:id'), {'name': name, 'id': ident})
        seen_names.add(key)
        seen_ids[ident] = name
        conn.execute(text('INSERT INTO asset_names (name_key, resource_id) VALUES (:key, :id)'), {'key': key, 'id': ident})
    for name, body in {
        'asset_name_remove_collection': 'AFTER DELETE ON subframe_collections BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END',
        'asset_name_remove_video': 'AFTER DELETE ON videos BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END',
        'asset_name_remove_image': 'AFTER DELETE ON image_results BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END',
        'asset_name_remove_calibration': 'AFTER DELETE ON calibration_masters WHEN NOT EXISTS (SELECT 1 FROM image_results WHERE id=OLD.id) BEGIN DELETE FROM asset_names WHERE resource_id=OLD.id; END',
    }.items():
        op.execute(f'CREATE TRIGGER {name} {body}')
