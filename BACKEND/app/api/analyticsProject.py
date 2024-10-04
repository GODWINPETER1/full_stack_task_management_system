from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.analytics import ProjectAnalyticsResponse
from app.models.project import Project, ProjectStatus
from app.db.session import get_db
from app.models.user import User
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get('/projects', response_model=ProjectAnalyticsResponse)
def get_projects_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """ Get the analytics related to projects for a specific user """
    
    # Count total projects that are not deleted
    total_projects = db.query(Project).filter(
        Project.user_id == current_user.id, 
        Project.deleted == False
    ).count()
    
    # Count active (in progress) projects
    active_projects = db.query(Project).filter(
        Project.user_id == current_user.id, 
        Project.status == ProjectStatus.in_progress, 
        Project.deleted == False
    ).count()
    
    # Count completed projects
    completed_projects = db.query(Project).filter(
        Project.user_id == current_user.id, 
        Project.status == ProjectStatus.completed, 
        Project.deleted == False
    ).count()
    
    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "completed_projects": completed_projects
    }
