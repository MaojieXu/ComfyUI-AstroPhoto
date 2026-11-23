"""Preserve deleted equipment combinations and their historical references."""

from alembic import op

revision = "0004_deleted_trains"
down_revision = "0003_subframe_groups"


def upgrade():
    op.execute("ALTER TABLE optical_trains ADD COLUMN deleted_at_utc VARCHAR")
