from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import project as crud_project
from app.schemas.project import Project, ProjectCreate
from app.db.session import get_db


router = APIRouter()

# Create a project
@router.post("/", response_model=Project)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return crud_project.create_project(db=db, project=project)

# Get all projects
@router.get("/", response_model=List[Project])
def read_projects(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_project.get_projects(db=db, skip=skip, limit=limit)

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


