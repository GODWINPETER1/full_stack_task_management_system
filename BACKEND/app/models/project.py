from sqlalchemy import Column, String, Integer, Text, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.models.task import Task
import enum

# Enum for project status
class ProjectStatus(enum.Enum):
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    deleted = Column(Boolean, default=False)
    
    # Add status field
    status = Column(Enum(ProjectStatus), default=ProjectStatus.pending)
    
    # Foreign key for user association
    user_id = Column(Integer , ForeignKey('users.id'))
    owner = relationship("User" , back_populates = "projects")
    
    

    tasks = relationship("Task", back_populates="project")
    invitations = relationship("Invitation", back_populates="project")  # Add this line
