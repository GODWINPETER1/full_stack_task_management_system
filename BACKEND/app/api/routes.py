from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import project as crud_project
from app.models.user import User
from app.schemas.project import Project, ProjectCreate
from app.models.task import Task
from app.models.task_tag import TaskTag
from app.api.dependencies import get_current_user
from app.db.session import get_db


router = APIRouter()

# Create a project
@router.post("/", response_model=Project)
def create_project(project: ProjectCreate, current_user: User = Depends(get_current_user) , db: Session = Depends(get_db)):
    return crud_project.create_project(db=db, project=project , user_id = current_user.id)

# Get all projects where the user is assigned to or tagged in at least one task
@router.get("/", response_model=List[Project])
def read_projects(skip: int = 0, limit: int = 10, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Query projects where the user is either assigned or tagged in at least one task
    projects = (
        db.query(Project)
        .join(Task, Project.id == Task.project_id)  # Join Project with Task
        .outerjoin(TaskTag, Task.id == TaskTag.task_id)  # Join Task with TaskTag for tagged tasks
        .filter(
            (Task.assigned_to_id == current_user.id) |  # Assigned tasks
            (TaskTag.user_id == current_user.id)         # Tagged tasks
        )
        .distinct()  # Ensure each project appears only once
        .offset(skip)
        .limit(limit)
        .all()
    )
    return projects


# Get a project by ID
@router.get("/{project_id}", response_model=Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud_project.get_project_by_id(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# Delete a project by ID
@router.delete("/{project_id}", response_model=Project)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud_project.delete_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.put("/{project_id}/reopen", response_model=Project)
def reopen_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.deleted == True).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or already active")
    
    project.deleted = False
    db.commit()
    db.refresh(project)
    return project

@router.get("/deleted", response_model=List[Project])
def get_deleted_projects(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.deleted == True).offset(skip).limit(limit).all()




