# set up the sqlalchemy engine and session to interact with the database
from sqlalchemy import create_engine;
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
# create an SQLAlchemy engine with represents the database connection
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configure a session class to manage database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()