from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Task Schema
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "To Do"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True

# Project Schema
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    tasks: List[Task] = []

    class Config:
        orm_mode = True
