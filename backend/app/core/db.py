from sqlmodel import create_engine

from app.core.config import settings

# Add SSL requirement for connections (required by Neon and most cloud databases)
connect_args = {"sslmode": "require"}

engine = create_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    connect_args=connect_args
)
