from sqlalchemy import Column , Integer , Boolean , String
from app.db.base_class import Base

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer , primary_key = True , index = True)
    title = Column(String , index = True)
    description = Column(String , index = True)
    # owner_id represent the user who own the task
    owner_id = Column(Integer)