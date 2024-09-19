from sqlalchemy import Column, String, Integer, Text , Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.models.task import Task

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, index=True)  # Auto-generated
    title = Column(String, nullable=False)
    description = Column(Text , nullable=True)
    deleted = Column(Boolean, default = False) # Soft delete flag

    tasks = relationship("Task", back_populates="project")
