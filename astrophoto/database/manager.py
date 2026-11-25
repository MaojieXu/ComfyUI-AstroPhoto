"""Independent SQLite lifecycle with explicit schema and identity checks."""

import os
import sqlite3
import tempfile
from contextlib import closing, contextmanager
from functools import lru_cache
from pathlib import Path

from alembic import command
from alembic.config import Config
from alembic.migration import MigrationContext
from sqlalchemy import create_engine, event, inspect
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from sqlalchemy.schema import CreateIndex, CreateTable
from sqlalchemy.dialects.sqlite import dialect

from ..core.config import sync_directory
from ..core.errors import StorageError
from ..storage.manager import rename_noreplace
from ..storage.paths import checked_path
from . import catalog_models, library_models  # noqa: F401 - register the asset schema
from .equipment_models import TRIGGERS
from .models import Base

SCHEMA = "0001_v1_baseline"


def normalize_sql(value):
    return " ".join(value.split())


@lru_cache(maxsize=1)
def expected_schema():
    sqlite = dialect()
    schema = {table.name: str(CreateTable(table).compile(dialect=sqlite)) for table in Base.metadata.sorted_tables}
    schema.update({index.name: str(CreateIndex(index).compile(dialect=sqlite))
                   for table in Base.metadata.sorted_tables for index in table.indexes})
    schema.update({name: f"CREATE TRIGGER {name} {body}" for name, body in TRIGGERS.items()})
    return {name: normalize_sql(sql) for name, sql in schema.items()}


