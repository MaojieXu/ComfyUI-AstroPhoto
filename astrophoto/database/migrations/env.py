from alembic import context


def run_migrations_online():
    context.configure(connection=context.config.attributes["connection"], transactional_ddl=True)
    with context.begin_transaction():
        context.run_migrations()


run_migrations_online()

