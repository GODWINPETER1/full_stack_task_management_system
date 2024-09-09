from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.task import Project, Task
from app.schemas.task import ProjectCreate, Project, TaskCreate, Task
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from typing import List

router = APIRouter()

# Create a project
@router.post("/projects", response_model=Project)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_project = Project(**project.dict(), owner_id=current_user.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# Get all projects for the current user
@router.get("/projects", response_model=List[Project])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Project).filter(Project.owner_id == current_user.id).all()

# Create a task within a project
@router.post("/projects/{project_id}/tasks/", response_model=Task)
def create_task_for_project(project_id: int, task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_task = Task(**task.dict(), project_id=project_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Get tasks for a specific project
@router.get("/tasks/{project_id}/tasks", response_model=List[Task])
def get_tasks_for_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return db.query(Task).filter(Task.project_id == project_id).all()