class DatabaseManager:
    def __init__(self, path: Path, *, read_only: bool = False):
        self.path = path
        self.read_only = read_only
        self.engine = create_engine(
            "sqlite://", poolclass=NullPool, creator=self._connect
        )
        self.sessions = sessionmaker(self.engine, expire_on_commit=False)

        @event.listens_for(self.engine, "connect")
        def configure(connection, _record):
            connection.execute("PRAGMA foreign_keys=ON")
            connection.execute("PRAGMA busy_timeout=3000")
            connection.execute("PRAGMA synchronous=FULL")

    def _connect(self):
        path = checked_path(self.path)
        if path.stat().st_nlink != 1:
            raise StorageError("RECOVERY_REQUIRED")
        mode = "ro" if self.read_only else "rw"
        return sqlite3.connect(f"{path.as_uri()}?mode={mode}", uri=True, timeout=3, check_same_thread=False)

    def _check_sidecars(self):
        for suffix in ("-wal", "-shm", "-journal"):
            sidecar = checked_path(str(self.path) + suffix)
            if sidecar.exists() and sidecar.stat().st_nlink != 1:
                raise StorageError("RECOVERY_REQUIRED", "Unsafe database sidecar")

    @staticmethod
    def _require_v1(revision):
        if revision != SCHEMA:
            raise StorageError(
                "DEV_SCHEMA_RESET_REQUIRED",
                "Unsupported asset database schema. Start AstroPhoto with a new Data Root.",
                details={"schema": revision, "expected_schema": SCHEMA},
            )

    def _check_existing_revision(self, path, *, creating):
        # The host holds its Data Root lock. A normal read-only connection
        # includes committed WAL transactions when inspecting the revision.
        with closing(sqlite3.connect(f"{path.as_uri()}?mode=ro", uri=True)) as connection:
            objects = connection.execute(
                "SELECT name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'"
            ).fetchall()
            if not objects and creating:
                return
            revisions = (connection.execute("SELECT version_num FROM alembic_version").fetchall()
                         if ("alembic_version",) in objects else [])
            self._require_v1(revisions[0][0] if len(revisions) == 1 else None)

    def initialize(self, instance_id: str, *, creating: bool) -> None:
        path = checked_path(self.path)
        existing = path.exists()
        if (not existing and not creating) or (existing and path.stat().st_nlink != 1):
            raise StorageError("RECOVERY_REQUIRED", "Asset database missing or unsafe")
        self._check_sidecars()
        try:
            if existing:
                self._check_existing_revision(path, creating=creating)
            else:
                with path.open("xb"):
                    pass
            with self.engine.connect() as connection:
                if connection.exec_driver_sql("PRAGMA quick_check").scalars().all() != ["ok"]:
                    raise StorageError("DATABASE_INVALID")
                revision = MigrationContext.configure(connection).get_current_revision()
                if revision is None and creating and not inspect(connection).get_table_names():
                    fresh = True
                else:
                    fresh = False
                    self._require_v1(revision)
                    self._check_schema(connection)
                    identity = connection.exec_driver_sql(
                        "SELECT instance_id FROM storage_identity WHERE id=1"
                    ).scalar()
                    if identity != instance_id:
                        raise StorageError("RECOVERY_REQUIRED", "Database belongs to another instance")
                actual_mode = connection.exec_driver_sql("PRAGMA journal_mode=WAL").scalar_one()
                if actual_mode.lower() != "wal":
                    raise StorageError("WAL_UNAVAILABLE")
                connection.commit()
                if fresh:
                    config = Config()
                    config.set_main_option("script_location", str(Path(__file__).parent / "migrations"))
                    config.attributes["connection"] = connection
                    connection.exec_driver_sql("BEGIN IMMEDIATE")
                    command.upgrade(config, SCHEMA)
                    connection.exec_driver_sql("INSERT INTO storage_identity VALUES (1, ?)", (instance_id,))
                    self._check_schema(connection)
                if connection.exec_driver_sql("PRAGMA foreign_key_check").first() is not None:
                    raise StorageError("DATABASE_INVALID")
                if fresh:
                    connection.commit()
        except (SQLAlchemyError, sqlite3.DatabaseError) as exc:
            raise StorageError("DATABASE_INVALID") from exc

    @staticmethod
    def _check_schema(connection):
        schema = dict(connection.exec_driver_sql(
            "SELECT name,sql FROM sqlite_master WHERE sql IS NOT NULL"
        ).all())
        if any(normalize_sql(schema.get(name, "")) != sql for name, sql in expected_schema().items()):
            raise StorageError("DEV_SCHEMA_RESET_REQUIRED", "Asset database does not match the V1 schema")

    @contextmanager
    def session(self, *, transaction=None):
        with self.sessions() as session:
            with session.begin():
                if transaction is not None:
                    session.connection().exec_driver_sql("BEGIN IMMEDIATE" if transaction == "write" else "BEGIN")
                yield session

    def health(self, *, instance_id: str | None = None) -> dict:
        if not self.path.is_file():
            raise StorageError("DATABASE_INVALID")
        if instance_id is not None:
            self._check_sidecars()
        try:
            with self.engine.connect() as conn:
                revision = MigrationContext.configure(conn).get_current_revision()
                self._require_v1(revision)
                self._check_schema(conn)
                identity = conn.exec_driver_sql("SELECT instance_id FROM storage_identity WHERE id=1").scalar()
                if identity is None or (instance_id is not None and identity != instance_id):
                    raise StorageError("RECOVERY_REQUIRED", "Database belongs to another instance")
                if instance_id is not None and (conn.exec_driver_sql("PRAGMA quick_check").scalars().all() != ["ok"]
                                                or conn.exec_driver_sql("PRAGMA foreign_key_check").first() is not None):
                    raise StorageError("DATABASE_INVALID")
                mode = conn.exec_driver_sql("PRAGMA journal_mode").scalar_one()
                foreign_keys = bool(conn.exec_driver_sql("PRAGMA foreign_keys").scalar_one())
                if mode.lower() != "wal":
                    raise StorageError("WAL_UNAVAILABLE")
                if not foreign_keys:
                    raise StorageError("DATABASE_INVALID")
                return {"assets": "ready", "schema": revision, "journal_mode": mode, "foreign_keys": foreign_keys,
                        "knowledge": "not_initialized", "memory": "not_initialized"}
        except SQLAlchemyError as exc:
            raise StorageError("DATABASE_INVALID") from exc

    def backup(self, target: Path) -> None:
        target = checked_path(target)
        if target.exists():
            raise FileExistsError(target)
        fd, staging_name = tempfile.mkstemp(prefix=".assets-backup-", suffix=".tmp", dir=target.parent)
        os.close(fd)
        staging = Path(staging_name)
        try:
            with closing(self._connect()) as source, closing(sqlite3.connect(staging)) as copy:
                source.backup(copy)
                if copy.execute("PRAGMA quick_check").fetchall() != [("ok",)]:
                    raise StorageError("DATABASE_INVALID")
            rename_noreplace(staging, target)
            sync_directory(target.parent)
        finally:
            staging.unlink(missing_ok=True)

