from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.notification import Notification as NotificationSchema
from app.models.notification import Notification  # Make sure the Notification model exists
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/notifications", response_model=List[NotificationSchema])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Ensures only authenticated users access
):
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).all()
    return notifications

