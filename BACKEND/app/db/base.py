from app.db.session import engine
from app.models.user import Base

Base.metadata.create_all(bind=engine)