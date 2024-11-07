from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.analytics import TaskAnalyticsResponse
from app.models.task import Task
from app.db.session import get_db
from app.models.user import User
from app.api.dependencies import get_current_user

router = APIRouter()

# Get task-related analytics
@router.get("/tasks", response_model=TaskAnalyticsResponse)
def get_task_analytics(current_user: User = Depends(get_current_user) , db: Session = Depends(get_db)):
    """ Get the analytics related to tasks for a specific user """
    
    # Fetch tasks assigned to the user
    total_tasks = db.query(Task).filter(Task.assigned_to_id == current_user.id).count()
    completed_tasks = db.query(Task).filter(Task.assigned_to_id == current_user.id, Task.status == 'Done').count()
    
    # Calculate task progress or percentage
    task_progress = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "task_progress": task_progress
    }
