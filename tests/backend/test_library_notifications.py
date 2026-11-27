from uuid import uuid4

import pytest
from sqlalchemy import delete

from astrophoto.database.models import Asset
from astrophoto.storage.runtime import StorageRuntime


def test_library_notification_only_after_committed_changes(tmp_path):
    runtime = StorageRuntime.initialize(tmp_path / 'data', {})
    notifications = []
    runtime.db.on_library_changed = lambda: notifications.append('changed')
    asset_id = str(uuid4())
    try:
        with runtime.db.session(transaction='read') as session:
            assert session.get(Asset, asset_id) is None
        assert notifications == []
        with pytest.raises(RuntimeError):
            with runtime.db.session() as session:
                session.add(Asset(id=asset_id, name='rolled-back.fit', size_bytes=1, mtime_ns=1))
                session.flush()
                raise RuntimeError('rollback')
        assert notifications == []
        with runtime.db.session() as session:
            session.add(Asset(id=asset_id, name='test.fit', size_bytes=1, mtime_ns=1))
        assert notifications == ['changed']
        with runtime.db.session() as session:
            session.execute(delete(Asset).where(Asset.id == asset_id))
        assert notifications == ['changed', 'changed']
    finally:
        runtime.close()
