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
    # dependencies field 
    dependencies = relationship("Task" , secondary="task_dependencies" , primaryjoin="Task.id == task_dependencies.c.task_id", secondaryjoin="Task.id == task_dependencies.c.dependent_task_id" , backref="dependent_tasks")

task_dependencies = Table(
    "task_dependencies",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
    Column("dependent_task_id", Integer, ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True)
)

Task.dependencies = relationship(
    "Task",
    secondary=task_dependencies,
    primaryjoin=Task.id == task_dependencies.c.task_id,
    secondaryjoin=Task.id == task_dependencies.c.dependent_task_id,
    backref="dependent_tasks"
)
