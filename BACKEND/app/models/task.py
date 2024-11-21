from sqlalchemy import Column, String, Integer, ForeignKey, DateTime , Enum as SQLAlchemyEnum , Table , MetaData
from sqlalchemy.orm import relationship
from enum import Enum
from sqlalchemy.ext.declarative import declarative_base
from app.db.base_class import Base
from app.models.label import task_labels


base = declarative_base()
metadata = MetaData()

class PriorityLevel(str , Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"
    

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String)
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"))
    priority = Column(SQLAlchemyEnum(PriorityLevel) , default=PriorityLevel.MEDIUM)
    
    assigned_to = relationship("User", back_populates="tasks_assigned")
    project = relationship("Project", back_populates="tasks")
    comments = relationship("Comment", back_populates="task")
    reminders = relationship("Reminder", back_populates="task")
    
    tags = relationship("TaskTag", back_populates="task")
    time_logs = relationship("TimeLog" , back_populates="task")
    labels = relationship("Label" , secondary= task_labels , back_populates="tasks")
    watchers = relationship("TaskWatcher" , back_populates="task")
    
    
    # Dependencies relationships
    dependencies = relationship("TaskDependency", back_populates="task", foreign_keys="[TaskDependency.task_id]")
    dependent_tasks = relationship("TaskDependency", back_populates="dependent_task", foreign_keys="[TaskDependency.dependent_task_id]")
