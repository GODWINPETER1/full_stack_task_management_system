from pydantic import BaseModel
from typing import List, Optional
from app.schemas.task import Task

# Project Base Schema
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

# Schema for Creating Projects
class ProjectCreate(ProjectBase):
    pass

# Schema for Returning Project Data
class Project(ProjectBase):
    id: int  # Ensure id is optional and defaults to None
    tasks: List['Task'] = []  # Initialize as an empty list

    class Config:
        from_attributes = True  # Use ORM mapping
