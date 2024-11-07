from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

# Enums for Task Status and Priority Level
class TaskStatus(str, Enum):
    todo = "To Do"
    in_progress = "In Progress"
    done = "Done"
    
class PriorityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

# Base schema for task data
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.todo  # Default status "To Do"
    due_date: Optional[datetime] = None
    priority: Optional[PriorityLevel] = PriorityLevel.MEDIUM

# Schema for creating a task with dependencies
class TaskCreate(TaskBase):
    dependencies: Optional[List[int]] = []  # New field for dependency IDs

# Schema for updating a task
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None

# Schema for task with dependencies
class Task(TaskBase):
    id: int
    project_id: int
    assigned_to_id: Optional[int]
    dependencies: List['Task'] = []  # Self-referential field for task dependencies

    class Config:
        from_attributes = True
