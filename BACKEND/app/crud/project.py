from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate

# Create a new project
def create_project(db: Session, project: ProjectCreate):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Get all projects
def get_projects(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Project).offset(skip).limit(limit).all()

# Get a project by ID
def get_project_by_id(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

# Delete a project
def delete_project(db: Session, project_id: int):
    db_project = get_project_by_id(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project
