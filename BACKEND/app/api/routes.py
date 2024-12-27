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
from app.crud.crud_activity_log import crud_activity_log  # Import CRUD for activity log

router = APIRouter()

# Create a project
@router.post("/", response_model=Project)
def create_project(
    project: ProjectCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    new_project = crud_project.create_project(db=db, project=project, user_id=current_user.id)
    crud_activity_log.create_log(
        db=db,
        user_id=current_user.id,
        action="Created Project",
        details=f"Project ID: {new_project.id}, Title: {new_project.title}"
    )
    return new_project

# Get all projects where the user is assigned to or tagged in at least one task
@router.get("/", response_model=List[Project])
def read_projects(
    skip: int = 0, 
    limit: int = 10, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    projects = (
        db.query(Project)
        .join(Task, Project.id == Task.project_id)
        .outerjoin(TaskTag, Task.id == TaskTag.task_id)
        .filter(
            (Task.assigned_to_id == current_user.id) |
            (TaskTag.user_id == current_user.id)
        )
        .distinct()
        .offset(skip)
        .limit(limit)
        .all()
    )
    return projects

# Get a project by ID
@router.get("/{project_id}", response_model=Project)
def read_project(
    project_id: int, 
    db: Session = Depends(get_db)
):
    db_project = crud_project.get_project_by_id(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# Delete a project by ID
@router.delete("/{project_id}", response_model=Project)
def delete_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_project = crud_project.delete_project(db, project_id=project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    crud_activity_log.create_log(
        db=db,
        user_id=current_user.id,
        action="Deleted Project",
        details=f"Project ID: {db_project.id}, Title: {db_project.title}"
    )
    return db_project

# Reopen a deleted project
@router.put("/{project_id}/reopen", response_model=Project)
def reopen_project(
    project_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id, Project.deleted == True).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or already active")
    
    project.deleted = False
    db.commit()
    db.refresh(project)
    crud_activity_log.create_log(
        db=db,
        user_id=current_user.id,
        action="Reopened Project",
        details=f"Project ID: {project.id}, Title: {project.title}"
    )
    return project

# Get all deleted projects
@router.get("/deleted", response_model=List[Project])
def get_deleted_projects(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    return db.query(Project).filter(Project.deleted == True).offset(skip).limit(limit).all()
