from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.activity_log import ActivityLog
from app.crud.crud_activity_log import crud_activity_log
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/activity-logs")
def get_activity_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.roles != "Admin":
        logs = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).all()
    else:
        logs = db.query(ActivityLog).all()
    return logs
