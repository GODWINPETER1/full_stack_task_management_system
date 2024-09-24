from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class TaskStatus(str , Enum):
    todo = "To Do"
    in_progress = "In Progress"
    done = "Done"

# Task Schema
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.todo  # Default status "To Do"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None

class Task(TaskBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
