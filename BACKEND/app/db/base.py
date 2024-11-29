from app.db.session import engine
from app.models.user import Base
from app.models.workspace import Workspace
from app.models.invitation import Invitation

Base.metadata.create_all(bind=engine)
