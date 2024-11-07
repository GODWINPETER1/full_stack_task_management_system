from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TaskWatcher(Base):
    __tablename__ = 'task_watchers'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)

    user = relationship("User", back_populates="watching_tasks")
    task = relationship("Task", back_populates="watchers")
