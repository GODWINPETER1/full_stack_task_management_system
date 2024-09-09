from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base;
import datetime

# Project Model
class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey('users.id'))

    tasks = relationship("Task", back_populates="project")

# Task Model
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default="To Do")  # Task status (e.g., To Do, In Progress, Done)
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    project = relationship("Project", back_populates="tasks")
