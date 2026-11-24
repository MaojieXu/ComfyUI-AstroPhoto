"""Remove obsolete library relationships while preserving files and storage jobs."""

from alembic import op

revision = "0006_retire_legacy_library"
down_revision = "0005_asset_catalog"


def upgrade():
    op.execute("""
        DELETE FROM library_records
        WHERE kind IN ('collections','projects','folders','masters','assignments','placements',
                       'agent_import_plan','agent_import_approval')
           OR (kind = 'approvals' AND (
               json_extract(data, '$.kind') IN ('collections','projects','folders','masters','assignments','placements')
               OR (json_extract(data, '$.kind') = 'import'
                   AND json_extract(data, '$.payload.project_id') IS NOT NULL)
           ))
    """)
