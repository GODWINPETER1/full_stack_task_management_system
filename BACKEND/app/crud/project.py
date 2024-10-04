from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate

# Create a new project
def create_project(db: Session, project: ProjectCreate, user_id: int) -> Project:
    db_project = Project(
        title=project.title,
        description=project.description,
        user_id = user_id  # Assign the user ID here
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Get all projects
# Get all projects for a specific user
def get_projects(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(Project).filter(
        Project.user_id == user_id, 
        Project.deleted == False  # Exclude deleted projects
    ).offset(skip).limit(limit).all()



# Get a project by ID
def get_project_by_id(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

# Delete a project
def delete_project(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        project.deleted = True  # Mark as deleted
        db.commit()
        db.refresh(project)
    return project

